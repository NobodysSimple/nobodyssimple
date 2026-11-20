import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=name=>readFileSync(new URL('../../'+name,import.meta.url),'utf8');

test('live Learn page loads newly versioned course and visual assets',()=>{
 const html=source('index.html'),site=source('site.mjs'),hub=source('ns-learn-courses.mjs'),worker=source('sw.js');
 assert.ok(html.includes('ns-learn-makeover.css?v=live-redesign-20261120'));
 assert.ok(html.includes('site.mjs?v=live-redesign-20261120'));
 assert.ok(site.includes('ns-learn-courses.mjs?v=live-redesign-20261120'));
 assert.ok(hub.includes('ns-learn-player-v2.mjs?v=live-redesign-20261120'));
 assert.ok(worker.includes('nobodyssimple-release-v242-live-learn'));
 assert.ok(worker.includes('ns-learn-makeover.css'));
});
test('existing published courses render real progress and interactive lesson paths',()=>{
 const hub=source('ns-learn-courses.mjs');
 assert.ok(hub.includes('getCurrentLearnCompletion'));
 assert.ok(hub.includes('ns-learn-journey__stop'));
 assert.ok(hub.includes('ns-learn-detail-start'));
 assert.ok(hub.includes('companionX'));
 assert.ok(hub.includes("bundle?'<section"));
});
test('real Learn activities receive styled type banners without changing scoring',()=>{
 const player=source('ns-learn-player-v2.mjs'),css=source('ns-learn-makeover.css');
 assert.ok(player.includes('data-node-type='));
 assert.ok(player.includes('nodeIllustrations'));
 for(const x of ['data-node-type=dialogue','data-node-type=label','data-node-type=sort','data-node-type=perspective','ns-course-card__art','ns-atlas-lesson__feedback'])assert.ok(css.includes(x),x);
 assert.ok(css.includes('media/lifelab/companions.png'));
 assert.ok(css.includes('prefers-reduced-motion:reduce'));
});
