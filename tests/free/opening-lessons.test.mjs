import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {validateLearnBundle,learnLessonScore,gradeLearnItem} from '../../ns-learn-engine-v2.mjs';
import {COURSE_LAB_EXERCISES} from '../../ns-course-lab-schema.mjs';
import {renderDialogue} from '../../ns-learn-dialogue.mjs';

const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const json=path=>JSON.parse(read(path));
const index=json('learn-content/index.json');
const courseIds=Object.keys(index.courses);
const collect=()=>courseIds.flatMap(id=>json('learn-content/courses/'+id+'.json').modules.flatMap(unit=>unit.lessons));

test('All 20 courses publish a complete, editable opening batch aligned to the curricular blueprint',()=>{
 assert.equal(courseIds.length,20);
 for(const id of courseIds){
  const bundle=json('learn-content/courses/'+id+'.json');
  const blueprint=json('learn-content/blueprints/'+id+'.json');
  assert.equal(bundle.id,id);
  assert.equal(bundle.status,'published');
  assert.equal(bundle.version,index.courses[id].version);
  assert.deepEqual(validateLearnBundle(bundle,id),[],id+' failed publish validation');
  assert.equal(bundle.modules.length,1,id);
  assert.equal(bundle.modules[0].id,blueprint.books[0].modules[0].id,id);
  assert.deepEqual(bundle.modules[0].lessons.map(l=>l.id),blueprint.books[0].modules[0].lessons.slice(0,6).map(l=>l.id),id);
  for(const lesson of bundle.modules[0].lessons){
   assert.equal(lesson.editorialStatus,'ready',id);
   assert.ok(lesson.nodes.length>=6,id);
   if(bundle.modules[0].lessons.indexOf(lesson)<2)assert.equal(lesson.nodes.filter(n=>n.type==='dialogue').length,1,id);
   assert.ok(lesson.nodes.every(n=>n.id&&n.title),id);
   assert.ok(learnLessonScore(lesson,{}).total>=3,id);
  }
 }
});
test('Activities vary across lessons and exercise every requested reasoning mechanism',()=>{
 const lessons=collect(),types=new Set(lessons.flatMap(l=>l.nodes.map(n=>n.type)));
 assert.equal(lessons.length,120);
 for(const type of ['dialogue','label','rank','chain','read','predict','repair','sort','match','update','perspective','character','complete','investigate']){
  assert.ok(types.has(type),'missing exercise type '+type);
  if(type!=='read')assert.ok(COURSE_LAB_EXERCISES.includes(type),'unregistered '+type);
 }
 const signatures=lessons.map(l=>l.nodes.map(n=>n.type).join(','));
 assert.ok(new Set(signatures).size>=8,'exercise order must vary rather than repeat a fixed sequence');
});
test('Every dialogue is initially shown one speech bubble at a time',()=>{
 const first=json('learn-content/courses/narcissism.json').modules[0].lessons[0].nodes.find(n=>n.type==='dialogue');
 const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 const fieldset=()=>'<fieldset></fieldset>';
 const firstHTML=renderDialogue(first,{dialogueCheck:-1,dialogueVisible:1,answers:{},checked:null},esc,fieldset);
 assert.ok(firstHTML.includes(esc(first.turns[0].text)));
 assert.ok(!firstHTML.includes(esc(first.turns[1].text)));
 assert.match(firstHTML,/data-dialogue-reveal/);
 const lastHTML=renderDialogue(first,{dialogueCheck:-1,dialogueVisible:first.turns.length,answers:{},checked:null},esc,fieldset);
 assert.ok(lastHTML.includes(esc(first.turns.at(-1).text)));
 assert.doesNotMatch(lastHTML,/data-dialogue-reveal/);
 const questionHTML=renderDialogue(first,{dialogueCheck:0,dialogueVisible:1,answers:{},checked:null},esc,fieldset);
 assert.ok(questionHTML.includes(esc(first.turns.at(-1).text)));
 assert.match(questionHTML,/Reflect · 1 \/ 2/);
 assert.ok(first.checks[1].options.every(o=>o.reply&&o.consequence),'branch choices must explain their outcome');
});
test('Ranking rewards recognising the most-supported hypothesis without pretending every weaker one has a fixed order',()=>{
 const lesson=json('learn-content/courses/narcissism.json').modules[0].lessons[0];
 const rank=lesson.nodes.find(n=>n.type==='rank');
 const swapped=[rank.steps[0].id,rank.steps[2].id,rank.steps[1].id];
 const notFirst=[rank.steps[1].id,rank.steps[0].id,rank.steps[2].id];
 assert.equal(gradeLearnItem(rank,swapped).correct,true);
 assert.equal(gradeLearnItem(rank,notFirst).correct,false);
});
test('New teaching modes, character response editing and reveal controls live in the shared staff and learner runtime',()=>{
 const studio=read('studio-course-lab.mjs'),player=read('ns-learn-player-v2.mjs');
 assert.match(studio,/data-prop="reply"/);
 assert.match(studio,/data-prop="consequence"/);
 assert.match(studio,/Viewpoint A/);
 assert.match(studio,/New evidence revealed/);
 assert.match(player,/data-dialogue-reveal/);
 assert.match(player,/LEARN_COMPANIONS/);
});
