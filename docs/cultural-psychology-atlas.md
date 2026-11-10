# Cultural Psychology Atlas — homepage feature

## Placement
The interactive Culture Atlas is rendered at the bottom of `#home`, after the existing feedback shortcut. It is not a separate navigation tile or tool. Its markup and behaviour live in `ns-cultural-atlas.mjs`, styling in `ns-cultural-atlas.css`, and editorial stories in `ns-cultural-atlas-articles.mjs`.

## Geography
- `data/culture-world-countries.geojson` is a simplified ~1.2 MB vector file derived from the Natural Earth country dataset as distributed by `datasets/geo-countries`; Natural Earth declares its map data public domain (https://www.naturalearthdata.com/about/terms-of-use/). Contains 258 selectable countries, territories, and mapped units, not a claim that there are 258 sovereign nations.
- Maps are illustrative. Statehood and border disputes must not be inferred from mapped line placement.
- The frontend loads country polygons lazily when the user approaches the bottom section.
- On country selection, the frontend requests `https://www.geoboundaries.org/api/current/gbOpen/{ISO3}/ADM1/`, then the metadata's `simplifiedGeometryGeoJSON` URL. geoBoundaries gbOpen is CC BY 4.0 and/or ODbL; inspect the returned boundary metadata for the actual licence of any redistributed regional files (https://www.geoboundaries.org/api.html). The UI credits the service. Availability, completeness and names vary; regions require internet access. Non-ISO shapes and unsupported countries may not have ADM1 coverage.
- The country select and region select supplement mouse/touch and keyboard map interaction. The selected country and region use distinct fills. The world-view button resets selection.
- Browser coverage mocks the subdivision endpoint to avoid depending on third-party service availability in CI. Live external CORS availability and regional naming should also be checked after deployment.

## Editorial coverage
- Version 1 ships 15 source-linked short articles representing documented practices in **12 countries**, not a story for every country on the map. The reader labels unavailable entries explicitly rather than generating unsupported cultural generalisations.
- The random discovery button chooses **a country with a published story** so it always has something substantive to show.
- Every article comprises documentary context, a separate tentative psychological interpretation, an optional reflection question and a primary documentary source link. UNESCO inscription is evidence of a tradition, **not evidence of a psychological or clinical outcome**.
- Country-level stories remain visible after selecting a region, but the UI warns when the story is not genuinely region-specific. Region-tagged stories appear first when their name matches.
- Do not portray traditions as universally practiced, imply that a specific culture has an inherent psychological personality, appropriate restricted practices, or call an authored reflective prompt a validated intervention.

## Future work
- Add geographically distributed, community-informed and source-checked contributions to `ns-cultural-atlas-articles.mjs`. Create more than one story per country to support the browsing interaction.
- Extend local/cached ADM1 availability and preserve licence requirements for any redistributed subdivision datasets. Consider jurisdictional naming and border review.
- Review article perspectives with knowledgeable community members, including the right to correct, contest or withdraw descriptions.
- Make content editorship accessible through the existing staff publication workflow once governance and moderation are agreed.
