import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderLivingTrail,livingTrailManifest} from '../../ns-living-trail.mjs';
const css=readFileSync(new URL('../../ns-living-trail.css',import.meta.url),'utf8');

test('eight chapter identities and five unique final destinations',()=>{
 const finals=new Set();
 for(const world of livingTrailManifest.worlds){
  assert.equal(world.chapters.length,8);
  assert.ok(world.chapters.every(ch=>ch.length>3));
  finals.add(world.destination);
  const main={innerHTML:''};renderLivingTrail(main,world.id);
  for(let i=1;i<=8;i++)assert.ok(main.innerHTML.includes(`data-chapter-marker="${i}"`));
  assert.ok(main.innerHTML.includes(world.destination));
  assert.ok(main.innerHTML.includes('Planned conclusion · Not yet playable'));
 }
 assert.equal(finals.size,5);
});
test('new CSS takes ownership of seamless map only and keeps preference controls',()=>{
 for(const keyword of ['.ns-trail-continuous-scene','.ns-trail-continuum','.ns-trail-future-node','.ns-trail-chapter-marker','.ns-trail-destination','data-low-stim','data-theme=dark','prefers-reduced-motion']){
  assert.ok(css.includes(keyword),keyword);
 }
});
