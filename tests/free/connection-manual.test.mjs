import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {topicsInTheme} from '../../ns-needs-themes.mjs';
import {CONNECTION_IDS,CONNECTION_GUIDES,CONNECTION_BY_ID,CONNECTION_GROUPS} from '../../ns-connection-guide-data.mjs';

test('every actual Relationships and connection entry is covered, including the nine related experiences',()=>{
 const related=topicsInTheme(atlasProblemIndex,'connection');
 assert.equal(related.length,47);
 assert.equal(CONNECTION_IDS.length,47);
 assert.deepEqual(new Set(CONNECTION_IDS),new Set(related.map(x=>x.id)));
 assert.equal(CONNECTION_BY_ID.size,47);
 assert.equal(CONNECTION_GROUPS.relate.length,22);
 assert.equal(CONNECTION_GROUPS.social.length,16);
 assert.equal(CONNECTION_GROUPS.related.length,9);
 for(const [group,expectedDomain] of [['relate','relate'],['social','social']]){
  assert.ok(CONNECTION_GROUPS[group].every(id=>atlasProblemIndex.some(p=>p.id===id&&p.domain===expectedDomain)));
 }
 for(const id of CONNECTION_GROUPS.related)assert.ok(atlasProblemIndex.find(p=>p.id===id&&p.domain!=='relate'&&p.domain!=='social'),id);
});
test('all forty-seven guides have longform writing and unique beginnings',()=>{
 const intros=new Set();
 for(const g of CONNECTION_GUIDES){
  assert.equal(g.article.length,10,g.id);
  assert.ok(g.article.join(' ').trim().split(/\s+/).length>=400,g.id+' short manual');
  assert.ok(g.article.every(p=>p.trim().split(/\s+/).length>=26),g.id+' thin paragraph');
  assert.ok(!intros.has(g.article[0]),g.id+' recycled opening');intros.add(g.article[0]);
  assert.equal(g.mechanisms.length,3,g.id);assert.equal(g.profiles.length,4,g.id);
  assert.equal(g.cycle.length,4,g.id);assert.equal(g.now.steps.length,3,g.id);
  assert.ok(g.sources.length>0&&g.safety.length>70,g.id+' inadequate safety/references');
 }
});
test('188 individually written journals contain 752 unique questions',()=>{
 const questions=[];
 for(const g of CONNECTION_GUIDES){
  assert.equal(g.routes.length,4,g.id);
  for(const r of g.routes){
   assert.ok(r.description.length>55&&r.practice.length>38,g.id+'/'+r.id);
   assert.equal(r.questions.length,4,g.id+'/'+r.id);
   for(const q of r.questions){assert.ok(q[0].length>=19,g.id+'/'+r.id);questions.push(q[0]);}
  }
 }
 assert.equal(questions.length,752);
 assert.equal(new Set(questions).size,752,'duplicate journal question');
});
test('752 worked examples and 470 Why questions stay connected to the right topic',()=>{
 const scenes=[],questions=[];
 for(const g of CONNECTION_GUIDES){
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(g.roots.length,4,g.id);
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.ok(g.whyIntro.length>150,g.id+' thin Why');
  for(const ex of g.whyCases){
   scenes.push(ex.situation);assert.ok(g.roots.some(r=>r[0]===ex.root),g.id+' invalid root');
   for(const k of ['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action'])
    assert.ok(ex[k]?.length>=4,g.id+'/'+k);
  }
  questions.push(...g.whyQuestions);
 }
 assert.equal(scenes.length,752);assert.equal(new Set(scenes).size,752,'duplicate example situation');
 assert.equal(questions.length,470);assert.equal(new Set(questions).size,470,'duplicate Why question');
});
test('all guides include useful immediate steps, optional ideas and safety distinctions',()=>{
 for(const g of CONNECTION_GUIDES){
  assert.equal(g.ideas.actions.length,24,g.id);
  assert.equal(g.ideas.support.length,24,g.id);
 }
 assert.match(CONNECTION_BY_ID.get('control-harm').safety,/coerc|monitor|threat/i);
 assert.match(CONNECTION_BY_ID.get('aggressive-urges').safety,/urgent|harm|violence/i);
 assert.match(CONNECTION_BY_ID.get('relationship-submission').safety,/consensual|consent/i);
 assert.match(CONNECTION_BY_ID.get('social-anxiety-vs-exclusion').safety,/discrimin|hostile/i);
 assert.match(CONNECTION_BY_ID.get('social-connection-after-illness').safety,/post-exertional|health/i);
});
test('new manuals route before the generic fallback and return to the correct subsection',()=>{
 const site=readFileSync('site.mjs','utf8'),renderer=readFileSync('ns-mood-manual.mjs','utf8'),nav=readFileSync('ns-needs-console.mjs','utf8');
 assert.match(site,/connectionGuideIds\.has\(key\)\)showConnectionGuide\(key\)/);
 assert.match(site,/showConnectionGuide=id=>renderTopicManual/);
 assert.match(renderer,/#navigate\/area\/connection\/relate/);
 assert.match(renderer,/#navigate\/area\/connection\/social/);
 assert.match(renderer,/#navigate\/area\/connection\/related/);
 assert.match(nav,/requestedSubdomain/);
});
test('relationship article language avoids formulaic contrast slogans and decorative lists',()=>{
 const prose=CONNECTION_GUIDES.flatMap(g=>g.article).join(' ');
 for(const bad of [/\b(?:delve|multifaceted|tapestry|pivotal|in conclusion)\b/i,/\bnot just .{1,65} but also\b/i,/\bit's not .{1,70} it's\b/i])
  assert.doesNotMatch(prose,bad);
 const triads=prose.split(/(?<=[.!?])\s+/).filter(x=>/\b[a-z]+,\s+[a-z]+,\s+(?:and|or)\s+[a-z]+\b/i.test(x));
 assert.equal(triads.length,0,triads.slice(0,3).join(' / '));
});
