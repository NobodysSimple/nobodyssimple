/* A choice, not a syllabus: an individual intervention deck per field guide.
 * Source methods stay intact. Additional cards are clearly labeled as general,
 * optional skills rather than topic-specific treatments or validated protocols.
 */
const KINDS=Object.freeze({
 environment:{label:'Environment',tone:'sage',group:'practical'},
 behaviour:{label:'Behaviour',tone:'gold',group:'action'},
 cognitive:{label:'CBT-informed',tone:'blue',group:'thinking'},
 acceptance:{label:'ACT-informed',tone:'lilac',group:'acceptance'},
 dbt:{label:'DBT-informed',tone:'peach',group:'regulation'},
 compassion:{label:'Self-compassion',tone:'rose',group:'acceptance'},
 support:{label:'Support',tone:'mint',group:'support'},
 observe:{label:'Understand',tone:'slate',group:'thinking'},
 planning:{label:'Planning',tone:'sand',group:'action'}
});
export const interventionKinds=KINDS;
const supplementary=[
 {id:'tiny-pause',title:'Give yourself a permission-to-pause moment',kind:'acceptance',time:'now',effort:'light',duration:'1–2 min',worksheet:'pause',
  why:'A brief pause can make space for a response without requiring an immediate change in emotion.',
  steps:['Notice what is demanding an immediate response.','Check if a brief pause is safe and possible; if not, prioritise what is urgent.','Choose whether to rest, seek help or do one necessary thing.']},
 {id:'reduce-one-input',title:'Make one thing around you easier',kind:'environment',time:'now',effort:'light',duration:'2–5 min',worksheet:'environment',
  why:'Changing a genuine demand or sensory condition can be more appropriate than trying to change how you think.',
  steps:['Look for one demand, interruption, sensory input or access barrier.','Consider an adjustment that is available and safe.','Notice what changes and what is still outside your control.']},
 {id:'name-a-need',title:'Name the need behind this moment',kind:'observe',time:'now',effort:'light',duration:'2–5 min',worksheet:'needs',
  why:'A need or unmet resource can be easier to act on than a vague instruction to feel differently.',
  steps:['Describe what is happening without interpreting the cause.','Consider whether you need safety, rest, clarity, belonging, privacy or practical help.','Decide whether the need can be met, requested or acknowledged for now.']},
 {id:'micro-first-step',title:'Make the smallest workable first step',kind:'behaviour',time:'now',effort:'light',duration:'2–5 min',worksheet:'step',
  why:'Reducing an oversized task to a voluntary first action can lower task friction; it is not an instruction to push through illness.',
  steps:['Choose something that genuinely needs an action, if anything.','Make the start small enough to fit your actual resources.','Keep a stopping point and reassess whether the step helped.']},
 {id:'separate-facts',title:'Set a thought beside the evidence',kind:'cognitive',time:'short',effort:'medium',duration:'5–10 min',worksheet:'thought',
  why:'CBT-informed thought inquiry distinguishes events, interpretations and uncertainty without insisting on positive thinking.',
  steps:['Write the directly observed event.','Write the thought or prediction it brought up.','Compare supporting and contrary evidence, including real harms and unknowns.']},
 {id:'gentle-orientation',title:'Try an optional grounding or soothing cue',kind:'dbt',time:'now',effort:'light',duration:'1–3 min',worksheet:'ground',
  why:'A DBT-informed distress-tolerance pause may make a difficult moment more manageable, but there is no required bodily or emotional result.',
  steps:['Choose a familiar, neutral or comforting sound, sight, surface or sensation.','Notice it gently; do not force breathing or body scanning.','Stop if it is uncomfortable, triggering or unhelpful.']},
 {id:'kind-countervoice',title:'Answer self-criticism with fairness',kind:'compassion',time:'short',effort:'light',duration:'3–7 min',worksheet:'compassion',
  why:'Self-compassion can involve accurate and proportionate language rather than praise you do not believe.',
  steps:['Notice one harsh rule or accusation.','Ask what you would say to someone in the same circumstances.','Try a response that acknowledges real responsibility alongside your limits.']},
 {id:'values-step',title:'Choose a values-led response',kind:'acceptance',time:'short',effort:'medium',duration:'5–10 min',worksheet:'values',
  why:'ACT-informed values work can guide choices even when uncertainty or difficult feelings remain.',
  steps:['Choose a quality you would like your response to express.','Check your actual resources and safety.','Describe one action, boundary or rest period consistent with the value.']},
 {id:'reality-control',title:'Sort what is yours to change',kind:'cognitive',time:'short',effort:'light',duration:'3–6 min',worksheet:'control',
  why:'Distinguishing your choices from other people’s actions and structural constraints can reduce misplaced responsibility.',
  steps:['Identify the problem as precisely as you can.','Separate what you control, influence or cannot change unilaterally.','Choose a safe response within your actual sphere of influence, or ask for support.']},
 {id:'request-help',title:'Ask for one concrete form of support',kind:'support',time:'short',effort:'medium',duration:'5–15 min',worksheet:'request',
  why:'Practical support can reduce a burden that individual coping techniques cannot remove.',
  steps:['Identify the specific assistance, adjustment or understanding you need.','Consider who could reasonably help and whether contact is safe.','Draft a bounded request with a practical next step.']},
 {id:'track-context',title:'Notice a pattern across several days',kind:'observe',time:'long',effort:'medium',duration:'5 min/day',worksheet:'track',
  why:'A short contextual record may reveal demands or patterns that are invisible during an intense moment. Monitoring itself can be unhelpful for some conditions.',
  steps:['Choose one simple aspect to notice, such as time, situation, demand or consequence.','Record a brief observation when convenient for a few days; avoid repeated symptom checking.','Look for variability and alternatives rather than declaring a cause.']},
 {id:'plan-if-then',title:'Build a cue and a realistic fallback',kind:'planning',time:'long',effort:'medium',duration:'10 min + review',worksheet:'plan',
  why:'An implementation intention links a useful action to a clear cue, with a fallback when conditions change.',
  steps:['Name a recurring situation in which you want a different response.','Choose an achievable “If X happens, I can try Y” plan.','Decide when you will review fit and how to adjust for low-capacity days.']},
 {id:'recovery-window',title:'Protect a recovery window',kind:'environment',time:'long',effort:'light',duration:'one planned window',worksheet:'rest',
  why:'Making room for recovery can reduce genuine overload; rest is not failure and should not be treated as a productivity trick.',
  steps:['Identify what currently prevents adequate rest or privacy.','Choose a feasible boundary, environmental change or request for relief.','Consider healthcare advice if persistent fatigue or physical symptoms are relevant.']},
 {id:'relationship-check',title:'Find a safe way to clarify a need',kind:'support',time:'short',effort:'medium',duration:'5–15 min',worksheet:'conversation',
  why:'A specific request may reduce ambiguity when communication is safe and the other person can respond voluntarily.',
  steps:['Separate what was observed from what you assume another person meant.','Name the impact on you and a request within your control.','If direct contact could lead to intimidation or retaliation, use confidential support instead.']}
];
export const supplementaryInterventions=Object.freeze(supplementary.map(c=>Object.freeze({...c,steps:Object.freeze([...c.steps])})));
const laneKind={context:'environment',practice:'behaviour',thinking:'cognitive',dbt:'dbt',acceptance:'acceptance',support:'support'};
const inferTime=(method,lane)=>{
 const text=(method.title+' '+method.why+' '+method.steps.join(' ')).toLowerCase();
 if(/\b(week|longer.term|daily|routine|monitor|across several|over time|repeat|ongoing|review every)\b/.test(text))return 'long';
 if(/\b(brief|short|moment|pause|one|small|few|minut|immediate|now)\b/.test(text))return 'now';
 return lane==='support'?'short':'short';
};
const parseEffort=(method,time)=>{
 const text=(method.title+' '+method.steps.join(' ')).toLowerCase();
 if(/trauma|grief|difficult conversation|clinical|assessment|contact|negotiate|request|challenge|experiment/.test(text))return 'medium';
 return time==='now'?'light':'medium';
};
function originalCard(g,lane,method,index){
 const kind=laneKind[lane.id]||'behaviour',time=inferTime(method,lane.id);
 return {id:'source-'+lane.id+'-'+index,title:method.title,kind,time,effort:parseEffort(method,time),
  duration:time==='now'?'A few minutes':time==='long'?'Across several days':'At your own pace',
  worksheet:kind==='environment'?'environment':kind==='cognitive'?'thought':kind==='acceptance'?'values':kind==='dbt'?'ground':kind==='support'?'request':'step',
  why:method.why,steps:method.steps,caution:method.caution||'',refs:method.refs||[],source:'guide',tool:lane.tool,mode:g.modeId};
}
function suitableExtras(g){
 // Not every low-demand exercise is appropriate for every physical or cognitive problem.
 const isChecking=/checking|ritual|reassurance/.test(g.id);
 const isPanic=/panic/.test(g.id);
 const isSleep=/sleep|insomnia/.test(g.id);
 const isDepleted=/deplet|fatigue|exhaustion/.test(g.id);
 const isTrauma=/trauma|event|grief/.test(g.id);
 return supplementary.filter(c=>{
  if(isChecking&&['track-context','reality-control','separate-facts','gentle-orientation'].includes(c.id))return false;
  if(isPanic&&c.id==='track-context')return false;
  if(isSleep&&c.id==='track-context')return false;
  if(isDepleted&&c.id==='micro-first-step')return false;
  if(isTrauma&&c.id==='track-context')return false;
  if(g.modeId==='relate'&&c.id==='relationship-check'&&g.optionId==='unsafe')return false;
  return true;
 });
}
export function deckForWorkbook(g){
 if(!g||g.safetyFirst)return [];
 const original=g.lanes.flatMap(lane=>lane.methods.map((m,i)=>originalCard(g,lane,m,i)));
 const extras=suitableExtras(g).map(c=>({...c,source:'general',
  caution:'General optional skill, not a topic-specific treatment. Skip if unsuitable, unsafe or likely to increase compulsive checking or distress.',
  refs:[],tool:null}));
 return [...original,...extras].map(c=>Object.freeze({
  ...c,kindLabel:KINDS[c.kind].label,tone:KINDS[c.kind].tone,group:KINDS[c.kind].group,
  steps:Object.freeze([...c.steps])
 }));
}
export const cardFilters=Object.freeze([
 {id:'all',label:'All approaches'},
 {id:'light',label:'Low effort'},
 {id:'now',label:'Right now'},
 {id:'long',label:'Over time'},
 {id:'thinking',label:'Thoughts'},
 {id:'action',label:'Behaviour & plans'},
 {id:'practical',label:'Environment'},
 {id:'acceptance',label:'Acceptance & care'},
 {id:'regulation',label:'Grounding'},
 {id:'support',label:'Support'}
]);
export const filterCards=(cards,filter)=>filter==='all'?cards:cards.filter(c=>
 filter==='light'?c.effort==='light':
 filter==='now'?c.time==='now':
 filter==='long'?c.time==='long':
 c.group===filter);
