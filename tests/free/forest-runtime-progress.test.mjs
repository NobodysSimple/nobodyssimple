import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {forestUnitOutlines,forestStoneLessonGroups,forestStoneMeta,forestPlayableLessonIds,getForestPlayableLesson} from '../../ns-forest-curriculum.mjs';
import {forestMicroLessons} from '../../ns-forest-micro-lessons.mjs';
import {forestStoneOrder,forestStoneStatus,nextForestStone,saveForestLesson,isForestLessonDone} from '../../ns-forest-runtime.mjs';

test('Forest has 40 units, each with ten distinct lesson slots, while later units remain planned',()=>{
  assert.equal(forestUnitOutlines.length,40);
  assert.ok(forestUnitOutlines.every((u,i)=>u.number===i+1&&u.steps.length===10&&u.stones.length===5));
  assert.ok(forestUnitOutlines.every(u=>u.stones.map(stone=>stone.lessonCount).join(',')==='3,3,2,1,1'));
  assert.ok(forestUnitOutlines.slice(1).every(u=>u.steps.every(s=>s.availability==='planned')));
  assert.equal(new Set(forestUnitOutlines.flatMap(u=>u.steps.map(s=>s.id))).size,400);
});
test('Unit 1 has five stones with a 3/3/2/1/1 rhythm and the correct lesson identities',()=>{
  assert.deepEqual(forestStoneOrder,['assumption-finder','reality-map','perspective-window','reality-sorter','life-application']);
  assert.deepEqual(Object.keys(forestStoneLessonGroups),forestStoneOrder);
  assert.deepEqual(Object.values(forestStoneLessonGroups).map(a=>a.length),[3,3,2,1,1]);
  assert.equal(Object.keys(forestStoneMeta).length,5);
  assert.equal(forestPlayableLessonIds.length,10);
  assert.equal(Object.keys(forestMicroLessons).length,8);
  assert.equal(getForestPlayableLesson('reality-sorter').href,'#lab/mission/reality-sorter/notice');
  assert.equal(getForestPlayableLesson('reality-map').href,'#tool/reality-map');
  assert.equal(getForestPlayableLesson('apply-to-life').type,'lesson');
});
test('completion advances to the next lesson, then the next stone, without overwriting unrelated records',()=>{
  const entries=new Map([['ns-account-learning-v2',JSON.stringify({'ns-skill:existing':{completed:true}})]]);
  const store={getItem:k=>entries.get(k)??null,setItem:(k,v)=>entries.set(k,v)};
  const records=()=>JSON.parse(entries.get('ns-account-learning-v2'));
  assert.equal(nextForestStone(records()),'assumption-finder');
  for(const id of forestStoneLessonGroups['assumption-finder']) assert.equal(saveForestLesson(id,store),true);
  assert.deepEqual(forestStoneStatus('assumption-finder',records()).done,3);
  assert.equal(nextForestStone(records()),'reality-map');
  assert.equal(records()['ns-skill:existing'].completed,true);
  assert.equal(saveForestLesson('reality-map',store),true);
  assert.equal(records()['ns-lab:forest:reality-map'].completed,true);
  assert.equal(saveForestLesson('bad-id',store),false);
});
test('Reality Sorter is one mission, not six independent lessons',()=>{
  const legacy={'ns-lab:forest:reality-sorter':{completed:true}};
  assert.equal(forestStoneStatus('reality-sorter',legacy).done,1);
  assert.equal(forestStoneStatus('reality-sorter',legacy).total,1);
  assert.equal(forestStoneStatus('assumption-finder',legacy).done,0);
  assert.equal(isForestLessonDone('reality-sorter',legacy),true);
});
test('future stones never imply published lessons; original scenery and icons are not rewritten',()=>{
  const root=new URL('../../',import.meta.url);
  const css=readFileSync(new URL('ns-forest-lessons.css',root),'utf8');
  const runtime=readFileSync(new URL('ns-forest-runtime.mjs',root),'utf8');
  assert.ok(!css.includes('ns-trail-lesson-dot'));
  assert.ok(css.includes('ns-forest-stone-progress'));
  assert.ok(runtime.includes('scene.style.height=`${BASE_HEIGHT}px`'));
  assert.ok(runtime.includes('ST0NE')===false);
  assert.ok(runtime.includes('perspective-window') && runtime.includes('life-application'));
});
