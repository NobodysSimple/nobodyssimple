/**
 * One private Daily Check-in for Home and Lifestyle.
 * The same record powers Home status and Lifestyle calendar.
 * Account syncing is opt-in via saved-work settings.
 */
import {resourceMarkup} from './ui-resources.mjs';
import {escapeHTML as esc} from './core.mjs';
import {emotions as compassEmotions} from './data.mjs';
import {renderEmbeddedCompass} from './features.mjs';

export const DAILY_CHECKIN_KEY='ns-lifestyle-emotions-v1';
export const DAILY_CHECKIN_CHANGED='ns-daily-checkins-changed';
export const localDay=(date=new Date())=>[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');
const moods=[
 ['steady','Steady','face-calm'],['glad','Glad','face-happy'],['hopeful','Hopeful','face-curious'],
 ['energised','Energised','face-surprised'],['tired','Tired','face-sleepy'],['sad','Sad','face-sad'],
 ['worried','Worried','face-worried'],['angry','Angry','face-determined'],
 ['overwhelmed','Overwhelmed','face-worried'],['numb','Numb','face-calm'],
 ['mixed','Mixed','face-curious'],['unsure','Unsure','face-confused']
];
const moodNames=new Map(moods.map(([id,label])=>[id,label]));
export const checkinLabel=item=>String(item?.emotionWord||moodNames.get(item?.emotion)||'Unsure');
export function readDailyCheckins(){
 try{
  const records=JSON.parse(localStorage.getItem(DAILY_CHECKIN_KEY)||'[]');
  return Array.isArray(records)?records.filter(item=>item&&typeof item==='object'&&typeof item.date==='string'):[];
 }catch{return [];}
}
function broadcast(){window.dispatchEvent(new CustomEvent(DAILY_CHECKIN_CHANGED));}
export function saveDailyCheckin(record){
 const next=[...readDailyCheckins(),record];
 localStorage.setItem(DAILY_CHECKIN_KEY,JSON.stringify(next));
 broadcast();
 return record;
}
export function deleteDailyCheckin(id){
 const records=readDailyCheckins(),next=records.filter(item=>String(item.id)!==String(id));
 if(next.length===records.length)return false;
 localStorage.setItem(DAILY_CHECKIN_KEY,JSON.stringify(next));
 broadcast();
 return true;
}
function summaryForToday(){
 const record=readDailyCheckins().filter(item=>item.date===localDay()).at(-1);
 return record?checkinLabel(record):'';
}
export function updateDailyCheckinButtons(){
 const label=summaryForToday();
 document.querySelectorAll('[data-ns-checkin-summary]').forEach(node=>{
  node.textContent=label?'Last check-in: '+label:'Your feelings, in one place';
 });
}
let installed=false;
export function installDailyCheckin(){
 if(installed)return;
 installed=true;
 const dialog=document.createElement('dialog');
 dialog.id='ns-daily-checkin-dialog';
 dialog.className='ns-daily-checkin-dialog';
 dialog.setAttribute('aria-labelledby','ns-checkin-modal-title');
 const options=moods.map(([id,label,face])=>
  '<label><input type="radio" name="daily-emotion" value="'+esc(id)+'"><span>'+
  resourceMarkup(face,'ns-checkin-face')+'<b>'+esc(label)+'</b></span></label>'
 ).join('');
 dialog.innerHTML=
  '<div class="ns-checkin-window">'+
   '<div class="ns-checkin-header">'+
    '<div><p class="ns-checkin-eyebrow">NOBODY’S SIMPLE · YOUR DAY</p>'+
     '<h2 id="ns-checkin-modal-title">Daily check-in</h2>'+
     '<p>Notice how you’re arriving. Choose as much or as little as feels useful.</p></div>'+
    '<button type="button" class="ns-checkin-close" data-ns-checkin-close aria-label="Close daily check-in">×</button>'+
   '</div>'+
   '<div class="ns-checkin-tabs" role="tablist" aria-label="Check-in views">'+
    '<button type="button" role="tab" id="ns-checkin-tab-quick" aria-selected="true" aria-controls="ns-checkin-panel-quick" data-ns-checkin-tab="quick">♡ My check-in</button>'+
    '<button type="button" role="tab" id="ns-checkin-tab-compass" aria-selected="false" aria-controls="ns-checkin-panel-compass" data-ns-checkin-tab="compass">✦ Emotion Compass</button>'+
   '</div>'+
   '<div class="ns-checkin-content">'+
    '<section id="ns-checkin-panel-quick" role="tabpanel" aria-labelledby="ns-checkin-tab-quick">'+
     '<div class="ns-checkin-prompt"><strong>What feels closest right now?</strong><span>Choose a familiar feeling, or find a more specific word in the Compass.</span></div>'+
     '<form id="ns-daily-checkin-form">'+
      '<fieldset class="ns-checkin-moods"><legend class="sr-only">Select a feeling</legend>'+options+'</fieldset>'+
      '<div class="ns-checkin-compass-result" data-ns-selected-word hidden>'+
       '<div><small>FROM THE EMOTION COMPASS</small><strong data-ns-word-label></strong></div>'+
       '<button type="button" data-ns-clear-word aria-label="Remove chosen Compass word">Remove ×</button>'+
      '</div>'+
      '<button type="button" class="ns-checkin-open-compass" data-ns-to-compass>Explore the full Emotion Compass <span aria-hidden="true">→</span></button>'+
      '<div class="ns-checkin-optional">'+
       '<p>Optional details</p>'+
       '<div class="ns-checkin-sliders">'+
        '<label>Intensity <output data-ns-intensity-value>5 / 10</output><input type="range" name="intensity" min="1" max="10" value="5"></label>'+
        '<label>Energy <output data-ns-energy-value>5 / 10</output><input type="range" name="energy" min="1" max="10" value="5"></label>'+
       '</div>'+
       '<label class="ns-checkin-notes">A few words <span>(optional)</span><textarea name="note" rows="2" maxlength="500" placeholder="What’s shaping this moment?"></textarea></label>'+
      '</div>'+
      '<div class="ns-checkin-footer">'+
       '<span data-ns-period-label></span>'+
       '<button class="ns-checkin-save" type="submit">Save to my calendar <span aria-hidden="true">→</span></button>'+
      '</div>'+
      '<p data-ns-checkin-status role="status" aria-live="polite"></p>'+
     '</form>'+
    '</section>'+
    '<section id="ns-checkin-panel-compass" role="tabpanel" aria-labelledby="ns-checkin-tab-compass" hidden>'+
     '<p class="ns-checkin-compass-hint">Explore the same Emotion Compass available elsewhere in Nobody’s Simple. When a word fits, choose <strong>Use this feeling</strong> to bring it into your check-in.</p>'+
     '<div id="ns-daily-checkin-compass-host"></div>'+
    '</section>'+
   '</div>'+
  '</div>';
 document.body.append(dialog);
 let word='',lastTrigger=null,compassMounted=false;
 const $=selector=>dialog.querySelector(selector);
 const form=$('#ns-daily-checkin-form');
 const setWord=value=>{
  word=String(value||'').trim().slice(0,180);
  $('[data-ns-selected-word]').hidden=!word;
  $('[data-ns-word-label]').textContent=word;
  $('[data-ns-checkin-status]').textContent='';
 };
 const setTab=tab=>{
  const compass=tab==='compass';
  $('#ns-checkin-panel-quick').hidden=compass;
  $('#ns-checkin-panel-compass').hidden=!compass;
  dialog.querySelectorAll('[data-ns-checkin-tab]').forEach(button=>{
   const active=button.dataset.nsCheckinTab===tab;
   button.setAttribute('aria-selected',String(active));
   button.tabIndex=active?0:-1;
  });
  if(compass&&!compassMounted){
   compassMounted=true;
   renderEmbeddedCompass($('#ns-daily-checkin-compass-host'),compassEmotions,(selection)=>{
    const label=typeof selection==='string'?selection:selection?.label;
    if(!label)return;
    setWord(label);
    setTab('quick');
    const chosen=$('[data-ns-word-label]');
    chosen.setAttribute('tabindex','-1');
    chosen.scrollIntoView({block:'nearest'});
    chosen.focus({preventScroll:true});
   });
  }
 };
 const open=trigger=>{
  lastTrigger=trigger||document.activeElement;
  const today=localDay();
  $('[data-ns-period-label]').textContent=new Date(today+'T12:00:00').toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'});
  $('[data-ns-checkin-status]').textContent='';
  setTab('quick');
  if(!dialog.open)dialog.showModal();
 };
 document.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-ns-open-checkin]');
  if(!trigger)return;
  event.preventDefault();
  open(trigger);
 });
 dialog.querySelectorAll('[data-ns-checkin-close]').forEach(button=>button.addEventListener('click',()=>dialog.close()));
 dialog.addEventListener('click',event=>{
  if(event.target===dialog)dialog.close();
  if(event.target.closest('[data-ns-to-compass]'))setTab('compass');
  if(event.target.closest('[data-ns-clear-word]'))setWord('');
  const tab=event.target.closest('[data-ns-checkin-tab]');
  if(tab)setTab(tab.dataset.nsCheckinTab);
 });
 dialog.querySelector('.ns-checkin-tabs').addEventListener('keydown',event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const tabs=[...dialog.querySelectorAll('[data-ns-checkin-tab]')];
  const current=tabs.findIndex(tab=>tab.getAttribute('aria-selected')==='true');
  const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:(current+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
  setTab(tabs[next].dataset.nsCheckinTab);
  tabs[next].focus();
 });
 for(const key of ['intensity','energy']){
  const input=form.elements.namedItem(key);
  input.addEventListener('input',()=>{dialog.querySelector('[data-ns-'+key+'-value]').textContent=input.value+' / 10';});
 }
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const selected=new FormData(form).get('daily-emotion');
  if(!selected&&!word){
   $('[data-ns-checkin-status]').textContent='Choose one feeling, or use the Emotion Compass to find a word first.';
   return;
  }
  const now=new Date(),record={
   id:globalThis.crypto?.randomUUID?.()||String(Date.now())+'-'+Math.random().toString(36).slice(2),
   date:localDay(now),
   time:now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),
   period:now.getHours()<12?'morning':now.getHours()>=18?'evening':'daytime',
   emotion:selected||'unsure',
   ...(word?{emotionWord:word}:{}),
   intensity:Number(form.elements.namedItem('intensity').value),
   energy:Number(form.elements.namedItem('energy').value),
   note:String(form.elements.namedItem('note').value||'').trim()
  };
  try{
   saveDailyCheckin(record);
   form.reset();setWord('');
   $('[data-ns-intensity-value]').textContent='5 / 10';
   $('[data-ns-energy-value]').textContent='5 / 10';
   updateDailyCheckinButtons();
   dialog.close();
  }catch{
   $('[data-ns-checkin-status]').textContent='This check-in could not be saved. Your entry is still here; check your saved-work settings or browser storage.';
  }
 });
 dialog.addEventListener('close',()=>{if(lastTrigger?.isConnected)lastTrigger.focus({preventScroll:true});});
 window.addEventListener('storage',event=>{if(event.key===DAILY_CHECKIN_KEY)updateDailyCheckinButtons();});
 window.addEventListener(DAILY_CHECKIN_CHANGED,updateDailyCheckinButtons);
 window.addEventListener('focus',updateDailyCheckinButtons);
 updateDailyCheckinButtons();
}
