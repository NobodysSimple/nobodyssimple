/* Needs-first navigation: seven goals, eleven balanced subject themes and
 * a paged/searchable library of all existing topics under every starting point.
 * Topics relevant to the selected goal appear earlier within each theme.
 */
import {escapeHTML as esc} from './core.mjs';
import {NEEDS_MODES,getNeedsMode,needsDestination} from './ns-needs-catalog.mjs';
import {atlasProblemIndex,atlasGet,atlasDomains} from './ns-atlas-core.mjs';
import {NAV_THEMES,topicsInTheme,matchingTopics,topicTheme} from './ns-needs-themes.mjs';

const e=x=>esc(String(x??''));
const norm=x=>String(x??'').toLocaleLowerCase().replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
const href=(url,title,cls='')=>'<a class="'+cls+'" href="'+e(url)+'">'+title+'</a>';
const area=(body,back='#home')=>'<div class="ns-needs">'+
 '<nav class="ns-needs-top" aria-label="Navigator"><a href="'+e(back)+'">← '+(back==='#home'?'Home':'Back')+'</a>'+
 '<a href="#need/support-safety">Safety and urgent support</a></nav>'+body+'</div>';

const modeCard=mode=>'<a class="ns-needs-mode ns-tone-'+e(mode.tone)+'" href="#navigate/'+e(mode.id)+'">'+
 '<span class="ns-needs-mode-mark" aria-hidden="true">'+e(mode.icon)+'</span><span class="ns-needs-mode-content"><strong>'+e(mode.title)+'</strong>'+
 '<small>'+e(mode.summary)+'</small></span><span class="ns-needs-next" aria-hidden="true">↗</span></a>';

const optionCard=option=>href(needsDestination(option),
 '<span><strong>'+e(option.title)+'</strong><small>'+e(option.description)+'</small></span><span class="ns-needs-next" aria-hidden="true">→</span>',
 'ns-needs-choice');

const topicChoiceCard=topic=>'<a class="ns-needs-choice" href="#workbook-topic/'+encodeURIComponent(topic.id)+'" data-needs-search-text="'+
 e([topic.id,topic.title,topic.hint,...(topic.aliases||[])].join(' '))+'">'+
 '<span><strong>'+e(topic.title)+'</strong><small>'+e(topic.hint)+'</small></span><span class="ns-needs-next" aria-hidden="true">→</span></a>';

// Topic areas are cross-listed where multiple aims may reasonably fit.
// "Learn" and "I'm not sure" keep the full catalogue discoverable.
// These are navigation matches, not a diagnosis or algorithmic symptom assessment.
export const TOPIC_AREAS_BY_MODE=Object.freeze({
 regulate:['feel','body','focus','neuro','disability','clinical','experiences','trauma','safety'],
 process:['feel','change','experiences','trauma','family','social','identity','culture','lgbtq','faith','sexuality','appearance','behaviour'],
 understand:['feel','think','body','identity','focus','neuro','lgbtq','culture','faith','appearance','clinical','growth','experiences','sexuality','behaviour','change','digital'],
 act:['act','work','body','focus','education','inequality','disability','digital','environment','lifespan','growth','behaviour','migration'],
 relate:['relate','family','social','harm','lgbtq','culture','migration','faith','inequality','sexuality','trauma','safety','digital'],
 learn:atlasDomains.map(d=>d.id),
 unsure:atlasDomains.map(d=>d.id)
});

export function topicsForNeedsMode(modeId){
 const mode=getNeedsMode(modeId);
 if(!mode)return [];
 const domains=new Set(TOPIC_AREAS_BY_MODE[modeId]||[]);
 const featured=new Set(mode.options.filter(o=>o.type==='topic').map(o=>o.target));
 const seen=new Set();
 return atlasProblemIndex
  .filter(p=>domains.has(p.domain)&&!featured.has(p.id)&&!seen.has(p.id)&&Boolean(seen.add(p.id)))
  .sort((a,b)=>a.title.localeCompare(b.title));
}

function landing(){
 return area('<header class="ns-needs-hero"><p class="ns-needs-eyebrow">NOBODY’S SIMPLE · EMOTIONAL CALCULATOR</p>'+
 '<h1>What would help you right now?</h1><p>Choose what you want to do, not what you think is wrong with you. You can change direction at any time.</p></header>'+
 '<section class="ns-needs-panel"><h2>Choose a starting point</h2>'+
 '<div class="ns-needs-grid">'+NEEDS_MODES.map(modeCard).join('')+'</div></section>'+
 '<p class="ns-needs-footnote">No questionnaire or diagnosis is required. Each choice opens a continuous guide with the explanation, research-informed options and practical exercises together on one page.</p>');
}
export const NAV_TOPIC_PAGE_SIZE=24;
// Every starting point now shows the same complete directory. It remains
// meaningful as a lens: its most relevant topics sort first inside each theme,
// without hiding the rest of the catalogue or inflating tiny category counts.
export function browsableTopicsForNeedsMode(modeId){
 const mode=getNeedsMode(modeId);
 if(!mode)return [];
 const preferred=new Set(TOPIC_AREAS_BY_MODE[modeId]||[]);
 return [...atlasProblemIndex].sort((a,b)=>
  Number(preferred.has(b.domain))-Number(preferred.has(a.domain)) ||
  a.title.localeCompare(b.title));
}
export function themesForNeedsMode(modeId){
 const topics=browsableTopicsForNeedsMode(modeId);
 if(!topics.length)return [];
 return NAV_THEMES.map(t=>({
  ...t,count:topics.reduce((total,p)=>total+Number(topicTheme(p)===t.id),0)
 }));
}
function themeCard(t){
 return '<button type="button" class="ns-needs-theme" data-needs-theme="'+e(t.id)+'" aria-expanded="false" aria-controls="ns-needs-topic-panel">'+
  '<span class="ns-needs-theme-icon" aria-hidden="true">'+e(t.icon)+'</span>'+
  '<span><strong>'+e(t.title)+'</strong><small>'+e(t.short)+'</small><em>'+t.count+' topics</em></span>'+
  '<span class="ns-needs-next" aria-hidden="true">→</span></button>';
}
function modeScreen(mode){
 const themes=themesForNeedsMode(mode.id);
 return area('<header class="ns-needs-header ns-tone-'+e(mode.tone)+'"><p class="ns-needs-eyebrow">YOUR STARTING POINT</p>'+
 '<h1>'+e(mode.title)+'</h1><p>'+e(mode.summary)+'</p></header>'+
 '<section class="ns-needs-panel ns-needs-browse"><h2 tabindex="-1" data-needs-theme-heading>Explore by theme</h2>'+
 '<p class="ns-needs-sub">Choose an area that interests you. All topics are available; those most relevant to your starting point appear first.</p>'+
 '<div class="ns-needs-theme-section" data-needs-theme-section>'+
 '<div class="ns-needs-theme-grid" data-needs-theme-grid>'+themes.map(themeCard).join('')+'</div></div>'+
 '<label class="ns-needs-filter-label" for="needs-choice-filter">Or search all topics</label>'+
 '<input id="needs-choice-filter" type="search" autocomplete="off" placeholder="Search sleep, friendships, anxiety, ADHD…" data-needs-choice-filter>'+
 '<section class="ns-needs-topic-panel" id="ns-needs-topic-panel" data-needs-topic-panel hidden aria-label="Topics in your chosen theme">'+
  '<div class="ns-needs-topic-heading"><button type="button" class="ns-needs-back-themes" data-needs-back-themes>← All themes</button>'+
  '<h3 data-needs-topic-heading tabindex="-1"></h3><p data-needs-topic-intro></p></div>'+
  '<p class="ns-needs-filter-count" data-needs-choice-count role="status" aria-live="polite"></p>'+
  '<div class="ns-needs-choices" data-needs-topic-list></div>'+
  '<button type="button" class="ns-needs-more" data-needs-more hidden>Show more topics</button></section>'+
 '<p class="ns-needs-footnote">These are experiences, not diagnoses. Choose any topic to open its existing guide.</p>'+
 '</section><p class="ns-needs-footnote">You can always '+href('#navigate','change your starting point')+'.</p>',
 '#navigate');
}
function wireModeFilter(root,mode){
 const filter=root.querySelector('[data-needs-choice-filter]');
 if(!filter)return;
 const topics=browsableTopicsForNeedsMode(mode.id);
 const themes=themesForNeedsMode(mode.id);
 const groups=root.querySelector('[data-needs-theme-section]');
 const groupButtons=[...root.querySelectorAll('[data-needs-theme]')];
 const themeHeading=root.querySelector('[data-needs-theme-heading]');
 const panel=root.querySelector('[data-needs-topic-panel]');
 const heading=root.querySelector('[data-needs-topic-heading]');
 const intro=root.querySelector('[data-needs-topic-intro]');
 const list=root.querySelector('[data-needs-topic-list]');
 const count=root.querySelector('[data-needs-choice-count]');
 const more=root.querySelector('[data-needs-more]');
 let theme='',limit=NAV_TOPIC_PAGE_SIZE;
 const render=()=>{
  const query=filter.value.trim(),searching=Boolean(query);
  groups.hidden=searching||Boolean(theme);
  panel.hidden=!searching&&!theme;
  for(const button of groupButtons)button.setAttribute('aria-expanded',String(button.dataset.needsTheme===theme));
  if(panel.hidden)return;
  const chosen=themes.find(x=>x.id===theme);
  const found=searching?matchingTopics(topics,query):topicsInTheme(topics,theme);
  heading.textContent=searching?'Search results':chosen?.title||'Explore topics';
  intro.textContent=searching?'Results across all themes.':chosen?.short||'Choose a topic to open its guide.';
  list.innerHTML=found.slice(0,limit).map(topicChoiceCard).join('')||
   '<p class="ns-needs-empty">No matching topics. Try another word or return to the themes.</p>';
  more.hidden=found.length<=limit;
  count.textContent=found.length?
   'Showing '+Math.min(limit,found.length)+' of '+found.length+' topics':
   'No matching topics';
 };
 root.addEventListener?.('click',event=>{
  const themeButton=event.target.closest('[data-needs-theme]');
  if(themeButton){
   theme=themeButton.dataset.needsTheme;filter.value='';limit=NAV_TOPIC_PAGE_SIZE;render();
   heading?.focus?.({preventScroll:true});return;
  }
  if(event.target.closest('[data-needs-back-themes]')){
   theme='';filter.value='';limit=NAV_TOPIC_PAGE_SIZE;render();
   themeHeading?.focus?.({preventScroll:true});return;
  }
  if(event.target.closest('[data-needs-more]')){limit+=NAV_TOPIC_PAGE_SIZE;render();}
 });
 filter.addEventListener?.('input',()=>{theme='';limit=NAV_TOPIC_PAGE_SIZE;render();});
 render();
}
export function renderNeedsConsole(root,parts=[]){
 const path=Array.isArray(parts)?parts:[String(parts||'')];
 const mode=path[0]||'';
 // Redirect historical atlas links; the separate search and category page no longer exists.
 if(mode==='atlas'){
  if(path[1]&&path[1]!=='area'&&atlasGet(path[1])&&typeof location!=='undefined'){
   location.hash='#workbook-topic/'+encodeURIComponent(path[1]);return;
  }
  if(typeof location!=='undefined'){location.hash='#navigate/learn';return;}
  root.innerHTML=modeScreen(getNeedsMode('learn'));wireModeFilter(root,getNeedsMode('learn'));return;
 }
 const chosen=getNeedsMode(mode);
 if(chosen){root.innerHTML=modeScreen(chosen);wireModeFilter(root,chosen);}
 else root.innerHTML=landing();
}

// Maintained for catalogue/search unit tests; no separate browse interface uses this.
export function getSubjectMatchesForTest(search='',domain=''){
 const words=norm(search).split(/\s+/).filter(Boolean);
 return atlasProblemIndex.filter(p=>(!domain||p.domain===domain)&&words.every(w=>
  norm(p.id+' '+p.title+' '+p.hint+' '+(p.aliases||[]).join(' ')).includes(w)))
  .sort((a,b)=>a.title.localeCompare(b.title));
}
