/**
 * Seven original, short interactive Forest encounters. Uses the existing
 * Life Lab mission visual system; does not alter the illustrated trail.
 * Selections exist in memory. Completion is an explicit user action.
 */
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export const forestMicroLessons=Object.freeze({
  'observed-or-inferred':{
    lead:'You walk past a classmate. They do not say hello.',
    question:'Which statement reports what you observed, rather than a guess about why?',
    choices:[
      ['They deliberately ignored me.','That adds an intention. You did not see whether they noticed you.'],
      ['They walked past without saying hello.','Yes. This describes something you could check without claiming to know their reason.'],
      ['They do not like me anymore.','This is one possible interpretation, but the encounter does not establish it.']
    ],best:1,principle:'An observation describes what happened. An interpretation gives it a meaning that could still be mistaken.',
    transfer:'The next time someone reacts unexpectedly, describe only what a camera might have recorded before adding an explanation.'
  },
  'feeling-not-proof':{
    lead:'Your friend replies with a single word: “Okay.” Your chest tightens and you worry that they are angry.',
    question:'What does that feeling tell you most reliably?',
    choices:[
      ['They must be upset with me.','Strong feelings can accompany an interpretation without confirming it.'],
      ['My reaction is real, but their intention is still unknown.','Exactly. Your feeling is important information about your experience, not direct evidence of their motive.'],
      ['The feeling is irrational and should be ignored.','Feelings do not prove another person’s motive, but they still deserve attention and understanding.']
    ],best:1,principle:'A feeling can be valid as an experience without making the story attached to it factually certain.',
    transfer:'Try saying “I feel worried” instead of “I know they are annoyed” when the evidence is incomplete.'
  },
  'unknown-is-unknown':{
    lead:'A colleague misses a meeting without explanation. You are tempted to fill in the blank.',
    question:'Which conclusion best fits the evidence so far?',
    choices:[
      ['They are irresponsible.','A missed meeting may matter, but one event is not enough to establish a stable character trait.'],
      ['Something serious definitely happened.','That is also an untested explanation. A kinder story is not automatically a true story.'],
      ['They were absent; the reason is not established yet.','Right. Uncertainty is an accurate conclusion when necessary information is missing.']
    ],best:2,principle:'“I do not know yet” is a meaningful conclusion, not a failure to think.',
    transfer:'Write down one thing you know, one thing you suspect and one thing you cannot tell.'
  },
  'competing-explanations':{
    lead:'Someone you normally chat with answers less often this week.',
    question:'How could you reason about this without jumping to one story?',
    choices:[
      ['List several plausible explanations, including changes unrelated to me.','Yes. Keeping alternatives alive reduces the risk of treating the first explanation as the whole truth.'],
      ['Choose the most reassuring explanation and trust it.','Reassurance may ease discomfort, but a pleasant guess is still a guess.'],
      ['Choose the worst explanation so I am prepared.','Protective anticipation can feel useful, but selecting the worst story does not make it more likely.']
    ],best:0,principle:'Several explanations can fit the same observation. The aim is not endless guessing, but avoiding premature certainty.',
    transfer:'Before deciding what a short message means, name at least one plausible alternative to your first impression.'
  },
  'discriminating-evidence':{
    lead:'You think a friend is avoiding you because they cancelled plans once.',
    question:'What further information would best help distinguish possible explanations?',
    choices:[
      ['How intense my worry becomes.','That describes your concern, not their reason for cancelling.'],
      ['Whether a pattern emerges or a respectful clarification is possible.','Yes. Relevant new behaviour or a straightforward conversation may separate competing explanations.'],
      ['How similar this feels to a past rejection.','Past experiences can shape expectations without establishing what happened this time.']
    ],best:1,principle:'Good evidence is information that helps tell competing possibilities apart. It still may not give absolute certainty.',
    transfer:'When you have two competing stories, ask what new observation would actually help distinguish them.'
  },
  'hidden-assumption':{
    lead:'A group makes plans without mentioning you. You think: “They all secretly dislike me.”',
    question:'Which part of the thought is the assumption worth examining?',
    choices:[
      ['The group made plans.','That is the starting observation, although the details may still need checking.'],
      ['The group has people in it.','This is not the explanatory leap that needs investigation.'],
      ['Their private feelings toward me explain the exclusion.','Correct. Their private feelings are being inferred from an event that could have several causes.']
    ],best:2,principle:'Hidden assumptions often smuggle a motive or general rule into a description of an event.',
    transfer:'Underline the word or phrase in a worrying thought that claims to know another person’s motives.'
  },
  'confidence-and-certainty':{
    lead:'After several ambiguous interactions, you lean toward one explanation but still lack direct confirmation.',
    question:'What is the most defensible way to express your conclusion?',
    choices:[
      ['There is a possibility, but I could be wrong and would revise it with evidence.','Yes. Confidence can be proportionate to the evidence without pretending to be certainty.'],
      ['If I feel confident, the explanation is a fact.','Confidence is a psychological state, not a substitute for evidence.'],
      ['I must give every possible explanation equal weight forever.','Keeping an open mind does not require treating all explanations as equally well supported.']
    ],best:0,principle:'You can make provisional judgements while remaining willing to change them when evidence changes.',
    transfer:'Try “My best guess is…” followed by the evidence you would need to revise that guess.'
  }
});

