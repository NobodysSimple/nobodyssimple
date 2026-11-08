import test from 'node:test';
import assert from 'node:assert/strict';
import {curriculum} from '../../ns-lifelab-content.mjs';
import {completeLesson,STORAGE_KEY,readRecords} from '../../ns-lifelab-state.mjs';
import {progressModel,journeyEvent,purchase,equip,recordStory,storyStage,recordChapter,recordReview,reviewQueue,streakSummary,setPreference,mergeLearningRecords,weekKey,dayKey,SHOP,ACHIEVEMENTS} from '../../ns-journey-progress.mjs';
import {OPENING_CASES,storyContent} from '../../ns-journey-stories.mjs';
import {gameDefinition} from '../../ns-lifelab-games.mjs';
import {renderLifeLabV3,cleanupLifeLabV3} from '../../ns-lifelab-v3.mjs';
const memory=(initial={})=>{let value=JSON.stringify(initial);return {getItem:k=>k===STORAGE_KEY?value:null,setItem:(k,v)=>{if(k===STORAGE_KEY)value=v;}};};
const at=day=>new Date(day+'T12:00:00');
const completed=(world,count)=>Object.fromEntries(curriculum[world].flatMap(u=>u.lessons).slice(0,count).map(l=>['ns-lifelab-v3:'+l.id,{completed:true,completedAt:'2026-11-02T12:00:00.000Z'}]));
test('old completions acquire XP and gems without duplicate grants; cosmetics cannot buy access',()=>{
 const s=memory(completed('forest',10));assert.equal(progressModel(readRecords(s)).xp,200);assert.equal(progressModel(readRecords(s)).gems,30);
 assert.ok(purchase('sun-hat',s,at('2026-11-03')).ok);assert.equal(progressModel(readRecords(s)).gems,0);assert.ok(purchase('sun-hat',s).ok);assert.equal(progressModel(readRecords(s)).gems,0);
 assert.ok(equip('sun-hat','hat',s).ok);assert.equal(progressModel(readRecords(s)).equipped.hat,'sun-hat');assert.equal(purchase('moss-cloak',s).ok,false);assert.equal(equip('walking-boots','shoes',s).ok,false);
 assert.ok(completeLesson(curriculum.forest[0].lessons[0].id,s).ok);assert.equal(progressModel(readRecords(s)).xp,200);
});
test('concurrent spending reconciles deterministically without negative balances',()=>{
 const initial=completed('forest',10),a=memory(initial),b=memory(initial);assert.ok(purchase('sun-hat',a,at('2026-11-03')).ok);assert.ok(purchase('little-pack',b,at('2026-11-04')).ok);
 const ab=mergeLearningRecords(a.getItem(STORAGE_KEY),b.getItem(STORAGE_KEY)),ba=mergeLearningRecords(b.getItem(STORAGE_KEY),a.getItem(STORAGE_KEY));assert.equal(ab,ba);const p=progressModel(JSON.parse(ab));assert.equal(p.gems,0);assert.deepEqual(p.owned,['sun-hat']);assert.deepEqual(p.rejected,['little-pack']);
 assert.equal(mergeLearningRecords('{bad','{}'),null);assert.equal(mergeLearningRecords('{"unrelated":{"a":1}}','{"unrelated":{"a":2}}'),null);
});
test('companion stories are sequential, persistent and tied to learning; chapter rewards are idempotent',()=>{
 const s=memory();assert.equal(recordStory('forest',0,2,0,s).ok,false);assert.ok(recordStory('forest',0,0,1,s).ok);assert.equal(storyStage('forest',0,readRecords(s)),1);assert.equal(recordStory('forest',0,1,0,s).ok,false);
 const raw={...readRecords(s),...completed('forest',80)};s.setItem(STORAGE_KEY,JSON.stringify(raw));for(let n=1;n<5;n++)assert.ok(recordStory('forest',0,n,n%2,s).ok);assert.equal(storyStage('forest',0,readRecords(s)),5);
 assert.equal(recordChapter('meadow',1,s).ok,false);assert.ok(recordChapter('forest',1,s).ok);const before=progressModel(readRecords(s));assert.ok(before.owned.includes('moss-cloak'));recordChapter('forest',1,s);assert.equal(progressModel(readRecords(s)).xp,before.xp);assert.ok(before.achievements.find(a=>a.id==='story').earned);
});
test('flexible weekly, daily and disabled streaks use local calendar days and do not remove learning',()=>{
 const s=memory();for(const day of ['2026-11-02','2026-11-04','2026-11-06'])journeyEvent('partner:'+day,'partner',{},s,at(day));const r=readRecords(s);assert.equal(weekKey('2026-11-08'),'2026-11-02');assert.equal(streakSummary(r,'2026-11-08').run,1);assert.equal(streakSummary(r,'2026-11-08').count,3);
 setPreference('streak','daily',s,at('2026-11-07'));assert.equal(streakSummary(readRecords(s),'2026-11-07').run,1);setPreference('streak','off',s,at('2026-11-08'));assert.equal(streakSummary(readRecords(s),'2026-11-08').mode,'off');assert.equal(Object.keys(readRecords(s)).filter(k=>k.includes('partner')).length,3);
 assert.equal(setPreference('goal',99,s).ok,false);assert.equal(setPreference('quiet','yes',s).ok,false);
});
test('retrieval spacing grows after review and shortens after uncertainty',()=>{
 const s=memory(completed('forest',1)),id=curriculum.forest[0].lessons[0].id;assert.equal(reviewQueue(readRecords(s),'2026-11-03')[0].due,'2026-11-03');assert.ok(recordReview(id,false,s,at('2026-11-03')).ok);assert.equal(reviewQueue(readRecords(s),'2026-11-03')[0].due,'2026-11-06');recordReview(id,false,s,at('2026-11-03'));assert.equal(reviewQueue(readRecords(s))[0].reviews,1);recordReview(id,true,s,at('2026-11-06'));assert.equal(reviewQueue(readRecords(s))[0].due,'2026-11-07');assert.equal(recordReview('unknown',false,s).ok,false);
});
test('twenty companions have distinct five-stage stories and first chapters have forty situations',()=>{
 const stories=new Set(),cases=new Set();for(const world of Object.keys(curriculum)){assert.equal(OPENING_CASES[world].length,8);for(let i=0;i<4;i++)for(let n=0;n<5;n++){const c=storyContent(world,i,n);stories.add(c.text);assert.equal(c.choices.length,2);}for(let u=1;u<=8;u++){cases.add(OPENING_CASES[world][u-1][1]);assert.ok(gameDefinition('capstone-path',world,u).situation.includes(OPENING_CASES[world][u-1][1]));}}
 assert.equal(stories.size,100);assert.equal(cases.size,40);assert.equal(ACHIEVEMENTS.length,25);assert.ok(SHOP.every(i=>i.cost>=0));
});
test('default map shows eight units, optional world map shows forty; central stone icons survive locks',()=>{
 const root={innerHTML:''};renderLifeLabV3(root,['forest']);assert.equal((root.innerHTML.match(/class="ll-unit"/g)||[]).length,8);assert.ok(root.innerHTML.includes('j-stone-status'));assert.ok(root.innerHTML.includes('The Journey'));renderLifeLabV3(root,['forest'],{fullMap:true});assert.equal((root.innerHTML.match(/class="ll-unit"/g)||[]).length,40);cleanupLifeLabV3();
});
test('invalid, locked or quota-limited storage never grants a purchase or story',()=>{
 assert.equal(journeyEvent('x','story',{},null).ok,false);assert.equal(purchase('sun-hat',memory()).ok,false);const bad={getItem:()=>'{bad',setItem:()=>assert.fail()};assert.equal(journeyEvent('x','story',{},bad).ok,false);const quota={getItem:()=>JSON.stringify(completed('forest',10)),setItem:()=>{throw Error('quota');}};assert.equal(purchase('sun-hat',quota).ok,false);
});
