/* Nobody's Simple · Life changes, grief & growth.
 * Forty-nine individually written articles and four problem-specific routes
 * per guide. Existing nine relationship-related guides remain in their
 * established catalogue. No trauma diagnosis or hidden history is inferred.
 */
import {CHANGE_EDITORIAL_A} from './ns-change-editorial-a.mjs';
import {CHANGE_EDITORIAL_B} from './ns-change-editorial-b.mjs';
import {TRAUMA_EDITORIAL_A} from './ns-trauma-editorial-a.mjs';
import {TRAUMA_EDITORIAL_B} from './ns-trauma-editorial-b.mjs';
import {TRAUMA_EDITORIAL_C} from './ns-trauma-editorial-c.mjs';
import {LIFESPAN_EDITORIAL_A} from './ns-lifespan-editorial-a.mjs';
import {LIFESPAN_EDITORIAL_B} from './ns-lifespan-editorial-b.mjs';
import {LIFESPAN_EDITORIAL_C} from './ns-lifespan-editorial-c.mjs';
import {GROWTH_EDITORIAL_A} from './ns-growth-editorial-a.mjs';
import {GROWTH_EDITORIAL_B} from './ns-growth-editorial-b.mjs';
import {GROWTH_EDITORIAL_C} from './ns-growth-editorial-c.mjs';
import {INCLUSIVE_GROUPS_B} from './ns-inclusive-topics-b.mjs';
import {problemIndex} from './ns-problem-map.mjs';
import {extendedProblemIndex} from './ns-atlas-extended.mjs';
import {TOPIC_THEME_OVERRIDES} from './ns-needs-themes.mjs';

const records=Object.freeze([
 ...CHANGE_EDITORIAL_A,...CHANGE_EDITORIAL_B,
 ...TRAUMA_EDITORIAL_A,...TRAUMA_EDITORIAL_B,...TRAUMA_EDITORIAL_C,
 ...LIFESPAN_EDITORIAL_A,...LIFESPAN_EDITORIAL_B,...LIFESPAN_EDITORIAL_C,
 ...GROWTH_EDITORIAL_A,...GROWTH_EDITORIAL_B,...GROWTH_EDITORIAL_C
]);
const fromChange=[...problemIndex,...extendedProblemIndex].filter(p=>p.domain==='change');
const fromInclusive=INCLUSIVE_GROUPS_B.filter(g=>['trauma','lifespan','growth'].includes(g.id)).flatMap(g=>
 g.rows.filter(r=>TOPIC_THEME_OVERRIDES[r[0]]!=='connection').map(r=>({id:r[0],title:r[1],domain:g.id}))
);
const catalogue=new Map([...fromChange,...fromInclusive].map(p=>[p.id,p]));
const expected=Object.freeze({change:10,trauma:14,lifespan:13,growth:12});
const fail=(id,msg)=>{throw new Error('Life changes field guide '+id+': '+msg)};
const words=s=>String(s||'').trim().split(/\s+/).filter(Boolean).length;
const clean=x=>String(x||'').trim().replace(/[.!?]+$/,'');
const first=p=>String(p).split(/(?<=[.!?])\s+/)[0]||String(p);
const lower=s=>s[0].toLowerCase()+s.slice(1);
const stages=Object.freeze({
 change:['The change or loss','The moment that stays with you','The expectation you had','What has changed in daily life','Your first response','What it helped you manage','An assumption worth checking','The actual constraints','What remains unknown','A possible next choice'],
 trauma:['The event or loss','What happened or was learned','A response you noticed','What may be affecting you now','What you did to stay safe','What support was missing','Responsibility and available choices','Present circumstances and safety','What is known and unknown','A supported next step'],
 lifespan:['The life-stage change','Your specific circumstances','The roles and expectations involved','The practical consequences','Your immediate response','What matters to you','Other people’s assumptions','Available resources and access','What can be changed','An informed next decision'],
 growth:['The experience','What you genuinely want','The expectation affecting you','What you actually tried','What happened','What you learned','A rule you may be following','Your real resources','Alternative ways to approach it','A choice worth testing']
});
const domainPerspective=Object.freeze({
 change:'A change may bring genuine loss or uncertainty. Consider both the real conditions and the meaning you attach to them.',
 trauma:'The experience may have involved actual harm. Your response does not establish guilt or a diagnosis. Safety and appropriate support remain central.',
 lifespan:'Age and life stage influence circumstances without prescribing what a person must feel or do. Check resources and personal wishes.',
 growth:'The aim is voluntary self-understanding rather than diagnosing an ordinary preference or turning improvement into another obligation.'
});
const privateIds=new Set([
 'grief-after-suicide','complex-trauma-history','childhood-adversity','traumatic-loss','trauma-reminders',
 'medical-loss-grief','survivor-guilt','moral-injury-experience','ambiguous-loss',
 'adolescent-identity','new-parent-identity','end-of-life-anxiety','loss-of-independence','menopause-life-change'
]);
const importantIds=new Set([
 'grief-after-suicide','trauma-reminders','traumatic-loss','complex-trauma-history',
 'childhood-adversity','survivor-guilt','moral-injury-experience','medical-loss-grief',
 'new-parent-identity','end-of-life-anxiety','loss-of-independence','menopause-life-change','ageism'
]);
const progressLine=(d,i)=>[
 'Notice which part of this description matches the actual situation: '+d.profiles[i][1],
 'What was being asked of you in this example? '+d.cases[i][0],
 'Identify the prediction or expectation worth examining: '+d.cases[i][1],
 'Consider this safe and specific option when it fits: '+d.options[i]
];
function build(d){
 const p=catalogue.get(d.id);
 if(!p)fail(d.id,'topic is absent from the intended catalogue');
 if(d.article?.length!==10||words(d.article.join(' '))<400||d.article.some(a=>words(a)<25))fail(d.id,'missing substantial individually authored article');
 if(d.profiles?.length!==4||d.cases?.length!==4||d.options?.length!==4||d.now?.length!==3)fail(d.id,'requires four specific routes and three immediate responses');
 if(d.profiles.some(p=>p.length!==2||p[1].length<32)||d.cases.some(c=>c.length!==2||c[0].length<35||c[1].length<30))fail(d.id,'incomplete situations or profiles');
 if(!d.safety||d.safety.length<65||!d.source?.[1]?.startsWith('https://'))fail(d.id,'incomplete safeguards or source');
 const domain=p.domain;
 const roots=d.profiles.map((pr,i)=>['path-'+i,pr[0]]);
 const routes=d.profiles.map((pr,i)=>{
  const [event,thought]=d.cases[i],practice=d.options[i];
  const questions=[
   ['Consider an experience like this: '+clean(event)+'. What happened in your own circumstances?',
    'This is an example, not an assumption about your history. You may skip the detail.',
    'Start with what is known, including the actual conditions and people involved.',''],
   ['Have you had a thought resembling this: '+thought+' What makes it feel convincing?',
    'You may have had a different thought or no thought you can easily identify.',
    domain==='trauma'?'The example cannot tell us who was responsible. Current safety and actual conduct matter.':'Separate the conclusion from the event without denying any real difficulty.',''],
   ['Which aspect of '+pr[0].toLowerCase()+' is affecting your choices now?',
    pr[1]+' You may need practical help, medical input or an adjustment.',
    'Consider how much control and support is genuinely available to you.',''],
   ['Would this response fit your needs and safety: '+clean(practice)+'?',
    'You can choose a different action, ask for help or decide that an exercise is unsuitable.',
    practice,'actions']
  ];
  return {id:'path-'+i,label:pr[0],title:pr[0],
    description:pr[1]+' Example: '+clean(event)+'.',finish:practice,
    practiceTitle:'One option worth considering',practice,questions};
 });
 // Four distinct, explicit worked descriptions per recognition route:
 // one original vignette and three differently grounded reading anchors.
 const points=[1,3,6];
 const whyCases=d.profiles.flatMap((pr,i)=>Array.from({length:4},(_,j)=>{
  const scenario=j===0?d.cases[i][0]:
   'In '+pr[0].toLowerCase()+', consider this part of daily life: '+clean(first(d.article[(points[j-1]+i*2)%10]))+'.';
  const interpretation=j===0?d.cases[i][1]:
   'One possible interpretation is that '+lower(pr[1]);
  return {
   situation:scenario,interpretation,
   emotion:domain==='trauma'?'The reaction may involve fear or grief; it does not determine what happened or who is responsible.':
    domain==='growth'?'The feeling may be mixed or subtle. There is no required emotional outcome.':
    'Your response may include conflicting feelings. You decide which, if any, describe your experience.',
   response:'Notice what you did in response and whether it affected the practical situation.',
   function:domainPerspective[domain],
   need:pr[0],
   rule:d.cases[i][1],
   adaptation:pr[1]+' '+domainPerspective[domain],
   alternative:d.options[i],
   action:d.options[i],
   root:'path-'+i
  };
 }));
 if(new Set(whyCases.map(x=>x.situation)).size!==16)fail(d.id,'worked examples are not unique');
 const whyQuestions=[
  'When did '+d.profiles[0][0].toLowerCase()+' become noticeable for you?',
  'What actually happened in a situation like this: '+clean(d.cases[1][0])+'?',
  'What did you understand it to mean when '+d.profiles[2][0].toLowerCase()+' appeared?',
  'How did '+d.profiles[3][0].toLowerCase()+' affect what you did next?',
  'What did your immediate response help you manage, and what did it cost?',
  'What practical or emotional need is still unmet?',
  'Is an expectation like this affecting you: '+d.cases[0][1]+'?',
  'Which resources, relationships or safety constraints limit the available options?',
  'What can the evidence tell you, and what remains uncertain or outside your control?',
  'Would a response like this be safe and useful here: '+clean(d.options[0])+'?'
 ];
 const extra=d.profiles.flatMap((_,i)=>progressLine(d,i));
 const ideas=[...new Set([...d.options,...d.now,...extra,'Read the relevant guidance: '+d.source[0]+'.'])].slice(0,24);
 if(ideas.length!==24)fail(d.id,'24 unique optional practical ideas required');
 return Object.freeze({
  id:d.id,domain,title:p.title,standfirst:d.article[0].split(/(?<=[.!?])\s+/).slice(0,2).join(' '),
  readTitle:p.title,article:d.article,
  mechanisms:d.profiles.slice(0,3).map(pr=>[pr[0],pr[1]]),
  profiles:d.profiles,
  now:{title:'A place to begin today',paras:[d.article[7]],steps:d.now},
  sources:[d.source],safety:d.safety,prominentSafety:importantIds.has(d.id)?d.safety:'',
  roots,routes,whyIntro:d.article[1]+' '+d.article[5],
  whyQuestions,whyStages:stages[domain],whyCases,
  cycle:[d.cases[0][0],d.cases[0][1],d.profiles[0][1],d.options[0]],
  contextSequence:true,
  sequenceNote:'This is a possible sequence, not a clinical explanation or a fixed pattern everyone follows.',
  ideas:{actions:ideas,support:ideas},
  noPersist:domain==='trauma'||privateIds.has(d.id),
  pullIndex:5,
  evidence:'This guide is an educational account of possible experiences, not a diagnosis or individually validated intervention. The long-form material and suggested actions are topic-specific; sources offer background or relevant support rather than proving an individual explanation. Physical health, safeguarding, external constraints and the person\'s own choices determine which responses are appropriate.'
 });
}
export const CHANGES_GUIDES=Object.freeze(records.map(build));
export const CHANGES_IDS=Object.freeze(CHANGES_GUIDES.map(g=>g.id));
export const CHANGES_BY_ID=new Map(CHANGES_GUIDES.map(g=>[g.id,g]));
export const CHANGES_GROUPS=Object.freeze(Object.fromEntries(Object.keys(expected).map(domain=>[domain,Object.freeze(CHANGES_GUIDES.filter(g=>g.domain===domain).map(g=>g.id))])));
if(CHANGES_IDS.length!==49||CHANGES_BY_ID.size!==49||catalogue.size!==49)fail('all','expected 49 distinct catalogue guides');
for(const [domain,count] of Object.entries(expected))if(CHANGES_GROUPS[domain].length!==count)fail(domain,'expected '+count+' guides');
