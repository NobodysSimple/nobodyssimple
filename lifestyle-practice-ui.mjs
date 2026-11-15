import {escapeHTML as esc} from './core.mjs';
import {goodDeeds} from './lifestyle-deeds.mjs';
import {
 PRACTICE_KEY,normalisePractice,ensureDailyPractice,choosePracticeIdentity,
 choosePracticeSkills,choosePracticeFocus,choosePracticeLevel,
 anotherPractice,completePractice,undoPractice,pausePractice,resumePractice,practiceLevel,practiceSummary,
 practiceIdentities,practiceSkills,practiceSkillMap,practiceIdentityMap,getPracticeTask,dateKey
} from './lifestyle-practice.mjs';

const skillGroups=['Relationships','Inner skills','Anxiety skills','Attention skills'];
const levelDescriptions=['Gentle start','Try a little more','Use it in real life','Stretch when ready'];
const read=()=>{try{return normalisePractice(JSON.parse(localStorage.getItem(PRACTICE_KEY)||'null'));}catch{return normalisePractice(null);}};
const store=state=>localStorage.setItem(PRACTICE_KEY,JSON.stringify(state));
const kindnessAvailable=id=>goodDeeds.some(deed=>(
 id==='communication'&&deed.category==='Reach out'||
 id==='gratitude'&&deed.category==='Notice and thank'||
 id==='compassion'&&['Make life easier','Share something useful','Community care','Care for the environment','Make things more inclusive','Small kindness'].includes(deed.category)
));

function identityChoices(current){
 return `<div class="life-practice-identities" role="group" aria-label="Choose an identity direction">
 ${practiceIdentities.map(id=>`<button type="button" class="life-practice-identity ${id.id===current?'is-selected':''}"
 data-practice-identity="${esc(id.id)}" aria-pressed="${id.id===current}">
 <strong>${esc(id.label)}</strong><span>${esc(id.description)}</span></button>`).join('')}
 </div>`;
}
function skillChoices(selected){
 return skillGroups.map(domain=>`<div class="life-practice-skill-group"><h4>${esc(domain)}</h4><div class="life-practice-skill-grid">
 ${practiceSkills.filter(item=>item.domain===domain).map(item=>`<label class="life-practice-skill">
 <input type="checkbox" data-practice-skill="${esc(item.id)}" value="${esc(item.id)}" ${selected.includes(item.id)?'checked':''}>
 <span><strong>${esc(item.name)}</strong><small>${esc(item.supports.join(' · '))}</small></span>
 </label>`).join('')}</div></div>`).join('');
}
function progressMarkup(state){
 const summary=practiceSummary(state);
 return `<section class="life-practice-progress" aria-label="Your practice record">
  <div class="life-practice-progress-head"><strong>Your practice record</strong><span>${summary.total} ${summary.total===1?'practice':'practices'} recorded</span></div>
  <div class="life-practice-progress-list">${summary.selected.map(item=>`<span class="life-practice-progress-item">
   <b>${esc(item.label)}</b><small>${item.count} completed · Suggested level ${Math.min(4,1+Math.floor(item.count/3))}</small>
  </span>`).join('')}</div>
  <p class="life-practice-note">These counts show actions you recorded, not a psychological ability score. Missed days do not erase progress.</p>
 </section>`;
}
function practiceDisplay(state){
 const id=state.identityId;
 if(!id){
  return `<div class="life-mission-onboarding">
   <p class="life-mission-overline">YOUR NEXT CHAPTER</p>
   <h3>Who would you like to become?</h3>
   <p>Choose a direction. Each day, you'll get one small real-life action to try.</p>
   ${identityChoices(null)}
   <p class="life-practice-note">You can change direction later. There are no streaks to maintain.</p>
  </div>`;
 }
 const identity=practiceIdentityMap.get(id),today=state.today,task=getPracticeTask(state);
 const skill=practiceSkillMap.get(today?.skillId);
 if(!today||!task||!skill)return '<p class="life-practice-note">Choose a direction to begin.</p>';
 const done=Boolean(today.done),paused=Boolean(today.paused&&!done);
 const total=practiceSummary(state).total;
 const chapter=total===0?1:Math.ceil(total/7);
 const inChapter=total===0?0:((total-1)%7)+1;
 const common=['communication','presence','vulnerability','boundaries','courage','self-trust','emotional-awareness','compassion','acceptance'];
 const featured=[...new Set([skill.id,...identity.skills,...common])].filter(key=>practiceSkillMap.has(key)).slice(0,9);
 const other=practiceSkills.filter(item=>!featured.includes(item.id)).map(item=>item.id);
 const skillButton=key=>{
  const entry=practiceSkillMap.get(key),active=key===skill.id;
  return `<button type="button" class="life-mission-skill ${active?'is-current':''}"
   data-practice-focus="${esc(key)}" aria-pressed="${active}" ${done?'disabled':''}
   title="${esc(entry.becoming)}">${active?'<span aria-hidden="true">✓</span>':''}${esc(entry.name)}</button>`;
 };
 const milestoneItems=Array.from({length:7},(_,index)=>{
  const step=index+1,achieved=step<=inChapter,next=step===inChapter+1;
  return `<li class="life-mission-step ${achieved?'is-done':next?'is-next':''}" aria-label="Practice ${step}: ${achieved?'recorded':next?'next milestone':'not yet recorded'}">
   <span class="life-mission-step-dot" aria-hidden="true">${achieved?'✓':step===7?'✧':''}</span>
   <small>Step ${step}</small>
  </li>`;
 }).join('');
 const taskControl=done
  ?'<button type="button" class="life-mission-check is-done" data-practice-undo aria-pressed="true" aria-label="Undo today’s completed mission">✓</button>'
  :paused
  ?'<button type="button" class="life-mission-check" data-practice-resume aria-label="Resume today’s mission">↻</button>'
  :'<button type="button" class="life-mission-check" data-practice-done aria-pressed="false" aria-label="Mark today’s mission complete"><span aria-hidden="true">✓</span></button>';
 const actionButton=done
  ?'<button type="button" class="life-mission-done-button is-done" data-practice-undo>✓ Completed · Undo</button>'
  :paused
  ?'<button type="button" class="life-mission-done-button" data-practice-resume>Resume mission</button>'
  :'<button type="button" class="life-mission-done-button" data-practice-done>✓ Mark done</button>';
 const alternatives=done
  ?'<p class="life-mission-feedback" role="status">Recorded for today. Another small step is ready tomorrow.</p>'
  :paused
  ?'<p class="life-mission-feedback" role="status">Taking today off is fine. Your previous progress is still here.</p>'
  :`<div class="life-mission-alternatives">
    <button type="button" data-practice-next>↻ Another idea</button>
    ${kindnessAvailable(skill.id)?'<button type="button" data-practice-kindness>Try a kindness idea</button>':''}
    <button type="button" data-practice-pause>Skip today</button>
   </div>`;
 return `<div class="life-mission-shell">
  <div class="life-mission-scene">
   <div class="life-mission-identity">
    <p class="life-mission-overline">YOUR IDENTITY GOAL</p>
    <h3>${esc(identity.label)}</h3>
    <p>${esc(identity.description)}</p>
   </div>
  </div>
  <section class="life-mission-focus" aria-label="Choose today's skill">
   <div class="life-mission-focus-top"><span class="life-mission-overline">PRACTISE A SKILL</span><small>Choose what matters today</small></div>
   <div class="life-mission-skills">${featured.map(skillButton).join('')}</div>
   <details class="life-mission-more">
    <summary>View all 16 skills <span aria-hidden="true">⌄</span></summary>
    <div class="life-mission-skills">${other.map(skillButton).join('')}</div>
   </details>
  </section>
  <div class="life-mission-task" aria-label="Today's real-life mission">
    ${taskControl}
    <div class="life-mission-task-copy">
     <span class="life-mission-overline">TODAY'S MISSION · ${esc(skill.name.toUpperCase())}</span>
     <p class="life-mission-task-text ${done?'is-done':''}">${esc(task.task)}</p>
    </div>
    ${actionButton}
  </div>
  <div class="life-mission-below-task">${alternatives}</div>
  <section class="life-mission-progress" aria-label="Recorded practice journey">
   <div class="life-mission-progress-intro">
    <span class="life-mission-sprout" aria-hidden="true">❧</span>
    <div><h3>Field mission progress</h3><p>${total} recorded ${total===1?'practice':'practices'} · No streak required</p></div>
   </div>
   <div class="life-mission-progress-path">
    <span class="life-mission-chapter">Chapter ${chapter}</span>
    <ol class="life-mission-steps">${milestoneItems}</ol>
   </div>
  </section>
  <details class="life-mission-settings">
   <summary>Personalise my missions <span aria-hidden="true">⌄</span></summary>
   <div class="life-mission-settings-content">
    <details class="life-practice-levels">
     <summary>Change today's difficulty</summary>
     <p class="life-practice-note">Four optional levels change the task, not your ability. You can always choose an easier option.</p>
     <div class="life-practice-level-grid" role="group" aria-label="Practice difficulty">
      ${levelDescriptions.map((label,i)=>`<button type="button" data-practice-level="${i+1}" aria-pressed="${practiceLevel(state,skill.id)===i+1}" ${done?'disabled':''} class="${practiceLevel(state,skill.id)===i+1?'is-selected':''}"><b>Level ${i+1}</b><span>${esc(label)}</span></button>`).join('')}
     </div>
    </details>
    <details class="life-practice-custom">
     <summary>Change my identity goal and saved skills</summary>
     <p class="life-practice-note">The skill buttons above set today's focus. You can also choose which one to three skills rotate automatically on future days.</p>
     ${identityChoices(id)}
     <fieldset class="life-practice-skills-field"><legend>Skills to rotate <small>(choose 1–3)</small></legend>${skillChoices(state.skillIds)}</fieldset>
    </details>
    <details class="life-deed-record"><summary>View my recorded practice history</summary>${progressMarkup(state)}</details>
   </div>
  </details>
  <p class="life-mission-footnote">This is optional everyday practice, not a measure of personal worth. Skipping a day never erases progress.</p>
 </div>`;
}

export function mountLifestylePractice(container,{signal}={}){
 if(!container)return;
 let state=ensureDailyPractice(read(),new Date());
 let prefsOpen=false,levelsOpen=false,settingsOpen=false,moreSkillsOpen=false;
 const status=message=>{const node=container.querySelector('[data-practice-status]');if(node)node.textContent=message;};
 const render=()=>{
  container.innerHTML=`${practiceDisplay(state)}<p class="life-practice-status" role="status" aria-live="polite" data-practice-status></p>`;
  const prefs=container.querySelector('.life-practice-custom'),levels=container.querySelector('.life-practice-levels');
  if(prefs)prefs.open=prefsOpen;
  if(levels)levels.open=levelsOpen;
  const settings=container.querySelector('.life-mission-settings'),more=container.querySelector('.life-mission-more');
  if(settings)settings.open=settingsOpen;
  if(more)more.open=moreSkillsOpen;
 };
 const apply=action=>{
  const next=action(ensureDailyPractice(state,new Date()));
  try{store(next);state=next;render();}
  catch{status('The change could not be saved. Check Account to unlock saved work, or free up storage.');}
 };
 const refresh=()=>{
  const incoming=ensureDailyPractice(read(),new Date());
  if(JSON.stringify(incoming)!==JSON.stringify(state)){
   try{store(incoming);state=incoming;render();}catch{state=incoming;render();status('Saving is currently unavailable.');}
  }
 };
 render();
 container.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||!container.contains(button))return;
  if(button.dataset.practiceIdentity){apply(s=>choosePracticeIdentity(s,button.dataset.practiceIdentity));return;}
  if(button.dataset.practiceFocus){
   const selected=button.dataset.practiceFocus;
   apply(s=>{
    if(s.today?.done)return s;
    // A new focus is saved as one of up to two preferred rotating skills.
    // Older accounts may contain three; historical counts and achievements remain untouched.
    const recent=[selected,...s.skillIds.filter(id=>id!==selected)].slice(0,2);
    const withSkill=choosePracticeSkills(s,recent);
    return choosePracticeFocus(withSkill,selected);
   });
   return;
  }
  if(button.dataset.practiceLevel){apply(s=>choosePracticeLevel(s,s.today?.skillId,Number(button.dataset.practiceLevel)));return;}
  if(button.hasAttribute('data-practice-next')){apply(s=>anotherPractice(s));return;}
  if(button.hasAttribute('data-practice-kindness')){apply(s=>anotherPractice(s,new Date(),{kindness:true}));return;}
  if(button.hasAttribute('data-practice-done')){apply(s=>completePractice(s));return;}
  if(button.hasAttribute('data-practice-undo')){apply(s=>undoPractice(s));return;}
  if(button.hasAttribute('data-practice-pause')){apply(s=>pausePractice(s));return;}
  if(button.hasAttribute('data-practice-resume')){apply(s=>resumePractice(s));return;}
 },{signal});
 container.addEventListener('toggle',event=>{
  if(event.target.matches('.life-practice-custom'))prefsOpen=event.target.open;
  if(event.target.matches('.life-practice-levels'))levelsOpen=event.target.open;
  if(event.target.matches('.life-mission-settings'))settingsOpen=event.target.open;
  if(event.target.matches('.life-mission-more'))moreSkillsOpen=event.target.open;
 },{capture:true,signal});
 container.addEventListener('change',event=>{
  const control=event.target;
  if(!control.matches('[data-practice-skill]'))return;
  const skillId=control.dataset.practiceSkill;
  let next=control.checked?[...state.skillIds,skillId]:state.skillIds.filter(id=>id!==skillId);
  if(next.length>3||next.length<1){
   control.checked=!control.checked;
   status('Choose between one and three skills.');return;
  }
  apply(s=>choosePracticeSkills(s,next));
 },{signal});
 window.addEventListener('focus',refresh,{signal});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();},{signal});
 window.addEventListener('storage',event=>{if(event.key===PRACTICE_KEY)refresh();},{signal});
 const interval=setInterval(()=>{if(!document.hidden)refresh();},60000);
 if(signal)signal.addEventListener('abort',()=>clearInterval(interval),{once:true});
 return {refresh,destroy:()=>clearInterval(interval)};
}
