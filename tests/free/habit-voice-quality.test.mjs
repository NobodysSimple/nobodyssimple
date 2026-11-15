import test from 'node:test';
import assert from 'node:assert/strict';
import {HABIT_GUIDES,HABIT_BY_ID} from '../../ns-habit-guide-data.mjs';
import {HABIT_SUPPORT_MORE} from '../../ns-habit-support-more.mjs';

test('all fifteen manuals have substantive compassionate articles',()=>{
 assert.equal(HABIT_GUIDES.length,15);
 const starts=new Set();
 for(const g of HABIT_GUIDES){
  assert.equal(g.article.length,10,g.id);
  assert.ok(g.article.join(' ').trim().split(/\s+/).length>=500,g.id);
  assert.ok(g.article.every(p=>p.trim().split(/\s+/).length>=25),g.id+' thin paragraph');
  assert.match(g.article.join(' '),/\b(?:you|your|you've|you're)\b/i,g.id+' missing direct address');
  assert.ok(!starts.has(g.article[0]),g.id+' reused introduction');starts.add(g.article[0]);
  assert.equal(g.routes.length,4);
  assert.equal(g.whyQuestions.length,10);
  assert.ok(g.whyIntro.length>=180,g.id+' missing personalised Why');
 }
});
test('article prose avoids generic contrast slogans and ornamental lists',()=>{
 const all=HABIT_GUIDES.flatMap(g=>g.article).join(' ');
 for(const pattern of [
  /\b(?:delve|tapestry|pivotal|multifaceted|showcase|underscores)\b/i,
  /\b(?:not just .{1,80} but also|it's not .{1,80} it's)\b/i,
  /\b(?:in conclusion|it is important to note)\b/i,
  /\b[a-z]+,\s+[a-z]+,\s+(?:and|or)\s+[a-z]+\b/i
 ])assert.doesNotMatch(all,pattern);
});
test('guided pathways have unique prompts, purposes and support options',()=>{
 const qs=[],why=[],support=[];
 for(const g of HABIT_GUIDES){
  for(const route of g.routes){
   assert.ok(route.description.length>90,g.id+'/'+route.id+' short route guidance');
   assert.equal(route.questions.length,4,g.id+'/'+route.id);
   qs.push(...route.questions.map(([q])=>q));
  }
  why.push(...g.whyQuestions);
  support.push(...HABIT_SUPPORT_MORE[g.id]);
  assert.deepEqual(g.ideas.support.slice(12),HABIT_SUPPORT_MORE[g.id]);
  for(const example of g.whyCases){
   assert.ok(example.function.length>70&&example.adaptation.length>60,g.id+' generic functional map');
  }
 }
 assert.equal(qs.length,240);
 assert.equal(new Set(qs).size,240,'duplicated journal questions');
 assert.equal(why.length,150);
 assert.equal(new Set(why).size,150,'duplicated Understand Why questions');
 assert.equal(support.length,180);
 assert.equal(new Set(support).size,180);
});
test('safety-sensitive guidance keeps actual clinical distinctions',()=>{
 assert.match(HABIT_BY_ID.get('energy-action').prominentSafety,/post-exertional/i);
 assert.match(HABIT_BY_ID.get('habit-urges').safety,/withdrawal|dependent/i);
 assert.match(HABIT_BY_ID.get('habit-urges').safety,/OCD/i);
 assert.match(HABIT_BY_ID.get('avoidance').safety,/unsafe|abusive/i);
 assert.match(HABIT_BY_ID.get('risky-sex').safety,/coercion|assault/i);
 assert.match(HABIT_BY_ID.get('risk-taking').prominentSafety,/risk|harm/i);
});
