import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEEP_PROCESSES,DEEP_QUESTIONS,DEEP_BY_ID,EXTRA_BY_TRACK,isPresentationQuery,presentationBranchActive} from '../../ns-hypothesis-deep-content.mjs';
import {GRAPH_LAYERS,graphCoverage,buildFormulationGraph,editGraphNode,layerQuestionTags} from '../../ns-hypothesis-graph.mjs';
import {
 TRACK_BY_ID,PROCESS_BY_ID,QUESTION_BY_ID,QUESTION_BY_ID as ALL_QUESTIONS,HYPOTHESIS_LIMIT,
 HYPOTHESIS_DEEP_QUESTION_COUNT,HYPOTHESIS_PROCESS_COUNT,
 startHypothesis,nextHypothesisQuestion,questionPool,answerHypothesis,
 hypothesisResult,rankedHypotheses,reviseHypothesisAnswer,
 focusHypothesisLayer,reviseHypothesisNode,formulationPlainText
} from '../../ns-hypothesis-engine.mjs';
const answer=(s,id,value='yes')=>answerHypothesis(s,id,value);
test('added content is original, broad and structurally validated without inventing probabilities',()=>{
 assert.ok(DEEP_QUESTIONS.length>=125);
 assert.ok(DEEP_PROCESSES.length>=35);
 assert.ok(HYPOTHESIS_PROCESS_COUNT>=55);
 assert.ok(HYPOTHESIS_DEEP_QUESTION_COUNT>=125);
 assert.ok(HYPOTHESIS_LIMIT>=165);
 assert.equal(new Set(DEEP_QUESTIONS.map(q=>q.id)).size,DEEP_QUESTIONS.length);
 assert.equal(new Set(DEEP_PROCESSES.map(p=>p.id)).size,DEEP_PROCESSES.length);
 for(const q of DEEP_QUESTIONS){
  assert.ok(q.prompt.endsWith('?'),q.id);
  assert.ok(q.why.length>=35,q.id);
  assert.ok(q.tags.length>0,q.id);
  assert.ok(q.tracks.length>0,q.id);
  for(const t of q.tracks)assert.ok(TRACK_BY_ID[t],q.id+' '+t);
  for(const [id,val] of Object.entries(q.signals)){
   assert.ok(PROCESS_BY_ID[id],q.id+' '+id);
   assert.ok(Math.abs(val)<=2&&Number.isFinite(val),q.id+' '+id);
  }
  assert.equal(QUESTION_BY_ID[q.id],q);
 }
 for(const p of DEEP_PROCESSES){
  for(const t of p.tracks)assert.ok(TRACK_BY_ID[t],p.id+' '+t);
  assert.ok(p.check.endsWith('?'),p.id);
  assert.ok(p.need.length>20,p.id);
  assert.match(p.link,/^#workbook(?:-topic)?\//,p.id);
 }
 assert.ok(GRAPH_LAYERS.length>=8);
});
test('gender-expression case opens an independent nuanced presentation branch, without assigning identity from appearance',()=>{
 const desc='I enjoy shaving my legs but I am not sure what this means about me as a man';
 assert.ok(isPresentationQuery(desc));
 let state=startHypothesis({trackId:'identity',description:desc});
 assert.equal(nextHypothesisQuestion(state)?.id,'d-id-presentation');
 state=answer(state,'d-id-presentation','yes');
 assert.equal(presentationBranchActive(state),true);
 const eligible=questionPool(state);
 assert.ok(eligible.some(q=>q.id==='d-id-alone'));
 assert.ok(eligible.some(q=>q.id==='d-id-sexual'));
 assert.ok(eligible.some(q=>q.id==='d-id-identity-question'));
 assert.ok(eligible.some(q=>q.id==='d-id-social-rules'));
 assert.ok(eligible.some(q=>q.id==='d-id-sensory'));
 state=answer(state,'d-id-alone','yes');
 state=answer(state,'d-id-felt','yes');
 state=answer(state,'d-id-social-rules','yes');
 state=answer(state,'d-id-identity-question','no');
 state=answer(state,'d-id-outside-sex','yes');
 state=answer(state,'d-id-sensory','yes');
 const r=hypothesisResult(state);
 assert.equal(r.track.id,'identity');
 assert.ok(r.alternatives.some(c=>['expression','gender-rules','appearance-comfort'].includes(c.id)));
 assert.ok(r.graph.find(n=>n.id==='presenting').title.includes('shaving my legs'));
 assert.ok(r.graph.some(n=>n.layer==='tension'));
 assert.doesNotMatch(formulationPlainText(state),/\b\d+(?:\.\d+)?%|\bdiagnosed\b|\byou are transgender\b/i);
});
test('question selection continues beyond nine whenever distinctions remain; there is no arbitrary fixed ending',()=>{
 let state=startHypothesis({trackId:'identity',description:'I enjoy grooming and I am unsure how other people interpret it'});
 const asked=new Set();
 for(let i=0;i<22;i++){
  const q=nextHypothesisQuestion(state);assert.ok(q,'expected question '+(i+1));
  assert.ok(!asked.has(q.id),'repeated '+q.id);
  asked.add(q.id);
  state=answer(state,q.id,q.flag?'no':i%3===0?'probably':'yes');
 }
 assert.ok(state.answers.length>=20);
 assert.ok(nextHypothesisQuestion(state),'should still be able to investigate');
 assert.equal(new Set(state.answers.map(a=>a.questionId)).size,state.answers.length);
 assert.ok(graphCoverage(state,ALL_QUESTIONS).total>=20);
});
test('uncertainty stays uncertainty: no weighted answer signals become a clinical probability',()=>{
 let state=startHypothesis({trackId:'identity'});
 for(let i=0;i<17;i++){
  const q=nextHypothesisQuestion(state);if(!q)break;
  state=answer(state,q.id,'unsure');
 }
 const r=hypothesisResult(state);
 assert.equal(r.examined,0);
 assert.equal(r.unresolved,true);
 assert.equal(r.coverage.canDraft,false);
 assert.ok(r.graph.find(n=>n.id==='function').status==='unknown');
 assert.ok(r.alternatives.every(x=>x.positive.length===0));
});
test('editing one graph part preserves corrections and allows focused further questions',()=>{
 let state=startHypothesis({trackId:'identity',description:'I like changing my appearance'});
 const answers=[
  ['d-id-presentation','yes'],['d-id-alone','yes'],
  ['d-id-social-rules','yes'],['d-id-identity-question','no'],
  ['d-id-outside-sex','yes'],['d-id-felt','yes']];
 for(const [q,a] of answers)state=answer(state,q,a);
 const result=hypothesisResult(state);
 const mechanism=result.graph.find(n=>n.id.startsWith('mechanism:'));
 assert.ok(mechanism);
 const updated=reviseHypothesisNode(state,mechanism.id,{
  verdict:'no-fit',text:'My grooming is a private aesthetic preference',revisit:true});
 const graph=hypothesisResult(updated).graph;
 assert.ok(graph.some(n=>n.id===mechanism.id),'rejected node remains in graph for review');
 const selected=graph.find(n=>n.id===mechanism.id);
 assert.equal(selected.review,'no-fit');
 assert.match(selected.summary,/private aesthetic preference/);
 assert.equal(updated.answers.length,state.answers.length);
 const focused=focusHypothesisLayer(updated,'context');
 assert.equal(focused.focusLayer,'context');
 assert.ok(nextHypothesisQuestion(focused));
 assert.ok(layerQuestionTags('context').includes('context'));
 const raw=editGraphNode(state,'need',{text:'Time without pressure',verdict:'fits'});
 assert.equal(raw.nodeEdits.need.text,'Time without pressure');
});
test('editing a gateway answer discards only now-inapplicable presentation questions',()=>{
 let state=startHypothesis({trackId:'identity'});
 state=answer(state,'d-id-presentation','yes');
 state=answer(state,'d-id-alone','probably');
 state=answer(state,'d-id-felt','yes');
 state=answer(state,'d-id-role','yes');
 assert.equal(state.answers.length,4);
 const changed=reviseHypothesisAnswer(state,'d-id-presentation','no');
 assert.equal(presentationBranchActive(changed),false);
 assert.ok(!changed.answers.some(a=>a.questionId==='d-id-alone'));
 assert.ok(!changed.answers.some(a=>a.questionId==='d-id-felt'));
 assert.ok(changed.answers.some(a=>a.questionId==='d-id-role'),'other answers survive revision');
 assert.ok(changed.answers.some(a=>a.questionId==='d-id-presentation'));
});
test('specialised questions cover every starting area, and safety gates remain active',()=>{
 for(const t of Object.keys(TRACK_BY_ID)){
  assert.ok((EXTRA_BY_TRACK[t]||[]).length>=1,t);
  assert.ok(DEEP_QUESTIONS.filter(q=>q.tracks.includes(t)).length>=9,t);
  const q=questionPool(startHypothesis({trackId:t}));
  assert.ok(q.length>=13,t);
 }
 const risk=startHypothesis({trackId:'identity',description:'I want to hurt myself tonight'});
 assert.ok(risk.safety);
 assert.equal(nextHypothesisQuestion(risk),null);
 const unsafe=answer(startHypothesis({trackId:'relationships'}),'unsafe','yes');
 assert.equal(unsafe.safety.kind,'coercion');
 assert.equal(nextHypothesisQuestion(unsafe),null);
});
test('actual UI includes narrative entry, clickable graph, individual correction and question history',()=>{
 const ui=readFileSync('ns-hypothesis-generator.mjs','utf8');
 const css=readFileSync('ns-hypothesis-depth.css','utf8');
 const index=readFileSync('index.html','utf8');
 const sw=readFileSync('sw.js','utf8');
 assert.match(ui,/data-hypo-from-description/);
 assert.match(ui,/data-hypo-node="/);
 assert.match(ui,/data-hypo-node-verdict/);
 assert.match(ui,/data-hypo-node-investigate/);
 assert.match(ui,/data-hypo-answer-edit/);
 assert.match(ui,/data-hypo-save-answer/);
 assert.match(ui,/No fixed question limit/);
 assert.match(ui,/data-hypo-node-save/);
 assert.match(ui,/ns-hypo-graph-branches/);
 assert.match(css,/ns-hypo-graph-node/);
 assert.match(index,/ns-hypothesis-depth.css/);
 assert.match(sw,/ns-hypothesis-deep-content.mjs/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|sendBeacon|fetch\(/);
});
