import {escapeHTML as esc} from './core.mjs';
import {NEEDS_MODES,getNeedsMode,needsDestination} from './ns-needs-catalog.mjs';
import {atlasProblemIndex,atlasGet,atlasDomains,isSafetyPriority} from './ns-atlas-core.mjs';
import {attachPathGuide} from './ns-pathway-guidebook.mjs';
const e=x=>esc(String(x??''));
const areaNames=new Map(atlasDomains.map(d=>[d.id,d.name]));
const norm=x=>String(x??'').toLocaleLowerCase().replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
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
const featuredTopicAreas=['culture','lgbtq','neuro','disability','family','harm'];
const topicAreaLink=d=>href('#navigate/atlas/area/'+encodeURIComponent(d.id),
 '<strong>'+e(d.name)+'</strong><small>'+e(d.description)+'</small>','ns-needs-area-link');
function landing(){
 return area('<header class="ns-needs-hero"><p class="ns-needs-eyebrow">NOBODY’S SIMPLE · EMOTIONAL CALCULATOR</p>'+
 '<h1>What would help you right now?</h1><p>Choose what you want to do, not what you think is wrong with you. You can change direction at any time.</p></header>'+
 '<section class="ns-needs-panel"><h2>Choose a starting point</h2>'+
 '<div class="ns-needs-grid">'+NEEDS_MODES.map(modeCard).join('')+'</div></section>'+
 '<section class="ns-needs-panel ns-needs-topic-entry" aria-labelledby="ns-needs-browse-title"><h2 id="ns-needs-browse-title">Explore a topic or experience</h2>'+
 '<p class="ns-needs-sub">Browse 518 experiences across 31 areas, including race, LGBTQIA+, neurodivergence, disability, relationships, health and everyday life. Your identity is not a problem to fix.</p>'+
 '<div class="ns-needs-area-grid">'+atlasDomains.filter(d=>featuredTopicAreas.includes(d.id)).map(topicAreaLink).join('')+'</div>'+
 '<details class="ns-needs-area-details"><summary>See every topic area ('+atlasDomains.length+')</summary><div class="ns-needs-area-grid">'+atlasDomains.filter(d=>!featuredTopicAreas.includes(d.id)).map(topicAreaLink).join('')+'</div></details>'+
 '<p><a class="ns-needs-cta" href="#navigate/atlas">Search all 518 topics →</a></p></section>'+
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
 '<span><strong>'+e(p.title)+'</strong><small class="ns-needs-topic-area">'+e(areaNames.get(p.domain)||'Topic')+'</small><small>'+e(p.hint)+'</small></span><span class="ns-needs-next" aria-hidden="true">→</span>',
 'ns-needs-topic');
}
function getSubjectMatches(search,domain){
 let set=atlasProblemIndex.filter(p=>!domain||p.domain===domain);
 const words=norm(search).split(/\s+/).filter(Boolean);
 if(words.length)set=set.filter(p=>{const hay=norm(p.id+' '+p.title+' '+p.hint+' '+(p.aliases||[]).join(' '));return words.every(w=>hay.includes(w));});
 return set.sort((a,b)=>a.title.localeCompare(b.title));
}
function atlasScreen(root,initialDomain=''){
 root.innerHTML=area('<header class="ns-needs-header ns-tone-lilac"><p class="ns-needs-eyebrow">PSYCHOLOGICAL ATLAS</p>'+
 '<h1>Explore an experience or difficulty</h1><p>Find a topic about feelings, relationships, identity, discrimination, disability, health or everyday life. Identities are not disorders. Every topic opens a guide with optional reflection and practical support.</p></header>'+
 '<section class="ns-needs-panel"><label class="ns-needs-search-label" for="needs-topic-search">Search a named difficulty</label>'+
 '<input id="needs-topic-search" type="search" autocomplete="off" placeholder="e.g. racism, ADHD, LGBTQIA+, grief, insomnia…" data-needs-search>'+
 '<p class="ns-needs-footnote">Search filters topic names and descriptions. It does not interpret your symptoms or decide what condition you have.</p>'+
 '<p class="ns-needs-footnote">Start with a common area, or use the full area selector to browse every subject.</p>'+ 
 '<div class="ns-needs-filter" role="group" aria-label="Quick topic filters"><button type="button" data-needs-domain="" aria-pressed="true">All topics</button>'+
 ['culture','lgbtq','neuro','disability','harm','family'].map(id=>'<button type="button" data-needs-domain="'+e(id)+'" aria-pressed="false">'+e(areaNames.get(id))+'</button>').join('')+'</div>'+ 
 '<label class="ns-needs-search-label" for="needs-topic-area">Or choose any topic area</label>'+ 
 '<select id="needs-topic-area" data-needs-domain-select><option value="">All topic areas</option>'+atlasDomains.map(d=>'<option value="'+e(d.id)+'">'+e(d.name)+'</option>').join('')+'</select>'+
 '<div data-needs-match-count role="status" class="ns-needs-match-count"></div><div data-needs-topic-results class="ns-needs-subjects"></div>'+ 
 '<button type="button" class="ns-needs-more" data-needs-more hidden>Show more topics</button>'+
 '</section>', '#navigate/learn');
 let search='',domain=atlasDomains.some(d=>d.id===initialDomain)?initialDomain:'',shown=48;
 const paint=()=>{
  const list=getSubjectMatches(search,domain);
  root.querySelector('[data-needs-match-count]').textContent=list.length?('Showing '+Math.min(shown,list.length)+' of '+list.length+' topics'): 'No matching topics';
  root.querySelector('[data-needs-topic-results]').innerHTML=list.length?list.slice(0,shown).map(subjectCard).join(''):
   '<p class="ns-needs-empty">No topic matches those words. Try a broader name, choose another area, or return to the starting points.</p>';
  root.querySelectorAll('[data-needs-domain]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.needsDomain===domain)));
  root.querySelector('[data-needs-domain-select]').value=domain;
  const more=root.querySelector('[data-needs-more]');more.hidden=shown>=list.length;
  more.textContent='Show more topics ('+(list.length-Math.min(shown,list.length))+' remaining)';
 };
 const filter=(id)=>{domain=id;shown=48;paint();};
 root.querySelector('[data-needs-search]').addEventListener('input',event=>{search=event.target.value;shown=48;paint()});
 root.querySelectorAll('[data-needs-domain]').forEach(b=>b.addEventListener('click',()=>filter(b.dataset.needsDomain)));
 root.querySelector('[data-needs-domain-select]').addEventListener('change',event=>filter(event.target.value));
 root.querySelector('[data-needs-more]').addEventListener('click',()=>{shown+=48;paint()});
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
 optionCard({title:topic.contextFirst?'Understand this experience':'Understand this difficulty',description:topic.contextFirst?'Explore context, practical barriers, safety, choices and sources of support.':'Recognise its signs, possible maintaining processes, contributors and sources.',type:'topic',target:id})+
 (risk?optionCard({title:'Consider safety and appropriate support first',description:'Some experiences require more than a self-help exercise.',type:'activity',target:'support-safety'}):
 optionCard({title:'Try a practical exercise',description:'An optional worksheet that explores one aspect of this experience.',type:'tool',target:'atlas-'+id}))+
 optionCard({title:'Process how this is affecting me',description:'Express or reflect without needing to change how you feel.',type:'activity',target:'process-event'})+
 optionCard({title:'Feel steadier first',description:'Try a gentle grounding or settling exercise.',type:'activity',target:'steady-overwhelm'})+
 '</div><p class="ns-needs-footnote">A topic is not a diagnosis. Identities, backgrounds and preferences are not conditions to cure. These new entries are editorial guides, not individually validated treatments.</p></section>',
 '#navigate/atlas');
}
export function renderNeedsConsole(root,parts=[]){
 const path=Array.isArray(parts)?parts:[String(parts||'')];
 const mode=path[0]||'';
 if(mode==='atlas'&&path[1]==='area')atlasScreen(root,path[2]);
 else if(mode==='atlas'&&path[1])root.innerHTML=topicScreen(path[1]);
 else if(mode==='atlas')atlasScreen(root);
 else if(getNeedsMode(mode))root.innerHTML=modeScreen(getNeedsMode(mode));
 else root.innerHTML=landing();
}
export const getSubjectMatchesForTest=getSubjectMatches;
