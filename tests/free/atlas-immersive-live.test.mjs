import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildStrategyBundle,strategyAtlasCount} from '../../ns-strategy-curriculum.mjs';
import {makeAtlasScenes,createAtlasQuestions,strategyMastery} from '../../ns-strategy-player.mjs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const atlas=JSON.parse(read('learn-content/strategy-atlas.json'));
const cases=JSON.parse(read('learn-content/strategy-featured-cases.json')).cases;
const expected={narcissism:88,manipulation:111,attachment:73,overthinking:73,boundaries:73,anxiety:73,emotions:73,'self-esteem':73,motivation:73,'social-anxiety':73,burnout:73,loneliness:73,'social-media':73,misinformation:73,neurodiversity:73,sleep:73,'low-mood':73,scams:73,masculinity:73,vaping:73,'conversation-patterns':239};
test('Atlas release covers every course and 1,752 stable records',()=>{
 assert.equal(atlas.version,2);
 assert.equal(atlas.count,1752);
 assert.deepEqual(Object.fromEntries(Object.entries(atlas.courses).map(([id,c])=>[id,c.strategies.length])),expected);
 assert.equal(strategyAtlasCount({atlas}),1752);
 assert.equal(Object.keys(cases).length,21);
});
test('Original published course bundles are adapted without being modified',()=>{
 let total=0;
 for(const [id,c]of Object.entries(atlas.courses)){
   const original={id,title:c.title,version:3,modules:[{id:'legacy',lessons:[{id:'first-original'}]}]};
   const copy=JSON.stringify(original);
   const bundle=buildStrategyBundle(original,{atlas,stories:cases});
   assert.equal(JSON.stringify(original),copy);
   assert.equal(bundle.originalLessonCount,1);
   assert.equal(bundle.strategyCurriculum,true);
   const lessons=bundle.modules.flatMap(m=>m.lessons);
   assert.equal(lessons.length,expected[id]);
   assert.ok(lessons[0].featured,'A real Atlas Case Lab should open '+id);
   assert.equal(new Set(lessons.map(x=>x.id)).size,lessons.length);
   assert.ok(lessons.every(x=>x.atlasRecord?.cue&&x.id.startsWith('atlas-')));
   total+=lessons.length;
 }
 assert.equal(total,1752);
});
test('Every lesson has six branded story situations, varied exercises and valid answers',()=>{
 let casesChecked=0,itemsChecked=0;const kinds=new Set();
 for(const [id,chapter]of Object.entries(atlas.courses)){
  const b=buildStrategyBundle({id,title:chapter.title,version:3,modules:[]},{atlas,stories:cases});
  for(const l of b.modules.flatMap(m=>m.lessons)){
   const scenes=makeAtlasScenes(id,l.atlasRecord,l.featuredCase);
   assert.equal(scenes.length,6,l.id);
   assert.equal(new Set(scenes.map(s=>s.place)).size,6,l.id);
   assert.equal(scenes.filter(s=>s.isNear).length,2,l.id);
   for(const scene of scenes){
    assert.equal(scene.turns.length,4,l.id);
    assert.ok(scene.observation?.length>5,l.id);
    assert.ok(scene.turns.every(t=>t.speaker&&t.text),l.id);
    const checks=createAtlasQuestions(l.atlasRecord,scene);
    assert.equal(checks.length,3,l.id);
    for(const q of checks){
      assert.equal(q.options.length,3,l.id);
      assert.equal(new Set(q.options.map(x=>x.id)).size,3,l.id);
      assert.equal(q.options.filter(x=>x.id===q.answer).length,1,l.id);
      assert.ok(q.prompt.length>6&&q.why.length>12,l.id);
      kinds.add(q.mode);itemsChecked++;
    }
    casesChecked++;
   }
  }
 }
 assert.equal(casesChecked,10512);
 assert.equal(itemsChecked,31536);
 for(const kind of ['spot','evidence','distinguish','mechanism','update','perspective','respond','transfer'])assert.ok(kinds.has(kind),kind);
});
test('Mastery only awarded for >=15/18 and >=5/6 late transfer checks',()=>{
 assert.equal(strategyMastery(Array(18).fill(true)).passed,true);
 assert.equal(strategyMastery(Array(18).fill(false)).passed,false);
 assert.equal(strategyMastery([...Array(12).fill(true),true,true,true,false,false,false]).passed,false);
 assert.equal(strategyMastery([...Array(12).fill(true),true,true,true,true,true,false]).passed,true);
 assert.equal(strategyMastery(Array(17).fill(true)).passed,false);
});
test('Actual published route uses strategy player and cache-busted CSS',()=>{
 const html=read('index.html'),site=read('site.mjs'),hub=read('ns-learn-courses.mjs'),loader=read('ns-learn-content-v2.mjs'),player=read('ns-learn-player-v2.mjs'),sw=read('sw.js');
 assert.ok(html.includes('ns-atlas-immersion.css?v=psy-atlas-20261120'));
 assert.ok(site.includes('ns-learn-courses.mjs?v=psy-atlas-20261120'));
 assert.ok(hub.includes('Find a particular technique'));
 assert.ok(hub.includes('ns-learn-journey__stop'));
 assert.ok(loader.includes('buildStrategyBundle(bundle,atlasSource)'));
 assert.ok(player.includes('renderStrategyLesson(root,bundle,lesson'));
 assert.ok(sw.includes('nobodyssimple-release-v243-atlas-immersion'));
});
