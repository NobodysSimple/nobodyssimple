import {escapeHTML as esc} from './core.mjs';
import {tools} from './tool-catalog.mjs';
import {problemDomains,problemIndex,getProblem,findProblems,problemsInDomain,knowledgeFamilies,sourceForProblem,nhsHelp} from './ns-problem-map.mjs';

const toolById=new Map(tools.map(x=>[x.id,x]));
let ephemeralHandoff=null;
export function peekProblemHandoff(id){return ephemeralHandoff?.primary===id?ephemeralHandoff:null;}
export function clearProblemHandoff(){ephemeralHandoff=null;}
export const learningModes=Object.freeze(['tools','learn']);
const s=x=>esc(String(x??''));
const topicInfo=p=>p?.title||'';
const scrollTop=()=>{if(typeof window!=='undefined')window.scrollTo({top:0,behavior:'instant'});};
function domToolLinks(p,max=3){
 return [...new Set(p.tools)].map(id=>toolById.get(id)).filter(Boolean).slice(0,max).map(t=>({
  title:t.title||t.name||t.id, short:t.short||'Explore this interactive tool',href:'#tool/'+t.id
 }));
}
export function recommendForProblems(ids,{mechanism='',context='',time='short'}={}){
 const problems=[...new Set(ids)].map(getProblem).filter(Boolean);
 const seen=new Set();
 const matches=problems.flatMap(p=>domToolLinks(p,4).map(t=>({...t,problem:p.id})))
   .filter(t=>{if(seen.has(t.href))return false;seen.add(t.href);return true;});
 const urgent=problems.some(p=>p.needsHuman);
 const specialized=problems.some(p=>p.medical);
 return {problems,tools:matches.slice(0,time==='quick'?2:5),urgent,specialized,mechanism,context};
}
function header(mode){
 return '<a class="ns-console-back" href="#home">← Back to Home</a>'+
 '<header class="ns-console-heading"><div><p class="eyebrow">NOBODY’S SIMPLE · EMOTIONAL CALCULATOR</p>'+
 '<h1>What’s happening for you?</h1><p>Select a problem in your own words. You can get a useful tool now or explore the psychology behind it.</p></div>'+
 '<img src="ns-character-guide.webp" alt="" width="108" height="133" class="ns-console-mascot"></header>'+
 '<div class="ns-console-mode" role="group" aria-label="Choose your route">'+
 '<button type="button" data-mode="tools" aria-pressed="'+(mode==='tools')+'"><span aria-hidden="true">✳</span><strong>Find something to try</strong><small>Practical tools and actions</small></button>'+
 '<button type="button" data-mode="learn" aria-pressed="'+(mode==='learn')+'"><span aria-hidden="true">◇</span><strong>Understand & learn</strong><small>Explanation, questions, resources</small></button></div>';
}
const labels=(x,n)=>x.length>n?x.slice(0,n):x;
const cards=(items,selected)=>{
 return items.map(p=>'<label class="ns-console-topic"><input type="checkbox" name="ns-topic" value="'+s(p.id)+'" '+(selected.includes(p.id)?'checked':'')+'><span class="ns-console-topic-body"><strong>'+s(p.title)+'</strong><small>'+s(p.hint)+'</small><span class="ns-console-topic-check" aria-hidden="true">✓</span></span></label>').join('');
};
function cardHtml(domain,mode,selected,query){
 const searching=!!query.trim();
 const list=searching?findProblems(query,32):domain?problemsInDomain(domain):problemIndex.filter(p=>['procrastination','overthinking','overwhelm','arguments','anxiety','boundaries','low-mood','fatigue','focus'].includes(p.id));
 const chosen=selected.map(getProblem).filter(Boolean);
 return '<div class="ns-console-shell">'+header(mode)+
 '<section class="ns-console-panel"><div class="ns-console-section-head"><div><p class="eyebrow">STEP 1 OF 2 · YOUR SITUATION</p><h2>Choose what feels closest</h2><p>Select up to three. You can change your choices or explore a different area.</p></div></div>'+
 '<label class="ns-console-search"><span class="sr-only">Search difficulties</span><span aria-hidden="true">⌕</span>'+
 '<input type="search" data-problem-search placeholder="Search: worrying, sleep, rejection, deadlines…" value="'+s(query)+'" autocomplete="off" maxlength="90"></label>'+
 '<div class="ns-console-domains" aria-label="Browse by area">'+
 '<button type="button" data-domain="" aria-pressed="'+(!domain)+'">Suggested</button>'+
 problemDomains.map(d=>'<button type="button" data-domain="'+s(d.id)+'" aria-pressed="'+(domain===d.id)+'">'+s(d.icon)+' '+s(d.name)+'</button>').join('')+'</div>'+
 '<div class="ns-console-topic-grid" data-topic-grid>'+ (list.length?cards(list,selected):
 '<div class="ns-console-unmatched"><strong>We have not mapped that phrase precisely yet.</strong><p>Try a broader word or choose an area above. You can also explore a general starting point without pretending we know the cause.</p><button type="button" class="button secondary" data-unmatched>Explore a general starting point</button></div>')+'</div>'+
 (chosen.length?'<p class="ns-console-selected"><strong>Selected:</strong> '+chosen.map(p=>s(p.title)).join(' · ')+'</p>':'')+
 '<div class="ns-console-actions"><a class="button secondary" href="#home">← Home</a>'+
 '<button type="button" class="button" data-next '+(!selected.length?'disabled':'')+'>Continue with '+selected.length+' '+(selected.length===1?'problem':'problems')+' →</button></div>'+
 '<p class="ns-console-privacy">No account needed. These selections are not saved or sent anywhere by this console.</p></section></div>';
}
const qTypes=[
 ['barrier','What seems most important in this situation?'],
 ['context','Which condition may be affecting it?']
];
function stepTwoHtml(mode,selected,answers){
 const chosen=selected.map(getProblem).filter(Boolean),p=chosen[0],k=knowledgeFamilies[p?.domain]||knowledgeFamilies.act;
 const concepts=k.explanations.map((x,i)=>({id:String(i),text:x}));
 const contexts=[
  {id:'demands',text:'My environment or responsibilities'},
  {id:'health',text:'Sleep, health, energy or sensory factors'},
  {id:'people',text:'Relationships, safety or other people'},
  {id:'thoughts',text:'My thoughts, emotions or habits'},
  {id:'unknown',text:'Not sure / several of these'}
 ];
 return '<div class="ns-console-shell">'+header(mode)+
 '<section class="ns-console-panel"><p class="eyebrow">STEP 2 OF 2 · MAKE IT SPECIFIC</p>'+
 '<h2>A couple of details could help</h2><p class="ns-console-lead">Optional questions help us choose more useful starting points. There is no score or diagnosis.</p>'+
 '<div class="ns-console-narrow-question"><h3>'+s(qTypes[0][1])+'</h3>'+
 '<div class="ns-console-radio-grid">'+concepts.map(x=>'<label class="ns-console-radio"><input type="radio" name="barrier" value="'+x.id+'" '+(answers.barrier===x.id?'checked':'')+'><span>'+s(x.text)+'</span></label>').join('')+
 '<label class="ns-console-radio"><input type="radio" name="barrier" value="unknown" '+(answers.barrier==='unknown'?'checked':'')+'><span>Not sure yet</span></label></div></div>'+
 '<div class="ns-console-narrow-question"><h3>'+s(qTypes[1][1])+'</h3>'+
 '<div class="ns-console-radio-grid">'+contexts.map(x=>'<label class="ns-console-radio"><input type="radio" name="context" value="'+x.id+'" '+(answers.context===x.id?'checked':'')+'><span>'+s(x.text)+'</span></label>').join('')+'</div></div>'+
 '<div class="ns-console-actions"><button class="button secondary" type="button" data-back>← Change problems</button>'+
 '<button class="button" type="button" data-finish>'+(mode==='learn'?'Open my learning guide':'Show useful tools')+' →</button></div>'+
 '<button class="ns-console-skip" type="button" data-finish>Skip these questions</button>'+
 '</section></div>';
}
function urgentMarkup(p){
 if(!p?.needsHuman&&!p?.medical)return '';
 const urgent=['self-harm','immediate-danger','control-harm'].includes(p?.id);
 const psychosis=['voices','suspicion','mania'].includes(p?.id);
 return '<aside class="ns-console-safety" role="note"><strong>'+(urgent?'Safety is the priority':psychosis?'Assessment is important here':'Consider physical health as well')+'</strong><p>'+
 (urgent?'If you cannot keep yourself safe, call 999 or attend A&E in the UK. If you need urgent mental health help, call NHS 111 and select the mental health option. Do not wait for an online questionnaire.':
 psychosis?'New or worsening unusual perceptions or dramatic changes in energy and sleep should be discussed promptly with a GP or mental health service. An online quiz cannot determine their cause.':
 'Persistent or concerning physical symptoms deserve medical assessment. Do not assume their cause is psychological.')+
 '</p><a href="'+(psychosis?'https://www.nhs.uk/mental-health/conditions/psychosis/overview/':nhsHelp)+'" target="_blank" rel="noopener noreferrer">NHS information ↗</a></aside>';
}
function toolsResultHtml(selected,answers){
 const r=recommendForProblems(selected,{mechanism:answers.barrier,context:answers.context});
 const first=r.problems[0];if(!first)return '';
 const others=r.problems.slice(1);
 const contextExplanation=answers.context==='demands'?'Environmental and practical demands may matter. Look for ways to change conditions, not only yourself.':
 answers.context==='health'?'Sleep, health, energy and sensory load may matter. Consider appropriate health and accessibility support.':
 answers.context==='people'?'Relationships, safety and power may matter. Self-help tools alone cannot resolve unsafe circumstances.':
 answers.context==='thoughts'?'Your thinking, emotions or habits may be relevant, although they are not the only possible explanation.':
 'The cause is not yet clear. Start with a small, reversible action and keep alternative explanations open.';
 return '<div class="ns-console-shell">'+header('tools')+
 '<section class="ns-console-panel ns-console-result"><p class="eyebrow">YOUR NEXT STEPS · '+s(first.title)+'</p>'+
 '<h2>Start with something useful</h2><p>These tools match the difficulties you selected; they are options, not a judgment about their cause.</p>'+
 urgentMarkup(first)+'<p class="ns-console-context">'+s(contextExplanation)+'</p>'+
 '<div class="ns-console-tool-cards">'+(r.tools.length?r.tools.map((t,i)=>'<a href="'+s(t.href)+'" class="ns-console-tool-card"><span class="ns-console-tool-number">'+(i+1)+'</span><span><strong>'+s(t.title)+'</strong><small>'+s(t.short)+'</small></span><span aria-hidden="true">→</span></a>').join(''):'<p>No dedicated tool is available for this specific concern yet. You can still explore the learning guide and relevant support.</p>')+'</div>'+
 '<div class="ns-console-learn-cta"><strong>Want to understand why this might be happening?</strong><p>Explore competing explanations, systems-level factors, learning resources and a practical worksheet.</p>'+
 '<a class="button" href="#problem/'+s(first.id)+'">Understand '+s(first.title.toLowerCase())+' →</a></div>'+
 (others.length?'<div class="ns-console-other-results"><p class="eyebrow">ALSO SELECTED</p>'+others.map(p=>'<a href="#problem/'+s(p.id)+'">'+s(p.title)+' →</a>').join('')+'</div>':'')+
 '<div class="ns-console-actions"><button class="button secondary" type="button" data-back>← Change answers</button><a class="button secondary" href="#tools">Browse all tools →</a></div></section></div>';
}
export function renderUniversalConsole(root){
 if(!root)return;
 const state={mode:'tools',domain:'',query:'',selected:[],step:0,answers:{}};
 const update=()=>{
  if(state.step===0)root.innerHTML=cardHtml(state.domain,state.mode,state.selected,state.query);
  else if(state.step===1)root.innerHTML=stepTwoHtml(state.mode,state.selected,state.answers);
  else root.innerHTML=toolsResultHtml(state.selected,state.answers);
  wire();
 };
 const wire=()=>{
  root.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode; if(state.step===2)state.step=1;update();});
  root.querySelectorAll('[data-domain]').forEach(b=>b.onclick=()=>{state.domain=b.dataset.domain;state.query='';update();});
  const search=root.querySelector('[data-problem-search]');
  if(search)search.oninput=()=>{state.query=search.value;const caret=search.selectionStart;const str=search.value;const list=str.trim()?findProblems(str,32):state.domain?problemsInDomain(state.domain):problemIndex.filter(p=>['procrastination','overthinking','overwhelm','arguments','anxiety','boundaries','low-mood','fatigue','focus'].includes(p.id));root.querySelector('[data-topic-grid]').innerHTML=list.length?cards(list,state.selected):'<div class="ns-console-unmatched"><strong>We have not mapped this phrase precisely.</strong><p>Try a broader word or explore a general starting point.</p><button type="button" class="button secondary" data-unmatched>Explore a general starting point</button></div>';root.querySelectorAll('input[name="ns-topic"]').forEach(input=>input.onchange=select);root.querySelector('[data-unmatched]')?.addEventListener('click',unmatched);};
  function select(e){
   const id=e.target.value;
   if(e.target.checked){if(state.selected.length>=3){e.target.checked=false;root.querySelector('[data-selection-message]').textContent='Choose up to three. You can change your selection.';return;}state.selected=[...state.selected,id];}
   else state.selected=state.selected.filter(x=>x!==id);
   const output=root.querySelector('[data-selected-live]');
   if(output)output.textContent=state.selected.length+' selected';
   const btn=root.querySelector('[data-next]');if(btn){btn.disabled=!state.selected.length;btn.textContent='Continue with '+state.selected.length+(state.selected.length===1?' problem':' problems')+' →';}
  }
  root.querySelectorAll('input[name="ns-topic"]').forEach(input=>input.onchange=select);
  function unmatched(){state.selected=['unspecified'];state.step=2;root.innerHTML=generalResultHtml(state.mode);root.querySelector('[data-back]')?.addEventListener('click',()=>{state.step=0;state.selected=[];update();});}
  root.querySelector('[data-unmatched]')?.addEventListener('click',unmatched);
  root.querySelector('[data-next]')?.addEventListener('click',()=>{if(state.selected.length){state.step=1;update();scrollTop();}});
  root.querySelectorAll('input[name="barrier"],input[name="context"]').forEach(input=>input.onchange=()=>{state.answers[input.name]=input.value;});
  root.querySelector('[data-back]')?.addEventListener('click',()=>{state.step=Math.max(0,state.step-1);update();scrollTop();});
  root.querySelectorAll('[data-finish]').forEach(b=>b.onclick=()=>{
   const primary=state.selected.find(id=>getProblem(id));if(!primary)return;
   ephemeralHandoff={primary,selected:state.selected.slice(),answers:{...state.answers},mode:state.mode};
   if(state.mode==='learn'){location.hash='#problem/'+primary;return;}
   state.step=2;update();scrollTop();
  });
 };
 root.addEventListener('change',()=>{}, {once:true});
 update();
}
function generalResultHtml(mode){
 return '<div class="ns-console-shell">'+header(mode)+'<section class="ns-console-panel">'+
 '<p class="eyebrow">GENERAL STARTING POINT</p><h2>We need a little more context</h2>'+
 '<p>This phrase is not yet in our curated problem library. Rather than inventing an explanation, here are open-ended tools for making sense of it.</p>'+
 '<div class="ns-console-tool-cards"><a class="ns-console-tool-card" href="#tool/context-map"><span>1</span><span><strong>Explore your context</strong><small>Look at circumstances and possible influences.</small></span><span aria-hidden="true">→</span></a>'+
 '<a class="ns-console-tool-card" href="#tool/brain-dump"><span>2</span><span><strong>Organise what is happening</strong><small>Put the situation into words.</small></span><span aria-hidden="true">→</span></a>'+
 '<a class="ns-console-tool-card" href="#support"><span>3</span><span><strong>Find human support</strong><small>Talk with someone who can explore your individual circumstances.</small></span><span aria-hidden="true">→</span></a></div>'+
 '<div class="ns-console-actions"><button type="button" data-back class="button secondary">← Try another search</button></div></section></div>';
}
