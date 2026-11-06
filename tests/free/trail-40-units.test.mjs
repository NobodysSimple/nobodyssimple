import test from 'node:test';
import assert from 'node:assert/strict';
import {renderLivingTrail,trailUnitPlan,livingTrailManifest,continuousScene,trailX} from '../../ns-living-trail.mjs';
const render=world=>{const main={innerHTML:''};renderLivingTrail(main,world);return main.innerHTML;};

test('five worlds have forty individually named units with authored-only availability',()=>{
 assert.equal(Object.keys(trailUnitPlan).length,5);
 for(const [world,units] of Object.entries(trailUnitPlan)){
  assert.equal(units.length,40,world);
  assert.equal(new Set(units.map(u=>u.title)).size,40,world);
  assert.ok(units.every((unit,i)=>unit.number===i+1&&unit.id===`unit-${i+1}`));
  assert.equal(units[0].availability,'activities-available');
  assert.ok(units.slice(1).every(u=>u.availability==='planned'));
  const html=render(world);
  assert.equal((html.match(/data-unit="unit-\d+"/g)||[]).length,40,world);
  assert.equal((html.match(/ns-trail-unit--planned/g)||[]).length,39,world);
  assert.ok(html.includes('40 units · 8 chapters'));
  assert.ok(html.includes('New activities to come'));
 }
});
test('planned units never masquerade as completed courses or save a result',()=>{
 for(const w of livingTrailManifest.worlds){
  assert.equal(w.unitCount,40);
  const html=render(w.id);
  assert.equal((html.match(/data-trail-node="/g)||[]).length,w.available.length);
  assert.ok(html.includes('Units 2–40'));
  assert.ok(!html.includes('data-trail-view="list"'));
  assert.ok(!html.includes('data-trail-jump'));
  assert.ok(!html.includes('data-trail-list'));
 }
 assert.equal(livingTrailManifest.missionRoute,'#lab/mission/reality-sorter/notice');
 assert.deepEqual(livingTrailManifest.viewModes,['map']);
});
test('single full-height svg and one winding road with no repeated scenery panels',()=>{
 for(const w of livingTrailManifest.worlds){
  const html=render(w.id),svg=continuousScene(w.id);
  assert.equal((html.match(/class="ns-trail-continuous-scene"/g)||[]).length,1,w.id);
  assert.equal((html.match(/ns-trail-scenetile/g)||[]).length,0,w.id);
  assert.equal((html.match(/class="ns-trail-chapter-marker"/g)||[]).length,8,w.id);
  assert.ok(html.includes('data-trail-destination')||html.includes('class="ns-trail-destination"'));
  assert.ok(svg.includes('viewBox="0 0 480 14970"'));
  assert.equal((svg.match(/<linearGradient id="ns-trail-ground-/g)||[]).length,1);
  assert.ok((svg.match(/ C /g)||[]).length>200,'Road is composed of smoothly joined cubic curves');
  assert.equal(w.chapters.length,8);
  assert.equal(w.destination.length>2,true);
 }
});
test('winding path stays in-map, changes direction, and remains continuous between units',()=>{
 for(const w of livingTrailManifest.worlds){
  let up=false,down=false;
  let prev=trailX(0,w.id);
  for(let y=20;y<14970;y+=20){
   const x=trailX(y,w.id);
   assert.ok(x>=105&&x<=375,w.id);
   assert.ok(Math.abs(x-prev)<30,`road discontinuity at ${y} in ${w.id}`);
   if(x>prev+2)up=true;
   if(x<prev-2)down=true;
   prev=x;
  }
  assert.ok(up&&down,`${w.id} must wind left and right`);
 }
});
