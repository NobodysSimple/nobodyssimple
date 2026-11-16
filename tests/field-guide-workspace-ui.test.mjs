import test from 'node:test';
import assert from 'node:assert/strict';
import {renderWorkspaceFieldGuide} from '../ns-field-guide-workspace-ui.mjs';
import {saveRecord} from '../ns-field-guide-workspace-data.mjs';
const makeStore=()=>{const m=new Map();return{
  getItem:key=>m.has(key)?m.get(key):null,
  setItem:(key,v)=>m.set(key,String(v)),
  removeItem:key=>m.delete(key)
};};
const host=()=>({innerHTML:'',handlers:[],addEventListener(event,listener){this.handlers.push([event,listener]);},querySelector(){return null;}});
test('keeps the physical book, binding, page surfaces and Quick Tools',()=>{
  globalThis.localStorage=makeStore();
  const root=host();
  const cleanup=renderWorkspaceFieldGuide(root,[],{quickToolsHTML:'<section class="ns-guide6-quick-tools"><h2>Quick Access Tools</h2><a href="#guide/urge-pause">The Urge Pause</a></section>'});
  assert.match(root.innerHTML,/ns-guide6-journal__book/);
  assert.match(root.innerHTML,/ns-guide6-journal__page--left/);
  assert.match(root.innerHTML,/ns-guide6-journal__page--right/);
  assert.match(root.innerHTML,/ns-guide6-journal__binding/);
  assert.match(root.innerHTML,/ns-guide6-journal__tab/);
  assert.match(root.innerHTML,/Quick Access Tools/);
  assert.match(root.innerHTML,/#guide\/urge-pause/);
  cleanup();
});
test('renders chapters, self-map, practice desk, conversation writing and archive',()=>{
  globalThis.localStorage=makeStore();
  saveRecord(globalThis.localStorage,'chapter',{title:'Fear of judgement'});
  saveRecord(globalThis.localStorage,'self',{title:'How I change around other people'});
  for(const [path,expected] of [
    [['chapters'],'Fear of judgement'],
    [['self'],'How I change around other people'],
    [['practice'],'Prepare a conversation'],
    [['compose','conversation'],'Exactly what I plan to say'],
    [['archive'],'What you recorded']
  ]){
    const root=host();
    const cleanup=renderWorkspaceFieldGuide(root,path);
    assert.ok(root.innerHTML.includes(expected),path.join('/')+' failed to render');
    cleanup();
  }
});
test('a private source link is not silently created by simply reading progress',()=>{
  globalThis.localStorage=makeStore();
  globalThis.localStorage.setItem('ns-account-learning-v2',JSON.stringify({
    'ns-lifelab-v3:sample':{completed:true}
  }));
  const root=host();
  renderWorkspaceFieldGuide(root,[]);
  assert.match(root.innerHTML,/Saved progress from elsewhere/);
  assert.equal(JSON.parse(globalThis.localStorage.getItem('ns-field-guide-workspace-v2')||'{"records":[]}').records.length,0);
});
