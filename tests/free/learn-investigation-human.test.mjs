import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderInvestigation,validateInvestigation} from '../../ns-learn-investigation.mjs';
import {gradeLearnItem,learnLessonScore,validateLearnBundle} from '../../ns-learn-engine-v2.mjs';
import {saveLearnCompletion,readLearnProgress,learnCourseProgress,getCurrentLearnCompletion} from '../../ns-learn-progress-v2.mjs';
import {lessonResearchMarkup,lessonSources,sourceLink} from '../../ns-learn-evidence.mjs';
const course=()=>JSON.parse(readFileSync(new URL('../../learn-content/courses/narcissism.json',import.meta.url),'utf8'));
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const choices=()=>'<fieldset>Choices</fieldset>';
const node=()=>course().modules[0].lessons[0].nodes.find(n=>n.type==='investigation');

test('all twelve investigations contain valid case files and ten rival-explanation depths',()=>{
 const bundle=course();
 assert.equal(bundle.version,14);
 assert.deepEqual(validateLearnBundle(bundle,'narcissism'),[]);
 const lessons=bundle.modules.flatMap(m=>m.lessons);
 assert.equal(lessons.length,12);
 for(const lesson of lessons){
  const item=lesson.nodes.find(n=>n.type==='investigation');
  assert.deepEqual(validateInvestigation(item),[],lesson.title);
  assert.equal(item.profiles.length,2);
  assert(item.profiles.every(p=>p.history&&p.temperament&&p.pressure));
  assert.equal(item.layers.length,10);
  assert(item.turns.length>=6);
  assert(lesson.nodes.some(n=>['match','sort'].includes(n.type)),lesson.title);
  const recall=lesson.nodes.find(n=>n.type==='complete');
  assert(recall.wordBank.length>=2,lesson.title);
  assert(recall.wordBank.includes(recall.answers[0]),lesson.title);
 }
});

test('messages arrive one at a time and analysis is gated until the exchange is read',()=>{
 const n=node(),base={investigationStage:0,dialogueCheck:-1,investigationOpened:{}};
 const first=renderInvestigation(n,{...base,investigationVisible:1},esc,choices);
 assert.equal((first.match(/data-investigation-turn=/g)||[]).length,1);
 assert.match(first,/Message 1 of 10/);
 assert.match(first,/data-investigation-reveal/);
 assert.doesNotMatch(first,/data-investigation-open/);
 assert.doesNotMatch(first,/data-investigation-note/);
 assert(!first.includes(esc(n.layers[0].analysis)));
 const two=renderInvestigation(n,{...base,investigationVisible:2},esc,choices);
 assert.equal((two.match(/data-investigation-turn=/g)||[]).length,2);
 const ready=renderInvestigation(n,{...base,investigationVisible:n.turns.length},esc,choices);
 assert.match(ready,/data-investigation-open/);
 assert.match(ready,/data-investigation-stage/);
 assert.doesNotMatch(ready,/data-investigation-note/);
 const expanded=renderInvestigation(n,{...base,investigationVisible:n.turns.length,investigationOpened:{0:true}},esc,choices);
 assert(expanded.includes(esc(n.layers[0].analysis)));
});

test('case file text and message contents are escaped',()=>{
 const n=structuredClone(node());
 n.profiles[0].history='<img src=x onerror=alert(1)>';
 n.turns[0].text='<script>bad()</script>';
 const html=renderInvestigation(n,{investigationVisible:1,dialogueCheck:-1},esc,choices);
 assert(!html.includes('<img src=x onerror='));
 assert(html.includes('&lt;img'));
 assert(!html.includes('<script>bad()'));
});

test('during drills, review panels remain available without burying the question',()=>{
 const n=node(),html=renderInvestigation(n,{investigationVisible:n.turns.length,dialogueCheck:0,investigationOpened:{}},esc,choices);
 assert(html.indexOf('Reasoning drill 1')<html.indexOf('Review the character profiles'));
 assert.match(html,/Review the full message exchange/);
 assert.match(html,/Review the psychological analysis/);
});

test('completion scores the full investigation and the contextual matching task',()=>{
 const bundle=course(),lesson=bundle.modules[0].lessons[0],answers={};
 for(const n of lesson.nodes){
  if(n.type==='investigation')answers[n.id]=Object.fromEntries(n.checks.map(c=>[c.id,c.answer]));
  else if(['choose','update','perspective','respond','repair'].includes(n.type))answers[n.id]=n.answer;
  else if(n.type==='label')answers[n.id]=n.segments.filter(s=>s.answer).map(s=>s.id);
  else if(['rank','chain','sequence'].includes(n.type))answers[n.id]=n.steps.map(s=>s.id);
  else if(n.type==='match')answers[n.id]=Object.fromEntries(n.pairs.map(p=>[p.id,p.answer]));
  else if(n.type==='sort')answers[n.id]=Object.fromEntries(n.items.map(p=>[p.id,p.answer]));
  else if(n.type==='complete')answers[n.id]=n.wordBank[0];
  else if(n.type==='predict')answers[n.id]={change:n.correctChange,outcome:n.correctOutcome};
 }
 const score=learnLessonScore(lesson,answers);
 assert.equal(score.total,9);
 assert.equal(score.correct,score.total);
 assert(score.allAnswered);
 const contents=new Map(),storage={getItem:k=>contents.get(k)||null,setItem:(k,v)=>contents.set(k,v)};
 const saved=saveLearnCompletion(bundle,lesson,score,storage,'2026-11-20T09:00:00.000Z');
 assert(saved.ok,saved.error);
 assert.equal(Object.values(readLearnProgress(storage))[0].total,score.total);
});

test('sources link to identifiers but do not certify fictional motives',()=>{
 const lesson=course().modules[0].lessons[0],refs=lessonSources(lesson);
 assert(refs.length>=2);
 assert.equal(sourceLink('Pincus (2010) doi:10.1146/annurev.clinpsy.121208.131215'),'https://doi.org/10.1146/annurev.clinpsy.121208.131215');
 assert.equal(sourceLink('Diamond et al. (2020), PMID:32186987'),'https://pubmed.ncbi.nlm.nih.gov/32186987/');
 assert.match(lessonResearchMarkup(lesson,esc),/fictional applications/);
});

test('relationship loops remain progressive and inner states remain explicitly hypothetical',()=>{
 const n=node(),reveal=n.turns.length,loop=n.layers[7].loop;
 const early=renderInvestigation(n,{investigationVisible:reveal,investigationStage:7,dialogueCheck:-1,investigationOpened:{7:true},investigationLoopSteps:{7:1}},esc,choices);
 assert(early.includes(esc(loop.trigger)));assert(!early.includes(esc(loop.alternative)));
 assert.match(early,/data-investigation-loop-next/);
 const all=renderInvestigation(n,{investigationVisible:reveal,investigationStage:7,dialogueCheck:-1,investigationOpened:{7:true},investigationLoopSteps:{7:5}},esc,choices);
 assert(all.includes(esc(loop.alternative)));
 const mind=renderInvestigation(n,{investigationVisible:reveal,investigationStage:4,dialogueCheck:-1,investigationOpened:{4:true},investigationRoutes:{4:1}},esc,choices);
 assert.match(mind,/not recordings of private thoughts/);
 assert(mind.includes(esc(n.layers[4].alternative)));
});

test('outdated completions remain in history but do not count as current mastery',()=>{
 const bundle=course(),lesson=bundle.modules[0].lessons[0];
 const records={};
 records['ns-psy-learn:complete:'+bundle.id+':'+lesson.id]={
  type:'learn-completion',courseId:bundle.id,lessonId:lesson.id,
  lessonVersion:lesson.version-1,version:bundle.version-1,at:'2026-11-19T00:00:00.000Z',correct:9,total:9
 };
 assert.equal(learnCourseProgress(bundle,records).done,0);
 assert.equal(getCurrentLearnCompletion(bundle,lesson,records),null);
 assert(records['ns-psy-learn:complete:'+bundle.id+':'+lesson.id]);
});
