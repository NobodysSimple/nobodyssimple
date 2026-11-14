import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {MOOD_GUIDES} from '../../ns-mood-guide-data.mjs';
import {MOOD_IDS} from '../../ns-mood-manual.mjs';
import {atlasByDomain} from '../../ns-atlas-core.mjs';

const expected=[
 'anxiety','low-mood','anger','overwhelm','guilt-shame','self-criticism',
 'emotional-numbness','panic','anhedonia','irritability','hopelessness',
 'mood-shifts','sudden-distress','self-blame','shame-after-sex','panic-experiences'
];
test('all sixteen other feelings and mood topics have their own field guides',()=>{
 assert.deepEqual(new Set(MOOD_IDS),new Set(expected));
 assert.equal(MOOD_GUIDES.length,16);
 assert.equal(new Set(MOOD_GUIDES.map(x=>x.id)).size,16);
 const catalog=new Set(atlasByDomain('feel').map(t=>t.id));
 for(const id of expected)assert.ok(catalog.has(id),'missing catalogue topic '+id);
 assert.ok(catalog.has('social-anxiety'),'original flagship remains in catalogue');
 assert.ok(!MOOD_IDS.includes('social-anxiety'),'flagship not replaced');
});
test('guides have individually authored articles, journals, suggestion lists and depth examples',()=>{
 const texts=new Set();
 const questions=new Set();
 const depth=new Set();
 for(const g of MOOD_GUIDES){
  assert.ok(g.article.length>=7,g.id+' article too short');
  assert.ok(g.article.join(' ').split(/\s+/).length>300,g.id+' article lacks depth');
  assert.ok(!texts.has(g.article[0]),g.id+' reuses previous opening');
  texts.add(g.article[0]);
  assert.equal(g.routes.length,4,g.id+' needs four distinct interventions');
  for(const route of g.routes){
   assert.ok(route.questions.length>=4,g.id+' insufficient questions');
   assert.ok(route.practice.length>=40,g.id+' missing practice');
   for(const question of route.questions){
    assert.equal(question.length,4);
    assert.ok(question[0].length>=16,g.id+' vague question');
    assert.ok(question[2].length>=16,g.id+' lacking active teaching');
    if(question[3])assert.ok(g.ideas[question[3]]?.length>=22,g.id+' missing practical ideas '+question[3]);
   }
  }
  assert.equal(g.whyCases.length,16,g.id+' expected sixteen individually tailored excavations');
  assert.equal(g.whyQuestions.length,10,g.id+' no personalized formulation path');
  assert.ok(g.roots.length>=3);
  assert.ok(g.sources?.length>=1,g.id+' without sources');
  for(const p of g.whyCases){
   assert.ok(!depth.has(g.id+':'+p.situation),g.id+' duplicated depth case');
   depth.add(g.id+':'+p.situation);
   assert.ok(g.roots.some(r=>r[0]===p.root));
  }
  questions.add(g.routes[0].questions[0][0]);
 }
 assert.equal(MOOD_GUIDES.reduce((total,g)=>total+g.whyCases.length,0),256,'expected 256 distinct context-specific examples');
 assert.ok(questions.size>=14,'initial questions too generic across topics');
});
test('safety-sensitive topics have subject-specific boundaries',()=>{
 const byId=Object.fromEntries(MOOD_GUIDES.map(g=>[g.id,g]));
 assert.match(byId['panic-experiences'].safety,/medical|physical/i);
 assert.match(byId.panic.safety,/medical|chest/i);
 assert.match(byId['shame-after-sex'].safety,/consent|coercion/i);
 assert.match(byId.hopelessness.safety,/suicid|unsafe|emergency/i);
 assert.match(byId['mood-shifts'].safety,/sleep|bipolar|mood/i);
 assert.match(byId['emotional-numbness'].safety,/medical|neurological/i);
 assert.notEqual(byId.anhedonia.whyIntro,byId['low-mood'].whyIntro);
 assert.notEqual(byId.anger.whyIntro,byId.irritability.whyIntro);
});
test('SPA routes new mood topics and preserves existing flagship and other catalogue topics',()=>{
 const site=readFileSync('site.mjs','utf8');
 const html=readFileSync('index.html','utf8');
 const renderer=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(site,/if\(moodGuideIds\.has\(options\.topic\)\)return renderMoodManual\(main,options\.topic\)/);
 assert.match(site,/if\(selected\?\.type==='topic'&&moodGuideIds\.has\(selected\.target\)\)/);
 assert.match(site,/else if\(moodGuideIds\.has\(key\)\)renderMoodManual\(main,key\)/);
 assert.match(site,/if\(key==='social-anxiety'\)renderJudgementManual\(main\)/);
 assert.match(html,/ns-mood-manual\.css/);
 assert.match(renderer,/data-mood-why-browse/);
 assert.match(renderer,/data-mood-idea/);
 assert.match(renderer,/data-mood-save/);
 assert.match(renderer,/data-mood-why-answer/);
 assert.doesNotMatch(renderer,/<input type=["']radio/);
});
