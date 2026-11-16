/**
 * Six-format content engine. Pure functions; no DOM, storage, or network.
 * A question is evaluated against its explicit published version.
 */
export const LEARN_FORMATS=Object.freeze(['match','sort','choose','complete','sequence','respond']);
const clean=s=>String(s??'').toLowerCase().trim().replace(/[’]/g,"'").replace(/\s+/g,' ');
const asObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function validateCourse(course){
 const errors=[],seen=new Set();
 if(!course||!course.id||!Array.isArray(course.lessons)||!Array.isArray(course.units))return ['Invalid course manifest'];
 for(const lesson of course.lessons){
  if(!lesson.id||seen.has('lesson:'+lesson.id))errors.push('Duplicate/invalid lesson '+lesson.id);
  seen.add('lesson:'+lesson.id);
  if(!lesson.teach||!Array.isArray(lesson.items)||!lesson.items.length)errors.push('Empty teaching or items '+lesson.id);
  for(const item of lesson.items||[]){
   if(!item.id||seen.has('item:'+item.id))errors.push('Duplicate/invalid item '+item.id);
   seen.add('item:'+item.id);
   if(!LEARN_FORMATS.includes(item.type)||!item.prompt||!item.feedback||!item.counterexample||!item.concept)errors.push('Incomplete question '+item.id);
   if(['choose','respond'].includes(item.type)&&(!Array.isArray(item.options)||item.options.length<2||!item.options.some(o=>o[0]===item.answer)))errors.push('Bad options '+item.id);
   if(item.type==='match'&&(!Array.isArray(item.pairs)||item.pairs.length<2||new Set(item.pairs.map(p=>p[1])).size!==item.pairs.length))errors.push('Bad match pairs '+item.id);
   if(item.type==='sort'&&(!Array.isArray(item.categories)||!Array.isArray(item.items)||item.items.some(i=>!item.categories.includes(i[1]))))errors.push('Bad categories '+item.id);
   if(item.type==='complete'&&(!Array.isArray(item.answers)||!item.answers.length))errors.push('Bad accepted answers '+item.id);
   if(item.type==='sequence'&&(!Array.isArray(item.steps)||item.steps.length<2||new Set(item.steps).size!==item.steps.length))errors.push('Bad sequence '+item.id);
  }
 }
 for(const unit of course.units)for(const lessonId of unit.lessons||[])if(!course.lessons.some(l=>l.id===lessonId))errors.push('Unknown lesson '+lessonId);
 return errors;
}
export function gradeItem(item,response){
 if(!item||!LEARN_FORMATS.includes(item.type))return {correct:false,valid:false,feedback:'Unavailable question.'};
 let valid=false,correct=false;
 if(item.type==='choose'||item.type==='respond'){
  valid=typeof response==='string'&&item.options.some(([id])=>id===response);
  correct=valid&&response===item.answer;
 }else if(item.type==='complete'){
  valid=typeof response==='string'&&clean(response).length>0;
  correct=valid&&item.answers.some(a=>clean(a)===clean(response));
 }else if(item.type==='match'){
  valid=asObj(response)&&item.pairs.every(([statement])=>typeof response[statement]==='string'&&response[statement]!=='');
  correct=valid&&item.pairs.every(([statement,answer])=>response[statement]===answer);
 }else if(item.type==='sort'){
  valid=asObj(response)&&item.items.every(([statement])=>typeof response[statement]==='string'&&response[statement]!=='');
  correct=valid&&item.items.every(([statement,answer])=>response[statement]===answer);
 }else if(item.type==='sequence'){
  valid=Array.isArray(response)&&response.length===item.steps.length&&new Set(response).size===response.length;
  correct=valid&&same(response,item.steps);
 }
 return {correct,valid,feedback:item.feedback,counterexample:item.counterexample};
}
export function scoreAttempt(items,responses){
 const results=items.map(i=>({id:i.id,concept:i.concept,...gradeItem(i,responses?.[i.id])}));
 return {total:results.length,correct:results.filter(x=>x.correct).length,results};
}
export function lessonPercent(items,responses){const s=scoreAttempt(items,responses);return s.total?Math.round(s.correct*100/s.total):0;}
