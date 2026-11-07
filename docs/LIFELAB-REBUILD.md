# Life Lab implementation

## Components
- ns-life-lab.mjs: existing route integration; legacy Reality Sorter remains available.
- ns-lifelab-content.mjs: five curricula, 200 units, 1,000 stones and 2,000 lesson slots.
- ns-lifelab-worlds.mjs: exact companion names/quotes, story stages, game labels, 40 region names per world.
- ns-lifelab-scenery.mjs: seeded original SVG scenery, shared boundary colours, five finale environments and game illustrations.
- ns-lifelab-games.mjs: 24 named games using six interaction families, drag and click sorting, reveal, ordering controls, tools, timed choice and three-stage scenarios.
- ns-lifelab-state.mjs: completion validation, legacy progress, sequential unlocks, finale gating.
- ns-lifelab-v3.mjs: direct trail routing, switcher, map, dialogs, character conversations, review and reward display.
- ns-lifelab-v3.css and ns-lifelab-worlds.css: isolated responsive design.
- media/lifelab/companions.png: original generated 4-by-5 companion atlas; columns follow each trail’s supplied character order. Rows: Forest, Garden, Harbour, Forge, Observatory.
- media/lifelab/world-atlas.png and trail-header.png: previous simplified brand illustrations retained for lesson scenes.

## Reference coverage
Forest: Moss, Briar, Echo, Rowan; Clue Tracker, Fog or Fact, Assumption Finder, Summit Route Planner, Reality Sorter; The Summit Ascent.
Garden: Fern, Poppy, Sunny, Thistle; Feeling Bloom, Need Matcher, Body Signal Sort, Glasshouse Care Plan, Signal Garden; The Glasshouse Revival.
Harbour: Milo, Ari, Nell, Cove; Dockside Dialogue, Signal & Intent, Boundary Beacon, Repair Map, Harbour Dialogue Builder; The Grand Port Council.
Forge: Pip, Rook, Tavi, Ember; Friction Forge, Habit Engine, Priority Press, Momentum Run; The Great Engine Ignition.
Observatory: Sora, Indi, Vale, Lyra; Value Constellation, Lens Switch, Story Orbit, Perspective Telescope; The Star Dome Alignment.
Shared: Capstone Path, centered chapter breaks, destination chips, character conversations, lesson objective and progress, explicit reward confirmation.

## Progress and content
The five-stone sequence remains 3/3/2/1/1. Games run inside the lesson flow and are followed by the unit-specific learning check; application lessons use a short response. Each finale combines four trail games and a capstone scenario after all 400 trail lessons are complete. XP is derived from persisted completion, so review cannot repeatedly award it. Earlier stored records remain intact.

Scenery is generated deterministically from the trail and unit number. Every composition is distinct; its motifs and road curve are deliberately reusable. Adjacent sections match their boundary colours. Chapter cards at units 9, 17, 25 and 33 provide larger transitions. The supplied reference images are adapted into original simple artwork, not embedded as UI screenshots.

## Validation
Run node --test tests/free/*.test.mjs and node tests/free/check.mjs.
57 tests cover curriculum totals, sequential progress through all 2,000 lessons, malformed storage, old progress, route integration, all 24 game definitions/solutions, twenty companions, 200 scenery compositions, and finale gating/idempotence.
Browser checks cover desktop/mobile layouts, direct entry/switching, finale preview, lesson completion and review, card sorting, tool selection, ordered routine building, and three-step scenario completion.
