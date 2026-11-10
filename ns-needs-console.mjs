/* Needs-first navigation: one continuous grid per starting point.
 * Every named atlas entry is presented as the same choice card as a practical
 * activity and opens the existing integrated field guide directly.
 */
import {escapeHTML as esc} from './core.mjs';
import {NEEDS_MODES,getNeedsMode,needsDestination} from './ns-needs-catalog.mjs';
import {atlasProblemIndex,atlasGet,atlasDomains} from './ns-atlas-core.mjs';

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

const topicChoiceCard=topic=>href('#workbook-topic/'+encodeURIComponent(topic.id),
 '<span><strong>'+e(topic.title)+'</strong><small>'+e(topic.hint)+'</small></span><span class="ns-needs-next" aria-hidden="true">→</span>',
 'ns-needs-choice');

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
function modeScreen(mode){
 const topics=topicsForNeedsMode(mode.id);
 return area('<header class="ns-needs-header ns-tone-'+e(mode.tone)+'"><p class="ns-needs-eyebrow">YOUR CHOICE · '+e(mode.title.toUpperCase())+'</p>'+
 '<h1>'+e(mode.title)+'</h1><p>'+e(mode.summary)+'</p></header>'+
 '<section class="ns-needs-panel"><h2>What feels closest?</h2><p class="ns-needs-sub">Choose one to open its field guide: read about the experience and try practical worksheets directly under each approach, without leaving the page. These topics are not diagnoses.</p>'+
 '<label class="ns-needs-filter-label" for="needs-choice-filter">Filter these choices (optional)</label>'+
 '<input id="needs-choice-filter" type="search" autocomplete="off" placeholder="Find a choice in the cards below…" data-needs-choice-filter>'+
 '<p class="ns-needs-filter-count" data-needs-choice-count role="status" aria-live="polite"></p>'+
 '<div class="ns-needs-choices">'+mode.options.map(optionCard).join('')+topics.map(topicChoiceCard).join('')+'</div></section>'+
 '<p class="ns-needs-footnote">Different situations need different support. You can always '+href('#navigate','change your starting point')+'.</p>',
 '#navigate');
}
function wireModeFilter(root){
 const filter=root.querySelector('[data-needs-choice-filter]');
 if(!filter)return;
 const cards=[...root.querySelectorAll('.ns-needs-choices > .ns-needs-choice')];
 const count=root.querySelector('[data-needs-choice-count]');
 const update=()=>{
  const words=norm(filter.value).split(/\s+/).filter(Boolean);
  let visible=0;
  for(const card of cards){
   const match=words.every(word=>norm(card.textContent).includes(word));
   card.hidden=!match;
   if(match)visible++;
  }
  if(count)count.textContent=words.length?(visible+' matching choices'):'';
 };
 filter.addEventListener('input',update);
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
  root.innerHTML=modeScreen(getNeedsMode('learn'));wireModeFilter(root);return;
 }
 const chosen=getNeedsMode(mode);
 if(chosen){root.innerHTML=modeScreen(chosen);wireModeFilter(root);}
 else root.innerHTML=landing();
}

// Maintained for catalogue/search unit tests; no separate browse interface uses this.
export function getSubjectMatchesForTest(search='',domain=''){
 const words=norm(search).split(/\s+/).filter(Boolean);
 return atlasProblemIndex.filter(p=>(!domain||p.domain===domain)&&words.every(w=>
  norm(p.id+' '+p.title+' '+p.hint+' '+(p.aliases||[]).join(' ')).includes(w)))
  .sort((a,b)=>a.title.localeCompare(b.title));
}
