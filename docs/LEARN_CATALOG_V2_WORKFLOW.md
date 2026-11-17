# Nobody's Simple Learn — catalogue, content and release workflow
**Implementation:** Learn catalogue v2, 20 planned courses, zero authored lessons.
**Design intent:** Preserve the illustrated storybook homepage and art-layered course cards while making the public Learn page a usable entry point to specialist, independent psychology courses.

## Learner journeys
1. Open `#learn`: see the familiar illustrated hero and featured card, now explaining the teaching proposition rather than advertising a fictitious available course.
2. Browse `#learn/courses`: searchable illustrated catalogue with 20 carefully selected course outlines.
3. Open a category `#learn/category/{categoryId}`, or a card `#learn/course/{courseId}` directly.
4. A course detail page describes intended themes, its independent learning journey and its current **In development** state. Currently there are no published units or playable lessons.
5. Read `#learn/how-it-works` for the proposed six teaching formats and skill progression.
6. Once authored and approved, published course pages will display their actual modules and lessons, using `#learn/lesson/{courseId}/{lessonId}`. Future retrieval reviews appear under `#learn/review`.
7. Course topics are NOT mandatory prerequisites of one another. Each independent course can be entered directly. Connections and common knowledge objectives can be surfaced later as optional recommendations.

## Current catalogue categories
- People & relationships: narcissism, gaslighting, attachment, boundaries, loneliness.
- Mind & mental health: overthinking, anxiety, emotions, self-esteem, social anxiety, neurodiversity, sleep, low mood.
- Habits & everyday life: motivation/habits; burnout/stress.
- Society & digital life: social media, misinformation/AI, scams, masculinity/manosphere, vaping.

Categories serve discovery. They are not a new mandatory six-school linear curriculum. A course has a permanent ID that survives title changes.

## Existing artwork
Keep original Learn assets layered:
- backdrop image, light/glow layer, separately positioned Nobody's Simple mascot, small flourish, cream paper-cut nameplate;
- same rounded cards, five-column responsive grid, watercolour hero, featured scene with planted mascot and mountainous footer.
New courses currently reuse verified original character and landscape assets. Future unique art should use these same layers rather than embedding mascots in scene files.

## Content model, currently EMPTY
`ns-learn-catalog-v2.mjs`: public title/summary/category, search synonyms, visual assets, four planned focus areas, `status:'planned'`.

`ns-learn-content-v2.mjs`: public lesson registry, currently `{}`. **Never add fake lessons, fake XP or automatic completions**.

Future published course bundle schema (illustrative metadata, not a lesson):
```js
{
 id:'stable-course-id',
 version:1,
 status:'published',
 modules:[{
   id:'unit-id', title:'Unit title',
   lessons:[{
     id:'lesson-id', version:1, title:'Lesson title',
     teach:'Short but sufficient explanation.',
     questions:[
       {
         id:'stable-question-id', type:'choose', conceptId:'stable-concept-id',
         prompt:'Complete question with enough evidence to answer.',
         options:[{id:'a',label:'Credible alternative'},{id:'b',label:'Best supported answer'}],
         answer:'b', explanation:'Why the answer is appropriate and what others miss.',
         counterexample:'When this interpretation should NOT be used.'
       }
     ]
   }]
 }]
}
```
Each question must have a versioned conceptual definition and feedback. A lesson should generally practise recognition, differentiation, application and calibration—not merely label memorisation. Future registry should be code-split into per-course bundles as catalogue grows.

## Six reusable formats, ready in code but not populated
- `match`: `pairs:[{id,label,answer}]` (unique answer strings). UI selects matches.
- `sort`: `categories:[{id,label}], items:[{id,label,answer}]`. Sorting into mutually defined classes. UI selects category.
- `choose`: `options:[{id,label}], answer:'id'`. Difficult multiple-choice discrimination.
- `complete`: `answers:['accepted phrase',...]`. Accessible typed short recall.
- `sequence`: `steps:[{id,label},...]`. Move steps up/down using keyboard-capable buttons, not drag-only.
- `respond`: `options:[{id,label}], answer:'id'`. Context-sensitive response selection.
All include `type,id,prompt,explanation,conceptId,counterexample`. Distractors must be plausible. When genuine ambiguity exists, include an "insufficient information" answer or specify an assumption. No inferred diagnoses from vignettes.

## Publication workflow
1. **Scope**: define audience, educational outcome, constituent concepts, common misconceptions, counterexamples, real-world transfer aim and safety boundaries.
2. **Research**: collect up-to-date primary sources, reviews, guidelines; mark evidence strength and limitations. Avoid claiming intervention efficacy based solely on evidence for the underlying concept.
3. **Author**: short teaching passage, multiple short challenging questions, feedback and at least one counterexample. Use all six interaction formats across a course; do not force every format into every lesson.
4. **Review**: clinical/content reviewer, educational reviewer, accessibility/copy QA. Address uncertainty, diversity, risks of labelling and unsafe advice.
5. **Build**: place reviewed bundle in a versioned course module and register it in `ns-learn-content-v2.mjs`. Change its catalogue status from `planned` to `published` **only when the full bundle passes `validateLearnBundle`**. Reviews must be recorded in editorial release tracking; the code validator alone cannot establish clinical accuracy.
6. **Test**: `node --test tests/free/ns-learn-catalog-v2.test.mjs`; run all existing test suites, browser check responsive/dark/keyboard, check account opt-in sync and test offline reload. Publish review only after QA.
7. **Release**: bump static module cache tags, service-worker cache version, content manifest and immutable content version. Existing progress records should remain meaningful after edits.
8. **Evaluate**: user testing, completion and abandonment, error patterns, delayed recall and unfamiliar-case transfer. Instrumentation requires appropriate consent, privacy design and data protection.
9. **Maintain**: scheduled source review; supersede changed questions with new versioned IDs when correct-answer semantics change. Do not silently rescore old completions.

## Learner state and privacy
`ns-learn-progress-v2.mjs` is dormant until lessons exist. It writes only first lesson-completion and optional review outcome events under `ns-psy-learn:` inside the existing `ns-account-learning-v2` key. This lets existing account-controlled opt-in sync and conflict resolution apply without altering original Journey entries. Do not store answer text, individual hypotheses, diagnoses or personal free text. On storage error, report failure; never claim saved progress.

**Long-run scale warning:** the existing single JSON sync document is acceptable for a limited pilot but will eventually need per-concept/per-event documents, server-backed deduplication, validated permissions and pagination. Do not launch millions of review events inside one Firestore savedWork record. The course catalogue itself should remain static, cacheable, and code-split by course.

## Explicitly not in this release
- No authored or published exercises, course chapters or lessons.
- No fabricated completion, XP, streaks, subscriptions or learner-generated reports.
- No automated content generation, profiling, quizzes or diagnostic inference.
- No schools/cohorts, classroom dashboards, live analytics or public research claims.
- No deployment to production; this work is delivered as a GitHub pull request for review.

## Manual acceptance checklist
[ ] Browse cards: original characters, existing scenic illustrations and layered nameplate design remain.
[ ] Twenty courses are visible under All; category filter and search work.
[ ] Category and course deep links open directly and browser back returns.
[ ] Course details say "In development" and distinguish planned themes from lessons.
[ ] Lesson URLs without publication never open a playable or scored activity.
[ ] Keyboard navigation, screen-reader naming, mobile and dark mode checked.
[ ] Service worker cache version bumped; no stale page when deployed.
[ ] All existing app routes and old Journey progress remain untouched.
