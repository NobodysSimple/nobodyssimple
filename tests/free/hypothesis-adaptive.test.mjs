import test from 'node:test';
import assert from 'node:assert/strict';
import {startHypothesis,hypothesisResult,reviewHypothesisLink,formulationPlainText} from '../../ns-hypothesis-engine.mjs';
import {INVESTIGATION_QUESTIONS,investigationFacts,startInvestigation,investigationQuestion,answerInvestigation} from '../../ns-hypothesis-investigation.mjs';
import {SYNTHETIC_MECHANISMS,ADAPTIVE_QUESTIONS,ADAPTIVE_LIMIT,startAdaptiveInquiry,adaptiveCandidates,adaptiveQuestion,answerAdaptiveInquiry,backAdaptiveInquiry,stopAdaptiveInquiry,adaptiveFacts,adaptiveLinks,adaptiveDifferentials} from '../../ns-hypothesis-adaptive.mjs';

const original=(values,description='')=>{
 const s=startHypothesis({trackId:'relationships',description});
 const byId=new Map(INVESTIGATION_QUESTIONS.map(q=>[q.id,q]));
 const answers=values.map(([field,answerId,verbatim=''])=>{
  const q=byId.get(field);
  assert.ok(q,'Unknown core field '+field);
  assert.ok(q.options.some(o=>o.id===answerId),field+' answer '+answerId);
  return {field,questionId:'Q-NS-INVEST-'+field.toUpperCase(),conceptId:q.concept,
   layer:q.layer,answerId,verbatim};
 });
 return {...s,investigation:{active:false,finished:true,answers}};
};
const next=(s,option,text='')=>{
 const q=adaptiveQuestion(s);
 assert.ok(q,'Expected an adaptive question');
 assert.ok(q.options.some(o=>o.id===option),q.id+' does not allow '+option);
 return answerAdaptiveInquiry(s,q.questionId,option,text);
};
test('uploaded mechanism catalogue is indexed without clinical probabilities',()=>{
 assert.equal(SYNTHETIC_MECHANISMS.length,72);
 assert.equal(new Set(SYNTHETIC_MECHANISMS.map(m=>m.id)).size,72);
 assert.ok(SYNTHETIC_MECHANISMS.some(m=>m.id==='actual_safety_risk'));
 assert.ok(SYNTHETIC_MECHANISMS.some(m=>m.id==='no_formulation_needed'));
 assert.ok(SYNTHETIC_MECHANISMS.every(m=>m.empiricalProbability===null&&m.status==='editorial_unvalidated'));
 assert.ok(ADAPTIVE_QUESTIONS.length>=12);
 assert.equal(new Set(ADAPTIVE_QUESTIONS.map(q=>q.conceptId)).size,ADAPTIVE_QUESTIONS.length);
 assert.ok(ADAPTIVE_QUESTIONS.every(q=>q.options.some(o=>o.id==='unsure')&&q.options.some(o=>o.id==='prefer_not')));
});
test('exact personal wording is preserved, while labels about others remain attributed interpretations',()=>{
 let s=startInvestigation(startHypothesis({trackId:'relationships',description:'I feel powerless with my dad'}));
 const first=investigationQuestion(s);
 assert.equal(first.id,'who');
 s=answerInvestigation(s,first.questionId,'father');
 const q=investigationQuestion(s);
 assert.equal(q.id,'father_label');
 s=answerInvestigation(s,q.questionId,'narcissistic','I think my dad is a narcissist');
 assert.equal(investigationFacts(s).find(f=>f.kind==='father_label').text,'I think my dad is a narcissist');
 assert.equal(investigationFacts(s).find(f=>f.kind==='father_label').status,'user_interpretation');
 const result=hypothesisResult(s);
 assert.equal(result.graph.find(n=>n.layer==='presenting').title,'I feel powerless with my dad');
 assert.ok(result.graph.find(n=>n.layer==='presenting').evidence.some(f=>f.answer==='I think my dad is a narcissist'));
});
test('actual persistence is tested against a self-blame explanation and links remain reviewable',()=>{
 let s=original([
  ['who','father'],['father_label','narcissistic'],['father_behaviour','dismissal'],
  ['event','criticism'],['emotion','anger'],['action','withdraw']
 ]);
 s=startAdaptiveInquiry(s);
 assert.equal(adaptiveQuestion(s).id,'external_persistence');
 s=next(s,'persists','He talks down to me even when I stay calm');
 const fact=adaptiveFacts(s).find(f=>f.kind==='adaptive:external_persistence');
 assert.equal(fact.text,'He talks down to me even when I stay calm');
 assert.ok(adaptiveDifferentials(s).some(r=>r.id==='pattern:adaptive-external-persistent'));
 const r=hypothesisResult(s);
 assert.ok(r.graph.some(n=>n.layer==='mechanism'&&n.title.includes('External conditions')));
 assert.ok(r.graph.find(n=>n.layer==='context').evidence.some(x=>x.answer==='He talks down to me even when I stay calm'));
 const edge=adaptiveLinks(s).find(x=>x.title.includes('Other person'));
 assert.ok(edge&&edge.status==='proposed_not_causal');
 s=reviewHypothesisLink(s,edge.id,'no-fit');
 assert.equal(hypothesisResult(s).links.find(x=>x.id===edge.id).review,'no-fit');
 assert.match(formulationPlainText(s),/He talks down to me even when I stay calm/);
});
test('sleep–capacity contrast can weaken rather than automatically confirm the sleep hypothesis',()=>{
 let s=startAdaptiveInquiry(original([['sleep','difficulty'],['capacity','some']]));
 assert.equal(adaptiveQuestion(s).id,'sleep_contrast');
 s=next(s,'unchanged');
 assert.ok(!adaptiveDifferentials(s).some(r=>r.id==='pattern:adaptive-capacity-sensitive'));
 const evidence=adaptiveFacts(s);
 assert.ok(evidence.some(f=>f.text==='It stays much the same'));
 assert.ok(hypothesisResult(s).links.some(x=>x.id==='adaptive-link:sleep-adaptive:sleep_contrast'));
});
test('uncertainty, refusal and reversible answers never become factual support',()=>{
 let s=startAdaptiveInquiry(original([['father_behaviour','dismissal']]));
 assert.equal(adaptiveQuestion(s).id,'external_persistence');
 s=next(s,'prefer_not','A private note not to be promoted to evidence');
 assert.equal(adaptiveFacts(s).length,0);
 assert.equal(adaptiveDifferentials(s).length,0);
 s=backAdaptiveInquiry(s);
 assert.equal(adaptiveQuestion(s).id,'external_persistence');
 s=next(s,'varies','It changes in certain settings');
 assert.equal(adaptiveFacts(s)[0].text,'It changes in certain settings');
 s=stopAdaptiveInquiry(s);
 assert.equal(adaptiveQuestion(s),null);
 s=startAdaptiveInquiry(s);
 assert.ok(adaptiveQuestion(s));
});
test('safety indications divert to safety-first instead of causal inference and can be revised',()=>{
 let s=startAdaptiveInquiry(original([['who','father'],['father_behaviour','rules']]));
 s=next(s,'unsafe');
 assert.equal(s.safety.kind,'coercion');
 assert.equal(adaptiveQuestion(s),null);
 assert.equal(adaptiveLinks(s).length,0);
 s=backAdaptiveInquiry(s);
 assert.equal(s.safety,null);
 assert.equal(adaptiveQuestion(s).id,'external_persistence');
});
test('questions do not repeat, are conditional and stop within eight',()=>{
 let s=startAdaptiveInquiry(original([
  ['who','father'],['father_behaviour','dismissal'],['sleep','difficulty'],
  ['capacity','high'],['environment','power'],['regulation','analyse'],
  ['short_term','relief'],['long_term','returns'],['interpretation','rejected'],
  ['action','withdraw'],['values_cost','comfort'],['event','criticism']
 ]));
 const seen=[];
 while(adaptiveQuestion(s)){
  const q=adaptiveQuestion(s);
  seen.push(q.conceptId);
  s=answerAdaptiveInquiry(s,q.questionId,'unsure');
  assert.ok(seen.length<=ADAPTIVE_LIMIT);
 }
 assert.equal(new Set(seen).size,seen.length);
 assert.ok(seen.length>=5);
 assert.equal(s.adaptive.finished,true);
 assert.equal(adaptiveCandidates(s).length,0);
});
test('a reported ordinary preference without confirmed impairment is not treated as a hidden illness',()=>{
 let s=startAdaptiveInquiry(original([['long_term','no_problem'],['regulation','rest']]));
 assert.equal(adaptiveQuestion(s).id,'protective_response');
 s=next(s,'not_problem','I do not want to change this preference');
 assert.equal(adaptiveDifferentials(s).length,0);
 assert.ok(hypothesisResult(s).graph.some(n=>n.summary.includes('I do not want to change this preference'))===false||
  adaptiveFacts(s).some(f=>f.text==='I do not want to change this preference'));
});
