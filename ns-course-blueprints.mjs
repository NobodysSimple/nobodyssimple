/**
 * Reviewed-by-editor curriculum planning support for Course Lab.
 * Blueprints are unpublished outlines, not learning content. The learner
 * never imports these files. The only publication is a curated ready subset.
 */
import {createCourseDraft,validateCourseForPublish} from './ns-course-lab-schema.mjs';
export const BLUEPRINT_VERSION=1;
const idOk=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9-]{0,119}$/.test(x);
const unique=xs=>new Set(xs).size===xs.length;
export function validateCurriculumBlueprint(doc,expectedId){
 const problems=[];
 if(!doc||doc.courseId!==expectedId||doc.version!==BLUEPRINT_VERSION||doc.status!=='editorial-outline'||!Array.isArray(doc.books)||doc.books.length!==10)return ['Expected 10-book unpublished curriculum outline for '+expectedId];
 const units=doc.books.flatMap(b=>b.modules||[]);
 const lessonRows=units.flatMap(m=>m.lessons||[]);
 if(units.length!==50||doc.books.some(b=>!b.title||!b.distinction||!Array.isArray(b.modules)||b.modules.length!==5))problems.push('Expected 50 modules across ten five-module books');
 if(lessonRows.length!==300||units.some(m=>!m.title||!m.problem||!Array.isArray(m.lessons)||m.lessons.length!==6))problems.push('Each module needs six planned lessons');
 if(!unique(units.map(x=>x.id))||!unique(lessonRows.map(x=>x.id)))problems.push('Module and lesson IDs must be unique');
 if(lessonRows.some(x=>!idOk(x.id)||!x.title||!x.objective||!x.recommendedType||x.editorialStatus!=='not-authored'||!Array.isArray(x.nodes)||x.nodes.length!==0))problems.push('Outlines must not masquerade as authored lesson content');
 return problems;
}
export function createDraftFromBlueprint(doc,{id,title,description}={}){
 const problems=validateCurriculumBlueprint(doc,id);
 if(problems.length)throw Error('Invalid curriculum blueprint: '+problems.join('; '));
 const draft=createCourseDraft(id,title||id);
 draft.description=description||'';
 draft.curriculum={version:1,origin:'editorial-blueprint',totalModules:50,totalLessonOutlines:300,editorialReview:'required'};
 draft.modules=doc.books.flatMap((book,bookIndex)=>book.modules.map((mod,i)=>({
  id:mod.id,title:mod.title,bookId:book.id,bookTitle:book.title,bookNumber:bookIndex+1,
  problem:mod.problem,distinction:book.distinction,lessons:mod.lessons.map(l=>({
   id:l.id,version:1,title:l.title,teach:'',objective:l.objective,
   recommendedType:l.recommendedType,editorialStatus:'draft',nodes:[]
  }))
 })));
 return draft;
}
/** Rehydrate the complete editorial plan on another staff device while retaining
 * each published lesson's authored nodes, stable IDs, edits and review status.
 * Private, un-published local drafts do not sync until explicitly exported. */
export function mergePublishedIntoBlueprint(blueprint,published){
 if(!published?.id)throw Error('Missing published course to merge.');
 const draft=createDraftFromBlueprint(blueprint,{
  id:published.id,title:published.title||published.id,description:published.description||''
 });
 draft.version=published.version||1;
 const original=new Map(draft.modules.map(unit=>[unit.id,unit]));
 const foundationUnits=[];
 for(const publishedUnit of published.modules||[]){
  let unit=original.get(publishedUnit.id);
  if(!unit){
   unit=JSON.parse(JSON.stringify(publishedUnit));
   if(unit.kind==='foundation')foundationUnits.push(unit);
   else draft.modules.push(unit);
   original.set(unit.id,unit);
   continue;
  }
  const baseLessons=new Map(unit.lessons.map(l=>[l.id,l]));
  const authored=[];
  for(const lesson of publishedUnit.lessons||[]){
   const saved={...lesson,nodes:lesson.nodes||[],editorialStatus:'ready'};
   if(baseLessons.has(lesson.id))Object.assign(baseLessons.get(lesson.id),saved);
   else authored.push(saved);
  }
  unit.title=publishedUnit.title||unit.title;
  unit.lessons.push(...authored);
 }
 // Authored introduction units precede the 50 unchanged editorial modules.
 draft.modules.unshift(...foundationUnits);
 return draft;
}
export async function fetchCurriculumBlueprint(courseId,{fetcher=fetch}={}){
 if(!idOk(courseId))throw Error('Invalid catalogue course ID.');
 const resp=await fetcher('learn-content/blueprints/'+courseId+'.json',{cache:'no-store'});
 if(!resp.ok)throw Error('Blueprint is unavailable ('+resp.status+').');
 const doc=await resp.json();
 const errors=validateCurriculumBlueprint(doc,courseId);
 if(errors.length)throw Error('Blueprint validation failed: '+errors.join('; '));
 return doc;
}
export function countAuthoredLessons(draft){
 const lessons=(draft?.modules||[]).flatMap(u=>u.lessons||[]);
 return {modules:draft?.modules?.length||0,total:lessons.length,empty:lessons.filter(l=>!(l.nodes||[]).length).length,
  authored:lessons.filter(l=>(l.nodes||[]).length>0).length,ready:lessons.filter(l=>l.editorialStatus==='ready'&&(l.nodes||[]).length>0).length};
}
/** Fail closed: any authored, unready lesson stays private. Only ready
 * lessons are included. A full draft's unreviewed modules cannot leak. */
export function makePublishableSubset(draft){
 const issues=[],included=[],excluded=[];
 if(!draft?.id||!draft.title||!Array.isArray(draft.modules))return {bundle:null,issues:['Invalid course draft'],ready:0,excluded:0};
 for(const unit of draft.modules){
  const selected=[];
  for(const lesson of unit.lessons||[]){
   if(lesson.editorialStatus==='ready'&&(lesson.nodes||[]).length>0){
    const single={...draft,modules:[{...unit,lessons:[lesson]}]};
    const errors=validateCourseForPublish(single);
    if(errors.length)issues.push(lesson.title+': '+errors.slice(0,2).join(', '));
    else selected.push(lesson);
   }else excluded.push(lesson);
  }
  if(selected.length)included.push({...unit,lessons:selected});
 }
 if(!included.length)issues.push('No reviewed, ready lessons. Set the lesson to Ready after authoring and previewing it.');
 const bundle={...draft,modules:included};
 delete bundle.curriculum;
 if(included.length&&!issues.length)issues.push(...validateCourseForPublish(bundle));
 return {bundle:issues.length?null:bundle,issues,ready:included.reduce((n,u)=>n+u.lessons.length,0),excluded:excluded.length};
}
