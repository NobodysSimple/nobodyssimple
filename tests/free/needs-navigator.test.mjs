import test from 'node:test';
import assert from 'node:assert/strict';
import {NEEDS_MODES,getNeedsMode,getNeedsActivity,needsDestination,NEEDS_REVIEW_CASES} from '../../ns-needs-catalog.mjs';
import {PROCESSING_ACTIVITIES,SETTLING_ACTIVITIES,renderNeedsActivity} from '../../ns-needs-activities.mjs';
import {renderNeedsConsole,getSubjectMatchesForTest} from '../../ns-needs-console.mjs';
import {atlasProblemIndex,atlasGet} from '../../ns-atlas-core.mjs';
import {tools} from '../../tool-catalog.mjs';

const idSet=new Set(tools.map(t=>t.id));
const fakeRoot=()=>{
 const entries=new Map();
 const stub=()=>({textContent:'',innerHTML:'',value:'',addEventListener:()=>{},setAttribute:()=>{}});
 return {innerHTML:'',entries,querySelector:selector=>{if(!entries.has(selector))entries.set(selector,stub());return entries.get(selector);},querySelectorAll:()=>[]};
};
test('the entrance is needs-first, short and contains no unvalidated free-text reasoning',()=>{
 const root=fakeRoot();renderNeedsConsole(root);
 assert.match(root.innerHTML,/What would help you right now/);
 assert.equal((root.innerHTML.match(/class="ns-needs-mode /g)||[]).length,7);
 assert.doesNotMatch(root.innerHTML,/data-reason-form|data-reason-choice|textarea|WHAT IS WRONG|question of/i);
 assert.match(root.innerHTML,/Process something/);
 assert.match(root.innerHTML,/Feel steadier/);
 assert.match(root.innerHTML,/I'm not sure|I&#39;m not sure/);
});
test('every mode offers direct explicit choices with working destinations and without diagnostic questions',()=>{
 assert.equal(NEEDS_MODES.length,7);
 const ids=new Set(NEEDS_MODES.map(m=>m.id));assert.equal(ids.size,7);
 for(const mode of NEEDS_MODES){
  assert.ok(mode.options.length>=4,mode.id);
  assert.equal(new Set(mode.options.map(o=>o.id)).size,mode.options.length,mode.id);
  const root=fakeRoot();renderNeedsConsole(root,[mode.id]);
  assert.match(root.innerHTML,/What feels closest/);
  assert.doesNotMatch(root.innerHTML,/<textarea|data-reason-/);
  for(const option of mode.options){
   const destination=needsDestination(option);
   assert.ok(root.innerHTML.includes('href="'+destination+'"'),mode.id+' '+option.id);
   if(option.type==='tool')assert.ok(idSet.has(option.target),mode.id+' broken tool '+option.target);
   if(option.type==='topic')assert.ok(atlasGet(option.target),mode.id+' missing topic '+option.target);
   if(option.type==='activity')assert.ok(getNeedsActivity(option.target),mode.id+' missing activity '+option.target);
   assert.equal(destination,option.type==='atlas'?'#navigate/atlas':'#workbook/'+mode.id+'/'+option.id);
  }
  assert.ok(ids.has(getNeedsMode(mode.id).id));
 }
});
test('each unique processing direction offers authored, optional questions without promises of emotional relief',()=>{
 assert.equal(Object.keys(PROCESSING_ACTIVITIES).length,8);
 for(const [id,def] of Object.entries(PROCESSING_ACTIVITIES)){
  assert.equal(def.prompts.length,4,id);
  assert.ok(def.prompts.every(p=>p.length>25),id);
  assert.ok(def.finish.length>25);
  const root=fakeRoot();renderNeedsActivity(root,id);
  assert.match(root.innerHTML,/PROCESSING STUDIO/);
  assert.match(root.innerHTML,/ALL OPTIONAL/);
  assert.match(root.innerHTML,/Finish for now/);
  assert.match(root.innerHTML,/Nothing is automatically saved/);
  assert.match(root.innerHTML,/data-process-skip/);
  assert.ok(getNeedsActivity(id),id);
 }
});
test('regulation has distinct strategies and includes positive experience, not only distress',()=>{
 assert.equal(Object.keys(SETTLING_ACTIVITIES).length,8);
 for(const [id,def] of Object.entries(SETTLING_ACTIVITIES)){
  assert.equal(def.strategies.length,3,id);
  for(const strategy of def.strategies){
   assert.ok(strategy.steps.length>=3,id);
   assert.ok(idSet.has(strategy.tool),id+' '+strategy.tool);
  }
  const root=fakeRoot();renderNeedsActivity(root,id);
  assert.match(root.innerHTML,/Choose an approach that fits/);
  assert.match(root.innerHTML,/aria-pressed="true"/);
  assert.match(root.innerHTML,/Open a related interactive tool/);
 }
 assert.match(SETTLING_ACTIVITIES['savour-good'].title,/good/);
 assert.match(SETTLING_ACTIVITIES['steady-panic'].notice,/999/);
});
test('the previous ten frustrating use cases now point to explicit visitor selections',()=>{
 assert.equal(NEEDS_REVIEW_CASES.length,10);
 for(const example of NEEDS_REVIEW_CASES){
  const mode=getNeedsMode(example.mode);
  const choice=mode?.options.find(x=>x.id===example.option);
  assert.ok(choice,example.intention);
  assert.ok(needsDestination(choice).startsWith('#'),example.intention);
 }
 assert.equal(getNeedsMode('process').options.length,8);
 assert.ok(getNeedsMode('relate').options.some(o=>o.id==='unsafe'));
 assert.ok(getNeedsMode('learn').options.some(o=>o.target==='insomnia'));
});
test('all original topics and the inclusive experience inventory are searchable without symptom inference',()=>{
 assert.equal(atlasProblemIndex.length,518);
 assert.equal(getSubjectMatchesForTest('','').length,518);
 assert.ok(getSubjectMatchesForTest('insomnia','').some(x=>x.id==='insomnia'));
 assert.ok(getSubjectMatchesForTest('rumination','').some(x=>x.id==='rumination'));
 assert.ok(getSubjectMatchesForTest('','body').length>15);
 const root=fakeRoot();renderNeedsConsole(root,['atlas']);
 assert.match(root.innerHTML,/Search a named difficulty/);
 assert.match(root.innerHTML,/does not interpret your symptoms/);
 const topic=fakeRoot();renderNeedsConsole(topic,['atlas','insomnia']);
 assert.match(topic.innerHTML,/Understand this difficulty/);
 assert.match(topic.innerHTML,/Try a practical exercise/);
 assert.match(topic.innerHTML,/Process how this is affecting me/);
});
test('safety-related topics prioritise support, and the support route is always available',()=>{
 const root=fakeRoot();renderNeedsActivity(root,'support-safety');
 assert.match(root.innerHTML,/999/);
 assert.match(root.innerHTML,/NHS 111/);
 assert.match(root.innerHTML,/control|monitors/i);
 assert.match(root.innerHTML,/not.*confront/i);
 const topic=fakeRoot();renderNeedsConsole(topic,['atlas','suicidal-thoughts']);
 assert.match(topic.innerHTML,/Consider safety and appropriate support first/);
 assert.doesNotMatch(topic.innerHTML,/Try a practical worksheet/);
 const landing=fakeRoot();renderNeedsConsole(landing);
 assert.match(landing.innerHTML,/href="#need\/support-safety"/);
});
test('no questionnaire or speculative diagnostic ranking appears in any default mode',()=>{
 for(const mode of NEEDS_MODES){
  const root=fakeRoot();renderNeedsConsole(root,[mode.id]);
  assert.doesNotMatch(root.innerHTML,/data-reason-choice|data-reason-score|data-reason-form/);
  assert.ok(mode.options.every(option=>option.description.length>15));
 }
});


test('all inclusive categories are directly discoverable from the first starting screen',()=>{
 const page=fakeRoot();renderNeedsConsole(page);
 assert.match(page.innerHTML,/Explore a topic or experience/);
 assert.match(page.innerHTML,/Search all 518 topics/);
 for(const area of ['culture','lgbtq','neuro','disability','family','harm','faith','migration','digital','growth']){
  assert.match(page.innerHTML,new RegExp('href="#navigate/atlas/area/'+area+'"'),area);
 }
 assert.equal((page.innerHTML.match(/class="ns-needs-area-link"/g)||[]).length,31);
});
test('direct area links preselect their topic filter',()=>{
 for(const id of ['culture','lgbtq','neuro','faith']){
  const page=fakeRoot();renderNeedsConsole(page,['atlas','area',id]);
  assert.match(page.innerHTML,/Explore an experience or difficulty/);
  assert.equal(page.entries.get('[data-needs-domain-select]').value,id);
  assert.match(page.entries.get('[data-needs-match-count]').textContent,/topics/);
 }
});
