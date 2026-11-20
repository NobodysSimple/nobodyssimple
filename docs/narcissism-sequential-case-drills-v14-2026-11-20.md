# Narcissism & Personality — sequential-case redesign, version 14
**20 November 2026 | Repository default branch**

## What changed
The previous ten-depth Message Investigation showed the complete message stream immediately and asked learners to type an optional interpretation. In version 14, the lesson first introduces two character profiles and then displays **one message at a time**. The learner controls when to reveal the next message. Analysis cannot open until the whole exchange has been read. When an assessed drill begins, the question comes first; the profiles, transcript and worked analyses remain in expandable review panels.

The free-text interpretation box has been removed from the student interface. The learning remains psychologically demanding through structured responses: case-sensitive multiple choice, selecting labelled evidence, ordering causal steps, comparing competing accounts, predicting plausible outcomes, matching observations to mechanisms, classifying facts against hypotheses, updating after new evidence and selecting a term from a three-item word bank.

The twelve cases have individual profiles describing relationships, known history, usual style and current stakes. The first investigation question in every lesson has been rewritten to rely on something in those profiles or in the timing of the messages. Twelve additional matching or sorting drills apply reasoning to adjacent situations. Another forty-eight distractors in later 'update', 'perspective' and 'predict' screens were made more plausible and more dependent on the evidence. Before those, ninety-six distractors in the investigation questions had already been improved.

The generic repeated introductions were replaced with case-specific prompts. Character continuity was corrected in the Noor/Jules founding-company story. This course has distinct modules on contested self-worth, relationship processes, and developmental/clinical integration.

## Reusable authoring tools
The staff Course Lab includes editable profiles, a ten-depth investigation editor, the five-step relationship-loop editor and an optional tap-to-complete word bank. Newly authored investigation profiles are validated when present; the v14 Narcissism course provides all fields. A word bank must have two to four distinct options, including an accepted answer.

The public player maintains progressive message state and preserves review-panel expansion while learners inspect a psychological depth. The single lesson score counts the investigation's four subquestions and five other assessed activities: nine checks for each of the twelve lessons.

## Additional bug fixed
Previous completion records were counted as completed even after a substantive lesson rewrite. Old records are retained, but the catalogue and due-review schedule now check the lesson version. Updated lessons require a fresh completion to count as current mastery.

## Checks performed
- Published Narcissism bundle and course index both report version **14**.
- Twelve lessons, with ten deepening analyses and two context profiles per investigation.
- Twelve lessons include new matching or sorting tasks.
- All twelve offer a short word-bank selection instead of a free-response terminology field.
- All twelve passed bundle validation and automated editorial structure checks with no warnings or blockers.
- Relevant JavaScript modules passed syntax checks.
- A simulated first-message render showed one message and no analysis; the full render showed all ten messages; quiz-mode rendering placed the question before the collapsed review tools.
- Correct-answer simulations for all nine checks in all twelve lessons saved successfully.
- Existing Manipulation and Attachment bundles remained structurally valid.
- Regression test files have been updated in GitHub for the revised format.

These checks do not claim a successful full browser, screen-reader, responsive-design or Node test-suite run. The repository was accessed through the connected GitHub tools; no full repository checkout or browser acceptance run occurred in this work session.

## Remaining work
1. **Clinical/content accuracy:** independently inspect the source basis of psychodynamic explanations and confirm each question truly has one best-supported option. Credible distractors can introduce answer ambiguity.
2. **Learner trials:** test with people new to psychology and those already experienced, assess perceived difficulty and score new unfamiliar cases several days later.
3. **Actual UI and accessibility testing:** verify small screens, 200% zoom, keyboard navigation, screen readers, evidence-card contrast and focus after each message reveal.
4. **Claim-specific reference ledger:** link particular scientific statements to a study type, relevant result and limitation; existing links are not a full evidence map.
5. **Adaptive difficulty:** progressively reduce hints according to demonstrated competence, rather than only allowing optional explanations.
6. **Additional formats only where they improve transfer:** profiles and conversations are now the backbone; observed behaviour over time, reports from additional people and documentary evidence should also appear in future case designs.

The revised course is now structurally released. It is not yet independently clinically reviewed or empirically validated as a learning intervention.
