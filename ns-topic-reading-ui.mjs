/* Quiet long-form reading experience for Atlas topics.
 * All source wording is HTML-escaped; the personal map never saves or scores.
 * The intervention chooser, worksheets, and visual games remain independent.
 */
import {escapeHTML as escape} from './core.mjs';
import {topicPageModel} from './ns-topic-reading-data.mjs';
const e=x=>escape(String(x??''));
const list=items=>'<ul>'+items.map(t=>'<li>'+e(t)+'</li>').join('')+'</ul>';
const heading=(eyebrow,title)=>'<div class="ns-topic-section-heading">'+
 '<p class="ns-topic-kicker">'+e(eyebrow)+'</p><h2>'+e(title)+'</h2></div>';
const group=(label,detail)=>'<li><strong>'+e(label)+'</strong><p>'+e(detail)+'</p></li>';
function compactMechanisms(g){
 const mechanisms=(g.mechanisms||[]).filter(x=>x.label&&x.detail).slice(0,8);
 const contributors=(g.contributors||[]).filter(Boolean).slice(0,6);
 if(!mechanisms.length&&!contributors.length)return '';
 return '<details class="ns-topic-details ns-pick-deeper"><summary>Look a little deeper at possible influences</summary>'+
  '<div class="ns-topic-detail-body">'+
  (contributors.length?'<h3>Factors worth considering</h3>'+list(contributors):'')+
  (mechanisms.length?'<h3>'+(g.contextFirst?'Conditions and influences worth checking':'Different possible maintaining processes')+'</h3>'+
   mechanisms.map(m=>'<div class="ns-pick-mechanism"><strong>'+e(m.label)+'</strong><p>'+e(m.detail)+'</p>'+
   (m.target?'<small>Possible focus: '+e(m.target)+'</small>':'')+'</div>').join(''):'')+
  '<p class="ns-pick-limits">These are hypotheses and contextual questions. Reading a description cannot tell you which explanation applies to a particular person.</p>'+
  '</div></details>';
}
export function renderTopicQuickNav(g){
 if(g.kind!=='topic'||g.safetyFirst)return '';
 return '<nav class="ns-topic-quick-nav" aria-label="On this guide">'+
  '<span class="ns-topic-nav-label">Go straight to</span>'+
  '<button type="button" data-topic-jump="ns-topic-understand">Understand</button>'+
  '<button type="button" data-topic-jump="ns-topic-framework">Ways forward</button>'+
  '<button type="button" data-topic-jump="ns-pick-chooser">Try something</button>'+
  '<button type="button" data-topic-jump="ns-topic-answers">More answers</button>'+
  '</nav>';
}
export function renderTopicReadingStart(g){
 const m=topicPageModel(g);
 if(!m||g.safetyFirst)return '';
 const recognition=m.recognition.length?m.recognition:[
  g.title,
  g.lead||g.what,
  'Different people may experience this in different ways.'
 ];
 const core=m.core;
 const coreTitle=m.id==='betrayal-trauma'?'The four injuries that betrayal can affect':
  (m.contextFirst?'Four ways to understand the context':'Four possible parts of the picture');
 const frameworkTitle=m.id==='betrayal-trauma'?'Four areas of rebuilding':
  (m.contextFirst?'Four directions you can choose from':'Four directions that may help');
 const caution=g.medical?'<p class="ns-topic-medical-note">Physical and medical needs matter. New, severe or changing symptoms deserve appropriate healthcare assessment.</p>':'';
 return '<div class="ns-topic-reading" data-topic-reading>'+
  '<section class="ns-topic-section ns-topic-opening ns-pick-understand" id="ns-topic-understand">'+
    '<p class="ns-topic-kicker">START HERE</p>'+
    '<h2>Does any of this sound familiar?</h2>'+
    '<ul class="ns-topic-recognition">'+recognition.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>'+
    '<p class="ns-topic-quiet-note">You do not have to recognise every example, or agree with this description, to explore your situation.</p>'+
   (g.supportFirst?'<p class="ns-topic-medical-note">Your safety and privacy come first. You do not need to write about harm, confront someone or try an exercise. Confidential practical support may be the safest next step.</p>':'')+
    '<div class="ns-topic-reframe">'+heading('THE KEY IDEA','What might be happening?')+
     '<p class="ns-pick-definition">'+e(g.what)+'</p>'+
     '<p class="ns-topic-key-line">'+e(m.reframe)+'</p>'+
     '<div class="ns-pick-cycle"><strong>'+(m.contextFirst?'Context can matter':'One possible pattern—not a conclusion')+'</strong><p>'+
      e(g.cycle||'Several explanations are possible, and further information may be needed.')+'</p></div>'+
     caution+
    '</div>'+
    '<div class="ns-topic-aspect-section"><h3>'+e(coreTitle)+'</h3>'+
     '<ol class="ns-topic-aspects">'+core.map(x=>group(x.label,x.detail)).join('')+'</ol></div>'+
    compactMechanisms(g)+
  '</section>'+
  '<section class="ns-topic-section ns-topic-traps">'+
   '<details class="ns-topic-details"><summary>Things that can make this harder</summary>'+
   '<div class="ns-topic-detail-body"><ol class="ns-topic-trap-list">'+m.traps.map(x=>group(x[0],x[1])).join('')+'</ol>'+
   '<p>Not every pattern applies to you. Some problems are caused or sustained by real circumstances that need changing, not by your reaction to them.</p></div></details>'+
  '</section>'+
  '<section class="ns-topic-section ns-topic-framework" id="ns-topic-framework">'+
   heading('WAYS FORWARD',frameworkTitle)+
   '<p class="ns-topic-helper">These are directions to consider, not stages you must finish in order. Choose what is relevant and safe.</p>'+
   '<ol class="ns-topic-steps">'+m.steps.map((x,i)=>'<li><span class="ns-topic-index">'+String(i+1).padStart(2,'0')+'</span>'+
    '<div><strong>'+e(x.label)+'</strong><p>'+e(x.detail)+'</p></div></li>').join('')+'</ol>'+
   '<p class="ns-topic-bridge">You can stop at understanding, or continue to the existing activities below.</p>'+
   '<button type="button" class="ns-topic-to-tools" data-topic-jump="ns-pick-chooser">Explore optional tools <span aria-hidden="true">↓</span></button>'+
  '</section></div>';
}
export function renderTopicReadingEnd(g){
 const m=topicPageModel(g);
 if(!m||g.safetyFirst)return '';
 return '<div class="ns-topic-reading ns-topic-reading-end" id="ns-topic-answers">'+
  '<section class="ns-topic-section ns-topic-progress" id="ns-topic-progress">'+
   heading('LOOKING AHEAD','What might progress look like?')+
   '<p class="ns-topic-helper">There is no expected timeline or mandatory emotional outcome. Progress can also mean better support, access or safety.</p>'+
   list(m.progress)+
   '<p class="ns-topic-quiet-note">The aim is not to monitor yourself constantly or prove that you are improving every day.</p>'+
  '</section>'+
  '<section class="ns-topic-section ns-topic-faq">'+
   heading('COMMON QUESTIONS','Things you might still be wondering')+
   '<div class="ns-topic-faq-list">'+m.faq.map(([q,a])=>
    '<details class="ns-topic-details"><summary>'+e(q)+'</summary><p>'+e(a)+'</p></details>').join('')+'</div>'+
  '</section>'+
  '<section class="ns-topic-section ns-topic-support" id="ns-topic-support">'+
   heading('WHEN MORE SUPPORT HELPS','You do not have to do everything alone')+
   '<p>'+e(m.supportText)+'</p>'+
   (g.medical?'<p>If the symptoms are urgent or severe, seek urgent health assessment rather than relying on a self-help page.</p>':'')+
   '<a href="#need/support-safety">Safety and urgent support <span aria-hidden="true">→</span></a>'+
  '</section>'+
  '<footer class="ns-topic-ending"><span aria-hidden="true">✦</span>'+
   '<p>'+e(m.closing)+'</p></footer>'+
 '</div>';
}
export function renderTopicSafetyReading(g){
 if(g.kind!=='topic'||!g.safetyFirst)return '';
 const m=topicPageModel(g);
 return '<section class="ns-topic-reading ns-topic-safety-reading">'+
   heading('IF YOU ARE TRYING TO MAKE SENSE OF THIS','You do not need to prove the problem to deserve support')+
   '<p>'+e(g.lead||g.what)+'</p>'+
   '<p>'+e(m?.supportText||'Human support and safety come before self-guided activities.')+'</p>'+
   '<p class="ns-topic-quiet-note">There is no checklist, score, journal or behavioural experiment to complete on this page. Keep your privacy and immediate safety first.</p>'+
  '</section>';
}
/* Hash URLs are used by the app router. Local guide jumps therefore use
 * buttons: fragment links would replace the workbook route and lose the page.
 */
export function bindTopicJumps(surface){
 surface.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-topic-jump]');
  if(!button)return;
  const id=button.dataset.topicJump;
  if(!['ns-topic-understand','ns-topic-framework','ns-pick-chooser','ns-topic-answers'].includes(id))return;
  const section=surface.querySelector('#'+id);
  if(!section)return;
  section.scrollIntoView({block:'start',behavior:'instant'});
  const heading=section.querySelector('h2,h3');
  if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
 });
}
