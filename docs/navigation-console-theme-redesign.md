# Navigation Console — progressive themes and method families

## Intent
Reduce the number of simultaneous decisions without making any of the 518 existing Atlas topics harder to reach. Preserve the seven original "Choose a starting point" routes, the original authored intervention steps, the support-first safety paths and the optional private worksheet workflow. Navigation themes are for finding material, **not diagnostic classifications**.

## Topic selection — balanced subject themes (11 November 2026 follow-up)
- After any of the seven original "Choose a starting point" cards, the topic page now starts **directly with Explore by theme**. The "A few places to start" section and its entire shortcut-card grid are removed from the visible navigation; the underlying deep links remain valid.
- Every goal shows the **same eleven specific, semantic topic themes** so no goal inherits a lopsided 64/67/7/11 set of categories. These groups are: Feelings & mental health; Thinking, habits & focus; Relationships & connection; Family, harm & safety; Identity & self-image; Culture, faith & migration; Body, sleep & intimacy; Neurodivergence & disability; Work, learning & getting things done; Money, technology & society; Life changes, grief & growth.
- The **518 canonical Atlas topics appear exactly once** in the eleven groups. Their measured group sizes are **48, 47, 47, 48, 49, 45, 50, 42, 44, 49 and 49**: smallest 42, largest 50. All 31 original source domains are retained. Nine individually named relational/care topics were assigned to the connection theme instead of their original transition-related source domain, improving both thematic fit and balance without changing their IDs, URLs or underlying source classifications.
- Selecting a starting point still matters: topics belonging to domains relevant to that goal appear first **within each theme**; every goal nevertheless retains access to the entire catalogue. This prevents tiny theme counts or unreachable topics when the user changes goals.
- Selecting a theme displays its topics **24 at a time**, with a Show more option. The extra domain-chip filter has been removed to avoid further complexity. A single optional search field can find any topic across the entire catalogue, and All themes returns to the overview. Searching does not imply diagnosis or risk scoring.
- Existing direct URLs `#workbook-topic/{id}`, legacy workbook deep links, and existing safety-first topics remain operational. Historical Atlas entry links redirect to the current navigator.
- Accessibility: theme buttons expose expanded state and reference the labelled topic panel. The status line announces visible result counts. Page layout supports touch and keyboard navigation; opening and closing groups moves focus to their headings.

## Topic pages
- Approach tabs now represent **families**, not mixed time/effort and methodology: Practical changes; Behaviour & planning; CBT & thinking; DBT & grounding; ACT & values; Self-compassion; Support & connection.
- All entries of one family appear together inside a named horizontal group. Time and effort are optional refinements in a separate compact select, not competing methodology tabs.
- Card display titles are shorter, while original details, steps, cautions, educational source status and worksheets remain available when opened.
- For broad non-safety topics, context-aware supplementary selections replace the same long generic deck everywhere. Every named topic also offers a single guide-derived **Explore in context** reflection, using its own description and plausible contributors, explicitly marked as unvalidated educational material. Editorial/context-first topics still show fewer options overall, with no claim of individual treatment efficacy.
- Topic guides have a reduced set of existing no-writing games selected for the context, plus a simple original **Explore this topic** activity that lets visitors reveal three guide-derived perspectives. It is an unscored educational reflection, not a clinical instrument or an individually validated therapeutic game.
- Safeguards remain: support-first entries expose no self-treatment game/deck; existing exclusions for inappropriate symptom checking, compulsive matching, breath-focused activity in panic/physical concerns, or overstimulating visuals are preserved.

## Limitations and quality checks
This is a navigation and presentation improvement, **not** 518 newly authored individualised clinical interventions or 518 different game engines. Topic-specific content is limited by the underlying Atlas editorial quality. Avoid representing a context-first entry as an evidence-validated treatment programme.

Updated unit and browser regression specifications now cover theme taxonomy, pagination, direct search, unchanged safety-first handling, adjacent approach families, topic-specific game content and navigation behaviour. Test results should be run in CI and on representative mobile hardware; structural and syntax checks alone do not establish a production usability outcome.
