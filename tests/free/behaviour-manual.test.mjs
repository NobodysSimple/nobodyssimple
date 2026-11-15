import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasByDomain} from '../../ns-atlas-core.mjs';
import {BEHAVIOUR_IDS,BEHAVIOUR_BY_ID,BEHAVIOUR_GUIDES} from '../../ns-behaviour-guide-data.mjs';
import {HABIT_IDS} from '../../ns-habit-guide-data.mjs';

const expected=[
 'gambling-harms','compulsive-sexual-behaviour','compulsive-exercise',
 'problematic-pornography-use','problematic-gaming-habits','compulsive-reassurance',
 'impulsive-spending','compulsive-social-checking','compulsive-working',
 'habit-change-frustration','urges-under-stress','loss-of-control-behaviour',
 'emotional-dependency','rigidity-and-change','self-sabotaging-patterns',
 'difficulty-receiving-affection','frustration-tolerance','coping-through-avoidance',
 'automatic-habit-cycle'
];
test('all nineteen actual Habits impulses compulsions topics have their own manual',()=>{
 assert.deepEqual(new Set(BEHAVIOUR_IDS),new Set(expected));
 assert.deepEqual(new Set(atlasByDomain('behaviour').map(x=>x.id)),new Set(expected));
 assert.equal(BEHAVIOUR_BY_ID.size,19);
 assert.equal(new Set(HABIT_IDS).size,15,'original Motivation and action guides should remain separate');
 for(const id of expected)assert.ok(BEHAVIOUR_BY_ID.has(id),id+' fallback would be generic');
});
test('all nineteen pages retain independent compassionate longform writing',()=>{
 const intros=new Set();
 for(const g of BEHAVIOUR_GUIDES){
  assert.equal(g.article.length,10,g.id);
  assert.ok(g.article.join(' ').trim().split(/\s+/).length>=480,g.id+' short manual');
  assert.ok(g.article.every(p=>p.trim().split(/\s+/).length>=25),g.id+' thin paragraph');
  assert.ok(!intros.has(g.article[0]),g.id+' repeated opening');
  intros.add(g.article[0]);
  assert.equal(g.mechanisms.length,3);
  assert.equal(g.profiles.length,4);
  assert.equal(g.cycle.length,4);
  assert.equal(g.now.steps.length,3);
  assert.ok(g.sources.length>0&&g.evidence.length>100&&g.safety.length>70,g.id);
 }
});
test('76 journals have unique questions and personalised route coaching',()=>{
 const questions=[];
 for(const g of BEHAVIOUR_GUIDES){
  assert.equal(g.routes.length,4,g.id);
  for(const r of g.routes){
   assert.equal(r.questions.length,4,g.id+'/'+r.id);
   assert.ok(r.practice.length>=39,g.id+'/'+r.id);
   assert.ok(r.description.length>=95,g.id+'/'+r.id+' generic coaching');
   for(const [q,hint,teaching] of r.questions){
    assert.ok(q.length>=19&&hint.length>35&&teaching.length>25,g.id+'/'+r.id);
    questions.push(q);
   }
  }
 }
 assert.equal(questions.length,304);
 assert.equal(new Set(questions).size,304,'reused journal questions');
});
test('304 worked examples and 190 Understand Why questions are topic-specific',()=>{
 const situations=[],why=[];
 for(const g of BEHAVIOUR_GUIDES){
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.ok(g.whyIntro.length>240,g.id);
  for(const c of g.whyCases){
   assert.ok(g.roots.some(r=>r[0]===c.root),g.id+' wrong root');
   for(const key of ['interpretation','response','function','need','rule','adaptation','alternative','action'])
    assert.ok(c[key]?.length>14,g.id+'/'+key);
   situations.push(c.situation);
  }
  why.push(...g.whyQuestions);
 }
 assert.equal(situations.length,304);
 assert.equal(new Set(situations).size,304,'duplicate worked examples');
 assert.equal(why.length,190);
 assert.equal(new Set(why).size,190,'duplicate Why question');
});
test('each page offers personal actions and research-aware safety',()=>{
 for(const g of BEHAVIOUR_GUIDES){
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.equal(g.ideas.support.length,16,g.id);
  assert.ok(g.prominentSafety!==undefined);
 }
 assert.match(BEHAVIOUR_BY_ID.get('gambling-harms').safety,/essential|debt/i);
 assert.match(BEHAVIOUR_BY_ID.get('compulsive-exercise').safety,/injury|eating/i);
 assert.match(BEHAVIOUR_BY_ID.get('compulsive-sexual-behaviour').safety,/moral|consensual/i);
 assert.match(BEHAVIOUR_BY_ID.get('rigidity-and-change').safety,/neurodivergent|routine/i);
 assert.match(BEHAVIOUR_BY_ID.get('compulsive-reassurance').safety,/OCD/i);
 assert.match(BEHAVIOUR_BY_ID.get('coping-through-avoidance').safety,/unsafe|abuse/i);
});
test('all nineteen pages are routed before generic atlas fallback with correct breadcrumb',()=>{
 const site=readFileSync('site.mjs','utf8'),render=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(site,/const behaviourGuideIds=new Set\(BEHAVIOUR_IDS\)/);
 assert.match(site,/showBehaviourGuide=id=>renderTopicManual\(main,id,BEHAVIOUR_BY_ID.get\(id\),'behaviour'\)/);
 assert.match(site,/else if\(behaviourGuideIds.has\(key\)\)showBehaviourGuide\(key\)/);
 assert.match(render,/#navigate\/atlas\/behaviour/);
 assert.match(render,/domain==='behaviour'\?'Habits, impulses & compulsions'/);
});
test('prose avoids the most repeated formulaic AI tells',()=>{
 const text=BEHAVIOUR_GUIDES.flatMap(g=>g.article).join(' ');
 assert.doesNotMatch(text,/\b(?:delve|tapestry|multifaceted|pivotal|in conclusion|it is important to note)\b/i);
 assert.doesNotMatch(text,/\bnot just .{1,65} but also\b/i);
 const decorative=text.split(/(?<=[.!?])\s+/).filter(s=>/\b[a-z]+,\s+[a-z]+,\s+(?:and|or)\s+[a-z]+\b/i.test(s));
 assert.equal(decorative.length,0,'decorative tricolons: '+decorative.slice(0,3).join(' / '));
});
