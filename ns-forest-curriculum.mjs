/**
 * The Forest: ten distinct lesson slots in each of forty planned units.
 * Only Unit 1 has playable activities. Units 2–40 are editorial outlines,
 * NOT published lessons, achievements or therapy/diagnostic assessments.
 */
const FOREST_TITLES = Object.freeze([
  'Facts, stories & uncertainty','Observation or interpretation?','Why we assume motives',
  'Considering other explanations','Checking the evidence','Confidence and doubt',
  'Dealing with the unknown','Common thinking traps','Attention and selective evidence',
  'Memory is reconstructive','Recognising confirmation bias','When thoughts spiral',
  'Worry and prediction','Rumination and reflection','The need for certainty',
  'Interpreting social situations','Separating feelings from facts',
  'When information is incomplete','Patterns versus coincidences','Testing assumptions gently',
  'Questioning first impressions','Noticing the story you tell','Thinking in probabilities',
  'Avoiding all-or-nothing conclusions','Understanding disagreement','Reasoning under pressure',
  'Learning from mistakes','Dealing with ambiguity','Distinguishing possibility from likelihood',
  'Social comparison and beliefs','Interpreting intentions cautiously','Media claims and evidence',
  'Evidence quality and sources','Spotting persuasive language','Making flexible judgments',
  'Reasoning with competing values','When to seek more information','Transferring the skill to work',
  'Transferring the skill to relationships','Thinking clearly in everyday life'
]);

const KINDS = Object.freeze({
  learn:{label:'Learn',verb:'Meet',summary:'Understand one idea through an everyday example.'},
  explore:{label:'Explore',verb:'Notice',summary:'Spot a detail worth examining before deciding what it means.'},
  compare:{label:'Compare',verb:'Compare',summary:'Consider alternatives and the information that distinguishes them.'},
  practise:{label:'Practise',verb:'Practise',summary:'Try a skill through a guided, fictional situation.'},
  choose:{label:'Choose',verb:'Choose',summary:'Compare possible responses without pretending there is one perfect answer.'},
  apply:{label:'Apply',verb:'Apply',summary:'Find an optional everyday use for this distinction.'},
  reflect:{label:'Reflect',verb:'Reflect on',summary:'Consider where this skill is useful and where it has limits.'},
  review:{label:'Review',verb:'Recall',summary:'Retrieve the main idea in a new context.'},
  milestone:{label:'Milestone',verb:'Bring together',summary:'Combine learning from the chapter in one synthesis.'}
});
const TEN_PART_SEQUENCE = Object.freeze([
  'learn','explore','compare','practise','review',
  'learn','compare','choose','apply','review'
]);

/** Five Forest Unit 1 stones: 3+3+2+1+1 lessons; no filler lessons.
 * The original magnifier, scales and star icons are reused on their stones.
 * Two new stones use the existing book and apply glyphs from the trail.
 * Only the first three stones need segmented progress indicators.
 */
export const forestStoneLessonGroups = Object.freeze({
  'assumption-finder':Object.freeze(['observed-or-inferred','feeling-not-proof','unknown-is-unknown']),
  'reality-map':Object.freeze(['competing-explanations','discriminating-evidence','reality-map']),
  'perspective-window':Object.freeze(['hidden-assumption','confidence-and-certainty']),
  'reality-sorter':Object.freeze(['reality-sorter']),
  'life-application':Object.freeze(['apply-to-life'])
});
export const forestStoneMeta = Object.freeze({
  'assumption-finder':Object.freeze({title:'Spot the Difference',type:'notice',objective:'Notice observations, interpretations and feelings.'}),
  'reality-map':Object.freeze({title:'Weigh the Evidence',type:'compare',objective:'Compare explanations and test the quality of clues.'}),
  'perspective-window':Object.freeze({title:'Try Another Perspective',type:'discover',objective:'Transfer the skill to a new situation.'}),
  'reality-sorter':Object.freeze({title:'Reality Sorter',type:'capstone',objective:'Complete the six-stage interactive mission.'}),
  'life-application':Object.freeze({title:'Take It Into Life',type:'apply',objective:'Choose an optional action or reflect on a useful next step.'})
});
export const forestPlayableLessonIds = Object.freeze(Object.values(forestStoneLessonGroups).flat());
const PLAYABLE_META = Object.freeze({
  'observed-or-inferred':{title:'What did you actually see?',kind:'learn',type:'lesson'},
  'feeling-not-proof':{title:'What does a feeling prove?',kind:'explore',type:'lesson'},
  'unknown-is-unknown':{title:'Spot the missing information',kind:'compare',type:'lesson'},
  'reality-sorter':{title:'Reality Sorter',kind:'practise',type:'mission',href:'#lab/mission/reality-sorter/notice'},
  'competing-explanations':{title:'One event, several explanations',kind:'learn',type:'lesson'},
  'discriminating-evidence':{title:'Which evidence would help?',kind:'compare',type:'lesson'},
  'reality-map':{title:'Reality Map',kind:'apply',type:'tool',href:'#tool/reality-map'},
  'hidden-assumption':{title:'Find the hidden assumption',kind:'explore',type:'lesson'},
  'confidence-and-certainty':{title:'Confidence is not certainty',kind:'review',type:'lesson'},
  'apply-to-life':{title:'One Small Test in Real Life',kind:'apply',type:'lesson'}
});

const STONE_SIZES=Object.freeze([3,3,2,1,1]);
const STONE_KINDS=Object.freeze(['learn','practise','transfer','capstone','application']);

export const forestUnitOutlines=Object.freeze(FOREST_TITLES.map((title,index)=>{
  const number=index+1,chapter=Math.floor(index/5)+1;
  const steps=TEN_PART_SEQUENCE.map((kind,i)=>{
    const kindId=(number%5===0&&i===9)?'milestone':kind;
    return {
      id:`forest-unit-${number}-step-${i+1}`,kind:kindId,label:KINDS[kindId].label,
      title:`${KINDS[kindId].verb} · ${title}`,
      detail:KINDS[kindId].summary,
      availability:'planned'
    };
  });
  if(number===1){
    forestPlayableLessonIds.forEach((lessonId,i)=>{
      const meta=PLAYABLE_META[lessonId];
      steps[i]={...steps[i],lessonId,kind:meta.kind,label:KINDS[meta.kind].label,
        title:meta.title,detail:KINDS[meta.kind].summary,type:meta.type,
        availability:'available',href:meta.href||`#lab/lesson/forest/${lessonId}`};
    });
  }
  const stones=STONE_SIZES.map((size,i)=>{
    const offset=STONE_SIZES.slice(0,i).reduce((a,b)=>a+b,0);
    return Object.freeze({number:i+1,kind:STONE_KINDS[i],lessonCount:size,
      lessonIds:Object.freeze(steps.slice(offset,offset+size).map(x=>x.lessonId||x.id)),
      availability:number===1?'available':'planned'});
  });
  return Object.freeze({id:`forest-unit-${number}`,number,chapter,title,
    availability:number===1?'available':'planned',steps:Object.freeze(steps.map(Object.freeze)),
    stones:Object.freeze(stones)});
}));
export const forestCurriculumManifest=Object.freeze({world:'forest',chapters:8,units:40,
  stepsPerUnit:10,stonesPerUnit:5,publishedOriginalLabMissions:1,playableUnit1Lessons:10,
  reviewStatus:'draft-curriculum'});
export function getForestUnitOutline(unitNumber){
  return forestUnitOutlines.find(u=>u.number===Number(unitNumber))||null;
}
export function getForestPlayableLesson(lessonId){
  return forestUnitOutlines[0].steps.find(s=>s.lessonId===lessonId)||null;
}
