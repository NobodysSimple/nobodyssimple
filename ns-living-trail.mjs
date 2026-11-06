/**
 * Nobody's Simple · Living Trail foundation.
 * Route-specific presentation only. The existing six-stage Reality Sorter,
 * independent tool routes, and private account storage remain untouched.
 * Only authored and already available destinations become active nodes.
 */
const escapeText = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const FOREST_MISSION = '#lab/mission/reality-sorter/notice';
const WORLD_META = Object.freeze({
 meadow:{icon:'✿',name:'The Meadow',unit:'Making sense of feelings',next:'Listening to what your body needs',tone:'meadow',art:'ns-landscape-path.webp',pose:'ns-character-sitting.webp',nodes:[
  {id:'mixed-feelings',title:'Mixed Feelings',type:'explore',status:'tool',href:'#tool/mixed-feelings',detail:'Name more than one emotion without forcing a single answer.'},
  {id:'body-check',title:'Body Check',type:'notice',status:'tool',href:'#tool/body-check',detail:'Notice physical sensations and possible needs without guessing their cause.'} ]},
 forest:{icon:'♠',name:'The Forest',unit:'Facts, stories & uncertainty',next:'Exploring explanations',tone:'forest',art:'ns-landscape-forest.webp',pose:'ns-character-hiking.webp',nodes:[
  {id:'reality-sorter',title:'Reality Sorter',type:'capstone',status:'mission',href:FOREST_MISSION,detail:'Sort observations, interpretations, feelings and unknowns in a realistic situation.'},
  {id:'reality-map',title:'Reality Map',type:'compare',status:'tool',href:'#tool/reality-map',detail:'Explore an existing reflection tool for sorting what you know and infer.'},
  {id:'assumption-finder',title:'Assumption Finder',type:'notice',status:'tool',href:'#tool/assumption-finder',detail:'Explore an existing tool for examining assumptions.'} ]},
 bridge:{icon:'♧',name:'The Bridge',unit:'Understanding each other',next:'Boundaries & repair',tone:'bridge',art:'ns-landscape-mountains.webp',pose:'ns-character-friends.webp',nodes:[
  {id:'conversation-map',title:'Conversation Map',type:'rehearse',status:'tool',href:'#tool/conversation-map',detail:'Prepare for a conversation while considering needs and perspectives.'},
  {id:'boundary-builder',title:'Boundary Builder',type:'practise',status:'tool',href:'#tool/boundary-builder',detail:'Clarify a practical boundary with a working tool.'} ]},
 workshop:{icon:'⚒',name:'The Workshop',unit:'From stuck to started',next:'Plans, habits & obstacles',tone:'workshop',art:'ns-landscape-choose.webp',pose:'ns-character-building.webp',nodes:[
  {id:'small-step',title:'Small Step',type:'apply',status:'tool',href:'#tool/small-step',detail:'Find one manageable next action.'},
  {id:'friction',title:'Friction Finder',type:'explore',status:'tool',href:'#tool/friction',detail:'Find what makes an intended action difficult to start.'} ]},
 observatory:{icon:'✦',name:'The Observatory',unit:'Self in context',next:'Values & belonging',tone:'observatory',art:'ns-landscape-night.webp',pose:'ns-character-lantern.webp',nodes:[
  {id:'identity-map',title:'Identity Map',type:'reflect',status:'tool',href:'#tool/identity-map',detail:'Explore different parts of identity and context.'},
  {id:'values-discovery',title:'Values Discovery',type:'discover',status:'tool',href:'#tool/values-discovery',detail:'Explore values as flexible directions, not fixed labels.'} ]},
});

// Forty named curriculum *outlines* per world. Only Unit 1 currently has live activities.
// These names are an editorial roadmap, NOT published lessons or achieved progress.
const PLANNED_UNIT_TITLES = Object.freeze({
 meadow:Object.freeze(['Making sense of feelings', "Naming what's here", 'Mixed emotions', 'Feelings and physical sensations', 'Listening to body signals', 'Emotional intensity', 'Emotions change over time', 'When feelings are hard to name', 'Recognising personal triggers', 'Feeling versus reacting', 'Stress signals', 'Understanding your needs', 'Comfort and regulation', 'Sensory patterns', 'Rest and recovery', 'Responding to overwhelm', 'Making space for sadness', 'Working with anger', 'Fear and uncertainty', 'Joy and appreciation', 'Shame and self-kindness', 'Emotional boundaries', 'Needs in relationships', 'Changing emotional patterns', 'Recognising rumination', 'Thoughts that amplify feelings', 'Calming without avoiding', 'Self-compassion in action', 'When feelings disagree', 'Healthy ways to express emotion', 'Finding your rhythm', 'Coping during transitions', 'Recognising your limits', 'Asking for support', 'Resilience without pressure', 'Practising emotional flexibility', 'Building helpful routines', 'Navigating difficult days', 'Applying skills in new settings', 'Your emotional toolkit']),
 forest:Object.freeze(['Facts, stories & uncertainty', 'Observation or interpretation?', 'Why we assume motives', 'Considering other explanations', 'Checking the evidence', 'Confidence and doubt', 'Dealing with the unknown', 'Common thinking traps', 'Attention and selective evidence', 'Memory is reconstructive', 'Recognising confirmation bias', 'When thoughts spiral', 'Worry and prediction', 'Rumination and reflection', 'The need for certainty', 'Interpreting social situations', 'Separating feelings from facts', 'When information is incomplete', 'Patterns versus coincidences', 'Testing assumptions gently', 'Questioning first impressions', 'Noticing the story you tell', 'Thinking in probabilities', 'Avoiding all-or-nothing conclusions', 'Understanding disagreement', 'Reasoning under pressure', 'Learning from mistakes', 'Dealing with ambiguity', 'Distinguishing possibility from likelihood', 'Social comparison and beliefs', 'Interpreting intentions cautiously', 'Media claims and evidence', 'Evidence quality and sources', 'Spotting persuasive language', 'Making flexible judgments', 'Reasoning with competing values', 'When to seek more information', 'Transferring the skill to work', 'Transferring the skill to relationships', 'Thinking clearly in everyday life']),
 bridge:Object.freeze(['Understanding each other', 'Seeing different perspectives', 'Listening with curiosity', 'What makes communication difficult?', 'Needs beneath reactions', 'Asking rather than assuming', 'Clear requests', 'Boundaries as information', 'Saying no respectfully', 'Hearing no from others', 'Repairing misunderstandings', 'When conversations escalate', 'Emotion and conflict', 'Timing difficult conversations', 'Working with defensiveness', 'Taking responsibility without shame', 'Apologies that address impact', 'Different communication styles', 'Trust and uncertainty', 'How expectations form', 'Respecting autonomy', 'Handling disappointments', 'Responding to criticism', 'Giving constructive feedback', 'Asking for reassurance clearly', 'Recognising power differences', 'Friendship and reciprocity', 'Digital communication', 'Group belonging', 'Handling social exclusion', 'Conflict without winning', 'Negotiating different needs', 'Repair after a disagreement', 'Supporting without rescuing', 'Recognising unhealthy dynamics', 'Protecting your boundaries', 'Collaborative problem solving', 'Relationships during change', 'Applying skills across settings', 'Your relationship toolkit']),
 workshop:Object.freeze(['From stuck to started', 'Clarifying what matters', 'Choosing one next step', 'Understanding procrastination', 'Finding friction', 'Reducing the starting barrier', 'Planning around energy', 'If–then plans', 'Small experiments', 'Defining a workable goal', 'Priorities and trade-offs', 'Decisions under uncertainty', 'Comparing options fairly', 'Recognising hidden constraints', 'Working around obstacles', 'Habits and environments', 'Designing a helpful routine', 'Motivation comes and goes', 'Making tasks manageable', 'Attention and distractions', 'Working with perfectionism', 'Time estimates and planning', 'When plans need to change', 'Feedback versus failure', 'Recovering after setbacks', 'Managing competing demands', 'Asking for practical support', 'Progress without streak pressure', 'Knowing when to pause', 'Working toward long projects', 'Values-based decisions', 'Risk and reversibility', 'Anticipating obstacles', 'Building consistent follow-through', 'Avoiding overcommitment', 'Experimenting with alternatives', 'Reviewing decisions', 'Adapting to life changes', 'Using skills in difficult weeks', 'Your action toolkit']),
 observatory:Object.freeze(['Self in context', 'The many parts of identity', 'Values and what matters', 'Roles we occupy', 'How context shapes behaviour', 'Belonging and difference', 'Strengths and their limits', 'Labels and self-description', 'Identity across situations', 'The stories we inherit', 'Family and social expectations', 'Cultural influences', 'Self-criticism and standards', 'The self across time', 'Changing your mind', 'Who you are with others', 'Authenticity and safety', 'Comparing possible selves', 'Interests and exploration', 'Personal boundaries and identity', 'Social norms and pressure', 'The influence of institutions', 'Status and comparison', 'Stereotypes and assumptions', 'Seeing systems around us', 'Power and opportunities', 'Community and connection', 'Identity during transitions', 'Holding contradictions', 'Finding meaning in everyday life', 'Purpose without perfection', 'Learning from experience', 'What helps you thrive?', 'Values in difficult choices', 'Understanding privilege and barriers', 'Future possibilities', 'Adapting your self-story', 'Living with uncertainty about self', 'Making room for change', 'Your evolving field guide']),
});
export const trailUnitPlan = Object.freeze(Object.fromEntries(
 Object.entries(PLANNED_UNIT_TITLES).map(([id,titles])=>[id,titles.map((title,i)=>({id:`unit-${i+1}`,title,number:i+1,availability:i===0?'activities-available':'planned'}))])
));
function unitsForWorld(world){
 return PLANNED_UNIT_TITLES[world.id].map((title,i)=>({
  id:`unit-${i+1}`,title,nodes:i===0?world.nodes:[],status:i===0?'available':'planned'
 }));
}

export const trailSegmentCount = count => Math.max(1,Math.ceil(Math.max(0,Number(count)||0)/4));
const GLYPHS=Object.freeze({
 capstone:'★', discover:'▤', notice:'◉', explore:'⌕', compare:'⚖', rehearse:'☏', practise:'✳', apply:'♧', recall:'↻', transfer:'➜', reflect:'✎', review:'✓'
});
let currentWorld='forest';
let preferredView='map';
const lastScroll = new Map();
let cleanup=()=>{};
export function cleanupLivingTrail(){cleanup();cleanup=()=>{};}

// Stable seeded composition: adding a unit never rearranges already published ones.
function seeded(seed){let h=2166136261;for(const char of seed){h^=char.charCodeAt(0);h=Math.imul(h,16777619)}return ()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return (h>>>0)/4294967296;};}
const poly=(pts,fill,extra='')=>`<polygon points="${pts}" fill="${fill}" ${extra}/>`;
function scenery(world,unitId='intro',simplified=false){
 const rand=seeded(`${world}:${unitId}:living-trail-v1`);
 const palette={
  meadow:['#fce9b7','#ecedd4','#9fc779','#6d9760','#558561','#fdf1cb','#d69b56'],
  forest:['#eee5ec','#d7e0d2','#95b8a0','#689782','#427d65','#f8edcf','#826f77'],
  bridge:['#d9ecec','#c9e4d5','#91b8aa','#6eaaa1','#44867c','#f8edcb','#5b97a7'],
  workshop:['#f8e5ca','#eadcbb','#c8ba82','#9da16e','#769065','#ffe9bd','#bb894a'],
  observatory:['#343d68','#536387','#6b8190','#567778','#395f6c','#e5d6b5','#f8d59b']
 }[world]||['#ecead8','#e6ebd8','#aacc9a','#7bb38d','#397e55','#f8e8c9','#bba068'];
 const [sky,hill,mid,near,deep,path,accent]=palette;
 let flora='';
 for(let i=0;i<(simplified?11:31);i++){
  const left=i%2===0;
  const x=left?(9+rand()*112):(365+rand()*100),y=80+rand()*950;
  const size=12+rand()*27;
  if(world==='forest'||world==='observatory'){
   flora+=`<g opacity="${.68+rand()*.3}"><path d="M ${x} ${y+size*.55}v ${size*.86}" stroke="${deep}" stroke-width="${2+size/18}" stroke-linecap="round"/>${poly(`${x},${y-size*.75} ${x-size*.75},${y+size*.3} ${x+size*.75},${y+size*.3}`,near)}${poly(`${x},${y-size*.2} ${x-size*.9},${y+size*.65} ${x+size*.9},${y+size*.65}`,deep)}</g>`;
   if(world==='forest'&&i%7===1)flora+=`<circle cx="${x+size*.45}" cy="${y-size*.25}" r="${size*.62}" fill="#bea8c0" opacity=".55"/>`;
  }else if(world==='meadow'){
   flora+=`<path d="M${x} ${y+size*.55}v-${size*.65}" stroke="${deep}" stroke-width="2.3"/><circle cx="${x}" cy="${y-size*.15}" r="${size*.25}" fill="${i%3?'#fff8d9':'#ecc5ad'}"/><circle cx="${x}" cy="${y-size*.15}" r="3" fill="#e4af42"/>`;
  }else{
   flora+=`<g opacity=".82"><ellipse cx="${x}" cy="${y+size*.42}" rx="${size*.8}" ry="${size*.42}" fill="${near}"/><ellipse cx="${x+size*.36}" cy="${y+size*.2}" rx="${size*.58}" ry="${size*.42}" fill="${deep}"/></g>`;
  }
 }
 let special='';
 if(world==='bridge')special=`<path d="M0 250 C120 209 230 302 480 223L480 305C225 386 110 279 0 335Z" fill="#84c5d0" opacity=".58"/><path d="M15 278 Q240 204 461 276" fill="none" stroke="#b18d5c" stroke-width="11" opacity=".82"/>`;
 if(world==='workshop')special=`<g transform="translate(375 130)"><rect x="0" y="25" width="83" height="69" rx="7" fill="#ead1a3" stroke="#9f8054" stroke-width="4"/><path d="M-9 29L42 -7 94 29Z" fill="#b58d53"/><rect x="30" y="58" width="22" height="36" fill="#8c9569"/></g>`;
 if(world==='observatory'){
  special=`<circle cx="420" cy="90" r="32" fill="#fff3d0" opacity=".78"/><g fill="#fff4c5">${Array.from({length:19},(_,i)=>`<circle cx="${20+rand()*445}" cy="${15+rand()*990}" r="${1+rand()*2}"/>`).join('')}</g><g transform="translate(390 300)"><rect x="-36" y="15" width="72" height="64" fill="#c7c9ba"/><path d="M-36 17A36 36 0 0 1 36 17" fill="#e3d9c5" stroke="#75878d" stroke-width="5"/></g>`;
 }
 const road='M240 -30 C240 80 154 100 154 205 C154 288 328 300 328 400 C328 487 170 495 170 595 C170 691 318 707 318 802 C318 907 240 930 240 1085';
 return `<svg class="ns-trail-scenery" viewBox="0 0 480 1050" preserveAspectRatio="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><rect width="480" height="1050" fill="${sky}"/>
  <path d="M0 90Q70 32 142 94T282 78T480 78V1050H0Z" fill="${hill}"/>
  <path d="M0 192Q110 120 208 188T480 173V1050H0Z" fill="${mid}" opacity=".72"/>
  <path d="M0 340Q100 289 216 347T480 330V1050H0Z" fill="${near}" opacity=".26"/>
  <path d="M0 590Q112 535 220 594T480 578V1050H0Z" fill="${mid}" opacity=".48"/>
  <path d="M0 880Q116 816 225 865T480 851V1050H0Z" fill="${near}" opacity=".34"/>
  ${special}<g opacity=".98"><path d="${road}" fill="none" stroke="#948b68" opacity=".20" stroke-width="91" stroke-linecap="round"/><path d="${road}" fill="none" stroke="${path}" stroke-width="82" stroke-linecap="round"/><path d="${road}" fill="none" stroke="#fff9df" stroke-width="66" stroke-linecap="round" opacity=".52"/></g>
  ${flora}<path d="M0 1030Q120 995 240 1043T480 1020V1050H0Z" fill="${deep}" opacity=".3"/></svg>`;
}
function nodeMarkup(node,index,unitNumber=1,segmentCount=1){
 const locations=[{x:66,y:786,side:'left'},{x:35,y:589,side:'right'},{x:68,y:393,side:'left'},{x:33,y:213,side:'right'}];
 const point=locations[index%locations.length];
 const y=1050*(segmentCount-1-Math.floor(index/4))+point.y;
 const kind=node.status==='mission'?'mission':'tool';
 const state=node.status==='mission'?'current':'available';
 const label=kind==='mission'?'Start mission':'Open existing tool';
 return `<button type="button" class="ns-trail-node ns-trail-node--${state}" data-trail-node="${escapeText(node.id)}" data-unit="${unitNumber}" style="--node-x:${point.x}%;--node-y:${y}px" aria-label="${escapeText(node.title)}. ${label}." aria-haspopup="dialog">
  <span class="ns-trail-stone" aria-hidden="true">${GLYPHS[node.type]||'✳'}</span>
  <span class="ns-trail-node-title" data-side="${point.side}"><strong>${escapeText(node.title)}</strong><small>${kind==='mission'?'READY · MISSION':'OPEN TOOL'}</small></span>
  ${state==='current'?'<span class="ns-trail-start" aria-hidden="true">START</span>':''}</button>`;
}
function plannedUnitSection(world,unit,index,nextUnit=null){
 // Preview section is short and the scenery is generated from the stable world+unit seed.
 // The stone is an informational landmark, not a fake playable lesson.
 return `<section class="ns-trail-unit ns-trail-unit--planned" tabindex="-1" aria-label="Unit ${index+1}, ${escapeText(unit.title)}, planned" data-unit="${escapeText(unit.id)}" data-unit-number="${index+1}" data-unit-title="${escapeText(unit.title)}" style="--unit-height:540px">
  <div class="ns-trail-scenetile ns-trail-scenetile--planned" style="top:0">${scenery(world.id,unit.id,true)}</div>
  <span class="ns-trail-planned-stone" aria-hidden="true">◇</span>
  <div class="ns-trail-planned-label"><span>UNIT ${index+1} · PLANNED</span><strong>${escapeText(unit.title)}</strong><small>COMING LATER · Lessons are not published yet</small></div>
 </section>`;
}
function unitSection(world,unit,index,nextUnit=null){
 if(unit.status==='planned')return plannedUnitSection(world,unit,index,nextUnit);
 const nodes=unit.nodes;
 const segmentCount=trailSegmentCount(nodes.length);
 const order = nodes.map((node,i)=>nodeMarkup(node,i,index+1,segmentCount)).join('');
 return `<section class="ns-trail-unit" tabindex="-1" aria-label="Unit ${index+1}, ${escapeText(unit.title)}" data-unit="${escapeText(unit.id)}" data-unit-number="${index+1}" data-unit-title="${escapeText(unit.title)}" style="--unit-height:${segmentCount*1050}px">
  ${Array.from({length:segmentCount},(_,i)=>`<div class="ns-trail-scenetile" style="top:${i*1050}px">${scenery(world.id,unit.id+'-'+i)}</div>`).join('')}
  <div class="ns-trail-nextunit"><span class="ns-trail-nextunit__kicker">${nextUnit?'NEXT UNIT':'COMING LATER'}</span><strong>Unit ${index+2} · ${escapeText(nextUnit?.title||world.next)}</strong><small>${nextUnit?'Planned curriculum ahead':'More missions are being developed'}</small></div>
  ${order}
  <div class="ns-trail-unit-banner"><span>UNIT ${index+1}</span><strong>${escapeText(unit.title)}</strong><small>${world.id==='forest'?'1 interactive mission · 2 existing tools':'2 existing tools · missions in development'}</small></div>
  <img class="ns-trail-mascot" src="${escapeText(world.pose)}" alt="" loading="lazy" decoding="async" />
 </section>`;
}
function listMarkup(world,units){
 return `<div class="ns-trail-list-content"><div class="ns-trail-list-title"><h2>All 40 units · ${escapeText(world.name)}</h2><p>Browse every proposed topic. Unit 1 has working activities; Units 2–40 are an outline, not playable lessons.</p></div>
  ${units.map((unit,index)=>`<div class="ns-trail-unit-list-group"><button type="button" class="ns-trail-unit-list-jump" data-trail-jump="${escapeText(unit.id)}" aria-label="Locate Unit ${index+1} on the illustrated trail"><strong>Unit ${index+1} · ${escapeText(unit.title)}</strong><small>${index===0?'Available activities':'Planned — lessons not yet available'}</small><span aria-hidden="true">↑</span></button>
  ${index===0?unit.nodes.map((node,i)=>`<button type="button" class="ns-trail-list-row" data-trail-node="${escapeText(node.id)}"><span class="ns-trail-list-glyph" aria-hidden="true">${GLYPHS[node.type]||'✳'}</span><span><strong>${i+1}. ${escapeText(node.title)}</strong><small>${node.status==='mission'?'Interactive mission, ready to start':'Existing working tool'}</small></span><span aria-hidden="true">›</span></button>`).join(''):''}</div>`).join('')}
  </div>`;
}
const WORLD_ICONS={
 '✿':'<path d="M12 21v-9M12 13C4 13 3 7 3 3c5 0 9 2 9 10ZM12 13c0-7 4-10 9-10 0 7-3 10-9 10Z"/>',
 '♠':'<path d="M12 2 5 12h3l-4 6h16l-4-6h3L12 2ZM12 18v4"/>',
 '♧':'<path d="M3 20h18M4 20V12C4 6 8 4 12 4s8 2 8 8v8M4 14h16M8 10v10M16 10v10"/>',
 '⚒':'<path d="m4 20 10-10M10 5l9 9M8 4l-4 4 4 4 4-4ZM20 13l-7 7"/>',
 '✦':'<path d="m12 2 2.6 7.3L22 12l-7.4 2.7L12 22l-2.7-7.3L2 12l7.3-2.7L12 2Z"/>'
};
function iconMini(icon){const path=WORLD_ICONS[icon];return `<span aria-hidden="true" class="ns-trail-mini-icon">${path?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" focusable="false"><g>${path}</g></svg>`:icon}</span>`;}
function chooser(world,worlds){
 return `<div class="ns-trail-switchmenu" hidden data-trail-menu id="ns-trail-world-menu" role="group" aria-label="Choose a Life Lab world">${worlds.map(w=>`<a href="#lab/${w.id}" class="ns-trail-world-option" ${w.id===world.id?'aria-current="true"':''}>${iconMini(WORLD_META[w.id].icon)}<span><strong>${escapeText(w.title)}</strong><small>${escapeText(w.theme)}</small></span>${w.id===world.id?'<span aria-hidden="true">✓</span>':''}</a>`).join('')}</div>`;
}
function dialogContent(world,node){return `<div class="ns-trail-dialog__top"><span class="ns-trail-dialog-icon" aria-hidden="true">${GLYPHS[node.type]||'✳'}</span><button type="button" class="ns-trail-dialog-close" data-trail-close aria-label="Close preview">×</button></div><p class="ns-trail-eyebrow">${escapeText(world.name)} · ${node.status==='mission'?'INTERACTIVE MISSION':'PRACTICAL TOOL'}</p><h2 id="ns-trail-dialog-title">${escapeText(node.title)}</h2><p>${escapeText(node.detail)}</p><ul class="ns-trail-dialog-list">${node.status==='mission'?'<li>Six short interactive stages</li><li>Try responses and receive explanatory feedback</li><li>No automatic saving of personal information</li>':'<li>This opens a working tool from the existing catalogue.</li><li>It remains independently accessible through Tools.</li>'}</ul><a class="ns-trail-dialog-go" href="${escapeText(node.href)}">${node.status==='mission'?'Start Reality Sorter':'Open tool'} <span aria-hidden="true">→</span></a>`;}
const focusDelay = fn => {if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(fn));};
function attach(main,world){
 if(typeof document==='undefined' || !main.addEventListener)return;
 const controller=new AbortController();
 const root=main.querySelector('[data-living-trail]');
 if(!root)return;
 const menu=root.querySelector('[data-trail-menu]');
 const toggle=root.querySelector('[data-trail-switch]');
 const map=root.querySelector('[data-trail-map]');
 const layout=root.querySelector('.ns-trail-layout');
 const list=root.querySelector('[data-trail-list]');
 const dialog=root.querySelector('[data-trail-dialog]');
 const status=root.querySelector('[data-trail-view-status]');
 const unitChip=root.querySelector('[data-trail-unit-chip]');
 let current=null;
 const saveScroll=()=>{if(typeof window==='undefined')return;const rect=map?.getBoundingClientRect();if(rect){lastScroll.set(world.id,Math.max(0,window.scrollY));}};
 const applyView=mode=>{preferredView=mode;map.hidden=mode!=='map';layout.hidden=mode!=='map';list.hidden=mode!=='list';root.querySelectorAll('[data-trail-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.trailView===mode)));if(status)status.textContent=mode==='map'?'Illustrated trail view':'Ordered lesson list';};
 applyView(preferredView);
 root.addEventListener('click',e=>{
  const switchBtn=e.target.closest('[data-trail-switch]');
  if(switchBtn){const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));return;}
  const jump=e.target.closest('[data-trail-jump]');if(jump){
   const target=[...map.querySelectorAll('[data-unit]')].find(el=>el.dataset.unit===jump.dataset.trailJump);
   if(!target)return;
   applyView('map');
   focusDelay(()=>{target.focus({preventScroll:true});target.scrollIntoView({block:'center',behavior:document.documentElement.dataset.motion==='reduce'?'auto':'smooth'});});
   return;
  }
  const view=e.target.closest('[data-trail-view]');if(view){
   if(view.dataset.trailView===preferredView)return;
   if(preferredView==='map')saveScroll();
   applyView(view.dataset.trailView);
   focusDelay(()=>{if(!root.isConnected)return;if(preferredView==='list')list.scrollIntoView({block:'start',behavior:'auto'});else if(lastScroll.has(world.id))window.scrollTo({top:lastScroll.get(world.id),behavior:'auto'});});
   return;
  }
  const close=e.target.closest('[data-trail-close]');if(close){if(dialog.open)dialog.close();return;}
  const nodeButton=e.target.closest('[data-trail-node]');
  if(nodeButton){const node=world.nodes.find(item=>item.id===nodeButton.dataset.trailNode);if(!node)return;current=nodeButton;dialog.querySelector('[data-trail-dialog-body]').innerHTML=dialogContent(world,node);if(typeof dialog.showModal==='function'){dialog.showModal();dialog.querySelector('[data-trail-close]')?.focus();}else {dialog.setAttribute('open','');}return;}
  if(!menu.hidden && !e.target.closest('[data-trail-menu]')){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
 },{signal:controller.signal});
 dialog.addEventListener('close',()=>current?.focus?.({preventScroll:true}),{signal:controller.signal});
 dialog.addEventListener('click',e=>{if(e.target===dialog){dialog.close();}},{signal:controller.signal});
 if(typeof window!=='undefined')window.addEventListener('scroll',()=>{if(preferredView==='map' && !map.hidden){
 const activeSection=[...map.querySelectorAll('[data-unit-title]')].find(section=>section.getBoundingClientRect().bottom>160);
 if(activeSection&&unitChip){const label='UNIT '+activeSection.dataset.unitNumber+' · '+activeSection.dataset.unitTitle;if(unitChip.textContent!==label)unitChip.textContent=label;}const currentNode=map.querySelector('.ns-trail-node--current')||map.querySelector('.ns-trail-node');const scrollTo=main.querySelector('[data-trail-return]');if(currentNode&&scrollTo){let rect=currentNode.getBoundingClientRect();scrollTo.hidden=rect.top>115&&rect.bottom<window.innerHeight-120;}}},{signal:controller.signal,passive:true});
 root.querySelector('[data-trail-return]')?.addEventListener('click',()=>{map.querySelector('.ns-trail-node--current,.ns-trail-node')?.scrollIntoView({block:'center',behavior:document.documentElement.dataset.motion==='reduce'?'auto':'smooth'});},{signal:controller.signal});
 cleanup=()=>{if(preferredView==='map')saveScroll();if(dialog.open)dialog.close();controller.abort();};
 if(preferredView==='map'&&typeof window!=='undefined'){
  const initial=()=>{
   if(!root.isConnected || preferredView!=='map')return;
   if(lastScroll.has(world.id))window.scrollTo({top:lastScroll.get(world.id),behavior:'auto'});
   else {
    const node=map.querySelector('.ns-trail-node--current')||map.querySelector('.ns-trail-node');
    if(node){const top=window.scrollY+node.getBoundingClientRect().top-Math.max(225,window.innerHeight*.46);window.scrollTo({top:Math.max(0,top),behavior:'auto'});}
   }
  };
  focusDelay(initial);
  // Hash navigation may restore an old browser scroll position after the first paint.
  // Only correct a still-top-of-page first visit; never override deliberate scrolling.
  if(!lastScroll.has(world.id) && typeof setTimeout==='function'){
   const followup=setTimeout(()=>{if(root.isConnected && window.scrollY<90)initial();},120);
   const previous=cleanup;
   cleanup=()=>{clearTimeout(followup);previous();};
  }
 }
}
export function renderLivingTrail(main,requestedWorld,sourceWorlds=[]){
 const id = requestedWorld || currentWorld;
 const world = WORLD_META[id];
 if(!world){main.innerHTML=`<section class="ns-living-trail ns-trail-error"><h1>That world isn't available.</h1><p>Choose one of the five existing worlds instead.</p><a href="#lab">Back to Life Lab</a></section>`;return;}
 currentWorld=id;
 // A data-driven sequence. Appending future reviewed units does not change the map engine.
 const units=unitsForWorld({...world,id});
 const existingWorlds=sourceWorlds.length?sourceWorlds.filter(w=>WORLD_META[w.id]):Object.keys(WORLD_META).map(id=>({id,title:WORLD_META[id].name,theme:''}));
 main.innerHTML=`<div class="ns-living-trail" data-living-trail data-trail-world="${id}">
  <div class="ns-trail-sticky"><div class="ns-trail-sticky__inner"><div class="ns-trail-switch"><button type="button" class="ns-trail-switch-btn" data-trail-switch aria-expanded="false" aria-controls="ns-trail-world-menu">${iconMini(world.icon)} <span>${escapeText(world.name)}</span><span aria-hidden="true">⌄</span></button>${chooser(world,existingWorlds)}</div><div class="ns-trail-toolbar" aria-label="Trail display"><button type="button" data-trail-view="map" aria-pressed="true" aria-label="Show illustrated trail" title="Map view">⌁</button><button type="button" data-trail-view="list" aria-pressed="false" aria-label="Show ordered mission list" title="List view">☷</button></div><span class="ns-trail-sr" role="status" data-trail-view-status>Illustrated trail view</span></div><div class="ns-trail-unit-chip" data-trail-unit-chip>UNIT 1 · ${escapeText(world.unit)}</div></div>
  <header class="ns-trail-intro"><div><p class="ns-trail-eyebrow">LIFE LAB · A JOURNEY AT YOUR PACE</p><h1>${escapeText(world.name)}</h1><p class="ns-trail-plan-count">40 units to explore · 1 unit with available activities</p><p>${escapeText((sourceWorlds.find(w=>w.id===id)?.line)||'Discover, practise and apply useful skills through real situations.')}</p></div><span class="ns-trail-intro-icon" aria-hidden="true">${iconMini(world.icon)}</span></header>
  <div class="ns-trail-layout"><aside class="ns-trail-aside"><div class="ns-trail-aside-card"><p class="ns-trail-eyebrow">YOUR WORLD</p><img src="${world.art}" alt="" loading="lazy"/><h2>${escapeText(world.unit)}</h2><p>Follow the stepping stones from the foreground up into the world. Tap a stone to see what it offers.</p><p class="ns-trail-aside-note">${id==='forest'?'1 complete mission and 2 existing tools are ready.':'Working tools are available now. New Life Lab missions are being prepared.'}</p><a href="#learn">Explore the Learn library <span aria-hidden="true">→</span></a></div></aside>
  <div class="ns-trail-canvas" data-trail-map>${units.map((unit,i)=>unitSection({...world,id},unit,i,units[i+1])).reverse().join('')}</div>
  </div>
  <div class="ns-trail-list" hidden data-trail-list>${listMarkup(world,units)}</div>
  <button type="button" class="ns-trail-return" data-trail-return hidden>↟ Return to my place</button>
  <footer class="ns-trail-footer"><h2>40 units mapped out</h2><p>All 40 unit topics are visible in advance. Only the first unit currently links to working activities; future units will become playable when their lessons are published.</p><a href="#tools">Browse all tools →</a></footer>
  <dialog class="ns-trail-dialog" data-trail-dialog aria-labelledby="ns-trail-dialog-title"><div data-trail-dialog-body></div></dialog>
 </div>`;
 attach(main,world);
}
export const livingTrailManifest = Object.freeze({worlds:Object.entries(WORLD_META).map(([id,w])=>({id,unit:w.unit,unitCount:PLANNED_UNIT_TITLES[id].length,available:w.nodes.map(n=>({id:n.id,status:n.status,href:n.href}))})),missionRoute:FOREST_MISSION,viewModes:['map','list']});
