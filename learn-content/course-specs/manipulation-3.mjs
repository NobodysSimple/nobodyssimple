export const specs=[
 {
  "title": "False urgency at work: whose deadline is it?",
  "concept": "manufactured urgency and incentives",
  "opening": "Your manager asks for a report by lunchtime. The report usually takes two days, and nobody can explain why the deadline has changed. When you ask what can be postponed, the manager replies that a committed employee would simply find a way. You might be facing genuinely urgent work. You might also be receiving a demand designed to avoid scrutiny of poor planning. This lesson asks how to distinguish an operational constraint from pressure that transfers a hidden cost onto somebody else.",
  "mechanism": "Urgency changes the cost of thinking. When time is scarce, people are more likely to rely on whatever answer is immediately available. A superior may use that pressure deliberately, or it may arise because the organisation has not planned properly. The worker's task is to make the competing commitments visible: what needs delivering, by when, which evidence makes the deadline real and what can reasonably move. A vague demand for loyalty conceals these trade-offs. A precise reply converts them into a decision that can be recorded and reviewed.",
  "evidence": "Research on social influence identifies time pressure and authority as cues that can affect judgement. Broader workplace literature discusses role demands, control and stress without implying that every unreasonable deadline is conscious manipulation. A source's authority can be relevant when the person actually controls the project or has knowledge of its requirements. It becomes unhelpful when rank replaces a clear explanation of competing costs. A good workplace analysis separates the deadline's legitimacy, its feasibility and how the manager responds to questions about resources.",
  "complication": "Some deadlines are externally imposed and cannot be moved. In a clinical emergency or technical incident, a manager may reasonably redirect work quickly. The strongest evidence of unfair pressure is not the word urgent; it is the refusal to discuss priorities while threatening the employee for failing to satisfy mutually incompatible demands. An employee may still need to comply with lawful instructions and workplace processes. Knowing how to ask for priorities can improve the situation without treating every manager as a manipulator.",
  "closing": "When a demand has no clear capacity plan, make the trade-off explicit. State what can be completed and what must change to meet the requested date. A manager who gives genuine priorities provides information; one who only escalates the loyalty test reveals something about the pressure being applied. The question to solve is whose decision should allocate the cost, not which employee can feel most guilty.",
  "case": {
   "a": "Noah",
   "b": "Director",
   "setup": "A director suddenly demands a three-day analysis by noon, while Noah is preparing another report due at the same time.",
   "turns": [
    [
     "a",
     "I can finish either the analysis or the safety report by noon."
    ],
    [
     "b",
     "I need both. Everyone else would manage it."
    ],
    [
     "a",
     "Which one takes priority, and can any work be reassigned?"
    ],
    [
     "b",
     "Don't make excuses. I expect commitment."
    ],
    [
     "a",
     "The analysis needs a data check that takes most of today."
    ],
    [
     "b",
     "If you cared about this team, you'd do it anyway."
    ],
    [
     "a",
     "I can document the options and the risks of skipping that check."
    ],
    [
     "b",
     "Just tell me you can deliver."
    ]
   ],
   "focus": 5,
   "firstOptions": [
    "The demand relies on a loyalty penalty instead of resolving a real capacity conflict.",
    "A manager is never allowed to set deadlines.",
    "The data check is unnecessary because the director has seniority."
   ],
   "secondOptions": [
    "State the feasible options and ask for a documented priority decision.",
    "Promise everything and hide the incomplete checks.",
    "Debate whether the director is narcissistic."
   ],
   "secondExplanation": "A transparent trade-off forces the resource problem into the open."
  },
  "clueIndices": [
   3,
   5
  ],
  "insight": "The manager refuses to choose between incompatible tasks and turns the issue into an assessment of Noah's loyalty.",
  "cycle": [
   "A deadline changes without a clear capacity plan.",
   "Noah asks what should be prioritised.",
   "The director attaches shame to asking questions.",
   "Noah may promise impossible delivery to avoid reputational damage."
  ],
  "hypotheses": [
   "Manufactured loyalty pressure is replacing an honest capacity decision.",
   "Two high-priority tasks automatically prove Noah is incompetent.",
   "The director's motive can be diagnosed from one meeting."
  ],
  "sort": {
   "title": "Useful instruction or pressure?",
   "prompt": "Which statements help allocate work and which conceal the practical trade-off?",
   "categories": [
    "Operational clarification",
    "Status or loyalty pressure"
   ],
   "items": [
    {
     "text": "The client deadline is noon; postpone the optional report.",
     "category": 0
    },
    {
     "text": "Only lazy employees question deadlines.",
     "category": 1
    },
    {
     "text": "The safety check is mandatory; shift the other work.",
     "category": 0
    },
    {
     "text": "A good team member never mentions capacity.",
     "category": 1
    }
   ],
   "explanation": "One gives information for planning. The other makes the employee's identity the issue."
  },
  "revision": {
   "evidence": "The director later shows a signed regulatory instruction requiring the safety report by noon. The analysis, however, is for an internal presentation next week.",
   "prompt": "What should change in the work plan?",
   "options": [
    "Prioritise the externally required report and negotiate the non-urgent analysis.",
    "Treat both jobs as equally immovable because the director was angry.",
    "Assume the genuine deadline makes the loyalty remarks reasonable."
   ],
   "explanation": "Independent evidence identifies the hard constraint and separates it from the invented urgency."
  },
  "life": {
   "type": "one_change_experiment",
   "title": "Change the instruction, not the person",
   "prompt": "Which change makes the deadline actionable?",
   "scene": "Noah faces two tasks that cannot both fit before noon.",
   "frames": [
    [
     "Vague demand",
     "Both tasks remain urgent without priorities."
    ],
    [
     "Clear requirement",
     "The safety report has a confirmed regulatory deadline."
    ],
    [
     "Reallocated work",
     "The internal analysis moves to next week."
    ]
   ],
   "reveal": "The actual resource conflict becomes solvable once the priority is stated.",
   "options": [
    "Ask for the constraint and negotiate the feasible plan.",
    "Measure commitment through willingness to promise the impossible.",
    "Assume asking questions is inherently resistance."
   ],
   "explanation": "Clarity reduces the role of status pressure."
  },
  "action": {
   "title": "A factual reply",
   "prompt": "Noah needs to communicate what can be delivered.",
   "changePrompt": "Which message is strongest?",
   "changes": [
    "The safety report can be submitted by noon. The analysis needs a separate deadline or reassignment.",
    "I promise both are done even without the data check.",
    "I'll work through every night until you believe I'm loyal."
   ],
   "outcomes": [
    "The director receives an actionable allocation decision.",
    "An unverified report may be presented as complete.",
    "The workload problem is hidden under a loyalty contest."
   ],
   "explanation": "The reply states a feasible commitment and exposes the unresolved choice."
  },
  "transfer": {
   "title": "A school deadline",
   "prompt": "A student is told to finish two major projects tonight. Which question protects sound planning?",
   "options": [
    "Which requirement is fixed, which can move and what work is realistically possible?",
    "How can they prove character by ignoring sleep indefinitely?",
    "Which teacher should be accused of malicious intent without evidence?"
   ],
   "explanation": "A clear constraint is more useful than a vague appeal to commitment."
  },
  "recall": {
   "prompt": "What term describes artificially creating pressure to act quickly when the deadline or consequences have not been justified?",
   "answers": [
    "manufactured urgency",
    "false urgency"
   ],
   "explanation": "Manufactured urgency makes verification or fair planning seem impossible."
  },
  "takeaway": "A deadline deserves attention when its constraint is real. A loyalty test cannot make two impossible commitments feasible."
 },
 {
  "title": "Online persuasion and AI: when the message knows too much",
  "concept": "personalised persuasion and verification",
  "opening": "A video advertisement appears to know exactly what has worried you this week. It claims that ordinary people secretly share your fear and that a special offer will solve it tonight. A synthetic voice sounds like an expert you trust. Online persuasion can feel intensely personal because messages can be designed and tested for different audiences. That creates a practical problem: how do you evaluate a claim when its emotional fit is so good that checking starts to feel unnecessary?",
  "mechanism": "Digital persuasion can use targeting to match a message to interests inferred from behaviour. Personal relevance draws attention, but it is not evidence that the claim is true. Generative AI can produce persuasive text and convincing audio, reducing the effort needed to create many versions of a claim. This does not make AI messages uniquely deceptive or human messages trustworthy. The important distinction is between evidence about the promised outcome and the sensation that the speaker understands you. A message that invokes loneliness or insecurity may raise the immediate appeal of a purchase without answering whether the product works.",
  "evidence": "Research on misinformation and persuasion studies repeated exposure, perceived credibility and susceptibility to emotionally appealing messages. The findings are context-dependent, and a simple claim that AI is universally more persuasive than humans would overstate the evidence. UK consumer protection and fraud guidance emphasises checking identities and financial claims independently. The lesson's target is not a technical account of ad algorithms; it is the cognitive separation between relevance, familiarity and factual support.",
  "complication": "Some personalised advice is genuinely useful. A study tool that adapts difficulty to the learner may offer a real benefit. A person speaking calmly and professionally may also be accurate. The decisive issue is what the claimed expertise can demonstrate. If an advertisement promises a psychological result, look for properly described evidence, costs and limitations. When it asks for money or personal data, check the organisation outside the message's own links.",
  "closing": "Before acting on a message that feels made for you, ask what the message actually knows. It might know that you watched three related videos; it does not necessarily know the cause of your distress or the best solution. Evaluate the claim as though it were addressed to a stranger. The emotional fit can still matter, but it no longer does the work of evidence.",
  "case": {
   "a": "Mina",
   "b": "Sam",
   "setup": "Mina receives a persuasive AI-voiced advertisement for a costly self-help course.",
   "turns": [
    [
     "a",
     "It describes exactly what I've been worrying about lately."
    ],
    [
     "b",
     "Does it explain how the course was tested?"
    ],
    [
     "a",
     "It says thousands of people like me changed their lives."
    ],
    [
     "b",
     "Does it name the evidence or just show testimonials?"
    ],
    [
     "a",
     "The voice sounds like a psychologist I follow."
    ],
    [
     "b",
     "Could it be synthetic? Is the speaker identified?"
    ],
    [
     "a",
     "It says the discount expires in the next fifteen minutes."
    ],
    [
     "b",
     "Let's check the claim outside this advert before entering payment details."
    ]
   ],
   "focus": 6,
   "firstOptions": [
    "The advert combines personal relevance with unverified authority and urgency.",
    "A familiar voice guarantees an independent endorsement.",
    "A message matching someone's worries proves the product works."
   ],
   "secondOptions": [
    "Check independent evidence and seller identity before paying.",
    "Buy immediately because the message feels accurate.",
    "Treat all personalised tools as equally fraudulent."
   ],
   "secondExplanation": "The relevant claim is about the product, not about how accurately the advert describes Mina's concerns."
  },
  "clueIndices": [
   4,
   6
  ],
  "insight": "An apparent trusted voice and a deadline create pressure that is separate from the missing evidence of effectiveness.",
  "cycle": [
   "An advert reflects Mina's current concerns.",
   "She interprets the fit as evidence the seller understands her needs.",
   "Authority cues and urgency discourage checking.",
   "She may purchase before examining the claims."
  ],
  "hypotheses": [
   "Personal relevance and urgency are being used in a way that may bypass verification.",
   "The emotional fit proves the intervention has clinical efficacy.",
   "A synthetic voice means every claim is necessarily false."
  ],
  "sort": {
   "title": "Relevant to me or supported by evidence?",
   "prompt": "Which claims provide checkable support and which merely feel personally convincing?",
   "categories": [
    "Relevant supporting evidence",
    "Persuasive cue without verification"
   ],
   "items": [
    {
     "text": "A transparent trial report describes who benefited and how outcomes were measured.",
     "category": 0
    },
    {
     "text": "The advert repeats a phrase from videos I've watched.",
     "category": 1
    },
    {
     "text": "The seller provides clear costs and refund terms.",
     "category": 0
    },
    {
     "text": "The narration sounds like someone I admire.",
     "category": 1
    }
   ],
   "explanation": "Personal fit and source credibility are hypotheses to verify, not proof of effectiveness."
  },
  "revision": {
   "evidence": "The advertised psychologist publishes a statement denying involvement, and the seller refuses to identify any studies supporting its outcome claims.",
   "prompt": "What becomes more reasonable?",
   "options": [
    "Treat the claimed endorsement as unreliable and avoid relying on the unverified treatment promise.",
    "Purchase anyway because the voice sounded familiar.",
    "Assume every psychology course is ineffective."
   ],
   "explanation": "Independent contradiction of the endorsement and absent evidence weaken the advert's central credibility."
  },
  "life": {
   "type": "cropped_reality",
   "title": "The screenshot with missing conditions",
   "prompt": "What changes when you reveal the rest of the offer?",
   "scene": "A card says: '89% found relief.'",
   "frames": [
    [
     "Headline",
     "The percentage appears decisive."
    ],
    [
     "Small print",
     "Only people who completed the programme and answered a survey were counted."
    ],
    [
     "Missing data",
     "The number who enrolled or dropped out is not reported."
    ]
   ],
   "reveal": "The denominator and selection of respondents determine what the percentage actually means.",
   "options": [
    "The statistic cannot be interpreted confidently without knowing who was counted.",
    "The percentage automatically proves effectiveness.",
    "Any survey response is worthless regardless of method."
   ],
   "explanation": "A result needs a clear measure, sample and comparison."
  },
  "action": {
   "title": "Slow down one decision",
   "prompt": "Mina still wants help with the concern described by the advert.",
   "changePrompt": "Which next step protects judgement?",
   "changes": [
    "Find independent information about the course, its evidence and true cost.",
    "Use the advertisement's timer to decide before it expires.",
    "Share payment details because the voice seems familiar."
   ],
   "outcomes": [
    "The product can be judged through information beyond the seller's chosen message.",
    "An artificial deadline determines the decision.",
    "Personal data is disclosed to an unverified party."
   ],
   "explanation": "Independent verification creates space to examine the actual promise."
  },
  "transfer": {
   "title": "A message about investing",
   "prompt": "A synthetic voice resembles a trusted public figure and recommends a payment link. What is the key next step?",
   "options": [
    "Verify the identity and offer through a known independent source.",
    "Assume the audio is genuine because it sounds natural.",
    "Assume a familiar face proves a financial outcome."
   ],
   "explanation": "Source verification applies regardless of whether the message concerns mental health or money."
  },
  "recall": {
   "prompt": "What phrase means a message is adapted to the presumed interests or circumstances of a particular audience?",
   "answers": [
    "personalised persuasion",
    "personalized persuasion",
    "targeted persuasion"
   ],
   "explanation": "Personalised persuasion can improve relevance but does not establish the truth of the underlying claim."
  },
  "takeaway": "A message can know what attracts your attention without knowing what is true or good for you."
 },
 {
  "title": "Document facts without turning your life into an investigation",
  "concept": "evidence preservation and rumination",
  "opening": "After repeated disputes about what was said, Felix begins screenshotting everything. He also spends several hours a day rereading ordinary messages for signs of manipulation. Keeping records has helped him identify factual contradictions. Endless checking has made it harder to sleep and to focus on the rest of his life. That creates an important distinction: evidence can protect judgement, while repetitive analysis can turn into another problem. The aim is to preserve useful information without demanding certainty about every interaction.",
  "mechanism": "Documentation is useful when it records something that may otherwise be denied or forgotten, particularly where decisions have practical consequences. Rumination is repetitive thinking that circles a concern without reliably producing a new decision. The same tool, such as a message archive, can serve either function. A brief review before making a consequential decision may be proportionate. Reading the same exchange for the twentieth time to establish a hidden motive may offer temporary reassurance while keeping uncertainty central. The distinction depends on whether a review changes what you know or what you can do.",
  "evidence": "Research on rumination and repetitive negative thinking describes how recurring analysis may maintain distress in some contexts. This does not mean record-keeping in an abusive situation is itself pathological. UK coercive-control guidance recognises the importance of patterns and documentary information. A good educational resource must respect both needs: evidence that is genuinely protective, and freedom from endless self-interrogation when further checking adds no information.",
  "complication": "If there is an active threat or a formal complaint, careful documentation may be essential. The amount and method should follow the person's circumstances and safety. For someone in ordinary relationship uncertainty, obsessive record collection may harm trust and functioning. There is no universal number of screenshots that proves abuse or protects against it. The practical question is whether the information will support a clear, safe decision or whether it is being used to postpone that decision indefinitely.",
  "closing": "Choose what is worth recording before you start: dates, concrete events, relevant messages and consequences. Keep the notes accurate and brief where possible. Decide when you will revisit them and what question that review is meant to answer. If the pattern affects your safety, use a trusted independent route rather than expecting endless personal investigation to provide certainty. The purpose of documentation is to support action, not become a second occupation.",
  "case": {
   "a": "Felix",
   "b": "Ari",
   "setup": "Felix tells Ari that he reread a disagreement with his partner throughout the night.",
   "turns": [
    [
     "a",
     "I found two messages that contradict what I was told."
    ],
    [
     "b",
     "Those may be worth keeping. What decision do they affect?"
    ],
    [
     "a",
     "I need to know whether every earlier argument was manipulation."
    ],
    [
     "b",
     "Would reading the same exchange again answer that?"
    ],
    [
     "a",
     "Probably not, but I feel restless if I stop."
    ],
    [
     "b",
     "What new fact could actually change your next step?"
    ],
    [
     "a",
     "I could list the concrete incidents and speak to someone I trust."
    ],
    [
     "b",
     "That might give you a clearer route than another night of checking."
    ]
   ],
   "focus": 4,
   "firstOptions": [
    "Felix's repeated review is no longer adding information, even though some records are relevant.",
    "All documentation is harmful.",
    "Feeling restless proves every earlier dispute was imaginary."
   ],
   "secondOptions": [
    "Preserve specific relevant records and set a question for an independent discussion.",
    "Keep rereading until every motive is known.",
    "Delete everything even if there is an active safety concern."
   ],
   "secondExplanation": "Targeted records and a clear decision can reduce endless checking without discarding important evidence."
  },
  "clueIndices": [
   3,
   4
  ],
  "insight": "Felix recognises that the same review is unlikely to answer the question but feels compelled to repeat it.",
  "cycle": [
   "Felix encounters a contradiction.",
   "He tries to obtain certainty about the entire relationship.",
   "Repeated reviewing offers temporary relief but little new evidence.",
   "Uncertainty and exhaustion may keep the checking going."
  ],
  "hypotheses": [
   "The review has shifted partly from evidence gathering to repetitive reassurance seeking.",
   "Keeping any written record proves paranoia.",
   "Felix can determine every hidden intention by rereading enough."
  ],
  "sort": {
   "title": "Useful record or repetitive checking?",
   "prompt": "Judge the likely function of each action in its context.",
   "categories": [
    "Supports a concrete decision",
    "Repeats without useful new evidence"
   ],
   "items": [
    {
     "text": "Save a message relevant to a formal complaint.",
     "category": 0
    },
    {
     "text": "Read the same text for the fifteenth time to discover an unspoken motive.",
     "category": 1
    },
    {
     "text": "Write down the date and consequence of a specific threat.",
     "category": 0
    },
    {
     "text": "Compare every punctuation mark overnight to feel certain the other person is bad.",
     "category": 1
    }
   ],
   "explanation": "The distinction depends on decision value and whether new evidence is actually obtained."
  },
  "revision": {
   "evidence": "Felix learns that a formal workplace complaint requires preserving the exact dates and messages. An adviser helps him select relevant records and store them safely.",
   "prompt": "What should change?",
   "options": [
    "Targeted documentation is now plainly useful; unrelated repetitive checking still has no clear function.",
    "All the records should be discarded because rumination exists.",
    "The formal process requires establishing every private motive."
   ],
   "explanation": "Practical use can justify records while placing limits on unproductive analysis."
  },
  "life": {
   "type": "tomorrow_button",
   "title": "Where does the extra hour go?",
   "prompt": "Which use of attention is more likely to help?",
   "scene": "Felix is deciding whether to reread the same message for another hour.",
   "frames": [
    [
     "Right now",
     "A brief sense of certainty may follow rechecking."
    ],
    [
     "Tomorrow morning",
     "He is tired and still uncertain about hidden motives."
    ],
    [
     "After a clear plan",
     "He has a concise record and an appropriate next decision."
    ]
   ],
   "reveal": "Reviewing evidence should be tied to a purpose and a stopping rule when further reading does not add information.",
   "options": [
    "Use the record to inform a concrete action and stop when no useful evidence is being added.",
    "Assume another hour will inevitably reveal a private intention.",
    "Never keep evidence of serious harm."
   ],
   "explanation": "Different functions of checking call for different responses."
  },
  "action": {
   "title": "Make the record usable",
   "prompt": "Felix needs to decide how to preserve information.",
   "changePrompt": "Which plan offers a boundary around the task?",
   "changes": [
    "Write a short dated record of significant events, identify the decision it affects and seek appropriate support.",
    "Continue reviewing every message until all uncertainty disappears.",
    "Share the entire archive with everyone to prove a theory."
   ],
   "outcomes": [
    "The record becomes relevant to an actual next step.",
    "The search can continue without a possible stopping point.",
    "Private information may spread without a clear purpose."
   ],
   "explanation": "The aim is enough accuracy for the decision, not impossible access to another person's mind."
  },
  "transfer": {
   "title": "A student replaying criticism",
   "prompt": "A student rereads a tutor's comment ten times looking for hidden contempt. Which question best interrupts the loop?",
   "options": [
    "What new evidence or action would another reading provide?",
    "How long must they read to know the tutor's personality?",
    "How can they remove all uncertainty from every academic judgement?"
   ],
   "explanation": "The same functional distinction applies beyond interpersonal manipulation."
  },
  "recall": {
   "prompt": "What term describes repetitive thought that circles a concern without reliably progressing toward a decision?",
   "answers": [
    "rumination",
    "ruminating"
   ],
   "explanation": "Rumination concerns the function of the thinking process, not simply the number of thoughts."
  },
  "takeaway": "Keep evidence that protects a real decision. Rechecking without a possible new answer can keep you stuck."
 },
 {
  "title": "The integrated case: protect a decision without losing nuance",
  "concept": "integrated manipulation and safety reasoning",
  "opening": "A student organisation offers a paid internship. The coordinator tells applicants that the position will vanish unless they send a deposit that evening. When one applicant asks for a written agreement, the coordinator says the student is disloyal and that previous complaints were invented by unstable people. A social media post then says the coordinator is a 'gaslighter.' Parts of the case suggest different mechanisms. To respond well, you need to identify them separately, avoid a premature global label and choose what to verify before handing over money.",
  "mechanism": "This case brings together pressures that can operate without a single dramatic threat. The short deadline discourages investigation. The loyalty accusation attaches social cost to a reasonable question. Discrediting earlier complainants can make independent evidence seem untrustworthy. If those methods are repeated by someone who controls access to opportunities, the pattern may substantially constrain choice. But the term gaslighting is best reserved for systematic undermining of a person's confidence or credibility, not any dishonest offer. The strongest practical response rests on checkable facts: the internship terms, who holds the money, and what happens if the student refuses.",
  "evidence": "Research on gaslighting emphasises the interaction between credibility and power, while public guidance on coercive behaviour examines repeated restrictions and serious effects in specific relationships. Research on social influence explains why authority and scarcity cues can increase pressure. These sources illuminate different parts of the scenario; they should not be collapsed into one catch-all theory. An ordinary applicant can evaluate the financial offer through independent documentation without resolving the coordinator's complete psychological profile.",
  "complication": "A genuine programme might charge an administrative fee and have limited places, although such terms should be transparent and verifiable. The mere existence of urgency is not proof of fraud. A genuine organiser might also respond poorly to a question. What would change the interpretation is an independently verified contract, clear refund terms and a track record the coordinator cannot edit. A pattern of retaliating against applicants who check the terms would strengthen concern about misuse of power.",
  "closing": "You have a method for analysing influence without being consumed by suspicion. Name the precise tactic. Ask what evidence supports the underlying claim. Look at how free refusal really is. Then choose an action proportionate to the risk. The aim is neither to trust every polished message nor to diagnose every person who applies pressure. It is to keep your own decisions answerable to evidence.",
  "case": {
   "a": "Applicant",
   "b": "Coordinator",
   "setup": "An applicant asks for written internship terms before paying an unexpected deposit.",
   "turns": [
    [
     "a",
     "Could I read the contract before sending the fee?"
    ],
    [
     "b",
     "Places disappear tonight. Serious students act immediately."
    ],
    [
     "a",
     "Where is the deposit held, and is it refundable?"
    ],
    [
     "b",
     "Only disloyal applicants ask that kind of question."
    ],
    [
     "a",
     "I saw previous students say they couldn't get refunds."
    ],
    [
     "b",
     "Those people made things up. They were unstable."
    ],
    [
     "a",
     "Can I contact the host organisation independently?"
    ],
    [
     "b",
     "If you do that, I'll give your place to somebody else."
    ]
   ],
   "focus": 7,
   "firstOptions": [
    "The coordinator is discouraging verification with urgency, loyalty pressure and threats.",
    "The programme must be fraudulent solely because it has a deadline.",
    "A complaint about a refund proves a psychiatric condition."
   ],
   "secondOptions": [
    "Check the host organisation and written terms independently before paying.",
    "Pay immediately to preserve loyalty.",
    "Publicly diagnose the coordinator instead of examining the contract."
   ],
   "secondExplanation": "Verification targets the risk without relying on speculative motives."
  },
  "clueIndices": [
   3,
   7
  ],
  "insight": "The loyalty accusation and threatened loss of place both punish an ordinary request for information.",
  "cycle": [
   "The applicant requests ordinary written terms.",
   "The coordinator responds with scarcity and loyalty language.",
   "Independent complaints are dismissed as unreliable.",
   "The student may pay before checking the actual agreement."
  ],
  "hypotheses": [
   "The coordinator is using multiple pressures to prevent informed evaluation.",
   "Every programme with a fee is necessarily illegitimate.",
   "The coordinator has already been clinically diagnosed by the complaints."
  ],
  "sort": {
   "title": "Disentangle the tactics",
   "prompt": "Which statements provide legitimate programme information, and which discourage scrutiny?",
   "categories": [
    "Verifiable programme term",
    "Pressure against checking"
   ],
   "items": [
    {
     "text": "The application closes Friday and the contract is available to read.",
     "category": 0
    },
    {
     "text": "Only disloyal people ask about refunds.",
     "category": 1
    },
    {
     "text": "The host's official website lists the programme contact.",
     "category": 0
    },
    {
     "text": "You lose your place if you independently confirm our identity.",
     "category": 1
    }
   ],
   "explanation": "Transparency permits checking; pressure against scrutiny changes the nature of consent."
  },
  "revision": {
   "evidence": "The host organisation confirms it has never offered the internship and does not recognise the coordinator. The payment account belongs to an unrelated private individual.",
   "prompt": "What conclusion now has strong support?",
   "options": [
    "The offer's claimed affiliation is false; paying would be unsafe based on the evidence.",
    "The new evidence only tells us the coordinator is impatient.",
    "The student must still infer a clinical diagnosis before refusing."
   ],
   "explanation": "Independent verification directly contradicts the claimed programme."
  },
  "life": {
   "type": "advice_stress_test",
   "title": "Test 'always trust your instincts'",
   "prompt": "What should the applicant rely on after seeing the evidence?",
   "scene": "A friend says, 'Your gut feeling tells you whether any opportunity is real.'",
   "frames": [
    [
     "Fearful feeling",
     "The deadline makes the applicant anxious."
    ],
    [
     "Written terms",
     "The contract can be inspected."
    ],
    [
     "Independent source",
     "The claimed host denies any association."
    ]
   ],
   "reveal": "A feeling can direct attention toward checking; the independent evidence supports the decision.",
   "options": [
    "Use feelings as prompts for investigation and use evidence to evaluate claims.",
    "Treat fear alone as proof of deception.",
    "Ignore independently verified contradictions because the offer sounds exciting."
   ],
   "explanation": "The decision should follow reliable information rather than confidence or anxiety alone."
  },
  "action": {
   "title": "Make the final choice",
   "prompt": "The applicant has not transferred money.",
   "changePrompt": "Which next step follows from the evidence?",
   "changes": [
    "Do not pay, preserve relevant messages and use an appropriate independent reporting route.",
    "Pay first to avoid losing the promised opportunity.",
    "Reveal private credentials to challenge the coordinator."
   ],
   "outcomes": [
    "The immediate financial risk is avoided and the claim can be assessed appropriately.",
    "Funds are sent to an unverified account.",
    "Additional sensitive information is placed at risk."
   ],
   "explanation": "The established false affiliation makes refusal the proportionate choice."
  },
  "transfer": {
   "title": "A personal relationship",
   "prompt": "A partner says, 'Anyone who asks for clarification doesn't trust me.' Which question best transfers the skill?",
   "options": [
    "What information is withheld, and what happens when a reasonable question is asked?",
    "Which diagnosis will make clarification unnecessary?",
    "How can the questioning person prove loyalty by never asking again?"
   ],
   "explanation": "The consequences attached to checking are an important part of the influence."
  },
  "recall": {
   "prompt": "What phrase describes checking a claim through a channel that is independent of the person making it?",
   "answers": [
    "independent verification",
    "independent checking"
   ],
   "explanation": "An independent source can contradict or confirm the offer without depending on the claimant's chosen account."
  },
  "takeaway": "Good protection begins with checkable claims and the real cost of saying no. A label is never a substitute for either."
 }
];
