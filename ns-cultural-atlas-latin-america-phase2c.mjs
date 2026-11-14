/* UNESCO-adjacent locally documented Latin America narrative. */
const RECORDS=[
  {
    "id": "uruguay-murga",
    "meta": [
      "URY",
      "Murga: the chorus that argues with Montevideo",
      "Satire & public judgement",
      "Montevideo, Uruguay",
      "Public satire makes disagreement audible when an audience recognises the people and events being addressed.",
      "Whose criticism becomes easier to hear when it is performed rather than spoken alone?",
      "Montevideo"
    ],
    "sources": [
      {
        "label": "Museo del Carnaval: history and form of Montevideo murga",
        "url": "https://www.museodelcarnaval.org/el-carnaval-de-montevideo-2/",
        "kind": "Primary museum cultural history"
      },
      {
        "label": "Uruguay Ministry of Tourism: Murga and its musical structure",
        "url": "https://uruguaynatural.com/es/masqueunpais/murga-2/",
        "kind": "National cultural account"
      },
      {
        "label": "Uruguay public education resource: the parts of a murga",
        "url": "https://uruguayeduca.anep.edu.uy/sites/default/files/inline-files/La%20Murga_pd-convertido%20%281%29.pdf",
        "kind": "Primary public teaching resource"
      }
    ],
    "images": [
      "Murga Asaltantes con Patente en el Velódromo Municipal de Montevideo - Carnaval 2024 - Berna Gaitán Otarán 01.jpg",
      "Murga Asaltantes con Patente en el Velódromo Municipal de Montevideo - Carnaval 2024 - Berna Gaitán Otarán 03.jpg"
    ],
    "paragraphs": [
      {
        "text": "In Montevideo, a murga walks onto the carnival stage wearing vivid costume and face paint, then addresses the audience through choral singing. The lyrics may turn a familiar political argument into a joke, but the point is rarely just to make somebody laugh. The chorus offers a public judgement on what happened during the year. Uruguay's Museo del Carnaval describes murga as a form of social criticism built with humour and musical caricature. A listener must understand something of the local events being mocked before the sharpest line can land.",
        "refs": [
          0,
          1
        ]
      },
      {
        "text": "A modern competition murga has seventeen people on stage under the usual format: thirteen singers, three percussionists and a director. The percussion instruments are the bombo, redoblante and platillos. Each has a job in the characteristic marcha camión rhythm. The singers are divided into vocal parts, so a passage can build its force through changing harmonies rather than simply shouting a slogan in unison. The arrangement takes rehearsal. Someone has to know when to leave room for a line of text to be heard.",
        "refs": [
          1,
          2
        ]
      },
      {
        "text": "The performance has a recognised dramatic shape. Groups introduce themselves, develop the central satirical material through cuplés and related scenes, then end with the retirada, a farewell whose music can carry a different emotional weight from the jokes before it. The Museo del Carnaval traces how Montevideo's murgas developed in the early twentieth century after contact with theatrical traditions from Cádiz. What people hear today has its own Uruguayan history, including the influence of local percussion practices. It did not arrive fully formed from Spain.",
        "refs": [
          0,
          1
        ]
      },
      {
        "text": "Satire works because its audience possesses background knowledge. If a singer changes the lyrics of a recognisable melody, listeners hear the new words against what they remember of the original. If a public official is impersonated, the joke requires people to recognise the target and the action under criticism. That shared understanding gives murga its political possibilities, though it also creates exclusions. Someone who has just arrived in Montevideo may hear an excellent chorus and still miss what its most pointed verse is about.",
        "refs": [
          0,
          2
        ]
      },
      {
        "text": "The two Commons photographs were made at the Velódromo Municipal in Montevideo during the 2024 carnival and show the murga Asaltantes con Patente. The broad view records the group onstage. A closer photograph identifies performers and their makeup. They document a particular troupe in a particular season, not every murga or the genre's early history. The museum record supplies the development of the form and the roles that the photographs let a viewer inspect in a single moment.",
        "refs": [
          0,
          1
        ]
      },
      {
        "text": "The interesting human question is how a community learns to criticise itself in public without everyone needing to make a speech alone. In murga, one person's observation becomes a set of words that thirteen voices can deliver together. That can make a joke powerful, and it can also make disagreement easier to hear. Whether a particular satire is fair still depends on what it says. The form gives people a shared occasion for argument; it does not guarantee that the judgement made there is true.",
        "refs": [
          0,
          2
        ]
      }
    ]
  }
];
export const LATIN_AMERICA_PHASE2C_META=Object.freeze(Object.fromEntries(RECORDS.map(r=>[r.id,r.meta])));
export const LATIN_AMERICA_PHASE2C=Object.freeze(Object.fromEntries(RECORDS.map(r=>[r.id,{paragraphs:r.paragraphs.map(p=>({text:p.text,sources:p.refs.map(i=>r.sources[i])})),images:r.images}])));
