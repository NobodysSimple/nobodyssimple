/* Forty-nine independent editorial depth sets for Identity & self-image.
 * Keep the existing ten-paragraph articles, clinical sourcing and eight
 * individually written supports. Replace the template-based reflection layer.
 */
import {SELF_IMAGE_DEPTH_IDENTITY} from './ns-self-image-depth-identity.mjs';
import {SELF_IMAGE_DEPTH_LGBTQ_A} from './ns-self-image-depth-lgbtq-a.mjs';
import {SELF_IMAGE_DEPTH_LGBTQ_B} from './ns-self-image-depth-lgbtq-b.mjs';
import {SELF_IMAGE_DEPTH_APPEARANCE} from './ns-self-image-depth-appearance.mjs';

const authored={...SELF_IMAGE_DEPTH_IDENTITY,...SELF_IMAGE_DEPTH_LGBTQ_A,...SELF_IMAGE_DEPTH_LGBTQ_B,...SELF_IMAGE_DEPTH_APPEARANCE};
if(Object.keys(authored).length!==49)throw new Error('Expected 49 independently written self-image depth sets');
const clean=s=>String(s).replace(/[.!?]+$/,'').trim();
const context={
 identity:'Consider what belongs to your own judgement. A learned rule may matter, while the present relationship and available choices still deserve attention.',
 lgbtq:'Respect your identity and your right to privacy. Disclosure or expression should remain your decision, and real discrimination requires practical protection.',
 appearance:'Separate the treatment you have received from your own appearance judgement. Health needs deserve proper assessment, and nobody must change their appearance to earn respect.'
};
const needQuestion={
 identity:'What did you want or value at that moment before anybody else responded?',
 lgbtq:'What recognition, privacy or freedom would have helped in that particular situation?',
 appearance:'What would have made the setting more respectful or accessible, regardless of your appearance?'
};
const riskQuestion={
 identity:'Which other person or practical circumstance limited your freedom to choose?',
 lgbtq:'What actual safety or disclosure risk was present, and which information is safe to share?',
 appearance:'Were other people treating you unfairly, or were you responding to a feared judgement? Both can affect your choices.'
};
const actionQuestion={
 identity:'What small action would teach you something about your own preference in everyday life?',
 lgbtq:'Which step would respect your choices while leaving you free to change your mind?',
 appearance:'What could help you participate in life without waiting for your appearance to feel acceptable?'
};
const riskCases=new Set(['coming-out-rejection','transphobia','homophobia','misgendering','deadnaming','intersex-stigma','trans-healthcare-barriers','identity-privacy-safety','religion-lgbtq-conflict','appearance-bullying','eating-weight-stigma','weight-stigma','body-dysmorphic-concerns']);
function enrichedExamples(g,domain,d){
 const result=[];
 for(let i=0;i<4;i++){
  const base=g.whyCases.slice(i*4,i*4+4),target=d[2][i];
  const existing=base[0],framed={...existing,interpretation:existing.interpretation,
    response:'The immediate response may depend on your past experiences and your current safety.',
    function:context[domain],adaptation:g.profiles[i][1],rule:context[domain],action:g.routes[i].practice};
  result.push(framed);
  result.push({...base[1],situation:target[0],interpretation:target[1],
   emotion:domain==='lgbtq'?'You may feel recognised or rejected. Your reaction is yours to describe.':
     domain==='appearance'?'The experience may bring embarrassment or hurt, depending on what happened.':
     'Your feelings may depend on what this moment meant in your wider life.',
   response:domain==='lgbtq'?'How you respond should reflect your wishes and the safety of disclosure.':
     'You may want reassurance or a practical change. Your response need not match someone else’s.',
   function:context[domain],need:g.profiles[i][0],rule:target[1],
   adaptation:g.profiles[i][1],alternative:g.routes[i].practice,
   action:g.routes[i].practice,root:'path-'+i});
  result.push({...base[2],function:context[domain]});
  result.push({...base[3],function:context[domain]});
 }
 // A new authored situation can coincide with a sentence already selected
 // from the article. Keep every authored anchor and choose an unused original.
 const used=new Set();
 const reserve=new Set([1,5,9,13]);
 for(const n of reserve){const current=result[n].situation;if(used.has(current))throw new Error('Duplicate new-authored situation for '+g.id);used.add(current);}
 for(let n=0;n<result.length;n++){
  if(reserve.has(n))continue;
  const current=result[n].situation;
  if(used.has(current)){
   const unused=g.whyCases.find(c=>!used.has(c.situation));
   if(!unused)throw new Error('No distinct original example for '+g.id);
   result[n]={...result[n],situation:unused.situation};
  }
  used.add(result[n].situation);
 }
 if(result.length!==16||used.size!==16)throw new Error('Repeated contextual cases for '+g.id);
 return result;
}
export function deepenSelfImageGuide(g,domain){
 const d=authored[g.id];
 if(!d||d.length!==3||d[0].length<160||d[1].length!==4||d[2].length!==4)throw new Error('Missing authored depth for '+g.id);
 const routes=g.routes.map((r,i)=>{
  const p=g.profiles[i],extra=d[2][i],action=r.practice;
  const questions=[
   [d[1][i],p[1],d[0],''],
   ['Consider this situation: '+clean(extra[0])+'. What was different or similar in your own experience?',extra[1],g.article[(i*2+2)%10],''],
   [i%2===0?riskQuestion[domain]:needQuestion[domain],context[domain],g.safety,''],
   [i%2===0?actionQuestion[domain]:'Which practical choice would protect what matters to you in this situation?',action,action,'actions']
  ];
  return {...r,description:p[1]+' '+extra[0]+'.',questions,practice:action,finish:action};
 });
 const examples=enrichedExamples(g,domain,d);
 const questions=[
  ...d[1],
  'When you think about '+clean(d[2][0][0])+', what did you actually observe and what was assumed?',
  'What happened in your body or mood when a situation resembled this: '+clean(d[2][1][0])+'?',
  'What immediate response did you make to an experience like this: '+clean(d[2][2][0])+'?',
  domain==='lgbtq'?'Whose response has made it harder to decide what you want for yourself, and did that person respect your privacy?':
   domain==='appearance'?'Whose appearance standard or comments are influencing your own judgement, and have they affected access to care?':
   'Which expectation about yourself has begun to shape your choices, and where did you learn it?',
  'What other circumstances help explain an experience like this: '+clean(d[2][3][0])+'?',
  actionQuestion[domain]
 ];
 if(questions.length!==10)throw new Error('Incomplete Why questions for '+g.id);
 const support=[...g.ideas.support];
 return Object.freeze({...g,whyIntro:d[0],whyQuestions:questions,routes,whyCases:examples,
  ideas:{actions:[...g.ideas.actions],support},
  evidence:context[domain]+' The illustrative cases do not prove motives or diagnose any condition.',
  prominentSafety:g.prominentSafety||riskCases.has(g.id)?g.safety:g.prominentSafety,
  noPersist:g.noPersist||domain==='lgbtq'||['masking','self-concealment','body-dysmorphic-concerns','eating-weight-stigma'].includes(g.id)});
}
