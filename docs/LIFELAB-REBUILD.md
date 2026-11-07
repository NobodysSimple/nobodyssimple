# Life Lab rebuild

## Scope

Replaces the overlapping trail enhancement scripts with one renderer at the existing `#lab` routes. The rest of the application and the original six-stage Reality Sorter route are retained. The old trail modules remain available for legacy consumers but no longer enhance the new map.

The five worlds use the names, destinations, colors and learning rhythm in the four supplied resource sheets. Canonical URLs are `#lab/forest`, `#lab/garden`, `#lab/harbour`, `#lab/forge`, and `#lab/observatory`; the older meadow/bridge/workshop URLs still resolve.

## Files

- `ns-lifelab-content.mjs`: existing 200 unit titles, 200 new teaching points and practical exercises, 2,000 lesson records, five stones per unit, question construction.
- `ns-lifelab-state.mjs`: lesson completion, prerequisites, legacy record compatibility and storage errors.
- `ns-lifelab-v3.mjs`: selector, all forty units, stone previews, lesson start, questions/feedback, capstones, application, completion, review and encounters.
- `ns-lifelab-v3.css`: isolated responsive styles and shared path coordinates.
- `media/lifelab/`: generated flat five-world atlas and panoramic header; characters reuse the app’s existing artwork.

## Reference requirements implemented

- 5 trails × 40 units × 10 lessons = 2,000 lessons; 1,000 stones.
- Every unit visibly contains exactly five stones, grouped 3/3/2/1/1.
- Learn, Practise, Compare, Capstone, Apply order.
- Five final destinations, centered unit cards and varied harmonious stone colors.
- Path and stones share one 480 × 840 coordinate system and scale together.
- Background artwork is cropped proportionally, never stretched to path coordinates.
- Locked, current/in-progress and completed states; completed stones are green.
- Only multi-lesson stones have segmented rings; segments use actual saved lessons.
- Sequential unlocks, a current Nobody and a Continue control.
- Unit selector provides direct navigation to all forty units.
- Preview → start → question → feedback → completion → updated preview.
- Three-step capstone mission, application text prompt, and completed lesson review.
- Opening a lesson, selecting an answer, and reaching the completion screen do not save progress. Done/Claim Badge saves standard/capstone lessons; Complete saves an application lesson.
- Application text is transient and is not persisted or transmitted.
- Storage errors leave the lesson open and explain that saving failed.
- Optional Nobody encounters every fourth unit.
- Keyboard controls, native dialog focus containment, Escape to close, focus restoration, reduced-motion support and mobile layouts.

## Editorial and visual fidelity limits

This is a playable implementation, not a claim of pixel-identical reproduction or a fully bespoke published psychology curriculum. The supplied sheets contain design requirements and example screens, not 2,000 complete lesson scripts. Each unit has its own teaching point and exercise, but questions use shared instructional templates. The capstone scenarios and encounter prose also use shared patterns. An editorial pass should replace these templates with richer unit-specific stories and plausible distractors before treating the course as finished editorial content.

The environments are newly generated, simple 2D interpretations of the user’s later branding reference. The existing app characters are reused without replacement. Backgrounds repeat within each world. Nobody moves to the next stone with a short walking transition (disabled for reduced motion); bespoke encounter animations are not implemented. Completed capstone records serve as mission badges; there is no separate badge gallery. No new account-sync protocol is introduced: completion uses the existing local learning key.

The data model uses a unit with five stone groups containing lessons, rather than the inconsistent Stone→Lesson foreign key drawn in sheet 4. Lesson numbering remains 1–10 within each unit.

## Educational sources and review direction

The added prose is original general education, not diagnostic or treatment advice. Relevant background readings for continued editorial review:

- [Noba: Self-Regulation and Conscientiousness](https://nobaproject.com/modules/self-regulation-and-conscientiousness), for standards, monitoring and adapting action.
- [Noba: Emotional Intelligence](https://nobaproject.com/modules/emotional-intelligence), for noticing, understanding and regulating emotions.
- [Gollwitzer & Brandstätter (1997): Implementation intentions and effective goal pursuit](https://sparq.stanford.edu/sites/g/files/sbiybj19021/files/media/file/gollwitzer_brandstatter_1997_-_implementation_intentions_effective_goal_pursuit.pdf), for specific situation/action plans.

These readings support the general direction, not validation of every generated exercise. No clinical efficacy claim is made.

## Verification

Run `npm test` and `npm run check` (or their Node script equivalents). New tests check totals, IDs, 3/3/2/1/1 structure, question validity, all 2,000 sequential completions, prerequisite enforcement, idempotence, legacy records, corrupt/unavailable storage, forty-unit rendering, ring counts and shared path coordinates.

The older tests that expected five lessons per unit, removed lesson kinds, obsolete selector classes and a fixed historical cache suffix have been updated to the current resource-sheet contract.

Browser checks cover desktop and mobile, lesson preview/start/feedback, abandonment without saving, explicit saving and review. The local test origin is separate from the live site.

## Artwork provenance

Environment art generated with the built-in imagegen tool using the later Nobody’s Simple brand illustration as a style reference. The earlier detailed painterly art and generated scarf mascot are excluded from this release.

Atlas prompt: five equal-width flat paper-cut Forest/Garden/Harbour/Forge/Observatory panels, muted sage/rose/blue/ochre/lavender, warm cream paper grain, simple silhouettes, no realistic lighting or 3D, sparse scenery at edges and an open middle for a coded path, no UI or characters.

Header prompt: a new panoramic composition with simple sage hills, triangular evergreen trees, mustard winding path, angular mountain and ochre sun; calm ivory negative space on the left for HTML text; flat shapes and subtle grain; no text or character.
