import {escapeHTML as esc} from './core.mjs';
import {NEEDS_MODES,getNeedsMode,needsDestination} from './ns-needs-catalog.mjs';
import {atlasProblemIndex,atlasGet,atlasDomains,isSafetyPriority} from './ns-atlas-core.mjs';
import {attachPathGuide} from './ns-pathway-guidebook.mjs';
const e=x=>esc(String(x??''));
const href=(url,title,cls='')=>'<a class="'+cls+'" href="'+e(url)+'">'+title+'</a>';
const area=(body,back='#home')=>'<div class="ns-needs">'+
 '<nav class="ns-needs-top" aria-label="Navigator"><a href="'+e(back)+'">← '+(back==='#home'?'Home':'Back')+'</a>'+
 '<a href="#need/support-safety">Safety and urgent support</a></nav>'+body+'</div>';
const modeCard=(mode)=>'<a class="ns-needs-mode ns-tone-'+e(mode.tone)+'" href="#navigate/'+e(mode.id)+'">'+
 '<span class="ns-needs-mode-mark" aria-hidden="true">'+e(mode.icon)+'</span><span class="ns-needs-mode-content"><strong>'+e(mode.title)+'</strong>'+
 '<small>'+e(mode.summary)+'</small></span><span class="ns-needs-next" aria-hidden="true">↗</span></a>';
const optionCard=(option)=>href(needsDestination(option),
 '<span><strong>'+e(option.title)+'</strong><small>'+e(option.description)+'</small></span><span class="ns-needs-next" aria-hidden="true">→</span>',
 'ns-needs-choice');
function landing(){
 return area('<header class="ns-needs-hero"><p class="ns-needs-eyebrow">NOBODY’S SIMPLE · EMOTIONAL CALCULATOR</p>'+
 '<h1>What would help you right now?</h1><p>Choose what you want to do, not what you think is wrong with you. You can change direction at any time.</p></header>'+
 '<section class="ns-needs-panel"><h2>Choose a starting point</h2>'+
 '<div class="ns-needs-grid">'+NEEDS_MODES.map(modeCard).join('')+'</div></section>'+
 '<p class="ns-needs-footnote">No questionnaire or diagnosis is required. Each choice opens a continuous guide with the explanation, research-informed options and practical exercises together on one page.</p>');
}
function modeScreen(mode){
 return area('<header class="ns-needs-header ns-tone-'+e(mode.tone)+'"><p class="ns-needs-eyebrow">YOUR CHOICE · '+e(mode.title.toUpperCase())+'</p>'+
 '<h1>'+e(mode.title)+'</h1><p>'+e(mode.summary)+'</p></header>'+
 '<section class="ns-needs-panel"><h2>What feels closest?</h2><p class="ns-needs-sub">Choose one to open its field guide: read about the experience and try practical worksheets directly under each approach, without leaving the page.</p>'+
 '<div class="ns-needs-choices">'+mode.options.map(optionCard).join('')+'</div></section>'+
 '<p class="ns-needs-footnote">Different situations need different support. You can always '+href('#navigate','change your starting point')+'.</p>',
 '#navigate');
}
function subjectCard(p){
 return href('#workbook-topic/'+encodeURIComponent(p.id),
 '<span><strong>'+e(p.title)+'</strong><small>'+e(p.hint)+'</small></span><span class="ns-needs-next" aria-hidden="true">→</span>',
 'ns-needs-topic');
}
function getSubjectMatches(search,domain){
 let set=atlasProblemIndex.filter(p=>!domain||p.domain===domain);
 const q=String(search||'').trim().toLocaleLowerCase();
 if(q)set=set.filter(p=>(p.title+' '+p.hint+' '+(p.aliases||[]).join(' ')).toLocaleLowerCase().includes(q));
 return set.sort((a,b)=>a.title.localeCompare(b.title));
}
function atlasScreen(root){
 root.innerHTML=area('<header class="ns-needs-header ns-tone-lilac"><p class="ns-needs-eyebrow">PSYCHOLOGICAL ATLAS</p>'+
 '<h1>Choose a specific difficulty</h1><p>Browse named experiences without being assigned a diagnosis. Every topic opens an integrated guide with optional worksheets inside the chapters.</p></header>'+
 '<section class="ns-needs-panel"><label class="ns-needs-search-label" for="needs-topic-search">Search a named difficulty</label>'+
 '<input id="needs-topic-search" type="search" autocomplete="off" placeholder="e.g. insomnia, rumination, boundaries…" data-needs-search>'+
 '<p class="ns-needs-footnote">Search filters topic names and descriptions. It does not interpret your symptoms or decide what condition you have.</p>'+
 '<div class="ns-needs-filter" role="group" aria-label="Filter topics by area"><button type="button" data-needs-domain="" aria-pressed="true">All topics</button>'+
 atlasDomains.map(d=>'<button type="button" data-needs-domain="'+e(d.id)+'" aria-pressed="false">'+e(d.name)+'</button>').join('')+'</div>'+
 '<div data-needs-match-count role="status" class="ns-needs-match-count"></div><div data-needs-topic-results class="ns-needs-subjects"></div>'+
 '</section>', '#navigate/learn');
 let search='',domain='';
 const paint=()=>{
  const list=getSubjectMatches(search,domain);
  root.querySelector('[data-needs-match-count]').textContent=list.length+' named '+(list.length===1?'difficulty':'difficulties')+' shown';
  root.querySelector('[data-needs-topic-results]').innerHTML=list.length?list.map(subjectCard).join(''):
   '<p class="ns-needs-empty">No topic matches those words. Try a broader name, choose another area, or return to the starting points.</p>';
  root.querySelectorAll('[data-needs-domain]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.needsDomain===domain)));
 };
 root.querySelector('[data-needs-search]').addEventListener('input',event=>{search=event.target.value;paint()});
 root.querySelectorAll('[data-needs-domain]').forEach(b=>b.addEventListener('click',()=>{domain=b.dataset.needsDomain;paint()}));
 paint();
 attachPathGuide(root,'learn','browse',{label:'How to use the atlas'});
}
function topicScreen(id){
 const topic=atlasGet(id);
 if(!topic)return area('<section class="ns-needs-panel"><h1>We could not find this topic.</h1>'+
 '<p>Return to the atlas to choose another difficulty.</p>'+href('#navigate/atlas','Browse topics','ns-needs-cta')+'</section>','#navigate/atlas');
 const risk=isSafetyPriority(id);
 return area('<header class="ns-needs-header ns-tone-lilac"><p class="ns-needs-eyebrow">YOU CHOSE A TOPIC</p>'+
 '<h1>'+e(topic.title)+'</h1><p>'+e(topic.hint)+'</p></header>'+
 '<section class="ns-needs-panel"><h2>What would you like to do with this?</h2>'+
 '<div class="ns-needs-choices">'+
 optionCard({title:'Understand this difficulty',description:'Recognise its signs, possible maintaining processes, contributors and sources.',type:'topic',target:id})+
 (risk?optionCard({title:'Consider safety and appropriate support first',description:'Some experiences require more than a self-help exercise.',type:'activity',target:'support-safety'}):
 optionCard({title:'Try a practical exercise',description:'An optional worksheet that explores one aspect of the difficulty.',type:'tool',target:'atlas-'+id}))+
 optionCard({title:'Process how this is affecting me',description:'Express or reflect without needing to change how you feel.',type:'activity',target:'process-event'})+
 optionCard({title:'Feel steadier first',description:'Try a gentle grounding or settling exercise.',type:'activity',target:'steady-overwhelm'})+
 '</div><p class="ns-needs-footnote">A named topic is not a diagnosis. The educational guides include optional personal formulation, not compulsory testing.</p></section>',
 '#navigate/atlas');
}
export function renderNeedsConsole(root,parts=[]){
 const path=Array.isArray(parts)?parts:[String(parts||'')];
 const mode=path[0]||'';
 if(mode==='atlas'&&path[1])root.innerHTML=topicScreen(path[1]);
 else if(mode==='atlas')atlasScreen(root);
 else if(getNeedsMode(mode))root.innerHTML=modeScreen(getNeedsMode(mode));
 else root.innerHTML=landing();
}
export const getSubjectMatchesForTest=getSubjectMatches;
