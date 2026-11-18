# Course Lab — staff authoring and publishing (v1)
Updated 18 November 2026. The **Course Lab** lives at `staff.html` behind the existing GitHub owner-token login.

## First-time workflow
1. Open `staff.html`; connect with the repository owner account using an appropriately scoped GitHub token. The token is held in this page's memory only.
2. Click **Course Lab** in the staff rail. Choose any of the existing 20 Learn courses from the selector. Each course has a permanent ID; changing the title does not break existing links.
3. Edit the public title and summary. Click **＋ Unit** to create an ordered unit and **＋ Lesson** to create a lesson inside it.
4. Add any number of nodes to each lesson, mixing reading pages, images, and exercises in the exact desired order.
5. Select a node in the centre panel to edit the template's fields in the right inspector. Move nodes up/down or drag them to reorder; duplicate and delete are supported. Lessons and units also have move controls.
6. **Save draft** stores the entire course locally in this browser. Drafts are also autosaved. **Export** creates a JSON backup. **Import** restores that same course's draft from a JSON file.
7. **Preview lesson** runs the actual public Learn player without saving learner progress. Complete every exercise and inspect explanations before publishing.
8. **Publish course** validates the complete course and commits one versioned `learn-content/courses/{courseId}.json` bundle and `learn-content/index.json` index **in the same GitHub commit**.
9. After GitHub Pages deploys, the correct Learn card shows the published course and its lessons at `#learn/course/{courseId}`. Opening the lesson uses `#learn/lesson/{courseId}/{lessonId}`.
10. **Unpublish** removes that course's entry from the public index but does not delete its content history or visitors' saved progress. Republishing uses new versioning and should be reviewed.

## Node templates
- **Reading page:** free text with paragraphs, optional image, caption, attribution and source note; Continue advances without scoring.
- **Image / diagram:** a full image page, accessible alt text and optional caption/source.
- **Match concepts:** connect precise examples to distinct concepts.
- **Sort categories:** assign examples to categories; authors decide boundaries.
- **Label the evidence:** selectable phrase tiles, with one or more explicitly marked answers.
- **Fill the blank:** typed recall, with multiple accepted responses and an optional hint.
- **Choose explanation:** a multiple-choice psychological distinction.
- **Build a chain:** arrange mechanism steps in the order supplied by the author.
- **Repair the flaw:** select the best correction to an erroneous inference.
- **Evidence investigator:** choose the most discriminating available evidence.
- **What happens if?:** choose a system change and the best-supported prediction.
- **Help the character:** select evidence and a proportionate next response.

Every question has a **concept ID**, an answer explanation and a counterexample/boundary to prevent oversimplification. Multiple-choice distractors should be plausible. Authors should include uncertain or 'insufficient information' answers when justified, and avoid amateur diagnosis or dangerous confrontation advice.

## Images
- Click **Browse / upload image** on the selected node. Browse existing GitHub repository images, or upload a PNG, JPG, WebP or GIF under 8 MB.
- Uploaded files are committed immediately to `media/courses/{courseId}/`; the course itself is still an unpublished local draft until you publish it. Uploads are therefore technically public site files before course release.
- Image path, meaningful alt text, captions and attribution are editable. Node validation checks safe relative paths and descriptions.

## Data, security, version control
- Staff login uses `Publisher.connect()` to confirm GitHub owner push access. Publishing requests are not available to public learners. Never put tokens in course data.
- The browser draft is **not** the canonical public copy. Publication writes immutable Git commits to `main`, with optimistic version checks. If another editor publishes first, Course Lab blocks overwriting until refreshed.
- Course JSON is split into per-course files, reducing load, maintenance and edit conflicts. The public index contains only versions and card metadata.
- Public Learn fetches the index without caching, then fetches one selected course. The empty starting index publishes no lessons.
- Introductory text, explanations and media are displayed as escaped text or restricted site media paths, never arbitrary executable HTML.
- Progress is stored by stable lesson ID in the existing namespaced account-learning record; publishing does not wipe earlier Journey data.
- Larger deployments may benefit from editorial history/version rollbacks, per-concept analytics and server-backed review scheduling. These are not part of v1.

## QA checklist before publishing
- Complete every reading page and exercise field, including sources where relevant.
- Preview the entire lesson end to end on desktop and mobile.
- Confirm answer keys are correct, misleading distractors are deliberate, and feedback explains the distinction.
- Confirm images are authorised for use, correctly credited and described for screen readers.
- Check character-based decisions do not imply unsupported diagnosis or guaranteed outcomes.
- Confirm the course title and Learn card description are accurate.
- Read the publication status. A GitHub commit is **not** proof GitHub Pages has finished deploying.
