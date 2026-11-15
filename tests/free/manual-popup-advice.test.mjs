import test from 'node:test';
import assert from 'node:assert/strict';
import {practicalPopupIdeas} from '../../ns-manual-popup-advice.mjs';
import {MOOD_GUIDES} from '../../ns-mood-guide-data.mjs';
import {THINK_GUIDES} from '../../ns-think-guide-data.mjs';
import {HABIT_GUIDES} from '../../ns-habit-guide-data.mjs';
import {FOCUS_GUIDES} from '../../ns-focus-guide-data.mjs';
import {BEHAVIOUR_GUIDES} from '../../ns-behaviour-guide-data.mjs';
import {CONNECTION_GUIDES} from '../../ns-connection-guide-data.mjs';
import {FHS_GUIDES} from '../../ns-fhs-guide-data.mjs';
import {CFM_GUIDES_FULL} from '../../ns-cfm-manual-data.mjs';
import {IMAGE_GUIDES} from '../../ns-self-image-guide-data.mjs';
import {DIGITAL_GUIDES} from '../../ns-digital-guide-data.mjs';
import {BODY_GUIDES} from '../../ns-body-guide-data.mjs';
import {CLINICAL_GUIDES} from '../../ns-clinical-guide-data.mjs';
import {EXPERIENCE_GUIDES} from '../../ns-experiences-guide-data.mjs';

const groups=[
 MOOD_GUIDES,THINK_GUIDES,HABIT_GUIDES,FOCUS_GUIDES,BEHAVIOUR_GUIDES,
 CONNECTION_GUIDES,FHS_GUIDES,CFM_GUIDES_FULL,IMAGE_GUIDES,DIGITAL_GUIDES,
 BODY_GUIDES,CLINICAL_GUIDES,EXPERIENCE_GUIDES
];
const boilerplate=/^(?:explore what would need to change before attempting this|write one answer to|write a few words about this question|ask a trusted person about the practical concern behind|talk this through with someone who listens|request support for this possible step|consider whether this is relevant to your situation|use this worked example to ask|discuss the practical goal|ask a trained professional whether)/i;

test('every field-guide catalogue shows original direct advice and no automatic padding',()=>{
 const guides=groups.flat();
 assert.ok(guides.length>=280,'expected the full set of field-guide catalogues');
 let popups=0;
 for(const g of guides){
  if(!g.ideas || !Object.keys(g.ideas).length)continue;
  for(const key of Object.keys(g.ideas)){
   const selected=practicalPopupIdeas(g,key);
   assert.ok(selected.length>=3,g.id+' '+key+' has too little direct guidance');
   assert.ok(selected.length<=12,g.id+' '+key+' has excessive advice');
   assert.equal(new Set(selected).size,selected.length,g.id+' '+key+' repeats advice');
   assert.ok(selected.every(x=>!boilerplate.test(x)),g.id+' '+key+' has templated lead-ins');
   popups++;
  }
 }
 assert.ok(popups>=180,'not enough popup groups checked');
});
test('the previously reported awkward material is excluded rather than rephrased mechanically',()=>{
 const guide={ideas:{support:[
 'Ask a trusted person about the practical concern behind fear of wasted life: You worry you will never live meaningfully enough.',
 'Explore what would need to change before attempting this: Decide which adaptations are useful.',
 'Write a few words about this question, if it is helpful: What happened?',
 'Ask about CBT as a possible treatment.',
 'Ask about CBT as a possible treatment.',
 'Request a clear follow-up date.'
 ]}};
 assert.deepEqual(practicalPopupIdeas(guide,'support'),[
  'Ask about CBT as a possible treatment.','Request a clear follow-up date.'
 ]);
});
test('high-risk CFM guidance retains its specific safety recommendations',()=>{
 const asylum=CFM_GUIDES_FULL.find(g=>g.id==='asylum-stress');
 const exploitation=CFM_GUIDES_FULL.find(g=>g.id==='migrant-work-exploitation');
 assert.ok(practicalPopupIdeas(asylum,'support').some(x=>/qualified|legal|representative/i.test(x)));
 assert.ok(practicalPopupIdeas(exploitation,'actions').some(x=>/sponsorship|employer|legal/i.test(x)));
});
