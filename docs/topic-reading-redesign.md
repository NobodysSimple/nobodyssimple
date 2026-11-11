# Topic guide redesign: recognition first, practical next steps

## Scope
This change updates the psychoeducational layout on **all 518 named Atlas topics** rendered by `workbookForTopic(id)`. It does **not** replace the 49 choice-led workbook routes, their original methods, the existing intervention carousel, its per-approach private worksheet/journal, downloads, or the separate visual game carousel.

The shared topic renderer assembles authored information already present in each Atlas profile (`definition`, `signs`, `variants`, `maintainers`, `contributors`, `targets`, `progress`, `cautions`, `sources`) into one accessible reading structure. It also uses a bounded set of **editorial topic-family lenses**, rather than asserting an identical mechanism or recovery sequence for every topic.

## Visible experience
1. **Recognise** — natural-language examples based on the topic's own signs and situations. The first viewport is for understanding, not a questionnaire.
2. **Understand** — a central explanatory reframe, the current source definition, a labelled *possible* sequence where available, and four explanatory parts. More nuanced factors are available in a collapsed details section.
3. **Explore, if useful** — four optional checkboxes for the relevant explanatory parts. The page repeats selected labels only; there is **no score, severity classification, diagnostic label, storage or submission**. For safety/support-first topics the checkboxes are absent.
4. **What can make this harder?** — three or four short, expandable misconceptions or traps. The text avoids assigning responsibility for real-life harm to the person affected.
5. **Ways forward** — four relevant directions or considerations, not mandatory treatment stages. For purely social, disability, cultural, sexual/gender identity or structural issues these are autonomy, access, resources, safety and rights, not "recovery from an identity".
6. **Existing tools and journal** — unchanged intervention-card selection by family, modal details, one chosen optional worksheet, private drafts, downloads, and optional additional tools. The existing visual game carousel follows.
7. **How to notice change** — progress markers are broader than symptom disappearance; function, practical access, autonomy, safety and support also count.
8. **Common questions** — collapsed, cautious FAQs that avoid forced reassurance, obligatory forgiveness, recovery promises, self-diagnosis and blanket medical claims.
9. **When more support might help** — practical/clinical support, informed by whether the existing guide is medical, support-first or crisis/safety-first.
10. **A gentle ending** — a brief memorable message avoiding demands to feel better or complete a sequence.

A dedicated **betrayal-trauma** editorial profile follows the user's illustrative four-injuries/four-directions structure, including recognition, uncertainty, reconciliation and forgiveness distinctions. Its wording is conditional rather than a claim that everyone has four injuries or a formal diagnosis.

## High-stakes distinctions
- **28 existing safety-first topics** continue directly to the original human-support-first section with no interactive checklist, worksheet or game. They receive only a quiet additional explanation after the safety links. Emergency help remains prominent.
- **Support-first, non-crisis entries** suppress the private self-reflection checklist and show an immediate privacy and safety note.
- **Medical entries** keep a visible recommendation for appropriate assessment of concerning symptoms. No new unvalidated clinical screening is introduced.
- **352 context-first editorial topics** remain visibly marked as *not individually evidence-reviewed*. Their content does not pathologise identity, access needs, culturally specific experiences, discrimination or consensual preferences.
- Topic-specific four-part summaries are *editorial scaffolds* derived from existing data. They are **not** four empirically established stages of recovery, formal diagnostic profiles or individually validated interventions. Do not use language like "psychologist-designed treatment" without individual review and provenance.

## Visual and accessibility choices
The reading area uses one warm, paper-like column, modest accent colour, whitespace and subtle dividing lines rather than a separate coloured box for each concept. Only the optional self-reflection is in a muted tinted surface. Deeper explanations and FAQs are hidden behind native `details` controls. Primary jump controls are **buttons**, not `#fragment` links, because the application uses hash routing; clicking them preserves the current topic URL and moves keyboard focus to the target heading. Text remains responsive for small screens, honours reduced-motion settings, and has dark-mode styles.

Rationale: [W3C WAI: clear and understandable page structure](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o2p03-page-structure/), [W3C WAI: manageable content quantities](https://www.w3.org/WAI/WCAG2/supplemental/patterns/o5p03-manageable-quantity/), [NICE NG116 on PTSD assessment](https://www.nice.org.uk/guidance/ng116/chapter/recommendations). These references guide safe editorial design but do not validate any newly assembled page as an intervention.

## Quality assurance
The real Atlas source catalogue was evaluated against the new content-model and rendering functions for all **518** topics: 518/518 passed non-empty section, four-part, FAQ and caution checks. It includes 28 safety-first, 352 context-first and 46 medically flagged entries. Dedicated Node and Playwright tests cover this contract, private check-in interaction, the authored betrayal case, mobile layout, pre-existing game/journal affordances and safety-first exclusions.

Full Playwright tests on a live site and external expert review of individual psychology articles remain necessary before treating every entry as a final clinically reviewed resource.
