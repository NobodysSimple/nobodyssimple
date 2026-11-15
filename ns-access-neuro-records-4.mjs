/* Communication, recognition, diagnosis, discrimination and access. */
const part=s=>s.split('|').map(x=>x.trim());
const P=(name,detail,insight,questions,scenes,actions,support)=>[name,detail,insight,part(questions),part(scenes),part(actions),part(support)];
export const ACCESS_NEURO_4=[
[
'neurodivergent-communication',
'You can leave a conversation knowing exactly what you meant and feeling that the other person heard something else. Repeated misunderstandings are tiring when you are always the one expected to change your communication.',
'When two communication styles fail to meet',
[
'Communication differences can involve directness, timing and nonverbal expectations. An autistic person may prefer explicit language, while someone else expects hints to carry important meaning. The resulting misunderstanding belongs to the interaction. It does not by itself show that either person lacks empathy or interest.',
'Some people need more processing time before replying. A rapid-fire conversation can make the person appear withdrawn when they are working out an answer. Providing the question in writing or allowing a pause may reveal far more understanding than demanding an instant response.',
'Social rules are often treated as universal even when they vary across relationships and cultures. A direct correction can be heard as an insult. A hesitant reply can be read as agreement. It helps to state expectations rather than ask everyone to infer a single hidden rule.',
'When communication goes wrong repeatedly, people may begin avoiding conversations. The cost can include missed opportunities for friendship or work. Supportive relationships make room for repair and do not require one person to carry every adjustment. Misunderstandings are possible even when everyone is trying.',
'Communication access also matters in services. A medical professional who only accepts spoken answers may miss information from somebody who communicates better by text. The relevant need can be an accessible format, predictable questions or more time, not an assumption that the person cannot decide.',
'You can develop ways to explain your preferences without presenting them as defects. You may also choose to learn how another person communicates when that relationship matters. Successful communication should increase mutual understanding and choice, not reward someone for suppressing their natural style.'
],
[
P('Directness misread as rudeness',
'You say what you mean and someone hears criticism or hostility that you did not intend. The same interaction can leave both people confused about why it became difficult.',
'Different expectations about direct speech can create misinterpretation without proving an intention to offend.',
'What exact words caused the confusion?|What did you intend?|What expectation did the other person have?|How could the point be clarified?',
'I answered a question directly and someone took offence|A colleague called my feedback blunt|I corrected a factual error and upset a friend|Someone assumed I was angry because my voice was flat',
'Clarify the point you intended to make.|Ask which part of your wording was difficult to hear.|Describe your preference for direct communication.|Choose whether an optional social convention is worth using.|Avoid apologising for an intention you did not have while acknowledging impact.',
'Ask colleagues to give direct examples when feedback is unclear.|Discuss communication preferences with a close friend.|Request written expectations for important conversations.|Seek mediation for persistent misunderstandings in a safe relationship.|Ask staff to avoid assuming emotion from tone alone.'
),
P('Processing and response time',
'You may need a longer pause or a written question to give the answer you actually have. People sometimes fill the silence before you have decided how to respond.',
'Processing time and access formats can affect performance independently of knowledge.',
'When do you need more time?|What happens if someone interrupts the pause?|Would writing help?|How can the conversation allow for that?',
'I knew the answer but needed a pause|Someone spoke over me while I was thinking|I could explain better in writing|I froze when several questions arrived together',
'Ask for a moment to think before answering.|Use a written response when permitted.|Request one question at a time.|Make a note of the answer before a high-stakes meeting.|Tell someone when their prompting makes processing harder.',
'Ask a meeting chair to allow pauses before replies.|Request questions in advance when appropriate.|Seek accessible communication arrangements in healthcare.|Ask colleagues not to finish your sentences.|Arrange additional processing time in learning assessments where justified.'
),
P('Ambiguous social expectations',
'A hint or indirect request can leave you guessing whether someone wants action or merely conversation. The uncertainty may take more attention than the actual task.',
'Making implicit rules explicit can prevent unnecessary cognitive and social demands.',
'Which expectation was left unstated?|What would an explicit request sound like?|How did you respond to uncertainty?|Is clarification possible now?',
'Someone said “you know what to do” and I did not|I mistook a hint for a casual comment|I could not tell whether an invitation was genuine|A friend expected me to guess why they were upset',
'Ask what action is actually being requested.|Confirm plans in a short written message.|Use concrete questions instead of guessing a hidden meaning.|Agree that important requests should be explicit.|Allow another person to explain their expectation without assigning motives.',
'Ask a manager for specific instructions.|Request an agenda before an unfamiliar meeting.|Discuss how each partner expresses a request.|Seek communication support when recurring ambiguities affect access.|Ask organisers to explain rules that new participants are expected to know.'
),
P('Repairing misunderstandings',
'It can hurt to be told you do not care when the problem involved how the conversation was understood. Repair is more possible when both people can describe what they observed.',
'A workable repair focuses on the interaction and its consequences without assigning total responsibility to one style.',
'What did each person hear?|Was there a concrete harm to repair?|What would help next time?|Is the other person willing to adapt too?',
'I was accused of ignoring someone’s feelings|A disagreement grew from a misunderstanding|My friend apologised after hearing my explanation|I avoided talking because I expected another conflict',
'Restate the message in simpler words if helpful.|Ask for the other person’s understanding of what you said.|Apologise for a specific unintended harm without denigrating yourself.|Take a pause when the discussion becomes overwhelming.|Notice when someone refuses reasonable mutual adjustment.',
'Ask a trusted person to help establish respectful communication agreements.|Consider relational counselling with neurodivergence-informed approaches.|Request that others respect text-based communication.|Seek support if recurrent misunderstandings include bullying.|Find communities where communication preferences are accepted.'
)
],
'New changes in speech, understanding or consciousness require medical assessment. Neurodivergent communication differences should not be used to dismiss someone's consent or decision-making ability. Communication adjustments must respect individual preference.',
['autism','access']
],
[
'late-neurodivergence-discovery',
'You may look back at years of effort and realise that there was another way to understand it. That discovery can bring relief while also making you sad about how much you struggled without support.',
'Finding a new explanation for a life you have already lived',
[
'Late recognition of neurodivergence can change the meaning of earlier experiences. A person might revisit school reports and notice that their difficulties were described as disorganisation or shyness. The new perspective may fit well, yet it cannot tell you everything about what those adults understood or why help was missed.',
'Relief often sits beside regret. You may wonder how life would have looked with better support. That question is understandable, especially when opportunities were lost. It is difficult to answer definitively because other circumstances would have remained part of your life.',
'Some people become eager to identify every trait and memory. Exploration may be interesting, but repeatedly searching for certainty can leave little room for everyday needs. You can take a useful accommodation seriously without proving that a particular diagnosis explains every event you remember.',
'Relationships may be affected. Family members might question the possibility because they remember you managing well. They may have observed your outward achievements without seeing the cost. A discussion can focus on specific experiences rather than demanding that everyone immediately accept your interpretation.',
'An assessment can be valuable when diagnostic clarity affects care or adjustments. It may also involve costs and waiting. You can consider its likely practical purpose before making a decision. Formal status does not determine whether you are allowed to learn about your communication or sensory needs.',
'Identity is allowed to develop after recognition. You may connect with people whose experiences resonate and still differ from them in important ways. There is no fixed timetable for disclosure or for changing habits. Understanding yourself can be an ongoing process rather than a sudden transformation.'
],
[
P('Relief and grief together',
'You may feel seen by a description and then grieve how much you blamed yourself. These reactions can coexist without requiring you to decide whether the past was entirely harmful.',
'New understanding may alter the meaning of earlier struggles while leaving parts of the history uncertain.',
'Which past experience looks different now?|What did you need at that time?|What loss feels most important?|What support could help you in the present?',
'I cried after reading an autistic adult’s story|I remembered being called lazy at school|I felt angry about missed support|I felt relief that my experiences had a name',
'Write about one past event without rewriting your entire history.|Name the support that might have changed its practical outcome.|Give grief room without insisting on a positive conclusion.|Keep recognition separate from diagnosing every family member.|Choose one present need worth addressing now.',
'Discuss complicated feelings with a trusted person.|Consider an affirming counsellor if regret is disrupting daily life.|Seek peer accounts with varied late-discovery experiences.|Ask a relative about specific memories rather than demanding agreement.|Find out about adjustments available now.'
),
P('Questioning old explanations',
'Descriptions you accepted about yourself may no longer feel accurate. You can examine them carefully without having to reject every past achievement or relationship.',
'An identity explanation is useful when it connects to observable needs; certainty about every old motive is rarely possible.',
'Which old label now feels unfair?|What evidence supports a different account?|Which parts remain uncertain?|How would the new understanding change your next choice?',
'I wondered if my shyness was sensory overwhelm|I reread a school report after years|I questioned being called disorganised|I worried I was imagining the connection',
'Keep specific examples rather than broad self-judgements.|Avoid treating a trait checklist as final proof.|Compare how difficulties appear across contexts.|Allow an explanation to remain provisional.|Focus on current accommodations rather than solving every memory.',
'Ask a qualified assessor about the relevant developmental history.|Seek records only if accessing them feels worthwhile.|Discuss uncertainty with a clinician who can consider differential diagnoses.|Find credible information about neurodevelopmental conditions.|Ask for feedback that relates to present functioning.'
),
P('Family reactions and disclosure',
'People close to you may find the new possibility surprising. They may remember you succeeding and overlook how hard the process was.',
'Other people's recollections can add context but should not erase your private experiences or autonomy.',
'Who would benefit from knowing?|What do you hope they understand?|How might disclosure affect safety or privacy?|What could you say without debating your whole identity?',
'A parent said I was normal as a child|A partner questioned why I needed adjustments now|I did not know whether to tell my employer|A friend listened without demanding proof',
'Choose which people to tell and when.|Use one concrete example to explain an access need.|Avoid arguments based entirely on stereotypes.|Keep private diagnostic information within chosen boundaries.|Notice whether a relationship allows honest discussion.',
'Ask a trusted relative to describe developmental history if you consent.|Seek advice on confidential workplace adjustment requests.|Find a supportive peer for the disclosure decision.|Ask a clinician to explain an assessment outcome if desired.|Set a boundary around repeated invalidating questions.'
),
P('Finding a sustainable next step',
'After recognition you may want to overhaul your routines at once. A better approach can be to test one change that makes daily life easier.',
'The value of a new explanation lies partly in practical fit, not the quantity of information collected.',
'Which current demand is most costly?|What adjustment is available?|How will you know it helps?|What question could wait until later?',
'I bought several organisers after learning about ADHD|I wanted to change my entire social life|I asked for a quiet workspace|I felt overwhelmed by online advice',
'Choose one accommodation to test for a week.|Keep existing routines that already work.|Take breaks from continuous neurodivergence content.|Prioritise an assessment if it has a concrete purpose.|Review a change based on its actual effect.',
'Ask a support service about reasonable adjustments.|Discuss assessment pathways with a GP.|Find a peer group that does not demand a fixed identity.|Seek psychological help for unresolved shame.|Request written information about available support.'
)
],
'Self-recognition is meaningful but not sufficient to diagnose a neurodevelopmental condition. Assessment should consider developmental history, coexisting conditions and alternative explanations. Disclosure is a personal choice with real privacy considerations.',
['autism','adhd','access']
],
[
'diagnostic-uncertainty-neuro',
'You may have spent years trying to understand why certain things are difficult, only to discover that the assessment process has its own barriers. Uncertainty about diagnosis should not prevent you from taking everyday needs seriously.',
'Waiting for clarity while life continues',
[
'Neurodevelopmental assessment involves more than matching a checklist. Clinicians consider developmental history and functioning, sometimes with information from other people if it is available and appropriate. Similar difficulties can arise from different conditions, which is why an accurate assessment may take time.',
'Waiting can be frustrating when you need help now. A person may repeatedly read descriptions and question whether they are “autistic enough” or have a sufficiently severe form of ADHD. That search can become another task with no clear stopping point. A practical adjustment may still be worthwhile before diagnostic certainty.',
'Access barriers matter. Someone may face long waiting lists or appointment formats they cannot comfortably manage. Another person may struggle to provide childhood records. These circumstances can complicate an assessment without proving that their difficulties are less real.',
'A result may be unexpected or inconclusive. You are entitled to ask what information informed the conclusion and whether any questions remain. Being dissatisfied with an answer does not automatically mean it is wrong, and a clinician should still explain their reasoning respectfully.',
'Self-identification can offer community and language for experience, but medical treatment and certain entitlements may require formal clinical processes. It helps to keep these purposes distinct. A label should guide useful questions rather than determine your personal worth.',
'The most useful next step may be clarifying why you want an assessment. Perhaps medication is being considered, or you want to understand lifelong difficulties. Knowing that purpose can help you choose appropriate professional support and avoid exhausting yourself searching for a perfect internet answer.'
],
[
P('Waiting for an appointment',
'You may have been referred and received little information about the next step. The waiting can feel especially hard when an assessment seems necessary for support.',
'Administrative delay is an access problem; repeated symptom searching cannot substitute for reliable process information.',
'What referral has been made?|Which date is confirmed?|What help is needed during the wait?|Who can clarify the current process?',
'I had no update months after referral|I could not find the assessment waiting time|I worried my referral was missing|I needed an adjustment before diagnosis',
'Keep a single note of referral dates and correspondence.|Request confirmation that a referral was received.|Identify current functional needs independently of diagnosis.|Limit repetitive searching that supplies no new information.|Plan one feasible support request during the wait.',
'Ask the referral service about its current process.|Discuss interim support with your GP.|Request accessibility adjustments for appointments.|Ask what records would be useful without collecting irrelevant documents.|Seek appropriate mental health care for distress during waiting.'
),
P('Confusing traits and overlapping conditions',
'You recognise some experiences and not others. Online descriptions can make this seem like proof for or against a label, even though clinicians examine a broader picture.',
'Shared difficulties do not establish one diagnosis, and traits can vary with health or environment.',
'What experiences actually affect functioning?|When did they begin?|What alternative explanations need considering?|What would change after clarification?',
'I related to both autism and ADHD descriptions|I worried my anxiety ruled out neurodivergence|I did not have the childhood records people mentioned|One questionnaire result confused me',
'Note specific recurring examples across settings.|Avoid diagnosing yourself from a single screening score.|Review the actual questions you want answered.|Separate lifelong traits from recent changes where possible.|Keep a brief account of relevant developmental experiences.',
'Ask a qualified clinician about differential diagnosis.|Request clarification of screening results.|Discuss sleep and physical health factors during assessment.|Ask about coexisting autism and ADHD where clinically relevant.|Seek independent clarification if an outcome is not explained.'
),
P('An unexpected assessment result',
'You might feel dismissed or confused when a conclusion does not match the explanation you expected. A useful review concerns the evidence and the next available options.',
'An assessment result should be explained with reasoning; disagreement alone cannot determine diagnostic accuracy.',
'Which part of the conclusion surprised you?|What information was considered?|Were your concerns addressed?|What further question matters for daily support?',
'I was told I did not meet the criteria|The report missed a difficulty I had described|I did not understand the diagnostic conclusion|I felt disappointed after assessment',
'Read the report when you have enough space to think.|Write down questions about the stated evidence.|Ask what support remains available regardless of outcome.|Correct factual errors through the appropriate process.|Avoid treating an assessment result as a verdict on character.',
'Request a feedback appointment to clarify the findings.|Ask about the process for correcting inaccuracies.|Discuss alternative explanations with the assessor.|Find out whether another opinion is appropriate.|Seek practical accommodations based on present need.'
),
P('Privacy and disclosure choices',
'You may want the benefits of assessment without every employer or relative knowing the details. That concern is legitimate when another person has influence over housing or work.',
'Clinical privacy and access to adjustments require informed choices rather than automatic disclosure.',
'Who needs the information for a specific purpose?|What is the minimum necessary detail?|What could be shared safely?|What support can be requested without diagnosis?',
'I worried my employer would see an assessment result|I did not want a relative informed|I needed extra time without sharing my medical history|I wondered whether to tell friends about a referral',
'Read confidentiality information before sharing records.|Ask which details a service actually needs.|Choose a private way to receive appointments.|Consider the consequences of workplace disclosure.|Keep personal reports in a secure location.',
'Ask an assessor about information-sharing permissions.|Request confidential workplace advice.|Seek help understanding disability adjustment rights.|Ask a trusted advocate to attend with your consent.|Discuss a disclosure plan with someone who respects your choices.'
)
],
'A diagnosis cannot be confirmed from an online screener. New or rapidly changing symptoms require appropriate health assessment, and acute safety concerns should not wait for a neurodevelopmental appointment. Personal records and disclosure choices deserve privacy.',
['autism','adhd','access']
],
[
'neurodivergence-stigma',
'Being laughed at for how you move or communicate can make an ordinary room feel unsafe. You may begin monitoring yourself before anybody says anything. The responsibility for mistreatment belongs to the person or institution doing it.',
'Living with other people’s assumptions about your neurotype',
[
'Stigma can appear as overt hostility or as rules that disadvantage people with neurodevelopmental differences. A colleague might call stimming childish. A teacher may interpret processing time as unwillingness. These are judgements about outward behaviour that can ignore the person's actual needs.',
'Repeated negative reactions can make somebody reluctant to request an adjustment. They may hide a difference to protect access to work or friendships. That decision can be understandable when a hostile response would carry real consequences. The aim should be safer participation, not demanding total disclosure.',
'A stereotype can also make diagnosis or treatment harder. Someone might be told they cannot have ADHD because they achieved academically, or cannot be autistic because they maintain relationships. An assessment should consider the developmental pattern and functioning rather than a crude image of the condition.',
'When hostility is ongoing, personal confidence exercises will not alter the external behaviour. Written records or institutional procedures may be appropriate depending on the setting. A person may need support understanding their options before challenging someone with power over their livelihood.',
'Not every misunderstanding is discriminatory. It can help to ask what happened and how the other person responded after clarification. Repeated refusal to make reasonable adjustments can matter more than guessing their secret beliefs. Where there is a risk of retaliation, safety and practical dependence change the choices available.',
'Belonging may be easier around people who do not demand an explanation for every difference. Finding that company can help restore confidence and reduce isolation. It cannot replace the responsibility of schools or employers to provide fair access.'
],
[
P('Mockery and direct hostility',
'People may make jokes about your mannerisms or use diagnostic labels as insults. The event can leave you questioning whether to defend yourself or prioritise getting through the day.',
'Overt stigma is an external behaviour that may require boundaries or an institutional response.',
'What exactly was said or done?|Is the person likely to stop if corrected?|Could confrontation create risk?|Who can address the behaviour?',
'A classmate mocked my stimming|Someone used autism as an insult|A colleague called ADHD a joke|I was laughed at for needing extra time',
'Record repeated incidents when safe.|Decide whether a short correction is worthwhile.|Leave a hostile exchange instead of debating your identity.|Keep evidence if discrimination affects an official decision.|Identify a person with authority to change the situation.',
'Ask a supervisor to address repeated harassment.|Request clear school or workplace anti-bullying procedures.|Seek a union or student advocate if relevant.|Find confidential support before a complaint where retaliation is possible.|Tell a trusted person what the incident actually involved.'
),
P('Stereotypes in assessment',
'You may be told you do not look like a neurodivergent person because you achieved in education or communicate in a familiar way. Such assumptions can make it harder to describe difficulties.',
'A stereotype cannot replace developmental and functional assessment.',
'What assumption was made?|What information did the clinician consider?|Which current needs remain unmet?|What clarification would be useful?',
'A clinician said I seemed too social to be autistic|Someone said good grades ruled out ADHD|My support need was dismissed because I worked|I was asked to prove I was really neurodivergent',
'Describe concrete functional difficulties rather than arguing about appearance.|Ask which criteria were used in assessment.|Keep relevant records of support needs.|Seek clarification of an unexplained decision.|Distinguish a second opinion from repeated reassurance seeking.',
'Request a written explanation of an assessment outcome.|Ask for a qualified neurodevelopmental assessment where appropriate.|Seek a patient advocate if communication needs are ignored.|Discuss disability accommodations independent of labels.|Ask an assessor how masking or context was considered.'
),
P('Fear of disclosure',
'You may worry that others will change how they treat you after learning your diagnosis. That concern can be grounded in previous reactions and in real employment or family dependence.',
'Disclosure involves a practical assessment of privacy and power rather than a universal duty to be open.',
'Who would need to know?|What outcome are you hoping for?|What might the consequences be?|Could you request a specific change without full disclosure?',
'I hid my diagnosis from colleagues|I worried friends would treat me differently|I needed an adjustment but feared stigma|I did not want relatives to know my assessment result',
'Choose which details are necessary for a request.|Review confidentiality before sharing a report.|Prepare one concrete example of a barrier.|Delay disclosure if current conditions are unsafe.|Keep control over who sees sensitive records.',
'Seek confidential advice on workplace adjustments.|Ask a service about information-sharing rules.|Discuss disclosure with a trusted advocate.|Find peer accounts about navigating stigma.|Seek support for discrimination rather than automatically changing your behaviour.'
),
P('Internalised judgements',
'After repeated criticism, you may begin using the same insulting language about yourself. A change in environment can help, yet those habits of self-judgement may take time to loosen.',
'Shame may follow social treatment and does not establish an inherent deficit.',
'Whose criticism does your self-talk resemble?|What difference was being judged?|What is the actual consequence?|How would a fairer account sound?',
'I called myself lazy after needing help|I hid a useful stim because it felt childish|I felt ashamed using a disability adjustment|I worried I had to prove I was capable',
'Replace a character insult with the specific difficulty.|Notice which settings intensify self-criticism.|Use an accommodation that genuinely improves access.|Spend time with people who do not rank you by normality.|Keep evidence of competence alongside supported tasks.',
'Seek affirming psychological support for shame.|Join an appropriate peer group if you wish.|Ask friends not to repeat derogatory labels.|Request adjustments without apologising for needing them.|Discuss discrimination-related stress with a healthcare professional.'
)
],
'Threats, bullying and unequal treatment need practical protection. Do not confront someone if it would risk housing, employment or personal safety. Neurodivergent identity itself does not need treatment; coexisting distress deserves appropriate care.',
['access','autism','adhd']
],
[
'neurodivergent-accommodations',
'You might have worked around the same obstacle for years and begun assuming that the effort is simply part of being responsible. An adjustment can remove unnecessary work and leave more capacity for the actual task.',
'Asking for access without asking for special treatment',
[
'An accommodation changes how a task or service is accessed so a person can participate. It might involve written instructions or an accessible meeting room. The right adjustment depends on the demand and the person; a diagnosis label alone cannot determine which change will work.',
'It can be hard to ask for help when other people have said everyone must follow the same rules. A rule that appears equal may produce unequal access. A practical conversation identifies which feature creates the barrier and how the objective could be achieved fairly.',
'Some adjustments can be implemented informally; others require a formal process. In the UK, the Equality Act 2010 provides important protections for disabled people, and legal requirements depend on the setting. A person may wish to understand those requirements before disclosing sensitive health information.',
'You may be offered a standard adjustment that does not fit. Extra time is useful for some people but does not solve an intensely noisy room. Asking for a revision is a sensible evaluation of effectiveness, not a sign that you are difficult.',
'Power differences affect whether a request feels safe. A student may fear being viewed as less capable. An employee may worry about promotion or disclosure. Advice must consider confidentiality and the consequences of an unsupported request rather than prescribing instant assertiveness.',
'The purpose of an adjustment is to make meaningful participation possible. It should be reviewed against actual outcomes. If it helps you contribute to work or study with less avoidable strain, that is a concrete improvement, regardless of whether other people notice the effort it saves.'
],
[
P('Sensory access',
'The physical environment may make an otherwise manageable activity exhausting. A person should not have to tolerate preventable pain to demonstrate motivation.',
'Environmental input can directly affect access and may be changed without altering the person's abilities.',
'Which input creates the barrier?|What change is feasible?|Who controls the setting?|How could the adjustment be evaluated?',
'Overhead lighting made a meeting intolerable|A busy office blocked concentration|A lecture hall was too noisy to follow|I could not work without sensory breaks',
'Identify the input and the task it affects.|Choose a specific quieter or lower-input option.|Request a trial of an adjustment.|Keep the request focused on participation.|Review whether the changed setting helped.',
'Ask facilities staff about lighting options.|Request quieter working arrangements.|Discuss flexible break times with a supervisor.|Seek occupational advice for practical adaptations.|Ask a representative to support an access request.'
),
P('Communication and information',
'Spoken instructions alone may be difficult to process or retain. Written or visual information can make the task possible without lowering its actual standard.',
'Accessible information reduces unnecessary cognitive and communication demands.',
'Which information is missed?|What format works better?|What deadline requires clarity?|What written confirmation is needed?',
'I forgot verbal instructions during a meeting|An appointment letter was ambiguous|I needed time before answering questions|I could not follow several people talking at once',
'Request written instructions for complex tasks.|Ask for one question at a time.|Use a consistent format for meeting actions.|Confirm an important decision in writing.|Choose an accessible method to respond.',
'Ask staff to provide clear written summaries.|Request captions or other communication support where relevant.|Discuss additional processing time for interviews.|Ask a service about accessible appointment formats.|Seek an advocate if important information is repeatedly inaccessible.'
),
P('Executive access at work or study',
'The task may be achievable when it has a clear first step and predictable deadlines. Without that structure, more effort can disappear into planning.',
'Task design and feedback can improve access for executive difficulties.',
'Where does the workflow break down?|Which priority is unclear?|Would stages help?|Who can approve the change?',
'I missed an unclear project deadline|My manager gave five competing priorities|I needed a written checklist|A task became unmanageable after interruptions',
'Request deadlines linked to specific deliverables.|Choose one shared task tracker.|Define the first action with the supervisor.|Reduce unnecessary task-switching.|Test the adjustment before redesigning everything.',
'Ask for a structured project brief.|Request a predictable check-in routine.|Discuss assistive software with support services.|Seek a workload review where demands are excessive.|Request workplace adjustment advice if a trial is refused.'
),
P('Negotiating and reviewing',
'You may worry about sounding demanding when the first proposal is unsuitable. A successful request describes the actual barrier and evaluates whether the proposed change solves it.',
'Adjustments require collaboration and review; accepting an ineffective change serves nobody.',
'What outcome are you trying to reach?|Does the offered change remove the barrier?|What information must stay private?|When will the arrangement be reviewed?',
'I was offered extra time but needed a quiet room|My adjustment request went unanswered|I feared a manager would see my diagnosis|A revised arrangement worked better',
'Describe the barrier and the requested change in plain terms.|Keep a copy of the formal response.|Choose a realistic review date.|Avoid disclosing unrelated clinical details.|Record what changed in actual performance or comfort.',
'Ask HR or student support about the request process.|Seek independent equality advice if access is refused.|Request written reasons for a decision.|Involve a representative when negotiations are difficult.|Ask for a follow-up review after implementation.'
)
],
'Adjustment and equality obligations vary by jurisdiction and context. UK rights under the Equality Act 2010 should be checked for specific circumstances. Protect personal records, and seek independent help where refusal or retaliation creates significant risk.',
['access','autism']
]
];
