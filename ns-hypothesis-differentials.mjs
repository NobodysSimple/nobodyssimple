/* Nobody's Simple · Stage 3: inspectable multi-observation differential rules.
 * These are educational *hypotheses to test*, NOT diagnosed mechanisms,
 * clinical likelihoods, causal discoveries or learned probabilities.
 */
import {investigationFacts} from './ns-hypothesis-investigation.mjs';
import {caseDetailFacts} from './ns-hypothesis-case-facts.mjs';
const R=(id,title,requires,description,falsifier,alternative)=>
 Object.freeze({id,title,requires:Object.freeze(requires),description,falsifier,alternative});
export const DIFFERENTIAL_RULES=Object.freeze([
 R('relief-return','Short-term relief without lasting resolution',
  {action:['withdraw','delay','reassure','appease'],short_term:['relief','numb'],long_term:['returns','worse','unresolved']},
  'The reported response may ease the moment while leaving the original issue unchanged. That does not prove the response caused the later difficulty.',
  'Does the problem return even when you respond differently? Could real external circumstances explain its persistence?',
  'The external situation may simply remain difficult, regardless of coping.'),
 R('reassurance-loop','Checking or analysis followed by recurring doubt',
  {regulation:['analyse'],short_term:['relief','numb'],long_term:['returns','worse']},
  'Analysing or checking seems to be associated with a temporary change, followed by the original concern returning. This is a possible reinforcing pattern.',
  'Does new, trustworthy information resolve the issue? Does the concern return even without checking?',
  'Ambiguous or genuinely unreliable information may be the main problem.'),
 R('resource-load','Sleep and capacity as competing contributors',
  {sleep:['too_little','difficulty','irregular','oversleep'],capacity:['high','some']},
  'Insufficient or disturbed sleep together with limited capacity could contribute to the experience. This is not evidence of a psychological deficit.',
  'Does adequate rest change the difficulty? Are there medical, caring, workload or access issues?',
  'Other stressors, health problems and environment may independently affect capacity.'),
 R('autonomy-threat','Choice, control and actual external pressure',
  {interpretation:['controlled'],values:['autonomy']},
  'The person reports that a situation felt controlling while personal autonomy matters to them. That may describe an understandable conflict.',
  'Are choices genuinely restricted, or is the threat primarily anticipated? Does the problem vary by relationship?',
  'Real coercion or unequal power calls for practical and safety-oriented consideration, not just cognitive reframing.'),
 R('social-approval','Anticipated rejection and accommodation',
  {interpretation:['rejected'],action:['appease','withdraw']},
  'Fear of exclusion is reported alongside a response intended or experienced in a social context. The response might be protective; its function remains unconfirmed.',
  'What actually happens when the person safely expresses a different preference? Are there real consequences for disagreement?',
  'Actual mistreatment or discrimination can make self-protection reasonable.'),
 R('evaluative-delay','Evaluative meaning preceding delay',
  {interpretation:['inadequate','mistake'],action:['delay']},
  'The person reports anticipated inadequacy or error and then delays a task. A threat-related interpretation is worth considering, not assumed causal.',
  'Does the same delay occur with enjoyable, private tasks? Does clearer instruction or reduced workload change it?',
  'Executive function, task ambiguity, inaccessible conditions and fatigue remain possible.'),
 R('context-safer','Social environment changes the experience',
  {counterexample:['safer_people']},
  'The person reports that the experience differs around safer or more accepting people. Context might be important.',
  'Which concrete differences distinguish those settings? Does the same pattern happen when alone?',
  'The difference could reflect support, predictability, safety, reduced performance demands or several factors.'),
 R('context-rest','Recovery changes the experience',
  {counterexample:['rest']},
  'The person notices an exception when adequately rested. Capacity is a candidate contextual influence.',
  'Does a similar task still feel difficult after enough sleep? Are physiological or medical factors involved?',
  'Rest may correlate with other changes in workload, environment or support.'),
 R('actual-conditions','Material or relational conditions may be maintaining distress',
  {environment:['power','resources','support','sensory','unclear']},
  'A concrete external condition has been selected. Its role needs investigating before assuming a hidden intrapsychic cause.',
  'What changes when the concrete condition is changed, where that is safe and feasible?',
  'Cognitive interpretations and coping habits may still influence the impact, but may not be primary.'),
 R('meaning-not-cause','Meaning and emotion, without a demonstrated behaviour cycle',
  {emotion:['fear','shame','anger','sadness','confusion'],interpretation:['unfair','unsafe','controlled','rejected','inadequate']},
  'An emotion and personally meaningful interpretation were both selected. The relationship between them is still untested.',
  'Was the meaning present before the feeling, or did it emerge afterwards? Could both follow the same event?',
  'These can be understandable responses to real conditions, without an underlying disorder.'),
 R('valid-response','A reported response may be effective, not maladaptive',
  {short_term:['practical'],long_term:['improves']},
  'The person reports that their response addresses a practical problem and the improvement lasts. A maintaining avoidance cycle should not be presumed.',
  'Does the improvement last across situations? What features made the response work?',
  'The remaining concern, if any, could have a different source.'),
 R('no-ongoing-problem','No maintaining problem is established',
  {long_term:['no_problem']},
  'The person does not report an ongoing maintaining difficulty. Treating an ordinary preference or experience as pathology is not warranted by these answers.',
  'Is there something the person wants to understand despite not wanting to change it?',
  'Social interpretations, curiosity or a practical constraint may be more relevant than a psychological mechanism.')
]);
const positive=(f)=>!['unsure','other','prefer_not'].includes(f.value);
export function testableDifferentials(state){
 if(!state||state.safety||state.drill?.unsupportedCategory)return [];
 const facts=investigationFacts(state).filter(positive);
 const factBy=new Map(facts.map(f=>[f.kind,f]));
 const impact=caseDetailFacts(state).find(f=>f.kind==='impact');
 const goal=caseDetailFacts(state).find(f=>f.kind==='goal');
 const notAnIssue=impact?.value==='none'&&goal?.value==='do_not_change';
 const output=DIFFERENTIAL_RULES.filter(rule=>
  // When the person likes the experience and reports no impairment, avoid
  // assigning a hidden maladaptive maintenance loop by default.
  (!notAnIssue||['no-ongoing-problem','valid-response'].includes(rule.id))&&
  Object.entries(rule.requires).every(([key,values])=>values.includes(factBy.get(key)?.value))
 ).map(rule=>{
  const supports=Object.keys(rule.requires).map(key=>factBy.get(key));
  return {id:'pattern:'+rule.id,title:rule.title,description:rule.description,
   evidence:supports.map(f=>({id:f.id,question:f.question,answer:f.text})),
   falsifier:rule.falsifier,alternative:rule.alternative,
   status:'testable_not_established',source:'authored_rule_no_empirical_calibration'};
 });
 // No generic ranking. Multiple patterns can coexist or none can fit.
 return output;
}
