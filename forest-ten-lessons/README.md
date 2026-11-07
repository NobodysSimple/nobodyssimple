# Nobody's Simple — Forest-only 10-lesson stepping stones

**Target:** `NobodysSimple/nobodyssimple`, default-branch snapshot from 6 November 2026.
**Scope:** the **Forest** Life Lab only. The other four worlds and the Forest's illustrated background, winding path, scene size, stone positions, and original icons are not altered.

## What this changes

- **40 Forest units × 10 lesson slots** (rather than five). Unit 1 has **ten playable lessons**; Units 2–40 are still labelled as *planned* because their activities have not yet been authored. The interface never pretends 390 missing lessons are playable.
- Unit 1 keeps its **same three stepping stones and same icon artwork**. Each stone now has a small ring of completion dots: **4 + 3 + 3 lessons**.
- Pressing a stone opens the **next unfinished lesson on that stone**. Complete the remaining activities on that stone before moving to the next. A completed stone can be replayed.
- **Seven new interactive micro-lessons** use simple everyday scenarios, multiple options, explanatory feedback, and an optional real-world transfer task.
- The existing **Reality Sorter mission**, **Reality Map** and **Assumption Finder** remain in the course as the other three activities. The original mission is still six stages long.
- Only explicit lesson completion is saved to `ns-account-learning-v2`. The seven new micro-lessons require the learner to identify the most defensible answer before the Finish button enables. Existing legacy stone completions are honoured, and other saved learning records are retained.

## Apply to your GitHub repository (Windows)

1. Download the ZIP and extract it **next to** your local GitHub repository folder (not on top of it).
2. Open PowerShell in the extracted `forest-ten-lessons` folder.
3. Run the preview, replacing the repo path with your actual local clone:

   ```powershell
   py .\apply_forest_lessons.py --repo "C:\path\to\nobodyssimple" --check
   ```

4. Apply the changes:

   ```powershell
   py .\apply_forest_lessons.py --repo "C:\path\to\nobodyssimple"
   ```

5. In the repository folder, run:

   ```powershell
   node --test tests/free/*.test.mjs
   git diff --check
   git status
   ```

6. Review the Forest in the app and commit/push the changed files to GitHub, or upload the changed files on GitHub's website. **Do not upload the ZIP itself as the app update**: the script must first be applied to the repository files.

The installer validates required anchors before writing, and stores originals in `forest-ten-lessons/backups/` for recovery. It will stop rather than silently patch the wrong code if the repository has been changed incompatibly.

## Files involved

Existing files patched: `ns-living-trail.mjs`, `ns-life-lab.mjs`, `ns-forest-curriculum.mjs`, `index.html`, `tests/free/forest-trail-fidelity.test.mjs`.

Files added: `ns-forest-micro-lessons.mjs`, `ns-forest-lessons.css`, `tests/free/forest-ten-lessons.test.mjs`.

No artwork or existing trail CSS file is replaced. The tiny new stylesheet is scoped to `[data-trail-world="forest"]` for path indicators and the dedicated mini-lesson UI.

## Important constraints

- The GitHub connection used to inspect the repository returned **403 Resource not accessible by integration** when attempting to create a feature branch. This ZIP therefore contains the changes for local application; it has **not** been pushed to GitHub.
- Code was syntax-checked and the curriculum shape was verified, but a live browser/mobile regression test remains necessary after installation.
