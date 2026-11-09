# The Console — Choose one intervention, then work through it
**Design release · 9 November 2026**

## Why this version replaces the previous one

The first integrated workbook put education and five or six interactive tools on the same page. Although technically sound, it still displayed **all** intervention chapters while visitors were distressed. The product now follows a deliberately lower-demand progression:

**Understand → Browse → Preview → Choose ONE → Complete a method-specific worksheet.**

The educational material remains available without requiring any response, and the psychological approaches are not removed. They are now presented as a browsable intervention deck with distinct coloured cards, effort and timing labels, optional filters, and horizontal controls. The selected card opens a preview dialog describing the rationale, practical steps, cautions and relevant sources. Choosing it places **one** suitable interactive worksheet directly beneath the education and chooser; no other worksheet is expanded.

A visitor can change their choice. Distinct draft answers are remembered only in the in-memory page session, not across reloads, accounts or devices. Neither choosing nor completing a worksheet submits it to a server.

## Coverage

- All **7** starting-point categories and **53** console choices use the revised renderer.
- All **166** atlas topic pages are covered by the same model, subject to safeguards for high-risk topics.
- Existing 8 fully developed Feel steadier guides contribute **12 specific methods per route** to the deck.
- The 45 other choice guides contribute their five context-specific methods and general optional alternatives.
- The atlas contributes its current topic-specific target methods and recognised maintaining processes.
- Every non-safety-first page has at least **12 selectable interventions** spanning at least five approach types. Most pages have more.
- For urgent or unsafe experiences (e.g. coercive control, suicidality, critical health concerns), safety-first instructions replace self-treatment choices.

## Card types and real variation

Cards are tagged by type, with original methods retaining their existing rationales, instructions, cautions and citations. General optional skills are explicitly described as **adaptable techniques, not validated topic-specific treatments**.

- Environment: change sensory inputs, workloads, demands or practical conditions.
- Behaviour and plans: a genuinely smaller action, a low-stakes trial, implementation intentions with fallbacks.
- CBT-informed cognitive inquiry: observations versus interpretations and reality-based alternatives, without forced optimism.
- ACT-informed flexibility and values: willingness and meaningful action without requiring symptoms to disappear.
- DBT-informed grounding: brief comfort or orientation skills without forced breathing or exposure.
- Self-compassion and reflective clarification: fair self-talk and recognising needs.
- Practical and relational support: identifying a specific, safe request, service or accessibility adjustment.
- Longitudinal: bounded pattern observations, planned recovery, cue-based routines, and later review.

Filters include **All approaches, Low effort, Right now, Over time, Thoughts, Behaviour & plans, Environment, Acceptance & care, Grounding, and Support**. Each card distinguishes approximate time commitment and likely demand; these are interface guidance, not measured clinical doses. Horizontal arrows, touch scrolling, scroll snapping, a keyboard-focusable track, an accessible native preview dialog and an Escape close are included.

The optional *original full interactive tool* remains expandable **inside the selected task** when relevant, rather than on every card. Its separate account and saving behaviour is disclosed, and account locks are honoured.

## One task → one fitting worksheet

Worksheets are not identical text boxes relabelled as different therapies. Their prompts are keyed by method:

| Type | Typical questions |
| --- | --- |
| Conditions | Which demand is relevant? What practical adjustment and support are realistic? |
| Behavioural step | What will you try, what could block it, and what tells you to stop? |
| Thought inquiry | What is known, what is predicted, and what competing evidence is relevant? |
| Grounding | Which tolerable cue can you try and when should you stop? |
| Values | What experience is present, what matters, what action/rest expresses it? |
| Support | What do you need, who could safely help, how might you phrase the request? |
| Compassion | What is the harsh interpretation, what would be fairer, and what changes? |
| Long-term tracking | What single contextual detail will be noted, with what bounded review plan? |
| If–then plan | What cue, chosen response and low-energy fallback fit? |
| Recovery | Which demand prevents rest, what window or adjustment is realistic? |

A neutral outcome review offers **not tried, useful, unchanged, blocked, unsuitable**, allowing users to stop without implying failure. A preview of their notes can be explicitly generated and downloaded; clearing requires a second click. No psychometric scoring or invented individual causal claims.

## Compact education remains first

The first section still explains what the experience can mean and offers **one possible, explicitly hypothetical feedback cycle**. More signs, contextual contributors and maintaining mechanisms are available inside an optional disclosure, keeping the default reading load low. Clinically important cautions remain visible. Citations and original source provenance remain accessible in a lower-page expandable section.

An atlas-browsing choice also offers an inline search so visitors can jump to specific topics and their own choosers without redoing a questionnaire.

## Safety, limitations and further evaluation

Clinical safety exceptions are preserved: unsafe and high-risk routes show support resources without collecting sensitive narratives. Optional cognitive, behavioural and tracking methods are *not* assigned as validated treatment. Monitoring-style alternatives are excluded from checking/rituals, panic and sleep pages where extra symptom attention might be counterproductive; action-pressure microtasks are excluded from depleted/fatigue routes.

This work is a **product/UI implementation**, not a systematic evidence review or clinical validation. Original source records remain in feel-steadier-scientific-review.md and other-starting-point-scientific-review.md. The shorter 45 authored guides and variable-depth atlas content warrant independent, topic-specific clinician and lived-experience review. Task cards should subsequently be evaluated for comprehension, ease of choice during distress, burden, safety, accessibility and actual real-world behaviour change.

## Engineering changes

- ns-intervention-cards.mjs — source-aware deck construction, safe extra technique definitions, pacing metadata and filtering.
- ns-intervention-chooser.mjs — new render path; compact reading, swipeable cards, preview dialog, one task worksheet, in-memory drafts, explicit export, safety routes, topic search.
- ns-intervention-chooser.css — coloured responsive intervention tiles and keyboard/mobile layouts.
- ns-integrated-workbook.mjs — existing entry point delegates to the new chooser for all console and atlas pages.
- index.html — loads the new styles and cache-busts the entry point.
- tests/free/intervention-chooser.test.mjs — exhaustive route/deck coverage and safety conditions.
- tests/browser/pathway-guides.spec.mjs and tests/browser/steady-guides.spec.mjs — card selection, filters, keyboard Escape, changing choices, distinct worksheets, export, mobile overflow and automated WCAG checks.

The prior integrated workbook code remains available as a transitional compatibility layer, but its multi-expanded-chapter interface is no longer rendered for these console routes.
