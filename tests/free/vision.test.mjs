import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderNSLab,lifeLabDefinition,cleanupNSLab} from '../../ns-life-lab.mjs';
import {renderNSLearnHub} from '../../ns-learn.mjs';
import {renderNSFieldGuide,cleanupNSFieldGuide} from '../../ns-field-guide.mjs';
const root = {innerHTML:'',querySelector(){return null},addEventListener(){}};
const safeStorage={getItem(){return null},setItem(){throw Error('Unexpected write')},removeItem(){throw Error('Unexpected delete')}};
test('vision world map links to all five actual routes',()=>{
 renderNSLab(root,[]);
 assert.equal((root.innerHTML.match(/class="ns-vision-mapnode /g)||[]).length,5);
 for(const id of ['meadow','forest','bridge','workshop','observatory']) assert.ok(root.innerHTML.includes(`href="#lab/${id}"`));
 assert.ok(root.innerHTML.includes('href="#lab/mission/reality-sorter/notice"'));
 assert.deepEqual(lifeLabDefinition.stages,['notice','explore','evidence','choose','test','review']);
 cleanupNSLab();
});
test('vision mission keeps interactive choice semantics and no new personal saving',()=>{
 renderNSLab(root,['mission','reality-sorter','notice']);
 assert.ok(root.innerHTML.includes('data-lab-action="sort"'));
 assert.ok(root.innerHTML.includes('aria-pressed="false"'));
 assert.ok(root.innerHTML.includes('data-vision-step="notice"'));
 assert.ok(root.innerHTML.includes('STEP 1 OF 6'));
 cleanupNSLab();
});
test('Learn features only the real demonstration, not imaginary progress',()=>{
 globalThis.localStorage=safeStorage;
 renderNSLearnHub(root,{posts:[],account:{}});
 assert.ok(root.innerHTML.includes('href="#learn/lesson/'));
 assert.ok(root.innerHTML.includes('Lessons in development'));
 assert.ok(!root.innerHTML.includes('Lesson 3 of 5'));
});
test('Guide remains explicit-save and private, without silently creating an entry',()=>{
 globalThis.localStorage=safeStorage;
 renderNSFieldGuide(root,[],{locked:false});
 assert.ok(root.innerHTML.includes('href="#guide/new"'));
 for(const label of ['What helps me','Patterns I’ve noticed','Skills I’m practising','Things to reconsider'])assert.ok(root.innerHTML.includes(label));
 cleanupNSFieldGuide();
});
test('reference style remains scoped to hubs and source dependencies exist',()=>{
 const css=readFileSync(new URL('../../ns-vision.css',import.meta.url),'utf8');
 assert.match(css,/ns-vision-worldmap/);
 assert.match(css,/ns-guide6-collection/);
 assert.match(css,/prefers-reduced-motion/);
 const html=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
 assert.ok(html.includes('ns-vision.css'));
});
