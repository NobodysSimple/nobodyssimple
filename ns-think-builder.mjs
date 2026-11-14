/* Nobody's Simple · Thoughts & worry field-guide editorial contract.
 * Shared interface, separately authored content and a treatment-aware formulation.
 */
import {THINK_DEPTH_CASES} from './ns-think-depth-data.mjs';
const required=['id','title','standfirst','readTitle','article','mechanisms','profiles','cycle','now','routes','ideas','whyIntro','whyQuestions','roots','safety','sources','evidence'];
const fail=(id,error)=>{throw Error('Thoughts & worry guide '+id+': '+error);};
export function makeThinking(d){
 const id=d?.id||'?';
 for(const f of required)if(!d[f])fail(id,'missing '+f);
 if(d.article.length!==8||d.article.join(' ').trim().split(/\s+/).length<340)fail(id,'article must have 8 substantive paragraphs, >=340 words');
 if(d.mechanisms.length<3||d.profiles.length<3||d.cycle.length<4||d.now.steps.length<2)fail(id,'short explanation');
 if(d.routes.length!==4||new Set(d.routes.map(x=>x.id)).size!==4)fail(id,'four distinct guided journals required');
 const routes=d.routes.map(r=>{
  for(const f of ['id','label','description','finish','practiceTitle','practice','questions'])if(!r[f])fail(id,r.id+' missing '+f);
  if(r.questions.length!==4||r.practice.length<40)fail(id,r.id+' incomplete process or outcome');
  for(const [q,hint,teaching,idea] of r.questions){
    if(!q||!hint||!teaching||q.length<17||hint.length<17||teaching.length<17)fail(id,r.id+' weak question');
    if(idea&&(!d.ideas[idea]||d.ideas[idea].length<24))fail(id,r.id+' missing idea list '+idea);
  }
  return Object.freeze({...r,title:r.label});
 });
 if(Object.keys(d.ideas).length<2||Object.values(d.ideas).some(a=>a.length<24))fail(id,'need two robust optional suggestion lists');
 const whyCases=THINK_DEPTH_CASES[id]||[];
 if(whyCases.length!==16||new Set(whyCases.map(x=>x.situation)).size!==16)fail(id,'16 distinct situations required');
 const roots=new Set(d.roots.map(x=>x[0]));
 for(const e of whyCases)if(!roots.has(e.root))fail(id,'unmatched category '+e.root);
 if(d.whyQuestions.length!==10||!d.sources.length)fail(id,'incomplete reflection or sources');
 const whyStages=['The situation','What it seemed to mean','What you felt','How you responded','What it did for you briefly','The need or value involved','A possible rule or expectation','Context or learning that might matter','Another way of understanding this','A useful next response'];
 return Object.freeze({...d,routes,whyCases,whyStages,pullIndex:d.pullIndex??4});
}