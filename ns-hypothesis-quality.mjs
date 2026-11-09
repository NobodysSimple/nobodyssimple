/* Stage 5 evidence-quality checks and visibility of what remains unexamined.
 * These are structural invariants, not measures of clinical agreement.
 */
import {investigationFacts} from './ns-hypothesis-investigation.mjs';
import {adaptiveFacts} from './ns-hypothesis-adaptive.mjs';

export const FORMULATION_DIMENSIONS=Object.freeze([
 {id:'situation',label:'The immediate situation',core:['who','father_behaviour','event','environment'],adaptive:['external_persistence','external_action']},
 {id:'feeling',label:'Emotions and personal meaning',core:['emotion','interpretation'],adaptive:['meaning_evidence','meaning_reframe']},
 {id:'regulation',label:'Coping and emotional regulation',core:['action','regulation'],adaptive:['coping_intention','coping_pattern']},
 {id:'consequences',label:'Short- and long-term effects',core:['short_term','long_term'],adaptive:['coping_counterfactual','recurrent_cycle']},
 {id:'body',label:'Sleep, health and capacity',core:['sleep','capacity'],adaptive:['sleep_contrast','load_contrast']},
 {id:'conditions',label:'External demands, support and safety',core:['environment','counterexample'],adaptive:['external_action','protective_response']},
 {id:'history',label:'Development and timing',core:[],adaptive:['context_history','history_clarify']},
 {id:'values',label:'Needs, values and constraints',core:['values','values_cost'],adaptive:['values_external']},
 {id:'alternatives',label:'Alternative explanations and exceptions',core:['alternative','if_stop','counterexample'],adaptive:['safe_probe','meaning_reframe','recurrent_cycle']}
]);
const neutral=new Set(['unsure','other','prefer_not','unknown']);
const states=(state)=>new Map([
 ...(state?.investigation?.answers||[]).map(a=>['core:'+a.field,a.answerId]),
 ...(state?.adaptive?.answers||[]).map(a=>['adaptive:'+a.field,a.answerId])
]);
export function evidenceCoverage(state){
 const answers=states(state);
 return FORMULATION_DIMENSIONS.map(dim=>{
  const keys=[...dim.core.map(x=>'core:'+x),...dim.adaptive.map(x=>'adaptive:'+x)];
  const asked=keys.filter(x=>answers.has(x));
  const informative=asked.filter(x=>!neutral.has(answers.get(x)));
  return {id:dim.id,label:dim.label,
   status:informative.length?'reported':asked.length?'asked_no_confirmed_detail':'not_investigated',
   asked:asked.length,informative:informative.length,
   totalPossible:keys.length};
 });
}
export function auditFormulationEvidence(state,result){
 const direct=[...investigationFacts(state),...adaptiveFacts(state)];
 const graph=result?.graph||[];
 const links=result?.links||[];
 const graphEvidence=graph.flatMap(node=>node.evidence||[]);
 const graphStrings=[...graph.map(n=>n.summary||n.title),
  ...graphEvidence.map(e=>e.answer),...links.flatMap(l=>[l.fromText,l.toText])];
 const errors=[];
 const add=(kind,id,reason)=>errors.push({kind,id,reason});
 // A person's own words must survive in at least one visible graph node.
 if(state?.description?.trim()&&!graphStrings.some(t=>String(t||'').includes(state.description.trim().slice(0,280)))){
  add('verbatim_missing','presenting','The original concern was omitted from the graph');
 }
 for(const fact of direct){
  if(!graphStrings.some(t=>String(t||'').includes(fact.text)))
   add('verbatim_missing',fact.id,'Explicit selected or user-entered answer omitted from graph');
 }
 const byId=new Map(direct.map(f=>[f.id,f]));
 for(const link of links){
  // Only Stage 3/4 evidence-linked edges are checked. Existing earlier
  // hypothetical process edges may use a different representation.
  if(!(link.id||'').startsWith('invest-link:')&&!(link.id||'').startsWith('adaptive-link:'))continue;
  const a=byId.get(link.from),b=byId.get(link.to);
  if(!a||!b)add('unsupported_edge',link.id,'Missing one or both source facts');
  else if(a.text!==link.fromText||b.text!==link.toText)
   add('source_mismatch',link.id,'Edge labels do not match the original response');
  if(link.status!=='proposed_not_causal')
   add('causal_overstatement',link.id,'Proposed arrow is presented as established');
 }
 for(const pattern of result?.patterns||[]){
  if(!pattern.evidence?.length)
   add('unsupported_pattern',pattern.id,'Candidate has no explicit supporting selection');
 }
 const directCount=direct.length;
 return {structuralIssues:errors,passed:errors.length===0,
  checkedFacts:directCount,checkedLinks:links.length,
  checkedPatterns:(result?.patterns||[]).length,
  verbatimAnswers:direct.filter(f=>!!f.verbatim).length,
  coverage:evidenceCoverage(state),
  clinicalValidityAssessed:false};
}
