import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {NEEDS_MODES} from '../../ns-needs-catalog.mjs';
import {atlasProblemIndex,isSafetyPriority} from '../../ns-atlas-core.mjs';
import {workbookForChoice,workbookForTopic} from '../../ns-integrated-workbook-data.mjs';
import {REGULATION_GAMES,GAME_BY_ID,GAME_FILTERS,gamesForGuide,gamesForFilter,gameFamilyForGuide} from '../../ns-regulation-games-data.mjs';

const source=path=>readFileSync(path,'utf8');
test('twelve distinct original no-writing games provide a playable and useful choice of activity',()=>{
 assert.equal(REGULATION_GAMES.length,12);
 assert.equal(new Set(REGULATION_GAMES.map(g=>g.id)).size,12);
 for(const g of REGULATION_GAMES){
  assert.ok(g.description.length>=35,g.id);
  assert.ok(g.help.length>=35,g.id);
  assert.ok(g.caution.length>=28,g.id);
  assert.ok(['calm','ground','focus','play','agency'].includes(g.type),g.id);
  assert.ok(g.effort==='low'||g.effort==='medium',g.id);
  assert.match(g.duration,/\d/,g.id);
  assert.strictEqual(GAME_BY_ID[g.id],g);
 }
 const module=source('ns-regulation-games.mjs');
 for(const g of REGULATION_GAMES)assert.ok(module.includes("'"+g.id+"'"),g.id+' missing game implementation');
 for(const input of ['paint','anchor','room','pebble','cloud','star','tap','move','pair','find','path','toggle','pace']){
  assert.ok(module.includes("case '"+input+"'"),input+' action missing');
 }
 assert.ok(GAME_FILTERS.some(f=>f.id==='all'));
});
test('game scrollers cover all seven navigation modes and all 53 choices with explicit safety exceptions',()=>{
 let count=0;
 for(const mode of NEEDS_MODES){
  for(const option of mode.options){
   const guide=workbookForChoice(mode.id,option.id);
   assert.ok(guide,mode.id+'/'+option.id);
   const deck=gamesForGuide(guide);count++;
   if(guide.safetyFirst){assert.equal(deck.length,0,guide.id);continue;}
   assert.ok(deck.length>=5,guide.id);
   assert.ok(deck.length<=10,guide.id);
   assert.equal(new Set(deck.map(g=>g.id)).size,deck.length,guide.id);
   assert.ok(deck.some(g=>g.type==='calm'||g.type==='ground'),guide.id);
   assert.ok(deck.some(g=>g.type==='agency'),guide.id);
   assert.ok(deck.filter(g=>g.effort==='low').length>=3,guide.id);
  }
 }
 assert.equal(NEEDS_MODES.length,7);
 assert.equal(count,53);
});
test('every atlas topic has a safe no-writing game selection or human-support-first exception',()=>{
 assert.equal(atlasProblemIndex.length,166);
 let noGames=0;
 for(const topic of atlasProblemIndex){
  const guide=workbookForTopic(topic.id);
  assert.ok(guide);
  const games=gamesForGuide(guide);
  if(isSafetyPriority(topic.id)){
   noGames++;
   assert.equal(games.length,0,'unsafe guidance must not show games: '+topic.id);
  }else{
   assert.ok(games.length>=5,'no games for '+topic.id);
   assert.ok(games.some(g=>g.type==='agency'),topic.id+' missing practical choices');
  }
 }
 assert.ok(noGames>=5);
});
test('regulation games vary by situation and avoid potentially aggravating options',()=>{
 const get=id=>gamesForGuide(workbookForTopic(id)).map(x=>x.id);
 const anxiety=get('anxiety'),panic=get('panic-experiences'),
  checking=get('checking'),insomnia=get('insomnia'),
  sensory=get('sensory-overload');
 assert.ok(anxiety.includes('breath-garden'),'anxiety has optional visual breathing');
 assert.ok(!panic.includes('breath-garden'),'panic must not push a breath-monitoring exercise');
 assert.ok(!checking.includes('pair-garden'),'checking excludes compulsive matching loops');
 assert.ok(!checking.includes('steady-taps'),'checking excludes repetitive tapping');
 assert.ok(!sensory.includes('star-garden'),'overstimulation excludes lit stars');
 assert.ok(!sensory.includes('steady-taps'),'overstimulation excludes repeated tapping');
 assert.ok(insomnia.includes('quiet-room'),'sleep includes a lower-stimulation setting');
 assert.ok(!gamesForGuide(workbookForChoice('regulate','drained')).some(x=>x.id==='pair-garden'));
 assert.notDeepEqual(anxiety,insomnia,'same deck is not indiscriminately applied');
 assert.equal(gameFamilyForGuide(workbookForTopic('procrastination')),'action');
 for(const f of GAME_FILTERS){
  const selected=gamesForFilter(gamesForGuide(workbookForTopic('procrastination')),f.id);
  assert.ok(selected.length>0,f.id+' should provide options for action-related difficulties');
 }
});
test('game scroller is a distinct no-writing section below the unchanged worksheet and never saves or submits',()=>{
 const chooser=source('ns-intervention-chooser.mjs'),ui=source('ns-regulation-games.mjs');
 const css=source('ns-regulation-games.css'),index=source('index.html');
 const site=source('site.mjs'),home=source('strategy.mjs');
 assert.match(chooser,/data-ns-games-host/);
 assert.match(chooser,/renderGameCarousel\(surface.querySelector\('\[data-ns-games-host\]'\),g\)/);
 assert.ok(chooser.indexOf('data-ns-games-host')>chooser.indexOf('data-pick-selected'));
 assert.match(ui,/data-game-track/);
 assert.match(ui,/data-game-open/);
 assert.match(ui,/data-game-active/);
 assert.match(ui,/data-game-direction/);
 assert.match(ui,/data-game-close/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(index,/ns-regulation-games.css/);
 assert.match(source('sw.js'),/ns-regulation-games.mjs/);
 assert.doesNotMatch(ui,/localStorage|sessionStorage|sendBeacon|fetch\(|speechSynthesis|AudioContext|setInterval|setTimeout/);
 assert.doesNotMatch(ui,/<textarea|<input|data-game-score|data-game-streak|leaderboard/i);
 assert.match(site,/location.replace\('#navigate'\)/);
 assert.doesNotMatch(home,/<strong>Browse tools<\/strong>/);
 assert.ok(home.indexOf('ns-home-compass')>home.indexOf('ns-home-hypothesis'));
 assert.match(home,/href="#compass"/);
});
