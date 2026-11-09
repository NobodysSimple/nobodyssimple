import {escapeHTML as esc} from './core.mjs';
import {atlasSearch,atlasByDomain,atlasDomains,atlasGet,atlasCount} from './ns-atlas-core.mjs';
import {startReasoning,nextQuestion,answerQuestion,rankedCandidates,reasoningSummary,safetyScreen,SAFETY_RESOURCES,explainSuitability} from './ns-reasoning-model.mjs';
import {writeAtlasSession} from './ns-atlas-session.mjs';
const e=x=>esc(String(x??''));
const sample=[
 {text:"I can't fall asleep",icon:"moon",label:"I can't sleep"},
 {text:"I keep overthinking",icon:"brain",label:"I keep overthinking"},
 {text:"I'm struggling with someone",icon:"users",label:"I'm struggling with someone"},
 {text:"I feel overwhelmed",icon:"cloud",label:"I feel overwhelmed"}
];
const button=(label,attr,kind="")=>'<button type="button" class="ns-reason-btn '+kind+'" '+attr+'>'+e(label)+'</button>';
const refLink=()=>'<a class="ns-reason-exit" href="#home">← Back to Home</a>';
const shell=(body)=>'<div class="ns-reason-shell">'+refLink()+body+'</div>';
const safeNotice=(s,large=false)=>{
 if(!s)return'';
 const resource=SAFETY_RESOURCES[s.kind]||SAFETY_RESOURCES.unusual;
 return '<aside class="ns-reason-notice '+(large?'is-large':'')+'" role="note"><strong>'+e(resource.title)+'</strong><p>'+e(resource.description)+'</p>'+
 '<a href="'+e(resource.link)+'" target="_blank" rel="noopener noreferrer">Appropriate support and guidance ↗</a>'+
 (s.kind==='coercion'?'<p>You do not have to confront anybody to use this guide.</p>':'')+'</aside>';
};
function landing(st){
 const picks=st.query.trim()?atlasSearch(st.query,12):[];
 return shell('<header class="ns-reason-hero"><p class="ns-reason-eyebrow">NOBODY’S SIMPLE · EMOTIONAL CALCULATOR</p>'+
 '<h1>What’s troubling you?</h1><p>Describe what is happening in your own words. We’ll explore a few possible explanations before suggesting a next step.</p></header>'+
 '<section class="ns-reason-start"><form data-reason-form><label for="ns-reason-entry">What would you like to understand or change?</label>'+
 '<div class="ns-reason-query"><textarea id="ns-reason-entry" data-reason-input rows="2" maxlength="450" placeholder="For example, I keep checking my messages after arguments…">'+e(st.query)+'</textarea>'+
 '<button class="ns-reason-main-btn" type="submit">Explore this problem →</button></div></form>'+
 '<div data-reason-input-safety>'+safeNotice(safetyScreen(st.query))+'</div>'+
 '<div class="ns-reason-divider"><span>Or start with something familiar</span></div><div class="ns-reason-examples">'+
 sample.map((p,i)=>'<button type="button" data-reason-example="'+i+'"><span>'+e(p.label)+'</span><span aria-hidden="true">→</span></button>').join('')+'</div>'+
 '<details class="ns-reason-browse" '+(st.browse?'open':'')+'><summary>Browse all '+atlasCount+' mapped experiences</summary>'+
 '<div class="ns-reason-domains"><button type="button" data-reason-domain="" aria-pressed="'+(!st.domain)+'">Common problems</button>'+
 atlasDomains.map(d=>'<button type="button" data-reason-domain="'+e(d.id)+'" aria-pressed="'+(st.domain===d.id)+'">'+e(d.name)+'</button>').join('')+'</div>'+
 '<div class="ns-reason-results" data-reason-results>'+(st.query.trim()?picks:st.domain?atlasByDomain(st.domain).slice(0,48):[]).map(p=>topicButton(p)).join('')+
 (!st.query.trim()&&!st.domain?'<p>Choose a topic area or describe a problem in the field above.</p>':'')+'</div>'+
 '</details><p class="ns-reason-disclaimer">This is an educational investigation, not a diagnosis. You can skip questions, disagree with an explanation or stop at any time. Your answers are not saved to your account.</p></section>');
}
const topicButton=p=>'<button type="button" data-reason-topic="'+e(p.id)+'"><strong>'+e(p.title)+'</strong><span>Explore →</span></button>';
const progress=(current,total)=>'<div class="ns-reason-progress"><span>QUESTION '+current+' OF UP TO '+total+'</span><div><i style="width:'+Math.round((current-1)/total*100)+'%"></i></div></div>';
function question(st){
 const q=nextQuestion(st.investigation);
 if(!q)return result(st);
 const n=st.investigation.answers.length+1;
 return shell('<section class="ns-reason-stage">'+progress(n,4)+
 '<p class="ns-reason-eyebrow">UNDERSTAND THE SITUATION</p><h1>'+e(q.prompt)+'</h1>'+
 '<p class="ns-reason-sub">These questions help distinguish different possibilities. You don’t need to know the cause already.</p>'+
 safeNotice(st.investigation.safety)+
 '<div class="ns-reason-answerlist">'+q.options.map((o,i)=>'<button type="button" data-reason-choice="'+e(o.id)+'"><span class="ns-reason-answer-index">'+(i+1)+'</span><span>'+e(o.label)+'</span><span aria-hidden="true">→</span></button>').join('')+'</div>'+
 '<div class="ns-reason-bottom">'+button('← Back','data-reason-back','is-secondary')+
 button('Skip this question','data-reason-skip','is-secondary')+
 (n>=2?button('See possibilities now','data-reason-finish','is-secondary'):'')+'</div>'+
 '<details class="ns-reason-why"><summary>Why are we asking?</summary><p>'+e(q.reason)+'. These are educational distinctions, not calibrated diagnostic tests.</p></details></section>');
}
const explanation=(c,rank)=>'<div class="ns-reason-candidate"><div><span class="ns-reason-eyebrow">'+(rank===0?'ONE POSSIBILITY':'ALTERNATIVE '+rank)+'</span>'+
 '<h3>'+e(c.profile?.title||c.id)+'</h3><p>'+e(c.profile?.definition||c.profile?.hint||'An experience worth exploring')+'</p>'+
 (c.supports.length?'<details><summary>Why this was suggested</summary><ul>'+c.supports.slice(0,3).map(x=>'<li>'+e(x)+'</li>').join('')+'</ul></details>':'<small>Related to your description; not yet supported by distinguishing answers.</small>')+
 (c.challenges.length?'<details><summary>What does not fit as well?</summary><ul>'+c.challenges.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul></details>':'')+
 '</div><div>'+button('Explore this explanation','data-reason-select="'+e(c.id)+'"','is-secondary')+'</div></div>';
function result(st){
 const inv=st.investigation,s=reasoningSummary(inv),top=rankedCandidates(inv,4);
 const urgent=inv.safety&&['crisis','coercion','harm'].includes(inv.safety.kind);
 const choices=urgent?top.filter(c=>c.id===inv.safety.topic).concat(top.filter(c=>c.id!==inv.safety.topic).slice(0,1)):top;
 return shell('<section class="ns-reason-stage"><p class="ns-reason-eyebrow">YOUR WORKING INVESTIGATION</p>'+
 '<h1>'+(urgent?'Safety and support first':'A few possibilities worth exploring')+'</h1>'+
 '<p class="ns-reason-sub">'+e(s.uncertainty)+' This is not a diagnostic ranking or a claim that any cause has been established.</p>'+
 safeNotice(inv.safety,true)+
 (!top.length?'<p>We cannot identify a reliable topic from this description. You can rephrase it, browse another experience or open a general context tool.</p>':
 '<div class="ns-reason-candidates">'+choices.map(explanation).join('')+'</div>')+
 '<div class="ns-reason-bottom">'+button('← Try another description','data-reason-restart','is-secondary')+
 ((!urgent&&nextQuestion(inv))?button('Explore another question','data-reason-more','is-secondary'):'')+'</div>'+
 '<details class="ns-reason-why"><summary>What would change this understanding?</summary>'+
 '<p>New information, exceptions, physical or contextual explanations, and observations from a suitable next step can strengthen or challenge a working hypothesis. The system does not assign clinical probabilities.</p></details></section>');
}
function choice(st,id){
 if(!atlasGet(id))return;
 const i=st.investigation||startReasoning(st.query||atlasGet(id).title);
 const summary=reasoningSummary(i);
 // Preserve investigation and its uncertainty in temporary memory; no persistent profile.
 writeAtlasSession({id,reasoning:i,observation:i.raw,observed:summary.evidence.map(x=>x.answer),
  proposedMechanisms:summary.signals,review:[],evidenceStatus:explainSuitability(i,id)?.evidenceStatus||'Unreviewed'});
 location.hash='#problem/'+id;
}
export function renderReasoningConsole(root){
 const st={stage:'start',query:'',browse:false,domain:'',investigation:null};
 function render(){
  root.innerHTML=st.stage==='start'?landing(st):st.stage==='questions'?question(st):result(st);
  wire();
  try{window.scrollTo({top:0,behavior:'instant'})}catch{}
 }
 function enter(text,topic=null){
  const input=String(text||'').trim();
  if(!input)return;
  st.query=input;st.investigation=startReasoning(input);
  if(topic&&atlasGet(topic)){
   const arr=st.investigation.candidates.filter(c=>c.id!==topic);
   st.investigation.candidates=[{id:topic,score:15,supports:[],challenges:[]},...arr];
  }
  st.stage=st.investigation.safety&&['crisis','coercion','harm'].includes(st.investigation.safety.kind)?'result':'questions';
  render();
 }
 function wire(){
  root.querySelector('[data-reason-form]')?.addEventListener('submit',ev=>{
   ev.preventDefault();enter(root.querySelector('[data-reason-input]')?.value);
  });
  root.querySelector('[data-reason-input]')?.addEventListener('input',ev=>{
   st.query=ev.target.value;
   const n=root.querySelector('[data-reason-input-safety]');if(n)n.innerHTML=safeNotice(safetyScreen(st.query));
   const target=root.querySelector('[data-reason-results]');if(target&&st.query.trim()){
    target.innerHTML=atlasSearch(st.query,12).map(topicButton).join('')||'<p>No clear match. You can still explore your own description.</p>';
    target.querySelectorAll('[data-reason-topic]').forEach(b=>b.onclick=()=>enter(atlasGet(b.dataset.reasonTopic)?.title,b.dataset.reasonTopic));
   }
  });
  root.querySelectorAll('[data-reason-example]').forEach(b=>b.onclick=()=>enter(sample[Number(b.dataset.reasonExample)].text));
  root.querySelectorAll('[data-reason-domain]').forEach(b=>b.onclick=()=>{
   st.domain=b.dataset.reasonDomain;st.browse=true;render();
  });
  root.querySelectorAll('[data-reason-topic]').forEach(b=>b.onclick=()=>enter(atlasGet(b.dataset.reasonTopic)?.title,b.dataset.reasonTopic));
  root.querySelectorAll('[data-reason-choice]').forEach(b=>b.onclick=()=>{
   const q=nextQuestion(st.investigation);
   if(!q)return;
   st.investigation=answerQuestion(st.investigation,q.id,b.dataset.reasonChoice);
   st.stage=(!nextQuestion(st.investigation)||st.investigation.safety&&['crisis','coercion','harm'].includes(st.investigation.safety.kind))?'result':'questions';render();
  });
  root.querySelector('[data-reason-skip]')?.addEventListener('click',()=>{
   const q=nextQuestion(st.investigation);if(q)st.investigation.answers.push({qid:q.id,oid:'skipped',label:'Not answered',process:null});
   st.stage=nextQuestion(st.investigation)?'questions':'result';render();
  });
  root.querySelector('[data-reason-finish]')?.addEventListener('click',()=>{st.stage='result';render()});
  root.querySelector('[data-reason-more]')?.addEventListener('click',()=>{st.stage='questions';render()});
  root.querySelector('[data-reason-back]')?.addEventListener('click',()=>{
   if(st.investigation?.answers.length)st.investigation.answers.pop();
   else{st.stage='start';st.investigation=null;}render();
  });
  root.querySelector('[data-reason-restart]')?.addEventListener('click',()=>{
   st.stage='start';st.investigation=null;render();
  });
  root.querySelectorAll('[data-reason-select]').forEach(b=>b.onclick=()=>choice(st,b.dataset.reasonSelect));
 }
 render();
}
