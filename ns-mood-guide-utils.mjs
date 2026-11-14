/* Editorial structure and validation for the 16 Feelings & Mood field guides. */
import {MOOD_DEPTH_EXTRAS} from './ns-mood-depth-extensions.mjs';
const fail=(id,reason)=>{throw Error("Mood guide "+id+": "+reason)};
export const Q=(question,help,guide,ideas='')=>[question,help,guide,ideas];
export const R=(id,label,description,questions,finish,practiceTitle,practice)=>({id,label,title:label,description,questions,finish,practiceTitle,practice});
export const cases=(id,text)=>{
 const lines=String(text).trim().split('\n').map(x=>x.trim()).filter(Boolean);
 return lines.map((row,i)=>{
  const v=row.split('|').map(x=>x.trim());
  if(v.length!==11)fail(id,'Understand Why row '+(i+1)+' has '+v.length+' columns rather than 11');
  const keys=['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action','root'];
  const out=Object.fromEntries(keys.map((k,j)=>[k,v[j]]));
  if(keys.some(k=>!out[k]))fail(id,'empty '+(i+1));
  return Object.freeze(out);
 });
};
const stages=['Situation','First interpretation','Emotion','What you did','What this achieved for a moment','The need involved','Possible learned rule','What might have contributed','A more flexible way to see it','One possible next response'];
const defaultSources={
 anxiety:[['NICE: Generalised anxiety and panic guidance','https://www.nice.org.uk/guidance/cg113/chapter/recommendations']],
 depression:[['NICE: Depression treatment and management','https://www.nice.org.uk/guidance/ng222/chapter/recommendations']],
 anger:[['NHS: Get help with anger','https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anger/']],
 crisis:[['NHS: Urgent mental health help','https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/']],
 dissociation:[['NHS: Dissociative disorders','https://www.nhs.uk/mental-health/conditions/dissociative-disorders/']],
 compassion:[['Brown and Ashcroft (2025): Review of compassion-focused therapy','https://pubmed.ncbi.nlm.nih.gov/40867388/']],
 bipolar:[['NHS: Bipolar disorder symptoms','https://www.nhs.uk/mental-health/conditions/bipolar-disorder/']],
 intimacy:[['Alkassis and colleagues (2026): Postcoital dysphoria','https://pubmed.ncbi.nlm.nih.gov/41708891/']]
};
export function makeMood(d){
 if(!d.id||!d.title)fail(d.id||'?', 'missing identity');
 if(!Array.isArray(d.article)||d.article.length<7)fail(d.id,'at least seven independently written article paragraphs required');
 if(!Array.isArray(d.profiles)||d.profiles.length<3)fail(d.id,'recognisable profiles required');
 if(!Array.isArray(d.mechanisms)||d.mechanisms.length<3)fail(d.id,'specific psychological mechanisms required');
 if(!Array.isArray(d.cycle)||d.cycle.length<4)fail(d.id,'maintenance model required');
 if(!Array.isArray(d.routes)||d.routes.length!==4)fail(d.id,'four distinct guided experiences required');
 for(const route of d.routes){if(!Array.isArray(route.questions)||route.questions.length<4)fail(d.id,route.id+' has too few guided questions');
  for(const q of route.questions)if(q.length<3||q.slice(0,3).some(x=>String(x).length<16))fail(d.id,'inadequate question, explanation or teaching for '+route.id);
 }
 if(!d.ideas||Object.values(d.ideas).some(arr=>arr.length<22))fail(d.id,'ideas lists must contain at least 22 distinct actions each');
 for(const route of d.routes)for(const q of route.questions)if(q[3]&&!d.ideas[q[3]])fail(d.id,'missing idea list '+q[3]);
 const extras=MOOD_DEPTH_EXTRAS[d.id]||[];
 const combinedWhyCases=[...(d.whyCases||[]),...extras];
 if(!Array.isArray(d.whyCases)||d.whyCases.length<8)fail(d.id,'at least eight bespoke depth cases required');
 if(!Array.isArray(d.roots)||d.roots.length<3)fail(d.id,'topic-specific roots required');
 if(combinedWhyCases.some(x=>!d.roots.some(r=>r[0]===x.root)))fail(d.id,'unknown depth root');
 if(new Set(combinedWhyCases.map(x=>x.situation.toLowerCase())).size!==combinedWhyCases.length)fail(d.id,'duplicated depth situations');
 if(!Array.isArray(d.whyQuestions)||d.whyQuestions.length!==10)fail(d.id,'ten depth questions required');
 const sources=(d.sourceKeys||[]).flatMap(k=>defaultSources[k]||[]).concat(d.sources||[]);
 if(!sources.length)fail(d.id,'at least one identified evidence source required');
 return Object.freeze({...d,whyCases:combinedWhyCases,pullIndex:d.pullIndex??3,whyStages:d.whyStages||stages,sources,evidence:d.evidence||'These exercises are guided adaptations of psychological principles, not individually validated tests or treatments. The research cited supports specific treatment approaches; it does not prove that a particular explanation applies to you.'});
}
