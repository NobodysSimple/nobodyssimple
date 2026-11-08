import test from 'node:test';
import assert from 'node:assert/strict';
import {
 investigationTopics,investigationQuestions,
 investigationFormulation,renderNSInvestigator
} from '../../ns-investigate.mjs';

test('the investigator offers four directly accessible problem pathways',()=>{
 assert.deepEqual(investigationTopics.map(x=>x.id),
  ['procrastination','overthinking','feelings','relationships']);
 const root={innerHTML:''};
 renderNSInvestigator(root);
 for(const topic of investigationTopics)assert.match(root.innerHTML,
  new RegExp('href="#investigate/'+topic.id+'"'));
});
test('each investigation has six questions and the third genuinely branches',()=>{
 for(const t of investigationTopics){
  const initial=investigationQuestions(t.id);
  assert.equal(initial.length,6,t.id);
  assert.equal(new Set(initial.map(x=>x.id)).size,6);
  const chosen=initial[1].choices[0].id;
  const branch=investigationQuestions(t.id,{mechanism:chosen});
  assert.notEqual(branch[2].label,initial[2].label);
  assert.ok(branch[2].choices.length>=4);
 }
});
test('later answers can revise a first hypothesis rather than simply echo it',()=>{
 const f=investigationFormulation('overthinking',{
  context:'3',mechanism:'uncertainty',detail:'1',
  exception:'0',constraint:'2',attempt:'0'
 });
 assert.equal(f.primary.id,'practical');
 assert.notEqual(f.primary.id,'uncertainty');
 assert.match(f.why,/later answers/);
});
test('relationships safety context can override an initial social interpretation',()=>{
 const f=investigationFormulation('relationships',{
  context:'0',mechanism:'ambiguity',detail:'0',
  exception:'3',constraint:'0',attempt:'1'
 });
 assert.equal(f.caution,true);
 assert.equal(f.primary.id,'safety');
});
test('the dossier preserves uncertainty and keeps systemic factors visible',()=>{
 const f=investigationFormulation('procrastination',{
  context:'0',mechanism:'unsure',detail:'2',
  exception:'4',constraint:'0',attempt:'4'
 });
 assert.equal(f.uncertain,true);
 assert.match(f.systemNote,/Too many demands/);
 assert.ok(f.alternative && f.primary!==f.alternative);
});
test('unknown topics do not produce invented formulations',()=>{
 assert.deepEqual(investigationQuestions('not-a-topic'),[]);
 assert.equal(investigationFormulation('not-a-topic'),null);
});
