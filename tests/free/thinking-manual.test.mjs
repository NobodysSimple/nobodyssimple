import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {THINK_GUIDES,THINK_IDS,THINK_BY_ID} from '../../ns-think-guide-data.mjs';
import {atlasByDomain} from '../../ns-atlas-core.mjs';
const expected=['rumination','overthinking','what-if','checking','intrusive','decision-paralysis','negative-beliefs','concentration-worry','obsessional-doubt','ritual-checking','mental-rituals','moral-uncertainty','relationship-obsessions','jealousy-rumination','catastrophizing','ruminative-guilt','perceptual-uncertainty'];
test('all 17 Thoughts & worry catalogue entries have dedicated manuals',()=>{
 assert.deepEqual(new Set(THINK_IDS),new Set(expected));
 assert.equal(THINK_IDS.length,17);
 const domains=new Set(atlasByDomain('think').map(g=>g.id));
 for(const id of expected){assert.ok(domains.has(id),id+' absent from catalogue');assert.equal(THINK_BY_ID.get(id)?.id,id);}
});
test('all 17 have unique full articles, four distinct journals and optional ideas',()=>{
 const opens=new Set(),practices=new Set();
 for(const g of THINK_GUIDES){
  assert.equal(g.article.length,8,g.id);
  assert.ok(g.article.join(' ').split(/\s+/).length>=340,g.id+' article too short');
  assert.ok(!opens.has(g.article[0]),g.id+' identical opener');
  opens.add(g.article[0]);
  assert.equal(g.routes.length,4,g.id);
  assert.equal(new Set(g.routes.map(r=>r.id)).size,4,g.id);
  for(const r of g.routes){
   assert.ok(r.practice.length>=40,g.id+'/'+r.id+' missing skill or action');
   assert.ok(!practices.has(r.practice),g.id+' reused next step');
   practices.add(r.practice);
   assert.equal(r.questions.length,4,g.id);
   for(const q of r.questions){
    assert.equal(q.length,4,g.id+'/'+r.id);
    assert.ok(q.slice(0,3).every(s=>s.length>=17),g.id+'/'+r.id+' thin question');
    if(q[3])assert.ok(g.ideas[q[3]]?.length>=24,g.id+' missing idea key');
   }
  }
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.equal(g.ideas.support.length,24,g.id);
  assert.ok(g.sources.length>=1,g.id);
 }
 assert.equal(practices.size,68);
});
test('272 different Understand Why situations map to local drivers without diagnostic claims',()=>{
 const all=THINK_GUIDES.flatMap(g=>g.whyCases.map(c=>({id:g.id,...c})));
 assert.equal(all.length,272);
 for(const g of THINK_GUIDES){
  assert.equal(g.whyCases.length,16);
  assert.equal(new Set(g.whyCases.map(x=>x.situation)).size,16,g.id+' duplicate case');
  assert.equal(g.whyQuestions.length,10);
  for(const c of g.whyCases){
   assert.ok(c.situation.length>12,g.id);
   assert.ok(g.roots.some(r=>r[0]===c.root),g.id+' unmatched root '+c.root);
   for(const k of ['interpretation','emotion','response','function','need','rule','adaptation','alternative','action'])
    assert.ok(c[k]?.length>3,g.id+' missing '+k);
  }
 }
});
test('unsafe topics prioritise assessment rather than exposure or risk tests',()=>{
 for(const id of ['intrusive','obsessional-doubt','ritual-checking','mental-rituals','perceptual-uncertainty']){
  const g=THINK_BY_ID.get(id);
  assert.ok(g.prominentSafety.length>100,id);
  assert.ok(g.safety.length>60,id+' missing substantive safeguard');
 }
 assert.match(THINK_BY_ID.get('perceptual-uncertainty').prominentSafety,/urgent/i);
 assert.match(THINK_BY_ID.get('relationship-obsessions').prominentSafety,/abuse|coercion|threats|safety/i);
});
test('public routing reuses established design with correct domain breadcrumb',()=>{
 const site=readFileSync('site.mjs','utf8'),layout=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(site,/thinkGuideIds\.has\(options\.topic\)/);
 assert.match(site,/showThinkGuide\(selected\.target\)/);
 assert.match(site,/thinkGuideIds\.has\(key\)/);
 assert.match(layout,/domain==='think'/);
 assert.match(site,/if\(options\.topic==='social-anxiety'\)/);
});
