# Hypothesis Generator — completion roadmap and Stage 2 implementation

**Status:** Stage 1 already integrated. Stage 2 implemented in the codebase on 9 November 2026; broader scientific/clinical validation remains pending.

## Roadmap

| Stage | Goal | Completion criterion |
| --- | --- | --- |
| 1. Broad-to-specific discovery | Use the synthetic atlas taxonomy to identify one confirmed target, without an intake textbox | 21 categories, 84 clusters, 440 exact experiences available; ambiguous choices not converted to facts |
| **2. Structured case evidence** | Elicit personal timeframe, frequency, impact, situation range, exceptions and explicit goal, in addition to the existing valence, meaning and setting | No-writing interview, typed source-backed observations, unknowns/refusal omitted from facts, exact fact cards visible on graph, comprehensive tests |
| 3. Functional inquiry and adaptive differentiation | First functional-investigation module now implements a structured, partly conditional inquiry. Further domain-specific differentiation, missing-information prioritisation and empirical calibration remain outstanding | Person-confirmed event–emotion–meaning–response–consequence sequences, sleep, coping, material context, exceptions, counterfactuals and alternatives; stronger selector benchmarks still needed |
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

### Stage 3 implementation (first vertical slice)

The new `ns-hypothesis-investigation.mjs` adds **19 individually authored, no-writing investigation questions**. Starting from an existing console topic, the visitor can choose "Investigate what might be keeping this going". This complements (not replaces) the 440-node subtype drill and six factual case questions.

The investigation probes: who is involved; observed interactions separately from labels used about other people; the event just before an emotion; the specific emotion; meaning or threat; actual next behaviour; main emotion-regulation strategy; immediate change; longer-term effect; sleep and capacity; material constraints; exceptions; counterfactual consequences; chosen values and tradeoffs; alternative explanations; and optional safe ways of testing them. Some questions are conditional, for example asking about paternal behaviour only after the person chooses "my dad".

**Evidence in the graph:** An explicitly selected phrase such as "I describe my dad as narcissistic" is displayed as the person's *own interpretation*. It does **not** classify the father as having narcissistic personality disorder. The separate "what behaviour did you observe?" answer appears as a reported observation. Other tiles now use verbatim option labels for emotion, meaning, response, coping, immediate relief or worsening, later effect, sleep and values, where answered.

**Proposed links:** The graph only draws an event → emotion → meaning → response → consequence link when both endpoints were explicitly selected. It labels links as hypotheses, includes each endpoint's original option wording and asks what would challenge the link. The visitor can mark the link "worth testing", "uncertain" or "wrong"; this review is recorded locally without changing the underlying observations or claiming a causal discovery.

**Safety:** A response indicating intimidation by the father ends the investigative branch with safety-first information; the answer can be corrected. Unknown, "other" and refusal answers do not become specific case facts. The investigation does not submit, store, share or learn from private answers.

**Not yet delivered:** An expert clinician's open-ended interviewing capabilities, person-specific language understanding, empirically fitted conditional likelihoods, validated inference of latent factors, safe and independently validated treatment recommendations, and the complete domain-specific branching question web. The 19 questions are a **first functional-analysis layer**, not full completion of the entire Stage 3 or a clinical diagnostic engine. Broad score-based candidate ranking remains heuristic and uncalibrated. The next work should expand genuinely differential/conditional questions and test whether new questions predict distinct answers or reveal new facts, rather than rewarding simply longer interviews.

### Multi-observation differential layer

`ns-hypothesis-differentials.mjs` adds **12 original, transparent differential hypotheses** that require combinations of user-selected facts before appearing in the graph. Examples include short-term relief with recurring concerns, reassurance/rechecking loops, loss of autonomy, contextual social safety, sleep/capacity limitations and **effective** responses that should not be labelled maladaptive. Every generated pattern contains its exact supporting answers, an alternative explanation and a counterexample or question that could disconfirm it. These are editorial rules, not trained probabilities or validated clinical causal models.

When somebody has completed only the functional investigation and no informative original questionnaire answers, the results now **abstain from ranking generic mechanisms without evidence**. On the graph, speculative links show both original response options and can be marked *worth testing*, *uncertain* or *wrong*; criticism of a proposed link never rewrites what the person actually reported.

The example "I describe my dad as narcissistic" is explicitly stored as a **person's interpretation**. A separate question asks whether specific behaviour such as dismissal, intimidation or broken commitments occurred. Intimidation diverts to safety support before psychological interpretation. No personality disorder is diagnosed in a third party.

`tests/free/hypothesis-differentials.test.mjs`, `tests/free/hypothesis-investigation.test.mjs` and `tests/browser/hypothesis-investigation.spec.mjs` cover contrasting mechanisms, real-world conditions, unknown answers, safety and challenge controls.

### Remaining Stage 3 work

Use curated synthetic contrast cases from the ZIP as **test fixtures**, not population samples. Introduce `concept_id`/precondition/gating metadata across the full question pool; compute priority from genuine missing fact slots, explicit competing hypotheses and contraindications, rather than principally from hand-authored signal scores. Add a user-controlled 'not included' outcome and a clinically reviewed question-adequacy rubric. Compare the proposed selector with the present baseline against held-out cases, testing factual precision and redundancy before making the new policy the default.


## Stage 4 prototype — adaptive causal investigation and verbatim case map (9 November 2026)

**Development status: proposed on feature branch, pending CI and review.** This is a substantial prototype of Stage 4, not completion of a validated formulation engine.

### What changes

- Visitors may optionally describe their concern in **their own exact words** (up to 280 characters). That description takes priority as the graph's presenting concern. Each functional and adaptive question also offers optional verbatim wording alongside a structured response. User text is shown as *self-report*, never silently rewritten as an objective conclusion, diagnosis, motive, or finding about a third party.
- The new adaptive module indexes **all 72 provisional mechanism IDs/names** from the uploaded synthetic database's mechanisms.jsonl, explicitly labelled editorial and unvalidated. It contributes **15 new authored differential questions**, with explicit prerequisites, concept identifiers, missing-information priorities, and an **eight-question maximum per pass**. Relevant questions ask whether another person's behaviour persists independently of the visitor's response, what occurs when circumstances change, sleep and demand contrasts, the purpose and automaticity of coping, repeated temporal sequences, real evidence versus feared prediction, value conflict versus externally constrained choice, and safe next observations.
- Differential rules require combinations of person-selected evidence, output a competing explanation and preserve source evidence. They do **not** infer trauma, attachment history, diagnoses, or numerical causal probabilities. "Not observed", "unsure", "prefer not" and refusal options do not become factual findings.
- The graph now places verbatim answers in relevant tiles and links *reported* conditions to *reported* contrasts with challengeable **hypothesised arrows**. Users can reject an arrow without erasing the original reports.
- A selection suggesting that trying a different response to another person would be unsafe diverts to safety-first support, with a back action for corrections.
- The deeper interview is voluntary; the shorter 19-question functional interview retains its stopping point. A prominent "Test competing explanations in depth" button appears when functional evidence has been entered.

### Dataset integration — exact scope

The uploaded ZIP comprises **12,716 question records, 26,377 synthetic cases, 72 editorial mechanisms and 545 navigation nodes**. The current website already incorporates its compact 545-node navigation subset (21 categories, 84 clusters and 440 exact experiences). This change incorporates **the complete 72-entry mechanism name/ID index and a deliberately selected subset of 15 differential questions**. It **does not** ship the full ZIP, embed 26,377 cases in browsers, expose all 12,716 unreviewed generated questions to visitors, fit the synthetic cases as patient evidence, or claim all 72 mechanisms have been tested for a particular person.

Source assets remain development/evaluation inputs; the index is for transparency and future expert review, not an automated clinical knowledge base. **Full database ingestion, source-linked question selection, benchmarking against held-out synthetic contrasts, and independent professional review remain further work.**

### Quality criteria for advancing

1. Verify exact-quotation fidelity and XSS-safe rendering; do not use a generic label where user-provided text exists.
2. Verify branching prerequisites, deduplication by concept ID, stopping within eight new questions, and no looping after back/skip.
3. Audit contrasting cases: external harm vs coping maintenance, restorative sleep vs persistent difficulty, effective coping vs short-lived relief, chosen preference vs unwanted symptom, and real risk vs overinterpretation.
4. Test that answering "unsure", "prefer not" or "none" does not establish mechanisms; risk branches interrupt speculation.
5. Compare with genuinely independent clinician and lived-experience review. Do not present the prototype as a clinical assessment or scientifically calibrated differential diagnosis.
