import {curriculum} from './ns-lifelab-content.mjs';

export const STORAGE_KEY='ns-account-learning-v2';
const key=id=>`ns-lifelab-v3:${id}`;
const allLessons=new Map(Object.values(curriculum).flatMap(units=>units.flatMap(u=>u.lessons.map(l=>[l.id,l]))));
export function readRecords(storage){
  try {const value=JSON.parse(storage?.getItem(STORAGE_KEY)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}
}
export function lessonDone(lesson,records){
  if(records[key(lesson.id)]?.completed===true)return true;
  if(!lesson.legacyId)return false;
  const world=lesson.id.split('-unit-')[0];
  if(records[`ns-lab-lesson:${world}:${lesson.legacyId}`]?.completed===true)return true;
  return world==='forest'&&['reality-sorter','reality-map','assumption-finder'].includes(lesson.legacyId)&&records[`ns-lab:forest:${lesson.legacyId}`]?.completed===true;
}
export function stoneProgress(stone,records){const done=stone.lessons.filter(l=>lessonDone(l,records)).length;return {done,total:stone.lessons.length,complete:done===stone.lessons.length};}
export function currentStone(world,records){return curriculum[world]?.flatMap(u=>u.stones).find(s=>!stoneProgress(s,records).complete)||null;}
export function stoneState(world,stone,records){
  const progress=stoneProgress(stone,records);
  if(progress.complete)return 'completed';
  if(currentStone(world,records)?.id===stone.id)return progress.done?'in-progress':'current';
  return 'locked';
}
export function canComplete(lesson,records){
  const world=lesson.id.split('-unit-')[0];
  if(!allLessons.has(lesson.id))return false;
  if(lessonDone(lesson,records))return true;
  const stone=currentStone(world,records);
  return stone?.lessons.find(l=>!lessonDone(l,records))?.id===lesson.id;
}
// This is called only by the explicit Done/Complete button after the exercise.
// Re-read before writing so other lessons and unrelated learning records survive.
export function completeLesson(lessonId,storage,now=new Date().toISOString()){
  const lesson=allLessons.get(lessonId);
  if(!lesson||!storage)return {ok:false,error:'Progress could not be saved on this device.'};
  try {
    const raw=JSON.parse(storage.getItem(STORAGE_KEY)||'{}');
    if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new Error('Invalid learning records');
    if(!canComplete(lesson,raw))return {ok:false,error:'Finish the earlier lesson first.'};
    if(!lessonDone(lesson,raw))raw[key(lesson.id)]={kind:'life-lab-lesson',completed:true,completedAt:now,updatedAt:now};
    storage.setItem(STORAGE_KEY,JSON.stringify(raw));
    return {ok:true,records:raw};
  }catch{return {ok:false,error:'Progress could not be saved. Check browser storage and try again. Your lesson is still open.'};}
}
export function trailProgress(world,records){return curriculum[world].reduce((n,u)=>n+u.lessons.filter(l=>lessonDone(l,records)).length,0);}
