# Navigation Console — progressive themes and method families

## Intent
Reduce the number of simultaneous decisions without making any of the 518 existing Atlas topics harder to reach. Preserve the seven original "Choose a starting point" routes, the original authored intervention steps, the support-first safety paths and the optional private worksheet workflow. Navigation themes are for finding material, **not diagnostic classifications**.

## Topic selection
- After choosing one of seven goals, visitors see a small number of existing practical shortcuts and up to six clear **theme cards**: Feelings & mental wellbeing; Relationships & safety; Identity & belonging; Body, health & access; Everyday life & change; The world around us.
- Every one of the 31 Atlas domains maps to exactly one theme in `ns-needs-themes.mjs`. Other starting points show only themes relevant to that goal. The six featured `learn` shortcuts still appear in their normal themes, yielding all **518** named topics in the full themed browse.
- Selecting a theme reveals relevant topics in batches of **24**; optional subcategory chips narrow within it. Only the selected theme is displayed, with an "All themes" return. Search finds all eligible topics directly across themes and does not require expanding anything.
- Direct URLs `#workbook-topic/{id}` and existing workbook routes remain stable. Previous Atlas entry links still redirect to the current navigator.
- Accessibility: buttons disclose expanded state and control the named topic panel. Search results are announced through a polite status. The layout is responsive, focus states remain visible and cards can be accessed with keyboard or touch.

## Topic pages
- Approach tabs now represent **families**, not mixed time/effort and methodology: Practical changes; Behaviour & planning; CBT & thinking; DBT & grounding; ACT & values; Self-compassion; Support & connection.
- All entries of one family appear together inside a named horizontal group. Time and effort are optional refinements in a separate compact select, not competing methodology tabs.
- Card display titles are shorter, while original details, steps, cautions, educational source status and worksheets remain available when opened.
- For broad non-safety topics, context-aware supplementary selections replace the same long generic deck everywhere. Editorial/context-first topics show fewer options, with no claim of individual treatment efficacy.
- Topic guides have a reduced set of existing no-writing games selected for the context, plus a simple original **Explore this topic** activity that lets visitors reveal three guide-derived perspectives. It is an unscored educational reflection, not a clinical instrument or an individually validated therapeutic game.
- Safeguards remain: support-first entries expose no self-treatment game/deck; existing exclusions for inappropriate symptom checking, compulsive matching, breath-focused activity in panic/physical concerns, or overstimulating visuals are preserved.

## Limitations and quality checks
This is a navigation and presentation improvement, **not** 518 newly authored individualised clinical interventions or 518 different game engines. Topic-specific content is limited by the underlying Atlas editorial quality. Avoid representing a context-first entry as an evidence-validated treatment programme.

Updated unit and browser regression specifications now cover theme taxonomy, pagination, direct search, unchanged safety-first handling, adjacent approach families, topic-specific game content and navigation behaviour. Test results should be run in CI and on representative mobile hardware; structural and syntax checks alone do not establish a production usability outcome.
