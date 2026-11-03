import {escapeHTML as esc, safeImage} from './core.mjs';
import {quoteDeckExtended as quotes} from './quote-content.mjs';

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
 root.innerHTML=`<div class="wrap strategy-home"><section class="strategy-brand" aria-label="Welcome to Nobody’s Simple"><div class="strategy-brand-scene" aria-hidden="true"></div><div class="strategy-brand-content"><p class="eyebrow">Nobody’s Simple · psychology for real life</p><h1>Welcome to Nobody’s Simple.</h1><p class="strategy-brand-intro">A practical space for noticing what is happening and choosing a next step.</p><div class="thankyou-carousel" aria-label="Supporter credits"><span class="supporter-heart" aria-hidden="true">♡</span><div class="thankyou-heading"><p class="eyebrow">Thank you, supporters</p><p>Every tip helps keep these tools open.</p></div><div class="thankyou-slide supporter-placeholder"><p class="eyebrow">Supporter names</p><h2>Tipper names will appear here</h2><p>Want your name shown? Include your preferred display name in a Ko-fi message. Names are added manually, and only with permission.</p></div></div></div></section><nav class="strategy-project-links" aria-label="Support and follow the project"><a class="chip" href="https://www.youtube.com/@nobodyssimple" target="_blank" rel="noopener noreferrer"><img src="ns-character-guide.webp" alt="" width="64" height="64"><span><strong>YouTube ↗</strong><small>Watch the ideas take shape</small></span><span class="project-link-arrow" aria-hidden="true">↗</span></a><a class="chip chip-tip" href="https://ko-fi.com/nobodyssimple" target="_blank" rel="noopener noreferrer" aria-label="Leave a tip on Ko-fi (opens in a new tab)"><img src="ns-character-star.webp" alt="" width="64" height="64"><span><strong>Leave a tip ↗</strong><small>Support Nobody’s Simple on Ko-fi</small></span><span class="project-link-arrow" aria-hidden="true">↗</span></a><a class="chip" href="#community"><img src="ns-character-drawing.webp" alt="" width="64" height="64"><span><strong>Share feedback →</strong><small>Help shape what comes next</small></span><span class="project-link-arrow" aria-hidden="true">→</span></a></nav>${rail}<section class="strategy-console" aria-label="Navigation console"><div class="strategy-console-illustration" aria-hidden="true"></div><div id="home-navigation-console"></div><nav class="strategy-shortcuts" aria-label="More starting points"><a href="#account/maps">My Maps →</a><a href="#tools">Browse tools →</a><a href="#support">Need a person? Get help →</a></nav></section><div class="strategy-divider" aria-hidden="true"><span>✳</span><i></i><span>⌁</span><i></i><span>✳</span></div><section id="home-latest" class="home-latest" aria-labelledby="home-latest-title"><div class="home-latest-header"><div><p class="eyebrow">Recent from the project</p><h2 id="home-latest-title">Latest from Nobody’s Simple</h2><p>New writing, videos and conversations from the community.</p></div><div class="home-latest-controls"><button type="button" data-latest-prev aria-label="Previous recent item">←</button><span data-latest-position aria-live="off"></span><button type="button" data-latest-next aria-label="Next recent item">→</button></div></div><div class="home-latest-track" tabindex="0" aria-label="Recent content; swipe or scroll sideways"></div><div class="home-latest-links"><a href="#learn">Explore Learn →</a><a href="#discussion">All discussions →</a></div></section><div id="home-wisbody"></div></div>`;
 // On small screens the wizard leads the page in both visual and keyboard order.
 const home=root.querySelector('.strategy-home');
 const console=home?.querySelector('.strategy-console');
 const mobileLayout=window.matchMedia('(max-width: 900px)');
 const positionConsole=()=>{
  if(!home?.isConnected||!console)return;
  if(mobileLayout.matches)home.prepend(console);
  else (home.querySelector('.announcement-rail,.announcement-empty')||home.querySelector('.strategy-project-links'))?.after(console);
 };
 positionConsole();
 const onLayoutChange=()=>{if(!home?.isConnected){mobileLayout.removeEventListener('change',onLayoutChange);return;}positionConsole();};
 mobileLayout.addEventListener('change',onLayoutChange);
 options.renderConsole?.(root.querySelector('#home-navigation-console'));
 renderLatest(root.querySelector('#home-latest'),posts,options.loadDiscussions);
 const slides=[...root.querySelectorAll('[data-announcement-slide]')];let index=0;
 function show(n){if(!slides.length)return;index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==index);const p=root.querySelector('[data-announcement-position]');if(p)p.textContent=`${index+1} / ${slides.length}`;}
 root.querySelector('[data-announcement-prev]')?.addEventListener('click',()=>show(index-1));root.querySelector('[data-announcement-next]')?.addEventListener('click',()=>show(index+1));
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
 const existingDraft=read(DRAFT_KEY,{})['#wisbody']?.quoteDraft;
 let index=Math.max(0,Math.min(quotes.length-1,existingDraft?.index??Math.floor(Math.random()*quotes.length))),theme='all';
 const notes=read(QUOTE_KEY,{}),pending={...(existingDraft?.notes||{})};
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
