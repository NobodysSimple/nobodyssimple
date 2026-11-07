/**
 * Nobody's Simple · Forest Unit 1 / five-step learning journey.
 * The approved SVG scene, 40 unit outlines, other world renderers and original
 * magnifier/scales/star glyphs are not replaced. Only the Forest trailhead is
 * extended to fit two additional stones, and only multi-lesson stones get rings.
 */
import { forestStoneLessonGroups, forestStoneMeta, getForestPlayableLesson } from './ns-forest-curriculum.mjs';
import { forestMicroLessons } from './ns-forest-micro-lessons.mjs';
import { trailX } from './ns-living-trail.mjs';

const KEY = 'ns-account-learning-v2';
const ORIGINAL_NODES = new Set(['reality-sorter','reality-map','assumption-finder']);
export const forestStoneOrder = Object.freeze(['assumption-finder','reality-map','perspective-window','reality-sorter','life-application']);
const STONE_LOCALS = Object.freeze([525,420,315,210,105]); // bottom of unit -> top
const BASE_HEIGHT = 14970, EXTRA_HEIGHT = 220, UNIT_TOP = 14610;
const escapeText = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const lessonKey = id => `ns-lab-lesson:forest:${id}`;
const legacyKey = id => `ns-lab:forest:${id}`;

export function readForestRecords(storage = typeof localStorage === 'undefined' ? null : localStorage) {
  try {
    const records = JSON.parse(storage?.getItem(KEY) || '{}');
    return records && typeof records==='object' && !Array.isArray(records) ? records : {};
  } catch {return {};}
}
export function isForestLessonDone(id,records=readForestRecords()) {
  if (!Object.values(forestStoneLessonGroups).some(group=>group.includes(id))) return false;
  return records[lessonKey(id)]?.completed===true ||
    (ORIGINAL_NODES.has(id) && records[legacyKey(id)]?.completed===true);
}
export function forestStoneStatus(id, records=readForestRecords()) {
  const lessons=forestStoneLessonGroups[id];
  if (!lessons) return null;
  const done=lessons.filter(x=>isForestLessonDone(x,records)).length;
  return {id,done,total:lessons.length,finished:done===lessons.length,
    next:lessons.find(x=>!isForestLessonDone(x,records))||null};
}
/** Only explicit completion is saved. Previous and unrelated records survive. */
export function saveForestLesson(id,storage=typeof localStorage==='undefined'?null:localStorage) {
  if (!Object.values(forestStoneLessonGroups).some(group=>group.includes(id))) return false;
  try {
    const raw=JSON.parse(storage.getItem(KEY)||'{}');
    if (!raw || typeof raw!=='object'||Array.isArray(raw)) return false;
    const now=new Date().toISOString();
    raw[lessonKey(id)]={kind:'life-lab-lesson',completed:true,completedAt:now,updatedAt:now};
    if (ORIGINAL_NODES.has(id)) raw[legacyKey(id)]={kind:'life-lab-activity',completed:true,completedAt:now,updatedAt:now};
    storage.setItem(KEY,JSON.stringify(raw));
    return true;
  } catch {return false;}
}
export function nextForestStone(records=readForestRecords()) {
  return forestStoneOrder.find(id=>!forestStoneStatus(id,records).finished)||null;
}

// Reuse the exact SVG paths from the existing Forest icon set for the three
// original stones. New book/plant icons use existing trail glyphs (not emoji).
const GLYPHS=Object.freeze({
  'assumption-finder':'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
  'reality-map':'<path d="M12 3v17M5 6h14M5 6 2 13h6L5 6Zm14 0-3 7h6l-3-7ZM8 21h8"/>',
  'perspective-window':'<path d="M3 5q4-2 9 1 5-3 9-1v14q-4-2-9 1-5-3-9-1Z M12 6v14"/>',
  'reality-sorter':'<path d="m12 2 3.2 6.6 7.3 1.1-5.3 5.2 1.3 7.3L12 18.7l-6.5 3.5 1.3-7.3-5.3-5.2 7.3-1.1Z" fill="currentColor" stroke-linejoin="round"/>',
  'life-application':'<path d="M12 21v-10M12 14C3 14 3 7 3 4c6 0 9 3 9 10Zm0 0c0-8 3-10 9-10 0 7-3 10-9 10Z"/>'
});
function icon(id){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${GLYPHS[id]||''}</svg>`;}

/** Extend only the bottom 220px. The original 14,970px scenic SVG remains
 * pixel-for-pixel unchanged, without rescaling any existing trees or road.
 * The extra portion continues the original winding road/palette below it. */
function extensionSVG(){
  const x=y=>trailX(BASE_HEIGHT+y,'forest').toFixed(2);
  let d=`M ${x(0)} 0`;
  for(let y=10;y<=EXTRA_HEIGHT+10;y+=10)d+=` L ${x(y)} ${y}`;
  return `<svg class="ns-forest-scene-extension" viewBox="0 0 480 ${EXTRA_HEIGHT}" preserveAspectRatio="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="ns-forest-extension-road" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#eabb6f"/><stop offset="49%" stop-color="#ffdfa4"/><stop offset="100%" stop-color="#e9b66b"/></linearGradient></defs>
    <rect width="480" height="${EXTRA_HEIGHT}" fill="#a0d85f"/>
    <path d="${d}" stroke="#f6f2d8" stroke-width="258" fill="none" opacity=".09"/>
    <path d="${d}" stroke="#1b5b4d" stroke-width="166" fill="none" opacity=".09"/>
    <path d="${d}" stroke="#6eaa4a" stroke-width="116" opacity=".2" fill="none"/>
    <path d="${d}" stroke="url(#ns-forest-extension-road)" stroke-width="94" fill="none"/>
    <path d="${d}" stroke="#fff4cc" stroke-width="68" opacity=".58" fill="none"/>
    <image href="ns-forest-foliage-left.webp" x="-7" y="-24" width="170" height="250" opacity=".86" preserveAspectRatio="none"/>
    <image href="ns-forest-foliage-right.webp" x="322" y="8" width="175" height="230" opacity=".9" preserveAspectRatio="none"/>
    <g fill="#70c62d" opacity=".8"><ellipse cx="58" cy="206" rx="55" ry="14"/><ellipse cx="95" cy="209" rx="28" ry="18"/><ellipse cx="448" cy="174" rx="51" ry="20"/></g>
  </svg>`;
}
function createExtraStone(root,id){
  const node=document.createElement('button');
  node.type='button';
  node.className=`ns-trail-node ns-trail-node--available ns-trail-node--type-${forestStoneMeta[id].type}`;
  node.dataset.trailNode=id;
  node.dataset.unit='1';
  node.setAttribute('aria-haspopup','dialog');
  node.innerHTML=`<span class="ns-trail-stone" aria-hidden="true">${icon(id)}</span><span class="ns-trail-node-title" data-side="right"><strong>${escapeText(forestStoneMeta[id].title)}</strong><small>AVAILABLE</small></span>`;
  root.append(node);
  return node;
}
/**
 * Every segment reflects an actual saved lesson completion, never the position
 * of the next unfinished lesson. The old amber "current" segment incorrectly
 * looked like a completed lesson on every untouched stone, even locked ones.
 * Single-lesson capstone/application stones intentionally have no progress ring.
 */
export function forestRingSVG(lessonIds,records=readForestRecords()) {
  if (!Array.isArray(lessonIds) || lessonIds.length < 2) return '';
  const r=41.5,circ=2*Math.PI*r,arc=circ/lessonIds.length,gap=9,draw=arc-gap;
  const arcs=lessonIds.map((id,i)=>{
    const completed=isForestLessonDone(id,records);
    return `<circle cx="50" cy="50" r="${r}" fill="none" data-forest-lesson="${escapeText(id)}" data-forest-completed="${String(completed)}" stroke="${completed?'#74cb2a':'#cbd4cf'}" stroke-width="5.8" stroke-linecap="round" stroke-dasharray="${draw.toFixed(2)} ${(circ-draw).toFixed(2)}" stroke-dashoffset="${(-i*arc+gap/2).toFixed(2)}" transform="rotate(-90 50 50)"/>`;
  }).join('');
  return `<svg class="ns-forest-stone-progress" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${arcs}</svg>`;
}
function arrangeFirstUnit(root){
  const map=root.querySelector('[data-trail-map]');
  const unit=root.querySelector('[data-unit-number="1"]');
  const scene=map?.querySelector('.ns-trail-continuous-scene');
  if(!map||!unit||!scene) return false;
  map.style.height=`${BASE_HEIGHT+EXTRA_HEIGHT}px`;
  map.style.setProperty('--trail-scene-height',`${BASE_HEIGHT+EXTRA_HEIGHT}px`);
  unit.style.height=`${360+EXTRA_HEIGHT}px`;
  // Override only the SVG's *height*, not any of its artwork or viewBox.
  scene.style.height=`${BASE_HEIGHT}px`;
  scene.style.inset='0 auto auto 0';
  if(!map.querySelector('.ns-forest-scene-extension')){
    const tail=document.createElement('div');
    tail.className='ns-forest-scene-tail';
    tail.innerHTML=extensionSVG();
    map.append(tail);
  }
  // Five read-only future stones per planned unit; they remain non-playable.
  root.querySelectorAll('.ns-trail-unit--planned').forEach(section=>{
    if(section.dataset.forestFiveGhosts==='true')return;
    const ghosts=[...section.querySelectorAll('.ns-trail-future-node')];
    ghosts.forEach((ghost,i)=>{
      const y=45+i*67;
      const absoluteY=parseFloat(section.style.top)+y;
      ghost.style.setProperty('--ghost-y',`${y}px`);
      ghost.style.setProperty('--ghost-x',`${(100*trailX(absoluteY,'forest')/480).toFixed(2)}%`);
    });
    if(ghosts.length===4){
      const y=313,absoluteY=parseFloat(section.style.top)+y;
      const ghost=ghosts[0].cloneNode(true);
      ghost.style.setProperty('--ghost-y',`${y}px`);
      ghost.style.setProperty('--ghost-x',`${(100*trailX(absoluteY,'forest')/480).toFixed(2)}%`);
      section.append(ghost);
    }
    section.dataset.forestFiveGhosts='true';
  });
  forestStoneOrder.forEach((id,index)=>{
    const node=unit.querySelector(`[data-trail-node="${id}"]`)||createExtraStone(unit,id);
    const localY=STONE_LOCALS[index],absoluteY=UNIT_TOP+localY;
    const x=(100*trailX(absoluteY,'forest')/480).toFixed(2);
    node.style.setProperty('--node-y',`${localY}px`);
    node.style.setProperty('--node-x',`${x}%`);
    const label=node.querySelector('.ns-trail-node-title');
    if(label){label.dataset.side=x>50?'left':'right';label.querySelector('strong')?.replaceChildren(document.createTextNode(forestStoneMeta[id].title));}
    node.setAttribute('aria-haspopup','dialog');
  });
  return true;
}
function refreshStones(root){
  const records=readForestRecords(),current=nextForestStone(records);
  forestStoneOrder.forEach(id=>{
    const node=root.querySelector(`[data-trail-node="${id}"]`);
    if(!node)return;
    const status=forestStoneStatus(id,records),lessons=forestStoneLessonGroups[id];
    node.classList.remove('ns-trail-node--completed','ns-trail-node--current','ns-trail-node--available');
    node.classList.add(`ns-trail-node--${status.finished?'completed':current===id?'current':'available'}`);
    node.classList.toggle('ns-forest-stone-complete',status.finished);
    node.setAttribute('aria-label',`${forestStoneMeta[id].title}. ${status.done} of ${status.total} lessons complete.${current===id?' Next stone.':''}`);
    const stone=node.querySelector('.ns-trail-stone');
    if(stone && stone.innerHTML!==icon(id)) stone.innerHTML=icon(id);
    node.querySelector('.ns-forest-stone-progress')?.remove();
    if(lessons.length>1) node.insertAdjacentHTML('beforeend',forestRingSVG(lessons,records));
  });
  // Move the original Nobody walker and START label, never create another one.
  const destination=root.querySelector(`[data-trail-node="${current||forestStoneOrder.at(-1)}"]`);
  if(destination){
    const walker=root.querySelector('.ns-trail-walker');
    const start=root.querySelector('.ns-trail-start');
    if(walker && walker.parentElement!==destination) destination.append(walker);
    if(start){
      if(start.parentElement!==destination) destination.append(start);
      start.textContent=current?'NEXT LESSON':'UNIT 1 PRACTISED';
    }
  }
}
function decorateForest(root){
  if(!root||root.dataset.forestLessonsEnhanced==='five-stones')return;
  if(!arrangeFirstUnit(root))return;
  root.dataset.forestLessonsEnhanced='five-stones';
  refreshStones(root);
}
let activeStone=null,activeLesson=null,answer=-1,errorMessage='';
function dialogFor(root){return root.querySelector('[data-trail-dialog]');}
function display(root,html){
  const dlg=dialogFor(root),body=dlg?.querySelector('[data-trail-dialog-body]');
  if(!dlg||!body)return;
  body.innerHTML=html;
  if(!dlg.open){if(typeof dlg.showModal==='function')dlg.showModal();else dlg.setAttribute('open','');}
  body.querySelector('[data-trail-close],[data-forest-start],[data-forest-next]')?.focus({preventScroll:true});
}
function modalTop(id,status){
  return `<div class="ns-trail-dialog__top"><span class="ns-trail-dialog-icon" aria-hidden="true">${icon(id)}</span><button type="button" class="ns-trail-dialog-close" data-trail-close aria-label="Close lesson preview">×</button></div>
    <p class="ns-trail-eyebrow">THE FOREST · UNIT 1 · STONE ${forestStoneOrder.indexOf(id)+1} OF 5</p>
    <h2 id="ns-trail-dialog-title">${escapeText(forestStoneMeta[id].title)}</h2>
    <p class="ns-forest-progress-label" role="status">${status.done} of ${status.total} ${status.total===1?'lesson':'lessons'} complete</p>`;
}
function completionPreview(root,id){
  const next=nextForestStone(),status=forestStoneStatus(id);
  const button=next?`<button type="button" class="ns-trail-dialog-go" data-forest-next="${escapeText(next)}">Go to ${escapeText(forestStoneMeta[next].title)} →</button>`:'<p>All five Unit 1 stones are complete. You can revisit them whenever you like.</p>';
  display(root,modalTop(id,status)+`<p class="ns-forest-stone-finished">✓ Stone complete!</p>${button}<button type="button" class="ns-trail-mark-complete" data-trail-close>Back to the Forest</button>`);
}
function openStone(root,id){
  if(!forestStoneLessonGroups[id])return;
  activeStone=id;activeLesson=null;answer=-1;errorMessage='';
  const status=forestStoneStatus(id),previous=forestStoneOrder[forestStoneOrder.indexOf(id)-1];
  const locked=Boolean(previous && !forestStoneStatus(previous).finished);
  const head=modalTop(id,status);
  if(locked){
    display(root,head+`<p>Complete ${escapeText(forestStoneMeta[previous].title)} first to unlock this stone.</p><button type="button" class="ns-trail-mark-complete" data-trail-close>Back to the Forest</button>`);
    return;
  }
  if(status.finished){
    const buttons=forestStoneLessonGroups[id].map((lesson,index)=>`<button type="button" data-forest-review="${escapeText(lesson)}"><span>${index+1}. ${escapeText(getForestPlayableLesson(lesson).title)}</span><span aria-label="Completed">✓</span></button>`).join('');
    display(root,head+`<p>You've completed this stone. Revisit any lesson below.</p><div class="ns-forest-lesson-list">${buttons}</div>${id==='life-application'?'<a class="ns-trail-dialog-go" href="#tool/assumption-finder">Optional bonus: Assumption Finder →</a>':''}`);
    return;
  }
  const lesson=getForestPlayableLesson(status.next);
  if(!lesson)return;
  const description=lesson.type==='mission'?'A complete six-stage interactive mission.':lesson.type==='tool'?'An existing independent reflection tool.':'A short interactive lesson with an everyday example and feedback.';
  const action=lesson.type==='lesson'?`<button type="button" class="ns-trail-dialog-go ns-forest-start-btn" data-forest-start="${escapeText(status.next)}">Start lesson →</button>`:
    `<a class="ns-trail-dialog-go" href="${escapeText(lesson.href)}">${lesson.type==='mission'?'Start mission':'Open tool'} →</a>`;
  const toolNote=lesson.type==='tool'?`<button type="button" class="ns-trail-mark-complete" data-forest-mark-tool="${escapeText(status.next)}">I've practised this tool · mark complete</button><p class="ns-trail-dialog-note">Open the tool first. When you return, you can mark the lesson complete yourself.</p>`:'';
  display(root,head+`<p class="ns-forest-next-label">NEXT · LESSON ${status.done+1} OF ${status.total}</p><h3 class="ns-forest-next-title">${escapeText(lesson.title)}</h3><p>${description}</p>${action}${toolNote}<p class="ns-trail-dialog-note">${escapeText(forestStoneMeta[id].objective)}</p>`);
}
function beginExercise(root,id){
  if(!forestMicroLessons[id])return;
  activeLesson=id;answer=-1;errorMessage='';
  paintExercise(root);
}
function paintExercise(root){
  const data=forestMicroLessons[activeLesson];
  if(!data)return;
  const lesson=getForestPlayableLesson(activeLesson),status=forestStoneStatus(activeStone);
  const correct=answer===data.best;
  const choices=data.choices.map(([label],i)=>`<button type="button" class="ns-forest-choice${answer===i?' is-selected':''}" data-forest-choice="${i}" aria-pressed="${answer===i}"><strong>${i+1}</strong><span>${escapeText(label)}</span></button>`).join('');
  const feedback=answer<0?'':`<div class="ns-forest-explanation" role="status"><strong>${correct?'Useful distinction':'Consider another possibility'}</strong><p>${escapeText(data.choices[answer][1])}</p>${correct?`<p>${escapeText(data.principle)}</p><p><strong>Try it in life:</strong> ${escapeText(data.transfer)}</p>`:''}</div>`;
  display(root,modalTop(activeStone,status)+`<p class="ns-forest-next-label">INTERACTIVE LESSON</p><h3 class="ns-forest-next-title">${escapeText(lesson.title)}</h3>
    <p class="ns-forest-scenario">${escapeText(data.lead)}</p><p><strong>${escapeText(data.question)}</strong></p>
    <div class="ns-forest-choices" role="group" aria-label="Choose a response">${choices}</div>${feedback}
    ${errorMessage?`<p role="alert">${escapeText(errorMessage)}</p>`:''}
    <button type="button" class="ns-trail-dialog-go ns-forest-start-btn" data-forest-finish="${escapeText(activeLesson)}" ${correct?'':'disabled'}>Complete lesson →</button>
    <p class="ns-trail-dialog-note">Practising here is not an assessment of your personality. Completion is saved only when you choose it. Real-life actions are always optional.</p>`);
}
function actionClick(event,root){
  const control=event.target.closest('[data-forest-start],[data-forest-choice],[data-forest-finish],[data-forest-mark-tool],[data-forest-review],[data-forest-next]');
  if(!control||!root.contains(control))return false;
  event.preventDefault();event.stopImmediatePropagation();
  if(control.hasAttribute('data-forest-next'))openStone(root,control.dataset.forestNext);
  else if(control.hasAttribute('data-forest-start'))beginExercise(root,control.dataset.forestStart);
  else if(control.hasAttribute('data-forest-choice')){
    answer=Number(control.dataset.forestChoice);paintExercise(root);
    dialogFor(root)?.querySelector(`[data-forest-choice="${answer}"]`)?.focus({preventScroll:true});
  }else if(control.hasAttribute('data-forest-review')){
    const id=control.dataset.forestReview;
    if(forestMicroLessons[id])beginExercise(root,id);
    else {const step=getForestPlayableLesson(id);if(step?.href)window.location.hash=step.href;}
  }else if(control.hasAttribute('data-forest-finish')){
    if(activeLesson!==control.dataset.forestFinish||answer!==forestMicroLessons[activeLesson]?.best)return true;
    const prior=activeStone;
    if(saveForestLesson(activeLesson)){
      refreshStones(root);
      if(forestStoneStatus(prior).finished)completionPreview(root,prior);
      else openStone(root,prior);
    }else{errorMessage='Could not save completion. No earlier learning records were changed.';paintExercise(root);}
  }else if(control.hasAttribute('data-forest-mark-tool')){
    const id=control.dataset.forestMarkTool,status=forestStoneStatus(activeStone),prior=activeStone;
    if(status?.next!==id||getForestPlayableLesson(id)?.type!=='tool')return true;
    if(saveForestLesson(id)){
      refreshStones(root);
      if(forestStoneStatus(prior).finished)completionPreview(root,prior);
      else openStone(root,prior);
    }else display(root,modalTop(prior,status)+'<p role="alert">Could not save completion. Check your saved work settings.</p>');
  }
  return true;
}
export function activateForestLessonEnhancement(doc=typeof document==='undefined'?null:document){
  if(!doc||doc.documentElement?.dataset.forestLessonsRuntime==='five-stones')return;
  doc.documentElement.dataset.forestLessonsRuntime='five-stones';
  const run=()=>{
    const root=doc.querySelector('#main [data-living-trail][data-trail-world="forest"]');
    if(root)decorateForest(root);
  };
  const refreshVisible=()=>{
    const root=doc.querySelector('#main [data-living-trail][data-trail-world="forest"]');
    if(root?.dataset.forestLessonsEnhanced==='five-stones')refreshStones(root);
    else run();
  };
  // Keep an already-open trail accurate when account progress changes in another
  // tab, or when the user returns after an account sync or native mission.
  doc.defaultView?.addEventListener('storage',event=>{if(event.key===KEY||event.key===null)refreshVisible();});
  doc.defaultView?.addEventListener('focus',refreshVisible);
  doc.addEventListener('visibilitychange',()=>{if(!doc.hidden)refreshVisible();});
  doc.addEventListener('click',event=>{
    const root=event.target.closest?.('#main [data-living-trail][data-trail-world="forest"]');
    if(!root)return;
    if(actionClick(event,root))return;
    const button=event.target.closest('[data-trail-node]');
    if(button){event.preventDefault();event.stopImmediatePropagation();openStone(root,button.dataset.trailNode);}
  },true);
  const observer=new MutationObserver(run),main=doc.getElementById('main');
  if(main)observer.observe(main,{childList:true,subtree:false});
  run();
  return ()=>observer.disconnect();
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>activateForestLessonEnhancement(),{once:true});
  else activateForestLessonEnhancement();
}
