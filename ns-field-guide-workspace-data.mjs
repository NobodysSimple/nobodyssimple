/**
 * Nobody's Simple — private Living Field Guide workspace.
 * Structured records are user-authored; never infer a diagnosis or silently import
 * activities. Legacy v1 entries remain untouched and are copied idempotently.
 */
export const WORKSPACE_KEY = 'ns-field-guide-workspace-v2';
export const DRAFT_KEY = 'ns-field-guide-draft-v1';
export const VERSION = 2;
export const TYPES = ['note','chapter','self','practice','conversation','notebook','reference'];
export const CAPTURES = [
  ['quick','Quick capture'], ['dump','Everything on my mind'],
  ['feeling',"Something I'm feeling"],['question',"Something I'm figuring out"],
  ['idea','Ideas & possibilities'],['remember',"Things I don't want to forget"]
];
export const CHAPTER_STATES = ['exploring','practising','waiting','paused','archived'];
export const STAGES = ['notice','understand','decide','try','review','revise'];
export const SELF_GROUPS = ['past','present','future','values','boundaries','needs','strengths','contexts'];
export const PRACTICE_TYPES = ['experiment','rehearsal','habit','plan'];
const bytes = value => new TextEncoder().encode(value).length;
const MAX_BYTES = 760000;
const MAX_RECORDS = 2500;
const MAX_BODY = 30000;
const MAX_HISTORY = 15;
const now = () => new Date().toISOString();
const isObject = x => x && typeof x === 'object' && !Array.isArray(x);
const text = (v,n=MAX_BODY) => String(v ?? '').slice(0,n);
const date = x => typeof x === 'string' && !Number.isNaN(Date.parse(x));
const empty = () => ({schemaVersion: VERSION, records: []});
export const uid = () => typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
  ? crypto.randomUUID()
  : 'fg-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,12);
const strip = r => {
  const {history,...snapshot}=r;
  return snapshot;
};
const good = r => isObject(r) && typeof r.id === 'string' && r.id.length > 0 &&
  TYPES.includes(r.type) && typeof r.title === 'string' &&
  typeof r.body === 'string' && typeof r.createdAt === 'string' &&
  typeof r.updatedAt === 'string' && Number.isSafeInteger(r.revision) &&
  Array.isArray(r.links) && Array.isArray(r.sources) &&
  Array.isArray(r.history) && isObject(r.fields) && typeof r.deleted === 'boolean' &&
  r.visibility === 'private';
const parse = raw => {
  if(raw === null) return empty();
  if(bytes(raw) > MAX_BYTES) throw Error('This workspace exceeds the supported storage size. Export your work before editing.');
  let data;
  try {data = JSON.parse(raw);} catch {throw Error('Your Field Guide could not be read. Nothing was changed.');}
  if(!isObject(data) || data.schemaVersion !== VERSION || !Array.isArray(data.records) ||
    data.records.length > MAX_RECORDS || data.records.some(r => !good(r)) ||
    new Set(data.records.map(r => r.id)).size !== data.records.length)
    throw Error('An unfamiliar Field Guide format was found. Your saved work has not been overwritten.');
  return data;
};
function write(storage,data) {
  const json=JSON.stringify(data);
  if(data.records.length > MAX_RECORDS || bytes(json) > MAX_BYTES)
    throw Error('Your Field Guide storage is full. Export a backup and archive some work before continuing.');
  storage.setItem(WORKSPACE_KEY,json);
}
function base(type,values={},at=now()) {
  return {
    id:uid(), type, title:text(values.title || '',140), body:text(values.body),
    createdAt:at, updatedAt:at, revision:1, deleted:false, visibility:'private',
    capture:CAPTURES.some(v=>v[0]===values.capture)?values.capture:'quick',
    status:text(values.status || (type==='chapter'?'exploring':'active'),30),
    stage:text(values.stage || 'notice',20),
    selfGroup:text(values.selfGroup || 'present',30),
    practiceType:text(values.practiceType || 'experiment',30),
    notebookId:text(values.notebookId,90), chapterId:text(values.chapterId,90),
    context:text(values.context,1500), usefulWhen:text(values.usefulWhen,800),
    dueAt:text(values.dueAt,12), pinned:values.pinned===true,
    links:Array.isArray(values.links)?[...new Set(values.links.filter(x=>typeof x==='string'))].slice(0,80):[],
    sources:Array.isArray(values.sources)?values.sources.filter(isObject).slice(0,40).map(s=>({
      app:text(s.app,40), id:text(s.id,180), title:text(s.title,160), href:text(s.href,300)
    })):[],
    fields:isObject(values.fields)?Object.fromEntries(Object.entries(values.fields).slice(0,30).map(([k,v])=>[text(k,40),text(v,8000)])):{},
    events:Array.isArray(values.events)?values.events.filter(isObject).slice(-120):[],
    history:[]
  };
}
function migrate(storage,data) {
  const legacy=storage.getItem('ns-field-guide-v1');
  if(!legacy)return data;
  let old;
  try{old=JSON.parse(legacy);}catch{return data;}
  if(!old || !Array.isArray(old.entries))return data;
  const ids=new Set(data.records.map(r=>r.id));
  const additions=[];
  for(const e of old.entries) {
    if(!e || typeof e.id!=='string' || !e.title || typeof e.text!=='string')continue;
    const id='legacy-'+e.id;
    if(ids.has(id))continue;
    const at=date(e.createdAt)?e.createdAt:now();
    const r=base('note',{title:e.title,body:e.text,context:e.context,
      capture:'remember',status:'legacy-'+text(e.category,20),
      sources:[{app:'field-guide-v1',id:e.id,title:'Original Field Guide entry',href:'#guide/entry/'+encodeURIComponent(e.id)}]},at);
    r.id=id;r.updatedAt=date(e.editedAt)?e.editedAt:at;
    additions.push(r);ids.add(id);
  }
  if(!additions.length)return data;
  const next={schemaVersion:VERSION,records:data.records.concat(additions)};
  // Preserve old key regardless of success. Never truncate older entries.
  write(storage,next);
  return next;
}
export function readWorkspace(storage,{importLegacy=true}={}) {
  try{
    let data=parse(storage.getItem(WORKSPACE_KEY));
    if(importLegacy)data=migrate(storage,data);
    return {ok:true,data};
  }catch(error){return {ok:false,error:error.message,data:null};}
}
function loaded(storage){
  const r=readWorkspace(storage);
  if(!r.ok)throw Error(r.error);
  return r.data;
}
function sanitise(type,values,existing) {
  if(!TYPES.includes(type))throw Error('Unknown Field Guide entry type.');
  const obj=base(type,values,existing?.createdAt);
  if(existing){obj.id=existing.id;obj.createdAt=existing.createdAt;obj.revision=existing.revision+1;}
  if(!obj.title.trim() && !obj.body.trim())throw Error('Write something before saving.');
  if(!obj.title.trim())obj.title=text(obj.body.split('\n')[0].trim() || 'Untitled',140);
  if(!obj.title.trim())throw Error('Please enter a title or some content.');
  if(!['active','done','archived','paused','waiting','exploring','practising','open','completed','reconsider'].includes(obj.status))
    obj.status='active';
  if(!STAGES.includes(obj.stage))obj.stage='notice';
  if(!SELF_GROUPS.includes(obj.selfGroup))obj.selfGroup='present';
  if(!PRACTICE_TYPES.includes(obj.practiceType))obj.practiceType='experiment';
  if(existing){
    // Preserve existing links/sources/events unless the editor deliberately changes them.
    if(values.links===undefined)obj.links=existing.links;
    if(values.sources===undefined)obj.sources=existing.sources;
    if(values.events===undefined)obj.events=existing.events;
    if(values.fields===undefined)obj.fields=existing.fields;
    if(values.pinned===undefined)obj.pinned=existing.pinned;
    if(values.chapterId===undefined)obj.chapterId=existing.chapterId;
    if(values.notebookId===undefined)obj.notebookId=existing.notebookId;
  }
  return obj;
}
export function saveRecord(storage,type,values={},id=''){
  const data=loaded(storage);
  const old=id?data.records.find(r=>r.id===id && !r.deleted):null;
  if(id&&!old)throw Error('This entry is unavailable. No changes were saved.');
  const r=sanitise(type,values,old);
  r.updatedAt=now();
  if(old)r.history=old.history.concat([{revision:old.revision,snapshot:strip(old),at:old.updatedAt}]).slice(-MAX_HISTORY);
  const next={...data,records:old?data.records.map(x=>x.id===id?r:x):data.records.concat(r)};
  write(storage,next);return r;
}
export function amendRecord(storage,id,patch) {
  const data=loaded(storage),old=data.records.find(r=>r.id===id&&!r.deleted);
  if(!old)throw Error('Entry not found.');
  const next={...old,...patch,updatedAt:now(),revision:old.revision+1,
    history:old.history.concat([{revision:old.revision,snapshot:strip(old),at:old.updatedAt}]).slice(-MAX_HISTORY)};
  if(patch.links)next.links=[...new Set(patch.links.filter(x=>typeof x==='string'))].slice(0,80);
  if(patch.sources)next.sources=patch.sources.filter(isObject).slice(0,40);
  if(patch.events)next.events=patch.events.filter(isObject).slice(-120);
  if(patch.fields)next.fields=Object.fromEntries(Object.entries(patch.fields).map(([k,v])=>[text(k,40),text(v,8000)]));
  if(patch.dueAt!==undefined)next.dueAt=text(patch.dueAt,12);
  if(patch.usefulWhen!==undefined)next.usefulWhen=text(patch.usefulWhen,800);
  if(patch.status!==undefined)next.status=text(patch.status,30);
  if(patch.stage!==undefined)next.stage=STAGES.includes(patch.stage)?patch.stage:'notice';
  next.visibility='private';next.id=old.id;next.type=old.type;next.createdAt=old.createdAt;next.deleted=false;
  write(storage,{...data,records:data.records.map(r=>r.id===id?next:r)});return next;
}
export function deleteRecord(storage,id) {
  const data=loaded(storage),old=data.records.find(r=>r.id===id&&!r.deleted);
  if(!old)return false;
  // Tombstone retains the identifier so another device cannot resurrect deleted content.
  const erased={...base(old.type,{title:'Deleted entry'} ,old.createdAt),id:old.id,deleted:true,
    revision:old.revision+1,updatedAt:now()};
  write(storage,{...data,records:data.records.map(r=>r.id===id?erased:r)});
  return true;
}
export function addEvent(storage,id,values={}) {
  const data=loaded(storage),r=data.records.find(x=>x.id===id&&!x.deleted);
  if(!r)throw Error('Entry not found.');
  return amendRecord(storage,id,{events:r.events.concat([{
    id:uid(),at:now(),kind:text(values.kind || 'reflection',40),
    text:text(values.text,7000),done:values.done===true
  }])});
}
export const live = data => data.records.filter(r=>!r.deleted);
export function exportWorkspace(storage,id='') {
  const data=loaded(storage);
  if(!id)return JSON.stringify(data,null,2)+'\n';
  const selected=data.records.find(r=>r.id===id&&!r.deleted);
  if(!selected)throw Error('Entry not found.');
  return JSON.stringify({schemaVersion:VERSION,exportedAt:now(),
    record:selected,linked:live(data).filter(r=>selected.links.includes(r.id) || r.chapterId===selected.id)},null,2)+'\n';
}
export function mergeWorkspace(localJSON,remoteJSON) {
  try {
    const a=parse(localJSON),b=parse(remoteJSON),all=new Map();
    for(const r of a.records)all.set(r.id,r);
    for(const r of b.records) {
      const x=all.get(r.id);
      if(!x){all.set(r.id,r);continue;}
      if(JSON.stringify(x)===JSON.stringify(r))continue;
      if(x.revision===r.revision)return null;
      const newer=x.revision>r.revision?x:r,older=x.revision>r.revision?r:x;
      // Only auto-merge a genuine descendant, never divergent edits of one record.
      if(!newer.history.some(h=>h.revision===older.revision &&
        JSON.stringify(h.snapshot)===JSON.stringify(strip(older))))return null;
      all.set(r.id,newer);
    }
    const combined={schemaVersion:VERSION,records:[...all.values()]};
    const json=JSON.stringify(combined);
    return combined.records.length<=MAX_RECORDS&&bytes(json)<=MAX_BYTES?json:null;
  }catch{return null;}
}
