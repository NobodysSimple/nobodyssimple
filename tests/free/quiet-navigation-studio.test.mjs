import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {cleanTopicPublication,topicPublicationMarkup,topicSectionKeys} from '../../ns-topic-publications.mjs';
import {Publisher} from '../../publisher.mjs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
test('Navigation topic publications use the original safety-first guides and no new diagnostic scoring',()=>{
 const source=read('ns-topic-publications.mjs'),site=read('site.mjs');
 const data=JSON.parse(read('ns-topic-publications.json'));
 assert.equal(data.version,1);assert.equal(typeof data.topics,'object');
 assert.deepEqual(topicSectionKeys,['overview','variations','actions']);
 assert.match(site,/mountPublishedTopicEditorial\(main/);
 assert.match(site,/name === 'problem' \|\| name === 'workbook-topic'/);
 assert.match(source,/\.ns-wb-wrap/);
 assert.match(source,/Keep existing support-first warnings/);
 assert.match(source,/\.ns-wb-care-first/);
 for(const guide of ['ns-atlas-guide.mjs','ns-judgement-manual.mjs','ns-mood-manual.mjs','ns-integrated-workbook.mjs'])assert.ok(read(guide).length>2000,guide);
});
test('Staff text is plain, limited and safe to render even with HTML input',()=>{
 const clean=cleanTopicPublication({overview:'<script>alert(1)</script>',variations:'Shared patterns',actions:'Small step'});
 const html=topicPublicationMarkup(clean,'Fear of Being Judged');
 assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
 assert.ok(!html.includes('<script>'));
 assert.match(html,/Which version sounds familiar/);
 assert.match(html,/What could help next/);
 assert.equal(topicPublicationMarkup({},'Example'),'');
 assert.equal(cleanTopicPublication({overview:'X'.repeat(4000)}).overview.length,3600);
});
test('Staff topic writing commits via GitHub without editing content.json or other documents',async()=>{
 const initial={version:1,topics:{example:{overview:'Old',variations:'',actions:''}}};
 const calls=[];const base='https://api.github.com';
 const mock=async(url,options={})=>{
  calls.push({url,options});
  const file={sha:'old-sha',content:Buffer.from(JSON.stringify(initial)).toString('base64')};
  return {ok:true,status:200,json:async()=>options.method==='PUT'?{commit:{sha:'new-sha'}}:file};
 };
 const publisher=new Publisher('test-token',mock);
 const published=await publisher.publishTopicSections('example',{overview:'New explanation',variations:'Different circumstances',actions:'One safe step'});
 assert.equal(published.sha,'new-sha');
 assert.equal(calls.length,2);
 assert.ok(calls[0].url.includes('ns-topic-publications.json?ref=main'));
 assert.ok(calls[1].url.includes('ns-topic-publications.json'));
 const content=JSON.parse(Buffer.from(JSON.parse(calls[1].options.body).content,'base64').toString('utf8'));
 assert.equal(content.topics.example.overview,'New explanation');
 assert.equal(content.topics.example.actions,'One safe step');
 assert.equal(content.version,1);
 await assert.rejects(()=>publisher.publishTopicSections('../bad',{overview:'Oops'}),/Invalid topic/);
});
test('The publication staff editor exposes topic editing and the exact notebook blog markup',()=>{
 const staff=read('staff.html'),studio=read('studio.mjs');
 assert.match(staff,/data-view="topic-studio"/);
 assert.match(staff,/id="topic-studio-view"/);
 assert.match(staff,/data-view="moderation"/);
 assert.match(staff,/account\/moderation/);
 assert.match(studio,/mountTopicStudio/);
 assert.match(studio,/notebookBlogMarkup\(post,posts\)/);
 assert.match(studio,/ns-blog-notebook\.css/);
 assert.match(studio,/studio-notebook-preview/);
});
test('Reader blog no longer displays or computes reading percentage',()=>{
 const script=read('ns-blog-notebook.mjs'),css=read('ns-blog-notebook.css');
 assert.ok(script.includes('nb-contents-card'));
 assert.ok(script.includes('Read next'));
 assert.ok(!script.includes('nb-reading-percentage'));
 assert.ok(!script.includes('aria-valuenow'));
 assert.ok(!script.includes('nb-progress-track'));
 assert.ok(css.includes('nb-contents-card'));
});
test('Verified comments now publish immediately with removal, reporting and account bans',()=>{
 const app=read('account-free.mjs'),account=read('accounts.mjs'),rules=read('firestore.rules');
 assert.match(app,/await write\('approved'\)/);
 assert.match(rules,/d.status=='approved'/);
 assert.match(account,/Post comment/);
 assert.match(account,/Comments appear immediately/);
 assert.match(account,/Live comment review/);
 assert.match(app,/action==='ban'/);
 assert.match(app,/communityBans/);
 assert.match(app,/orderBy\('createdAt','desc'\)/);
 assert.match(rules,/communityBans/);
 assert.match(account,/data-mod-remove/);
});
test('Edited JS parses and CSS loads only with scoped feature classes',()=>{
 const html=read('index.html'),css=read('ns-quiet-navigation.css');
 assert.match(html,/ns-quiet-navigation\.css/);
 for(const selector of ['.ns-needs','.ns-judge','.ns-atlas-guide','.ns-guide-shell','.ns-wb-wrap'])assert.ok(css.includes(selector),selector);
 assert.match(css,/prefers-reduced-motion/);
 for(const file of ['site.mjs','studio.mjs','studio-topics.mjs','ns-topic-publications.mjs','ns-blog-notebook.mjs','account-free.mjs','accounts.mjs','publisher.mjs']){
  assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',new URL('../../'+file,import.meta.url).pathname]),file);
 }
});
