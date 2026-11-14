/* Nobody's Simple — Attention, learning & habits.
   Same accessible field-guide interface; individually authored learning and attention content. */
import {FOCUS_EDITORIAL_A} from './ns-focus-editorial-a.mjs';
import {FOCUS_EDITORIAL_B} from './ns-focus-editorial-b.mjs';
import {FOCUS_EDITORIAL_C} from './ns-focus-editorial-c.mjs';
import {FOCUS_JOURNALS_A} from './ns-focus-journals-a.mjs';
import {FOCUS_JOURNALS_B} from './ns-focus-journals-b.mjs';
import {FOCUS_JOURNALS_C} from './ns-focus-journals-c.mjs';
import {FOCUS_IDEAS_A} from './ns-focus-ideas-a.mjs';
import {FOCUS_IDEAS_B} from './ns-focus-ideas-b.mjs';
import {FOCUS_IDEAS_C} from './ns-focus-ideas-c.mjs';
import {FOCUS_CASES_A} from './ns-focus-cases-a.mjs';
import {FOCUS_CASES_B} from './ns-focus-cases-b.mjs';
import {FOCUS_CASES_C} from './ns-focus-cases-c.mjs';
import {FOCUS_EXTRA_CASES_A} from './ns-focus-extra-cases-a.mjs';
import {FOCUS_EXTRA_CASES_B} from './ns-focus-extra-cases-b.mjs';
import {FOCUS_EXTRA_CASES_C} from './ns-focus-extra-cases-c.mjs';
import {FOCUS_WHY_QUESTIONS} from './ns-focus-why-questions.mjs';
import {FOCUS_EXTRA_ACTIONS} from './ns-focus-extra-actions.mjs';
import {FOCUS_DEEPENING} from './ns-focus-depth-additions.mjs';

const editorial=[...FOCUS_EDITORIAL_A,...FOCUS_EDITORIAL_B,...FOCUS_EDITORIAL_C];
const journals={...FOCUS_JOURNALS_A,...FOCUS_JOURNALS_B,...FOCUS_JOURNALS_C};
const ideas={...FOCUS_IDEAS_A,...FOCUS_IDEAS_B,...FOCUS_IDEAS_C};
const cases={...FOCUS_CASES_A,...FOCUS_CASES_B,...FOCUS_CASES_C};
const extras={...FOCUS_EXTRA_CASES_A,...FOCUS_EXTRA_CASES_B,...FOCUS_EXTRA_CASES_C};
const fail=(id,why)=>{throw Error('Attention, learning & habits '+id+': '+why)};
const safety={
 memory:'If memory difficulties are new, getting worse or affecting daily life, speak to a GP. Sudden confusion or an abrupt neurological change needs urgent assessment; do not rely on a memory journal to explain it.',
 hyperactivity:'Severe new agitation or restlessness, particularly after a medication change or with major sleep and mood changes, deserves prompt medical review. Do not alter prescribed treatment without your prescriber.',
 'hyperfocus-cost':'If deep absorption causes missed essential medication, safeguarding duties or urgent health needs, arrange reliable practical safeguards and appropriate support. Ordinary reminder apps may not be sufficient.',
 'time-blindness':'When timing failures affect medication, safeguarding or other safety-critical responsibilities, use an appropriate backup and professional support rather than relying on a single timer.',
 'learning-block':'You do not need a diagnosis to ask for accessible learning materials. Sudden or severe changes in cognition should be assessed by an appropriate clinician.',
 focus:'Sudden confusion or marked new changes in attention require medical assessment. Persistent impairments should be considered in their full health, developmental and environmental context.'
};
const emotion={
 clarity:'Frustration',environment:'Strain',capacity:'Exhaustion',support:'Embarrassment',
 cue:'Concern',encoding:'Confusion',confidence:'Anxiety',
 structure:'Overwhelm',sequence:'Frustration',access:'Distress',
 interest:'Boredom',movement:'Restlessness',connection:'Loneliness',recovery:'Fatigue',
 understanding:'Curiosity',certainty:'Unease',agency:'Frustration',values:'Uncertainty',
 attention:'Restlessness',health:'Concern',engagement:'Distraction',worry:'Anxiety',
 reward:'Interest',transition:'Frustration',needs:'Concern',control:'Unease',
 estimate:'Surprise',load:'Overwhelm',priority:'Pressure',resources:'Stress',
 foundation:'Confusion',retrieval:'Uncertainty'
};
const stages=['The situation','What it seemed to mean','What you felt','What you did next',
 'What it provided in the moment','A need or value that may matter','A rule you may be following',
 'The situation or learning context','Another reasonable interpretation','A useful next response'];
const topicStageLabels={
 focus:['What you expect your attention to manage','The instructions and environment involved'],
 memory:['What you expect yourself to remember unaided','Where the information or reminder was lost'],
 organization:['What you expect yourself to keep in your head','The number of demands and available resources'],
 bored:['What you believe you should be able to tolerate','What the activity and your current state allowed'],
 learning:['The explanation you may have started relying on','What the actual evidence and context show'],
 hyperactivity:['What the setting expects of your body','When the movement appears and what changes it'],
 'attention-drift':['What you tell yourself about losing the thread','Whether the material or setting supported re-entry'],
 'hyperfocus-cost':['What makes leaving an unfinished activity hard','The rewards and responsibilities competing for attention'],
 'time-blindness':['Your assumptions about how long things take','When a usable start cue was missing'],
 'planning-overload':['The standard you set for a finished plan','What the workload and available hours permit'],
 'learning-block':['What difficulty learning has come to mean to you','Which prerequisite or teaching condition was missing']
};
function createGuide(d){
 const id=d.id,seed=journals[id],base=ideas[id],cc=cases[id],ee=extras[id],why=FOCUS_WHY_QUESTIONS[id],additional=FOCUS_EXTRA_ACTIONS[id],depth=FOCUS_DEEPENING[id];
 if(!seed||seed.length!==4||!base||base.actions.length!==12||base.support.length!==12||!cc||cc.length!==8||!ee||ee.length!==8||!why||why.length!==10||!additional||additional.length!==5||!depth)fail(id,'missing distinct authored content');
 if(d.article.length!==8||d.article.join(' ').trim().split(/\s+/).length<340)fail(id,'substantive article missing');
 if(d.mechanisms.length<3||d.profiles.length!==4||d.roots.length!==4||d.cycle.length<4)fail(id,'incomplete explanation');
 if(d.roots.some(r=>!depth.roots[r[0]])||seed.some(r=>!depth.routes[r[0]]))fail(id,'missing topic-specific route or explanatory coaching');
 const article=[d.article[0],depth.addition[0],...d.article.slice(1,5),depth.addition[1],...d.article.slice(5)];
 if(article.join(' ').split(/\s+/).length<470)fail(id,'expanded article too short');
 const routes=seed.map(([key,label,description,practice,qs])=>{
  if(qs.length!==4||practice.length<40)fail(id,'incomplete journal '+key);
  const support=/support|assessment|health|access|backup|renegotiate|accommodate|format/i.test(key);
  return {
   id:key,label,title:label,description:description+' '+depth.routes[key],finish:practice,
   practiceTitle:'Your next useful step',practice,
   questions:qs.map((q,i)=>{
    if(q.length<19)fail(id,'short journal question');
    const coaching=i===0?depth.routes[key]:depth.hints[i];
    const teaching=i===3?practice:i===0?depth.routes[key]:d.mechanisms[(i-1)%3][1];
    return [q,coaching,teaching,i===3?(support?'support':'actions'):''];
   })
  };
 });
 const actions=[...base.actions,...routes.map(r=>r.practice),...d.now.steps,...additional];
 if(!depth.supportMore||depth.supportMore.length!==12)fail(id,'missing independently authored support ideas');
 const support=[...base.support,...depth.supportMore];
 if(actions.length!==24||support.length!==24)fail(id,'two optional lists of 24 items required');
 const mapped=[...cc,...ee].map(([s,interpretation,response,rule,alternative,action,root],i)=>{
  const match=d.roots.find(x=>x[0]===root);if(!match)fail(id,'invalid root '+root);
  return {
   situation:s,interpretation,emotion:emotion[root]||'Discomfort',response,
   function:depth.roots[root][0],
   need:match[1],rule,
   adaptation:depth.roots[root][1],
   alternative,action,root
  };
 });
 if(mapped.length!==16||new Set(mapped.map(x=>x.situation)).size!==16)fail(id,'missing or duplicated cases');
 return Object.freeze({...d,article,routes,ideas:{actions,support},whyQuestions:why,whyCases:mapped,
  whyIntro:depth.why,whyStages:stages.map((label,i)=>i===6?topicStageLabels[id][0]:i===7?topicStageLabels[id][1]:label),pullIndex:5,prominentSafety:safety[id]||''});
}
export const FOCUS_GUIDES=Object.freeze(editorial.map(createGuide));
export const FOCUS_IDS=Object.freeze(FOCUS_GUIDES.map(g=>g.id));
export const FOCUS_BY_ID=new Map(FOCUS_GUIDES.map(g=>[g.id,g]));
if(FOCUS_GUIDES.length!==11||FOCUS_BY_ID.size!==11)throw Error('Expected eleven independent attention and learning guides');
