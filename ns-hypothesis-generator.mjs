/* Nobody's Simple · Hypothesis Generator interface.
 * Distinct original mascot-led formulation experience, no account API or
 * background storage. All answers stay in memory until this page is left.
 */
import {escapeHTML as escape} from './core.mjs';
import {
 HYPOTHESIS_TRACKS,TRACK_BY_ID,ANSWER_OPTIONS,
 startHypothesis,answerHypothesis,backHypothesis,reviewHypothesis,
 nextHypothesisQuestion,hypothesisResult,describeFormulation,
 formulationPlainText,findHypothesisTrack,selectableAtlasTopics,
 questionPool,QUESTION_BY_ID,reviseHypothesisAnswer,focusHypothesisLayer,
 reviseHypothesisNode,HYPOTHESIS_DEEP_QUESTION_COUNT
} from './ns-hypothesis-engine.mjs';

const e=x=>escape(String(x??''));
const href=(to,label)=>'<a href="'+e(to)+'">'+e(label)+'</a>';
const art=(src,css='')=>'<img class="'+css+'" src="'+e(src)+'" loading="eager" alt="Nobody, your curious companion" width="200" height="210">';
const safe=(x,len=700)=>String(x??'').trim().slice(0,len);
const stageText='Your answers stay in this open page and disappear when you leave. You can revise every answer and every part of the map.';
const supportLinks=(kind)=>{
 const medical=kind==='medical'||kind==='physical';
 return (medical?[
  ['https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-use-111/','NHS 111 urgent advice'],
  ['https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/','Emergency services']
 ]:kind==='coercion'?[
  ['https://www.nhs.uk/live-well/getting-help-for-domestic-violence/','Confidential help for domestic abuse'],
  ['https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/','Emergency services']
 ]:[
  ['https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/','Urgent mental health support'],
  ['https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/when-to-call-999/','Emergency services']
 ]).map(([url,label])=>'<a href="'+e(url)+'" target="_blank" rel="noopener noreferrer">'+e(label)+' <span aria-hidden="true">↗</span></a>').join('');
};
function page(body){
 return '<div class="ns-hypo-shell" data-hypothesis-generator>'+
  '<nav class="ns-hypo-top" aria-label="Hypothesis Generator navigation">'+
  '<a href="#home">← Home</a><a href="#navigate">Find my next step</a><a href="#need/support-safety">Urgent support</a></nav>'+
  body+
  '<footer class="ns-hypo-foot"><span>Understand → Compare → Revise → Choose what helps</span>'+
  '<p>Independent, rule-based educational tool. It cannot identify a hidden cause, diagnose or provide a clinical risk assessment.</p></footer></div>';
}
function landing(){
 return page('<header class="ns-hypo-hero">'+
  '<div><p class="ns-hypo-eyebrow">NOBODY’S SIMPLE · HYPOTHESIS GENERATOR</p>'+
  '<h1>Shall we work out what could be going on?</h1>'+
  '<p>Tell Nobody what you are experiencing. Together, you will examine different explanations—not receive a label or a verdict.</p>'+
  '<div class="ns-hypo-hero-pills"><span>Follow-up questions adapt to you</span><span>Clickable formulation map</span><span>Revise any part</span></div></div>'+
  '<div class="ns-hypo-hero-art">'+art('ns-character-thinking.webp','ns-hypo-hero-nobody')+
  '<div class="ns-hypo-speech">I’ll ask about what happens, what changes it and what else could explain it.</div></div></header>'+
  '<section class="ns-hypo-pick" aria-labelledby="ns-hypo-start-title"><div class="ns-hypo-section-head">'+
  '<span>01</span><div><p class="ns-hypo-eyebrow">START WITH WHAT YOU NOTICE</p>'+
  '<h2 id="ns-hypo-start-title">What would you like to investigate?</h2></div></div>'+
  '<div class="ns-hypo-track-grid">'+HYPOTHESIS_TRACKS.map(t=>
   '<button type="button" data-hypo-track="'+e(t.id)+'" class="ns-hypo-track">'+
   '<img src="'+e(t.art)+'" loading="lazy" alt="" width="72" height="72"><span><strong>'+e(t.title)+
   '</strong><small>'+e(t.description)+'</small></span><span aria-hidden="true">→</span></button>').join('')+'</div>'+
  '<details class="ns-hypo-search"><summary>Or look for a named difficulty in the psychological atlas</summary>'+
  '<label for="ns-hypo-search-input">Search topics</label><input id="ns-hypo-search-input" type="search" data-hypo-search'+
  ' placeholder="e.g. rumination, insomnia, perfectionism" autocomplete="off">'+
  '<div class="ns-hypo-topics" data-hypo-topic-results aria-live="polite"></div>'+
  '<p>Only a subset of topics has a dedicated formulation pathway. You can always open the existing field guide directly.</p></details>'+
  '<label class="ns-hypo-note-label" for="ns-hypo-description">Optional: describe this in your own words</label>'+
  '<textarea id="ns-hypo-description" rows="3" data-hypo-description maxlength="700" placeholder="For example: I enjoy shaving my legs but I feel uncertain what that means about me. Avoid identifying details."></textarea>'+ '<div class="ns-hypo-description-actions"><button type="button" data-hypo-from-description>Investigate what I described →</button><p data-hypo-description-help aria-live="polite">Or choose one of the starting areas above.</p></div>'+
  '<p class="ns-hypo-quiet">'+e(stageText)+'</p></section>'+
  '<section class="ns-hypo-safety-short"><strong>Need safety or urgent help instead?</strong>'+
  '<p>In immediate danger, call 999 in the UK. You do not need to complete questions.</p>'+
  href('#need/support-safety','Open support options →')+'</section>');
}
function progress(state){
 const n=state.answers.length;
 const result=hypothesisResult(state);
 const coverage=result.coverage;
 return '<div class="ns-hypo-progress"><span>Question '+(n+1)+' · No fixed question limit</span>'+
  '<p>'+coverage.meaningful+' informative answers · '+coverage.layers.length+
  ' formulation areas explored · '+(result.canContinue?'More distinctions available':'No further authored questions available')+'</p>'+
  '<div class="ns-hypo-investigation-bar" role="group" aria-label="Aspects investigated">'+
  ['Circumstances','Experience','Response','Explanations','Alternatives','Needs'].map((x,i)=>
  '<span class="'+(coverage.layers.length>i?'is-done':'')+'">'+e(x)+'</span>').join('')+'</div></div>';
}
function liveInsight(state){
 if(state.answers.length<4)return '';
 const r=hypothesisResult(state);
 return '<details class="ns-hypo-live-insight"><summary>What has Nobody learned so far?</summary>'+
  '<p>These are the current leads, not a hidden explanation:</p>'+
  '<ul>'+r.alternatives.slice(0,3).map(c=>'<li><strong>'+e(c.process.title)+'</strong> · '+
   c.positive.length+' supporting observation'+(c.positive.length===1?'':'s')+'</li>').join('')+'</ul>'+
  '<button type="button" data-hypo-results>Open my editable working map</button></details>';
}
function asking(state){
 const q=nextHypothesisQuestion(state);
 if(!q)return resultPage(state);
 const track=TRACK_BY_ID[state.trackId],n=state.answers.length;
 const pose=n%3===0?'ns-character-guide.webp':n%3===1?'ns-character-thinking.webp':'ns-character-mapping.webp';
 const ready=hypothesisResult(state).coverage.canDraft;
 return page('<section class="ns-hypo-question-stage">'+progress(state)+
  '<div class="ns-hypo-dialogue">'+
  '<div class="ns-hypo-guide">'+art(pose,'ns-hypo-guide-art')+
  '<div class="ns-hypo-guide-caption"><strong>Nobody</strong><span>Your thinking companion</span></div></div>'+
  '<div class="ns-hypo-speech-card"><p class="ns-hypo-eyebrow">ABOUT '+e(track.title.toUpperCase())+'</p>'+
  '<h1 id="ns-hypo-question" tabindex="-1">'+e(q.prompt)+'</h1>'+
  '<p>Choose the closest answer. Nothing here determines a diagnosis, identity or hidden motive.</p></div></div>'+
  '<div class="ns-hypo-options" role="group" aria-label="Answer the question">'+
  ANSWER_OPTIONS.map((a,i)=>'<button type="button" data-hypo-answer="'+e(a.id)+'" data-hypo-question="'+e(q.id)+'">'+
   '<span class="ns-hypo-answer-symbol" aria-hidden="true">'+['✓','↗','◇','↘','×'][i]+'</span>'+
   '<strong>'+e(a.id==='unsure'?'Maybe / not sure':a.label)+'</strong><span aria-hidden="true">→</span></button>').join('')+'</div>'+
  '<div class="ns-hypo-question-footer"><button type="button" data-hypo-back '+(n?'':'disabled')+'>← Back</button>'+
  '<button type="button" data-hypo-skip data-hypo-question="'+e(q.id)+'">Skip</button>'+
  (n>=4?'<button type="button" data-hypo-results>'+(ready?'View my detailed working map':'See my tentative map')+'</button>':'')+'</div>'+
  (ready?'<p class="ns-hypo-ready">Nobody has enough information to sketch a provisional picture. You can inspect it now or keep answering to test other explanations.</p>':'')+
  '<details class="ns-hypo-why"><summary>Why is Nobody asking this question?</summary>'+
  '<p>'+e(q.why)+'</p><p>Questions are selected to distinguish competing models and fill gaps in the information. The signals are not calibrated clinical probabilities.</p></details>'+
  liveInsight(state)+
  '<p class="ns-hypo-quiet">'+e(stageText)+'</p></section>');
}
function safetyPage(state){
 const kind=state.safety?.kind||'crisis';
 const medical=kind==='medical'||kind==='physical';
 const coercion=kind==='coercion';
 return page('<section class="ns-hypo-safety-page">'+art('ns-character-helping.webp','ns-hypo-safety-character')+
  '<p class="ns-hypo-eyebrow">A DIFFERENT KIND OF NEXT STEP</p>'+
  '<h1>'+(medical?'Your physical health may need attention first.':
    coercion?'Your safety matters more than interpreting this behaviour.':'Real-world support takes priority here.')+'</h1>'+
  '<p>'+e(state.safety?.reason||'This situation may require support beyond a self-guided exercise.')+'</p>'+
  '<p>'+(medical?'Concerning new physical symptoms should not be assumed to have a psychological cause.':
  coercion?'If someone may retaliate or controls your choices, you do not need to confront them or complete a relationship exercise. Use a safe device when accessing support.':
  'If you or someone else is in immediate danger, call 999. If you can, contact an appropriate service or trusted person.')+'</p>'+
  '<div class="ns-hypo-safety-links">'+supportLinks(kind)+'</div>'+
  '<div class="ns-hypo-safety-buttons">'+href('#need/support-safety','See further support')+
  (state.answers.length?'<button type="button" data-hypo-back>← Change my last answer</button>':'<button type="button" data-hypo-restart>Start a different topic</button>')+'</div>'+
  '<p>No formulation or private responses are shown on this screen.</p></section>');
}
function feedbackButtons(candidate){
 const options=[['fits','This may fit'],['unsure','Partly / not sure'],['no-fit','Does not fit']];
 return '<div class="ns-hypo-feedback" role="group" aria-label="Does '+e(candidate.process.title)+' fit?">'+
  options.map(([id,label])=>'<button type="button" data-hypo-feedback="'+id+'" data-hypo-process="'+e(candidate.id)+'" aria-pressed="'+(candidate.feedback===id)+'">'+e(label)+'</button>').join('')+'</div>';
}
function resultCard(state,candidate,index){
 const f=describeFormulation(state,candidate);
 return '<article class="ns-hypo-result-card '+(index===0?'is-leading':'')+'">'+
  '<div class="ns-hypo-result-heading"><span>Possibility '+(index+1)+'</span><h3>'+e(candidate.process.title)+'</h3>'+
  '<small>'+(candidate.positive.length?e(candidate.positive.length+' supporting answer'+(candidate.positive.length===1?'':'s')):'Not directly supported yet')+'</small></div>'+
  '<p>'+e(f.explanation)+'</p>'+
  '<div class="ns-hypo-observations"><strong>Why this might fit</strong>'+
  (f.observations.length?'<ul>'+f.observations.slice(0,3).map(o=>'<li>'+e(o.question)+' <em>('+e(o.response)+')</em></li>').join('')+'</ul>':
   '<p>No direct supporting observation yet. This remains a possibility to investigate.</p>')+'</div>'+
  '<details class="ns-hypo-counters"><summary>What challenges or remains uncertain?</summary>'+
  (f.counterEvidence.length?'<ul>'+f.counterEvidence.map(o=>'<li>'+e(o.question)+' <em>('+e(o.response)+')</em></li>').join('')+'</ul>':
  '<p>No direct counterevidence collected. That does not mean the idea is proven.</p>')+
  '<p>'+e(f.limit)+'</p><strong>A useful follow-up:</strong><p>'+e(f.challenge)+'</p></details>'+
  '<div class="ns-hypo-need"><strong>A need to consider—not something we have inferred</strong><p>'+e(f.need)+'</p></div>'+
  feedbackButtons(candidate)+
  '<a class="ns-hypo-next-link" href="'+e(f.link)+'">Explore what could help <span aria-hidden="true">→</span></a></article>';
}
function resultPage(state){
 const r=hypothesisResult(state);
 if(state.safety)return safetyPage(state);
 return page('<header class="ns-hypo-result-hero"><div><p class="ns-hypo-eyebrow">YOUR WORKING FORMULATION</p>'+
  '<h1>Here are a few explanations worth testing.</h1>'+
  '<p>'+e(r.summary)+'</p>'+
  '<span class="ns-hypo-result-count">'+r.examined+' distinguishing observations · Not a clinical probability</span></div>'+
  art('ns-character-solving.webp','ns-hypo-results-art')+'</header>'+
  '<section class="ns-hypo-pattern"><div class="ns-hypo-section-head"><span>02</span><div>'+
  '<p class="ns-hypo-eyebrow">UNDERSTAND THE PATTERN</p><h2>What might be keeping this going?</h2></div></div>'+
  '<p>Your starting concern: <strong>'+e(r.track.title)+'</strong></p>'+
  '<div class="ns-hypo-path">'+
  '<div><span>WHAT YOU NOTICE</span><strong>'+e(r.track.title)+'</strong></div>'+
  '<span aria-hidden="true">→</span><div><span>POSSIBLE PROCESS</span><strong>'+e(r.alternatives[0]?.process.title||'Still unknown')+'</strong></div>'+
  '<span aria-hidden="true">→</span><div><span>WHAT MAY CONTINUE IT</span><strong>'+e(r.alternatives[0]?.process.possibleCost||'More information needed')+'</strong></div></div>'+
  '<p class="ns-hypo-quiet">This is a hypothesis, not a discovered inner cause. Your responses do not establish childhood experiences, attachment wounds or personal disorders.</p></section>'+
  '<section class="ns-hypo-possibilities"><div class="ns-hypo-section-head"><span>03</span><div>'+
  '<p class="ns-hypo-eyebrow">COMPARE IDEAS</p><h2>Which explanations fit your experience?</h2></div></div>'+
  '<p>Compare what supports each idea, what challenges it and what information is missing. You can disagree with Nobody.</p>'+
  '<div class="ns-hypo-results-list">'+r.alternatives.map((c,i)=>resultCard(state,c,i)).join('')+'</div></section>'+
  '<section class="ns-hypo-final-actions"><div><h2>One useful next step</h2>'+
  '<p>Choose an explanation to explore, or keep investigating. The intervention guides let you choose one practical task at a time.</p></div>'+
  '<div class="ns-hypo-final-buttons">'+
  (r.topic?'<a class="ns-hypo-primary" href="#workbook-topic/'+e(r.topic)+'">Open the '+e(r.track.title)+' guide →</a>':
   '<a class="ns-hypo-primary" href="'+e(r.alternatives[0]?.process.link||'#navigate')+'">Explore relevant interventions →</a>')+
  (r.canContinue?'<button type="button" data-hypo-more>Explore another question</button>':'')+
  '<button type="button" data-hypo-download>Download my working formulation</button>'+
  '<button type="button" data-hypo-restart>Start again</button></div>'+
  '<output class="ns-hypo-export-status" data-hypo-export aria-live="polite"></output></section>'+
  '<details class="ns-hypo-transparency"><summary>How was this generated? What are its limits?</summary>'+
  '<p>The tool checks stated observations against a set of editorially authored process hypotheses and prioritises questions that might distinguish them. The ranking is heuristic—not a statistically validated probability or clinical prediction.</p>'+
  '<p>Multiple patterns can operate together. Environmental, health, cultural and interpersonal factors may be more important than beliefs or protective strategies. The tool does not infer trauma or childhood explanations from responses.</p>'+
  '<p>No diagnosis, hidden personality profile or suicide-risk category is produced. For research-informed self-harm safety guidance see <a href="https://www.nice.org.uk/guidance/ng225/chapter/recommendations" target="_blank" rel="noopener noreferrer">NICE NG225</a>.</p>'+
  '<p>The working result is temporary unless you explicitly download it. It is not saved to your account or automatically transmitted.</p></details>');
}
function saveText(name,raw){
 const url=URL.createObjectURL(new Blob([raw],{type:'text/plain;charset=utf-8'}));
 const el=document.createElement('a');el.href=url;el.download=name;document.body.append(el);el.click();el.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1600);
}
export function renderHypothesisGenerator(root,{initialTrack='',initialTopic=''}={}){
 let state=null,stage='start',preselected=initialTrack,topic=initialTopic;
 let description='';
 const render=(focus=false)=>{
  root.innerHTML=stage==='start'?landing():state?.safety?safetyPage(state):stage==='result'?resultPage(state):asking(state);
  const text=root.querySelector('[data-hypo-description]');if(text)text.value=description;
  if(focus){
   const heading=root.querySelector('#ns-hypo-question, .ns-hypo-result-hero h1, .ns-hypo-pick h2, .ns-hypo-safety-page h1');
   if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
  }
 };
 const begin=(trackId,topicId='')=>{
  description=safe(root.querySelector('[data-hypo-description]')?.value??description);
  state=startHypothesis({trackId,topicId,description});
  stage='question';render(true);
 };
 root.addEventListener('input',event=>{
  const el=event.target;
  if(el.matches('[data-hypo-description]'))description=safe(el.value);
  if(el.matches('[data-hypo-search]')){
   const found=selectableAtlasTopics(el.value);
   const list=root.querySelector('[data-hypo-topic-results]');
   list.innerHTML=el.value.trim()?found.length?found.map(p=>{
    const match=findHypothesisTrack(p.title+' '+p.id+' '+p.hint);
    return '<div class="ns-hypo-topic"><div><strong>'+e(p.title)+'</strong><small>'+e(p.hint)+'</small></div>'+
     (match?'<button type="button" data-hypo-topic="'+e(p.id)+'" data-hypo-track="'+e(match.id)+'">Investigate</button>':
      '<a href="#workbook-topic/'+e(p.id)+'">Read field guide →</a>')+'</div>';
   }).join(''):'<p>No matching topic. Try a broader search.</p>':'';
  }
 });
 root.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.dataset.hypoTrack){begin(b.dataset.hypoTrack,b.dataset.hypoTopic||'');return;}
  if(b.hasAttribute('data-hypo-restart')){stage='start';state=null;description='';render(true);return;}
  if(b.hasAttribute('data-hypo-back')){
   if(state?.answers.length){state=backHypothesis(state);stage='question';}
   else {stage='start';state=null;}
   render(true);return;
  }
  if(b.dataset.hypoAnswer&&state){
   state=answerHypothesis(state,b.dataset.hypoQuestion,b.dataset.hypoAnswer);
   stage=nextHypothesisQuestion(state)&&!state.safety?'question':'result';
   render(true);return;
  }
  if(b.hasAttribute('data-hypo-skip')&&state){
   state=answerHypothesis(state,b.dataset.hypoQuestion,'unsure');
   stage=nextHypothesisQuestion(state)&&!state.safety?'question':'result';render(true);return;
  }
  if(b.hasAttribute('data-hypo-results')&&state){stage='result';render(true);return;}
  if(b.hasAttribute('data-hypo-more')&&state){stage='question';render(true);return;}
  if(b.dataset.hypoFeedback&&state){
   state=reviewHypothesis(state,b.dataset.hypoProcess,b.dataset.hypoFeedback);
   stage='result';render(false);
   const anchor=root.querySelector('[data-hypo-process="'+b.dataset.hypoProcess+'"][data-hypo-feedback="'+b.dataset.hypoFeedback+'"]');
   anchor?.focus({preventScroll:true});return;
  }
  if(b.hasAttribute('data-hypo-download')&&state){
   saveText('nobodys-simple-hypothesis-'+state.trackId+'.txt',formulationPlainText(state));
   const status=root.querySelector('[data-hypo-export]');if(status)status.textContent='Downloaded as a text file. Keep it somewhere private.';
  }
 });
 if(preselected&&TRACK_BY_ID[preselected])begin(preselected,topic||'');else render();
}
