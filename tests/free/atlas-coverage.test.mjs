import test from 'node:test';
import assert from 'node:assert/strict';
import {atlasCount,atlasProblemIndex,atlasProfile,atlasSearch,atlasByDomain,isSafetyPriority} from '../../ns-atlas-core.mjs';
import {extendedVariants} from '../../ns-atlas-extended-variations.mjs';
import {explicitVariants} from '../../ns-atlas-variations.mjs';
import {worksheetFor,worksheetKinds} from '../../ns-atlas-worksheets.mjs';
import {renderAtlasGuide} from '../../ns-atlas-guide.mjs';
import {renderAtlasTool} from '../../ns-atlas-tool.mjs';
import {renderAtlasConsole} from '../../ns-atlas-console.mjs';
import {clearAtlasSession} from '../../ns-atlas-session.mjs';
const el=()=>({innerHTML:'',textContent:'',addEventListener:()=>{},querySelectorAll:()=>[],querySelector:()=>el()});
function root(){
 const map=new Map();
 return {innerHTML:'',nodes:map,querySelectorAll:()=>[],querySelector:(selector)=>{
  if(!map.has(selector))map.set(selector,el());
  return map.get(selector);
 }};
}
test('the atlas contains unique named difficulties with all 166 map routes',()=>{
 assert.equal(atlasCount,166);
 assert.equal(new Set(atlasProblemIndex.map(p=>p.id)).size,atlasCount);
 assert.equal(Object.keys(explicitVariants).length,69);
 assert.equal(Object.keys(extendedVariants).length,92);
 for(const p of atlasProblemIndex){
  const profile=atlasProfile(p.id);
  assert.ok(profile,p.id);
  assert.ok(profile.variants.length>=4,p.id);
  assert.ok(profile.maintainers.length>=4,p.id);
  assert.ok(profile.contributors.length>=5,p.id);
  assert.ok(Object.values(profile.signs).flat().length>=8,p.id);
  assert.equal(profile.cycle.length,4,p.id);
  assert.ok(profile.targets.length>=4,p.id);
 }
});
test('every mapped problem has a working ten-section guide and specific interactive exercise',()=>{
 clearAtlasSession();
 for(const p of atlasProblemIndex){
  const g=root();renderAtlasGuide(g,p.id);
  for(let n=1;n<=10;n++){
   assert.ok(g.innerHTML.includes('class="ns-atlas-section-no">'+String(n).padStart(2,'0')),p.id+' section '+n);
  }
  assert.match(g.nodes.get('[data-atlas-map]').innerHTML,/POSSIBLE MAINTAINERS/);
  assert.ok(g.nodes.get('[data-atlas-summary]').textContent.length>30,p.id);
  const t=root();renderAtlasTool(t,p.id);
  assert.ok(t.innerHTML.includes('data-atlas-tool-exercise'),p.id);
  assert.ok(t.nodes.get('[data-atlas-tool-exercise]').innerHTML.includes('data-tool-answer'),p.id);
 }
});
test('exact searches favour precise descriptions and all areas remain browseable',()=>{
 assert.equal(atlasSearch('insomnia',1)[0].id,'insomnia');
 assert.equal(atlasSearch('rumination',1)[0].id,'rumination');
 assert.equal(atlasSearch('food restriction',1)[0].id,'food-restriction');
 assert.ok(atlasByDomain('body').length>=20);
 const home=root();renderAtlasConsole(home);
 assert.match(home.innerHTML,/Find something to try/);
 assert.match(home.innerHTML,/Understand & learn/);
 assert.match(home.innerHTML,/data-atlas-domain="body"/);
});
test('worksheet recommendations genuinely change with the selected process and situation',()=>{
 const sleep=worksheetFor('insomnia',{maintainer:'sleep-pressure',variant:'v0'});
 const environment=worksheetFor('insomnia',{maintainer:'environment',variant:'v2'});
 assert.equal(sleep.kind,'sleep');
 assert.equal(environment.kind,'systems');
 assert.notEqual(sleep.title,environment.title);
 assert.notEqual(sleep.situation,environment.situation);
 assert.equal(worksheetFor('checking',{maintainer:'reassurance'}).kind,'checking');
 assert.equal(worksheetFor('rumination',{maintainer:'abstract'}).kind,'rumination');
 assert.equal(worksheetFor('housing',{maintainer:'demands'}).kind,'systems');
 assert.equal(worksheetKinds.length,13);
});
test('urgent issues lead to safety-oriented resources instead of unsupervised exposure',()=>{
 for(const id of ['self-harm','suicidal-thoughts','immediate-danger','unsafe-home','food-restriction','withdrawal-worries']){
  assert.equal(isSafetyPriority(id),true,id);
  assert.equal(worksheetFor(id,{maintainer:'danger'}).kind,'safety',id);
  const g=root();renderAtlasGuide(g,id);
  assert.match(g.innerHTML,/Safety and appropriate support first/);
  assert.match(g.nodes.get('[data-atlas-targets]').innerHTML,/Immediate safety and human support/);
 }
});
test('consensual relational preferences are not automatically described as disordered',()=>{
 const p=atlasProfile('submissive-patterns');
 assert.match(p.definition,/not inherently a psychological problem/);
 assert.ok(p.variants.some(v=>/consensual/i.test(v)));
});
