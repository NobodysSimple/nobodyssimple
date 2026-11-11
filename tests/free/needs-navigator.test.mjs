import test from 'node:test';
import assert from 'node:assert/strict';
import {NEEDS_MODES,getNeedsMode,getNeedsActivity,needsDestination,NEEDS_REVIEW_CASES} from '../../ns-needs-catalog.mjs';
import {PROCESSING_ACTIVITIES,SETTLING_ACTIVITIES,renderNeedsActivity} from '../../ns-needs-activities.mjs';
import {renderNeedsConsole,getSubjectMatchesForTest,TOPIC_AREAS_BY_MODE,topicsForNeedsMode,themesForNeedsMode,browsableTopicsForNeedsMode,NAV_TOPIC_PAGE_SIZE} from '../../ns-needs-console.mjs';
import {atlasProblemIndex,atlasGet,isSafetyPriority} from '../../ns-atlas-core.mjs';
import {tools} from '../../tool-catalog.mjs';
import {NAV_THEMES,topicTheme,topicsInTheme,matchingTopics} from '../../ns-needs-themes.mjs';

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
   assert.equal(destination,option.type==='topic'?'#workbook-topic/'+option.target:'#workbook/'+mode.id+'/'+option.id);
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
test('the full topic catalogue remains searchable, without rendering 518 cards on entry',()=>{
 assert.equal(atlasProblemIndex.length,518);
 assert.equal(getSubjectMatchesForTest('','').length,518);
 assert.ok(getSubjectMatchesForTest('insomnia','').some(x=>x.id==='insomnia'));
 assert.ok(getSubjectMatchesForTest('rumination','').some(x=>x.id==='rumination'));
 const page=fakeRoot();renderNeedsConsole(page,['learn']);
 assert.match(page.innerHTML,/What feels closest/);
 assert.match(page.innerHTML,/Search any topic/);
 assert.match(page.innerHTML,/data-needs-theme="health"/);
 assert.match(page.innerHTML,/data-needs-topic-list/);
 assert.doesNotMatch(page.innerHTML,/href="#workbook-topic\/racial-discrimination"/);
 assert.ok(NAV_TOPIC_PAGE_SIZE<=24);
 assert.ok(matchingTopics(topicsForNeedsMode('learn'),'racial discrimination').some(p=>p.id==='racial-discrimination'));
});
test('safety-related topics retain their support-first guides and the support route is always available',()=>{
 const root=fakeRoot();renderNeedsActivity(root,'support-safety');
 assert.match(root.innerHTML,/999/);
 assert.match(root.innerHTML,/NHS 111/);
 assert.match(root.innerHTML,/control|monitors/i);
 assert.match(root.innerHTML,/not.*confront/i);
 assert.equal(isSafetyPriority('suicidal-thoughts'),true);
 const page=fakeRoot();renderNeedsConsole(page,['regulate']);
 assert.ok(topicsForNeedsMode('regulate').some(p=>p.id==='suicidal-thoughts'));
 assert.match(page.innerHTML,/data-needs-theme="emotions"/);
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


test('the original seven goal tiles remain the only starting choices',()=>{
 const page=fakeRoot();renderNeedsConsole(page);
 assert.equal((page.innerHTML.match(/class="ns-needs-mode /g)||[]).length,7);
 assert.doesNotMatch(page.innerHTML,/Explore a topic or experience|ns-needs-topic-entry|ns-needs-area-link/);
 assert.match(page.innerHTML,/Explore a specific difficulty/);
});
test('all 31 domains are grouped under six themes and every topic remains reachable',()=>{
 const all=atlasProblemIndex;
 assert.equal(NAV_THEMES.length,6);
 const categories=NAV_THEMES.flatMap(t=>t.domains);
 assert.equal(new Set(categories).size,31);
 assert.equal(categories.length,31);
 assert.ok(all.every(p=>topicTheme(p)),'each topic has an assigned theme');
 const covered=new Set();
 for(const mode of NEEDS_MODES){
  const page=fakeRoot();renderNeedsConsole(page,[mode.id]);
  const topics=topicsForNeedsMode(mode.id);
  const themes=themesForNeedsMode(mode.id);
  assert.equal((page.innerHTML.match(/class="ns-needs-theme"/g)||[]).length,themes.length);
  assert.equal((page.innerHTML.match(/class="ns-needs-choice"/g)||[]).length,mode.options.length);
  assert.ok(page.innerHTML.includes('data-needs-topic-list'),mode.id);
  for(const theme of themes){
   assert.equal(topicsInTheme(topics,theme.id).length,theme.count);
   topicsInTheme(topics,theme.id).forEach(p=>covered.add(p.domain));
  }
 }
 assert.equal(covered.size,31);
 assert.equal(TOPIC_AREAS_BY_MODE.learn.length,31);
 assert.equal(browsableTopicsForNeedsMode('learn').length,518,'featured topics still appear in their relevant theme');
 assert.equal(new Set(browsableTopicsForNeedsMode('learn').map(x=>x.id)).size,518);
 assert.equal(themesForNeedsMode('learn').reduce((sum,t)=>sum+t.count,0),518);

 const featured=new Set(getNeedsMode('learn').options.filter(o=>o.type==='topic').map(o=>o.target));
 const allLearn=new Set([...topicsForNeedsMode('learn').map(p=>p.id),...featured]);
 assert.equal(allLearn.size,518,'no Atlas entry lost');
 for(const domain of ['culture','lgbtq','neuro','disability','family','harm','faith','migration','digital','growth','sexuality','behaviour','safety'])
  assert.ok(NEEDS_MODES.some(m=>!['learn','unsure'].includes(m.id)&&TOPIC_AREAS_BY_MODE[m.id].includes(domain)),domain);
});
test('historical atlas links land on the existing starting-point grid instead of a browse page',()=>{
 const page=fakeRoot();renderNeedsConsole(page,['atlas','area','neuro']);
 assert.match(page.innerHTML,/What feels closest/);
 assert.match(page.innerHTML,/data-needs-theme="health"/);
 assert.doesNotMatch(page.innerHTML,/data-needs-domain-select|data-needs-topic-results|Search a named difficulty/);
});
