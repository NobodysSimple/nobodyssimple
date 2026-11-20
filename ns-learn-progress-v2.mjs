/**
 * Namespaced Learn v2 completion and retrieval events inside the established
 * optional account-sync key. No automatic activity tracking on catalogue pages.
 * The original Journey records are never modified or migrated.
 */
export const LEARN_STORAGE_KEY='ns-account-learning-v2';
export const LEARN_PROGRESS_PREFIX='ns-psy-learn:';
const completionKey=(id,lesson)=>LEARN_PROGRESS_PREFIX+'complete:'+id+':'+lesson;
const now=()=>new Date().toISOString();
const expectedChecks=lesson=>lesson?.atlasRecord?18:Array.isArray(lesson?.nodes)?lesson.nodes.reduce((n,node)=>n+(['read','image'].includes(node.type)?0:['dialogue','investigation'].includes(node.type)?(node.checks?.length||0):1),0):lesson?.questions?.length||0;
export function readLearnProgress(storage=globalThis.localStorage){
 try {const value=JSON.parse(storage?.getItem(LEARN_STORAGE_KEY)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{};}catch{return {};}
}
function write(storage,update){
 if(!storage)return {ok:false,error:'Storage unavailable. Your lesson is still open.'};
 try{
  const data=JSON.parse(storage.getItem(LEARN_STORAGE_KEY)||'{}');
  if(!data||Array.isArray(data)||typeof data!=='object')return {ok:false,error:'Saved records could not be safely read.'};
  const record=update(data);
  storage.setItem(LEARN_STORAGE_KEY,JSON.stringify(data));
  return {ok:true,record};
 }catch{return {ok:false,error:'Progress could not be saved on this device.'};}
}
export function saveLearnCompletion(course,lesson,score,storage=globalThis.localStorage,at=now()){
 if(!course?.id||!lesson?.id||!score?.allAnswered||score.total!==expectedChecks(lesson))return {ok:false,error:'Complete every question before saving.'};
 return write(storage,records=>{
  const key=completionKey(course.id,lesson.id);
  if(!records[key]||Number(records[key].lessonVersion||1)<Number(lesson.version||1))records[key]={type:'learn-completion',courseId:course.id,lessonId:lesson.id,version:course.version,lessonVersion:lesson.version||1,at,correct:score.correct,total:score.total,missed:score.corrections?.missed||0,recovered:score.corrections?.recovered||0,stillToReview:score.corrections?.stillToReview||0};
  return records[key];
 });
}
export function saveLearnReview(course,lesson,score,storage=globalThis.localStorage,at=now()){
 if(!course?.id||!lesson?.id||!score?.allAnswered||score.total!==expectedChecks(lesson))return {ok:false,error:'Review is incomplete.'};
 const current=readLearnProgress(storage)[completionKey(course.id,lesson.id)];
 if(!current||Number(current.lessonVersion||1)<Number(lesson.version||1))return {ok:false,error:'Complete this updated lesson before reviewing it.'};
 return write(storage,records=>{
  const suffix=globalThis.crypto?.randomUUID?.()||at.replace(/\D/g,'');
  const key=LEARN_PROGRESS_PREFIX+'review:'+course.id+':'+lesson.id+':'+at+':'+suffix;
  if(records[key])return records[key];
  records[key]={type:'learn-review',courseId:course.id,lessonId:lesson.id,at,correct:score.correct,total:score.total,missed:score.corrections?.missed||0,recovered:score.corrections?.recovered||0,stillToReview:score.corrections?.stillToReview||0};
  return records[key];
 });
}
export function getLearnCompletion(courseId,lessonId,records){return records?.[completionKey(courseId,lessonId)]||null;}
export function getCurrentLearnCompletion(bundle,lesson,records){
 const record=getLearnCompletion(bundle.id,lesson.id,records);
 return record&&Number(record.lessonVersion||1)>=Number(lesson.version||1)?record:null;
}
export function learnCourseProgress(bundle,records){
 const lessons=(bundle?.modules||[]).flatMap(m=>m.lessons);
 const done=lessons.filter(l=>getCurrentLearnCompletion(bundle,l,records)).length;
 return {done,total:lessons.length};
}
const plusDays=(date,n)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
export function dueLearnReviews(bundle,records,today=now().slice(0,10)){
 const lessons=(bundle?.modules||[]).flatMap(m=>m.lessons);
 return lessons.flatMap(lesson=>{
  const completed=getCurrentLearnCompletion(bundle,lesson,records);if(!completed)return[];
  const attempts=Object.entries(records).filter(([key,v])=>key.startsWith(LEARN_PROGRESS_PREFIX+'review:'+bundle.id+':'+lesson.id+':')&&v?.type==='learn-review').map(([,v])=>v).sort((a,b)=>a.at.localeCompare(b.at));
  const last=attempts.at(-1),delay=last&&last.correct<last.total?1:[1,3,7,14,30][Math.min(attempts.length,4)];
  const due=plusDays((last?.at||completed.at).slice(0,10),delay);
  return due<=today?[{lesson,due,attempts:attempts.length}]:[];
 });
}
