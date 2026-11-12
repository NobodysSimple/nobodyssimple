/* Recognition-first editorial page content for the 518 Atlas topics.
 * All text is rendered from existing guide material plus bounded, clearly
 * identified editorial lenses. There is no assessment, score, diagnosis or
 * inferred personal cause. Never substitute this for emergency support.
 */
const clean=x=>String(x??'').replace(/\s+/g,' ').trim();
const take=(arr,n)=>[...(arr||[])].filter(x=>typeof x==='string'&&clean(x)).map(clean).slice(0,n);
const distinct=items=>[...new Set(items.map(clean).filter(Boolean))];
const themeOf=domain=>{
 if(['think','behaviour','focus'].includes(domain))return 'thinking';
 if(['relate','family','social','harm','trauma','safety'].includes(domain))return 'relationship';
 if(['body','sexuality','clinical','experiences'].includes(domain))return 'health';
 if(['identity','lgbtq','culture','faith','migration','appearance'].includes(domain))return 'identity';
 if(['act','work','education','digital'].includes(domain))return 'action';
 if(['disability','neuro'].includes(domain))return 'access';
 if(['change','lifespan'].includes(domain))return 'transition';
 if(['inequality','environment'].includes(domain))return 'systems';
 if(domain==='growth')return 'growth';
 return 'feelings';
};
const RECIPES=Object.freeze({
 feelings:{
  reframe:'Strong feelings can be real and important without revealing a single, certain cause.',
  traps:[
   ['Treating the feeling as a verdict','A feeling deserves attention, but it does not automatically settle what happened or what to do.'],
   ['Trying to force a quick change','Repeatedly testing whether an emotion has disappeared can add pressure. Pausing or meeting a real need may fit better.'],
   ['Ignoring your surroundings','Sleep, health, demands, relationships and practical safety can affect how manageable an experience feels.']],
  steps:['Make sense of the situation','Notice emotional and bodily needs','Find one realistic choice','Protect support and recovery'],
  progress:['More room to choose how to respond','Less disruption to activities that matter to you','Better understanding of relevant needs','Access to rest, help or changes in circumstances']},
 thinking:{
  reframe:'A mind can keep working on a question even when more thinking is no longer producing useful information.',
  traps:[
   ['Assuming one more review will settle everything','Checking and repeated analysis sometimes bring brief relief but can keep the same question active. Some questions genuinely need action or more information.'],
   ['Treating doubt as proof of danger','Uncertainty alone does not demonstrate that the feared outcome is happening. Equally, documented risks should not be dismissed.'],
   ['Trying to control every thought','Thoughts can arise uninvited. The useful question is how you respond and whether an actual problem needs attention.']],
  steps:['Separate what is known from imagined outcomes','Understand the role of checking or avoidance','Choose a practical response when needed','Allow appropriate uncertainty and seek support'],
  progress:['Less time lost to unproductive loops','A clearer distinction between evidence and prediction','More freedom to choose actions','An easier return to valued activities']},
 relationship:{
  reframe:'Relationship difficulties can involve attachment, behaviour, expectations, power and real consequences at the same time.',
  traps:[
   ['Assuming both sides have equal responsibility','Power, coercion and actual harm matter. Communication is not always the right response or a safe first step.'],
   ['Trying to infer another person’s mind','Focus on what is observable and what you need rather than claiming certainty about hidden motives.'],
   ['Believing care requires giving up boundaries','Caring about someone does not cancel safety, consent or the right to make your own choices.']],
  steps:['Understand what happened and what is uncertain','Acknowledge needs, loss or conflicting feelings','Consider safe boundaries and options','Build support and future trust carefully'],
  progress:['Greater clarity about actions and boundaries','More options that protect your autonomy','Less pressure to settle every unknown','Support and relationships that feel safer or more workable']},
 health:{
  reframe:'Psychological, bodily and social influences can overlap, but a physical or clinical concern should not be explained away as stress.',
  traps:[
   ['Assuming one explanation fits everything','Symptoms can have multiple contributors. New or changing concerns may need appropriate assessment.'],
   ['Mistaking constant monitoring for safety','Some checking is useful; repeated monitoring can also increase distress in certain circumstances.'],
   ['Treating rest or access needs as failure','Energy, pain, disability, support and practical constraints matter when choosing an action.']],
  steps:['Clarify the experience and its impact','Check medical and practical needs','Choose a tolerable adjustment, if appropriate','Review support and functioning over time'],
  progress:['More suitable care or access to information','Improved fit between activities and available capacity','Less disruption or better accommodation','More informed decisions rather than perfect symptom control']},
 identity:{
  reframe:'Identity, preference and culture are not problems to cure. Difficulty may arise from uncertainty, other people’s responses or limited freedom to choose.',
  traps:[
   ['Treating uncertainty as a disorder','Exploration does not demand an immediate label, disclosure or decision.'],
   ['Making yourself responsible for prejudice','Hostility and exclusion are choices and structures outside the affected person.'],
   ['Assuming one acceptable way to belong','A community, belief or identity can be meaningful in different ways to different people.']],
  steps:['Listen to your own understanding','Notice expectations and environmental pressures','Protect choice, privacy and meaningful expression','Find community or support on your own terms'],
  progress:['Greater clarity or comfort with uncertainty','More room for self-directed choice','Improved access, recognition or belonging','Less pressure to meet someone else’s timetable']},
 action:{
  reframe:'Difficulty taking action is not automatically a lack of willpower. Clarity, energy, resources, safety and task design affect what is feasible.',
  traps:[
   ['Prescribing effort without checking capacity','More pressure rarely solves an inaccessible task or missing resources.'],
   ['Waiting for certainty before every step','Where safe, a small reversible action may offer useful information; sometimes waiting is reasonable.'],
   ['Turning every setback into a personal verdict','A blocked attempt may reveal a practical barrier that needs changing.']],
  steps:['Define the real task and constraints','Adjust demands or clarify a small step','Choose an optional action or rest','Use the result to revise your plan'],
  progress:['A clearer next step or decision','More realistic demands and accommodations','Less time spent on unworkable strategies','Support or tools that make participation possible']},
 access:{
  reframe:'A difficulty may reflect a poor fit between a person and their environment, not an individual deficit to be corrected.',
  traps:[
   ['Treating difference as a failure','Neurodivergence or disability does not itself prescribe an emotional or behavioural goal.'],
   ['Expecting the person to adapt alone','Reasonable adjustments, accessible communication and institutional responsibility matter.'],
   ['Equating one strategy with universal access','Supports need to fit individual preferences, capacity, health and context.']],
  steps:['Describe the specific access need','Check environmental and social barriers','Find a workable accommodation','Revisit support, rights and autonomy'],
  progress:['Better access and reduced avoidable demands','More choice about ways to participate','Improved understanding from other people','A sustainable balance of activity and rest']},
 transition:{
  reframe:'Change and loss can alter routines, roles, hopes and a sense of what comes next; there is no single timetable for adjustment.',
  traps:[
   ['Demanding a fixed deadline for recovery','Grief and adjustment do not run to one predictable schedule.'],
   ['Confusing remembering with not progressing','Continuing attachment or sadness is not, by itself, evidence that nothing has changed.'],
   ['Expecting to feel grateful for every change','Positive and painful aspects can coexist. Concrete losses and needs still deserve attention.']],
  steps:['Name what has changed or been lost','Make room for mixed responses','Identify what remains possible or needs support','Rebuild routines and meaning at your own pace'],
  progress:['More flexibility around difficult reminders','Support for concrete changes and losses','Room for connection, rest and future choices','Less pressure to follow someone else’s schedule']},
 systems:{
  reframe:'When institutions, resources or unsafe environments shape an experience, self-help alone cannot be expected to fix the conditions.',
  traps:[
   ['Turning a structural barrier into self-blame','Costs, rules, discrimination and power differences are not automatically individual shortcomings.'],
   ['Assuming everything is within personal control','Some remedies require other people, services, employers or institutions.'],
   ['Ignoring safety and practical constraints','A person may be unable to act without risking resources, stability or privacy.']],
  steps:['Name the actual external condition','Distinguish personal options from institutional responsibility','Explore accessible support or safer changes','Define progress by rights, resources and functioning'],
  progress:['A clearer account of the barrier','Better access to adjustments or support','More informed decisions about available options','Changed conditions rather than forced positivity']},
 growth:{
  reframe:'Wanting connection, enjoyment or purpose is a valid goal, but growth does not need to become another obligation.',
  traps:[
   ['Turning every day into a performance test','A meaningful life does not require constant self-improvement.'],
   ['Comparing your timeline with somebody else’s','Resources, context and priorities differ across people.'],
   ['Equating discomfort with failure','Learning and meaningful choices can coexist with uncertainty or mixed feelings.']],
  steps:['Clarify what you actually value','Notice opportunities and practical limits','Choose voluntary experiences or relationships','Reflect on what feels meaningful, including rest'],
  progress:['More opportunities to do what matters','Greater room for choice and connection','Recognition of strengths and access needs','A sustainable approach that includes rest']}
});
const extraFaq={
 relationship:[
  ['Why can I have contradictory feelings?','Care, anger, grief, uncertainty and attachment can coexist. Feelings do not prove that a relationship is safe or unsafe by themselves.'],
  ['Do I need to talk to the other person?','No. A conversation is optional and should only happen when it is safe and useful. You can also seek support independently.']],
 thinking:[
  ['Why does the thought return?','Some concerns are unresolved, while others recur through attention, uncertainty or checking. This page cannot determine which applies to you.'],
  ['Do I need total certainty before moving on?','Not always. The goal is enough reliable information for an appropriate decision, while still responding to any real risk.']],
 health:[
  ['Does this mean it is psychological?','No. Physical, medical and environmental explanations need consideration; new, severe or changing symptoms should be assessed appropriately.']],
 identity:[
  ['Do I need to choose a label?','No. Identity, preferences and beliefs can be explored without a deadline, forced disclosure or treatment goal.']],
 access:[
  ['Should I try harder to fit in?','Not necessarily. Accessibility often requires changes in the environment, the task, or the support available—not simply more effort from you.']],
 systems:[
  ['Is this something I should fix alone?','Often not. The situation may require institutional action, legal protections, support or changed material conditions.']]
};
const BETRAYAL=Object.freeze({
 recognise:[
 'I keep revisiting what happened, looking for gaps in the story.',
 'I question what I once believed about the relationship.',
 'I feel foolish for trusting them, even though I did not make their choices.',
 'I may miss them and still know that I was hurt.'
 ],
 reframe:'Betrayal can involve several losses at once: a relationship, a trusted account of events, a sense of safety, and confidence in your own judgment. Not everyone experiences all four.',
 core:[
 {label:'Relationship loss',detail:'The person or relationship you valued may no longer feel like the one you knew.'},
 {label:'Certainty about events',detail:'Conflicting information can leave you unsure what was true or what remains unknown.'},
 {label:'Sense of safety',detail:'Trust in this person, or sometimes in others, may feel less secure.'},
 {label:'Confidence in your judgment',detail:'You may revisit what you noticed or missed, without that making you responsible for another person’s decisions.'}
 ],
 profileQuestion:'Which parts of the betrayal are affecting you?',
 traps:[
 ['I need just one more answer','More information can sometimes help. But if answers are unavailable or unreliable, repeated searching can become costly; closure need not require perfect certainty.'],
 ['They must validate what happened','Accountability may matter and may be worth pursuing safely. Your understanding and support need not depend entirely on their agreement.'],
 ['I should have recovered by now','Adjustment has no universal timetable, especially when safety, loss and future plans have changed.'],
 ['Thinking about them means I am stuck','The frequency of a thought matters less than its impact on your choices, sleep, safety and daily life.']
 ],
 steps:[
 ['Understand enough','Separate what is known, disputed and uncertain; avoid forcing a complete explanation.'],
 ['Acknowledge the impact','Notice grief, anger, care, fear or numbness without prescribing the emotion you should feel.'],
 ['Rebuild self-trust','Look at what you knew at the time, what choices belonged to others and what boundaries you want now.'],
 ['Choose future trust carefully','Use observed behaviour, time, reciprocity and safety—not blind trust or permanent suspicion.']
 ],
 progress:[
 'Less pressure to obtain an impossible final explanation',
 'More clarity about what you believe and what you do not know',
 'Better boundaries and trust in your own choices',
 'More space for other relationships, rest and meaningful activities'
 ],
 faq:[
 ['Why do I still miss someone who hurt me?','Attachment and grief do not switch off the moment trust changes. Missing someone does not mean their behaviour was acceptable.'],
 ['Do I need to forgive them?','No. Forgiveness, accountability, reconciliation and moving forward are separate choices.'],
 ['What if they never admit it?','Their account may never become reliable or complete. You can still use what you know to decide what support and boundaries you need.'],
 ['Will I trust again?','Many people rebuild trust over time, but nobody can promise how or when. Trust can be informed by evidence, safety and reciprocal behaviour.'],
 ['Why do I keep replaying the story?','Unresolved questions and powerful emotions may draw attention back to events. Replaying does not establish the cause or prove that any particular diagnosis applies.']
 ],
 closing:'The aim is not to erase what happened or persuade yourself it was acceptable. You can make room for this experience without letting it decide every part of what comes next.'
});
const normalizeDomain=g=>g.topicDomain||'feel';
const lensFor=g=>RECIPES[themeOf(normalizeDomain(g))]||RECIPES.feelings;
const isBetrayal=g=>g.optionId==='betrayal-trauma';
const isHighRisk=g=>Boolean(g.safetyFirst||g.supportFirst);
function coreFromGuide(g){
 const candidates=(g.mechanisms||[]).filter(m=>clean(m.label)&&clean(m.detail))
  .map(m=>({label:clean(m.label),detail:clean(m.detail)}));
 const others=(g.contributors||[]).filter(Boolean).map(x=>({
  label:clean(x),detail:'This may be relevant in some situations; a description alone cannot establish whether it applies to you.'
 }));
 const result=[...candidates,...others];
 const fallback=[
  {label:'What is happening',detail:clean(g.what)||'Start with what is actually happening.'},
  {label:'What affects it',detail:'Circumstances, people, health and available resources can matter.'},
  {label:'What you need',detail:'Different people may need different kinds of care, information or adjustment.'},
  {label:'What comes next',detail:'A realistic choice might be an action, rest, support or simply more information.'}
 ];
 for(const item of fallback)if(result.length<4)result.push(item);
 return distinct(result.map(c=>c.label)).slice(0,4).map(label=>result.find(x=>x.label===label));
}
function profileFor(g,core){
 // The page uses an unscored descriptive map, not a symptom inventory.
 return core.map((x,i)=>({
  id:'lens-'+i,
  label:x.label.length>54?x.label.slice(0,51)+'…':x.label,
  detail:x.detail
 }));
}
function recognitionFor(g){
 if(isBetrayal(g))return BETRAYAL.recognise;
 const variants=take(g.variants,3).filter(x=>!/^I want to understand this without/i.test(x));
 const signs=take(g.recognise,4);
 const pool=g.contextFirst?[...variants,...signs]:[...signs,...variants];
 return distinct(pool).slice(0,4);
}
function supportFor(g){
 if(g.safetyFirst)return 'If there is immediate danger, serious self-harm risk or an urgent health concern, prioritise human help now. In the UK call 999 for immediate danger; NHS 111 can direct urgent non-emergency care. Confidential specialist support may be safer than a web exercise.';
 if(g.medical)return 'If symptoms are new, severe, changing, physically concerning or affect daily functioning, seek an appropriate healthcare assessment. Do not presume the cause is psychological.';
 if(g.supportFirst)return 'When another person is threatening, controlling or monitoring you, focus on confidential and practical support. Avoid unsafe confrontation or recording sensitive details on a shared device.';
 if(['identity','access','systems'].includes(themeOf(normalizeDomain(g))))
  return 'Support may mean accessible services, community connections, reasonable adjustments or institutional change—not necessarily therapy.';
 return 'If this is persistent, worsening, affecting everyday functioning, or difficult to manage safely, a trusted person or appropriate professional support may help.';
}
function faqFor(g,lens,overrides){
 if(overrides?.faq)return overrides.faq;
 const topic=clean(g.title).replace(/[.!?]+$/,'');
 const family=themeOf(normalizeDomain(g));
 const defaults=[
  ['Does this description tell me exactly what is happening?','No. '+topic+' is a starting point for understanding your experience. Context, personal history, physical health and other explanations may matter.'],
  ['What if I recognise only some of this?','You do not need to match every example. People can experience similar situations in different ways; you may also decide this page does not fit.'],
  ['What if none of these tools helps?','That is useful feedback about the fit of the tool, not a personal failure. Rest, practical changes or a different kind of support may be more appropriate.'],
  ['How will I know what matters next?','Focus on accurate understanding, safety, practical needs and activities you value rather than achieving a perfect emotion or score.']
 ];
 return [...(extraFaq[family]||[]),...defaults].slice(0,5);
}
export function topicPageModel(g){
 if(!g||g.kind!=='topic')return null;
 const recipe=lensFor(g),specific=isBetrayal(g)?BETRAYAL:null;
 const core=specific?.core||coreFromGuide(g);
 const context=Boolean(g.contextFirst);
 const support=isHighRisk(g);
 const summary=specific?.reframe||recipe.reframe;
 const questions=recognitionFor(g);
 const goals=specific?.steps||recipe.steps.map((label,i)=>[
  label,
  (g.goals||[])[i]||clean(g.mechanisms?.[i]?.target)||'Take only the steps that fit your situation.'
 ]);
 const steps=goals.map((x,i)=>Array.isArray(x)?{label:x[0],detail:x[1]}:
  ({label:x,detail:clean((g.goals||[])[i])||clean(g.mechanisms?.[i]?.target)||'Choose what is realistic, safe and meaningful to you.'}));
 const faq=faqFor(g,recipe,specific);
 const published=g.publishedRecord?.status==='published'?g.publishedRecord:null;
 const editedCore=core.slice(0,4).map((part,i)=>{
  const candidate=published?.core?.[i];
  return candidate?.label&&candidate?.detail?candidate:part;
 });
 const editedSteps=steps.slice(0,4).map((part,i)=>{
  const candidate=published?.steps?.[i];
  return candidate?.label&&candidate?.detail?{label:candidate.label,detail:candidate.detail}:part;
 });
 const editedFaq=published?.faq?.some(x=>x.q&&x.a)?
  published.faq.filter(x=>x.q&&x.a).map(x=>[x.q,x.a]):faq;
 return Object.freeze({
  id:g.optionId,kind:themeOf(normalizeDomain(g)),title:published?.title||g.title,
  recognition:published?.recognition?.length?published.recognition:questions,
  reframe:published?.reframe||summary,cycle:context?'':clean(g.cycle),core:Object.freeze(editedCore.slice(0,4)),
  profile:Object.freeze([]),profileQuestion:'',
  traps:Object.freeze(published?.traps?.some(x=>x.label&&x.detail)?
    published.traps.filter(x=>x.label&&x.detail).map(x=>[x.label,x.detail]):specific?.traps||recipe.traps),
  steps:Object.freeze(editedSteps),
  progress:Object.freeze(published?.progress?.length?published.progress:specific?.progress||recipe.progress),
  faq:Object.freeze(editedFaq),
  guidedPrompts:Object.freeze(published?.guidedPrompts||[]),
  supportText:published?.supportText||supportFor(g),
  closing:published?.closing||specific?.closing||
   (context?'You do not have to turn an identity, difference or difficult circumstance into a personal problem to earn support. Start with what matters to you.':
   'The goal is not to become someone who never struggles. It is to understand what is happening more clearly and have more room for safe, meaningful choices.'),
  contextFirst:context,medical:Boolean(g.medical),supportFirst:support,
  caution:clean(g.cautions?.[0]),sourceStatus:context?
   'Editorial overview: this topic does not yet have an individual evidence review. The examples and questions are not diagnostic or validated treatment tools.':
   'Educational overview: explanations are possibilities, not a diagnosis or proof of an individual cause.'
 });
}
