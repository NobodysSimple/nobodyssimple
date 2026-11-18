/** First-module lesson authoring factory.
 * The seed cases in learn-content/first-module-seeds-part*.json contain authored
 * psychology and dialogue. This factory makes editable Course Lab nodes while
 * keeping a fixed learning dependency order and a varied practice set.
 * Generated JSON is what staff edit and publish; there is no runtime generator.
 */
export function generateFirstModule(s,{title,moduleTitle}={}){
 const id=s.id,unit=id+'-module-01',character=s.people[1];
 const names=[
  'What is really happening?','Why does it keep happening?',
  'Same behaviour, different cause','What would change your mind?',
  'Choose a workable response','Try it in another situation'
 ];
 const prefix=(l,n)=>id+'-m1-l'+l+'-n'+n;
 const option=(key,labels,notes=[])=>labels.map((label,i)=>({id:key+'-opt'+(i+1),label,feedback:notes[i]||''}));
 const base=(l,n,type,heading,prompt,additional={})=>({
  id:prefix(l,n),type,title:heading,prompt,
  conceptId:unit+':'+s.concept,
  explanation:s.formulation,counterexample:s.counter,sources:s.sources,...additional
 });
 const read=(l,n,heading,body)=>({id:prefix(l,n),type:'read',title:heading,body,sources:s.sources});
 const choose=(l,n,heading,prompt,labels,best,why,notes=[],group='')=>{
  const key=prefix(l,n);
  return base(l,n,'choose',heading,prompt,{options:option(key,labels,notes),answer:key+'-opt'+(best+1),explanation:why,...(group?{shuffleGroup:group}:{})});
 };
 const evidence=(l,n,group='')=>{
  const selected=[...new Set(s.evidence)],other=s.talk.map((_,i)=>i).filter(i=>!selected.includes(i));
  const index=[selected[0],other[0],selected[1],other[1]];
  return base(l,n,'label','Find the important lines',
   'Select the two lines that best show how the speaker interprets the event or what they believe is at stake.',{
   segments:index.map((index,i)=>({id:prefix(l,n)+'-phrase'+i,text:'“'+s.talk[index]+'”',answer:selected.includes(index)})),
   explanation:'These lines reveal more about the meaning attached to the situation than a statement of the practical disagreement alone. '+s.formulation,
   ...(group?{shuffleGroup:group}:{})
  });
 };
 const chain=(l,n,group='')=>base(l,n,'chain','Build the psychological process',
  'Arrange this possible sequence. One step concerns what the person might be thinking; treat it as a hypothesis.',{
   steps:s.process.map((label,i)=>({id:prefix(l,n)+'-step'+i,label})),
   explanation:'The order helps us test how a response might become self-maintaining. '+s.formulation+' '+s.counter,
   ...(group?{shuffleGroup:group}:{})
  });
 const matching=(l,n,group='')=>{
  const labels=['Initial event','Possible appraisal','Behavioural response','Possible consequence'];
  return base(l,n,'match','Connect process to evidence',
   'Connect each part of the case to its role in the working explanation.',{
   pairs:s.process.map((label,i)=>({id:prefix(l,n)+'-pair'+i,label,answer:labels[i]})),
   explanation:'A functional explanation identifies the event, the meaning it may take on, the response and what follows. '+s.formulation,
   ...(group?{shuffleGroup:group}:{})
  });
 };
 const sort=(l,n,group='')=>{
  const cats=[{id:prefix(l,n)+'-fact',label:'Observable statement'},{id:prefix(l,n)+'-hypothesis',label:'Proposed interpretation'}];
  return base(l,n,'sort','Fact or inference?',
   'Sort the exact words spoken from explanations about what those words might mean.',{
   categories:cats,
   items:[
    {id:prefix(l,n)+'-item1',label:'“'+s.talk[s.evidence[0]]+'”',answer:cats[0].id},
    {id:prefix(l,n)+'-item2',label:s.formulation,answer:cats[1].id},
    {id:prefix(l,n)+'-item3',label:'“'+s.talk[s.evidence[1]]+'”',answer:cats[0].id},
    {id:prefix(l,n)+'-item4',label:s.rival,answer:cats[1].id}
   ],
   explanation:'The words are evidence. Both the preferred explanation and its rival are interpretations requiring further testing. '+s.counter,
   ...(group?{shuffleGroup:group}:{})
  });
 };
 const investigate=(l,n,group='')=>{
  const key=prefix(l,n);
  return base(l,n,'investigate','Which evidence matters most?',
   'You want to distinguish the working hypothesis from its strongest alternative. Which investigation would provide the most discriminating information?',{
   options:option(key,[
    'Ask both people to describe how strongly they felt during the conversation.',
    s.test,
    'Ask the person affected whether the behaviour seems consistent with their overall impression of the speaker.',
    'Find one more occasion when the characters disagreed, without checking what the circumstances were.'
   ],[
    'The strength of a feeling matters, but it does not establish its cause.',
    'This gathers information that could strengthen or weaken the explanation, rather than merely confirming an impression.',
    'Impact and perception matter for responding; they are less decisive about the other person’s hidden motives.',
    'Another incident is useful only if we compare the circumstances and plausible explanations.'
   ]),
   answer:key+'-opt2',explanation:'Investigate a difference that the rival explanations predict. '+s.test,
   ...(group?{shuffleGroup:group}:{})
  });
 };
 const repair=(l,n,group='')=>{
  const key=prefix(l,n);
  return base(l,n,'repair','Correct the inference',
   'Someone says: “That tells us what sort of person they really are.” Which revision is most defensible?',{
   options:option(key,[
    'Because an alternative is possible, every explanation should be treated as equally likely until we know the person well.',
    'The behaviour may serve the proposed function in this case. We would need broader evidence before treating it as a stable characteristic.',
    'The person has not confirmed their own motive, so we should avoid making any psychological inference at all.',
    'The response fits the theory, so it is likely to occur in most situations that threaten the person.'
   ],[
    'Possible explanations need not be equally supported. We should compare their fit with the actual evidence.',
    'This retains a useful process explanation without generalising beyond the evidence.',
    'Direct self-report helps, but a tentative formulation can still be tested against observed circumstances.',
    'Generalising to different settings requires repeated observations, not theoretical resemblance alone.'
   ]),
   answer:key+'-opt2',explanation:'A working interpretation can be informative without being a diagnosis. '+s.counter,
   ...(group?{shuffleGroup:group}:{})
  });
 };
 const predict=(l,n,group='')=>{
  const key=prefix(l,n);
  return base(l,n,'predict','What might change next?',
   'The other person may disagree. Which response-and-outcome pairing best protects the practical concern without assuming cooperation?',{
   changePrompt:'Response to try',
   changes:option(key+'-action',[s.responses[3],s.responses[1]]),
   outcomes:option(key+'-result',[
    'The other person’s interpretation may become clearer, though the original issue may still need to be resolved.',
    'A concrete correction or next step is proposed. Agreement remains uncertain.'
   ]),
   correctChange:key+'-action-opt2',correctOutcome:key+'-result-opt2',
   explanation:'A sound response is judged by what it makes possible, not by whether it can instantly change somebody else. '+s.responses[1],
   ...(group?{shuffleGroup:group}:{})
  });
 };
 const characterNode=(l,n,group='')=>{
  const key=prefix(l,n);
  return base(l,n,'character','Choose the next step',
   'Your aim is to address the immediate concern while leaving room for a useful conversation.',{
   characterName:s.people[0],scenario:s.scene,
   evidenceOptions:option(key+'-evidence',[s.rival,s.formulation]),
   evidenceAnswer:key+'-evidence-opt2',
   responseOptions:option(key+'-response',[s.responses[2],s.responses[1]]),
   responseAnswer:key+'-response-opt2',
   explanation:'The first response is a proportionate attempt to address the problem directly. Escalation may be legitimate if that attempt fails. '+s.counter,
   ...(group?{shuffleGroup:group}:{})
  });
 };
 const talk=(l,n,follow=false)=>{
  const key=prefix(l,n)+'-question';
  const lines=follow?s.follow:s.talk;
  const turns=lines.map((text,i)=>({id:prefix(l,n)+'-turn'+i,speaker:i%2?'b':'a',text}));
  const labels=follow?[
   s.rival,
   'This additional exchange reveals more about the speaker’s interpretation, but leaves wider personality questions open.',
   'The dispute can now be explained entirely by the factual wording of the original request.',
   'The speaker’s reaction supplies evidence that the same pattern will occur throughout their relationships.'
  ]:[
   s.rival,
   s.formulation,
   'The practical disagreement is sufficient to explain the exchange; its possible personal meaning is less relevant.',
   'The intensity of the reply makes a stable individual trait more likely than a situational response.'
  ];
  return base(l,n,'dialogue',follow?'See what happens next':'Watch the conversation',
   'Listen closely to what each person says and what still remains uncertain.',{
   scenario:follow?'A little later in the same situation. Continue one message at a time.':s.scene,
   speakerA:s.people[0],speakerB:s.people[1],turns,
   checks:[{
    id:key,prompt:follow?'What has become clearer about the speaker’s interpretation?':'Which working explanation is best supported by the conversation?',
    focusTurn:turns[Math.min(follow?2:s.evidence[0],turns.length-1)].id,
    options:option(key,labels,[
     'A realistic alternative. Compare it with the exact lines that reveal what may be at stake.',
     follow?'The new exchange helps us understand the situation without establishing an enduring personality style.':s.formulation,
     'The practical facts matter, but the words also reveal what the issue might mean to the speaker.',
     'A single interaction cannot justify a prediction about behaviour across settings.'
    ]),
    answer:key+'-opt2',
    explanation:follow?'The additional wording refines the hypothesis. '+s.formulation:s.formulation+' '+s.rival,
    counterexample:s.counter
   }]
  });
 };
 const revised=(l,n,group='')=>choose(l,n,'Update your interpretation',
  'New information: '+s.newInfo+' Which interpretation should now carry more weight?',[
   'The new details matter, but the original working explanation should remain unchanged because it was reasonable at the time.',
   s.revision,
   'The new information rules out every motive except the one that is now best supported.',
   'The discovery affects what the characters should do next, but contributes little to understanding the earlier response.'
  ],1,'A formulation should change when the evidence changes. '+s.revision,[
   'An initially reasonable account still needs revising when the evidence develops.',
   'The revised account takes the added detail seriously without claiming complete access to the person’s motives.',
   'Evidence can strengthen one hypothesis without proving it is the only cause.',
   'The discovery may explain part of the original situation, not merely the preferred intervention.'
  ],group);
 const transfer=(l,n,group='')=>choose(l,n,'Apply the method elsewhere',
  'Consider this different situation: '+s.transfer+' What is the strongest next step?',[
   'Treat the visible similarity as a reliable indication that the behaviour has the same psychological function.',
   'Consider what the person could be trying to gain or avoid, then test that explanation against the circumstances and credible alternatives.',
   'Postpone all interpretation until the person can give an account of their private motives.',
   'Judge whether the behaviour is socially acceptable first, since that provides the best evidence about why it happened.'
  ],1,'Transfer the reasoning method rather than an explanation from the first case. '+s.counter,[
   'Similar behaviours can protect very different interests depending on the context.',
   'This asks what the behaviour might accomplish and how we could check.',
   'A perfect self-report may be unavailable. Tentative, revisable inferences can still be useful.',
   'Judging the consequences of a behaviour is important, but consequences do not by themselves establish motive.'
  ],group);
 const build=l=>{
  const add=[];
  if(l===1){
   add.push(talk(l,1),evidence(l,2,'practice'),choose(l,3,'Compare the explanations',
    'Which account explains the character’s words most convincingly without pretending we know their private thoughts?',[
     s.rival,s.formulation,
     'Both people have practical concerns, so the psychological meaning attached to the dispute is unlikely to matter.',
     'The best explanation is simply that the two people want incompatible outcomes; further formulation adds little.'
    ],1,s.formulation+' '+s.rival,[
     'This is plausible. It explains some of the disagreement, but does not always account for the strongest clues.',
     'This hypothesis explains the speaker’s account of what the situation threatens or means to them.',
     'Practical interests can contribute while personal meanings also affect how the conversation unfolds.',
     'Incompatible goals explain the existence of a dispute, not necessarily the particular response to it.'
    ],'practice'),chain(l,4,'practice'),read(l,5,'The deeper mechanism',s.formulation+'\n\n'+s.counter+'\n\n'+s.rival),investigate(l,6));
  }else if(l===2){
   add.push(read(l,1,'What could keep it going?',s.formulation+'\n\n'+s.process[3]+'. A response can feel helpful in the moment while leaving the original problem unresolved.'),matching(l,2,'practice'),chain(l,3,'practice'),predict(l,4),choose(l,5,'The maintaining consequence',
    'Why might the same response become more likely in a later disagreement?',[
     'The person does not yet have a sufficiently complete factual description of the dispute.',
     'The response may reduce an immediate concern, even though the longer-term interaction becomes harder.',
     'The behaviour is already habitual, so its consequences probably have little influence.',
     'The other person has not explained their feelings in the right words.'
    ],1,s.formulation+' '+s.process[3]+'.',[
     'Uncertainty about facts may contribute, but it does not fully explain why the response is repeated.',
     'This links short-term effects of behaviour to the possibility of repetition.',
     'Habits and consequences can interact; they are not competing explanations by default.',
     'Communication can matter, but there may be a maintaining reward or relief independent of phrasing.'
    ],'practice'),sort(l,6));
  }else if(l===3){
   add.push(read(l,1,'What else could explain it?',s.rival+'\n\n'+s.counter),sort(l,2,'practice'),repair(l,3,'practice'),choose(l,4,'Which explanation deserves more weight?',
    'What makes one formulation stronger than a plausible competing account?',[
     'It resembles a recognised theory, so the exact details of this case matter less.',
     'It explains more of the distinctive evidence and suggests observations that could prove it wrong.',
     'Both accounts are possible, so each deserves equal confidence until a definitive diagnosis is made.',
     'The person harmed by the behaviour is most likely to know why the other person acted that way.'
    ],1,'Look for explanatory fit and a way to be wrong. '+s.test,[
     'A theory does not become evidence merely because the scenario resembles it.',
     'An account that fits the details and can be checked is more informative than one that merely sounds plausible.',
     'Plausibility does not entail equal likelihood, and a diagnosis is not the aim.',
     'People may understand the impact on themselves without knowing another person’s internal motive.'
    ],'practice'),characterNode(l,5),matching(l,6));
  }else if(l===4){
   add.push(read(l,1,'What would change the explanation?',s.test+'\n\nA useful hypothesis should make it possible to gather evidence against it.'),talk(l,2,true),investigate(l,3,'practice'),revised(l,4,'practice'),evidence(l,5,'practice'),repair(l,6));
  }else if(l===5){
   add.push(read(l,1,'Your influence has limits',s.counter+'\n\nAn intervention can be reasonable even when the other person refuses it.'),characterNode(l,2),predict(l,3,'practice'),choose(l,4,'If the first response fails',
    'The other person rejects a reasonable direct request and the practical concern is unresolved. What next?',[
     'Repeat reassurance until the other person no longer experiences the issue as threatening.',
     s.responses[2],
     'Drop the matter to avoid further discomfort, regardless of the practical consequences.',
     s.responses[3]
    ],1,'Escalation can be proportionate when a direct attempt has failed. Its safety and usefulness depend on the situation. '+s.counter,[
     'Reassurance can help but cannot guarantee action on a concrete problem.',
     'This makes the unresolved issue reviewable without needing to diagnose the other person.',
     'Leaving can sometimes be safest, but here it sacrifices the stated practical goal without necessity.',
     'A further question can clarify motives, but may delay resolution when the refusal is already clear.'
    ],'practice'),repair(l,5,'practice'),investigate(l,6));
  }else{
   add.push(read(l,1,'A new situation',s.transfer+'\n\nDecide what you can infer from this example without assuming the same explanation must apply.'),transfer(l,2),sort(l,3,'practice'),investigate(l,4,'practice'),chain(l,5,'practice'),read(l,6,'An idea worth carrying forward',s.formulation+'\n\n'+s.counter+'\n\nThe purpose of the exercise is to make a better-supported judgement and choose a proportionate next step.'));
  }
  // Different authored exercise patterns across lessons, with runtime
  // shuffling confined to independent, adjacent practice checkpoints.
  if((s.id.length+l)%3===0){
   const start=add.findIndex(x=>x.shuffleGroup==='practice');
   if(start>=0&&add[start+1]?.shuffleGroup==='practice')
    [add[start],add[start+1]]=[add[start+1],add[start]];
  }
  return add;
 };
 const teaches=[
  s.scene,
  'Work out how the response might be maintained, rather than giving it a label.',
  'Distinguish what was observed from competing explanations of the same behaviour.',
  'New evidence can overturn a comfortable theory. Decide what the discovery actually changes.',
  'Choose a response that serves a practical aim even when the other person does not cooperate.',
  'Apply the way of reasoning to a different situation. Do not import the first case’s verdict.'
 ];
 const lessons=names.map((name,i)=>({
  id:id+'-m1-l'+(i+1),version:1,title:name,teach:teaches[i],
  objective:name,editorialStatus:'ready',nodes:build(i+1)
 }));
 const course={
  id,version:1,status:'published',title:title||id,
  description:'First unit: '+(moduleTitle||'Understand the problem')+'. Work through real situations, competing explanations and practical choices.',
  modules:[{id:unit,title:moduleTitle||'Understanding the first problem',lessons}]
 };
 // Validate authoring expectations locally before writing any public file.
 const nodeIds=lessons.flatMap(x=>x.nodes.map(n=>n.id));
 if(new Set(nodeIds).size!==nodeIds.length)throw Error(id+': duplicate exercise ID');
 for(const l of lessons){
  if(l.nodes.length<5)throw Error(id+': too few activities');
  if(new Set(l.nodes.filter(n=>!['read','image'].includes(n.type)).map(n=>n.type)).size<3)throw Error(id+': insufficient format variety');
  for(const n of l.nodes){
   if(n.type==='dialogue'&&(!n.turns?.length||!n.checks?.length))throw Error(id+': incomplete dialogue');
   if(['choose','repair','investigate'].includes(n.type)&&!n.options.some(o=>o.id===n.answer))throw Error(id+': invalid answer');
  }
 }
 return course;
}
