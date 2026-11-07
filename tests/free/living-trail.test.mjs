import test from 'node:test';
import assert from 'node:assert/strict';
import {renderNSLab,cleanupNSLab,lifeLabDefinition} from '../../ns-life-lab.mjs';
import {livingTrailManifest,trailSegmentCount,renderLivingTrail,markLabNodeComplete,nextLabNode} from '../../ns-living-trail.mjs';
const root={innerHTML:'',querySelector(){return null},addEventListener(){}};
test('five world routes and one authored mission',()=>{
 assert.equal(livingTrailManifest.worlds.length,5);
 assert.equal(livingTrailManifest.worlds.flatMap(w=>w.available).filter(n=>n.status==='mission').length,1);
 assert.equal(livingTrailManifest.missionRoute,'#lab/mission/reality-sorter/notice');
 for(const world of livingTrailManifest.worlds){renderNSLab(root,[world.id]);assert.ok(root.innerHTML.includes(`${world.id}-unit-40-stone-5`));assert.ok(root.innerHTML.includes('ll-trail-link'));assert.ok(!root.innerHTML.includes('ns-lab5-worldgrid'));cleanupNSLab();}
});
test('the immersive course has no design/showcase panels or list view',()=>{
 const main={innerHTML:''};renderLivingTrail(main,'forest');
 for(const bad of ['Design goals','The whole Forest course is now authored','Mission icons & nodes','ns-trail-aside','ns-trail-list','ns-forest-panel'])assert.ok(!main.innerHTML.includes(bad),bad);
 assert.ok(main.innerHTML.includes('data-continuous-landscape="forest"'));
 assert.ok(main.innerHTML.includes('ns-trail-walker'));
 assert.ok(main.innerHTML.includes('The Summit'));
});
test('explicit completion advances the character and preserves other learning records',()=>{
 const store=new Map([['ns-account-learning-v2',JSON.stringify({'ns-skill:existing':{completed:true}})]]);
 globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,v)};
 assert.equal(nextLabNode('forest'),'reality-sorter');
 assert.equal(markLabNodeComplete('forest','reality-sorter'),true);
 assert.equal(nextLabNode('forest'),'reality-map');
 assert.equal(JSON.parse(store.get('ns-account-learning-v2'))['ns-skill:existing'].completed,true);
});
test('invalid routes remain honest and mission content remains unchanged',()=>{
 renderNSLab(root,['neverland']);assert.ok(root.innerHTML.includes('That world isn’t available'));
 renderNSLab(root,['forest','invalid']);assert.ok(root.innerHTML.includes('not available'));
 renderNSLab(root,['mission','reality-sorter','notice']);assert.ok(root.innerHTML.includes('data-lab-action="sort"'));
 cleanupNSLab();assert.deepEqual(lifeLabDefinition.stages,['notice','explore','evidence','choose','test','review']);
});
test('legacy segment count remains available for consumers',()=>{
 assert.equal(trailSegmentCount(0),1);assert.equal(trailSegmentCount(4),1);assert.equal(trailSegmentCount(5),2);assert.equal(trailSegmentCount(17),5);
});
