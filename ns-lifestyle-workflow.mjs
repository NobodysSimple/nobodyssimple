/**
 * Lifestyle's task-first daily workspace.
 * This is a presentation/interaction layer: existing form IDs, event handlers,
 * persistence and SimplyFocus lifecycle remain owned by their original modules.
 */
export function organiseLifestyle(root,{showMode,signal}={}){
 const $=selector=>root.querySelector(selector);
 const flow=$('.life-dashboard-flow');
 const checkin=$('#lifestyle-checkin');
 const calendar=$('#lifestyle-calendar');
 const tasks=$('#lifestyle-tasks');
 const practice=$('#lifestyle-deed');
 const reminders=$('#lifestyle-reminders');
 const strip=$('.life-today-strip');
 if(!flow||!checkin||!calendar||!tasks||!practice||!reminders||!strip)return;

 // A quick emotional arrival is offered before planning, never required.
 const arrival=document.createElement('section');
 arrival.className='life-arrival';
 arrival.setAttribute('aria-label','Before you plan');
 arrival.innerHTML=
  '<div class="life-arrival-copy"><span class="life-arrival-mark" aria-hidden="true">✦</span>'+
   '<div><p class="eyebrow">FIRST, ARRIVE</p><h2>How are you arriving today?</h2>'+
   '<p>Take a moment if it helps, or head straight to your plans.</p></div></div>'+
  '<div class="life-arrival-actions">'+
   '<button type="button" class="life-arrival-primary" data-life-checkin>Check in <span aria-hidden="true">↗</span></button>'+
   '<button type="button" data-life-breathe>Breathe for 2 min</button>'+
   '<a href="#compass">Emotion Compass <span aria-hidden="true">↗</span></a></div>';
 strip.before(arrival);
 // The mission stays discoverable even when planning occupies the first screen.
 const missionJump=document.createElement('button');
 missionJump.type='button';
 missionJump.className='life-mission-jump';
 missionJump.textContent='✦ View my field mission';
 strip.querySelector('.life-today-head')?.append(missionJump);

 const checkDrawer=document.createElement('details');
 checkDrawer.className='life-checkin-drawer';
 checkDrawer.id='life-checkin-drawer';
 checkDrawer.innerHTML='<summary><span class="life-drawer-icon" aria-hidden="true">♡</span><span><strong>My emotional check-in</strong><small>Choose how you feel; reflection is optional</small></span><span class="life-drawer-chevron" aria-hidden="true">⌄</span></summary>';
 checkDrawer.append(checkin);
 arrival.after(checkDrawer);

 // Dates and tasks share one first-row workspace. Practice is a feature, not an obstacle.
 flow.append(calendar,tasks,practice);
 const settings=document.createElement('details');
 settings.className='life-settings-drawer';
 settings.innerHTML='<summary><span class="life-drawer-icon" aria-hidden="true">♧</span><span><strong>Check-in reminders</strong><small>Optional times and device notifications</small></span><span class="life-drawer-chevron" aria-hidden="true">⌄</span></summary>';
 settings.append(reminders);
 flow.append(settings);

 // One-line task entry by default; all original scheduling controls stay available.
 const form=$('#lifestyle-task-form');
 const title=form?.querySelector('#lifestyle-task-title')?.closest('.field');
 const add=form?.querySelector('button[type="submit"]');
 if(form&&title&&add){
  const advanced=document.createElement('details');
  advanced.className='life-task-options';
  advanced.innerHTML='<summary>Schedule, priority & notes <span aria-hidden="true">⌄</span></summary>';
  const wrap=document.createElement('div');
  wrap.className='life-task-options-grid';
  Array.from(form.children).filter(node=>node!==title&&node!==add).forEach(node=>wrap.append(node));
  advanced.append(wrap);
  form.append(advanced);
  form.classList.add('life-task-quick-form');
 }
 const options=form?.querySelector('.life-task-options');
 missionJump.addEventListener('click',()=>goTo('#lifestyle-deed'),{signal});
 const goTo=(selector)=>{const node=$(selector);if(node){node.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}};

 arrival.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button)return;
  if(button.hasAttribute('data-life-checkin')){
   checkDrawer.open=true;
   goTo('#life-checkin-drawer');
   const first=checkDrawer.querySelector('input[name="lifestyle-emotion"]');
   if(first)first.focus({preventScroll:true});
  }
  if(button.hasAttribute('data-life-breathe')){
   if(typeof showMode==='function')showMode('focus');
   const focusHost=$('[data-life-focus-host]');
   const length=focusHost?.querySelector('[data-breath-minutes="2"]');
   length?.click();
   requestAnimationFrame(()=>goTo('.life-focus-host .timed-breathing-card'));
  }
 },{signal});
 // Calendar's add-to-date button opens the date controls so the chosen date is visible.
 root.addEventListener('click',event=>{
  if(event.target.closest('[data-add-selected-date]')&&options){options.open=true;}
 },{signal});
}
