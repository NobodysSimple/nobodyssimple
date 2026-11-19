export const specs=[
 {
  "title": "Empathy under pressure: whose experience goes missing?",
  "concept": "empathy and self focused attention",
  "opening": "At a family dinner, a brother describes losing his job. His sister responds by explaining how his unemployment will make her birthday weekend harder to organise. People around the table call her incapable of empathy. The response is plainly self-centred in that moment, yet the mechanism behind it remains uncertain. She might be overwhelmed, worried about money or accustomed to making every difficulty about herself. The challenge is to understand what empathy requires and how it can break down when a person feels threatened.",
  "mechanism": "Empathy includes recognising another person's experience and responding to it in a way that takes their perspective seriously. It does not require agreeing with every belief they hold or feeling exactly the same emotion. Someone can understand another person's position and still act selfishly. When attention narrows around protecting a prized self-image, the other person's needs may receive less consideration. Researchers distinguish knowing what someone may feel from sharing or responding to that feeling. Those abilities are related but not identical. A rigid pattern of disregarding other people can damage relationships, but one poor response does not tell us whether the person lacks the capacity for empathy.",
  "evidence": "Work on narcissistic personality functioning examines interpersonal impairment, including difficulty recognising other people's autonomy and needs. Pincus and Lukowitsky describe the importance of examining self-regulation alongside relationships rather than reducing pathology to boastfulness. The 2024 ICD-11-oriented vignette study also illustrates how different narcissistic presentations can involve distinct problems in self and interpersonal functioning. A vignette study investigates how clinicians judge designed examples; it is not proof about the actual abilities of a particular individual. The lesson's useful scientific distinction is between observed failure to respond and assumed permanent incapacity.",
  "complication": "A person with strong empathy may still refuse a request that is unreasonable. Conversely, a polished performance of sympathy can coexist with exploitation. We therefore need to look at what someone understood, what they chose and what happened when the other person's needs remained inconvenient. Does the pattern recur even when the cost of responding is modest? Do they repair the harm once it is pointed out? Answers to those questions provide better evidence than deciding that one insensitive sentence reveals a whole personality.",
  "closing": "When someone overlooks another person's distress, name the missed need and the behaviour. Ask for a specific response rather than a declaration of empathy. The family member can say, 'I need you to hear what happened before we talk about the weekend.' The goal is observable consideration. Nobody needs to win an argument about which label applies in order to insist that another person's difficulty receives proper attention.",
  "case": {
   "a": "Tariq",
   "b": "Elena",
   "setup": "Tariq has been made redundant. Elena is worried that his financial change will affect a planned family weekend.",
   "turns": [
    [
     "a",
     "I found out this morning that my job is gone."
    ],
    [
     "b",
     "That creates a problem. We booked the cottage for my birthday."
    ],
    [
     "a",
     "I'm struggling to think about anything beyond the redundancy."
    ],
    [
     "b",
     "I just need to know whether you're paying your share."
    ],
    [
     "a",
     "I don't know yet. I'm frightened about rent."
    ],
    [
     "b",
     "Everyone will think I organised this badly if we cancel."
    ],
    [
     "a",
     "Could we talk about the job for a moment?"
    ],
    [
     "b",
     "I didn't realise you needed that. Tell me what happened."
    ]
   ],
   "focus": 5,
   "firstOptions": [
    "Elena's attention shifts to how the event affects her image, although she later responds to Tariq's request.",
    "Elena understands nothing about redundancy.",
    "Elena's first reply proves a permanent inability to empathise."
   ],
   "secondOptions": [
    "Ask Elena to discuss the job before planning the trip.",
    "Demand that Elena show exactly the same distress.",
    "Withdraw without explaining any immediate need."
   ],
   "secondExplanation": "A clear request identifies what consideration would look like in this conversation."
  },
  "clueIndices": [
   1,
   5
  ],
  "insight": "The first responses centre on Elena's holiday and the impression others might form, while the final turn shows some capacity to adjust.",
  "cycle": [
   "Tariq reports a serious loss.",
   "Elena anticipates disruption to her plans and reputation.",
   "She addresses her own worries before his immediate needs.",
   "Tariq feels unheard, unless she responds when he makes the need explicit."
  ],
  "hypotheses": [
   "Elena initially prioritises the consequences for herself over Tariq's distress.",
   "Elena has no ability to understand other people's emotions.",
   "Tariq is wrong to mention the redundancy before discussing the holiday."
  ],
  "sort": {
   "title": "Understanding and acting are different",
   "prompt": "Distinguish evidence of perspective-taking from evidence that a need was disregarded.",
   "categories": [
    "Takes the other's perspective seriously",
    "Moves past the other's expressed need"
   ],
   "items": [
    {
     "text": "You said rent is what scares you most; shall we work through it?",
     "category": 0
    },
    {
     "text": "Your job loss is inconvenient because my guests will notice.",
     "category": 1
    },
    {
     "text": "I disagree with your plan, but I can see why you're worried.",
     "category": 0
    },
    {
     "text": "I know you're upset; let's only discuss my birthday.",
     "category": 1
    }
   ],
   "explanation": "Understanding a position and acting with consideration can be separated analytically."
  },
  "revision": {
   "evidence": "Elena later calls Tariq privately to apologise, asks about his financial safety and offers to change the booking without involving him.",
   "prompt": "What claim becomes harder to defend?",
   "options": [
    "That Elena has a fixed inability to take Tariq's perspective.",
    "That her earlier response was insensitive.",
    "That Tariq had a reasonable need for support."
   ],
   "explanation": "Repair is relevant evidence about capacity and responsiveness. The original failure still occurred."
  },
  "life": {
   "type": "attention_spotlight",
   "title": "What does the conversation foreground?",
   "prompt": "Which conclusion follows after attending to the whole conversation?",
   "scene": "Tariq says he has lost his job. Elena immediately mentions the booking.",
   "frames": [
    [
     "First response",
     "Elena focuses on the holiday's cost."
    ],
    [
     "Second response",
     "Her worry shifts to how she will be judged."
    ],
    [
     "Final response",
     "After a direct request, she asks about Tariq's experience."
    ]
   ],
   "reveal": "A poor opening can be followed by a meaningful change when the missed need is made clear.",
   "options": [
    "We can describe the lack of consideration without assuming a permanent inability to empathise.",
    "The first sentence establishes an unchangeable personality disorder.",
    "Elena must feel the identical emotion to count as empathic."
   ],
   "explanation": "Describe the behaviour at the level the evidence permits."
  },
  "action": {
   "title": "Make the need observable",
   "prompt": "Tariq wants to be heard and still keep the booking issue manageable.",
   "changePrompt": "Which request is clearest?",
   "changes": [
    "Can we talk about my job first and revisit the weekend tomorrow?",
    "Prove that you're an empath before I continue.",
    "Pretend the weekend doesn't matter to you."
   ],
   "outcomes": [
    "His immediate need is explicit and the practical decision remains available later.",
    "The exchange becomes an argument about a label.",
    "The issue is hidden rather than addressed."
   ],
   "explanation": "Behavioural requests are more useful than trying to inspect another person's private empathic state."
  },
  "transfer": {
   "title": "In a clinic",
   "prompt": "A clinician listens carefully but cannot agree to a patient's requested treatment. What best demonstrates empathy?",
   "options": [
    "Explaining the reasoning, recognising the patient's concerns and taking them seriously.",
    "Agreeing to any request so the patient feels accepted.",
    "Assuming disagreement proves the clinician is uncaring."
   ],
   "explanation": "Empathy concerns understanding and consideration, not automatic agreement."
  },
  "recall": {
   "prompt": "What term describes taking another person's experience seriously and appreciating their perspective?",
   "answers": [
    "empathy",
    "perspective taking",
    "perspective-taking"
   ],
   "explanation": "Empathy can involve understanding, feeling with and responding to someone; these components need not be identical."
  },
  "takeaway": "An insensitive response is real evidence about behaviour. A claim about permanent capacity requires a much wider pattern."
 },
 {
  "title": "Status, comparison and the cost of someone else's success",
  "concept": "social comparison and envy",
  "opening": "Nia and Marcus both apply for a promotion. Nia succeeds. Marcus congratulates her, then tells colleagues the selection was unfair because Nia is less impressive than he is. He may be envious, disappointed, accurately concerned about the procedure or some mixture of these. The psychological question is why another person's achievement can feel like a personal loss. The workplace question is whether the accusation is supported by evidence. We need to keep both questions alive.",
  "mechanism": "Social comparison means judging ourselves partly by where we stand relative to other people. It can motivate improvement and identify real inequities. The problem arises when somebody else's success is interpreted as a reduction in our own value. Envy is an unpleasant response to another person's valued advantage. Some responses seek self-improvement. Others protect standing by undermining the successful person. In a narcissistic process, specialness or superiority may be a central condition of self-worth, making comparison especially threatening. None of this makes Marcus's allegation false. A person can have a threatened ego and a legitimate complaint at the same time; evidence must settle the procedural claim.",
  "evidence": "Narcissism research distinguishes self-enhancement and interpersonal antagonism from ordinary ambition. Pincus and Lukowitsky describe the wider problem of defining pathological narcissism across research traditions, while later work investigates how grandiose and vulnerable traits relate to functioning. The research helps us ask whether status regulation is recurring and costly; it does not permit a diagnosis based on losing one competition. In applied life, compare evidence about the process separately from Marcus's emotional response to the result.",
  "complication": "Suppose the appointment panel had a conflict of interest. Marcus's criticism would deserve investigation despite his resentment. Suppose instead that he was offered a fair explanation and privately acknowledged Nia's stronger evidence but continued undermining her. Deliberate devaluation becomes a better description of the conduct. We should not use psychology to dismiss legitimate complaints. Equally, a plausible complaint should not excuse spreading unsupported accusations about a colleague.",
  "closing": "A useful reaction to comparison asks two questions: what does the other person's success teach me about my next step, and is there an actual fairness issue that needs evidence? Neither requires treating another person's achievement as a theft of your worth. When someone undermines a successful colleague, make them substantiate the specific claim rather than allowing a personality label to stand in for an investigation.",
  "case": {
   "a": "Marcus",
   "b": "Lina",
   "setup": "After Nia gets a promotion, Marcus questions the appointment in a conversation with Lina.",
   "turns": [
    [
     "a",
     "Nia got the role. I don't see how I came second."
    ],
    [
     "b",
     "Did the panel explain the criteria?"
    ],
    [
     "a",
     "They said Nia showed stronger examples of team leadership."
    ],
    [
     "b",
     "Were those examples accurate?"
    ],
    [
     "a",
     "I know she did well, but she doesn't deserve to outrank me."
    ],
    [
     "b",
     "Being disappointed makes sense. What evidence says the decision was unfair?"
    ],
    [
     "a",
     "People will think I'm not good enough now."
    ],
    [
     "b",
     "That worry isn't the same as evidence about how they selected her."
    ]
   ],
   "focus": 6,
   "firstOptions": [
    "The result may threaten Marcus's sense of standing relative to Nia.",
    "Nia has demonstrably falsified her application.",
    "Lina has proved Marcus's work has no value."
   ],
   "secondOptions": [
    "Ask for the scoring criteria and compare the candidates' evidence.",
    "Spread the accusation before checking the process.",
    "Avoid any future promotions."
   ],
   "secondExplanation": "A concrete fairness concern can be investigated without converting disappointment into an allegation."
  },
  "clueIndices": [
   4,
   6
  ],
  "insight": "Marcus acknowledges Nia's work while framing her promotion as a threat to his own standing.",
  "cycle": [
   "Nia receives a promotion Marcus wanted.",
   "Marcus interprets her success as evidence of his reduced status.",
   "He questions her deservingness without a specific procedural fault.",
   "The accusations may damage trust while leaving him without actionable feedback."
  ],
  "hypotheses": [
   "The social comparison is threatening Marcus's professional identity.",
   "Nia's success proves the panel acted dishonestly.",
   "Marcus's disappointment alone establishes pathological narcissism."
  ],
  "sort": {
   "title": "Fair challenge or status reaction?",
   "prompt": "Which claims describe investigable procedures, and which turn into global status judgements?",
   "categories": [
    "Checkable fairness question",
    "Status-based inference"
   ],
   "items": [
    {
     "text": "The panel ignored a published criterion.",
     "category": 0
    },
    {
     "text": "If she won, I must be inferior.",
     "category": 1
    },
    {
     "text": "The scoring sheets contain an arithmetic error.",
     "category": 0
    },
    {
     "text": "Nia shouldn't outrank someone of my calibre.",
     "category": 1
    }
   ],
   "explanation": "A fair process can be challenged with evidence; comparison alone cannot decide its fairness."
  },
  "revision": {
   "evidence": "The scoring sheets show that Marcus's leadership examples were mistakenly omitted from the panel summary. Recalculating the assessment changes the ranking.",
   "prompt": "How must the analysis update?",
   "options": [
    "The procedural complaint now has concrete support, whatever Marcus felt about Nia's success.",
    "Marcus's earlier insults are therefore justified.",
    "The mistake proves social comparison never influenced him."
   ],
   "explanation": "The stronger explanation of the hiring outcome changes. His treatment of Nia can still be evaluated separately."
  },
  "life": {
   "type": "same_person_different_day",
   "title": "Two promotions, two responses",
   "prompt": "What makes the second response more psychologically useful?",
   "scene": "Marcus hears about two colleagues receiving opportunities he wanted.",
   "frames": [
    [
     "First result",
     "He attacks the colleague's ability without evidence."
    ],
    [
     "Second result",
     "He checks the published criteria and requests detailed feedback."
    ],
    [
     "Comparison",
     "In the second case he investigates the process rather than reducing it to a judgement of worth."
    ]
   ],
   "reveal": "The same disappointed person can choose different responses.",
   "options": [
    "Treating comparison as information creates more opportunities for fair action.",
    "The second response proves Marcus cannot experience envy.",
    "The first response automatically establishes a personality disorder."
   ],
   "explanation": "Motivational feelings and practical actions are related, not interchangeable."
  },
  "action": {
   "title": "Challenge the result fairly",
   "prompt": "Marcus wants an accurate review while working with Nia.",
   "changePrompt": "Which next step is justified?",
   "changes": [
    "Request the published scoring criteria and a review of any discrepancy.",
    "Tell colleagues Nia stole the promotion.",
    "Demand that Nia apologise for being chosen."
   ],
   "outcomes": [
    "A testable allegation can be resolved on its merits.",
    "Nia is harmed before the claim is established.",
    "Responsibility is placed on someone who did not make the decision."
   ],
   "explanation": "Evidence should lead the complaint, not a theory about Marcus's motives."
  },
  "transfer": {
   "title": "Among friends",
   "prompt": "Your friend feels smaller when another friend buys a house. Which statement accurately locates the problem?",
   "options": [
    "Their friend's success has become a comparison about their own worth.",
    "The homeowner must be showing off maliciously.",
    "Feeling envy proves that the friendship is unhealthy."
   ],
   "explanation": "Social comparison can distort the meaning of someone else's success without making either person disordered."
  },
  "recall": {
   "prompt": "What term means evaluating yourself partly through differences between you and other people?",
   "answers": [
    "social comparison",
    "comparing yourself to others"
   ],
   "explanation": "Comparison can inform goals, but the meaning assigned to rank determines its consequences."
  },
  "takeaway": "Someone else's achievement is evidence about their life. It becomes a judgement of your worth only after an interpretation is added."
 },
 {
  "title": "Idealisation, disappointment and the swing into devaluation",
  "concept": "idealisation and devaluation",
  "opening": "When Ana first joins an organisation, she describes her supervisor as brilliant. Three months later, after her proposal is rejected, she tells the team the supervisor is useless. People sometimes use the words idealisation and devaluation for a shift of this kind. The pattern is interesting because the same person's evaluation moves between extremes. Still, initial enthusiasm and later disappointment happen in ordinary relationships. We need to find out what changed, how much new evidence emerged and whether the shift is repeated.",
  "mechanism": "Idealisation means representing a person as exceptionally good or capable, sometimes beyond the available evidence. Devaluation means reducing their worth in one's account, particularly when they disappoint an expectation. This can help protect self-esteem by locating a failure entirely in someone else: if the once-perfect supervisor is now incompetent, Ana need not examine the proposal's weaknesses. But not every dramatic change is a defence. New information can justify a genuine reversal of opinion. The useful test is whether the person can hold a mixed picture: the supervisor can be skilled and still make an unfair decision, or can be kind while making a serious error.",
  "evidence": "Clinical descriptions of narcissistic functioning sometimes discuss unstable evaluations of self and others. Pincus and Lukowitsky connect pathological narcissism to difficulties maintaining self-esteem and workable relationships. The same language is used in other clinical and psychodynamic traditions, so a single 'swing' is not diagnostic. Consider the repeated pattern, its role in regulating perceived self-worth and whether it impairs cooperation. Terms that sound clinically sophisticated can still be misused if we have only a brief story.",
  "complication": "There is a moral hazard in asking the disappointed person to become more balanced too quickly. If Ana discovers that her supervisor falsified results, strong condemnation may be proportionate. The task is not to soften accurate criticism. It is to retain distinctions between an observed harmful action and claims that the whole person is either perfect or worthless. When evidence changes, judgement should change too; the question is whether it changes in proportion to what is known.",
  "closing": "Look for conclusions that survive the latest emotion. 'The supervisor rejected my proposal without explaining why' is an investigable complaint. 'She has never done anything valuable' is a much larger claim. A stable working relationship does not require idealising the other person. It requires enough realism to evaluate good and poor conduct independently.",
  "case": {
   "a": "Ana",
   "b": "Joel",
   "setup": "Ana asks a colleague why she now refuses to work with the supervisor she praised last month.",
   "turns": [
    [
     "a",
     "Last term she was the only manager who understood my potential."
    ],
    [
     "b",
     "What changed?"
    ],
    [
     "a",
     "She rejected my proposal at yesterday's meeting."
    ],
    [
     "b",
     "Did she explain the decision?"
    ],
    [
     "a",
     "She said the sample was too small for the question."
    ],
    [
     "b",
     "Is that a problem with the design you could address?"
    ],
    [
     "a",
     "She's never been competent. I can't believe I praised her."
    ],
    [
     "b",
     "Could you disagree with the decision without rewriting her whole career?"
    ]
   ],
   "focus": 6,
   "firstOptions": [
    "Ana moves from idealising to globally devaluing the supervisor after a setback.",
    "The supervisor has objectively lost every professional skill overnight.",
    "The proposal's sample size is irrelevant because Ana feels hurt."
   ],
   "secondOptions": [
    "Ask for the methodological concerns in writing and assess them.",
    "Announce that the supervisor is worthless.",
    "Insist on restoring the earlier perfect image."
   ],
   "secondExplanation": "Evaluating the specific decision gives Ana something she can learn from or challenge."
  },
  "clueIndices": [
   0,
   6
  ],
  "insight": "The phrases 'only manager' and 'never competent' show opposite global judgements with little intermediate detail.",
  "cycle": [
   "Ana builds a very positive view of the supervisor.",
   "The supervisor rejects a valued proposal.",
   "Ana treats the rejection as evidence the supervisor is wholly bad.",
   "The global judgement prevents examination of the actual methodological criticism."
  ],
  "hypotheses": [
   "Ana's evaluation may shift to protect her from a painful criticism.",
   "The entire supervisor's history is now proven worthless.",
   "One reversal establishes a particular clinical disorder."
  ],
  "sort": {
   "title": "Specific evaluation or global verdict?",
   "prompt": "Distinguish criticism of conduct from rewriting a person's whole worth.",
   "categories": [
    "Specific and checkable",
    "Global and excessive"
   ],
   "items": [
    {
     "text": "The supervisor gave too little time for questions.",
     "category": 0
    },
    {
     "text": "She has never made a useful decision in her career.",
     "category": 1
    },
    {
     "text": "Her concern about sample size deserves analysis.",
     "category": 0
    },
    {
     "text": "If she rejected me, everything good she ever did was fake.",
     "category": 1
    }
   ],
   "explanation": "Specific claims can survive scrutiny and lead to concrete change; global verdicts often outrun the evidence."
  },
  "revision": {
   "evidence": "Ana sees the proposal's power calculation and realises it cannot support the planned comparison. The supervisor also offers to discuss a redesign.",
   "prompt": "Which judgement becomes strongest?",
   "options": [
    "The rejection may have been justified while the supervisor's earlier strengths remain possible.",
    "Ana's distress was imaginary.",
    "The supervisor is now proven to be perfect."
   ],
   "explanation": "New evidence can change the evaluation of a decision without requiring another extreme view."
  },
  "life": {
   "type": "cropped_reality",
   "title": "What a single screenshot omits",
   "prompt": "How should the original judgement change?",
   "scene": "A screenshot reads, 'The supervisor rejected Ana's project.'",
   "frames": [
    [
     "Screenshot",
     "It supplies the result without a reason."
    ],
    [
     "Method notes",
     "The proposed sample could not answer the intended question."
    ],
    [
     "Next email",
     "The supervisor offers support with a redesign."
    ]
   ],
   "reveal": "The expanded scene gives a substantive explanation and a possible route forward.",
   "options": [
    "The rejection requires a more specific interpretation than 'she hates Ana'.",
    "Any rejection proves the supervisor is cruel.",
    "The existence of a method issue proves Ana was unreasonable to feel upset."
   ],
   "explanation": "A judgement should track the evidence of the event rather than the person's earlier idealised image."
  },
  "action": {
   "title": "Test the disputed decision",
   "prompt": "Ana must decide whether to appeal or redesign.",
   "changePrompt": "What would be the most informative step?",
   "changes": [
    "Examine the power calculation and ask which design could answer the question.",
    "Ask the department to remove every project the supervisor has approved.",
    "Pretend the concern never existed because Ana admired her before."
   ],
   "outcomes": [
    "The claim about the proposal is tested on its merits.",
    "A single dispute becomes an attack on unrelated work.",
    "The methodological concern remains unresolved."
   ],
   "explanation": "Specific investigation respects the seriousness of a possible problem."
  },
  "transfer": {
   "title": "Dating after disappointment",
   "prompt": "Someone says, 'They were perfect until they forgot my birthday, so they were always a fraud.' What is the best next question?",
   "options": [
    "What does forgetting the birthday establish, and what wider evidence supports the global judgement?",
    "Which diagnosis fits the sentence?",
    "How can we prove they were perfect after all?"
   ],
   "explanation": "A painful lapse should be evaluated in context without making every past observation disappear."
  },
  "recall": {
   "prompt": "What term describes moving from an overly positive view of somebody to a globally negative one?",
   "answers": [
    "devaluation",
    "idealisation and devaluation",
    "idealization and devaluation"
   ],
   "explanation": "Devaluation is a process of lowering someone in the person's evaluation; it may appear after disappointment, but does not by itself establish a disorder."
  },
  "takeaway": "You can criticise a serious mistake without deciding that everything else you knew about somebody was false."
 },
 {
  "title": "The apology that protects an image instead of repairing harm",
  "concept": "accountability versus image management",
  "opening": "After accidentally publishing a colleague's private message, Owen apologises in a team meeting. He says he is devastated that people now see him as careless. The colleague asks him to remove the message and address the consequences. Owen continues talking about how awful he feels. His distress may be genuine. The apology still fails if the injured person never receives the concrete repair they need. This lesson separates an emotional display from taking responsibility.",
  "mechanism": "Accountability means acknowledging what happened, recognising the harm and taking proportionate action to address it. Remorse can support repair, but it is not identical to repair. When someone experiences criticism mainly as a threat to a valued image, attention may turn toward restoring their reputation. They may ask for reassurance that they are a good person before correcting what they did. The interpersonal consequence is predictable: the harmed person is made responsible for soothing the person who caused the harm. That pattern can relate to self-esteem regulation, yet it also occurs without narcissistic pathology. A useful analysis examines what the apology actually changes.",
  "evidence": "Clinical theories of personality functioning examine how self and interpersonal processes interact. Work on pathological narcissism identifies difficulties involving self-worth regulation and relations with other people, but it does not produce a simple diagnostic test from apology language. The relevant research-based questions concern repeated functioning and the cost to others. Even if Owen is deeply ashamed, evidence of shame is not evidence that the message has been removed or that its spread has been contained. Different facts answer those different questions.",
  "complication": "Someone can be overwhelmed by shame and still want to repair harm. It may be fair to give them a moment before discussing practical steps. That does not convert their feelings into the harmed person's responsibility. Conversely, a calm apology may be insincere or may lead to effective repair. The quality of an apology is better judged through acknowledgement, practical action and changed future behaviour than through emotional intensity alone.",
  "closing": "Notice where the apology directs attention. Does it name the harmed person's experience? Does it correct a problem that can still be corrected? Does future conduct change? These questions are useful at home, work and in public life. They also protect against a common trap: treating the person who was harmed as responsible for making the other person feel forgiven immediately.",
  "case": {
   "a": "Owen",
   "b": "Sasha",
   "setup": "Owen accidentally posted a screenshot of Sasha's private medical appointment in a team channel.",
   "turns": [
    [
     "a",
     "I'm so ashamed. Everyone probably thinks I'm a terrible colleague."
    ],
    [
     "b",
     "Please delete the screenshot and ask people not to forward it."
    ],
    [
     "a",
     "I can't stop thinking about how stupid I look."
    ],
    [
     "b",
     "I understand you're upset. The message is still there."
    ],
    [
     "a",
     "Do you think everyone hates me now?"
    ],
    [
     "b",
     "I need the information removed first."
    ],
    [
     "a",
     "I want you to know I'd never deliberately hurt you."
    ],
    [
     "b",
     "What will you do to limit the spread?"
    ]
   ],
   "focus": 4,
   "firstOptions": [
    "Owen's attention repeatedly returns to his own image while the practical harm remains.",
    "Owen has already completed a sufficient repair.",
    "Sasha is unreasonable to request removal."
   ],
   "secondOptions": [
    "Delete the post, notify relevant recipients and ask what further repair is needed.",
    "Keep seeking reassurance about being a good colleague.",
    "Explain that shame itself should count as restitution."
   ],
   "secondExplanation": "Concrete actions address the ongoing privacy risk, regardless of the intensity of Owen's distress."
  },
  "clueIndices": [
   2,
   4
  ],
  "insight": "Questions about his reputation repeatedly displace Sasha's request to remove confidential information.",
  "cycle": [
   "Owen causes a privacy breach.",
   "He fears being judged as incompetent or bad.",
   "He requests reassurance instead of acting promptly.",
   "Sasha remains exposed and has to repeat the same request."
  ],
  "hypotheses": [
   "Concern for self-image may be interfering with Owen's ability to repair the harm.",
   "Sasha has secretly staged the event to shame Owen.",
   "His emotional language proves a personality disorder."
  ],
  "sort": {
   "title": "Apology or repair?",
   "prompt": "Which statements concern the injured person's needs, and which ask them to restore the speaker's image?",
   "categories": [
    "Repair-focused",
    "Image-focused"
   ],
   "items": [
    {
     "text": "I removed it and contacted the channel owner about any copies.",
     "category": 0
    },
    {
     "text": "Please tell me nobody thinks I'm bad.",
     "category": 1
    },
    {
     "text": "I understand why this created a privacy risk.",
     "category": 0
    },
    {
     "text": "Can we stop discussing the screenshot until you forgive me?",
     "category": 1
    }
   ],
   "explanation": "Repair can include remorse, but its primary test is whether the harm is addressed."
  },
  "revision": {
   "evidence": "A follow-up shows Owen removed the screenshot within minutes, contacted the administrator and had already requested deletion from other devices before the meeting.",
   "prompt": "What should we revise?",
   "options": [
    "His initial words still centred himself, but the evidence of practical repair is much stronger.",
    "His words alone now prove narcissistic personality disorder.",
    "Sasha's concern was groundless because the screenshot was eventually deleted."
   ],
   "explanation": "Judge speech and action against their respective evidence; a poor apology and effective repair can coexist."
  },
  "life": {
   "type": "invisible_price_tag",
   "title": "The hidden cost of reassurance",
   "prompt": "What cost does the apology shift onto Sasha?",
   "scene": "Sasha is asked to reassure Owen while her private information remains public.",
   "frames": [
    [
     "Comfort Owen",
     "Sasha must manage his anxiety before her request is addressed."
    ],
    [
     "Remove the post",
     "Owen takes a concrete step to reduce ongoing harm."
    ],
    [
     "Return to feelings",
     "Both can discuss the impact after the urgent correction."
    ]
   ],
   "reveal": "Seeking reassurance can make the harmed person spend attention on the speaker before their own need is met.",
   "options": [
    "Repair should not require Sasha to comfort Owen first.",
    "A dramatic apology always repairs the underlying harm.",
    "Owen's feelings determine whether Sasha deserves privacy."
   ],
   "explanation": "Who must do the work of repair matters as much as how the apology sounds."
  },
  "action": {
   "title": "Make the apology operational",
   "prompt": "Owen wants to act responsibly now.",
   "changePrompt": "Which first step matters most?",
   "changes": [
    "Remove the screenshot and contact the people who might have saved it.",
    "Ask Sasha to reassure him that he is still respected.",
    "Wait until he has stopped feeling ashamed."
   ],
   "outcomes": [
    "The risk of further sharing can be reduced promptly.",
    "Sasha is asked to prioritise Owen's image.",
    "A solvable privacy issue remains active."
   ],
   "explanation": "Practical steps have a clearer relationship to the harm than attempts to secure forgiveness."
  },
  "transfer": {
   "title": "A relationship apology",
   "prompt": "After lying about a purchase, Alex says, 'I can't bear being seen as dishonest.' Which follow-up best tests real accountability?",
   "options": [
    "Will Alex disclose the relevant facts and agree how to rebuild trust through actions?",
    "Does Alex cry enough to prove remorse?",
    "Can the partner promise never to mention the lie again?"
   ],
   "explanation": "Future truthfulness and repair actions matter more than proving the depth of a feeling."
  },
  "recall": {
   "prompt": "What term describes acknowledging your action and taking proportionate steps to address its consequences?",
   "answers": [
    "accountability",
    "taking responsibility"
   ],
   "explanation": "Accountability involves action as well as recognition of what happened."
  },
  "takeaway": "A person can feel ashamed of causing harm while still leaving someone else to repair it. Look at what changes."
 }
];
