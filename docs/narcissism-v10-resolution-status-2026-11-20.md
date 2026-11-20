# Narcissism & Personality — learner-experience repair status
**20 November 2026 · Published course v10**

This document tracks the items from the 19 November human-use audit. Source code and the published course have been updated on the repository default branch. It distinguishes software checks from independent clinical and learner testing.

## Implemented and programmatically checked

- **Contrast and Cropped Reality:** scoped contrast overrides for pale evidence panels and a single reveal-then-answer flow. The unrelated generic course landscape is no longer substituted for case-specific evidence.
- **Deeper course content:** twelve distinct message-led investigations across self-worth, relationship defences, origins, assessment and change. Each has ten explanatory depths with a rival explanation and a suggested test; shorter explanatory passages were expanded in the latest editorial pass.
- **Active inquiry:** the learner can select an individual message, write a private interpretation and then open the model's working analysis. Notes are ephemeral and not graded or saved to the account.
- **Inside the Head:** at the relevant depths, two possible internal accounts can be switched. The interface explicitly labels them as hypothetical interpretations rather than access to somebody's thoughts.
- **Relationship Loop:** twelve authored five-step sequences display a possible trigger, the first response, the recipient's response, how a cycle might persist and how it could be interrupted. The staff console can edit these five steps.
- **Improved answers:** ninety-six incorrect alternatives in the four assessed investigation questions per lesson have been rewritten as competing case-based accounts rather than extreme strawmen. Correct responses are mixed across authored positions and the player shuffles their visual order.
- **Varied practice:** eleven copied ranking exercises were replaced with course-specific predictions, comparisons of two accounts and causal sequencing. The course now has several different nine-node sequences instead of a uniform fifteen-node sequence.
- **Research presentation:** citations were removed from fictional character tasks and retained beside the psychological explanation and research material. The completion panel deduplicates source entries and links DOI or PubMed identifiers. Scientific sources support the concepts, not the fictional characters' putative inner motives.
- **Mastery and records:** investigation subquestions now count individually in score and saved-completion checks. Missed questions are returned at the end, and first-attempt versus corrected performance remains distinct.
- **Quality tooling:** checks cover deep-layer structure, research passages, grossly implausible answer options and source fields, with inappropriate false-positive wording flags reduced.
- **Regression coverage:** tests were added for hidden/revealed analysis, escaped notes, progressive relationship-loop disclosure, alternative inner accounts, course scoring, progress storage and bibliography links.

### Repository checks completed
- 12 / 12 investigations have ten authored depths and valid source-data structure.
- Course version and published index version both equal **10**.
- The published course has **zero structural validation errors**.
- All twelve lessons return **zero structural blockers and zero current automated quality warnings**.
- Relevant modules, including the authoring console and player, pass JavaScript syntax checks.
- A programmatic rendering check confirms that a learner cannot see a hidden depth's analysis before opening it, and that one relationship-loop step is visible before requesting the remaining steps.
- A programmatic score-and-storage simulation confirms that a complete investigation lesson can now save its progress.

**These checks do not establish that all new interactions have been tested in a real browser.** Test files have been committed; a full project-wide Node/browser test run was not completed in this audit.

## Remaining work, in priority order

### 1. Independent editorial and clinical review — open
A clinician or appropriately qualified subject expert should verify the inferential strength of every mechanism, the boundary between theoretical accounts and evidence, the validity of every diagnostic assertion, and the accuracy of sources. The newly realistic wrong answers also require a *single-best-supported-answer* review: plausible alternatives can sometimes be equally defensible if the task does not give enough discriminating evidence.

### 2. Real learner testing, including beginners aged 16+ — open
Recruit participants with varied psychological knowledge. Ask for independent explanations before showing choices, and use a delayed unfamiliar case to measure transfer. Test whether the ten-depth interface helps novices or overwhelms them, and how long complete lessons take. The displayed time is only an editorial estimate.

### 3. Browser visual, accessibility and cross-device acceptance — open
Confirm real computed colour contrast on all panels; navigate the 10-depth investigation and loops using keyboard and screen reader; check focus retention, zoom, mobile scrolling and audio preference behaviour. Earlier screenshots establish that relying on CSS source inspection alone is insufficient.

### 4. Source-level claim mapping — partially complete
DOI/PubMed links and relevant research passages exist. The next layer is an evidence ledger connecting each contested scientific claim with the exact primary source, study type, strength and limits. Do not infer clinical efficacy from a treatment-description paper.

### 5. Phrase-specific annotation and more illustrated causal diagrams — partially complete
Learners can select a full message, rather than dragging to select a specific phrase. The relationship loop is progressive text, not yet a spatial visual map of both minds. Adding phrase annotations and an accessible two-person diagram could improve inspection, provided the diagram is also understandable without sight.

### 6. More varied real-life transfer and adaptive scaffolding — partially complete
The course uses different settings between lessons and a fresh-evidence task within each lesson. It does not yet automatically vary lesson difficulty based on prior mastery or offer an assessed open-ended formulation evaluated against multiple acceptable reasoning routes. A learner can choose to reveal hints, but there is not yet an independently tested beginner/advanced learning path.

## Acceptance standard
Do not describe the course as clinically peer-reviewed, empirically validated, or fully accessibility-tested. Structural checks and committed regressions establish a reliable baseline for testing, not a certificate that every psychological explanation is correct. A future release should retain the interactive core while improving the remaining evidence and user-test gaps.
