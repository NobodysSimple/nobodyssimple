/* Synthetic scripted contrast regression, NOT clinical outcome validation.
 * These fictional selections are newly authored engine fixtures; they are
 * intentionally not passed off as source-ZIP case responses or real people.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {startHypothesis,hypothesisResult,formulationPlainText} from '../../ns-hypothesis-engine.mjs';
import {INVESTIGATION_QUESTIONS} from '../../ns-hypothesis-investigation.mjs';
import {ADAPTIVE_QUESTIONS,ADAPTIVE_LIMIT,adaptiveCandidates,
 startAdaptiveInquiry,adaptiveQuestion,answerAdaptiveInquiry,adaptiveFacts,
 adaptiveChallenges,adaptiveDifferentials} from '../../ns-hypothesis-adaptive.mjs';
import {auditFormulationEvidence,evidenceCoverage} from '../../ns-hypothesis-quality.mjs';

const byOriginal=new Map(INVESTIGATION_QUESTIONS.map(q=>[q.id,q]));
const make=(core,description='')=>{
 const s=startHypothesis({trackId:'relationships',description});
 const answers=core.map(([field,answerId,verbatim=''])=>{
  const q=byOriginal.get(field);
  assert.ok(q,'Question missing: '+field);
  assert.ok(q.options.some(o=>o.id===answerId),'Invalid original answer '+field+':'+answerId);
  return {field,answerId,verbatim,questionId:'Q-NS-INVEST-'+field.toUpperCase(),
   conceptId:q.concept,layer:q.layer};
 });
 return {...s,investigation:{active:false,finished:true,answers}};
};
function run(core,replies={},description=''){
 let s=startAdaptiveInquiry(make(core,description));
 const asked=[];
 while(adaptiveQuestion(s)){
  const q=adaptiveQuestion(s),answer=replies[q.id]||'unsure';
  assert.ok(q.options.some(o=>o.id===answer),'Unknown synthetic reply '+q.id+':'+answer);
  asked.push(q.id);
  s=answerAdaptiveInquiry(s,q.questionId,answer);
  assert.ok(asked.length<=ADAPTIVE_LIMIT,'An adaptive pass exceeded its budget');
 }
 return {state:s,asked,result:hypothesisResult(s)};
}
const supports=(r,id)=>r.patterns.some(p=>p.id===id);
const challenges=(r,id)=>r.challenges.some(c=>c.id===id);

test('stage 5 scenarios preserve provenance, source wording, provisional edges and question limits',()=>{
 const scripts=[
  {id:'external-persistent',core:[['who','father'],['father_behaviour','dismissal'],['action','withdraw']],
   replies:{external_persistence:'persists'},
   check:r=>supports(r,'pattern:adaptive-external-persistent')&&challenges(r,'challenge:self-response-alone')},
  {id:'external-varies',core:[['who','father'],['father_behaviour','dismissal']],
   replies:{external_persistence:'varies'},
   check:r=>!supports(r,'pattern:adaptive-external-persistent')},
  {id:'sleep-eases',core:[['sleep','difficulty'],['capacity','high']],
   replies:{sleep_contrast:'easier'},
   check:r=>supports(r,'pattern:adaptive-capacity-sensitive')&&!challenges(r,'challenge:sleep-alone')},
  {id:'sleep-persists',core:[['sleep','difficulty'],['capacity','some']],
   replies:{sleep_contrast:'unchanged'},
   check:r=>!supports(r,'pattern:adaptive-capacity-sensitive')&&challenges(r,'challenge:sleep-alone')},
  {id:'material-eases',core:[['environment','resources']],
   replies:{external_action:'improved'},
   check:r=>supports(r,'pattern:adaptive-environment-sensitive')},
  {id:'material-persists',core:[['environment','resources']],
   replies:{external_action:'unchanged'},
   check:r=>challenges(r,'challenge:setting-alone')&&!supports(r,'pattern:adaptive-environment-sensitive')},
  {id:'stable-relief-loop',core:[['action','withdraw'],['short_term','relief'],['long_term','returns']],
   replies:{recurrent_cycle:'often'},
   check:r=>supports(r,'pattern:adaptive-possible-reinforcement')},
  {id:'unstable-relief-loop',core:[['action','withdraw'],['short_term','relief'],['long_term','returns']],
   replies:{recurrent_cycle:'different'},
   check:r=>!supports(r,'pattern:adaptive-possible-reinforcement')&&challenges(r,'challenge:recurrent-loop')},
  {id:'ordinary-preference',core:[['long_term','no_problem'],['regulation','rest']],
   replies:{protective_response:'not_problem'},
   check:r=>!supports(r,'pattern:adaptive-possible-reinforcement')},
  {id:'values-external',core:[['values_cost','relationship']],
   replies:{values_external:'external'},
   check:r=>supports(r,'pattern:adaptive-values-versus-constraints')&&challenges(r,'challenge:pure-inner-conflict')},
  {id:'only-unknowns',core:[['sleep','unsure'],['environment','prefer_not']],
   replies:{context_history:'prefer_not',safe_probe:'unsure'},
   check:r=>!r.patterns.length&&!r.challenges.length}
 ];
 for(const scenario of scripts){
  const {state,asked,result}=run(scenario.core,scenario.replies,'Fictional: '+scenario.id);
  assert.ok(scenario.check(result),scenario.id+' failed contrast criterion');
  assert.equal(new Set(asked).size,asked.length,scenario.id+' repeated a question');
  assert.equal(new Set(state.adaptive.answers.map(a=>a.conceptId)).size,
   state.adaptive.answers.length,scenario.id+' repeated a concept');
  assert.ok(auditFormulationEvidence(state,result).passed,
   scenario.id+' emitted an untraceable claim: '+JSON.stringify(auditFormulationEvidence(state,result).structuralIssues));
  assert.equal(result.notes.includes('not a diagnosis'),true);
 }
});
test('adaptive choice prioritises a real distinction ahead of static conditional order',()=>{
 const core=[['action','withdraw'],['regulation','avoid'],['short_term','relief'],['long_term','returns']];
 const replies={coping_counterfactual:'same'};
 const adaptive=run(core,replies);
 let baseline=startAdaptiveInquiry(make(core));
 const baselineAsked=[];
 for(let i=0;i<ADAPTIVE_LIMIT;i++){
  const valid=new Set(adaptiveCandidates(baseline).map(q=>q.id));
  const q=ADAPTIVE_QUESTIONS.find(q=>valid.has(q.id));
  if(!q)break;
  baselineAsked.push(q.id);
  // Simulate an equally bounded fixed-order conditional selector. This
  // intentionally avoids using the adaptive selector to choose the next step.
  baseline={...baseline,adaptive:{...baseline.adaptive,answers:[
   ...baseline.adaptive.answers,{field:q.id,questionId:q.questionId,conceptId:q.conceptId,
    layer:q.layer,answerId:replies[q.id]||'unsure',verbatim:''}
  ]}};
 }
 assert.equal(adaptive.asked[0],'coping_counterfactual');
 assert.ok(baselineAsked.indexOf('coping_counterfactual')>adaptive.asked.indexOf('coping_counterfactual'));
 assert.ok(auditFormulationEvidence(baseline,hypothesisResult(baseline)).passed);
});
test('a clear user phrase is preserved in results and export, and uncertainty is not a fact',()=>{
 const phrase='My dad says I am dramatic whenever I challenge his rules';
 const {state,result}=run([
  ['who','father'],['father_behaviour','rules','He takes my phone when I disagree'],
  ['environment','power'],['sleep','unsure']
 ],{external_persistence:'persists'},phrase);
 const audit=auditFormulationEvidence(state,result);
 assert.equal(audit.passed,true);
 assert.equal(result.graph.find(n=>n.id==='presenting').title,phrase);
 assert.match(formulationPlainText(state),/He takes my phone when I disagree/);
 assert.ok(!result.graph.some(node=>node.summary==='Sleep problems have caused this'));
 assert.equal(audit.clinicalValidityAssessed,false);
 assert.equal(evidenceCoverage(state).find(x=>x.id==='body').status,'asked_no_confirmed_detail');
});
test('adaptive risk branch interrupts the case, and no speculative diagnoses remain',()=>{
 const s=startAdaptiveInquiry(make([['who','father'],['father_behaviour','rules']]));
 assert.equal(adaptiveQuestion(s).id,'external_persistence');
 const next=answerAdaptiveInquiry(s,adaptiveQuestion(s).questionId,'unsafe');
 assert.equal(next.safety.kind,'coercion');
 assert.equal(adaptiveQuestion(next),null);
 assert.deepEqual(adaptiveChallenges(next),[]);
 assert.deepEqual(adaptiveDifferentials(next),[]);
});
