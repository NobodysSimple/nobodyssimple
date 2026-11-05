// Audit harness: disposable DOM and local-only storage. No Firebase or production writes.
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {webcrypto} from 'node:crypto';
const require=createRequire((process.env.AUDIT_MODULES||process.cwd()+'/node_modules')+'/package.json');
const {JSDOM}=require('jsdom');
const dom=new JSDOM('<!doctype html><body><main></main></body>',{url:'https://example.test/#home',pretendToBeVisual:true});
for(const k of ['window','document','localStorage','sessionStorage','location','CustomEvent','Event','MouseEvent','HTMLElement','HTMLInputElement','HTMLTextAreaElement','HTMLSelectElement','HTMLCanvasElement','FormData','Image','MutationObserver','Node'])globalThis[k]=dom.window[k];
Object.defineProperty(globalThis,'navigator',{value:dom.window.navigator,configurable:true});
if(!globalThis.crypto)globalThis.crypto=webcrypto;
globalThis.requestAnimationFrame=cb=>setTimeout(()=>cb(Date.now()),0);
globalThis.cancelAnimationFrame=clearTimeout;
globalThis.matchMedia=window.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});
globalThis.getComputedStyle=window.getComputedStyle;
globalThis.confirm=()=>false;globalThis.alert=()=>{};
window.scrollTo=()=>{};HTMLElement.prototype.scrollIntoView=()=>{};HTMLElement.prototype.scrollTo=()=>{};
dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true};dom.window.HTMLDialogElement.prototype.close=function(){this.open=false};
HTMLCanvasElement.prototype.getContext=()=>new Proxy({canvas:{width:600,height:400},measureText:t=>({width:t.length*8}),createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}})}, {get:(o,k)=>o[k]??(()=>{})});
HTMLCanvasElement.prototype.toDataURL=()=>'';
class AudioStub{constructor(){this.paused=true;this.volume=1;}pause(){this.paused=true;}play(){this.paused=false;return Promise.resolve();}addEventListener(){}removeEventListener(){}}
globalThis.Audio=window.Audio=AudioStub;
const realInterval=globalThis.setInterval;globalThis.setInterval=(...a)=>{const x=realInterval(...a);x.unref();return x};
const features=await import('../../../features.mjs');
const interactive=await import('../../../interactive-tools.mjs');
const questionnaires=await import('../../../questionnaires.mjs');
const {renderLifeNavigation}=await import('../../../life-navigation.mjs');
const {renderPersonalityTest}=await import('../../../personality-test.mjs');
const {renderSimplyFocus}=await import('../../../simplyfocus.mjs');
const {emotions}=await import('../../../data.mjs');
const inventory=JSON.parse(fs.readFileSync('docs/redesign/inventory.json'));
const root=document.querySelector('main'),results=[];
function check(id,render){root.replaceChildren();root.onclick=null;root.onchange=null;try{render();const heading=root.querySelector('h1,h2')?.textContent?.trim();if(!heading)throw Error('No heading rendered');results.push({id,status:'pass',heading,controls:root.querySelectorAll('input,button,select,textarea,a').length,note:'Initial renderer smoke only; not completion, layout, auth or effectiveness.'});}catch(e){results.push({id,status:'fail',error:e.stack});}}
for(const t of inventory.tools){
 if(t.route==='#compass')check(t.route,()=>features.renderCompass(root,emotions,()=>{}));
 else if(t.route==='#stim-space')results.push({id:t.route,status:'static-link',note:'iframe route inspected separately in site.mjs and browser'});
 else if(t.route.startsWith('#tool/'))check(t.route,()=>features.renderTool(root,t.id));
 else check(t.route,()=>interactive.renderInteractiveTool(root,t.id));
}
for(const s of inventory.lifeSystems)check(s.route,()=>renderLifeNavigation(root,s.id));
check('#questionnaires',()=>questionnaires.renderQuestionnaires(root));
check('#big-five',()=>questionnaires.renderBigFive(root));
check('#systems',()=>questionnaires.renderSystemsQuestionnaire(root));
check('#personality',()=>renderPersonalityTest(root));
check('#simplyfocus',()=>renderSimplyFocus(root));
check('#help',()=>features.renderHelp(root));
check('#tools',()=>features.renderToolbox(root));
check('#maps',()=>features.renderMaps(root));
fs.writeFileSync('docs/redesign/evidence/render-smoke.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify({total:results.length,pass:results.filter(x=>x.status==='pass').length,failures:results.filter(x=>x.status==='fail'),staticLinks:results.filter(x=>x.status==='static-link').length},null,2));
dom.window.close();
process.exitCode=results.some(x=>x.status==='fail')?1:0;
