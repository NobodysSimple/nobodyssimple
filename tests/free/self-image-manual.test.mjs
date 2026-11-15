import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {topicsInTheme} from '../../ns-needs-themes.mjs';
import {IMAGE_GUIDES,IMAGE_GUIDE_GROUPS,IMAGE_BY_ID,IMAGE_IDS} from '../../ns-self-image-guide-data.mjs';

test('all 49 displayed Identity & self-image catalogue topics have a matching dedicated manual',()=>{
 const expected=topicsInTheme(atlasProblemIndex,'identity');
 assert.equal(expected.length,49);
 assert.equal(IMAGE_IDS.length,49);
 assert.equal(IMAGE_BY_ID.size,49);
 assert.deepEqual(new Set(IMAGE_IDS),new Set(expected.map(x=>x.id)));
 assert.deepEqual(Object.fromEntries(Object.entries(IMAGE_GUIDE_GROUPS).map(([k,v])=>[k,v.length])),{identity:13,lgbtq:24,appearance:12});
 for(const group of ['identity','lgbtq','appearance'])for(const id of IMAGE_GUIDE_GROUPS[group]){
  assert.equal(atlasProblemIndex.find(x=>x.id===id)?.domain,group,id+' in wrong subsection');
 }
});
test('every identity guide has a substantial original article, four concrete profiles and guidance sources',()=>{
 const intros=[];
 for(const g of IMAGE_GUIDES){
  assert.equal(g.article.length,10,g.id);
  const words=g.article.join(' ').trim().split(/\s+/).length;
  assert.ok(words>=370,g.id+' article only '+words+' words');
  assert.equal(g.profiles.length,4,g.id);
  assert.equal(g.mechanisms.length,3,g.id);
  assert.ok(g.safety.length>50,g.id);
  assert.ok(g.sources[0][1].startsWith('https://'),g.id);
  assert.ok(g.whyIntro.length>110,g.id);
  intros.push(g.whyIntro);
 }
 assert.equal(new Set(intros).size,49);
});
test('all 196 journal routes use a specific real-life situation and four usable questions',()=>{
 let prompts=0;
 for(const g of IMAGE_GUIDES){
  assert.equal(g.routes.length,4,g.id);
  for(const [i,r] of g.routes.entries()){
   assert.equal(r.questions.length,4,g.id+' '+r.id);
   assert.ok(r.description.length>50,g.id);
   assert.ok(r.questions[0][0].includes(g.whyCases[i*4].situation),g.id);
   assert.ok(r.questions.every(q=>q[0].length>55),g.id);
   assert.ok(r.practice.length>25,g.id);
   prompts+=r.questions.length;
  }
 }
 assert.equal(prompts,784);
});
test('all 784 worked formulations and 490 in-depth questions have topic-specific anchors',()=>{
 const scenes=[];
 for(const g of IMAGE_GUIDES){
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.equal(g.roots.length,4,g.id);
  for(const c of g.whyCases){
   scenes.push(c.situation);
   assert.ok(c.situation.length>=26,g.id);
   assert.ok(g.roots.some(r=>r[0]===c.root),g.id+' root mismatch');
   for(const k of ['interpretation','response','function','need','rule','adaptation','alternative','action'])
    assert.ok(c[k]?.length>=10,g.id+' '+k);
  }
 }
 assert.equal(scenes.length,784);
 assert.equal(new Set(scenes).size,784);
});
test('support choices, body-related referrals and affirming safeguards stay available',()=>{
 for(const g of IMAGE_GUIDES){
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.equal(g.ideas.support.length,24,g.id);
  assert.ok(g.ideas.actions.every(x=>x.length>28),g.id);
 }
 assert.match(IMAGE_BY_ID.get('body-dysmorphic-concerns').safety,/CBT|ERP|BDD/);
 assert.match(IMAGE_BY_ID.get('body-dysmorphic-concerns').sources[0][1],/nhs.uk/);
 assert.match(IMAGE_BY_ID.get('gender-dysphoria').safety,/clinical|medical/i);
 assert.match(IMAGE_BY_ID.get('intersex-stigma').safety,/consent/i);
 assert.match(IMAGE_BY_ID.get('eating-weight-stigma').safety,/restrictive|eating/i);
 assert.match(IMAGE_BY_ID.get('identity-privacy-safety').safety,/monitor|privacy/i);
});
test('all LGBTQIA+ guides and other sensitive guides disable saving answers to the device',()=>{
 for(const id of IMAGE_GUIDE_GROUPS.lgbtq)assert.equal(IMAGE_BY_ID.get(id).noPersist,true,id);
 for(const id of ['body-dysmorphic-concerns','eating-weight-stigma','masking','self-concealment'])assert.equal(IMAGE_BY_ID.get(id).noPersist,true,id);
});
test('site routing takes the original manuals before generic fallbacks and offers correct subsection returns',()=>{
 const site=readFileSync('site.mjs','utf8'),render=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(site,/selfImageGuideIds\.has\(key\)\)showSelfImageGuide\(key\)/);
 assert.match(site,/selfImageGuideIds\.has\(options\.topic\)/);
 assert.match(site,/showSelfImageGuide=id=>renderTopicManual/);
 for(const sub of ['identity','lgbtq','appearance'])assert.ok(render.includes('#navigate/area/identity/'+sub));
});
test('article writing avoids obvious non-substantive AI wording',()=>{
 const text=IMAGE_GUIDES.flatMap(g=>g.article).join(' ');
 for(const phrase of [/[\b]delve[\b]/i,/\bin conclusion\b/i,/\bnot just .{1,50} but also\b/i,/\bit's not .{1,60} it's\b/i])
  assert.doesNotMatch(text,phrase);
});
