export const specs=[
 {
  "title": "When someone begins to rewrite what happened",
  "concept": "gaslighting and epistemic trust",
  "opening": "Leah knows she told her partner she would be attending a friend's birthday. The next day he says the conversation never happened and adds that her memory has been unreliable lately. A disagreement about a conversation is common. What makes this situation more concerning is that he shifts the subject from the event to whether Leah should trust her own mind. That difference is at the centre of gaslighting. The term deserves more precision than social media usually gives it.",
  "mechanism": "Gaslighting describes a pattern of psychological manipulation that can erode another person's confidence in their perception, memory or judgement. Scholars differ in how broadly they define the term. Sweet's sociological analysis places power and social credibility at the centre, while a 2026 historical review traces how meanings have shifted across psychology and psychiatry. The process is not simply saying something false. Someone may systematically deny checkable events, present the target as irrational and exploit the fact that other people trust the manipulator's account. Over time, the person may become less willing to question the other's version of reality.",
  "evidence": "Sweet's 2019 analysis argues that gaslighting often gains force through unequal power, including the use of stereotypes to discredit someone's account. A 2026 Clinical Psychology Review paper documents the term's changing definitions and the difficulty of separating it from neighbouring constructs. These studies support distinguishing systematic credibility attacks from everyday memory differences. The exact psychological mechanisms and their frequency remain active research questions; we should not treat a single conversational example as a validated diagnostic test.",
  "complication": "Two people can remember an event differently without either trying to undermine the other's reality. Memory is reconstructive and can be affected by attention, emotion and later information. A person may sincerely deny a statement that they forgot. What changes the concern is the pattern: does the denial repeatedly target the other person's credibility, particularly when independent records exist, and does it constrain their freedom to act? Do not require someone who feels unsafe to win a courtroom-level debate about intent before seeking support.",
  "closing": "Hold onto two distinctions. One question is what happened in a particular incident. The other is whether somebody repeatedly uses disagreement to make you distrust your own capacity to know what happened. The first can sometimes be resolved with records. The second requires looking at the relationship and its power. If the pattern makes you increasingly isolated or dependent on the other person's version, the problem is larger than a disputed memory.",
  "case": {
   "a": "Leah",
   "b": "Miles",
   "setup": "Leah recalls telling Miles about a birthday gathering. They disagree about their earlier conversation.",
   "turns": [
    [
     "a",
     "I told you on Tuesday that I was seeing Noor on Saturday."
    ],
    [
     "b",
     "You never said that. You're mixing things up again."
    ],
    [
     "a",
     "I remember telling you while we were making dinner."
    ],
    [
     "b",
     "You do this all the time. You can't rely on your own memory."
    ],
    [
     "a",
     "I sent you the details afterwards. The message is still there."
    ],
    [
     "b",
     "You only sent that because you knew I'd question you."
    ],
    [
     "a",
     "Why are we talking about my memory instead of Saturday?"
    ],
    [
     "b",
     "Because I have to keep track of things for you."
    ]
   ],
   "focus": 3,
   "firstOptions": [
    "Miles attacks Leah's reliability rather than investigating the disputed event.",
    "The disagreement by itself proves a systematic abuse pattern.",
    "The message guarantees that both people remember every detail accurately."
   ],
   "secondOptions": [
    "Retain the message and consider whether this credibility attack is repeated.",
    "Ask Miles to be the only person who records events.",
    "Abandon every outside friendship to avoid disputes."
   ],
   "secondExplanation": "Independent records and trusted outside perspectives can help preserve access to information."
  },
  "clueIndices": [
   3,
   7
  ],
  "insight": "The repeated claim that Leah cannot trust her own mind is more revealing than an ordinary 'I don't remember that.'",
  "cycle": [
   "Leah reports a conversation about her plans.",
   "Miles denies the event and attacks her ability to remember.",
   "The message is explained away rather than examined.",
   "Leah may start deferring to Miles's account even when she has evidence of her own."
  ],
  "hypotheses": [
   "The exchange contains a credibility attack characteristic of gaslighting tactics.",
   "Any disagreement about plans is automatically gaslighting.",
   "One text message proves the entire relationship history."
  ],
  "sort": {
   "title": "A disagreement or an attack on credibility?",
   "prompt": "Which statements debate an event and which undermine the person's ability to know?",
   "categories": [
    "Dispute about an event",
    "Attack on credibility"
   ],
   "items": [
    {
     "text": "I remember the conversation differently; can we check the messages?",
     "category": 0
    },
    {
     "text": "You always invent things because your mind can't be trusted.",
     "category": 1
    },
    {
     "text": "I didn't hear that, but I may have missed it.",
     "category": 0
    },
    {
     "text": "Only I can keep track of reality for you.",
     "category": 1
    }
   ],
   "explanation": "The second category makes the person's mind the alleged defect rather than investigating the issue."
  },
  "revision": {
   "evidence": "Leah finds several months of messages in which Miles privately acknowledged plans, then later denied them and repeatedly told others she was 'confused.'",
   "prompt": "What inference strengthens?",
   "options": [
    "Concern about a repeated pattern of credibility-undermining becomes substantially stronger.",
    "Every event in the relationship is now known.",
    "Leah must prove Miles's conscious intention before taking any protective action."
   ],
   "explanation": "Repeated, independently checkable contradictions strengthen the pattern-level account."
  },
  "life": {
   "type": "cropped_reality",
   "title": "The missing earlier message",
   "prompt": "How does the expanded record change the account?",
   "scene": "Miles says to a friend, 'Leah keeps inventing conversations.'",
   "frames": [
    [
     "His summary",
     "He presents Leah as an unreliable narrator."
    ],
    [
     "Earlier receipt",
     "A message shows he read her plan."
    ],
    [
     "New accusation",
     "He calls the receipt evidence that she is trying to trap him."
    ]
   ],
   "reveal": "The extra information shows an attempt to dismiss evidence that contradicts his summary.",
   "options": [
    "The credibility attack needs scrutiny alongside the independent record.",
    "Miles's summary should replace the messages.",
    "Every memory disagreement is therefore gaslighting."
   ],
   "explanation": "Who controls the evidence and whose account is believed are central questions."
  },
  "action": {
   "title": "Preserve access to reality",
   "prompt": "Leah wants to think clearly and stay connected to people she trusts.",
   "changePrompt": "What could help without requiring a confession from Miles?",
   "changes": [
    "Keep relevant records and speak privately with a trusted person about the repeated pattern.",
    "Let Miles maintain the only record of plans.",
    "Cut off Noor to avoid creating more conflict."
   ],
   "outcomes": [
    "Leah retains independent information and another perspective.",
    "The disputed account becomes harder to check.",
    "Isolation makes the other person's version harder to challenge."
   ],
   "explanation": "A practical response protects information and relationships without making diagnosis a prerequisite."
  },
  "transfer": {
   "title": "A workplace account",
   "prompt": "A supervisor repeatedly claims an employee imagined earlier instructions despite archived emails and tells colleagues the employee is mentally unreliable. What requires attention?",
   "options": [
    "The pattern of denying evidence while discrediting the employee's judgement.",
    "Whether the employee can remember every word perfectly.",
    "Whether the supervisor ever appears friendly."
   ],
   "explanation": "Credibility, documentation and power are more informative than isolated tone."
  },
  "recall": {
   "prompt": "What term describes a repeated attempt to undermine another person's confidence in their perception or memory?",
   "answers": [
    "gaslighting"
   ],
   "explanation": "Use the term for a credibility-undermining process, not every disagreement or mistake."
  },
  "takeaway": "The danger lies in a recurring attempt to make someone distrust their own capacity to know what happened."
 },
 {
  "title": "The pattern matters more than the perfect quotation",
  "concept": "pattern recognition in psychological abuse",
  "opening": "People sometimes collect screenshots hoping to find a single sentence that proves their partner is manipulative. A dramatic quote may be informative, but the relationship's structure can matter much more. Consider someone who repeatedly argues over what was said, demands that conversations happen without witnesses and becomes angry when their partner seeks an independent perspective. The harm may lie in what those events cumulatively make possible, not in any one perfect example.",
  "mechanism": "Patterns emerge when related behaviours recur and shape the other person's available choices. Denying a conversation, discrediting memory and controlling who can be consulted may work together even when each action could be explained separately. That cumulative effect is important in coercive-control research. It can lead a person to monitor their own behaviour, withdraw from ordinary relationships or feel unable to make a decision without approval. We must avoid a crude rule that three incidents automatically establish abuse. Frequency, seriousness, power and impact all matter; so does credible evidence that the behaviours are part of a constraining pattern.",
  "evidence": "UK statutory guidance on controlling or coercive behaviour explicitly emphasises cumulative impact and the context of the relationship. Sweet's account of gaslighting explains how social power can make one person's story more authoritative than another's. A 2025 mixed-methods systematic review of gaslighting in gender-based violence identifies recurring tactics and survivor outcomes, including threats to epistemic confidence. Those findings guide recognition; they do not supply a diagnostic score for a fictional couple.",
  "complication": "There is a risk in encouraging people to document every sentence obsessively. An endless private investigation can consume attention and increase distress, especially when the evidence is never allowed to count. A safer approach may be to preserve key records, notice how choices are changing and seek an independent assessment of the pattern where necessary. In a relationship involving threats, direct confrontation or 'testing' the person's response may increase risk. Educational examples should never turn safety into a debate exercise.",
  "closing": "Instead of asking whether you have caught someone in the most convincing sentence, ask what has changed in your freedom, contacts and confidence over time. A pattern may deserve support and protective action before anybody admits it. The practical goal is clarity about effects and available choices, not a perfect reconstruction of every argument.",
  "case": {
   "a": "Nora",
   "b": "Emil",
   "setup": "Nora tells Emil she wants to speak with a friend after another disagreement.",
   "turns": [
    [
     "a",
     "I want to talk this through with Sian. She knows both of us."
    ],
    [
     "b",
     "Why are you bringing outsiders into our private relationship?"
    ],
    [
     "a",
     "I need another perspective because I'm confused about what happened."
    ],
    [
     "b",
     "Your friends just fill your head with ideas."
    ],
    [
     "a",
     "Last week you told me I was remembering the date wrong."
    ],
    [
     "b",
     "I wouldn't have to correct you if you listened properly."
    ],
    [
     "a",
     "I've stopped asking Sian things because it starts another fight."
    ],
    [
     "b",
     "Then we've finally got somewhere. Keep our matters between us."
    ]
   ],
   "focus": 7,
   "firstOptions": [
    "The conversation suggests a pattern in which independent consultation is discouraged.",
    "Privacy preferences always establish coercive control.",
    "Nora is wrong to seek another perspective."
   ],
   "secondOptions": [
    "Consider the cumulative restrictions and keep safe independent connections.",
    "Secretly stage a risky confrontation to force an admission.",
    "Let Emil decide who Nora is allowed to contact."
   ],
   "secondExplanation": "Access to independent support matters; safety should govern how any concern is handled."
  },
  "clueIndices": [
   3,
   7
  ],
  "insight": "Nora's contact with others becomes contingent on avoiding conflict, and Emil explicitly rewards that isolation.",
  "cycle": [
   "Nora questions an account of a disagreement.",
   "Emil attacks the influence of her friends.",
   "She avoids consulting them to prevent conflict.",
   "Without outside perspectives, his account becomes harder to challenge."
  ],
  "hypotheses": [
   "The repeated discouragement of outside perspectives may be constraining Nora's autonomy.",
   "Any wish for private conversations is automatically abuse.",
   "One friendly moment would make the pattern harmless."
  ],
  "sort": {
   "title": "Privacy or restriction?",
   "prompt": "Which statements respect mutual privacy, and which control the other person's support?",
   "categories": [
    "Mutual privacy preference",
    "Restriction of independent support"
   ],
   "items": [
    {
     "text": "Let's agree before sharing each other's private medical details.",
     "category": 0
    },
    {
     "text": "You're not allowed to speak to your friends about your worries.",
     "category": 1
    },
    {
     "text": "I want a quiet moment before we discuss this with family.",
     "category": 0
    },
    {
     "text": "I'll punish you whenever you seek another opinion.",
     "category": 1
    }
   ],
   "explanation": "A negotiated preference and a unilateral restriction affect freedom differently."
  },
  "revision": {
   "evidence": "Nora reports that Emil has also begun tracking her messages, turning up uninvited at meetings with friends and threatening to end her housing arrangement if she talks about the relationship.",
   "prompt": "How should the response change?",
   "options": [
    "Concern about coercive control and safety strengthens; independent, safety-conscious support becomes more urgent.",
    "The new events merely show he values privacy.",
    "Nora should force a confrontation alone to prove his intentions."
   ],
   "explanation": "Multiple restrictions and threats create a more serious risk pattern than an isolated argument."
  },
  "life": {
   "type": "invisible_backpack",
   "title": "The accumulated cost",
   "prompt": "What is the most important hidden burden?",
   "scene": "Nora hesitates before meeting a friend for coffee.",
   "frames": [
    [
     "Recent argument",
     "She expects to be accused of disloyalty."
    ],
    [
     "Phone monitoring",
     "She worries someone will read the messages."
    ],
    [
     "Housing threat",
     "She fears practical consequences for seeking advice."
    ]
   ],
   "reveal": "The apparent choice to stay home may be shaped by multiple pressures that restrict autonomy.",
   "options": [
    "Judge the situation through the cumulative constraints rather than the coffee invitation alone.",
    "Assume she has freely chosen isolation because nobody physically stopped her.",
    "Ask her to collect a more dramatic quote before taking concerns seriously."
   ],
   "explanation": "The practical availability of choices is affected by credible threats and surveillance."
  },
  "action": {
   "title": "Choose a safety-conscious next step",
   "prompt": "Nora wants support but faces threats over her contacts.",
   "changePrompt": "Which direction respects the risk?",
   "changes": [
    "Seek trusted, confidential support through a safe channel and consider the consequences of each step.",
    "Announce every concern during a confrontation Emil controls.",
    "Give Emil exclusive access to her phone to restore trust."
   ],
   "outcomes": [
    "She can obtain perspective and plan with attention to safety.",
    "Risk may escalate without independent support.",
    "Her control over personal information decreases."
   ],
   "explanation": "No single scripted confrontation is required; the safest route depends on circumstances."
  },
  "transfer": {
   "title": "A different form of control",
   "prompt": "A family member begins deciding which relatives someone may call and threatening money if they refuse. What matters most?",
   "options": [
    "The repeated restriction of contact and independence, along with its impact.",
    "Whether every phone call contains an insult.",
    "Whether the family member says the restriction is intended as care."
   ],
   "explanation": "The effect on freedom and the context of power warrant attention."
  },
  "recall": {
   "prompt": "What phrase describes repeated behaviour used to restrict another person's independence through threats or control?",
   "answers": [
    "coercive control",
    "controlling or coercive behaviour"
   ],
   "explanation": "Coercive control concerns a pattern and cumulative effect, not a checklist of dramatic quotations."
  },
  "takeaway": "A harmful pattern is visible in the choices someone loses, not only in the words spoken during the worst argument."
 },
 {
  "title": "Who gets believed? How power reshapes reality",
  "concept": "credibility and structural power",
  "opening": "A junior employee reports a supervisor's unfair treatment. The supervisor tells management that the employee is emotionally unstable and frequently misremembers instructions. The employee has detailed records, yet managers assume the supervisor's account is more credible because of rank. The case illustrates a problem beyond interpersonal persuasion: a person can use existing power to influence whose version of events counts as knowledge. Understanding this makes gaslighting more than an argument about memory.",
  "mechanism": "Credibility is the degree of trust people give an account. It should depend on evidence and appropriate knowledge, but status, stereotypes and institutional authority can change how it is allocated. **Epistemic injustice** refers to unfair treatment of someone as a knower: their account may be dismissed for reasons unrelated to its merits. Sweet's analysis emphasises how gaslighting can draw on gendered and institutional inequalities, particularly when the powerful person can portray another as irrational. The victim's repeated need to prove ordinary events can itself become exhausting and isolating. The explanation focuses on who controls the evidence and whose words are automatically treated as decisive.",
  "evidence": "Sweet's 2019 paper was developed from qualitative work and a sociological theory of gaslighting, not a laboratory experiment proving that every status difference produces abuse. A 2026 historical review also notes shifts toward concepts of credibility and power in contemporary accounts. The evidence supports attention to institutions rather than reducing the process to 'one person lies and another is confused.' In a workplace case, human-resources procedures should examine records and avoid assuming that seniority is evidence of factual accuracy.",
  "complication": "Rank sometimes carries relevant expertise. An experienced engineer may reasonably be believed about a technical fault when they can explain and demonstrate it. The unfairness arises when status substitutes for evidence about events within another person's experience. It also matters when the employee's records are incomplete; appropriate investigation remains necessary. Respecting credibility means using fair standards for both accounts, not preselecting the person who must be right.",
  "closing": "Ask how each person's account is being tested. Can a lower-status person present records without retaliation? Are objections evaluated on their substance? Can an independent reviewer challenge the supervisor's version? Those questions help identify institutional conditions that allow credibility attacks to succeed. They also point to a remedy: fair procedures, reliable records and routes that do not depend on the more powerful party's permission.",
  "case": {
   "a": "Jas",
   "b": "Manager",
   "setup": "Jas disputes a supervisor's claim that instructions were never issued. The supervisor discusses the complaint with a senior manager.",
   "turns": [
    [
     "a",
     "I have the email where the instruction was given."
    ],
    [
     "b",
     "You tend to get confused when you're under pressure."
    ],
    [
     "a",
     "Could we read the email together?"
    ],
    [
     "b",
     "I've led this team for fifteen years. I know what I said."
    ],
    [
     "a",
     "The date and wording are visible here."
    ],
    [
     "b",
     "People here trust my judgement over yours."
    ],
    [
     "a",
     "I'd prefer someone independent review the record."
    ],
    [
     "b",
     "That would show you can't manage basic instructions."
    ]
   ],
   "focus": 5,
   "firstOptions": [
    "The supervisor uses rank to discount a record and discredit Jas.",
    "Long tenure makes every recollection accurate.",
    "The email alone identifies the supervisor's complete intentions."
   ],
   "secondOptions": [
    "Request an independent review of the actual written instruction.",
    "Accept the supervisor's account because of title.",
    "Stop recording instructions because it appears disrespectful."
   ],
   "secondExplanation": "A fair process should weigh the record rather than assuming one role guarantees credibility."
  },
  "clueIndices": [
   3,
   5
  ],
  "insight": "The supervisor explicitly invokes tenure and reputation instead of addressing the document.",
  "cycle": [
   "Jas presents a contradictory written record.",
   "The supervisor invokes status and labels Jas unreliable.",
   "Management may discount Jas without examining the email.",
   "Jas has less access to an effective challenge unless independent review exists."
  ],
  "hypotheses": [
   "Status and credibility are being used to avoid examination of the evidence.",
   "Rank alone settles the historical fact.",
   "The document proves all future allegations against the supervisor."
  ],
  "sort": {
   "title": "Evidence or authority shortcut?",
   "prompt": "Which responses judge the claim and which assume the senior person must be right?",
   "categories": [
    "Evidence-led review",
    "Credibility bias"
   ],
   "items": [
    {
     "text": "The email can be checked against its date and recipients.",
     "category": 0
    },
    {
     "text": "A supervisor must remember better because they supervise.",
     "category": 1
    },
    {
     "text": "Both accounts should be considered against available records.",
     "category": 0
    },
    {
     "text": "A junior employee's confusion proves the complaint is unfounded.",
     "category": 1
    }
   ],
   "explanation": "Relevant expertise can inform a judgement; status cannot replace evidence about a document."
  },
  "revision": {
   "evidence": "A second manager reviews the email server and confirms the instruction and date. The original supervisor then claims the employee forged the message without offering any evidence.",
   "prompt": "What is now more concerning?",
   "options": [
    "The repeated rejection of independent evidence and the personal credibility attack.",
    "The employee's rank is still too low to be trusted.",
    "The server record means every future complaint is automatically proven."
   ],
   "explanation": "Additional independent corroboration strengthens the documentary account and the concern about the dismissal tactic."
  },
  "life": {
   "type": "attention_spotlight",
   "title": "What the room notices first",
   "prompt": "Which neglected detail should shape the judgement?",
   "scene": "In a meeting, a senior manager speaks confidently while a junior worker quietly shows an email.",
   "frames": [
    [
     "Uniform and title",
     "The manager's authority is highly visible."
    ],
    [
     "Email metadata",
     "The relevant record has date, sender and recipients."
    ],
    [
     "Response",
     "The manager shifts to criticising the employee's character."
    ]
   ],
   "reveal": "The independently checkable record deserves attention regardless of who appears more impressive.",
   "options": [
    "Evaluate documentary evidence and investigate credibility attacks separately.",
    "Assume confident speech proves factual accuracy.",
    "Choose the side with the higher job title."
   ],
   "explanation": "Visual status cues are not substitutes for evidence."
  },
  "action": {
   "title": "Design a fair route",
   "prompt": "A workplace wants to investigate disputed instructions.",
   "changePrompt": "Which procedure best reduces status bias?",
   "changes": [
    "Allow records to be reviewed by someone independent of the people involved.",
    "Let the higher-ranking person decide which evidence is admissible.",
    "Dismiss complaints that challenge managers."
   ],
   "outcomes": [
    "The factual question can be assessed without the disputed authority controlling the review.",
    "The more powerful account is protected from scrutiny.",
    "Employees lose a credible way to correct errors."
   ],
   "explanation": "Procedural independence helps separate rank from evidential strength."
  },
  "transfer": {
   "title": "A healthcare encounter",
   "prompt": "A patient brings a symptom diary, and a professional dismisses it solely as 'anxious exaggeration.' What principle matters?",
   "options": [
    "Evaluate the observations on their merits while considering the professional's clinical expertise.",
    "Assume the patient must always be right.",
    "Assume a medical title makes the diary irrelevant."
   ],
   "explanation": "Relevant expertise and respect for first-person evidence can coexist."
  },
  "recall": {
   "prompt": "What two-word term describes unfairly discounting someone's capacity to know or report something?",
   "answers": [
    "epistemic injustice",
    "credibility injustice"
   ],
   "explanation": "Epistemic injustice concerns whose testimony is unfairly given less weight."
  },
  "takeaway": "A person's status may influence who gets believed. Good judgement asks whether that influence is justified by the evidence."
 },
 {
  "title": "Coercive control is bigger than an argument",
  "concept": "coercive control and safety",
  "opening": "A couple argues about spending money. In one household, they disagree, share figures and eventually decide. In another, one person hides the other's bank card, tracks spending and threatens to withdraw housing if they ask questions. Calling both situations a 'money disagreement' conceals the crucial difference. The second involves restrictions on practical freedom. Understanding coercive control requires looking at the pattern and the consequences rather than asking whether the arguments sound equally unpleasant.",
  "mechanism": "Control can operate through credible consequences rather than force used in every moment. Someone may change what they buy, whom they see or what they say because they anticipate punishment. Over time, the apparent range of choices narrows. Coercive control therefore involves a pattern of domination that may include monitoring, isolation, intimidation or economic restriction. Legal definitions depend on jurisdiction and additional criteria; a learning exercise cannot decide a criminal offence. The psychologically important part is that the person's behaviour becomes organised around avoiding the controller's response, often before any direct instruction is given.",
  "evidence": "England and Wales statutory guidance on controlling or coercive behaviour emphasises repeated or continuous conduct, serious effect and the context of intimate or family relationships. It also recognises economic abuse and the cumulative impact of patterns that may not appear dramatic in isolation. This is not the same evidence category as an experimental finding about a cognitive bias; legal and safeguarding guidance describes conduct and duties. A course should clearly separate those sources and avoid inventing legal certainty about a fictional situation.",
  "complication": "People can jointly agree to budgets and privacy rules without abuse. An arrangement becomes suspect when one person has no realistic ability to question it and faces threats for seeking independence. Safety matters because an instructional script that tells someone to confront a controlling partner can increase risk. There is no general requirement to debate the pattern or obtain the other person's confession. The learner's job is to recognise relevant signs and understand the value of independent, confidential support when needed.",
  "closing": "Ask what practical choices remain available. Can each person access money and communicate with others? Are disagreements followed by intimidation or loss of essential resources? Can anyone safely refuse? If the answer is no, the problem is more serious than poor communication. The next step should be guided by safety and the person's circumstances, not by an expectation that a perfect argument will persuade the controlling party.",
  "case": {
   "a": "Imani",
   "b": "Cal",
   "setup": "Imani wants to pay for a course using her own earnings. Cal controls the household account.",
   "turns": [
    [
     "a",
     "I'd like to enrol in the course next month."
    ],
    [
     "b",
     "I make the financial decisions because you're careless."
    ],
    [
     "a",
     "I earned the fee and have checked the budget."
    ],
    [
     "b",
     "I'll block your bank access if you book it."
    ],
    [
     "a",
     "I thought we agreed to share information, not permission."
    ],
    [
     "b",
     "If you talk to your sister about money, I'll cancel the tenancy."
    ],
    [
     "a",
     "I need to know what accounts I can access safely."
    ],
    [
     "b",
     "You won't need to worry if you just follow my rules."
    ]
   ],
   "focus": 5,
   "firstOptions": [
    "The threats and restrictions suggest a serious controlling pattern rather than an ordinary budget dispute.",
    "Any shared budget is coercive control.",
    "The scenario proves an offence under every legal system."
   ],
   "secondOptions": [
    "Seek confidential, safety-conscious support and preserve access to essential information where safe.",
    "Confront Cal alone and demand a confession.",
    "Assume compliance will guarantee that all threats stop."
   ],
   "secondExplanation": "The threats create risks that should guide how support is sought."
  },
  "clueIndices": [
   3,
   5
  ],
  "insight": "The bank threat and housing threat make refusal costly and reach beyond a disagreement about the course fee.",
  "cycle": [
   "Imani considers an independent financial choice.",
   "Cal threatens essential access and housing.",
   "Imani anticipates punishment for ordinary decisions.",
   "She may stop using money or seeking advice without further direct orders."
  ],
  "hypotheses": [
   "The threats are restricting Imani's autonomy through control over essential resources.",
   "A shared budget explains all the threats as normal negotiation.",
   "The situation can be solved by choosing more persuasive words alone."
  ],
  "sort": {
   "title": "Agreement or domination?",
   "prompt": "Which statements describe a jointly reviewable rule and which impose unilateral threats?",
   "categories": [
    "Joint financial arrangement",
    "Coercive restriction"
   ],
   "items": [
    {
     "text": "We both review the shared bills each month.",
     "category": 0
    },
    {
     "text": "I'll block your card if you enrol in a course.",
     "category": 1
    },
    {
     "text": "Let's agree how much each can spend from the common account.",
     "category": 0
    },
    {
     "text": "You lose housing if you ask your sister for help.",
     "category": 1
    }
   ],
   "explanation": "The ability to question and refuse without threats is central to the distinction."
  },
  "revision": {
   "evidence": "Imani says Cal has also restricted contact with friends and monitors messages after every disagreement. She now avoids raising ordinary decisions for fear of losing housing.",
   "prompt": "What becomes more important?",
   "options": [
    "Recognising a repeated control pattern and choosing a safety-informed support route.",
    "Trying one more clever argument before seeking support.",
    "Determining which personality disorder Cal must have."
   ],
   "explanation": "The cumulative effect on autonomy and safety matters more than a diagnostic speculation."
  },
  "life": {
   "type": "invisible_backpack",
   "title": "The choices that disappear",
   "prompt": "What is Imani carrying before she even considers the course?",
   "scene": "Imani looks at the course application but has not opened it.",
   "frames": [
    [
     "Financial access",
     "Her bank access can be blocked."
    ],
    [
     "Housing",
     "A threat is linked to speaking with family."
    ],
    [
     "Social support",
     "Contact with others may trigger monitoring."
    ]
   ],
   "reveal": "The apparent hesitation has an understandable basis in threatened consequences.",
   "options": [
    "The available choices are constrained by credible threats, not merely indecision.",
    "An unanswered application proves Imani is unmotivated.",
    "The only issue is whether the course is good value."
   ],
   "explanation": "Look at the consequences attached to ordinary decisions."
  },
  "action": {
   "title": "Respond according to safety",
   "prompt": "Imani wants independent advice about the threats.",
   "changePrompt": "Which direction best recognises the situation?",
   "changes": [
    "Find a safe, confidential route to support and discuss options without alerting Cal unnecessarily.",
    "Announce a plan to challenge every restriction while alone with Cal.",
    "Give Cal all account access so he feels reassured."
   ],
   "outcomes": [
    "Support can be planned around practical safety and individual circumstances.",
    "The person may face avoidable escalation.",
    "Financial dependence can deepen."
   ],
   "explanation": "In controlling situations, safety changes what a proportionate response looks like."
  },
  "transfer": {
   "title": "Beyond partners",
   "prompt": "A relative repeatedly threatens to stop essential care if an adult family member contacts friends. What is the strongest concern?",
   "options": [
    "The repeated restriction of autonomy through threats involving essential support.",
    "That the family member dislikes outsiders.",
    "That a single disagreement makes every shared-care arrangement abusive."
   ],
   "explanation": "Dependence and credible consequences create power that can be misused."
  },
  "recall": {
   "prompt": "What phrase describes repeated behaviour that restricts another person's autonomy through threats, intimidation or control?",
   "answers": [
    "coercive control",
    "controlling behaviour",
    "controlling or coercive behaviour"
   ],
   "explanation": "The defining concern is a pattern and its serious effect on freedom."
  },
  "takeaway": "When refusal risks money, housing or safe contact with others, the problem has moved beyond ordinary disagreement."
 }
];
