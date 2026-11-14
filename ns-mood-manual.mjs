/* Nobody's Simple · Feelings & Mood field guides.
 * The layout is shared; every article, question, practice and psychological
 * example comes from independently authored, topic-specific editorial data.
 */
import {escapeHTML} from './core.mjs';
import {MOOD_GUIDES} from './ns-mood-guide-data.mjs?v=feel-20261114-v3';
const esc=x=>escapeHTML(String(x??''));
const safeText=x=>String(x??'').trim().slice(0,1300);
export const MOOD_IDS=Object.freeze(MOOD_GUIDES.map(g=>g.id));
const byId=new Map(MOOD_GUIDES.map(g=>[g.id,g]));
const markers=['What happened','What it seemed to mean','What you felt','What you tried to do','What that response protected','What mattered to you','A rule you may be following','How it could have made sense','Another possibility','A different action'];
const rootLabel=(g,root)=>g.roots.find(x=>x[0]===root)?.[1]||root;
export function renderMoodManual(root,id){return renderTopicManual(root,id,byId.get(id),'feel');}
export function renderTopicManual(root,id,g,domain='feel'){
 if(!g)return false;
 const state={mode:null,step:0,answers:{},whyOpen:false,whyQuery:'',whyGroup:'',whyAll:false,whySelected:0,own:false,ownStep:0,ownData:{},whyDone:false};
 const storageKey='ns-mood-manual-'+id+'-v1';
 let saved=false;
 try{const s=JSON.parse(localStorage.getItem(storageKey)||'null');if(s&&s.answers&&s.mode&&g.routes.some(r=>r.id===s.mode)){state.answers=s.answers;state.mode=s.mode;saved=true;}}catch{}
 const backLink=domain==='focus'?'#navigate/atlas/focus':domain==='act'?'#navigate/atlas/act':domain==='think'?'#navigate/atlas/think':domain==='clinical'?'#navigate/atlas/clinical':domain==='experiences'?'#navigate/atlas/experiences':'#navigate/atlas/feel';
 const backLabel=domain==='focus'?'Attention, learning & habits':domain==='act'?'Habits, impulses & compulsions':domain==='think'?'Thoughts & worry':domain==='clinical'?'Mental health & care experiences':domain==='experiences'?'Unusual or distressing experiences':'Feelings & mood';
 const hero='<div class="ns-judge ns-mood" id="ns-mood-top"><nav class="ns-judge-back"><a href="'+backLink+'">← '+backLabel+'</a><a href="#home">Nobody’s Simple home</a></nav>'+
  '<header class="ns-judge-hero"><div><p class="ns-judge-kicker">NOBODY’S SIMPLE · A FIELD GUIDE FOR YOU</p><h1>'+esc(g.title)+'</h1><p class="ns-judge-subhead">'+esc(g.standfirst)+'</p>'+
  '<div class="ns-mood-jump"><button data-mood-scroll="read">Read and understand</button><button data-mood-scroll="start">Find my next step</button><button data-mood-scroll="now">Something to try now</button></div></div><img class="ns-judge-mascot" src="ns-character-guide.webp" alt="" loading="lazy"></header>';

 // A visible, topic-specific safety note where missing an urgent problem could be harmful.
 const immediateNotes={
  'hopelessness':'If you feel you may hurt yourself or cannot stay safe, please reach out to emergency support or someone who can stay with you now. You deserve help with this moment before working through a journal.',
  'panic':'If this is a new or unusually severe physical episode, particularly with significant chest pain, collapse or dangerous breathing difficulty, seek urgent medical assessment rather than assuming it is panic.',
  'panic-experiences':'Panic symptoms deserve proper medical assessment. New severe chest pain, fainting or dangerous breathing symptoms need urgent medical attention rather than a self-help exercise.',
  'mood-shifts':'If your mood changes include markedly increased energy with little need for sleep, or risky decisions that feel unlike you, arrange prompt clinical assessment.',
  'shame-after-sex':'If intimacy involved pressure or a boundary being ignored, you do not have to treat the harm as a problem with your shame. Safety and support come first.',
  'emotional-numbness':'If this disconnection is sudden and comes with confusion, weakness or other new neurological symptoms, seek urgent medical assessment.'
 };
 const safetySummary=g.prominentSafety||immediateNotes[g.id]||'';
 const immediateNote=safetySummary?
  '<aside class="ns-mood-safety" aria-label="When extra support may be important"><p>'+esc(safetySummary)+'</p><a href="#support">Find support</a></aside>':'';

 const story='<section class="ns-mood-read" id="ns-mood-read"><h2 tabindex="-1">'+esc(g.readTitle)+'</h2>'+
  g.article.map((p,i)=>'<p'+(i===g.pullIndex?' class="ns-mood-pull"':'')+'>'+esc(p)+'</p>').join('')+
  '<h2>Why it can keep happening</h2>'+
  g.mechanisms.map(m=>'<div class="ns-mood-mechanism"><h3>'+esc(m[0])+'</h3><p>'+esc(m[1])+'</p></div>').join('')+
  '<div class="ns-mood-cycle"><h3>A possible loop</h3><ol>'+g.cycle.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol><p>This is one possibility. Your circumstances may tell a different story.</p></div>'+
  '<h2>Which part feels familiar?</h2><div class="ns-mood-profiles">'+g.profiles.map(p=>'<div><h3>'+esc(p[0])+'</h3><p>'+esc(p[1])+'</p></div>').join('')+'</div></section>';
 const routes='<section class="ns-mood-routes" id="ns-mood-start"><p class="ns-judge-kicker">ONE GENTLE PLACE TO START</p><h2 tabindex="-1">What would help you most?</h2><p>Choose the difficulty that feels closest. You do not have to work out which therapy you need, and you can change your mind.</p><div class="ns-mood-route-list">'+
  g.routes.map(route=>'<button type="button" data-mood-open="'+esc(route.id)+'"><span><strong>'+esc(route.label)+'</strong><small>'+esc(route.description)+'</small></span><span aria-hidden="true">→</span></button>').join('')+'</div>'+
  '<p class="ns-mood-saved" data-mood-saved>'+(saved?'You have notes stored on this device. <button type="button" data-mood-resume>Resume saved notes</button> <button type="button" data-mood-delete>Delete saved copy</button>':'')+'</p>'+
  '<p class="ns-judge-muted">All exercises use free writing. Every question can be skipped. Nothing is saved automatically.</p></section>';
 const now='<section id="ns-mood-now" class="ns-judge-now"><p class="ns-judge-kicker">SOMETHING YOU CAN DO NOW</p><h2 tabindex="-1">'+esc(g.now.title)+'</h2>'+g.now.paras.map(p=>'<p>'+esc(p)+'</p>').join('')+
  '<div class="ns-mood-now-steps">'+g.now.steps.map((s,i)=>'<p><strong>'+(i+1)+'.</strong> '+esc(s)+'</p>').join('')+'</div></section>';
 const why='<section class="ns-mood-why" id="ns-mood-why"><header class="ns-mood-why-head"><p class="ns-judge-kicker">AN OPTIONAL DEEPER LOOK</p><h2>Understand why</h2><p>'+esc(g.whyIntro)+'</p><button type="button" class="ns-mood-primary" data-mood-why-toggle aria-expanded="false" aria-controls="ns-mood-why-body">Explore what may be underneath ↓</button></header><div id="ns-mood-why-body" data-mood-why-body hidden>'+
  '<div class="ns-mood-why-actions"><button data-mood-why-own>Explore my own experience</button><button data-mood-why-prior>Use my earlier journal answers</button><button data-mood-why-browse>Browse '+g.whyCases.length+' worked examples</button></div>'+
  '<p class="ns-judge-muted">These pathways are examples of possible psychological explanations. They cannot establish an unconscious cause, a diagnosis or what happened in your childhood.</p>'+
  '<section data-mood-why-list hidden class="ns-mood-why-browser"><h3>Find a situation you recognise</h3><label for="ns-mood-why-search">Search situations and explanations</label><input id="ns-mood-why-search" type="search" data-mood-why-search placeholder="Type a situation or worry" autocomplete="off"><div class="ns-mood-why-filters" role="group" aria-label="Filter by what might matter underneath"><button data-mood-why-root="" aria-pressed="true">All examples</button>'+g.roots.map(r=>'<button data-mood-why-root="'+esc(r[0])+'" aria-pressed="false">'+esc(r[1])+'</button>').join('')+'</div><p role="status" data-mood-why-count></p><div data-mood-why-results></div><button type="button" data-mood-why-more hidden>Show all matches</button></section>'+
  '<section class="ns-mood-why-selected"><h3 tabindex="-1" data-mood-why-title></h3><div data-mood-why-graph></div><div data-mood-why-related></div><button data-mood-why-adapt>Start with this example and change what does not fit</button></section>'+
  '<section class="ns-mood-why-self" data-mood-why-self hidden></section></div></section>';
 const footer='<footer class="ns-judge-footer"><details><summary>Research, safety and further support</summary><p>'+esc(g.evidence)+'</p>'+
  '<ul>'+g.sources.map(s=>'<li><a target="_blank" rel="noopener noreferrer" href="'+esc(s[1])+'">'+esc(s[0])+'</a></li>').join('')+'</ul>'+
  '<p>'+esc(g.safety)+'</p><p>These exercises are educational guides, not a diagnosis or individualised psychological treatment. Learning a different response takes practice. If someone is at risk, practical support and safety come first.</p></details><p>Your words remain in this open page unless you choose to download them or explicitly save them on this device. A shared device may not be private.</p></footer>';
 root.innerHTML=hero+immediateNote+story+routes+'<section class="ns-judge-work" data-mood-work hidden aria-label="Your guided exercise"><div data-mood-screen></div></section>'+now+why+footer+'</div>'+
  '<dialog class="ns-mood-dialog" data-mood-ideas aria-label="Optional ideas"><button type="button" data-mood-ideas-close class="ns-mood-dialog-close" aria-label="Close ideas">×</button><ul data-mood-ideas-list></ul></dialog>';
 const shell=root.querySelector('.ns-mood'),work=root.querySelector('[data-mood-work]'),screen=root.querySelector('[data-mood-screen]'),dialog=root.querySelector('[data-mood-ideas]'),whySection=root.querySelector('[data-mood-why-body]');
 let ideaTrigger=null;
 dialog.addEventListener('close',()=>ideaTrigger?.focus());
 const findRoute=()=>g.routes.find(r=>r.id===state.mode);
 const currentAnswers=()=>state.answers[state.mode]||(state.answers[state.mode]={});
 const qValue=()=>{const el=root.querySelector('[data-mood-answer]');return el?safeText(el.value):''};
 function showWork(){
  work.hidden=false;screen.querySelector('h2[tabindex="-1"]')?.focus({preventScroll:true});
  work.scrollIntoView({block:'start',behavior:'auto'});
 }
 function showQuestion(){
  const route=findRoute(),step=route?.questions[state.step];if(!step){finish();return;}
  const savedValue=currentAnswers()[String(state.step)]||'';
  screen.innerHTML='<p class="ns-judge-kicker">'+esc(route.title)+'</p><p class="ns-judge-progress">Question '+(state.step+1)+' of '+route.questions.length+'</p>'+
   '<div class="ns-judge-progressbar"><span style="width:'+((state.step+1)/route.questions.length*100)+'%"></span></div>'+
   '<div class="ns-judge-question-line"><h2 tabindex="-1">'+esc(step[0])+'</h2>'+
   (step[3]&&g.ideas[step[3]]?.length?'<button class="ns-judge-idea-trigger" data-mood-idea="'+esc(step[3])+'" type="button" aria-haspopup="dialog">✦ Show me ideas</button>':'')+'</div>'+
   '<p class="ns-judge-help">'+esc(step[1])+'</p><div class="ns-judge-practice"><strong>Something to notice as you answer</strong><p>'+esc(step[2])+'</p></div>'+
   '<label class="ns-judge-sr" for="ns-mood-answer">Your own words</label><textarea id="ns-mood-answer" data-mood-answer rows="4" maxlength="1300" placeholder="Your own words are enough. You can also leave this blank.">'+esc(savedValue)+'</textarea>'+
   '<div class="ns-judge-actions">'+(state.step?'<button class="ns-judge-secondary" data-mood-back>Back</button>':'<button class="ns-judge-secondary" data-mood-close>Close</button>')+
   '<button class="ns-judge-primary" data-mood-next>'+(state.step===route.questions.length-1?'See what I can use':'Continue')+' →</button></div>'+
   '<p class="ns-judge-muted">There is no right answer. You can stop whenever you have something helpful.</p>';showWork();
 }
 function collect(){if(findRoute())currentAnswers()[String(state.step)]=qValue();}
 function finish(){
  const route=findRoute(),answers=currentAnswers();
  const lines=route.questions.map((q,i)=>answers[String(i)]?'<div><strong>'+esc(q[0])+'</strong><p>'+esc(answers[String(i)])+'</p></div>':'').filter(Boolean);
  const last=route.questions.length-1;
  screen.innerHTML='<p class="ns-judge-kicker">YOUR NOTES</p><h2 tabindex="-1">What you have worked towards</h2>'+
   '<p>'+esc(route.finish)+'</p><div class="ns-mood-notes">'+(lines.join('')||'<p>You can start with one question when you feel ready.</p>')+'</div>'+
   '<div class="ns-judge-finish-practice"><h3>'+esc(route.practiceTitle)+'</h3><p>'+esc(route.practice)+'</p>'+
   (answers[String(last)]?'<p><strong>Your own next step:</strong> '+esc(answers[String(last)])+'</p>':'')+'</div>'+
   '<div class="ns-judge-actions"><button class="ns-judge-primary" data-mood-revise>Review my answers</button><button class="ns-judge-secondary" data-mood-download>Download my notes</button>'+
   '<button class="ns-judge-secondary" data-mood-save>Save on this device</button><button class="ns-judge-secondary" data-mood-close>Finish for now</button></div>'+
   '<p role="status" data-mood-save-status class="ns-judge-muted">Saving is optional. Anyone with access to this browser could read saved notes.</p>';showWork();
 }
 function navigate(routeId){state.mode=routeId;state.step=0;showQuestion();}
 function exportNotes(){
  const lines=['Nobody’s Simple — '+g.title,'Your own reflection, not a diagnosis',''];
  for(const route of g.routes){const a=state.answers[route.id]||{};if(Object.values(a).some(Boolean)){lines.push(route.title);route.questions.forEach((q,i)=>{if(a[String(i)])lines.push(q[0],a[String(i)],'');});}}
  const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='nobodys-simple-'+id+'-notes.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1800);
 }
 function openWhy(){
  state.whyOpen=true;whySection.hidden=false;
  const toggle=root.querySelector('[data-mood-why-toggle]');toggle.setAttribute('aria-expanded','true');toggle.textContent='Close Understand Why ↑';
  drawWhy();drawWhyList();
 }
 function graphRows(x,personal=false){
  const keys=['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action'];
  return '<ol class="ns-mood-why-graph" aria-label="'+(personal?'Your own working explanation':'One possible explanation')+'">'+keys.map((key,i)=>
   '<li><span class="ns-mood-node-number" aria-hidden="true">'+(i+1)+'</span><div><span class="ns-mood-node-label">'+esc(g.whyStages[i])+'</span><p>'+(x[key]?esc(x[key]):'<em>Unanswered — no need to guess</em>')+'</p></div></li>').join('')+'</ol>';
 }
 function drawWhy(){
  const x=g.whyCases[state.whySelected]||g.whyCases[0];
  root.querySelector('[data-mood-why-title]').textContent=x.situation;
  root.querySelector('[data-mood-why-graph]').innerHTML=graphRows(x);
  const related=g.whyCases.map((v,i)=>({v,i})).filter(y=>y.i!==state.whySelected&&y.v.root===x.root).slice(0,5);
  root.querySelector('[data-mood-why-related]').innerHTML='<h4>Other situations that may touch '+esc(rootLabel(g,x.root).toLowerCase())+'</h4><div class="ns-mood-related-list">'+
   related.map(y=>'<button data-mood-why-select="'+y.i+'">'+esc(y.v.situation)+'</button>').join('')+'</div>';
 }
 function drawWhyList(){
  const items=g.whyCases.map((v,i)=>({...v,i})).filter(x=>(!state.whyGroup||x.root===state.whyGroup)&&(!state.whyQuery||
   [x.situation,x.interpretation,x.rule,x.response,x.need,x.root].some(v=>String(v).toLowerCase().includes(state.whyQuery))));
  root.querySelector('[data-mood-why-count]').textContent=items.length+' matching example'+(items.length===1?'':'s');
  root.querySelector('[data-mood-why-results]').innerHTML=(state.whyAll?items:items.slice(0,10)).map(x=>
   '<button data-mood-why-select="'+x.i+'"><strong>'+esc(x.situation)+'</strong><small>'+esc(rootLabel(g,x.root))+'</small></button>').join('')||'<p>No matches. Try another phrase or clear your filter.</p>';
  root.querySelector('[data-mood-why-more]').hidden=state.whyAll||items.length<=10;
  root.querySelectorAll('[data-mood-why-root]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.moodWhyRoot===state.whyGroup)));
 }
 function showWhyEditor(){
  const stage=g.whyStages[state.ownStep],q=g.whyQuestions[state.ownStep],key=['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action'][state.ownStep];
  const area=root.querySelector('[data-mood-why-self]');
  area.hidden=false;
  area.innerHTML='<p class="ns-judge-kicker">MY OWN POSSIBLE PATTERN</p><h3 tabindex="-1">Follow one thread</h3>'+
   '<p>Layer '+(state.ownStep+1)+' of 10. You may stop early or leave any layer blank.</p><div class="ns-judge-progressbar"><span style="width:'+((state.ownStep+1)*10)+'%"></span></div>'+
   '<label for="ns-mood-why-answer"><strong>'+esc(q)+'</strong></label><p class="ns-judge-help">'+esc(stage)+'. You can say “I don’t know” without filling in a story.</p>'+
   '<textarea id="ns-mood-why-answer" data-mood-why-answer rows="4" maxlength="1300">'+esc(state.ownData[key]||'')+'</textarea>'+
   '<div class="ns-judge-actions">'+(state.ownStep?'<button class="ns-judge-secondary" data-mood-why-back>Back</button>':'')+
   '<button class="ns-judge-primary" data-mood-why-next>'+(state.ownStep===9?'See my map':'Next layer')+'</button>'+
   '<button class="ns-judge-secondary" data-mood-why-finish>See my map now</button><button class="ns-judge-secondary" data-mood-why-hide>Close</button></div>';
  area.querySelector('h3')?.focus({preventScroll:true});area.scrollIntoView({block:'start',behavior:'auto'});
 }
 function finishWhy(){
  const area=root.querySelector('[data-mood-why-self]'),d=state.ownData;
  area.hidden=false;area.innerHTML='<p class="ns-judge-kicker">YOUR WORKING EXPLANATION</p><h3 tabindex="-1">What you have noticed</h3><p>This is a possible account in your own words. It is not a diagnosis or a proven hidden cause. You can revise it.</p>'+
   graphRows(d,true)+'<div class="ns-judge-finish-practice"><h3>What could you choose differently?</h3><p><strong>The rule to examine:</strong> '+esc(d.rule||'You do not have to know yet.')+'</p>'+
   '<p><strong>Another possibility:</strong> '+esc(d.alternative||'An open question is okay.')+'</p>'+
   '<p><strong>What you might try:</strong> '+esc(d.action||'Choose a safe next step when ready.')+'</p></div>'+
   '<div class="ns-judge-actions"><button class="ns-judge-secondary" data-mood-why-edit>Review my map</button><button class="ns-judge-secondary" data-mood-why-export>Download my map</button>'+
   '<button class="ns-judge-secondary" data-mood-why-clear>Clear my map</button></div>'+
   '<p class="ns-judge-muted">No answers are saved automatically. The map stays in this open page until you leave or download it.</p>';
  area.querySelector('h3')?.focus({preventScroll:true});area.scrollIntoView({block:'start',behavior:'auto'});
 }
 function enterWhy(kind){
  if(!state.whyOpen)openWhy();
  if(kind==='adapt'){const x=g.whyCases[state.whySelected];state.ownData=Object.fromEntries(['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action'].map(k=>[k,x[k]]));}
  else if(kind==='prior'){const a=state.answers[g.routes[0].id]||{};state.ownData={situation:a['0']||'',interpretation:a['1']||'',response:a['2']||'',need:a['3']||''};}
  else state.ownData={};
  state.ownStep=0;showWhyEditor();
 }
 function exportWhy(){
  const items=['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action'];
  const lines=['Nobody’s Simple — '+g.title+' — Understand Why','Your own hypothesis, not a diagnosis',''];
  items.forEach((k,i)=>lines.push(g.whyStages[i],state.ownData[k]||'(unanswered)',''));
  const url=URL.createObjectURL(new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='nobodys-simple-'+id+'-why.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 function collectWhy(){const t=root.querySelector('[data-mood-why-answer]');if(t){const k=['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action'][state.ownStep];state.ownData[k]=safeText(t.value);}}
 root.addEventListener('input',ev=>{
  if(ev.target.matches('[data-mood-why-search]')){state.whyQuery=ev.target.value.toLowerCase().trim();state.whyAll=false;drawWhyList();}
 });
 root.addEventListener('click',ev=>{
  const b=ev.target.closest('button');if(!b||!root.contains(b))return;
  if(b.dataset.moodScroll){
   const target=root.querySelector('#ns-mood-'+b.dataset.moodScroll);target?.scrollIntoView({block:'start',behavior:'auto'});target?.querySelector('h2')?.focus({preventScroll:true});return;
  }
  if(b.dataset.moodOpen){navigate(b.dataset.moodOpen);return;}
  if(b.hasAttribute('data-mood-next')){collect();state.step++;showQuestion();return;}
  if(b.hasAttribute('data-mood-back')){collect();state.step=Math.max(0,state.step-1);showQuestion();return;}
  if(b.hasAttribute('data-mood-close')){work.hidden=true;root.querySelector('#ns-mood-start')?.scrollIntoView({block:'start'});return;}
  if(b.hasAttribute('data-mood-revise')){state.step=0;showQuestion();return;}
  if(b.hasAttribute('data-mood-download')){exportNotes();return;}
  if(b.dataset.moodIdea){
   const ideas=g.ideas[b.dataset.moodIdea]||[];if(ideas.length){ideaTrigger=b;dialog.querySelector('[data-mood-ideas-list]').innerHTML=ideas.map(x=>'<li>'+esc(x)+'</li>').join('');dialog.showModal();}return;
  }
  if(b.hasAttribute('data-mood-ideas-close')){dialog.close();return;}
  if(b.hasAttribute('data-mood-save')){
   const n=root.querySelector('[data-mood-save-status]');
   try{localStorage.setItem(storageKey,JSON.stringify({answers:state.answers,mode:state.mode}));saved=true;
    root.querySelector('[data-mood-saved]').innerHTML='You have notes saved on this device. <button data-mood-resume>Resume saved notes</button> <button data-mood-delete>Delete saved copy</button>';
    if(n)n.textContent='Saved on this device. You can delete this copy from the starting section.';}
   catch{if(n)n.textContent='Saving was unavailable. You can still download your notes.';}return;
  }
  if(b.hasAttribute('data-mood-resume')){if(!state.mode)state.mode=g.routes[0].id;finish();return;}
  if(b.hasAttribute('data-mood-delete')){
   try{localStorage.removeItem(storageKey);saved=false;root.querySelector('[data-mood-saved]').textContent='Saved copy deleted. Your current notes will be lost when you leave.';}catch{}return;
  }
  if(b.hasAttribute('data-mood-why-toggle')){
   if(state.whyOpen){state.whyOpen=false;whySection.hidden=true;b.setAttribute('aria-expanded','false');b.textContent='Explore what may be underneath ↓';}
   else openWhy();return;
  }
  if(b.hasAttribute('data-mood-why-browse')){
   if(!state.whyOpen)openWhy();const sec=root.querySelector('[data-mood-why-list]');sec.hidden=!sec.hidden;drawWhyList();return;
  }
  if(b.dataset.moodWhyRoot!==undefined){state.whyGroup=b.dataset.moodWhyRoot;state.whyAll=false;drawWhyList();return;}
  if(b.hasAttribute('data-mood-why-more')){state.whyAll=true;drawWhyList();return;}
  if(b.dataset.moodWhySelect!==undefined){
   state.whySelected=Number(b.dataset.moodWhySelect);drawWhy();root.querySelector('[data-mood-why-title]')?.focus({preventScroll:true});root.querySelector('[data-mood-why-title]')?.scrollIntoView({block:'start'});return;
  }
  if(b.hasAttribute('data-mood-why-own')){enterWhy('blank');return;}
  if(b.hasAttribute('data-mood-why-prior')){enterWhy('prior');return;}
  if(b.hasAttribute('data-mood-why-adapt')){enterWhy('adapt');return;}
  if(b.hasAttribute('data-mood-why-next')){collectWhy();if(state.ownStep===9)finishWhy();else{state.ownStep++;showWhyEditor();}return;}
  if(b.hasAttribute('data-mood-why-back')){collectWhy();state.ownStep=Math.max(0,state.ownStep-1);showWhyEditor();return;}
  if(b.hasAttribute('data-mood-why-finish')){collectWhy();finishWhy();return;}
  if(b.hasAttribute('data-mood-why-edit')){state.ownStep=0;showWhyEditor();return;}
  if(b.hasAttribute('data-mood-why-export')){exportWhy();return;}
  if(b.hasAttribute('data-mood-why-clear')){state.ownData={};root.querySelector('[data-mood-why-self]').hidden=true;return;}
  if(b.hasAttribute('data-mood-why-hide')){root.querySelector('[data-mood-why-self]').hidden=true;}
 });
 root.addEventListener('change',ev=>{});
 root.addEventListener('keydown',ev=>{if(ev.target.matches('textarea')&&ev.key==='Enter'&&ev.ctrlKey){ev.preventDefault();ev.target.closest('[data-mood-screen]')?.querySelector('[data-mood-next]')?.click();}});
 return true;
}
