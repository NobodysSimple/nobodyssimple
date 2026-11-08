import {escapeHTML as esc} from './core.mjs';
import {atlasProfile,isSafetyPriority,atlasGet} from './ns-atlas-core.mjs';
import {worksheetFor,worksheetText} from './ns-atlas-worksheets.mjs';
import {readAtlasSession,writeAtlasSession} from './ns-atlas-session.mjs';
import {getAtlasHandoff} from './ns-atlas-console.mjs';
import {nhsHelp,nhsTalking} from './ns-problem-map.mjs';

const s=x=>esc(String(x??''));
const count=(items)=>items?.length||0;
const headline=(number,title,lead,body,expanded=false)=>
 '<details class="ns-atlas-section" '+(expanded?'open':'')+'><summary><span class="ns-atlas-section-no">'+String(number).padStart(2,'0')+'</span><span><strong>'+title+'</strong>'+
 '<small>'+lead+'</small></span><span class="ns-atlas-chevron" aria-hidden="true">⌄</span></summary>'+
 '<div class="ns-atlas-section-body">'+body+'</div></details>';
const checkSet=(name,items,selected)=>items.map((x,i)=>{
 const id=typeof x==='string'?String(i):x.id;
 const label=typeof x==='string'?x:x.label;
 const detail=typeof x==='string'?'':x.detail||'';
 const key=name.startsWith('sign-')?name.slice(5)+':'+id:id;
 return '<label class="ns-atlas-check"><input type="checkbox" name="'+name+'" value="'+s(id)+'" '+(selected.has(key)?'checked':'')+'>'+
 '<span><strong>'+s(label)+'</strong>'+(detail?'<small>'+s(detail)+'</small>':'')+'</span></label>';
}).join('');
const signFields=(p,state)=>{
 const blocks=[['thoughts','Thoughts'],['feelings','Feelings'],['behaviours','Behaviours'],['body','Physical reactions']];
 return '<div class="ns-atlas-sign-grid">'+blocks.map(([key,label])=>
 '<fieldset><legend>'+label+'</legend>'+checkSet('sign-'+key,p.signs[key]||[],state.signs)+'</fieldset>').join('')+'</div>';
};
export function makeAtlasFormulation(p,state){
 const signs=Object.entries(p.signs).flatMap(([group,values])=>values.map((text,index)=>({key:group+':'+index,text})))
   .filter(item=>state.signs.has(item.key)).map(item=>item.text);
 const maintainers=p.maintainers.filter(x=>state.maintainers.has(x.id));
 const contributors=p.contributors.filter(x=>state.contributors.has(x.id));
 const extra=state.custom||[];
 const situation=state.customSituation?.trim()||p.variants[Number((state.variant||'').replace(/^v/,''))]||'the difficulty you described';
 const targets=maintainers.length?p.targets.filter(t=>maintainers.some(m=>m.id===t.id)).slice(0,3):[];
 const words=[
 'You are exploring: '+p.title+'.',
 'The situation you selected: '+situation+'.',
 signs.length?'You recognised: '+signs.slice(0,8).join('; ')+'.':'You have not selected specific signs yet.',
 maintainers.length?'Possible maintaining processes to investigate: '+maintainers.map(m=>m.label).join(', ')+'.':'No maintaining process has been selected, so the pattern remains open.',
 contributors.length?'Possible contributors: '+contributors.map(c=>c.label).join(', ')+'.':'Contributing circumstances are not yet specified.',
 extra.length?'Other variables you added: '+extra.map(x=>x.label+' ('+x.kind+')').join('; ')+'.':'',
 targets.length?'Potential targets: '+targets.map(t=>t.title).join(', ')+'.':'Select a possible maintainer to receive more specific targets.',
 'This is an editable working hypothesis, not an established causal network or diagnosis.'
 ].filter(Boolean);
 return {signs,maintainers,contributors,extra,situation,targets,summary:words.join(' ')};
}
const parts=(p,state)=>{const m=p.maintainers.find(x=>state.maintainers.has(x.id));const cycle=[p.cycle[0],m?.label||p.cycle[1],p.cycle[2],p.cycle[3]];
 return cycle.map((x,i)=>'<div class="ns-atlas-cycle-node"><span>'+String(i+1)+'</span><strong>'+s(x)+'</strong></div>').join('<span aria-hidden="true" class="ns-atlas-cycle-arrow">↓</span>');};
function mapMarkup(p,state){
 const f=makeAtlasFormulation(p,state);
 const ch=(text,cls='',id='')=>'<span class="ns-atlas-map-chip '+cls+'">'+s(text)+
 (id?'<button type="button" data-remove-var="'+s(id)+'" aria-label="Remove '+s(text)+'">×</button>':'')+'</span>';
 const extra=state.custom||[];
 const conditions=[...f.contributors.map(c=>ch(c.label)),...extra.filter(x=>x.kind==='contributor').map(x=>ch(x.label,'user',x.id))];
 const maint=[...f.maintainers.map(m=>ch(m.label)),...extra.filter(x=>x.kind==='maintainer').map(x=>ch(x.label,'user',x.id))];
 const protective=extra.filter(x=>x.kind==='protective').map(x=>ch(x.label,'protect',x.id));
 const links=extra.length?'<div class="ns-atlas-extra-links"><strong>Your suggested links</strong>'+
 extra.map(x=>'<p>'+s(x.label)+' → '+s({situation:'the situation',response:'your response',outcome:'a longer-term effect'}[x.target])+'</p>').join('')+'</div>':'';
 return '<div class="ns-atlas-map-box"><div class="ns-atlas-map-row"><div><small>POSSIBLE CONTRIBUTING FACTORS</small>'+
 (conditions.join('')||'<em>Choose contributors above or add your own.</em>')+'</div><span aria-hidden="true">→</span>'+
 '<div><small>SPECIFIC SITUATION</small><strong>'+s(f.situation)+'</strong></div></div>'+
 '<div class="ns-atlas-map-arrow">↓</div><div class="ns-atlas-map-row"><div><small>POSSIBLE MAINTAINERS</small>'+
 (maint.join('')||'<em>Choose a process to investigate.</em>')+'</div><span aria-hidden="true">→</span>'+
 '<div><small>IMMEDIATE EFFECT</small><strong>'+s(p.cycle[2])+'</strong></div></div>'+
 '<div class="ns-atlas-map-arrow">↓</div><div class="ns-atlas-map-outcome"><small>POSSIBLE LONGER-TERM PATTERN</small><strong>'+s(p.cycle[3])+'</strong></div>'+
 (protective.length?'<div class="ns-atlas-map-protect"><small>POSSIBLE PROTECTIVE FACTORS</small>'+protective.join('')+'</div>':'')+
 links+'<p class="ns-atlas-fine">Arrows are your suggested influences, not measured or proven causes.</p></div>';
}
const sourceLinks=p=>{
 const source=p.source||p.links?.[0];
 const urls=[source,...(p.links||[])].filter(Boolean);
 const unique=[...new Map(urls.map(x=>[x.url,x])).values()].filter(x=>x.url?.startsWith('https://'));
 return unique.map(x=>'<a href="'+s(x.url)+'" rel="noopener noreferrer" target="_blank">'+s(x.label||x.title||'Read more')+' <span aria-hidden="true">↗</span></a>').join('');
};
const stepsToProgress=p=>'<ol class="ns-atlas-progress-list">'+p.progress.map((item,i)=>'<li><span>'+String(i+1)+'</span>'+s(item)+'</li>').join('')+'</ol>';
const support=p=>{
 const urgent=isSafetyPriority(p.id),physical=p.medical||p.domain==='body';
 const note=urgent?'If you or another person may be in immediate danger in the UK, call 999 or attend A&E. For urgent mental health help, contact NHS 111 and select the mental health option. Avoid postponing help to complete this guide.':
 physical?'New, persistent, severe or changing physical symptoms, significant sleepiness, eating concerns or suspected medication effects may need assessment. An online psychological map cannot determine their cause.':
 'If the difficulty is persistent, seriously affecting everyday life, creating safety concerns, or has not improved with self-help, consider appropriate professional or practical support.';
 return '<p>'+s(note)+'</p><div class="ns-atlas-resource-links"><a target="_blank" rel="noopener noreferrer" href="'+s(nhsHelp)+'">NHS urgent mental health support ↗</a>'+
 (urgent?'':'<a target="_blank" rel="noopener noreferrer" href="'+s(nhsTalking)+'">NHS Talking Therapies (where appropriate) ↗</a>')+'</div>';
};
const targetMarkup=(p,state)=>{
 if(isSafetyPriority(p.id))return '<div class="ns-atlas-urgent"><strong>Immediate safety and human support are the priority.</strong><p>This topic is not appropriate for automatically generated exposure, confrontation or self-diagnosis tasks.</p><a href="#support">Find support →</a></div>';
 const f=makeAtlasFormulation(p,state);
 const targets=f.targets.length?f.targets:p.targets.slice(0,2);
 return targets.map((t,i)=>'<article class="ns-atlas-target"><span>'+String(i+1)+'</span><div><h3>'+s(t.title)+'</h3>'+
 '<p>'+s(t.why)+'</p><p><strong>Try:</strong> '+s(t.action)+'</p></div></article>').join('')+
 (!f.targets.length?'<p class="ns-atlas-fine">These are broad starting ideas. Select a maintaining process to tailor them.</p>':'');
};
const focusFor=state=>state.worksheetFocus&&state.maintainers.has(state.worksheetFocus)?state.worksheetFocus:([...state.maintainers][0]||'');
function worksheetMarkup(p,state){
 const primary=focusFor(state);
 const spec=worksheetFor(p.id,{variant:state.variant,maintainer:primary,contributors:[...state.contributors],customSituation:state.customSituation});
 if(!spec)return '';
 const notes=state.notes[spec.kind]||[];
 return '<div class="ns-atlas-work">'+(state.maintainers.size>1?'<label class="ns-atlas-variation"><strong>Choose which maintaining factor your worksheet should focus on</strong><select data-worksheet-focus>'+[...state.maintainers].map(id=>{const m=p.maintainers.find(x=>x.id===id);return '<option value="'+s(id)+'" '+(primary===id?'selected':'')+'>'+s(m?.label||id)+'</option>';}).join('')+'</select></label>':'')+
 '<p class="ns-atlas-work-title"><strong>'+s(spec.title)+'</strong><small>Adapted to: '+s(spec.situation)+'</small></p>'+
 '<p>'+s(spec.intro)+'</p>'+spec.prompts.map((q,i)=>'<label>'+s(q)+'<textarea data-worksheet-answer="'+i+'" maxlength="1700" rows="3" placeholder="Your own words (optional)">'+s(notes[i]||'')+'</textarea></label>').join('')+
 '<div class="ns-atlas-resource-links"><a href="'+s(spec.topicTool)+'">Open the interactive exercise for this topic →</a></div>'+
 '<p class="ns-atlas-fine">'+s(spec.how)+'</p><button class="button secondary" type="button" data-download-worksheet>Download this worksheet</button>'+
 '<span role="status" data-worksheet-status class="ns-atlas-fine"></span></div>';
}
const selectSituation=(p,state)=>'<label class="ns-atlas-variation"><strong>Which situation is closest?</strong><select data-atlas-variant>'+
 '<option value="">I am not sure / several situations</option>'+
 p.variants.map((v,i)=>'<option value="v'+i+'" '+(state.variant==='v'+i?'selected':'')+'>'+s(v)+'</option>').join('')+'</select></label>'+
 '<label class="ns-atlas-variation"><strong>Or describe your own situation (optional)</strong><input type="text" data-atlas-own-situation maxlength="150" placeholder="e.g. It happens after a difficult call…" value="'+s(state.customSituation||'')+'"></label>';
const qualityNote=p=>p.quality==='expert-draft'?
 'This topic has additional authored examples and differentiated mechanisms.':
 'This page uses a structured educational starting model. Its specific explanations and resource links require further topic-by-topic expert review.';
export function renderAtlasGuide(root,id){
 const p=atlasProfile(id);if(!p){root.innerHTML='<p>This topic is not yet mapped. <a href="#navigate">Return to the console</a>.</p>';return;}
 const hand=readAtlasSession(id)||getAtlasHandoff(id)||{};
 const state={variant:hand.variant||'',customSituation:hand.customSituation||'',worksheetFocus:hand.worksheetFocus||'',
 maintainers:new Set(hand.maintainer&&hand.maintainer!=='unknown'?[hand.maintainer]:[]),
 contributors:new Set(hand.contributors||[]),signs:new Set(hand.signs||[]),
 custom:[...(hand.custom||[])],notes:{...(hand.notes||{})},nextId:0};
 const write=()=>writeAtlasSession({id,variant:state.variant,customSituation:state.customSituation,maintainer:[...state.maintainers][0]||'',worksheetFocus:focusFor(state),contributors:[...state.contributors],signs:[...state.signs],custom:[...state.custom],notes:state.notes});
 const markup='<div class="ns-atlas-guide"><a class="ns-atlas-back" href="#navigate">← Back to Emotional Calculator</a>'+
 '<header class="ns-atlas-guide-hero"><p class="eyebrow">YOUR PSYCHOLOGICAL FIELD GUIDE</p><h1>'+s(p.title)+'</h1>'+
 '<p>Find what fits your experience, test possible explanations, and choose what might be useful—without turning a few answers into a diagnosis.</p>'+
 '<p class="ns-atlas-fine">'+s(qualityNote(p))+'</p></header>'+
 (isSafetyPriority(id)?'<aside class="ns-atlas-safety" role="note"><strong>Safety and appropriate support first</strong>'+support(p)+'</aside>':'')+
 headline(1,'What is this?','Understand the difficulty in plain language.','<p>'+s(p.definition)+'</p>',true)+
 headline(2,'What does it look like in my life?','Recognise thoughts, feelings, behaviours and physical reactions.',
 '<p>Tick anything that sounds familiar. These examples are not diagnostic criteria.</p>'+signFields(p,state),true)+
 headline(3,'What keeps it going?','A possible feedback loop, not a proven explanation.',
 '<div class="ns-atlas-cycle" data-atlas-cycle>'+parts(p,state)+'</div><p>Different processes may maintain similar symptoms. Choose the ones you recognise later in the guide.</p>')+
 headline(4,'What contributes?','Include context, health, relationships and systems.',
 '<p>Contributors are not necessarily causes. Some are outside your control and may need practical support.</p>'+
 '<div class="ns-atlas-checkbox-grid">'+checkSet('contributor',p.contributors,state.contributors)+'</div>')+
 headline(5,'Which parts apply to me?','Tell us which specific version you experience.',
 selectSituation(p,state)+'<h3>What seems to keep it going?</h3><div class="ns-atlas-checkbox-grid">'+checkSet('maintainer',p.maintainers,state.maintainers)+'</div>'+
 '<p class="ns-atlas-fine">You can choose several, none, or revise them as you learn more.</p>',true)+
 headline(6,'What can help?','Psychological skills organised by what they target.',
 '<div class="ns-atlas-all-targets">'+p.targets.map(t=>'<article><strong>'+s(t.title)+'</strong><p>'+s(t.why)+'</p></article>').join('')+'</div>')+
 headline(7,'What should I try first?','No more than three next steps, plus a tailored worksheet.',
 '<div data-atlas-targets></div><h3>Worksheet matched to your situation</h3><div data-atlas-worksheet></div>',true)+
 headline(8,'What progress should look like','Small changes in functioning often come before symptom change.',
 stepsToProgress(p)+'<p>These are examples of progress, not a required order or guarantee.</p>')+
 headline(9,'When self-help may not be enough','Safety, health and professional support matter.',
 (p.alert?'<p class="ns-atlas-safety">'+s(p.alert)+'</p>':'')+support(p)+'<p>If an intervention worsens your situation or is unsafe, do not force it. Reassess the explanation and seek relevant help.</p>')+
 headline(10,'Your personalised formulation','Review your own editable map and next steps.',
 '<div data-atlas-map></div><details class="ns-atlas-add"><summary>＋ Add a variable or protective factor</summary>'+
 '<form data-atlas-add-form><label>Variable<input name="label" maxlength="80" required placeholder="e.g. Housing noise, fatigue, support from a friend"></label>'+
 '<label>Possible role<select name="kind"><option value="contributor">Contributor</option><option value="maintainer">Maintainer</option><option value="protective">Protective factor</option></select></label>'+
 '<label>Possible influence<select name="target"><option value="situation">The situation</option><option value="response">My response</option><option value="outcome">The longer-term pattern</option></select></label>'+
 '<button type="submit" class="button secondary">Add to map</button><p data-add-message class="ns-atlas-fine" role="status"></p></form></details>'+
 '<div class="ns-atlas-summary"><h3>What I currently understand</h3><p data-atlas-summary></p></div>'+
 '<button type="button" data-download-map class="button">Download my formulation</button> <button type="button" data-print-guide class="button secondary">Print</button>'+
 '<p class="ns-atlas-fine" data-download-message role="status">Your selections remain on this page only; they are not saved automatically.</p>',true)+
 '<details class="ns-atlas-sources"><summary>Reading and sources</summary><div>'+sourceLinks(p)+'</div></details>'+
 '<p class="ns-atlas-footer"><a href="#navigate">Explore another difficulty →</a> <a href="#support">Find human support →</a></p></div>';
 root.innerHTML=markup;
 const setHtml=(q,html)=>{const el=root.querySelector(q);if(el)el.innerHTML=html};
 const setText=(q,text)=>{const el=root.querySelector(q);if(el)el.textContent=text};
 const update=()=>{
  const f=makeAtlasFormulation(p,state);setHtml('[data-atlas-cycle]',parts(p,state));setHtml('[data-atlas-targets]',targetMarkup(p,state));
  setHtml('[data-atlas-worksheet]',worksheetMarkup(p,state));
  setHtml('[data-atlas-map]',mapMarkup(p,state));
  setText('[data-atlas-summary]',f.summary);
  bindDynamic();write();
 };
 const choose=(name,value,checked)=>{
  const target=name==='maintainer'?state.maintainers:name==='contributor'?state.contributors:state.signs;
  const key=name.startsWith('sign-')?name.slice(5)+':'+value:value;
  if(checked)target.add(key);else target.delete(key);update();
 };
 root.querySelectorAll('input[type="checkbox"]').forEach(input=>input.addEventListener('change',()=>choose(input.name,input.value,input.checked)));
 root.querySelector('[data-atlas-variant]')?.addEventListener('change',e=>{state.variant=e.target.value;update()});
 root.querySelector('[data-atlas-own-situation]')?.addEventListener('input',e=>{state.customSituation=e.target.value;update()});
 function bindDynamic(){
  const spec=worksheetFor(p.id,{variant:state.variant,maintainer:focusFor(state),contributors:[...state.contributors],customSituation:state.customSituation});
  root.querySelector('[data-worksheet-focus]')?.addEventListener('change',e=>{state.worksheetFocus=e.target.value;update()});
  root.querySelectorAll('[data-worksheet-answer]').forEach(textarea=>textarea.addEventListener('input',()=>{
   const arr=state.notes[spec.kind]||(state.notes[spec.kind]=[]);
   arr[Number(textarea.dataset.worksheetAnswer)]=textarea.value;
  }));
  root.querySelector('[data-download-worksheet]')?.addEventListener('click',()=>{
   const specNow=worksheetFor(p.id,{variant:state.variant,maintainer:focusFor(state),contributors:[...state.contributors],customSituation:state.customSituation});
   download('nobodyssimple-'+p.id+'-'+specNow.kind+'-worksheet.txt',worksheetText(specNow,state.notes[specNow.kind]||[]));
   setText('[data-worksheet-status]','The selected worksheet was prepared as a text file.');
  });
  root.querySelectorAll('[data-remove-var]').forEach(b=>b.addEventListener('click',()=>{
   state.custom=state.custom.filter(x=>x.id!==b.dataset.removeVar);update();
  }));
  root.querySelector('[data-atlas-worksheet] a[href^="#tool/atlas-"]')?.addEventListener('click',()=>write());
 }
 root.querySelector('[data-atlas-add-form]')?.addEventListener('submit',e=>{
  e.preventDefault();const form=e.currentTarget, label=String(form.elements.label.value||'').trim().slice(0,80);
  if(!label){setText('[data-add-message]','Add a short description first.');return;}
  if(state.custom.length>=10){setText('[data-add-message]','Keep the map readable with up to ten custom variables.');return;}
  state.custom.push({id:'user'+(++state.nextId),label,kind:form.elements.kind.value,target:form.elements.target.value});
  form.reset();setText('[data-add-message]','Added. You can remove it directly from the map.');update();
 });
 root.querySelector('[data-download-map]')?.addEventListener('click',()=>{
  const f=makeAtlasFormulation(p,state);
  const ws=worksheetFor(id,{variant:state.variant,maintainer:focusFor(state),contributors:[...state.contributors],customSituation:state.customSituation});
  const txt=['Nobody’s Simple · Working psychological formulation',f.summary,'','Specific difficulty: '+p.title,'Specific situation: '+f.situation,
   'Recognised signs:',...f.signs.map(x=>'- '+x),'Possible maintainers:',...f.maintainers.map(x=>'- '+x.label),
   'Contributors:',...f.contributors.map(x=>'- '+x.label),'Other variables:',...f.extra.map(x=>'- '+x.label+' → '+x.target),'',
   'Potential intervention targets:',...f.targets.map(t=>'- '+t.title),'',
   worksheetText(ws,state.notes[ws.kind]||[]),'',
   'Not a diagnosis or proof of causation.'].join('\n');
  download('nobodyssimple-'+id+'-formulation.txt',txt);setText('[data-download-message]','Your working formulation has been prepared for download.');
 });
 root.querySelector('[data-print-guide]')?.addEventListener('click',()=>window.print());
 update();
}
function download(name,content){
 const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
 const a=document.createElement('a');a.href=url;a.download=name;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
