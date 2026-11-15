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
import {CFM_PROSE_CULTURE} from './ns-cfm-prose-culture.mjs';
import {CFM_PROSE_FAITH} from './ns-cfm-prose-faith.mjs';
import {CFM_PROSE_MIGRATION} from './ns-cfm-prose-migration.mjs';
import {CFM_SCENES_CULTURE} from './ns-cfm-scenes-culture.mjs';
import {CFM_SCENES_FAITH} from './ns-cfm-scenes-faith.mjs';
import {CFM_SCENES_MIGRATION} from './ns-cfm-scenes-migration.mjs';
import {CFM_ADVICE_CULTURE} from './ns-cfm-advice-culture.mjs';
import {CFM_ADVICE_FAITH} from './ns-cfm-advice-faith.mjs';
import {CFM_ADVICE_MIGRATION} from './ns-cfm-advice-migration.mjs';
import {CFM_ADVICE_MORE_CULTURE} from './ns-cfm-advice-more-culture.mjs';
import {CFM_ADVICE_MORE_FAITH} from './ns-cfm-advice-more-faith.mjs';
import {CFM_ADVICE_MORE_MIGRATION} from './ns-cfm-advice-more-migration.mjs';
const additions={...CFM_EXTRA_CULTURE,...CFM_EXTRA_FAITH,...CFM_EXTRA_MIGRATION};
const authoredProse={...CFM_PROSE_CULTURE,...CFM_PROSE_FAITH,...CFM_PROSE_MIGRATION};
const authoredScenes={...CFM_SCENES_CULTURE,...CFM_SCENES_FAITH,...CFM_SCENES_MIGRATION};
const authoredAdvice={...CFM_ADVICE_CULTURE,...CFM_ADVICE_FAITH,...CFM_ADVICE_MIGRATION};
const additionalAdvice={...CFM_ADVICE_MORE_CULTURE,...CFM_ADVICE_MORE_FAITH,...CFM_ADVICE_MORE_MIGRATION};
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
const extraContext={
 'language-discrimination':'You may know exactly what you meant and still leave a conversation feeling that you were not listened to. The fairness of the exchange matters as much as your fluency.',
 'intergenerational-cultural-conflict':'You may sometimes wish you could explain your choices without being asked to reject your family’s history. That wish is reasonable, even if agreement is not possible.',
 'community-racial-harm':'When an incident attracts public attention, the same event can bring practical questions about safety and much longer questions about belonging. Each person may need a different response, and nobody owes the public a performance of grief.',
 'historical-collective-trauma':'A careful account should name which historical event and present consequence are being discussed. That keeps remembrance accurate and makes it possible to distinguish evidence about institutions from assumptions about individual families.',
 'intersectional-discrimination':'A person can spend considerable time being transferred between departments, each responsible for only one part of the problem. Coordinated support begins when someone accepts responsibility for understanding the entire barrier.',
 'language-barriers':'Being able to ask a question privately can be especially important when a medical or legal issue is involved. The goal is an informed decision that belongs to you.',
 'xenophobia':'If you are repeatedly expected to defend the reason you live somewhere, ordinary conversations can become tiring. You deserve chances to participate without your presence turning into a debate.',
 'belonging-between-countries':'Sometimes your answer will change depending on who is asking and what has happened that day. That does not make your history inconsistent. You are allowed to feel close to different places for different reasons.',
 'secular-religious-tension':'You might still share meals and celebrations with someone whose worldview differs from yours. Those ordinary relationships deserve attention when a disagreement becomes so large that it seems to define the whole person.'
};
const highPrivacy=new Set(['racial-profiling','institutional-racism','community-racial-harm','religious-discrimination','religious-trauma','fear-divine-punishment','faith-community-pressure','religious-family-conflict','immigration-uncertainty','asylum-stress','refugee-adjustment','xenophobia','migration-family-separation','migrant-work-exploitation','uncertain-reunification']);
const sources={
 culture:[['Paradies et al. (2015), systematic review and meta-analysis of racism and health','https://pubmed.ncbi.nlm.nih.gov/26398658/']],
 faith:[['Religious and spiritual struggles: research background (deconversion study, 2023)','https://pubmed.ncbi.nlm.nih.gov/37664880/']],
 migration:[['WHO (2023), refugee and migrant mental health: risk, protection and access to care','https://www.who.int/publications/i/item/9789240081840']]
};
const topicResearch={
 'racial-discrimination':['Paradies et al. (2015), racism as a determinant of health, systematic review','https://pubmed.ncbi.nlm.nih.gov/26398658/'],
 'microaggressions':['Paradies et al. (2015), racism and health, systematic review','https://pubmed.ncbi.nlm.nih.gov/26398658/'],
 'institutional-racism':['UK Equality and Human Rights Commission: protected characteristics','https://www.equalityhumanrights.com/guidance/protected-characteristics'],
 'language-discrimination':['Spence et al., meta-analysis of accent bias in hiring','https://pubmed.ncbi.nlm.nih.gov/36326202/'],
 'cultural-code-switching':['Ward and Szabó (2023), acculturation, cultural identity and wellbeing','https://www.nature.com/articles/s44159-023-00171-2'],
 'mixed-heritage':['Ward and Szabó (2023), acculturation and multiple cultural identities','https://www.nature.com/articles/s44159-023-00171-2'],
 'racial-identity':['Ward and Szabó (2023), cultural identity and wellbeing','https://www.nature.com/articles/s44159-023-00171-2'],
 'cultural-belonging':['Ward and Szabó (2023), acculturation and identity','https://www.nature.com/articles/s44159-023-00171-2'],
 'cultural-family-expectations':['Ward and Szabó (2023), acculturation and identity','https://www.nature.com/articles/s44159-023-00171-2'],
 'intergenerational-cultural-conflict':['Ward and Szabó (2023), acculturation and identity','https://www.nature.com/articles/s44159-023-00171-2'],
 'religious-discrimination':['UK EHRC: religion or belief discrimination','https://www.equalityhumanrights.com/guidance/protected-characteristics/religion-or-belief-discrimination'],
 'secular-religious-tension':['UK EHRC: religion and non-belief protection','https://www.equalityhumanrights.com/guidance/protected-characteristics/religion-or-belief-discrimination'],
 'religious-identity-conflict':['Exline et al. (2014), religious and spiritual struggles','https://doi.org/10.1037/a0036465'],
 'religious-trauma':['Exline et al. (2014), interpersonal and moral spiritual struggles','https://doi.org/10.1037/a0036465'],
 'faith-community-pressure':['Exline et al. (2014), interpersonal religious struggles','https://doi.org/10.1037/a0036465'],
 'religious-family-conflict':['Exline et al. (2014), interpersonal religious struggles','https://doi.org/10.1037/a0036465'],
 'spiritual-uncertainty':['Exline et al. (2014), religious doubt and spiritual struggles','https://doi.org/10.1037/a0036465'],
 'existential-anxiety':['Exline et al. (2014), questions of ultimate meaning','https://doi.org/10.1037/a0036465'],
 'meaning-of-life':['Exline et al. (2014), ultimate meaning struggles','https://doi.org/10.1037/a0036465'],
 'losing-faith':['Longitudinal research on religious deconversion and wellbeing (2023)','https://pubmed.ncbi.nlm.nih.gov/37664880/'],
 'fear-divine-punishment':['NICE CG31: OCD and religious scrupulosity','https://www.nice.org.uk/guidance/cg31/chapter/Recommendations'],
 'migration-grief':['Renner et al. (2024), systematic review of migratory grief','https://pubmed.ncbi.nlm.nih.gov/38435975/'],
 'homesickness':['Renner et al. (2024), systematic review of migratory grief','https://pubmed.ncbi.nlm.nih.gov/38435975/'],
 'belonging-between-countries':['Ward and Szabó (2023), acculturation and cultural identity','https://www.nature.com/articles/s44159-023-00171-2'],
 'culture-shock':['Ward and Szabó (2023), acculturation and cultural identity','https://www.nature.com/articles/s44159-023-00171-2']
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
 const prose=authoredProse[d.id];
 if(open.length!==2)fail(d.id,'expected two authored opening paragraphs');
 if(extra.length!==3||!prose||prose.length!==3)fail(d.id,'missing original long-form passages');
 if(prose.some(p=>wordCount(p)<32))fail(d.id,'one of the version-specific article passages is too short');
 return [open[0],open[1],extra[0],d.why,extra[1],prose[0],prose[1],extra[2]+(extraContext[d.id]?' '+extraContext[d.id]:''),prose[2],d.closing];
}
function makeExamples(d,article,profiles,roots){
 const groups=authoredScenes[d.id];
 if(!groups||groups.length!==4||groups.some(group=>!Array.isArray(group)||group.length!==4))fail(d.id,'missing 16 authored, grouped real-world situations');
 const seen=new Set();
 const examples=[];
 for(let i=0;i<4;i++){
  for(let j=0;j<4;j++){
   const scene=groups[i][j].trim();
   if(scene.length<22||scene.length>110||seen.has(scene))fail(d.id,'repeated or unclear browsing situation: '+scene);
   seen.add(scene);
   const profile=profiles[i],action=i<3?d.versions[i][2]:d.versions[0][2];
   examples.push({
    situation:scene,
    interpretation:profile[1]+' This may help explain the experience, although the full circumstances are not known.',
    emotion:d.domain==='migration'?'The person might feel uncertainty or longing. Their response will depend on what has been lost and what remains unresolved.':
     d.domain==='faith'?'They might feel fear, grief, comfort or conviction, depending on what the experience means to them.':
     'The feeling may involve hurt or confusion. Its precise meaning depends on what happened and how they were treated.',
    response:d.domain==='migration'?
     'A person might look for reliable information or temporarily change their plans. Whether that helps depends on which decisions can actually be made.':
     d.domain==='faith'?
     'They might keep the question private, seek a conversation or adjust a religious practice. The right choice depends on their beliefs and the safety of the setting.':
     'A person may decide whether to respond, seek support or conserve their energy. Their response may be shaped by the real consequences of challenging unequal treatment.',
    function:d.why,
    need:profile[0],rule:'A useful question here is: '+d.questions[1],
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
  return {id:'path-'+i,title:v[0],label:v[0],description:v[1].length>=38?v[1]:v[1]+' '+d.questions[3],
   finish:d.closing,practiceTitle:'A possible next step',practice:v[2],
   questions:questions.map((q,j)=>[q,
    j===0?d.questions[0]:j===1?d.questions[1]:j===2?d.questions[3]:d.questions[4],
    j===0?v[1]:j===1?d.why:j===2?next[1]:v[2],
    j===3?'actions':j===2?'support':''])};
 });
 return [map,...specific];
}
function makeIdeas(d){
 const original=authoredAdvice[d.id],extension=additionalAdvice[d.id];
 if(!original||!extension)fail(d.id,'missing individually authored practical guidance');
 const output={};
 const boilerplate=/^(Ask a trusted person about the practical concern|Request support for this possible step|Talk this through with someone who listens|Consider whether this is relevant|Use this worked example to ask|You might discuss this part|A relevant service or ally may be able to help with|Explore what would need to change before attempting this|Write a few words about this question)/i;
 for(const kind of ['actions','support']){
  const main=original[kind],more=extension[kind];
  if(!Array.isArray(main)||main.length!==12||!Array.isArray(more)||more.length!==8)fail(d.id,'expected 20 personally written '+kind+' suggestions');
  const all=[...main,...more];
  if(new Set(all.map(x=>x.toLocaleLowerCase())).size!==20)fail(d.id,'repeated '+kind+' advice');
  for(const item of all){
   if(item.length<36||item.length>245)fail(d.id,'unclear '+kind+' suggestion: '+item);
   if(boilerplate.test(item))fail(d.id,'old boilerplate in '+kind);
  }
  output[kind]=all;
 }
 return Object.freeze(output);
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
 const ideas=makeIdeas(d);
 const sourceList=[...sources[d.domain]];
 if(topicResearch[id])sourceList.unshift(topicResearch[id]);
 if(id==='fear-divine-punishment')sourceList.push(['International OCD Foundation: religious scrupulosity','https://iocdf.org/faith-ocd/what-is-ocd-scrupulosity/']);
 const whyQuestions=[
  d.questions[0],d.questions[1],d.questions[2],d.questions[3],d.questions[4],
  'When you think about "'+d.versions[0][0]+'", what happened in your own situation?',
  'Does this resemble your experience: "'+d.versions[1][1]+'"? What part feels different?',
  'When "'+d.versions[2][0]+'" becomes difficult, what do you most want to protect?',
  'Would this be practical in your circumstances: "'+d.versions[1][2]+'"? What might get in the way?',
  'How would you decide whether this would help: "'+d.versions[2][2]+'"?'
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
  hideCycle:true,
  contextSequence:true,
  sequenceNote:d.domain==='culture'?
   'What matters is the actual context. Where another person or institution is treating you unfairly, the responsibility for that behaviour does not belong to you.':
   d.domain==='migration'?
   'Access, legal rules and available support can shape what is possible. These examples are not a timetable for adjustment or proof of a psychological cause.':
   'Beliefs, community expectations and personal meaning can interact in different ways. None of these examples can decide what you should believe.',
  pullIndex:6,
  evidence:'This is a topic-specific educational formulation informed by relevant research and support guidance. The possible routes and examples are not validated diagnoses or predictions. For structural harms, the facts, rights and available practical remedies matter more than changing a personal interpretation.'
 });
}
export const CFM_GUIDES_FULL=Object.freeze([...catalogue.keys()].map(build));
export const CFM_IDS=Object.freeze(CFM_GUIDES_FULL.map(g=>g.id));
export const CFM_BY_ID=new Map(CFM_GUIDES_FULL.map(g=>[g.id,g]));
export const CFM_GROUPS=Object.freeze(Object.fromEntries(domains.map(domain=>[domain,Object.freeze(CFM_GUIDES_FULL.filter(g=>g.domain===domain).map(g=>g.id))])));
if(CFM_IDS.length!==45||CFM_BY_ID.size!==45)fail('all','expected 45 distinct complete field-guide manuals');
