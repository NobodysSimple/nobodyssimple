import {G,M} from './ns-steady-guide-utils.mjs';
export const STEADY_GUIDES_B=Object.freeze({
 'steady-disconnected':G(
 'Feeling disconnected: find your footing gently',
 'Support for numbness, shutdown and experiences of feeling unreal without forcing inner focus.',
 'Some people describe feeling distant from their emotions, body, other people or surroundings. Numbness, shutdown and derealisation-like experiences can occur in different contexts, including stress, exhaustion and trauma, and they do not establish a diagnosis.',
 ['Feeling emotionally flat or unable to access words','Feeling distant from a room, body or conversation','Going quiet or finding ordinary decisions too much','Feeling detached after intense stress or overstimulation','A sense of unreality that is distressing or recurrent'],
 'High demand or threat → withdrawal or disconnection → worry about being disconnected → increased monitoring or pressure to “feel normal”. This is only a possible pattern, and some experiences require clinical assessment.',
 ['Stress, trauma and prolonged pressure','Sensory and communication overload','Sleep loss, medication or physical illness','Anxiety about what the experience might mean','Lack of privacy or safe support'],
 ['Establish safety and comfort before demanding reflection','Find grounding that is tolerable—not necessarily body-focused','Seek assessment for new, persistent or markedly impairing experiences'],
 ['New confusion, sudden neurological symptoms, fainting or serious physical illness require urgent assessment','Do not force trauma recall, intense internal focus, breath-holding or dramatic sensory stimulation','If experiences are recurrent or highly distressing, discuss with a GP or trained mental health professional'],
 'Progress may mean better access to rest, a reliable way to signal needs, or less fear of an experience—not immediately feeling fully present.',
 {
 context:[
  M('Reduce immediate demands','An overwhelmed system may have limited capacity for conversation or decisions.','Move to a place that feels safer or less demanding if possible.|Lower unnecessary questions, noise and social pressure.|Allow some quiet time without insisting on explanation.','The person’s need for silence or company must be respected, not assumed.',['nice-ptsd','nice-autism']),
  M('Find a predictable external anchor','Familiar environmental information can help some people orient.','Notice a neutral object, its colour and its location.|Name where you are and what is happening now.|Return to a familiar activity if comfortable.','If grounding increases distress or unreality, stop and choose a different approach.',['nice-ptsd','nhs-mindfulness'])
 ],
 behaviour:[
  M('Prepare a low-language communication card','Words may be difficult during shutdown or disconnection.','Write a brief message such as “I need a quiet break”.|Agree where to display or send it.|Include only the assistance you want, such as time, quiet or practical help.','Never require disclosure of trauma or a diagnosis to use the card.',['nice-autism']),
  M('Re-establish one ordinary routine gently','Predictable familiar actions may help without demanding deep emotional analysis.','Choose a safe, manageable routine such as having water or sitting in a familiar space.|Carry out only that one familiar action, without an extra goal.|Stop if the action increases discomfort or strain.','Do not impose action if movement or orientation is medically unsafe.',['nhs-mindfulness'])
 ],
 thinking:[
  M('Separate a frightening label from what is observed','Catastrophic interpretations may increase fear of the experience.','Describe the experience simply, such as “the room feels distant”.|Notice any prediction about what it must mean.|Keep medical uncertainty open where symptoms are new or severe.','Do not replace proper evaluation with reassurance that it is harmless.',['nice-ptsd']),
  M('Avoid constant self-testing','Repeatedly checking whether you feel “normal” may keep attention fixed on the sensation.','Notice when you test your feelings or reality again and again.|Ask whether the test gives useful new information.|When safe, gently return attention to a manageable external task.','Medical or safety monitoring is different from habitual reassurance and may be necessary.',['nhs-mindfulness'])
 ],
 dbt:[
  M('Orient to concrete facts','A DBT-informed grounding adaptation can focus on the environment rather than intense internal attention.','Identify a neutral sound or surface around you.|Name the day or location if helpful.|Pause without forcing emotions to appear.','This is not an intervention for acute confusion or neurological emergencies.',['nice-ptsd','nice-selfharm']),
  M('Build a low-pressure sensory comfort set','Gentle familiar sensations may be more tolerable than a powerful “shock” technique.','Choose one familiar, comfortable input.|Try it briefly with full control over stopping.|Note if it helps, does nothing or worsens the state.','Avoid ice-water immersion, breath-holding or sensory overwhelm as generic remedies.',['nice-autism','nas-sensory'])
 ],
 act:[
  M('Release the demand to feel the right way','ACT-informed willingness can target the secondary struggle against numbness.','Notice the statement “I must feel normal right now”.|Consider whether you can let the current experience be unfinished.|Choose a small self-care action that matters to you.','Acceptance does not mean tolerating unsafe surroundings or avoiding needed assessment.',['act-review']),
  M('Choose valued contact without forcing closeness','Connection can take different forms when emotions feel distant.','Identify a relationship or activity that matters.|Choose a low-pressure form of contact, such as sitting nearby or sending a short text.|Notice whether it suits you today.','Do not push disclosure, touch or social demands when they increase shutdown.',['act-review','nice-autism'])
 ],
 support:[
  M('Seek assessment for persistent dissociation-like experiences','NICE recognises dissociation and numbing in the context of PTSD, but they are not specific to PTSD.','Note how often experiences occur and their impact.|Discuss new, recurrent or very distressing episodes with a GP or trained clinician.|Ask about medical, medication, stress and trauma factors as appropriate.','Do not use this guide to diagnose a trauma disorder or explain every unusual perception.',['nice-ptsd']),
  M('Plan supportive responses with someone you trust','A clear support plan can reduce demands during difficult episodes.','Say what kind of response is helpful: quiet, gentle orientation or practical support.|Specify what makes things worse, such as sudden touch or many questions.|Agree how to access appropriate help if safety changes.','If there is an unsafe relationship, do not share a plan with someone who could exploit it.',['nice-ptsd','nice-autism'])
 ]
 },['nice-ptsd','nice-autism','nhs-mindfulness','act-review','nice-selfharm']),
 'steady-depleted':G(
 'Exhaustion and reduced capacity: protect energy',
 'Support for fatigue, burnout-like demands, recovery and health without assuming lack of motivation.',
 'Feeling depleted can reflect insufficient recovery, demanding circumstances, caregiving, illness, sleep problems, medication effects or other physical causes. Persistent fatigue deserves appropriate assessment. It is not necessarily a failure of motivation or resilience.',
 ['Tiredness that interferes with concentration or action','Reduced tolerance for noise, social contact or decisions','Emotional flatness or irritability after sustained demands','Fatigue after caring, work, study or illness','Exhaustion that remains even after rest'],
 'Demands exceed available energy → pushing harder or skipping recovery → less capacity → demands feel even larger. Some illnesses include post-exertional worsening; this is not a habit that should simply be challenged.',
 ['Sleep disruption or sleep-disordered breathing','An illness, medication, anaemia or hormonal condition','Caring roles, long working hours or financial strain','Sensory and social effort','ME/CFS or other conditions involving post-exertional malaise'],
 ['Reduce avoidable demands before prescribing effort','Identify energy limits and appropriate supports','Recognise red flags and seek care when fatigue is persistent or unexplained'],
 ['See a GP when fatigue persists for weeks, impairs life, or comes with other symptoms, including sleep-related gasping','Do not use fixed incremental exercise plans or “push through” advice for possible ME/CFS or post-exertional malaise','New severe weakness, collapse or concerning physical symptoms require appropriate urgent care'],
 'Progress may look like better pacing, more reliable rest, reduced demands, accommodations or medical clarification—not always higher activity.',
 {
 context:[
  M('Remove a nonessential demand','Reducing load can be more useful than increasing motivation.','List unavoidable demands for today.|Find one that can be deferred, shared or made accessible.|Treat any recovered capacity as room to recover, not an obligation to fill.','Structural barriers and care needs may require formal assistance.',['nhs-fatigue','nice-mecfs']),
  M('Protect a recovery environment','A quiet, comfortable setting can make rest more possible.','Identify the most disruptive noise, light or interruption.|Adjust one variable where feasible.|Let recovery be rest, not another performance goal.','Not everybody rests well in silence or darkness; follow preference.',['nhs-fatigue','nice-autism'])
 ],
 behaviour:[
  M('Pace within your actual limits','Energy management aims to avoid exceeding the person’s current capacity.','Notice what activities cost energy, including cognitive and social activity.|Plan essential activities and rest around your own limits.|Review whether symptoms worsen afterward or the next day.','For suspected ME/CFS or post-exertional malaise, do not increase activity by fixed amounts; seek specialist advice.',['nice-mecfs']),
  M('Check ordinary needs without creating a rigid routine','Food, hydration, pain relief and rest may be relevant, but not all fatigue is lifestyle-related.','Ask which basic need has been missed or made difficult.|Address one practical need if possible.|Seek care if fatigue persists or remains unexplained.','Do not interpret a lack of improvement as a failure to try hard enough.',['nhs-fatigue'])
 ],
 thinking:[
  M('Challenge the moral judgement, not the symptoms','“I am lazy” is an interpretation, not a measurement of physical capacity.','Notice a global judgement about effort or worth.|List observable facts about your energy and demands.|Choose a fairer description that preserves your limits.','CBT should not be presented as a cure for ME/CFS or for physical fatigue.',['nice-mecfs']),
  M('Revise an unrealistic productivity rule','All-or-nothing expectations can remove recovery opportunities.','Identify a rule such as “I must catch up today”.|Ask what is realistically essential and safe.|Set a reduced plan that allows genuine rest.','Do not encourage giving up essential medical treatment or necessary care tasks.',['nhs-fatigue'])
 ],
 dbt:[
  M('Use a compassionate check of current capacity','A DBT-informed mindful pause asks what is workable before action.','Notice energy, pain, emotional and sensory load without grading yourself.|Choose the support you need now.|Allow “rest” to be a valid answer.','Body scanning may be unhelpful if it increases symptom monitoring; focus outward instead.',['nhs-mindfulness']),
  M('Use distress tolerance during an unavoidable wait','When demands cannot immediately change, a comfort strategy may help temporarily.','Choose a familiar comfortable input or position.|Limit avoidable demands while you wait.|Seek practical relief rather than treating coping as a permanent solution.','A distress-tolerance skill does not make an unsafe workload acceptable.',['nice-selfharm'])
 ],
 act:[
  M('Unhook from productivity as identity','ACT-informed defusion can loosen the idea that worth depends on output.','Notice a thought such as “if I rest, I am failing”.|Let the thought be a mental event rather than an instruction.|Choose rest or a feasible action in line with health and values.','Values do not require pushing through post-exertional malaise.',['act-review','nice-mecfs']),
  M('Choose accessible valued activity','Valued living can include tiny actions, contact or rest within capacity.','Identify what matters while unwell or exhausted.|Choose a form that fits current limits.|Adjust or stop if it worsens symptoms.','Do not use “committed action” as disguised graded exercise therapy.',['act-review','nice-mecfs'])
 ],
 support:[
  M('Seek medical review for persistent or unexplained fatigue','Fatigue has many possible physical and psychological contributors.','Note duration, sleep quality, other symptoms and medications.|Discuss persistent fatigue with a GP.|Ask about relevant investigations and support where appropriate.','Snoring with gasping or choking warrants assessment for possible sleep apnoea.',['nhs-fatigue','nice-mecfs']),
  M('Request structural changes or care support','A sustainable solution often needs changes in responsibilities and access.','Identify the specific task, schedule or caregiving burden.|Request a concrete reduction, flexible arrangement or accessible format.|Follow up with workplace, university or care services if necessary.','Do not place the responsibility for unsafe workloads entirely on the individual.',['nice-autism','nice-mecfs'])
 ]
 },['nhs-fatigue','nice-mecfs','nice-autism','act-review','nhs-mindfulness']),
 'steady-restless':G(
 'Restlessness and understimulation: meet the need',
 'Make room for movement, stimulation and meaningful engagement without treating every urge as a disorder.',
 'Restlessness can be physical, attentional, sensory or emotional. Some people need movement or more stimulation to regulate, while others experience agitation from anxiety, medication or illness. Restlessness alone is not a diagnosis.',
 ['Wanting movement, touch or sound','Feeling bored despite having tasks to do','Finding stillness uncomfortable','Restlessness after long seated or repetitive activity','A new sense of agitation alongside medication, illness or sleep changes'],
 'Low stimulation or an unmet movement need → discomfort → frantic task-switching or fighting the urge → more frustration. In some cases restlessness reflects anxiety or a medical cause instead.',
 ['Natural differences in sensory seeking or attention','Restricted movement opportunities','Stress, uncertainty or insufficient sleep','Medication side effects or substance use','Poor match between task demands and interest'],
 ['Explore safe movement and stimulation without shame','Create accessible choices for engagement and concentration','Recognise new, severe or medication-related agitation'],
 ['Seek medical advice if severe or unusual restlessness began after medication changes or is accompanied by significant mood and sleep changes','Do not advise strenuous activity to someone with illness, pain or post-exertional worsening','Not everyone benefits from stillness, meditation or breath focus'],
 'Progress can mean finding a comfortable movement pattern, better task engagement, more useful stimulation or obtaining medical clarity.',
 {
 context:[
  M('Adjust stimulation rather than forcing stillness','A mismatch between sensory input and need can make concentration difficult.','Notice whether you want more movement, texture, sound or novelty.|Choose a safe input that suits the environment.|Review whether it helps or distracts further.','Avoid overstimulating others or ignoring safety-critical attention demands.',['nice-autism','nas-sensory']),
  M('Make movement an accepted part of the setting','Some settings can accommodate standing, walking or fidgeting.','Identify when stillness is unnecessarily required.|Choose a movement option that does not create risk.|Ask for a reasonable adjustment if needed.','Do not force movement if mobility or fatigue makes it unsafe.',['nice-autism'])
 ],
 behaviour:[
  M('Try a brief chosen movement break','Movement can be practical self-regulation, not a punishment or productivity hack.','Select a comfortable, safe movement.|Try it briefly without a target number of repetitions.|Return to the activity only if you wish and can do so.','Avoid pushing through pain, dizziness or post-exertional symptoms.',['nhs-wellbeing','nice-mecfs']),
  M('Add an engaging first step','A task may need clearer reward or accessible cues rather than harder effort.','Choose something that matters or interests you.|Reduce the first step until it is feasible.|Give yourself permission to stop and reconsider.','A practical strategy cannot replace clinical review of new severe agitation.',['nhs-wellbeing'])
 ],
 thinking:[
  M('Question shame about needing movement','Self-criticism can add distress to an otherwise ordinary sensory need.','Identify any thought such as “I should be able to sit still”.|Compare it with what you actually need to function.|Choose a fairer description of your attention or movement needs.','Do not infer ADHD or any other diagnosis from restlessness.',['nice-autism']),
  M('Distinguish boredom from danger','Some restlessness involves worried anticipation rather than sensory need.','Notice whether you are seeking interest or anticipating a threat.|Choose a response that fits the actual situation.|If worry is prominent, explore it without automatically pathologising boredom.','Do not use reassurance to ignore real external threats or medication reactions.',['nhs-mindfulness'])
 ],
 dbt:[
  M('Mindfully observe a safe movement','DBT-informed mindfulness can be active and sensory, not always seated.','Choose an ordinary comfortable movement.|Notice the contact or rhythm for a moment.|Let your attention move naturally instead of forcing stillness.','Avoid intense internal focus if it aggravates panic or dissociation.',['nhs-mindfulness']),
  M('Use a low-risk sensory comfort choice','Distress-tolerance skills can involve chosen sensory input.','Pick a safe familiar texture, movement or sound.|Try it without a promise of feeling calm.|Stop when it stops being useful.','Do not use extreme temperatures or sensation-seeking that could injure you.',['nas-sensory'])
 ],
 act:[
  M('Accept the urge without having to obey every impulse','ACT-informed willingness distinguishes a sensation or urge from its demanded action.','Notice restlessness or the desire to switch tasks.|Make room for it briefly if comfortable.|Decide whether to move, stay or change the task according to the context.','Acceptance is not a reason to remain in pain or ignore a genuine access need.',['act-review']),
  M('Connect stimulation with chosen values','Enjoyment, exploration and play can be legitimate aims.','Identify a valued interest or creative action.|Choose a form that matches your energy.|Let its purpose be engagement, not symptom elimination.','Do not impose a productivity outcome on recreation.',['act-review','nhs-wellbeing'])
 ],
 support:[
  M('Check for new or intense agitation','Restlessness can be related to substances, medicines or medical conditions.','Notice whether it is new, severe or markedly different.|Review medication and health changes with a clinician as appropriate.|Use urgent care if accompanied by dangerous symptoms or unsafe impulses.','Do not stop prescribed medication abruptly based on a self-help guide.',['nhs-fatigue']),
  M('Request a flexible working or learning format','Some difficulties are made worse by rigid access expectations.','Name the movement or sensory flexibility that helps.|Ask for a specific adjustment where reasonable.|Review its usefulness without hiding all your needs.','Disclosure decisions should consider privacy and safety.',['nice-autism'])
 ]
 },['nice-autism','nas-sensory','nhs-wellbeing','act-review','nhs-fatigue']),
 'savour-good':G(
 'Savouring: notice and nurture what matters',
 'A guide to appreciating good experiences without pressure to feel happy.',
 'Savouring means paying attention to a pleasant, meaningful or satisfying experience—past, present or anticipated—when you choose to. It is not compulsory gratitude, denial of hardship or a requirement to intensify positive emotions.',
 ['A small pleasure you want to remember','A meaningful connection or achievement','Relief, contentment, pride or curiosity','An enjoyable experience that passes too quickly','Mixed joy and sadness, such as a meaningful milestone after loss'],
 'An enjoyable moment → attention immediately moves to demands or self-judgement → little opportunity to notice its meaning. This is a description of one pattern, not a disorder or proof that happiness is being blocked.',
 ['Attention divided across tasks','Beliefs that enjoyment must be earned','Stress and uncertainty','Social support and opportunities for enjoyment','Culture, neurotype and individual preference for expressing happiness'],
 ['Choose to appreciate rather than perform positivity','Make room for positive and negative feelings together','Connect meaningful enjoyment with values and everyday life'],
 ['Do not force gratitude, positivity or social sharing during grief, trauma or ongoing harm','Sudden unusually elevated mood with very little sleep, major impulsivity or marked change in functioning may need assessment','If trying to savour increases distress, stop without self-criticism'],
 'Progress might be noticing one appreciated detail, making a moment more accessible, allowing mixed feelings or creating opportunities for meaningful engagement.',
 {
 context:[
  M('Make a moment less interrupted','An environment with fewer competing demands can create space to notice something enjoyable.','Choose a moment you genuinely want to appreciate.|Reduce one avoidable interruption.|Give the experience your attention for a comfortable amount of time.','Do not make the exercise compulsory or a new obligation.',['nhs-wellbeing']),
  M('Design accessible enjoyment','Sensory, mobility and economic needs influence opportunities to enjoy things.','Identify which aspects of a pleasant experience you prefer.|Adjust access, sound, timing or social expectations where feasible.|Keep the activity small and personally meaningful.','Do not assume everyone can buy experiences or leave the home.',['nice-autism','nhs-wellbeing'])
 ],
 behaviour:[
  M('Notice one precise detail','Savouring focuses on an experience rather than an abstract demand to “be grateful”.','Choose something pleasant or meaningful.|Notice one sound, image, feeling or interaction you appreciate.|Let the attention return naturally to ordinary life.','Do not force bodily focus if it feels unpleasant.',['savour-review','nhs-wellbeing']),
  M('Build a gentle positive-memory cue','A chosen reminder may make a meaningful experience easier to revisit.','Record a brief line, image or song associated with an experience if you wish.|Return to it only when you genuinely want to revisit the memory.|Notice any feeling without testing whether happiness increased.','Do not turn memories into repetitive comparison with the present.',['savour-review'])
 ],
 thinking:[
  M('Question the rule that joy must be earned','Rigid permission rules may limit rest or enjoyment even when circumstances allow it.','Notice a thought such as “I have not done enough to deserve this”.|Ask whether that rule reflects a real obligation or a harsh judgement.|If safe, allow a small enjoyable activity anyway.','Enjoyment does not erase responsibilities or hardship; preserve a realistic balance.',['act-review']),
  M('Hold gratitude and difficulty together','All-or-nothing thinking can imply a good experience invalidates suffering.','Name both the pleasant and difficult parts of the day.|Consider whether both can be accurate.|Allow the good detail to matter without denying the rest.','Never use gratitude to dismiss abuse, inequality or grief.',['savour-review'])
 ],
 dbt:[
  M('Practise a mindful pleasant moment','DBT-informed mindfulness uses noticing without immediately judging or changing the experience.','Choose a personally welcome pleasant detail.|Notice it with curiosity rather than needing a score.|Let it end naturally and return to what matters next.','Mindfulness is not enjoyable for everyone and should remain optional.',['nhs-mindfulness','savour-review']),
  M('Use a pleasant-event plan without rigid targets','Behavioural emotion skills can make beneficial activities more accessible.','Choose a small activity that fits your health, time and resources.|Make the start simple by removing one unnecessary obstacle.|Notice whether it was worthwhile, not whether it produced a specific emotion.','Do not prescribe activity as a cure for serious depression or fatigue.',['nhs-wellbeing'])
 ],
 act:[
  M('Make room for joy and sadness together','ACT-informed acceptance allows positive experience without demanding that other emotions disappear.','Notice whatever feelings coexist.|Let the pleasant part be one real part of the experience.|Choose whether and how to engage without fighting the other feelings.','No one has to savour an experience they do not want to.',['act-review']),
  M('Choose meaningful pleasure, not a productivity metric','Values help clarify what you genuinely want to appreciate.','Ask what matters about the moment: connection, curiosity, play, beauty or achievement.|Choose a small action in line with that value.|Let the reward be the experience rather than a streak.','Do not use values as pressure for constant self-improvement.',['act-review','nhs-wellbeing'])
 ],
 support:[
  M('Share appreciation consensually','Some people enjoy sharing a meaningful moment with someone they trust.','Decide if you want to share the experience.|Choose a person and form of communication that feels right.|Allow the listener to respond naturally without demanding affirmation.','Private enjoyment is equally valid; social sharing is optional.',['nhs-wellbeing']),
  M('Recognise when a mood change needs review','Positive mood is not pathology, but an abrupt marked change may sometimes need assessment.','Notice whether the experience reflects ordinary joy or a substantial change in sleep and activity.|Seek appropriate clinical input for extreme mood shifts or impairment.|Continue to value ordinary enjoyment without treating it as a symptom.','Do not self-diagnose mania from happiness, excitement or energy.',['nhs-wellbeing'])
 ]
 },['savour-review','nhs-wellbeing','nhs-mindfulness','act-review','nice-autism'])
});
