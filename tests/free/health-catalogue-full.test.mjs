import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {topicsInTheme} from '../../ns-needs-themes.mjs';
import {HEALTH_GUIDES,HEALTH_IDS,HEALTH_BY_ID,HEALTH_GROUPS} from '../../ns-health-manual-data.mjs';
import {practicalPopupIdeas} from '../../ns-manual-popup-advice.mjs';

const forbidden=/^(?:explore what would need to change before attempting this|write (?:one answer|a few words) (?:to|about)|consider whether this is relevant|ask a trusted person about the practical concern behind|talk this through with someone who listens|request support for this possible step|use this worked example to ask|a relevant service or ally may be able to help)/i;
const clinicalRisk=['purging-urges','food-restriction','binge-eating','sexual-pain','sexual-trauma-impact','pregnancy-loss','postpartum-mental-health','sexual-boundary-uncertainty','contraceptive-concerns','bodily-autonomy'];
test('all 50 actual Body, Sleep & Intimacy catalogue topics have an individual routed field guide',()=>{
 const expected=topicsInTheme(atlasProblemIndex,'health');
 assert.equal(expected.length,50,'health catalogue changed');
 assert.equal(HEALTH_IDS.length,50);
 assert.equal(HEALTH_BY_ID.size,50);
 assert.deepEqual(new Set(HEALTH_IDS),new Set(expected.map(t=>t.id)));
 assert.equal(HEALTH_GROUPS.body.length,25);
 assert.equal(HEALTH_GROUPS.sexuality.length,25);
});
test('every health field guide preserves the fully updated manual format',()=>{
 const openings=new Set();
 for(const guide of HEALTH_GUIDES){
  assert.equal(guide.article.length,10,guide.id+' article');
  assert.ok(guide.article.join(' ').split(/\s+/).length>=400,guide.id+' needs substantive writing');
  assert.ok(!openings.has(guide.article[0]),guide.id+' introduction reused');
  openings.add(guide.article[0]);
  assert.equal(guide.routes.length,4,guide.id+' journal count');
  assert.equal(guide.roots.length,4,guide.id+' profile routes');
  assert.equal(guide.whyQuestions.length,10,guide.id+' understand why');
  assert.equal(guide.whyCases.length,16,guide.id+' situation browser');
  assert.equal(new Set(guide.whyCases.map(c=>c.situation)).size,16,guide.id+' repeated situations');
  assert.ok(guide.whyCases.every(c=>c.situation.length>=18&&c.situation.length<=115),guide.id+' unreadable scenes');
  assert.ok(guide.routes.every(route=>route.questions.length===4&&route.practice?.length>=32),guide.id+' incomplete journal');
  assert.ok(guide.sources?.length>=1,guide.id+' research sources missing');
  assert.ok(guide.safety?.length>80,guide.id+' safety notes missing');
  assert.equal(guide.hideCycle,true,guide.id+' has unwanted sequence box');
 }
});
test('50 topics display 100 full popups with 20 direct, tailored tips each',()=>{
 let count=0;
 for(const guide of HEALTH_GUIDES){
  for(const kind of ['actions','support']){
   const list=practicalPopupIdeas(guide,kind);
   assert.equal(list.length,20,guide.id+' '+kind+' suggestions hidden or filtered');
   assert.equal(new Set(list.map(x=>x.toLowerCase())).size,20,guide.id+' '+kind+' duplicate ideas');
   assert.ok(list.every(x=>x.length>=25),guide.id+' '+kind+' advice too thin');
   assert.ok(list.every(x=>!forbidden.test(x)),guide.id+' '+kind+' contains boilerplate');
   count+=list.length;
  }
 }
 assert.equal(count,2000);
});
test('privacy and physical safety distinguish sensitive sexual or medical problems',()=>{
 for(const id of clinicalRisk){
  const guide=HEALTH_BY_ID.get(id);
  assert.ok(guide, id+' missing');
  assert.equal(guide.noPersist,true,id+' notes must not automatically persist');
  assert.ok(guide.safety?.length>80,id+' no tailored safety guidance');
 }
 for(const id of HEALTH_GROUPS.sexuality){
  assert.equal(HEALTH_BY_ID.get(id).noPersist,true,id+' intimate notes must remain private');
 }
 assert.match(HEALTH_BY_ID.get('purging-urges').safety,/medical|electrolyte|urgent|heart/i);
 assert.match(HEALTH_BY_ID.get('sexual-boundary-uncertainty').safety,/consent|coercion|safety/i);
 assert.match(HEALTH_BY_ID.get('contraceptive-concerns').safety,/coercion|emergency|urgent/i);
 assert.match(HEALTH_BY_ID.get('sleep').safety,/breathing|sleep/i);
});
test('all 50 health guides use the same renderer, catalogue routes and journal popup',()=>{
 const site=readFileSync(new URL('../../site.mjs',import.meta.url),'utf8');
 const renderer=readFileSync(new URL('../../ns-mood-manual.mjs',import.meta.url),'utf8');
 const popup=readFileSync(new URL('../../ns-manual-popup-advice.mjs',import.meta.url),'utf8');
 assert.match(site,/showBodyGuide=id=>renderTopicManual/);
 assert.match(site,/bodyGuideIds\.has\(key\)\)showBodyGuide\(key\)/);
 assert.ok(renderer.includes('#navigate/area/health/body'));
 assert.ok(renderer.includes('#navigate/area/health/sexuality'));
 assert.match(renderer,/data-mood-why-browse/);
 assert.match(renderer,/data-mood-idea/);
 assert.match(popup,/culture','faith','migration','body','sexuality/);
});
