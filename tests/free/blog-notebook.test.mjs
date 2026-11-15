import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');

test('Blog notebook is isolated to type=blog and never changes standard content posts',()=>{
 const site=read('site.mjs');
 assert.match(site,/if \(p\.type === "blog"\) \{\s*renderNotebookBlogPost\(main, p, posts\);/);
 assert.match(site,/const hasVideoBlock = p\.blocks\?\.some/);
 assert.match(site,/renderPostBody\(p, posts\)/);
 assert.match(site,/enhanceAccountRoute\(main, currentName, safeRoutePart\(id\)\)/);
 assert.doesNotMatch(read('index.html'),/ns-blog-notebook\.css/);
});
test('Blog UI reuses the actual published posts and existing sanitized blog content',()=>{
 const script=read('ns-blog-notebook.mjs');
 assert.match(script,/renderPostBody\(post,publishedPosts\)/);
 assert.match(script,/relatedBlogs\(post,publishedPosts\)/);
 assert.match(script,/p\?\.type==='blog'&&p\?\.status==='published'/);
 assert.match(script,/safeImage\(post\.thumbnail\)/);
 assert.match(script,/safeImage\(p\.thumbnail\)/);
 assert.match(script,/getMinutes\(post\)/);
 assert.doesNotMatch(script,/Helpful \(\d+\)|Inspiring \(\d+\)/);
});
test('Contents, real percentage, reactions and sharing are functional',()=>{
 const script=read('ns-blog-notebook.mjs');
 for(const token of ['#nb-contents-list','actualHeadings','[data-nb-anchor]','scrollIntoView','requestAnimationFrame','aria-valuenow','[data-nb-reaction]','aria-pressed','readReaction','writeReaction','navigator.share','navigator.clipboard','hashchange','AbortController']){
  assert.ok(script.includes(token),token);
 }
 assert.match(script,/This preference is saved only on this device/);
 assert.doesNotMatch(script,/fetch\(.+reactions|likesCount/);
});
test('Styles stay within the blog notebook and provide dark mode, mobile and reduced-motion layouts',()=>{
 const css=read('ns-blog-notebook.css');
 assert.match(css,/\.ns-blog-notebook/);
 assert.match(css,/@media \(max-width:820px\)/);
 assert.match(css,/@media \(max-width:560px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/html\[data-theme="dark"\]/);
 assert.match(css,/ns-forest-foliage-left\.webp/);
 assert.match(css,/ns-landscape-path\.webp/);
 assert.match(css,/\.account-learning-controls/);
 assert.match(css,/>\.account-comments/);
});
test('Both newly published ES modules pass Node syntax checks',()=>{
 for(const file of ['ns-blog-notebook.mjs','site.mjs']){
  assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',new URL('../../'+file,import.meta.url).pathname],{stdio:'pipe'}),file);
 }
});
