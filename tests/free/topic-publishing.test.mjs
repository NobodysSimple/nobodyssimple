import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {NAV_THEMES} from '../../ns-needs-themes.mjs';
import {atlasProblemIndex,atlasGet,allAtlasTopics} from '../../ns-atlas-core.mjs';
import {workbookForTopic} from '../../ns-integrated-workbook-data.mjs';
import {deckForWorkbook} from '../../ns-intervention-cards.mjs';
import {topicPageModel} from '../../ns-topic-reading-data.mjs';
import {normaliseTopicRecord,validateTopicManifest,installTopicManifest,activeTopicRecord,publicTopicIndex,publicTopicById,emptyTopicManifest} from '../../ns-topic-manifest.mjs';
import {Publisher} from '../../publisher.mjs';

const originalIds=new Set(atlasProblemIndex.map(p=>p.id));
const sample={
 id:'study-overload-new-guide',kind:'new',status:'published',theme:'work',domain:'work',
 title:'I am overloaded with studying',hint:'Study demands can exceed my available energy.',
 guide:{lead:'This can be difficult to untangle.',
  what:'Studying can involve unrealistic demands, access barriers and pressure.',
  recognise:['I cannot prioritise the tasks'],progress:'A manageable approach'},
 editorial:{reframe:'Study difficulty is not simply a personal motivation problem; practical conditions and resources matter.',
  recognition:['I feel behind despite working','I do not know where to start'],
  core:[{label:'Demands',detail:'Unrealistic demands'}, {label:'Capacity',detail:'Available energy'},
        {label:'Access',detail:'Relevant tools or support'},{label:'Choice',detail:'Options'}],
  steps:[{label:'Check',detail:'Describe the task'}, {label:'Adjust',detail:'Change one demand'},
         {label:'Support',detail:'Ask for help'}, {label:'Review',detail:'Check fit'}],
  faq:[{question:'Should I work harder?',answer:'Not without considering the actual demands.'}],
  progress:['More manageable demands'],supportText:'Seek appropriate support when needed.'},
 methods:[{id:'custom-study-start',type:'new',title:'Make a first study step',kind:'behaviour',worksheet:'step',
  why:'A realistic first step can reveal practical constraints.',
  steps:['Choose one small action','Decide what would signal the need to stop'],
  caution:'Stop if this is unsuitable.',
  prompts:[{id:'question-0',label:'What is one manageable action?',hint:'A reversible option'}]}]
};
const override={
 id:'rumination',kind:'override',status:'published',theme:'connection',
 title:'Replaying a conversation',hint:'Unwanted review of a social moment.',
 guide:{what:'Going over a conversation can have several explanations and does not establish the reason on its own.',
  recognise:['I replay conversations with other people']},
 editorial:{reframe:'Replaying can involve uncertainty, attention and a wish to understand what happened.',
  recognition:['I keep going over a conversation'],
  faq:[{question:'Is this normal?',answer:'Repetition can have several explanations.'}]},
 methods:[{id:'source-context-0',type:'override',title:'Check practical conditions',
  why:'Identify relevant practical demands and needs.',
  steps:['Describe the context','Consider an adjustment'],
  prompts:[{id:'question-0',label:'Which condition matters?',hint:'An environmental factor'}]}]
};
const hidden={id:'betrayal-trauma',kind:'override',status:'deleted',theme:'connection',title:'Betrayal',hint:'',guide:{},editorial:{},methods:[]};
const fixture={version:1,topics:[sample,override,hidden]};

test('new, edited, moved and hidden topics work through public catalogue and guides',()=>{
 installTopicManifest(emptyTopicManifest());
 assert.equal(atlasProblemIndex.length,518);
 const clean=validateTopicManifest(fixture,{existingIds:originalIds});
 assert.equal(clean.topics.length,3);
 installTopicManifest(clean);
 try{
  assert.equal(allAtlasTopics().length,518,'one created and one hidden leaves the original count');
  assert.equal(atlasGet('betrayal-trauma'),null);
  assert.equal(workbookForTopic('betrayal-trauma'),null);
  assert.equal(atlasGet(sample.id)?.theme,'work');
  const newer=workbookForTopic(sample.id);
  assert.equal(newer.title,sample.title);
  assert.equal(newer.contextFirst,true);
  assert.match(topicPageModel(newer).reframe,/practical conditions and resources/);
  const card=deckForWorkbook(newer).find(c=>c.id==='custom-study-start');
  assert.ok(card);
  assert.equal(card.prompts[0].label,'What is one manageable action?');
  const edited=workbookForTopic('rumination');
  assert.equal(edited.title,override.title);
  assert.equal(atlasGet('rumination')?.theme,'connection');
  assert.match(topicPageModel(edited).reframe,/uncertainty, attention/);
  const original=deckForWorkbook(edited).find(c=>c.id==='source-context-0');
  assert.equal(original.title,'Check practical conditions');
  assert.equal(original.prompts[0].label,'Which condition matters?');
  assert.ok(workbookForTopic('suicidal-thoughts').safetyFirst);
  assert.equal(deckForWorkbook(workbookForTopic('suicidal-thoughts')).length,0);
 }finally{installTopicManifest(emptyTopicManifest());}
 assert.equal(atlasGet('betrayal-trauma')?.id,'betrayal-trauma','bundled content restored on manifest reset');
 assert.equal(allAtlasTopics().length,518);
});
test('manifest rejects duplicate IDs, untrusted URLs, unsafe structures and base-id recreation',()=>{
 assert.equal(NAV_THEMES.length,11);
 assert.throws(()=>validateTopicManifest({version:99,topics:[]}),/unsupported/);
 assert.throws(()=>validateTopicManifest({version:1,topics:[sample,sample]}),/Repeated topic/);
 assert.throws(()=>validateTopicManifest({version:1,topics:[{...sample,id:'rumination'}]},{existingIds:originalIds}),/Cannot create another topic/);
 assert.throws(()=>normaliseTopicRecord({...sample,theme:'nonexistent'}),/theme/);
 assert.throws(()=>normaliseTopicRecord({...sample,source:{name:'Bad URL',url:'javascript:alert(1)'}}),/HTTPS/);
 assert.throws(()=>normaliseTopicRecord({...sample,methods:[{id:'bad/script',type:'new',kind:'behaviour',worksheet:'step'}]}),/identifier/);
});
test('bundled safety-first topics stay protected despite editorial edits',()=>{
 const dangerous={id:'suicidal-thoughts',kind:'override',status:'published',theme:'mood',
  title:'A revised supporting title',hint:'',guide:{what:'A staff-authored explanation'},
  editorial:{reframe:'A new explanatory idea.'},methods:[{
   id:'custom-bad-task',type:'new',title:'Unsafe method',kind:'behaviour',worksheet:'step',why:'Unhelpful',
   steps:['Do X','Do Y']}]};
 installTopicManifest({version:1,topics:[dangerous]});
 try{
  const guide=workbookForTopic('suicidal-thoughts');
  assert.equal(guide.safetyFirst,true);
  assert.equal(deckForWorkbook(guide).length,0);
 }finally{installTopicManifest(emptyTopicManifest());}
});
test('GitHub publisher reads Unicode, commits topic changes atomically and refuses stale edits',async()=>{
 const initial={version:1,topics:[]};
 let contents=initial,sha='old-blob',putCount=0,lastBody=null;
 const encode=x=>Buffer.from(JSON.stringify(x),'utf8').toString('base64');
 const request=async(url,opts)=>{
  const method=opts.method;
  if(!url.endsWith('/contents/topic-pages.json')&&!url.includes('/contents/topic-pages.json?'))throw Error('Unexpected endpoint: '+url);
  if(method==='GET'){
   return new Response(JSON.stringify({sha,content:encode(contents)}),{status:200,headers:{'content-type':'application/json'}});
  }
  if(method==='PUT'){
   assert.equal(opts.headers.Authorization,'Bearer github-test-token');
   const payload=JSON.parse(opts.body);
   assert.equal(payload.sha,sha);
   contents=JSON.parse(Buffer.from(payload.content,'base64').toString('utf8'));
   assert.match(contents.topics[0].title,/Replaying/);
   sha='updated-'+(++putCount);
   lastBody=payload;
   return new Response(JSON.stringify({content:{sha},commit:{sha:'test-commit-'+putCount}}),{status:200,headers:{'content-type':'application/json'}});
  }
  throw Error('Unexpected method '+method);
 };
 const writer=new Publisher('github-test-token',request);
 const before=await writer.topicSnapshot();
 const result=await writer.publishTopics({version:1,topics:[override]},before.sha);
 assert.equal(result.sha,'updated-1');
 assert.equal(putCount,1);
 assert.equal((await writer.topicSnapshot()).data.topics[0].id,'rumination');
 assert.match(lastBody.message,/Publish topic library/);
 await assert.rejects(()=>writer.publishTopics({version:1,topics:[override]},before.sha),/changed on GitHub/);
 assert.equal(putCount,1);
});
test('staff console remains a separate GitHub-authenticated publishing surface',()=>{
 const staff=readFileSync('staff.html','utf8');
 const studio=readFileSync('studio.mjs','utf8');
 const site=readFileSync('site.mjs','utf8');
 assert.match(staff,/data-view="topics"/);
 assert.match(staff,/id="topic-studio-root"/);
 assert.match(studio,/new TopicStudio/);
 assert.match(studio,/topicDrafts/);
 assert.match(site,/installTopicManifest\(await response.json\(\)\)/);
 assert.ok(site.indexOf('installTopicManifest(await')<site.lastIndexOf('route();'));
 assert.match(readFileSync('ns-topic-studio.mjs','utf8'),/data-desk-publish/);
 assert.match(readFileSync('ns-topic-studio.mjs','utf8'),/data-desk-boolean="safetyFirst"/);
});
