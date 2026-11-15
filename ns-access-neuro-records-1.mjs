/* Neurodivergence & learning: original, problem-specific field-guide records.
 * Each route contains an authored explanation, four real situations, four
 * journal questions, and ten practical/help options.
 */
const parts=s=>s.split('|').map(x=>x.trim());
const P=(name,detail,insight,questions,scenes,actions,support)=>[name,detail,insight,parts(questions),parts(scenes),parts(actions),parts(support)];
export const ACCESS_NEURO_1=[
[
'autism-understanding',
'If you are trying to understand autism, you may be looking for a description that finally accounts for everyday experiences other people barely notice. There is no single autistic way to feel or communicate, and recognition should open possibilities rather than become another set of rules.',
'Understanding autism without asking yourself to fit a stereotype',
[
'An autistic person might find a meeting difficult because nobody explains when to speak, while enjoying a thoughtful conversation about a familiar subject. Someone else may find conversation easy and struggle with fluorescent lighting. Autism is a neurodevelopmental difference involving communication and patterns of experience; its expression varies between people and settings.',
'You may have read lists of traits and wondered why you recognise one example but not another. Lists often describe outward behaviour without telling you what the person experienced. The more useful question concerns the relationship between a demand and your needs. A crowded room might cost attention through sensory input even when you appear perfectly comfortable.',
'Communication differences can become social difficulties when two people make conflicting assumptions. Directness may be read as rudeness. Indirect language can leave a person guessing what is actually requested. Neither side automatically has a complete account of the interaction. Clarity and curiosity can make the exchange less demanding.',
'Predictability can be a practical need rather than a preference for controlling everything. An appointment without a clear agenda may involve several decisions at once. Knowing where to go and what will happen can preserve energy for the appointment itself. Adjusting the environment is often more useful than demanding greater tolerance.',
'Strong interests may offer enjoyment and continuity. Repetitive movement can help regulate attention or emotion. These features should not be treated as symptoms to extinguish merely because they differ from an observer’s habits. Where an experience causes distress, the next question is whether harm comes from its consequences, from an inaccessible setting or from something needing assessment.',
'If you are exploring an assessment, a clinician considers developmental history and current functioning rather than deciding from one internet description. You can begin understanding your needs before receiving a diagnostic decision. Keep what helps you participate, and remain free to reconsider an explanation that does not fit.'
],
[
P('Communication and misunderstandings',
'You may find that people expect you to infer their wishes from hints, or that they assign an intention to your direct answer that you did not have. The cost is often repeated clarification or a sense of being misunderstood.',
'Different communication expectations can create mutual misunderstanding without revealing a lack of care or empathy.',
'When was a clear answer taken differently than you intended?|What did the other person expect you to infer?|Would a written or direct request have changed the interaction?|What communication style would allow you to participate?',
'Someone called my direct answer rude|I missed a hint in a conversation|I did not know when to join a group discussion|Someone assumed my silence meant disinterest',
'Ask for the actual request when a hint is too vague.|Describe what you meant before discussing how it sounded.|Use written follow-up when spoken instructions are ambiguous.|Arrange a clear agenda for an important conversation.|Take extra processing time instead of agreeing before you understand.',
'Ask a colleague to state expectations explicitly.|Request written instructions for complicated tasks.|Explain to a friend how direct language helps you understand.|Ask a meeting chair to make speaking turns clearer.|Consider a clinician or support worker who understands autistic communication.'
),
P('Sensory differences',
'Sounds, textures or light may affect you more or less strongly than others seem to notice. The strain can be invisible, especially when you have learnt to stay still and keep participating despite discomfort.',
'Sensory thresholds vary across individuals and situations; reducing unnecessary exposure may improve access without changing identity.',
'Which input becomes difficult in a particular place?|When do you first notice the cost of tolerating it?|What can be changed before you reach overload?|How would the setting work with an adjustment?',
'Fluorescent lighting made it difficult to focus|A crowded café left me unable to follow speech|I needed to remove an uncomfortable label|I did not notice hunger until I felt unwell',
'Identify one source of input that makes a task harder.|Carry sensory tools you have found useful and safe.|Choose seating away from a predictable noise source.|Plan recovery after unavoidable high-input events.|Check basic needs during extended periods of intense focus.',
'Ask for a quieter appointment room.|Request an alternative to harsh overhead lighting.|Tell a trusted person when sensory discomfort is increasing.|Ask about occupational therapy when daily tasks are substantially affected.|Arrange a low-stimulation option at a recurring event.'
),
P('Predictability and transitions',
'A surprise change can require rebuilding your mental picture of a day while others have already moved on. You may feel frustrated not because the change is irrational but because the new demands arrive without preparation.',
'Clear expectations can reduce decision load and allow flexible responses when circumstances genuinely change.',
'Which changes are most difficult to recover from?|What information would have helped you prepare?|How much transition time is realistically available?|Which routine do you wish to preserve?',
'A meeting changed rooms without warning|A planned activity was cancelled at the last minute|I needed time after a change of schedule|I could not start a new task immediately',
'Keep upcoming commitments visible in one reliable format.|Build a brief transition gap between demanding activities.|Identify which part of a routine is genuinely important.|Write a fallback plan for one predictable disruption.|Tell people which changes require advance notice.',
'Request clear start and finish times for meetings.|Ask organisers to notify participants when plans change.|Discuss predictable shift patterns with an employer.|Ask a teacher for written updates to altered timetables.|Seek support designing a workable routine for daily living.'
),
P('Identity, strengths and recognition',
'You might recognise autistic descriptions and feel relief, or resist being reduced to another label. An identity can explain part of a life without accounting for every interest, difficulty or personal choice you have made.',
'Assessment, identity and accommodations are related but distinct decisions; none requires pretending that all autistic experiences are the same.',
'What experiences feel newly understandable?|Which descriptions do not fit you?|What do you want help with regardless of diagnosis?|Who could respect your account without deciding it for you?',
'I recognised myself in an autistic person’s account|Someone said I did not seem autistic|I wondered whether my focused interest was unusual|I did not know how to ask for an assessment',
'Note concrete experiences you want to understand better.|Treat online trait lists as prompts rather than diagnostic proof.|Keep enjoyable interests without turning them into performance goals.|Decide what personal information you prefer to keep private.|Identify a change that would help even without a diagnosis.',
'Ask a GP about the local adult autism assessment process.|Seek a qualified assessment when diagnostic clarity would be useful.|Find autistic-led accounts with varied perspectives.|Ask for adjustments based on the barrier you face.|Talk with someone who will not impose a fixed autism stereotype.'
)
],
'If you are in acute distress or experiencing a new medical or mental health symptom, seek appropriate assessment. Autism is not caused by poor parenting, and interests or sensory differences alone do not establish a diagnosis. Support should respect autonomy, communication needs and individual preferences.',
['autism','access']
],
[
'adhd-understanding',
'An unfinished task can look simple to somebody watching. For the person who wants to begin it and cannot get traction, another instruction to try harder may be the least useful thing anyone could say. Understanding ADHD means examining attention and action in context.',
'Understanding why wanting to do something is not the same as being able to start',
[
'ADHD involves persistent patterns of inattention and/or hyperactivity-impulsivity that affect functioning across contexts. It does not mean never paying attention. A person may spend hours absorbed in a stimulating interest and find it hard to begin necessary paperwork. The difference is often about how attention is regulated, not the importance of the task.',
'An activity can be difficult because the first step is unclear. You may know the deadline and still feel unable to choose where to begin. Pressure sometimes increases urgency and enables action, but relying on repeated crises can be exhausting. A smaller entry point may reduce the work needed to cross that threshold.',
'Memory problems can arise when information is not reliably held or retrieved at the moment it is needed. Someone who remembers every detail of a hobby may still miss a meeting after being interrupted. External reminders are tools for managing demands, not evidence that you do not care.',
'Restlessness and impulsivity are experienced differently. One person needs movement to stay attentive. Another speaks quickly and regrets interrupting. The response should consider the consequence rather than treating all activity as a problem. Safe movement can support concentration; a pause can help when acting immediately has costs.',
'Shame may develop after years of being told you are careless. That history can make every missed task feel like proof of a character flaw. It is worth separating behaviour from intention and reviewing which systems actually work. There may also be conditions such as poor sleep or anxiety that contribute to attention difficulty.',
'Diagnosis requires a developmental and clinical assessment of symptoms and impairment. Treatment may include environmental changes, psychological strategies and medication when appropriate. No single trick works for everyone, and practical supports should be judged by whether they make everyday participation more possible.'
],
[
P('Starting and prioritising',
'You want to do an ordinary task yet cannot find a manageable way in. A list of ten equally urgent items can make choosing the first step more difficult than completing it.',
'Task initiation can be affected by uncertainty about the first action, reward and the amount of decision-making required.',
'What is the very first observable action needed?|Which choice are you postponing?|Would a shorter starting point change anything?|What support would make beginning more realistic?',
'I stared at an email without replying|I reorganised my desk instead of starting work|A deadline was near and I still could not begin|I opened five tasks and finished none',
'Define a first action that takes only a few minutes.|Put materials for the chosen task where you will see them.|Choose one priority for the next work period.|Use a timer as an invitation to start rather than a threat.|Stop redesigning your task system before testing a simple one.',
'Ask a colleague to clarify which task matters first.|Request an example of a finished piece of work.|Try a body-doubling session with a willing friend.|Ask for deadlines broken into meaningful stages.|Discuss persistent impairment with a clinician experienced in ADHD.'
),
P('Forgetting and losing track',
'You might sincerely intend to remember a commitment and lose it when something interrupts you. Repeated apologies do not substitute for a system that catches information outside working memory.',
'Prospective memory and executive attention can vary; reliable prompts reduce dependence on remembering at exactly the right moment.',
'Which information was lost and when?|Did an interruption occur before you acted?|Where could that reminder live instead?|What could others reasonably do to help?',
'I forgot an appointment I had agreed to|I walked into a room and lost my purpose|I misplaced something I had just put down|I missed a message after opening it',
'Use one calendar rather than several competing lists.|Record a commitment immediately after making it.|Create a consistent place for frequently lost items.|Set reminders where action is possible, not hours too early.|Keep an unfinished message visible until you respond.',
'Ask for written confirmation of appointments.|Request meeting notes with explicit owners and dates.|Set shared reminders for genuinely shared responsibilities.|Discuss tools for working-memory difficulties with a support professional.|Ask a prescriber to review any medication effects on attention.'
),
P('Restlessness and impulsivity',
'Remaining still can absorb attention you need for something else. Impulsive words or spending may cause difficulties too. The aim is to support safe regulation and preserve choice where a quick action has lasting consequences.',
'Movement needs and inhibitory control are separate practical questions that call for different supports.',
'What happens when you have to stay still?|Which rapid actions have actual consequences?|What kind of movement helps without harm?|What brief pause would be useful in higher-stakes moments?',
'I needed to move during a long meeting|I interrupted before a friend had finished|I bought something before checking my budget|I felt restless during a quiet lecture',
'Use unobtrusive movement when it genuinely helps attention.|Sit where standing briefly would disturb others less.|Delay nonessential purchases until a chosen review time.|Write a thought down before interrupting a discussion.|Remove one-click buying from a device if impulse spending is costly.',
'Request movement breaks during longer teaching sessions.|Tell a trusted friend when an interruption was unintentional and repair it.|Ask a financial adviser for tools addressing repeated overspending.|Discuss impulsive behaviour that causes harm during clinical review.|Agree on clear meeting rules that allow brief participation.'
),
P('Shame and getting appropriate help',
'After repeated criticism you might expect disapproval before anybody has spoken. That expectation deserves attention, especially when it makes you avoid a task or hide how much support you need.',
'Secondary shame may add distress to attention problems without explaining all of the underlying difficulty.',
'Whose criticism do you remember when a task goes wrong?|Which support helped once and might help again?|What evidence would an assessment need?|Which expectations should be renegotiated?',
'I was called lazy when I missed a deadline|I hid how long a simple task had taken|I worried an assessment would not believe me|Someone said ADHD was just bad discipline',
'Describe the difficulty through concrete examples rather than self-insults.|Notice which tasks are harder after poor sleep.|Keep a short history of attention difficulties across settings.|Review a failed system without turning it into a moral judgement.|Choose accommodations by actual function rather than an ideal routine.',
'Ask a qualified clinician about ADHD assessment and treatment options.|Request structured written feedback instead of labels about effort.|Discuss reasonable adjustments in work or study.|Find a support group that respects varied ADHD experiences.|Seek help for coexisting anxiety or depression when relevant.'
)
],
'Seek assessment for new or rapidly changing attention problems or major impairment; ADHD cannot be diagnosed from one online checklist. Medication decisions need individual prescribing review, including relevant health conditions, and no one should be pushed to take medication to be accepted.',
['adhd','access']
],
[
'dyslexia-experiences',
'You can know what you want to say and still struggle to get it onto a page. Being judged by reading speed or spelling can hide understanding that becomes obvious in conversation. The question is how information can reach you and how your knowledge can be shown.',
'When literacy demands become a barrier to what you know',
[
'Dyslexia is a learning difference that affects aspects of accurate or fluent word reading and spelling. It does not measure intelligence. You may follow a sophisticated discussion yet need more time to read a dense document. The difficulty can become more visible when speed is mistaken for comprehension.',
'Repeated correction can make writing feel risky. You may choose simpler words to avoid spelling mistakes, even when a more precise term is available. That narrowing changes how other people judge your work. Accessible tools can help you communicate what you actually mean without making every sentence a test.',
'In a classroom, reading aloud without preparation may be stressful because decoding and speaking happen simultaneously. A person can understand the subject while losing their place on the page. An alternative way to participate can preserve both learning and dignity.',
'Assessment of literacy difficulties considers the pattern and its history. Vision or hearing problems and limited teaching opportunities can also affect learning, so a full account matters. Accommodations should relate to the actual demands: for some tasks that means accessible formats; for others, more time or assistive technology.',
'At work, a complex form may become an obstacle to otherwise competent performance. It helps to identify whether the requirement is accurate information or flawless unaided spelling. If a tool can ensure accuracy, using it is often a sensible part of the job rather than a shortcut.',
'People have different reactions to the word dyslexic. Some find explanation and community; others are wary of being underestimated. You can pursue support without turning the label into your whole identity. A useful accommodation lets your thinking be assessed instead of the difficulty of producing a particular form.'
],
[
P('Reading under time pressure',
'You understand material when given enough time, yet timed reading can leave you behind. The gap matters when a task measures speed more than the knowledge it is meant to test.',
'Automatic word recognition and reading fluency can affect pace, especially with unfamiliar text.',
'Which kinds of material take longest?|Does the deadline change your comprehension?|What access format is genuinely helpful?|How could an assessment measure your knowledge fairly?',
'I reread one exam question several times|I fell behind during a timed reading task|I avoided opening a long report|I lost my place while reading aloud',
'Use accessible text or audio where permitted.|Break long reading into sections with clear headings.|Preview unfamiliar vocabulary before a timed session.|Mark the information you need rather than rereading everything.|Try a reading guide or text-to-speech if it improves access.',
'Ask an assessor about appropriate time adjustments.|Request advance copies of essential reading.|Discuss alternatives to unprepared reading aloud.|Seek an assessment for persistent literacy difficulties.|Ask a librarian about accessible digital formats.'
),
P('Writing and spelling',
'You may know the argument but spend your available time correcting words. Worry about mistakes can make your writing much less ambitious than your actual understanding.',
'Written expression may be hindered by transcription demands even where reasoning and vocabulary are strong.',
'What happens between thinking and writing?|Which errors most affect the result?|When does editing become the whole task?|What would help others see your actual understanding?',
'I chose an easier word to avoid spelling it wrong|I lost an idea while correcting a sentence|I spent longer proofreading than drafting|Someone assumed errors meant I had not prepared',
'Dictate a first draft when speaking is easier.|Separate drafting ideas from checking spelling.|Use spellcheck and proofreading tools deliberately.|Develop a personal list of frequently needed words.|Check one paragraph for meaning before correcting surface errors.',
'Ask for marking criteria that separate ideas from transcription when appropriate.|Request assistive writing software at work or study.|Ask a teacher for feedback on argument independently of spelling.|Seek a learning-support assessment for technology needs.|Arrange a proofreader for important documents when permitted.'
),
P('Learning methods and memory',
'You might remember an explanation heard aloud while struggling to retrieve the same information from printed notes. That difference can help you choose a better route for studying.',
'Useful learning methods depend on the task and individual pattern; there is no single dyslexic learning style.',
'Which teaching format made the idea click?|What does repetition help you remember?|Which note format creates more work?|How could the information be reviewed actively?',
'I understood a lecture but struggled with the notes|I remembered a spoken example more easily|I got lost in a dense worksheet|I needed a diagram to follow instructions',
'Test an audio version of complex reading.|Write a brief meaning-focused summary after studying.|Use retrieval practice without imposing reading speed targets.|Arrange notes in a format you can search easily.|Ask for instructions broken into distinguishable steps.',
'Ask a tutor to provide a clear overview before detail.|Request captioned recordings where available.|Check whether a study-skills service offers dyslexia support.|Ask a colleague to demonstrate a complex process once.|Seek a relevant assessment when learning difficulties persist across settings.'
),
P('Disclosure and fair assessment',
'An employer or teacher may never have noticed how much work you put into hiding a literacy difficulty. You can decide what to disclose and ask for the specific adjustment you need.',
'Recognition and accommodations are decisions about fair access, not evidence of lower ability.',
'Where have you hidden the effort involved?|What part of the task is actually essential?|Who can approve a reasonable adjustment?|What would a fair outcome look like?',
'I avoided mentioning dyslexia in a job interview|A colleague criticised a spelling error in public|I needed help completing a form accurately|I worried an accommodation would be called unfair',
'Describe a task barrier rather than apologising for your intelligence.|Keep examples of successful work done with support.|Ask what information a decision-maker actually needs.|Choose whether and how to disclose personal information.|Review whether a new adjustment produces a workable result.',
'Ask about workplace reasonable adjustments in your jurisdiction.|Request accessible instructions for essential procedures.|Speak to student disability services about assessment support.|Seek an independent advocate if adjustments are refused.|Ask a manager to address public mockery of literacy difficulties.'
)
],
'Persistent reading and spelling difficulties can benefit from qualified educational assessment. New or sudden loss of reading ability, speech or other neurological function is different and needs urgent medical assessment.',
['learning','access']
],
[
'dyspraxia-dcd',
'When an everyday movement requires conscious planning, other people may only notice the time it takes. You may be told to be more careful when you are already concentrating far harder than the task appears to demand.',
'When coordination costs more effort than people can see',
[
'Dyspraxia or developmental coordination disorder (DCD) involves difficulties learning and carrying out coordinated movements. It can affect handwriting or preparing food. The pattern differs between people, and other medical conditions should be considered when coordination problems are new or changing.',
'Repeated accidents or criticism can make someone avoid activities they might otherwise enjoy. If you expect to drop something or struggle with a group sport, opting out may protect you from embarrassment. Access often improves when the task or environment changes rather than when you are told to practise indefinitely without support.',
'Motor planning can require deliberate attention. A multi-step activity becomes harder when somebody talks to you or rushes you. Reducing interruptions can make the work safer and less exhausting. Clear demonstration and predictable order can also help when learning a new skill.',
'Daily demands often contain hidden physical requirements. A narrow workspace, an awkward grip or a busy staircase can affect participation. An occupational therapist may help identify practical aids. These tools exist to make activities possible, not to prove the person is sufficiently impaired.',
'Motor differences can coexist with attention or learning difficulties, although they do not determine someone’s intelligence. An accessible method of assessment is important when the work being judged does not require handwriting speed or fine-motor precision.',
'Confidence can improve through successful participation that fits a person’s actual goals. A person might want to cook safely, navigate public transport or enjoy a hobby. The useful outcome is greater choice and safer access, not making every movement look identical to somebody else’s.'
],
[
P('Fine-motor everyday tasks',
'Writing, fastening clothing or handling small objects may take sustained effort, and repeated errors can make everyday routines feel more time-consuming than people realise.',
'Fine-motor planning and coordination can affect task speed and comfort independently of motivation.',
'Which hand movements take most effort?|Where does the task become frustrating?|Would different equipment change the difficulty?|What is the task supposed to achieve?',
'I struggled to fasten a small button|My handwriting became uncomfortable quickly|I dropped coins at a checkout|I avoided a fiddly kitchen utensil',
'Try an easier-grip tool where it is safe.|Allow realistic time for necessary fine-motor tasks.|Use typing instead of handwriting when permitted.|Simplify the workspace before handling small items.|Choose clothing fasteners that suit your comfort.',
'Ask an occupational therapist about practical aids.|Request an alternative to handwritten forms.|Ask an employer about adapted equipment.|Get a demonstration of a tool before purchasing it.|Discuss persistent pain or hand difficulties with a clinician.'
),
P('Movement and navigation',
'You may find stairs, crowded spaces or physical hobbies difficult to coordinate, particularly when hurried. Avoidance can protect you from falls but may also reduce access to valued activities.',
'Physical safety, layout and individual coordination skills all affect how manageable a movement task is.',
'Which movements feel least predictable?|Have you experienced falls or near misses?|What environmental change would improve safety?|What activity do you still want to enjoy?',
'I stumbled on an unfamiliar staircase|I avoided a crowded sports activity|I bumped into furniture in a narrow room|I struggled to carry items while walking',
'Choose routes with enough space to move safely.|Use stable handholds where appropriate.|Reduce the number of items carried at once.|Practise a chosen activity at a comfortable pace.|Stop a movement exercise that is causing injury.',
'Ask a physiotherapist about safe movement strategies.|Request a safer layout in a shared workspace.|Discuss frequent falls with a healthcare professional.|Find an adapted leisure activity if you want one.|Ask for extra time when physical tasks are assessed.'
),
P('Following motor sequences',
'A complex action may be easier after somebody demonstrates it clearly. Verbal instructions given during movement can compete with the attention needed to coordinate each step.',
'External sequencing and practice under manageable conditions can support learning when planning a novel movement is demanding.',
'Which step is easy to lose?|Would a demonstration help more than a description?|What distraction interferes with coordination?|How could the sequence be made visible?',
'I lost the order of steps while cooking|I struggled to follow a dance demonstration|I forgot what came next while assembling furniture|I needed to repeat a movement slowly',
'Make a visual checklist for a complicated sequence.|Break a movement into meaningful stages.|Practise where there is enough space and time.|Reduce extra conversation during difficult actions.|Keep materials in a predictable working order.',
'Ask for a demonstration rather than another verbal instruction.|Request a written sequence for repetitive work tasks.|Discuss adapted teaching methods with a tutor.|Ask a therapist about occupational task practice.|Seek support when sequencing problems affect daily safety.'
),
P('Being judged as careless',
'You might have learnt to apologise for spills or missed movements before anyone complains. Over time, that anticipation can become as exhausting as the physical effort itself.',
'Repeated social criticism can add anxiety to a coordination difficulty without being its cause.',
'What criticism do you anticipate?|Which physical demand is being overlooked?|Is a safer method available?|What would a respectful response from others involve?',
'Someone called me clumsy in front of others|I worried about carrying drinks at a party|A teacher criticised my slow handwriting|I hid how much effort a task required',
'Name the actual access issue instead of accepting a character judgement.|Prepare a safer way to perform a task when available.|Explain that extra time can protect accuracy.|Choose activities you enjoy without demanding perfect skill.|Distinguish learning a new movement from proving your worth.',
'Ask colleagues to stop mocking accidental spills.|Request occupational assessment for recurrent difficulties.|Seek reasonable adjustments for timed motor tasks.|Talk with a trusted person about avoiding activities through shame.|Get a medical review if coordination has recently worsened.'
)
],
'New or rapidly worsening coordination problems, weakness, slurred speech or other neurological symptoms need prompt clinical assessment rather than being attributed to DCD. Safety and access take priority over forcing risky movement.',
['dcd','access']
]
];
