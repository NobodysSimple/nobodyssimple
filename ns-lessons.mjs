/**
 * Nobody's Simple / Stage 4 lesson data.
 * The interactive teaching demonstration below is original instructional
 * content. It is not part of the editorial publishing catalogue or a
 * validated psychological assessment. Future lessons can use this schema.
 */
export const NS_SKILL_PATHS = Object.freeze([
  {
    id:'meadow',title:'The Meadow',subtitle:'Feelings & body',tagline:'Notice what you feel, without needing one perfect label.',
    art:'ns-landscape-feel.webp',tone:'meadow',firstLesson:null,
    tools:[{title:'Mixed Feelings',href:'#tool/mixed-feelings'},{title:'Body Check',href:'#tool/body-check'}]
  },
  {
    id:'forest',title:'The Forest',subtitle:'Thought & uncertainty',tagline:'Find the difference between what happened and the story you added.',
    art:'ns-landscape-think.webp',tone:'forest',firstLesson:'observation-or-story',
    tools:[{title:'Reality Map',href:'#tool/reality-map'},{title:'Assumption Finder',href:'#tool/assumption-finder'}]
  },
  {
    id:'bridge',title:'The Bridge',subtitle:'People & relationships',tagline:'Practise perspective-taking, boundaries and repair.',
    art:'ns-landscape-relate.webp',tone:'bridge',firstLesson:null,
    tools:[{title:'Conversation Map',href:'#tool/conversation-map'},{title:'Boundary Builder',href:'#tool/boundary-builder'}]
  },
  {
    id:'workshop',title:'The Workshop',subtitle:'Decisions & action',tagline:'Turn a difficult decision into a workable next step.',
    art:'ns-landscape-choose.webp',tone:'workshop',firstLesson:null,
    tools:[{title:'Small Step',href:'#tool/small-step'},{title:'Friction Finder',href:'#tool/friction'}]
  },
  {
    id:'observatory',title:'The Observatory',subtitle:'Self & society',tagline:'Explore how context changes behaviour and self-understanding.',
    art:'ns-landscape-identity.webp',tone:'observatory',firstLesson:null,
    tools:[{title:'Identity Map',href:'#tool/identity-map'},{title:'Values Discovery',href:'#tool/values-discovery'}]
  }
]);

export const NS_LESSONS = Object.freeze({
  'observation-or-story':{
    id:'observation-or-story',version:1,
    title:'What happened—and what did I assume?',
    shortTitle:'Fact or story?',
    subtitle:'Separate what you know from what you think might be true.',
    path:'forest',durationLabel:'About 4 minutes',level:'Start here',
    objective:'Distinguish an observation, an interpretation, a feeling and an unknown; then consider more useful evidence and possible responses.',
    cover:'ns-landscape-think.webp',mascot:'ns-character-thinking.webp',
    steps:[
      {
        id:'situation',kind:'scene',eyebrow:'01 · A small moment',title:'A short message. A big interpretation.',
        lead:'You suggest meeting a friend this Saturday. A few minutes later they reply:',
        quote:'OK.',
        detail:'You start wondering if they are annoyed with you. That possibility might be true—but what do you actually know?',
        learning:'In the next few steps, you’ll practise noticing the difference between an event and your explanation of it.'
      },
      {
        id:'notice',kind:'question',eyebrow:'02 · Notice',title:'What kind of statement is this?',
        lead:'“My friend replied with the message OK.”',
        prompt:'Which description fits best?',
        choices:[
          {id:'observed',label:'Something I observed'},
          {id:'inferred',label:'An interpretation I made'},
          {id:'felt',label:'A feeling I experienced'},
          {id:'unknown',label:'Something I cannot yet know'}
        ],
        feedback:{
          observed:{heading:'Yes — that is the observation.',text:'You can check the exact words they sent. You still do not know the intention behind them.'},
          inferred:{heading:'The message itself is an observation.',text:'The meaning you give those two letters would be an interpretation. Notice how easily the two can blur.'},
          felt:{heading:'Try separating the message from your reaction.',text:'Worry or hurt could be feelings. The words on the screen are something you observed.'},
          unknown:{heading:'Some things remain unknown, but not this one.',text:'The message was sent, so you can observe it. Whether your friend was annoyed is not established.'}
        }
      },
      {
        id:'interpretation',kind:'question',eyebrow:'03 · Explore',title:'Now name the interpretation.',
        lead:'“They replied that way because they are angry with me.”',
        prompt:'What kind of statement is that?',
        choices:[
          {id:'observed',label:'A directly observed fact'},
          {id:'inferred',label:'A possible interpretation'},
          {id:'felt',label:'A physical sensation'},
          {id:'certain',label:'A conclusion I can now be sure of'}
        ],
        feedback:{
          observed:{heading:'The motive was not directly observed.',text:'You observed a message, but you inferred a reason for it. A plausible explanation is not yet a fact.'},
          inferred:{heading:'Exactly — it is one possibility.',text:'The message is real. The explanation about anger is an inference. It could turn out to be true, but it has not been verified.'},
          felt:{heading:'This is a thought about their motive.',text:'Feeling anxious may accompany the thought, but the statement describes an inferred explanation of another person’s behaviour.'},
          certain:{heading:'Certainty would go beyond the evidence.',text:'A brief reply has many possible causes. You need more information before concluding what your friend intended.'}
        }
      },
      {
        id:'evidence',kind:'question',eyebrow:'04 · Investigate',title:'What information would help?',
        lead:'You have at least two explanations: your friend is upset, or they simply sent a quick reply while busy.',
        prompt:'Which observation would be most useful for telling these explanations apart?',
        choices:[
          {id:'pattern',label:'Whether their behaviour toward you has changed across several interactions'},
          {id:'worry',label:'How strongly you feel worried about the message'},
          {id:'memory',label:'Remembering a time when someone else was annoyed with you'}
        ],
        feedback:{
          pattern:{heading:'That would be more informative.',text:'A consistent change in behaviour could help distinguish explanations. Even then, it would not prove a specific motive.'},
          worry:{heading:'Your worry matters, but it is not proof of their intention.',text:'Feelings can tell you a situation feels important or uncertain. They cannot, on their own, establish another person’s thoughts.'},
          memory:{heading:'A memory can influence your expectation.',text:'An earlier experience might explain why this interpretation feels familiar, but it does not establish what this particular friend means.'}
        }
      },
      {
        id:'response',kind:'question',eyebrow:'05 · Choose',title:'You can respond without certainty.',
        lead:'No one can tell you what the short message really meant. You still have choices.',
        prompt:'What might be a flexible next step in an ordinary, safe situation?',
        choices:[
          {id:'clarify',label:'Ask a neutral, low-pressure question when it makes sense'},
          {id:'wait',label:'Give it some time and see whether more context appears'},
          {id:'accuse',label:'Send a message accusing them of being angry'}
        ],
        feedback:{
          clarify:{heading:'A reasonable option.',text:'A neutral check-in can invite useful information without assuming what the other person meant. They may still choose not to explain.'},
          wait:{heading:'That can also be reasonable.',text:'Not every uncertainty requires an immediate conversation. Waiting can prevent an unnecessary escalation when nothing urgent depends on knowing.'},
          accuse:{heading:'Consider the assumption built into that response.',text:'An accusation treats a possibility as an established fact. A neutral question—or waiting—usually leaves more room for what you do not yet know.'}
        }
      },
      {
        id:'takeaway',kind:'review',eyebrow:'06 · Take with you',title:'A thought can be useful without being a fact.',
        lead:'A short message was the observation. Anger was a possible explanation. Your worry was a feeling. The other person’s motive remained uncertain.',
        takeaway:'Next time a thought feels certain, ask: “What did I actually observe? What explanation am I adding? What would help me find out?”',
        detail:'This is a thinking skill, not a guarantee that the most reassuring explanation is correct. Sometimes an uncomfortable interpretation is accurate; the point is to judge it using the best information available.'
      }
    ]
  }
});
export const lessonRecordId = id => `ns-skill:${id}`;
