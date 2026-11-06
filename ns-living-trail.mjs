import {getForestUnitOutline, forestUnitOutlines} from './ns-forest-curriculum.mjs';
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

/**
 * Continuous landscape renderer — one SVG scene and one road across all 40 units.
 * No repeated 540px SVG panels; chapter moods blend inside a single gradient.
 * Paths and props are deterministic, so updating the curriculum doesn't shuffle
 * artwork relative to the journey's beginning.
 */
export const trailSegmentCount = count => Math.max(1,Math.ceil(Math.max(0,Number(count)||0)/4)); // legacy API
const GLYPHS=Object.freeze({capstone:'★',discover:'▤',notice:'◉',explore:'⌕',compare:'⚖',rehearse:'☏',practise:'✳',apply:'♧',recall:'↻',transfer:'➜',reflect:'✎',review:'✓'});
const UNIT_H=360, DEST_H=570, UNIT_COUNT=40, SCENE_H=DEST_H+UNIT_H*UNIT_COUNT;
const CHAPTERS=Object.freeze({
 meadow:['Trailhead meadow','Wildflower fields','Brookside grasses','Orchard edges','Windier hills','Stone path uplands','Hilltop approach','Sanctuary garden'],
 forest:['Forest edge','Denser woodland','Fern valley','Creek crossing','Mist forest','Rocky climb','Pine ridge','Summit lookout'],
 bridge:['Small crossing','River walk','Twin bridges','Village edge','Market crossing','Split river junction','Great bridge ascent','City bridge plaza'],
 workshop:['Trail workshop','Tool yard','Work cabin row','Mill path','Workshop square','Machine garden','Hill forge','Master workshop'],
 observatory:['Lowland dusk','Open plain','Star fields','Stone ascent','Moonlit path','High altitude ridge','Dome approach','Grand observatory']
});
const DESTINATIONS=Object.freeze({
 meadow:{title:'The Sanctuary',description:'A quiet hilltop garden at the end of the Meadow journey.'},
 forest:{title:'The Summit',description:'The mountain lookout above the Forest.'},
 bridge:{title:'The Great Bridge',description:'The gathering place where the river crossings meet.'},
 workshop:{title:'The Master Workshop',description:'The glowing workshop above the village.'},
 observatory:{title:'The Great Observatory',description:'The dome at the end of the starlit ascent.'}
});
const WORLD_PALETTES=Object.freeze({
 meadow:['#accb9a','#b4d19c','#9ac4a0','#b5cba1','#a6c5a2','#a6bd9c','#91ac92','#869f8b'],
 forest:['#a0d85f','#5ca969','#66b6a5','#7bb7a0','#a0d864','#71ac8d','#5f9a86','#91c4db'],
 bridge:['#abc8ae','#a1c5b3','#a6c9b9','#a8c7b1','#94bdb4','#92adb6','#829fb2','#829caa'],
 workshop:['#dfcba1','#d9c89a','#d8be91','#cbb891','#b7b994','#adb398','#9ea99a','#9caa9c'],
 observatory:['#9caeb0','#94a4b4','#899cb6','#8b96b4','#7d8eab','#7b87a6','#6c779e','#656b94']
});

/** Only explicit completions are stored; the key is already registered as learning progress. */
const LEARNING_KEY='ns-account-learning-v2';
const recordKey=(world,id)=>`ns-lab:${world}:${id}`;
function completedIds(world){
 try{const value=JSON.parse(localStorage.getItem(LEARNING_KEY)||'{}');return new Set(WORLD_META[world].nodes.filter(n=>value?.[recordKey(world,n.id)]?.completed===true).map(n=>n.id));}
 catch{return new Set();}
}
export function markLabNodeComplete(world,id){
 if(!WORLD_META[world]?.nodes.some(node=>node.id===id))return false;
 try{
  const old=JSON.parse(localStorage.getItem(LEARNING_KEY)||'{}');
  const updated=(old&&typeof old==='object'&&!Array.isArray(old))?old:{};
  const when=new Date().toISOString();
  updated[recordKey(world,id)]={kind:'life-lab-activity',completed:true,completedAt:when,updatedAt:when};
  localStorage.setItem(LEARNING_KEY,JSON.stringify(updated));
  return true;
 }catch{return false;}
}
/** Enables tests to inspect actual current step without modifying data. */
export function nextLabNode(world){
 const nodes=WORLD_META[world]?.nodes||[];const done=completedIds(world);
 return nodes.find(n=>!done.has(n.id))?.id||null;
}

/** Consistent original SVG iconography instead of variable platform emoji glyphs. */
const ICON_PATHS=Object.freeze({
 capstone:'<path d="m12 2 3.2 6.6 7.3 1.1-5.3 5.2 1.3 7.3L12 18.7l-6.5 3.5 1.3-7.3-5.3-5.2 7.3-1.1Z" fill="currentColor" stroke-linejoin="round"/>',
 discover:'<path d="M3 5q4-2 9 1 5-3 9-1v14q-4-2-9 1-5-3-9-1Z M12 6v14"/>',
 notice:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/>',
 explore:'<circle cx="10" cy="10" r="6"/><path d="m14.5 14.5 6 6"/>',
 compare:'<path d="M12 3v17M5 6h14M5 6 2 13h6L5 6Zm14 0-3 7h6l-3-7ZM8 21h8"/>',
 rehearse:'<path d="M4 5h16v11H9l-5 4Z"/><path d="M8 9h8M8 12h6"/>',
 practise:'<path d="M3 9h3v6H3ZM6 6h3v12H6Zm3 5h6m0-5h3v12h-3Zm3 3h3v6h-3Z"/>',
 apply:'<path d="M12 21v-10M12 14C3 14 3 7 3 4c6 0 9 3 9 10Zm0 0c0-8 3-10 9-10 0 7-3 10-9 10Z"/>',
 recall:'<path d="M20 11a8 8 0 1 0-2 6M20 4v7h-7"/>',
 transfer:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
 reflect:'<path d="M4 4h16v12H9l-5 4Z"/><path d="M8 9h8"/>',
 review:'<path d="m4 12 5 5L20 6"/>',
 locked:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 });
function nodeIcon(type){const path=ICON_PATHS[type]||ICON_PATHS.discover;return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;}

let currentWorld='forest';
const lastScroll=new Map();
let cleanup=()=>{};
export function cleanupLivingTrail(){cleanup();cleanup=()=>{};}
const clamp=(v,low,high)=>Math.max(low,Math.min(high,v));
const round=v=>Number(v.toFixed(2));
function seeded(seed){let h=2166136261;for(const c of seed){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return ()=>{h^=h<<13;h^=h>>>17;h^=h<<5;return (h>>>0)/4294967296;};}
/** Road x-coordinate in an unchanging world coordinate system; distance measured from trailhead. */
export function trailX(y,world='forest',height=SCENE_H){
 const phases={meadow:0.15,forest:1.08,bridge:2.14,workshop:2.80,observatory:3.36};
 const d=height-y, p=phases[world]??1.08;
 return clamp(240+112*Math.sin(d/174+p)+29*Math.sin(d/565+p*.67),109,371);
}
function roadPath(world,height=SCENE_H){
 const dy=60;
 let d=`M ${round(trailX(0,world,height))} 0`;
 // Hermite form: continuous first derivatives at every join.
 const tangent=y=>(trailX(y+2,world,height)-trailX(y-2,world,height))/4;
 for(let y=0;y<height;y+=dy){
  const end=Math.min(height,y+dy),h=end-y,x0=trailX(y,world,height),x1=trailX(end,world,height);
  d+=` C ${round(x0+tangent(y)*h/3)} ${round(y+h/3)} ${round(x1-tangent(end)*h/3)} ${round(y+2*h/3)} ${round(x1)} ${end}`;
 }
 return d;
}
const TERRAIN_INK={meadow:'#5a916e',forest:'#3f8068',bridge:'#548f83',workshop:'#8b9267',observatory:'#7388a1'};
function landscapeProp(world,x,y,size,variant){
 const k=round(size/24),c=TERRAIN_INK[world];
 // All landforms are scalable vectors. Different chapters vary the palette,
 // distribution and architectural features without introducing hard image edges.
 if(world==='meadow'){
  if(variant%4===0)return `<g transform="translate(${round(x)} ${round(y)}) scale(${k})"><path d="M0 2V-17" stroke="#578e61" stroke-width="2.7"/><circle cy="-18" r="8" fill="#fcf1c5"/><circle cy="-18" r="3" fill="#e6b953"/><ellipse cy="6" rx="16" ry="5" fill="#67986d" opacity=".7"/></g>`;
  return `<g transform="translate(${round(x)} ${round(y)}) scale(${k})" opacity=".85"><ellipse cx="-8" rx="13" ry="8" fill="#6fa275"/><ellipse cx="5" cy="-5" rx="14" ry="13" fill="#80aa76"/><circle cx="-5" cy="-15" r="4" fill="#e9c67b"/></g>`;
 }
 if(world==='forest'){
  const v=variant%8;
  if(v===0||v===1||v===7)return `<g transform="translate(${round(x)} ${round(y)}) scale(${round(k*.96)})" opacity=".96"><path d="M0 4V-43" stroke="#765038" stroke-width="7"/><path d="M0-79-27-31H-13L-36 4H36L13-31H27Z" fill="${v===0?'#0f6848':'#167b56'}" stroke="#18583f" stroke-width="1.5"/><path d="M0-75-15-44H15Z" fill="#28a36a"/></g>`;
  if(v===2||v===3)return `<g transform="translate(${round(x)} ${round(y)}) scale(${round(k)})"><path d="M0 10V-52" stroke="#775037" stroke-width="10"/><g fill="${v===2?'#62b52a':'#318e42'}"><circle cx="-25" cy="-54" r="27"/><circle cx="9" cy="-66" r="34"/><circle cx="30" cy="-42" r="23"/></g><g fill="#94d83b" opacity=".83"><circle cx="-16" cy="-68" r="14"/><circle cx="17" cy="-79" r="14"/></g></g>`;
  if(v===4||v===6)return `<g transform="translate(${round(x)} ${round(y)}) scale(${round(k*.88)})"><path d="M0 8V-25" stroke="#2e9443" stroke-width="3"/><path d="M-23 1Q-19-22 0-9Q19-25 23 1Z" fill="#1f9543"/><g fill="${v===4?'#ffdf28':'#ff70a6'}">${[0,60,120,180,240,300].map(a=>`<ellipse transform="rotate(${a} 0 -29)" cx="0" cy="-38" rx="7" ry="14"/>`).join('')}</g><circle cy="-29" r="8" fill="#ffe989"/></g>`;
  return `<g transform="translate(${round(x)} ${round(y)}) scale(${round(k*.88)})"><path d="M-15 6V-14Q0-36 15-14V6Z" fill="#fff6d9"/><path d="M-29-10Q-25-47 0-47Q25-47 29-10Z" fill="#f0664c"/><circle cx="-12" cy="-21" r="4" fill="#fff7e9"/><circle cx="8" cy="-34" r="5" fill="#fff7e9"/></g>`;
 }
 if(world==='bridge'){
  if(variant%9===0)return `<g transform="translate(${round(x)} ${round(y)}) scale(${k})" opacity=".8"><path d="M-20 12H20M-20-1Q0-30 20-1M-20 12V-1M20 12V-1" stroke="#806b54" stroke-width="4" fill="none"/><path d="M-20 5H20" stroke="#a3865b" stroke-width="4"/></g>`;
  return `<g transform="translate(${round(x)} ${round(y)}) scale(${k})"><ellipse cy="4" rx="20" ry="7" fill="#78aa96" opacity=".7"/><path d="M0 7V-33" stroke="#54826a" stroke-width="3"/><circle cy="-35" r="14" fill="#79ad8b"/></g>`;
 }
 if(world==='workshop'){
  if(variant%6===0)return `<g transform="translate(${round(x)} ${round(y)}) scale(${k})"><rect x="-18" y="-25" width="38" height="32" rx="3" fill="#e9cb94" stroke="#9e865b" stroke-width="2"/><path d="M-24-25 0-47 26-25Z" fill="#b68c59"/><rect x="-4" y="-11" width="11" height="18" fill="#829c79"/></g>`;
  return `<g transform="translate(${round(x)} ${round(y)}) scale(${k})" opacity=".85"><ellipse cy="4" rx="19" ry="7" fill="#a4af82"/><path d="M0 4V-30" stroke="#806f53" stroke-width="3"/><ellipse cx="0" cy="-31" rx="15" ry="15" fill="#93a779"/></g>`;
 }
 if(variant%6===0)return `<g transform="translate(${round(x)} ${round(y)}) scale(${k})"><ellipse cy="5" rx="22" ry="8" fill="#acb1bd" opacity=".65"/><path d="M-16 3 0-21 18 3Z" fill="#8394a4"/></g>`;
 return `<g transform="translate(${round(x)} ${round(y)}) scale(${k})" opacity=".8"><path d="M0 3V-31" stroke="#9fa9b3" stroke-width="3"/><path d="M0-47 -20-6H20Z" fill="#788c9b"/><circle cx="-17" cy="-28" r="2.5" fill="#fff0bf"/></g>`;
}
function destinationSvg(world){
 const base='<ellipse cx="0" cy="88" rx="175" ry="27" fill="#314c47" opacity=".27"/>';
 const g={
 meadow:`<path d="M-170 62 Q-86-15 0 50 Q85-19 173 65L170 94H-170Z" fill="#9fb59b"/><path d="M-110 66Q0-25 105 66" stroke="#3c6758" stroke-width="17" fill="none"/><path d="M-110 66Q0-25 105 66" stroke="#bcc9a1" stroke-width="8" fill="none"/><g fill="#d4dfb3"><circle cx="-130" cy="55" r="27"/><circle cx="128" cy="59" r="28"/><circle cx="-72" cy="42" r="18"/><circle cx="78" cy="39" r="20"/></g>`,
 forest:`<path d="M-196 82-98-64-46-6 17-115 128 53 182 82Z" fill="#4b6b6c" opacity=".72"/><path d="M-67 73 17-115 98 74Z" fill="#b6c9bb" opacity=".55"/><rect x="-18" y="-48" width="35" height="116" rx="3" fill="#354f4c"/><path d="M-42-49H41L30-71H-30Z" fill="#304845"/><rect x="-9" y="-29" width="17" height="20" fill="#f0d6a4" opacity=".65"/>`,
 bridge:`<path d="M-186 75Q-35 10 176 78V92H-186Z" fill="#4c8290"/><path d="M-170 58Q0-48 170 58" fill="none" stroke="#355e58" stroke-width="23"/><path d="M-170 58Q0-48 170 58" fill="none" stroke="#ddc7a3" stroke-width="12"/><g fill="#607c70"><rect x="-104" y="-3" width="34" height="61"/><rect x="58" y="-8" width="36" height="66"/><rect x="-50" y="-33" width="31" height="46"/><rect x="17" y="-26" width="25" height="39"/></g>`,
 workshop:`<rect x="-116" y="-36" width="228" height="117" rx="10" fill="#b59c7c"/><path d="M-141-37 0-114 141-37Z" fill="#485a50"/><rect x="-22" y="5" width="44" height="77" rx="3" fill="#354e4b"/><g fill="#f1d5a0"><rect x="-82" y="-13" width="30" height="32"/><rect x="57" y="-13" width="30" height="32"/></g><rect x="73" y="-112" width="23" height="77" rx="5" fill="#495f56"/>`,
 observatory:`<rect x="-112" y="-18" width="224" height="100" rx="8" fill="#6a788f"/><path d="M-107-19A107 91 0 0 1 107-19Z" fill="#bfc3ce" stroke="#4c5c77" stroke-width="9"/><path d="M0-107V20" stroke="#65758f" stroke-width="6"/><rect x="-25" y="8" width="50" height="74" rx="4" fill="#394960"/><g fill="#f6dfa3"><circle cx="-75" cy="27" r="12"/><circle cx="75" cy="27" r="12"/></g>`
 };
 return `<g transform="translate(240 245)" opacity=".84" filter="url(#ns-trail-softshadow)">${base}${g[world]}</g>`;
}
function chapterLandmark(world,chapter,height=SCENE_H){
 const y=DEST_H+(7-chapter)*5*UNIT_H+2.5*UNIT_H;
 const roadX=trailX(y,world,height),x=roadX>240?76:400;
 // Eight landmarks per world. All sit beside—not on—the one continuous road.
 const map={
  meadow:['flower','flower','water','orchard','wind','stone','ridge','gate'],
  forest:['pine','pine','fern','water','mist','stone','ridge','tower'],
  bridge:['water','water','bridge','house','house','water','bridge','house'],
  workshop:['house','tools','house','windmill','house','gear','chimney','house'],
  observatory:['sun','star','stars','stone','moon','ridge','scope','dome']
 };
 const kind=map[world][chapter],wood='#416a5c',stone='#b4b7ad';
 const motif={
  flower:`<path d="M0 24V-35" stroke="${wood}" stroke-width="6"/><g fill="#ffecc9"><circle cx="0" cy="-62" r="18"/><circle cx="-19" cy="-42" r="18"/><circle cx="19" cy="-42" r="18"/><circle cx="0" cy="-24" r="18"/></g><circle cy="-43" r="10" fill="#d1a750"/>`,
  pine:`<path d="M0 29V-75" stroke="#43594c" stroke-width="8"/><path d="M0-104-51-29H-27L-60 12H60L27-29H51Z" fill="#467965"/><path d="M0-98-30-47H30Z" fill="#9fbc9f"/>`,
  fern:`<path d="M0 29V-83" stroke="${wood}" stroke-width="5"/>${Array.from({length:5},(_,i)=>`<path d="M0 ${-78+i*18}q-25 -20-40 4M0 ${-78+i*18}q25 -20 40 4" stroke="#4a8e72" stroke-width="8" stroke-linecap="round" fill="none"/>`).join('')}`,
  water:`<path d="M-65-60Q-25-86 5-54T65-49M-65-29Q-25-55 5-23T65-18M-65 4Q-25-22 5 10T65 15" stroke="#7ebcc4" stroke-width="15" opacity=".68" stroke-linecap="round" fill="none"/>`,
  orchard:`<path d="M0 29V-63" stroke="#6b7655" stroke-width="11"/><circle cy="-79" r="44" fill="#8fae78"/><g fill="#e6b78a"><circle cx="-20" cy="-76" r="8"/><circle cx="18" cy="-94" r="7"/><circle cx="9" cy="-58" r="9"/></g>`,
  wind:`<path d="M-60-46Q-7-76 34-47T50-9M-63-8Q-25-30 22-14T58 5M-54 25Q-11 3 43 28" stroke="#d8e3d3" stroke-width="9" stroke-linecap="round" fill="none"/>`,
  stone:`<path d="M-59 24-33-16 5-18 33 24ZM-8 25 21-61 65-38 67 25Z" fill="${stone}"/><path d="M-4 17 21-61 39-25Z" fill="#d5d3bd" opacity=".8"/>`,
  ridge:`<path d="M-75 28-40-37-15 5 17-73 77 28Z" fill="#5c8684"/><path d="M-8 7 17-73 41-10 23-14 16-32Z" fill="#d3e0ce"/>`,
  mist:`<g fill="#eff0dc" opacity=".55"><ellipse cx="-29" cy="-58" rx="39" ry="16"/><ellipse cx="18" cy="-31" rx="50" ry="20"/><ellipse cx="-10" cy="9" rx="46" ry="17"/></g>`,
  tower:`<rect x="-16" y="-75" width="32" height="108" fill="#47615b"/><path d="M-36-73H37L24-99H-24Z" fill="#3b5552"/><rect x="-7" y="-52" width="14" height="18" fill="#f5dba0"/>`,
  bridge:`<path d="M-75 26Q0-65 75 26" stroke="#9a7855" stroke-width="19" fill="none"/><path d="M-75 26Q0-65 75 26" stroke="#ecd19c" stroke-width="10" fill="none"/><path d="M-75 28H75" stroke="#7e9a87" stroke-width="7"/>`,
  house:`<rect x="-51" y="-37" width="104" height="67" rx="5" fill="#d3b68d" stroke="#8d7d58" stroke-width="4"/><path d="M-65-37 0-88 68-37Z" fill="#8e7758"/><rect x="-10" y="-4" width="23" height="34" fill="#607e71"/>`,
  tools:`<path d="M-42 25 33-77M-25-66 38 8" stroke="#89795e" stroke-width="15" stroke-linecap="round"/><circle cx="33" cy="-77" r="16" stroke="#a8b69a" stroke-width="10" fill="none"/>`,
  windmill:`<rect x="-24" y="-48" width="48" height="81" fill="#d4c29b"/><path d="M-31-48 0-77 31-48Z" fill="#886f57"/><path d="M0-45V-107M0-45H66M0-45V17M0-45H-66" stroke="#e9dbc1" stroke-width="13"/>`,
  gear:`<g fill="#b19f78" stroke="#82765c" stroke-width="9"><circle cy="-36" r="47"/><circle cy="-36" r="23" fill="#e0d5ba"/></g>`,
  chimney:`<rect x="-27" y="-38" width="75" height="69" fill="#bfaa8b"/><rect x="11" y="-91" width="22" height="53" fill="#897f70"/><g fill="#e9e4d5" opacity=".7"><circle cx="24" cy="-118" r="16"/><circle cx="36" cy="-144" r="22"/></g>`,
  sun:`<circle cy="-32" r="37" fill="#f1d4a0" opacity=".7"/>`,
  star:`<path d="M0-102 14-57 62-49 22-22 34 29 0-4-34 29-22-22-62-49-14-57Z" fill="#d5d6c7"/>`,
  stars:`${Array.from({length:12},(_,i)=>`<circle cx="${-50+i*9}" cy="${-78+(i%3)*29}" r="${i%3+2}" fill="#f6deaf"/>`).join('')}`,
  moon:`<path d="M9-102A49 49 0 1 0 43-10A41 41 0 0 1 9-102Z" fill="#f0dab8"/>`,
  scope:`<path d="M-51 25 8-44M51 25 8-44" stroke="#b2ac94" stroke-width="7"/><path d="M-48-78 50-32 30 2-68-44Z" fill="#77839a" stroke="#d7d8c9" stroke-width="5"/>`,
  dome:`<rect x="-62" y="-30" width="124" height="67" fill="#b0b4c7"/><path d="M-62-31A62 59 0 0 1 62-31Z" fill="#d6cbd1"/><path d="M0-91V-26" stroke="#74829c" stroke-width="5"/>`,
  gate:`<path d="M-48 28V-40Q0-112 48-40V28" stroke="#6b876c" stroke-width="14" fill="none"/>`
 }[kind];
 return `<g transform="translate(${round(x)} ${round(y)})" opacity=".65">${motif}</g>`;
}
/** Saturated botanical details distributed across the whole continuous scene. */
function forestDetails(height){
 const rng=seeded('ns-forest-rich-landscape-3'),parts=[];
 const heights=['#d5f187','#9cdc49','#67b740','#4ca765','#7bd252','#3b875f','#3c9772','#6fb8b0'];
 for(let y=110;y<height-30;y+=145){
  const chapter=clamp(7-Math.floor((y-DEST_H)/(UNIT_H*5)),0,7);
  const x=trailX(y,'forest',height);
  for(const side of [-1,1]){
   const edge=side===-1?Math.min(105,x-105):Math.max(375,x+105);
   const gx=clamp(edge+(rng()-.5)*75,25,455),gy=y+(-25+rng()*45);
   const scale=.65+rng()*.55;
   if(rng()>.35){
    parts.push(`<g transform="translate(${round(gx)} ${round(gy)}) scale(${round(scale)})"><path d="M0 30V-82" stroke="#704a2e" stroke-width="15" stroke-linecap="round"/><path d="M0-30-24-61M0-52 29-83" stroke="#704a2e" stroke-width="9"/><g fill="${heights[chapter]}"><circle cx="-35" cy="-103" r="36"/><circle cx="11" cy="-116" r="47"/><circle cx="43" cy="-87" r="34"/><circle cx="-10" cy="-73" r="40"/></g><g fill="#a7ec4b" opacity=".8"><circle cx="-38" cy="-121" r="18"/><circle cx="17" cy="-139" r="20"/></g></g>`);
   }else{
    parts.push(`<g transform="translate(${round(gx)} ${round(gy)}) scale(${round(scale)})"><path d="M0 21V-93" stroke="#674c39" stroke-width="12"/><path d="M0-132-38-62H-18L-49 8H49L18-62H38Z" fill="#126344" stroke="#0b513c" stroke-width="3"/><path d="M0-125-22-82H22Z" fill="#2a9865"/></g>`);
   }
   if(rng()>.25){const fx=clamp(gx+side*(40+rng()*45),15,470),fy=gy+50+rng()*38;
    parts.push(`<g transform="translate(${round(fx)} ${round(fy)})" opacity=".94"><path d="M0 0v-24" stroke="#339b54" stroke-width="3"/><g fill="${rng()>.5?'#fff3b2':'#f977a5'}"><circle cx="0" cy="-34" r="7"/><circle cx="-10" cy="-24" r="7"/><circle cx="10" cy="-24" r="7"/><circle cx="0" cy="-13" r="7"/></g><circle cx="0" cy="-24" r="5" fill="#ffd23f"/></g>`);
   }
   // Thick foreground leafy clumps make the forest feel lived-in and botanical.
   if(rng()>.2){const bx=clamp(gx+side*(35+rng()*28),12,467),by=gy+32+rng()*34;
    parts.push(`<g transform="translate(${round(bx)} ${round(by)})"><g fill="${rng()>.5?'#0f8344':'#48b538'}"><ellipse cx="-19" cy="-2" rx="16" ry="24" transform="rotate(-30 -19 -2)"/><ellipse cx="5" cy="-12" rx="17" ry="27" transform="rotate(21 5 -12)"/><ellipse cx="24" cy="5" rx="15" ry="22" transform="rotate(37 24 5)"/></g><g fill="#96da35" opacity=".8"><ellipse cx="-10" cy="-17" rx="9" ry="15"/><ellipse cx="19" cy="-2" rx="7" ry="12"/></g></g>`);
   }
  }
 }
 return parts.join('');
}
/** Chapter landmarks are part of the same scene, never separate rectangular images. */
function forestChapterFeatures(height){
 const out=[];
 for(let chapter=0;chapter<8;chapter++){
  const y=DEST_H+(7-chapter)*5*UNIT_H+UNIT_H*2.7;
  const x=trailX(y,'forest',height);const side=x>240?-1:1;
  const px=side===-1?75:405;
  const features=[
    `<g transform="translate(${px} ${round(y)})"><path d="M0 42V-95" stroke="#805233" stroke-width="15"/><path d="M-48-88 60-86 47-38-55-44Z" fill="#b87f3d" stroke="#865421" stroke-width="7"/><path d="M-36-68H36" stroke="#f5d388" stroke-width="8" stroke-linecap="round"/></g>`,
    `<g transform="translate(${px} ${round(y)})"><path d="M-82 42Q-53-60 0-30T90-81" stroke="#8cca31" stroke-width="35" fill="none"/><path d="M-70 30Q-40-90 15-49T69-116" stroke="#206f48" stroke-width="27" fill="none"/></g>`,
    `<g transform="translate(${px} ${round(y)})"><path d="M-42-114Q-20-35-70 18" fill="none" stroke="#6bcdeb" stroke-width="33" stroke-linecap="round"/><path d="M-43-111Q-24-35-70 18" fill="none" stroke="#b6f3ff" stroke-width="13" stroke-linecap="round"/><g fill="#788593"><path d="M-95 18-65-38-15 18Z"/><path d="M-12 30 11-18 67 30Z"/></g></g>`,
    `<g transform="translate(${px} ${round(y)})"><path d="M-110 40Q0-100 105 40" stroke="#8d5c2e" stroke-width="24" fill="none"/><path d="M-110 40Q0-100 105 40" stroke="#d5a267" stroke-width="12" fill="none"/><path d="M-115 55H110" stroke="#805333" stroke-width="9"/><path d="M-70-5V52M0-46V48M71-5V52" stroke="#9b713b" stroke-width="7"/></g>`,
    `<g transform="translate(${px} ${round(y)})"><ellipse cy="15" rx="115" ry="30" fill="#b9ec51"/>${Array.from({length:13},(_,i)=>{const xx=-95+i*15;const yy=14-((i*13)%20);return `<g transform="translate(${xx} ${yy})"><path d="M0 15V-12" stroke="#2e9b44" stroke-width="3"/><circle cy="-17" r="8" fill="${i%2?'#f26c9c':'#ffda33'}"/><circle cy="-17" r="3" fill="#fff9d2"/></g>`;}).join('')}</g>`,
    `<g transform="translate(${px} ${round(y)})"><path d="M-125 42-70-41-11 14 38-92 132 42Z" fill="#778d8c"/><path d="M-13 9 38-92 97 18 43-7 36-35Z" fill="#d4e4d0"/></g>`,
    `<g transform="translate(${px} ${round(y)})"><path d="M-115 45-32-92 24-22 90-134 145 45Z" fill="#44756d"/><path d="M37-35 90-134 133 12 93-22 90-61Z" fill="#c2dbd0"/></g>`,
    `<g transform="translate(${px} ${round(y)})"><path d="M-140 50-50-80 7-18 65-152 140 50Z" fill="#5b7c84"/><path d="M36-65 65-152 115 15 72-18 64-70Z" fill="#e8edf1"/></g>`
  ];
  out.push(features[chapter]);
 }
 return out.join('');
}
/** Foliage cut from the approved Forest visual reference, softly feathered. */
function forestFoliageTexture(height){
 const pieces=[];
 for(let y=140,i=0;y<height-300;y+=900,i++){
  const offset=i%3===0?0:i%3===1?37:-25;
  pieces.push(`<image href="ns-forest-foliage-left.webp" x="-3" y="${y+offset}" width="171" height="274" opacity="${i%2===0?'.94':'.78'}" preserveAspectRatio="none"/>`);
  pieces.push(`<image href="ns-forest-foliage-right.webp" x="317" y="${y+390-offset}" width="167" height="264" opacity="${i%2===0?'.83':'.93'}" preserveAspectRatio="none"/>`);
 }
 // The initial playable unit receives the closest artwork match to the reference.
 pieces.push(`<image href="ns-forest-foliage-left.webp" x="0" y="${height-376}" width="175" height="315" opacity=".97" preserveAspectRatio="none"/>`);
 pieces.push(`<image href="ns-forest-foliage-right.webp" x="315" y="${height-485}" width="169" height="300" opacity=".98" preserveAspectRatio="none"/>`);
 return `<g aria-hidden="true">${pieces.join('')}</g>`;
}
/** SVG is a single, full-height vector: no per-unit panels, no touching scene tiles. */
export function continuousScene(world,height=SCENE_H){
 const rng=seeded(`${world}:continuum-v2`);
 const palette=WORLD_PALETTES[world];
 const stops=palette.slice().reverse().map((color,i)=>`<stop offset="${round(i/7*100)}%" stop-color="${color}"/>`).join('');
 const road=roadPath(world,height);
 const props=[];
 for(let y=65,n=0;y<height-60;y+=94,n++){
  const chapter=clamp(7-Math.floor((y-DEST_H)/(UNIT_H*5)),0,7);
  const roadX=trailX(y,world,height);
  for(const side of [-1,1]){
   if(rng()<.14)continue;
   const dist=91+rng()*60;
   const px=clamp(roadX+side*dist,18,462);
   const size=16+rng()*16+(chapter/7)*3;
   props.push(landscapeProp(world,px,y+((rng()-.5)*30),size,n+chapter*3+(side===1?1:0)));
  }
 }
 const bands=`<path d="${road}" stroke="#f6f2d8" stroke-width="258" fill="none" opacity=".09"/><path d="${road}" stroke="#1b5b4d" stroke-width="166" fill="none" opacity=".09"/>`;
 const stars=world==='observatory'?Array.from({length:110},(_,i)=>{
  const x=round(10+rng()*460),y=round(rng()*height);return `<circle cx="${x}" cy="${y}" r="${round(.7+rng()*1.3)}" fill="#f6e4b9" opacity="${round(.2+rng()*.42)}"/>`;
 }).join(''):'';
 return `<svg class="ns-trail-continuous-scene" data-continuous-landscape="${world}" viewBox="0 0 480 ${height}" preserveAspectRatio="none" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="ns-trail-ground-${world}" x1="0" y1="0" x2="0" y2="1">${stops}</linearGradient><linearGradient id="ns-trail-road-${world}" x1="0" y1="0" x2="1" y2="0"><stop stop-color="#eabb6f"/><stop offset="49%" stop-color="#ffdfa4"/><stop offset="100%" stop-color="#e9b66b"/></linearGradient><filter id="ns-trail-softshadow" x="-35%" width="170%" y="-35%" height="170%"><feDropShadow dx="0" dy="7" stdDeviation="7" flood-color="#1b3938" flood-opacity=".21"/></filter></defs>
 <rect width="480" height="${height}" fill="url(#ns-trail-ground-${world})"/>${world==='forest'?forestDetails(height)+forestChapterFeatures(height):''}${bands}
 <path d="${road}" stroke="#6eaa4a" stroke-width="116" opacity=".2" fill="none" stroke-linecap="round"/><path d="${road}" stroke="url(#ns-trail-road-${world})" stroke-width="94" fill="none" stroke-linecap="round"/><path d="${road}" stroke="#fff4cc" stroke-width="68" opacity=".58" fill="none" stroke-linecap="round"/>
 ${world==='forest'?forestFoliageTexture(height):''}${props.join('')}${CHAPTERS[world].map((_,i)=>chapterLandmark(world,i,height)).join('')}${stars}${destinationSvg(world)}
 <path d="M0 ${height-17}Q115 ${height-46} 240 ${height-16}T480 ${height-22}V${height}H0Z" fill="${TERRAIN_INK[world]}" opacity=".18"/>
 </svg>`;
}
const WORLD_ICONS={
 '✿':'<path d="M12 21v-9M12 13C4 13 3 7 3 3c5 0 9 2 9 10ZM12 13c0-7 4-10 9-10 0 7-3 10-9 10Z"/>',
 '♠':'<path d="M12 2 5 12h3l-4 6h16l-4-6h3L12 2ZM12 18v4"/>',
 '♧':'<path d="M3 20h18M4 20V12C4 6 8 4 12 4s8 2 8 8v8M4 14h16M8 10v10M16 10v10"/>',
 '⚒':'<path d="m4 20 10-10M10 5l9 9M8 4l-4 4 4 4 4-4ZM20 13l-7 7"/>',
 '✦':'<path d="m12 2 2.6 7.3L22 12l-7.4 2.7L12 22l-2.7-7.3L2 12l7.3-2.7L12 2Z"/>'
};
function iconMini(icon){const path=WORLD_ICONS[icon];return `<span aria-hidden="true" class="ns-trail-mini-icon">${path?`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" focusable="false"><g>${path}</g></svg>`:icon}</span>`;}
function chooser(world,worlds){return `<div class="ns-trail-switchmenu" hidden data-trail-menu id="ns-trail-world-menu" role="group" aria-label="Choose a Life Lab world">${worlds.map(w=>`<a href="#lab/${w.id}" class="ns-trail-world-option" ${w.id===world.id?'aria-current="true"':''}>${iconMini(WORLD_META[w.id].icon)}<span><strong>${escapeText(w.title)}</strong><small>${escapeText(w.theme)}</small></span>${w.id===world.id?'<span aria-hidden="true">✓</span>':''}</a>`).join('')}</div>`;}
function dialogContent(world,node){
 const done=completedIds(world.id).has(node.id);
 return `<div class="ns-trail-dialog__top"><span class="ns-trail-dialog-icon" aria-hidden="true">${nodeIcon(node.type)}</span><button type="button" class="ns-trail-dialog-close" data-trail-close aria-label="Close preview">×</button></div><p class="ns-trail-eyebrow">${escapeText(world.name)} · ${node.status==='mission'?'INTERACTIVE MISSION':'PRACTICAL TOOL'}</p><h2 id="ns-trail-dialog-title">${escapeText(node.title)}</h2><p>${escapeText(node.detail)}</p><a class="ns-trail-dialog-go" href="${escapeText(node.href)}">${node.status==='mission'?'Start mission':'Open tool'} →</a>${node.status==='tool'?`<button type="button" class="ns-trail-mark-complete" data-trail-complete="${escapeText(node.id)}">${done?'Practised ✓ · keep as complete':'I have practised this tool · mark complete'}</button><p class="ns-trail-dialog-note">Only mark complete after trying the activity. You can replay it at any time.</p>`:'<p class="ns-trail-dialog-note">Finish the mission and explicitly save completion to advance the character.</p>'}`;
}
function plannedUnitPreview(world,number){
 const unit=world.id==='forest'?getForestUnitOutline(number):null;
 if(!unit)return '';
 return `<div class="ns-trail-dialog__top"><span class="ns-trail-dialog-icon" aria-hidden="true">${nodeIcon('discover')}</span><button type="button" class="ns-trail-dialog-close" data-trail-close aria-label="Close preview">×</button></div><p class="ns-trail-eyebrow">THE FOREST · UNIT ${unit.number} · PLANNED</p><h2 id="ns-trail-dialog-title">${escapeText(unit.title)}</h2><p>These activities are being developed. You can see the learning sequence without mistaking it for published content.</p><ol class="ns-trail-future-lessons">${unit.steps.map(step=>`<li><strong>${escapeText(step.label)}</strong><span>${escapeText(step.title)}</span></li>`).join('')}</ol><button type="button" class="ns-trail-mark-complete" data-trail-close>Back to the trail</button>`;
}
function yForUnit(number){return DEST_H+(UNIT_COUNT-number)*UNIT_H;}
function nodeMarkup(node,index,world){
 const localY=UNIT_H-105-index*97,y=yForUnit(1)+localY;
 const x=round(100*trailX(y,world.id)/480),leftSide=x>50;
 const done=completedIds(world.id),next=world.nodes.find(n=>!done.has(n.id))?.id||null;
 const isDone=done.has(node.id),isCurrent=next===node.id,atLastCompleted=next===null&&index===world.nodes.length-1;
 const state=isDone?'completed':isCurrent?'current':'available';
 const kind=isDone?'review':node.type;
 const ntype=node.type==='capstone'?'capstone':node.type;
 return `<button type="button" class="ns-trail-node ns-trail-node--${state} ns-trail-node--type-${ntype}" data-trail-node="${escapeText(node.id)}" data-unit="1" style="--node-x:${x}%;--node-y:${localY}px" aria-label="${escapeText(node.title)}. ${isDone?'Completed':isCurrent?'Next mission':'Available to practise'}." aria-haspopup="dialog"><span class="ns-trail-stone" aria-hidden="true">${nodeIcon(kind)}</span><span class="ns-trail-node-title" data-side="${leftSide?'left':'right'}"><strong>${escapeText(node.title)}</strong><small>${isDone?'COMPLETE':isCurrent?'NEXT MISSION':node.status==='mission'?'INTERACTIVE MISSION':'OPEN TOOL'}</small></span>${isCurrent||atLastCompleted?`<span class="ns-trail-start" aria-hidden="true">${atLastCompleted?'UNIT 1 PRACTISED':'NEXT MISSION'}</span><img class="ns-trail-walker" src="${escapeText(world.pose)}" alt="" loading="eager" decoding="async"/>`:''}</button>`;
}
function unitMarkup(world,unit,index){
 const number=index+1,top=yForUnit(number);
 const planned=index!==0;
 const chap=Math.floor(index/5)+1;
 const side=trailX(top+UNIT_H/2,world.id)>240?'left':'right';
 const ghostTypes=['discover','explore','compare','practise','apply'];
 const ghost=planned?Array.from({length:4},(_,n)=>{
  const localY=50+n*85,y=top+localY,x=round(100*trailX(y,world.id)/480);
  return `<span class="ns-trail-future-node ns-trail-future-node--${ghostTypes[(n+number)%ghostTypes.length]}" style="--ghost-x:${x}%;--ghost-y:${localY}px" aria-hidden="true">${nodeIcon(ghostTypes[(n+number)%ghostTypes.length])}</span>`;
 }).join(''):world.nodes.map((node,i)=>nodeMarkup(node,i,world)).join('');
 return `<section class="ns-trail-unit ${planned?'ns-trail-unit--planned':'ns-trail-unit--active'}" style="top:${top}px;height:${UNIT_H}px" tabindex="-1" aria-label="Unit ${number}: ${escapeText(unit.title)}. ${planned?'Not yet published.':'Activities available.'}" data-unit="${escapeText(unit.id)}" data-unit-number="${number}" data-unit-title="${escapeText(unit.title)}" data-chapter="${chap}">
 ${ghost}${planned&&world.id==='forest'?`<button type="button" class="ns-trail-unit-plaque" data-side="${side}" data-trail-unit-preview="${number}" aria-label="Preview planned Unit ${number}: ${escapeText(unit.title)}"><span>UNIT ${number} · COMING SOON</span><strong>${escapeText(unit.title)}</strong></button>`:`<div class="ns-trail-unit-plaque" data-side="${side}"><span>UNIT ${number}${planned?' · COMING SOON':''}</span><strong>${escapeText(unit.title)}</strong></div>`}</section>`;
}
function markerMarkup(world,chapter){
 const c=CHAPTERS[world.id][chapter],number=chapter*5+1;
 // Located just below the first unit in each five-unit arc as users climb upward.
 const y=clamp(yForUnit(number)+UNIT_H-34,0,SCENE_H-30);
 return `<div class="ns-trail-chapter-marker" data-chapter-marker="${chapter+1}" style="top:${y}px"><span aria-hidden="true">✦</span><div><small>CHAPTER ${chapter+1} OF 8 · UNITS ${number}–${number+4}</small><strong>${escapeText(c)}</strong></div></div>`;
}
function destinationMarkup(world){const d=DESTINATIONS[world.id];return `<div class="ns-trail-destination" role="note" aria-label="Future grand destination: ${escapeText(d.title)}"><span class="ns-trail-destination__lock" aria-hidden="true">♙</span><span class="ns-trail-eyebrow">THE JOURNEY'S DESTINATION</span><h2>${escapeText(d.title)}</h2><p>${escapeText(d.description)}</p><span class="ns-trail-destination__unavailable">Planned conclusion · Not yet playable</span></div>`;}
const focusDelay=fn=>{if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(fn));};
function attach(main,world){
 if(typeof document==='undefined'||!main.addEventListener)return;
 const controller=new AbortController(),root=main.querySelector('[data-living-trail]');if(!root)return;
 const menu=root.querySelector('[data-trail-menu]'),toggle=root.querySelector('[data-trail-switch]'),map=root.querySelector('[data-trail-map]'),dialog=root.querySelector('[data-trail-dialog]'),unitChip=root.querySelector('[data-trail-unit-chip]');
 let current=null,scrollRAF=0;
 const saveScroll=()=>{if(typeof window!=='undefined')lastScroll.set(world.id,Math.max(0,window.scrollY));};
 const scrollCurrent=()=>map.querySelector('.ns-trail-node--current,.ns-trail-node')?.scrollIntoView({block:'center',behavior:document.documentElement.dataset.motion==='reduce'?'auto':'smooth'});
 const updateUnit=()=>{
  scrollRAF=0;
  // DOM order is top (Unit 40) to bottom (Unit 1).
  const visible=[...map.querySelectorAll('[data-unit-title]')].find(section=>section.getBoundingClientRect().bottom>170);
  if(visible&&unitChip){const chapter=Number(visible.dataset.chapter)||1;const label=`CHAPTER ${chapter} · UNIT ${visible.dataset.unitNumber} · ${visible.dataset.unitTitle}`;if(unitChip.textContent!==label)unitChip.textContent=label;}
  const currentNode=map.querySelector('.ns-trail-node--current,.ns-trail-node'),returnBtn=root.querySelector('[data-trail-return]');
  if(currentNode&&returnBtn){const rect=currentNode.getBoundingClientRect();returnBtn.hidden=rect.top>130&&rect.top<window.innerHeight-130;}
 };
 root.addEventListener('click',event=>{
  const switchBtn=event.target.closest('[data-trail-switch]');if(switchBtn){const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));return;}
  if(event.target.closest('[data-trail-return]')){scrollCurrent();return;}
  if(event.target.closest('[data-trail-close]')){if(dialog.open)dialog.close();return;}
  const completeButton=event.target.closest('[data-trail-complete]');
  if(completeButton){
   const nodeId=completeButton.dataset.trailComplete;
   const done=markLabNodeComplete(world.id,nodeId);
   if(done){lastScroll.set(world.id,window.scrollY);cleanupLivingTrail();renderLivingTrail(main,world.id,[]);}
   else{completeButton.textContent='Could not save. Unlock saved work or try again.';}
   return;
  }
  const plannedButton=event.target.closest('[data-trail-unit-preview]');
  if(plannedButton){
   current=plannedButton;
   const html=plannedUnitPreview(world,Number(plannedButton.dataset.trailUnitPreview));
   if(html){dialog.querySelector('[data-trail-dialog-body]').innerHTML=html;dialog.showModal?.();dialog.querySelector('[data-trail-close]')?.focus();}
   return;
  }
  const nodeButton=event.target.closest('[data-trail-node]');if(nodeButton){const node=world.nodes.find(n=>n.id===nodeButton.dataset.trailNode);if(!node)return;current=nodeButton;dialog.querySelector('[data-trail-dialog-body]').innerHTML=dialogContent(world,node);if(typeof dialog.showModal==='function'){dialog.showModal();dialog.querySelector('[data-trail-close]')?.focus();}else dialog.setAttribute('open','');return;}
  if(!menu.hidden&&!event.target.closest('[data-trail-menu]')){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}
 },{signal:controller.signal});
 dialog.addEventListener('close',()=>current?.focus?.({preventScroll:true}),{signal:controller.signal});
 dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();},{signal:controller.signal});
 if(typeof window!=='undefined')window.addEventListener('scroll',()=>{if(!scrollRAF)scrollRAF=requestAnimationFrame(updateUnit);},{signal:controller.signal,passive:true});
 cleanup=()=>{saveScroll();if(dialog.open)dialog.close();if(scrollRAF)cancelAnimationFrame(scrollRAF);controller.abort();};
 if(typeof window!=='undefined'){
  const initial=()=>{if(!root.isConnected)return;if(lastScroll.has(world.id))window.scrollTo({top:lastScroll.get(world.id),behavior:'instant'});else{
   const node=map.querySelector('.ns-trail-node--current,.ns-trail-node');if(node){const y=window.scrollY+node.getBoundingClientRect().top-Math.max(245,window.innerHeight*.42);window.scrollTo({top:Math.max(0,y),behavior:'instant'});}
  }updateUnit();};
  focusDelay(initial);
  if(!lastScroll.has(world.id)&&typeof setTimeout==='function'){
   const follow=setTimeout(()=>{if(root.isConnected&&window.scrollY<90)initial();},170);
   const prev=cleanup;cleanup=()=>{clearTimeout(follow);prev();};
  }
 }
}
export function renderLivingTrail(main,requestedWorld,sourceWorlds=[]){
 const id=requestedWorld||currentWorld,world=WORLD_META[id];
 if(!world){main.innerHTML=`<section class="ns-living-trail ns-trail-error"><h1>That world isn't available</h1><a href="#lab">Return to Life Lab</a></section>`;return;}
 currentWorld=id;const units=unitsForWorld({...world,id}),worlds=sourceWorlds.length?sourceWorlds.filter(w=>WORLD_META[w.id]):Object.keys(WORLD_META).map(id=>({id,title:WORLD_META[id].name,theme:''}));
 main.innerHTML=`<div class="ns-living-trail ns-trail-continuum ns-trail-fidelity" data-living-trail data-trail-world="${id}"><div class="ns-trail-sticky"><div class="ns-trail-sticky__inner"><div class="ns-trail-switch"><button type="button" class="ns-trail-switch-btn" data-trail-switch aria-expanded="false" aria-controls="ns-trail-world-menu">${iconMini(world.icon)} <span>${escapeText(world.name)}</span><span aria-hidden="true">⌄</span></button>${chooser(world,worlds)}</div></div><div class="ns-trail-unit-chip" data-trail-unit-chip>CHAPTER 1 · UNIT 1 · ${escapeText(world.unit)}</div></div>
 <div class="ns-trail-layout"><div class="ns-trail-canvas" data-trail-map style="--trail-scene-height:${SCENE_H}px;height:${SCENE_H}px">${continuousScene(id)}${destinationMarkup({...world,id})}${units.map((unit,i)=>unitMarkup({...world,id},unit,i)).reverse().join('')}${CHAPTERS[id].map((_,i)=>markerMarkup({...world,id},i)).join('')}</div></div>
 <button type="button" class="ns-trail-return" data-trail-return hidden>↟ Back to my mission</button>
 <dialog class="ns-trail-dialog" data-trail-dialog aria-labelledby="ns-trail-dialog-title"><div data-trail-dialog-body></div></dialog></div>`;
 attach(main,{...world,id});
}
export const livingTrailManifest=Object.freeze({worlds:Object.entries(WORLD_META).map(([id,w])=>({id,unit:w.unit,unitCount:PLANNED_UNIT_TITLES[id].length,available:w.nodes.map(n=>({id:n.id,status:n.status,href:n.href})),chapters:CHAPTERS[id].slice(),destination:DESTINATIONS[id].title})),missionRoute:FOREST_MISSION,viewModes:['map'],renderer:'one-continuous-svg',unitHeight:UNIT_H,sceneHeight:SCENE_H});

/** Backwards-compatible read-only planning export. It never implies publication. */
export const forestCourseDefinition = Object.freeze({
 chapters:Object.freeze(CHAPTERS.forest.slice()),
 units:Object.freeze(forestUnitOutlines.map(unit=>Object.freeze({...unit,
  lessons:Object.freeze(unit.steps.map(step=>({...step,type:step.kind,href:step.href||null})))
 }))),
 lessonTypes:Object.freeze({learn:'Learn',explore:'Explore',compare:'Compare',practise:'Practise',choose:'Choose',apply:'Apply',reflect:'Reflect',review:'Review',milestone:'Milestone'})
});
