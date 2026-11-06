/**
 * Nobody's Simple / Stage 4 Learn experience.
 * Render ownership for the new hub, world paths and first reusable lesson.
 * Existing published posts and shelves continue to be rendered by site.mjs.
 * No invented published material, network calls or background storage writes.
 */
import {NS_SKILL_PATHS,NS_LESSONS,lessonRecordId} from './ns-lessons.mjs';

const esc = value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const lessonHref=id=>`#learn/lesson/${encodeURIComponent(id)}`;
const pathHref=id=>`#learn/path/${encodeURIComponent(id)}`;
const SAFE_KEY='ns-account-learning-v2';
function stored(account){
  if(account?.locked)return {};
  try {
    const value=JSON.parse(localStorage.getItem(SAFE_KEY)||'{}');
    return value && typeof value==='object' && !Array.isArray(value)?value:{};
  } catch {return {};}
}
function saveLesson(account,lesson){
  if(account?.locked)return {ok:false,message:'Your saved work is locked. Unlock it in You before saving.'};
  try {
    const old=stored(account),id=lessonRecordId(lesson.id),when=new Date().toISOString();
    old[id]={...(old[id]&&typeof old[id]==='object'?old[id]:{}),title:lesson.title,
      kind:'interactive-skill-lesson',contentVersion:lesson.version,completed:true,
      completedAt:when,updatedAt:when};
    // This is a registered, account-scoped key. The existing Workspace layer
    // intercepts writes and honours the user's explicit sync configuration.
    localStorage.setItem(SAFE_KEY,JSON.stringify(old));
    return {ok:true,message:'Completion saved in your private work. Account syncing follows your existing settings.'};
  } catch {
    return {ok:false,message:'This browser could not save your completion. You can still finish without saving.'};
  }
}
function finished(account,lessonId){return stored(account)[lessonRecordId(lessonId)]?.completed===true;}
function copyPostLink(post){
  return `<a class="ns-learn-published-item" href="#post/${encodeURIComponent(String(post.id))}">
    <span class="ns-learn-published-item__symbol" aria-hidden="true">${post.type==='video'?'▷':'↗'}</span>
    <span><strong>${esc(post.title)}</strong><small>${esc(post.type==='video'?'Video':post.type==='announcement'?'Update':post.type==='blog'?'Writing':'Published piece')}</small></span>
    <span aria-hidden="true">→</span>
  </a>`;
}
function skillCard(path,account){
  const live=path.firstLesson && NS_LESSONS[path.firstLesson];
  const done=live&&finished(account,live.id);
  return `<a class="ns-learn-path" data-ns-world="${esc(path.tone)}" href="${pathHref(path.id)}">
    <span class="ns-learn-path__image"><img src="${esc(path.art)}" alt="" loading="lazy" decoding="async"></span>
    <span class="ns-learn-path__copy"><span class="ns-learn-path__status">${live?(done?'Lesson saved · Review':'1 practice lesson available'):'Lessons in development'}</span>
      <strong>${esc(path.title)}</strong><small>${esc(path.subtitle)}</small><span class="ns-learn-path__description">${esc(path.tagline)}</span>
      <span class="ns-learn-path__arrow">Explore this path <span aria-hidden="true">→</span></span></span>
  </a>`;
}
const SHELVES=[
  {slug:'crash',label:'Crash Courses',detail:'Browse the planned topics and any published learning',art:'ns-character-teaching.webp'},
  {slug:'courses',label:'Full curriculum',detail:'Four quarters and twelve planned modules',art:'ns-character-reading.webp'},
  {slug:'videos',label:'Videos',detail:'Published video pieces, when available',art:'ns-character-guide.webp'},
  {slug:'blog',label:'Writing',detail:'Published essays and original reflections',art:'ns-character-writing.webp'},
  {slug:'audios',label:'Audio',detail:'Guided learning audio is being developed',art:'ns-character-radio.webp'},
  {slug:'stories',label:'Stories',detail:'Explore published case vignettes when available',art:'ns-character-friends.webp'},
  {slug:'debates',label:'Debates',detail:'Explore structured arguments when published',art:'ns-character-solving.webp'}
];
/** Full Learn dashboard. All posts are the actual published posts loaded by site.mjs. */
export function renderNSLearnHub(root,{posts=[],account={}}={}){
  const lesson=NS_LESSONS['observation-or-story'];
  const saved=finished(account,lesson.id);
  const published=posts.filter(p=>p&&p.id&&p.status==='published');
  const available=published.filter(p=>['lesson','education','video','blog','story','debate'].includes(p.type));
  const progress=stored(account);
  const continuePost=published.filter(p=>{
    const rec=progress[String(p.id)];
    return rec && rec.completed!==true && (rec.bookmarked===true || (account.preferences?.trackLearning===true && Boolean(rec.lastOpened)));
  }).sort((a,b)=>{
    const when=p=>String(progress[String(p.id)]?.lastOpened||progress[String(p.id)]?.updatedAt||'');
    return when(b).localeCompare(when(a));
  })[0];
  root.innerHTML=`<div class="ns-learn-v2" data-ns-learn>
    <header class="ns-learn-hero"><div class="ns-learn-hero__copy">
      <p class="ns-learn-eyebrow">LEARN · EVERYDAY SKILLS</p>
      <h1>Learn</h1>
      <p>Short, practical lessons that build useful skills for everyday life.</p>
      <div class="ns-learn-hero__actions"><a class="ns-learn-primary" href="${lessonHref(lesson.id)}">${saved?'Review the first lesson':'Try your first lesson'} <span aria-hidden="true">→</span></a>
        <a class="ns-learn-secondary" href="#learn/crash">Browse learning topics</a></div>
      <small class="ns-learn-hero__note">One interactive demonstration is available. Other learning paths are in development.</small>
    </div><div class="ns-learn-hero__art"><div class="ns-learn-hero__landscape" aria-hidden="true"></div><img src="ns-character-reading.webp" alt="" decoding="async"></div></header>
    ${continuePost?`<section class="ns-learn-continue" aria-label="Continue a published piece"><span><small>${progress[String(continuePost.id)]?.bookmarked?'BOOKMARKED READING':'CONTINUE READING'}</small><strong>${esc(continuePost.title)}</strong><span>This is a real piece from your published library.</span></span><a href="#post/${encodeURIComponent(String(continuePost.id))}">Continue →</a></section>`:''}
    <section class="ns-learn-section ns-learn-feature" aria-labelledby="ns-learn-feature-heading">
      <div class="ns-learn-feature__picture"><img src="ns-landscape-forest.webp" alt="" loading="lazy"><img class="ns-vision-feature-nobody" src="ns-character-reading.webp" alt="" loading="lazy"><span class="ns-learn-feature__stamp">CONTINUE LEARNING · THE FOREST</span></div>
      <div class="ns-learn-feature__copy"><p class="ns-learn-eyebrow">INTERACTIVE DEMONSTRATION · ${esc(lesson.durationLabel.toUpperCase())}</p>
        <h2 id="ns-learn-feature-heading">${esc(lesson.title)}</h2><p>${esc(lesson.subtitle)} Make choices, see why the answers differ, and practise a flexible next step.</p>
        <div class="ns-learn-feature__foot"><span>${saved?'Saved as completed':'Practice without signing in'}</span><a href="${lessonHref(lesson.id)}">${saved?'Review this lesson':'Begin the lesson'} <span aria-hidden="true">→</span></a></div>
      </div></section>
    <section class="ns-learn-section" aria-labelledby="ns-learn-paths-heading"><div class="ns-learn-section__top"><div>
      <p class="ns-learn-eyebrow">SMALL SKILLS, REAL SITUATIONS</p><h2 id="ns-learn-paths-heading">Build skills for everyday life.</h2>
      <p>Try a practical skill, or explore the ideas behind it. No compulsory streaks.</p></div></div>
      <div class="ns-learn-paths">${NS_SKILL_PATHS.map(path=>skillCard(path,account)).join('')}</div></section>
    <section class="ns-learn-section" aria-labelledby="ns-learn-shelves-heading"><div class="ns-learn-section__top"><div>
      <p class="ns-learn-eyebrow">READ · WATCH · EXPLORE</p><h2 id="ns-learn-shelves-heading">The rest of the library.</h2>
      <p>Existing writing and shelves remain available. Planned topics are labelled as planned.</p></div></div>
      <div class="ns-learn-shelves">${SHELVES.map(s=>`<a class="ns-learn-shelf" href="#learn/${s.slug}"><img src="${esc(s.art)}" alt="" loading="lazy"><span><strong>${esc(s.label)}</strong><small>${esc(s.detail)}</small></span><span class="ns-learn-shelf__arrow" aria-hidden="true">→</span></a>`).join('')}</div></section>
    ${available.length?`<section class="ns-learn-section ns-learn-published" aria-labelledby="ns-learn-published-heading"><div class="ns-learn-section__top"><div><p class="ns-learn-eyebrow">ACTUALLY PUBLISHED</p><h2 id="ns-learn-published-heading">Read or watch what's here.</h2></div></div>
      <div class="ns-learn-published__list">${available.slice(0,4).map(copyPostLink).join('')}</div></section>`:''}
    <footer class="ns-learn-footer"><p>Learning is optional. You can always use <a href="#tools">Tools</a> directly, or work through something real on <a href="#home">Home</a>.</p></footer>
  </div>`;
}

export function renderNSLearnPath(root,pathId,{account={}}={}){
  const path=NS_SKILL_PATHS.find(p=>p.id===pathId);
  if(!path){root.innerHTML=`<div class="ns-learn-v2 ns-learn-unavailable"><a class="ns-learn-back" href="#learn">← Back to Learn</a><h1>This learning path isn't available.</h1><p>That link may be outdated. You can explore the current paths instead.</p><a class="ns-learn-primary" href="#learn">See all paths →</a></div>`;return;}
  const lesson=path.firstLesson?NS_LESSONS[path.firstLesson]:null;
  root.innerHTML=`<div class="ns-learn-v2 ns-learn-detail" data-ns-world="${esc(path.tone)}">
    <a class="ns-learn-back" href="#learn">← All learning paths</a>
    <header class="ns-learn-detail__hero"><div><p class="ns-learn-eyebrow">LEARNING PATH / ${esc(path.subtitle.toUpperCase())}</p>
      <h1>${esc(path.title)}</h1><p>${esc(path.tagline)}</p>
      <span class="ns-learn-detail__status">${lesson?'1 interactive demonstration available':'Interactive lessons are being developed'}</span></div>
      <img src="${esc(path.art)}" alt="" loading="lazy"></header>
    ${lesson?`<section class="ns-learn-detail__lesson"><p class="ns-learn-eyebrow">01 · AVAILABLE NOW</p><h2>${esc(lesson.title)}</h2>
      <p>${esc(lesson.subtitle)}</p><a class="ns-learn-primary" href="${lessonHref(lesson.id)}">${finished(account,lesson.id)?'Review the lesson':'Start learning'} →</a></section>`:`<section class="ns-learn-detail__lesson"><p class="ns-learn-eyebrow">LESSONS IN DEVELOPMENT</p><h2>No interactive lessons have been released in this path yet.</h2><p>We won't mark an unfinished lesson as available. You can use the related working tools below while this path is being built.</p></section>`}
    <section class="ns-learn-detail__tools"><p class="ns-learn-eyebrow">WORKING ACTIVITIES</p><h2>Try a real tool now.</h2><div>${path.tools.map(t=>`<a href="${esc(t.href)}"><strong>${esc(t.title)}</strong><span>Open existing tool →</span></a>`).join('')}</div></section>
    <p class="ns-learn-detail__footnote">Skills are useful when applied carefully to your situation. Neither completing a lesson nor trying a tool measures wellbeing or personality.</p>
  </div>`;
}

function choiceButton(choice,chosen){
  return `<button type="button" class="ns-lesson-choice${chosen===choice.id?' is-selected':''}" data-lesson-choice="${esc(choice.id)}" aria-pressed="${String(chosen===choice.id)}"><span class="ns-lesson-choice__mark" aria-hidden="true">${chosen===choice.id?'✓':'○'}</span><span>${esc(choice.label)}</span></button>`;
}
function stepMarkup(step,index,total,chosen){
  if(step.kind==='scene')return `<section class="ns-lesson-stage ns-lesson-scene" aria-labelledby="ns-lesson-step-title"><p class="ns-learn-eyebrow">${esc(step.eyebrow)}</p><h2 id="ns-lesson-step-title">${esc(step.title)}</h2><p>${esc(step.lead)}</p><blockquote>${esc(step.quote)}</blockquote><p>${esc(step.detail)}</p><div class="ns-lesson-principle"><span aria-hidden="true">✦</span><p>${esc(step.learning)}</p></div></section>`;
  if(step.kind==='review')return `<section class="ns-lesson-stage ns-lesson-review" aria-labelledby="ns-lesson-step-title"><p class="ns-learn-eyebrow">${esc(step.eyebrow)}</p><h2 id="ns-lesson-step-title">${esc(step.title)}</h2><p>${esc(step.lead)}</p><div class="ns-lesson-takeaway"><span class="ns-lesson-takeaway__icon" aria-hidden="true">✧</span><strong>Carry this into real life</strong><p>${esc(step.takeaway)}</p></div><p>${esc(step.detail)}</p></section>`;
  const fb=step.feedback?.[chosen];
  return `<section class="ns-lesson-stage ns-lesson-question" aria-labelledby="ns-lesson-step-title"><p class="ns-learn-eyebrow">${esc(step.eyebrow)}</p><h2 id="ns-lesson-step-title">${esc(step.title)}</h2><p class="ns-lesson-question__scene">${esc(step.lead)}</p><h3>${esc(step.prompt)}</h3><div class="ns-lesson-choices" role="group" aria-label="${esc(step.prompt)}">${step.choices.map(c=>choiceButton(c,chosen)).join('')}</div>
    <div class="ns-lesson-feedback" data-lesson-feedback role="status" aria-live="polite" ${fb?'':'hidden'}>${fb?`<strong>${esc(fb.heading)}</strong><p>${esc(fb.text)}</p>`:''}</div></section>`;
}

/** One reusable lesson renderer. User answers live in memory, not storage. */
export function renderNSLesson(root,lessonId,{account={}}={}){
  const lesson=NS_LESSONS[lessonId];
  if(!lesson){root.innerHTML=`<div class="ns-learn-v2 ns-learn-unavailable"><a class="ns-learn-back" href="#learn">← Back to Learn</a><h1>This lesson isn't available.</h1><p>That lesson may have moved, or it hasn't been published. Explore the currently available practice instead.</p><a class="ns-learn-primary" href="#learn">See available learning →</a></div>`;return;}
  let index=0,notice='';
  const answers={};
  const accountNow=()=>account;
  function paint({focus=false}={}){
    const step=lesson.steps[index],picked=answers[step.id]||'',review=step.kind==='review';
    const pct=Math.round((index+1)/lesson.steps.length*100);
    root.innerHTML=`<div class="ns-learn-v2 ns-lesson" data-ns-lesson="${esc(lesson.id)}">
      <nav class="ns-lesson-top" aria-label="Lesson navigation"><a href="${pathHref(lesson.path)}" class="ns-learn-back">← ${esc(NS_SKILL_PATHS.find(x=>x.id===lesson.path)?.title||'Learning path')}</a><a href="#learn" class="ns-lesson-exit">Exit lesson ×</a></nav>
      <header class="ns-lesson-header"><div><p class="ns-learn-eyebrow">THE FOREST / INTERACTIVE DEMONSTRATION</p><h1>${esc(lesson.title)}</h1><p>${esc(lesson.subtitle)}</p></div><img src="${esc(lesson.mascot)}" alt="" loading="lazy"></header>
      <div class="ns-lesson-progress"><div class="ns-lesson-progress__meta"><span>Step ${index+1} of ${lesson.steps.length}</span><span>${pct}% of practice</span></div><div class="ns-lesson-progress__track" role="progressbar" aria-label="Lesson step" aria-valuemin="0" aria-valuemax="${lesson.steps.length}" aria-valuenow="${index+1}"><span style="width:${pct}%"></span></div></div>
      ${stepMarkup(step,index,lesson.steps.length,picked)}
      <div class="ns-lesson-actions"><button type="button" class="ns-lesson-back-button" data-lesson-back ${index===0?'disabled':''}>← Back</button>
      ${review?`<div class="ns-lesson-finish"><button type="button" class="ns-learn-primary ns-lesson-save" data-lesson-save ${accountNow().locked?'disabled':''}>${finished(accountNow(),lesson.id)?'Save completion again':'Save my completion'}</button><a href="#learn" class="ns-lesson-unsaved">Finish without saving →</a></div>`:
      `<button type="button" class="ns-learn-primary" data-lesson-next ${step.kind==='question'&&!picked?'disabled':''}>${step.kind==='scene'?'Start practice':'Continue'} →</button>`}</div>
      ${review?`<p class="ns-lesson-privacy">Saving is optional. The lesson does not record your answers or private situation. ${accountNow().locked?'Your saved work is locked; finish without saving or unlock it in You.':'Only an explicit save records completion, using your existing private learning record.'}</p>`:''}
      <p class="ns-lesson-status" role="status" aria-live="polite">${esc(notice)}</p>
      <footer class="ns-lesson-footer"><p>This fictional scenario teaches reasoning about uncertainty. It does not assess your psychological traits or predict another person's motives.</p></footer></div>`;
    root.querySelector('[data-lesson-back]')?.addEventListener('click',()=>{if(index>0){index--;notice='';paint({focus:true});}});
    root.querySelector('[data-lesson-next]')?.addEventListener('click',()=>{if(step.kind==='question'&&!answers[step.id])return;if(index<lesson.steps.length-1){index++;notice='';paint({focus:true});}});
    root.querySelectorAll('[data-lesson-choice]').forEach(btn=>btn.addEventListener('click',()=>{
      const selected=btn.dataset.lessonChoice;
      if(!step.choices.some(c=>c.id===selected))return;
      answers[step.id]=selected;
      root.querySelectorAll('[data-lesson-choice]').forEach(b=>{
        const current=b.dataset.lessonChoice===selected;
        b.setAttribute('aria-pressed',String(current));b.classList.toggle('is-selected',current);
        b.querySelector('.ns-lesson-choice__mark').textContent=current?'✓':'○';
      });
      const feedback=step.feedback[selected],slot=root.querySelector('[data-lesson-feedback]');
      slot.hidden=false;slot.innerHTML=`<strong>${esc(feedback.heading)}</strong><p>${esc(feedback.text)}</p>`;
      root.querySelector('[data-lesson-next]').disabled=false;
      // Reveal feedback on short screens without moving keyboard focus.
      slot.scrollIntoView?.({block:'nearest',behavior:'auto'});
    }));
    root.querySelector('[data-lesson-save]')?.addEventListener('click',()=>{
      const result=saveLesson(accountNow(),lesson);notice=result.message;
      const status=root.querySelector('.ns-lesson-status');status.textContent=notice;
      if(result.ok){const save=root.querySelector('[data-lesson-save]');save.textContent='Completion saved ✓';save.disabled=true;}
    });
    if(focus){const h=root.querySelector('#ns-lesson-step-title');h?.setAttribute('tabindex','-1');h?.focus({preventScroll:true});root.closest('main')?.scrollIntoView({block:'start',behavior:'instant'});}
  }
  paint();
}
