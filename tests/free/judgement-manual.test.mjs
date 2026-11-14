import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderJudgementManual} from '../../ns-judgement-manual.mjs';
import {judgementIdeas} from '../../ns-judgement-ideas.mjs';

function mount(){
 let handler=null,jumped=null,modalOpen=false;
 const output={innerHTML:'',querySelector:()=>({focus(){}})};
 const form={elements:{answer:{value:''}}};
 const dialog={rendered:'',querySelector:()=>({set innerHTML(v){dialog.rendered=v;}}),showModal(){modalOpen=true;},close(){modalOpen=false;},addEventListener(){}};
 const work={hidden:true,scrollIntoView(){},querySelector:s=>s==='[data-nj-screen]'?output:null};
 const shell={addEventListener:(event,fn)=>{assert.equal(event,'click');handler=fn;}};
 const targets={
  '.ns-judge':shell,'#ns-judge-work':work,'[data-nj-question]':form,'[data-nj-ideas-dialog]':dialog,
  '#ns-judge-start-title':{focus(){}},'#ns-judge-start':{scrollIntoView(){}},
  '#ns-judge-read':{scrollIntoView(){jumped='read';},querySelector:()=>({focus(){}})},
  '#ns-judge-now':{scrollIntoView(){jumped='now';},querySelector:()=>({focus(){}})}
 };
 const root={innerHTML:'',contains:()=>true,querySelector:s=>targets[s]||null};
 renderJudgementManual(root);
 function click(kind,value){
  const button={
   dataset:kind==='open'?{njOpen:value}:kind==='jump'?{njJump:value}:kind==='ideas'?{njIdeas:value}:{},
   hasAttribute:attr=>attr==='data-nj-'+kind,focus(){}
  };
  handler({target:{closest:()=>button}});
 }
 return {root,output,work,form,dialog,click,jumped:()=>jumped,modalOpen:()=>modalOpen};
}

test('fear of judgement offers a calm manual and optional research-informed ideas',()=>{
 const m=mount();
 assert.match(m.root.innerHTML,/Fear of being judged by others/);
 assert.match(m.root.innerHTML,/particular kind of loneliness/);
 assert.match(m.root.innerHTML,/What would help you most right now/);
 assert.match(m.root.innerHTML,/data-nj-ideas-dialog/);
 assert.doesNotMatch(m.root.innerHTML,/All approaches|CBT & thinking|DBT & grounding/);
 assert.match(m.root.innerHTML,/Nothing you write is saved or sent automatically/);
 assert.equal([...m.root.innerHTML.matchAll(/data-nj-open=/g)].length,5);
});

test('all six journaling journeys are free writing with a meaningful applied step',()=>{
 const m=mount();
 const lengths={map:8,test:6,replay:4,kindness:5,protect:5,review:4};
 for(const [kind,n] of Object.entries(lengths)){
  m.click('open',kind);
  assert.equal(m.work.hidden,false);
  assert.match(m.output.innerHTML,/Question 1 of/);
  for(let i=0;i<n;i++){
   assert.match(m.output.innerHTML,/<textarea/);
   assert.doesNotMatch(m.output.innerHTML,/<input[^>]*type="(?:radio|checkbox)"/);
   assert.match(m.output.innerHTML,/Try this as you write/);
   m.form.elements.answer.value='My answer '+i;
   m.click('next');
  }
  assert.match(m.output.innerHTML,/YOUR (WORKING MAP|NOTES)/);
 }
});

test('optional ideas are extensive, relevant to the actual question and exactly one bullet list',()=>{
 const m=mount();
 assert.equal(Object.keys(judgementIdeas).length,14);
 for(const [key,items] of Object.entries(judgementIdeas)){
  assert.ok(items.length>=25,key+' list is too short');
  assert.ok(items.every(s=>s.length>=20),key+' contains an unclear suggestion');
 }
 m.click('open','test');
 assert.match(m.output.innerHTML,/data-nj-ideas="test-goal"/);
 m.click('ideas','test-goal');
 assert.equal(m.modalOpen(),true);
 assert.equal((m.dialog.rendered.match(/<li>/g)||[]).length,judgementIdeas['test-goal'].length);
 assert.doesNotMatch(m.dialog.rendered,/<h2|<section|<fieldset|<button/);
 m.click('ideas-close');
 assert.equal(m.modalOpen(),false);
});

test('in-page navigation stays within the app route',()=>{
 const m=mount();
 assert.doesNotMatch(m.root.innerHTML,/href="#ns-judge/);
 m.click('jump','ns-judge-read');
 assert.equal(m.jumped(),'read');
 m.click('jump','ns-judge-now');
 assert.equal(m.jumped(),'now');
});

test('the two public topic routes display the replacement manual',()=>{
 const site=readFileSync('site.mjs','utf8');
 const html=readFileSync('index.html','utf8');
 assert.match(site,/if\(options\.topic==='social-anxiety'\)return renderJudgementManual\(main\)/);
 assert.match(site,/selected\?\.type==='topic'&&selected\.target==='social-anxiety'/);
 assert.match(site,/if\(key==='social-anxiety'\)renderJudgementManual\(main\)/);
 assert.match(html,/ns-judgement-manual\.css/);
});

test('manual respects keyboard, mobile and reduced-motion needs',()=>{
 const css=readFileSync('ns-judgement-manual.css','utf8');
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/min-height:49px/);
 assert.match(css,/color-scheme:light/);
 assert.match(css,/ns-judge-ideas-dialog/);
});
