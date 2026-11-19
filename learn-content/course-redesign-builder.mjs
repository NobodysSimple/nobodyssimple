/**
 * Reproducible content compiler for the three authored Learn course redesigns.
 * This file is editorial tooling and is not imported by the public player.
 * Authored lesson content resides in the matching course-specs/ files.
 */
const assert=(v,message)=>{if(!v)throw Error(message);};
const text=v=>String(v||'').trim();
const spaced=v=>text(v).replace(/\s+/g,' ');
const nodeBase=(id,type,title,concept,refs,extra={})=>({id,type,title,conceptId:concept,explanation:'',counterexample:'',sources:refs,image:'',alt:'',caption:'',...extra});
export function buildDeepCourse(old,brief){
 assert(old.id===brief.id,'Course mismatch');
 assert(brief.lessons.length===12,'Each of the rebuilt courses needs twelve authored lessons');
 assert(brief.modules.length===3&&brief.modules.every(x=>x.lessonIndexes.length===4),'Require 3 four-lesson modules');
 const original=old.modules.flatMap(u=>u.lessons);
 assert(original.length===12,'Unexpected published inventory');
 const keyed=new Map(original.map(l=>[l.id,l]));
 const uniqueIds=new Set();
 const built=brief.lessons.map((s,i)=>{
  assert(s.opening&&s.mechanism&&s.evidence&&s.complication&&s.closing&&s.case?.turns?.length>=6,'Incomplete teaching '+i);
  assert(s.label?.length>=4&&s.label.some(r=>r.answer),'Missing evidence selection in '+s.title);
  assert(s.cycle?.length===4&&s.hypotheses?.length===3&&s.sort?.items?.length>=4,'Missing competing explanation work '+s.title);
  assert(s.revision?.options?.length>=2&&s.action?.changes?.length>=2&&s.transfer?.options?.length>=2,'Missing decision or transfer '+s.title);
  assert(s.life?.frames?.length>=2&&s.life?.options?.length>=2,'Missing illustration exercise '+s.title);
  const oldLesson=original[i],lid=oldLesson.id,ref=s.sources||brief.sources,concept=brief.id+'-'+spaced(s.concept).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const id=x=>{const key=lid+'-redesign-'+x;assert(!uniqueIds.has(key),'Duplicate '+key);uniqueIds.add(key);return key;};
  const read=(key,title,body)=>({id:id(key),type:'read',title,body:text(body),sources:ref});
  const opts=(key,labels)=>labels.map((label,j)=>({id:lid+'-'+key+'-'+j,label:text(label)}));
  const q=(key,type,title,prompt,labels,correct,explanation,extra={})=>{
   const options=opts(key,labels);
   return nodeBase(id(key),type,title,concept,ref,{prompt,options,answer:options[correct].id,
    explanation:spaced(explanation),counterexample:spaced(s.boundary),...extra});
  };
  const dialogue={
   ...nodeBase(id('conversation'),'dialogue',s.case.title||'The conversation',concept,ref),
   prompt:s.case.question,scenario:s.case.setup,
   speakerA:s.case.a,speakerB:s.case.b,
   turns:s.case.turns.map((t,j)=>({id:lid+'-turn-'+j,speaker:t[0],text:t[1]})),
   checks:[
    {id:lid+'-dialogue-evidence',prompt:s.case.firstQuestion,focusTurn:lid+'-turn-'+(s.case.focus??3),
      options:opts('dialogue-evidence',s.case.firstOptions),answer:lid+'-dialogue-evidence-'+(s.case.firstAnswer??0),
      explanation:s.case.firstExplanation,counterexample:s.boundary},
    {id:lid+'-dialogue-action',prompt:s.case.secondQuestion,focusTurn:'',
      options:opts('dialogue-action',s.case.secondOptions),answer:lid+'-dialogue-action-'+(s.case.secondAnswer??0),
      explanation:s.case.secondExplanation,counterexample:s.boundary}
   ]
  };
  const evidence=nodeBase(id('evidence'),'label',s.labelTitle||'Find the evidence',concept,ref,{
    prompt:s.labelPrompt,segments:s.label.map((r,j)=>({id:lid+'-evidence-'+j,text:r.text,answer:!!r.answer})),
    explanation:s.labelExplanation,counterexample:s.boundary
  });
  const chain=nodeBase(id('process'),'chain',s.chainTitle||'Build the psychological process',concept,ref,{
   prompt:s.cyclePrompt,steps:s.cycle.map((label,j)=>({id:lid+'-process-'+j,label})),
   explanation:s.cycleExplanation,counterexample:s.boundary
  });
  const rank=nodeBase(id('hypotheses'),'rank',s.rankTitle||'Competing explanations',concept,ref,{
   prompt:s.rankPrompt,steps:s.hypotheses.map((label,j)=>({id:lid+'-hyp-'+j,label})),
   explanation:s.rankExplanation,counterexample:s.boundary
  });
  const sort=nodeBase(id('classification'),'sort',s.sort.title||'Recognise the distinction',concept,ref,{
   prompt:s.sort.prompt,categories:s.sort.categories.map((label,j)=>({id:lid+'-category-'+j,label})),
   items:s.sort.items.map((r,j)=>({id:lid+'-sort-'+j,label:r.text,answer:lid+'-category-'+r.category})),
   explanation:s.sort.explanation,counterexample:s.boundary
  });
  const update=q('revision','update',s.revision.title||'New evidence changes the picture',
   s.revision.prompt,s.revision.options,s.revision.answer??0,s.revision.explanation,{newEvidence:s.revision.evidence});
  const changes=opts('action-change',s.action.changes),outcomes=opts('action-outcome',s.action.outcomes);
  const predict=nodeBase(id('decision'),'predict',s.action.title||'Choose a defensible next step',concept,ref,{
    prompt:s.action.prompt,changePrompt:s.action.changePrompt,changes,outcomes,
    correctChange:changes[s.action.bestChange??0].id,correctOutcome:outcomes[s.action.bestOutcome??0].id,
    explanation:s.action.explanation,counterexample:s.boundary
  });
  const transfer=q('transfer','choose',s.transfer.title||'Use the idea somewhere else',
   s.transfer.prompt,s.transfer.options,s.transfer.answer??0,s.transfer.explanation);
  const recall=nodeBase(id('recall'),'complete','Retrieve the idea without the answer in front of you',concept,ref,{
    prompt:s.recall.prompt,answers:s.recall.answers,hint:s.recall.hint||'Write the term or a close plain-English equivalent.',
    explanation:s.recall.explanation,counterexample:s.boundary
  });
  // An everyday-life node uses the same authoring and grading contract as staff Course Lab.
  const lifeOpts=opts('life-choice',s.life.options);
  const life=nodeBase(id('real-life'),s.life.type,s.life.title,concept,ref,{
    prompt:s.life.prompt,scene:s.life.scene,reveal:s.life.reveal,
    frames:s.life.frames.map((f,j)=>({id:lid+'-life-frame-'+j,label:f[0],detail:f[1],category:''})),
    options:lifeOpts,answer:lifeOpts[s.life.answer??0].id,explanation:s.life.explanation,counterexample:s.boundary
  });
  const sections=[
   read('opening',s.openingTitle||'What happened here?',s.opening),
   dialogue,evidence,
   read('mechanism',s.mechanismTitle||'What could be happening?',s.mechanism),
   chain,rank,
   read('research',s.evidenceTitle||'What the research can tell us',s.evidence),
   life,sort,
   read('complication',s.complicationTitle||'Where the easy explanation breaks down',s.complication),
   update,predict,
   transfer,recall,
   read('ending',s.closingTitle||'What you can now do',s.closing)
  ];
  // Rotate the order inside coherent teaching sections so recurring drills do not
  // appear at the same position in every lesson. Keep evidence and reading before conclusions.
  const n=i%4;
  if(n===1){[sections[1],sections[2]]=[sections[2],sections[1]];[sections[4],sections[5]]=[sections[5],sections[4]];}
  if(n===2){[sections[7],sections[8]]=[sections[8],sections[7]];[sections[10],sections[11]]=[sections[11],sections[10]];}
  if(n===3){[sections[4],sections[5]]=[sections[5],sections[4]];[sections[12],sections[13]]=[sections[13],sections[12]];}
  return {
   id:lid,title:s.title,version:Math.max(Number(oldLesson.version||1)+1,3),standard:'deep-10',
   durationMinutes:Math.max(10,Math.min(18,Math.ceil((s.duration||12)))),editorialStatus:'ready',
   objective:s.objective,teach:s.teach,takeaway:s.takeaway,transferPrompt:s.transfer.prompt,
   glossary:s.glossary||[],evidenceSummary:s.evidenceSummary||brief.evidenceSummary,
   staffReview:'Editorial redraft informed by named research references; independent specialist clinical review and user testing remain outstanding. Published '+brief.reviewDate+'.',
   recommendedType:s.life.type,nodes:sections
  };
 });
 const modules=brief.modules.map((m,mi)=>{
  const basis=old.modules[mi];
  return {id:basis.id,title:m.title,kind:mi===0?'foundation':undefined,
    overview:m.overview,glossary:m.glossary||[],
    lessons:m.lessonIndexes.map(j=>built[j])};
 });
 const all=modules.flatMap(m=>m.lessons);
 assert(all.length===12&&new Set(all.map(l=>l.id)).size===12,'Lesson assignments not unique');
 return {...old,version:old.version+1,status:'published',title:brief.title,description:brief.description,
  teachingApproach:brief.teachingApproach,modules};
}
