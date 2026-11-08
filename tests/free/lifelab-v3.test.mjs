import test from 'node:test';
import assert from 'node:assert/strict';
import {trails,curriculum,lessonQuestions,findTrail} from '../../ns-lifelab-content.mjs';
import {STORAGE_KEY,readRecords,lessonDone,currentStone,stoneState,stoneProgress,completeLesson,trailProgress} from '../../ns-lifelab-state.mjs';
import {renderLifeLabV3,cleanupLifeLabV3,STONE_POINTS,TRAIL_PATH} from '../../ns-lifelab-v3.mjs';
const memory=(initial={})=>{const map=new Map([[STORAGE_KEY,JSON.stringify(initial)]]);return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};};

test('all five courses contain forty playable units, five stones and ten lessons per unit',()=>{
 const ids=new Set();
 for(const trail of trails){assert.equal(curriculum[trail.id].length,40);assert.equal(findTrail(trail.slug).id,trail.id);
  for(const unit of curriculum[trail.id]){assert.equal(unit.lessons.length,10);assert.deepEqual(unit.stones.map(s=>s.lessons.length),[3,3,2,1,1]);assert.ok(unit.principle.trim());assert.ok(unit.experiment.trim());
   for(const lesson of unit.lessons){assert.ok(!ids.has(lesson.id));ids.add(lesson.id);const questions=lessonQuestions(unit,lesson);assert.equal(questions.length,lesson.type==='capstone'?3:lesson.type==='application'?0:1);for(const q of questions){assert.equal(q.options.length,3);assert.equal(q.options[q.correct],q.right);assert.equal(new Set(q.options).size,3);}}
  }
 }
 assert.equal(ids.size,2000);
});
test('reads and abandoned lesson state do not write progress; explicit completion saves only one lesson',()=>{
 const store=memory({'unrelated-learning':{completed:true}}),before=store.getItem(STORAGE_KEY),u=curriculum.forest[0];
 assert.equal(stoneState('forest',u.stones[0],readRecords(store)),'current');
 lessonQuestions(u,u.lessons[0]);assert.equal(store.getItem(STORAGE_KEY),before);
 assert.equal(completeLesson(u.lessons[3].id,store).ok,false);
 assert.equal(completeLesson(u.lessons[0].id,store,'2026-11-07T12:00:00Z').ok,true);
 assert.deepEqual(stoneProgress(u.stones[0],readRecords(store)),{done:1,total:3,complete:false});
 assert.equal(readRecords(store)['unrelated-learning'].completed,true);
 assert.equal(stoneState('forest',u.stones[0],readRecords(store)),'in-progress');
 const saved=store.getItem(STORAGE_KEY);completeLesson(u.lessons[0].id,store);assert.equal(store.getItem(STORAGE_KEY),saved);
});
test('every trail can be completed sequentially through its final destination',()=>{
 const store=memory();
 for(const trail of trails){for(const u of curriculum[trail.id])for(const s of u.stones){assert.equal(currentStone(trail.id,readRecords(store)).id,s.id);for(const l of s.lessons)assert.equal(completeLesson(l.id,store).ok,true,l.id);assert.equal(stoneState(trail.id,s,readRecords(store)),'completed');}
  assert.equal(currentStone(trail.id,readRecords(store)),null);assert.equal(trailProgress(trail.id,readRecords(store)),400);
 }
});
test('legacy completion survives; malformed or unavailable storage never reports success',()=>{
 const lesson=curriculum.forest[0].lessons[0];const store=memory({'ns-lab-lesson:forest:observed-or-inferred':{completed:true}});
 assert.equal(lessonDone(lesson,readRecords(store)),true);
 assert.equal(completeLesson(lesson.id,null).ok,false);
 assert.equal(completeLesson(lesson.id,{getItem:()=>'{broken',setItem:()=>assert.fail('must not overwrite corrupt records')}).ok,false);
 assert.equal(completeLesson('unknown',store).ok,false);
 assert.equal(completeLesson(curriculum.forest[0].lessons[1].id,{getItem:()=>JSON.stringify(readRecords(store)),setItem:()=>{throw Error('quota');}}).ok,false);
});
test('all forty units render, all stones sit at actual path endpoints, and single lessons have no ring',()=>{
 for(const t of trails){const root={innerHTML:''};renderLifeLabV3(root,[t.slug],{fullMap:true});assert.equal((root.innerHTML.match(/class="ll-unit"/g)||[]).length,40);assert.equal((root.innerHTML.match(/data-stone="/g)||[]).length,200);assert.equal((root.innerHTML.match(/class="ll-ring"/g)||[]).length,120);assert.ok(root.innerHTML.includes(t.destination));cleanupLifeLabV3();}
 for(const p of STONE_POINTS)assert.ok(TRAIL_PATH.includes(`${p.x} ${p.y}`));
});
