/* Needs-first navigation: one continuous grid per starting point.
 * Every named atlas entry is presented as the same choice card as a practical
 * activity and opens the existing integrated field guide directly.
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
// The first screen now exposes just a few practical suggestions and six broad
// topic themes. Nothing is hidden from search: all canonical Atlas routes remain.
export const NAV_TOPIC_PAGE_SIZE=24;
// Featured topic shortcuts also belong in their normal theme: no topic vanishes
// when somebody chooses to browse instead of using a suggested shortcut.
export function browsableTopicsForNeedsMode(modeId){
 const mode=getNeedsMode(modeId);
 if(!mode)return [];
 const topics=topicsForNeedsMode(modeId);
 const featured=mode.options.filter(o=>o.type==='topic').map(o=>atlasGet(o.target)).filter(Boolean);
 return [...topics,...featured].sort((a,b)=>a.title.localeCompare(b.title));
}
export function themesForNeedsMode(modeId){
 const topics=browsableTopicsForNeedsMode(modeId);
 const available=new Set(topics.map(p=>p.domain));
 return NAV_THEMES.filter(t=>t.domains.some(d=>available.has(d))).map(t=>({
  ...t,count:topics.filter(p=>t.domains.includes(p.domain)).length
 }));
}
function themeCard(t){
 return '<button type="button" class="ns-needs-theme" data-needs-theme="'+e(t.id)+'" aria-expanded="false">'+
  '<span class="ns-needs-theme-icon" aria-hidden="true">'+e(t.icon)+'</span>'+
  '<span><strong>'+e(t.title)+'</strong><small>'+e(t.short)+'</small><em>'+t.count+' topics</em></span>'+
  '<span class="ns-needs-next" aria-hidden="true">→</span></button>';
}
function modeScreen(mode){
 const groups=themesForNeedsMode(mode.id);
 return area('<header class="ns-needs-header ns-tone-'+e(mode.tone)+'"><p class="ns-needs-eyebrow">YOUR STARTING POINT</p>'+
 '<h1>'+e(mode.title)+'</h1><p>'+e(mode.summary)+'</p></header>'+
 '<section class="ns-needs-panel ns-needs-browse"><h2>What feels closest?</h2>'+
 '<p class="ns-needs-sub">Start with a suggestion, choose a theme, or search for something specific. One choice is enough.</p>'+
 '<label class="ns-needs-filter-label" for="needs-choice-filter">Search any topic</label>'+
 '<input id="needs-choice-filter" type="search" autocomplete="off" placeholder="Try sleep, relationships, ADHD, discrimination…" data-needs-choice-filter>'+
 '<section class="ns-needs-featured" data-needs-featured><h3>A few places to start</h3><div class="ns-needs-choices" data-needs-featured-list>'+
  mode.options.map(optionCard).join('')+'</div></section>'+
 '<section class="ns-needs-theme-section" data-needs-theme-section><h3>Explore by theme</h3>'+
 '<div class="ns-needs-theme-grid" data-needs-theme-grid>'+groups.map(themeCard).join('')+'</div></section>'+
 '<section class="ns-needs-topic-panel" id="ns-needs-topic-panel" data-needs-topic-panel hidden aria-label="Topics in your chosen theme">'+
  '<div class="ns-needs-topic-heading"><button type="button" class="ns-needs-back-themes" data-needs-back-themes>← All themes</button>'+
  '<h3 data-needs-topic-heading></h3><p data-needs-topic-intro></p></div>'+
  '<div class="ns-needs-domain-chips" data-needs-domain-chips role="group" aria-label="Narrow topics by area"></div>'+
  '<p class="ns-needs-filter-count" data-needs-choice-count role="status" aria-live="polite"></p>'+
  '<div class="ns-needs-choices" data-needs-topic-list></div>'+
  '<button type="button" class="ns-needs-more" data-needs-more hidden>Show more topics</button></section>'+
 '<p class="ns-needs-footnote">These are descriptions of experiences, not diagnoses. Each topic opens its existing guide.</p>'+
 '</section>'+
 '<p class="ns-needs-footnote">You can always '+href('#navigate','change your starting point')+'.</p>',
 '#navigate');
}
function wireModeFilter(root,mode){
 const filter=root.querySelector('[data-needs-choice-filter]');
 if(!filter)return;
 const topics=browsableTopicsForNeedsMode(mode.id);
 const themes=themesForNeedsMode(mode.id);
 const feature=root.querySelector('[data-needs-featured]');
 const featureCards=[...root.querySelectorAll('[data-needs-featured-list] .ns-needs-choice')];
 const groups=root.querySelector('[data-needs-theme-section]');
 const groupButtons=[...root.querySelectorAll('[data-needs-theme]')];
 const panel=root.querySelector('[data-needs-topic-panel]');
 const heading=root.querySelector('[data-needs-topic-heading]');
 const intro=root.querySelector('[data-needs-topic-intro]');
 const chips=root.querySelector('[data-needs-domain-chips]');
 const list=root.querySelector('[data-needs-topic-list]');
 const count=root.querySelector('[data-needs-choice-count]');
 const more=root.querySelector('[data-needs-more]');
 let theme='',domain='',limit=NAV_TOPIC_PAGE_SIZE;
 const render=()=>{
  const query=filter.value.trim();
  const searching=Boolean(query);
  feature.hidden=Boolean(theme)&&!searching;
  let visibleFeatures=0;
  for(const card of featureCards){
   const matched=!searching||matchingTopics([{id:'suggestion',title:card.textContent,hint:'',aliases:[]}],query).length>0;
   card.hidden=!matched;if(matched)visibleFeatures++;
  }
  if(searching&&visibleFeatures===0)feature.hidden=true;
  groups.hidden=searching||Boolean(theme);
  panel.hidden=!searching&&!theme;
  for(const button of groupButtons)button.setAttribute('aria-expanded',String(button.dataset.needsTheme===theme));
  if(panel.hidden)return;
  const chosen=themes.find(x=>x.id===theme);
  const matching=searching?matchingTopics(topics,query):topicsInTheme(topics,theme,domain);
  const sorted=matching; // Alphabetical ordering is already supplied by topicsForNeedsMode.
  heading.textContent=searching?'Search results':chosen?.title||'Explore topics';
  intro.textContent=searching?'Matches from all the topics in this starting point.':chosen?.short||'Choose a topic to open its guide.';
  chips.hidden=searching;
  if(!searching&&chosen){
   const available=atlasDomains.filter(d=>chosen.domains.includes(d.id)&&topics.some(p=>p.domain===d.id));
   chips.innerHTML='<button type="button" data-needs-area="" aria-pressed="'+(!domain)+'">All in this theme</button>'+
    available.map(d=>'<button type="button" data-needs-area="'+e(d.id)+'" aria-pressed="'+(domain===d.id)+'">'+e(d.name)+'</button>').join('');
  }else chips.innerHTML='';
  list.innerHTML=sorted.slice(0,limit).map(topicChoiceCard).join('')||
   '<p class="ns-needs-empty">No matches here. Try another word or choose a different theme.</p>';
  more.hidden=sorted.length<=limit;
  count.textContent=sorted.length?
   'Showing '+Math.min(limit,sorted.length)+' of '+sorted.length+' topics':
   'No matching topics';
 };
 root.addEventListener?.('click',event=>{
  const themeButton=event.target.closest('[data-needs-theme]');
  if(themeButton){theme=themeButton.dataset.needsTheme;domain='';limit=NAV_TOPIC_PAGE_SIZE;render();
   panel.querySelector('[data-needs-topic-heading]')?.scrollIntoView?.({block:'nearest',behavior:'instant'});return;}
  const areaButton=event.target.closest('[data-needs-area]');
  if(areaButton){domain=areaButton.dataset.needsArea;limit=NAV_TOPIC_PAGE_SIZE;render();return;}
  if(event.target.closest('[data-needs-back-themes]')){
   theme='';domain='';limit=NAV_TOPIC_PAGE_SIZE;filter.value='';render();
   groups.querySelector('h3')?.focus?.();return;
  }
  if(event.target.closest('[data-needs-more]')){limit+=NAV_TOPIC_PAGE_SIZE;render();}
 });
 filter.addEventListener?.('input',()=>{limit=NAV_TOPIC_PAGE_SIZE;render();});
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
