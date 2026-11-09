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
 answerHypothesisDrill,backHypothesisDrill,skipHypothesisDrill,
 questionPool,QUESTION_BY_ID,reviseHypothesisAnswer,focusHypothesisLayer,
 reviseHypothesisNode,reviewHypothesisLink,HYPOTHESIS_DEEP_QUESTION_COUNT
} from './ns-hypothesis-engine.mjs';
import {subtypeQuestion,subtypeNode,subtypeChildren,beginSubtypeDrill,TRACK_FOR_CATEGORY,REVIEWED_INTERVIEW_CATEGORIES} from './ns-hypothesis-subtype-atlas.mjs';
import {startCaseDetailInterview,answerCaseDetail,caseDetailQuestion,backCaseDetail,skipCaseDetail,caseDetailFacts,CASE_FACT_QUESTIONS} from './ns-hypothesis-case-facts.mjs';
import {INVESTIGATION_QUESTIONS,startInvestigation,investigationQuestion,answerInvestigation,backInvestigation,stopInvestigation,investigationFacts} from './ns-hypothesis-investigation.mjs';
import {ADAPTIVE_LIMIT,SYNTHETIC_MECHANISMS,adaptiveQuestion,startAdaptiveInquiry,answerAdaptiveInquiry,backAdaptiveInquiry,stopAdaptiveInquiry,adaptiveFacts} from './ns-hypothesis-adaptive.mjs';
import {evidenceCoverage,auditFormulationEvidence,formulationDepthAudit} from './ns-hypothesis-quality.mjs';
import {domainEligible,domainQuestion,startDomainInquiry,answerDomainInquiry,backDomainInquiry,stopDomainInquiry,domainFacts,DOMAIN_LENSES} from './ns-hypothesis-domain-depth.mjs';

const e=x=>escape(String(x??''));
const href=(to,label)=>'<a href="'+e(to)+'">'+e(label)+'</a>';
const art=(src,css='')=>'<img class="'+css+'" src="'+e(src)+'" loading="eager" alt="Nobody, your curious companion" width="200" height="210">';
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
  '<p>Choose a starting area. Describe your difficulty in your own words if you want, or simply use the choices.</p>'+
  '<div class="ns-hypo-hero-pills"><span>Follow-up questions adapt to you</span><span>Clickable formulation map</span><span>Revise any part</span></div></div>'+
  '<div class="ns-hypo-hero-art">'+art('ns-character-thinking.webp','ns-hypo-hero-nobody')+
  '<div class="ns-hypo-speech">I’ll ask about what happens, what changes it and what else could explain it.</div></div></header>'+
  '<section class="ns-hypo-pick" aria-labelledby="ns-hypo-start-title"><div class="ns-hypo-section-head">'+
  '<span>01</span><div><p class="ns-hypo-eyebrow">START WITH WHAT YOU NOTICE</p>'+
  '<h2 id="ns-hypo-start-title">Where should Nobody begin?</h2><p>Pick the closest area. Nobody will ask follow-up questions and narrow down the details with you.</p></div></div>'+
  '<div class="ns-hypo-own-words"><label for="ns-hypo-start-words"><strong>Your difficulty in your exact words (optional)</strong></label>'+
   '<textarea id="ns-hypo-start-words" data-hypo-start-words rows="2" maxlength="280" placeholder="For example: My dad keeps belittling me and I feel powerless."></textarea>'+
   '<small>This is your report, not a diagnosis of another person. Your wording will appear in your map.</small></div>'+
   '<div class="ns-hypo-track-grid">'+HYPOTHESIS_TRACKS.map(t=>
   '<button type="button" data-hypo-track="'+e(t.id)+'" class="ns-hypo-track">'+
   '<img src="'+e(t.art)+'" loading="lazy" alt="" width="72" height="72"><span><strong>'+e(t.title)+
   '</strong><small>'+e(t.description)+'</small></span><span aria-hidden="true">→</span></button>').join('')+'</div>'+
  '<details class="ns-hypo-all-areas"><summary>Or explore all 21 psychological and life areas</summary>'+
  '<p>Your starting topic may not fit one of the twelve common choices. These categories can be ordinary experiences or practical issues, not disorders.</p>'+
  '<div class="ns-hypo-area-grid">'+subtypeChildren('ROOT').map(n=>
  '<button type="button" data-hypo-category="'+e(n.id)+'">'+e(n.label)+
  '<span aria-hidden="true"> →</span></button>').join('')+'</div>'+
  '<p>Where no suitable explanatory interview has been reviewed, Nobody will record your exact experience without guessing a psychological cause. The taxonomy is an editorial prototype, not a diagnosis.</p></details>'+
  '<details class="ns-hypo-search"><summary>Or look for a named difficulty in the psychological atlas</summary>'+
  '<label for="ns-hypo-search-input">Search topics</label><input id="ns-hypo-search-input" type="search" data-hypo-search'+
  ' placeholder="e.g. rumination, insomnia, perfectionism" autocomplete="off">'+
  '<div class="ns-hypo-topics" data-hypo-topic-results aria-live="polite"></div>'+
  '<p>Only a subset of topics has a dedicated formulation pathway. You can always open the existing field guide directly.</p></details>'+
  '<p class="ns-hypo-quiet">'+e(stageText)+'</p></section>'+
  '<section class="ns-hypo-safety-short"><strong>Need safety or urgent help instead?</strong>'+
  '<p>In immediate danger, call 999 in the UK. You do not need to complete questions.</p>'+
  href('#need/support-safety','Open support options →')+'</section>');
}
function narrowing(state){
 const d=state.drill,q=subtypeQuestion(d);
 if(!q)return asking(state);
 const category=subtypeNode(d.categoryId),cluster=subtypeNode(d.clusterId),leaf=subtypeNode(d.leafId);
 const step=q.stage==='area'?0:q.stage==='cluster'?1:q.stage==='experience'?2:q.stage==='confirm'?3:q.stage==='valence'?4:q.stage==='meaning'?5:6;
 const breadcrumb=[category?.label,cluster?.label,leaf?.label].filter(Boolean);
 const cards=q.options.map(o=>'<button type="button" data-hypo-drill-answer="'+e(o.id)+
  '" data-hypo-drill-question="'+e(q.id)+'" class="ns-hypo-drill-option">'+
  '<span>'+e(o.label)+'</span><span aria-hidden="true">→</span></button>').join('');
 return page('<section class="ns-hypo-drill" aria-labelledby="ns-hypo-question">'+
  '<div class="ns-hypo-drill-top"><p class="ns-hypo-eyebrow">'+(q.stage==='area'?'FIRST, LET’S NARROW THE AREA':'GETTING TO THE SPECIFICS · STEP '+step+' OF 6')+'</p>'+
  '<p>'+breadcrumb.map(e).join(' <span aria-hidden="true">›</span> ')+'</p></div>'+
  '<div class="ns-hypo-dialogue"><div class="ns-hypo-guide">'+art('ns-character-thinking.webp','ns-hypo-guide-art')+
  '<div class="ns-hypo-guide-caption"><strong>Nobody</strong><span>One detail at a time</span></div></div>'+
  '<div class="ns-hypo-speech-card"><p class="ns-hypo-eyebrow">I AM LISTENING FOR EXACT DETAILS</p>'+
  '<h1 id="ns-hypo-question" tabindex="-1">'+e(q.prompt)+'</h1>'+
  '<p>Choose the closest answer. This records only what you select—nothing about a diagnosis, hidden cause or identity.</p></div></div>'+
  '<div class="ns-hypo-drill-options" role="group" aria-label="Choose a detail">'+cards+'</div>'+
  '<div class="ns-hypo-question-footer"><button type="button" data-hypo-back>← Back</button>'+
  '<button type="button" data-hypo-drill-skip>Skip details and ask broader questions</button>'+
  '<button type="button" data-hypo-restart>Choose another area</button></div>'+
  '<p class="ns-hypo-drill-caution">This is an editorially authored, non-diagnostic question map from the Nobody’s Simple synthetic atlas. You can leave any answer uncertain. More precise questions come after selecting a specific experience.</p>'+
  '<p class="ns-hypo-quiet">'+e(stageText)+'</p></section>');
}
function specificFactsPage(state){
 const q=caseDetailQuestion(state);
 if(!q)return asking(state);
 const leaf=subtypeNode(state.drill?.leafId);
 const done=state.caseDetails.answers.length;
 const options=q.options.map(o=>'<button type="button" class="ns-hypo-drill-option" data-hypo-fact-answer="'+e(o.id)+
  '" data-hypo-fact-question="'+e(q.id)+'"><span>'+e(o.label)+'</span><span aria-hidden="true">→</span></button>').join('');
 return page('<section class="ns-hypo-drill ns-hypo-case-specific" aria-labelledby="ns-hypo-question">'+
  '<div class="ns-hypo-drill-top"><p class="ns-hypo-eyebrow">UNDERSTAND YOUR EXPERIENCE · DETAIL '+(done+1)+' OF '+CASE_FACT_QUESTIONS.length+'</p>'+
  '<p>'+e(leaf?.label||'Your experience')+' · These answers are facts you choose, not psychological conclusions.</p></div>'+
  '<div class="ns-hypo-dialogue"><div class="ns-hypo-guide">'+art('ns-character-mapping.webp','ns-hypo-guide-art')+
  '<div class="ns-hypo-guide-caption"><strong>Nobody</strong><span>Getting the details right</span></div></div>'+
  '<div class="ns-hypo-speech-card"><p class="ns-hypo-eyebrow">A LITTLE MORE ABOUT WHAT HAPPENS</p>'+
  '<h1 id="ns-hypo-question" tabindex="-1">'+e(q.prompt)+'</h1>'+
  '<p>No answer will be treated as evidence of a diagnosis or hidden motive. Only what you choose becomes part of your case map.</p></div></div>'+
  '<div class="ns-hypo-drill-options" role="group" aria-label="Choose the most accurate answer">'+options+'</div>'+
  '<div class="ns-hypo-question-footer"><button type="button" data-hypo-fact-back>← Back</button>'+
  '<button type="button" data-hypo-fact-stop>Skip remaining details</button></div>'+
  (done?'<div class="ns-hypo-case-recap"><strong>What you have selected so far</strong><ul>'+
   caseDetailFacts(state).map(f=>'<li>'+e(f.label)+': '+e(f.text)+'</li>').join('')+'</ul></div>':'')+
  '<p class="ns-hypo-quiet">'+e(stageText)+'</p></section>');
}
function functionalInvestigationPage(state){
 const q=investigationQuestion(state);
 if(!q)return resultPage(state);
 const count=state.investigation.answers.length;
 const opts=q.options.map(o=>'<button type="button" class="ns-hypo-drill-option" data-hypo-invest-answer="'+e(o.id)+
  '" data-hypo-invest-question="'+e(q.questionId)+'"><span>'+e(o.label)+'</span><span aria-hidden="true">→</span></button>').join('');
 return page('<section class="ns-hypo-drill ns-hypo-functional" aria-labelledby="ns-hypo-question">'+
  '<div class="ns-hypo-drill-top"><p class="ns-hypo-eyebrow">INVESTIGATING THE POSSIBLE PATTERN · '+(count+1)+' QUESTIONS SO FAR</p>'+
  '<p><strong>Your selected concern: '+e(q.subject)+'</strong> · Events → feelings → meanings → responses → consequences. Each link must be tested, not assumed.</p></div>'+
  '<div class="ns-hypo-dialogue"><div class="ns-hypo-guide">'+art('ns-character-thinking.webp','ns-hypo-guide-art')+
  '<div class="ns-hypo-guide-caption"><strong>Nobody</strong><span>Looking for alternatives</span></div></div>'+
  '<div class="ns-hypo-speech-card"><p class="ns-hypo-eyebrow">'+e(q.concept.toUpperCase())+'</p>'+
  '<h1 id="ns-hypo-question" tabindex="-1">'+e(q.prompt)+'</h1>'+
  '<p>'+e(q.why)+' Only what you select will be recorded. This cannot establish a hidden cause.</p></div></div>'+
  '<div class="ns-hypo-own-words"><label for="ns-hypo-invest-words">Add your exact wording to this answer (optional)</label>'+
   '<textarea id="ns-hypo-invest-words" data-hypo-invest-words maxlength="280" rows="2" placeholder="For example: He calls me dramatic whenever I disagree."></textarea>'+
   '<small>Choose a response below to keep the interview adaptive. Your wording is shown on the graph verbatim.</small></div>'+
   '<div class="ns-hypo-drill-options" role="group" aria-label="Choose the closest experience">'+opts+'</div>'+
  '<div class="ns-hypo-question-footer"><button type="button" data-hypo-invest-back>← Back</button>'+
  '<button type="button" data-hypo-invest-stop>View my working map / stop questions</button></div>'+
  (count?'<div class="ns-hypo-case-recap"><strong>Observations so far</strong><ul>'+
   investigationFacts(state).slice(-5).map(f=>'<li>'+e(f.text)+'</li>').join('')+'</ul></div>':'')+
  '<p class="ns-hypo-quiet">No response is uploaded. An explanation about another person is kept as your interpretation, not a diagnosis of them.</p></section>');
}
function adaptiveInquiryPage(state){
 const q=adaptiveQuestion(state);
 if(!q)return resultPage(state);
 const count=state.adaptive?.answers?.length||0;
 const options=q.options.map(o=>'<button type="button" class="ns-hypo-drill-option" data-hypo-adaptive-answer="'+e(o.id)+
  '" data-hypo-adaptive-question="'+e(q.questionId)+'"><span>'+e(o.label)+'</span><span aria-hidden="true">→</span></button>').join('');
 return page('<section class="ns-hypo-drill ns-hypo-adaptive" aria-labelledby="ns-hypo-question">'+
  '<div class="ns-hypo-drill-top"><p class="ns-hypo-eyebrow">TESTING COMPETING EXPLANATIONS · '+(count+1)+' OF AT MOST '+ADAPTIVE_LIMIT+'</p>'+
  '<p>Questions are selected from unanswered distinctions; unasked factors remain unknown. This is not a clinical diagnosis.</p></div>'+
  '<div class="ns-hypo-dialogue"><div class="ns-hypo-guide">'+art('ns-character-mapping.webp','ns-hypo-guide-art')+
  '<div class="ns-hypo-guide-caption"><strong>Nobody</strong><span>Testing the explanation</span></div></div>'+
  '<div class="ns-hypo-speech-card"><p class="ns-hypo-eyebrow">'+e(q.layer.toUpperCase())+' · '+e(q.conceptId)+'</p>'+
  '<h1 id="ns-hypo-question" tabindex="-1">'+e(q.prompt)+'</h1>'+
  '<p>'+e(q.why)+'</p></div></div>'+
  '<div class="ns-hypo-own-words"><label for="ns-hypo-adaptive-words">What happened in your exact words? (optional)</label>'+
  '<textarea id="ns-hypo-adaptive-words" data-hypo-adaptive-words maxlength="280" rows="2" placeholder="Add your own precise description, if useful."></textarea>'+
  '<small>The selected answer guides follow-ups. Your words remain attributed to you; the tool does not infer meaning from unanalysed free text.</small></div>'+
  '<div class="ns-hypo-drill-options" role="group" aria-label="Choose the closest answer">'+options+'</div>'+
  '<div class="ns-hypo-question-footer"><button type="button" data-hypo-adaptive-back>← Back</button>'+
  '<button type="button" data-hypo-adaptive-stop>Stop and view my formulation</button></div>'+
  (count?'<div class="ns-hypo-case-recap"><strong>New distinctions</strong><ul>'+
   adaptiveFacts(state).slice(-5).map(f=>'<li>'+e(f.text)+'</li>').join('')+'</ul></div>':'')+
  '<p class="ns-hypo-quiet">The synthetic database contains possible mechanisms, not facts about you. Every causal relationship remains a hypothesis to investigate.</p></section>');
}

function domainInquiryPage(state){
 const q=domainQuestion(state);
 if(!q)return resultPage(state);
 const completed=state.domain.answers.length;
 const choices=q.options.map(o=>'<button type="button" class="ns-hypo-drill-option" data-hypo-domain-answer="'+e(o.id)+
  '" data-hypo-domain-question="'+e(q.questionId)+'"><span>'+e(o.label)+'</span><span aria-hidden="true">→</span></button>').join('');
 return page('<section class="ns-hypo-drill ns-hypo-domain" aria-labelledby="ns-hypo-question">'+
  '<div class="ns-hypo-drill-top"><p class="ns-hypo-eyebrow">BEYOND THE SURFACE · QUESTION '+(completed+1)+'</p>'+
  '<p><strong>'+e(q.subject)+'</strong> · '+e(DOMAIN_LENSES[q.category]?.area||q.category)+' · Questions about what changes it, what may maintain it and what could contradict our explanation.</p></div>'+
  '<div class="ns-hypo-dialogue"><div class="ns-hypo-guide">'+art('ns-character-thinking.webp','ns-hypo-guide-art')+
  '<div class="ns-hypo-guide-caption"><strong>Nobody</strong><span>Looking underneath the pattern</span></div></div>'+
  '<div class="ns-hypo-speech-card"><p class="ns-hypo-eyebrow">'+e(q.layer.toUpperCase())+' · '+e(q.conceptId)+'</p>'+
  '<h1 id="ns-hypo-question" tabindex="-1">'+e(q.prompt)+'</h1>'+
  '<p>'+e(q.why)+'</p></div></div>'+
  '<div class="ns-hypo-own-words"><label for="ns-hypo-domain-words">Describe the real detail in your own words (optional)</label>'+
  '<textarea id="ns-hypo-domain-words" data-hypo-domain-words maxlength="280" rows="2" placeholder="The exact words you would use to describe what happened…"></textarea>'+
  '<small>The selected option helps choose the next question. Only your reported answer appears as a fact; tentative connections are labelled separately.</small></div>'+
  '<div class="ns-hypo-drill-options" role="group" aria-label="Choose the closest answer">'+choices+'</div>'+
  '<div class="ns-hypo-question-footer"><button type="button" data-hypo-domain-back>← Back</button>'+
  '<button type="button" data-hypo-domain-stop>Show my formulation now</button></div>'+
  (completed?'<div class="ns-hypo-case-recap"><strong>What you have said</strong><ul>'+
   domainFacts(state).slice(-5).map(f=>'<li>'+e(f.text)+'</li>').join('')+'</ul></div>':'')+
  '<p class="ns-hypo-quiet">No questions discover a hidden cause with certainty. An answer indicating actual harm, physical risk or lack of freedom must not be reframed as your personal psychological failure.</p></section>');
}
function domainReasoningSection(state,result){
 if(!domainEligible(state))return '';
 const d=result.domain;
 const by=new Map(domainFacts(state).map(f=>[f.kind,f]));
 const f=id=>by.get('domain:'+id);
 const tile=(label,value)=>value?'<div class="ns-hypo-depth-step"><span>'+e(label)+'</span><strong>'+e(value.text)+'</strong></div>':'';
 const evidence=p=>'<ul>'+p.evidence.map(x=>'<li>“'+e(x.answer)+'”</li>').join('')+'</ul>';
 const audit=formulationDepthAudit(state,result);
 return '<section class="ns-hypo-depth-map" aria-labelledby="ns-hypo-depth-heading">'+
  '<div class="ns-hypo-section-head"><span>02</span><div><p class="ns-hypo-eyebrow">YOUR INDIVIDUAL INVESTIGATION</p>'+
  '<h2 id="ns-hypo-depth-heading">What may be contributing—and why?</h2>'+
  '<p>Your actual words and choices come first. Connections below are possibilities that still need to survive counterexamples.</p></div></div>'+
  (domainFacts(state).length?
   '<div class="ns-hypo-depth-sequence">'+
    tile('Condition you identified',f('primary'))+
    tile('What changed when that condition was different',f('contrast'))+
    tile('Another influence you mentioned',f('additional'))+
    tile('Your actual response',f('response'))+
    tile('Immediate effect',f('immediate'))+
    tile('Longer-term consequence',f('later'))+
    tile('Does this pattern repeat?',f('recurrence'))+
    tile('Observation that challenges a simple story',f('exception'))+
   '</div>':
   '<p>We have not yet investigated a changeable condition, your response and its consequences for this exact experience.</p>')+
  (d.hypotheses.length?
   '<div class="ns-hypo-depth-explanations"><h3>Possible influences, not established causes</h3>'+
    d.hypotheses.map(p=>'<article class="ns-hypo-depth-hypothesis"><h4>'+e(p.title)+'</h4><p>'+e(p.description)+'</p>'+
     '<details><summary>What in your answers supports this?</summary>'+evidence(p)+'</details>'+
     '<p><strong>Another explanation:</strong> '+e(p.alternative)+'</p>'+
     '<p><strong>What would challenge it?</strong> '+e(p.falsifier)+'</p></article>').join('')+'</div>':
   '<p class="ns-hypo-graph-unknown">We cannot yet link your answers into a tested explanation. A longer interview does not itself prove that something hidden has been uncovered.</p>')+
  (d.counterpoints.length?'<div class="ns-hypo-depth-counters"><h3>What makes a simple explanation less convincing?</h3>'+
    d.counterpoints.map(c=>'<article><strong>'+e(c.title)+'</strong><p>'+e(c.explanation)+'</p>'+evidence(c)+'</article>').join('')+'</div>':'')+
  '<p class="ns-hypo-quiet">Source-check: '+e(String(audit.sourceFacts))+' directly reported details · '+
   e(String(audit.contrastsCollected))+' contrasting observations · '+
   e(String(audit.candidateExplanations))+' provisional cross-answer explanations. '+
   (audit.passed?'No factual mismatches detected in this technical audit.':'Some evidence links need review.')+
   ' Neither technical consistency nor interview length proves clinical accuracy.</p></section>';
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
  '</details>';
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
  (state.drill?.confirmed&&!state.caseDetails?.finished?'<button type="button" data-hypo-fact-start>Explore the specifics first →</button>':'')+
  (domainEligible(state)&&!state.domain?.finished?'<button type="button" class="ns-hypo-invest-action" data-hypo-domain-start>Investigate the WHY behind this exact experience →</button>':'')+
   (!state.investigation?.finished?'<button type="button" class="ns-hypo-invest-action" data-hypo-invest-start>Investigate what might be keeping this going →</button>':'')+
  (n>=3?'<button type="button" data-hypo-results>'+(ready?'View my detailed working map':'See my tentative map')+'</button>':'')+'</div>'+
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
  (state.answers.length||state.drill?.events?.length||state.investigation?.answers?.length?'<button type="button" data-hypo-back>← Change my last answer</button>':'<button type="button" data-hypo-restart>Start a different topic</button>')+'</div>'+
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
function graphNodeButton(node,selected){
 const layers={presenting:'Your starting point',context:'Circumstances',experience:'Feeling and meaning',
  response:'What you do',mechanism:'Competing explanation',function:'Possible short-term effect',
  cost:'What might keep it going',need:'Needs and resources',tension:'Possible tension'};
 return '<button type="button" class="ns-hypo-graph-node ns-hypo-node-'+e(node.layer)+
  ' ns-hypo-status-'+e(node.status)+(selected===node.id?' is-selected':'')+
  '" data-hypo-node="'+e(node.id)+'" aria-pressed="'+(selected===node.id)+'">'+
  '<span class="ns-hypo-node-overline">'+e(layers[node.layer]||node.layer)+'</span>'+
  '<strong>'+e(node.summary)+'</strong>'+
  (node.evidence?.length?'<span class="ns-hypo-node-observations">'+
   node.evidence.slice(0,node.layer==='mechanism'?3:8).map(item=>
    '<span><b>'+e(item.answer)+'</b> · '+e(item.question)+'</span>').join('')+
   '</span>':'')+
  '<span class="ns-hypo-node-detail">'+
  (node.review==='no-fit'?'You challenged this part':
   node.review==='fits'?'Marked as fitting':
   node.editedTitle?'Your revised wording':
   node.status==='reported'?'From your answers':
   node.status==='unknown'?'Needs more information':'A possibility to test')+'</span>'+
  '<span class="ns-hypo-node-open">Inspect or correct ↗</span></button>';
}
function graphSection(result,selectedNode){
 const nodes=result.graph;
 const get=id=>nodes.find(n=>n.id===id);
 const button=id=>{const n=get(id);return n?graphNodeButton(n,selectedNode):'';};
 const connector='<span class="ns-hypo-graph-link" aria-hidden="true">⇢</span>';
 return '<section class="ns-hypo-graph" aria-labelledby="ns-hypo-graph-heading">'+
 '<div class="ns-hypo-section-head"><span>02</span><div><p class="ns-hypo-eyebrow">YOUR EDITABLE FORMULATION</p>'+
 '<h2 id="ns-hypo-graph-heading">A map we can question together.</h2>'+
 '<p>Click any part to review its evidence, correct the wording or ask more focused questions. Arrows show possible relationships—not proven causes.</p></div></div>'+
 '<div class="ns-hypo-graph-scroll"><div class="ns-hypo-graph-linear">'+
 ['presenting','context','experience','response'].map((id,i)=>(i?connector:'')+button(id)).join('')+
 '</div><div class="ns-hypo-graph-branch-label"><span>↘</span> Several explanations may operate together, or none may fit <span>↙</span></div>'+
 '<div class="ns-hypo-graph-branches">'+(nodes.some(n=>n.layer==='mechanism')?nodes.filter(n=>n.layer==='mechanism').map(n=>graphNodeButton(n,selectedNode)).join(''):'<p class="ns-hypo-graph-unknown">No reviewed explanation is yet linked to this particular area. Only your actual answers are reported.</p>')+'</div>'+
 '<div class="ns-hypo-graph-link-down" aria-hidden="true">↓ possible consequences to investigate ↓</div>'+
 '<div class="ns-hypo-graph-linear">'+['function','cost','need'].map((id,i)=>(i?connector:'')+button(id)).join('')+'</div>'+
 '<div class="ns-hypo-graph-tension">'+button('tension')+'</div></div>'+
 (result.links?.length?'<section class="ns-hypo-causal-links"><h3>Links worth testing — not discovered causes</h3>'+
   '<p>These are candidate relationships between the events and consequences you selected. The arrow is a question, not proof.</p>'+
   '<div class="ns-hypo-causal-link-grid">'+result.links.map(edge=>
    '<article class="ns-hypo-causal-link"><strong>'+e(edge.title)+'</strong>'+
    '<span class="ns-hypo-link-tag">HYPOTHESIS, NOT ESTABLISHED</span>'+
    '<div class="ns-hypo-link-sources"><span>'+e(edge.fromText)+'</span><span aria-hidden="true">⇢</span><span>'+e(edge.toText)+'</span></div>'+
    '<p><strong>Challenge:</strong> '+e(edge.challenge)+'</p>'+
    '<div class="ns-hypo-link-feedback" role="group" aria-label="Review this possible link">'+
    [['fits','Worth testing'],['uncertain','Uncertain'],['no-fit','This link is wrong']].map(([v,label])=>
     '<button type="button" data-hypo-link-verdict="'+v+'" data-hypo-link-id="'+e(edge.id)+
     '" aria-pressed="'+(edge.review===v)+'">'+e(label)+'</button>').join('')+'</div></article>').join('')+'</div></section>':'')+
 '<p class="ns-hypo-graph-foot">Not all behaviour serves a protective purpose. A presentation preference, an emotion or a response to actual circumstances may not need a psychological explanation.</p>'+
 '</section>';
}
function nodeEditor(result,nodeId){
 if(!nodeId)return '<div class="ns-hypo-node-prompt">Choose a box in the graph to see exactly what supports it—and change what is wrong.</div>';
 const node=result.graph.find(n=>n.id===nodeId);
 if(!node)return '<div class="ns-hypo-node-prompt">Choose a box in the graph to inspect it.</div>';
 const supporting=(node.evidence||[]).length?'<ul>'+node.evidence.map(o=>
  '<li><span>'+e(o.question)+'</span><strong>'+e(o.answer)+'</strong></li>').join('')+'</ul>':
  '<p>No specific supporting observation recorded for this part. It may be an open question.</p>';
 const challenge=(node.challenges||[]).length?'<div class="ns-hypo-node-challenges"><strong>Contrary observations</strong><ul>'+
  node.challenges.map(o=>'<li>'+e(o.question)+' <em>('+e(o.answer)+')</em></li>').join('')+'</ul></div>':'';
 return '<section class="ns-hypo-node-editor" aria-label="Revise selected part of formulation">'+
  '<div class="ns-hypo-node-editor-head"><div><p class="ns-hypo-eyebrow">REVIEW THIS PART</p>'+
  '<h3>'+e(node.title)+'</h3></div><button type="button" data-hypo-node-deselect>✕ Close</button></div>'+
  '<p>'+e(node.detail)+'</p>'+
  '<div class="ns-hypo-node-evidence"><strong>What your answers actually say</strong>'+supporting+challenge+'</div>'+
  '<div class="ns-hypo-feedback" role="group" aria-label="Do you agree with this part?">'+
  [['fits','This fits'],['unsure','Partly / uncertain'],['no-fit','This is wrong']].map(([id,label])=>
   '<button type="button" data-hypo-node-verdict="'+e(id)+'" data-hypo-node-id="'+e(node.id)+
   '" aria-pressed="'+(node.review===id)+'">'+e(label)+'</button>').join('')+'</div>'+
  '<label class="ns-hypo-node-edit-label" for="ns-hypo-node-note">How would you describe this part instead? (optional)</label>'+
  '<textarea id="ns-hypo-node-note" data-hypo-node-text maxlength="280" rows="2" placeholder="Write a more accurate version of this part…">'+e(node.editedTitle)+'</textarea>'+
  '<div class="ns-hypo-node-actions"><button type="button" data-hypo-node-save="'+e(node.id)+'">Use my wording</button>'+
  '<button type="button" data-hypo-node-investigate="'+e(node.id)+'">Ask more questions about this →</button></div>'+
  '<p class="ns-hypo-node-privacy">Your wording is treated as your correction, not proof of a hidden cause. If no new question remains, you can still edit earlier answers.</p>'+
  '</section>';
}
function answerHistory(state){
 return '<details class="ns-hypo-answer-history"><summary>Review and change any earlier answer ('+state.answers.length+')</summary>'+
 '<p>Changing an answer updates all dependent interpretations. If an earlier answer opened a specialised branch, changing it may remove questions that no longer apply.</p>'+
 '<div class="ns-hypo-history-list">'+state.answers.map((a,i)=>{
  const q=QUESTION_BY_ID[a.questionId];
  if(!q)return '';
  return '<div class="ns-hypo-history-item"><label for="ns-hypo-history-'+i+'">'+
   '<span>Question '+(i+1)+'</span><strong>'+e(q.prompt)+'</strong></label>'+
   '<select id="ns-hypo-history-'+i+'" data-hypo-answer-edit="'+e(a.questionId)+'">'+
   ANSWER_OPTIONS.map(opt=>'<option value="'+e(opt.id)+'"'+(a.answerId===opt.id?' selected':'')+'>'+e(opt.label)+'</option>').join('')+
   '</select><button type="button" data-hypo-save-answer="'+e(a.questionId)+'">Update</button></div>';
 }).join('')+'</div></details>';
}
function evidenceReviewSection(state,r){
 const area=evidenceCoverage(state);
 const audit=auditFormulationEvidence(state,r);
 const remarks=r.challenges||[];
 const facts=[...investigationFacts(state),...adaptiveFacts(state)];
 return '<section class="ns-hypo-evidence-review" aria-label="Critical evidence and gaps">'+
  '<div class="ns-hypo-section-head"><span>03</span><div><p class="ns-hypo-eyebrow">CHALLENGE THE EASY ANSWER</p>'+
  '<h2>What could make our first explanation wrong?</h2><p>Real counterexamples matter. These are specific observations that weaken one-cause stories; they do not prove a different cause.</p></div></div>'+
  (remarks.length?'<div class="ns-hypo-counter-grid">'+remarks.map(c=>
   '<article class="ns-hypo-counter-card"><h3>'+e(c.title)+'</h3><p>'+e(c.explanation)+'</p>'+
   '<details><summary>See the actual evidence</summary><ul>'+c.evidence.map(x=>
    '<li><strong>'+e(x.answer)+'</strong><span>'+e(x.question)+'</span></li>').join('')+'</ul></details></article>'
  ).join('')+'</div>':
  '<p class="ns-hypo-graph-unknown">We have not recorded a clear observation that challenges a simple explanation yet. That does not make any explanation correct.</p>')+
  '<details class="ns-hypo-factor-review"><summary>Which contributing factors have we actually examined? ('+
   area.filter(x=>x.status==='reported').length+' of '+area.length+' domains with reported details)</summary>'+
   '<p>“Not investigated” means no relevant question was answered—not that this factor is absent. A question answered uncertainly is also not a confirmed fact.</p>'+
   '<ul>'+area.map(x=>'<li><strong>'+e(x.label)+'</strong> <span>'+e(
    x.status==='reported'?'Some person-reported details':x.status==='asked_no_confirmed_detail'?'Asked, not established':'Not investigated yet')+'</span></li>').join('')+'</ul></details>'+
  '<details class="ns-hypo-evidence-ledger"><summary>Read every source-backed answer in its exact wording ('+
   facts.length+')</summary><p>Typed descriptions are your own words. Choice-based answers keep the original wording of the option you selected. Neither establishes a medical diagnosis or somebody else’s motive.</p>'+
   '<ul>'+facts.map(x=>'<li><strong>'+e(x.text)+'</strong><span>'+e(x.question)+'</span></li>').join('')+'</ul></details>'+
  '<p class="ns-hypo-quiet">Automated provenance audit: '+(audit.passed?
   'No source mismatch found in the checked causal links.':
   audit.structuralIssues.length+' items need technical review; this does not make the remaining ideas true.')+
   ' Clinical accuracy has not been measured.</p></section>';
}
function resultPage(state,selectedNode=''){
 const r=hypothesisResult(state);
 if(state.safety)return safetyPage(state);
 return page('<header class="ns-hypo-result-hero"><div><p class="ns-hypo-eyebrow">YOUR WORKING FORMULATION · VERSION YOU CAN REVISE</p>'+
  '<h1>We have some possibilities. Let’s test the map.</h1>'+
  '<p>'+e(r.summary)+'</p>'+
  '<span class="ns-hypo-result-count">'+r.examined+' informative answers · '+r.coverage.layers.length+
  ' areas explored · No clinical probability</span></div>'+
  art('ns-character-solving.webp','ns-hypo-results-art')+'</header>'+
  '<section class="ns-hypo-pattern"><div class="ns-hypo-section-head"><span>01</span><div>'+
  '<p class="ns-hypo-eyebrow">YOUR STARTING QUESTION</p><h2>What are we actually trying to understand?</h2></div></div>'+
  '<p class="ns-hypo-concern">'+e(r.situation)+'</p>'+
  '<p>There may be nothing wrong with a behaviour or preference itself. Sometimes the relevant difficulty is the social response, uncertainty, available resources or what the situation means to you.</p>'+
  '<p class="ns-hypo-quiet">Every interpretation below is provisional. A question about gender presentation cannot establish gender identity, sexual orientation or an underlying wound.</p></section>'+
  domainReasoningSection(state,r)+graphSection(r,selectedNode)+
  '<div data-hypo-node-editor>'+nodeEditor(r,selectedNode)+'</div>'+evidenceReviewSection(state,r)+
  '<section class="ns-hypo-possibilities"><div class="ns-hypo-section-head"><span>03</span><div>'+
  '<p class="ns-hypo-eyebrow">REASONS FOR AND AGAINST</p><h2>Compare our possible explanations.</h2></div></div>'+
  (r.alternatives.length?'<p>These are ranked by uncalibrated relative compatibility with your answers. They are not measured likelihoods, diagnoses or a prediction of your future.</p>':'<p>No specific explanatory model is asserted for this area. Your own observations remain the primary record.</p>')+
  (r.alternatives.length?'<details class="ns-hypo-full-evidence"><summary>Open the detailed evidence for each possibility ('+r.alternatives.length+')</summary>'+
  '<div class="ns-hypo-results-list">'+r.alternatives.map((c,i)=>resultCard(state,c,i)).join('')+'</div></details>':'<p class="ns-hypo-graph-unknown">This synthetic atlas area does not yet have a reviewed explanatory interview. Nobody will not invent a psychological mechanism for your experience.</p>')+'</section>'+
  answerHistory(state)+
  '<section class="ns-hypo-final-actions"><div><h2>Keep exploring—or put something into practice</h2>'+
  '<p>There is no fixed question count. Each further question tries to distinguish explanations or investigate a part you challenged. You may also stop, revise, or choose something helpful without deciding on one cause.</p></div>'+
  '<div class="ns-hypo-final-buttons">'+
  (domainEligible(state)&&!state.domain?.finished?'<button type="button" class="ns-hypo-invest-action" data-hypo-domain-start>Investigate the deeper WHY for this specific experience →</button>':'')+
   (!state.investigation?.finished?'<button type="button" class="ns-hypo-invest-action" data-hypo-invest-start>Investigate possible causes and maintaining cycles →</button>':'')+
   (!state.adaptive?.finished&&state.investigation?.answers?.length?'<button type="button" class="ns-hypo-invest-action" data-hypo-adaptive-start>Test competing explanations in depth →</button>':'')+
  (state.drill?.confirmed&&!state.caseDetails?.finished?'<button type="button" data-hypo-fact-start>Explore more precise details →</button>':'')+
  (r.canContinue?'<button type="button" data-hypo-more>Keep investigating →</button>':
   '<p>We have used the currently available authored questions for this area. You can still revise the graph or an earlier answer.</p>')+
  (r.topic?'<a class="ns-hypo-primary" href="#workbook-topic/'+e(r.topic)+'">Explore practical options →</a>':
   '<a class="ns-hypo-primary" href="'+e(r.alternatives[0]?.process.link||'#navigate')+'">Explore relevant interventions →</a>')+
  '<button type="button" data-hypo-download>Download my working formulation and graph</button>'+
  '<button type="button" data-hypo-restart>Begin a different investigation</button></div>'+
  '<output class="ns-hypo-export-status" data-hypo-export aria-live="polite"></output></section>'+
  '<details class="ns-hypo-transparency"><summary>How were questions selected? What can it and can’t it establish?</summary>'+
  '<p>There are '+HYPOTHESIS_DEEP_QUESTION_COUNT+' authored deeper questions beyond the original bank, plus '+SYNTHETIC_MECHANISMS.length+' provisional mechanisms indexed from the synthetic database and a focused adaptive inquiry. The engine compares plausible models using subjective, uncalibrated compatibility signals and chooses follow-ups designed to distinguish them. This resembles the general idea of information-gain questioning, not a validated Bayesian clinical assessment. The results cannot be interpreted as clinical probabilities.</p>'+
  '<p>Answers can be wrong, incomplete or context-dependent. Several models may be relevant, and the real explanation may not be included. No number of questions proves a psychological cause. The graph explicitly separates what you reported from what is merely suggested.</p>'+
  '<p>Preferences in grooming, gender expression, sexuality, culture, disability or relationships are not disorders just because they depart from social expectations. No trauma or attachment origin is inferred without you describing it.</p>'+
  '<p>For safety guidance see <a href="https://www.nice.org.uk/guidance/ng225/chapter/recommendations" target="_blank" rel="noopener noreferrer">NICE NG225</a>.</p>'+
  '<p>The entire session is held only in this page memory; download happens only by direct choice. No personal answers are uploaded by this feature.</p></details>');
}
function saveText(name,raw){
 const url=URL.createObjectURL(new Blob([raw],{type:'text/plain;charset=utf-8'}));
 const el=document.createElement('a');el.href=url;el.download=name;document.body.append(el);el.click();el.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1600);
}
export function renderHypothesisGenerator(root,{initialTrack='',initialTopic=''}={}){
 let state=null,stage='start',preselected=initialTrack,topic=initialTopic,selectedNode='';
 const render=(focus=false)=>{
  root.innerHTML=stage==='start'?landing():state?.safety?safetyPage(state):stage==='drill'?narrowing(state):stage==='case'?specificFactsPage(state):stage==='investigation'?functionalInvestigationPage(state):stage==='adaptive'?adaptiveInquiryPage(state):stage==='domain'?domainInquiryPage(state):stage==='result'?resultPage(state,selectedNode):asking(state);
  if(focus){
   const heading=root.querySelector('#ns-hypo-question, .ns-hypo-result-hero h1, .ns-hypo-pick h2, .ns-hypo-safety-page h1');
   if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
  }
 };
 const ownWords=()=>root.querySelector('[data-hypo-start-words]')?.value?.trim()||'';
 const begin=(trackId,topicId='')=>{
  state=startHypothesis({trackId,topicId,description:ownWords()});
  selectedNode='';stage=state.drill?'drill':'question';render(true);
 };
 const beginCategory=(categoryId)=>{
  const trackId=TRACK_FOR_CATEGORY[categoryId];
  if(trackId===undefined)return;
  if(!trackId){
   state={...startHypothesis({trackId:'emotion',description:ownWords()}),drill:null,
    safety:{kind:'support',reason:'Safety, coercion, self-injury concerns or serious immediate danger require appropriate human support rather than automated psychological guessing.'}};
   selectedNode='';stage='result';render(true);return;
  }
  state=startHypothesis({trackId,description:ownWords()});
  state={...state,drill:{...beginSubtypeDrill(trackId),categoryId,
   entryCategoryId:categoryId,possibleCategories:null,
   unsupportedCategory:!REVIEWED_INTERVIEW_CATEGORIES.includes(categoryId),
   clusterId:'',leafId:'',confirmed:false,details:{},events:[],finished:false}};
  selectedNode='';stage='drill';render(true);
 };
 root.addEventListener('input',event=>{
  const el=event.target;
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
  if(b.dataset.hypoCategory){beginCategory(b.dataset.hypoCategory);return;}
  if(b.dataset.hypoTrack){begin(b.dataset.hypoTrack,b.dataset.hypoTopic||'');return;}
  if(b.dataset.hypoDrillAnswer&&state?.drill){
   state=answerHypothesisDrill(state,b.dataset.hypoDrillQuestion,b.dataset.hypoDrillAnswer);
   stage=state.safety?'result':state.drill?.finished?(state.drill.unsupportedCategory?'result':'question'):'drill';
   render(true);return;
  }
  if(b.hasAttribute('data-hypo-drill-skip')&&state?.drill){
   state=skipHypothesisDrill(state);stage=state.drill.unsupportedCategory?'result':'question';render(true);return;
  }
  if(b.hasAttribute('data-hypo-fact-start')&&state?.drill?.confirmed){
   state=startCaseDetailInterview(state);
   if(caseDetailQuestion(state)){stage='case';render(true);}
   return;
  }
  if(b.dataset.hypoFactAnswer&&state){
   state=answerCaseDetail(state,b.dataset.hypoFactQuestion,b.dataset.hypoFactAnswer);
   stage=state.caseDetails?.active?'case':(state.drill?.unsupportedCategory?'result':'question');
   render(true);return;
  }
  if(b.hasAttribute('data-hypo-fact-back')&&state){
   if(state.caseDetails?.answers?.length){state=backCaseDetail(state);stage='case';}
   else{state=skipCaseDetail(state);stage=state.drill?.unsupportedCategory?'result':'question';}
   render(true);return;
  }
  if(b.hasAttribute('data-hypo-fact-stop')&&state){
   state=skipCaseDetail(state);stage=state.drill?.unsupportedCategory?'result':'question';
   render(true);return;
  }
  if(b.hasAttribute('data-hypo-invest-start')&&state){
   state=startInvestigation(state);
   if(investigationQuestion(state)){stage='investigation';render(true);}
   return;
  }
  if(b.dataset.hypoInvestAnswer&&state){
   state=answerInvestigation(state,b.dataset.hypoInvestQuestion,b.dataset.hypoInvestAnswer,
    root.querySelector('[data-hypo-invest-words]')?.value||'');
   stage=state.safety?'result':state.investigation?.active?'investigation':'result';
   render(true);return;
  }
  if(b.hasAttribute('data-hypo-invest-back')&&state){
   if(state.investigation?.answers?.length){state=backInvestigation(state);stage='investigation';}
   else{state=stopInvestigation(state);stage='question';}
   render(true);return;
  }
  if(b.hasAttribute('data-hypo-invest-stop')&&state){
   state=stopInvestigation(state);stage='result';render(true);return;
  }
    if(b.hasAttribute('data-hypo-adaptive-start')&&state){
   state=startAdaptiveInquiry(state);
   stage=adaptiveQuestion(state)?'adaptive':'result';render(true);return;
  }
  if(b.dataset.hypoAdaptiveAnswer&&state){
   state=answerAdaptiveInquiry(state,b.dataset.hypoAdaptiveQuestion,b.dataset.hypoAdaptiveAnswer,
    root.querySelector('[data-hypo-adaptive-words]')?.value||'');
   stage=state.adaptive?.active?'adaptive':'result';render(true);return;
  }
  if(b.hasAttribute('data-hypo-adaptive-back')&&state){
   if(state.adaptive?.answers?.length){state=backAdaptiveInquiry(state);stage='adaptive';}
   else{state=stopAdaptiveInquiry(state);stage='result';}
   render(true);return;
  }
  if(b.hasAttribute('data-hypo-adaptive-stop')&&state){
   state=stopAdaptiveInquiry(state);stage='result';render(true);return;
  }
  
  if(b.hasAttribute('data-hypo-domain-start')&&state){
   state=startDomainInquiry(state);
   stage=domainQuestion(state)?'domain':'result';render(true);return;
  }
  if(b.dataset.hypoDomainAnswer&&state){
   state=answerDomainInquiry(state,b.dataset.hypoDomainQuestion,b.dataset.hypoDomainAnswer,
    root.querySelector('[data-hypo-domain-words]')?.value||'');
   stage=state.domain?.active?'domain':'result';render(true);return;
  }
  if(b.hasAttribute('data-hypo-domain-back')&&state){
   if(state.domain?.answers?.length){state=backDomainInquiry(state);stage='domain';}
   else{state=stopDomainInquiry(state);stage='result';}
   render(true);return;
  }
  if(b.hasAttribute('data-hypo-domain-stop')&&state){
   state=stopDomainInquiry(state);stage='result';render(true);return;
  }
  if(b.hasAttribute('data-hypo-restart')){stage='start';state=null;selectedNode='';render(true);return;}
  if(b.hasAttribute('data-hypo-back')){
   if(state?.safety&&state.adaptive?.answers?.length){state=backAdaptiveInquiry(state);stage='adaptive';}
   else if(state?.safety&&state.investigation?.answers?.length){state=backInvestigation(state);stage='investigation';}
   else if(state?.answers.length){state=backHypothesis(state);stage='question';}
   else if(state?.drill?.events?.length){
    state=backHypothesisDrill(state);stage='drill';
   }else {stage='start';state=null;}
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
  if(b.dataset.hypoLinkVerdict&&state){
   state=reviewHypothesisLink(state,b.dataset.hypoLinkId,b.dataset.hypoLinkVerdict);
   const selected=b.dataset.hypoLinkId,verdict=b.dataset.hypoLinkVerdict;
   render(false);
   [...root.querySelectorAll('[data-hypo-link-verdict]')].find(x=>
    x.dataset.hypoLinkId===selected&&x.dataset.hypoLinkVerdict===verdict)?.focus({preventScroll:true});
   return;
  }
  if(b.dataset.hypoNode&&state){
   selectedNode=b.dataset.hypoNode;
   stage='result';render(false);
   root.querySelector('[data-hypo-node-editor]')?.scrollIntoView({block:'nearest',behavior:'instant'});
   root.querySelector('.ns-hypo-node-editor h3')?.setAttribute('tabindex','-1');
   root.querySelector('.ns-hypo-node-editor h3')?.focus({preventScroll:true});
   return;
  }
  if(b.hasAttribute('data-hypo-node-deselect')&&state){
   selectedNode='';render(false);
   root.querySelector('#ns-hypo-graph-heading')?.focus({preventScroll:true});
   return;
  }
  if(b.dataset.hypoNodeVerdict&&state){
   const id=b.dataset.hypoNodeId;
   selectedNode=id;
   state=reviseHypothesisNode(state,id,{verdict:b.dataset.hypoNodeVerdict});
   render(false);
   root.querySelector('[data-hypo-node-verdict="'+b.dataset.hypoNodeVerdict+'"]')?.focus({preventScroll:true});
   return;
  }
  if(b.dataset.hypoNodeSave&&state){
   const id=b.dataset.hypoNodeSave;
   state=reviseHypothesisNode(state,id,{text:root.querySelector('[data-hypo-node-text]')?.value||''});
   selectedNode=id;render(false);
   root.querySelector('[data-hypo-node-text]')?.focus({preventScroll:true});
   return;
  }
  if(b.dataset.hypoNodeInvestigate&&state){
   selectedNode=b.dataset.hypoNodeInvestigate;
   state=focusHypothesisLayer(state,selectedNode);
   if(nextHypothesisQuestion(state)){stage='question';render(true);}
   else {
    const editor=root.querySelector('[data-hypo-node-editor]');
    if(editor){const p=document.createElement('p');p.setAttribute('role','status');
     p.textContent='There are no further authored questions for this part. You can correct its wording or revise earlier answers.';
     editor.append(p);}
   }
   return;
  }
  if(b.dataset.hypoSaveAnswer&&state){
   const id=b.dataset.hypoSaveAnswer;
   const selector=[...root.querySelectorAll('[data-hypo-answer-edit]')].find(el=>el.dataset.hypoAnswerEdit===id);
   if(!selector)return;
   state=reviseHypothesisAnswer(state,id,selector.value);
   selectedNode='';render(false);
   root.querySelector('.ns-hypo-answer-history summary')?.focus({preventScroll:true});
   return;
  }
  if(b.hasAttribute('data-hypo-download')&&state){
   saveText('nobodys-simple-hypothesis-'+state.trackId+'.txt',formulationPlainText(state));
   const status=root.querySelector('[data-hypo-export]');if(status)status.textContent='Downloaded as a text file. Keep it somewhere private.';
  }
 });
 if(preselected&&TRACK_BY_ID[preselected])begin(preselected,topic||'');else render();
}
