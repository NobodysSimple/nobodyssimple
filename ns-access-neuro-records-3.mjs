/* Specific neurodivergent experiences: overload recovery, action and sensitivity. */
const part=s=>s.split('|').map(x=>x.trim());
const P=(name,detail,insight,questions,scenes,actions,support)=>[name,detail,insight,part(questions),part(scenes),part(actions),part(support)];
export const ACCESS_NEURO_3=[
[
'sensory-recovery',
'The difficult part may not be surviving the noisy room. It may be the hours afterward when conversation feels harder and a question about dinner is suddenly too much. Recovery deserves to be planned as carefully as participation.',
'Why overstimulation can continue after the event has ended',
[
'Sensory overload can happen when input exceeds what a person can comfortably process. The exact threshold varies; some people find sudden noises difficult while others struggle with continuous background sound. A person may enjoy a busy environment one day and need to leave earlier another day because their available capacity has changed.',
'The cost does not always end when the input stops. Someone might travel home from a shopping trip and feel unable to manage another decision. The return journey itself may involve further sensory input. Recovery therefore involves both leaving the setting and reducing the demands that follow it.',
'Other people may assume you are fine because you stayed until the end. You might have used considerable effort to remain outwardly composed. Explaining the delayed impact can be difficult when the people around you judge only what they observed. A shared plan for quieter time afterward can make support more dependable.',
'Recovery is not identical to isolation. One person may want silence, another a familiar soundtrack or gentle movement. The relevant question is what reduces distress without creating a new safety problem. Trying to force a universal calming technique can introduce yet another unwanted sensation.',
'If sensory sensitivity changes abruptly or is associated with new hearing problems or severe dizziness, medical assessment matters. Chronic pain and migraine may also alter sensory tolerance. The aim is to take the physical experience seriously rather than attributing all discomfort to temperament or attitude.',
'An accessible day can include recovery periods without treating them as a punishment. A short visit may allow more enjoyment than staying until you cannot function. You can make decisions according to the real cost of activities, and services can take responsibility for preventable noise or lighting.'
],
[
P('Delayed exhaustion',
'You may keep participating during a busy activity and only feel the full impact once you are home. Your need for quiet can appear sudden to others who did not see the effort involved.',
'Delayed depletion can follow cumulative sensory and social demands even after the original stimulus ends.',
'When does the delayed cost arrive?|Which activities seem to precede it?|What demands remain once you get home?|What kind of recovery actually helps?',
'I could not talk after a noisy gathering|I needed to lie down after shopping|I cancelled an evening plan after a busy day|I became irritable once I reached home',
'Leave uncommitted time after an intense event.|Plan a low-demand meal before a predictable busy day.|Notice the first signs of accumulating strain.|Avoid scheduling two high-input activities back-to-back.|Choose a recovery activity based on actual comfort.',
'Tell housemates you need quiet after particular outings.|Ask someone to handle an urgent errand after a demanding day.|Arrange a shorter event attendance window.|Discuss recurring exhaustion with a clinician.|Request flexible hours following predictable high-input duties.'
),
P('The journey home',
'Even after leaving a crowded event, public transport or traffic can continue the sensory demands. You may reach the point of safety much later than other people assume.',
'Access to quieter transport or transitional space can change whether recovery begins promptly.',
'Which part of the journey adds strain?|Is there a quieter route or time?|What safety needs apply to hearing protection?|Can someone assist with the journey?',
'A train announcement startled me on the way home|A busy bus prolonged my overload|I struggled to navigate a bright station|I needed quiet before continuing my journey',
'Identify a lower-input route when possible.|Carry preferred ear protection while remaining aware of safety signals.|Leave enough time to avoid a rushed transfer.|Use a familiar waiting place between journeys.|Arrange familiar directions or accessible travel assistance before overload makes navigation difficult.',
'Request accessible travel assistance where available.|Ask an event host about a quiet exit route.|Arrange a pickup for an especially demanding appointment.|Tell a companion what support helps on the journey.|Seek travel adjustments for regular work or study commitments.'
),
P('Finding the right input',
'Quiet is not restorative for everyone. Some people find steady predictable sound or pressure more helpful than silence. You can choose what supports regulation without assuming that a popular technique will suit you.',
'Sensory regulation is individual and may depend on the intensity and predictability of the input.',
'What sensations feel restorative?|Which inputs seem calming only at first?|Are your chosen tools physically safe?|How will you know when you have recovered enough?',
'I wanted familiar music instead of silence|A heavy blanket felt uncomfortable that day|I found gentle movement helped me reset|I needed to change into softer clothes',
'Choose a familiar form of input that you enjoy.|Reduce one unpleasant sensation before adding another.|Avoid painfully loud sound or unsafe pressure.|Keep recovery tools somewhere easy to find.|Stop a technique that adds discomfort.',
'Ask an occupational therapist about practical sensory regulation.|Request adjustable lighting in a recovery area.|Tell people whether you want company or quiet.|Arrange access to comfortable clothing after work.|Ask a clinician about new or severe sensory symptoms.'
),
P('Preventing repeated overload',
'You may have started treating every appointment as something to endure until you can collapse afterward. Preventing the most avoidable input can preserve capacity for activities that matter to you.',
'Environmental changes and realistic boundaries are often more effective than greater tolerance demands.',
'Which input could be removed before the event?|How long can you comfortably stay?|What is the cost of another hour?|Who can make the setting accessible?',
'I stayed at a party longer than I could manage|A workplace refused a noise adjustment|I kept forgetting to take breaks|I dreaded another crowded appointment',
'Set an approximate departure plan for demanding events.|Ask about a quiet room before arriving.|Take breaks before reaching severe discomfort.|Choose smaller gatherings when they meet your needs.|Review which adjustments actually lowered the burden.',
'Ask organisers about noise or lighting conditions in advance.|Request permission to step outside without penalty.|Discuss environmental adjustments at work.|Seek a shorter appointment slot if appropriate.|Find a supportive advocate when access requests are dismissed.'
)
],
'New sensory changes, hearing loss, severe headaches or balance symptoms require appropriate healthcare assessment. Protect hearing and physical safety when using sensory tools. Overload should not be treated by forcing painful exposure.',
['autism','access']
],
[
'executive-dysfunction',
'You can care deeply about a task and still be unable to organise the actions needed to complete it. Other people may see the unfinished result and miss the planning and decision-making that happened before you even began.',
'When the task is possible but organising it is not',
[
'Executive functions help coordinate goals, working memory, inhibition and flexible action. These abilities can be affected by ADHD and other neurodevelopmental conditions, but also by sleep loss or illness. Describing a task as executive dysfunction is a starting point for understanding it, not a diagnosis of its cause.',
'An ordinary responsibility may contain several hidden decisions. Making dinner means deciding what to cook and checking which ingredients are available. You can become stuck at the choosing stage while the practical task remains untouched. Reducing the decisions can be more useful than motivating yourself to work harder.',
'Starting is one problem; holding the sequence in mind is another. A person might begin tidying a room and discover an unrelated object that leads them elsewhere. Returning to the original task can become difficult because the next step is no longer visible. External structure reduces reliance on remembering the whole plan.',
'Some tasks are difficult because they involve stopping something else. A person absorbed in work may fail to eat despite feeling hungry later. Others struggle to shift into an activity they want to do. Time cues and planned transitions can support change, although these should fit the person’s actual routines.',
'Shame can develop when daily difficulties are described as laziness. That history may lead you to conceal the amount of help you need. An accommodation such as written instructions can protect independence. It should not be confused with a lack of ability or commitment.',
'Review what happened during a specific task before choosing a strategy. You may need an easier entry point or a more predictable environment. If executive difficulties have appeared suddenly or worsened markedly, an appropriate clinical assessment can investigate contributing conditions.'
],
[
P('Not being able to begin',
'You know what needs doing yet the first movement toward it feels inaccessible. The difficulty can increase when the task is described vaguely or contains several decisions.',
'An unclear action threshold can stop a task before the person has an opportunity to engage.',
'What would the first observable action be?|Which choice is keeping you from it?|Does the task need less preparation?|What would help you cross the starting point?',
'I stared at a form without opening it|I wanted to shower but stayed seated|I delayed a phone call I needed to make|I could not choose which chore to begin',
'Define a single action that starts the task.|Keep essential materials in reach before you need them.|Use a reminder at the moment action is possible.|Choose the first task before a busy period begins.|Try a short supported start with another person present.',
'Ask someone to help clarify the first step without taking over.|Request a simpler version of an official form.|Discuss task initiation barriers in clinical or educational support.|Find a practical body-doubling arrangement.|Ask for deadlines that separate preparation from completion.'
),
P('Losing the sequence',
'You begin a job then lose track of where you were, particularly after interruption. That can create unfinished piles even when you have been busy all day.',
'Keeping an external record of the next action can reduce the burden on working memory.',
'Where do you usually lose your place?|What interruptions are predictable?|Could the task be made visible?|How would you know it was complete?',
'I moved between three unfinished chores|I forgot the next step while cooking|A notification interrupted a work task|I started sorting papers and never finished',
'Write the next step before switching activities.|Use a short visible checklist for repeating tasks.|Keep one workspace for the current activity.|Finish a small self-contained portion before adding another.|Pause notifications during tasks that require a sequence.',
'Ask for instructions in a stable written format.|Request predictable uninterrupted time for complex duties.|Discuss accessible project management tools with a supervisor.|Get help organising a recurring household process.|Ask a clinician about severe working-memory difficulties.'
),
P('Time and priorities',
'A task can consume an afternoon because it is engaging, while an urgent obligation waits. Difficulty estimating time may leave you rushing or apologising repeatedly.',
'Time awareness and prioritisation are affected by context, interest and task design.',
'Which activity absorbs more time than expected?|What deadline was missed?|Which clock or cue is available?|How could priorities be made explicit?',
'I lost an afternoon in one activity|I forgot when I needed to leave home|I treated every email as equally urgent|I worked on the enjoyable part while the deadline passed',
'Put the next appointment in a visible calendar.|Choose a priority using consequence rather than interest alone.|Set a transition warning before leaving an activity.|Make a rough time budget for one recurring task.|Review whether a reminder arrives early enough to act.',
'Ask a supervisor to identify the highest-priority deliverable.|Use agreed check-ins for long projects.|Request clear dates rather than vague urgency.|Ask someone to help estimate travel and preparation time.|Seek coaching or occupational support for persistent planning difficulties.'
),
P('Tasks under heavy load',
'Your organisation may worsen when you are ill or already overwhelmed. A system that works in quiet conditions may fail when several people ask for something at once.',
'Capacity and environmental load influence whether executive supports remain usable.',
'Which conditions make planning harder?|What task could be removed or shared?|Are basic needs being missed?|What change would create a workable margin?',
'I forgot to eat during a stressful shift|I could not organise medication refills|Several requests arrived together and I froze|My routine stopped working during illness',
'Lower optional demands when capacity drops.|Put essential health tasks in a dependable reminder system.|Prepare an accessible backup for high-demand days.|Ask for help before a missed essential deadline.|Reduce multitasking when decisions have serious consequences.',
'Request practical support with essential appointments.|Discuss disability adjustments for high-load tasks.|Ask someone to share routine household administration.|Seek medical review if function declines suddenly.|Arrange a support person for important paperwork when wanted.'
)
],
'If planning and memory abilities change suddenly or alongside acute neurological symptoms, seek medical assessment. Executive difficulties may have several causes; avoid assuming an ADHD diagnosis or recommending a single productivity method as treatment.',
['adhd','access']
],
[
'task-transitions',
'Finishing one activity and beginning the next can feel harder than either activity by itself. You might know exactly what is expected and still need time before your attention and body catch up with the change.',
'Why switching activities can cost more than either task',
[
'A transition involves stopping one pattern of attention and constructing another. For some neurodivergent people, that shift requires deliberate effort, especially after deep focus or sensory strain. The difficulty does not always mean disliking the next task. You may want to leave and still feel unable to move.',
'Sudden changes can remove the preparation that makes switching possible. A meeting might end without warning and another begin immediately. The person is expected to change environment and social role instantly. Building a short gap can preserve functioning without requiring anyone to excuse missed responsibilities.',
'Leaving a pleasurable activity may be particularly hard because the current task holds attention strongly. You might resent an interruption even though you agree that something else matters. A warning or planned stopping point can support the move without making the enjoyment itself a problem.',
'Other transitions are difficult because the next task has unclear expectations. Arriving at work means deciding what to do first. A written sequence can reduce the number of decisions made during the switch. The same person may need no such support in a predictable setting.',
'Transitions can also be physical. Moving from bed to showering or leaving the house may involve changes in temperature and sensory input. Support should consider those actual conditions rather than treating hesitation as a motivational problem.',
'You can practise transitions in a way that respects your preferences. That might mean completing a natural stopping point before switching or making the first step of the next activity visible. The aim is to reduce friction and preserve choice, not to impose a perfect schedule.'
],
[
P('Leaving deep focus',
'You become absorbed in an activity and experience a jolt when asked to stop abruptly. The next responsibility may be important, but your attention is still organised around what you were doing.',
'Advance cues and deliberate stopping points can reduce a sudden change in attentional set.',
'What makes stopping particularly hard?|How much warning is useful?|Is there a natural stopping point?|What first step comes next?',
'I missed a meal while working on a project|I felt distressed when interrupted mid-task|I kept saying I would stop in a minute|I struggled to close a favourite game',
'Set a visible stopping point before beginning.|Use a transition warning that you can see or feel.|Write down where to resume the current activity.|Leave a brief buffer before the next commitment.|Prepare the first materials for the next task.',
'Ask others to give advance notice before interrupting where feasible.|Agree on realistic stopping times for shared activities.|Request predictable work blocks for concentrated tasks.|Find support designing timers that do not startle.|Discuss transition difficulty during ADHD or autism support.'
),
P('Unexpected schedule changes',
'A new plan can arrive before you have processed why the old one changed. You may need information and a little time rather than repeated reassurance that the change is small.',
'Predictability and clear information reduce the mental work required to update a plan.',
'What changed without warning?|Which details were missing?|What could be communicated earlier?|What would help you reorient safely?',
'A class timetable changed at short notice|A cancelled appointment disrupted my day|My manager suddenly changed my work task|I was sent to a different location without explanation',
'Check the new time and location in writing.|Choose one next action rather than rebuilding the whole day.|Leave a short pause to reorient.|Keep a simple backup plan for recurring disruptions.|Ask for the reason and scope of the change when useful.',
'Request written notice of avoidable timetable changes.|Ask for predictable shift patterns where available.|Arrange a named contact for updated instructions.|Seek transition time in reasonable adjustments.|Ask an organiser how last-minute changes are communicated.'
),
P('Switching into daily routines',
'You may want to wash or leave home and still remain in the previous activity. The first movement can be more demanding than the actions that follow it.',
'Reducing the number of choices at the boundary can make ordinary routines more accessible.',
'Which transition stalls most days?|Is the next step clear?|Are sensory conditions part of the difficulty?|What prompt supports movement without pressure?',
'I stayed in bed despite wanting breakfast|I could not leave the house on time|I put off showering after waking|I delayed cooking after finishing work',
'Set out the first item needed for the next activity.|Use a familiar cue to mark the transition.|Choose clothing or equipment before a busy morning.|Allow enough time for the change in environment.|Avoid piling several new instructions onto the first step.',
'Ask a support person to offer one agreed prompt rather than repeated commands.|Request flexible start times if feasible.|Discuss sensory barriers around daily routines.|Seek occupational therapy for persistent functional difficulties.|Ask household members to reduce interruptions during transitions.'
),
P('Conflict with other people',
'People may interpret delayed switching as refusal or lack of respect. You may then rush and become more overwhelmed, particularly when someone repeatedly demands immediate compliance.',
'Explicit negotiation about timing is more informative than assigning motives to a delay.',
'Who is affected by the delay?|What does the other person assume?|Which deadlines are genuinely fixed?|How could a clearer agreement help both people?',
'A friend said I was ignoring their request|A parent repeatedly told me to hurry|My partner grew frustrated when I could not leave|I was criticised for needing time after a meeting',
'Explain the transition you need without promising an instant change.|Agree on a realistic departure time in advance.|Choose a gentle prompt that does not escalate stress.|Acknowledge another person’s practical deadline.|Review what worked after a difficult handover.',
'Ask a trusted person which timing constraint matters to them.|Make written agreements for repeated shared routines.|Request colleagues avoid unnecessary urgent task-switching.|Seek mediation if repeated conflict makes daily life unsafe.|Discuss alternative ways to coordinate tasks with family.'
)
],
'If a new inability to initiate movement or sudden cognitive change appears with weakness, confusion or other acute symptoms, seek medical assessment. Transitions should be adapted rather than met with coercion or physical forcing.',
['autism','adhd','access']
],
[
'demand-related-distress',
'You may want to complete something until another person tells you that you must. The resulting distress can feel confusing, especially when you care about the outcome and know the demand is reasonable in principle.',
'When a demand changes how possible an activity feels',
[
'Demand-related distress describes a pattern in which requests or expectations evoke strong resistance or threat. Some people use the term pathological demand avoidance, or PDA, but its diagnostic status and boundaries are debated. It is better to explore the actual experience than conclude a single profile from one behaviour.',
'A request may threaten choice when it arrives without negotiation. A person might manage to begin a task independently but freeze when somebody repeatedly instructs them to do it. More commands may then increase distress, even if the original task was manageable.',
'Demands can also be difficult because the activity is uncertain or inaccessible. You might be asked to make a phone call without knowing what will be said. Avoiding it may be partly about autonomy and partly about sensory or communication difficulties. Those reasons lead to different practical solutions.',
'Some responsibilities cannot simply disappear. Healthcare appointments and caring duties may be necessary. The task is to support informed choice and find a tolerable route, rather than allowing other people to impose pressure until the person gives in.',
'Interpersonal history matters. A person who has repeatedly been punished or controlled may react strongly to authoritative instructions. That experience should be taken seriously without assuming every demand response comes from trauma or any one neurodevelopmental condition.',
'Experimenting with language or timing can be useful when both parties remain free to decline. The aim is to reduce unnecessary threat while preserving important needs. If avoidance is severe or unsafe, a careful assessment can consider coexisting anxiety and other contributors.'
],
[
P('Losing choice after a request',
'An activity may feel possible when it is your decision and intolerable after somebody turns it into an obligation. Being ordered repeatedly can narrow the room you need to act.',
'Perceived loss of autonomy can increase distress and make a request harder to approach.',
'Which wording changed the experience?|What choice remained available?|What happened after repeated prompting?|Could the request be negotiated differently?',
'I planned to clean until someone ordered me to|I froze when asked to do a simple chore|Repeated reminders made me more distressed|I resisted a task I had wanted to start',
'Identify a part of the task you can choose.|Ask for the purpose and deadline rather than repeated commands.|Try a neutral reminder you control.|Agree on a realistic start window in advance.|Separate a genuinely urgent need from an optional preference.',
'Ask family to stop escalating requests through repeated pressure.|Discuss collaborative task agreements with a support worker.|Request clearer choice within workplace expectations.|Find professional support if demand distress disrupts essentials.|Ask trusted people what outcome is needed rather than how you must do it.'
),
P('Unclear or overwhelming requests',
'A demand may contain hidden steps or social uncertainty. Refusal sometimes protects against an encounter you cannot confidently predict rather than the activity itself.',
'Reducing uncertainty can improve access without making assumptions about motivation.',
'Which part of the request is unclear?|Are sensory or social barriers involved?|What would a preview change?|What smaller action is possible?',
'I avoided calling an unfamiliar service|A vague assignment made me shut down|I refused to attend an unexplained appointment|I could not begin a multi-step request',
'Ask for the specific outcome expected.|Request written instructions for a complex task.|Preview an unfamiliar location before attending when feasible.|Break the task into steps with clear choices.|Identify any sensory adjustment needed.',
'Ask a service to explain the appointment process.|Request an accessible communication method instead of phone-only contact.|Seek an advocate for difficult official interactions.|Ask a teacher to clarify assessment requirements.|Discuss anxiety or uncertainty with an affirming clinician.'
),
P('Necessary obligations',
'Some tasks involve medication, finances or safety and cannot be ignored indefinitely. You may need more control over how they happen and a person who understands why pressure makes them harder.',
'Collaborative problem-solving can support essential action while respecting bodily autonomy and real consequences.',
'Which obligation has a genuine deadline?|What happens if it is delayed?|Can you choose the method?|Who could help without coercion?',
'I postponed an essential health appointment|I struggled to respond to a benefits deadline|I felt pressured to take medication without explanation|I avoided an urgent household task',
'Identify the actual deadline and consequence.|Choose between safe methods of completing the task.|Prepare questions before agreeing to treatment.|Use a short supported start for essential paperwork.|Seek urgent assistance when avoiding care creates immediate danger.',
'Ask a clinician to explain treatment choices and consent.|Find help completing essential applications.|Request flexible appointment arrangements.|Discuss medication concerns with the prescriber before stopping treatment.|Arrange a trusted advocate for high-stakes decisions.'
),
P('Misunderstood intentions',
'When others call you oppositional, they may stop asking what makes the request difficult. You can struggle with real obligations and still deserve respectful communication.',
'Labelling resistance without investigating context can worsen conflict and conceal an access problem.',
'What did the other person assume?|How did their response affect the task?|What information would clarify your difficulty?|What agreement could protect both people?',
'A teacher called me defiant|My family described me as manipulative|A manager said I simply lacked discipline|I could not explain why a request upset me',
'Describe the difficulty without adopting a character label.|Keep examples of requests that worked better.|Choose a calmer time to discuss a repeated conflict.|Avoid debating your motives during acute distress.|Identify an adjustment that addresses the actual barrier.',
'Ask educators to consider access and context before disciplinary responses.|Seek an assessment when demand distress severely affects functioning.|Request collaborative planning rather than threats.|Find support for coercive or unsafe relationships.|Ask someone who understands your communication style to help explain your needs.'
)
],
'PDA is not a universally recognised stand-alone diagnosis; avoid self-diagnosing from demand avoidance alone. Coercion or punishment is not an appropriate substitute for support. Immediate safety, essential care and informed consent remain important.',
['autism','access']
],
[
'rejection-sensitivity',
'An unanswered message can hurt more than you expect, particularly if past criticism taught you to anticipate rejection. The feeling deserves attention; so does the possibility that something in the relationship genuinely needs to change.',
'When possible rejection feels immediate and personal',
[
'People use rejection sensitivity to describe strong distress following criticism or perceived exclusion. Some call it rejection sensitive dysphoria, or RSD, but this is not a formal stand-alone diagnosis. It can coexist with ADHD, anxiety and painful relational experiences, and no single explanation fits everyone.',
'An ambiguous interaction can become a source of repeated checking. Perhaps a colleague replies briefly and you begin reviewing every previous conversation. That analysis can seem like protection against future humiliation. It may also keep you focused on an interpretation that nobody has confirmed.',
'Actual rejection deserves its own response. Someone may have explicitly excluded you or made a cruel remark. In that situation, asking you to reinterpret the event positively would ignore what happened. A boundary or supportive relationship may be more useful than another exercise in questioning your perceptions.',
'After criticism, a person may become self-critical or seek reassurance repeatedly. Relief can be brief if a new silence renews the doubt. Naming the cycle can help you choose whether more information is actually needed or whether you are trying to secure a guarantee about someone’s feelings.',
'The strongest responses may be connected to a particular relationship. A person who has experienced inconsistent affection may feel unusually frightened when a trusted person becomes distant. That history can be relevant without proving that every response is learned or irrational.',
'A practical next step depends on the facts. Clarify a real misunderstanding when appropriate. Reduce repeated message-checking when it adds no information. If exclusion or hostility is occurring, consider protection and support. You can care about connection without treating every silence as a verdict on your worth.'
],
[
P('Ambiguous social signals',
'A neutral or brief reply can acquire a threatening meaning when you do not know what the other person intended. You may spend hours searching for an answer in small details.',
'Uncertainty about social meaning may provoke rumination without establishing that rejection occurred.',
'What did the person actually do?|Which part is your interpretation?|Would one clarification provide new information?|When does review stop helping?',
'A friend replied with only one word|Someone looked away while I spoke|My message stayed unread for hours|A colleague sounded unusually formal',
'Write down the observable event without guessing intention.|Wait for relevant information before concluding the relationship has changed.|Limit rereading messages when nothing new has happened.|Choose one clarification question if the issue matters.|Return to an activity rather than monitoring for a reply continuously.',
'Ask a trusted person for perspective without seeking a guarantee.|Discuss preferred communication patterns with close friends.|Seek support for distressing rumination when it affects daily life.|Ask colleagues to give specific feedback rather than ambiguous hints.|Consider therapy that addresses intolerance of uncertainty if relevant.'
),
P('Explicit criticism or exclusion',
'Someone may have said something hurtful or repeatedly left you out. The problem is partly their behaviour, and it deserves a response based on what occurred.',
'Documented exclusion should not be treated as an imagined threat merely because the person feels it intensely.',
'What was actually said?|Was it repeated?|What boundary would protect you?|Who has power to change the behaviour?',
'I was deliberately excluded from a group|A manager criticised me in front of others|A friend made a cruel remark|Someone repeatedly ignored a reasonable request',
'Name the behaviour rather than attacking your own character.|Decide whether a conversation is safe and worthwhile.|Keep records of repeated workplace mistreatment.|Reduce contact where harassment continues.|Use the formal review process when an institution is responsible.',
'Ask for feedback that describes specific work and expectations.|Seek an ally after repeated exclusion.|Request mediation only if both people can participate safely.|Ask about anti-bullying procedures in a group.|Discuss the emotional impact of actual rejection with a trusted person.'
),
P('Reassurance and reviewing',
'After a difficult moment, you might ask several people whether you did something wrong. Each answer briefly settles the fear, then another doubt appears.',
'Repeated reassurance may temporarily reduce distress while leaving the underlying need for certainty unchanged.',
'What reassurance do you ask for?|How long does it help?|What information is genuinely missing?|What could you do instead of asking again?',
'I reread a conversation all evening|I asked my partner repeatedly if they were upset|I apologised again without new information|I kept checking whether friends were online',
'Notice the urge to check before acting on it.|Ask once for clarification when truly needed.|Delay a second reassurance request when nothing new occurred.|Stop reconstructing every detail after a conversation.|Choose a meaningful activity while uncertainty remains.',
'Agree on respectful reassurance boundaries with a partner.|Seek CBT-informed help if checking dominates daily life.|Ask a therapist about repetitive mental reviewing.|Talk with a friend about what support is useful beyond guarantees.|Request explicit feedback rather than interpreting silence.'
),
P('Shame after mistakes',
'One error can feel like confirmation that you are difficult to love or work with. The intensity may come from earlier criticism, and the present task is to respond to the specific mistake fairly.',
'Global self-judgement can amplify a bounded event and undermine constructive repair.',
'What mistake happened?|What consequence actually followed?|What would repair require?|Does this event justify a judgement on your whole identity?',
'I felt devastated after a small mistake|I avoided a colleague after feedback|I apologised for an error repeatedly|I believed one disagreement ended a friendship',
'Describe the mistake in specific words.|Repair an actual consequence without making endless apologies.|Notice when self-insults replace useful reflection.|Keep criticism tied to the task rather than identity.|Allow time for distress to reduce before making major decisions.',
'Ask a supervisor for one actionable improvement.|Seek support for persistent shame linked to past bullying.|Talk with a friend about responding to conflict without catastrophising.|Consider psychological therapy when distress is severe.|Request clear expectations in relationships where ambiguity recurs.'
)
],
'If distress leads to self-harm thoughts or immediate danger, seek urgent support. Rejection sensitivity and RSD are descriptive terms, not standalone diagnoses. Actual bullying or coercion must be addressed as harm rather than presumed to be an interpretation error.',
['adhd','access']
]
];
