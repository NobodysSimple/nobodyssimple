import {renderLivingTrail, cleanupLivingTrail, markLabNodeComplete} from './ns-living-trail.mjs';
import {startFieldGuideDraft} from './ns-field-guide.mjs';
import {renderLifeLabV3,cleanupLifeLabV3} from './ns-lifelab-v3.mjs';
/**
 * Nobody's Simple · Stage 5 The Journey.
 * An instructional encounter, NOT a questionnaire, diagnostic assessment or
 * simulated prediction of another person's intentions.
 * Mission selections are in memory only: no implicit persistence or sync.
 */
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const WORLDS = Object.freeze([
  {id:'meadow',title:'The Meadow',theme:'Feelings & body',line:'Notice what is happening inside without rushing to explain it.',image:'ns-landscape-sunset.webp',pose:'ns-character-compass.webp',accent:'rose',tools:[['Mixed Feelings','#tool/mixed-feelings'],['Body Check','#tool/body-check']],missions:[['Name a mixed feeling','planned'],['Listen to a body signal','planned'],['When feelings disagree','planned']]},
  {id:'forest',title:'The Forest',theme:'Thought & uncertainty',line:'Look at the evidence, question assumptions and make room for what is unknown.',image:'ns-landscape-forest.webp',pose:'ns-character-thinking.webp',accent:'blue',tools:[['Reality Map','#tool/reality-map'],['Assumption Finder','#tool/assumption-finder']],missions:[['Reality Sorter','reality-sorter'],['Perspective Window','planned'],['The Evidence Scale','planned']]},
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
export function cleanupNSLab(){clean();clean=()=>{};cleanupLivingTrail();cleanupLifeLabV3();}

const card = world => `<a href="#lab/${world.id}" class="ns-lab5-world" data-accent="${world.accent}">
  <span class="ns-lab5-world__scene"><img src="${world.image}" alt="" loading="lazy" decoding="async"/><img class="ns-lab5-world__mascot" src="${world.pose}" alt="" loading="lazy" decoding="async"/></span>
  <span class="ns-lab5-world__info"><small>${esc(world.theme)}</small><strong>${esc(world.title)}</strong><span>${esc(world.line)}</span><em>Explore world <span aria-hidden="true">→</span></em></span>
</a>`;
function hero(kicker,title,description,img,extra=''){
  return `<header class="ns-lab5-hero"><div class="ns-lab5-hero__copy"><p class="ns-lab5-eyebrow">${kicker}</p><h1>${title}</h1><p>${description}</p>${extra}</div><img class="ns-lab5-hero__art" src="${img}" alt="" decoding="async"/></header>`;
}
function hub(){
 const mapNodes=WORLDS.map((w,i)=>`<a class="ns-vision-mapnode ns-vision-mapnode--${w.id}" href="#lab/${w.id}" data-vision-world="${w.id}">
   <span class="ns-vision-mapnode__icon" aria-hidden="true">${['✿','♠','♧','⚒','✦'][i]}</span><span><strong>${esc(w.title)}</strong><small>${esc(w.theme)}</small></span></a>`).join('');
 return `<div class="ns-lab5 ns-lab5-hub ns-vision-lab-hub">
   <header class="ns-vision-lab-intro"><p class="ns-lab5-eyebrow">LEARN LIFE BY LIVING IT</p><h1>The The Journey</h1><p>Explore real-life situations, practise skills and build your own understanding.</p></header>
   <section class="ns-vision-worldmap" aria-label="Five illustrated The Journey worlds">
    <div class="ns-vision-worldmap__land" aria-hidden="true"><img src="ns-home-hero.webp" alt=""/></div>
    <div class="ns-vision-worldmap__nodes">${mapNodes}</div>
    <a class="ns-vision-worldmap__start" href="#lab/mission/reality-sorter/notice"><span aria-hidden="true">◉</span> Start a The Journey mission <span aria-hidden="true">→</span></a>
   </section>
   <section class="ns-lab5-feature" aria-labelledby="ns-lab5-feature-title"><div><p class="ns-lab5-eyebrow">READY TO TRY · THE FOREST</p><h2 id="ns-lab5-feature-title">Reality Sorter</h2><p>A real interaction: separate what happened from the meaning you added, explore different explanations and choose a next step.</p><div class="ns-lab5-feature__meta"><span>Six short stages</span><span>Keyboard and touch</span><span>No automatic saving</span></div><a href="#lab/mission/reality-sorter/notice" class="ns-lab5-secondary">Begin the mission <span aria-hidden="true">→</span></a></div><img src="ns-character-thinking.webp" alt="" loading="lazy"/></section>
   <section class="ns-lab5-section ns-vision-world-directory" aria-labelledby="ns-lab5-worlds-title"><div class="ns-lab5-sectionhead"><div><p class="ns-lab5-eyebrow">EXPLORE AT YOUR OWN PACE</p><h2 id="ns-lab5-worlds-title">All five worlds</h2></div><p>Only the first mission is ready; other worlds link to working tools.</p></div><div class="ns-lab5-worldgrid">${WORLDS.map(card).join('')}</div></section>
   <aside class="ns-lab5-after"><span aria-hidden="true">✦</span><div><h2>Learn, practise, apply.</h2><p>Some discoveries are worth keeping. Others simply help you get on with your day.</p></div><a href="#guide">Open Field Guide →</a></aside>
 </div>`;
}
function world(slug){
 const w=WORLDS.find(w=>w.id===slug);
 if(!w)return unavailable('That world is not available.');
 const live=w.missions.some(m=>m[1]!=='planned');
 return `<div class="ns-lab5 ns-lab5-detail" data-world="${w.id}"><a href="#lab" class="ns-lab5-back">← All five worlds</a>
 ${hero('LIFE LAB / '+esc(w.theme.toUpperCase()),esc(w.title),esc(w.line),w.image,live?'<p class="ns-lab5-hero__note">One complete mission is ready to try. More are in development.</p>':'<p class="ns-lab5-hero__note">Interactive missions are being developed here. The linked tools below work now.</p>')}
 <section class="ns-lab5-section" aria-labelledby="ns-lab5-mission-head"><div class="ns-lab5-sectionhead"><div><p class="ns-lab5-eyebrow">PRACTICE PATH</p><h2 id="ns-lab5-mission-head">Three ways to practise</h2></div><p>Start wherever something feels relevant.</p></div><div class="ns-lab5-missions">${w.missions.map(([title,id],i)=>`<article class="ns-lab5-missioncard${id==='planned'?' is-planned':''}"><span class="ns-lab5-missioncard__number">0${i+1}</span><div><span class="ns-lab5-missioncard__status">${id==='planned'?'IN DEVELOPMENT':'READY TO TRY'}</span><h3>${esc(title)}</h3><p>${id==='planned'?'A future skill encounter. This is not yet an active activity.':'Investigate the difference between what happened, what you inferred and what remains unknown.'}</p></div>${id==='planned'?'<span class="ns-lab5-missioncard__soon">Coming later</span>':`<a href="#lab/mission/${id}/notice" class="ns-lab5-secondary">Start mission →</a>`}</article>`).join('')}</div></section>
 <section class="ns-lab5-section ns-lab5-tools" aria-labelledby="ns-lab5-tool-head"><div class="ns-lab5-sectionhead"><div><p class="ns-lab5-eyebrow">EXISTING, WORKING ACTIVITIES</p><h2 id="ns-lab5-tool-head">Practise with a tool</h2></div></div><div class="ns-lab5-toollinks">${w.tools.map(([title,href])=>`<a href="${href}"><span><strong>${esc(title)}</strong><small>Open the existing tool</small></span><span aria-hidden="true">→</span></a>`).join('')}</div></section></div>`;
}
function unavailable(message){return `<div class="ns-lab5 ns-lab5-unavailable"><a class="ns-lab5-back" href="#lab">← The Journey</a><h1>${esc(message)}</h1><p>That destination may be incomplete or the link may have changed. No mission data has been loaded.</p><a class="ns-lab5-primary" href="#lab">Explore The Journey →</a></div>`;}
const currentStep = step => STEPS.findIndex(s=>s.id===step);
const missionHref = step => `#lab/mission/reality-sorter/${step}`;
const nav = (i) => `<nav class="ns-lab5-missionnav" aria-label="Mission navigation"><a href="#lab/forest" class="ns-lab5-back">← The Forest</a><a href="#lab" class="ns-lab5-exit">Leave mission ×</a></nav>
<div class="ns-lab5-progress"><div class="ns-lab5-progress__copy"><span>STEP ${i+1} OF ${STEPS.length}</span><span>${STEPS[i].label}</span></div><div role="progressbar" aria-label="Mission stage" aria-valuemin="1" aria-valuemax="${STEPS.length}" aria-valuenow="${i+1}" class="ns-lab5-progress__bar"><span style="width:${100*(i+1)/STEPS.length}%"></span></div><div class="ns-vision-steps" aria-hidden="true">${STEPS.map((s,n)=>`<span class="${n<=i?'is-complete':''}"></span>`).join('')}</div></div>`;
function scene(){return `<div class="ns-lab5-scene"><span class="ns-lab5-scene__tag">THE SITUATION</span><div><span class="ns-lab5-scene__message">“I can’t make it tonight.”</span><p>You planned to meet a friend. They cancelled with this short message. You feel disappointed and start wondering why.</p></div><img src="ns-character-thinking.webp" alt="" loading="lazy"/></div>`;}
const navigation = (i,ready=true,nextText='Continue') => `<div class="ns-lab5-actions">${i>0?`<a class="ns-lab5-textbutton" href="${missionHref(STEPS[i-1].id)}">← Previous stage</a>`:'<a class="ns-lab5-textbutton" href="#lab/forest">← The Forest</a>'}${i<STEPS.length-1?`<button type="button" data-lab-action="next" class="ns-lab5-primary" ${ready?'':'disabled'}>${nextText} <span aria-hidden="true">→</span></button>`:'<a href="#lab/forest" class="ns-lab5-primary">Return to The Forest →</a>'}</div>`;
const chosen = (id,value) => mission[id]===value;
function notice(i){
 const complete=SORT.every(s=>Boolean(mission.sort[s.id]));
 const feedback=mission.sortChecked && complete;
 return `<div class="ns-lab5-stage"><p class="ns-lab5-eyebrow">01 · NOTICE THE DIFFERENCE</p><h1>Sort what happened from what it means.</h1><p>Four statements about the same moment. Select a category for each one. You can revise your choices after checking.</p>${scene()}
 <div class="ns-lab5-sort" aria-label="Sort statements by what they represent">${SORT.map((s,index)=>`<section class="ns-lab5-sortrow"><div class="ns-lab5-sortrow__head"><span>STATEMENT 0${index+1}</span>${mission.sort[s.id]?`<span class="ns-lab5-sortrow__chosen">${esc(CATEGORIES.find(c=>c.id===mission.sort[s.id])?.label)}</span>`:''}</div><p>${esc(s.text)}</p><div class="ns-lab5-sortrow__choices" role="group" aria-label="Classify statement ${index+1}">${CATEGORIES.map(c=>`<button type="button" class="${mission.sort[s.id]===c.id?'is-selected':''}" data-lab-action="sort" data-statement="${s.id}" data-category="${c.id}" aria-pressed="${String(mission.sort[s.id]===c.id)}" title="${esc(c.meaning)}">${esc(c.label)}</button>`).join('')}</div>${feedback?`<div class="ns-lab5-sortfeedback ${mission.sort[s.id]===s.answer?'is-accurate':'is-rethink'}"><strong>${mission.sort[s.id]===s.answer?'Useful distinction':'Consider another category'} · ${esc(CATEGORIES.find(c=>c.id===s.answer)?.label)}</strong><p>${esc(s.explanation)}</p></div>`:''}</section>`).join('')}</div>
 <div class="ns-lab5-note">This is a teaching exercise, not a test of your personality or emotions.</div>
 <div class="ns-lab5-actions"><a class="ns-lab5-textbutton" href="#lab/forest">← The Forest</a><div class="ns-lab5-actionpair"><button type="button" data-lab-action="check-sort" class="ns-lab5-outline" ${complete?'':'disabled'}>Check my sorting</button><button type="button" data-lab-action="next" class="ns-lab5-primary" ${feedback?'':'disabled'}>Explore explanations →</button></div></div></div>`;
}
function choiceCards(items,field,multi=false){const selected=mission[field];return `<div class="ns-lab5-choicegrid" role="group" aria-label="${multi?'Select possible explanations':'Select a response'}">${items.map((x,index)=>{const active=multi?selected.includes(x.id):selected===x.id;return `<button type="button" class="ns-lab5-choice ${active?'is-selected':''}" data-lab-action="${multi?'hypothesis':'select'}" data-field="${field}" data-value="${x.id}" aria-pressed="${String(active)}"><span class="ns-lab5-choice__number">0${index+1}</span><span>${esc(x.name)}</span><span aria-hidden="true" class="ns-lab5-choice__tick">${active?'✓':'○'}</span></button>`;}).join('')}</div>`;}
function explore(i){const chosen=mission.hypotheses.length;
return `<div class="ns-lab5-stage"><p class="ns-lab5-eyebrow">02 · EXPLORE ALTERNATIVES</p><h1>There is more than one possible story.</h1><p>Select at least two explanations that could fit the short message. You're not guessing the “right” motive—you are practising keeping several possibilities open.</p>${scene()}${choiceCards(HYPOTHESES,'hypotheses',true)}${chosen?`<div class="ns-lab5-feedback" role="status"><strong>${chosen} ${chosen===1?'possibility':'possibilities'} considered.</strong><p>${mission.hypotheses.map(id=>HYPOTHESES.find(x=>x.id===id)?.detail).filter(Boolean).map(esc).join(' ')}</p></div>`:''}${navigation(i,chosen>=2,'What evidence would help?')}</div>`;}
function evidence(i){const selected=EVIDENCE.find(x=>x.id===mission.evidence);
return `<div class="ns-lab5-stage"><p class="ns-lab5-eyebrow">03 · FIND BETTER EVIDENCE</p><h1>What would actually help you tell?</h1><p>You have several interpretations of the same event. Which new information would be most useful for distinguishing between them?</p>${choiceCards(EVIDENCE,'evidence')}${selected?`<div class="ns-lab5-feedback" role="status"><strong>${esc(selected.title)}</strong><p>${esc(selected.detail)}</p></div>`:''}${navigation(i,Boolean(selected),'Choose a response')}</div>`;}
function choose(i){const selected=RESPONSES.find(x=>x.id===mission.response);
return `<div class="ns-lab5-stage"><p class="ns-lab5-eyebrow">04 · PRACTISE A RESPONSE</p><h1>Uncertainty doesn't mean you cannot act.</h1><p>What might you say or do next? Choose a response to explore. There isn't one universally correct interpersonal response.</p>${choiceCards(RESPONSES,'response')}${selected?`<div class="ns-lab5-feedback" role="status"><strong>${esc(selected.title)}</strong><p>${esc(selected.detail)}</p></div>`:''}${navigation(i,Boolean(selected),'Plan a small experiment')}</div>`;}
function test(i){const selected=ACTIONS.find(x=>x.id===mission.action);
return `<div class="ns-lab5-stage"><p class="ns-lab5-eyebrow">05 · TAKE IT INTO LIFE</p><h1>What would you be willing to try?</h1><p>Choose one optional real-world step. Nothing here will be sent or scheduled. Sometimes the appropriate experiment is simply noticing what happens when you don't immediately chase certainty.</p>${choiceCards(ACTIONS,'action')}${selected?`<div class="ns-lab5-feedback" role="status"><strong>Your proposed next step</strong><p>${esc(selected.detail)}</p><p class="ns-lab5-feedback__caution">You can change your mind. Your friend's reaction cannot be predicted by this exercise.</p></div>`:''}${navigation(i,Boolean(selected),'Review what you learned')}</div>`;}
function takeaway(){const pick=ACTIONS.find(x=>x.id===mission.action);return `What I know: my friend cancelled, but I do not know why. My interpretation is only one possibility. I can look for useful evidence, choose a proportionate response and allow uncertainty. ${pick?`My possible next step: ${pick.name}`:'I have not chosen a next step.'}`;}
function review(i){const action=ACTIONS.find(x=>x.id===mission.action);
return `<div class="ns-lab5-stage ns-lab5-review"><p class="ns-lab5-eyebrow">06 · KEEP WHAT'S USEFUL</p><h1>Make the lesson yours.</h1><p>Being thoughtful doesn't require certainty. Here is a working takeaway you can use, revise or leave behind.</p><div class="ns-lab5-takeaway"><span class="ns-lab5-takeaway__mark" aria-hidden="true">✦</span><h2>A useful distinction</h2><p>You can know what happened without knowing why. An interpretation can be plausible without being proven.</p><div class="ns-lab5-takeaway__detail"><strong>${action?'A next step you considered':'Your real-world choice'}</strong><p>${action?esc(action.name):'No next step has been selected in this session. You can still use the general lesson.'}</p></div></div><div class="ns-lab5-copy"><label for="ns-lab5-summary">Your optional summary (editable after copying)</label><textarea id="ns-lab5-summary" rows="5" readonly>${esc(takeaway())}</textarea><button type="button" class="ns-lab5-outline" data-lab-action="copy">Copy this summary</button><span data-lab-copy-status aria-live="polite"></span></div><p class="ns-lab5-privacy">Your selections are not automatically saved. If you want to remember that you practised, you can explicitly mark this mission complete. You may also review a draft for your private Field Guide.</p><div class="ns-lab5-reviewlinks"><button class="ns-lab5-primary" type="button" data-lab-action="complete-forest">Finish mission and move Nobody forward →</button><span role="status" data-lab-complete-status></span><button class="ns-lab5-secondary" type="button" data-lab-action="field-guide">Review a Field Guide draft →</button><a class="ns-lab5-secondary" href="#account/maps">Open My Maps →</a><a class="ns-lab5-outline" href="#tool/reality-map">Try Reality Map →</a><button class="ns-lab5-outline" type="button" data-lab-action="restart">Try the scenario again ↻</button></div>${navigation(i)}</div>`;}
const STAGE_RENDERERS=[notice,explore,evidence,choose,test,review];
function missionPage(step){const i=currentStep(step);
 if(i<0)return unavailable('That mission stage is not available.');
 mission.started=true;
 return `<div class="ns-lab5 ns-lab5-experience" data-lab-mission="reality-sorter" data-vision-step="${esc(STEPS[i].id)}">${nav(i)}<div class="ns-lab5-workspace"><aside class="ns-lab5-workspace__side"><img src="ns-landscape-think.webp" alt=""/><span class="ns-lab5-eyebrow">THE FOREST / REALITY SORTER</span><h2>From one message to many possible meanings.</h2><p>Notice → Explore → Evidence → Choose → Test → Keep</p><small>Your selections exist only while this page remains open.</small></aside><div class="ns-lab5-workspace__main">${STAGE_RENDERERS[i](i)}</div></div></div>`;}
function focusAfterChange(root,match){const b=match?root.querySelector(match):null;if(b) b.focus({preventScroll:true});}
function attach(root){const controller=new AbortController();clean=()=>controller.abort();
 root.addEventListener('click', async (event)=>{
  const b=event.target.closest('[data-lab-action]');if(!b||!root.contains(b))return;
  const act=b.dataset.labAction;
  if(act==='copy'){
    const field=root.querySelector('#ns-lab5-summary');const status=root.querySelector('[data-lab-copy-status]');
    try{if(!navigator.clipboard?.writeText)throw Error('clipboard unavailable');await navigator.clipboard.writeText(field?.value||'');if(status)status.textContent='Copied to clipboard.';}
    catch{field?.focus();field?.select();if(status)status.textContent='Select the text above and copy it manually.';}
    return;
  }
  if(act==='complete-forest'){
    // Only mark complete after the actual five interactive stages were answered.
    const eligible=mission.sortChecked&&SORT.every(item=>Boolean(mission.sort[item.id]))&&mission.hypotheses.length>=2&&Boolean(mission.evidence)&&Boolean(mission.response)&&Boolean(mission.action);
    const status=root.querySelector('[data-lab-complete-status]');
    if(!eligible){if(status)status.textContent='Finish the earlier mission stages before saving completion.';return;}
    if(markLabNodeComplete('forest','reality-sorter')){location.hash='#lab/forest';}
    else if(status)status.textContent='Could not save completion. You can still return to the trail.';
    return;
  }
  if(act==='field-guide'){
    const selectedAction=ACTIONS.find(x=>x.id===mission.action);
    startFieldGuideDraft({title:'A useful distinction about uncertainty',category:'patterns',confidenceTag:'hypothesis',
      text:'I can know what happened without knowing why. An interpretation can be plausible without being proven.'+
        (selectedAction?' A possible next step I considered: '+selectedAction.name:''),
      context:'After practising the Forest Reality Sorter',sourceType:'lab',sourceId:'reality-sorter'});
    location.hash='#guide/new';return;
  }
  if(act==='restart'){mission=fresh();location.hash=missionHref('notice');if(location.hash===missionHref('notice'))renderCurrent();return;}
  if(act==='sort') {mission.sort[b.dataset.statement]=b.dataset.category;mission.sortChecked=false;renderCurrent(`[data-lab-action="sort"][data-statement="${b.dataset.statement}"][data-category="${b.dataset.category}"]`);return;}
  if(act==='check-sort'){if(SORT.every(x=>mission.sort[x.id])){mission.sortChecked=true;renderCurrent('[data-lab-action="check-sort"]');}return;}
  if(act==='hypothesis'){const v=b.dataset.value;let selected=[...mission.hypotheses];selected=selected.includes(v)?selected.filter(x=>x!==v):[...selected,v];mission.hypotheses=selected;renderCurrent(`[data-lab-action="hypothesis"][data-value="${v}"]`);return;}
  if(act==='select'){const field=b.dataset.field, value=b.dataset.value;if(['evidence','response','action'].includes(field)){mission[field]=value;renderCurrent(`[data-lab-action="select"][data-value="${value}"]`);}return;}
  if(act==='next'){
   const current=location.hash.split('/').at(-1);const i=currentStep(current);
   if(i===0 && (!SORT.every(x=>mission.sort[x.id])||!mission.sortChecked))return;
   if(i===1 && mission.hypotheses.length<2)return;
   if(i===2 && !mission.evidence || i===3 && !mission.response || i===4 && !mission.action)return;
   if(i>=0 && i<STEPS.length-1)location.hash=missionHref(STEPS[i+1].id);
   return;
  }
 },{signal:controller.signal});
 function renderCurrent(focusQuery){const step=location.hash.split('/').at(-1);root.innerHTML=missionPage(step);if(focusQuery)focusAfterChange(root,focusQuery);}
}
/** Called by the existing hash router. The parser keeps older #lab/<world> routes. */
export function renderNSLab(main,parts=[]){
 const segs=Array.isArray(parts)?parts:[];
 const [first,second,third,...extra]=segs;
 let inner;
 if(!first){renderLifeLabV3(main,[]);return;}
 else if(first==='mission')inner=(!extra.length&&second==='reality-sorter')?missionPage(third||'notice'):unavailable('That mission is not available.');
 else if(first==='lesson'&&second&&third&&!extra.length){renderLifeLabV3(main,[second,third]);return;}
 else if(segs.length===1){renderLifeLabV3(main,segs);return;}
 else inner=unavailable('That The Journey page is not available.');
 main.innerHTML=inner;
 if(main.querySelector('[data-lab-mission]'))attach(main.querySelector('[data-lab-mission]'));
}
/** Read-only testing exports: no user data. */
export const lifeLabDefinition=Object.freeze({worlds:WORLDS.map(w=>({id:w.id,missions:w.missions.map(([title,id])=>({title,id}))})),stages:STEPS.map(s=>s.id),sortStatements:SORT.map(s=>({id:s.id,answer:s.answer}))});
