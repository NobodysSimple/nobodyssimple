/* Nobody's Simple · universal, problem-first navigation taxonomy.
 * Cross-cutting everyday difficulties are primary; HiTOP-inspired dimensions
 * inform coverage but this is not a HiTOP assessment or diagnostic instrument.
 */
export const PROBLEM_MAP_VERSION='2026-11-08.1';

const D=[
 ['feel','Feelings & mood','How you feel, react and recover','♡',
  ['anxiety|I feel anxious or on edge|Anxiety without a clear explanation|nervous worried fear|state-check,emotion-check-in,grounding',
   'low-mood|I feel low or empty|Sadness, low interest or feeling flat|depressed sad numb hopeless|difficult-day,emotion-check-in,small-step',
   'anger|I get angry or irritable|Anger, frustration or snapping|rage irritation frustration temper|emotion-timeline,quick-reset,needs-clarifier',
   'overwhelm|Everything feels too much|Strong emotions and too many demands|stressed overloaded dysregulated|load-balancer,quick-reset,state-check',
   'guilt-shame|I feel guilty or ashamed|Self-criticism or replaying mistakes|shame self blame humiliation|cbt-journal,personal-rules,difficult-day',
   'self-criticism|I am very hard on myself|Self-judgment and perfectionistic rules|critical inner voice perfectionism|internal-rules,thought-map,cbt-journal',
   'emotional-numbness|I feel numb or disconnected|Difficult to feel or name emotions|empty disconnected flat|state-check,body-check,mixed-feelings',
   'panic|I panic or feel suddenly frightened|Intense alarm, fear or bodily sensations|panic attack racing heart|quick-reset,grounding,state-check']],
 ['think','Thoughts & worry','Doubts, uncertainty and thinking loops','⌁',
  ['overthinking|I cannot stop overthinking|Thoughts keep circling|rumination spiral overanalyzing|rumination,worry-sort,reality-map',
   'what-if|I worry about what might happen|Future fears and worst-case scenarios|catastrophizing dread uncertainty|worry-sort,control-map,uncertainty-calibration',
   'checking|I keep checking or seeking reassurance|Repeated checking and doubt|compulsive certainty reassurance|rumination,certainty,control-map',
   'intrusive|I experience unwanted thoughts|Distressing thoughts I did not choose|intrusive unwanted thoughts obsessions|thought-map,grounding,rumination',
   'decision-paralysis|I cannot make a decision|Stuck comparing possibilities|indecision uncertainty choices|decision-map,future-perspectives,control-map',
   'negative-beliefs|I keep assuming the worst|Interpretations feel like evidence|thinking negative assumptions|assumption-finder,reality-map,counterexample',
   'concentration-worry|Worry stops me concentrating|Thoughts interrupt everyday tasks|distracted preoccupied|brain-dump,worry-parking,attention-mission']],
 ['act','Motivation & action','Starting, doing and sustaining things','↗',
  ['procrastination|I keep putting things off|Avoiding tasks or delaying action|procrastinating avoiding start|friction,start-starter,small-step',
   'perfectionism|Nothing feels good enough|High standards prevent progress|perfect standards mistake|internal-rules,experiment-builder,small-step',
   'stuck|I know what to do but feel stuck|Difficulty turning intention into action|freeze motivation activation|motivation-map,small-step,if-then',
   'habits|I cannot stick with habits|Routines fade or are hard to repeat|routine consistency|if-then,environment-design,reward-design',
   'energy-action|I have no energy for tasks|Low energy makes starting difficult|fatigue exhausted depleted|state-check,load-balancer,small-step',
   'avoidance|I avoid uncomfortable situations|Avoidance brings relief then creates costs|escape evade anxious|function-finder,pattern-experiment,small-step',
   'too-many-tasks|I have too much to do|Priorities and workload feel unmanageable|overloaded workload priorities|load-balancer,decision-map,small-step']],
 ['relate','Relationships & communication','Connection, trust, conflict and boundaries','∞',
  ['arguments|We keep arguing|Repetitive conflict and misunderstanding|fighting conflict partner|conflict-map,conversation-map,repair',
   'boundaries|I struggle to set boundaries|Needs and limits are difficult to express|say no boundaries|boundary-builder,needs-clarifier,conversation-map',
   'misunderstanding|I think someone is upset with me|Unclear signals or interpretations|texts messages rejection|assumption-finder,conversation-map,perspective-switch',
   'people-pleasing|I cannot say no|Agreeing to keep others happy|people pleasing guilt approval|personal-rules,boundary-builder,needs-clarifier',
   'trust|I struggle to trust someone|Doubt, expectations or broken trust|jealous betrayal insecurity|reality-map,conversation-map,conflict-pattern',
   'rejection|I feel rejected or left out|Belonging, rejection and social fears|excluded abandoned unwanted|emotion-check-in,reality-map,perspective-switch',
   'loneliness|I feel lonely|Wanting closeness or social connection|isolated alone social|life-areas,small-step,social-battery',
   'repair|I want to repair a relationship|Apology, accountability and changing a pattern|apology reconcile|repair,apology,conversation-map',
   'control-harm|I feel controlled or unsafe with someone|Coercion, pressure or unsafe boundaries|abuse threatened unsafe controlling|boundary-builder,context-map,needs-clarifier']],
 ['body','Body, sleep & senses','Physical states and experiences that affect how you feel','≈',
  ['sleep|I am struggling with sleep|Rest, night-time worry or disrupted routine|insomnia sleep tired|state-check,environment-design,load-balancer',
   'fatigue|I feel exhausted or burnt out|Low energy and competing demands|burnout fatigue drained|state-check,load-balancer,body-check',
   'sensory|I am overwhelmed by sensory input|Noise, light, crowds or textures|overstimulation sensory overwhelm|sensory-recipe,sensory-profile,quick-reset',
   'health-worry|I am worried about my health|Uncertainty about physical sensations|hypochondria illness anxiety symptoms|state-check,reality-map,certainty',
   'body-image|I am struggling with my body image|Appearance, self-evaluation and social pressure|appearance looks body|thought-map,personal-rules,values-discovery',
   'eating|My relationship with food is difficult|Eating, restriction, guilt or control|eating disorder food weight restriction purge|state-check,needs-clarifier,context-map',
   'pain|I am struggling with pain|Pain and its effect on everyday life|chronic pain ache|state-check,load-balancer,body-check']],
 ['identity','Identity, values & self','Who you are, what matters and where you are going','✧',
  ['who-am-i|I do not know who I am|Identity, roles and uncertainty|identity personality self|identity-map,possible-selves,values-discovery',
   'self-worth|I do not feel good enough|Worth, comparison and self-evaluation|insecure confidence inferior|personal-rules,progress-evidence,values-discovery',
   'values|I do not know what I want|Direction, values and conflicting priorities|values purpose meaning|values-discovery,life-areas,decision-map',
   'belonging|I do not feel I belong|Feeling different, unseen or disconnected|excluded alienated not fitting|identity-map,context-map,social-battery',
   'change-self|I want to change a pattern|Repeated reactions and personal growth|self improvement patterns|pattern-map,function-finder,pattern-experiment',
   'masking|I am always masking or performing|Hiding needs or adapting excessively|masking authentic neurodivergent|masking-map,needs-clarifier,context-map']],
 ['focus','Attention, learning & habits','Memory, distraction, planning and cognitive load','◎',
  ['focus|I cannot focus|Difficulty staying with a task|attention concentration distracted|attention-mission,environment-design,state-check',
   'memory|I keep forgetting things|Remembering, prospective tasks and systems|memory forgetful|if-then,environment-design,small-step',
   'organization|I struggle to organise my life|Planning, sequencing and follow-through|chaotic organization executive|load-balancer,goal-builder,if-then',
   'bored|I feel bored or understimulated|Needing interest or stimulation|bored understimulated|sensory-profile,reward-design,stim-space',
   'learning|I want to learn how my mind works|Psychological concepts and reasoning|psychology learn mind|claim-checker,competing-models,evidence-strength']],
 ['change','Loss, change & uncertainty','Transitions, grief and new circumstances','♧',
  ['grief|I am grieving a loss|Loss, longing and adjustment|bereavement grieving|difficult-day,mixed-feelings,positive-memory',
   'breakup|I am coping with a breakup|Relationship loss and changing routines|heartbreak breakup|emotion-check-in,life-areas,small-step',
   'transition|Change is unsettling me|Moving, new roles or transitions|transition moving change|transition,control-map,values-discovery',
   'future|I am scared about my future|Uncertainty about important directions|future fear future plans|worry-sort,control-map,possible-selves',
   'disappointment|Something did not work out|Disappointment, setbacks and meaning|failure rejected setback|difficult-day,progress-evidence,values-discovery']],
 ['work','Work, study & circumstances','Demands, resources and practical barriers','⌂',
  ['study|I feel overwhelmed by studying|Deadlines, performance and limited time|study exams university|load-balancer,start-starter,decision-map',
   'work-stress|Work is stressing me out|Workload, demands and support|job employer burnout workplace|load-balancer,context-map,needs-clarifier',
   'money|Money worries are affecting me|Financial demands and constrained options|debt bills rent finance|control-map,decision-map,context-map',
   'caring|I have too many caring demands|Responsibility, exhaustion and limited support|caregiving family carers|load-balancer,needs-clarifier,context-map',
   'housing|My home or living situation is difficult|Housing, insecurity or environment|housing homelessness overcrowding|context-map,control-map,needs-clarifier',
   'unfairness|I am facing unfair treatment|Discrimination, exclusion or power|racism discrimination stigma unfair|context-map,needs-clarifier,boundary-builder']],
 ['experiences','Unusual or distressing experiences','Experiences that deserve careful, respectful attention','◈',
  ['trauma|Something frightening still affects me|Traumatic memories, reactions or reminders|ptsd traumatic flashbacks|grounding,context-map,state-check',
   'voices|I hear or sense things others may not|Unusual perceptual experiences|hearing voices hallucinations|state-check,grounding,context-map',
   'suspicion|I feel extremely suspicious or threatened|Intense doubts about safety or others|paranoia persecuted|state-check,grounding,context-map',
   'mania|I feel unusually energised with little sleep|Marked changes in energy and behaviour|mania elevated high energy no sleep|state-check,context-map,load-balancer',
   'dissociation|I feel unreal or detached|Disconnection, derealisation or spacing out|dissociation depersonalization|grounding,body-check,state-check',
   'substances|Alcohol or other substances are causing problems|Substance effects, reliance or consequences|alcohol drugs addiction|context-map,pattern-map,state-check']],
 ['safety','Safety & urgent support','When ordinary self-help may not be enough','!',
  ['self-harm|I might hurt myself|Thoughts or urges about self-harm|suicidal self harm want to die|state-check,grounding,needs-clarifier',
   'immediate-danger|I do not feel safe right now|Immediate danger or inability to keep safe|danger threatened unsafe emergency|grounding,context-map,needs-clarifier',
   'support|I need help from another person|Finding appropriate human support|crisis professional help therapist|needs-clarifier,conversation-map,context-map']]
];

export const problemDomains=Object.freeze(D.map(([id,name,description,icon])=>Object.freeze({id,name,description,icon})));
const highRisk=new Set(['self-harm','immediate-danger','voices','suspicion','mania','eating','control-harm']);
const medical=new Set(['pain','fatigue','health-worry','sleep','eating','voices','mania','suspicion','substances']);
export const problemIndex=Object.freeze(D.flatMap(([domain,, , ,items])=>items.map((line)=>{
 const [id,title,hint,aliases,tools]=line.split('|');
 return Object.freeze({id,title,hint,domain,aliases:aliases.split(' '),tools:tools.split(','),
  needsHuman:highRisk.has(id),medical:medical.has(id)});
})));
const byId=new Map(problemIndex.map(item=>[item.id,item]));
export const getProblem=id=>byId.get(id)||null;
export const problemsInDomain=domain=>problemIndex.filter(p=>p.domain===domain);
export function findProblems(query,limit=18){
 const q=String(query||'').trim().toLowerCase();
 if(!q)return problemIndex.slice(0,limit);
 const stop=new Set(['i','im','my','me','a','an','the','is','it','am','have','can','to','of','with','and','feel','feeling','something','please','help']);
 const words=(q.match(/[\p{L}\p{N}]+/gu)||[]).filter(w=>w.length>2&&!stop.has(w));
 if(!words.length)return problemIndex.filter(p=>['anxiety','overthinking','procrastination','arguments','overwhelm','fatigue'].includes(p.id)).slice(0,limit);
 const score=p=>{
  const title=p.title.toLowerCase(),hint=p.hint.toLowerCase(),alias=p.aliases.join(' ');
  return words.reduce((sum,w)=>sum+(title.includes(w)?5:0)+(hint.includes(w)?3:0)+(alias.includes(w)?4:0),0);
 };
 return problemIndex.map(p=>({p,s:score(p)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,limit).map(x=>x.p);
}
export const knowledgeFamilies=Object.freeze({
 feel:{name:'Emotional experiences',what:'Emotions provide information about needs, threats, losses and values, but do not by themselves determine what is true or what action is required.',
  explanations:['A response to recent events or uncertainty','Stress, sleep, physical state and limited recovery','Learned reactions, expectations or habits of coping','Social demands, threat or a lack of support'],
  check:'Notice what preceded the feeling, what changes its intensity and which needs or circumstances might be involved.',
  practice:'Name what you notice, consider its context, and choose a response that meets the need without demanding the feeling disappear.',
  alternative:'What practical or social condition might be causing or worsening the experience?'},
 think:{name:'Thinking and uncertainty',what:'Thoughts can solve problems, predict risks and make meaning. Repetitive thoughts sometimes become less helpful when uncertainty cannot be eliminated.',
  explanations:['A genuinely unresolved practical problem','Uncertainty or a feared future outcome','A quick interpretation being treated as established fact','Checking, reassurance or analysis that temporarily reduces distress'],
  check:'Distinguish what is known, inferred and still unknown, then notice whether more thinking adds useful information.',
  practice:'Write one observation, one interpretation, one alternative and one proportionate next step.',
  alternative:'Does your concern need practical information or changed circumstances rather than another thinking exercise?'},
 act:{name:'Action and motivation',what:'Getting started depends on capability, opportunity, demands and motivation. Difficulty acting is not automatically a character flaw.',
  explanations:['The next action is ambiguous or overwhelming','Fear of making mistakes or another negative consequence','Insufficient time, energy, accessible conditions or support','Immediate alternatives are easier or more rewarding'],
  check:'Identify the moment action stalls and the relief, distraction or obstacle that follows.',
  practice:'Make the first action concrete and small, or adjust the surrounding conditions before trying again.',
  alternative:'Would the difficulty still occur with sufficient rest, clear instructions and adequate resources?'},
 relate:{name:'Relationships and communication',what:'Interpersonal problems involve at least two perspectives, histories, needs and sometimes unequal power. Communication is not always a complete solution.',
  explanations:['Unclear or conflicting interpretations','Needs or limits that have not been communicated or respected','Repeated patterns of rupture, repair or avoidance','Power differences, coercion or practical dependence'],
  check:'Separate observable behaviour, inferred intention, impact and what each person can realistically change.',
  practice:'When safe, formulate a clear request or boundary, including the concrete behaviour and why it matters.',
  alternative:'If safety or power is the obstacle, what support or protection matters more than communication skill?'},
 body:{name:'Body and sensory experience',what:'Physical experiences can affect thought and emotion, and can have medical, environmental and psychological contributors. A psychological explanation should not be assumed.',
  explanations:['Sleep, illness, pain, medication or other physical factors','Sensory overload, demands or inaccessible settings','Stress and its physiological responses','Repeated monitoring or fear of bodily sensations'],
  check:'Notice physical changes, duration, function and situations that make them better or worse.',
  practice:'Consider immediate needs such as rest, hydration, quiet, adjustments and appropriate medical assessment when indicated.',
  alternative:'Could a health issue or environmental condition need attention before any psychological exercise?'},
 identity:{name:'Identity and self-understanding',what:'Identity develops across roles, relationships, communities, social expectations and personal values. Contradictions do not automatically signal a problem.',
  explanations:['Competing expectations from different roles or communities','Values that have not had space to be considered','Past experiences shaping current self-beliefs','Social pressure, discrimination or reduced autonomy'],
  check:'Ask when your self-understanding changes and whose expectations are influencing it.',
  practice:'Identify one value, one inherited rule and one small action aligned with what matters to you.',
  alternative:'Is the challenge really a lack of self-knowledge, or an environment where expressing yourself feels unsafe?'},
 focus:{name:'Attention and cognitive demands',what:'Attention, memory and organisation vary with context, interest, sleep, health, support and task design. Brief questions cannot establish a neurodevelopmental diagnosis.',
  explanations:['High cognitive load or too many competing tasks','Low immediate feedback, distractions or poor task fit','Sleep, stress, health or recovery limitations','Longstanding patterns that may warrant specialist assessment'],
  check:'Look for contexts where attention or organisation is easier, and what supports those exceptions.',
  practice:'Use an external cue, a clear first step and a less distracting environment; observe whether these change functioning.',
  alternative:'What support, accessibility adjustment or clinical assessment might be more useful than simply trying harder?'},
 change:{name:'Loss and transitions',what:'Changes and losses can affect meaning, routines, identity and relationships. There is no single correct timetable for adaptation.',
  explanations:['The importance of what has changed or been lost','Disrupted routines and social support','Conflicting emotions or expectations about recovery','Practical consequences and uncertainty about the future'],
  check:'Consider what you have lost, what remains, and what immediate demands are hardest.',
  practice:'Make room for mixed emotions and identify one stabilising connection or practical support.',
  alternative:'Would the most useful next step involve support, resources or time rather than reframing?'},
 work:{name:'Practical and systemic constraints',what:'Many problems arise from the interaction between a person and their circumstances. A self-help technique cannot replace access, safety, time, money or rights.',
  explanations:['Excessive workload, costs or inaccessible conditions','Lack of choice, support or reasonable adjustments','Conflicting demands or power imbalances','Secondary emotional and behavioural effects of persistent stress'],
  check:'Distinguish demands you control from those imposed by other people or systems.',
  practice:'Identify a resource, adjustment, negotiation or support route that could change the real conditions.',
  alternative:'Which parts of the problem are not yours to solve through individual coping?'},
 experiences:{name:'Unusual or distressing experiences',what:'Experiences involving perception, energy, trauma or detachment can have several possible causes. A brief navigation tool cannot safely determine what they mean.',
  explanations:['Physical health, medications or substances','Sleep disruption and significant stress','Trauma-related reactions or dissociation','Mental health conditions that require assessment'],
  check:'Consider what changed, how long it has been happening, safety and whether it affects everyday life.',
  practice:'Prioritise safety, immediate support and appropriate assessment over a self-diagnostic exercise.',
  alternative:'Would speaking promptly with a qualified clinician be more appropriate than using a worksheet?'},
 safety:{name:'Safety and support',what:'Safety concerns are not ordinary puzzles to optimise. The immediate priority is access to a safe person and the right practical help.',
  explanations:['Immediate danger or unsafe surroundings','Distress or urges that feel difficult to manage alone','Coercion, isolation or lack of support','Health or mental health needs requiring urgent assessment'],
  check:'Are you safe now, and is there someone who can help you stay safe?',
  practice:'If there is immediate danger in the UK, call 999. For urgent mental health support contact NHS 111 and select the mental health option.',
  alternative:'Do not delay urgent support to complete a quiz.'}
});
export const nhsHelp='https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/';
export const nhsCBT='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/';
export const nhsStress='https://www.nhs.uk/every-mind-matters/mental-health-issues/stress/';
export const nhsSelfHelp='https://www.nhs.uk/mental-health/self-help/';
export const nhsTalking='https://www.nhs.uk/service-search/mental-health/find-an-nhs-talking-therapies-service/';
export const nhsPsychosis='https://www.nhs.uk/mental-health/conditions/psychosis/overview/';
export const cciProcrastination='https://www.cci.health.wa.gov.au/Resources/For-Clinicians/Procrastination';
export function sourceForProblem(p){
 if(p.needsHuman)return {label:'NHS: Where to get urgent mental health help',url:nhsHelp};
 if(['voices','suspicion','mania'].includes(p.id))return {label:'NHS: Understanding psychosis and assessment',url:nhsPsychosis};
 if(p.id==='procrastination'||p.id==='perfectionism')return {label:'CCI: Procrastination self-help resources',url:cciProcrastination};
 if(p.domain==='body'||p.domain==='work')return {label:'NHS: Understanding stress',url:nhsStress};
 return {label:'NHS: Self-help CBT techniques',url:nhsCBT};
}
