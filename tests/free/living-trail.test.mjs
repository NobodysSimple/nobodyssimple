import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderNSLab,cleanupNSLab,lifeLabDefinition} from '../../ns-life-lab.mjs';
import {livingTrailManifest,trailSegmentCount} from '../../ns-living-trail.mjs';
const root={innerHTML:'',querySelector(){return null}};
const file=p=>readFileSync(new URL('../../'+p,import.meta.url),'utf8');

test('five worlds have real, correctly scoped active nodes',()=>{
 assert.equal(livingTrailManifest.worlds.length,5);
 assert.equal(livingTrailManifest.missionRoute,'#lab/mission/reality-sorter/notice');
 const all=livingTrailManifest.worlds.flatMap(w=>w.available);
 assert.equal(all.filter(x=>x.status==='mission').length,1);
 for(const n of all)assert.ok(n.href.startsWith(n.status==='mission'?'#lab/mission/':'#tool/'));
 assert.ok(!file('ns-living-trail.mjs').includes('localStorage.setItem('));
 assert.ok(!file('ns-living-trail.mjs').includes('sessionStorage.setItem('));
 assert.equal(livingTrailManifest.worlds.find(w=>w.id==='forest').available[0].id,'reality-sorter');
});
test('a single course view replaces both duplicated world selectors',()=>{
 for(const world of livingTrailManifest.worlds){
  renderNSLab(root,[world.id]);
  assert.ok(root.innerHTML.includes('data-living-trail'));
  assert.ok(root.innerHTML.includes(`data-trail-world="${world.id}"`));
  assert.ok(root.innerHTML.includes('data-trail-switch'));
  assert.ok(!root.innerHTML.includes('data-trail-list'));
  assert.ok(root.innerHTML.includes('New activities to come'));
  assert.ok(!root.innerHTML.includes('ns-lab5-worldgrid'));
  cleanupNSLab();
 }
});
test('invalid routes are honest and the established mission is unchanged',()=>{
 renderNSLab(root,['neverland']);assert.ok(root.innerHTML.includes("That world isn't available"));
 renderNSLab(root,['forest','invalid']);assert.ok(root.innerHTML.includes('not available'));
 renderNSLab(root,['mission','reality-sorter','notice']);
 assert.ok(root.innerHTML.includes('data-lab-action="sort"'));
 assert.ok(root.innerHTML.includes('STEP 1 OF 6'));
 cleanupNSLab();
 assert.deepEqual(lifeLabDefinition.stages,['notice','explore','evidence','choose','test','review']);
});
test('map CSS is scoped and provides continuous map/reduced-stimulation',()=>{
 const css=file('ns-living-trail.css');const html=file('index.html'),sw=file('sw.js');
 for(const token of ['.ns-living-trail','.ns-trail-scenery','.ns-trail-node','[hidden]','data-low-stim','data-theme=dark'])assert.ok(css.includes(token),token);
 assert.ok(html.includes('ns-living-trail.css'));
 assert.ok(sw.includes('ns-living-trail.mjs'));
 assert.ok(sw.includes('ns-living-trail.css'));
});

test('legacy segment-count helper remains backward compatible while scenery is continuous',()=>{
 assert.equal(trailSegmentCount(0),1);
 assert.equal(trailSegmentCount(1),1);
 assert.equal(trailSegmentCount(4),1);
 assert.equal(trailSegmentCount(5),2);
 assert.equal(trailSegmentCount(8),2);
 assert.equal(trailSegmentCount(17),5);
});
