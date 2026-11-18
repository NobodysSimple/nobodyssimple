import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LEARN_COURSES} from '../../ns-learn-catalog-v2.mjs';
import {createCourseNode,validateCourseForPublish} from '../../ns-course-lab-schema.mjs';
import {validateCurriculumBlueprint,createDraftFromBlueprint,mergePublishedIntoBlueprint,makePublishableSubset,countAuthoredLessons} from '../../ns-course-blueprints.mjs';
const read=id=>JSON.parse(readFileSync(new URL('../../learn-content/blueprints/'+id+'.json',import.meta.url),'utf8'));
const readyDraft=id=>{
 const item=LEARN_COURSES.find(c=>c.id===id),doc=read(id);
 return createDraftFromBlueprint(doc,{id,title:item.title,description:item.description});
};

test('exactly twenty existing catalogue courses have complete, non-published curriculum blueprints',()=>{
 assert.equal(LEARN_COURSES.length,20);
 let moduleCount=0,lessonCount=0,bookCount=0;
 for(const course of LEARN_COURSES){
  const id=course.id,doc=read(id);
  assert.deepEqual(validateCurriculumBlueprint(doc,id),[],id);
  const mods=doc.books.flatMap(b=>b.modules),lessons=mods.flatMap(m=>m.lessons);
  assert.equal(doc.books.length,10,id);
  assert.equal(mods.length,50,id);
  assert.equal(lessons.length,300,id);
  assert.equal(new Set(mods.map(m=>m.title.toLowerCase())).size,50,id+' module titles should not repeat');
  assert.equal(new Set(lessons.map(l=>l.title.toLowerCase())).size,300,id+' lesson titles should not repeat');
  assert.ok(lessons.every(l=>l.nodes.length===0&&l.editorialStatus==='not-authored'),id+' must not publish fake content');
  assert.ok(mods.every(m=>m.title.length>=18),id+' needs meaningful module names');
  moduleCount+=mods.length;lessonCount+=lessons.length;bookCount+=doc.books.length;
 }
 assert.deepEqual({courseCount:LEARN_COURSES.length,bookCount,moduleCount,lessonCount},
  {courseCount:20,bookCount:200,moduleCount:1000,lessonCount:6000});
});

test('a blueprint hydrates to editable 50-module Course Lab draft with unique stable lesson IDs',()=>{
 const draft=readyDraft('narcissism');
 assert.equal(draft.id,'narcissism');
 assert.equal(draft.modules.length,50);
 assert.equal(draft.modules[0].bookTitle,'What the label actually means');
 assert.equal(draft.modules[0].lessons[0].recommendedType,'read');
 assert.equal(draft.modules[0].lessons[3].recommendedType,'investigate');
 assert.ok(draft.modules[0].lessons[0].objective.includes('Everyday self-focus'));
 assert.equal(new Set(draft.modules.flatMap(m=>m.lessons.map(l=>l.id))).size,300);
 assert.deepEqual(countAuthoredLessons(draft),{modules:50,total:300,empty:300,authored:0,ready:0});
 assert.ok(validateCourseForPublish(draft).length>0);
});

test('only explicitly reviewed and authored lessons can be published; outlines stay private',()=>{
 const draft=readyDraft('overthinking');
 const first=draft.modules[0].lessons[0],second=draft.modules[0].lessons[1];
 const empty=makePublishableSubset(draft);
 assert.equal(empty.bundle,null);
 assert.ok(empty.issues.length>0);
 const read=createCourseNode('read');
 read.body='Worry is oriented toward possible future harm. Rumination often revisits past events.';
 first.nodes.push(read);
 first.editorialStatus='ready';
 second.editorialStatus='ready';// no real nodes: cannot be published
 const staged=makePublishableSubset(draft);
 assert.equal(staged.issues.length,0);
 assert.ok(staged.bundle);
 assert.equal(staged.ready,1);
 assert.equal(staged.excluded,299);
 assert.equal(staged.bundle.modules.length,1);
 assert.equal(staged.bundle.modules[0].lessons.length,1);
 assert.equal(staged.bundle.modules[0].lessons[0].id,first.id);
 assert.equal(staged.bundle.modules[0].lessons[0].nodes[0].body,read.body);
 assert.ok(!('curriculum' in staged.bundle));
 assert.deepEqual(validateCourseForPublish(staged.bundle),[]);
});

test('ready lessons with incomplete or inappropriate answer templates block release',()=>{
 const draft=readyDraft('misinformation');
 const lesson=draft.modules[0].lessons[0];
 lesson.editorialStatus='ready';
 const item=createCourseNode('investigate');
 item.prompt='What is the best verification strategy?';
 item.conceptId='source-credibility';
 lesson.nodes.push(item);
 const result=makePublishableSubset(draft);
 assert.equal(result.bundle,null);
 assert.ok(result.issues.some(issue=>issue.includes('explanation')||issue.includes('correct')));
});

test('blueprints cannot cross course boundaries or introduce authored nodes',()=>{
 const doc=read('neurodiversity');
 assert.ok(validateCurriculumBlueprint(doc,'narcissism').length);
 doc.books[0].modules[0].lessons[0].nodes.push({type:'choose'});
 assert.ok(validateCurriculumBlueprint(doc,'neurodiversity').length);
 const bad=read('scams');
 bad.books[0].modules[0].id=bad.books[0].modules[1].id;
 assert.ok(validateCurriculumBlueprint(bad,'scams').some(msg=>msg.includes('unique')));
});

test('reviewed first-module lessons are now published for the twenty catalogue courses',()=>{
 const index=JSON.parse(readFileSync(new URL('../../learn-content/index.json',import.meta.url),'utf8'));
 assert.equal(Object.keys(index.courses).length,20);
 assert.ok(Object.values(index.courses).every(entry=>entry.version===1));
});

test('staff reopening a published course restores its full outline without losing authored lessons',()=>{
 const doc=read('attachment'),draft=readyDraft('attachment');
 const publishedLesson=draft.modules[0].lessons[0];
 publishedLesson.nodes=[{id:'reviewed-reading',type:'read',title:'What attachment models explain',body:'A careful distinction between relational expectations and fixed traits.'}];
 publishedLesson.editorialStatus='ready';
 const release=makePublishableSubset(draft);
 assert.equal(release.ready,1);
 const remote={...release.bundle,status:'published',version:3};
 const restored=mergePublishedIntoBlueprint(doc,remote);
 assert.equal(restored.modules.length,50);
 assert.equal(restored.modules.flatMap(u=>u.lessons).length,300);
 assert.equal(restored.modules[0].lessons[0].id,publishedLesson.id);
 assert.equal(restored.modules[0].lessons[0].nodes[0].body,publishedLesson.nodes[0].body);
 assert.equal(restored.modules[0].lessons[0].editorialStatus,'ready');
 assert.equal(restored.modules[0].lessons[1].nodes.length,0);
 assert.equal(countAuthoredLessons(restored).ready,1);
});
