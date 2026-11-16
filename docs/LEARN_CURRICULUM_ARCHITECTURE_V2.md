# Nobody's Simple Learn v2 — Curriculum and Platform Architecture
Version: design baseline 2026-11-16. Status: product specification; pilot course implementations tracked separately.

## Product aim
A progressive, intellectually serious school of psychological reasoning, taught through 2–5 minute interactive lessons. Not therapy, diagnosis, professional accreditation, or a trivia collection. Learning progresses: vocabulary → discriminations → causal/mechanistic reasoning → contextual judgement → evidence-based strategy → complex, revisable formulation.

## User journeys
- New visitor: start foundations immediately without an account; choose a skill, not an abstract diagnosis.
- Interested learner: take an open specialist course, with optional prerequisite refreshers, no arbitrary course-wide locks.
- Returning learner: resume lesson or choose a spaced review session with genuinely varied examples.
- Advanced learner: placement checks may skip introductory levels, while advanced questions assess transfer.
- Institution (future, separate mode): teacher-authored/co-designed group lessons and anonymous aggregate reporting, never students' private Field Guides.
- Accessibility: keyboard-first, screen readers, reduced motion, untimed, explicit instructions, alternatives to drag-and-drop, restrained sound, no shame/streak penalties.

## Six schools (core spine; titles are scope proposals, not published courses)
S1 FOUNDATIONS OF PSYCHOLOGICAL THINKING
1 Observation, Interpretation & Evidence
2 Scientific Reasoning and Research Designs
3 Cognitive Bias and Intellectual Humility
4 Probability, Uncertainty and Calibration
5 Attention, Memory and Perception
6 Individual Differences and Context
7 Competing Hypotheses and Alternative Explanations
8 Ethics of Interpreting Other People

S2 THE ARCHITECTURE OF BEHAVIOUR
1 Classical and Operant Learning
2 Reinforcement, Punishment and Avoidance
3 Motivation, Goals and Reward
4 Emotion: Appraisal, Function and Regulation
5 Habits and Behavioural Chains
6 Decision-Making and Cognitive Load
7 Self-Regulation and Executive Function
8 Biological, Developmental and Environmental Constraints

S3 THE SOCIAL MIND
1 Social Identity and Belonging
2 Attribution, Perspective-Taking and Mindreading Limits
3 Attachment: Theory, Evidence and Limits
4 Personality: Traits, States and Pathology
5 Communication, Conflict and Repair
6 Power, Social Norms and Influence
7 Boundaries, Autonomy and Consent
8 Groups, Polarisation and Social Learning

S4 DIFFICULTIES AND MAINTAINING SYSTEMS
1 Threat, Fear and Anxiety
2 Avoidance, Safety Behaviours and Exposure Principles
3 Rumination, Worry and Reassurance
4 Mood, Withdrawal and Reward Loss
5 Shame, Self-Criticism and Perfectionism
6 Trauma, Stress and Context
7 Compulsions, Habits and Differential Explanations
8 Interpersonal Cycles and Unsafe Relationships

S5 CHANGE, INTERVENTION AND STRATEGY
1 Building a Functional Formulation
2 Behavioural Experiments and Hypothesis Tests
3 CBT: Models, Mechanisms and Evidence
4 Acceptance, Psychological Flexibility and Values
5 Habit Design and Implementation Intentions
6 Motivational Interviewing and Ambivalence
7 Context Change, Accessibility and Social Resources
8 Monitoring Change, Harms and Alternatives

S6 ADVANCED FORMULATION AND APPLIED PSYCHOLOGY
1 Developmental and Life-Course Formulation
2 Differential Explanations and Comorbidity
3 Individual, Group and Institutional Systems
4 Interpreting Conflicting Scientific Findings
5 Risk, Ethics, Power and Safeguarding
6 Advanced Interpersonal Case Analysis
7 Designing and Evaluating Interventions
8 Capstone: Integrative, Revisable Formulation

Each core course: 3–6 units; each unit: 3–6 micro-lessons (typically 6–8 items); occasional no-stakes mixed-transfer checks. All numbers are planning ranges, not claims that content is already authored.

## Open specialisms (not separate foundational schools)
- Personality & Relationships: narcissism beyond pop psychology; antagonism; defensive processes; attachment; coercive control.
- Digital & Society: deception, misinformation, vaping and commercial influence, manosphere narratives, polarisation.
- Neuropsychology & Neurodiversity: executive functions, sensory processing, attention, autism/ADHD without armchair diagnosis.
- Mental Health Mechanisms: insomnia, panic, OCD mechanisms, depression, emotion regulation.
- Work & Everyday Life: procrastination, burnout, decision fatigue, leadership, negotiation and work systems.
- Research Literacy: effect sizes, causation, confounding, replication, ethics and meta-analysis.

A specialism includes prerequisite **concepts** (not mandatory completion of unrelated courses); optional short refreshers precede advanced lessons. Topic labels are not evidence of clinical conditions.

## Six canonical exercise types
1 MATCH: explicit terms/examples → definitions; matching alternatives must discriminate adjacent concepts.
2 SORT: short examples → categories (including 'insufficient information' where defensible).
3 CHOOSE: difficult MCQ with plausible distractors, calibrated abstention.
4 COMPLETE: active retrieval of terms or short phrases, synonyms and accepted variants.
5 SEQUENCE: order necessary actions or reasoning steps; allow alternative sequences where warranted.
6 RESPOND: choose a proportionate response given context and safety; distractors represent plausible failure modes.

All six share a schema: immutable stable id, conceptIds, discriminationId, prompt, type, answer data, feedback explaining the distinction, counterexample, evidence refs/review status, difficulty and version. Question IDs must be stable; do not overwrite a question if changing its scoring semantics. Publish v2, retire v1.

## Lesson pedagogy
Short instruction (30–90s read at most) → retrieve → differentiate → apply in changed context → explain wrong choices → optional deeper reading → delayed mixed practice.
The engine never infers another person's diagnosis or motives from a vignette. Questions with ambiguous evidence must allow uncertainty or explicitly specify the assumptions.
Completion ≠ mastery. Progress stores an event when a lesson is completed, plus later review outcomes. Mastery is a separate, evidence-based approximation requiring retrieval over time and transfer to new items.
Spaced recall is adaptive but not punitive. No compulsory time limits, streak losses or gamified urgency for psychologically sensitive material.

## Content governance pipeline
1 Product editor defines teachable capability, prerequisites and target difficulty.
2 Subject expert writes learning objective, source record and **misconception map**.
3 Author prepares >=2 contrasted examples, plausible distractors and feedback per item.
4 Clinical/academic reviewer checks construct validity, clinical boundaries and implications; safety review when applicable.
5 Accessibility/editorial QA (plain English and no reading-load trap).
6 Schema validator and regression tests.
7 Release with content version; collect only necessary aggregate evaluation where consent exists.
8 Scheduled review and retire/replace with versioned migration.
Statuses: draft → reviewed → ready → published → deprecated. UI shows only published as playable.

## Evidence and evaluation
Each concept: definition, operational boundaries, evidence source type (guideline/systematic review/empirical/theory), uncertainty, review date, prereqs, related misconceptions and risk flags.
Do not claim that the app is a clinical intervention merely because its content references clinical studies.
Initial evaluation: usability + error analysis + near/far transfer questions + delayed retention. Later, consenting, suitably powered comparative evaluations for meaningful outcomes.
Avoid encouraging users to diagnose others, over-attribute hostile intent or confront unsafe relationships.

## Technical structure (vanilla ES modules, existing hash router)
- `ns-learn-curriculum-v2.mjs`: metadata, schools, specialist pathways. This stays lightweight.
- `ns-learn-pilot-content.mjs`: authored, versioned lesson/question data (later split to one dynamic-importable bundle per course).
- `ns-learn-engine-v2.mjs`: validate item schemas; grade all six formats; generate review sets independent of DOM.
- `ns-learn-progress-v2.mjs`: append-only lesson completions and review outcomes in existing account learning record (compatible with current account opt-in sync).
- `ns-learn-courses.mjs`: page/course/lesson UI orchestration; selected routes under `#learn`.
- `ns-learn-v2.css`: isolated accessible presentation on existing illustrated brand.

Future scale: content build pipeline generates JSON manifests + per-course files, versioned URLs, tests, cache policy and locale dictionaries. Front-end should dynamically load the selected course; don't bundle every future lesson at home. Separate institution cohorts/consent/privacy infrastructure from personal storage. **Never add thousands of unreviewed questions as padding**.

## Storage and sync decisions
Reuse `ns-account-learning-v2` (which already supports opt-in account sync) with an isolated `ns-psy:` prefix and non-destructive merges. Do not import or rewrite old Journey lesson progress. First-completion records immutable; review outcomes are day-scoped and merge conservatively.
Do not write question text, user free text, diagnoses or sensitive vignette interpretations into progress records. Respect account lock and explicit sign-in sync settings.
For large scale or many years of daily reviews, migrate to per-user, per-concept records and server-supported atomic reconciliation; do not keep growing a single account JSON record indefinitely.

## Initial release acceptance criteria
- All six item types render and work by keyboard/touch (sequence buttons, no mandatory drag/drop).
- One genuinely authored pilot course playable end-to-end; planned catalogue items clearly marked.
- Save completion only after lesson finishes; handle storage error truthfully; never claim saved if not.
- Separate review from initial completion; provide corrective feedback even when answers are right.
- No existing Journey data deleted or rewritten.
- Routes linkable, home returns, mobile responsive and reduced motion supported.
- Unit tests for grading, invalid schemas, progress durability and reviews.
- GitHub PR reviewed, live browser QA and deployment performed before claiming production availability.

## Staged roll-out
A. Curriculum registry + lesson engine + one pilot lesson/course + data durability.
B. 4 full units (16–24 lessons) of Foundations; writer/reviewer workflow and QA.
C. All six formats, mixed recall, review tuning, accessible interaction research, instrumentation with consent.
D. Expand high-demand courses and safe specialist branches; user testing and comparative learning outcomes.
E. Authoring CMS, localization, organization/cohort delivery and per-record scalable backend when uptake warrants it.

## Evidence informing the design
- Dunlosky et al. (2013): effective learning techniques, especially practice testing and distributed practice.
- Roediger & Karpicke (2006): retrieval testing supports retention.
- EEF (2021 onward): actionable feedback requires sound initial instruction and assessment of learning gaps.
These support the learning design principles, **not** claims that Nobody's Simple content is already effective.
