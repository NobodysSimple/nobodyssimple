# Hypothesis Generator — Stage 5: evaluation and independent review

**Status: technical evaluation implemented; independent clinical and lived-experience review NOT YET CONDUCTED.** No accuracy or safety-validation claim is justified by this document.

## Why this stage exists

The generator can now collect exact self-reports and draw provisional causal arrows. The evaluation has to ask two separate questions:

1. **Technical fidelity:** Does the software preserve the evidence, seek genuinely distinguishing observations, respect refusals and constraints, avoid repeating questions, and keep causal claims provisional?
2. **Clinical and lived validity:** Are its inferences proportionate, comprehensible, culturally responsive and actually useful when independently appraised? The current synthetic corpus cannot answer this second question.

The 26,377 generated cases are **not** independent clinical judgements. Every editorial 'candidate mechanism' remains a hypothesis. A large number of synthetic records is not a validation sample.

## Verified source baseline, 9 November 2026

Derived from the actual uploaded file "Nobodys_Simple_Synthetic_Formulation_Database_v1(1).zip", SHA-256:

3aaca5f7c871ad600b39a6039667cdc3e50a2d34a18678bdd87b6bd16e545bbb

| Inspection | Observed |
|---|---:|
| Question records | 12,716 (2,184 source and 10,532 synthetic extension) |
| Unique question identifiers | 12,716 |
| Distinct concept IDs | 12,716 |
| Repeated exact/normalised wording *excess occurrences* | 342, across 110 wording groups |
| Questions without one of the explicit skip/unsure/prefer-not/none-of-these alternatives | 422 |
| Invalid question prerequisites, interpreting question=answer gates correctly | 0 |
| Invalid conditional answer values | 0 |
| Broken question links inside 2,198 branching routes | 0 |
| Provisional editorial mechanism entries | 72 |
| Synthetic cases / fictional answer turns | 26,377 / 313,579 |
| Cases from unique source-atlas IDs | 1,653 |
| Individually authored fictional contrasts | 63 |
| Of those, scenarios marked for medical/safety review | 10 |
| Independent clinical case adjudications | 0 |
| Empirically calibrated likelihood estimates | 0 |

**Interpretation:** repeated wording is a *review target*, not proof that a user would hear a duplicate question in one route. Unique concept IDs likewise do not prove semantic uniqueness. Some 422 questions offer 'unclear' or 'something else'; the audit specifically checks for an explicit option to skip, decline or indicate uncertainty, not every semantically similar response. The 26,377 cases share templates and are unsuitable for a random case-level train/test split. No broken prerequisite IDs were found after interpreting conditional answer gates.

The source baseline can be independently reproduced:

    python3 scripts/hypothesis-stage5-source-audit.py --zip "/path/to/Nobodys_Simple_Synthetic_Formulation_Database_v1(1).zip" --out stage5-audit-output

The optional ZIP stays local. The command generates a JSON report, Markdown report and three reviewer CSVs; no network or clinical record collection is involved.

## Runtime evaluation (on the current codebase)

- A scripted regression suite supplies new, explicitly fictional responses to the Stage 3/4 interview interfaces and compares contrasting candidate patterns. These are **newly authored engine QA scripts**, not alleged replays of the incompatible original database questions.
- Tested contrasts include real interpersonal conduct despite changing one's reaction versus a variable situation; rest making a difference versus not; material constraints improving versus persisting; repeated short relief cycles versus one-off or variable consequences; absence of an unwanted problem; external values constraints; refusal and uncertainty; and unsafe changes.
- A provenance auditor checks that any evidence-based arrow's source IDs and displayed wording agree, that all typed wording is retained in inspectable graph evidence, that explicit hypotheses have supporting selections, and that no causal arrow is labelled proven.
- The UI now shows positive counter-evidence explicitly, an inventory of investigated versus uninvestigated domains, and a source-backed verbatim answer ledger. It distinguishes **not asked**, **asked without a confirmed detail**, and **person-reported details**.
- The adaptive policy is compared with a fixed conditional question order on a documented contrast. This is a **question-prioritisation test**, not a clinical-information-gain estimate.

Run the normal JavaScript and browser suites plus the corpus-audit self-test:

    npm test
    npm run test:browser
    python3 scripts/hypothesis-stage5-source-audit.py --self-test

## Independent review protocol

### Reviewers

Invite at least two clinically trained psychological-formulation reviewers **and** at least two lived-experience reviewers with different relevant perspectives. Record expertise, context and potential conflicts. These are proposed recruitment targets, not reviewers who have already participated.

### Blinding and order

1. Give reviewers the 63 fictional scenario prompts only, using "blind-review-cases.csv"; ask them to note reasonable interpretations, missing evidence and safety flags without seeing the app.
2. Present the *app's output for the same explicitly entered information*, with no access to extra facts. Do **not** silently invent source case answers just to drive the app. If answer formats cannot be matched, mark the case as **not replayable** and commission a separately authored compatible vignette.
3. Ask reviewers to grade eight domains from 0–3 or N/A with explanation, using "independent-scoring.csv": factual fidelity, calibrated causal language, alternative explanations, counter-evidence, conditions and power, non-pathologising interpretation, clarity/usefulness, and questioning burden.
4. Examine safety-critical disagreements and misunderstood wording qualitatively; afterwards reveal "unblinded-reference.csv" as **editorial context, not an expert key**.
5. Reconcile disagreements in a documented adjudication meeting; never turn expert ratings into a fabricated prevalence or diagnostic likelihood.

### Rating anchors

0 = Unsafe/seriously inaccurate; 1 = major revision required; 2 = usable with identifiable improvements; 3 = strong and well evidenced; N/A = not testable from the provided scenario. Record each serious issue individually even if the mean appears satisfactory. A high average cannot compensate for a severe coercion or physical-health failure.

### Non-negotiable promotion criteria

- Zero unreviewed serious safety problems and zero auto-asserted diagnoses of third parties.
- All displayed direct quotes must be attributable to the user selection or user text, with no text hallucination.
- Unsupported causal conclusions must remain explicitly hypothetical; 'insufficient evidence' and external/contextual alternatives must remain valid outcomes.
- Safe handling for uncertainty, coercion, physical symptoms, chosen consensual preferences and irreversible decisions.
- A pre-agreed reviewer acceptance rule after inspecting the full spectrum of severity and disagreements; do not retroactively set a pass threshold to fit the outcome.

## Remaining work (Stage 5 NOT complete)

- Human review and blinded assessment ratings have not yet happened.
- The original 12,716 questions have not been individually clinically screened or wired into live adaptive questioning. No algorithm has been trained on the 26,377 cases.
- A rigorous held-out evaluation must avoid leaking templates/atlas family between folds; the current scripted test set primarily protects against coding regressions.
- Accessibility and fairness still need participatory testing beyond automated checks.
- No empirical evidence yet supports clinical diagnosis, personalised probability outputs, hidden-cause detection or specialist-level efficacy.

**Stage 6 must not begin as an ungoverned collection of users' sensitive real-life cases.** Any real-world validation requires consent, ethics and data-governance review, independent adjudication and privacy-by-design arrangements.
