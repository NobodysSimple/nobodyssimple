/* Warm, problem-specific reading and private guided journals for culture,
 * faith and migration. No scoring, diagnosis, network or automatic persistence.
 */
import {escapeHTML} from './core.mjs';
import {cfmGuide} from './ns-cfm-guides.mjs';
const e=x=>escapeHTML(String(x??''));
const paragraphs=text=>String(text||'').split(/\n\s*\n/).filter(Boolean).map(p=>'<p>'+e(p)+'</p>').join('');
const title=(k,h)=>'<div class="ns-topic-section-heading"><p class="ns-topic-kicker">'+e(k)+'</p><h2>'+e(h)+'</h2></div>';
const HIGH_PRIVACY=new Set(['asylum-stress','migrant-work-exploitation','racial-profiling','religious-trauma','faith-community-pressure','religious-family-conflict']);
const privateMessage=(id)=>HIGH_PRIVACY.has(id)?
 'If anyone can monitor this device or the details could affect your safety or legal situation, consider the questions privately without typing. Nothing here is required. Notes are not automatically saved or submitted.':
 'This is a private, optional reflection in your current tab. Nothing is submitted or automatically saved. Avoid writing identifying details on a shared device.';
function cfmTop(g,m){
 const id=g.optionId||g.id, item=cfmGuide(id);
 const versionList=item.versions.map(([label,detail],i)=>
  '<li><strong>'+e(label)+'</strong><p>'+e(detail)+'</p></li>').join('');
 const profile=item.versions.map(([label,detail],i)=>
  '<label class="ns-topic-check"><input type="checkbox" data-topic-pattern="cfm-'+i+'" data-cfm-version="'+i+'" value="'+e(label)+'"><span><strong>'+e(label)+'</strong><small>'+e(detail)+'</small></span></label>').join('')+
  '<label class="ns-topic-check"><input type="checkbox" data-topic-pattern="cfm-unsure" value="I am still working out what fits"><span><strong>I am still working out what fits</strong><small>You may recognise more than one version, or none of these.</small></span></label>';
 const questions=item.questions.map((q,i)=>
  '<div class="ns-cfm-journal-step" data-cfm-step="'+i+'"'+(i?' hidden':'')+'>'+
  '<label for="ns-cfm-answer-'+e(id)+'-'+i+'"><span class="ns-cfm-question">'+e(q)+'</span>'+
  '<span class="ns-cfm-hint">'+(i===0?'You can describe one moment, or leave the box empty.':'A few words are enough; passing is always an option.')+'</span></label>'+
  '<textarea id="ns-cfm-answer-'+e(id)+'-'+i+'" rows="4" maxlength="1800" data-cfm-answer="'+i+'" placeholder="Your words, if you want to write…"></textarea></div>').join('');
 const sources=item.sources.map(s=>'<li><a href="'+e(s.url)+'" target="_blank" rel="noopener noreferrer">'+e(s.label)+'</a></li>').join('');
 return '<div class="ns-topic-reading ns-cfm-reading" data-topic-reading>'+
  '<section class="ns-topic-section ns-topic-needs" aria-labelledby="ns-topic-needs-title">'+
   '<p class="ns-topic-kicker">START WITH WHAT YOU NEED</p><h2 id="ns-topic-needs-title">What would help most right now?</h2>'+
   '<div class="ns-topic-need-choices">'+
   '<button type="button" class="ns-topic-need-choice" data-topic-jump="ns-topic-common">I want to feel understood <span aria-hidden="true">→</span></button>'+
   '<button type="button" class="ns-topic-need-choice" data-topic-jump="ns-topic-understand">Help me understand why <span aria-hidden="true">→</span></button>'+
   '<button type="button" class="ns-topic-need-choice" data-topic-jump="ns-topic-profile">Help me understand my version <span aria-hidden="true">→</span></button>'+
   '<button type="button" class="ns-topic-need-choice" data-topic-jump="ns-cfm-journal">Give me something practical <span aria-hidden="true">→</span></button>'+
   '</div></section>'+
  '<section class="ns-topic-section ns-topic-opening" id="ns-topic-common" aria-labelledby="ns-topic-common-title">'+
    '<p class="ns-topic-kicker">IF THIS IS WHAT BROUGHT YOU HERE</p><h2 id="ns-topic-common-title">I want you to feel heard here</h2>'+
    '<div class="ns-cfm-opening">'+paragraphs(item.opening)+'</div>'+
    '<details class="ns-topic-details ns-cfm-recognition"><summary>Does this sound familiar?</summary><ul class="ns-topic-recognition">'+
      (g.variants||[]).slice(0,4).map(x=>'<li>'+e(x)+'</li>').join('')+
     '</ul></details>'+
  '</section>'+
  '<details class="ns-topic-section ns-topic-understand-details" id="ns-topic-understand">'+
   '<summary><span class="ns-topic-kicker">UNDERSTAND WHY</span><strong>What may be shaping this experience?</strong><small>Read when you feel ready. We can consider what is happening without making assumptions about you.</small></summary>'+
   '<div class="ns-topic-understand-content">'+
    '<div class="ns-topic-reframe">'+
      '<p class="ns-topic-kicker">A CLEARER EXPLANATION</p><p class="ns-pick-definition">'+e(g.what||g.lead)+'</p>'+
      '<div class="ns-cfm-why">'+paragraphs(item.why)+'</div>'+
      '<p class="ns-topic-quiet-note">These are possible influences, not a conclusion about you. The resources below inform the general context; they do not validate this reflection as a clinical assessment.</p>'+
    '</div>'+
    '<div class="ns-topic-aspect-section ns-topic-framework"><h3>Which version of this might you be living with?</h3><ol class="ns-topic-aspects">'+versionList+'</ol></div>'+
    '<details class="ns-topic-details"><summary>Research and further reading</summary><div class="ns-topic-detail-body"><ul class="ns-cfm-sources">'+sources+'</ul><p>Research identifies patterns across groups. It cannot establish what caused one individual’s experience, or what choice they must make.</p></div></details>'+
   '</div></details>'+
  '<section class="ns-topic-section ns-topic-profile-section" id="ns-topic-profile" aria-labelledby="ns-topic-profile-title">'+
   '<p class="ns-topic-kicker">YOUR SITUATION</p><h2 id="ns-topic-profile-title">Which part feels closest to what you are going through?</h2>'+
   '<p>You can choose more than one. You can also be unsure. The point is to find a useful place to begin, not to fit you into a category.</p>'+
   '<fieldset class="ns-topic-profile-options" data-topic-profile><legend>These possibilities are specific to this difficulty</legend>'+profile+'</fieldset>'+
   '<p data-topic-profile-result class="ns-topic-profile-result" role="status" aria-live="polite">There is no correct combination. You decide what feels relevant.</p>'+
   '<button type="button" class="ns-topic-clear" data-topic-clear>Clear selections</button>'+
   '<p class="ns-topic-helper">This is not a diagnostic checklist or a score. Selecting an option does not assign a label to you.</p>'+
  '</section>'+
  '<section class="ns-topic-section ns-cfm-action-section ns-topic-steps" aria-labelledby="ns-cfm-action-title">'+
   '<p class="ns-topic-kicker">WHAT CAN I DO?</p><h2 id="ns-cfm-action-title">A starting point that fits the difficulty</h2>'+
   '<p class="ns-topic-helper">Choose what is safe and relevant. An action might involve another person or institution, and you are allowed to leave it for now.</p>'+
   '<ol class="ns-cfm-actions">'+item.versions.map(([label,detail,action])=>
     '<li><strong>'+e(label)+'</strong><p>'+e(action)+'</p></li>').join('')+'</ol>'+
  '</section>'+
  '<section class="ns-topic-section ns-cfm-journal" id="ns-cfm-journal" aria-labelledby="ns-cfm-journal-title" data-cfm-journal="'+e(id)+'">'+
   '<p class="ns-topic-kicker">YOUR GUIDED JOURNAL · OPTIONAL</p><h2 id="ns-cfm-journal-title">'+e(item.journalTitle)+'</h2>'+
   '<p>We’ll work through one question at a time, using your own experience. At the end, you’ll see a short map and a possible next step based on the version you selected above.</p>'+
   '<p class="ns-cfm-privacy">'+e(privateMessage(id))+'</p>'+
   '<div class="ns-cfm-journal-work" data-cfm-work>'+
    '<p class="ns-cfm-counter" data-cfm-counter aria-live="polite">Question 1 of '+item.questions.length+'</p>'+
    questions+
    '<div class="ns-cfm-journal-buttons">'+
      '<button type="button" class="ns-cfm-secondary" data-cfm-prev disabled>Previous</button>'+
      '<button type="button" class="ns-cfm-secondary" data-cfm-skip>Skip</button>'+
      '<button type="button" class="ns-cfm-primary" data-cfm-next>Next question</button>'+
    '</div>'+
   '</div>'+
   '<div class="ns-cfm-journal-result" data-cfm-result hidden aria-live="polite">'+
     '<h3>Your own situation map</h3><p data-cfm-recommendation></p>'+
     '<div data-cfm-review></div>'+
     '<p>You can correct anything you wrote. A suggested route is only a possibility, and choosing to do nothing right now can be sensible.</p>'+
     '<div class="ns-cfm-journal-buttons"><button type="button" class="ns-cfm-secondary" data-cfm-edit>Edit answers</button>'+
       '<button type="button" class="ns-cfm-secondary" data-cfm-copy>Copy my map</button>'+
       '<button type="button" class="ns-cfm-secondary" data-cfm-clear>Clear everything</button></div>'+
     '<p class="ns-cfm-copy-status" role="status" data-cfm-copy-status></p>'+
   '</div>'+
  '</section>'+
 '</div>';
}
function cfmBottom(g){
 const id=g.optionId||g.id,item=cfmGuide(id);
 const progress=item.versions.map(([label,detail,action])=>
  '<li><strong>'+e(label)+':</strong> '+e(action)+'</li>').join('');
 const faq=item.versions.map(([label,detail,action])=>
  '<details class="ns-topic-details"><summary>'+e(label)+': what could I try?</summary><p>'+e(detail)+'</p><p>'+e(action)+'</p></details>').join('');
 return '<div class="ns-topic-reading ns-topic-reading-end ns-cfm-reading" id="ns-topic-answers">'+
  '<section class="ns-topic-section ns-topic-progress" id="ns-topic-progress">'+
   title('IF YOU RETURN TO THIS PAGE','What useful change might look like')+
   '<p>Progress might mean a clearer understanding of your options, safer conditions or a little more freedom to decide. You do not have to track your emotions or prove that you have improved.</p>'+
   '<ul>'+progress+'</ul>'+
  '</section>'+
  '<section class="ns-topic-section ns-topic-faq">'+
   title('COMMON QUESTIONS','A little more help for your particular situation')+
   '<div class="ns-topic-faq-list">'+faq+'</div>'+
  '</section>'+
  '<section class="ns-topic-section ns-topic-support" id="ns-topic-support">'+
   title('WHEN SUPPORT WOULD HELP','You should not have to carry this by yourself')+
   '<p>'+e(g.supportFirst?'If you face threats, coercion or retaliation, prioritise safe, confidential and practical help. Avoid any step that puts your privacy or safety at risk.':
    'Support may involve a trusted person, accessible community resources, a relevant institution or professional care. What you need depends on what has actually happened and which conditions can change.')+'</p>'+
   '<p>Where legal, immigration or employment decisions are involved, use qualified advice for those decisions. A reflection exercise cannot determine your rights.</p>'+
   '<a href="#need/support-safety">Safety and urgent support <span aria-hidden="true">→</span></a>'+
  '</section>'+
  '<footer class="ns-topic-ending"><span aria-hidden="true">✦</span><p>'+e(item.closing)+'</p></footer>'+
 '</div>';
}
export function renderCfmStart(g){const item=cfmGuide(g?.optionId||g?.id);return item&&!g.safetyFirst?cfmTop(g,item):'';}
export function renderCfmEnd(g){const item=cfmGuide(g?.optionId||g?.id);return item&&!g.safetyFirst?cfmBottom(g):'';}
export function bindCfmJournal(surface){
 if(!surface)return;
 const host=surface.querySelector('[data-cfm-journal]');
 if(!host||host.dataset.cfmBound==='yes')return;
 const item=cfmGuide(host.dataset.cfmJournal);
 if(!item)return;
 host.dataset.cfmBound='yes';
 const steps=[...host.querySelectorAll('[data-cfm-step]')];
 const work=host.querySelector('[data-cfm-work]'),result=host.querySelector('[data-cfm-result]');
 const counter=host.querySelector('[data-cfm-counter]');
 const prev=host.querySelector('[data-cfm-prev]'),skip=host.querySelector('[data-cfm-skip]');
 const next=host.querySelector('[data-cfm-next]');
 let index=0;
 const show=(focus=false)=>{
  steps.forEach((step,i)=>{step.hidden=i!==index});
  counter.textContent='Question '+(index+1)+' of '+steps.length;
  prev.disabled=index===0;
  next.textContent=index===steps.length-1?'See my map':'Next question';
  work.hidden=false;result.hidden=true;
  if(focus)steps[index].querySelector('textarea')?.focus();
 };
 const build=()=>{
  const checked=[...surface.querySelectorAll('[data-cfm-version]:checked')];
  const routeIndex=checked.length?Number(checked[0].dataset.cfmVersion):-1;
  const choice=item.versions[routeIndex];
  const suggestion=choice?'You selected "'+choice[0]+'". One possible next step: '+choice[2]:
   'You have not chosen a version yet. That is fine. Read the suggested options above and take only what is useful.';
  host.querySelector('[data-cfm-recommendation]').textContent=suggestion;
  const review=host.querySelector('[data-cfm-review]');
  review.replaceChildren();
  item.questions.forEach((question,i)=>{
   const answer=host.querySelector('[data-cfm-answer="'+i+'"]')?.value.trim();
   if(!answer)return;
   const block=document.createElement('div');
   const heading=document.createElement('strong');heading.textContent=question;
   const p=document.createElement('p');p.textContent=answer;
   block.append(heading,p);review.appendChild(block);
  });
  if(!review.children.length){
   const p=document.createElement('p');p.textContent='You chose not to write anything. You can still take a useful next step.';
   review.appendChild(p);
  }
  work.hidden=true;result.hidden=false;
  result.querySelector('h3')?.setAttribute('tabindex','-1');
  result.querySelector('h3')?.focus();
 };
 prev.addEventListener('click',()=>{if(index>0){index--;show(true)}});
 skip.addEventListener('click',()=>{if(index<steps.length-1){index++;show(true)}else build()});
 next.addEventListener('click',()=>{if(index<steps.length-1){index++;show(true)}else build()});
 host.querySelector('[data-cfm-edit]')?.addEventListener('click',()=>show(true));
 host.querySelector('[data-cfm-clear]')?.addEventListener('click',()=>{
  host.querySelectorAll('[data-cfm-answer]').forEach(x=>x.value='');
  surface.querySelectorAll('[data-cfm-version]').forEach(x=>x.checked=false);
  const status=host.querySelector('[data-cfm-copy-status]');if(status)status.textContent='';
  index=0;show(true);
  const feedback=surface.querySelector('[data-topic-profile-result]');
  if(feedback)feedback.textContent='There is no correct combination. You decide what feels relevant.';
 });
 host.querySelector('[data-cfm-copy]')?.addEventListener('click',()=>{
  const parts=[item.journalTitle,host.querySelector('[data-cfm-recommendation]')?.textContent||''];
  item.questions.forEach((q,i)=>{const a=host.querySelector('[data-cfm-answer="'+i+'"]')?.value.trim();if(a)parts.push(q+'\n'+a)});
  const status=host.querySelector('[data-cfm-copy-status]');
  if(!navigator.clipboard?.writeText){status.textContent='Copying is not available in this browser.';return}
  navigator.clipboard.writeText(parts.join('\n\n')).then(()=>{status.textContent='Copied. Keep these notes somewhere private.'}).catch(()=>{status.textContent='The browser could not copy these notes.'});
 });
 show();
}
