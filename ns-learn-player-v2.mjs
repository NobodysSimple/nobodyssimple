/**
 * Public interactive course player. Also mounts the staff preview without
 * recording completions. Question content is always escaped; never raw HTML.
 */
import {getLearnContent} from './ns-learn-content-v2.mjs';
import {getLearnCourse,LEARN_COMPANIONS} from './ns-learn-catalog-v2.mjs';
import {validateLearnBundle,gradeLearnItem,learnLessonScore,flattenLearnLessons,QUESTION_TYPES} from './ns-learn-engine-v2.mjs';
import {learningNodes,safeCourseImage} from './ns-course-lab-schema.mjs';
import {renderDialogue} from './ns-learn-dialogue.mjs';
import {renderInvestigation} from './ns-learn-investigation.mjs?v=case-reasoning-20261120';
import {displayedLessonMinutes,lessonMetrics} from './ns-learn-quality.mjs?v=case-reasoning-20261120';
import {lessonResearchMarkup} from './ns-learn-evidence.mjs?v=case-reasoning-20261120';
import {createRepairQueue,addRepair,takeRepair,finishRepair,repairSummary,readSoundPreference,saveSoundPreference,playLearningCue,correctAnswerText} from './ns-learn-feedback.mjs';
import {isLifeNode,lifeNodeMode,lifeNodeDefinition,lifeControls} from './ns-life-node-types.mjs?v=narcissism-audit-20261119';
import {knownCastForLesson,charactersMentioned,characterPortrait} from './ns-learn-cast.mjs';
import {saveLearnCompletion,saveLearnReview} from './ns-learn-progress-v2.mjs?v=case-reasoning-20261120';
const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
const opt=(id,label)=>'<option value="'+esc(id)+'">'+esc(label)+'</option>';
const inline=value=>esc(value).replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>').replace(/(^|[^*])\*([^*]+)\*/g,'$1<em>$2</em>');
const paragraphs=value=>String(value||'').split(/\n\s*\n/).filter(Boolean).map(block=>{
 const lines=block.split('\n');
 if(lines.every(x=>/^\s*[-*]\s+/.test(x)))return '<ul>'+lines.map(x=>'<li>'+inline(x.replace(/^\s*[-*]\s+/,''))+'</li>').join('')+'</ul>';
 if(lines.length===1&&/^#{1,3}\s+/.test(lines[0]))return '<h2>'+inline(lines[0].replace(/^#{1,3}\s+/,''))+'</h2>';
 return '<p>'+lines.map(inline).join('<br>')+'</p>';
}).join('');
const photo=node=>safeCourseImage(node.image)?'<figure class="ns-learn-player__figure"><img src="'+esc(node.image)+'" alt="'+esc(node.alt||'')+'" loading="lazy">'+(node.caption?'<figcaption>'+esc(node.caption)+'</figcaption>':'')+'</figure>':'';
const fieldset=(name,options,selected='',disabled=false)=>'<fieldset class="ns-learn-player__choices"><legend class="sr-only">'+esc(name)+'</legend>'+options.map(o=>'<label><input type="radio" name="'+esc(name)+'" value="'+esc(o.id)+'"'+(o.id===selected?' checked':'')+(disabled?' disabled':'')+'><span>'+esc(o.label)+'</span></label>').join('')+'</fieldset>';
export function publishedLearnBundle(id){
 const c=getLearnCourse(id),b=getLearnContent(id);
 return c&&b&&!validateLearnBundle(b,id).length?b:null;
}
export function renderLearnLesson(root,courseId,lessonId,{review=false,bundleOverride=null,preview=false}={}){
 const bundle=bundleOverride||publishedLearnBundle(courseId),course=getLearnCourse(courseId);
 const lesson=bundle&&flattenLearnLessons(bundle).find(l=>l.id===lessonId);
 const home='#learn/course/'+encodeURIComponent(courseId);
 const unitIndex=Math.max(1,(bundle?.modules||[]).findIndex(m=>(m.lessons||[]).some(l=>l.id===lessonId))+1);
 if(!lesson){root.innerHTML='<section class="ns-learn-player"><a href="'+home+'">← Back to course</a><h1>No published lesson found</h1><p>This course has no available lesson at that address.</p></section>';return;}
 const scramble=items=>{
  const result=[...(items||[])];
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
  return result;
 };
 const arrange=source=>{
  const ordered=[];let cursor=0;
  while(cursor<source.length){
   if(source[cursor]?.shuffleGroup){
    const group=source[cursor].shuffleGroup;const chunk=[];
    while(cursor<source.length&&source[cursor]?.shuffleGroup===group)chunk.push(source[cursor++]);
    ordered.push(...scramble(chunk));
   }else ordered.push(source[cursor++]);
  }
  return ordered;
 };
 const activeUnit=(bundle?.modules||[]).find(m=>(m.lessons||[]).some(l=>l.id===lessonId));
 const glossary=[...(Array.isArray(activeUnit?.glossary)?activeUnit.glossary:[]),...(Array.isArray(lesson.glossary)?lesson.glossary:[])].filter(x=>x&&typeof x.term==='string'&&typeof x.definition==='string');
 const glossaryHelp=glossary.length?'<details class="ns-learn-immersive__glossary"><summary>New word? Open quick definitions</summary><dl>'+glossary.map(item=>'<div><dt>'+esc(item.term)+'</dt><dd>'+esc(item.definition)+'</dd></div>').join('')+'</dl></details>':'';
 const cast=knownCastForLesson(bundle,lesson);
 const castMarkup=names=>names.length?'<div class="ns-learn-immersive__cast" aria-label="People in this example">'+names.map(name=>'<span class="ns-learn-immersive__cast-person">'+characterPortrait(name,cast,esc,true)+'<span>'+esc(name)+'</span></span>').join('')+'</div>':'';
 const originalNodes=learningNodes(lesson);
 let nodes=arrange(originalNodes);
 const state={phase:'intro',i:0,answers:{},checked:null,notice:'',order:[],labels:new Set(),dialogueCheck:-1,dialogueVisible:1,lifeFrame:0,lifeVisited:new Set(),lifeTargeted:false,lifeInitial:'',lifeRevealed:false,lifeChoice:'',lifeSort:{},lifeBefore:0,lifeAfter:0,investigationStage:0,investigationChoice:'',investigationFocus:'',investigationOpened:{},investigationNotes:{},investigationRoutes:{},investigationLoopSteps:{},saved:false,options:new Map(),repairs:createRepairQueue(),correcting:false,repairTask:null,soundOn:readSoundPreference()};
 const orderedOptions=(name,items)=>{
  const key=name+':'+(items||[]).map(x=>x.id).join('/');
  if(!state.options.has(key))state.options.set(key,scramble(items));
  return state.options.get(key);
 };
 const choiceSet=(name,items,selected='',disabled=false)=>{
   // Four focused choices at most; the authored best answer must always remain.
   const node=nodes[state.i],check=node?.type==='dialogue'?node.checks?.[state.dialogueCheck]:null;
   const correct=name==='dialogue-choice'?check?.answer:name==='choice'?node?.answer:null;
   const eligible=Array.isArray(items)?items:[];
   const groupKey=name+':'+eligible.map(x=>x.id).join('/');
   if(!state.options.has(groupKey)){
    const pool=eligible.length>4&&correct&&eligible.some(x=>x.id===correct)?
     [eligible.find(x=>x.id===correct),...scramble(eligible.filter(x=>x.id!==correct)).slice(0,3)]:eligible;
    state.options.set(groupKey,scramble(pool));
   }
   return fieldset(name,state.options.get(groupKey),selected,disabled);
  };
 const current=()=>nodes[state.i];
 function renderControls(node){
  if(isLifeNode(node.type)){
   // Life-node choices must not always appear in the authored order (in the
   // three redesigned courses the first authored option is often the key).
   const key='life:'+node.id;
   if(!state.options.has(key))state.options.set(key,scramble(node.options||[]));
   return lifeControls({...node,options:state.options.get(key)},state);
  }
  if(['choose','respond','repair','investigate','update','perspective'].includes(node.type)){
   const extra=node.type==='update'?'<div class="ns-learn-player__new-evidence"><strong>New evidence</strong><p>'+esc(node.newEvidence)+'</p></div>':node.type==='perspective'?'<div class="ns-learn-player__viewpoints"><div><strong>View A</strong><p>'+esc(node.viewA)+'</p></div><div><strong>View B</strong><p>'+esc(node.viewB)+'</p></div></div>':'';
   return extra+choiceSet('choice',node.options,state.checked?state.answers[node.id]||'':'',!!state.checked);
  }
  if(node.type==='complete')return '<label class="ns-learn-player__label">Your answer<input name="recall" type="text" maxlength="180" autocomplete="off" placeholder="'+esc(node.hint||'Type your answer')+'"></label>';
  if(node.type==='match'||node.type==='sort'){
   const list=node.type==='match'?node.pairs:node.items;
   const choices=node.type==='match'?node.pairs.map(p=>({id:p.answer,label:p.answer})):node.categories;
   if(node.type==='match'&&choices.length>1)choices.push(choices.shift());
   return '<div class="ns-learn-player__pairs">'+list.map(p=>'<label><strong>'+esc(p.label)+'</strong><select data-pair="'+esc(p.id)+'"><option value="">Select…</option>'+choices.map(o=>opt(o.id,o.label)).join('')+'</select></label>').join('')+'</div>';
  }
  if(['sequence','chain','rank'].includes(node.type))return '<div class="ns-learn-player__ordering">'+state.order.map((id,i)=>{const s=node.steps.find(x=>x.id===id);return '<div class="ns-learn-player__order"><span>'+esc(s?.label||id)+'</span><div><button type="button" data-move="'+i+'" data-dir="-1" '+(i===0?'disabled':'')+' aria-label="Move item up">↑</button><button type="button" data-move="'+i+'" data-dir="1" '+(i===state.order.length-1?'disabled':'')+' aria-label="Move item down">↓</button></div></div>';}).join('')+'</div>';
  if(node.type==='label')return '<div class="ns-learn-player__segments" role="group" aria-label="Select evidence phrases">'+node.segments.map(s=>'<button type="button" data-segment="'+esc(s.id)+'" aria-pressed="'+state.labels.has(s.id)+'">'+esc(s.text)+'</button>').join(' ')+'</div>';
  if(node.type==='predict')return '<div class="ns-learn-player__two"><h2>'+esc(node.changePrompt||'What changes?')+'</h2>'+choiceSet('change',node.changes)+'<h2>What is the best prediction?</h2>'+choiceSet('outcome',node.outcomes)+'</div>';
  if(node.type==='character')return '<div class="ns-learn-player__two"><p>'+esc(node.characterName)+': '+esc(node.scenario)+'</p><h2>What does the evidence support?</h2>'+choiceSet('evidence',node.evidenceOptions)+'<h2>What response fits best?</h2>'+choiceSet('action',node.responseOptions)+'</div>';
  if(node.type==='dialogue')return renderDialogue(node,state.correcting?{...state,answers:{}}:state,esc,choiceSet);
  if(node.type==='investigation')return renderInvestigation(node,state.correcting?{...state,answers:{}}:state,esc,choiceSet);
  return '';
 }
 function response(node){
  if(isLifeNode(node.type)){
   const mode=lifeNodeMode(node.type);
   if(mode==='edit'&&!state.lifeTargeted)return null;
   if(mode==='hotspot'&&state.lifeVisited.size<1)return null;
   if(['timeline','switch','judgement'].includes(mode)&&state.lifeVisited.size<2)return null;
   if(mode==='sort')return Object.fromEntries([...root.querySelectorAll('[data-life-sort]')].map(x=>[x.dataset.lifeSort,x.value]));
   if(mode==='dial')return state.lifeRevealed?{before:Number(state.lifeBefore),after:Number(state.lifeAfter)}:null;
   if(mode==='reveal'&&!state.lifeRevealed)return null;
   return root.querySelector('input[name="life-choice"]:checked')?.value||state.lifeChoice||null;
  }
  if(['choose','respond','repair','investigate','update','perspective'].includes(node.type))return root.querySelector('input[name="choice"]:checked')?.value||null;
  if(node.type==='complete')return root.querySelector('input[name="recall"]')?.value||'';
  if(['match','sort'].includes(node.type))return Object.fromEntries([...root.querySelectorAll('[data-pair]')].map(x=>[x.dataset.pair,x.value]));
  if(['sequence','chain','rank'].includes(node.type))return [...state.order];
  if(node.type==='label')return [...state.labels];
  if(node.type==='predict')return {change:root.querySelector('input[name="change"]:checked')?.value||'',outcome:root.querySelector('input[name="outcome"]:checked')?.value||''};
  if(node.type==='character')return {evidence:root.querySelector('input[name="evidence"]:checked')?.value||'',action:root.querySelector('input[name="action"]:checked')?.value||''};
  if(['dialogue','investigation'].includes(node.type))return root.querySelector('input[name="dialogue-choice"]:checked')?.value||'';
 }
 const reset=()=>{state.checked=null;state.notice='';state.labels=new Set();state.dialogueCheck=-1;state.dialogueVisible=1;state.lifeFrame=0;state.lifeVisited=new Set();state.lifeTargeted=false;state.investigationStage=0;state.investigationChoice='';state.investigationFocus='';state.investigationOpened={};state.investigationNotes={};state.investigationRoutes={};state.investigationLoopSteps={};state.lifeInitial='';state.lifeRevealed=false;state.lifeChoice='';state.lifeSort={};const node=current();state.lifeBefore=Number(node?.initialValue??80);state.lifeAfter=state.lifeBefore;const ids=['sequence','chain','rank'].includes(node?.type)?node.steps.map(s=>s.id):[];state.order=scramble(ids);if(ids.length>1&&ids.every((id,i)=>state.order[i]===id))state.order.reverse();};
 const beginNextCorrection=()=>{
   const task=takeRepair(state.repairs);
   if(!task){state.correcting=false;state.repairTask=null;state.phase='done';return;}
   state.correcting=true;state.repairTask=task;state.i=task.nodeIndex;reset();
   const node=current();
   if(['dialogue','investigation'].includes(node?.type)){state.dialogueCheck=task.checkIndex;state.dialogueVisible=(node.turns||[]).length;}
  };
  const advance=()=>{
   if(state.correcting||state.i+1>=nodes.length)beginNextCorrection();
   else {state.i++;reset();}
   paint();
  };
  const recordResult=(correct,checkIndex=null)=>{
   playLearningCue(correct,state.soundOn);
   if(state.correcting)finishRepair(state.repairs,state.repairTask,correct);
   else if(!correct)addRepair(state.repairs,state.i,checkIndex);
  };
 function paint(){
  const guide=LEARN_COMPANIONS[courseId];
  const companion=course?.companionPortrait
   ?'<img class="ns-learn-immersive__portrait-img" src="'+esc(course.mascot)+'" alt="">'
   :'<span class="ns-learn-immersive__portrait" style="--cast-x:'+Number(guide?.x||0)+'%;--cast-y:'+Number(guide?.y||0)+'%"></span>';
  const exit=preview?'<button type="button" class="ns-learn-player__back" data-close-lesson aria-label="Close lesson preview">×</button>':
   '<a class="ns-learn-player__back" href="'+home+'" aria-label="Exit lesson">×</a>';
  const progress=state.phase==='done'?100:state.phase==='intro'?0:state.correcting?95:Math.min(92,Math.round(state.i/nodes.length*92));
  const head='<header class="ns-learn-immersive__header">'+exit+'<div class="ns-learn-immersive__meter" role="progressbar" aria-valuenow="'+progress+'" aria-valuemin="0" aria-valuemax="100" aria-label="Lesson progress"><i style="width:'+progress+'%"></i></div><button type="button" class="ns-learn-player__sound-toggle" data-sound-toggle aria-label="'+(state.soundOn?'Mute':'Enable')+' answer sounds" aria-pressed="'+state.soundOn+'" title="'+(state.soundOn?'Mute':'Enable')+' feedback sounds">'+(state.soundOn?'♪':'♪̸')+'</button><span class="ns-learn-immersive__badge" title="Nobody’s Simple">✿</span></header>';
  let middle='',foot='';
  if(state.phase==='intro'){
   middle='<div class="ns-learn-immersive__welcome"><span class="ns-learn-immersive__welcome-art">'+companion+'</span><p class="ns-learn-player__eyebrow">'+esc(course?.title||bundle.title||courseId)+' · Unit '+unitIndex+'</p><h1>'+esc(lesson.title)+'</h1><div class="ns-learn-immersive__lead">'+castMarkup(charactersMentioned({body:lesson.teach},cast))+paragraphs(String(lesson.teach||'Work through a real situation and decide what the evidence can support.').replace(/\s*About (?:five|5) minutes\.?/gi,'').trim())+'</div><p class="ns-learn-player__hint">About '+displayedLessonMinutes(lesson)+' minutes · '+lessonMetrics(lesson).drills+' practice checks · No timer</p></div>';
   foot='<button type="button" class="ns-learn-player__primary" data-start>Start lesson →</button>';
  }else if(state.phase==='done'){
   const score={...learnLessonScore(lesson,state.answers),corrections:repairSummary(state.repairs)};
   const practice=repairSummary(state.repairs);
   middle='<div class="ns-learn-immersive__welcome"><span class="ns-learn-immersive__welcome-art">'+companion+'</span><p class="ns-learn-player__eyebrow">LESSON COMPLETE ✿</p><h1>'+esc(lesson.title)+'</h1><p>You answered '+score.total+' challenges. '+score.correct+' were correct first time.</p>'+(practice.missed?'<p class="ns-learn-player__mastery">You revisited '+practice.retried+' missed '+(practice.retried===1?'question':'questions')+' and corrected '+practice.recovered+'. '+(practice.stillToReview?'Keep '+practice.stillToReview+' on your review list.':'Every missed question was corrected on the second attempt.')+'</p>':'<p class="ns-learn-player__mastery">No corrections needed this time.</p>')+(lesson.takeaway?'<div class="ns-learn-player__takeaway"><strong>Worth remembering</strong><p>'+esc(lesson.takeaway)+'</p></div>':'')+lessonResearchMarkup(lesson,esc)+'<p class="ns-learn-immersive__reflect">The aim is to understand why an explanation fits the evidence, and when you would need to revise it.</p><p role="status" data-save></p></div>';
   foot=preview?'<button class="ns-learn-player__primary" type="button" data-restart>Try again</button>':'<a class="ns-learn-player__primary" href="'+home+'">Back to course →</a>';
  }else{
   const node=current(),read=['read','image'].includes(node.type),checked=!!state.checked;
   const heading=node.title||node.prompt||'Learning activity';
    const correctionLabel=state.correcting?'<p class="ns-learn-player__retry-intro" role="note">CORRECTION PRACTICE · You saw this question earlier. Use what you learned before trying again.</p>':'';
   const hideRevealQuestion=isLifeNode(node.type)&&lifeNodeMode(node.type)==='reveal'&&!state.lifeRevealed;
   const promptLine=!read&&!hideRevealQuestion&&node.title&&node.prompt&&node.title!==node.prompt?'<p class="ns-learn-player__question-prompt">'+esc(node.prompt)+'</p>':'';
   const faces=['dialogue','investigation'].includes(node.type)?'':castMarkup(charactersMentioned(node,cast));
   // An unrelated course illustration cannot stand in for visual evidence in a case.
   const lifeArt='';
   const body=read?'<div class="ns-learn-player__reading">'+(node.type==='read'?paragraphs(node.body):'')+photo(node)+'</div>':promptLine+photo(node)+lifeArt+renderControls(node);
   const notice=state.notice?'<p class="ns-learn-player__notice" role="alert">'+esc(state.notice)+'</p>':'';
   const answerLabel=checked&&!state.checked.correct?correctAnswerText(node,['dialogue','investigation'].includes(node.type)?node.checks?.[state.dialogueCheck]:null):'';
    const response=checked?'<div class="ns-learn-player__feedback ns-learn-player__feedback--'+(state.checked.correct?'correct':'incorrect')+'" data-result="'+(state.checked.correct?'correct':'incorrect')+'" role="status"><strong>'+(state.checked.correct?'✓ Correct.':'✕ Not quite. Review the reasoning.')+'</strong>'+(answerLabel?'<p><strong>Best-supported answer:</strong> '+esc(answerLabel)+'</p>':'')+paragraphs(state.checked.explanation)+(state.checked.counterexample?'<p><small>Where this may differ: '+esc(state.checked.counterexample)+'</small></p>':'')+(state.checked.reply?'<div class="ns-learn-player__branch"><strong>'+esc(node.speakerB||'Possible reply')+'</strong><p>'+esc(state.checked.reply)+'</p>'+(state.checked.consequence?'<small>'+esc(state.checked.consequence)+'</small>':'')+'</div>':'')+'</div>':'';
   middle='<div class="ns-learn-immersive__task"><p class="ns-learn-player__eyebrow">'+esc(node.type==='investigation'?'MESSAGE INVESTIGATION':node.type==='dialogue'?'CONVERSATION':isLifeNode(node.type)?lifeNodeDefinition(node.type).name.toUpperCase():node.type.toUpperCase())+' · '+(state.i+1)+' / '+nodes.length+'</p><h1>'+esc(heading)+'</h1>'+correctionLabel+faces+(glossary.some(entry=>JSON.stringify(node).toLowerCase().includes(entry.term.toLowerCase()))?glossaryHelp:'')+body+notice+response+'</div>';
   if(!(node.type==='dialogue'&&state.dialogueCheck<0&&state.dialogueVisible<(node.turns||[]).length)){
    const buttonText=['dialogue','investigation'].includes(node.type)&&state.dialogueCheck<0?'Apply your reasoning →':
     ['dialogue','investigation'].includes(node.type)&&checked&&!state.correcting&&state.dialogueCheck<(node.checks?.length||0)-1?'Next question →':
     read||checked?(state.correcting?'Continue correction practice →':state.i+1===nodes.length?(state.repairs.pending.length?'Review missed questions →':'Complete lesson →'):'Continue →'):'Check answer';
    foot='<button type="button" class="ns-learn-player__primary" data-next>'+buttonText+'</button>';
   }else foot='<p class="ns-learn-immersive__helper">Read one message at a time. You can open the earlier messages whenever you need them.</p>';
  }
  root.innerHTML='<section class="ns-learn-player ns-learn-player--immersive" data-immersive><div class="ns-learn-immersive__surface" role="region" aria-label="Focused learning lesson">'+head+'<div class="ns-learn-immersive__content">'+middle+'</div><footer class="ns-learn-immersive__footer">'+foot+'</footer></div><span class="ns-learn-immersive__decoration" aria-hidden="true">✳</span></section>';
  if(state.phase==='done'){
   const score={...learnLessonScore(lesson,state.answers),corrections:repairSummary(state.repairs)};
   if(!preview&&!state.saved){state.saved=true;const result=review?saveLearnReview(bundle,lesson,score):saveLearnCompletion(bundle,lesson,score);root.querySelector('[data-save]').textContent=result.ok?(review?'Review saved.':'Progress saved.'):'Unable to save progress: '+result.error;}
   else if(preview)root.querySelector('[data-save]').textContent='Staff preview · No progress saved.';
  }
  wire();
  // Feedback cannot hide the permanently visible action row at any zoom.
  if(state.checked){
   const feedback=root.querySelector('.ns-learn-player__feedback');
   if(feedback){feedback.tabIndex=-1;feedback.focus({preventScroll:true});}
   const column=root.querySelector('.ns-learn-immersive__content');
   if(column)column.scrollTop=column.scrollHeight;
  }
  if(state.phase==='node'&&current()?.type==='dialogue'){
   const transcript=root.querySelector('[data-dialogue-scroll]');
   if(transcript)transcript.scrollTop=transcript.scrollHeight;
  }
 }
 function wire(){
  root.querySelector('[data-sound-toggle]')?.addEventListener('click',()=>{state.soundOn=!state.soundOn;saveSoundPreference(state.soundOn);paint();});
  root.querySelectorAll('input[name="dialogue-choice"]').forEach(input=>input.addEventListener('change',()=>{state.investigationChoice=input.value;}));
  root.querySelectorAll('[data-investigation-stage]').forEach(button=>button.addEventListener('click',()=>{
    state.investigationStage=Number(button.dataset.investigationStage);state.investigationFocus='';
    paint();root.querySelector('.ns-inquiry__analysis h2')?.setAttribute('tabindex','-1');
    root.querySelector('.ns-inquiry__analysis h2')?.focus({preventScroll:true});
   }));
   root.querySelectorAll('[data-investigation-turn]').forEach(button=>button.addEventListener('click',()=>{
    state.investigationFocus=button.dataset.investigationTurn;paint();
    root.querySelector('[data-investigation-turn="'+state.investigationFocus+'"]')?.focus({preventScroll:true});
   }));
   root.querySelector('[data-investigation-note]')?.addEventListener('input',event=>{
    state.investigationNotes[state.investigationStage]=event.target.value;
   });
   root.querySelector('[data-investigation-open]')?.addEventListener('click',()=>{
    state.investigationOpened[state.investigationStage]=true;paint();
    root.querySelector('.ns-inquiry__revealed h3')?.setAttribute('tabindex','-1');
    root.querySelector('.ns-inquiry__revealed h3')?.focus({preventScroll:true});
   });
   root.querySelectorAll('[data-investigation-route]').forEach(button=>button.addEventListener('click',()=>{
    state.investigationRoutes[state.investigationStage]=Number(button.dataset.investigationRoute);
    paint();root.querySelector('[data-investigation-route="'+state.investigationRoutes[state.investigationStage]+'"]')?.focus({preventScroll:true});
   }));
   root.querySelector('[data-investigation-loop-next]')?.addEventListener('click',()=>{
    state.investigationLoopSteps[state.investigationStage]=Math.min(5,(state.investigationLoopSteps[state.investigationStage]||1)+1);
    paint();(root.querySelector('[data-investigation-loop-next]')||root.querySelector('.ns-inquiry__loop-end'))?.focus({preventScroll:true});
   });
  root.querySelector('[data-life-target]')?.addEventListener('click',()=>{state.lifeTargeted=true;paint();});
  root.querySelectorAll('[data-life-frame]').forEach(button=>button.addEventListener('click',()=>{
   state.lifeFrame=Number(button.dataset.lifeFrame);state.lifeVisited.add(state.lifeFrame);paint();
  }));

  root.querySelectorAll('input[name="life-choice"]').forEach(input=>input.addEventListener('change',()=>{
   state.lifeChoice=input.value;if(lifeNodeMode(current()?.type)==='edit')paint();
  }));
  root.querySelectorAll('[data-life-sort]').forEach(select=>select.addEventListener('change',()=>{
   state.lifeSort[select.dataset.lifeSort]=select.value;
  }));
  root.querySelectorAll('[data-life-slider]').forEach(slider=>slider.addEventListener('input',()=>{
   const v=Number(slider.value);
   if(slider.dataset.lifeSlider==='before')state.lifeBefore=v;else state.lifeAfter=v;
   const output=slider.parentElement?.querySelector('output');if(output)output.textContent=v+'%';
  }));
  root.querySelector('[data-life-reveal]')?.addEventListener('click',()=>{
   state.lifeRevealed=true;state.lifeAfter=state.lifeBefore;paint();
  });
  root.querySelector('[data-dialogue-reveal]')?.addEventListener('click',()=>{
   const node=current();if(node?.type!=='dialogue')return;
   state.dialogueVisible=Math.min((node.turns||[]).length,state.dialogueVisible+1);
   paint();
   const transcript=root.querySelector('[data-dialogue-scroll]');
   if(transcript)transcript.scrollTop=transcript.scrollHeight;
   (root.querySelector('[data-dialogue-reveal]')||root.querySelector('[data-next]'))?.focus();
  });
  root.querySelector('[data-start]')?.addEventListener('click',()=>{state.phase='node';state.i=0;reset();paint();});
  root.querySelector('[data-close-lesson]')?.addEventListener('click',()=>root.closest('#cl-preview')?.querySelector('[data-act="close-preview"]')?.click());
  root.querySelector('[data-restart]')?.addEventListener('click',()=>{state.phase='intro';state.i=0;state.answers={};state.options=new Map();state.saved=false;state.repairs=createRepairQueue();state.correcting=false;state.repairTask=null;nodes=arrange(originalNodes);paint();});
  root.querySelectorAll('[data-segment]').forEach(button=>button.addEventListener('click',()=>{if(state.checked)return;const id=button.dataset.segment;if(state.labels.has(id))state.labels.delete(id);else state.labels.add(id);button.setAttribute('aria-pressed',String(state.labels.has(id)));}));
  root.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('click',()=>{if(state.checked)return;const a=Number(button.dataset.move),b=a+Number(button.dataset.dir);if(b<0||b>=state.order.length)return;[state.order[a],state.order[b]]=[state.order[b],state.order[a]];paint();root.querySelector('[data-move="'+b+'"][data-dir="'+button.dataset.dir+'"]')?.focus();}));
  root.querySelector('[data-next]')?.addEventListener('click',()=>{
   const node=current();
   if(['dialogue','investigation'].includes(node.type)){
    if(state.dialogueCheck<0){if(node.type==='dialogue'&&state.dialogueVisible<(node.turns||[]).length)return;state.dialogueCheck=0;state.investigationChoice='';state.notice='';paint();return;}
    if(state.checked){if(state.correcting){advance();return;}if(state.dialogueCheck<node.checks.length-1){state.dialogueCheck++;state.investigationChoice='';state.checked=null;state.notice='';paint();}else advance();return;}
    const check=node.checks[state.dialogueCheck],answer=response(node);
    if(!check.options.some(o=>o.id===answer)){
     const notice=root.querySelector('.ns-learn-player__notice');if(notice)notice.textContent='Choose an answer before checking.';else root.querySelector('[data-next]').insertAdjacentHTML('beforebegin','<p class="ns-learn-player__notice" role="alert">Choose an answer before checking.</p>');return;
    }
    if(!state.correcting&&!state.answers[node.id])state.answers[node.id]={};
    if(!state.correcting)state.answers[node.id][check.id]=answer;
    state.investigationChoice=answer;const chosen=check.options.find(o=>o.id===answer);state.checked={correct:answer===check.answer,explanation:(chosen?.feedback?chosen.feedback+'\n\n':'')+check.explanation,counterexample:check.counterexample,reply:chosen?.reply||'',consequence:chosen?.consequence||''};recordResult(state.checked.correct,state.dialogueCheck);paint();return;
   }
   if(['read','image'].includes(node.type)||state.checked){advance();return;}
   const answer=response(node),result=gradeLearnItem(node,answer);
   if(!result.valid){const notice=root.querySelector('.ns-learn-player__notice');if(notice)notice.textContent='Complete the activity before checking.';else root.querySelector('[data-next]').insertAdjacentHTML('beforebegin','<p class="ns-learn-player__notice" role="alert">Complete the activity before checking.</p>');return;}
   if(!state.correcting)state.answers[node.id]=answer;state.checked=result;recordResult(result.correct);paint();
  });
 }
 paint();
}
