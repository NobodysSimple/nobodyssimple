import {escapeHTML as esc, safeImage} from './core.mjs';
import {quoteDeckExtended as quotes} from './quote-content.mjs';
import {tools as toolCatalogue} from './tool-catalog.mjs';
import {setupHomeUpdates} from './ns-home-updates.mjs';

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
   <div class="ns-home-actions"><a class="ns-home-primary" href="#navigate">Find my next step <span aria-hidden="true">→</span></a><a class="ns-home-lifestyle" href="#lifestyle"><span class="ns-home-lifestyle__icon" aria-hidden="true">☼</span><span>Nobody's Simple Lifestyle</span><span aria-hidden="true">→</span></a><a class="ns-home-hypothesis" href="#hypothesis"><img src="ns-character-thinking.webp" alt="" width="35" height="36"><span><strong>Hypothesis Generator</strong><small>Let Nobody help you explore what is keeping a pattern going</small></span><span aria-hidden="true">→</span></a></div>
  </section>
  ${resume}
  <section class="ns-home-wisbody" aria-label="A moment with Wisbody"><div data-ns-wisbody-full></div><a class="ns-home-wisbody__link" href="#wisbody">Open Wisbody's reflections <span aria-hidden="true">→</span></a></section>
  <section id="home-latest" class="home-latest ns-home-latest" aria-labelledby="home-latest-title"><div class="home-latest-header"><div><p class="ns-home-eyebrow">FROM NOBODY'S SIMPLE</p><h2 id="home-latest-title">Latest from Nobody's Simple</h2><p>News, writing and resources published by the project.</p></div><div class="home-latest-controls"><button type="button" data-latest-prev aria-label="Previous item">←</button><span data-latest-position aria-live="off"></span><button type="button" data-latest-next aria-label="Next item">→</button></div></div><div class="home-latest-track" tabindex="0" aria-label="Recently published content; scroll sideways"></div><div class="home-latest-links"><a href="#learn">More from Nobody's Simple →</a></div></section>
  <section class="ns-home-shortcuts" aria-label="More ways to explore"><a class="ns-home-shortcut" href="#tools"><span class="ns-home-shortcut__icon" aria-hidden="true">✳</span><span><strong>Browse tools</strong><small>Explore exercises and practical activities</small></span><span class="ns-home-shortcut__arrow" aria-hidden="true">→</span></a><a class="ns-home-shortcut" href="#community"><span class="ns-home-shortcut__icon" aria-hidden="true">♡</span><span><strong>Share feedback</strong><small>Help shape the future of Nobody's Simple</small></span><span class="ns-home-shortcut__arrow" aria-hidden="true">→</span></a></section>
 </div>`;
 renderLatest(root.querySelector('#home-latest'),posts);
 renderWisbody(root.querySelector('[data-ns-wisbody-full]'),{compact:true});
 setupHomeUpdates(posts);
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
export function renderWisbody(root,{compact=false}={}){
 let extrasOpen=false;
 const existingDraft=account().locked?null:read(DRAFT_KEY,{})['#wisbody']?.quoteDraft;
 let index=Math.max(0,Math.min(quotes.length-1,existingDraft?.index??Math.floor(Math.random()*quotes.length))),theme='all';
 const notes=account().locked?{}:read(QUOTE_KEY,{}),pending={...(existingDraft?.notes||{})};
 const themes=[...new Set(quotes.map(q=>q.theme))];
 const paint=()=>{
  const q=quotes[index],value=Object.hasOwn(pending,index)?pending[index]:(notes[index]||'');
  root.innerHTML=`<section class="wisbody" aria-labelledby="wisbody-title"><div class="wisbody-character"><img src="media/strategy/wisbody.png" width="320" height="480" loading="lazy" alt="Wisbody, a wise Nobody with a white beard and wooden staff"><p>Meet Wisbody</p></div><div class="wisbody-bubble"><p class="eyebrow">A small thought to carry</p><h2 id="wisbody-title">A moment with Wisbody.</h2><label class="wisbody-filter">Choose a theme <select id="wisbody-theme"><option value="all">All themes</option>${themes.map(t=>`<option value="${esc(t)}" ${theme===t?'selected':''}>${esc(t.replaceAll('-',' '))}</option>`).join('')}</select></label><p class="fine">${esc(q.type==='fact'?'A perspective to consider':q.label)} · written for Nobody’s Simple</p><blockquote>${esc(q.text)}</blockquote><p class="wisbody-prompt">${esc(q.prompt)}</p><div class="wisbody-controls"><button type="button" class="chip" id="wisbody-prev" aria-label="Previous thought">← Previous</button><span>${index+1} / ${quotes.length}</span><button type="button" class="chip" id="wisbody-next" aria-label="Next thought">Next →</button></div><details ${value?'open':''}><summary>Journal on this thought</summary><label class="field" for="wisbody-note">What does this bring up for you?<textarea id="wisbody-note" maxlength="12000" rows="4" placeholder="A few words is enough…" ${account().locked?'disabled':''}>${esc(value)}</textarea></label><div class="row"><button type="button" class="button" id="wisbody-save" ${account().locked?'disabled':''}>Save this note</button><button type="button" class="button secondary" id="wisbody-export">Download my quote notes</button><button type="button" class="chip" id="wisbody-delete">Delete this note</button></div><p data-status role="status">${account().locked?'Unlock saved work in Account to journal here.':'Your saved quote notes are kept. Draft saving follows your Account preferences.'}</p><a href="#account/privacy">Privacy and syncing →</a></details><p class="fine">A quote is an invitation to reflect. It does not have to fit your experience.</p></div></section>`;
  // Home shows the live quote immediately. Keep the full quote deck, theme,
  // previous/next controls and journal in an optional, compact disclosure.
  // The standalone #wisbody page retains its original expanded interface.
  if(compact){
   const bubble=root.querySelector('.wisbody-bubble');
   const more=document.createElement('details');more.className='ns-wisbody-more';more.open=extrasOpen;
   const summary=document.createElement('summary');summary.textContent='Browse quotes & journal';more.append(summary);
   const pieces=bubble.querySelectorAll(':scope > .wisbody-filter, :scope > .wisbody-prompt, :scope > .wisbody-controls, :scope > details, :scope > .fine');
   pieces.forEach(el=>more.append(el));
   bubble.append(more);root.querySelector('.wisbody').classList.add('wisbody--compact');
   more.addEventListener('toggle',()=>{extrasOpen=more.open;});
  }
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
