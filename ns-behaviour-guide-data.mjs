/* Nobody's Simple: the 19 topics in the actual "Habits, impulses & compulsions"
 * catalogue (atlas domain "behaviour"). These are independent manuals, distinct
 * from the 15 "Motivation & action" topics in atlas domain "act".
 */
import {BEHAVIOUR_EDITORIAL_A} from './ns-behaviour-editorial-a.mjs';
import {BEHAVIOUR_EDITORIAL_B} from './ns-behaviour-editorial-b.mjs';
import {BEHAVIOUR_EDITORIAL_C} from './ns-behaviour-editorial-c.mjs';
import {BEHAVIOUR_EDITORIAL_D} from './ns-behaviour-editorial-d.mjs';
import {BEHAVIOUR_INTERACTIVE_A} from './ns-behaviour-interactive-a.mjs';
import {BEHAVIOUR_INTERACTIVE_B} from './ns-behaviour-interactive-b.mjs';
import {BEHAVIOUR_INTERACTIVE_C} from './ns-behaviour-interactive-c.mjs';
import {BEHAVIOUR_INTERACTIVE_D} from './ns-behaviour-interactive-d.mjs';

const authored=[...BEHAVIOUR_EDITORIAL_A,...BEHAVIOUR_EDITORIAL_B,...BEHAVIOUR_EDITORIAL_C,...BEHAVIOUR_EDITORIAL_D];
const interaction={...BEHAVIOUR_INTERACTIVE_A,...BEHAVIOUR_INTERACTIVE_B,...BEHAVIOUR_INTERACTIVE_C,...BEHAVIOUR_INTERACTIVE_D};
const standardStages=['What actually happened','What you believed at the time','What you felt','What you did','What the response offered immediately','What was important to you','A possible rule influencing the decision','The circumstances that may have mattered','Another way to understand the event','A useful and safe next step'];
const highRisk=new Set(['gambling-harms','compulsive-sexual-behaviour','compulsive-exercise','problematic-pornography-use','urges-under-stress','loss-of-control-behaviour','frustration-tolerance','coping-through-avoidance','emotional-dependency']);
function fail(id,msg){throw new Error('Behaviour manual '+id+': '+msg);}
function makeGuide(d){
 const id=d.id,x=interaction[id];
 if(!x||d.article?.length!==10||d.article.join(' ').trim().split(/\s+/).length<480)fail(id,'missing or short independently authored article');
 if(d.mechanisms?.length!==3||d.profiles?.length!==4||d.cycle?.length!==4||d.now?.steps?.length!==3)fail(id,'missing individually authored editorial elements');
 if(!d.sources?.length||!d.evidence||!d.safety)fail(id,'missing research and safety');
 if(x.roots?.length!==4||x.routes?.length!==4||x.whyQuestions?.length!==10||x.cases?.length!==16||x.hints?.length!==3||x.supportMore?.length!==8)fail(id,'missing individualised interactive content');
 const roots=new Map(x.roots.map(r=>[r[0],r]));
 if(roots.size!==4||x.roots.some(r=>r.length!==9))fail(id,'invalid explanatory root');
 if(new Set(x.cases.map(c=>c[0])).size!==16)fail(id,'repeated worked examples');
 const routes=x.routes.map(([key,label,description,practice,questions,coaching,support])=>{
  if(questions?.length!==4||questions.some(q=>q.length<19)||!coaching||!support||practice.length<39)fail(id,'incomplete '+key+' journal');
  return {id:key,label,title:label,description:description+' '+coaching,finish:practice,practiceTitle:'A useful next step',practice,
    questions:questions.map((question,i)=>[question,i===0?coaching:x.hints[i-1],i===3?practice:d.mechanisms[i%3][1],i===3?'actions':''])};
 });
 const whyCases=x.cases.map(([situation,interpretation,action,root])=>{
  const r=roots.get(root);if(!r||!situation||!interpretation||!action)fail(id,'invalid worked example');
  return {situation,interpretation,emotion:r[2],response:r[6],function:r[3],need:r[1],
   rule:r[5],adaptation:r[4],alternative:r[7],action,root};
 });
 const actions=[...x.cases.map(c=>c[2]),...routes.map(r=>r.practice),...d.now.steps,x.roots[0][4]];
 const support=[...x.supportMore,...x.routes.map(r=>r[6]),...x.roots.map(r=>r[8])];
 if(actions.length!==24||support.length!==16)fail(id,'incomplete practical options');
 const guide={...d,roots:x.roots.map(r=>[r[0],r[1]]),routes,
   ideas:{actions,support},whyIntro:x.whyIntro,whyQuestions:x.whyQuestions,
   whyCases,whyStages:standardStages,pullIndex:5,
   prominentSafety:highRisk.has(id)?d.safety:''};
 return Object.freeze(guide);
}
export const BEHAVIOUR_GUIDES=Object.freeze(authored.map(makeGuide));
export const BEHAVIOUR_IDS=Object.freeze(BEHAVIOUR_GUIDES.map(g=>g.id));
export const BEHAVIOUR_BY_ID=new Map(BEHAVIOUR_GUIDES.map(g=>[g.id,g]));
if(BEHAVIOUR_GUIDES.length!==19||BEHAVIOUR_BY_ID.size!==19)throw new Error('Expected 19 unique behavioural catalogue manuals');
