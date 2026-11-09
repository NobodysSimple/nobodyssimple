/* Single-page, source-aware workbook descriptors for all seven choice families
 * and the existing psychological atlas. Keep clinical editorial status explicit.
 */
import {NEEDS_MODES,getNeedsMode} from './ns-needs-catalog.mjs';
import {PATH_LANES,PATH_SOURCES,pathGuide} from './ns-pathway-content.mjs';
import {STEADY_GUIDEBOOKS} from './ns-steady-guidebook.mjs';
import {STEADY_LANES,STEADY_REFERENCES} from './ns-steady-guide-utils.mjs';
import {SETTLING_ACTIVITIES,PROCESSING_ACTIVITIES} from './ns-needs-activities.mjs';
import {atlasProfile,isSafetyPriority} from './ns-atlas-core.mjs';
import {tools} from './tool-catalog.mjs';

const availableTools=new Set(tools.map(t=>t.id));
const pickTool=(id, fallback)=>availableTools.has(id)?id:(availableTools.has(fallback)?fallback:'');
const baseTool={context:'environment-design',practice:'small-step',thinking:'reality-map',dbt:'grounding',acceptance:'values-discovery',support:'needs-clarifier'};
const fromMode={context:'Change the conditions',practice:'Try a practical response',thinking:'Examine a thought or prediction',dbt:'Manage the immediate moment',acceptance:'Make room and follow values',support:'Find support or recovery'};
const laneExplanations={
 context:'A difficulty can be sustained by circumstances, not only by individual beliefs. Look for real changes to the setting, demands, time, access or available resources.',
 practice:'Small actions can supply useful information when they are safe, chosen and realistic. Trying something is optional, and results may be neutral or unexpected.',
 thinking:'Cognitive approaches help distinguish observations, interpretations and predictions. They should never be used to deny evidence of actual harm or physical illness.',
 dbt:'DBT-informed distress-tolerance skills can provide a pause between an urge and an action. These brief adaptations are not a complete DBT protocol.',
 acceptance:'ACT-informed methods can help people notice discomfort and choose what matters, without requiring a feeling to disappear. Acceptance does not mean accepting abuse or impossible conditions.',
 support:'External help, access adjustments and healthcare can be more appropriate than another self-guided activity. Sometimes stopping is the useful next step.'
};
const laneToInternal={context:'context',practice:'behaviour',thinking:'thinking',dbt:'dbt',acceptance:'act',support:'support'};
const bookLane=(id,title,description,methods,tool)=>({id,title,description,methods,tool});
function referenceMap(keys, directory){
 return [...new Set(keys)].map(key=>directory[key]).filter(Boolean).map(r=>({name:r.name,url:r.url,scope:r.scope}));
}
function optionTool(option,mode,chapter,method){
 if(mode==='regulate'){
  const a=SETTLING_ACTIVITIES[option.target];
  const index=chapter==='context'?2:chapter==='practice'?0:chapter==='dbt'?1:0;
  return pickTool(a?.strategies[index]?.tool,baseTool[chapter]||'small-step');
 }
 if(option.type==='tool'&&chapter==='practice')return pickTool(option.target,'small-step');
 if(option.type==='activity'&&chapter==='practice')return pickTool(PROCESSING_ACTIVITIES[option.target]?.complement,baseTool.practice);
 if(option.type==='topic'&&chapter==='practice')return pickTool(method?.tool,baseTool.practice);
 return pickTool(baseTool[chapter],'small-step');
}
export function workbookForChoice(modeId,optionId){
 const mode=getNeedsMode(modeId),option=mode?.options.find(x=>x.id===optionId);
 if(!option)return null;
 if(modeId==='regulate'){
  const g=STEADY_GUIDEBOOKS[option.target];if(!g)return null;
  const lanes=[
   ['context','context'],['practice','behaviour'],['thinking','thinking'],
   ['dbt','dbt'],['acceptance','act'],['support','support']
  ].map(([id,internal])=>{
   const original=STEADY_LANES.find(l=>l.id===internal);
   return bookLane(id,original?.label||fromMode[id],original?.description||laneExplanations[id],
    g.lanes[internal].map(m=>({title:m.title,why:m.why,steps:m.steps,caution:m.caution,refs:m.refs,note:m.note})),
    optionTool(option,modeId,id));
  });
  return {id:modeId+'/'+optionId,modeId,optionId,modeTitle:mode.title,tone:mode.tone,title:g.title,lead:g.subtitle,
   what:g.what,cycle:g.possibleLoop,recognise:g.variations,contributors:g.contributors,
   mechanisms:[],variants:[],
   cautions:g.cautions,goals:g.goals,progress:g.progress,lanes,
   sources:referenceMap([...g.refs,...lanes.flatMap(l=>l.methods.flatMap(m=>m.refs||[]))],STEADY_REFERENCES),
   relatedTarget:option.target,review:g.reviewStatus,kind:'choice',safetyFirst:false,showAtlas:false};
 }
 const g=pathGuide(modeId,optionId);if(!g)return null;
 const lanes=PATH_LANES.map((lane,index)=>{
  const id=lane.id==='behaviour'?'practice':lane.id==='act'?'acceptance':lane.id;
  const steps=g.methods[index];
  const first=steps[0].split(/[.!?]/)[0];
  const heading=first.length<=85?first:fromMode[id];
  return bookLane(id,fromMode[id],lane.description||laneExplanations[id],
   [{title:heading,why:laneExplanations[id],steps,caution:g.caution,refs:g.refs,
     note:'Adapted educational practice; the particular interactive exercise has not been clinically validated'}],
   optionTool(option,modeId,id));
 });
 const unsafe=modeId==='relate'&&optionId==='unsafe';
 return {id:modeId+'/'+optionId,modeId,optionId,modeTitle:mode.title,tone:mode.tone,
  title:g.title,lead:g.summary,what:g.what,cycle:g.cycle,recognise:[],contributors:[],
  mechanisms:[],variants:[],
  cautions:[g.caution],goals:[],progress:'Useful progress may mean clearer understanding, changing a condition, asking for support, making a workable choice or deciding to stop. There is no required emotional outcome.',
  lanes,sources:referenceMap(g.refs,PATH_SOURCES),relatedTarget:option.target,review:'Evidence-informed educational draft · not individually clinically reviewed or validated',
  kind:'choice',showAtlas:option.type==='atlas',safetyFirst:unsafe};
}
const topicKinds={
 systems:'context',health:'support',safety:'support',experiment:'practice',
 action:'practice',pattern:'practice',emotion:'practice',rumination:'thinking',
 evidence:'thinking',checking:'thinking',values:'acceptance',conversation:'practice',sleep:'context'
};
const domainFallback={
 feel:'emotion-check-in',think:'reality-map',act:'small-step',relate:'conversation-map',body:'state-check',
 identity:'identity-map',focus:'small-step',change:'values-discovery',work:'load-balancer',
 experiences:'state-check',safety:'state-check'
};
const topicGeneric={
 context:{title:'Check the conditions before blaming yourself',why:'Health, demands, social conditions, resources and accessibility can shape what happens.',steps:['Name an environmental, material, social or health factor that could contribute to this particular situation.','Identify whether a realistic adjustment or other person’s assistance is available.','Do not treat a structural problem as a personal failure.']},
 practice:{title:'Choose one safe, reversible response',why:'A small voluntary trial can help evaluate what is workable without promising to cure the difficulty.',steps:['Identify a response you could choose without exposing yourself to danger or serious deterioration.','State what you hope to learn or make easier, and what would make you stop.','Treat no change or an unexpected result as information, not personal failure.']},
 thinking:{title:'Separate facts from predictions',why:'The same experience can be interpreted in several ways; the goal is accurate thinking rather than forced reassurance.',steps:['Write one observation that is directly known and one interpretation or prediction.','Consider another explanation and what observation could distinguish them.','Keep real threats, symptoms and evidence of harm in view.']},
 acceptance:{title:'Allow complexity while choosing what matters',why:'Psychological flexibility can involve making room for uncertainty without surrendering real needs or safety.',steps:['Name one feeling or uncertainty without declaring it the whole story.','Choose a small action consistent with a personal value, only if it is realistically possible.','Do not use acceptance to justify coercion, deprivation or avoidable medical harm.']},
 support:{title:'Choose an appropriate level of support',why:'Professional, relational, material or accessibility support can address needs beyond a self-help worksheet.',steps:['Consider whether the difficulty is new, severe, prolonged or materially limiting daily life.','Identify an appropriate person, adjustment or service rather than handling everything alone.','Seek urgent help when immediate safety or serious physical symptoms are involved.']}
};
const inclusiveGeneric={
 context:{title:'Describe the actual conditions',why:'The situation may reflect real-world demands, rights, safety, resources or unequal treatment.',steps:['Identify what is directly observable about this experience.','Ask which people, systems, accessibility needs or material resources affect the situation.','Consider a safe change in conditions or practical support, only if one is feasible.']},
 practice:{title:'Choose a voluntary practical option',why:'An action is not required; safety, time and resources may limit choices.',steps:['Name one option that serves your own goals, if any.','Check whether it requires cooperation, access or safety you do not currently have.','Choose not to act, seek support, or make a reversible adjustment as appropriate.']},
 thinking:{title:'Keep facts, meaning and uncertainty distinct',why:'Clear thinking must not dismiss discrimination, coercion, physical illness or other genuine harms.',steps:['Record only what is known without forcing an explanation.','Identify what is uncertain or disputed, without treating a person’s identity as the cause.','Consider which information or practical support matters to your decision.']},
 acceptance:{title:'Respect autonomy and a personally meaningful goal',why:'Acceptance of feelings does not require acceptance of mistreatment or an inaccessible environment.',steps:['Decide whether this is something you want to understand, change or simply acknowledge.','Choose an option consistent with your safety and values.','Remember that your background, identity or consent-based preference does not need fixing.']},
 support:{title:'Consider practical, relational or healthcare support',why:'The most useful response may belong to a system, another person or an appropriate service.',steps:['Identify the type of help that matches the actual issue.','Consider whether privacy, accessibility, finance or safety affects access to that help.','Avoid recording sensitive details on a monitored or shared device.']}
};
function targetMethod(t){
 const steps=[t.action||'Choose a suitable next step only when it fits your situation.',t.why||'Look for both individual and contextual contributors.'];
 if(t.tryFirst)steps.push(t.tryFirst);
 return {title:t.title,why:t.why||'A possible target; whether it matters depends on the circumstances.',
  steps,caution:'This is an educational suggestion, not a diagnosis or treatment prescription. Choose a safe, voluntary approach and stop if unsuitable.',
  refs:[],note:'Atlas-derived educational intervention target',tool:t.tool};
}
export function workbookForTopic(topicId){
 const p=atlasProfile(topicId);
 if(!p)return null;
 const targetGroups={context:[],practice:[],thinking:[],acceptance:[],support:[]};
 for(const t of p.targets||[]){
  const category=topicKinds[t.worksheet]||'practice';
  targetGroups[category].push(targetMethod(t));
 }
 const lanes=['context','practice','thinking','acceptance','support'].map(id=>{
  const methods=targetGroups[id].slice(0,3);
  if(!methods.length)methods.push({...(p.contextFirst?inclusiveGeneric[id]:topicGeneric[id]),caution:'Skip this exercise if unsafe or inappropriate; a condition may need care or an adjustment instead.',refs:[],note:'General contextual skill, not a disorder-specific treatment.'});
  const tool=methods.find(m=>availableTools.has(m.tool))?.tool||pickTool(
    id==='practice'?domainFallback[p.domain]:baseTool[id],baseTool[id]);
  return bookLane(id,fromMode[id],laneExplanations[id],methods,tool);
 });
 const source=(p.source&&typeof p.source==='object'&&typeof p.source.url==='string')?
  [{name:p.source.title||p.source.label||'Clinical or background reference',url:p.source.url,scope:'General educational context for this topic'}]:[];
 const risk=isSafetyPriority(topicId);
 const signs=Object.values(p.signs||{}).flat().filter(x=>typeof x==='string').slice(0,12);
 return {id:'topic/'+topicId,modeId:'learn',optionId:topicId,modeTitle:p.contextFirst?'Explore an experience':'Explore a specific difficulty',
  title:p.title,lead:p.definition,what:p.definition,cycle:p.contextFirst?'Start with what is actually happening, including material conditions, relationships, safety, health and available choices. These topics do not establish a personal causal cycle.':Array.isArray(p.cycle)?p.cycle.join(' → '):String(p.cycle||''),
  recognise:signs,contributors:(p.contributors||[]).map(x=>typeof x==='string'?x:x.label),
  mechanisms:(p.maintainers||[]).map(x=>({id:x.id,label:x.label,detail:x.detail||'',target:x.target||''})),
  variants:p.variants||[],
  cautions:[p.alert||'Descriptions and hypothetical patterns do not establish a diagnosis or a cause.',
   risk?'Appropriate human support and clinical assessment take priority over self-guided psychological experiments.':'Persistent, severe, new or unfamiliar symptoms may merit clinical or medical assessment.'],
  goals:p.contextFirst?p.progress:[],progress:Array.isArray(p.progress)?p.progress.join('; '):String(p.progress||'Progress may include improved functioning and appropriate support.'),
  lanes,sources:source,relatedTarget:topicId,review:p.contextFirst?'Inclusive topic navigation · editorial overview. This entry and these generic reflection methods have not been individually clinically or empirically validated.':p.quality==='expert-draft'?'Topic-specific educational draft · not a clinical diagnosis or validated treatment programme':'Structured topic overview · possible mechanisms and suggested exercises need topic-by-topic expert review',
  kind:'topic',contextFirst:Boolean(p.contextFirst),supportFirst:Boolean(p.supportFirst),safetyFirst:risk,medical:Boolean(p.medical),showAtlas:false};
}
export const workbookCoverage=Object.freeze(NEEDS_MODES.map(m=>({mode:m.id,options:m.options.map(o=>o.id)})));
