# Hypothesis Generator — completion roadmap and Stage 2 implementation

**Status:** Stage 1 already integrated. Stage 2 implemented in the codebase on 9 November 2026; broader scientific/clinical validation remains pending.

## Roadmap

| Stage | Goal | Completion criterion |
| --- | --- | --- |
| 1. Broad-to-specific discovery | Use the synthetic atlas taxonomy to identify one confirmed target, without an intake textbox | 21 categories, 84 clusters, 440 exact experiences available; ambiguous choices not converted to facts |
| **2. Structured case evidence** | Elicit personal timeframe, frequency, impact, situation range, exceptions and explicit goal, in addition to the existing valence, meaning and setting | No-writing interview, typed source-backed observations, unknowns/refusal omitted from facts, exact fact cards visible on graph, comprehensive tests |
| 3. Real adaptive differentiation | Select questions based on missing information, question semantics, contrary cases, actual context and information-gain | Every selected question has an answerable target and avoidable duplicates are demonstrably rare on held-out cases |
| 4. Correctable causal formulation graph | Distinguish direct observations from theory-based mechanisms and testable edges; allow local repairs | Exact, evidence-backed situation map; revise any node and link, with targeted follow-ups |
| 5. Synthetic and expert evaluation | Evaluate factual precision, burden, safety, bias and formulation quality | Held-out synthetic benchmark and independently reviewed cases show acceptable results against a simple baseline |
| 6. Empirical research and calibration | Obtain consented real assessment data and independent clinician judgments | Ethics/data governance, external validation, inter-rater variability and justified uncertainty estimates |
| 7. Release assurance and monitoring | Protect visitors, accessibility and content quality | Safety review, privacy/data protection, performance, regression monitoring, field feedback, version control |

**The feature cannot credibly claim clinical accuracy, specialist-clinician equivalence, proven causal conclusions or calibrated probabilities on the synthetic corpus alone.**

## Stage 2 — concrete implementation

The app already has `ns-hypothesis-subtype-atlas.mjs`, a 545-node compact subset of the synthetic package derived from 21 categories, 84 subcategories and 440 exact experiences. The remainder of the ~35 MB synthetic ZIP is not embedded in the static website, as it's not suitable for user-facing probabilistic training.

The additional module `ns-hypothesis-case-facts.mjs` adds six optional questions **after** explicit confirmation of a specific experience. They use the original database's general question dimensions (T/S/I/X/G) as starting points, but are independently adapted as an accessible, generic pilot across all 440 experiences. Questions ask about:
- timeframe;
- frequency;
- interference (including none);
- breadth of situations;
- whether there are observed exceptions;
- the person's desired goal (including 'do not change it').

Answer options include 'not sure' and 'prefer not to answer'. The optional interview can be opened while asking general questions or from the results, supports backing up a step and can be skipped without blocking support. No textbox, server or background collection is introduced.

Only explicit selection values are represented as `source:'user_selection'` facts. Unknown, refusal and unobserved exceptions are **not** asserted as evidence of a cause. Each fact carries its concept ID, unique question ID, exact scope and an evidence label. Its fields are directly visible in the graph's context, experience and need boxes and in user-selected text export. The goal remains a chosen *goal*, not an inferred unmet need.

### Limitations and priorities

- These six questions are **structured metadata**, not a complete clinical interview, diagnostic assessment or empirically validated measure. They deliberately avoid inferring trauma, attachment or gender identity.
- A statement like 'in many situations' must not be expanded into any particular workplace, relationship or named setting.
- An uncertainty answer must never be displayed as a confirmation.
- The present candidate scoring remains manually authored and uncalibrated. These newly collected facts should **not** be treated as weighted likelihood ratios until justified independently.
- No real patient data is required for this implementation; every one of 440 experiences is tested for coherent question generation.
- Later stages should use dedicated questions for genuinely different domains, rather than assuming one generic template covers all conditions.
- Any selected urgent medical, self-harm or coercion pathway should remain safety-first, not resume generic clinical hypotheses.

**Scientific design rationale:** A Delphi consensus study of clinical psychology formulation stressed collaborative, strengths-based and sociocultural/biological context (Thrower et al., 2024, https://doi.org/10.1111/bjc.12455). A qualitative systematic review stressed pacing, user correction and simple collaborative diagrams (Thrower et al., 2024, https://doi.org/10.1002/cpp.2998). Neither paper validates these new questions or model.

## Files

- `ns-hypothesis-case-facts.mjs` — six non-diagnostic data-gathering dimensions.
- `ns-hypothesis-generator.mjs` — optional no-writing interview and controls.
- `ns-hypothesis-engine.mjs` — state and export.
- `ns-hypothesis-graph.mjs` — graph integration.
- `tests/free/hypothesis-case-facts.test.mjs` — all 440 exact experience routes, unknown/refusal, regression.
- `tests/browser/hypothesis-case-facts.spec.mjs` — actual browser interactions and accessibility.

### Next sprint: Stage 3

Use curated synthetic contrast cases from the ZIP as **test fixtures**, not population samples. Introduce `concept_id`/precondition/gating metadata across the full question pool; compute priority from genuine missing fact slots, explicit competing hypotheses and contraindications, rather than principally from hand-authored signal scores. Add a user-controlled 'not included' outcome and a clinically reviewed question-adequacy rubric. Compare the proposed selector with the present baseline against held-out cases, testing factual precision and redundancy before making the new policy the default.
