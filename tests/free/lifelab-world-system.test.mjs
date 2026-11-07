import test from 'node:test';
import assert from 'node:assert/strict';
import {WORLD_STORIES,GAME_LABELS,gameFor} from '../../ns-lifelab-worlds.mjs';
import {environmentSVG,finaleSVG,boundaryColor,gameArt} from '../../ns-lifelab-scenery.mjs';
import {gameDefinition,isGameCorrect} from '../../ns-lifelab-games.mjs';
import {curriculum} from '../../ns-lifelab-content.mjs';
import {completeFinale,finaleDone,STORAGE_KEY} from '../../ns-lifelab-state.mjs';

test('all resource-sheet characters, stories, regions and games are present and reachable',()=>{
 assert.equal(Object.keys(GAME_LABELS).length,24);
 const characters=new Set(),mapped=new Set();
 for(const [world,data] of Object.entries(WORLD_STORIES)){
  assert.equal(data.characters.length,4);assert.equal(data.story.length,5);
  assert.equal(new Set(data.regions).size,40);
  data.characters.forEach(([name,quote])=>{characters.add(name);assert.ok(quote.length>15);});
  for(let u=1;u<=40;u++)for(let l=1;l<=9;l++){const id=gameFor(world,u,l);mapped.add(id);assert.ok(GAME_LABELS[id]);}
  assert.ok(finaleSVG(world).includes('role="img"'));
 }
 assert.equal(characters.size,20);assert.equal(mapped.size,24);
});
test('all 200 environments are unique and use matching adjacent colour boundaries',()=>{
 const scenes=new Set();
 for(const world of Object.keys(WORLD_STORIES))for(let unit=1;unit<=40;unit++){
  const svg=environmentSVG(world,unit);assert.ok(svg.includes(boundaryColor(world,unit)));assert.ok(svg.includes(boundaryColor(world,unit-1)));
  assert.ok(!svg.includes('<image'));assert.equal(svg,environmentSVG(world,unit));scenes.add(svg);
 }
 assert.equal(scenes.size,200);
});
test('every game accepts correct solutions and rejects incomplete or incorrect ones',()=>{
 for(const [world,data] of Object.entries(WORLD_STORIES))for(const id of [...data.games,'capstone-path']){
  const g=gameDefinition(id,world,1);assert.ok(gameArt(id,world).includes('<svg'));assert.equal(isGameCorrect(g,{}),false);
  let state={};
  if(g.type==='sort')state.assignments=Object.fromEntries(g.items.map((item,i)=>[i,item.target]));
  else if(g.type==='order')state.order=g.items.map((_,i)=>i);
  else if(g.type==='tools')state.selected=g.correct;
  else if(g.type==='branch'){for(let step=0;step<g.steps.length;step++){assert.ok(isGameCorrect(g,{step,answer:g.steps[step].correct}));assert.equal(isGameCorrect(g,{step,answer:(g.steps[step].correct+1)%3}),false);}continue;}
  else state.answer=g.correct;
  assert.equal(isGameCorrect(g,state),true,id);
 }
});
test('finales require all 400 lessons, preserve other records and award completion only once',()=>{
 let raw=JSON.stringify({unrelated:{completed:true}});const store={getItem:k=>k===STORAGE_KEY?raw:null,setItem:(k,v)=>{raw=v;}};
 assert.equal(completeFinale('forest',store).ok,false);assert.equal(finaleDone('forest',JSON.parse(raw)),false);
 const records=JSON.parse(raw);for(const u of curriculum.forest)for(const l of u.lessons)records['ns-lifelab-v3:'+l.id]={completed:true};raw=JSON.stringify(records);
 assert.ok(completeFinale('forest',store).ok);assert.ok(finaleDone('forest',JSON.parse(raw)));assert.ok(JSON.parse(raw).unrelated.completed);
 const saved=raw;assert.ok(completeFinale('forest',store).ok);assert.equal(raw,saved);
 assert.equal(completeFinale('unknown',store).ok,false);
 assert.equal(completeFinale('forest',{getItem:()=>'{bad',setItem:()=>assert.fail()}).ok,false);
});
