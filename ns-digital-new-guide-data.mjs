/* Nobody's Simple · 15 missing Digital life & online harms manuals.
 * Individually authored articles, recognition pathways and safety-sensitive
 * practical choices. Existing Cyberbullying manual remains untouched.
 */
import {DIGITAL_EDITORIAL_A} from './ns-digital-editorial-a.mjs';
import {DIGITAL_EDITORIAL_B} from './ns-digital-editorial-b.mjs';
import {DIGITAL_EDITORIAL_C} from './ns-digital-editorial-c.mjs';
import {INCLUSIVE_GROUPS_B} from './ns-inclusive-topics-b.mjs';

const manuscripts=Object.freeze([...DIGITAL_EDITORIAL_A,...DIGITAL_EDITORIAL_B,...DIGITAL_EDITORIAL_C]);
const digital=INCLUSIVE_GROUPS_B.find(g=>g.id==='digital');
const titles=new Map(digital?.rows?.map(r=>[r[0],r[1]])||[]);
const pending=new Set([...titles.keys()].filter(id=>id!=='cyberbullying'));
const wc=x=>String(x).trim().split(/\s+/).filter(Boolean).length;
const trim=s=>String(s||'').trim().replace(/[.!?]+$/,'');
const first=x=>String(x).split(/(?<=[.!?])\s+/)[0]||String(x);
const fail=(id,reason)=>{throw new Error('Digital guide '+id+': '+reason)};
const stepNames=Object.freeze([
 'What happened online','The particular conduct or feature','What was at stake',
 'The response you noticed','What you did next','What it helped you manage',
 'The expectation affecting your choice','The evidence or settings involved',
 'The available protection or support','A safe next step'
]);
const higherRisk=new Set(['online-harassment','online-privacy','online-dating-distress',
 'online-friendship-conflict','pornography-related-distress','pornography-expectations',
 'online-radicalisation-concern','nonconsensual-digital-sharing']);
const danger=new Set(['online-harassment','online-privacy','online-radicalisation-concern','nonconsensual-digital-sharing']);
function build(d){
 if(!pending.has(d.id))fail(d.id,'not in the 15 missing catalogue topics');
 if(d.article?.length!==10||wc(d.article.join(' '))<400||d.article.some(p=>wc(p)<28))fail(d.id,'needs substantial individual article');
 if(d.profiles?.length!==4||d.cases?.length!==4||d.options?.length!==4||d.now?.length!==3)fail(d.id,'requires four distinct routes and three immediate steps');
 if(d.cases.some(c=>c.length!==2||c[0].length<42||c[1].length<35))fail(d.id,'missing specific circumstances');
 if(!d.source?.[1]?.startsWith('https://')||!d.safety||d.safety.length<100)fail(d.id,'missing source or safety');
 const roots=d.profiles.map((p,i)=>['path-'+i,p[0]]);
 const routes=d.profiles.map((p,i)=>{
  const scene=d.cases[i][0],thought=d.cases[i][1],action=d.options[i];
  const questions=[
   ['Have you encountered something like this: '+trim(scene)+'? What happened in your situation?',
    'This example may not fit your experience. Describe only what feels appropriate, or skip it.',
    'Start with the observable behaviour or platform condition, including who had control.',''],
   ['Did a conclusion like this occur to you: '+thought+' What do you actually know?',
    'This is a hypothetical thought, not an assumption about what you believe.',
    'Some risks are real and require protection. For other claims, identify what evidence would settle the question.',''],
   ['What is the main practical problem behind '+p[0].toLowerCase()+' in your circumstances?',
    p[1]+' Consider whether another person or platform has a responsibility to act.',
    'Check where power, consent, access and available information affect your actual choices.',''],
   ['Would the following option be safe and useful: '+trim(action)+'?',
    'You may decide it is unsuitable, seek specialist help or choose another route.',
    action,'actions']
  ];
  return {id:'path-'+i,label:p[0],title:p[0],
   description:p[1]+' Example: '+trim(scene)+'.',finish:action,practiceTitle:'A practical option',practice:action,questions};
 });
 const anchors=[0,3,6];
 const cases=d.profiles.flatMap((p,i)=>Array.from({length:4},(_,j)=>{
  const situation=j===0?d.cases[i][0]:'Under '+p[0].toLowerCase()+', consider this part of the experience: '+trim(first(d.article[(anchors[j-1]+i)%10]))+'.';
  return {situation,
   interpretation:j===0?d.cases[i][1]:'One possibility to examine: '+p[1],
   emotion:'You might feel concerned or uncertain. Which emotion, if any, actually fits is for you to decide.',
   response:'What did you do next, and what happened as a result?',
   function:'The response may have served a purpose. An online platform or other person may also carry responsibility for the situation.',
   need:p[0],rule:d.cases[i][1],
   adaptation:p[1],
   alternative:d.options[i],
   action:d.options[i],
   root:'path-'+i};
 }));
 if(new Set(cases.map(c=>c.situation)).size!==16)fail(d.id,'repeated situations');
 const whyQuestions=[
  'What specific online event makes '+d.profiles[0][0].toLowerCase()+' relevant for you?',
  'When something like this happened, what could actually be observed: '+trim(d.cases[1][0])+'?',
  'What did you understand it to mean when '+d.profiles[2][0].toLowerCase()+' appeared?',
  'How did the situation affect your everyday choices or sense of safety?',
  'What did your immediate response help you manage?',
  'Was that response solving a practical issue, or mostly buying temporary relief?',
  'Is a prediction like this affecting you: '+d.cases[3][1]+'?',
  'What evidence, consent or platform rule is relevant, and which details remain uncertain?',
  'What can another person, service or platform realistically do to help?',
  'Could this option be safe and effective here: '+trim(d.options[0])+'?'
 ];
 const extra=d.profiles.flatMap((p,i)=>[
  'Identify the specific circumstance affecting '+p[0].toLowerCase()+': '+p[1],
  'Consider the route-specific response and whether it suits your situation: '+d.options[i],
  'Check which person or service has responsibility for the concern associated with '+p[0].toLowerCase()+'.',
  'Review what happened after your response, especially whether the problem or risk was actually reduced.'
 ]);
 const ideas=[...new Set([...d.options,...d.now,...extra,'Read the linked guidance: '+d.source[0]+'.'])].slice(0,24);
 if(ideas.length!==24)fail(d.id,'24 distinct optional actions required');
 return Object.freeze({
  id:d.id,title:titles.get(d.id),
  standfirst:d.article[0].split(/(?<=[.!?])\s+/).slice(0,2).join(' '),
  readTitle:titles.get(d.id),article:d.article,
  mechanisms:d.profiles.slice(0,3).map(p=>[p[0],p[1]]),profiles:d.profiles,
  now:{title:'What would help right now?',paras:[d.article[7]],steps:d.now},
  safety:d.safety,prominentSafety:danger.has(d.id)?d.safety:'',
  sources:[d.source],
  roots,routes,whyIntro:d.article[1]+' '+d.article[6],
  whyStages:stepNames,whyQuestions,whyCases:cases,
  cycle:[d.cases[0][0],d.cases[0][1],d.profiles[0][1],d.options[0]],
  contextSequence:true,sequenceNote:'This is one possible sequence, not proof of why a person reacted or how the platform caused it.',
  ideas:{actions:ideas,support:ideas},
  noPersist:true,pullIndex:5,
  evidence:'This guide offers an educational explanation and optional reflection, not a diagnosis or validated personal risk assessment. Online threats, privacy violations and platform responsibilities require practical action. A source can support the general guidance without proving what happened in your situation.'
 });
}
export const DIGITAL_NEW_GUIDES=Object.freeze(manuscripts.map(build));
export const DIGITAL_NEW_IDS=Object.freeze(DIGITAL_NEW_GUIDES.map(g=>g.id));
if(DIGITAL_NEW_IDS.length!==15||new Set(DIGITAL_NEW_IDS).size!==15)fail('all','expected 15 distinct manuals');
if(new Set(DIGITAL_NEW_IDS.filter(id=>pending.has(id))).size!==15)fail('all','some catalogue topics are still missing');
