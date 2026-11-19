# Nobody's Simple — Learn audit
**19 November 2026 · Repository-based editorial and technical audit**

## Executive finding

The published Learn catalogue contains twenty psychology courses and 240 lessons. The visual design and interactive components have developed faster than the curriculum. The core educational problem is repeated scaffolding: across all twenty courses, the same twelve-lesson structure recurs, the distributions of node types are effectively identical, and six generic introductory lessons precede a small number of distinct applied case lessons. Learning about shame should not feel as though the nouns in an anxiety lesson have been replaced. At present, parts of the system do.

There is no credible way to describe 240 lessons as thoroughly expert-reviewed merely because they pass JSON validation. Structural validation catches missing fields. It cannot establish whether a claim is faithful to the literature, whether an interpretation is the strongest available, whether a distractor is misleading, or whether a learner has understood a difficult idea.

The strongest route is to replace quantity as the primary signal of progress with tested comprehension. One ten-minute lesson that changes how a learner understands and handles a real situation is worth more than five short sequences that reward choosing familiar phrases.

## Evidence examined

I inspected the live repository's Course Lab schema, course player, assessment and progress modules, curriculum plan, and the published JSON for all twenty courses. I compared the published **Narcissism — Lesson 01** against the supplied document *LESSON 01: Why does criticism feel like an attack?* I also reviewed official descriptions of Yale/Coursera's *Introduction to Psychology*, Brilliant's lesson method, Khan Academy's mastery system, Duolingo's mistake review and spaced practice, and OpenStax's research-based course structure.

Current published inventory: **20 courses; 240 lessons; 1,320 nodes**. Each course has twelve published lessons in three modules. The unpublished blueprints describe fifty modules and 300 future lessons per course, which would amount to **6,000 planned lessons** across the catalogue. That would be a very large editorial undertaking even for a staffed institution.

There are **at least 460 authored exercise nodes with more than four answer choices** in the published bundles. This count covers top-level node option arrays, so it does not include every additional choice inside multi-question dialogue nodes. The newly revised player limits the choice screens to four alternatives while retaining the authored best answer, but the excess options remain in the underlying material until editors review them.

## What is wrong and why it matters

### 1. A shared template has displaced subject-specific teaching

Six introductory lessons across every course reuse the same titles: “What are we studying?”, “Two ideas you will keep meeting”, “Similar words, different claims”, “First notice what happened”, “Two explanations can sound reasonable”, and “Ready for a real case”. The repeated format is easy to generate and administer. It also teaches the learner to anticipate the lesson pattern rather than examine what makes the subject distinctive.

Some foundational reasoning should be common across courses. Evidence versus interpretation is a transferable skill. It should have a shared home, a short diagnostic check and optional review. Once the learner understands it, the Narcissism course should spend its time on narcissistic functioning, self-esteem regulation, grandiosity, vulnerability, interpersonal consequences, rival explanations and diagnostic boundaries. A sleep course needs a different conceptual sequence: sleep pressure, circadian timing, conditioned arousal, common misinterpretations and evidence-based treatment principles. Copying the same exercise pattern onto both leaves important explanatory differences underdeveloped.

**Editorial action:** maintain shared foundational skills once. Build a dedicated concept map and prerequisite chain for every subject. Do not fill 300 lesson outlines simply because the blueprint has space.

### 2. The scientific explanation is often shorter than the assessment

In the earlier published Narcissism case, the explanatory material on self-worth appeared in one brief reading node, while the remainder consisted largely of questions and feedback. Repeated practice is useful only when learners have something sufficiently clear to retrieve. A learner who guesses the right option may still lack a usable model of the process.

A deep lesson should introduce the question through a real example, explain the mechanism in ordinary language, demonstrate why it fits the evidence, test a rival account, and return to a new example. When a research term becomes necessary, define it at the point it first appears and show what it adds. A glossary is useful for recall; it cannot substitute for a coherent explanation.

**Editorial action:** give every core lesson a claim-led teaching passage supported by identified research. Differentiate empirical finding, theoretical model and application to a fictional case.

### 3. Answer questions are sometimes measuring recognition rather than understanding

A long multiple-choice item can be solved by noticing the academically cautious response, especially when distractors make implausibly absolute claims. One current content pattern repeatedly contrasts an understated best answer with overconfident diagnoses. Learners quickly learn the trick without learning the psychology.

A better distractor should express a genuine rival hypothesis, an incomplete inference or a tempting action with a real trade-off. Ask why the best answer is stronger, not simply why the others sound extreme. Use a compact choice set only where choosing between alternatives is the skill. For many concepts, selecting a line of evidence or reconstructing a cause-and-consequence sequence is more revealing.

**Editorial action:** limit conventional options to two to four, remove rote repetitions and prefer varied near-neighbour practice. Preserve plausible disagreements rather than forcing premature certainty.

### 4. The same skill is not sufficiently rehearsed under changed conditions

The original player marked a response, displayed feedback and moved forward. The learner could finish with unresolved mistakes. The revision now schedules every missed item for a second attempt before the lesson ends, keeps first-attempt accuracy separate and distinguishes corrected work. This is closer to meaningful retrieval practice, although immediate correction followed by another identical question tests relatively near-term retrieval. Later review should use a new case rather than only the memorised answer.

**Editorial action:** use retrieval after explanation, again at the end of the lesson, and later through the existing review schedule. Eventually schedule individual concepts according to errors rather than treating the whole lesson as equally weak.

### 5. Feedback often states an interpretation without showing the evidential route

The most useful feedback explains which specific clue was decisive and why the leading alternative was weaker. It should make a student more accurate on the next problem. Generic lines such as “this is a genuine idea, but the case does not establish it” become wallpaper if repeated across hundreds of items.

The feedback should also distinguish factual mistakes from uncertainty and from choices where more than one response could be defensible. For example, in an interpersonal conflict, a direct request and a formal escalation may each be appropriate at different points. The task must state its constraints before identifying the stronger response.

**Editorial action:** require each answer to document a decisive clue, a rival interpretation, and the circumstance in which the conclusion could change. Review that reasoning manually.

### 6. Clinical nuance is currently repetitive rather than diagnostic of the issue

Saying “this cannot establish a diagnosis” is useful when learners might otherwise turn a behaviour into a clinical label. Repeating the same warning in every answer can crowd out the psychology. The necessary distinction is often between a transient response, a recurring trait and an impairing clinical pattern. Once those concepts have been properly taught, the course can use them precisely without repeating a generic disclaimer.

**Editorial action:** place diagnostic boundaries exactly where a learner is asked to cross from observation to inference. Use the saved space to describe mechanisms, heterogeneity, functional impairment and alternative explanations.

### 7. References are present but not adequately integrated into learning

Many nodes contain a free-text citation. A repeated reference can be valid, but listing a paper does not establish that the specific sentence follows from its findings. Nor does it show a sixteen-year-old what the study investigated, what it measured or why the result matters.

An expert resource should have an accessible evidence layer: complete references, DOI or stable links, study type, the precise claim the work supports, and an explanation of significant limits. The core teaching should remain readable without opening an article. Interested learners should be able to inspect the research immediately.

**Editorial action:** create a structured evidence panel for each lesson and a claim-by-claim reference review before publication. Make corrections and review dates visible to staff.

### 8. The published duration and the real task can disagree

The player previously used a hard-coded five-minute label. Some foundational lessons are too short to support a ten-minute estimate. Other detailed activities can easily take longer than ten minutes, particularly for learners who read slowly, revisit the dialogue or use assistive technology. Merely changing the displayed number does not lengthen teaching.

**Editorial action:** author against a roughly ten-minute target, estimate from the visible material and number of decisions, and then verify with users. Do not enforce a timer. Longer lessons can exist when the extra time earns understanding; split only when doing so preserves the logical argument.

### 9. Progress still places too much emphasis on completion

First-attempt accuracy, corrected errors, successful transfer and later retention are different outcomes. A learner who sees the right answer and repeats it one minute later has demonstrated something useful, but less than a learner who applies the principle unprompted in a different context a week later.

**Editorial action:** progress should report what was answered correctly unaided, which errors were corrected, what is due for later review, and where transfer remains untested. Avoid claims that these activities objectively measure a person's emotional intelligence or psychological health.

### 10. The learner needs a reason to care before terminology appears

Your supplied Lesson 01 has an effective opening: a concrete dispute over authorship. The reader sees what each person wants before encountering contingent self-worth or functional formulation. The interaction earns the explanation. Several published introductory lessons reverse the order: the learner receives a definition and then identifies it in a generic example.

**Editorial action:** write the situation first where the subject allows it. Introduce specialist terminology only when it resolves a real ambiguity. Explain each term in plain English once, show it operating in context, and allow a learner to retrieve the definition whenever needed.

### 11. Illustrations still frequently decorate rather than teach

The site has recognisable course scenery and a distinctive cast, but a course landscape cannot substitute for a carefully staged image of a particular conversation or decision. A learner should be able to identify something in the picture, change a condition or reveal what was hidden. Illustration earns its place when a specific interaction depends on it.

**Editorial action:** commission or create a small bank of consistent scene assets, including workplace disagreement, phone conversation, public-speaking anxiety and everyday task initiation. Make them reusable, but vary the actual evidence in each lesson. Provide text-based controls for every illustrated interaction.

### 12. There is not yet a defensible content-production review chain

The staff console supports authoring and a Ready marker. The existing schema checks IDs, choices and basic required fields. A psychologically plausible answer can still be false, weakly evidenced or misleadingly worded. A proofreader can fix spelling without noticing a clinical overclaim. These are different review jobs.

**Editorial action:** separate authoring, scientific evidence review, clinical formulation check where relevant, plain-language edit and usability test. Record who reviewed a lesson and against which version. A structural checker may block obvious omissions; it must never be described as clinical certification.

## What established courses get right, and how to go further

| Benchmark | What they do well | What Nobody's Simple should borrow | The additional step |
|---|---|---|---|
| Yale/Coursera *Introduction to Psychology* | Builds curiosity through important questions and research examples, supported by lectures and readings | Teach what an experiment or real observation actually demonstrates | Let the learner manipulate the interpretation, test competing hypotheses and revise a judgement within a short case |
| Brilliant | Uses visual explanations and guided problem solving; similar examples reinforce a single concept | Make the interaction carry the meaning, with short clear steps | Use branching consequences with explicitly uncertain outcomes; psychology is not a deterministic machine |
| Duolingo | Clear paths, mistake review and later retrieval | Automatically revisit missed work, preserve an obvious next step | Require genuine transfer to a new context, not only repetition of an answer whose wording is now familiar |
| Khan Academy | Progress is organised around demonstrated mastery rather than merely exposure | Distinguish new material from practice and review | Track understanding, application and evidence revision separately; never turn a learning score into a personality judgement |
| OpenStax Psychology | Explicit objectives and a structured account of scientific evidence | Connect concepts to methods and credible readings | Show what each source supports at the exact point of use and teach competing explanations in a realistic situation |

Official sources:
- Yale Online: https://online.yale.edu/courses/introduction-psychology
- Brilliant: https://brilliant.org/about/
- Duolingo mistake review: https://blog.duolingo.com/spaced-repetition-for-learning/
- Khan Academy mastery: https://support.khanacademy.org/hc/en-us/articles/5548760867853--How-do-Khan-Academy-s-Mastery-levels-work
- OpenStax Psychology 2e: https://openstax.org/books/psychology-2e/pages/2-1-why-is-research-important
- Retrieval, spacing and interleaving meta-analysis (2026): https://link.springer.com/article/10.1007/s10648-026-10225-5

## Ten-minute lesson contract

A lesson should answer one concrete psychological question thoroughly enough for the learner to use the explanation outside the app. That will usually require a real-life scene; a clear mechanism explained before the specialist term; evidence supporting that mechanism; a credible rival explanation; a test that changes the evidence; a practical choice; and a new case to demonstrate transfer.

Target **8–12 purposeful practice checks**. Several should rely on actions other than multiple-choice selection. Each check needs a short, informative explanation. Missed checks return before completion, then relevant concepts return on a later day. A completed lesson should show first-attempt performance separately from corrected responses.

These are editorial targets, not empirical guarantees of comprehension or a rigid minute-by-minute script. A learner should not be penalised for needing longer than the estimate.

## Implementation status

### Committed directly
- Shared end-of-lesson queue for missed questions, including specific dialogue subquestions.
- Separate first-attempt scores and corrected-question outcomes, preserved in progress records.
- Distinct green and red feedback states with accessible text labels and optional sound cues.
- Focused four-option maximum in the public multiple-choice display while always retaining the authored strongest answer.
- Content-based lesson-time estimation and removal of the old fixed five-minute label.
- Support for a learner-facing lesson glossary, including foundational material.
- Staff content-quality panel with live warnings and structural publication blockers for new deep-ten lessons.
- Editable fields for transfer questions and staff research notes.
- A guided twelve-node authoring outline based on the supplied case-study format.
- Rewritten published Narcissism Lesson 01 with eleven practice checks, stronger explanation, new evidence, explicit research references and novel-case transfer.
- Regression tests for the correction queue, sound settings, bundle validation and the flagship lesson.

### Still requires substantive editorial work
1. Rewrite the other published lessons subject by subject. Start with the 120 introductory lessons that currently repeat a common frame.
2. Replace the mass-produced extra distractors with plausible alternatives. The public player now shows fewer at once, but the underlying text still needs editing.
3. Build distinct prerequisite maps for every course rather than expanding all 6,000 planned outlines.
4. Review every research claim and its source. Record publication date, evidence type, relevance and limitations in a structured source panel.
5. Create individual illustrations for high-value cases, with alt text and non-visual equivalents.
6. Carry out browser-based accessibility checks, keyboard testing, visual regression and mobile usability sessions.
7. Test comprehension with people aged sixteen and above, including delayed transfer questions. Measure learning rather than relying solely on engagement or completion.

## Editorial acceptance decision

The new Narcissism Lesson 01 is a stronger demonstration of the intended standard. It passes the structural requirements built into the revised authoring system. That is not equivalent to independent clinical peer review. The rest of the published catalogue remains available and has benefited from the player-wide interaction improvements, but its underlying material has not been rewritten to the new standard.

The next editorial milestone should be a complete, research-checked first unit in one course. Compare learner performance with the old unit and revise the format before applying it to the remaining nineteen courses. Doing that carefully will establish an actual production standard, rather than multiplying a new template whose quality has yet to be tested.
