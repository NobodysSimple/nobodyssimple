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
  return `<div class="life-practice-onboarding">
   <p class="life-practice-intro">Who are you trying to become? Choose a direction. You'll get one small, practical action aligned with that goal.</p>
   ${identityChoices(null)}
   <p class="life-practice-note">Nothing is scored or required. Choose the direction that feels useful right now; you can change it later.</p>
  </div>`;
 }
 const identity=practiceIdentityMap.get(id),today=state.today,task=getPracticeTask(state);
 const skill=practiceSkillMap.get(today?.skillId),total=state.counts[today?.skillId]||0;
 if(!today||!task||!skill)return '<p class="life-practice-note">Choose a skill to start your daily practice.</p>';
 const done=Boolean(today.done),paused=Boolean(today.paused&&!done);
 const completed=practiceSummary(state).total;
 const milestones=[
  {at:1,label:'First step',mark:'✦'},
  {at:3,label:'Taking root',mark:'❧'},
  {at:7,label:'Growing',mark:'❀'},
  {at:15,label:'In bloom',mark:'✿'}
 ];
 const milestoneMarkup=milestones.map(item=>`<div class="life-practice-milestone ${completed>=item.at?'is-earned':''}" aria-label="${esc(item.label)}, ${completed>=item.at?'earned':'not yet earned'}">
  <span class="symbol" aria-hidden="true">${item.mark}</span><span>${esc(item.label)}<small>${item.at} recorded ${item.at===1?'practice':'practices'}</small></span></div>`).join('');
 const trailMarkup=[1,2,3,4].map(level=>`<span class="life-practice-trail-step ${level===today.level?'is-current':level<today.level?'is-passed':''}">
  <b>${level}</b><span>${esc(levelDescriptions[level-1])}</span></span>`).join('');
 const selector=`<details class="life-practice-custom">
  <summary>Change my direction or skills</summary>
  <p class="life-practice-note">Pick an identity as a starting point, then select one to three skills. Your next practice will follow your choices.</p>
  ${identityChoices(id)}
  <fieldset class="life-practice-skills-field"><legend>Skills I'd like to strengthen <small>(choose 1–3)</small></legend>
  ${skillChoices(state.skillIds)}</fieldset>
  <p class="life-practice-note">Your current skills: ${esc(state.skillIds.map(s=>practiceSkillMap.get(s)?.name).join(', '))}.</p>
 </details>`;
 const chooseFocus=state.skillIds.length>1
  ?`<div class="life-practice-focus" role="group" aria-label="Choose today's skill">
   ${state.skillIds.map(skillId=>`<button type="button" data-practice-focus="${esc(skillId)}"
     class="life-practice-chip ${skillId===skill.id?'is-selected':''}" aria-pressed="${skillId===skill.id}" ${done?'disabled':''}>${esc(practiceSkillMap.get(skillId).name)}</button>`).join('')}
   </div>`:''; 
 const nextMilestone=milestones.find(item=>completed<item.at);
 const previousMilestone=[...milestones].reverse().find(item=>completed>=item.at)?.at||0;
 const target=nextMilestone?.at||milestones[milestones.length-1].at;
 const progressPercent=nextMilestone?Math.round(((completed-previousMilestone)/(target-previousMilestone))*100):100;
 const trailTitle=done?'Completed for today':paused?'Resting today':'Your daily deed';
 const actions=paused
  ?`<div class="life-deed-result" role="status"><strong>Taking today off is fine.</strong><p>Nothing is lost. Your progress stays here when you return.</p><button type="button" class="life-practice-plain" data-practice-resume>Show today's deed</button></div>`
  :done
  ?`<div class="life-deed-result is-success" role="status"><strong>✦ Your deed is recorded</strong><p>One more action towards the person you're becoming. A new idea will appear tomorrow.</p><button type="button" class="life-practice-plain" data-practice-undo>Undo completion</button></div>`
  :`<div class="life-deed-cta">
   <button type="button" class="button life-deed-complete-button" data-practice-done>✓ I did this today</button>
   <button type="button" class="button secondary" data-practice-next>↻ Another idea</button>
   <button type="button" class="life-practice-plain" data-practice-pause>Skip today</button>
   ${kindnessAvailable(skill.id)?'<button type="button" class="life-practice-plain" data-practice-kindness>Try a kindness deed</button>':''}
  </div>`;
 return `<div class="life-practice-current life-deed-quest">
  <div class="life-deed-identity">
   <p class="life-practice-kicker">THE PERSON YOU ARE BECOMING</p>
   <h3>${esc(identity.label)}</h3>
   <p>${esc(identity.description)}</p>
   <span class="life-deed-current-skill">✦ Practising ${esc(skill.name)}</span>
  </div>
  <div class="life-deed-layout">
   <section class="life-deed-main" aria-labelledby="life-deed-mission-title">
    <div class="life-deed-paper">
     <div class="life-deed-paper-top"><span class="life-deed-seal" aria-hidden="true">✿</span><div><span class="life-practice-kicker">TODAY'S DEED</span><h3 id="life-deed-mission-title">${trailTitle}</h3></div><span class="life-deed-level">Level ${today.level}/4</span></div>
     <div class="life-practice-action ${done?'is-complete':''}">
      <p class="life-practice-task">${esc(task.task)}</p>
      <p class="life-practice-why">${esc(skill.why)}</p>
     </div>
     ${actions}
    </div>
    <div class="life-deed-change-focus">
     <span>Today's skill</span>${chooseFocus||'<strong>'+esc(skill.name)+'</strong>'}
    </div>
   </section>
   <aside class="life-deed-journey" aria-labelledby="life-deed-journey-title">
    <div class="life-deed-journey-top">
     <div><p class="life-practice-kicker">YOUR GROWING RECORD</p><h3 id="life-deed-journey-title">The little things add up.</h3></div>
     <span class="life-deed-count">${completed} <small>recorded</small></span>
    </div>
    <div class="life-deed-growth" aria-label="Practice milestone progression">
     <div class="life-deed-growth-track" role="progressbar" aria-valuemin="0" aria-valuemax="${target-previousMilestone}" aria-valuenow="${completed-previousMilestone}" aria-label="Practices towards next milestone"><span style="width:${progressPercent}%"></span></div>
     <p>${nextMilestone?`${nextMilestone.at-completed} more ${nextMilestone.at-completed===1?'practice':'practices'} until ${esc(nextMilestone.label.toLowerCase())}`:'You have reached every milestone. Keep practising at your own pace.'}</p>
    </div>
    <div class="life-deed-milestones" aria-label="Recorded-practice milestones">${milestoneMarkup}</div>
    <details class="life-practice-levels">
     <summary>✦ Adjust the challenge <span aria-hidden="true">⌄</span></summary>
     <p class="life-practice-note">These four levels describe different tasks, not your ability. Choose what suits your circumstances.</p>
     <div class="life-practice-level-grid" role="group" aria-label="Practice difficulty">
      ${levelDescriptions.map((title,i)=>`<button type="button" data-practice-level="${i+1}" aria-pressed="${practiceLevel(state,skill.id)===i+1}" ${done?'disabled':''} class="${practiceLevel(state,skill.id)===i+1?'is-selected':''}"><b>Level ${i+1}</b><span>${esc(title)}</span></button>`).join('')}
     </div>
    </details>
   </aside>
  </div>
  <div class="life-deed-bottom">
   ${selector}
   <details class="life-deed-record"><summary>View my practice history <span aria-hidden="true">⌄</span></summary>${progressMarkup(state)}</details>
  </div>
  <p class="life-practice-note life-deed-footnote">This is optional everyday practice. Missed days do not erase progress, and recorded actions are not a measure of psychological ability.</p>
 </div>`;
}

export function mountLifestylePractice(container,{signal}={}){
 if(!container)return;
 let state=ensureDailyPractice(read(),new Date());
 let prefsOpen=false,levelsOpen=false;
 const status=message=>{const node=container.querySelector('[data-practice-status]');if(node)node.textContent=message;};
 const render=()=>{
  container.innerHTML=`${practiceDisplay(state)}<p class="life-practice-status" role="status" aria-live="polite" data-practice-status></p>`;
  const prefs=container.querySelector('.life-practice-custom'),levels=container.querySelector('.life-practice-levels');
  if(prefs)prefs.open=prefsOpen;
  if(levels)levels.open=levelsOpen;
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
  if(button.dataset.practiceFocus){apply(s=>choosePracticeFocus(s,button.dataset.practiceFocus));return;}
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
