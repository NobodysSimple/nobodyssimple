/* Direct support activities: self-chosen, optional and non-diagnostic.
 * No accounts, localStorage, cookies, server calls or automatic saving.
 */
import {escapeHTML as escape} from './core.mjs';
import {getNeedsActivity} from './ns-needs-catalog.mjs';
const e=value=>escape(String(value??''));
export const PROCESSING_ACTIVITIES=Object.freeze({
 'process-feel':{
  title:'Make room for a feeling',lead:'You can experience an emotion without naming, changing or solving it.',
  prompts:['What is present right now? A word, sensation or “not sure” is enough.','If the feeling could have some space, what might that look like?','Is there something you would prefer not to push away or analyse?','What would help you care for yourself while this feeling is here?'],
  finish:'You do not need to feel better to have given an experience some room.',
  complement:'mixed-feelings'
 },
 'process-express':{
  title:'Express what is inside',lead:'Write freely, sketch privately, or speak aloud. You decide what stays private and whether anything needs sharing.',
  prompts:['What do you want to say, without editing it for somebody else?','What is the emotion or wish underneath these words?','Which parts, if any, would you actually want another person to hear?','What would you prefer to keep private, or leave unsaid?'],
  finish:'Expression does not have to become a message, confession or conversation.',
  complement:'emotion-check-in'
 },
 'process-event':{
  title:'Make sense of an experience',lead:'Describe what happened, what stayed with you and what it meant. You do not have to find a lesson.',
  prompts:['What happened? Share only as much as feels useful.','Which part is staying with you now?','Why might that part matter to you, without assuming one explanation?','Is there a feeling, need or unanswered question you want to acknowledge?'],
  finish:'Some experiences remain unfinished or ambiguous. Understanding does not require closure.',
  complement:'emotion-timeline'
 },
 'process-reaction':{
  title:'Understand your reaction',lead:'Explore your response without immediately treating it as irrational or pathological.',
  prompts:['What did you notice yourself feeling, thinking or doing?','What happened around you immediately before the reaction?','What expectation, value, need or circumstance might be relevant?','Are there other explanations you want to keep open?'],
  finish:'Your reaction may make more sense when you understand the context. It does not have to be reduced to one cause.',
  complement:'function-finder'
 },
 'process-mixed':{
  title:'Hold mixed feelings',lead:'More than one feeling can be real. You do not have to pick the “correct” one.',
  prompts:['What are the different feelings or wishes that seem to coexist?','What might each feeling be connected to or protecting?','What becomes difficult when you try to force one feeling to win?','Is there a way to make space for both without making a decision now?'],
  finish:'Contradictory feelings are not necessarily a problem to eliminate.',
  complement:'mixed-feelings'
 },
 'process-grief':{
  title:'Make room for grief or loss',lead:'There is no required timeline, emotional sequence or obligation to find a silver lining.',
  prompts:['What or whom are you missing, anticipating losing or grieving?','What has changed, or what has stayed meaningful?','What feelings are here, even if they are complicated or surprising?','Is there a way you would like to remember, connect, rest or ask for support?'],
  finish:'Grief is not a task you must finish. You can return to this when and if it helps.',
  complement:'grief-date'
 },
 'process-compassion':{
  title:'Respond to yourself more fairly',lead:'Self-compassion is not pretending everything was fine or denying responsibility.',
  prompts:['What are you saying to yourself about this experience?','Which parts reflect a genuine responsibility, and which are global attacks on your worth?','What would a fair and compassionate response acknowledge?','What would appropriate care, repair or support look like now?'],
  finish:'You can take responsibility without making yourself the whole problem.',
  complement:'shame-context'
 },
 'process-closure':{
  title:'Explore closure or acceptance',lead:'Closure is not always possible or necessary. Some things can matter without being resolved.',
  prompts:['What remains unfinished, unanswered or hard to accept?','Which parts might be within your influence, and which are not?','Is there anything you would like to express, do or acknowledge?','What might it mean to carry this forward without forcing certainty?'],
  finish:'You may leave something unresolved without giving it your entire attention.',
  complement:'values-discovery'
 }
});
export const SETTLING_ACTIVITIES=Object.freeze({
 'steady-overwhelm':{title:'Reduce the load',lead:'You do not need to understand every feeling before taking some pressure off.',strategies:[
  {title:'Change one demand',steps:['Notice what is demanding your attention.','Choose one demand that can wait, move or be shared.','Make only that adjustment and check whether the situation is more workable.'],tool:'load-balancer'},
  {title:'Orient without analysing',steps:['Notice the place around you.','Feel a comfortable point of contact, such as a chair or the floor.','Choose one thing that is safe and manageable to attend to next.'],tool:'grounding'},
  {title:'Give yourself permission to pause',steps:['Step away from avoidable input if you can.','Choose a short rest, some privacy, water or another ordinary need.','Return to decisions when more capacity is available.'],tool:'state-check'}
 ]},
 'steady-panic':{title:'Steady during familiar panic',lead:'Choose a tolerable response. Never assume a new or severe physical symptom is “just anxiety”.',notice:'For severe difficulty breathing, sudden persistent chest pain, collapse or other emergency symptoms, call 999. New or unusual symptoms should be medically assessed.',strategies:[
  {title:'Orient to the present',steps:['If safe, notice where you are and what is around you.','Name a few neutral things you can see or feel.','Let attention return to what is happening now, without forcing calm.'],tool:'grounding'},
  {title:'Reduce extra demands',steps:['Stop unnecessary tasks or move away from avoidable noise.','Choose a comfortable position and loosen any avoidable pressure.','Use the response that has previously been safe and helpful for you.'],tool:'quick-reset'},
  {title:'Prepare for familiar episodes',steps:['Identify the situations in which this familiar experience tends to appear.','Write down a brief, safe plan and when to seek medical care.','Consider professional support if attacks are repeated or impairing.'],tool:'panic-preparation'}
 ]},
 'steady-sensory':{title:'Adjust your sensory environment',lead:'Your environment can need changing; you do not need to override every sensory need.',strategies:[
  {title:'Reduce one input',steps:['Notice which input feels least tolerable: sound, light, touch, movement or crowding.','Adjust only one controllable input where possible.','Notice whether you need further support or rest.'],tool:'quick-reset'},
  {title:'Choose useful sensory input',steps:['Think about whether comfort would come from more or less stimulation.','Try a safe familiar texture, movement or sound.','Keep it optional; your preferences can change.'],tool:'sensory-recipe'},
  {title:'Make the setting easier next time',steps:['Identify which part of the setting increased the load.','Consider a realistic adjustment or access need.','Prepare a request or plan only when you have capacity.'],tool:'environment-design'}
 ]},
 'steady-anger':{title:'Make a safe pause for anger',lead:'Anger can communicate something important. A pause protects the choices you make next.',strategies:[
  {title:'Pause an impulsive response',steps:['If it is safe, delay sending a message or escalating an argument.','Choose distance, movement, quiet or a short change of scene.','Return to the issue only when you can choose how to respond.'],tool:'anger-pause'},
  {title:'Notice what is being crossed',steps:['Ask what expectation, value, injustice or boundary may be involved.','Separate what happened from what you inferred about motive.','You can acknowledge the anger without deciding on action yet.'],tool:'emotion-check-in'},
  {title:'Prepare a reasonable request',steps:['Identify a concrete change you want.','Consider whether it is safe and appropriate to raise it.','Ask for a specific adjustment rather than assuming the other person can read your mind.'],tool:'needs-clarifier'}
 ]},
 'steady-disconnected':{title:'Reconnect gently',lead:'Feeling frozen, distant or numb is not a demand to force emotion to return.',strategies:[
  {title:'Reorient to your surroundings',steps:['Notice a neutral detail in the room.','Feel the surface supporting your body if that is comfortable.','Name where you are and what you might want next.'],tool:'grounding'},
  {title:'Lower the pressure',steps:['Reduce unnecessary demands or sensory input where possible.','Choose warmth, a familiar object or a quiet pause if useful.','You do not have to explain the experience immediately.'],tool:'state-check'},
  {title:'Prepare an easier way to communicate',steps:['If words are difficult, consider a short written message or agreed signal.','Choose what you need someone else to know.','Seek appropriate support if the experience is new, recurrent or seriously impairing.'],tool:'shutdown-card'}
 ]},
 'steady-depleted':{title:'Respect reduced capacity',lead:'Exhaustion is not automatically a failure of discipline. Health, care and environmental factors can matter.',strategies:[
  {title:'Check basic needs and health',steps:['Consider sleep, food, hydration, illness, medication and pain.','Choose one realistic need to address if possible.','Seek medical advice for persistent, unexplained or concerning fatigue.'],tool:'state-check'},
  {title:'Reduce demands',steps:['List what truly cannot wait.','Move, share or lower one non-essential demand.','Avoid planning an ambitious recovery routine while exhausted.'],tool:'burnout-adjustments'},
  {title:'Take a small restorative pause',steps:['Choose a familiar restful activity without a productivity target.','Limit avoidable input for a moment.','Consider support if rest is persistently impossible.'],tool:'load-balancer'}
 ]},
 'steady-restless':{title:'Find a tolerable reset',lead:'Some people need movement or more stimulation rather than stillness.',strategies:[
  {title:'Try comfortable movement',steps:['If it is safe for your body, stretch or move in a way you enjoy.','Avoid turning it into a performance test.','Notice which amount of movement feels workable.'],tool:'stim-space'},
  {title:'Adjust the stimulation',steps:['Notice whether boredom, sensory mismatch or stress may be involved.','Change one sound, texture or activity if helpful.','Your needs may differ from somebody else’s.'],tool:'sensory-profile'},
  {title:'Choose an engaging small action',steps:['Pick a short and low-pressure activity that matters to you.','Make the first move easy.','Stop when you wish; restlessness does not always require a task.'],tool:'small-step'}
 ]},
 'savour-good':{title:'Spend a moment with something good',lead:'You can appreciate, celebrate or enjoy without first finding a problem.',strategies:[
  {title:'Savour one detail',steps:['Choose a good, neutral or meaningful moment.','Notice one particular detail you appreciate.','Allow the experience to be as it is without trying to amplify it.'],tool:'positive-memory'},
  {title:'Recognise something meaningful',steps:['Notice what felt worth appreciating.','Consider whether it points toward something you value.','You do not need to turn it into a lesson or a gratitude list.'],tool:'gratitude'},
  {title:'Share or express joy',steps:['If you want, write a few words, take a private photo or tell somebody.','Consider what feels authentic rather than performative.','It is also fine to keep the moment to yourself.'],tool:'positive-memory'}
 ]}
});
const support=[
 {name:'Immediate danger',copy:'If you or another person cannot be kept safe, call 999 or attend A&E.',url:'https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/'},
 {name:'Urgent mental health support',copy:'In the UK call NHS 111 and select the mental health option for urgent help.',url:'https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/'},
 {name:'Concerned about coercion or domestic abuse',copy:'Confidential support is available. If someone monitors your devices, consider whether accessing resources on your device is safe.',url:'https://www.nhs.uk/live-well/getting-help-for-domestic-violence/'},
 {name:'Physical health concerns',copy:'New, severe or changing physical symptoms may need urgent clinical assessment, not a psychological exercise.',url:'https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/'},
 {name:'Someone to listen',copy:'Samaritans can be reached in the UK on 116 123. You do not have to be suicidal to call.',url:'https://www.samaritans.org/how-we-can-help/contact-samaritan/'}
];
const shell=(body,mode)=>'<div class="ns-needs ns-need-activity"><nav class="ns-needs-top" aria-label="Activity navigation">'+
 '<a href="#navigate/'+e(mode||'')+'">← Back to choices</a><a href="#navigate">Change direction</a></nav>'+body+'</div>';
function downloadLocal(filename,content){
 const blob=new Blob([content],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob);
 const link=document.createElement('a');link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function renderSupport(root){
 root.innerHTML=shell('<header class="ns-needs-header ns-tone-peach"><p class="ns-needs-eyebrow">SAFETY AND PRACTICAL SUPPORT</p>'+
 '<h1>Support and safety come first</h1><p>If someone threatens, controls or monitors you, you do not have to confront them or complete a worksheet. You can choose safe practical support instead.</p></header>'+
 '<section class="ns-needs-panel"><h2>Ways to get help</h2><div class="ns-needs-support-list">'+
 support.map(x=>'<article><h3>'+e(x.name)+'</h3><p>'+e(x.copy)+'</p><a href="'+e(x.url)+'" target="_blank" rel="noopener noreferrer">Official guidance and support ↗</a></article>').join('')+
 '</div><p class="ns-needs-footnote">You do not need to describe private experiences to access these links. This page does not assess risk or replace emergency care.</p></section>','relate');
}
function renderProcess(root,id){
 const activity=PROCESSING_ACTIVITIES[id];
 const chosen=getNeedsActivity(id);
 if(!activity||!chosen)return;
 let step=0,done=false;
 const notes=activity.prompts.map(()=>''),safeName=id.replace(/[^a-z0-9-]/g,'');
 const head='<header class="ns-needs-header ns-tone-rose"><p class="ns-needs-eyebrow">PROCESSING STUDIO · OPTIONAL REFLECTION</p><h1>'+e(activity.title)+'</h1>'+
 '<p>'+e(activity.lead)+'</p></header>';
 const paint=()=>{
  const section=done?
   '<section class="ns-needs-panel ns-process-finish"><span class="ns-needs-finish-icon" aria-hidden="true">♡</span><h2>Enough for now</h2><p>'+e(activity.finish)+'</p>'+
   '<p>You can return to ordinary life without needing a conclusion or a changed mood.</p>'+
   '<div class="ns-needs-actions"><button type="button" data-process-resume>Return to your reflection</button>'+
   '<button type="button" data-process-download '+(notes.some(v=>v.trim())?'':'disabled')+'>Download my private notes</button>'+
   '<button type="button" data-process-erase>Clear notes</button></div></section>':
   '<section class="ns-needs-panel ns-process-studio"><p class="ns-needs-eyebrow">PROMPT '+(step+1)+' OF '+activity.prompts.length+' · ALL OPTIONAL</p>'+
   '<div class="ns-process-track" role="progressbar" aria-label="Optional prompts" aria-valuemin="0" aria-valuemax="'+activity.prompts.length+
   '" aria-valuenow="'+step+'"><span style="width:'+((step+1)/activity.prompts.length*100)+'%"></span></div>'+
   '<h2>'+e(activity.prompts[step])+'</h2><label class="ns-needs-sr" for="ns-process-text">Private notes (optional)</label>'+
   '<textarea id="ns-process-text" rows="7" maxlength="5000" placeholder="You can write a few words, a lot, or nothing.">'+e(notes[step])+'</textarea>'+
   '<p class="ns-needs-footnote">Nothing is automatically saved or sent to the app. You can skip, finish or erase your words whenever you like.</p>'+
   '<div class="ns-needs-actions">'+(step>0?'<button type="button" class="secondary" data-process-prev>← Previous</button>':'')+
   '<button type="button" class="secondary" data-process-skip>Skip</button>'+
   (step<activity.prompts.length-1?'<button type="button" data-process-next>Next prompt →</button>':'')+
   '<button type="button" class="secondary" data-process-finish>Finish for now</button></div></section>';
  root.innerHTML=shell(head+section+'<p class="ns-needs-footnote">'+
   'Processing is not a test of how quickly sadness, anger or grief disappears. If reflection becomes too distressing, you can stop or switch to '+ 
   '<a href="#navigate/regulate">feeling steadier</a>.</p>','process');
  const update=()=>{const input=root.querySelector('#ns-process-text');if(input)notes[step]=input.value};
  root.querySelector('#ns-process-text')?.addEventListener('input',update);
  root.querySelector('[data-process-prev]')?.addEventListener('click',()=>{update();step=Math.max(0,step-1);paint()});
  root.querySelector('[data-process-next]')?.addEventListener('click',()=>{update();step=Math.min(activity.prompts.length-1,step+1);paint()});
  root.querySelector('[data-process-skip]')?.addEventListener('click',()=>{update();if(step<activity.prompts.length-1)step++;else done=true;paint()});
  root.querySelector('[data-process-finish]')?.addEventListener('click',()=>{update();done=true;paint()});
  root.querySelector('[data-process-resume]')?.addEventListener('click',()=>{done=false;paint()});
  root.querySelector('[data-process-erase]')?.addEventListener('click',()=>{notes.fill('');step=0;done=false;paint()});
  root.querySelector('[data-process-download]')?.addEventListener('click',()=>{
   downloadLocal('nobodyssimple-'+safeName+'-notes.txt',
    ['Nobody’s Simple · Private processing notes',activity.title,'',
     ...activity.prompts.flatMap((q,i)=>[q,notes[i]||'','']),
     'This is an optional reflection, not a diagnosis or therapy assessment.'].join('\n'));
  });
 };
 paint();
}
function renderSteady(root,id){
 const activity=SETTLING_ACTIVITIES[id],chosen=getNeedsActivity(id);
 if(!activity||!chosen)return;
 let active=0;
 const paint=()=>{
  const option=activity.strategies[active];
  root.innerHTML=shell('<header class="ns-needs-header ns-tone-sage"><p class="ns-needs-eyebrow">FEEL STEADIER · NO QUESTIONNAIRE</p>'+
   '<h1>'+e(activity.title)+'</h1><p>'+e(activity.lead)+'</p></header>'+
   (activity.notice?'<aside class="ns-needs-alert" role="note"><strong>Health and safety note</strong><p>'+e(activity.notice)+'</p>'+
     '<a href="https://www.nhs.uk/nhs-services/urgent-and-emergency-care-services/" target="_blank" rel="noopener noreferrer">NHS urgent care guidance ↗</a></aside>':'')+
   '<section class="ns-needs-panel"><h2>Choose an approach that fits</h2>'+
   '<div class="ns-steady-options" role="group" aria-label="Ways to feel steadier">'+
   activity.strategies.map((p,i)=>'<button type="button" data-steady-option="'+i+'" aria-pressed="'+(i===active)+'">'+e(p.title)+'</button>').join('')+'</div>'+
   '<div class="ns-steady-content"><h3>'+e(option.title)+'</h3><ol>'+
   option.steps.map(s=>'<li>'+e(s)+'</li>').join('')+'</ol><p>Notice whether this is useful. If not, you can choose a different approach or stop.</p></div>'+
   '<div class="ns-needs-actions"><a class="ns-needs-action-link" href="#tool/'+e(option.tool)+'">Open a related interactive tool →</a>'+
   '<a class="ns-needs-action-link secondary" href="#navigate/process">I would rather process how I feel</a></div></section>'+
   '<p class="ns-needs-footnote">There is no required outcome or time limit. Strategies differ in suitability and should not substitute for care when symptoms are new or serious.</p>',chosen.mode);
  root.querySelectorAll('[data-steady-option]').forEach(button=>button.addEventListener('click',()=>{
   active=Number(button.dataset.steadyOption);paint();
  }));
 };
 paint();
}
export function renderNeedsActivity(root,id){
 if(id==='support-safety')return renderSupport(root);
 if(PROCESSING_ACTIVITIES[id])return renderProcess(root,id);
 if(SETTLING_ACTIVITIES[id])return renderSteady(root,id);
 root.innerHTML=shell('<section class="ns-needs-panel"><h1>Activity not found</h1>'+
 '<p>This activity is not available. Choose another starting point instead.</p><a href="#navigate">Back to the navigator</a></section>','');
}
