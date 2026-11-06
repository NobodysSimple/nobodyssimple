import { renderLivingTrail, cleanupLivingTrail } from './ns-living-trail.mjs';
/**
 * Nobody's Simple · Life Lab shell.
 * Keeps the existing Reality Sorter mission, while routing the world map and
 * #lab/forest into the redesigned Living Trail experience.
 */
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const WORLDS = Object.freeze([
  {id:'meadow',title:'The Meadow',theme:'Feelings & body',line:'Notice what is happening inside without rushing to explain it.',image:'ns-landscape-sunset.webp',pose:'ns-character-compass.webp',accent:'rose',tools:[['Mixed Feelings','#tool/mixed-feelings'],['Body Check','#tool/body-check']],missions:[['Name a mixed feeling','planned'],['Listen to a body signal','planned'],['When feelings disagree','planned']]},
  {id:'forest',title:'The Forest',theme:'Thought & uncertainty',line:'Look at the evidence, question assumptions and make room for what is unknown.',image:'ns-landscape-forest.webp',pose:'ns-character-thinking.webp',accent:'green',tools:[['Reality Map','#tool/reality-map'],['Assumption Finder','#tool/assumption-finder']],missions:[['Reality Sorter','reality-sorter'],['Perspective Window','planned'],['The Evidence Scale','planned']]},
  {id:'bridge',title:'The Bridge',theme:'People & relationships',line:'Explore different perspectives, communicate and decide what deserves a response.',image:'ns-landscape-mountains.webp',pose:'ns-character-message.webp',accent:'peach',tools:[['Conversation Map','#tool/conversation-map'],['Boundary Builder','#tool/boundary-builder']],missions:[['Conversation Studio','planned'],['A boundary, clearly','planned'],['Repair after a misunderstanding','planned']]},
  {id:'workshop',title:'The Workshop',theme:'Decisions & action',line:'Turn complexity into one practical step you can actually take.',image:'ns-landscape-path.webp',pose:'ns-character-hiking.webp',accent:'gold',tools:[['Small Step','#tool/small-step'],['Friction Finder','#tool/friction']],missions:[['The Load Table','planned'],['Prediction & Discovery','planned'],['A smaller first step','planned']]},
  {id:'observatory',title:'The Observatory',theme:'Self & society',line:'See how behaviour, identity and environments change across situations.',image:'ns-landscape-night.webp',pose:'ns-character-sitting.webp',accent:'sage',tools:[['Identity Map','#tool/identity-map'],['Values Discovery','#tool/values-discovery']],missions:[['Self across situations','planned'],['Context changes behaviour','planned'],['What matters to me','planned']]},
]);
const SORT = Object.freeze([
  {id:'message',text:'My friend sent: “I can’t make it tonight.”',answer:'observed',explanation:'The words in the message are available to check. Their reason is not.'},
  {id:'motive',text:'“They don’t want to spend time with me.”',answer:'inferred',explanation:'This is one possible account of their motive, not a direct observation.'},
  {id:'disappointed',text:'I feel disappointed that our plans changed.',answer:'felt',explanation:'Your feeling is real and deserves attention. It does not establish their intention.'},
  {id:'reason',text:'Why they cancelled.',answer:'unknown',explanation:'The message does not give enough information to know their reason.'}
]);
const CATEGORIES = Object.freeze([
  {id:'observed',label:'Observed',meaning:'What was said or done'},
  {id:'inferred',label:'Inferred',meaning:'The meaning I added'},
  {id:'felt',label:'Felt',meaning:'My emotional response'},
  {id:'unknown',label:'Unknown',meaning:'Not established yet'}
]);
const HYPOTHESES = Object.freeze([
  {id:'overloaded',name:'They have too much on their plate.',detail:'Possible. But the message alone does not establish what demands they are facing.'},
  {id:'distance',name:'They might be pulling away from me.',detail:'Also possible. It would take further evidence to know whether their feelings have changed.'},
  {id:'unexpected',name:'Something unexpected came up.',detail:'Possible. We do not know what, or whether they want to discuss it.'},
  {id:'unclear',name:'I simply do not know yet.',detail:'Being uncertain is sometimes the most accurate available position.'}
]);
const EVIDENCE = Object.freeze([
  {id:'pattern',name:'Notice whether their contact or behaviour changes over time, or ask neutrally when appropriate.',title:'More discriminating information',detail:'A pattern or a straightforward conversation may help you distinguish explanations. Neither guarantees access to another person’s private thoughts.'},
  {id:'fear',name:'Notice how strongly the cancellation worries me.',title:'Useful for understanding your feelings',detail:'Your reaction matters, but the intensity of worry does not reliably tell you why your friend cancelled.'},
  {id:'memory',name:'Remember a different time when someone stopped wanting to meet.',title:'A memory, not current evidence',detail:'Past experiences may shape your expectations. They cannot establish what this particular message means.'}
]);
const RESPONSES = Object.freeze([
  {id:'neutral',name:'“No worries. Hope all is well. Let me know if another day works.”',title:'A low-pressure check-in',detail:'This acknowledges the cancellation without treating a guessed motive as fact. Whether it is appropriate depends on your relationship and context.'},
  {id:'challenge',name:'“You obviously don’t want to see me.”',title:'A strong inference stated as certainty',detail:'This could escalate tension if the inferred motive is wrong. If you need clarity, a question usually conveys uncertainty more accurately.'},
  {id:'pause',name:'Take some space and decide whether a reply is needed.',title:'Pausing can be useful',detail:'Waiting or not responding immediately can be an appropriate choice. It need not mean avoiding an important discussion forever.'}
]);
const ACTIONS = Object.freeze([
  {id:'reschedule',name:'Offer another time without assuming a motive.',detail:'I can ask once, without turning a reply into a test of my worth.'},
  {id:'pause',name:'Pause before responding and return to it later.',detail:'A useful experiment can be giving uncertainty some space before acting.'},
  {id:'note',name:'Write down the observation and my interpretation separately.',detail:'I can practise distinguishing evidence from meaning, even if I never send a message.'},
  {id:'none',name:'Choose not to take action right now.',detail:'Doing nothing for now is a valid next step when there is no pressing need to respond.'}
]);
const STEPS = Object.freeze([
  {id:'notice',label:'Notice',short:'Sort the facts',number:'01'},
  {id:'explore',label:'Explore',short:'Consider explanations',number:'02'},
  {id:'evidence',label:'Evidence',short:'What would help?',number:'03'},
  {id:'choose',label:'Choose',short:'Try a response',number:'04'},
  {id:'test',label:'Test',short:'Plan a small next step',number:'05'},
  {id:'review',label:'Keep',short:'Carry one insight',number:'06'}
]);
const fresh = () => ({sort:{},sortChecked:false,hypotheses:[],evidence:'',response:'',action:'',started:false});
let mission=fresh();
let clean=()=>{};
export function cleanupNSLab(){clean();clean=()=>{};cleanupLivingTrail();}

function unavailable(message){return `<div class="ns-lab5 ns-lab5-unavailable"><a class="ns-lab5-back" href="#lab">← Life Lab</a><h1>${esc(message)}</h1><p>That destination may be incomplete or the link may have changed. No mission data has been loaded.</p><a class="ns-lab5-primary" href="#lab">Explore Life Lab →</a></div>`;}
const missionHref = step => `#lab/mission/reality-sorter/${step}`;
const nav = (i) => `<nav class="ns-lab5-missionnav" aria-label="Mission navigation"><a href="#lab/forest" class="ns-lab5-back">← The Forest</a><a href="#lab" class="ns-lab5-exit">Leave mission ×</a></nav>
<div class="ns-lab5-steps" aria-label="Mission stages">${STEPS.map((step,index)=>`<span class="${index===i?'is-current':''} ${index<i?'is-done':''}"><b>${step.number}</b><small>${esc(step.label)}</small></span>`).join('')}</div>`;
const navigation = (i,ready=true,nextText='Continue') => `<div class="ns-lab5-actions">${i>0?`<a class="ns-lab5-textbutton" href="${missionHref(STEPS[i-1].id)}">← Previous stage</a>`:'<a class="ns-lab5-textbutton" href="#lab/forest">← The Forest</a>'}${i<STEPS.length-1?`<button type="button" data-lab-action="next" class="ns-lab5-primary" ${ready?'':'disabled'}>${nextText} <span aria-hidden="true">→</span></button>`:'<a href="#lab/forest" class="ns-lab5-primary">Return to The Forest →</a>'}</div>`;
function currentStep(id){return STEPS.findIndex(x=>x.id===id);}
function scene(){return `<div class="ns-lab5-scene"><div class="ns-lab5-message"><strong>Message</strong><p>“I can’t make it tonight.”</p></div><div class="ns-lab5-scene__hint">One event can lead to several possible stories.</div></div>`;}
function sortCard(item){
  const selected=mission.sort[item.id];
  return `<article class="ns-lab5-sortcard"><strong>${esc(item.text)}</strong><div class="ns-lab5-sortgrid">${CATEGORIES.map(cat=>`<button type="button" data-lab-action="sort" data-statement="${item.id}" data-category="${cat.id}" class="${selected===cat.id?'is-selected':''}">${esc(cat.label)}<small>${esc(cat.meaning)}</small></button>`).join('')}</div>${mission.sortChecked&&selected?`<p class="ns-lab5-feedback ${selected===item.answer?'is-good':'is-note'}"><b>${selected===item.answer?'Good distinction.':'Try the explanation.'}</b> ${esc(item.explanation)}</p>`:''}</article>`;
}
function notice(i){const complete=SORT.every(x=>mission.sort[x.id]); const feedback=complete&&mission.sortChecked;
  return `<div class="ns-lab5-stage"><p class="ns-lab5-eyebrow">01 · NOTICE</p><h1>What happened, and what am I adding?</h1><p>Sort each statement into the most accurate category. The goal is not to remove feelings; it is to separate what was observed, what was inferred, what was felt and what remains unknown.</p>${scene()}<div class="ns-lab5-sortcards">${SORT.map(sortCard).join('')}</div><div class="ns-lab5-note">This is a teaching exercise, not a test of your personality or emotions.</div><div class="ns-lab5-actions"><a class="ns-lab5-textbutton" href="#lab/forest">← The Forest</a><div class="ns-lab5-actionpair"><button type="button" data-lab-action="check-sort" class="ns-lab5-outline" ${complete?'':'disabled'}>Check my sorting</button><button type="button" data-lab-action="next" class="ns-lab5-primary" ${feedback?'':'disabled'}>Explore explanations →</button></div></div></div>`;
}
function choiceCards(items,field,multi=false){const selected=mission[field];return `<div class="ns-lab5-choicegrid" role="group" aria-label="${multi?'Select possible explanations':'Select a response'}">${items.map((x,index)=>{const active=multi?selected.includes(x.id):selected===x.id;return `<button type="button" class="ns-lab5-choice ${active?'is-selected':''}" data-lab-action="${multi?'hypothesis':'select'}" data-field="${field}" data-value="${x.id}" aria-pressed="${String(active)}"><span class="ns-lab5-choice__number">0${index+1}</span><span>${esc(x.name)}</span><span aria-hidden="true" class="ns-lab5-choice__tick">${active?'✓':'○'}</span></button>`;}).join('')}</div>`;}
function explore(i){const chosen=mission.hypotheses.length;return `<div class="ns-lab5-stage"><p class="ns-lab5-eyebrow">02 · EXPLORE ALTERNATIVES</p><h1>There is more than one possible story.</h1><p>Select at least two explanations that could fit the short message. You're not guessing the “right” motive—you are practising keeping several possibilities open.</p>${scene()}${choiceCards(HYPOTHESES,'hypotheses',true)}${chosen?`<div class="ns-lab5-feedback" role="status"><strong>${chosen} ${chosen===1?'possibility':'possibilities'} considered.</strong><p>${mission.hypotheses.map(id=>HYPOTHESES.find(x=>x.id===id)?.detail).filter(Boolean).map(esc).join(' ')}</p></div>`:''}${navigation(i,chosen>=2,'What evidence would help?')}</div>`;}
function evidence(i){const selected=EVIDENCE.find(x=>x.id===mission.evidence);return `<div class="ns-lab5-stage"><p class="ns-lab5-eyebrow">03 · FIND BETTER EVIDENCE</p><h1>What would actually help you tell?</h1><p>You have several interpretations of the same event. Which new information would be most useful for distinguishing between them?</p>${choiceCards(EVIDENCE,'evidence')}${selected?`<div class="ns-lab5-feedback" role="status"><strong>${esc(selected.title)}</strong><p>${esc(selected.detail)}</p></div>`:''}${navigation(i,Boolean(selected),'Choose a response')}</div>`;}
function choose(i){const selected=RESPONSES.find(x=>x.id===mission.response);return `<div class="ns-lab5-stage"><p class="ns-lab5-eyebrow">04 · PRACTISE A RESPONSE</p><h1>Uncertainty doesn't mean you cannot act.</h1><p>What might you say or do next? Choose a response to explore. There isn't one universally correct interpersonal response.</p>${choiceCards(RESPONSES,'response')}${selected?`<div class="ns-lab5-feedback" role="status"><strong>${esc(selected.title)}</strong><p>${esc(selected.detail)}</p></div>`:''}${navigation(i,Boolean(selected),'Plan a small experiment')}</div>`;}
function test(i){const selected=ACTIONS.find(x=>x.id===mission.action);return `<div class="ns-lab5-stage"><p class="ns-lab5-eyebrow">05 · TAKE IT INTO LIFE</p><h1>What would you be willing to try?</h1><p>Choose one optional real-world step. Nothing here will be sent or scheduled. Sometimes the appropriate experiment is simply noticing what happens when you don't immediately chase certainty.</p>${choiceCards(ACTIONS,'action')}${selected?`<div class="ns-lab5-feedback" role="status"><strong>Your proposed next step</strong><p>${esc(selected.detail)}</p><p class="ns-lab5-feedback__caution">You can change your mind. Your friend's reaction cannot be predicted by this exercise.</p></div>`:''}${navigation(i,Boolean(selected),'Review what you learned')}</div>`;}
function takeaway(){const pick=ACTIONS.find(x=>x.id===mission.action);return `What I know: my friend cancelled, but I do not know why. My interpretation is only one possibility. I can look for useful evidence, choose a proportionate response and allow uncertainty. ${pick?`My possible next step: ${pick.name}`:'I have not chosen a next step.'}`;}
function review(i){const action=ACTIONS.find(x=>x.id===mission.action);return `<div class="ns-lab5-stage ns-lab5-review"><p class="ns-lab5-eyebrow">06 · KEEP WHAT'S USEFUL</p><h1>Make the lesson yours.</h1><p>Being thoughtful doesn't require certainty. Here is a working takeaway you can use, revise or leave behind.</p><div class="ns-lab5-takeaway"><span class="ns-lab5-takeaway__mark" aria-hidden="true">✦</span><h2>A useful distinction</h2><p>You can know what happened without knowing why. An interpretation can be plausible without being proven.</p><div class="ns-lab5-takeaway__detail"><strong>${action?'A next step you considered':'Your real-world choice'}</strong><p>${action?esc(action.name):'No next step has been selected in this session. You can still use the general lesson.'}</p></div></div><div class="ns-lab5-copy"><label for="ns-lab5-summary">Your optional summary (editable after copying)</label><textarea id="ns-lab5-summary" rows="5" readonly>${esc(takeaway())}</textarea><button type="button" class="ns-lab5-outline" data-lab-action="copy">Copy this summary</button><span data-lab-copy-status aria-live="polite"></span></div><p class="ns-lab5-privacy">Nothing from this mission was saved to your account or this device. You can copy the takeaway, or save a note yourself in My Maps.</p><div class="ns-lab5-reviewlinks"><a class="ns-lab5-secondary" href="#account/maps">Open My Maps →</a><a class="ns-lab5-outline" href="#tool/reality-map">Try Reality Map →</a><button class="ns-lab5-outline" type="button" data-lab-action="restart">Try the scenario again ↻</button></div>${navigation(i)}</div>`;}
const STAGE_RENDERERS=[notice,explore,evidence,choose,test,review];
function missionPage(step){const i=currentStep(step);if(i<0)return unavailable('That mission stage is not available.');mission.started=true;return `<div class="ns-lab5 ns-lab5-experience" data-lab-mission="reality-sorter"><div class="ns-lab5-workspace__main">${nav(i)}${STAGE_RENDERERS[i](i)}</div></div>`;}
function focusAfterChange(root,match){const b=match?root.querySelector(match):null;if(b) b.focus({preventScroll:true});}
function attach(root){const controller=new AbortController();clean=()=>controller.abort();
 root.addEventListener('click', async (event)=>{
  const b=event.target.closest('[data-lab-action]');if(!b||!root.contains(b))return;
  const act=b.dataset.labAction;
  if(act==='copy'){const field=root.querySelector('#ns-lab5-summary');const status=root.querySelector('[data-lab-copy-status]');try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(field?.value||'');if(status)status.textContent='Copied to clipboard.';}catch{field?.focus();field?.select();if(status)status.textContent='Select the text above and copy it manually.';}return;}
  if(act==='restart'){mission=fresh();location.hash=missionHref('notice');if(location.hash===missionHref('notice'))renderCurrent();return;}
  if(act==='sort'){mission.sort[b.dataset.statement]=b.dataset.category;mission.sortChecked=false;renderCurrent(`[data-lab-action="sort"][data-statement="${b.dataset.statement}"][data-category="${b.dataset.category}"]`);return;}
  if(act==='check-sort'){if(SORT.every(x=>mission.sort[x.id])){mission.sortChecked=true;renderCurrent('[data-lab-action="check-sort"]');}return;}
  if(act==='hypothesis'){const v=b.dataset.value;let selected=[...mission.hypotheses];selected=selected.includes(v)?selected.filter(x=>x!==v):[...selected,v];mission.hypotheses=selected;renderCurrent(`[data-lab-action="hypothesis"][data-value="${v}"]`);return;}
  if(act==='select'){const field=b.dataset.field, value=b.dataset.value;if(['evidence','response','action'].includes(field)){mission[field]=value;renderCurrent(`[data-lab-action="select"][data-value="${value}"]`);}return;}
  if(act==='next'){const current=location.hash.split('/').at(-1);const i=currentStep(current);if(i===0 && (!SORT.every(x=>mission.sort[x.id])||!mission.sortChecked))return;if(i===1 && mission.hypotheses.length<2)return;if(i===2 && !mission.evidence || i===3 && !mission.response || i===4 && !mission.action)return;if(i>=0 && i<STEPS.length-1)location.hash=missionHref(STEPS[i+1].id);return;}
 },{signal:controller.signal});
 function renderCurrent(focusQuery){const step=location.hash.split('/').at(-1);root.innerHTML=missionPage(step);if(focusQuery)focusAfterChange(root,focusQuery);}
}
export function renderNSLab(main,parts=[]){
 const segs=Array.isArray(parts)?parts:[];
 const [first,second,third,...extra]=segs;
 let inner;
 if(!first){renderLivingTrail(main,'forest',WORLDS);return;}
 else if(first==='mission')inner=(!extra.length&&second==='reality-sorter')?missionPage(third||'notice'):unavailable('That mission is not available.');
 else if(segs.length===1){renderLivingTrail(main,first,WORLDS);return;}
 else inner=unavailable('That Life Lab page is not available.');
 main.innerHTML=inner;
 if(main.querySelector('[data-lab-mission]'))attach(main.querySelector('[data-lab-mission]'));
}
export const lifeLabDefinition=Object.freeze({worlds:WORLDS.map(w=>({id:w.id,missions:w.missions.map(([title,id])=>({title,id}))})),stages:STEPS.map(s=>s.id),sortStatements:SORT.map(s=>({id:s.id,answer:s.answer}))});
