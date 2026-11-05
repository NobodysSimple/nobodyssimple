# Nobody’s Simple — Stage 0 redesign audit

**Audit date:** 5 November 2026. **Scope:** source audit and implementation preparation only.

**Baseline:** GitHub `main`, commit `a05d5b656a539360345c470b723776970adfe2ff`, tree `99caa851d4d2582b4f1133364e7ff148aa52df8b`. Local branch: `redesign/living-field-guide`. No application source, published content, account data or Firestore rules changed. No deployment performed. The connected GitHub integration returned HTTP 403, “Resource not accessible by integration,” when creating the remote branch; the audit is delivered locally with an applicable patch.

## Decision

Retain the current native JavaScript application and its working renderers. Build the five-destination shell around explicit route and storage contracts, then replace each experience in the written stage order. A framework rewrite would enlarge the preservation problem without solving the immediate navigation, hierarchy or consistency problems.

The primary redesign opportunity is a change in the product’s interaction model: one clear starting action, short practice with explanatory feedback, and an optional user-owned record. A new illustration layer alone will not produce that experience. The current application already has considerable original artwork; its competing layout and rendering systems prevent that artwork from forming one coherent interface.

Stage 0 has produced the source inventory, preservation matrix, dependency map, baseline tests and screenshots. It has **not** certified every workflow, live account operation, accessibility requirement or offline state. Existing test failures and unverified areas below remain explicit gates for later work. Stage 1 is not started.

## Read this package

| Deliverable | Contents |
|---|---|
| [Dependency map and stage plan](redesign/dependency-map.md) | Current module dependencies; proposed implementation order and exit criteria |
| [Full route and data appendices](redesign/appendices.md) | All 35 handler names, 103 catalogue entries, 14 life systems, preferences, saved keys, content and file manifest |
| [Tool catalogue CSV](redesign/tools.csv) | Stable ID, displayed title, actual route, source, renderer and storage notes for every visible entry |
| [Storage CSV](redesign/storage.csv) | 45 source key/prefix/template patterns, registration status and exact source locations; these are not 45 independent data types |
| [Machine-readable inventory](redesign/inventory.json) | Import graph, source declarations, CSS rules of interest, schemas, content, routes and SHA-256 file manifest |
| [Tests and reproduction](redesign/test-matrix.md) | Exact commands, actual outcomes, limitations and future regression gates |
| [Evidence](redesign/evidence/) | Original test logs, JSON results and browser captures |

## Reference authority and review

Read the complete `00_START_HERE.md`, Master Build Brief, Screen and Route Atlas, Stage-by-Stage Prompts, Visual Reference Guide, References and QA, and supplied prototype test report. Inspected the supplied prototype source and its Lab → Reality Sorter → alternatives interaction in the browser. The self-contained HTML and packaged prototype were equivalent after normalising the embedded mascot image. The handoff’s own test report is reference material, **not** evidence that the existing app passes those tests.

Reviewed the supplied concept sheets, wireframes and desktop directions. Existing app source determines what currently works; the written brief and atlas determine intended behavior and route hierarchy. The concept sheets are the visual target for the premium cream/forest-green, serif/sans, hand-drawn world and mascot treatment. The prototype supplies layout and interaction examples; its simplified widgets, example records and placeholder functionality must not be copied into production as real data. Keep all interface text as HTML.

Where the boards differ from the written specification, follow the written specification: five primary destinations in the order **Home, Lab, Learn, Tools, You**; seven Tools themes rather than the six pictured on one board; the written stages 0–8 rather than a poster’s illustrative roadmap. `#account` remains You’s real route. Existing `#learn/<shelf>` routes already work in this baseline despite the atlas’s historical warning; nested lesson routes do not. The audit is based on the current source, not that older statement.

One separately attached image, `image(20261105-012134).png`, was unavailable in the workspace. The named handoff and concept sheets were available. No claim is made to have reviewed the missing image. Exact source coverage and reference hashes are in [appendices](redesign/appendices.md) and [reference manifest](redesign/reference-manifest.json).

## Baseline inventory

| Area | Verified source inventory | Interpretation |
|---|---:|---|
| Tracked repository files | 219 | File hashes and review method recorded; not every binary was visually inspected |
| Main router handler names | 35 | Plus redirects, aliases and standalone HTML entry points |
| Visible Tools catalogue | 103 | 81 entries from the written/custom registry + 22 interactive entries |
| My Maps utility | 1 | The written registry has 82 entries including `maps`; it is excluded from the visible Tools count |
| Targeted tools | 24 | Included in the 81; not an additional set |
| Guided life systems | 14 | Separate `#guided/<id>` flows, seven questions each |
| Questionnaire entry points | 3 | Big Five, Systems, and the 100-situation Personality questionnaire |
| Help Me Choose situation definitions | 12 | Six initial tiles plus additional situations/subparts; preserve full logic |
| Account saved-work registry | 23 keys | Matched by the Firestore known-key list |
| Account default preferences | 26 | Preserve values, defaults and effective backend limits |
| Published repository posts | 4 | Three announcements and one blog post; no published lessons or media courses |
| Curriculum structure | 4 quarters / 12 modules / 0 weeks | A structure and preview, not a delivered course |
| Planned crash-course domains | 40 | Do not report as published learning |
| Wisbody quote deck | 200 | Existing reflection/navigation functions remain |
| Emotion definitions | 108 | Renderer applies its own filtering; preserve current behavior |
| Explicitly retired tool IDs | 21 written / 35 interactive | Not current functionality to resurrect automatically |

The earlier working count of 104 combined the visible library with My Maps. **103 is the correct visible catalogue baseline.** Initial render tests cover catalogue entries; this does not establish educational validity or end-to-end completion for every tool.

## Current architecture

The site is a buildless ES-module hash SPA. `index.html` owns the shell and loads `app-design.mjs`, `accounts.mjs` and `site.mjs`. GitHub Pages/PWA files serve the static application. Firebase 13 modules load from Google’s CDN for Auth and Firestore. The staff editor is a separate entry point and publishes repository content through GitHub.

| Module or boundary | Responsibility and coupling |
|---|---|
| `site.mjs` | Router, Learn/editorial content, post rendering, support dialog and integration with the other page renderers; waits for `accountReady` |
| `features.mjs` | Large collection of custom tools, catalogue, Help Me Choose, maps and Emotion Compass; mutates displayed catalogue names on import |
| `tool-catalog.mjs`, `targeted-tools.mjs` | Written/custom tool metadata, fields, recommendations, groups and situation definitions |
| `interactive-tools.mjs` | Interactive registry and renderers; retirement filtering; `#play/<id>` dispatch; special links to Compass and Stim Space |
| `strategy.mjs` | Current Home composition, real resume candidates, Wisbody and latest content/community shelf |
| `app-design.mjs` | Post-render DOM decoration with a document-subtree MutationObserver; icons, character artwork and secondary links |
| `accounts.mjs`, `account-policy.mjs`, `account-storage.mjs`, `account-sync.mjs` | Preferences, identity, registered local work, guest/account isolation, opt-in cloud sync, revisions, conflicts and deletion |
| `life-navigation.mjs` | Fourteen guided systems, contextual questions and saved navigation projects |
| `questionnaires.mjs`, `big-five-atlas.mjs`, `big-five-profile.mjs` | Big Five questions/results/manual and an embedded Systems implementation |
| `personality-test.mjs` | 100-situation flow, drafts, interpretation chapters, feedback, state check-ins and export |
| `simplyfocus.mjs`, `lifestyle-storage.mjs` | Sound mixer, timer, tasks/projects and task transfer to legacy Lifestyle storage |
| `nd-play.html`, `nd-play-v4.mjs`, `account-play-bridge.mjs` | Separate sensory iframe, recipes, three play modes and account preference/storage bridge |
| `community-ui.mjs`, `community-data.mjs`, `community-policy.mjs` | Discussion, profiles, replies, attachments, reactions, reports, moderation and direct messages |
| `content.json`, `data.mjs`, `crash-topics.mjs` | Published content, curriculum structure, emotions/questions and planned topics |
| `staff.html`, `studio.mjs`, `publisher.mjs` | Editor, previews, drafts, versions, asset uploads, imports/exports and conflict-aware GitHub publishing |
| `sw.js`, manifest and icons | Installation shell, cache versioning, network-first eligible requests, cache fallback and notification navigation |

There are multiple historical implementations: old Home functions alongside current `strategy.mjs`; a standalone `systems-questionnaire.mjs` alongside the active embedded implementation; older Stim scripts alongside v4; unused Lifestyle/intervention-book and UI resource files. Import reachability is evidence, not permission to delete: standalone links and older user records may still depend on them. The audit records explicitly retired catalogue entries separately from working routes.

## Preservation matrix

| Existing capability | New home | Preserve exactly during migration | Dependency / validation |
|---|---|---|---|
| Home and Help Me Choose | Home / `#navigate`, `#help` | Situation/subpart selection, goals, energy, recommendation rationale and actual destinations | Stage 2; replay each situation against baseline recommendation IDs |
| All 103 catalogue entries | Tools | Stable IDs, aliases, fields, custom output, warnings and save/export behaviors | Stage 3 changes discovery; Stage 7 changes individual wrappers; compare `tools.csv` |
| Fourteen guided systems | Tools and relevant Lab links | Context, seven-question flows, project records, revisit/edit actions | Do not rename to Lab missions without implementing mission behavior |
| Emotion Compass, questions, navigator | Tools; relevant Home entry | Emotion selections, prompts and next-step routes | Preserve `#compass`, `#questions`, `#navigator` |
| Big Five, Systems, Personality | You → Questionnaires; contextual Tools links | Original items/scoring, uncertainty copy, drafts, result sections, feedback, exports | Stage 7; keep custom questionnaire outputs distinct from user-written Guide entries |
| Maps, projects, favourites, recent, drafts | You; optional Home resume | Original schemas, IDs, explicit saves and opt-ins | No overwrite or automatic conversion into new Guide claims |
| Published writing and announcements | Learn / Latest | Four original IDs, body blocks, dates, media, links and comments | Preserve `#post/<id>`, `#blog`, `#writing` |
| Courses, crash topics, videos, audio, stories, debates | Learn shelves | Published/planned distinction, available filters, links and honest empty states | Stage 4; no synthetic completion or fake lesson counts |
| Wisbody and quote reflections | Home compact / full Wisbody | 200 quotes, next/previous, reflection save controls | Preserve `#wisbody` and `#library/quotes` |
| SimplyFocus | Tools / You utility | Eleven audio assets, mixer save/load, master sound, timer, alarm, tasks/projects and transfer | Fix registry gap before any new storage migration; do not call ambient audio a course |
| Stim Space | Tools / You utility | Bubble Pop, Big Music Board, Touch Garden; motion/sound/repetition/unpredictability/brightness/input controls, pause, recipes | Iframe account bridge, low-stim and tap behavior; v4 is active |
| Account/profile/settings | You | All ten sections, 26 settings, guest use, profile/nickname/avatar and privacy controls | No auth rewrite in shell stage; test guest and signed-in states separately |
| Authentication/security | You | Google and email sign-in, create/reset/verify, provider linking, reauthentication, email/password changes, app visit/session controls | Source present; real OAuth and destructive flows not exercised |
| Saved-work sync/export/delete | You | Per-key consent, guest import, pending edits, conflicts, revisions, tombstones, lock, shared-device behavior | Registered keys are covered; three source storage gaps require explicit correction plan |
| Discussion/messages/member profiles | You; direct links still work | Posts, replies, attachments, reactions, reports, blocks, conversations, moderation and permission boundaries | Firestore rules + Auth; never use synthetic people/messages as live state |
| Post comments | Learn article | Existing signed-in participation, moderation/report behavior | Preserve comment anchors and content IDs |
| Feedback/volunteer/team/about | Secondary links / footer | Current forms, links, project information and destinations | `#community` is feedback, not the discussion board |
| Help/referrals | Persistent header | Region-aware support routes, urgent help visibility and existing copy | No progression/sign-in gate; verify destinations before future publication |
| PWA install/offline | Secondary utility + shell | Existing manifest/start behavior; update semantics; saved-work availability | Cache/import gaps identified; real-device offline validation required |
| Staff publishing | Existing staff entry | Drafts, versions, snippets, notes, templates, export/import, safe preview, assets, content publishing | Isolated from consumer redesign; never move token into persistent storage |

### Account truth and storage risks

`Workspace.install()` intercepts localStorage operations **only for keys in `SAVED`**. Signed-in work uses `ns-work-v2:<uid>:<key>`; guests retain original keys. Shared-device mode uses session storage for registered work. Sensitive lock, exported work enumeration, per-key sync and account clearing are built around the same registry. SavedSync has an offline pending queue, revision conflict handling and tombstones; the existing sync tests exercise these with doubles.

| Unregistered source key | Actual use | Consequence demonstrated in disposable storage |
|---|---|---|
| `ns-simplyfocus-recipe-v2` | Active mixer saves in `simplyfocus.mjs`; registry/rules still name v1 | Not account-scoped, not in registered work export/sync, not protected by Workspace lock or removed by `clearUser` |
| `ns-big-five-atlas-v1` | Explicitly saved Big Five atlas/manual | Same gap; a psychologically meaningful saved record needs explicit migration handling |
| `ns-lifestyle-tasks-v1` | Task-transfer destination reachable from SimplyFocus via `lifestyle-storage.mjs` | Same registry gap, with a legacy destination that is not a current route |

The synthetic scope probe reproduced all three gaps and verified isolation/lock behavior for all 23 registered keys. This is a local behavior finding, **not evidence of a remote data breach**. The router also blocks Big Five and several other activities when locked; the probe establishes the underlying storage gap, not a bypass of that route guard. SimplyFocus is absent from that router lock list. Do not silently assign unscoped data to whichever user signs in next: the eventual repair needs an explicit preview/import decision, preserved original data and tests for shared devices.

Other storage includes per-user/guest preferences, tool-history consent, device ID, sync selections/pending queue, migration flags and the `ns-shared-device` session flag. Legacy intervention and Lifestyle keys remain recorded. The staff editor uses IndexedDB `nobodyssimple-creator` version 1 with `drafts`, `versions`, `snippets`, `notes`, `templates`. Its GitHub token exists only in page memory. A string `nobodys-simple-creator-v2` is an editor schema marker, not a localStorage record. Firebase also manages its own persistence internally; its provider stores must not be renamed or cleared by app migrations.

Some settings exist as schema fields but are constrained by the current free-plan implementation. In-app authenticator enrollment is **not available** in the current security UI despite imported MFA symbols. Scheduled push/email delivery is not implemented; calendar export is distinct. Backend settings force retention to 0 and reminder/reply/mention flags off. Preserve these limitations honestly. The existing default migration also changes some sound settings; future visual work must not introduce additional preference resets.

## Findings in priority order

| Priority | Finding and evidence | Required response |
|---|---|---|
| P0 — before new persistence | Three user-data keys bypass the registered workspace boundary; exact key and source references above | Separate, tested storage correction and migration design before Lab/Guide saves; no destructive automatic reassignment |
| P0 — before route changes | `site.mjs` splits the hash into only `[name,id]`; nested mission/lesson/Guide paths cannot work through this parser | Add a backward-compatible parser and route contract, including invalid IDs, reload, Back and active destination |
| P1 — foundation | Five active stylesheets total 682,937 bytes, with 6,456 rules and 235 `!important` declarations | Token/component ownership and scoped migration; do not append another large override sheet |
| P1 — mobile Home | 390px capture shows multi-line word breaks inside six narrow choice cards; the next action is below the initial viewport | Stage 2 moves wizard out of the Home hero and gives Home one clear starting CTA |
| P1 — navigation | Current mobile order is Home, Tools, Learn, Focus, You; desktop primary/secondary structure differs | Exactly Home, Lab, Learn, Tools, You on both; utilities remain reachable |
| P1 — nav cascade | Earlier 4-column and later 5-column declarations coexist in `app-design.css`; computed 390px layout is already one row of five | Do not report the older 4-column rule as the effective bug; preserve the observed result while consolidating |
| P1 — lifecycle | `app-design.mjs` decorates rendered DOM asynchronously; page renderers also own artwork and markup | Give each component one render owner; replace observer decoration incrementally with equivalent output |
| P1 — test baseline | `npm test`: 5 pass, 1 fail. `tests/verify.mjs`: fails at first assertion | Reconcile intended defaults/content expectations in a separately scoped change; no fabricated curriculum to make tests green |
| P1 — offline | Five reachable modules absent from SW shell; Firebase CDN imports outside same-origin cache; CSS query bypasses cache | Define and test an honest offline contract before claiming offline readiness |
| P1 — accessibility | Small navigation labels, dense card text, route focus/history shortcomings; preference support spans several files and iframe bridge | Keyboard, text zoom, low-stim, reduced-motion and screen-reader checks at each stage; no compliance claim from screenshots |
| P2 — content model | No published course lessons despite substantial topic and curriculum scaffolding | Learn must show accurate empty/planned states; one reviewed demonstration lesson comes in Stage 4 |
| P2 — discoverability | Catalogue format/time metadata is partly inferred, and `#tools/<theme>` does not currently select a theme | Curate metadata, implement filter deep links and keep direct tool routes; do not invent durations |
| P2 — CI | `.github/workflows/blank.yml` checks out source and echoes placeholders | Replace with meaningful automated gates when implementation begins |
| P2 — asset delivery | Extensive art/audio and eager SW shell; shell-listed files total 31,670,028 bytes | Responsive crops, small icon assets and deliberate lazy loading; measure actual network transfer separately |

Priority expresses sequencing for this redesign, not a scored security or clinical assessment.

### CSS and renderer conflicts to resolve deliberately

The active load order is `styles.css` → `account.css` → `strategy.css` → `community.css` → `app-design.css?v=debug-123`. `styles.css` has 4,836 rules; `app-design.css` adds 1,153. The inventory captures every parsed stylesheet and declarations matching navigation, Learn cards, Wisbody, focus tasks, themes and low-stim selectors.

The app-bottom-nav’s earlier four-column rule is superseded by a later five-column rule. The observed 390px frame gives five equal cells; labels are about 9px in that environment. The result is a small-type/order issue, not a currently reproduced two-row nav. Do not remove rules solely from source order without testing specificity, media conditions and preference overrides.

Recent final overrides already remove some Learn card pseudo-elements and alter Home Wisbody and task grid layouts. Those fixes must be preserved and verified, not described as absent. The Learn screenshot still shows oversized repeated category cards and repeated reading mascots, consuming most of the first viewport before meaningful available learning. Home combines a brand title, an illustrated console, supporting artwork and additional sections; the new hierarchy should make illustration support the action rather than compete with it.

Router rendering replaces page DOM and calls scroll-to-top, but does not establish a consistent route-heading focus contract or restore catalogue browsing state on Back. `learn` shelf state partly lives in memory; `#tools/<theme>` ignores the extra segment. Unknown paths fall back to Home. New routes must fail honestly rather than silently pretend a mission or lesson exists.

## Firestore and PWA boundaries

Preserve the existing owner, verified-identity, lock, revision, moderation and rate-limit checks. The current rules enumerate `users/<uid>/savedWork`, profiles/nicknames, account/community settings and rate records, devices, blocks, notifications, `accountSecurity`, `siteAdmins`, comments/reports, community members, board posts with attachments/replies/reactions, conversations/messages, board reports and community bans. Collection-group cleanup queries support account deletion. [Appendices](redesign/appendices.md) list the rule paths. No rules were deployed or changed; emulator/live permission coverage remains unverified.

The service worker uses version `nobodyssimple-v123-debugging`, a fixed SHELL list and network-first handling for eligible same-origin URLs. The allow check rejects any query string. Consequently `app-design.css?v=debug-123`, requested by the page, bypasses the worker although an unqueried CSS file is precached. `crash-topics.mjs`, `targeted-tools.mjs`, `big-five-atlas.mjs`, `big-five-profile.mjs` and `lifestyle-storage.mjs` are reachable but absent from SHELL. No shell file is missing from disk, but that does not mean all required imports are cached. Browser HTTP cache may mask the defect; a clean/warm offline experiment is still required. External Firebase modules and account readiness add another startup dependency.

## Baseline evidence

These are captures of the **unmodified application**, not redesign mockups.

| Capture | Method and useful observation |
|---|---|
| [Home at 390px](redesign/evidence/home-390-browser.jpg) | 390 × 844 CSS-pixel iframe; dense narrow cards and the small five-cell bottom bar |
| [Home at 1440px](redesign/evidence/home-1440-browser.jpg) | 1440 × 900 CSS-pixel iframe, displayed at 0.9 scale so the full width fits in the capture; large console and crowded secondary rail |
| [Learn at 390px](redesign/evidence/learn-390-browser.jpg) | Same mobile-size frame; repeated large cards and limited first-screen utility |

The browser API did not expose device/viewport emulation, so an isolated preview harness set iframe CSS dimensions. Desktop scrollbars reserve about 15px inside the frame. These are responsive layout checks, **not** iPhone/Android hardware, safe-area, software-keyboard or touch verification. The surrounding white space belongs to the capture browser, not the app. Production files were copied unchanged into the preview; the harness is not an application change.

| Check actually run | Result |
|---|---|
| Existing `npm test` | 5/6 pass; invalid-theme fallback expects `system`, code returns `light` |
| Existing `npm run check` | Pass; syntax and specific account/cache checks only |
| Existing `node tests/verify.mjs` | Fail at first assertion: curriculum weeks 0 vs expected 52; remaining assertions not executed |
| Existing account DOM check after scratch-only jsdom install | Pass for ten guest route requests (including restricted-route fallbacks) and ten stub-signed-in sections, sign-in/create modes, avatar/profile and appearance/language flows |
| New initial renderer smoke | 124 pass, 1 static iframe-link entry, 0 failures out of 125; not full tool completion |
| New storage characterization | All 23 registered keys isolated/locked; three unregistered-key gaps reproduced with synthetic records |
| Browser inspection | Home 390/1440 and Learn 390 captured; supplied Lab sorter choice showed explanatory feedback and alternatives navigation |
| Source integrity | Final delivery verifies every baseline tracked file hash remains unchanged |

No live sign-in, cloud save, community post/message, account deletion, actual audio playback, full questionnaire completion, emulator rule test, real offline install, full keyboard traversal or screen-reader session was performed. No real user record was created, edited or deleted. The full scope of each test and reproduction commands are in [test-matrix.md](redesign/test-matrix.md).

## What happens next

Stage 1 should introduce only the shared tokens, five-destination shell, compatible route handling and focus/history behavior, preserving existing content renderers. Lab and Guide links must have honest states until their stages are implemented; they must not imply available missions or records. The storage gaps should be addressed as a small separately reviewed preservation fix before any new record type is added. The [dependency map](redesign/dependency-map.md) specifies concrete gates and commits for every later stage.

The visual acceptance test will compare actual rendered screens with the supplied concept art’s composition, palette, type hierarchy, mascot and world imagery. It will also verify clear primary action, real interaction, actual data and accessible use. A screenshot can verify appearance; it cannot substitute for those functional checks.
