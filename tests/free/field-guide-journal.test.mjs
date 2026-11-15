import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {renderNSFieldGuide,cleanupNSFieldGuide} from '../../ns-field-guide.mjs';
import {GUIDE_KEY,saveFieldGuideEntry} from '../../ns-field-guide-data.mjs';

const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
const mem=()=>{const map=new Map();return {getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k),contents:()=>new Map(map)};};
const paint=(storage,parts=[])=>{
 const old=globalThis.localStorage;
 globalThis.localStorage=storage;
 const root={innerHTML:'',addEventListener(){}};
 try{renderNSFieldGuide(root,parts,{});return root.innerHTML;}finally{cleanupNSFieldGuide();if(old===undefined)delete globalThis.localStorage;else globalThis.localStorage=old;}
};

test('Field Guide renders a real two-page journal with all original feature groups',()=>{
 const storage=mem(),html=paint(storage);
 for(const part of ['ns-guide6-journal__stage','ns-guide6-journal__book','ns-guide6-journal__page--left','ns-guide6-journal__page--right','ns-guide6-journal__binding','ns-guide6-journal__tabs','ns-guide6-hero','ns-guide6-collections','ns-guide6-records','ns-guide6-quick-tools','ns-guide6-privacy']){
  assert.ok(html.includes(part),part);
 }
 assert.match(html,/href="#guide\/new"/);
 assert.match(html,/href="#guide\/urge-pause"/);
 assert.match(html,/data-guide-action="export"/);
 assert.match(html,/No entries here yet/);
 assert.match(html,/You choose what becomes a record/);
 assert.match(html,/Notes are local by default/);
 assert.equal((html.match(/class="ns-guide6-journal__ring"/g)||[]).length,8);
 assert.equal((html.match(/class="ns-guide6-journal__tab /g)||[]).length,5);
 assert.equal(storage.contents().size,0,'Visiting the journal must not automatically save anything');
});
test('All collection tabs and cards link to real existing category routes',()=>{
 const storage=mem(),html=paint(storage);
 for(const id of ['helps','patterns','skills','reconsider']){
  assert.match(html,new RegExp('href="#guide/'+id+'"'));
 }
 assert.match(html,/href="#guide"[^>]+aria-current="page"/);
 const selected=paint(storage,['patterns']);
 assert.match(selected,/ns-guide6-journal__tab--patterns is-active" href="#guide\/patterns" aria-current="page"/);
 assert.match(selected,/ns-guide6-collection--forest is-active/);
 assert.match(selected,/id="ns-guide6-records-title">Patterns I’ve noticed/);
 assert.match(selected,/href="#guide">View all/);
});
test('The new journal continues displaying actual user-created saved notes and counts',()=>{
 const storage=mem();
 const first=saveFieldGuideEntry(storage,{title:'A helpful break',text:'Stepping outside was useful.',category:'helps',confidenceTag:'observation',context:'During a busy day'},{makeId:()=> 'entry0001',now:'2026-11-15T10:00:00.000Z'});
 const second=saveFieldGuideEntry(storage,{title:'Another hypothesis',text:'Maybe I need a quieter moment.',category:'patterns',confidenceTag:'hypothesis',context:''},{makeId:()=> 'entry0002',now:'2026-11-15T11:00:00.000Z'});
 const html=paint(storage);
 assert.match(html,/2 entries in your guide/);
 assert.match(html,/1 entry/);
 assert.match(html,/A helpful break/);
 assert.match(html,/Another hypothesis/);
 assert.match(html,/href="#guide\/entry\/entry0001"/);
 assert.match(html,/href="#guide\/entry\/entry0002"/);
 const filtered=paint(storage,['helps']);
 assert.match(filtered,/A helpful break/);
 assert.doesNotMatch(filtered,/Another hypothesis/);
 assert.ok(storage.getItem(GUIDE_KEY),'Saved data is still stored through the original data module');
 assert.equal(first.visibility,'private');
 assert.equal(second.visibility,'private');
});
test('Private note entry, editing, deletion and Urge Pause routes remain implemented',()=>{
 const js=read('ns-field-guide.mjs');
 for(const fragment of ["if(a==='new'","a==='entry'||a==='edit'","deleteFieldGuideEntry(localStorage","saveFieldGuideEntry(localStorage","exportFieldGuideJSON(localStorage)","renderNSUrgePause(main)","account.locked","if(!result.ok)"]){
  assert.ok(js.includes(fragment),fragment);
 }
});
test('The journal background is decorative-only and all artwork files exist',()=>{
 const css=read('ns-field-guide-journal.css');
 const html=read('index.html'),sw=read('sw.js'),site=read('site.mjs');
 for(const path of ['field-guide-art/paper-hills.svg','field-guide-art/mountain-stamp.svg']){
  assert.ok(existsSync(new URL('../../'+path,import.meta.url)),path);
  assert.match(read(path),/<svg\b/);
  assert.doesNotMatch(read(path),/<image\b|<foreignObject\b|<text\b|<script\b/i);
  assert.ok(sw.includes("'"+path+"'"));
 }
 assert.match(html,/ns-field-guide-journal\.css\?v=field-journal-20261115/);
 assert.match(site,/ns-field-guide\.mjs\?v=field-journal-20261115/);
 assert.match(sw,/nobodyssimple-release-v212-lifestyle-studio/);
 for(const name of ['ns-guide6-journal__page','ns-guide6-journal__binding','ns-guide6-journal__tab','ns-guide6-collection','ns-guide6-empty','ns-guide6-quick-card']){
  assert.ok(css.includes(name),name);
 }
 assert.match(css,/@media\(max-width:1100px\)/);
 assert.match(css,/@media\(max-width:690px\)/);
 assert.match(css,/data-low-stim="true"/);
 assert.match(css,/data-theme="dark"/);
 assert.match(css,/prefers-reduced-motion:reduce/);
});
