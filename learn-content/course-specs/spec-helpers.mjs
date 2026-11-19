/** Authored lesson spec normalisation. It fills technical fields, not teaching content. */
export function completeSpec(s){
 const c=s.case;
 return {...s,
  objective:s.objective||'Explain '+s.concept+' using evidence from the lesson, test rival accounts and apply the idea to a new case.',
  teach:s.teach||s.opening.split(/(?<=[.!?])\s+/).slice(0,3).join(' '),
  takeaway:s.takeaway||s.closing.split(/(?<=[.!?])\s+/).slice(-2).join(' '),
  label:s.label||c.turns.map((t,i)=>({text:(t[0]==='a'?c.a:c.b)+': '+t[1],answer:(s.clueIndices||[]).includes(i)})),
  labelPrompt:s.labelPrompt||'Select the two strongest pieces of evidence for the leading explanation. Which lines tell us what matters to the speaker?',
  labelExplanation:s.labelExplanation||s.insight,
  cyclePrompt:s.cyclePrompt||'Arrange the four events into a possible sequence. Which step might help keep the pattern going?',
  cycleExplanation:s.cycleExplanation||s.insight,
  rankPrompt:s.rankPrompt||'Put the explanation with the strongest support first. The lower two remain open to revision.',
  rankExplanation:s.rankExplanation||s.insight,
  case:{
   ...c,question:c.question||'Watch the exchange and look for what changes the meaning of the disagreement.',
   firstQuestion:c.firstQuestion||'Which reading fits the words in this exchange?',
   firstOptions:c.firstOptions||s.hypotheses,
   firstExplanation:c.firstExplanation||s.insight,
   secondQuestion:c.secondQuestion||'What is the strongest next move given what the characters know?',
   secondOptions:c.secondOptions||s.action.changes,
   secondExplanation:c.secondExplanation||s.action.explanation,
   firstAnswer:c.firstAnswer??0,secondAnswer:c.secondAnswer??0,
   focus:c.focus??3
  },
  boundary:s.boundary||s.complication.split(/(?<=[.!?])\s+/).slice(-2).join(' '),
  duration:s.duration||12,
  sources:s.sources
 };
}
