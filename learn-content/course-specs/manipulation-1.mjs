export const specs=[
 {
  "title": "When does persuasion turn into pressure?",
  "concept": "persuasion and informed choice",
  "opening": "Your flatmate wants you to agree to a new rent arrangement. She explains that costs have risen and shows you the bills. Another flatmate says you owe her an immediate answer because she has 'done so much for you.' Both want the same outcome. Only one approach gives you a fair chance to consider it. To understand manipulation properly, begin with how a request changes another person's freedom to decide, rather than assuming that trying to influence somebody is always harmful.",
  "mechanism": "Persuasion presents reasons someone can examine. A person remains able to disagree, ask questions and change their mind. Pressure makes refusal more costly by attaching threats, humiliation or penalties that are unrelated to the merits of the proposal. **Manipulation** is a broad and contested term; it often describes influence that obscures relevant information or directs another person's judgement for the influencer's advantage. An action can be manipulative even when the speaker believes the goal is worthwhile. The critical questions are what information is available, whether objections can be heard and what happens if the person says no.",
  "evidence": "Research on gaslighting and coercive control illustrates why influence cannot be understood solely from a single sentence. Sweet's 2019 sociological analysis emphasises the role of structural power in undermining a person's credibility. UK statutory guidance on controlling or coercive behaviour treats repeated restriction of another person's autonomy as consequential, rather than defining a problem by whether one request sounds polite. Those are more serious processes than ordinary bargaining; the distinction prevents the word 'manipulation' from becoming a label for every disagreement.",
  "complication": "A genuine emergency can justify asking for a quick decision. A parent can restrict a child's unsafe action without acting for selfish advantage. An employer can impose a legitimate deadline. Context changes the judgement, but it does not make threats or concealment harmless. A useful test is whether the person can understand the proposal's terms and whether the consequence of declining is fair in that relationship. We should not require perfect calm or equal bargaining power in every conversation; we should examine the actual control being exercised.",
  "closing": "When a request feels difficult to refuse, locate the cost of saying no. Is it a relevant consequence of the choice, or a punishment designed to bypass your judgement? Ask for the information needed to decide and make the choice explicit. If refusal produces intimidation, that behaviour is part of the evidence. You do not need to establish a secret motive before acting on it.",
  "case": {
   "a": "Priya",
   "b": "Alex",
   "setup": "Flatmates are discussing a proposed increase in their shared utilities contribution.",
   "turns": [
    [
     "a",
     "I've got the new bills. Could we each pay ten pounds more?"
    ],
    [
     "b",
     "I need to check the figures and my budget."
    ],
    [
     "a",
     "Of course. I can send the statements."
    ],
    [
     "b",
     "Thanks. I can decide tomorrow."
    ],
    [
     "a",
     "Actually, if you were a decent friend you wouldn't make this difficult."
    ],
    [
     "b",
     "Is the increase urgent or are you worried I'll refuse?"
    ],
    [
     "a",
     "I don't want you saying no after everything I've done for you."
    ],
    [
     "b",
     "I can consider the bills. My friendship isn't a payment term."
    ]
   ],
   "focus": 6,
   "firstOptions": [
    "The request becomes pressuring when friendship is used as a penalty for refusal.",
    "Showing the bills is inherently manipulative.",
    "Alex's request for time proves bad faith."
   ],
   "secondOptions": [
    "Ask for the figures and keep the decision separate from the friendship test.",
    "Accept any cost to avoid looking disloyal.",
    "Accuse Priya of a clinical personality disorder."
   ],
   "secondExplanation": "The numbers can be evaluated without accepting an unrelated judgement of loyalty."
  },
  "clueIndices": [
   4,
   6
  ],
  "insight": "The relevant change is that refusal becomes evidence of being a bad friend rather than a decision about shared expenses.",
  "cycle": [
   "Priya requests a contribution increase.",
   "Alex asks for time to examine the bills.",
   "Priya makes refusal carry a friendship penalty.",
   "Alex feels compelled to agree without evaluating the financial proposal."
  ],
  "hypotheses": [
   "The later language uses relational pressure that undermines free evaluation.",
   "Any request to split costs equally is manipulation.",
   "The conversation proves Priya intended lifelong psychological abuse."
  ],
  "sort": {
   "title": "Reasons or penalties?",
   "prompt": "Sort information that helps evaluate a request from pressure attached to saying no.",
   "categories": [
    "Relevant information",
    "Unrelated pressure"
   ],
   "items": [
    {
     "text": "Here are the new utility bills.",
     "category": 0
    },
    {
     "text": "If you cared about me, you'd say yes immediately.",
     "category": 1
    },
    {
     "text": "The contract payment is due next Thursday.",
     "category": 0
    },
    {
     "text": "I'll tell everyone you're selfish if you refuse.",
     "category": 1
    }
   ],
   "explanation": "The distinction follows what the statement contributes to an informed choice."
  },
  "revision": {
   "evidence": "Priya shows the bills, and they confirm the increase. She also apologises for the loyalty language and agrees Alex can decide after checking the tenancy.",
   "prompt": "What now has stronger support?",
   "options": [
    "The financial request is justified by evidence, while the earlier pressure was still inappropriate.",
    "Her apology makes the figures irrelevant.",
    "The confirmed bills mean the loyalty threat was fair."
   ],
   "explanation": "A justified request and an unjustified tactic can coexist. Assess them independently."
  },
  "life": {
   "type": "advice_stress_test",
   "title": "Does the rule still work?",
   "prompt": "What should determine whether this is legitimate persuasion?",
   "scene": "A poster says, 'Anyone who wants you to agree is manipulating you.'",
   "frames": [
    [
     "Shared bills",
     "A flatmate presents transparent costs."
    ],
    [
     "Loyalty threat",
     "A flatmate treats refusal as proof of bad character."
    ],
    [
     "Deadline",
     "A contract has a real payment date."
    ]
   ],
   "reveal": "Wishing for agreement is ordinary; concealing information or penalising refusal changes the situation.",
   "options": [
    "Ask what reasons and choices are available, then examine the consequences of declining.",
    "Treat all disagreement as abuse.",
    "Assume every urgent request is justified."
   ],
   "explanation": "Describe the mechanism rather than judging desire for influence alone."
  },
  "action": {
   "title": "Take the decision back",
   "prompt": "Alex needs a clear next message.",
   "changePrompt": "Which reply protects an informed choice?",
   "changes": [
    "Send me the bills. I'll check them and answer by tomorrow evening.",
    "Fine, but only because I don't want you to hate me.",
    "I'll refuse without reading any figures."
   ],
   "outcomes": [
    "The numbers and timing are clear, and friendship is not used as a test.",
    "The request succeeds through a loyalty penalty.",
    "A potentially fair proposal is rejected without examination."
   ],
   "explanation": "Separating the actual decision from the threat allows a more accurate choice."
  },
  "transfer": {
   "title": "A workplace variation",
   "prompt": "A manager asks you to work overtime and says the extra hours are voluntary, then threatens to ruin your references if you decline. What's the strongest interpretation?",
   "options": [
    "The supposed choice is undermined by a punitive consequence for refusal.",
    "Calling it voluntary guarantees free consent.",
    "Any request to work overtime is automatically illegal."
   ],
   "explanation": "The penalty changes what choosing no means."
  },
  "recall": {
   "prompt": "What term describes influence that undermines informed judgement through concealment or pressure?",
   "answers": [
    "manipulation",
    "manipulative influence"
   ],
   "explanation": "The concept concerns how another person's judgement or freedom is affected, not simply wanting agreement."
  },
  "takeaway": "The clearest test of a request is what happens when the other person needs time or says no."
 },
 {
  "title": "The favour that becomes a loyalty test",
  "concept": "reciprocity and obligations",
  "opening": "Jules helps Morgan move house on Saturday. On Monday, Jules asks Morgan to lie to their manager about missed work. When Morgan refuses, Jules replies that friendship only counts when somebody 'returns the favour.' The request relies on a real social norm: people usually want to repay help. That norm makes relationships cooperative, but it can be misused when repayment is defined as obedience rather than reasonable consideration. This lesson makes the point concrete: what obligation did the original favour create?",
  "mechanism": "Reciprocity means responding to a benefit or kindness with appropriate consideration. It is one way people sustain trust over time. It is not a blank cheque allowing another person to demand any action later. A manipulative loyalty test converts a voluntary favour into a debt with undefined terms. When refusal becomes evidence that somebody is selfish or ungrateful, the debtor may feel forced to act against their own judgement. The mechanism works particularly well when the relationship matters. You can acknowledge a genuine benefit, offer fair repayment and still refuse a request that violates your responsibilities.",
  "evidence": "Social influence research treats reciprocity as a meaningful norm, but an explanation of a principle is not evidence that every appeal to gratitude is manipulative. Sweet's work on gaslighting concerns systematic attacks on credibility and power, a more specific phenomenon than ordinary guilt after a favour. Keep the concepts separate. Here, the main evidence is the proposed obligation and the consequence Jules attaches to refusal. The ethical content of the requested lie also matters: Morgan is being asked to misrepresent workplace facts.",
  "complication": "Sometimes someone really has accepted an obligation. If Jules paid a shared expense under an explicit agreement, it may be fair to ask for repayment. Someone who repeatedly accepts help but never reciprocates can create genuine resentment. The relevant question is whether the new request falls within a reasonable or agreed obligation. You can decide that a demand is unfair without denying the other person's generosity or feelings.",
  "closing": "Name what you appreciate, then name what you will not do. 'I value your help with the move, and I'll return that kindness. I won't lie to the manager.' The useful skill is separating gratitude from compliance. It protects the good part of reciprocity while refusing a debt somebody has invented after the fact.",
  "case": {
   "a": "Jules",
   "b": "Morgan",
   "setup": "After helping Morgan move, Jules wants Morgan to cover up an absence at work.",
   "turns": [
    [
     "a",
     "Can you tell the manager I was completing client calls yesterday?"
    ],
    [
     "b",
     "But you weren't at work yesterday."
    ],
    [
     "a",
     "I spent my whole Saturday helping you move."
    ],
    [
     "b",
     "I appreciate that. I can help you move next month."
    ],
    [
     "a",
     "Real friends return favours without making excuses."
    ],
    [
     "b",
     "You want me to give a false account."
    ],
    [
     "a",
     "If you refuse, I'll know how little this friendship means."
    ],
    [
     "b",
     "My gratitude doesn't make the report true."
    ]
   ],
   "focus": 6,
   "firstOptions": [
    "Jules turns a favour into an undefined duty to comply with an unrelated request.",
    "Morgan previously agreed to falsify records.",
    "The friendship cannot survive any disagreement."
   ],
   "secondOptions": [
    "Thank Jules and refuse to give false information.",
    "Make the false report to repay Saturday.",
    "Pretend Jules never helped."
   ],
   "secondExplanation": "Morgan can recognise the earlier favour without treating it as permission to lie."
  },
  "clueIndices": [
   4,
   6
  ],
  "insight": "The demand becomes coercive in tone when friendship is made conditional on giving an untruthful answer.",
  "cycle": [
   "Jules performs a voluntary favour.",
   "Jules later asks Morgan to lie.",
   "Refusal is framed as disloyalty.",
   "Morgan may comply to avoid guilt and relational loss."
  ],
  "hypotheses": [
   "Jules is using reciprocity as leverage for an unrelated obligation.",
   "The earlier help created a legal duty to lie.",
   "Morgan is automatically selfish for setting a limit."
  ],
  "sort": {
   "title": "Reasonable return or invented debt?",
   "prompt": "Which expectations follow a fair agreement, and which impose unrelated obligations?",
   "categories": [
    "Reasonable or agreed repayment",
    "Unrelated obedience demand"
   ],
   "items": [
    {
     "text": "Please return the ladder you borrowed on Sunday.",
     "category": 0
    },
    {
     "text": "I helped you study, so you must share your password.",
     "category": 1
    },
    {
     "text": "We agreed you'd pay back half the ticket cost.",
     "category": 0
    },
    {
     "text": "Because I supported you, you may not disagree with me.",
     "category": 1
    }
   ],
   "explanation": "The content and terms of an obligation matter more than the amount of guilt produced."
  },
  "revision": {
   "evidence": "Jules shows a written agreement that Morgan would swap a future work shift as thanks for the move. It says nothing about falsifying attendance.",
   "prompt": "What becomes more precise?",
   "options": [
    "Morgan may owe a shift under the agreement, but not a false report.",
    "The agreement makes every later request reasonable.",
    "The agreement proves Jules never used emotional leverage."
   ],
   "explanation": "A genuine duty can coexist with an unreasonable demand that goes beyond its terms."
  },
  "life": {
   "type": "invisible_price_tag",
   "title": "What does agreement cost?",
   "prompt": "Which trade-off is most defensible?",
   "scene": "Morgan considers saying yes to Jules to avoid being called ungrateful.",
   "frames": [
    [
     "Agree to lie",
     "The conflict quietens, but a false workplace record is created."
    ],
    [
     "Refuse the lie",
     "Jules may be angry; Morgan preserves an important responsibility."
    ],
    [
     "Offer fair return",
     "Morgan can repay an agreed favour without falsifying information."
    ]
   ],
   "reveal": "A short reduction in guilt can carry a much larger practical cost.",
   "options": [
    "Gratitude can be honoured through fair repayment without accepting any demand.",
    "An earlier kindness determines all future decisions.",
    "Feeling guilty proves an obligation is legitimate."
   ],
   "explanation": "Consider the actual obligation and the cost of the proposed action."
  },
  "action": {
   "title": "Respond to the invented debt",
   "prompt": "Morgan wants to decline clearly.",
   "changePrompt": "Which statement separates issues?",
   "changes": [
    "Thanks again for Saturday. I'll repay the favour fairly, but I won't give a false report.",
    "Fine. Your help means I have no choice.",
    "You never helped me at all."
   ],
   "outcomes": [
    "The valid gratitude remains while the unethical request is refused.",
    "Guilt determines the workplace statement.",
    "The conversation becomes a dispute about an obvious fact."
   ],
   "explanation": "A direct boundary avoids debating whether Morgan cares about the friendship."
  },
  "transfer": {
   "title": "A family request",
   "prompt": "An aunt paid for your birthday meal, then says you must reveal a cousin's private information. What is the strongest response?",
   "options": [
    "Express gratitude and refuse to disclose the private information.",
    "Treat the meal as a purchase of all future loyalty.",
    "Deny that the meal occurred."
   ],
   "explanation": "A kindness does not turn another person's privacy into a debt."
  },
  "recall": {
   "prompt": "What term means returning benefits or kindness with appropriate consideration?",
   "answers": [
    "reciprocity",
    "reciprocal exchange"
   ],
   "explanation": "Reciprocity supports social cooperation when obligations remain proportionate and fair."
  },
  "takeaway": "A favour deserves gratitude. It does not give the giver authority over your next decision."
 },
 {
  "title": "Guilt, shame and the pressure to prove you care",
  "concept": "guilt appeal versus relational control",
  "opening": "Your sister is disappointed that you cannot attend a family gathering. She says she will miss you. That may be a straightforward expression of sadness. A second message says you are cruel for choosing your job, and that everybody will know you never cared about the family. The difference matters. Someone can express pain without turning your refusal into a global judgement of character. When we treat every mention of hurt feelings as manipulation, we risk dismissing legitimate needs; when we accept every moral accusation, we lose the ability to set fair limits.",
  "mechanism": "Guilt concerns a particular action that someone sees as wrong or harmful. Shame is a broader feeling of being unacceptable as a person. A guilt appeal can provide relevant information: 'I felt hurt when you cancelled without warning.' Relational pressure becomes stronger when the person uses shame to demand a choice: 'If you were a decent person, you would do exactly what I want.' The mechanism is a move from discussing conduct to threatening identity or belonging. A person may comply to escape the feeling that they are bad, even if the requested action conflicts with their actual responsibilities.",
  "evidence": "Work on coercive control shows why repeated humiliation and isolation matter, especially when they restrict autonomy over time. A single upsetting family message is not automatically coercive control. The UK statutory framework emphasises patterns and cumulative impact. In a milder disagreement, ordinary social reasoning remains useful: ask whether the other person's need is legitimate, whether the proposed solution is proportionate, and whether refusal is allowed without humiliation.",
  "complication": "Suppose you promised to attend and cancelled an hour before the meal without explanation. A relative may reasonably express disappointment and ask for accountability. That does not justify a global accusation about your worth. The strongest response acknowledges a genuine breach where one occurred and separates it from the demand that you abandon every competing responsibility. Both sides of the conflict deserve precise descriptions.",
  "closing": "Respond to the specific concern, not the accusation about who you are. You can apologise for a late cancellation while declining to change a necessary shift. You can also ask whether a different visit would meet the underlying need. The result is a conversation about actions and workable choices rather than a trial of your character.",
  "case": {
   "a": "Lena",
   "b": "Hugo",
   "setup": "Hugo cannot attend his sister Lena's dinner because his employer changed a compulsory shift.",
   "turns": [
    [
     "a",
     "I'm disappointed. I really wanted you there tonight."
    ],
    [
     "b",
     "I know. The shift changed this morning and I can't leave."
    ],
    [
     "a",
     "You never make family a priority."
    ],
    [
     "b",
     "I came last week. This one isn't a choice."
    ],
    [
     "a",
     "If you loved us properly, you'd tell your boss no."
    ],
    [
     "b",
     "I do care about you. I don't have that option tonight."
    ],
    [
     "a",
     "Everyone will hear why you couldn't be bothered."
    ],
    [
     "b",
     "We can plan Sunday. I won't accept being called uncaring for working."
    ]
   ],
   "focus": 4,
   "firstOptions": [
    "Lena shifts from disappointment into a moral test of Hugo's love.",
    "Any expression of missing someone is manipulation.",
    "Hugo has shown indifference to every family member."
   ],
   "secondOptions": [
    "Acknowledge the disappointment while rejecting the global accusation and offering Sunday.",
    "Agree to risk his job to prove love.",
    "Insult Lena's character in return."
   ],
   "secondExplanation": "He can respond to a real need without treating shame as evidence of a duty to comply."
  },
  "clueIndices": [
   4,
   6
  ],
  "insight": "The words 'if you loved us' and the threatened public judgement turn refusal into a test of worth.",
  "cycle": [
   "A missed dinner causes disappointment.",
   "Lena interprets attendance as proof of loyalty.",
   "She escalates from a request to shame and social threat.",
   "Hugo may comply to protect belonging rather than because the new plan is reasonable."
  ],
  "hypotheses": [
   "Lena's later messages exert identity-based pressure beyond expressing disappointment.",
   "Any sadness after cancellation is abusive.",
   "Hugo's refusal proves a complete absence of affection."
  ],
  "sort": {
   "title": "Tell me what hurt, or tell me who I am?",
   "prompt": "Classify statements about a specific event versus attempts to shame someone into compliance.",
   "categories": [
    "Specific feeling or complaint",
    "Global character pressure"
   ],
   "items": [
    {
     "text": "I was hurt that you cancelled an hour before we met.",
     "category": 0
    },
    {
     "text": "Only a terrible sibling would miss this meal.",
     "category": 1
    },
    {
     "text": "Can we plan a different evening?",
     "category": 0
    },
    {
     "text": "I'll make sure everyone knows you don't love us.",
     "category": 1
    }
   ],
   "explanation": "A specific complaint can be discussed; a global accusation threatens identity and belonging."
  },
  "revision": {
   "evidence": "Lena explains that Hugo had promised to cook the main meal and nobody was warned about the shift change until dinner began.",
   "prompt": "What should Hugo now acknowledge?",
   "options": [
    "The practical disruption and delayed warning deserve repair, while the character attack remains excessive.",
    "Every accusation about his love is now proven true.",
    "Because the shift was compulsory, no one has reason to feel disappointed."
   ],
   "explanation": "Responsibility can be specific without becoming a verdict on character."
  },
  "life": {
   "type": "hidden_subtitle",
   "title": "The need beneath the accusation",
   "prompt": "What is the most useful distinction here?",
   "scene": "Lena says, 'If you cared, you'd be here.'",
   "frames": [
    [
     "Possible feeling",
     "She may feel unimportant or let down."
    ],
    [
     "Stated demand",
     "She wants Hugo to leave work."
    ],
    [
     "Actual options",
     "Sunday is possible; tonight is not."
    ]
   ],
   "reveal": "Understanding her feeling does not make the demanded solution possible or fair.",
   "options": [
    "Address the missed connection without accepting an impossible loyalty test.",
    "Assume any hurt feeling creates unlimited obligation.",
    "Treat every expression of disappointment as a malicious scheme."
   ],
   "explanation": "Needs and proposed solutions can be evaluated separately."
  },
  "action": {
   "title": "Respond without taking the bait",
   "prompt": "Hugo wants a fair conversation.",
   "changePrompt": "Which response gives the dispute a workable shape?",
   "changes": [
    "I know tonight matters. I should have warned you sooner. I can help organise Sunday, but I cannot leave this shift.",
    "I'll resign so nobody thinks I'm a bad brother.",
    "If you're upset, you must be manipulating me."
   ],
   "outcomes": [
    "The repairable omission is acknowledged while the current constraint remains clear.",
    "An unrelated irreversible decision answers a shame accusation.",
    "A legitimate feeling is dismissed rather than discussed."
   ],
   "explanation": "Accuracy makes a boundary stronger."
  },
  "transfer": {
   "title": "A friendship after a missed call",
   "prompt": "A friend says, 'I was frightened when you didn't call back.' Which response best tests whether the issue is solvable rather than a character verdict?",
   "options": [
    "Ask what happened and agree how to communicate next time, without accepting an accusation about overall worth.",
    "Promise never to miss a call again regardless of circumstances.",
    "Explain that any emotional complaint is psychological manipulation."
   ],
   "explanation": "A workable agreement should relate to the actual problem."
  },
  "recall": {
   "prompt": "What emotion concerns being a bad or unacceptable person as a whole rather than one particular action?",
   "answers": [
    "shame"
   ],
   "explanation": "Shame concerns global self-evaluation. Guilt more often focuses on a specific action."
  },
  "takeaway": "A person's disappointment matters. It does not automatically make their proposed solution fair."
 },
 {
  "title": "Urgency, authority and the appearance of having no choice",
  "concept": "authority and scarcity pressure",
  "opening": "A message from your bank appears to say your account will be frozen unless you click a link in ten minutes. At work, a supervisor says a new reporting rule must be followed by Friday. Both rely on authority and timing, but only one may be an attempt to bypass checking. The warning sign is not urgency alone. It is a demand to act before you can examine whether the authority is real, the deadline is legitimate and the action fits the situation.",
  "mechanism": "People use shortcuts when information is incomplete. A recognised authority can save time because specialists often know more about their field. A genuine deadline can concentrate attention. The same shortcuts become exploitable when a message makes checking seem impossible or disloyal. The person may feel an immediate need to escape risk and so neglect an independent source of information. A manipulative approach does not necessarily need an elaborate lie; sometimes it only needs the target to skip a verification step. The practical skill is to separate the claim of authority from evidence of authority.",
  "evidence": "Research on persuasion and social influence examines how authority cues and scarcity can affect choices. The important distinction for a public education course is that these cues are not guarantees of deception. A legal payment date and a verified safety instruction can be urgent. In the UK, official fraud-prevention guidance encourages checking unusual contact through independent channels. Broader coercive-control research adds a different concern when a trusted person repeatedly prohibits independent verification or contact with others.",
  "complication": "A universal rule to ignore urgent warnings would be unsafe. Someone genuinely encountering a medical emergency or a real banking lock should respond promptly through the appropriate verified route. An effective rule is narrower: do not let the threatening message supply both the alleged problem and the only way to verify it. The method of independent checking can be brief. You do not have to resolve every uncertainty before taking sensible precautions.",
  "closing": "When urgency and authority appear together, ask what you can confirm without relying on the message itself. Open the bank app directly rather than following a supplied link. Ask a supervisor where the policy is recorded. The purpose is to regain one independent step between feeling pressure and acting. That is where a persuasive cue becomes a claim you can evaluate.",
  "case": {
   "a": "Eva",
   "b": "Rowan",
   "setup": "Eva receives a supposed bank security message and asks Rowan what to do.",
   "turns": [
    [
     "a",
     "The message says my account will close in ten minutes."
    ],
    [
     "b",
     "Did it arrive inside your bank's app?"
    ],
    [
     "a",
     "No, a text with a link."
    ],
    [
     "b",
     "Can you check the app directly instead?"
    ],
    [
     "a",
     "It says if I call the bank, I'll be too late."
    ],
    [
     "b",
     "That warning comes from the same unverified text."
    ],
    [
     "a",
     "It also uses the bank's logo and calls itself the fraud team."
    ],
    [
     "b",
     "The logo is not proof. Let's open the official app ourselves."
    ]
   ],
   "focus": 4,
   "firstOptions": [
    "The unverified message tries to prevent independent checking of its own claim.",
    "The bank logo proves the text is genuine.",
    "Any time-sensitive notice is automatically a scam."
   ],
   "secondOptions": [
    "Open the bank's known official app or contact number independently.",
    "Click quickly to avoid losing time.",
    "Reply with a password to show identity."
   ],
   "secondExplanation": "Independent verification does not depend on the sender's chosen link."
  },
  "clueIndices": [
   2,
   4
  ],
  "insight": "The link and instruction not to check separately are the decisive features, not the existence of a deadline.",
  "cycle": [
   "An alarming message claims immediate authority.",
   "Eva anticipates losing access to money.",
   "The text discourages separate verification.",
   "Fear may lead Eva to follow an untrusted link."
  ],
  "hypotheses": [
   "The message may be designed to bypass independent verification through urgency.",
   "The appearance of a logo proves authenticity.",
   "The deadline alone proves that all bank warnings are false."
  ],
  "sort": {
   "title": "Checkable authority or self-asserted authority?",
   "prompt": "Identify a verification route independent of the claimant.",
   "categories": [
    "Independent verification",
    "Unverified self-assertion"
   ],
   "items": [
    {
     "text": "Open the bank app from a saved bookmark.",
     "category": 0
    },
    {
     "text": "Trust the phone number embedded in the warning text.",
     "category": 1
    },
    {
     "text": "Read the policy on your employer's established intranet.",
     "category": 0
    },
    {
     "text": "Assume the message is genuine because it says 'official'.",
     "category": 1
    }
   ],
   "explanation": "Verification must not depend entirely on the claim being checked."
  },
  "revision": {
   "evidence": "Eva opens her bank app through her usual bookmark. It reports no alert, and the security team confirms that the link is fraudulent.",
   "prompt": "Which belief changes most?",
   "options": [
    "The text's claimed authority is undermined by independent evidence.",
    "The logo now has greater evidential value.",
    "All future bank security messages are necessarily fraudulent."
   ],
   "explanation": "The independent source is stronger evidence than the message's appearance."
  },
  "life": {
   "type": "one_change_experiment",
   "title": "Change one verification condition",
   "prompt": "Which single change makes the decision safer?",
   "scene": "An urgent message tells Eva to verify her account.",
   "frames": [
    [
     "Use supplied link",
     "The message controls the verification route."
    ],
    [
     "Open official app",
     "Eva checks through a channel she already knows."
    ],
    [
     "Compare results",
     "The independent app offers evidence that can contradict the text."
    ]
   ],
   "reveal": "The same warning becomes less controlling when checking is possible elsewhere.",
   "options": [
    "Use an independently known channel before disclosing information.",
    "Assume the shorter route is always safer.",
    "Treat any official-looking logo as definitive."
   ],
   "explanation": "Control over how a claim is checked is a powerful part of influence."
  },
  "action": {
   "title": "Protect one decision",
   "prompt": "Eva has ten minutes according to the message.",
   "changePrompt": "What should she do?",
   "changes": [
    "Open the known bank app and check for a genuine alert.",
    "Submit her banking details to the message link.",
    "Forward the warning to colleagues as verified fact."
   ],
   "outcomes": [
    "The claim can be checked without trusting the text.",
    "Private information may go to an unverified party.",
    "Unreliable information spreads."
   ],
   "explanation": "A quick independent check interrupts urgency pressure."
  },
  "transfer": {
   "title": "A workplace directive",
   "prompt": "A supervisor says a policy has changed and refuses to show the document. What should an employee ask?",
   "options": [
    "Where is the change recorded, and who can confirm it through the established process?",
    "How quickly can they prove loyalty by obeying?",
    "Which colleague can be accused of resistance?"
   ],
   "explanation": "An authority claim gains legitimacy through a verifiable process."
  },
  "recall": {
   "prompt": "What two-word phrase describes checking a claim through a channel that does not depend on the original claimant?",
   "answers": [
    "independent verification",
    "independent checking"
   ],
   "explanation": "Independent verification avoids letting the same source define the question and its answer."
  },
  "takeaway": "A real deadline can be urgent. A trustworthy decision still benefits from checking whether the demand is authentic."
 }
];
