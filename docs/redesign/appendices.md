# Exact source inventory appendices


Baseline `a05d5b656a539360345c470b723776970adfe2ff`. Generated from the source audit. See the main report for behavior, preservation decisions and verification limits.


## Router handlers


| Route name | Location | Actual handler |
| --- | --- | --- |
| `#home` | `site.mjs:830` | `() => homePage({learningView:"home"})` |
| `#help` | `site.mjs:831` | `() => homePage({learningView:"home",scrollTo:"#home-navigation-console"})` |
| `#navigate` | `site.mjs:832` | `() => homePage({learningView:"home",scrollTo:"#home-navigation-console"})` |
| `#library` | `site.mjs:833` | `() => {         if(id === "quotes") wisbodyPage();         else {libraryState.view=id\|\|"home";libraryState.query="";library();}       }` |
| `#learn` | `site.mjs:837` | `() => {         if (id) libraryState.view = id;         library();       }` |
| `#blog` | `site.mjs:841` | `blog` |
| `#writing` | `site.mjs:842` | `blog` |
| `#tools` | `site.mjs:843` | `() => {         renderToolbox(main);       }` |
| `#tool` | `site.mjs:846` | `() => {         const toolId = decodeURIComponent(id \|\| "");         renderTool(main, toolId);         enhanceToolGuide(main, toolId);       }` |
| `#play` | `site.mjs:851` | `() => renderInteractiveTool(main, decodeURIComponent(id \|\| ""))` |
| `#guided` | `site.mjs:852` | `() => renderLifeNavigation(main, decodeURIComponent(id \|\| ""))` |
| `#team` | `site.mjs:853` | `() => renderTeam(main)` |
| `#simplyfocus` | `site.mjs:854` | `() => renderSimplyFocus(main)` |
| `#stim-space` | `site.mjs:855` | `renderStimSpace` |
| `#questionnaires` | `site.mjs:856` | `() => renderQuestionnaires(main)` |
| `#big-five` | `site.mjs:857` | `() => renderBigFive(main)` |
| `#systems` | `site.mjs:858` | `renderSystemsPage` |
| `#personality` | `site.mjs:859` | `() => renderPersonalityTest(main)` |
| `#compass` | `site.mjs:860` | `() =>         renderCompass(main, emotions, (e) => (selectedEmotion = e))` |
| `#questions` | `site.mjs:862` | `questioning` |
| `#navigator` | `site.mjs:863` | `navigatorPage` |
| `#about` | `site.mjs:864` | `about` |
| `#install` | `site.mjs:865` | `() => renderInstall(main)` |
| `#community` | `site.mjs:866` | `() => renderCommunity(main, "feedback")` |
| `#volunteer` | `site.mjs:867` | `() => renderCommunity(main, "volunteer")` |
| `#wisbody` | `site.mjs:868` | `wisbodyPage` |
| `#account` | `site.mjs:869` | `() => renderAccount(main, id \|\| "home")` |
| `#profile` | `site.mjs:870` | `() => renderMemberProfile(main, decodeURIComponent(id \|\| ""))` |
| `#discussion` | `site.mjs:871` | `() => renderDiscussion(main, decodeURIComponent(id \|\| ""))` |
| `#messages` | `site.mjs:872` | `() => renderMessages(main, decodeURIComponent(id \|\| ""))` |
| `#discussion-moderation` | `site.mjs:873` | `() => renderDiscussionModeration(main)` |
| `#maps` | `site.mjs:874` | `() => renderAccount(main, "maps")` |
| `#support` | `site.mjs:875` | `() => { homePage({learningView:"home"}); openSupport(); }` |
| `#watch` | `site.mjs:876` | `() => {         libraryState.view = "videos";         libraryState.query = "";         library();       }` |
| `#post` | `site.mjs:881` | `() => post(decodeURIComponent(id \|\| ""))` |


Redirects outside the handler table: `#maps` and `#tool/maps` → `#account/maps`; `#route` and `#routes` → `#home`. Unknown routes currently fall back to Home. `#lab`, `#guide` and nested lesson/mission routes are not implemented. `#learn/<shelf>` exists; `#tools/<theme>` does not apply the suffix.


Standalone entry points: `index.html` (consumer SPA), `staff.html` (editor), `admin.html` (staff redirect), `nd-play.html` (sensory iframe; active v4 script). Other tracked HTML files are listed in the file manifest and must be checked before removal.


## All 103 visible tool entries


Initial render coverage does not mean every completion path, output or stored state has been validated. Custom renderers and generic forms coexist in the written registry. The CSV and JSON provide purpose, fields and storage details. My Maps is separately preserved under You.


| ID | Display title | Route | Source / group |
| --- | --- | --- | --- |
| `state-check` | Body & State Check | `#tool/state-check` | tool-catalog.mjs / feel |
| `body-check` | Body Check | `#tool/body-check` | tool-catalog.mjs / feel |
| `mixed-feelings` | Mixed Feelings | `#tool/mixed-feelings` | tool-catalog.mjs / feel |
| `emotion-timeline` | Emotion Timeline | `#tool/emotion-timeline` | tool-catalog.mjs / feel |
| `emotion-check-in` | Feelings Check-In | `#tool/emotion-check-in` | tool-catalog.mjs / feel |
| `brain-dump` | Brain Dump | `#tool/brain-dump` | tool-catalog.mjs / think |
| `thought-map` | Thought Map | `#tool/thought-map` | tool-catalog.mjs / think |
| `reality-map` | Reality Map | `#tool/reality-map` | tool-catalog.mjs / think |
| `cbt-journal` | CBT Journal | `#tool/cbt-journal` | tool-catalog.mjs / think |
| `assumption-finder` | Assumption Finder | `#tool/assumption-finder` | tool-catalog.mjs / think |
| `rumination` | Rumination Check | `#tool/rumination` | tool-catalog.mjs / think |
| `quick-reset` | Sensory Reset | `#tool/quick-reset` | tool-catalog.mjs / calm |
| `grounding` | Grounding | `#tool/grounding` | tool-catalog.mjs / calm |
| `sensory-profile` | Sensory Profile | `#tool/sensory-profile` | tool-catalog.mjs / calm |
| `sensory-recipe` | Sensory Recipe | `#tool/sensory-recipe` | tool-catalog.mjs / calm |
| `social-battery` | Social Battery | `#tool/social-battery` | tool-catalog.mjs / calm |
| `load-balancer` | Load Balancer | `#tool/load-balancer` | tool-catalog.mjs / calm |
| `transition` | Transition Planner | `#tool/transition` | tool-catalog.mjs / decide |
| `start-starter` | Start Barrier | `#tool/start-starter` | tool-catalog.mjs / decide |
| `motivation-map` | Motivation Map | `#tool/motivation-map` | tool-catalog.mjs / identity |
| `friction` | Friction Finder | `#tool/friction` | tool-catalog.mjs / decide |
| `small-step` | Small Step | `#tool/small-step` | tool-catalog.mjs / decide |
| `if-then` | If–Then Plan | `#tool/if-then` | tool-catalog.mjs / decide |
| `decision-map` | Decision Map | `#tool/decision-map` | tool-catalog.mjs / decide |
| `future-perspectives` | Future Perspectives | `#tool/future-perspectives` | tool-catalog.mjs / decide |
| `premortem` | Pre-Mortem | `#tool/premortem` | tool-catalog.mjs / decide |
| `commitment` | Decision Review | `#tool/commitment` | tool-catalog.mjs / decide |
| `pattern-map` | Pattern Map | `#tool/pattern-map` | tool-catalog.mjs / patterns |
| `function-finder` | Function Finder | `#tool/function-finder` | tool-catalog.mjs / patterns |
| `pattern-experiment` | Pattern Experiment | `#tool/pattern-experiment` | tool-catalog.mjs / patterns |
| `conversation-map` | Conversation Map | `#tool/conversation-map` | tool-catalog.mjs / relate |
| `needs-clarifier` | Needs Clarifier | `#tool/needs-clarifier` | tool-catalog.mjs / relate |
| `boundary-builder` | Boundary Builder | `#tool/boundary-builder` | tool-catalog.mjs / relate |
| `conflict-map` | Conflict Map | `#tool/conflict-map` | tool-catalog.mjs / relate |
| `repair` | Repair Plan | `#tool/repair` | tool-catalog.mjs / relate |
| `values-discovery` | Values Discovery | `#tool/values-discovery` | tool-catalog.mjs / identity |
| `identity-map` | Identity Map | `#tool/identity-map` | tool-catalog.mjs / identity |
| `possible-selves` | Possible Selves | `#tool/possible-selves` | tool-catalog.mjs / identity |
| `personal-rules` | Personal Rules | `#tool/personal-rules` | tool-catalog.mjs / identity |
| `contradictions` | Two Truths | `#tool/contradictions` | tool-catalog.mjs / identity |
| `life-areas` | Life Areas | `#tool/life-areas` | tool-catalog.mjs / identity |
| `gratitude` | Appreciation | `#tool/gratitude` | tool-catalog.mjs / journal |
| `difficult-day` | Difficult Day | `#tool/difficult-day` | tool-catalog.mjs / journal |
| `weekly-review` | Weekly Review | `#tool/weekly-review` | tool-catalog.mjs / journal |
| `claim-checker` | Claim Checker | `#tool/claim-checker` | tool-catalog.mjs / learn |
| `evidence-strength` | Evidence Guide | `#tool/evidence-strength` | tool-catalog.mjs / learn |
| `argument-map` | Argument Map | `#tool/argument-map` | tool-catalog.mjs / learn |
| `stim-space` | Stim Space | `#stim-space` | tool-catalog.mjs / calm |
| `worry-sort` | Worry Sort | `#tool/worry-sort` | tool-catalog.mjs / think |
| `masking-map` | Masking Map | `#tool/masking-map` | tool-catalog.mjs / calm |
| `environment-design` | Environment Design | `#tool/environment-design` | tool-catalog.mjs / decide |
| `reward-design` | Reward Design | `#tool/reward-design` | tool-catalog.mjs / decide |
| `progress-evidence` | Progress Evidence | `#tool/progress-evidence` | tool-catalog.mjs / decide |
| `conflict-pattern` | Conflict Pattern | `#tool/conflict-pattern` | tool-catalog.mjs / relate |
| `positive-memory` | Positive Memory | `#tool/positive-memory` | tool-catalog.mjs / journal |
| `competing-models` | Alternative Explanations | `#tool/competing-models` | tool-catalog.mjs / learn |
| `uncertainty-calibration` | Confidence Check | `#tool/uncertainty-calibration` | tool-catalog.mjs / learn |
| `anger-pause` | Anger Pause | `#tool/anger-pause` | targeted-tools.mjs / calm |
| `resentment-load` | Fair Load | `#tool/resentment-load` | targeted-tools.mjs / relate |
| `shame-context` | Shame Check | `#tool/shame-context` | targeted-tools.mjs / feel |
| `guilt-responsibility` | Guilt Check | `#tool/guilt-responsibility` | targeted-tools.mjs / feel |
| `jealousy-request` | Jealousy Plan | `#tool/jealousy-request` | targeted-tools.mjs / relate |
| `rejection-response` | Rejection Reset | `#tool/rejection-response` | targeted-tools.mjs / feel |
| `grief-date` | Grief Plan | `#tool/grief-date` | targeted-tools.mjs / feel |
| `low-mood-reconnect` | Low Mood Plan | `#tool/low-mood-reconnect` | targeted-tools.mjs / feel |
| `panic-preparation` | Panic Plan | `#tool/panic-preparation` | targeted-tools.mjs / calm |
| `disappointment-reset` | Disappointment Reset | `#tool/disappointment-reset` | targeted-tools.mjs / decide |
| `loneliness-contact` | Connection Plan | `#tool/loneliness-contact` | targeted-tools.mjs / relate |
| `perfection-finish` | Good Enough | `#tool/perfection-finish` | targeted-tools.mjs / think |
| `shutdown-card` | Shutdown Card | `#tool/shutdown-card` | targeted-tools.mjs / calm |
| `meltdown-plan` | Meltdown Plan | `#tool/meltdown-plan` | targeted-tools.mjs / calm |
| `burnout-adjustments` | Burnout Reset | `#tool/burnout-adjustments` | targeted-tools.mjs / calm |
| `time-reality` | Time Reality | `#tool/time-reality` | targeted-tools.mjs / decide |
| `memory-offload` | Memory Offload | `#tool/memory-offload` | targeted-tools.mjs / think |
| `impulse-pause` | Impulse Pause | `#tool/impulse-pause` | targeted-tools.mjs / decide |
| `change-preview` | Change Preview | `#tool/change-preview` | targeted-tools.mjs / calm |
| `processing-request` | Processing Request | `#tool/processing-request` | targeted-tools.mjs / relate |
| `reading-access` | Reading Access | `#tool/reading-access` | targeted-tools.mjs / think |
| `coordination-plan` | Coordination Plan | `#tool/coordination-plan` | targeted-tools.mjs / decide |
| `appointment-brief` | Appointment Brief | `#tool/appointment-brief` | targeted-tools.mjs / think |
| `care-balance` | Care Balance | `#tool/care-balance` | targeted-tools.mjs / relate |
| `emotion-compass` | Emotion Compass | `#compass` | interactive-tools.mjs / feel |
| `regulation-picker` | Regulation Picker | `#play/regulation-picker` | interactive-tools.mjs / calm |
| `breathing-pacer` | Breathing Pacer | `#play/breathing-pacer` | interactive-tools.mjs / calm |
| `muscle-release` | Muscle Release | `#play/muscle-release` | interactive-tools.mjs / calm |
| `infinite-pattern` | Infinite Pattern | `#play/infinite-pattern` | interactive-tools.mjs / sensory |
| `control-zones` | Control Zones | `#play/control-zones` | interactive-tools.mjs / think |
| `perspective-wheel` | Perspective Wheel | `#play/perspective-wheel` | interactive-tools.mjs / think |
| `trigger-chain-builder` | Trigger Chain | `#play/trigger-chain-builder` | interactive-tools.mjs / think |
| `pattern-loop-simulator` | Pattern Loop | `#play/pattern-loop-simulator` | interactive-tools.mjs / think |
| `cost-benefit-balance` | Cost–Benefit | `#play/cost-benefit-balance` | interactive-tools.mjs / choose |
| `value-conflict-balance` | Values Balance | `#play/value-conflict-balance` | interactive-tools.mjs / choose |
| `friction-finder` | Friction Finder | `#play/friction-finder` | interactive-tools.mjs / action |
| `task-shrinker` | Task Shrinker | `#play/task-shrinker` | interactive-tools.mjs / action |
| `urgent-important-matrix` | Priority Matrix | `#play/urgent-important-matrix` | interactive-tools.mjs / action |
| `energy-budget` | Energy Budget | `#play/energy-budget` | interactive-tools.mjs / energy |
| `thought-defusion` | Thought Defusion | `#play/thought-defusion` | interactive-tools.mjs / think |
| `urge-surfing` | Urge Surfing | `#play/urge-surfing` | interactive-tools.mjs / calm |
| `safe-enough-scale` | Safety Scale | `#play/safe-enough-scale` | interactive-tools.mjs / calm |
| `self-compassion-perspective` | Self-Compassion | `#play/self-compassion-perspective` | interactive-tools.mjs / identity |
| `savouring-timer` | Savouring Timer | `#play/savouring-timer` | interactive-tools.mjs / feel |
| `choice-pause` | Choice Pause | `#play/choice-pause` | interactive-tools.mjs / action |
| `social-script-builder` | Social Scripts | `#play/social-script-builder` | interactive-tools.mjs / relate |


## Fourteen guided systems


| ID | Title | Route | Questions |
| --- | --- | --- | --- |
| triage | Life Triage | `#guided/triage` | 7 |
| bottleneck | Life Bottleneck Finder | `#guided/bottleneck` | 7 |
| crossroads | Crossroads | `#guided/crossroads` | 7 |
| direction | Direction Finder | `#guided/direction` | 7 |
| career | Career Strategy | `#guided/career` | 7 |
| relationship-crossroads | Relationship Crossroads | `#guided/relationship-crossroads` | 7 |
| relationship-pattern | Relationship Pattern Lab | `#guided/relationship-pattern` | 7 |
| burnout | Burnout & Overload Map | `#guided/burnout` | 7 |
| motivation | Motivation Diagnostic | `#guided/motivation` | 7 |
| mental-load | Mental Load Audit | `#guided/mental-load` | 7 |
| identity | Identity Transition | `#guided/identity` | 7 |
| environment | Environment Fit | `#guided/environment` | 7 |
| money | Money & Independence Strategy | `#guided/money` | 7 |
| rebuild | Life Rebuild | `#guided/rebuild` | 7 |


## Questionnaire contracts


| Route | Implementation | Preserve |
| --- | --- | --- |
| #questionnaires | questionnaires.mjs | Catalogue links, descriptions and limitations |
| #big-five | questionnaires.mjs; big-five-atlas.mjs; big-five-profile.mjs | Questions/scoring, trait/facet descriptions, context/notes/goals/experiment/reflection, saved atlas, manual export, user feedback |
| #systems | Embedded Systems in questionnaires.mjs | Estimates, section questions, scoring and result interpretation; standalone systems-questionnaire.mjs is a separate retained implementation |
| #personality | personality-test.mjs | 100-situation flow, optional local draft, interpretation chapters, state history, feedback and export |


These source labels do not establish validation, diagnosis or predictive accuracy. New Field Guide entries must not automatically inherit questionnaire interpretations as facts.


## Wizard situation definitions


| ID | Definition |
| --- | --- |
| feel | {"id": "feel", "label": "Feeling something", "examples": "upset, numb, anxious, angry, strange, overwhelmed", "tools": ["state-check", "emotion-check-in", "mixed-feelings"]} |
| think | {"id": "think", "label": "Thinking too much", "examples": "spiralling, worrying, confused, tangled thoughts", "tools": ["state-check", "brain-dump", "reality-map", "worry-sort", "uncertainty-calibration"]} |
| body | {"id": "body", "label": "Physically dysregulated", "examples": "exhausted, wired, hungry, overstimulated, restless", "tools": ["state-check", "load-balancer", "quick-reset"]} |
| decision | {"id": "decision", "label": "Stuck on a decision", "examples": "don’t know what I want or what to do", "tools": ["brain-dump", "values-discovery", "decision-map", "future-perspectives"]} |
| start | {"id": "start", "label": "Struggling to start", "examples": "procrastinating, unmotivated, avoiding", "tools": ["state-check", "friction", "small-step", "environment-design", "reward-design"]} |
| relate | {"id": "relate", "label": "Dealing with someone", "examples": "argument, boundary, misunderstanding, relationship", "tools": ["quick-reset", "conversation-map", "boundary-builder", "conflict-pattern"]} |
| self | {"id": "self", "label": "Trying to understand myself", "examples": "patterns, identity, reactions, repeated behaviour", "tools": ["state-check", "pattern-map", "function-finder", "pattern-map", "function-finder", "pattern-experiment"]} |
| calm | {"id": "calm", "label": "Needing to settle or orient", "examples": "panic, sensory overload, agitation", "tools": ["quick-reset", "grounding", "load-balancer"]} |
| reflect | {"id": "reflect", "label": "Wanting to reflect", "examples": "journal, appreciation, values, life direction", "tools": ["cbt-journal", "difficult-day", "gratitude", "gratitude", "positive-memory", "values-discovery", "weekly-review"]} |
| stim | {"id": "stim", "label": "Wanting stimulation", "examples": "bored, understimulated, want to stim", "tools": ["state-check", "sensory-profile", "masking-map", "stim-space"]} |
| learn | {"id": "learn", "label": "Wanting to learn", "examples": "psychology, reasoning, emotions", "tools": ["emotion-check-in", "claim-checker", "evidence-strength", "competing-models", "competing-models", "uncertainty-calibration"]} |
| unsure | {"id": "unsure", "label": "Not sure", "examples": "guide me", "tools": ["state-check", "brain-dump", "quick-reset"]} |


All detailed subparts and recommendation metadata are preserved in `inventory.json → situationSubparts` and original source.


## Account sections


Signed-in sections: `home`, `profile`, `security`, `appearance`, `maps`, `saved`, `learning`, `community`, `notifications`, `privacy`; staff moderation is conditional. Guest routes allow Home, Maps and Appearance; other requests fall back to Home. The guest navigation menu contains Appearance. The DOM check tries ten route requests; it does not imply ten guest-only features.


## All 26 default preferences


| Key | Default |
| --- | --- |
| `theme` | "light" |
| `language` | "en" |
| `textScale` | 100 |
| `contrast` | "standard" |
| `motion` | "system" |
| `lowStim` | false |
| `sound` | true |
| `font` | "system" |
| `lineSpacing` | 1.6 |
| `simpleMode` | false |
| `tapControls` | false |
| `visualMode` | "balanced" |
| `saveDrafts` | true |
| `retentionDays` | 0 |
| `personalise` | false |
| `moodHistory` | false |
| `sensitiveLock` | false |
| `learningFormat` | "any" |
| `trackLearning` | false |
| `replyNotifications` | false |
| `siteUpdates` | false |
| `reminders` | false |
| `reminderTime` | "18:00" |
| `timeZone` | "Europe/London" |
| `mentions` | false |
| `profileVisibility` | "private" |


Default schema fields are not proof of delivery capability. Server/client sanitization and current free-plan limits apply, including disabled in-app MFA enrollment and scheduled notifications.


## All 23 registered saved-work keys


| Key | Category | Description |
| --- | --- | --- |
| `ns-personal-maps-v1` | maps | My Maps |
| `ns-tool-favourites-v1` | library | Favourite tools |
| `ns-tool-recent-v1` | library | Recent tools |
| `ns-account-learning-v2` | learning | Learning progress and bookmarks |
| `ns-account-tool-drafts-v2` | drafts | Unfinished activities |
| `ns-account-mood-v2` | mood | Optional mood history |
| `ns-learn-quote-notes-v1` | reflections | Quote reflections |
| `ns-reflection` | reflections | Reflection draft |
| `ns-memory-jar-v1` | reflections | Memory jar |
| `nobodys-simple-full-profile-draft-v3` | drafts | Personality questionnaire draft |
| `nobodys-simple-profile-state-checkins-v1` | mood | Personality state check-ins |
| `nobodys-simple-profile-feedback-v1` | reflections | Questionnaire feedback |
| `ns-navigation-context-v1` | reflections | Life navigation context |
| `ns-navigation-projects-v1` | maps | Life navigation projects |
| `ns-sensory-recipe-v1` | tools | Sensory recipe |
| `ns-sensory-recipes-v3` | tools | Sensory recipes |
| `nobodys-simple-sensory-recipes-v1` | tools | Stim Space recipes |
| `ns-social-battery-v3` | tools | Social battery |
| `ns-load-balancer-v2` | tools | Load balancer |
| `ns-masking-contexts-v1` | tools | Masking contexts |
| `ns-masking-map-v2` | tools | Masking map |
| `ns-simplyfocus-recipe-v1` | tools | SimplyFocus mixer |
| `ns-simplyfocus-tasks-v1` | tools | SimplyFocus tasks |


The Firestore `knownKey` set matches these registered keys. The save/export/sync/privacy matrix must be updated with any new key.


## Additional key patterns and markers


| Pattern | Source locations |
| --- | --- |
| ``ns-work-v2:${this.uid}:${key}`` | account-storage.mjs:4 |
| ``ns-work-v2:${uid}:`` | account-storage.mjs:11 |
| `ns-account-pending-v2:` | account-storage.mjs:11, account-sync.mjs:5, account-sync.mjs:6, accounts.mjs:148 |
| `ns-account-sync-v2:` | account-storage.mjs:11, account-sync.mjs:5, account-sync.mjs:12, accounts.mjs:148 |
| `ns-account-prefs-v2:` | account-storage.mjs:11 |
| ``ns-account-pending-v2:${uid}`` | account-storage.mjs:13 |
| ``ns-account-prefs-v2:${user?.uid\|\|'guest'}`` | accounts.mjs:19 |
| ``ns-tool-history-enabled-v1:${user?.uid\|\|'guest'}`` | accounts.mjs:20 |
| `ns-account-guest-defaults-v1` | accounts.mjs:45 |
| ``ns-account-sound-default-v1:${user?.uid\|\|''}`` | accounts.mjs:46 |
| `ns-shared-device` | accounts.mjs:53 |
| `ns-account-device-v2` | accounts.mjs:65, accounts.mjs:65, accounts.mjs:118 |
| ``ns-tool-history-enabled-v1:${uid}`` | accounts.mjs:158 |
| ``ns-tool-history-enabled-v1:${window.nsAccountHistoryScope\|\|'guest'}`` | features.mjs:661 |
| `ns-intervention-bookmarks-v1` | intervention-book.mjs:91, intervention-book.mjs:91, intervention-book.mjs:122, intervention-book.mjs:124 |
| `ns-lifestyle-reminders-v1` | lifestyle-reminders.mjs:1 |
| `ns-lifestyle-tasks-v1` | lifestyle-storage.mjs:1 |
| `ns-lifestyle-emotions-v1` | lifestyle.mjs:7 |
| `ns-lifestyle-deed-v1` | lifestyle.mjs:7 |
| `ns-big-five-atlas-v1` | questionnaires.mjs:340 |
| `ns-simplyfocus-recipe-v2` | simplyfocus.mjs:22 |
| `nobodys-simple-creator-v2` | studio.mjs:1247 |


Prefixes/templates are grouped here as source expressions; overlapping expressions do not represent separate records. `nobodys-simple-creator-v2` is an export schema marker. IndexedDB `nobodyssimple-creator` version 1 contains `drafts`, `versions`, `snippets`, `notes`, `templates`. `ns-shared-device` is sessionStorage. Firebase provider-managed persistence and CacheStorage are separate from app-owned localStorage.


## Firestore rule paths


| Rule path | Location |
| --- | --- |
| /databases/{database}/documents | firestore.rules:3 |
| /users/{uid}/savedWork/{item} | firestore.rules:16 |
| /profiles/{uid} | firestore.rules:40 |
| /nicknames/{handle} | firestore.rules:47 |
| /users/{uid}/settings/account | firestore.rules:63 |
| /users/{uid}/settings/communityRate | firestore.rules:69 |
| /users/{uid}/devices/{id} | firestore.rules:75 |
| /users/{uid}/blocks/{target} | firestore.rules:81 |
| /users/{uid}/notifications/{id} | firestore.rules:86 |
| /accountSecurity/{uid} | firestore.rules:87 |
| /siteAdmins/{uid} | firestore.rules:95 |
| /comments/{id} | firestore.rules:105 |
| /reports/{id} | firestore.rules:114 |
| /users/{uid}/{col}/{id} | firestore.rules:120 |
| /users/{uid}/communityRates/{kind} | firestore.rules:131 |
| /communityMembers/{uid} | firestore.rules:139 |
| /boardPosts/{id} | firestore.rules:145 |
| /attachments/{slot} | firestore.rules:154 |
| /replies/{replyId} | firestore.rules:160 |
| /reactions/{uid} | firestore.rules:166 |
| /conversations/{id} | firestore.rules:175 |
| /messages/{messageId} | firestore.rules:180 |
| /boardReports/{id} | firestore.rules:190 |
| /communityBans/{uid} | firestore.rules:196 |
| /{path=**}/replies/{id} | firestore.rules:198 |
| /{path=**}/reactions/{id} | firestore.rules:199 |
| /{path=**}/messages/{id} | firestore.rules:200 |
| /{document=**} | firestore.rules:202 |


See rules for exact owner, verified-identity, lock, revision, rate, moderation and cleanup conditions; no emulator or live rule certification was performed.


## Published content


| ID | Title | Type | Status |
| --- | --- | --- | --- |
| 814c9fd1-998f-47b4-81da-32b9419b33ee | 22/10/2026 | announcement | published |
| 5fec6e2b-bbab-4a11-b0ec-f9de1a12b5b4 | 15/10/2026: Learn update | announcement | published |
| 9fef1fcf-a3b9-4553-bffb-6f3658b35d11 | 9/10/2026 update: | announcement | published |
| c045368d-ce46-416f-8ce7-5245e0e30199 | Hello! | blog | published |


Published lesson/video/audio counts are zero in this repository snapshot. Dynamic community content is not part of `content.json` and no private record inventory was attempted.


## Curriculum and planned learning


| Module | Source definition |
| --- | --- |
| 1 | {"id": 1, "title": "Models, Certainty & Epistemic Autonomy", "question": "How do I know when my interpretation deserves to guide action?", "quarter": 1} |
| 2 | {"id": 2, "title": "Attention Governance", "question": "What is repeatedly entering my mind, who selected it, and what is it training me to treat as important?", "quarter": 1} |
| 3 | {"id": 3, "title": "State, Emotion & Prediction", "question": "When is a feeling useful information, and when is it a state-dependent forecast pretending to be reality?", "quarter": 1} |
| 4 | {"id": 4, "title": "Reinforcement, Avoidance & Hidden Payoffs", "question": "What keeps this pattern alive even when I consciously dislike it?", "quarter": 2} |
| 5 | {"id": 5, "title": "Self-Models, Labels & Identity Loops", "question": "When does an explanation of myself become a program that shapes what I notice, remember and do?", "quarter": 2} |
| 6 | {"id": 6, "title": "Feedback Loops, Attractors & Leverage", "question": "Why does my psychology keep returning to familiar states, and where can one intervention change several outcomes at once?", "quarter": 2} |
| 7 | {"id": 7, "title": "Audience, Status & Belonging", "question": "Which parts of me are genuine preferences, and which are adaptations to the audiences whose approval or rejection matters?", "quarter": 3} |
| 8 | {"id": 8, "title": "Delegated Minds: AI, Algorithms & Epistemic Ownership", "question": "What should I let machines do for me, and what must remain mine if I want to retain judgement, authorship and social reality?", "quarter": 3} |
| 9 | {"id": 9, "title": "Power, Money & Available Choice", "question": "Which choices are genuinely available, which are merely imaginable, and what strategy fits a constraint I cannot immediately remove?", "quarter": 3} |
| 10 | {"id": 10, "title": "Values, Finitude & Decision Architecture", "question": "Once I can explain what shaped me, what deserves to govern me?", "quarter": 4} |
| 11 | {"id": 11, "title": "Commitment, Boundaries & Relational Autonomy", "question": "How can I remain self-governing while allowing other people to matter enough to constrain me?", "quarter": 4} |
| 12 | {"id": 12, "title": "Recursive Governance & Generator Design", "question": "How do I govern a system that can never be completely transparent to itself?", "quarter": 4} |


Four quarters, twelve modules, zero weeks. The complete 40 crash-topic domain definitions and emergency-topic metadata remain in `inventory.json`; no topic is counted as a delivered lesson.


## Explicit retired IDs


Written registry: `certainty`, `control-map`, `worry-parking`, `why-ladder`, `goal-builder`, `internal-rules`, `context-map`, `cost-map`, `origin-map`, `maintenance-loop`, `experiment-builder`, `apology`, `perspective-switch`, `free-journal`, `thought-journal`, `gratitude-course`, `attention-mission`, `correlation-game`, `base-rate`, `counterexample`, `mechanism-builder`.


Interactive registry: `body-sensation-map`, `state-check`, `five-senses-grounding`, `sensory-playground`, `sensory-mixer`, `nobody-radio`, `overload-meter`, `social-battery`, `sensory-profile`, `needs-compass`, `values-compass`, `facts-interpretation-unknown`, `certainty-dial`, `emotion-timeline`, `function-finder`, `decision-balance`, `reversibility-gauge`, `motivation-mixer`, `priority-sorter`, `recovery-menu`, `boundary-sorter`, `conflict-decoder`, `relationship-distance`, `masking-map`, `transition-bridge`, `attention-spotlight`, `worry-conveyor`, `gratitude-lens`, `memory-jar`, `emotion-matching`, `cognitive-bias-games`, `uncertainty-game`, `life-balance-radar`, `personal-weather`, `intensity-thermometer`.


Preserve old records and intentional fallbacks; do not silently restore retired tools to the active catalogue.


## CSS files


| File | Bytes | Rules | Important declarations | Media blocks |
| --- | --- | --- | --- | --- |
| account.css | 13452 | 118 | 32 | 2 |
| app-design.css | 132331 | 1153 | 112 | 41 |
| community.css | 6988 | 81 | 0 | 1 |
| intervention-book.css | 8255 | 101 | 14 | 5 |
| lifestyle.css | 22878 | 265 | 4 | 6 |
| nd-play.css | 15184 | 130 | 0 | 3 |
| strategy.css | 23762 | 268 | 17 | 12 |
| studio.css | 35730 | 442 | 44 | 4 |
| styles (1).css | 38114 | 441 | 3 | 6 |
| styles.css | 506404 | 4836 | 74 | 87 |
| ui-resources.css | 11159 | 118 | 37 | 4 |


All CSS parsed; full selected-rule declarations and context are in `inventory.json → css`. Active consumer sheets are styles, account, strategy, community and app-design. Other CSS belongs to standalone or legacy surfaces.


## Main entry import reachability


- `accounts.mjs`
- `site.mjs`
- `app-design.mjs`
- `account-free.mjs`
- `account-config.mjs`
- `account-policy.mjs`
- `account-storage.mjs`
- `account-sync.mjs`
- `account-i18n.mjs`
- `community-ui.mjs`
- `community-data.mjs`
- `tool-guidance.mjs`
- `strategy.mjs`
- `tool-catalog.mjs`
- `data.mjs`
- `crash-topics.mjs`
- `quote-content.mjs`
- `core.mjs`
- `features.mjs`
- `interactive-tools.mjs`
- `simplyfocus.mjs`
- `personality-test.mjs`
- `questionnaires.mjs`
- `life-navigation.mjs`
- `referrals.mjs`
- `targeted-tools.mjs`
- `community-policy.mjs`
- `emotion-profiles.mjs`
- `sensory-recipe.mjs`
- `social-battery.mjs`
- `load-balancer.mjs`
- `masking-map.mjs`
- `big-five-atlas.mjs`
- `big-five-profile.mjs`
- `lifestyle-storage.mjs`


This static graph excludes separate editor and sensory HTML entry graphs unless imported. A file outside the main graph is not necessarily disposable.


## Service worker inventory


SHELL listed bytes: **31670028**. Missing files: []. This is a byte sum, not measured download traffic.


Reachable modules absent from SHELL: `crash-topics.mjs`, `targeted-tools.mjs`, `big-five-atlas.mjs`, `big-five-profile.mjs`, `lifestyle-storage.mjs`.


All shell paths are recorded in `inventory.json → serviceWorker.shell`.


## Exact repository file coverage


Every tracked file is hashed. JavaScript and CSS were read completely by their parsers, with manual source inspection of active architecture, workflows, persistence, rendering and conflicts. Parsing is not a line-by-line semantic review. Text/asset rows explicitly distinguish indexing from manual inspection. Source declarations, import edges and storage call locations are available in the JSON for targeted follow-up.


| File | Bytes | Review method |
| --- | --- | --- |
| .github/workflows/blank.yml | 1140 | Text source indexed; selected manual review |
| ACCOUNT-SETUP.md | 8366 | Text source indexed; selected manual review |
| AUDIOS_PINNED_TOOL_COLLECTIONS_UPDATE.txt | 1573 | Asset metadata indexed; selected visual review |
| CNAME | 18 | Asset metadata indexed; selected visual review |
| INSTALL-FIREBASE.md | 3549 | Text source indexed; selected manual review |
| LEARN_PAGE_REDESIGN_UPDATE.txt | 1938 | Asset metadata indexed; selected visual review |
| NobodysSimple_Interactive_Tools_Update_README.txt | 748 | Asset metadata indexed; selected visual review |
| STUDIO-SETUP.md | 9948 | Text source indexed; selected manual review |
| account-config.mjs | 456 | Parsed in full by static audit |
| account-free.mjs | 7852 | Parsed in full by static audit |
| account-i18n.mjs | 6937 | Parsed in full by static audit |
| account-play-bridge.mjs | 1139 | Parsed in full by static audit |
| account-policy.mjs | 5954 | Parsed in full by static audit |
| account-storage.mjs | 2660 | Parsed in full by static audit |
| account-sync.mjs | 6067 | Parsed in full by static audit |
| account.css | 13452 | Parsed in full by static audit |
| accounts.mjs | 61630 | Parsed in full by static audit |
| admin.html | 361 | Text source indexed; selected manual review |
| app-design.css | 132331 | Parsed in full by static audit |
| app-design.mjs | 11711 | Parsed in full by static audit |
| app.js | 1770 | Parsed in full by static audit |
| apple-touch-icon.png | 43272 | Asset metadata indexed; selected visual review |
| banner.png | 2876754 | Asset metadata indexed; selected visual review |
| big-five-atlas.mjs | 13466 | Parsed in full by static audit |
| big-five-profile.mjs | 20412 | Parsed in full by static audit |
| characters.png | 1408837 | Asset metadata indexed; selected visual review |
| characters2.png | 1303993 | Asset metadata indexed; selected visual review |
| community-data.mjs | 11637 | Parsed in full by static audit |
| community-policy.mjs | 2766 | Parsed in full by static audit |
| community-ui.mjs | 24849 | Parsed in full by static audit |
| community.css | 6988 | Parsed in full by static audit |
| content.json | 27366 | Text source indexed; selected manual review |
| core.mjs | 21208 | Parsed in full by static audit |
| crash-topics.mjs | 25050 | Parsed in full by static audit |
| data.mjs | 20022 | Parsed in full by static audit |
| drew-profile.png | 754757 | Asset metadata indexed; selected visual review |
| drew-profile.png.jpeg | 401807 | Asset metadata indexed; selected visual review |
| emotion-profiles.mjs | 15840 | Parsed in full by static audit |
| favicon-96.png | 15776 | Asset metadata indexed; selected visual review |
| features.mjs | 461026 | Parsed in full by static audit |
| firebase-test.json | 151 | Text source indexed; selected manual review |
| firebase.json | 77 | Text source indexed; selected manual review |
| firestore.indexes.json | 2455 | Text source indexed; selected manual review |
| firestore.rules | 29207 | Text source indexed; selected manual review |
| half-banner.png | 1003507 | Asset metadata indexed; selected visual review |
| icon-192-maskable.png | 32984 | Asset metadata indexed; selected visual review |
| icon-192.png | 47943 | Asset metadata indexed; selected visual review |
| icon-512-maskable.png | 183872 | Asset metadata indexed; selected visual review |
| icon-512.png | 285300 | Asset metadata indexed; selected visual review |
| index.html | 6524 | Text source indexed; selected manual review |
| interactive-tools.mjs | 150985 | Parsed in full by static audit |
| intervention-book.css | 8255 | Parsed in full by static audit |
| intervention-book.mjs | 29330 | Parsed in full by static audit |
| intervention-data.mjs | 162666 | Parsed in full by static audit |
| intervention-guides.mjs | 22712 | Parsed in full by static audit |
| intervention-layers.mjs | 14835 | Parsed in full by static audit |
| intervention-method-library.mjs | 7681 | Parsed in full by static audit |
| intervention-resources.mjs | 10670 | Parsed in full by static audit |
| kofi-profile.png | 622726 | Asset metadata indexed; selected visual review |
| life-navigation.mjs | 83889 | Parsed in full by static audit |
| lifestyle-deeds.mjs | 16087 | Parsed in full by static audit |
| lifestyle-reminders.mjs | 2297 | Parsed in full by static audit |
| lifestyle-storage.mjs | 2617 | Parsed in full by static audit |
| lifestyle.css | 22878 | Parsed in full by static audit |
| lifestyle.mjs | 26140 | Parsed in full by static audit |
| load-balancer.mjs | 15647 | Parsed in full by static audit |
| logo.png | 285300 | Asset metadata indexed; selected visual review |
| manifest.webmanifest | 632 | Text source indexed; selected manual review |
| masking-map.mjs | 15595 | Parsed in full by static audit |
| media/avatars/affirmed.png | 75245 | Asset metadata indexed; selected visual review |
| media/avatars/base.png | 63231 | Asset metadata indexed; selected visual review |
| media/avatars/bowing.png | 622726 | Asset metadata indexed; selected visual review |
| media/avatars/dancing.png | 69751 | Asset metadata indexed; selected visual review |
| media/avatars/drawing.png | 72968 | Asset metadata indexed; selected visual review |
| media/avatars/excited-wave.png | 75823 | Asset metadata indexed; selected visual review |
| media/avatars/excited.png | 75823 | Asset metadata indexed; selected visual review |
| media/avatars/frolicking.png | 65452 | Asset metadata indexed; selected visual review |
| media/avatars/peering.png | 57167 | Asset metadata indexed; selected visual review |
| media/avatars/reading.png | 71551 | Asset metadata indexed; selected visual review |
| media/avatars/running.png | 78795 | Asset metadata indexed; selected visual review |
| media/avatars/sitting.png | 65122 | Asset metadata indexed; selected visual review |
| media/avatars/still.png | 65032 | Asset metadata indexed; selected visual review |
| media/avatars/sulking.png | 63004 | Asset metadata indexed; selected visual review |
| media/avatars/thinking.png | 76414 | Asset metadata indexed; selected visual review |
| media/avatars/waiting.png | 65973 | Asset metadata indexed; selected visual review |
| media/avatars/waltzing.png | 65680 | Asset metadata indexed; selected visual review |
| media/avatars/yippie.png | 76794 | Asset metadata indexed; selected visual review |
| media/checklist---Copy-ea44ab52-7299-42db-bf80-9c325f71f396.png | 93066 | Asset metadata indexed; selected visual review |
| media/console/nobody-base.png | 63231 | Asset metadata indexed; selected visual review |
| media/console/nobody-comparing.png | 68204 | Asset metadata indexed; selected visual review |
| media/console/nobody-positing.png | 76414 | Asset metadata indexed; selected visual review |
| media/console/nobody-waiting.png | 65973 | Asset metadata indexed; selected visual review |
| media/mapping-267540df-c53f-4a04-869e-cead737b7aff.png | 83927 | Asset metadata indexed; selected visual review |
| media/strategy/wisbody.png | 943983 | Asset metadata indexed; selected visual review |
| media/waving-b9f5207a-b72a-4b05-84ac-73d0733fa080.png | 72395 | Asset metadata indexed; selected visual review |
| nd-play-v3.mjs | 43452 | Parsed in full by static audit |
| nd-play-v4.mjs | 45189 | Parsed in full by static audit |
| nd-play.css | 15184 | Parsed in full by static audit |
| nd-play.html | 8041 | Text source indexed; selected manual review |
| nd-play.mjs | 43404 | Parsed in full by static audit |
| ns-art-compass.png | 67487 | Asset metadata indexed; selected visual review |
| ns-art-friends.png | 72088 | Asset metadata indexed; selected visual review |
| ns-art-guide.png | 69799 | Asset metadata indexed; selected visual review |
| ns-art-listening.png | 53137 | Asset metadata indexed; selected visual review |
| ns-art-meditate.png | 50400 | Asset metadata indexed; selected visual review |
| ns-art-reading.png | 65069 | Asset metadata indexed; selected visual review |
| ns-art-thinking.png | 61529 | Asset metadata indexed; selected visual review |
| ns-art-writing.png | 52443 | Asset metadata indexed; selected visual review |
| ns-character-base.webp | 15348 | Asset metadata indexed; selected visual review |
| ns-character-building.webp | 14602 | Asset metadata indexed; selected visual review |
| ns-character-checklist.webp | 14914 | Asset metadata indexed; selected visual review |
| ns-character-compass.webp | 15792 | Asset metadata indexed; selected visual review |
| ns-character-confused.webp | 19548 | Asset metadata indexed; selected visual review |
| ns-character-drawing.webp | 19728 | Asset metadata indexed; selected visual review |
| ns-character-friends.webp | 15902 | Asset metadata indexed; selected visual review |
| ns-character-guide.webp | 16544 | Asset metadata indexed; selected visual review |
| ns-character-helping.webp | 17222 | Asset metadata indexed; selected visual review |
| ns-character-hiking.webp | 16040 | Asset metadata indexed; selected visual review |
| ns-character-lantern.webp | 14788 | Asset metadata indexed; selected visual review |
| ns-character-mapping.webp | 20006 | Asset metadata indexed; selected visual review |
| ns-character-meditate.webp | 12210 | Asset metadata indexed; selected visual review |
| ns-character-message.webp | 16218 | Asset metadata indexed; selected visual review |
| ns-character-moon.webp | 13956 | Asset metadata indexed; selected visual review |
| ns-character-plant.webp | 14690 | Asset metadata indexed; selected visual review |
| ns-character-radio.webp | 15686 | Asset metadata indexed; selected visual review |
| ns-character-reading.webp | 13962 | Asset metadata indexed; selected visual review |
| ns-character-shield.webp | 13926 | Asset metadata indexed; selected visual review |
| ns-character-sitting.webp | 15210 | Asset metadata indexed; selected visual review |
| ns-character-solving.webp | 15646 | Asset metadata indexed; selected visual review |
| ns-character-star.webp | 15368 | Asset metadata indexed; selected visual review |
| ns-character-teaching.webp | 16118 | Asset metadata indexed; selected visual review |
| ns-character-thinking.webp | 12412 | Asset metadata indexed; selected visual review |
| ns-character-waiting.webp | 15706 | Asset metadata indexed; selected visual review |
| ns-character-watering.webp | 15844 | Asset metadata indexed; selected visual review |
| ns-character-wave.webp | 18288 | Asset metadata indexed; selected visual review |
| ns-character-writing.webp | 19310 | Asset metadata indexed; selected visual review |
| ns-home-console.webp | 282266 | Asset metadata indexed; selected visual review |
| ns-home-hero.webp | 166120 | Asset metadata indexed; selected visual review |
| ns-landscape-calm.webp | 16260 | Asset metadata indexed; selected visual review |
| ns-landscape-choose.webp | 18530 | Asset metadata indexed; selected visual review |
| ns-landscape-clouds.webp | 6100 | Asset metadata indexed; selected visual review |
| ns-landscape-desk.webp | 7834 | Asset metadata indexed; selected visual review |
| ns-landscape-feel.webp | 17862 | Asset metadata indexed; selected visual review |
| ns-landscape-fireside.webp | 7462 | Asset metadata indexed; selected visual review |
| ns-landscape-forest.webp | 14216 | Asset metadata indexed; selected visual review |
| ns-landscape-identity.webp | 14486 | Asset metadata indexed; selected visual review |
| ns-landscape-learn.webp | 15590 | Asset metadata indexed; selected visual review |
| ns-landscape-mountains.webp | 8890 | Asset metadata indexed; selected visual review |
| ns-landscape-night.webp | 7232 | Asset metadata indexed; selected visual review |
| ns-landscape-path.webp | 11894 | Asset metadata indexed; selected visual review |
| ns-landscape-relate.webp | 12798 | Asset metadata indexed; selected visual review |
| ns-landscape-sunset.webp | 8290 | Asset metadata indexed; selected visual review |
| ns-landscape-think.webp | 15718 | Asset metadata indexed; selected visual review |
| ns-prop-backpack.webp | 2900 | Asset metadata indexed; selected visual review |
| ns-prop-book.webp | 2660 | Asset metadata indexed; selected visual review |
| ns-prop-cup.webp | 2988 | Asset metadata indexed; selected visual review |
| ns-prop-headphones.webp | 2746 | Asset metadata indexed; selected visual review |
| ns-prop-journal.webp | 3082 | Asset metadata indexed; selected visual review |
| ns-prop-lantern.webp | 3044 | Asset metadata indexed; selected visual review |
| ns-prop-leaf.webp | 1630 | Asset metadata indexed; selected visual review |
| ns-prop-notebook.webp | 2776 | Asset metadata indexed; selected visual review |
| ns-prop-pencil.webp | 1764 | Asset metadata indexed; selected visual review |
| ns-prop-plant.webp | 1948 | Asset metadata indexed; selected visual review |
| ns-prop-search.webp | 2366 | Asset metadata indexed; selected visual review |
| ns-prop-signpost.webp | 2682 | Asset metadata indexed; selected visual review |
| ns-scene-forest.webp | 11574 | Asset metadata indexed; selected visual review |
| ns-scene-mountains.webp | 7048 | Asset metadata indexed; selected visual review |
| ns-scene-path.webp | 9392 | Asset metadata indexed; selected visual review |
| ns-scene-sunset.webp | 6330 | Asset metadata indexed; selected visual review |
| ns-ui-sheet-1.webp | 1163702 | Asset metadata indexed; selected visual review |
| ns-ui-sheet-2.webp | 1682650 | Asset metadata indexed; selected visual review |
| ns-ui-sheet-3.webp | 1364672 | Asset metadata indexed; selected visual review |
| ns-ui-sheet-4.webp | 1168550 | Asset metadata indexed; selected visual review |
| ns-ui-sheet-5.webp | 1112080 | Asset metadata indexed; selected visual review |
| ns-ui-sheet-6.webp | 1706950 | Asset metadata indexed; selected visual review |
| ns-ui-sheet-7.webp | 1257350 | Asset metadata indexed; selected visual review |
| ns-ui-sheet-8.webp | 1327044 | Asset metadata indexed; selected visual review |
| package.json | 147 | Text source indexed; selected manual review |
| personality-map.png | 83927 | Asset metadata indexed; selected visual review |
| personality-test.mjs | 420129 | Parsed in full by static audit |
| publisher.mjs | 11298 | Parsed in full by static audit |
| questionnaires.mjs | 82856 | Parsed in full by static audit |
| quote-content.mjs | 39015 | Parsed in full by static audit |
| referrals.mjs | 30036 | Parsed in full by static audit |
| sensory-recipe.mjs | 10693 | Parsed in full by static audit |
| simplyfocus-bowl.mp3 | 923791 | Asset metadata indexed; selected visual review |
| simplyfocus-fire.mp3 | 1136472 | Asset metadata indexed; selected visual review |
| simplyfocus-focus.mp3 | 1572864 | Asset metadata indexed; selected visual review |
| simplyfocus-lofi.mp3 | 12687954 | Asset metadata indexed; selected visual review |
| simplyfocus-ocean.mp3 | 1116026 | Asset metadata indexed; selected visual review |
| simplyfocus-pink.mp3 | 938993 | Asset metadata indexed; selected visual review |
| simplyfocus-pomodoro-bell.mp3 | 5793 | Asset metadata indexed; selected visual review |
| simplyfocus-rain.mp3 | 1061520 | Asset metadata indexed; selected visual review |
| simplyfocus-task-tick.mp3 | 5663 | Asset metadata indexed; selected visual review |
| simplyfocus-trees.mp3 | 1184203 | Asset metadata indexed; selected visual review |
| simplyfocus-wind.mp3 | 1049710 | Asset metadata indexed; selected visual review |
| simplyfocus.mjs | 28341 | Parsed in full by static audit |
| site.mjs | 67858 | Parsed in full by static audit |
| social-battery.mjs | 19987 | Parsed in full by static audit |
| staff.html | 24296 | Text source indexed; selected manual review |
| strategy.css | 23762 | Parsed in full by static audit |
| strategy.mjs | 16459 | Parsed in full by static audit |
| studio.css | 35730 | Parsed in full by static audit |
| studio.mjs | 109794 | Parsed in full by static audit |
| styles (1).css | 38114 | Parsed in full by static audit |
| styles.css | 506404 | Parsed in full by static audit |
| sw.js | 5352 | Parsed in full by static audit |
| systems-questionnaire.mjs | 31173 | Parsed in full by static audit |
| targeted-tools.mjs | 61854 | Parsed in full by static audit |
| tests/free/check.mjs | 945 | Parsed in full by static audit |
| tests/free/dom-check.mjs | 8417 | Parsed in full by static audit |
| tests/free/emulator-check.mjs | 6469 | Parsed in full by static audit |
| tests/free/policy.test.mjs | 2949 | Parsed in full by static audit |
| tests/free/sync.test.mjs | 3594 | Parsed in full by static audit |
| tests/verify.mjs | 5897 | Parsed in full by static audit |
| tool-catalog.mjs | 62687 | Parsed in full by static audit |
| tool-guidance.mjs | 4397 | Parsed in full by static audit |
| ui-resources.css | 11159 | Parsed in full by static audit |
| ui-resources.mjs | 12462 | Parsed in full by static audit |
