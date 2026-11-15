import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FHS_GUIDES,FHS_BY_ID,FHS_GUIDE_GROUPS} from '../../ns-fhs-guide-data.mjs';
import {FHS_CONTEXT_FAMILY} from '../../ns-fhs-context-family.mjs';
import {FHS_CONTEXT_HARM} from '../../ns-fhs-context-harm.mjs';
import {FHS_CONTEXT_INEQUALITY} from '../../ns-fhs-context-inequality.mjs';
import {FHS_CONTEXT_ENVIRONMENT} from '../../ns-fhs-context-environment.mjs';

const groups={family:FHS_CONTEXT_FAMILY,harm:FHS_CONTEXT_HARM,inequality:FHS_CONTEXT_INEQUALITY,environment:FHS_CONTEXT_ENVIRONMENT};
test('all 74 real family, harm, money and systems IDs have their own long-form manual',()=>{
 assert.equal(FHS_GUIDES.length,74);
 assert.equal(FHS_BY_ID.size,74);
 assert.deepEqual(Object.fromEntries(Object.entries(FHS_GUIDE_GROUPS).map(([k,v])=>[k,v.length])),{family:22,harm:19,inequality:22,environment:11});
 for(const [domain,entries] of Object.entries(groups)){
  assert.deepEqual(new Set(FHS_GUIDE_GROUPS[domain]),new Set(Object.keys(entries)),domain+' source coverage');
  for(const id of FHS_GUIDE_GROUPS[domain]){
   const g=FHS_BY_ID.get(id);assert.ok(g,id);
   assert.equal(g.article.length,10,id);
   assert.ok(g.article.join(' ').split(/\s+/).length>=400,id+' thin article');
   assert.ok(g.sources[0][1].startsWith('https://'),id);
   assert.ok(g.safety.length>30,id);
  }
 }
});
test('296 bespoke situations and 74 different introductions ground the four journals in each guide',()=>{
 const intros=[],original=[],all=[];
 for(const g of FHS_GUIDES){
  assert.equal(g.routes.length,4,g.id);
  const domain=Object.keys(groups).find(key=>g.id in groups[key]);
  const ctx=groups[domain][g.id];intros.push(g.whyIntro);
  if(domain==='inequality'||domain==='environment')assert.ok(g.whyIntro.startsWith(ctx.intro+' '),g.id+' expanded intro');
  else assert.equal(g.whyIntro,ctx.intro,g.id);
  assert.ok(g.whyIntro.length>175,g.id);
  for(let i=0;i<4;i++){
   const scene=ctx.cases[i][0];
   original.push(scene);
   assert.ok(g.routes[i].description.includes(scene),g.id+' missing journal context');
   assert.ok(g.routes[i].questions[0][0].includes(scene),g.id+' missing individual prompt');
   assert.equal(g.routes[i].questions.length,4,g.id);
   assert.equal(g.whyCases[i*4].situation,scene,g.id+' missing distinct real-world example');
  }
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.equal(g.whyCases.length,16,g.id);
  for(const c of g.whyCases)all.push(c.situation);
 }
 assert.equal(original.length,296);
 assert.equal(new Set(original).size,296,'duplicate original situation');
 assert.equal(new Set(intros).size,74,'intro recycled');
 assert.equal(all.length,1184);
});
test('the detailed support menu has 24 concrete choices per subject',()=>{
 for(const g of FHS_GUIDES){
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.equal(g.ideas.support.length,24,g.id);
  assert.equal(new Set(g.ideas.actions).size,24,g.id);
  assert.equal(g.whyStages.length,10,g.id);
  assert.ok(g.now.steps.every(x=>x.length>30),g.id);
 }
});
test('abuse recovery and high-risk family guides do not store journal answers on the device',()=>{
 for(const id of FHS_GUIDE_GROUPS.harm)assert.equal(FHS_BY_ID.get(id).noPersist,true,id);
 for(const id of ['family-financial-dependence','controlling-parenting','co-parenting-conflict'])assert.equal(FHS_BY_ID.get(id).noPersist,true,id);
 const renderer=readFileSync('ns-mood-manual.mjs','utf8');
 assert.match(renderer,/const privateSession=domain==='harm'\|\|g.noPersist===true/);
 assert.match(renderer,/if\(privateSession\)return;/);
 assert.match(renderer,/Notes saved during an earlier visit may remain on this device/);
 assert.match(renderer,/does not save your responses/);
});
test('support for abuse, poverty and climate concerns prioritises reality and safety',()=>{
 assert.match(FHS_BY_ID.get('emotional-abuse').evidence,/confront anyone/);
 assert.match(FHS_BY_ID.get('sexual-assault-recovery').safety,/SARCs|forensic|disclosure/i);
 assert.match(FHS_BY_ID.get('food-insecurity').evidence,/material|financial|institutional/i);
 assert.match(FHS_BY_ID.get('climate-anxiety').evidence,/hazards|public|real/i);
 assert.match(FHS_BY_ID.get('homelessness-insecurity').ideas.support.join(' '),/emergency|housing|shelter/i);
});
