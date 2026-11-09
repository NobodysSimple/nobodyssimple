# Hypothesis Generator — evidence, corpus and validation acquisition plan
**Current status:** Dataset research and next-stage design; no clinical training corpus imported or model trained.
**Date:** 9 November 2026.

## Product direction

The initial personal-description textbox has been removed from the visitor-facing Hypothesis Generator. People choose a starting area and Nobody begins asking questions immediately. The identity route asks whether presentation/grooming is relevant before considering that specialist branch. This is the first step toward a no-writing, broadly-to-specifically branching investigation; current yes/no responses alone cannot yet identify every exact personal circumstance. Develop structured tap-to-select follow-ups, with `none of these`, `several` and `not sure`, rather than guessing specificity.

Do not copy the commercial Akinator brand, characters, assets or proprietary implementation. Its general questioning approach is a design inspiration. The user-provided OpenAkinator sample is a GPLv3 source project and is distinct from the commercial game's internal systems.

## Can foundation-model knowledge become a training dataset?

A foundation model can help draft candidate processes, authored questions, answer-choice taxonomies, representative fictional vignettes, challenge questions and tests based on broad training-derived knowledge. It **cannot** export other users' private ChatGPT conversations or recover the original underlying training records, outcomes or empirical distributions. Generated examples cannot establish clinical validity, prevalence or calibrated `P(answer | hypothesis)`. They should be explicitly marked `synthetic` and independently reviewed. Don't make the model the judge of its own case formulations.

## Verified candidate resources (access, licensing, task fit)

### 1) DAIC-WOZ, University of Southern California
URL: https://dcapswoz.ict.usc.edu/
- 189 Wizard-of-Oz virtual-interviewer sessions, 7–33 minutes, including transcripts and assessment labels, designed for distress interview research.
- Access is application-based; USC restricts distribution to academic and other non-profit researchers owing to consent.
- Useful for studying interviewer turn-taking and information acquisition within specified distress domains.
- **Not** a comprehensive corpus of clinician-verified causal case formulations; **not** an immediately deployable commercial training dataset.

### 2) ESConv, Tsinghua / ACL 2021
URL: https://github.com/thu-coai/Emotional-Support-Conversation
Paper: https://aclanthology.org/2021.acl-long.269/
- Repository describes approximately 1,300 annotated help-seeker/supporter conversations across several topics and support strategies.
- Repository expressly states: **data and code are for academic research use only**. Treat as research-only without permission for commercial redistribution/training.
- Good for comparing conversational support strategies and user comprehension; not clinical assessment ground truth.

### 3) AnnoMI, University College Dublin collaborators
URL: https://github.com/uccollab/AnnoMI
- 133 annotated motivational-interviewing demonstrations with utterance-level expert annotations.
- Useful for studying open questions, reflective interviewing and conversational pacing.
- Not a dataset of correct individual psychological formulations. Check the right to use particular source demonstrations and their licensing before importing for the public app.

### 4) Adult Psychiatric Morbidity Survey (APMS), NHS England
URLs:
https://digital.nhs.uk/services/data-access-request-service-dars/dars-products-and-services/data-set-catalogue/adult-psychiatric-morbidity-survey
https://ukdataservice.ac.uk/
- Population-based responses for understanding prevalence and some associations.
- Since April 2024 APMS survey access is handled through UK Data Service, not solely a DARS agreement.
- Useful for population background and evaluating potential biases; **not** a transcript-level formulation dataset.

### 5) NHS Talking Therapies / IAPT datasets; MHSDS
URLs:
https://digital.nhs.uk/services/data-access-request-service-dars/dars-products-and-services/data-set-catalogue/improving-access-to-psychological-therapies-iapt
https://digital.nhs.uk/data-and-information/data-collections-and-data-sets/data-sets/mental-health-services-data-set/access-data
- Structured service, referral, treatment and outcome data; individual record-level access requires governance review and approvals. Public releases are aggregate.
- Not a generally available corpus of detailed therapy transcripts or expert explanatory maps; not a shortcut to personal-clinical reasoning.

## Recommended three-tier evidence strategy

**Tier A — controlled, original knowledge (development):**
- Draft ontology of presenting *experiences*, benign preferences, contextual constraints, mechanisms and protective/resource factors.
- Write unambiguous atomic `concept_id` questions, explicit gating, contrasts, exclusions and answer options.
- Create synthetic fictional scenarios with competing explanations, including "no psychological problem", "external problem", "unknown", "insufficient evidence" and diverse identities/context.
- Clinician and lived-experience reviewers mark factual errors, unhelpful assumptions, alternative explanations and problematic questions.
- These materials train/test the *question graph and fidelity*, but don't establish case-formulation accuracy in patients.

**Tier B — ethically usable real conversation data (dialogue design):**
- Explore legitimately accessible corpora only under their permitted uses.
- Evaluate whether the question sequence covers enough of the narrative, asks the same concept again, or falsely infers specific detail.
- Avoid feeding copyrighted clinical case examples or restricted research interviews into a public commercial application.

**Tier C — prospective research dataset (actual validation and fitting):**
- Recruit consenting adult participants under appropriate research/privacy governance.
- Collect their chosen concern, structured answers, optional interview clarifications, precise reported facts, corrections, candidate hypotheses and actual usefulness.
- Independent clinicians formulate the same cases **blind to the algorithm's output**; collect multiple ratings and record disagreement and uncertainty, not one unchallengeable "true cause".
- Distinguish demographic/group checks for equitable performance, with suitable data controls.
- For any learned conditional probabilities, estimate on a representative development cohort, hold out separate calibration and external test cohorts; disclose uncertainty and avoid causal labels.
- Participation must not silently train the model or create an undisclosed longitudinal clinical profile.

## Minimal training-record schema

```json
{
 "source": "synthetic | consented_research | expert_authored",
 "rights": {"allowed_uses": [], "consent_version": null},
 "case_id": "pseudonymous",
 "starting_area": "identity",
 "observations": [
  {"concept_id":"presentation.action","value":"leg shaving","status":"user_confirmed","source_question":"q123"},
  {"concept_id":"presentation.motivation","value":"sensory comfort","status":"user_confirmed","source_question":"q124"}
 ],
 "asked_questions": [
  {"id":"q123","concept_id":"presentation.action","response":"leg shaving"},
  {"id":"q124","concept_id":"presentation.motivation","response":"sensory comfort"}
 ],
 "model_hypotheses": [{"mechanism_id":"appearance_comfort","supporting_observations":["q123","q124"],"contradictions":[]}],
 "expert_formulations": [{"reviewer_id":"independent_1","supported_hypotheses":[],"unknowns":[],"disagreement_notes":""}],
 "user_corrections": [],
 "safety_review": [],
 "validation_split": "train | calibration | held_out"
}
```

The example values are only an illustration. If a user has only confirmed "grooming", neither "shaving legs" nor "sensory comfort" may be added to the graph.

## Suggested measurable evaluations

- **Exact fact recall / unsupported-claim rate**: proportion of graph claims traceable to a confirmed answer and not contradicted by the user.
- **Question redundancy**: repeated concept IDs, near-paraphrases with the same decision information and off-topic questions.
- **Coverage and burdens**: unasked critical context, avoidable questions, completion rates and perceived intrusiveness.
- **Clinical review**: independent clinician acceptability, coherence, counterevidence handling, appropriate uncertainty, and intercoder disagreement.
- **User control**: success of corrections and no coerced labels for gender/sexual expression or other benign preferences.
- **Safety**: false reassurance, actual external harm, medical causes, sensitive personal information and subgroup effects.
- **Outcome utility**: whether intervention choice and understanding benefit compared with a simpler self-selected menu.
- **Probability calibration** (only if justified): predicted answer distributions versus independently observed distributions. Do not display percent "confidence" on causal hypotheses before validation.

## Prioritised next build

1. Add per-track, tap-to-choose **subtype** questions, including exact objects/actions, environment, emotion and user goal. No intake textbox.
2. Store individual verified facts with question IDs, negation, uncertainty, context and update history.
3. Render plain-language, person-specific graphs from those facts; where unknown, explicitly show "not established".
4. Ask high-information and counterfactual follow-ups, suppress duplicate concepts, allow "other", "multiple", "uncertain".
5. Conduct independent review of synthetic benchmark cases; then apply for appropriate datasets and prospective consented real-case evaluation.

UK legal safeguard: mental health and certain identity/sexual-life data or inferences can be special category personal data under the UK GDPR. Research or service use needs an appropriate Article 6 basis, Article 9 condition where applicable, proportionality, data governance and a clear separation between interaction and optional contribution to research or model improvement. ICO:
https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/guidance-on-ai-and-data-protection/how-do-we-ensure-fairness-in-ai/what-about-fairness-bias-and-discrimination/
