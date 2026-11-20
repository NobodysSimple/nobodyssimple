import {LIFE_NODE_TEMPLATES,isLifeNode,createLifeNode,validateLifeNode} from './ns-life-node-types.mjs?v=narcissism-audit-20261119';
import {auditLesson} from './ns-learn-quality.mjs?v=case-reasoning-20261120';
import {createInvestigation,validateInvestigation} from './ns-learn-investigation.mjs?v=case-reasoning-20261120';
/**
 * Course Lab shared authoring schema: no content, only reusable node templates.
 * Stable IDs survive reorder/revision; published nodes are data, never executable HTML.
 */
export const COURSE_LAB_TYPES=Object.freeze([
 {id:'read',name:'Reading page',hint:'An extract, explanation or reflection to read and continue'},
 {id:'image',name:'Image / diagram',hint:'An illustrated page, with a caption and accessible description'},
 {id:'match',name:'Match concepts',hint:'Connect close terms and explanations'},
 {id:'sort',name:'Sort categories',hint:'Classify short examples by mechanism'},
 {id:'label',name:'Label the evidence',hint:'Highlight the words that support a conclusion'},
 {id:'complete',name:'Fill the blank',hint:'Retrieve a missing term or idea'},
 {id:'choose',name:'Choose explanation',hint:'Select the best-supported answer'},
 {id:'chain',name:'Build a chain',hint:'Reorder stages in a process'},
 {id:'repair',name:'Repair the flaw',hint:'Find the best correction to an overclaim'},
 {id:'investigate',name:'Evidence investigator',hint:'Select the most discriminating evidence'},
 {id:'predict',name:'What happens if?',hint:'Choose an intervention and predict its consequence'},
 {id:'character',name:'Help the character',hint:'Choose evidence and a proportionate response'},
 {id:'rank',name:'Rank the hypotheses',hint:'Order competing explanations by the available evidence'},
 {id:'update',name:'Update the belief',hint:'Reconsider a working explanation when new evidence arrives'},
 {id:'perspective',name:'Perspective shift',hint:'Compare two viewpoints before selecting the strongest inference'},
 {id:'dialogue',name:'Dialogue Lab · conversation & conflict',hint:'Study a two-person exchange, identify techniques and answer scene-based questions'},
 {id:'investigation',name:'Message Investigation · ten reasoning depths',hint:'Analyse a message thread through competing motives, power, defences and evidence revision'},
 ...LIFE_NODE_TEMPLATES.map(({id,name,hint})=>({id,name,hint}))
]);
export const COURSE_LAB_EXERCISES=Object.freeze(COURSE_LAB_TYPES.map(x=>x.id).filter(id=>!['read','image'].includes(id)));
export const makeCourseId=()=>globalThis.crypto?.randomUUID?.()||'node-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
const option=label=>({id:makeCourseId(),label});
export function createCourseNode(type){
 if(isLifeNode(type))return createLifeNode(type,makeCourseId);
 if(type==='investigation')return createInvestigation(makeCourseId);
 const node={id:makeCourseId(),type,title:'',prompt:'',conceptId:'',explanation:'',counterexample:'',sources:'',image:'',alt:'',caption:''};
 if(type==='read')return {id:node.id,type,title:'',body:'',image:'',alt:'',caption:'',sources:''};
 if(type==='image')return {id:node.id,type,title:'',image:'',alt:'',caption:'',sources:''};
 if(type==='match')return {...node,pairs:[{id:makeCourseId(),label:'',answer:''},{id:makeCourseId(),label:'',answer:''}]};
 if(type==='sort')return {...node,categories:[option('Category 1'),option('Category 2')],items:[{id:makeCourseId(),label:'',answer:''},{id:makeCourseId(),label:'',answer:''}]};
 if(type==='label')return {...node,segments:[{id:makeCourseId(),text:'',answer:false},{id:makeCourseId(),text:'',answer:true}]};
 if(type==='complete')return {...node,answers:[''],hint:''};
 if(['chain','rank'].includes(type))return {...node,steps:[option(''),option('')]};
 if(type==='update')return {...node,newEvidence:'',options:[option(''),option('')],answer:''};
 if(type==='perspective')return {...node,viewA:'',viewB:'',options:[option(''),option('')],answer:''};
 if(type==='character')return {...node,characterName:'',scenario:'',evidenceOptions:[option(''),option('')],evidenceAnswer:'',responseOptions:[option(''),option('')],responseAnswer:''};
 if(type==='dialogue')return {...node,scenario:'',speakerA:'Person A',speakerB:'Person B',turns:[{id:makeCourseId(),speaker:'a',text:''},{id:makeCourseId(),speaker:'b',text:''}],checks:[{id:makeCourseId(),prompt:'',focusTurn:'',options:[option(''),option('')],answer:'',explanation:'',counterexample:''}]};
 if(type==='predict')return {...node,changePrompt:'',changes:[option(''),option('')],outcomes:[option(''),option('')],correctChange:'',correctOutcome:''};
 return {...node,options:[option(''),option('')],answer:''};
}
export function createCourseDraft(courseId,title=''){
 return {id:courseId,version:1,status:'draft',title,description:'',modules:[]};
}
export function newCourseUnit(){return {id:makeCourseId(),title:'New unit',lessons:[]};}
export function newCourseLesson(){return {id:makeCourseId(),version:1,title:'New lesson',teach:'',durationMinutes:10,standard:'deep-10',objective:'',takeaway:'',transferPrompt:'',staffReview:'',editorialStatus:'draft',nodes:[]};}
export const safeCourseImage=src=>{
 const value=String(src||'').trim();
 return /^(?:media|learn-art)\/[a-zA-Z0-9_./-]+\.(?:png|jpe?g|webp|gif|svg)$/.test(value)&&!value.split('/').includes('..')?value:'';
};
export const learningNodes=lesson=>Array.isArray(lesson?.nodes)?lesson.nodes:(lesson?.questions||[]);
const isText=s=>typeof s==='string'&&!!s.trim();
const unique=xs=>new Set(xs).size===xs.length;
const validOptions=xs=>Array.isArray(xs)&&xs.length>=2&&xs.every(x=>isText(x?.id)&&isText(x?.label))&&unique(xs.map(x=>x.id));
const contains=(xs,key)=>xs.some(x=>x.id===key);
export function validateCourseForPublish(course){
 const issues=[];
 const report=(where,why)=>issues.push(where+': '+why);
 if(!course||!isText(course.id)||!isText(course.title)||!Array.isArray(course.modules)||!course.modules.length)return ['A course needs its title and at least one unit.'];
 const unitIds=[],lessonIds=[],nodeIds=[];
 for(const [ui,unit] of course.modules.entries()){
  const where='Unit '+(ui+1);
  if(!isText(unit.id)||!isText(unit.title)||!Array.isArray(unit.lessons)||!unit.lessons.length)report(where,'add a title and at least one lesson');
  unitIds.push(unit.id);
  for(const [li,lesson] of (unit.lessons||[]).entries()){
   const step=where+', lesson '+(li+1);lessonIds.push(lesson.id);
   if(lesson.standard==='deep-10')for(const issue of auditLesson(lesson,{strict:true}).blockers)report(step,issue);
   if(!isText(lesson.id)||!isText(lesson.title)||!Array.isArray(lesson.nodes)||!lesson.nodes.length)report(step,'add a title and at least one page or exercise');
   for(const [ni,node] of (lesson.nodes||[]).entries()){
    const here=step+', node '+(ni+1)+' ('+node.type+')';nodeIds.push(node.id);
    if(!COURSE_LAB_TYPES.some(t=>t.id===node.type)||!isText(node.id))report(here,'unrecognised node type or missing ID');
    if(node.type==='read'&&!isText(node.body))report(here,'reading text is empty');
    if(node.type==='image'&&!safeCourseImage(node.image))report(here,'add a valid site image');
    if(node.image&&!safeCourseImage(node.image))report(here,'image must use a site media path');
    if(node.image&&!isText(node.alt))report(here,'describe the image for accessibility');
    if(['read','image'].includes(node.type))continue;
    if(isLifeNode(node.type)){
     if(!isText(node.prompt)||!isText(node.conceptId)||!isText(node.explanation)||!isText(node.counterexample))report(here,'write the task, concept ID, explanation and boundary');
     for(const issue of validateLifeNode(node))report(here,issue);
     continue;
    }
    if(node.type==='investigation'){
     for(const issue of validateInvestigation(node))report(here,issue);
     continue;
    }
    if(node.type==='dialogue'){
     if(!isText(node.prompt)||!isText(node.conceptId)||!isText(node.scenario)||!isText(node.speakerA)||!isText(node.speakerB))report(here,'add the learning focus, concept ID, scene and both character names');
     const turns=Array.isArray(node.turns)?node.turns:[],checks=Array.isArray(node.checks)?node.checks:[];
     if(!Array.isArray(turns)||turns.length<2||turns.length>36||turns.some(t=>!isText(t?.id)||!['a','b'].includes(t.speaker)||!isText(t.text))||!unique(turns.map(t=>t.id))||!['a','b'].every(sp=>turns.some(t=>t.speaker===sp)))report(here,'add 2–36 valid dialogue turns featuring both characters, each with a unique ID');
     if(!Array.isArray(checks)||checks.length<1||checks.length>8||!unique(checks.map(c=>c?.id)))report(here,'add 1–8 distinct analysis questions');
     for(const [ci,check] of (Array.isArray(checks)?checks:[]).entries()){
      if(!isText(check?.id)||!isText(check?.prompt)||!validOptions(check?.options)||!contains(check?.options||[],check?.answer)||!isText(check?.explanation)||!isText(check?.counterexample)||check?.focusTurn&&!turns.some(t=>t?.id===check.focusTurn))report(here+', question '+(ci+1),'add a question, choices, correct answer, explanation and boundary; spotlight must reference a dialogue line');
     }
     continue;
    }
    if(!isText(node.prompt)||!isText(node.conceptId)||!isText(node.explanation)||!isText(node.counterexample))report(here,'write the prompt, concept ID, explanation and counterexample');
    if(['choose','repair','investigate','update','perspective'].includes(node.type)&&(!validOptions(node.options)||!contains(node.options||[],node.answer)))report(here,'add at least two choices and mark the correct one');
    if(node.type==='match'&&(!Array.isArray(node.pairs)||node.pairs.length<2||node.pairs.some(p=>!isText(p.id)||!isText(p.label)||!isText(p.answer))||!unique(node.pairs.map(p=>p.answer))))report(here,'add at least two nonempty, distinct matching answers');
    if(node.type==='sort'&&(!validOptions(node.categories)||!Array.isArray(node.items)||node.items.length<2||node.items.some(p=>!isText(p.id)||!isText(p.label)||!contains(node.categories,p.answer))))report(here,'add categories and assign every example');
    if(node.type==='label'&&(!Array.isArray(node.segments)||node.segments.length<2||node.segments.some(p=>!isText(p.id)||!isText(p.text))||!node.segments.some(p=>p.answer)))report(here,'add phrases and mark at least one as evidence');
    if(node.type==='complete'&&(!Array.isArray(node.answers)||!node.answers.length||node.answers.some(a=>!isText(a))))report(here,'add accepted answers');
    if(['chain','rank'].includes(node.type)&&(!validOptions(node.steps)))report(here,'add at least two ordered steps');
    if(node.type==='update'&&!isText(node.newEvidence))report(here,'add the newly discovered evidence');
    if(node.type==='perspective'&&(!isText(node.viewA)||!isText(node.viewB)))report(here,'write both character viewpoints');
    if(node.type==='predict'&&(!isText(node.changePrompt)||!validOptions(node.changes)||!validOptions(node.outcomes)||!contains(node.changes,node.correctChange)||!contains(node.outcomes,node.correctOutcome)))report(here,'add a condition, two changes, two outcomes and a correct combination');
    if(node.type==='character'&&(!isText(node.characterName)||!isText(node.scenario)||!validOptions(node.evidenceOptions)||!validOptions(node.responseOptions)||!contains(node.evidenceOptions,node.evidenceAnswer)||!contains(node.responseOptions,node.responseAnswer)))report(here,'add a character, scenario, evidence choices and response choices with answers');
   }
  }
 }
 if(!unique(unitIds)||!unique(lessonIds)||!unique(nodeIds))issues.push('Course: IDs must be unique (duplicate or reordered content was copied without a new ID).');
 if(JSON.stringify(course).length>550000)issues.push('Course: publication exceeds the 550 KB course-size limit; split it into shorter courses.');
 return issues;
}
