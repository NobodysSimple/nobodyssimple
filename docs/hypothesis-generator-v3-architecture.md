# Hypothesis Generator 3 — detailed formulation architecture and evidence requirements
**Design proposal, not implemented clinical capability.** 9 November 2026.

## Product intent and measurable boundaries

Build an adaptive, person-led psychological **case formulation assistant**. It should recover and accurately organise what a person actually reports, investigate unresolved distinctions, propose multiple testable explanatory mechanisms and allow revision of *any* node and relationship. The goal is not to guess a diagnosis or a latent inner wound. Accurate factual representation, clinical safety, collaborative usefulness, and explicit uncertainty take priority over apparently confident guessing.

A successful session is one in which the user and an independent reviewer can see **which exact observations support each model** and **what would disconfirm it**. More questions do not by themselves increase accuracy. A preferences question (e.g., shaving one's legs) may need no pathology or protective-function hypothesis at all.

## Findings in the current codebase

- `ns-hypothesis-engine.mjs`: The question selector excludes answered **question IDs**, but not all differently worded questions testing the same proposition. A small explicit equivalence guard is now added. No persisted question history exists across visits; restarting necessarily repeats.
- `ns-hypothesis-deep-content.mjs`: 143 additional hand-authored questions distributed over 12 top-level routes; no nested ontology of all subtypes and personal circumstances.
- `startHypothesis` and keyword routing: optional free-text narrative identifies a broad track but is not converted to verified, granular *claims*.
- `ns-hypothesis-graph.mjs`: context/meaning/behaviour boxes primarily use tags and generic descriptions instead of a structured person-specific case record. A partial patch now prints exact Q&A snippets inside nodes, but this is not yet true narrative extraction.
- `expectedDiscrimination`: mathematical information-gain calculation on **hand-authored, uncalibrated signal weights**. It does not learn `P(answer|hypothesis)` from clinical data, produce validated posterior probabilities, assess causal claims, or predict clinical outcomes.
- `reviewHypothesis`: users changing candidate fit influence heuristic sorting; this is useful correction, not ground-truth learning.
- `#hypothesis`: a static client-only experience. It does not have server-side language-model reasoning or trusted longitudinal clinical training data.

## Lessons and limits from the uploaded open-source guessing-game project

The supplied OpenAkinator C sample is **not a disclosure of the commercial Akinator service's proprietary training dataset or implementation**. Its toy data holds **15 persons and 14 questions**. It assigns prior weights using stored popularity, computes answer-conditioned weights using yes/no counts, updates candidates multiplicatively after answers, asks information-reducing questions, guesses above a configured threshold, and learns from user confirmation or correction. No code, text or game data from that GPLv3 project should be imported.

A named fictional character supplies a relatively verifiable correct answer. Psychological mechanisms generally do not. Clinical hypotheses can coexist, vary by situation and change over time, and professional interpretations may disagree. Learning from a user’s 'This fits' is useful feedback, not evidence that a hidden causal hypothesis is true.

## Proposed knowledge model (not just disorders)

Maintain six connected layers:
1. **Presenting concerns and preferences**: what is noticed; what is explicitly desired to change or retain. Allow a 'not a problem, I want to understand it' state.
2. **Fine-grained phenomenology**: triggers, frequency, duration, context, sensation, emotions, intensity, agency, personal meaning, consequences, exceptions and temporal change. Keep identity, gender expression and sexual context separate.
3. **Practical setting**: interpersonal power, real safety, economic pressure, work, family, disability access, health, fatigue, sleep, medication/substances, culture, strengths and social resources.
4. **Behaviour/response**: observable act vs avoidance vs inhibition; antecedents and outcomes; whether selected, imposed, involuntary or habit-based.
5. **Candidate mechanisms**: avoidance learning, uncertainty, threat prediction, perfectionistic standards, executive difficulty, beliefs/interpretations, relational processes, identity tension, physiological capacity and external environmental explanations. Multi-label; allow 'none of these'.
6. **Specific proposed causal/maintaining edges**: IF-THEN or repeated within-person patterns with supporting examples, contrary cases, missing information, alternative explanations, and a confidence **descriptor about evidence completeness**, not a fabricated probability.

An exhaustive list of all psychological problems is neither achievable nor the main foundation. Use a controlled, extendable **ontology of concerns × contexts × processes × observation types** with defined out-of-distribution and 'none fits' paths. Review coverage for neurodivergence, disability, cultures, age ranges and structural stressors.

## Session event schema

Store these in page memory only during pilot; future persistence would require separate consent, governance and protection:

```json
{
  "case_id": "ephemeral",
  "presenting": { "quote": "I like shaving my legs; I wonder what that means about me as a man", "goal": "understand meaning" },
  "observations": [
    {
      "claim_id": "c001",
      "predicate": "grooming.preference",
      "object": "shaving legs",
      "polarity": "positive",
      "timeframe": "unknown",
      "source": "person_verbatim",
      "evidence_span": "I like shaving my legs",
      "status": "person_reported",
      "confirmed": true
    }
  ],
  "missing_slots": ["reason_for_preference", "emotion_about_preference", "context", "social_consequences"],
  "hypotheses": [
    { "id": "social_gender_norms", "status": "untested", "for": [], "against": [], "would_change_mind": [] }
  ],
  "graph_edits": [],
  "question_events": [
    { "question_id": "id-grooming-motivation", "concept_id": "grooming.motivation", "answer": "unknown", "source": "none" }
  ]
}
```

Critical invariants:
- Never convert a question into a more specific answer than the response supplies. “Yes” to “Is it comfort, texture *or* aesthetics?” **does not** establish which one.
- Preserve negations, qualifiers, missingness and each original answer for audit. A quoted reported observation, machine extraction, user correction and provisional model must have distinct types.
- Every user-visible personalised node must link to one or more supporting direct observations or explicitly display **not established**.
- Never infer gender identity, orientation, trauma or pathology from cosmetic grooming.
- A person's correction immediately updates the graph, dependent interpretations, candidate ordering and relevant unanswered question pool.
- Repeated questions with different IDs but equivalent semantics must be grouped by `concept_id`, while **legitimately contrastive questions** remain.

## Adaptive dialogue policy

Use an explicit **state machine** plus optional language understanding:

**A. Intent and scope** — What exactly do you want to understand? Is the behaviour itself unwanted, or only its social consequences?

**B. General triage and alternatives** — Is there immediate safety, medical, structural, relationship or capacity context? Do not channel everyone into pathology.

**C. Subtype clarification** — Use 2–5 mutually distinguishable options plus “something else” and “I’m unsure”; after an answer confirm any ambiguity. For grooming, ask *which* action and whether its primary appeal is sensory, aesthetic, gendered, erotic, practical or several, without assuming any category applies.

**D. Concrete episode** — When did this last occur? Where, with whom, what was thought/felt, what happened next? Ask only for information relevant to the user's goal.

**E. Differential questions** — Choose questions by expected information value: candidate differentiation, missing critical slot, safety, potential disconfirmation, user-requested revision, burden, and previously answered concepts. A static question graph can serve as a controlled fallback if a language model is unavailable.

**F. Conditional follow-ups** — “You said you felt bad: was that embarrassment, fear of being judged, a physical discomfort, or something else?” Keep the actual response, not the choice text, as the fact.

**G. Provisional map** — Distinguish facts → subjective meanings → behaviours → proposed links. An individual graph edge requires both observed ends and a clear hypothesis tag. Show source context directly on nodes.

**H. Correction loop** — Each node AND edge allows wrong / incomplete / true only in some contexts / useful / unsure. Select a challenged element → identify missing or disputed claims → ask a high-value targeted question → rebuild the affected subgraph. Never force a definitive conclusion.

**I. Optional stopping** — Stop when the person chooses, no relevant unanswered questions remain, anticipated information gain is too low relative to user burden, or enough information exists for the chosen task. Do **not** equate a lengthy interview with clinical certainty.

## Data assets needed

1. **Ontology/editorial catalogue:** problems, neutral experiences, processes, personal-context variables, triggers, responses, outcomes, strengths, disconfirming evidence. Synonyms and exclusions; expert-reviewed, versioned.
2. **Question bank with semantic metadata:** `question_id`, `concept_id`, `topic`, `preconditions`, `target_fact_slots`, `answer_type`, `possible_values`, `expected_discriminations`, `contradiction_checks`, `contraindications`, `reading_age`.
3. **Clinical framework evidence:** CBT functional analysis, 5Ps, ACT, behavioural analysis, contextual/systemic perspectives, capacity/health and Power Threat Meaning. Distinguish empirically supported claims from conceptual examples.
4. **Expert-authored vignettes:** richly contextual, including benign/nonpathological cases and social, physical, financial, relational and neurodivergent explanations. More than one plausible formulation per case.
5. **Consented and appropriately governed human assessment data:** real question-answer trajectories and deidentified expert case conceptualisations, with item-level provenance, uncertainty, disagreement and clinician review. Synthetic cases help unit tests, not establish real-world accuracy.
6. **Conditional-answer estimates:** only after representative data and external verification; estimates of `P(answer | context, hypothesis)` and their uncertainty, not invented fixed clinical likelihoods.
7. **Correction dataset:** user-reported specificity/accuracy feedback and separately moderated clinician-coded errors, with no automatic acceptance as causal ground truth.
8. **Independent evaluation cohorts:** unseen settings, demographics, cultures, disability/neurotype, risk levels, and the especially important "something not in the ontology" cases.
9. **Safety and privacy artefacts:** DPIA, lawful basis plus UK GDPR Article 9 condition when applicable, privacy/purpose consent, safeguarding pathways, protection against unapproved model retraining, security and deletion mechanisms, human oversight.
10. **Outcome measurement:** accurate reproduction of reported facts; unsupported assertion/hallucination rate; clinically meaningful omissions; differential discriminating power; duplicate/irrelevant question rate; correction success; burden and dropout; calibration if ever producing percentages; clinician-rated utility; user-rated fit; test–retest context stability; between-group performance differences; impact on decisions.

## Distinct delivery stages

**Stage 0 — Trustworthy current tool:** verify current browser CI, eliminate known semantically equivalent question repeats, make Q/A provenance visible on each node. Do not call this specialist-level formulation.

**Stage 1 — Case-specific observations:** fact-slot schema, user-confirmed extraction from typed responses, explicit negation/unknown, no unsupported inferred details. Change the graph renderer to consume structured factual claims rather than tags.

**Stage 2 — Branching differential interview:** structured category tree, conditional prompts, mixed multiple-choice + short conversational clarifications. One unresolved fact per question. Coverage and question-duplication audits for each route.

**Stage 3 — Correctable hypothesis graph:** multi-candidate process graph, editable edges and nodes, dependency tracking, node-focused question plans and counterfactual testing.

**Stage 4 — Consent-governed empirical learning:** collect ethically sourced, diverse and well-annotated assessment trajectories; estimate conditional answer distributions where defensible; model calibration; external/clinical evaluation and safety red-teaming. No unsupervised crowd updates.

**Stage 5 — Prospective evaluation:** measure clinician agreement, user comprehension and safety, between-group differential performance, real-world benefit compared with a simpler self-directed menu, and maintenance monitoring.

A static GitHub Pages client can implement stages 0–3 using authored structured questions without ever sending personal responses to a server. Model-assisted free-text comprehension or population-level learning would change architecture, cost, governance and privacy, and should be separated from those features.

## Scientific and regulatory context

Thrower et al. (2024), *British Journal of Clinical Psychology*, found 30 consensus items emphasising client-led formulation, strengths, meaning, and sociocultural/biological context: https://doi.org/10.1111/bjc.12455

Thrower et al. (2024), *Clinical Psychology & Psychotherapy*, qualitative systematic review highlights collaboration, pacing and client correction: https://doi.org/10.1002/cpp.2998

NICE digital evidence standards: https://www.nice.org.uk/corporate/ecd7/chapter/how-to-meet-the-standards

ICO current guidance on special category data: https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/a-guide-to-lawful-basis/special-category-data/

NHS digital clinical safety assurance / DCB0129: https://www.england.nhs.uk/long-read/digital-clinical-safety-assurance/

The more the tool is marketed as performing individual clinical decision support or treatment recommendations, the more substantial validation and regulatory consideration may become necessary. Evaluate intended use before making claims.
