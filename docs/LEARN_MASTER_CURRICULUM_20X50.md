# Nobody's Simple — 20-course master curriculum blueprint
**Date:** 18 November 2026  
**Status:** Editorial outlines for authoring; zero lessons published automatically.  
**Contents:** 20 courses × 10 thematic books × 5 problem-centred modules × 6 planned lessons = **1,000 modules and 6,000 lesson plans**.

## What these files are
Each independently accessible Learn course has its own JSON plan at `learn-content/blueprints/{courseId}.json`. A blueprint contains **specific module problems**, grouped into ten coherent arcs with a distinction to teach, plus six lesson titles and objectives for every module.

The blueprints are **not** evidence-checked teaching scripts, diagnoses, psychological treatment protocols, authored exercise banks or results of a formal systematic literature review. Each planned lesson is stored with `editorialStatus: "not-authored"` and `nodes: []`. This prevents unfinished plans appearing as playable lessons or claiming educational validity before human review.

The six recurring lesson lenses form a deliberately progressive teaching sequence: **case recognition → mechanism → fine-grained distinction → evidence investigation → proportionate strategy → unfamiliar-case transfer**. That makes the learning pathway cumulative instead of merely testing familiar definitions. Authors can replace the recommended exercise format with any of Course Lab's ten interactions (or reading/image pages); a title is not a finished lesson.

## Course coverage
| Stable course ID | Learner-facing subject | Key areas |
|---|---|---|
| `narcissism` | Narcissism & Personality | personality traits, vulnerable/grandiose patterns, clinical limits, power, interpersonal impact |
| `manipulation` | Manipulation & Gaslighting | power, evidence, responsibility, coercion, safety and social systems |
| `attachment` | Attachment & Love | closeness, withdrawal, jealousy, repair, autonomy, relationships and culture |
| `overthinking` | Overthinking & Rumination | worry, checking, uncertainty, metacognition, loops and life constraints |
| `boundaries` | Boundaries & Difficult Conversations | requests, consent, conflict, coercion, institutional power and repair |
| `anxiety` | Anxiety & Avoidance | threat appraisal, avoidance, safety behaviours, panic, exposure limits and inequality |
| `emotions` | Science of Emotions | emotion functions, differentiation, appraisal, anger, shame, regulation and emotional labour |
| `self-esteem` | Self-Esteem & Shame | conditional worth, internal critics, self-compassion, validation and status pressures |
| `motivation` | Motivation & Habits | reinforcement, task aversion, executive friction, environment and productivity culture |
| `social-anxiety` | Social Anxiety | self-focus, safety behaviours, rumination, differential accounts and social threat |
| `burnout` | Stress & Burnout | demands and resources, recovery, labour conditions, workplace change and invisible care |
| `loneliness` | Loneliness & Belonging | connection, rejection, friendship, community access and social infrastructure |
| `social-media` | Social Media & Attention | platform incentives, variable rewards, norms, identity, habit design and regulation |
| `misinformation` | Misinformation & AI | evidence literacy, conspiracy reasoning, statistics, synthetic media and ecosystems |
| `neurodiversity` | ADHD, Autism & Neurodiversity | heterogeneity, sensory and executive needs, accessibility, stigma and assessment |
| `sleep` | Sleep & Insomnia | sleep physiology, conditioned arousal, CBT-I reasoning, health and shift work |
| `low-mood` | Depression & Low Mood | behavioural withdrawal, rumination, activation, treatment and social adversity |
| `scams` | Scams & Deception | authority, urgency, social engineering, fraud response and institutional responsibility |
| `masculinity` | Sexuality & Gender | identity, gender roles, consent, sexual wellbeing, stigma and online narratives |
| `vaping` | Social Influence & Addiction | social norms, reinforcement, nicotine, behavioural addictions, harm reduction and policy |

All twenty retain their existing artwork, tutor/companion, URL, category and title metadata.

## Import and authoring
Open the authenticated `staff.html` → **Course Lab** and select any topic. For a course without an existing local draft or published content, Course Lab automatically loads the matching 50-module curriculum and persists an editable working copy in IndexedDB.

For an existing draft, use **Restore 50-module curriculum** to replace it only with explicit confirmation; export a JSON backup before replacing authored work. This operation does not change GitHub's published course index.

Each of the 50 modules becomes an editable **Course Lab unit** containing six planned lessons. The ten book names appear as chapter headings in the outline, and only the selected module's lesson list is expanded to avoid 300 simultaneous navigation controls. Every planned lesson records an editable objective and a suggested practice type.

Authors write the actual reading pages, visuals, question prompts, answer keys, feedback, counterexamples and citations. After reviewing accuracy, safety, accessibility and references, mark that **individual lesson** as Ready.

**Publish reviewed lessons** publishes only complete, validated, Ready lessons; the remaining outlines stay local, unpublished and editable. Authors can therefore release one carefully reviewed module without needing to finish all 300 lessons. It is not possible to publish an outline-only course by accident. The latest version and public course index are updated atomically through the pre-existing owner-authorised GitHub publisher.

## Quality criteria for the curriculum's next authoring phase
1. **Start from a lived difficulty, not a label.** Show when the concept is useful; avoid simplistic stories where the answer is merely obvious morality.
2. **Teach competing explanations.** Include ambiguous cases and defensible “insufficient evidence” responses. Never infer personality disorders, abuse intentions, gender identity or neurotype from a short vignette.
3. **Build mechanisms.** Distinguish antecedents, appraisals, behaviours, consequences, maintaining loops, and social or structural conditions.
4. **Make interventions conditional.** Address feasibility, safety, effectiveness, limitations and competing risks rather than giving universal scripts.
5. **Include harms and social context.** Power, discrimination, access, poverty, disability accommodations, institutions and inequality are relevant in many courses.
6. **Make transfer real.** Each module should conclude with a new context in which a slightly different strategy or hypothesis is appropriate.
7. **Use retrieval and feedback.** Weave spaced retrieval across modules and avoid reducing progress to completion or question volume.
8. **Keep clinical boundaries.** Medical and diagnostic material needs expert review. Refer to professional assessment where appropriate and include safeguarding/escalation pathways for coercion, acute risk or abuse.
9. **Avoid volume for volume's sake.** The 50 modules are an editorial inventory; remove, merge or offer optional paths when piloting identifies redundancy. No learner should have to complete 300 lessons as a prerequisite to reaching their actual problem.
10. **Review sources before writing.** Author each lesson from current applicable evidence, document any uncertainty and record the dates of source checking.

## Evidence starting points (not blanket verification of each module)
The following public guidance supports the **overall teaching priorities** but cannot independently establish the accuracy of all 6,000 planned lessons:

- NICE CG159 — Social anxiety disorder: <https://www.nice.org.uk/guidance/cg159/chapter/recommendations>
- NICE CG113 — GAD and panic disorder: <https://www.nice.org.uk/guidance/cg113/chapter/recommendations>
- NICE NG222 — Depression in adults: <https://www.nice.org.uk/guidance/ng222/chapter/recommendations>
- NICE NG87 — ADHD: <https://www.nice.org.uk/guidance/ng87/chapter/recommendations>
- NICE CG142 — Autism in adults: <https://www.nice.org.uk/guidance/cg142/chapter/recommendations>
- NICE/Scotland evidence overview — CBT-I for insomnia: <https://matrix.nhs.scot/evidence-summaries/mental-health-difficulties-across-the-lifespan/insomnia/>
- WHO (2025) — Guidance on mental-health policy and social/structural determinants: <https://www.who.int/publications/i/item/9789240106796>
- UNESCO — Media and Information Literacy curriculum: <https://www.unesco.org/mil4teachers/en/curriculum>
- UNESCO (2026) — AI and critical media literacy: <https://www.unesco.org/en/articles/ai-answers-you-decide-unesco-launches-new-media-and-information-literacy-curriculum>
- WHO — Gaming disorder in ICD-11: <https://www.who.int/standards/classifications/frequently-asked-questions/gaming-disorder/>
- Dunlosky et al. (2013) — Retrieval practice and distributed learning: <https://journals.sagepub.com/doi/10.1177/1529100612453266>

Prioritise original clinical guidelines, high-quality reviews, measurement validity and current social research over popular psychology for the eventual lesson content.

## Technical checks
`node --test tests/free/curriculum-blueprints.test.mjs` validates all twenty outline files, their unique IDs and counts, and the isolation of incomplete lessons from public publication.

`tests/browser/course-lab-studio.spec.mjs` exercises blueprint loading, authoring, preview and draft restoration.

Public `learn-content/index.json` stays unchanged and empty until a staff member deliberately publishes a Ready lesson.

## Current publishing constraints
Course Lab currently publishes a single versioned JSON bundle per public course and caps a bundle at approximately **550 KB**. This is suitable for releasing reviewed lessons incrementally, but a completely authored 300-lesson course may eventually need per-module content bundles and lazy loading. The full blueprint is an editorial roadmap, not a claim that all 300 finished lessons can be deployed in one file today.

The outline JSON files are stored as static repository assets. They are not listed or playable in Learn, but are not confidential: people with the source URL can read the plans. Staff's uncommitted authored drafts remain in that browser's IndexedDB unless explicitly exported or published.

## Suggested launch discipline
Start with a short flagship sequence—perhaps **one five-module book** in Overthinking or Social Anxiety—and test comprehension, delayed recall and transfer with unfamiliar examples. Treat the other modules as an available editorial roadmap, not 6,000 obligations for learners.
