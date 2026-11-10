import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {NEEDS_MODES,needsDestination} from '../../ns-needs-catalog.mjs';
import {workbookForChoice,workbookForTopic,workbookCoverage} from '../../ns-integrated-workbook-data.mjs';
import {atlasProblemIndex,isSafetyPriority} from '../../ns-atlas-core.mjs';
import {tools} from '../../tool-catalog.mjs';

const toolsById=new Set(tools.map(t=>t.id));
test('every retained action choice has a guide and topics use their integrated atlas guides',()=>{
 assert.equal(NEEDS_MODES.length,7);
 assert.equal(workbookCoverage.length,7);
 let count=0;
 for(const mode of NEEDS_MODES){
  for(const option of mode.options){
   count++;
   const w=workbookForChoice(mode.id,option.id);
   assert.ok(w,mode.id+'/'+option.id);
   assert.equal(w.id,mode.id+'/'+option.id);
   assert.equal(w.modeId,mode.id);
   assert.equal(w.optionId,option.id);
   assert.equal(needsDestination(option),option.type==='topic'?'#workbook-topic/'+option.target:'#workbook/'+mode.id+'/'+option.id);
   assert.ok(w.what.length>=70,w.id+' should explain experience');
   assert.ok(w.cycle.length>=50,w.id+' must give possible pattern');
   assert.ok(w.cautions.length>=1,w.id+' must indicate limits');
   assert.ok(w.sources.length>=1,w.id+' must have at least one source');
   assert.equal(w.lanes.length,mode.id==='regulate'?6:5,w.id+' differentiated chapters');
   for(const lane of w.lanes){
    assert.ok(lane.methods.length>=1,w.id+' '+lane.id+' requires practical education');
    assert.ok(lane.methods.every(m=>m.title&&m.steps.length>=2),w.id+' '+lane.id);
    assert.ok(toolsById.has(lane.tool),w.id+' '+lane.id+' missing real tool '+lane.tool);
   }
   const ids=new Set(w.lanes.map(l=>l.id));
   for(const id of ['context','practice','thinking','acceptance','support'])assert.ok(ids.has(id),w.id+' missing '+id);
   if(mode.id==='regulate'){
    assert.equal(w.lanes.find(l=>l.id==='dbt').methods.length,2);
    assert.equal(w.lanes.reduce((a,l)=>a+l.methods.length,0),12);
   }
   if(mode.id==='relate'&&option.id==='unsafe')assert.equal(w.safetyFirst,true);
   assert.notEqual(option.type,'atlas','no duplicate atlas browse card');
  }
 }
 assert.equal(count,49);
 assert.equal(workbookForChoice('unknown','anything'),null);
 assert.equal(workbookForChoice('regulate','unknown'),null);
});
test('all existing and new atlas entries open an integrated educational page',()=>{
 assert.equal(atlasProblemIndex.length,518);
 for(const p of atlasProblemIndex){
  const w=workbookForTopic(p.id);
  assert.ok(w,'no workbook for '+p.id);
  assert.ok(w.what.length>25,p.id);
  assert.ok(w.cycle.length>25,p.id);
  assert.equal(w.id,'topic/'+p.id);
  assert.equal(w.lanes.length,5);
  assert.ok(w.lanes.every(l=>l.methods.length>=1));
  assert.equal(w.safetyFirst,isSafetyPriority(p.id));
  assert.ok(w.lanes.every(l=>toolsById.has(l.tool)),p.id+' invalid original tool reference');
 }
});
test('safety and disorder-specific boundaries carry into the new full workbook',()=>{
 const panic=workbookForChoice('regulate','panicky');
 const fatigue=workbookForChoice('regulate','drained');
 const sensory=workbookForChoice('regulate','sensory');
 const trauma=workbookForChoice('process','event');
 const ocd=workbookForChoice('learn','checking');
 const unsafe=workbookForChoice('relate','unsafe');
 assert.match(panic.cautions.join(' '),/999|emergency|chest pain/i);
 assert.match(fatigue.cautions.join(' '),/graded.exercise|post-exertional/i);
 assert.match(sensory.cautions.join(' '),/forced|painful/i);
 assert.match(trauma.cautions.join(' '),/trauma retelling|debrief/i);
 assert.match(ocd.cautions.join(' '),/exposure and response prevention/i);
 assert.equal(unsafe.safetyFirst,true);
 assert.equal(workbookForTopic('suicidal-thoughts').safetyFirst,true);
 assert.equal(workbookForTopic('insomnia').safetyFirst,false);
});
test('new renderer contains genuine in-page interactive worksheets, private export and no clinical scoring',()=>{
 const ui=readFileSync('ns-integrated-workbook.mjs','utf8');
 const router=readFileSync('site.mjs','utf8');
 const css=readFileSync('index.html','utf8');
 for(const chapter of ['recognition','context','practice','thinking','dbt','acceptance','support']){
  assert.ok(ui.includes(chapter),chapter+' missing');
 }
 assert.match(ui,/data-wb-field/);
 assert.match(ui,/data-wb-action/);
 assert.match(ui,/data-wb-mount/);
 assert.match(ui,/data-wb-download/);
 assert.match(ui,/data-wb-clear/);
 assert.match(ui,/selectedIndex=0/);
 assert.doesNotMatch(ui,/data-wb-topic-results|Find a specific difficulty|atlasChooser/);
 assert.match(ui,/if\(locked\)/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|sendBeacon|fetch\(/);
 assert.doesNotMatch(ui,/anxiety score|diagnostic score|validated treatment/);
 assert.match(router,/"workbook":|workbook: \(\)/);
 assert.match(router,/"workbook-topic":/);
 assert.match(css,/ns-integrated-workbook.css/);
});
