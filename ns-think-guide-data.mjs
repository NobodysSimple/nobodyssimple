/* Nobody's Simple — Thinking, habits & focus / Thoughts & worry manuals.
   Shared interaction, topic-specific editorial content and skills. */
import {makeThinking} from './ns-think-builder.mjs';
import {THINK_EDITORIAL_A} from './ns-think-editorial-a.mjs';
import {THINK_EDITORIAL_B} from './ns-think-editorial-b.mjs';
import {THINK_EDITORIAL_C} from './ns-think-editorial-c.mjs';
import {THINK_EDITORIAL_D} from './ns-think-editorial-d.mjs';
import {THINK_JOURNAL_SEEDS_A} from './ns-think-journal-seeds-a.mjs';
import {THINK_JOURNAL_SEEDS_B} from './ns-think-journal-seeds-b.mjs';
import {THINK_JOURNAL_SEEDS_C} from './ns-think-journal-seeds-c.mjs';
import {THINK_JOURNAL_SEEDS_D} from './ns-think-journal-seeds-d.mjs';
import {THINK_IDEA_SEEDS_A} from './ns-think-idea-seeds-a.mjs';
import {THINK_IDEA_SEEDS_B} from './ns-think-idea-seeds-b.mjs';
import {THINK_IDEA_SEEDS_C} from './ns-think-idea-seeds-c.mjs';
import {THINK_IDEA_SEEDS_D} from './ns-think-idea-seeds-d.mjs';
const ed=[...THINK_EDITORIAL_A,...THINK_EDITORIAL_B,...THINK_EDITORIAL_C,...THINK_EDITORIAL_D];
const journals={...THINK_JOURNAL_SEEDS_A,...THINK_JOURNAL_SEEDS_B,...THINK_JOURNAL_SEEDS_C,...THINK_JOURNAL_SEEDS_D};
const ideas={...THINK_IDEA_SEEDS_A,...THINK_IDEA_SEEDS_B,...THINK_IDEA_SEEDS_C,...THINK_IDEA_SEEDS_D};
const stepHints=[
 'Choose one recent example rather than every time this has happened.',
 'Use your ordinary words. You do not need to prove the interpretation is true.',
 'Notice what your mind or behaviour did in response to the worry.',
 'A small, safe next step is enough. The optional suggestions can help.'
];
const safetyNotes={
 intrusive:'Unwanted thoughts and actual plans or intentions are different clinical concerns. If you intend to hurt yourself or someone else or cannot stay safe, seek urgent human help rather than using this journal as a risk test.',
 checking:'Follow necessary health, home and workplace safety procedures. Compulsive rechecking may need OCD-focused treatment, not a self-directed challenge to ignore hazards.',
 'obsessional-doubt':'Persistent obsessional doubts and mental checking may need OCD-focused assessment and CBT with ERP. Do not test dangerous possibilities or use this journal to obtain repeated reassurance.',
 'ritual-checking':'Do not stop essential safety checks or invent hazardous exposure tests. For repetitive rituals, ask an OCD-trained clinician about individualised CBT with ERP.',
 'mental-rituals':'Mental checking can be a compulsion even when nobody else sees it. Seek OCD-informed support if rituals take substantial time; do not treat this page as a way to prove certainty.',
 'moral-uncertainty':'If real harm occurred, proportionate accountability may be needed. If you repeatedly review memories or seek confessions to feel certain, ask about OCD-focused care rather than using the journal as another ritual.',
 'relationship-obsessions':'This page cannot establish whether a relationship is safe or compatible. Respect boundaries and consent; if there is coercion or abuse, seek practical safety support rather than treating it as an obsessive thought.',
 'jealousy-rumination':'Do not use suspicion to justify spying, threats or restricting another person’s freedom. Actual betrayal or coercion deserves a factual and safety-aware response.',
 'perceptual-uncertainty':'New or repeated unfamiliar perceptions deserve appropriate clinical assessment. Sudden confusion, severe neurological symptoms or commands to harm require urgent care; do not act on uncertain interpretations.'
};
function createIdeas(d,j){
 const base=ideas[d.id];if(!base||base.actions.length!==12||base.support.length!==12)throw Error('Missing topic ideas '+d.id);
 const actions=[...base.actions,...j.map(x=>x.practice),...d.now.steps,...j.map(x=>'Write one answer to: '+x.questions[3]),'Take a short, practical step based on what is known rather than seeking complete certainty.'];
 const support=[...base.support,...j.map(x=>'Ask for help with '+x.label.toLowerCase()+'.'),...j.map(x=>'Discuss the practical goal: '+x.practice),...d.mechanisms.map(x=>'Ask a trained professional whether '+x[0].toLowerCase()+' is relevant to your experience.'),'Ask how to recognise whether this approach is helping you over time.'];
 if(actions.length!==24||support.length!==24)throw Error('Suggestions count '+d.id);
 return {actions,support};
}
function createRoutes(d){
 const seed=journals[d.id];if(seed?.length!==4)throw Error('Missing routes '+d.id);
 return seed.map(r=>({
  id:r.id,label:r.label,title:r.label,description:r.description,
  finish:r.description,
  practiceTitle:'What you can take away',practice:r.practice,
  questions:r.questions.map((q,i)=>[
   q,
   stepHints[i],
   i===3?r.practice:d.mechanisms[i%3][1],
   i===3?(r.id==='care'||r.id==='support'||r.id==='treatment'||r.id==='freedom'?'support':'actions'):''
  ])
 }));
}
export const THINK_GUIDES=Object.freeze(ed.map(d=>makeThinking({
 ...d, routes:createRoutes(d), ideas:createIdeas(d,journals[d.id]),
 prominentSafety:d.prominentSafety||safetyNotes[d.id]||''
})));
export const THINK_IDS=Object.freeze(THINK_GUIDES.map(d=>d.id));
export const THINK_BY_ID=new Map(THINK_GUIDES.map(d=>[d.id,d]));
