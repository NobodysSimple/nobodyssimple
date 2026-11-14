import {practiceSkills,practiceIdentities,practiceSkillMap,practiceIdentityMap,kindnessSkillCategories} from './lifestyle-practice-content.mjs';
import {goodDeeds} from './lifestyle-deeds.mjs';

export const PRACTICE_KEY='ns-lifestyle-practice-v1';
const MAX_HISTORY=180;
const MAX_SKILLS=3;
export const dateKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
export const dayOrdinal=date=>Math.floor(new Date(`${date}T12:00:00Z`).getTime()/86400000);
const isObject=value=>value&&typeof value==='object'&&!Array.isArray(value);
const uniqueSkills=ids=>[...new Set((Array.isArray(ids)?ids:[]).filter(id=>practiceSkillMap.has(id)))].slice(0,MAX_SKILLS);
const safeCounts=source=>Object.fromEntries(Object.entries(isObject(source)?source:{}).filter(([id,value])=>practiceSkillMap.has(id)&&Number.isSafeInteger(value)&&value>=0));
const safeOverrides=source=>Object.fromEntries(Object.entries(isObject(source)?source:{}).filter(([id,value])=>practiceSkillMap.has(id)&&Number.isInteger(value)&&value>=1&&value<=4));

export function normalisePractice(raw){
 const value=isObject(raw)?raw:{},identityId=practiceIdentityMap.has(value.identityId)?value.identityId:null;
 const selected=uniqueSkills(value.skillIds);
 const skills=selected.length?selected:(identityId?[...practiceIdentityMap.get(identityId).skills]:[]);
 const history=Array.isArray(value.history)?value.history.filter(entry=>
  isObject(entry)&&/^\d{4}-\d{2}-\d{2}$/.test(entry.date)&&practiceSkillMap.has(entry.skillId)&&typeof entry.taskId==='string'
 ).slice(-MAX_HISTORY):[];
 const today=isObject(value.today)&&typeof value.today.date==='string'&&practiceSkillMap.has(value.today.skillId)
  &&typeof value.today.taskId==='string' ? {...value.today,done:value.today.done===true,skips:Math.max(0,Math.min(999,Number(value.today.skips)||0))}:null;
 return {version:1,identityId,skillIds:skills,counts:safeCounts(value.counts),levelOverrides:safeOverrides(value.levelOverrides),history,today};
}
export const practiceLevel=(state,skillId)=>{
 const safe=normalisePractice(state);
 return safe.levelOverrides[skillId]||Math.min(4,1+Math.floor((safe.counts[skillId]||0)/3));
};
function hash(text){
 let result=2166136261;
 for(const character of String(text)){result^=character.charCodeAt(0);result=Math.imul(result,16777619);}
 return result>>>0;
}
const kindnessBySkill=new Map(practiceSkills.map(skill=>[
 skill.id, goodDeeds.filter(deed=>kindnessSkillCategories[deed.category]===skill.id)
]));
function eligibleTasks(skillId,level){
 const skill=practiceSkillMap.get(skillId);
 return skill?.levels[level-1]||[];
}
export function getPracticeTask(state){
 const today=normalisePractice(state).today;
 if(!today)return null;
 const skill=practiceSkillMap.get(today.skillId);
 const local=skill?.levels.flat().find(item=>item.id===today.taskId);
 if(local)return local;
 const legacy=goodDeeds.find(deed=>`kindness-${deed.id}`===today.taskId);
 if(legacy&&kindnessSkillCategories[legacy.category]===today.skillId)return {
  id:today.taskId,skillId:today.skillId,level:today.level,task:legacy.task,
  source:'kindness',category:legacy.category
 };
 return null;
}
function chooseTask(day,skillId,level,skips=0,kindness=false){
 const base=eligibleTasks(skillId,level);
 const offset=hash(`${day}:${skillId}:${level}`);
 const extra=kindnessBySkill.get(skillId)||[];
 if((kindness||skips>=base.length)&&extra.length){
  const suggestion=extra[(hash(`${day}:${skillId}:kindness`)+Math.max(0,skips-base.length))%extra.length];
  return `kindness-${suggestion.id}`;
 }
 return base[(offset+skips)%base.length]?.id||null;
}
const selectedSkill=(state,date)=>{
 const ids=state.skillIds.length?state.skillIds:[];
 if(!ids.length)return null;
 return ids[dayOrdinal(date)%ids.length];
};
export function ensureDailyPractice(raw,now=new Date()){
 const state=normalisePractice(raw),date=dateKey(now);
 if(!state.identityId)return {...state,today:null};
 const candidate=state.today;
 if(candidate?.date===date&&candidate.done)return state; // One recorded practice per local day.
 if(candidate?.date===date&&state.skillIds.includes(candidate.skillId)&&getPracticeTask(state))return state;
 const skillId=selectedSkill(state,date);
 if(!skillId)return {...state,today:null};
 const level=practiceLevel(state,skillId);
 return {...state,today:{date,skillId,level,taskId:chooseTask(date,skillId,level),skips:0,done:false}};
}
export function choosePracticeIdentity(raw,id,now=new Date()){
 const state=normalisePractice(raw),identity=practiceIdentityMap.get(id);
 if(!identity)return state;
 return ensureDailyPractice({...state,identityId:id,skillIds:[...identity.skills],today:state.today?.done?state.today:null},now);
}
export function choosePracticeSkills(raw,ids,now=new Date()){
 const state=normalisePractice(raw),skillIds=uniqueSkills(ids);
 if(!state.identityId||!skillIds.length)return state;
 return ensureDailyPractice({...state,skillIds,today:state.today?.done?state.today:
  (skillIds.includes(state.today?.skillId)?state.today:null)},now);
}
export function choosePracticeFocus(raw,skillId,now=new Date()){
 const state=ensureDailyPractice(raw,now);
 if(!state.identityId||!state.skillIds.includes(skillId)||state.today?.done)return state;
 const date=dateKey(now),level=practiceLevel(state,skillId);
 return {...state,today:{date,skillId,level,taskId:chooseTask(date,skillId,level),skips:0,done:false}};
}
export function choosePracticeLevel(raw,skillId,level,now=new Date()){
 const state=ensureDailyPractice(raw,now);
 if(!state.identityId||!state.skillIds.includes(skillId)||!Number.isInteger(level)||level<1||level>4)return state;
 const levelOverrides={...state.levelOverrides,[skillId]:level};
 if(state.today?.done||state.today?.skillId!==skillId)return {...state,levelOverrides};
 const date=dateKey(now);
 return {...state,levelOverrides,today:{date,skillId,level,taskId:chooseTask(date,skillId,level),skips:0,done:false}};
}
export function anotherPractice(raw,now=new Date(),{kindness=false}={}){
 const state=ensureDailyPractice(raw,now),today=state.today;
 if(!today||today.done)return state;
 const skips=kindness?Math.max(today.skips,eligibleTasks(today.skillId,today.level).length):today.skips+1;
 return {...state,today:{...today,skips,taskId:chooseTask(today.date,today.skillId,today.level,skips,kindness)}};
}
export function pausePractice(raw,now=new Date()){
 const state=ensureDailyPractice(raw,now);
 if(!state.today||state.today.done)return state;
 return {...state,today:{...state.today,paused:true}};
}
export function resumePractice(raw,now=new Date()){
 const state=ensureDailyPractice(raw,now);
 if(!state.today||state.today.done)return state;
 return {...state,today:{...state.today,paused:false}};
}
export function completePractice(raw,now=new Date()){
 const state=ensureDailyPractice(raw,now),today=state.today;
 if(!today||today.done||today.paused||!getPracticeTask(state))return state;
 const completedAt=now.toISOString(),skillId=today.skillId;
 const entry={date:today.date,skillId,taskId:today.taskId,level:today.level,identityId:state.identityId,completedAt};
 const history=[...state.history.filter(item=>item.date!==today.date),entry].slice(-MAX_HISTORY);
 return {...state,counts:{...state.counts,[skillId]:(state.counts[skillId]||0)+1},history,
  today:{...today,done:true,completedAt}};
}
export function undoPractice(raw,now=new Date()){
 const state=ensureDailyPractice(raw,now),today=state.today;
 if(!today?.done||today.date!==dateKey(now))return state;
 return {...state,counts:{...state.counts,[today.skillId]:Math.max(0,(state.counts[today.skillId]||0)-1)},
  history:state.history.filter(item=>item.date!==today.date),
  today:{...today,done:false,completedAt:undefined}};
}
export function practiceSummary(raw){
 const state=normalisePractice(raw);
 return {
  total:Object.values(state.counts).reduce((a,b)=>a+b,0),
  selected:state.skillIds.map(id=>({id,label:practiceSkillMap.get(id).name,count:state.counts[id]||0,level:practiceLevel(state,id)}))
 };
}
export {practiceSkills,practiceIdentities,practiceSkillMap,practiceIdentityMap};
