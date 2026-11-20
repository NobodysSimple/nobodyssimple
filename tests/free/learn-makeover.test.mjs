import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');

test('Learn visual layer is included after original learning CSS',()=>{
 const html=read('index.html');
 assert.ok(html.includes('ns-learn-makeover.css?v=brand-makeover-20261120'));
 assert.ok(html.indexOf('ns-learn-makeover.css')>html.indexOf('ns-strategy-player.css'));
 assert.ok(html.includes('site.mjs?v=brand-makeover-20261120'));
});
test('Course selection uses real course companions, real completion and accessible lesson-path links',()=>{
 const hub=read('ns-learn-courses.mjs');
 assert.ok(hub.includes('media/lifelab')||hub.includes('course.companionX'));
 assert.ok(hub.includes('getCurrentLearnCompletion(bundle,l,records)'));
 assert.ok(hub.includes('ns-learn-journey__stop'));
 assert.ok(hub.includes('ns-learn-detail-start'));
 assert.ok(hub.includes('aria-current="step"')||hub.includes('aria-current='));
});
test('Strategy activities reuse Nobody’s Simple art and keep feedback beside the pinned action',()=>{
 const player=read('ns-strategy-player.mjs');
 assert.ok(player.includes('companionVisual(bundle.id)'));
 assert.ok(player.includes('portraitCoords(name,cast)'));
 assert.ok(player.includes('data-node-type="'+nodeType'));
 assert.ok(player.includes('feedbackTray+footer'));
 assert.ok(player.includes('state.hintOpen'));
 assert.ok(player.includes('state.selected=input.value;'));
 assert.ok(!player.includes('body.scrollTop=body.scrollHeight'));
});
test('Visual system covers dark mode, reduced-motion and distinct node types',()=>{
 const css=read('ns-learn-makeover.css');
 for(const term of [
  'ns-course-card__art','ns-catalogue-detail-hero','ns-learn-journey__track',
  'ns-atlas-lesson__avatar','ns-atlas-lesson__feedback','data-node-type=dialogue',
  'data-node-type=label','data-node-type=sort','data-node-type=perspective',
  'html[data-theme=dark]','prefers-reduced-motion:reduce',
  'media/lifelab/companions.png'
 ])assert.ok(css.includes(term),'Missing visual coverage: '+term);
 let depth=0,min=0,comment=false,quoted='';
 for(let i=0;i<css.length;i++){
  const c=css[i],next=css[i+1];
  if(comment){if(c==='*'&&next==='/'){comment=false;i++;}continue;}
  if(quoted){if(c==='\\'){i++;continue;}if(c===quoted)quoted='';continue;}
  if(c==='/'&&next==='*'){comment=true;i++;continue;}
  if(c==='"'||c==="'"){quoted=c;continue;}
  if(c==='{')depth++;
  if(c==='}')depth--;
  min=Math.min(depth,min);
 }
 assert.equal(depth,0);
 assert.equal(min,0);
 assert.equal(quoted,'');
 assert.equal(comment,false);
});
test('The service worker invalidates old Learn assets',()=>{
 const sw=read('sw.js');
 assert.ok(sw.includes('nobodyssimple-release-v241-learn-makeover'));
 assert.ok(sw.includes('ns-learn-makeover.css'));
});
