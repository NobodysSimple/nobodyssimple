import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {LEARN_COURSE_IDEAS,renderCourseHub} from '../../ns-learn-courses.mjs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const scenic=['hero','featured','emotions','relationships','boundaries','focus','communication'];
const fakeRoot=()=>{
 const controls={
  '#ns-course-search':{value:'',addEventListener(){}},
  '[data-course-results]':{innerHTML:''},
  '[data-catalogue-count]':{textContent:''},
  '[data-empty]':{hidden:true}
 };
 return {controls,root:{innerHTML:'',querySelector:q=>controls[q]||null}};
};

test('Every original SVG scene stays mascot-free artwork, not a composite portrait',()=>{
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

test('Twenty courses each have a different original tutor and a distinct standalone world',()=>{
 assert.equal(LEARN_COURSE_IDEAS.length,20);
 assert.equal(new Set(LEARN_COURSE_IDEAS.map(c=>c.landscape)).size,20);
 assert.equal(new Set(LEARN_COURSE_IDEAS.map(c=>c.mascot)).size,20);
 assert.equal(new Set(LEARN_COURSE_IDEAS.map(c=>c.tutorName)).size,20);
 for(const course of LEARN_COURSE_IDEAS){
  assert.equal(course.landscape,'learn-art/course-guides/'+course.id+'-scene.svg');
  assert.equal(course.mascot,'learn-art/course-guides/'+course.id+'-tutor.svg');
  for(const [asset,kind] of [[course.landscape,'scene'],[course.mascot,'tutor']]){
   assert.ok(existsSync(new URL('../../'+asset,import.meta.url)),asset);
   const svg=read(asset);
   assert.match(svg,/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
   assert.match(svg,/<\/svg>\s*$/);
   assert.match(svg,/viewBox="[0-9 ]+"/);
   assert.match(svg,/<path /);
   assert.doesNotMatch(svg,/<script|<foreignObject|<image|<use|xlink:href|javascript:/i);
   if(kind==='scene')assert.doesNotMatch(svg,/<title>.*?—/);
   else assert.match(svg,new RegExp('<title>'+course.tutorName+' —'));
  }
 }
});
test('Learn hero and featured panel each retain one intentional mascot',()=>{
 const {root}=fakeRoot();
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

test('Existing blog, Feed and unrelated pages remain linked after Learn asset versioning',()=>{
 const html=read('index.html'),site=read('site.mjs');
 assert.match(html,/href="#discussion"[\s\S]*href="#learn"/);
 assert.match(site,/renderNotebookBlogPost/);
 assert.match(html,/ns-learn-courses\.css\?v=learn-artfix-20261115/);
 assert.match(html,/ns-learn-catalog-v2\.css\?v=tutor-art-20261117/);
 assert.match(site,/ns-learn-courses\.mjs\?v=tutor-art-20261117/);
});
