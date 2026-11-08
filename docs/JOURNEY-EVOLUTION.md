# The Journey: feedback implementation

## Learning foundation
Incorrect learning checks show corrective feedback and a Try again action. Only a corrected answer can advance. Correcting an error can collect Second Look; opening a lesson or answering alone does not record completion. Games already required correct solutions; that rule now also applies to learning checks and retrieval.

Forty opening situations (eight per trail) are authored in ns-journey-stories.mjs. They contain concrete observations, interpretations, questions and actions. They feed the existing game families and are followed by unit-specific learning checks. Later chapters retain reusable scenarios; ongoing scenario authoring remains an editorial expansion, not hidden behind claims of 2,000 unique experiences.

## World and narrative
Each of the twenty characters has five distinct story passages: meeting, understanding, practice, complication and return. Choices are retained in immutable stage records and influence follow-up language and the meeting/practice place shown on the trail. Stages open as the first four units are completed. Completion of a story creates a visible place, without claiming that the character is cured.

Lesson progress clears Forest fog, returns Garden flowers, lights Harbour lamps, turns Forge wheels and connects Observatory stars. Small celebrations appear after Units 2, 4 and 6; a visitor appears after Unit 3. Chapter festivals open after each eight-unit chapter and provide a mission, badge, XP, gems and a trail outfit. The first festival-ready prompt is visible when the next chapter begins. The full grand finale remains at forty units.

## Ownership and collection
The HUD shows the Nobody, level, compact XP and gems. The Journey drawer contains Explore, Journal, Wardrobe & shop, Homebase, Discoveries and Settings. Twenty-five skill/activity achievements are derived from persisted evidence; per-unit mission badges and per-chapter badges are also visible in the Journal.

The shop has hats, clothing, shoes, a backpack, lantern, accessory, furniture, collectibles and effects. Purchases have no educational advantage. Trail outfits are festival rewards. Equipped items visibly change the player on the trail and at home. Decorations can be placed and put away. Met characters become homebase visitors.

## Return visits and accessibility
The default is a flexible three-days-per-week goal. Users can select one to seven weekly days, daily tracking or no streaks. Missing days never removes learning, XP or inventory. Weekly quests reward helping different characters, review and practice days.

Daily Discovery draws from completed lessons. Retrieval intervals are 1, 3, 7, 14 and 30 days; uncertainty or an incorrect attempt brings a review back sooner. Reviews never duplicate course XP. Local partner quests use alternating roles and a shared fictional challenge; they are not online collaboration.

Settings include quieter visuals, animation, untimed games, sound (off by default), and reward displays. Existing account motion/sound preferences are respected. Sorting and ordering have click/keyboard alternatives to dragging. Dialogs retain a visible close control, native modal focus behaviour and Escape support. Narrow screens use a single main trail rather than a sidebar.

## Shared progression and migration
ns-journey-progress.mjs stores version-namespaced events within ns-account-learning-v2. The existing Workspace isolation therefore applies to guest work, signed-in accounts, shared devices and locked saved work. Legacy lesson completions are read rather than overwritten.

XP and earned currency are derived from completion/story/chapter evidence. Purchases have one deterministic ID per item; repeated completion or purchase attempts cannot duplicate rewards. Equipment and settings use timestamped records. Concurrent purchases are ordered by timestamp and key; unaffordable competing purchases remain unowned until the balance supports them. There is no negative balance.

account-sync.mjs unions compatible immutable Journey events and completed lesson records before retrying a revision conflict. Unknown or deleted data continues through the existing conflict handling. Same-account tab storage events also reconcile compatible updates. Cloud acknowledgements do not close an open lesson; changing account preferences/scope closes it before further writes.

Optional evaluation retains at most 300 recent events: starts, stages, completion and enjoyment ratings. Review evidence stores recall uncertainty without answer text. The export offers descriptive completion/return-day/replay/recall information, not population-level retention statistics or clinical outcome evidence. Records follow the existing learning sync preference; no separate telemetry endpoint is added.

## Legacy audit
One renderer owns the modern #lab world routes. The earlier automatic enhancement scripts remain disabled. Inactive living-trail, trail-fidelity, Forest-lesson and other-trail enhancement stylesheet links were removed from index.html. Source modules remain for exported compatibility and legacy tests; the original Reality Sorter mission remains available. The active legacy mission stylesheet is retained.

## Validation
Automated coverage includes all 2,000 lesson completions, chapter/full-map rendering, legacy migration, idempotent rewards, insufficient funds, simultaneous purchases, story gating, chapter rewards, weekly/daily date boundaries, retrieval spacing, forty opening cases, twenty five-stage stories, malformed storage, quota failures, account isolation and mocked cloud revision conflicts.

Browser checks: corrected-answer retry and Second Look; companion-stage persistence; buying/equipping/placing cosmetics; chapter mission and outfit reward; settings persistence; retrieval completion; local partner quest; desktop and narrow mobile layouts. Live authentication and a real two-device Firebase session were not exercised. Educational effectiveness and voluntary return rates require subsequent user evaluation.
