# Hypothesis Generator — release and scientific status

**Release date:** 9 November 2026

## Purpose

Hypothesis Generator is a new original, mascot-led Nobody's Simple route at #hypothesis. The homepage links to it directly below Nobody's Simple Lifestyle. Users choose a presenting difficulty, answer brief adaptive yes/no/maybe questions, inspect three competing psychological hypotheses, review supporting and conflicting observations, and proceed to the existing "What can help?" intervention picker.

It is a provisional, collaborative **formulation discovery** tool—not a symptom classifier, a diagnostic engine, a trauma detector or a clinical risk predictor.

## Current coverage

The pilot provides 12 individually designated starting areas: procrastination, overthinking, relationships, social concerns, fatigue, emotions, sleep, checking, decisions, identity, sensory load and loss. These use 21 distinct psychological, biological, social and environmental processes and 40 original, authored discriminating questions. Questions are selected by the difference between the processes they could help distinguish, rather than asked in a fixed order. Up to nine questions can be answered per visit; results are accessible early, and users can skip or go back.

The existing 166-topic psychological atlas supports searching and contextual reading. Its many topics do NOT imply 166 fully reviewed differential-formulation engines. Unsupported named concerns take the user to the relevant field guide, not to an unrelated psychological guess.

Each process has a possible function, maintaining cost, potential need, question that could challenge the hypothesis and an intervention link. No result infers an unknown childhood event, attachment wound or clinical diagnosis from a short question sequence.

## Intellectual property

The uploaded OpenAkinator-master.zip is a GPLv3-licensed C project. Only the broad interaction pattern described in its README was consulted: short multiple-choice questions, attention to distinguishing candidates, and feedback on mistakes. All code, content, UI and gameplay for Hypothesis Generator were written independently. No source code, character list, wording, algorithms as expressed in that source, user-interface assets, or branding from OpenAkinator were adapted, imported or redistributed.

## Inference and transparency

The engine in ns-hypothesis-engine.mjs uses hand-authored, bounded relative compatibility weights. Those values are **uncalibrated** and must never be shown as clinical probabilities, diagnostic certainty or risk categories. The output always describes explanations as hypotheses. Contradictory responses remain available; users can rate fit and reject a suggestion, which changes prioritisation without deleting what the user actually answered.

The formulation is generated using controlled text templates and recorded answers. There is no remote generative AI model or automatic case-note transmission.

## Safety

The tool checks for selected acute concerns and routes potential self-harm, coercion, immediate danger, certain unusual experiences or concerning physical symptoms towards appropriate real-world help rather than ordinary self-help formulation. It reuses the app's safety-screening rules, with the ability to correct a misunderstood response. UK NHS 111, emergency services and confidential domestic-abuse links are included where appropriate.

NICE NG225 guidance explicitly prohibits using suicide-risk scales to predict suicide or decide who receives treatment. Hypothesis Generator does not issue such scores. Reference: https://www.nice.org.uk/guidance/ng225/chapter/recommendations

## Privacy and accessibility

Answers, optional context and user corrections are held in page memory only, with no cross-session account profile. Leaving or reloading clears the draft. Exporting an explanatory text report requires a user click. No new localStorage, sessionStorage or account-sync calls occur in this feature.

The interface uses existing Nobody character artwork, clearly labelled five-way answer buttons, visible progress, a keyboard-operable history/skip system, evidence disclosures, flexible layouts, and reduced-motion preferences. Browser checks include desktop/mobile viewport constraints and automated WCAG tests.

## Engineering files

- ns-hypothesis-engine.mjs — knowledge bank, question selection, evidence and safety rules.
- ns-hypothesis-generator.mjs — character-led question and results UI, feedback, export and routing.
- ns-hypothesis-generator.css — responsive visual design and homepage CTA.
- strategy.mjs, site.mjs, index.html, sw.js — homepage, routing and cached assets.
- tests/free/hypothesis-generator.test.mjs and tests/browser/hypothesis-generator.spec.mjs — content, behaviour, safety and accessibility coverage.

## Scientific status and next evaluation phase

This is an **evidence-informed educational prototype**, not an independently validated clinical instrument. It requires clinician/lived-experience review and testing for user comprehension, bias, culturally appropriate language, false reassurance, cause attribution, disability and health accessibility, and whether resulting intervention choices actually improve real-world outcomes. The weights should not be adjusted by unmoderated user submissions without independent validation.
