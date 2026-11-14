import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {CLINICAL_GUIDES,CLINICAL_IDS,CLINICAL_BY_ID} from '../../ns-clinical-guide-data.mjs';
import {atlasByDomain} from '../../ns-atlas-core.mjs';
const expected=['depressive-episode','bipolar-experiences','psychosis-recovery','obsessions-taboo-thoughts',
'ocd-contamination','ocd-harm-fear','dissociation-patterns','medication-concerns-mental-health',
'mental-health-diagnosis-identity','mental-health-stigma','access-mental-health-care','therapy-difficulties',
'eating-recovery','health-compulsions','medical-uncertainty-distress'];
test('all fifteen Mental health and care catalogue topics have individually matched guides',()=>{
 assert.deepEqual(new Set(CLINICAL_IDS),new Set(expected));
 const ids=new Set(atlasByDomain('clinical').map(x=>x.id));
 for(const id of expected){assert.ok(ids.has(id),id+' not in atlas');assert.equal(CLINICAL_BY_ID.get(id)?.id,id);}
 assert.equal(CLINICAL_GUIDES.length,15);
});
test('15 original articles and 60 purposeful free-written clinical exercises',()=>{
 const openings=new Set(),practices=new Set(),questions=new Set();
 for(const g of CLINICAL_GUIDES){
  assert.equal(g.article.length,8,g.id);
  assert.ok(g.article.join(' ').split(/\s+/).length>=340,g.id);
  assert.ok(!openings.has(g.article[0]),g.id+' repeated opening');openings.add(g.article[0]);
  assert.equal(g.routes.length,4,g.id);
  assert.equal(new Set(g.routes.map(r=>r.id)).size,4,g.id);
  for(const route of g.routes){
   assert.ok(route.practice.length>=45,g.id+'/'+route.id+' practice too thin');
   assert.ok(!practices.has(route.practice),g.id+' repeated practice');
   practices.add(route.practice);
   assert.equal(route.questions.length,4,g.id+'/'+route.id);
   for(const [q,hint,teaching,key] of route.questions){
    assert.ok(q.length>=18&&hint.length>=18&&teaching.length>=18,g.id+' incomplete step');
    assert.ok(!questions.has(g.id+':'+q),g.id+' duplicated question within guide');
    questions.add(g.id+':'+q);
    if(key)assert.ok(g.ideas[key]?.length>=24,g.id+' idea missing');
   }
  }
  assert.equal(g.whyQuestions.length,10);
  assert.ok(g.prominentSafety.length>70);
  assert.ok(g.evidence.length>110);
  assert.ok(g.sources.length>=1);
 }
 assert.equal(practices.size,60);
});
test('240 separate examples with valid roots and 780 optional practical ideas',()=>{
 assert.equal(CLINICAL_GUIDES.reduce((n,g)=>n+g.whyCases.length,0),240);
 assert.equal(CLINICAL_GUIDES.reduce((n,g)=>n+Object.values(g.ideas).flat().length,0),780);
 for(const g of CLINICAL_GUIDES){
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(new Set(g.whyCases.map(x=>x.situation)).size,16,g.id);
  for(const x of g.whyCases){
   assert.ok(x.situation.length>=18,g.id+' vague situation');
   assert.ok(g.roots.some(r=>r[0]===x.root),g.id+' invalid root '+x.root);
   for(const key of ['interpretation','emotion','response','function','need','rule','adaptation','alternative','action'])
    assert.ok(x[key]?.length>=3,g.id+' missing '+key);
  }
  for(const [key,items] of Object.entries(g.ideas)){
   assert.equal(items.length,26,g.id+'/'+key);
   assert.equal(new Set(items).size,items.length,g.id+'/'+key+' duplicate idea');
  }
 }
});
test('safety-sensitive clinical guides avoid unsafe self-directed interventions',()=>{
 const g=id=>CLINICAL_BY_ID.get(id);
 for(const id of ['ocd-harm-fear','obsessions-taboo-thoughts'])assert.match(g(id).prominentSafety,/actual intention|actual plan|actual intention or plan/i);
 for(const id of ['ocd-contamination','ocd-harm-fear'])assert.match(g(id).safety,/unsupervised|unassisted/i);
 assert.match(g('eating-recovery').safety,/No calories/);
 assert.match(g('medication-concerns-mental-health').safety,/No dosing instructions/);
 assert.match(g('medical-uncertainty-distress').safety,/normal test/);
 assert.match(g('access-mental-health-care').prominentSafety,/urgent/i);
});
test('new catalogue routes use the established guide component without changing other guides',()=>{
 const site=readFileSync('site.mjs','utf8');
 const layout=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(site,/clinicalGuideIds\.has\(options\.topic\)/);
 assert.match(site,/showClinicalGuide\(selected\.target\)/);
 assert.match(site,/clinicalGuideIds\.has\(key\)/);
 assert.match(layout,/domain==='clinical'/);
 assert.match(site,/if\(options\.topic==='social-anxiety'\)/);
 assert.match(site,/experienceGuideIds\.has\(key\)/);
});
