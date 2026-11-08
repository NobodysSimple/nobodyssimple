import {escapeHTML as esc} from './core.mjs';
import {preciseProfiles,getPreciseProfile,preciseGroups} from './ns-precision-content.mjs';
import {problemDomains,problemsInDomain,findProblems,getProblem} from './ns-problem-map.mjs';
import {tools} from './tool-catalog.mjs';

const safe=x=>esc(String(x??''));
const toolIndex=new Map(tools.map(x=>[x.id,x]));
let handoff=null; // transient, not copied to storage
export const getPrecisionHandoff=id=>handoff?.id===id?handoff:null;
export const clearPrecisionHandoff=()=>{handoff=null;};
const scroll=()=>{try{window.scrollTo({top:0,behavior:'instant'});}catch{}};
const front=Object.freeze([
 {id:'social-anxiety',label:'I worry what people think of me',hint:'Judgement, embarrassment, scrutiny',symbol:'◌'},
 {id:'panic-experiences',label:'I get sudden waves of panic',hint:'Intense fear and bodily symptoms',symbol:'ϟ'},
 {id:'insomnia',label:'I cannot sleep properly',hint:'Falling asleep, waking or sleep worry',symbol:'☾'},
 {id:'rumination',label:'I keep replaying things',hint:'Thought loops, mistakes, “what if”',symbol:'↺'},
 {id:'submissive-patterns',label:'I find it difficult to say no',hint:'Compliance, approval and boundaries',symbol:'◇'}
]);
const link=(hash,label)=>'<a href="'+safe(hash)+'">'+safe(label)+' →</a>';
const preview=(p)=>'<a class="ns-precise-problem" data-problem="'+safe(p.id)+'" href="#problem/'+safe(p.id)+'">'+
 '<span class="ns-precise-issue-symbol">'+safe(p.symbol||'✦')+'</span>'+
 '<span><strong>'+safe(p.label||p.title)+'</strong><small>'+safe(p.hint)+'</small></span>'+
 '<span class="ns-precise-problem-arrow" aria-hidden="true">→</span></a>';
const title=(num,total)=>'<div class="ns-precise-progress"><span>STEP '+num+' OF '+total+'</span><div class="ns-precise-progress-track"><i style="width:'+(num-1)/total*100+'%"></i></div></div>';
function pageFrame(content){
 return '<div class="ns-precise-shell"><a class="ns-precise-exit" href="#home">← Back to Home</a>'+
 '<header class="ns-precise-top"><div><p class="eyebrow">NOBODY’S SIMPLE · EMOTIONAL CALCULATOR</p>'+
 '<h1>Find the exact difficulty.</h1><p>Start with what happens, not a diagnosis. A few questions will help you explore a more specific explanation.</p></div>'+
 '<img src="ns-character-guide.webp" alt="" width="88" height="110"></header>'+content+'</div>';
}
function start(groups,search,showOther){
 const searchResults=search.trim()?findProblems(search,18):[];
 const alternate=showOther||search.trim().length>0;
 return pageFrame(
 '<section class="ns-precise-surface">'+title(1,3)+
 '<h2>What feels most familiar?</h2><p class="ns-precise-lead">Choose the closest, even if more than one could fit. You can change your mind later.</p>'+
 '<div class="ns-precise-main-options">'+front.map(preview).join('')+'</div>'+
 '<div class="ns-precise-other"><button type="button" class="ns-precise-expand" data-open-other aria-expanded="'+alternate+'">My problem is something else <span aria-hidden="true">'+(alternate?'−':'+')+'</span></button>'+
 (alternate?'<div class="ns-precise-other-body"><label class="ns-precise-search"><span class="sr-only">Search other problems</span><input type="search" data-precision-search maxlength="100" placeholder="Search more specific difficulties…" value="'+safe(search)+'"></label>'+
 '<div class="ns-precise-mini-domains">'+problemDomains.map(x=>'<button type="button" data-legacy-domain="'+safe(x.id)+'" aria-pressed="'+(groups===x.id)+'">'+safe(x.name)+'</button>').join('')+'</div>'+
 '<div class="ns-precise-legacy-results" data-legacy-results>'+
 (search.trim()?searchResults:groups?problemsInDomain(groups):[]).slice(0,20).map(p=>'<a href="#problem/'+safe(p.id)+'">'+safe(p.title)+'<span>→</span></a>').join('')+
 (!search.trim()&&!groups?'<p>Choose an area or search by a word that describes your experience.</p>':'')+
 (search.trim()&&!searchResults.length?'<p>No exact match yet. You can browse a broader topic or explore an open-ended tool.</p>'+link('#tool/context-map','Explore your situation'):'')+
 '</div></div>':'')+'</div>'+
 '<p class="ns-precise-quiet">These are starting points for learning, not a medical questionnaire.</p></section>'
 );
}
function questionPage(profile,index,answers){
 const q=profile.questions[index],chosen=answers[q.id]||'';
 return pageFrame('<section class="ns-precise-surface">'+title(index+2,3)+
 '<div class="ns-precise-topic-head"><p class="eyebrow">EXPLORING · '+safe(profile.title)+'</p><h2>'+safe(q.q)+'</h2>'+
 '<p class="ns-precise-lead">Choose the closest answer. The purpose is to distinguish possible difficulties—not to diagnose you.</p></div>'+
 '<div class="ns-precise-answers">'+q.options.map(([id,label],i)=>'<label class="ns-precise-answer"><input type="radio" name="precision-answer" value="'+safe(id)+'" '+(chosen===id?'checked':'')+'><span><em>'+String.fromCharCode(65+i)+'</em>'+safe(label)+'</span></label>').join('')+'</div>'+
 '<div class="ns-precise-next"><button type="button" class="button secondary" data-question-back>← Back</button>'+
 '<button type="button" class="button" data-question-next disabled>Continue →</button></div>'+
 '<button type="button" class="ns-precise-skip" data-question-skip>Skip this question</button>'+
 '<p class="ns-precise-status" role="status" aria-live="polite" data-status></p></section>');
}
function resultPage(p,answers){
 const answer0=p.questions[0].options.find(a=>a[0]===answers[p.questions[0].id]);
 const otherId=answer0?.[2]&&answer0[2]!==p.id?answer0[2]:null;
 const otherProfile=getPreciseProfile(otherId);
 const second=p.questions[1].options.find(a=>a[0]===answers[p.questions[1].id]);
 const maintainer=second?.[3]&&p.maintainers.find(x=>x.id===second[3]);
 const selectedNote=p.id==='submissive-patterns'&&answers.kind==='chosen'?
 '<p class="ns-precise-selected-note">Choosing a consensual submissive role is not inherently a problem. You can explore autonomy and communicating preferences without treating that choice as a symptom.</p>':
 p.id==='submissive-patterns'&&answers.kind==='unsafe'?
 '<p class="ns-precise-selected-note">Fear of retaliation or coercion needs a safety-first approach. A communication exercise may be inappropriate.</p>':'';
 const mismatch=otherId?'<section class="ns-precise-disambiguate"><strong>Another interpretation may fit better.</strong><p>Your first answer might also fit '+safe(otherProfile?.title||getProblem(otherId)?.title||'another problem')+'. You can switch directly rather than accepting the first label.</p>'+
 (otherProfile?'<button class="button secondary" type="button" data-switch="'+safe(otherId)+'">Explore '+safe(otherProfile.title)+' →</button>':
 link('#problem/'+otherId,'Open the closer topic'))+'</section>':'';
 return pageFrame('<section class="ns-precise-surface">'+title(3,3)+
 '<p class="eyebrow">YOUR STARTING POINT</p><h2>'+safe(p.title)+'</h2>'+
 '<p>'+safe(p.definition)+'</p>'+
 mismatch+selectedNote+
 (maintainer?'<div class="ns-precise-focus"><strong>A process worth exploring</strong><p>'+safe(maintainer.label)+': '+safe(maintainer.detail)+'</p></div>':'')+
 '<p class="ns-precise-fine">This is a topic match based on your selections, not a probability, score or diagnosis.</p>'+
 '<div class="ns-precise-result-actions"><a class="button" data-to-guide href="#problem/'+safe(p.id)+'">Understand my version →</a>'+
 '<button type="button" class="button secondary" data-show-tools>Show useful tools</button>'+
 '<button type="button" class="button secondary" data-question-back>← Change answers</button></div>'+
 '<div data-precision-tool-results></div></section>');
}
function getTools(p,answers){
 const a=p.questions[1].options.find(a=>a[0]===answers[p.questions[1].id]);
 const first=a?.[3]&&p.maintainers.find(x=>x.id===a[3]);
 const ids=[first?.tool,...p.targets.map(t=>t.tool)];
 const mapped=[...new Set(ids.filter(Boolean))].map(id=>toolIndex.get(id)).filter(Boolean).slice(0,3);
 return '<div class="ns-precise-tool-list"><h3>Up to three relevant tools</h3>'+mapped.map(tool=>'<a href="#tool/'+safe(tool.id)+'"><strong>'+safe(tool.title||tool.id)+'</strong><span>Open →</span></a>').join('')+'</div>';
}
export function renderPrecisionConsole(root){
 const state={id:null,index:0,answers:{},other:false,domain:'',search:''};
 function paint(){
  const p=getPreciseProfile(state.id);
  if(!p)root.innerHTML=start(state.domain,state.search,state.other);
  else if(state.index<p.questions.length)root.innerHTML=questionPage(p,state.index,state.answers);
  else root.innerHTML=resultPage(p,state.answers);
  wire();scroll();
 }
 function enter(id){
  if(!getPreciseProfile(id))return;
  state.id=id;state.index=0;state.answers={};paint();
 }
 function wire(){
  root.querySelectorAll('a[data-problem]').forEach(a=>a.addEventListener('click',event=>{
   event.preventDefault();enter(a.dataset.problem);
  }));
  root.querySelector('[data-open-other]')?.addEventListener('click',()=>{state.other=!state.other;paint();});
  root.querySelector('[data-precision-search]')?.addEventListener('input',e=>{
   state.search=e.target.value;
   const results=root.querySelector('[data-legacy-results]');
   if(results){const found=findProblems(state.search,20);results.innerHTML=found.map(x=>'<a href="#problem/'+safe(x.id)+'">'+safe(x.title)+'<span>→</span></a>').join('')||(state.search.trim()?'<p>No exact match yet. Try a related phrase or select an area.</p>':'<p>Search or select an area.</p>');}
  });
  root.querySelectorAll('[data-legacy-domain]').forEach(b=>b.addEventListener('click',()=>{
   state.domain=b.dataset.legacyDomain;state.search='';paint();
  }));
  root.querySelectorAll('input[name="precision-answer"]').forEach(input=>input.addEventListener('change',()=>{
   const b=root.querySelector('[data-question-next]');if(b)b.disabled=false;
  }));
  if(root.querySelector('input[name="precision-answer"]:checked')){
   root.querySelector('[data-question-next]').disabled=false;
  }
  root.querySelector('[data-question-next]')?.addEventListener('click',()=>{
   const p=getPreciseProfile(state.id),choice=root.querySelector('input[name="precision-answer"]:checked');
   if(!choice)return;
   state.answers[p.questions[state.index].id]=choice.value;state.index++;paint();
  });
  root.querySelector('[data-question-skip]')?.addEventListener('click',()=>{
   const p=getPreciseProfile(state.id);delete state.answers[p.questions[state.index].id];state.index++;paint();
  });
  root.querySelector('[data-question-back]')?.addEventListener('click',()=>{
   if(state.index===0){state.id=null;state.index=0;}
   else state.index--;paint();
  });
  root.querySelector('[data-switch]')?.addEventListener('click',e=>enter(e.currentTarget.dataset.switch));
  root.querySelector('[data-to-guide]')?.addEventListener('click',()=>{
   handoff={id:state.id,answers:{...state.answers},origin:'console'};
  });
  root.querySelector('[data-show-tools]')?.addEventListener('click',()=>{
   const p=getPreciseProfile(state.id);
   root.querySelector('[data-precision-tool-results]').innerHTML=getTools(p,state.answers);
  });
 }
 paint();
}
