import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {IMAGE_GUIDES,IMAGE_IDS,IMAGE_GUIDE_GROUPS,IMAGE_BY_ID} from '../../ns-self-image-guide-data.mjs';
import {SELF_IMAGE_DEPTH_IDENTITY} from '../../ns-self-image-depth-identity.mjs';
import {SELF_IMAGE_DEPTH_LGBTQ_A} from '../../ns-self-image-depth-lgbtq-a.mjs';
import {SELF_IMAGE_DEPTH_LGBTQ_B} from '../../ns-self-image-depth-lgbtq-b.mjs';
import {SELF_IMAGE_DEPTH_APPEARANCE} from '../../ns-self-image-depth-appearance.mjs';
const depth={...SELF_IMAGE_DEPTH_IDENTITY,...SELF_IMAGE_DEPTH_LGBTQ_A,...SELF_IMAGE_DEPTH_LGBTQ_B,...SELF_IMAGE_DEPTH_APPEARANCE};
test('all 49 exact identity catalogue topics have their own in-depth guide',()=>{
 assert.equal(IMAGE_GUIDES.length,49);assert.equal(IMAGE_BY_ID.size,49);
 assert.equal(IMAGE_IDS.length,49);
 assert.deepEqual(Object.fromEntries(Object.entries(IMAGE_GUIDE_GROUPS).map(([k,v])=>[k,v.length])),{identity:13,lgbtq:24,appearance:12});
 assert.deepEqual(new Set(IMAGE_IDS),new Set(Object.keys(depth)));
 for(const g of IMAGE_GUIDES){assert.equal(g.article.length,10,g.id);assert.ok(g.article.join(' ').split(/\s+/).length>=370,g.id);assert.ok(g.sources[0][1].startsWith('https://'),g.id);}
});
test('individual introductions and 196 new situations are present in journals and Understand Why',()=>{
 const opening=[],scenes=[];
 for(const g of IMAGE_GUIDES){
  const d=depth[g.id];
  assert.equal(g.whyIntro,d[0],g.id);opening.push(g.whyIntro);
  assert.equal(g.routes.length,4,g.id);assert.equal(g.whyCases.length,16,g.id);
  assert.equal(g.whyQuestions.length,10,g.id);
  for(let i=0;i<4;i++){
   assert.equal(g.routes[i].questions[0][0],d[1][i],g.id);
   assert.ok(g.routes[i].description.includes(d[2][i][0]),g.id);
   assert.equal(g.whyCases[i*4+1].situation,d[2][i][0],g.id);
   assert.equal(g.whyCases[i*4+1].interpretation,d[2][i][1],g.id);
   scenes.push(d[2][i][0]);
  }
  assert.equal(new Set(g.whyCases.map(c=>c.situation)).size,16,g.id);
 }
 assert.equal(new Set(opening).size,49);
 assert.equal(scenes.length,196);
 assert.equal(new Set(scenes).size,196,'new situations must be authored distinctly');
});
test('safety and privacy remain central for queer identity and clinically sensitive appearances',()=>{
 for(const id of IMAGE_GUIDE_GROUPS.lgbtq)assert.equal(IMAGE_BY_ID.get(id).noPersist,true,id);
 for(const id of ['masking','self-concealment','body-dysmorphic-concerns','eating-weight-stigma'])assert.equal(IMAGE_BY_ID.get(id).noPersist,true,id);
 for(const id of ['coming-out-rejection','transphobia','trans-healthcare-barriers','body-dysmorphic-concerns'])assert.ok(IMAGE_BY_ID.get(id).prominentSafety?.length>30,id);
 assert.match(IMAGE_BY_ID.get('transphobia').evidence,/discrimination/i);
 assert.match(IMAGE_BY_ID.get('weight-stigma').evidence,/stigma|appearance/i);
});
test('support options and actual actions remain substantial and independent',()=>{
 for(const g of IMAGE_GUIDES){
  assert.equal(g.ideas.actions.length,24,g.id);assert.equal(g.ideas.support.length,24,g.id);
  assert.equal(new Set(g.ideas.support).size,24,g.id);
  assert.ok(g.routes.every(r=>r.questions.length===4),g.id);
  assert.ok(g.now.steps.length===3,g.id);
 }
 const site=readFileSync('site.mjs','utf8');
 assert.match(site,/showSelfImageGuide/);assert.match(site,/selfImageGuideIds/);
});
test('avoid stock AI rhetorical contrasts in newly authored guide introductions',()=>{
 const intros=Object.values(depth).map(v=>v[0]).join(' ');
 assert.doesNotMatch(intros,/\b(?:delve|tapestry|multifaceted|pivotal|in conclusion)\b/i);
 assert.doesNotMatch(intros,/\bnot just .{1,80} but also\b/i);
});
