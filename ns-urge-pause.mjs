/** A private, one-session ACT-style noticing and urge-surfing quick tool.
 * No analytics, storage, sync, or URL parameters carry a user's urge.
 */
import {escapeHTML as esc} from './core.mjs';

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
    '<p>It simply means <strong>noticing what is happening in your mind</strong>. A thought or desire can pop up without you deciding to have it. You can notice it just as you notice a sound. Noticing the desire does not mean you have to follow it.</p>'+
    '<div class="ns-urge-demo"><p class="ns-urge-kicker">TRY A TINY EXAMPLE</p>'+
    '<p class="ns-urge-demo-line">'+(demo?'<span>Observing:</span> “I am noticing an urge to check my phone.”':'<span>Caught up in it:</span> “I have to check my phone.”')+'</p>'+
    '<p class="ns-urge-caption">'+(demo?'The urge may still be there. Now you are describing it rather than automatically following it.':'Try changing how you say the same experience.')+'</p>'+
    button(demo?'See the first sentence':'Try observing it','demo',true)+'</div>'+
    '<p class="ns-urge-small">This is a skill, not a test. You do not have to feel calm, agree with the thought, or make the urge disappear.</p>'+
    '<div class="ns-urge-actions">'+button('Use this with my own urge →','choose')+'</div></div></div></div>';
}

function chooser(value='',error='') {
  return '<div class="ns-guide6 ns-urge"><div class="ns-urge-wrap">'+backLink+
    '<div class="ns-urge-card"><p class="ns-guide6-kicker">MAKE IT YOUR OWN</p><h1 tabindex="-1">What are you feeling pulled to do?</h1>'+
    '<p>Write the action you feel an urge to take, in your own words. For example, “check my phone”, “watch porn”, or “send another message”. Your answer is only used during this exercise. It is not saved to your Field Guide.</p>'+
    '<form data-urge-form="choose"><label class="ns-urge-field" for="ns-urge-custom">I am having an urge to…</label>'+
    '<textarea id="ns-urge-custom" name="custom" rows="3" maxlength="120" required placeholder="e.g. check whether they replied" autocomplete="off">'+safe(value)+'</textarea>'+
    (error?'<p class="ns-urge-error" role="alert">'+safe(error)+'</p>':'')+
    '<div class="ns-urge-actions">'+button('Back','intro',true)+'<button class="ns-urge-button" type="submit">Start my pause →</button></div>'+
    '</form></div></div></div>';
}

function steps(action) {
  const a=safe(action);
  return [
    {title:'Recognise',line:'“I want to '+a+'.”',copy:'Notice the pull, without arguing with it. You are recognising what is happening, not promising to act.'},
    {title:'Name',line:'“I am noticing an urge to '+a+'.”',copy:'Now you are putting words around the urge. There is a difference between experiencing something and being carried straight into doing it.'},
    {title:'Notice',line:'“This urge showed up. I did not choose for it to appear.”',copy:'You might notice the urge in your body, or you might just keep thinking about doing the action. See what you notice without trying to make it go away.'},
    {title:'Unhook',line:'“Feeling an urge does not mean I have to act on it.”',copy:'You can genuinely want something and still decide not to do it right now. A desire is something you experience, not something that controls your next move.'},
    {title:'Choose',line:'“I can want to '+a+' and still decide what I do.”',copy:'You may genuinely want the short-term reward. You might also want something else from your day. What do you want to choose for the next few minutes?'},
    {title:'Continue',line:'“I can carry on, even if the urge comes with me.”',copy:'Choose one small action and begin it. You do not need to wait until the urge is gone. If it comes back, you can notice it again.'}
  ];
}

function exercise(action,step,notice,nextAction) {
  const s=steps(action)[step];
  const observation=step===2?'<div class="ns-urge-notice"><label class="ns-urge-ask" for="ns-urge-observation">What are you noticing? <small>Optional</small></label>'+
    '<textarea id="ns-urge-observation" rows="3" maxlength="300" placeholder="e.g. I keep thinking about it, and I feel restless in my chest">'+safe(notice)+'</textarea>'+
    '<p class="ns-urge-caption">It might be a thought, a feeling in your body, or both. You can also leave this blank.</p></div>':'';
  const next=step===5?'<div class="ns-urge-next"><label for="ns-urge-next-action">What small thing will you do next? <small>Optional</small></label>'+
    '<textarea id="ns-urge-next-action" rows="2" maxlength="160" placeholder="e.g. return to drawing for a few minutes">'+safe(nextAction)+'</textarea></div>':'';
  return '<div class="ns-guide6 ns-urge"><div class="ns-urge-wrap">'+backLink+
    '<div class="ns-urge-card"><div class="ns-urge-progress-head"><p class="ns-guide6-kicker">YOUR URGE PAUSE</p><span>Step '+(step+1)+' of 6</span></div>'+
    '<div class="ns-urge-progress" role="progressbar" aria-label="Exercise progress" aria-valuemin="1" aria-valuemax="6" aria-valuenow="'+(step+1)+'"><span style="width:'+((step+1)/6*100)+'%"></span></div>'+
    '<p class="ns-urge-current">Working with: <strong>'+safe(action)+'</strong> <button type="button" data-urge-action="choose">Change</button></p>'+
    '<div class="ns-urge-stage" aria-live="polite"><p class="ns-urge-kicker">'+(step+1)+' · '+safe(s.title)+'</p>'+
    '<h1 tabindex="-1">'+s.line+'</h1><p>'+safe(s.copy)+'</p></div>'+observation+next+
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
  const state={phase:'intro',demo:false,action:'',draftAction:'',step:0,notice:'',nextAction:''};
  const paint=(focus=false)=>{
    if(state.phase==='intro')main.innerHTML=intro(state.demo);
    else if(state.phase==='choose')main.innerHTML=chooser(state.draftAction);
    else if(state.phase==='steps')main.innerHTML=exercise(state.action,state.step,state.notice,state.nextAction);
    else main.innerHTML=complete(state.action,state.nextAction);
    if(focus)main.querySelector('.ns-urge h1')?.focus({preventScroll:true});
  };
  main.addEventListener('click',event=>{
    const click=event.target.closest('[data-urge-action]');
    if(!click || !main.contains(click))return;
    const action=click.dataset.urgeAction;
    if(action==='demo')state.demo=!state.demo;
    else if(action==='intro')state.phase='intro';
    else if(action==='choose')state.phase='choose';
    else if(action==='previous'){if(state.step>0)state.step--;else state.phase='choose';}
    else if(action==='next'){state.step=Math.min(5,state.step+1);}
    else if(action==='finish'){state.nextAction=clip(main.querySelector('#ns-urge-next-action')?.value ?? state.nextAction,160);state.phase='done';}
    else if(action==='repeat'){state.step=0;state.notice='';state.nextAction='';state.phase='steps';}
    else return;
    paint(action!=='demo');
    if(action==='demo')main.querySelector('[data-urge-action="demo"]')?.focus();
  },{signal:controller.signal});
  main.addEventListener('submit',event=>{
    const form=event.target.closest('[data-urge-form="choose"]');
    if(!form)return;
    event.preventDefault();
    const raw=clip(form.elements.namedItem('custom')?.value);
    const action=clip(raw.replace(/^(?:(?:i['’]?m|i am)\s+(?:having|feeling)\s+(?:an?\s+)?urge\s+to\s+|i\s+(?:want|need|have)\s+to\s+|(?:an?\s+)?urge\s+to\s+|to\s+)/i,'')); 
    if(!action){
      const error=form.querySelector('.ns-urge-error')||document.createElement('p');
      error.className='ns-urge-error';error.setAttribute('role','alert');
      error.textContent='Write a short action to use your own urge.';
      form.querySelector('.ns-urge-actions')?.before(error);
      form.elements.namedItem('custom')?.focus();
      return;
    }
    state.action=action;state.draftAction=raw;state.step=0;state.notice='';state.nextAction='';state.phase='steps';paint(true);
  },{signal:controller.signal});
  main.addEventListener('input',event=>{
    if(event.target.id==='ns-urge-custom')state.draftAction=clip(event.target.value);
    if(event.target.id==='ns-urge-observation')state.notice=clip(event.target.value,300);
    if(event.target.id==='ns-urge-next-action')state.nextAction=clip(event.target.value,160);
  },{signal:controller.signal});
  paint();
  return ()=>controller.abort();
}
