/* Nobody's Simple · Family, Harm & Safety; Money, Technology & Society.
 * Seventy-four independently authored long-form articles. The previously
 * completed sixteen Digital guides remain separate; urgent safety entries
 * retain their dedicated, support-first routes.
 *
 * All case interpretations are possibilities, not verdicts about another
 * person's motives or a causal diagnosis. For abuse and structural threats,
 * actual conduct and practical protection take precedence over reframing.
 */
import {INCLUSIVE_GROUPS_A} from './ns-inclusive-topics-a.mjs';
import {INCLUSIVE_GROUPS_B} from './ns-inclusive-topics-b.mjs';
import {enrichFhsGuide} from './ns-fhs-depth.mjs?v=society-20261115-v3';
import {FAMILY_EDITORIAL_1} from './ns-family-editorial-1.mjs?v=fhs-20261115-v1';
import {FAMILY_EDITORIAL_2} from './ns-family-editorial-2.mjs?v=fhs-20261115-v1';
import {FAMILY_EDITORIAL_3} from './ns-family-editorial-3.mjs?v=fhs-20261115-v1';
import {FAMILY_EDITORIAL_4} from './ns-family-editorial-4.mjs?v=fhs-20261115-v1';
import {HARM_EDITORIAL_1} from './ns-harm-editorial-1.mjs?v=fhs-20261115-v1';
import {HARM_EDITORIAL_2} from './ns-harm-editorial-2.mjs?v=fhs-20261115-v1';
import {HARM_EDITORIAL_3} from './ns-harm-editorial-3.mjs?v=fhs-20261115-v1';
import {HARM_EDITORIAL_4} from './ns-harm-editorial-4.mjs?v=fhs-20261115-v1';
import {INEQUALITY_EDITORIAL_1} from './ns-inequality-editorial-1.mjs?v=fhs-20261115-v1';
import {INEQUALITY_EDITORIAL_2} from './ns-inequality-editorial-2.mjs?v=fhs-20261115-v1';
import {INEQUALITY_EDITORIAL_3} from './ns-inequality-editorial-3.mjs?v=fhs-20261115-v1';
import {INEQUALITY_EDITORIAL_4} from './ns-inequality-editorial-4.mjs?v=fhs-20261115-v1';
import {ENVIRONMENT_EDITORIAL_1} from './ns-environment-editorial-1.mjs?v=fhs-20261115-v1';
import {ENVIRONMENT_EDITORIAL_2} from './ns-environment-editorial-2.mjs?v=fhs-20261115-v1';

const catalogues=Object.freeze({
 family:Object.freeze([...FAMILY_EDITORIAL_1,...FAMILY_EDITORIAL_2,...FAMILY_EDITORIAL_3,...FAMILY_EDITORIAL_4]),
 harm:Object.freeze([...HARM_EDITORIAL_1,...HARM_EDITORIAL_2,...HARM_EDITORIAL_3,...HARM_EDITORIAL_4]),
 inequality:Object.freeze([...INEQUALITY_EDITORIAL_1,...INEQUALITY_EDITORIAL_2,...INEQUALITY_EDITORIAL_3,...INEQUALITY_EDITORIAL_4]),
 environment:Object.freeze([...ENVIRONMENT_EDITORIAL_1,...ENVIRONMENT_EDITORIAL_2])
});
const expected={family:22,harm:19,inequality:22,environment:11};
const rows=new Map([...INCLUSIVE_GROUPS_A,...INCLUSIVE_GROUPS_B].flatMap(g=>g.rows.map(r=>[r[0],{domain:g.id,title:r[1],hint:r[2],flags:r[4]||''}])));
const fail=(id,reason)=>{throw new Error('Family / Harm / Systems manual '+id+': '+reason);};
const sentenceList=p=>String(p).split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean);
const lowerFirst=s=>s[0].toLowerCase()+s.slice(1);
const trimPeriod=s=>s.trim().replace(/[.!?]+$/,'');
const firstSentence=p=>sentenceList(p)[0]||p;
const groupStages={
 family:['What happened','Who was involved','What you understood','How it affected you','The family response','What you needed','A possible family expectation','Power and practical limits','Other relevant information','A chosen next step'],
 harm:['What happened','The other person’s action','What risk is present','How it affected your freedom','What you did to stay safe','The resource or protection needed','A repeated pattern, if any','Power and dependence','Available practical support','The safer next step'],
 inequality:['What happened','The material condition','The practical consequence','How it affected you','What you tried','Which resource was missing','An institutional expectation','Actual options and limits','The relevant support','A practical next step'],
 environment:['What happened','The real-world condition','What remains uncertain','How it affected you','What you did','What mattered most','The wider context','Available reliable information','Individual and collective options','A proportionate next step']
};
function eventFor(d,profileIndex,caseIndex){
 const p=d.profiles[profileIndex],index=(profileIndex+3*caseIndex)%10,lines=sentenceList(d.article[index]);
 const specific=lines.find(s=>s.length>38&&s.length<205&&/\b(you|your|somebody|someone|perhaps|parent|relative|family|partner|person|people|child|worker|employer|friends|neighbour|group|colleague|organisation|service|institution)\b/i.test(s))||lines[0];
 return p[0]+': '+trimPeriod(specific)+'.';
}
const distinctSupport=(d,p,i)=>[
 'Look at a specific instance of '+p[0].toLowerCase()+' and distinguish observation from assumption.',
 'Consider the practical consequences of this pattern: '+trimPeriod(p[1])+'.',
 'Identify which person, service or organisation can realistically address '+p[0].toLowerCase()+'.',
 'Ask for appropriate support with '+p[0].toLowerCase()+' without compromising your safety or autonomy.'
];
function build(d,domain){
 const id=d.id,entry=rows.get(id);
 if(!entry||entry.domain!==domain)fail(id,'unknown or wrongly classified source topic');
 if(!Array.isArray(d.article)||d.article.length!==10||d.article.join(' ').split(/\s+/).length<400||d.article.some(p=>p.split(/\s+/).length<28))fail(id,'incomplete long-form manual');
 if(d.profiles?.length!==4||d.profiles.some(p=>p.length!==2||p[1].length<25))fail(id,'insufficiently specific recognition routes');
 if(d.now?.length!==3||!d.source?.[1]||!d.safety?.length)fail(id,'missing actionable or protective guidance');
 const title=entry.title,rootKeys=d.profiles.map((_,i)=>'path-'+i);
 const practices=[...d.now,'Consider confidential or independent guidance from '+d.source[0]+' when the situation needs more support.'];
 const routes=d.profiles.map((p,i)=>{
  const label=p[0],description=p[1]+' '+firstSentence(d.article[(i+2)%10]);
  const practice=practices[i];
  const questions=[
   'Think of a particular time this happened: '+p[1]+' What did you observe first?',
   'Which details make '+label.toLowerCase()+' relevant, and which parts remain uncertain?',
   domain==='harm'
    ?'What did the person actually do when '+label.toLowerCase()+' affected your choices, and is anyone at risk?'
    :domain==='inequality'
    ?'Which resources or organisational decisions were involved when '+label.toLowerCase()+' occurred?'
    :domain==='environment'
    ?'Which conditions outside your control contributed to '+label.toLowerCase()+' in this situation?'
    :'How did the family relationship or expectation shape your response to '+label.toLowerCase()+'?',
   'What would make this possible next step safe and realistic for you: '+trimPeriod(practice)+'?'
  ];
  return {id:'path-'+i,label,title:label,description,finish:practice,practiceTitle:'An option to consider',practice,
   questions:questions.map((q,j)=>[q,j===0?p[1]:j===1?firstSentence(d.article[(i+4)%10]):j===2?d.safety:practice,practice,j===3?'actions':''])};
 });
 const examples=d.profiles.flatMap((p,i)=>Array.from({length:4},(_,j)=>{
  const situation=eventFor(d,i,j);
  return {situation,interpretation:'One possible relevant pattern is '+p[0].toLowerCase()+'. '+p[1],
   emotion:'Your response may include concern or distress; the particular feeling is yours to identify.',
   response:'The immediate response depends on the choices and constraints present in this situation.',
   function:domain==='harm'?'Safety, consent and the other person’s conduct take priority over analysing your reaction.'
     :domain==='inequality'?'Material conditions and institutional decisions can restrict options regardless of motivation.'
     :domain==='environment'?'A real-world threat or loss may need collective and practical action.'
     :'Family roles and expectations may affect what people feel able to say or do.',
   need:p[0],rule:'Look for evidence of '+p[0].toLowerCase()+' rather than assigning unverified motives.',
   adaptation:p[1],alternative:'Consider what protection or practical change is available in your actual circumstances.',
   action:practices[i],root:rootKeys[i]};
 }));
 if(new Set(examples.map(x=>x.situation)).size!==16)fail(id,'duplicate case descriptions');
 const whyQuestions=[
  'Which event makes '+d.profiles[0][0].toLowerCase()+' relevant to your experience?',
  'What did other people actually do when '+d.profiles[1][0].toLowerCase()+' occurred?',
  'How did '+d.profiles[2][0].toLowerCase()+' affect your daily life?',
  'What response have you made to '+d.profiles[3][0].toLowerCase()+'?',
  'What did your response to '+d.profiles[0][0].toLowerCase()+' help you manage immediately?',
  'Which practical need matters most when dealing with '+d.profiles[1][0].toLowerCase()+'?',
  'What assumptions about '+d.profiles[2][0].toLowerCase()+' are supported by evidence?',
  'Which power differences or resources are relevant to '+d.profiles[3][0].toLowerCase()+'?',
  'Which circumstances might limit this proposed step: '+trimPeriod(d.now[1])+'?',
  'What safe next step would address '+d.profiles[0][0].toLowerCase()+' without sacrificing your choice?'
 ];
 const support=d.profiles.flatMap((p,i)=>distinctSupport(d,p,i));
 const sourceAction='Read the referenced support guidance: '+d.source[0]+'.';
 const actions=[...support,...practices,...d.now,sourceAction];
 const optionalSupport=[...practices,...d.now,...support,sourceAction];
 if(actions.length!==24||optionalSupport.length!==24)fail(id,'action/support count');
 const prominentSafety=domain==='harm'||entry.flags==='safety'||/food-insecurity|homelessness-insecurity|community-violence|disaster-recovery|reproductive-coercion|family-financial-dependence|co-parenting-conflict|debt-coercion/.test(id)?d.safety:'';
 return Object.freeze({
  id,title,standfirst:sentenceList(d.article[0]).slice(0,2).join(' '),
  readTitle:'Understanding '+id.replace(/-/g,' '),
  article:d.article,
  mechanisms:d.profiles.slice(0,3).map(p=>[p[0],p[1]]),
  profiles:d.profiles,
  now:{title:trimPeriod(d.now[0]),paras:[firstSentence(d.article[7])],steps:d.now},
  sources:[d.source],safety:d.safety,prominentSafety,
  cycle:[eventFor(d,0,0),d.profiles[0][1],d.profiles[1][1],d.now[0]],
  roots:d.profiles.map((p,i)=>[rootKeys[i],p[0]]),
  routes,whyIntro:d.article[1]+' '+d.article[5],
  whyQuestions,whyStages:groupStages[domain],whyCases:examples,
  ideas:{actions,support:optionalSupport},pullIndex:5,
  evidence:'This page describes possible experiences and conditions rather than diagnosing motives or causes. Practical risks, rights, health needs and available resources must be considered against your situation. The referenced guidance is a starting point for relevant support.'
 });
}
for(const [domain,amount] of Object.entries(expected)){
 if(catalogues[domain].length!==amount)fail(domain,'expected '+amount+' entries, found '+catalogues[domain].length);
}
export const FHS_GUIDE_GROUPS=Object.freeze(Object.fromEntries(Object.entries(catalogues).map(([domain,items])=>[domain,Object.freeze(items.map(x=>x.id))])));
export const FHS_GUIDES=Object.freeze(Object.entries(catalogues).flatMap(([domain,items])=>items.map(x=>enrichFhsGuide(build(x,domain),domain))));
export const FHS_IDS=Object.freeze(FHS_GUIDES.map(g=>g.id));
export const FHS_BY_ID=new Map(FHS_GUIDES.map(g=>[g.id,g]));
if(FHS_IDS.length!==74||FHS_BY_ID.size!==74)throw new Error('Expected 74 unique Family, Harm & Systems manuals');
