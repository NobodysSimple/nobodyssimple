/* Nobody's Simple · neurodivergence and disability field-guide assembler.
 * All 42 substantive manuals live in the editorial records. This file
 * validates their completeness and maps them to the existing shared renderer.
 * A condition or label does not establish a single hidden psychological cause.
 */
import {INCLUSIVE_GROUPS_A} from './ns-inclusive-topics-a.mjs';
import {ACCESS_NEURO_1} from './ns-access-neuro-records-1.mjs';
import {ACCESS_NEURO_2} from './ns-access-neuro-records-2.mjs';
import {ACCESS_NEURO_3} from './ns-access-neuro-records-3.mjs';
import {ACCESS_NEURO_4} from './ns-access-neuro-records-4.mjs';
import {ACCESS_NEURO_5} from './ns-access-neuro-records-5.mjs';
import {ACCESS_DISABILITY_1} from './ns-access-disability-records-1.mjs';
import {ACCESS_DISABILITY_2} from './ns-access-disability-records-2.mjs';
import {ACCESS_DISABILITY_3} from './ns-access-disability-records-3.mjs';
import {ACCESS_DISABILITY_4} from './ns-access-disability-records-4.mjs';
import {ACCESS_DEEPENING} from './ns-access-deepening.mjs';

const neuro=[...ACCESS_NEURO_1,...ACCESS_NEURO_2,...ACCESS_NEURO_3,...ACCESS_NEURO_4,...ACCESS_NEURO_5];
const disability=[...ACCESS_DISABILITY_1,...ACCESS_DISABILITY_2,...ACCESS_DISABILITY_3,...ACCESS_DISABILITY_4];
const groups=INCLUSIVE_GROUPS_A.filter(g=>['neuro','disability'].includes(g.id));
const titles=new Map(groups.flatMap(g=>g.rows.map(r=>[r[0],{title:r[1],domain:g.id}])));
const count=s=>String(s||'').trim().split(/\s+/).filter(Boolean).length;
const fail=(id,problem)=>{throw Error('Access manual '+id+': '+problem);};
const SOURCES={
 autism:['NICE CG142, Autism in adults: assessment and management','https://www.nice.org.uk/guidance/cg142/chapter/Recommendations'],
 adhd:['NICE NG87, ADHD: diagnosis and management','https://www.nice.org.uk/guidance/ng87/chapter/Recommendations'],
 learning:['NHS, Dyslexia in adults and learning support','https://www.nhs.uk/conditions/dyslexia-in-adults/'],
 dcd:['NHS, Dyspraxia (DCD) in adults','https://www.nhs.uk/conditions/developmental-coordination-disorder-dyspraxia-in-adults/'],
 tics:['NHS, Tics and appropriate treatment','https://www.nhs.uk/conditions/tics/'],
 access:['NHS England, Accessible Information Standard (2025)','https://www.england.nhs.uk/accessible-information-standard/'],
 equality:['GOV.UK, Disability and reasonable adjustments in employment','https://www.gov.uk/if-you-become-disabled/if-youre-in-employment-and-become-disabled'],
 fatigue:['NICE NG206, ME/CFS: diagnosis and management','https://www.nice.org.uk/guidance/ng206/chapter/Recommendations'],
 health:['NHS, Symptoms and health conditions','https://www.nhs.uk/conditions/'],
 pain:['NICE NG193, Chronic primary pain','https://www.nice.org.uk/guidance/ng193/chapter/Recommendations'],
 hearing:['NHS England, Accessible Information Standard','https://www.england.nhs.uk/accessible-information-standard/'],
 vision:['NHS England, Accessible Information Standard','https://www.england.nhs.uk/accessible-information-standard/'],
 medicines:['NHS, Medicines information','https://www.nhs.uk/medicines/'],
 trauma:['NICE NG116, Post-traumatic stress disorder','https://www.nice.org.uk/guidance/ng116/chapter/Recommendations'],
 safeguarding:['NHS, Social care and support guidance','https://www.nhs.uk/conditions/social-care-and-support-guide/'],
 benefits:['GOV.UK, Personal Independence Payment','https://www.gov.uk/pip']
};
const RISK=new Set([
 'autistic-shutdown','autistic-meltdown','neurodivergent-burnout','tics-and-tourette',
 'medical-gaslighting','diagnostic-delay','long-covid-experiences','medicine-side-effects',
 'medical-trauma','care-dependence-autonomy','disability-benefits-pressure',
 'healthcare-access-discrimination','hearing-access','vision-access','pacing-and-energy',
 'neurodivergent-masking','neurodivergence-stigma'
]);
const privacy=new Set([
 'neurodivergent-masking','diagnostic-uncertainty-neuro','neurodivergence-stigma',
 'medical-gaslighting','diagnostic-delay','long-covid-experiences','medicine-side-effects',
 'medical-trauma','care-dependence-autonomy','disability-benefits-pressure',
 'healthcare-access-discrimination','rejection-sensitivity'
]);
const stageLabels={
 neuro:['The actual situation','The communication or activity demand','What the person could access','The emotional experience','An immediate response','What the response may protect','Sensory and cognitive conditions','Social expectations or power','An accessible alternative','A chosen next step'],
 disability:['What happened or changed','The physical or access barrier','What was observed','How the person experienced it','The response available then','What the response made possible','Health, access and resources','Other people and institutional duties','A realistic accommodation','A safe and chosen next step']
};
const trim=s=>String(s||'').trim();
const asSentences=s=>String(s||'').split(/(?<=[.!?])\s+(?=[A-Z])/).filter(Boolean);

function build(record,domain){
 const [id,standfirst,readTitle,paras,pathways,safety,sourceKeys]=record;
 if(!titles.has(id)||titles.get(id).domain!==domain)fail(id,'incorrect catalogue or unknown entry');
 if(!Array.isArray(paras)||paras.length!==6||paras.some(p=>count(p)<35))fail(id,'six original substantive sections required');
 if(!ACCESS_DEEPENING[id]||count(ACCESS_DEEPENING[id])<55)fail(id,'individually written additional depth missing');
 if(!Array.isArray(pathways)||pathways.length!==4)fail(id,'four distinct experiences required');
 if(!safety||count(safety)<18)fail(id,'safety note missing');
 const roots=[],profiles=[],mechanisms=[],routes=[],whyCases=[],actions=[],support=[],scenes=new Set(),routeNames=new Set();
 pathways.forEach((p,i)=>{
  const [name,detail,mechanism,questions,situations,tips,help]=p;
  if(!name||routeNames.has(name)||count(detail)<18||count(mechanism)<7)fail(id,'weak or duplicated pathway '+i);
  if(questions.length!==4||questions.some(q=>q.length<12))fail(id,'insufficiently specific journal questions '+i);
  if(situations.length!==4||situations.some(x=>x.length<18||x.length>115||scenes.has(x)))fail(id,'short distinct situation cards needed '+i);
  if(tips.length!==5||help.length!==5||tips.some(x=>x.length<22)||help.some(x=>x.length<22))fail(id,'five direct actions and five support actions per pathway '+i);
  routeNames.add(name);
  situations.forEach(x=>scenes.add(x));
  const root='path-'+i;
  roots.push([root,name]);profiles.push([name,detail]);mechanisms.push([name,mechanism]);
  routes.push({
   id:root,label:name,title:name,description:detail,
   finish:'You can keep the part that helps and change the part that does not. Your needs and choices remain yours.',
   practiceTitle:'One useful next step',practice:tips[0],
   questions:questions.map((q,j)=>[
    q,
    j===0?detail:j===1?mechanism:j===2?paras[4]:tips[j],
    j===0?paras[1]:j===1?detail:j===2?paras[3]:tips[j],
    j===3?'actions':j===2?'support':''
   ])
  });
  actions.push(...tips);support.push(...help);
  situations.forEach((scene,j)=>whyCases.push({
   situation:scene,root,
   interpretation:detail,
   emotion:'The reaction may depend on the person and what this situation meant to them. '+mechanism,
   response:tips[j],
   function:mechanism,
   need:name,
   rule:questions[1],
   adaptation:help[j],
   alternative:paras[4],
   action:tips[(j+1)%5]
  }));
 });
 if(new Set(actions.map(x=>x.toLowerCase())).size!==20||new Set(support.map(x=>x.toLowerCase())).size!==20)fail(id,'repeated practical or support advice');
 const article=[paras[0],paras[1],pathways[0][1],paras[2],pathways[1][1],paras[3],pathways[2][1],paras[4]+' '+ACCESS_DEEPENING[id],pathways[3][1],paras[5]];
 if(count(article.join(' '))<405)fail(id,'article has inadequate depth');
 const sourceList=[...new Set(sourceKeys)].map(k=>SOURCES[k]||fail(id,'unknown research source '+k));
 if(id==='long-covid-experiences')sourceList.unshift(['NICE NG188, Managing the long-term effects of COVID-19','https://www.nice.org.uk/guidance/ng188/chapter/Recommendations']);
 if(id==='disability-benefits-pressure')sourceList.unshift(['GOV.UK, PIP eligibility and assessment','https://www.gov.uk/pip']);
 if(id==='hearing-access'||id==='vision-access'||id==='healthcare-access-discrimination')sourceList.unshift(['NHS England, 2025 Accessible Information Standard requirements','https://www.england.nhs.uk/long-read/accessible-information-standard-requirements-dapb1605/']);
 const g={
  id,title:titles.get(id).title,domain,standfirst,readTitle,article,
  mechanisms,profiles,roots,routes,
  now:{title:'What might help right now?',paras:[paras[4]],steps:[pathways[0][5][0],pathways[1][5][0],pathways[2][5][0]]},
  whyIntro:paras[1]+' '+ACCESS_DEEPENING[id],
  whyQuestions:[
   ...pathways.map(p=>p[3][0]),
   ...pathways.map(p=>p[3][1]),
   pathways[0][3][2],pathways[3][3][3]
  ],
  whyStages:stageLabels[domain],whyCases,
  ideas:{actions,support},
  sources:sourceList,
  safety,prominentSafety:RISK.has(id)?safety:'',
  noPersist:privacy.has(id),
  hideCycle:true,
  pullIndex:6,
  evidence:'These examples are grounded in distinct ways this experience can arise. They are not a diagnostic test or a claim to know the reader’s hidden motives. Access needs, physical health, consent, safety and institutional responsibility should be considered before choosing a response.'
 };
 return Object.freeze(g);
}
const allNeuro=neuro.map(r=>build(r,'neuro'));
const allDisability=disability.map(r=>build(r,'disability'));
export const ACCESS_GUIDES=Object.freeze([...allNeuro,...allDisability]);
export const ACCESS_IDS=Object.freeze(ACCESS_GUIDES.map(g=>g.id));
export const ACCESS_BY_ID=new Map(ACCESS_GUIDES.map(g=>[g.id,g]));
export const ACCESS_GROUPS=Object.freeze({
 neuro:Object.freeze(allNeuro.map(g=>g.id)),
 disability:Object.freeze(allDisability.map(g=>g.id))
});
if(allNeuro.length!==23||allDisability.length!==19||ACCESS_BY_ID.size!==42)fail('all','expected exactly 23 neuro and 19 disability topics');
for(const group of groups){
 const expected=new Set(group.rows.map(r=>r[0]));
 const actual=new Set(ACCESS_GROUPS[group.id]);
 if(expected.size!==actual.size||[...expected].some(id=>!actual.has(id)))fail(group.id,'a catalogue topic lacks an individually authored field guide');
}
