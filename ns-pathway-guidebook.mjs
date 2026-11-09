/* Native accessible guidebook surface for Navigate's non-Steadier pathways.
 * A pin is a local in-memory selection only: no tracking, diagnosis or storage.
 */
import {escapeHTML as escape} from './core.mjs';
import {PATH_LANES,PATH_SOURCES,pathGuide} from './ns-pathway-content.mjs';
const e=x=>escape(String(x??''));
const selectedSteps=new Map();
const reviewText='Evidence-informed educational draft · not an independently validated intervention or individually clinically reviewed treatment';
function guideMarkup(g){
 const references=[...new Set(g.refs)];
 return '<article class="ns-guidebook ns-pathbook">'+
 '<header class="ns-guidebook-cover"><p class="ns-guidebook-eyebrow">NOBODY’S SIMPLE · YOUR CHOSEN STARTING POINT · FULL GUIDEBOOK</p>'+
 '<h2 id="ns-path-guide-title">'+e(g.title)+'</h2><p>'+e(g.summary)+'</p><p class="ns-guidebook-status">'+e(reviewText)+'</p></header>'+
 '<nav class="ns-guidebook-toc" aria-label="Guidebook chapters"><strong>In this guide</strong><div>'+
 '<button type="button" data-path-jump="recognition">Understand</button>'+
 PATH_LANES.map(l=>'<button type="button" data-path-jump="'+e(l.id)+'">'+e(l.label)+'</button>').join('')+
 '<button type="button" data-path-jump="sources">Sources and limits</button></div></nav>'+
 '<section class="ns-guidebook-recognition" id="pathbook-recognition"><h3>1. Understand the experience</h3>'+
 '<p>'+e(g.what)+'</p><h4>One possible pattern</h4><p>'+e(g.cycle)+'</p>'+
 '<p>These are possible explanations, not conclusions about you. Your circumstances, history, body, relationships and material conditions may change what is relevant.</p></section>'+
 '<aside class="ns-guidebook-caution" role="note"><h3>When to adapt or stop</h3><p>'+e(g.caution)+'</p>'+
 '<p>Skip any strategy that feels inappropriate or unsafe. You do not have to complete this guide before getting relevant help.</p>'+
 '<a href="#need/support-safety">Safety and support →</a></aside>'+
 '<section class="ns-guidebook-methods"><h3>2. Different routes forward</h3>'+
 '<p>There is no universal sequence. The methods below are small educational applications of broader principles, not a complete CBT, ACT or DBT treatment programme. Choose only what fits.</p>'+
 PATH_LANES.map((lane,i)=>'<details class="ns-guidebook-lane" id="pathbook-'+e(lane.id)+'" '+(i===0?'open':'')+'>'+
 '<summary><span><strong>'+e(lane.label)+'</strong><small>'+e(lane.description)+'</small></span><span aria-hidden="true">⌄</span></summary>'+
 '<div class="ns-guidebook-method-list"><article class="ns-guidebook-method"><h4>'+e(lane.label)+' for this situation</h4><ol>'+
 g.methods[i].map(step=>'<li>'+e(step)+'</li>').join('')+'</ol>'+
 '<p class="ns-guidebook-method-warning"><strong>Use judgement:</strong> '+e(g.caution)+'</p>'+
 '<button type="button" class="ns-guidebook-pick" data-path-pin="'+i+'">Keep these steps beside my activity ↗</button>'+
 '</article></div></details>').join('')+'</section>'+
 '<section class="ns-guidebook-sources" id="pathbook-sources"><h3>3. Evidence, limitations and support</h3>'+
 '<p>These public references inform selected broad approaches and cautions. They do not establish that this newly authored guide, every step in it, or an individual response has been clinically tested or shown effective.</p>'+
 '<ul>'+references.map(key=>{const r=PATH_SOURCES[key];return r?'<li><a href="'+e(r.url)+'" target="_blank" rel="noopener noreferrer">'+e(r.name)+' ↗</a><small>'+e(r.scope)+'</small></li>':''}).join('')+'</ul>'+
 '<p class="ns-guidebook-final">Support can be practical, relational or clinical. Serious or unfamiliar physical symptoms, imminent danger, coercion and severe impairment may need more than a self-help exercise.</p></section></article>';
}
export function attachPathGuide(root,mode,option,{label='Open the full guidebook',position='after-header'}={}){
 const guide=pathGuide(mode,option);
 if(!root||!guide||typeof document==='undefined')return null;
 root.querySelector('[data-path-guide-widget]')?.remove();
 root.querySelector('dialog[data-path-guide-dialog]')?.remove();
 const widget=document.createElement('div');widget.className='ns-steady-guide-widget ns-path-guide-widget';
 widget.dataset.pathGuideWidget=guide.id;
 widget.innerHTML='<div class="ns-steady-guide-bar"><div><strong>Want the fuller picture?</strong>'+
 '<p>Explore this specific situation, alternative approaches, practical limits and sources without leaving your activity.</p></div>'+
 '<button type="button" aria-haspopup="dialog" data-path-open>📖 '+e(label)+'</button></div><div data-path-pinned></div>';
 const opener=widget.querySelector('[data-path-open]');
 const pinned=widget.querySelector('[data-path-pinned]');
 const modal=document.createElement('dialog');modal.className='ns-guidebook-dialog';
 modal.dataset.pathGuideDialog=guide.id;
 modal.setAttribute('aria-labelledby','ns-path-guide-title');
 modal.innerHTML='<div class="ns-guidebook-modalbar"><span>Guidebook · '+e(guide.title)+'</span>'+
 '<button type="button" data-path-close aria-label="Close guidebook">Close ×</button></div>'+
 '<div class="ns-guidebook-scroll">'+guideMarkup(guide)+'</div>';
 const close=()=>{
  if(modal.open&&typeof modal.close==='function')modal.close();
  else modal.removeAttribute('open');
  if(document.contains(opener))opener.focus();
 };
 opener.addEventListener('click',()=>{if(typeof modal.showModal==='function')modal.showModal();else modal.setAttribute('open','');});
 modal.querySelector('[data-path-close]').addEventListener('click',close);
 modal.addEventListener('click',event=>{if(event.target===modal)close();});
 modal.addEventListener('close',()=>{if(document.contains(opener))opener.focus();});
 const pin=index=>{
  const lane=PATH_LANES[index],steps=guide.methods[index];
  if(!lane||!steps)return;
  selectedSteps.set(guide.id,index);
  pinned.innerHTML='<aside class="ns-steady-pinned" aria-label="Selected approach"><div>'+
   '<p class="ns-guidebook-eyebrow">YOUR SELECTED APPROACH · '+e(lane.label)+'</p>'+
   '<strong>'+e(guide.title)+'</strong><ol>'+steps.map(x=>'<li>'+e(x)+'</li>').join('')+'</ol>'+
   '</div><button type="button" data-path-unpin aria-label="Remove selected approach">Remove ×</button></aside>';
  pinned.querySelector('[data-path-unpin]').addEventListener('click',()=>{selectedSteps.delete(guide.id);pinned.innerHTML='';opener.focus();});
 };
 modal.addEventListener('click',event=>{
  const jump=event.target.closest('[data-path-jump]');
  if(jump){
   const target=modal.querySelector('#pathbook-'+jump.dataset.pathJump);
   if(target){if(target.tagName==='DETAILS')target.open=true;target.scrollIntoView({block:'start',behavior:'instant'});}
   return;
  }
  const pick=event.target.closest('[data-path-pin]');
  if(pick){pin(Number(pick.dataset.pathPin));close();pinned.querySelector('[data-path-unpin]')?.focus();}
 });
 if(selectedSteps.has(guide.id))pin(selectedSteps.get(guide.id));
 const header=root.querySelector('.ns-needs-header, .ns-needs-hero, .tool-heading, .tool-page > header, .ns-atlas-guide-hero, .ns-reasoning-hero');
 if(position==='after-header'&&header)header.insertAdjacentElement('afterend',widget);
 else root.prepend(widget);
 root.append(modal);
 return widget;
}
export function pathGuideForOption(mode,option){return pathGuide(mode,option);}
