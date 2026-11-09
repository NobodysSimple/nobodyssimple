/* Bridge: retain the 166 addressable educational pages, but expose only
 * three guided phases and connect them to evidence, alternatives and review.
 */
import {escapeHTML as esc} from './core.mjs';
import {renderAtlasGuide} from './ns-atlas-guide.mjs';
import {renderAtlasTool} from './ns-atlas-tool.mjs';
import {readAtlasSession,writeAtlasSession} from './ns-atlas-session.mjs';
import {atlasProfile,isSafetyPriority} from './ns-atlas-core.mjs';
import {explainSuitability,rankedCandidates,reviewReasoning,safetyScreen,SAFETY_RESOURCES} from './ns-reasoning-model.mjs';
const e=x=>esc(String(x??''));
const get=(root,s)=>root.querySelector(s);
const el=(tag,cls,html)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(html!==undefined)x.innerHTML=html;return x};
export const LEARNING_STAGES=[
 {id:'recognise',title:'Recognise it',description:'What it looks like and which parts fit you',sections:[0,1,4]},
 {id:'understand',title:'Understand it',description:'Contributors, hypotheses and your personal map',sections:[2,3,9]},
 {id:'act',title:'Choose a next step',description:'Useful options, appropriate support and review',sections:[5,6,7,8]}
];
const sources={
 'social-anxiety':[{title:'NICE: Social anxiety disorder assessment and treatment',url:'https://www.nice.org.uk/guidance/cg159/chapter/recommendations',applies:'Social-evaluation fear and disorder-specific CBT'}],
 'insomnia':[{title:'NHS: Insomnia overview and care',url:'https://www.nhs.uk/conditions/insomnia/',applies:'Sleep difficulties and when to seek help'}],
 'panic-experiences':[{title:'NHS: Panic disorder',url:'https://www.nhs.uk/mental-health/conditions/panic-disorder/',applies:'Panic episodes and related health considerations'}],
 'rumination':[{title:'NHS: Tackling your worries',url:'https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-worries/',applies:'Distinguishing actionable problems from unproductive worry'}],
 'procrastination':[{title:'Centre for Clinical Interventions: Procrastination',url:'https://www.cci.health.wa.gov.au/Resources/For-Clinicians/Procrastination',applies:'Avoidance and different maintaining processes'}],
 'checking':[{title:'NICE: OCD and BDD',url:'https://www.nice.org.uk/guidance/cg31/chapter/1-guidance',applies:'Repetitive obsessional checking; not a diagnostic assessment'}],
 'ritual-checking':[{title:'NICE: OCD and BDD',url:'https://www.nice.org.uk/guidance/cg31/chapter/1-guidance',applies:'Repeated rituals and compulsions'}]
};
export function evidenceMetadata(id){
 const sourceList=sources[id]||[];
 return {level:sourceList.length?'Source-linked educational pathway':'General educational scaffold',
  reviewStatus:'Not independently clinically validated',sources:sourceList,reviewedAt:null,
  note:sourceList.length?'References relate to particular claims or approaches; they do not validate this digital decision pathway.':
   'This topic currently shares a general educational template. It has not received an individual evidence review.'};
}
const evidencePanel=(id,session)=>{
 const inv=session?.reasoning,ev=inv?explainSuitability(inv,id):null,meta=evidenceMetadata(id);
 const other=inv?rankedCandidates(inv,5).filter(x=>x.id!==id).slice(0,3):[];
 return '<section class="ns-reason-evidence"><p class="ns-reason-eyebrow">YOUR EXPLANATION IS A HYPOTHESIS</p>'+
 '<h2>What points toward this possibility?</h2>'+
 (ev?.support?.length?'<ul>'+ev.support.slice(0,4).map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>':
 '<p>There is not yet enough distinguishing information to support one explanation over another. You can explore without committing to a label.</p>')+
 (ev?.challenge?.length?'<h3>What might count against it?</h3><ul>'+ev.challenge.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>':'')+
 '<p class="ns-reason-fine">'+e(ev?.limits||'The possible explanation is not confirmed. New information may change it.')+'</p>'+
 (other.length?'<details><summary>Other explanations worth exploring</summary><div class="ns-reason-alternatives">'+other.map(x=>
 '<button type="button" data-reason-alternative="'+e(x.id)+'">'+e(x.profile?.title||x.id)+' →</button>').join('')+'</div></details>':'')+
 '<div class="ns-reason-quality"><strong>'+e(meta.level)+'</strong><span>'+e(meta.reviewStatus)+'</span><p>'+e(meta.note)+'</p>'+
 (meta.sources.length?'<details><summary>Specific sources and what they address</summary>'+meta.sources.map(x=>
 '<p><a href="'+e(x.url)+'" target="_blank" rel="noopener noreferrer">'+e(x.title)+' ↗</a><small>'+e(x.applies)+'</small></p>').join('')+'</details>':'')+
 '</div></section>';
};
const followupPanel=()=>'<section class="ns-reason-review"><p class="ns-reason-eyebrow">REVIEW AND REVISE</p><h2>Did this explanation or next step fit?</h2>'+
 '<p>Real-life experience can strengthen or challenge a working idea. Nothing here establishes a cause.</p>'+
 '<div class="ns-reason-review-options">'+
 [['helped','A small step seemed helpful'],['no-change','I tried it but nothing changed'],['barrier','Something outside my control got in the way'],['not-fit','This explanation does not fit'],['unsure','I am not sure yet']].map(([id,label])=>
 '<button type="button" data-reason-review="'+e(id)+'">'+e(label)+'</button>').join('')+'</div>'+
 '<p data-reason-review-message role="status" aria-live="polite"></p>'+
 '<a href="#navigate">Investigate a different explanation →</a></section>';
function warningMarkup(screen){
 if(!screen)return'';
 const resource=SAFETY_RESOURCES[screen.kind]||SAFETY_RESOURCES.unusual;
 return '<div class="ns-reason-live-warning" role="alert"><strong>'+e(resource.title)+'</strong><p>'+e(resource.description)+'</p>'+
 '<a href="'+e(resource.link)+'" target="_blank" rel="noopener noreferrer">Read appropriate guidance ↗</a></div>';
}
function addSafetyMonitor(root){
 const anchor=el('div','ns-reason-safety-anchor');const head=get(root,'.ns-atlas-guide-hero');
 if(head)head.insertAdjacentElement('afterend',anchor);
 const guide=get(root,'.ns-atlas-guide');
 guide?.addEventListener('input',event=>{
  if(!event.target.matches('[data-atlas-own-situation], [data-worksheet-answer]'))return;
  const found=safetyScreen(event.target.value);
  anchor.innerHTML=warningMarkup(found);
 });
}
export function renderReasoningGuide(root,id){
 renderAtlasGuide(root,id);
 const guide=get(root,'.ns-atlas-guide');if(!guide)return;
 const original=[...guide.querySelectorAll(':scope > .ns-atlas-section')];
 if(original.length!==10)return;
 const session=readAtlasSession(id)||{};
 const inheritedSafety=session.reasoning?.safety;
 const headline=get(guide,'.ns-atlas-guide-hero');
 if(inheritedSafety){const upfront=el('div','ns-reason-initial-safety',warningMarkup(inheritedSafety));headline?.insertAdjacentElement('afterend',upfront);}
 const nav=el('nav','ns-reason-tabs');
 nav.setAttribute('aria-label','Guide stages');
 const stages=LEARNING_STAGES.map((stage,i)=>{
  const pane=el('section','ns-reason-guide-stage');
  pane.dataset.stage=stage.id;
  pane.hidden=i!==0;
  pane.setAttribute('aria-label',stage.title);
  for(const idx of stage.sections)pane.appendChild(original[idx]);
  const b=el('button','ns-reason-tab'+(i===0?' is-current':''),
   '<span>0'+(i+1)+'</span><strong>'+e(stage.title)+'</strong><small>'+e(stage.description)+'</small>');
  b.type='button';b.dataset.guideTab=stage.id;b.setAttribute('aria-pressed',String(i===0));
  nav.appendChild(b);
  return pane;
 });
 headline?.insertAdjacentElement('afterend',nav);
 let at=nav;
 for(const pane of stages){at.insertAdjacentElement('afterend',pane);at=pane;}
 function show(id){
  for(const pane of stages){const on=pane.dataset.stage===id;pane.hidden=!on}
  nav.querySelectorAll('button').forEach(b=>{const yes=b.dataset.guideTab===id;b.classList.toggle('is-current',yes);b.setAttribute('aria-pressed',String(yes));});
  try{nav.scrollIntoView({behavior:'smooth',block:'start'})}catch{}
 }
 nav.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>show(b.dataset.guideTab)));
 // Keep all ten numbered teaching sections, reorganised into 3 quiet stages.
 const recognition=stages[0],understanding=stages[1],acting=stages[2];
 const evidence=el('div','ns-reason-evidence-host',(inheritedSafety?warningMarkup(inheritedSafety):'')+evidencePanel(id,session));
 understanding.prepend(evidence);
 const review=el('div','ns-reason-review-host',followupPanel());
 acting.appendChild(review);
 const goUnderstand=el('button','ns-reason-next','Continue: understand what may be happening →');
 goUnderstand.type='button';goUnderstand.onclick=()=>show('understand');recognition.append(goUnderstand);
 const goAction=el('button','ns-reason-next','Continue: choose a useful next step →');
 goAction.type='button';goAction.onclick=()=>show('act');understanding.append(goAction);
 evidence.addEventListener('click',event=>{
  const button=event.target.closest('[data-reason-alternative]');
  if(!button)return;
  const target=button.dataset.reasonAlternative;
  if(!atlasProfile(target))return;
  const current=readAtlasSession(id)||session;
  writeAtlasSession({...current,id:target,maintainer:'',signs:[],contributors:[],custom:[],notes:{},alternativeFrom:id});
  location.hash='#problem/'+target;
 });
 review.querySelectorAll('[data-reason-review]').forEach(button=>button.addEventListener('click',()=>{
  const code=button.dataset.reasonReview;
  const current=readAtlasSession(id)||session;
  const next=current.reasoning?reviewReasoning(current.reasoning,code,id):null;
  writeAtlasSession({...current,id,reasoning:next||current.reasoning,
    review:[...(current.review||[]),{code,at:new Date().toISOString()}]});
  const message=next?.reviewMessage||(
   code==='not-fit'?'Your experience does not fit this hypothesis. Explore an alternative explanation.':
   code==='barrier'?'Practical barriers may need attention before another exercise.':
   code==='no-change'?'A lack of change is useful feedback; reconsider the target or circumstances.':
   code==='helped'?'That is a useful observation, but not proof of a cause.':
   'You can keep the explanation open and revisit it later.');
  get(review,'[data-reason-review-message]').textContent=message;
  if(next)evidence.innerHTML=(inheritedSafety?warningMarkup(inheritedSafety):'')+evidencePanel(id,{...current,reasoning:next});
  if(code==='not-fit')show('understand');
 }));
 // Explicit user choice to inspect more material rather than a compulsory workbook.
 const backToInvestigation=el('p','ns-reason-guide-footer','<a href="#navigate">← Start a different investigation</a>');
 guide.append(backToInvestigation);
 addSafetyMonitor(root);
 // Existing guide state remains transient and responsive within the moved DOM.
}
export function renderReasoningTool(root,id){
 const p=atlasProfile(id);
 if(!p)return renderAtlasTool(root,id);
 const contextSafety=readAtlasSession(id)?.reasoning?.safety;
 if(isSafetyPriority(id)||(contextSafety&&['crisis','coercion','harm','physical','unusual'].includes(contextSafety.kind))){
  const resource=SAFETY_RESOURCES[contextSafety?.kind]||SAFETY_RESOURCES[p.domain==='safety'?'crisis':'unusual'];
  root.innerHTML='<main class="ns-reason-safety-only"><a href="#problem/'+e(id)+'">← Back to learning guide</a>'+
  '<h1>Support and assessment come first</h1><p>This experience may require appropriate human support. The app will not suggest an unsupervised psychological experiment as a substitute.</p>'+
  '<p>'+e(resource.description)+'</p><a href="'+e(resource.link)+'" target="_blank" rel="noopener noreferrer">Find appropriate support ↗</a></main>';
  return;
 }
 renderAtlasTool(root,id);
 const btn=get(root,'[data-tool-result]');
 if(!btn)return;
 btn.textContent='Review what happened →';
 const toolRoot=get(root,'.ns-atlas-tool');
 // Capture events from dynamically re-rendered exercises before the old generic
 // answer-count handler runs. Attach to removable tool root, not persistent #main.
 toolRoot?.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-tool-result]');
  if(!trigger||!toolRoot.contains(trigger))return;
  event.preventDefault();event.stopImmediatePropagation();
  const host=get(root,'[data-tool-reflection]');if(!host)return;
  host.innerHTML='<section class="ns-reason-tool-review"><h3>What happened when you tried this?</h3><p>Choose the observation that most closely fits. You can change your explanation afterward.</p>'+
  '<div class="ns-reason-review-options">'+[
   ['helped','It seemed to help'],['no-change','I tried it but nothing changed'],['barrier','I could not try it because of a practical barrier'],
   ['not-fit','It did not match my problem'],['unsure','I have not tried it / I am unsure']
  ].map(([key,label])=>'<button type="button" data-tool-review="'+key+'">'+e(label)+'</button>').join('')+'</div><p data-tool-review-message aria-live="polite"></p></section>';
  host.querySelectorAll('[data-tool-review]').forEach(b=>b.addEventListener('click',()=>{
   const value=b.dataset.toolReview;const current=readAtlasSession(id)||{id};
   const state=current.reasoning?reviewReasoning(current.reasoning,value,id):null;
   writeAtlasSession({...current,id,reasoning:state||current.reasoning,
    review:[...(current.review||[]),{code:value,at:new Date().toISOString()}]});
   get(host,'[data-tool-review-message]').innerHTML='<p>'+e(state?.reviewMessage||
     (value==='barrier'?'The barrier matters. Revisit the demands and resources before another attempt.':
      value==='not-fit'?'You can reject this explanation and examine alternatives.':
      value==='helped'?'Useful observation—not proof of the proposed cause.':
      value==='no-change'?'The lack of change suggests the target or conditions may need revising.':
      'No conclusion is required yet.'))+
    '</p><a href="#problem/'+e(id)+'">Return to revise my formulation →</a>';
  }));
 });
}
