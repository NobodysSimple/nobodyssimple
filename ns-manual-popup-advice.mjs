/* Nobody's Simple — shared editorial gate for optional suggestion popups.
 * Never pad an authored suggestion list with an instructional prefix.
 * Preserve the original advice and its safety qualifications.
 */
const templated=/^(?:explore what would need to change before attempting this|write (?:one answer|a few words) (?:to|about) (?:this question)?|consider whether this is relevant to your situation|use this worked example to ask|ask a trusted person about the practical concern behind|request support for this possible step only if safe|talk this through with someone who listens without deciding the answer for you|you might discuss this part of the experience with|a relevant service or ally may be able to help with|consider what practical change would address|discuss the actual expectation illustrated here|if a similar family interaction occurs|seek a confidential safety assessment if a situation like this is ongoing|ask for help with the practical limitation illustrated here|check reliable local information relevant to this situation|consider whether the conduct shown here is continuing|identify an organisation able to respond to the concern illustrated by|read the (?:linked|referenced) (?:reference|support) (?:for|guidance)|ask for help with|discuss the practical goal|ask a trained professional whether)\b/i;
const notAdvice=/^(?:think of a particular time this happened|consider whether this is relevant|look at a specific instance of|identify which person, service or organisation can realistically address|what (?:did|would|could|do)\b)/i;
const normalise=s=>String(s||'').normalize('NFKC').replace(/\s+/g,' ').trim();
const identity=s=>normalise(s).toLocaleLowerCase().replace(/[.!?]+$/,'').replace(/\s+/g,' ');
/**
 * Select directly useful, written advice from a topic's existing recommendations.
 * The catalogue retains its complete source arrays for research and revisions;
 * only their optional popup presentation is edited.
 */
export function practicalPopupIdeas(guide,kind,{limit}={}){
 // Culture, Faith, Migration, Health and Access catalogues use complete authored twenty-item lists.
 // Other completed catalogues retain their existing twelve-item presentation.
 const maxItems=limit??(['culture','faith','migration','body','sexuality','neuro','disability'].includes(guide?.domain)?20:12);
 const list=guide?.ideas?.[kind];
 if(!Array.isArray(list))return [];
 const result=[],seen=new Set();
 for(const raw of list){
  const advice=normalise(raw);
  if(advice.length<16||advice.length>300)continue;
  if(templated.test(advice)||notAdvice.test(advice))continue;
  // Exclude auto-composed scenario explanations masquerading as steps.
  if(/(?:the concern illustrated here|the situation illustrated by|example to ask what fits|similar interaction occurs|this pattern:)\s/i.test(advice))continue;
  const key=identity(advice);
  if(seen.has(key))continue;
  seen.add(key);
  result.push(advice);
  if(result.length>=maxItems)break;
 }
 return result;
}
