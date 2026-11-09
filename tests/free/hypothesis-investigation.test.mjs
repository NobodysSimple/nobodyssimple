import test from 'node:test';
import assert from 'node:assert/strict';
import {startHypothesis,hypothesisResult,reviewHypothesisLink,formulationPlainText} from '../../ns-hypothesis-engine.mjs';
import {INVESTIGATION_QUESTIONS,investigationQuestion,investigationCandidates,startInvestigation,answerInvestigation,backInvestigation,stopInvestigation,investigationFacts,investigationLinks} from '../../ns-hypothesis-investigation.mjs';

const answer=(s,choice)=>{
 const q=investigationQuestion(s);
 assert.ok(q,'Expected another investigation question for '+choice);
 assert.ok(q.options.some(o=>o.id===choice),q.id+' does not allow '+choice);
 return answerInvestigation(s,q.questionId,choice);
};
test('question bank investigates sequence, sleep, coping, context, alternative causes and values',()=>{
 assert.equal(INVESTIGATION_QUESTIONS.length,19);
 assert.equal(new Set(INVESTIGATION_QUESTIONS.map(q=>q.id)).size,19);
 assert.equal(new Set(INVESTIGATION_QUESTIONS.map(q=>q.concept)).size,19);
 for(const q of INVESTIGATION_QUESTIONS){
  assert.ok(q.why.length>30,q.id);
  assert.ok(q.prompt.endsWith('?'),q.id);
  assert.ok(q.options.some(o=>o.id==='unsure')&&q.options.some(o=>o.id==='other'));
  assert.ok(q.options.some(o=>o.id==='prefer_not'));
 }
});
test('relationship investigation distinguishes an attributed narcissism label from independently selected observed conduct',()=>{
 let s=startInvestigation(startHypothesis({trackId:'relationships'}));
 s=answer(s,'father');
 assert.equal(investigationQuestion(s).id,'father_label');
 s=answer(s,'narcissistic');
 s=answer(s,'dismissal');
 s=answer(s,'criticism');
 s=answer(s,'anger');
 s=answer(s,'unfair');
 s=answer(s,'withdraw');
 s=answer(s,'avoid');
 s=answer(s,'relief');
 s=answer(s,'returns');
 const facts=investigationFacts(s);
 assert.equal(facts.find(x=>x.kind==='father_label').text,'I describe my dad as narcissistic');
 assert.equal(facts.find(x=>x.kind==='father_label').status,'user_interpretation');
 assert.equal(facts.find(x=>x.kind==='father_behaviour').text,'He dismisses or belittles what I say');
 const graph=hypothesisResult(s).graph;
 assert.match(graph.find(x=>x.id==='presenting').title,/I describe my dad as narcissistic/);
 assert.match(graph.find(x=>x.id==='context').title,/He dismisses or belittles/);
 assert.match(graph.find(x=>x.id==='response').title,/withdrew/);
 assert.match(graph.find(x=>x.id==='function').title,/relief/);
 assert.match(graph.find(x=>x.id==='cost').title,/comes back/);
 const links=investigationLinks(s);
 assert.ok(links.some(x=>x.fromText==='I withdrew, became quiet or left'&&x.toText==='I feel some relief or safety'));
 assert.ok(links.every(x=>x.status==='proposed_not_causal'));
 const chosen=links[0];
 s=reviewHypothesisLink(s,chosen.id,'no-fit');
 assert.equal(hypothesisResult(s).links.find(x=>x.id===chosen.id).review,'no-fit');
 assert.match(formulationPlainText(s),/Potential links to TEST/);
});
test('investigation includes differential testing even when there is no identifiable person',()=>{
 let s=startInvestigation(startHypothesis({trackId:'procrastination'}));
 const responses=['uncertainty','shame','inadequate','delay','analyse','relief','returns',
  'difficulty','some','expectations','clarity','no_cost','competence','comfort','skills','information'];
 for(const choice of responses)s=answer(s,choice);
 assert.equal(s.investigation.finished,true);
 assert.equal(investigationQuestion(s),null);
 const graph=hypothesisResult(s).graph;
 assert.match(graph.find(x=>x.id==='context').title,/did not know what would happen/i);
 assert.match(graph.find(x=>x.id==='response').title,/put off a task/i);
 assert.ok(investigationLinks(s).some(x=>x.title.includes('Sleep and capacity')));
});
test('not sure, other and refusals do not become asserted observations or clinical hypotheses',()=>{
 let s=startInvestigation(startHypothesis({trackId:'identity'}));
 for(let i=0;i<8;i++){
  const q=investigationQuestion(s);
  if(!q)break;
  s=answer(s,i%2===0?'unsure':'prefer_not');
 }
 assert.equal(investigationFacts(s).length,0);
 assert.equal(investigationLinks(s).length,0);
});
test('back, stop and resume do not duplicate questions or silently learn',()=>{
 let s=startInvestigation(startHypothesis({trackId:'relationships'}));
 s=answer(s,'partner');
 const first=investigationQuestion(s).id;
 s=answer(s,'criticism');
 s=backInvestigation(s);
 assert.equal(investigationQuestion(s).id,first);
 s=answer(s,'demand');
 s=stopInvestigation(s);
 assert.equal(investigationQuestion(s),null);
 s=startInvestigation(s);
 assert.ok(investigationQuestion(s));
 assert.equal(new Set(s.investigation.answers.map(x=>x.conceptId)).size,s.investigation.answers.length);
 assert.equal(s.investigation.answers.length,2);
});
test('intimidation prompts safety-first before an automated psychological formulation',()=>{
 let s=startInvestigation(startHypothesis({trackId:'relationships'}));
 s=answer(s,'father');
 s=answer(s,'controlling');
 s=answer(s,'intimidation');
 assert.equal(s.safety.kind,'coercion');
 assert.equal(investigationQuestion(s),null);
 s=backInvestigation(s);
 assert.equal(s.safety,null);
 assert.equal(investigationQuestion(s).id,'father_behaviour');
});
