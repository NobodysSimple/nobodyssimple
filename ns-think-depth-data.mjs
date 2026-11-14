/* Worked example seeds were authored separately. Remaining examples use catalogue language
   and are clearly labelled as possible explanations, never unconscious diagnoses. */
import {THINK_CASE_SEEDS_A} from './ns-think-case-seeds-a.mjs';
import {THINK_CASE_SEEDS_B} from './ns-think-case-seeds-b.mjs';
import {THINK_CASE_SEEDS_C} from './ns-think-case-seeds-c.mjs';
import {THINK_CASE_SEEDS_D} from './ns-think-case-seeds-d.mjs';
import {THINK_JOURNAL_SEEDS_A} from './ns-think-journal-seeds-a.mjs';
import {THINK_JOURNAL_SEEDS_B} from './ns-think-journal-seeds-b.mjs';
import {THINK_JOURNAL_SEEDS_C} from './ns-think-journal-seeds-c.mjs';
import {THINK_JOURNAL_SEEDS_D} from './ns-think-journal-seeds-d.mjs';
import {THINK_EDITORIAL_A} from './ns-think-editorial-a.mjs';
import {THINK_EDITORIAL_B} from './ns-think-editorial-b.mjs';
import {THINK_EDITORIAL_C} from './ns-think-editorial-c.mjs';
import {THINK_EDITORIAL_D} from './ns-think-editorial-d.mjs';
import {explicitVariants} from './ns-atlas-variations.mjs';
import {extendedVariants} from './ns-atlas-extended-variations.mjs';
const all={...THINK_CASE_SEEDS_A,...THINK_CASE_SEEDS_B,...THINK_CASE_SEEDS_C,...THINK_CASE_SEEDS_D};
const journals={...THINK_JOURNAL_SEEDS_A,...THINK_JOURNAL_SEEDS_B,...THINK_JOURNAL_SEEDS_C,...THINK_JOURNAL_SEEDS_D};
const editorial=[...THINK_EDITORIAL_A,...THINK_EDITORIAL_B,...THINK_EDITORIAL_C,...THINK_EDITORIAL_D];
const rootRules={
certainty:'I must be completely certain before I can move on',
repair:'If I stop reviewing, the mistake will remain unresolved',
fairness:'I must keep thinking until everyone sees what is fair',
connection:'If another person is unhappy, I may lose the relationship',
control:'I must anticipate what happens so nothing goes wrong',
care:'Being careful means thinking about every possible harm',
action:'I must feel fully ready before I can begin',
safety:'Every possible risk needs a definite answer',
responsibility:'I must prevent any harm that could be my fault',
resources:'I must know I can cope before allowing uncertainty',
identity:'An upsetting thought or event defines who I am',
values:'A good choice must satisfy every important value',
regret:'If I regret a choice, I must have chosen wrongly',
information:'I need complete information before deciding',
agency:'If I cannot control the decision perfectly, I have no choice',
evidence:'My first explanation must be the correct one',
worth:'One mistake tells me what I am worth',
trust:"If I cannot know someone's intentions, I cannot trust them",
attention:'I must solve a concern before I can give attention elsewhere',
capacity:'Finding this hard means I should push harder',
environment:'I ought to cope without adjustments',
treatment:'I must settle my doubts before seeking help',
completion:'An action only counts when it feels completely finished',
freedom:'Uncertainty must go away before I can enjoy life',
belonging:'If someone could prefer another person, I am not enough',
boundaries:"I must control another person's behaviour to feel safe",
loss:'One setback will lead to every other loss',
health:'An unusual sensation must have one frightening explanation',
support:'If I ask for help, people will dismiss me'
};
const emotionFor=root=>({repair:'Guilt',fairness:'Anger',connection:'Hurt',control:'Anxiety',
identity:'Shame',worth:'Shame',regret:'Fear',loss:'Dread',belonging:'Insecurity',
values:'Uncertainty',capacity:'Frustration',environment:'Overwhelm',
health:'Alarm',support:'Worry',trust:'Distrust'})[root]||'Anxiety';
const alternativeFor=root=>({
certainty:'An unanswered question does not require another mental investigation',
repair:'Meaningful accountability can be more useful than repeated review',
fairness:'Practical steps towards fair treatment may be more effective than rehearsal',
connection:'Another person can care about me while having thoughts I cannot know',
control:'Reasonable preparation cannot guarantee every possible outcome',
care:'Care can be expressed through chosen actions rather than endless analysis',
action:'A small action can be worthwhile before I feel fully ready',
safety:'Actual precautions depend on evidence and appropriate guidance',
responsibility:'Responsibility is limited by what I can realistically know and do',
resources:'A practical support plan can help without predicting the future',
identity:'A thought or one event cannot describe my whole character',
values:'Choices can honour values without satisfying every preference',
regret:'Some regret can accompany a reasonable choice',
information:'Additional information helps only if it could change the decision',
agency:'My choices can be supported without requiring complete control',
evidence:'A conclusion should remain open when evidence is incomplete',
worth:'A specific setback is not a global measure of worth',
trust:'Trust can be based on repeated real conduct rather than certainty',
attention:'Worries can have a later action time while I return to this task',
capacity:'Attention depends on real capacity and reasonable demands',
environment:'An adjustment can be a legitimate part of effective functioning',
treatment:'Professional support can begin before I have settled the question',
completion:'A feeling of incompleteness is not proof that an action was ineffective',
freedom:'Life can continue while some questions remain unanswered',
belonging:'An uncomfortable possibility does not establish rejection',
boundaries:'Respect and security must preserve both people’s autonomy',
loss:'One possible setback does not establish a chain of losses',
health:'A clinician can evaluate causes without a premature conclusion',
support:'A respectful assessment can start with a simple factual description'
})[root]||'This interpretation is one possibility, not a settled fact';
function firstPerson(s){
 const value=String(s||'').trim().replace(/[.!?]+$/,'');
 if(/^You /i.test(value))return 'I '+value.slice(4);
 if(/^I |^My |^A |^An |^Someone |^When /i.test(value))return value;
 return 'When I notice: '+value[0]?.toLowerCase()+value.slice(1);
}
export const THINK_DEPTH_CASES=Object.freeze(Object.fromEntries(editorial.map(d=>{
 const seed=all[d.id],j=journals[d.id];
 if(seed?.length!==8||j?.length!==4)throw Error('Missing examples for '+d.id);
 const extras=[
  ...((explicitVariants[d.id]||extendedVariants[d.id]||[]).slice(0,5).map(firstPerson)),
  ...d.profiles.map(p=>firstPerson(p[1])),
  ...j.map(x=>'I keep wondering: '+x.questions[0].replace(/[?]$/,''))
 ];
 const unique=[];const observed=new Set(seed.map(x=>x[0].toLowerCase()));
 for(const text of extras)if(!observed.has(text.toLowerCase())){unique.push(text);observed.add(text.toLowerCase());}
 while(unique.length<8)unique.push('I notice this difficulty when '+j[unique.length%4].label.toLowerCase());
 const situ=seed.map(x=>x[0]).concat(unique.slice(0,8));
 const cases=situ.map((s,i)=>{
  const root=d.roots[i%4][0],label=d.roots[i%4][1], example=seed[i]||null;
  const desc=d.profiles[i%4][1];
  const response=example?.[2]||firstPerson(desc);
  return {
   situation:s, interpretation:example?.[1]||rootRules[root]||'This could go badly',
   emotion:emotionFor(root), response,
   function:'Trying to protect '+label.toLowerCase()+' or reduce immediate uncertainty',
   need:label,
   rule:rootRules[root]||'I must resolve this before I can continue',
   adaptation:d.mechanisms[i%3][1],
   alternative:example?.[3]||alternativeFor(root),
   action:j[i%4].practice,root
  };
 });
 if(cases.length!==16||new Set(cases.map(x=>x.situation)).size!==16)throw Error('Invalid depth cases '+d.id);
 return [d.id,cases];
})));
