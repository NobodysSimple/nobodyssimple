import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderNSLab,lifeLabDefinition,cleanupNSLab} from '../../ns-life-lab.mjs';
import {renderNSLearnHub} from '../../ns-learn.mjs';
import {renderNSFieldGuide,cleanupNSFieldGuide} from '../../ns-field-guide.mjs';
const root={innerHTML:'',querySelector(){return null},addEventListener(){}};
const safeStorage={getItem(){return null},setItem(){throw Error('Unexpected write')},removeItem(){throw Error('Unexpected delete')}};
test('the five worlds are accessed through one switcher rather than duplicate map/cards',()=>{
 renderNSLab(root,[]);
 assert.equal((root.innerHTML.match(/data-trail-switch/g)||[]).length,1);
 for(const id of ['garden','forest','harbour','forge','observatory'])assert.ok(root.innerHTML.includes(`value="${id}"`));
 assert.ok(!root.innerHTML.includes('Choose one of five trails'));
 assert.ok(!root.innerHTML.includes('ns-vision-worldmap'));
 assert.deepEqual(lifeLabDefinition.stages,['notice','explore','evidence','choose','test','review']);
 cleanupNSLab();
});
test('Reality Sorter preserves actual choice semantics and optional saving',()=>{
 renderNSLab(root,['mission','reality-sorter','notice']);
 assert.ok(root.innerHTML.includes('data-lab-action="sort"'));
 assert.ok(root.innerHTML.includes('aria-pressed="false"'));
 assert.ok(root.innerHTML.includes('STEP 1 OF 6'));
 cleanupNSLab();
});
test('Learn and Field Guide remain independent',()=>{
 globalThis.localStorage=safeStorage;
 renderNSLearnHub(root,{posts:[],account:{}});
 assert.ok(root.innerHTML.includes('href="#learn/lesson/'));
 assert.ok(!root.innerHTML.includes('Lesson 3 of 5'));
 renderNSFieldGuide(root,[],{locked:false});
 assert.ok(root.innerHTML.includes('href="#guide/new"'));
 cleanupNSFieldGuide();
});
test('scoped CSS and existing site assets remain linked',()=>{
 const html=readFileSync(new URL('../../index.html',import.meta.url),'utf8');
 for(const asset of ['ns-vision.css','ns-living-trail.css','ns-trail-fidelity.css'])assert.ok(html.includes(asset));
});
