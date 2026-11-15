import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {topicsInTheme} from '../../ns-needs-themes.mjs';
import {CFM_IDS,CFM_BY_ID,CFM_GUIDES_FULL,CFM_GROUPS} from '../../ns-cfm-manual-data.mjs';
import {practicalPopupIdeas} from '../../ns-manual-popup-advice.mjs';

test('every topic in the actual Culture, Faith and Migration catalogue has the same dedicated manual format',()=>{
 const topics=topicsInTheme(atlasProblemIndex,'culture');
 assert.equal(topics.length,45);
 assert.equal(CFM_IDS.length,45);
 assert.deepEqual(new Set(CFM_IDS),new Set(topics.map(x=>x.id)));
 assert.equal(CFM_BY_ID.size,45);
 assert.equal(CFM_GROUPS.culture.length,19);
 assert.equal(CFM_GROUPS.faith.length,13);
 assert.equal(CFM_GROUPS.migration.length,13);
});
test('all 45 long-form articles are individually written, complete and evidence-aware',()=>{
 const openings=new Set();
 for(const g of CFM_GUIDES_FULL){
  assert.equal(g.article.length,10,g.id);
  assert.ok(g.article.join(' ').split(/\s+/).length>=400,g.id+' short article');
  assert.ok(g.article.filter(p=>p.split(/\s+/).filter(Boolean).length>=25).length>=7,g.id+' insufficient substantial paragraphs');
  assert.ok(!openings.has(g.article[0]),g.id+' recycled opening');
  openings.add(g.article[0]);
  assert.equal(g.profiles.length,4,g.id);
  assert.equal(g.mechanisms.length,3,g.id);
  assert.equal(g.cycle.length,4,g.id);
  assert.equal(g.now.steps.length,3,g.id);
  assert.ok(g.safety.length>=70,g.id+' missing safety guidance');
  assert.ok(g.sources.length>=1,g.id+' missing sources');
 });
});
test('45 topics offer 180 distinct four-question free-writing journals and optional suggestions',()=>{
 const prompts=[];
 for(const g of CFM_GUIDES_FULL){
  assert.equal(g.routes.length,4,g.id);
  for(const route of g.routes){
   assert.equal(route.questions.length,4,g.id+' journal too short');
   assert.ok(route.label.length>=5,g.id+' missing journal title');
   assert.ok(route.description.length>=38,g.id+' missing individual relevance');
   assert.ok(route.practice.length>=35,g.id+' missing practical task');
   for(const q of route.questions){assert.equal(q.length,4);assert.ok(q[0].length>=18,g.id);prompts.push(g.id+'/'+route.id+'/'+q[0]);}
  }
  assert.equal(g.ideas.actions.length,20,g.id);
  assert.equal(g.ideas.support.length,20,g.id);
  assert.ok(g.ideas.actions.every(x=>x.length>=35),g.id+' thin suggestion');
 }
 assert.equal(prompts.length,720);
 assert.equal(new Set(prompts).size,720,'repeated route questions within one topic');
});
test('all practical and support popups contain direct unique guidance with no generic lead-ins',()=>{
 const banned=/^(Ask a trusted person about the practical concern|Request support for this possible step|Talk this through with someone who listens|Consider whether this is relevant|Use this worked example to ask|You might discuss this part|A relevant service or ally may be able to help with|Explore what would need to change before attempting this|Write a few words about this question)/i;
 let total=0;
 for(const g of CFM_GUIDES_FULL){
  for(const kind of ['actions','support']){
   const ideas=g.ideas[kind];
   assert.equal(ideas.length,20,g.id+' '+kind);
   assert.equal(new Set(ideas).size,12,g.id+' '+kind+' repeated suggestions');
   assert.ok(ideas.every(x=>x.length>=38),g.id+' '+kind+' too vague');
   assert.ok(ideas.every(x=>!banned.test(x)),g.id+' '+kind+' has generic template');
   total+=ideas.length;
  }
 }
 assert.equal(total,1800);
});
test('all Culture Faith Migration popups render the entire twenty-item list while other catalogues retain their limits',()=>{
 for(const guide of CFM_GUIDES_FULL){
  for(const kind of ['actions','support']){
   const shown=practicalPopupIdeas(guide,kind);
   assert.equal(shown.length,20,guide.id+' '+kind+' was truncated or filtered');
   assert.equal(new Set(shown).size,20,guide.id+' '+kind+' duplicated a suggestion');
   assert.ok(shown.every(text=>!/^((Ask a trusted person about|Request support for this possible step|Talk this through with someone|Consider whether this is relevant|Use this worked example))/i.test(text)),guide.id+' contains instructional padding');
  }
 }
 assert.equal(practicalPopupIdeas({domain:'feel',ideas:{actions:Array.from({length:25},(_,i)=>'Take a useful next step '+i+'.')}},'actions').length,12);
});
test('each page exposes a search-enabled Understand Why map with contextual examples',()=>{
 let scenes=0;
 for(const g of CFM_GUIDES_FULL){
  assert.equal(g.whyQuestions.length,10,g.id);
  assert.equal(g.whyCases.length,16,g.id);
  assert.equal(g.roots.length,4,g.id);
  assert.equal(g.whyStages.length,10,g.id);
  assert.ok(g.whyIntro.length>170,g.id);
  assert.equal(new Set(g.whyCases.map(x=>x.situation)).size,16,g.id);
  for(const c of g.whyCases){
   for(const k of ['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action','root'])
    assert.ok(c[k]?.length>=4,g.id+' missing '+k);
   assert.ok(g.roots.some(x=>x[0]===c.root),g.id+' invalid case grouping');
   scenes++;
  }
 }
 assert.equal(scenes,720);
});
test('Culture Faith Migration browsers use concise concrete situations, not article excerpts',()=>{
 const seen=new Set();
 for(const g of CFM_GUIDES_FULL){
  assert.equal(g.hideCycle,true,g.id+' must omit the unrequested Conditions box');
  assert.equal(g.whyCases.length,16,g.id);
  for(const item of g.whyCases){
   const scene=item.situation;
   assert.ok(scene.length>=22&&scene.length<=110,g.id+' browse card too long: '+scene);
   assert.ok(!scene.includes('. '),g.id+' browse card looks like an article excerpt: '+scene);
   assert.ok(!seen.has(scene),g.id+' duplicate situation: '+scene);
   seen.add(scene);
  }
 }
 assert.equal(seen.size,720);
});
test('safety-first considerations preserve practical rights and autonomy',()=>{
 for(const id of ['asylum-stress','migrant-work-exploitation','racial-profiling','religious-trauma','faith-community-pressure','religious-family-conflict']){
  const g=CFM_BY_ID.get(id);
  assert.ok(g.noPersist,id+' should not persist sensitive notes');
  assert.ok(g.prominentSafety.length>70,id+' missing visible safety note');
 }
 assert.match(CFM_BY_ID.get('fear-divine-punishment').safety,/OCD|scrupulosity/i);
 assert.match(CFM_BY_ID.get('asylum-stress').safety,/legal|testimony|case/i);
 assert.match(CFM_BY_ID.get('racial-discrimination').safety,/threat|discrimination/i);
 assert.match(CFM_BY_ID.get('immigration-uncertainty').safety,/qualified|legal|status/i);
});
test('all three catalogue groups use the established manual renderer and correct navigation',()=>{
 const site=readFileSync(new URL('../../site.mjs',import.meta.url),'utf8');
 const renderer=readFileSync(new URL('../../ns-mood-manual.mjs',import.meta.url),'utf8');
 const fallback=readFileSync(new URL('../../ns-topic-reading-ui.mjs',import.meta.url),'utf8');
 assert.match(site,/cfmGuideIds\.has\(key\)\)showCfmGuide\(key\)/);
 assert.match(site,/cfmGuideIds\.has\(options\.topic\)\)return showCfmGuide\(options\.topic\)/);
 assert.match(site,/showCfmGuide=id=>renderTopicManual/);
 for(const area of ['culture','faith','migration'])
  assert.ok(renderer.includes('#navigate/area/culture/'+area),area+' wrong return route');
 assert.match(renderer,/data-mood-why-browse/);
 assert.match(renderer,/data-mood-idea/);
 assert.match(renderer,/data-mood-save/);
 assert.match(renderer,/data-mood-why-answer/);
 assert.match(renderer,/g.contextSequence/);
 assert.doesNotMatch(fallback,/ns-cfm-guide-ui|renderCfmStart|renderCfmEnd/,'old parallel UI should be gone');
});
