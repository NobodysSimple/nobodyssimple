import test from 'node:test';
import assert from 'node:assert/strict';
import {
  WORKSPACE_KEY,readWorkspace,saveRecord,amendRecord,deleteRecord,
  addEvent,exportWorkspace,mergeWorkspace,live
} from '../ns-field-guide-workspace-data.mjs';
const store=()=>{const data=new Map();return {
  getItem:key=>data.has(key)?data.get(key):null,
  setItem:(key,value)=>data.set(key,String(value)),
  removeItem:key=>data.delete(key)
};};
test('migrates old notes once without removing the original collection',()=>{
  const s=store();
  const old={schemaVersion:1,entries:[{
    id:'123e4567-e89b-12d3-a456-426614174000',title:'My earlier note',
    text:'This helped me',context:'At home',category:'helps',
    createdAt:'2026-11-01T10:00:00.000Z',editedAt:'2026-11-02T10:00:00.000Z'
  }]};
  s.setItem('ns-field-guide-v1',JSON.stringify(old));
  const first=readWorkspace(s); assert.equal(first.ok,true);
  assert.equal(first.data.records.length,1);
  assert.equal(first.data.records[0].body,'This helped me');
  assert.equal(s.getItem('ns-field-guide-v1'),JSON.stringify(old));
  assert.equal(readWorkspace(s).data.records.length,1);
});
test('captures a thought without forcing a title and supports named notebooks',()=>{
  const s=store();
  const notebook=saveRecord(s,'notebook',{title:'Unsent letters'});
  const note=saveRecord(s,'note',{body:'A thought I want to keep',capture:'dump',notebookId:notebook.id});
  assert.equal(note.title,'A thought I want to keep');
  assert.equal(note.notebookId,notebook.id);
  assert.equal(live(readWorkspace(s).data).length,2);
});
test('preserves past versions, sections, experiment results and optional review dates',()=>{
  const s=store();
  const chapter=saveRecord(s,'chapter',{title:'Social judgement',body:'I often replay conversations'});
  const later=saveRecord(s,'chapter',{title:'Social judgement',body:'It is not always evidence',stage:'review',
    fields:{review:'I tested a smaller prediction'}},chapter.id);
  assert.equal(later.revision,2);
  assert.equal(later.history[0].snapshot.body,'I often replay conversations');
  addEvent(s,chapter.id,{text:'Asked a neutral question instead',kind:'reflection',done:true});
  const dated=amendRecord(s,chapter.id,{dueAt:'2027-01-10'});
  assert.equal(dated.dueAt,'2027-01-10');
  assert.equal(dated.events[0].text,'Asked a neutral question instead');
  assert.match(exportWorkspace(s,chapter.id),/smaller prediction/);
});
test('links are stable record IDs and exports include linked chapters',()=>{
  const s=store(),chapter=saveRecord(s,'chapter',{title:'Learn to disagree'});
  const practice=saveRecord(s,'practice',{title:'Try a small disagreement',chapterId:chapter.id,links:[chapter.id]});
  const result=JSON.parse(exportWorkspace(s,chapter.id));
  assert.equal(result.record.id,chapter.id);
  assert.equal(result.linked[0].id,practice.id);
});
test('only different-record edits merge automatically',()=>{
  const base=store(),a=store(),b=store();
  const chapter=saveRecord(base,'chapter',{title:'Shared first version',body:'Initial'});
  a.setItem(WORKSPACE_KEY,base.getItem(WORKSPACE_KEY));
  b.setItem(WORKSPACE_KEY,base.getItem(WORKSPACE_KEY));
  saveRecord(a,'note',{body:'Device A note'});
  saveRecord(b,'note',{body:'Device B note'});
  const union=mergeWorkspace(a.getItem(WORKSPACE_KEY),b.getItem(WORKSPACE_KEY));
  assert.equal(JSON.parse(union).records.length,3);
  amendRecord(a,chapter.id,{body:'Device A change'});
  amendRecord(b,chapter.id,{body:'Device B change'});
  assert.equal(mergeWorkspace(a.getItem(WORKSPACE_KEY),b.getItem(WORKSPACE_KEY)),null);
});
test('later revision can merge when its history establishes descent',()=>{
  const a=store(),b=store();
  const note=saveRecord(a,'note',{title:'A',body:'Old'});
  b.setItem(WORKSPACE_KEY,a.getItem(WORKSPACE_KEY));
  saveRecord(a,'note',{title:'A',body:'Revised'},note.id);
  const result=mergeWorkspace(a.getItem(WORKSPACE_KEY),b.getItem(WORKSPACE_KEY));
  assert.equal(JSON.parse(result).records[0].body,'Revised');
});
test('deleting scrubs content and versions; a tombstone blocks legacy reimport',()=>{
  const s=store();
  const id='123e4567-e89b-12d3-a456-426614174000';
  s.setItem('ns-field-guide-v1',JSON.stringify({schemaVersion:1,entries:[{
    id,title:'Very private',text:'Secret words',
    createdAt:'2026-11-01T10:00:00.000Z',editedAt:'2026-11-01T10:00:00.000Z'
  }]}));
  const migrated=readWorkspace(s).data.records[0];
  assert.equal(deleteRecord(s,migrated.id),true);
  assert.equal(readWorkspace(s).data.records.length,1);
  assert.equal(live(readWorkspace(s).data).length,0);
  assert.doesNotMatch(s.getItem(WORKSPACE_KEY),/Secret words/);
  assert.equal(s.getItem('ns-field-guide-v1').includes('Secret words'),true);
});
test('unfamiliar stored formats fail without overwriting user data',()=>{
  const s=store(),invalid='{"schemaVersion":300,"records":[]}';
  s.setItem(WORKSPACE_KEY,invalid);
  assert.equal(readWorkspace(s).ok,false);
  assert.throws(()=>saveRecord(s,'note',{body:'Do not erase existing'}));
  assert.equal(s.getItem(WORKSPACE_KEY),invalid);
});
