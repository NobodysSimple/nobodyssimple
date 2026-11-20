import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderInvestigation,validateInvestigation} from '../../ns-learn-investigation.mjs';
import {gradeLearnItem,learnLessonScore,validateLearnBundle} from '../../ns-learn-engine-v2.mjs';
import {saveLearnCompletion,readLearnProgress} from '../../ns-learn-progress-v2.mjs';
import {lessonResearchMarkup,lessonSources,sourceLink} from '../../ns-learn-evidence.mjs';
const course=()=>JSON.parse(readFileSync(new URL('../../learn-content/courses/narcissism.json',import.meta.url),'utf8'));
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fieldset=()=>'<fieldset>Choices</fieldset>';

test('every investigation has a complete ten-depth working account',()=>{
 const bundle=course();
 assert.equal(bundle.version,10);
 assert.deepEqual(validateLearnBundle(bundle,'narcissism'),[]);
 for(const lesson of bundle.modules.flatMap(m=>m.lessons)){
  const node=lesson.nodes.find(n=>n.type==='investigation');
  assert.deepEqual(validateInvestigation(node),[],lesson.title);
  assert.equal(node.layers.length,10);
  assert(node.turns.length>=6);
 }
});

test('learner sees the evidence first and chooses when to reveal the interpretation',()=>{
 const node=course().modules[0].lessons[0].nodes.find(n=>n.type==='investigation');
 const base={investigationStage:0,dialogueCheck:-1,investigationNotes:{},investigationOpened:{}};
 const hidden=renderInvestigation(node,base,escape,fieldset);
 assert.match(hidden,/data-investigation-turn/);
 assert.match(hidden,/data-investigation-note/);
 assert.match(hidden,/data-investigation-open/);
 assert.doesNotMatch(hidden,/One account supported by the exchange/);
 assert(!hidden.includes(escape(node.layers[0].analysis)));
 const shown=renderInvestigation(node,{...base,investigationOpened:{0:true}},escape,fieldset);
 assert.match(shown,/One account supported by the exchange/);
 assert(shown.includes(escape(node.layers[0].analysis)));
 assert.match(shown,/A different explanation worth considering/);
 assert.match(shown,/Which evidence could distinguish them/);
});

test('a learner note is escaped and never evaluated as markup',()=>{
 const node=course().modules[0].lessons[0].nodes.find(n=>n.type==='investigation');
 const html=renderInvestigation(node,{investigationStage:0,dialogueCheck:-1,investigationOpened:{},investigationNotes:{0:'<img src=x onerror=alert(1)>'}},escape,fieldset);
 assert(!html.includes('<img src=x onerror='));
 assert(html.includes('&lt;img'));
});

test('course completion counts all investigation questions and saves first-attempt scores',()=>{
 const bundle=course(),lesson=bundle.modules[0].lessons[0],answers={};
 for(const node of lesson.nodes){
  if(node.type==='investigation'){answers[node.id]=Object.fromEntries(node.checks.map(c=>[c.id,c.answer]));}
  else if(node.type==='update'||node.type==='perspective')answers[node.id]=node.answer;
  else if(node.type==='label')answers[node.id]=node.segments.filter(s=>s.answer).map(s=>s.id);
  else if(['rank','chain','sequence'].includes(node.type))answers[node.id]=node.steps.map(s=>s.id);
  else if(node.type==='complete')answers[node.id]=node.answers[0];
  else if(node.type==='predict')answers[node.id]={change:node.correctChange,outcome:node.correctOutcome};
 }
 const score=learnLessonScore(lesson,answers);
 assert.equal(score.total,8);
 assert.equal(score.correct,score.total);
 assert(score.allAnswered);
 const contents=new Map(),storage={getItem:key=>contents.get(key)||null,setItem:(key,value)=>contents.set(key,value)};
 const result=saveLearnCompletion(bundle,lesson,score,storage,'2026-11-20T09:00:00.000Z');
 assert(result.ok,result.error);
 const saved=Object.values(readLearnProgress(storage)).find(x=>x.lessonId===lesson.id);
 assert(saved);assert.equal(saved.total,score.total);
});

test('source panel links identifiable studies and does not claim a fictional diagnosis',()=>{
 const lesson=course().modules[0].lessons[0];
 const refs=lessonSources(lesson);
 assert(refs.length>=2);
 assert.equal(sourceLink('Pincus and Lukowitsky (2010), doi:10.1146/annurev.clinpsy.121208.131215'),'https://doi.org/10.1146/annurev.clinpsy.121208.131215');
 assert.equal(sourceLink('Diamond et al. (2020), PMID:32186987'),'https://pubmed.ncbi.nlm.nih.gov/32186987/');
 assert.equal(sourceLink('Unknown reference with no identifiers'),null);
 const html=lessonResearchMarkup(lesson,escape);
 assert.match(html,/Research behind this lesson/);
 assert.match(html,/The message conversations are fictional applications/);
 assert.match(html,/Read source/);
});
