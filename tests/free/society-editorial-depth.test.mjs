import test from 'node:test';
import assert from 'node:assert/strict';
import {FHS_BY_ID,FHS_GUIDE_GROUPS} from '../../ns-fhs-guide-data.mjs';
import {SOCIETY_INEQUALITY_REVISIONS_A} from '../../ns-society-revisions-inequality-a.mjs';
import {SOCIETY_INEQUALITY_REVISIONS_B} from '../../ns-society-revisions-inequality-b.mjs';
import {SOCIETY_ENVIRONMENT_REVISIONS} from '../../ns-society-revisions-environment.mjs';
import {FHS_CONTEXT_INEQUALITY} from '../../ns-fhs-context-inequality.mjs';
import {FHS_CONTEXT_ENVIRONMENT} from '../../ns-fhs-context-environment.mjs';

const revisions={...SOCIETY_INEQUALITY_REVISIONS_A,...SOCIETY_INEQUALITY_REVISIONS_B,...SOCIETY_ENVIRONMENT_REVISIONS};
const ids=[...FHS_GUIDE_GROUPS.inequality,...FHS_GUIDE_GROUPS.environment];
test('all 33 existing Money and Society guides have new individual, deep explanatory material',()=>{
 assert.equal(ids.length,33);
 assert.deepEqual(new Set(Object.keys(revisions)),new Set(ids));
 assert.equal(new Set(ids.map(id=>revisions[id].insight)).size,33,'no recycled explanatory text');
 for(const id of ids){
  const g=FHS_BY_ID.get(id),newWriting=revisions[id];
  assert.ok(g,id);
  assert.ok(newWriting.insight.trim().split(/\s+/).length>=65,id+' unique context');
  assert.ok(newWriting.actions.length===4,id);
  assert.ok(new Set(newWriting.actions).size===4,id);
  assert.ok(newWriting.actions.every(x=>x.length>45),id);
  const source=FHS_CONTEXT_INEQUALITY[id]||FHS_CONTEXT_ENVIRONMENT[id];
  assert.ok(g.whyIntro.startsWith(source.intro),id+' preserve source formulation');
  assert.ok(g.whyIntro.includes(newWriting.insight),id+' integrate enhanced context');
  assert.equal(g.ideas.actions.length,24,id);
  assert.deepEqual(g.ideas.actions.slice(4,8),newWriting.actions,id+' real authored support beyond first four');
  for(let i=0;i<4;i++){
   assert.ok(g.routes[i].questions[3][0].includes(newWriting.actions[i].replace(/[.!?]+$/,'')),id+' directly adapted journal prompt');
   assert.ok(g.routes[i].questions[3][2].includes(newWriting.actions[i]),id+' actionable context');
  }
 }
});

test('higher risk inequality and civic guides use private notes and prominent safeguards',()=>{
 for(const id of ['debt-coercion','financial-exploitation','financial-dependence',
  'homelessness-insecurity','housing-discrimination','pregnancy-discrimination',
  'community-violence','war-conflict-distress','disaster-recovery'])
  assert.equal(FHS_BY_ID.get(id).noPersist,true,id);
 for(const id of ['financial-exploitation','pregnancy-discrimination','war-conflict-distress']){
  const g=FHS_BY_ID.get(id);
  assert.ok(g.prominentSafety.length>50,id);
 }
});

test('existing family and harm content remains untouched by Society-specific enhancement',()=>{
 for(const id of [...FHS_GUIDE_GROUPS.family,...FHS_GUIDE_GROUPS.harm]){
  const g=FHS_BY_ID.get(id);
  assert.ok(!revisions[id],id);
  assert.equal(g.routes.length,4,id);
  assert.equal(g.ideas.actions.length,24,id);
 }
});
