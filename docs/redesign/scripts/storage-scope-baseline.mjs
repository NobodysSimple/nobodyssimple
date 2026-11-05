// Characterization of baseline a05d5b6, NOT an assertion that uncovered keys are safe.
// All values are synthetic. No browser, real account, Firebase or network involved.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Workspace} from '../../../account-storage.mjs';
import {SAVED} from '../../../account-policy.mjs';
class Store {
  constructor(){this.data=new Map();}
  getItem(k){return this.data.get(k)??null;}
  setItem(k,v){this.data.set(k,String(v));}
  removeItem(k){this.data.delete(k);}
  clear(){this.data.clear();}
  key(i){return [...this.data.keys()][i]??null;}
  get length(){return this.data.size;}
}
const storage=new Store(),session=new Store(),ws=new Workspace(storage,session);
ws.install();
for(const key of Object.keys(SAVED))storage.setItem(key,'guest fixture');
ws.scope('synthetic-A');
for(const key of Object.keys(SAVED)){
  assert.equal(storage.getItem(key),null);
  storage.setItem(key,'A fixture');
}
ws.scope('synthetic-B');
for(const key of Object.keys(SAVED))assert.equal(storage.getItem(key),null);
ws.scope('synthetic-A');ws.locked=true;
for(const key of Object.keys(SAVED)){
  assert.equal(storage.getItem(key),null);
  assert.throws(()=>storage.setItem(key,'blocked fixture'));
}
ws.scope('synthetic-A',true);
for(const key of Object.keys(SAVED)){
  assert.equal(storage.getItem(key),null);
  storage.setItem(key,'session fixture');
  assert.equal(session.getItem(ws.key(key)),'session fixture');
}
ws.scope('synthetic-A');
for(const key of Object.keys(SAVED))assert.equal(storage.getItem(key),'A fixture');
const gaps=[];
for(const key of ['ns-simplyfocus-recipe-v2','ns-big-five-atlas-v1','ns-lifestyle-tasks-v1']){
  assert.equal(SAVED[key],undefined);
  ws.scope('synthetic-A');storage.setItem(key,'unscoped fixture');
  assert.ok(!ws.entries().some(([k])=>k===key));
  ws.scope('synthetic-B');assert.equal(storage.getItem(key),'unscoped fixture');
  ws.locked=true;assert.equal(storage.getItem(key),'unscoped fixture');
  storage.setItem(key,'still unscoped');
  ws.clearUser('synthetic-A');assert.equal(storage.getItem(key),'still unscoped');
  gaps.push({key,scoped:false,blockedByWorkspaceLock:false,inWorkspaceEntries:false,removedByClearUser:false});
}
const result={baseline:'a05d5b656a539360345c470b723776970adfe2ff',registeredKeysTested:Object.keys(SAVED).length,registeredIsolationAndLock:'pass',gapsReproduced:gaps,interpretation:'Current behavior reproduced; three unregistered keys remain outside Workspace isolation, enumeration and clearing. This test does not validate privacy compliance or live Firebase.'};
fs.writeFileSync('docs/redesign/evidence/storage-scope-baseline.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
