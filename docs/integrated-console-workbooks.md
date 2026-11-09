# The Console — Integrated education + tools
**Release architecture · 9 November 2026**

## Product change

The final selection in **Choose a starting point** now opens **one continuous, scrollable interactive field guide** instead of sending the visitor straight into a standalone tool and asking them to open a separate guidebook.

Reading and practice share the same page: understand the named experience; consider a possible (not assumed) feedback cycle; compare contextual contributors and topic-specific maintaining processes; read practical approaches and their limits; then complete a functional worksheet **immediately beneath the advice**. Users can choose to try another chapter, ask for help, stop, or explicitly download their notes.

A visitor may optionally expand an **original full Nobody's Simple tool inside a chapter**, without changing routes. Only one original tool is mounted at a time to avoid conflicting IDs from older renderers. Historical modal-guide modules remain for compatible older routes but are no longer the default console experience.

## Coverage

The seven starting-point families have **53 authored choice routes**:

| Route | Choices | Educational approaches | Embedded tools |
| --- | ---: | --- | --- |
| Feel steadier | 8 | 6 domains, 12 situation-specific methods | Recognition, conditions, behavioural trial, cognitive inquiry, DBT-informed pause, values, support |
| Process something | 8 | 5 tailored domains | Recognition, conditions, practice, thinking, values, support |
| Understand myself | 8 | 5 tailored domains | Same six functional components |
| Work out what to do | 8 | 5 tailored domains | Same |
| Work through something with someone | 8 | 5 tailored domains; unsafe option is support-first | Same except no disclosure worksheet under coercion risk |
| Explore a specific difficulty | 8 | 5 tailored domains plus 166 atlas topics | Same with searchable topics on browsing routes |
| I'm not sure | 5 | 5 flexible domains | Same, no label or diagnosis required |

All **166 existing Psychological Atlas topics** are directly accessible through the integrated topic route. Each draws on the existing atlas definition, recognised features, contributors, maintaining processes, intervention targets and cautions. Topic-first searches now lead directly to the relevant teaching and tools rather than another intermediary.

## The functional worksheets

1. **Situation and context map:** optional short example, possible factors and maintaining processes; no diagnostic scoring.
2. **Conditions builder:** name the environmental, practical or social barrier; select reduce, adjust, share, delay, or not safely changeable; consider resources.
3. **Behavioural trial and review:** choose a small voluntary response, prediction, stopping condition, then review as helped, neutral, blocked, worsened or untried.
4. **Facts versus interpretation:** distinguish observation from inference and consider competing explanations without forced optimism.
5. **DBT-informed tolerable pause (Feel steadier only):** choose safe comfort, grounding, less stimulation, rest or support.
6. **ACT-informed values direction:** allow tolerable uncertainty while selecting a value and realistic response or rest.
7. **Support planner:** identify practical, health or relational help and an optional request or access step.
8. **Safety-first choice:** under risk of coercion or acute concerns, show appropriate support and emergency advice **without collecting identifying or sensitive narratives**.

Generated summaries simply reformat visitor entries. They are not predictions, diagnoses or a clinical assessment.

## Routes and compatibility

- Starting-point chooser: #navigate and #navigate/{mode}.
- All 53 current choices: #workbook/{mode}/{option}.
- All named atlas topics: #workbook-topic/{atlas-id}.
- Historic route-tool, route-activity, route-topic, route-atlas, steady-tool and direct need links retain compatibility where safe.
- #need/support-safety remains immediately available, without a questionnaire.
- Existing original tools, topic profiles and educational materials remain in the repository.

## Privacy, accessibility and safeguarding

Inline notes are **not automatically saved** to local storage, browser sessions, user accounts, or a remote service. Explicit text download is available, with a warning about shared or monitored devices; a two-step confirmation clears notes. The optional original tool retains its own separate saving rules, which the interface discloses. Locked accounts cannot open those extra tools until unlocked.

No symptom scores, invented mechanisms, compulsory mood ratings, mandatory exposure tasks or pressure to finish. Guidance distinguishes a safe voluntary skill from specialised therapy, physical illness or an unsafe environment. Important cautions cover acute physical symptoms, trauma retelling, OCD/ERP, post-exertional malaise, coercion and suicidal thinking. The safety-first routes emphasise human help rather than text disclosure.

The interface supports keyboard navigation, visible focus, responsive text, mobile forms, reduced-motion preferences, accessible selections and horizontal overflow checks. Usability and accessibility tests do not establish clinical efficacy.

## Engineering

- ns-integrated-workbook-data.mjs: merges 8 Feel steadier books, 45 pathway books and 166 atlas profiles into a common source-aware chapter model.
- ns-integrated-workbook.mjs: the complete reading/practice page, in-chapter worksheets, optional full-tool mounting, topic search, and private exports.
- ns-integrated-workbook.css: responsive editorial hierarchy, contrast, mobile, print and focus.
- ns-needs-catalog.mjs / ns-needs-console.mjs / site.mjs: routing and legacy compatibility.
- tests/free/integrated-workbooks.test.mjs: exhaustive 53 choice and 166 topic checks.
- tests/browser/pathway-guides.spec.mjs and tests/browser/steady-guides.spec.mjs: real browser, mobile, keyboard, privacy, safety and accessibility regression cases.

## Evidence limits and next evaluation

Source records remain in docs/feel-steadier-scientific-review.md and docs/other-starting-point-scientific-review.md. NICE, NHS and research sources support underlying principles or cautions; citing them does **not** validate the novel worksheets or the entire sequence. The 45 pathway manuscripts are individually authored but briefer than the 8 Feel steadier guides; the 166 atlas profiles vary in educational specificity. Independent topic-by-topic clinical and lived-experience review is still required before efficacy claims. Outcomes to evaluate include comprehension, real-world transfer, burden, accessibility, safety, neutral/worsened outcomes and capacity to change real conditions.
