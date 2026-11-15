import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const source=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const helloId='c045368d-ce46-416f-8ce7-5245e0e30199';
const appVersion='hello-notebook-20261115-2';
test('Existing published Hello blog retains its ID, writing and original artwork',()=>{
 const data=JSON.parse(source('content.json'));
 const hello=data.posts.find(post=>post.id===helloId);
 assert.ok(hello,'Original Hello blog ID still exists');
 assert.equal(hello.type,'blog');
 assert.equal(hello.status,'published');
 assert.equal(hello.title,'Hello!');
 assert.equal(hello.destinations[0],'blog');
 assert.match(hello.intro,/I’m Drew, the founder of Nobody’s Simple/);
 assert.match(hello.body,/psychology content available/);
 assert.equal(hello.thumbnail,'banner.png');
 assert.equal(hello.blocks[0].type,'image');
 assert.match(hello.blocks[0].src,/waving/);
 const headings=hello.blocks.filter(b=>b.type==='heading').map(b=>b.text);
 assert.ok(headings.includes('Problems I see in modern psychology content'));
 assert.ok(headings.includes('Why this matters in the age of AI'));
 assert.ok(headings.includes('Where I want this to go'));
});
test('HTML bypasses previously cached app JS and loads versioned notebook code',()=>{
 const html=source('index.html'),site=source('site.mjs'),notebook=source('ns-blog-notebook.mjs');
 assert.ok(html.includes('site.mjs?v=learn-artfix-fhs-20261115'));
 assert.ok(site.includes('ns-blog-notebook.mjs?v='+appVersion));
 assert.ok(notebook.includes('ns-blog-notebook.css?v='+appVersion));
 assert.match(site,/if \(p\.type === "blog"\) \{\s*renderNotebookBlogPost\(main, p, posts\);/);
 assert.ok(!html.includes('<link rel="stylesheet" href="ns-blog-notebook.css'));
});
test('Hello content actually renders all heading levels and has dedicated introduction styling',()=>{
 const notebook=source('ns-blog-notebook.mjs'),css=source('ns-blog-notebook.css');
 assert.ok(notebook.includes('.ns-blog-body h2, .ns-blog-body h3, .ns-blog-body h4'));
 assert.ok(notebook.includes('level:Number(node.tagName.slice(1))'));
 assert.ok(css.includes('.ns-blog-notebook[data-blog-id="'+helloId+'"] .ns-blog-body > .block-image:first-child'));
 assert.ok(css.includes('@media(max-width:560px)'));
 assert.ok(notebook.includes('Explore Wisbody'));
 assert.ok(notebook.includes('Explore the Learn library'));
});
test('Service worker updates the cached shell and preloads the notebook assets',()=>{
 const sw=source('sw.js');
 assert.match(sw,/nobodyssimple-release-v\\d+-[a-z-]+/);
 assert.ok(sw.includes("'ns-blog-notebook.css'"));
 assert.ok(sw.includes("'ns-blog-notebook.mjs'"));
});
test('Changed JS passes parsing',()=>{
 for(const path of ['site.mjs','ns-blog-notebook.mjs']){
  assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',new URL('../../'+path,import.meta.url).pathname]),path);
 }
});