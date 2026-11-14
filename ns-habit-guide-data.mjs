/* Nobody's Simple — Habits, impulses & compulsions.
 * Original articles and guided exercises; shared accessible manual interface.
 */
import {HABIT_EDITORIAL_A} from './ns-habit-editorial-a.mjs';
import {HABIT_EDITORIAL_B} from './ns-habit-editorial-b.mjs';
import {HABIT_EDITORIAL_C} from './ns-habit-editorial-c.mjs';
import {HABIT_JOURNALS_A} from './ns-habit-journals-a.mjs';
import {HABIT_JOURNALS_B} from './ns-habit-journals-b.mjs';
import {HABIT_JOURNALS_C} from './ns-habit-journals-c.mjs';
import {HABIT_IDEAS_A} from './ns-habit-ideas-a.mjs';
import {HABIT_IDEAS_B} from './ns-habit-ideas-b.mjs';
import {HABIT_IDEAS_C} from './ns-habit-ideas-c.mjs';
import {HABIT_CASES_A} from './ns-habit-cases-a.mjs';
import {HABIT_CASES_B} from './ns-habit-cases-b.mjs';
import {HABIT_CASES_C} from './ns-habit-cases-c.mjs';
import {HABIT_EXTRA_CASES_A} from './ns-habit-extra-cases-a.mjs';
import {HABIT_EXTRA_CASES_B} from './ns-habit-extra-cases-b.mjs';
import {HABIT_EXTRA_CASES_C} from './ns-habit-extra-cases-c.mjs';
import {HABIT_WHY_QUESTIONS} from './ns-habit-why-questions.mjs';
import {HABIT_EXTRA_ACTIONS} from './ns-habit-extra-actions.mjs';

const authored=[...HABIT_EDITORIAL_A,...HABIT_EDITORIAL_B,...HABIT_EDITORIAL_C];
const journals={...HABIT_JOURNALS_A,...HABIT_JOURNALS_B,...HABIT_JOURNALS_C};
const ideas={...HABIT_IDEAS_A,...HABIT_IDEAS_B,...HABIT_IDEAS_C};
const seeds={...HABIT_CASES_A,...HABIT_CASES_B,...HABIT_CASES_C};
const extraCases={...HABIT_EXTRA_CASES_A,...HABIT_EXTRA_CASES_B,...HABIT_EXTRA_CASES_C};
const fail=(id,msg)=>{throw new Error('Habit guide '+id+': '+msg);};
const emotion={
relief:'Anxiety',standards:'Fear of criticism',capacity:'Exhaustion',clarity:'Overwhelm',
worth:'Shame',control:'Anxiety',environment:'Pressure',activation:'Frustration',safety:'Fear',
support:'Isolation',cue:'Frustration',reward:'Boredom',health:'Fatigue',limits:'Guilt',
priorities:'Overwhelm',acceptance:'Self-consciousness',comfort:'Discomfort',access:'Distress',
boundaries:'Guilt',sequence:'Confusion',agency:'Urgency',stimulation:'Restlessness',
escape:'Distress',security:'Fear',connection:'Loneliness',choice:'Urgency',belonging:'Pressure',
attention:'Restlessness',structure:'Frustration',values:'Uncertainty'
};
const immediateSafety={
 'risk-taking':'If a risk could harm you or somebody else now, take immediate practical safety action and seek urgent support. Sudden reckless behaviour alongside markedly reduced sleep or unusually high energy warrants prompt clinical assessment.',
 'risky-sex':'Consent must be voluntary and can be withdrawn. If coercion or assault has occurred, seek safety and support. For a recent possible STI or HIV exposure, or pregnancy risk, seek prompt sexual-health advice because some options are time-sensitive.',
 'energy-action':'New or severe fatigue needs medical assessment. If physical or cognitive symptoms worsen after exertion (post-exertional worsening), avoid self-prescribed increases in activity and ask for condition-appropriate guidance.',
 'habit-urges':'If an urge presents immediate danger, seek urgent help. Abrupt withdrawal from alcohol or some dependent substances can be medically dangerous. Ask for qualified advice rather than using this journal to stop suddenly.',
 'unplanned-impulses':'New or markedly increased impulsivity, especially with little need for sleep or unusually elevated mood, may need prompt clinical assessment. Immediate danger to others requires urgent safety action.',
 'compulsive-buying':'If rent, food or essential bills are at risk, prioritise financial safety and seek appropriate debt support. Sudden heavy spending with very little sleep can warrant urgent clinical assessment.',
 avoidance:'Do not approach a genuinely unsafe or abusive situation as an exposure challenge. Safety and appropriate accessibility adjustments take priority over tolerating discomfort.'
};
const stageNames=['What happened','What you thought it meant','What you felt','What you did next',
 'What the response provided briefly','Which need or value mattered','A possible rule you may be following',
 'Context and conditions that may explain it','Another reasonable understanding','A safer or more useful next action'];
function individualGuides(d){
 const id=d.id, r=journals[id],baseIdeas=ideas[id],extra=HABIT_EXTRA_ACTIONS[id],cases=seeds[id],w=HABIT_WHY_QUESTIONS[id];
 if(!r||r.length!==4||!baseIdeas||!extra||!cases||cases.length!==8||!w||w.length!==10)fail(id,'incomplete original editorial data');
 if(d.article.length!==8||d.article.join(' ').trim().split(/\s+/).length<340)fail(id,'article is too short');
 if(d.mechanisms.length<3||d.profiles.length!==4||d.cycle.length<4||d.roots.length!==4)fail(id,'incomplete explanation');
 const steps=r.map(([key,label,desc,practice,questions])=>{
  if(questions.length!==4||practice.length<40)fail(id,'journal '+key+' incomplete');
  const useSupport=/support|help|conditions|access|health|pacing|money|demands|care|protect/i.test(key);
  return {
   id:key,label,title:label,description:desc,finish:practice,
   practiceTitle:'One useful next step',practice,
   questions:questions.map((q,i)=>{
    if(q.length<19)fail(id,'question too short in '+key);
    const hint=i===0?'Choose a recent real situation. You can keep personal details private.':
      i===1?'Consider what the situation means to you, without assuming your interpretation is certain.':
      i===2?'The answer may involve a practical limitation rather than a personal belief.':
      'Choose a safe change that fits your current circumstances.';
    const teaching=i===3?practice:d.mechanisms[i%3][1];
    return [q,hint,teaching,i===3?(useSupport?'support':'actions'):''];
   })
  };
 });
 const actions=[...baseIdeas.actions,...steps.map(x=>x.practice),...d.now.steps,...extra];
 const support=[...baseIdeas.support,...steps.map(x=>'Ask a suitable person to help you with: '+x.label.toLowerCase()),
  ...steps.map(x=>'Discuss whether support could help you '+x.description.charAt(0).toLowerCase()+x.description.slice(1)),
  ...d.mechanisms.map(x=>'Ask about support for '+x[0].toLowerCase()+' when it affects daily life'),
  'Ask for a clear review of whether the plan is improving everyday functioning.'];
 if(actions.length!==24||support.length!==24)fail(id,'expected exactly 24 ideas in each list');
 const mapped=cases.map(([s,thought,response,rule,reframe,action,root],i)=>{
  const rlabel=d.roots.find(x=>x[0]===root);if(!rlabel)fail(id,'unknown root '+root);
  return {
   situation:s,interpretation:thought,emotion:emotion[root]||'Discomfort',response,
   function:'The response may have offered immediate relief or protected '+rlabel[1].toLowerCase(),
   need:rlabel[1],rule,adaptation:d.mechanisms[i%3][1],
   alternative:reframe,action,root
  };
 });
 // Eight additional independently authored situations, with their own interpretation and response.
 const further=extraCases[id];if(!further||further.length!==8)fail(id,'missing additional situations');
 further.forEach(([s,thought,response,rule,reframe,action,root],i)=>{
  const rlabel=d.roots.find(x=>x[0]===root);if(!rlabel)fail(id,'unknown additional root '+root);
  mapped.push({
   situation:s,interpretation:thought,emotion:emotion[root]||'Discomfort',response,
   function:'This response may briefly protect a need for '+rlabel[1].toLowerCase(),
   need:rlabel[1],rule,adaptation:d.mechanisms[(i+1)%3][1],
   alternative:reframe,action,root
  });
 });
 if(mapped.length!==16||new Set(mapped.map(x=>x.situation)).size!==16)fail(id,'repeated or missing situations');
 for(const s of mapped)for(const f of ['interpretation','emotion','response','function','need','rule','adaptation','alternative','action','root'])if(!s[f])fail(id,'missing example field '+f);
 return Object.freeze({...d,routes:steps,ideas:{actions,support},prominentSafety:immediateSafety[id]||'',
  whyIntro:'A repeated action may be protecting something important, but its purpose and cause are not always obvious. Explore possible explanations without treating them as conclusions about your personality or childhood.',
  whyQuestions:w,whyCases:mapped,whyStages:stageNames,pullIndex:4});
}
export const HABIT_GUIDES=Object.freeze(authored.map(individualGuides));
export const HABIT_IDS=Object.freeze(HABIT_GUIDES.map(x=>x.id));
export const HABIT_BY_ID=new Map(HABIT_GUIDES.map(x=>[x.id,x]));
if(HABIT_GUIDES.length!==15||HABIT_BY_ID.size!==15)throw Error('Expected 15 unique habit guides');
