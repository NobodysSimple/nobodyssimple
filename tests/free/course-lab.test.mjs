import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createCourseDraft,newCourseUnit,newCourseLesson,createCourseNode,
 COURSE_LAB_TYPES,COURSE_LAB_EXERCISES,validateCourseForPublish,safeCourseImage} from '../../ns-course-lab-schema.mjs';
import {gradeLearnItem,learnLessonScore,validateLearnBundle} from '../../ns-learn-engine-v2.mjs';
import {saveLearnCompletion,readLearnProgress} from '../../ns-learn-progress-v2.mjs';
import {Publisher} from '../../publisher.mjs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const fixture=()=>{
 const course=createCourseDraft('overthinking','Overthinking and psychological systems');
 course.description='A substantial course with active learning.';
 const unit=newCourseUnit();unit.title='Mechanisms';
 const lesson=newCourseLesson();lesson.title='Recognise the process';lesson.teach='Learn through small distinctions.';
 const response={};
 const reading=createCourseNode('read');reading.body='A claim is not the same as evidence.';lesson.nodes.push(reading);
 const media=createCourseNode('image');media.image='media/courses/overthinking/example.png';media.alt='An example of a two-stage process';lesson.nodes.push(media);
 for(const type of COURSE_LAB_EXERCISES){
  const node=createCourseNode(type);node.title=type+' practice';node.prompt='Which explanation is most justified?';
  node.conceptId='evidence';node.explanation='The evidence distinguishes the mechanism.';node.counterexample='A lone anecdote cannot establish a diagnosis.';
  if(['choose','repair','investigate','update','perspective'].includes(type)){node.options[0].label='Supported inference';node.options[1].label='Unwarranted certainty';node.answer=node.options[0].id;response[node.id]=node.answer;}
  if(type==='match'){node.pairs[0].label='Evidence';node.pairs[0].answer='Checkable information';node.pairs[1].label='Assumption';node.pairs[1].answer='Proposed interpretation';response[node.id]=Object.fromEntries(node.pairs.map(x=>[x.id,x.answer]));}
  if(type==='sort'){node.categories[0].label='Observation';node.categories[1].label='Interpretation';node.items[0].label='A message came at 4pm';node.items[0].answer=node.categories[0].id;node.items[1].label='They are angry';node.items[1].answer=node.categories[1].id;response[node.id]=Object.fromEntries(node.items.map(x=>[x.id,x.answer]));}
  if(type==='label'){node.segments[0].text='It was two hours late.';node.segments[1].text='They must dislike me.';response[node.id]=node.segments.filter(s=>s.answer).map(s=>s.id);}
  if(type==='complete'){node.answers=['negative','negative reinforcement'];response[node.id]='negative';}
  if(['chain','rank'].includes(type)){node.steps[0].label='Notice the trigger';node.steps[1].label='Identify the response';response[node.id]=node.steps.map(s=>s.id);}
  if(type==='update')node.newEvidence='A later message changes the available information.';
  if(type==='perspective'){node.viewA='The request has not been addressed.';node.viewB='The character fears being criticised.';}
  if(type==='predict'){node.changePrompt='What changes if avoidance is made less rewarding?';node.changes[0].label='Reduce escape';node.changes[1].label='Increase escape';node.outcomes[0].label='Avoidance may weaken';node.outcomes[1].label='Avoidance is always cured';node.correctChange=node.changes[0].id;node.correctOutcome=node.outcomes[0].id;response[node.id]={change:node.correctChange,outcome:node.correctOutcome};}
  if(type==='character'){node.characterName='Moss';node.scenario='Moss is uncertain what a friend meant.';node.evidenceOptions[0].label='No message was received';node.evidenceOptions[1].label='The friend dislikes Moss';node.responseOptions[0].label='Seek clarification calmly';node.responseOptions[1].label='Diagnose the friend';node.evidenceAnswer=node.evidenceOptions[0].id;node.responseAnswer=node.responseOptions[0].id;response[node.id]={evidence:node.evidenceAnswer,action:node.responseAnswer};}
  if(type==='dialogue'){
   node.scenario='Two friends disagree about a cancelled plan.';
   node.turns[0].text='You never make time for me.';
   node.turns[1].text='I had to work late, but I know you were looking forward to it.';
   const first=node.checks[0];first.prompt='What did the second speaker do?';first.focusTurn=node.turns[1].id;
   first.options[0].label='Acknowledge disappointment';first.options[1].label='Deny the feeling';first.answer=first.options[0].id;
   first.explanation='The speaker recognised the disappointment without conceding every claim.';first.counterexample='Acknowledgement is not proof that a claim is true.';
   const second=createCourseNode('dialogue').checks[0];second.prompt='What is the first speaker assuming?';second.focusTurn=node.turns[0].id;
   second.options[0].label='One cancellation proves never';second.options[1].label='The plan was cancelled';second.answer=second.options[0].id;
   second.explanation='Never goes beyond the evidence of a single cancellation.';second.counterexample='A documented pattern could warrant stronger wording.';
   node.checks.push(second);response[node.id]={[first.id]:first.answer,[second.id]:second.answer};
  }
  lesson.nodes.push(node);
 }
 unit.lessons.push(lesson);course.modules.push(unit);
 return {course,lesson,response};
};
test('Course Lab exposes fourteen distinct exercises plus reading and image templates',()=>{
 assert.equal(COURSE_LAB_EXERCISES.length,14);
 assert.equal(COURSE_LAB_TYPES.length,16);
 assert.equal(new Set(COURSE_LAB_TYPES.map(x=>x.id)).size,16);
 for(const type of COURSE_LAB_TYPES)assert.equal(createCourseNode(type.id).type,type.id);
});
test('Course Lab bundles validate and all fourteen mechanics grade correctly',()=>{
 const {course,lesson,response}=fixture();
 assert.deepEqual(validateCourseForPublish(course),[]);
 assert.deepEqual(validateLearnBundle({...course,status:'published'},course.id),[]);
 const score=learnLessonScore(lesson,response);
 assert.equal(score.total,15);
 assert.equal(score.correct,15);
 assert.equal(score.allAnswered,true);
 assert.equal(gradeLearnItem(lesson.nodes.find(n=>n.type==='label'),[]).correct,false);
 assert.equal(gradeLearnItem(lesson.nodes.find(n=>n.type==='character'),{evidence:'wrong',action:'wrong'}).correct,false);
});
test('Incomplete and unsafe courses cannot publish',()=>{
 const {course}=fixture();
 course.modules[0].lessons[0].nodes.find(n=>n.type==='choose').answer='';
 assert.ok(validateCourseForPublish(course).some(x=>x.includes('correct')));
 course.modules[0].lessons[0].nodes.find(n=>n.type==='read').body='';
 assert.ok(validateCourseForPublish(course).some(x=>x.includes('reading')));
 assert.equal(safeCourseImage('https://evil.example/x.svg'),'');
 assert.equal(safeCourseImage('media/../x.png'),'');
});
test('Reading-only lessons can be completed, without rewriting Journey progress',()=>{
 const {course}=fixture(),lesson=course.modules[0].lessons[0];
 lesson.nodes=lesson.nodes.filter(n=>n.type==='read');
 const score=learnLessonScore(lesson,{});
 assert.equal(score.total,0);assert.equal(score.allAnswered,true);
 const map=new Map([['ns-account-learning-v2','{"ns-lifelab-v3:existing":{"level":3}}']]);
 const store={getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,v)};
 const saved=saveLearnCompletion({...course,status:'published'},lesson,score,store,'2026-11-18T09:00:00Z');
 assert.equal(saved.ok,true);
 assert.equal(readLearnProgress(store)['ns-lifelab-v3:existing'].level,3);
});
test('GitHub publishing is atomic and versioned with course ID, title and published index',async()=>{
 const {course}=fixture(),calls=[];
 const p=new Publisher('fake-owner-token');
 p.api=async(path,method='GET',body)=>{
  calls.push({path,method,body});
  if(path.endsWith('/git/ref/heads/main')&&method==='GET')return {object:{sha:'head-one'}};
  if(path.endsWith('/git/commits/head-one'))return {tree:{sha:'tree-one'}};
  if(path.includes('/contents/learn-content/index.json'))return {content:Buffer.from('{"version":1,"courses":{}}').toString('base64')};
  if(path.endsWith('/git/trees'))return {sha:'new-tree'};
  if(path.endsWith('/git/commits'))return {sha:'new-commit'};
  if(path.includes('/git/refs/heads/main')&&method==='PATCH')return {object:{sha:'new-commit'}};
  throw Error('Unexpected GitHub API route '+path+' '+method);
 };
 const result=await p.publishLearnCourse(course,0);
 assert.equal(result.version,1);
 assert.equal(result.bundle.status,'published');
 const tree=calls.find(c=>c.path.endsWith('/git/trees'));
 const courseEntry=tree.body.tree.find(x=>x.path==='learn-content/courses/overthinking.json');
 const manifestEntry=tree.body.tree.find(x=>x.path==='learn-content/index.json');
 assert.ok(courseEntry&&manifestEntry);
 assert.equal(JSON.parse(courseEntry.content).modules[0].lessons[0].nodes.length,16);
 assert.equal(JSON.parse(manifestEntry.content).courses.overthinking.title,course.title);
 assert.equal(calls.find(c=>c.method==='PATCH')?.body.force,false);
 await assert.rejects(()=>p.publishLearnCourse({...course,modules:[]},0),/not ready/);
});
test('Staff Course Lab retains authenticated editing for the published course index',()=>{
 const html=read('staff.html'),studio=read('studio.mjs'),pub=read('publisher.mjs'),index=JSON.parse(read('learn-content/index.json'));
 assert.match(html,/data-view="course-lab"/);
 assert.match(html,/id="course-lab-view"/);
 assert.match(studio,/mountCourseLab/);
 assert.match(pub,/publishLearnCourse/);
 assert.match(pub,/unpublishLearnCourse/);
 assert.equal(Object.keys(index.courses).length,20);
 assert.match(read('ns-learn-courses.mjs'),/loadPublishedLearnBundle/);
});
