/** A private, one-session ACT-style noticing and urge-surfing quick tool.
 * No analytics, storage, sync, or URL parameters carry a user's urge.
 */
import {escapeHTML as esc} from './core.mjs';

const OPTIONS = [
  ['phone','check my phone'],
  ['scroll','scroll through social media'],
  ['porn','watch porn'],
  ['reassurance','seek reassurance'],
  ['delay','put off a task'],
  ['spend','buy something impulsively'],
  ['other','something else']
];
const NEXT_STEPS = [
  'Return to what I was doing',
  'Stand up and change rooms',
  'Get a drink of water',
  'Take a short walk',
  'Do one small part of my task'
];
const safe = value => esc(String(value ?? ''));
const clip = (value, max=120) => String(value ?? '').trim().replace(/\s+/g,' ').slice(0,max);
const button = (label,action,secondary=false) =>
  '<button type="button" class="ns-urge-button'+(secondary?' ns-urge-button--quiet':'')+'" data-urge-action="'+action+'">'+label+'</button>';
const backLink = '<a class="ns-urge-back" href="#guide/quick-tools">← Quick Access Tools</a>';

function intro(demo) {
  return '<div class="ns-guide6 ns-urge"><div class="ns-urge-wrap">'+backLink+
    '<div class="ns-urge-card"><p class="ns-guide6-kicker">QUICK ACCESS TOOLS · A MOMENT TO CHOOSE</p>'+
    '<h1 tabindex="-1">The Urge Pause</h1><p class="ns-urge-lead">You can feel pulled to do something without having to do it.</p>'+
    '<h2>First, what does “being the observer” mean?</h2>'+
    '<p>It simply means <strong>noticing what is happening in your mind</strong>. A thought or desire can pop up without you deciding to have it. You can notice it just as you notice a sound. You do not need to stop it or believe it is an instruction.</p>'+
    '<div class="ns-urge-demo"><p class="ns-urge-kicker">TRY A TINY EXAMPLE</p>'+
    '<p class="ns-urge-demo-line">'+(demo?'<span>Observing:</span> “I am noticing an urge to check my phone.”':'<span>Caught up in it:</span> “I have to check my phone.”')+'</p>'+
    '<p class="ns-urge-caption">'+(demo?'The urge may still be there. Now you are describing it rather than automatically following it.':'Try changing how you say the same experience.')+'</p>'+
    button(demo?'See the first sentence':'Try observing it','demo',true)+'</div>'+
    '<p class="ns-urge-small">This is a skill, not a test. You do not have to feel calm, agree with the thought, or make the urge disappear.</p>'+
    '<div class="ns-urge-actions">'+button('Use this with my own urge →','choose')+'</div></div></div></div>';
}

function chooser(error) {
  return '<div class="ns-guide6 ns-urge"><div class="ns-urge-wrap">'+backLink+
    '<div class="ns-urge-card"><p class="ns-guide6-kicker">MAKE IT YOUR OWN</p><h1 tabindex="-1">What are you feeling pulled to do?</h1>'+
    '<p>Choose an example or describe your own. Think of an action, such as “open social media” or “send another message”. This stays on this screen; it is not saved to your Field Guide.</p>'+
    '<form data-urge-form="choose"><fieldset class="ns-urge-choices"><legend>I am having an urge to…</legend>'+
    OPTIONS.map((opt,i)=>'<label class="ns-urge-choice"><input type="radio" name="urge" value="'+safe(opt[0])+'" '+(i===0?'checked':'')+'><span>'+safe(opt[1])+'</span></label>').join('')+
    '</fieldset><label class="ns-urge-field" for="ns-urge-custom">Or write your own action <small>(optional unless you chose “something else”)</small></label>'+
    '<input id="ns-urge-custom" name="custom" type="text" maxlength="120" autocomplete="off" placeholder="e.g. check whether they replied">'+
    (error?'<p class="ns-urge-error" role="alert">'+safe(error)+'</p>':'')+
    '<div class="ns-urge-actions">'+button('Back','intro',true)+'<button class="ns-urge-button" type="submit">Start my pause →</button></div>'+
    '</form></div></div></div>';
}

function steps(action) {
  const a=safe(action);
  return [
    {title:'Recognise',line:'“I want to '+a+'.”',copy:'Notice the pull, without arguing with it. You are recognising what is happening, not promising to act.'},
    {title:'Name',line:'“I am noticing an urge to '+a+'.”',copy:'Now you are putting words around the urge. There is a difference between experiencing something and being carried straight into doing it.'},
    {title:'Notice',line:'“This urge appeared. I did not have to invite it.”',copy:'Where do you notice it? Perhaps your body feels restless, your attention keeps returning to an image, or it is mostly a thought. You can leave the sensation as it is.'},
    {title:'Unhook',line:'“This urge is real, but it is not an instruction.”',copy:'You do not have to pretend you never wanted it. A thought or desire is one part of your experience, not your whole identity or a rule you must follow.'},
    {title:'Choose',line:'“I can want to '+a+' and still decide what I do.”',copy:'You may genuinely want the short-term reward. You might also want something else from your day. What do you want to choose for the next few minutes?'},
    {title:'Continue',line:'“I can carry on, even if the urge comes with me.”',copy:'Choose one small action and begin it. You do not need to wait until the urge is gone. If it comes back, you can notice it again.'}
  ];
}

function exercise(action,step,notice,nextAction) {
  const s=steps(action)[step];
  const options=step===2?'<div class="ns-urge-notice"><p class="ns-urge-ask">What are you noticing?</p><div class="ns-urge-chips">'+
    ['Mostly a thought','A body sensation','Both','Not sure'].map(x=>'<button type="button" data-urge-notice="'+safe(x)+'" aria-pressed="'+String(notice===x)+'" class="'+(notice===x?'is-selected':'')+'">'+safe(x)+'</button>').join('')+
    '</div><p class="ns-urge-caption">There is no correct answer, and you can skip this.</p></div>':'';
  const next=step===5?'<div class="ns-urge-next"><label for="ns-urge-next-action">What small thing will you do next? <small>Optional</small></label>'+
    '<div class="ns-urge-chips">'+NEXT_STEPS.map(x=>'<button type="button" data-urge-next="'+safe(x)+'" aria-pressed="'+String(nextAction===x)+'" class="'+(nextAction===x?'is-selected':'')+'">'+safe(x)+'</button>').join('')+'</div>'+
    '<input type="text" id="ns-urge-next-action" maxlength="120" autocomplete="off" placeholder="Or write another small step" value="'+safe(nextAction)+'"></div>':'';
  return '<div class="ns-guide6 ns-urge"><div class="ns-urge-wrap">'+backLink+
    '<div class="ns-urge-card"><div class="ns-urge-progress-head"><p class="ns-guide6-kicker">YOUR URGE PAUSE</p><span>Step '+(step+1)+' of 6</span></div>'+
    '<div class="ns-urge-progress" role="progressbar" aria-label="Exercise progress" aria-valuemin="1" aria-valuemax="6" aria-valuenow="'+(step+1)+'"><span style="width:'+((step+1)/6*100)+'%"></span></div>'+
    '<p class="ns-urge-current">Working with: <strong>'+safe(action)+'</strong> <button type="button" data-urge-action="choose">Change</button></p>'+
    '<div class="ns-urge-stage" aria-live="polite"><p class="ns-urge-kicker">'+(step+1)+' · '+safe(s.title)+'</p>'+
    '<h1 tabindex="-1">'+s.line+'</h1><p>'+safe(s.copy)+'</p></div>'+options+next+
    '<div class="ns-urge-actions">'+button('← Back','previous',true)+button(step===5?'Finish this pause →':'Continue →',step===5?'finish':'next')+'</div>'+
    '<p class="ns-urge-small">The aim is choice, not forcing the feeling away. You can stop or come back at any point.</p></div></div></div>';
}

function complete(action,nextAction) {
  return '<div class="ns-guide6 ns-urge"><div class="ns-urge-wrap">'+backLink+
    '<div class="ns-urge-card ns-urge-finish"><p class="ns-guide6-kicker">PAUSE COMPLETE</p><h1 tabindex="-1">The urge does not have to decide for you.</h1>'+
    '<p>You noticed the pull to <strong>'+safe(action)+'</strong>, put some space around it, and considered what to do. The urge might remain or return. That does not undo the practice.</p>'+
    (nextAction?'<div class="ns-urge-plan"><span>YOUR NEXT STEP</span><strong>'+safe(nextAction)+'</strong></div>':
    '<div class="ns-urge-plan"><span>YOUR NEXT STEP</span><strong>Return to one small part of your day.</strong></div>')+
    '<p class="ns-urge-small">Not every urge needs resisting. If it reflects a genuine need or safety concern, respond to that need. This exercise is a choice aid, not a substitute for appropriate support with serious compulsions.</p>'+
    '<div class="ns-urge-actions">'+button('Try another urge','choose',true)+button('Repeat this pause','repeat',true)+'<a class="ns-urge-button" href="#guide/quick-tools">Return to my day →</a></div>'+
    '</div></div></div>';
}

/** Returns a cleanup function so a new visit never sees prior private input. */
export function renderNSUrgePause(main) {
  const controller=new AbortController();
  const state={phase:'intro',demo:false,action:'',step:0,notice:'',nextAction:''};
  const paint=(focus=false)=>{
    if(state.phase==='intro')main.innerHTML=intro(state.demo);
    else if(state.phase==='choose')main.innerHTML=chooser('');
    else if(state.phase==='steps')main.innerHTML=exercise(state.action,state.step,state.notice,state.nextAction);
    else main.innerHTML=complete(state.action,state.nextAction);
    if(focus)main.querySelector('.ns-urge h1')?.focus({preventScroll:true});
  };
  main.addEventListener('click',event=>{
    const click=event.target.closest('[data-urge-action], [data-urge-notice], [data-urge-next]');
    if(!click || !main.contains(click))return;
    if(click.dataset.urgeNotice){
      state.notice=click.dataset.urgeNotice;
      main.querySelectorAll('[data-urge-notice]').forEach(el=>{
        const chosen=el.dataset.urgeNotice===state.notice;
        el.classList.toggle('is-selected',chosen);el.setAttribute('aria-pressed',String(chosen));
      });
      return;
    }
    if(click.dataset.urgeNext){
      state.nextAction=clip(click.dataset.urgeNext);
      main.querySelector('#ns-urge-next-action').value=state.nextAction;
      main.querySelectorAll('[data-urge-next]').forEach(el=>{
        const chosen=el.dataset.urgeNext===state.nextAction;
        el.classList.toggle('is-selected',chosen);el.setAttribute('aria-pressed',String(chosen));
      });
      return;
    }
    const action=click.dataset.urgeAction;
    if(action==='demo')state.demo=!state.demo;
    else if(action==='intro')state.phase='intro';
    else if(action==='choose')state.phase='choose';
    else if(action==='previous'){if(state.step>0)state.step--;else state.phase='choose';}
    else if(action==='next'){state.step=Math.min(5,state.step+1);}
    else if(action==='finish'){state.nextAction=clip(main.querySelector('#ns-urge-next-action')?.value||state.nextAction);state.phase='done';}
    else if(action==='repeat'){state.step=0;state.notice='';state.nextAction='';state.phase='steps';}
    else return;
    paint(action!=='demo');
    if(action==='demo')main.querySelector('[data-urge-action="demo"]')?.focus();
  },{signal:controller.signal});
  main.addEventListener('submit',event=>{
    const form=event.target.closest('[data-urge-form="choose"]');
    if(!form)return;
    event.preventDefault();
    const selected=form.querySelector('input[name="urge"]:checked')?.value||'phone';
    const custom=clip(form.elements.namedItem('custom')?.value);
    const preset=OPTIONS.find(opt=>opt[0]===selected);
    const action=selected==='other'?clip(custom.replace(/^(?:i\s+(?:want|need|have)\s+to\s+|to\s+)/i,'')):preset?.[1]||'';
    if(!action){
      const error=form.querySelector('.ns-urge-error')||document.createElement('p');
      error.className='ns-urge-error';error.setAttribute('role','alert');
      error.textContent='Write a short action to use your own urge.';
      form.querySelector('.ns-urge-actions')?.before(error);
      form.elements.namedItem('custom')?.focus();
      return;
    }
    state.action=action;state.step=0;state.notice='';state.nextAction='';state.phase='steps';paint(true);
  },{signal:controller.signal});
  main.addEventListener('input',event=>{
    if(event.target.id==='ns-urge-next-action'){
      state.nextAction=clip(event.target.value);
      main.querySelectorAll('[data-urge-next]').forEach(el=>{
        const chosen=el.dataset.urgeNext===state.nextAction;
        el.classList.toggle('is-selected',chosen);el.setAttribute('aria-pressed',String(chosen));
      });
    }
    if(event.target.id==='ns-urge-custom' && clip(event.target.value)){
      main.querySelector('input[name="urge"][value="other"]')?.click();
    }
  },{signal:controller.signal});
  paint();
  return ()=>controller.abort();
}
