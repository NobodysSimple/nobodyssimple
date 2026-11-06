/**
 * Nobody's Simple — Stage 3: discover the existing tools without changing them.
 * The source catalogue, canonical hrefs, favourite keys, recent-use consent and
 * account-aware Workspace continue to be owned by the existing application.
 */
import { libraryItems, libraryCollections } from './features.mjs';

const html = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ART = {
  feel:['ns-landscape-sunset.webp','ns-character-compass.webp','01'],
  calm:['ns-landscape-calm.webp','ns-character-meditate.webp','02'],
  think:['ns-landscape-forest.webp','ns-character-thinking.webp','03'],
  choose:['ns-landscape-path.webp','ns-character-hiking.webp','04'],
  relate:['ns-landscape-mountains.webp','ns-character-message.webp','05'],
  identity:['ns-landscape-night.webp','ns-character-sitting.webp','06'],
  learn:['ns-landscape-clouds.webp','ns-character-reading.webp','07'],
};
const FAVOURITE_KEY = 'ns-tool-favourites-v1';
const RECENT_KEY = 'ns-tool-recent-v1';
const historyKey = () => `ns-tool-history-enabled-v1:${window.nsAccountHistoryScope||'guest'}`;
function readList(key) {
  try {
    const parsed=JSON.parse(localStorage.getItem(key)||'[]');
    return Array.isArray(parsed) ? parsed.filter(x=>typeof x==='string').slice(0,24) : [];
  } catch { return []; }
}
function writeList(key,list) {
  try { localStorage.setItem(key,JSON.stringify(list.slice(0,24))); } catch { /* existing local/account storage constraints */ }
}
function historyEnabled(){try{return localStorage.getItem(historyKey())==='true'}catch{return false}}
function setHistoryEnabled(enabled){try{localStorage.setItem(historyKey(),String(Boolean(enabled)))}catch{/* storage unavailable */}}

// Deliberately NOT durations: the original time buckets were derived from
// interaction mode/field counts, not from measured completion times.
const effortFor = item => item.time==='Quick'?'short':item.time==='Deep dive'?'long':'guided';
const effortName = {short:'Short',guided:'Guided',long:'In-depth'};
const filterOptions = {
  effort:[['all','Any effort'],['short','Short'],['guided','Guided'],['long','In-depth']],
  format:[['all','Any format'],['Reflection','Reflection'],['Interactive','Interactive']],
};
const initialState = {query:'',effort:'all',format:'all',view:'themes'};
let state = {...initialState};
const all = libraryItems();
const byID = new Map(all.map(item=>[item.id,item]));
const validCollections = new Map(libraryCollections.map(c=>[c.id,c]));

const icon = (kind='arrow') => {
  const parts={
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    chevron:'<path d="m9 6 6 6-6 6"/>',
    star:'<path d="m12 2 3.1 6.8 7.4 1-5.5 5.2 1.4 7.3-6.4-3.5-6.5 3.5 1.4-7.3-5.5-5.2 7.4-1z"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bookmark:'<path d="M5 3h14v18l-7-5-7 5z"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
    close:'<path d="M5 5l14 14M19 5 5 19"/>',
  };
  return `<svg class="ns-tools-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${parts[kind]||parts.arrow}</svg>`;
};
const countText = n => `${n} tool${n===1?'':'s'}`;
function card(item,pinned,compact=false) {
  return `<article class="ns-tool-card ${compact?'ns-tool-card--compact':''}">
    <a class="ns-tool-card__link" data-ns-tool-open="${html(item.id)}" href="${html(item.href)}">
      <span class="ns-tool-card__symbol ns-tool-card__symbol--${html(item.collection)}" aria-hidden="true">${item.format==='Interactive'?'✧':'◌'}</span>
      <span class="ns-tool-card__copy">
        <strong>${html(item.title)}</strong>
        <span class="ns-tool-card__description">${html(item.short)}</span>
        <span class="ns-tool-card__meta">${html(item.format)}<span aria-hidden="true">·</span>${effortName[effortFor(item)]} effort</span>
      </span>
      <span class="ns-tool-card__arrow">${icon('chevron')}</span>
    </a>
    <button class="ns-tool-card__pin ${pinned?'is-pinned':''}" type="button" data-ns-tool-pin="${html(item.id)}" aria-pressed="${pinned}" aria-label="${pinned?'Unpin':'Pin'} ${html(item.title)}" title="${pinned?'Remove from pinned':'Pin this tool'}">${icon('bookmark')}</button>
  </article>`;
}
const sortByTitle = items => [...items].sort((a,b)=>a.title.localeCompare(b.title,'en',{sensitivity:'base'}));
function themeCard(c,items){
  const [art,pose,n] = ART[c.id];
  // Each thumbnail uses a landscape WITHOUT a baked-in character, plus
  // exactly one separate mascot. No overlapping/doubled figures.
  const oneCharacter = `<img class="ns-tools-theme__mascot" src="${pose}" alt="" loading="lazy" decoding="async">`;
  return `<a class="ns-tools-theme ns-tools-theme--${c.id}" href="#tools/${c.id}" aria-label="${html(c.label)}, ${countText(items.length)}">
    <span class="ns-tools-theme__scene"><img src="${art}" alt="" loading="lazy" decoding="async">${oneCharacter}</span>
    <span class="ns-tools-theme__text"><small>AREA ${n}<span class="ns-tools-theme__count">${countText(items.length)}</span></small><strong>${html(c.label)}</strong><span>${html(c.prompt)}</span></span>
    <span class="ns-tools-theme__arrow">${icon('arrow')}</span>
  </a>`;
}
function heading(kicker,title,detail=''){
 return `<div class="ns-tools-section-heading"><div><p class="ns-tools-eyebrow">${html(kicker)}</p><h2>${html(title)}</h2>${detail?`<p>${html(detail)}</p>`:''}</div></div>`;
}
function renderCards(items,favourites){
 return `<div class="ns-tools-cards">${items.map(item=>card(item,favourites.includes(item.id))).join('')}</div>`;
}
function alphabetical(items,favourites) {
  const sorted=sortByTitle(items);let prev='';
  return `<div class="ns-tools-alpha">${sorted.map(item=>{
    const letter=item.title.trim().charAt(0).toUpperCase()||'#';
    const marker=letter!==prev?`<h3 class="ns-tools-letter">${html(letter)}</h3>`:'';prev=letter;
    return marker+card(item,favourites.includes(item.id),true);
  }).join('')}</div>`;
}
function toolsShown(group) {
  const q=state.query.trim().toLocaleLowerCase();
  return all.filter(item=>
    (!group || item.collection===group) &&
    (state.view!=='pinned'||readList(FAVOURITE_KEY).includes(item.id)) &&
    (!q || item.searchText.includes(q)) &&
    (state.effort==='all'||effortFor(item)===state.effort) &&
    (state.format==='all'||item.format===state.format)
  );
}
function renderDiscoverContent(category,unknown=false){
  const favourites=readList(FAVOURITE_KEY);
  const items=toolsShown(category);
  const isFiltering=Boolean(state.query.trim()||state.effort!=='all'||state.format!=='all');
  const showThemes=state.view==='themes'&&!category&&!isFiltering;
  const selectRoot=document.querySelector('#main .ns-tools-v3');
  if(!selectRoot)return;
  const place=selectRoot.querySelector('[data-ns-tools-content]');
  if(!place)return;
  if(unknown){place.innerHTML=`<section class="ns-tools-empty"><h2>That collection isn't here.</h2><p>These tools can still be found from the main directory.</p><a href="#tools">Browse all tools ${icon('arrow')}</a></section>`;return;}
  if(showThemes){
    const pinned=favourites.map(id=>byID.get(id)).filter(Boolean);
    const recent=historyEnabled()?readList(RECENT_KEY).map(id=>byID.get(id)).filter(Boolean):[];
    place.innerHTML=`${pinned.length?`<section class="ns-tools-section ns-tools-pinned">${heading('YOUR SHORTCUTS','Pinned tools','The tools you chose to keep nearby.')}${renderCards(pinned.slice(0,4),favourites)}${pinned.length>4?`<button class="ns-tools-text-link" data-ns-view="pinned" type="button">See all ${pinned.length} pinned tools ${icon('arrow')}</button>`:''}</section>`:''}
    <section class="ns-tools-section ns-tools-themes">${heading('BROWSE BY THEME','Choose a theme','Choose a theme, or open any of the 103 tools directly.')}
    <div class="ns-tools-theme-grid">${libraryCollections.map(c=>themeCard(c,all.filter(x=>x.collection===c.id))).join('')}</div></section>
    ${recent.length?`<section class="ns-tools-section">${heading('YOUR HISTORY','Recently opened','Shown only because you enabled recent-tool history.')}${renderCards(recent.slice(0,4),favourites)}</section>`:''}
    <section class="ns-tools-section ns-tools-featured">${heading('QUICK TOOLS','Try one small action','These are examples, not recommendations based on personal information.')}
      <div class="ns-tools-featured-grid">${[
        ['#tool/body-check','Notice what is happening','Body Check','ns-character-checklist.webp'],
        ['#tool/assumption-finder','Examine an assumption','Assumption Finder','ns-character-thinking.webp'],
        ['#tool/small-step','Make a task smaller','Small Step','ns-character-building.webp'],
      ].map(([href,label,title,art])=>`<a href="${href}" data-ns-tool-open="${href.split('/').at(-1)}"><img src="${art}" alt="" loading="lazy"><span><small>${label}</small><strong>${title}</strong></span>${icon('arrow')}</a>`).join('')}</div>
    </section>`;
  } else {
    const title=category?validCollections.get(category).label:state.view==='pinned'?'Pinned tools':state.view==='alphabetical'?'All tools A–Z':isFiltering?'Search results':'Browse tools';
    const description=category?validCollections.get(category).description:state.view==='pinned'?'Your personally selected shortcuts.':isFiltering?'Results matching your current filters.':'Every available tool, directly linked.';
    const noResults=state.view==='pinned'&&!favourites.length?'No pinned tools yet. Use the bookmark icon on any tool to pin it.':'No tools match these filters. Try a different keyword or clear your filters.';
    place.innerHTML=`<section class="ns-tools-section ns-tools-results" aria-labelledby="ns-tools-results-title">
      <div class="ns-tools-results-top"><div><p class="ns-tools-eyebrow">${category?'CHOSEN THEME':state.view==='pinned'?'YOUR SHORTCUTS':'TOOL DIRECTORY'}</p><h2 id="ns-tools-results-title">${html(title)}</h2><p>${html(description)}</p></div><span class="ns-tools-results-count">${countText(items.length)}</span></div>
      ${category?`<a class="ns-tools-back" href="#tools">← All seven themes</a>`:''}
      ${items.length?(state.view==='alphabetical'?alphabetical(items,favourites):renderCards(sortByTitle(items),favourites)):`<div class="ns-tools-empty"><p>${noResults}</p><button type="button" data-ns-clear="true">Clear filters</button>${category?`<a href="#tools">All themes ${icon('arrow')}</a>`:''}</div>`}
    </section>`;
  }
  const count=selectRoot.querySelector('[data-ns-result-count]');if(count)count.textContent=countText(items.length);
}
function updateFilters(root){
  root.querySelectorAll('[data-ns-effort]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.nsEffort===state.effort)));
  root.querySelectorAll('[data-ns-format]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.nsFormat===state.format)));
  root.querySelectorAll('[data-ns-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.nsView===state.view)));
  const clear=root.querySelector('[data-ns-reset]');
  if(clear) clear.hidden=!(state.query.trim()||state.effort!=='all'||state.format!=='all');
}
export function renderToolDiscovery(root,category='') {
  const theme=category?String(category).toLowerCase():'';
  const unknown=Boolean(theme&&!validCollections.has(theme));
  if(root.querySelector('.ns-tools-v3')) root.replaceChildren();
  root.innerHTML=`<div class="ns-tools-v3 wrap" data-ns-theme="${html(theme)}">
    <section class="ns-tools-hero" aria-labelledby="ns-tools-main-heading">
      <div class="ns-tools-hero__copy"><p class="ns-tools-eyebrow">PRACTICAL ACTIVITIES</p><h1 id="ns-tools-main-heading">Tools</h1>
      <p>Practical activities for different situations and needs.</p>
      <div class="ns-tools-hero__actions"><a href="#navigate" class="ns-tools-hero__primary">Help me choose ${icon('arrow')}</a><a href="#lab" class="ns-tools-hero__secondary">Explore Life Lab ${icon('chevron')}</a></div>
      </div>
      <div class="ns-tools-hero__art" aria-hidden="true"><img class="ns-tools-hero__landscape" src="ns-landscape-forest.webp" alt=""/><img class="ns-tools-hero__nobody" src="ns-character-reading.webp" alt=""/><span class="ns-tools-hero__count"><strong>${all.length}</strong><small>ways to explore</small></span></div>
    </section>
    <section class="ns-tools-filter" aria-label="Find a tool">
      <div class="ns-tools-filter__head"><div><p class="ns-tools-eyebrow">SEARCH TOOLS</p><h2>Find a useful tool</h2></div><span data-ns-result-count aria-live="polite" aria-atomic="true">${countText(all.length)}</span></div>
      <label class="ns-tools-search">${icon('search')}<span class="sr-only">Search all tools by name or situation</span><input type="search" data-ns-tool-query placeholder="Search tools, e.g. “overthinking”" autocomplete="off" value="${html(state.query)}"/><span class="ns-tools-search__hint">Search</span></label>
      <details class="ns-vision-refine"><summary>Refine results <span>Effort and format <span aria-hidden="true">⌄</span></span></summary>
      <div class="ns-tools-filter__rows">
        <div class="ns-tools-filter__row"><span class="ns-tools-filter__label">Effort</span><div class="ns-tools-chips">${filterOptions.effort.map(([v,l])=>`<button type="button" data-ns-effort="${v}" aria-pressed="${state.effort===v}">${l}</button>`).join('')}</div></div>
        <div class="ns-tools-filter__row"><span class="ns-tools-filter__label">Format</span><div class="ns-tools-chips">${filterOptions.format.map(([v,l])=>`<button type="button" data-ns-format="${v}" aria-pressed="${state.format===v}">${l}</button>`).join('')}</div></div>
      </div>
      <div class="ns-tools-filter__end"><p>Effort is an approximate guide based on the exercise structure, not a measured duration.</p><button type="button" data-ns-reset ${state.query.trim()||state.effort!=='all'||state.format!=='all'?'':'hidden'}>Clear filters ${icon('close')}</button></div></details>
    </section>
    <nav class="ns-tools-switcher" aria-label="Tool browsing view"><span>Browse</span><div class="ns-tools-switcher__items">
      <button type="button" data-ns-view="themes" aria-pressed="${state.view==='themes'}">${icon('grid')} Themes</button>
      <button type="button" data-ns-view="alphabetical" aria-pressed="${state.view==='alphabetical'}">${icon('list')} A–Z</button>
      <button type="button" data-ns-view="pinned" aria-pressed="${state.view==='pinned'}">${icon('bookmark')} Pinned</button>
    </div></nav>
    <div data-ns-tools-content></div>
    <div class="ns-tools-bottom">
      <div class="ns-tools-bottom__intro"><img src="ns-character-mapping.webp" alt="" loading="lazy"/><div><p class="ns-tools-eyebrow">KEEP WHAT HELPS</p><h2>Your maps and notes.</h2><p>Return to work you've chosen to save. Nothing here is a diagnosis or a fixed description of you.</p></div></div>
      <a href="#account/maps">Open My Maps ${icon('arrow')}</a>
    </div>
    <label class="ns-tools-history"><input type="checkbox" data-ns-history ${historyEnabled()?'checked':''}/> Remember recently opened tools (optional)</label>
    <p class="ns-tools-privacy">This option is off by default. Saved work and optional synchronisation remain controlled through your account settings.</p>
  </div>`;
  const aborter=new AbortController();const {signal}=aborter;
  const content=()=>{renderDiscoverContent(unknown?'':theme,unknown);updateFilters(root)};
  root.addEventListener('input',event=>{
    if(!event.target.matches('[data-ns-tool-query]'))return;
    state.query=event.target.value;content();
  },{signal});
  root.addEventListener('change',event=>{
    if(!event.target.matches('[data-ns-history]'))return;
    setHistoryEnabled(event.target.checked);content();
  },{signal});
  root.addEventListener('click',event=>{
    const pin=event.target.closest('[data-ns-tool-pin]');
    if(pin){
      const id=pin.dataset.nsToolPin;if(!byID.has(id))return;
      const saved=readList(FAVOURITE_KEY);
      writeList(FAVOURITE_KEY,saved.includes(id)?saved.filter(x=>x!==id):[id,...saved]);
      content();
      const focus=root.querySelector(`[data-ns-tool-pin="${CSS.escape(id)}"]`);
      focus?.focus({preventScroll:true});
      return;
    }
    const opened=event.target.closest('[data-ns-tool-open]');
    if(opened){
      const id=opened.dataset.nsToolOpen;
      if(historyEnabled()&&byID.has(id)) writeList(RECENT_KEY,[id,...readList(RECENT_KEY).filter(x=>x!==id)].slice(0,8));
      return;
    }
    const effort=event.target.closest('[data-ns-effort]');
    if(effort){state.effort=effort.dataset.nsEffort;content();return;}
    const format=event.target.closest('[data-ns-format]');
    if(format){state.format=format.dataset.nsFormat;content();return;}
    const view=event.target.closest('[data-ns-view]');
    if(view){state.view=view.dataset.nsView;content();return;}
    if(event.target.closest('[data-ns-reset],[data-ns-clear]')){
      Object.assign(state,{query:'',effort:'all',format:'all'});
      const search=root.querySelector('[data-ns-tool-query]');if(search)search.value='';
      content();search?.focus({preventScroll:true});
    }
  },{signal});
  content();
  return ()=>aborter.abort();
}

// Tiny read-only probe used by Stage 3's preservation/interaction regression tests.
export const toolDiscoveryInventory = Object.freeze({total:all.length,ids:Object.freeze(all.map(item=>item.id)),themes:Object.freeze(libraryCollections.map(c=>c.id))});
