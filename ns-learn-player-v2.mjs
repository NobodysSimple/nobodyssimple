/**
 * Reusable Learn lesson runner. The current publication registry is empty,
 * so this UI cannot mount an invented or unfinished lesson.
 */
import {getLearnContent} from './ns-learn-content-v2.mjs';
import {getLearnCourse} from './ns-learn-catalog-v2.mjs';
import {validateLearnBundle,gradeLearnItem,learnLessonScore,flattenLearnLessons} from './ns-learn-engine-v2.mjs';
import {saveLearnCompletion,saveLearnReview} from './ns-learn-progress-v2.mjs';
const esc=x=>String(x??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const opt=(id,label)=>'<option value="'+esc(id)+'">'+esc(label)+'</option>';
export function publishedLearnBundle(courseId){
 const course=getLearnCourse(courseId),bundle=getLearnContent(courseId);
 return course?.status==='published'&&bundle&&!validateLearnBundle(bundle,courseId).length?bundle:null;
}
export function renderLearnLesson(root,courseId,lessonId,{review=false}={}){
 const bundle=publishedLearnBundle(courseId),course=getLearnCourse(courseId);
 const lesson=bundle&&flattenLearnLessons(bundle).find(l=>l.id===lessonId);
 if(!lesson){
  root.innerHTML='<section class="ns-learn-player ns-learn-no-lesson"><a href="#learn/course/'+encodeURIComponent(courseId)+'">← Back to the course</a><h1>There are no published lessons here yet.</h1><p>Lessons will appear only after their content is written, reviewed and released. No progress has been recorded.</p><a href="#learn/courses">Explore the course catalogue →</a></section>';
  return;
 }
 const state={phase:'intro',index:0,answers:{},response:null,order:[],checked:null,notice:''};
 const items=lesson.questions;
 const intro=()=>'<p class="ns-learn-player__eyebrow">'+esc(course.title)+' · '+esc(lesson.moduleTitle)+'</p><h1>'+esc(lesson.title)+'</h1><p>'+esc(lesson.teach)+'</p><p class="ns-learn-player__hint">Practice and feedback follow. This is educational material, not a diagnosis.</p><button type="button" class="ns-learn-player__primary" data-begin>Start practice →</button>';
 const controls=item=>{
  if(item.type==='choose'||item.type==='respond')return '<fieldset class="ns-learn-player__choices"><legend class="sr-only">Choose your answer</legend>'+item.options.map(o=>'<label><input type="radio" name="learn-choice" value="'+esc(o.id)+'"><span>'+esc(o.label)+'</span></label>').join('')+'</fieldset>';
  if(item.type==='complete')return '<label class="ns-learn-player__label">Your answer<input name="learn-recall" type="text" maxlength="150" autocomplete="off" spellcheck="true" placeholder="Type your answer"></label>';
  if(item.type==='match'||item.type==='sort'){
   const list=item.type==='match'?item.pairs:item.items;
   const choices=item.type==='match'?item.pairs.map(p=>p.answer):item.categories.map(c=>c.id);
   // Rotate matching answers so their positions never reveal the solution.
   if(item.type==='match'&&choices.length>1)choices.push(choices.shift());
   return '<div class="ns-learn-player__pairs">'+list.map(p=>'<label><strong>'+esc(p.label)+'</strong><select data-pair="'+esc(p.id)+'"><option value="">Choose…</option>'+choices.map(c=>opt(c,item.type==='match'?c:(item.categories.find(x=>x.id===c)?.label||c))).join('')+'</select></label>').join('')+'</div>';
  }
  if(item.type==='sequence')return '<div class="ns-learn-player__ordering">'+state.order.map((id,i)=>{const step=item.steps.find(s=>s.id===id);return '<div class="ns-learn-player__order"><span>'+esc(step?.label||id)+'</span><div><button type="button" data-move="'+i+'" data-direction="-1" aria-label="Move '+esc(step?.label||id)+' up" '+(i===0?'disabled':'')+'>↑</button><button type="button" data-move="'+i+'" data-direction="1" aria-label="Move '+esc(step?.label||id)+' down" '+(i===state.order.length-1?'disabled':'')+'>↓</button></div></div>'}).join('')+'</div>';
  return '';
 };
 const read=item=>{
  if(['choose','respond'].includes(item.type))return root.querySelector('input[name="learn-choice"]:checked')?.value||null;
  if(item.type==='complete')return root.querySelector('input[name="learn-recall"]')?.value||'';
  if(['match','sort'].includes(item.type))return Object.fromEntries([...root.querySelectorAll('[data-pair]')].map(s=>[s.dataset.pair,s.value]));
  if(item.type==='sequence')return state.order.slice();
  return null;
 };
 const paint=()=>{
  if(state.phase==='intro')root.innerHTML='<section class="ns-learn-player">'+intro()+'</section>';
  else if(state.phase==='complete'){
   const score=learnLessonScore(lesson,state.answers);
   root.innerHTML='<section class="ns-learn-player"><p class="ns-learn-player__eyebrow">LESSON COMPLETE</p><h1>'+esc(lesson.title)+'</h1><p>You completed '+score.total+' questions, with '+score.correct+' correct on your first answer. Review the explanations and revisit later to strengthen retention.</p><p role="status" data-save-status></p><a class="ns-learn-player__primary" href="#learn/course/'+encodeURIComponent(courseId)+'">Return to course →</a></section>';
   const output=root.querySelector('[data-save-status]'),saved=review?saveLearnReview(bundle,lesson,score):saveLearnCompletion(bundle,lesson,score);
   output.textContent=saved.ok?(review?'Review saved.':'Lesson completion saved.'):'Your answers were not saved: '+saved.error;
  }else{
   const item=items[state.index],result=state.checked,number=state.index+1;
   root.innerHTML='<section class="ns-learn-player"><a class="ns-learn-player__back" href="#learn/course/'+encodeURIComponent(courseId)+'">← Exit to course</a><p class="ns-learn-player__eyebrow">'+esc(lesson.title)+' · '+number+' / '+items.length+'</p><div class="ns-learn-player__meter" role="progressbar" aria-label="Lesson questions" aria-valuenow="'+number+'" aria-valuemin="0" aria-valuemax="'+items.length+'"><i style="width:'+Math.round(number/items.length*100)+'%"></i></div><h1>'+esc(item.prompt)+'</h1>'+controls(item)+(state.notice?'<p class="ns-learn-player__notice" role="alert">'+esc(state.notice)+'</p>':'')+(result?'<div class="ns-learn-player__feedback" role="status"><strong>'+(result.correct?'That distinction is right.':'Look closely at the distinction.')+'</strong><p>'+esc(result.explanation)+'</p><small>Counterexample: '+esc(result.counterexample)+'</small></div>':'')+'<button type="button" class="ns-learn-player__primary" '+(result?'data-next':'data-check')+'>'+(result?(number===items.length?'Finish lesson':'Next question →'):'Check answer')+'</button></section>';
  }
  wire();
 };
 const wire=()=>{
  root.querySelector('[data-begin]')?.addEventListener('click',()=>{state.phase='item';state.index=0;startItem();paint();});
  root.querySelectorAll('[data-move]').forEach(btn=>btn.addEventListener('click',()=>{
   const from=Number(btn.dataset.move),to=from+Number(btn.dataset.direction);
   if(to<0||to>=state.order.length)return;
   [state.order[from],state.order[to]]=[state.order[to],state.order[from]];
   paint();root.querySelector('[data-move="'+to+'"][data-direction="'+btn.dataset.direction+'"]')?.focus();
  }));
  root.querySelector('[data-check]')?.addEventListener('click',()=>{
   const item=items[state.index],response=read(item),result=gradeLearnItem(item,response);
   if(!result.valid){state.notice='Complete the question before checking your answer.';const message=root.querySelector('.ns-learn-player__notice');if(message)message.textContent=state.notice;else root.querySelector('[data-check]')?.insertAdjacentHTML('beforebegin','<p class="ns-learn-player__notice" role="alert">'+esc(state.notice)+'</p>');return;}
   state.notice='';state.answers[item.id]=response;state.checked=result;paint();
  });
  root.querySelector('[data-next]')?.addEventListener('click',()=>{
   if(state.index+1>=items.length)state.phase='complete';
   else {state.index++;startItem();}
   paint();
  });
 };
 const startItem=()=>{state.notice='';state.checked=null;state.order=items[state.index]?.type==='sequence'?items[state.index].steps.map(s=>s.id).reverse():[];};
 paint();
}
