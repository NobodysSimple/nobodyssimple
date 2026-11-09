import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {NEEDS_MODES} from '../../ns-needs-catalog.mjs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {workbookForChoice,workbookForTopic} from '../../ns-integrated-workbook-data.mjs';
import {deckForWorkbook,filterCards,cardFilters,interventionKinds,supplementaryInterventions} from '../../ns-intervention-cards.mjs';

const kinds=new Set(Object.keys(interventionKinds));
test('all 53 choice pages have a usable varied intervention deck or safety-first instructions',()=>{
 let total=0;
 for(const mode of NEEDS_MODES){
  for(const choice of mode.options){
   total++;
   const g=workbookForChoice(mode.id,choice.id);
   const cards=deckForWorkbook(g);
   if(g.safetyFirst){
    assert.equal(cards.length,0,g.id);
    continue;
   }
   assert.ok(cards.length>=12,g.id+' has an insufficiently varied deck ('+cards.length+')');
   assert.equal(new Set(cards.map(x=>x.id)).size,cards.length,g.id+' has duplicate card ids');
   assert.ok(new Set(cards.map(x=>x.kind)).size>=5,g.id+' must offer different types');
   assert.ok(cards.some(c=>c.time==='now'),g.id+' needs low-barrier immediate approaches');
   assert.ok(cards.some(c=>c.time==='long'),g.id+' needs longitudinal options');
   assert.ok(cards.some(c=>c.effort==='light'),g.id+' needs low-demand choices');
   assert.ok(cards.some(c=>c.kind==='cognitive'),g.id+' needs thinking approaches');
   assert.ok(cards.some(c=>c.kind==='acceptance'),g.id+' needs acceptance options');
   assert.ok(cards.some(c=>c.kind==='support'),g.id+' needs support options');
   assert.ok(cards.some(c=>c.kind==='environment'),g.id+' needs practical options');
   assert.ok(cards.every(c=>kinds.has(c.kind)),g.id+' unknown kind');
   for(const card of cards){
    assert.ok(card.title.length>10,g.id+'/'+card.id);
    assert.ok(card.why.length>30,g.id+'/'+card.id);
    assert.ok(card.steps.length>=2,g.id+'/'+card.id);
    assert.ok(card.duration,g.id+'/'+card.id);
    assert.ok(['light','medium','high'].includes(card.effort),g.id+'/'+card.id);
    assert.ok(['now','short','long'].includes(card.time),g.id+'/'+card.id);
    assert.ok(card.worksheet,g.id+'/'+card.id);
   }
   for(const lane of g.lanes){
    for(let i=0;i<lane.methods.length;i++){
     assert.ok(cards.some(c=>c.id==='source-'+lane.id+'-'+i),g.id+' missing original method '+lane.id+'/'+i);
    }
   }
  }
 }
 assert.equal(total,53);
});
test('all 518 atlas entries have proportionate choices without bypassing safeguarding',()=>{
 assert.equal(atlasProblemIndex.length,518);
 for(const topic of atlasProblemIndex){
  const g=workbookForTopic(topic.id);
  const cards=deckForWorkbook(g);
  if(g.safetyFirst){
   assert.equal(cards.length,0,topic.id+' safety-first topic should not expose self-treatment');
  }else{
   assert.ok(cards.length>=(g.contextFirst?8:12),topic.id+' needs an appropriate range of optional choices');
    if(g.contextFirst)assert.ok(cards.length<=10,topic.id+' editorial topic should not be given a full unvalidated treatment deck');
   assert.ok(cards.some(c=>c.source==='guide'),topic.id+' must preserve contextual methods');
   assert.ok(cards.some(c=>c.source==='general'),topic.id+' must label broader skills');
  }
 }
});
test('low-demand, longer-term, cognitive, DBT, ACT, behavioural and practical filters work',()=>{
 const g=workbookForChoice('regulate','overwhelmed'),deck=deckForWorkbook(g);
 for(const f of cardFilters)assert.ok(filterCards(deck,f.id).length>0,'empty '+f.id);
 assert.equal(filterCards(deck,'all').length,deck.length);
 assert.ok(filterCards(deck,'light').every(x=>x.effort==='light'));
 assert.ok(filterCards(deck,'now').every(x=>x.time==='now'));
 assert.ok(filterCards(deck,'long').every(x=>x.time==='long'));
 assert.ok(filterCards(deck,'thinking').every(x=>x.group==='thinking'));
 assert.ok(filterCards(deck,'regulation').every(x=>x.group==='regulation'));
 assert.ok(supplementaryInterventions.length>=12);
 assert.equal(new Set(supplementaryInterventions.map(x=>x.worksheet)).size,supplementaryInterventions.length);
 assert.ok(deck.some(c=>c.source==='guide'&&c.refs.length>0));
});
test('avoid adding self-directed symptom tracking where it could aggravate monitoring and compulsions',()=>{
 for(const id of ['topic/checking','topic/panic-experiences','topic/insomnia']){
  const g=workbookForTopic(id.slice(6));
  const cards=deckForWorkbook(g);
  assert.ok(!cards.some(c=>c.id==='track-context'),id+' must not suggest extra symptom-monitoring');
 }
 const checking=deckForWorkbook(workbookForChoice('learn','checking'));
 assert.ok(!checking.some(c=>c.id==='track-context'));
 const depleted=deckForWorkbook(workbookForChoice('regulate','drained'));
 assert.ok(!depleted.some(c=>c.id==='micro-first-step'));
});
test('renderer loads one selected task after the explanation; no mandatory score, persistence or automatic claims',()=>{
 const main=readFileSync('ns-integrated-workbook.mjs','utf8');
 const chooser=readFileSync('ns-intervention-chooser.mjs','utf8');
 const index=readFileSync('index.html','utf8');
 assert.match(main,/renderInterventionChooser\(root,g,\{locked\}\)/);
 assert.match(chooser,/ns-pick-understand/);
 assert.match(chooser,/ns-pick-chooser/);
 assert.match(chooser,/ns-pick-dialog/);
 assert.match(chooser,/data-pick-choose/);
 assert.match(chooser,/ns-pick-selected/);
 assert.match(chooser,/const drafts=new Map\(\)/);
 assert.match(chooser,/data-pick-review/);
 assert.match(chooser,/data-pick-download/);
 assert.match(chooser,/data-pick-clear/);
 assert.match(chooser,/g.safetyFirst/);
 assert.match(chooser,/if\(locked\)/);
 assert.match(chooser,/showModal\(/);
 assert.match(index,/ns-intervention-chooser.css/);
 assert.doesNotMatch(chooser,/localStorage|sessionStorage|sendBeacon|fetch\(/);
});
