import { chapters } from './intervention-data.mjs';
import { resources, resourcesFor } from './intervention-resources.mjs';
import { reframesFor, scriptsFor } from './intervention-guides.mjs';
import { escapeHTML as esc } from './core.mjs';
const sensitive = /\b(suicid\w*|self[- ]?harm|psychosis|hallucinat\w*|mania|manic|bipolar|withdrawal|addict\w*|overdose|eating disorder|anorexia|bulimia|ptsd|trauma|ocd|abuse|domestic violence)\b/i;
const stopWords = new Set('i im ive id me my myself we our you your a an the to of for and or but it its is are be been do does doing did can cant cannot dont doesnt wont am have has having with without really very keep keeps struggling struggle help need want something anything about how why what when at in on'.split(' '));
function normalise(value) {
 return value.toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
}
function searchWords(value) {
 return normalise(value)
  .replace(/get(?:ting)? (?:out of bed|up)/g,'morning')
  .replace(/say(?:ing)? no/g,'boundaries')
  .replace(/overthink(?:ing)?/g,'worry')
  .replace(/procrastinat\w*/g,'procrastination')
  .replace(/sleeping/g,'sleep')
  .split(' ').filter(w => w && !stopWords.has(w));
}
function resourceCards(items) {
 return `<ul class="ib-resource-list">${items.map(r=>`<li><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer"><span class="ib-resource-meta">${esc(r.publisher)} · ${esc(r.format)}</span><strong>${esc(r.title)} <span aria-hidden="true">↗</span></strong><span>${esc(r.use)}</span><span class="sr-only"> (opens in a new tab)</span></a></li>`).join('')}</ul>`;
}
function reframeCards(items) {
 return `<ul class="ib-reframe-list">${items.map((text,index)=>`<li><span aria-hidden="true">${String(index+1).padStart(2,'0')}</span><p>${esc(text)}</p></li>`).join('')}</ul>`;
}
function scriptCards(items) {
 return `<ul class="ib-script-list">${items.map(([use,text])=>`<li><span>${esc(use)}</span><blockquote>${esc(text)}</blockquote><button type="button" data-copy-script="${esc(text)}" aria-label="Copy phrase: ${esc(use)}">Copy phrase</button></li>`).join('')}</ul>`;
}
export function renderInterventionBook(root) {
 const all = chapters.flatMap(chapter => chapter.entries.map(entry => ({...entry,chapter})));
 const searchable = new Map(all.map(e => [e.id,normalise([e.problem,e.title,e.instruction,e.example,...e.alternatives,...reframesFor(e,e.chapter.id),...scriptsFor(e,e.chapter.id).flat(),e.chapter.title,e.chapter.aliases].join(' '))]));
 let topic='all',query='',limit=30,savedOnly=false,active=null,opener=null;
 let saved=[];
 try { const v=JSON.parse(localStorage.getItem('ns-intervention-bookmarks-v1')||'[]'); if(Array.isArray(v))saved=v.filter(id=>all.some(e=>e.id===id)); } catch {}
 root.innerHTML=`<div class="wrap intervention-book">
  <header class="ib-cover"><div><p class="eyebrow">Nobody’s Simple · the practical archive</p><h1>Intervention<br>Book<span>.</span></h1><p class="ib-lead">Start with what feels difficult.</p><p>Find a problem that sounds like yours. Open a guidebook of specific examples, alternatives, reframes, useful words and further resources.</p><div class="ib-cover-tags"><span>${all.length} problem guidebooks</span><span>${all.length*2} alternatives</span><span>${all.length*7} reframes</span><span>${all.length*6} phrases</span><span>${resources.length} online resources</span></div></div><img src="ns-character-reading.webp" alt="Nobody reading a book" width="210" height="240"></header>
  <div class="ib-introduction"><strong>You don’t need to know the name of a technique.</strong><p>Start with “I can’t…” or “I’m struggling with…”. These are options to explore, not a complete list of treatments or a guarantee of benefit. Persistent, severe or unsafe situations need tailored human support.</p><a href="#support">Get help →</a></div>
  <div class="ib-workspace"><aside class="ib-index" aria-label="Problem collections"><p class="eyebrow">What sounds familiar?</p><button type="button" data-chapter="all" aria-pressed="true">All problems <span>${all.length}</span></button>${chapters.map((c,i)=>`<button type="button" data-chapter="${c.id}" aria-pressed="false"><span class="ib-index-no">${String(i+1).padStart(2,'0')}</span><span class="ib-index-label">“${esc(c.title)}”</span><span>${c.entries.length}</span></button>`).join('')}</aside>
  <section class="ib-pages" aria-label="Practical examples"><div class="ib-search-bar"><label for="ib-search">What are you struggling with?</label><input id="ib-search" type="search" placeholder="Try “I can’t get up” or “I keep saying yes”…" autocomplete="off" aria-describedby="ib-search-hint"><p id="ib-search-hint" class="ib-search-hint">Search problems, examples, alternatives, reframes and useful phrases. Use a few key words.</p><div class="ib-search-options"><label><input id="ib-saved-only" type="checkbox"> My bookmarks</label><button type="button" data-reset>Clear filters</button></div></div><p id="ib-result-status" class="sr-only" role="status"></p><div id="ib-results"></div></section></div>
  <details class="ib-sources"><summary>Browse all ${resources.length} resources · about this book</summary><p>The examples are original editorial adaptations, not individually tested treatments. Linked resources offer further learning and practical materials; they do not endorse this app or validate each example. Follow each publisher’s guidance, especially for structured workbooks.</p><p>Links checked 29 October 2026. External pages may change and need an internet connection. UK service links may not apply elsewhere; device instructions vary by version. Opening a resource takes you to that provider’s website.</p>${resourceCards(resources)}<p>Bookmarks store only entry IDs in this browser, with no account sync. Searches are not stored by this book or sent to a search service.</p><button type="button" data-clear-bookmarks>Clear all book bookmarks</button></details>
  <dialog class="ib-dialog" aria-labelledby="ib-dialog-title"><div class="ib-dialog-content"></div></dialog>
 </div>`;
 const input=root.querySelector('#ib-search'),results=root.querySelector('#ib-results'),dialog=root.querySelector('.ib-dialog');
 function draw(){
  const words=searchWords(query);
  const matches=all.filter(e=>(topic==='all'||e.chapter.id===topic)&&(!savedOnly||saved.includes(e.id))&&words.every(w=>searchable.get(e.id).includes(w)));
  const chapter=chapters.find(c=>c.id===topic);
  root.querySelector('#ib-result-status').textContent=`${matches.length} matching examples${chapter?' in this collection':''}.`;
  results.innerHTML=`${sensitive.test(query)?`<div class="ib-care"><strong>This search may need specialist support.</strong><p>This book does not provide trauma processing, exposure-and-response prevention, withdrawal plans or treatment protocols for serious mental-health conditions. General examples below do not replace that care.</p><a href="#support">Find appropriate support →</a></div>`:''}
  <div class="ib-results-heading"><div><p class="eyebrow">${chapter?'Collection '+String(chapters.indexOf(chapter)+1).padStart(2,'0'):'The problem index'}</p><h2>${chapter?`“${esc(chapter.title)}”`:'Find something that sounds like you'}</h2></div><span>${matches.length} ${matches.length===1?'example':'examples'}</span></div>
  ${chapter?`<p class="ib-chapter-note">${esc(chapter.caution)}</p>`:''}
  <ul class="ib-entry-list">${matches.slice(0,limit).map(e=>`<li><button type="button" data-entry="${e.id}" aria-haspopup="dialog"><span class="ib-entry-bullet" aria-hidden="true">${saved.includes(e.id)?'◆':'•'}</span><span><small>${esc(e.chapter.title)}</small><strong>“${esc(e.problem)}”</strong><span class="ib-entry-method">One approach: ${esc(e.title)}</span><span class="ib-entry-preview">${esc(e.example)}</span><span class="ib-entry-details">Worked example · 2 alternatives · 7 reframes · 6 phrases · ${resourcesFor(e,e.chapter.id).length} resources</span></span><span class="ib-open" aria-hidden="true">↗</span></button></li>`).join('')}</ul>
  ${!matches.length?`<div class="ib-empty"><img src="ns-character-thinking.webp" width="80" height="100" alt=""><h3>No matching examples yet</h3><p>Try a shorter phrase, choose All problems or clear filters. This collection is still growing and does not cover every difficulty.</p><a href="#support">Need more tailored support? Get help →</a></div>`:''}
  ${matches.length>limit?`<button class="button" type="button" data-more>Show 30 more examples <span>(${matches.length-limit} remaining)</span></button>`:''}`;
  root.querySelectorAll('[data-chapter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.chapter===topic)));
 }
 function show(id){
  active=all.find(e=>e.id===id);if(!active)return;
  const e=active;
  dialog.querySelector('.ib-dialog-content').innerHTML=`<div class="ib-dialog-top"><span class="eyebrow">A problem · a few possibilities</span><button type="button" data-close aria-label="Close example">×</button></div><p class="ib-dialog-chapter">${esc(e.chapter.title)}</p><h2 id="ib-dialog-title" tabindex="-1">“${esc(e.problem)}”</h2>
   <p class="ib-approach"><span>One approach</span><strong>${esc(e.title)}</strong></p>
   <nav class="ib-guide-contents" aria-label="This guidebook contains"><span>Example</span><span>Alternatives</span><span>Reframes</span><span>Words to use</span><span>Resources</span></nav>
   <h3>How to try it</h3><p class="ib-instruction">${esc(e.instruction)}</p>
   <section class="ib-worked-example" aria-labelledby="ib-example-heading"><h3 id="ib-example-heading">What this could look like</h3><p>${esc(e.example)}</p></section>
   <h3>If that doesn’t fit</h3><ul class="ib-alternatives">${e.alternatives.map(a=>`<li>${esc(a)}</li>`).join('')}</ul>
   <section class="ib-guide-section" aria-labelledby="ib-reframe-heading"><p class="eyebrow">Ways of looking at the problem</p><h3 id="ib-reframe-heading">Possible reframes</h3><p class="ib-section-intro">These are perspectives to consider, not positive statements you have to force yourself to believe. Keep the ones that make the problem more accurate or workable.</p>${reframeCards(reframesFor(e,e.chapter.id))}</section>
   <section class="ib-guide-section" aria-labelledby="ib-words-heading"><p class="eyebrow">Words you can borrow and change</p><h3 id="ib-words-heading">Things you could say</h3><p class="ib-section-intro">Use the wording as a starting point. Change it to sound like you and use only the phrases that fit the situation safely.</p>${scriptCards(scriptsFor(e,e.chapter.id))}<p id="ib-copy-status" class="ib-copy-status" role="status"></p></section>
   <h3>Resources you can use</h3><p class="ib-resource-intro">Choose a guide, worksheet or tool below. Links open in a new tab.</p>${resourceCards(resourcesFor(e,e.chapter.id))}
   <div class="ib-care"><strong>Fit and limits</strong><p>${esc(e.chapter.caution)}</p></div>
   <details class="ib-entry-evidence"><summary>About this example</summary><p>This is an original self-help example, not a validated treatment protocol. Resource links provide related information, not evidence that this exact example will work for you. Try one suitable change and keep, adapt or stop it based on your experience.</p></details>
   <div class="ib-dialog-actions"><button type="button" class="button" data-bookmark aria-pressed="${saved.includes(e.id)}">${saved.includes(e.id)?'Remove bookmark':'Bookmark this example'}</button><button type="button" data-close>Back to the book</button></div><p class="ib-local-note">Bookmarks stay on this device. No account needed.</p><p id="ib-save-status" role="status"></p>`;
  if(!dialog.open)dialog.showModal();
  dialog.scrollTop=0;
  dialog.querySelector('#ib-dialog-title').focus({preventScroll:true});
 }
 input.addEventListener('input',()=>{query=input.value;limit=30;draw();});
 root.querySelector('#ib-saved-only').addEventListener('change',e=>{savedOnly=e.target.checked;limit=30;draw();});
 dialog.addEventListener('close',()=>{opener?.focus();});
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 root.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-chapter')){topic=b.dataset.chapter;limit=30;draw();input.focus();}
  if(b.hasAttribute('data-entry')){opener=b;show(b.dataset.entry);}
  if(b.hasAttribute('data-close'))dialog.close();
  if(b.hasAttribute('data-copy-script')){
   const status=dialog.querySelector('#ib-copy-status');
   const copying=navigator.clipboard?.writeText?.(b.dataset.copyScript);
   if(copying)copying.then(()=>{status.textContent='Phrase copied.';b.textContent='Copied';}).catch(()=>{status.textContent='Select the phrase above to copy it.';});
   else status.textContent='Select the phrase above to copy it.';
  }
  if(b.hasAttribute('data-more')){const previous=limit;limit+=30;draw();root.querySelectorAll('[data-entry]')[previous]?.focus();}
  if(b.hasAttribute('data-reset')){topic='all';query='';limit=30;savedOnly=false;input.value='';root.querySelector('#ib-saved-only').checked=false;draw();input.focus();}
  if(b.hasAttribute('data-bookmark')&&active){
   const next=saved.includes(active.id)?saved.filter(id=>id!==active.id):[...saved,active.id];
   try{localStorage.setItem('ns-intervention-bookmarks-v1',JSON.stringify(next));saved=next;const marked=saved.includes(active.id);b.setAttribute('aria-pressed',String(marked));b.textContent=marked?'Remove bookmark':'Bookmark this example';dialog.querySelector('#ib-save-status').textContent=marked?'Bookmarked on this device.':'Bookmark removed.';const id=active.id;draw();opener=root.querySelector(`[data-entry="${id}"]`)||input;}catch{dialog.querySelector('#ib-save-status').textContent='This browser could not save the bookmark.';}
  }
  if(b.hasAttribute('data-clear-bookmarks')){try{localStorage.removeItem('ns-intervention-bookmarks-v1');saved=[];draw();b.textContent='Bookmarks cleared';}catch{b.textContent='Unable to clear bookmarks in this browser';}}
 });
 draw();
}
