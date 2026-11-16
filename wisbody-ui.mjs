import {offerFieldGuideDraft} from './ns-field-guide-workspace-ui.mjs';
import {escapeHTML as esc} from './core.mjs';
import {
 wisbodyReflections as quotes,wisbodyThemeNames,wisbodyNeedNames,
 wisbodyDepthNames,deeperWisbodyReflection
} from './wisbody-content.mjs';

// Keep the old account-sync key. Legacy numeric-index notes remain intact;
// new notes use stable reflection IDs so a changed deck cannot relabel them.
const QUOTE_KEY='ns-learn-quote-notes-v1';
const DRAFT_KEY='ns-account-tool-drafts-v2';
const DRAFT_SLOT='#wisbody-reflections';
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
function download(name,value){
 const link=document.createElement('a');
 const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'}));
 link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const setStatus=(root,text)=>{const target=root.querySelector('[data-status]');if(target)target.textContent=text;};
const safeNotes=value=>value&&typeof value==='object'&&!Array.isArray(value)?value:{};
const matchingIndices=filters=>quotes.flatMap((q,i)=>
 (filters.theme==='all'||filters.theme===q.theme)
 &&(filters.pattern==='all'||filters.pattern===q.pattern)
 &&(filters.need==='all'||filters.need===q.need)
 &&(filters.depth==='all'||Number(filters.depth)===q.depth)?[i]:[]
);

export function renderWisbody(root,{compact=false}={},getAccount=()=>({})){
 if(!root)return;
 let extrasOpen=false, journalMode='notice';
 const state=()=>getAccount()||{};
 const initialDraft=state().locked?null:read(DRAFT_KEY,{})[DRAFT_SLOT]?.reflectionDraft;
 const saved=state().locked?{}:safeNotes(read(QUOTE_KEY,{}));
 const pending=safeNotes(initialDraft?.notes);
 let index=initialDraft?.id?quotes.findIndex(q=>q.id===initialDraft.id):-1;
 if(index<0)index=Math.floor(Math.random()*quotes.length);
 const filters={theme:'all',pattern:'all',need:'all',depth:'all'};
 const noteFor=q=>Object.hasOwn(pending,q.id)?pending[q.id]:(saved[q.id]||'');
 const write=(key,value)=>{
  if(state().locked)throw Error('Your saved work is locked');
  localStorage.setItem(key,JSON.stringify(value));
 };
 const storageMessage=()=>state().syncKeys?.includes(QUOTE_KEY)
  ?'Saved here and queued for your selected account sync.'
  :'Saved on this device. Account syncing is optional.';

 function persistDraft(){
  if(state().preferences?.saveDrafts===false){
   setStatus(root,'Draft saving is off. Save the note explicitly if you want to keep it.');
   return;
  }
  try{
   const drafts=safeNotes(read(DRAFT_KEY,{}));
   drafts[DRAFT_SLOT]={
    title:'Wisbody reflection',updatedAt:new Date().toISOString(),
    reflectionDraft:{id:quotes[index].id,notes:pending}
   };
   write(DRAFT_KEY,drafts);
   setStatus(root,'Draft '+storageMessage());
  }catch{setStatus(root,'Draft could not be saved. Download your notes before leaving.');}
 }
 function persistNote(){
  try{
   const q=quotes[index],value=root.querySelector('#wisbody-note')?.value||'';
   const current=safeNotes(read(QUOTE_KEY,{}));
   current[q.id]=value;write(QUOTE_KEY,current);saved[q.id]=value;delete pending[q.id];
   const drafts=safeNotes(read(DRAFT_KEY,{}));
   if(Object.keys(pending).length)drafts[DRAFT_SLOT]={title:'Wisbody reflection',updatedAt:new Date().toISOString(),reflectionDraft:{id:q.id,notes:pending}};
   else delete drafts[DRAFT_SLOT];
   write(DRAFT_KEY,drafts);
   setStatus(root,storageMessage());
  }catch{setStatus(root,'The note could not be saved. You can export it instead.');}
 }
 function move(amount){
  const list=matchingIndices(filters);
  if(!list.length)return;
  const pos=list.indexOf(index);
  index=list[(pos<0?(amount<0?list.length-1:0):(pos+amount+list.length)%list.length)];
  paint();
 }
 function changeFilter(field,value){
  filters[field]=value;
  if(field==='theme')filters.pattern='all';
  const list=matchingIndices(filters);
  // Clear the most specific filter first if its combination has no entries.
  if(!list.length && field!=='theme')filters[field]='all';
  const updated=matchingIndices(filters);
  if(updated.length)index=updated[0];
  paint();
 }
 function paint(){
  const q=quotes[index],value=noteFor(q),next=deeperWisbodyReflection(q);
  const currentPatterns=[...new Map(quotes.filter(x=>filters.theme==='all'||x.theme===filters.theme).map(x=>[x.pattern,x.patternTitle])).entries()];
  const oldNoteCount=Object.keys(saved).filter(key=>/^\d+$/.test(key)).length;
  const modePrompts={
   notice:q.prompt,
   explore:'When does this pattern appear in your life, and what usually happens just before it?',
   challenge:'What other explanation could fit, and what might change if you tested it?'
  };
  root.innerHTML=`<section class="wisbody" aria-labelledby="wisbody-title">
   <div class="wisbody-character"><img src="media/strategy/wisbody.png" width="320" height="480" loading="lazy" alt="Wisbody, a wise Nobody with a white beard and wooden staff"><p>Meet Wisbody</p></div>
   <div class="wisbody-bubble">
    <p class="eyebrow">A thought to explore</p><h2 id="wisbody-title">A moment with Wisbody.</h2>
    <p class="wisbody-context"><strong>${esc(q.patternTitle)}</strong><span>${esc(wisbodyDepthNames[q.depth])}</span><span>${esc(wisbodyNeedNames[q.need])}</span></p>
    <blockquote>${esc(q.text)}</blockquote>
    <p class="wisbody-prompt"><strong>Think about it</strong> ${esc(q.prompt)}</p>
    <div class="wisbody-depth-action">${next?`<button type="button" class="chip wisbody-deeper" id="wisbody-deeper">Go deeper <span aria-hidden="true">→</span></button>`:'<span class="wisbody-end">You have reached the deepest level of this pattern.</span>'}</div>
    <div class="wisbody-browser">
     <div class="wisbody-filters">
      <label class="wisbody-filter">Theme <select id="wisbody-theme"><option value="all">All themes</option>${Object.entries(wisbodyThemeNames).map(([key,label])=>`<option value="${esc(key)}" ${filters.theme===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      <label class="wisbody-filter">Pattern <select id="wisbody-pattern"><option value="all">All patterns</option>${currentPatterns.map(([key,label])=>`<option value="${esc(key)}" ${filters.pattern===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      <label class="wisbody-filter">What would help? <select id="wisbody-need"><option value="all">Any kind of help</option>${Object.entries(wisbodyNeedNames).map(([key,label])=>`<option value="${esc(key)}" ${filters.need===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
      <label class="wisbody-filter">Depth <select id="wisbody-depth"><option value="all">All depths</option>${Object.entries(wisbodyDepthNames).map(([key,label])=>`<option value="${key}" ${String(filters.depth)===key?'selected':''}>${esc(label)}</option>`).join('')}</select></label>
     </div>
     <div class="wisbody-controls"><button type="button" class="chip" id="wisbody-prev" aria-label="Previous reflection">← Previous</button><span>${index+1} / ${quotes.length} reflections</span><button type="button" class="chip" id="wisbody-next">Another reflection →</button></div>
     <div class="wisbody-experiment"><strong>One small thing to try</strong><p>${esc(q.experiment)}</p></div>
     <details class="wisbody-mechanism"><summary>Why this pattern might happen</summary><p>${esc(q.mechanism)}</p><p>One possible explanation, not a diagnosis or a claim about your personal history.</p></details>
     <details class="wisbody-journal" ${value?'open':''}>
      <summary>Write a short reflection</summary>
      <p>Choose a starting point. A few words is enough.</p>
      <div class="wisbody-journal-modes" role="group" aria-label="Journal starting point">
       <button type="button" class="chip" data-wisbody-mode="notice">Notice</button>
       <button type="button" class="chip" data-wisbody-mode="explore">Explore</button>
       <button type="button" class="chip" data-wisbody-mode="challenge">Challenge</button>
      </div>
      <label class="field" for="wisbody-note"><span id="wisbody-journal-question">${esc(modePrompts[journalMode])}</span>
       <textarea id="wisbody-note" maxlength="12000" rows="4" placeholder="Start wherever feels useful…" ${state().locked?'disabled':''}>${esc(value)}</textarea>
      </label>
      <div class="row"><button type="button" class="button" id="wisbody-save" ${state().locked?'disabled':''}>Save this reflection</button><button type="button" class="chip" id="wisbody-guide" ${state().locked?'disabled':''}>Keep in my Field Guide</button><button type="button" class="button secondary" id="wisbody-export">Download notes</button><button type="button" class="chip" id="wisbody-delete" ${state().locked?'disabled':''}>Delete this note</button></div>
      <p data-status role="status">${state().locked?'Unlock saved work in Account to journal here.':'Your writing is private; syncing follows your Account settings.'}</p>
      ${oldNoteCount?`<button type="button" class="chip" id="wisbody-legacy-export">Download ${oldNoteCount} notes from the earlier quote deck</button>`:''}
      <a href="#account/privacy">Privacy and syncing →</a>
     </details>
    </div><p class="fine">A reflection is an invitation, not a verdict. It may not fit your experience.</p>
   </div></section>`;
  const setMode=()=>{
   root.querySelector('#wisbody-journal-question').textContent=modePrompts[journalMode];
   root.querySelectorAll('[data-wisbody-mode]').forEach(btn=>{
    const active=btn.dataset.wisbodyMode===journalMode;
    btn.setAttribute('aria-pressed',String(active));
    btn.classList.toggle('wisbody-mode-active',active);
   });
  };
  setMode();
  if(compact){
   const bubble=root.querySelector('.wisbody-bubble');
   const details=document.createElement('details');details.className='ns-wisbody-more';details.open=extrasOpen;
   const summary=document.createElement('summary');summary.textContent='Browse reflections and try an experiment';details.append(summary);
   const pieces=bubble.querySelectorAll(':scope > .wisbody-browser, :scope > .fine');
   pieces.forEach(element=>details.append(element));
   bubble.append(details);root.querySelector('.wisbody').classList.add('wisbody--compact');
   details.addEventListener('toggle',()=>{extrasOpen=details.open;});
  }
  root.querySelector('#wisbody-deeper')?.addEventListener('click',()=>{
   const deeper=deeperWisbodyReflection(quotes[index]);if(!deeper)return;
   index=quotes.findIndex(item=>item.id===deeper.id);paint();
  });
  root.querySelector('#wisbody-prev').addEventListener('click',()=>move(-1));
  root.querySelector('#wisbody-next').addEventListener('click',()=>move(1));
  for(const field of ['theme','pattern','need','depth']){
   root.querySelector('#wisbody-'+field).addEventListener('change',event=>changeFilter(field,event.target.value));
  }
  root.querySelectorAll('[data-wisbody-mode]').forEach(btn=>btn.addEventListener('click',()=>{
   journalMode=btn.dataset.wisbodyMode;setMode();
  }));
  root.querySelector('#wisbody-note').addEventListener('input',event=>{
   pending[quotes[index].id]=event.target.value;persistDraft();
  });
  root.querySelector('#wisbody-save').addEventListener('click',persistNote);
  root.querySelector('#wisbody-guide')?.addEventListener('click',()=>{
    if(state().locked){setStatus(root,'Unlock saved work before opening your Field Guide.');return;}
    const q=quotes[index],written=root.querySelector('#wisbody-note')?.value?.trim()||'';
    offerFieldGuideDraft({type:'note',title:'Wisbody · '+q.patternTitle,
      body:written||'Wisbody reflection to consider: '+q.text+'\n\nQuestion: '+q.prompt,
      context:'A thought encountered in Wisbody. This is a prompt, not a conclusion about me.',
      sources:[{app:'wisbody',id:q.id,title:q.patternTitle,href:'#wisbody'}]});
    location.hash='#guide/workspace/compose/note';
  });
  root.querySelector('#wisbody-export').addEventListener('click',()=>download('wisbody-reflections.json',{
   version:2,notes:{...safeNotes(read(QUOTE_KEY,{})),...pending},
   reflections:quotes.map(x=>({id:x.id,theme:x.theme,pattern:x.pattern,text:x.text}))
  }));
  root.querySelector('#wisbody-delete').addEventListener('click',()=>{
   if(!confirm('Delete your note for this reflection?'))return;
   try{
    const id=quotes[index].id,all=safeNotes(read(QUOTE_KEY,{}));
    delete all[id];write(QUOTE_KEY,all);delete saved[id];delete pending[id];
    const drafts=safeNotes(read(DRAFT_KEY,{}));
    if(drafts[DRAFT_SLOT]?.reflectionDraft?.notes)delete drafts[DRAFT_SLOT].reflectionDraft.notes[id];
    write(DRAFT_KEY,drafts);paint();setStatus(root,'This reflection note was deleted.');
   }catch{setStatus(root,'The note could not be deleted.');}
  });
  root.querySelector('#wisbody-legacy-export')?.addEventListener('click',async()=>{
   try{
    const {quoteDeckExtended:oldDeck}=await import('./quote-content-legacy.mjs');
    const numericNotes=Object.fromEntries(Object.entries(safeNotes(read(QUOTE_KEY,{}))).filter(([key])=>/^\d+$/.test(key)));
    download('wisbody-older-quote-notes.json',{version:1,notes:numericNotes,
     quotes:oldDeck.map((item,i)=>({index:i,text:item.text,prompt:item.prompt}))});
   }catch{setStatus(root,'The older notes could not be exported.');}
  });
 }
 paint();
}
