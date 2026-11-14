import {escapeHTML as esc, safeImage} from './core.mjs';
import {renderWisbody as renderWisbodyUI} from './wisbody-ui.mjs';
import {tools as toolCatalogue} from './tool-catalog.mjs';
import {setupHomeUpdates} from './ns-home-updates.mjs';
import {renderCultureAtlas} from './ns-cultural-atlas.mjs';

export const DRAFT_KEY='ns-account-tool-drafts-v2', QUOTE_KEY='ns-learn-quote-notes-v1';
let account=()=>({preferences:window.nsAccountPreferences||{},syncKeys:[],locked:false});
export function configureStrategy(getState){account=getState;}
export const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key));return v??fallback;}catch{return fallback;}};
export function homeGreeting(now=new Date(),nickname=''){
 const hour=now.getHours();
 const salutation=hour>=5&&hour<11?'Good morning':hour===11?'Good day':hour>=12&&hour<17?'Good afternoon':hour>=17&&hour<22?'Good evening':'Goodnight';
 const name=String(nickname||'').trim().slice(0,50).replace(/[<>]/g,'').split(/\s+/)[0];
 return salutation+(name?', '+name:'')+'.';
}
if(typeof window!=='undefined'){
 const refreshGreeting=()=>{
  const node=document.querySelector('#main .ns-home-refined .ns-home-greeting');
  if(node)node.textContent=homeGreeting(new Date(),account().nickname);
 };
 window.addEventListener('ns:account-profile-change',refreshGreeting);
 window.addEventListener('focus',refreshGreeting);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refreshGreeting();});
}
function write(key,value){if(account().locked)throw Error('Unlock your saved work in Account first.');localStorage.setItem(key,JSON.stringify(value));}
function storageNote(key){return account().syncKeys?.includes(key)?'Saved in this browser and queued for your selected account sync. Check Account for sync status.':'Saved in this browser. Cross-device syncing is optional in Account.';}
function download(name,value){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const status=(root,text)=>{const el=root.querySelector('[data-status]');if(el)el.textContent=text;};
export function renderStrategyHome(root,posts=[],rail='',options={}){
 root.onclick=null;
 // Stage 2 gives the original decision aid its own route. Its questions,
 // selected options and recommendation calculations still live in renderHelp.
 if(options.wizardOnly){
  root.innerHTML=`<div class="ns-wizard-page"><a class="ns-home-back" href="#home">← Back to Home</a><header class="ns-wizard-intro"><p class="ns-home-eyebrow">FIND YOUR NEXT STEP</p><h1>Let's work out what might help.</h1><p>Three short questions. No account needed, and you can change your answers.</p></header><section class="strategy-console ns-wizard-console" aria-label="Help me choose"><div id="home-navigation-console"></div></section><aside class="ns-wizard-options"><p>Already know what you need?</p><a href="#investigate">Investigate and learn about a problem →</a><a href="#tools">Browse all tools →</a><a href="#guide">Open my Field Guide →</a><a href="#support">Get help from a person →</a></aside></div>`;
  options.renderConsole?.(root.querySelector('#home-navigation-console'));
  return;
 }
 const state=account(),locked=Boolean(state.locked),prefs=state.preferences||{};
 const savedMaps=locked?[]:read('ns-personal-maps-v1',[]);
 const drafts=locked?{}:read(DRAFT_KEY,{});
 const learning=locked||!prefs.trackLearning?{}:read('ns-account-learning-v2',{});
 const favourites=locked?[]:read('ns-tool-favourites-v1',[]);
 const mapCount=Array.isArray(savedMaps)?savedMaps.length:0;
 const draftEntries=drafts&&typeof drafts==='object'?Object.entries(drafts):[];
 const draftCount=draftEntries.length;
 const favouriteCount=Array.isArray(favourites)?favourites.length:0;
 const published=new Map(posts.filter(p=>p?.id&&['education','lesson','video'].includes(p.type)).map(p=>[String(p.id),p]));
 const learningEntries=Object.entries(learning||{}).filter(([id])=>published.has(id));
 const savedInteractive=Object.entries(learning||{}).filter(([id,item])=>id==='ns-skill:observation-or-story'&&item?.completed===true);
 const lessonCount=learningEntries.filter(([,item])=>item?.completed).length;
 const nextLesson=learningEntries.filter(([,item])=>!item?.completed&&item?.lastOpened).sort(([,a],[,b])=>String(b.lastOpened).localeCompare(String(a.lastOpened)))[0];
 const nextDraft=draftEntries.filter(([hash,item])=>/^#[a-z0-9-]+(?:\/[a-z0-9-]+)?$/i.test(hash)&&Array.isArray(item?.fields)&&item.fields.length).sort(([,a],[,b])=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')))[0];
 const hasActivity=mapCount+draftCount+lessonCount+favouriteCount+Number(Boolean(nextLesson))+savedInteractive.length>0;
 const counts=[mapCount&&`${mapCount} saved map${mapCount===1?'':'s'}`,draftCount&&`${draftCount} saved draft${draftCount===1?'':'s'}`,favouriteCount&&`${favouriteCount} pinned tool${favouriteCount===1?'':'s'}`,lessonCount&&`${lessonCount} completed learning item${lessonCount===1?'':'s'}`].filter(Boolean).join(' · ');
 const primary=nextDraft?{href:nextDraft[0],label:'Resume activity'}:nextLesson?{href:`#post/${encodeURIComponent(nextLesson[0])}`,label:'Continue learning'}:savedInteractive.length?{href:'#learn/lesson/observation-or-story',label:'Review your lesson'}:mapCount?{href:'#account/maps',label:'Open My Maps'}:favouriteCount?{href:'#tools',label:'Find my pinned tools'}:{href:'#account',label:'Open your space'};
 const resumeTitle=nextDraft?String(nextDraft[1]?.title||'Resume your activity'):nextLesson?String(published.get(nextLesson[0])?.title||'Continue learning'):savedInteractive.length?'What happened—and what did I assume?':mapCount?'My Maps':favouriteCount?'Your pinned tools':'Your saved things';
 const resumeDetail=nextDraft?'Unfinished activity':nextLesson?'Continue a published learning item':savedInteractive.length?'Saved learning · Review':mapCount?`${mapCount} saved map${mapCount===1?'':'s'}`:counts;
 const resume=locked?`<section class="ns-home-saved ns-home-saved--locked" aria-labelledby="home-resume-title"><div class="ns-home-saved__icon" aria-hidden="true">✦</div><div><h2 id="home-resume-title">Your saved work is locked</h2><p>Unlock your account to see where you left off.</p></div><a href="#account">Open account <span aria-hidden="true">→</span></a></section>`:hasActivity?`<section class="ns-home-resume" aria-labelledby="home-resume-title"><h2 id="home-resume-title">Continue where you left off</h2><a class="ns-home-resume__card" href="${esc(primary.href)}"><span class="ns-home-resume__art" aria-hidden="true">✧</span><span class="ns-home-resume__content"><strong>${esc(resumeTitle)}</strong><small>${esc(resumeDetail)}</small></span><span class="ns-home-resume__play" aria-hidden="true">▶</span></a></section>`:'';
 // Only describe the existing My Maps area here. A new Field Guide is not
 // presented as available until its separate, tested storage stage ships.
 root.innerHTML=`<div class="wrap strategy-home ns-home-v2 ns-home-refined">
  <section class="ns-home-hero" aria-labelledby="ns-home-title">
   <div class="ns-home-hero__copy"><h1 id="ns-home-title"><span class="ns-home-greeting">${esc(homeGreeting(new Date(),state.nickname))}</span><span>What would help you?</span></h1></div>
   <div class="ns-home-hero__art" aria-hidden="true"><img class="ns-home-hero__land" src="ns-landscape-path.webp" alt="" width="940" height="520"/><span class="ns-home-hero__sun"></span><img class="ns-home-hero__mascot" src="ns-character-sitting.webp" alt="" width="230" height="230"/></div>
   <div class="ns-home-actions"><a class="ns-home-primary" href="#navigate">Find my next step <span aria-hidden="true">→</span></a><a class="ns-home-compass" href="#compass"><img src="ns-character-compass.webp" alt="" width="35" height="36"><span><strong>Emotion Compass</strong><small>Explore the feeling without needing to put it into words</small></span><span aria-hidden="true">→</span></a></div>
  </section>
  ${resume}
  <section class="ns-home-wisbody" aria-label="A moment with Wisbody"><div data-ns-wisbody-full></div><a class="ns-home-wisbody__link" href="#wisbody">Open Wisbody's reflections <span aria-hidden="true">→</span></a></section>
  <section id="home-latest" class="home-latest ns-home-latest" aria-labelledby="home-latest-title"><div class="home-latest-header"><div><p class="ns-home-eyebrow">FROM NOBODY'S SIMPLE</p><h2 id="home-latest-title">Latest from Nobody's Simple</h2><p>News, writing and resources published by the project.</p></div><div class="home-latest-controls"><button type="button" data-latest-prev aria-label="Previous item">←</button><span data-latest-position aria-live="off"></span><button type="button" data-latest-next aria-label="Next item">→</button></div></div><div class="home-latest-track" tabindex="0" aria-label="Recently published content; scroll sideways"></div><div class="home-latest-links"><a href="#learn">More from Nobody's Simple →</a></div></section>
  <section class="ns-home-shortcuts" aria-label="More ways to explore"><a class="ns-home-shortcut" href="#community"><span class="ns-home-shortcut__icon" aria-hidden="true">♡</span><span><strong>Share feedback</strong><small>Help shape the future of Nobody's Simple</small></span><span class="ns-home-shortcut__arrow" aria-hidden="true">→</span></a></section>
   <div id="ns-home-culture-map" aria-label="Cultural psychology world atlas"></div>
 </div>`;
 renderLatest(root.querySelector('#home-latest'),posts);
 renderWisbody(root.querySelector('[data-ns-wisbody-full]'),{compact:true});
 setupHomeUpdates(posts);
 renderCultureAtlas(root.querySelector('#ns-home-culture-map'));
}

function renderLatest(section,posts){
 const track=section.querySelector('.home-latest-track');
 const label=section.querySelector('[data-latest-position]');
 const previous=section.querySelector('[data-latest-prev]');
 const next=section.querySelector('[data-latest-next]');
 const types={blog:'Blog',video:'Video',audio:'Audio',story:'Story',debate:'Debate',education:'Article',lesson:'Lesson',resource:'Resource'};
 const published=posts.filter(p=>p?.id&&p?.title&&p.status==='published'&&p.type!=='announcement').slice(0,5)
  .map(p=>({kind:'project',time:Date.parse(p.publishedAt||p.updatedAt||'')||0,post:p}));
 const summary=value=>{const text=String(value||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();return text.length>145?`${text.slice(0,142).trimEnd()}…`:text;};
 let items=published;
 function updatePosition(){
  const cards=[...track.children];const origin=cards[0]?.offsetLeft||0;const closest=cards.reduce((best,card,index)=>Math.abs(card.offsetLeft-origin-track.scrollLeft)<Math.abs(cards[best].offsetLeft-origin-track.scrollLeft)?index:best,0);
  label.textContent=cards.length?`${closest+1} / ${cards.length}`:'';
  previous.disabled=cards.length<2||closest===0;
  next.disabled=cards.length<2||closest===cards.length-1;
 }
 function paint(){
  if(!section.isConnected)return;
  track.innerHTML=items.length?items.map(({post:p})=>
   `<a class="home-latest-card" href="#post/${encodeURIComponent(p.id)}"><span class="home-latest-badge">${esc(types[p.type]||'From Nobody’s Simple')}</span><span class="home-latest-image">${safeImage(p.thumbnail)?`<img src="${esc(p.thumbnail)}" alt="" loading="lazy">`:'<img src="ns-character-reading.webp" alt="" loading="lazy">'}</span><strong>${esc(p.title)}</strong><span class="home-latest-summary">${esc(summary(p.excerpt||p.intro))}</span><small>${p.type==='video'?'Watch':'Explore'} →</small></a>`).join('')
   :'<div class="home-latest-empty"><p>New posts will appear here as they are published.</p><a href="#learn">Explore Learn →</a></div>';
  track.scrollLeft=0;updatePosition();
 }
 const scrollOne=direction=>track.scrollBy({left:direction*((track.firstElementChild?.getBoundingClientRect().width||280)+14),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 previous.addEventListener('click',()=>scrollOne(-1));
 next.addEventListener('click',()=>scrollOne(1));
 track.addEventListener('scroll',()=>requestAnimationFrame(updatePosition),{passive:true});
 paint();

}
// Keep the public renderer signature used by Home and Learn.
export function renderWisbody(root,options={}){return renderWisbodyUI(root,options,account);}
