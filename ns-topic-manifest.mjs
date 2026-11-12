/* Published topic overrides and staff-authored additions.
 * This manifest is public editorial data, never executable JavaScript.
 * Live data is installed before the site renders; an empty manifest preserves
 * the bundled 518 source topics and their original safety classifications.
 */
import {NAV_THEMES} from './ns-needs-themes.mjs';
export const TOPIC_MANIFEST_VERSION=1;
const validThemes=new Set(NAV_THEMES.map(t=>t.id));
const slug=/^[a-z][a-z0-9-]{2,79}$/;
const safeString=(value,max=4000)=>String(value??'').slice(0,max);
const cleanArray=(value,max=12)=>Array.isArray(value)?value.slice(0,max).map(x=>safeString(x,1800)):[];
const cleanPairs=(value,max=10,fields=['label','detail'])=>Array.isArray(value)?value.slice(0,max).map(x=>Object.fromEntries(fields.map(k=>[k,safeString(x?.[k],1800)]))):[];
const safeSource=x=>x&&/^https:\/\//i.test(String(x.url||''))?{name:safeString(x.name,140),url:safeString(x.url,500)}:null;
const statuses=new Set(['published','deleted']);
const kinds=new Set(['new','override']);
const allowedKinds=new Set(['environment','behaviour','planning','cognitive','observe','dbt','acceptance','compassion','support']);
const allowedWorksheets=new Set(['environment','step','thought','ground','values','request','pause','needs','compassion','control','track','plan','rest','conversation']);
const cleanPrompts=raw=>Array.isArray(raw)?raw.slice(0,3).map((p,i)=>({
 id:slug.test(String(p?.id||''))?String(p.id):'question-'+i,
 label:safeString(p?.label,280),hint:safeString(p?.hint,400)
})):[];
function normaliseMethod(value,index){
 const type=value?.type==='new'?'new':'override';
 const id=safeString(value?.id,90);
 if(!slug.test(id))throw Error('An approach needs a valid identifier.');
 if(type==='new'&&!allowedKinds.has(value.kind))throw Error('Choose a valid approach family.');
 if(type==='new'&&!allowedWorksheets.has(value.worksheet))throw Error('Choose a supported worksheet type.');
 return {
  id,type,title:safeString(value?.title,170),why:safeString(value?.why,900),
  steps:cleanArray(value?.steps,6),caution:safeString(value?.caution,900),
  ...(type==='new'?{kind:value.kind,worksheet:value.worksheet,tool:safeString(value.tool,90)}:{}),
  prompts:cleanPrompts(value?.prompts)
 };
}
export function normaliseTopicRecord(item){
 if(!item||!slug.test(String(item.id||'')))throw Error('Topic IDs must use lowercase letters, numbers and hyphens (3–80 characters).');
 if(!kinds.has(item.kind))throw Error('Select whether this is an existing or new topic.');
 if(!statuses.has(item.status))throw Error('A published topic must have an explicit status.');
 if(!validThemes.has(item.theme))throw Error('Choose one of the current eleven topic themes.');
 const guide=item.guide||{},editorial=item.editorial||{};
 const methods=Array.isArray(item.methods)?item.methods.slice(0,40).map(normaliseMethod):[];
 if(new Set(methods.map(m=>m.id)).size!==methods.length)throw Error('A topic has duplicate approach identifiers.');
 if(item.kind==='new'&&(!String(item.title||'').trim()||!String(item.hint||'').trim()))throw Error('New topics require a title and a short summary.');
 if(item.status==='published'&&item.kind==='new'&&!String(guide.what||item.hint||'').trim())throw Error('A published new topic must explain its subject.');
 const result={
  id:item.id,kind:item.kind,status:item.status,theme:item.theme,
  title:safeString(item.title,200),hint:safeString(item.hint,450),
  // Original safety state is never overwritten for an existing topic.
  ...(item.kind==='new'?{domain:safeString(item.domain||'growth',40),safetyFirst:Boolean(item.safetyFirst),
    supportFirst:Boolean(item.supportFirst),medical:Boolean(item.medical)}:{}),
  guide:{
   lead:safeString(guide.lead,1200),what:safeString(guide.what,3200),
   cycle:safeString(guide.cycle,2200),recognise:cleanArray(guide.recognise),
   contributors:cleanArray(guide.contributors),goals:cleanArray(guide.goals),
   progress:safeString(guide.progress,1800),cautions:cleanArray(guide.cautions),
   mechanisms:cleanPairs(guide.mechanisms,10,['label','detail','target'])
  },
  editorial:{
   recognition:cleanArray(editorial.recognition,6),reframe:safeString(editorial.reframe,2000),
   core:cleanPairs(editorial.core,4),traps:cleanPairs(editorial.traps,7),
   steps:cleanPairs(editorial.steps,4),progress:cleanArray(editorial.progress,8),
   faq:cleanPairs(editorial.faq,9,['question','answer']),
   supportText:safeString(editorial.supportText,2000),closing:safeString(editorial.closing,2000)
  },methods,source:safeSource(item.source),updatedAt:safeString(item.updatedAt,45)
 };
 if(item.kind==='new'&&!result.safetyFirst&&!result.supportFirst&&result.editorial.reframe.length<30)
  throw Error('New public guides need a meaningful explanatory reframe (at least 30 characters).');
 return result;
}
export function validateTopicManifest(raw,{existingIds=null}={}){
 if(!raw||raw.version!==TOPIC_MANIFEST_VERSION||!Array.isArray(raw.topics)||raw.topics.length>2000)
  throw Error('The topic manifest has an unsupported format.');
 const topics=raw.topics.map(normaliseTopicRecord);
 const seen=new Set();
 for(const item of topics){
  if(seen.has(item.id))throw Error('Repeated topic identifier: '+item.id);
  seen.add(item.id);
  if(existingIds){
   const exists=existingIds.has(item.id);
   if(exists&&item.kind!=='override')throw Error('Cannot create another topic using an existing ID: '+item.id);
   if(!exists&&item.kind!=='new')throw Error('Cannot edit a missing bundled topic: '+item.id);
  }
 }
 return {version:TOPIC_MANIFEST_VERSION,topics};
}
let live={version:1,topics:[]};
let records=new Map();
export function installTopicManifest(value){
 const next=validateTopicManifest(value);
 live=next;records=new Map(next.topics.map(item=>[item.id,item]));
}
export function activeTopicRecord(id){
 const result=records.get(id);
 return result?.status==='published'?result:null;
}
export const topicHidden=id=>records.get(id)?.status==='deleted';
export function publicTopicIndex(bundled){
 const original=bundled.filter(p=>!topicHidden(p.id)).map(p=>{
  const record=activeTopicRecord(p.id);
  if(!record)return p;
  return {...p,title:record.title||p.title,hint:record.hint||p.hint,theme:record.theme,
    aliases:[...(p.aliases||[]),...(record.guide?.recognise||[]).slice(0,3)]};
 });
 const existing=new Set(bundled.map(p=>p.id));
 const custom=live.topics.filter(r=>r.kind==='new'&&r.status==='published'&&!existing.has(r.id))
  .map(r=>({id:r.id,title:r.title,hint:r.hint,domain:r.domain,theme:r.theme,
   aliases:[],quality:'staff-editorial',contextFirst:true,needsHuman:r.safetyFirst,
   supportFirst:r.supportFirst,medical:r.medical}));
 return [...original,...custom];
}
export function publicTopicById(id,bundled){
 if(topicHidden(id))return null;
 const entry=bundled.find(p=>p.id===id);
 if(entry){
  const r=activeTopicRecord(id);
  return r?{...entry,title:r.title||entry.title,hint:r.hint||entry.hint,theme:r.theme}:entry;
 }
 const r=activeTopicRecord(id);
 return r?.kind==='new'?publicTopicIndex([]).find(p=>p.id===id)||null:null;
}
export function mergePublishedGuide(guide,id){
 const r=activeTopicRecord(id);
 if(!r)return guide;
 const settings=r.guide||{};
 return {...guide,title:r.title||guide.title,lead:settings.lead||guide.lead,
  what:settings.what||guide.what,cycle:settings.cycle||guide.cycle,
  recognise:settings.recognise.length?settings.recognise:guide.recognise,
  contributors:settings.contributors.length?settings.contributors:guide.contributors,
  goals:settings.goals.length?settings.goals:guide.goals,
  progress:settings.progress||guide.progress,
  mechanisms:settings.mechanisms.length?settings.mechanisms:guide.mechanisms,
  cautions:settings.cautions.length?settings.cautions:guide.cautions,
  sources:r.source?[{name:r.source.name,url:r.source.url,scope:'Staff editorial reference; source is not validation of the guide.'},...guide.sources]:guide.sources,
  pageEditorial:r.editorial,methodEdits:r.methods,
  review:guide.review+' · Staff-edited; check individual sources and clinical limitations.'
 };
}
export const emptyTopicManifest=()=>({version:TOPIC_MANIFEST_VERSION,topics:[]});
