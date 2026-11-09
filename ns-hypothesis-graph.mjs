/* Nobody's Simple · transparent, revisable case formulation graph.
 * Inputs are reported answers and authored *possibilities*. Edges are
 * hypotheses, not demonstrated causality. No hidden traits are extracted.
 */
import {DEEP_QUESTION_BY_ID} from './ns-hypothesis-deep-content.mjs';
import {drillFacts,subtypeNode} from './ns-hypothesis-subtype-atlas.mjs';
import {caseDetailFacts} from './ns-hypothesis-case-facts.mjs';
import {investigationFacts,investigationLinks} from './ns-hypothesis-investigation.mjs';
import {testableDifferentials} from './ns-hypothesis-differentials.mjs';
import {adaptiveFacts,adaptiveDifferentials} from './ns-hypothesis-adaptive.mjs';
import {domainFacts,domainFormulation} from './ns-hypothesis-domain-depth.mjs';
const reply={yes:'Yes',probably:'Probably',unsure:'Not sure','probably-not':'Probably not',no:'No'};
const positive=a=>['yes','probably'].includes(a.answerId);
const significant=a=>a.answerId!=='unsure';
const summaryLine=(a,q)=>({id:a.questionId,question:q.prompt,answer:reply[a.answerId]||'Not sure'});
export const GRAPH_LAYERS=Object.freeze([
 {id:'presenting',label:'The concern',hint:'What you are trying to understand'},
 {id:'context',label:'Circumstances',hint:'Where, when and under what conditions it happens'},
 {id:'experience',label:'Feeling and meaning',hint:'What the experience is like and how you interpret it'},
 {id:'response',label:'Your response',hint:'What you do or do not do in those situations'},
 {id:'mechanism',label:'Possible influences',hint:'Several processes may matter at once'},
 {id:'function',label:'Possible short-term effect',hint:'What the response might accomplish, if anything'},
 {id:'cost',label:'What may continue it',hint:'Consequences and conditions worth testing'},
 {id:'need',label:'Needs and resources',hint:'Possible support, choice, rest or conditions'},
 {id:'tension',label:'Possible internal tension',hint:'Only shown when your answers suggest more than one competing aim'}
]);
const short=(x,n=180)=>String(x||'').slice(0,n);
function specificEvidence(state,questionIndex,requestedTags){
 return (state.answers||[]).filter(significant).map(a=>{
  const q=questionIndex[a.questionId]||DEEP_QUESTION_BY_ID[a.questionId];
  if(!q)return null;
  const tags=q.tags||[];
  if(!tags.some(tag=>requestedTags.includes(tag)))return null;
  return {a,q,item:summaryLine(a,q)};
 }).filter(Boolean);
}
export function buildFormulationGraph(state,candidates,questionIndex){
 const leader=candidates?.[0],other=candidates?.slice(1,6)||[]; // Retain reviewed/rejected models in the editable map.
 const p=leader?.process;
 const observations=specificEvidence(state,questionIndex,['context','constraint','counterfactual']);
 const meanings=specificEvidence(state,questionIndex,['meaning','emotion','body','identity','expression']);
 const responses=specificEvidence(state,questionIndex,['behaviour','action','function']);
 const tensions=specificEvidence(state,questionIndex,['conflict']);
 const needs=specificEvidence(state,questionIndex,['need','strength']);
 const direct=(items)=>items.filter(x=>positive(x.a)).slice(0,3).map(x=>x.item);
 const normal=(items)=>items.slice(0,3).map(x=>x.item);
 const supporting=leader?.positive?.length||0;
 const differentialPatterns=[...testableDifferentials(state),...adaptiveDifferentials(state),...domainFormulation(state).hypotheses];
 // Preserve exact details explicitly selected by the person, never infer
 // more than the available selection establishes.
 const drill=state.drill;
 const exact=drill?.confirmed?subtypeNode(drill.leafId):null;
 const facts=drillFacts(drill);
 const precise=caseDetailFacts(state);
 const inquiry=investigationFacts(state);
 const advanced=adaptiveFacts(state);
 const domain=domainFacts(state);
 const fromDomain=id=>domain.find(f=>f.kind==='domain:'+id);
 const advancedFor=key=>advanced.find(f=>f.kind==='adaptive:'+key);
 const advancedEvidence=(...keys)=>advanced.filter(f=>keys.includes(f.kind.slice(9)))
  .map(f=>({id:f.id,question:f.question,answer:f.text}));
 const inquiryFor=key=>inquiry.find(f=>f.kind===key);
 const inquiryEvidence=(...keys)=>inquiry.filter(f=>keys.includes(f.kind)).map(f=>({id:f.id,question:f.question,answer:f.text}));
 const preciseFor=kind=>precise.find(f=>f.kind===kind);
 const evidenceFor=(...kinds)=>precise.filter(f=>kinds.includes(f.kind)).map(f=>({id:f.id,question:f.label,answer:f.text}));
 const factFor=kind=>facts.find(f=>f.kind===kind);
 const entry=factFor('specific_experience'),setting=factFor('context'),
  valence=factFor('valence'),meaning=factFor('meaning');
 const sourced=(fact,question)=>fact?[{id:fact.questionId,question,answer:fact.text}]:[];
 const personPhrase=inquiryFor('father_label')?.text;
 const title=state.description?.trim()||personPhrase||(exact?exact.label:state.trackId||'A difficulty I want to understand');
 const nodes=[
  {id:'presenting',layer:'presenting',title:short(title,280),
   detail:exact?'You confirmed this specific experience as something you want to explore. This does not establish a problem or a disorder.':'This is your selected general starting area. The exact experience has not yet been established.',
   evidence:[...(state.description?.trim()?[{id:'person-own-words',question:'Your description in your own words',answer:state.description.trim()}]:[]),
    ...inquiryEvidence('father_label'),...sourced(entry,'Is this a specific experience you want to explore?')],
   status:exact||personPhrase?'reported':'unknown'},
  {id:'context',layer:'context',
   title:[inquiryFor('who')?.text,inquiryFor('father_behaviour')?.text,inquiryFor('event')?.text,
    setting?.text,preciseFor('timeframe')?.text,fromDomain('primary')?.text,advancedFor('external_persistence')?.text,
    advancedFor('external_action')?.text].filter(Boolean).slice(0,4).join(' · ')||
    (observations.length?'Situations and constraints mentioned':'Context not established'),
   detail:setting?'You selected this setting or situation. The tool has not established what causes the experience there.':
    observations.length?'These are the circumstances and contrasts you have reported.':'Nobody has not yet established when the problem changes or what practical barriers are present.',
   evidence:[...inquiryEvidence('who','father_behaviour','event','sleep','capacity','environment','counterexample'),
    ...sourced(setting,'Where or when does this matter most?'),...evidenceFor('timeframe','frequency','situations','exceptions'),
    ...advancedEvidence('external_persistence','external_action','sleep_contrast','load_contrast','context_history','history_clarify'),
    ...normal(observations)].slice(0,16),
   status:setting||observations.length||precise.length||inquiryEvidence('event','environment','sleep').length?'reported':'unknown'},
  {id:'experience',layer:'experience',
   title:[inquiryFor('emotion')?.text,inquiryFor('interpretation')?.text,valence?.text,meaning?.text,preciseFor('impact')?.text].filter(Boolean).slice(0,3).join(' · ')||
    (meanings.length?'What you report feeling or considering':'Personal meaning not established'),
   detail:'These are the meanings or descriptions you selected, not an interpretation of your identity or a hidden motive. A feeling cannot be inferred from a behaviour.',
   evidence:[...sourced(valence,'How would you describe this experience?'),
    ...sourced(meaning,'What is most relevant to understanding it?'),...inquiryEvidence('emotion','interpretation','father_label'),
    ...evidenceFor('impact'),...advancedEvidence('meaning_evidence','meaning_reframe'),...normal(meanings)].slice(0,12),
   status:valence||meaning||meanings.length||preciseFor('impact')||inquiryFor('emotion')||inquiryFor('interpretation')?'reported':'unknown'},
  {id:'response',layer:'response',title:[inquiryFor('action')?.text,inquiryFor('regulation')?.text,fromDomain('response')?.text,advancedFor('coping_pattern')?.text].filter(Boolean).slice(0,3).join(' · ')||
    (responses.length?'Responses and choices mentioned':'Response not established'),
   detail:'What you said you do, including how you regulate difficult feelings. A response is not necessarily a protective strategy.',
   evidence:[...inquiryEvidence('action','regulation'),...advancedEvidence('coping_pattern'),...normal(responses)].slice(0,9),
   status:inquiryFor('action')||inquiryFor('regulation')||responses.length?'reported':'unknown'},
  ...differentialPatterns.map((pattern,i)=>({
   id:pattern.id,layer:'mechanism',title:pattern.title,
   detail:pattern.description+(pattern.falsifier?' Why it may be wrong: '+pattern.falsifier:'')+
    ' Alternative: '+pattern.alternative,
   evidence:pattern.evidence,challenges:pattern.challenges||[],
   status:'tentative',rank:i+1,
   source:'multi_observation_test_not_clinical_probability'})),
  ...[leader,...other].filter(Boolean).map((c,i)=>({
   id:'mechanism:'+c.id,layer:'mechanism',title:c.process.title,
   detail:c.process.description,
   evidence:c.positive.slice(0,3).map(x=>({id:x.questionId,question:x.prompt,answer:x.label})),
   challenges:c.negative.slice(0,2).map(x=>({id:x.questionId,question:x.prompt,answer:x.label})),
   status:c.positive.length>0?'tentative':'unknown',
   rank:i+1})),
  {id:'function',layer:'function',title:fromDomain('immediate')?'Immediate: '+fromDomain('immediate').text:
    advancedFor('coping_intention')?'Intended effect: '+advancedFor('coping_intention').text:
   inquiryFor('short_term')?'Afterwards: '+inquiryFor('short_term').text:
   (supporting?'A possible immediate effect':'Immediate effect not established'),
   detail:inquiryFor('short_term')?'This consequence was selected by the person. The response causing it has NOT been established.':
    supporting?'One possibility to explore: '+p.possibleFunction:'There is not yet enough evidence to infer what the response accomplishes.',
   evidence:[...inquiryEvidence('short_term','if_stop'),...advancedEvidence('coping_intention','protective_response'),
    ...direct(specificEvidence(state,questionIndex,['function']))].slice(0,9),
   status:inquiryFor('short_term')?'reported':supporting?'tentative':'unknown'},
  {id:'cost',layer:'cost',title:fromDomain('later')?'Later: '+fromDomain('later').text:
    advancedFor('recurrent_cycle')?'Repeated pattern: '+advancedFor('recurrent_cycle').text:
   inquiryFor('long_term')?'Later: '+inquiryFor('long_term').text:
   (supporting?'A possible continuing cost':'Maintaining consequences not established'),
   detail:inquiryFor('long_term')?'A later consequence was reported; whether the response maintains the problem remains a question.':
    supporting?'To test, not presume: '+p.possibleCost:'A continuing psychological cycle has not been established.',
   evidence:[...inquiryEvidence('long_term'),...advancedEvidence('recurrent_cycle','coping_counterfactual'),
    ...normal(specificEvidence(state,questionIndex,['cost']))].slice(0,9),
   status:inquiryFor('long_term')?'reported':supporting?'tentative':'unknown'},
  {id:'need',layer:'need',title:fromDomain('goal')?'My goal: '+fromDomain('goal').text:
    inquiryFor('values')?'What matters: '+inquiryFor('values').text:
   (preciseFor('goal')?'My stated goal: '+preciseFor('goal').text:
   (needs.length?'Needs or resources to consider':'Possible needs, still unconfirmed')),
   detail:inquiryFor('values')?'This priority was selected by the person; it is not an inferred unmet need.':preciseFor('goal')?'The goal shown here was explicitly selected by the person. It does not prove that a particular need is unmet.':
    'These are options to discuss, not unmet needs discovered by an algorithm. '+(p?.need||'A need has not been identified.'),
   evidence:[...inquiryEvidence('values','what_changes','alternative'),...advancedEvidence('safe_probe','values_external'),
    ...evidenceFor('goal'),...normal(needs)].slice(0,10),
   status:inquiryFor('values')||preciseFor('goal')?'reported':needs.length?'tentative':'unknown'}
 ];
 // Only surface an opposing-goals hypothesis when a person actually reports
 // a tension — do not produce a romanticised 'two parts of yourself' narrative.
 const confirmed=tensions.filter(x=>positive(x.a));
 nodes.push({id:'tension',layer:'tension',
  title:advancedFor('values_external')?'You described the conflict as: '+advancedFor('values_external').text:
   inquiryFor('values_cost')?'A possible trade-off: '+inquiryFor('values_cost').text:
   (confirmed.length?'A tension you may be describing':'No inner conflict established'),
  detail:confirmed.length?
   'Your answers suggest that more than one value, preference or concern could be present. This does not mean they are pathological or incompatible.':
   'People do not necessarily have an unconscious conflict. A simple preference or a real-world constraint may explain the concern.',
  evidence:[...inquiryEvidence('values_cost'),...advancedEvidence('values_external'),...normal(confirmed)].slice(0,6),
  status:inquiryFor('values_cost')?'reported':confirmed.length?'tentative':'unknown'});
 // Stage 5: every direct answer remains inspectable on an appropriate graph tile,
 // including the original verbatim text. A tile may show a concise preview,
 // but its inspector must never omit a recorded source fact.
 const layerToNode={context:'context',experience:'experience',meaning:'experience',
  response:'response',function:'function',cost:'cost',need:'need',tension:'tension',
  mechanism:'experience'};
 const seen=new Set(nodes.flatMap(n=>(n.evidence||[]).map(item=>item.id)));
 for(const fact of [...inquiry,...advanced,...domain]){
  if(seen.has(fact.id))continue;
  const id=layerToNode[fact.layer]||'context';
  const destination=nodes.find(n=>n.id===id);
  if(!destination)continue;
  destination.evidence=[...(destination.evidence||[]),
   {id:fact.id,question:fact.question,answer:fact.text}];
  seen.add(fact.id);
 }
 return nodes.map(n=>{
  const saved=state.nodeEdits?.[n.id];
  return {...n,editedTitle:saved?.text?.trim()||'',
   review:saved?.verdict||'unreviewed',summary:saved?.text?.trim()||n.title,
   focusable:true};
 });
}
export {investigationLinks};
export function graphCoverage(state,questionIndex){
 const answered=(state.answers||[]).filter(significant);
 const categories=new Set();
 let counterfactual=0;
 for(const a of answered){
  const q=questionIndex[a.questionId]||DEEP_QUESTION_BY_ID[a.questionId];
  for(const tag of q?.tags||[])categories.add(tag);
  if(q?.tags?.includes('counterfactual'))counterfactual++;
 }
 return {
  total:state.answers.length,
  meaningful:answered.length,
  layers:['context','emotion','meaning','behaviour','function','need','counterfactual'].filter(x=>categories.has(x)),
  categories:[...categories],
  counterfactual,
  // This is a *workflow checkpoint*, never a clinical certainty threshold.
  canDraft:answered.length>=9&&categories.size>=4&&counterfactual>=1,
  detailed:answered.length>=16&&categories.size>=6&&counterfactual>=2
 };
}
export function editGraphNode(state,nodeId,change){
 if(!state||!nodeId)return state;
 const previous=state.nodeEdits?.[nodeId]||{};
 const text=typeof change?.text==='string'?short(change.text.trim(),280):previous.text||'';
 const verdict=['fits','unsure','no-fit'].includes(change?.verdict)?change.verdict:previous.verdict||'unreviewed';
 return {...state,nodeEdits:{...(state.nodeEdits||{}),[nodeId]:{text,verdict}},
  focusLayer:change?.revisit?nodeId.split(':')[0]:state.focusLayer||''};
}
export function reopenGraphLayer(state,nodeId){
 if(!state)return state;
 return {...state,focusLayer:nodeId.split(':')[0]};
}
export function layerQuestionTags(layer){
 return {
  presenting:['context'],
  context:['context','constraint','counterfactual'],
  experience:['emotion','meaning','body','identity','expression'],
  response:['behaviour','action','function'],
  mechanism:['counterfactual','meaning','context'],
  function:['function','counterfactual'],
  cost:['cost','context'],
  need:['need','strength','action'],
  tension:['conflict','counterfactual']
 }[layer]||[];
}
export function graphText(state,nodes){
 const out=['WORKING FORMULATION GRAPH','A provisional educational map; no causal claim or diagnosis.', ''];
 for(const node of nodes){
  out.push('['+node.layer.toUpperCase()+'] '+node.summary);
  out.push(node.detail);
  if(node.review!=='unreviewed')out.push('My review: '+node.review);
  if(node.editedTitle)out.push('My wording: '+node.editedTitle);
  for(const evidence of node.evidence||[])out.push(' • '+evidence.question+' — '+evidence.answer);
  out.push('');
 }
 return out.join('\n');
}
