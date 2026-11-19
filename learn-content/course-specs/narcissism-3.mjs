export const specs=[
 {
  "title": "When does a trait become a clinical disorder?",
  "concept": "personality dysfunction and impairment",
  "opening": "People describe a colleague as narcissistic after one competitive meeting, then wonder whether the person has narcissistic personality disorder. Those questions involve different levels of evidence. A personality trait describes a relatively stable tendency. A clinical disorder involves a pattern of difficulty serious enough to affect self-functioning or relationships and to warrant professional assessment. Someone can be difficult, vain or selfish without satisfying the criteria for a disorder. Someone can also have substantial difficulties that cannot be captured by a few memorable traits.",
  "mechanism": "A clinical assessment asks whether difficulties persist over time and appear across relevant contexts. The clinician considers identity, self-direction and the capacity to understand and sustain relationships. They explore the person's own experience rather than relying only on descriptions from people in conflict with them. Severity matters because everyday variation in confidence, ambition or defensiveness is not equivalent to lasting impairment. Modern dimensional approaches also distinguish how severely personality functioning is disrupted from the particular traits expressed. A diagnostic label is not an explanation of every behaviour: understanding the function of a particular conflict still requires attention to its circumstances.",
  "evidence": "The ICD-11 approach to personality disorder emphasises severity and trait domains rather than preserving every older named category. Research applying ICD-11 concepts to grandiose and vulnerable narcissistic vignettes has examined patterns of self and interpersonal dysfunction. Pincus and Lukowitsky's 2010 review identified disagreement between clinical and research traditions as a serious problem for diagnosis. These sources support careful differentiation. They do not permit assessment through an internet checklist or a story about someone who annoyed us.",
  "complication": "Clinical assessment may rely on reports that are incomplete or inconsistent. People can underreport difficulties because they are ashamed or because they lack insight. Others may describe the same events differently. That makes a longitudinal, collaborative and contextual approach important. It is not a reason to avoid a practical boundary while waiting for certainty. You may need to respond to exploitation or intimidation immediately, whether or not any diagnosis is present.",
  "closing": "Use trait language carefully and reserve disorder language for appropriate assessment. Ask what specifically is persistent, how it affects functioning and what alternative explanations remain. A clinical label should contribute to understanding care needs; it should never replace evidence about what an individual did in the situation you are trying to address.",
  "case": {
   "a": "Ivy",
   "b": "Omar",
   "setup": "Ivy works with an argumentative manager and asks Omar whether the manager must have a personality disorder.",
   "turns": [
    [
     "a",
     "He was furious when someone criticised the rota."
    ],
    [
     "b",
     "What else do you know about his behaviour?"
    ],
    [
     "a",
     "He also talks about his achievements constantly."
    ],
    [
     "b",
     "How long has this pattern been present?"
    ],
    [
     "a",
     "I only joined last month. People say he's hard to work with."
    ],
    [
     "b",
     "What do you know about his relationships or functioning outside this team?"
    ],
    [
     "a",
     "Almost nothing. But the behaviour is unpleasant."
    ],
    [
     "b",
     "You can address that conduct without deciding on a diagnosis."
    ]
   ],
   "focus": 4,
   "firstOptions": [
    "The evidence supports examining conduct but is too narrow for a clinical diagnosis.",
    "Two unpleasant behaviours establish a disorder.",
    "Ivy cannot take action until a clinician diagnoses the manager."
   ],
   "secondOptions": [
    "Document the specific conduct and follow the appropriate workplace process.",
    "Tell colleagues the manager has NPD.",
    "Ignore the rota problem because a diagnosis is uncertain."
   ],
   "secondExplanation": "The workplace problem is actionable on its own evidence; assessment of a disorder is a different task."
  },
  "clueIndices": [
   4,
   6
  ],
  "insight": "Ivy knows a short time window and little of the manager's wider functioning, but the workplace harm still requires a response.",
  "cycle": [
   "A manager reacts badly to a rota challenge.",
   "Ivy observes anger and status talk.",
   "She leaps to a disorder explanation.",
   "That label can distract from documenting what actually needs changing."
  ],
  "hypotheses": [
   "The available evidence describes conduct that deserves attention, not a sufficient basis for diagnosis.",
   "The manager certainly has lifelong personality disorder.",
   "No concern is justified without diagnostic certainty."
  ],
  "sort": {
   "title": "What kind of claim is this?",
   "prompt": "Distinguish an observation from a clinical conclusion requiring a much broader assessment.",
   "categories": [
    "Observed behaviour",
    "Clinical inference requiring assessment"
   ],
   "items": [
    {
     "text": "The manager raised his voice during two meetings.",
     "category": 0
    },
    {
     "text": "He has a pervasive personality disorder.",
     "category": 1
    },
    {
     "text": "Several colleagues report similar complaints this month.",
     "category": 0
    },
    {
     "text": "His self and interpersonal functioning are chronically impaired across contexts.",
     "category": 1
    }
   ],
   "explanation": "The second class of claims requires wider assessment of duration, severity and context."
  },
  "revision": {
   "evidence": "Independent records show the manager has repeatedly threatened staff over several years and has serious conflicts outside the workplace.",
   "prompt": "What can reasonably change?",
   "options": [
    "Concern about a persistent pattern strengthens, while clinical diagnosis still requires appropriate assessment.",
    "A personality disorder is now proven beyond doubt.",
    "Staff must accept the behaviour until a named diagnosis is confirmed."
   ],
   "explanation": "Longitudinal evidence strengthens pattern-level concerns without answering all the questions of clinical evaluation."
  },
  "life": {
   "type": "advice_stress_test",
   "title": "Test the diagnostic shortcut",
   "prompt": "What makes this a more defensible way to reason?",
   "scene": "An online post says, 'If someone boasts and reacts badly to criticism, they have NPD.'",
   "frames": [
    [
     "One meeting",
     "A colleague reacts defensively to an accurate correction."
    ],
    [
     "Years of information",
     "Persistent difficulties appear across relationships and responsibilities."
    ],
    [
     "Full assessment",
     "Severity, alternatives and the person's account are considered."
    ]
   ],
   "reveal": "The level of claim must match the breadth of evidence.",
   "options": [
    "Describe observed conduct and reserve disorder judgements for a broader assessment.",
    "Use the most memorable incident as a diagnostic test.",
    "Treat any criticism of conduct as unfair unless diagnosis is certain."
   ],
   "explanation": "Behavioural accountability and diagnostic caution can coexist."
  },
  "action": {
   "title": "Respond without labelling",
   "prompt": "Ivy needs a defensible way to raise a workplace concern.",
   "changePrompt": "Which route is strongest?",
   "changes": [
    "Record what happened, its effect and the requested correction.",
    "Publish a diagnosis of the manager on social media.",
    "Assume the incident did not matter because the cause is uncertain."
   ],
   "outcomes": [
    "The issue can be assessed through verifiable workplace evidence.",
    "A damaging personal accusation replaces the original complaint.",
    "A continuing problem remains unaddressed."
   ],
   "explanation": "Specific records allow action without psychiatric speculation."
  },
  "transfer": {
   "title": "In a family",
   "prompt": "A relative is repeatedly selfish. Which additional information would matter most to evaluating a disorder-level pattern?",
   "options": [
    "The severity and persistence of difficulties in their functioning and relationships, gathered through appropriate assessment.",
    "Whether they like photographs of themselves.",
    "Whether another relative uses the word narcissist."
   ],
   "explanation": "Clinical conclusions depend on enduring impairment and context, not a caricature."
  },
  "recall": {
   "prompt": "What word describes disruption serious enough to interfere with functioning in daily life or relationships?",
   "answers": [
    "impairment",
    "functional impairment"
   ],
   "explanation": "Impairment concerns meaningful difficulties in functioning; clinicians consider it alongside the pattern and context."
  },
  "takeaway": "A difficult behaviour may require immediate action. A personality-disorder conclusion requires substantially wider evidence."
 },
 {
  "title": "How do researchers measure narcissism, and where can they get it wrong?",
  "concept": "measurement validity and research interpretation",
  "opening": "Imagine two questionnaires. One asks whether you like leading a group. Another asks whether you feel ashamed and empty unless people admire you. Both might be described online as narcissism tests. They do not measure exactly the same experience. Scientific research depends on what its questions actually capture. If the measure is narrow, the conclusions it can support will also be narrow. This lesson treats questionnaires as tools for investigating an idea, rather than machines that reveal a person's hidden identity.",
  "mechanism": "A psychological construct is an idea researchers want to measure, such as contingent self-esteem. Because it cannot be observed directly, they choose indicators: answers to questions, behavioural tasks or reports across contexts. **Validity** asks whether those indicators support the intended interpretation. **Reliability** asks whether the measurement is consistent enough for its purpose. A questionnaire can be reliable and still miss the feature researchers care about. Self-report also depends on how people understand a question and what they are willing or able to disclose. Measures can be useful at group level without making any individual score a diagnosis.",
  "evidence": "Pincus and colleagues introduced the Pathological Narcissism Inventory in 2009 to assess several grandiose and vulnerable features, including contingent self-esteem. Pincus and Lukowitsky's review explains why using different definitions had produced conflicting pictures of narcissism. Those facts explain why scholars may disagree without one side being irrational: they sometimes studied different pieces of a disputed construct. A scale's scientific value must be judged against its stated purpose and evidence, not the authority suggested by the word 'test'.",
  "complication": "A high score may occur for different reasons. Someone could endorse a statement because they are currently stressed, because they interpret its wording unusually, or because a repeated trait genuinely fits. Cross-sectional data show people at one point in time and cannot, by themselves, establish a direction of causation. An association between shame and a scale does not prove that one caused the other. A careful reader asks how participants were selected, which alternative variables were measured and whether conclusions apply beyond the sampled group.",
  "closing": "When you see a claim that 'narcissists always do X,' ask how narcissism was measured and what kind of evidence supports the statement. This is not a request for endless doubt. It is a way to distinguish a well-supported average tendency from a claim about every individual. The stronger your question, the better the research has to be to answer it.",
  "case": {
   "a": "Mara",
   "b": "Theo",
   "setup": "Two students compare findings from different papers that both claim to study narcissism.",
   "turns": [
    [
     "a",
     "Study A says narcissism relates to leadership confidence."
    ],
    [
     "b",
     "Study B finds a relation with shame. Which one is wrong?"
    ],
    [
     "a",
     "The first used a measure of grandiose confidence."
    ],
    [
     "b",
     "And the second?"
    ],
    [
     "a",
     "It measured vulnerable features and contingent self-worth."
    ],
    [
     "b",
     "Then the disagreement might partly come from what they measured."
    ],
    [
     "a",
     "So calling both scores 'narcissism' hides a distinction."
    ],
    [
     "b",
     "Exactly. We still need to read how each measure was validated."
    ]
   ],
   "focus": 6,
   "firstOptions": [
    "The studies may operationalise different aspects of a broad contested construct.",
    "One study proves all prior research false.",
    "The word narcissism guarantees the measures are interchangeable."
   ],
   "secondOptions": [
    "Check item content, validation evidence and the actual sample.",
    "Pick the study with the more dramatic headline.",
    "Treat the highest score as a diagnosis."
   ],
   "secondExplanation": "Reading the method reveals what the scores could mean."
  },
  "clueIndices": [
   2,
   4
  ],
  "insight": "The two studies assessed different features, so superficially conflicting results may not be direct contradictions.",
  "cycle": [
   "Researchers define narcissism in different ways.",
   "They choose questionnaires reflecting their definitions.",
   "Studies report associations using the same broad label.",
   "Readers may mistake differences in measurement for a direct scientific contradiction."
  ],
  "hypotheses": [
   "Differences in construct definition and measurement may explain some contrasting findings.",
   "A single questionnaire always identifies the true disorder.",
   "Every association reported in a paper must be causal."
  ],
  "sort": {
   "title": "What does the data justify?",
   "prompt": "Separate conclusions a study can support from claims requiring more evidence.",
   "categories": [
    "Supports a limited research inference",
    "Requires additional evidence"
   ],
   "items": [
    {
     "text": "This sample's score relates to another measured variable.",
     "category": 0
    },
    {
     "text": "The questionnaire diagnoses every person who scores highly.",
     "category": 1
    },
    {
     "text": "The measure includes items about shame and approval.",
     "category": 0
    },
    {
     "text": "Shame must cause pathological narcissism.",
     "category": 1
    }
   ],
   "explanation": "A measured association and a causal diagnosis are different claims."
  },
  "revision": {
   "evidence": "On reading the methods, Mara discovers that one 'leadership' questionnaire mostly asks about confidence in public speaking, while the other includes items about distress when unadmired.",
   "prompt": "What becomes necessary?",
   "options": [
    "Interpret each result in relation to its actual items before comparing them.",
    "Average the two scores and call the result a disorder.",
    "Ignore both because the words overlap."
   ],
   "explanation": "The indicators define the scope of a score's interpretation."
  },
  "life": {
   "type": "freeze_frame",
   "title": "Inspect the questionnaire",
   "prompt": "Which clue matters most for interpreting the result?",
   "scene": "A website advertises a 'clinical narcissism score' after four quiz items.",
   "frames": [
    [
     "Item wording",
     "Several questions ask only about liking attention."
    ],
    [
     "Study sample",
     "No clinical validation is reported."
    ],
    [
     "Sales claim",
     "The page calls the result a diagnosis."
    ]
   ],
   "reveal": "The authority implied by a headline is not evidence of valid clinical measurement.",
   "options": [
    "Read what the items measure and whether the score has diagnostic validation.",
    "Trust the word 'clinical' in the heading.",
    "Assume all short quizzes are equally informative."
   ],
   "explanation": "A measure needs evidence for the claims made from its scores."
  },
  "action": {
   "title": "Evaluate a bold claim",
   "prompt": "A friend shows you a quiz result labelled 'NPD'.",
   "changePrompt": "What should you check first?",
   "changes": [
    "Identify the measure, the supporting research and whether it was designed for diagnosis.",
    "Infer their personality from the percentage alone.",
    "Share the score as proof about their relationships."
   ],
   "outcomes": [
    "The score is interpreted within its justified scope.",
    "An unsupported label is treated as clinical fact.",
    "A private result becomes a social accusation."
   ],
   "explanation": "Measurement quality determines what a result can mean."
  },
  "transfer": {
   "title": "Beyond personality",
   "prompt": "A study finds people with more stress also report poorer sleep. What is an equally important interpretation question?",
   "options": [
    "Could another factor influence both, and does the design allow causal claims?",
    "Which variable has the more frightening name?",
    "Can the correlation identify each participant's diagnosis?"
   ],
   "explanation": "The same measurement logic generalises beyond narcissism."
  },
  "recall": {
   "prompt": "What term asks whether a test supports the meaning we claim for its scores?",
   "answers": [
    "validity",
    "construct validity"
   ],
   "explanation": "Validity concerns the evidence for an interpretation; reliability alone cannot establish it."
  },
  "takeaway": "A psychological test can be precise about the wrong thing. Interpret a score through its items, sample and evidence."
 },
 {
  "title": "Can people with narcissistic difficulties change?",
  "concept": "treatment change and psychological formulation",
  "opening": "An online discussion says people with narcissistic personality disorder never change. Another claims a single insight will transform them. Both offer more certainty than the evidence can justify. Personality patterns can be persistent, and meaningful change is demanding. Treatment research for narcissistic personality disorder remains less developed than research for some other conditions. That leaves a question worth asking: what would improvement actually look like, and how could we tell whether it had happened?",
  "mechanism": "Change involves more than recognising a label. Someone may learn to tolerate criticism without treating it as humiliation, become better at seeing another person's perspective, or take responsibility without seeking immediate reassurance. These are observable changes in functioning. A formulation connects situations, interpretations and consequences so that therapy can target a repeated pattern. Progress is uneven: a person might manage work criticism better while still struggling in intimate relationships. The relevant test is whether patterns of behaviour and relationships improve over time, particularly when the person is stressed. Promises made after a dramatic confrontation are weaker evidence than sustained conduct.",
  "evidence": "Narcissistic personality disorder is addressed in clinical literature through careful assessment and individualised psychological treatment, but robust disorder-specific randomised trial evidence remains limited. The Royal College of Psychiatrists explains that personality-disorder care should be planned through assessment of the person's needs rather than by a single technique or medication. This matters for educational claims: we can describe plausible therapeutic targets without promising a particular cure. The development of dimensional assessment also encourages attention to severity and functioning rather than treating identity as fixed.",
  "complication": "A learner may be in a relationship with someone who repeatedly harms them. Teaching the possibility of change must not become a demand that they stay exposed. Another person's improvement is ultimately shown through their choices. The affected person can decide what they will accept without diagnosing the other party or becoming their therapist. A person seeking help may also need to work with shame that makes it hard to acknowledge their conduct. Naming those barriers explains why treatment can be difficult; it does not transfer responsibility to somebody else.",
  "closing": "The defensible position is neither 'never' nor 'always.' Watch for sustained accountability under situations that previously triggered defensive behaviour. Look for real changes in relationships rather than only insight language. Encourage proportionate help when appropriate, while preserving the right of other people to set boundaries or leave a harmful situation.",
  "case": {
   "a": "Nico",
   "b": "Harper",
   "setup": "Nico has begun therapy after repeated conflicts over criticism. Harper wants to know whether apologies mean change.",
   "turns": [
    [
     "a",
     "I've learned I get defensive because I feel embarrassed."
    ],
    [
     "b",
     "That sounds like an insight. What did you do after the last argument?"
    ],
    [
     "a",
     "I apologised for talking over you."
    ],
    [
     "b",
     "Did you let me finish when we talked again?"
    ],
    [
     "a",
     "No. I interrupted, but I noticed and asked you to continue."
    ],
    [
     "b",
     "That was different. The interruption still happened."
    ],
    [
     "a",
     "I want to track whether that happens less often."
    ],
    [
     "b",
     "The pattern over time will tell us more than one good conversation."
    ]
   ],
   "focus": 4,
   "firstOptions": [
    "Nico shows early signs of change in how he responds, but sustained improvement remains to be seen.",
    "One apology proves the entire problem is resolved.",
    "A past pattern means he is incapable of any improvement."
   ],
   "secondOptions": [
    "Observe concrete behaviour over time and maintain clear limits.",
    "Promise that Harper must forgive every future interruption.",
    "Assume self-insight is identical to repair."
   ],
   "secondExplanation": "Follow-up behaviour is stronger evidence than either a label or a promise."
  },
  "clueIndices": [
   4,
   6
  ],
  "insight": "Nico's observed attempt to pause matters more than a declaration that he understands himself; it is still only one instance.",
  "cycle": [
   "A criticism evokes embarrassment.",
   "Nico interrupts to defend his image.",
   "The conversation escalates and the original issue is not addressed.",
   "Practising a pause and repair could interrupt the pattern if it becomes consistent."
  ],
  "hypotheses": [
   "Behavioural change is possible but needs repeated evidence over time.",
   "Any awareness of a pattern guarantees a cure.",
   "Past defensiveness proves future change is impossible."
  ],
  "sort": {
   "title": "Insight or demonstrated change?",
   "prompt": "Which examples involve observable new behaviour rather than explanation alone?",
   "categories": [
    "Observable action",
    "Statement of insight or intention"
   ],
   "items": [
    {
     "text": "I paused and listened after noticing I interrupted.",
     "category": 0
    },
    {
     "text": "I understand exactly why I get defensive.",
     "category": 1
    },
    {
     "text": "I corrected the inaccurate credit without being prompted.",
     "category": 0
    },
    {
     "text": "I promise that I'm a different person now.",
     "category": 1
    }
   ],
   "explanation": "Insight can support change, but observable action is the stronger test."
  },
  "revision": {
   "evidence": "Over the next three months Nico repeatedly acknowledges criticism, corrects mistakes promptly and does not demand reassurance before doing so.",
   "prompt": "What changes most?",
   "options": [
    "The evidence for sustained improvement becomes stronger, though difficulties may still recur.",
    "Three months guarantee lifelong change.",
    "His earlier harmful conduct is erased."
   ],
   "explanation": "The time pattern matters; change is judged through behaviour, not a declaration of perfection."
  },
  "life": {
   "type": "tomorrow_button",
   "title": "Change has a time dimension",
   "prompt": "What should count as evidence of progress?",
   "scene": "Nico tells Harper he has changed after reading about self-worth.",
   "frames": [
    [
     "Today",
     "He understands a possible mechanism."
    ],
    [
     "After a disagreement",
     "He notices and repairs an interruption."
    ],
    [
     "Months later",
     "The corrective behaviour appears in several difficult conversations."
    ]
   ],
   "reveal": "Sustained conduct under stress is stronger evidence than immediate declarations.",
   "options": [
    "Look for repeated behavioural repair across contexts.",
    "Assume the first insight guarantees safety.",
    "Treat a single setback as proof that all improvement was false."
   ],
   "explanation": "A pattern requires multiple observations over time."
  },
  "action": {
   "title": "Agree on an observable test",
   "prompt": "Nico and Harper are discussing what would help them judge progress.",
   "changePrompt": "Which agreement is most testable?",
   "changes": [
    "Nico will stop interrupting, acknowledge lapses and revisit the issue after difficult conversations.",
    "Harper will accept that Nico's intention proves no harm can happen.",
    "Both will avoid all future criticism."
   ],
   "outcomes": [
    "Future observations can show whether the behaviour changes.",
    "Accountability becomes impossible to evaluate.",
    "Avoidance removes opportunities to practise repair."
   ],
   "explanation": "Observable goals make it easier to recognise improvement and continued harm."
  },
  "transfer": {
   "title": "A family member makes a promise",
   "prompt": "After repeated arguments, a relative says, 'I've realised why I shout, so it won't happen again.' What would best indicate meaningful change?",
   "options": [
    "A sustained pattern of responding differently during later disagreements.",
    "The emotional intensity of the promise.",
    "Whether they use the most sophisticated psychological terms."
   ],
   "explanation": "Improvement must appear where the problematic behaviour previously occurred."
  },
  "recall": {
   "prompt": "What term means a working account of the situations, interpretations and consequences that may maintain a difficulty?",
   "answers": [
    "formulation",
    "psychological formulation",
    "functional formulation"
   ],
   "explanation": "A formulation organises evidence and guides change; it is tested and revised as new information appears."
  },
  "takeaway": "Change is possible to investigate through sustained behaviour. Neither a diagnosis nor a promise can substitute for what happens over time."
 },
 {
  "title": "The full case: understanding conduct without excusing it",
  "concept": "integrative formulation and proportionate boundaries",
  "opening": "You are asked to advise a small arts organisation. Its director, Celeste, has a reputation for brilliance. Staff also describe being belittled when they disagree with her, and two people say their work has been credited to her. A newly appointed trustee wants to declare that Celeste has narcissistic personality disorder. Another trustee believes that talented leaders should not be challenged. Neither response fits the evidence. Your task is to reach a useful decision without pretending you can read Celeste's mind.",
  "mechanism": "A competent formulation identifies the actions that need addressing and the possible mechanisms behind them. If Celeste is strongly invested in being seen as exceptional, criticism may become threatening. She may defend her position by dismissing colleagues. If doing so secures admiration or prevents challenge, the behaviour could persist. But other explanations deserve examination: the organisation may reward misleading credits, or Celeste may misunderstand specific agreements. These hypotheses can be tested against documents and repeated conduct. The psychological account should explain likely processes while keeping responsibility for harmful actions with the person who performs them.",
  "evidence": "Research on narcissism offers concepts such as grandiosity, vulnerability, contingent self-esteem and interpersonal impairment. It does not supply a shortcut to diagnosing Celeste from staff reports. Clinical assessment requires a broader evaluation. Organisational decisions depend on documented conduct, clear policies and the needs of people affected. A board can correct attribution and protect staff without establishing a psychiatric label. Scientific caution becomes useful when it prevents an exaggerated conclusion; it becomes evasive when it delays action on evidence already sufficient for an ordinary practical decision.",
  "complication": "A striking example does not necessarily predict every situation. Staff complaints should be examined carefully, including documentary evidence and opportunities for fair response. At the same time, 'we do not know the motive' is not a reason to ignore repeated misattribution. The safest account separates four questions: what happened, what seems to maintain it, what additional evidence could change the explanation and what the organisation is responsible for doing now. Those answers can differ without contradiction.",
  "closing": "The entire course leads here. You can recognise self-worth threat without turning it into a disorder. You can examine a claim of unfairness without declaring every complainant correct. And you can take proportionate action without knowing somebody's complete inner experience. Good psychology makes the next decision more accurate. It does not merely give you a more impressive word for behaviour you dislike.",
  "case": {
   "a": "Trustee",
   "b": "Chair",
   "setup": "Two trustees discuss allegations against director Celeste after reviewing an audit of authorship.",
   "turns": [
    [
     "a",
     "The staff are describing humiliating reactions to ordinary feedback."
    ],
    [
     "b",
     "We should find out which incidents are documented."
    ],
    [
     "a",
     "We also have two drafts showing staff work credited to Celeste."
    ],
    [
     "b",
     "That attribution can be checked and corrected."
    ],
    [
     "a",
     "She says any challenge undermines her authority."
    ],
    [
     "b",
     "That may tell us what she fears is at stake."
    ],
    [
     "a",
     "Could we still act without diagnosing her?"
    ],
    [
     "b",
     "Yes. We can review authorship and workplace conduct against a fair standard."
    ]
   ],
   "focus": 4,
   "firstOptions": [
    "Her response may concern status, while the attribution itself is an independently checkable issue.",
    "Her words alone prove narcissistic personality disorder.",
    "A talented director cannot mistreat staff."
   ],
   "secondOptions": [
    "Investigate the records, protect complainants and correct documented conduct.",
    "Publish an informal clinical diagnosis.",
    "Drop the complaints because there may be emotional reasons."
   ],
   "secondExplanation": "Decisions should follow checkable conduct and proportionate procedural protections."
  },
  "clueIndices": [
   2,
   4
  ],
  "insight": "The documentary attribution and Celeste's stated concern about authority provide different kinds of evidence that should be handled separately.",
  "cycle": [
   "A staff member offers criticism or requests accurate credit.",
   "Celeste interprets challenge as undermining exceptional authority.",
   "She responds by dismissing the complaint or asserting her position.",
   "Staff confidence falls and the underlying issue may recur without correction."
  ],
  "hypotheses": [
   "A status-protection process may coexist with incentives to claim other people's work.",
   "Celeste's talent guarantees her conduct is justified.",
   "A diagnosis can be made from the two trustees' conversation."
  ],
  "sort": {
   "title": "Where does each claim belong?",
   "prompt": "Separate observations, plausible processes and excessive diagnostic leaps.",
   "categories": [
    "Evidence-led claim",
    "Unsupported leap"
   ],
   "items": [
    {
     "text": "The draft credits Celeste for material produced by another author.",
     "category": 0
    },
    {
     "text": "Celeste therefore has a specific lifelong disorder.",
     "category": 1
    },
    {
     "text": "Her language suggests a possible concern about authority.",
     "category": 0
    },
    {
     "text": "Every staff report must be true because her leadership is unpopular.",
     "category": 1
    }
   ],
   "explanation": "Evidence of conduct, possible process and diagnosis carry different burdens of proof."
  },
  "revision": {
   "evidence": "A record shows Celeste corrected several staff credits promptly in earlier years, but recent complaints followed a change in senior funding tied to her public image.",
   "prompt": "How should your formulation change?",
   "options": [
    "The financial and status context may help explain the recent shift; neither earlier cooperation nor current harm should be ignored.",
    "The funding change excuses any misattribution.",
    "Her earlier corrections prove every current complaint false."
   ],
   "explanation": "New context can explain change without settling responsibility or diagnosis."
  },
  "life": {
   "type": "advice_stress_test",
   "title": "The dangerous shortcut",
   "prompt": "Which action survives a test against fairness and evidence?",
   "scene": "The board is offered the advice: 'Decide whether Celeste is a narcissist before you act.'",
   "frames": [
    [
     "Staff complaint",
     "A concrete incident can be investigated."
    ],
    [
     "Document trail",
     "Authorship can be compared against drafts."
    ],
    [
     "Clinical question",
     "A disorder cannot be established from these records alone."
    ]
   ],
   "reveal": "The board has enough to act on documentary conduct without making a clinical judgement.",
   "options": [
    "Use evidence and fair procedures to address the harm directly.",
    "Require staff to obtain a diagnosis of Celeste first.",
    "Treat a psychological label as proof of misconduct."
   ],
   "explanation": "A responsible decision starts with the problem the organisation actually has authority to resolve."
  },
  "action": {
   "title": "What should the board do first?",
   "prompt": "The staff need a process that is safe and fair.",
   "changePrompt": "Which proposal is proportionate?",
   "changes": [
    "Review the documentation independently, correct misattribution and establish a safe complaint process.",
    "Require employees to publicly diagnose the director.",
    "Ignore staff until Celeste has finished her next project."
   ],
   "outcomes": [
    "Specific conduct can be evaluated and remedied with accountability.",
    "Speculation creates further harm and weakens the process.",
    "The risk of repeated mistreatment continues."
   ],
   "explanation": "Practical accountability does not depend on agreement about hidden motives."
  },
  "transfer": {
   "title": "Beyond the workplace",
   "prompt": "A friend says their partner repeatedly takes credit for shared decisions and reacts angrily to correction. What is the strongest advice?",
   "options": [
    "Focus on documented events, effects and reasonable boundaries, while keeping explanations tentative.",
    "Prove the partner has NPD before discussing the issue.",
    "Assume that an anxious motive makes the behaviour harmless."
   ],
   "explanation": "The course's central skill transfers to intimate relationships without importing a diagnosis."
  },
  "recall": {
   "prompt": "What term describes an evidence-based working explanation of what may cause and maintain a pattern?",
   "answers": [
    "formulation",
    "functional formulation",
    "psychological formulation"
   ],
   "explanation": "Formulation is a revisable account, not an identity assigned from one behaviour."
  },
  "takeaway": "Understanding why someone may protect their self-image can improve a response. It never requires accepting harm or pretending that a hypothesis is a diagnosis."
 }
];
