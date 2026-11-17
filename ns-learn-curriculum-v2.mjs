/**
 * Learn v2 curriculum registry: planned syllabuses are metadata only.
 * A course is playable ONLY if it has reviewed/published lesson content.
 * IDs are explicit and stable (never derive them from editable titles).
 */
const makeCourses=(school,rows)=>rows.map(([id,title,capability],i)=>Object.freeze({
 id,title,capability,school,order:i+1,status:id==='observations-evidence'?'pilot':'planned'
}));
const F=[
 ['observations-evidence','Observation, Interpretation & Evidence','Tell a checkable observation from an inferred meaning.'],
 ['research-design','Scientific Reasoning and Research Designs','Assess what different studies can establish.'],
 ['bias-humility','Cognitive Bias and Intellectual Humility','Find motivated and selective reasoning without over-labelling.'],
 ['uncertainty','Probability, Uncertainty and Calibration','Match certainty to available evidence.'],
 ['memory-perception','Attention, Memory and Perception','Understand reconstruction, attention and perceptual limits.'],
 ['individual-context','Individual Differences and Context','Avoid one-size-fits-all psychological explanations.'],
 ['competing-hypotheses','Competing Hypotheses','Compare plausible explanations and useful tests.'],
 ['interpretation-ethics','Ethics of Interpreting Other People','Reason without diagnosing, stereotyping or pretending to mind-read.']
];
const B=[
 ['learning-principles','Classical and Operant Learning','Distinguish associations from consequences.'],
 ['reinforcement-avoidance','Reinforcement, Punishment and Avoidance','Analyse how contingencies strengthen or weaken behaviour.'],
 ['motivation','Motivation, Goals and Reward','Compare motives, incentives and opportunity.'],
 ['emotion-systems','Emotion: Appraisal, Function and Regulation','Explore functional explanations without pathologising feelings.'],
 ['habits-chains','Habits and Behavioural Chains','Identify cues, responses and reinforcing conditions.'],
 ['cognitive-load','Decision-Making and Cognitive Load','Evaluate bounded choice and resource limitations.'],
 ['self-regulation','Self-Regulation and Executive Function','Analyse executive demand in context.'],
 ['biodevelopment','Biological, Developmental and Environmental Constraints','Reason across interacting explanatory levels.']
];
const S=[
 ['identity-belonging','Social Identity and Belonging','Recognise identity processes in group interaction.'],
 ['attribution','Attribution and Perspective-Taking','Distinguish inferred intention from observed behaviour.'],
 ['attachment','Attachment: Theory, Evidence and Limits','Use attachment theory without armchair categorisation.'],
 ['personality','Personality: Traits, States and Pathology','Distinguish traits, pathology and behaviour.'],
 ['communication','Communication, Conflict and Repair','Identify repair, defensiveness and communication dynamics.'],
 ['social-influence','Power, Social Norms and Influence','Understand conformity, persuasion and power.'],
 ['autonomy-consent','Boundaries, Autonomy and Consent','Separate boundaries from attempts to control others.'],
 ['polarisation','Groups, Polarisation and Social Learning','Identify group processes and resistant reasoning.']
];
const D=[
 ['threat-fear','Threat, Fear and Anxiety','Map threat detection and learned fear.'],
 ['safety-behaviours','Avoidance, Safety Behaviours and Exposure Principles','Identify maintenance and safe intervention conditions.'],
 ['worry-rumination','Rumination, Worry and Reassurance','Distinguish productive thought from maintenance loops.'],
 ['mood-reward','Mood, Withdrawal and Reward Loss','Consider feedback between activity and mood.'],
 ['shame-perfectionism','Shame, Self-Criticism and Perfectionism','Differentiate self-evaluation processes.'],
 ['trauma-context','Trauma, Stress and Context','Understand stress while resisting causal overclaims.'],
 ['compulsion','Compulsions and Differential Explanations','Distinguish compulsive functions from lookalike habits.'],
 ['interpersonal-cycles','Interpersonal Cycles and Unsafe Relationships','Recognise when safety outranks communication practice.']
];
const C=[
 ['functional-formulation','Building a Functional Formulation','Explain behaviour as a revisable, contextual hypothesis.'],
 ['behavioural-experiments','Behavioural Experiments','Design proportionate tests of predictions.'],
 ['cbt-evidence','CBT: Models, Mechanisms and Evidence','Relate techniques to hypothesised maintaining processes.'],
 ['acceptance-values','Acceptance, Flexibility and Values','Distinguish acceptance from resignation.'],
 ['habit-design','Habit Design and Implementation Intentions','Adjust conditions, cues and opportunities.'],
 ['ambivalence','Motivational Interviewing and Ambivalence','Recognise resistance, reflection and autonomy.'],
 ['environment-change','Environment, Accessibility and Resources','Evaluate changes beyond individual coping.'],
 ['monitoring-outcomes','Monitoring Change, Harms and Alternatives','Interpret progress without relying on anecdotes alone.']
];
const A=[
 ['life-course','Developmental and Life-Course Formulation','Integrate development without deterministic stories.'],
 ['differential','Differential Explanations and Comorbidity','Compare overlapping constructs and competing causes.'],
 ['levels-systems','Individual, Group and Institutional Systems','Reason across levels of explanation.'],
 ['conflicting-studies','Interpreting Conflicting Scientific Findings','Evaluate designs, uncertainty and replication.'],
 ['risk-ethics','Risk, Ethics, Power and Safeguarding','Recognise boundaries of an educational formulation.'],
 ['advanced-interpersonal','Advanced Interpersonal Case Analysis','Assess patterns while resisting unsupported motive claims.'],
 ['intervention-evaluation','Designing and Evaluating Interventions','Specify mechanisms and measurable outcomes.'],
 ['integrative-capstone','Integrative, Revisable Formulation','Defend and revise a context-sensitive formulation.']
];
const school=(id,title,short,description,courses)=>Object.freeze({
 id,title,short,description,courses:makeCourses(id,courses)
});
export const LEARN_SCHOOLS=Object.freeze([
 school('foundations','Foundations of Psychological Thinking','Observe before interpreting.','Evidence, reasoning, memory and the limits of inference.',F),
 school('behaviour','The Architecture of Behaviour','See why behaviour happens.','Learning, motivation, habit, emotion and self-regulation.',B),
 school('social','The Social Mind','Understand people and groups.','Identity, personality, attachment, influence and communication.',S),
 school('difficulties','Difficulties & Maintaining Systems','Understand why problems persist.','Threat, avoidance, worry, shame and behavioural cycles.',D),
 school('change','Change, Intervention & Strategy','Learn how change works.','Formulation, behavioural experiments, psychological intervention and systems change.',C),
 school('advanced','Advanced & Applied Psychology','Integrate explanations carefully.','Development, conflicting evidence, ethical decisions and formulation.',A)
]);
export const LEARN_SPECIALISMS=Object.freeze([
 {id:'relationships',title:'Personality & Relationships',description:'Narcissism beyond stereotypes, attachment, coercion and interpersonal conflict.',topics:['Narcissism: traits, vulnerability and myths','Gaslighting, DARVO and conceptual limits','Attachment claims and actual evidence','Power, boundaries and consent']},
 {id:'society',title:'Society & Influence',description:'Understand persuasive systems and social harms without simplistic moral quizzes.',topics:['Misinformation and persuasion','Vaping and social norms','Manosphere narratives and group identity','Scams, grooming and coercion']},
 {id:'neuro',title:'Neuropsychology & Neurodiversity',description:'Mechanisms of attention, development, sensory difference and accessibility.',topics:['Executive functioning','Autism and heterogeneous profiles','ADHD, motivation and context','Sensory processing and adaptation']},
 {id:'mental',title:'Mental Health Mechanisms',description:'Study psychological models rather than amateur diagnosis.',topics:['Panic and fear of fear','Sleep and insomnia','Compulsions and uncertainty','Depression and behavioural withdrawal']},
 {id:'everyday',title:'Everyday Systems',description:'Apply psychology to work, decisions, values and real constraints.',topics:['Procrastination and avoidance','Burnout and organisational pressures','Negotiation and conflict','Habit change in real life']},
 {id:'research',title:'Psychological Science',description:'Learn methods needed to assess psychological claims.',topics:['Confounding and causal inference','Effect sizes and base rates','Measurement and construct validity','Replication and synthesis']}
].map(s=>Object.freeze({...s,status:'planned'})));
export const ALL_LEARN_COURSES=Object.freeze(LEARN_SCHOOLS.flatMap(s=>s.courses));
export const findLearnSchool=id=>LEARN_SCHOOLS.find(s=>s.id===id)||null;
export const findLearnCourse=id=>ALL_LEARN_COURSES.find(c=>c.id===id)||null;
export const findLearnSpecialism=id=>LEARN_SPECIALISMS.find(s=>s.id===id)||null;
