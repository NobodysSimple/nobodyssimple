import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCourseDraft,newCourseUnit,newCourseLesson,createCourseNode,validateCourseForPublish,COURSE_LAB_EXERCISES} from '../../ns-course-lab-schema.mjs';
import {gradeLearnItem,learnLessonScore,validateLearnBundle} from '../../ns-learn-engine-v2.mjs';
import {renderDialogue} from '../../ns-learn-dialogue.mjs';

function sample(){
 const course=createCourseDraft('boundaries','Boundaries & Difficult Conversations');
 const unit=newCourseUnit();unit.title='Recognising and responding';
 const lesson=newCourseLesson();lesson.title='When two people disagree';
 const node=createCourseNode('dialogue');
 node.title='A cancelled plan';node.prompt='Distinguish validation from agreement';node.conceptId='validation-without-agreement';
 node.scenario='Two friends disagree about a cancelled plan.';
 node.speakerA='Ari';node.speakerB='Sam';
 node.turns[0].text='You never make time for me.';
 node.turns[1].text='I know you are disappointed. I could not leave work early.';
 const first=node.checks[0];first.prompt='What does Sam do?';first.focusTurn=node.turns[1].id;
 first.options[0].label='Recognises disappointment';first.options[1].label='Agrees that the accusation is true';
 first.answer=first.options[0].id;first.explanation='Sam acknowledges the emotion, not the absolute claim.';
 first.counterexample='Acknowledgement can sound insincere without follow-through.';
 const second=createCourseNode('dialogue').checks[0];second.prompt='Which claim goes beyond the evidence?';
 second.options[0].label='Never make time';second.options[1].label='Work prevented this plan';
 second.answer=second.options[0].id;second.explanation='One cancellation does not establish never.';
 second.counterexample='Several repeated cancellations could change that judgement.';
 node.checks.push(second);
 lesson.nodes.push(node);unit.lessons.push(lesson);course.modules.push(unit);
 return {course,node,lesson,first,second};
}
test('Dialogue Lab is an exercise with two characters, a transcript and multiple independent checks',()=>{
 assert.ok(COURSE_LAB_EXERCISES.includes('dialogue'));
 const {course,node,lesson,first,second}=sample();
 assert.deepEqual(validateCourseForPublish(course),[]);
 assert.deepEqual(validateLearnBundle({...course,status:'published'},course.id),[]);
 assert.equal(gradeLearnItem(node,{[first.id]:first.answer,[second.id]:second.answer}).correct,true);
 assert.equal(gradeLearnItem(node,{[first.id]:first.answer,[second.id]:''}).valid,false);
 const full=learnLessonScore(lesson,{[node.id]:{[first.id]:first.answer,[second.id]:second.answer}});
 assert.equal(full.total,2);assert.equal(full.correct,2);assert.equal(full.allAnswered,true);
 const partial=learnLessonScore(lesson,{[node.id]:{[first.id]:first.answer,[second.id]:second.options[1].id}});
 assert.equal(partial.total,2);assert.equal(partial.correct,1);assert.equal(partial.allAnswered,true);
});
test('Unreviewable dialogue scenes are blocked from publishing',()=>{
 const {course,node,first}=sample();
 first.focusTurn='nonexistent-line';
 assert.ok(validateCourseForPublish(course).some(x=>x.includes('spotlight')));
 first.focusTurn='';
 node.turns[0].text='';
 assert.ok(validateCourseForPublish(course).some(x=>x.includes('dialogue turns')));
 node.turns[0].text='A valid line';
 first.explanation='';
 assert.ok(validateCourseForPublish(course).some(x=>x.includes('question 1')));
});
test('Dialogue transcript escapes untrusted speech and highlights an evidence line',()=>{
 const {node,first}=sample();
 node.turns[0].text='<script>alert(1)</script>';
 const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
 const controls=(name,options)=>'<fieldset>'+options.map(o=>esc(o.label)).join('|')+'</fieldset>';
 const state={dialogueCheck:0,answers:{},checked:null};
 const html=renderDialogue(node,state,esc,controls);
 assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);
 assert.match(html,/data-spotlight="true"/);
 assert.ok(html.includes('Reflect · 1 / 2'));
 assert.match(html,/Recognises disappointment/);
});
test('Public Learn and staff Templates link to the shared Dialogue Lab type with first modules published',()=>{
 const read=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');
 const staff=read('studio.mjs'),courseLab=read('studio-course-lab.mjs'),learn=read('ns-learn-courses.mjs');
 assert.match(staff,/data-open-dialogue-lab/);
 assert.match(courseLab,/dialogue-add-turn/);
 assert.match(courseLab,/dialogue-add-check/);
 assert.match(learn,/LESSON_FORMATS\.length/);
 assert.equal(Object.keys(JSON.parse(read('learn-content/index.json')).courses).length,20);
});
