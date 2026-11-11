import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex,isSafetyPriority} from '../../ns-atlas-core.mjs';
import {workbookForTopic} from '../../ns-integrated-workbook-data.mjs';
import {topicPageModel} from '../../ns-topic-reading-data.mjs';
import {renderTopicQuickNav,renderTopicReadingStart,renderTopicReadingEnd,renderTopicSafetyReading} from '../../ns-topic-reading-ui.mjs';

test('every one of 518 topic pages has a readable recognition-first model and support information',()=>{
 assert.equal(atlasProblemIndex.length,518);
 let safety=0,context=0;
 for(const entry of atlasProblemIndex){
  const guide=workbookForTopic(entry.id),model=topicPageModel(guide);
  assert.ok(guide&&model,entry.id);
  assert.equal(model.id,entry.id);
  assert.ok(model.recognition.length>=2,entry.id+' recognition is too sparse');
  assert.ok(model.reframe.length>=45,entry.id+' missing central explanatory idea');
  assert.equal(model.core.length,4,entry.id+' missing four-part context');
  assert.equal(model.steps.length,4,entry.id+' missing four optional directions');
  assert.ok(model.traps.length>=3,entry.id+' missing common difficulties');
  assert.equal(model.progress.length,4,entry.id+' missing progress markers');
  assert.ok(model.faq.length>=4,entry.id+' missing practical FAQs');
  assert.ok(model.supportText.length>60,entry.id+' missing support guidance');
  assert.ok(model.closing.length>60,entry.id+' missing compassionate ending');
  assert.ok(model.steps.every(s=>s.label&&s.detail),entry.id+' incomplete plan text');
  if(guide.contextFirst)context++;
  if(isSafetyPriority(entry.id)){
   safety++;
   assert.equal(model.profile.length,0,entry.id+' must not prompt risky self-assessment');
   assert.equal(renderTopicReadingStart(guide),'',entry.id);
   assert.equal(renderTopicReadingEnd(guide),'',entry.id);
   assert.equal(renderTopicQuickNav(guide),'',entry.id);
   assert.match(renderTopicSafetyReading(guide),/no checklist, score, journal or behavioural experiment/i,entry.id);
  }else{
   const top=renderTopicReadingStart(guide),bottom=renderTopicReadingEnd(guide);
   for(const piece of ['ns-topic-recognition','ns-pick-definition','ns-topic-profile','ns-topic-framework','ns-topic-steps'])
    assert.ok(top.includes(piece),entry.id+' lacks '+piece);
   for(const piece of ['ns-topic-progress','ns-topic-faq-list','ns-topic-support','ns-topic-ending'])
    assert.ok(bottom.includes(piece),entry.id+' lacks '+piece);
   if(guide.supportFirst){
    assert.doesNotMatch(top,/data-topic-pattern|data-topic-profile/,entry.id+' should not prompt private disclosures');
    assert.match(top,/safety and privacy come first/i,entry.id);
   }else{
    assert.equal((top.match(/data-topic-pattern=/g)||[]).length,4,entry.id+' expected four optional factors');
    assert.match(top,/not a diagnostic checklist or a score/i,entry.id);
   }
   if(guide.medical)assert.match(top,/appropriate healthcare assessment/i,entry.id);
   assert.ok(renderTopicQuickNav(guide).includes('data-topic-jump'),entry.id+' missing section jumps');
  }
 }
 assert.ok(safety>=20,'safety exceptions no longer reachable');
 assert.ok(context>=350,'inclusive editorial topics need recognition first');
});
test('the betrayal-specific page has meaningful injuries, traps, future-trust advice and consent-aware answers',()=>{
 const guide=workbookForTopic('betrayal-trauma');
 const model=topicPageModel(guide),start=renderTopicReadingStart(guide),end=renderTopicReadingEnd(guide);
 assert.deepEqual(model.core.map(i=>i.label),[
  'Relationship loss','Certainty about events','Sense of safety','Confidence in your judgment'
 ]);
 assert.deepEqual(model.steps.map(i=>i.label),[
  'Understand enough','Acknowledge the impact','Rebuild self-trust','Choose future trust carefully'
 ]);
 assert.match(start,/The four injuries that betrayal can affect/);
 assert.match(start,/Four areas of rebuilding/);
 assert.match(start,/not a diagnostic checklist or a score/i);
 assert.match(end,/Do I need to forgive them/);
 assert.match(end,/accountability/);
 assert.match(end,/not to erase what happened/);
 assert.doesNotMatch(end,/guarantee|always heal|everyone will/i);
});
test('identity, access, social inequality and health pages retain epistemic and autonomy safeguards',()=>{
 for(const id of ['gender-identity-exploration','autism-understanding','racial-discrimination','religious-belonging','class-discrimination','insomnia','panic-experiences']){
  const guide=workbookForTopic(id),model=topicPageModel(guide);
  assert.ok(model&&model.steps.length===4,id);
  assert.ok(model.supportText,id);
  assert.doesNotMatch(model.reframe,/is caused by your|proves that you|must forgive|must recover/i,id);
 }
 const gender=topicPageModel(workbookForTopic('gender-identity-exploration'));
 assert.match(gender.reframe,/not problems to cure/);
 const autism=topicPageModel(workbookForTopic('autism-understanding'));
 assert.match(autism.reframe,/poor fit between a person and their environment/);
 const physical=topicPageModel(workbookForTopic('insomnia'));
 assert.match(physical.supportText,/healthcare assessment/);
 const suicide=topicPageModel(workbookForTopic('suicidal-thoughts'));
 assert.match(suicide.supportText,/999/);
});
test('page redesign preserves existing method decks, journal draft controls and visual game carousels',()=>{
 const chooser=readFileSync('ns-intervention-chooser.mjs','utf8');
 const html=chooser.slice(chooser.indexOf('function layout(g)'),chooser.indexOf('function valuesFrom(host)'));
 for(const expected of [
  'renderTopicReadingStart(g)','renderTopicReadingEnd(g)','renderTopicSafetyReading(g)',
  'renderTopicQuickNav(g)','chooser()','data-pick-selected','data-ns-games-host','dialogMarkup()','sources(g)'
 ])assert.ok(html.includes(expected),expected+' missing');
 for(const expected of ['const drafts=new Map()','data-pick-review','data-pick-download','data-pick-clear',
  'renderGameCarousel(surface.querySelector(\'[data-ns-games-host]\'),g)','bindTopicProfile(surface)','bindTopicJumps(surface)']){
  assert.ok(chooser.includes(expected),expected+' missing');
 }
 assert.doesNotMatch(chooser,/localStorage|sessionStorage|sendBeacon|fetch\(/);
 const ui=readFileSync('ns-topic-reading-ui.mjs','utf8');
 assert.match(ui,/data-topic-jump="ns-pick-chooser"/);
 assert.doesNotMatch(ui,/href="#ns-pick-chooser"|href="#ns-topic-/, 'internal anchors would break hash-based routing');
 assert.match(ui,/fieldset\.addEventListener\('change',update\)/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|fetch\(|sendBeacon/);
});
