import assert from 'node:assert/strict';
import { trailUnitPlan, livingTrailManifest } from '../../ns-living-trail.mjs';

assert.equal(livingTrailManifest.worlds.length, 5, 'Five Life Lab worlds should be registered');
for (const world of livingTrailManifest.worlds) {
  assert.equal(trailUnitPlan[world.id].length, 40, `${world.id} should expose 40 unit entries`);
}
console.log('living-trail-worlds.test.mjs passed');
