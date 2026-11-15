import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HABIT_GUIDES,HABIT_IDS,HABIT_BY_ID} from '../../ns-habit-guide-data.mjs';
import {HABIT_SUPPORT_MORE} from '../../ns-habit-support-more.mjs';
import {atlasByDomain} from '../../ns-atlas-core.mjs';
const expected=['procrastination','perfectionism','stuck','habits','energy-action','avoidance','too-many-tasks','unplanned-impulses','risk-taking','compulsive-buying','binge-scroll','workaholism','task-switching','habit-urges','risky-sex'];
test('every one of the fifteen action and habits catalogue topics has a distinct manual',()=>{
 assert.deepEqual(new Set(HABIT_IDS),new Set(expected));
 assert.equal(HABIT_IDS.length,15);
 const atlas=new Set(atlasByDomain('act').map(x=>x.id));
 for(const id of expected){assert.ok(atlas.has(id),id+' absent from action catalogue');assert.equal(HABIT_BY_ID.get(id)?.id,id);}
});
test('articles are substantive and 60 guided journals have unique real-world outcomes',()=>{
 const firstParagraphs=new Set(),outcomes=new Set(),descriptions=new Set(),questions=new Set();
 for(const g of HABIT_GUIDES){
  assert.equal(g.article.length,10,g.id);
  assert.ok(g.article.join(' ').trim().split(/\s+/).length>=500,g.id+' short article');
  assert.ok(!firstParagraphs.has(g.article[0]),g.id+' repeated article');firstParagraphs.add(g.article[0]);
  assert.equal(g.routes.length,4,g.id);
  for(const r of g.routes){
   assert.equal(r.questions.length,4,g.id+'/'+r.id);
   assert.ok(r.practice.length>=40,g.id+'/'+r.id);
   assert.ok(r.description.length>=95,g.id+'/'+r.id+' lost personalised explanation');
   assert.ok(!descriptions.has(r.description),g.id+'/'+r.id+' duplicated explanatory support');descriptions.add(r.description);
   assert.ok(!outcomes.has(r.practice),g.id+' repeated conclusion');outcomes.add(r.practice);
   for(const [q,hint,teaching,ideas] of r.questions){
    assert.ok(q.length>=19 && hint.length>=18 && teaching.length>=18,g.id+' weak question');
    assert.ok(!questions.has(q),g.id+' duplicated journal question');questions.add(q);
    if(ideas)assert.ok(g.ideas[ideas]?.length>=24,g.id+' missing idea list');
   }
  }
 }
 assert.equal(outcomes.size,60);
 assert.equal(questions.size,240);
});
test('all 240 Understand Why examples map to the right possible drivers',()=>{
 assert.equal(HABIT_GUIDES.reduce((n,g)=>n+g.whyCases.length,0),240);
 for(const g of HABIT_GUIDES){
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.ok(g.whyIntro.length>180,g.id+' generic or thin why introduction');
  assert.notEqual(g.whyStages[6],'A possible rule you may be following',g.id+' generic stage');
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(new Set(g.whyCases.map(x=>x.situation)).size,16,g.id+' repeated example');
  for(const c of g.whyCases){
   assert.ok(g.roots.some(r=>r[0]===c.root),g.id+' invalid root: '+c.root);
   for(const f of ['interpretation','emotion','response','function','need','rule','adaptation','alternative','action'])
    assert.ok(c[f]?.length>3,g.id+' missing '+f);
   assert.doesNotMatch(c.function,/The response may have offered immediate relief or protected|This response may briefly protect a need/i,g.id+' generic explanation');
  }
 }
});
test('720 optional practical ideas are present and all guides include evidence and safety',()=>{
 assert.equal(HABIT_GUIDES.reduce((n,g)=>n+Object.values(g.ideas).flat().length,0),720);
 for(const g of HABIT_GUIDES){
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.equal(g.ideas.support.length,24,g.id);
  assert.deepEqual(g.ideas.support.slice(12),HABIT_SUPPORT_MORE[g.id],g.id+' expected 12 independently written supports');
  assert.ok(g.sources.length>0 && g.evidence.length>100 && g.safety.length>60,g.id);
 }
 for(const id of ['risk-taking','risky-sex','habit-urges','energy-action','unplanned-impulses'])
  assert.ok(HABIT_BY_ID.get(id).safety.length>100,id+' safety too thin');
 assert.match(HABIT_BY_ID.get('risky-sex').safety,/coercion|assault/i);
 assert.match(HABIT_BY_ID.get('energy-action').safety,/post-exertional/i);
});
test('new guides preserve established routing and an accurate catalogue breadcrumb',()=>{
 const site=readFileSync('site.mjs','utf8'),render=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(site,/habitGuideIds\.has\(options\.topic\)/);
 assert.match(site,/showHabitGuide\(selected\.target\)/);
 assert.match(site,/habitGuideIds\.has\(key\)/);
 assert.match(render,/domain==='act'/);
 assert.match(render,/#navigate\/atlas\/act/);
 assert.match(site,/thinkGuideIds\.has\(key\)/);
});
