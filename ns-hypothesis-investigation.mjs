/* Nobody's Simple: original Stage 3 hypothesis-testing conversation.
 * This is an authored, client-only differential/functional inquiry, not a
 * clinical diagnostic interview, probabilistic inference or evidence of
 * unconscious motives. Questions ask about observed sequences and competing
 * explanations. Never promote a candidate answer into a reported fact.
 */
import {subtypeNode} from './ns-hypothesis-subtype-atlas.mjs';
const opts=(pairs)=>Object.freeze([...pairs.map(([id,label])=>Object.freeze({id,label})),
 {id:'unsure',label:'I do not know / cannot tell'},
 {id:'other',label:'Something else / none of these'},
 {id:'prefer_not',label:'Prefer not to answer'}]);
const Q=(id,concept,layer,prompt,options,{tracks=[],after=null,when=null,why='',hypothesis=''}={})=>
 Object.freeze({id,concept,layer,prompt,options:opts(options),tracks:Object.freeze(tracks),
 after,when,why,hypothesis});
export const INVESTIGATION_QUESTIONS=Object.freeze([
 Q('who','situation.people','context',
 'Who is most directly involved in this particular situation?',[
 ['father','My dad / father'],['mother','My mum / mother'],['partner','My partner'],
 ['family','Another family member'],['friend','A friend'],['colleague','Someone at work or in education'],
 ['self','Mostly myself'],['multiple','Several people']
 ],{tracks:['relationships','social','identity','emotion','loss'],why:'Separates a specific relationship from a broad self-concept.'}),
 Q('father_label','reported.interpretation','meaning',
 'Which description, if any, matches how YOU view your dad in this situation?',[
 ['narcissistic','I describe my dad as narcissistic'],['controlling','I experience him as controlling'],
 ['critical','I experience him as highly critical'],['unreliable','I experience him as unreliable'],
 ['distant','I experience him as distant or unavailable'],['mixed','I have mixed feelings and cannot sum it up']
 ],{after:'who',when:'father',why:'Records an attributed interpretation without diagnosing a third party.'}),
 Q('father_behaviour','observed.interpersonal_behaviour','context',
 'Which specific behaviour have you actually noticed from your dad?',[
 ['dismissal','He dismisses or belittles what I say'],['rules','He imposes rules or limits my choices'],
 ['broken_promises','He makes commitments and does not follow through'],
 ['unavailable','He is emotionally unavailable'],
 ['intimidation','He threatens, intimidates or makes me afraid'],
 ['inconsistent','His treatment changes unpredictably']
 ],{after:'who',when:'father',why:'Separates an attributed interpretation from observable actions.'}),
 Q('event','sequence.trigger','context',
 'In a recent instance, what happened just BEFORE your reaction?',[
 ['criticism','I was criticised, dismissed or judged'],['uncertainty','I did not know what would happen'],
 ['demand','Someone made a demand or imposed a rule'],
 ['reminder','Something reminded me of the issue'],['body','I noticed a bodily sensation'],
 ['task','I faced an unfinished task or responsibility'],['nothing_obvious','No obvious event stood out']
 ],{why:'Elicits the antecedent, not an assumed early-life cause.'}),
 Q('emotion','sequence.feeling','experience',
 'What did you FEEL in that moment? Select what came closest.',[
 ['fear','Fear or alarm'],['shame','Shame or embarrassment'],['guilt','Guilt'],
 ['anger','Anger or resentment'],['sadness','Sadness or grief'],
 ['confusion','Confusion or uncertainty'],['relief','Relief or enjoyment'],
 ['numb','Numbness or little identifiable emotion']
 ],{why:'A concrete emotion must be reported, not inferred from the concern.'}),
 Q('interpretation','sequence.meaning','meaning',
 'What did the situation seem to MEAN to you at that moment?',[
 ['rejected','I might be rejected, excluded or abandoned'],
 ['inadequate','I might be inadequate or not good enough'],
 ['controlled','I might lose choice or be controlled'],
 ['unsafe','I might be unsafe or hurt'],
 ['mistake','I might make a consequential mistake'],
 ['unfair','Something important seemed unfair'],
 ['not_identity','It did not feel like a statement about who I am']
 ],{why:'Distinguishes the event itself from the meaning assigned to it.'}),
 Q('action','sequence.response','response',
 'What did you actually DO next?',[
 ['withdraw','I withdrew, became quiet or left'],
 ['confront','I argued, objected or confronted it'],
 ['appease','I agreed, complied or tried to please'],
 ['reassure','I checked, analysed or sought reassurance'],
 ['delay','I put off a task or decision'],
 ['soothe','I tried to calm or distract myself'],
 ['communicate','I communicated my concern directly'],
 ['no_change','I did not noticeably change what I did']
 ],{why:'Records observable responses rather than presuming an avoidance strategy.'}),
 Q('regulation','coping.main_strategy','response',
 'When this feeling gets difficult, what is your MAIN way of managing it?',[
 ['talk','Talking with someone'],['avoid','Avoiding the situation or withdrawing'],
 ['analyse','Analysing, checking or reassurance seeking'],
 ['scroll','Scrolling, gaming or entertainment'],
 ['fantasy','Fantasy, daydreaming or sexual content'],
 ['activity','Movement, exercise or another activity'],
 ['rest','Resting or reducing stimulation'],
 ['substance','Using alcohol or another substance'],
 ['not_manage','I do not have a reliable way']
 ],{why:'Checks the real regulation strategy and avoids assuming that every response is protective.'}),
 Q('short_term','sequence.immediate_effect','function',
 'Immediately AFTER that response, what typically happens?',[
 ['relief','I feel some relief or safety'],
 ['connection','I feel closer to someone or more understood'],
 ['control','I regain a sense of choice or control'],
 ['distress','The distress stays the same or gets stronger'],
 ['practical','The practical problem improves'],
 ['numb','I feel distracted or numb rather than relieved'],
 ['variable','It depends; there is no consistent effect']
 ],{after:'action',why:'Tests a consequence instead of declaring an unobserved function.'}),
 Q('long_term','sequence.later_effect','cost',
 'Later on, what tends to happen to the ORIGINAL issue?',[
 ['returns','It comes back largely unchanged'],['worse','It becomes more difficult'],
 ['improves','It genuinely improves'],['unresolved','The external situation remains unresolved'],
 ['sometimes','It varies depending on context'],
 ['no_problem','There is not an ongoing problem to maintain']
 ],{after:'short_term',why:'Distinguishes temporary regulation from a maintaining cycle or effective coping.'}),
 Q('sleep','context.sleep','context',
 'How has your sleep generally been while this has been happening?',[
 ['rested','Usually sufficient and restorative'],['too_little','Not enough opportunity for sleep'],
 ['difficulty','Difficulty falling or staying asleep'],['irregular','Irregular sleep schedule'],
 ['oversleep','Sleeping much more than usual'],['not_relevant','Sleep does not seem relevant']
 ],{why:'Tests a potential physiological contributor rather than assuming an emotional cause.'}),
 Q('capacity','context.capacity','context',
 'How much do exhaustion, health or workload affect this situation?',[
 ['high','A great deal'],['some','Somewhat'],
 ['little','Very little'],['unknown','I have not worked it out']
 ],{why:'Keeps real capacity and physical constraints in the formulation.'}),
 Q('environment','context.external_conditions','context',
 'Which OUTSIDE condition seems most important, if any?',[
 ['power','Someone else has power or control over the situation'],
 ['resources','Money, housing, access or time are limited'],
 ['expectations','Other people put expectations on me'],
 ['sensory','Noise, sensory conditions or physical surroundings'],
 ['unclear','The instructions or circumstances are unclear'],
 ['support','There is not enough reliable support'],
 ['none','No clear external condition']
 ],{why:'Tests social and material explanations before blaming an internal process.'}),
 Q('counterexample','test.exception','context',
 'Have you noticed the SAME issue becoming easier when one condition changes?',[
 ['safer_people','Yes, around safer or more accepting people'],
 ['rest','Yes, with enough sleep or recovery'],
 ['choice','Yes, when I have more autonomy'],
 ['clarity','Yes, when there is clearer information'],
 ['less_demand','Yes, when demands or stimulation are reduced'],
 ['no','No, I have not noticed an exception']
 ],{why:'Seeks disconfirming and contextual evidence, not confirmation alone.'}),
 Q('if_stop','test.counterfactual','function',
 'If you STOPPED your usual response but the situation stayed unchanged, what is your best guess?',[
 ['feel_emotion','I would feel more of the difficult emotion'],
 ['judgement','I might face criticism or rejection'],
 ['risk','There would be a real safety or practical risk'],
 ['no_cost','Nothing important would be lost'],
 ['better','The situation might improve'],
 ['cannot_predict','I cannot predict that responsibly']
 ],{after:'action',why:'Tests the proposed function, while allowing real-world risks and genuine uncertainty.'}),
 Q('values','person.priority','need',
 'What matters most to you in how this situation is handled?',[
 ['autonomy','Being free to make my own choices'],['belonging','Belonging and connection'],
 ['security','Actual safety and stability'],['respect','Being respected and treated fairly'],
 ['competence','Doing something well'],['authenticity','Being able to be myself'],
 ['relief','Reducing distress'],['practical','Solving the concrete problem']
 ],{why:'Elicits an explicit value, not a theorised unmet need.'}),
 Q('values_cost','test.value_tradeoff','tension',
 'Does pursuing that priority require you to give up something else you also value?',[
 ['relationship','Possibly some approval or closeness'],
 ['independence','Possibly some freedom or independence'],
 ['comfort','Possibly short-term comfort'],
 ['certainty','Possibly certainty or predictability'],
 ['time','Possibly time, energy or resources'],
 ['no_tradeoff','I do not see a genuine conflict'],
 ['not_choose','I should not have to sacrifice something important here']
 ],{after:'values',why:'Tests a genuine trade-off, rather than manufacturing a psychodynamic conflict.'}),
 Q('alternative','test.alternative_explanation','mechanism',
 'Which alternative explanation deserves testing before we conclude anything?',[
 ['circumstances','A real problem with circumstances or another person'],
 ['body','Sleep, health or physical capacity'],
 ['skills','A practical skill, access or information gap'],
 ['habit','A learned habit or immediate reinforcement'],
 ['expectations','A belief, standard or expectation'],
 ['identity','Something about how I understand myself'],
 ['none','There may not be an underlying psychological problem']
 ],{why:'Forces consideration of alternatives, including no hidden psychological cause.'}),
 Q('what_changes','test.prospective_test','need',
 'What real-world change would help you test the strongest explanation SAFELY?',[
 ['safe_person','Compare with someone reliable and respectful'],
 ['sleep','See whether sufficient rest changes the experience'],
 ['reduce_demand','See whether fewer demands change it'],
 ['information','Obtain a missing fact or clearer instruction'],
 ['boundary','Establish or uphold a safe boundary'],
 ['observe','Notice what happens across ordinary situations, without forcing exposure'],
 ['none','I would rather not test this through action']
 ],{why:'Connects the working formulation to a voluntary, low-risk observation, not mandatory exposure.'})
]);
const BY_ID=Object.freeze(Object.fromEntries(INVESTIGATION_QUESTIONS.map(q=>[q.id,q])));
const UNKNOWN=new Set(['unsure','other','prefer_not','unknown']);
export const newInvestigation=()=>({active:false,finished:false,answers:[]});
const chosen=(state,id)=>state?.investigation?.answers?.find(a=>a.field===id)?.answerId;
export function investigationCandidates(state){
 if(!state||state.safety||state.drill?.unsupportedCategory)return [];
 const track=state.trackId||'';
 const answers=new Set(state.investigation?.answers?.map(a=>a.field)||[]);
 return INVESTIGATION_QUESTIONS.filter(q=>!answers.has(q.id)&&
 (!q.tracks.length||q.tracks.includes(track))&&
 (!q.after||chosen(state,q.after))&&
 (!q.when||chosen(state,q.after)===q.when));
}
export function investigationQuestion(state){
 if(!state?.investigation?.active)return null;
 const q=investigationCandidates(state)[0];
 if(!q)return null;
 const leaf=state.drill?.confirmed?subtypeNode(state.drill.leafId):null;
 return {...q,prompt:q.prompt,subject:leaf?.label||state.trackId,
  questionId:'Q-NS-INVEST-'+q.id.toUpperCase()};
}
export function startInvestigation(state){
 if(!state||state.safety||state.drill?.unsupportedCategory)return state;
 return {...state,investigation:{...(state.investigation||newInvestigation()),active:true,finished:false}};
}
export function answerInvestigation(state,questionId,answerId){
 const q=investigationQuestion(state);
 if(!q||q.questionId!==questionId||!q.options.some(o=>o.id===answerId))return state;
 const answers=[...state.investigation.answers,{field:q.id,questionId:q.questionId,
  conceptId:q.concept,layer:q.layer,answerId}];
 const safety=q.id==='father_behaviour'&&answerId==='intimidation'?{
  kind:'coercion',reason:'You reported intimidation or threats. A safety-first response is more important than guessing an underlying psychological explanation.'
 }:state.safety;
 const updated={...state,safety,investigation:{...state.investigation,answers}};
 const remaining=safety?[]:investigationCandidates(updated);
 return {...updated,investigation:{...updated.investigation,
  active:remaining.length>0,finished:!remaining.length}};
}
export function backInvestigation(state){
 if(!state?.investigation?.answers?.length)return state;
 return {...state,safety:state.initialSafety||null,investigation:{...state.investigation,
  answers:state.investigation.answers.slice(0,-1),active:true,finished:false}};
}
export function stopInvestigation(state){
 if(!state?.investigation)return state;
 return {...state,investigation:{...state.investigation,active:false,finished:true}};
}
export function investigationFacts(state){
 const leaf=state?.drill?.confirmed?subtypeNode(state.drill.leafId):null;
 return (state?.investigation?.answers||[]).flatMap(answer=>{
  const q=BY_ID[answer.field],choice=q?.options.find(o=>o.id===answer.answerId);
  if(!q||!choice||UNKNOWN.has(answer.answerId))return [];
  const isAttribution=q.id==='father_label';
  return [{id:answer.questionId,conceptId:q.concept,kind:q.id,layer:q.layer,
   text:choice.label,value:answer.answerId,question:q.prompt,
   status:isAttribution?'user_interpretation':'person_reported',
   subject:leaf?.label||state.trackId,
   source:'user_selection',hypothesis:false}];
 });
}
export function investigationLinks(state){
 const fact=new Map(investigationFacts(state).map(f=>[f.kind,f]));
 const edges=[];
 const edge=(from,to,label,contrary='')=>{
  if(!fact.has(from)||!fact.has(to))return;
  edges.push({id:'invest-link:'+from+'-'+to,from:fact.get(from).id,to:fact.get(to).id,
   title:label,status:'proposed_not_causal',
   fromText:fact.get(from).text,toText:fact.get(to).text,
   evidence:[fact.get(from),fact.get(to)].map(f=>f.id),
   challenge:contrary||'This sequence alone cannot prove a cause. What changes if this factor is absent?'});
 };
 edge('event','emotion','Possible trigger → emotion','Does this feeling also arise without that event?');
 edge('emotion','interpretation','Emotion and meaning may interact');
 edge('interpretation','action','Meaning → possible response','Does the behaviour also occur when you interpret the event differently?');
 edge('action','short_term','Response → immediate observed effect','Is the effect consistent, or are there exceptions?');
 edge('short_term','long_term','Immediate effect → later consequences','Could another condition explain the longer-term outcome?');
 edge('sleep','capacity','Sleep and capacity may be related','Does adequate sleep meaningfully change this?');
 edge('environment','event','External context may influence what happens');
 edge('regulation','short_term','Regulation strategy → immediate effect','Has this been observed, or only assumed?');
 return edges;
}
export function investigationReport(state){
 return investigationFacts(state).map(f=>f.question+' — '+f.text);
}
