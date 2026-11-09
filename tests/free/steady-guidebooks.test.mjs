import test from 'node:test';
import assert from 'node:assert/strict';
import {STEADY_GUIDES_A} from '../../ns-steady-guides-a.mjs';
import {STEADY_GUIDES_B} from '../../ns-steady-guides-b.mjs';
import {STEADY_GUIDEBOOKS,steadyGuide,guidebooksForTool} from '../../ns-steady-guidebook.mjs';
import {STEADY_LANES,STEADY_REFERENCES} from '../../ns-steady-guide-utils.mjs';
import {SETTLING_ACTIVITIES} from '../../ns-needs-activities.mjs';
import {tools} from '../../tool-catalog.mjs';

const expected=['steady-overwhelm','steady-panic','steady-sensory','steady-anger','steady-disconnected','steady-depleted','steady-restless','savour-good'];
const allTools=new Set(tools.map(t=>t.id));
test('each Feel steadier option has an individually authored complete guidebook',()=>{
 assert.deepEqual(Object.keys(STEADY_GUIDEBOOKS).sort(),[...expected].sort());
 assert.equal(Object.keys(STEADY_GUIDES_A).length,4);
 assert.equal(Object.keys(STEADY_GUIDES_B).length,4);
 assert.deepEqual(Object.keys(SETTLING_ACTIVITIES).sort(),[...expected].sort());
 for(const id of expected){
  const g=steadyGuide(id);
  assert.ok(g.title.length>25,id+' title');
  assert.ok(g.what.length>130,id+' psychoeducation');
  assert.ok(g.possibleLoop.length>100,id+' mechanism');
  assert.ok(g.variations.length>=5,id+' recognition');
  assert.ok(g.contributors.length>=5,id+' contributors');
  assert.ok(g.goals.length>=3,id+' goals');
  assert.ok(g.cautions.length>=2,id+' warnings');
  assert.ok(g.progress.length>=95,id+' progress');
  assert.match(g.reviewStatus,/not individually clinically reviewed/i,id);
  assert.equal(g.reviewedDate,'2026-11-09');
  assert.deepEqual(Object.keys(g.lanes).sort(),STEADY_LANES.map(x=>x.id).sort(),id);
 }
});
test('every pathway provides environmental, behavioural, cognitive, DBT, ACT and practical support approaches',()=>{
 let count=0;
 for(const id of expected){
  const g=steadyGuide(id);
  for(const lane of STEADY_LANES){
   const methods=g.lanes[lane.id];
   assert.equal(methods.length,2,id+' '+lane.id);
   for(const method of methods){
    count++;
    assert.ok(method.title.length>16,id+' '+method.title);
    assert.ok(method.why.length>45,id+' rationale');
    assert.ok(method.steps.length>=3,id+' '+method.title+' steps');
    assert.ok(method.steps.every(x=>x.length>27),id+' '+method.title+' detail');
    assert.ok(method.caution.length>35,id+' '+method.title+' limitation');
    assert.ok(method.note.length>18,id+' evidence qualification');
    assert.ok(method.refs.length>=1,id+' '+method.title+' citations');
    for(const key of method.refs)assert.ok(STEADY_REFERENCES[key],id+' missing source '+key);
   }
  }
  for(const key of g.refs)assert.ok(STEADY_REFERENCES[key],id+' missing guide source '+key);
 }
 assert.equal(count,96);
});
test('source list is public, inspectable, and honest about contextual limits',()=>{
 for(const [key,r] of Object.entries(STEADY_REFERENCES)){
  assert.match(r.url,/^https:\/\//,key);
  assert.ok(r.name.length>12,key);
  assert.ok(r.scope.length>30,key);
  assert.match(r.type,/Clinical|Specialist|Systematic/,key);
 }
 assert.ok(STEADY_REFERENCES['nice-mecfs']);
 assert.ok(STEADY_REFERENCES['nice-autism']);
 assert.ok(STEADY_REFERENCES['nice-panic']);
 assert.ok(STEADY_REFERENCES['nhs-anger']);
 assert.ok(STEADY_REFERENCES['savour-review']);
});
test('all active tools linked from Feel steadier have relevant guidebook context',()=>{
 const used=new Set();
 for(const [id,activity] of Object.entries(SETTLING_ACTIVITIES)){
  const guide=steadyGuide(id);
  for(const strategy of activity.strategies){
   assert.ok(allTools.has(strategy.tool),strategy.tool+' missing from toolbox');
   used.add(strategy.tool);
   assert.ok(guidebooksForTool(strategy.tool).includes(id),strategy.tool+' lacks '+id);
   assert.ok(guide.lanes.context.length>0&&guide.lanes.behaviour.length>0);
  }
 }
 assert.ok(used.size>=14);
 assert.ok(guidebooksForTool('quick-reset').length>1);
 assert.deepEqual(guidebooksForTool('not-a-tool'),[]);
});
test('high-risk and often-misapplied techniques are explicitly qualified',()=>{
 const panic=steadyGuide('steady-panic');
 assert.match(panic.cautions.join(' '),/999|emergency|chest pain/i);
 assert.match(panic.lanes.behaviour.map(x=>x.caution).join(' '),/exposure/i);
 const fatigue=steadyGuide('steady-depleted');
 assert.match(fatigue.cautions.join(' '),/graded.exercise|post-exertional/i);
 assert.match(fatigue.lanes.behaviour.map(x=>x.caution).join(' '),/ME\/CFS/i);
 const sensory=steadyGuide('steady-sensory');
 assert.match(sensory.cautions.join(' '),/forced|painful/i);
 const detached=steadyGuide('steady-disconnected');
 assert.match(detached.cautions.join(' '),/trauma recall|dissociation|focus/i);
 const good=steadyGuide('savour-good');
 assert.match(good.what,/not compulsory gratitude|not compulsory/i);
});
