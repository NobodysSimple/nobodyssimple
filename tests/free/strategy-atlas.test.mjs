import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildStrategyBundle,strategyAtlasCount} from "../../ns-strategy-curriculum.mjs";
import {makeAtlasScenes,createAtlasQuestions,strategyMastery} from "../../ns-strategy-player.mjs";

const atlas=JSON.parse(readFileSync(new URL("../../learn-content/strategy-atlas.json",import.meta.url),"utf8"));
const stories=JSON.parse(readFileSync(new URL("../../learn-content/strategy-featured-cases.json",import.meta.url),"utf8"));
const source={atlas,stories:stories.cases};
const expected={
 narcissism:88,manipulation:111,attachment:73,overthinking:73,boundaries:73,
 anxiety:73,emotions:73,"self-esteem":73,motivation:73,"social-anxiety":73,
 burnout:73,loneliness:73,"social-media":73,misinformation:73,neurodiversity:73,
 sleep:73,"low-mood":73,scams:73,masculinity:73,vaping:73,"conversation-patterns":239
};
test("user-provided Atlas covers all 1,752 strategy records and 21 course chapters",()=>{
 assert.equal(atlas.version,2);
 assert.equal(atlas.count,1752);
 assert.equal(strategyAtlasCount(source),1752);
 assert.deepEqual(Object.fromEntries(Object.entries(atlas.courses).map(([k,c])=>[k,c.strategies.length])),expected);
 assert.equal(Object.keys(stories.cases).length,21);
});
test("all 1,752 stable strategy lessons can be assembled without altering original course files",()=>{
 let total=0;const ids=new Set();
 for(const [courseId,chap] of Object.entries(atlas.courses)){
  const old={id:courseId,version:3,status:"published",title:chap.title,modules:[{id:"legacy",lessons:[{id:"a"}]}]};
  const result=buildStrategyBundle(old,source);
  assert.ok(result.strategyCurriculum);
  assert.equal(result.originalLessonCount,1);
  const lessons=result.modules.flatMap(x=>x.lessons);
  assert.equal(lessons.length,expected[courseId]);
  for(const lesson of lessons){
    assert.ok(lesson.atlasRecord.cue);
    assert.ok(lesson.teach.length>30);
    assert.ok(lesson.id.startsWith("atlas-"));
    assert.equal(lesson.version,2);
    assert.ok(!ids.has(courseId+":"+lesson.id));
    ids.add(courseId+":"+lesson.id);
    total++;
  }
 }
 assert.equal(total,1752);
});
test("all Atlas strategies have playable varied scenarios and 18 answerable questions",()=>{
 for(const [courseId,chap] of Object.entries(atlas.courses)){
  for(const record of chap.strategies){
   const scenes=makeAtlasScenes(courseId,record,null,0);
   assert.equal(scenes.length,6,record.id);
   assert.equal(new Set(scenes.map(x=>x.place)).size,6,record.id);
   assert.ok(scenes.some(x=>x.isNear),record.id);
   for(const scene of scenes){
    assert.equal(scene.turns.length,4,record.id);
    assert.ok(scene.turns.every(x=>x.speaker&&x.text),record.id);
    const questions=createAtlasQuestions(record,scene);
    assert.equal(questions.length,3,record.id);
    for(const q of questions){
     assert.ok(q.prompt.length>9,record.id);
     assert.ok(q.options.length===3,record.id);
     assert.ok(q.options.some(x=>x.id===q.answer),record.id);
     assert.equal(new Set(q.options.map(x=>x.id)).size,3,record.id);
     assert.ok(q.why.length>15,record.id);
    }
   }
  }
 }
});
test("mastery requires both overall accuracy and later-context transfer",()=>{
 assert.equal(strategyMastery(Array(18).fill(true)).passed,true);
 assert.equal(strategyMastery(Array(18).fill(false)).passed,false);
 assert.equal(strategyMastery([...Array(12).fill(true),true,true,true,true,true,false]).passed,true);
 assert.equal(strategyMastery([...Array(12).fill(true),true,true,true,false,false,false]).passed,false);
 assert.equal(strategyMastery([...Array(11).fill(true),false,...Array(6).fill(true)]).passed,true);
 assert.equal(strategyMastery(Array(17).fill(true)).passed,false);
});
test("21 editorial cases retain multiple speakers and complete speech turns",()=>{
 for(const [id,c] of Object.entries(stories.cases)){
  assert.ok(c.title&&c.intro,id);
  assert.ok(c.turns.length>=4,id);
  assert.ok(new Set(c.turns.map(t=>t.speaker)).size>=2,id);
 }
});
