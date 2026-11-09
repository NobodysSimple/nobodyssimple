/* Nobody's Simple | Evidence-aware psychological reasoning (pilot v2)
 * RULES ARE EXPLICIT EDUCATIONAL HEURISTICS, NOT A CALIBRATED TEST.
 * Concepts are hypotheses and circumstances, never automatic diagnoses.
 */
import {atlasSearch,atlasGet,atlasProfile,isSafetyPriority} from './ns-atlas-core.mjs';
export const REASONER_VERSION='2026-11-09-pilot.1';
const txt=x=>String(x??'').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
const includes=(s,rx)=>rx.test(s);
const stops=new Set(['i','my','im','the','and','but','not','with','that','this','to','for','from','what','they','someone','anyone','something','keep','sometimes']);
const words=s=>(txt(s).match(/[a-z0-9]+/g)||[]).filter(w=>!stops.has(w));
const uniq=a=>[...new Set(a)];
export const SAFETY_RESOURCES=Object.freeze({
 crisis:{title:'Immediate safety comes first',description:'If there is immediate danger, call 999 in the UK. For urgent mental health support, use NHS 111 and select the mental health option.',link:'https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/'},
 harm:{title:'Thoughts of harming someone need careful distinction',description:'Unwanted intrusive thoughts are not the same as intentions. If you may act or someone is at risk, seek urgent human help immediately.',link:'https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/'},
 coercion:{title:'Safety and choice before communication exercises',description:'If someone monitors, threatens or controls you, do not use an assertiveness experiment that may increase danger. Seek confidential practical support.',link:'https://www.nhs.uk/live-well/getting-help-for-domestic-violence/'},
 physical:{title:'A physical-health assessment may be relevant',description:'New or concerning symptoms should not automatically be attributed to anxiety or sleep habits. Seek urgent help for severe or acute symptoms.',link:'https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/'},
 unusual:{title:'Consider a timely professional assessment',description:'Changes in perception, unusually elevated energy or severe eating-related concerns can have several explanations and need appropriate clinical attention.',link:'https://www.nhs.uk/mental-health/conditions/psychosis/overview/'},
 structural:{title:'The circumstances may need changing',description:'Bullying, discrimination, inaccessible conditions or unreasonable demands require practical options and support, not simply changing your thoughts.',link:'https://www.acas.org.uk/if-youre-treated-unfairly-at-work'}
});
const negated=(s,re)=>{
 const m=s.match(re);if(!m)return false;
 const prefix=s.slice(Math.max(0,m.index-34),m.index);
 // Treat negation as local. "I am not suicidal" is not positive risk evidence.
 return /\b(?:not|never|no|without|don't|do not|wasn't|isn't|aren't)\b(?:\s+\w+){0,3}\s*$/.test(prefix);
};
export function safetyScreen(input){
 const s=txt(input);if(!s)return null;
 const ideation=/\b(?:suicid\w*|kill myself|end my life|take my own life|want to die)\b/;
 if(includes(s,ideation)&&!negated(s,ideation))return {kind:'crisis',reason:'Potential thoughts of suicide or self-harm',topic:'suicidal-thoughts'};
 const threatSelf=/\b(?:hurt myself|harm myself|self harm|self-harm|cut myself)\b/;
 if(includes(s,threatSelf)&&!negated(s,threatSelf))return {kind:'crisis',reason:'Possible self-injury risk',topic:'self-injury'};
 const danger=/\b(?:about to (?:hurt|kill|attack)|will (?:hurt|kill|attack)|intend to (?:hurt|kill)|might (?:kill|seriously harm)|afraid i (?:will|might) hurt someone)\b/;
 if(includes(s,danger)&&!negated(s,danger))return {kind:'crisis',reason:'Possible risk of serious harm to someone',topic:'danger-others'};
 if(/\b(?:think of harming|thoughts? of hurting|intrusive thoughts? (?:of|about) harming|afraid i could harm)\b/.test(s))
 return {kind:'harm',reason:'Thoughts about harming someone may be unwanted intrusions or represent risk; assess rather than assume',topic:'intrusive'};
 if(/\b(?:partner|boyfriend|girlfriend|husband|wife|someone at home|my ex)\b.{0,85}\b(?:monitors? (?:my|the) (?:phone|messages|location)|tracks? me|controls? (?:my|what)|threatens?|punishes? me|forces? me|coerc\w*)\b/.test(s)||
 /\b(?:afraid to say no|unsafe at home|not safe at home|don't feel safe at home|do not feel safe at home|forced into sex|being controlled)\b/.test(s))
 return {kind:'coercion',reason:'Possible coercion, surveillance or unsafe relationship conditions',topic:'control-harm'};
 if(/\b(?:gasp(?:ing)?|stop breathing|wake(?:s|n|ing)? up choking|chest pain|faint(?:ed|ing)?)\b/.test(s))
 return {kind:'physical',reason:'Physical symptoms may need medical assessment',topic:'daytime-sleepiness'};
 if(/\b(?:hear(?:ing)? voices|voices (?:talk|speaking) to me|everyone is watching me|people are tracking me|unusually little sleep (?:with|but) (?:lots of|high) energy)\b/.test(s))
 return {kind:'unusual',reason:'Unusual perception or markedly altered sleep/energy warrants careful exploration',topic:'suspicion'};
 if(/\b(?:purging|making myself vomit|vomit after (?:eating|meals)|haven't eaten in (?:days|weeks)|severely restricting food)\b/.test(s))
 return {kind:'unusual',reason:'Eating-related symptoms may warrant prompt assessment',topic:'purging-urges'};
 if(/\b(?:boss|manager|workplace|teacher|employer)\b.{0,75}\b(?:bull\w+|discriminat\w+|harass\w+|threatens?)\b/.test(s))
 return {kind:'structural',reason:'Possible workplace or institutional mistreatment',topic:'workplace-bullying'};
 return null;
}
const GROUPS=[
 {id:'checking',rx:/\b(check(?:ing|s|ed)?|recheck|reassur\w*|messages?|phone|door lock|ritual)\b/,topics:['checking','ritual-checking','binge-scroll','fear-abandonment','work-stress','control-harm'],headline:'Repeated checking'},
 {id:'sleep',rx:/\b(sleep|insomnia|wake|waking|awake|nightmare|tired|gasp\w*)\b/,topics:['insomnia','sleep-onset','sleep-maintenance','daytime-sleepiness','caregiver-burnout','work-stress'],headline:'Sleep and recovery'},
 {id:'social',rx:/\b(judg\w*|embarrass\w*|awkward|social anxiet\w*|socially|rejected)\b/,topics:['social-anxiety','fear-abandonment','panic-experiences','social-comparison','workplace-bullying'],headline:'Fear around other people'},
 {id:'action',rx:/\b(procrastinat\w*|avoiding|putting off|can't start|cannot start|unmotivated|starting a task)\b/,topics:['procrastination','perfectionism','planning-overload','academic-burnout','energy-action','too-many-tasks'],headline:'Difficulty starting or acting'},
 {id:'relationship',rx:/\b(relationship|partner|boyfriend|girlfriend|argument|submissive|saying no|say no|boundary|boundaries|controll\w*|intimacy|struggl\w* with someone)\b/,topics:['submissive-patterns','boundaries','arguments','control-harm','intimacy-communication','relationship-submission'],headline:'Relationships and choice'},
 {id:'threat',rx:/\b(watching me|follow\w* me|suspici\w*|hear\w* voices|paranoid|unsafe)\b/,topics:['suspicion','voices','social-anxiety','unsafe-home','trauma'],headline:'Feeling threatened or uncertain'},
 {id:'thoughts',rx:/\b(ruminat\w*|overthink\w*|replay\w*|worr\w*|intrusive|obsessi\w*|thoughts?)\b/,topics:['rumination','what-if','intrusive','checking','self-criticism'],headline:'Distressing or repetitive thoughts'},
 {id:'food',rx:/\b(eat\w*|food|weight|purge|appetite|restrict\w*|binge)\b/,topics:['eating','food-restriction','binge-eating','appetite-loss','health-worry'],headline:'Eating and appetite'},
 {id:'work',rx:/\b(boss|bull\w*|work\w*|school|uni|university|financ\w*|housing|debt|shift|deadline)\b/,topics:['workplace-bullying','work-stress','study','housing','financial-insecurity','academic-burnout'],headline:'Work and circumstances'},
 {id:'mood',rx:/\b(sad|depress\w*|low mood|lonely|overwhelm\w*|emotional|panic|anxious|anger|angry)\b/,topics:['low-mood','overwhelm','panic-experiences','anxiety','irritability'],headline:'Emotions and mood'}
];
const O=(id,label,weights={},flag=null,process=null)=>({id,label,weights,flag,process});
const Q=(id,prompt,options,reason)=>({id,prompt,options,reason});
const QUESTION_SETS={
 checking:[
  Q('driver','What makes checking feel necessary?',[
   O('doubt','An unwanted doubt that keeps returning',{checking:2,'ritual-checking':3,'binge-scroll':-2},null,'reassurance'),
   O('reply','Fear that someone important will reject or ignore me',{'fear-abandonment':3,checking:1,'binge-scroll':-1},null,'reassurance'),
   O('pressure','Someone expects immediate replies or controls my access',{'control-harm':3,'work-stress':2},'coercion','power'),
   O('routine','I reach for my phone without deciding to',{'binge-scroll':3,'ritual-checking':-2},null,'reward'),
   O('unsure','Several reasons or none of these',{})],
   'Distinguishes reassurance, habitual reward and genuine external pressure'),
  Q('effect','What usually happens after checking?',[
   O('brief','The doubt briefly settles, then comes back',{checking:2,'ritual-checking':2},null,'reassurance'),
   O('information','I receive genuinely necessary information',{'work-stress':2,'ritual-checking':-1},null,'conditions'),
   O('no-relief','It never really reassures me',{'fear-abandonment':1},null,'uncertainty'),
   O('unsure','It varies or I am not sure',{})],'Tests whether checking actually supplies new information'),
  Q('exception','When is checking less of a problem?',[
   O('safe','When I feel safe in the relationship',{'fear-abandonment':2},null,'social'),
   O('away','When notifications and apps are less accessible',{'binge-scroll':2},null,'environment'),
   O('relaxed','When I can tolerate uncertainty',{'ritual-checking':2,checking:1},null,'uncertainty'),
   O('never','I cannot identify an exception',{})],'Explores exceptions rather than assuming a single cause')],
 sleep:[
  Q('sleep-kind','Which part is most difficult?',[
   O('onset','Falling asleep',{'sleep-onset':3,insomnia:2},null,'sleep-pressure'),
   O('maintenance','Waking repeatedly',{'sleep-maintenance':3,insomnia:2},null,'sleep-pressure'),
   O('breath','Waking gasping or with breathing concerns',{'daytime-sleepiness':3},'physical','health'),
   O('demands','External interruptions, shifts or caring duties',{'caregiver-burnout':2,'work-stress':2,insomnia:1},null,'conditions'),
   O('unsure','I am not sure',{})],'Separates types of sleep difficulty and possible medical warning signs'),
  Q('sleep-conditions','What most affects it?',[
   O('pressure','I monitor sleep or worry about the consequences',{'sleep-onset':2,insomnia:2},null,'sleep-pressure'),
   O('external','Noise, child care, schedules or physical conditions',{'caregiver-burnout':2,'work-stress':2},null,'environment'),
   O('health','Pain, medications, breathing or other symptoms',{'daytime-sleepiness':1},'physical','health'),
   O('unknown','Unknown or several',{})],'Tests whether the main obstacle is a modifiable belief or the conditions around the person')],
 social:[
  Q('social-threat','What feels most threatening?',[
   O('judgment','People judging how I look, speak or act',{'social-anxiety':3,'fear-abandonment':-1},null,'self-focus'),
   O('rejection','Losing a particular relationship',{'fear-abandonment':3},null,'reassurance'),
   O('physical','Having frightening bodily sensations',{'panic-experiences':3},null,'catastrophic'),
   O('actual','People have actually bullied or discriminated against me',{'workplace-bullying':3},'structural','conditions'),
   O('unsure','Several of these or not sure',{})],'Distinguishes social evaluation from rejection, panic and real harm'),
  Q('social-response','What do you usually do?',[
   O('avoid','Avoid speaking or leave early',{'social-anxiety':2},null,'avoidance'),
   O('replay','Replay the interaction afterwards',{'social-anxiety':2},null,'replay'),
   O('check','Seek repeated reassurance',{'fear-abandonment':2},null,'reassurance'),
   O('defend','I need support dealing with unfair treatment',{'workplace-bullying':2},'structural','support'),
   O('unknown','No consistent response',{})],'Assesses a possible maintaining response')],
 action:[
  Q('task-barrier','What tends to make starting difficult?',[
   O('mistake','Fear of doing it badly',{'perfectionism':3,procrastination:1},null,'fear'),
   O('steps','Not knowing the first step',{'planning-overload':3,procrastination:1},null,'ambiguity'),
   O('energy','Exhaustion or poor health',{'energy-action':3,'academic-burnout':2},null,'capacity'),
   O('demands','My workload or other demands are unrealistic',{'too-many-tasks':3,'academic-burnout':2},null,'capacity'),
   O('unknown','Several or unsure',{})],'Separates fear, executive demands, capacity and systemic pressure'),
  Q('task-exception','When is it easier to begin?',[
   O('informal','When quality does not matter',{'perfectionism':2},null,'fear'),
   O('clear','When the first step is extremely clear',{'planning-overload':2},null,'ambiguity'),
   O('rested','When I have rested or have more support',{'energy-action':2,'academic-burnout':1},null,'capacity'),
   O('not-easier','I cannot identify a difference',{})],'Uses exceptions to test the proposed mechanism')],
 relationship:[
  Q('relationship-choice','Which situation is closest?',[
   O('consent','I like a freely chosen submissive role',{'relationship-submission':3,'submissive-patterns':2},null,'choice'),
   O('comply','I agree even when I genuinely want to refuse',{'submissive-patterns':3,'people-pleasing':2},null,'self-worth'),
   O('argument','We repeatedly disagree or misunderstand each other',{arguments:3,boundaries:1},null,'cycle'),
   O('control','I fear retaliation, threats or monitoring if I disagree',{'control-harm':4},'coercion','power'),
   O('unsure','Something else or not sure',{})],'Distinguishes consensual preference from unwanted compliance and coercion'),
  Q('relationship-conditions','What happens when you express a need?',[
   O('respect','My choice is respected',{'relationship-submission':2,'control-harm':-2},null,'choice'),
   O('guilt','I feel guilty even if others respond respectfully',{'submissive-patterns':2},null,'self-worth'),
   O('consequences','There may be punishment, threats or intimidation',{'control-harm':4},'coercion','power'),
   O('negotiation','We disagree but can discuss it', {arguments:2},null,'conversation'),
   O('unsure','Not sure or not applicable',{})],'Tests autonomy and external safety conditions')],
 thoughts:[
  Q('thought-timing','Which thinking pattern is closest?',[
   O('past','I repeatedly replay something that already happened',{rumination:3,'self-criticism':2},null,'replay'),
   O('future','I repeatedly anticipate what could go wrong',{'what-if':3},null,'uncertainty'),
   O('intrusion','Unwanted alarming thoughts pop into my mind',{intrusive:3},null,'health'),
   O('ritual','I check or neutralise thoughts to feel certain',{checking:3},null,'reassurance'),
   O('unknown','More than one or unsure',{})],'Distinguishes rumination, worry and intrusive thinking'),
  Q('thought-effect','Does analysing provide something useful?',[
   O('action','It helps identify a solvable action',{'what-if':1},null,'action'),
   O('repeat','It repeats without new information',{rumination:2,checking:1},null,'replay'),
   O('urgent','I am frightened I could act on a harmful thought',{intrusive:1},'unusual','health'),
   O('unsure','Not sure',{})],'Tests whether reflection is productive or repetitive')],
 work:[
  Q('work-obstacle','What is the main difficulty?',[
   O('bully','Bullying, intimidation or discrimination',{'workplace-bullying':4},'structural','support'),
   O('pressure','There are more demands than time and resources',{'work-stress':3,'academic-burnout':2},null,'demands'),
   O('money','Financial pressure or lack of basic resources',{'financial-insecurity':3,housing:1},null,'demands'),
   O('study','Studying or deadlines', {study:3,'academic-burnout':2},null,'ambiguity'),
   O('unsure','A mixture or not sure',{})],'Distinguishes external conditions from internal difficulties'),
  Q('work-control','Which change would be most relevant?',[
   O('support','Protection, rights or practical accommodations',{'workplace-bullying':2,'work-stress':1},'structural','support'),
   O('workload','Reducing or negotiating demands',{'work-stress':2},null,'demands'),
   O('strategy','Help planning an achievable action',{study:1},null,'ambiguity'),
   O('unsure','Not yet clear',{})],'Highlights systemic versus individual intervention targets')],
 threat:[
  Q('threat-context','What does the feeling of being watched relate to?',[
   O('judged','Worry that people are judging my appearance or actions',{'social-anxiety':3,suspicion:-1},null,'self-focus'),
   O('evidence','Someone has actually monitored or threatened me',{'unsafe-home':3,suspicion:-1},'coercion','power'),
   O('uncertain','I have a strong feeling of surveillance I cannot explain',{suspicion:3},'unusual','health'),
   O('voice','I hear sounds or voices others may not hear',{voices:3},'unusual','health'),
   O('unsure','I am not certain',{})],'Avoids presuming social anxiety or dismissing actual danger'),
  Q('threat-impact','How much has this changed your life?',[
   O('mild','Occasional worry, but most activity continues',{'social-anxiety':1},null,'context'),
   O('strong','I avoid important activities or struggle to function',{suspicion:1,trauma:1},'unusual','health'),
   O('unsafe','I am in immediate danger',{'unsafe-home':3},'crisis','power'),
   O('unsure','Unclear',{})],'Recognises impairment and immediate support needs')],
 food:[
  Q('food-pattern','Which eating-related experience is closest?',[
   O('restrict','Limiting intake, fear of eating or loss of weight',{'food-restriction':3,eating:2},'unusual','health'),
   O('binge','Feeling unable to stop during episodes',{'binge-eating':3},null,'health'),
   O('appetite','Reduced appetite without intending restriction',{'appetite-loss':3},null,'health'),
   O('stress','Eating changes with stress or schedules',{eating:2},null,'conditions'),
   O('unsure','Not sure',{})],'Separates experiences requiring different health considerations'),
  Q('food-health','Has eating affected your physical wellbeing?',[
   O('significant','Physical effects or substantial impairment',{'food-restriction':2,'binge-eating':1},'unusual','health'),
   O('moderate','Some disruption, no known acute risk',{eating:1},null,'conditions'),
   O('unknown','Unclear',{})],'Checks whether a health-oriented assessment is appropriate')],
 mood:[
  Q('mood-pattern','What is most prominent?',[
   O('flat','Persistent low mood or diminished pleasure',{'low-mood':3},null,'intensity'),
   O('pressure','Too many demands and feeling overwhelmed',{overwhelm:3},null,'conditions'),
   O('panic','Sudden bodily alarm',{'panic-experiences':3},null,'catastrophic'),
   O('anger','Irritation and frustration', {irritability:3},null,'intensity'),
   O('unknown','Varies / unsure',{})],'Separates related emotional presentations'),
  Q('mood-context','When does it improve?',[
   O('rest','With rest, resources or lower demands',{overwhelm:2},null,'conditions'),
   O('safety','When I feel supported and safe',{anxiety:1},null,'social'),
   O('little','I cannot find a clear exception',{'low-mood':1},null,'health'),
   O('unknown','Not sure',{})],'Examines exceptions and contextual drivers')]
};
const CONTEXT_QUESTION=Q('context','What should we consider before choosing a next step?',[
 O('demands','Workload, money, caring demands or lack of resources',{'work-stress':2,'academic-burnout':1},null,'conditions'),
 O('access','Environment, disability-related access or practical barriers',{'access-needs':2},null,'environment'),
 O('health','Health, sleep, medication or physical symptoms',{'fatigue':1},'physical','health'),
 O('choice','It is mainly about my thoughts or behaviour',{},null,'choice'),
 O('unknown','Several things or I do not know',{})],'Checks beyond individual motivation');
const generic=Q('general','What would help us understand this difficulty?',[
 O('timing','It happens in a particular situation',{},null,'context'),
 O('persistent','It occurs across many settings',{},null,'context'),
 O('resources','Circumstances or resources are a major factor',{},null,'conditions'),
 O('health','Physical health or sleep may be involved',{},'physical','health'),
 O('unsure','I am not sure',{})],'Investigates context without claiming a diagnosis');
export const REASONING_GROUPS=GROUPS.map(g=>({id:g.id,headline:g.headline,topics:[...g.topics]}));
export function chooseGroup(raw){
 const s=txt(raw);let best=null,bestScore=0;
 for(const g of GROUPS){const m=s.match(g.rx);if(!m)continue;let score=2;
  if(g.id==='checking'&&/\b(message|checking|phone|lock|ritual)\b/.test(s))score=5;
  if(g.id==='sleep'&&/\b(sleep|wake|gasp|insomnia)\b/.test(s))score=5;
  if(g.id==='relationship'&&/\b(submissive|relationship|partner|intimacy|say no)\b/.test(s))score=5;
  if(g.id==='work'&&/\b(boss|bullies|bullying|workplace)\b/.test(s))score=6;
  if(g.id==='threat'&&/\b(watching me|hear voices|paranoid)\b/.test(s))score=7;
  if(g.id==='social'&&/\b(judg|embarrass|social anxiety)\b/.test(s))score=6;
  if(g.id==='action'&&/\b(procrastinat|putting off)\b/.test(s))score=6;
  if(g.id==='food'&&/\b(eating|restrict|purging)\b/.test(s))score=6;
  if(score>bestScore){best=g;bestScore=score;}
 }
 return best||null;
}
export function startReasoning(raw){
 const text=String(raw||'').trim().slice(0,450),group=chooseGroup(text),safety=safetyScreen(text);
 let seed=group?.topics||[];
 const freelyChosen=/(?:enjoy|like|prefer|choose|chosen|consensual|consenting)/i.test(text)&&/submissiv/i.test(text);
 if(freelyChosen)seed=['relationship-submission','submissive-patterns',...seed.filter(x=>!['relationship-submission','submissive-patterns'].includes(x))];
 const deniesSelfHarm=/\b(?:not|never|no longer|don't|do not)\s+(?:feeling\s+|having\s+|currently\s+)?(?:suicidal|suicide|want to die|self-harm)/i.test(text);
 const direct=atlasSearch(text,8).map(p=>p.id).filter(id=>!deniesSelfHarm||!['suicidal-thoughts','self-harm','self-injury'].includes(id));
 const ids=uniq([...(safety?.topic?[safety.topic]:[]),...seed,...direct.slice(0,5)]).filter(id=>atlasGet(id));
 const all=ids.map((id,i)=>({id,score:Math.max(1,9-i),supports:[],challenges:[]}));
 return {version:REASONER_VERSION,raw:text,group:group?.id||'general',candidates:all,answers:[],safety:safety||null,revision:[],created:Date.now()};
}
function questionsFor(state){
 const chosen=QUESTION_SETS[state.group]||[generic];const q=[...chosen,CONTEXT_QUESTION];
 return q.filter(x=>!state.answers.some(a=>a.qid===x.id));
}
export function nextQuestion(state){
 if(!state||['crisis','coercion','harm'].includes(state.safety?.kind))return null;
 if(state.answers.length>=4)return null;
 return questionsFor(state)[0]||null;
}
export function answerQuestion(state,qid,oid){
 const question=[...(QUESTION_SETS[state.group]||[generic]),CONTEXT_QUESTION].find(q=>q.id===qid);
 const option=question?.options.find(o=>o.id===oid);
 if(!option)return state;
 let safety=state.safety;
 if(option.flag&&(!safety||['structural','physical'].includes(safety.kind))){
  safety={kind:option.flag,reason:'This answer suggests additional safety, health or contextual considerations.',topic:null};
 }
 const candidates=state.candidates.map(c=>{
  const w=option.weights[c.id]||0;
  return {...c,score:c.score+w,supports:w>0?[...c.supports,question.reason+': '+option.label]:c.supports,
   challenges:w<0?[...c.challenges,'Less consistent with: '+option.label]:c.challenges};
 });
 for(const [id,weight] of Object.entries(option.weights)){if(!candidates.some(c=>c.id===id)&&atlasGet(id))
 candidates.push({id,score:5+weight,supports:[question.reason+': '+option.label],challenges:[]});}
 return {...state,candidates:candidates.sort((a,b)=>b.score-a.score),answers:[...state.answers.filter(a=>a.qid!==qid),{qid,oid,label:option.label,process:option.process||null}],safety};
}
export function reviewReasoning(state,feedback,focusId=null){
 const code=String(feedback||'unsure');
 const top=(focusId&&state.candidates.find(c=>c.id===focusId))||rankedCandidates(state)[0];
 const revision=[...state.revision,{topic:top?.id||null,feedback:code,time:Date.now()}];
 // Feedback modifies the provisional candidate ranking; these are heuristic
 // signals, not diagnoses or evidence that an intervention caused an outcome.
 const candidates=state.candidates.map(candidate=>{
  if(candidate.id!==top?.id)return {...candidate,
    score:candidate.score+(code==='barrier'&&['work-stress','too-many-tasks','access-needs','caregiver-burnout','housing'].includes(candidate.id)?2:0)};
  if(code==='not-fit')return {...candidate,score:candidate.score-5,
    challenges:[...candidate.challenges,'You reported that this explanation does not fit your experience.']};
  if(code==='no-change')return {...candidate,score:candidate.score-1,
    challenges:[...candidate.challenges,'A trial produced no perceived change; this does not by itself rule out the explanation.']};
  if(code==='barrier')return {...candidate,score:candidate.score-2,
    challenges:[...candidate.challenges,'External conditions prevented a fair test of this explanation.']};
  if(code==='helped')return {...candidate,score:candidate.score+1,
    supports:[...candidate.supports,'You reported a useful outcome; a single attempt cannot establish a cause.']};
  return candidate;
 });
 const changes=code==='not-fit'?'This explanation may not fit. Consider another possibility or a different context.':
 code==='no-change'?'The action did not produce the hoped-for change. Review whether the target was relevant, feasible and safe.':
 code==='helped'?'The action seemed useful. This observation is encouraging but does not prove the proposed cause.':
 code==='barrier'?'A practical barrier prevented a fair test. Consider adapting the environment or demands first.':
 'The result remains uncertain. You can keep several hypotheses open.';
 return {...state,candidates,revision,reviewMessage:changes};
}
export function rankedCandidates(state,limit=5){
 if(!state)return[];
 return [...state.candidates].sort((a,b)=>b.score-a.score).slice(0,limit)
  .map(c=>({...c,profile:atlasProfile(c.id),rankLabel:c.supports.length?'Supported by selected answers':'A possibility to explore'}));
}
export function reasoningSummary(state){
 const top=rankedCandidates(state,4);
 const signals=uniq(state.answers.map(x=>x.process).filter(Boolean));
 return {primary:top[0]||null,alternatives:top.slice(1),signals,
  evidence:state.answers.map(x=>({answer:x.label,question:x.qid})),
  uncertainty:state.answers.length<2?'There is not enough distinguishing information to prioritise a mechanism.':
  'These are educational possibilities, not diagnostic probabilities or demonstrated causes.',
  needsReview:!nextQuestion(state),safety:state.safety};
}
export function explainSuitability(state,id){
 const c=state.candidates.find(c=>c.id===id),p=atlasProfile(id);
 if(!p)return null;
 return {id,title:p.title,support:c?.supports||[],challenge:c?.challenges||[],
  limits:state.safety?'A safety or health consideration may take priority.':
  !c?.supports?.length?'This is a search or category match, not an established psychological explanation.':
  'These answers suggest a line of inquiry, not a diagnosis.',
  evidenceStatus:p.quality==='expert-draft'?'Additional authored material; not clinically validated':'General template; requires individual expert review',
  nextStep:state.safety?'Prioritise appropriate support or assessment':'Select a plausible maintainer and review what actually happens'};
}
