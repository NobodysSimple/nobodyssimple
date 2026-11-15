import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {topicTheme,topicsInTheme,TOPIC_THEME_OVERRIDES} from '../../ns-needs-themes.mjs';
import {CHANGES_GUIDES,CHANGES_IDS,CHANGES_BY_ID,CHANGES_GROUPS} from '../../ns-changes-guide-data.mjs';
import {CONNECTION_IDS} from '../../ns-connection-guide-data.mjs';
import {verifiedCompleted,catalogueProgress} from '../../ns-catalogue-progress.mjs';

const words=x=>x.join(' ').trim().split(/\s+/).length;

test('all 49 topics in Life changes, grief & growth have their own authored manual',()=>{
 const expected=topicsInTheme(atlasProblemIndex,'changes');
 assert.equal(expected.length,49);
 assert.equal(CHANGES_GUIDES.length,49);
 assert.equal(CHANGES_IDS.length,49);
 assert.equal(CHANGES_BY_ID.size,49);
 assert.deepEqual(new Set(CHANGES_IDS),new Set(expected.map(x=>x.id)));
 assert.deepEqual(Object.fromEntries(Object.entries(CHANGES_GROUPS).map(([k,v])=>[k,v.length])),
  {change:10,trauma:14,lifespan:13,growth:12});
 for(const g of CHANGES_GUIDES){
  assert.equal(g.article.length,10,g.id);
  assert.ok(words(g.article)>=400,g.id+' requires substantial original prose');
  assert.ok(g.article.every(p=>p.split(/\s+/).length>=25),g.id);
  assert.equal(g.profiles.length,4,g.id);
  assert.equal(g.mechanisms.length,3,g.id);
  assert.ok(g.safety.length>65,g.id);
  assert.ok(g.sources[0][1].startsWith('https://'),g.id);
  assert.ok(g.evidence.includes('educational'),g.id);
 }
 assert.equal(new Set(CHANGES_GUIDES.map(g=>g.article[0])).size,49,'recycled introduction');
});

test('all 196 journal routes have individual situation prompts and choices',()=>{
 const opts=[];
 for(const g of CHANGES_GUIDES){
  assert.equal(g.routes.length,4,g.id);
  assert.equal(g.roots.length,4,g.id);
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.equal(g.whyStages.length,10,g.id);
  for(const [i,r] of g.routes.entries()){
   assert.equal(r.questions.length,4,g.id);
   assert.ok(r.questions[0][0].includes(g.whyCases[4*i].situation),g.id);
   assert.ok(r.description.length>100,g.id);
   assert.ok(r.practice.length>32,g.id);
   for(const q of r.questions)assert.ok(q[0].length>45&&q[1].length>35&&q[2].length>34,g.id);
   opts.push(r.practice);
  }
 }
 assert.equal(opts.length,196);
 assert.equal(new Set(opts).size,196,'all route actions should remain topic- and route-specific');
});

test('all 784 illustrative scenario perspectives and 24 practical suggestions are available',()=>{
 for(const g of CHANGES_GUIDES){
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(new Set(g.whyCases.map(c=>c.situation)).size,16,g.id);
  assert.ok(g.whyCases.every(c=>g.roots.some(r=>r[0]===c.root)),g.id);
  assert.ok(g.whyIntro.length>200,g.id);
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.equal(g.ideas.support.length,24,g.id);
  assert.equal(new Set(g.ideas.actions).size,24,g.id);
  assert.equal(g.now.steps.length,3,g.id);
 }
});

test('high-risk manuals prioritise privacy and do not present traumatic material as a self-help exposure',()=>{
 for(const g of CHANGES_GUIDES.filter(g=>g.domain==='trauma'))assert.equal(g.noPersist,true,g.id);
 for(const id of ['grief-after-suicide','trauma-reminders','traumatic-loss',
                  'new-parent-identity','end-of-life-anxiety','menopause-life-change']){
  const g=CHANGES_BY_ID.get(id);
  assert.ok(g.prominentSafety.length>=65,id);
 }
 assert.match(CHANGES_BY_ID.get('grief-after-suicide').safety,/suicid|safe|support/i);
 assert.match(CHANGES_BY_ID.get('complex-trauma-history').safety,/exposure|trauma/i);
 assert.match(CHANGES_BY_ID.get('new-parent-identity').safety,/psychosis|clinical/i);
 assert.match(CHANGES_BY_ID.get('menopause-life-change').safety,/medical/i);
 assert.match(CHANGES_BY_ID.get('ageism').safety,/discrimination|legal/i);
});

test('the nine related topics remain with Relationships & connection, without double ownership',()=>{
 const already=Object.keys(TOPIC_THEME_OVERRIDES);
 const connection=new Set(CONNECTION_IDS);
 for(const id of already){
  assert.equal(topicTheme(atlasProblemIndex.find(p=>p.id===id)),'connection',id);
  assert.ok(connection.has(id),id+' existing manual');
  assert.ok(!CHANGES_BY_ID.has(id),id+' duplicate manual');
 }
 assert.equal(catalogueProgress.find(g=>g.theme==='changes').pending.length,0);
 assert.ok(CHANGES_IDS.every(id=>verifiedCompleted.includes(id)));
});

test('the live router uses the existing field-guide format with correct returns',()=>{
 const site=readFileSync('site.mjs','utf8');
 const template=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(site,/changesGuideIds\.has\(options\.topic\)/);
 assert.match(site,/changesGuideIds\.has\(selected\.target\)/);
 assert.match(site,/changesGuideIds\.has\(key\)/);
 assert.match(site,/showChangesGuide=id=>renderTopicManual/);
 for(const domain of ['change','trauma','lifespan','growth'])
  assert.ok(template.includes('#navigate/area/changes/'+domain),domain);
});
