/* Health catalogue manual assembler.
 * Every paragraph, situation, question, and popup suggestion is authored in
 * the corresponding topic record. This module only supplies existing schema.
 * None of these reflective pathways is a diagnostic or treatment algorithm.
 */
import {BODY_GUIDES} from './ns-body-guide-data.mjs';
import {problemIndex} from './ns-problem-map.mjs';
import {extendedProblemIndex} from './ns-atlas-extended.mjs';
import {preciseProfiles} from './ns-precision-content.mjs';
import {INCLUSIVE_GROUPS_A} from './ns-inclusive-topics-a.mjs';
import {HEALTH_BODY_RECORDS} from './ns-health-body-records.mjs';
import {HEALTH_SEXUALITY_RECORDS} from './ns-health-sexuality-records.mjs';
import {SENSORY_ADVICE} from './ns-health-sensory-advice.mjs';

const canonical=new Map([
 ...problemIndex,...extendedProblemIndex,...preciseProfiles.map(p=>({id:p.id,title:p.title,domain:p.id==='insomnia'?'body':null})),
 ...INCLUSIVE_GROUPS_A.filter(g=>g.id==='sexuality').flatMap(g=>g.rows.map(r=>({id:r[0],title:r[1],domain:'sexuality'})))
].map(p=>[p.id,p]));
const expectedBody=['sleep','fatigue','sensory','health-worry','body-image','eating','pain','insomnia',
 'sleep-onset','sleep-maintenance','early-waking','nightmare-distress','daytime-sleepiness','physical-panic',
 'chronic-headache','stomach-distress','somatic-worry','appetite-loss','binge-eating','food-restriction',
 'purging-urges','sexual-pain','low-desire','body-checking','sensory-seeking'];
const expectedSex=INCLUSIVE_GROUPS_A.find(g=>g.id==='sexuality')?.rows.map(r=>r[0])||[];
if(expectedBody.length!==25||expectedSex.length!==25)throw Error('Health catalogue counts have changed');
const sourceByKey={
 insomnia:['NHS: Insomnia','https://www.nhs.uk/conditions/insomnia/'],
 apnea:['NHS: Sleep apnoea','https://www.nhs.uk/conditions/sleep-apnoea/'],
 eating:['NICE NG69: Eating disorders','https://www.nice.org.uk/guidance/ng69'],
 pain:['NICE NG193: Chronic primary pain','https://www.nice.org.uk/guidance/ng193'],
 headache:['NICE CG150: Headaches','https://www.nice.org.uk/guidance/cg150'],
 fatigue:['NICE NG206: ME/CFS','https://www.nice.org.uk/guidance/ng206'],
 anxiety:['NICE CG113: Anxiety disorders','https://www.nice.org.uk/guidance/cg113'],
 perinatal:['NICE CG192: Antenatal and postnatal mental health','https://www.nice.org.uk/guidance/cg192'],
 postnatal:['NICE NG194: Postnatal care','https://www.nice.org.uk/guidance/ng194'],
 miscarriage:['NICE NG126: Ectopic pregnancy and miscarriage','https://www.nice.org.uk/guidance/ng126'],
 fertility:['NICE NG257: Fertility problems','https://www.nice.org.uk/guidance/ng257'],
 menopause:['NICE NG23: Menopause','https://www.nice.org.uk/guidance/ng23'],
 menstrual:['NICE NG88: Heavy menstrual bleeding','https://www.nice.org.uk/guidance/ng88'],
 sexual:['NHS: Sexual health','https://www.nhs.uk/live-well/sexual-health/'],
 contraception:['NHS: Contraception','https://www.nhs.uk/contraception/'],
 health:['NHS: Symptoms and conditions','https://www.nhs.uk/conditions/']
};
const count=s=>String(s||'').trim().split(/\s+/).filter(Boolean).length;
const fail=(id,message)=>{throw Error('Health manual '+id+': '+message)};
const safetySensitive=new Set([
 'eating','binge-eating','food-restriction','purging-urges','sexual-pain','sexual-trauma-impact','sexual-health-anxiety','pregnancy-loss','postpartum-mental-health','contraceptive-concerns','bodily-autonomy','sexual-boundary-uncertainty'
]);
const stages={
 body:['What happened or changed','What you actually noticed','When it happens','What it affects','The immediate experience','What the response makes possible','Physical or environmental factors','Potential risks and constraints','Which assistance may be useful','The next safe decision'],
 sexuality:['The situation','Your own wishes and experience','Other people’s expectations','Your emotional response','What happened in this example','Health and bodily considerations','Consent and practical constraints','What is known or uncertain','Support and information','A freely chosen next step']
};
function build(r){
 const [id,standfirst,readTitle,paras,pathways,safety,sourceKeys,privacy=false]=r;
 const meta=canonical.get(id),domain=meta?.domain;
 if(!meta||!['body','sexuality'].includes(domain))fail(id,'not found in the intended catalogue');
 if(!Array.isArray(paras)||paras.length!==6||paras.some(x=>count(x)<37))fail(id,'needs 6 substantive individual prose sections');
 if(!Array.isArray(pathways)||pathways.length!==4)fail(id,'requires four distinct clinical or contextual pathways');
 const names=new Set(),allScenes=new Set();
 const profiles=[],mechanisms=[],roots=[],routes=[],cases=[],actions=[],support=[];
 pathways.forEach((p,i)=>{
  const [name,detail,insight,questions,scenes,tips,help]=p,root='path-'+i;
  if(!name||names.has(name)||count(detail)<25||count(insight)<11)fail(id,'weak or repeated pathway '+i);
  if(!Array.isArray(questions)||questions.length!==4||questions.some(x=>x.length<22))fail(id,'journal questions '+i);
  if(!Array.isArray(scenes)||scenes.length!==4||scenes.some(s=>s.length<18||s.length>115||allScenes.has(s)))fail(id,'short unique scene cards '+i);
  if(!Array.isArray(tips)||tips.length!==5||tips.some(t=>t.length<35))fail(id,'needs five direct actions '+i);
  if(!Array.isArray(help)||help.length!==5||help.some(t=>t.length<35))fail(id,'needs five support suggestions '+i);
  names.add(name);scenes.forEach(s=>allScenes.add(s));
  profiles.push([name,detail]);mechanisms.push([name,insight]);
  roots.push([root,name]);
  const next=tips[0];
  routes.push({
   id:root,label:name,title:name,description:detail,
   finish:'You have identified what matters in this version of the difficulty. The next step belongs to you, and you can change it as your circumstances become clearer.',
   practiceTitle:'One useful next step',practice:next,
   questions:questions.map((q,j)=>[q,j===0?detail:j===1?insight:j===2?paras[4]:tips[0],j===0?detail:j===1?insight:j===2?paras[2]:tips[0],j===3?'actions':j===2?'support':''])
  });
  actions.push(...tips);support.push(...help);
  scenes.forEach((scene,j)=>{
   cases.push({
    situation:scene,root,
    interpretation:detail,
    emotion:insight,
    response:scene,
    function:insight,
    need:name,
    rule:questions[1],
    adaptation:tips[(j+1)%5],
    alternative:paras[4],
    action:tips[(j+2)%5]
   });
  });
 });
 if(new Set(actions.map(s=>s.toLowerCase())).size!==20)fail(id,'repeated practical advice');
 if(new Set(support.map(s=>s.toLowerCase())).size!==20)fail(id,'repeated help advice');
 const article=[paras[0],paras[1],pathways[0][1],paras[2],pathways[1][1],
  paras[3],pathways[2][1],paras[4],pathways[3][1],paras[5]];
 if(count(article.join(' '))<380)fail(id,'article shorter than 380 words');
 const sourceList=[...new Set(sourceKeys)].map(key=>sourceByKey[key]||fail(id,'unknown source '+key));
 if(sourceList.length===0)fail(id,'missing sources');
 const g={
  id,title:meta.title,domain,standfirst,readTitle,article,
  mechanisms,profiles,roots,routes,
  now:{title:'What might help right now?',paras:[paras[4]],steps:[pathways[0][5][0],pathways[1][5][0],pathways[2][5][0]]},
  whyIntro:paras[1],
  whyQuestions:[...pathways.map(p=>p[3][0]),...pathways.map(p=>p[3][1]),pathways[0][3][2],pathways[3][3][3]],
  whyStages:stages[domain],whyCases:cases,
  ideas:{actions,support},
  sources:sourceList,
  safety,prominentSafety:safetySensitive.has(id)?safety:'',
  noPersist:domain==='sexuality'||safetySensitive.has(id)||privacy,
  hideCycle:true,contextSequence:true,
  cycle:[paras[0],pathways[0][2],pathways[1][2],paras[5]],
  pullIndex:6,
  evidence:'This page describes possible physical, psychological and social influences. The alternatives are educational and cannot diagnose an illness or establish a hidden cause. Choice, consent, access to assessment and practical safety take priority.',
 };
 return Object.freeze(g);
}
const authored=Object.freeze([...HEALTH_BODY_RECORDS,...HEALTH_SEXUALITY_RECORDS].map(build));
const legacy=BODY_GUIDES.map(g=>Object.freeze({...g,domain:'body',ideas:g.ideas||(g.id==='sensory'?SENSORY_ADVICE:{
 actions:Array.isArray(g.actions)?g.actions:[],
 support:Array.isArray(g.support)?g.support:[],
 }),noPersist:g.noPersist||false,hideCycle:g.hideCycle??true}));
export const HEALTH_GUIDES=Object.freeze([...legacy,...authored]);
export const HEALTH_IDS=Object.freeze(HEALTH_GUIDES.map(g=>g.id));
export const HEALTH_BY_ID=new Map(HEALTH_GUIDES.map(g=>[g.id,g]));
export const HEALTH_GROUPS=Object.freeze({
 body:Object.freeze(expectedBody.filter(id=>HEALTH_BY_ID.has(id))),
 sexuality:Object.freeze(expectedSex.filter(id=>HEALTH_BY_ID.has(id)))
});
if(HEALTH_BY_ID.size!==50||HEALTH_IDS.length!==50)throw Error('Expected 50 unique Body Sleep & Intimacy guides');
for(const [name,ids] of [['body',expectedBody],['sexuality',expectedSex]])for(const id of ids){
 if(!HEALTH_BY_ID.has(id))throw Error('Missing '+name+' guide: '+id);
}
