import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {LEARN_COURSE_IDEAS,renderCourseHub} from '../../ns-learn-courses.mjs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const scenic=['hero','featured','emotions','relationships','boundaries','focus','communication'];

test('Every new scene is mascot-free botanical SVG artwork rather than a composite portrait',()=>{
 for(const name of scenic){
  const path='learn-art/scenery-'+name+'.svg';
  assert.ok(existsSync(new URL('../../'+path,import.meta.url)),path);
  const svg=read(path);
  assert.match(svg,/^<\?xml version="1\.0"/);
  assert.match(svg,/<svg\b[^>]+viewBox=/);
  assert.match(svg,/<\/svg>\s*$/);
  assert.match(svg,/<path\b/);
  assert.match(svg,/<circle\b/);
  assert.match(svg,/hills and botanical scenery without people/);
  assert.doesNotMatch(svg,/<image\b|<foreignObject\b|<text\b|<use\b/i);
 }
});
test('No Learn card combines a portrait-containing source image with another portrait layer',()=>{
 const changed=['emotions','relationships','boundaries','focus','communication'];
 for(const id of changed){
  const card=LEARN_COURSE_IDEAS.find(item=>item.id===id);
  assert.equal(card.landscape,'learn-art/scenery-'+id+'.svg');
  assert.match(card.mascot,/^ns-character-[a-z-]+\.webp$/);
 }
 const clean=['self-trust','overthinking','confidence','habits','uncertainty'];
 for(const id of clean){
  assert.match(LEARN_COURSE_IDEAS.find(item=>item.id===id).landscape,/^ns-landscape-[a-z-]+\.webp$/);
 }
 assert.equal(new Set(LEARN_COURSE_IDEAS.map(c=>c.landscape)).size,10,
  'Each course subject should have its own unique landscape artwork');
});
test('Learn hero and featured panel each have one intentional mascot and no extra props or sun',()=>{
 const root={innerHTML:''};
 renderCourseHub(root);
 const html=root.innerHTML;
 const hero=html.slice(html.indexOf('class="ns-courses-hero__figure"'),html.indexOf('</section>'));
 assert.equal((hero.match(/<img /g)||[]).length,1);
 assert.match(hero,/ns-character-reading\.webp/);
 assert.doesNotMatch(hero,/ns-prop-book|ns-prop-cup/);
 const feature=html.slice(html.indexOf('class="ns-courses-feature__visual"'),html.indexOf('class="ns-courses-feature__copy"'));
 assert.equal((feature.match(/<img /g)||[]).length,2,'One landscape plus one mascot');
 assert.match(feature,/scenery-featured\.svg/);
 assert.match(feature,/ns-character-plant\.webp/);
 assert.doesNotMatch(feature,/ns-character-meditate|ns-courses-feature__sun/);
 const css=read('ns-learn-courses.css');
 assert.match(css,/learn-art\/scenery-hero\.svg/);
 assert.doesNotMatch(css,/url\("ns-landscape-learn\.webp"\)/);
 assert.doesNotMatch(css,/\.ns-courses-hero__book\{/);
});
test('Existing public blog, Feed and unrelated pages are unaffected by the artwork repair',()=>{
 const html=read('index.html'),site=read('site.mjs');
 assert.match(html,/href="#discussion"[\s\S]*href="#learn"/);
 assert.match(site,/renderNotebookBlogPost/);
 assert.match(html,/ns-learn-courses\.css\?v=learn-artfix-20261115/);
 assert.match(site,/ns-learn-courses\.mjs\?v=learn-artfix-20261115/);
});
