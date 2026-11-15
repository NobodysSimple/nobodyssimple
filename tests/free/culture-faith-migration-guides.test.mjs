import test from 'node:test';
import assert from 'node:assert/strict';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {workbookForTopic} from '../../ns-integrated-workbook-data.mjs';
import {cfmGuide,cfmGuideIds} from '../../ns-cfm-guides.mjs';
import {renderTopicReadingStart,renderTopicReadingEnd,renderTopicQuickNav} from '../../ns-topic-reading-ui.mjs';

const domains=['culture','faith','migration'];
const targets=atlasProblemIndex.filter(x=>domains.includes(x.domain));
test('every Culture, Faith and Migration catalogue topic has one distinct manual',()=>{
 assert.equal(targets.length,45);
 assert.equal(cfmGuideIds.length,45);
 assert.deepEqual(new Set(cfmGuideIds),new Set(targets.map(x=>x.id)));
 const opens=new Set();
 const journals=new Set();
 for(const x of targets){
  const guide=cfmGuide(x.id);
  assert.ok(guide,x.id);
  assert.equal(guide.domain,x.domain,x.id);
  assert.ok(guide.opening.length>=300,x.id+' needs more than a generic sentence');
  assert.ok(guide.why.length>280,x.id+' needs a specific explanation');
  assert.equal(guide.versions.length,3,x.id+' requires distinct routes');
  assert.equal(guide.questions.length,5,x.id+' requires guided prompts');
  assert.ok(guide.questions.every(q=>q.length>28),x.id+' has a weak question');
  assert.ok(guide.versions.every(v=>v.length===3&&v[0].length>=8&&v[1].length>15&&v[2].length>15),x.id+' routes incomplete');
  assert.ok(guide.closing.length>45,x.id+' closing not authored');
  assert.ok(guide.sources.every(x=>x.url.startsWith('https://')),x.id+' source link invalid');
  assert.ok(!opens.has(guide.opening),x.id+' has repeated opening');
  assert.ok(!journals.has(guide.journalTitle),x.id+' has repeated journal title');
  opens.add(guide.opening);
  journals.add(guide.journalTitle);
 }
});
test('all 45 authored pages preserve the topic shell and contain their own reading, routes and journal',()=>{
 for(const topic of targets){
  const workbook=workbookForTopic(topic.id);
  const data=cfmGuide(topic.id);
  assert.ok(workbook,'Missing workbook '+topic.id);
  const start=renderTopicReadingStart(workbook),end=renderTopicReadingEnd(workbook);
  for(const className of ['ns-topic-recognition','ns-pick-definition','ns-topic-profile','ns-topic-framework','ns-topic-steps','ns-cfm-journal']){
   assert.ok(start.includes(className),topic.id+': '+className);
  }
  for(const className of ['ns-topic-progress','ns-topic-faq-list','ns-topic-support','ns-topic-ending']){
   assert.ok(end.includes(className),topic.id+': '+className);
  }
  assert.equal((start.match(/data-topic-pattern=/g)||[]).length,4,topic.id);
  assert.equal((start.match(/data-cfm-step=/g)||[]).length,5,topic.id);
  assert.equal((start.match(/data-cfm-version=/g)||[]).length,3,topic.id);
  assert.ok(start.includes(data.journalTitle),topic.id+' lost its journal');
  assert.ok(start.includes('not a diagnostic checklist or a score'),topic.id);
  assert.ok(start.includes('not automatically saved'),topic.id+' privacy notice missing');
  assert.ok(renderTopicQuickNav(workbook).includes('data-topic-jump'),topic.id);
 }
});
test('higher-risk legal, safety and faith experiences emphasise privacy and do not prescribe confrontation',()=>{
 for(const id of ['asylum-stress','migrant-work-exploitation','racial-profiling','religious-trauma','faith-community-pressure','religious-family-conflict']){
  const rendered=renderTopicReadingStart(workbookForTopic(id));
  assert.match(rendered,/monitor this device/i,id);
  assert.match(rendered,/without typing/i,id);
 }
 for(const id of ['migrant-work-exploitation','asylum-stress']){
  const guide=cfmGuide(id);
  assert.match(guide.why,/legal|asylum|safety|employment|housing/i,id);
 }
});
