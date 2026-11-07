import {otherTrailWorldIds, otherTrailWorldMeta, otherTrailCurricula, getOtherTrailUnit} from './ns-other-trails-curriculum.mjs';

const STORAGE_KEY = 'ns-account-learning-v2';
const BASE_HEIGHT = 14970;
const EXTRA_HEIGHT = 220;
const FIRST_UNIT_HEIGHT = 580;
const FIRST_UNIT_LOCALS = [525,420,315,210,105];
const DEFAULT_LOCALS = [304,238,172,106,40];
const ICONS = Object.freeze({
  notice:'<path d="m12 2 8 4v6c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6l8-4Z"/><path d="M12 7v5"/><circle cx="12" cy="15.5" r="1.1" fill="currentColor" stroke="none"/>',
  discover:'<path d="M3 5q4-2 9 1 5-3 9-1v14q-4-2-9 1-5-3-9-1Z M12 6v14"/>',
  compare:'<path d="M12 3v17M5 6h14M5 6 2 13h6L5 6Zm14 0-3 7h6l-3-7ZM8 21h8"/>',
  rehearse:'<path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9h8M8 12h6"/>',
  capstone:'<path d="m12 2 3.2 6.6 7.3 1.1-5.3 5.2 1.3 7.3L12 18.7l-6.5 3.5 1.3-7.3-5.3-5.2 7.3-1.1Z" fill="currentColor" stroke-linejoin="round"/>',
  apply:'<path d="M12 21v-10M12 14C3 14 3 7 3 4c6 0 9 3 9 10Zm0 0c0-8 3-10 9-10 0 7-3 10-9 10Z"/>'
});
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const recordKey = (world, lessonId) => `ns-lab-lesson:${world}:${lessonId}`;

function trailX(y, world='forest', height=BASE_HEIGHT){
  const phases={meadow:.15,forest:1.08,bridge:2.14,workshop:2.8,observatory:3.36};
  const d=height-y,p=phases[world]??1.08;
  return Math.max(109,Math.min(371,240+112*Math.sin(d/174+p)+29*Math.sin(d/565+p*.67)));
}
function iconSvg(type){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[type]||ICONS.discover}</svg>`;}
function worldMeta(world){return otherTrailWorldMeta[world];}
function unitSteps(world, unitNumber, stoneId=null){
  const unit = getOtherTrailUnit(world, unitNumber);
  if(!unit) return [];
  return stoneId ? unit.steps.filter(step => step.stoneId === stoneId) : unit.steps.slice();
}
function stoneMeta(world, stoneId){return worldMeta(world).stoneMeta.find(stone => stone.id === stoneId) || null;}
export function readOtherTrailRecords(storage = typeof localStorage === 'undefined' ? null : localStorage){
  try {
    const raw = JSON.parse(storage?.getItem(STORAGE_KEY) || '{}');
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  } catch { return {}; }
}
export function isOtherTrailLessonDone(world, lessonId, records = readOtherTrailRecords()){
  return records[recordKey(world, lessonId)]?.completed === true;
}
export function saveOtherTrailLesson(world, lessonId, storage = typeof localStorage === 'undefined' ? null : localStorage){
  const valid = otherTrailCurricula[world]?.some(unit => unit.steps.some(step => step.id === lessonId));
  if(!valid) return false;
  try {
    const data = JSON.parse(storage.getItem(STORAGE_KEY) || '{}');
    if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
    const now = new Date().toISOString();
    data[recordKey(world, lessonId)] = {kind:'life-lab-lesson',completed:true,completedAt:now,updatedAt:now};
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch { return false; }
}
export function getOtherTrailSequence(world){
  return otherTrailCurricula[world].flatMap(unit => unit.stones.map(stone => ({world, unit:unit.number, stoneId:stone.id})));
}
export function otherTrailStoneStatus(world, unitNumber, stoneId, records = readOtherTrailRecords()){
  const steps = unitSteps(world, unitNumber, stoneId);
  const done = steps.filter(step => isOtherTrailLessonDone(world, step.id, records)).length;
  return {world, unit:Number(unitNumber), stoneId, done, total:steps.length, finished:done===steps.length,
    next:steps.find(step => !isOtherTrailLessonDone(world, step.id, records)) || null};
}
export function nextOtherTrailStone(world, records = readOtherTrailRecords()){
  return getOtherTrailSequence(world).find(item => !otherTrailStoneStatus(world, item.unit, item.stoneId, records).finished) || null;
}
function overallIndex(world, unitNumber, stoneId){
  return getOtherTrailSequence(world).findIndex(item => item.unit===Number(unitNumber) && item.stoneId===stoneId);
}
function extensionSVG(world){
  const meta = worldMeta(world);
  const x = y => trailX(BASE_HEIGHT+y, world).toFixed(2);
  let d = `M ${x(0)} 0`;
  for(let y=10; y<=EXTRA_HEIGHT+10; y+=10) d += ` L ${x(y)} ${y}`;
  return `<svg class="ns-othertrail-extension-svg" viewBox="0 0 480 ${EXTRA_HEIGHT}" preserveAspectRatio="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ns-${world}-tail-road" x1="0" y1="0" x2="1" y2="0">
        <stop stop-color="${meta.tailRoad[0]}"/><stop offset="49%" stop-color="${meta.tailRoad[1]}"/><stop offset="100%" stop-color="${meta.tailRoad[2]}"/>
      </linearGradient>
      <linearGradient id="ns-${world}-tail-ground" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${meta.tailGround}"/><stop offset="100%" stop-color="${meta.tailDecor}"/></linearGradient>
    </defs>
    <rect width="480" height="${EXTRA_HEIGHT}" fill="url(#ns-${world}-tail-ground)"/>
    <path d="${d}" stroke="#f6f2d8" stroke-width="258" fill="none" opacity=".09"/>
    <path d="${d}" stroke="#1b5b4d" stroke-width="166" fill="none" opacity=".09"/>
    <path d="${d}" stroke="#6eaa4a" stroke-width="116" opacity=".18" fill="none"/>
    <path d="${d}" stroke="url(#ns-${world}-tail-road)" stroke-width="94" fill="none"/>
    <path d="${d}" stroke="#fff4cc" stroke-width="68" opacity=".58" fill="none"/>
    <g fill="${meta.tailDecor}" opacity=".72"><ellipse cx="56" cy="195" rx="52" ry="18"/><ellipse cx="435" cy="168" rx="57" ry="19"/><ellipse cx="120" cy="212" rx="29" ry="14"/></g>
  </svg>`;
}
function makeNode(world, unitNumber, stone){
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ns-trail-node ns-othertrail-node';
  button.dataset.nsUpgradeNode = 'true';
  button.dataset.nsUpgradeWorld = world;
  button.dataset.nsUpgradeUnit = String(unitNumber);
  button.dataset.nsUpgradeStone = stone.id;
  button.setAttribute('aria-haspopup','dialog');
  button.innerHTML = `<span class="ns-trail-stone" aria-hidden="true">${iconSvg(stone.type)}</span><span class="ns-trail-node-title"><strong>${escapeText(stone.title)}</strong><small>${escapeText(stone.objective)}</small></span>`;
  return button;
}
function ringSvg(done, total){
  const r=41.5,circ=2*Math.PI*r,arc=circ/total,gap=8.5,draw=arc-gap;
  const arcs = Array.from({length:total}, (_, i) => `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${i<done?'#74cb2a':'#d5ddd9'}" stroke-width="5.8" stroke-linecap="round" stroke-dasharray="${draw.toFixed(2)} ${(circ-draw).toFixed(2)}" stroke-dashoffset="${(-i*arc+gap/2).toFixed(2)}" transform="rotate(-90 50 50)"/>`).join('');
  return `<svg class="ns-othertrail-progress-ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${arcs}</svg>`;
}
function ensureWorldLayout(root, world){
  if(root.dataset.nsOtherTrailEnhanced === world) return;
  const map = root.querySelector('[data-trail-map]');
  const unitOne = root.querySelector('[data-unit-number="1"]');
  if(!map || !unitOne) return;
  root.dataset.nsOtherTrailEnhanced = world;
  map.style.height = `${BASE_HEIGHT+EXTRA_HEIGHT}px`;
  map.style.setProperty('--trail-scene-height', `${BASE_HEIGHT+EXTRA_HEIGHT}px`);
  unitOne.style.height = `${FIRST_UNIT_HEIGHT}px`;
  if(!map.querySelector(`.ns-othertrail-scene-tail[data-world="${world}"]`)){
    const tail = document.createElement('div');
    tail.className = 'ns-othertrail-scene-tail';
    tail.dataset.world = world;
    tail.innerHTML = extensionSVG(world);
    map.append(tail);
  }
  root.querySelectorAll('[data-unit-number]').forEach(section => {
    const unitNumber = Number(section.dataset.unitNumber);
    const unit = getOtherTrailUnit(world, unitNumber);
    if(!unit || section.dataset.nsOtherTrailUnit === 'true') return;
    section.dataset.nsOtherTrailUnit = 'true';
    section.querySelectorAll('.ns-trail-node,.ns-trail-future-node').forEach(node => {
      node.style.display = 'none';
      node.setAttribute('aria-hidden','true');
      node.tabIndex = -1;
    });
    const positions = unitNumber===1 ? FIRST_UNIT_LOCALS : DEFAULT_LOCALS;
    const top = parseFloat(section.style.top || `${(40-unitNumber)*360}`);
    unit.stones.forEach((stone, index) => {
      const node = makeNode(world, unitNumber, stone);
      const localY = positions[index], absoluteY = top + localY;
      const x = (100*trailX(absoluteY, world)/480).toFixed(2);
      node.style.setProperty('--node-y', `${localY}px`);
      node.style.setProperty('--node-x', `${x}%`);
      const title = node.querySelector('.ns-trail-node-title');
      if(title) title.dataset.side = Number(x) > 50 ? 'left' : 'right';
      section.append(node);
    });
  });
}
function updateWorld(root, world){
  ensureWorldLayout(root, world);
  const records = readOtherTrailRecords();
  const sequence = getOtherTrailSequence(world);
  const current = nextOtherTrailStone(world, records);
  const currentIndex = current ? overallIndex(world, current.unit, current.stoneId) : Infinity;
  sequence.forEach(item => {
    const node = root.querySelector(`[data-ns-upgrade-world="${world}"][data-ns-upgrade-unit="${item.unit}"][data-ns-upgrade-stone="${item.stoneId}"]`);
    if(!node) return;
    const status = otherTrailStoneStatus(world, item.unit, item.stoneId, records);
    const index = overallIndex(world, item.unit, item.stoneId);
    const unlocked = index <= currentIndex;
    node.classList.remove('ns-trail-node--completed','ns-trail-node--current','ns-trail-node--available','ns-trail-node--locked','ns-othertrail-stone-complete');
    node.classList.add(`ns-trail-node--${status.finished?'completed':index===currentIndex?'current':unlocked?'available':'locked'}`);
    node.classList.toggle('ns-othertrail-stone-complete', status.finished);
    node.querySelector('.ns-othertrail-progress-ring')?.remove();
    if(status.total > 1) node.insertAdjacentHTML('beforeend', ringSvg(status.done, status.total));
    const small = node.querySelector('.ns-trail-node-title small');
    if(small) small.textContent = status.finished ? 'COMPLETE' : index===currentIndex ? `${status.done} / ${status.total} done` : unlocked ? `${status.done} / ${status.total} done` : 'LOCKED';
    const meta = stoneMeta(world, item.stoneId);
    node.setAttribute('aria-label', `${worldMeta(world).title}. Unit ${item.unit}. ${meta?.title || item.stoneId}. ${status.done} of ${status.total} lessons complete.`);
  });
  const walkerNode = current ? root.querySelector(`[data-ns-upgrade-world="${world}"][data-ns-upgrade-unit="${current.unit}"][data-ns-upgrade-stone="${current.stoneId}"]`) : null;
  if(walkerNode){
    const walker = root.querySelector('.ns-trail-walker');
    const start = root.querySelector('.ns-trail-start');
    if(walker && walker.parentElement !== walkerNode) walkerNode.append(walker);
    if(start){
      if(start.parentElement !== walkerNode) walkerNode.append(start);
      start.textContent = 'NEXT LESSON';
    }
  }
}
function scenarioFor(world, step){
  const unitTitle = getOtherTrailUnit(world, step.unit)?.title || '';
  const themes = {
    meadow:{lead:'You pause and notice a bodily or emotional signal during an ordinary day.', principle:'Signals are information, not orders. Naming them can make your next step gentler and clearer.', transfer:'Try naming the feeling and the need before you decide what to do next.'},
    bridge:{lead:'You are in a social moment where tone, needs or boundaries matter.', principle:'Clear communication works best when you notice the moment before reacting automatically.', transfer:'Try one clearer sentence or one calmer question in your next conversation.'},
    workshop:{lead:'You are facing a task, decision or routine that could easily stall.', principle:'Action gets easier when the target is clear and the path has less friction.', transfer:'Choose the smallest version of the task and make it easier to start.'},
    observatory:{lead:'You are reflecting on values, identity or the pressures around you.', principle:'A clearer perspective appears when you notice what matters and the lenses shaping your view.', transfer:'Choose one small action that fits your values a little more closely today.'}
  };
  const q = {
    learn:'Which response best fits the lesson at the start of this unit?',
    explore:'What is the most useful thing to notice before deciding what the moment means?',
    compare:'Which option best compares the possibilities instead of jumping to one conclusion?',
    practise:'Which response shows the skill in action most clearly?',
    review:'Which answer best recalls the core idea of this lesson?',
    choose:'Which next step is the most flexible and useful choice?',
    capstone:'Which response best brings the whole unit together?',
    apply:'Which real-life action is the best fit for carrying this lesson forward?'
  };
  const choices = {
    meadow:[
      ['Judge yourself quickly and force the feeling away.','That usually increases pressure without teaching you anything about what the signal means.'],
      ['Notice the signal, name it simply, and choose one kind response.','This keeps the lesson grounded in awareness plus care.'],
      ['Ignore the signal until it becomes impossible to manage.','Waiting until the signal overwhelms you removes your chance to respond early.']
    ],
    bridge:[
      ['Assume what the other person meant and react from that assumption.','That skips the observation stage and can create avoidable conflict.'],
      ['Notice the moment, communicate clearly, and choose either repair or a boundary.','This uses the relationship skill rather than a defensive impulse.'],
      ['Say nothing now but resent it later.','That keeps the problem hidden and makes repair less likely.']
    ],
    workshop:[
      ['Wait for ideal motivation before doing anything.','That makes action depend on mood rather than structure.'],
      ['Make the task concrete, reduce friction, and take the next doable step.','This matches the action-focused logic of the Workshop.'],
      ['Keep planning without choosing a first action.','Planning alone can feel productive while still avoiding movement.']
    ],
    observatory:[
      ['Copy the loudest expectation around you without reflection.','That hides your own perspective instead of clarifying it.'],
      ['Notice what matters, examine the story, and choose a more aligned response.','This integrates values, identity and context thoughtfully.'],
      ['Treat uncertainty about identity as proof that nothing matters.','Uncertainty does not erase your values or your ability to choose a direction.']
    ]
  };
  const best = 1;
  return {
    lead:`${themes[world].lead} Unit ${step.unit}: ${unitTitle}.`,
    question:q[step.kind] || q.learn,
    choices:choices[world],
    best,
    principle:themes[world].principle,
    transfer:themes[world].transfer
  };
}
let active = {world:null,unit:0,stoneId:null,lessonId:null,choice:-1};
function dialogFor(root){return root.querySelector('[data-trail-dialog]');}
function renderDialog(root, html){
  const dlg = dialogFor(root), body = dlg?.querySelector('[data-trail-dialog-body]');
  if(!dlg || !body) return;
  body.innerHTML = html;
  if(!dlg.open){ if(typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open',''); }
  body.querySelector('[data-trail-close],[data-upgrade-start],[data-upgrade-next],[data-upgrade-review],[data-upgrade-finish]')?.focus({preventScroll:true});
}
function dialogTop(world, unitNumber, stoneId, status){
  const meta = stoneMeta(world, stoneId);
  return `<div class="ns-trail-dialog__top"><span class="ns-trail-dialog-icon" aria-hidden="true">${iconSvg(meta?.type || 'discover')}</span><button type="button" class="ns-trail-dialog-close" data-trail-close aria-label="Close lesson preview">×</button></div>
    <p class="ns-trail-eyebrow">${escapeText(worldMeta(world).title)} · UNIT ${unitNumber} · STONE ${getOtherTrailUnit(world, unitNumber).stones.findIndex(s => s.id===stoneId)+1} OF 5</p>
    <h2 id="ns-trail-dialog-title">${escapeText(meta?.title || '')}</h2>
    <p class="ns-forest-progress-label" role="status">${status.done} of ${status.total} ${status.total===1?'lesson':'lessons'} complete</p>`;
}
function completionScreen(root, world, unitNumber, stoneId){
  const status = otherTrailStoneStatus(world, unitNumber, stoneId);
  const next = nextOtherTrailStone(world);
  const nextButton = next ? `<button type="button" class="ns-trail-dialog-go" data-upgrade-next="${escapeText([next.world,next.unit,next.stoneId].join('|'))}">Go to Unit ${next.unit} · ${escapeText(stoneMeta(next.world, next.stoneId)?.title || '')} →</button>` : '<p>You have completed this trail for now. You can revisit any lesson whenever you like.</p>';
  renderDialog(root, dialogTop(world, unitNumber, stoneId, status)+`<p class="ns-forest-stone-finished">✓ Stone complete!</p>${nextButton}<button type="button" class="ns-trail-mark-complete" data-trail-close>Back to the trail</button>`);
}
function openStone(root, world, unitNumber, stoneId){
  const records = readOtherTrailRecords();
  const status = otherTrailStoneStatus(world, unitNumber, stoneId, records);
  const current = nextOtherTrailStone(world, records);
  const locked = current && overallIndex(world, unitNumber, stoneId) > overallIndex(world, current.unit, current.stoneId);
  const head = dialogTop(world, unitNumber, stoneId, status);
  if(locked){
    renderDialog(root, head + `<p>Finish the earlier stones first to unlock this one.</p><button type="button" class="ns-trail-mark-complete" data-trail-close>Back to the trail</button>`);
    return;
  }
  const steps = unitSteps(world, unitNumber, stoneId);
  if(status.finished){
    const reviews = steps.map((step, index) => `<button type="button" data-upgrade-review="${escapeText(step.id)}"><span>${index+1}. ${escapeText(step.title)}</span><span aria-label="Completed">✓</span></button>`).join('');
    renderDialog(root, head + `<p>You've completed this stone. Revisit any lesson below.</p><div class="ns-forest-lesson-list">${reviews}</div>`);
    return;
  }
  const step = status.next;
  renderDialog(root, head + `<p class="ns-forest-next-label">NEXT · LESSON ${status.done+1} OF ${status.total}</p><h3 class="ns-forest-next-title">${escapeText(step.title)}</h3><p>${escapeText(step.detail)}</p><button type="button" class="ns-trail-dialog-go ns-forest-start-btn" data-upgrade-start="${escapeText(step.id)}">Start lesson →</button><p class="ns-trail-dialog-note">${escapeText(stoneMeta(world, stoneId)?.objective || '')}</p>`);
}
function beginLesson(root, world, lessonId){
  const unit = otherTrailCurricula[world].find(item => item.steps.some(step => step.id===lessonId));
  const step = unit?.steps.find(item => item.id===lessonId);
  if(!step) return;
  active = {world, unit:unit.number, stoneId:step.stoneId, lessonId, choice:-1};
  paintLesson(root);
}
function paintLesson(root){
  const step = getOtherTrailUnit(active.world, active.unit)?.steps.find(item => item.id===active.lessonId);
  if(!step) return;
  const status = otherTrailStoneStatus(active.world, active.unit, active.stoneId);
  const scenario = scenarioFor(active.world, step);
  const correct = active.choice === scenario.best;
  const choices = scenario.choices.map((choice, index) => `<button type="button" class="ns-forest-choice${active.choice===index?' is-selected':''}" data-upgrade-choice="${index}" aria-pressed="${active.choice===index}"><strong>${index+1}</strong><span>${escapeText(choice[0])}</span></button>`).join('');
  const feedback = active.choice < 0 ? '' : `<div class="ns-forest-explanation" role="status"><strong>${correct?'Useful move':'Try a more flexible option'}</strong><p>${escapeText(scenario.choices[active.choice][1])}</p>${correct?`<p>${escapeText(scenario.principle)}</p><p><strong>Try it in life:</strong> ${escapeText(scenario.transfer)}</p>`:''}</div>`;
  renderDialog(root, dialogTop(active.world, active.unit, active.stoneId, status) + `<p class="ns-forest-next-label">INTERACTIVE LESSON</p><h3 class="ns-forest-next-title">${escapeText(step.title)}</h3><p class="ns-forest-scenario">${escapeText(scenario.lead)}</p><p><strong>${escapeText(scenario.question)}</strong></p><div class="ns-forest-choices" role="group" aria-label="Choose a response">${choices}</div>${feedback}<button type="button" class="ns-trail-dialog-go ns-forest-start-btn" data-upgrade-finish="${escapeText(active.lessonId)}" ${correct?'':'disabled'}>Complete lesson →</button><p class="ns-trail-dialog-note">Completion is only saved when you choose it.</p>`);
}
function handleAction(event, root){
  const control = event.target.closest('[data-upgrade-start],[data-upgrade-choice],[data-upgrade-finish],[data-upgrade-review],[data-upgrade-next]');
  if(!control || !root.contains(control)) return false;
  event.preventDefault();
  event.stopImmediatePropagation();
  if(control.hasAttribute('data-upgrade-next')){
    const [world, unit, stoneId] = control.dataset.upgradeNext.split('|');
    openStone(root, world, Number(unit), stoneId);
  } else if(control.hasAttribute('data-upgrade-start')){
    const lessonId = control.dataset.upgradeStart;
    const world = active.world || root.dataset.trailWorld;
    beginLesson(root, world, lessonId);
  } else if(control.hasAttribute('data-upgrade-review')){
    beginLesson(root, root.dataset.trailWorld, control.dataset.upgradeReview);
  } else if(control.hasAttribute('data-upgrade-choice')){
    active.choice = Number(control.dataset.upgradeChoice);
    paintLesson(root);
  } else if(control.hasAttribute('data-upgrade-finish')){
    if(control.dataset.upgradeFinish !== active.lessonId) return true;
    const stepId = active.lessonId;
    const world = active.world, unit = active.unit, stoneId = active.stoneId;
    const step = getOtherTrailUnit(world, unit)?.steps.find(item => item.id===stepId);
    if(!step) return true;
    const scenario = scenarioFor(world, step);
    if(active.choice !== scenario.best) return true;
    if(saveOtherTrailLesson(world, stepId)){
      updateWorld(root, world);
      if(otherTrailStoneStatus(world, unit, stoneId).finished) completionScreen(root, world, unit, stoneId);
      else openStone(root, world, unit, stoneId);
    }
  }
  return true;
}
export function activateOtherTrailEnhancement(doc = typeof document === 'undefined' ? null : document){
  if(!doc || doc.documentElement?.dataset.nsOtherTrailsRuntime === 'active') return;
  doc.documentElement.dataset.nsOtherTrailsRuntime = 'active';
  const run = () => otherTrailWorldIds.forEach(world => {
    const root = doc.querySelector(`#main [data-living-trail][data-trail-world="${world}"]`);
    if(root){ root.dataset.trailWorld = world; updateWorld(root, world); }
  });
  doc.addEventListener('click', event => {
    const root = event.target.closest?.('#main [data-living-trail]');
    if(!root || !otherTrailWorldIds.includes(root.dataset.trailWorld)) return;
    if(handleAction(event, root)) return;
    const node = event.target.closest('[data-ns-upgrade-node]');
    if(node){
      event.preventDefault();
      event.stopImmediatePropagation();
      openStone(root, node.dataset.nsUpgradeWorld, Number(node.dataset.nsUpgradeUnit), node.dataset.nsUpgradeStone);
    }
  }, true);
  const observer = new MutationObserver(run), main = doc.getElementById('main');
  if(main) observer.observe(main, {childList:true, subtree:false});
  window.addEventListener('storage', run);
  run();
  return ()=>{ observer.disconnect(); window.removeEventListener('storage', run); };
}
if(typeof document !== 'undefined'){
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => activateOtherTrailEnhancement(), {once:true});
  else activateOtherTrailEnhancement();
}
