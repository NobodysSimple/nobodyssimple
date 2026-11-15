/* Medical experience, care autonomy, disability benefits and advocacy. */
const part=s=>s.split('|').map(x=>x.trim());
const P=(name,detail,insight,questions,scenes,actions,support)=>[name,detail,insight,part(questions),part(scenes),part(actions),part(support)];
export const ACCESS_DISABILITY_4=[
[
'medical-trauma',
'An appointment can feel frightening long before anything painful happens. You may remember a time when nobody explained what they were doing or when you felt unable to refuse. Those memories can affect how safe care feels now.',
'When earlier healthcare experiences make new care difficult',
[
'People use medical trauma to describe distress connected with frightening or overwhelming healthcare experiences. These might involve emergency treatment or procedures that felt out of the person’s control. The term describes an experience, not a diagnosis in itself; persistent symptoms may need assessment for trauma-related conditions.',
'Healthcare settings can contain reminders of the earlier event. A smell or medical device may provoke fear before you have consciously recalled the experience. That response can complicate necessary appointments. You should be offered information and a chance to discuss how procedures will be conducted.',
'Control and consent are especially important. A person may want step-by-step explanations or permission to pause when clinically safe. In some emergencies choices are limited by urgency and law, but those limits should be explained where possible rather than used to dismiss distress.',
'A previous encounter may have involved serious mistakes or discriminatory treatment. Processing what happened emotionally is different from investigating whether care was appropriate. A complaint or records request may be useful, yet it should not be required before somebody receives psychological or medical support.',
'Avoiding care can provide immediate relief from fear while delaying treatment for a current condition. A plan might involve a trusted advocate and an appointment agreed in advance. Exposure-based approaches can be effective for some trauma difficulties, but they should not involve unsafe procedures or deny legitimate concerns about the service.',
'Good future care can rebuild trust through predictability and respect. You might decide what you want explained and which touch requires warning. The aim is treatment you can access with greater choice, not learning to tolerate being ignored.'
],
[
P('Fear before appointments',
'You may feel distressed when a healthcare date approaches, even when the current clinician has not done anything harmful. Your body may react to the expectation of danger.',
'Trauma reminders can activate fear in anticipation of care and interfere with attendance.',
'What reminds you of the earlier experience?|What is feared about the next appointment?|What could make the visit more predictable?|What care cannot safely be delayed?',
'I panicked when I received a hospital letter|I felt sick before entering a clinic|A waiting room reminded me of an emergency|I considered cancelling necessary treatment',
'Read appointment details when you have space to process.|Prepare questions about what will happen.|Plan transport and a calm arrival if possible.|Distinguish current medical urgency from memories of previous events.|Seek urgent care for dangerous symptoms even when frightened.',
'Ask a clinic for a pre-appointment explanation.|Request a familiar support person if permitted.|Tell a clinician about relevant trauma triggers.|Seek trauma-informed psychological treatment when distress is persistent.|Ask for an alternative appointment environment if feasible.'
),
P('Loss of control during procedures',
'You may have experienced a procedure where you felt unable to ask questions or stop. Predictable explanations and informed consent can matter enormously in later care.',
'Perceived loss of control and actual consent violations require careful, separate consideration.',
'What choice was missing?|Could a pause have been offered?|Which steps need explanation?|What are your consent preferences now?',
'I was not told what a procedure would feel like|A clinician touched me without warning|I felt unable to ask for a break|I did not understand why urgent treatment was needed',
'Prepare a question about each unfamiliar procedure.|State touch or warning preferences before a nonurgent examination.|Ask what choices remain available.|Request a pause when medically safe.|Record a serious consent concern through an appropriate process.',
'Ask the clinician to explain steps before beginning.|Request a chaperone or advocate when appropriate.|Seek patient advice about consent rights.|Ask for accessible written procedure information.|Request a different clinician where options permit.'
),
P('Memories and symptoms afterward',
'You may re-experience part of a medical event or avoid reminders. The difficulty can affect sleep and relationships long after treatment has ended.',
'Persistent intrusive memories, arousal or avoidance can warrant assessment and trauma-focused care.',
'Which memories intrude?|What situations trigger them?|How has daily life changed?|What support would you choose?',
'I had nightmares about a hospital stay|A medical smell brought back an event|I could not stop replaying a procedure|I avoided talking about an emergency treatment',
'Use grounding that feels physically safe when a reminder occurs.|Reduce avoidable exposure to distressing media about the event.|Keep sleep and daily essentials in view.|Choose what details to share and with whom.|Seek professional assessment if trauma symptoms persist.',
'Ask about trauma-focused psychological treatment when appropriate.|Find a clinician who respects medical safety concerns.|Discuss sleep disturbance or panic with a healthcare professional.|Seek support from someone who will not demand a detailed retelling.|Ask whether records can clarify uncertainties about the event.'
),
P('Rebuilding care relationships',
'After a harmful or frightening encounter, you may distrust every professional. The next task is to obtain necessary care with clearer safeguards, not to force yourself to trust instantly.',
'Trust can develop through consistent explanations and respectful boundaries over repeated encounters.',
'Which care is currently needed?|What behaviour would help you feel informed?|What can be agreed beforehand?|Is an independent review needed?',
'I avoided returning after being dismissed|A new clinician asked about my preferences|I worried my concerns would be ignored again|I wanted to review what happened during treatment',
'Choose one necessary follow-up appointment.|Bring a short list of access and consent preferences.|Ask for a clear plan before leaving the visit.|Keep complaint decisions separate from urgent treatment needs.|Consider whether continuity with one clinician would help.',
'Request a named contact for future appointments.|Ask patient services about accessing records.|Seek a supportive advocate for difficult care decisions.|Discuss care-related anxiety with a qualified therapist.|Request an explanation of how past concerns will be prevented.'
)
],
'Severe acute symptoms need urgent care despite understandable fear. Trauma-informed support does not replace investigation of actual medical harm, and exposure should never be used to force unsafe treatment or override valid consent. Coercion or serious breaches of consent require safeguarding.',
['trauma','access','health']
],
[
'care-dependence-autonomy',
'Needing assistance with a task does not mean you want someone else deciding how you live. A supportive relationship should make choices possible, even when you cannot complete every physical step alone.',
'Receiving care while remaining the author of your decisions',
[
'Care dependence can involve assistance with washing or preparing food, as well as communication or transport. The amount and kind of help varies. A person may need someone to perform a task while remaining entirely capable of deciding when and how it should happen.',
'Care relationships contain practical power. A caregiver may control access to essential activities or the timing of personal care. Even a well-meaning person can begin deciding without asking because it seems faster. That loss of choice can become a serious source of distress.',
'Some people worry about being a burden. They may accept uncomfortable assistance or avoid asking for help because the caregiver appears tired. Those feelings can be understandable, but essential care should not depend on hiding needs or offering emotional reassurance in exchange.',
'Care plans can make preferences clearer. You might want information about who can enter the home or how personal boundaries will be respected. Written agreements are useful when staffing changes, so you do not have to renegotiate basic consent with every new person.',
'Autonomy is not the same as performing everything unaided. Independent decision-making may involve communication support or a trusted advocate. Capacity and safeguarding frameworks depend on the situation and jurisdiction; the person’s wishes should be sought through appropriate accessible processes.',
'Where care is unsafe or coercive, a simple conversation may not be enough. Dependence on the caregiver can limit options for leaving or reporting. Confidential specialist advice can help with a safe plan. Good care protects dignity while giving practical help.'
],
[
P('Everyday choice being taken over',
'A caregiver may decide what you eat or when you leave the house because it is easier for their schedule. You can need the help and still want the decision to remain yours.',
'Task assistance should not erase the person’s preferences and right to take part in decisions.',
'Which choice was made for you?|What assistance is actually needed?|What preference could be recorded?|How can it be respected?',
'Someone chose my clothes without asking|My carer decided when I could go out|I wanted to prepare part of a meal myself|A support worker ignored my preferred routine',
'Identify the decision you want to control.|Explain how you would like help offered.|Keep agreed preferences accessible in a care plan.|Choose which tasks to try independently when safe.|Ask for changes when an arrangement stops fitting.',
'Request a care-plan review that includes your wishes.|Ask a provider for staff training on supported choice.|Seek an independent advocate when needed.|Discuss assistive equipment for selected activities.|Ask a trusted person to support a specific request.'
),
P('Privacy and bodily boundaries',
'Personal care involves close physical contact and private information. Even when assistance is necessary, consent and respectful explanation remain essential.',
'Bodily autonomy includes preferences about touch, privacy and who provides care.',
'Which boundary matters?|Was consent sought?|What information is being shared?|What would make the task feel safer?',
'A worker entered without knocking|I was touched before being told what would happen|A caregiver discussed my health in front of visitors|I wanted privacy during washing',
'State contact preferences when possible.|Ask for warning before physical assistance.|Keep private information limited to people who need it.|Request suitable privacy during personal care.|Document serious boundary violations when safe.',
'Ask a provider about changing staff or arrangements.|Seek safeguarding support for unwanted touch or abuse.|Request a confidential conversation about privacy.|Ask for a chaperone or advocate where appropriate.|Review consent instructions in the care plan.'
),
P('Feeling like a burden',
'You may avoid asking for essential support when the other person seems overworked. That can leave needs unmet and increase resentment on both sides.',
'Care arrangements require adequate resources; guilt should not become a substitute for staffing or safe support.',
'What help do you avoid requesting?|What consequence follows?|Is the caregiver overextended?|Who else can provide support?',
'I delayed asking for help with food|I apologised for needing assistance|A relative seemed exhausted from caring|I skipped an activity to avoid being inconvenient',
'Name an essential need plainly.|Avoid measuring your worth by how little support you use.|Distinguish personal gratitude from a duty to accept unsafe care.|Review which tasks could be covered by formal services.|Keep interests and relationships outside the care role.',
'Ask for a reassessment of formal care needs.|Seek carers’ support for an overextended family member.|Discuss respite options where available.|Find an advocate to address unmet essential needs.|Request financial or social care advice on support entitlements.'
),
P('Unsafe or controlling care',
'When a caregiver threatens to withhold help or controls contact with others, the situation is no longer an ordinary disagreement. Dependence may make disclosure risky.',
'Coercion within care requires a confidential safeguarding response that considers practical dependence.',
'What support is being withheld?|Who controls access to essentials?|Is communication monitored?|Which independent person could help safely?',
'A caregiver threatened to stop helping if I disagreed|Someone controlled my phone during care|I was denied needed medication access|I feared retaliation for reporting abuse',
'Prioritise immediate safety and essential care.|Avoid confronting a controlling caregiver without a plan.|Keep emergency contacts accessible where safe.|Choose a confidential way to seek advice.|Document concerns only when doing so will not increase danger.',
'Contact an appropriate adult safeguarding service.|Seek independent advocacy about care arrangements.|Ask a clinician for a private discussion.|Request a safe alternative provider where possible.|Seek urgent assistance when medicine or essential care is withheld.'
)
],
'Threats, abuse or withholding essential care require safeguarding support. Consent, capacity and carers’ rights are context-specific; involve qualified services where needed. Immediate danger or serious neglect requires urgent assistance, and a monitored device may not be safe for private journaling.',
['access','safeguarding']
],
[
'disability-benefits-pressure',
'Filling in a disability assessment form can mean describing your most difficult days to someone who has never met you. It may feel exposing to put ordinary limitations into official words, especially when money depends on the outcome.',
'When getting financial support requires proving what daily life costs',
[
'Disability benefits processes often ask about functional impact and supporting evidence. The exact criteria depend on the scheme and jurisdiction. A person can be genuinely disabled and still struggle to describe what happens during an assessment. Eligibility decisions must be checked against the actual rules.',
'Forms may assume that tasks are simple to measure. You might manage an activity once but be unable to repeat it safely or consistently. Recording the duration and consequences can communicate more accurately than a broad statement that you can or cannot do something.',
'The paperwork itself can be inaccessible. People may need help with reading or collecting medical documents. A missed deadline may have financial consequences, so early practical support can be more valuable than another exercise in managing worry.',
'Assessment encounters can be distressing when a person feels disbelieved. It may be tempting to minimise symptoms to seem capable or to describe only the worst possible scenario. Accuracy requires explaining the usual pattern and variability. Evidence should be truthful and relevant, not coached toward a particular answer.',
'An adverse decision can feel like a judgement of the person’s credibility. It is important to distinguish a benefits eligibility finding from a medical diagnosis or statement of human worth. There may be review or appeal routes with deadlines, and specialist advice can help clarify the options.',
'Financial uncertainty can threaten essentials. A person may need help with housing or food while waiting. Practical assistance is part of the response. You deserve accurate information and support completing the process without having to turn every difficult day into an examination.'
],
[
P('Completing detailed forms',
'You may know exactly how a condition affects you and still struggle to fit that account into a box. The form’s language may be unfamiliar or misleading.',
'Clear functional descriptions and appropriate evidence matter more than dramatic wording.',
'Which activity is being asked about?|How do you perform it in practice?|What help or time is required?|What changes on a worse day?',
'I did not know how to describe variable walking ability|I felt ashamed listing personal care needs|The form did not fit my symptoms|I lost track of the supporting documents',
'Describe concrete daily tasks accurately.|Note relevant variation across days.|Keep copies before submitting forms.|Record deadline dates in one place.|Avoid exaggeration or minimisation in a response.',
'Ask a qualified welfare adviser to explain the criteria.|Request accessible forms or assistance completing them.|Seek medical evidence from relevant clinicians.|Ask an advocate to review clarity without changing facts.|Find out how to submit documents securely.'
),
P('Assessment interviews',
'You may be anxious about speaking to a stranger whose judgement affects income. The pressure can make it difficult to remember details or ask for clarification.',
'High-stakes evaluation creates communication needs, and accuracy is easier when procedures are accessible.',
'What information are you worried about forgetting?|What adjustments would help?|Can you take notes?|What is the assessment actually measuring?',
'I froze during a benefits interview|The assessor asked rapid questions|I worried that a good day would be misread|I did not understand the purpose of a question',
'Prepare a brief factual summary of typical difficulties.|Request pauses or interpretation where appropriate.|Ask for a question to be repeated.|Explain fluctuating ability rather than giving an inaccurate fixed answer.|Keep track of information you may need to clarify afterward.',
'Ask for a support person where rules permit.|Request disability-related communication adjustments.|Seek advice on the assessment process before attending.|Ask for an accessible written explanation of the decision.|Contact a welfare rights service about procedural concerns.'
),
P('Waiting and financial insecurity',
'Your application may be pending while rent and household costs continue. Worry is understandable when the outcome affects essential stability.',
'Material support and reliable process information are priorities when waiting affects basic needs.',
'What deadline is confirmed?|What essential bill is at risk?|Which interim support exists?|Who can give an accurate update?',
'I waited for a decision while struggling to pay rent|I worried that a letter had been lost|I could not afford equipment during the wait|I checked my application status repeatedly',
'Keep correspondence organised by date.|Check official deadlines and contact details.|Prioritise essential financial obligations.|Avoid relying on rumours about decision times.|Consider an interim budget based on confirmed income.',
'Seek welfare rights advice on available interim support.|Ask a housing adviser about rent difficulties.|Find assistance with food or utilities if needed.|Request an official update through the correct channel.|Seek debt advice before unaffordable arrears escalate.'
),
P('Unfavourable decisions and appeals',
'An award refusal or reduction may feel deeply personal. The practical next step is understanding the reasons and the available review process.',
'Administrative decisions can be challenged through evidence and procedures; they do not define a person’s condition.',
'What decision was actually made?|What criteria were used?|Is there a review deadline?|What evidence may clarify the issue?',
'My benefit claim was refused|I feared missing an appeal deadline|The report did not match what I said|My award was reduced after reassessment',
'Read the decision letter for reasons and dates.|Keep copies of disputed factual statements.|Avoid missing a deadline while searching for perfect evidence.|Separate eligibility rules from personal worth.|Choose a review route based on qualified advice.',
'Contact a welfare rights adviser promptly about deadlines.|Ask how to request a mandatory reconsideration where applicable.|Seek help preparing accurate supporting evidence.|Find representation for an appeal where available.|Request an accessible explanation of the decision.'
)
],
'Benefits schemes and deadlines vary by jurisdiction and may change. This page cannot determine eligibility or promise an outcome; seek current qualified welfare advice. If finances threaten housing, food or safety, seek practical assistance promptly and keep sensitive records secure.',
['benefits','access']
],
[
'accessibility-advocacy',
'There are days when you have the energy to ask for change and days when the same request feels impossible. You should not have to become a full-time accessibility officer simply to enter a building or understand an appointment.',
'Advocating for access without carrying the whole institution',
[
'Accessibility advocacy begins with a particular barrier. A room may lack a ramp or a service may refuse communication by text. Describing what failed and the change needed can help identify the person with responsibility to act. Broad statements about inclusion rarely tell you when access will actually improve.',
'You may be unsure whether a request is considered reasonable. Rights depend on the setting and legal jurisdiction, and formal processes may have specific requirements. Understanding those rules can strengthen a request without making you responsible for knowing every part of disability law.',
'Repeated refusal can drain energy. Each complaint may require documents and follow-up while the original barrier continues to affect life. You can decide how far to pursue an issue and ask an advocate to share the administrative work. That choice should not be interpreted as acceptance of discrimination.',
'The first adjustment offered may not work. A venue might provide an alternative entrance that is unsafe. You can explain why the proposed solution fails to provide meaningful access. The question is whether the task becomes possible in practice, not whether the organisation can claim to have acted.',
'Collective advocacy can be useful when several people encounter the same obstacle. A shared request may show how a policy excludes different users. It still matters to obtain consent before publicising anyone’s personal details or using their experience in a campaign.',
'Success should be observable. An accessible document can be used by the intended reader. An installed lift should work during opening hours. A review date and named person responsible can turn a promise into something that can be checked. Your energy belongs to you as well as to the cause.'
],
[
P('Making a first request',
'You know a service is inaccessible but may be unsure whom to contact or how much detail to provide. A precise request can reduce unnecessary correspondence.',
'An access request works best when it identifies the barrier and the outcome needed.',
'What task is blocked?|Who controls the feature?|What alternative would work?|What information is necessary to share?',
'A venue had no usable step-free entrance|An online form lacked accessible labels|I needed written instructions before a visit|I did not know who handled adjustments',
'Describe the barrier in one paragraph.|Request a concrete alternative that enables participation.|Keep the request focused on the task.|Choose what personal information to disclose.|Ask for written confirmation and a response date.',
'Find the service’s accessibility contact.|Request advice from a disability support officer.|Seek an advocate for a complex request.|Ask an organisation for its published access arrangements.|Request a named staff member to coordinate changes.'
),
P('When an adjustment is refused',
'A refusal may arrive without a meaningful explanation. It is easier to decide what to do next when you know which reasons the organisation relied upon.',
'Formal processes and relevant obligations can be examined rather than relying only on verbal assurances.',
'What reason was given?|What policy applies?|Is there a review deadline?|What remedy do you still need?',
'My employer rejected a quiet workspace request|A clinic refused an interpreter|I was told an accessible room was unavailable|A venue claimed a broken lift counted as access',
'Ask for the refusal in writing.|Check applicable equality and access requirements.|Keep a timeline of correspondence.|Seek independent advice before a high-stakes complaint.|Identify an interim accessible arrangement.',
'Consult a union or student representative where relevant.|Ask for internal review through the correct process.|Seek independent disability-rights advice.|Request a meeting with the responsible decision-maker.|Ask about appeal deadlines before delaying action.'
),
P('Ineffective fixes',
'An organisation may offer a change that looks useful on paper but still leaves the essential task inaccessible. You are entitled to evaluate its actual effect.',
'Access is achieved through usable outcomes, not the mere existence of an adjustment.',
'What still fails?|Which part of the proposed solution is unsafe?|What is the user experience?|Who can review implementation?',
'A ramp was too steep to use safely|Captioning failed during the presentation|The accessible document was only a scanned image|A quiet room was repeatedly unavailable',
'Test an offered adjustment against the actual task.|Describe the remaining problem specifically.|Avoid dangerous workarounds to demonstrate gratitude.|Request a correction or alternative.|Set a realistic implementation review date.',
'Ask facilities staff to inspect a safety issue.|Request functional testing with affected users.|Seek an accessible alternate venue while repairs occur.|Ask for a responsible person to check the fix.|Find an advocate when repeated adjustments do not work.'
),
P('Exhaustion and shared advocacy',
'After the tenth email, you may no longer have the capacity to keep pursuing the same issue. Advocacy can matter deeply while still costing energy you need for ordinary life.',
'Support and shared responsibility can make sustained change possible without requiring constant individual effort.',
'What is advocacy costing you?|What work could another person take over?|Which goal matters most?|What would count as enough for now?',
'I stopped following up after repeated refusals|I wrote the same complaint several times|A group organised a shared accessibility request|I needed to rest after a difficult appeal',
'Choose one priority rather than every possible access issue.|Keep a reusable factual record to reduce repeated writing.|Set a stopping point for unproductive correspondence.|Protect time for ordinary relationships and rest.|Avoid sharing another person’s case without consent.',
'Ask an advocacy organisation to help handle correspondence.|Find peers who want to address the same barrier.|Request a named contact for ongoing complaints.|Seek legal advice where serious discrimination persists.|Ask a trusted person to help organise paperwork without taking over choices.'
)
],
'Access rights, definitions of reasonable adjustments and deadlines depend on jurisdiction and context. Do not attempt unsafe workarounds for inaccessible spaces. Respect privacy and consent when advocating for others, and seek urgent assistance where safety or essential care is threatened.',
['access','equality']
]
];
