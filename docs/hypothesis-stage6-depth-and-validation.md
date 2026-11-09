# Stage 6 — Domain-complete differential inquiry, formulation-depth evidence and empirical validation readiness

**Status:** implemented domain-specific investigation prototype; **NOT clinically validated**. Date: 9 November 2026.

## What Stage 6 means

The original Stage 6 roadmap requires **consented empirical validation** with appropriately governed real-world assessments and independent professionals. Such research **cannot** be implemented merely by generating more questions or passing synthetic tests. We have not collected patient data, obtained ethics approval, recruited clinicians or participants, measured clinician agreement, determined external validity, or calibrated numerical causal probabilities.

The code in this branch addresses the user's urgent design blocker **in preparation for that study**: more granular, differential questioning and an evidence-first readable formulation.

## Coverage

- The discovery atlas remains **21 categories, 84 clusters and 440 experience labels**. These labels are an editorial taxonomy, not a complete catalogue of human distress, diagnostic categories or all possible mechanisms.
- The **20 non-SAFETY categories** now each have a bespoke bank of **four primary contextual lenses and four additional-factor lenses** (160 domain-labelled differential options), applied in a **10-step reversible, optional investigative sequence**. Every confirmed non-urgent leaf is eligible; question prompts explicitly use the exact selected experience and retain up to 280 characters of the visitor's own wording per answer.
- The **SAFETY** category, specific coercion/violence concerns, dangerous physical symptoms, certain substance-withdrawal concerns, and other identified urgent routes continue to divert into a safety-oriented response. A safety gate is not a gap to force through a psychological formulation.
- A person may have a meaningful preference, structural problem, disability/access need, physical-health problem, family issue or practical constraint **without any maladaptive internal mechanism**. The interview explicitly permits that outcome.
- A broad category being covered does **not** mean every possible subtype-specific causal hypothesis has been written, empirically checked or professionally reviewed. The new bank provides a usable mechanism-testing starting point, not exhaustiveness.

## Why this is not merely a sorter

The system cannot conclude "X causes Y" because a label or preference was selected. Its more explanatory branch asks for:

1. A person-selected *candidate condition* associated with their specific experience.
2. A *contrast* — what happens when the condition is less present (including unchanged, mixed, unobserved, unsafe to test).
3. A separate additional factor, capturing possible **multiple interacting influences**.
4. A self-reported response (not an inferred coping style).
5. The immediate effect of that response.
6. The longer-term course of the **original** difficulty.
7. Whether the sequence is repeated across occasions, before suggesting a continuing feedback cycle.
8. A potential counterexample that could weaken the first explanation.
9. Developmental/chronological context without inventing trauma.
10. The person's desired outcome, including **no change** or **understanding only**.

An explanatory tile needs at least **two directly reported selections** with known question IDs; an ongoing relief cycle requires four (response + immediate consequence + later consequence + repeated sequence). The result must include an explicit *alternative* and *what would challenge it*. The method is an authored educational reasoning scaffold, not an expert interview, causal model, clinically calibrated classifier, diagnostic instrument or evidence that a hidden cause has been discovered.

The person can add their own words, see them in the graph and explanation panel, review proposed links and mark them wrong, stop early, or preserve uncertainty. A factual description of another person's behaviour is kept distinct from the person's interpretation of motives or diagnosis.

## Empirical validation protocol — research-ready, not a completed study

**Before any recruitment or collection:**

- Define intended use and safety boundaries, enrolment/exclusion criteria and whether this is a research study or a regulated medical-device use case; seek university/independent ethics review, safeguarding oversight and UK GDPR lawful basis and DPIA advice as appropriate.
- Require separate participant-facing information and genuinely voluntary specific consent for **assessment**, **storage**, **research reuse** and **optional re-contact**. The current site deliberately stores answers in page memory only; do not silently add a telemetry endpoint or re-identifying analytics.
- Build a secure study-only backend with access controls, deletion/withdrawal process, retention schedule, incident pathway, limited administrator access and independently reviewed deployment/security. Keep any public clinical report generation decoupled from research collection.
- Recruit independent clinical psychologists from varied specialties, plus lived-experience reviewers across relevant groups and contexts. Reviewers must first formulate the vignette independently *before* reading any algorithm output, to prevent anchoring.
- Pre-register testable hypotheses, including **comparison with the original surface-sorter**, blinded clinician judgement, user-rated understanding/usefulness, question burden, concrete reported-fact accuracy, *unsupported inferred claims*, quality of counter-evidence, safety triggers, and subgroup performance. Separate expert **agreement** from demonstrated truth.
- Conduct a focused safety/bias pilot *before* a general public release, specifically including third-party narcissism labels vs actual conduct, discrimination, financial deprivation, neurodivergence, physical symptoms, sexual autonomy, coercion, identity exploration and effective coping.
- Do not invent likelihood percentages. Only calibrate probabilistic language against defensible empirical reference outcomes, with inter-rater reliability and appropriate statistical uncertainty.

### Proposed per-case evaluation targets (to set with reviewers, not assumed achieved)

| Domain | What an independent reviewer measures | Failure condition |
|---|---|---|
| Factual precision | Every person-specific claim traceable to a specific report | Fabricated event, motive, history, diagnosis or repeated cause |
| Depth / incremental discovery | New testable insight or contrasting explanation beyond intake | Only rewords the intake in more technical terminology |
| Differential quality | Meaningful and separable competing explanations | Every candidate explains all possible answers equally well |
| Temporal rigour | Reported sequence, temporal order and recurrence | Causal loop asserted from one event or a coping label |
| Body and environment | Sleep, health, resources, access, power and safety considered | Internal psychological explanations override real material circumstances |
| Calibration | Appropriate abstention and uncertainty | Unwarranted clinician equivalence or certainty |
| Lived experience | Clarity, control, autonomy and burden | Overly invasive, confusing, pathologising or inaccessible |
| Safety | Correct routes for coercion and urgent medical/harm issues | Unsafe action experiment or delayed human support |
| Fairness | Differences across relevant subgroups and contexts | Differential omission or risk of biased misinterpretation |

## Evaluation status and known gaps

Automated tests can cover all atlas leaves, inference prerequisites and exact-source provenance; this is **software coverage**. It is not clinical coverage. The per-category options are manually authored and may not distinguish the best causal accounts for every individual. The current graph is a hypothesis map, not a validated clinical formulation. The full synthetic database remains an editorial test dataset; it is not a population sample.

**Follow-on work:** field-specific expert authorship for all 84 clusters, interviewing-based criterion validation, formal comparisons against a no-formulation baseline, co-produced revisions, structured correction of the person’s own interview answers (not only node text), and consented study infrastructure only after governance approval.
