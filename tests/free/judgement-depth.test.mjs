import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEPTH_EXAMPLES,DEPTH_GROUPS,DEPTH_ROOTS,DEPTH_LEVELS,depthById} from '../../ns-judgement-depth-data.mjs';

test('Understand Why provides rich, distinct example paths without presenting them as diagnoses',()=>{
 assert.equal(DEPTH_EXAMPLES.length,84);
 assert.equal(new Set(DEPTH_EXAMPLES.map(x=>x.id)).size,84);
 assert.equal(DEPTH_GROUPS.length,14);
 assert.equal(DEPTH_ROOTS.length,6);
 assert.equal(DEPTH_LEVELS.length,11);
 const ids=new Set(DEPTH_ROOTS.map(x=>x.id));
 for(const x of DEPTH_EXAMPLES){
  assert.ok(ids.has(x.root),x.id+' missing root');
  assert.ok(x.situation.length>=12,x.id+' missing concrete situation');
  for(const field of ['interpretation','emotion','fear','need','identity','rule','adaptation','alternative','action'])
   assert.ok(x[field]?.length>=8,x.id+' weak '+field);
  assert.equal(depthById(x.id),x);
 }
});

test('personal excavations remain hypotheses and include environment-first alternatives',()=>{
 const src=readFileSync('ns-judgement-depth.mjs','utf8');
 assert.match(src,/not automatically saved or sent/i);
 assert.match(src,/cannot uncover an unconscious cause/i);
 assert.match(src,/safety and support/i);
 assert.match(src,/data-depth-root/);
 assert.match(src,/data-depth-search/);
 assert.match(src,/data-depth-start='earlier'/);
 assert.match(src,/valueFor\(x,l\.key\)/);
 assert.match(src,/data-depth-download/);
});

test('Understand Why is mounted after quick help and before further reading',()=>{
 const manual=readFileSync('ns-judgement-manual.mjs','utf8');
 const html=readFileSync('index.html','utf8');
 assert.ok(manual.indexOf('ns-judge-now')<manual.indexOf('data-nj-depth'));
 assert.ok(manual.indexOf('data-nj-depth')<manual.indexOf('ns-judge-footer'));
 assert.match(manual,/mountJudgementDepth\(root\.querySelector\('\[data-nj-depth\]'\)/);
 assert.match(html,/ns-judgement-depth\.css/);
});
