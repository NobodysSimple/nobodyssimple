import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasGet,isSafetyPriority} from '../../ns-atlas-core.mjs';
import {
 FORMULATION_PROCESSES,PROCESS_BY_ID,HYPOTHESIS_TRACKS,TRACK_BY_ID,QUESTIONS,QUESTION_BY_ID,
 ANSWER_OPTIONS,HYPOTHESIS_LIMIT,questionPool,startHypothesis,nextHypothesisQuestion,
 answerHypothesis,backHypothesis,rankedHypotheses,hypothesisResult,describeFormulation,
 formulationPlainText,findHypothesisTrack,selectableAtlasTopics,reviewHypothesis
} from '../../ns-hypothesis-engine.mjs';

function advance(state,n=HYPOTHESIS_LIMIT,answer='yes'){
 let s=state;
 for(let i=0;i<n;i++){
  const q=nextHypothesisQuestion(s);
  if(!q)break;
  s=answerHypothesis(s,q.id,answer);
  if(s.safety)break;
 }
 return s;
}
test('original mechanism bank has broad contextual, social, behavioural and cognitive hypotheses',()=>{
 assert.equal(HYPOTHESIS_TRACKS.length,12);
 assert.ok(FORMULATION_PROCESSES.length>=20);
 assert.ok(QUESTIONS.length>=35);
 for(const p of FORMULATION_PROCESSES){
  assert.ok(p.title.length>5,p.id);
  assert.ok(p.description.length>30,p.id);
  assert.ok(p.possibleFunction.length>30,p.id);
  assert.ok(p.possibleCost.length>20,p.id);
  assert.ok(p.need.length>15,p.id);
  assert.ok(p.check.length>20,p.id);
  assert.match(p.link,/^#workbook(?:-topic)?\//,p.id);
 }
 for(const t of HYPOTHESIS_TRACKS){
  assert.ok(t.processes.length>=5,t.id);
  assert.ok(t.processes.every(p=>PROCESS_BY_ID[p]),t.id);
  assert.ok(t.art.startsWith('ns-character-'));
  assert.ok(questionPool(startHypothesis({trackId:t.id})).length>=6,t.id);
 }
 assert.ok(PROCESS_BY_ID.health,'physical/medical influences must be explicit');
 assert.ok(PROCESS_BY_ID.environment,'access barriers must be explicit');
 assert.ok(PROCESS_BY_ID.power,'real pressure must be explicit');
});
test('all question relationships and five possible responses are valid',()=>{
 assert.deepEqual(ANSWER_OPTIONS.map(a=>a.id),['yes','probably','unsure','probably-not','no']);
 for(const q of QUESTIONS){
  assert.ok(q.prompt.endsWith('?'),q.id);
  assert.ok(q.why.length>=25,q.id);
  assert.ok(Object.keys(q.signals).length>=1,q.id);
  for(const [id,value] of Object.entries(q.signals)){
   assert.ok(PROCESS_BY_ID[id],q.id+' references unknown hypothesis '+id);
   assert.ok(Number.isFinite(value)&&Math.abs(value)<=2,q.id);
  }
  assert.ok(q.tracks.every(x=>TRACK_BY_ID[x]),q.id+' bad route');
 }
 assert.equal(new Set(QUESTIONS.map(q=>q.id)).size,QUESTIONS.length);
});
test('questions adapt to the first area and do not repeat within a single session',()=>{
 for(const t of HYPOTHESIS_TRACKS){
  let s=startHypothesis({trackId:t.id});
  const q=nextHypothesisQuestion(s);
  assert.ok(q,t.id);
  assert.ok(q.tracks.length===0||q.tracks.includes(t.id),t.id);
  const seen=new Set();
  for(let i=0;i<HYPOTHESIS_LIMIT;i++){
   const current=nextHypothesisQuestion(s);if(!current)break;
   assert.ok(!seen.has(current.id),t.id+' repeated '+current.id);
   seen.add(current.id);
   s=answerHypothesis(s,current.id,'no');
   if(s.safety)break;
  }
  assert.ok(seen.size>=5,t.id+' yielded too few discriminating questions');
  assert.ok(s.answers.length<=HYPOTHESIS_LIMIT);
 }
 assert.equal(nextHypothesisQuestion(startHypothesis({trackId:'procrastination'})).id,'first');
 assert.equal(nextHypothesisQuestion(startHypothesis({trackId:'overthinking'})).id,'certainty');
 assert.equal(nextHypothesisQuestion(startHypothesis({trackId:'sleep'})).id,'external-sleep');
});
test('same surface difficulty can support different provisional explanations based on responses',()=>{
 let a=startHypothesis({trackId:'procrastination'});
 a=answerHypothesis(a,'judge','yes');
 a=answerHypothesis(a,'badself','yes');
 a=answerHypothesis(a,'first','no');
 const candidatesA=rankedHypotheses(a);
 assert.equal(candidatesA[0].id,'evaluation');
 let b=startHypothesis({trackId:'procrastination'});
 b=answerHypothesis(b,'first','yes');
 b=answerHypothesis(b,'private','yes');
 b=answerHypothesis(b,'judge','no');
 assert.ok(['ambiguity','attention'].includes(rankedHypotheses(b)[0].id));
 assert.notEqual(rankedHypotheses(b)[0].id,candidatesA[0].id);
 assert.ok(describeFormulation(a,candidatesA[0]).observations.length>=1);
});
test('uncertain and contradictory observations do not turn into fake clinical probabilities',()=>{
 const s=advance(startHypothesis({trackId:'overthinking'}),HYPOTHESIS_LIMIT,'unsure');
 const r=hypothesisResult(s);
 assert.equal(r.examined,0);
 assert.equal(r.unresolved,true);
 assert.equal(r.alternatives.length,3);
 assert.match(r.summary,/not enough/i);
 assert.doesNotMatch(formulationPlainText(s),/\d+%|diagnosed with|you have a disorder/i);
 assert.ok(r.alternatives.every(c=>c.positive.length===0));
});
test('changing answers and giving feedback revises ranking without rewriting evidence',()=>{
 let s=startHypothesis({trackId:'procrastination'});
 s=answerHypothesis(s,'first','yes');
 s=answerHypothesis(s,'judge','no');
 const before=s.answers.length;
 const top=rankedHypotheses(s)[0];
 const edited=reviewHypothesis(s,top.id,'no-fit');
 assert.equal(edited.answers.length,before);
 assert.equal(edited.feedback[top.id],'no-fit');
 assert.equal(rankedHypotheses(edited,100).find(c=>c.id===top.id).score,top.score);
 const back=backHypothesis(s);
 assert.equal(back.answers.length,before-1);
 assert.equal(back.safety,null);
 const unknown=answerHypothesis(s,'does-not-exist','yes');
 assert.deepEqual(unknown,s);
});
test('safety-first topics and self-disclosure stop the ordinary formulation path',()=>{
 const crisis=startHypothesis({trackId:'emotion',topicId:'suicidal-thoughts'});
 assert.ok(crisis.safety);
 assert.equal(nextHypothesisQuestion(crisis),null);
 const unsafe=startHypothesis({trackId:'relationships'});
 const after=answerHypothesis(unsafe,'unsafe','yes');
 assert.equal(after.safety.kind,'coercion');
 assert.equal(nextHypothesisQuestion(after),null);
 const no=answerHypothesis(unsafe,'unsafe','no');
 assert.equal(no.safety,null);
 let sleep=startHypothesis({trackId:'sleep'});
 sleep=answerHypothesis(sleep,'medical-sleep','yes');
 assert.equal(sleep.safety.kind,'medical');
 assert.equal(nextHypothesisQuestion(sleep),null);
 assert.equal(nextHypothesisQuestion(backHypothesis(sleep))?.id,'external-sleep');
});
test('named atlas topics link to genuine site routes; unsupported topics are not falsely matched',()=>{
 for(const raw of ['I procrastinate','I overthink','My relationship worries me','I cannot sleep']){
  assert.ok(findHypothesisTrack(raw),raw);
 }
 assert.equal(findHypothesisTrack('an unrecognised experience with no matching category'),null);
 const found=selectableAtlasTopics('insomnia');
 assert.ok(found.some(p=>p.id==='insomnia'));
 assert.ok(found.every(p=>atlasGet(p.id)&&!isSafetyPriority(p.id)));
 const checking=startHypothesis({trackId:'checking',topicId:'checking'});
 assert.equal(hypothesisResult(checking).topic,'checking');
 for(const process of FORMULATION_PROCESSES){
  const href=process.link;
  if(href.startsWith('#workbook-topic/'))assert.ok(atlasGet(href.slice('#workbook-topic/'.length)),href);
 }
});
test('retired generator is absent from app navigation while source remains preserved',()=>{
 const site=readFileSync('site.mjs','utf8');
 const home=readFileSync('strategy.mjs','utf8');
 const html=readFileSync('index.html','utf8');
 const css=readFileSync('ns-hypothesis-generator.css','utf8');
 const ui=readFileSync('ns-hypothesis-generator.mjs','utf8');
 const sw=readFileSync('sw.js','utf8');
 assert.doesNotMatch(site,/hypothesis: \(\) => renderHypothesisGenerator/);
 assert.doesNotMatch(site,/import \{renderHypothesisGenerator\}/);
 assert.doesNotMatch(home,/ns-home-hypothesis|href="#hypothesis"/);
 assert.doesNotMatch(html,/ns-hypothesis-generator.css/);
 assert.match(css,/ns-home-hypothesis/);
 assert.match(ui,/data-hypo-answer/);
 assert.match(ui,/data-hypo-feedback/);
 assert.match(ui,/data-hypo-download/);
 assert.match(ui,/data-hypo-back/);
 assert.match(ui,/data-hypo-skip/);
 assert.match(ui,/ns-hypo-safety-page/);
 assert.match(sw,/ns-hypothesis-engine.mjs/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|sendBeacon|fetch\(/);
 assert.doesNotMatch(ui,/OpenAkinator|Akinator|genie|guess your character/i);
});
