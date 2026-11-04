import {escapeHTML as esc, safeImage} from './core.mjs';
import {quoteDeckExtended as quotes} from './quote-content.mjs';
import {tools as toolCatalogue} from './tool-catalog.mjs';

export const DRAFT_KEY='ns-account-tool-drafts-v2', QUOTE_KEY='ns-learn-quote-notes-v1';
let account=()=>({preferences:window.nsAccountPreferences||{},syncKeys:[],locked:false});
export function configureStrategy(getState){account=getState;}
export const read=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key));return v??fallback;}catch{return fallback;}};
function write(key,value){if(account().locked)throw Error('Unlock your saved work in Account first.');localStorage.setItem(key,JSON.stringify(value));}
function storageNote(key){return account().syncKeys?.includes(key)?'Saved in this browser and queued for your selected account sync. Check Account for sync status.':'Saved in this browser. Cross-device syncing is optional in Account.';}
function download(name,value){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
const status=(root,text)=>{const el=root.querySelector('[data-status]');if(el)el.textContent=text;};
export function renderStrategyHome(root,posts=[],rail='',options={}){
 root.onclick=null;
 const state=account(),locked=Boolean(state.locked),prefs=state.preferences||{};
 const savedMaps=locked?[]:read('ns-personal-maps-v1',[]);
 const drafts=locked?{}:read(DRAFT_KEY,{});
 const learning=locked||!prefs.trackLearning?{}:read('ns-account-learning-v2',{});
 const favourites=locked?[]:read('ns-tool-favourites-v1',[]);
 const mapCount=Array.isArray(savedMaps)?savedMaps.length:0;
 const draftCount=drafts&&typeof drafts==='object'?Object.keys(drafts).length:0;
 const favouriteCount=Array.isArray(favourites)?favourites.length:0;
 const published=new Map(posts.filter(p=>p?.id&&['education','lesson','video'].includes(p.type)).map(p=>[String(p.id),p]));
 const learningEntries=Object.entries(learning||{}).filter(([id])=>published.has(id));
 const lessonCount=learningEntries.filter(([,item])=>item?.completed).length;
 const nextLesson=learningEntries.filter(([,item])=>!item?.completed&&item?.lastOpened).sort(([,a],[,b])=>String(b.lastOpened).localeCompare(String(a.lastOpened)))[0];
 const nextDraft=Object.entries(drafts||{}).filter(([hash,item])=>/^#[a-z0-9-]+(?:\/[a-z0-9-]+)?$/i.test(hash)&&item?.fields?.length).sort(([,a],[,b])=>String(b.updatedAt||'').localeCompare(String(a.updatedAt||'')))[0];
 const hasActivity=mapCount+draftCount+lessonCount+favouriteCount+Number(Boolean(nextLesson))>0;
 const counts=[mapCount&&`${mapCount} saved map${mapCount===1?'':'s'}`,draftCount&&`${draftCount} draft${draftCount===1?'':'s'}`,favouriteCount&&`${favouriteCount} pinned tool${favouriteCount===1?'':'s'}`,lessonCount&&`${lessonCount} completed learning piece${lessonCount===1?'':'s'}`].filter(Boolean).join(' · ');
 const primary=nextDraft?{href:nextDraft[0],label:'Resume activity →'}:nextLesson?{href:`#post/${encodeURIComponent(nextLesson[0])}`,label:'Continue learning →'}:mapCount?{href:'#account/maps',label:'Open My Maps →'}:favouriteCount?{href:'#tools',label:'Pinned tools →'}:{href:'#learn',label:'Open Learn →'};
 const pinned=Array.isArray(favourites)?favourites.map(id=>toolCatalogue.find(item=>item.id===id)).filter(Boolean):[];
 const revisit=prefs.personalise&&pinned.length?pinned[Math.floor(Date.now()/86400000)%pinned.length]:null;
 const revisitLink=revisit?`<p class="home-resume-revisit">Useful today · <a href="${esc(revisit.href||`#tool/${encodeURIComponent(revisit.id)}`)}">Revisit ${esc(revisit.title)} →</a></p>`:'';
 const resume=locked?`<section class="home-resume-card" aria-labelledby="home-resume-title"><span class="home-resume-icon" aria-hidden="true">↗</span><div><p class="eyebrow">Your space</p><h2 id="home-resume-title">Saved work is hidden.</h2><p>Confirm your identity in You to open it.</p></div><a class="button secondary" href="#account">Open You →</a></section>`:hasActivity?`<section class="home-resume-card" aria-labelledby="home-resume-title"><span class="home-resume-icon" aria-hidden="true">↗</span><div><p class="eyebrow">Your space</p><h2 id="home-resume-title">Continue when ready.</h2><p>${counts||'A learning page is ready to revisit.'}</p>${revisitLink}</div><div class="home-resume-actions"><a class="button" href="${esc(primary.href)}">${primary.label}</a>${state.signedIn?'<a href="#account">All saved work →</a>':''}</div></section>`:`<section class="home-resume-card home-first-visit" aria-labelledby="home-resume-title"><span class="home-resume-icon" aria-hidden="true">✳</span><div><p class="eyebrow">Start here</p><h2 id="home-resume-title">Keep what helps.</h2><p>Save a map or pin a tool when you want to come back to it. Nothing needs to be saved to use the app.</p></div><a class="button secondary" href="#tools">Browse tools →</a></section>`;
 root.innerHTML=`<div class="wrap strategy-home strategy-dashboard"><section class="home-dashboard-intro" aria-label="Nobody’s Simple"><img src="logo.png" alt="" width="48" height="48"><div><p class="eyebrow">Nobody’s Simple · psychology for real life</p><h1>${hasActivity?'Welcome back.':'A useful next step.'}</h1><p>${hasActivity?'Start where you are, or return to something you chose to keep.':'Notice what is happening, then choose one useful thing to try.'}</p></div></section><section class="strategy-console" aria-label="Help me choose"><div class="strategy-console-illustration" aria-hidden="true"></div><div id="home-navigation-console"></div><nav class="strategy-shortcuts" aria-label="More starting points"><a href="#account/maps">My Maps →</a><a href="#tools">Browse tools →</a><a href="#support">Need a person? Get help →</a></nav></section>${resume}<section id="home-latest" class="home-latest" aria-labelledby="home-latest-title"><div class="home-latest-header"><div><p class="eyebrow">Latest</p><h2 id="home-latest-title">Recent from Nobody’s Simple</h2><p>New writing, videos and conversations from the community.</p></div><div class="home-latest-controls"><button type="button" data-latest-prev aria-label="Previous recent item">←</button><span data-latest-position aria-live="off"></span><button type="button" data-latest-next aria-label="Next recent item">→</button></div></div><div class="home-latest-track" tabindex="0" aria-label="Recent content; swipe or scroll sideways"></div><div class="home-latest-links"><a href="#learn">Explore Learn →</a><a href="#discussion">All discussions →</a></div></section><div id="home-wisbody"></div><section class="home-project-footer" aria-label="Support Nobody’s Simple"><img src="ns-character-star.webp" alt="" width="48" height="48"><div><b>Help keep the project open.</b><small>Tips support the time and tools behind Nobody’s Simple.</small></div><a href="https://ko-fi.com/nobodyssimple" target="_blank" rel="noopener noreferrer">Support on Ko-fi ↗</a></section></div>`;
 // The main decision aid is the first focusable content on mobile; desktop keeps the compact orientation card first.
 const home=root.querySelector('.strategy-home');
 const console=home?.querySelector('.strategy-console');
 const mobileLayout=window.matchMedia('(max-width: 900px)');
 const positionConsole=()=>{
  if(!home?.isConnected||!console)return;
  if(mobileLayout.matches)home.prepend(console);
  else home.querySelector('.home-dashboard-intro')?.after(console);
 };
 positionConsole();
 const onLayoutChange=()=>{if(!home?.isConnected){mobileLayout.removeEventListener('change',onLayoutChange);return;}positionConsole();};
 mobileLayout.addEventListener('change',onLayoutChange);
 options.renderConsole?.(root.querySelector('#home-navigation-console'));
 renderLatest(root.querySelector('#home-latest'),posts,options.loadDiscussions);
 renderWisbody(root.querySelector('#home-wisbody'));
}
function renderLatest(section,posts,loadDiscussions){
 const track=section.querySelector('.home-latest-track');
 const label=section.querySelector('[data-latest-position]');
 const previous=section.querySelector('[data-latest-prev]');
 const next=section.querySelector('[data-latest-next]');
 const types={blog:'Blog',video:'Video',audio:'Audio',story:'Story',debate:'Debate',education:'Article',lesson:'Lesson',resource:'Resource'};
 const published=posts.filter(p=>p?.id&&p?.title&&p.type!=='announcement').slice(0,5)
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
  track.innerHTML=items.length?items.map(({kind,post:p})=>kind==='discussion'
   ?`<a class="home-latest-card discussion" href="#discussion/${encodeURIComponent(p.id)}"><span class="home-latest-badge">Community discussion</span><span class="home-latest-image" aria-hidden="true"><img src="ns-character-friends.webp" alt="" loading="lazy"></span><strong>${esc(p.title)}</strong><span class="home-latest-summary">${esc(summary(p.body))}</span><small>By ${esc(p.nickname||'a community member')} · Join the conversation →</small></a>`
   :`<a class="home-latest-card" href="#post/${encodeURIComponent(p.id)}"><span class="home-latest-badge">${esc(types[p.type]||'From Nobody’s Simple')}</span><span class="home-latest-image">${safeImage(p.thumbnail)?`<img src="${esc(p.thumbnail)}" alt="" loading="lazy">`:'<img src="ns-character-reading.webp" alt="" loading="lazy">'}</span><strong>${esc(p.title)}</strong><span class="home-latest-summary">${esc(summary(p.excerpt||p.intro))}</span><small>${p.type==='video'?'Watch':'Explore'} →</small></a>`).join('')
   :'<div class="home-latest-empty"><p>New posts will appear here as they are published.</p><a href="#learn">Explore Learn →</a><a href="#discussion">Open the discussion board →</a></div>';
  track.scrollLeft=0;updatePosition();
 }
 const scrollOne=direction=>track.scrollBy({left:direction*((track.firstElementChild?.getBoundingClientRect().width||280)+14),behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
 previous.addEventListener('click',()=>scrollOne(-1));
 next.addEventListener('click',()=>scrollOne(1));
 track.addEventListener('scroll',()=>requestAnimationFrame(updatePosition),{passive:true});
 paint();
 if(loadDiscussions)Promise.resolve().then(loadDiscussions).then(discussions=>{
  if(!section.isConnected)return;
  const board=(Array.isArray(discussions)?discussions:[]).filter(p=>p?.id&&p?.title&&p.status==='published').slice(0,5)
   .map(p=>({kind:'discussion',time:p.createdAt?.toMillis?.()||0,post:p}));
  items=[...published,...board].sort((a,b)=>b.time-a.time);paint();
 }).catch(()=>{if(section.isConnected&&!published.length){track.innerHTML='<div class="home-latest-empty"><p>Recent posts are unavailable right now.</p><a href="#learn">Explore Learn →</a><a href="#discussion">Open the discussion board →</a></div>';updatePosition();}});
}
export function renderWisbody(root){
 const existingDraft=account().locked?null:read(DRAFT_KEY,{})['#wisbody']?.quoteDraft;
 let index=Math.max(0,Math.min(quotes.length-1,existingDraft?.index??Math.floor(Math.random()*quotes.length))),theme='all';
 const notes=account().locked?{}:read(QUOTE_KEY,{}),pending={...(existingDraft?.notes||{})};
 const themes=[...new Set(quotes.map(q=>q.theme))];
 const paint=()=>{
  const q=quotes[index],value=Object.hasOwn(pending,index)?pending[index]:(notes[index]||'');
  root.innerHTML=`<section class="wisbody" aria-labelledby="wisbody-title"><div class="wisbody-character"><img src="media/strategy/wisbody.png" width="320" height="480" loading="lazy" alt="Wisbody, a wise Nobody with a white beard and wooden staff"><p>Meet Wisbody</p></div><div class="wisbody-bubble"><p class="eyebrow">A small thought to carry</p><h2 id="wisbody-title">A moment with Wisbody.</h2><label class="wisbody-filter">Choose a theme <select id="wisbody-theme"><option value="all">All themes</option>${themes.map(t=>`<option value="${esc(t)}" ${theme===t?'selected':''}>${esc(t.replaceAll('-',' '))}</option>`).join('')}</select></label><p class="fine">${esc(q.type==='fact'?'A perspective to consider':q.label)} · written for Nobody’s Simple</p><blockquote>${esc(q.text)}</blockquote><p class="wisbody-prompt">${esc(q.prompt)}</p><div class="wisbody-controls"><button type="button" class="chip" id="wisbody-prev" aria-label="Previous thought">← Previous</button><span>${index+1} / ${quotes.length}</span><button type="button" class="chip" id="wisbody-next" aria-label="Next thought">Next →</button></div><details ${value?'open':''}><summary>Journal on this thought</summary><label class="field" for="wisbody-note">What does this bring up for you?<textarea id="wisbody-note" maxlength="12000" rows="4" placeholder="A few words is enough…" ${account().locked?'disabled':''}>${esc(value)}</textarea></label><div class="row"><button type="button" class="button" id="wisbody-save" ${account().locked?'disabled':''}>Save this note</button><button type="button" class="button secondary" id="wisbody-export">Download my quote notes</button><button type="button" class="chip" id="wisbody-delete">Delete this note</button></div><p data-status role="status">${account().locked?'Unlock saved work in Account to journal here.':'Your saved quote notes are kept. Draft saving follows your Account preferences.'}</p><a href="#account/privacy">Privacy and syncing →</a></details><p class="fine">A quote is an invitation to reflect. It does not have to fit your experience.</p></div></section>`;
  function saveDraft(){if(account().preferences?.saveDrafts===false){status(root,'Draft saving is off. Save this note or download before leaving.');return;}try{const all=read(DRAFT_KEY,{});all['#wisbody']={title:'Wisbody journal',updatedAt:new Date().toISOString(),quoteDraft:{index,notes:pending}};write(DRAFT_KEY,all);status(root,storageNote(DRAFT_KEY));}catch{status(root,'Draft could not be saved. Download your notes before leaving.');}}
  root.querySelector('#wisbody-note').oninput=e=>{pending[index]=e.target.value;saveDraft();};
  function move(amount){const indices=quotes.map((q,i)=>theme==='all'||q.theme===theme?i:-1).filter(i=>i>=0);index=indices[(indices.indexOf(index)+amount+indices.length)%indices.length];paint();}
  root.querySelector('#wisbody-prev').onclick=()=>move(-1);root.querySelector('#wisbody-next').onclick=()=>move(1);
  root.querySelector('#wisbody-theme').onchange=e=>{theme=e.target.value;index=quotes.findIndex(q=>theme==='all'||q.theme===theme);paint();};
  root.querySelector('#wisbody-save').onclick=()=>{try{const fresh=read(QUOTE_KEY,{});fresh[index]=root.querySelector('#wisbody-note').value;write(QUOTE_KEY,fresh);notes[index]=fresh[index];delete pending[index];const all=read(DRAFT_KEY,{});if(Object.keys(pending).length)all['#wisbody']={title:'Wisbody journal',updatedAt:new Date().toISOString(),quoteDraft:{index,notes:pending}};else delete all['#wisbody'];write(DRAFT_KEY,all);status(root,storageNote(QUOTE_KEY));}catch{status(root,'Note could not be saved. Download a copy instead.');}};
  root.querySelector('#wisbody-export').onclick=()=>download('wisbody-notes.json',{notes:{...read(QUOTE_KEY,{}),...pending},quotes:quotes.map(q=>q.text)});
  root.querySelector('#wisbody-delete').onclick=()=>{if(!confirm('Delete your note for this thought?'))return;try{const fresh=read(QUOTE_KEY,{});delete fresh[index];write(QUOTE_KEY,fresh);delete notes[index];delete pending[index];const drafts=read(DRAFT_KEY,{});if(drafts['#wisbody']?.quoteDraft?.notes)delete drafts['#wisbody'].quoteDraft.notes[index];write(DRAFT_KEY,drafts);paint();status(root,'This note was deleted.');}catch{status(root,'The note could not be deleted.');}};
 };
 paint();
}
