# Hypothesis Generator — release and scientific status

**Release date:** 9 November 2026

## Purpose

Hypothesis Generator is a new original, mascot-led Nobody's Simple route at #hypothesis. The homepage links to it directly below Nobody's Simple Lifestyle. Users choose a presenting difficulty, answer brief adaptive yes/no/maybe questions, inspect three competing psychological hypotheses, review supporting and conflicting observations, and proceed to the existing "What can help?" intervention picker.

It is a provisional, collaborative **formulation discovery** tool—not a symptom classifier, a diagnostic engine, a trauma detector or a clinical risk predictor.

## Current coverage

The homepage intake now has **no personal-description textbox**. Users select a broad area, then Nobody asks the first question. For the identity pathway, it starts by asking whether presentation/grooming is relevant; that choice gates specialised follow-ups. This removes the initial writing requirement but does not, by itself, give the engine specific knowledge of a user's grooming practice or life history: further authored branching questions and structured fact capture are still required. The optional atlas search is only for selecting an existing educational topic, not submitting a case narrative.

The pilot provides 12 individually designated starting areas: procrastination, overthinking, relationships, social concerns, fatigue, emotions, sleep, checking, decisions, identity, sensory load and loss. The original engine's 21 processes and 40 questions have been expanded with **37 additional process models and 143 individually authored deeper questions**: 58 candidate processes and 183 questions in the combined editorial bank (with only context-relevant questions available in any given journey). There is **no fixed nine-question cap**. Nobody continues selecting useful questions until the user requests a working formulation or the relevant authored bank is exhausted. Users may skip, go back, revisit answers, and initiate focused further questioning about any node in the result. A workflow checkpoint suggests when a provisional map is worth considering; it is not a calibrated confidence threshold.

The existing 166-topic psychological atlas supports searching and contextual reading. Its many topics do NOT imply 166 fully reviewed differential-formulation engines. Unsupported named concerns take the user to the relevant field guide, not to an unrelated psychological guess.

Each process has a possible function, maintaining cost, potential need, question that could challenge the hypothesis and an intervention link. No result infers an unknown childhood event, attachment wound or clinical diagnosis from a short question sequence.

## Intellectual property

The uploaded OpenAkinator-master.zip is a GPLv3-licensed C project. Only the broad interaction pattern described in its README was consulted: short multiple-choice questions, attention to distinguishing candidates, and feedback on mistakes. All code, content, UI and gameplay for Hypothesis Generator were written independently. No source code, character list, wording, algorithms as expressed in that source, user-interface assets, or branding from OpenAkinator were adapted, imported or redistributed.

## Inference and transparency

The engine in ns-hypothesis-engine.mjs uses hand-authored, bounded relative compatibility weights. Those values are **uncalibrated** and must never be shown as clinical probabilities, diagnostic certainty or risk categories. The output always describes explanations as hypotheses. Contradictory responses remain available; users can rate fit and reject a suggestion, which changes prioritisation without deleting what the user actually answered.

Questions are selected through an **expected-information-gain heuristic** based on editorial yes/no compatibility assumptions and consideration of missing formulation dimensions. This is Bayesian-style question discrimination mathematically, **not a validated posterior probability for someone's psychological causes**; there are no defensible clinical percentages to display.

The result is now a **clickable, editable evidence-linked graph** separating (a) the selected starting concern, (b) circumstances and constraints, (c) feelings and meaning, (d) reported responses, (e) multiple candidate processes, (f) possible immediate effects, (g) potential maintaining costs, (h) needs and resources, and (i) an optional *reported* internal tension. Each node distinguishes directly reported observations from speculative interpretations. Users can mark a node as fitting, uncertain or inaccurate; rewrite the wording; and ask the tool to prioritise questions about that particular part. An answer-history editor allows revisions, re-evaluates the graph and removes specialised follow-up answers if their gateway is rejected.

**Specific case-design safeguard:** Grooming, shaving legs, wearing particular clothes and other expressions are not symptoms or proof of gender identity or sexual orientation. The identity/presentation branch asks separately about genuine enjoyment, sensory or aesthetic preference, social expectations, identity exploration, sexual context, personal privacy and desired autonomy. The tool must not conclude that one behaviour reveals a hidden wound or identity. A person may not need to change the behaviour at all.

The formulation remains template-based and grounded in answers. There is no remote generative AI model, semantic reasoning about arbitrary free text or automatic clinical-note transmission. More questions and graph interaction improve the amount and structure of elicited information, but do not establish validation or causal accuracy.

## Safety

The tool checks for selected acute concerns and routes potential self-harm, coercion, immediate danger, certain unusual experiences or concerning physical symptoms towards appropriate real-world help rather than ordinary self-help formulation. It reuses the app's safety-screening rules, with the ability to correct a misunderstood response. UK NHS 111, emergency services and confidential domestic-abuse links are included where appropriate.

NICE NG225 guidance explicitly prohibits using suicide-risk scales to predict suicide or decide who receives treatment. Hypothesis Generator does not issue such scores. Reference: https://www.nice.org.uk/guidance/ng225/chapter/recommendations

## Privacy and accessibility

Answers, optional context and user corrections are held in page memory only, with no cross-session account profile. Leaving or reloading clears the draft. Exporting an explanatory text report requires a user click. No new localStorage, sessionStorage or account-sync calls occur in this feature.

The interface uses existing Nobody character artwork, clearly labelled five-way answer buttons, visible progress, a keyboard-operable history/skip system, evidence disclosures, flexible layouts, and reduced-motion preferences. Browser checks include desktop/mobile viewport constraints and automated WCAG tests.

## Engineering files

- ns-hypothesis-engine.mjs — original knowledge bank, upgraded question selection, history revision and safety rules.
- ns-hypothesis-deep-content.mjs — 37 expanded candidate processes, 143 additional questions, and conditional presentation-specific exploration.
- ns-hypothesis-graph.mjs — transparent graph construction, user-supplied wording, corrections and layer-level re-investigation.
- ns-hypothesis-depth.css — editable formulation graph, evidence panels and responsive deep-question presentation.
- ns-hypothesis-generator.mjs — character-led question and results UI, feedback, export and routing.
- ns-hypothesis-generator.css — responsive visual design and homepage CTA.
- strategy.mjs, site.mjs, index.html, sw.js — homepage, routing and cached assets.
- tests/free/hypothesis-generator.test.mjs and tests/browser/hypothesis-generator.spec.mjs — initial core behaviour and regression coverage.
- tests/free/hypothesis-depth.test.mjs and tests/browser/hypothesis-depth.spec.mjs — longer investigations, presentation-specific differentiation, graph correction, answer editing and mobile accessibility.

## Scientific status and next evaluation phase

This is an **evidence-informed educational prototype**, not an independently validated clinical instrument. It requires clinician/lived-experience review and testing for user comprehension, bias, culturally appropriate language, false reassurance, cause attribution, disability and health accessibility, and whether resulting intervention choices actually improve real-world outcomes. The weights should not be adjusted by unmoderated user submissions without independent validation.
