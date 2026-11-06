/**
 * Forest curriculum planning data from the previously delivered 40-unit plan.
 * This is a structured roadmap, NOT 200 published lessons or a clinical assessment.
 * Kept separately from the immersive map so authoring notes never appear on the course page.
 */
const FOREST_TITLES = Object.freeze(['Facts, stories & uncertainty','Observation or interpretation?','Why we assume motives','Considering other explanations','Checking the evidence','Confidence and doubt','Dealing with the unknown','Common thinking traps','Attention and selective evidence','Memory is reconstructive','Recognising confirmation bias','When thoughts spiral','Worry and prediction','Rumination and reflection','The need for certainty','Interpreting social situations','Separating feelings from facts','When information is incomplete','Patterns versus coincidences','Testing assumptions gently','Questioning first impressions','Noticing the story you tell','Thinking in probabilities','Avoiding all-or-nothing conclusions','Understanding disagreement','Reasoning under pressure','Learning from mistakes','Dealing with ambiguity','Distinguishing possibility from likelihood','Social comparison and beliefs','Interpreting intentions cautiously','Media claims and evidence','Evidence quality and sources','Spotting persuasive language','Making flexible judgments','Reasoning with competing values','When to seek more information','Transferring the skill to work','Transferring the skill to relationships','Thinking clearly in everyday life']);
const KINDS = Object.freeze({
 learn:{label:'Learn',verb:'Understand',summary:'One clear idea and a worked everyday example.'},
 explore:{label:'Explore',verb:'Notice',summary:'Find the useful clues and separate observation from interpretation.'},
 compare:{label:'Compare',verb:'Compare',summary:'Weigh different explanations without pretending to know everything.'},
 practise:{label:'Practise',verb:'Try',summary:'Practise the skill in a guided, fictional situation.'},
 choose:{label:'Choose',verb:'Decide',summary:'Choose an action and examine its possible consequences.'},
 apply:{label:'Apply',verb:'Use',summary:'Identify a small, optional way to try the idea in real life.'},
 reflect:{label:'Reflect',verb:'Reflect on',summary:'Notice what you understand, question, or would do differently.'},
 review:{label:'Review',verb:'Remember',summary:'Retrieve the key distinction in a new context.'},
 milestone:{label:'Milestone',verb:'Bring together',summary:'Combine several skills in a chapter synthesis.'}
});
const SEQUENCES = Object.freeze([
 ['learn','explore','compare','practise','review'],
 ['learn','explore','choose','apply','reflect'],
 ['learn','compare','practise','apply','review'],
 ['learn','explore','practise','reflect','review'],
 ['learn','compare','choose','apply','review']
]);
export const forestUnitOutlines=Object.freeze(FOREST_TITLES.map((title,index)=>{
 const number=index+1,chapter=Math.floor(index/5)+1;
 const kinds=SEQUENCES[index%SEQUENCES.length].slice();
 if(number%5===0) kinds[4]='milestone';
 const steps=kinds.map((kind,i)=>({id:`forest-unit-${number}-step-${i+1}`,kind,label:KINDS[kind].label,
  title:`${KINDS[kind].verb} · ${title}`,
  detail:KINDS[kind].summary,availability:'planned'}));
 if(number===1){
  steps[0]={...steps[0],title:'Facts, stories and uncertainty',detail:'Meet the difference between an observation, a feeling, an assumption and an unknown.'};
  steps[1]={...steps[1],title:'Reality Sorter',detail:'The existing guided six-stage interactive mission.',availability:'available',href:'#lab/mission/reality-sorter/notice'};
  steps[2]={...steps[2],title:'Reality Map',detail:'Open the existing independent reflection tool.',availability:'available',href:'#tool/reality-map'};
  steps[3]={...steps[3],title:'Assumption Finder',detail:'Open the existing independent assumption-checking tool.',availability:'available',href:'#tool/assumption-finder'};
  steps[4]={...steps[4],title:'Remember the distinction',detail:'An authored review activity to be published later.'};
 }
 return Object.freeze({id:`forest-unit-${number}`,number,chapter,title,availability:number===1?'available':'planned',steps:Object.freeze(steps)});
}));
export const forestCurriculumManifest=Object.freeze({world:'forest',chapters:8,units:40,stepsPerUnit:5,publishedOriginalLabMissions:1,reviewStatus:'draft-curriculum'});
export function getForestUnitOutline(unitNumber){return forestUnitOutlines.find(u=>u.number===Number(unitNumber))||null;}
