import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {topicsInTheme} from '../../ns-needs-themes.mjs';
import {DIGITAL_GUIDES,DIGITAL_IDS,DIGITAL_BY_ID} from '../../ns-digital-guide-data.mjs';
import {DIGITAL_NEW_IDS} from '../../ns-digital-new-guide-data.mjs';
import {FHS_BY_ID,FHS_GUIDE_GROUPS} from '../../ns-fhs-guide-data.mjs';
import {verifiedCompleted,catalogueProgress} from '../../ns-catalogue-progress.mjs';

const society=new Map([...FHS_GUIDE_GROUPS.inequality,...FHS_GUIDE_GROUPS.environment].map(id=>[id,FHS_BY_ID.get(id)]));
const wc=s=>String(s).trim().split(/\s+/).length;

test('all 49 Society theme topics have dedicated, original long-form field guides',()=>{
 const atlas=topicsInTheme(atlasProblemIndex,'society');
 const all=[...society.keys(),...DIGITAL_IDS];
 assert.equal(atlas.length,49,'canonical 22 + 16 + 11');
 assert.equal(FHS_GUIDE_GROUPS.inequality.length,22);
 assert.equal(FHS_GUIDE_GROUPS.environment.length,11);
 assert.equal(DIGITAL_IDS.length,16);
 assert.equal(DIGITAL_NEW_IDS.length,15);
 assert.equal(society.size,33);
 assert.equal(new Set(all).size,49,'no overlap');
 assert.deepEqual(new Set(all),new Set(atlas.map(x=>x.id)));
 assert.equal(catalogueProgress.find(t=>t.theme==='society').pending.length,0);
 assert.ok(all.every(id=>verifiedCompleted.includes(id)));
});

test('the fifteen new digital manuals have substantial independent editorial and four distinct routes',()=>{
 assert.equal(DIGITAL_GUIDES.length,16);
 const uniqueOpeners=new Set(),uniqueOptions=new Set(),uniqueCases=new Set();
 for(const g of DIGITAL_GUIDES){
  assert.equal(g.article.length,10,g.id);
  assert.ok(wc(g.article.join(' '))>=400,g.id);
  assert.ok(!uniqueOpeners.has(g.article[0]),g.id+' duplicate article');
  uniqueOpeners.add(g.article[0]);
  assert.equal(g.routes.length,4,g.id);
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(new Set(g.whyCases.map(x=>x.situation)).size,16,g.id);
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.equal(g.whyStages.length,10,g.id);
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.ok(g.sources.length>0,g.id);
  assert.equal(g.noPersist,true,g.id+' digital privacy');
  assert.equal(g.now.steps.length,3,g.id);
  for(const [i,r] of g.routes.entries()){
   assert.equal(r.questions.length,4,g.id);
   assert.ok(r.description.length>40,g.id);
   assert.ok(r.practice.length>38,g.id);
   for(const q of r.questions)assert.ok(q[0].length>30&&q[1].length>25&&q[2].length>25,g.id);
   if(g.id!=='cyberbullying')assert.ok(r.questions[0][0].includes(g.whyCases[i*4].situation),g.id);
   uniqueOptions.add(g.id+':'+r.practice);
  }
  for(const c of g.whyCases)uniqueCases.add(g.id+':'+c.situation);
 }
 assert.equal(uniqueOpeners.size,16);
 assert.equal(uniqueOptions.size,64);
 assert.equal(uniqueCases.size,256);
});

test('privacy-sensitive digital risks have proportionate safeguards and sources',()=>{
 for(const id of ['online-harassment','online-privacy','nonconsensual-digital-sharing','online-radicalisation-concern']){
  const g=DIGITAL_BY_ID.get(id);
  assert.ok(g.prominentSafety.length>100,id);
  assert.match(g.safety,/safety|threat|risk|police|safeguard|surveillance/i,id);
 }
 assert.match(DIGITAL_BY_ID.get('nonconsensual-digital-sharing').safety,/under-18|child|intimate/i);
 assert.match(DIGITAL_BY_ID.get('pornography-related-distress').safety,/consensual|conversion/i);
 assert.match(DIGITAL_BY_ID.get('problematic-gaming').article.join(' '),/functional|impairment|consequences/i);
 assert.match(DIGITAL_BY_ID.get('ai-related-anxiety').safety,/sensitive data|confidential/i);
});

test('existing inequality and environment guides remain full length and safely routed',()=>{
 for(const g of society.values()){
  assert.equal(g.article.length,10,g.id);
  assert.ok(wc(g.article.join(' '))>=400,g.id);
  assert.equal(g.routes.length,4,g.id);
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.ok(g.sources[0][1].startsWith('https://'),g.id);
 }
 for(const id of ['food-insecurity','homelessness-insecurity','debt-coercion','community-violence','disaster-recovery']){
  assert.ok(FHS_BY_ID.get(id).prominentSafety.length>60,id);
 }
});

test('all Society subcatalogues use the same renderer and original catalogue back links',()=>{
 const site=readFileSync('site.mjs','utf8');
 const renderer=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(site,/digitalGuideIds\.has\(options\.topic\)/);
 assert.match(site,/digitalGuideIds\.has\(selected\.target\)/);
 assert.match(site,/digitalGuideIds\.has\(key\)/);
 for(const domain of ['inequality','environment','digital'])assert.ok(renderer.includes('#navigate/area/society/'+domain),domain);
 assert.match(renderer,/const privateSession=domain==='harm'\|\|g.noPersist===true/);
});
