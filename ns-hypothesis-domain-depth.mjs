/* Nobody's Simple: Stage 6 deeper case-formulation enquiry.
 * Every non-SAFETY atlas area has domain-specific competing-factor wording.
 * The category/leaf are chosen by the person; source stories are NOT
 * individually clinically validated. Rules are inspectable hypotheses, not
 * predictions of hidden motives, causes, diagnoses or probabilities.
 * No network or data retention.
 */
import {subtypeNode} from './ns-hypothesis-subtype-atlas.mjs';
import {investigationFacts} from './ns-hypothesis-investigation.mjs';
import {adaptiveFacts} from './ns-hypothesis-adaptive.mjs';

const spec=(area,lenses,second,external,protective)=>Object.freeze({
  area,lenses:Object.freeze(lenses),second:Object.freeze(second),external,protective
});
// Lenses describe concrete circumstances to investigate; choosing one only
// reports a perception, it does not prove it is a cause.
export const DOMAIN_LENSES=Object.freeze(Object.fromEntries([
spec('IDENTITY',[
 'The way I feel about this changes between private and public settings',
 'Other people react differently or expect me to fit a role',
 'I am discovering what feels meaningful or comfortable',
 'Access, privacy or practical resources affect what I can try'
],['My physical comfort','Fear of others judging me','Supportive people','My freedom to choose'],'social expectation or privacy','self-expression can be valid without distress'),
spec('SELF',[
 'How I evaluate myself changes after feedback or achievement',
 'Conflicting commitments make the decision hard',
 'A role or life circumstance has recently changed',
 'Pressure or expectations from other people shape my options'
],['My workload','Feeling accepted','A realistic goal','Financial or practical constraints'],'other people’s expectations or a life transition','a change in identity can be ordinary exploration'),
spec('RELATIONSHIPS',[
 'Something the other person actually does affects me',
 'A past breach of trust makes a new situation harder',
 'I am uncertain about what the other person means or intends',
 'We want different things or face real logistical constraints'
],['Ability to speak safely','Reliable contact','Mutual respect','Differences in power or dependence'],'the other person’s actions or relationship conditions','withdrawal and boundaries may be reasonable protection'),
spec('TASKS',[
 'The first step is unclear or the task is too large',
 'Fear of an error, criticism or failure makes starting costly',
 'Sleep, health or attention reduce the capacity I have available',
 'Time, tools or responsibilities limit what I can realistically do'
],['Clear instructions','A smaller first step','Rest and recovery','Help or accessible equipment'],'task design, capacity or resources','delay can reflect overload rather than laziness'),
spec('SLEEP',[
 'A schedule or external demand limits my sleep opportunity',
 'Stressful thinking or physical arousal occurs at bedtime',
 'Pain, physical symptoms or medication affect sleep',
 'Noise, temperature, safety or other surroundings interrupt sleep'
],['Work or caregiving demands','Caffeine or other substances','A predictable rhythm','Health-related symptoms'],'physical symptoms, schedules or environmental conditions','poor sleep is not always caused by anxiety'),
spec('CHECKING',[
 'I check because a particular risk or responsibility is real',
 'I check to reduce uncomfortable doubt or uncertainty',
 'Instructions or information are incomplete or unreliable',
 'The checking feels automatic even when I do not decide to do it'
],['A clear standard for enough checking','Consequences of not checking','Fatigue and time pressure','Reassuring or reliable information'],'genuine safety requirements and unreliable information','some checking is appropriate and necessary'),
spec('SENSORY',[
 'Particular sensory inputs make this setting more difficult',
 'I cannot access or control a suitable environment',
 'Unpredictability or multiple demands combine with sensory load',
 'Recovery time or physical fatigue changes my tolerance'
],['Ability to leave or modify the setting','Reliable accommodations','Sleep and fatigue','Social expectations to tolerate discomfort'],'accessibility and sensory demands','sensory differences are not themselves disorders'),
spec('EMOTIONS',[
 'Specific events or interactions happen before the emotion',
 'Physical states like sleep loss, pain or arousal matter',
 'A meaning or expectation intensifies the feeling',
 'There are few safe or effective ways to regulate it'
],['A supportive relationship','Physical recovery','Time and safety','An unresolved practical problem'],'an actual event or bodily condition','emotion can be an appropriate signal'),
spec('SOCIAL',[
 'Other people have actually criticised, excluded or mistreated me',
 'I anticipate a judgement that may not occur',
 'The social rules or communication style do not fit me',
 'The setting makes participation inaccessible or exhausting'
],['Predictable communication','Supportive company','Discrimination or status differences','Sensory load'],'real mistreatment or communication barriers','social caution is not always maladaptive'),
spec('HEALTH',[
 'Symptoms, treatment or medication directly affect daily life',
 'Uncertainty around tests or information adds distress',
 'Practical barriers make access to care difficult',
 'Sleep, pain and effort change available capacity'
],['A healthcare assessment','Physical recovery','Clear and reliable information','Work or financial demands'],'physical health or treatment factors','physical complaints should not be explained away psychologically'),
spec('LOSS',[
 'An anniversary, reminder or ongoing absence evokes the loss',
 'A practical role or source of support changed',
 'Other people or circumstances restrict how I can grieve',
 'Uncertainty makes it hard to find a new routine'
],['Social acknowledgement','Time and space','Financial consequences','Connection and memories'],'loss itself, changed roles or real uncertainty','grief is not automatically a disorder'),
spec('NEURO',[
 'The environment does not match my sensory or access needs',
 'Executive demands exceed the support or structure available',
 'Masking or communication expectations create effort',
 'Other people do not provide a needed accommodation'
],['Clear structure','Adequate recovery','Access to adjustments','More accepting communication'],'barriers and missing accommodations','neurodivergence is not an assumed deficit'),
spec('SEXUAL',[
 'Pain, medication, health or physical response affects this',
 'Desire or preferred roles differ between consenting people',
 'Shame, stigma or other people’s judgements create distress',
 'Consent, safety or unequal power limits genuine choice'
],['Safe communication and consent','Stress and sleep','A comfortable relationship context','Privacy and autonomy'],'consent, treatment, safety or societal stigma','a consensual preference need not be treated as illness'),
spec('WORK',[
 'Demands, staffing or deadlines exceed realistic capacity',
 'A manager or colleague has acted unfairly or threatened my position',
 'Instructions, supervision or adjustments are inadequate',
 'Job insecurity or financial dependence restricts choices'
],['Control over workload','Predictability and support','Physical and sensory conditions','Recovery outside work'],'employment conditions and organisational power','distress under excessive demands may be proportionate'),
spec('MONEY',[
 'Available income does not meet necessary expenses',
 'Housing or essential services are unstable',
 'Another person or institution controls financial options',
 'Uncertainty and repeated obligations restrict planning'
],['Benefits, access or administrative delays','Family responsibilities','Safe housing','Practical information and advice'],'material constraints, scarcity or dependency','poverty is not a cognitive distortion'),
spec('DIGITAL',[
 'Notifications or cues keep drawing me back',
 'A person or platform exposes me to real hostility or surveillance',
 'The activity gives relief, connection or entertainment',
 'The online environment makes attention or choice harder'
],['Offline support','Time pressure','Sleep and device access','Privacy and safety'],'platform design or genuine online harm','enjoyed digital activities are not automatically addiction'),
spec('FAMILY',[
 'A family member’s actual behaviour or rule contributes',
 'Care duties or household workload exceed support',
 'Privacy, housing or money limits choices',
 'Family expectations conflict with personal boundaries'
],['Ability to disagree safely','Outside practical support','Predictable responsibilities','Power or dependence'],'family power, caregiving or living conditions','protective withdrawal may be appropriate'),
spec('EATING',[
 'Food affordability, scheduling or availability constrains eating',
 'Pain, nausea or sensory experience changes what I can eat',
 'Body image, stigma or judgement affects eating',
 'Stress, sleep or habit changes my appetite or response'
],['Physical symptoms or medication','Accessible food','Social pressure','Reliable support'],'food access, medical conditions and social stigma','do not assume a body preference is an eating disorder'),
spec('SUBSTANCE',[
 'A substance or habit is used to cope with an emotion or bodily state',
 'Social pressure or environment encourages the behaviour',
 'Physical effects or withdrawal make change difficult',
 'Something rewarding or important is being provided by the activity'
],['Immediate safety','Sleep or pain','Access to care or support','Financial or relationship consequences'],'withdrawal, health, availability or social pressure','substance harm and withdrawal require safety-sensitive handling'),
spec('VALUES',[
 'Two things I personally value pull in different directions',
 'Other people or institutions restrict the choices available',
 'There is not enough reliable information to decide',
 'Health, money or time makes one option less accessible'
],['Practical reversibility','Competing responsibilities','Personal autonomy','Clear evidence about the options'],'restricted options and real-world constraints','not every difficult decision hides a psychological conflict')
].map(x=>[x.area,x])));
export const COVERED_SAFE_AREAS=Object.freeze(Object.keys(DOMAIN_LENSES));
const NEUTRAL=new Set(['unsure','other','prefer_not','none']);
const options=(pairs)=>Object.freeze([...pairs.map(([id,label])=>Object.freeze({id,label})),
 Object.freeze({id:'unsure',label:'I cannot tell yet'}),
 Object.freeze({id:'other',label:'Something different'}),
 Object.freeze({id:'prefer_not',label:'I prefer not to answer'})]);
const trim=x=>String(x||'').trim().slice(0,280);
const sel=(state,id)=>state?.domain?.answers?.find(a=>a.field===id)?.answerId;
const selected=(state)=>DOMAIN_LENSES[state?.drill?.categoryId||''];
export const newDomainInquiry=()=>({active:false,finished:false,answers:[]});
export function domainEligible(state){
 const category=state?.drill?.categoryId;
 return Boolean(category&&category!=='SAFETY'&&DOMAIN_LENSES[category]&&
  state.drill?.confirmed&&!state.safety);
}
function domainQuestions(state){
 const profile=selected(state);
 if(!profile)return [];
 const leaf=subtypeNode(state.drill?.leafId);
 const cluster=subtypeNode(state.drill?.clusterId);
 const subject=leaf?.label||cluster?.label||'this experience';
 const lens=profile.lenses.find((_,i)=>sel(state,'primary')==='factor'+(i+1));
 const make=(id,layer,question,choices,why,prereq=true)=>(
  {id,layer,questionId:'Q-NS-DOMAIN-'+id.toUpperCase(),conceptId:'domain:'+profile.area+':'+id,
   prompt:question,options:options(choices),why,subject,category:profile.area,
   clusterId:state.drill.clusterId,prereq});
 return [
  make('primary','context','Which circumstance seems most closely associated with your experience of '+subject+'?',
   [...profile.lenses.map((x,i)=>['factor'+(i+1),x]),['none','No clear condition stands out']],
   'A reported association is not yet a cause; the next question checks whether a contrast supports it.'),
  make('contrast','test','When this condition is less present, what happens to '+subject+'?',[
   ['easier','The experience usually becomes easier'],
   ['same','It stays about the same'],
   ['mixed','It varies or several other things change at once'],
   ['not_possible','It is not safe or practical to change the condition'],
   ['not_seen','I have not seen a comparable situation']
  ],'A contrast can weaken an easy answer; do not force a dangerous experiment.',
  !!lens),
  make('additional','context','Which SECOND influence, if any, may also matter for '+subject+'?',[
   ...profile.second.map((x,i)=>['extra'+(i+1),x]),['none','No second influence I can identify']
  ],'More than one contributor may operate at once. Naming a second does not establish either as causal.'),
  make('stake','meaning','Beyond the event itself, what feels most at stake for you, if anything, when '+subject+' is difficult?',[
   ['safety','Feeling safe in the situation'],
   ['dignity','Being treated with dignity and respect'],
   ['belonging','Keeping an important relationship or connection'],
   ['autonomy','Having choice and control over my life'],
   ['competence','Being able to meet a realistic demand or responsibility'],
   ['practical','Money, health, housing or another real-life consequence'],
   ['none','It does not feel connected to an underlying value or threat']
  ],'A personal meaning is worth checking, but it does not replace actual circumstances or prove a hidden belief.'),
  make('body','context','Which bodily or capacity factor changes your experience of '+subject+', if any?',[
   ['sleep','It tends to be harder when I am short of sleep'],
   ['illness','It tends to be harder when I have pain or physical symptoms'],
   ['medication','Medication, substances or treatment may be relevant'],
   ['sensory','Sensory load or overstimulation makes it harder'],
   ['none','I have not noticed a bodily influence']
  ],'Sleep, pain, treatment and capacity can be influences; not every difficulty needs a psychological cause.'),
  make('response','response','When '+subject+' becomes difficult, what do you usually do next?',[
   ['reduce','I reduce contact, exposure or demands'],
   ['check','I check, plan, analyse or seek reassurance'],
   ['direct','I address the issue or ask for a change'],
   ['cope','I turn to a comforting or distracting activity'],
   ['continue','I continue as before'],
   ['no_problem','There is no difficulty I need to regulate']
  ],'Asking about the actual behaviour is more useful than assuming that all coping is avoidance.'),
  make('immediate','function','What actually happens soon AFTER that response in relation to '+subject+'?',[
   ['relief','The discomfort reduces for a while'],
   ['practical','The real-world situation improves'],
   ['connection','I receive help, understanding or support'],
   ['worse','The experience stays difficult or gets worse'],
   ['variable','There is no consistent immediate effect']
  ],'Intention and consequence are not interchangeable.',
  !!sel(state,'response')&&!['unsure','other','prefer_not','no_problem'].includes(sel(state,'response'))),
  make('later','cost','What happens to the ORIGINAL issue later?',[
   ['returns','It returns much as before'],['worsens','It becomes more difficult'],
   ['improves','The improvement tends to last'],
   ['external','The external problem continues regardless of my response'],
   ['no_problem','There is no ongoing problem to maintain']
  ],'A response that helps in the moment need not be maintaining the longer-term problem.',
  !!sel(state,'immediate')&&!NEUTRAL.has(sel(state,'immediate'))),
  make('recurrence','test','Have you observed this same event–response–consequence pattern across different occasions?',[
   ['repeated','Yes, on several occasions'],['varied','No, the order or effects change'],
   ['rare','Only once or twice'],['unobserved','I have not compared the sequence']
  ],'A maintaining feedback loop should require repeat observations.',
  !!sel(state,'later')&&!NEUTRAL.has(sel(state,'later'))),
  make('exception','test','Which observation would most challenge a simple explanation of '+subject+'?',[
   ['context_only','The difficulty occurs even without the suspected condition'],
   ['protected','I am fine when the condition is absent and I have enough support'],
   ['different_response','It persists even when I respond differently'],
   ['external','Real conditions keep causing problems despite coping changes'],
   ['not_checked','I do not have a meaningful comparison yet']
  ],'Actively look for evidence *against* the apparent explanation.'),
  make('protective','need','Which change has actually helped you feel safer or more able to manage '+subject+', if any?',[
   ['rest','Enough rest or recovery has helped'],
   ['support','Someone trustworthy or supportive has helped'],
   ['clarity','Clearer instructions or accurate information has helped'],
   ['choice','More freedom to decide or set boundaries has helped'],
   ['access','Better resources, accessibility or practical conditions have helped'],
   ['none','I have not observed a reliable helpful change']
  ],'A protective factor is an observation to compare, not a promised treatment.'),
  make('history','history','What best describes how '+subject+' has changed over time?',[
   ['recent','It followed a recent identifiable change'],
   ['longstanding','It has happened across several periods and places'],
   ['situational','It seems specific to a person or setting'],
   ['unknown','I cannot reliably identify when it began']
  ],'Chronology can distinguish current conditions and a longstanding pattern but cannot diagnose childhood origins.'),
  make('goal','need','What would a useful outcome of understanding '+subject+' look like?',[
   ['change_environment','Improving an external or practical condition'],
   ['change_response','Having more flexible ways to respond'],
   ['support','Getting appropriate support or access'],
   ['understand','Understanding it without necessarily changing anything'],
   ['no_change','I do not want to change this experience']
  ],'The person defines the goal. A difference or preference is not automatically a clinical problem.')
 ];
}
export function domainCandidates(state){
 if(!domainEligible(state)||!state.domain?.active)return [];
 const seen=new Set(state.domain.answers.map(a=>a.field));
 return domainQuestions(state).filter(q=>q.prereq&&!seen.has(q.id));
}
export function domainQuestion(state){
 if(!state.domain?.active)return null;
 return domainCandidates(state)[0]||null;
}
export function startDomainInquiry(state){
 if(!domainEligible(state))return state;
 return {...state,domain:{...(state.domain||newDomainInquiry()),active:true,finished:false}};
}
export function answerDomainInquiry(state,questionId,answerId,verbatim=''){
 const q=domainQuestion(state);
 if(!q||q.questionId!==questionId||!q.options.some(o=>o.id===answerId))return state;
 const item={field:q.id,conceptId:q.conceptId,questionId,answerId,
  layer:q.layer,verbatim:trim(verbatim)};
 const updated={...state,domain:{...state.domain,answers:[...state.domain.answers,item]}};
 const further=domainQuestions(updated).some(x=>x.prereq&&
  !updated.domain.answers.some(a=>a.field===x.id));
 return {...updated,domain:{...updated.domain,active:further,finished:!further}};
}
export function backDomainInquiry(state){
 if(!state?.domain?.answers?.length)return state;
 return {...state,domain:{...state.domain,active:true,finished:false,
  answers:state.domain.answers.slice(0,-1)}};
}
export function stopDomainInquiry(state){
 if(!state?.domain)return state;
 return {...state,domain:{...state.domain,active:false,finished:true}};
}
export function domainFacts(state){
 const qs=domainQuestions(state),by=Object.fromEntries(qs.map(q=>[q.id,q]));
 return (state?.domain?.answers||[]).flatMap(a=>{
  const q=by[a.field],choice=q?.options.find(o=>o.id===a.answerId);
  if(!q||!choice||NEUTRAL.has(a.answerId))return [];
  return [{id:a.questionId,conceptId:a.conceptId,kind:'domain:'+a.field,
   source:'user_selection',status:'person_reported',hypothesis:false,
   value:a.answerId,layer:a.layer,question:q.prompt,
   text:a.verbatim||choice.label,optionLabel:choice.label,verbatim:a.verbatim||'',
   category:q.category,clusterId:q.clusterId}];
 });
}
export function domainFormulation(state){
 if(!domainEligible(state))return {hypotheses:[],counterpoints:[],links:[],untested:[]};
 const facts=domainFacts(state),by=new Map(facts.map(f=>[f.kind,f]));
 const category=selected(state),leaf=subtypeNode(state.drill?.leafId);
 const subject=leaf?.label||'this experience';
 const fact=id=>by.get('domain:'+id);
 const evidence=(...names)=>names.map(fact).filter(Boolean).map(f=>({id:f.id,question:f.question,answer:f.text}));
 const hypotheses=[],counterpoints=[],links=[];
 const add=(id,title,description,used,alternative,challenge)=>{
  const sources=evidence(...used);
  if(sources.length!==used.length)return;
  hypotheses.push({id:'pattern:domain-'+id,title,
   description,alternative,falsifier:challenge,
   evidence:sources,status:'testable_not_established',
   source:'authored_domain_contrast'});
 };
 const counter=(id,title,description,used)=>{
  counterpoints.push({id:'challenge:domain-'+id,title,explanation:description,
   evidence:evidence(...used),source:'person_selected_contrast'});
 };
 if(fact('primary')&&fact('contrast')?.value==='easier'){
  add('context','Changing circumstances may affect "'+subject+'"',
   'You selected a possible contributor and report that the experience eases when it is less present. This points to a contextual relationship worth examining—not proof of cause.',
   ['primary','contrast'],
   'Another condition may change at the same time, including sleep, support or safety.',
   'Does the same improvement occur when other conditions remain similar?');
 }
 if(fact('primary')&&fact('contrast')?.value==='same'){
  counter('not-primary','The first explanation is not sufficient',
   'You reported that the difficulty continues even when the suspected condition is less present.',
   ['primary','contrast']);
 }
 if(fact('primary')&&fact('contrast')?.value==='not_possible'){
  counter('no-unsafe-tests','A real constraint prevents a safe comparison',
   'The condition cannot currently be changed safely or practically; this is not evidence of personal avoidance.',
   ['primary','contrast']);
 }
 if(fact('additional')?.value?.startsWith('extra')&&fact('primary')&&fact('contrast')?.value==='easier'){
  add('multiple','More than one influence may be involved in "'+subject+'"',
   'You selected both an initial condition and another possible influence. Their independent effects are not yet established.',
   ['primary','additional','contrast'],
   'The second influence might simply occur alongside the first, without contributing separately.',
   'Can you compare situations where only one factor differs?');
 }
 if(fact('response')&&fact('immediate')?.value==='relief'&&
    ['returns','worsens'].includes(fact('later')?.value)&&fact('recurrence')?.value==='repeated'){
  add('cycle','A repeated short-term relief cycle may be relevant to "'+subject+'"',
   'You reported repeated relief followed by the original difficulty returning. The response might be reinforcing, but this sequence does not prove it causes the difficulty.',
   ['response','immediate','later','recurrence'],
   category.external+' may keep the concern present independently of the coping response.',
   'Does the difficulty also continue when a different safe response is used?');
 }
 if(fact('response')&&fact('immediate')?.value==='practical'&&fact('later')?.value==='improves'){
  add('effective','Your response may be helping rather than maintaining the problem',
   'The reported response improved the actual situation and the change tended to last.',
   ['response','immediate','later'],
   'Other external changes may also have contributed to the improvement.',
   'Does this work under comparable conditions and remain safe?');
 }
 if(fact('response')&&fact('later')?.value==='external'){
  counter('outside','Your response may not be what sustains the difficulty',
   'You reported that the external problem continues independently of your response.',
   ['response','later']);
 }
 if(['context_only','different_response','external'].includes(fact('exception')?.value)){
  counter('counterexample','A reported counterexample challenges a single explanation',
   'You selected an observation where the initial condition or your response does not fully account for what happens.',
   ['exception']);
 }
 if(fact('protective')&&fact('exception')?.value==='protected'){
  add('protection','Conditions that help may buffer "'+subject+'"',
   'You reported a helpful condition and an exception when support or the environment was different. That suggests a potentially protective influence worth examining.',
   ['protective','exception'],
   'Other conditions may have changed alongside the helpful factor.',
   'Does this benefit recur under otherwise comparable circumstances?');
 }
 if(fact('goal')?.value==='no_change'){
  counter('nonpathological','You have not identified this experience as something you want to change',
   'Your selected goal does not justify treating this experience as a disorder. Consider whether outside judgement, access or another practical problem is the real concern.',
   ['goal']);
 }
 const connect=(a,b,title,challenge)=>{
  if(!fact(a)||!fact(b))return;
  links.push({id:'domain-link:'+a+'-'+b,from:fact(a).id,to:fact(b).id,
   fromText:fact(a).text,toText:fact(b).text,title,
   status:'proposed_not_causal',evidence:[fact(a).id,fact(b).id],challenge});
 };
 connect('primary','contrast','Possible condition → observed contrast',
  'What else changed at the same time, and what happens when this condition is absent?');
 connect('response','immediate','Your response → immediate effect',
  'Is the same immediate effect observed repeatedly, not only intended?');
 connect('immediate','later','Short-term outcome → later course',
  'Could the original situation independently explain its persistence?');
 connect('additional','exception','Additional condition → counterexample',
  'Has the additional influence actually been isolated from other changes?');
 const explored=new Set(state.domain.answers.map(a=>a.field));
 const untested=domainQuestions(state).filter(q=>!explored.has(q.id)&&q.prereq)
  .map(q=>({id:q.id,question:q.prompt}));
 return {hypotheses,counterpoints,links,untested,subject,
  category:category.area,clusterId:state.drill.clusterId,leafId:state.drill.leafId};
}
export function domainReport(state){
 return domainFacts(state).map(f=>f.question+' — '+f.text);
}
