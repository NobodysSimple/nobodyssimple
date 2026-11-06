const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const MISSION_ROUTE = '#lab/mission/reality-sorter/notice';
let cleanup = ()=>{};
export function cleanupLivingTrail(){ cleanup(); cleanup=()=>{}; }

const LESSON_TYPES = Object.freeze({
  learn:   {label:'Learn',   icon:'📖', className:'learn',   blurb:'Meet the key idea in plain English.'},
  explore: {label:'Explore', icon:'🔎', className:'explore', blurb:'Look for clues, patterns or examples.'},
  compare: {label:'Compare', icon:'⚖️', className:'compare', blurb:'Contrast different views or explanations.'},
  practise:{label:'Practise',icon:'🏋️', className:'practise',blurb:'Try a skill in a guided exercise.'},
  choose:  {label:'Choose',  icon:'☝️', className:'choose',  blurb:'Make a decision and inspect the result.'},
  apply:   {label:'Apply',   icon:'🌱', className:'apply',   blurb:'Use the idea in a real-life context.'},
  reflect: {label:'Reflect', icon:'💬', className:'reflect', blurb:'Think, check and build insight.'},
  review:  {label:'Review',  icon:'🔁', className:'review',  blurb:'Recap, quiz yourself or revisit mistakes.'},
  milestone:{label:'Milestone',icon:'⭐',className:'milestone',blurb:'A bigger checkpoint that brings ideas together.'},
  locked:  {label:'Locked',  icon:'🔒', className:'locked',  blurb:'Complete earlier steps to unlock later content.'},
  completed:{label:'Completed',icon:'✅',className:'completed',blurb:'Finished and saved.'},
  current: {label:'Current', icon:'🌟', className:'current', blurb:'Your next step.'},
});

const CHAPTERS = Object.freeze({
  forest:[
    {name:'Forest Entrance', range:'Units 1–5', line:'Begin the journey', key:'entrance'},
    {name:'Deep Woods', range:'Units 6–10', line:'Build new ideas', key:'woods'},
    {name:'Forest Stream', range:'Units 11–15', line:'Explore and connect', key:'stream'},
    {name:'The Bridge', range:'Units 16–20', line:'Compare and see more', key:'bridge'},
    {name:'Forest Meadow', range:'Units 21–25', line:'Apply in real life', key:'meadow'},
    {name:'Ridge Path', range:'Units 26–30', line:'Tackle bigger ideas', key:'ridge'},
    {name:'High Forest', range:'Units 31–35', line:'Bring it all together', key:'high'},
    {name:'Summit Lookout', range:'Units 36–40', line:'Reflect, review & grow', key:'summit'},
  ],
  meadow:[
    {name:'Open Field', range:'Units 1–5', line:'Notice what is here', key:'entrance'},
    {name:'Flower Path', range:'Units 6–10', line:'Name more clearly', key:'woods'},
    {name:'Warm Brook', range:'Units 11–15', line:'Connect body and feeling', key:'stream'},
    {name:'Gentle Rise', range:'Units 16–20', line:'Practise with care', key:'bridge'},
    {name:'Calm Meadow', range:'Units 21–25', line:'Apply in everyday life', key:'meadow'},
    {name:'Windy Hill', range:'Units 26–30', line:'Handle stronger moments', key:'ridge'},
    {name:'Golden Field', range:'Units 31–35', line:'Bring skills together', key:'high'},
    {name:'Quiet Outlook', range:'Units 36–40', line:'Review and keep', key:'summit'},
  ],
  bridge:[
    {name:'Meeting Point', range:'Units 1–5', line:'Start with perspective', key:'entrance'},
    {name:'Crossing Rails', range:'Units 6–10', line:'Build communication', key:'woods'},
    {name:'Riverbank', range:'Units 11–15', line:'Work with conflict', key:'stream'},
    {name:'Main Span', range:'Units 16–20', line:'See both sides', key:'bridge'},
    {name:'Open Landing', range:'Units 21–25', line:'Apply in relationships', key:'meadow'},
    {name:'Cliff Walk', range:'Units 26–30', line:'Tackle difficult dynamics', key:'ridge'},
    {name:'High Crossing', range:'Units 31–35', line:'Integrate the toolkit', key:'high'},
    {name:'Lookout Deck', range:'Units 36–40', line:'Reflect and refine', key:'summit'},
  ],
  workshop:[
    {name:'Work Bench', range:'Units 1–5', line:'Start small', key:'entrance'},
    {name:'Tool Wall', range:'Units 6–10', line:'Reduce friction', key:'woods'},
    {name:'Draft Table', range:'Units 11–15', line:'Compare options', key:'stream'},
    {name:'Build Frame', range:'Units 16–20', line:'Make action easier', key:'bridge'},
    {name:'Open Floor', range:'Units 21–25', line:'Apply in real tasks', key:'meadow'},
    {name:'Upper Loft', range:'Units 26–30', line:'Tackle setbacks', key:'ridge'},
    {name:'Project Bay', range:'Units 31–35', line:'Bring plans together', key:'high'},
    {name:'Roof Window', range:'Units 36–40', line:'Review and adapt', key:'summit'},
  ],
  observatory:[
    {name:'Base Camp', range:'Units 1–5', line:'Look at self and context', key:'entrance'},
    {name:'Lens Hall', range:'Units 6–10', line:'Name influences', key:'woods'},
    {name:'Night Steps', range:'Units 11–15', line:'Explore identity in context', key:'stream'},
    {name:'Sky Bridge', range:'Units 16–20', line:'Compare perspectives', key:'bridge'},
    {name:'Open Dome', range:'Units 21–25', line:'Apply to everyday life', key:'meadow'},
    {name:'Upper Ridge', range:'Units 26–30', line:'Work with systems', key:'ridge'},
    {name:'Star Deck', range:'Units 31–35', line:'Bring insights together', key:'high'},
    {name:'Summit Dome', range:'Units 36–40', line:'Reflect and keep growing', key:'summit'},
  ],
});

const TITLES = Object.freeze({
  forest:['Facts, stories & uncertainty','Observation or interpretation?','Why we assume motives','Considering other explanations','Checking the evidence','Confidence and doubt','Dealing with the unknown','Common thinking traps','Attention and selective evidence','Memory is reconstructive','Recognising confirmation bias','When thoughts spiral','Worry and prediction','Rumination and reflection','The need for certainty','Interpreting social situations','Separating feelings from facts','When information is incomplete','Patterns versus coincidences','Testing assumptions gently','Questioning first impressions','Noticing the story you tell','Thinking in probabilities','Avoiding all-or-nothing conclusions','Understanding disagreement','Reasoning under pressure','Learning from mistakes','Dealing with ambiguity','Distinguishing possibility from likelihood','Social comparison and beliefs','Interpreting intentions cautiously','Media claims and evidence','Evidence quality and sources','Spotting persuasive language','Making flexible judgments','Reasoning with competing values','When to seek more information','Transferring the skill to work','Transferring the skill to relationships','Thinking clearly in everyday life'],
  meadow:['Making sense of feelings',"Naming what's here",'Mixed emotions','Feelings and physical sensations','Listening to body signals','Emotional intensity','Emotions change over time','When feelings are hard to name','Recognising personal triggers','Feeling versus reacting','Stress signals','Understanding your needs','Comfort and regulation','Sensory patterns','Rest and recovery','Responding to overwhelm','Making space for sadness','Working with anger','Fear and uncertainty','Joy and appreciation','Shame and self-kindness','Emotional boundaries','Needs in relationships','Changing emotional patterns','Recognising rumination','Thoughts that amplify feelings','Calming without avoiding','Self-compassion in action','When feelings disagree','Healthy ways to express emotion','Finding your rhythm','Coping during transitions','Recognising your limits','Asking for support','Resilience without pressure','Practising emotional flexibility','Building helpful routines','Navigating difficult days','Applying skills in new settings','Your emotional toolkit'],
  bridge:['Understanding each other','Seeing different perspectives','Listening with curiosity','What makes communication difficult?','Needs beneath reactions','Asking rather than assuming','Clear requests','Boundaries as information','Saying no respectfully','Hearing no from others','Repairing misunderstandings','When conversations escalate','Emotion and conflict','Timing difficult conversations','Working with defensiveness','Taking responsibility without shame','Apologies that address impact','Different communication styles','Trust and uncertainty','How expectations form','Respecting autonomy','Handling disappointments','Responding to criticism','Giving constructive feedback','Asking for reassurance clearly','Recognising power differences','Friendship and reciprocity','Digital communication','Group belonging','Handling social exclusion','Conflict without winning','Negotiating different needs','Repair after a disagreement','Supporting without rescuing','Recognising unhealthy dynamics','Protecting your boundaries','Collaborative problem solving','Relationships during change','Applying skills across settings','Your relationship toolkit'],
  workshop:['From stuck to started','Clarifying what matters','Choosing one next step','Understanding procrastination','Finding friction','Reducing the starting barrier','Planning around energy','If–then plans','Small experiments','Defining a workable goal','Priorities and trade-offs','Decisions under uncertainty','Comparing options fairly','Recognising hidden constraints','Working around obstacles','Habits and environments','Designing a helpful routine','Motivation comes and goes','Making tasks manageable','Attention and distractions','Working with perfectionism','Time estimates and planning','When plans need to change','Feedback versus failure','Recovering after setbacks','Managing competing demands','Asking for practical support','Progress without streak pressure','Knowing when to pause','Working toward long projects','Values-based decisions','Risk and reversibility','Anticipating obstacles','Building consistent follow-through','Avoiding overcommitment','Experimenting with alternatives','Reviewing decisions','Adapting to life changes','Using skills in difficult weeks','Your action toolkit'],
  observatory:['Self in context','The many parts of identity','Values and what matters','Roles we occupy','How context shapes behaviour','Belonging and difference','Strengths and their limits','Labels and self-description','Identity across situations','The stories we inherit','Family and social expectations','Cultural influences','Self-criticism and standards','The self across time','Changing your mind','Who you are with others','Authenticity and safety','Comparing possible selves','Interests and exploration','Personal boundaries and identity','Social norms and pressure','The influence of institutions','Status and comparison','Stereotypes and assumptions','Seeing systems around us','Power and opportunities','Community and connection','Identity during transitions','Holding contradictions','Finding meaning in everyday life','Purpose without perfection','Learning from experience','What helps you thrive?','Values in difficult choices','Understanding privilege and barriers','Future possibilities','Adapting your self-story','Living with uncertainty about self','Making room for change','Your evolving field guide'],
});

const WORLD_META = Object.freeze({
  forest:{name:'The Forest', theme:'Facts, stories & uncertainty', line:'A richer, clearer Forest world with high contrast, wider spacing and visually distinct lesson types.', icon:'🌲', hero:'ns-character-thinking.webp', art:'ns-landscape-forest.webp'},
  meadow:{name:'The Meadow', theme:'Feelings & body', line:'Notice what is here before rushing to explain it.', icon:'🌿', hero:'ns-character-compass.webp', art:'ns-landscape-sunset.webp'},
  bridge:{name:'The Bridge', theme:'People & relationships', line:'Explore different perspectives and practise clearer communication.', icon:'🌉', hero:'ns-character-message.webp', art:'ns-landscape-mountains.webp'},
  workshop:{name:'The Workshop', theme:'Decisions & action', line:'Turn complexity into one workable next step.', icon:'🧰', hero:'ns-character-hiking.webp', art:'ns-landscape-path.webp'},
  observatory:{name:'The Observatory', theme:'Self & society', line:'See how self, context and systems interact.', icon:'🔭', hero:'ns-character-sitting.webp', art:'ns-landscape-night.webp'},
});

const WORLD_ORDER = ['forest','meadow','bridge','workshop','observatory'];
const PATTERNS = [
  ['learn','explore','compare','practise','review'],
  ['learn','explore','choose','apply','reflect'],
  ['learn','compare','practise','apply','review'],
  ['learn','explore','practise','reflect','review'],
  ['learn','compare','choose','apply','review'],
];
function lessonForType(type, unit, lessonNumber){
  const focus = unit.title;
  const verbs = {
    learn:`Meet the idea behind ${focus}`,
    explore:`Spot the clues in ${focus}`,
    compare:`Compare two ways of seeing ${focus}`,
    practise:`Try ${focus} in a guided exercise`,
    choose:`Choose a response around ${focus}`,
    apply:`Use ${focus} in a real-life scenario`,
    reflect:`Reflect on what ${focus} changes`,
    review:`Review the main distinction from ${focus}`,
  };
  const notes = {
    learn:`A short plain-English introduction to the unit focus and why it matters.`,
    explore:`A clearer example or card-sort style activity that helps the learner notice patterns without overload.`,
    compare:`A side-by-side prompt that shows how different explanations can fit the same event.`,
    practise:`A small interactive exercise that lets the learner try the skill rather than just read it.`,
    choose:`A scenario step where the learner picks a response and sees what changes.`,
    apply:`A real-life transfer step that helps carry the idea beyond the screen.`,
    reflect:`A compact reflection on what felt easy, difficult or surprising.`,
    review:`A recap challenge that brings back key distinctions and common mistakes.`,
  };
  return { type, title: verbs[type], minutes: type==='review' ? 3 : type==='apply' ? 5 : 4, detail: notes[type], status: unit.number===1 ? 'available' : 'planned', href: null, lessonNumber };
}
function buildUnits(worldId){
  return TITLES[worldId].map((title, index) => {
    const number = index + 1;
    const chapterIndex = Math.floor(index / 5);
    const pattern = PATTERNS[index % PATTERNS.length];
    const unit = {
      id: `${worldId}-unit-${number}`,
      number,
      title,
      chapterIndex,
      status: number === 1 ? 'available' : 'planned',
      summary: `${title} in a clearer, high-contrast trail with spaced-out steps and distinct lesson types.`,
      lessons: pattern.map((type, i) => lessonForType(type, {title, number}, i+1)),
    };
    if (number % 5 === 0) {
      unit.lessons[unit.lessons.length - 1] = { type:'milestone', title:`Milestone · bring ${CHAPTERS[worldId][chapterIndex].name} together`, minutes:6, detail:`A larger checkpoint that gathers the key ideas from ${CHAPTERS[worldId][chapterIndex].range}.`, status:number===1?'available':'planned', href:null, lessonNumber:5 };
    }
    return unit;
  });
}
const UNIT_DATA = Object.freeze(Object.fromEntries(WORLD_ORDER.map(id => [id, buildUnits(id)])));

(function specialForest(){
  const units = UNIT_DATA.forest;
  units[0].summary = 'Start here: learn the core distinction between what happened, the story you added, your feelings, and what remains unknown.';
  units[0].lessons = [
    { type:'learn', title:'Facts, stories & uncertainty', minutes:4, detail:'A short intro to the Forest way of thinking: observations, interpretations, feelings and unknowns.', status:'available', href:'#lab/forest', lessonNumber:1 },
    { type:'explore', title:'Observation or interpretation?', minutes:4, detail:'A quick sorting exercise about what can be checked and what has been inferred.', status:'available', href:'#lab/mission/reality-sorter/notice', lessonNumber:2 },
    { type:'compare', title:'Reality Map', minutes:5, detail:'Open the existing Reality Map tool to separate what happened from what it means.', status:'available', href:'#tool/reality-map', lessonNumber:3 },
    { type:'practise', title:'Reality Sorter mission', minutes:6, detail:'The guided six-stage mission that lets you practise with a fictional cancellation scenario.', status:'available', href:MISSION_ROUTE, lessonNumber:4 },
    { type:'review', title:'Review · known, felt, inferred, unknown', minutes:3, detail:'A light recap that highlights the main distinction to carry forward.', status:'available', href:'#lab/forest', lessonNumber:5 },
  ];
  units[1].lessons[1].href = '#tool/assumption-finder';
})();

export const trailUnitPlan = Object.freeze(Object.fromEntries(Object.entries(UNIT_DATA).map(([id, units]) => [id, units.map(unit => ({ id:unit.id, number:unit.number, title:unit.title, lessons:unit.lessons.length, availability:unit.status }))])));
export const forestCourseDefinition = Object.freeze({ chapters: CHAPTERS.forest, units: UNIT_DATA.forest, lessonTypes: LESSON_TYPES });
export const livingTrailManifest = Object.freeze({ worlds: WORLD_ORDER.map(id => ({ id, name: WORLD_META[id].name, units: UNIT_DATA[id].length, chapters: CHAPTERS[id].length })), missionRoute: MISSION_ROUTE });

function legendMarkup(){
  const order = ['learn','explore','compare','practise','choose','apply','reflect','review','milestone','locked','completed','current'];
  return `<section class="ns-forest-panel"><div class="ns-forest-panel__head"><h2>Mission icons & nodes</h2><p>Clear, colourful, easy-to-read lesson and progress states inspired by the Forest redesign board.</p></div><div class="ns-forest-legend">${order.map(key=>{const item=LESSON_TYPES[key];return `<article class="ns-forest-legend__item"><span class="ns-lesson-badge ns-lesson-badge--${item.className}" aria-hidden="true">${item.icon}</span><strong>${item.label}</strong><p>${item.blurb}</p></article>`;}).join('')}</div></section>`;
}
function chapterCards(worldId){
  return `<section class="ns-forest-panel"><div class="ns-forest-panel__head"><h2>${WORLD_META[worldId].name} progression · 8 chapters</h2><p>A single journey with clearer scenery shifts every five units.</p></div><div class="ns-forest-chapters">${CHAPTERS[worldId].map((chapter, index)=>`<article class="ns-forest-chapter-card ns-scene-${chapter.key}"><span class="ns-forest-chapter-card__number">${index+1}</span><div><small>${esc(chapter.range)}</small><h3>${esc(chapter.name)}</h3><p>${esc(chapter.line)}</p></div></article>`).join('')}</div></section>`;
}
function worldMenu(current, worlds){
  return `<div class="ns-forest-worldmenu" hidden data-trail-menu>${worlds.map(world => `<a href="#lab/${world.id}" class="ns-forest-worldlink" ${world.id===current?'aria-current="page"':''}><span class="ns-forest-worldlink__icon">${esc(WORLD_META[world.id]?.icon || '•')}</span><span><strong>${esc(world.title || WORLD_META[world.id].name)}</strong><small>${esc(world.theme || WORLD_META[world.id].theme)}</small></span>${world.id===current?'<span aria-hidden="true">✓</span>':''}</a>`).join('')}</div>`;
}
function hero(worldId, worlds){
  const meta = WORLD_META[worldId];
  return `<header class="ns-forest-hero"><div class="ns-forest-topbar"><div class="ns-forest-switchwrap"><button type="button" class="ns-forest-switch" data-trail-switch aria-expanded="false">${esc(meta.icon)} <span>${esc(meta.name)}</span> <span aria-hidden="true">⌄</span></button>${worldMenu(worldId, worlds)}</div><span class="ns-forest-chip" data-current-chip>Chapter 1 · Unit 1 · ${esc(UNIT_DATA[worldId][0].title)}</span></div><div class="ns-forest-hero__grid"><div><p class="ns-forest-eyebrow">Nobody’s Simple · Life Lab</p><h1>${esc(meta.name)}</h1><p class="ns-forest-hero__lede">${esc(meta.line)}</p><div class="ns-forest-hero__meta"><span>40 units</span><span>8 chapters</span><span>5 lesson steps per unit</span></div><div class="ns-forest-hero__actions"><a class="ns-forest-button" href="${MISSION_ROUTE}">Start Reality Sorter</a><a class="ns-forest-button ns-forest-button--ghost" href="#tools">Open tools</a></div></div><div class="ns-forest-hero__art"><img src="${esc(meta.hero)}" alt="" loading="lazy" decoding="async"></div></div></header>`;
}
function summaryAside(worldId){
  const forestSpecific = worldId === 'forest' ? `<li><strong>High contrast first</strong><span>Darker text, brighter buttons and clearer state colours.</span></li><li><strong>Wider spacing</strong><span>Less cramped positioning and simpler scanning.</span></li><li><strong>Distinct lesson types</strong><span>Each step has its own icon, colour and purpose.</span></li>` : `<li><strong>Course framework</strong><span>40 units grouped into 8 chapters.</span></li><li><strong>Lesson variety</strong><span>Five authored lesson steps per unit.</span></li><li><strong>Forest-led redesign</strong><span>The Forest is the fullest visual direction so far.</span></li>`;
  return `<aside class="ns-forest-aside"><div class="ns-forest-panel ns-forest-panel--sticky"><div class="ns-forest-panel__head"><h2>Design goals</h2><p>Borrowing the clarity you liked: bigger contrast, simpler choices and a more colourful but readable layout.</p></div><ul class="ns-forest-goals">${forestSpecific}</ul><div class="ns-forest-mini-card"><p class="ns-forest-eyebrow">Current live content</p><h3>Unit 1</h3><p>Facts, stories & uncertainty</p><a href="${MISSION_ROUTE}">Go straight to the mission →</a></div></div></aside>`;
}
function unitButton(unit, worldId){
  const top = 120 + (40 - unit.number) * 172;
  const side = unit.number % 2 === 0 ? 'right' : 'left';
  const x = side === 'left' ? 30 : 70;
  const nodeType = unit.status === 'available' ? 'current' : unit.number % 5 === 0 ? 'milestone' : 'locked';
  const chapter = CHAPTERS[worldId][unit.chapterIndex];
  return `<button type="button" class="ns-trail-unit" data-unit-open="${esc(unit.id)}" data-unit-number="${unit.number}" data-unit-title="${esc(unit.title)}" data-chapter-label="${esc(chapter.name)}" style="top:${top}px;left:${x}%;" aria-label="Open Unit ${unit.number}: ${esc(unit.title)}"><span class="ns-trail-unit__node ns-trail-unit__node--${nodeType}" aria-hidden="true">${LESSON_TYPES[nodeType].icon}</span><span class="ns-trail-unit__plaque ns-trail-unit__plaque--${side}"><small>UNIT ${unit.number} · ${unit.status==='available'?'START HERE':'PLANNED'}</small><strong>${esc(unit.title)}</strong><em>${esc(unit.summary)}</em></span></button>`;
}
function chapterMarker(worldId, chapterIndex){
  const unitNumber = chapterIndex*5 + 1;
  const top = 160 + (40 - unitNumber) * 172 - 80;
  const chapter = CHAPTERS[worldId][chapterIndex];
  return `<div class="ns-trail-marker" style="top:${top}px;"><span aria-hidden="true">✦</span><div><small>CHAPTER ${chapterIndex+1} · ${esc(chapter.range)}</small><strong>${esc(chapter.name)}</strong></div></div>`;
}
function sceneStrip(worldId, chapterIndex){
  const chapter = CHAPTERS[worldId][chapterIndex];
  const top = chapterIndex * 860;
  return `<section class="ns-trail-scene ns-scene-${chapter.key}" style="top:${top}px;" aria-hidden="true"><div class="ns-trail-scene__overlay"></div><div class="ns-trail-scene__trees"></div><div class="ns-trail-scene__label">${esc(chapter.name)}</div></section>`;
}
function trailMap(worldId){
  const units = UNIT_DATA[worldId];
  const totalHeight = CHAPTERS[worldId].length * 860;
  return `<div class="ns-trail-wrap"><div class="ns-trail-map" data-trail-map style="height:${totalHeight}px">${CHAPTERS[worldId].map((_,i)=>sceneStrip(worldId,i)).join('')}<svg class="ns-trail-path" viewBox="0 0 100 1000" preserveAspectRatio="none" aria-hidden="true"><path d="M53 990 C 32 930, 74 875, 50 820 C 24 760, 76 705, 48 650 C 20 595, 80 530, 52 470 C 25 415, 74 360, 50 305 C 26 250, 76 190, 49 130 C 30 90, 61 50, 52 10"/></svg>${CHAPTERS[worldId].map((_,i)=>chapterMarker(worldId,i)).join('')}${units.map(unit=>unitButton(unit, worldId)).join('')}</div><button type="button" class="ns-trail-return" data-trail-return hidden>Return to Unit 1</button></div>`;
}
function unitDialog(){
  return `<dialog class="ns-unit-dialog" data-unit-dialog><div class="ns-unit-dialog__sheet"><button type="button" class="ns-unit-dialog__close" data-unit-close aria-label="Close">×</button><div data-unit-dialog-body></div></div></dialog>`;
}
function unitLessonMarkup(lesson){
  const kind = LESSON_TYPES[lesson.type] || LESSON_TYPES.learn;
  const action = lesson.href ? `<a href="${lesson.href}" class="ns-unit-lesson__go">Open</a>` : `<span class="ns-unit-lesson__status">${lesson.status==='planned'?'Planned':'Ready'}</span>`;
  return `<article class="ns-unit-lesson"><span class="ns-lesson-badge ns-lesson-badge--${kind.className}" aria-hidden="true">${kind.icon}</span><div class="ns-unit-lesson__copy"><small>${kind.label} · ~${lesson.minutes} min</small><h4>${esc(lesson.title)}</h4><p>${esc(lesson.detail)}</p></div>${action}</article>`;
}
function dialogBody(unit, worldId){
  const chapter = CHAPTERS[worldId][unit.chapterIndex];
  return `<p class="ns-forest-eyebrow">${esc(WORLD_META[worldId].name)} · ${esc(chapter.name)}</p><h2>Unit ${unit.number} · ${esc(unit.title)}</h2><p class="ns-unit-dialog__summary">${esc(unit.summary)}</p><div class="ns-unit-dialog__meta"><span>${unit.lessons.length} lesson steps</span><span>${unit.status==='available'?'Available now':'Planned content'}</span><span>${esc(chapter.range)}</span></div><div class="ns-unit-lessons">${unit.lessons.map(unitLessonMarkup).join('')}</div>${unit.status!=='available'?'<p class="ns-unit-dialog__note">This unit has been fully outlined so the course feels real and coherent, but it is still planned rather than live.</p>':''}`;
}
function plannedWorldNotice(worldId){
  if(worldId==='forest') return '';
  return `<section class="ns-forest-panel ns-forest-panel--notice"><div class="ns-forest-panel__head"><h2>${esc(WORLD_META[worldId].name)} preview</h2><p>This world uses the same 40-unit structure, but the Forest currently has the most detailed visual redesign and live mission flow.</p></div><p>You can still open any unit to inspect the authored lesson sequence and lesson-type mix.</p></section>`;
}

export function renderLivingTrail(main, requestedWorld='forest', sourceWorlds=[]){
  cleanupLivingTrail();
  const worldId = WORLD_META[requestedWorld] ? requestedWorld : 'forest';
  const worlds = sourceWorlds.length ? sourceWorlds : WORLD_ORDER.map(id => ({id, title: WORLD_META[id].name, theme: WORLD_META[id].theme}));
  main.innerHTML = `<div class="ns-forest-shell" data-living-trail data-world="${worldId}">${hero(worldId, worlds)}${chapterCards(worldId)}${legendMarkup()}${plannedWorldNotice(worldId)}<div class="ns-forest-layout">${summaryAside(worldId)}<main class="ns-forest-main">${trailMap(worldId)}</main></div><footer class="ns-forest-footer"><h2>The whole Forest course is now authored</h2><p>All 40 Forest units now have clear titles, chapter structure and five lesson steps with distinct types. Unit 1 remains the current live starting point, while the rest are presented as planned content rather than empty placeholders.</p><a href="#tools">Browse the full tools library →</a></footer>${unitDialog()}</div>`;
  attach(main.querySelector('[data-living-trail]'), worldId);
}

function attach(root, worldId){
  if (!root) return;
  const controller = new AbortController();
  const menu = root.querySelector('[data-trail-menu]');
  const switchButton = root.querySelector('[data-trail-switch]');
  const dialog = root.querySelector('[data-unit-dialog]');
  const dialogBodyNode = root.querySelector('[data-unit-dialog-body]');
  const trailMap = root.querySelector('[data-trail-map]');
  const chip = root.querySelector('[data-current-chip]');
  const returnButton = root.querySelector('[data-trail-return]');
  const units = UNIT_DATA[worldId];

  function openUnit(id){
    const unit = units.find(item => item.id === id);
    if (!unit) return;
    dialogBodyNode.innerHTML = dialogBody(unit, worldId);
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open','');
  }
  function closeUnit(){ if (dialog.open) dialog.close(); else dialog.removeAttribute('open'); }
  function updateChip(){
    const list = [...root.querySelectorAll('[data-unit-open]')];
    const current = list.find(node => node.getBoundingClientRect().bottom > 180) || list[list.length-1];
    if (!current || !chip) return;
    chip.textContent = `Chapter ${Math.floor((Number(current.dataset.unitNumber)-1)/5)+1} · Unit ${current.dataset.unitNumber} · ${current.dataset.unitTitle}`;
    const start = root.querySelector('[data-unit-open="forest-unit-1"], [data-unit-open="'+worldId+'-unit-1"]');
    if (start && returnButton) {
      const rect = start.getBoundingClientRect();
      returnButton.hidden = rect.top > 120 && rect.top < window.innerHeight - 120;
    }
  }
  root.addEventListener('click', event => {
    if (event.target.closest('[data-trail-switch]')) {
      const open = menu.hasAttribute('hidden');
      if (open) menu.removeAttribute('hidden'); else menu.setAttribute('hidden','');
      switchButton.setAttribute('aria-expanded', String(open));
      return;
    }
    const unitButton = event.target.closest('[data-unit-open]');
    if (unitButton) { openUnit(unitButton.dataset.unitOpen); return; }
    if (event.target.closest('[data-unit-close]') || event.target === dialog) { closeUnit(); return; }
    if (event.target.closest('[data-trail-return]')) {
      const first = root.querySelector(`[data-unit-open="${worldId}-unit-1"]`);
      first?.scrollIntoView({behavior:document.documentElement?.dataset?.motion==='reduce'?'auto':'smooth', block:'center'});
      return;
    }
    if (menu && !menu.hasAttribute('hidden') && !event.target.closest('.ns-forest-switchwrap')) {
      menu.setAttribute('hidden','');
      switchButton.setAttribute('aria-expanded','false');
    }
  }, { signal: controller.signal });
  dialog?.addEventListener('close', ()=>{}, { signal: controller.signal });
  if (typeof window !== 'undefined') {
    const onScroll = () => requestAnimationFrame(updateChip);
    window.addEventListener('scroll', onScroll, {signal: controller.signal, passive:true});
    setTimeout(() => {
      const first = root.querySelector(`[data-unit-open="${worldId}-unit-1"]`);
      if (first) {
        const y = window.scrollY + first.getBoundingClientRect().top - Math.max(240, window.innerHeight * 0.35);
        window.scrollTo({top:Math.max(0,y), behavior:'auto'});
      }
      updateChip();
    }, 30);
  }
  cleanup = ()=>controller.abort();
}
