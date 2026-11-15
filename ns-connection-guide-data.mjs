/* Nobody's Simple: the actual Relationships & connection catalogue.
 * 22 Relationships & communication, 16 Friendships love & belonging,
 * 9 related experiences explicitly assigned by ns-needs-themes.mjs.
 * Authors' articles and independent guided prompts are in named companion files.
 */
import {RELATE_EDITORIAL_A} from './ns-relate-editorial-a.mjs';
import {RELATE_EDITORIAL_B} from './ns-relate-editorial-b.mjs';
import {RELATE_EDITORIAL_C} from './ns-relate-editorial-c.mjs';
import {RELATE_EDITORIAL_D} from './ns-relate-editorial-d.mjs';
import {SOCIAL_EDITORIAL_A} from './ns-social-editorial-a.mjs';
import {SOCIAL_EDITORIAL_B} from './ns-social-editorial-b.mjs';
import {SOCIAL_EDITORIAL_C} from './ns-social-editorial-c.mjs';
import {CONNECTION_EDITORIAL_A} from './ns-connection-editorial-a.mjs';
import {CONNECTION_EDITORIAL_B} from './ns-connection-editorial-b.mjs';
import {RELATE_WORK_A} from './ns-relate-work-a.mjs';
import {RELATE_WORK_B} from './ns-relate-work-b.mjs';
import {RELATE_WORK_C} from './ns-relate-work-c.mjs';
import {RELATE_WORK_D} from './ns-relate-work-d.mjs';
import {SOCIAL_WORK_A} from './ns-social-work-a.mjs';
import {SOCIAL_WORK_B} from './ns-social-work-b.mjs';
import {SOCIAL_WORK_C} from './ns-social-work-c.mjs';
import {CONNECTION_WORK_A} from './ns-connection-work-a.mjs';
import {CONNECTION_WORK_B} from './ns-connection-work-b.mjs';
import {CONNECTION_SUPPORT_A} from './ns-connection-support-a.mjs';
import {CONNECTION_SUPPORT_B} from './ns-connection-support-b.mjs';
import {CONNECTION_SUPPORT_C} from './ns-connection-support-c.mjs';
import {CONNECTION_SUPPORT_D} from './ns-connection-support-d.mjs';
import {CONNECTION_SUPPORT_E} from './ns-connection-support-e.mjs';
import {CONNECTION_SUPPORT_F} from './ns-connection-support-f.mjs';
import {CONNECTION_SUPPORT_G} from './ns-connection-support-g.mjs';
import {CONNECTION_SUPPORT_H} from './ns-connection-support-h.mjs';
import {CONNECTION_SUPPORT_I} from './ns-connection-support-i.mjs';
import {CONNECTION_WHY_INTROS} from './ns-connection-why-intros.mjs';

const authored=[...RELATE_EDITORIAL_A,...RELATE_EDITORIAL_B,...RELATE_EDITORIAL_C,...RELATE_EDITORIAL_D,
 ...SOCIAL_EDITORIAL_A,...SOCIAL_EDITORIAL_B,...SOCIAL_EDITORIAL_C,...CONNECTION_EDITORIAL_A,...CONNECTION_EDITORIAL_B];
const work={...RELATE_WORK_A,...RELATE_WORK_B,...RELATE_WORK_C,...RELATE_WORK_D,
 ...SOCIAL_WORK_A,...SOCIAL_WORK_B,...SOCIAL_WORK_C,...CONNECTION_WORK_A,...CONNECTION_WORK_B};
const authoredSupport={...CONNECTION_SUPPORT_A,...CONNECTION_SUPPORT_B,...CONNECTION_SUPPORT_C,...CONNECTION_SUPPORT_D,...CONNECTION_SUPPORT_E,...CONNECTION_SUPPORT_F,...CONNECTION_SUPPORT_G,...CONNECTION_SUPPORT_H,...CONNECTION_SUPPORT_I};
const stages=['What happened','What you believed it meant','What you felt','What you did','What the response provided','What you were needing','A possible expectation shaping the response','What else was happening','Another way of responding','A safe next step'];
const urgentIds=new Set(['control-harm','controlling-impulses','aggressive-urges','intimacy-communication','relationship-submission','submissive-patterns','betrayal-trauma','post-trauma-trust','end-of-life-caregiving','parenting-teenager']);
const fail=(id,message)=>{throw new Error('Relationship manual '+id+': '+message);};
function build(d){
 const id=d.id,w=work[id];
 if(!w)fail(id,'missing authored journals');
 if(!CONNECTION_WHY_INTROS[id]||CONNECTION_WHY_INTROS[id].length<200)fail(id,'missing authored formulation introduction');
 if(d.article?.length!==10||d.article.join(' ').trim().split(/\s+/).length<400)fail(id,'missing longform article');
 if(d.mechanisms?.length!==3||d.profiles?.length!==4||d.now?.steps?.length!==3||!d.sources?.length||!d.safety)fail(id,'missing editorial elements');
 if(w.routes?.length!==4||w.why?.length!==10||w.cases?.length!==4||w.cases.some(g=>g.length!==4))fail(id,'incomplete individualised routes or examples');
 const routes=w.routes.map((r,i)=>{
  const [key,label,description,questions,practice]=r;
  if(!key||!label||!description||questions?.length!==4||questions.some(q=>q.length<19)||!practice||practice.length<38)fail(id,'incomplete '+key+' route');
  return {id:key,label,title:label,description,finish:practice,practiceTitle:'One possible next step',practice,
   questions:questions.map((q,j)=>[q,j===0?description:j===1?d.mechanisms[j%3][1]:j===2?d.profiles[i][1]:practice,
    j===3?practice:d.mechanisms[j%3][1],j===3?'actions':''])};
 });
 const examples=w.cases.flatMap((group,i)=>group.map((s,j)=>{
  const sep=s.indexOf('|');if(sep<0)fail(id,'missing example thought');
  const situation=s.slice(0,sep),interpretation=s.slice(sep+1);
  const mechanism=d.mechanisms[i%3];
  const r=routes[i],label=d.profiles[i][0],reflection=d.profiles[i][1];
  return {situation,interpretation,emotion:i===0?'Hurt':i===1?'Uncertainty':i===2?'Fear':'Distress',
   response:reflection,function:mechanism[1],need:label,
   rule:w.cases[i][0].split('|')[1],
   adaptation:r.description,alternative:r.practice,action:r.practice,root:'path-'+i};
 }));
 if(examples.length!==16||new Set(examples.map(x=>x.situation)).size!==16)fail(id,'repeated or missing worked examples');
 const roots=d.profiles.map((p,i)=>['path-'+i,p[0]]);
 const cycle=[examples[0].situation+'.', 'A thought appears: '+examples[0].interpretation+'.',
  d.profiles[0][1],d.mechanisms[0][1]];
 const practical=authoredSupport[id];
 if(!practical||practical.length!==16||new Set(practical).size!==16)fail(id,'missing independently written support suggestions');
 const sourcePrompt='Read the linked guidance: '+d.sources[0][0]+'.';
 const support=[...practical,...routes.map(r=>r.practice),...d.now.steps,sourcePrompt];
 const actions=[...routes.map(r=>r.practice),...d.now.steps,...practical,sourcePrompt];
 if(support.length!==24||actions.length!==24)fail(id,'incomplete practical support and actions');
 return Object.freeze({...d,cycle,roots,routes,
  ideas:{actions,support},
  prominentSafety:urgentIds.has(id)?d.safety:'',
  whyIntro:CONNECTION_WHY_INTROS[id],
  whyQuestions:w.why,whyCases:examples,whyStages:stages,pullIndex:5,
  evidence:d.sources.length>1?
    'This guide explores the possible psychological process described in its article. Its suggestions are educational and need to be judged against the actual relationship. The linked resources provide further relevant guidance.':
    'This guide explores the possible psychological process described in its article. Its suggestions are educational and need to be judged against the actual relationship, particularly where safety and consent are relevant.'
 });
}
export const CONNECTION_GUIDES=Object.freeze(authored.map(build));
export const CONNECTION_IDS=Object.freeze(CONNECTION_GUIDES.map(g=>g.id));
export const CONNECTION_BY_ID=new Map(CONNECTION_GUIDES.map(g=>[g.id,g]));
if(CONNECTION_GUIDES.length!==47||CONNECTION_BY_ID.size!==47)throw new Error('Expected 47 unique relationships and connection manuals');
export const CONNECTION_GROUPS=Object.freeze({
 relate:Object.freeze(RELATE_EDITORIAL_A.concat(RELATE_EDITORIAL_B,RELATE_EDITORIAL_C,RELATE_EDITORIAL_D).map(x=>x.id)),
 social:Object.freeze(SOCIAL_EDITORIAL_A.concat(SOCIAL_EDITORIAL_B,SOCIAL_EDITORIAL_C).map(x=>x.id)),
 related:Object.freeze(CONNECTION_EDITORIAL_A.concat(CONNECTION_EDITORIAL_B).map(x=>x.id))
});
