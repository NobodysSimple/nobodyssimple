import test from 'node:test';
import assert from 'node:assert/strict';
import {tools} from '../../tool-catalog.mjs';
import {problemIndex,problemDomains,getProblem,findProblems,knowledgeFamilies} from '../../ns-problem-map.mjs';
import {recommendForProblems,learningModes} from '../../ns-universal-console.mjs';
import {renderNSProblemGuide} from '../../ns-problem-guide.mjs';

test('the broad emotional calculator covers real-life and HiTOP-inspired domains without diagnosing',()=>{
 assert.equal(problemDomains.length,11);
 assert.equal(problemIndex.length,69);
 assert.equal(new Set(problemIndex.map(p=>p.id)).size,problemIndex.length);
 assert.ok(problemIndex.every(p=>knowledgeFamilies[p.domain]));
 assert.deepEqual([...learningModes],['tools','learn']);
});
test('every problem links only to existing practical tools',()=>{
 const valid=new Set(tools.map(t=>t.id));
 for(const p of problemIndex){
  assert.ok(p.tools.length,p.id);
  assert.ok(p.tools.every(id=>valid.has(id)),p.id);
 }
});
test('plain-language search works without scoring generic pronouns',()=>{
 assert.ok(findProblems('I cannot stop overthinking').some(p=>p.id==='overthinking'));
 assert.ok(findProblems('university deadlines').some(p=>p.id==='study'));
 assert.ok(findProblems('I feel unsafe').some(p=>p.needsHuman));
 assert.equal(findProblems('unknown cosmic interference',5).length,0);
});
test('urgent concerns remain flagged when selected alongside ordinary problems',()=>{
 const r=recommendForProblems(['procrastination','self-harm']);
 assert.equal(r.urgent,true);
 assert.equal(getProblem('self-harm').needsHuman,true);
});
test('a valid standalone learning guide is readable without any stored profile',()=>{
 const root={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null};
 renderNSProblemGuide(root,'procrastination');
 assert.match(root.innerHTML,/I keep putting things off/);
 assert.match(root.innerHTML,/UNDERSTAND THE EXPERIENCE/);
 assert.match(root.innerHTML,/INVESTIGATE THE POSSIBILITIES/);
 assert.match(root.innerHTML,/Look beyond the individual/i);
 assert.match(root.innerHTML,/A SMALL WORKSHEET/);
 assert.match(root.innerHTML,/data-guide-jump="worksheet"/);
});
test('risk-sensitive guides include human support guidance',()=>{
 const root={innerHTML:'',querySelectorAll:()=>[],querySelector:()=>null};
 renderNSProblemGuide(root,'self-harm');
 assert.match(root.innerHTML,/Immediate support comes first/);
 assert.match(root.innerHTML,/999/);
 assert.match(root.innerHTML,/NHS 111/);
});
