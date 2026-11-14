/* Separate, clinically tailored editorial models for unusual or distressing experiences.
   Reuses Nobody's Simple page components, never a generic assessment or diagnosis. */
import {EXPERIENCE_DEPTH_CASES} from './ns-experiences-depth-data.mjs';
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
 evidence:d.evidence||'These exercises adapt selected evidence-based approaches. The individual online journals are educational tools, not validated assessments or replacements for specialist treatment. A reaction alone cannot establish its cause.'});
}
