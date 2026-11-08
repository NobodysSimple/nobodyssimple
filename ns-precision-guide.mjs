import {escapeHTML as esc} from './core.mjs';
import {getPreciseProfile} from './ns-precision-content.mjs';
import {getPrecisionHandoff} from './ns-precision-console.mjs';
import {tools} from './tool-catalog.mjs';

const safe=x=>esc(String(x??''));
const toolIndex=new Map(tools.map(x=>[x.id,x]));
const nameOf=x=>x?.label||x?.id||'';
const sources=(items)=>items.map(x=>'<a href="'+safe(x.url)+'" target="_blank" rel="noopener noreferrer">'+safe(x.title)+' <span aria-hidden="true">↗</span></a>').join('');
function signGroup(label,items,name,selected){
 return '<fieldset><legend>'+safe(label)+'</legend><div class="ns-deep-sign-options">'+
 items.map((x,i)=>'<label class="ns-deep-sign"><input type="checkbox" name="'+name+'" value="'+i+'" '+(selected.includes(name+':'+i)?'checked':'')+'><span>'+safe(x)+'</span></label>').join('')+
 '</div></fieldset>';
}
function formFactor(items,name,selected){
 return items.map(x=>'<label class="ns-deep-factor"><input type="checkbox" name="'+name+'" value="'+safe(x.id)+'" '+(selected.includes(x.id)?'checked':'')+'><span><strong>'+safe(x.label)+'</strong>'+
 (x.detail?'<small>'+safe(x.detail)+'</small>':'')+'</span></label>').join('');
}
function firstHTML(p,h){
 const chosen=p.questions[1].options.find(x=>x[0]===h?.answers?.[p.questions[1].id]);
 const preselected=chosen?.[3]?[chosen[3]]:[];
 const specialChosen=p.id==='submissive-patterns'&&h?.answers?.kind==='chosen';
 const unsafeChosen=p.id==='submissive-patterns'&&h?.answers?.kind==='unsafe';
 const critical=Boolean(p.alert)||unsafeChosen;
 return {preselected,specialChosen,unsafeChosen,critical,html:
 '<div class="ns-deep-shell"><a class="ns-deep-back" href="#navigate">← Back to Emotional Calculator</a>'+
 '<header class="ns-deep-header"><p class="eyebrow">NOBODY’S SIMPLE · PRECISE PSYCHOLOGICAL GUIDE</p>'+
 '<h1>'+safe(p.title)+'</h1><p>'+safe(p.definition)+'</p>'+
 '<span class="ns-deep-heritage">'+safe(p.taxonomy)+'</span></header>'+
 (critical?'<aside class="ns-deep-alert"><strong>'+safe(unsafeChosen?'Choice and safety first':'Consider appropriate health support')+'</strong><p>'+
 safe(unsafeChosen?'If disagreeing could provoke threats or punishment, do not use an assertiveness exercise as a test. Seek safe support and practical options.':p.alert)+
 '</p><a href="#support">Get human support →</a></aside>':'')+
 (specialChosen?'<aside class="ns-deep-note"><strong>A consensual preference is not a disorder.</strong><p>Being comfortable with a chosen submissive role does not require treatment. This guide is only relevant if you want more choice, clearer consent or stronger boundaries.</p></aside>':'')+
 '<div class="ns-deep-stages" aria-label="Guide structure"><span>Recognise it</span><span>Understand the loop</span><span>Build your map</span><span>Try what fits</span></div>'+
 '<section class="ns-deep-section"><div class="ns-deep-section-title"><small>01 · WHAT & SIGNS</small><h2>What might this look like?</h2></div>'+
 '<p class="ns-deep-intro">Notice what sounds familiar. You do not need to identify with everything.</p>'+
 '<div class="ns-deep-signs">'+signGroup('Thoughts',p.signs.thoughts,'thoughts',[])+signGroup('Feelings',p.signs.feelings,'feelings',[])+
 signGroup('Behaviours',p.signs.behaviours,'behaviours',[])+signGroup('Body',p.signs.body,'body',[])+'</div></section>'+
 '<section class="ns-deep-section"><div class="ns-deep-section-title"><small>02 · WHAT MAY KEEP IT GOING</small><h2>One possible feedback loop</h2></div>'+
 '<div class="ns-deep-loop">'+p.cycle.map((x,i)=>'<div class="ns-deep-loop-node"><span>'+(i+1)+'</span><strong>'+safe(x)+'</strong></div>'+
 (i!==p.cycle.length-1?'<span class="ns-deep-loop-arrow" aria-hidden="true">→</span>':'')).join('')+'</div>'+
 '<p class="ns-deep-fine">This is a possible maintaining process, not proof of the cause or a prediction for everyone.</p></section>'+
 '<section class="ns-deep-section" id="precision-profile"><div class="ns-deep-section-title"><small>03 · YOUR PERSONAL PROFILE</small><h2>Which parts fit you?</h2></div>'+
 '<p class="ns-deep-intro">These are candidate maintainers and contributors. Tick what you recognise; the map will update without assigning a diagnosis or certainty score.</p>'+
 '<div class="ns-deep-choose-grid"><div><h3>What seems to keep it going?</h3><div class="ns-deep-factor-list">'+formFactor(p.maintainers,'maintainer',preselected)+'</div></div>'+
 '<div><h3>What might contribute?</h3><div class="ns-deep-factor-list">'+formFactor(p.contributors,'contributor',[])+'</div></div></div>'+
 '<details class="ns-deep-contrasts"><summary>What else should I consider?</summary>'+p.contrasts.map(x=>'<p>'+safe(x)+'</p>').join('')+'</details></section>'+
 '<section class="ns-deep-section" id="precision-map"><div class="ns-deep-section-title"><small>04 · YOUR WORKING FORMULATION</small><h2>Make a map of your pattern</h2></div>'+
 '<p class="ns-deep-intro">This interactive diagram visualises <em>hypotheses you selected</em>, not established causal relationships. Add or remove variables as your understanding changes.</p>'+
 '<div class="ns-deep-map" data-precision-map aria-live="polite"></div>'+
 '<details class="ns-deep-add"><summary><span aria-hidden="true">＋</span> Add a variable or circumstance</summary>'+
 '<form data-precision-add class="ns-deep-add-form"><label>What would you add?<input name="label" type="text" maxlength="72" required placeholder="e.g. Work shifts, reassurance, support from a friend"></label>'+
 '<div class="ns-deep-add-columns"><label>What role might it play?<select name="kind"><option value="contributor">Possible contributor</option><option value="maintainer">Possible maintainer</option><option value="protective">Possible protective factor</option></select></label>'+
 '<label>What might it affect?<select name="target"><option value="difficulty">The difficulty</option><option value="response">My response</option><option value="short">Short-term effect</option><option value="long">Longer-term pattern</option></select></label></div>'+
 '<button type="submit" class="button secondary">Add to my map</button><p data-add-error class="ns-deep-fine" role="status"></p></form></details></section>'+
 '<section class="ns-deep-section" id="precision-help"><div class="ns-deep-section-title"><small>05 · INTERVENTIONS BY MECHANISM</small><h2>What should I try first?</h2></div>'+
 '<p class="ns-deep-intro">Up to three starting points based on what you ticked. Recommendations are options to consider, not a treatment prescription.</p>'+
 '<div class="ns-deep-actions" data-precision-actions aria-live="polite"></div>'+
 (specialChosen?'<p class="ns-deep-note-inline">If the relationship is consensual and your needs are respected, you do not need to change your preference. You can choose to practise communication only if it helps you.</p>':'')+
 '</section>'+
 '<section class="ns-deep-section"><div class="ns-deep-section-title"><small>06 · WHAT PROGRESS CAN LOOK LIKE</small><h2>Look for changes in life, not just symptoms</h2></div>'+
 '<div class="ns-deep-progress-list">'+p.progress.map((x,i)=>'<div><span>'+(i+1)+'</span>'+safe(x)+'</div>').join('')+'</div>'+
 '<p class="ns-deep-fine">Progress is not necessarily linear. These are possible indicators, not required milestones.</p></section>'+
 '<section class="ns-deep-section ns-deep-final"><div class="ns-deep-section-title"><small>07 · YOUR TAKEAWAY</small><h2>Your formulation, in plain English</h2></div>'+
 '<p data-precision-summary class="ns-deep-summary" aria-live="polite"></p>'+
 '<div class="ns-deep-export"><button type="button" class="button" data-precision-download>Download my map</button>'+
 '<button type="button" class="button secondary" data-precision-print>Print</button></div>'+
 '<p class="ns-deep-fine" data-export-status role="status">Nothing is saved automatically; only a file you choose to download will retain your entries.</p></section>'+
 '<details class="ns-deep-reading"><summary>Further reading and sources</summary><div class="ns-deep-sources">'+sources(p.links)+'</div></details>'+
 '<footer class="ns-deep-footer"><a href="#navigate">Explore another problem →</a><a href="#support">Find human support →</a></footer></div>'};
}
function getState(p,h){
 const q=p.questions[1],option=q.options.find(x=>x[0]===h?.answers?.[q.id]);
 return {maintainers:new Set(option?.[3]?[option[3]]:[]),contributors:new Set(),signs:new Set(),custom:[],count:0,
   chosen:p.id==='submissive-patterns'&&h?.answers?.kind==='chosen',
   unsafe:p.id==='submissive-patterns'&&h?.answers?.kind==='unsafe'};
}
function formula(p,st){
 const maintainers=p.maintainers.filter(x=>st.maintainers.has(x.id));
 const contributors=p.contributors.filter(x=>st.contributors.has(x.id));
 const signs=[...st.signs].map(v=>{const [group,index]=v.split(':');return p.signs[group]?.[Number(index)]||'';}).filter(Boolean);
 const ownM=st.custom.filter(x=>x.kind==='maintainer'),ownC=st.custom.filter(x=>x.kind==='contributor'),protect=st.custom.filter(x=>x.kind==='protective');
 const chosenM=[...maintainers.map(x=>x.label),...ownM.map(x=>x.label)];
 const chosenC=[...contributors.map(x=>x.label),...ownC.map(x=>x.label)];
 const response=chosenM.length?chosenM.join(', '):'the maintaining factors are not yet clear';
 const context=chosenC.length?chosenC.join(', '):'other contributors remain uncertain';
 const userSigns=signs.length?'You recognised: '+signs.slice(0,5).join('; ')+'. ':'';
 let summary='Your selected pattern involves '+p.title.toLowerCase()+'. '+userSigns+
 'Possible maintaining factors: '+response+'. Possible contributors: '+context+'. '+
 (protect.length?'You also identified protective factors: '+protect.map(x=>x.label).join(', ')+'. ':'')+
 'These links remain hypotheses; you can revise them as you learn more.';
 if(st.chosen)summary='You indicated a freely chosen, consensual submissive preference. This is not inherently a problem. '+summary;
 if(st.unsafe)summary='You identified possible pressure or fear. Prioritise safety and practical support before experimenting with assertiveness. '+summary;
 return {maintainers,contributors,signs,ownM,ownC,protect,summary};
}
function chip(text,kind='',id=''){
 return '<span class="ns-deep-map-chip '+(kind?'is-'+kind:'')+'">'+safe(text)+
 (id?'<button type="button" data-remove-custom="'+safe(id)+'" aria-label="Remove '+safe(text)+'">×</button>':'')+'</span>';
}
function renderMap(p,st){
 const f=formula(p,st);
 const contrib=[...f.contributors.map(x=>chip(x.label)),...f.ownC.map(x=>chip(x.label,'custom',x.id))];
 const response=[...f.maintainers.map(x=>chip(x.label)),...f.ownM.map(x=>chip(x.label,'custom',x.id))];
 const protectedChips=f.protect.map(x=>chip(x.label,'protect',x.id));
 const customConnections=st.custom.length?'<div class="ns-deep-custom-connections"><small>ADDITIONAL HYPOTHESISED LINKS</small>'+st.custom.map(x=>
 '<div>'+safe(x.label)+' <strong>→</strong> '+safe(({difficulty:'this difficulty',response:'my response',short:'short-term effect',long:'longer-term pattern'})[x.target]||'this difficulty')+'</div>').join('')+'</div>':'';
 return '<div class="ns-deep-map-line"><div><small>POSSIBLE CONTRIBUTORS</small><div class="ns-deep-map-chips">'+(contrib.join('')||'<em>Choose or add a contributor</em>')+'</div></div>'+
 '<span class="ns-deep-map-arrow" aria-hidden="true">→</span>'+
 '<div class="ns-deep-map-focus"><small>EXPERIENCE</small><strong>'+safe(p.title)+'</strong></div></div>'+
 '<div class="ns-deep-map-center-arrow" aria-hidden="true">↓</div>'+
 '<div class="ns-deep-map-line"><div class="ns-deep-map-maintainers"><small>WHAT MIGHT KEEP IT GOING</small><div class="ns-deep-map-chips">'+
 (response.join('')||'<em>Choose a maintaining process above</em>')+'</div></div>'+
 '<span class="ns-deep-map-arrow" aria-hidden="true">→</span>'+
 '<div><small>SHORT-TERM EFFECT</small><strong>'+safe(p.cycle[2])+'</strong></div></div>'+
 '<div class="ns-deep-map-center-arrow" aria-hidden="true">↓</div>'+
 '<div class="ns-deep-map-outcome"><small>LONGER-TERM PATTERN</small><strong>'+safe(p.cycle[3])+'</strong><span>↻ May feed back into the original difficulty</span></div>'+
 (protectedChips.length?'<div class="ns-deep-map-protect"><small>WHAT MIGHT INTERRUPT THE LOOP</small>'+protectedChips.join('')+'</div>':'')+
 customConnections+'<p class="ns-deep-fine">Arrows represent possible influences, not measured effects or verified causes.</p>';
}
function recommendations(p,st){
 if(st.unsafe)return '<div class="ns-deep-recommendation"><strong>Safety and support first</strong><p>Where a person fears retaliation or coercion, an assertiveness exercise could create risk. Identify a safe person or appropriate service and practical options before confronting somebody.</p><a href="#support">Find support →</a></div>';
 if(st.chosen&&!st.maintainers.size)return '<div class="ns-deep-recommendation"><strong>No problem needs to be fixed merely because you prefer a submissive role.</strong><p>Consider whether you can freely give or withdraw consent, express preferences and set boundaries. If you can, there may be nothing to treat here.</p></div>';
 const active=p.targets.filter(x=>st.maintainers.has(x.id));
 const list=active.length?active.slice(0,3):p.targets.slice(0,2);
 return list.map((t,i)=>{
  const tool=toolIndex.get(t.tool);
  return '<article class="ns-deep-recommendation"><span>'+(i+1)+'</span><div><h3>'+safe(t.title)+'</h3>'+
  '<p><strong>Why:</strong> '+safe(t.why)+'</p><p><strong>Try:</strong> '+safe(t.action)+'</p>'+
  (tool?'<a href="#tool/'+safe(tool.id)+'">Practise with '+safe(tool.title||tool.id)+' →</a>':'')+'</div></article>';
 }).join('')+(active.length?'<p class="ns-deep-fine">These suggestions correspond to the maintaining factors you selected, not to a diagnostic category.</p>':
 '<p class="ns-deep-fine">No maintaining factor selected yet. These are general examples, not personalised recommendations.</p>');
}
export function renderPrecisionGuide(root,id){
 const p=getPreciseProfile(id);
 if(!p){root.innerHTML='<p>This guide is not available yet. <a href="#navigate">Return to the navigator</a>.</p>';return;}
 const h=getPrecisionHandoff(id);
 const st=getState(p,h);
 root.innerHTML=firstHTML(p,h).html;
 const update=()=>{
  root.querySelector('[data-precision-map]').innerHTML=renderMap(p,st);
  root.querySelector('[data-precision-actions]').innerHTML=recommendations(p,st);
  root.querySelector('[data-precision-summary]').textContent=formula(p,st).summary;
 };
 const bind=()=>{
  root.querySelectorAll('input[name="maintainer"],input[name="contributor"],input[name="thoughts"],input[name="feelings"],input[name="behaviours"],input[name="body"]').forEach(input=>input.addEventListener('change',()=>{
   const values=input.name==='maintainer'?st.maintainers:input.name==='contributor'?st.contributors:st.signs;
   const key=['maintainer','contributor'].includes(input.name)?input.value:input.name+':'+input.value;
   if(input.checked)values.add(key);else values.delete(key);
   update();
  }));
  root.querySelector('[data-precision-map]').addEventListener('click',ev=>{
   const button=ev.target.closest('[data-remove-custom]');if(!button)return;
   st.custom=st.custom.filter(x=>x.id!==button.dataset.removeCustom);update();
  });
  root.querySelector('[data-precision-add]').addEventListener('submit',ev=>{
   ev.preventDefault();const form=ev.currentTarget;
   const label=form.elements.label.value.trim().replace(/\s+/g,' ').slice(0,72);
   if(!label){root.querySelector('[data-add-error]').textContent='Enter a short description.';return;}
   if(st.custom.length>=8){root.querySelector('[data-add-error]').textContent='Use up to eight custom variables to keep the map readable.';return;}
   st.custom.push({id:'v'+(++st.count),label,kind:form.elements.kind.value,target:form.elements.target.value});
   form.reset();root.querySelector('[data-add-error]').textContent='Added to your map.';update();
  });
  root.querySelector('[data-precision-download]').addEventListener('click',()=>{
   const f=formula(p,st);
   const txt=['Nobody’s Simple · Private working formulation',p.title,'','What I recognise:',...f.signs.map(x=>'- '+x),'',
    'Maintainers I selected:',...f.maintainers.map(x=>'- '+x.label),'','Contributors I selected:',...f.contributors.map(x=>'- '+x.label),
    '','Additional variables:',...st.custom.map(x=>'- '+x.label+' ['+x.kind+' → '+x.target+']'),'',
    'My tentative formulation:',f.summary,'',
    'Possible first steps:',...p.targets.filter(x=>st.maintainers.has(x.id)).slice(0,3).map(x=>'- '+x.title+': '+x.action),'',
    'This is a personal learning hypothesis, not a diagnosis or proof of causation.'].join('\n');
   const url=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));
   const a=document.createElement('a');a.href=url;a.download='nobodyssimple-'+id+'-working-map.txt';
   document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
   root.querySelector('[data-export-status]').textContent='Your map has been prepared as a local text file.';
  });
  root.querySelector('[data-precision-print]').addEventListener('click',()=>window.print());
 };
 bind();update();
}
