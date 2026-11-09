/* Nobody's Simple — Stage 4 prototype: targeted causal inquiry.
 * Uses the uploaded synthetic formulation database's provisional mechanism
 * vocabulary as an indexed RESEARCH catalogue. Questions below are a small,
 * explicitly authored and unvalidated subset; no synthetic case is a patient,
 * probability, causal ground truth, or clinical recommendation.
 */
import {investigationFacts} from './ns-hypothesis-investigation.mjs';
import {caseDetailFacts} from './ns-hypothesis-case-facts.mjs';

// 72 editorial mechanism IDs and names reproduced from the uploaded v1
// mechanisms.jsonl. This is an index, not an inference model or a score table.
const CATALOGUE_TEXT = [
'learning|behaviour_avoidance|Avoidance after anticipated discomfort',
'learning|negative_reinforcement|Short-term relief cycle',
'learning|habit_cue|Cue-driven habit',
'learning|uncertain_reward|Unpredictable reward cycle',
'learning|immediate_reward|Immediate reward preference',
'learning|gradual_exposure|Opportunity for corrective learning',
'learning|compulsive_neutralising|Ritual or neutralising sequence',
'learning|behavioural_inactivity|Activity restriction and low reinforcement',
'learning|self_monitoring|Excessive self-monitoring',
'learning|safety_behaviour|Protection behaviour and reduced feedback',
'cognitive|anticipated_judgment|Anticipated negative evaluation',
'cognitive|self_criticism|Harsh self-evaluation',
'cognitive|conditional_worth|Achievement-contingent self-evaluation',
'cognitive|perfectionistic_rule|Rigid standards and error fear',
'cognitive|uncertainty_tolerance|Difficulty tolerating uncertain outcomes',
'cognitive|future_worry|Prospective worry',
'cognitive|past_rumination|Repetitive retrospective analysis',
'cognitive|catastrophic_interpretation|Threat-based interpretation of ambiguous sensations',
'cognitive|responsibility_inflation|Inflated responsibility belief',
'cognitive|threat_vigilance|Threat monitoring',
'cognitive|identity_interpretation|Meaning attached to personal choices',
'cognitive|moral_doubt|Moral uncertainty and self-scrutiny',
'cognitive|interpretation_bias|Uncertain social interpretation',
'cognitive|decision_tradeoff|Competing valued outcomes',
'relational|boundary_mismatch|Boundary or expectation mismatch',
'relational|trust_rupture|Trust affected by real prior events',
'relational|closeness_uncertainty|Uncertainty about relational availability',
'relational|conflict_avoidance|Avoiding disagreement',
'relational|support_gap|Mismatch between support needed and offered',
'relational|relationship_power|Unequal power or constrained choice',
'relational|communication_mismatch|Communication expectations differ',
'relational|reciprocity_gap|Unequal exchange of care or effort',
'relational|social_isolation|Reduced accessible social connection',
'relational|comparison_pressure|Social comparison pressure',
'capacity|sleep_restriction|Insufficient sleep opportunity',
'capacity|circadian_mismatch|Circadian schedule mismatch',
'capacity|physical_health|Physical health or neurological influence',
'capacity|medication_effect|Medication or treatment effect',
'capacity|substance_effect|Substance-related influence',
'capacity|pain_interference|Pain and symptom interference',
'capacity|sensory_demand|Sensory or processing overload',
'capacity|executive_load|Task initiation or executive load',
'capacity|cognitive_fatigue|Cognitive depletion and recovery',
'capacity|acute_alarm|Acute physiological arousal',
'capacity|homeostatic_need|Basic physiological or recovery need',
'structural|financial_scarcity|Material scarcity and uncertainty',
'structural|housing_insecurity|Unsafe or unstable accommodation',
'structural|discrimination|Discrimination and minority stress',
'structural|accessibility_gap|Accessibility barriers',
'structural|role_overload|Demand-capacity imbalance',
'structural|institutional_barrier|Institutional or bureaucratic constraint',
'structural|cultural_expectation|Cultural or social expectation conflict',
'structural|actual_safety_risk|Real threat or danger',
'structural|time_resources|Time and resource limitation',
'emotion|emotion_suppression|Emotion suppression in a particular context',
'emotion|emotion_labeling|Difficulty identifying emotional state',
'emotion|arousal_recovery|Difficulty recovering from heightened activation',
'emotion|grief_response|Grief and adaptation to loss',
'emotion|values_conflict|Conflict among meaningful values',
'emotion|autonomy_constraint|Reduced decision-making autonomy',
'emotion|stigma_shame|Shame under social stigma',
'emotion|loneliness_need|Unmet wish for social contact',
'benign|aesthetic_preference|Ordinary aesthetic or sensory preference',
'benign|sexual_role_choice|Consensual chosen role or erotic preference',
'benign|identity_exploration|Ordinary identity or values exploration',
'benign|chosen_solitude|Preferred low-social-contact lifestyle',
'benign|legitimate_caution|Appropriate response to real risk',
'benign|healthy_grief|Normal variation in response to loss',
'benign|no_formulation_needed|No psychological causal account required',
'benign|positive_aspiration|Value-driven aspiration',
'benign|uncertain_inference|Insufficient information',
'learning|task_ambiguity|Unclear first step or task structure'
];
export const SYNTHETIC_MECHANISMS=Object.freeze(CATALOGUE_TEXT.map(row=>{
 const [family,id,...parts]=row.split('|');
 return Object.freeze({family,id,name:parts.join('|'),source:'synthetic_database_v1',
  status:'editorial_unvalidated',empiricalProbability:null});
}));
export const ADAPTIVE_LIMIT=8;
const skipOptions=[
 {id:'unsure',label:'I do not know / have not observed this'},
 {id:'other',label:'None of these; I would describe it differently'},
 {id:'prefer_not',label:'Prefer not to answer'}
];
const Q=(id,concept,layer,prompt,options,{needs={},any=[],priority=1,why='',mechanisms=[]}={})=>
 Object.freeze({id,conceptId:concept,layer,prompt,options:Object.freeze([
  ...options.map(([value,label])=>Object.freeze({id:value,label})),...skipOptions
 ]),needs,any,priority,why,mechanisms:Object.freeze(mechanisms),questionId:'Q-NS-ADAPT-'+id.toUpperCase()});
export const ADAPTIVE_QUESTIONS=Object.freeze([
 Q('external_persistence','external.behaviour_consistency','context',
 'Does the other person’s behaviour continue even when you respond differently?',[
  ['persists','Yes, it continues regardless of my response'],['varies','It changes with the situation or their response'],
  ['stopped','The behaviour has stopped'],['unsafe','It would not be safe to try a different response']
 ],{any:[{father_behaviour:['dismissal','rules','broken_promises','unavailable','inconsistent']},{environment:['power']}],
 priority:9,why:'Distinguishes an external difficulty from a cycle caused by your own response.',
 mechanisms:['relationship_power','boundary_mismatch','actual_safety_risk']}),
 Q('external_action','external.practical_change','context',
 'What has happened when the actual circumstances changed?',[
  ['improved','The difficulty improved when the external condition changed'],
  ['unchanged','The difficulty continued even with the condition changed'],
  ['cannot_change','That condition is not currently under my control'],
  ['not_tested','I have not seen the circumstances change']
 ],{any:[{environment:['power','resources','support','sensory','unclear']},{counterexample:['safer_people','choice','clarity','less_demand']}],
 priority:8,why:'Tests material conditions before attributing the difficulty to the person.',
 mechanisms:['role_overload','relationship_power','accessibility_gap']}),
 Q('sleep_contrast','body.rest_comparison','context',
 'When you have sufficient rest, does this same difficulty change?',[
  ['easier','It tends to become easier'],['unchanged','It stays much the same'],
  ['mixed','It changes only alongside other conditions'],['no_rest','I have not had a fair chance to compare']
 ],{needs:{sleep:['too_little','difficulty','irregular','oversleep']},priority:8,
 why:'Rest provides a possible comparison, not evidence that sleep is the root cause.',
 mechanisms:['sleep_restriction','cognitive_fatigue','role_overload']}),
 Q('load_contrast','body.demand_comparison','context',
 'When the demands on you are lower, what happens to this difficulty?',[
  ['easier','It becomes easier'],['unchanged','It remains difficult'],
  ['mixed','Sometimes, but other factors change too'],['no_comparison','I have not had a lower-demand period']
 ],{needs:{capacity:['high','some']},priority:7,why:'Checks demand–capacity mismatch as a competing explanation.',
 mechanisms:['role_overload','executive_load','cognitive_fatigue']}),
 Q('coping_intention','regulation.intended_function','function',
 'When you turn to your usual coping method, what are you primarily trying to change?',[
  ['emotion','Make an uncomfortable feeling less intense'],
  ['certainty','Feel sure about something uncertain'],
  ['connection','Feel close to or supported by someone'],
  ['practical','Solve a practical problem'],['enjoy','Enjoy it; I am not necessarily trying to escape'],
  ['no_intention','It usually happens without a conscious aim']
 ],{any:[{regulation:['talk','avoid','analyse','scroll','fantasy','activity','rest','substance']},{action:['withdraw','reassure','appease','delay','soothe']}],
 priority:7,why:'A coping strategy is not automatically avoidance; its function needs asking.',
 mechanisms:['negative_reinforcement','immediate_reward','legitimate_caution','aesthetic_preference']}),
 Q('coping_counterfactual','regulation.consequence_comparison','cost',
 'When you have used a different, safe response, what happened later?',[
  ['better','The original difficulty improved'],['same','The original difficulty was similar'],
  ['worse','The difficulty worsened'],['not_tried','I have not tried a safe alternative'],
  ['not_safe','Trying a different response would be unsafe or costly']
 ],{needs:{short_term:['relief','numb','control'],long_term:['returns','worse','unresolved']},
 priority:9,why:'A short-term relief cycle cannot be established until alternatives and external persistence are considered.',
 mechanisms:['negative_reinforcement','behaviour_avoidance','actual_safety_risk']}),
 Q('coping_pattern','regulation.habit_or_choice','response',
 'How much choice do you feel you have about using this response in the moment?',[
  ['deliberate','It is usually a deliberate choice'],['automatic','It often happens before I notice'],
  ['compelled','I feel I must do it to reduce distress or uncertainty'],
  ['constrained','My circumstances leave me few realistic alternatives']
 ],{any:[{regulation:['avoid','analyse','scroll','fantasy','substance']},{action:['reassure','delay','withdraw']}],
 priority:6,why:'Distinguishes automatic habits, urgent reassurance and constrained choices.',
 mechanisms:['habit_cue','compulsive_neutralising','relationship_power']}),
 Q('meaning_evidence','meaning.observation_vs_prediction','experience',
 'What most supports the feared meaning you described?',[
  ['events','Specific things that have really happened'],
  ['prediction','Mainly what I fear or predict could happen'],
  ['both','Both real events and anticipation'],
  ['not_fear','It is not primarily about fear or a predicted outcome']
 ],{needs:{interpretation:['rejected','inadequate','controlled','unsafe','mistake']},
 priority:8,why:'Tests whether an appraisal is supported by events, expectation or both.',
 mechanisms:['anticipated_judgment','interpretation_bias','trust_rupture']}),
 Q('meaning_reframe','meaning.alternative_test','experience',
 'When the same event has a different plausible explanation, does your response change?',[
  ['changes','My emotion or behaviour changes'],['persists','It stays much the same'],
  ['never_clear','I cannot reasonably determine what the other person intended'],
  ['actual_event','The observed behaviour is a problem regardless of its motive']
 ],{needs:{interpretation:['rejected','inadequate','controlled','unsafe','mistake','unfair']},
 priority:5,why:'Distinguishes the effect of an interpretation from a real, persistent event.',
 mechanisms:['interpretation_bias','trust_rupture','boundary_mismatch']}),
 Q('values_external','values.constraint_or_conflict','tension',
 'Is the conflict mainly between your own goals, or between your goals and something outside your control?',[
  ['internal','I want two things that genuinely pull in different directions'],
  ['external','Other people or circumstances restrict an important goal'],
  ['both','Both are part of it'],['none','I do not think there is a meaningful conflict']
 ],{any:[{values_cost:['relationship','independence','comfort','certainty','time']},{interpretation:['controlled']}],
 priority:7,why:'Prevents imposing an internal conflict on an externally constrained person.',
 mechanisms:['values_conflict','autonomy_constraint','relationship_power']}),
 Q('context_history','development.onset_context','context',
 'When did this particular pattern first become noticeable?',[
  ['recent','After a recent change or specific current situation'],
  ['earlier','It has happened across several periods of my life'],
  ['sometimes','Only in certain relationships or situations'],
  ['unknown_when','I cannot reliably identify when it started']
 ],{priority:3,why:'Early history is a possibility to explore, not proof of childhood trauma.',
 mechanisms:['habit_cue','trust_rupture','role_overload']}),
 Q('history_clarify','development.learning_comparison','context',
 'Does a similar response show up when the original person or situation is absent?',[
  ['multiple','Yes, in several other situations'],['specific','No, it seems specific to this situation'],
  ['new','It is new and tied to recent circumstances'],['unsure_pattern','I have not observed the pattern closely']
 ],{needs:{'adaptive:context_history':['earlier','sometimes']},
 priority:5,why:'Looks for generalisation without inferring an attachment style or trauma.',
 mechanisms:['habit_cue','trust_rupture','interpretation_bias']}),
 Q('recurrent_cycle','sequence.recurrence','cost',
 'Across separate occasions, is the order of event → response → consequence usually the same?',[
  ['often','Yes, I have noticed this repeatedly'],['different','No, different things happen each time'],
  ['only_once','It has only happened once or twice'],['not_observed','I have not tracked the order']
 ],{needs:{action:['withdraw','confront','appease','reassure','delay','soothe','communicate'],short_term:['relief','numb','control','distress','practical']},
 priority:7,why:'A proposed feedback loop needs repeated temporal observations.',
 mechanisms:['negative_reinforcement','habit_cue','uncertain_reward']}),
 Q('protective_response','test.appropriate_response','function',
 'Could this response be reasonable protection against a real problem?',[
  ['yes','Yes; the risk or harm is real'],['sometimes','Possibly; it depends on the situation'],
  ['no','No clear external risk seems to require it'],['not_problem','This is not something I need to change']
 ],{any:[{if_stop:['risk','judgement']},{long_term:['no_problem']},{environment:['power','resources']}],
 priority:8,why:'Tests the possibility that no maladaptive psychological mechanism is required.',
 mechanisms:['legitimate_caution','no_formulation_needed','actual_safety_risk']}),
 Q('safe_probe','test.next_observation','need',
 'Which observation might safely help distinguish the explanations still open?',[
  ['compare_context','Notice the same difficulty in a different safe context'],
  ['compare_rest','Observe whether rest changes it'],
  ['observe_sequence','Notice event, response and later effects across ordinary instances'],
  ['change_external','Observe what changes when real circumstances improve'],
  ['ask_support','Seek a trusted person’s perspective or practical support'],
  ['no_test','I would rather stop and leave this uncertain']
 ],{priority:1,why:'An optional observation is not a treatment prescription.',
 mechanisms:['uncertain_inference']})
]);
const NONFACT=new Set(['unsure','other','prefer_not']);
const valid=(x)=>x&&!NONFACT.has(x);
const core=(state)=>new Map(investigationFacts(state).map(f=>[f.kind,f]));
const chosen=(state)=>new Map((state?.adaptive?.answers||[]).map(a=>['adaptive:'+a.field,a]));
function eligible(q,selection){
 const all=Object.entries(q.needs).every(([field,values])=>values.includes(selection.get(field)));
 return all&&(!q.any.length||q.any.some(group=>Object.entries(group).every(([field,values])=>values.includes(selection.get(field)))));
}
export const newAdaptiveInquiry=()=>({active:false,finished:false,answers:[]});
export function adaptiveCandidates(state){
 if(!state||state.safety||state.drill?.unsupportedCategory)return [];
 const answers=state.adaptive?.answers||[];
 if(answers.length>=ADAPTIVE_LIMIT)return [];
 const selection=new Map([...core(state).values()].map(f=>[f.kind,f.value]));
 for(const a of answers)selection.set('adaptive:'+a.field,a.answerId);
 const usedConcepts=new Set(answers.map(a=>a.conceptId));
 return ADAPTIVE_QUESTIONS.filter(q=>!usedConcepts.has(q.conceptId)&&eligible(q,selection))
  .sort((a,b)=>b.priority-a.priority||a.id.localeCompare(b.id));
}
export function adaptiveQuestion(state){
 if(!state?.adaptive?.active)return null;
 return adaptiveCandidates(state)[0]||null;
}
export function startAdaptiveInquiry(state){
 if(!state||state.safety||state.drill?.unsupportedCategory)return state;
 return {...state,adaptive:{...(state.adaptive||newAdaptiveInquiry()),active:true,finished:false}};
}
export function answerAdaptiveInquiry(state,questionId,answerId,verbatim=''){
 const q=adaptiveQuestion(state);
 if(!q||q.questionId!==questionId||!q.options.some(o=>o.id===answerId))return state;
 const answers=[...(state.adaptive?.answers||[]),{
  field:q.id,questionId:q.questionId,conceptId:q.conceptId,layer:q.layer,answerId,
  verbatim:typeof verbatim==='string'?verbatim.trim().slice(0,280):''
 }];
 const update={...state,adaptive:{...state.adaptive,answers}};
 const more=adaptiveCandidates(update).length>0;
 return {...update,adaptive:{...update.adaptive,active:more,finished:!more}};
}
export function backAdaptiveInquiry(state){
 if(!state?.adaptive?.answers?.length)return state;
 return {...state,adaptive:{...state.adaptive,answers:state.adaptive.answers.slice(0,-1),active:true,finished:false}};
}
export function stopAdaptiveInquiry(state){
 if(!state?.adaptive)return state;
 return {...state,adaptive:{...state.adaptive,active:false,finished:true}};
}
export function adaptiveFacts(state){
 const byId=Object.fromEntries(ADAPTIVE_QUESTIONS.map(q=>[q.id,q]));
 return (state?.adaptive?.answers||[]).flatMap(a=>{
  const q=byId[a.field],option=q?.options.find(o=>o.id===a.answerId);
  if(!q||!option||!valid(a.answerId))return [];
  return [{id:a.questionId,conceptId:a.conceptId,kind:'adaptive:'+a.field,
   layer:q.layer,question:q.prompt,text:a.verbatim||option.label,optionLabel:option.label,
   value:a.answerId,verbatim:a.verbatim||'',source:'user_selection',
   status:'person_reported',hypothesis:false}];
 });
}
// A mixed evidence ledger: direct person-selected supporting evidence and
// explicitly contradictory evidence. It never estimates probabilities.
const RULES=[
 {id:'external-persistent',title:'External conditions may be a primary contributor',
  mechanisms:['relationship_power','boundary_mismatch'],requires:{'adaptive:external_persistence':['persists'],'father_behaviour':['dismissal','rules','broken_promises','unavailable','inconsistent']},
  contrary:{'adaptive:external_persistence':['stopped']},
  alternative:'The person's response can still alter its impact; the other person's motives remain unknown.'},
 {id:'capacity-sensitive',title:'Rest and limited capacity may be contributing',
  mechanisms:['sleep_restriction','cognitive_fatigue'],requires:{sleep:['too_little','difficulty','irregular','oversleep'],'adaptive:sleep_contrast':['easier']},
  contrary:{'adaptive:sleep_contrast':['unchanged']},
  alternative:'Workload, health, medication and other changes may also affect rest and capacity.'},
 {id:'environment-sensitive',title:'The setting itself may be maintaining the difficulty',
  mechanisms:['role_overload','accessibility_gap'],requires:{environment:['power','resources','support','sensory','unclear'],'adaptive:external_action':['improved','cannot_change']},
  contrary:{'adaptive:external_action':['unchanged']},
  alternative:'Some difficulties can remain after an environment improves.'},
 {id:'possible-reinforcement',title:'Short-term relief may be part of a repeating cycle',
  mechanisms:['negative_reinforcement','habit_cue'],requires:{short_term:['relief','numb'],long_term:['returns','worse'],'adaptive:recurrent_cycle':['often']},
  contrary:{'adaptive:recurrent_cycle':['different','only_once']},
  alternative:'The original problem may continue independently of how the person copes.'},
 {id:'actual-threat',title:'A response may be appropriate protection against real conditions',
  mechanisms:['legitimate_caution','actual_safety_risk'],requires:{'adaptive:protective_response':['yes']},
  contrary:{'adaptive:protective_response':['no']},
  alternative:'Protection and an additional costly habit can coexist; do not presume either.'},
 {id:'prediction-versus-event',title:'Anticipated meaning may be one relevant influence',
  mechanisms:['interpretation_bias','anticipated_judgment'],requires:{'adaptive:meaning_evidence':['prediction'],'adaptive:meaning_reframe':['changes']},
  contrary:{'adaptive:meaning_evidence':['events'],'adaptive:meaning_reframe':['persists','actual_event']},
  alternative:'Uncertainty and a history of real mistreatment may still matter.'},
 {id:'values-versus-constraints',title:'An external constraint may matter more than an inner conflict',
  mechanisms:['autonomy_constraint','relationship_power'],requires:{'adaptive:values_external':['external']},
  contrary:{'adaptive:values_external':['internal','none']},
  alternative:'Genuine competing internal priorities can coexist with restrictions.'},
 {id:'generalized-response',title:'A learned response may extend beyond the original context',
  mechanisms:['habit_cue','trust_rupture'],requires:{'adaptive:context_history':['earlier'],'adaptive:history_clarify':['multiple']},
  contrary:{'adaptive:history_clarify':['specific','new']},
  alternative:'A shared present-day condition could explain similar responses in multiple places.'}
];
export const ADAPTIVE_RULES=Object.freeze(RULES.map(r=>Object.freeze(r)));
export function adaptiveDifferentials(state){
 if(!state||state.safety||state.drill?.unsupportedCategory)return [];
 const all=[...investigationFacts(state),...adaptiveFacts(state)];
 const by=new Map(all.map(f=>[f.kind,f]));
 const noChange=caseDetailFacts(state).some(f=>f.kind==='goal'&&f.value==='do_not_change');
 return ADAPTIVE_RULES.filter(r=>!noChange||r.id==='actual-threat')
  .filter(r=>Object.entries(r.requires).every(([kind,values])=>values.includes(by.get(kind)?.value)))
  .map(r=>({
   id:'pattern:adaptive-'+r.id,title:r.title,mechanismIds:r.mechanisms,
   description:'A tentative relationship suggested by multiple selected answers, not a discovered cause.',
   alternative:r.alternative,
   evidence:Object.keys(r.requires).map(kind=>by.get(kind)).filter(Boolean)
    .map(f=>({id:f.id,question:f.question,answer:f.text})),
   challenges:Object.entries(r.contrary||{}).filter(([kind,values])=>values.includes(by.get(kind)?.value))
    .map(([kind])=>by.get(kind)).map(f=>({id:f.id,question:f.question,answer:f.text})),
   status:'testable_not_established',source:'authored_synthetic_v1_mechanism_index'
  }));
}
export function adaptiveReport(state){
 return adaptiveFacts(state).map(f=>f.question+' — '+f.text);
}
