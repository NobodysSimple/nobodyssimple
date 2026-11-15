/* Nobody's Simple · Individually grounded extensions to the 74 Family, Harm & Systems manuals.
 * Existing 10-paragraph articles are retained; scenario-based prompts,
 * personal explanations and practical support now use authored topic data.
 * These examples describe possibilities, not diagnoses or proof of motives.
 */
import {FHS_CONTEXT_FAMILY} from './ns-fhs-context-family.mjs';
import {FHS_CONTEXT_HARM} from './ns-fhs-context-harm.mjs';
import {FHS_CONTEXT_INEQUALITY} from './ns-fhs-context-inequality.mjs';
import {FHS_CONTEXT_ENVIRONMENT} from './ns-fhs-context-environment.mjs';
import {FHS_SUPPORT_FAMILY_A} from './ns-fhs-support-family-a.mjs';
import {FHS_SUPPORT_FAMILY_B} from './ns-fhs-support-family-b.mjs';
import {FHS_SUPPORT_HARM} from './ns-fhs-support-harm.mjs';
import {FHS_SUPPORT_INEQUALITY} from './ns-fhs-support-inequality.mjs';
import {FHS_SUPPORT_ENVIRONMENT} from './ns-fhs-support-environment.mjs';

const contexts={...FHS_CONTEXT_FAMILY,...FHS_CONTEXT_HARM,...FHS_CONTEXT_INEQUALITY,...FHS_CONTEXT_ENVIRONMENT};
const support={...FHS_SUPPORT_FAMILY_A,...FHS_SUPPORT_FAMILY_B,...FHS_SUPPORT_HARM,...FHS_SUPPORT_INEQUALITY,...FHS_SUPPORT_ENVIRONMENT};
const countContext=Object.keys(contexts).length;
if(countContext!==74||Object.keys(support).length!==74)throw new Error('All 74 FHS topics require authored contextual and support content');

const clean=s=>String(s||'').trim().replace(/[.!?]+$/,'');
const domainQuestion={
 family:'Who in the family made the decision, and whose needs were left out?',
 harm:'What did the other person actually do, and what danger or restriction remains?',
 inequality:'Which material resource, institutional rule or practical option determined what happened?',
 environment:'Which event, official decision or environmental condition was outside your control?'
};
const domainNext={
 family:'What safe boundary, conversation or practical support could address the actual family relationship?',
 harm:'Which form of confidential protection could help without alerting or confronting the person?',
 inequality:'Which independent service or material change could address the problem rather than only the feeling?',
 environment:'What accurate information or feasible individual or collective response would matter here?'
};
const domainFunction={
 family:'Family roles and past expectations may explain why this moment carries weight. The people involved still remain responsible for their current behaviour.',
 harm:'The other person’s conduct, consent and risk take priority. Surviving or complying under pressure does not make the affected person responsible for abuse.',
 inequality:'Economic conditions and institutional decisions can restrict choices even when a person makes reasonable efforts. Emotional support cannot replace essential resources.',
 environment:'A public or environmental concern may reflect a real hazard or loss. Information and practical collective action may matter more than changing an interpretation.'
};
const domainEmotion={
 family:'You may feel hurt or conflicted. Only you can decide which feeling fits.',
 harm:'Fear, confusion or numbness are all possible. There is no required emotional response to harm.',
 inequality:'Shame or frustration may arise from an unequal or materially difficult situation.',
 environment:'Concern, grief or anger may be understandable responses to a real-world problem.'
};
const domainRule={
 family:'A repeated family role may influence this moment; a single example cannot establish everyone's intentions.',
 harm:'An account of the harmful conduct matters more than guessing why the person did it.',
 inequality:'Resource shortages and unequal treatment must not be dismissed as failures of personal motivation.',
 environment:'A real threat deserves proportionate evidence and safety action, not forced optimism.'
};
const safeQuestion=(domain,scene,thought,profile)=>domain==='harm'
 ?'If it is safe to reflect, does this situation resemble a concern you have: '+clean(scene)+'? You can skip the details.'
 :domain==='inequality'?'Does this practical situation resemble something you are facing: '+clean(scene)+'? What resources were available?'
 :domain==='environment'?'Which part of this example resembles your concern: '+clean(scene)+'? What information is reliable?'
 :'Have you encountered a family situation like this: '+clean(scene)+'? What happened in your own experience?';
function routeQuestions(g,domain,i,scene,thought){
 const profile=g.profiles[i],q1=safeQuestion(domain,scene,thought,profile);
 const q2=domain==='harm'
   ?'What actual behaviour affected your safety or freedom? You do not need to identify anyone.'
   :domain==='inequality'
   ?'What was the material consequence, and which decision or resource created it?'
   :domain==='environment'
   ?'What has actually happened, and which claims remain uncertain?'
   :'What did the family members actually say or do, and what did you understand from it?';
 const q3=domainQuestion[domain];
 const q4=domainNext[domain];
 return [[q1,profile[1],profile[1],''],[q2,'The example does not establish a motive. Start with what can be observed.',g.article[(i+3)%10],''],
  [q3,domainFunction[domain],g.safety,''],[q4,g.now.steps[i%3],g.now.steps[i%3],'actions']];
}
function whyQuestions(g,domain,scenes){
 return [
  safeQuestion(domain,scenes[0][0],scenes[0][1],g.profiles[0]),
  'What did you observe rather than assume when a situation resembled this: '+clean(scenes[1][0])+'?',
  'How was your autonomy or wellbeing affected in a situation like this: '+clean(scenes[2][0])+'?',
  'Which other people or services were involved in an experience resembling this: '+clean(scenes[3][0])+'?',
  'What did you do immediately afterwards, and was that response necessary to protect yourself?',
  'Which practical need has been hardest to meet in the situation you are considering?',
  domain==='harm'?'What repeated actions, threats or power differences create the risk now?'
   :domain==='inequality'?'What expectations have been placed on you despite the resources actually available?'
   :domain==='environment'?'What is known about the wider problem, and what remains uncertain?'
   :'What expectations about your place in the family might be shaping your decisions?',
  'Which limits on your choices are real, including money, access or the behaviour of others?',
  'What would a safer or fairer outcome involve, even if another person never agrees with your interpretation?',
  domainNext[domain]
 ];
}
function enrichedCases(g,domain,scenes){
 return g.whyCases.map((old,n)=>{
  const i=Math.floor(n/4),j=n%4,anchor=scenes[i],isAuthored=j===0;
  const situation=isAuthored?anchor[0]:old.situation;
  const interpretation=isAuthored?anchor[1]:
   domain==='harm'?'The observable conduct deserves assessment: '+g.profiles[i][1]:
   domain==='inequality'?'A material or institutional condition may be involved: '+g.profiles[i][1]:
   domain==='environment'?'A real-world change may help explain the concern: '+g.profiles[i][1]:
   'One family expectation worth examining is: '+g.profiles[i][1];
  const targetedAction=g.now.steps[i%3];
  return {...old,situation,interpretation,emotion:domainEmotion[domain],
   response:domain==='harm'?'An immediate protective response may be necessary if risk is current.':
    'A response may depend on the resources and relationships available to this person.',
   function:domainFunction[domain],need:g.profiles[i][0],
   rule:domainRule[domain],adaptation:g.profiles[i][1],
   alternative:targetedAction,action:targetedAction,root:'path-'+i};
 });
}
function supportiveIdeas(g,domain,scenes){
 const written=support[g.id];
 const extras=[
  ...g.now.steps,
  ...g.routes.map(r=>r.practice),
  ...scenes.map((scene,i)=>domain==='harm'
   ?'Seek a confidential safety assessment if a situation like this is ongoing: '+clean(scene[0])+'.'
   :domain==='inequality'
   ?'Ask for help with the practical limitation illustrated here: '+clean(scene[0])+'.'
   :domain==='environment'
   ?'Check reliable local information relevant to this situation: '+clean(scene[0])+'.'
   :'Discuss the actual expectation illustrated here, if it is safe: '+clean(scene[0])+'.'),
  ...scenes.map(scene=>domain==='harm'
   ?'Consider whether the conduct shown here is continuing and whether specialist help is needed: '+clean(scene[0])+'.'
   :domain==='family'?'If a similar family interaction occurs, decide beforehand what support would be safe: '+clean(scene[0])+'.'
   :'Identify an organisation able to respond to the concern illustrated by: '+clean(scene[0])+'.'),
  ...g.profiles.map(p=>domain==='harm'
   ?'Discuss specialist protection for '+p[0].toLowerCase()+' with a confidential service.'
   :'Consider what practical change would address '+p[0].toLowerCase()+' in your circumstances.'),
  ...g.profiles.map(p=>domain==='harm'
   ?'Ask a safety specialist about resources that could reduce the risks associated with '+p[0].toLowerCase()+'.'
   :domain==='inequality'?'Find independent advice about the material conditions involved in '+p[0].toLowerCase()+'.'
   :domain==='environment'?'Identify the reliable information needed to understand '+p[0].toLowerCase()+'.'
   :'Choose a trusted person with whom to discuss '+p[0].toLowerCase()+', without forcing reconciliation.'),
  'Read the linked reference for additional information: '+g.sources[0][0]+'.'
 ];
 // Carefully place independently written options first. The rest are
 // transparent scenario-specific reflection choices, not invented treatments.
 const options=[...written,...extras];
 const unique=[...new Set(options)];
 if(unique.length<24)throw Error('Not enough practical options: '+g.id);
 return {actions:unique.slice(0,24),support:unique.slice(0,24)};
}
export function enrichFhsGuide(g,domain){
 const context=contexts[g.id],written=support[g.id];
 if(!context||!written||context.cases?.length!==4||written.length!==(domain==='family'?8:4))throw new Error('Missing family/harm/systems authorship: '+g.id);
 if(context.cases.some(c=>c.length!==2||c[0].length<35||c[1].length<12))throw new Error('Thin situation: '+g.id);
 const routes=g.routes.map((r,i)=>({...r,
  description:g.profiles[i][1]+' Example: '+clean(context.cases[i][0])+'.',
  questions:routeQuestions(g,domain,i,...context.cases[i]),
  practice:written[i],
  finish:written[i],
  practiceTitle:'A practical option to consider'
 }));
 const cases=enrichedCases(g,domain,context.cases);
 if(cases.length!==16||new Set(cases.map(c=>c.situation)).size!==16)throw new Error('Repeated worked situation: '+g.id);
 const noPersist=domain==='harm'||g.id==='family-financial-dependence'||g.id==='controlling-parenting'||g.id==='co-parenting-conflict';
 return Object.freeze({...g,
  readTitle:g.title,
  whyIntro:context.intro,
  routes,
  whyQuestions:whyQuestions(g,domain,context.cases),
  whyCases:cases,
  noPersist,
  ideas:supportiveIdeas(g,domain,context.cases),
  evidence:domain==='harm'?
   'These are optional examples for recognising conduct and considering safety. They do not diagnose the person responsible. You do not have to share details, confront anyone or complete a journal to seek confidential help.':
   domain==='inequality'?'Financial and institutional conditions may cause real hardship. This manual does not treat structural inequality as faulty thinking; use the linked services for relevant practical guidance.':
   domain==='environment'?'Public hazards and collective harms may be real. Consider credible sources, current local conditions and practical support before deciding what action is appropriate.':
   'Family patterns can influence experience, but a short account cannot establish motives or one childhood cause. Your current safety and freedom to choose remain central.'
 });
}
