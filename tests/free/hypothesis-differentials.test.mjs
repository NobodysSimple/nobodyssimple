import test from 'node:test';
import assert from 'node:assert/strict';
import {startHypothesis,hypothesisResult} from '../../ns-hypothesis-engine.mjs';
import {startInvestigation,investigationQuestion,answerInvestigation} from '../../ns-hypothesis-investigation.mjs';
import {DIFFERENTIAL_RULES,testableDifferentials} from '../../ns-hypothesis-differentials.mjs';
import {startCaseDetailInterview,caseDetailQuestion,answerCaseDetail} from '../../ns-hypothesis-case-facts.mjs';
import {beginSubtypeDrill,subtypeQuestion,answerSubtypeDrill} from '../../ns-hypothesis-subtype-atlas.mjs';

const make=(track='procrastination')=>startInvestigation(startHypothesis({trackId:track}));
const step=(s,choice)=>{const q=investigationQuestion(s);assert.ok(q);assert.ok(q.options.some(o=>o.id===choice),q.id+' lacks '+choice);return answerInvestigation(s,q.questionId,choice);};
const by=(s,id)=>{while(investigationQuestion(s)&&investigationQuestion(s).id!==id){
 const q=investigationQuestion(s);
 s=answerInvestigation(s,q.questionId,'unsure');
 }return s;};
test('twelve differential patterns are multi-evidence hypotheses, not a diagnostic classifier',()=>{
 assert.equal(DIFFERENTIAL_RULES.length,12);
 for(const p of DIFFERENTIAL_RULES){
  assert.ok(Object.keys(p.requires).length>=1,p.id);
  assert.ok(p.falsifier.length>=40,p.id);
  assert.ok(p.alternative.length>=30,p.id);
 }
 assert.deepEqual(testableDifferentials(make()),[]);
});
test('withdrawal, relief and continuing difficulty yields a testable temporary-relief process',()=>{
 let s=make('relationships');
 for(const [id,choice] of [['who','partner'],['event','criticism'],['emotion','shame'],['interpretation','rejected'],
  ['action','withdraw'],['regulation','avoid'],['short_term','relief'],['long_term','returns']]){
  s=by(s,id);s=step(s,choice);
 }
 const p=testableDifferentials(s);
 assert.ok(p.some(x=>x.id==='pattern:relief-return'));
 assert.ok(p.some(x=>x.id==='pattern:social-approval'));
 assert.ok(p.every(x=>x.status==='testable_not_established'));
 const report=hypothesisResult(s);
 assert.equal(report.alternatives.length,0,'No generic ranking without original interview answers');
 assert.ok(report.patterns.some(p=>p.id==='pattern:relief-return'));
 const g=report.graph;
 const node=g.find(x=>x.id==='pattern:relief-return');
 assert.ok(node&&node.detail.includes('Why it may be wrong'));
 assert.ok(node.evidence.some(x=>x.answer.includes('relief')));
});
test('sleep difficulty and low capacity support a competing resource explanation',()=>{
 let s=make();
 for(const [id,choice] of [['sleep','difficulty'],['capacity','high']]){
  s=by(s,id);s=step(s,choice);
 }
 assert.ok(testableDifferentials(s).some(p=>p.id==='pattern:resource-load'));
 assert.ok(!testableDifferentials(s).some(p=>p.id==='pattern:relief-return'));
});
test('effective behaviour is not recast as avoidance merely because it changes emotions',()=>{
 let s=make();
 for(const [id,choice] of [['short_term','practical'],['long_term','improves']]){
  s=by(s,id);s=step(s,choice);
 }
 const patterns=testableDifferentials(s);
 assert.ok(patterns.some(p=>p.id==='pattern:valid-response'));
 assert.ok(!patterns.some(p=>p.id==='pattern:relief-return'));
});
test('person-selected nonproblem/no-change preference suppresses hidden maladaptive cycles',()=>{
 let s=startHypothesis({trackId:'identity'});
 const drillChoices=['IDENTITY-GROOMING','IDENTITY-GROOMING-SHAVING-LEGS','yes','mostly_enjoyable','personal_preference','mostly_private'];
 for(const choice of drillChoices)s={...s,drill:answerSubtypeDrill(s.drill,subtypeQuestion(s.drill).id,choice)};
 s=startCaseDetailInterview(s);
 for(const choice of ['months_or_longer','some_days','none','one_setting','yes_clear','do_not_change']){
  const q=caseDetailQuestion(s);s=answerCaseDetail(s,q.id,choice);
 }
 s=startInvestigation(s);
 for(const [id,choice] of [['action','withdraw'],['short_term','relief'],['long_term','returns']]){
  s=by(s,id);s=step(s,choice);
 }
 assert.ok(!testableDifferentials(s).some(x=>x.id==='pattern:relief-return'));
});
