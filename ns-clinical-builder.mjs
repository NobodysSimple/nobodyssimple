/* Nobody's Simple: clinician-reviewed-style editorial contract for the
 * Mental health & care experiences catalogue.
 * These educational models are not diagnoses or autonomous treatment plans.
 */
import {CLINICAL_DEPTH_CASES} from './ns-clinical-depth-data.mjs';
const fields=['id','title','standfirst','readTitle','article','mechanisms','profiles','cycle','now','routes','ideas','whyIntro','whyQuestions','roots','prominentSafety','safety','sources','evidence'];
const fail=(id,why)=>{throw Error('Clinical guide '+id+': '+why);};
export function makeClinical(d){
 const id=d?.id||'unknown';
 for(const f of fields)if(!d[f])fail(id,'missing '+f);
 if(d.article.length!==8||d.article.join(' ').trim().split(/\s+/).length<340)fail(id,'eight full paragraphs required');
 if(d.mechanisms.length<3||d.profiles.length<3||d.cycle.length<4||d.now.steps.length<2)fail(id,'insufficient mechanisms/profiles/support');
 if(d.routes.length!==4||new Set(d.routes.map(r=>r.id)).size!==4)fail(id,'four distinct journals required');
 const routes=d.routes.map(r=>{
   for(const f of ['id','label','description','finish','practiceTitle','practice','questions'])if(!r[f])fail(id,r.id+' missing '+f);
   if(r.questions.length!==4)fail(id,r.id+' requires four purposeful questions');
   for(const [q,hint,teaching,ideas] of r.questions){
      if(!q||!hint||!teaching||q.length<18||hint.length<18||teaching.length<18)fail(id,r.id+' needs clear question and clinical rationale');
      if(ideas&&(!d.ideas[ideas]||d.ideas[ideas].length<24))fail(id,r.id+' missing idea list '+ideas);
   }
   return Object.freeze({...r,title:r.label});
 });
 if(Object.keys(d.ideas).length<2||Object.values(d.ideas).some(v=>v.length<24))fail(id,'at least two substantial optional lists');
 const whyCases=CLINICAL_DEPTH_CASES[id]||[];
 if(whyCases.length!==16||new Set(whyCases.map(x=>x.situation)).size!==16)fail(id,'16 different cases required');
 const roots=new Set(d.roots.map(r=>r[0]));
 for(const x of whyCases)if(!roots.has(x.root))fail(id,'unknown root '+x.root);
 if(d.whyQuestions.length!==10||!d.sources.length)fail(id,'incomplete why exploration / references');
 const whyStages=['What happened or changed','What it seemed to mean','What you felt or noticed','What you did in response','How it helped or cost you','What you needed','A possible rule or expectation','Context and health factors worth considering','A more open or fair understanding','One safe or supported next response'];
 return Object.freeze({...d,routes,whyCases,whyStages,pullIndex:d.pullIndex??4});
}
