import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateLearnBundle,learnLessonScore} from '../../ns-learn-engine-v2.mjs';
import {validateCourseForPublish} from '../../ns-course-lab-schema.mjs';
import {renderDialogue} from '../../ns-learn-dialogue.mjs';
import {generateFirstModule} from '../../scripts/build-first-modules.mjs';

const text=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const read=path=>JSON.parse(text(path));
const first=read('learn-content/first-module-seeds-part1.json').courses;
const second=read('learn-content/first-module-seeds-part2.json').courses;
const seeds=[...first,...second];
const index=read('learn-content/index.json');

test('All twenty catalogue courses have a complete validated six-lesson first module',()=>{
 assert.equal(seeds.length,20);
 assert.equal(Object.keys(index.courses).length,20);
 assert.equal(new Set(seeds.map(s=>s.id)).size,20);
 for(const seed of seeds){
  const bundle=read('learn-content/courses/'+seed.id+'.json');
  assert.equal(index.courses[seed.id]?.status,'published');
  assert.equal(bundle.version,index.courses[seed.id]?.version);
  assert.equal(bundle.status,'published');
  assert.equal(bundle.modules.length,1);
  const [unit]=bundle.modules;
  assert.equal(unit.id,seed.id+'-module-01');
  assert.equal(unit.lessons.length,6);
  assert.deepEqual(validateLearnBundle(bundle,seed.id),[],seed.id+' failed public validation');
  assert.deepEqual(validateCourseForPublish(bundle),[],seed.id+' failed Course Lab validation');
  for(const [i,lesson] of unit.lessons.entries()){
   assert.equal(lesson.id,seed.id+'-m1-l'+(i+1));
   assert.equal(lesson.editorialStatus,'ready');
   assert.ok(lesson.nodes.length>=5);
   assert.ok(new Set(lesson.nodes.filter(n=>n.type!=='read').map(n=>n.type)).size>=3,seed.id+' lesson '+(i+1)+' lacks variety');
   assert.ok(lesson.nodes.every(n=>n.id&&n.type));
   const score=learnLessonScore(lesson,{});
   assert.ok(score.total>=3,seed.id+' lesson '+(i+1)+' has too few challenges');
  }
 }
});

test('Seeded first-module content is reproducible and editable without changing blueprint IDs',()=>{
 for(const seed of seeds){
  const published=read('learn-content/courses/'+seed.id+'.json');
  const expected=generateFirstModule(seed,{title:published.title,moduleTitle:published.modules[0].title});
  assert.deepEqual(expected.modules[0].lessons.slice(2),published.modules[0].lessons.slice(2),'authored later lessons out of sync with '+seed.id);
 }
});

test('Conversation displays one new message per continue, not a wall of dialogue',()=>{
 const lesson=read('learn-content/courses/narcissism.json').modules[0].lessons[0];
 const node=lesson.nodes.find(n=>n.type==='dialogue');
 assert.ok(node.turns.length>=6);
 const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 const choices=(name,options)=>'<fieldset>'+options.map(o=>esc(o.label)).join('')+'</fieldset>';
 const one=renderDialogue(node,{dialogueCheck:-1,dialogueVisible:1,answers:{},checked:null},esc,choices);
 assert.ok(one.includes(node.turns[0].text));
 assert.ok(!one.includes(node.turns[1].text));
 assert.ok(one.includes('Continue conversation'));
 const three=renderDialogue(node,{dialogueCheck:-1,dialogueVisible:3,answers:{},checked:null},esc,choices);
 assert.match(three,/ns-learn-player__dialogue-history/);
 assert.match(three,/<details/);
 assert.ok(three.includes(node.turns[2].text));
 const analysis=renderDialogue(node,{dialogueCheck:0,dialogueVisible:8,answers:{},checked:null},esc,choices);
 assert.ok(analysis.includes(node.checks[0].prompt));
 assert.ok(analysis.includes('Review conversation'));
});

test('Answer reasoning is substantive and the interface loads the focused dark player',()=>{
 const one=read('learn-content/courses/narcissism.json').modules[0].lessons[2];
 const choice=one.nodes.find(n=>n.type==='choose');
 assert.equal(choice.options.length,4);
 assert.ok(choice.options.every(o=>o.label.length>=40));
 assert.ok(choice.options.every(o=>o.feedback.length>=30));
 const css=text('ns-learn-immersive.css');
 assert.match(css,/position:fixed!important/);
 assert.match(css,/min-height:100dvh/);
 assert.match(text('index.html'),/ns-learn-immersive\.css/);
 assert.match(text('staff.html'),/ns-learn-immersive\.css/);
 assert.match(text('ns-learn-player-v2.mjs'),/shuffleGroup/);
});
