import test from 'node:test';
import assert from 'node:assert/strict';
import {startHypothesis,hypothesisResult,formulationPlainText,reviewHypothesisLink} from '../../ns-hypothesis-engine.mjs';
import {SUBTYPE_NODES,subtypeNode,subtypeChildren,beginSubtypeDrill} from '../../ns-hypothesis-subtype-atlas.mjs';
import {DOMAIN_LENSES,COVERED_SAFE_AREAS,newDomainInquiry,
 domainEligible,startDomainInquiry,domainQuestion,answerDomainInquiry,backDomainInquiry,
 stopDomainInquiry,domainFacts,domainFormulation} from '../../ns-hypothesis-domain-depth.mjs';
import {formulationDepthAudit,auditFormulationEvidence} from '../../ns-hypothesis-quality.mjs';

function caseFor(categoryId,clusterId,leafId){
 const track={TASKS:'procrastination',RELATIONSHIPS:'relationships',SLEEP:'sleep',
  CHECKING:'checking',SENSORY:'sensory',EMOTIONS:'emotion',SOCIAL:'social',
  HEALTH:'fatigue',LOSS:'loss',IDENTITY:'identity',VALUES:'choices'}[categoryId]||'emotion';
 const base=startHypothesis({trackId:track,description:'What I actually said about '+subtypeNode(leafId).label});
 return {...base,drill:{...beginSubtypeDrill(track),categoryId,clusterId,leafId,confirmed:true,
  unsupportedCategory:!['TASKS','RELATIONSHIPS','SLEEP','CHECKING','SENSORY','EMOTIONS',
    'SOCIAL','HEALTH','LOSS','IDENTITY','VALUES'].includes(categoryId),
  details:{},events:[],finished:true},domain:newDomainInquiry()};
}
function answer(s,id,verbatim=''){
 const q=domainQuestion(s);
 assert.ok(q,'Expected a question for '+id);
 assert.equal(q.id,id);
 return answerDomainInquiry(s,q.questionId,verbatim?'factor1':id==='primary'?'factor1':
  id==='contrast'?'easier':id==='additional'?'extra1':
  id==='response'?'reduce':id==='immediate'?'relief':
  id==='later'?'returns':id==='recurrence'?'repeated':
  id==='exception'?'protected':id==='history'?'situational':'understand',verbatim);
}
function complete(s,choices={}){
 s=startDomainInquiry(s);
 let steps=0;
 while(domainQuestion(s)){
  const q=domainQuestion(s),choice=choices[q.id]||{
   primary:'factor1',contrast:'easier',additional:'extra1',response:'reduce',
   immediate:'relief',later:'returns',recurrence:'repeated',
   exception:'protected',history:'situational',goal:'understand'
  }[q.id];
  assert.ok(q.options.some(o=>o.id===choice),q.id+' '+choice);
  s=answerDomainInquiry(s,q.questionId,choice);
  assert.ok(++steps<=10);
 }
 return s;
}
test('all 21 atlas categories are accounted for (20 interrogable, SAFETY support-only)',()=>{
 const categories=subtypeChildren('ROOT').map(x=>x.id);
 assert.equal(categories.length,21);
 assert.deepEqual(new Set(COVERED_SAFE_AREAS),new Set(categories.filter(x=>x!=='SAFETY')));
 assert.equal(Object.keys(DOMAIN_LENSES).length,20);
 assert.ok(Object.values(DOMAIN_LENSES).every(p=>p.lenses.length===4&&p.second.length===4));
 assert.equal(COVERED_SAFE_AREAS.includes('SAFETY'),false);
});
test('all 84 clusters and 440 exact selectable experiences receive a grounded investigation route',()=>{
 const clusters=SUBTYPE_NODES.filter(n=>n.level==='cluster');
 const leaves=SUBTYPE_NODES.filter(n=>n.level==='specific_experience');
 assert.equal(clusters.length,84);
 assert.equal(leaves.length,440);
 let count=0;
 for(const leaf of leaves){
  const cluster=subtypeNode(leaf.parent),category=subtypeNode(cluster.parent);
  if(category.id==='SAFETY')continue;
  const sample=caseFor(category.id,cluster.id,leaf.id);
  // The safety scanner intentionally diverts urgent physical symptoms and
  // coercion even when these appear outside the general SAFETY category.
  if(sample.safety){assert.equal(domainEligible(sample),false,leaf.id);continue;}
  const state=startDomainInquiry(sample);
  assert.equal(domainEligible(state),true,leaf.id);
  const q=domainQuestion(state);
  assert.ok(q&&q.prompt.includes(leaf.label),leaf.id);
  assert.ok(q.options.some(o=>o.id==='prefer_not')&&q.options.some(o=>o.id==='unsure'));
  count++;
 }
 assert.ok(count>=400,'Expected routes for nearly all experiences except urgent safety');
});
test('an unreviewed digital experience gains a differential explanation only after cross-answer evidence',()=>{
 const s=caseFor('DIGITAL','DIGITAL-GAMES','DIGITAL-GAMES-VALUED-ONLINE-FRIENDSHIPS');
 assert.equal(hypothesisResult(s).alternatives.length,0);
 assert.equal(hypothesisResult(s).domain.hypotheses.length,0);
 let step=startDomainInquiry(s);
 const first=domainQuestion(step);
 step=answerDomainInquiry(step,first.questionId,'factor3','Online games give me connection and relaxation');
 assert.equal(hypothesisResult(step).domain.hypotheses.length,0);
 const second=domainQuestion(step);
 assert.equal(second.id,'contrast');
 step=answerDomainInquiry(step,second.questionId,'easier','I can choose to stop when offline friends invite me out');
 const report=hypothesisResult(step);
 assert.ok(report.domain.hypotheses.some(h=>h.id==='pattern:domain-context'));
 assert.ok(report.graph.some(n=>n.layer==='mechanism'&&n.evidence.some(e=>e.answer.includes('Online games'))));
 assert.ok(report.graph.find(n=>n.id==='context').evidence.some(e=>e.answer.includes('Online games')));
 assert.equal(auditFormulationEvidence(step,report).passed,true);
 assert.equal(formulationDepthAudit(step,report).passed,true);
});
test('relief followed by recurrence is proposed only after repeated temporal observations',()=>{
 let s=caseFor('RELATIONSHIPS','RELATIONSHIPS-COMMUNICATION','RELATIONSHIPS-COMMUNICATION-AVOIDING-DIFFICULT-TALKS');
 s=complete(s);
 let result=hypothesisResult(s);
 assert.ok(result.domain.hypotheses.some(h=>h.id==='pattern:domain-cycle'));
 assert.ok(result.graph.some(n=>n.id==='pattern:domain-cycle'));
 assert.match(formulationPlainText(s),/A repeated short-term relief cycle may be relevant/);
 assert.equal(formulationDepthAudit(s,result).passed,true);
 assert.ok(result.links.some(l=>l.id==='domain-link:response-immediate'));
 const id=result.links.find(l=>l.id==='domain-link:response-immediate').id;
 s=reviewHypothesisLink(s,id,'no-fit');
 result=hypothesisResult(s);
 assert.equal(result.links.find(l=>l.id===id).review,'no-fit');
});
test('counterfactual and lasting practical benefit prevent automatic avoidance formulation',()=>{
 const base=caseFor('WORK','WORK-DEMAND','WORK-DEMAND-EXCESSIVE-WORKLOAD');
 const s=complete(base,{contrast:'same',response:'direct',immediate:'practical',later:'improves',recurrence:'varied'});
 const r=hypothesisResult(s);
 assert.ok(!r.domain.hypotheses.some(h=>h.id==='pattern:domain-cycle'));
 assert.ok(r.domain.hypotheses.some(h=>h.id==='pattern:domain-effective'));
 assert.ok(r.domain.counterpoints.some(c=>c.id==='challenge:domain-not-primary'));
 assert.ok(r.domain.counterpoints.some(c=>c.id==='challenge:domain-counterexample')===false);
});
test('a preference does not silently become pathology or a user-claimed diagnosis',()=>{
 const state=caseFor('SEXUAL','SEXUAL-CONSENT','SEXUAL-CONSENT-CONSENSUAL-SUBMISSIVENESS');
 const s=complete(state,{primary:'factor2',contrast:'not_seen',response:'no_problem',
   additional:'none',exception:'not_checked',goal:'no_change'});
 const r=hypothesisResult(s);
 assert.equal(r.domain.hypotheses.length,0);
 assert.ok(r.domain.counterpoints.some(c=>c.id==='challenge:domain-nonpathological'));
 assert.ok(!r.domain.hypotheses.some(c=>/illness|disorder|abnormal/.test(c.title)));
});
test('uncertain or refused answers are not evidence and unsupported sequences do not become causes',()=>{
 let s=startDomainInquiry(caseFor('MONEY','MONEY-HOUSING','MONEY-HOUSING-RENT-INSECURITY'));
 const q=domainQuestion(s);s=answerDomainInquiry(s,q.questionId,'prefer_not','Private refusal text');
 assert.equal(domainFacts(s).length,0);
 assert.equal(domainFormulation(s).hypotheses.length,0);
 assert.notEqual(domainQuestion(s)?.id,'contrast');
 s=backDomainInquiry(s);
 assert.equal(domainQuestion(s).id,'primary');
 s=answerDomainInquiry(s,domainQuestion(s).questionId,'factor1','Rent doubled');
 assert.equal(domainFacts(s)[0].text,'Rent doubled');
 s=stopDomainInquiry(s);assert.equal(domainQuestion(s),null);
 s=startDomainInquiry(s);assert.ok(domainQuestion(s));
});
test('urgent safety category remains unavailable and domain questioning does not store or send answers',()=>{
 let s=startHypothesis({trackId:'emotion'});
 s={...s,drill:{categoryId:'SAFETY',clusterId:'SAFETY-IMMEDIATE',
  leafId:'SAFETY-IMMEDIATE-CURRENT-PHYSICAL-DANGER',confirmed:true}};
 assert.equal(domainEligible(s),false);
 assert.equal(startDomainInquiry(s),s);
 assert.equal(domainFormulation(s).hypotheses.length,0);
 s=caseFor('HEALTH','HEALTH-PAIN','HEALTH-PAIN-CHRONIC-PAIN');
 s={...s,safety:{kind:'medical',reason:'Medical concern'}};
 assert.equal(domainEligible(s),false);
 assert.equal(domainFormulation(s).hypotheses.length,0);
});
