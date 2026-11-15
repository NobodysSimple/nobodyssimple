import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 practiceSkills,practiceIdentities,practiceSkillMap,practiceIdentityMap,
 kindnessSkillCategories
} from '../../lifestyle-practice-content.mjs';
import {goodDeeds} from '../../lifestyle-deeds.mjs';
import {
 normalisePractice,ensureDailyPractice,choosePracticeIdentity,choosePracticeSkills,
 choosePracticeFocus,choosePracticeLevel,anotherPractice,completePractice,
 undoPractice,pausePractice,resumePractice,practiceLevel,practiceSummary,
 getPracticeTask,dateKey,PRACTICE_KEY
} from '../../lifestyle-practice.mjs';
import {SAVED} from '../../account-policy.mjs';
const d=(day,hour=12)=>new Date(day+'T'+String(hour).padStart(2,'0')+':00:00');
const begin=(id='self-trusting',day='2026-11-14')=>choosePracticeIdentity({},id,d(day));
const src=name=>readFileSync(new URL('../../'+name,import.meta.url),'utf8');

test('16 distinct skills, 8 identities and 192 original, graduated, usable practices',()=>{
 assert.equal(practiceSkills.length,16);
 assert.equal(practiceIdentities.length,8);
 assert.equal(new Set(practiceSkills.map(x=>x.id)).size,16);
 const tasks=practiceSkills.flatMap(skill=>{
  assert.equal(skill.levels.length,4,skill.id);
  return skill.levels.flatMap((level,i)=>{
   assert.equal(level.length,3,skill.id+' level '+(i+1));
   return level.map(item=>{
    assert.equal(item.skillId,skill.id);
    assert.equal(item.level,i+1);
    assert.ok(item.task.length>22);
    assert.equal(item.source,'practice');
    return item;
   });
  });
 });
 assert.equal(tasks.length,192);
 assert.equal(new Set(tasks.map(item=>item.id)).size,192);
 assert.equal(new Set(tasks.map(item=>item.task.toLowerCase())).size,192);
 for(const identity of practiceIdentities){
  assert.equal(identity.skills.length,3);
  assert.ok(identity.skills.every(id=>practiceSkillMap.has(id)));
  assert.equal(practiceIdentityMap.get(identity.id).id,identity.id);
 }
});
test('existing 200 original good deeds stay available as relevant kindness alternatives',()=>{
 assert.equal(goodDeeds.length,200);
 assert.equal(Object.keys(kindnessSkillCategories).length,8);
 assert.ok(goodDeeds.every(deed=>kindnessSkillCategories[deed.category]));
 let practice=choosePracticeFocus(begin('compassionate'),'compassion',d('2026-11-14'));
 practice=anotherPractice(practice,d('2026-11-14'),{kindness:true});
 const item=getPracticeTask(practice);
 assert.equal(item.source,'kindness');
 assert.equal(item.skillId,'compassion');
 assert.ok(item.task.length>25);
});
test('onboarding and edits select one to three skill focuses without resetting other progress',()=>{
 const date=d('2026-11-14');
 let state=begin('courageous');
 assert.equal(state.identityId,'courageous');
 assert.deepEqual(state.skillIds,['courage','uncertainty','boundaries']);
 const original=state.today.taskId;
 state=choosePracticeSkills(state,['self-trust','gratitude'],date);
 assert.deepEqual(state.skillIds,['self-trust','gratitude']);
 assert.notEqual(state.today.taskId,original);
 assert.ok(state.skillIds.includes(state.today.skillId));
 assert.equal(choosePracticeSkills(state,[],date).skillIds.length,2);
 assert.equal(choosePracticeSkills(state,['gratitude','resilience','presence','vulnerability'],date).skillIds.length,3);
});
test('a suggestion stays stable on reload; another idea never adds progress',()=>{
 const date=d('2026-11-14');
 const state=begin('grounded');
 const copy=ensureDailyPractice(JSON.parse(JSON.stringify(state)),date);
 assert.equal(copy.today.taskId,state.today.taskId);
 const alternate=anotherPractice(copy,date);
 assert.notEqual(alternate.today.taskId,state.today.taskId);
 assert.equal(practiceSummary(alternate).total,0);
 assert.equal(alternate.today.skips,1);
});
test('one practice per local day, completion is idempotent, tomorrow resets and progress persists',()=>{
 const firstDay=d('2026-11-14'),nextDay=d('2026-11-15');
 let state=begin('courageous');
 const first=state.today;
 state=completePractice(state,firstDay);
 assert.equal(state.today.done,true);
 assert.equal(state.history.length,1);
 assert.equal(practiceSummary(state).total,1);
 const duplicate=completePractice(state,firstDay);
 assert.deepEqual(duplicate,state);
 const afterSwitch=choosePracticeIdentity(state,'thoughtful',firstDay);
 assert.equal(afterSwitch.today.taskId,first.taskId);
 assert.equal(afterSwitch.today.done,true);
 state=ensureDailyPractice(afterSwitch,nextDay);
 assert.equal(state.today.date,'2026-11-15');
 assert.equal(state.today.done,false);
 assert.equal(practiceSummary(state).total,1);
});
test('suggested levels move every three recorded days; explicit difficulty can be lowered',()=>{
 let state=choosePracticeSkills(begin('self-trusting'),['self-trust'],d('2026-11-14'));
 for(const day of ['2026-11-14','2026-11-15','2026-11-16']){
  state=completePractice(ensureDailyPractice(state,d(day)),d(day));
 }
 assert.equal(state.counts['self-trust'],3);
 assert.equal(practiceLevel(state,'self-trust'),2);
 state=ensureDailyPractice(state,d('2026-11-17'));
 assert.equal(state.today.level,2);
 state=choosePracticeLevel(state,'self-trust',1,d('2026-11-17'));
 assert.equal(state.today.level,1);
 assert.equal(practiceLevel(state,'self-trust'),1);
});
test('skip and resume carry no penalty; undo only removes the current recorded practice',()=>{
 const date=d('2026-11-14');
 let state=begin('connected');
 state=pausePractice(state,date);
 assert.equal(state.today.paused,true);
 assert.equal(completePractice(state,date).counts[state.today.skillId]||0,0);
 state=resumePractice(state,date);
 state=completePractice(state,date);
 assert.equal(practiceSummary(state).total,1);
 state=undoPractice(state,date);
 assert.equal(practiceSummary(state).total,0);
 assert.equal(state.today.done,false);
 assert.equal(state.history.length,0);
});
test('the account sync key is opt-in and old deed data is not overwritten',()=>{
 assert.ok(SAVED[PRACTICE_KEY]);
 const life=src('lifestyle.mjs'),practice=src('lifestyle-practice-ui.mjs'),html=src('index.html');
 assert.match(life,/mountLifestylePractice/);
 assert.match(life,/Today’s Field Mission/);
 assert.ok(!life.includes('ns-lifestyle-deed-v1'));
 assert.ok(practice.includes('data-practice-pause'));
 assert.ok(practice.includes('data-practice-undo'));
 assert.ok(html.includes('lifestyle-practice.css'));
 assert.equal(dateKey(d('2026-11-14')),'2026-11-14');
});
