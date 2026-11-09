# Games scroller: original no-writing activities

**Release:** 9 November 2026 · Nobody's Simple

## Why this feature exists

The integrated console is designed around the principle that a distressed person should not be required to write, self-analyse, keep a score or complete a lengthy worksheet. Each non-safety-critical guide presents its educational introduction, an intervention chooser with exactly one expandable written worksheet, and now a **separate Games to try instead carousel** underneath that worksheet.

The new games are not the former interactive tool library and do not depend on writing or an account. Each is genuinely interactive and independently implemented. A selected game opens on the page without navigating away or disturbing existing worksheet answers.

The homepage now has a dedicated **Emotion Compass** button directly underneath **Hypothesis Generator**. The former **Browse tools** homepage shortcut is removed. Visiting the retired `#tools` route redirects to the choice-led `#navigate` console, while existing deep links to original tools remain compatible with legacy saved work.

## Twelve independently authored mini-games

| Game | What happens | Main interaction |
|---|---|---|
| The breathing garden | A flower opens and softens visually; no breath holding, deep-breath instruction or mandatory pacing | Start / pause / choose visual speed |
| Colour mosaic | A changing arrangement of tactile-looking colour tiles | Tap tiles, reset |
| Make a quieter room | Illustrated room can be dimmed, made still or desaturated | Toggle choices |
| Find an anchor | Choose external ordinary objects and attend to one neutral feature | Choose object |
| Build a pebble garden | Place small visual pebbles in a quiet garden | Place / undo / reset |
| Cloud watching | Clouds move gently away or can be brought back | Tap clouds |
| Light a constellation | Choose stars to illuminate in a still night sky | Toggle stars |
| Steady taps | Soft circular rhythm without enforced tempo, points or accuracy feedback | Tap / reset |
| Follow a little path | Move a flower on a garden grid at an unhurried pace | Four accessible direction buttons |
| Pair the leaves | Turn over garden tiles to find pairs, without timers or scoring | Reveal pairs / reset |
| Find the small leaf | Search among simple shapes with no time pressure | Select shape |
| Choose a gentle path | Build a three-part response from pause, reduce a demand, request support and a voluntary action | Choose / change / reset |

These games may support a temporary pause, external attention, sensory preference, playful engagement or sense of agency. **They are not validated emotion-regulation treatments, and they do not necessarily produce the same outcomes as a written exercise.** Games are offered as a different *mode of engagement*, not as cures for psychological difficulties.

No automatic music or sound; audio can be unsuitable for some visitors. The scene-based game makes clear that changing a picture is not an environmental accessibility accommodation.

## Complete navigation coverage

The shared renderer in `ns-intervention-chooser.mjs` ensures games appear on **all seven starting-point families, 53 console choices and all 166 atlas topics**, with explicit safeguarding exceptions. High-risk or safety-first routes have no game carousel and continue to display relevant human support.

The `gamesForGuide` catalogue applies contextual preferences:

- Anxiety (when appropriate): grounding, the optional flower, external orientation, quiet room and other calm activities.
- Panic/medical/respiratory caution: **no breathing flower**.
- Checking/ritual patterns: **no repeated tapping, matching or timed searches** that might aggravate a compulsive cycle.
- Sensory overload: no star lighting, repeated tapping or visual-search concentration tasks; practical and less stimulating options come first.
- Exhaustion: low-demand play and environmental comfort take priority over concentrated matching.
- Procrastination/decision difficulty: low-stakes attention games and a no-writing path chooser are prominent.
- Sleep: dim/still room, cloud watching, visual resting and minimal demands.
- Relationships/grief: calming options and realistic gentle choices, without suggesting that a game resolves coercion, loss or unequal power.

The filtering logic is editorial and heuristic, not a person-specific medical contraindication system. All games have a caution explaining when to stop or skip.

## Data handling and safeguards

The entire game state stays in page memory. No `localStorage`, `sessionStorage`, account sync, network requests, scoreboards, rankings, timers, engagement tracking or video/audio recording are added. Reloading or navigating away starts fresh. The breathing flower animates only after a deliberate click and can be paused. Reduced-motion settings remove animations.

All interaction controls use HTML buttons; the carousel is keyboard scrollable and supports next/previous controls. Directional movement, visual tile selection and preference switches work without drag input. Desktop, mobile and WCAG axe smoke tests cover the implemented UI.

## Implementation files

- `ns-regulation-games-data.mjs` — twelve descriptions, categories and situation-specific selection rules.
- `ns-regulation-games.mjs` — independent games, event handling, filter and carousel, one active game per guide.
- `ns-regulation-games.css` — visual interactions, carousel tiles, reduced-motion and responsive controls.
- `ns-intervention-chooser.mjs` — games inserted immediately after the optional worksheet.
- `strategy.mjs` — Compass button and retired Browse tools shortcut.
- `site.mjs` — `#tools` legacy URL redirects into the navigation console.
- `index.html` and `sw.js` — loading and offline cache.
- `tests/free/regulation-games.test.mjs` — exhaustive console/atlas coverage and safety exclusions.
- `tests/browser/regulation-games.spec.mjs` — actual interaction, privacy, mobile and accessibility checks.

## Scientific review still needed

The mini-games are product prototypes rather than prescribed psychological interventions. A future evaluation should measure comprehension under distress, voluntary stopping, sensory/accessibility fit, actual perceived burden, misleading claims, effects on compulsive behaviours and whether alternative non-writing support increases engagement. Clinical input should review contraindications and mechanisms; user feedback alone cannot establish clinical efficacy.

The existing `docs/integrated-console-workbooks.md` documents the separate written intervention chooser.
