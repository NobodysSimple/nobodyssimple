/* Pain, post-viral symptoms, limited energy and treatment access. */
const part=s=>s.split('|').map(x=>x.trim());
const P=(name,detail,insight,questions,scenes,actions,support)=>[name,detail,insight,part(questions),part(scenes),part(actions),part(support)];
export const ACCESS_DISABILITY_3=[
[
'chronic-pain-social-life',
'Pain can change the smallest social decision. You may want to see someone and already be calculating how long you will sit and whether you will have enough energy to get home afterward.',
'Keeping relationships possible when pain changes participation',
[
'Chronic pain can affect social life through limits on movement or concentration. The experience differs by condition and person. A friend may see you at dinner and assume that because you attended, the evening had no cost. They may not see the rest required before or after the outing.',
'Cancelling plans can lead to guilt, particularly when you are the person who has cancelled before. You may fear friends will stop inviting you. A flexible invitation that allows a shorter visit or remote contact can preserve connection without forcing you to exceed safe limits.',
'Pain may also change how you listen or respond. During a flare, attention can narrow toward discomfort. A loved one might interpret quietness as anger. Explaining what is happening can help where the relationship is responsive. You should not need to disclose every physical detail for your needs to be respected.',
'Repeated activity avoidance can have different causes. Sometimes you are protecting an injured body. In other circumstances fear of pain may prevent a safe activity you want to do. Those situations require different guidance. Decisions about movement need to reflect medical advice and the particular condition.',
'People may suggest exercise or another treatment as soon as they hear that you live with pain. Unsolicited fixes can make a conversation feel like an assessment. You can set a boundary and ask for company rather than advice. Your social relationships are allowed to contain more than your symptoms.',
'A meaningful social life can include adapted plans. Perhaps you can meet for a shorter meal or sit somewhere more comfortable. The measure is whether the experience fits your capacity and choices, not whether it looks like the activities you enjoyed before pain became persistent.'
],
[
P('Cancelling and guilt',
'You may cancel because symptoms are worse and then spend hours worrying that your friends think you do not care. The uncertainty can make the next invitation harder to accept.',
'Fluctuating symptoms and social expectations interact; guilt does not establish that a cancellation was unnecessary.',
'What changed before the plan?|What recovery was needed?|What did your friend actually say?|Could there be a flexible alternative?',
'I cancelled dinner during a pain flare|I feared friends would stop inviting me|Someone called my cancellation an excuse|I felt guilty after staying home to recover',
'Send a clear cancellation without excessive self-blame.|Offer a lower-demand alternative if you want contact.|Avoid promising attendance when capacity is uncertain.|Choose plans with realistic travel and seating.|Notice which relationships tolerate changes well.',
'Ask friends to keep inviting you without pressure.|Agree on flexible social arrangements.|Seek support for persistent isolation linked to pain.|Discuss flare management with your clinician.|Ask someone to help with transport when appropriate.'
),
P('Pain during social time',
'You may attend an event and find sitting or noise increases discomfort. You can need an adjustment even after deciding you wanted to be there.',
'Accessibility and pacing affect participation within the event, not just whether it starts.',
'Which part of the event caused pain?|Was seating suitable?|Could you pause or leave?|What would help next time?',
'I needed to change position during dinner|I struggled to follow a conversation during a flare|A long queue worsened my pain|I left a gathering earlier than planned',
'Choose a venue with suitable seating.|Allow yourself to change position when needed.|Plan an exit that does not require arguing.|Bring appropriate prescribed or usual aids.|Arrange a shorter visit when that fits.',
'Ask a host about seating before attending.|Request priority access when applicable.|Ask a companion to help with transport.|Seek clinical guidance for recurrent activity-related pain.|Discuss accessible event arrangements with organisers.'
),
P('Being given unwanted solutions',
'Someone may start suggesting treatments every time you describe pain. You might want to feel understood rather than have your choices reviewed.',
'Support can involve listening and practical accommodation without unsolicited medical advice.',
'What response do you actually want?|Did someone ask before advising?|What boundary would help?|How could the relationship remain supportive?',
'A friend sent another cure article|A relative insisted pain was caused by attitude|I stopped discussing symptoms to avoid advice|Someone listened without trying to fix me',
'State when you want company rather than treatment suggestions.|Choose which health information to share.|Avoid debating every unverified remedy.|Keep treatment changes with the appropriate clinician.|Acknowledge helpful care when it respects your choice.',
'Ask loved ones to check what kind of support you want.|Seek a pain-informed support group if useful.|Request that family members stop pressuring treatment changes.|Discuss difficult relationship dynamics with a counsellor.|Find someone willing to join accessible activities.'
),
P('Preserving meaningful connection',
'Pain may reduce the activities you can do together, yet the relationship can remain important. You can experiment with a different form of contact without pretending the loss is painless.',
'Adapted social participation can preserve relationships while respecting current capacity.',
'Which relationship matters most to maintain?|What form of contact is tolerable?|What did you enjoy doing together?|What adjustment would make it possible?',
'I missed regular walks with a friend|We watched a film together instead of going out|I worried I had become a burden|I enjoyed a short visit despite the pain',
'Choose a low-demand way to stay in touch.|Schedule contact at a time symptoms are often more manageable.|Allow a valued activity to take a shorter form.|Keep room for friendships not centred on illness.|Review whether the new plan works for both people.',
'Invite a friend to a quieter accessible activity.|Arrange accessible travel assistance for one particular social journey.|Seek a community group offering remote options.|Consider relationship support if pain has strained communication.|Ask an occupational therapist about leisure adaptations.'
)
],
'New severe pain, weakness, bladder or bowel changes or other red flags need urgent medical assessment. Activity advice must suit the diagnosis; do not push through dangerous symptoms to maintain social participation. Pain management can combine physical and psychological approaches without denying the pain.',
['pain','health']
],
[
'long-covid-experiences',
'You may have expected to recover from the infection and found that ordinary tasks still have consequences weeks or months later. The difficulty is living with symptoms whose pattern may be unclear while life continues asking things of you.',
'When recovery is slower and less predictable than expected',
[
'Long COVID refers to symptoms that continue or develop after a COVID-19 infection and cannot be explained by another diagnosis. People report different difficulties, including fatigue or impaired concentration. A person’s symptoms and needs may change over time, so a single recovery timetable cannot be promised.',
'One person may feel short of breath during tasks that were previously routine. Another notices that complex work requires more concentration than before. These problems deserve a clinical review to identify relevant causes and manage risks; it is not reasonable to assume that everything is anxiety.',
'Some people experience post-exertional symptom exacerbation. They may feel relatively capable during an activity and worsen hours or days later. Advice to push exercise intensity automatically can be harmful in that pattern. The person needs individual energy management informed by the clinical condition.',
'Work and household roles often become difficult to maintain. A person may be praised for returning to work while privately using all remaining energy to recover. Adjusting duties or obtaining help with essential tasks can be more helpful than simply increasing determination.',
'The uncertainty can affect identity and relationships. You may worry that other people think you should already be well. Explaining the actual functional effect of symptoms can support access, though it is not your responsibility to persuade every sceptical stranger.',
'Good care looks at the symptom pattern and follows up changes. You may need information about breathlessness or cognitive symptoms, alongside practical support for energy and mobility. The goal is informed, safe participation rather than returning to a fixed version of normality by an arbitrary date.'
],
[
P('Post-exertional worsening',
'You may cope during an activity and develop a marked increase in symptoms later. The delay can make it hard to explain why the activity was too much.',
'Delayed symptom exacerbation requires careful management rather than automatic increases in exercise or workload.',
'What preceded the worsening?|How delayed was it?|Which activities were involved?|What guidance do you have about energy limits?',
'I felt worse the day after shopping|Exercise caused a prolonged crash|A social visit worsened symptoms for days|I overcommitted after a better morning',
'Notice delayed changes after physical or cognitive effort.|Avoid forced graded increases where post-exertional malaise occurs.|Build rest into necessary activities.|Choose essential tasks within current capacity.|Record major changes briefly for clinical review.',
'Ask a clinician familiar with long COVID about post-exertional symptoms.|Seek specialist advice on energy management.|Request flexible work duties after symptom worsening.|Arrange practical support obtaining food or medication during a post-exertional crash.|Discuss the delayed pattern with someone who manages your schedule.'
),
P('Breathlessness and physical symptoms',
'Physical symptoms can make ordinary errands uncertain. They may also need targeted investigation, particularly if the pattern changes suddenly or becomes severe.',
'Post-COVID symptoms can overlap with other conditions; assessment should follow warning signs and function.',
'Which physical symptom is most limiting?|Is it new or getting worse?|What assessment has been done?|Which activity is unsafe?',
'I became breathless climbing a few steps|Palpitations made me worry about exertion|I felt dizzy after standing|A new chest symptom frightened me',
'Seek urgent care for serious chest symptoms or severe breathlessness.|Follow individual clinical advice on exertion.|Use a shorter route or rest point when needed.|Record new or changing physical symptoms.|Avoid attributing every symptom automatically to long COVID.',
'Ask a GP about appropriate investigation of persistent symptoms.|Seek clinical review for palpitations or dizziness.|Request accessible transport for essential visits.|Ask about rehabilitation tailored to your symptom profile.|Get a clear plan for when symptoms need urgent attention.'
),
P('Cognitive difficulties',
'You may struggle with concentration or finding words even when the work once felt familiar. The frustration can increase if colleagues assume you have simply become less careful.',
'Cognitive symptoms deserve practical adjustments and clinical consideration rather than moral judgement.',
'What cognitive task changed?|When does it become difficult?|Which written aid helps?|What would make work accessible?',
'I forgot a conversation after infection|I lost my place during a work task|I struggled to find a familiar word|Several instructions overwhelmed me',
'Reduce multitasking during demanding activities.|Use written reminders for essential information.|Break complex work into manageable stages.|Schedule cognitively demanding tasks when capacity is better.|Avoid compensating through excessive hours.',
'Ask for an occupational health review.|Request written work instructions.|Discuss persistent cognitive symptoms with a clinician.|Seek workplace or study adjustments for concentration.|Ask colleagues to allow processing time.'
),
P('Being disbelieved or rushed',
'Someone may assume you should have recovered because the infection was months ago. That judgement can make seeking help feel exhausting.',
'Belief and access should reflect the documented impact of symptoms rather than a fixed recovery expectation.',
'What has changed since infection?|What response did you receive?|Which practical need remains?|Who can provide appropriate care?',
'A colleague said I should be over it by now|My symptoms were dismissed because tests were normal|I worried about taking more sick leave|A friend questioned why I cancelled plans',
'Describe current function in concrete terms.|Keep records needed for work or benefits.|Avoid overexerting to prove you are recovering.|Request a review when the plan does not fit.|Protect private health details where possible.',
'Ask occupational health about appropriate adjustments.|Seek support for benefits or sick pay when eligible.|Discuss dismissal of symptoms with patient advice services.|Find a long-COVID-informed clinician where available.|Ask friends to plan around fluctuating capacity.'
)
],
'Severe breathlessness, chest pain, fainting or acute neurological symptoms require urgent assessment. Post-exertional malaise can make forced activity increases unsafe; management must be individualised. Do not assume all new symptoms are due to long COVID.',
['fatigue','health']
],
[
'pacing-and-energy',
'You may have become skilled at pushing through discomfort because responsibilities rarely wait. When the cost arrives afterward, it can feel as though the day has borrowed energy you did not have.',
'Choosing activities when energy is genuinely limited',
[
'Pacing is often used to describe planning activity around available energy or symptoms. The meaning and evidence vary by condition. For somebody with post-exertional malaise, the priority is staying within energy limits; for another person, appropriately graded rehabilitation might be part of a clinical plan. A universal exercise schedule is not suitable.',
'Energy is used by more than physical movement. A difficult conversation may be exhausting, and managing bright or noisy environments can add to the load. A person who looks physically still may be completing demanding cognitive work. Plans should account for the actual activity, not simply step counts.',
'Some days the immediate problem is deciding what must happen. A person may have several necessary appointments and limited capacity to attend them all. Prioritising the most urgent and arranging support can prevent a crisis, although financial or caring obligations may limit choices.',
'A better day can tempt you to clear every backlog. If symptoms worsen later, that pattern is worth reviewing without blame. An activity diary can sometimes clarify what happened, but constant recording may itself become exhausting. The amount of monitoring should be proportionate to its usefulness.',
'Other people can make pacing impossible by assuming rest is optional. A workplace may require uninterrupted shifts or a household may leave one person responsible for every task. Practical change may involve reducing the load or sharing duties rather than improving personal resilience.',
'A sustainable plan should preserve activities that matter, not only essential chores. You may want enough capacity to speak with a friend or spend time outdoors. The goal is informed choice within real limits, supported by appropriate care.'
],
[
P('Delayed crashes',
'You may feel able to complete an activity and develop much worse symptoms afterward. The delay can hide the relationship between exertion and worsening.',
'Post-exertional symptom exacerbation requires condition-specific assessment and energy management.',
'Which activities precede deterioration?|When does the worsening begin?|How long does it last?|What clinical advice applies?',
'I felt unwell the day after a long outing|A short work shift caused days of exhaustion|I pushed through symptoms to finish chores|My energy crashed after an intense conversation',
'Keep activity within known limits when PEM is present.|Avoid fixed increases that repeatedly trigger deterioration.|Plan recovery around unavoidable tasks.|Identify high-cost activities before accepting new commitments.|Record significant delayed worsening for a clinical review.',
'Ask a clinician about post-exertional malaise.|Seek condition-specific pacing advice.|Request reduced work demands when necessary.|Ask family to share physically or cognitively demanding chores.|Discuss serious symptom deterioration promptly.'
),
P('Choosing priorities',
'You may have enough capacity for one task and feel guilty about everything else. A realistic plan names what needs doing and who can help.',
'Energy limits and practical consequences should guide priorities more than guilt or an ideal productivity target.',
'Which task is genuinely time-sensitive?|What could wait?|What can be delegated?|What valued activity should remain?',
'I used all my energy on an unnecessary errand|I could not manage two appointments in one day|I neglected meals after household tasks|I felt guilty leaving something unfinished',
'Identify one essential priority for the day.|Arrange food and medication access first.|Delegate a task with a clear request.|Leave capacity for a valued activity when possible.|Avoid planning according to the best day of the month.',
'Ask someone to help with shopping or cooking.|Request appointments on separate days.|Seek workplace duty adjustments.|Find social care support for essential activities if eligible.|Ask a trusted person to help organise unavoidable deadlines.'
),
P('Cognitive and emotional costs',
'Problem-solving and social interaction may consume energy even when your body appears at rest. These demands can be easily overlooked in activity plans.',
'Energy management can include cognitive and emotional tasks as well as physical exertion.',
'Which conversations are costly?|What thinking task drains capacity?|Can the environment be simplified?|What recovery follows the demand?',
'I was exhausted after an administrative phone call|A noisy event used all my concentration|I struggled after an emotional conversation|Completing paperwork left me unable to cook',
'Schedule demanding paperwork for a manageable time.|Use written communication when calls are costly.|Reduce unnecessary sensory input during concentration.|Separate emotional conversations from other major demands.|Allow a break after high-stakes decisions.',
'Ask services to offer written or asynchronous contact.|Request shorter meetings with clear agendas.|Seek help completing complex forms.|Ask family to respect recovery after difficult conversations.|Discuss cognitive fatigue with the relevant clinical team.'
),
P('External demands and support',
'Pacing can become impossible when other people keep increasing obligations. You may need a change in workload rather than a more efficient personal schedule.',
'Access to support and reduced demands is part of managing limited energy.',
'Who controls the current workload?|Which demand is negotiable?|What evidence of function is needed?|How can the change be reviewed?',
'My manager added shifts despite fatigue|I was expected to manage all household cleaning|An organiser refused flexible attendance|I could not afford to reduce work',
'Identify the most costly recurring demand.|Ask for one concrete task to be reassigned.|Keep a realistic record of functional effects.|Check financial consequences before changing employment.|Review whether an agreed adjustment helps.',
'Seek occupational health advice for reduced capacity.|Ask about reasonable adjustments where applicable.|Find benefits or financial guidance if work is affected.|Request community support for essential household tasks.|Ask a clinician for advice appropriate to the underlying condition.'
)
],
'Post-exertional malaise requires caution; do not recommend compulsory graded exercise or pushing through symptom worsening. NICE NG206 states energy management should respect individual limits. New or severe symptoms require clinical assessment.',
['fatigue','access']
],
[
'healthcare-access-discrimination',
'Healthcare is harder to use when the appointment itself is inaccessible or someone makes assumptions about your disability. You should not have to choose between explaining your access needs and explaining why you came for treatment.',
'When getting care involves another barrier',
[
'Healthcare discrimination can arise when staff assume a disabled person cannot make decisions or when services lack reasonable communication support. The resulting harm may be an incomplete assessment or an appointment that cannot be attended. These are practical failures that need to be addressed at the point of care.',
'The barrier may occur before you reach a clinician. A booking system may require a phone call you cannot use. A clinic may have no accessible examination equipment. Being told to come back another day can create further pain and expense, especially when travel is difficult.',
'Bias can affect how symptoms are understood. Some people have health concerns automatically attributed to a known disability without appropriate consideration of other causes. Diagnostic overshadowing can delay care. You are entitled to ask what assessment has been undertaken and why a conclusion was reached.',
'Medical appointments also involve decisions about consent. A clinician should communicate directly with the patient and use support that enables understanding. A carer may be invited to assist when the patient wants this, but their presence does not transfer decision-making authority automatically.',
'Where access fails, a factual record can help show which change is needed. You might document that a booked interpreter was unavailable or that examination equipment was unsuitable. A clear complaint should identify the consequence and requested remedy. It need not speculate about hidden intentions.',
'The goal is safe care in which you can explain symptoms and consider treatment options. Practical advocacy and formal equality mechanisms may be needed. Your physical symptoms still deserve timely attention while the access issue is being resolved.'
],
[
P('Inaccessible booking and travel',
'A service may insist on a communication channel or location that cannot be used. You may miss essential care because the process was not designed for your access needs.',
'Administrative access is part of healthcare, not an optional extra.',
'What prevented booking or arrival?|What alternative is needed?|Is medical care urgent?|Who can alter the process?',
'I could only book by phone despite hearing barriers|The clinic entrance was inaccessible|I missed an appointment after failed transport assistance|An online form did not work with my screen reader',
'Record the specific access failure.|Request an alternative contact route.|Prioritise urgent health concerns while resolving access.|Keep appointment correspondence.|Avoid unsafe travel workarounds.',
'Ask the provider’s accessibility team for support.|Ask a clinic to record your preferred access arrangements for future visits.|Seek patient advice about repeated failures.|Ask for transport support where available.|Request a written response to a formal access complaint.'
),
P('Being spoken over or ignored',
'A professional may direct questions to your companion or assume that a disability affects your judgement. That can make it harder to give accurate information or make informed choices.',
'Respectful care requires communication support that preserves the patient’s own decisions.',
'Who was addressed directly?|What information was missed?|What support do you prefer?|What correction would help?',
'A clinician asked my carer instead of me|I was not offered interpretation|A doctor assumed I could not understand|My communication aid was ignored',
'State how you wish to be addressed before clinical questions begin.|State which communication method you use.|Choose whether a companion participates.|Request information in a usable format.|Seek clarification before consenting to a procedure.',
'Ask for appropriate interpretation or communication support.|Request that preferences be recorded in your notes.|Seek a patient advocate for a difficult appointment.|Ask staff to explain decisions directly to you.|Request a review if consent was not properly supported.'
),
P('Symptoms attributed to disability',
'A new concern may be dismissed as part of an existing condition. You might need a clear explanation of why other causes were or were not considered.',
'Diagnostic overshadowing can occur when one label shapes clinical judgement excessively.',
'What symptom is new?|What assessment occurred?|Which explanation was offered?|What follow-up is planned?',
'My new pain was blamed on my existing diagnosis|A doctor assumed fatigue was normal for my disability|A serious symptom was not investigated|I left without clear safety-net advice',
'Describe what has changed from your baseline.|Ask which alternative causes were considered.|Keep a concise symptom chronology.|Seek urgent assessment for red flags.|Ask for a written plan explaining what changes need review and when to return.',
'Ask another appropriate clinician to review a new symptom.|Seek an explanation of investigation decisions.|Request an accessible test or examination.|Ask for patient advocacy if concerns are repeatedly ignored.|Discuss persistent symptoms with the relevant specialist.'
),
P('Complaints and service change',
'When an adjustment repeatedly fails, you may be forced to tell the same story at every appointment. A formal process should focus on the barrier and who is responsible for removing it.',
'A remedy should result in practical access rather than a general statement about inclusivity.',
'What decision failed?|Who can change it?|What remedy would be measurable?|How will it be reviewed?',
'I complained about a missing interpreter twice|The service promised a ramp but nothing changed|My access preference was lost from records|I wanted the hospital to prevent the same failure',
'Record dates and actual consequences.|Request a named person responsible for the change.|Choose a practical remedy in the complaint.|Keep copies of written responses.|Set a follow-up date for checking implementation.',
'Ask patient advice services about complaint routes.|Seek an independent equality or disability advocate.|Request an accessible care-plan update.|Ask the organisation for a timescale.|Seek support protecting care access during a dispute.'
)
],
'Acute medical needs should not be delayed by an administrative complaint. Failure to provide accessible communication can affect consent and safety. Seek urgent care for red-flag symptoms and appropriate advocacy for repeated access barriers.',
['access','equality','health']
],
[
'medicine-side-effects',
'A treatment may help one symptom and make another part of daily life harder. You are allowed to report that trade-off and ask for a review without being treated as ungrateful for the medicine working.',
'When treatment benefits have an everyday cost',
[
'Medicines can produce unwanted effects that vary by substance, dose and individual circumstances. A side effect may appear soon after starting treatment or follow a change in dose. Recording the timing can help a prescriber investigate, but symptoms may have other causes too.',
'People sometimes stay silent because they fear a clinician will stop the only medicine that helps. A useful consultation examines both the benefit and the cost. The choice might involve monitoring or a different approach, depending on the treatment and medical risk.',
'Other people may dismiss side effects because the medication improves a visible problem. Someone might appear calmer or more productive while experiencing nausea or disrupted sleep. The patient’s own account of functioning matters to the decision.',
'Stopping medication abruptly can be risky for some treatments. Changes should be discussed with a prescriber or pharmacist, especially when withdrawal or relapse is possible. If an acute serious reaction occurs, urgent medical action may be needed rather than waiting for a routine review.',
'Side effects can also affect relationships and identity. A person might feel less interested in sex or have difficulty concentrating. These effects deserve a discussion that respects privacy and consent. The aim is not to force someone to tolerate an unacceptable cost because other people like the outcome.',
'Good decision-making requires a clear account of what has changed and what the medicine is intended to do. The person should know how to seek help and when urgent symptoms require immediate care. Treatment success involves both effectiveness and tolerability.'
],
[
P('New symptoms after starting medicine',
'You may notice nausea or sleep changes after beginning treatment and wonder whether the drug is responsible. A clear timeline helps a clinician examine possible explanations.',
'Timing and symptom pattern are useful evidence but cannot establish causation alone.',
'What medicine or dose changed?|When did the symptom begin?|How severe is it?|What advice is already available?',
'I felt nauseated after a new prescription|My sleep changed after a dose increase|I became dizzy after starting treatment|I was unsure which symptom was a side effect',
'Record the dose and timing as prescribed.|Note when symptoms occur without excessive monitoring.|Read the official patient information leaflet.|Avoid changing the dose without advice.|Seek urgent care for serious reaction warning signs.',
'Ask a pharmacist about common and serious effects.|Contact the prescriber for a tolerability review.|Request advice on monitoring when appropriate.|Ask which symptoms warrant urgent help.|Discuss possible interactions with other medicines.'
),
P('Benefits versus unwanted effects',
'The medicine may improve the problem it was prescribed for while creating another difficulty. You can discuss both outcomes without treating the decision as all or nothing.',
'Effectiveness and tolerability should be considered together with the person’s priorities.',
'What benefit has occurred?|Which effect is hardest to tolerate?|What alternatives exist?|What matters most to daily life?',
'My medication improved focus but reduced appetite|Pain relief made me excessively sleepy|A treatment helped mood but affected sex|I felt pressured to continue despite distress',
'Write down both benefits and unwanted effects.|Identify which change affects daily functioning most.|Prepare questions about alternatives.|Avoid making abrupt changes on your own.|Consider whether timing or monitoring needs review by a clinician.',
'Ask the prescriber about appropriate alternatives.|Request a discussion of dose-related risks and benefits.|Seek a specialist review for complicated treatment.|Ask a pharmacist about medicine interactions.|Discuss private effects such as sexual changes in a confidential appointment.'
),
P('Fear of stopping or changing',
'You may worry that raising side effects will lead to losing access to useful treatment. That fear can discourage important disclosure.',
'Treatment decisions need collaborative discussion and an explanation of withdrawal or relapse risks.',
'What are you afraid will happen if you report it?|What information would help?|Is a change time-sensitive?|What support will be available?',
'I hid side effects to avoid losing my prescription|I feared withdrawal symptoms|I worried the clinician would dismiss me|I considered stopping the medicine suddenly',
'Describe the effect before discussing a treatment change.|Ask for clear information about any tapering needs.|Keep a list of current medicines and doses.|Seek prompt advice for concerning symptoms.|Avoid stopping treatment suddenly without qualified guidance.',
'Ask for a shared treatment review.|Request a written change plan if one is agreed.|Seek advice from a pharmacist before mixing treatments.|Ask how relapse or withdrawal will be monitored.|Request another clinical opinion if concerns remain unexplained.'
),
P('Privacy and daily-life impact',
'Some effects concern appetite or sexual function, and you may feel embarrassed raising them. They remain relevant to whether the treatment suits you.',
'Patient experience includes effects that are not visible during a brief consultation.',
'Which daily activity changed?|What would you want to remain confidential?|How has the effect influenced relationships?|What outcome would make treatment acceptable?',
'I felt ashamed mentioning sexual side effects|I struggled to work because of sedation|A friend said the side effects were worth it|I wanted private advice about a medication concern',
'Write the concern in advance if speaking is difficult.|Choose a confidential appointment format.|Explain the effect on a specific activity.|Keep treatment choices separate from others’ preferences.|Request a follow-up after any agreed change.',
'Ask for confidential discussion with the prescriber.|Seek accessible medicine information.|Discuss impairment affecting driving or machinery safety.|Request occupational advice when sedation affects work.|Ask for review if an effect persists or worsens.'
)
],
'Serious allergic reactions, dangerous breathing symptoms, collapse or other acute reactions require emergency assessment. Do not stop or alter prescribed medicines suddenly without qualified advice where this carries withdrawal or relapse risk. Always report suspected adverse effects to a clinician or pharmacist.',
['medicines','health']
]
];
