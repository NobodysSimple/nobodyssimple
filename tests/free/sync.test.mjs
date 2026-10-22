import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as policy from '../../account-policy.mjs';
import {Workspace} from '../../account-storage.mjs';
const text=readFileSync(new URL('../../account-sync.mjs',import.meta.url),'utf8').replace(/^import .*\n/gm,'').replace('export class SavedSync','class SavedSync');
const factory=new Function('sdk','policy',`const {collection,doc,getDocs,onSnapshot,runTransaction,serverTimestamp}=sdk;const {SAVED,parseJSON,withinSize,shouldConflict}=policy;${text};return SavedSync;`);
class Store{constructor(){this.d=new Map();}getItem(k){return this.d.get(k)??null;}setItem(k,v){this.d.set(k,String(v));}removeItem(k){this.d.delete(k);}key(i){return [...this.d.keys()][i];}get length(){return this.d.size;}}
const key='ns-personal-maps-v1';
function setup(){
 global.window={addEventListener(){}};Object.defineProperty(global,'navigator',{value:{onLine:true},configurable:true});
 const records=new Map(),listeners=[];let fail=false,gate=null;
 const snapshot=()=>({docs:[...records].map(([path,data])=>({id:path.split('/').at(-1),data:()=>data}))});
 const sdk={collection:(_,...parts)=>parts.join('/'),doc:(_,...parts)=>parts.join('/'),getDocs:async()=>snapshot(),onSnapshot:(path,callback)=>{listeners.push(callback);return ()=>{};},serverTimestamp:()=>Date.now(),runTransaction:async(_,work)=>{if(fail)throw Error('offline');await work({get:async ref=>{if(gate)await gate;return {data:()=>records.get(ref)};},set:(ref,value)=>records.set(ref,value)});}};
 const ws=new Workspace(new Store(),new Store());ws.scope('A');const Sync=factory(sdk,policy),sync=new Sync({},ws,()=>{});sync.start('A');sync.keys.add(key);
 return {sync,ws,records,emit:()=>listeners.at(-1)(snapshot()),setFail:v=>fail=v,setGate:v=>gate=v};
}
test('offline edits retained, retried, and tombstone deletion propagates',async()=>{
 const x=setup();try{
 x.setFail(true);x.ws.write(key,'first');await x.sync.flush();assert.equal(x.sync.pending[key].value,'first');assert.equal(x.ws.read(key),'first');
 x.setFail(false);await x.sync.flush();assert.equal(Object.keys(x.sync.pending).length,0);assert.equal(x.records.get('users/A/savedWork/'+key).value,'first');
 x.ws.write(key,'',true);await x.sync.flush();const record=x.records.get('users/A/savedWork/'+key);assert.equal(record.deleted,true);assert.equal(record.revision,2);assert.ok(!('value'in record));
 }finally{x.sync.end();}
});
test('two device collision preserves both versions until user chooses',async()=>{
 const x=setup();try{
 x.sync.revisions.set(key,1);x.records.set('users/A/savedWork/'+key,{revision:2,value:'other device',deleted:false});x.ws.write(key,'my edit');await x.sync.flush();assert.equal(x.sync.conflicts.size,1);assert.equal(x.ws.read(key),'my edit');assert.equal(x.records.get('users/A/savedWork/'+key).value,'other device');
 x.sync.resolve(key,'cloud');assert.equal(x.ws.read(key),'other device');assert.equal(Object.keys(x.sync.pending).length,0);
 }finally{x.sync.end();}
});
test('editing while a save is in flight retains the later edit',async()=>{
 const x=setup();let release;try{
 x.setGate(new Promise(r=>release=r));x.ws.write(key,'first');const flushing=x.sync.flush();x.ws.write(key,'second');release();await flushing;assert.equal(x.sync.pending[key].value,'second');assert.equal(x.sync.pending[key].base,1);
 x.setGate(null);await x.sync.flush();assert.equal(x.records.get('users/A/savedWork/'+key).value,'second');assert.equal(x.records.get('users/A/savedWork/'+key).revision,2);
 }finally{release?.();x.sync.end();}
});
