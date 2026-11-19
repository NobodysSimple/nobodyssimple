import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRepairQueue,addRepair,takeRepair,finishRepair,repairSummary,correctAnswerText,readSoundPreference,saveSoundPreference,playLearningCue} from '../../ns-learn-feedback.mjs';
import {auditLesson,lessonMetrics,displayedLessonMinutes} from '../../ns-learn-quality.mjs';
import {validateLearnBundle,gradeLearnItem} from '../../ns-learn-engine-v2.mjs';

test('an incorrect response is offered exactly once again at the end',()=>{
 const q=createRepairQueue();
 assert.equal(addRepair(q,2),true);
 assert.equal(addRepair(q,2),false);
 assert.equal(addRepair(q,3,1),true);
 assert.equal(q.pending.length,2);
 const first=takeRepair(q);
 assert.deepEqual(first,{key:'2:node',nodeIndex:2,checkIndex:null});
 finishRepair(q,first,true);
 const second=takeRepair(q);
 assert.equal(second.nodeIndex,3);
 assert.equal(second.checkIndex,1);
 finishRepair(q,second,false);
 assert.equal(takeRepair(q),null);
 assert.deepEqual(repairSummary(q),{missed:2,retried:2,recovered:1,stillToReview:1});
});

test('feedback sound is persistent, optional, and does not require an audio device',()=>{
 const storage=new Map(),adapter={setItem:(k,v)=>storage.set(k,v),getItem:k=>storage.get(k)||null};
 saveSoundPreference(false,adapter);assert.equal(readSoundPreference(adapter),false);
 assert.equal(playLearningCue(true,false,{}),false);
 saveSoundPreference(true,adapter);assert.equal(readSoundPreference(adapter),true);
 assert.equal(playLearningCue(false,true,{}),false);
});

test('the first expanded published psychology lesson meets the structural deep-ten rubric',()=>{
 const bundle=JSON.parse(readFileSync(new URL('../../learn-content/courses/narcissism.json',import.meta.url),'utf8'));
 assert.equal(bundle.version,5);
 assert.deepEqual(validateLearnBundle(bundle,'narcissism'),[]);
 const lesson=bundle.modules.flatMap(m=>m.lessons).find(l=>l.id==='narcissism-m1-l1');
 assert(lesson);
 assert.equal(lesson.standard,'deep-10');
 const result=auditLesson(lesson,{strict:true});
 assert.deepEqual(result.blockers,[]);
 assert(result.drills>=9);
 assert(result.formats>=5);
 assert(result.textWords>=900);
 assert(lesson.glossary.some(x=>x.term==='Contingent self-worth'));
 assert(displayedLessonMinutes(lesson)>=10);
});

test('first attempts and correction attempts are distinguished, and substantive responses show the answer',()=>{
 const bundle=JSON.parse(readFileSync(new URL('../../learn-content/courses/narcissism.json',import.meta.url),'utf8'));
 const lesson=bundle.modules.flatMap(m=>m.lessons).find(l=>l.id==='narcissism-m1-l1');
 const update=lesson.nodes.find(x=>x.type==='update');
 assert(update);
 assert.equal(gradeLearnItem(update,update.answer).correct,true);
 assert.equal(gradeLearnItem(update,update.options.find(x=>x.id!==update.answer).id).correct,false);
 assert(correctAnswerText(update).length>20);
});
