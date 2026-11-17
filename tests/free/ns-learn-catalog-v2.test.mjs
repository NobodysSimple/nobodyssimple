import test from 'node:test';
import assert from 'node:assert/strict';
import {LEARN_COURSES,COURSE_CATEGORIES,LESSON_FORMATS,filterLearnCourses,getLearnCourse} from '../../ns-learn-catalog-v2.mjs';
import {PUBLISHED_COURSE_BUNDLES,getLearnContent} from '../../ns-learn-content-v2.mjs';
import {QUESTION_TYPES,validateLearnBundle,gradeLearnItem,learnLessonScore} from '../../ns-learn-engine-v2.mjs';
import {saveLearnCompletion,readLearnProgress,learnCourseProgress,dueLearnReviews} from '../../ns-learn-progress-v2.mjs';
import {renderCourseHub} from '../../ns-learn-courses.mjs';
import {publishedLearnBundle} from '../../ns-learn-player-v2.mjs';

const sampleQuestion={id:'q',type:'choose',conceptId:'observations',prompt:'What is directly observable?',
 options:[{id:'a',label:'A fact'},{id:'b',label:'A motive'}],
 answer:'a',explanation:'This identifies the observable element.',counterexample:'Observation may still contain errors.'};
const sampleBundle={id:'narcissism',version:1,status:'published',modules:[{id:'unit',title:'Unit',lessons:[{id:'lesson',version:1,title:'Lesson',teach:'Teaching statement.',questions:[sampleQuestion]}]}]};
const store=()=>{const map=new Map([['ns-account-learning-v2',JSON.stringify({'ns-lifelab-v3:old':{completed:true}})]]);return {getItem:key=>map.get(key)||null,setItem:(key,value)=>map.set(key,value)};};

test('20 precisely identified, unique and unlaunched courses',()=>{
 assert.equal(LEARN_COURSES.length,20);
 assert.equal(new Set(LEARN_COURSES.map(c=>c.id)).size,20);
 assert.ok(LEARN_COURSES.every(c=>c.status==='planned'));
 assert.ok(LEARN_COURSES.every(c=>COURSE_CATEGORIES.some(cat=>cat.id===c.category)));
 assert.ok(LEARN_COURSES.every(c=>c.focus.length===4));
 assert.ok(LEARN_COURSES.every(c=>c.landscape==='learn-art/course-guides/'+c.id+'-scene.svg'));
 assert.ok(LEARN_COURSES.every(c=>c.mascot==='media/lifelab/companions.png'));
 assert.equal(new Set(LEARN_COURSES.map(c=>c.landscape)).size,20);
 assert.equal(new Set(LEARN_COURSES.map(c=>c.companionRow+':'+c.companionColumn)).size,20);
 assert.equal(new Set(LEARN_COURSES.map(c=>c.companionName)).size,20);
 assert.equal(getLearnCourse('narcissism').title,'Understanding Narcissism & Personality');
 assert.equal(getLearnCourse('unknown'),null);
});

test('search and categories are actual filters, including synonyms',()=>{
 assert.equal(filterLearnCourses().length,20);
 assert.ok(filterLearnCourses({query:'DARVO'}).some(c=>c.id==='manipulation'));
 assert.ok(filterLearnCourses({query:'manosphere'}).some(c=>c.id==='masculinity'));
 assert.ok(filterLearnCourses({query:'NICOTINE'}).some(c=>c.id==='vaping'));
 assert.ok(filterLearnCourses({query:'ADHD'}).some(c=>c.id==='neurodiversity'));
 assert.ok(filterLearnCourses({category:'society'}).every(c=>c.category==='society'));
 assert.equal(filterLearnCourses({category:'society',query:'zzzz'}).length,0);
});

test('six exercise formats are declared and courses contain no published lessons',()=>{
 assert.deepEqual(QUESTION_TYPES,LESSON_FORMATS.map(f=>f.id));
 assert.deepEqual(Object.keys(PUBLISHED_COURSE_BUNDLES),[]);
 assert.equal(getLearnContent('narcissism'),null);
 assert.equal(publishedLearnBundle('narcissism'),null);
});

test('course details retain the illustrated art and do not pretend there are lessons',()=>{
 const root={innerHTML:''};
 renderCourseHub(root,{route:['course','narcissism']});
 assert.match(root.innerHTML,/Understanding Narcissism/);
 assert.match(root.innerHTML,/ns-course-card__character/);
 assert.match(root.innerHTML,/ns-course-card__landscape/);
 assert.match(root.innerHTML,/In development/);
 assert.match(root.innerHTML,/No lessons published yet/);
 assert.doesNotMatch(root.innerHTML,/#learn\/lesson\//);
 renderCourseHub(root,{route:['how-it-works']});
 for(const f of LESSON_FORMATS)assert.match(root.innerHTML,new RegExp(f.name));
});

test('catalogue retains original hero and layered paper cards',()=>{
 const controls={
  '#ns-course-search':{value:'',addEventListener(){}},
  '[data-course-results]':{innerHTML:''},
  '[data-catalogue-count]':{textContent:''},
  '[data-empty]':{hidden:false}
 };
 const root={innerHTML:'',querySelector(selector){return controls[selector]||null;}};
 renderCourseHub(root);
 assert.match(root.innerHTML,/ns-courses-hero__mascot/);
 assert.match(root.innerHTML,/scenery-featured\.svg/);
 assert.match(root.innerHTML,/ns-course-catalogue-title|ns-course-catalogue/);
 assert.equal((controls['[data-course-results]'].innerHTML.match(/ns-course-card__art/g)||[]).length,20);
 assert.equal(controls['[data-catalogue-count]'].textContent,'20 courses found');
});

test('unreviewed or invalid content cannot count as a published bundle',()=>{
 assert.deepEqual(validateLearnBundle({...sampleBundle,status:'draft'},'narcissism'),['Invalid, unpublished or empty course bundle']);
 assert.deepEqual(validateLearnBundle({...sampleBundle,modules:[]},'narcissism'),['Invalid, unpublished or empty course bundle']);
 assert.deepEqual(validateLearnBundle(sampleBundle,'narcissism'),[]);
 assert.ok(validateLearnBundle({...sampleBundle,modules:[{...sampleBundle.modules[0],lessons:[{...sampleBundle.modules[0].lessons[0],questions:[{...sampleQuestion,answer:'unknown'}]}]}]},'narcissism').length>0);
});

test('six formats grade the intended distinction',()=>{
 const match={type:'match',pairs:[{id:'x',label:'X',answer:'A'},{id:'y',label:'Y',answer:'B'}]};
 const sort={type:'sort',categories:[{id:'obs',label:'Observed'},{id:'inf',label:'Inferred'}],items:[{id:'x',label:'X',answer:'obs'},{id:'y',label:'Y',answer:'inf'}]};
 const sequence={type:'sequence',steps:[{id:'x',label:'Observe'},{id:'y',label:'Interpret'}]};
 assert.equal(gradeLearnItem(match,{x:'A',y:'B'}).correct,true);
 assert.equal(gradeLearnItem(match,{x:'B',y:'A'}).correct,false);
 assert.equal(gradeLearnItem(sort,{x:'obs',y:'inf'}).correct,true);
 assert.equal(gradeLearnItem({type:'choose',options:sampleQuestion.options,answer:'a'},'a').correct,true);
 assert.equal(gradeLearnItem({type:'respond',options:sampleQuestion.options,answer:'b'},'a').correct,false);
 assert.equal(gradeLearnItem({type:'complete',answers:['Interpretation','Assumption']},' interpretation ').correct,true);
 assert.equal(gradeLearnItem(sequence,['x','y']).correct,true);
 assert.equal(gradeLearnItem(sequence,['y','x']).correct,false);
});

test('completion is explicit, durable, namespaced and leaves Journey intact',()=>{
 const s=store(),lesson=sampleBundle.modules[0].lessons[0];
 const incomplete=saveLearnCompletion(sampleBundle,lesson,{total:1,correct:1,allAnswered:false},s);
 assert.equal(incomplete.ok,false);
 const score=learnLessonScore(lesson,{q:'a'});
 assert.equal(score.allAnswered,true);
 const saved=saveLearnCompletion(sampleBundle,lesson,score,s,'2026-11-16T09:00:00Z');
 assert.equal(saved.ok,true);
 const records=readLearnProgress(s);
 assert.equal(records['ns-lifelab-v3:old'].completed,true);
 assert.equal(learnCourseProgress(sampleBundle,records).done,1);
 assert.equal(dueLearnReviews(sampleBundle,records,'2026-11-18').length,1);
});
