/* Context-specific guidebooks that remain available during live tool use.
 * Native dialog keeps the form below intact and handles modal focus.
 */
import {escapeHTML as esc} from './core.mjs';
import {SETTLING_ACTIVITIES} from './ns-needs-activities.mjs';
import {STEADY_GUIDES_A} from './ns-steady-guides-a.mjs';
import {STEADY_GUIDES_B} from './ns-steady-guides-b.mjs';
import {STEADY_LANES,STEADY_REFERENCES} from './ns-steady-guide-utils.mjs';
const e=x=>esc(String(x??''));
export const STEADY_GUIDEBOOKS=Object.freeze({...STEADY_GUIDES_A,...STEADY_GUIDES_B});
export function steadyGuide(id){return STEADY_GUIDEBOOKS[id]||null}
export function guidebooksForTool(toolId){
 return Object.keys(SETTLING_ACTIVITIES).filter(id=>SETTLING_ACTIVITIES[id].strategies.some(x=>x.tool===toolId)&&steadyGuide(id));
}
const strategiesFor=(guide,laneId)=>(guide?.lanes?.[laneId]||[]);
const booksHtml=(guide,id)=>{
 const sources=[...new Set([...guide.refs,...STEADY_LANES.flatMap(lane=>strategiesFor(guide,lane.id).flatMap(x=>x.refs||[]))])];
 return '<article class="ns-guidebook" aria-label="'+e(guide.title)+'">'+
 '<div class="ns-guidebook-cover"><p class="ns-guidebook-eyebrow">NOBODY’S SIMPLE · FEEL STEADIER · FULL GUIDEBOOK</p>'+
 '<h2 id="ns-guidebook-title">'+e(guide.title)+'</h2><p>'+e(guide.subtitle)+'</p>'+
 '<p class="ns-guidebook-status">'+e(guide.reviewStatus)+'</p></div>'+
 '<div class="ns-guidebook-toc" aria-label="Contents"><strong>In this guide</strong><div>'+
 STEADY_LANES.map(x=>'<a href="#guide-'+e(id)+'-'+e(x.id)+'">'+e(x.label)+'</a>').join('')+
 '<a href="#guide-'+e(id)+'-sources">Evidence and sources</a></div></div>'+
 '<section class="ns-guidebook-recognition"><h3>1. What am I experiencing?</h3><p>'+e(guide.what)+'</p>'+
 '<h4>What this can look like</h4><ul>'+guide.variations.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>'+
 '<h4>One possible feedback cycle</h4><p>'+e(guide.possibleLoop)+'</p>'+
 '<h4>What might be contributing?</h4><ul>'+guide.contributors.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>'+
 '</section>'+
 '<section class="ns-guidebook-priorities"><h3>2. What am I trying to change?</h3><ul>'+guide.goals.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>'+
 '<p><strong>What progress can look like:</strong> '+e(guide.progress)+'</p></section>'+
 '<section class="ns-guidebook-caution" role="note"><h3>Before choosing a method</h3><ul>'+guide.cautions.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>'+
 '<a href="#need/support-safety">Open the safety and support page →</a></section>'+
 '<section class="ns-guidebook-methods"><h3>3. Approaches worth considering</h3>'+
 '<p>You do not need to use every method. Choose a relevant approach, check its limits, and adjust or stop if unsuitable. CBT, DBT and ACT labels describe principles; these exercises are not complete treatment protocols.</p>'+
 STEADY_LANES.map((lane,idx)=>'<details class="ns-guidebook-lane" id="guide-'+e(id)+'-'+e(lane.id)+'" '+(idx===0?'open':'')+'>'+
 '<summary><span><strong>'+e(lane.label)+'</strong><small>'+e(lane.description)+'</small></span><span aria-hidden="true">⌄</span></summary>'+
 '<div class="ns-guidebook-method-list">'+strategiesFor(guide,lane.id).map((m,i)=>
 '<article class="ns-guidebook-method"><h4>'+e(m.title)+'</h4><p class="ns-guidebook-why">'+e(m.why)+'</p>'+
 '<ol>'+m.steps.map(t=>'<li>'+e(t)+'</li>').join('')+'</ol>'+
 (m.caution?'<p class="ns-guidebook-method-warning"><strong>When to adapt or avoid:</strong> '+e(m.caution)+'</p>':'')+
 '<p class="ns-guidebook-method-evidence">'+e(m.note)+' · '+m.refs.map(ref=>e(STEADY_REFERENCES[ref]?.name||ref)).join('; ')+'</p>'+
 '<button type="button" class="ns-guidebook-pick" data-guide-choose="'+e(lane.id)+':'+i+'">Keep this step beside my tool ↗</button>'+
 '</article>').join('')+'</div></details>').join('')+'</section>'+
 '<section class="ns-guidebook-sources" id="guide-'+e(id)+'-sources"><h3>4. Evidence, limits and further help</h3>'+
 '<p>These sources inform the principles or clinical cautions above. Their inclusion does not mean this specific interactive guidebook or each micro-exercise has been independently tested. This is a reviewed-source editorial draft, not a clinical endorsement.</p>'+
 '<ul>'+sources.map(s=>STEADY_REFERENCES[s]?'<li><a href="'+e(STEADY_REFERENCES[s].url)+'" target="_blank" rel="noopener noreferrer">'+e(STEADY_REFERENCES[s].name)+' ↗</a><small>'+e(STEADY_REFERENCES[s].type)+' · '+e(STEADY_REFERENCES[s].scope)+'</small></li>':'').join('')+'</ul>'+
 '<p class="ns-guidebook-final">This information supports understanding and choice. For persistent, severe, unfamiliar or unsafe symptoms, appropriate professional or emergency care may be needed.</p></section></article>';
};
function methodByKey(guide,key){
 const [laneId,index]=String(key||'').split(':');const lane=STEADY_LANES.find(x=>x.id===laneId);
 const method=strategiesFor(guide,laneId)[Number(index)];
 return lane&&method?{method,lane}:null;
}
const activeGuideKeys=new Map();
export function attachSteadyGuidebook(root,id,{position='after-header',label='Full guide: everything that could help'}={}){
 const guide=steadyGuide(id);if(!guide||!root||typeof document==='undefined')return null;
 root.querySelector('[data-steady-guide-widget]')?.remove();
 const widget=document.createElement('div');widget.className='ns-steady-guide-widget';widget.dataset.steadyGuideWidget=id;
 widget.innerHTML='<div class="ns-steady-guide-bar"><div><strong>Want more ways to work with this?</strong>'+
 '<p>Explore practical, cognitive, DBT-informed and ACT-informed options without leaving your tool.</p></div>'+
 '<button type="button" data-guide-open aria-haspopup="dialog">📖 '+e(label)+'</button></div><div data-guide-pinned></div>';
 const existing=activeGuideKeys.get(id);
 const pinned=widget.querySelector('[data-guide-pinned]');
 const dialog=document.createElement('dialog');
 dialog.className='ns-guidebook-dialog';dialog.setAttribute('aria-labelledby','ns-guidebook-title');
 const uniqueId='steady-'+id.replace(/[^a-z0-9-]/g,'');
 const html=booksHtml(guide,uniqueId);
 dialog.innerHTML='<div class="ns-guidebook-modalbar"><span>Guidebook · '+e(guide.title)+'</span>'+
 '<button type="button" data-guide-close aria-label="Close guidebook">Close ×</button></div>'+
 '<div class="ns-guidebook-scroll">'+html+'</div>';
 const opener=widget.querySelector('[data-guide-open]');
 const close=()=>{if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');opener.focus()};
 opener.addEventListener('click',()=>{if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');});
 dialog.querySelector('[data-guide-close]').addEventListener('click',close);
 dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
 dialog.addEventListener('close',()=>{if(document.contains(opener))opener.focus()});
 const setPin=key=>{
  const entry=methodByKey(guide,key);if(!entry)return;
  activeGuideKeys.set(id,key);
  const m=entry.method;
  pinned.innerHTML='<aside class="ns-steady-pinned" aria-label="Selected technique"><div><p class="ns-guidebook-eyebrow">YOUR CHOSEN APPROACH · '+e(entry.lane.label)+'</p>'+
   '<strong>'+e(m.title)+'</strong><ol>'+m.steps.map(s=>'<li>'+e(s)+'</li>').join('')+'</ol>'+
   (m.caution?'<p class="ns-guidebook-method-warning">'+e(m.caution)+'</p>':'')+'</div>'+
   '<button type="button" data-guide-unpin aria-label="Remove selected technique">Remove ×</button></aside>';
  pinned.querySelector('[data-guide-unpin]').addEventListener('click',()=>{activeGuideKeys.delete(id);pinned.innerHTML='';opener.focus()});
 };
 dialog.addEventListener('click',event=>{
  const button=event.target.closest('[data-guide-choose]');if(!button)return;
  setPin(button.dataset.guideChoose);close();
  pinned.querySelector('button')?.focus();
 });
 if(existing)setPin(existing);
 const hero=root.querySelector('.ns-needs-header, .ns-needs-hero, .tool-heading, .tool-page > header');
 if(position==='after-header'&&hero)hero.insertAdjacentElement('afterend',widget);
 else root.prepend(widget);
 root.append(dialog);
 return widget;
}
export function attachSteadyGuidebookToTool(root,toolId,preferredId=''){
 const list=guidebooksForTool(toolId);
 if(!list.length||!root||typeof document==='undefined')return null;
 if(preferredId&&list.includes(preferredId)){
  return attachSteadyGuidebook(root,preferredId,{position:'start',label:'Open the full guidebook'});
 }
 if(list.length===1)return attachSteadyGuidebook(root,list[0],{position:'start'});
 const box=document.createElement('div');box.className='ns-steady-guide-choice';
 box.innerHTML='<label for="ns-guide-tool-context">Guidebooks for this tool</label>'+
 '<select id="ns-guide-tool-context"><option value="">Choose what you are working on</option>'+
 list.map(id=>'<option value="'+e(id)+'">'+e(steadyGuide(id).title)+'</option>').join('')+'</select>'+
 '<div data-guide-tool-mount></div>';
 root.prepend(box);
 box.querySelector('select').addEventListener('change',event=>{
  const mount=box.querySelector('[data-guide-tool-mount]');mount.innerHTML='';
  if(event.target.value)attachSteadyGuidebook(mount,event.target.value,{position:'start'});
 });
 return box;
}
