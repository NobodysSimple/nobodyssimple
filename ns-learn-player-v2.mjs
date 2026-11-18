/**
 * Public interactive course player. Also mounts the staff preview without
 * recording completions. Question content is always escaped; never raw HTML.
 */
import {getLearnContent} from './ns-learn-content-v2.mjs';
import {getLearnCourse} from './ns-learn-catalog-v2.mjs';
import {validateLearnBundle,gradeLearnItem,learnLessonScore,flattenLearnLessons,QUESTION_TYPES} from './ns-learn-engine-v2.mjs';
import {learningNodes,safeCourseImage} from './ns-course-lab-schema.mjs';
import {renderDialogue} from './ns-learn-dialogue.mjs';
import {saveLearnCompletion,saveLearnReview} from './ns-learn-progress-v2.mjs';
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
 const originalNodes=learningNodes(lesson);
 let nodes=arrange(originalNodes);
 const state={phase:'intro',i:0,answers:{},checked:null,notice:'',order:[],labels:new Set(),dialogueCheck:-1,dialogueVisible:1,saved:false,options:new Map()};
 const orderedOptions=(name,items)=>{
  const key=name+':'+(items||[]).map(x=>x.id).join('/');
  if(!state.options.has(key))state.options.set(key,scramble(items));
  return state.options.get(key);
 };
 const choiceSet=(name,items,selected='',disabled=false)=>fieldset(name,orderedOptions(name,items),selected,disabled);
 const current=()=>nodes[state.i];
 function renderControls(node){
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
  if(node.type==='dialogue')return renderDialogue(node,state,esc,choiceSet);
  return '';
 }
 function response(node){
  if(['choose','respond','repair','investigate','update','perspective'].includes(node.type))return root.querySelector('input[name="choice"]:checked')?.value||null;
  if(node.type==='complete')return root.querySelector('input[name="recall"]')?.value||'';
  if(['match','sort'].includes(node.type))return Object.fromEntries([...root.querySelectorAll('[data-pair]')].map(x=>[x.dataset.pair,x.value]));
  if(['sequence','chain','rank'].includes(node.type))return [...state.order];
  if(node.type==='label')return [...state.labels];
  if(node.type==='predict')return {change:root.querySelector('input[name="change"]:checked')?.value||'',outcome:root.querySelector('input[name="outcome"]:checked')?.value||''};
  if(node.type==='character')return {evidence:root.querySelector('input[name="evidence"]:checked')?.value||'',action:root.querySelector('input[name="action"]:checked')?.value||''};
  if(node.type==='dialogue')return root.querySelector('input[name="dialogue-choice"]:checked')?.value||'';
 }
 const reset=()=>{state.checked=null;state.notice='';state.labels=new Set();state.dialogueCheck=-1;state.dialogueVisible=1;const node=current();const ids=['sequence','chain','rank'].includes(node?.type)?node.steps.map(s=>s.id):[];state.order=scramble(ids);if(ids.length>1&&ids.every((id,i)=>state.order[i]===id))state.order.reverse();};
 const advance=()=>{if(state.i+1>=nodes.length)state.phase='done';else {state.i++;reset();}paint();};
 function paint(){
  const companion=course?.companionPortrait
   ?'<img class="ns-learn-immersive__portrait-img" src="'+esc(course.mascot)+'" alt="">'
   :'<span class="ns-learn-immersive__portrait" style="--cast-x:'+Number(course?.companionX||0)+'%;--cast-y:'+Number(course?.companionY||0)+'%"></span>';
  const exit=preview?'<button type="button" class="ns-learn-player__back" data-close-lesson aria-label="Close lesson preview">×</button>':
   '<a class="ns-learn-player__back" href="'+home+'" aria-label="Exit lesson">×</a>';
  const progress=state.phase==='done'?100:state.phase==='intro'?0:Math.round(state.i/nodes.length*100);
  const head='<header class="ns-learn-immersive__header">'+exit+'<div class="ns-learn-immersive__meter" role="progressbar" aria-valuenow="'+progress+'" aria-valuemin="0" aria-valuemax="100" aria-label="Lesson progress"><i style="width:'+progress+'%"></i></div><span class="ns-learn-immersive__badge" title="Nobody’s Simple">✿</span></header>';
  let middle='',foot='';
  if(state.phase==='intro'){
   middle='<div class="ns-learn-immersive__welcome"><span class="ns-learn-immersive__welcome-art">'+companion+'</span><p class="ns-learn-player__eyebrow">'+esc(course?.title||bundle.title||courseId)+' · Unit 1</p><h1>'+esc(lesson.title)+'</h1><div class="ns-learn-immersive__lead">'+paragraphs(lesson.teach||'Work through a real situation and decide what the evidence can support.')+'</div><p class="ns-learn-player__hint">About 5 minutes · '+nodes.length+' short activities · No timer</p></div>';
   foot='<button type="button" class="ns-learn-player__primary" data-start>Start lesson →</button>';
  }else if(state.phase==='done'){
   const score=learnLessonScore(lesson,state.answers);
   middle='<div class="ns-learn-immersive__welcome"><span class="ns-learn-immersive__welcome-art">'+companion+'</span><p class="ns-learn-player__eyebrow">LESSON COMPLETE ✿</p><h1>'+esc(lesson.title)+'</h1><p>You finished '+score.total+' reasoning challenges. '+score.correct+' were the strongest supported answers on your first attempt.</p>'+(lesson.takeaway?'<div class="ns-learn-player__takeaway"><strong>Worth remembering</strong><p>'+esc(lesson.takeaway)+'</p></div>':'')+'<p class="ns-learn-immersive__reflect">The aim is to understand why an explanation fits the evidence, and when you would need to revise it.</p><p role="status" data-save></p></div>';
   foot=preview?'<button class="ns-learn-player__primary" type="button" data-restart>Try again</button>':'<a class="ns-learn-player__primary" href="'+home+'">Back to course →</a>';
  }else{
   const node=current(),read=['read','image'].includes(node.type),checked=!!state.checked;
   const heading=node.title||node.prompt||'Learning activity';
   const promptLine=!read&&node.title&&node.prompt&&node.title!==node.prompt?'<p class="ns-learn-player__question-prompt">'+esc(node.prompt)+'</p>':'';
   const body=read?'<div class="ns-learn-player__reading">'+(node.type==='read'?paragraphs(node.body):'')+photo(node)+(node.sources?'<p class="ns-learn-player__sources">'+esc(node.sources)+'</p>':'')+'</div>':promptLine+photo(node)+renderControls(node);
   const notice=state.notice?'<p class="ns-learn-player__notice" role="alert">'+esc(state.notice)+'</p>':'';
   const response=checked?'<div class="ns-learn-player__feedback" role="status"><strong>'+(state.checked.correct?'Best-supported answer.':'A useful distinction to review.')+'</strong>'+paragraphs(state.checked.explanation)+(state.checked.counterexample?'<p><small>Where this may differ: '+esc(state.checked.counterexample)+'</small></p>':'')+(node.sources?'<small>Reading: '+esc(node.sources)+'</small>':'')+(state.checked.reply?'<div class="ns-learn-player__branch"><strong>'+esc(node.speakerB||'Possible reply')+'</strong><p>'+esc(state.checked.reply)+'</p>'+(state.checked.consequence?'<small>'+esc(state.checked.consequence)+'</small>':'')+'</div>':'')+'</div>':'';
   middle='<div class="ns-learn-immersive__task"><p class="ns-learn-player__eyebrow">'+esc(node.type==='dialogue'?'CONVERSATION':node.type.toUpperCase())+' · '+(state.i+1)+' / '+nodes.length+'</p><h1>'+esc(heading)+'</h1>'+body+notice+response+'</div>';
   if(!(node.type==='dialogue'&&state.dialogueCheck<0&&state.dialogueVisible<(node.turns||[]).length)){
    const buttonText=node.type==='dialogue'&&state.dialogueCheck<0?'Analyse the exchange →':
     node.type==='dialogue'&&checked&&state.dialogueCheck<(node.checks?.length||0)-1?'Next question →':
     read||checked?(state.i+1===nodes.length?'Complete lesson →':'Continue →'):'Check answer';
    foot='<button type="button" class="ns-learn-player__primary" data-next>'+buttonText+'</button>';
   }else foot='<p class="ns-learn-immersive__helper">Read one message at a time. You can open the earlier messages whenever you need them.</p>';
  }
  root.innerHTML='<section class="ns-learn-player ns-learn-player--immersive" data-immersive><div class="ns-learn-immersive__surface" role="region" aria-label="Focused learning lesson">'+head+'<div class="ns-learn-immersive__content">'+middle+'</div><footer class="ns-learn-immersive__footer">'+foot+'</footer></div><span class="ns-learn-immersive__decoration" aria-hidden="true">✳</span></section>';
  if(state.phase==='done'){
   const score=learnLessonScore(lesson,state.answers);
   if(!preview&&!state.saved){state.saved=true;const result=review?saveLearnReview(bundle,lesson,score):saveLearnCompletion(bundle,lesson,score);root.querySelector('[data-save]').textContent=result.ok?(review?'Review saved.':'Progress saved.'):'Unable to save progress: '+result.error;}
   else if(preview)root.querySelector('[data-save]').textContent='Staff preview · No progress saved.';
  }
  wire();
 }
 function wire(){
  root.querySelector('[data-dialogue-reveal]')?.addEventListener('click',()=>{const node=current();if(node?.type!=='dialogue')return;state.dialogueVisible=Math.min((node.turns||[]).length,state.dialogueVisible+1);paint();(root.querySelector('[data-dialogue-reveal]')||root.querySelector('[data-next]'))?.focus();});
  root.querySelector('[data-start]')?.addEventListener('click',()=>{state.phase='node';state.i=0;reset();paint();});
  root.querySelector('[data-close-lesson]')?.addEventListener('click',()=>root.closest('#cl-preview')?.querySelector('[data-act="close-preview"]')?.click());
  root.querySelector('[data-restart]')?.addEventListener('click',()=>{state.phase='intro';state.i=0;state.answers={};state.options=new Map();state.saved=false;nodes=arrange(originalNodes);paint();});
  root.querySelectorAll('[data-segment]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.segment;if(state.labels.has(id))state.labels.delete(id);else state.labels.add(id);button.setAttribute('aria-pressed',String(state.labels.has(id)));}));
  root.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('click',()=>{const a=Number(button.dataset.move),b=a+Number(button.dataset.dir);if(b<0||b>=state.order.length)return;[state.order[a],state.order[b]]=[state.order[b],state.order[a]];paint();root.querySelector('[data-move="'+b+'"][data-dir="'+button.dataset.dir+'"]')?.focus();}));
  root.querySelector('[data-next]')?.addEventListener('click',()=>{
   const node=current();
   if(node.type==='dialogue'){
    if(state.dialogueCheck<0){if(state.dialogueVisible<(node.turns||[]).length)return;state.dialogueCheck=0;state.notice='';paint();return;}
    if(state.checked){if(state.dialogueCheck<node.checks.length-1){state.dialogueCheck++;state.checked=null;state.notice='';paint();}else advance();return;}
    const check=node.checks[state.dialogueCheck],answer=response(node);
    if(!check.options.some(o=>o.id===answer)){
     const notice=root.querySelector('.ns-learn-player__notice');if(notice)notice.textContent='Choose an answer before checking.';else root.querySelector('[data-next]').insertAdjacentHTML('beforebegin','<p class="ns-learn-player__notice" role="alert">Choose an answer before checking.</p>');return;
    }
    if(!state.answers[node.id])state.answers[node.id]={};
    state.answers[node.id][check.id]=answer;
    const chosen=check.options.find(o=>o.id===answer);state.checked={correct:answer===check.answer,explanation:(chosen?.feedback?chosen.feedback+'\n\n':'')+check.explanation,counterexample:check.counterexample,reply:chosen?.reply||'',consequence:chosen?.consequence||''};paint();return;
   }
   if(['read','image'].includes(node.type)||state.checked){advance();return;}
   const answer=response(node),result=gradeLearnItem(node,answer);
   if(!result.valid){const notice=root.querySelector('.ns-learn-player__notice');if(notice)notice.textContent='Complete the activity before checking.';else root.querySelector('[data-next]').insertAdjacentHTML('beforebegin','<p class="ns-learn-player__notice" role="alert">Complete the activity before checking.</p>');return;}
   state.answers[node.id]=answer;state.checked=result;paint();
  });
 }
 paint();
}
