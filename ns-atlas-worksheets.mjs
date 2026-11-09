/* Every atlas topic has an addressable worksheet. The questions are chosen by
 * situation, maintaining process and risk, rather than by therapy brand. */
import {atlasProfile,isSafetyPriority} from './ns-atlas-core.mjs';
import {resolveProblemToolId} from './ns-problem-map.mjs';
const types={
 emotion:{
 title:'Emotion, need and response map',
 intro:'Notice the emotion and what it may be communicating, without treating it as proof of a particular interpretation.',
 prompts:[
  'What happened just before the feeling became noticeable?',
  'What feeling, need or value seems most relevant?',
  'Which part is an observation, and which part is my interpretation?',
  'What is one compassionate, proportionate response I could choose?'
 ],how:'Name the emotion, separate evidence from interpretation, then choose one action that meets the relevant need.',tool:'emotion-check-in'
 },
 evidence:{
 title:'Observation and interpretation worksheet',
 intro:'Distinguish what happened from the meaning attributed to it, without discounting genuine harm or danger.',
 prompts:[
  'What can I directly observe about this particular situation?',
  'What meaning or prediction have I added?',
  'What evidence supports and challenges that interpretation?',
  'Which additional fact or safe action would help me decide what to do?'
 ],how:'Use facts, interpretations, unknowns and an appropriate next step.',tool:'reality-map'
 },
 pattern:{
 title:'Trigger → response → short-term effect',
 intro:'Identify a possible loop, including what a response achieves immediately and what it costs later.',
 prompts:[
  'What tends to trigger the pattern in this situation?',
  'What do I do next (including avoidance or withdrawal)?',
  'What changes immediately when I respond that way?',
  'What may be the longer-term effect, and what is one alternative response?'
 ],how:'Map the sequence before choosing an intervention; do not assume it is the only explanation.',tool:'pattern-map'
 },
 systems:{
 title:'Demands, opportunities and resources',
 intro:'Examine whether external constraints, accessibility or support need to change rather than asking the individual to try harder.',
 prompts:[
  'Which circumstances or demands make this specific situation difficult?',
  'What is within my control, what is shared, and what belongs to another person or system?',
  'Which realistic adjustment, resource or support would change the situation?',
  'What is one safe step toward that adjustment, or what help is needed to pursue it?'
 ],how:'Separate individual coping options from genuine opportunities for practical or institutional change.',tool:'context-map'
 },
 checking:{
 title:'When does checking add useful information?',
 intro:'Differentiate reasonable safety checks from repeated checking that provides only brief reassurance.',
 prompts:[
  'What uncertainty or concern triggers checking here?',
  'What information did the last check actually add?',
  'How long did relief last, and did the question return?',
  'What would count as enough information, while keeping necessary safety checking?'
 ],how:'Do not delay medically appropriate checks or safety action.',tool:'certainty'
 },
 action:{
 title:'The smallest workable action',
 intro:'Explore whether lack of clarity, capacity or reward is the main obstacle.',
 prompts:[
  'Which exact action am I finding difficult?',
  'What makes that action hard (clarity, time, fear, energy, environment or resources)?',
  'What would a two-minute first step look like, if a step is appropriate?',
  'What adjustment or support would make the step more realistic?'
 ],how:'Make the step observable, then review whether the obstacle actually changed.',tool:'small-step'
 },
 experiment:{
 title:'A safe, low-stakes prediction test',
 intro:'A behavioural experiment explores a prediction; it is not an obligation to face danger or endure harm.',
 prompts:[
  'Which prediction is making this specific situation difficult?',
  'What is a low-stakes, voluntary way to collect relevant information safely?',
  'What did I predict, and what would count as evidence in either direction?',
  'What result would challenge or strengthen my original interpretation?'
 ],how:'Choose only a safe and suitable experiment, and compare predictions with observed outcomes.',tool:'experiment-builder'
 },
 conversation:{
 title:'A conversation or boundary builder',
 intro:'When it is safe to communicate, express observations, needs and requests without assuming that another person will agree.',
 prompts:[
  'Which concrete behaviour or interaction concerns me?',
  'How does it affect me, and which need or boundary is relevant?',
  'What could I say clearly, respectfully and without mind-reading?',
  'If the other person does not agree, what action or support is within my control?'
 ],how:'Do not use direct confrontation where coercion, threats or retaliation are present.',tool:'conversation-map'
 },
 health:{
 title:'Health context and appropriate support',
 intro:'Physical and unusual experiences can have many causes. A brief website exercise cannot establish a diagnosis.',
 prompts:[
  'What exactly is changing, when did it begin, and how is functioning affected?',
  'What physical, sleep, medication or environmental factors may be relevant?',
  'Which symptoms are new, urgent or significant enough to discuss with a professional?',
  'Who can provide appropriate assessment or support, and what information would I want to share?'
 ],how:'Seek urgent help for acute or severe symptoms. Do not treat the worksheet as a medical test.',tool:'state-check'
 },
 values:{
 title:'Values, expectations and real choices',
 intro:'Clarify what matters while considering safety and social constraints on what can be expressed.',
 prompts:[
  'What parts of this situation matter most to me?',
  'Which expectations come from myself and which from other people?',
  'What would I choose if I had adequate information and autonomy?',
  'What small, safe step could better reflect my values or needs?'
 ],how:'A person need not disclose identity or preferences when that would be unsafe.',tool:'values-discovery'
 },
 rumination:{
 title:'From repetitive thought to useful reflection',
 intro:'Explore whether reviewing an event is creating a decision or simply repeating distress.',
 prompts:[
  'Which question am I repeatedly returning to?',
  'What new information, if any, has the most recent review provided?',
  'Is the question solvable, uncertain or outside my control?',
  'What bounded reflection or concrete next step would be more useful?'
 ],how:'Short, constructive reflection differs from repeating a question indefinitely.',tool:'rumination'
 },
 sleep:{
 title:'Sleep context and possible maintaining factors',
 intro:'Notice patterns, pressure and environmental constraints without prescribing sleep restriction or assuming that sleep difficulties are purely psychological.',
 prompts:[
  'Is the main problem falling asleep, staying asleep, waking early or feeling unrefreshed?',
  'Which physical, scheduling, environmental or emotional factors may contribute?',
  'Does clock watching or pressure to sleep increase alertness?',
  'What practical change or professional assessment may be worth considering?'
 ],how:'Persistent or unusual sleep symptoms, significant daytime sleepiness or breathing symptoms warrant medical review.',tool:'state-check'
 },
 safety:{
 title:'Safety and support plan',
 intro:'Focus on immediate safety, practical options and trusted human support. This is not a self-treatment exercise.',
 prompts:[
  'What is the immediate concern or danger, without sharing more than feels safe?',
  'Where or with whom would I be safer right now?',
  'Which trusted person, emergency service or professional could help?',
  'What practical step can reduce immediate risk without confrontation or delay?'
 ],how:'In the UK call 999 for immediate danger; for urgent mental health support contact NHS 111 and select the mental health option.',tool:'context-map'
 }
};
export const worksheetKinds=Object.freeze(Object.keys(types));
const primaryTypeByDomain={feel:'emotion',think:'rumination',act:'action',relate:'conversation',body:'health',identity:'values',focus:'action',change:'values',work:'systems',experiences:'health',safety:'safety'};
export function worksheetFor(id,selection={}){
 const p=atlasProfile(id);if(!p)return null;
 const m=p.maintainers.find(x=>x.id===selection.maintainer);
 const isRisk=isSafetyPriority(id);
 const kind=isRisk?'safety':m?.worksheet||primaryTypeByDomain[p.domain]||'pattern';
 const template=types[kind]||types.pattern;
 const variation=p.variants[Number(String(selection.variant||'').replace(/^v/,''))];
 const situation=selection.customSituation?.trim()||variation||'the situation you are investigating';
 const factors=p.contributors.filter(c=>(selection.contributors||[]).includes(c.id)).map(c=>c.label);
 const promptPrefix='For '+situation.toLowerCase()+': ';
 const prompts=template.prompts.map((question,i)=>i===0?promptPrefix+question:question);
 return {id:p.id,kind,title:template.title,intro:template.intro,how:template.how,
  prompts,situation,maintainer:m?.label||'not yet selected',contributors:factors,
  relatedTool:resolveProblemToolId(template.tool),topicTool:'#tool/atlas-'+p.id,risk:isRisk};
}
export function worksheetText(spec,answers=[]){
 if(!spec)return '';
 return ['Nobody’s Simple · Personal worksheet',spec.title,'Problem: '+spec.id,
  'Specific situation: '+spec.situation,'Possible maintainer: '+spec.maintainer,
  'Contributors selected: '+(spec.contributors.join(', ')||'Not selected'),'',
  ...spec.prompts.flatMap((prompt,i)=>[String(i+1)+'. '+prompt,String(answers[i]||''),'']),
  'Context: '+spec.intro,'Important: '+spec.how,
  'This worksheet records personal hypotheses, not a diagnosis or verified causal relationships.'].join('\n');
}
