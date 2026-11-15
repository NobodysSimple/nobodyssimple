/* Variable functioning, acquired disability, and mobility and sensory access. */
const part=s=>s.split('|').map(x=>x.trim());
const P=(name,detail,insight,questions,scenes,actions,support)=>[name,detail,insight,part(questions),part(scenes),part(actions),part(support)];
export const ACCESS_DISABILITY_2=[
[
'fluctuating-disability',
'People may make plans around the version of you they last saw. When your capacity changes, you can end up explaining the same limitation again as though the earlier explanation has expired.',
'When being able to do something once does not mean always',
[
'Fluctuating disability means that capacity or symptoms vary over time. Someone may walk comfortably on one day and need mobility support on another. The pattern can be influenced by illness, exertion or treatment, and it may not be fully predictable. A single snapshot cannot determine what the person will manage tomorrow.',
'Variation can make scheduling difficult. You may agree to attend something on a better day and find that symptoms are worse when the date arrives. If cancellation is always treated as disinterest, relationships can become another source of pressure. Flexible plans help preserve connection without promising a level of energy you cannot control.',
'Some people begin overdoing activity whenever they feel better. The temptation is understandable when tasks have accumulated. Yet certain conditions involve delayed deterioration after exertion. Advice should not prescribe gradually increasing activity without considering that risk. Support needs to follow the specific health condition.',
'Accessibility arrangements are often designed as permanent fixed accommodations. A person who needs help intermittently may face disbelief because the adjustment is not used every day. A flexible policy can respond to present need without requiring repeated proof.',
'You may feel uncertain how to describe your own abilities. “I can walk” may be true in one context and misleading in another. More precise descriptions focus on distance, duration and what happens afterward. This is not exaggeration; it helps others understand the real task demands.',
'The aim is a life that remains usable across different levels of capacity. Contingency plans and supportive relationships can make participation possible without demanding that your health become predictable. A change in symptoms still deserves appropriate medical review.'
],
[
P('Different abilities on different days',
'One day you can manage an activity and the next day you cannot. Other people may assume the variation is a matter of effort instead of recognising a fluctuating condition.',
'Capacity is time- and context-dependent; yesterday’s performance cannot set a permanent requirement.',
'What changed between the days?|Was there delayed worsening?|What support would fit today?|How can the plan remain flexible?',
'I walked without help yesterday but needed a chair today|I could work in the morning but not the afternoon|A flare prevented a planned outing|A relative questioned why I needed rest',
'Describe the task in terms of distance or duration.|Use appropriate aids when needed rather than proving consistency.|Keep a simple plan for lower-capacity days.|Avoid promising capacity that may not be available.|Notice patterns without turning tracking into a daily examination.',
'Ask friends to accept changes in plans.|Request flexible adjustments at work.|Discuss symptom fluctuation with a clinician.|Seek support for equipment usable as needed.|Ask organisations not to require daily re-justification of access.'
),
P('Overdoing it on better days',
'After a difficult period you may rush to complete every postponed task. The consequences can appear later, making the cause of a worsening hard to recognise.',
'Some conditions involve post-exertional symptom worsening; activity advice must reflect the actual pattern.',
'What happened on the better day?|When did symptoms worsen?|Was the demand essential?|What approach would respect your limits?',
'I completed chores and crashed the next day|I felt pressured to exercise through fatigue|A social event led to several days of symptoms|I ignored early signs of overload',
'Spread essential tasks rather than completing all at once.|Avoid fixed activity increases if post-exertional malaise is present.|Protect recovery time after necessary demands.|Choose activities based on current capacity and clinical advice.|Record significant delayed changes for a medical review.',
'Ask a specialist about energy management suited to the condition.|Request help with postponed household tasks.|Discuss flexible deadlines for work or study.|Seek appropriate clinical review for delayed symptom worsening.|Ask loved ones not to equate a better day with full recovery.'
),
P('Unpredictable plans',
'You may hesitate to accept invitations because you cannot guarantee how you will feel. The alternative need not be withdrawing from relationships entirely.',
'Plans can offer participation without treating uncertainty as broken promises.',
'Which invitation matters to you?|What could be changed close to the date?|What is the cost of cancelling?|Could there be a simpler alternative?',
'I cancelled dinner on the day|I avoided booking tickets months ahead|A friend was upset by a late change|I attended a shorter version of a gathering',
'Choose flexible reservations when available.|Agree on an accessible shorter version of an activity.|Tell people when health uncertainty affects confirmation.|Keep a low-demand alternative for social contact.|Avoid making an apology longer than the practical explanation.',
'Ask friends to offer plans with flexible timing.|Request refundable access arrangements where possible.|Seek support arranging transport when capacity changes.|Ask organisers whether remote attendance is possible.|Discuss relationship strain with a willing partner.'
),
P('Being disbelieved',
'You may face suspicion whenever you use a support one day and not the next. That scrutiny can make you more likely to exceed your limits to avoid embarrassment.',
'Disbelief reflects other people’s assumptions and can create additional access barriers.',
'What assumption was made?|What evidence is genuinely required?|What access is being denied?|What remedy is realistic?',
'Someone challenged my use of a priority seat|An employer doubted intermittent sick leave|I was asked to prove a flare|I hid my mobility aid on a better day',
'Explain fluctuating function only when you choose.|Keep any required documentation secure.|Avoid overexerting to impress a sceptic.|Report repeated official access barriers.|Choose the adjustment that fits your current need.',
'Request a flexible occupational health plan.|Seek an independent accessibility advocate.|Ask a service to recognise fluctuating conditions.|Discuss repeated disbelief with trusted people.|Get advice about discrimination when needed.'
)
],
'Fluctuating symptoms should be medically reviewed when new or significantly worse. Post-exertional malaise needs individual energy management, not compulsory graded exercise. Avoid driving or safety-critical work when capacity is impaired.',
['fatigue','access']
],
[
'acquired-disability',
'A change in health or mobility can make ordinary routines unfamiliar. You may be learning how to do things differently while everyone around you expects you to know what you need already.',
'Adjusting when your body or abilities have changed',
[
'Acquired disability can follow illness or injury and change everyday participation. A person may need new equipment or a different way to communicate. The adjustment often happens alongside medical appointments and uncertainty about the future, leaving little energy for the practical rebuilding that follows.',
'Loss can be very specific. You may miss driving yourself to see a friend or preparing a meal without help. These activities once carried a sense of independence. It is reasonable to grieve the change, even when rehabilitation is possible or treatment is progressing.',
'Rehabilitation should focus on the person’s goals and actual circumstances. A plan to practise one skill may be useful, but it cannot remove an inaccessible staircase or a shortage of home support. Environmental adaptations are part of recovery and participation.',
'People around you may struggle to understand what you want. Some offer to do everything, while others assume you should try harder to become independent. Support should be negotiated with you. Accepting assistance with a task does not automatically mean surrendering decisions about your life.',
'Identity may change more slowly than practical function. You may still think of yourself in the role you held before the illness while needing a different routine today. There is no requirement to embrace a new identity immediately or to tell an inspiring story about adversity.',
'Adaptation can involve learning methods or equipment that preserve activities you care about. The next step may be modest: accessible transport to a friend or a safer way to use your kitchen. The right goal is one you choose, with relevant clinical guidance.'
],
[
P('Grief about lost function',
'You may miss a familiar ability and feel surrounded by people urging optimism. The loss is real even when you remain hopeful about the future.',
'Acquired changes can involve grief about ordinary activities and future plans.',
'What activity do you miss most?|Which part was personally meaningful?|What adaptation might preserve part of it?|Who can hear the loss without dismissing it?',
'I cried when I could no longer drive|I missed my old job routine|I felt sad needing help to dress|I grieved a hobby after an injury',
'Name the specific loss without judging the feeling.|Keep meaningful memories of the activity.|Explore an adapted version only if you want one.|Give yourself time before making permanent identity claims.|Allow practical help alongside grief.',
'Seek rehabilitation advice on returning to valued activities.|Talk with someone who can acknowledge the loss.|Consider counselling when grief disrupts daily life.|Find a peer with a similar acquired condition.|Ask for information about realistic adaptation options.'
),
P('Learning new ways of doing things',
'A formerly automatic task may now require equipment or deliberate planning. You may be frustrated at needing instruction for something you already know in another form.',
'Skills and environments can be adapted, and progress should be judged against individual goals.',
'What task matters now?|Which step is no longer accessible?|What aid or method is available?|How would success look on your terms?',
'I struggled to use the kitchen after an injury|I needed a new way to use my computer|I could no longer navigate a familiar staircase|I practised a transfer with a therapist',
'Choose one meaningful activity to adapt.|Ask for demonstrations at a manageable pace.|Test equipment in your actual environment.|Break a complex task into safer stages.|Stop a practice that causes injury or unsafe fatigue.',
'Ask an occupational therapist about daily-living equipment.|Request physiotherapy or rehabilitation where indicated.|Seek accessible housing advice.|Ask about assistive technology for communication.|Request a review when the first adaptation does not work.'
),
P('Other people taking over',
'Some people may decide what you need without asking. That can reduce choice at precisely the time you are working to regain it.',
'Effective support preserves autonomy as well as assisting with physical tasks.',
'Who is making decisions for you?|What would you prefer to do yourself?|Where is help welcome?|How can choices remain yours?',
'A relative spoke for me at an appointment|Someone moved my equipment without consent|I wanted to try a task independently|A carer assumed I could not make decisions',
'Tell others how you prefer assistance offered.|Choose which parts of a task to do yourself.|Ask for information in a usable format.|Set consent boundaries around equipment and touch.|Make preferences visible in a care plan.',
'Request an advocate in care planning.|Ask clinicians to address you directly.|Seek a care-plan review when choices are overlooked.|Discuss supported decision-making arrangements.|Ask family members to follow agreed assistance preferences.'
),
P('Planning an uncertain future',
'A prognosis may be unclear while housing or work decisions are urgent. You may feel pressed to choose an entire future before knowing what support will become available.',
'Uncertain recovery and practical decisions require staged planning with accurate clinical information.',
'What decision cannot wait?|What is known about recovery?|Which option is reversible?|What support would make planning possible?',
'I worried about returning to work after injury|I did not know whether my home would remain accessible|I postponed plans because prognosis was uncertain|I needed help understanding rehabilitation options',
'Separate immediate needs from long-term predictions.|Prioritise safe housing and essential care.|Choose reversible arrangements where possible.|Ask for realistic functional goals rather than guarantees.|Keep a list of urgent administrative decisions.',
'Ask an appropriate clinician about prognosis and review dates.|Seek occupational health advice for returning to work.|Request disability benefits or financial guidance if relevant.|Ask a housing adviser about adaptations.|Find a case coordinator when services are fragmented.'
)
],
'New neurological symptoms, worsening weakness or acute injury may require urgent medical assessment. Rehabilitation should follow individual clinical advice; do not force painful or dangerous exercise. Autonomy and consent remain central to care.',
['access','health']
],
[
'mobility-barriers',
'An inaccessible entrance can turn an ordinary plan into a series of calls and explanations. The barrier is the missing access, not a lack of determination on your part.',
'When a place is designed without your movement in mind',
[
'Mobility barriers can involve stairs or inaccessible transport, as well as long walking distances with no seating. People use different mobility aids and have different endurance. An apparently accessible venue may still be unusable if the accessible entrance is locked or far away.',
'Plans made without checking access can leave someone excluded at the last moment. A friend may choose a café on the basis of food and price, only to find the toilet inaccessible. Checking those details beforehand can prevent disappointment, but venues also have a responsibility to provide accurate information.',
'Transport can create linked problems. A person might reach the station yet be unable to board because assistance was not arranged. One inaccessible leg of a journey can make the whole trip impossible. Reliable access information and clear contingency plans matter.',
'Some people feel pressured to walk beyond safe limits to avoid inconveniencing others. That can worsen pain or fatigue and make the next day harder. A mobility aid or a shorter route is a means of participation, not evidence that somebody is giving up.',
'Advocacy can be exhausting when it is needed for every outing. People may benefit from a shared access checklist or support person who handles calls. These strategies reduce work for the individual, but the long-term responsibility remains with transport providers and organisations.',
'The goal is being able to decide where to go and take part. A safer route or an accessible alternative can restore freedom. When access is refused, practical advice and appropriate equality processes may help address the actual barrier.'
],
[
P('Inaccessible buildings',
'A place may advertise access while the only practical entrance has steps or the lift is out of service. The difficulty needs an environmental remedy.',
'Physical infrastructure determines whether participation is possible; motivation cannot substitute for access.',
'Which entrance or feature blocks access?|What alternative is available?|Who can resolve it?|How will the venue prevent recurrence?',
'The only entrance had steps|A lift was broken when I arrived|An accessible toilet was used for storage|The meeting room was too narrow for my chair',
'Check the exact access route before an important visit.|Ask whether lifts are currently operational.|Request a genuinely accessible venue rather than an unsafe workaround.|Document a repeated barrier when needed.|Choose an alternative when immediate safety is at risk.',
'Ask the organiser to move the event.|Request facilities staff to remove an obstruction.|Seek accessible venue information in writing.|Ask for assistance with a safe alternative entrance.|Obtain advice on access rights when a service refuses changes.'
),
P('Transport failures',
'An accessible venue does not help when the journey to it cannot be completed. Delays or failed assistance can create a chain of missed commitments.',
'Mobility access must include each part of the route, including transfers and waiting areas.',
'Which part of the journey is inaccessible?|What assistance was promised?|Is there a realistic alternative?|Who can resolve a failure?',
'Station assistance did not arrive|The bus ramp was unavailable|I could not reach the accessible platform|A taxi refused my mobility equipment',
'Check the accessibility of every journey leg.|Keep confirmation of booked assistance.|Allow extra time for essential trips when feasible.|Know the provider’s disruption contact method.|Avoid unsafe boarding or transfers.',
'Ask a transport provider about passenger assistance.|Report failure of an agreed adjustment.|Request accessible taxi or community transport information.|Ask an organiser about remote participation if transport fails.|Seek independent advice after repeated inaccessible travel.'
),
P('Fatigue and distance',
'You might manage short distances and still struggle with long corridors or standing in queues. Others may not realise how quickly pain or fatigue changes what is possible.',
'Mobility access includes endurance and fluctuating capacity, not only the ability to walk.',
'How far can you travel comfortably?|What happens after standing?|Which rest points exist?|What route would make the task manageable?',
'I could walk into a shop but not through the whole centre|I needed a seat while queuing|A long corridor exhausted me|I used a mobility aid on a flare day',
'Choose a route with suitable resting points.|Use an appropriate mobility aid when needed.|Plan essential errands around realistic capacity.|Ask about seating rather than pushing through pain.|Keep recovery time after an unavoidable trip.',
'Request priority seating where relevant.|Ask a venue about distance from entrance to appointment.|Seek clinical advice on suitable mobility equipment.|Discuss mobility barriers with occupational therapy.|Ask family to help with physically demanding errands.'
),
P('Being excluded from plans',
'Friends may choose venues without asking what access you need, leaving you to decide whether to complain or stay home. Shared planning can prevent repeated exclusion.',
'Social participation depends on other people’s practical choices as well as accessible infrastructure.',
'Who chooses the venue?|Was access information available?|What alternative would work?|How could future plans change?',
'Friends booked an upstairs restaurant|I declined an outing because transport was inaccessible|The group changed venues after I asked|I was left out of a trip with no accessible option',
'Tell organisers the specific barrier early when possible.|Offer one accessible alternative rather than apologising.|Avoid accepting a dangerous workaround to preserve harmony.|Check whether a shorter version of the outing is possible.|Notice which friends share the planning effort.',
'Ask hosts to confirm access before booking.|Request an accessible social venue.|Seek inclusive event planning from an organisation.|Ask friends to share transport research.|Find community groups that routinely plan for mobility access.'
)
],
'Unsafe lifting, inaccessible emergency exits or transport barriers require practical safety decisions. New mobility loss or severe neurological symptoms need medical assessment. Do not attempt unsafe transfers to compensate for inaccessible design.',
['access','equality']
],
[
'hearing-access',
'You may have been in a meeting where everyone spoke as though captions were optional. Missing a few words can mean missing the decision itself. Communication access should be built into the conversation rather than left for you to recover afterward.',
'Being included when spoken information is not accessible',
[
'Hearing access needs vary. Some people use spoken language with hearing aids, while others use sign language or rely on captions and written information. There is no single preferred communication method for every deaf or hard-of-hearing person, and Deaf cultural identity should be respected.',
'Background noise can make speech difficult even when a person hears some sounds. A lecture with several overlapping voices may be inaccessible despite good equipment. Microphone use and clear turn-taking can make information easier to follow, especially when combined with captions.',
'Communication barriers become serious in healthcare. A patient may miss instructions about medicine or consent when staff assume a family member can interpret. Professional interpretation and accessible information are often necessary for informed decisions and privacy.',
'Social situations can be tiring when people continue talking while facing away or covering their mouths. A person may smile politely because it is awkward to interrupt repeatedly. The resulting misunderstanding is preventable when others learn how to communicate accessibly.',
'Assistive technology is helpful when it fits the person. Automatic captions can contain errors and may be unsuitable for complex medical or legal information. A written summary or qualified interpreter may still be needed. Access should be checked rather than assumed because a tool is present.',
'You have the right to choose how you communicate whenever possible. A good arrangement allows you to participate directly in the conversation and make your own decisions. It does not treat the person beside you as the owner of your voice.'
],
[
P('Meetings and group conversation',
'Multiple speakers and background noise may make it impossible to follow a discussion. You might only learn what happened after the decision has been made.',
'Accessible group communication requires appropriate tools and disciplined turn-taking.',
'What part of the conversation was missed?|Which technology or format helps?|Could speakers take turns?|How will decisions be confirmed?',
'Several people talked over one another|Captions were missing during a video call|A presenter did not use the microphone|I missed a decision because I could not follow',
'Request captions before the meeting.|Ask speakers to use a microphone consistently.|Choose seating or a screen position that helps.|Ask for decisions in writing afterward.|Interrupt to clarify information essential for participation.',
'Ask organisers about live captioning or interpreting.|Request a meeting chair who enforces turn-taking.|Seek hearing-loop information where relevant.|Ask for an agenda and written minutes.|Request technical checks before important sessions.'
),
P('Medical communication',
'A healthcare appointment may rely on unfamiliar medical terms and rapid speech. Without suitable interpretation, important consent or treatment information can be missed.',
'Accurate communication support is necessary for informed and confidential healthcare.',
'Which instruction was unclear?|What communication support was provided?|Could you ask questions privately?|What needs correcting in the record?',
'I was asked to lip-read during an appointment|A nurse assumed my relative could interpret|I could not hear medicine instructions|No sign-language interpreter was booked',
'Request the communication method you need in advance.|Confirm important treatment instructions in writing.|Ask for repetition when medical information is unclear.|Check that consent questions are addressed to you.|Avoid relying on inaccurate automated captions for high-stakes decisions.',
'Ask the service for a qualified interpreter when needed.|Request that accessible communication preferences be recorded.|Seek patient advocacy after repeated failures.|Ask a pharmacist for accessible medicine information.|Refer to applicable Accessible Information Standard requirements.'
),
P('Everyday interaction fatigue',
'People may expect you to ask for repetition endlessly while they continue speaking from another room. The effort can make ordinary social contact tiring.',
'Communication is a shared responsibility and can be improved through simple environmental changes.',
'When does listening become exhausting?|What behaviour makes it harder?|What would help people communicate?|What boundary do you need?',
'Someone talked to me while facing away|I nodded because I could not keep asking again|A restaurant was too noisy for conversation|A friend got annoyed when I requested repetition',
'Ask people to face you before speaking if useful.|Choose lower-noise venues for important conversations.|Request one speaker at a time.|Use written messages when listening becomes costly.|Decide when to pause a tiring interaction.',
'Explain preferred communication practices to friends.|Ask a venue about quieter seating.|Request accessible phone alternatives from services.|Seek community support from people with similar access needs.|Ask family members to respect communication pauses.'
),
P('Identity and technology choice',
'You may prefer sign language or another method while people assume a hearing device should be the sole solution. Access should follow your choices and needs.',
'Technology and language preferences are individual; no aid provides universal access.',
'What method do you prefer?|Where does it work well?|What remains inaccessible?|Who is pressuring a particular choice?',
'Someone insisted hearing aids would solve everything|I preferred signing in an appointment|Automatic captions mistranscribed important words|I needed an accessible way to contact a service',
'Choose communication tools based on actual usefulness.|Check caption accuracy for important information.|Use accessible text contact where appropriate.|Keep sign-language access preferences visible when wanted.|Avoid accepting unwanted technology as a condition of respect.',
'Request interpreters or captions suited to the situation.|Seek audiology advice for devices you wish to consider.|Ask a service to offer text-based contact.|Find a Deaf-led organisation for community support.|Request an access review when equipment does not work.'
)
],
'Sudden hearing loss, severe ear symptoms or acute neurological changes need prompt medical assessment. Automated captions may not be adequate for high-stakes decisions. Deaf people retain autonomy over language and communication preferences.',
['hearing','access']
],
[
'vision-access',
'An appointment letter may be perfectly clear to the person who designed it and completely inaccessible to you. Being asked to bring someone who can read it does not provide the same independence as receiving it in a usable format.',
'When important information is only offered visually',
[
'Vision access includes far more than whether somebody can see large print. People may need screen-reader compatible information or clear environmental navigation. Preferences differ, and a service should ask what format works rather than assuming all blind or partially sighted people need the same aid.',
'A small text field can make an online form impossible to complete. If error messages are not announced to assistive technology, the user may be blamed for an application they were never able to submit. Accessible design can remove the problem without requiring anyone to disclose medical history in public.',
'Physical environments can also create risk. A temporary obstacle in a familiar route may be hard to detect. Clear signage and consistent layout matter, along with appropriate staff assistance. Grabbing a person or their mobility aid without consent can be unsafe and disrespectful.',
'People sometimes assume visual impairment determines other abilities. A clinician might address a companion rather than the patient. That removes control over treatment decisions. Accessible information should allow the person to understand options and consent directly.',
'Technology can support independence when it fits the task. Screen readers and magnification tools have different strengths. A service should test whether its documents work with the chosen tool rather than simply providing a PDF marked accessible.',
'The practical aim is reliable participation. You may want to complete a form privately or travel to a new place without a last-minute barrier. The right adjustment concerns the actual information or route and respects your preferred methods of navigation.'
],
[
P('Inaccessible digital information',
'A website or form may depend on tiny text or controls a screen reader cannot identify. The problem lies in the interface, not your willingness to complete the task.',
'Accessible digital formats allow independent use of information and services.',
'Which control was inaccessible?|What technology do you use?|What task could not be completed?|Who owns the website or form?',
'A button had no screen-reader label|A form timed out while I navigated it|A scanned letter was unreadable by my software|I could not enlarge an essential diagram',
'Keep details of the inaccessible page or control.|Use accessible alternatives only when they preserve your privacy.|Request a compatible document format.|Avoid sharing passwords with someone merely to complete a form.|Test whether a different permitted format solves the issue.',
'Report the digital barrier to the provider.|Request accessible HTML or tagged documents.|Ask for a secure alternative submission method.|Seek assistive-technology assessment if wanted.|Ask for extra time when an inaccessible form caused delay.'
),
P('Navigating physical spaces',
'An unexpected obstacle or unclear sign can make a familiar journey dangerous or prevent independent access. Staff help is useful when offered in the way you prefer.',
'Layout and wayfinding decisions can determine safety and autonomy.',
'Where did navigation break down?|Was the obstacle temporary?|What guidance would you welcome?|Who can alter the route?',
'A delivery blocked the usual corridor|I could not find a clearly marked entrance|Someone grabbed my arm without asking|A temporary sign was not accessible',
'Check unfamiliar routes through reliable access information.|Ask for directions in your preferred format.|Do not enter an unsafe route to avoid asking for help.|Tell someone how you prefer guiding assistance.|Keep mobility aids and navigation choices under your control.',
'Ask facilities staff to remove obstructing objects.|Request a guided orientation to a new building.|Seek accessible wayfinding information.|Ask staff for consent before physical assistance.|Report repeated hazards on essential routes.'
),
P('Health information and consent',
'Medical documents may be given in a format you cannot read, leaving another person to interpret private information. That can prevent genuine informed choice.',
'Healthcare access includes confidential information in a format the patient can use.',
'What information was inaccessible?|Could you review it independently?|Was consent obtained appropriately?|What alternative format is needed?',
'I was handed a small-print consent form|A clinician addressed my companion instead of me|I could not read medicine instructions|A test result was provided only as an image',
'Ask for information before making a nonurgent decision.|Request a format compatible with your preferred reader.|Check that clinical explanations address you directly.|Keep written questions in an accessible format.|Decline unnecessary disclosure to bystanders.',
'Ask the service for accessible health information.|Request patient advocacy after repeated access failures.|Speak to a pharmacist about readable medicine information.|Ask for an accessible explanation of test results.|Seek assistance recording communication preferences in healthcare.'
),
P('Everyday autonomy',
'Other people may assume blindness or partial sight means you cannot decide how to complete an activity. The support you want may be practical access rather than somebody taking over.',
'Autonomy depends on being offered choices and appropriate assistance, not on visual acuity alone.',
'Which task do you want to control?|What assistance is welcome?|What does another person assume?|How could independence be preserved?',
'Someone filled in a form without asking me|I wanted to shop independently|A colleague assumed I could not manage a task|I needed a readable timetable',
'State the task outcome you want to achieve.|Choose an assistive tool that meets the need.|Ask people to offer rather than impose help.|Keep personal decisions with you wherever possible.|Review whether an adjustment permits independent participation.',
'Request accessible retail or public-service information.|Seek an orientation and mobility specialist if useful.|Ask employers about accessible workplace technology.|Find peer advice from blind or partially sighted people.|Request a review if an offered adjustment leaves barriers unresolved.'
)
],
'Sudden or rapidly worsening loss of vision, visual disturbance with neurological symptoms or eye injury requires urgent assessment. Do not attempt dangerous navigation to compensate for inaccessible environments. Respect consent when offering guiding assistance.',
['vision','access']
]
];
