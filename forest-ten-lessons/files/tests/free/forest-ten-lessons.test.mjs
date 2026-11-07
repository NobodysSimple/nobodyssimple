import test from 'node:test';
import assert from 'node:assert/strict';
import {
  forestUnitOutlines,forestCurriculumManifest,forestStoneLessonGroups,
  forestPlayableLessonIds,getForestPlayableLesson
} from '../../ns-forest-curriculum.mjs';
import {
  forestStoneProgress,markForestLessonComplete,nextLabNode,renderLivingTrail,
  isForestLessonComplete
} from '../../ns-living-trail.mjs';
import {renderNSLab,cleanupNSLab} from '../../ns-life-lab.mjs';
import {forestMicroLessons} from '../../ns-forest-micro-lessons.mjs';

const storage=new Map();
globalThis.localStorage={getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)};
const mockMain=()=>({innerHTML:'',addEventListener(){},querySelector(){return null}});

test('all 40 Forest units have exactly ten distinct lesson outlines, only Unit 1 playable',()=>{
 assert.equal(forestUnitOutlines.length,40);
 assert.equal(forestCurriculumManifest.stepsPerUnit,10);
 for(const [i,unit] of forestUnitOutlines.entries()){
  assert.equal(unit.steps.length,10);
  assert.equal(new Set(unit.steps.map(step=>step.id)).size,10);
  assert.equal(unit.steps.every(step=>step.availability===(i===0?'available':'planned')),true);
 }
 assert.equal(forestPlayableLessonIds.length,10);
 assert.equal(new Set(forestPlayableLessonIds).size,10);
 assert.equal(Object.values(forestStoneLessonGroups).map(g=>g.length).join(','),'4,3,3');
 assert.equal(forestUnitOutlines[0].steps.map(step=>step.lessonId).join(','),forestPlayableLessonIds.join(','));
});

test('seven original micro-lessons are authored with choices, feedback and a valid objective',()=>{
 const mini=forestPlayableLessonIds.filter(id=>getForestPlayableLesson(id).type==='lesson');
 assert.equal(mini.length,7);
 for(const id of mini){
  const lesson=forestMicroLessons[id];
  assert.ok(lesson?.lead && lesson.question && lesson.principle && lesson.transfer);
  assert.ok(lesson.choices.length>=3);
  assert.ok(lesson.choices.every(([option,feedback])=>Boolean(option&&feedback)));
  assert.ok(lesson.best>=0 && lesson.best<lesson.choices.length);
 }
});

test('each lesson completion fills one indicator; the same stone remains current until all are done',()=>{
 storage.clear();
 storage.set('ns-account-learning-v2',JSON.stringify({'ns-skill:existing':{completed:true}}));
 assert.equal(nextLabNode('forest'),'reality-sorter');
 assert.deepEqual([forestStoneProgress('reality-sorter').done,forestStoneProgress('reality-sorter').total],[0,4]);
 assert.equal(markForestLessonComplete('observed-or-inferred'),true);
 assert.deepEqual([forestStoneProgress('reality-sorter').done,forestStoneProgress('reality-sorter').total],[1,4]);
 assert.equal(nextLabNode('forest'),'reality-sorter');
 for(const id of forestStoneLessonGroups['reality-sorter'].slice(1))assert.equal(markForestLessonComplete(id),true);
 assert.equal(nextLabNode('forest'),'reality-map');
 for(const id of forestStoneLessonGroups['reality-map'])assert.equal(markForestLessonComplete(id),true);
 assert.equal(nextLabNode('forest'),'assumption-finder');
 for(const id of forestStoneLessonGroups['assumption-finder'])assert.equal(markForestLessonComplete(id),true);
 assert.equal(nextLabNode('forest'),null);
 assert.equal(JSON.parse(storage.get('ns-account-learning-v2'))['ns-skill:existing'].completed,true);
 assert.equal(markForestLessonComplete('unpublished-lesson'),false);
});

test('legacy Forest stone completions remain complete after migration',()=>{
 storage.clear();
 storage.set('ns-account-learning-v2',JSON.stringify({'ns-lab:forest:reality-sorter':{completed:true}}));
 assert.equal(forestStoneProgress('reality-sorter').done,4);
 assert.equal(nextLabNode('forest'),'reality-map');
 assert.equal(isForestLessonComplete('feeling-not-proof'),true);
});

test('Forest HTML shows small indicator groups without altering scene or original icons',()=>{
 storage.clear();
 const root=mockMain();renderLivingTrail(root,'forest');
 assert.equal((root.innerHTML.match(/ns-trail-lesson-dots/g)||[]).length,3);
 assert.equal((root.innerHTML.match(/class="ns-trail-lesson-dot/g)||[]).length,10);
 assert.equal((root.innerHTML.match(/data-trail-node="/g)||[]).length,3);
 assert.equal((root.innerHTML.match(/class="ns-trail-continuous-scene"/g)||[]).length,1);
 assert.ok(root.innerHTML.includes('data-trail-world="forest"'));
 assert.ok(root.innerHTML.includes('data-trail-unit-preview="40"'));
 // Other worlds keep exactly the old node model and do not receive dots.
 const meadow=mockMain();renderLivingTrail(meadow,'meadow');
 assert.ok(!meadow.innerHTML.includes('ns-trail-lesson-dots'));
});

test('new micro-lesson route is playable in Life Lab without replacing the trail',()=>{
 const root=mockMain();
 renderNSLab(root,['lesson','forest','observed-or-inferred']);
 assert.ok(root.innerHTML.includes('data-forest-micro="observed-or-inferred"'));
 assert.equal((root.innerHTML.match(/data-forest-choice="/g)||[]).length,3);
 assert.ok(root.innerHTML.includes('data-forest-finish'));
 cleanupNSLab();
});
