import {escapeHTML as esc} from './core.mjs';
import {atlasGet,atlasSearch,atlasThemes,atlasByTheme,atlasCount} from './ns-atlas-core.mjs';
import {nhsHelp} from './ns-problem-map.mjs';
const s=x=>esc(String(x??''));
let handoff=null;
export const getAtlasHandoff=id=>handoff?.id===id?handoff:null;
export const clearAtlasHandoff=()=>{handoff=null;};
const safeScroll=()=>{try{window.scrollTo({top:0,behavior:'instant'})}catch{}};
const favorites=['social-anxiety','insomnia','rumination','procrastination','submissive-patterns','panic-experiences','checking','focus','boundaries','fatigue','overwhelm','health-worry'];
function item(p){
 return '<button type="button" class="ns-atlas-item" data-atlas-pick="'+s(p.id)+'"><strong>'+s(p.title)+'</strong><small>'+s(p.hint).slice(0,138)+'</small><span aria-hidden="true">→</span></button>';
}
function shell(body){
 return '<div class="ns-atlas-shell"><a class="ns-atlas-back" href="#home">← Back to Home</a><header class="ns-atlas-header">'+
 '<p class="eyebrow">NOBODY’S SIMPLE · EMOTIONAL CALCULATOR</p><h1>What exactly is happening?</h1>'+
 '<p>Start with the experience, not a diagnosis. Find a useful exercise or understand the patterns that might be involved.</p></header>'+body+'</div>';
}
function themeCards(){
 return '<div class="ns-atlas-themes" data-atlas-theme-grid aria-label="Choose a problem theme">'+atlasThemes.map(t=>{
  const count=atlasByTheme(t.id).length;
  return '<button type="button" class="ns-atlas-theme-card" data-atlas-theme="'+s(t.id)+'"><span class="ns-atlas-theme-icon" aria-hidden="true">'+s(t.icon)+'</span><span><strong>'+s(t.name)+'</strong><small>'+s(t.description)+'</small><em>'+count+' topics</em></span><span class="ns-atlas-theme-arrow" aria-hidden="true">→</span></button>';
 }).join('')+'</div>';
}
function first(state){
 const active=atlasThemes.find(t=>t.id===state.theme);
 const items=state.query.trim()?atlasSearch(state.query,36):active?atlasByTheme(active.id).slice(0,state.limit):[];
 const listTitle=state.query.trim()?'Search results':active?'Problems in '+active.name:'';
 return shell('<div class="ns-atlas-modes" role="group" aria-label="What would help?">'+
 '<button type="button" data-atlas-mode="tools" aria-pressed="'+(state.mode==='tools')+'"><strong>Find something to try</strong><small>One practical exercise matched to your situation</small></button>'+
 '<button type="button" data-atlas-mode="learn" aria-pressed="'+(state.mode==='learn')+'"><strong>Understand & learn</strong><small>Clear explanations and a personal guide</small></button></div>'+
 '<section class="ns-atlas-main"><p class="eyebrow">BROWSE BY THEME</p><h2>'+(active?s(active.name):'What part of life feels difficult right now?')+'</h2>'+
 '<p class="ns-atlas-theme-intro">'+(active?s(active.description)+' Choose a problem card below to open its guide.':"Start with the part that feels closest. Each theme opens a set of specific experiences; you can also search in your own words.")+'</p>'+
 '<label class="ns-atlas-search"><span class="sr-only">Search problems</span><input data-atlas-search type="search" maxlength="120" value="'+s(state.query)+'" placeholder="Search: boundaries, waking at night, stigma, deadlines…"><span aria-hidden="true">⌕</span></label>'+
 (active?'<button type="button" class="ns-atlas-theme-back" data-atlas-themes-back>← All themes</button>':'')+
 (active||state.query?'<h3 class="ns-atlas-results-heading">'+s(listTitle)+'</h3><div class="ns-atlas-list" data-atlas-results>'+(items.length?items.map(item).join(''):
 '<p class="ns-atlas-noresults">No precise match yet. Try another phrase or choose a theme.</p>')+'</div>'+
 (active&&!state.query.trim()&&items.length<atlasByTheme(active.id).length?'<button class="ns-atlas-more" type="button" data-atlas-more>Show more problems</button>':''):
 themeCards()+'<div class="ns-atlas-list" data-atlas-results hidden></div>')+
 '<p class="ns-atlas-footnote">'+atlasCount+' topics describe experiences, not diagnoses. A difficulty can have several explanations and may overlap with others.</p></section>');
}
export function renderAtlasConsole(root){
 const state={mode:'tools',theme:'',query:'',limit:24};
 const select=id=>{
  if(!atlasGet(id))return;
  handoff={id,variant:'',maintainer:'',mode:state.mode};
  location.hash=state.mode==='learn'?'#problem/'+id:'#tool/atlas-'+id;
 };
 const paint=(jump=false)=>{
  root.innerHTML=first(state);
  bind();
  if(jump)safeScroll();
 };
 const bind=()=>{
  root.querySelectorAll('[data-atlas-mode]').forEach(b=>b.onclick=()=>{
   state.mode=b.dataset.atlasMode;paint();
  });
  root.querySelectorAll('[data-atlas-theme]').forEach(b=>b.onclick=()=>{
   state.theme=b.dataset.atlasTheme;state.query='';state.limit=24;paint(true);
  });
  root.querySelector('[data-atlas-themes-back]')?.addEventListener('click',()=>{
   state.theme='';state.query='';paint(true);
  });
  root.querySelectorAll('[data-atlas-pick]').forEach(b=>b.onclick=()=>select(b.dataset.atlasPick));
  root.querySelector('[data-atlas-more]')?.addEventListener('click',()=>{
   state.limit+=24;paint();
  });
  const search=root.querySelector('[data-atlas-search]');
  if(search)search.oninput=()=>{
   state.query=search.value;state.limit=24;
   const target=root.querySelector('[data-atlas-results]');
   if(!target){return;}
   const grid=root.querySelector('[data-atlas-theme-grid]');
   if(grid)grid.hidden=!!state.query.trim();
   target.hidden=!state.query.trim();
   const candidates=state.query.trim()?atlasSearch(state.query,36):atlasByTheme(state.theme).slice(0,state.limit);
   target.innerHTML=candidates.length?candidates.map(item).join(''):
    '<p class="ns-atlas-noresults">No precise match yet. Try another phrase or choose a theme.</p>';
   target.querySelectorAll('[data-atlas-pick]').forEach(b=>b.onclick=()=>select(b.dataset.atlasPick));
   const heading=root.querySelector('.ns-atlas-results-heading');
   if(heading)heading.textContent=state.query.trim()?'Search results':'Problems in '+(atlasThemes.find(t=>t.id===state.theme)?.name||'this theme');
   const more=root.querySelector('[data-atlas-more]');
   if(more)more.hidden=!!state.query.trim()||candidates.length>=atlasByTheme(state.theme).length;
  };
 };
 paint();
}