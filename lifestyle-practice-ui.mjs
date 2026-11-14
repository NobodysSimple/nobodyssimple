import {escapeHTML as esc} from './core.mjs';
import {goodDeeds} from './lifestyle-deeds.mjs';
import {
 PRACTICE_KEY,normalisePractice,ensureDailyPractice,choosePracticeIdentity,
 choosePracticeSkills,choosePracticeFocus,choosePracticeLevel,
 anotherPractice,completePractice,undoPractice,practiceLevel,practiceSummary,
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
 const done=Boolean(today.done);
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
 return `<div class="life-practice-current">
  <div class="life-practice-persona"><span class="life-practice-kicker">THE PERSON YOU ARE BECOMING</span><strong>${esc(identity.label)}</strong><small>${esc(identity.description)}</small></div>
  <div class="life-practice-today-label"><span>Today you're developing</span><strong>${esc(skill.name)}</strong></div>
  <div class="life-practice-tags">${skill.supports.map(s=>`<span>${esc(s)}</span>`).join('')}<span>Practice level ${today.level} of 4</span></div>
  ${chooseFocus}
  <div class="life-practice-action ${done?'is-complete':''}">
   <p class="life-practice-kicker">${done?'PRACTICE RECORDED':task.source==='kindness'?'AN ACT FOR SOMEONE ELSE':'TODAY’S SMALL PRACTICE'}</p>
   <p class="life-practice-task">${esc(task.task)}</p>
   <p class="life-practice-why">${esc(skill.why)}</p>
  </div>
  ${done?`<div class="life-practice-complete" role="status"><strong>${esc(skill.name)} · +1 practice recorded</strong>
   <p>You practised this skill today. A new suggestion will appear on your next local day. No streak to protect.</p>
   <button type="button" class="life-practice-plain" data-practice-undo>Undo completion</button></div>`
   :`<div class="life-practice-actions">
   <button type="button" class="button" data-practice-done>I practised this</button>
   <button type="button" class="button secondary" data-practice-next>Another idea</button>
   ${kindnessAvailable(skill.id)?'<button type="button" class="life-practice-plain" data-practice-kindness>Try a kindness idea</button>':''}
   </div>
   <p class="life-practice-note">No need to force a task that does not suit your circumstances. Choose another, take it more gently or skip today.</p>`}
  <details class="life-practice-levels"><summary>Choose how challenging this feels</summary>
   <p class="life-practice-note">Levels describe the task, not your ability. The default moves gradually with practice, and you can pick an easier option at any point.</p>
   <div class="life-practice-level-grid" role="group" aria-label="Practice difficulty">
   ${levelDescriptions.map((title,i)=>`<button type="button" data-practice-level="${i+1}"
    aria-pressed="${practiceLevel(state,skill.id)===i+1}" ${done?'disabled':''}
    class="${practiceLevel(state,skill.id)===i+1?'is-selected':''}"><b>Level ${i+1}</b><span>${esc(title)}</span></button>`).join('')}</div>
  </details>
  ${selector}
  ${progressMarkup(state)}
  <p class="life-practice-note">This is optional everyday practice, not an exposure treatment plan. Keep necessary safety checks and respect your capacity, access needs and real-world responsibilities.</p>
 </div>`;
}

export function mountLifestylePractice(container,{signal}={}){
 if(!container)return;
 let state=ensureDailyPractice(read(),new Date());
 const status=message=>{const node=container.querySelector('[data-practice-status]');if(node)node.textContent=message;};
 const render=()=>{
  container.innerHTML=`${practiceDisplay(state)}<p class="life-practice-status" role="status" aria-live="polite" data-practice-status></p>`;
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
 },{signal});
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
