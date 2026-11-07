# Life Lab — Worlds update, 7 November 2026

## Install on GitHub
1. Extract this ZIP.
2. Open NobodysSimple/nobodyssimple on the main branch.
3. Upload the extracted files and folders to the repository root, preserving the media/, tests/ and docs/ paths. Replace the matching files. Upload the contents, not the enclosing folder or ZIP.
4. Commit the upload and allow the existing hosting deployment to finish.
5. Reload the site and open #lab. The service-worker cache version is v136-lifelab-worlds.

This is an update overlay for the existing repository, not a standalone replacement repository. It includes the previous Life Lab rebuild and this worlds update. No npm build or new hosting service is required. The live site has not been deployed by this package.

## Included
- Direct entry to the remembered trail; a persistent trail switcher replaces the selection screen.
- Removed the “One unit, five stones” explanation panel.
- Five worlds, forty units each, five stones per unit, 3/3/2/1/1 lessons.
- 200 deterministic, distinct vector environment compositions with matching colour boundaries. Shared scenery motifs are recomposed rather than tiling one background image.
- Five illustrated destinations and gated finale challenges.
- All twenty named companions and their supplied quotes, plus five-stage storylines.
- All twenty-four named games from the new sheets, implemented with sorting/reveal, ordering, tool selection, timed choice, and multi-step scenario mechanics.
- Per-unit learning checks and application prompts, explicit completion saves, review, +20 lesson XP and +200 finale XP.
- Mobile controls, keyboard-accessible alternatives to dragging, pause/untimed play, and reduced-motion support.

## Art and content
The reference sheets guide the names, structure, characters, game objectives and destinations. Original simplified vector scenery and a generated companion atlas adapt those designs to the app’s requested 2D style; this is not a pixel-for-pixel reproduction of the sheets. The 2,000 lesson slots use shared game templates alongside unit-specific teaching points and checks. They are not 2,000 individually illustrated games.

Progress remains in the existing learning-record store. Game practice from the library does not award course completion. Opening a lesson or choosing an answer does not save completion. Reflection text is not retained.

See docs/LIFELAB-REBUILD.md for implementation and validation details.
