# Inclusive Navigation Console topic expansion · 9 November 2026

## Scope and inventory

This change preserves all 166 pre-existing Atlas entries and adds 352 new named experiences across 20 missing families, for **518 selectable topics across 31 topic areas**.

The new families are race/ethnicity/culture, LGBTQIA+/gender/orientation, neurodivergence, disability and chronic health, family systems, abuse/exploitation/safety, sexual and reproductive wellbeing, class/inequality, migration, faith, digital life, education/work, life stages, friendship/relationships, trauma/grief, compulsive and impulsive behaviours, mental healthcare experiences, environment/society, appearance and body stigma, and strengths/positive functioning.

These are *lived-experience entry points*, not 352 validated clinical guides or confirmed causal models. Entries focus on recognisable user-language concerns, cover protective and affirmative experiences, and do not treat an identity, neurotype or consensual preference as a disorder.

## Integration

- `#navigate/atlas` includes every entry and 31 area filters. Six high-priority underrepresented areas have one-click chips, and the full list appears in an accessible category selector. Search normalises punctuation/case, including `LGBTQIA+` and common condition names. The initial view renders 48 cards with voluntary pagination instead of hundreds of cards at once.
- `#workbook-topic/<id>` resolves every new topic through `atlasProfile` and `workbookForTopic`, alongside the original 166.
- The workbook uses context-first language where appropriate: conditions, choices, access, health, safety and support rather than assuming a personal maintaining mechanism. Personal notes are optional. Old `#atlas` guide paths also use an adjusted context-first heading.
- Urgent current-harm entries (`stalking`, `sexual-coercion`, `reproductive-coercion`, etc.) are safety-first. Other experiences may offer contextual reflection without requiring disclosure. Medical entries carry physical-health considerations.
- Distinct entries are not duplicated solely because they have related aliases. Synonyms aid retrieval, and each topic has a single canonical ID.

## Editorial / clinical limitations

Every new entry has an explicitly **unreviewed editorial** status. Its generic reflection chapter does not constitute an individualised, evidence-verified intervention. No disease prevalence, causal claims, treatment efficacy, or specific references were invented. Entries with no source reviewed display that absence; a generic psychological link is not presented as specific evidence for racism, identity or disability. Existing specialist pathways retain their authored content and references.

This release provides **breadth of navigation and a usable scaffold**, not finished expert-written depth on all new topics. Further topic-by-topic review should involve appropriately qualified reviewers and people with lived experience, particularly for race/discrimination, LGBTQIA+, autism and other neurotypes, abuse, trauma, reproduction and serious mental health conditions. Review safeguarding language and regional support pathways before claiming clinical readiness.

## Regression expectations

The test suite checks that:
- all 352 new IDs are distinct from the 166 existing IDs;
- all 20 families are represented and all 518 routes open guides;
- identity and consensual preferences are not flagged as disorders;
- risk-sensitive routes prioritise support;
- search finds common user terms and the interface handles pagination and accessibility.
