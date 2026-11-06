import test from 'node:test';
import assert from 'node:assert/strict';
import {renderLivingTrail,trailUnitPlan,livingTrailManifest} from '../../ns-living-trail.mjs';

const render = world => {const target={innerHTML:''};renderLivingTrail(target,world);return target.innerHTML;};
test('five trails each show exactly forty individually named unit headings',()=>{
 assert.equal(Object.keys(trailUnitPlan).length,5);
 for(const [world,units] of Object.entries(trailUnitPlan)){
  assert.equal(units.length,40,world);
  assert.equal(new Set(units.map(u=>u.title)).size,40,world);
  assert.ok(units.every((unit,i)=>unit.number===i+1 && unit.id===`unit-${i+1}`));
  assert.equal(units[0].availability,'activities-available');
  assert.ok(units.slice(1).every(u=>u.availability==='planned'));
  const html=render(world);
  assert.equal((html.match(/data-unit="unit-\d+"/g)||[]).length,40,world);
  assert.equal((html.match(/ns-trail-unit--planned/g)||[]).length,39,world);
  assert.equal((html.match(/data-trail-jump="unit-\d+"/g)||[]).length,40,world);
  assert.ok(html.includes('40 units to explore'));
  assert.ok(html.includes('COMING LATER'));
 }
});
test('planning does not manufacture finished lessons or progress',()=>{
 for(const {id,available,unitCount} of livingTrailManifest.worlds){
  assert.equal(unitCount,40);
  const html=render(id);
  assert.equal((html.match(/data-trail-node="/g)||[]).length,available.length*2);
  assert.ok(html.includes('Units 2–40 are an outline'));
  assert.ok(!html.includes('localStorage.setItem'));
 }
 assert.equal(livingTrailManifest.missionRoute,'#lab/mission/reality-sorter/notice');
});
