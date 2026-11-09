import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {NEEDS_MODES,needsDestination} from '../../ns-needs-catalog.mjs';
import {PATH_GUIDES,PATH_LANES,PATH_SOURCES,pathGuide} from '../../ns-pathway-content.mjs';

const modes=['process','understand','act','relate','learn','unsure'];
test('all 45 non-Steadier choices have separately authored contextual guides',()=>{
 const options=NEEDS_MODES.filter(x=>modes.includes(x.id)).flatMap(mode=>mode.options.map(option=>({mode,option})));
 assert.equal(options.length,45);
 assert.equal(Object.keys(PATH_GUIDES).length,45);
 assert.equal(PATH_LANES.length,5);
 for(const {mode,option} of options){
  const id=mode.id+'/'+option.id;
  const g=pathGuide(mode.id,option.id);
  assert.ok(g,id+' missing');
  assert.equal(g.id,id);
  assert.equal(g.title,option.title);
  assert.ok(g.what.length>=70,id+' needs recognition text');
  assert.ok(g.cycle.length>=70,id+' needs a bounded process hypothesis');
  assert.ok(g.caution.length>=65,id+' needs context-sensitive safety');
  assert.equal(g.methods.length,PATH_LANES.length,id);
  for(const [i,steps] of g.methods.entries()){
   assert.ok(steps.length>=2,id+' '+PATH_LANES[i].id+' needs concrete steps');
   assert.ok(steps.every(s=>s.length>=15),id+' '+PATH_LANES[i].id+' needs useful, specific steps');
  }
  assert.ok(g.refs.length>=1,id+' needs relevant sources');
  for(const ref of g.refs)assert.ok(PATH_SOURCES[ref],id+' unknown source '+ref);
  const url=needsDestination(option);
  const expected=option.type==='activity'?(mode.id==='unsure'&&option.id==='relief'?'#need/':'#route-activity/'):
   option.type==='tool'?'#route-tool/':option.type==='topic'?'#route-topic/':'#route-atlas/';
  assert.ok(url.startsWith(expected),id+' incorrect destination '+url);
 }
 assert.equal(pathGuide('regulate','overwhelmed'),null);
 assert.equal(pathGuide('act','nonexistent'),null);
});
test('all reference links are official HTTPS resources with stated scope',()=>{
 for(const [id,source] of Object.entries(PATH_SOURCES)){
  assert.match(source.url,/^https:\/\/(www\.)?(nhs\.uk|nice\.org\.uk|gov\.uk)\//,id);
  assert.ok(source.name.length>=12,id);
  assert.ok(source.scope.length>=30,id);
 }
});
test('specialist paths do not conceal key contraindications',()=>{
 const textFor=(a,b)=>{const g=pathGuide(a,b);return [g.what,g.cycle,g.caution,...g.methods.flat()].join(' ')};
 assert.match(textFor('process','event'),/trauma retelling|debrief/i);
 assert.match(textFor('process','grief'),/no fixed stages|no fixed.*timetable/i);
 assert.match(textFor('relate','unsafe'),/999|coercion|monitored/i);
 assert.match(textFor('relate','boundary'),/not a rule|another person|coercion/i);
 assert.match(textFor('learn','panic'),/chest pain|emergency/i);
 assert.match(textFor('learn','checking'),/exposure and response prevention|ERP/i);
 assert.match(textFor('learn','sleep'),/sleep restriction|apnoea/i);
 assert.match(textFor('learn','social'),/individual CBT|CBT designed|CBT for social/i);
 assert.match(textFor('act','begin'),/post-exertional|pushing through/i);
 assert.match(textFor('understand','identity'),/do not infer gender|not infer gender/i);
});
test('the application mounts each guide without discarding the existing worksheet and safeguards',()=>{
 const site=readFileSync('site.mjs','utf8');
 const activity=readFileSync('ns-needs-activities.mjs','utf8');
 const console=readFileSync('ns-needs-console.mjs','utf8');
 const markup=readFileSync('ns-pathway-guidebook.mjs','utf8');
 for(const route of ['route-activity','route-tool','route-topic','route-atlas'])assert.ok(site.includes('"'+route+'"'),route);
 assert.match(site,/accountState\(\)\.locked.*'route-tool'/);
 assert.match(activity,/attachPathGuide\(root,context\?\.mode\|\|'process'/);
 assert.match(activity,/Nothing is automatically saved/);
 assert.match(console,/attachPathGuide\(root,'learn','browse'/);
 assert.match(markup,/modal\.showModal/);
 assert.match(markup,/data-path-pin/);
 assert.match(markup,/selectedSteps\.set/);
 assert.match(markup,/opener\.focus/);
 assert.doesNotMatch(markup,/localStorage|sessionStorage|fetch\(/);
});
