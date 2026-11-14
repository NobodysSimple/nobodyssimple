/* Nobody's Simple · Fear of judgement: one accessible, person-first manual.
   Deliberately separate from the general intervention catalogue. */
import {escapeHTML} from './core.mjs';
const e=x=>escapeHTML(String(x??''));
const qs=[
 {id:'moment',q:'Can you tell me about a recent moment when you felt judged, or worried that you might be?',help:'Where were you? Who was there? What happened just before the feeling started?',type:'text'},
 {id:'fear',q:'What were you afraid this person might think about you?',help:'Choose the nearest answer, or write your own.',type:'radio',options:[['boring',"That I'm boring"],['stupid',"That I'm stupid"],['strange',"That I'm strange"],['disappoint',"That I'm disappointing them"],['other','Something else']]},
 {id:'meaning',q:'If they really did think that about you, what would be the most painful part?',help:'Perhaps losing their respect, feeling rejected, or hearing something you already fear about yourself. You can skip this.',type:'text',optional:true},
 {id:'protect',q:'When that fear showed up, what did you do to try to keep yourself safe from it?',help:'Choose any that fit. These responses may have helped in the moment.',type:'checks',options:[['quiet','Stayed quiet'],['rehearse','Rehearsed what to say'],['perform','Tried to appear confident'],['agree','Agreed to avoid disappointing them'],['withdraw','Withdrew or left'],['replay','Replayed it later'],['reassure','Asked for reassurance'],['other','Something else']]},
 {id:'cost',q:'Did doing that help you in the moment? Was there anything you missed out on because of it?',help:'For example, staying quiet may have prevented embarrassment while also stopping you from joining in. You can skip this.',type:'text',optional:true},
 {id:'safety',q:'Has this person, or anyone in a similar situation, actually given you a reason to expect criticism or rejection?',help:'We want to take real mistreatment seriously. If someone has been unkind or unsafe, this changes which next step is appropriate.',type:'radio',options:[['yes','Yes'],['no','Not that I know of'],['unsure',"I'm unsure"]]},
 {id:'wish',q:"What would you have liked to do in that moment if you weren't so worried about their opinion?",help:'Perhaps join in, express disagreement, or enjoy the conversation without watching yourself so closely.',type:'text'},
 {id:'step',q:"What's one small, safe thing you'd be willing to try differently next time?",help:'A small step is enough. This is an invitation, not a test. You can skip it for now.',type:'text',optional:true}
];
const guides={
 test:{title:'Test a fear',lead:'Choose one safe, manageable action. The aim is to learn from what happens, including how you cope.',questions:[
  ['goal',"What is something you'd like to be able to do, but tend to avoid?",'For example, ask one question in a meeting.'],
  ['predict','What exactly do you predict will happen if you try?','A specific prediction is easier to review than a general feeling.'],
  ['usual','What would you usually do to prevent that happening?','For example, rehearse repeatedly or avoid speaking.'],
  ['less','Is there one unnecessary precaution you could gently reduce?','Keep any support or adjustment you genuinely need.'],
  ['attention','What would help you stay involved in the conversation or task?','Try noticing what the other person is saying, rather than constantly checking yourself.'],
  ['when','When could you safely try this?','Choose a realistic time and setting.']
 ]},
 replay:{title:'Stop the replay',lead:'You have already spent time thinking about what happened. This short exercise is designed to help you decide whether anything needs action, then return to your day.',questions:[
  ['moment','What moment keeps coming back to you?','One sentence is enough.'],
  ['repair','Is there something specific you know needs repairing, or are you trying to work out what somebody might have thought?','Choose the closest answer.', 'radio',[['action','There is something I can put right'],['guess',"I'm trying to work out what they thought"],['unsure',"I'm not sure"]]],
  ['return','What would you like to return your attention to now?','You can leave some questions unanswered.']
 ]},
 kindness:{title:"When you're being hard on yourself",lead:'You deserve a fair account of what happened. We can acknowledge a mistake without turning it into a verdict about your whole self.',questions:[
  ['voice','What are you saying to yourself about what happened?','You can use a few words.'],
  ['fact','What actually happened that led you to say this about yourself?','Describe the event as fairly as you can.'],
  ['friend','If somebody you cared about experienced the same thing, would you believe it made them less worthy of respect?','Notice whether the standard changes when you imagine somebody else.'],
  ['fair',"What's a fairer way of speaking to yourself, while acknowledging anything you want to learn or put right?",'For example: I said something awkward. I can learn from it without assuming everybody thinks less of me.']
 ]},
 protect:{title:'When the judgement is real',lead:'If someone has criticised, excluded or mistreated you, we should take that seriously. You do not need to test yourself by remaining in an unsafe situation.',questions:[
  ['happened','What has this person actually said or done that makes you feel judged?','Describe what you know happened.'],
  ['pattern','Has this happened repeatedly, or was it one incident?','You can say if you are unsure.'],
  ['need','What would you need from this situation to feel safer or better respected?','Think about support, a boundary, a communication adjustment, or more distance.'],
  ['next','Is there one safe next step you could choose?','You may decide to contact somebody supportive rather than confront the person.']
 ]},
 review:{title:'How did it go?',lead:'There is no pass or fail. A smaller attempt, an adjustment, or a decision to pause can all give you useful information.',questions:[
  ['outcome','What happened with the step you planned?','Choose the nearest answer.', 'radio',[['tried','I tried it'],['smaller','I made a smaller attempt'],['notyet',"I haven't tried it yet"],['changed','I chose a different step']]],
  ['observed','What actually happened compared with what you expected?','If you have not tried it, what got in the way?'],
  ['learn','What did you learn that you want to remember next time?','Keep it specific and fair.']
 ]}
};
const choiceLabels={
 map:['I want to understand why I feel this way','Start with your own experience.'],
 test:["I'm worried about something that's coming up",'Prepare one manageable action.'],
 replay:["I can't stop thinking about something that happened",'Find a way to finish the review.'],
 kindness:['I feel terrible about myself because of what happened','Respond to yourself more fairly.'],
 protect:['Someone is actually treating me badly','Think about what would help keep you safe.']
};
const paras=[
"There's a particular kind of loneliness that comes from being around people and feeling as though you have to earn your place among them.",
"You might be having an ordinary conversation, yet somewhere in the back of your mind you're checking yourself. Was that a strange thing to say? Have I been talking for too long? Why did their expression change? You might even find that the people you most want to connect with are the people you struggle to relax around, because their opinion means so much to you.",
"And it's tiring. Especially when you get home and the conversation carries on without them. You remember something you said, wonder how it sounded, and try to work out whether they secretly thought less of you. You can spend hours examining a moment that the other person may have forgotten.",
"I think one of the more painful parts of this experience is how easily you can begin to lose yourself in it. You want to be liked, so you pay attention to what other people seem to appreciate. You learn which parts of yourself receive a good response and become cautious about the ones that don't. Eventually, you might find yourself wondering whether people would still like you if you stopped trying so hard.",
"If that feels familiar, I want you to consider something.",
"How long have you felt responsible for making sure other people never have a reason to think badly of you?",
"Perhaps you were criticised a great deal growing up. Maybe you remember being laughed at when you tried to contribute, and you've been careful about exposing yourself to that feeling ever since. Or perhaps you can't identify where it began. You simply know that being disliked feels frightening, even when you recognise that the consequences probably wouldn't be as terrible as your mind suggests.",
"There are understandable reasons for wanting to protect yourself from rejection. What concerns me is what happens when that protection starts taking things away from you.",
"You might keep quiet when you have something worth saying. You may turn down opportunities because you can't bear the thought of making a mistake in front of people. When somebody disappoints you, perhaps you reassure them that everything is fine because you're worried that speaking up would make them like you less.",
"After a while, other people's possible reactions can begin making decisions for you.",
"We can work on that. And I don't think you need to start by forcing yourself to become confident.",
"I would begin by helping you recognise the moment your attention turns against you.",
"Next time you're in a conversation and notice yourself worrying about how you're coming across, see whether you can identify exactly what you're afraid the other person will think. You don't need to argue with the thought. For now, just recognise it.",
"Then bring some of your attention back to the person you're speaking with. Listen to what they're actually saying. Allow yourself to respond without trying to calculate the perfect answer.",
"If you feel awkward, that's all right. You can continue the conversation while feeling awkward.",
"That's a small practice, and it may be surprisingly difficult at first. In cognitive behavioural therapy for social anxiety, reducing excessive self-focused attention is one way of helping people discover that they can participate in conversations without monitoring every part of their performance.",
"The point is to begin learning what happens when you allow yourself to be present.",
"And over time, I hope you'll find that you can give people a chance to know you without feeling that you must first make yourself impossible to dislike."
];
function control(item,value){
 const options=item.options||item[4]||[];
 const type=item.type||item[3]||'text';
 const id=item.id||item[0];
 if(type==='radio'||type==='checks'){
  const multiple=type==='checks';
  const v=multiple?(Array.isArray(value)?value:[]):value;
  return '<fieldset class="ns-judge-options"><legend class="ns-judge-sr">Your answer</legend>'+
   options.map(([key,label])=>'<label class="ns-judge-option"><input type="'+(multiple?'checkbox':'radio')+'" name="answer" value="'+e(key)+'" '+(multiple?v.includes(key):v===key?'checked':'')+'><span>'+e(label)+'</span></label>').join('')+
   '</fieldset>'+(id==='fear'?'<label class="ns-judge-detail">If you chose something else, you can describe it here <input type="text" name="fearOther" maxlength="180" value="'+e(value?.other||'')+'" autocomplete="off"></label>':'');
 }
 return '<label class="ns-judge-sr" for="ns-judge-answer">Your answer</label><textarea id="ns-judge-answer" name="answer" rows="4" maxlength="900" placeholder="Write as much or as little as you like.">'+e(value||'')+'</textarea>';
}
function lineFor(item,value){
 const type=item.type||item[3]||'text';
 if(type==='checks')return (Array.isArray(value)?value:[]).map(k=>(item.options||item[4]||[]).find(o=>o[0]===k)?.[1]||k).join(', ');
 if(type==='radio'){const v=typeof value==='object'?value?.choice:value;return (item.options||item[4]||[]).find(o=>o[0]===v)?.[1]||'';}
 return String(value||'');
}
function formValue(root,item,oldValue){
 const form=root.querySelector('[data-nj-question]');if(!form)return oldValue;
 const type=item.type||item[3]||'text',els=form.elements;
 if(type==='checks')return [...form.querySelectorAll('input[name="answer"]:checked')].map(x=>x.value);
 if(type==='radio'){
  const chosen=form.querySelector('input[name="answer"]:checked')?.value||'';
  if(item.id==='fear')return {choice:chosen,other:els.fearOther?.value?.trim()?.slice(0,180)||''};
  return chosen;
 }
 return String(els.answer?.value||'').trim().slice(0,900);
}
function escapeNotes(s){return String(s||'').replace(/\s+/g,' ').trim();}
export function renderJudgementManual(root){
 const state={mode:'',pos:0,answers:{},forms:{},done:{},suggest:'test'};
 root.innerHTML='<div class="ns-judge" id="ns-judge-top">'+
  '<nav class="ns-judge-back" aria-label="Page navigation"><a href="#navigate">← Find another starting point</a><a href="#home">Nobody’s Simple home</a></nav>'+
  '<header class="ns-judge-hero"><div><p class="ns-judge-kicker">NOBODY’S SIMPLE · A FIELD GUIDE FOR YOU</p><h1>Fear of being judged by others</h1><p class="ns-judge-subhead">If you feel watched or worried about what people think, you can start here. You don’t have to have all the answers.</p>'+
  '<div class="ns-judge-toplinks"><a href="#ns-judge-read">Read the guide</a><a href="#ns-judge-start">Find my next step</a><a href="#ns-judge-now">Something I can do now</a></div></div>'+
  '<img class="ns-judge-mascot" src="ns-character-guide.webp" alt="" loading="lazy"></header>'+
  '<section id="ns-judge-read" class="ns-judge-reading" aria-labelledby="ns-judge-read-title"><h2 id="ns-judge-read-title">If this feels familiar</h2>'+
  paras.map((p,i)=>'<p'+(i===5?' class="ns-judge-reflection"':'')+'>'+e(p)+'</p>').join('')+'</section>'+
  '<section class="ns-judge-start" id="ns-judge-start" aria-labelledby="ns-judge-start-title"><p class="ns-judge-kicker">A GENTLE PLACE TO BEGIN</p><h2 id="ns-judge-start-title">What would help you most right now?</h2><p>You can choose whichever feels closest. You won’t be asked to pick a therapy or work out a diagnosis.</p>'+
  '<div class="ns-judge-choices">'+Object.entries(choiceLabels).map(([id,[label,detail]])=>'<button type="button" class="ns-judge-choice" data-nj-open="'+e(id)+'"><span><strong>'+e(label)+'</strong><small>'+e(detail)+'</small></span><span aria-hidden="true">→</span></button>').join('')+'</div>'+
  '<p class="ns-judge-muted">If you’re unsure, start with “I want to understand why I feel this way”. You can change direction at any point.</p></section>'+
  '<section id="ns-judge-work" class="ns-judge-work" aria-label="Your guided journal" hidden><div data-nj-screen></div></section>'+
  '<section id="ns-judge-now" class="ns-judge-now" aria-labelledby="ns-judge-now-title"><h2 id="ns-judge-now-title">Something you can try in your next conversation</h2><p>If you catch yourself worrying about how you sound, gently notice what you’re afraid the other person might think. Then bring some attention back to what they are saying. You can continue the conversation while feeling awkward. There is no need to make the feeling disappear first.</p></section>'+
  '<footer class="ns-judge-footer"><details><summary>Research and support</summary><p>These ideas draw on cognitive behavioural approaches for social anxiety, including reducing excessive self-monitoring and using safe behavioural experiments. If fear of judgement is seriously affecting your life, individual CBT designed for social anxiety is a recommended treatment.</p><ul><li><a href="https://www.nice.org.uk/guidance/cg159/chapter/recommendations" target="_blank" rel="noopener noreferrer">NICE social anxiety guidance</a></li><li><a href="https://www.nhs.uk/mental-health/conditions/social-anxiety/" target="_blank" rel="noopener noreferrer">NHS social anxiety information</a></li><li><a href="https://www.nhs.uk/nhs-services/mental-health-services/find-nhs-talking-therapies-for-anxiety-and-depression/" target="_blank" rel="noopener noreferrer">NHS Talking Therapies in England</a></li></ul><p>These exercises are educational. They are not a diagnosis or a substitute for individualised care. If someone is mistreating you, focus on safety and support rather than forcing yourself into an unsafe situation.</p></details><p>Nothing you write is saved or sent automatically. You can choose to download your notes.</p></footer></div>';
 const work=root.querySelector('#ns-judge-work'),out=work.querySelector('[data-nj-screen]');
 function focusWork(){
  work.hidden=false;
  const target=out.querySelector('h2[tabindex="-1"]');
  target?.focus({preventScroll:true});
  work.scrollIntoView({block:'start',behavior:'instant'});
 }
 function currentQuestions(){return state.mode==='map'?qs:guides[state.mode]?.questions||[];}
 function currentStore(){return state.mode==='map'?state.answers:(state.forms[state.mode]||(state.forms[state.mode]={}));}
 function showStep(){
  const a=currentQuestions(),item=a[state.pos];
  if(!item){showFinish();return;}
  const q=item.q||item[1],hint=item.help||item[2],id=item.id||item[0],store=currentStore();
  out.innerHTML='<p class="ns-judge-kicker">'+(state.mode==='map'?'YOUR FEAR OF JUDGEMENT MAP':e(guides[state.mode].title))+'</p>'+
   '<p class="ns-judge-progress">Question '+(state.pos+1)+' of '+a.length+'</p>'+
   '<div class="ns-judge-progressbar" aria-hidden="true"><span style="width:'+((state.pos+1)/a.length*100).toFixed(1)+'%"></span></div>'+
   '<h2 tabindex="-1">'+e(q)+'</h2><p class="ns-judge-help">'+e(hint||'')+'</p>'+
   '<form data-nj-question novalidate>'+control(item,store[id])+'</form>'+
   '<div class="ns-judge-actions">'+(state.pos?'<button type="button" class="ns-judge-secondary" data-nj-back>Back</button>':'<button type="button" class="ns-judge-secondary" data-nj-close>Close</button>')+
   '<button type="button" class="ns-judge-primary" data-nj-next>'+(state.pos===a.length-1?'See my notes':'Continue')+' →</button></div>'+
   '<p class="ns-judge-muted">You can leave an answer blank. There is no right answer and no score.</p>';
  focusWork();
 }
 function collect(){
  const item=currentQuestions()[state.pos];if(!item)return;
  const id=item.id||item[0];
  currentStore()[id]=formValue(root,item,currentStore()[id]);
 }
 function recommendation(){
  if(state.answers.safety==='yes')return 'protect';
  if(state.answers.safety==='unsure' && /bullied|harass|unsafe|threat|mocked/i.test(state.answers.moment||''))return 'protect';
  const protections=state.answers.protect||[];
  if(protections.includes('replay'))return 'replay';
  if(state.answers.fear?.choice==='stupid' && /asham|worth|defect|flaw|bad person/i.test(state.answers.meaning||''))return 'kindness';
  return 'test';
 }
 function mapNotes(){
  const a=state.answers;
  const summary=[];
  if(a.moment)summary.push('Your situation: '+escapeNotes(a.moment));
  const feared=lineFor(qs[1],a.fear);if(feared)summary.push('Your feared judgement: '+(a.fear?.choice==='other'&&a.fear.other?a.fear.other:feared));
  if(a.meaning)summary.push('Why it might hurt: '+escapeNotes(a.meaning));
  if(a.protect?.length)summary.push('How you tried to protect yourself: '+lineFor(qs[3],a.protect));
  if(a.cost)summary.push('What helped or cost you something: '+escapeNotes(a.cost));
  if(a.safety)summary.push('What you know about actual criticism: '+lineFor(qs[5],a.safety));
  if(a.wish)summary.push('What you would have liked: '+escapeNotes(a.wish));
  if(a.step)summary.push('Your possible next step: '+escapeNotes(a.step));
  return summary;
 }
 function guideNotes(mode){
  const a=guides[mode].questions,store=state.forms[mode]||{};
  return a.map(item=>{const id=item[0],v=lineFor(item,store[id]);return v?item[1]+'\n'+v:''}).filter(Boolean);
 }
 function showFinish(){
  if(state.mode==='map'){
   const rec=recommendation();state.suggest=rec;state.done.map=true;
   out.innerHTML='<p class="ns-judge-kicker">YOUR WORKING MAP</p><h2 tabindex="-1">Here’s what you noticed</h2>'+
    '<p>These are your own observations. They are a starting point you can change, not a diagnosis or a judgement about who you are.</p>'+
    '<div class="ns-judge-summary">'+(mapNotes().map(s=>'<p>'+e(s)+'</p>').join('')||'<p>You can come back and add to this whenever you wish.</p>')+'</div>'+
    '<div class="ns-judge-next"><p class="ns-judge-kicker">YOUR SUGGESTED NEXT EXERCISE</p><h3>'+e(guides[rec].title)+'</h3><p>'+e(guides[rec].lead)+'</p>'+
    '<button class="ns-judge-primary" type="button" data-nj-open="'+rec+'">Start this exercise →</button></div>'+
    '<div class="ns-judge-actions"><button class="ns-judge-secondary" type="button" data-nj-edit>Review my answers</button><button class="ns-judge-secondary" type="button" data-nj-download>Download my notes</button><button class="ns-judge-secondary" type="button" data-nj-close>Finish for now</button></div>'+
    '<p class="ns-judge-muted">If someone has actually treated you badly, support and safety take priority over an experiment.</p>';
  }else{
   const mode=state.mode;state.done[mode]=true;
   const notes=guideNotes(mode);
   const tail=mode==='replay'?(state.forms.replay?.repair==='action'?'If there is something specific to repair, choose one proportionate action.':'You may not be able to know what the other person thought. You can return to what matters to you now.'):
    mode==='protect'?'You do not need to confront someone who might retaliate. Consider support and safer conditions first.':
    mode==='kindness'?'You can learn from an experience without condemning your whole self.':
    mode==='test'?'Try this only in a safe setting. Afterwards, return to review what actually happened.':'You can adjust the next step without losing any progress.';
   out.innerHTML='<p class="ns-judge-kicker">YOUR NOTES</p><h2 tabindex="-1">'+e(guides[mode].title)+'</h2>'+
    '<div class="ns-judge-summary">'+(notes.map(x=>'<p>'+e(x).replace(/\n/g,'<br>')+'</p>').join('')||'<p>You can return to these questions when you’re ready.</p>')+'</div>'+
    '<p>'+e(tail)+'</p>'+
    '<div class="ns-judge-actions">'+(mode==='test'?'<button class="ns-judge-primary" type="button" data-nj-open="review">Review what happened later →</button>':'')+
    '<button type="button" class="ns-judge-secondary" data-nj-edit>Review answers</button>'+
    '<button type="button" class="ns-judge-secondary" data-nj-download>Download notes</button>'+
    '<button type="button" class="ns-judge-secondary" data-nj-close>Finish for now</button></div>';
  }
  focusWork();
 }
 function open(mode){
  state.mode=mode;state.pos=0;
  if(mode==='map'||guides[mode])showStep();
 }
 function download(){
  const text=['Nobody’s Simple · Fear of being judged by others','Private notes · only saved because you chose to download','','Your fear of judgement map',...mapNotes(),''];
  for(const [id,guide] of Object.entries(guides)){
   const notes=guideNotes(id);
   if(notes.length)text.push(guide.title,...notes,'');
  }
  text.push('These reflections are not a diagnosis.');
  const blob=new Blob([text.join('\n\n')],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  a.href=url;a.download='nobodys-simple-fear-of-judgement-notes.txt';
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000);
 }
 root.addEventListener('click',event=>{
  const button=event.target.closest('[data-nj-open],[data-nj-next],[data-nj-back],[data-nj-edit],[data-nj-close],[data-nj-download]');
  if(!button||!root.contains(button))return;
  if(button.dataset.njOpen){open(button.dataset.njOpen);return;}
  if(button.hasAttribute('data-nj-download')){download();return;}
  if(button.hasAttribute('data-nj-close')){
   work.hidden=true;root.querySelector('#ns-judge-start-title')?.focus?.({preventScroll:true});
   root.querySelector('#ns-judge-start')?.scrollIntoView({block:'start',behavior:'instant'});return;
  }
  if(button.hasAttribute('data-nj-edit')){state.pos=0;showStep();return;}
  if(button.hasAttribute('data-nj-back')){collect();state.pos=Math.max(0,state.pos-1);showStep();return;}
  if(button.hasAttribute('data-nj-next')){collect();state.pos++;showStep();}
 });
}
