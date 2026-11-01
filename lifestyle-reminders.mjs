export const lifestyleReminderKey='ns-lifestyle-reminders-v1';
const defaults={morningEnabled:false,morningTime:'08:30',eveningEnabled:false,eveningTime:'21:00',lastMorning:'',lastEvening:''};
export function readLifestyleReminders(){try{return {...defaults,...JSON.parse(localStorage.getItem(lifestyleReminderKey)||'{}')}}catch{return {...defaults}}}
export function writeLifestyleReminders(value){localStorage.setItem(lifestyleReminderKey,JSON.stringify({...defaults,...value}));window.dispatchEvent(new CustomEvent('ns:lifestyle-reminders'));}
const dateKey=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
async function showReminder(kind){
 const title=kind==='morning'?'Morning check-in · Nobody’s Simple':'Evening check-in · Nobody’s Simple';
 const body=kind==='morning'?'Notice how you are arriving, then choose one workable priority.':'Unload what is still open and make a little room for rest.';
 try{
  if('serviceWorker' in navigator){const registration=await navigator.serviceWorker.ready;await registration.showNotification(title,{body,icon:'icon-192.png',badge:'icon-192.png',tag:`ns-lifestyle-${kind}`,data:{url:'#lifestyle'}});return true;}
  if('Notification' in window&&Notification.permission==='granted'){new Notification(title,{body,icon:'icon-192.png',tag:`ns-lifestyle-${kind}`});return true;}
 }catch{}
 return false;
}
export function initLifestyleReminders(){
 if(window.__nsLifestyleReminderTimer)return;
 const check=async()=>{
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  const state=readLifestyleReminders(),now=new Date(),today=dateKey(now),minutes=now.getHours()*60+now.getMinutes();
  for(const kind of ['morning','evening']){
   const enabled=state[`${kind}Enabled`],time=state[`${kind}Time`],last=`last${kind[0].toUpperCase()}${kind.slice(1)}`;
   if(!enabled||state[last]===today||!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(time))continue;
   const [hour,minute]=time.split(':').map(Number),target=hour*60+minute;
   if(minutes>=target&&minutes<=target+120&&await showReminder(kind)){state[last]=today;writeLifestyleReminders(state);}
  }
 };
 window.__nsLifestyleReminderTimer=window.setInterval(check,60000);window.setTimeout(check,1200);
}
