/**
 * Namespaced Learn v2 completion and retrieval events inside the established
 * optional account-sync key. No automatic activity tracking on catalogue pages.
 * The original Journey records are never modified or migrated.
 */
export const LEARN_STORAGE_KEY='ns-account-learning-v2';
export const LEARN_PROGRESS_PREFIX='ns-psy-learn:';
const completionKey=(id,lesson)=>LEARN_PROGRESS_PREFIX+'complete:'+id+':'+lesson;
const now=()=>new Date().toISOString();
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
 if(!course?.id||!lesson?.id||!score?.allAnswered||score.total!==lesson.questions?.length||!score.total)return {ok:false,error:'Complete every question before saving.'};
 return write(storage,records=>{
  const key=completionKey(course.id,lesson.id);
  if(!records[key])records[key]={type:'learn-completion',courseId:course.id,lessonId:lesson.id,version:course.version,lessonVersion:lesson.version||1,at,correct:score.correct,total:score.total};
  return records[key];
 });
}
export function saveLearnReview(course,lesson,score,storage=globalThis.localStorage,at=now()){
 if(!course?.id||!lesson?.id||!score?.allAnswered||score.total!==lesson.questions?.length||!score.total)return {ok:false,error:'Review is incomplete.'};
 if(!readLearnProgress(storage)[completionKey(course.id,lesson.id)])return {ok:false,error:'Finish the lesson before reviewing it.'};
 return write(storage,records=>{
  const suffix=globalThis.crypto?.randomUUID?.()||at.replace(/\D/g,'');
  const key=LEARN_PROGRESS_PREFIX+'review:'+course.id+':'+lesson.id+':'+at+':'+suffix;
  if(records[key])return records[key];
  records[key]={type:'learn-review',courseId:course.id,lessonId:lesson.id,at,correct:score.correct,total:score.total};
  return records[key];
 });
}
export function getLearnCompletion(courseId,lessonId,records){return records?.[completionKey(courseId,lessonId)]||null;}
export function learnCourseProgress(bundle,records){
 const lessons=(bundle?.modules||[]).flatMap(m=>m.lessons);
 const done=lessons.filter(l=>getLearnCompletion(bundle.id,l.id,records)).length;
 return {done,total:lessons.length};
}
const plusDays=(date,n)=>{const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
export function dueLearnReviews(bundle,records,today=now().slice(0,10)){
 const lessons=(bundle?.modules||[]).flatMap(m=>m.lessons);
 return lessons.flatMap(lesson=>{
  const completed=getLearnCompletion(bundle.id,lesson.id,records);if(!completed)return[];
  const attempts=Object.entries(records).filter(([key,v])=>key.startsWith(LEARN_PROGRESS_PREFIX+'review:'+bundle.id+':'+lesson.id+':')&&v?.type==='learn-review').map(([,v])=>v).sort((a,b)=>a.at.localeCompare(b.at));
  const last=attempts.at(-1),delay=last&&last.correct<last.total?1:[1,3,7,14,30][Math.min(attempts.length,4)];
  const due=plusDays((last?.at||completed.at).slice(0,10),delay);
  return due<=today?[{lesson,due,attempts:attempts.length}]:[];
 });
}
 * Learn v2 progress uses the existing opt-in account-learning key, namespaced
 * away from Journey. Only compact completion/review metadata are stored.
 */
export const LEARN_STORE_KEY='ns-account-learning-v2';
export const LEARN_PREFIX='ns-psy:';
export const doneKey=id=>LEARN_PREFIX+'done:'+id;
const isoNow=()=>new Date().toISOString();
const safeStore=store=>store||globalThis.localStorage;
export function readLearnRecords(store){
 try{const r=JSON.parse(safeStore(store)?.getItem(LEARN_STORE_KEY)||'{}');return r&&!Array.isArray(r)&&typeof r==='object'?r:{};}catch{return {};}
}
function modify(store,fn){
 try{const s=safeStore(store);if(!s)return {ok:false,error:'Local storage is unavailable.'};
  const parsed=JSON.parse(s.getItem(LEARN_STORE_KEY)||'{}');
  if(!parsed||Array.isArray(parsed)||typeof parsed!=='object')return {ok:false,error:'Saved learning data could not be read safely.'};
  const detail=fn(parsed);
  s.setItem(LEARN_STORE_KEY,JSON.stringify(parsed));
  return {ok:true,...detail};
 }catch{return {ok:false,error:'This device could not save progress. The lesson is still available.'};}
}
export function completeLearnLesson(course,lesson,result,store,now=isoNow()){
 if(!course?.id||!lesson?.id||!result||result.total!==(lesson.items||[]).length||!Number.isInteger(result.correct)||result.correct<0||result.correct>result.total)return {ok:false,error:'Lesson completion could not be verified.'};
 const id=course.id+':'+lesson.id;
 return modify(store,records=>{if(!records[doneKey(id)])records[doneKey(id)]={type:'learn-completion',course:course.id,lesson:lesson.id,courseVersion:course.version,lessonVersion:lesson.version,at:now,correct:result.correct,total:result.total};return {saved:records[doneKey(id)]};});
}
export function completeLearnReview(course,lesson,result,store,now=isoNow()){
 if(!course?.id||!lesson?.id||!result||result.total!==(lesson.items||[]).length)return {ok:false,error:'Review completion is incomplete.'};
 const id=course.id+':'+lesson.id;
 return modify(store,records=>{if(!records[doneKey(id)])throw Error('Finish lesson before reviewing');
 const suffix=globalThis.crypto?.randomUUID?.()||String(Math.random()).slice(2);
 const key=LEARN_PREFIX+'review:'+id+':'+now+':'+suffix;
 records[key]={type:'learn-review',course:course.id,lesson:lesson.id,at:now,correct:result.correct,total:result.total};
 return {saved:records[key]};});
}
export function learningProgress(course,records){
 const ids=course.lessons.map(l=>doneKey(course.id+':'+l.id));
 const done=ids.filter(id=>records[id]).length;
 return {done,total:ids.length,percent:ids.length?Math.round(done*100/ids.length):0};
}
const day=s=>String(s||'').slice(0,10);
function addDays(date,n){const d=new Date(date.slice(0,10)+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function dueReviews(course,records,today=day(isoNow())){
 return course.lessons.flatMap(lesson=>{
  const id=course.id+':'+lesson.id,done=records[doneKey(id)];if(!done)return[];
  const reviews=Object.entries(records).filter(([key,v])=>key.startsWith(LEARN_PREFIX+'review:'+id+':')&&v?.type==='learn-review').map(([,v])=>v).sort((a,b)=>(a.at||'').localeCompare(b.at||''));
  const last=reviews.at(-1),delay=last?.correct<last?.total?1:[1,3,7,14,30][Math.min(reviews.length,4)],due=addDays(day(last?.at||done.at),delay);
  return due<=today?[{lesson,due,attempts:reviews.length}]:[];
 }).sort((a,b)=>a.due.localeCompare(b.due));
}
export function nextLearnLesson(course,records){return course.lessons.find(l=>!records[doneKey(course.id+':'+l.id)])||null;}
