/* Nobody's Simple: inclusive, experience-first expansion of the navigation atlas.
 * These entries are user-language entry points, not diagnoses, claims of causation,
 * clinical evidence maps, or individually reviewed interventions.
 */
import {INCLUSIVE_GROUPS_A} from './ns-inclusive-topics-a.mjs';
import {INCLUSIVE_GROUPS_B} from './ns-inclusive-topics-b.mjs';

const GROUPS=Object.freeze([...INCLUSIVE_GROUPS_A,...INCLUSIVE_GROUPS_B]);
export const inclusiveDomains=Object.freeze(GROUPS.map(g=>Object.freeze({
 id:g.id,name:g.title,description:g.description,icon:'◇'
})));
export const inclusiveProblemIndex=Object.freeze(GROUPS.flatMap(g=>g.rows.map(parts=>{
 const [id,title,hint,aliases='',flags='']=parts;
 return Object.freeze({
  id,title,hint,domain:g.id,
  aliases:[...new Set((aliases+' '+g.tags).trim().split(/\s+/).filter(Boolean))],
  needsHuman:flags==='safety',medical:flags==='medical',
  supportFirst:g.id==='harm'||flags==='safety',
  contextFirst:true,quality:'inclusive-editorial'
 });
})));
export const inclusiveIds=new Set(inclusiveProblemIndex.map(p=>p.id));
const focusForDomain={
 culture:'external',lgbtq:'identity',neuro:'access',disability:'access',
 family:'relationships',harm:'safety',sexuality:'health',inequality:'external',
 migration:'external',faith:'identity',digital:'systems',education:'systems',
 lifespan:'life',social:'relationships',trauma:'safety',behaviour:'habits',
 clinical:'health',environment:'external',growth:'growth'
};
const FOCUS={
 external:{
 factors:['Unequal power or treatment','Material resources and access','Institutional rules or decisions','Community support and belonging','Privacy and personal safety','Practical choices available'],
 lenses:[
 ['Real-world treatment','Consider what other people, institutions or policies have actually done.'],
 ['Barriers and resources','Look at access, time, costs, rights and realistic options.'],
 ['Safety and autonomy','Explore whose decisions constrain your choices and whether change is safe.'],
 ['Community and support','Consider protective relationships, collective action and appropriate practical support.']],
 goals:['Identify a real barrier rather than assume a personal weakness.','Consider a safe practical or community-based source of support.','Respect that the situation may remain difficult without being your fault.']},
 identity:{
 factors:['Choice and autonomy','Privacy and safety','Family and community expectations','Access and social recognition','Personal meaning and values','Supportive relationships'],
 lenses:[
 ['Your own understanding','Leave room for uncertainty, self-definition and voluntary exploration.'],
 ['How others respond','Distinguish your identity from prejudice or expectations imposed by others.'],
 ['Privacy and safety','Disclosure or expression should be your choice, where possible and safe.'],
 ['Support and belonging','Consider where affirmation, access and acceptance are available.']],
 goals:['Explore what feels meaningful without forcing a label.','Identify safe ways to exercise choice and express needs.','An identity or consensual preference does not itself need correcting.']},
 access:{
 factors:['Environmental and sensory demands','Communication preferences','Accessibility and reasonable adjustments','Health and energy','Stigma and unequal expectations','Autonomy and support'],
 lenses:[
 ['Fit between person and setting','Ask whether the environment meets relevant needs instead of assuming deficits.'],
 ['Access to adjustments','Explore realistic accommodations, tools and shared responsibilities.'],
 ['Fatigue and capacity','Notice energy, load, recovery and physical considerations.'],
 ['Understanding and autonomy','Consider communication, consent, personal goals and available support.']],
 goals:['Explore a practical access adjustment or environmental change.','Recognise differences without assuming they are disordered.','Respect the possibility that the external demand needs to change.']},
 relationships:{
 factors:['Safety and power in the relationship','Mutual expectations and communication','Family or social roles','Resources and practical dependence','Past events and actual behaviour','Support and choice'],
 lenses:[
 ['What actually happened','Separate observable interactions from interpretation without denying harm.'],
 ['Roles and expectations','Consider patterns of responsibility, reciprocity and dependence.'],
 ['Safety and choice','Assess whether any conversation or boundary is safe and freely chosen.'],
 ['Outside resources','Consider practical support, distance or changes in conditions.']],
 goals:['Define what you need and what is realistically negotiable.','Consider a conversation only where it is safe and useful.','Do not assume all parties are equally responsible for harm; you can choose to maintain, change or leave an agreement.']},
 safety:{
 factors:['Immediate safety','Coercion, threats or control','Privacy of devices and notes','Dependence and access to resources','Trusted support','Institutional protection'],
 lenses:[
 ['What the other person or system is doing','Harm and coercion do not have to be explained as your beliefs or coping.'],
 ['Safety and privacy','Prioritise confidential practical support, not risky confrontation or experiments.'],
 ['Power and material constraints','Dependence, threats or monitoring may limit options.'],
 ['Support and autonomy','Consider informed choices and an appropriate person or service.']],
 goals:['Prioritise actual safety, privacy and support.','Do not perform exposure, confrontation or behavioural experiments where unsafe.','You do not have to describe or record harmful details here.']},
 health:{
 factors:['Physical health or medication','Consent and bodily autonomy','Sleep, energy and pain','Relationships and expectations','Healthcare access','Personal goals and support'],
 lenses:[
 ['Health and bodily factors','Do not presume a physical or sexual difficulty has a psychological cause.'],
 ['Consent and choice','The goal is your informed choice, not meeting another person’s expectations.'],
 ['Context and expectations','Notice whether relationships, stigma or practical settings affect the situation.'],
 ['Relevant support','Consider healthcare and social support where appropriate.']],
 goals:['Consider whether medical advice, resources or accessibility adjustments are needed.','Explore preferences without imposing what is normal.','A concern need not be changed simply because other people expect it.']},
 systems:{
 factors:['Institutional expectations','Resources and time','Technology or workplace design','Power and accessibility','Relationships and support','Safe alternatives'],
 lenses:[
 ['The system and its incentives','Consider platform, workplace or education design before self-blame.'],
 ['Real constraints','Look at resources, time, access and enforceable expectations.'],
 ['Patterns and effects','Describe specific situations and consequences without assuming a hidden cause.'],
 ['Useful adjustments','Compare safe, voluntary practical changes and external support.']],
 goals:['Identify which conditions could be changed by a system or institution.','Try an adjustment only if feasible and safe.','Avoid assuming a person alone must adapt to a harmful environment.']},
 life:{
 factors:['Current life stage and roles','Social expectations','Physical health and capacity','Money and housing','Family and relationships','Autonomy and access'],
 lenses:[
 ['What is actually changing','Identify practical changes and losses, including positive transitions.'],
 ['Roles and expectations','Look at cultural norms and responsibilities as well as personal preferences.'],
 ['Capacity and resources','Consider health, finances, time and support.'],
 ['Personal choice','Allow mixed feelings and individual definitions of a good outcome.']],
 goals:['Give changes room without imposing a timeline.','Find one feasible source of support or choice.','Progress need not mean feeling positive all the time.']},
 habits:{
 factors:['Specific triggers and contexts','Short-term consequences','Long-term costs and benefits','Autonomy and consent','Health or safety risks','Environment and available support'],
 lenses:[
 ['A specific observable pattern','Separate how often something occurs from whether it causes harm.'],
 ['Immediate consequences','Ask what happens just before and after the behaviour.'],
 ['Constraints and alternatives','Consider access, environment and the person’s own goals.'],
 ['Safe support','If control or safety is seriously affected, specialist help may be appropriate.']],
 goals:['Identify one pattern you actually want to change.','Focus on functional consequences, not shame or identity labels.','Choose safe, reversible adjustments and appropriate help.']},
 growth:{
 factors:['Existing strengths and resources','Personal values','Relationships and belonging','Opportunities and access','Choice and enjoyment','Rest and physical needs'],
 lenses:[
 ['What already matters to you','Notice strengths and meaningful activities without forcing optimism.'],
 ['Opportunities and support','Access, resources and other people can create possibilities.'],
 ['Freedom to choose','A positive goal should be yours, not an obligation to improve.'],
 ['What counts as worthwhile','Connection, joy and rest do not need a productivity justification.']],
 goals:['Choose an experience you genuinely value.','Consider one optional opportunity or supportive condition.','You can explore without treating anything as a problem or requiring improvement or diagnosis.']}
};
export function inclusiveProfile(p){
 if(!p?.contextFirst)return null;
 const f=FOCUS[focusForDomain[p.domain]||'external'];
 const focus=f.lenses.map(([label,detail],i)=>({
  id:'context-'+i,label,detail,
  target:'Explore '+label.toLowerCase(),
  tool:i===0?'life-areas':i===1?'needs-clarifier':i===2?'boundary-builder':'small-step',
  worksheet:i===0||i===1?'systems':i===2?'values':'action'
 }));
 const definition=p.hint+'. This is an optional starting point for understanding a lived experience or real-world condition. The entry does not imply that an identity, difference or preference is a disorder, or that the person experiencing harm caused it.';
 return {
  ...p,definition,
  variants:[
   p.title,
   'This is happening in one specific relationship or setting',
   'This involves an institution, community or practical barrier',
   'This has changed over time or across situations',
   'I want to understand this without necessarily changing it'
  ],
  signs:{
   thoughts:['I want to understand what happened','I am considering different explanations','I am thinking about my choices and needs'],
   feelings:['Concern or frustration','Relief, hope or affirmation','Anger, grief or sadness','Uncertainty or mixed feelings'],
   behaviours:['Seeking information or support','Changing what I share with others','Adjusting my environment or routines'],
   body:['Physical or sensory changes','Changes in energy or sleep','No physical change that I have noticed']
  },
  maintainers:focus,
  contributors:f.factors.map((label,i)=>({id:'context-factor-'+i,label})),
  cycle:['An actual experience or situation','Conditions, expectations or choices that may matter','Practical, social, emotional or bodily effects','Change, continuity or an unanswered question'],
  progress:f.goals,
  targets:focus.map((m,i)=>({
   id:m.id,title:m.target,why:m.detail,
   action:['Describe what is known about the situation without assigning blame.','Identify a practical access, resource or support option if one fits.','Protect autonomy and safety rather than demanding a confrontation.','Choose a next step, including doing nothing, that suits your own goals.'][i],
   tool:m.tool,worksheet:m.worksheet
  })),
  knowledge:'Different people experience this topic in different ways; evidence for individual causes has not been established.',
  limits:'This entry is not a clinical assessment or a topic-specific evidence review.',
  source:null,
  quality:'inclusive-editorial',
  alert:p.supportFirst?'If another person is threatening or monitoring you, avoid recording private details or initiating unsafe confrontation. Prioritise confidential practical support.':p.medical?'New, severe or changing symptoms should not be presumed psychological.':''
 };
}
