# Narcissism & Personality — human-use audit and case-centred redesign brief
**19 November 2026 | Nobody's Simple | A course-design proposal, not a clinical peer-review certificate**

## Findings from the published bundle and screenshots
All twelve lessons were inspected in the published `learn-content/courses/narcissism.json` file (version 6). They contain exactly 15 nodes each, for 180 nodes total. Every lesson uses an eight-turn dialogue with two checks, a set of surface-evidence tasks, a short core mechanism reading and a single special everyday-life format. The pedagogical experience is more repetitive than the nominal 11 different node-type sequences imply.

Across the 12 lessons, the main explanatory reading averages approximately **104 words** and the central research section **79 words**. These are not enough to develop the psychodynamic hypotheses the user expects. The existing 15-node formula permits eleven exercise checks while allocating less space to their underlying reasoning.

The authored source data contains **60 three-choice items** across dialogue, standard choice and everyday-life activities. In all 60, the strongest answer is stored first. Standard MCQ controls already randomise their display; the illustrated life-node control did not. A change committed on 19 November shuffles the latter. Randomising order solves positional leakage, not the weakness of implausible distractors. Items such as 'We can know Leo's entire personality from his summary' encourage learners to choose the only statement that sounds sensible, without analysing Leo.

The same research-reference string is copied into all 180 nodes. This causes repeated reading clutter and fails to show which study supports which claim. Rendering has now been revised to display references in a deduplicated lesson reading panel rather than after every paragraph and check. Future content must go further and identify the study type and the relevant claim.

The attached screenshots document pale text on pale scene/reveal cards, a dark green question legend on a dark background, generic course-landscape artwork that is unrelated to the social scene, and the double-answer sequence in Cropped Reality. CSS and the player have received targeted source-level patches, but live-browser and assistive-technology acceptance tests remain necessary.

## Why the present learning model misses the intended outcome
The current lesson asks a sequence of preformulated questions about one fictional case. The learner responds to the options chosen by the author. Three mechanisms reduce challenge:
- The strongest answer is linguistically obvious because distractors contain words such as 'always', 'proves', or 'entire personality'.
- The story characters state the psychological principle unusually directly. A line such as 'They will think I couldn't do the work' almost answers a self-worth question by itself.
- Explanations repeat an already named mechanism instead of showing how several hypotheses are distinguished.

The result measures the ability to recognise the author's preferred formulation more than the ability to build one. An advanced learner has little opportunity to disagree intelligently because plausible rival models are excluded from the answer set.

## Direction: a living evidence thread rather than fifteen isolated cards
Make a *developing exchange* the central object the learner returns to. A message, voice note or observed behaviour is the evidence. The interface shows the relevant passage in context; the learner can highlight a phrase to inspect its possible interpersonal function. A psychological hypothesis should come with:
1. The exact evidence it explains.
2. A specific psychological process linking that evidence to the behaviour.
3. An alternative process that could plausibly produce the same behaviour.
4. Information that would favour or weaken each explanation.
5. A predicted effect on the other participant.
6. A practical response that does not depend on proving an unconscious motive.

The important outcome is the quality of inference, not agreement with an author's single hidden motive. For example, a status threat, deliberate career advantage and genuinely ambiguous role expectations may coexist or compete. They should not be placed alongside absurd options to force a predetermined answer.

### Three complementary learning views
**Message Thread**: A realistic stream of texts or spoken lines. Learners highlight one turn and inspect how it changes the relationship. Earlier messages remain available for reference. Disclosed context changes what can be inferred.

**Inside the Head (hypothetical routes)**: A fictional mental-state view. Show several *possible* thought streams, labelled as alternatives rather than as facts about a real person's mind. For example: 'If I admit she did the work, I lose the promotion'; 'If I admit it, everyone will see I'm not worth much'; 'I thought project leadership included responsibility for this output.' The user tests each against the available conversation and future responses. Do not equate a route with a diagnosis.

**Relationship Loop**: Show both characters' plausible appraisals and their effects on each other's next response. Learners revise a diagram as new behaviour appears, then look for a different action that could interrupt the cycle. Allow asymmetric responsibilities; a mutual interaction does not imply equal blame.

### Ten reasoning depths (an investigative method, not ten compulsory screens)
1. What is literally said, asked or done?
2. What is the conversational move: request, deflection, justification, accusation or appeal?
3. What preceding relationship or power context changes the meaning?
4. What threat or opportunity might the speaker perceive?
5. What emotion, wish or conflict could make that appraisal consequential?
6. What defence or self-regulation strategy might the response perform, if any?
7. What position does the reply put the other person in, and what responses does it invite?
8. What self-reinforcing interpersonal loop might emerge if the behaviour repeats?
9. What competing mechanisms could also fit, and which evidence would distinguish them?
10. What response follows from known facts, what remains uncertain, and can the model transfer to a new case?

The instructor should never tell a beginner to work through all ten unaided. First model two or three depths, then gradually withdraw hints. For advanced learners, reduce prompts and increase ambiguity. Evidence for worked examples and guidance fading supports this scaffolding principle in other complex domains; evaluate its effectiveness within this particular psychology curriculum.

## Worked exemplar: Maya and Leo as an evolving message investigation

**1:05 PM — Maya**: “Your name is beside *analysis* on slide nine. That was my model. Can you correct it before the board sees it?”
**1:07 PM — Leo**: “You knew how much this meeting matters to me.”
**1:08 PM — Maya**: “I know. You led the project. I need my contribution named accurately.”
**1:11 PM — Leo**: “So you're going to humiliate me over a line of text.”
**1:14 PM — Maya**: “I asked on Monday, too. Here's the email.”
**1:16 PM — Leo**: “Keep the email. At least I know where I stand with you now.”

These lines contain a more interesting puzzle than “Leo fears looking incapable.” Leo shifts a claim about authorship into a claim about Maya's loyalty. That move could be an intentional attempt to suppress a correction. It could also be a response to anticipated humiliation that makes the correction feel like betrayal. It may be both. We should not decide which before exploring the evidence.

**Analysis of ‘You knew how much this meeting matters to me’.** Literally, Leo refers to a known high-stakes event. Relationally, he asks Maya to treat his professional future as a reason to suppress or delay her claim. Psychodynamically, he may be protecting a self-representation in which being a successful leader is vital to feeling valuable. An equally plausible, less internal explanation is that he knowingly wants credit that may influence a promotion. The statement is evidence of the way he frames the dispute, not a recording of the true origin of his motive.

**Analysis of ‘So you're going to humiliate me over a line of text’.** Leo changes *a disputed authorship claim* into *Maya doing him harm*. The learner must decide whether this is best understood as a hostile attribution, defensiveness about exposure, strategic moral reframing, or several processes at once. Ask what would change the interpretation. Did Leo previously acknowledge her work? Does he correct the slide privately? Does he use the same move when no promotion is at stake?

**Analysis of ‘At least I know where I stand with you now’.** The factual subject is now replaced by the relationship. The message may invite Maya to reassure Leo that she supports him instead of continuing the correction. That is an interactional consequence we can examine without claiming to know whether he intended it consciously. The question to the learner: “If Maya replies by defending her loyalty, what happens to the unresolved credit claim?” The response can interrupt a loop by returning to the action: “I respect the work you did leading the team. I still need the slide to credit the analysis accurately.”

**Revealed context A — private message:** A previous message shows Leo describing Maya's model as “the work that saved the project.” This supports that he knew her contribution. It strengthens the strategic misattribution hypothesis without ruling out shame or threat.

**Revealed context B — funding rule:** The organisation recognises only one named project lead in promotion decisions. This strengthens an institutional incentive account. It does not turn inaccurate attribution into accurate attribution.

**Revealed context C — a repeated pattern:** Three unrelated colleagues describe similar incidents over years. This changes the evidence for enduring interpersonal functioning. It still does not justify using a brief fictional story as a clinical diagnosis.

**Different ending:** Maya chooses a clear documented correction. The learner predicts likely reactions under each hypothesis and identifies what she can do regardless of the truth of Leo's private motivation.

This allows the same story to be used to study shame regulation, responsibility, reputation, interpersonal manoeuvres and the limits of inference. A strong learner should become able to identify *which account is strengthened by which new evidence*, not merely name a preferred defence mechanism.

## Lesson-by-lesson audit and direction

| Published lesson | Current missing depth | Revised investigative question |
| --- | --- | --- |
| Correction feels like attack | Fewer than 120 words teach the central mechanism; dialogue verbalises the answer | What exactly does a correction threaten: skill, reputation, a felt identity, an incentive, or a relationship? |
| Pride versus entitlement | A neat fairness test with barely plausible rivals | When does achievement become a claim on other people's recognition, and how does power change the rule? |
| Grandiosity and vulnerability | Two response categories may look like separate fixed personalities | How can shame and superiority coexist, and which defences alter the outward presentation? |
| Admiration as self-worth | Checking for praise is explained without enough history or contingencies | What does approval do psychologically, what changes when it disappears, and what else could explain the checking? |
| Empathy under pressure | The character repairs a poor response almost immediately | How does threatened self-focus narrow attention to another mind, and how do we distinguish capacity from behaviour? |
| Status and envy | Disappointment is a conspicuous clue; alternative structural problems are thin | When does social comparison become self-attack, devaluation or a justified challenge to a decision? |
| Idealisation and devaluation | A single swing is used to illustrate a complex relational defence | What does a mixed representation of another person require, and how might all-good/all-bad shifts be reinforced? |
| Apology as image protection | One-dimensional “reassurance versus repair” contrast | What does remorse accomplish, which interactional burden moves to the harmed person, and what counts as actual repair? |
| Traits versus disorder | Diagnostic caution replaces much of the explanation | How do enduring impairment, severity, context and competing disorders change a clinical inference? |
| Measurement | Psychometrics introduced in a short, abstract case | Why do different measures disagree, what do items actually capture, and how can a valid interpretation be built? |
| Change | The story treats understanding a defence as an early improvement | Which repeated behavioural changes would support change in emotion regulation, mentalisation and relationships? |
| Integrated case | A new workplace dispute repeats the central lesson's structure | Can the learner formulate an unfamiliar family/partner/workplace pattern across multiple perspectives, with updated evidence? |

## Curriculum reorganisation proposal
The current course has three four-lesson modules and only moves to clinical assessment late. For the next authored version:

**Unit 1: The contested self** — criticism and identity, conditional worth, grandiose/vulnerable self-states, comparison and envy.

**Unit 2: Defences inside relationships** — shame and defensive strategies, mentalising another person under threat, shifting evaluations of loved people, responsibility and repair.

**Unit 3: Origins, evidence and change** — compare developmental and psychodynamic theories without presenting origins as facts; use longitudinal evidence to distinguish trait from disorder; examine measurement, assessment and treatment; finish with a multi-context formulation capstone.

Each lesson should feature one emotionally credible central relationship and at least two brief contrasts from other settings. A parent–adult child exchange should not sound like a workplace dialogue with different nouns. Public speech, private messages and later behaviour should sometimes contradict one another. Include cases where the first hypothesis is wrong, and cases where a supposedly narcissistic behaviour is proportionate to an actual injustice.

## Editorial and interface acceptance criteria
- One stable story hub per lesson, with collapsible earlier messages and in-context phrase annotations.
- Text messages and optional thought paths are inspectable evidence; they are never certified windows into real minds.
- The majority of answer options should be genuinely plausible before additional information is revealed.
- Every major hypothesis identifies evidence for, evidence against and a decisive next question.
- No automatic scoring of one psychodynamic formulation as “the true motive” when data cannot resolve it.
- Research references map to claims and distinguish measured findings, theoretical accounts and fictional applications.
- A learner should be able to explain the psychological mechanism in ordinary language without relying on a recognised option.
- Beginner guidance is gradually faded; experienced learners can choose to attempt a case before seeing the analysis.
- Transfer cases should use different relationships and change the assumptions that made the first answer correct.
- All contrast-sensitive text and controls must be tested in light and dark modes, at phone sizes and keyboard zoom.
- Avoid decorative artwork that conceals the source or increases reading distance.
- Track *calibration*: whether a learner adjusts confidence correctly when relevant evidence changes.
- Validate comprehension with delayed independent cases; total drills and lesson length are necessary authoring checks, not certificates of learning quality.

## Scientific basis for the design
- Pincus & Lukowitsky (2010): conceptual disagreement over pathological narcissism and grandiose/vulnerable manifestations. https://doi.org/10.1146/annurev.clinpsy.121208.131215
- **Psychotherapeutic case formulation: Plan analysis for narcissistic personality disorder** (2022): heterogeneity and goal-directed formulation rather than mere trait labels. https://pmc.ncbi.nlm.nih.gov/articles/PMC9285548/
- **The Psychodynamic Formulation: Its Purpose, Structure, and Clinical Application**: attempts to resolve central conflicts may be adaptive and maladaptive. https://psychiatryonline.org/doi/10.1176/foc.4.2.297
- Bateman & Fonagy, *What is mentalizing?*: an inquisitive stance toward opaque mental states. https://academic.oup.com/book/1358/chapter-abstract/140335107
- **Conditions for Effective Learning from Erroneous Examples: A Systematic Review** (2025): benefits and limits of worked examples and guidance fading for beginners. https://link.springer.com/article/10.1007/s10648-025-10071-x

**Status:** Immediate contrast and reveal-flow bugs were patched in the repository. The proposed Message Thread / Inside the Head / Relationship Loop architecture is a design brief, **not yet implemented or deployed**. The twelve existing published lessons have not been replaced by this new architecture.
