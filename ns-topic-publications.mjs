/* Shared runtime state for published editorial topics.
 * GitHub Pages publication updates topic-content.json. We load once per page
 * navigation boot; no client may write this file without repository access.
 * All content is plain text: rendering is escaped at output boundaries.
 */
export const TOPIC_CONTENT_PATH='topic-content.json';
const limit=(value,max=5000)=>String(value??'').trim().slice(0,max);
const strings=(value,maxItems=12,maxLength=1200)=>Array.isArray(value)?
 value.slice(0,maxItems).map(x=>limit(x,maxLength)).filter(Boolean):[];
const pairs=(value,maxItems=8)=>Array.isArray(value)?value.slice(0,maxItems)
 .map(x=>({label:limit(x?.label,110),detail:limit(x?.detail,2000)}))
 .filter(x=>x.label&&x.detail):[];
const faq=(value)=>Array.isArray(value)?value.slice(0,12).map(x=>({
 q:limit(x?.q,230),a:limit(x?.a,2500)})).filter(x=>x.q&&x.a):[];
const safeId=id=>/^[a-z][a-z0-9-]{2,89}$/.test(String(id||''));
export const TOPIC_STATES=Object.freeze(['published','archived']);
export const TOPIC_KINDS=Object.freeze(['environment','behaviour','planning','cognitive','observe','dbt','acceptance','compassion','support']);
export const TOPIC_LANES=Object.freeze(['context','practice','thinking','acceptance','support']);
const tool=(item)=>({
 id:limit(item?.id,80).replace(/[^a-z0-9-]/g,''),
 kind:TOPIC_KINDS.includes(item?.kind)?item.kind:'behaviour',
 title:limit(item?.title,170),why:limit(item?.why,1300),
 steps:strings(item?.steps,6,650),caution:limit(item?.caution,1500),
 worksheet:limit(item?.worksheet,40)
});
export function normalizeTopicRecord(value){
 if(!value||!safeId(value.id))return null;
 const status=TOPIC_STATES.includes(value.status)?value.status:'archived';
 const guideMethods=Array.isArray(value.guideMethods)?value.guideMethods.slice(0,6).map(l=>({
  id:limit(l?.id,40),
  methods:Array.isArray(l?.methods)?l.methods.slice(0,5).map(m=>({
   title:limit(m?.title,180),why:limit(m?.why,1400),
   steps:strings(m?.steps,8,900),caution:limit(m?.caution,1500)
  })).filter(m=>m.title&&m.steps.length>=2):[]
 })).filter(l=>TOPIC_LANES.includes(l.id)&&l.methods.length):[];
 return {
  id:value.id, status, original:Boolean(value.original),
  domain:limit(value.domain,45),theme:limit(value.theme,45),
  title:limit(value.title,200), lead:limit(value.lead,800),
  definition:limit(value.definition,3500),
  recognition:strings(value.recognition,9,500),
  reframe:limit(value.reframe,2300),
  core:pairs(value.core,4), traps:pairs(value.traps,7),
  steps:pairs(value.steps,4), progress:strings(value.progress,8,800),
  faq:faq(value.faq),closing:limit(value.closing,1700),
  supportText:limit(value.supportText,1800),
  sourceNote:limit(value.sourceNote,1600),
  guidedPrompts:faq(value.guidedPrompts).slice(0,8),
  guideMethods,
  customTools:Array.isArray(value.customTools)?value.customTools.slice(0,12).map(tool)
   .filter(x=>x.id&&x.title&&x.why&&x.steps.length>=2):[],
  updatedAt:limit(value.updatedAt,50)
 };
}
let records=new Map(),initialized=false;
export const publishedTopicRecord=id=>records.get(id)||null;
export const topicIsArchived=id=>records.get(id)?.status==='archived';
export const topicPublicationReady=()=>initialized;
export function setPublishedTopics(data){
 const next=new Map;
 for(const raw of Array.isArray(data?.topics)?data.topics:[]){
  const topic=normalizeTopicRecord(raw);
  if(topic&&topic.title&&topic.domain)next.set(topic.id,topic);
 }
 records=next;initialized=true;
 return next.size;
}
export async function loadPublishedTopics(fetcher=globalThis.fetch){
 try{
  const res=await fetcher(TOPIC_CONTENT_PATH,{cache:'no-store'});
  if(!res.ok)throw Error('Topic publication file could not be loaded');
  return setPublishedTopics(await res.json());
 }catch{initialized=true;return 0;}
}
export const publishedTopicRecords=()=>[...records.values()];
export function publishedTopicIndex(canonical){
 const seen=new Set;
 const result=[];
 for(const topic of canonical){
  const record=records.get(topic.id);
  if(record?.status==='archived')continue;
  seen.add(topic.id);
  result.push(record?.status==='published'?{
   ...topic,title:record.title, hint:record.lead||topic.hint,
   editorTheme:record.theme||undefined, editorial:true
  }:topic);
 }
 for(const record of records.values()){
  if(record.status!=='published'||seen.has(record.id))continue;
  result.push({
   id:record.id, title:record.title,
   hint:record.lead||record.definition,domain:record.domain,
   editorTheme:record.theme,aliases:[],quality:'staff-editorial',
   contextFirst:true,needsHuman:false,editorial:true
  });
 }
 return result;
}
