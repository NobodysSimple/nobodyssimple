import {WORLD_STORIES,GAME_LABELS,characterFor,characterMarkup,gameFor} from './ns-lifelab-worlds.mjs';
import {environmentSVG,finaleSVG,boundaryColor,gameArt} from './ns-lifelab-scenery.mjs';
import {gameDefinition,mountGame} from './ns-lifelab-games.mjs';
import {trails,curriculum,findTrail,lessonQuestions} from './ns-lifelab-content.mjs';
import {readRecords,lessonDone,stoneProgress,stoneState,currentStone,completeLesson,trailProgress,finaleDone,completeFinale} from './ns-lifelab-state.mjs';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paths={grow:'M12 22V10M12 14C2 14 2 4 2 4c8 0 10 3 10 10Zm0-4C12 2 21 2 21 2c0 8-3 12-9 12',flag:'M5 23V2m0 1q5-3 9 0t7 0v11q-4 3-8 0t-8 0',tree:'M12 2 4 12h5l-6 7h7v3h4v-3h7l-6-7h5Z',flower:'M12 9C4-3 0 9 9 12c-12 4-2 13 3 3 5 10 15 1 3-3 9-3 5-15-3-3Z',anchor:'M12 8v13M4 12v4c0 7 16 7 16 0v-4M2 14l2-2 2 2m12 0 2-2 2 2M7 9h10',forge:'M2 8h20l-4 5h-4v5h4v3H6v-3h4v-5H6Z',star:'m12 2 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z',book:'M3 4q5-2 9 1 4-3 9-1v16q-5-2-9 1-4-3-9-1ZM12 5v16',practice:'M3 8v8m3-11v14m0-7h12m0-7v14m3-11v8',compare:'M12 2v19M5 6h14M5 6l-4 8h8Zm14 0-4 8h8ZM7 22h10',capstone:'m2 8 10-5 10 5-10 5ZM6 10v7q6 5 12 0v-7M22 8v9',apply:'m12 2 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z',lock:'M6 10h12v11H6ZM8 10V6a4 4 0 0 1 8 0v4',check:'m5 12 5 5L20 6',home:'m2 11 10-9 10 9M5 9v13h5v-7h4v7h5V9',user:'M4 22v-3a8 8 0 0 1 16 0v3',chat:'M3 3h18v14H9l-6 5Z',mountain:'m1 21 8-16 5 9 3-6 6 13ZM6 11l3 2 3-2'};
export const icon=(name)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${name==='anchor'?'<circle cx="12" cy="4" r="2"/>':name==='user'?'<circle cx="12" cy="6" r="4"/>':''}<path d="${paths[name]||paths.star}"/></svg>`;
const theme=t=>`--world:${t.color};--panel:${t.panel*25}%`;
const stoneIcons=['book','grow','book','flag','apply'];
const colors=['#65b3e3','#9dc66c','#adc7a1','#f3ad49','#f5ce58'];
let dispose=()=>{};
let dialog=null;
let disposeGame=()=>{};
let focusOrigin=null;
const storage=()=>{try{return localStorage;}catch{return null;}};
export function cleanupLifeLabV3(){disposeGame();disposeGame=()=>{};dispose();dispose=()=>{};if(dialog){dialog.remove();dialog=null;}if(typeof document!=='undefined')document.body.classList.remove('lifelab-active');}
function badge(t){return `<span class="ll-world-icon">${icon(t.icon)}</span>`;}
function navigation(t){return `<a href="#lab/${t.slug}" class="ll-trail-link${typeof location!=='undefined'&&[t.id,t.slug].some(id=>location.hash===`#lab/${id}`)?' is-selected':''}" style="${theme(t)}">${badge(t)}<span><strong>${t.name}</strong><small>→ ${t.destination}</small></span><span aria-hidden="true">›</span></a>`;}
function bottomNav(){return `<nav class="ll-bottom" aria-label="Life Lab navigation"><a href="#home">${icon('home')}Home</a><a href="#lab" aria-current="page">${icon('mountain')}Life Lab</a><a href="#guide">${icon('book')}Journal</a><a href="#account">${icon('user')}You</a></nav>`;}
function brand(){return `<a class="ll-brand" href="#lab"><img src="ns-character-hiking.webp" alt=""/><span>Nobody’s Simple<small>Life Lab</small></span></a>`;}
// The path and stone locations use the SAME 480 × 840 coordinate system.
// CSS scales the whole scene uniformly. No independently stretched SVG path.
export const STONE_POINTS=Object.freeze([{x:190,y:710},{x:292,y:575},{x:196,y:440},{x:294,y:305},{x:216,y:170}]);
export const TRAIL_PATH='M240 840 C240 790 190 765 190 710 S292 630 292 575 S196 495 196 440 S294 360 294 305 S216 225 216 170 S240 55 240 0';
function rings(stone,records){if(stone.lessons.length===1)return '';const n=stone.lessons.length;return `<svg class="ll-ring" viewBox="0 0 120 120" aria-hidden="true">${stone.lessons.map((l,i)=>`<circle cx="60" cy="60" r="51" pathLength="100" fill="none" stroke="${lessonDone(l,records)?'#68a638':'#fff9ed'}" stroke-width="6" stroke-dasharray="${100/n-3} ${100-100/n+3}" stroke-dashoffset="${-i*100/n}"/>`).join('')}</svg>`;}
function unitMarkup(t,u,records){
 const active=currentStone(t.id,records),done=u.lessons.every(l=>lessonDone(l,records)),next=curriculum[t.id][u.number],story=WORLD_STORIES[t.id],c=characterFor(t.id,next?.number||40),chapter=next&&(next.number-1)%8===0;
 return `<section class="ll-unit" id="ll-unit-${u.number}" aria-label="Unit ${u.number}: ${esc(u.title)}" data-unit="${u.number}" style="--boundary:${boundaryColor(t.id,u.number)}"><header class="ll-unit-break${chapter?' ll-chapter-break':''}"><span>Unit ${u.number}${done?' Complete':''}</span><h2><small>${next?`${chapter?'Chapter '+(Math.floor((next.number-1)/8)+1)+' · ':''}Unit ${next.number}`:'Your destination'}</small>${esc(next?.title||t.destination)}</h2><p class="ll-break-destination">⌖ Destination: ${t.destination}</p>${chapter?`<button class="ll-chapter-chat" data-encounter="${next.number}">${characterMarkup(t.id,next.number)}<span><strong>A quick chat with ${c.name}</strong><small>${esc(c.quote)}</small></span></button>`:''}<i aria-hidden="true">❧</i><i aria-hidden="true">❧</i></header><div class="ll-unit-scene">${environmentSVG(t.id,u.number)}<svg class="ll-road" viewBox="0 0 480 840" aria-hidden="true"><path d="${TRAIL_PATH}" fill="none" stroke="#d3b15f" stroke-width="81"/><path d="${TRAIL_PATH}" fill="none" stroke="#ffd97a" stroke-width="75"/><path d="${TRAIL_PATH}" fill="none" stroke="#ffedb0" stroke-width="48"/></svg>${u.stones.map((s,i)=>{const point=STONE_POINTS[i],state=stoneState(t.id,s,records),progress=stoneProgress(s,records);return `<div class="ll-stone-wrap ${state}" style="left:${point.x/4.8}%;top:${point.y/8.4}%;--stone:${colors[i<3?(i+u.number-1)%3:i]}" data-stone-position="${s.id}">${active?.id===s.id?'<img class="ll-nobody" src="ns-character-lantern.webp" alt="Nobody is here"/>':''}<button class="ll-stone ${state}" data-stone="${s.id}" data-unit="${u.number}" aria-label="Unit ${u.number}, stone ${s.number}: ${s.label}, ${progress.done} of ${progress.total} lessons completed, ${state.replace('-',' ')}" ${active?.id===s.id?'aria-current="step"':''}><span class="ll-stone-face">${icon(state==='locked'?'lock':state==='completed'?'check':stoneIcons[i])}</span>${rings(s,records)}</button>${active?.id===s.id?`<span class="ll-current-label">${progress.done?'Keep going':'Start here'}</span>`:''}</div>`;}).join('')}<button class="ll-encounter" data-encounter="${u.number}" aria-label="Talk to ${characterFor(t.id,u.number).name} in Unit ${u.number}">${characterMarkup(t.id,u.number)}<span>···</span></button><span class="ll-unit-status">${done?'✓ ':''}${esc(story.regions[u.number-1])} · Unit ${u.number}</span></div></section>`;
}
function trailSwitch(t){return `<label class="ll-switch-label"><span class="ll-sr-only">Change trail</span><select data-trail-switch aria-label="Change trail">${trails.map(w=>`<option value="${w.slug}" ${w.id===t.id?'selected':''}>${w.name}</option>`).join('')}</select></label>`;}
function trailPage(t,records){
 const count=trailProgress(t.id,records),story=WORLD_STORIES[t.id],current=currentStone(t.id,records),unit=current?Number(current.id.match(/unit-(\d+)/)[1]):40,phase=Math.floor((unit-1)/8),won=finaleDone(t.id,records);
 return `<div class="ll-trail-layout ll-world-journey" style="${theme(t)}"><aside class="ll-sidebar">${brand()}<div class="ll-story-card"><p class="ll-eyebrow">CHAPTER ${phase+1} · YOUR STORY</p><h2>${esc(story.regions[(phase*8)])}</h2><p>${esc(story.story[phase])}</p><button class="ll-secondary" data-story>Read the trail story</button></div><section class="ll-companion-list"><h2>Nobodys to help</h2>${story.characters.map(([name,quote],i)=>`<button data-encounter="${i*2+1}" class="ll-companion-button">${characterMarkup(t.id,i*2+1)}<span><strong>${name}</strong><small>${esc(quote)}</small></span></button>`).join('')}</section><button class="ll-secondary" data-games>Explore trail games</button><a class="ll-back" href="#guide">Open your Journal →</a></aside><section class="ll-map-column"><header class="ll-map-toolbar">${badge(t)}<div><h1 class="ll-sr-only">${t.name}</h1>${trailSwitch(t)}<p>→ ${t.destination}</p></div><button class="ll-continue" data-resume>Continue ${icon('check')}</button></header><div class="ll-map-summary"><span>${count} / 400 lessons · ${count*20+(won?200:0)} XP</span><label>Unit <select data-jump aria-label="Jump to unit">${curriculum[t.id].map(u=>`<option value="${u.number}" ${unit===u.number?'selected':''}>${u.number} · ${esc(u.title)}</option>`).join('')}</select></label><button class="ll-mobile-games" data-games aria-label="Explore trail games">✧</button></div><div class="ll-map" aria-label="${t.name}: all forty units"><section class="ll-finale" style="background:${boundaryColor(t.id,40)}">${finaleSVG(t.id)}<div class="ll-finale-card"><p class="ll-eyebrow">GRANDE FINALE · ${t.destination}</p><h2>${story.finale}</h2><p>${story.finaleGoal}</p><button class="ll-primary" data-finale>${won?'Revisit the finale':count===400?'Begin the finale':'Discover the finale'} →</button>${won?'<strong class="ll-finale-won">✓ Trail complete · 200 XP earned</strong>':''}</div></section>${[...curriculum[t.id]].reverse().map(u=>unitMarkup(t,u,records)).join('')}<section class="ll-trailhead"><h2>Unit 1 · ${esc(curriculum[t.id][0].title)}</h2><p>${esc(story.story[0])}</p><button class="ll-secondary" data-story>Meet your fellow travellers →</button></section></div></section>${bottomNav()}</div>`;
}

export function renderLifeLabV3(main,parts=[]){
 cleanupLifeLabV3();if(typeof document!=='undefined')document.body.classList.add('lifelab-active');
 let remembered='forest';try{remembered=storage()?.getItem('ns-lifelab-selected-trail')||'forest';}catch{}
 const t=parts.length?findTrail(parts[0]):findTrail(remembered)||trails[0];let records=readRecords(storage());
 main.innerHTML=`<div class="ll-app">${t?trailPage(t,records):''}</div>`;
 if(parts.length&&!t){main.innerHTML='<div class="ll-app ll-selector"><h1>That world isn’t available</h1><p>Choose one of the five Life Lab trails.</p><a href="#lab">Back to Life Lab</a></div>';return;}
 if(typeof window==='undefined')return;
 try{storage()?.setItem('ns-lifelab-selected-trail',t.slug);}catch{}
 const controller=new AbortController();let frame=0;dispose=()=>{controller.abort();cancelAnimationFrame(frame);};
 const find=(id)=>curriculum[t.id].flatMap(u=>u.stones).find(s=>s.id===id);
 const scrollCurrent=()=>{const current=currentStone(t.id,records);const target=current?main.querySelector(`[data-stone-position="${current.id}"]`):main.querySelector('.ll-finale');target?.scrollIntoView({block:'center',behavior:'instant'});};
 const refresh=()=>{
  const y=window.scrollY,previous=main.querySelector('.ll-nobody'),before=previous?.getBoundingClientRect(),previousStone=previous?.parentElement.dataset.stonePosition;
  records=readRecords(storage());main.innerHTML=`<div class="ll-app">${trailPage(t,records)}</div>`;window.scrollTo(0,y);
  const nobody=main.querySelector('.ll-nobody');
  if(before&&nobody&&previousStone!==nobody.parentElement.dataset.stonePosition&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const after=nobody.getBoundingClientRect(),dx=before.x-after.x,dy=before.y-after.y;
   nobody.animate([{transform:`translate(${dx}px,${dy}px) rotate(-4deg)`},{transform:`translate(${dx*.5}px,${dy*.5-12}px) rotate(4deg)`,offset:.5},{transform:'translate(0,0) rotate(0)'}],{duration:700,easing:'ease-in-out'});
  }
 };
 main.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||!t)return;if(b.hasAttribute('data-resume')){scrollCurrent();return;}if(b.hasAttribute('data-story')){openStory(t,b);return;}if(b.hasAttribute('data-games')){openGames(t,b);return;}if(b.hasAttribute('data-finale')){openFinale(t,records,b,()=>{refresh();return records;});return;}if(b.dataset.encounter){const u=curriculum[t.id][Number(b.dataset.encounter)-1];openEncounter(t,u,b);return;}if(b.dataset.stone){const s=find(b.dataset.stone),u=curriculum[t.id][Number(b.dataset.unit)-1];openStone(t,u,s,records,b,()=>{refresh();return records;});}},{signal:controller.signal});
 main.addEventListener('change',e=>{if(e.target.matches('[data-trail-switch]')){location.hash='#lab/'+e.target.value;return;}if(e.target.matches('[data-jump]'))main.querySelector(`[data-stone-position="${t.id}-unit-${e.target.value}-stone-1"]`)?.scrollIntoView({block:'center',behavior:'instant'});},{signal:controller.signal});
 window.addEventListener('storage',e=>{if(e.key==='ns-account-learning-v2'&&t)refresh();},{signal:controller.signal});
 if(t)frame=requestAnimationFrame(()=>{scrollCurrent();if(parts[1]){const u=curriculum[t.id].find(u=>u.lessons.some(l=>l.id===parts[1]||l.legacyId===parts[1]));const s=u?.stones.find(s=>s.lessons.some(l=>l.id===parts[1]||l.legacyId===parts[1]));if(s)openStone(t,u,s,records,main.querySelector(`[data-stone="${s.id}"]`),()=>{refresh();return records;});}});
}
function openDialog(origin,t){
 if(dialog)dialog.remove();focusOrigin=origin;
 dialog=document.createElement('dialog');dialog.className='ll-dialog';dialog.style.cssText=theme(t);dialog.setAttribute('aria-labelledby','ll-dialog-title');
 document.body.append(dialog);dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog();});dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog();});dialog.showModal();return dialog;
}
function closeDialog(){disposeGame();disposeGame=()=>{};if(dialog){dialog.close();dialog.remove();dialog=null;}if(focusOrigin?.isConnected)focusOrigin.focus();else document.querySelector('.ll-stone[aria-current="step"]')?.focus();}
const closeButton=()=>'<button class="ll-close" data-close aria-label="Close lesson">×</button>';
function setDialog(html,handler){disposeGame();disposeGame=()=>{};dialog.innerHTML=closeButton()+html;dialog.onclick=e=>{if(e.target===dialog||e.target.closest('[data-close]')){closeDialog();return;}handler?.(e);};dialog.onkeydown=e=>{const options=[...dialog.querySelectorAll('[data-option]:not(:disabled)')],index=options.indexOf(e.target);if(index<0)return;const direction={ArrowRight:1,ArrowDown:1,ArrowLeft:-1,ArrowUp:-1}[e.key];if(direction){e.preventDefault();options[(index+direction+options.length)%options.length].click();}};dialog.querySelector('h2')?.setAttribute('tabindex','-1');dialog.querySelector('h2')?.focus();}
function scene(t,pose='hiking'){return `<div class="ll-lesson-scene ll-atlas"><img src="${pose==='hiking'?'ns-character-hiking.webp':`ns-character-${pose}.webp`}" alt=""/></div>`;}
function openStory(t,origin){
 const story=WORLD_STORIES[t.id];openDialog(origin,t);
 setDialog(`<div class="ll-dialog-content"><p class="ll-eyebrow">${t.name} → ${t.destination}</p><h2 id="ll-dialog-title">Your trail story</h2><ol class="ll-story-sequence">${story.story.map((text,i)=>`<li><span>${i+1}</span><div>${i===4?finaleSVG(t.id):characterMarkup(t.id,i*2+1)}<p>${esc(text)}</p></div></li>`).join('')}</ol><button class="ll-primary" data-close>Back to the trail →</button></div>`);
}
function practiceGame(t,id,unit=1){
 const game=gameDefinition(id,t.id,unit);
 setDialog(`<div class="ll-dialog-content"><p class="ll-eyebrow">TRAIL PRACTICE · ${t.name}</p><h2 id="ll-dialog-title">${game.title}</h2>${gameArt(game.id,t.id)}<div data-game-root></div><p class="ll-save-note">Explore freely. Course progress is saved through your lesson stones.</p></div>`);
 disposeGame=mountGame(dialog.querySelector('[data-game-root]'),game,{onComplete:()=>setDialog(`<div class="ll-dialog-content ll-practice-complete">${characterMarkup(t.id,unit)}<h2 id="ll-dialog-title">Practice complete!</h2><p>${esc(game.objective)}</p><button class="ll-primary" data-close>Back to the trail ✓</button></div>`)});
}
function openGames(t,origin){
 openDialog(origin,t);const games=[...WORLD_STORIES[t.id].games,'capstone-path'];
 setDialog(`<div class="ll-dialog-content"><p class="ll-eyebrow">GAMES YOU PLAY HERE</p><h2 id="ll-dialog-title">${t.name} games</h2><div class="ll-game-directory">${games.map((id,i)=>`<button class="ll-game-directory-card" data-play-game="${id}">${gameArt(id,t.id)}<span><strong>${GAME_LABELS[id][0]}</strong><small>${GAME_LABELS[id][1]}</small></span><b>›</b></button>`).join('')}</div></div>`,e=>{const b=e.target.closest('[data-play-game]');if(b)practiceGame(t,b.dataset.playGame);});
}
function openEncounter(t,u,origin){
 const c=characterFor(t.id,u.number);openDialog(origin,t);
 setDialog(`<div class="ll-dialog-content"><p class="ll-eyebrow">NOBODYS TO HELP · ${esc(WORLD_STORIES[t.id].regions[u.number-1])}</p><h2 id="ll-dialog-title">A quick chat with ${c.name}</h2><div class="ll-character-conversation">${characterMarkup(t.id,u.number)}<blockquote>${esc(c.quote)}</blockquote></div><p>${esc(u.principle)}</p><p>Help ${c.name} explore a different next step.</p><button class="ll-primary" data-help-character>Try it together →</button><button class="ll-secondary" data-close>Just listen for now</button></div>`,e=>{if(e.target.closest('[data-help-character]'))practiceGame(t,gameFor(t.id,u.number,1),u.number);});
}
function openFinale(t,records,origin,onSave){
 const story=WORLD_STORIES[t.id],review=finaleDone(t.id,records),ready=trailProgress(t.id,records)===400;openDialog(origin,t);
 const queue=[...story.games.slice(0,4),'capstone-path'];let round=0;
 function play(){const game=gameDefinition(queue[round],t.id,40);setDialog(`<div class="ll-dialog-content"><p class="ll-eyebrow">${story.finale} · ${round+1} / ${queue.length}</p><h2 id="ll-dialog-title">${game.title}</h2><div data-game-root></div></div>`);disposeGame=mountGame(dialog.querySelector('[data-game-root]'),game,{onComplete:()=>{round++;if(round<queue.length)play();else finish();}});}
 function finish(error=''){setDialog(`<div class="ll-finale-complete">${finaleSVG(t.id)}<div class="ll-dialog-content"><p class="ll-ribbon">${story.finale} complete!</p><h2 id="ll-dialog-title">You reached ${t.destination}</h2><p>${story.finaleGoal}</p>${review?'':'<span class="ll-xp">◇ +200 XP</span>'}${error?`<p class="ll-feedback" role="alert">${esc(error)}</p>`:''}<button class="ll-primary" data-claim-finale>${review?'Return to the trail':'Claim your trail reward'} ✓</button></div></div>`,e=>{if(e.target.closest('[data-claim-finale]')){if(!review){const saved=completeFinale(t.id,storage());if(!saved.ok){finish(saved.error);return;}onSave();}closeDialog();}});}
 setDialog(`<div class="ll-finale-preview">${finaleSVG(t.id)}<div class="ll-dialog-content"><p class="ll-eyebrow">GRANDE FINALE</p><h2 id="ll-dialog-title">${story.finale}</h2><p>${story.finaleGoal}</p>${ready?`<p>Five challenges bring the whole journey together.</p><button class="ll-primary" data-start-finale>${review?'Revisit':'Begin the finale'} →</button>`:'<p class="ll-neutral">Complete all forty units to begin this final adventure. Your destination is waiting.</p><button class="ll-primary" data-close>Back to the trail</button>'}</div></div>`,e=>{if(e.target.closest('[data-start-finale]')&&ready)play();});
}

function openStone(t,u,s,records,origin,onSave){
 openDialog(origin,t);let record=records;let lesson=null;let questions=[];let questionIndex=0;let selected=null;let checked=false;let stage='preview';let reflection='';let saved=false;let reviewing=false;let activeGame=null;
 const progress=()=>stoneProgress(s,record);
 function preview(){
  stage='preview';const p=progress(),locked=stoneState(t.id,s,record)==='locked';
  if(locked){setDialog(`<div class="ll-dialog-content ll-locked"><span>${icon('lock')}</span><h2 id="ll-dialog-title">Locked Stone</h2><p>Finish the earlier stones ${u.number>1?'and units ':''}first.</p><p class="ll-neutral">Continue from your current stone to unlock this one.</p><button class="ll-primary" data-close>OK ✓</button></div>`);return;}
  const title=s.number===4?`${u.title} Mission`:s.number===5?'Try It in Real Life':u.title;
  setDialog(`<div class="ll-preview"><header>${badge(t)}<div><strong>${t.name} Trail</strong><small>Unit ${u.number} · Stone ${s.number}</small></div></header><span class="ll-count">${icon('book')} ${p.done} / ${p.total} Lessons</span><h2 id="ll-dialog-title">${esc(title)}</h2><p>${esc(s.number===4?'Bring the unit together through three short steps.':s.number===5?u.experiment:u.principle)}</p>${s.number===4?'<ul class="ll-mission-meta"><li>3 steps · observe, plan, reflect</li><li>Builds on this unit’s lessons</li><li>Earn a unit mission badge</li></ul>':''}${p.complete?`<p class="ll-success">✓ Completed! You can revisit these lessons anytime.</p><div class="ll-review-list">${s.lessons.map(l=>`<button class="ll-secondary" data-lesson="${l.id}">✓ ${esc(l.type==='application'?'Try It in Real Life':GAME_LABELS[gameFor(t.id,u.number,l.number)][0])} <span>Review ›</span></button>`).join('')}</div>`:`<button class="ll-primary" data-start>${s.number===4?'Start Mission':s.number===5?'Start Application':'Start Lesson'} ›</button>${p.done?`<div class="ll-review-list">${s.lessons.filter(l=>lessonDone(l,record)).map(l=>`<button class="ll-secondary" data-lesson="${l.id}">✓ ${esc(l.type==='application'?'Try It in Real Life':GAME_LABELS[gameFor(t.id,u.number,l.number)][0])} <span>Review ›</span></button>`).join('')}</div>`:''}`}</div>`,handle);
 }
 function start(l){lesson=l;activeGame=l.type==='application'?null:gameDefinition(gameFor(t.id,u.number,l.number),t.id,u.number);reviewing=lessonDone(l,record);questions=lessonQuestions(u,l);questionIndex=0;selected=null;checked=false;reflection='';saved=false;stage='intro';render();}
 function render(error=''){
  const review=reviewing;
  if(stage==='intro')setDialog(`<div class="ll-intro">${scene(t)}<div class="ll-dialog-content"><div class="ll-lesson-meta"><span>Lesson ${s.lessons.findIndex(l=>l.id===lesson.id)+1} of ${s.lessons.length}</span><span class="ll-xp">◇ ${review?'Review':'+20 XP'}</span></div><div class="ll-lesson-dots" aria-label="Stone lesson progress">${s.lessons.map(l=>`<span class="${lessonDone(l,record)?'is-done':l.id===lesson.id?'is-current':''}">${lessonDone(l,record)?'✓':'○'}</span>`).join('<i></i>')}</div><h2 id="ll-dialog-title">${esc(activeGame?.title||'Try It in Real Life')}</h2><div class="ll-game-goal"><strong>Objective</strong><p>${esc(activeGame?.objective||u.experiment)}</p></div><div class="ll-character-conversation">${characterMarkup(t.id,u.number)}<blockquote>${esc(u.principle)}</blockquote></div><button class="ll-primary" data-begin>Begin →</button></div></div>`,handle);
  if(stage==='game'){
   setDialog(`<div class="ll-dialog-content"><div class="ll-lesson-meta"><span>Unit ${u.number} · Lesson ${lesson.number}</span><span class="ll-xp">◇ ${review?'Review':'+20 XP'}</span></div><h2 id="ll-dialog-title">${esc(activeGame.title)}</h2>${gameArt(activeGame.id,t.id)}<div data-game-root></div></div>`,handle);
   disposeGame=mountGame(dialog.querySelector('[data-game-root]'),activeGame,{onComplete:()=>{stage=questions.length?'question':'complete';render();}});
  }
  if(stage==='question'){
   const q=questions[questionIndex],right=selected===q.correct;
   setDialog(`<div class="ll-dialog-content"><header class="ll-lesson-title"><span>❧</span><div><h2 id="ll-dialog-title">${esc(lesson.type==='capstone'?['Observe the Situation','Make a Plan','Reflect and Refine'][questionIndex]:u.title)}</h2><small>${lesson.type==='capstone'?'Mission · ':''}Step ${questionIndex+1} / ${questions.length}</small></div><span>❧</span></header><p class="ll-question">${esc(q.prompt)}</p><div class="ll-choices" role="radiogroup" aria-label="Choose an answer">${q.options.map((o,i)=>`<button class="ll-choice${selected===i?' is-selected':''}" role="radio" aria-checked="${selected===i}" data-option="${i}" ${checked?'disabled':''}><span>${selected===i?'●':'○'}</span>${esc(o)}</button>`).join('')}</div>${checked?`<div class="${right?'ll-success':'ll-feedback'}" role="status"><strong>${right?'✓ That’s right!':'Not quite. Let’s look again.'}</strong><p>${esc(right?q.why:`${q.options[q.correct]} ${q.why}`)}</p></div>`:''}<button class="ll-primary" data-${checked?'next':'check'} ${selected===null?'disabled':''}>${checked?'Continue ›':'Check Answer'}</button></div>`,handle);
  }
  if(stage==='application'){
   setDialog(`<div class="ll-intro">${scene(t,'writing')}<div class="ll-dialog-content"><p class="ll-eyebrow">APPLICATION LESSON</p><h2 id="ll-dialog-title">Try It in Real Life</h2><p>${esc(u.experiment)}</p><label class="ll-reflection-label" for="ll-reflection">Write a brief plan or reflection. You can use a fictional example.</label><textarea id="ll-reflection" maxlength="2000" placeholder="One small thing I could try is…">${esc(reflection)}</textarea><p class="ll-save-note">Your words stay in this open lesson and are not saved. Only completion is recorded.</p>${error?`<p role="alert" class="ll-feedback">${esc(error)}</p>`:''}<button class="ll-primary" data-apply ${reflection.trim()?'':'disabled'}>Complete ✓</button></div></div>`,handle);
   dialog.querySelector('textarea').oninput=e=>{reflection=e.target.value;dialog.querySelector('[data-apply]').disabled=!reflection.trim();};
  }
  if(stage==='complete'){
   setDialog(`<div class="ll-completion">${scene(t,'star')}<div class="ll-dialog-content"><span class="ll-trophy">${icon(lesson.type==='capstone'?'capstone':'star')}</span><p class="ll-ribbon">${lesson.type==='application'?'Application Complete!':lesson.type==='capstone'?'Mission Complete!':'Lesson Complete!'}</p><h2 id="ll-dialog-title">${esc(activeGame?.title||lesson.title)}</h2><p>${lesson.type==='application'?'You’ve made a plan to try in real life.':lesson.type==='capstone'?'You brought the unit’s ideas together.':'Another small step toward a wider view.'}</p>${error?`<p role="alert" class="ll-feedback">${esc(error)}</p>`:''}<button class="ll-primary" data-done>${lesson.type==='capstone'&&!review?'Claim Badge':review?'Back to Review':'Done'} ✓</button></div></div>`,handle);
  }
 }
 function save(){if(saved||lessonDone(lesson,record))return true;const result=completeLesson(lesson.id,storage());if(!result.ok){render(result.error);return false;}saved=true;record=onSave();return true;}
 function handle(e){const b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-start'))start(s.lessons.find(l=>!lessonDone(l,record)));
  else if(b.dataset.lesson)start(s.lessons.find(l=>l.id===b.dataset.lesson));
  else if(b.hasAttribute('data-begin')){stage=lesson.type==='application'?'application':'game';render();}
  else if(b.hasAttribute('data-option')&&!checked){selected=Number(b.dataset.option);render();dialog.querySelector(`[data-option="${selected}"]`)?.focus();}
  else if(b.hasAttribute('data-check')&&selected!==null){checked=true;render();}
  else if(b.hasAttribute('data-next')&&checked){questionIndex++;selected=null;checked=false;if(questionIndex>=questions.length)stage='complete';render();}
  else if(b.hasAttribute('data-apply')&&reflection.trim()){if(save()){stage='complete';render();}}
  else if(b.hasAttribute('data-done')&&(stage==='complete')){if(save())preview();}
 }
 preview();
}



