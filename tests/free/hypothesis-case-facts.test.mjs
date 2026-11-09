import test from 'node:test';
import assert from 'node:assert/strict';
import {SUBTYPE_NODES,subtypeNode,beginSubtypeDrill,subtypeQuestion,answerSubtypeDrill} from '../../ns-hypothesis-subtype-atlas.mjs';
import {startHypothesis,hypothesisResult,formulationPlainText} from '../../ns-hypothesis-engine.mjs';
import {CASE_FACT_QUESTIONS,startCaseDetailInterview,caseDetailQuestion,answerCaseDetail,backCaseDetail,skipCaseDetail,caseDetailFacts} from '../../ns-hypothesis-case-facts.mjs';

function confirmLeaf(leaf){
 let drill=beginSubtypeDrill('identity');
 const cluster=subtypeNode(leaf.parent),cat=subtypeNode(cluster.parent);
 drill={...drill,categoryId:cat.id};
 for(const choice of [cluster.id,leaf.id,'yes','mostly_neutral','unsure','unclear']){
  const q=subtypeQuestion(drill);
  drill=answerSubtypeDrill(drill,q.id,choice);
 }
 return drill;
}
test('case fact questions have stable, atomic concepts and permitted answer vocabularies',()=>{
 assert.equal(CASE_FACT_QUESTIONS.length,6);
 assert.equal(new Set(CASE_FACT_QUESTIONS.map(q=>q.conceptId)).size,6);
 for(const q of CASE_FACT_QUESTIONS){
  assert.ok(q.options.length>=5,q.id);
  assert.equal(new Set(q.options.map(o=>o.id)).size,q.options.length);
  assert.ok(q.options.some(o=>o.id==='unsure'),q.id);
  assert.ok(q.options.some(o=>o.id==='prefer_not')||q.id==='goal');
 }
});
test('all 440 exact experience nodes can answer the optional structured questions',()=>{
 const leaves=SUBTYPE_NODES.filter(x=>x.level==='specific_experience');
 assert.equal(leaves.length,440);
 for(const leaf of leaves){
  let state={...startHypothesis({trackId:'identity'}),drill:confirmLeaf(leaf)};
  state=startCaseDetailInterview(state);
  assert.ok(caseDetailQuestion(state),leaf.id);
  for(const [i,expected] of CASE_FACT_QUESTIONS.entries()){
   const q=caseDetailQuestion(state);assert.ok(q,leaf.id+' detail '+i);
   assert.equal(q.conceptId,expected.conceptId);
   assert.ok(q.prompt.includes(leaf.label),leaf.id);
   state=answerCaseDetail(state,q.id,q.options[0].id);
  }
  assert.equal(state.caseDetails.finished,true,leaf.id);
  assert.equal(caseDetailFacts(state).length,6,leaf.id);
  assert.equal(new Set(caseDetailFacts(state).map(f=>f.conceptId)).size,6);
  const result=hypothesisResult(state);
  assert.ok(result.graph.find(n=>n.id==='context').evidence.some(e=>e.question==='When this became relevant'),leaf.id);
  assert.ok(result.graph.find(n=>n.id==='need').title.includes('My stated goal:'),leaf.id);
 }
});
test('unknown answers, preferences and no-impact are not converted into clinical problems',()=>{
 const leaf=SUBTYPE_NODES.find(n=>n.id==='IDENTITY-GROOMING-SHAVING-LEGS');
 let state={...startHypothesis({trackId:'identity'}),drill:confirmLeaf(leaf)};
 state=startCaseDetailInterview(state);
 const choices=['unsure','prefer_not','none','unsure','not_identified','do_not_change'];
 for(const answer of choices){
  const q=caseDetailQuestion(state);
  state=answerCaseDetail(state,q.id,answer);
 }
 const facts=caseDetailFacts(state);
 assert.deepEqual(facts.map(f=>f.kind),['impact','goal']);
 assert.equal(facts.find(f=>f.kind==='impact').text,'Not at all');
 assert.equal(facts.find(f=>f.kind==='goal').text,'I do not want to change it');
 assert.match(formulationPlainText(state),/I do not want to change it/);
 assert.doesNotMatch(hypothesisResult(state).graph.find(n=>n.id==='experience').title,/diagnos|trauma|patholog/i);
});
test('backtracking and skipping never preserve invented or withdrawn details',()=>{
 const leaf=SUBTYPE_NODES.find(n=>n.id==='IDENTITY-GROOMING-SHAVING-LEGS');
 let state={...startHypothesis({trackId:'identity'}),drill:confirmLeaf(leaf)};
 state=startCaseDetailInterview(state);
 state=answerCaseDetail(state,caseDetailQuestion(state).id,'months_or_longer');
 assert.equal(caseDetailFacts(state).length,1);
 state=backCaseDetail(state);
 assert.equal(caseDetailFacts(state).length,0);
 assert.equal(caseDetailQuestion(state).field,'timeframe');
 state=skipCaseDetail(state);
 assert.equal(caseDetailQuestion(state),null);
 assert.equal(caseDetailFacts(state).length,0);
});
test('safety-first and non-confirmed branches cannot enter the deeper fact interview',()=>{
 const risk=startHypothesis({trackId:'emotion',description:'I want to harm myself tonight'});
 assert.equal(startCaseDetailInterview(risk),risk);
 const notConfirmed=startHypothesis({trackId:'identity'});
 assert.equal(startCaseDetailInterview(notConfirmed),notConfirmed);
});
