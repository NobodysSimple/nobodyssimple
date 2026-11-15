/* Nobody's Simple · Identity, LGBTQIA+ and appearance field manuals.
 * Forty-nine original ten-paragraph articles. The accompanying reflections
 * are illustrations, not medical diagnoses or claims about an individual's life.
 */
import {problemIndex} from './ns-problem-map.mjs';
import {extendedProblemIndex} from './ns-atlas-extended.mjs';
import {INCLUSIVE_GROUPS_A} from './ns-inclusive-topics-a.mjs';
import {INCLUSIVE_GROUPS_B} from './ns-inclusive-topics-b.mjs';
import {IDENTITY_EDITORIAL_A} from './ns-identity-editorial-a.mjs';
import {IDENTITY_EDITORIAL_B} from './ns-identity-editorial-b.mjs';
import {IDENTITY_EDITORIAL_C} from './ns-identity-editorial-c.mjs';
import {LGBTQ_EDITORIAL_A} from './ns-lgbtq-editorial-a.mjs';
import {LGBTQ_EDITORIAL_B} from './ns-lgbtq-editorial-b.mjs';
import {LGBTQ_EDITORIAL_C} from './ns-lgbtq-editorial-c.mjs';
import {LGBTQ_EDITORIAL_D} from './ns-lgbtq-editorial-d.mjs';
import {APPEARANCE_EDITORIAL_A} from './ns-appearance-editorial-a.mjs';
import {APPEARANCE_EDITORIAL_B} from './ns-appearance-editorial-b.mjs';

const authored=Object.freeze({
 identity:Object.freeze([...IDENTITY_EDITORIAL_A,...IDENTITY_EDITORIAL_B,...IDENTITY_EDITORIAL_C]),
 lgbtq:Object.freeze([...LGBTQ_EDITORIAL_A,...LGBTQ_EDITORIAL_B,...LGBTQ_EDITORIAL_C,...LGBTQ_EDITORIAL_D]),
 appearance:Object.freeze([...APPEARANCE_EDITORIAL_A,...APPEARANCE_EDITORIAL_B])
});
const total=Object.values(authored).flat();
const inclusive=[...INCLUSIVE_GROUPS_A,...INCLUSIVE_GROUPS_B].flatMap(x=>x.rows.map(r=>({id:r[0],title:r[1],domain:x.id})));
const index=new Map([...problemIndex,...extendedProblemIndex,...inclusive].map(x=>[x.id,x]));
const sources={
 esteem:['NHS: Raising low self-esteem','https://www.nhs.uk/mental-health/self-help/tips-and-support/raise-low-self-esteem/'],
 wellbeing:['NHS: Five steps to mental wellbeing','https://www.nhs.uk/mental-health/self-help/tips-and-support/5-steps-to-mental-wellbeing/'],
 lgbtq:['Mind: Finding LGBTQIA+ mental health support','https://www.mind.org.uk/information-support/tips-for-everyday-living/lgbtqiaplus-mental-health/finding-support-for-lgbtqiaplus-mental-health/'],
 gender:['NHS: Gender dysphoria and incongruence','https://www.nhs.uk/conditions/gender-dysphoria-and-incongruence/'],
 intersex:['NHS: Differences in sex development','https://www.nhs.uk/conditions/differences-in-sex-development/'],
 bdd:['NHS: Body dysmorphic disorder','https://www.nhs.uk/mental-health/conditions/body-dysmorphia/'],
 hair:['NHS: Hair loss','https://www.nhs.uk/symptoms/hair-loss/'],
 postpartum:['NHS: Your post-pregnancy body','https://www.nhs.uk/baby/support-and-services/your-post-pregnancy-body/'],
 eating:['NHS: Eating disorders','https://www.nhs.uk/mental-health/conditions/eating-disorders/overview/'],
 appearance:['Changing Faces: Support for visible differences','https://www.changingfaces.org.uk/']
};
const sourceFor=(id,domain)=>{
 if(id==='gender-dysphoria'||id==='trans-healthcare-barriers')return sources.gender;
 if(id==='intersex-stigma')return sources.intersex;
 if(id==='body-dysmorphic-concerns')return sources.bdd;
 if(id==='hair-loss-distress')return sources.hair;
 if(id==='appearance-after-pregnancy')return sources.postpartum;
 if(id==='eating-weight-stigma')return sources.eating;
 if(domain==='appearance')return sources.appearance;
 if(domain==='lgbtq')return sources.lgbtq;
 if(['self-worth','approval-dependence','social-comparison','imposter-feelings'].includes(id))return sources.esteem;
 return sources.wellbeing;
};
const stages={
 identity:['What happened','What you believed it meant','What you felt','How you responded','What that response provided','Which need mattered','A possible personal expectation','The context that shaped your choice','A fairer interpretation or practical change','One chosen next step'],
 lgbtq:['What happened','How others responded or what you understood','What you felt','What you chose to do','What the response protected','What recognition or autonomy you need','The expectation you are carrying','The real safety and social context','An option that respects your identity','A safe next step'],
 appearance:['What happened','What appearance judgement was present','How you felt','What you did afterwards','What checking or avoidance accomplished','The need behind that response','A standard shaping your evaluation','Actual treatment and health circumstances','A more useful response','One safe next step']
};
const domainReality={
 identity:'Your current choices and relationships matter. An earlier role or expectation may be relevant without proving one hidden explanation.',
 lgbtq:'Identity exploration and expression are not pathologies. Examine actual discrimination and disclosure safety before interpreting distress as an internal problem.',
 appearance:'Physical health and external stigma matter. Appearance does not need correcting to merit respectful treatment.'
};
const privacy=new Set([
 'gender-identity-exploration','coming-out-decision','coming-out-rejection','gender-dysphoria','gender-euphoria',
 'misgendering','deadnaming','intersex-stigma','transphobia','homophobia','identity-privacy-safety',
 'sexual-orientation-exploration','religion-lgbtq-conflict','internalised-identity-stigma','reproductive-coercion',
 'body-dysmorphic-concerns','eating-weight-stigma','masking','self-concealment'
]);
const protective=new Set([
 'coming-out-rejection','transphobia','homophobia','misgendering','deadnaming','intersex-stigma',
 'trans-healthcare-barriers','identity-privacy-safety','religion-lgbtq-conflict','gender-dysphoria',
 'body-dysmorphic-concerns','appearance-bullying','eating-weight-stigma','weight-stigma'
]);
const splitSentences=text=>String(text).match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(x=>x.trim()).filter(Boolean)||[];
const first=text=>splitSentences(text)[0]||text;
const ensure=(condition,msg)=>{if(!condition)throw new Error('Identity manual: '+msg);};
function build(data,domain){
 const id=data.id,ref=index.get(id);
 ensure(ref?.domain===domain,id+' missing catalogue match');
 ensure(data.article?.length===10&&data.article.join(' ').trim().split(/\s+/).length>=370,id+' short article');
 ensure(data.profiles?.length===4&&data.cases?.length===4&&data.actions?.length===4&&data.why?.length>110,id+' missing individual work');
 ensure(data.profiles.every(x=>x.length===2&&x[1].length>35),id+' insufficient recognition');
 ensure(data.cases.every(x=>x.length===2&&x[0].length>35&&x[1].length>14),id+' thin real-world example');
 const label=data.profiles.map(p=>p[0]);
 const roots=label.map((name,i)=>['path-'+i,name]);
 const routes=data.profiles.map((p,i)=>{
  const scenario=data.cases[i][0],thought=data.cases[i][1],action=data.actions[i];
  const questions=[
   ['The following example may feel familiar: '+scenario+'. What happened for you, if you would like to write about it?',p[1],p[1],''],
   ['The thought in that example is: "'+thought+'". What did the situation seem to mean in your experience?',data.why,first(data.article[(i*2+2)%10]),''],
   ['What did you need in a moment involving '+p[0].toLowerCase()+'? Consider what the other people or environment actually did.',domainReality[domain],data.safety,''],
   ['What would make this option realistic and safe for you: '+action+'?',action,action,'actions']
  ];
  return {id:'path-'+i,label:p[0],title:p[0],description:p[1]+' '+first(data.article[(i*2+4)%10]),
   questions,finish:action,practice:action,practiceTitle:'One practical option'};
 });
 const cases=data.profiles.flatMap((p,i)=>Array.from({length:4},(_,j)=>{
  const anchor=data.cases[i];const text=first(data.article[(i*3+j*2+2)%10]);
  const situation=j===0?anchor[0]:p[0]+': '+text;
  return {
   situation,interpretation:j===0?anchor[1]:p[1],
   emotion:domain==='lgbtq'?'The response may involve fear or grief, or sometimes uncertainty; your feelings remain yours to describe.':
    domain==='appearance'?'You may experience shame or sadness; the precise feeling depends on your circumstances.':
    'Your response might include uncertainty or hurt. No emotion is required to fit the example.',
   response:j===0?'A person might withdraw or seek repeated confirmation; your own response may differ.':
    'The response will depend on the actual people and constraints in this setting.',
   function:domainReality[domain],need:p[0],
   rule:j===0?'A possible belief here is: '+anchor[1]:
    'A possible expectation worth examining is: '+p[1],
   adaptation:domain==='lgbtq'?'Respect the person’s identity and consent. Check whether discrimination or safety changes the available choices.':
    domain==='appearance'?'Consider genuine health needs and stigma before treating the distress as an individual thinking error.':
    'Check whether this response follows from an old rule or a practical limitation that still exists.',
   alternative:data.actions[i],action:data.actions[i],root:'path-'+i
  };
 }));
 ensure(new Set(cases.map(c=>c.situation)).size===16,id+' repeated situations');
 const whyQuestions=[
  'Think of a real moment that resembles this: '+data.cases[0][0]+'. What happened?',
  'What did you believe about yourself or another person during that moment?',
  'How did the experience affect you physically or emotionally?',
  'What did you choose to do at the time, and what alternatives were possible?',
  'Did that response make anything easier immediately? What did it cost later?',
  'What mattered most to you in the experience involving '+label[1].toLowerCase()+'?',
  'Is there a rule or expectation connected with '+label[2].toLowerCase()+' that deserves examining?',
  'What has actually happened in the environment related to '+label[3].toLowerCase()+'?',
  'Which interpretation or practical change fits the available evidence?',
  'What might make this action safe and feasible: '+data.actions[0]+'?'
 ];
 const source=sourceFor(id,domain);
 const extraSupport=[
  ...data.actions,
  ...routes.map(r=>r.practice),
  ...data.profiles.map((p,i)=>'Consider the actual circumstances behind '+p[0].toLowerCase()+': '+p[1]),
  ...data.cases.map((p,i)=>'Reflect on the specific situation: '+p[0]+'. '+data.actions[i]),
  ...data.article.slice(2,10).map((p,i)=>'Consider how this part of your experience may apply: '+first(p)),
  ...data.actions.map((a,i)=>'If you want additional support with '+label[i].toLowerCase()+', discuss this possibility with someone safe: '+a),
  'Read the linked guidance: '+source[0]+'.'
 ];
 const unique=[...new Set(extraSupport)];
 ensure(unique.length>=24,id+' few support options');
 const actions=[...data.actions,...unique.filter(x=>!data.actions.includes(x))].slice(0,24);
 const support=[...unique].slice(0,24);
 const mechanisms=data.profiles.slice(0,3).map(p=>[p[0],p[1]]);
 return Object.freeze({
  id,title:ref.title,standfirst:first(data.article[0]),readTitle:ref.title,
  article:data.article,mechanisms,profiles:data.profiles,
  now:{title:data.actions[0].replace(/[.!?]$/,''),paras:[first(data.article[7])],steps:data.actions.slice(0,3)},
  sources:[source],safety:data.safety,prominentSafety:protective.has(id)?data.safety:'',
  cycle:[data.cases[0][0],data.cases[0][1],data.profiles[0][1],data.actions[0]],
  roots,routes,whyIntro:data.why,whyStages:stages[domain],whyQuestions,whyCases:cases,
  ideas:{actions,support},noPersist:privacy.has(id),pullIndex:5,
  evidence:domainReality[domain]+' The possibilities in these examples cannot establish a diagnosis, another person’s motives or one hidden cause.'
 });
}
const expected={identity:13,lgbtq:24,appearance:12};
for(const [key,n] of Object.entries(expected))ensure(authored[key].length===n,key+' expected '+n);
export const IMAGE_GUIDE_GROUPS=Object.freeze(Object.fromEntries(Object.entries(authored).map(([k,rows])=>[k,Object.freeze(rows.map(x=>x.id))])));
export const IMAGE_GUIDES=Object.freeze(Object.entries(authored).flatMap(([domain,rows])=>rows.map(row=>build(row,domain))));
export const IMAGE_IDS=Object.freeze(IMAGE_GUIDES.map(x=>x.id));
export const IMAGE_BY_ID=new Map(IMAGE_GUIDES.map(x=>[x.id,x]));
ensure(IMAGE_IDS.length===49&&IMAGE_BY_ID.size===49,'missing or repeated topics');
