/* Disability and chronic health: access, credibility and adaptation. */
const part=s=>s.split('|').map(x=>x.trim());
const P=(name,detail,insight,questions,scenes,actions,support)=>[name,detail,insight,part(questions),part(scenes),part(actions),part(support)];
export const ACCESS_DISABILITY_1=[
[
'ableism',
'Being treated as inconvenient because you need access can make you hesitate before asking for anything at all. The problem may be an inaccessible rule or another person’s decision. It should not be turned into a lesson about your attitude.',
'When disability becomes something other people judge',
[
'Ableism involves assumptions, practices or structures that disadvantage disabled people. It can be overt, such as mockery of a mobility aid, or built into ordinary processes that leave no accessible way to participate. Understanding the difference helps identify who can change what happened.',
'People may assume what a disabled person can or cannot do without asking. Someone might speak to a companion instead of addressing the patient. That behaviour removes agency even when the speaker believes they are helping. Respectful support begins by asking the person directly about their preferences.',
'Some settings praise disabled people for overcoming barriers while refusing to change those barriers. Being described as inspiring can be uncomfortable when what you needed was a ramp or flexible schedule. Access is a practical obligation, not a reward for exceptional perseverance.',
'Confronting discrimination may carry risks. A person may depend on the organisation for care or work. A careful plan considers relevant law and procedural deadlines. Where there is an actual threat, protecting safety takes priority over explaining to the offender why their behaviour was wrong.',
'Repeated ableism can also become internalised. You may catch yourself calling an accommodation unfair or feeling ashamed of a device you need. That shame deserves understanding, but self-compassion cannot substitute for an organisation removing the actual obstacle.',
'You can decide how much energy to spend challenging a particular incident. A complaint may be appropriate, or a trusted advocate may take some of the work. The goal is meaningful participation and respect, not an endless requirement to educate every person who treats you unfairly.'
],
[
P('Direct disrespect',
'Someone may mock a device or speak about you as though you were absent. That is their conduct, and your response can depend on what is safe and worth your time.',
'Overt ableist treatment needs accountability rather than an explanation that relocates the harm inside the person affected.',
'What did they say or do?|Who witnessed it?|Would correction be safe?|What outcome do you want?',
'Someone laughed at my mobility aid|A staff member spoke only to my companion|I was called inspirational for using a ramp|A stranger questioned whether I was really disabled',
'Describe the specific behaviour if choosing to report it.|Decline intrusive personal questions.|Keep a brief record of repeated incidents.|Choose distance over confrontation with an unsafe stranger.|Tell someone which response you would find supportive.',
'Ask a manager to address repeated disrespect.|Seek an advocate when staff overlook your voice.|Request information about a complaint process.|Ask an ally to intervene without speaking for you.|Seek independent equality advice if access is affected.'
),
P('Inaccessible policies',
'A rule can appear consistent and still shut you out. For example, an appointment may only be available in a location that cannot be reached with your mobility needs.',
'Institutional decisions can create barriers that the person cannot remove through greater effort.',
'What rule blocked participation?|Who has the authority to change it?|What alternative meets the same purpose?|How will the response be reviewed?',
'I could not enter a venue with stairs|A service refused an accessible appointment|A job required an unnecessary physical task|I was denied a reasonable break',
'Identify the rule and its practical effect.|Request an accessible alternative in writing.|Keep records of the original decision.|Check relevant deadlines before pursuing a complaint.|Review whether the offered adjustment actually works.',
'Ask a service for its accessibility contact.|Seek a union or student representative where relevant.|Request reasons for a refusal.|Find an equality adviser familiar with the applicable law.|Ask a manager to confirm when an agreed change will happen.'
),
P('Being spoken for',
'Someone may direct decisions to a caregiver or partner despite your ability and wish to participate. The difficulty involves who is being allowed to make the choice.',
'Accessibility support should strengthen autonomy instead of replacing it.',
'Who is making the decision?|Were you addressed directly?|What communication support would help?|Who should receive personal information?',
'A doctor asked my partner instead of me|A carer answered every question for me|Someone moved my wheelchair without asking|I was excluded from a meeting about my support',
'State how you prefer to communicate.|Ask staff to address you directly.|Clarify consent before anyone moves equipment.|Choose whether another person joins an appointment.|Request a written account of decisions that affect you.',
'Ask for an independent advocate when needed.|Request communication adjustments in healthcare.|Tell a support worker how you want assistance offered.|Seek a care-plan review that includes your choices.|Ask a provider to correct an inaccurate record of your wishes.'
),
P('Shame after repeated barriers',
'After many refusals, you may begin anticipating that a request is unreasonable. It can be exhausting to seek the same access repeatedly.',
'Internalised shame may follow exclusion; removing the actual barrier remains essential.',
'Which request felt shameful?|Who taught you to expect refusal?|What access is needed now?|Can somebody share the burden of requesting it?',
'I apologised for needing a seat|I hesitated to ask for accessible transport|I felt embarrassed using an assistance device|I stopped attending a venue after repeated refusals',
'Describe the required adjustment without self-insults.|Keep an example of an access arrangement that worked.|Plan recovery after a demanding complaint process.|Choose which disputes justify your energy.|Let a trusted person help with administrative work.',
'Seek peer support from disabled people with similar access needs.|Ask an advocate to help communicate a repeated request.|Consider counselling for shame linked to discrimination.|Find an independent accessibility adviser.|Ask a venue what concrete change would allow future attendance.'
)
],
'Threats, harassment and denial of essential care or access can require urgent safeguarding or legal support. Rights and complaint procedures depend on jurisdiction. Do not put housing, care or safety at risk solely to confront a discriminatory person.',
['access','equality']
],
[
'invisible-disability',
'It is tiring to be asked for proof every time you need to sit down or leave early. A disability does not become less real when somebody cannot see it, and you should not have to reveal private medical details to satisfy a stranger.',
'When people judge the part of your disability they cannot see',
[
'Many disabilities are not obvious from appearance. Pain, cognitive fatigue and other difficulties can fluctuate without leaving a visible sign. People may assume that walking into a shop or smiling during an appointment means every other activity is manageable.',
'A short moment of ability says little about the cost. Someone may be able to stand briefly and still need a seat for the rest of a journey. The question is whether the environment provides practical access rather than whether strangers find the explanation convincing.',
'The pressure to prove disability can lead people to overexert themselves. A person might remain standing to avoid judgement or continue an activity after pain increases. That can worsen symptoms and make the following day harder. A safe adjustment should not depend on displaying the maximum level of distress.',
'Disclosure is complicated when an employer or service requests information. Some details may be needed to arrange support, while unrelated aspects of medical history remain private. You can ask what is necessary and how the information will be handled.',
'Invisible disability can affect relationships too. Friends may assume a cancelled plan means disinterest because they saw you out yesterday. It may help to explain fluctuating capacity without offering a daily audit of your symptoms. Respectful people can accept uncertainty about exactly how you feel.',
'The goal is not to become more visibly impaired. It is to have reliable access to an environment that accounts for real needs. Support can include flexible arrangements and people who take your account seriously before you reach exhaustion.'
],
[
P('Being challenged in public',
'Someone may question why you use a priority seat or accessible service. The interaction can be frightening because it makes you defend private needs in front of other people.',
'A stranger’s expectations about visible disability are not evidence about actual access requirements.',
'What were you asked to prove?|Was the encounter safe?|What access did you need?|Who could intervene appropriately?',
'Someone told me to give up a priority seat|A stranger challenged my disabled parking permit|I was questioned for using a lift|A passenger said I looked healthy',
'Choose a short response or no response at all.|Move away from threatening people when possible.|Use any access documentation only if you wish and it is relevant.|Record harassment when safe.|Prioritise the actual support you need over convincing a stranger.',
'Ask transport staff to support use of priority seating.|Report repeated harassment to the venue.|Seek guidance about accessible travel rights.|Find a companion for a difficult journey if helpful.|Ask an advocacy group about responding to public challenges.'
),
P('Variable capacity',
'You may be able to do something once and struggle the next day. Others can mistake that variation for inconsistency or exaggeration.',
'Symptoms and energy may fluctuate; capacity on one occasion cannot set a permanent standard.',
'How does your ability vary?|What tends to precede a worse day?|What recovery do you need?|Which commitments can be flexible?',
'I walked yesterday but needed a chair today|I cancelled plans after appearing well at work|A good morning was followed by severe fatigue|I was accused of exaggerating a flare',
'Plan commitments using realistic capacity rather than a best day.|Describe specific limitations instead of defending their legitimacy.|Leave time for recovery after necessary activity.|Keep a brief pattern record if useful for care.|Avoid pushing through symptoms solely to appear consistent.',
'Ask for flexible scheduling where feasible.|Tell friends that capacity can change without advance warning.|Discuss new or worsening symptoms with a clinician.|Request an access arrangement that works on worse days.|Seek support for energy management where appropriate.'
),
P('Privacy and disclosure',
'An organisation may need to understand a functional requirement without receiving every medical detail. The balance depends on the request and applicable rules.',
'Appropriate adjustments can often be discussed through the barrier and what would address it.',
'Who needs information?|What purpose would disclosure serve?|Which details remain private?|Could an advocate help with the request?',
'My employer demanded a detailed diagnosis explanation|I needed rest breaks without discussing symptoms|I worried a friend would share my medical history|I hesitated to request an accommodation',
'Describe the functional barrier in plain language.|Ask how disclosed information will be stored.|Share only what is needed for the particular decision.|Keep copies of formal adjustment requests.|Review privacy options before sending medical records.',
'Ask HR or disability support about confidential processes.|Seek independent advice on disclosure requirements.|Request a written agreement about adjustments.|Ask a clinician for a relevant functional report when appropriate.|Find support if private information was shared without consent.'
),
P('Being believed by close people',
'A relative may think that because you participated once, you should be able to repeat it. Explaining the cost can help where the relationship is receptive, although nobody can be made to believe you.',
'The ability to participate depends on current health and conditions, not on a single observed performance.',
'What does the person assume?|What happened afterward?|Which help would make a difference?|What boundary is needed if disbelief continues?',
'A friend doubted my fatigue because I looked cheerful|A partner said I managed last week|I avoided telling family about pain|Someone listened and changed our plans',
'Explain one concrete effect of a flare when you choose.|Stop debating symptoms with someone who continually mocks you.|Agree on alternative plans for lower-capacity days.|Keep care decisions with the appropriate professionals.|Invest in relationships that respect your limits.',
'Ask someone close to learn how capacity fluctuates.|Seek a supportive peer community.|Consider joint planning with a willing partner.|Discuss the burden of disbelief with a clinician.|Ask friends to include an accessible option when planning gatherings.'
)
],
'Invisible disabilities require the same respect for access and privacy as visible disabilities. New symptoms or serious deterioration deserve medical assessment. Do not exceed physical limits to prove a condition to others.',
['access','equality']
],
[
'chronic-illness-identity',
'Illness can change a daily life that once felt ordinary. You may miss who you were before symptoms began, even as you work hard to build a worthwhile life in the circumstances you have now.',
'Finding a sense of self when illness changes what is possible',
[
'A chronic illness can alter routines and expectations in ways other people rarely see. Someone may need to give up a familiar work pattern or adapt a social activity they loved. These changes can affect identity because ordinary roles often carry memories of competence and belonging.',
'Grief about lost ability is not a failure to accept reality. You might miss travelling spontaneously or being able to make plans without considering fatigue. The loss deserves acknowledgement even when your illness is stable or other people consider you fortunate.',
'People may encourage a positive attitude because they want to help. That can feel dismissive when you are trying to explain a practical limitation. Optimism cannot replace appropriate treatment or accessible environments. Support is more useful when it asks what you want to preserve and what has genuinely changed.',
'Some days you may feel close to your previous self; on others you need considerable help. That variation can make it difficult to form a consistent story about who you are. Identity need not depend on being able to perform the same role every day.',
'Relationships may shift as well. A person who once organised gatherings may now need somebody else to choose an accessible venue. You can ask for that help and still contribute to the relationship. Autonomy includes deciding how support is offered.',
'You may find new interests or adjust familiar ones. Such changes are possibilities, not obligations to find inspiration in illness. A meaningful future can include sadness about what happened alongside continued participation in things you care about.'
],
[
P('Grieving a former life',
'You may miss the ease of ordinary activities and feel sad when other people assume you should have moved on. There may be no single event marking the loss.',
'Changes in capacity can produce ongoing grief that deserves recognition rather than compulsory positivity.',
'What part of the old routine do you miss?|Which change feels most painful?|What still matters to you?|Would a modified version be meaningful?',
'I missed being able to travel spontaneously|I cried after selling sports equipment|I felt angry watching others do what I used to|I grieved a work role I could no longer perform',
'Name the specific activity or role you miss.|Allow grief without judging it as ingratitude.|Consider an accessible form of a familiar interest.|Keep memories of earlier capacity without comparing every day.|Choose when to discuss losses with others.',
'Talk with a trusted person who can listen without forced reassurance.|Seek adjustment-focused counselling if grief is persistent.|Ask a rehabilitation professional about valued activity adaptations.|Find peer support for your condition if desired.|Discuss practical barriers to reconnecting with old interests.'
),
P('Roles and relationships changing',
'An illness may shift the tasks you do within a family or friendship. Asking for help can feel especially difficult if you were previously the person others depended on.',
'Care roles are negotiable and can change without erasing a person’s contribution to relationships.',
'Which responsibility has changed?|Who currently carries the work?|What form of contribution still fits?|How can support preserve choice?',
'I needed help with errands I once did alone|My partner took over more household tasks|I stopped organising group outings|I felt guilty needing transport',
'List responsibilities that could be shared.|Choose one manageable contribution if you want one.|Explain the support you need before a difficult event.|Avoid accepting a role that worsens symptoms.|Review arrangements when capacity changes.',
'Ask relatives to agree on specific shared tasks.|Request accessible transport for recurring activities.|Seek social care assessment where needs justify it.|Discuss relationship strain with a supportive clinician.|Ask friends to offer plans that do not rely on your organising everything.'
),
P('Identity beyond symptoms',
'You may feel that every conversation has become a health update. It can help to protect relationships and interests that are not organised around illness.',
'Personal identity includes preferences and relationships that remain meaningful even when function changes.',
'When do you feel most like yourself?|Which conversations are not about illness?|What activity can you choose freely?|Who respects both your needs and interests?',
'Every conversation seemed to be about my symptoms|I wanted to be known for my interests again|I felt uncomfortable being called inspiring|I rediscovered an enjoyable hobby',
'Choose when to discuss health details.|Make time for an accessible activity you value.|Keep an interest that does not need to be productive.|Set boundaries around unsolicited treatment advice.|Allow your self-description to evolve.',
'Ask friends about shared activities rather than only health updates.|Seek a community group based on a nonmedical interest.|Discuss identity loss in therapy if useful.|Request accessible participation in an old hobby.|Find a peer who understands living with chronic illness.'
),
P('Uncertain future',
'Not knowing how symptoms will change can make planning difficult. You may hesitate to make commitments or imagine that everything you value will disappear.',
'Uncertainty about illness requires accurate medical information and adaptable plans rather than absolute predictions.',
'What is known about your condition?|Which part of the future is uncertain?|What plan could remain flexible?|What medical question needs clarification?',
'I worried I would never work again|I delayed making holiday plans|I feared a flare would ruin an important day|I could not picture my future after diagnosis',
'Separate confirmed prognosis from feared outcomes.|Choose reversible plans when capacity is uncertain.|Ask what can be done now without predicting every year.|Keep medical questions for a planned appointment.|Make space for hope without promising recovery.',
'Ask a clinician about realistic prognosis and follow-up.|Request occupational advice on returning to valued activities.|Discuss flexible travel or event arrangements.|Seek support for severe health-related anxiety.|Find practical financial advice if work capacity has changed.'
)
],
'Chronic illness identity work should not replace medical assessment or symptom management. New or severe symptoms need appropriate care. Pressure to recover or find meaning in illness can be harmful when it ignores real limitations.',
['health','access']
],
[
'medical-gaslighting',
'It can be difficult to seek help again after an appointment in which you felt dismissed. Perhaps your symptoms were attributed to stress before anyone explained what had actually been assessed. You deserve a clear account of the clinical reasoning.',
'When healthcare leaves you feeling unheard',
[
'People use medical gaslighting to describe encounters in which symptoms are dismissed or experiences are made to seem unreliable. The phrase covers a range of situations, from poor communication to bias or serious failures in care. It cannot establish a clinician’s intention or whether a diagnosis is wrong without reviewing the facts.',
'The power difference matters. You may be in pain and need the professional to understand what is happening. A rushed appointment can leave little room to describe symptoms, particularly when processing time or language access is needed. Clear summaries and direct questions can make the consultation more usable.',
'A professional may legitimately consider psychological contributors to symptoms. That possibility should be explained with evidence and appropriate investigation. The problem arises when uncertainty is presented as proof that the symptoms do not matter or when important warning signs are ignored.',
'After a dismissive encounter, you may worry about attending again. That avoidance is understandable, but untreated health problems can become more serious. A practical plan might involve another appointment, written questions or an advocate. The right next step depends on clinical urgency and the services available.',
'Medical records can help clarify what was considered. Sometimes a patient discovers that the clinician recorded a different version of what they said. Correcting factual inaccuracies is a specific and useful goal. Not every disagreement implies negligence, and you are entitled to ask for an explanation without proving that someone intended harm.',
'Confidence can be rebuilt through responsive care. A clinician who answers questions and explains uncertainty can make future decisions safer. The aim is not to win an argument about whether somebody believed you; it is to receive appropriate assessment and participate meaningfully in decisions.'
],
[
P('Symptoms dismissed prematurely',
'You described a symptom and were told it was anxiety or harmless without understanding what assessment informed that conclusion. You may now doubt whether to raise it again.',
'Clinical explanations need evidence and relevant safety assessment; distress does not invalidate physical symptoms.',
'What symptom was reported?|What examination or tests occurred?|What explanation was given?|Which warning signs remain?',
'I was told my pain was just stress|My dizziness was dismissed without explanation|A clinician interrupted before I finished|I left without knowing when to return',
'Write a concise chronology of the symptoms.|Ask which diagnoses have been considered.|Seek urgent assessment for red-flag symptoms.|Request a clear safety-net plan.|Avoid changing treatment solely because an appointment felt dismissive.',
'Ask for a review with another appropriate clinician.|Request a written summary of the assessment.|Bring a support person with your consent.|Seek independent patient advocacy.|Ask for clarification of which symptoms warrant urgent follow-up.'
),
P('Communication and access failures',
'You may have been unable to explain what mattered because the appointment was too brief or inaccessible. That does not mean the symptoms were trivial.',
'Poor communication access can distort clinical information and weaken informed decision-making.',
'What could you not communicate?|Which format would have helped?|Were your questions answered?|How can the next appointment be made accessible?',
'The doctor spoke too quickly for me|I needed captions during a consultation|I was not given time to answer|A medical letter used terms I did not understand',
'Prepare two precise questions before the visit.|Request an accessible communication format.|Ask for a pause before answering complex questions.|Keep a written list of symptoms and timing.|Ask the clinician to explain unfamiliar terms.',
'Request an interpreter or communication aid when needed.|Ask for an extended appointment if appropriate.|Seek access under the NHS Accessible Information Standard where applicable.|Ask for written instructions after the visit.|Request assistance updating communication preferences in your records.'
),
P('Incorrect medical records',
'An inaccurate entry can affect later decisions, especially if other staff repeat it without asking you. Reviewing a record may be a practical way to address a specific concern.',
'Records are evidence of what was documented, and factual errors should be addressed through the appropriate process.',
'Which entry is inaccurate?|What document supports a correction?|Who can amend the record?|What future decision could be affected?',
'My record said I refused treatment when I had asked questions|A symptom was documented incorrectly|A letter omitted a concern I had raised|Another clinician relied on an inaccurate note',
'Identify the precise factual error.|Keep copies of relevant documents.|Request a correction through the provider’s process.|Separate errors from differences of clinical opinion.|Ask how disputed information will be flagged.',
'Contact the medical records team about corrections.|Seek patient advice services where available.|Ask a clinician to clarify a disputed judgement.|Request an updated summary for future care.|Seek independent advice when an error has serious consequences.'
),
P('Rebuilding trust safely',
'After dismissal, you might avoid services altogether or feel compelled to document every detail. A plan can protect important care without requiring constant vigilance.',
'Trust is strengthened by clear decisions, continuity and appropriate access rather than demanding uncritical confidence.',
'What care is currently needed?|Which professional could review it?|What would a safer appointment involve?|Which question needs an answer first?',
'I postponed seeking help after a bad appointment|I rehearsed every symptom before attending|I feared another doctor would dismiss me|I felt relieved when someone finally listened',
'Choose the next medically relevant appointment.|Bring a short factual symptom summary.|Avoid endless online searching for confirmation.|Decide whether another opinion would answer a concrete question.|Keep urgent health needs separate from complaint decisions.',
'Ask for continuity with a clinician you trust.|Seek an advocate for a high-stakes appointment.|Discuss healthcare-related anxiety with appropriate support.|Request a follow-up plan with named responsibilities.|Use an appropriate complaints process if serious conduct remains unresolved.'
)
],
'New or serious physical symptoms must be assessed appropriately and urgently when red flags occur. A negative test does not automatically establish that symptoms are psychological, while disagreement with clinical reasoning alone does not prove misconduct. Use appropriate patient advocacy and medical review.',
['access','health']
],
[
'diagnostic-delay',
'Waiting for a diagnosis can mean living with symptoms while important decisions remain unresolved. You might be asked to be patient by someone who does not have to manage the consequences of the delay.',
'When the waiting affects the life you are trying to live',
[
'Diagnostic delay can have several causes. A condition may be difficult to recognise or require multiple investigations. There may also be referral bottlenecks and access barriers. Understanding which stage is delayed helps identify who can answer a useful question.',
'The waiting can make ordinary plans uncertain. You may not know whether to work fewer hours or what support you can request. A provisional plan based on current symptoms can help without pretending that a diagnosis is already established.',
'Repeated internet searches may give you an impression of control. Some information is useful for preparing clinical questions; too much can become distressing and introduce inaccurate assumptions. A short symptom history and a clear account of functional effects usually make a better starting point for a consultation.',
'If results conflict, ask what each test was intended to assess. A normal result can rule out one possibility without explaining every symptom. The clinician should be able to describe what remains uncertain and what would warrant further investigation.',
'Practical support should not always wait for a label. Someone may need mobility access or help managing fatigue regardless of the final diagnosis. The availability of accommodations or benefits varies, so it is worth checking the actual eligibility rules rather than assuming no options exist.',
'Some people experience grief or anger during a long search for answers. Those feelings can coexist with careful decision-making. A useful next step is one that preserves health and access now while ensuring important clinical questions are not lost in the process.'
],
[
P('Waiting for an investigation',
'You may know a referral was made but have no information about scheduling. The absence of updates can become another source of strain.',
'Administrative uncertainty requires reliable process information rather than constant checking of symptoms.',
'What investigation was ordered?|When was the referral made?|What worsening would require earlier care?|Who can give an accurate update?',
'I waited months for a scan appointment|A referral appeared to be missing|I did not know when I would hear results|My symptoms changed while I waited',
'Keep dated copies of referrals and letters.|Check that your contact details are correct.|Ask when to expect an update rather than checking constantly.|Record significant symptom changes succinctly.|Seek urgent review for red flags during the wait.',
'Contact the referral service for confirmation.|Ask a GP how symptoms should be managed meanwhile.|Request accessible appointment arrangements.|Ask what to do if symptoms worsen.|Seek patient advice support for unresolved administrative delays.'
),
P('Unclear or contradictory results',
'You may receive one normal test and still experience substantial symptoms. Without explanation, it is easy to feel that the result invalidates what you are living with.',
'Tests answer particular questions and should not be treated as total judgements about health.',
'What was the test assessing?|What did the result actually rule out?|What symptoms remain?|Which next question is appropriate?',
'My test was normal but I remained unwell|Two clinicians gave different explanations|A letter used unclear medical language|I did not know whether further investigation was planned',
'Write down what each investigation was for.|Ask for a plain-language explanation of results.|Keep track of symptoms that remain unexplained.|Avoid assuming a normal result proves nothing is wrong.|Request clarification before repeating unnecessary testing.',
'Ask a clinician which alternatives remain under consideration.|Request a clear follow-up plan.|Seek a relevant specialist opinion when justified.|Ask for accessible information about test limitations.|Bring a trusted person to an explanation appointment if wanted.'
),
P('Managing life without a label',
'You may need changes to work or travel before a formal diagnosis exists. The practical limitation is real even if its cause remains uncertain.',
'Function-based support can be important while diagnostic clarification proceeds.',
'What activity is most affected?|What adjustment would help now?|Does eligibility depend on a diagnosis?|Which symptom needs active treatment?',
'I could not manage full shifts while waiting|I needed transport access before diagnosis|A manager asked for a medical label|I delayed asking for help because tests were unfinished',
'Describe functional effects rather than claiming a diagnosis.|Seek adjustments based on actual barriers.|Use a realistic activity plan while symptoms are investigated.|Keep essential health needs on the calendar.|Check eligibility criteria before assuming support is unavailable.',
'Ask an occupational health professional about interim adjustments.|Seek welfare advice for function-based entitlements.|Discuss symptom relief with the responsible clinician.|Request temporary flexibility in education.|Find an advocate when access is refused solely because a label is pending.'
),
P('Distress and uncertainty',
'The search can take over your day when every bodily change feels like a new clue. You may also feel angry about the opportunities already lost during waiting.',
'Uncertainty and delayed care can cause distress without establishing that symptoms are psychological.',
'When does worry peak?|What information would actually help?|Which search has become repetitive?|How can you preserve daily life during the wait?',
'I checked health forums every night|I feared an undiagnosed serious illness|I felt angry about missed appointments|I stopped making plans until I had an answer',
'Choose limited times to review official updates.|Keep a factual list of questions for the next appointment.|Avoid repeatedly testing yourself with unvalidated tools.|Make reversible plans when possible.|Seek appropriate psychological support if uncertainty is overwhelming.',
'Ask for clear safety-net instructions.|Discuss distress with a clinician without abandoning physical investigation.|Request a named contact for pending results.|Seek support with a delayed complaint if a process failed.|Ask a trusted person to help organise correspondence.'
)
],
'Red-flag or rapidly worsening symptoms need timely medical assessment, regardless of a waiting list. A delayed diagnosis should not be treated as proof of any particular illness. Do not stop prescribed treatment or undertake risky self-treatment while waiting.',
['health','access']
]
];
