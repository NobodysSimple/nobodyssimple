/**
 * Public ten-format course player. Also mounts the staff preview without
 * recording completions. Question content is always escaped; never raw HTML.
 */
import {getLearnContent} from './ns-learn-content-v2.mjs';
import {getLearnCourse} from './ns-learn-catalog-v2.mjs';
import {validateLearnBundle,gradeLearnItem,learnLessonScore,flattenLearnLessons,QUESTION_TYPES} from './ns-learn-engine-v2.mjs';
import {learningNodes,safeCourseImage} from './ns-course-lab-schema.mjs';
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
const fieldset=(name,options)=>'<fieldset class="ns-learn-player__choices"><legend class="sr-only">'+esc(name)+'</legend>'+options.map(o=>'<label><input type="radio" name="'+esc(name)+'" value="'+esc(o.id)+'"><span>'+esc(o.label)+'</span></label>').join('')+'</fieldset>';
export function publishedLearnBundle(id){
 const c=getLearnCourse(id),b=getLearnContent(id);
 return c&&b&&!validateLearnBundle(b,id).length?b:null;
}
export function renderLearnLesson(root,courseId,lessonId,{review=false,bundleOverride=null,preview=false}={}){
 const bundle=bundleOverride||publishedLearnBundle(courseId),course=getLearnCourse(courseId);
 const lesson=bundle&&flattenLearnLessons(bundle).find(l=>l.id===lessonId);
 const home='#learn/course/'+encodeURIComponent(courseId);
 if(!lesson){root.innerHTML='<section class="ns-learn-player"><a href="'+home+'">← Back to course</a><h1>No published lesson found</h1><p>This course has no available lesson at that address.</p></section>';return;}
 const nodes=learningNodes(lesson),state={phase:'intro',i:0,answers:{},checked:null,notice:'',order:[],labels:new Set(),saved:false};
 const current=()=>nodes[state.i];
 function renderControls(node){
  if(['choose','respond','repair','investigate'].includes(node.type))return fieldset('choice',node.options);
  if(node.type==='complete')return '<label class="ns-learn-player__label">Your answer<input name="recall" type="text" maxlength="180" autocomplete="off" placeholder="'+esc(node.hint||'Type your answer')+'"></label>';
  if(node.type==='match'||node.type==='sort'){
   const list=node.type==='match'?node.pairs:node.items;
   const choices=node.type==='match'?node.pairs.map(p=>({id:p.answer,label:p.answer})):node.categories;
   if(node.type==='match'&&choices.length>1)choices.push(choices.shift());
   return '<div class="ns-learn-player__pairs">'+list.map(p=>'<label><strong>'+esc(p.label)+'</strong><select data-pair="'+esc(p.id)+'"><option value="">Select…</option>'+choices.map(o=>opt(o.id,o.label)).join('')+'</select></label>').join('')+'</div>';
  }
  if(node.type==='sequence'||node.type==='chain')return '<div class="ns-learn-player__ordering">'+state.order.map((id,i)=>{const s=node.steps.find(x=>x.id===id);return '<div class="ns-learn-player__order"><span>'+esc(s?.label||id)+'</span><div><button type="button" data-move="'+i+'" data-dir="-1" '+(i===0?'disabled':'')+' aria-label="Move item up">↑</button><button type="button" data-move="'+i+'" data-dir="1" '+(i===state.order.length-1?'disabled':'')+' aria-label="Move item down">↓</button></div></div>';}).join('')+'</div>';
  if(node.type==='label')return '<div class="ns-learn-player__segments" role="group" aria-label="Select evidence phrases">'+node.segments.map(s=>'<button type="button" data-segment="'+esc(s.id)+'" aria-pressed="'+state.labels.has(s.id)+'">'+esc(s.text)+'</button>').join(' ')+'</div>';
  if(node.type==='predict')return '<div class="ns-learn-player__two"><h2>'+esc(node.changePrompt||'What changes?')+'</h2>'+fieldset('change',node.changes)+'<h2>What is the best prediction?</h2>'+fieldset('outcome',node.outcomes)+'</div>';
  if(node.type==='character')return '<div class="ns-learn-player__two"><p>'+esc(node.characterName)+': '+esc(node.scenario)+'</p><h2>What does the evidence support?</h2>'+fieldset('evidence',node.evidenceOptions)+'<h2>What response fits best?</h2>'+fieldset('action',node.responseOptions)+'</div>';
  return '';
 }
 function response(node){
  if(['choose','respond','repair','investigate'].includes(node.type))return root.querySelector('input[name="choice"]:checked')?.value||null;
  if(node.type==='complete')return root.querySelector('input[name="recall"]')?.value||'';
  if(['match','sort'].includes(node.type))return Object.fromEntries([...root.querySelectorAll('[data-pair]')].map(x=>[x.dataset.pair,x.value]));
  if(node.type==='sequence'||node.type==='chain')return [...state.order];
  if(node.type==='label')return [...state.labels];
  if(node.type==='predict')return {change:root.querySelector('input[name="change"]:checked')?.value||'',outcome:root.querySelector('input[name="outcome"]:checked')?.value||''};
  if(node.type==='character')return {evidence:root.querySelector('input[name="evidence"]:checked')?.value||'',action:root.querySelector('input[name="action"]:checked')?.value||''};
 }
 const reset=()=>{state.checked=null;state.notice='';state.labels=new Set();const node=current();state.order=['sequence','chain'].includes(node?.type)?[...node.steps.map(s=>s.id)].reverse():[];};
 const advance=()=>{if(state.i+1>=nodes.length)state.phase='done';else {state.i++;reset();}paint();};
 function paint(){
  const exit=preview?'':'<a class="ns-learn-player__back" href="'+home+'">← Exit course</a>';
  if(state.phase==='intro'){
   root.innerHTML='<section class="ns-learn-player">'+exit+'<p class="ns-learn-player__eyebrow">'+esc(course?.title||bundle.title||courseId)+' · '+esc(lesson.moduleTitle||'')+'</p><h1>'+esc(lesson.title)+'</h1>'+paragraphs(lesson.teach||'This lesson contains short reading and interactive exercises.')+'<p class="ns-learn-player__hint">'+nodes.length+' pages and activities · Untimed</p><button type="button" class="ns-learn-player__primary" data-start>Begin →</button></section>';
  }else if(state.phase==='done'){
   const score=learnLessonScore(lesson,state.answers);
   root.innerHTML='<section class="ns-learn-player"><h1>Lesson complete</h1><p>You completed '+nodes.length+' pages and '+score.total+' exercises, with '+score.correct+' correct on the first attempt.</p><p role="status" data-save></p>'+(preview?'<button class="ns-learn-player__primary" type="button" data-restart>Restart preview</button>':'<a class="ns-learn-player__primary" href="'+home+'">Back to course →</a>')+'</section>';
   if(!preview&&!state.saved){
    state.saved=true;
    const result=review?saveLearnReview(bundle,lesson,score):saveLearnCompletion(bundle,lesson,score);
    root.querySelector('[data-save]').textContent=result.ok?(review?'Review saved.':'Progress saved.'):'Unable to save progress: '+result.error;
   }else if(preview)root.querySelector('[data-save]').textContent='Staff preview · Progress is not recorded.';
  }else{
   const node=current(),read=['read','image'].includes(node.type),checked=!!state.checked;
   const heading=node.title||node.prompt||'Learning activity';
   const promptLine=!read&&node.title&&node.prompt&&node.title!==node.prompt?'<p class="ns-learn-player__question-prompt">'+esc(node.prompt)+'</p>':'';
   const body=read?'<div class="ns-learn-player__reading">'+(node.type==='read'?paragraphs(node.body):'')+photo(node)+(node.sources?'<p class="ns-learn-player__sources">'+esc(node.sources)+'</p>':'')+'</div>':promptLine+photo(node)+renderControls(node);
   root.innerHTML='<section class="ns-learn-player">'+exit+'<p class="ns-learn-player__eyebrow">'+esc(lesson.title)+' · '+(state.i+1)+' / '+nodes.length+'</p><div class="ns-learn-player__meter" role="progressbar" aria-valuenow="'+(state.i+1)+'" aria-valuemin="0" aria-valuemax="'+nodes.length+'"><i style="width:'+Math.round((state.i+1)/nodes.length*100)+'%"></i></div><h1>'+esc(heading)+'</h1>'+(!read&&node.type==='character'?'':body)+(read?'':'')+(!read&&node.type==='character'?body:'')+(state.notice?'<p class="ns-learn-player__notice" role="alert">'+esc(state.notice)+'</p>':'')+(checked?'<div class="ns-learn-player__feedback" role="status"><strong>'+(state.checked.correct?'Correct.':'Review the distinction.')+'</strong><p>'+esc(state.checked.explanation)+'</p><small>Counterexample: '+esc(state.checked.counterexample)+'</small>'+(node.sources?'<small>Sources: '+esc(node.sources)+'</small>':'')+'</div>':'')+'<button type="button" class="ns-learn-player__primary" data-next>'+ (read||checked?(state.i+1===nodes.length?'Finish lesson':'Continue →'):'Check answer')+'</button></section>';
  }
  wire();
 }
 function wire(){
  root.querySelector('[data-start]')?.addEventListener('click',()=>{state.phase='node';state.i=0;reset();paint();});
  root.querySelector('[data-restart]')?.addEventListener('click',()=>{state.phase='intro';state.i=0;state.answers={};state.saved=false;paint();});
  root.querySelectorAll('[data-segment]').forEach(button=>button.addEventListener('click',()=>{const id=button.dataset.segment;if(state.labels.has(id))state.labels.delete(id);else state.labels.add(id);button.setAttribute('aria-pressed',String(state.labels.has(id)));}));
  root.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('click',()=>{const a=Number(button.dataset.move),b=a+Number(button.dataset.dir);if(b<0||b>=state.order.length)return;[state.order[a],state.order[b]]=[state.order[b],state.order[a]];paint();root.querySelector('[data-move="'+b+'"][data-dir="'+button.dataset.dir+'"]')?.focus();}));
  root.querySelector('[data-next]')?.addEventListener('click',()=>{
   const node=current();if(['read','image'].includes(node.type)||state.checked){advance();return;}
   const answer=response(node),result=gradeLearnItem(node,answer);
   if(!result.valid){const notice=root.querySelector('.ns-learn-player__notice');if(notice)notice.textContent='Complete the activity before checking.';else root.querySelector('[data-next]').insertAdjacentHTML('beforebegin','<p class="ns-learn-player__notice" role="alert">Complete the activity before checking.</p>');return;}
   state.answers[node.id]=answer;state.checked=result;paint();
  });
 }
 paint();
}
