import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {topicsInTheme} from '../../ns-needs-themes.mjs';
import {ACCESS_GUIDES,ACCESS_IDS,ACCESS_BY_ID,ACCESS_GROUPS} from '../../ns-access-manual-data.mjs';
import {practicalPopupIdeas} from '../../ns-manual-popup-advice.mjs';

const boilerplate=/^(?:ask a trusted person about the practical concern|request support for this possible step|talk this through with someone who listens|consider whether this is relevant to your situation|explore what would need to change before attempting this|use this worked example to ask)/i;

test('all 42 actual Neurodivergence & Disability topics are authored and routed',()=>{
 const expected=topicsInTheme(atlasProblemIndex,'access');
 assert.equal(expected.length,42);
 assert.equal(ACCESS_IDS.length,42);
 assert.equal(ACCESS_BY_ID.size,42);
 assert.equal(ACCESS_GROUPS.neuro.length,23);
 assert.equal(ACCESS_GROUPS.disability.length,19);
 assert.deepEqual(new Set(ACCESS_IDS),new Set(expected.map(x=>x.id)));
});

test('every field guide offers its own substantive article, four journals and clear situation cards',()=>{
 const intros=new Set();
 let sceneCount=0,journalCount=0;
 for(const g of ACCESS_GUIDES){
  assert.equal(g.article.length,10,g.id);
  assert.ok(g.article.join(' ').split(/\s+/).length>=405,g.id+' thin article');
  assert.ok(!intros.has(g.article[0]),g.id+' recycled opening');
  intros.add(g.article[0]);
  assert.equal(g.routes.length,4,g.id);
  assert.ok(g.routes.every(r=>r.questions.length===4&&r.practice.length>=20),g.id+' incomplete journal');
  assert.equal(g.roots.length,4,g.id);
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.equal(g.whyStages.length,10,g.id);
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(new Set(g.whyCases.map(x=>x.situation)).size,16,g.id+' repeated scene');
  assert.ok(g.whyCases.every(x=>x.situation.length>=18&&x.situation.length<=115),g.id+' unreadable scene');
  assert.equal(g.hideCycle,true,g.id+' unrequested conditions panel');
  assert.ok(g.safety.length>=90,g.id+' safety guidance');
  assert.ok(g.sources.length>=1,g.id+' missing research reference');
  sceneCount+=g.whyCases.length;
  journalCount+=g.routes.length;
 }
 assert.equal(journalCount,168);
 assert.equal(sceneCount,672);
});

test('both twenty-item advice popups are direct, individually written and not truncated',()=>{
 const all=new Set();
 for(const g of ACCESS_GUIDES){
  for(const kind of ['actions','support']){
   const list=practicalPopupIdeas(g,kind);
   assert.equal(list.length,20,g.id+' '+kind+' should display 20 suggestions');
   assert.equal(new Set(list).size,20,g.id+' '+kind+' duplicate suggestions');
   for(const line of list){
    assert.ok(line.length>=20,g.id+' overly short instruction');
    assert.ok(!boilerplate.test(line),g.id+' mechanical popup instruction');
    assert.ok(!all.has(line),g.id+' advice duplicated elsewhere in access catalogue: '+line);
    all.add(line);
   }
  }
 }
 assert.equal(all.size,1680);
});

test('sensitive care and medical topics protect journal privacy, consent and physical safety',()=>{
 for(const id of ['medical-trauma','care-dependence-autonomy','disability-benefits-pressure','medicine-side-effects','medical-gaslighting','diagnostic-delay','healthcare-access-discrimination','neurodivergent-masking']){
  const g=ACCESS_BY_ID.get(id);
  assert.equal(g.noPersist,true,id+' should not keep sensitive notes');
 }
 assert.match(ACCESS_BY_ID.get('pacing-and-energy').safety,/post-exertional|pushing|graded exercise/i);
 assert.match(ACCESS_BY_ID.get('long-covid-experiences').safety,/post-exertional|exertion/i);
 assert.match(ACCESS_BY_ID.get('care-dependence-autonomy').safety,/coercion|safeguarding|danger|abuse/i);
 assert.match(ACCESS_BY_ID.get('autistic-shutdown').safety,/neurological|speech|medical/i);
 assert.match(ACCESS_BY_ID.get('tics-and-tourette').safety,/involuntary|assessment|tic/i);
});

test('shared modern renderer routes neuro and disability correctly without extra components',()=>{
 const site=readFileSync(new URL('../../site.mjs',import.meta.url),'utf8');
 const mood=readFileSync(new URL('../../ns-mood-manual.mjs',import.meta.url),'utf8');
 const popup=readFileSync(new URL('../../ns-manual-popup-advice.mjs',import.meta.url),'utf8');
 assert.match(site,/showAccessGuide=id=>renderTopicManual/);
 assert.match(site,/accessGuideIds\.has\(options\.topic\)\)return showAccessGuide/);
 assert.match(site,/accessGuideIds\.has\(selected\.target\)\)return showAccessGuide/);
 assert.match(site,/accessGuideIds\.has\(key\)\)showAccessGuide\(key\)/);
 assert.ok(mood.includes('#navigate/area/access/neuro'));
 assert.ok(mood.includes('#navigate/area/access/disability'));
 assert.match(mood,/data-mood-why-browse/);
 assert.match(mood,/data-mood-idea/);
 assert.match(popup,/'neuro','disability'/);
});
