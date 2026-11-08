import {escapeHTML as esc} from './core.mjs';
import {atlasGet,atlasByDomain,atlasSearch,atlasDomains,atlasProfile,atlasCount,isSafetyPriority} from './ns-atlas-core.mjs';
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
function first(state){
 const items=state.query.trim()?atlasSearch(state.query,24):state.domain?atlasByDomain(state.domain).slice(0,60):favorites.map(atlasGet).filter(Boolean);
 return shell('<div class="ns-atlas-modes" role="group" aria-label="What would help?">'+
 '<button type="button" data-atlas-mode="tools" aria-pressed="'+(state.mode==='tools')+'"><strong>Find something to try</strong><small>One practical exercise matched to your situation</small></button>'+
 '<button type="button" data-atlas-mode="learn" aria-pressed="'+(state.mode==='learn')+'"><strong>Understand & learn</strong><small>Clear psychoeducation and a personal formulation</small></button></div>'+
 '<section class="ns-atlas-main"><p class="eyebrow">CHOOSE YOUR DIFFICULTY</p><h2>Find what feels closest.</h2>'+
 '<label class="ns-atlas-search"><span class="sr-only">Search psychological experiences</span><input data-atlas-search type="search" maxlength="120" value="'+s(state.query)+'" placeholder="Search: waking at night, reassurance, shame, feeling controlled…"><span aria-hidden="true">⌕</span></label>'+
 '<div class="ns-atlas-domains" aria-label="Browse problem areas"><button data-atlas-domain="" type="button" aria-pressed="'+(!state.domain)+'">Common problems</button>'+
 atlasDomains.map(d=>'<button data-atlas-domain="'+s(d.id)+'" type="button" aria-pressed="'+(state.domain===d.id)+'">'+s(d.name)+'</button>').join('')+'</div>'+
 '<div class="ns-atlas-list" data-atlas-results>'+(items.length?items.map(item).join(''):
 '<p class="ns-atlas-noresults">No precise match. This library is still expanding; avoid forcing a label. You can describe the situation in an open-ended tool. <a href="#tool/context-map">Open Context Map →</a></p>')+'</div>'+
 '<p class="ns-atlas-footnote">'+atlasCount+' mapped entries (not 166 diagnoses). A difficulty can have several explanations and may overlap with others. You can always come back and change your selection.</p></section>');
}
function step(profile,state){
 const options=state.stage===1?profile.variants.map((label,i)=>({id:'v'+i,label})):
 [...profile.maintainers.map(m=>({id:m.id,label:m.label,description:m.detail})),{id:'unknown',label:'Several factors / not sure',description:'You do not need to guess.'}];
 const title=state.stage===1?'Which version is most like yours?':'What might be keeping it going?';
 const answer=state.stage===1?state.variant:state.maintainer;
 return shell('<section class="ns-atlas-main ns-atlas-question"><div class="ns-atlas-step"><span>QUESTION '+state.stage+' OF 2 · '+s(profile.title)+'</span><i style="width:'+(state.stage===1?0:50)+'%"></i></div>'+
 '<h2>'+title+'</h2><p>'+(state.stage===1?'Choose what describes the context most closely. You can later select many more signs and contributors.':'This is only a hypothesis to explore. You will be able to revise it and add other explanations.')+'</p>'+
 '<div class="ns-atlas-options">'+options.map(o=>'<label><input type="radio" name="atlas-step" value="'+s(o.id)+'" '+(answer===o.id?'checked':'')+'><span><strong>'+s(o.label)+'</strong>'+
 (o.description?'<small>'+s(o.description)+'</small>':'')+'</span></label>').join('')+'</div>'+
 '<div class="ns-atlas-actions"><button class="button secondary" type="button" data-atlas-back>← Back</button>'+
 '<button class="button" type="button" data-atlas-continue disabled>'+(state.stage===1?'Continue':'Get my '+(state.mode==='learn'?'guide':'exercise'))+' →</button></div>'+
 '<button type="button" data-atlas-skip class="ns-atlas-skip">Skip this question</button>'+
 (isSafetyPriority(profile.id)?'<div class="ns-atlas-safety"><strong>Support is more important than a questionnaire.</strong><p>If you are in immediate danger in the UK, call 999. For urgent mental health support, contact NHS 111 and select the mental health option.</p><a href="'+s(nhsHelp)+'" target="_blank" rel="noopener noreferrer">NHS urgent support ↗</a></div>':'')+
 '</section>');
}
export function renderAtlasConsole(root){
 const state={mode:'tools',domain:'',query:'',selected:'',variant:'',maintainer:'',stage:0};
 const select=id=>{
  if(!atlasGet(id))return;
  state.selected=id;state.variant='';state.maintainer='';state.stage=isSafetyPriority(id)?2:1;paint(true);
 };
 const next=()=>{
  handoff={id:state.selected,variant:state.variant,maintainer:state.maintainer,mode:state.mode};
  location.hash=state.mode==='learn'?'#problem/'+state.selected:'#tool/atlas-'+state.selected;
 };
 const paint=(jump=false)=>{
  root.innerHTML=state.stage?step(atlasProfile(state.selected),state):first(state);
  bind();if(jump)safeScroll();
 };
 const bind=()=>{
  root.querySelectorAll('[data-atlas-mode]').forEach(b=>b.onclick=()=>{
   state.mode=b.dataset.atlasMode;paint();
  });
  root.querySelectorAll('[data-atlas-domain]').forEach(b=>b.onclick=()=>{
   state.domain=b.dataset.atlasDomain;state.query='';paint();
  });
  root.querySelectorAll('[data-atlas-pick]').forEach(b=>b.onclick=()=>select(b.dataset.atlasPick));
  const search=root.querySelector('[data-atlas-search]');
  if(search)search.oninput=()=>{
   state.query=search.value;const target=root.querySelector('[data-atlas-results]');
   const candidates=state.query.trim()?atlasSearch(state.query,24):state.domain?atlasByDomain(state.domain).slice(0,60):favorites.map(atlasGet).filter(Boolean);
   target.innerHTML=candidates.length?candidates.map(item).join(''):
   '<p class="ns-atlas-noresults">No precise match. Try another description or explore <a href="#tool/context-map">Context Map</a>.</p>';
   target.querySelectorAll('[data-atlas-pick]').forEach(b=>b.onclick=()=>select(b.dataset.atlasPick));
  };
  const answer=root.querySelector('input[name="atlas-step"]:checked');
  if(answer){const button=root.querySelector('[data-atlas-continue]');if(button)button.disabled=false}
  root.querySelectorAll('input[name="atlas-step"]').forEach(x=>x.onchange=()=>{
   root.querySelector('[data-atlas-continue]').disabled=false;
  });
  root.querySelector('[data-atlas-back]')?.addEventListener('click',()=>{
   state.stage=Math.max(0,state.stage-1);paint(true);
  });
  const advance=skip=>{
   const choice=skip?null:root.querySelector('input[name="atlas-step"]:checked');if(!skip&&!choice)return;
   if(state.stage===1){
    state.variant=choice?.value||'';state.stage=2;paint(true);
   }else{
    state.maintainer=choice?.value||'';next();
   }
  };
  root.querySelector('[data-atlas-continue]')?.addEventListener('click',()=>advance(false));
  root.querySelector('[data-atlas-skip]')?.addEventListener('click',()=>advance(true));
 };
 paint();
}
