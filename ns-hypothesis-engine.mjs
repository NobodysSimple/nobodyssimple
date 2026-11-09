/* Nobody's Simple · Hypothesis Generator
 * Independently written, adaptive educational formulation engine.
 * No guessing-game code is included. Scores are uncalibrated *relative*
 * evidence signals; they are not diagnoses, risks or probabilities.
 */
import {atlasGet,atlasProblemIndex,isSafetyPriority} from './ns-atlas-core.mjs';
import {safetyScreen} from './ns-reasoning-model.mjs';
import {DEEP_PROCESSES,DEEP_BY_ID,EXTRA_BY_TRACK,DEEP_QUESTIONS,DEEP_QUESTION_BY_ID,isPresentationQuery,presentationBranchActive} from './ns-hypothesis-deep-content.mjs';
import {buildFormulationGraph,graphCoverage,graphText,layerQuestionTags,editGraphNode,reopenGraphLayer} from './ns-hypothesis-graph.mjs';
import {beginSubtypeDrill,answerSubtypeDrill,subtypeQuestion,subtypeNode} from './ns-hypothesis-subtype-atlas.mjs';

const P=(id,title,description,possibleFunction,possibleCost,need,check,link)=>
 Object.freeze({id,title,description,possibleFunction,possibleCost,need,check,link});
export const FORMULATION_PROCESSES=Object.freeze([
 P('evaluation','Fear of evaluation','Being judged may make mistakes seem unusually consequential.','Delaying or extra preparation might briefly reduce anticipated judgement.','Unfinished demands may become more intimidating.','A fair standard for learning and making mistakes.','Is this easier when nobody will evaluate the outcome?','#workbook-topic/procrastination'),
 P('ambiguity','Unclear first steps','Starting may be difficult when a task or option has no defined first step.','Postponing can conserve energy until a route forward becomes clearer.','The information gap can persist.','Clarity and accessible instructions.','Would an explicit first step materially change things?','#workbook/act/begin'),
 P('capacity','Excessive demands or depleted capacity','Workload, fatigue, health or caring responsibilities may limit what is available.','Not acting can conserve resources or prevent further exhaustion.','A real demand can remain unresolved.','Rest, realistic expectations and practical support.','Does reducing demands or improving access change your capacity?','#workbook/regulate/drained'),
 P('attention','Attention and reward conditions','Tasks with delayed feedback or many steps may be hard to initiate.','Switching activities can offer immediate stimulation.','Less immediately rewarding goals may be delayed.','Clear cues, manageable structure and accessible support.','Do clear cues or immediate feedback change engagement?','#workbook/act/begin'),
 P('uncertainty','Searching for certainty','A person may feel compelled to resolve every uncertainty before proceeding.','Rechecking or thinking may bring temporary reassurance.','Doubt can quickly reopen.','Adequate evidence and room for uncertainty.','Does another round of thinking actually resolve something?','#workbook-topic/rumination'),
 P('prediction','Threat-focused anticipation','Attention can become occupied by potential mistakes or future losses.','Planning or avoidance may provide a sense of preparation.','Opportunities to learn from actual events can decrease.','Proportionate protection and realistic information.','What is directly known versus only predicted?','#workbook/act/worry'),
 P('reassurance','Interpersonal reassurance','Uncertainty about another person’s availability or intentions may feel urgent.','Checking can create a temporary sense of closeness or clarity.','Unmet relational needs may not change.','Respectful, predictable interaction and connection.','Does reliable behaviour help more than repeated reassurance?','#workbook/relate/interaction'),
 P('power','Real pressure or unequal power','A situation may genuinely involve control, intimidation, dependence or unequal freedom.','Compliance or silence may protect safety or access.','The unequal conditions may continue.','Safety, autonomy and confidential external support.','Is it safe to disagree, and who can help?','#workbook/relate/boundary'),
 P('boundaries','Needs and boundaries','A need can be hard to name, express or have respected.','Avoiding a difficult conversation may reduce immediate conflict.','Misunderstanding or resentment may continue.','Mutual respect and specific requests where safe.','What actually happens when a clear, safe request is made?','#workbook/relate/need'),
 P('conflict','Recurring interaction pattern','Two people’s responses may interact to recreate the same conflict.','Defending or withdrawing can interrupt immediate discomfort.','The disagreement may not be resolved.','Fair accountability and workable repair.','Does the pattern change when interaction changes safely?','#workbook/relate/argument'),
 P('selfcrit','Harsh self-evaluation','Difficult events may trigger global or overly punitive judgements about the self.','Self-criticism can feel like an attempt at self-control.','Shame may reduce flexibility and action.','Accurate accountability without global condemnation.','Would a fairer interpretation change your response?','#workbook/process/compassion'),
 P('values','Competing values and autonomy','A demand may conflict with important values or freely chosen goals.','Disengaging may create distance from unwanted pressure.','The original conflict may remain.','Personal agency and permission to negotiate demands.','Does the task change when linked to a personally valued aim?','#workbook/understand/values'),
 P('environment','Environmental or access barriers','Noise, interruption, inaccessible systems and other conditions may constrain participation.','Avoiding an unsuitable setting can reduce overload.','The barrier remains if conditions never change.','Accessible environments and reasonable adjustments.','Does changing the setting materially improve the situation?','#workbook/act/environment'),
 P('health','Sleep or physical health contributors','Illness, medication effects or disrupted sleep may influence mood, attention and energy.','Rest or withdrawal may sometimes be necessary and protective.','An untreated condition or unreasonable demand may persist.','Appropriate healthcare, recovery and adjustments.','Are there new, persistent or concerning physical symptoms?','#workbook/regulate/drained'),
 P('lowmood','Reduced pleasure or reward','Activities may feel less satisfying or worthwhile than they used to.','Withdrawal may reduce immediate effort.','Opportunities for meaning or connection can diminish.','Support, manageable pacing and meaningful activity.','Is this present across several previously enjoyable contexts?','#workbook/process/feel'),
 P('emotion','Strong emotion or overload','Intense emotions may briefly reduce capacity to plan or communicate.','Pausing or withdrawing can provide respite.','The underlying stressor may continue.','Safety, space and tolerable ways of responding.','Does easing immediate demands help before problem-solving?','#workbook/regulate/overwhelmed'),
 P('grief','Loss and adjustment','An important loss or transition may change meaning, identity and everyday routines.','Avoiding reminders can provide temporary respite.','Adjustment still takes its own time.','Support, room for mixed emotions and freedom from a fixed timetable.','Do reminders, anniversaries or changed roles matter?','#workbook/process/grief'),
 P('habit','Habit and immediate reward','Familiar cues and immediate rewards can support repeated actions.','The action can give stimulation or relief.','Other intentions may be displaced.','Cue adjustments and realistic alternatives.','Does altering the cue make a difference?','#workbook/act/step'),
 P('checking','Repetitive checking and doubt','Unwanted uncertainty or urges may prompt repeated checking or neutralising.','The response may briefly ease distress.','The urge or doubt may soon return.','Appropriate support and freedom from unwanted rituals.','Are checks repeated beyond a real practical need?','#workbook-topic/checking'),
 P('social','Social evaluation and exclusion','Social situations may carry a fear of embarrassment or exclusion.','Remaining quiet or avoiding a situation can reduce immediate exposure.','Belonging or corrective experiences may be limited.','Genuine inclusion, safety and respectful connection.','Is this different with accepting people?','#workbook-topic/social-anxiety'),
 P('identity','Identity and social expectations','Social expectations can conflict with how someone understands themselves.','Masking or withholding may preserve short-term acceptance.','Autonomy and connection may be restricted.','Belonging, privacy, agency and acceptance.','Does the experience change in safer environments?','#workbook/understand/identity')
]);
export const PROCESS_BY_ID=Object.freeze(Object.fromEntries([...FORMULATION_PROCESSES,...DEEP_PROCESSES].map(p=>[p.id,p])));
const T=(id,title,description,art,processes,topic)=>Object.freeze({
 id,title,description,art,processes:Object.freeze(processes),topic
});
export const HYPOTHESIS_TRACKS=Object.freeze([
 T('procrastination','I keep putting things off','Starting, delay and avoidance','ns-character-building.webp',['evaluation','ambiguity','capacity','attention','values','environment','lowmood'],'procrastination'),
 T('overthinking','I keep overthinking','Worry, rumination and doubts','ns-character-thinking.webp',['uncertainty','prediction','reassurance','selfcrit','capacity','checking'],'rumination'),
 T('relationships','I am struggling with someone','Trust, boundaries and recurring conflict','ns-character-friends.webp',['reassurance','power','boundaries','conflict','social','values'],'relationship-conflict'),
 T('social','I worry what people think of me','Being seen, judged or misunderstood','ns-character-waiting.webp',['social','evaluation','selfcrit','environment','identity','capacity'],'social-anxiety'),
 T('fatigue','I feel depleted or overwhelmed','Energy, demands and overload','ns-character-sitting.webp',['capacity','health','environment','emotion','lowmood','values'],'fatigue'),
 T('emotion','My reactions feel intense','Anger, overload and difficult feelings','ns-character-confused.webp',['emotion','capacity','selfcrit','power','grief','environment'],'emotional-overwhelm'),
 T('sleep','I am having trouble sleeping','Sleep and the conditions around it','ns-character-moon.webp',['health','uncertainty','capacity','environment','emotion','habit'],'insomnia'),
 T('checking','I keep checking or repeating things','Reassurance, habits and checking','ns-character-checklist.webp',['checking','uncertainty','reassurance','habit','power','prediction'],'checking'),
 T('choices','I cannot decide what to do','Uncertainty, competing priorities and options','ns-character-compass.webp',['uncertainty','values','prediction','capacity','ambiguity','power'],'decision-difficulty'),
 T('identity','I feel conflicted about myself','Belonging, self-worth and personal change','ns-character-mapping.webp',['identity','selfcrit','values','social','power','grief'],'identity-confusion'),
 T('sensory','My surroundings are too much','Sensory and environmental load','ns-character-lantern.webp',['environment','capacity','emotion','health','power','values'],'sensory-overload'),
 T('loss','I am coping with change or loss','Grief, transition and adjustment','ns-character-moon.webp',['grief','emotion','capacity','identity','reassurance','values'],'grief')
]);
export const TRACK_BY_ID=Object.freeze(Object.fromEntries(HYPOTHESIS_TRACKS.map(t=>[t.id,t])));
const Q=(id,prompt,why,signals,tracks=[],priority=1,flag='')=>Object.freeze({
 id,prompt,why,signals:Object.freeze(signals),tracks:Object.freeze(tracks),priority,flag
});
export const QUESTIONS=Object.freeze([
 Q('judge','Is it more difficult when somebody might judge the result?','Distinguishes fear of evaluation from challenges present even in private.',{evaluation:2,social:1,selfcrit:1,attention:-1},['procrastination','social'],2),
 Q('first','Would a very clear first step make this considerably easier?','Tests whether instructions and task structure matter.',{ambiguity:2,attention:1,capacity:-.4,evaluation:-1},['procrastination','choices'],2),
 Q('energy','Is this worse when you have little energy or excessive demands?','Investigates capacity and material conditions.',{capacity:2,health:1.5,emotion:1,evaluation:-.5},[],1.7),
 Q('feedback','Is it easier to engage when progress or a reward is immediately visible?','Compares task-reward conditions with evaluation fears.',{attention:2,habit:1,ambiguity:1,evaluation:-.6},['procrastination'],1.7),
 Q('own-values','Does this task or situation conflict with something you personally value?','Explores values rather than assuming low motivation.',{values:2,power:1,ambiguity:-.4},['procrastination','choices','identity'],1.6),
 Q('setting','Does changing the surroundings or interruptions noticeably help?','Checks contextual barriers before personal explanations.',{environment:2,capacity:1,emotion:.7,attention:.6},[],1.7),
 Q('delay-relief','Does postponing the situation initially bring relief?','Tests immediate consequences without assuming why they occur.',{evaluation:1,uncertainty:1,prediction:1,emotion:1,habit:.5},[],.8),
 Q('rest','Does enough rest or practical support restore some capacity?','Tests available resources instead of moralising effort.',{capacity:2,health:1,environment:1,lowmood:-.3},['fatigue','emotion','procrastination'],1.8),
 Q('private','Is this also hard when nobody will know or judge the outcome?','Challenges a pure social-evaluation explanation.',{attention:1.5,ambiguity:1,capacity:1,evaluation:-1.5,social:-1.5},['procrastination','social'],1.8),
 Q('pleasure','Do things you used to enjoy feel less rewarding in several parts of life?','Checks breadth without classifying depression.',{lowmood:2,capacity:1,health:1,evaluation:-.5},['procrastination','fatigue','emotion'],1.6),
 Q('certainty','Are you hoping another round of thinking will make you completely certain?','Explores the function of repetitive thinking.',{uncertainty:2,checking:1.5,reassurance:1,prediction:1},['overthinking','checking','choices'],2),
 Q('reassurance-relief','Does checking or reassurance help only briefly before the doubt returns?','Differentiates a repeated relief cycle from useful information.',{checking:2,reassurance:1.7,uncertainty:1.4,habit:.4,power:-1},['overthinking','checking','relationships'],2),
 Q('real-problem','Is there a concrete, unresolved problem that actually needs information or action?','Prevents treating genuine external problems as irrational fears.',{power:1.5,prediction:1,ambiguity:1,uncertainty:-1,checking:-1},['overthinking','checking','relationships','choices'],2),
 Q('future','Do you repeatedly imagine specific future mistakes or worst-case outcomes?','Distinguishes future-focused predictions from other thinking.',{prediction:2,evaluation:1,uncertainty:1,selfcrit:.5},['overthinking','choices'],1.7),
 Q('harsh','Is your own harsh judgement more upsetting than the event itself?','Explores self-criticism without inferring an early wound.',{selfcrit:2,evaluation:1,social:1,identity:.5},['overthinking','social','identity','emotion'],1.7),
 Q('relational','Is much of the uncertainty about whether somebody will accept or be available to you?','Separates relational uncertainty from general worry.',{reassurance:2,social:1,identity:.8,uncertainty:.7},['relationships','overthinking','identity'],1.8),
 Q('unsafe','Would saying no or expressing a need cause realistic concern about retaliation, coercion or harm?','Genuine interpersonal threat requires a different response from ordinary communication practice.',{power:2,boundaries:1,conflict:.4,reassurance:-.7},['relationships','identity','choices','emotion'],2,'coercion'),
 Q('respected','When you express a reasonable need, is it usually respected?','Checks the other person’s behaviour before locating the problem within you.',{power:-2,boundaries:-1,conflict:-.6},['relationships'],2),
 Q('misreading','Do disagreements often involve interpreting the same event differently?','Explores interaction patterns without implying equal responsibility.',{conflict:2,boundaries:1,reassurance:.5,power:-.5},['relationships'],1.7),
 Q('needs','Is it hard to name or express your needs even in safe relationships?','Distinguishes identifying needs from having them disregarded.',{boundaries:2,identity:1,selfcrit:1,power:-.4},['relationships','identity'],1.7),
 Q('accepted','Is this much less difficult with accepting, trusted people?','Examines safety and social context.',{social:2,identity:1.5,power:1,environment:1,evaluation:1},['social','identity','relationships'],1.9),
 Q('badself','Does one mistake feel as though it says something bad about you as a person?','Explores global self-evaluation without assuming its origin.',{selfcrit:2,evaluation:1.7,identity:1,values:-.3},['social','procrastination','identity'],1.8),
 Q('sensory','Does reducing light, noise, crowding or unpredictability make a real difference?','Tests concrete conditions and access.',{environment:2,capacity:1,emotion:.8,social:-.4},['sensory','fatigue','social','emotion'],2),
 Q('elsewhere','Does it happen even when your environment is comfortable and accessible?','Challenges a purely environmental explanation.',{environment:-1.5,emotion:1,capacity:1,health:.5},['sensory','fatigue','emotion'],1.8),
 Q('body','Have illness, physical symptoms, sleep disruption or medication changes accompanied this?','Prompts consideration of healthcare and physiology.',{health:2,capacity:1.5,emotion:.6,lowmood:.4},['sleep','fatigue','emotion','sensory'],2),
 Q('external-sleep','Are sleep opportunities interrupted by duties, shifts or surroundings?','Separates lack of sleep opportunity from an assumed internal disorder.',{environment:2,capacity:1.5,health:1},['sleep'],2),
 Q('sleep-worry','Does worrying about sleep make settling more difficult?','Explores a possible arousal-worry cycle.',{uncertainty:2,emotion:1,habit:.5,health:.5},['sleep'],1.9),
 Q('medical-sleep','Are there concerning symptoms such as waking gasping or sudden physical changes?','Physical symptoms may require assessment, not self-directed psychological interpretation.',{health:2},['sleep'],2,'medical'),
 Q('cue','Does a familiar cue set off the action almost automatically?','Examines cue-based habit rather than fear-driven checking.',{habit:2,attention:1,checking:-.5},['checking','sleep'],2),
 Q('ritual','Does an unwanted doubt drive you to repeat a check after it is already done?','Looks for a repeated checking loop without diagnosing OCD.',{checking:2,uncertainty:1.5,habit:-.5,power:-.5},['checking'],2),
 Q('needed-check','Would stopping leave a real, immediate safety or practical requirement unmet?','Distinguishes necessary safeguards from excessive checks.',{power:1.4,prediction:1,checking:-1,habit:-.5},['checking'],2),
 Q('react','When emotions are intense, does planning or communicating become much harder?','Considers temporary emotional load.',{emotion:2,capacity:1,selfcrit:.5,environment:.5},['emotion','relationships'],2),
 Q('loss','Is the difficulty closely connected to an important loss or life change?','Explores adjustment without imposing a grief timeline.',{grief:2,identity:1,emotion:1,capacity:.5},['loss','emotion','identity'],2),
 Q('reminders','Do reminders, anniversaries or changed roles bring it back into focus?','Tests contextual effects of loss or transition.',{grief:2,identity:1,emotion:1},['loss'],1.9),
 Q('masking','Does one version of yourself feel safer to show others than another?','Explores social roles without treating difference as pathology.',{identity:2,power:1,social:1,selfcrit:.5},['identity','social'],1.8),
 Q('expectations','Do other people’s expectations conflict with how you want to live?','Explores autonomy and constraints.',{values:2,identity:1.5,power:1},['identity','choices','relationships'],2),
 Q('value-clash','Are two genuinely important goals pulling you in opposite directions?','Separates values conflicts from missing information.',{values:2,uncertainty:1,ambiguity:.5,prediction:-.4},['choices','identity'],2),
 Q('one-info','Would one piece of missing information help you decide?','Tests an actionable information gap.',{ambiguity:2,prediction:.7,uncertainty:-.7,values:-.5},['choices'],1.9),
 Q('constraints','Are money, disability access, care duties or another person limiting your options?','Checks real conditions and unequal power.',{capacity:1,environment:2,power:1.5,values:.5},['choices','relationships','procrastination','fatigue'],2),
 Q('slowing','Does practical help or reduced demands help more than analysing it?','Compares changes in conditions with more self-reflection.',{capacity:1.7,environment:1,emotion:1,uncertainty:-1},['fatigue','emotion','loss'],1.7)
]);
export const QUESTION_BY_ID=Object.freeze(Object.fromEntries([...QUESTIONS,...DEEP_QUESTIONS].map(q=>[q.id,q])));
export const ANSWER_OPTIONS=Object.freeze([
 {id:'yes',label:'Yes',value:1},
 {id:'probably',label:'Probably',value:.55},
 {id:'unsure',label:'Not sure',value:0},
 {id:'probably-not',label:'Probably not',value:-.55},
 {id:'no',label:'No',value:-1}
]);
const ANSWER_BY_ID=Object.freeze(Object.fromEntries(ANSWER_OPTIONS.map(a=>[a.id,a])));
// No arbitrary nine-question cap: conclude only when the user chooses or useful questions are exhausted.
const cap=(x,n=700)=>String(x??'').trim().slice(0,n);
const findTrack=raw=>{
 const q=cap(raw,150).toLowerCase();
 const pairs=[
 [/procrastinat|putting off|start a task|assignment|productivity/,'procrastination'],
 [/ruminat|overthink|worry|replay|reassuran/,'overthinking'],
 [/partner|relationship|argument|trust|jealous|friend|family|boundary/,'relationships'],
 [/social|judg|embarrass|rejection/,'social'],
 [/fatigu|exhaust|burnout|deplet|overwhelm/,'fatigue'],
 [/insomn|sleep|nightmare|waking/,'sleep'],
 [/check|ritual|compulsi|repeat/,'checking'],
 [/decision|decide|choice|future/,'choices'],
 [/identity|belong|self-worth|gender|presentation|feminin|masculin|shav(?:e|ed|ing)|grooming|cross.?dress|clothes|nail polish|appearance/,'identity'],
 [/sensory|noise|crowd|overstimulat/,'sensory'],
 [/grief|loss|bereav|separat|transition/,'loss'],
 [/angry|emotion|react|feelings|panic/,'emotion']];
 return pairs.find(([re])=>re.test(q))?.[1]||null;
};
export function findHypothesisTrack(raw){return TRACK_BY_ID[findTrack(raw)]||null;}
export function startHypothesis({trackId='',topicId='',description=''}={}){
 const track=TRACK_BY_ID[trackId]||findHypothesisTrack(description)||findHypothesisTrack(topicId)||TRACK_BY_ID.procrastination;
 const raw=cap(description),risk=isSafetyPriority(topicId);
 const indicator=raw?safetyScreen(raw):null;
 const safety=risk?{kind:'support',reason:'This issue requires individual support before an automated formulation.'}:
  indicator&&['crisis','coercion','harm','physical','unusual'].includes(indicator.kind)?
    {...indicator,kind:indicator.kind==='physical'?'medical':indicator.kind==='unusual'?'support':indicator.kind}:null;
 return {version:'2026-11-09-deep-2',trackId:track.id,topicId:topicId&&atlasGet(topicId)&&!risk?topicId:null,
  description:raw,answers:[],feedback:{},nodeEdits:{},focusLayer:'',
  drill:!safety&&!topicId?beginSubtypeDrill(track.id):null,safety,initialSafety:safety};
}

/**
 * Domain-specific narrowing is an authored navigation path, not a clinical
 * inference. The chosen experience is only reported after explicit "yes".
 * Fictional training cases are not used to weight or diagnose anything.
 */
export function answerHypothesisDrill(state,questionId,answerId){
 if(!state?.drill||state.safety)return state;
 const q=subtypeQuestion(state.drill);
 if(!q||q.id!==questionId)return state;
 const drill=answerSubtypeDrill(state.drill,questionId,answerId);
 if(drill===state.drill)return state;
 // A dangerous physical-symptom branch triggers advice rather than trying
 // to formulate new neurological or cardiopulmonary symptoms psychologically.
 const dangerous=drill.clusterId==='HEALTH-ALARM'||
   (drill.leafId&&(
    drill.leafId==='SLEEP-HEALTH-GASPING-DURING-SLEEP'||
    drill.leafId==='EATING-EATING-COMPENSATORY-ACTIONS'));
 const safety=dangerous?{kind:'medical',reason:'This concern may require a physical-health assessment. A question pathway cannot establish its medical cause.'}:state.safety;
 return {...state,drill,safety};
}
export function skipHypothesisDrill(state){
 if(!state?.drill)return state;
 return {...state,drill:{...state.drill,finished:true,exitReason:'skip'}};
}
export function backHypothesisDrill(state){
 if(!state?.drill?.events?.length)return state;
 const events=state.drill.events.slice(0,-1);
 let drill=beginSubtypeDrill(state.trackId);
 for(const step of events)drill=answerSubtypeDrill(drill,step.questionId,step.answerId);
 return {...state,drill,safety:state.initialSafety||null};
}

function eligibleDeepQuestion(state,q){
 if(q.when==='presentation'&&!presentationBranchActive(state))return false;
 return true;
}
export function questionPool(state){
 const track=TRACK_BY_ID[state?.trackId];if(!track)return [];
 const allowed=new Set([...track.processes,...(EXTRA_BY_TRACK[track.id]||[])]);
 return [...QUESTIONS,...DEEP_QUESTIONS].filter(q=>
  (q.tracks.length===0||q.tracks.includes(track.id))&&
  Object.keys(q.signals).some(id=>allowed.has(id))&&
  eligibleDeepQuestion(state,q));
}
const trackProcesses=state=>[...(TRACK_BY_ID[state.trackId]?.processes||[]),...(EXTRA_BY_TRACK[state.trackId]||[])];
const weight=(answer,q,id)=>(ANSWER_BY_ID[answer.answerId]?.value||0)*(q.signals[id]||0);
function rawCandidates(state){
 const t=TRACK_BY_ID[state.trackId];if(!t)return [];
 return trackProcesses(state).map((id,index)=>{
  const process=PROCESS_BY_ID[id];
  const evidence=state.answers.map(a=>{
   const q=QUESTION_BY_ID[a.questionId];return q?{
    questionId:q.id,prompt:q.prompt,label:ANSWER_BY_ID[a.answerId]?.label||'Not sure',
    score:weight(a,q,id)}:null;
  }).filter(Boolean);
  const positive=evidence.filter(x=>x.score>=.65).sort((a,b)=>b.score-a.score);
  const negative=evidence.filter(x=>x.score<=-.65).sort((a,b)=>a.score-b.score);
  return {id,process,positive,negative,evidence,score:evidence.reduce((n,x)=>n+x.score,0),
   feedback:state.feedback?.[id]||'unreviewed',index};
 }).sort((a,b)=>{
  const score=c=>c.score+(c.feedback==='fits'?1.5:c.feedback==='no-fit'?-3:0);
  return score(b)-score(a)||a.index-b.index;
 });
}
export function rankedHypotheses(state,n=3){return rawCandidates(state).slice(0,n);}
/**
 * Expected information gain based on assumed (NOT calibrated) yes/no
 * compatibility. It is a question-selection heuristic, not diagnostic Bayes.
 * Unknown answers never count as confirmation.
 */
const entropy=prob=>-prob.reduce((a,p)=>a+(p>0?p*Math.log2(p):0),0);
function expectedDiscrimination(q,candidates){
 const relevant=candidates.slice(0,12);
 if(relevant.length<2)return 0;
 const strengths=relevant.map(c=>Math.exp(Math.max(-6,Math.min(6,c.score*.22))));
 const total=strengths.reduce((a,b)=>a+b,0);
 const prior=strengths.map(v=>v/total);
 const yesLikelihood=relevant.map(c=>{
  const signal=Math.max(-2,Math.min(2,q.signals[c.id]||0));
  return Math.max(.12,Math.min(.88,.5+signal*.17));
 });
 const yes=prior.reduce((sum,p,i)=>sum+p*yesLikelihood[i],0);
 const no=1-yes;
 const yesPosterior=prior.map((p,i)=>p*yesLikelihood[i]/yes);
 const noPosterior=prior.map((p,i)=>p*(1-yesLikelihood[i])/no);
 const gain=entropy(prior)-yes*entropy(yesPosterior)-no*entropy(noPosterior);
 return Math.max(0,gain);
}
// Distinct question IDs can still describe the same observation. Keep only
// carefully reviewed *equivalent* concepts here: complementary contrasts
// deliberately remain available as separate questions.
// This guard prevents paraphrased repeats, not all possible semantic overlap.
export const EQUIVALENT_QUESTION_GROUPS=Object.freeze([
 Object.freeze(['masking','d-id-masking']),
 Object.freeze(['accepted','d-id-safe-company','d-so-safe']),
 Object.freeze(['ritual','d-ck-intrusive']),
 Object.freeze(['needed-check','d-ck-need']),
 Object.freeze(['value-clash','d-de-values']),
 Object.freeze(['external-sleep','d-sl-shifts'])
]);
const conceptGroupById=Object.freeze(Object.fromEntries(
 EQUIVALENT_QUESTION_GROUPS.flatMap((ids,index)=>ids.map(id=>[id,'equiv-'+index]))
));
export function nextHypothesisQuestion(state){
 if(!state||state.safety)return null;
 const used=new Set(state.answers.map(a=>a.questionId));
 const usedGroups=new Set([...used].map(id=>conceptGroupById[id]).filter(Boolean));
 const pool=questionPool(state).filter(q=>!used.has(q.id)&&
   (!conceptGroupById[q.id]||!usedGroups.has(conceptGroupById[q.id])));
 if(!pool.length)return null;
 if(!state.answers.length){
  const first={procrastination:'first',overthinking:'certainty',relationships:'unsafe',
   social:'accepted',fatigue:'energy',emotion:'react',sleep:'external-sleep',
   checking:'ritual',choices:'value-clash',identity:'d-id-presentation',
   sensory:'sensory',loss:'loss'};
  return pool.find(q=>q.id===first[state.trackId])||pool[0];
 }
 const candidates=rawCandidates(state);
 const coverage=graphCoverage(state,QUESTION_BY_ID);
 const tagCount=new Map();
 for(const a of state.answers){
  const q=QUESTION_BY_ID[a.questionId];
  for(const tag of q?.tags||[])tagCount.set(tag,(tagCount.get(tag)||0)+1);
 }
 const focusTags=layerQuestionTags(state.focusLayer||'');
 const last=QUESTION_BY_ID[state.answers.at(-1)?.questionId];
 const ranked=pool.map(q=>{
  const gain=expectedDiscrimination(q,candidates);
  const missing=(q.tags||[]).filter(tag=>(tagCount.get(tag)||0)===0).length;
  const repeated=last&&(q.tags||[]).length>0&&
    (q.tags||[]).some(tag=>(last.tags||[]).includes(tag));
  const focus=focusTags.length&&(q.tags||[]).some(t=>focusTags.includes(t))?1.8:0;
  const presentation=state.trackId==='identity'&&presentationBranchActive(state)&&q.when==='presentation'?.28:0;
  const questionPriority=q.priority||1.4;
  const score=gain*10+missing*.29+(q.tags?.includes('counterfactual')&&!coverage.counterfactual?.7:0)+
    questionPriority*.14+focus+presentation-(repeated?.18:0);
  return {q,score};
 });
 return ranked.sort((a,b)=>b.score-a.score||a.q.id.localeCompare(b.q.id))[0]?.q||null;
}
function answerSafety(q,answerId){
 if(!q.flag||!['yes','probably'].includes(answerId))return null;
 return {kind:q.flag,reason:q.flag==='medical'?
  'Concerning physical health symptoms deserve an appropriate medical assessment.':
  'Possible intimidation or coercion deserves a safety-first response.'};
}
export function answerHypothesis(state,questionId,answerId){
 if(!state||state.safety||!ANSWER_BY_ID[answerId])return state;
 const q=questionPool(state).find(x=>x.id===questionId);
 if(!q||state.answers.some(a=>a.questionId===questionId))return state;
 const safety=answerSafety(q,answerId);
 return {...state,answers:[...state.answers,{questionId,answerId}],
  safety:safety||state.initialSafety||null,
  // A focused re-investigation continues to target the same branch until
  // the user explicitly chooses another.
  focusLayer:state.focusLayer||''};
}
export function reviseHypothesisAnswer(state,questionId,answerId){
 if(!state||!ANSWER_BY_ID[answerId]||!state.answers.some(a=>a.questionId===questionId))return state;
 let revision={...state,answers:state.answers.map(a=>a.questionId===questionId?{questionId,answerId}:a),
  safety:state.initialSafety||null};
 // Remove now-irrelevant specialised branch answers when its gateway changes.
 if(revision.trackId==='identity'&&!presentationBranchActive(revision))
  revision={...revision,answers:revision.answers.filter(a=>QUESTION_BY_ID[a.questionId]?.when!=='presentation')};
 for(const a of revision.answers){
  const q=QUESTION_BY_ID[a.questionId];
  const safety=q&&answerSafety(q,a.answerId);
  if(safety){revision={...revision,safety};break;}
 }
 return revision;
}
export function focusHypothesisLayer(state,layer){
 if(!state||state.safety)return state;
 return reopenGraphLayer(state,layer);
}
export function reviseHypothesisNode(state,id,change){
 if(!state||state.safety)return state;
 const result=hypothesisResult(state);
 if(!result?.graph.some(node=>node.id===id))return state;
 let updated=editGraphNode(state,id,change);
 if(id.startsWith('mechanism:')&&['fits','unsure','no-fit'].includes(change?.verdict))
  updated=reviewHypothesis(updated,id.slice('mechanism:'.length),change.verdict);
 return updated;
}
export function backHypothesis(state){
 if(!state?.answers.length)return state;
 return {...state,answers:state.answers.slice(0,-1),safety:state.initialSafety||null,feedback:{},focusLayer:''};
}
export function reviewHypothesis(state,id,value){
 if(!state||!trackProcesses(state).includes(id)||!['fits','unsure','no-fit'].includes(value))return state;
 return {...state,feedback:{...state.feedback,[id]:value}};
}
export function hypothesisResult(state){
 if(!state)return null;
 const all=rankedHypotheses(state,100);
 const leading=all.slice(0,3);
 const reviewed=all.filter(c=>!leading.some(x=>x.id===c.id)&&c.feedback!=='unreviewed');
 const alternatives=[...leading,...reviewed];
 const examined=state.answers.filter(a=>ANSWER_BY_ID[a.answerId]?.value!==0).length;
 const first=alternatives[0],second=alternatives[1];
 const unresolved=examined<5||!first?.positive.length||(first?.score||0)-(second?.score||0)<1;
 const topic=state.topicId||TRACK_BY_ID[state.trackId].topic;
 const safeTopic=topic&&atlasGet(topic)&&!isSafetyPriority(topic)?topic:null;
 const coverage=graphCoverage(state,QUESTION_BY_ID);
 const graph=buildFormulationGraph(state,alternatives,QUESTION_BY_ID);
 const canContinue=Boolean(nextHypothesisQuestion(state));
 return {track:TRACK_BY_ID[state.trackId],situation:state.description||(state.drill?.confirmed&&subtypeNode(state.drill.leafId)?'Exploring: '+subtypeNode(state.drill.leafId).label:TRACK_BY_ID[state.trackId].title),
  alternatives,graph,coverage,examined,unresolved,topic:safeTopic,canContinue,
  summary:state.safety?'Safety and practical support take priority over a questionnaire.':
   examined===0?'There is not enough distinguishing information yet.':
   unresolved?'Several explanations remain plausible. The answers cannot establish one cause.':
   'Your answers provide a provisional picture to examine. More questions and corrections may change it.',
  notes:'A formulation is an editable working hypothesis, not a diagnosis, risk estimate, recovered memory or hidden-cause discovery.',
  method:'Uncalibrated relative compatibility signals and expected question-discrimination, not validated clinical probabilities.'};
}
export function describeFormulation(state,candidate){
 const p=candidate.process;
 return {explanation:'In the situation you described, '+p.description+' '+p.possibleFunction+' '+p.possibleCost,
  need:p.need,challenge:p.check,
  observations:candidate.positive.map(x=>({question:x.prompt,response:x.label})),
  counterEvidence:candidate.negative.map(x=>({question:x.prompt,response:x.label})),
  link:state.topicId?'#workbook-topic/'+encodeURIComponent(state.topicId):p.link,
  limit:candidate.positive.length?
   'Compatible with some of your answers; not shown to cause this problem.':
   'Your answers have not provided direct support for this explanation.'};
}
export function formulationPlainText(state){
 const r=hypothesisResult(state);if(!r)return '';
 return ['Nobody’s Simple | Hypothesis Generator',r.track.title,'',
  'Situation: '+r.situation,'Observations considered: '+r.examined,r.summary,'',
  ...r.alternatives.flatMap((c,i)=>{
   const f=describeFormulation(state,c);
   return ['Possibility '+(i+1)+': '+c.process.title,f.explanation,
    'Support: '+(f.observations.map(o=>o.question+' ('+o.response+')').join('; ')||'No direct support'),
    'Challenges: '+(f.counterEvidence.map(o=>o.question+' ('+o.response+')').join('; ')||'Not assessed'),
    'Possible need to consider (not inferred): '+f.need,
    'A distinguishing question: '+f.challenge,
    'Your feedback: '+c.feedback,''];
  }),graphText(state,r.graph),r.notes,r.method].join('\n');
}
// Retained for API compatibility only: the engine has no fixed nine-question stopping rule.
export const HYPOTHESIS_LIMIT=QUESTIONS.length+DEEP_QUESTIONS.length;
export const HYPOTHESIS_DEEP_QUESTION_COUNT=DEEP_QUESTIONS.length;
export const HYPOTHESIS_PROCESS_COUNT=FORMULATION_PROCESSES.length+DEEP_PROCESSES.length;
export function selectableAtlasTopics(query,limit=12){
 const text=cap(query,80).toLowerCase();
 if(!text)return [];
 return atlasProblemIndex.filter(p=>!isSafetyPriority(p.id)&&(
  p.title.toLowerCase().includes(text)||p.id.replace(/-/g,' ').includes(text)||
  p.hint?.toLowerCase().includes(text))).slice(0,limit).map(p=>({id:p.id,title:p.title,hint:p.hint}));
}
