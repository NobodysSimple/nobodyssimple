import {resourceMarkup,uiSymbol} from './ui-resources.mjs';
import {goodDeeds} from './lifestyle-deeds.mjs';
import {renderSimplyFocus} from './simplyfocus.mjs';
import {addLifestyleTask,moveLifestyleToFocus,moveFocusToLifestyle,readFocusBoard,readLifestyleTasks,writeLifestyleTasks} from './lifestyle-storage.mjs';
import {readLifestyleReminders,writeLifestyleReminders} from './lifestyle-reminders.mjs';
import {escapeHTML as esc} from './core.mjs';

const emotionKey='ns-lifestyle-emotions-v1',deedKey='ns-lifestyle-deed-v1';
const emotions=[
 ['steady','Steady','◉',2],['glad','Glad','☀',3],['hopeful','Hopeful','✦',3],['energised','Energised','↗',3],
 ['tired','Tired','☾',-1],['sad','Sad','◡',-2],['worried','Worried','≈',-2],['angry','Angry','⌁',-2],['overwhelmed','Overwhelmed','≋',-3],['numb','Numb','○',-1],['mixed','Mixed','◐',0],['unsure','Unsure','?',0]
];
const emotionMap=new Map(emotions.map(item=>[item[0],item]));
const readJSON=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback}catch{return fallback}};
const localDate=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const monthTitle=date=>date.toLocaleDateString(undefined,{month:'long',year:'numeric'});
const timeOfDay=hour=>hour<12?'morning':hour>=18?'evening':'daytime';
const greeting=hour=>hour<12?'Good morning.':hour>=18?'Good evening.':'How is your day going?';
const readEmotions=()=>{const value=readJSON(emotionKey,[]);return Array.isArray(value)?value:[]};
const writeEmotions=items=>localStorage.setItem(emotionKey,JSON.stringify(items));
const deedState=()=>readJSON(deedKey,{});
const writeDeed=value=>localStorage.setItem(deedKey,JSON.stringify(value));

function randomDeed(previous=-1){if(goodDeeds.length<2)return 0;let next=previous;while(next===previous)next=Math.floor(Math.random()*goodDeeds.length);return next;}
function todayDeed(){const today=localDate(),state=deedState();if(state.date===today&&Number.isInteger(state.index)&&goodDeeds[state.index])return state;const next={date:today,index:randomDeed(),done:false,skips:0};writeDeed(next);return next;}

export function renderLifestyle(root,view='daily'){
 root.querySelector('[data-life-focus-host]')?._nsSimplyFocusCleanup?.();
 root._lifestyleAbort?.abort();const abort=new AbortController();root._lifestyleAbort=abort;const {signal}=abort;window.addEventListener('hashchange',()=>abort.abort(),{once:true});
 if(view==='focus'){
  root.innerHTML=`<div class="wrap lifestyle-page life-focus-view">
   <header class="life-compact-heading"><p class="eyebrow">Nobody’s Simple · Lifestyle</p><h1>Your everyday space</h1><p>Plan your day or make room for a focused session.</p></header>
   <nav class="life-mode-switch" aria-label="Lifestyle modes"><a href="#lifestyle">☼ Everyday</a><a href="#lifestyle/focus" aria-current="page">◌ SimplyFocus</a></nav>
   <div class="life-focus-host" data-life-focus-host></div>
  </div>`;
  renderSimplyFocus(root.querySelector('[data-life-focus-host]'),{embedded:true});
  return;
 }
 let entries=readEmotions(),tasks=readLifestyleTasks(),calendarDate=new Date(),selectedDate=localDate(),checkMode=timeOfDay(new Date().getHours()),deed=todayDeed();
 root.innerHTML=`<div class="wrap lifestyle-page">
  <section class="lifestyle-hero"><div><p class="eyebrow">Your everyday space · Lifestyle</p><h1>${greeting(new Date().getHours())}</h1><p>A little space for you. Choose one thing to begin.</p><span class="life-date">${uiSymbol(checkMode==='evening'?'moon':'sun')}${new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})}</span></div>${resourceMarkup(checkMode==='evening'?'moment-fireside':checkMode==='morning'?'moment-hiking':'moment-reflecting','life-hero-scene')}</section>
  <nav class="life-mode-switch" aria-label="Lifestyle modes"><a href="#lifestyle" aria-current="page">☼ Everyday</a><a href="#lifestyle/focus">◌ SimplyFocus</a></nav>
  <section class="life-glance" aria-label="Today at a glance"><div class="life-glance-heading"><p class="eyebrow">AT A GLANCE</p><h2>Today, simply.</h2></div><div id="life-overview" class="life-overview"></div></section>
  <section id="lifestyle-checkin" class="lifestyle-card lifestyle-checkin" aria-labelledby="lifestyle-checkin-title">
   <div class="lifestyle-section-head"><div><p class="eyebrow">Right now</p><h2 id="lifestyle-checkin-title">${checkMode==='morning'?'Morning':checkMode==='evening'?'Evening':'Daytime'} check-in</h2><p>${checkMode==='morning'?'Arrive before you organise the day.':checkMode==='evening'?'Put down what can wait before bed.':'Notice what is here before choosing what comes next.'}</p></div><div class="lifestyle-period-switch" role="group" aria-label="Check-in type"><button type="button" data-check-mode="morning" aria-pressed="${checkMode==='morning'}">Morning</button><button type="button" data-check-mode="daytime" aria-pressed="${checkMode==='daytime'}">Day</button><button type="button" data-check-mode="evening" aria-pressed="${checkMode==='evening'}">Evening</button></div></div>
   <form id="lifestyle-checkin-form"><fieldset><legend>What feels closest?</legend><div class="emotion-choice-grid">${emotions.map(([id,label,icon])=>`<label><input type="radio" name="lifestyle-emotion" value="${id}" required><span>${resourceMarkup(({steady:"face-calm",glad:"face-happy",hopeful:"face-curious",energised:"face-surprised",tired:"face-sleepy",sad:"face-sad",worried:"face-worried",angry:"face-determined",overwhelmed:"face-worried",numb:"face-calm",mixed:"face-curious",unsure:"face-confused"})[id],"life-emotion-face")}${label}</span></label>`).join('')}</div></fieldset>
    <div class="life-checkin-detail"><p class="life-form-label">Optional details</p><div class="lifestyle-sliders"><label>Intensity <output id="lifestyle-intensity-output">5 / 10</output><input id="lifestyle-intensity" type="range" min="1" max="10" value="5"></label><label>Energy <output id="lifestyle-energy-output">5 / 10</output><input id="lifestyle-energy" type="range" min="1" max="10" value="5"></label></div>
    <label class="field">A few words <span class="fine">optional</span><textarea id="lifestyle-note" rows="3" maxlength="500" placeholder="What is shaping this moment?"></textarea></label></div><div class="lifestyle-checkin-actions"><button class="button" type="submit">Save this check-in</button><p id="lifestyle-checkin-status" role="status"></p></div>
   </form><div id="lifestyle-tool-shelf" class="lifestyle-tool-shelf"></div>
  </section>
  <div class="lifestyle-two-column">
   <section id="lifestyle-calendar" class="lifestyle-card lifestyle-calendar" aria-labelledby="lifestyle-calendar-title"><div class="calendar-head"><div><p class="eyebrow">Patterns, not scores</p><h2 id="lifestyle-calendar-title">Your month</h2></div><div><button type="button" data-calendar-move="-1" aria-label="Previous month">←</button><strong id="lifestyle-month-label"></strong><button type="button" data-calendar-move="1" aria-label="Next month">→</button></div></div><div class="calendar-weekdays" aria-hidden="true"><span style="color:var(--ns-life-readable-ink,#244735)!important">Mon</span><span style="color:var(--ns-life-readable-ink,#244735)!important">Tue</span><span style="color:var(--ns-life-readable-ink,#244735)!important">Wed</span><span style="color:var(--ns-life-readable-ink,#244735)!important">Thu</span><span style="color:var(--ns-life-readable-ink,#244735)!important">Fri</span><span style="color:var(--ns-life-readable-ink,#244735)!important">Sat</span><span style="color:var(--ns-life-readable-ink,#244735)!important">Sun</span></div><div id="lifestyle-calendar-grid" class="calendar-grid"></div><div id="lifestyle-day-detail" class="lifestyle-day-detail" aria-live="polite"></div></section>
   <section id="lifestyle-deed" class="lifestyle-card lifestyle-deed" aria-labelledby="lifestyle-deed-title"><div class="deed-heading"><span class="deed-mark">${uiSymbol('flower')}</span><div><p class="eyebrow">One good deed</p><h2 id="lifestyle-deed-title">One kind thing for today</h2></div></div><div id="lifestyle-deed-card"></div></section>
  </div>
  <section id="lifestyle-tasks" class="lifestyle-card lifestyle-tasks" aria-labelledby="lifestyle-tasks-title"><div class="lifestyle-section-head"><div><p class="eyebrow">Today and later</p><h2 id="lifestyle-tasks-title">Lifestyle task list</h2><p>Plan what matters, with the option to move a task into a focus session.</p></div></div>
   <form id="lifestyle-task-form" class="lifestyle-task-form"><label class="field">Task<input id="lifestyle-task-title" maxlength="120" required placeholder="e.g. Call the pharmacy"></label><label class="field">Date<input id="lifestyle-task-date" type="date" required value="${selectedDate}"></label><label class="field">Time <span class="fine">optional</span><input id="lifestyle-task-time" type="time"></label><label class="field lifestyle-task-notes">Notes <span class="fine">optional</span><input id="lifestyle-task-note" maxlength="500" placeholder="A useful detail or first step"></label><button class="button" type="submit">Add task</button></form>
   <div class="task-board-columns"><div><h3>Lifestyle tasks</h3><div id="lifestyle-task-list"></div></div><div><h3>Available in SimplyFocus</h3><p class="fine">Move a focus-board task here when it belongs in your calendar or daily list.</p><div id="lifestyle-focus-import"></div></div></div><p id="lifestyle-task-status" role="status"></p>
  </section>
  <section id="lifestyle-reminders" class="lifestyle-card lifestyle-reminders" aria-labelledby="lifestyle-reminders-title"><div class="lifestyle-section-head"><div><p class="eyebrow">Gentle prompts</p><h2 id="lifestyle-reminders-title">Check-in reminders</h2><p>Choose your own times. Notifications are optional and can be changed here at any time.</p></div><span class="reminder-bell">${uiSymbol('bell')}</span></div><form id="lifestyle-reminder-form"><label><input id="morning-reminder-enabled" type="checkbox"> Morning reminder</label><input id="morning-reminder-time" type="time" value="08:30" aria-label="Morning reminder time"><label><input id="evening-reminder-enabled" type="checkbox"> Evening reminder</label><input id="evening-reminder-time" type="time" value="21:00" aria-label="Evening reminder time"><button class="button" type="submit">Save reminder times</button><button class="button secondary" id="lifestyle-enable-notifications" type="button">Enable device notifications</button></form><p class="reminder-limit">Browser notifications work only on supported HTTPS browsers after permission is granted. With the current free static setup, reminders are checked while Nobody’s Simple is open or backgrounded; an exact alert is not guaranteed after the browser or installed app has been fully closed.</p><p id="lifestyle-reminder-status" role="status"></p></section>
 </div>`;

 const $=(selector)=>root.querySelector(selector);
 // One visible continuous dashboard: no sections are concealed behind tabs.
 const flow=document.createElement('div');flow.className='life-dashboard-flow';
 $('.life-glance').after(flow);
 flow.append($('#lifestyle-deed'),$('#lifestyle-checkin'),$('#lifestyle-tasks'),$('#lifestyle-calendar'),$('#lifestyle-reminders'),$('#lifestyle-tool-shelf'));
 $('.lifestyle-two-column')?.remove();
 function renderOverview(){
  const today=localDate(),latest=entries.filter(item=>item.date===today).at(-1);
  const due=tasks.filter(item=>item.date===today),done=due.filter(item=>item.done).length;
  const mood=latest&&emotionMap.get(latest.emotion);
  $('#life-overview').innerHTML=`
   <div class="life-glance-item"><span class="life-glance-icon">${uiSymbol('heart')}</span><span><small>LAST CHECK-IN</small><strong>${mood?esc(mood[1]):'Not checked in'}</strong><span>${latest?'At '+esc(latest.time):'No pressure to track your mood'}</span></span></div>
   <div class="life-glance-item"><span class="life-glance-icon">${uiSymbol('checklist')}</span><span><small>TODAY’S TASKS</small><strong>${due.length?done+' of '+due.length+' done':'Nothing scheduled'}</strong><span>${due.length?due.length-done+' left for today':'Add what matters below'}</span></span></div>`;
 }
 function toolShelf(){
  const shelves={
   morning:[['#tool/state-check','Check your capacity'],['#tool/small-step','Make the first step smaller'],['#lifestyle/focus','Start a focus session']],
   daytime:[['#tool/quick-reset','Take a brief reset'],['#tool/load-balancer','Review your load'],['#lifestyle/focus','Start a focus session']],
   evening:[['#tool/brain-dump','Unload your mind'],['#tool/worry-sort','Sort a worry'],['#lifestyle/focus','Try a quiet soundscape']]
  };
  $('#lifestyle-tool-shelf').innerHTML=`<div><p class="eyebrow">OPTIONAL NEXT STEPS</p><h3>Something else might help</h3></div><div>${shelves[checkMode].map(([href,label])=>`<a href="${href}">${esc(label)} <span aria-hidden="true">→</span></a>`).join('')}</div>`;
  root.querySelectorAll('[data-check-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.checkMode===checkMode)));
 }
 function renderCalendar(){
  const year=calendarDate.getFullYear(),month=calendarDate.getMonth(),first=new Date(year,month,1),start=(first.getDay()+6)%7,days=new Date(year,month+1,0).getDate(),previousDays=new Date(year,month,0).getDate();
  $('#lifestyle-month-label').textContent=monthTitle(calendarDate);const cells=[];
  for(let i=0;i<42;i++){const day=i-start+1;let date,muted=false;if(day<1){date=new Date(year,month-1,previousDays+day);muted=true}else if(day>days){date=new Date(year,month+1,day-days);muted=true}else date=new Date(year,month,day);const key=localDate(date),dayEntries=entries.filter(item=>item.date===key),dayTasks=tasks.filter(item=>item.date===key),values=dayEntries.map(item=>emotionMap.get(item.emotion)?.[3]||0),tone=values.length?Math.round(values.reduce((a,b)=>a+b,0)/values.length):0;cells.push(`<button type="button" class="calendar-day ${muted?'is-muted':''} ${key===localDate()?'is-today':''} ${key===selectedDate?'is-selected':''}" data-calendar-date="${key}" data-tone="${tone}" aria-label="${date.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})}, ${dayEntries.length} check-ins, ${dayTasks.length} tasks"><span>${date.getDate()}</span><span class="calendar-marks">${dayEntries.length?`<i class="emotion-mark" aria-hidden="true"></i>`:''}${dayTasks.length?`<i class="task-mark" aria-hidden="true"></i>`:''}</span></button>`);}
  $('#lifestyle-calendar-grid').innerHTML=cells.join('');renderDayDetail();renderOverview();
 }
 function renderDayDetail(){
  const dayEntries=entries.filter(item=>item.date===selectedDate),dayTasks=tasks.filter(item=>item.date===selectedDate),date=new Date(`${selectedDate}T12:00:00`);
  $('#lifestyle-day-detail').innerHTML=`<div><p class="eyebrow">Selected day</p><h3>${date.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})}</h3></div>${dayEntries.length?`<ul>${dayEntries.map(item=>{const mood=emotionMap.get(item.emotion)||emotions[11];return `<li><span aria-hidden="true">${mood[2]}</span><div><b>${esc(mood[1])}${item.intensity==null?'':' · '+item.intensity+'/10'}</b><small>${esc(item.period)}${item.energy==null?'':' · energy '+item.energy+'/10'} · ${esc(item.time)}</small>${item.note?`<p>${esc(item.note)}</p>`:''}</div><button type="button" data-delete-entry="${item.id}" aria-label="Delete this check-in">×</button></li>`}).join('')}</ul>`:'<p class="fine">No emotional check-in saved for this day.</p>'}${dayTasks.length?`<div class="day-tasks"><b>Tasks</b>${dayTasks.map(task=>`<span class="${task.done?'is-done':''}">${task.time?esc(task.time)+' · ':''}${esc(task.title)}</span>`).join('')}</div>`:''}<button type="button" class="text-button" data-add-selected-date>Add a task to this day →</button>`;
 }
 function renderDeed(){
  const item=goodDeeds[deed.index];$('#lifestyle-deed-card').innerHTML=`<span class="deed-category">${esc(item.category)}</span><p>${esc(item.task)}</p><div><button type="button" class="button" data-deed-done ${deed.done?'disabled':''}>${deed.done?'Completed today':'I did this'}</button><button type="button" class="button secondary" data-deed-next>Show another</button></div><small>${deed.skips?`${deed.skips} alternative${deed.skips===1?'':'s'} viewed today. `:''}Choose another whenever the suggestion does not fit your circumstances.</small>`;
 }
 function renderTasks(){
  tasks=readLifestyleTasks();const focus=readFocusBoard();
  $('#lifestyle-task-list').innerHTML=tasks.length?tasks.sort((a,b)=>`${a.date} ${a.time||'99:99'}`.localeCompare(`${b.date} ${b.time||'99:99'}`)).map(task=>`<article class="lifestyle-task ${task.done?'is-done':''}"><input type="checkbox" data-task-done="${task.id}" ${task.done?'checked':''} aria-label="Complete ${esc(task.title)}"><div><strong>${esc(task.title)}</strong><small>${esc(task.date)}${task.time?' · '+esc(task.time):''}</small>${task.notes?`<p>${esc(task.notes)}</p>`:''}</div><div><button type="button" data-to-focus="${task.id}">Move to SimplyFocus</button><button type="button" data-delete-task="${task.id}" aria-label="Delete ${esc(task.title)}">Delete</button></div></article>`).join(''):`<div class="lifestyle-empty">${resourceMarkup('empty-sitting')}<b style="color:var(--ns-life-readable-ink,#244735)!important">A clear space to begin</b><p style="color:var(--ns-life-readable-ink,#244735)!important">Add one task above. Small is welcome.</p></div>`;
  $('#lifestyle-focus-import').innerHTML=focus.tasks.length?focus.tasks.map(task=>`<article class="focus-import-task"><div><strong>${esc(task.title)}</strong><small>${esc(task.project||'Personal')} · ${Number(task.estimate)||1} Pomodoro${Number(task.estimate)===1?'':'s'}</small></div><button type="button" data-from-focus="${task.id}">Move to Lifestyle</button></article>`).join(''):`<div class="lifestyle-empty">${resourceMarkup('empty-map')}<b style="color:var(--ns-life-readable-ink,#244735)!important">Nothing waiting in SimplyFocus</b><p style="color:var(--ns-life-readable-ink,#244735)!important">Focus tasks will appear here when you add them.</p></div>`;renderCalendar();
 }
 function loadReminders(){const state=readLifestyleReminders();$('#morning-reminder-enabled').checked=state.morningEnabled;$('#morning-reminder-time').value=state.morningTime;$('#evening-reminder-enabled').checked=state.eveningEnabled;$('#evening-reminder-time').value=state.eveningTime;const button=$('#lifestyle-enable-notifications');if(!('Notification' in window)){button.hidden=true;$('#lifestyle-reminder-status').textContent='This browser does not offer web notifications.'}else if(Notification.permission==='granted'){button.textContent='Device notifications enabled';button.disabled=true}else if(Notification.permission==='denied')button.textContent='Notifications are blocked in browser settings';}

 root.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.checkMode){checkMode=button.dataset.checkMode;$('#lifestyle-checkin-title').textContent=`${checkMode==='daytime'?'Daytime':checkMode[0].toUpperCase()+checkMode.slice(1)} check-in`;$('#lifestyle-checkin-title').nextElementSibling.textContent=checkMode==='morning'?'Arrive before you organise the day.':checkMode==='evening'?'Put down what can wait before bed.':'Notice what is here before choosing what comes next.';toolShelf();}
  if(button.dataset.calendarMove){calendarDate=new Date(calendarDate.getFullYear(),calendarDate.getMonth()+Number(button.dataset.calendarMove),1);renderCalendar();}
  if(button.dataset.calendarDate){selectedDate=button.dataset.calendarDate;$('#lifestyle-task-date').value=selectedDate;renderCalendar();}
  if(button.hasAttribute('data-add-selected-date')){$('#lifestyle-task-date').value=selectedDate;$('#lifestyle-tasks').scrollIntoView({block:'start'});$('#lifestyle-task-title').focus({preventScroll:true});}
  if(button.hasAttribute('data-deed-next')){deed={...deed,index:randomDeed(deed.index),done:false,skips:(deed.skips||0)+1};writeDeed(deed);renderDeed();}
  if(button.hasAttribute('data-deed-done')){deed={...deed,done:true};writeDeed(deed);renderDeed();}
  if(button.dataset.deleteEntry){entries=entries.filter(item=>item.id!==button.dataset.deleteEntry);writeEmotions(entries);renderCalendar();}
  if(button.dataset.deleteTask){writeLifestyleTasks(tasks.filter(item=>item.id!==button.dataset.deleteTask));renderTasks();$('#lifestyle-task-status').textContent='Task deleted.';}
  if(button.dataset.toFocus&&moveLifestyleToFocus(button.dataset.toFocus)){renderTasks();$('#lifestyle-task-status').textContent='Task moved to SimplyFocus.';}
  if(button.dataset.fromFocus&&moveFocusToLifestyle(button.dataset.fromFocus)){renderTasks();$('#lifestyle-task-status').textContent='Task moved to Lifestyle and added to the calendar.';}
 },{signal});
 root.addEventListener('change',event=>{if(event.target.matches('[data-task-done]')){const task=tasks.find(item=>item.id===event.target.dataset.taskDone);if(task){task.done=event.target.checked;writeLifestyleTasks(tasks);renderTasks();}}},{signal});
 $('#lifestyle-intensity').addEventListener('input',event=>$('#lifestyle-intensity-output').textContent=`${event.target.value} / 10`);$('#lifestyle-energy').addEventListener('input',event=>$('#lifestyle-energy-output').textContent=`${event.target.value} / 10`);
 $('#lifestyle-checkin-form').addEventListener('submit',event=>{event.preventDefault();const emotion=new FormData(event.currentTarget).get('lifestyle-emotion');if(!emotion)return;const now=new Date();entries.push({id:`${Date.now()}-${Math.random().toString(36).slice(2)}`,date:localDate(now),time:now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),period:checkMode,emotion,intensity:Number($('#lifestyle-intensity').value),energy:Number($('#lifestyle-energy').value),note:$('#lifestyle-note').value.trim()});writeEmotions(entries);selectedDate=localDate(now);$('#lifestyle-checkin-status').textContent='Check-in saved to today’s calendar.';event.currentTarget.reset();$('#lifestyle-intensity-output').textContent='5 / 10';$('#lifestyle-energy-output').textContent='5 / 10';renderCalendar();});
 $('#lifestyle-task-form').addEventListener('submit',event=>{event.preventDefault();const added=addLifestyleTask({title:$('#lifestyle-task-title').value,notes:$('#lifestyle-task-note').value,date:$('#lifestyle-task-date').value,time:$('#lifestyle-task-time').value});if(!added)return;event.currentTarget.reset();$('#lifestyle-task-date').value=selectedDate;renderTasks();$('#lifestyle-task-status').textContent='Task added to Lifestyle and its calendar date.';});
 $('#lifestyle-reminder-form').addEventListener('submit',event=>{event.preventDefault();const old=readLifestyleReminders();writeLifestyleReminders({...old,morningEnabled:$('#morning-reminder-enabled').checked,morningTime:$('#morning-reminder-time').value,eveningEnabled:$('#evening-reminder-enabled').checked,eveningTime:$('#evening-reminder-time').value});$('#lifestyle-reminder-status').textContent='Reminder times saved on this device.';});
 $('#lifestyle-enable-notifications').addEventListener('click',async()=>{if(!('Notification' in window))return;const permission=await Notification.requestPermission();loadReminders();$('#lifestyle-reminder-status').textContent=permission==='granted'?'Device notifications are enabled. Save the times you want above.':'Permission was not granted. Check-ins and saved times still work without notifications.';});
 toolShelf();renderDeed();renderTasks();loadReminders();
}
