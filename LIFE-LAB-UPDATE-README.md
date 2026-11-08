# The Journey — v137 update

The Journey replaces the visible Life Lab name. Existing #lab links and saved lesson progress remain compatible.

## Upload to GitHub
1. Extract this ZIP.
2. Upload its contents to the root of NobodysSimple/nobodyssimple on main, preserving the folders and replacing matching files.
3. Commit the upload and wait for the existing hosting deployment.
4. Reload the app and open #lab. The service-worker version is v137-the-journey.

Upload the extracted contents, not the ZIP or an extra enclosing folder. This is an update overlay for the existing repository, not a standalone site. It includes the earlier Life Lab rebuild and worlds update. No new build step or paid service is required. Nothing has been published automatically.

## What changed
- Incorrect learning-check answers now require a corrected attempt before advancing.
- A current-chapter view replaces the overwhelming full trail by default; the full forty-unit world map remains available.
- Stone icons remain visible in locked and completed states.
- Forty authored opening-chapter situations, accessible hints and worked examples.
- Twenty companion stories with five persistent stages each, choices, later dialogue and visible meeting/practice places.
- World restoration, small discoveries, visitors and chapter festivals every eight units.
- A shared progression model: XP/levels, Trail Gems, 25 achievements, mission and chapter badges.
- A cosmetic wardrobe/shop, equipment, trail outfits and a homebase with collectible decorations.
- Flexible weekly goals by default, daily or no-streak options, daily discovery, spaced retrieval and weekly quests.
- Optional partner quests for two people taking turns on the same device.
- Quieter visuals, reduced animation, untimed play, optional sound and reward-display controls.
- Optional evaluation records and export, without a new analytics service or collection of reflection text.

## Saving and sync
Journey records use the existing account-scoped learning store. Account syncing remains opt-in through the existing saved-work settings. Compatible completion and Journey events merge; unknown conflicts still use the account conflict-review flow. Cosmetic purchases reconcile deterministically, never taking the balance below zero. Existing progress supplies XP and gems without replaying reward grants.

## Scope and validation
The first eight units of each world now use authored situations. Later units still use shared game scenarios with unit-specific learning checks; this is not 2,000 separately authored games. Partner play is local, not online matchmaking. Live multi-device Firebase testing was not performed; the account-sync path was verified using automated transaction/conflict tests. No mental-health or retention improvement is claimed.

Run node --test tests/free/*.test.mjs and node tests/free/check.mjs.
See docs/JOURNEY-EVOLUTION.md for the feedback checklist and technical notes.
