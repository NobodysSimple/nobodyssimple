/**
 * Nobody's Simple · Stage 1 app shell and The Journey entry.
 * Keeps existing page renderers intact. The full mission system is a later stage.
 * No localStorage, account or Firestore writes occur in this module.
 */
const NS_WORLDS = Object.freeze([
  {slug:'meadow',title:'The Meadow',overline:'Feelings & body',summary:'Notice emotions, needs and body signals without forcing an explanation.',art:'ns-landscape-feel.webp',tool:'#tool/mixed-feelings',toolName:'Mixed Feelings',second:'#tool/body-check',secondName:'Body Check',tone:'meadow'},
  {slug:'forest',title:'The Forest',overline:'Thinking & uncertainty',summary:'Separate observations from interpretations and examine what remains unknown.',art:'ns-landscape-think.webp',tool:'#tool/reality-map',toolName:'Reality Map',second:'#tool/assumption-finder',secondName:'Assumption Finder',tone:'forest'},
  {slug:'bridge',title:'The Bridge',overline:'Relationships',summary:'Explore conversations, boundaries, misunderstanding and repair.',art:'ns-landscape-relate.webp',tool:'#tool/conversation-map',toolName:'Conversation Map',second:'#tool/boundary-builder',secondName:'Boundary Builder',tone:'bridge'},
  {slug:'workshop',title:'The Workshop',overline:'Choices & action',summary:'Find a workable next step, plan conditions and reduce unnecessary friction.',art:'ns-landscape-choose.webp',tool:'#tool/small-step',toolName:'Small Step',second:'#tool/friction',secondName:'Friction Finder',tone:'workshop'},
  {slug:'observatory',title:'The Observatory',overline:'Self & society',summary:'Explore personality, identity, values and the situations shaping behaviour.',art:'ns-landscape-identity.webp',tool:'#tool/identity-map',toolName:'Identity Map',second:'#tool/values-discovery',secondName:'Values Discovery',tone:'observatory'},
]);
const ICONS = Object.freeze({
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  lab:'<circle cx="12" cy="12" r="9"/><path d="m15.6 8.4-2.4 4.8-4.8 2.4 2.4-4.8z"/>',
  learn:'<path d="M12 5C8.5 3 5 3 2 4v16c3-1 6.5-1 10 1 3.5-2 7-2 10-1V4c-3-1-6.5-1-10 1zM12 5v16"/>',
  tools:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  you:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2c0-4 3.3-6 8-6s8 2 8 6v2"/>',
  account:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2c0-4 3.3-6 8-6s8 2 8 6v2"/>',
  guide:'<path d="M12 6C8 4 5 4 2 5v15c3-1 6-1 10 1 4-2 7-2 10-1V5c-3-1-6-1-10 1ZM12 6v15"/><path d="m6 12 2 2 3-4"/>',
  feed:'<circle cx="12" cy="8" r="3"/><path d="M5.5 20v-1.1c0-3 2.7-5 6.5-5s6.5 2 6.5 5V20"/><path d="M4.5 7.2a2.4 2.4 0 0 0 0 4.6M19.5 7.2a2.4 2.4 0 0 1 0 4.6M1.5 19v-.7c0-1.7.9-3 2.6-3.6M22.5 19v-.7c0-1.7-.9-3-2.6-3.6"/>'
});
const routeName = () => (location.hash.slice(1).split('/')[0]||'home').toLowerCase();
const areaFor = name => {
  if(['help','navigate','need','support','route','routes','compass','questions','navigator','lifestyle','investigate'].includes(name)) return 'home';
  if(name==='guide') return 'guide';
  if(['play','tool','guided','simplyfocus','stim-space','questionnaires','big-five','systems','personality'].includes(name)) return 'tools';
  if(['library','blog','writing','watch','post','wisbody'].includes(name)) return 'learn';
  if(['discussion','discussion-moderation'].includes(name)) return 'feed';
  if(['maps','account','profile','messages','community','volunteer','team','about','install'].includes(name)) return 'account';
  return name;
};
const ids = Object.freeze({home:'#home',guide:'#guide',feed:'#discussion',account:'#account'});
const svg = name => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
function refreshNav() {
  const current=areaFor(routeName());
  document.querySelectorAll('[data-ns-primary-nav] a').forEach(link=>{
    const active=link.getAttribute('href')===ids[current];
    if(active) link.setAttribute('aria-current','page'); else link.removeAttribute('aria-current');
  });
  // The pre-existing app-design decorator also changes nav icons. Mark these
  // slots as owned by the shared shell, with one stable SVG per destination.
  document.querySelectorAll('[data-ns-primary-nav] a').forEach(link=>{
    const href=link.getAttribute('href');
    const name=Object.keys(ids).find(k=>ids[k]===href);
    if(!name) return;
    const slot=link.querySelector('.app-nav-icon')||link.querySelector(':scope > span[aria-hidden]');
    if(!slot||slot.dataset.nsIcon===name) return;
    // Feed is a shared space, never a profile avatar. Account remains in the header.
    slot.innerHTML=svg(name);
    slot.dataset.nsIcon=name;
    link.dataset.uiNav='true';
  });
}
let lastHash='';
function onRoute() {
  const hash=location.hash||'#home';
  document.querySelector('.ns-more-menu')?.removeAttribute('open');
  requestAnimationFrame(()=>{
    refreshNav();
    if(hash!==lastHash) {
      lastHash=hash;
      // Focus route headings after any hash navigation, never on initial load.
      // This prevents keyboard focus being stranded on a removed card/link.
      const h=document.querySelector('main h1');
      if(h) {h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}
    }
  });
}
function init() {
  refreshNav();
  window.addEventListener('hashchange',onRoute);
  // The legacy router updates active state on hash changes too. Reconcile
  // after it finishes rather than replacing its event handler.
  requestAnimationFrame(refreshNav);
}
if(typeof document!=='undefined') {
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
}
function worldCard(w) {
  return `<a class="ns-world" data-world="${w.tone}" href="#lab/${w.slug}">
    <span class="ns-world__art"><img src="${w.art}" alt="" loading="lazy" decoding="async"/></span>
    <span class="ns-world__content"><span class="ns-world__kicker">${w.overline}</span><strong>${w.title}</strong><span>${w.summary}</span><span class="ns-world__link">Explore this world <span aria-hidden="true">→</span></span></span>
  </a>`;
}
function worldPage(w) {
  return `<div class="ns-lab-page ns-lab-page--world ns-world-detail" data-world="${w.tone}">
    <a class="ns-text-back" href="#lab">← All The Journey worlds</a>
    <header class="ns-lab-hero"><div class="ns-lab-hero__copy"><p class="ns-eyebrow">LIFE LAB / ${w.overline.toUpperCase()}</p><h1>${w.title}</h1><p>${w.summary}</p><p class="ns-soft-notice">Interactive The Journey missions are in development. You can explore these working tools now.</p></div><div class="ns-lab-hero__image"><img src="${w.art}" alt="" decoding="async"/></div></header>
    <section class="ns-lab-section" aria-labelledby="ns-existing-tools-title"><h2 id="ns-existing-tools-title">Try something that works today</h2><div class="ns-lab-links"><a class="ns-lab-tool-link" href="${w.tool}"><span><strong>${w.toolName}</strong><small>Open the existing activity</small></span><span aria-hidden="true">→</span></a><a class="ns-lab-tool-link" href="${w.second}"><span><strong>${w.secondName}</strong><small>Open the existing activity</small></span><span aria-hidden="true">→</span></a></div></section>
    <section class="ns-lab-section ns-lab-upcoming" aria-labelledby="ns-upcoming-title"><h2 id="ns-upcoming-title">What comes next</h2><p>Short, interactive psychological skills you can practise through realistic situations—without grades for emotions or pressure to return every day.</p><a href="#tools">Browse all tools <span aria-hidden="true">→</span></a></section>
  </div>`;
}
/** Handler called by the existing site's hash router. */
export function renderLabStage1(main,world=''){
  const selection=NS_WORLDS.find(w=>w.slug===world);
  const hasSuffix=Boolean(world);
  if(selection){main.innerHTML=worldPage(selection);return;}
  if(hasSuffix){main.innerHTML=`<div class="ns-lab-page ns-lab-error"><a class="ns-text-back" href="#lab">← The Journey</a><h1>This world isn't available.</h1><p>That link may be outdated. Explore one of the available worlds or use the existing tools.</p><a class="ns-lab-tool-link" href="#lab">View The Journey <span aria-hidden="true">→</span></a></div>`;return;}
  main.innerHTML=`<div class="ns-lab-page ns-lab-hub">
    <header class="ns-lab-hero"><div class="ns-lab-hero__copy"><p class="ns-eyebrow">NOBODY'S SIMPLE / PRACTISE</p><h1>The Journey</h1><p>A place to practise useful psychological skills through everyday situations.</p><p class="ns-soft-notice">We're building interactive missions. For now, each world connects to existing working tools.</p><a class="ns-hero-action" href="#tools">Explore the full toolkit <span aria-hidden="true">→</span></a></div><div class="ns-lab-hero__image"><img src="ns-character-hiking.webp" alt="" decoding="async"/></div></header>
    <section class="ns-lab-section" aria-labelledby="ns-worlds-title"><div class="ns-lab-section__heading"><div><p class="ns-eyebrow">FIVE PLACES TO EXPLORE</p><h2 id="ns-worlds-title">Choose a world.</h2></div><span class="ns-muted">No order to follow</span></div><div class="ns-world-grid">${NS_WORLDS.map(worldCard).join('')}</div></section>
    <section class="ns-lab-section ns-lab-upcoming"><h2>Learn by trying</h2><p>Future missions will combine a short scenario, an interaction, clear feedback and an optional real-life experiment. Until they are released, your existing activities remain available at any time.</p><a href="#learn">Explore learning <span aria-hidden="true">→</span></a></section>
  </div>`;
}
