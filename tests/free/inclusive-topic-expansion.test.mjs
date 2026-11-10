import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {inclusiveDomains,inclusiveProblemIndex,inclusiveIds} from '../../ns-inclusive-topics.mjs';
import {atlasProblemIndex,atlasDomains,atlasGet,atlasProfile,isSafetyPriority} from '../../ns-atlas-core.mjs';
import {getSubjectMatchesForTest,topicsForNeedsMode,renderNeedsConsole} from '../../ns-needs-console.mjs';
import {workbookForTopic} from '../../ns-integrated-workbook-data.mjs';

const important=[
 ['culture','racial-discrimination','colourism','microaggressions','institutional-racism'],
 ['lgbtq','gender-identity-exploration','transphobia','misgendering','ace-aro-invalidation'],
 ['neuro','autism-understanding','adhd-understanding','dyspraxia-dcd','neurodivergent-burnout'],
 ['disability','ableism','medical-gaslighting','invisible-disability','mobility-barriers'],
 ['family','parentification','emotional-neglect','family-estrangement','controlling-parenting'],
 ['harm','gaslighting','stalking','financial-abuse','sexual-coercion'],
 ['sexuality','pregnancy-loss','fertility-uncertainty','menopause-transition','desire-mismatch'],
 ['inequality','class-discrimination','food-insecurity','benefits-stress','poverty-shame'],
 ['migration','xenophobia','asylum-stress','culture-shock','migration-family-separation'],
 ['faith','religious-trauma','losing-faith','religious-discrimination','existential-anxiety'],
 ['digital','cyberbullying','online-misinformation','problematic-gaming','nonconsensual-digital-sharing'],
 ['education','workplace-discrimination','academic-imposter-feelings','inaccessible-education','workplace-moral-injury'],
 ['lifespan','retirement-adjustment','ageism','older-adult-loneliness','new-parent-identity'],
 ['social','friendship-breakdown','social-exclusion','long-distance-relationship','non-monogamy-agreements'],
 ['trauma','ambiguous-loss','pet-bereavement','betrayal-trauma','complex-trauma-history'],
 ['behaviour','gambling-harms','compulsive-sexual-behaviour','compulsive-exercise','compulsive-reassurance'],
 ['clinical','bipolar-experiences','ocd-contamination','psychosis-recovery','access-mental-health-care'],
 ['environment','climate-anxiety','eco-grief','community-violence','institutional-trust-loss'],
 ['growth','building-belonging','creative-expression','developing-autonomy','healthy-identity-exploration'],
 ['appearance','weight-stigma','appearance-bullying','hair-loss-distress','body-dysmorphic-concerns'],
];

test('every previously identified missing topic family is now represented as reachable named atlas entries',()=>{
 assert.equal(inclusiveDomains.length,20);
 assert.equal(inclusiveProblemIndex.length,352);
 assert.equal(atlasProblemIndex.length,518);
 assert.equal(inclusiveIds.size,352);
 assert.equal(new Set(atlasProblemIndex.map(p=>p.id)).size,518,'no collision with legacy atlas IDs');
 assert.equal(atlasDomains.length,31);
 for(const [domain,...ids] of important){
  assert.ok(inclusiveDomains.some(d=>d.id===domain),domain);
  assert.ok(inclusiveProblemIndex.filter(p=>p.domain===domain).length>=11,domain);
  for(const id of ids){
   const p=atlasGet(id);assert.ok(p,id);
   assert.equal(p.domain,domain,id);
   assert.equal(p.contextFirst,true,id);
   assert.ok(p.hint.length>=30,id);
  }
 }
});

test('search accepts identity and social terms without silently treating these as diagnoses',()=>{
 for(const [word,id] of [
  ['racism','racial-discrimination'],['microaggressions','microaggressions'],
  ['LGBTQIA+','gender-identity-exploration'],['transgender','gender-dysphoria'],
  ['ADHD','adhd-understanding'],['autism','autism-understanding'],
  ['Dyslexia','dyslexia-experiences'],['dyspraxia','dyspraxia-dcd'],
  ['ableism','ableism'],['infertility','infertility-grief'],['religious','religious-trauma'],
  ['migration','migration-grief'],['cyberbullying','cyberbullying'],
  ['climate','climate-anxiety'],['ageism','ageism']
 ]){
  assert.ok(getSubjectMatchesForTest(word,'').some(p=>p.id===id),word+' missing '+id);
 }
 assert.ok(getSubjectMatchesForTest('gender identity','lgbtq').some(p=>p.id==='gender-identity-exploration'));
 assert.ok(!getSubjectMatchesForTest('gender identity','culture').some(p=>p.id==='gender-identity-exploration'));
});

test('every added topic has a working integrated guide with context, autonomy, access and honest editorial limitations',()=>{
 for(const entry of inclusiveProblemIndex){
  const p=atlasProfile(entry.id);
  const w=workbookForTopic(entry.id);
  assert.ok(p&&w,entry.id);
  assert.equal(w.id,'topic/'+entry.id);
  assert.ok(w.what.includes(entry.hint),entry.id);
  assert.ok(w.contextFirst,entry.id);
  assert.equal(w.lanes.length,5,entry.id);
  assert.ok(w.lanes.every(l=>l.methods.length>0),entry.id);
  assert.ok(w.review.includes('not been individually'),entry.id);
  assert.equal(w.safetyFirst,isSafetyPriority(entry.id),entry.id);
  assert.equal(w.sources.length,0,'do not misrepresent generic references as topic-specific evidence: '+entry.id);
  assert.ok(w.cycle.includes('material conditions'),entry.id);
 }
});

test('identity and consenting preferences are never marked as pathological or made mandatory to change',()=>{
 for(const id of ['racial-identity','gender-identity-exploration','gender-euphoria','ace-aro-invalidation','autism-understanding','neurodivergent-strengths','religious-belonging','relationship-sexual-agreements','non-monogamy-agreements','healthy-identity-exploration']){
  const profile=atlasProfile(id),guide=workbookForTopic(id);
  assert.equal(guide.safetyFirst,false,id);
  assert.match(profile.definition,/does not imply.*disorder/i,id);
  assert.ok(guide.goals.some(x=>/choice|nothing|without|change|label/i.test(x)),id);
 }
});

test('current coercion and stalking route to support first, while ordinary exploration does not trigger crisis flags',()=>{
 for(const id of ['stalking','online-stalking','sexual-coercion','reproductive-coercion','grooming-exploitation','image-based-abuse','coercive-control-pattern','unsafe-after-separation']){
  assert.equal(isSafetyPriority(id),true,id);
  assert.equal(workbookForTopic(id).safetyFirst,true,id);
 }
 for(const id of ['sexual-orientation-exploration','gender-identity-exploration','religious-identity-conflict','neurodivergent-masking','ageism']){
  assert.equal(isSafetyPriority(id),false,id);
 }
 assert.equal(atlasGet('pregnancy-loss').medical,true);
 assert.equal(atlasGet('menopause-transition').medical,true);
});

test('all 518 topic guides are reachable through the same uninterrupted cards, without a second atlas finder',()=>{
 const featured=new Set(['insomnia','rumination','social-anxiety','panic-experiences','checking','submissive-patterns']);
 const topics=topicsForNeedsMode('learn');
 assert.equal(topics.length+featured.size,518);
 for(const p of inclusiveProblemIndex){
  assert.ok(topics.some(t=>t.id===p.id),'missing card '+p.id);
 }
 const ui=readFileSync('ns-needs-console.mjs','utf8');
 const workbook=readFileSync('ns-integrated-workbook.mjs','utf8');
 assert.match(ui,/topics\.map\(topicChoiceCard\)/);
 assert.match(ui,/data-needs-choice-filter/);
 assert.doesNotMatch(ui,/function atlasScreen|data-needs-domain-select|data-needs-more|navigate\/atlas\/area/);
 assert.doesNotMatch(workbook,/data-wb-topic-results|function atlasChooser/);
});
