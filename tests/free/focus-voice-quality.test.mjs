import test from 'node:test';
import assert from 'node:assert/strict';
import {FOCUS_GUIDES} from '../../ns-focus-guide-data.mjs';

/* Guard the editorial standard established by the supplied Fear of Being Judged reference.
   These tests look for recurring mechanical habits; they never claim to detect authorship. */
test('focus manuals speak to the reader with substantive person-first prose',()=>{
 for(const guide of FOCUS_GUIDES){
  const words=guide.article.join(' ').trim().split(/\s+/).length;
  assert.ok(words>=500,guide.id+' lost substantive context');
  assert.equal(guide.article.length,10,guide.id+' article structure changed');
  assert.match(guide.article.join(' '),/\b(?:you|your|you've|you're)\b/i,guide.id+' lost direct address');
  assert.ok(guide.article.every(p=>p.split(/\s+/).length>=27),guide.id+' empty or slogan-like paragraph');
  assert.equal(guide.profiles.length,4);
  assert.equal(guide.routes.length,4);
 }
});
test('long-form prose avoids stock AI rhetorical templates',()=>{
 const corpus=FOCUS_GUIDES.flatMap(g=>g.article).join(' ');
 for(const cliche of [
  /\b(?:delve|tapestry|pivotal|multifaceted|showcase|underscores)\b/i,
  /\b(?:in conclusion|it is important to note|this serves as a testament)\b/i,
  /\b(?:not just .{1,80} but also|it's not .{1,80} it's)\b/i,
 ]){
  assert.doesNotMatch(corpus,cliche);
 }
 const sentences=corpus.split(/(?<=[.!?])\s+/);
 // Flag only unmistakable ornamental tricolons, not ordinary subordinate commas.
 const tricolons=sentences.filter(s=>/\b[a-z]+,\s+[a-z]+,\s+(?:and|or)\s+[a-z]+\b/i.test(s));
 assert.equal(tricolons.length,0,'Repeated three-item lists appeared in the articles: '+tricolons.slice(0,2).join(' / '));
});
test('guided journals and understanding questions use independently written topic-specific prompts',()=>{
 const journalQs=[],whyQs=[],starts=[];
 for(const guide of FOCUS_GUIDES){
  starts.push(guide.article[0]);
  whyQs.push(...guide.whyQuestions);
  for(const route of guide.routes){
   journalQs.push(...route.questions.map(([question])=>question));
   assert.ok(route.description.length>95,guide.id+'/'+route.id+' lost the tailored guidance');
  }
 }
 assert.equal(new Set(starts).size,11);
 assert.equal(journalQs.length,176);
 assert.equal(new Set(journalQs).size,176);
 assert.equal(whyQs.length,110);
 assert.equal(new Set(whyQs).size,110);
});
