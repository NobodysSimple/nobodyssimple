/* Nobody's Simple · Work, study & circumstances.
 * Twenty-nine original, separately written guides use the established field-guide
 * renderer. Examples are hypotheses, not evidence of an individual cause.
 * Workload, finances, accessibility, rights and safety take priority where relevant.
 */
import {WORK_EDITORIAL_A} from './ns-work-editorial-a.mjs';
import {WORK_EDITORIAL_B} from './ns-work-editorial-b.mjs';
import {EDUCATION_EDITORIAL_A} from './ns-education-editorial-a.mjs';
import {EDUCATION_EDITORIAL_B} from './ns-education-editorial-b.mjs';
import {EDUCATION_EDITORIAL_C} from './ns-education-editorial-c.mjs';
import {EDUCATION_EDITORIAL_D} from './ns-education-editorial-d.mjs';
import {INCLUSIVE_GROUPS_B} from './ns-inclusive-topics-b.mjs';
import {problemIndex} from './ns-problem-map.mjs';
import {extendedProblemIndex} from './ns-atlas-extended.mjs';

const articles=Object.freeze([...WORK_EDITORIAL_A,...WORK_EDITORIAL_B,...EDUCATION_EDITORIAL_A,...EDUCATION_EDITORIAL_B,...EDUCATION_EDITORIAL_C,...EDUCATION_EDITORIAL_D]);
const education=INCLUSIVE_GROUPS_B.find(g=>g.id==='education');
if(education?.rows?.length!==16)throw new Error('Expected 16 education and opportunity topics');
const canonical=new Map([...problemIndex,...extendedProblemIndex].filter(p=>p.domain==='work').concat(education.rows.map(r=>({id:r[0],title:r[1],domain:'education'}))).map(p=>[p.id,p]));
const words=x=>String(x).trim().split(/\s+/).filter(Boolean).length;
const clean=s=>String(s||'').trim().replace(/[.!?]+$/,'');
const first=s=>String(s).split(/(?<=[.!?])\s+/)[0];
const stages=Object.freeze([
 'The situation','What happened in observable terms','What you understood it to mean',
 'What it changed for you','What you did next','What that response helped you manage',
 'A possible rule or expectation','The practical conditions and power involved',
 'What the evidence can and cannot settle','A safe next decision'
]);
const fail=(id,reason)=>{throw new Error('Work guide '+id+': '+reason);};
const safeIdSet=new Set(['workplace-bullying','workplace-discrimination','occupational-trauma','workplace-moral-injury','financial-insecurity','housing-instability','housing','money','unfairness','institutional-injustice','educational-pressure-family','educational-exclusion']);
function build(d){
 const id=d.id,meta=canonical.get(id);
 if(!meta)fail(id,'not in the work catalogue');
 if(d.article?.length!==10||words(d.article.join(' '))<400||d.article.some(p=>words(p)<27))fail(id,'missing substantial individual article');
 if(d.profiles?.length!==4||d.cases?.length!==4||d.options?.length!==4||d.now?.length!==3)fail(id,'expected four individual routes and immediate options');
 if(!d.safety||!d.source?.[1]||!d.cases.every(c=>c.length===2&&c[0].length>35&&c[1].length>30))fail(id,'missing ethical or contextual content');
 const roots=d.profiles.map((p,i)=>['path-'+i,p[0]]);
 const routes=d.profiles.map((p,i)=>{
  const [scene,thought]=d.cases[i],practice=d.options[i];
  const questions=[
   ['Think of a situation similar to this: '+clean(scene)+'. What happened in your case?', 'Only share what feels appropriate; the example may not fit your circumstances.', 'Start with the event and the conditions, not a verdict about yourself.', ''],
   ['When something like that happened, did you find yourself thinking: '+thought+' What did you actually know?', 'Treat this thought as an example, not as something the page assumes you believe.', 'Notice whether it was a fact, a prediction or an expectation you have learned.', ''],
   ['Which practical conditions or other people matter most to '+p[0].toLowerCase()+'?',p[1]+' Consider demands, resources, available support and any power difference.', 'The next step should fit what you can genuinely influence.', ''],
   ['Would this option be safe and realistic for you: '+clean(practice)+'?', 'You may instead choose rest, advice or another route if this is unsuitable.',practice,'actions']
  ];
  return {id:'path-'+i,label:p[0],title:p[0],description:p[1],
   finish:practice,practiceTitle:'One practical option',practice,questions};
 });
 const anchorIndices=[0,2,5,8];
 const examples=d.profiles.flatMap((p,i)=>anchorIndices.map((n,j)=>{
  const authored=d.cases[i];
  const situation=j===0?authored[0]:
   clean(first(d.article[(n+i)%10]))+'. ('+p[0]+')';
  const interpretation=j===0?authored[1]:
   'One possibility worth checking is whether '+p[1].charAt(0).toLowerCase()+p[1].slice(1);
  return {
   situation,interpretation,
   emotion:'You may feel pressure, frustration or worry; only you can identify what you actually felt.',
   response:'Consider what you did in response, including any necessary action to keep yourself safe.',
   function:'The response may have addressed an immediate concern. Check whether it changed the actual conditions or only gave short-term relief.',
   need:p[0],
   rule:authored[1],
   adaptation:p[1],
   alternative:d.options[i],
   action:d.options[i],
   root:'path-'+i
  };
 }));
 if(new Set(examples.map(x=>x.situation)).size!==16)fail(id,'workbook examples must be distinct');
 const whyQuestions=[
 'What happened in the moment you most associate with '+d.profiles[0][0].toLowerCase()+'?',
 'Which words or decisions did you observe when '+d.profiles[1][0].toLowerCase()+' mattered?',
 'When '+d.profiles[2][0].toLowerCase()+' occurred, what did you understand it to mean about you?',
 'How did '+d.profiles[3][0].toLowerCase()+' affect your ordinary day?',
 'What did you do next, and what problem did that action address immediately?',
 'What did you need that was unavailable or difficult to ask for?',
 'Which expectation about responsibility, achievement or fairness may be shaping your response?',
 'What constraints in time, money, access, health or authority are actually present?',
 'What information supports your interpretation, and which parts cannot yet be known?',
 'Which of the practical options feels feasible and safe, and what help would make it possible?'
 ];
 const extra=d.profiles.flatMap((p,i)=>[
  'If '+p[0].toLowerCase()+' is happening, identify which actual condition described here applies: '+p[1],
  'Check whether this response is available in your circumstances: '+d.options[i],
  'Identify a person or service who can address the practical barrier involved in '+p[0].toLowerCase()+'.',
  'Review whether this option helped or uncovered a barrier: '+d.options[i]
 ]);
 const more=[
  ...d.options,...d.now,...extra,
  'Read the relevant guidance before deciding: '+d.source[0]+'.'
 ];
 const ideas=[...new Set(more)].slice(0,24);
 if(ideas.length!==24)fail(id,'expected 24 distinct adapted practical suggestions');
 return Object.freeze({
  id,domain:meta.domain,title:meta.title,standfirst:d.article[0].split(/(?<=[.!?])\s+/).slice(0,2).join(' '),
  readTitle:meta.title,article:d.article,
  mechanisms:[
   [d.profiles[0][0],d.profiles[0][1]],
   [d.profiles[1][0],d.profiles[1][1]],
   [d.profiles[2][0],d.profiles[2][1]]
  ],
  profiles:d.profiles,
  now:{title:'A sensible place to begin',paras:[d.article[7]],steps:d.now},
  safety:d.safety,prominentSafety:safeIdSet.has(id)?d.safety:'',
  sources:[d.source],roots,routes,whyIntro:d.article[1]+' '+d.article[4],
  whyQuestions,whyStages:stages,whyCases:examples,
  cycle:[
   d.cases[0][0],d.cases[0][1],d.profiles[0][1],
   'The next response depends on the actual workload, resources, safety and support available.'
  ],
  contextSequence:true,
  sequenceNote:'These circumstances and responses may interact; there is no universal personal cycle.',
  ideas:{actions:ideas,support:ideas},
  noPersist:['workplace-bullying','workplace-discrimination','occupational-trauma','workplace-moral-injury','financial-insecurity','housing-instability','housing','institutional-injustice','educational-pressure-family'].includes(id),
  pullIndex:5,
  evidence:'This manual offers individually written explanations and practical exercises, not a diagnosis or a validated treatment. Work, money, education, housing and access may involve real external barriers. Use the linked resource for relevant evidence or practical support; an exercise cannot replace rights, protection or essential resources.'
 });
}
export const WORK_GUIDES=Object.freeze(articles.map(build));
export const WORK_IDS=Object.freeze(WORK_GUIDES.map(g=>g.id));
export const WORK_BY_ID=new Map(WORK_GUIDES.map(g=>[g.id,g]));
export const WORK_GUIDE_GROUPS=Object.freeze({work:Object.freeze(WORK_GUIDES.filter(g=>g.domain==='work').map(g=>g.id)),education:Object.freeze(WORK_GUIDES.filter(g=>g.domain==='education').map(g=>g.id))});
if(WORK_IDS.length!==29||WORK_BY_ID.size!==29||WORK_GUIDE_GROUPS.work.length!==13||WORK_GUIDE_GROUPS.education.length!==16)fail('all','expected 29 unique guides');
if(new Set(WORK_IDS).size!==WORK_IDS.length)fail('all','duplicate guide IDs');
if(canonical.size!==29)fail('all','canonical work and education catalogue has changed; check coverage before publishing');
