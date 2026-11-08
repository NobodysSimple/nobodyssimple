import {gameFor} from './ns-lifelab-worlds.mjs';
import {curriculum,trails} from './ns-lifelab-content.mjs';
import {readRecords,lessonDone,STORAGE_KEY} from './ns-lifelab-state.mjs';
export const PREFIX='ns-journey:';
export const DEFAULT_PREFS={streak:'weekly',goal:3,rewards:true,quiet:false,motion:true,untimed:false,sound:false,metrics:false};
export const SHOP=[
 ['sun-hat','Sun hat','hat',30,'#dfbd67'],['moss-cloak','Moss cloak','clothes',0,'#729b55','forest'],['sailor-scarf','Sailor scarf','clothes',0,'#709eb2','bridge'],['garden-apron','Garden apron','clothes',0,'#d495a9','meadow'],['maker-coat','Maker coat','clothes',0,'#be8d58','workshop'],['star-cape','Star cape','clothes',0,'#9584b5','observatory'],
 ['walking-boots','Walking boots','shoes',35,'#9a7756'],['little-pack','Little backpack','pack',25,'#bea05f'],['amber-lantern','Amber lantern','lantern',40,'#eab85a'],['compass-pin','Compass pin','accessory',20,'#78a6a3'],['reading-chair','Reading chair','furniture',45,'#ad9578'],['garden-pot','Garden pot','collectible',25,'#9eae73'],['harbour-postcard','Harbour postcard','collectible',20,'#81b1be'],['star-mobile','Star mobile','furniture',40,'#b29dc7'],['leaf-trail','Falling leaves','effect',35,'#91ae6b'],['soft-sparkle','Soft stars','effect',35,'#d6bc72']
].map(([id,name,slot,cost,color,world])=>({id,name,slot,cost,color,world}));
export const dayKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const dayDate=s=>new Date(s+'T12:00:00');
export function addDays(day,n){const d=dayDate(day);d.setDate(d.getDate()+n);return dayKey(d);}
export function weekKey(day=dayKey()){const d=dayDate(day);d.setDate(d.getDate()-(d.getDay()+6)%7);return dayKey(d);}
export function events(records){return Object.entries(records).filter(([k,v])=>k.startsWith(PREFIX)&&v&&typeof v==='object').map(([key,v])=>({...v,key}));}
export function preferences(records){const p={...DEFAULT_PREFS};for(const e of events(records).filter(e=>e.type==='setting').sort((a,b)=>a.at.localeCompare(b.at)||a.key.localeCompare(b.key)))if(e.name in p)p[e.name]=e.value;return p;}
export function journeyEvent(id,type,data={},store,now=new Date()){
 if(!store)return {ok:false,error:'Saving is unavailable. Your activity is still open.'};
 try{const raw=JSON.parse(store.getItem(STORAGE_KEY)||'{}');if(!raw||Array.isArray(raw)||typeof raw!=='object')throw Error();const key=PREFIX+id;if(!raw[key]){raw[key]={...data,type,at:now.toISOString(),day:dayKey(now)};if(type==='metric')trimMetrics(raw);store.setItem(STORAGE_KEY,JSON.stringify(raw));}return {ok:true,records:raw};}catch{return {ok:false,error:'Could not save. Check storage or unlock your account, then try again.'};}
}
export function setPreference(name,value,store,now=new Date()){
 if(!(name in DEFAULT_PREFS)||name==='streak'&&!['weekly','daily','off'].includes(value)||name==='goal'&&![1,2,3,4,5,6,7].includes(value)||typeof DEFAULT_PREFS[name]==='boolean'&&typeof value!=='boolean')return {ok:false,error:'Invalid setting'};
 return journeyEvent('setting:'+name+':'+now.toISOString(),'setting',{name,value},store,now);
}
export function unitComplete(world,unit,records){return curriculum[world]?.[unit-1]?.lessons.every(l=>lessonDone(l,records))||false;}
export function storyStage(world,index,records){let n=0;while(n<5&&records[PREFIX+`story:${world}:${index}:${n}`])n++;return n;}
export function storyAvailable(world,index,records){const stage=storyStage(world,index,records);return stage<5&&(stage===0||unitComplete(world,stage,records));}
export function recordStory(world,index,stage,choice,store,now=new Date()){
 const records=readRecords(store);if(!curriculum[world]||index<0||index>3||!Number.isInteger(index)||storyStage(world,index,records)!==stage||!storyAvailable(world,index,records)||![0,1].includes(choice))return {ok:false,error:'Continue this story from its current chapter.'};
 return journeyEvent(`story:${world}:${index}:${stage}`,'story',{world,index,stage,choice},store,now);
}
export function chapterReady(world,chapter,records){return chapter>=1&&chapter<=5&&curriculum[world].slice((chapter-1)*8,chapter*8).every(u=>unitComplete(world,u.number,records));}
export function recordChapter(world,chapter,store,now=new Date()){if(!curriculum[world]||!chapterReady(world,chapter,readRecords(store)))return {ok:false,error:'Finish this chapter’s eight units first.'};return journeyEvent(`chapter:${world}:${chapter}`,'chapter',{world,chapter},store,now);}
export function recordReview(lessonId,uncertain,store,now=new Date(),kind='review'){
 const lesson=Object.values(curriculum).flatMap(us=>us.flatMap(u=>u.lessons)).find(l=>l.id===lessonId);if(!lesson||!lessonDone(lesson,readRecords(store)))return {ok:false,error:'Complete this lesson before reviewing it.'};
 return journeyEvent(`${kind}:${lessonId}:${dayKey(now)}`,kind,{lessonId,world:lessonId.split('-unit-')[0],uncertain:!!uncertain},store,now);
}
export function reviewQueue(records,today=dayKey()){
 const ev=events(records);return Object.entries(curriculum).flatMap(([world,units])=>units.flatMap(u=>u.lessons.filter(l=>l.type!=='application'&&lessonDone(l,records)).map(l=>{
  const rs=ev.filter(e=>['review','discovery'].includes(e.type)&&e.lessonId===l.id).sort((a,b)=>a.at.localeCompare(b.at));const latest=rs.at(-1);const old=records['ns-lifelab-v3:'+l.id];const first=old?.completedAt?.slice(0,10)||addDays(today,-1);const delay=latest?.uncertain?1:[1,3,7,14,30][Math.min(rs.length,4)];return {world,unit:u,lesson:l,due:addDays(latest?.day||first,delay),reviews:rs.length};
 }))).sort((a,b)=>a.due.localeCompare(b.due)||a.lesson.id.localeCompare(b.lesson.id));
}
export function weeklyQuests(records,today=dayKey()){
 const week=weekKey(today),ev=events(records).filter(e=>e.day>=week&&e.day<=addDays(week,6));
 return [{id:'help',name:'Help two different Nobodys',target:2,count:new Set(ev.filter(e=>e.type==='story').map(e=>e.world+e.index)).size},{id:'review',name:'Return to a skill',target:1,count:ev.filter(e=>['review','discovery'].includes(e.type)).length},{id:'explore',name:'Practise on three days',target:3,count:activityDays(records).filter(d=>d>=week&&d<=addDays(week,6)).length}];
}
export function activityDays(records){return [...new Set([...Object.entries(records).filter(([k,v])=>k.startsWith('ns-lifelab-v3:')&&v?.completed&&v.completedAt).map(([,v])=>dayKey(new Date(v.completedAt))),...events(records).filter(e=>['story','chapter','review','discovery','partner'].includes(e.type)).map(e=>e.day)])].filter(Boolean).sort();}
export function streakSummary(records,today=dayKey()){
 const p=preferences(records),days=activityDays(records),week=weekKey(today);let run=0;
 if(p.streak==='daily'){let day=days.includes(today)?today:addDays(today,-1);while(days.includes(day)){run++;day=addDays(day,-1);}}
 else if(p.streak==='weekly'){let w=week;const total=x=>days.filter(d=>d>=x&&d<=addDays(x,6)).length;if(total(w)<p.goal)w=addDays(w,-7);while(total(w)>=p.goal){run++;w=addDays(w,-7);}}
 return {mode:p.streak,run,goal:p.goal,count:days.filter(d=>d>=week&&d<=addDays(week,6)).length,days:Array.from({length:7},(_,i)=>({day:addDays(week,i),done:days.includes(addDays(week,i))}))};
}
export function progressModel(records,today=dayKey()){
 const ev=events(records),complete=Object.values(curriculum).flatMap(us=>us.flatMap(u=>u.lessons)).filter(l=>lessonDone(l,records)),chapters=ev.filter(e=>e.type==='chapter'),stories=ev.filter(e=>e.type==='story'),finales=Object.keys(curriculum).filter(w=>records['ns-lifelab-finale:'+w]?.completed),days=activityDays(records);
 const xp=complete.length*20+chapters.length*100+stories.length*15+finales.length*200;
 let earned=complete.length*3+chapters.length*30+stories.length*8+finales.length*60;
 const weeks=new Set(days.map(weekKey));for(const w of weeks)earned+=weeklyQuests(records,w).filter(q=>q.count>=q.target).length*10;
 earned+=new Set(ev.filter(e=>e.type==='discovery').map(e=>e.day)).size*5;
 const owned=new Set();for(const item of SHOP)if(item.world&&ev.some(e=>e.type==='chapter'&&e.world===item.world))owned.add(item.id);
 let spent=0;const rejected=[];for(const e of ev.filter(e=>e.type==='purchase').sort((a,b)=>a.at.localeCompare(b.at)||a.key.localeCompare(b.key))){const item=SHOP.find(i=>i.id===e.item);if(!item||item.world||owned.has(item.id))continue;if(spent+item.cost<=earned){spent+=item.cost;owned.add(item.id);}else rejected.push(item.id);}
 const equipped={};for(const e of ev.filter(e=>e.type==='equip').sort((a,b)=>a.at.localeCompare(b.at)||a.key.localeCompare(b.key))){if(e.item===null)delete equipped[e.slot];else if(owned.has(e.item)&&SHOP.find(i=>i.id===e.item)?.slot===e.slot)equipped[e.slot]=e.item;}
 const placed=ev.filter(e=>e.type==='place').sort((a,b)=>a.at.localeCompare(b.at)||a.key.localeCompare(b.key)).reduce((a,e)=>{if(owned.has(e.item))a[e.item]=!!e.visible;return a;},{});
 const achievements=achievementInventory({complete,ev,chapters,stories,finales,days,owned,records});
 return {xp,level:Math.floor(xp/200)+1,levelXP:xp%200,levelMax:200,title:xp<400?'Curious Traveller':xp<1600?'Thoughtful Explorer':'World Wayfinder',gems:earned-spent,earned,owned:[...owned],equipped,placed,rejected,achievements,chapters:chapters.length,stories:stories.length,complete:complete.length,streak:streakSummary(records,today),prefs:preferences(records),missionBadges:complete.filter(l=>l.type==='capstone').map(l=>l.id)};
}
export const ACHIEVEMENTS=[['first','First Footstep','Complete a lesson.'],['second','Second Look','Correct a mistaken answer.'],['evidence','Evidence Explorer','Complete three different Forest practice lessons.'],['communicator','Clear Communicator','Help a Harbour companion practise.'],['keeper','Garden Keeper','Finish a Garden companion’s five-stage story.'],['habit','Habit Maker','Build a routine and return to review it.'],['values','Values Voyager','Complete an Observatory challenge.'],['welcome','Welcome Back','Learn again after seven days away.'],['forest','Forest Friend','Finish the first Forest unit.'],['garden','Garden Visitor','Finish the first Garden unit.'],['harbour','Harbour Visitor','Finish the first Harbour unit.'],['forge','Forge Visitor','Finish the first Forge unit.'],['stars','Star Visitor','Finish the first Observatory unit.'],['chapter','Chapter Keeper','Complete a chapter festival.'],['five','Five Worlds','Complete a lesson in each world.'],['listener','Patient Listener','Meet four companions.'],['story','A Story Continued','Complete a companion storyline.'],['review','Return to an Idea','Complete a retrieval review.'],['retrieval','Growing Recall','Review on three different days.'],['discovery','Daily Discovery','Complete an optional discovery.'],['team','Together We Think','Complete a local partner quest.'],['wardrobe','A Personal Touch','Collect a cosmetic item.'],['collector','Little Collection','Collect three cosmetic items.'],['home','A Place to Return','Place a homebase decoration.'],['destination','Destination Reached','Complete a grand finale.']];
function achievementInventory({complete,ev,chapters,stories,finales,days,owned,records}){
 const world=w=>complete.filter(l=>l.id.startsWith(w+'-')),has=t=>ev.some(e=>e.type===t),finished=w=>[0,1,2,3].some(i=>storyStage(w,i,records)===5);
 const flags=[complete.length>0,ev.some(e=>e.type==='improved'),new Set(world('forest').map(l=>{const match=l.id.match(/unit-(\d+)-lesson-(\d+)/);return gameFor('forest',+match[1],+match[2]);})).size>=3,stories.some(e=>e.world==='bridge'&&e.stage>=2),finished('meadow'),ev.some(e=>{const m=e.lessonId?.match(/workshop-unit-(\d+)-lesson-(\d+)/);return e.type==='review'&&m&&gameFor('workshop',+m[1],+m[2])==='habit-engine';}),world('observatory').length>0,days.some((d,i)=>i>0&&dayDate(d)-dayDate(days[i-1])>=7*86400000),...['forest','meadow','bridge','workshop','observatory'].map(w=>unitComplete(w,1,records)),chapters.length>0,trails.every(t=>world(t.id).length>0),new Set(stories.map(e=>e.world+e.index)).size>=4,trails.some(t=>finished(t.id)),has('review'),new Set(ev.filter(e=>e.type==='review').map(e=>e.day)).size>=3,has('discovery'),has('partner'),owned.size>0,owned.size>=3,ev.some(e=>e.type==='place'&&e.visible),finales.length>0];
 return ACHIEVEMENTS.map(([id,name,description],i)=>({id,name,description,earned:!!flags[i]}));
}
export function purchase(itemId,store,now=new Date()){const item=SHOP.find(i=>i.id===itemId),p=progressModel(readRecords(store));if(!item||item.world)return {ok:false,error:'This item is earned through a chapter festival.'};if(p.owned.includes(itemId))return {ok:true};if(p.gems<item.cost)return {ok:false,error:'More Trail Gems are needed. Every lesson remains free to access.'};return journeyEvent('purchase:'+itemId,'purchase',{item:itemId},store,now);}
export function equip(itemId,slot,store,now=new Date()){const p=progressModel(readRecords(store));if(itemId!==null&&(!p.owned.includes(itemId)||SHOP.find(i=>i.id===itemId)?.slot!==slot))return {ok:false,error:'Collect this item first.'};return journeyEvent('equip:'+slot+':'+now.toISOString(),'equip',{item:itemId,slot},store,now);}
export function placeItem(item,visible,store,now=new Date()){if(!progressModel(readRecords(store)).owned.includes(item)||!['furniture','collectible'].includes(SHOP.find(i=>i.id===item)?.slot))return {ok:false,error:'Collect this decoration first.'};return journeyEvent('place:'+item+':'+now.toISOString(),'place',{item,visible},store,now);}
// Union immutable Journey events and completions. Unknown conflicting data is
// deliberately left to the existing account conflict-review UI.
export function mergeLearningRecords(a,b){
 try{const x=JSON.parse(a),y=JSON.parse(b);if(!x||!y||Array.isArray(x)||Array.isArray(y)||typeof x!=='object'||typeof y!=='object')return null;const result={...x};for(const [k,v] of Object.entries(y)){if(!(k in result)){result[k]=v;continue;}if(JSON.stringify(result[k])===JSON.stringify(v))continue;if(k.startsWith(PREFIX)){if(result[k]?.type!==v?.type)return null;result[k]=JSON.stringify(result[k])<JSON.stringify(v)?result[k]:v;}else if((k.startsWith('ns-lifelab-v3:')||k.startsWith('ns-lifelab-finale:'))&&result[k]?.completed&&v?.completed){result[k]=(result[k].completedAt||'')<(v.completedAt||'')?result[k]:v;}else return null;}trimMetrics(result);return JSON.stringify(Object.fromEntries(Object.entries(result).sort(([a],[b])=>a.localeCompare(b))));}catch{return null;}
}

function trimMetrics(records){const keys=Object.keys(records).filter(k=>k.startsWith(PREFIX)&&records[k]?.type==='metric').sort((a,b)=>(records[a].at||'').localeCompare(records[b].at||'')||a.localeCompare(b));for(const key of keys.slice(0,Math.max(0,keys.length-300)))delete records[key];}
