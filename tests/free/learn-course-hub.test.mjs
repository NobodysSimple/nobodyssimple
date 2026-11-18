import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {LEARN_COURSE_IDEAS,renderCourseHub} from '../../ns-learn-courses.mjs';
import {COURSE_CATEGORIES,filterLearnCourses} from '../../ns-learn-catalog-v2.mjs';
import {PUBLISHED_COURSE_BUNDLES} from '../../ns-learn-content-v2.mjs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const fakeRoot=()=>{
 const controls={
  '#ns-course-search':{value:'',addEventListener(){}},
  '[data-course-results]':{innerHTML:''},
  '[data-catalogue-count]':{textContent:''},
  '[data-empty]':{hidden:true}
 };
 return {controls,root:{innerHTML:'',querySelector:q=>controls[q]||null}};
};

test('Learn has exactly 20 independent, planned courses with stable illustrated cards',()=>{
 assert.equal(LEARN_COURSE_IDEAS.length,20);
 assert.equal(new Set(LEARN_COURSE_IDEAS.map(c=>c.id)).size,20);
 for(const course of LEARN_COURSE_IDEAS){
  assert.equal(course.status,'planned');
  assert.ok(course.title.length>4);
  assert.ok(course.description.length>26);
  assert.ok(course.landscape.endsWith('-scene.svg'));
  assert.equal(course.mascot,course.id==='neurodiversity'?'learn-art/course-guides/neurodiversity-companion.webp':'media/lifelab/companions.png');
  assert.ok(course.companionName&&course.companionQuote);
  assert.match(read('sw.js'),/nobodyssimple-release-v\d+-[a-z-]+/);
 }
 assert.deepEqual(Object.keys(PUBLISHED_COURSE_BUNDLES),[]);
});

test('all image assets used in Learn actually exist',()=>{
 for(const course of LEARN_COURSE_IDEAS){
  assert.ok(existsSync(new URL('../../'+course.landscape,import.meta.url)),course.landscape);
  assert.ok(existsSync(new URL('../../'+course.mascot,import.meta.url)),course.mascot);
 }
 for(const art of ['learn-art/scenery-hero.svg','learn-art/scenery-featured.svg','learn-art/scenery-emotions.svg','learn-art/scenery-relationships.svg','learn-art/scenery-boundaries.svg','learn-art/scenery-focus.svg','learn-art/scenery-communication.svg','ns-forest-foliage-left.webp','ns-forest-foliage-right.webp']){
  assert.ok(existsSync(new URL('../../'+art,import.meta.url)),art);
 }
});

test('the existing Learn navigation placement remains on desktop and mobile',()=>{
 const html=read('index.html'),shell=read('ns-shell.mjs'),styles=read('ns-shell.css');
 const nav=html.slice(html.indexOf('data-ns-primary-nav'),html.indexOf('</nav>',html.indexOf('data-ns-primary-nav')));
 assert.match(nav,/href="#discussion"[\s\S]*?href="#learn"/);
 const mobile=html.slice(html.indexOf('<nav class="app-bottom-nav"'),html.indexOf('</nav>',html.indexOf('<nav class="app-bottom-nav"')));
 assert.match(mobile,/href="#discussion"[\s\S]*?href="#learn"/);
 assert.match(shell,/learn:'#learn'/);
 assert.match(styles,/grid-template-columns:repeat\(5,minmax\(0,1fr\)\)!important/);
});

test('current Learn routes are a catalogue with optional direct courses, not old worlds or a compulsory syllabus',()=>{
 const script=read('ns-learn-courses.mjs'),site=read('site.mjs');
 assert.match(site,/renderCourseHub\(main\.querySelector\('#learn-course-hub'\)/);
 assert.match(site,/kind==='course'&&bits\.length===2/);
 assert.match(site,/kind==='category'&&bits\.length===2/);
 assert.match(site,/kind==='lesson'&&bits\.length===3/);
 assert.match(site,/\['crash','debates'\]\.includes\(id\)/);
 assert.doesNotMatch(script,/#learn\/path\//);
 assert.doesNotMatch(script,/Full curriculum|Crash Courses|Debates|Interactive demonstration|meadow|The Forest|Submit writing/);
 assert.ok(!site.includes("renderNSLearnHub(root"));
});

test('illustrated catalogue promotes first modules and keeps loading state honest',()=>{
 const {root,controls}=fakeRoot();
 renderCourseHub(root);
 assert.match(root.innerHTML,/Start learning: the first modules are ready/);
 assert.match(root.innerHTML,/Checking which course lessons are available/);
 assert.match(root.innerHTML,/ns-courses-hero/);
 assert.match(root.innerHTML,/ns-courses-feature/);
 assert.match(root.innerHTML,/ns-courses-grid/);
 assert.equal((controls['[data-course-results]'].innerHTML.match(/data-course-status="planned"/g)||[]).length,20);
 assert.doesNotMatch(root.innerHTML,/Start course|Begin lesson|Continue learning · The Forest|Full curriculum|Submit writing|Debates/);
 const detail={innerHTML:''};
 renderCourseHub(detail,{route:['course','narcissism']});
 assert.match(detail.innerHTML,/In development/);
 assert.doesNotMatch(detail.innerHTML,/href="#learn\/lesson\//);
});

test('four independently browsable categories and specialist synonym search are functional',()=>{
 assert.equal(COURSE_CATEGORIES.length,5); // All + 4 distinct collections
 assert.equal(filterLearnCourses({category:'relationships'}).length,5);
 assert.equal(filterLearnCourses({category:'mind'}).length,8);
 assert.equal(filterLearnCourses({category:'everyday'}).length,2);
 assert.equal(filterLearnCourses({category:'society'}).length,5);
 assert.ok(filterLearnCourses({query:'darvo'}).some(c=>c.id==='manipulation'));
 assert.ok(filterLearnCourses({query:'manosphere'}).some(c=>c.id==='masculinity'));
});

test('illustrated course styles retain responsive, dark and reduced-motion modes',()=>{
 const original=read('ns-learn-courses.css'),extra=read('ns-learn-catalog-v2.css'),html=read('index.html');
 assert.match(html,/ns-learn-courses\.css/);
 assert.match(html,/ns-learn-catalog-v2\.css/);
 for(const selector of ['.ns-courses-hero','.ns-courses-feature','.ns-course-card','.ns-courses-ending'])
  assert.ok(original.includes(selector),selector);
 assert.match(extra,/@media\(max-width:770px\)/);
 assert.match(extra,/@media\(max-width:445px\)/);
 assert.match(extra,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(extra,/html\[data-theme="dark"\]/);
});

test('new Learn modules, site router and shell pass JavaScript syntax checks',()=>{
 for(const filename of ['ns-learn-courses.mjs','ns-learn-catalog-v2.mjs','ns-learn-content-v2.mjs','ns-learn-engine-v2.mjs','ns-learn-progress-v2.mjs','ns-learn-player-v2.mjs','site.mjs','ns-shell.mjs']){
  const path=new URL('../../'+filename,import.meta.url).pathname;
  assert.doesNotThrow(()=>execFileSync(process.execPath,['--check',path],{stdio:'pipe'}),filename);
 }
});
