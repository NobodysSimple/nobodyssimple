import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 TRACK_DRILL_CATEGORY,SUBTYPE_COUNTS,SUBTYPE_NODES,subtypeNode,subtypeChildren,
 beginSubtypeDrill,subtypeStage,subtypeQuestion,answerSubtypeDrill,
 drillFacts,detailLabel
} from '../../ns-hypothesis-subtype-atlas.mjs';
import {
 startHypothesis,answerHypothesisDrill,skipHypothesisDrill,backHypothesisDrill,hypothesisResult
} from '../../ns-hypothesis-engine.mjs';

const pick=(drill,value)=>{
 const q=subtypeQuestion(drill);
 assert.ok(q,'expected an authored question');
 assert.ok(q.options.some(o=>o.id===value),q.id+' does not allow '+value);
 return answerSubtypeDrill(drill,q.id,value);
};
test('exact source-atlas subtype count, IDs, tree depth and parent relationships',()=>{
 assert.deepEqual(SUBTYPE_COUNTS,{categories:21,clusters:84,experiences:440});
 assert.equal(SUBTYPE_NODES.length,545);
 assert.equal(new Set(SUBTYPE_NODES.map(n=>n.id)).size,545);
 assert.equal(subtypeChildren('ROOT').length,21);
 for(const n of SUBTYPE_NODES){
  assert.ok(n.label.length>=3,n.id);
  assert.equal(n.clinicallyValidated,false,n.id);
  if(n.level==='category')assert.equal(n.parent,null);
  else{
   assert.ok(subtypeNode(n.parent),n.id+' has unknown parent');
   assert.ok(subtypeChildren(n.parent).some(x=>x.id===n.id),n.id+' missing from parent');
  }
 }
 assert.equal(SUBTYPE_NODES.filter(n=>n.level==='category').length,21);
 assert.equal(SUBTYPE_NODES.filter(n=>n.level==='cluster').length,84);
 assert.equal(SUBTYPE_NODES.filter(n=>n.level==='specific_experience').length,440);
 for(const [track,category] of Object.entries(TRACK_DRILL_CATEGORY))
  assert.equal(beginSubtypeDrill(track).categoryId,category);
});
test('every one of 440 exact experiences can be selected in a valid question flow',()=>{
 for(const n of SUBTYPE_NODES.filter(n=>n.level==='specific_experience')){
  const cluster=subtypeNode(n.parent),category=subtypeNode(cluster.parent);
  let d={...beginSubtypeDrill('identity'),categoryId:category.id};
  d=pick(d,cluster.id);
  d=pick(d,n.id);
  assert.equal(subtypeStage(d),'confirm',n.id);
  d=pick(d,'yes');
  assert.equal(subtypeStage(d),'valence',n.id);
  d=pick(d,'mostly_neutral');
  d=pick(d,'unsure');
  d=pick(d,'unclear');
  assert.equal(d.finished,true,n.id);
  const facts=drillFacts(d);
  assert.equal(facts[0].value,n.id);
  assert.ok(facts.every(f=>f.source==='user_selection'));
  assert.ok(facts.some(f=>f.kind==='valence'));
  assert.ok(!facts.some(f=>f.kind==='meaning'||f.kind==='context'),'uncertain specifics are not established');
  assert.equal(new Set(d.events.map(x=>x.questionId)).size,d.events.length);
 }
});
test('the shaving-legs path preserves exactly what was endorsed, no inferred identity or trauma',()=>{
 let s=startHypothesis({trackId:'identity'});
 assert.equal(subtypeStage(s.drill),'cluster');
 for(const answer of ['IDENTITY-GROOMING','IDENTITY-GROOMING-SHAVING-LEGS','yes','mostly_enjoyable','social_expectation','with_other_people']){
  const q=subtypeQuestion(s.drill);
  s=answerHypothesisDrill(s,q.id,answer);
 }
 assert.equal(s.drill.finished,true);
 assert.equal(subtypeNode(s.drill.leafId).label,'shaving legs');
 const result=hypothesisResult(s);
 assert.equal(result.graph.find(x=>x.id==='presenting').title,'shaving legs');
 assert.equal(result.graph.find(x=>x.id==='context').title,'With other people');
 assert.match(result.graph.find(x=>x.id==='experience').title,/Mostly enjoyable/);
 assert.match(result.graph.find(x=>x.id==='experience').title,/Other people’s expectations/);
 assert.ok(!result.graph.some(x=>/you are (transgender|gay|bisexual)|attachment wound|childhood trauma/i.test(x.title)));
 assert.ok(result.graph.find(x=>x.id==='presenting').evidence.some(x=>x.answer==='shaving legs'));
 assert.equal(s.answers.length,0,'the separate original adaptive interview has not started yet');
});
test('unknown, refusal and abandoned subtype branches never become user-reported facts',()=>{
 let d=beginSubtypeDrill('identity');
 d=pick(d,'IDENTITY-GROOMING');
 d=pick(d,'IDENTITY-GROOMING-SHAVING-LEGS');
 d=pick(d,'unsure');
 assert.equal(d.finished,true);
 assert.equal(drillFacts(d).length,0);
 const state=startHypothesis({trackId:'procrastination'});
 const skipped=skipHypothesisDrill(state);
 assert.equal(skipped.drill.finished,true);
 assert.deepEqual(drillFacts(skipped.drill),[]);
 let another=beginSubtypeDrill('identity');
 another=pick(another,'something_else');
 assert.equal(another.finished,true);
 assert.deepEqual(drillFacts(another),[]);
 assert.equal(detailLabel('meaning','social_expectation'),'Other people’s expectations');
});
test('back button safely replays authored interview questions rather than retaining deleted details',()=>{
 let s=startHypothesis({trackId:'identity'});
 for(const choice of ['IDENTITY-GROOMING','IDENTITY-GROOMING-SHAVING-LEGS','yes','mostly_enjoyable']){
  s=answerHypothesisDrill(s,subtypeQuestion(s.drill).id,choice);
 }
 assert.equal(subtypeStage(s.drill),'meaning');
 s=backHypothesisDrill(s);
 assert.equal(subtypeStage(s.drill),'valence');
 assert.ok(!drillFacts(s.drill).some(f=>f.kind==='valence'));
 s=backHypothesisDrill(s);
 assert.equal(subtypeStage(s.drill),'confirm');
 assert.equal(drillFacts(s.drill).length,0);
});
test('concerning physical signs interrupt psychological guessing with medical guidance',()=>{
 let s=startHypothesis({trackId:'fatigue'});
 s=answerHypothesisDrill(s,subtypeQuestion(s.drill).id,'HEALTH-ALARM');
 assert.equal(s.safety?.kind,'medical');
 assert.equal(s.drill.clusterId,'HEALTH-ALARM');
 s=backHypothesisDrill(s);
 assert.equal(s.safety,null);
 assert.equal(subtypeStage(s.drill),'cluster');
});
test('static site has isolated client-only navigation data, no fabricated probabilistic learning',()=>{
 const source=readFileSync('ns-hypothesis-subtype-atlas.mjs','utf8');
 const ui=readFileSync('ns-hypothesis-generator.mjs','utf8');
 assert.match(ui,/data-hypo-drill-answer/);
 assert.match(ui,/data-hypo-drill-skip/);
 assert.match(ui,/ns-hypo-drill-options/);
 assert.doesNotMatch(source,/localStorage|sessionStorage|fetch\(|sendBeacon|XMLHttpRequest/);
 assert.doesNotMatch(source.replace(/\/\*[\s\S]*?\*\//g,''),/26[,_]?377|trained_probability|Bayesian.*confidence/i);
});
