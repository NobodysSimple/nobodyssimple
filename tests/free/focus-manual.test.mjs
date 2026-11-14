import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FOCUS_GUIDES,FOCUS_IDS,FOCUS_BY_ID} from '../../ns-focus-guide-data.mjs';
import {atlasByDomain} from '../../ns-atlas-core.mjs';

const expected=['focus','memory','organization','bored','learning','hyperactivity','attention-drift','hyperfocus-cost','time-blindness','planning-overload','learning-block'];

test('all eleven Attention, learning and habits catalogue topics have bespoke guides',()=>{
 assert.equal(FOCUS_IDS.length,11);
 assert.deepEqual(new Set(FOCUS_IDS),new Set(expected));
 const atlasIds=new Set(atlasByDomain('focus').map(x=>x.id));
 for(const id of expected){
  assert.ok(atlasIds.has(id),id+' not in focus catalogue');
  assert.equal(FOCUS_BY_ID.get(id)?.id,id);
 }
});
test('all guides contain distinct full-length editorial articles and 44 actionable journals',()=>{
 const openers=new Set(),outcomes=new Set();
 for(const g of FOCUS_GUIDES){
  assert.equal(g.article.length,8,g.id);
  assert.ok(g.article.join(' ').split(/\s+/).length>=340,g.id+' short article');
  assert.ok(!openers.has(g.article[0]),g.id+' duplicated opening');openers.add(g.article[0]);
  assert.equal(g.routes.length,4,g.id);
  assert.equal(new Set(g.routes.map(x=>x.id)).size,4,g.id);
  for(const route of g.routes){
   assert.ok(route.practice.length>=40,g.id+'/'+route.id);
   assert.ok(!outcomes.has(route.practice),g.id+' repeated practice');
   outcomes.add(route.practice);
   assert.equal(route.questions.length,4,g.id);
   for(const [q,hint,teaching,key] of route.questions){
    assert.ok(q.length>=19&&hint.length>=17&&teaching.length>=18,g.id+' incomplete journal step');
    if(key)assert.ok(g.ideas[key]?.length>=24,g.id+' missing optional help');
   }
  }
 }
 assert.equal(outcomes.size,44);
});
test('176 individually authored worked examples map to correct possible causes',()=>{
 assert.equal(FOCUS_GUIDES.reduce((n,g)=>n+g.whyCases.length,0),176);
 for(const g of FOCUS_GUIDES){
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(new Set(g.whyCases.map(x=>x.situation)).size,16,g.id);
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.ok(g.whyIntro.length>=95,g.id);
  for(const x of g.whyCases){
   assert.ok(g.roots.some(r=>r[0]===x.root),g.id+' invalid root: '+x.root);
   for(const f of ['interpretation','emotion','response','function','need','rule','adaptation','alternative','action'])
    assert.ok(x[f]?.length>=4,g.id+' missing '+f);
  }
 }
});
test('528 optional practical ideas are available and safeguards fit health-related topics',()=>{
 assert.equal(FOCUS_GUIDES.reduce((n,g)=>n+g.ideas.actions.length+g.ideas.support.length,0),528);
 for(const g of FOCUS_GUIDES){
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.equal(g.ideas.support.length,24,g.id);
  assert.ok(g.sources.length>0&&g.evidence.length>90&&g.safety.length>80,g.id);
 }
 assert.match(FOCUS_BY_ID.get('memory').prominentSafety,/sudden confusion/i);
 assert.match(FOCUS_BY_ID.get('hyperactivity').prominentSafety,/medication|agitation/i);
 assert.match(FOCUS_BY_ID.get('time-blindness').prominentSafety,/medication|safeguarding/i);
});
test('all focus route entry points use the existing manual without displacing previous guides',()=>{
 const s=readFileSync('site.mjs','utf8'),layout=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(s,/focusGuideIds\.has\(options\.topic\)/);
 assert.match(s,/showFocusGuide\(selected\.target\)/);
 assert.match(s,/focusGuideIds\.has\(key\)/);
 assert.match(layout,/domain==='focus'/);
 assert.match(layout,/#navigate\/atlas\/focus/);
 assert.match(s,/habitGuideIds\.has\(key\)/);
 assert.match(s,/thinkGuideIds\.has\(key\)/);
});
