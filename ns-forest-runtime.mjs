/**
 * Nobody's Simple — Forest lesson progression, direct-upload edition.
 * This module ENHANCES the original Forest map without replacing its renderer,
 * SVG landscape, road, stones, SVG icons, layout, or other four worlds.
 *
 * Existing mission and tools remain in their original routes. Seven authored
 * interactive practice lessons run inside the existing Forest modal.
 */
import { forestStoneLessonGroups, getForestPlayableLesson } from './ns-forest-curriculum.mjs';
import { forestMicroLessons } from './ns-forest-micro-lessons.mjs';

const KEY = 'ns-account-learning-v2';
const NODES = ['reality-sorter','reality-map','assumption-finder'];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key = lessonId => `ns-lab-lesson:forest:${lessonId}`;
const legacyKey = id => `ns-lab:forest:${id}`;

export function readForestRecords(storage = typeof localStorage === 'undefined' ? null : localStorage) {
  try {
    const value = JSON.parse(storage?.getItem(KEY) || '{}');
    return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  } catch { return {}; }
}
export function isForestLessonDone(id, records = readForestRecords()) {
  if (!Object.values(forestStoneLessonGroups).some(group => group.includes(id))) return false;
  return records[key(id)]?.completed === true ||
    (NODES.includes(id) && records[legacyKey(id)]?.completed === true);
}
export function forestStoneStatus(id, records = readForestRecords()) {
  const group = forestStoneLessonGroups[id];
  if (!group) return null;
  const done = group.filter(lesson => isForestLessonDone(lesson, records)).length;
  return { id, done, total: group.length, finished: done === group.length,
    next: group.find(lesson => !isForestLessonDone(lesson, records)) || null };
}
/** Completed is deliberately explicit. Preserve every other account record. */
export function saveForestLesson(id, storage = typeof localStorage === 'undefined' ? null : localStorage) {
  if (!Object.values(forestStoneLessonGroups).some(group => group.includes(id))) return false;
  try {
    const prior = JSON.parse(storage.getItem(KEY) || '{}');
    if (!prior || typeof prior !== 'object' || Array.isArray(prior)) return false;
    const now = new Date().toISOString();
    prior[key(id)] = { kind: 'life-lab-lesson', completed: true, completedAt: now, updatedAt: now };
    // The original Forest renderer advances only after a full stone. All three
    // original activities are last in their groups, so save their legacy keys.
    if (NODES.includes(id)) prior[legacyKey(id)] = { kind:'life-lab-activity', completed:true, completedAt:now, updatedAt:now };
    storage.setItem(KEY, JSON.stringify(prior));
    return true;
  } catch { return false; }
}

function currentStone(records = readForestRecords()) {
  return NODES.find(id => !forestStoneStatus(id, records).finished) || NODES.at(-1);
}

function decorateForest(root) {
  if (!root || root.dataset.forestLessonsEnhanced === 'true') return;
  root.dataset.forestLessonsEnhanced = 'true';
  for (const node of root.querySelectorAll('[data-trail-node]')) {
    const id = node.dataset.trailNode;
    const group = forestStoneLessonGroups[id];
    if (!group) continue;
    const dots = document.createElement('span');
    dots.className = 'ns-trail-lesson-dots';
    dots.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < group.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'ns-trail-lesson-dot';
      dot.style.setProperty('--dot-angle', `${45 + (360 * i / group.length)}deg`);
      dots.append(dot);
    }
    node.append(dots);
  }
  refreshDots(root);
}
function refreshDots(root) {
  const records = readForestRecords();
  for (const node of root.querySelectorAll('[data-trail-node]')) {
    const id = node.dataset.trailNode;
    const status = forestStoneStatus(id, records);
    if (!status) continue;
    const group = forestStoneLessonGroups[id];
    node.querySelectorAll('.ns-trail-lesson-dot').forEach((dot,i) => {
      dot.classList.toggle('is-done',isForestLessonDone(group[i], records));
    });
    node.setAttribute('aria-label', `${nodeTitle(id)}. ${status.done} of ${status.total} lessons complete.`);
    // Keep the original SVG type (star, scales, magnifier), rather than a
    // completed-state tick replacing it after the old renderer rerenders.
    const stone=node.querySelector('.ns-trail-stone');
    if (stone && stone.innerHTML !== stoneIcon(id)) stone.innerHTML=stoneIcon(id);
    node.classList.remove('ns-trail-node--completed','ns-trail-node--current','ns-trail-node--available');
    node.classList.add(`ns-trail-node--${status.finished?'completed':currentStone(records)===id?'current':'available'}`);
  }
  // The original renderer advances on legacy stone completion; this also
  // updates the avatar immediately after a new explicit lesson completion.
  const next=root.querySelector(`[data-trail-node="${currentStone(records)}"]`);
  if (next) {
    const walker=root.querySelector('.ns-trail-walker');
    const start=root.querySelector('.ns-trail-start');
    if (walker && walker.parentElement!==next) next.append(walker);
    if (start) {
      if (start.parentElement!==next) next.append(start);
      start.textContent=NODES.every(n=>forestStoneStatus(n,records).finished)?'UNIT 1 PRACTISED':'NEXT LESSON';
    }
  }
}
function nodeTitle(id) { return ({'reality-sorter':'Reality Sorter','reality-map':'Reality Map','assumption-finder':'Assumption Finder'})[id] || id; }

let activeDialog = null;
let activeNode = null;
let activeLesson = null;
let answer = -1;
let errorMessage = '';
function dialogFor(root) {return root.querySelector('[data-trail-dialog]');}
function display(root, html) {
  const dialog = dialogFor(root);
  if (!dialog) return;
  activeDialog = dialog;
  const body = dialog.querySelector('[data-trail-dialog-body]');
  if (!body) return;
  body.innerHTML = html;
  if (!dialog.open) { if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open',''); }
  body.querySelector('[data-trail-close], [data-forest-start]')?.focus({preventScroll:true});
}
function modalTop(id, status) {
  return `<div class="ns-trail-dialog__top"><span class="ns-trail-dialog-icon" aria-hidden="true">${stoneIcon(id)}</span><button type="button" class="ns-trail-dialog-close" data-trail-close aria-label="Close lesson preview">×</button></div>
  <p class="ns-trail-eyebrow">THE FOREST · UNIT 1 · ${status.done} OF ${status.total} LESSONS</p>
  <h2 id="ns-trail-dialog-title">${esc(nodeTitle(id))}</h2>
  <p class="ns-forest-progress-label" role="status">${status.done} / ${status.total} lessons complete</p>`;
}
function stoneIcon(id) {
  const paths = {
    'reality-sorter':'<path d="m12 2 3.2 6.6 7.3 1.1-5.3 5.2 1.3 7.3L12 18.7l-6.5 3.5 1.3-7.3-5.3-5.2 7.3-1.1Z" fill="currentColor" stroke-linejoin="round"/>',
    'reality-map':'<path d="M12 3v17M5 6h14M5 6 2 13h6L5 6Zm14 0-3 7h6l-3-7ZM8 21h8"/>',
    'assumption-finder':'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[id] || ''}</svg>`;
}
function openStone(root, id) {
  if (!forestStoneLessonGroups[id]) return;
  activeNode = id;
  activeLesson = null;
  answer = -1;
  errorMessage = '';
  const records = readForestRecords();
  const status = forestStoneStatus(id,records);
  const nodeIndex = NODES.indexOf(id);
  const previous = nodeIndex > 0 ? forestStoneStatus(NODES[nodeIndex-1],records) : null;
  const locked = previous && !previous.finished;
  const header = modalTop(id,status);
  if (locked) {
    display(root,`${header}<p>Finish the lessons at the previous stepping stone to unlock this one.</p><button type="button" class="ns-trail-mark-complete" data-trail-close>Back to the Forest</button>`);
    return;
  }
  if (status.finished) {
    display(root,`${header}<p>You have completed this stone. Your earlier lessons remain available for review.</p>
      <div class="ns-forest-lesson-list">${forestStoneLessonGroups[id].map((lesson,index)=>`<button type="button" data-forest-review="${esc(lesson)}">${index+1}. ${esc(getForestPlayableLesson(lesson).title)} <span>✓</span></button>`).join('')}</div>`);
    return;
  }
  const lesson = getForestPlayableLesson(status.next);
  if (!lesson) return;
  const desc = lesson.type === 'lesson' ? 'A short interactive practice with feedback.' : lesson.type === 'mission' ? 'The original six-stage Reality Sorter mission.' : 'An existing practical tool.';
  const action = lesson.type === 'lesson' ? `<button type="button" class="ns-trail-dialog-go ns-forest-start-btn" data-forest-start="${esc(status.next)}">Start lesson →</button>` :
    `<a class="ns-trail-dialog-go" href="${esc(lesson.href)}">${lesson.type==='mission'?'Start mission':'Open tool'} →</a>`;
  const mark = lesson.type === 'tool' ? `<button type="button" class="ns-trail-mark-complete" data-forest-mark-tool="${esc(status.next)}">I've practised this tool · mark lesson complete</button><p class="ns-trail-dialog-note">Mark complete after using the tool. You can revisit it any time.</p>` : '';
  display(root,`${header}<p class="ns-forest-next-label">NEXT · LESSON ${status.done+1} OF ${status.total}</p><h3 class="ns-forest-next-title">${esc(lesson.title)}</h3><p>${desc}</p>${action}${mark}<p class="ns-trail-dialog-note">This stone stays in place while you complete its lessons.</p>`);
}
function beginExercise(root,id) {
  if (!forestMicroLessons[id]) return;
  activeLesson = id;answer=-1;errorMessage='';
  paintExercise(root);
}
function paintExercise(root) {
  const id=activeLesson,d=forestMicroLessons[id];
  if (!d) return;
  const lesson=getForestPlayableLesson(id);
  const status=forestStoneStatus(activeNode);
  const valid=answer===d.best;
  const choiceMarkup=d.choices.map(([label],i)=>`<button type="button" class="ns-forest-choice${answer===i?' is-selected':''}" data-forest-choice="${i}" aria-pressed="${String(answer===i)}"><strong>${i+1}</strong><span>${esc(label)}</span></button>`).join('');
  const explanation=answer<0?'':`<div class="ns-forest-explanation" role="status"><strong>${valid?'Useful distinction':'Consider another possibility'}</strong><p>${esc(d.choices[answer][1])}</p>${valid?`<p>${esc(d.principle)}</p><p><strong>Try it in life:</strong> ${esc(d.transfer)}</p>`:''}</div>`;
  display(root,`${modalTop(activeNode,status)}<p class="ns-forest-next-label">INTERACTIVE LESSON</p><h3 class="ns-forest-next-title">${esc(lesson.title)}</h3>
    <p class="ns-forest-scenario">${esc(d.lead)}</p><p><strong>${esc(d.question)}</strong></p><div class="ns-forest-choices" role="group" aria-label="Select an answer">${choiceMarkup}</div>
    ${explanation}${errorMessage?`<p role="alert">${esc(errorMessage)}</p>`:''}
    <button type="button" class="ns-trail-dialog-go ns-forest-start-btn" data-forest-finish="${esc(id)}" ${valid?'':'disabled'}>Complete lesson →</button>
    <p class="ns-trail-dialog-note">This is a teaching exercise, not a test of your character or emotions. Only completion is saved.</p>`);
}
function handleForestAction(event, root) {
  const control = event.target.closest('[data-forest-start],[data-forest-choice],[data-forest-finish],[data-forest-mark-tool],[data-forest-review]');
  if (!control || !root.contains(control)) return false;
  event.preventDefault(); event.stopImmediatePropagation();
  if (control.hasAttribute('data-forest-start')) beginExercise(root,control.dataset.forestStart);
  else if (control.hasAttribute('data-forest-choice')) {
    answer=Number(control.dataset.forestChoice);paintExercise(root);
    dialogFor(root)?.querySelector(`[data-forest-choice="${answer}"]`)?.focus({preventScroll:true});
  } else if (control.hasAttribute('data-forest-review')) {
    const id=control.dataset.forestReview;
    if (forestMicroLessons[id]) beginExercise(root,id);
    else {
      const meta=getForestPlayableLesson(id);
      if (meta?.href) window.location.hash=meta.href;
    }
  } else if (control.hasAttribute('data-forest-finish')) {
    if (activeLesson!==control.dataset.forestFinish || answer!==forestMicroLessons[activeLesson]?.best) return true;
    if (saveForestLesson(activeLesson)) {refreshDots(root);openStone(root,activeNode);}
    else {errorMessage='Could not save completion. Your previous records were not changed.';paintExercise(root);}
  } else if (control.hasAttribute('data-forest-mark-tool')) {
    const id=control.dataset.forestMarkTool, status=forestStoneStatus(activeNode);
    if (status?.next!==id || getForestPlayableLesson(id)?.type!=='tool') return true;
    if (saveForestLesson(id)) {refreshDots(root);openStone(root,activeNode);}
    else display(root,modalTop(activeNode,status)+'<p role="alert">Could not save. Check your saved-work settings.</p>');
  }
  return true;
}

/** Attach once at the document layer; route-specific action only. */
export function activateForestLessonEnhancement(doc = typeof document==='undefined'?null:document) {
  if (!doc || doc.documentElement?.dataset.forestLessonsRuntime === 'true') return;
  doc.documentElement.dataset.forestLessonsRuntime='true';
  const run = () => {
    const root = doc.querySelector('#main [data-living-trail][data-trail-world="forest"]');
    if (root) decorateForest(root);
  };
  doc.addEventListener('click',event=>{
    const root=event.target.closest?.('#main [data-living-trail][data-trail-world="forest"]');
    if (!root) return;
    if (handleForestAction(event,root)) return;
    const stone=event.target.closest('[data-trail-node]');
    if (stone) {
      event.preventDefault();event.stopImmediatePropagation();
      openStone(root,stone.dataset.trailNode);
    }
  },true);
  const watcher=new MutationObserver(() => run());
  const main=doc.getElementById('main');
  if (main) watcher.observe(main,{childList:true,subtree:false});
  run();
  return () => watcher.disconnect();
}
if (typeof document!=='undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',()=>activateForestLessonEnhancement(),{once:true});
  else activateForestLessonEnhancement();
}
