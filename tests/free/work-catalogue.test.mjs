import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {WORK_GUIDES,WORK_IDS,WORK_BY_ID,WORK_GUIDE_GROUPS} from '../../ns-work-guide-data.mjs';
import {atlasByDomain,atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {topicsInTheme} from '../../ns-needs-themes.mjs';

test('all 29 work and education topics have their own authored field guide',()=>{
 const atlas=new Set(topicsInTheme(atlasProblemIndex,'work').filter(x=>['work','education'].includes(x.domain)).map(x=>x.id));
 assert.equal(atlas.size,29);
 assert.equal(WORK_IDS.length,29);
 assert.equal(WORK_GUIDE_GROUPS.work.length,13);
 assert.equal(WORK_GUIDE_GROUPS.education.length,16);
 assert.deepEqual(new Set(WORK_IDS),atlas);
 assert.equal(WORK_BY_ID.size,13);
 const openers=new Set();
 for(const g of WORK_GUIDES){
  assert.equal(g.article.length,10,g.id);
  assert.ok(g.article.join(' ').trim().split(/\s+/).length>=400,g.id+' insufficient long-form explanation');
  assert.ok(!openers.has(g.article[0]),g.id+' repeated opening');
  openers.add(g.article[0]);
  assert.ok(g.safety.length>=65,g.id);
  assert.ok(g.sources[0][1].startsWith('https://'),g.id);
  assert.equal(g.profiles.length,4,g.id);
  assert.equal(g.mechanisms.length,3,g.id);
 }
});
test('workbook routes reflect four different everyday problems per manual',()=>{
 for(const g of WORK_GUIDES){
  assert.equal(g.routes.length,4,g.id);
  assert.equal(g.roots.length,4,g.id);
  for(const [i,r] of g.routes.entries()){
   assert.equal(r.questions.length,4,g.id);
   assert.ok(r.description.length>48,g.id);
   assert.ok(r.questions[0][0].includes(g.whyCases[i*4].situation),g.id);
   assert.ok(r.practice.length>35,g.id);
   for(const [prompt,help,shift] of r.questions){
    assert.ok(prompt.length>=30&&help.length>=35&&shift.length>25,g.id+' incomplete guided question');
   }
  }
 }
});
test('all 29 guides contain sixteen separate hypothetical cases and optional deeper work',()=>{
 for(const g of WORK_GUIDES){
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(new Set(g.whyCases.map(c=>c.situation)).size,16,g.id);
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.equal(g.whyStages.length,10,g.id);
  assert.ok(g.whyIntro.length>=200,g.id);
  for(const c of g.whyCases){
   assert.ok(g.roots.some(r=>r[0]===c.root),g.id);
   assert.ok(c.action.length>35&&c.interpretation.length>30,g.id);
  }
 }
});
test('each manual includes 24 unique contextual suggestions, without replacing essential support',()=>{
 for(const g of WORK_GUIDES){
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.equal(g.ideas.support.length,24,g.id);
  assert.equal(new Set(g.ideas.actions).size,24,g.id);
  assert.equal(g.now.steps.length,3,g.id);
 }
 for(const id of ['workplace-bullying','housing-instability','financial-insecurity']){
  assert.ok(WORK_BY_ID.get(id).prominentSafety.length>65,id);
  assert.equal(WORK_BY_ID.get(id).noPersist,true,id);
 }
});
test('new field guides are discoverable through both router entry points and return to the right area',()=>{
 const site=readFileSync('site.mjs','utf8');
 const manual=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(site,/workGuideIds\.has\(options\.topic\)/);
 assert.match(site,/workGuideIds\.has\(selected\.target\)/);
 assert.match(site,/workGuideIds\.has\(key\)/);
 assert.match(site,/showWorkGuide=id=>renderTopicManual/);
 assert.ok(manual.includes('#navigate/area/work/work'));
 assert.ok(manual.includes('#navigate/area/work/education'));
 assert.ok(site.includes("WORK_BY_ID.get(id)?.domain||'work'"));
});
