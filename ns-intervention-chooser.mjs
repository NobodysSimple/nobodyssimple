/* Low cognitive load: understand → browse → choose ONE task → use its worksheet.
 * Source chapters are represented as cards, not expanded into a syllabus.
 * No storage, scoring, tracking or auto-submission. */
import {escapeHTML as esc} from './core.mjs';
import {STEADY_REFERENCES} from './ns-steady-guide-utils.mjs';
import {PATH_SOURCES} from './ns-pathway-content.mjs';
import {renderTool} from './features.mjs';
import {deckForWorkbook,filterCards,APPROACH_FAMILIES,groupInterventions} from './ns-intervention-cards.mjs';
import {renderGameCarousel} from './ns-regulation-games.mjs';
import {renderTopicQuickNav,renderTopicReadingStart,renderTopicReadingEnd,renderTopicSafetyReading,bindTopicProfile,bindTopicJumps} from './ns-topic-reading-ui.mjs';

const e=x=>esc(String(x??''));
const textOf=x=>String(x??'').trim().slice(0,3000);
const safe=x=>String(x).replace(/[^a-z0-9-]/gi,'-');
const note='This is a working hypothesis, not a diagnosis or a test of whether you tried hard enough.';
const effortLabel={light:'Low effort',medium:'Some energy',high:'More involved'};
const timeLabel={now:'Right now',short:'Today',long:'Over time'};
const field=(id,label,hint='')=>'<label class="ns-pick-field"><span>'+e(label)+'</span>'+
 '<textarea rows="3" data-pick-field="'+e(id)+'" maxlength="3000" placeholder="'+e(hint||'You can skip this…')+'"></textarea></label>';
const choose=(id,label,options)=>'<label class="ns-pick-field"><span>'+e(label)+'</span><select data-pick-field="'+e(id)+'">'+
 options.map(([k,t])=>'<option value="'+e(k)+'">'+e(t)+'</option>').join('')+'</select></label>';
const outcome=()=>choose('review','If you tried it, how did it fit?',[
 ['untried','Not tried yet — that is fine'],['useful','It seemed useful here'],['neutral','I noticed no change'],
 ['blocked','Practical barriers got in the way'],['unsuitable','It was uncomfortable or not appropriate']]);
const marker=card=>'<span class="ns-pick-type ns-pick-type-'+e(card.tone)+'">'+e(card.kindLabel)+'</span>';
const pill=(label)=>'<span class="ns-pick-meta-pill">'+e(label)+'</span>';
const arrow='<span aria-hidden="true">→</span>';
const tags=card=>marker(card)+pill(effortLabel[card.effort])+pill(timeLabel[card.time]);
const supportingSources=(card,g)=>{
 const directory={...STEADY_REFERENCES,...PATH_SOURCES};
 const direct=(card.refs||[]).map(k=>directory[k]).filter(Boolean);
 const all=direct.length?direct:g.sources.slice(0,2);
 return all.map(s=>'<a href="'+e(s.url)+'" target="_blank" rel="noopener noreferrer">'+e(s.name)+' ↗</a>').join(' · ');
};
function cardHTML(card,active){
 return '<article class="ns-pick-card ns-pick-card-'+e(card.tone)+(active===card.id?' is-active':'')+'" data-pick-card="'+e(card.id)+'">'+
  '<div class="ns-pick-card-top">'+marker(card)+'<span class="ns-pick-card-time">'+e(card.duration)+'</span></div>'+
  '<h3>'+e(card.shortTitle||card.title)+'</h3><p>'+e(card.why)+'</p>'+
  '<div class="ns-pick-card-foot"><span>'+e(effortLabel[card.effort])+' · '+e(timeLabel[card.time])+'</span>'+
  '<button type="button" data-pick-open="'+e(card.id)+'" aria-label="Read steps for '+e(card.title)+'">'+
  (active===card.id?'Selected':'See steps')+' '+arrow+'</button></div></article>';
}
function sources(g){
 return '<details class="ns-pick-sources"><summary>Evidence, safeguards and sources</summary>'+
  '<p>'+e(g.review)+'</p><p>'+(g.contextFirst?'No topic-specific research review is assigned to this new editorial entry. Its suggested activities are general, optional and not validated treatments.':'These sources explain background principles or clinical cautions. They do not validate this specific worksheet or guarantee it will help.')+'</p>'+
  '<ul>'+g.sources.map(r=>'<li><a target="_blank" rel="noopener noreferrer" href="'+e(r.url)+'">'+e(r.name)+'</a>'+
  (r.scope?'<small>'+e(r.scope)+'</small>':'')+'</li>').join('')+'</ul>'+
  '<p>Not every approach fits every person. Some symptoms or unsafe situations need assessment, support or an environmental change instead.</p></details>';
}
function introduction(g){
 const list=(title,items)=>items?.length?'<div><h3>'+e(title)+'</h3><ul>'+items.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul></div>':'';
 const mechanisms=g.mechanisms?.length?'<div><h3>'+(g.contextFirst?'Conditions and influences worth checking':'Different possible maintaining processes')+'</h3>'+
  g.mechanisms.map(m=>'<div class="ns-pick-mechanism"><strong>'+e(m.label)+'</strong><p>'+e(m.detail)+'</p>'+
  (m.target?'<small>Potential target: '+e(m.target)+'</small>':'')+'</div>').join('')+'</div>':'';
 const caution='<aside class="ns-pick-cautions" role="note"><strong>Check the fit and safety first</strong>'+
  '<p>'+e(g.cautions?.[0]||'No single approach is appropriate for everybody.')+'</p>'+
  (g.medical?'<p>New or concerning physical symptoms require appropriate medical evaluation; do not assume they are psychological.</p>':'')+
  (g.supportFirst?'<p>For abuse, coercion or monitoring, avoid recording private details on a device someone else may access. Do not attempt unsafe confrontation.</p>':'')+
  '<a href="#need/support-safety">Urgent support</a></aside>';
 return '<section class="ns-pick-understand" id="ns-pick-understand"><div class="ns-pick-headline">'+
  '<span class="ns-pick-step">01</span><div><p class="ns-pick-kicker">START HERE</p><h2>What is this experience?</h2></div></div>'+
  '<p class="ns-pick-definition">'+e(g.what)+'</p>'+
  '<div class="ns-pick-cycle"><strong>'+(g.contextFirst?'Context, not a diagnosis':'One possible pattern')+'</strong><p>'+e(g.cycle||'Experiences and causes vary. No pattern is assumed.')+'</p></div>'+
  '<details class="ns-pick-deeper"><summary>Explore examples, possible contributors and different explanations</summary>'+
  '<div class="ns-pick-deeper-grid">'+list('What it can look like',g.recognise)+
  list('Contributors that might matter',g.contributors)+mechanisms+'</div>'+
  '<p class="ns-pick-limits">'+(g.contextFirst?'These are questions to explore, not explanations for discrimination, evidence of a disorder or reasons to blame the person affected.':'These are hypotheses to consider—not a way to infer the cause of your own situation.')+'</p></details>'+
  caution+'</section>';
}
function filters(){
 return '<div class="ns-pick-filter-heading"><strong>Choose an approach family</strong><small>Related methods stay together. You can switch at any time.</small></div>'+
 '<div class="ns-pick-filters" role="group" aria-label="Approach families">'+
 '<button type="button" data-pick-filter="all" aria-pressed="true">All</button>'+
 APPROACH_FAMILIES.map(f=>'<button type="button" data-pick-filter="'+e(f.id)+'" aria-pressed="false">'+e(f.label)+'</button>').join('')+'</div>'+
 '<label class="ns-pick-refine">Optional: narrow by effort or timing <select data-pick-refine>'+
 '<option value="all">Any effort or time</option><option value="light">Low effort</option>'+
 '<option value="now">Right now</option><option value="long">Over time</option></select></label>';
}
function chooser(){
 return '<section class="ns-pick-chooser" id="ns-pick-chooser">'+
  '<div class="ns-pick-headline"><span class="ns-pick-step">02</span><div>'+
  '<p class="ns-pick-kicker">CHOOSE ONE THING</p><h2>Find an approach</h2>'+
  '<p>Browse a family below, then try one idea that fits. You do not need to complete everything.</p></div></div>'+
  filters()+
  '<div class="ns-pick-track-head"><p data-pick-count-cards aria-live="polite"></p>'+
  '<div class="ns-pick-arrows"><button type="button" data-pick-direction="-1" aria-label="Previous approach">←</button>'+
  '<button type="button" data-pick-direction="1" aria-label="Next approach">→</button></div></div>'+
  '<div class="ns-pick-track" data-pick-track tabindex="0" aria-label="Approaches organised by family. Scroll sideways or use the previous and next buttons."></div>'+
  '<p class="ns-pick-chooser-foot">Cards are starting points, not prescriptions. Select a card to read its steps and open an optional worksheet.</p>'+
  '</section>';
}
function dialogMarkup(){
 return '<dialog class="ns-pick-dialog" data-pick-dialog aria-labelledby="ns-pick-dialog-title">'+
  '<div class="ns-pick-dialog-inner"><div class="ns-pick-dialog-top">'+
  '<span class="ns-pick-kicker">BEFORE YOU CHOOSE</span>'+
  '<button type="button" data-pick-close aria-label="Close this intervention">✕</button></div>'+
  '<div data-pick-dialog-body></div></div></dialog>';
}
const worksheetTypes={
 environment:[
  ['condition','What condition, demand or barrier is most relevant?','An environmental, practical, social or accessibility factor…'],
  ['choice','Which specific adjustment from the advice could fit?','Reduce, change, share, delay or request an accommodation…'],
  ['limits','What support or permission would make it possible?','Some things cannot be changed alone or safely…']],
 step:[
  ['target','What is the specific situation or action you want to work on?','There is no obligation to act if rest or safety is more important…'],
  ['step','What exactly could you try, following the steps above?','A voluntary, safe and observable response…'],
  ['barrier','What could get in the way or signal that you should stop?','Energy, health, safety, access, resources…']],
 thought:[
  ['facts','What is directly known about the situation?','Observable details, not your conclusions…'],
  ['thought','What interpretation or prediction arises?','A thought that feels convincing…'],
  ['alternatives','What evidence, alternative explanation or uncertainty matters?','A realistic comparison, not forced positivity…']],
 ground:[
  ['now','What is happening in the current moment?','Only as much as you want to name…'],
  ['cue','Which safe, tolerable sensory or grounding cue could you choose?','A familiar sound, object, texture, pause or reduced stimulation…'],
  ['fit','What would tell you it is unhelpful or time to stop?','Comfort and safety take priority over completing an exercise…']],
 values:[
  ['experience','What difficult feeling or uncertainty might be present?','No need to change it, or to force yourself to focus on it…'],
  ['value','Which personally meaningful quality matters to you?','Safety, kindness, independence, belonging, fairness…'],
  ['direction','What action, rest or boundary might reflect that value?','Within your real limits…']],
 request:[
  ['need','What practical or relational need is important here?','You do not need to provide identifying details…'],
  ['person','Which person, adjustment or service could safely help?','A person you trust or an appropriate professional…'],
  ['words','What short request would you feel comfortable making?','A draft is enough; sending it is not required…']],
 pause:[
  ['pressure','What is demanding attention or a response?','Something you are feeling, thinking or being asked to do…'],
  ['permission','What can safely wait, soften or be left unresolved?','Or nothing, if there is an actual urgent need…'],
  ['next','What would be a kind, realistic response for the next minute?','A pause, rest or necessary action…']],
 needs:[
  ['situation','What happened or what is most noticeable?','The immediate situation…'],
  ['need','Which need may be unmet?','Safety, sleep, control, support, fairness, clarity…'],
  ['response','Can you meet, request or acknowledge this need?','What is realistic, given your circumstances?…']],
 compassion:[
  ['voice','What is the harshest or most unhelpful judgment right now?','You may skip writing distressing language…'],
  ['fairness','What would a fair and accurate response sound like?','Include both legitimate responsibility and human limitations…'],
  ['response','What could change if you respond with that fairness?','Even if the feeling does not improve…']],
 control:[
  ['problem','Which concern are you responding to?','Name the issue rather than every possible consequence…'],
  ['zones','What can you control or influence, and what belongs to others?','Consider resources, institutions and power differences…'],
  ['choice','What useful action, boundary or request remains?','It can be reasonable not to act…']],
 track:[
  ['pattern','What single contextual pattern is worth noticing?','Prefer situation, timing or demand over symptom-monitoring…'],
  ['plan','What simple, low-burden observation could you make over several days?','For example, notice when the barrier changes…'],
  ['review','When will you stop and review instead of monitoring endlessly?','Monitoring may itself become unhelpful or compulsive…']],
 plan:[
  ['cue','When does the challenging situation tend to arise?','Describe the cue…'],
  ['response','If that cue happens, what response can you safely try?','If X, I can try Y…'],
  ['fallback','What is the lower-energy fallback and when will you review it?','A realistic backup, not an inflexible rule…']],
 rest:[
  ['demand','Which demand or barrier makes rest or recovery difficult?','Work, caregiving, sensory pressure, health, access…'],
  ['window','What protected recovery time or adjustment could be realistic?','A short window or a request for help…'],
  ['boundary','What might protect that time, and what is outside your control?','Consider practical support or medical care…']],
 conversation:[
  ['observed','What happened, without assuming someone else’s motives?','Only information you know…'],
  ['impact','What impact, need or boundary matters?','Your feelings and the concrete behaviour…'],
  ['request','If safe, what specific request could you make?','Otherwise, confidential support may be the safest step…']]
};
export const interventionWorksheetTypes=Object.freeze(Object.keys(worksheetTypes));
function worksheet(card){
 const questions=worksheetTypes[card.worksheet]||worksheetTypes.step;
 return '<div class="ns-pick-sheet-main">'+
  '<div class="ns-pick-sheet-heading"><span class="ns-pick-step">03</span><div>'+
  '<p class="ns-pick-kicker">YOUR CHOSEN TASK</p><h2>'+e(card.title)+'</h2>'+
  '<div class="ns-pick-sheet-chips">'+tags(card)+'</div></div></div>'+
  '<p class="ns-pick-sheet-why">'+e(card.why)+'</p>'+
  '<div class="ns-pick-sheet-guide"><strong>How to try this</strong><ol>'+card.steps.map(x=>'<li>'+e(x)+'</li>').join('')+'</ol>'+
  (card.caution?'<p><strong>Adapt or skip:</strong> '+e(card.caution)+'</p>':'')+'</div>'+
  '<div class="ns-pick-sheet-fields">'+questions.map(([id,label,hint])=>field(id,label,hint)).join('')+
  outcome()+'</div>'+
  '<div class="ns-pick-sheet-actions"><button type="button" class="ns-pick-primary" data-pick-review>Review my notes</button>'+
  '<button type="button" class="ns-pick-outline" data-pick-download>Download</button>'+
  '<button type="button" class="ns-pick-outline" data-pick-clear>Clear worksheet</button></div>'+
  '<output class="ns-pick-output" data-pick-output aria-live="polite">Write as little or as much as you like. Nothing is scored or automatically saved.</output>'+
  (card.tool?'<details class="ns-pick-extra-tool"><summary>Optional: open a more detailed interactive tool for this approach</summary>'+
  '<p>Legacy full tools have their own account and saving settings. You can use this worksheet without opening one.</p>'+
  '<button type="button" data-pick-full-tool="'+e(card.tool)+'">Open the full tool here</button>'+
  '<div data-pick-tool-host></div></details>':'')+
  '<p class="ns-pick-privacy">This worksheet stays in this open page only; there is no automatic upload or cross-device save. Download only on a private device.</p></div>';
}
function selectedEmpty(){
 return '<div class="ns-pick-empty"><div class="ns-pick-empty-icon" aria-hidden="true">✦</div>'+
  '<h2>Try an approach when you are ready</h2><p>Your chosen steps will appear here. Reading without completing a worksheet is fine.</p></div>';
}
function careFirst(g){
 return '<section class="ns-pick-care-first"><h2>Safety and support before a worksheet</h2><p>'+e(g.what)+'</p>'+
  '<p>'+e(g.cycle)+'</p><div class="ns-pick-cautions">'+
  (g.cautions||[]).map(c=>'<p>'+e(c)+'</p>').join('')+'</div>'+
  '<p>You do not need to enter details into a form. Avoid keeping notes on devices someone may monitor.</p>'+
  '<div class="ns-pick-care-actions"><a href="#need/support-safety">Open safety and urgent support</a>'+
  '<a href="https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/" target="_blank" rel="noopener noreferrer">NHS urgent mental health help ↗</a>'+
  '<a href="https://www.nhs.uk/live-well/getting-help-for-domestic-violence/" target="_blank" rel="noopener noreferrer">Confidential domestic abuse support ↗</a></div>'+
  '<p>For immediate danger in the UK, call 999.</p></section>';
}
function introductionCover(g){
 return '<header class="ns-pick-cover ns-tone-'+e(g.tone||'sage')+'"><p class="ns-pick-kicker">NOBODY’S SIMPLE · YOUR FIELD GUIDE</p>'+
  '<h1>'+e(g.title)+'</h1><p>'+e(g.lead)+'</p>'+
  (g.contextFirst?'<p class="ns-pick-editorial-status">Editorial overview · explore safely. This topic has not had an individual evidence review, and an identity or background is not a disorder.</p>':'')+
  '</header>';
}
function layout(g){
 return '<div class="ns-wb-wrap ns-pick-wrap'+(g.kind==='topic'?' ns-pick-topic-layout':'')+'" data-workbook="'+e(g.id)+'">'+
  '<nav class="ns-pick-breadcrumb" aria-label="Guide navigation"><a href="#navigate/'+e(g.modeId)+'">← '+e(g.modeTitle)+'</a>'+
  '<a href="#navigate">All starting points</a><a href="#need/support-safety">Urgent support</a></nav>'+
  introductionCover(g)+
  (g.safetyFirst?careFirst(g)+renderTopicSafetyReading(g)+sources(g):
   (g.kind==='topic'?renderTopicQuickNav(g)+renderTopicReadingStart(g):introduction(g))+
   chooser()+
   '<section class="ns-pick-selected" id="ns-pick-selected" aria-live="off"><div data-pick-selected>'+selectedEmpty()+'</div></section>'+
   '<div data-ns-games-host></div>'+dialogMarkup()+
   (g.kind==='topic'?renderTopicReadingEnd(g):'')+sources(g))+
  '<footer class="ns-pick-footer"><a href="#navigate/'+e(g.modeId)+'">← Change my choice</a>'+
  '<a href="#navigate">Choose another starting point →</a></footer></div>';
}
function valuesFrom(host){
 const values={};
 host.querySelectorAll('[data-pick-field]').forEach(el=>{values[el.dataset.pickField]=textOf(el.value)});
 return values;
}
function textDownload(name,content){
 const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const outcomes={untried:'Not tried (and that is valid)',useful:'It seemed useful in this situation—not proof of a proposed cause',
 neutral:'No clear change—consider whether the approach fits',blocked:'There was a barrier that deserves attention',
 unsuitable:'It was uncomfortable or unsuitable; it makes sense to stop or adapt'};
function notesText(g,card,values){
 return ['Nobody’s Simple | One chosen approach',g.title,'Chosen task: '+card.title,
  'Approach: '+card.kindLabel+' | '+effortLabel[card.effort]+' | '+timeLabel[card.time],
  '',...((worksheetTypes[card.worksheet]||worksheetTypes.step).flatMap(([id,label])=>[label,values[id]||'Not answered',''])),
  'Review: '+(outcomes[values.review]||outcomes.untried),'',
  note,'This material is educational and not a clinically validated intervention or a diagnosis.'].join('\n');
}
export function renderInterventionChooser(root,g,{locked=false}={}){
 const cards=deckForWorkbook(g);
 root.innerHTML=layout(g);
 const surface=root.querySelector('[data-workbook]');
 if(g.kind==='topic'&&!g.safetyFirst){bindTopicProfile(surface);bindTopicJumps(surface);}
 if(g.safetyFirst)return;
 let selected=null,filter='all',refine='all',opener=null,preview=null;
 const drafts=new Map();
 const track=surface.querySelector('[data-pick-track]');
 const dialog=surface.querySelector('[data-pick-dialog]');
 const sheet=surface.querySelector('[data-pick-selected]');
 const find=id=>cards.find(c=>c.id===id);
 const remember=()=>{
  if(selected)drafts.set(selected.id,valuesFrom(sheet));
 };
 const paintCards=()=>{
  const visible=filterCards(cards,refine).filter(c=>filter==='all'||c.family===filter);
  const groups=groupInterventions(visible);
  track.innerHTML=groups.length?groups.map(g=>'<div class="ns-pick-family" data-pick-family="'+e(g.id)+'">'+
   '<div class="ns-pick-family-heading"><strong>'+e(g.label)+'</strong><small>'+e(g.hint)+'</small></div>'+
   '<div class="ns-pick-family-cards">'+g.cards.map(c=>cardHTML(c,selected?.id)).join('')+'</div></div>').join(''):
   '<p class="ns-pick-noresults">No approaches match this combination. Try a different family or remove the extra filter.</p>';
  surface.querySelector('[data-pick-count-cards]').textContent=
   visible.length+' approaches across '+groups.length+' '+(groups.length===1?'family':'families');
  surface.querySelectorAll('[data-pick-filter]').forEach(b=>{
   b.setAttribute('aria-pressed',String(b.dataset.pickFilter===filter));
  });
  track.scrollLeft=0;
 };
 const closeDialog=()=>{if(dialog.open)dialog.close()};
 const previewHTML=card=>'<div class="ns-pick-dialog-badges">'+tags(card)+pill(card.duration)+'</div>'+
  '<h2 id="ns-pick-dialog-title">'+e(card.title)+'</h2><p class="ns-pick-dialog-why">'+e(card.why)+'</p>'+
  '<h3>What this involves</h3><ol>'+card.steps.map(step=>'<li>'+e(step)+'</li>').join('')+'</ol>'+
  '<p class="ns-pick-dialog-caution"><strong>Consider first:</strong> '+e(card.caution||'Try only what is safe, voluntary and realistic for your situation.')+'</p>'+
  '<p class="ns-pick-dialog-source">'+
  (card.source==='general'?'General adaptable self-help idea, not a topic-specific validated protocol.':
   'Adapted from this guide’s existing educational methods.')+'</p>'+
  '<div class="ns-pick-dialog-links">'+supportingSources(card,g)+'</div>'+
  '<div class="ns-pick-dialog-actions"><button type="button" class="ns-pick-primary" data-pick-choose="'+e(card.id)+'">'+
  (selected?.id===card.id?'Return to my worksheet':'Choose this and open my worksheet')+'</button>'+
  '<button type="button" class="ns-pick-outline" data-pick-cancel>Keep browsing</button></div>';
 const showDialog=(card,button)=>{
  if(!card)return;
  opener=button;preview=card;
  surface.querySelector('[data-pick-dialog-body]').innerHTML=previewHTML(card);
  dialog.showModal();
  dialog.querySelector('[data-pick-choose]')?.focus();
 };
 const paintSheet=()=>{
  if(!selected){sheet.innerHTML=selectedEmpty();return;}
  sheet.innerHTML=worksheet(selected);
  const draft=drafts.get(selected.id)||{};
  sheet.querySelectorAll('[data-pick-field]').forEach(field=>{
   if(Object.hasOwn(draft,field.dataset.pickField))field.value=draft[field.dataset.pickField];
  });
  const target=surface.querySelector('#ns-pick-selected');
  target.scrollIntoView({block:'start',behavior:'instant'});
  const h=sheet.querySelector('h2');h?.setAttribute('tabindex','-1');h?.focus({preventScroll:true});
 };
 const chooseCard=card=>{
  remember();selected=card;
  paintCards();paintSheet();closeDialog();
 };
 dialog.addEventListener('close',()=>{opener?.focus({preventScroll:true});opener=null;preview=null;});
 surface.addEventListener('click',event=>{
  const el=event.target.closest('button');if(!el)return;
  if(el.dataset.pickFilter){
   filter=el.dataset.pickFilter;paintCards();return;
  }
  if(el.hasAttribute('data-pick-direction')){
   const first=track.querySelector('.ns-pick-card');if(!first)return;
   const width=first.getBoundingClientRect().width+14;
   track.scrollBy({left:Number(el.dataset.pickDirection)*width,behavior:'smooth'});return;
  }
  if(el.dataset.pickOpen){showDialog(find(el.dataset.pickOpen),el);return;}
  if(el.hasAttribute('data-pick-close')||el.hasAttribute('data-pick-cancel')){closeDialog();return;}
  if(el.dataset.pickChoose){const card=find(el.dataset.pickChoose);if(card)chooseCard(card);return;}
  if(el.hasAttribute('data-pick-review')){
   const out=sheet.querySelector('[data-pick-output]'),v=valuesFrom(sheet);
   drafts.set(selected.id,v);out.textContent=notesText(g,selected,v);return;
  }
  if(el.hasAttribute('data-pick-download')){
   const v=valuesFrom(sheet);drafts.set(selected.id,v);
   textDownload('nobodys-simple-'+safe(g.id)+'-'+safe(selected.id)+'.txt',notesText(g,selected,v));
   sheet.querySelector('[data-pick-output]').textContent='Your notes were downloaded. Keep them private if they include sensitive information.';
   return;
  }
  if(el.hasAttribute('data-pick-clear')){
   if(el.dataset.confirm!=='yes'){
    el.dataset.confirm='yes';el.textContent='Confirm clearing my notes';return;
   }
   drafts.delete(selected.id);
   paintSheet();sheet.querySelector('[data-pick-output]').textContent='This worksheet is clear. You can start again or choose a different intervention.';
   return;
  }
  if(el.hasAttribute('data-pick-full-tool')){
   const host=sheet.querySelector('[data-pick-tool-host]');if(!host)return;
   if(locked){host.innerHTML='<p>Unlock your account first to access the extra full tool. You can still use the worksheet above.</p>';return;}
   if(host.hasChildNodes()){host.replaceChildren();el.textContent='Open the full tool here';return;}
   try{renderTool(host,el.dataset.pickFullTool);el.textContent='Close the full tool';}
   catch(err){host.textContent='This additional tool could not be opened, but your main worksheet is still available.';}
  }
 });
 surface.addEventListener('change',event=>{
  if(event.target.matches('[data-pick-refine]')){refine=event.target.value;paintCards();return;}
 });
 surface.addEventListener('input',event=>{
  if(event.target.matches('[data-pick-field]')&&selected)drafts.set(selected.id,valuesFrom(sheet));
 });
 surface.addEventListener('change',event=>{
  if(event.target.matches('[data-pick-field]')&&selected)drafts.set(selected.id,valuesFrom(sheet));
 });
 renderGameCarousel(surface.querySelector('[data-ns-games-host]'),g);
 paintCards();
}
