import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const unit=JSON.parse(readFileSync(new URL('../../learn-content/contingent-self-worth-unit.json',import.meta.url),'utf8'));
test('the supplied contingent self-worth manuscript is complete',()=>{
 assert.equal(unit.id,'contingent-self-worth');
 assert.equal(unit.lessons.length,8);
 assert.equal(unit.intro.screens.length,2);
 assert.equal(unit.reviews.length,3);
 const screens=[...unit.intro.screens,...unit.lessons.flatMap(l=>l.screens),...unit.reviews.flatMap(r=>r.screens)];
 assert.equal(screens.length,80);
 assert.equal(new Set(screens.map(s=>s.id)).size,80);
 assert.ok(screens.every(s=>s.paragraphs.length>=4),'Every screen has substantive content');
 for(const s of screens){
  const a=s.paragraphs.find(p=>/^(?:Correct answer|Best answer|Best-supported answer|Best-supported response):\s*[A-D]/i.test(p));
  if(!a)continue;
  const key=a.match(/:\s*([A-D])/i)[1];
  assert.ok(s.paragraphs.some(p=>p.startsWith(key+'. ')||p.startsWith('Option '+key)),s.id+' has an answer not found in its options');
 }
});
test('complete stories, lessons, reflection and source attribution survive publication',()=>{
 const all=JSON.stringify(unit).toLowerCase();
 for(const fragment of ['Nina','Asha','contingent self-worth','Crocker','Self-compassion','The funding application was rejected','My Field Guide','R3'])
  assert.ok(all.includes(fragment.toLowerCase()),'Missing source material: '+fragment);
 assert.equal(unit.lessons[5].screens.length,10);
 assert.equal(unit.lessons[7].screens.length,11);
});
