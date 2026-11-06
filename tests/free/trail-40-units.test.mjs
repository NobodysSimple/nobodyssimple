import test from 'node:test';
import assert from 'node:assert/strict';
import {renderLivingTrail,trailUnitPlan,livingTrailManifest,continuousScene,trailX} from '../../ns-living-trail.mjs';
const render=world=>{const main={innerHTML:''};renderLivingTrail(main,world);return main.innerHTML;};
test('five worlds preserve 40 individually named units and planned status',()=>{
 assert.equal(Object.keys(trailUnitPlan).length,5);
 for(const [world,units] of Object.entries(trailUnitPlan)){
  assert.equal(units.length,40);assert.equal(new Set(units.map(u=>u.title)).size,40);
  assert.ok(units.every((u,i)=>u.number===i+1&&u.id===`unit-${i+1}`));
  assert.equal(units[0].availability,'activities-available');assert.ok(units.slice(1).every(u=>u.availability==='planned'));
  const html=render(world);assert.equal((html.match(/data-unit="unit-\d+"/g)||[]).length,40);assert.equal((html.match(/ns-trail-unit--planned/g)||[]).length,39);
  assert.ok(!html.includes('Design goals'));
 }
});
test('planned units are not made to look playable or completed',()=>{
 for(const w of livingTrailManifest.worlds){
  assert.equal(w.unitCount,40);const html=render(w.id);
  assert.equal((html.match(/data-trail-node="/g)||[]).length,w.available.length);
  assert.ok(html.includes('COMING SOON'));assert.ok(!html.includes('data-trail-view="list"'));
 }
 assert.deepEqual(livingTrailManifest.viewModes,['map']);
});
test('each world has one continuous full-height scene with a destination',()=>{
 for(const world of livingTrailManifest.worlds){
  const html=render(world.id),svg=continuousScene(world.id);
  assert.equal((html.match(/class="ns-trail-continuous-scene"/g)||[]).length,1);
  assert.ok(!html.includes('ns-trail-scenetile'));assert.ok(html.includes(world.destination));
  assert.ok(svg.includes('viewBox="0 0 480 14970"'));
  assert.ok((svg.match(/ C /g)||[]).length>200);
 }
});
test('road curves smoothly in both directions',()=>{
 for(const world of livingTrailManifest.worlds){
  let up=false,down=false,prev=trailX(0,world.id);
  for(let y=20;y<14970;y+=20){let x=trailX(y,world.id);assert.ok(x>=105&&x<=375);assert.ok(Math.abs(x-prev)<30);if(x>prev+2)up=true;if(x<prev-2)down=true;prev=x;}
  assert.ok(up&&down);
 }
});
