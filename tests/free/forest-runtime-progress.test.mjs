import test from 'node:test';
import assert from 'node:assert/strict';
import {forestUnitOutlines,forestStoneLessonGroups,forestPlayableLessonIds,getForestPlayableLesson} from '../../ns-forest-curriculum.mjs';
import {forestMicroLessons} from '../../ns-forest-micro-lessons.mjs';
import {forestStoneStatus,saveForestLesson,isForestLessonDone} from '../../ns-forest-runtime.mjs';

test('forty Forest units have ten distinct lesson slots; planned work is honest',()=>{
 assert.equal(forestUnitOutlines.length,40);
 assert.ok(forestUnitOutlines.every((unit,i)=>unit.number===i+1&&unit.steps.length===10));
 assert.ok(forestUnitOutlines.slice(1).every(unit=>unit.steps.every(s=>s.availability==='planned')));
 assert.equal(new Set(forestUnitOutlines.flatMap(unit=>unit.steps.map(step=>step.id))).size,400);
});
test('the three existing stone identities are retained, with 4+3+3 lessons',()=>{
 assert.deepEqual(Object.keys(forestStoneLessonGroups),['reality-sorter','reality-map','assumption-finder']);
 assert.deepEqual(Object.values(forestStoneLessonGroups).map(x=>x.length),[4,3,3]);
 assert.equal(forestPlayableLessonIds.length,10);
 assert.equal(Object.keys(forestMicroLessons).length,7);
 assert.equal(getForestPlayableLesson('reality-sorter').href,'#lab/mission/reality-sorter/notice');
});
test('progress is explicit, per lesson, and preserves unrelated records',()=>{
 const data=new Map([['ns-account-learning-v2',JSON.stringify({'ns-skill:existing':{completed:true}})]]);
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 let records=JSON.parse(data.get('ns-account-learning-v2'));
 assert.deepEqual(forestStoneStatus('reality-sorter',records).done,0);
 assert.equal(saveForestLesson('observed-or-inferred',storage),true);
 records=JSON.parse(data.get('ns-account-learning-v2'));
 assert.equal(forestStoneStatus('reality-sorter',records).done,1);
 assert.equal(forestStoneStatus('reality-sorter',records).next,'feeling-not-proof');
 assert.equal(records['ns-skill:existing'].completed,true);
 assert.equal(saveForestLesson('reality-sorter',storage),true);
 records=JSON.parse(data.get('ns-account-learning-v2'));
 assert.equal(isForestLessonDone('reality-sorter',records),true);
 assert.equal(records['ns-lab:forest:reality-sorter'].completed,true);
 assert.equal(forestStoneStatus('reality-sorter',records).done,2);
 assert.equal(saveForestLesson('bad-lesson',storage),false);
});
test('original completed nodes count as one lesson, not the entire stone',()=>{
 const old={'ns-lab:forest:reality-sorter':{completed:true}};
 assert.equal(forestStoneStatus('reality-sorter',old).done,1);
 assert.equal(forestStoneStatus('reality-map',old).done,0);
});
