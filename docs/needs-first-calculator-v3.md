# Nobody's Simple — Needs-First Emotional Calculator (v3)

## Product decision

**Start with what the person wants to do, not what the system thinks is wrong with them.**

This release replaces the live default entry point to the Emotional Calculator. The main homepage, its image and its entry button are intentionally unchanged.

## Issues from the November 9 review and actions

| Reported issue | Response |
| --- | --- |
| Unrestricted free-text entrance produces incorrect matches | Removed from the default console. The only search field is in the explicitly chosen named-topic atlas, where it filters literal titles/descriptions without attempting diagnostic inference. |
| Mandatory psychological reasoning questions | Removed from the default route. Users can reach an activity after choosing a goal and an experience, without a questionnaire. |
| Incomplete and misleading problem discrimination | No heuristic candidate ranking or fake confidence percentages appear in the console. Questions are only inside voluntarily chosen activities. |
| No easy route for processing | Added eight authored Processing Studio modes: feeling, expression, event meaning, reactions, mixed feelings, grief, compassionate responding, and closure/acceptance. |
| Regulation equated with reducing difficult emotion | Added eight authored state-sensitive activities including overload, panic, sensory, anger, disconnection, depletion, restlessness and savouring a good moment. Each has several practical alternatives. |
| Repetition between intake and worksheet | Removed intake. The person goes directly to the activity they chose. The psychological atlas asks about specific signs and mechanisms only when someone wants that learning. |
| Wrong resource for the stated goal | Curated existing interactive tools by goal and linked only to existing IDs. Reused specialist worksheets rather than duplicating whole tools. |
| Fragile question Back handling | The obsolete compulsory question flow is no longer routed from Home, #navigate or #help, so users cannot encounter the stale ranked state. History-based anchors allow changing direction without keeping diagnosis state. |
| Inability to address joy, neutral feelings or uncertain needs | Added savouring and an “I'm not sure” route that offers relief, expression, clarity, action or browsing. |
| Too many moving parts | Seven labelled first-step cards, then a small choice list; one tap opens support. Educational content remains behind an explicit choice. |
| Loss of specific psychological atlas | Preserved all 166 named topics, browsable by domain and alphabetically; a topic card offers education, an optional worksheet, processing or regulation. |
| Safety and coercion | Safety/urgent support link visible on every navigator and activity screen. Explicit pressure/controlling option leads directly to human support; no unsafe confrontation worksheet. Topic pages for high-risk subjects prioritise support. |

## Information architecture

1. **Need**: Regulate / Process / Understand / Act / Relate / Learn / Unsure.
2. **Experience**: One recognisable, non-diagnostic option within the chosen need.
3. **Appropriate support**: A dedicated activity, an existing interactive tool or a named topic.

This is intentionally not a psychological triage or diagnosis system. It does not infer mental disorders from free text.

## Working behavior

- \`#navigate\` and \`#help\` open the new choice-led entrance.
- \`#navigate/<mode>\` displays the selected goal's specific experience choices.
- \`#need/<activity>\` displays the dedicated Processing Studio, settling activity or safety support.
- \`#navigate/atlas\` filters 166 existing topics by name and category (not clinical risk or probability).
- \`#navigate/atlas/<id>\` allows a clear choice between psychoeducation, an optional topic worksheet, processing or regulation.
- \`#problem/<id>\` retains the ten-part guide, available through three progressive learning stages.
- \`#tool/<id>\` continues to use the existing tool library without making a redundant copy.

## Processing Studio

- Eight authored modes with four distinct **optional** reflective prompts each.
- One prompt at a time: previous, next, skip and finish.
- Finish does not require feeling better, identifying a cause or selecting a next action.
- Download notes to a local text file if the person chooses; erasing and leaving require no account.
- No automatic storage or transmission of processing notes.

## Regulation design

- Eight entry experiences, with three alternatives per activity.
- Includes environment and practical capacity changes, sensory needs, optional grounding, anger pauses, rest, restlessness and appreciation.
- Does not mandate breathwork, an emotional intensity rating, journaling or a predetermined amount of time.
- Familiar panic pathways explicitly acknowledge red flags and possible medical assessment.

## Curated resource map

There are 82 active tools in the existing catalogue; a smaller set is intentionally linked from this console. Tool IDs are verified by tests. The rest remain accessible through the existing tools catalogue and old bookmarks. Similar-purpose tools should be individually evaluated before retirement; removing them from console navigation is not the same thing as deleting user resources.

## Safety and privacy

- The navigator **does not** interpret arbitrary text as a risk assessment.
- A clearly accessible support page supplies official NHS urgent mental health care, urgent physical health care, domestic abuse support and Samaritans contact.
- Immediate danger in the UK: call 999. Urgent mental health care: NHS 111, mental health option.
- Relationship coercion is not treated as an ordinary disagreement. Do not direct a visitor to confront a potentially abusive person.
- No automatic account saving. Notes remain in the current activity component unless explicitly downloaded.
- Do not claim personal mental health assessment, triage, validated matching or clinical outcomes.

## Quality gates

- \`npm run check\` and \`npm test\` must pass in GitHub Actions, not a placeholder CI job.
- Regression tests assert all seven goal paths, every destination ID, all 16 direct activity types, processing without forced steps, positive-emotion coverage, 166-topic availability and safety access.
- Still required: browser-based desktop/mobile and screen-reader usability studies, readability audits, individual evidence review of the broad atlas, and clinical risk evaluation for any broader claims.

## Known limitations and next development

- The atlas is a **working library**, not a complete or validated classification of all psychological concerns.
- Processing exercises are educational reflective supports; none proves that emotional expression causes recovery.
- The broader 161 atlas templates require differentiated expert authorship and source-by-source review; this release does not claim otherwise.
- All user notes are deliberately ephemeral; user-controlled persistence would require clear consent, deletion and privacy review.
- The safety page gives appropriate general links but cannot establish current danger or individual clinical priority.
- Need-based route-to-tool choices are authored hypotheses about usability and relevance. Comparative user testing is required before claiming the flow is superior.
