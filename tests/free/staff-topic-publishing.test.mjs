import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Publisher} from '../../publisher.mjs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {workbookForTopic} from '../../ns-integrated-workbook-data.mjs';
import {topicPageModel} from '../../ns-topic-reading-data.mjs';
import {deckForWorkbook} from '../../ns-intervention-cards.mjs';
import {NAV_THEMES,topicTheme} from '../../ns-needs-themes.mjs';
import {normalizeTopicRecord,setPublishedTopics,publishedTopicIndex,topicIsArchived,loadPublishedTopics} from '../../ns-topic-publications.mjs';

const canon=atlasProblemIndex;
const created={
 id:'new-mindful-rest-test',status:'published',original:false,domain:'growth',theme:'changes',
 title:'Making time for rest without pressure',lead:'Exploring rest and activity choices',
 definition:'Rest is an important part of everyday life and depends on health, capacity, available resources and real demands.',
 recognition:['I feel pressure to use every minute','I sometimes want permission to choose rest'],
 reframe:'Rest can be personally meaningful without needing to justify it through future productivity.',
 core:[{label:'Demands',detail:'Consider what is expected.'},{label:'Access',detail:'Consider available resources.'},
 {label:'Choice',detail:'Consider voluntary goals.'},{label:'Support',detail:'Consider who can help.'}],
 traps:[{label:'Overdoing it',detail:'More work is not always better.'}],
 steps:[{label:'Look at demand',detail:'Identify realistic limits.'},{label:'Check access',detail:'Find workable resources.'},
 {label:'Consider options',detail:'An action or rest may fit.'},{label:'Review support',detail:'Think about support.'}],
 progress:['More choice','More time for rest','More realistic expectations','Better access to support'],
 faq:[{q:'Must I do more?',a:'No. Rest can be a complete choice.'}],
 closing:'The goal is not constant productivity. Rest is something people are allowed to choose.',
 supportText:'When health or limited resources make rest difficult, consider appropriate support or adjustments.',
 sourceNote:'Staff-authored editorial topic',
 guidedPrompts:[{q:'What feels restorative?',a:'Think about one optional way to recover without a required outcome.'}],
 customTools:[{id:'simple-practice',title:'Protect a rest window',kind:'planning',
  why:'A practical opportunity can help someone plan a tolerable rest period.',
  steps:['Choose a realistic window','Notice any barrier and adjust'],worksheet:'plan'}]
};
test('published topics alter navigation, may move between themes and may be archived without modifying Atlas source',()=>{
 assert.equal(canon.length,518);
 const base=publishedTopicIndex(canon);
 assert.equal(base.length,518);
 const original=canon.find(p=>p.id==='betrayal-trauma');
 setPublishedTopics({version:1,topics:[{
  ...created,id:original.id,original:true,theme:'connection',
  title:'A revised guide to betrayal',lead:'A new editorial introductory line',
  reframe:'Trust and certainty can both be affected by betrayal in different ways.',
  status:'published'
 },created]});
 const all=publishedTopicIndex(canon);
 assert.equal(all.length,519);
 assert.equal(all.find(p=>p.id===original.id).title,'A revised guide to betrayal');
 assert.equal(topicTheme(all.find(p=>p.id===original.id)),'connection');
 assert.ok(all.some(p=>p.id===created.id&&topicTheme(p)==='changes'));
 const revised=workbookForTopic(original.id);
 assert.equal(revised.title,'A revised guide to betrayal');
 assert.match(topicPageModel(revised).reframe,/Trust and certainty/);
 const novel=workbookForTopic(created.id);
 assert.ok(novel&&novel.contextFirst);
 assert.equal(topicPageModel(novel).steps.length,4);
 assert.ok(deckForWorkbook(novel).some(c=>c.id==='staff-simple-practice'));
 assert.ok(topicPageModel(novel).guidedPrompts.length===1);
 setPublishedTopics({version:1,topics:[{...created,status:'archived'}]});
 assert.equal(topicIsArchived(created.id),true);
 assert.equal(workbookForTopic(created.id),null);
 assert.equal(publishedTopicIndex(canon).length,518);
 setPublishedTopics({version:1,topics:[]});
});
test('safety-first pages stay support-first even if staff publish editorial copy',()=>{
 setPublishedTopics({version:1,topics:[{...created,id:'suicidal-thoughts',domain:'safety',title:'Need help right now',original:true}]});
 const g=workbookForTopic('suicidal-thoughts');
 assert.equal(g.safetyFirst,true);
 assert.equal(deckForWorkbook(g).length,0);
 assert.equal(topicPageModel(g).profile.length,0);
 setPublishedTopics({version:1,topics:[]});
});
test('topic publication normalises plain-text fields and does not accept arbitrary game or theme code',()=>{
 const changed=normalizeTopicRecord({...created,customTools:[{...created.customTools[0],
  kind:'unregistered-therapy',steps:['One','Two'],title:'Change'}]});
 assert.equal(changed.customTools[0].kind,'behaviour');
 assert.equal(changed.steps.length,4);
 assert.equal(changed.faq.length,1);
 assert.equal(normalizeTopicRecord({id:'../outside',title:'Bad'}),null);
});
test('GitHub topic publishing checks the current version before committing, and never forces a ref',async()=>{
 const stored={version:1,topics:[]};
 const received=[],publisher=new Publisher('test-token');
 publisher.api=async(path,method='GET',body)=>{
  received.push({path,method,body});
  if(path.includes('/git/ref/heads/'))return {object:{sha:'HEAD_1'}};
  if(path.includes('/git/commits/'))return {tree:{sha:'TREE_1'}};
  if(path.includes('/git/trees/TREE_1'))return {tree:[{path:'topic-content.json',type:'blob',sha:'BLOB_1'}]};
  if(path.includes('/git/blobs/BLOB_1'))return {encoding:'base64',content:Buffer.from(JSON.stringify(stored)).toString('base64')};
  if(method==='POST'&&path.endsWith('/git/trees'))return {sha:'NEW_TREE'};
  if(method==='POST'&&path.endsWith('/git/commits'))return {sha:'NEW_COMMIT'};
  if(method==='PATCH'&&path.includes('/git/refs/heads/'))return {ok:true};
  throw Error('Unexpected API '+method+' '+path);
 };
 const result=await publisher.publishTopic(created,null);
 assert.equal(result.sha,'NEW_COMMIT');
 const update=received.find(x=>x.method==='POST'&&x.path.endsWith('/git/trees'));
 const posted=JSON.parse(update.body.tree[0].content);
 assert.equal(posted.topics[0].id,created.id);
 assert.equal(received.find(x=>x.method==='PATCH').body.force,false);
 await assert.rejects(publisher.publishTopic({...created,title:'Changed'},created),/changed on GitHub/);
});
test('public loader obtains published JSON and does not submit or store private staff drafts',async()=>{
 const count=await loadPublishedTopics(async()=>({ok:true,json:async()=>({version:1,topics:[created]})}));
 assert.equal(count,1);
 assert.ok(publishedTopicIndex(canon).some(p=>p.id===created.id));
 setPublishedTopics({version:1,topics:[]});
 const studio=readFileSync('ns-staff-topics.mjs','utf8'),site=readFileSync('site.mjs','utf8');
 assert.match(studio,/getPublisher\(\)\.publishTopic|publisher\.publishTopic/);
 assert.match(studio,/localStorage\.setItem/);
 assert.doesNotMatch(studio,/localStorage\.setItem\([^,]+,\s*publisher\.token/);
 assert.match(site,/await loadPublishedTopics\(\)/);
 const chooser=readFileSync('ns-intervention-chooser.mjs','utf8');
 assert.match(chooser,/g\.kind==='topic'\?'':filters\(\)/);
 assert.doesNotMatch(readFileSync('ns-topic-reading-ui.mjs','utf8'),/data-topic-pattern|data-topic-profile/);
});
