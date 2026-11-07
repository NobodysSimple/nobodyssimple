# Nobody's Simple — Life Lab update

## Install on your existing GitHub site

1. Extract `Nobodyssimple-LifeLab-Update-2026-11-07.zip` on your computer.
2. Open the **root** of `NobodysSimple/nobodyssimple`, on `main`.
3. Choose **Add file → Upload files**.
4. Drag the extracted files **and folders** into the upload area. Keep `media/lifelab`, `docs`, and `tests/free` intact. `index.html` must be at the repository root, not inside another update folder.
5. Commit the upload to replace the matching files and add the new ones. Existing unrelated files stay in place.
6. Let your existing website publishing process finish, then open `/#lab`. Refresh once if an older page is still open.

Do not upload the ZIP itself as the website update: GitHub does not unpack it into your source files.

No package installation, build step, database migration, API key, or new hosting service is required. This is a static HTML/CSS/JavaScript update for the existing site. It was prepared against main commit `da0fe5951143b036e4a27b10b157cdaa121e873f`.

## Included

- One shared responsive trail renderer for all five worlds.
- Simplified 2D environments based on the later branding reference, with the app's existing Nobody characters.
- Forty units per world; five stones per unit; 3/3/2/1/1 lesson grouping.
- 2,000 playable lesson slots using 200 unit-specific teaching points and practical exercises with a shared question format.
- Previews, questions, feedback, three-step capstones, written applications, explicit saving, review, sequential unlocks, encounters, and final destinations.
- Existing completed lesson records remain readable. New progress uses the existing device learning store.
- A service-worker cache version update.

The course expansion uses shared exercise templates; it is not 2,000 individually written narrative lessons. See `docs/LIFELAB-REBUILD.md` for the implementation checklist, artwork prompts/provenance, educational review notes and remaining fidelity limits.

## Verification

- JavaScript syntax and project checks passed.
- All 53 automated tests passed, including completing every course in sequence, storage failures and old progress records.
- Browser checked on desktop, 390 px and 320 px mobile layouts.
- Browser completed an entire ten-lesson unit, including the capstone and application; verified abandonment does not save progress, Done does save it, reload preserves it, and the next unit unlocks.

The ZIP is an update payload, not a standalone copy of the entire website. Apply it over the existing repository.
