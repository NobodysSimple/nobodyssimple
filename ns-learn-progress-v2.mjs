/**
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
