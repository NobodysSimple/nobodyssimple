export const specs=[
 {
  "title": "Why does a correction feel like a personal attack?",
  "concept": "threatened self-worth",
  "opening": "Maya completed the analysis. Leo led the project and is preparing a presentation that credits him for work Maya did. She asks him to correct the slide. The ordinary problem has a clear answer: the credit should describe who completed the work. Leo makes the exchange about how senior management will see him. That shift matters. A correction to a document has become a possible judgement of his competence. Follow the evidence without pretending that we already know his private motives.",
  "mechanism": "Self-worth is a person's sense that they have value. When that value depends strongly on a condition, such as being admired for competence, researchers describe contingent self-worth. The condition becomes personally expensive to lose. A factual correction may then be read as a broader verdict: 'I am not capable.' That interpretation can lead to defensive behaviour, including dismissing a reasonable request. The response might protect a valued image temporarily, yet prolong the dispute and make later criticism more likely. This is a possible functional explanation: it tells us what the response might achieve and how it could be repeated. We have not observed Leo's private thoughts, and we must not confuse a plausible process with a proven diagnosis.",
  "evidence": "Pincus and Lukowitsky's 2010 review describes pathological narcissism as involving problems with self-regulation and relationships, including grandiose and vulnerable expressions. A related measurement tradition examines contingent self-esteem and reactions to perceived inadequacy. Such research can make the self-worth explanation plausible; it cannot identify narcissistic personality disorder from an invented workplace exchange. The useful distinction for a reader is between the behaviour we see, the interpretation we think may help explain it, and the enduring functioning needed for a clinical conclusion.",
  "complication": "Leo may also know perfectly well that the slide is inaccurate and hope to benefit professionally. Protection of reputation and deliberate advantage are not mutually exclusive. If we notice only his anxiety about appearing weak, we risk overlooking the direct harm to Maya's credit. If we notice only dishonesty, we may miss why he reacts so intensely to an available correction. A good account improves practical judgement because it explains what further evidence would distinguish the possibilities.",
  "closing": "Maya does not have to establish Leo's personality before asking for accurate attribution. She can request the corrected wording and retain the record of her contribution. What you have learnt is an approach to the next disagreement: identify the concrete problem, separate the threat someone perceives from the action they take, and examine whether the action makes tomorrow's problem worse. Responsibility remains even when a defensive response is understandable.",
  "case": {
   "a": "Maya",
   "b": "Leo",
   "setup": "A team slide credits Leo with analysis that Maya completed. Management will receive it this afternoon.",
   "turns": [
    [
     "a",
     "Slide nine says you developed the analysis. I completed that part. Can we correct it?"
    ],
    [
     "b",
     "I thought we agreed I was taking ownership of the results."
    ],
    [
     "a",
     "Of presenting the results, yes. That is different from doing the analysis."
    ],
    [
     "b",
     "They're considering me for promotion. They need to see that I can lead."
    ],
    [
     "a",
     "We can show both roles. You led the team and I developed the analysis."
    ],
    [
     "b",
     "If we change it now, they will think I couldn't do the work."
    ],
    [
     "a",
     "The work still needs the right credit."
    ],
    [
     "b",
     "You're not the one whose leadership is being judged."
    ]
   ],
   "focus": 5,
   "firstExplanation": "Leo explicitly connects the correction to a feared judgement of competence; he does not merely argue about job titles.",
   "secondExplanation": "Naming the correct attribution deals with the documented problem and need not depend on agreement about motives."
  },
  "clueIndices": [
   5,
   7
  ],
  "insight": "His words about what management will think reveal a threatened professional identity; the promotion raises the stakes without explaining the interpretation by itself.",
  "cycle": [
   "Maya identifies inaccurate credit.",
   "Leo imagines management seeing him as less capable.",
   "Leo resists the correction and challenges Maya.",
   "The immediate risk to his image may feel smaller, but the credit dispute escalates."
  ],
  "hypotheses": [
   "The correction may threaten how capable Leo believes he must appear.",
   "Leo only misunderstands who should be named as analyst.",
   "Leo has always been deliberately deceptive across his career."
  ],
  "sort": {
   "title": "Fact or inference?",
   "prompt": "Separate what the exchange establishes from an interpretation about Leo.",
   "categories": [
    "Directly observable",
    "Working interpretation"
   ],
   "items": [
    {
     "text": "The slide names Leo as the analyst.",
     "category": 0
    },
    {
     "text": "Leo fears being seen as incapable.",
     "category": 0
    },
    {
     "text": "Leo's self-worth depends on admiration.",
     "category": 1
    },
    {
     "text": "Avoiding exposure might reinforce his resistance.",
     "category": 1
    }
   ],
   "explanation": "Leo states his fear, but contingent self-worth and reinforcement remain hypotheses about the process behind the response."
  },
  "revision": {
   "evidence": "A month-old message shows Leo praising Maya for taking charge of the analysis. Yesterday he wrote to management that he personally developed it.",
   "prompt": "What does this additional evidence change?",
   "options": [
    "Knowing misattribution becomes more plausible, while threatened identity may still contribute.",
    "The messages prove a clinical personality disorder.",
    "The earlier discussion no longer matters because motives cannot be known."
   ],
   "explanation": "The private acknowledgement weakens simple role confusion. It strengthens a conclusion about his knowledge, not a full diagnosis."
  },
  "life": {
   "type": "cropped_reality",
   "title": "See the part left outside the frame",
   "prompt": "What conclusion is justified after seeing the complete exchange?",
   "scene": "You first see Leo saying, 'Maya wants to take credit from me.'",
   "frames": [
    [
     "Cropped message",
     "His words describe Maya's request as a threat."
    ],
    [
     "Original slide",
     "It names Leo as author of Maya's analysis."
    ],
    [
     "Maya's proposal",
     "She explicitly preserves Leo's leadership credit."
    ]
   ],
   "reveal": "The actual request corrects the analysis credit while leaving leadership acknowledged.",
   "options": [
    "Leo's description leaves out information essential for judging the dispute.",
    "Maya must be attacking his leadership.",
    "We can know Leo's entire personality from his summary."
   ],
   "explanation": "Changing the frame changes what appears to be at stake. Compare accounts with the original evidence when possible."
  },
  "action": {
   "title": "Protect the contribution",
   "prompt": "Maya needs a workable action, not a psychological victory.",
   "changePrompt": "What should she do next?",
   "changes": [
    "Request a written correction showing the different contributions.",
    "Persuade Leo to admit he has a damaged sense of worth.",
    "Accept the inaccurate slide to prevent embarrassment."
   ],
   "outcomes": [
    "The attribution can be checked against a concrete record.",
    "The argument becomes about personality instead of the slide.",
    "The inaccurate account stays in circulation."
   ],
   "explanation": "The first route remains useful whether Leo is frightened, strategic or both."
  },
  "transfer": {
   "title": "Another person, the same possible process",
   "prompt": "Sam hears 'I miss spending time together' and replies 'So I'm a terrible partner now?' Which new evidence would best test a recurring threat-to-worth pattern?",
   "options": [
    "Whether ordinary requests repeatedly become global judgements of Sam's worth.",
    "Whether Sam ever disagrees with a partner.",
    "Whether the partner uses affectionate language."
   ],
   "explanation": "A pattern requires repeated observations across relevant contexts and their consequences, not one defensive sentence."
  },
  "recall": {
   "prompt": "What phrase means self-worth that depends strongly on meeting a condition such as being admired?",
   "answers": [
    "contingent self-worth",
    "contingent self worth",
    "contingent self esteem",
    "contingent self-esteem"
   ],
   "explanation": "Contingent self-worth is a way of organising self-evaluation. The condition is the point, not the specific form of praise."
  },
  "takeaway": "A correction can threaten a person's image without becoming a legitimate reason to miscredit someone else's work."
 },
 {
  "title": "Confidence, pride and entitlement: where is the line?",
  "concept": "entitlement versus healthy confidence",
  "opening": "Aisha wins an award for a design she led. She thanks her colleagues and speaks openly about what she achieved. A friend calls her narcissistic for taking pride in it. Later, a different team member demands that others praise work he did not contribute to. These scenes can look similar from a distance because both involve recognition. They differ in what is being claimed and whether other people are allowed fair recognition. The task is to identify the distinction rather than treating visible confidence as a symptom.",
  "mechanism": "Healthy confidence concerns an ability or achievement that can be discussed against evidence. Pride can be satisfying without requiring other people's work to be diminished. Entitlement is a belief that one's position or special status justifies advantages that may not be earned or fairly distributed. Grandiosity goes further when an unusually elevated self-image becomes central to how someone manages relationships and setbacks. A person's public style alone tells us surprisingly little: a quiet person may feel owed exceptional treatment, while an expressive person may accept criticism responsibly. Look at the rules they apply to themselves and to other people, particularly when they do not get what they wanted.",
  "evidence": "Personality researchers distinguish ordinary variation in narcissistic traits from more disruptive functioning. Pincus and Lukowitsky review the difficulty of drawing firm boundaries between normal and pathological features. That matters because 'confident' and 'narcissistic' are everyday judgements often made after just one event. A clinically relevant pattern requires broader evidence of functioning, not simply a high-profile achievement or a desire to be seen. Examine reciprocal expectations: does the person think credit should follow actual work, including when somebody else deserves it?",
  "complication": "An apparently entitled response may result from misunderstanding an agreement, a flawed workplace reward system or a genuine under-recognition of effort. Conversely, somebody can make polite acknowledgements while privately controlling access to opportunities. Neither volume nor manners are reliable tests of a person's underlying trait. The question is whether an expectation remains reasonable when the same standard is applied to everyone affected, and whether the person can revise it when credible evidence arrives.",
  "closing": "Confidence is compatible with accurate credit and learning from mistakes. Entitlement becomes visible when people demand exceptions for themselves and deny comparable consideration to others. The next time someone calls a confident person narcissistic, ask which actual expectation was unfair. If there is no answer, the label has added little. If there is a repeated double standard, describe the conduct first and address its consequences.",
  "case": {
   "a": "Aisha",
   "b": "Nolan",
   "setup": "A design team is preparing an award announcement. Aisha led the work; Nolan joined at the end.",
   "turns": [
    [
     "a",
     "I'm going to thank the whole team and explain what I led."
    ],
    [
     "b",
     "Don't make it sound like you did more than anyone."
    ],
    [
     "a",
     "I was responsible for the design. You did the final quality check."
    ],
    [
     "b",
     "I'm the senior member. My name should come first regardless."
    ],
    [
     "a",
     "We can put the design and quality roles on the announcement."
    ],
    [
     "b",
     "The award should reflect my status. That's how teams work."
    ],
    [
     "a",
     "If we use that rule, we'd also have to apply it when you weren't involved."
    ],
    [
     "b",
     "That's different. My contribution is bigger even if I arrive later."
    ]
   ],
   "focus": 5,
   "firstOptions": [
    "Nolan claims special credit based on status rather than contribution.",
    "Aisha is demanding that nobody else be named.",
    "The team has already established an impartial rule for credits."
   ],
   "secondOptions": [
    "Propose an evidence-based attribution of roles.",
    "Agree that status always overrides work.",
    "Diagnose Nolan in front of the team."
   ],
   "secondExplanation": "Clear attribution addresses the fairness problem and gives the team a shared standard."
  },
  "clueIndices": [
   3,
   5
  ],
  "insight": "Nolan explicitly asks for a special rule that follows his status, not what he did on this project.",
  "cycle": [
   "An award creates a contest for public recognition.",
   "Nolan equates senior status with deserving first credit.",
   "He rejects a contribution-based attribution.",
   "Colleagues may stop trusting how credit is allocated."
  ],
  "hypotheses": [
   "Nolan believes his position entitles him to credit beyond the work completed.",
   "Aisha is exaggerating the hours she spent working.",
   "Nolan's statement proves he has a personality disorder."
  ],
  "sort": {
   "title": "Pride or unequal claim?",
   "prompt": "Which statements rely on actual work, and which rely on special treatment?",
   "categories": [
    "Evidence-based recognition",
    "Claimed special entitlement"
   ],
   "items": [
    {
     "text": "I led the design; the report should say so.",
     "category": 0
    },
    {
     "text": "My title means I deserve the prize regardless of my contribution.",
     "category": 1
    },
    {
     "text": "The quality reviewer should be named for their work.",
     "category": 0
    },
    {
     "text": "Other people's efforts matter less because I'm senior.",
     "category": 1
    }
   ],
   "explanation": "The difference rests on what the person claims and how the same principle treats others."
  },
  "revision": {
   "evidence": "The project agreement, signed before work began, says the senior member must be listed first on every external submission, regardless of individual contribution.",
   "prompt": "How should the judgement change?",
   "options": [
    "Nolan's claim now has a procedural basis, but the fairness and accuracy of the policy can still be questioned.",
    "The written rule proves Nolan has good character.",
    "The rule erases the fact that Aisha did the design."
   ],
   "explanation": "A policy can explain why someone expects a certain practice. It does not establish that the policy is fair or that the work should be misdescribed."
  },
  "life": {
   "type": "same_person_different_day",
   "title": "One confident person, two responses",
   "prompt": "What is the stronger evidence for entitlement?",
   "scene": "Aisha talks proudly about two designs she completed.",
   "frames": [
    [
     "First meeting",
     "She clearly names her own contribution."
    ],
    [
     "Second meeting",
     "She corrects herself after realising a colleague led a different task."
    ]
   ],
   "reveal": "Aisha accepts an accurate correction even when it reduces her own credit.",
   "options": [
    "Her willingness to correct the record matters more than how proudly she first spoke.",
    "Speaking enthusiastically proves entitlement.",
    "One correction proves she will never behave unfairly."
   ],
   "explanation": "Responsiveness to evidence is a more useful clue than outward confidence alone."
  },
  "action": {
   "title": "Agree an attribution rule",
   "prompt": "The team needs a rule everyone can understand.",
   "changePrompt": "What would you propose?",
   "changes": [
    "Write down who completed each contribution and check the wording together.",
    "Award every project to the most senior person.",
    "Ask the team to avoid discussing their achievements."
   ],
   "outcomes": [
    "Recognition can be aligned with evidence and revised when facts change.",
    "Status substitutes for authorship.",
    "Useful records of actual work are lost."
   ],
   "explanation": "Procedural clarity reduces one source of dispute without requiring agreement about anyone's personality."
  },
  "transfer": {
   "title": "The confident teenager",
   "prompt": "A 17-year-old says, 'I'm proud I came top in chemistry.' What would most clearly indicate an unfair sense of entitlement?",
   "options": [
    "They insist a classmate's higher-scoring project should be disqualified purely because they deserve to win.",
    "They celebrate their own grade with family.",
    "They decide to apply for a scholarship."
   ],
   "explanation": "The relevant issue is whether the person claims an unearned exception that disadvantages somebody else."
  },
  "recall": {
   "prompt": "What term describes believing you deserve special treatment or privileges without a fair basis?",
   "answers": [
    "entitlement",
    "sense of entitlement"
   ],
   "explanation": "Entitlement concerns the expectation itself, especially when it is not reciprocally justified."
  },
  "takeaway": "Pride in real achievements is compatible with fairness. Entitlement appears in the exception someone expects others to make for them."
 },
 {
  "title": "Grandiosity and vulnerability can belong to the same person",
  "concept": "grandiose and vulnerable expressions",
  "opening": "A student can sound invincible in public and feel exposed by a mild disappointment in private. Another may avoid attention, yet remain preoccupied with how little other people appreciate them. Popular accounts often sort these behaviours into two neat personality types. Clinical research is less tidy. Grandiosity concerns an inflated or exceptionally important self-presentation. Vulnerability concerns experiences of inadequacy, shame and sensitivity to evaluation. The two can coexist and may change with circumstances.",
  "mechanism": "Consider how a person manages self-worth after a setback. One response is to restore superiority: 'The judges are incompetent; I deserved first place.' Another is to withdraw and replay the humiliation. Both may help protect a fragile self-evaluation from remaining exposed. The outward expression differs, and the functions may overlap. Researchers therefore examine patterns across time rather than relying on a single label such as 'covert narcissist.' A person who is privately hurt after failure is not automatically narcissistic. We need to know how their sense of self, assumptions about other people and repeated conduct fit together.",
  "evidence": "The 2010 review by Pincus and Lukowitsky expressly argues that grandiosity and vulnerability should both be considered when defining pathological narcissism. It cautions against treating 'overt' and 'covert' modes as fixed separate types. Later ICD-11-oriented work evaluates severity and trait profiles rather than assigning a single behaviour to a whole personality. This is a good example of a scientific model becoming more precise: visible boasting and visible shame are not interchangeable with a diagnosis.",
  "complication": "Sensitivity after failure occurs in perfectionism, social anxiety, depression and ordinary disappointment. Anger after criticism can reflect the unfairness of the criticism itself. What moves the narcissism hypothesis forward is not one painful feeling but a broader pattern in which exceptional standing, other people's recognition and difficulties in reciprocity organise how the person functions. A competing explanation must be taken seriously when it predicts the evidence equally well.",
  "closing": "Avoid assigning people to cartoon versions of 'grandiose' or 'vulnerable.' Ask how they respond when they cannot maintain a desired image of themselves. Notice whether others are devalued, whether the person can revise the story, and what persists across circumstances. These questions offer richer evidence than deciding which informal 'type' somebody is.",
  "case": {
   "a": "Rafi",
   "b": "Ella",
   "setup": "Rafi enters a university competition and expects to win. Ella receives the award.",
   "turns": [
    [
     "a",
     "I honestly think the judging panel missed something in my work."
    ],
    [
     "b",
     "Your project was strong. Ella's was too."
    ],
    [
     "a",
     "They probably wanted a different image for the department."
    ],
    [
     "b",
     "Do you want to ask for feedback before deciding why?"
    ],
    [
     "a",
     "No. They'd never admit they chose badly."
    ],
    [
     "b",
     "You looked devastated when the result came out."
    ],
    [
     "a",
     "I worked for months. I feel ridiculous for believing I had a chance."
    ],
    [
     "b",
     "You can be disappointed and still find out what they thought."
    ]
   ],
   "focus": 6,
   "firstOptions": [
    "His reaction includes both a superiority claim and a painful sense of inadequacy.",
    "His words prove he has a personality disorder.",
    "He has received objective evidence that the judges cheated."
   ],
   "secondOptions": [
    "Invite him to seek feedback and evaluate it against his work.",
    "Agree that any loss proves the judges are incompetent.",
    "Tell him he is a covert narcissist."
   ],
   "secondExplanation": "Feedback could distinguish unfair judging from a self-protective account without pretending that losing should feel easy."
  },
  "clueIndices": [
   4,
   6
  ],
  "insight": "The dismissive certainty about judges and the self-denigrating reaction after losing show different expressions around the same setback.",
  "cycle": [
   "Rafi expects a result to confirm his exceptional ability.",
   "The award goes elsewhere.",
   "He dismisses the judges and privately feels inadequate.",
   "Without engaging with feedback, he loses a chance to update his account."
  ],
  "hypotheses": [
   "The result may threaten a self-image tied to exceptional achievement.",
   "The panel must have deliberately targeted Rafi.",
   "The exchange alone establishes a stable personality disorder."
  ],
  "sort": {
   "title": "Different expressions",
   "prompt": "Sort expressions, not people. The same person might show both.",
   "categories": [
    "Grandiose expression",
    "Vulnerable expression"
   ],
   "items": [
    {
     "text": "The judges couldn't recognise talent at my level.",
     "category": 0
    },
    {
     "text": "I feel exposed and ashamed that I thought I could win.",
     "category": 1
    },
    {
     "text": "Their criteria don't apply to someone like me.",
     "category": 0
    },
    {
     "text": "If anyone sees my mistakes, they'll know I'm nothing special.",
     "category": 1
    }
   ],
   "explanation": "Expressions describe a response in a context. They are not permanent human categories."
  },
  "revision": {
   "evidence": "The judging panel provides detailed feedback showing that Rafi's methodology failed a stated requirement. He reads it, apologises for his assumption and redesigns the work.",
   "prompt": "Which interpretation becomes weaker?",
   "options": [
    "An inflexible, enduring refusal to revise his self-image becomes less convincing.",
    "His initial disappointment never occurred.",
    "The revision proves grandiosity and vulnerability are unrelated."
   ],
   "explanation": "Responsive learning undercuts a claim of rigid resistance, even though the original reaction was still real."
  },
  "life": {
   "type": "hidden_subtitle",
   "title": "What the public version cannot show",
   "prompt": "Which conclusion follows from hearing both sides of Rafi's experience?",
   "scene": "In public, Rafi says, 'The judges were incompetent.'",
   "frames": [
    [
     "Public speech",
     "He appears dismissive and superior."
    ],
    [
     "Private note",
     "He writes that he feels ashamed about losing."
    ],
    [
     "Later behaviour",
     "He has not yet decided whether to ask for feedback."
    ]
   ],
   "reveal": "A strong outward claim can coexist with painful private self-evaluation.",
   "options": [
    "Different expressions may occur together and still require wider evidence before identifying a pattern.",
    "Public confidence proves that shame is impossible.",
    "Private shame automatically establishes pathological narcissism."
   ],
   "explanation": "The person cannot be reduced to the expression visible in a single moment."
  },
  "action": {
   "title": "Respond to the setback",
   "prompt": "Rafi asks what to do the following morning.",
   "changePrompt": "What gives him useful information?",
   "changes": [
    "Request the scoring criteria and compare them with the submitted project.",
    "Post a message claiming the winners were favoured.",
    "Stop entering competitions to avoid any future disappointment."
   ],
   "outcomes": [
    "The result becomes evidence he can examine rather than a final judgement of worth.",
    "The explanation is publicly fixed before it has been tested.",
    "Avoidance prevents new feedback and opportunities."
   ],
   "explanation": "Evidence can improve performance while leaving room for genuine disappointment."
  },
  "transfer": {
   "title": "A quieter version",
   "prompt": "A colleague never boasts but believes being overlooked proves everybody is beneath them. What is the most defensible conclusion?",
   "options": [
    "Apparent modesty alone does not rule out grandiose assumptions; examine their recurring behaviour and relationships.",
    "Only loud people can show narcissistic grandiosity.",
    "Quiet resentment proves a personality disorder."
   ],
   "explanation": "Outward volume is a poor substitute for examining expectations and functioning."
  },
  "recall": {
   "prompt": "Which term describes sensitivity to feeling inadequate or exposed in narcissism research?",
   "answers": [
    "narcissistic vulnerability",
    "vulnerability"
   ],
   "explanation": "Vulnerability describes one dimension of experience, not a fixed separate type of person."
  },
  "takeaway": "Grandiosity and vulnerability can overlap. A single boast or painful reaction says far less than a lasting pattern of self-evaluation and relationships."
 },
 {
  "title": "When admiration becomes a condition for feeling valuable",
  "concept": "external validation and unstable self evaluation",
  "opening": "Rosa is talented at music. She practises diligently and enjoys performing, yet an otherwise successful concert feels like failure if one influential person does not praise her. It is tempting to advise her to stop caring what anybody thinks. That misses something: evaluation is genuinely informative when skills develop. The problem begins when the absence of admiration becomes a verdict on her worth, rather than one piece of information about a performance.",
  "mechanism": "External validation means approval received from other people. Human beings need social feedback, and social recognition can encourage effort. The difficulty is dependence: if feeling acceptable requires repeated reassurance from a particular audience, the person may work harder to control that audience instead of assessing their actual progress. This can produce an unstable cycle. Praise briefly raises confidence. Ordinary silence then feels like a new deficit. The person may seek more reassurance or dismiss the people whose approval does not arrive. In a narcissistic formulation, this pattern can include a need to sustain an exceptional image, but the same behaviour can also arise from insecurity without narcissistic pathology.",
  "evidence": "Contingent self-esteem appears in research on pathological narcissism, including the 2009 Pathological Narcissism Inventory tradition. Pincus and Lukowitsky distinguish this self-regulation problem from a simple love of praise. The theory predicts that the meaning of feedback matters: a neutral response can feel punishing if a person has tied their worth to being exceptional. The research does not justify assuming that everyone who checks likes, reviews or applause is narcissistic.",
  "complication": "Rosa's conductor may have failed to provide expected feedback, or the performance may contain flaws she should learn from. The stronger question is whether one person's praise controls her entire sense of worth even when the evidence of her skill is broader. Looking only for reassurance can also become an obstacle: the performer may stop attending to comments that identify where to improve. The useful distinction is between feedback that updates a skill judgement and feedback treated as proof of personal worth.",
  "closing": "After an evaluation, separate the question 'How did I perform?' from 'What does this mean about me as a person?' Examine the former carefully. Resist turning a missing compliment into the latter. The aim is not indifference to other people; it is being able to use their feedback without requiring each response to keep your identity intact.",
  "case": {
   "a": "Rosa",
   "b": "Ben",
   "setup": "Rosa performed a solo. The audience applauded and the conductor gave technical feedback but no personal compliment.",
   "turns": [
    [
     "a",
     "I thought the piece went well until the conductor barely looked at me."
    ],
    [
     "b",
     "What did he say about the performance?"
    ],
    [
     "a",
     "He said the timing improved and that the final phrase needs work."
    ],
    [
     "b",
     "That sounds like information you can use."
    ],
    [
     "a",
     "If he thought I was really talented, he'd have said more."
    ],
    [
     "b",
     "Could the feedback be about the music rather than your value?"
    ],
    [
     "a",
     "I keep checking whether he posted about the concert."
    ],
    [
     "b",
     "Has that changed what you know about the piece itself?"
    ]
   ],
   "focus": 4,
   "firstOptions": [
    "She may be treating missing praise as evidence about her overall worth.",
    "The conductor has objectively established she has no talent.",
    "Her concern proves a permanent narcissistic pattern."
   ],
   "secondOptions": [
    "Separate the technical information from the need for endorsement.",
    "Insist that all teachers deliver personal praise after every task.",
    "Stop practising until she receives approval."
   ],
   "secondExplanation": "She can use concrete feedback without making her worth depend on a compliment."
  },
  "clueIndices": [
   4,
   6
  ],
  "insight": "Rosa moves from actionable technical feedback to a global interpretation of what a missing compliment means.",
  "cycle": [
   "Rosa hopes a performance will confirm her exceptional standing.",
   "The conductor offers technical feedback without praise.",
   "She interprets silence as evidence she is not valuable enough.",
   "Repeated checking offers little new information and makes the missing approval more central."
  ],
  "hypotheses": [
   "Approval from this audience may have become a condition for feeling capable and valued.",
   "The conductor has secretly decided to end Rosa's career.",
   "Rosa's checking establishes a personality disorder."
  ],
  "sort": {
   "title": "Use feedback or seek a verdict?",
   "prompt": "Decide whether each statement treats evaluation as information about a skill or as proof of personal value.",
   "categories": [
    "Skill information",
    "Verdict on self-worth"
   ],
   "items": [
    {
     "text": "The last phrase was rushed; I'll practise it slowly.",
     "category": 0
    },
    {
     "text": "If the conductor doesn't post about me, I'm worthless.",
     "category": 1
    },
    {
     "text": "The tempo was more stable this week.",
     "category": 0
    },
    {
     "text": "Only public admiration makes this performance count.",
     "category": 1
    }
   ],
   "explanation": "Skill judgements can be updated. Global worth cannot be read from one person's response."
  },
  "revision": {
   "evidence": "The conductor tells Rosa he was rushing to a rehearsal and had not commented on anyone's performance yet. He sends the same technical notes to all soloists.",
   "prompt": "What changes most?",
   "options": [
    "The interpretation of his silence as personal rejection loses support.",
    "Rosa's disappointment can no longer be real.",
    "Technical feedback no longer matters."
   ],
   "explanation": "The new context changes the meaning of silence without invalidating Rosa's feelings."
  },
  "life": {
   "type": "tomorrow_button",
   "title": "What the checking offers over time",
   "prompt": "Which conclusion best explains the cost of repeated checking?",
   "scene": "Rosa opens her phone to see whether the conductor has praised the concert.",
   "frames": [
    [
     "Now",
     "She feels briefly closer to an answer."
    ],
    [
     "Tomorrow",
     "No post appears; she checks again despite unchanged information."
    ],
    [
     "Next rehearsal",
     "She spends less time examining the actual timing notes."
    ]
   ],
   "reveal": "Checking may relieve uncertainty briefly while making the absence of praise more important.",
   "options": [
    "The immediate relief may make checking appealing even when it distracts from useful feedback.",
    "Checking always proves a pathological personality style.",
    "Silence from a teacher is evidence of failure."
   ],
   "explanation": "Consider the function of the behaviour and the longer-term information it displaces."
  },
  "action": {
   "title": "A better evaluation routine",
   "prompt": "Rosa wants to keep improving without chasing approval.",
   "changePrompt": "What would help after the next performance?",
   "changes": [
    "Record two observable strengths and one workable change before reading public reactions.",
    "Ask every audience member to rate her value as a musician.",
    "Avoid all technical feedback to protect confidence."
   ],
   "outcomes": [
    "Her assessment begins with evidence she can act upon.",
    "Her worth becomes dependent on a changing audience.",
    "She loses information required for improvement."
   ],
   "explanation": "A behaviourally specific evaluation protects access to useful criticism."
  },
  "transfer": {
   "title": "The social media version",
   "prompt": "A creator gets positive comments but focuses on one missing endorsement. What question best separates useful feedback from validation dependence?",
   "options": [
    "What new information would the endorsement provide about the work itself?",
    "How can they guarantee a compliment every day?",
    "Which follower should be blamed for the missing praise?"
   ],
   "explanation": "Evidence about work and a demand for reassurance serve different purposes."
  },
  "recall": {
   "prompt": "What two-word phrase means approval or endorsement received from other people?",
   "answers": [
    "external validation",
    "social approval"
   ],
   "explanation": "External validation can be useful; dependence on it becomes costly when it governs self-worth."
  },
  "takeaway": "You can welcome praise and use criticism without letting either become a verdict on your value as a person."
 }
];
