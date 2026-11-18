/** Two beginning units for every Learn course, with six short, editable
 * lessons that teach plain-English vocabulary before case formulations.
 * Content is supplied by reviewed editorial foundation-terms-*.json.
 * This generator is run to materialise versioned course bundles on GitHub;
 * no per-visit generation or fabricated assessment calibration.
 */
export function buildFoundationUnits(course,guide,caseData){
 if(!course?.id||course.id!==guide?.id||course.id!==caseData?.id)throw Error('Foundation course ID mismatch');
 if(!Array.isArray(guide.terms)||guide.terms.length!==4)throw Error('Foundations require four authored core concepts');
 const id=course.id,t=guide.terms,who=caseData.people||['Person A','Person B'];
 const ref=(m,l,n)=>id+'-f'+m+'-l'+l+'-n'+n;
 const src=caseData.sources||'';
 const base=(m,l,n,type,title,prompt,more={})=>({
  id:ref(m,l,n),type,title,prompt,conceptId:id+'-foundation:'+type,
  explanation:'The purpose is to connect the term to what can actually be observed.',
  counterexample:caseData.counter||'Different circumstances can support a different account.',
  sources:src,...more
 });
 const read=(m,l,n,title,body)=>({id:ref(m,l,n),type:'read',title,body,sources:src});
 const answers=(id,labels,notes=[])=>labels.map((label,i)=>({id:id+'-o'+(i+1),label,feedback:notes[i]||''}));
 const multiple=(m,l,n,title,prompt,labels,correct,explanation,notes=[])=>{
  const key=ref(m,l,n);return base(m,l,n,'choose',title,prompt,{
   options:answers(key,labels,notes),answer:key+'-o'+(correct+1),explanation
  });
 };
 const definition=(m,l,n,i)=>{
  const x=t[i];
  return read(m,l,n,'What '+x.name.toLowerCase()+' means',x.meaning+'\n\nFor example: '+x.example+'\n\nOne important limit: '+x.limit);
 };
 const concepts=(m,l,n,target,heading='Which idea fits best?')=>{
  const x=t[target],key=ref(m,l,n);
  const names=t.map(term=>term.name),options=[
   ...names.map(term=>'This most directly illustrates '+term+'.'),
   'The case requires at least two of these concepts to explain the observed event.'
  ];
  const feedback=t.map((term,i)=>i===target?
    'This description follows from the example. '+term.meaning:
    term.name+' is a genuine psychological idea, but the observation by itself does not establish it. '+term.limit
  ).concat(['Several concepts may become relevant later, but the prompt asks for the one best-supported description at present.']);
  return multiple(m,l,n,heading,'Consider this example: '+x.example+' Which concept is most directly demonstrated, without claiming anything beyond the example?',options,target,'The example most directly supports '+x.name.toLowerCase()+'. '+x.meaning+' '+x.limit,feedback);
 };
 const match=(m,l,n)=>base(m,l,n,'match','Know what the words mean','Match each term to the distinction it describes.',{
  pairs:t.map((x,i)=>({id:ref(m,l,n)+'-p'+i,label:x.name,answer:x.meaning})),
  explanation:'Read the definitions rather than relying on which word sounds most familiar. Each names a different part of '+guide.question.toLowerCase(),
 });
 const sort=(m,l,n)=>base(m,l,n,'sort','A description or an assumption?','Does the sentence report something we can check, or interpret what it might mean?',{
  categories:[{id:ref(m,l,n)+'-seen',label:'Description of what happened'},{id:ref(m,l,n)+'-guess',label:'Possible explanation'}],
  items:[
   {id:ref(m,l,n)+'-a',label:'“'+caseData.talk[0]+'”',answer:ref(m,l,n)+'-seen'},
   {id:ref(m,l,n)+'-b',label:caseData.formulation,answer:ref(m,l,n)+'-guess'},
   {id:ref(m,l,n)+'-c',label:'“'+caseData.talk[1]+'”',answer:ref(m,l,n)+'-seen'},
   {id:ref(m,l,n)+'-d',label:caseData.rival,answer:ref(m,l,n)+'-guess'},
  ],
  explanation:'The spoken words are evidence about what was said. A theory of why somebody said them is an interpretation that may need testing.',
 });
 const dialogue=(m,l,n)=>{
  const key=ref(m,l,n),turns=caseData.talk.slice(0,4).map((text,i)=>({id:key+'-turn'+i,speaker:i%2?'b':'a',text}));
  return base(m,l,n,'dialogue','Listen before you interpret','Follow the four messages. Keep the difference between the words said and their possible meaning in mind.',{
   scenario:caseData.scene,speakerA:who[0],speakerB:who[1],turns,
   checks:[{
    id:key+'-check1',prompt:'What is the most careful conclusion we can draw from the exchange so far?',
    focusTurn:turns.at(-1).id,
    options:answers(key+'-check1',[
     'We can describe what each speaker requested, while treating any account of their motives as provisional.',
     'We can take the last speaker’s explanation as the main cause, because it is the latest information.',
     'We can give the two speakers’ interpretations equal weight, regardless of which one fits the details.',
     'We can infer that one speaker has a stable psychological trait if their response appears defensive.',
     'We can stop analysing the situation because multiple explanations remain logically possible.'
    ],[
     'This keeps the distinction between what was said and why it may have been said. The latter requires more evidence.',
     'Order of speaking does not determine evidential quality; the earlier words still matter.',
     'Plausible alternatives can receive different weights when the observed details support them differently.',
     'A single interaction may reflect a situation rather than a trait that persists across settings.',
     'Uncertainty is a reason to test explanations, not to abandon reasoning.'
    ]),
    answer:key+'-check1-o1',
    explanation:'People can be sincere about their experience and still have incomplete explanations of why events happened. '+caseData.counter,
    counterexample:caseData.counter
   }],
  });
 };
 const evidence=(m,l,n)=>base(m,l,n,'investigate','What should we find out?','Both interpretations are plausible. What would actually help choose between them?',{
  options:answers(ref(m,l,n),[
   'Ask the speakers how intense their feelings were and use the stronger reaction to identify the main cause.',
   'Ask for a longer account from the speaker who was most upset, since they experienced the largest impact.',
   caseData.test,
   'Find a second argument and see whether it sounds similar without comparing what changed.',
   'Ask an uninvolved friend to guess which personality type best describes the speaker.'
  ],[
   'The strength of a feeling does not establish its cause.',
   'The account matters, but the amount of distress is not a direct test of someone else’s motive.',
   'This observation could make a meaningful difference between the competing explanations.',
   'A similar argument can occur for different reasons; comparison requires the relevant circumstances.',
   'A personality guess is less useful than identifying a testable difference between the proposed processes.'
  ]),
  answer:ref(m,l,n)+'-o3',explanation:caseData.test+' The question is what would change our view, rather than what would merely confirm it.'
 });
 const beginner=(l,title,teach,nodes)=>({
  id:id+'-f1-l'+l,title,teach,objective:'Learn the basic terms before analysing applied cases.',
  version:1,editorialStatus:'ready',nodes
 });
 const reasoning=(l,title,teach,nodes)=>({
  id:id+'-f2-l'+l,title,teach,objective:'Apply foundations to observable evidence, uncertainty and proportional decisions.',
  version:1,editorialStatus:'ready',nodes
 });
 const learnVocabulary=[
  beginner(1,'What are we studying?',guide.intro,[
   read(1,1,1,'Start here',guide.intro+'\n\n'+guide.question),
   definition(1,1,2,0),concepts(1,1,3,0,'Find the first concept'),
   definition(1,1,4,1),concepts(1,1,5,1,'Try another example')
  ]),
  beginner(2,'Two ideas you will keep meeting','Before we use specialist words in a case, give them an everyday meaning.',[
   definition(1,2,1,2),definition(1,2,2,3),
   match(1,2,3),concepts(1,2,4,2),
   read(1,2,5,'Where a term stops being useful',t[2].limit+'\n\n'+t[3].limit)
  ]),
  beginner(3,'Similar words, different claims','The words sound related because they often occur together. Work out exactly what each one tells you.',[
   read(1,3,1,'Do not skip the distinction',t[0].meaning+'\n\n'+t[1].meaning),
   concepts(1,3,2,3,'Can you tell the difference?'),match(1,3,3),
   concepts(1,3,4,1,'A second situation'),
   read(1,3,5,'What you now know','You know the difference between '+t.map(x=>x.name.toLowerCase()).join(', ')+'. Next you will see why knowing the terms is only the beginning: two people can experience the same situation differently.')
  ])
 ];
 const practice=[
  reasoning(1,'First notice what happened','Read what is said before deciding why anyone said it.',[
   read(2,1,1,'A situation, not a diagnosis',caseData.scene+'\n\nYou can describe an event accurately while remaining uncertain about why it happened.'),
   dialogue(2,1,2),sort(2,1,3),
   read(2,1,4,'Why the distinction matters',caseData.rival+'\n\n'+caseData.counter)
  ]),
  reasoning(2,'Two explanations can sound reasonable','Evidence should be able to change which explanation you prefer.',[
   read(2,2,1,'Start with competing accounts',caseData.formulation+'\n\nAnother possibility: '+caseData.rival),
   evidence(2,2,2),
   read(2,2,3,'Something new has been found',caseData.newInfo),
   multiple(2,2,4,'Revise your view','Which response to this new information is justified?',[
    'Keep the original explanation because it initially fitted the facts.',
    'Prefer the explanation that most closely matches the new detail, while keeping other plausible causes open.',
    'Treat the new evidence as decisive proof of a single hidden intention.',
    'Give every explanation identical weight because certainty is impossible.',
    'Ignore the new detail until each speaker independently agrees on its meaning.'
   ],1,caseData.revision,[
    'A reasonable earlier account can be revised as new evidence appears.',
    'This revises confidence in response to information rather than to the apparent sophistication of the theory.',
    'The evidence can favour an account without establishing complete access to another person’s motives.',
    'Uncertainty does not require all accounts to be equally likely.',
    'Agreement may help cooperation, but it is not a prerequisite for evaluating evidence.'
   ])
  ]),
  reasoning(3,'Ready for a real case','You have the concepts. Now practise using them without jumping beyond the evidence.',[
   read(2,3,1,'Before you choose an explanation',guide.intro+'\n\nTry to distinguish what is directly known from the story you are telling about it.'),
   concepts(2,3,2,2,'Use the right word'),
   sort(2,3,3),evidence(2,3,4),
   read(2,3,5,'Next: a longer case','In the next unit you will watch a longer conversation and have to decide between rival psychological interpretations. '+caseData.counter)
  ])
 ];
 const glossary=t.map(g=>({term:g.name,definition:g.meaning,example:g.example,limit:g.limit}));
 return [
  {id:id+'-foundations-01',kind:'foundation',title:'Start here · the essential ideas',cast:who,glossary,lessons:learnVocabulary},
  {id:id+'-foundations-02',kind:'foundation',title:'Before the case · how to reason',cast:who,glossary,lessons:practice}
 ];
}
