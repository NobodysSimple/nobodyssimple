# Stage 0 test record and reproduction

Baseline: `a05d5b656a539360345c470b723776970adfe2ff`. Runtime: Node v24.22.1. Tests ran on an unchanged checkout; only `docs/` was added. Results are factual observations, not a release certification.

## Executed checks

| Command | Outcome | Evidence / practical limit |
|---|---|---|
| `npm test` | **5 passed, 1 failed** | `evidence/unit.log`. Invalid theme expectation `system`, actual `light`, in `tests/free/policy.test.mjs:13`. Other assertions after that point in the same test did not execute |
| `npm run check` | **Passed** | `evidence/check.log`. Syntax and targeted account/script/cache string checks; not broad functional coverage |
| `node tests/verify.mjs` | **Failed** | `evidence/verify.log`. First assertion expects 52 weeks, actual 0. No claim that later assertions ran |
| `ACCOUNT_TEST_MODULES=<scratch deps>/node_modules node tests/free/dom-check.mjs` | **Passed** after dependency installation | `evidence/account-dom-retry.log`. Ten guest route requests (including restricted-route fallbacks) and ten stub-signed-in sections, sign-in/create mode, 18 avatars, profile save and dark/Spanish preferences. Uses SDK doubles; no real OAuth or Firestore |
| `AUDIT_MODULES=<scratch deps>/node_modules node docs/redesign/scripts/inventory.mjs` | **Passed** | `evidence/inventory-run.log`, JSON and CSV outputs. Parses all baseline JS/CSS; inventories routes, metadata and static dependencies |
| `AUDIT_MODULES=<scratch deps>/node_modules node docs/redesign/scripts/render-smoke.mjs` | **124 pass / 1 static link / 0 failures** | `evidence/render-smoke.json`. 103 catalogue entries, 14 life systems, questionnaire catalogue and three questionnaires, SimplyFocus, Help, Tools, Maps = 125 entries. Stim Space iframe link is not rendered in jsdom |
| `node docs/redesign/scripts/storage-scope-baseline.mjs` | **Baseline characterized** | `evidence/storage-scope-baseline.json`. Tests all 23 registered keys and reproduces three unregistered key gaps; expected bad behavior is not a green release gate |
| Browser Home / Learn / reference prototype | **Inspected and captured** | Home 390/1440; Learn 390; prototype’s Inferred choice showed explanatory feedback and navigated to alternatives. No production form submitted |
| Baseline file SHA-256 comparison | **Unchanged source required for delivery** | `evidence/source-integrity.json`; all 219 baseline tracked files must match inventory hashes |

The first account DOM attempt failed because jsdom was absent (`evidence/account-dom.log`). Dependencies were installed only in scratch: `jsdom@26.1.0`, `acorn@8.14.0`, `postcss@8.5.3`. No runtime dependency, package manifest or lockfile was changed in the app.

The renderer test substitutes canvas, audio, dialogs and browser APIs. A heading and control count demonstrate that the initial renderer executes; they do **not** demonstrate correct scoring, complete interaction, audio output, draft restoration, accessible layout or clinical effectiveness. The generic draft wrapper does not guarantee preservation of custom canvas/derived state.

## Reproduce locally

Use the pinned baseline or apply the docs-only patch to it. From the repository root, install temporary audit dependencies outside the application and run:

```bash
npm install --prefix /tmp/ns-stage0-deps --ignore-scripts --no-audit --no-fund jsdom@26.1.0 acorn@8.14.0 postcss@8.5.3
npm test
npm run check
node tests/verify.mjs
ACCOUNT_TEST_MODULES=/tmp/ns-stage0-deps/node_modules node tests/free/dom-check.mjs
AUDIT_MODULES=/tmp/ns-stage0-deps/node_modules node docs/redesign/scripts/inventory.mjs
AUDIT_MODULES=/tmp/ns-stage0-deps/node_modules node docs/redesign/scripts/render-smoke.mjs
node docs/redesign/scripts/storage-scope-baseline.mjs
```

Run commands independently so an expected baseline failure does not hide later results. The inventory script pins the baseline file list but reads working files: regenerate only against that baseline for identical evidence. Test the candidate separately when implementation begins, retaining the baseline inventory for comparison.

## Browser evidence method

An isolated preview copy of tracked source was served locally. `evidence/audit-frame.html` documents the sizing harness. The app itself was not edited. Width and height parameters establish iframe CSS dimensions; 1440px was displayed at scale 0.9 so its complete width fits the browser capture. Native desktop scrollbars reduce inner content width by about 15px. No mobile user-agent, touch, safe-area, keyboard or device emulation was available through the exposed browser API. Captures are unaltered JPEG browser screenshots with surrounding browser whitespace.

The earlier screenshot-region API timed out. The supported full-window screenshot API succeeded. During continuation the preview process had stopped; it was restarted and a fresh permitted HTTP tab used. An obsolete browser error page could not be observed because its protocol was blocked; it was not used as evidence. No screenshot cropping or synthetic rendering was used to imply a functioning redesign.

## Not run / not verified

| Area | Remaining verification |
|---|---|
| Firestore emulator | `tests/free/emulator-check.mjs` requires rules-unit-testing and an emulator; not available/running during this audit |
| Live account operations | Real email/Google login, verification, password/provider changes, sync conflicts across real devices, export and deletion; no live user data changed |
| Community | Real attachments, posting, replying, moderation, blocking, reports and direct-message delivery; only source/read behavior inspected |
| Every tool completion | Deep interactive/scoring/output tests for every custom renderer; current smoke proves initial rendering only |
| Audio and sensory | Actual sound, audio cleanup, touch/canvas behavior, reduced motion and keyboard alternatives on real devices |
| Accessibility | Full keyboard traversal, screen-reader sessions, measured contrast and 200%/400% zoom; no WCAG conformance claim |
| PWA | Clean and warm offline startup, install/update, cache failure, disconnected auth and user-data persistence on iOS/Android |
| Content validity | Clinical/educational validity review of existing questionnaires and forthcoming lessons; source presence is not validation |
| Performance | Network waterfall, compression, real load timings and interaction latency; file sizes are uncompressed source bytes |

## Required regression cases for later stages

| Boundary | Cases that matter |
|---|---|
| IDs and routes | All baseline tool IDs + redirects; encoded/malformed/unknown IDs; every new nested path; direct load, reload, Back/Forward, nav highlight and heading focus |
| Home and recommendations | Six primary choices, all additional situations/subparts, multi-selection, each goal/capacity state, skip/back/change answers, lead + two real alternatives |
| Tools catalogue | Search, each theme, A–Z, time/format, combined filters, zero result, favourites, recent opt-in, keyboard controls, correct deep link |
| Persistence | Guest/A/B isolation; shared-device session; lock; empty/corrupt/old data; export/import; no silent ownership assignment; offline queue, conflict, delete/tombstone, pending edit |
| Learn | Published vs planned, no resume without a record, explicit completion/bookmark vs automatic history preference, absent/removed content, reviewed feedback |
| Lab | Selection and correction, unknown answer, back/skip/exit, reload/version change, no forced response, no fictional outcome, tap/keyboard alternative to drag |
| Guide | Explicit reviewed save, context/tags, edit/delete/export, private default, migration idempotence, consented sync and restricted owner access |
| Shell accessibility | 320/360/390/430/768/900/1280/1440 widths, long labels, text scaling, dark/high contrast, reduced motion/low-stim, safe area and focused control visibility |
| Lifecycles | No orphan timer/audio/listener/observer after route exit; no duplicate art on re-render; iframe bridge respects current account prefs |
| Publication/PWA | Original post IDs/body blocks, safe external links, editor backups, content conflicts; cache completeness, query handling, update and rollback |

Keep stage checks proportional to the actual change. Do not use the entire future matrix to delay a small reversible shell commit, but do not claim unexecuted coverage.
