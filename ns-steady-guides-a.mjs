import {G,M} from './ns-steady-guide-utils.mjs';

/* Distinct, human-edited education and methods for the first four pathways.
 * CBT, ACT and DBT labels indicate conceptual ancestry, not delivery of a
 * complete validated protocol by the app.
 */
export const STEADY_GUIDES_A=Object.freeze({
 'steady-overwhelm':G(
 'Overwhelm: reduce the load without losing yourself',
 'A practical and psychological guide to too many demands, feelings or stimuli at once.',
 'Overwhelm is an experience of demands exceeding the resources presently available. The load may be emotional, cognitive, sensory, social, practical or physical. It is not a diagnosis, and it is not evidence that the person lacks resilience.',
 ['Too many tasks, interruptions or decisions','An intense emotional reaction with little room to think','Sensory overload or insufficient privacy','Care, work or money demands with little control','Overwhelm following illness, sleep loss or an inaccessible environment'],
 'Demand exceeds capacity → urgency and narrowed attention → more mistakes, avoidance or unhelpful effort → further demands. This is only one possible loop; sometimes the workload itself is simply unreasonable.',
 ['Lack of sleep, illness or pain','Realistic rather than imagined external demands','Neurodivergent sensory or executive-function needs','Missing support, money or flexibility','Self-imposed standards or fear of letting someone down'],
 ['Reduce one demand before doing more work','Regain enough choice to identify a workable action','Seek adjustments and support when the cause is structural'],
 ['New confusion, collapse, severe physical symptoms or inability to stay safe require appropriate assessment','If a person is overloaded by coercion or exploitation, changing their thoughts is not the first solution'],
 'Progress may mean fewer demands, a clearer next action, more recovery time or better support; it does not have to mean feeling instantly calm.',
 {
 context:[
  M('Take one demand off the stack','Excess demands often need an environmental solution, not more self-discipline.','List what is competing for attention.|Mark what has a real deadline and what can wait.|Move, decline, delegate or shorten one item.', 'Do not assume every responsibility is optional; seek practical help where control is limited.',['nhs-mindfulness','nice-autism']),
  M('Make the environment less demanding','Sensory and cognitive load can amplify stress independently of beliefs.','Identify one distracting or painful input.|Change the light, sound, interruptions, location or instructions if you can.|Recheck whether the task has become more manageable.','Never force exposure to painful sensory input as a generic exercise.',['nice-autism','nas-sensory'])
 ],
 behaviour:[
  M('Choose a genuinely smaller first action','An achievable step can reduce action paralysis without denying the size of the problem.','Name what matters for the next 10 minutes.|Find the smallest step that changes your position.|Stop and reassess capacity rather than stacking more tasks.', 'A small step cannot substitute for adequate accommodation or resources.',['nhs-wellbeing']),
  M('Make a pause a planned action','A pause can preserve executive capacity when demands are escalating.','Stop adding new tasks for a short interval.|Check food, water, rest and sensory needs.|Resume only what is necessary, or request relief.','Do not drive or perform safety-critical work while cognitively impaired.',['nhs-fatigue'])
 ],
 thinking:[
  M('Separate urgency from importance','Under high load every item may feel equally urgent; this is an appraisal to examine, not to dismiss.','Write down the demand that currently feels most urgent.|Ask what actually happens if it waits.|Sort into urgent, important and optional with the facts available.','Financial or legal deadlines may really be urgent; keep practical information central.',['nhs-mindfulness']),
  M('Revise an all-or-nothing productivity rule','Rigid standards can add a second layer of stress to an already difficult day.','Notice rules such as “everything must be finished”.|Ask what a safe and acceptable minimum would be today.|Try a kinder but realistic standard and observe the result.','Do not use this to normalise workplace exploitation or neglect essential care.',['act-review'])
 ],
 dbt:[
  M('Use a brief STOP-style pause','DBT-informed mindfulness helps create a gap between an urge and a chosen action.','Stop what can safely be stopped.|Notice your body and where attention has narrowed.|Proceed deliberately with one small next move.','This is an adapted distress-tolerance skill, not a substitute for formal DBT or crisis support.',['nice-selfharm']),
  M('Use gentle sensory self-soothing','Comfortable input may make the immediate moment more tolerable.','Find one safe, familiar sensation: texture, temperature, light or sound.|Try it briefly without needing a particular effect.|Stop if the stimulus adds overload.','Avoid extreme temperature, forced breath-holding or techniques that worsen dissociation.',['nice-autism','nas-sensory'])
 ],
 act:[
  M('Allow the feeling without obeying the urgency','ACT-informed willingness can make space for distress while you choose your response.','Notice “this is overwhelming” as an experience.|Let it be present briefly if tolerable without adding self-criticism.|Choose a realistic action based on what matters and your capacity.','Acceptance does not mean accepting unsafe conditions, abuse or impossible workloads.',['act-review']),
  M('Reconnect with one value','Values can guide choices when there are too many competing tasks.','Ask what genuinely matters in this situation.|Pick one action that honours that value within your limits.|Let other demands remain incomplete for now if safely possible.','Values work is not an instruction to sacrifice health, rest or boundaries.',['act-review'])
 ],
 support:[
  M('Ask for a specific redistribution of load','Support becomes more useful when the request names a concrete change.','Identify the specific demand or bottleneck that is hardest to manage.|Ask a colleague, partner or service for a specific change, with timing.|If no help is available, document the barrier and explore formal options.','It may be unsafe to negotiate directly in coercive or threatening relationships.',['nice-autism']),
  M('Consider medical and access needs','Overwhelm can coexist with health conditions and inaccessible systems.','Note persistent fatigue, pain, sensory difficulties or cognitive changes.|Seek a GP review or reasonable adjustments where appropriate.|Update expectations to match your actual capacities.','New severe symptoms or acute confusion need prompt assessment.',['nhs-fatigue','nice-autism'])
 ]
 },['nhs-mindfulness','nice-autism','nas-sensory','act-review','nhs-fatigue','nhs-wellbeing','nice-selfharm']),
 'steady-panic':G(
 'Panic and physical alarm: respond safely',
 'Recognise familiar panic while taking new or concerning physical symptoms seriously.',
 'A panic episode can involve a rapid surge of fear or physical alarm with sensations such as palpitations, dizziness, breathlessness and unreality. Similar symptoms can have medical causes. A panic episode is not the same thing as a diagnosis of panic disorder.',
 ['A sudden frightening surge of body sensations','Fear of a heart attack, collapse or losing control','Avoidance of places where panic previously happened','Intense vigilance for pulse, breathing or dizziness','Panic-like sensations alongside illness, medication, stimulants or sleep loss'],
 'Alarming sensation → catastrophic interpretation → more fear and monitoring → sensation feels more threatening. This model is relevant to some panic presentations, not a substitute for medical evaluation.',
 ['Physical health and medications','Caffeine, sleep and stimulant exposure','History of frightening episodes','Interpretation of bodily sensations','Avoidance and safety behaviours'],
 ['Stay physically safe and choose a tolerable response','Reduce inappropriate catastrophising only after health concerns are considered','Access effective assessment and CBT when panic is recurrent or impairing'],
 ['Call 999 for severe or acute chest pain, severe breathing difficulty, loss of consciousness or other emergencies','New or unusual physical symptoms warrant medical review, even if you also experience panic','Do not attempt unsupervised intense interoceptive exposure or extreme breathwork'],
 'Progress might mean responding with less alarm, returning gradually to valued activities with suitable support, or obtaining medical clarification—not never experiencing body sensations again.',
 {
 context:[
  M('Rule out urgent physical danger','Physical sensations are not diagnostic of anxiety.','Check whether symptoms are new, severe or substantially different.|Use appropriate NHS emergency or urgent care if indicated.|If familiar and previously assessed, choose a comfortable next response.','Do not delay emergency help to complete an app exercise.',['nice-panic','nhs-panic']),
  M('Reduce unnecessary amplifiers','Sleep loss, caffeine and overstimulating settings can increase bodily activation.','Notice whether the episode followed poor sleep, caffeine or strain.|Adjust one relevant and safely changeable factor.|Review patterns with a clinician if attacks recur.','Do not discontinue prescribed medication without medical advice.',['nhs-panic'])
 ],
 behaviour:[
  M('Choose a prepared response','Having a plan reduces having to invent one during intense alarm.','Write down how to recognise a familiar episode.|Choose one safe orientation or coping response you have previously tolerated.|List signs that mean medical assessment is necessary.','Panic preparation is not a substitute for diagnosis or clinician-delivered treatment.',['nhs-panic','nice-panic']),
  M('Return to activity carefully, when appropriate','Avoidance can maintain panic-related limitations, but change should be collaborative and safe.','Identify a valued activity that panic has narrowed.|If medically appropriate, plan a small realistic return.|Notice what actually happened without requiring perfect calm.','Interoceptive exposure or high-intensity exposure should be designed with an appropriately trained clinician when indicated.',['nice-panic'])
 ],
 thinking:[
  M('Distinguish a sensation from its prediction','CBT for panic examines the meaning assigned to physical sensations.','Name the specific sensation, such as a fast heartbeat.|Name the feared prediction separately.|Check what is known medically and whether there are other plausible explanations.','Never use cognitive reframing to dismiss new red-flag symptoms.',['nice-panic']),
  M('Notice reassurance loops','Repeated checking can sometimes briefly reduce fear while making sensations central.','Identify any pulse checks, searches or repeated reassurance.|Ask whether they add useful medical information or only brief certainty.|When clinically safe, practise following a previously agreed plan instead.','Necessary clinical monitoring or prescribed checks should not be abandoned.',['nice-panic'])
 ],
 dbt:[
  M('Anchor attention outward','An adapted distress-tolerance skill can redirect attention to the present setting.','Notice where you are and place your feet comfortably if possible.|Name a few neutral sights or sounds.|Let attention move at a natural pace without monitoring the outcome.','If external grounding worsens the experience, stop; no single method suits everyone.',['nhs-mindfulness','nice-selfharm']),
  M('Use a comfortable exhale, not forced breath control','Some people find gentle paced breathing soothing, while others find breath focus intensifies panic.','If breathing is comfortable and medically safe, let your exhale become gentle.|Avoid breath-holding, extreme slowing or attempting to control every breath.|Switch to neutral external awareness if breath attention is unpleasant.','New severe breathlessness needs clinical evaluation, not breath exercises.',['nhs-panic'])
 ],
 act:[
  M('Notice a feared thought as a thought','Defusion may reduce the need to struggle with every catastrophic prediction.','Notice “I am having the thought that something awful will happen”.|Do not demand that the thought vanish.|Return attention to what is useful and safe now.','This is an adapted ACT skill, not evidence that symptoms are medically harmless.',['act-review']),
  M('Allow familiar sensations without a battle','When medically safe, willingness can reduce the struggle to eliminate every sensation.','Identify a familiar, assessed sensation.|Make a little room for it without forcing exposure or intensity.|Act according to a safe plan and chosen values.','Do not use willingness as a reason to ignore a changed or dangerous symptom.',['act-review','nice-panic'])
 ],
 support:[
  M('Access panic-specific evidence-based care','NICE recommends CBT for clinically significant panic disorder.','Consider how often episodes occur and whether they limit life.|Discuss recurrent impairment with a GP or NHS Talking Therapies.|Ask about disorder-specific CBT and suitable assessment.','General self-help pages do not provide the full protocol of panic-focused CBT.',['nice-panic']),
  M('Create a medical safety distinction','A simple written distinction can prevent both catastrophising and inappropriate reassurance.','List familiar, previously assessed symptoms.|List new or severe symptoms requiring prompt care.|Keep relevant health information accessible to trusted people if useful.','When unsure about serious symptoms, use NHS urgent care or emergency services.',['nhs-panic','nice-panic'])
 ]
 },['nice-panic','nhs-panic','act-review','nhs-mindfulness','nice-selfharm']),
 'steady-sensory':G(
 'Sensory overload: work with your environment',
 'Low-demand changes, sensory autonomy and recovery without forced tolerance.',
 'Sensory overload happens when sound, light, touch, smell, movement, crowding or competing demands become more than a person can comfortably process. Sensory sensitivity varies across people and contexts; this experience does not by itself indicate autism or a disorder.',
 ['Noise or layered conversation becomes painful or exhausting','Visual brightness, patterns or crowds are difficult','Touch, smell or food textures cause distress','Multiple simultaneous instructions overload processing','A need to withdraw, stim, move or recover'],
 'Uncomfortable input → rising stress and difficulty processing → more effort to endure or communicate → reduced capacity for more input. The main problem may be the environment rather than the person’s thoughts.',
 ['Neurodivergent sensory differences','Migraine, pain, sleep or illness','Unpredictable environments and lack of breaks','Pressure to conceal or suppress sensory needs','Limited control of lighting, sound or touch'],
 ['Reduce painful input and respect personal sensory boundaries','Build predictable ways to recover and communicate needs','Make changes to access and surroundings rather than forcing exposure'],
 ['Avoid blanket advice to expose yourself to painful sensory triggers','Respect autonomy about touch, deep pressure and stimming','Sudden sensory change, new severe neurological symptoms or significant pain warrant medical advice'],
 'Progress can mean greater accessibility, more predictable breaks, fewer overwhelm episodes or increased choice—not becoming able to tolerate every stimulus.',
 {
 context:[
  M('Reduce one painful sensory source','Environmental modification is directly supported in NICE autism guidance.','Identify the strongest input (sound, light, smell, touch or crowding).|Reduce it, move away or use a familiar aid if possible.|Allow time without extra questions or tasks.','Do not use bright lights, exposure or touch against the person’s preferences.',['nice-autism','nas-sensory']),
  M('Design a low-demand recovery place','Recovery often requires fewer competing inputs and more predictability.','Choose a location with manageable sound, light and social expectations.|Agree whether company, distance or silence would help.|Make its use easy rather than dependent on an elaborate routine.','Not everyone wants darkness, silence or isolation; personalise the space.',['nice-autism','nas-sensory'])
 ],
 behaviour:[
  M('Build a portable sensory plan','Predictable, preferred sensory aids can support participation.','Choose two sensory supports that reliably feel comfortable.|Keep them accessible in high-demand settings.|Adjust after real-world use rather than sticking to a rigid list.','Tools such as ear protection should be chosen around safety, comfort and context.',['nas-sensory']),
  M('Protect recovery before overload peaks','A planned break can be more feasible than managing the peak of overload.','Notice early personal signs of strain.|Choose a place or activity where demands lessen.|Return only when ready or renegotiate the duration.','Do not impose fixed recovery times; the person’s capacity can fluctuate.',['nice-autism','nas-sensory'])
 ],
 thinking:[
  M('Challenge shame, not the sensory evidence','The unhelpful appraisal may be “I am weak”, not the experience of painful noise.','Separate “this sound hurts” from “I should cope like everyone else”.|Look for a fairer judgement of your needs.|Choose a reasonable adjustment if available.','Never question the reality of a person’s pain as a cognitive distortion.',['nice-autism']),
  M('Replace all-or-nothing accessibility expectations','A space need not be either perfectly comfortable or wholly unusable.','Identify the specific barrier.|Consider an adjustment, duration change or alternative format.|Keep the right to leave if it remains intolerable.','Do not pressure someone to remain in overwhelming conditions to prove flexibility.',['nice-autism'])
 ],
 dbt:[
  M('Use chosen sensory self-soothing','An adapted DBT-informed sensory skill is appropriate only when that sensory input feels safe.','Pick one familiar, welcome texture, sound or movement.|Try it for as long as useful.|Stop or switch if it adds sensory load.','Avoid prescribed cold shocks or forced body scanning for people who find them distressing.',['nas-sensory','nice-selfharm']),
  M('Use a low-language pause','When overloaded, complex verbal processing can become another demand.','Signal “I need a pause” using your preferred format.|Reduce speech and decisions if possible.|Return to discussion later when communication is easier.','This is an accessibility practice, not a universal therapeutic protocol.',['nas-sensory'])
 ],
 act:[
  M('Make room for frustration without surrendering your needs','Acceptance can concern an emotional reaction without requiring acceptance of preventable sensory harm.','Notice irritation or fatigue without blaming yourself.|Identify what matters: dignity, participation, comfort or autonomy.|Choose the adjustment that supports that value.','ACT is not a justification for withholding accommodations.',['act-review','nice-autism']),
  M('Define valued participation on your terms','Participation may require a different format or duration, not more tolerance.','Choose an activity that matters.|Design a version with fewer sensory costs.|Make participation optional and sustainable.','Avoid assigning social exposure goals that conflict with the person’s priorities.',['act-review','nice-autism'])
 ],
 support:[
  M('Make a concrete access request','Specific accommodation requests are often easier to assess and implement.','Name the setting and the input that makes it inaccessible.|Suggest a feasible change, such as lighting, seating, noise or breaks.|Document what helps and seek formal adjustments if needed.','You are not required to disclose a diagnosis to every person to justify a basic preference.',['nice-autism']),
  M('Consider additional health factors','Sensory changes can coexist with migraines, pain or other physical conditions.','Notice whether this is familiar or newly changed.|Seek GP or relevant specialist input for new or markedly impairing symptoms.|Keep practical environmental support in place.','Do not presume every sensory complaint reflects psychological intolerance.',['nice-autism'])
 ]
 },['nice-autism','nas-sensory','act-review','nice-selfharm']),
 'steady-anger':G(
 'Anger: protect your choices and address what matters',
 'An approach to anger that recognises injustice, physiological activation and safe communication.',
 'Anger can signal perceived threat, injustice, frustration, violated expectations or unmet needs. It is not automatically irrational or harmful. The important questions are what it means in this context, what action feels urgent, and what response is safe.',
 ['Feeling hot, tense, restless or ready to act','An urge to shout, send messages, argue, withdraw or retaliate','Resentment after unequal demands','Anger following real mistreatment or boundary violations','Self-directed anger and harsh self-criticism'],
 'Threat or unfairness → activation and narrowed attention → impulsive action or avoidance → conflict, regret or unchanged injustice. Real injustice may persist independently of this cycle.',
 ['Workload, discrimination or unsafe relationships','Sleep, pain, substance use and stress','Past experiences and expectations','Rules about whether anger is permitted','Problems expressing boundaries or asking for change'],
 ['Prevent harm while anger is intense','Understand whether a realistic problem requires action','Choose a safe boundary, repair or practical change rather than self-silencing'],
 ['If you may seriously hurt someone, leave the immediate situation if safe and seek urgent support','Do not recommend confronting someone who may retaliate','Anger with new severe mood changes, substance use or serious impairment may need assessment'],
 'Progress can be pausing before regretted actions, communicating more clearly, obtaining a fairer arrangement or recognising when anger reflects genuine injustice.',
 {
 context:[
  M('Step away from an escalating environment','Reducing immediate confrontation can protect everyone’s safety.','If safe, put physical distance between yourself and the conflict.|Avoid sending impulsive messages or escalating arguments.|Return only when you can make a deliberate choice.','If leaving may provoke violence or you are being threatened, prioritise an individual safety plan and help.',['nhs-anger']),
  M('Notice sleep, pain and basic strain','Physical strain can increase irritation without making the underlying issue imaginary.','Ask whether fatigue, pain, hunger or substances are relevant.|Address one safe, ordinary need if possible.|Return to the underlying issue once capacity permits.','Do not blame physical strain for another person’s abusive behaviour.',['nhs-anger','nhs-fatigue'])
 ],
 behaviour:[
  M('Create a pause-before-send rule','A chosen pause can prevent escalation without requiring anger to disappear.','Draft the reply without sending it.|Choose a time to reconsider it and a safe place to pause.|Keep facts, requests and boundaries; remove threats and insults.','If there is immediate danger, do not delay a call for help.',['nhs-anger']),
  M('Translate resentment into an actionable request','An unequal burden may require redistribution rather than private emotional regulation.','Name the concrete task or responsibility that is uneven.|State the change you want using specific terms.|Consider support or escalation if cooperation is absent.','Coercion and retaliation risk may make direct negotiation unsafe.',['nhs-anger'])
 ],
 thinking:[
  M('Separate observation, interpretation and action','CBT-informed appraisal checks may reduce avoidable misunderstandings.','Write exactly what happened.|Distinguish inferred motive from what you know.|Choose a response supported by the facts and your values.','Do not dismiss documented harm, discrimination or coercion as distorted thinking.',['nhs-anger']),
  M('Check global conclusions made in anger','Activation can make statements like “always” and “never” feel certain.','Identify the broad claim you are making.|Look for evidence for and against its scope.|Keep the specific problem intact even if the global claim is overstated.','Not every strong judgement is incorrect; do not pressure premature forgiveness.',['nhs-anger'])
 ],
 dbt:[
  M('Use a STOP-style response','DBT-inspired distress tolerance can separate an action urge from a decision.','Stop any action that can safely wait.|Observe the urge and what the body is doing.|Proceed with the choice you would endorse after the intensity changes.','If there is a threat of violence, use immediate safety support rather than relying on a coping exercise.',['nice-selfharm','nhs-anger']),
  M('Check facts and choose the effective action','DBT-informed emotion regulation considers whether an emotion fits the facts and whether acting on its urge is effective.','Describe the event and whether anger has a factual basis.|Ask what action would protect safety, fairness and long-term goals.|Choose an effective response; do not automatically do the opposite of justified anger.','Opposite action should not become silence about real mistreatment or the surrender of a boundary.',['nhs-anger'])
 ],
 act:[
  M('Defuse from the urge, not the value','ACT-informed defusion creates space between “I want to strike back” and the action taken.','Name the thought or urge without judging it.|Notice that having an urge does not require following it.|Choose behaviour consistent with safety and dignity.','Defusion is not a way of convincing someone their needs do not matter.',['act-review']),
  M('Act in line with what anger points toward','Anger can reveal values such as respect, fairness or protection.','Ask what the anger tells you is important.|Define a response that serves that value over time.|Take one safe step or seek support if you cannot act alone.','Do not turn values into pressure to reconcile or forgive.',['act-review','nhs-anger'])
 ],
 support:[
  M('Ask for support without recruiting an audience for escalation','An outside perspective may help with facts and safer choices.','Choose a trusted, non-threatening person.|Explain what happened and what support you want.|Ask for help planning a response rather than fueling retaliation.','If you are using threats or violence, professional support and accountability matter.',['nhs-anger']),
  M('Consider structured care for repeated harmful anger','Persistent aggression or serious impairment may need more than an app.','Notice patterns of harm, intimidation or conflict.|Discuss them with a GP or appropriate qualified service.|Seek emergency support if there is imminent risk.','Do not use a private anger worksheet in place of safeguarding for someone at risk.',['nhs-anger'])
 ]
 },['nhs-anger','nice-selfharm','act-review','nhs-fatigue'])
});
