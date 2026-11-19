import test from 'node:test';
import assert from 'node:assert/strict';
import {LIFE_NODE_TEMPLATES,lifeNodeMode,lifeControls,lifeNodeEditor} from '../../ns-life-node-types.mjs';
import {COURSE_LAB_TYPES,COURSE_LAB_EXERCISES,createCourseNode,validateCourseForPublish} from '../../ns-course-lab-schema.mjs';
import {QUESTION_TYPES,gradeLearnItem,learnLessonScore,validateLearnBundle} from '../../ns-learn-engine-v2.mjs';

test('all 18 daily-life templates appear in the Course Lab and learning type bank',()=>{
 assert.equal(LIFE_NODE_TEMPLATES.length,18);
 assert.equal(new Set(LIFE_NODE_TEMPLATES.map(t=>t.id)).size,18);
 for(const type of LIFE_NODE_TEMPLATES){
  assert(COURSE_LAB_TYPES.some(item=>item.id===type.id));
  assert(COURSE_LAB_EXERCISES.includes(type.id));
  assert(QUESTION_TYPES.includes(type.id));
 }
});

test('all templates create valid editable lesson nodes with working controls and scoring',()=>{
 const nodes=LIFE_NODE_TEMPLATES.map(type=>createCourseNode(type.id));
 const course={id:'test',status:'published',version:1,title:'Life skills',modules:[
  {id:'unit',title:'Real situations',lessons:[{id:'lesson',title:'What changes?',nodes}]}
 ]};
 assert.deepEqual(validateCourseForPublish(course),[]);
 assert.deepEqual(validateLearnBundle(course,'test'),[]);
 const answers={};
 for(const node of nodes){
  const mode=lifeNodeMode(node.type);
  const state={lifeFrame:0,lifeInitial:'',lifeRevealed:false,lifeChoice:'',lifeSort:{},lifeBefore:80,lifeAfter:80};
  const controls=lifeControls(node,state);
  assert.match(controls,/ns-life-node__scene/);
  const editor=lifeNodeEditor(node,(label,prop,value)=>'<input data-field="'+prop+'">');
  assert.match(editor,/data-life-frame/);
  const answer=mode==='sort'?Object.fromEntries(node.frames.map(frame=>[frame.id,frame.category])):
   mode==='dial'?{before:80,after:60}:node.answer;
  assert.equal(gradeLearnItem(node,answer).valid,true,node.type+' valid');
  assert.equal(gradeLearnItem(node,answer).correct,true,node.type+' correct');
  answers[node.id]=answer;
 }
 const score=learnLessonScore(course.modules[0].lessons[0],answers);
 assert.equal(score.total,18);
 assert.equal(score.correct,18);
});

test('publishing rejects a malformed illustrated node instead of silently accepting it',()=>{
 const node=createCourseNode('cropped_reality');
 node.frames[0].label='';
 const bundle={id:'test',status:'published',version:1,title:'Test',modules:[
  {id:'unit',title:'Unit',lessons:[{id:'lesson',title:'Lesson',nodes:[node]}]}
 ]};
 assert(validateCourseForPublish(bundle).some(message=>message.includes('scene details')));
});

test('confidence dial and reveal mechanics require an informed response',()=>{
 const dial=createCourseNode('confidence_dial');
 assert.equal(gradeLearnItem(dial,{before:80,after:60}).correct,true);
 assert.equal(gradeLearnItem(dial,{before:80,after:90}).correct,false);
 const crop=createCourseNode('cropped_reality');
 assert.match(lifeControls(crop,{lifeFrame:0,lifeInitial:'',lifeRevealed:false,lifeChoice:'',checked:null}),/disabled/);
 assert.match(lifeControls(crop,{lifeFrame:0,lifeInitial:crop.options[0].id,lifeRevealed:true,lifeChoice:'',checked:null}),/More context/);
});
