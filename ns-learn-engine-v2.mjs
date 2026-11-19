/**
 * Learn v2 exercise runtime. Both the legacy six-format bundles and ordered
 * Course Lab node sequences are understood. Pure functions: safe for tests.
 */
import {COURSE_LAB_EXERCISES,learningNodes,validateCourseForPublish} from './ns-course-lab-schema.mjs';
import {isLifeNode,gradeLifeNode} from './ns-life-node-types.mjs?v=everyday-nodes-v2';
export const QUESTION_TYPES=Object.freeze([...new Set(['match','sort','choose','complete','sequence','respond',...COURSE_LAB_EXERCISES])]);
const isObject=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const norm=value=>String(value??'').normalize('NFKC').toLowerCase().replace(/[’]/g,"'").trim().replace(/\s+/g,' ');
const same=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every((x,i)=>x===b[i]);
const pairsEqual=(a,b)=>same([...a].sort(),[...b].sort());
export function validateLearnBundle(bundle,courseId){
 if(!isObject(bundle)||bundle.id!==courseId||!Number.isInteger(bundle.version)||bundle.version<1||bundle.status!=='published'||!Array.isArray(bundle.modules)||!bundle.modules.length)return ['Invalid, unpublished or empty course bundle'];
 if(bundle.modules.some(m=>(m.lessons||[]).some(l=>Array.isArray(l.nodes))))return validateCourseForPublish(bundle);
 // Existing legacy bundles, kept compatible with earlier unit tests.
 const errors=[],ids=new Set();
 for(const mod of bundle.modules){
  if(!mod.id||!mod.title||!Array.isArray(mod.lessons)||!mod.lessons.length)errors.push('Invalid module');
  if(ids.has('module:'+mod.id))errors.push('Duplicate module '+mod.id);ids.add('module:'+mod.id);
  for(const lesson of mod.lessons||[]){
   if(!lesson.id||!lesson.title||!lesson.teach||!Array.isArray(lesson.questions)||!lesson.questions.length)errors.push('Incomplete lesson '+lesson.id);
   if(ids.has('lesson:'+lesson.id))errors.push('Duplicate lesson '+lesson.id);ids.add('lesson:'+lesson.id);
   for(const item of lesson.questions||[]){
    if(!item.id||!item.type||!QUESTION_TYPES.includes(item.type)||!item.prompt||!item.explanation||!item.conceptId||!item.counterexample)errors.push('Incomplete question '+item.id);
    if(ids.has('item:'+item.id))errors.push('Duplicate question '+item.id);ids.add('item:'+item.id);
    if(['choose','respond'].includes(item.type)&&(!Array.isArray(item.options)||item.options.length<2||!item.options.every(o=>o?.id&&o?.label)||!item.options.some(o=>o.id===item.answer)))errors.push('Invalid choices '+item.id);
    if(item.type==='complete'&&(!Array.isArray(item.answers)||!item.answers.length||item.answers.some(x=>typeof x!=='string'||!x.trim())))errors.push('Invalid recall answers '+item.id);
    if(item.type==='match'&&(!Array.isArray(item.pairs)||item.pairs.length<2||item.pairs.some(p=>!p?.id||!p?.label||!p?.answer)||new Set(item.pairs.map(x=>x.answer)).size!==item.pairs.length))errors.push('Invalid matching '+item.id);
    if(item.type==='sort'&&(!Array.isArray(item.categories)||!Array.isArray(item.items)||item.items.some(x=>!item.categories.some(c=>c.id===x.answer))))errors.push('Invalid sorting '+item.id);
    if(item.type==='sequence'&&(!Array.isArray(item.steps)||item.steps.length<2||new Set(item.steps.map(x=>x.id)).size!==item.steps.length))errors.push('Invalid sequence '+item.id);
   }
  }
 }
 return errors;
}
export function gradeLearnItem(item,response){
 if(!item||!QUESTION_TYPES.includes(item.type))return {valid:false,correct:false};
 let valid=false,correct=false;
 if(['choose','respond','repair','investigate','update','perspective'].includes(item.type)){
  valid=typeof response==='string'&&item.options.some(o=>o.id===response);
  correct=valid&&item.answer===response;
 }else if(item.type==='complete'){
  valid=typeof response==='string'&&!!norm(response);
  correct=valid&&item.answers.some(answer=>norm(answer)===norm(response));
 }else if(item.type==='match'){
  valid=isObject(response)&&item.pairs.every(p=>typeof response[p.id]==='string'&&response[p.id]);
  correct=valid&&item.pairs.every(p=>response[p.id]===p.answer);
 }else if(item.type==='sort'){
  valid=isObject(response)&&item.items.every(p=>typeof response[p.id]==='string'&&response[p.id]);
  correct=valid&&item.items.every(p=>response[p.id]===p.answer);
 }else if(item.type==='sequence'||item.type==='chain'||item.type==='rank'){
  valid=Array.isArray(response)&&response.length===item.steps.length&&new Set(response).size===response.length&&response.every(id=>item.steps.some(s=>s.id===id));
  // Lower-ranked hypotheses may be genuinely tied; reward identifying the strongest first.
  correct=valid&&(item.type==='rank'?response[0]===item.steps[0].id:item.steps.every((step,i)=>response[i]===step.id));
 }else if(item.type==='label'){
  valid=Array.isArray(response)&&response.every(id=>item.segments.some(s=>s.id===id));
  correct=valid&&pairsEqual(response,item.segments.filter(s=>s.answer).map(s=>s.id));
 }else if(item.type==='predict'){
  valid=isObject(response)&&item.changes.some(o=>o.id===response.change)&&item.outcomes.some(o=>o.id===response.outcome);
  correct=valid&&response.change===item.correctChange&&response.outcome===item.correctOutcome;
 }else if(item.type==='character'){
  valid=isObject(response)&&item.evidenceOptions.some(o=>o.id===response.evidence)&&item.responseOptions.some(o=>o.id===response.action);
  correct=valid&&response.evidence===item.evidenceAnswer&&response.action===item.responseAnswer;
 }else if(isLifeNode(item.type)){
  ({valid,correct}=gradeLifeNode(item,response));
 }else if(item.type==='dialogue'){
  valid=isObject(response)&&Array.isArray(item.checks)&&item.checks.length>0&&item.checks.every(check=>check.options?.some(choice=>choice.id===response[check.id]));
  correct=valid&&item.checks.every(check=>check.answer===response[check.id]);
 }
 const choice=(['choose','respond','repair','investigate','update','perspective'].includes(item.type)||isLifeNode(item.type))?item.options?.find(o=>o.id===response):null;
 const selected=choice?.feedback?String(choice.feedback):'';
 const explanation=selected?(selected+(correct?'':'\n\n'+(item.explanation||''))):(item.explanation||'');
 return {valid:!!valid,correct:!!correct,explanation,counterexample:item.counterexample||''};
}
export function learnLessonScore(lesson,responses){
 const items=learningNodes(lesson).filter(item=>QUESTION_TYPES.includes(item.type));
 const details=items.flatMap(item=>item.type==='dialogue'?(item.checks||[]).map(check=>{
  const chosen=responses?.[item.id]?.[check.id];
  const valid=!!check.options?.some(option=>option.id===chosen);
  return {id:item.id+':'+check.id,conceptId:item.conceptId,valid,correct:valid&&check.answer===chosen};
 }):[{id:item.id,conceptId:item.conceptId,...gradeLearnItem(item,responses?.[item.id])}]);
 return {total:details.length,correct:details.filter(d=>d.correct).length,allAnswered:details.every(d=>d.valid),details};
}
export function flattenLearnLessons(bundle){return (bundle?.modules||[]).flatMap(module=>module.lessons.map(lesson=>({...lesson,moduleId:module.id,moduleTitle:module.title})))}
