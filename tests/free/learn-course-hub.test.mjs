import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {LEARN_COURSE_IDEAS,renderCourseHub} from '../../ns-learn-courses.mjs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');

test('the new Learn page is deliberately courses-only and uses ten original subject illustrations',()=>{
 assert.equal(LEARN_COURSE_IDEAS.length,10);
 assert.equal(new Set(LEARN_COURSE_IDEAS.map(c=>c.id)).size,10);
 for(const course of LEARN_COURSE_IDEAS){
  assert.equal(course.status,'planned');
  assert.ok(course.title.length>4);
  assert.ok(course.description.length>26);
  assert.ok(course.landscape.endsWith('.webp')&&course.mascot.endsWith('.webp'));
  assert.match(read('sw.js'),/nobodyssimple-release-v204-learn-course-hub/);
 }
});
test('all asset paths used by Learn already exist in the public repository',()=>{
 for(const course of LEARN_COURSE_IDEAS){
  assert.ok(existsSync(new URL('../../'+course.landscape,import.meta.url)),course.landscape);
  assert.ok(existsSync(new URL('../../'+course.mascot,import.meta.url)),course.mascot);
 }
 for(const art of ['ns-landscape-learn.webp','ns-prop-book.webp','ns-prop-cup.webp','ns-forest-foliage-left.webp','ns-forest-foliage-right.webp']){
  assert.ok(existsSync(new URL('../../'+art,import.meta.url)),art);
 }
});
test('a dedicated Learn button appears immediately after Feed on desktop and mobile',()=>{
 const html=read('index.html'),shell=read('ns-shell.mjs'),styles=read('ns-shell.css');
 const nav=html.slice(html.indexOf('data-ns-primary-nav'),html.indexOf('</nav>',html.indexOf('data-ns-primary-nav')));
 assert.match(nav,/href="#discussion"[\s\S]*?href="#learn"/);
 const mobile=html.slice(html.indexOf('<nav class="app-bottom-nav"'),html.indexOf('</nav>',html.indexOf('<nav class="app-bottom-nav"')));
 assert.match(mobile,/href="#discussion"[\s\S]*?href="#learn"/);
 assert.match(shell,/learn:'#learn'/);
 assert.match(styles,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)!important/);
});
test('previous interactive worlds, games, crash courses, debates and curriculum do not render in Learn',()=>{
 const script=read('ns-learn-courses.mjs'),site=read('site.mjs');
 assert.match(site,/renderCourseHub\(main\.querySelector\('#learn-course-hub'\)/);
 assert.match(site,/if\(id && \(id!=='courses'\|\|routeParts\.length>2\)\)\{location\.replace\('#learn'\)/);
 assert.match(site,/\['crash','debates'\]\.includes\(id\)/);
 assert.doesNotMatch(script,/#learn\/path\//);
 assert.doesNotMatch(script,/#learn\/lesson\//);
 assert.doesNotMatch(script,/Full curriculum|Crash Courses|Debates|Interactive demonstration|meadow|The Forest|Writing/);
 assert.ok(!site.includes("renderNSLearnHub(root"));
});
test('courses display honest publication status without playable fake content',()=>{
 const fakeRoot={innerHTML:''};
 renderCourseHub(fakeRoot);
 const output=fakeRoot.innerHTML;
 assert.match(output,/Featured course idea/i);
 assert.match(output,/In development — no lessons published yet/);
 assert.match(output,/Our courses are being developed/);
 assert.match(output,/ns-courses-hero/);
 assert.match(output,/ns-courses-feature/);
 assert.match(output,/ns-courses-grid/);
 assert.equal((output.match(/data-course-status="planned"/g)||[]).length,10);
 assert.doesNotMatch(output,/Start course|Begin lesson|Continue learning · The Forest|Full curriculum|Submit writing|Debates/);
});
test('dedicated illustrated course stylesheet includes responsive, dark and reduced-motion layouts',()=>{
 const css=read('ns-learn-courses.css'),html=read('index.html');
 assert.match(html,/ns-learn-courses\.css/);
 for(const selector of ['.ns-courses-hero','.ns-courses-feature','.ns-course-card','.ns-courses-ending'])
  assert.ok(css.includes(selector),selector);
 assert.match(css,/@media\(max-width:770px\)/);
 assert.match(css,/@media\(max-width:445px\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(css,/html\[data-theme="dark"\]/);
});
test('new module, site router and shell all pass JavaScript syntax checks',()=>{
 for(const filename of ['ns-learn-courses.mjs','site.mjs','ns-shell.mjs']){
  const path=new URL('../../'+filename,import.meta.url).pathname;
  assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',path],{stdio:'pipe'}),filename);
 }
});
