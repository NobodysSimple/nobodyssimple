/* Separate, clinically tailored editorial models for unusual or distressing experiences.
   Reuses Nobody's Simple page components, never a generic assessment or diagnosis. */
import {EXPERIENCE_DEPTH_CASES} from './ns-experiences-depth-data.mjs';
const topicEvidence={
 trauma:'NICE recommends trauma-focused CBT and, in appropriate circumstances, EMDR for PTSD. These journals provide orientation and help-seeking guidance; they are not trauma-processing treatment.',
 voices:'NICE recommends timely assessment when psychosis may be emerging and offers CBT for psychosis and family intervention in appropriate care. This page does not establish the origin of an unusual perception.',
 suspicion:'Intense suspicion and functional changes can require medical and specialist mental health assessment. NICE guidance for psychosis includes collaborative evaluation and tailored psychological intervention.',
 mania:'NICE recommends urgent specialist assessment when mania is suspected. Protecting sleep and postponing high-risk decisions are supportive measures while appropriate care is arranged.',
 dissociation:'NHS guidance describes several dissociative experiences and advises appropriate assessment of symptoms and other possible causes. Grounding suggestions here are optional coping tools, not validated diagnostic tests.',
 substances:'NHS substance services consider physical health, dependence and the effect of use on daily life. Psychological support may be combined with medically guided changes to substance use.',
 derealisation:'NHS describes derealisation as a feeling that the surroundings are unreal or foggy. Persistent, new or impairing experiences should be assessed rather than assumed to have one psychological cause.',
 depersonalisation:'NHS describes depersonalisation as feeling detached from oneself. A person may retain awareness of the change; a clinician can evaluate persistent symptoms and possible contributors.',
 flashbacks:'NICE PTSD guidance includes treatment for flashbacks and distressing memories within trauma-focused CBT or EMDR where indicated. Brief orientation here does not replace supervised treatment.',
 hypervigilance:'Trauma and anxiety can involve heightened alertness. NICE PTSD treatment includes management of arousal, while the reader must consider genuine present threats before reducing precautions.',
 'elevated-mood':'NICE bipolar guidance emphasises specialist assessment for suspected mania and monitoring significant changes in mood, energy and sleep. These journals do not assess bipolar disorder.',
 'grandiose-beliefs':'NICE psychosis and bipolar guidance supports specialist assessment of marked changes in beliefs, mood and functioning. The page focuses on practical safety and does not validate extraordinary claims.',
 'substance-craving':'Relapse-prevention approaches identify craving cues and develop alternative responses. Treatment needs to be substance-specific and account for physical dependence and withdrawal.',
 'alcohol-harm':'NICE recommends alcohol-focused psychological interventions for harmful drinking and medically assisted withdrawal when indicated. The goals and support depend on dependence severity and health.',
 'drug-harm':'NHS drug services can offer psychosocial treatment, harm reduction and medication-assisted care depending on the substance. Overdose prevention and safe withdrawal may be urgent priorities.',
 'withdrawal-worries':'NICE and NHS guidance identify serious risks during alcohol withdrawal, including seizures and severe confusion. Dependent alcohol or sedative use must not be stopped abruptly without medical advice.'
};
const required=['id','title','standfirst','article','mechanisms','profiles','cycle','now','routes','ideas','whyIntro','whyQuestions','roots','prominentSafety','safety','sources'];
function fail(id,text){throw Error('Experience guide '+id+': '+text);}
export function makeExperience(d){
 for(const k of required)if(!d[k])fail(d.id||'?',k+' missing');
 if(!Array.isArray(d.article)||d.article.length!==8||d.article.join(' ').split(/\s+/).length<340)fail(d.id,'article too short');
 if(d.mechanisms.length<3||d.profiles.length<3||d.cycle.length<4)fail(d.id,'insufficient explanation');
 if(d.routes.length!==4)fail(d.id,'four topic-specific journals required');
 const routes=d.routes.map(([id,label,description,finish,practiceTitle,practice,questions])=>{
  if(!id||!label||questions.length<4||!finish||!practiceTitle||!practice)fail(d.id,'incomplete route '+id);
  if(!questions.every(q=>Array.isArray(q)&&q.length===4&&q.slice(0,3).every(s=>String(s).length>=17)))fail(d.id,'weak question '+id);
  for(const q of questions)if(q[3]&&(!d.ideas[q[3]]||d.ideas[q[3]].length<22))fail(d.id,'missing ideas '+q[3]);
  return {id,label,title:label,description,finish,practiceTitle,practice,questions};
 });
 if(Object.values(d.ideas).some(arr=>!Array.isArray(arr)||arr.length<22))fail(d.id,'ideas need 22 useful suggestions');
 const whyCases=EXPERIENCE_DEPTH_CASES[d.id]||[];
 if(whyCases.length!==16)fail(d.id,'exactly 16 distinct psychological examples required');
 if(new Set(whyCases.map(x=>x.situation)).size!==16)fail(d.id,'duplicate psychological example');
 if(whyCases.some(x=>!d.roots.some(r=>r[0]===x.root)))fail(d.id,'invalid depth root');
 if(d.whyQuestions.length!==10||d.roots.length<3)fail(d.id,'topic specific excavation missing');
 if(!d.sources?.length)fail(d.id,'research sources missing');
 const whyStages=['The current situation','What it seemed to mean','How you felt','What you did','What it did for you briefly','What you needed','A possible expectation or rule','Current or earlier influences to consider','Another possibility','One safer next response'];
 return Object.freeze({...d,routes,whyCases,whyStages,pullIndex:d.pullIndex??3,
 evidence:d.evidence||topicEvidence[d.id]||'These are educational reflections, not validated assessments or replacements for care.'});
}
