import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderNSUrgePause} from '../../ns-urge-pause.mjs';
const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
function mock(){
 const handlers={};
 const root={innerHTML:'',contains:()=>true,addEventListener:(n,f)=>{handlers[n]=f;},
  querySelector:s=>s==='.ns-urge h1'||s==='[data-urge-action="demo"]'?{focus(){}}:s==='#ns-urge-next-action'?{value:'Return to my task'}:null,
  querySelectorAll:()=>[]};
 const cleanup=renderNSUrgePause(root);
 return {root,cleanup,press:name=>handlers.click({target:{closest:()=>({dataset:{urgeAction:name},focus(){}})}}),
  enter:(value,preset='other')=>handlers.submit({preventDefault(){},target:{closest:()=>({querySelector:()=>({value:preset}),elements:{namedItem:()=>({value})}})}})};
}
test('Field Guide quick section, sidebar shortcut, app-cache integration',()=>{
 assert.ok(read('index.html').includes('href="#guide/urge-pause"'));
 assert.ok(read('ns-field-guide.mjs').includes('quickToolsSection()'));
 assert.ok(read('ns-field-guide.mjs').includes("parts[0]==='urge-pause'"));
 assert.ok(read('sw.js').includes("'ns-urge-pause.mjs'"));
 assert.ok(read('index.html').includes('ns-urge-pause.css'));
});
test('Observer is explained, demonstrated, then applied to own urge',()=>{
 const m=mock();assert.match(m.root.innerHTML,/what does “being the observer” mean\?/);
 m.press('demo');assert.match(m.root.innerHTML,/I am noticing an urge to check my phone/);
 m.press('choose');m.enter('look at my phone');assert.match(m.root.innerHTML,/I want to look at my phone/);
 m.press('next');assert.match(m.root.innerHTML,/I am noticing an urge to look at my phone/);
 for(let i=0;i<4;i++)m.press('next');assert.match(m.root.innerHTML,/Step 6 of 6/);
 m.press('finish');assert.match(m.root.innerHTML,/The urge might remain or return/);
 m.press('repeat');assert.match(m.root.innerHTML,/Step 1 of 6/);m.cleanup();
});
test('User input escapes markup and private urge does not survive a fresh session',()=>{
 const m=mock();m.press('choose');m.enter('check <img src=x onerror=alert(1)>');
 assert.match(m.root.innerHTML,/&lt;img src=x onerror=alert\(1\)&gt;/);
 assert.ok(!m.root.innerHTML.includes('<img src=x onerror'));m.cleanup();
 const second=mock();assert.ok(!second.root.innerHTML.includes('onerror'));second.cleanup();
 const source=read('ns-urge-pause.mjs');
 assert.doesNotMatch(source,/\b(?:localStorage|sessionStorage|fetch|sendBeacon)\s*[\(.]/);
});
