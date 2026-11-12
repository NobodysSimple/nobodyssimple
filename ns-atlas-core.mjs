import {problemIndex,problemDomains,knowledgeFamilies,sourceForProblem,nhsHelp,nhsTalking,resolveProblemToolId} from './ns-problem-map.mjs';
import {extendedProblemIndex} from './ns-atlas-extended.mjs';
import {inclusiveDomains,inclusiveProblemIndex,inclusiveProfile} from './ns-inclusive-topics.mjs';
import {preciseProfiles,getPreciseProfile} from './ns-precision-content.mjs';
import {explicitVariants} from './ns-atlas-variations.mjs';
import {extendedVariants} from './ns-atlas-extended-variations.mjs';
import {publicTopicIndex,publicTopicById} from './ns-topic-manifest.mjs';

const M=(id,label,detail,target,tool,worksheet)=>({id,label,detail,target,tool,worksheet});
export const atlasDomains=Object.freeze([...problemDomains,...inclusiveDomains]);
const families={
 feel:[
 M('intensity','Strong immediate emotional response','The intensity of the response may make the situation harder to navigate.','Respond to emotional activation','emotion-check-in','emotion'),
 M('interpretation','Meaning added to the situation','Threatening or self-blaming interpretations can amplify an experience.','Examine interpretations','reality-map','evidence'),
 M('avoidance','Avoidance or suppression','Short-term relief can sometimes leave the original difficulty unresolved.','Respond instead of escaping automatically','small-step','pattern'),
 M('conditions','Demands or lack of support','External stressors or insufficient recovery may maintain distress.','Change demands or support','load-balancer','systems')],
 think:[
 M('reassurance','Repeated checking or reassurance','Repeated attempts to feel certain may provide temporary relief without new information.','Reduce unhelpful checking','certainty','checking'),
 M('interpretation','Treating an assumption as a fact','An interpretation can feel definitive before alternatives are tested.','Compare explanations','reality-map','evidence'),
 M('replay','Repeated thought review','Going over the same material can reinforce attention without producing a decision.','Interrupt unproductive loops','rumination','rumination'),
 M('action','An unresolved practical issue','Some worry persists because there is a concrete unresolved need or decision.','Turn thinking into action','decision-map','action')],
 act:[
 M('ambiguity','The first action is unclear','Large or vague tasks contain hidden decisions and competing steps.','Clarify the first step','small-step','action'),
 M('fear','Fear of a negative outcome','The possibility of error, rejection or discomfort can make delaying feel safer.','Test a manageable prediction','experiment-builder','experiment'),
 M('capacity','Demand exceeds available capacity','Workload, health, time or accessibility may make the task genuinely harder.','Change task demands','load-balancer','systems'),
 M('reward','Immediate relief or rewards elsewhere','Avoiding or switching tasks can be easier immediately than working toward a delayed outcome.','Change cues and reward','friction','action')],
 relate:[
 M('assumptions','Assuming another person’s intention','Ambiguous behaviour can be assigned a definite meaning prematurely.','Clarify interpretations','conversation-map','evidence'),
 M('unspoken','Unexpressed needs or expectations','Others may not know what is needed or what a behaviour costs.','Communicate a need','needs-clarifier','conversation'),
 M('cycle','A repeated interaction pattern','Reactions on both sides can reinforce an ongoing difficulty.','Interrupt a conflict pattern','conflict-map','pattern'),
 M('power','Unequal power or unsafe pressure','A person may lack safe control or resources, making communication alone insufficient.','Prioritise safety and practical support','context-map','safety')],
 body:[
 M('health','Health or physiological contributors','Sleep, illness, medication, substances or other physical factors may need assessment.','Consider appropriate health care','state-check','health'),
 M('monitoring','Repeated monitoring of sensations','Attention and checking may increase distress in some circumstances.','Review checking patterns','body-check','checking'),
 M('stress','Stress or insufficient recovery','Arousal, demands and inadequate rest may compound physical difficulties.','Adjust recovery and demands','load-balancer','systems'),
 M('environment','Environmental or sensory conditions','Noise, physical demands, food access or accessibility can affect functioning.','Adapt the environment','environment-design','systems')],
 identity:[
 M('expectations','Conflicting expectations','Roles and social expectations may pull in different directions.','Distinguish chosen values','values-discovery','values'),
 M('self-belief','Rigid self-beliefs','Old judgments may be treated as permanent facts about the self.','Examine personal narratives','identity-map','evidence'),
 M('concealment','Hiding needs or identity','Protective concealment can become exhausting, while revealing more may be unsafe.','Increase safe choice','masking-map','values'),
 M('context','Limited autonomy or belonging','Social circumstances may constrain authentic expression.','Seek supportive contexts','context-map','systems')],
 focus:[
 M('load','Too much cognitive load','More instructions or steps may exceed available attention and memory.','Externalise task demands','brain-dump','action'),
 M('structure','Missing cues or task structure','Unclear cues and transitions can make returning to a task difficult.','Add reliable external cues','if-then','action'),
 M('interest','Low reward or distraction','Immediate distractions may compete with less stimulating activities.','Adjust interest and feedback','friction','action'),
 M('capacity','Sleep, health or accessibility','Context and capacity changes affect concentration and planning.','Change conditions','load-balancer','systems')],
 change:[
 M('meaning','The meaning of the change','Loss or transition can disrupt identity, belonging and values.','Understand what matters','values-discovery','values'),
 M('routine','Disrupted routines','Practical changes make everyday activity less predictable.','Create gentle structure','small-step','action'),
 M('uncertainty','Uncertainty about the future','Trying to predict everything may keep worry going.','Separate controllable from unknown','control-map','evidence'),
 M('support','Loss of support or resources','Transitions may change access to connection, finances or help.','Find practical support','context-map','systems')],
 work:[
 M('demands','Demands exceed resources','The workload or financial requirement may exceed realistic capacity.','Reduce or negotiate demands','load-balancer','systems'),
 M('control','Limited choice or power','People cannot simply think their way out of structural constraints.','Map influence and options','control-map','systems'),
 M('support','Missing or inaccessible support','An adjustment or resource may be more important than a personal coping strategy.','Identify support and adjustments','context-map','systems'),
 M('avoidance','Avoidance after prolonged stress','Difficult experiences can create avoidance, but the original burden may still need changing.','Plan an achievable next step','small-step','action')],
 experiences:[
 M('health','Medical, sleep or substance effects','Several health-related factors can produce overlapping experiences.','Prioritise assessment','state-check','health'),
 M('threat','Activation by perceived threat','Stress, trauma or heightened vigilance can affect perceptions and responses.','Seek stabilising support','grounding','safety'),
 M('isolation','Limited support or understanding','A lack of support may make an experience harder to navigate safely.','Involve appropriate support','context-map','safety'),
 M('uncertainty','Uncertainty about the experience','A website cannot establish what an unusual experience means.','Avoid premature self-diagnosis','state-check','health')],
 safety:[
 M('danger','Immediate danger','Safety and urgent human assistance take priority over self-guided exercises.','Reach urgent support','context-map','safety'),
 M('isolation','Being alone with a serious risk','A trusted person or emergency service can help restore immediate safety.','Contact human support','needs-clarifier','safety'),
 M('pressure','Coercion, threats or restricted choices','Direct confrontation can raise danger when another person has power.','Seek safe practical options','context-map','safety'),
 M('health','Potential clinical urgency','Some experiences need prompt medical or mental health assessment.','Access appropriate care','state-check','health')]
};
const contributors={
 feel:['Earlier experiences','Current stress','Sleep and recovery','Relationship climate','Physical health','Demand and resources','Environment','Temperament and sensitivity'],
 think:['Incomplete information','Past experiences','Time pressure','Poor sleep','A real unresolved problem','Repeated checking','Social context','Health concerns'],
 act:['Task complexity','Time and workload','Energy or health','Fear of mistakes','Reward and distractions','Available support','Accessibility','Unclear expectations'],
 relate:['Communication expectations','Prior relationship experiences','Power and dependence','Safety or consent','Culture or community context','Stress and energy','Trust and predictability','Available support'],
 body:['Medical conditions','Sleep schedule','Medication or substances','Stress and arousal','Sensory environment','Work or care responsibilities','Access to health care','Housing conditions'],
 identity:['Social roles','Past experiences','Safety and privacy','Community expectations','Discrimination or exclusion','Values','Family context','Autonomy'],
 focus:['Sleep and recovery','Sensory environment','Task demands','Interest and rewards','Workload','Health or medications','External structure','Accessibility'],
 change:['Meaning of the loss','Relationships and community','Work or money','Housing or routine','Past experiences','Uncertainty','Recovery time','Available support'],
 work:['Income and resources','Workload','Power and rights','Accessibility','Discrimination','Housing','Care responsibilities','Institutional rules'],
 experiences:['Sleep and health','Medications or substances','Trauma or stress','Safety','Social context','Access to assessment','Support','Environment'],
 safety:['Immediate threat','Isolation','Physical health','Coercion or dependence','Available support','Housing and resources','Access to care','Environmental safety']
};
const indicators={
 feel:['Recognising feelings and triggers','Responding with more choice','Improved participation and support','Lower interference, even if emotions remain'],
 think:['Noticing repetitive thinking','Distinguishing known from assumed','Choosing a proportionate next step','Less interference in everyday life'],
 act:['Identifying a first step','Changing an actual obstacle','Starting or returning more often','Improved functioning, not perfect motivation'],
 relate:['Naming needs and impact','Choosing safer and clearer responses','More mutual respect where possible','Less harmful repetition'],
 body:['Recognising patterns and warning signs','Seeking appropriate health support','Adjusting the environment or routine','Better daily functioning'],
 identity:['Noticing external pressures','Clarifying values and choices','Expressing needs safely','Greater autonomy and belonging'],
 focus:['Noticing enabling conditions','Externalising information','Finding useful accommodations','Better follow-through'],
 change:['Recognising the impact','Finding support and stabilising routines','Taking meaningful manageable action','More room for mixed emotions'],
 work:['Identifying controllable and structural factors','Accessing support and resources','Reducing unmanageable demands','Improved practical options'],
 experiences:['Recognising a change','Seeking a suitable assessment','Finding safe support','Improved safety and functioning'],
 safety:['Immediate support','A safer practical plan','Appropriate human or medical care','Continuing support as needed']
};
const effects={
 feel:['An upsetting or demanding event','Strong emotion or interpretation','A coping response that brings temporary relief','The underlying need or condition may persist'],
 think:['An ambiguous or distressing question','Reassurance, interpretation or replay','Brief sense of control or certainty','The doubt or problem may return'],
 act:['A demanding or unclear task','Avoidance, delay or a competing activity','Immediate relief from difficulty','The task remains or becomes more demanding'],
 relate:['A difficult interaction','Interpretation, silence or reaction','Temporary peace, reassurance or distance','A need or conflict remains unresolved'],
 body:['Physical discomfort, fatigue or sensory load','Monitoring, effort or avoidance','Temporary relief or exhaustion','Ongoing strain without adequate support'],
 identity:['Competing expectations or self-doubt','Concealment, comparison or rigid beliefs','Short-term belonging or protection','Autonomy or needs may remain constrained'],
 focus:['A task with high demands','Distraction, switching or lost cues','Short-term escape or interrupted task','Incomplete work or more demands'],
 change:['A loss or transition','Uncertainty and attempts to regain control','Brief reassurance or withdrawal','The adjustment still needs time and support'],
 work:['High demands or insufficient resources','Overwork, avoidance or coping effort','Short-term accommodation','The external demand remains'],
 experiences:['An unusual or distressing experience','Alarm and uncertainty','Withdrawal or repeated checking','Distress or impaired function may continue'],
 safety:['Immediate risk or unsafe context','Limited safe choices','Short-term protection or isolation','Human help or safety planning remains important']
};
const typeTools={feel:'emotion-check-in',think:'reality-map',act:'small-step',relate:'conversation-map',body:'state-check',identity:'identity-map',focus:'attention-mission',change:'values-discovery',work:'context-map',experiences:'state-check',safety:'context-map'};
export const atlasProblemIndex=Object.freeze([...preciseProfiles.map(p=>({id:p.id,title:p.title,hint:p.definition,domain:p.id==='submissive-patterns'?'relate':p.id==='insomnia'?'body':p.id==='rumination'?'think':'feel',
 aliases:[p.title.toLowerCase(),...p.signs.thoughts.slice(0,2)],needsHuman:false,medical:p.id==='insomnia'||p.id==='panic-experiences',quality:'expert-draft'})),
 ...problemIndex.map(p=>({...p,quality:'structured'})),
 ...extendedProblemIndex.map(p=>({...p,quality:'structured'})),
 ...inclusiveProblemIndex]);
const lookup=new Map(atlasProblemIndex.map(p=>[p.id,p]));
export const atlasGet=id=>publicTopicById(id,atlasProblemIndex);
export const allAtlasTopics=()=>publicTopicIndex(atlasProblemIndex);
export const atlasByDomain=domain=>atlasProblemIndex.filter(p=>p.domain===domain);
export const atlasCount=atlasProblemIndex.length;
const wordStop=new Set(['i','im','my','me','myself','the','a','an','and','but','of','to','with','want','help','feel','feeling','problem','problems','have','having','getting','about','someone','something','cant','cannot','dont','not','keep']);
const normalize=x=>String(x||'').toLowerCase().replace(/[’']/g,'').match(/[\p{L}\p{N}]+/gu)||[];
export function atlasSearch(query,limit=25){
 const words=normalize(query).filter(w=>w.length>=3&&!wordStop.has(w));
 if(!words.length)return [];
 return allAtlasTopics().map(p=>{
  const title=normalize(p.title),hint=normalize(p.hint),alias=(p.aliases||[]).flatMap(normalize);
  const idTokens=p.id.split('-');
  const direct=String(query||'').trim().toLowerCase().replace(/[’']/g,'').replace(/\s+/g,'-');
  const score=words.reduce((a,w)=>a+(title.some(y=>y===w||(w.length>=5&&y.startsWith(w)))?7:0)+
  (hint.some(y=>y===w||(w.length>=5&&y.startsWith(w)))?3:0)+
  (alias.some(y=>y===w||(w.length>=5&&y.startsWith(w)))?4:0)+
  (idTokens.includes(w)?12:0),0)+(p.id===direct?30:0);
  return {p,score};
 }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score||(a.p.quality==='expert-draft'?-1:1)).slice(0,limit).map(x=>x.p);
}
const fallbackScenes=(p)=>{
 const topic=p.title.replace(/^(I |My |We |Something |Everything )/i,'');
 return [
 'This happens mainly in one specific situation',
 'This happens across several parts of my life',
 'It started or changed after a particular experience',
 'It tends to worsen when I am tired or under pressure',
 'The main difficulty is the effect on everyday life',
 'None of these fits; I would describe it differently'
 ].map((x,i)=>i===0?'In particular: '+p.hint.toLowerCase():x);
};
const genericSigns={
 feel:{thoughts:['I cannot cope with this','Something is wrong','It might get worse','I should not feel this way'],feelings:['Anxiety or agitation','Sadness or frustration','Guilt or shame','Feeling overwhelmed'],behaviours:['Avoiding a situation','Withdrawing','Seeking reassurance','Trying to suppress a feeling'],body:['Tension','Sleep disruption','Tiredness','Fast heartbeat or changes in breathing']},
 think:{thoughts:['What if the worst happens?','I need to be certain','I keep going over it','I cannot trust my judgment'],feelings:['Worry','Fear','Frustration','Shame'],behaviours:['Repeated checking','Analysing or replaying','Avoiding action','Asking for reassurance'],body:['Tension','Difficulty sleeping','Restlessness','Difficulty concentrating']},
 act:{thoughts:['I cannot start','I will fail','It is too much','I should be able to do this'],feelings:['Frustration','Dread','Shame','Exhaustion'],behaviours:['Delaying','Over-planning','Doing something easier','Stopping partway through'],body:['Fatigue','Tension','Restlessness','Sleep disruption']},
 relate:{thoughts:['They might reject me','I should not upset them','This is unfair','I do not know what they mean'],feelings:['Anxiety','Hurt','Resentment','Shame'],behaviours:['Staying quiet','Arguing','Seeking reassurance','Avoiding contact'],body:['Tension','Racing heart','Exhaustion','Agitation']},
 body:{thoughts:['What does this mean?','What if this keeps happening?','I cannot recover','I need to monitor this'],feelings:['Worry','Frustration','Exhaustion','Fear'],behaviours:['Monitoring symptoms','Avoiding activities','Changing routines','Seeking reassurance'],body:['Physical discomfort','Sleep changes','Fatigue','Sensory overload']},
 identity:{thoughts:['I do not fit','I should be someone else','What do I really want?','Other people would judge me'],feelings:['Uncertainty','Shame','Hope','Isolation'],behaviours:['Masking','Comparing','Avoiding expression','Changing choices to please others'],body:['Tension','Exhaustion','Stress','Sleep disruption']},
 focus:{thoughts:['I will forget','I cannot keep track','This is too much','I need to do everything at once'],feelings:['Frustration','Overwhelm','Boredom','Worry'],behaviours:['Switching tasks','Losing track','Procrastinating','Seeking stimulation'],body:['Restlessness','Fatigue','Sensory strain','Difficulty sleeping']},
 change:{thoughts:['Things will never be the same','What will happen now?','I should have done more','I cannot adapt'],feelings:['Sadness','Anxiety','Anger','Uncertainty'],behaviours:['Withdrawing','Checking the past','Avoiding reminders','Seeking certainty'],body:['Fatigue','Tension','Sleep changes','Changes in appetite']},
 work:{thoughts:['I cannot meet these demands','There is no way out','I should manage alone','Something bad will happen'],feelings:['Stress','Fear','Frustration','Hopelessness'],behaviours:['Overworking','Avoiding tasks','Asking for help','Withdrawing'],body:['Fatigue','Sleep disruption','Tension','Pain or discomfort']},
 experiences:{thoughts:['I do not understand this','Am I safe?','What does it mean?','I need help'],feelings:['Fear','Distress','Confusion','Uncertainty'],behaviours:['Withdrawing','Checking','Avoiding reminders','Seeking support'],body:['Changes in sleep','Changes in energy','Tension','Unusual sensations']},
 safety:{thoughts:['I am not safe','I need support','I cannot manage alone','What can I do now?'],feelings:['Fear','Distress','Panic','Numbness'],behaviours:['Seeking help','Withdrawing','Avoiding danger','Contacting a trusted person'],body:['Agitation','Exhaustion','Physical alarm','Sleep disruption']}
};
const preciseWorksheetKinds={
 'social-anxiety':{avoidance:'experiment','self-focus':'pattern',safety:'experiment',replay:'rumination'},
 'panic-experiences':{catastrophic:'evidence',monitoring:'checking',avoidance:'pattern',reassurance:'checking'},
 insomnia:{'sleep-pressure':'sleep',schedule:'sleep',arousal:'sleep',environment:'systems'},
 rumination:{abstract:'rumination',certainty:'checking',avoidance:'action','self-criticism':'evidence'},
 'submissive-patterns':{'fear-disapproval':'conversation',conflict:'conversation','self-worth':'values',pressure:'safety'}
};
const riskIds=new Set(['self-harm','immediate-danger','suicidal-thoughts','self-injury','danger-others','unsafe-home','control-harm','eating','food-restriction','purging-urges','withdrawal-worries','voices','suspicion','mania','elevated-mood','grandiose-beliefs']);
export const isSafetyPriority=id=>riskIds.has(id)||Boolean(atlasGet(id)?.needsHuman);
export function atlasProfile(id){
 const p=atlasGet(id);if(!p)return null;
 if(p.contextFirst)return inclusiveProfile(p);
 const precise=getPreciseProfile(id);if(precise){
  const core=precise.signs;
  const variants=[...new Set(precise.questions[0].options.map(x=>x[1]))].slice(0,5);
  return {...precise,domain:p.domain,quality:p.quality,variants,
   signs:{thoughts:core.thoughts,feelings:core.feelings,behaviours:core.behaviours,body:core.body},
   maintainers:precise.maintainers.map(m=>({...m,worksheet:preciseWorksheetKinds[id]?.[m.id]||'pattern'})),
   source:precise.links[0],needsHuman:isSafetyPriority(id),medical:p.medical,
   contributors:precise.contributors.map(x=>({id:x.id,label:x.label})),targets:precise.targets,
   progress:precise.progress,cycle:precise.cycle};
 }
 const domain=p.domain,desc=knowledgeFamilies[domain];
 const variations=explicitVariants[id]||extendedVariants[id]||fallbackScenes(p);
 const fam=families[domain]||families.feel;
 return {...p,definition:'“'+p.title+'” describes an experience involving '+p.hint.charAt(0).toLowerCase()+p.hint.slice(1)+'. People can experience it in different ways; the description alone does not establish a diagnosis or cause.',
  variants:variations,
  signs:genericSigns[domain]||genericSigns.feel,
  maintainers:fam.map(m=>({...m,tool:resolveProblemToolId(m.tool)})),
  contributors:(contributors[domain]||contributors.feel).map((label,i)=>({id:'c'+i,label})),
  cycle:effects[domain]||effects.feel,
  progress:indicators[domain]||indicators.feel,
  targets:fam.map(m=>({id:m.id,title:m.target,why:m.detail,action:'Explore how '+m.label.toLowerCase()+' affects this specific situation, and consider one realistic adjustment.',tool:resolveProblemToolId(m.tool),worksheet:m.worksheet})),
  source:sourceForProblem(p),knowledge:desc?.what,limits:desc?.alternative,
  needsHuman:isSafetyPriority(id),medical:p.medical,
  quality:p.quality};
}
export const atlasWorksheetTypes=Object.freeze(['emotion','evidence','pattern','systems','checking','action','experiment','conversation','health','values','rumination','safety']);
