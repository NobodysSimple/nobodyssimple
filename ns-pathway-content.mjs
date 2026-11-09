/* Choice-specific field guides for the other six starting-point routes.
 * Research informs broad principles, not efficacy claims about these micro-exercises.
 * Every entry is a distinct editorial draft. Do not infer diagnoses or identities.
 */
import {getNeedsMode} from './ns-needs-catalog.mjs';
export const PATH_SOURCES=Object.freeze({
 grief:{name:'NHS · Grief after bereavement or loss',url:'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/grief-bereavement-loss/',scope:'Individual variation in grief, different forms of loss and support'},
 trauma:{name:'NICE NG116 · Post-traumatic stress disorder',url:'https://www.nice.org.uk/guidance/ng116/chapter/recommendations',scope:'Trauma care; recommends against psychologically focused debriefing'},
 mind:{name:'NHS · Mindfulness',url:'https://www.nhs.uk/mental-health/self-help/tips-and-support/mindfulness/',scope:'Optional present-focused attention, which may not suit everybody'},
 problem:{name:'NHS Every Mind Matters · Problem solving',url:'https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/problem-solving/',scope:'Practical problem solving, worry, review and reflection'},
 wellbeing:{name:'NHS · Five steps to mental wellbeing',url:'https://www.nhs.uk/mental-health/self-help/guides-tools-and-activities/five-steps-to-mental-wellbeing/',scope:'Social connection, learning, activity and noticing'},
 panic:{name:'NICE CG113 · Anxiety and panic in adults',url:'https://www.nice.org.uk/guidance/cg113/chapter/Recommendations',scope:'Assessment, CBT and appropriate consideration of physical symptoms'},
 social:{name:'NICE CG159 · Social anxiety disorder',url:'https://www.nice.org.uk/guidance/cg159/chapter/recommendations',scope:'Disorder-specific CBT, safety behaviours and post-event processing'},
 ocd:{name:'NICE CG31 · OCD and BDD',url:'https://www.nice.org.uk/guidance/cg31/chapter/Recommendations',scope:'CBT with exposure and response prevention by appropriately trained practitioners'},
 sleep:{name:'NHS · Insomnia',url:'https://www.nhs.uk/conditions/insomnia/',scope:'Sleep difficulties, contributors, self-help and clinical help'},
 autism:{name:'NICE CG142 · Autism in adults',url:'https://www.nice.org.uk/guidance/cg142/chapter/Recommendations',scope:'Sensory and communication adjustments, accessible settings'},
 abuse:{name:'GOV.UK · Controlling or coercive behaviour guidance',url:'https://www.gov.uk/government/publications/controlling-or-coercive-behaviour-statutory-guidance-framework/controlling-or-coercive-behaviour-statutory-guidance-framework-accessible',scope:'Patterns of coercion, monitoring, safety and safeguarding'},
 urgent:{name:'NHS · Urgent help for mental health',url:'https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/',scope:'Urgent and crisis support routes'},
 anger:{name:'NHS · Get help with anger',url:'https://www.nhs.uk/mental-health/feelings-symptoms-behaviours/feelings-and-symptoms/anger/',scope:'Anger, warning signs, behavioural choices and support'},
 me:{name:'NICE NG206 · ME/CFS',url:'https://www.nice.org.uk/guidance/ng206/chapter/recommendations',scope:'Energy management and avoiding fixed graded-exercise programmes'}
});
export const PATH_LANES=Object.freeze([
 {id:'context',label:'Change the conditions',description:'Environment, demands, time, access and external support'},
 {id:'practice',label:'Try a small practice',description:'A voluntary behavioural or expressive experiment'},
 {id:'thinking',label:'Examine interpretations',description:'CBT-informed reasoning when it fits, not forced positive thinking'},
 {id:'acceptance',label:'Hold complexity and values',description:'ACT-informed willingness, self-kindness and flexibility where appropriate'},
 {id:'support',label:'Relationships, care and limits',description:'Human help, safety, wellbeing and when not to self-manage'}
]);
const D=(what,cycle,caution,methods,refs)=>Object.freeze({what,cycle,caution,methods:methods.map(x=>x.split('|').map(s=>s.trim())),refs:refs.split(' ').filter(Boolean)});
const RAW=Object.freeze({
process:{
 feel:D('Feelings can be allowed space without being declared correct, dangerous or in need of immediate reduction. Sometimes it is difficult to name them, and sometimes distance is protective.','An emotion arises, pressure to fix or analyse it increases, and further struggle with the feeling may add to the original experience. This is a possibility, not a universal cycle.','Do not force attention into bodily sensations or memories when that increases dissociation, panic or danger.',[
 'Find a place and amount of privacy that feel tolerable.|Lower a demand rather than requiring yourself to feel differently.',
 'Try a single descriptive word, colour or gesture for what is here.|Stop after a moment if that is enough.',
 'Notice the difference between what you feel and the story about what it means.|Leave the story undecided if evidence is missing.',
 'Allow the feeling to be present for a manageable moment without making it an instruction.|Choose care or rest that honours your needs.',
 'Ask a trusted person to listen without trying to solve it if that would help.|Seek extra support if feelings repeatedly become unmanageable.'
 ],'mind trauma'),
 express:D('Expression can be writing, art, voice, movement or private silence; it need not be shared or performed for another person.','Holding back every expression can increase pressure, yet sharing too quickly can create new vulnerability. The useful middle differs by person.','Private expression must remain a choice; do not send an unscreened letter or disclose traumatic detail to an unsafe recipient.',[
 'Choose a medium and location with sufficient privacy.|Consider whether you want any record to remain afterward.',
 'Write an unsent paragraph, draw a shape or speak a few words.|Decide later whether any part should be shared.',
 'Separate the raw feeling from requests or accusations about someone else.|Check facts before turning expression into a claim.',
 'Let the expression be unfinished rather than demanding a coherent narrative.|A value such as honesty need not require disclosure.',
 'If you want to share, choose a safe person and a bounded purpose.|Protect private material on shared or monitored devices.'
 ],'mind trauma'),
 event:D('A difficult event has facts, interpretations, bodily responses, relationships and consequences. Not every event has a single lesson or explanation.','A salient detail captures attention, repeated replay seems like understanding, yet new information may stop appearing.','Never require trauma retelling or assume reflective writing is a substitute for trauma-focused care.',[
 'Start with what is happening now and whether you have enough safety to reflect.|Address urgent practical consequences before analysis.',
 'Describe a short timeline using only tolerable details.|Identify which part you actually want to understand.',
 'Separate what happened from what you concluded about motives or blame.|Mark what cannot yet be known.',
 'Recognise that meaning may change without finding a final moral verdict.|You may put down the account for now.',
 'If the event involved abuse or ongoing danger, prioritise safety and support.|Consider specialist care for intrusive trauma symptoms.'
 ],'trauma problem'),
 reaction:D('A reaction can be influenced by threat appraisal, fatigue, memories, values and the immediate social context. Similar behaviour can have different functions.','A trigger or demand meets a vulnerable context, producing an immediate reaction; later shame or avoidance may then intensify the pattern.','Do not use a psychological explanation to dismiss actual threat, pain, coercion or reasonable anger.',[
 'Note the setting, sleep, sensory demands and pressure around the reaction.|Consider which conditions could be changed.',
 'Make a before-during-after sequence of one example.|Notice what your response helped or cost.',
 'List two competing explanations rather than choosing a hidden cause.|Ask what evidence distinguishes them.',
 'Acknowledge the protective intention without endorsing every action.|Choose a future response aligned with your values.',
 'Invite relevant feedback only from people who can respond safely.|Ask for care when reactions are frequent, intense or impairing.'
 ],'problem trauma'),
 mixed:D('Conflicting emotions can reflect different needs, loyalties, values and time horizons. Ambivalence is information, not automatically indecision.','Pressure to pick one true feeling erases important considerations, which later return and create more doubt.','If you face coercion or danger, do not treat the situation as a merely balanced conflict between equally safe options.',[
 'Create room for two truths without demanding an immediate choice.|Notice any external deadline that is real rather than imagined.',
 'Give each feeling one sentence about what it wants to protect.|Compare needs without putting one on trial.',
 'Ask which observations support each fear or hope.|Distinguish a feeling from a prediction.',
 'Let different feelings coexist while you choose what kind of action you value.|Acceptance does not require agreeing with harm.',
 'Discuss the dilemma with a trusted person without outsourcing the decision.|Prioritise safety when a relationship limits your choice.'
 ],'mind problem'),
 grief:D('Grief can follow death, separation, illness, loss of home or a changed future. Sadness, numbness, relief and anger can coexist.','A reminder brings yearning or pain, avoidance may briefly protect, and daily life can feel altered; no fixed stages or timetable follow from this.','Do not prescribe a universal sequence of grieving or insist on memory exercises after traumatic loss.',[
 'Reduce optional demands while accounting for necessary care and routines.|Make space for sleep, practical help and companionship.',
 'Choose one voluntary way to remember, honour or simply notice the loss.|You may choose not to do this today.',
 'Notice guilt-filled counterfactuals without treating every imagined alternative as a fact.|Consider what was knowable at the time.',
 'Allow the relationship or meaning of the loss to change over time.|Moving forward does not require erasing what mattered.',
 'Tell someone whether you need company, concrete help or quiet.|Seek specialist support if grief remains disabling or risk escalates.'
 ],'grief urgent'),
 compassion:D('Self-compassion means a fair response to suffering or mistakes. It does not mean approval, denial of consequences or compulsory reassurance.','An error becomes a global label, harsh criticism increases avoidance, and repair or learning becomes harder.','When harm occurred, keep the other person and any necessary restitution visible; compassion is not exoneration.',[
 'Remove avoidable demands that are feeding the self-attack.|Address physical needs before rehearsing self-judgment.',
 'Write the specific action and its impact without global labels.|Choose one proportionate repair or learning step.',
 'Distinguish the evidence for a mistake from the claim that your whole self is bad.|Replace exaggeration with precision, not praise.',
 'Practise a fair, steady voice toward yourself while retaining accountability.|Let uncertainty about others’ judgments remain uncertain.',
 'Ask someone trustworthy for perspective rather than repeated reassurance.|Seek support if self-criticism becomes persistent or dangerous.'
 ],'mind problem'),
 closure:D('Closure may mean accepting uncertainty, making a repair, setting a boundary or choosing to stop pursuing an answer. It is not always reconciliation.','Searching for a final explanation produces brief certainty but may keep attention bound to an unanswerable question.','Do not urge reconciliation, forgiveness or a confrontation where there has been abuse or ongoing risk.',[
 'List what could still be changed and what is beyond your control.|Prioritise safety and practical unfinished business.',
 'Create a private closing ritual or write a sentence you do not send.|Leave room to revise it later.',
 'Separate evidence you have from the explanation you wish another person would give.|Notice when further analysis brings no new data.',
 'Choose a value-based direction while allowing the absence of perfect resolution.|You can move without declaring everything acceptable.',
 'Seek support for legal, financial or safety consequences if needed.|A trusted witness may be more helpful than pursuing the other person.'
 ],'grief abuse')
},
understand:{
 feelings:D('An emotion label is a tentative description, not a diagnostic result. Several feelings and bodily states can occur together.','A vague bodily or mental change attracts a harsh interpretation, which can obscure the actual circumstances and needs.','Do not interpret unusual physical symptoms as emotional without appropriate medical assessment.',[
 'Check sleep, illness, pain, sensory input and demands before drawing conclusions.|Modify one avoidable load if useful.',
 'Select a few candidate feeling words without forcing a perfect fit.|Notice what changed just before the feeling.',
 'Separate sensation, interpretation and factual situation.|Ask what each candidate label helps you notice.',
 'Treat an emotion as information rather than an order or a verdict.|Choose a value-consistent response even if naming remains uncertain.',
 'Ask for communication or access adjustments when needed.|Seek care if symptoms are new, severe or impairing.'
 ],'mind problem'),
 reaction:D('One reaction rarely reveals a single hidden trait. Sequence, function and context provide better clues than self-judgment.','Trigger, appraisal, response and consequences can form a repeating loop, sometimes reinforced by short-term relief.','Avoid using formulation to excuse harm or to blame someone for responses to real threat.',[
 'Record relevant pressures, power differences, sleep and available support.|Change conditions if they are unrealistic.',
 'Map what happened immediately before and after one reaction.|Notice what the behaviour accomplished in the moment.',
 'Test at least two interpretations of what the reaction meant.|Keep observations separate from inferred motives.',
 'Recognise a possible protective function without deciding that every response was right.|Choose a response you would respect next time.',
 'Invite trusted feedback where safe.|Seek assessment when changes are sudden or interfere with life.'
 ],'problem trauma'),
 pattern:D('A repeated pattern can be maintained by reinforcement, relationships, resources and context; it need not reveal a permanent personality flaw.','Cue leads to response, short-term reward or relief strengthens repetition, and longer-term cost may keep the same cue active.','Patterns involving abuse, addiction or physical illness may need external support, not more self-monitoring.',[
 'Identify whether the environment repeatedly demands the same response.|Change one cue rather than relying only on willpower.',
 'Choose one recent example and map cue, action, short-term gain and long-term cost.|Look for exceptions.',
 'Compare a learning-loop explanation with a material or interpersonal explanation.|Look for contrary cases.',
 'Hold the pattern as changeable without demanding a new identity.|Select the smallest safe experiment.',
 'Ask what resources or people would make an alternative feasible.|Do not track sensitive details on a monitored device.'
 ],'problem'),
 thought:D('Thoughts can contain memories, worries, plans, images and assumptions that require different responses.','Several questions merge into a single threatening story, increasing urgency while reducing clarity.','When a thought concerns immediate danger, act on safety information rather than debating it away.',[
 'Externalise demands on paper or a private device if helpful.|Lower input before tackling complicated questions.',
 'Sort thoughts into facts, predictions, tasks and unanswered questions.|Choose one category to work with first.',
 'Identify which claim could be checked and which cannot currently be known.|Avoid treating mental vividness as proof.',
 'Let unanswerable questions remain open while taking a values-led action.|You need not solve every thought before living.',
 'If repetitive thoughts severely impair life, explore appropriate support.|Use privacy controls for personal notes.'
 ],'problem mind'),
 identity:D('Identity can include chosen commitments, social roles, embodiment, continuity and change. No short exercise can determine who someone really is.','External expectations and internal uncertainties pull against each other, and premature labels may temporarily relieve ambiguity while constraining exploration.','Do not infer gender, sexuality, neurotype or diagnosis from a fantasy, preference, behaviour or questionnaire.',[
 'Notice which settings allow genuine choice and which impose pressure.|Seek affirming and accessible contexts when possible.',
 'Compare how you describe yourself across roles and times.|Notice continuities and changes without scoring them.',
 'Question the belief that one experience must settle your entire identity.|Separate social expectations from personal observations.',
 'Experiment with safe, reversible expressions of chosen values.|Allow language to evolve without turning uncertainty into failure.',
 'Speak with supportive people who respect autonomy.|Avoid coercive or diagnostic claims from others.'
 ],'mind wellbeing'),
 values:D('Values describe directions of living rather than a rank of moral worth, a checklist of achievements or a permanent essence.','A borrowed rule becomes a demand; its mismatch with lived priorities can produce guilt or aimless compliance.','Real constraints matter: a value without resources is not automatically an actionable commitment.',[
 'Notice the choices actually available given money, health, care and time.|Make room for legitimate limits.',
 'Choose an ordinary action that would express one value this week.|Make it small enough to be genuine.',
 'Compare values with fear-driven rules or public approval demands.|Ask whose voice each rule represents.',
 'Hold more than one value in tension, such as care and autonomy.|Choose a direction without demanding moral purity.',
 'Seek practical or relational conditions that make the value livable.|Revisit the value if it no longer fits.'
 ],'wellbeing problem'),
 question:D('Competing explanations help guard against confirmation bias, but the aim is useful discrimination rather than endless doubt.','An initial story anchors attention, selectively matching clues accumulate and alternatives go untested.','If the issue is immediate danger or abuse, do not wait for a perfect probability estimate.',[
 'Gather only the relevant observations you can access fairly and safely.|Avoid surveillance or intrusive checking.',
 'Write two plausible explanations that fit the known facts.|Mark what each would predict differently.',
 'Ask what evidence would change your preferred view.|Separate possibility from probability.',
 'Permit a working conclusion while accepting the limits of available evidence.|Choose reversible action where uncertainty remains.',
 'Consult someone with relevant expertise when stakes are high.|Do not replace professional assessment with inference alone.'
 ],'problem'),
 topic:D('A named difficulty is a starting point for learning, not a diagnosis. Similar symptoms may arise from different processes.','A label gives an apparently complete answer, while physical, contextual and maintaining factors remain unexplored.','Seek appropriate care for new, severe, safety-related or medically unexplained symptoms.',[
 'Consider whether environment, health, poverty or discrimination shapes the experience.|Do not reduce it to a thought pattern.',
 'Read the topic definition before taking a worksheet.|Choose one specific, observable difficulty.',
 'Distinguish diagnostic criteria from general educational examples.|Check whether sources support a particular claim.',
 'Keep several possible mechanisms open and select only relevant strategies.|Progress may mean function rather than symptom elimination.',
 'Use clinical guidance where specialist treatment exists.|Ask for accessible care when needed.'
 ],'problem urgent')
},
act:{
 decision:D('A sound decision considers trade-offs, constraints, values and uncertainty; it cannot eliminate every future regret.','Trying to remove all uncertainty delays action and may allow circumstances to make the choice instead.','Safety, coercion, major financial and legal consequences may require specialist help before deciding.',[
 'Define deadlines and non-negotiable constraints honestly.|Remove options that are not realistically available.',
 'Compare two or three options on benefits, costs and reversibility.|Choose what information could genuinely affect the choice.',
 'Distinguish likely outcomes from worst-case imagery.|Do not convert uncertainty into false percentages.',
 'Use a values-based rule for choosing under imperfect information.|Allow ordinary regret without treating it as proof of failure.',
 'Seek expertise when stakes exceed your knowledge.|Keep final control over decisions affecting you where possible.'
 ],'problem'),
 begin:D('Difficulty starting can reflect ambiguity, fear, executive-function needs, fatigue or impossible demand—not a single motivation deficit.','The task feels threatening or vague, avoidance briefly reduces discomfort, and the task becomes more intimidating.','Do not prescribe pushing through if exhaustion, pain, unsafe conditions or post-exertional worsening are central.',[
 'Reduce environmental friction and unnecessary pressure.|Check whether the task itself needs renegotiating.',
 'Make the entry step physically obvious and achievable in a minute.|Stop or continue based on realistic capacity.',
 'Compare fear of failure with task ambiguity and limited resources.|Different obstacles require different changes.',
 'Make room for discomfort while taking a small values-consistent step if appropriate.|Rest is a valid choice when capacity is exhausted.',
 'Request accommodations, deadlines or assistance when needed.|Review persistent impairment with appropriate services.'
 ],'problem me'),
 step:D('A useful next step is observable, feasible and connected to the actual problem. Tiny actions are not always the whole solution.','A large goal remains abstract, action feels distant, and further planning replaces doing.','Do not shrink an unjust workload into endless self-discipline; some problems need shared or systemic change.',[
 'Choose one condition that would make action more possible.|Move a barrier before creating another demand.',
 'Describe the next action with a time, place and stopping point.|Check whether it can be completed with available energy.',
 'Ask whether this step addresses the key obstacle or merely avoids it.|Distinguish progress from activity.',
 'Treat a small step as an experiment rather than proof of identity.|Adjust without self-punishment if it fails.',
 'Share the plan or ask for material assistance if useful.|When safety is involved, choose support over self-experiment.'
 ],'problem'),
 worry:D('Some worries concern a solvable present issue; others are hypothetical future scenarios. They need different responses.','Attempts to solve an unknowable possibility create more scenarios and brief reassurance, then another question appears.','Do not call concrete threats or material insecurity irrational worry; act on the real problem.',[
 'Reduce real demands that are contributing to worry.|Identify which concerns need a practical resource rather than a mindset change.',
 'Sort a concern into actionable now, actionable later or currently uncertain.|Plan one relevant action for the first category.',
 'Ask whether new thought is adding evidence or repeating a prediction.|Do not confuse feeling responsible with having control.',
 'Allow some hypothetical uncertainty while returning to a chosen activity.|You can care without continuously rehearsing danger.',
 'Seek CBT-based support if worry is persistent and impairing.|Use clinical or practical help for serious real-world threats.'
 ],'problem panic'),
 load:D('Overload often means more is demanded than can reasonably be done. Productivity advice cannot create missing hours or resources.','Competing demands interrupt each other, fatigue rises and unfinished tasks generate further pressure.','If demands involve exploitation or threats, look for safety and rights-based support, not merely better prioritisation.',[
 'List demands and who controls them.|Identify a task to reduce, delay, delegate or decline.',
 'Place each demand into do, change, share or leave.|Make one explicit negotiation.',
 'Challenge the belief that every request has equal urgency.|Check external deadlines rather than assumptions.',
 'Accept limits on what one person can do.|Choose fairness over impossible standards.',
 'Ask for accommodations or concrete assistance.|Review persistent fatigue or health-related limits.'
 ],'problem me'),
 environment:D('The environment can create avoidable distress through noise, light, social rules, access barriers or task friction.','A mismatch between person and setting increases load, reducing available capacity, then the person is blamed for struggling.','Never require forced exposure to painful sensory input or ignore disability and accessibility needs.',[
 'Identify one controllable environmental friction or access need.|Test a safe, reversible adjustment.',
 'Prepare a short adjustment request based on observable effects.|Try an alternative route or location when available.',
 'Separate the assumption that you should tolerate everything from evidence about capacity.|Treat accommodations as legitimate information.',
 'Choose functioning and dignity rather than conformity as the goal.|Protect your own consent about what is tolerable.',
 'Seek formal adjustments or occupational support where relevant.|Escalate unsafe physical conditions appropriately.'
 ],'autism problem'),
 time:D('Time planning is a resource allocation problem, not just a mindset. Transitions, caregiving and rest also take time.','Idealised schedules omit friction, overruns create self-criticism, and the next plan becomes even more unrealistic.','Do not use a packed plan to override illness, disability, sleep or essential care.',[
 'Measure realistic durations and interruptions rather than ideal ones.|Protect necessary rest and transport.',
 'Put a single important block into the calendar with buffer time.|Leave unallocated time.',
 'Compare the claim that you should fit everything with the hours actually available.|Name a conflict instead of hiding it.',
 'Accept that not all worthwhile activities fit today.|Prioritise what matters within constraints.',
 'Negotiate shared responsibilities or deadlines.|Seek adjustments when schedule demands are structurally impossible.'
 ],'problem me'),
 plans:D('Planning possible futures is useful when it clarifies trade-offs; it becomes unhelpful when imagined scenarios are treated as predictions.','One feared future draws attention away from other possibilities and controllable preparations.','For major health, legal or financial commitments, get appropriate specialist input and do not rely on speculative forecasts.',[
 'Identify resources and constraints that would persist across several futures.|Prepare what is useful under more than one scenario.',
 'Compare best, middle and difficult plausible outcomes.|Choose a reversible preparatory action.',
 'Distinguish known trends from invented certainty about another person or the market.|State what would update the plan.',
 'Choose a direction based on values while allowing the future to surprise you.|You need not predict to prepare.',
 'Talk with affected people where appropriate and safe.|Reassess plans at a defined decision point.'
 ],'problem')
},
relate:{
 interaction:D('An interaction contains observable words and actions, interpretations, each person’s context and unequal access to information.','A small signal gets interpreted as motive, protective behaviour follows, and the other person reacts to that behaviour rather than the original event.','Do not require both-sides analysis when one person is threatened, monitored, intimidated or controlled.',[
 'Choose an appropriate time and level of privacy for discussion.|Check whether direct contact is safe.',
 'Describe one specific interaction without summarising the whole person.|Ask an open clarifying question when useful.',
 'Distinguish what you heard from what you inferred about intent.|Keep alternative interpretations proportionate to evidence.',
 'Hold the possibility that you were affected even if intent remains uncertain.|Choose a response consistent with respect and safety.',
 'Use a trusted intermediary or support if dialogue is unsafe.|Respect a refusal to discuss.'
 ],'problem abuse'),
 need:D('A need can be stated plainly without proving another person is wrong. Requests differ from demands and boundaries.','An unspoken need creates disappointment; mind-reading assumptions replace a clear request, increasing resentment.','An unsafe or coercive relationship may not permit honest requests; prioritise protection over communication techniques.',[
 'Identify the concrete resource, change or protection you need.|Consider whether the other person has realistic capacity.',
 'Use a short sentence naming the situation and specific request.|Allow an answer that reveals a real constraint.',
 'Question claims that someone who cares must automatically know what you need.|Look at actions and patterns instead.',
 'Express needs without collapsing them into entitlement or shame.|Hold both your values and the other person’s autonomy.',
 'Seek supportive allies when needs concern accessibility or safety.|If ignored repeatedly, consider what action is within your control.'
 ],'problem abuse'),
 boundary:D('A boundary concerns what you will permit, do or leave. It is not a rule that commands another person’s feelings, contacts or identity.','An unclear limit produces repeated conflict; escalating demands may be mistaken for a boundary even when they remove autonomy.','With coercion, threats or monitoring, a direct boundary announcement can raise danger; create a safety plan instead.',[
 'Assess power and safety before announcing a limit.|Identify the choices genuinely available to you.',
 'State the relevant situation, your limit and what you will do.|Keep the consequence proportionate and within your control.',
 'Distinguish preference, agreement, ultimatum, coercion and personal boundary.|Do not label disagreement itself as abuse.',
 'Respect other people’s autonomy while protecting your own.|A boundary may lead to incompatibility, not obedience.',
 'Seek confidential support if a limit cannot be set safely.|Use practical and legal resources when needed.'
 ],'abuse problem'),
 argument:D('Recurring arguments may involve incompatible needs, learned escalation, power and unmet practical conditions.','One cue leads to blame or defensiveness, both parties react to the new threat, and the original issue is never addressed.','Do not recommend joint dialogue or equal-blame framing in situations of abuse or coercive control.',[
 'Pause the discussion when escalation makes it unproductive.|Address sleep, privacy, time and safety before retrying.',
 'Choose one specific recurring sequence instead of debating character.|Agree a concrete change if both can do so safely.',
 'Distinguish observed behaviour and its impact from mind-reading accusations.|Examine repeated outcomes rather than isolated apologies.',
 'Recognise that understanding both experiences need not mean equal responsibility.|Choose repair over winning.',
 'Use appropriate mediation only in non-abusive situations.|Seek confidential safety support when fear or control is present.'
 ],'anger abuse'),
 repair:D('Repair requires acknowledgement of impact, responsibility, changed behaviour and respect for the harmed person’s choices.','An apology eases guilt temporarily but repeating the same action restores the injury and weakens trust.','No one is obliged to forgive, resume contact or provide access; self-blame is not repair when you were harmed.',[
 'Stop the behaviour and address any immediate practical harm first.|Give the other person space and safety.',
 'Name the specific action, its impact and the change you will make.|Follow through over time without demanding reassurance.',
 'Challenge a defensive focus on good intentions if it erases observable consequences.|Also avoid treating one failure as a permanent identity.',
 'Let accountability coexist with self-respect.|Accept that the outcome of repair is not fully yours to control.',
 'Seek specialist help if the harm involves addiction, violence or coercion.|Respect the other person’s boundaries.'
 ],'abuse problem'),
 feel:D('Feelings about someone may be affectionate, angry, ambivalent or unresolved. They do not necessarily dictate what you should do.','Strong feeling drives quick interpretation or contact, then consequences create further feeling.','Do not use reflection as pressure to reconcile with someone who has harmed you.',[
 'Give yourself physical and social distance if contact intensifies distress.|Protect privacy while reflecting.',
 'Describe affection and resentment separately rather than cancelling one.|Delay consequential communication until chosen.',
 'Separate feeling, memory and current evidence about the relationship.|Check whether a feared outcome is established.',
 'Let complexity exist without treating it as permission for harm.|Choose behaviour consistent with your values.',
 'Speak with a trusted person without surrendering your own judgment.|Prioritise safety if there is control or intimidation.'
 ],'mind abuse'),
 resent:D('Resentment can flag inequity, repeated boundary crossings, unmet needs or interpretations that need checking.','Repeated sacrifice goes unacknowledged, silent expectations grow and later requests emerge as anger.','Do not assume resentment is only a thinking error when demands or coercion are real.',[
 'Map who does what and which tasks are visible or invisible.|Consider material and power constraints.',
 'Ask for a specific redistribution or change rather than a character verdict.|Notice whether commitments are honoured.',
 'Distinguish evidence of unfair load from assumptions about intent.|The impact can be real without knowing motives.',
 'Honour values of fairness and care without demanding that you never feel annoyed.|Set a limit within your control.',
 'Seek outside help when inequity is enforced by financial dependence or control.|Consider relationship support only where safe.'
 ],'anger abuse'),
 unsafe:D('Fear, monitoring, coercion, threats and restricted choices are safety concerns—not a communication exercise to complete correctly.','The person adapts behaviour to prevent escalation, apparent compliance increases, and choices may narrow further.','Do not confront, document on an unsafe device, negotiate with an abuser or suggest couple mediation as a substitute for safety.',[
 'Use a safer device and location if you can.|Consider immediate physical safety and trusted contacts.',
 'Decide whether contacting a confidential specialist service is feasible.|Avoid steps that might trigger monitoring or retaliation.',
 'Do not reinterpret threats as merely attachment style or bad communication.|Look at patterns of control and impact.',
 'Protect the right to make your own choices without requiring a confrontation.|Leaving may require careful planning.',
 'If in immediate danger in the UK call 999; for urgent mental health support use NHS 111.|Seek specialist domestic abuse and safeguarding help when relevant.'
 ],'abuse urgent')
},
learn:{
 browse:D('A catalogue of difficulties is an index, not a diagnostic test. Begin with a topic you recognise rather than trying to label yourself.','Searching labels can create apparent certainty before alternative explanations and appropriate care are considered.','Do not replace professional assessment with matching symptoms in a list.',[
 'Consider whether the concern has physical, practical or environmental dimensions.|Choose a topic that describes an experience, not an identity.',
 'Read one guide and choose one useful question to investigate.|Stop browsing when you have enough to act.',
 'Check definitions, evidence sources and who the findings apply to.|Compare at least one alternative explanation.',
 'Keep the label provisional and choose an action that fits your actual circumstances.|Uncertainty is not a failure.',
 'Seek specialist care for severe, persistent or unfamiliar symptoms.|Use the urgent support route when safety is at stake.'
 ],'problem urgent'),
 sleep:D('Sleep difficulty can involve insomnia, circadian timing, pain, medication, shift work, stress or environment; one recommendation will not suit everybody.','A poor night increases worry and effort around sleep; monitoring and compensations may sustain distress even when other contributors are present.','Do not advise sleep restriction without appropriate clinical guidance, or ignore possible sleep apnoea, medication effects or safety-critical sleepiness.',[
 'Check light, noise, timing, pain, schedule and physical health factors.|Choose feasible changes rather than blaming yourself.',
 'Keep a short, optional record of patterns if it helps identify causes.|Avoid excessive checking that heightens arousal.',
 'Notice catastrophic conclusions about one poor night.|Distinguish discomfort from a certain prediction about tomorrow.',
 'Allow rest without forcing yourself to produce sleep on command.|Choose a workable routine, not perfection.',
 'Ask about evidence-based CBT-I when insomnia is persistent.|Seek medical review for snoring with breathing pauses or unexplained daytime sleepiness.'
 ],'sleep problem'),
 rumination:D('Rumination is repetitive dwelling on problems, losses or self-evaluations that may cease to generate new information.','Repeating why-questions gives a feeling of work while strengthening attention on an unresolved theme.','Do not label practical problem solving, grief or justified concerns as pathological overthinking.',[
 'Reduce unhelpful interruptions and identify any practical issue requiring attention.|Set an appropriate time to address solvable concerns.',
 'Notice when a thought loop stops producing new facts or actions.|Move gently to a chosen activity or one concrete step.',
 'Ask whether the thought is a question that evidence can answer.|Change the question from why am I like this to what matters next.',
 'Make room for an unanswered feeling without needing complete explanation.|Choose a valued action despite residual uncertainty.',
 'Seek support if rumination is pervasive or linked to significant depression or anxiety.|Use urgent support if safety deteriorates.'
 ],'problem mind'),
 social:D('Social anxiety may involve fear of judgment, self-focused attention, avoidance and learned expectations; shyness alone is not a diagnosis.','Anticipation and safety behaviours prevent useful disconfirmation, while post-event reviewing makes the feared interpretation feel more certain.','Do not push unplanned exposure in unsafe, discriminatory or inaccessible environments; disorder-specific treatment is more than one app exercise.',[
 'Consider actual social context, accessibility and discrimination before challenging the appraisal.|Choose safer practice settings.',
 'Notice one safety behaviour that may limit learning.|Discuss graded experiments with qualified support if difficulties are impairing.',
 'Ask which evidence supports your prediction of judgment.|Separate visible reactions from imagined inner opinions.',
 'Allow some social uncertainty while communicating in a way that matters to you.|Confidence is not a prerequisite for participation.',
 'NICE recommends individual CBT designed for social anxiety disorder.|Seek appropriate assessment rather than treating this guide as the treatment.'
 ],'social autism'),
 panic:D('Panic experiences involve intense bodily alarm but similar sensations can have medical causes, especially when new or unusual.','Fear of sensations may amplify arousal and avoidance during familiar episodes. This is not proof that any given symptom is panic.','Sudden persistent chest pain, severe breathing difficulty or collapse require emergency assessment; do not dismiss new symptoms.',[
 'Check immediate safety and lower avoidable demands.|Seek medical evaluation when symptoms are unfamiliar or concerning.',
 'Use a previously safe grounding or orienting method if helpful.|Avoid forcing breathing patterns that feel uncomfortable.',
 'Notice whether a catastrophic interpretation is based on established evidence.|Do not debate genuine red-flag symptoms.',
 'Permit familiar transient sensations without demanding instant control.|Choose a safe, manageable next action.',
 'NICE supports disorder-specific CBT for panic disorder.|For new or severe physical symptoms, follow appropriate medical pathways.'
 ],'panic urgent'),
 checking:D('Checking can be sensible; repetitive reassurance or rituals may become distressing and impairing, sometimes as part of OCD.','Anxiety leads to checking, checking briefly reduces uncertainty, and the demand for certainty returns.','Never prevent medically necessary safety checking; OCD exposure and response prevention is a structured treatment, not a DIY challenge imposed by an app.',[
 'Distinguish genuine safety procedures from repetitive checking beyond requirements.|Keep necessary checks in place.',
 'Record when a check yields new information and when it merely repeats reassurance.|Do not force exposure without support.',
 'Ask whether the feared conclusion has new evidence or only renewed discomfort.|Avoid universal rules about how often checking is allowed.',
 'Recognise uncertainty without treating the thought as a command.|A chosen life may involve tolerating manageable doubt.',
 'NICE recommends CBT with ERP for OCD, adjusted to severity and preference.|Seek skilled assessment when compulsions impair functioning.'
 ],'ocd problem'),
 submission:D('Compliance can reflect freely chosen generosity, pressure, habit, power differences or fear. Context determines whether it is safe and consensual.','Perceived threat of disapproval leads to automatic agreement, temporary relief follows, and the person’s preferences receive less practice.','Do not treat chosen submission or consensual intimacy as inherently pathological; coercion and inability to refuse require safeguarding.',[
 'Identify power, dependence and whether refusal carries a credible penalty.|Prioritise safer conditions before assertion practice.',
 'Try a low-stakes preference statement where you have genuine freedom.|Notice what happens without forcing conflict.',
 'Separate the prediction that disagreement means rejection from observable evidence.|Take coercive threats literally.',
 'Respect chosen roles and consent while maintaining the right to change your mind.|Autonomy matters more than appearances.',
 'Seek confidential support when pressured or controlled.|Use specialist help for safety rather than confronting a coercive person.'
 ],'abuse problem'),
 other:D('Use the atlas to search by ordinary words and experiences. You do not need to know a diagnosis to begin.','Trying to find the perfect label can delay practical support and make a partial match feel definitive.','If the problem is urgent, severe or unfamiliar, prioritise appropriate medical or safety care.',[
 'Name the everyday impact or setting that matters most.|Look at material and bodily conditions as well as thoughts.',
 'Search a broad phrase, then read one relevant topic.|Pick one safe next action rather than endless browsing.',
 'Ask whether the chosen topic actually describes your situation.|Keep alternative causes open.',
 'Allow the category to remain a working label.|Revise it if the evidence or experience changes.',
 'Use the specific guide’s sources and limits.|Seek appropriate care for persistent or high-risk difficulties.'
 ],'problem urgent')
},
unsure:{
 relief:D('You can seek a little relief without naming a feeling or problem. Start with what feels tolerable.','A demand to identify the correct issue can itself increase load and prevent a basic adjustment.','Do not use a settling exercise to delay urgent physical or safety support.',[
 'Reduce one avoidable input or obligation.|Choose a quieter, safer setting if available.',
 'Try a brief optional orienting or grounding practice.|Stop if it feels unpleasant or ineffective.',
 'You do not need to explain why the strategy works or fails.|Notice only whether the next moment is more manageable.',
 'Accept uncertainty about the underlying cause for now.|Choose care rather than a forced emotional outcome.',
 'Seek urgent assistance if health or safety requires it.|Return to a named guide only if useful.'
 ],'mind urgent'),
 room:D('Making space is a reasonable starting point even when you cannot define the experience.','Pressure to decide what the emotion means may get in the way of letting it be felt or expressed.','Do not pressure yourself to disclose or relive trauma; a brief pause, privacy or external support may be safer than introspection.',[
 'Find privacy, comfort or distance from demands.|Choose whether to write, draw, speak or sit quietly.',
 'Give the experience a few words if you want.|Finish at any time without producing a conclusion.',
 'Leave interpretations open when little information is available.|Do not confuse intensity with certainty.',
 'Allow the feeling without making it an instruction to act.|Choose one kind response to yourself.',
 'Ask someone safe to listen or help practically.|Stop and seek support if reflection intensifies distress.'
 ],'mind trauma'),
 clarity:D('Clarity can mean separating facts, feelings and questions, not finding the one true explanation.','Everything feels mixed together, so seeking a total answer makes the task harder.','If your concern is immediate danger or medical symptoms, address it directly before reflective analysis.',[
 'Reduce distractions and check basic physical needs.|Choose one manageable question.',
 'Name what is observed, felt and assumed.|Keep an unknown category instead of guessing.',
 'Ask which belief actually has evidence.|Let more than one explanation remain possible.',
 'Choose clarity sufficient for the next decision, not total certainty.|Rest from analysis when it stops helping.',
 'Use professional input for high-stakes uncertainty.|Ask trusted people for information rather than a verdict about you.'
 ],'problem mind'),
 practical:D('A practical step can be useful even when the problem has not been perfectly named.','The search for the correct plan grows, while a small reversible opportunity is missed.','Some problems are too unsafe or structurally constrained for a solo micro-step.',[
 'Check whether the barrier is practical, interpersonal or health-related.|Change a condition you can actually influence.',
 'Choose one action with a clear start and stopping point.|Make it reversible where possible.',
 'Ask what the action would teach you about the problem.|Do not make one outcome into a global judgment.',
 'Allow uncertainty and start only within your available capacity.|Stopping or asking for help can be an effective decision.',
 'Share a demand or request practical assistance.|Seek urgent care when risks are serious.'
 ],'problem'),
 look:D('Browsing is a valid choice. You can learn about experiences without turning the browsing history into a self-description.','Too many options increase cognitive load, and the attempt to find a perfect category becomes its own task.','A search result is not a diagnosis and is not a substitute for immediate help.',[
 'Choose an area of life rather than an identity label.|Ignore topics that do not seem relevant.',
 'Read one short description and explore only if it is useful.|Stop browsing when you have a next step.',
 'Check what a page actually claims and whether it cites appropriate sources.|Keep untested claims provisional.',
 'Treat exploration as optional curiosity, not compulsory introspection.|You are allowed to return later.',
 'Use human support for urgent, complex or impairing concerns.|Keep personal information private when browsing.'
 ],'problem urgent')
}
});
export function pathGuide(modeId,optionId){
 const option=getNeedsMode(modeId)?.options.find(x=>x.id===optionId);
 const data=RAW[modeId]?.[optionId];
 return option&&data?Object.freeze({id:modeId+'/'+optionId,mode:modeId,option:optionId,title:option.title,summary:option.description,...data}):null;
}
export const PATH_GUIDES=Object.freeze(Object.fromEntries(Object.keys(RAW).flatMap(mode=>Object.keys(RAW[mode]).map(option=>[mode+'/'+option,pathGuide(mode,option)]))));
