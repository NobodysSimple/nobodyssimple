import test from 'node:test';
import assert from 'node:assert/strict';
import {preciseProfiles,getPreciseProfile} from '../../ns-precision-content.mjs';
import {getProblem} from '../../ns-problem-map.mjs';
import {tools} from '../../tool-catalog.mjs';
import {renderPrecisionGuide} from '../../ns-precision-guide.mjs';
import {searchPrecisionTopics} from '../../ns-precision-console.mjs';

const expected=['social-anxiety','panic-experiences','insomnia','rumination','submissive-patterns'];
test('five worked examples have distinct granular concepts and no diagnostic shortcuts',()=>{
 assert.deepEqual(preciseProfiles.map(p=>p.id),expected);
 assert.match(getPreciseProfile('social-anxiety').taxonomy,/Social phobia/);
 assert.match(getPreciseProfile('insomnia').taxonomy,/Insomnia/);
 assert.match(getPreciseProfile('submissive-patterns').taxonomy,/trait/);
 assert.match(getPreciseProfile('rumination').taxonomy,/Cross-cutting process/);
 for(const p of preciseProfiles){
  assert.equal(p.cycle.length,4,p.id);
  assert.equal(p.questions.length,2,p.id);
  assert.equal(p.maintainers.length,4,p.id);
  assert.ok(p.contributors.length>=5,p.id);
  assert.ok(p.progress.length>=3,p.id);
  assert.ok(Object.values(p.signs).flat().length>=8,p.id);
 }
});
test('answer routing separates similar but distinct difficulties',()=>{
 for(const p of preciseProfiles){
  assert.ok(p.questions[0].options.some(x=>x[2]&&x[2]!==p.id),p.id);
  assert.ok(p.questions.flatMap(q=>q.options).every(x=>!x[2]||getPreciseProfile(x[2])||getProblem(x[2])),p.id);
 }
 assert.equal(getPreciseProfile('rumination').questions[0].options.find(o=>o[0]==='checks')[2],'checking');
 assert.equal(getPreciseProfile('rumination').questions[0].options.find(o=>o[0]==='intrusions')[2],'intrusive');
 assert.equal(getPreciseProfile('insomnia').questions[0].options.find(o=>o[0]==='unrefreshed')[2],'fatigue');
 assert.equal(getPreciseProfile('submissive-patterns').questions[0].options.find(o=>o[0]==='unsafe')[2],'control-harm');
});
test('every targeted intervention links to an existing practical tool',()=>{
 const ids=new Set(tools.map(t=>t.id));
 for(const p of preciseProfiles){
  for(const id of [...p.maintainers.map(x=>x.tool),...p.targets.map(x=>x.tool)]){
   assert.ok(ids.has(id),p.id+' '+id);
  }
 }
});
function fakeRoot(){
 const nodes=new Map();
 return {
  innerHTML:'',
  querySelectorAll:()=>[],
  querySelector:(selector)=>{
   if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',addEventListener:()=>{}});
   return nodes.get(selector);
  },
  nodes
 };
}
test('each guide renders seven educational layers and an editable map',()=>{
 for(const p of preciseProfiles){
  const root=fakeRoot();
  renderPrecisionGuide(root,p.id);
  for(const token of ['WHAT & SIGNS','WHAT MAY KEEP IT GOING','YOUR PERSONAL PROFILE',
      'YOUR WORKING FORMULATION','INTERVENTIONS BY MECHANISM','WHAT PROGRESS CAN LOOK LIKE','YOUR TAKEAWAY',
      'data-precision-map','data-precision-add','data-precision-actions']){
   assert.ok(root.innerHTML.includes(token),p.id+' missing '+token);
  }
  assert.ok(root.nodes.get('[data-precision-map]').innerHTML.includes(p.title));
  assert.ok(root.nodes.get('[data-precision-summary]').textContent.includes('hypotheses'));
 }
});
test('chosen consensual submission is explicitly not pathologised',()=>{
 const p=getPreciseProfile('submissive-patterns');
 assert.match(p.definition,/not inherently a psychological problem/);
 assert.match(p.contrasts.join(' '),/consensual preferred role/);
});
test('panic and insomnia retain physical health escalation advice',()=>{
 assert.match(getPreciseProfile('panic-experiences').alert,/medical attention/);
 assert.match(getPreciseProfile('insomnia').alert,/GP assessment/);
});

test('plain-language search prioritises exact pathways without generic false positives',()=>{
 assert.equal(searchPrecisionTopics("I can't sleep",4)[0]?.id,'insomnia');
 assert.equal(searchPrecisionTopics('ruminating over conversations',4)[0]?.id,'rumination');
 assert.equal(searchPrecisionTopics('fear of being judged',4)[0]?.id,'social-anxiety');
 assert.equal(searchPrecisionTopics('sudden panic attack',4)[0]?.id,'panic-experiences');
 assert.equal(searchPrecisionTopics("I can't say no to my partner",4)[0]?.id,'submissive-patterns');
 assert.equal(searchPrecisionTopics('checking door repeatedly',4)[0]?.id,'checking');
 assert.equal(searchPrecisionTopics('housing problems',4)[0]?.id,'housing');
});
