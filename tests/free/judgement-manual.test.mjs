import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderJudgementManual} from '../../ns-judgement-manual.mjs';

function mount() {
 let handler=null, jumped=null;
 const output={innerHTML:'',querySelector:()=>({focus(){}})};
 const work={hidden:true,scrollIntoView(){},querySelector:s=>s==='[data-nj-screen]'?output:null};
 const shell={addEventListener:(event,fn)=>{assert.equal(event,'click');handler=fn;}};
 const targets={
  '.ns-judge':shell,'#ns-judge-work':work,'[data-nj-question]':null,
  '#ns-judge-start-title':{focus(){}},'#ns-judge-start':{scrollIntoView(){}},
  '#ns-judge-read':{scrollIntoView(){jumped='read';},querySelector:()=>({focus(){}})},
  '#ns-judge-now':{scrollIntoView(){jumped='now';},querySelector:()=>({focus(){}})}
 };
 const root={innerHTML:'',contains:()=>true,querySelector:s=>targets[s]||null};
 renderJudgementManual(root);
 function click(kind,value){
  const button={
   dataset:kind==='open'?{njOpen:value}:kind==='jump'?{njJump:value}:{},
   hasAttribute:attr=>attr==='data-nj-'+kind
  };
  handler({target:{closest:()=>button}});
 }
 return {root,output,work,click,jumped:()=>jumped};
}

test('fear of judgement is a focused guide, not the generic therapy catalogue',()=>{
 const m=mount();
 assert.match(m.root.innerHTML,/Fear of being judged by others/);
 assert.match(m.root.innerHTML,/particular kind of loneliness/);
 assert.match(m.root.innerHTML,/What would help you most right now/);
 assert.doesNotMatch(m.root.innerHTML,/All approaches|CBT & thinking|DBT & grounding/);
 assert.match(m.root.innerHTML,/Nothing you write is saved or sent automatically/);
 assert.equal([...m.root.innerHTML.matchAll(/data-nj-open=/g)].length,5);
});

test('all five one-at-a-time journeys lead to a coherent end point',()=>{
 const m=mount();
 const lengths={map:8,test:6,replay:3,kindness:4,protect:4};
 for(const [kind,n] of Object.entries(lengths)){
  m.click('open',kind);
  assert.equal(m.work.hidden,false);
  assert.match(m.output.innerHTML,/Question 1 of/);
  for(let i=0;i<n;i++)m.click('next');
  assert.match(m.output.innerHTML,/YOUR (WORKING MAP|NOTES)/);
 }
});

test('in-page navigation does not change the SPA hash route',()=>{
 const m=mount();
 assert.doesNotMatch(m.root.innerHTML,/href="#ns-judge/);
 m.click('jump','ns-judge-read');
 assert.equal(m.jumped(),'read');
 m.click('jump','ns-judge-now');
 assert.equal(m.jumped(),'now');
});

test('both public entry routes display the replacement guide',()=>{
 const site=readFileSync('site.mjs','utf8');
 const html=readFileSync('index.html','utf8');
 assert.match(site,/if\(options\.topic==='social-anxiety'\)return renderJudgementManual\(main\)/);
 assert.match(site,/selected\?\.type==='topic'&&selected\.target==='social-anxiety'/);
 assert.match(site,/if\(key==='social-anxiety'\)renderJudgementManual\(main\)/);
 assert.match(html,/ns-judgement-manual\.css/);
});

test('manual respects basic readability and keyboard access',()=>{
 const css=readFileSync('ns-judgement-manual.css','utf8');
 assert.match(css,/:focus-visible/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/min-height:49px/);
 assert.match(css,/color-scheme:light/);
});
