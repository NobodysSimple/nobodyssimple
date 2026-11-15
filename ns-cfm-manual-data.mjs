/* Culture, Faith & Migration, with the same field-guide schema and interaction
 * used by Feelings & mental health, Thinking, Relationships, and Family.
 * Each source topic has authored opening, context, dilemmas, three additional
 * long-form passages and problem-specific routes. No automatic diagnosis.
 */
import {CFM_GUIDES} from './ns-cfm-guides.mjs';
import {INCLUSIVE_GROUPS_A} from './ns-inclusive-topics-a.mjs';
import {CFM_EXTRA_CULTURE} from './ns-cfm-extra-culture.mjs';
import {CFM_EXTRA_FAITH} from './ns-cfm-extra-faith.mjs';
import {CFM_EXTRA_MIGRATION} from './ns-cfm-extra-migration.mjs';
const additions={...CFM_EXTRA_CULTURE,...CFM_EXTRA_FAITH,...CFM_EXTRA_MIGRATION};
const domains=['culture','faith','migration'];
const groups=INCLUSIVE_GROUPS_A.filter(g=>domains.includes(g.id));
const catalogue=new Map(groups.flatMap(g=>g.rows.map(row=>[row[0],{id:row[0],title:row[1],domain:g.id,flags:row[4]||''}])));
const fail=(id,reason)=>{throw Error('Culture/Faith/Migration '+id+': '+reason);};
const strip=s=>String(s||'').replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'');
const sentences=s=>String(s||'').split(/(?<=[.!?])\s+(?=[A-Z“"'])/).map(x=>x.trim()).filter(x=>x.length>20);
const wordCount=s=>String(s||'').split(/\s+/).filter(Boolean).length;
const trimFirst=s=>{const x=String(s||'').trim();return x?x[0].toLowerCase()+x.slice(1):x;};
const stageNames={
 culture:['What someone said or did','What is observable','What was assumed','How it affected you','How you responded','What your response protected','Social or cultural expectation','Power and real-world constraints','What you need to be treated fairly','Your safest next step'],
 faith:['The experience','What you were told or believed','What it means to you','How you felt','What you did','What you hoped your response would do','A belief or community expectation','Choice, dependence and safety','Alternative interpretations or options','What you want to do next'],
 migration:['The event or update','What is confirmed','What is still uncertain','The emotional effect','Your immediate response','What your response helped manage','Rules, documents or expectations','Resources, safety and support','What is actually possible','A realistic next step']
};
const highPrivacy=new Set(['racial-profiling','institutional-racism','community-racial-harm','religious-discrimination','religious-trauma','fear-divine-punishment','faith-community-pressure','religious-family-conflict','immigration-uncertainty','asylum-stress','refugee-adjustment','xenophobia','migration-family-separation','migrant-work-exploitation','uncertain-reunification']);
const sources={
 culture:[['Paradies et al. (2015), systematic review and meta-analysis of racism and health','https://pubmed.ncbi.nlm.nih.gov/26398658/']],
 faith:[['Religious and spiritual struggles: research background (deconversion study, 2023)','https://pubmed.ncbi.nlm.nih.gov/37664880/']],
 migration:[['WHO (2023), refugee and migrant mental health: risk, protection and access to care','https://www.who.int/publications/i/item/9789240081840']]
};
const safetyNotes={
 'racial-discrimination':'Racially unequal treatment may involve real threats or discrimination. Do not approach an unsafe person or assume changing your thoughts will resolve their behaviour. Appropriate practical or legal support may matter.',
 'racial-profiling':'If an authority or security officer has threatened or harmed you, immediate safety takes priority. Do not use a journal as a substitute for qualified legal advice, particularly if an encounter is ongoing.',
 'institutional-racism':'Complaints can carry employment, housing or access consequences. Seek confidential information before action, and avoid identifying details on a shared or monitored device.',
 'religious-discrimination':'Threats or hate incidents should be taken seriously. You are not required to debate your religious identity with someone who is unsafe or to make a complaint without appropriate support.',
 'religious-trauma':'If a person or group is still monitoring, coercing or threatening you, prioritise safety and confidential support. You are not required to recount painful details in a journal or confront anybody.',
 'fear-divine-punishment':'Repeated confession, checking or reassurance may be related to scrupulosity in OCD. A journal must not be used as a new reassurance ritual. OCD-informed help should be sensitive to religious practice.',
 'faith-community-pressure':'If refusing a demand could cost you housing, income, access to children or physical safety, plan privately with appropriate support before discussing it openly.',
 'religious-family-conflict':'If religious disagreement could result in threats or loss of essential support, protect your privacy and seek independent guidance before disclosure.',
 'spiritual-experience':'New, severe or frightening experiences that disrupt sleep, functioning or safety deserve appropriate medical and mental health assessment. Spiritual interpretations can be respected without assuming a cause.',
 'existential-anxiety':'If fears about existence lead to thoughts of suicide or you cannot keep yourself safe, seek urgent human support now. You do not need to solve philosophical questions before accepting care.',
 'immigration-uncertainty':'Immigration status and deadlines require reliable official information and qualified immigration advice. This educational page cannot confirm your status or recommend legal action.',
 'asylum-stress':'Do not enter names, identifying testimony or case details on a shared or monitored device. Qualified legal representation, accurate interpretation and immediate safety and housing needs take priority.',
 'refugee-adjustment':'Distress after displacement can involve current housing, safety and health needs as well as painful memories. Do not force disclosure of traumatic events. Seek appropriate practical or clinical support.',
 'xenophobia':'If an incident involves threats or violence, prioritise safety. You may be entitled to support or a formal remedy, but confrontation is not required.',
 'migrant-work-exploitation':'An employer may have power over work, housing or sponsorship. Do not confront or leave employment solely on the basis of this page. Seek confidential qualified immigration and employment advice.',
 'uncertain-reunification':'Reunification decisions and deadlines need qualified and jurisdiction-specific legal advice. Do not share case identifiers on a shared device.'
};
function articleFor(d,extra){
 const open=d.opening.split(/\n\s*\n/).filter(Boolean);
 if(open.length!==2)fail(d.id,'expected two authored opening paragraphs');
 if(extra.length!==3)fail(d.id,'missing three individually authored deepening passages');
 const v=d.versions;
 const expand=(i)=>{
  const detail=strip(v[i][1]),proposal=strip(v[i][2]),question=strip(d.questions[Math.min(i+1,4)]);
  return detail+'. '+proposal+'. '+question+' These are questions about the conditions of your life, and only you can judge whether this particular description fits.';
 };
 return [open[0],open[1],extra[0],d.why,extra[1],expand(0),expand(1),extra[2],expand(2),
  d.closing+' '+d.questions[4]+' You can leave the question open or return to it later. Choose what is safe and useful in your circumstances.'];
}
function makeExamples(d,article,profiles,roots){
 const sentencesPool=article.flatMap((s,i)=>sentences(s).map(x=>({s:x,section:i})))
  .filter(x=>/you|your|people|someone|family|home|work|community|faith|migration|religion|job|place|language|belief|relative|person|organisation|institution/i.test(x.s)&&x.s.length>40&&x.s.length<250);
 if(sentencesPool.length<16)fail(d.id,'not enough specific material to create 16 distinct worked cases');
 const used=new Set();
 const examples=[];
 for(let i=0;i<4;i++){
  for(let j=0;j<4;j++){
   const index=(i*4+j*3)%sentencesPool.length;let current=index,scene='';
   for(let attempt=0;attempt<sentencesPool.length;attempt++){
    const option=sentencesPool[current].s;
    if(!used.has(option)){scene=option;used.add(option);break}
    current=(current+1)%sentencesPool.length;
   }
   if(!scene)fail(d.id,'repeated scenarios');
   const profile=profiles[i],action=i<3?d.versions[i][2]:d.versions[0][2];
   examples.push({
    situation:scene,
    interpretation:profile[1]+' This is a possible reading of the situation, not proof of what someone secretly intended.',
    emotion:d.domain==='migration'?'Uncertainty, longing or frustration can be relevant, depending on what you experienced.':
     d.domain==='faith'?'You might notice grief, conviction, fear or relief. You can use your own words for what you felt.':
     'You may feel hurt, anger, unease or none of these. The circumstances matter more than a prescribed feeling.',
    response:'Notice the response you actually made in that moment and whether it had to protect you from a real consequence.',
    function:'Consider the costs and benefits of that response in the actual setting. Personal coping alone cannot change someone else’s harmful actions.',
    need:profile[0],rule:'Separate the known event from expectations or beliefs you have had to carry about it.',
    adaptation:profile[1],alternative:article[(i+j+2)%article.length],
    action,root:roots[i][0]
   });
  }
 }
 return examples;
}
function makeRoutes(d,profiles){
 const mapQuestions=[d.questions[0],d.questions[1],d.questions[2],d.questions[4]];
 const map={
  id:'map',title:d.journalTitle,label:d.journalTitle,
  description:'Work out which parts of this particular experience are affecting you, and what you might need next.',
  finish:'You have named what matters in your situation. You can choose which part to address, and whether now is the right time.',
  practiceTitle:'Your next decision',practice:d.versions[0][2],
  questions:mapQuestions.map((question,i)=>[question,
    i===0?'You can use a recent moment or leave this unanswered.':i===3?'Choose an option only if it fits your safety and resources.':d.why,
    i===0?d.opening.split(/\n\s*\n/)[0]:i===1?d.versions[0][1]:i===2?d.versions[1][1]:d.versions[2][2],
    i===3?'actions':''])
 };
 const specific=d.versions.map((v,i)=>{
  const next=d.versions[(i+1)%3];
  const questions=[
   'Can you think of a recent moment connected to '+v[0].toLowerCase()+'? What happened?',
   'Which part of this description is familiar to you: '+strip(v[1])+'?',
   'What has this particular experience made harder for you, and which people or conditions affect your options?',
   'Would this response fit your situation: '+strip(v[2])+'? What would you change?'
  ];
  return {id:'path-'+i,title:v[0],label:v[0],description:v[1],
   finish:d.closing,practiceTitle:'A possible next step',practice:v[2],
   questions:questions.map((q,j)=>[q,
    j===0?d.questions[0]:j===1?d.questions[1]:j===2?d.questions[3]:d.questions[4],
    j===0?v[1]:j===1?d.why:j===2?next[1]:v[2],
    j===3?'actions':j===2?'support':''])};
 });
 return [map,...specific];
}
function makeIdeas(d,article,profiles,routes,examples){
 const actions=[
 ...d.versions.map(v=>v[2]),
 ...d.versions.map(v=>'Explore what would need to change before attempting this: '+strip(v[2])+'.'),
 ...d.questions.map(q=>'Write a few words about this question, if it is helpful: '+q),
 ...article.slice(2,8).map(s=>'Consider whether this is relevant to your situation: '+sentences(s)[0]),
 ...examples.slice(0,7).map(ex=>'Use this worked example to ask what fits your life: '+ex.situation)
 ];
 const support=[
 ...d.versions.map(v=>'Ask a trusted person about the practical concern behind '+v[0].toLowerCase()+': '+strip(v[1])+'.'),
 ...d.versions.map(v=>'Request support for this possible step only if safe: '+strip(v[2])+'.'),
 ...d.questions.map(q=>'Talk this through with someone who listens without deciding the answer for you: '+q),
 ...article.slice(2,8).map(s=>'You might discuss this part of the experience with a relevant support person: '+sentences(s)[0]),
 ...examples.slice(0,7).map(ex=>'A relevant service or ally may be able to help with: '+ex.situation)
 ];
 if(actions.length!==24||support.length!==24)fail(d.id,'optional ideas must have 24 distinct entries per category');
 return {actions,support};
}
function build(id){
 const d=CFM_GUIDES[id],entry=catalogue.get(id),extra=additions[id];
 if(!d||!entry||!extra)fail(id,'missing individual guide, catalogue entry or editorial depth');
 if(d.domain!==entry.domain)fail(id,'wrong group assignment');
 const article=articleFor(d,extra);
 if(article.length!==10||wordCount(article.join(' '))<400)fail(id,'article below 400 words ('+wordCount(article.join(' '))+')');
 const profiles=[...d.versions.map(v=>[v[0],v[1]]),
  ['The part you cannot solve alone',d.questions[3]+' '+d.questions[4]+' This may involve changes in people, policies or practical circumstances beyond your immediate control.']];
 const roots=profiles.map((p,i)=>['path-'+i,p[0]]);
 const routes=makeRoutes(d,profiles);
 const whyCases=makeExamples(d,article,profiles,roots);
 const ideas=makeIdeas(d,article,profiles,routes,whyCases);
 const sourceList=[...sources[d.domain]];
 if(id==='fear-divine-punishment')sourceList.unshift(['NICE CG31: OCD symptoms involving religion and culture','https://www.nice.org.uk/guidance/cg31/chapter/Recommendations']);
 if(id==='losing-faith')sourceList[0]=['Religious conversion and deconversion, longitudinal study (2023)','https://pubmed.ncbi.nlm.nih.gov/37664880/'];
 if(id==='racial-discrimination'||id==='institutional-racism'||id==='microaggressions')sourceList[0]=sources.culture[0];
 if(id==='fear-divine-punishment')sourceList.push(['International OCD Foundation: faith and scrupulosity','https://iocdf.org/faith-ocd/what-is-ocd-scrupulosity/']);
 const whyQuestions=[
  d.questions[0],d.questions[1],d.questions[2],d.questions[3],d.questions[4],
  'When '+d.versions[0][0].toLowerCase()+' is relevant, which parts of '+strip(d.versions[0][1]).toLowerCase()+' are actually happening?',
  'Does '+d.versions[1][0].toLowerCase()+' describe the situation accurately, or does something important differ?',
  'What do you want to protect when '+d.versions[2][0].toLowerCase()+' becomes difficult?',
  'How would your options change if you had the support needed for this: '+strip(d.versions[1][2]).toLowerCase()+'?',
  'If you chose one safe next step, would '+strip(d.versions[2][2]).toLowerCase()+' suit your circumstances?'
 ];
 const safety=safetyNotes[id]||(
 d.domain==='culture'
 ?'Cultural identity does not require treatment. If an incident involves discrimination, retaliation or danger, take the real circumstances seriously. Avoid confrontation where it could risk your safety.'
 :d.domain==='faith'
 ?'Religious belief and doubt are not diagnoses. Coercion, threats or major distress may require trusted and qualified support. Your decisions about faith and disclosure remain your own.'
 :'Visa rules, employment rights and protection claims require current qualified advice in the relevant jurisdiction. If safety, housing or access to care is at risk, prioritise practical assistance.'
 );
 return Object.freeze({
  id,title:entry.title,domain:entry.domain,
  standfirst:sentences(d.opening)[0]||article[0].slice(0,150),
  readTitle:d.journalTitle.replace(/ map$/i,''),
  article,mechanisms:d.versions.map(v=>[v[0],v[1]+' '+d.why]),
  profiles,cycle:[
   sentences(article[0])[0],
   d.versions[0][1],
   d.versions[1][1],
   'What you could do depends on the people, conditions and practical choices involved.'
  ],
  now:{title:d.versions[0][0],paras:[article[8]],steps:d.versions.map(v=>v[2])},
  routes,roots,whyIntro:extra[0]+' '+d.why,whyQuestions,
  whyStages:stageNames[d.domain],whyCases,ideas,
  sources:sourceList,safety,prominentSafety:highPrivacy.has(id)?safety:'',
  noPersist:highPrivacy.has(id),
  contextSequence:true,pullIndex:6,
  evidence:'This is a topic-specific educational formulation informed by relevant research and support guidance. The possible routes and examples are not validated diagnoses or predictions. For structural harms, the facts, rights and available practical remedies matter more than changing a personal interpretation.'
 });
}
export const CFM_GUIDES_FULL=Object.freeze([...catalogue.keys()].map(build));
export const CFM_IDS=Object.freeze(CFM_GUIDES_FULL.map(g=>g.id));
export const CFM_BY_ID=new Map(CFM_GUIDES_FULL.map(g=>[g.id,g]));
export const CFM_GROUPS=Object.freeze(Object.fromEntries(domains.map(domain=>[domain,Object.freeze(CFM_GUIDES_FULL.filter(g=>g.domain===domain).map(g=>g.id))])));
if(CFM_IDS.length!==45||CFM_BY_ID.size!==45)fail('all','expected 45 distinct complete field-guide manuals');
