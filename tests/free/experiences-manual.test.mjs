import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EXPERIENCE_GUIDES,EXPERIENCE_IDS,EXPERIENCE_GUIDES_BY_ID} from '../../ns-experiences-guide-data.mjs';
import {atlasByDomain} from '../../ns-atlas-core.mjs';
const expected=['trauma','voices','suspicion','mania','dissociation','substances',
'derealisation','depersonalisation','flashbacks','hypervigilance','elevated-mood',
'grandiose-beliefs','substance-craving','alcohol-harm','drug-harm','withdrawal-worries'];
test('all 16 experiences get their own manual with valid IDs and catalogue routes',()=>{
 assert.deepEqual(new Set(EXPERIENCE_IDS),new Set(expected));
 assert.equal(new Set(EXPERIENCE_IDS).size,16);
 const catalogue=new Set(atlasByDomain('experiences').map(x=>x.id));
 for(const id of expected)assert.ok(catalogue.has(id),'missing from catalogue '+id);
 for(const g of EXPERIENCE_GUIDES)assert.equal(EXPERIENCE_GUIDES_BY_ID.get(g.id),g);
});
test('each experience has original, clinically tailored writing and four distinct guided practices',()=>{
 const openers=new Set(),firstQuestions=new Set(),practiceText=new Set(),ideaSets=new Set();
 for(const g of EXPERIENCE_GUIDES){
  assert.equal(g.article.length,8,g.id+' missing article paragraphs');
  assert.ok(g.article.join(' ').split(/\s+/).length>=340,g.id+' article too short');
  assert.ok(!openers.has(g.article[0]),g.id+' identical opening');
  openers.add(g.article[0]);
  assert.ok(g.mechanisms.length>=3&&g.profiles.length>=3);
  assert.equal(g.routes.length,4);
  assert.equal(new Set(g.routes.map(r=>r.id)).size,4);
  for(const r of g.routes){
   assert.ok(r.practice.length>50,g.id+' missing meaningful closing practice');
   assert.ok(!practiceText.has(r.practice),g.id+' reused closing practice');
   practiceText.add(r.practice);
   assert.ok(r.questions.length>=4,g.id+'/'+r.id+' insufficient questions');
   for(const q of r.questions){
    assert.equal(q.length,4);
    assert.ok(q.slice(0,3).every(x=>x.length>=17),g.id+'/'+r.id+' unclear question');
    if(q[3])assert.ok(g.ideas[q[3]]?.length>=22);
   }
  }
  firstQuestions.add(g.routes[0].questions[0][0]);
  assert.ok(Object.keys(g.ideas).length>=2,g.id+' lacks practical lists');
  for(const key of Object.keys(g.ideas))ideaSets.add(g.id+':'+key);
  assert.equal(g.whyCases.length,16,g.id+' missing 16 distinct why examples');
  assert.equal(new Set(g.whyCases.map(x=>x.situation)).size,16);
  assert.equal(g.whyQuestions.length,10);
  assert.ok(g.roots.length>=3);
  assert.ok(g.sources.length>=1);
  assert.ok(g.prominentSafety.length>=70,g.id+' missing visible safety information');
 }
 assert.equal(firstQuestions.size,16,'topic entries should be different');
 assert.equal(ideaSets.size,32);
});
test('all 256 depth maps use relevant local contexts and avoid unsupported hidden causes',()=>{
 const situations=new Set(),samples=EXPERIENCE_GUIDES.flatMap(g=>g.whyCases.map(v=>({...v,topic:g.id})));
 assert.equal(samples.length,256);
 for(const entry of samples){
  assert.ok(entry.situation.length>=18,entry.topic+' missing concrete situation');
  for(const field of ['interpretation','emotion','response','function','need','rule','adaptation','alternative','action'])
   assert.ok(entry[field]?.length>=7,entry.topic+' poor '+field);
  assert.ok(!situations.has(entry.topic+':'+entry.situation));
  situations.add(entry.topic+':'+entry.situation);
  const g=EXPERIENCE_GUIDES_BY_ID.get(entry.topic);
  assert.ok(g.roots.some(r=>r[0]===entry.root));
 }
});
test('high-risk pages put medical and safety care before unassisted exposure',()=>{
 const g=id=>EXPERIENCE_GUIDES_BY_ID.get(id);
 for(const id of ['mania','elevated-mood','grandiose-beliefs']){
  assert.match(g(id).prominentSafety,/urgent|specialist|risks|high-risk/i);
  assert.match(g(id).safety,/risk|medication|assessment|exposure/i);
 }
 for(const id of ['substances','alcohol-harm','drug-harm','withdrawal-worries','substance-craving'])
  assert.match(g(id).prominentSafety,/withdrawal|overdose|dependen/i);
 for(const id of ['trauma','flashbacks'])
  assert.match(g(id).safety,/trauma|exposure|reliving/i);
 assert.match(g('voices').prominentSafety,/command|harm/i);
 assert.match(g('suspicion').safety,/confrontation|surveillance/i);
});
test('all public routes use the shared design while leaving the flagship alone',()=>{
 const site=readFileSync('site.mjs','utf8');
 const ui=readFileSync('ns-mood-manual.mjs','utf8');
 const html=readFileSync('index.html','utf8');
 assert.match(site,/experienceGuideIds\.has\(options\.topic\)/);
 assert.match(site,/experienceGuideIds\.has\(key\)/);
 assert.match(site,/showExperienceGuide\(selected\.target\)/);
 assert.match(ui,/export function renderTopicManual/);
 assert.match(ui,/g\.prominentSafety/);
 assert.match(html,/ns-mood-manual\.css/);
 assert.match(site,/if\(options\.topic==='social-anxiety'\)/);
});
