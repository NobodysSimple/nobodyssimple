/* Nobody's Simple · Stage 2: optional exact-fact interview.
 * The answer dimensions are derived from the user's synthetic
 * formulation database (source: Q-N-...-T/S/I/X/G). They are authored,
 * uncalibrated, non-diagnostic templates—not clinical training data.
 * No persistent storage, model, external APIs or probabilistic inference.
 */
import {subtypeNode} from './ns-hypothesis-subtype-atlas.mjs';
const choices=(items)=>Object.freeze(items.map(([id,label])=>Object.freeze({id,label})));
const unspecified=new Set(['unsure','prefer_not','skip','not_identified']);
export const CASE_FACT_QUESTIONS=Object.freeze([
 Object.freeze({id:'timeframe',conceptId:'experience.timeframe',label:'When this became relevant',sourceSuffix:'T',
  prompt:experience=>'How long has '+experience+' been relevant to you?',
  options:choices([['just_started','It has only just started'],['past_few_weeks','For the past few weeks'],
   ['months_or_longer','For months or longer'],['varies','It varies or comes and goes'],
   ['unsure','I am not sure'],['prefer_not','Prefer not to answer']])}),
 Object.freeze({id:'frequency',conceptId:'experience.frequency',label:'How often',sourceSuffix:'S',
  prompt:experience=>'How often is '+experience+' something you notice or think about?',
  options:choices([['most_days','Most days'],['some_days','Some days'],['occasionally','Occasionally'],
   ['one_occasion','A particular occasion'],['varies','It varies'],
   ['unsure','I am not sure'],['prefer_not','Prefer not to answer']])}),
 Object.freeze({id:'impact',conceptId:'experience.impact',label:'Effect on daily life',sourceSuffix:'I',
  prompt:experience=>'How much does '+experience+' interfere with things you want or need to do, if at all?',
  options:choices([['none','Not at all'],['small','A little'],['moderate','A moderate amount'],
   ['substantial','A substantial amount'],['unsure','I am not sure'],
   ['prefer_not','Prefer not to answer']])}),
 Object.freeze({id:'situations',conceptId:'experience.situations',label:'Situation range',sourceSuffix:'S',
  prompt:experience=>'In how many different situations does '+experience+' matter to you?',
  options:choices([['one_setting','One specific setting'],['some_settings','A few settings'],
   ['many_settings','Many settings'],['unsure','I am not sure'],['prefer_not','Prefer not to answer']])}),
 Object.freeze({id:'exceptions',conceptId:'experience.exceptions',label:'When it is different',sourceSuffix:'X',
  prompt:experience=>'Have you noticed a situation where '+experience+' is less difficult, different or less noticeable?',
  options:choices([['yes_clear','Yes, a clear difference'],['sometimes','Sometimes'],
   ['not_identified','I have not identified one'],['unsure','I am not sure'],
   ['prefer_not','Prefer not to answer']])}),
 Object.freeze({id:'goal',conceptId:'person.goal',label:'What you want help with',sourceSuffix:'G',
  prompt:experience=>'What would you most like to do about '+experience+'?',
  options:choices([['understand','Understand it better'],['regulate','Manage how it feels'],
   ['solve_practical_problem','Change practical circumstances'],
   ['change_behaviour','Change what I do'],['find_support','Find appropriate support'],
   ['do_not_change','I do not want to change it'],['unsure','I am not sure']])})
]);
const INDEX=Object.freeze(Object.fromEntries(CASE_FACT_QUESTIONS.map(q=>[q.id,q])));
export const newCaseDetailInterview=()=>({active:false,finished:false,answers:[],cursor:0});
export function caseDetailQuestion(state){
 const d=state?.caseDetails;
 if(!d?.active||d.finished||!state.drill?.confirmed)return null;
 const leaf=subtypeNode(state.drill.leafId);
 if(!leaf)return null;
 const template=CASE_FACT_QUESTIONS[d.cursor];
 if(!template)return null;
 return {id:'Q-NS-FACT-'+leaf.id+'-'+template.id.toUpperCase(),
  conceptId:template.conceptId,field:template.id,origin:'synthetic_atlas_extended',
  sourceTemplateSuffix:template.sourceSuffix,prompt:template.prompt('“'+leaf.label+'”'),
  options:template.options};
}
export function startCaseDetailInterview(state){
 if(!state||state.safety||!state.drill?.confirmed||!state.drill?.leafId)return state;
 const previous=state.caseDetails||newCaseDetailInterview();
 return {...state,caseDetails:{...previous,active:true,finished:false}};
}
export function answerCaseDetail(state,questionId,answerId){
 const q=caseDetailQuestion(state);
 if(!q||q.id!==questionId||!q.options.some(o=>o.id===answerId))return state;
 const old=state.caseDetails;
 const answers=[...old.answers.filter(x=>x.field!==q.field),
  {field:q.field,conceptId:q.conceptId,questionId:q.id,answerId}];
 const cursor=old.cursor+1;
 return {...state,caseDetails:{active:cursor<CASE_FACT_QUESTIONS.length,
  finished:cursor>=CASE_FACT_QUESTIONS.length,answers,cursor}};
}
export function backCaseDetail(state){
 const d=state?.caseDetails;
 if(!d?.answers?.length)return state;
 const answers=d.answers.slice(0,-1);
 return {...state,caseDetails:{...d,answers,cursor:answers.length,active:true,finished:false}};
}
export function skipCaseDetail(state){
 if(!state?.caseDetails)return state;
 return {...state,caseDetails:{...state.caseDetails,active:false,finished:true}};
}
export function caseDetailFacts(state){
 if(!state?.drill?.confirmed||!state.drill.leafId)return [];
 const leaf=subtypeNode(state.drill.leafId);
 if(!leaf)return [];
 return (state.caseDetails?.answers||[]).flatMap(answer=>{
  const q=INDEX[answer.field];
  if(!q||unspecified.has(answer.answerId))return [];
  const o=q.options.find(x=>x.id===answer.answerId);
  if(!o)return [];
  return [{id:answer.questionId,conceptId:q.conceptId,kind:q.id,label:q.label,
   text:o.label,value:answer.answerId,source:'user_selection',
   scope:leaf.id,clinicallyValidated:false}];
 });
}
export function caseDetailReport(state){
 return caseDetailFacts(state).map(x=>x.label+': '+x.text);
}
