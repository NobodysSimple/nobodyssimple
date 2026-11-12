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
  '<button type="button" data-topic-jump="ns-topic-common">Common experiences</button>'+
  '<button type="button" data-topic-jump="ns-topic-understand">Understand</button>'+
  '<button type="button" data-topic-jump="ns-pick-chooser">What may help</button>'+
  '<button type="button" data-topic-jump="ns-topic-relief">Quick relief</button>'+
  '<button type="button" data-topic-jump="ns-topic-support">Support</button>'+
  '</nav>';
}
export function renderTopicReadingStart(g){
 const m=topicPageModel(g);
 if(!m||g.safetyFirst)return '';
 const recognition=m.recognition.length?m.recognition:[
  g.title,g.lead||g.what,'Different people can experience this in different ways.'
 ];
 const identityTopic=/(identity|diagnos|stigma|self-image)/i.test((g.id||'')+' '+(g.title||''));
 const needs=[
  ['overwhelmed','Everything feels like too much'],
  ['understand','I want to understand what is happening'],
  ['stuck','I feel stuck and need a next step'],
  ['support','I need support from someone else']
 ];
 if(identityTopic)needs.splice(2,0,['identity','I am questioning how I see myself'],['stigma','I am worried about stigma']);
 const needButtons=needs.map(([id,label])=>'<button type="button" class="ns-topic-need-choice" data-topic-need="'+e(id)+'">'+e(label)+' <span aria-hidden="true">→</span></button>').join('');
 const profile=m.profile.length?
  '<section class="ns-topic-section ns-topic-profile-section" id="ns-topic-profile" aria-labelledby="ns-topic-profile-title">'+
   '<p class="ns-topic-kicker">IDENTITY AND SELF</p><h2 id="ns-topic-profile-title">What parts of you matter beyond this experience?</h2>'+
   '<p class="ns-topic-helper">You can take what is useful from a label or explanation without letting it speak for your whole life.</p>'+
   '<fieldset data-topic-profile class="ns-topic-profile-options"><legend>'+e(m.profileQuestion)+'</legend>'+
   m.profile.map(item=>'<label class="ns-topic-check"><input type="checkbox" data-topic-pattern="'+e(item.id)+'" value="'+e(item.label)+'">'+
    '<span><strong>'+e(item.label)+'</strong><small>'+e(item.detail)+'</small></span></label>').join('')+
   '</fieldset>'+
   '<p class="ns-topic-profile-result" data-topic-profile-result role="status" aria-live="polite">There is no correct combination. These patterns can overlap, or none may fit.</p>'+
   '<button type="button" class="ns-topic-clear" data-topic-clear>Clear selections</button>'+
   '<div class="ns-topic-reflections"><p class="ns-topic-kicker">OPTIONAL JOURNAL PROMPTS</p>'+
    '<label><span>Before this became a concern, what parts of life felt important to me?</span><textarea rows="2" maxlength="1200" placeholder="You can leave this blank or write a few words…"></textarea></label>'+
    '<label><span>What has changed, and what has stayed part of me?</span><textarea rows="2" maxlength="1200" placeholder="Notice both change and continuity…"></textarea></label>'+
    '<label><span>What story am I telling myself about this?</span><textarea rows="2" maxlength="1200" placeholder="A story can be questioned without dismissing what happened…"></textarea></label>'+
    '<p class="ns-topic-helper">These notes stay in this open page and are not sent. Copy anything you want to keep before leaving.</p></div>'+
  '</section>':
  '<section class="ns-topic-section ns-topic-profile-section" id="ns-topic-profile">'+
  heading('IDENTITY AND SELF','What still matters to you?')+
  '<p>You can take this experience seriously without reducing yourself to it. If writing does not feel useful or safe, skip the prompts.</p>'+
  '<div class="ns-topic-reflections">'+
   '<label><span>What parts of me matter beyond this problem?</span><textarea rows="2" maxlength="1200" placeholder="You can leave this blank…"></textarea></label>'+
   '<label><span>What story am I telling myself about this?</span><textarea rows="2" maxlength="1200" placeholder="A story can be questioned without dismissing what happened…"></textarea></label>'+
   '<p class="ns-topic-helper">These notes stay in this open page and are not sent. Copy anything you want to keep before leaving.</p></div></section>';
 const core=m.core;
 const caution=g.medical?'<p class="ns-topic-medical-note">Physical and medical needs matter. New, severe or changing symptoms deserve appropriate healthcare assessment.</p>':'';
 return '<div class="ns-topic-reading" data-topic-reading>'+
  '<section class="ns-topic-section ns-topic-needs" aria-labelledby="ns-topic-needs-title">'+
   '<p class="ns-topic-kicker">START WITH WHAT YOU NEED</p><h2 id="ns-topic-needs-title">What would help most right now?</h2>'+
   '<div class="ns-topic-need-choices">'+needButtons+'</div></section>'+
  '<section class="ns-topic-section ns-topic-opening" id="ns-topic-common" aria-labelledby="ns-topic-common-title">'+
   '<p class="ns-topic-kicker">START HERE</p><h2 id="ns-topic-common-title">Common experiences</h2>'+
   '<p class="ns-topic-helper">Select anything that feels familiar. You do not need to agree with every point.</p>'+
   '<ul class="ns-topic-recognition">'+recognition.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>'+
   '<p class="ns-topic-quiet-note">You do not have to recognise every example to take your situation seriously.</p>'+
   (g.supportFirst?'<p class="ns-topic-medical-note">Your safety and privacy come first. You do not need to write about harm, confront someone or try an exercise. Confidential practical support may be the safest next step.</p>':'')+
  '</section>'+
  '<aside class="ns-topic-reassurance" id="ns-topic-reassurance" aria-labelledby="ns-topic-reassurance-title">'+
   '<p class="ns-topic-kicker">A REMINDER</p><h2 id="ns-topic-reassurance-title">This experience does not tell the whole story.</h2>'+
   '<ul><li>It does not, by itself, explain why this is happening.</li><li>It does not define everything about you or decide what comes next.</li><li>You do not have to settle on an answer today.</li><li>Real circumstances, health, access and support can matter as much as personal coping.</li></ul>'+
  '</aside>'+
  '<details class="ns-topic-section ns-topic-understand-details" id="ns-topic-understand">'+
   '<summary><span class="ns-topic-kicker">UNDERSTAND</span><strong>Explore what may be shaping this</strong><small>Optional reading. Open it when you have room to think about possible explanations.</small></summary>'+
   '<div class="ns-topic-understand-content">'+
    '<div class="ns-topic-reframe">'+heading('THE KEY IDEA','A starting explanation')+
     '<p class="ns-pick-definition">'+e(g.what)+'</p>'+
     '<p class="ns-topic-key-line">'+e(m.reframe)+'</p>'+
     '<div class="ns-pick-cycle"><strong>'+(m.contextFirst?'Context can matter':'One possible pattern—not a conclusion')+'</strong><p>'+e(g.cycle||'Several explanations are possible, and further information may be needed.')+'</p></div>'+caution+
    '</div>'+
    '<div class="ns-topic-aspect-section"><h3>'+(m.contextFirst?'Ways to understand the context':'Possible parts of the picture')+'</h3>'+
     '<ol class="ns-topic-aspects">'+core.map(x=>group(x.label,x.detail)).join('')+'</ol></div>'+
    compactMechanisms(g)+
    '<details class="ns-topic-details"><summary>Things that can make this harder</summary><div class="ns-topic-detail-body"><ol class="ns-topic-trap-list">'+m.traps.map(x=>group(x[0],x[1])).join('')+'</ol>'+
     '<p>Not every pattern applies to you. Some problems are caused or sustained by real circumstances that need changing, not by your reaction to them.</p></div></details>'+
   '</div></details>'+
  profile+
 '</div>';
}
export function renderTopicReadingEnd(g){
 const m=topicPageModel(g);
 if(!m||g.safetyFirst)return '';
 return '<div class="ns-topic-reading ns-topic-reading-end" id="ns-topic-answers">'+
  '<section class="ns-topic-section ns-topic-progress" id="ns-topic-progress">'+
   heading('LOOKING AHEAD','What progress can look like')+
   '<p class="ns-topic-helper">There is no expected timeline, and progress does not require symptoms to disappear. It may mean understanding yourself better, less shame, more support, safer choices or greater room to be yourself.</p>'+
   list(m.progress)+
   '<p class="ns-topic-quiet-note">You do not need to monitor yourself every day or prove that you are improving.</p>'+
  '</section>'+
  '<section class="ns-topic-section ns-topic-faq">'+
   heading('COMMON QUESTIONS','Things you might still be wondering')+
   '<div class="ns-topic-faq-list">'+m.faq.map(([q,a])=>
    '<details class="ns-topic-details"><summary>'+e(q)+'</summary><p>'+e(a)+'</p></details>').join('')+'</div>'+
  '</section>'+
  '<section class="ns-topic-section ns-topic-support" id="ns-topic-support">'+
   heading('WHEN MORE SUPPORT HELPS','You do not have to do this alone')+
   '<p>'+e(m.supportText)+'</p>'+
   (g.medical?'<p>If the symptoms are urgent or severe, seek urgent health assessment rather than relying on a self-help page.</p>':'')+
   '<a href="#need/support-safety">Safety and urgent support <span aria-hidden="true">→</span></a>'+
  '</section>'+
  '<footer class="ns-topic-ending"><span aria-hidden="true">✦</span><p>'+e(m.closing)+'</p></footer>'+
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
export function bindTopicProfile(surface){
 const fieldset=surface.querySelector('[data-topic-profile]');
 if(!fieldset)return;
 const result=surface.querySelector('[data-topic-profile-result]');
 const update=()=>{
  const selected=[...fieldset.querySelectorAll('[data-topic-pattern]:checked')].map(x=>x.value);
  result.textContent=selected.length?
   'You marked: '+selected.join('; ')+'. These are areas to explore, not a diagnosis or an automatically interpreted profile.':
   'There is no correct combination. The patterns can overlap—or none may fit.';
 };
 fieldset.addEventListener('change',update);
 surface.querySelector('[data-topic-clear]')?.addEventListener('click',()=>{
  fieldset.querySelectorAll('[data-topic-pattern]').forEach(c=>{c.checked=false;});
  update();
 });
}

/* Hash URLs are used by the app router. Local guide jumps therefore use
 * buttons: fragment links would replace the workbook route and lose the page.
 */
export function bindTopicJumps(surface){
 surface.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-topic-jump],[data-topic-need]');
  if(!button)return;
  let id=button.dataset.topicJump||'';
  if(button.dataset.topicNeed){
   const need=button.dataset.topicNeed;
   const route={overwhelmed:'overwhelmed',stuck:'stuck',understand:'understand',identity:'identity',stigma:'stigma',support:'support'}[need];
   if(route==='overwhelmed'||route==='stuck'){
    const option=surface.querySelector('[data-pick-need="'+route+'"]');
    option?.click();id='ns-pick-chooser';
   }else{
    id=need==='understand'?'ns-topic-understand':need==='identity'?'ns-topic-profile':need==='stigma'?'ns-topic-reassurance':'ns-topic-support';
   }
  }
  const allowed=['ns-topic-common','ns-topic-understand','ns-topic-profile','ns-pick-chooser','ns-topic-answers','ns-topic-reassurance','ns-topic-support','ns-topic-relief'];
  if(!allowed.includes(id))return;
  const section=surface.querySelector('#'+id);
  if(!section)return;
  if(section instanceof HTMLDetailsElement)section.open=true;
  section.scrollIntoView({block:'start',behavior:'instant'});
  const heading=section.matches('details')?section.querySelector('summary'):section.querySelector('h2,h3');
  if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
 });
}