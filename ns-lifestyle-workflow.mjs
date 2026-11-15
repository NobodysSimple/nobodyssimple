/**
 * Task-first Lifestyle workspace. Forms and persistence remain in lifestyle.mjs.
 * The unified Daily Check-in is global; reminders stay local to this view.
 */
import {updateDailyCheckinButtons} from './ns-daily-checkin.mjs';

export function organiseLifestyle(root,{showMode,signal}={}){
 const $=selector=>root.querySelector(selector);
 const flow=$('.life-dashboard-flow');
 const calendar=$('#lifestyle-calendar');
 const tasks=$('#lifestyle-tasks');
 const practice=$('#lifestyle-deed');
 const reminders=$('#lifestyle-reminders');
 const strip=$('.life-today-strip');
 const page=$('.life-unified');
 if(!flow||!calendar||!tasks||!practice||!reminders||!strip||!page)return;

 // Keep secondary utilities available without duplicating the main check-in action.
 const actions=document.createElement('div');
 actions.className='life-daily-actions life-daily-utilities';
 actions.setAttribute('aria-label','Breathing and reminder settings');
 actions.innerHTML='<div class="life-daily-secondary">'+
  '<button type="button" class="life-daily-breathe" data-life-breathe>✦ 2 min breathing</button>'+
  '<button type="button" class="life-daily-reminders" data-life-reminders aria-haspopup="dialog">♧ Reminders</button>'+
  '</div>';
 strip.after(actions);
 updateDailyCheckinButtons();

 // The notification settings are removed from the document flow, not deleted.
 const reminderDialog=document.createElement('dialog');
 reminderDialog.className='life-reminder-dialog';
 reminderDialog.setAttribute('aria-labelledby','lifestyle-reminders-title');
 const header=document.createElement('div');
 header.className='life-reminder-modal-head';
 header.innerHTML='<strong>Reminder settings</strong><button type="button" data-life-reminders-close aria-label="Close reminder settings">×</button>';
 reminderDialog.append(header,reminders);
 page.append(reminderDialog);
 let trigger=null;
 reminderDialog.addEventListener('click',event=>{
  if(event.target===reminderDialog)reminderDialog.close();
  if(event.target.closest('[data-life-reminders-close]'))reminderDialog.close();
 });
 reminderDialog.addEventListener('close',()=>{if(trigger?.isConnected)trigger.focus({preventScroll:true});});
 if(signal)signal.addEventListener('abort',()=>{if(reminderDialog.open)reminderDialog.close();},{once:true});

 // Keep calendar and tasks together. Identity mission follows as the day's practice.
 flow.append(calendar,tasks,practice);
 // The original task form handles all submits; advanced fields remain available.
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
 const goTo=selector=>{
  const node=$(selector);
  if(node)node.scrollIntoView({
   behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',
   block:'start'
  });
 };
 actions.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if(!button)return;
  if(button.hasAttribute('data-life-reminders')){
   trigger=button;
   if(!reminderDialog.open)reminderDialog.showModal();
  }else if(button.hasAttribute('data-life-breathe')){
   if(typeof showMode==='function')showMode('focus');
   const host=$('[data-life-focus-host]');
   host?.querySelector('[data-breath-minutes="2"]')?.click();
   requestAnimationFrame(()=>goTo('.life-focus-host .timed-breathing-card'));
  }
 },{signal});
 root.addEventListener('click',event=>{
  if(event.target.closest('[data-add-selected-date]')&&options)options.open=true;
 },{signal});
}
