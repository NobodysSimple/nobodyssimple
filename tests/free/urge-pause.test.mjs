import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderNSUrgePause} from '../../ns-urge-pause.mjs';

const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
function mock(){
  const handlers={};
  const root={
    innerHTML:'',
    contains:()=>true,
    addEventListener:(n,f)=>{handlers[n]=f;},
    querySelector:s=>s==='.ns-urge h1'||s==='[data-urge-action="demo"]'?{focus(){}}:null,
    querySelectorAll:()=>[]
  };
  const cleanup=renderNSUrgePause(root);
  return {
    root,cleanup,
    press:name=>handlers.click({target:{closest:()=>({dataset:{urgeAction:name},focus(){}})}}),
    enter:value=>handlers.submit({preventDefault(){},target:{closest:()=>({
      elements:{namedItem:()=>({value})},
      querySelector:()=>null
    })}}),
    type:(id,value)=>handlers.input({target:{id,value}})
  };
}

test('Field Guide quick section, direct shortcut, and offline cache remain connected',()=>{
  assert.ok(read('index.html').includes('href="#guide/urge-pause"'));
  assert.ok(read('ns-field-guide.mjs').includes('quickToolsSection()'));
  assert.ok(read('ns-field-guide.mjs').includes("parts[0]==='urge-pause'"));
  assert.ok(read('sw.js').includes("'ns-urge-pause.mjs'"));
  assert.ok(read('index.html').includes('ns-urge-pause.css'));
});

test('Users are introduced to observing, then describe their own urge without any MCQs',()=>{
  const m=mock();
  assert.match(m.root.innerHTML,/what does “being the observer” mean\?/);
  assert.ok(!m.root.innerHTML.includes('is an instruction'));
  m.press('demo');
  assert.match(m.root.innerHTML,/I am noticing an urge to check my phone/);
  m.press('choose');
  assert.match(m.root.innerHTML,/<textarea id="ns-urge-custom"/);
  assert.doesNotMatch(m.root.innerHTML,/<input[^>]+type="radio"/);
  assert.doesNotMatch(m.root.innerHTML,/ns-urge-choice/);
  m.enter('I want to draw');
  assert.match(m.root.innerHTML,/I want to draw\./);
  assert.doesNotMatch(m.root.innerHTML,/I want to I want to draw/);
  m.press('next');
  assert.match(m.root.innerHTML,/I am noticing an urge to draw/);
  m.press('next');
  assert.match(m.root.innerHTML,/I did not choose for it to appear/);
  assert.match(m.root.innerHTML,/<textarea id="ns-urge-observation"/);
  assert.doesNotMatch(m.root.innerHTML,/data-urge-notice|data-urge-next/);
  m.type('ns-urge-observation','My chest feels tense, and I keep thinking about it.');
  m.press('next');
  assert.match(m.root.innerHTML,/Feeling an urge does not mean I have to act on it/);
  m.press('previous');
  assert.match(m.root.innerHTML,/My chest feels tense, and I keep thinking about it/);
  m.press('next');m.press('next');m.press('next');
  assert.match(m.root.innerHTML,/Step 6 of 6/);
  assert.match(m.root.innerHTML,/<textarea id="ns-urge-next-action"/);
  m.type('ns-urge-next-action','Go back to drawing');
  m.press('finish');
  assert.match(m.root.innerHTML,/Go back to drawing/);
  assert.match(m.root.innerHTML,/The urge might remain or return/);
  m.press('repeat');
  assert.match(m.root.innerHTML,/Step 1 of 6/);
  m.cleanup();
});

test('Private user input is HTML-escaped and discarded on new exercise',()=>{
  const m=mock();
  m.press('choose');
  m.enter('check <img src=x onerror=alert(1)>');
  assert.match(m.root.innerHTML,/&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(m.root.innerHTML,/<img src=x onerror/);
  m.cleanup();
  const second=mock();
  assert.doesNotMatch(second.root.innerHTML,/onerror/);
  second.cleanup();
  const source=read('ns-urge-pause.mjs');
  assert.doesNotMatch(source,/\b(?:localStorage|sessionStorage|fetch|sendBeacon)\s*[\(.]/);
});
