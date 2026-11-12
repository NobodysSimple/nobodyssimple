/* Needs-first navigation: seven goals, eleven balanced subject themes and
 * a paged/searchable library of all existing topics under every starting point.
 * Topics relevant to the selected goal appear earlier within each theme.
 */
import {escapeHTML as esc} from './core.mjs';
import {NEEDS_MODES,getNeedsMode} from './ns-needs-catalog.mjs';
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

export const NAV_TOPIC_PAGE_SIZE=24;
function themeTopics(themeId){
 return NAV_THEMES.some(t=>t.id===themeId)?topicsInTheme(atlasProblemIndex,themeId):
  atlasProblemIndex.filter(p=>!NAV_THEMES.some(t=>t.id===topicTheme(p)));
}
function problemAreas(){
 const areas=NAV_THEMES.map(theme=>({...theme,count:themeTopics(theme.id).length}));
 const otherCount=themeTopics('other').length;
 if(otherCount)areas.push({id:'other',title:'Other experiences',short:'Topics that do not sit neatly in one area',icon:'⌁',domains:[],count:otherCount});
 return areas;
}
function subdomainsForArea(themeId){
 const theme=NAV_THEMES.find(t=>t.id===themeId),topics=themeTopics(themeId);
 const domains=theme?atlasDomains.filter(d=>theme.domains.includes(d.id)):atlasDomains;
 const groups=domains.map(d=>({
  id:d.id,title:d.name,short:d.description||'More specific experiences in this area',icon:d.icon||'◇',
  topics:topics.filter(p=>p.domain===d.id)
 })).filter(group=>group.topics.length);
 const placed=new Set(groups.flatMap(group=>group.topics.map(p=>p.id)));
 const related=topics.filter(p=>!placed.has(p.id));
 if(related.length)groups.push({id:'related',title:'Related experiences',
  short:'Topics connected to this area from another part of life',icon:'↔',topics:related});
 return groups;
}
const areaCard=theme=>'<button type="button" class="ns-needs-theme" data-needs-theme="'+e(theme.id)+'" aria-expanded="false">'+
 '<span class="ns-needs-theme-icon" aria-hidden="true">'+e(theme.icon)+'</span>'+
 '<span><strong>'+e(theme.title)+'</strong><small>'+e(theme.short)+'</small><em>'+theme.count+' topics</em></span>'+
 '<span class="ns-needs-next" aria-hidden="true">→</span></button>';
const subdomainCard=group=>'<button type="button" class="ns-needs-subdomain" data-needs-subdomain="'+e(group.id)+'">'+
 '<span class="ns-needs-theme-icon" aria-hidden="true">'+e(group.icon)+'</span>'+
 '<span><strong>'+e(group.title)+'</strong><small>'+e(group.short)+'</small><em>'+group.topics.length+' topics</em></span>'+
 '<span class="ns-needs-next" aria-hidden="true">→</span></button>';
function landing(state){
 const areas=problemAreas(),active=areas.find(x=>x.id===state.theme);
 const subdomains=active?subdomainsForArea(active.id):[];
 const subdomain=subdomains.find(x=>x.id===state.subdomain);
 let content='';
 if(state.query.trim()){
  const matches=matchingTopics(atlasProblemIndex,state.query);
  content='<section class="ns-needs-topic-panel ns-needs-search-results"><h2 tabindex="-1" data-needs-focus-heading>Search results</h2>'+
   '<p class="ns-needs-sub">Matching topics from across all problem areas.</p>'+
   '<p class="ns-needs-filter-count" role="status" aria-live="polite">'+(matches.length?'Showing '+Math.min(state.limit,matches.length)+' of '+matches.length+' topics':'No matching topics')+'</p>'+
   '<div class="ns-needs-choices">'+(matches.length?matches.slice(0,state.limit).map(topicChoiceCard).join(''):'<p class="ns-needs-empty">No matching topics. Try another word.</p>')+'</div>'+
   (matches.length>state.limit?'<button type="button" class="ns-needs-more" data-needs-more>Show more topics</button>':'')+'</section>';
 }else if(!active){
  content='<section class="ns-needs-panel"><h2 tabindex="-1" data-needs-focus-heading>Choose a problem area</h2>'+
   '<p class="ns-needs-sub">Start with the part of life that feels hardest. You can narrow it down on the next screen.</p>'+
   '<div class="ns-needs-grid">'+areas.map(areaCard).join('')+'</div></section>';
 }else if(!subdomain){
  content='<button type="button" class="ns-needs-stage-back" data-needs-back-areas>← All problem areas</button>'+
   '<section class="ns-needs-panel"><p class="ns-needs-eyebrow">PROBLEM AREA</p><h2 tabindex="-1" data-needs-focus-heading>'+e(active.title)+'</h2>'+
   '<p class="ns-needs-sub">Which kind of problem within this area is closest to what you are facing?</p>'+
   '<div class="ns-needs-subdomain-grid">'+subdomains.map(subdomainCard).join('')+'</div></section>';
 }else{
  content='<button type="button" class="ns-needs-stage-back" data-needs-back-subdomains>← '+e(active.title)+'</button>'+
   '<section class="ns-needs-panel"><p class="ns-needs-eyebrow">TYPE OF PROBLEM</p><h2 tabindex="-1" data-needs-focus-heading>'+e(subdomain.title)+'</h2>'+
   '<p class="ns-needs-sub">Choose the description that feels closest. It does not need to explain the whole situation.</p>'+
   '<p class="ns-needs-filter-count" role="status">'+subdomain.topics.length+' topics</p>'+
   '<div class="ns-needs-choices">'+subdomain.topics.slice(0,state.limit).map(topicChoiceCard).join('')+'</div>'+
   (subdomain.topics.length>state.limit?'<button type="button" class="ns-needs-more" data-needs-more>Show more topics</button>':'')+'</section>';
 }
 return area('<header class="ns-needs-hero"><p class="ns-needs-eyebrow">NOBODY’S SIMPLE · PROBLEM NAVIGATOR</p>'+
  '<h1>What part of life has been difficult?</h1>'+
  '<p>Choose a broad area, then narrow it to a type of problem and a topic. You can search the full catalogue at any point.</p></header>'+
  '<label class="ns-needs-filter-label" for="needs-problem-search">Search all topics</label>'+
  '<input id="needs-problem-search" type="search" autocomplete="off" placeholder="Try relationships, sleep, identity, work…" value="'+e(state.query)+'" data-needs-search>'+
  content+
  '<p class="ns-needs-footnote">'+atlasProblemIndex.length+' topics are available across these areas. The categories help you find a page; they do not diagnose or explain you.</p>');
}
export function browsableTopicsForNeedsMode(modeId){
 const preferred=new Set(TOPIC_AREAS_BY_MODE[modeId]||[]);
 return [...atlasProblemIndex].sort((a,b)=>
  Number(preferred.has(b.domain))-Number(preferred.has(a.domain)) || a.title.localeCompare(b.title));
}
export function themesForNeedsMode(modeId){
 const topics=browsableTopicsForNeedsMode(modeId);
 return NAV_THEMES.map(t=>({...t,count:topics.reduce((n,p)=>n+Number(topicTheme(p)===t.id),0)}));
}
function focusHeading(root){root.querySelector('[data-needs-focus-heading]')?.focus?.({preventScroll:true});}
export function renderNeedsConsole(root,parts=[]){
 const path=Array.isArray(parts)?parts:[String(parts||'')],mode=path[0]||'';
 if(mode==='atlas'){
  if(path[1]&&path[1]!=='area'&&atlasGet(path[1])&&typeof location!=='undefined'){
   location.hash='#workbook-topic/'+encodeURIComponent(path[1]);return;
  }
  if(typeof location!=='undefined'){location.hash='#navigate';return;}
 }
 if(mode&&getNeedsMode(mode)){
  if(typeof location!=='undefined'){location.hash='#navigate';return;}
 }
 const state={theme:'',subdomain:'',query:'',limit:NAV_TOPIC_PAGE_SIZE};
 const paint=(focus=true)=>{root.innerHTML=landing(state);if(focus)focusHeading(root);};
 root.__nsNeedsState=state;root.__nsNeedsPaint=paint;
 if(root.dataset.nsNeedsNavigatorBound!=='true'){
  root.dataset.nsNeedsNavigatorBound='true';
  root.addEventListener('click',event=>{
   const current=root.__nsNeedsState;if(!current)return;
   const areaChoice=event.target.closest('[data-needs-theme]');
   if(areaChoice){current.theme=areaChoice.dataset.needsTheme;current.subdomain='';current.query='';current.limit=NAV_TOPIC_PAGE_SIZE;root.__nsNeedsPaint();return;}
   const subdomainChoice=event.target.closest('[data-needs-subdomain]');
   if(subdomainChoice){current.subdomain=subdomainChoice.dataset.needsSubdomain;current.query='';current.limit=NAV_TOPIC_PAGE_SIZE;root.__nsNeedsPaint();return;}
   if(event.target.closest('[data-needs-back-areas]')){current.theme='';current.subdomain='';current.query='';root.__nsNeedsPaint();return;}
   if(event.target.closest('[data-needs-back-subdomains]')){current.subdomain='';current.query='';root.__nsNeedsPaint();return;}
   if(event.target.closest('[data-needs-more]')){current.limit+=NAV_TOPIC_PAGE_SIZE;root.__nsNeedsPaint(false);(root.querySelector('[data-needs-more]')||root.querySelector('[data-needs-focus-heading]'))?.focus?.({preventScroll:true});}
  });
  root.addEventListener('input',event=>{
   const input=event.target.closest('[data-needs-search]');if(!input)return;
   const current=root.__nsNeedsState;if(!current)return;
   const caret=input.selectionStart;current.query=input.value;current.limit=NAV_TOPIC_PAGE_SIZE;
   root.__nsNeedsPaint();
   const next=root.querySelector('[data-needs-search]');
   next?.focus?.();if(next&&caret!==null)next.setSelectionRange(caret,caret);
  });
 }
 root.innerHTML=landing(state);
}

// Maintained for catalogue/search unit tests; no separate browse interface uses this.
export function getSubjectMatchesForTest(search='',domain=''){
 const words=norm(search).split(/\s+/).filter(Boolean);
 return atlasProblemIndex.filter(p=>(!domain||p.domain===domain)&&words.every(w=>
  norm(p.id+' '+p.title+' '+p.hint+' '+(p.aliases||[]).join(' ')).includes(w)))
  .sort((a,b)=>a.title.localeCompare(b.title));
}
