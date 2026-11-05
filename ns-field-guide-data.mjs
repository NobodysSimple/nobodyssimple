/**
 * Nobody's Simple · Living Field Guide — versioned, user-authored private work.
 * No heuristics, interpretation, automatic import, or background logging.
 * Storage is account-scoped by the existing Workspace interceptor when signed in.
 */
export const GUIDE_KEY = 'ns-field-guide-v1';
export const GUIDE_VERSION = 1;
export const GUIDE_CATEGORIES = Object.freeze([
  {id:'helps', name:'What helps me', short:'Helpful strategies', description:'Things that have been useful in particular situations.', tone:'meadow'},
  {id:'patterns', name:'Patterns I’ve noticed', short:'Working observations', description:'Situations, responses and connections worth noticing again.', tone:'forest'},
  {id:'skills', name:'Skills I’m practising', short:'Skills in progress', description:'Ways of responding I want to practise, without needing to get them right every time.', tone:'workshop'},
  {id:'reconsider', name:'Things to reconsider', short:'Ideas worth revisiting', description:'Interpretations or assumptions that may deserve another look.', tone:'observatory'}
]);
export const GUIDE_TAGS = Object.freeze([
  {id:'observation', name:'Something I noticed', help:'An observation tied to a situation, not a general rule.'},
  {id:'hypothesis', name:'A possibility I’m testing', help:'One interpretation among others, still open to revision.'},
  {id:'helped_before', name:'Something that helped before', help:'Useful in one context; not a guarantee for next time.'}
]);
const CATEGORY_IDS = new Set(GUIDE_CATEGORIES.map(x=>x.id));
const TAG_IDS = new Set(GUIDE_TAGS.map(x=>x.id));
const SOURCE_IDS = new Set(['manual','lab','lesson','tool']);
const limit=(v,n)=>String(v??'').normalize('NFKC').trim().slice(0,n);
const iso=v=>typeof v==='string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d/.test(v) && !Number.isNaN(Date.parse(v));
const isObj=v=>v && typeof v==='object' && !Array.isArray(v);
const MAX_ENTRIES=150;
const MAX_BYTES=640_000;
const empty=()=>({schemaVersion:GUIDE_VERSION,entries:[]});
function entryValid(e){
  return isObj(e)&&e.schemaVersion===GUIDE_VERSION&&typeof e.id==='string'&&/^[0-9a-z-]{8,80}$/i.test(e.id)
   &&CATEGORY_IDS.has(e.category)&&TAG_IDS.has(e.confidenceTag)&&typeof e.title==='string'&&e.title.length>0&&e.title.length<=110
   &&typeof e.text==='string'&&e.text.length>0&&e.text.length<=1800&&typeof e.context==='string'&&e.context.length<=360
   &&SOURCE_IDS.has(e.sourceType)&&typeof e.sourceId==='string'&&e.sourceId.length<=100&&e.visibility==='private'
   &&iso(e.createdAt)&&iso(e.editedAt);
}
function parse(raw){
  if(raw===null)return empty();
  if(new TextEncoder().encode(raw).length>MAX_BYTES)throw Error('The saved Field Guide is larger than the supported limit. Export it from Saved work before making changes.');
  let data;
  try{data=JSON.parse(raw);}catch{throw Error('Your Field Guide contains data that could not be read. No data was changed.');}
  if(!isObj(data)||data.schemaVersion!==GUIDE_VERSION||!Array.isArray(data.entries)||data.entries.length>MAX_ENTRIES
   ||data.entries.some(e=>!entryValid(e))||new Set(data.entries.map(e=>e.id)).size!==data.entries.length){
     throw Error('This Field Guide has an unfamiliar format. Your existing data has not been modified.');
   }
  return data;
}
export function readFieldGuide(storage){
  try{return {ok:true,guide:parse(storage.getItem(GUIDE_KEY))};}
  catch(error){return {ok:false,error:error.message,guide:null};}
}
function write(storage,guide){
  const json=JSON.stringify(guide);
  if(new TextEncoder().encode(json).length>MAX_BYTES)throw Error('The Field Guide is full. Export a copy and remove old entries before adding more.');
  storage.setItem(GUIDE_KEY,json);
  return guide;
}
function newEntryId(){
 if(typeof crypto.randomUUID==='function')return crypto.randomUUID();
 const bytes=crypto.getRandomValues(new Uint8Array(16));bytes[6]=(bytes[6]&15)|64;bytes[8]=(bytes[8]&63)|128;
 const hex=[...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');
 return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join('-');
}
export function saveFieldGuideEntry(storage,values,{id='',now=new Date().toISOString(),makeId=newEntryId}={}){
  const result=readFieldGuide(storage);
  if(!result.ok)throw Error(result.error);
  const guide=result.guide;
  const before=id?guide.entries.find(e=>e.id===id):null;
  if(id&&!before)throw Error('That entry no longer exists. No changes were saved.');
  if(!before&&guide.entries.length>=MAX_ENTRIES)throw Error('The Field Guide is full. Export or remove an entry first.');
  const title=limit(values.title,110),text=limit(values.text,1800),context=limit(values.context,360);
  if(!title||!text)throw Error('Please give this entry a title and a note before saving.');
  const category=values.category,confidenceTag=values.confidenceTag;
  if(!CATEGORY_IDS.has(category)||!TAG_IDS.has(confidenceTag))throw Error('Please choose a valid collection and entry type.');
  const record={schemaVersion:GUIDE_VERSION,id:before?.id||makeId(),createdAt:before?.createdAt||now,editedAt:now,
    category,title,text,context,confidenceTag,
    sourceType:before?.sourceType||(SOURCE_IDS.has(values.sourceType)?values.sourceType:'manual'),
    sourceId:before?.sourceId||limit(values.sourceId,100),visibility:'private'};
  if(!entryValid(record))throw Error('The entry could not be validated. No changes were saved.');
  const entries=before?guide.entries.map(e=>e.id===before.id?record:e):[record,...guide.entries];
  write(storage,{schemaVersion:GUIDE_VERSION,entries});
  return record;
}
export function deleteFieldGuideEntry(storage,id){
  const result=readFieldGuide(storage);if(!result.ok)throw Error(result.error);
  const list=result.guide.entries;
  if(!list.some(e=>e.id===id))return false;
  write(storage,{schemaVersion:GUIDE_VERSION,entries:list.filter(e=>e.id!==id)});return true;
}
export function exportFieldGuideJSON(storage){
  const result=readFieldGuide(storage);if(!result.ok)throw Error(result.error);
  return JSON.stringify(result.guide,null,2)+'\n';
}
