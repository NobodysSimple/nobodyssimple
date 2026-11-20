import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createAtlasQuestions,shuffledAtlasOptions,strategyMastery} from '../../ns-strategy-player.mjs';
import {buildStrategyBundle,strategyAtlasCount} from '../../ns-strategy-curriculum.mjs';
const file=name=>readFileSync(new URL('../../'+name,import.meta.url),'utf8');
const atlas=JSON.parse(file('learn-content/strategy-atlas.json'));
const cases=JSON.parse(file('learn-content/strategy-featured-cases.json'));

test('all 21 Atlas courses publish 1,752 named strategy lessons',()=>{
 assert.equal(atlas.count,1752);
 assert.equal(Object.keys(atlas.courses).length,21);
 assert.equal(strategyAtlasCount({atlas}),1752);
 let total=0;
 for(const [id,entry] of Object.entries(atlas.courses)){
   const old={id,version:2,title:entry.title,modules:[{lessons:[{id:'original'}]}]};
   const bundle=buildStrategyBundle(old,{atlas,stories:cases.cases});
   assert.equal(bundle.strategyCurriculum,true,id);
   assert.equal(bundle.originalLessonCount,1,id);
   const lessons=bundle.modules.flatMap(x=>x.lessons);
   assert.equal(lessons.length,entry.strategies.length,id);
   assert.ok(lessons.every(x=>x.atlasRecord&&x.title&&x.id.startsWith('atlas-')),id);
   total+=lessons.length;
 }
 assert.equal(total,1752);
});
test('answer positions are mixed, while correct answer keys stay stable',()=>{
 const input=[{id:'observed',label:'A'},{id:'assume',label:'B'},{id:'unrelated',label:'C'}];
 const positions=[0,0,0];
 for(let n=0;n<150;n++){
  const q=shuffledAtlasOptions(input,'course:lesson:'+n);
  assert.equal(q.length,3);
  assert.deepEqual(new Set(q.map(x=>x.id)),new Set(input.map(x=>x.id)));
  positions[q.findIndex(x=>x.id==='observed')]++;
 }
 assert.ok(positions.every(n=>n>15),positions.join(','));
});
test('each source record produces three answerable questions',()=>{
 for(const course of Object.values(atlas.courses))for(const record of course.strategies){
  const scene={id:record.id+'-s0',near:record.nearMiss||'An ordinary alternative',observation:record.cue,isNear:false,correctResponse:record.response||'Check context'};
  const questions=createAtlasQuestions({...record,contrast:{title:'similar concept',cue:'look alike'}},scene);
  assert.equal(questions.length,3,record.id);
  for(const q of questions)assert.ok(q.options.some(x=>x.id===q.answer),record.id);
 }
});
test('actual lesson UI is the versioned full-screen learning player',()=>{
 const html=file('index.html'),site=file('site.mjs'),hub=file('ns-learn-courses.mjs'),player=file('ns-strategy-player.mjs'),css=file('ns-psychology-language-player.css'),sw=file('sw.js');
 assert.ok(html.includes('ns-psychology-language-player.css?v=language-player-20261120'));
 assert.ok(html.indexOf('ns-psychology-language-player.css')>html.indexOf('ns-atlas-immersion.css'));
 assert.ok(site.includes('ns-learn-courses.mjs?v=language-player-20261120'));
 assert.ok(hub.includes('ns-learn-player-v2.mjs?v=language-player-20261120'));
 assert.ok(player.includes('ns-atlas-lesson__story'));
 assert.ok(player.includes('shuffledAtlasOptions'));
 assert.ok(player.includes("const sourceCue=''"));
 assert.ok(css.includes('ns-atlas-lesson__footer'));
 assert.ok(css.includes('media/lifelab')===false); // portraits remain owned by the original Life Lab styling
 assert.ok(sw.includes('v245-language-player'));
 assert.ok(sw.includes('ns-psychology-language-player.css'));
});
test('mastery is earned through accuracy plus transfer, not page visits',()=>{
 assert.equal(strategyMastery(Array(18).fill(true)).passed,true);
 assert.equal(strategyMastery(Array(18).fill(false)).passed,false);
 assert.equal(strategyMastery([...Array(15).fill(true),false,false,false]).passed,false);
});
