import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {topicsInTheme} from '../../ns-needs-themes.mjs';
import {HEALTH_IDS,HEALTH_GUIDES,HEALTH_BY_ID,HEALTH_GROUPS} from '../../ns-health-manual-data.mjs';
import {practicalPopupIdeas} from '../../ns-manual-popup-advice.mjs';
const words=s=>String(s||'').split(/\s+/).filter(Boolean).length;
const banned=/^(Ask a trusted person about the practical concern behind|Request support for this possible step only if safe|Talk this through with someone who listens without deciding the answer for you|Consider whether this is relevant to your situation|Use this worked example to ask|You might discuss this part of the experience with|A relevant service or ally may be able to help with|Explore what would need to change before attempting this)/i;

test('every health catalogue topic has one complete individual manual',()=>{
 const items=topicsInTheme(atlasProblemIndex,'health');
 assert.equal(items.length,50);
 assert.equal(HEALTH_GUIDES.length,50);
 assert.equal(HEALTH_BY_ID.size,50);
 assert.deepEqual(new Set(HEALTH_IDS),new Set(items.map(x=>x.id)));
 assert.equal(HEALTH_GROUPS.body.length,25);
 assert.equal(HEALTH_GROUPS.sexuality.length,25);
 for(const x of items)assert.equal(HEALTH_BY_ID.get(x.id)?.domain,x.domain);
});

test('all fifty pages use the established full field-guide structure',()=>{
 const openings=new Set();
 for(const guide of HEALTH_GUIDES){
  assert.equal(guide.article.length,10,guide.id);
  assert.ok(words(guide.article.join(' '))>=380,guide.id+' article should be substantial');
  assert.equal(guide.routes.length,4,guide.id);
  assert.equal(guide.profiles.length,4,guide.id);
  assert.equal(guide.whyQuestions.length,10,guide.id);
  assert.equal(guide.whyStages.length,10,guide.id);
  assert.equal(guide.whyCases.length,16,guide.id);
  assert.equal(guide.roots.length,4,guide.id);
  assert.ok(guide.safety?.length>=75,guide.id+' requires specific safety guidance');
  assert.ok(guide.sources?.length>=1,guide.id+' requires credible clinical sources');
  assert.equal(guide.hideCycle,true,guide.id+' must not show unrequested conditions box');
  if(!['sleep','fatigue','pain','sensory'].includes(guide.id)){
   assert.ok(!openings.has(guide.article[0]),guide.id+' duplicates an opening');
   openings.add(guide.article[0]);
  }
  for(const route of guide.routes){
   assert.equal(route.questions.length,4,guide.id+' '+route.id);
   assert.ok(route.questions.every(q=>q.length===4&&q[0].length>20),guide.id+' weak journal');
   assert.ok(route.practice.length>=35,guide.id+' missing practical step');
  }
  assert.equal(new Set(guide.whyCases.map(x=>x.situation)).size,16,guide.id+' repeated example');
  for(const c of guide.whyCases){
   assert.ok(c.situation.length>=18&&c.situation.length<=115,guide.id+' scenario too long');
   for(const key of ['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action','root']){
    assert.ok(String(c[key]||'').length>3,guide.id+' scenario missing '+key);
   }
  }
 }
});

test('all 100 health advice popups show 20 unique direct actionable entries',()=>{
 let displayed=0;
 for(const guide of HEALTH_GUIDES){
  for(const kind of ['actions','support']){
   const list=guide.ideas?.[kind];
   assert.ok(list&&list.length>=20,guide.id+' '+kind+' missing enough advice');
   const visible=practicalPopupIdeas(guide,kind);
   assert.equal(visible.length,20,guide.id+' '+kind+' cropped or rejected');
   assert.equal(new Set(visible.map(x=>x.toLowerCase())).size,20,guide.id+' '+kind+' repeated advice');
   assert.ok(visible.every(x=>x.length>=32&&!banned.test(x)),guide.id+' '+kind+' contains template filler');
   displayed+=visible.length;
  }
 }
 assert.equal(displayed,2000);
 // The extension is scoped to the health and previously extended CFM catalogues.
 const others={domain:'feel',ideas:{actions:Array.from({length:24},(_,i)=>'Choose a distinct useful action about a specific topic: '+i)}};
 assert.equal(practicalPopupIdeas(others,'actions').length,12);
});

test('sensitive guides prioritise clinical safety and do not persist private answers',()=>{
 for(const id of ['eating','binge-eating','food-restriction','purging-urges','sexual-pain','sexual-trauma-impact','pregnancy-loss','postpartum-mental-health','contraceptive-concerns','bodily-autonomy']){
  const g=HEALTH_BY_ID.get(id);
  assert.equal(g.noPersist,true,id);
  assert.ok(g.prominentSafety?.length>75,id);
 }
 assert.match(HEALTH_BY_ID.get('postpartum-mental-health').safety,/urgent|emergency/i);
 assert.match(HEALTH_BY_ID.get('purging-urges').safety,/electrolyte|dehydration/i);
 assert.match(HEALTH_BY_ID.get('sexual-boundary-uncertainty').safety,/consent|coercion/i);
 assert.match(HEALTH_BY_ID.get('sexual-shame').article.join(' '),/consensual preference/i);
 assert.match(HEALTH_BY_ID.get('menstrual-distress').safety,/severe|urgent/i);
 assert.match(HEALTH_BY_ID.get('insomnia').safety,/bipolar|epilepsy/i);
 assert.match(HEALTH_BY_ID.get('nightmare-distress').safety,/trauma|urgent/i);
});

test('routing keeps old guides, adds remaining topics and links to right subcatalogue',()=>{
 const site=readFileSync(new URL('../../site.mjs',import.meta.url),'utf8');
 const page=readFileSync(new URL('../../ns-mood-manual.mjs',import.meta.url),'utf8');
 const ledger=readFileSync(new URL('../../ns-catalogue-progress.mjs',import.meta.url),'utf8');
 assert.match(site,/HEALTH_IDS,HEALTH_BY_ID/);
 assert.match(site,/bodyGuideIds\.has\(key\)\)showBodyGuide\(key\)/);
 assert.match(site,/bodyGuideIds\.has\(options\.topic\)/);
 assert.match(site,/bodyGuideIds\.has\(selected\.target\)/);
 assert.match(page,/#navigate\/area\/health\/body/);
 assert.match(page,/#navigate\/area\/health\/sexuality/);
 assert.match(ledger,/HEALTH_IDS/);
 assert.match(page,/g\.hideCycle/);
 assert.match(page,/data-mood-why-browse/);
 assert.match(page,/data-mood-idea/);
});
