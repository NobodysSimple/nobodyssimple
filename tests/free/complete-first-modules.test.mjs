import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateLearnBundle,learnLessonScore} from '../../ns-learn-engine-v2.mjs';
import {validateCourseForPublish} from '../../ns-course-lab-schema.mjs';
import {renderDialogue} from '../../ns-learn-dialogue.mjs';
import {buildFoundationUnits} from '../../scripts/build-foundation-units.mjs';
import {knownCastForLesson,charactersMentioned,characterPortrait} from '../../ns-learn-cast.mjs';
import {saveLearnCompletion,learnCourseProgress} from '../../ns-learn-progress-v2.mjs';

const raw=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const read=path=>JSON.parse(raw(path));
const seeds=[...read('learn-content/first-module-seeds-part1.json').courses,...read('learn-content/first-module-seeds-part2.json').courses];
const guides=[...read('learn-content/editorial/foundation-terms-a.json').courses,...read('learn-content/editorial/foundation-terms-b.json').courses];
const index=read('learn-content/index.json');

test('Every course starts with two complete foundation units before its original six-lesson case unit',()=>{
 assert.equal(Object.keys(index.courses).length,20);
 assert.equal(seeds.length,20);assert.equal(guides.length,20);
 for(const seed of seeds){
  const id=seed.id,b=read('learn-content/courses/'+id+'.json');
  assert.equal(index.courses[id]?.version,3,id);
  assert.equal(b.version,3);
  assert.equal(b.modules.length,3,id);
  assert.deepEqual(b.modules.map(m=>m.lessons.length),[3,3,6],id);
  assert.deepEqual(b.modules.slice(0,2).map(m=>m.kind),['foundation','foundation']);
  assert.equal(b.modules[2].id,id+'-module-01');
  assert.deepEqual(validateCourseForPublish(b),[],id);
  assert.deepEqual(validateLearnBundle(b,id),[],id);
  const ids=b.modules.flatMap(m=>m.lessons.map(l=>l.id));
  assert.equal(new Set(ids).size,12,id);
  for(let i=0;i<6;i++)assert.equal(b.modules[2].lessons[i].id,id+'-m1-l'+(i+1));
  for(const lesson of b.modules.flatMap(m=>m.lessons)){
   assert.equal(lesson.editorialStatus,'ready');
   assert.ok(lesson.nodes.length>=4,id+':'+lesson.id);
   assert.ok(learnLessonScore(lesson,{}).total>=2,id+':'+lesson.id);
   for(const node of lesson.nodes){
    const sets=node.type==='dialogue'?node.checks.map(c=>c.options):
     ['choose','repair','respond','investigate','update','perspective'].includes(node.type)?[node.options]:[];
    for(const choices of sets){
     assert.ok(choices.length>=5,id+' '+node.id+' needs five credible options');
     assert.equal(new Set(choices.map(q=>q.id)).size,choices.length);
     assert.ok(choices.every(q=>q.label?.length>12));
    }
   }
  }
 }
});

test('Foundation units are reproducible from each course-specific plain-English glossary',()=>{
 for(const seed of seeds){
  const guide=guides.find(g=>g.id===seed.id),published=read('learn-content/courses/'+seed.id+'.json');
  assert.equal(guide.terms.length,4);
  assert.ok(guide.terms.every(t=>t.meaning&&t.example&&t.limit));
  const expected=buildFoundationUnits(published,guide,seed);
  assert.deepEqual(published.modules.slice(0,2),expected,seed.id);
 }
});

test('Every previously published applied lesson keeps its permanent lesson ID and completion key',()=>{
 const course=read('learn-content/courses/narcissism.json'),lesson=course.modules[2].lessons[0];
 const key='ns-psy-learn:complete:narcissism:'+lesson.id;
 const records={[key]:{type:'learn-completion',courseId:course.id,lessonId:lesson.id,version:2,correct:6,total:7}};
 assert.equal(learnCourseProgress(course,records).done,1);
 assert.equal(learnCourseProgress(course,records).total,12);
});

test('Dialogue reveals one line at a time but retains every earlier message and illustrated faces',()=>{
 const bundle=read('learn-content/courses/narcissism.json');
 const node=bundle.modules[2].lessons[0].nodes.find(n=>n.type==='dialogue');
 const esc=x=>String(x).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 const fieldset=()=>'<fieldset></fieldset>';
 const first=renderDialogue(node,{dialogueCheck:-1,dialogueVisible:1,answers:{},checked:null},esc,fieldset);
 assert.ok(first.includes(node.turns[0].text));assert.ok(!first.includes(node.turns[1].text));
 assert.match(first,/data-dialogue-reveal/);
 assert.match(first,/ns-learn-character__portrait/);
 const later=renderDialogue(node,{dialogueCheck:-1,dialogueVisible:4,answers:{},checked:null},esc,fieldset);
 assert.ok(node.turns.slice(0,4).every(turn=>later.includes(esc(turn.text))));
 assert.ok(!later.includes(node.turns[4].text));
 assert.match(later,/ns-learn-player__dialogue-transcript/);
 const check=renderDialogue(node,{dialogueCheck:0,dialogueVisible:1,answers:{},checked:null},esc,fieldset);
 assert.ok(check.includes(esc(node.turns.at(-1).text)));
 assert.ok(check.includes(node.checks[0].prompt));
 const cast=knownCastForLesson(bundle,bundle.modules[2].lessons[0]);
 assert.ok(cast.includes(node.speakerA));
 assert.ok(charactersMentioned({body:node.speakerA+' needs help.'},cast).includes(node.speakerA));
 assert.match(characterPortrait('<script>',[],esc),/&lt;script&gt;/);
});

test('Fullscreen controls remain accessible at zoom and a scored multi-check dialogue saves',()=>{
 const css=raw('ns-learn-immersive.css'),runtime=raw('ns-learn-player-v2.mjs');
 assert.match(css,/overflow-y:auto!important/);
 assert.match(css,/grid-template-rows:minmax\(56px,auto\)/);
 assert.match(css,/ns-learn-immersive__footer/);
 assert.match(runtime,/transcript\.scrollTop=transcript\.scrollHeight/);
 assert.match(runtime,/ns-learn-immersive__glossary/);
 assert.match(raw('index.html'),/ns-learn-immersive\.css/);
 assert.match(raw('sw.js'),/ns-learn-cast\.mjs/);
 const lesson={id:'demo',nodes:[{id:'dialogue',type:'dialogue',checks:[{id:'a'},{id:'b'}]}]};
 const memory=new Map(),storage={getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)};
 const saved=saveLearnCompletion({id:'demo',version:3},lesson,{total:2,correct:1,allAnswered:true},storage,'2026-11-18T21:00:00Z');
 assert.equal(saved.ok,true);
});
