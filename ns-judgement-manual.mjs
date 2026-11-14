/* Nobody's Simple · Fear of judgement: one accessible, person-first manual.
   Deliberately separate from the general intervention catalogue. */
import {escapeHTML} from './core.mjs';
import {judgementIdeas} from './ns-judgement-ideas.mjs';
const e=x=>escapeHTML(String(x??''));
const qs=[
 {id:'moment',q:'Think of a recent time you worried about being judged. What happened?',help:'Just one moment is enough. Where were you, and what brought on the worry?',shift:'Choose one real situation. You do not have to explain your whole life to understand this pattern.'},
 {id:'fear',q:'What were you worried the other person would think or do?',help:'Write the prediction as it appeared in your mind. For example: “They will think I am boring.”',shift:'Notice the difference between a prediction and something you actually know happened.'},
 {id:'meaning',q:'Why would that judgement hurt so much?',help:'Perhaps you would feel unwanted, embarrassed or less respected. You can leave this blank if you are not ready.',optional:true,shift:'Sometimes the feared meaning carries more pain than the social moment itself.'},
 {id:'protect',q:'What did you do to try to avoid that judgement?',help:'For example, staying quiet, rehearsing your words or checking their reaction.',shift:'That response may have protected you from embarrassment in the moment. We are trying to understand what it did for you.'},
 {id:'cost',q:'What did your response make easier right away? What did it make harder afterwards?',help:'For example: “Staying quiet felt safer, but I missed the chance to join in.” You can skip this.',optional:true,shift:'Look for both sides without blaming yourself for needing protection.'},
 {id:'safety',q:'Did anyone actually treat you badly in this situation? What happened?',help:'If someone mocked, threatened or excluded you, describe what you know. If you did not notice mistreatment, you can write “Nothing I know of.”',shift:'Real mistreatment calls for safety and support. We will not assume every fear is mistaken.'},
 {id:'wish',q:'What would you like to have been able to do instead?',help:'For example, offer your opinion, relax in the conversation or ask for help.',ideas:'map-wish',shift:'Think about what matters to you, rather than how impressive you would like to appear.'},
 {id:'step',q:'What small, safe step would you like to try next?',help:'If you are unsure where to start, use the ideas button. It is fine to leave this blank for now.',ideas:'map-step',optional:true,shift:'Choose something that would help you live a little more freely, not something that proves your worth.'}
];
const guides={
 test:{title:'Test a fear',lead:'A CBT-style behavioural experiment. Choose one safe action, predict what might happen, and practise without one unnecessary precaution. The goal is learning, not looking confident.',questions:[
  {id:'goal',q:'What would you like to do that fear has been stopping you from doing?',help:'Choose something small enough to try. You might ask a question, share an opinion or say hello.',ideas:'test-goal',shift:'Pick something you care about. You do not need to feel ready first.'},
  {id:'predict',q:'What do you think could go wrong if you try?',help:'Write one specific prediction. For example: “If I ask, they will laugh at me.”',shift:'You are putting the fear into words so you can compare it with what really happens.'},
  {id:'usual',q:'What do you normally do to stop that feared thing from happening?',help:'For example, you may rehearse repeatedly or wait until you are certain nobody will criticise you.',shift:'That behaviour may bring relief. It can also make it harder to find out what would happen without it.'},
  {id:'less',q:'What is one unnecessary precaution you could use a little less?',help:'Choose only one change. Keep adjustments and supports that genuinely help you communicate or stay safe.',ideas:'test-less',shift:'You are testing whether you need this particular precaution, not asking yourself to give up protection from real harm.'},
  {id:'attention',q:'What could you focus on besides how you look or sound?',help:'For example, listening to the question or noticing what the other person is actually saying.',ideas:'test-attention',shift:'Try this now: look away from this page for a moment and notice two things around you. You can move your attention even while feeling anxious.'},
  {id:'when',q:'Where will you try this safely, and what will you actually say or do?',help:'Choose a realistic situation. If it involves speaking, practise your first sentence aloud once now.',ideas:'test-when',shift:'Make your plan small and specific. If the setting becomes hostile, leaving or asking for support is a reasonable response.'}
 ]},
 replay:{title:'Stop the replay',lead:'A short CBT-informed exercise for conversations that keep running through your mind. We will check the facts once, decide whether anything needs doing and then gently stop reviewing.',questions:[
  {id:'moment',q:'What is the one moment you keep going back over?',help:'Write one short sentence. You do not need to replay the whole conversation.',shift:'Name the memory once rather than reconstructing it in detail.'},
  {id:'facts',q:'What do you actually know happened? What are you guessing the other person thought?',help:'For example: “They looked away” is something you saw. “They think I am boring” is a guess.',shift:'Your mind can make a guess feel like proof. Separating the two can make the worry less convincing.'},
  {id:'repair',q:'Is there anything you know you need to put right? What would be enough?',help:'If you genuinely hurt somebody, consider one fair apology or correction. If you only feel embarrassed, you may not need to do anything.',ideas:'replay-repair',shift:'Look for one proportionate action. Repeated apologies made only to obtain certainty can keep anxiety going.'},
  {id:'return',q:'What will you return to for the next ten minutes?',help:'Choose a real activity. You can go back to your day without knowing exactly what the other person thought.',ideas:'replay-return',shift:'Try closing this journal after you answer. When the memory returns, notice it and bring your attention back to the activity you chose.'}
 ]},
 kindness:{title:"When you're being hard on yourself",lead:'A compassionate, evidence-aware way to answer the inner critic. You can take responsibility for mistakes without treating yourself as a bad person.',questions:[
  {id:'voice',q:'What is the harsh thing you have been saying to yourself?',help:'Write the thought in your own words. You do not have to repeat every painful detail.',shift:'Notice that this is a judgement you are having, not a proven description of who you are.'},
  {id:'fact',q:'What actually happened, without judging your whole character?',help:'For example, “I lost my words during a presentation” describes an event; “I am hopeless” is a much larger claim.',shift:'A specific description gives you something you can learn from. A global label usually does not.'},
  {id:'friend',q:'If someone you cared about had done the same thing, what would you say to them?',help:'Try to be as fair to yourself as you would be to that person.',shift:'Notice whether you allow others more room to be human than you allow yourself.'},
  {id:'repair',q:'Is there anything useful you want to learn or put right?',help:'If nobody was harmed, your next step might simply be allowing an awkward moment to pass.',ideas:'kindness-repair',shift:'Responsibility works best when it leads somewhere useful, not when it turns into endless punishment.'},
  {id:'fair',q:'What fairer sentence could you say to yourself now?',help:'Try something believable. For example: “That was uncomfortable. I can learn from it without deciding everyone dislikes me.”',ideas:'kindness-fair',shift:'Read your new sentence once, slowly. You do not have to believe it perfectly before you can begin treating yourself fairly.'}
 ]},
 protect:{title:'When the judgement is real',lead:'A practical route for real criticism, bullying or unsafe behaviour. Your surroundings matter. You do not need to force an exposure exercise in a hostile environment.',questions:[
  {id:'happened',q:'What did someone actually say or do that felt unkind or unsafe?',help:'Describe what you know happened. You can leave out names and other identifying details.',shift:'Start from what occurred. You do not have to prove you are unusually sensitive to deserve respectful treatment.'},
  {id:'control',q:'What is within your control here? What needs to change around you?',help:'Some things may depend on an employer, a teacher, another person or the environment.',shift:'You should not have to solve an environmental problem only by changing your thoughts.'},
  {id:'need',q:'What boundary or change would help you feel safer?',help:'Think about the setting, how you communicate or how much contact you want.',ideas:'protect-need',shift:'Choose something realistic. You do not have to confront a person who might retaliate.'},
  {id:'ask',q:'Who could help, and what would you like to ask them for?',help:'It might be a trusted person, someone with responsibility for the setting, or a support service.',ideas:'protect-ask',shift:'A clear, concrete request is often easier for somebody else to respond to than asking them to fix everything.'},
  {id:'next',q:'What is your safest next step?',help:'You can choose to ask for help, adjust the environment, keep a record or leave a harmful situation. There is no pressure to act immediately.',ideas:'protect-next',shift:'If retaliation or threats are likely, prioritise getting support and making a safe plan rather than a confrontation.'}
 ]},
 review:{title:'How did it go?',lead:'A brief review of what you learned from trying something. You do not have to grade your courage or your anxiety.',questions:[
  {id:'outcome',q:'What happened when you tried your step?',help:'If you did not try it yet, say what got in the way. A smaller attempt still counts as information.',shift:'Describe what happened rather than calling it a success or failure.'},
  {id:'observed',q:'How did that compare with what you expected would happen?',help:'Separate what you observed from what you guessed about another person’s thoughts.',shift:'The most useful learning comes from comparing a prediction with an actual observation.'},
  {id:'learn',q:'What did you find out about the situation or your ability to cope?',help:'It may be that the reaction was kinder than you feared, or that you handled an awkward moment better than expected.',shift:'Even if somebody did judge you, you may have learned something about what you can manage.'},
  {id:'next',q:'What would you like to keep, change or try next time?',help:'You might repeat the step, make it easier or adjust the setting. No streaks and no penalties.',ideas:'review-next',shift:'Leave with one realistic next step. The journal should not become another thing you have to do perfectly.'}
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

function control(value){
 const text=typeof value==='string'?value:'';
 return '<label class="ns-judge-sr" for="ns-judge-answer">Your answer</label>'+
 '<textarea id="ns-judge-answer" name="answer" rows="4" maxlength="1200" placeholder="You can write in your own words.">'+e(text)+'</textarea>';
}
function formValue(root,oldValue){
 const form=root.querySelector('[data-nj-question]');
 return form?String(form.elements.answer?.value||'').trim().slice(0,1200):oldValue;
}

function escapeNotes(s){return String(s||'').replace(/\s+/g,' ').trim();}
const NOTE_KEY='ns-fear-judgement-notes-v1';
export function renderJudgementManual(root){
 const state={mode:'',pos:0,answers:{},forms:{},done:{},suggest:'test'};
 let savedMode='';
 try{const saved=JSON.parse(localStorage.getItem(NOTE_KEY)||'null');
  if(saved&&['map',...Object.keys(guides)].includes(saved.mode)&&saved.answers&&saved.forms){
   state.answers=saved.answers;state.forms=saved.forms;savedMode=saved.mode;
   const a=state.answers;
   if(a.fear&&typeof a.fear==='object')a.fear=a.fear.other||({boring:'They might think I am boring',stupid:'They might think I am stupid',strange:'They might think I am strange',disappoint:'They might feel disappointed in me'})[a.fear.choice]||'';
   if(Array.isArray(a.protect))a.protect=a.protect.map(k=>({quiet:'I stayed quiet',rehearse:'I rehearsed',perform:'I tried to look confident',agree:'I agreed',withdraw:'I withdrew',replay:'I replayed it later',reassure:'I asked for reassurance'})[k]||k).join('; ');
   if(['yes','no','unsure'].includes(a.safety))a.safety=({yes:'I have experienced actual criticism or mistreatment',no:'Nothing I know of',unsure:"I am not sure what happened"})[a.safety];
   if(state.forms.replay&&['action','guess','unsure'].includes(state.forms.replay.repair)){
    state.forms.replay.repair=({action:'Something specific might need putting right',guess:'I am trying to know what they thought',unsure:'I am not sure yet'})[state.forms.replay.repair];
   }
   if(state.forms.review&&['tried','smaller','notyet','changed'].includes(state.forms.review.outcome)){
    state.forms.review.outcome=({tried:'I tried the step',smaller:'I made a smaller attempt',notyet:"I haven't tried it yet",changed:'I changed my plan'})[state.forms.review.outcome];
   }
  }
 }catch{}
 root.innerHTML='<div class="ns-judge" id="ns-judge-top">'+
  '<nav class="ns-judge-back" aria-label="Page navigation"><a href="#navigate">← Find another starting point</a><a href="#home">Nobody’s Simple home</a></nav>'+
  '<header class="ns-judge-hero"><div><p class="ns-judge-kicker">NOBODY’S SIMPLE · A FIELD GUIDE FOR YOU</p><h1>Fear of being judged by others</h1><p class="ns-judge-subhead">If you feel watched or worried about what people think, you can start here. You don’t have to have all the answers.</p>'+
  '<div class="ns-judge-toplinks" aria-label="Jump to a section"><button type="button" data-nj-jump="ns-judge-read">Read the guide</button><button type="button" data-nj-jump="ns-judge-start">Find my next step</button><button type="button" data-nj-jump="ns-judge-now">Something I can do now</button></div></div>'+
  '<img class="ns-judge-mascot" src="ns-character-guide.webp" alt="" loading="lazy"></header>'+
  '<section id="ns-judge-read" class="ns-judge-reading" aria-labelledby="ns-judge-read-title"><h2 id="ns-judge-read-title" tabindex="-1">If this feels familiar</h2>'+
  paras.map((p,i)=>'<p'+(i===5?' class="ns-judge-reflection"':'')+'>'+e(p)+'</p>').join('')+'</section>'+
  '<section class="ns-judge-start" id="ns-judge-start" aria-labelledby="ns-judge-start-title"><p class="ns-judge-kicker">A GENTLE PLACE TO BEGIN</p><h2 id="ns-judge-start-title" tabindex="-1">What would help you most right now?</h2><p>You can choose whichever feels closest. You won’t be asked to pick a therapy or work out a diagnosis.</p>'+
  '<div class="ns-judge-choices">'+Object.entries(choiceLabels).map(([id,[label,detail]])=>'<button type="button" class="ns-judge-choice" data-nj-open="'+e(id)+'"><span><strong>'+e(label)+'</strong><small>'+e(detail)+'</small></span><span aria-hidden="true">→</span></button>').join('')+'</div>'+
  '<p class="ns-judge-muted">If you’re unsure, start with “I want to understand why I feel this way”. You can change direction at any point.</p>'+ 
  '<div class="ns-judge-saved" data-nj-saved>'+(savedMode?'<p>You have notes saved on this device.</p><button type="button" class="ns-judge-secondary" data-nj-resume>Continue my saved notes</button> <button type="button" class="ns-judge-secondary" data-nj-remove>Delete saved copy</button>':'')+'</div></section>'+ 
  '<section id="ns-judge-work" class="ns-judge-work" aria-label="Your guided journal" hidden><div data-nj-screen></div></section>'+
  '<section id="ns-judge-now" class="ns-judge-now" aria-labelledby="ns-judge-now-title"><h2 id="ns-judge-now-title" tabindex="-1">Something you can try in your next conversation</h2><p>If you catch yourself worrying about how you sound, gently notice what you’re afraid the other person might think. Then bring some attention back to what they are saying. You can continue the conversation while feeling awkward. There is no need to make the feeling disappear first.</p></section>'+
  '<footer class="ns-judge-footer"><details><summary>Research and support</summary><p>These journals use techniques drawn mainly from cognitive behavioural therapy (CBT) designed for social anxiety, including testing feared predictions, reducing unnecessary safety behaviours, turning attention back towards other people and limiting post-event replay. Values-based actions, grounding and self-compassion can support those skills, but they have not been established as equal first-line treatments for social anxiety disorder. If fear of judgement is seriously affecting your life, individual CBT designed for social anxiety is recommended by NICE.</p><ul><li><a href="https://www.nice.org.uk/guidance/cg159/chapter/recommendations" target="_blank" rel="noopener noreferrer">NICE social anxiety guidance</a></li><li><a href="https://pubmed.ncbi.nlm.nih.gov/40023260/" target="_blank" rel="noopener noreferrer">2025 review of psychological therapies for social anxiety</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11497753/" target="_blank" rel="noopener noreferrer">Research on social anxiety experiences in autistic people</a></li><li><a href="https://www.nhs.uk/mental-health/conditions/social-anxiety/" target="_blank" rel="noopener noreferrer">NHS social anxiety information</a></li><li><a href="https://www.nhs.uk/nhs-services/mental-health-services/find-nhs-talking-therapies-for-anxiety-and-depression/" target="_blank" rel="noopener noreferrer">NHS Talking Therapies in England</a></li></ul><p>These are practical examples drawn from established treatment principles, rather than individually tested exercises. They are not a diagnosis or a substitute for individualised care. If someone is mistreating you, focus on safety and support rather than forcing yourself into an unsafe situation.</p></details><p>Nothing you write is saved or sent automatically. You can download your notes or choose to save them on this device. Only save on a device you trust.</p></footer><dialog class="ns-judge-ideas-dialog" data-nj-ideas-dialog aria-label="Practical ideas you can try"><button type="button" class="ns-judge-ideas-close" data-nj-ideas-close aria-label="Close ideas">×</button><ul data-nj-ideas-list></ul></dialog></div>';
 const work=root.querySelector('#ns-judge-work'),out=work.querySelector('[data-nj-screen]');
 function focusWork(){
  work.hidden=false;
  const target=out.querySelector('h2[tabindex="-1"]');
  target?.focus({preventScroll:true});
  work.scrollIntoView({block:'start',behavior:'auto'});
 }
 function currentQuestions(){return state.mode==='map'?qs:guides[state.mode]?.questions||[];}
 function currentStore(){return state.mode==='map'?state.answers:(state.forms[state.mode]||(state.forms[state.mode]={}));}
 
 function linkedObservation(){
  const a=currentStore();
  let previous='';
  if(state.mode==='test'&&state.pos===3&&a.predict)previous='Earlier, your mind predicted: '+a.predict;
  if(state.mode==='test'&&state.pos===4&&a.usual)previous='The precaution you noticed: '+a.usual;
  if(state.mode==='replay'&&state.pos===2&&a.facts)previous='What you know, alongside what you guessed: '+a.facts;
  if(state.mode==='kindness'&&state.pos===2&&a.fact)previous='The event you described: '+a.fact;
  if(state.mode==='map'&&state.pos===4&&a.protect)previous='What you did to protect yourself: '+a.protect;
  return previous?'<p class="ns-judge-linkback">'+e(previous.slice(0,265))+'</p>':'';
 }
 function showStep(){
  const items=currentQuestions(),item=items[state.pos];
  if(!item){showFinish();return;}
  const store=currentStore();
  out.innerHTML='<p class="ns-judge-kicker">'+e(state.mode==='map'?'YOUR FEAR OF JUDGEMENT MAP':guides[state.mode].title)+'</p>'+
   '<p class="ns-judge-progress">Question '+(state.pos+1)+' of '+items.length+'</p>'+
   '<div class="ns-judge-progressbar" aria-hidden="true"><span style="width:'+((state.pos+1)/items.length*100).toFixed(1)+'%"></span></div>'+
   '<div class="ns-judge-question-line"><h2 tabindex="-1">'+e(item.q)+'</h2>'+
   (item.ideas&&judgementIdeas[item.ideas]?.length?'<button type="button" class="ns-judge-idea-trigger" data-nj-ideas="'+e(item.ideas)+'" aria-haspopup="dialog">✦ Show me ideas</button>':'')+'</div>'+
   '<p class="ns-judge-help">'+e(item.help||'')+'</p>'+
   linkedObservation()+
   (item.shift?'<div class="ns-judge-practice"><strong>Try this as you write</strong><p>'+e(item.shift)+'</p></div>':'')+
   '<form data-nj-question novalidate>'+control(store[item.id])+'</form>'+
   '<div class="ns-judge-actions">'+(state.pos?'<button type="button" class="ns-judge-secondary" data-nj-back>Back</button>':'<button type="button" class="ns-judge-secondary" data-nj-close>Close</button>')+
   '<button type="button" class="ns-judge-primary" data-nj-next>'+(state.pos===items.length-1?'See what I learned':'Continue')+' →</button></div>'+
   '<p class="ns-judge-muted">Every answer is optional. There are no scores.</p>';
  focusWork();
 }
 function collect(){
  const item=currentQuestions()[state.pos];if(!item)return;
  currentStore()[item.id]=formValue(root,currentStore()[item.id]);
 }
 function recommendation(){
  const a=state.answers;
  const harm=String(a.safety||'').trim().toLowerCase();
  const clearlyNo=/^(nothing|none|no\b|not that i know|i don't know of|i do not know of|nothing i know)/.test(harm);
  if(harm&&!clearlyNo&&/(mock|bully|harass|threat|intimida|discriminat|retaliat|insult|humiliat|unsafe|physical|coerc|exclud|exclus|ridicul|mistreat|unkind|laughed at me|made fun of me|put me down)/.test(harm))return 'protect';
  if(/replay|ruminat|overthink|keep going over|went over|again and again/.test(String(a.protect||'').toLowerCase()))return 'replay';
  if(/worthless|unlovable|bad person|defect|flaw|inadequate|shame|asham|hate myself/.test(String(a.meaning||'').toLowerCase()))return 'kindness';
  return 'test';
 }
 function mapNotes(){
  const a=state.answers;
  const summary=[];
  if(a.moment)summary.push('The moment you chose: '+escapeNotes(a.moment));
  if(a.fear)summary.push('The judgement you feared: '+escapeNotes(a.fear));
  if(a.meaning)summary.push('Why it matters to you: '+escapeNotes(a.meaning));
  if(a.protect)summary.push('How you tried to protect yourself: '+escapeNotes(a.protect));
  if(a.cost)summary.push('The short-term help and longer-term cost: '+escapeNotes(a.cost));
  if(a.safety)summary.push('What you know about how you were treated: '+escapeNotes(a.safety));
  if(a.wish)summary.push('What you would like to be able to do: '+escapeNotes(a.wish));
  if(a.step)summary.push('The step you might choose: '+escapeNotes(a.step));
  return summary;
 }
 function guideNotes(mode){
  const items=guides[mode].questions,store=state.forms[mode]||{};
  return items.map(item=>store[item.id]?item.q+'\n'+String(store[item.id]):'').filter(Boolean);
 }


 function tailoredPractice(mode){
  const a=state.forms[mode]||{};
  if(mode==='test')return '<section class="ns-judge-finish-practice"><h3>Practise your first step now</h3><p>'+
   (a.when?'You planned: <strong>'+e(a.when.slice(0,240))+'</strong>. ':'')+
   'Say your first sentence aloud or quietly practise the first action. You are practising participation, not perfection. Afterwards, compare your prediction with what really happens.</p></section>';
  if(mode==='replay')return '<section class="ns-judge-finish-practice"><h3>Let the review end here</h3><p>'+
   (a.return?'You chose to return to <strong>'+e(a.return.slice(0,180))+'</strong>. ':'')+
   'Give that activity ten minutes. When the memory returns, recognise it without starting the investigation again.</p></section>';
  if(mode==='kindness')return '<section class="ns-judge-finish-practice"><h3>Say the fairer sentence once</h3><p>'+
   (a.fair?'<strong>'+e(a.fair.slice(0,240))+'</strong> ':'')+
   'Read it slowly. You can respond fairly to yourself even if the shame has not disappeared.</p></section>';
  if(mode==='protect')return '<section class="ns-judge-finish-practice"><h3>Choose safety over proving yourself</h3><p>'+
   (a.next?'Your possible next step: <strong>'+e(a.next.slice(0,220))+'</strong>. ':'')+
   'If this person may retaliate, asking for support or finding a safer setting is more important than confronting them.</p></section>';
  if(mode==='review')return '<section class="ns-judge-finish-practice"><h3>Take one learning point with you</h3><p>'+
   (a.learn?'<strong>'+e(a.learn.slice(0,220))+'</strong> ':'')+
   'Your review can end here. Choose just one thing to adjust if you try again.</p></section>';
  return '';
 }

function showFinish(){
  if(state.mode==='map'){
   const rec=recommendation();state.suggest=rec;state.done.map=true;
   out.innerHTML='<p class="ns-judge-kicker">YOUR WORKING MAP</p><h2 tabindex="-1">Here’s what you noticed</h2>'+
    '<p>These are your own observations. They are a starting point you can change, not a diagnosis or a judgement about who you are.</p>'+
    '<div class="ns-judge-summary">'+(mapNotes().map(s=>'<p>'+e(s)+'</p>').join('')||'<p>You can come back and add to this whenever you wish.</p>')+'</div>'+
    (state.answers.fear&&state.answers.protect?'<div class="ns-judge-finish-practice"><h3>A possible pattern to understand</h3><p>You feared: <strong>'+e(String(state.answers.fear).slice(0,210))+'</strong>. To protect yourself, you responded: <strong>'+e(String(state.answers.protect).slice(0,210))+'</strong>. In a safe situation, could changing one small part help you learn what happens without that precaution?</p></div>':'')+
    '<div class="ns-judge-next"><p class="ns-judge-kicker">YOUR SUGGESTED NEXT EXERCISE</p><h3>'+e(guides[rec].title)+'</h3><p>'+e(guides[rec].lead)+'</p>'+
    '<button class="ns-judge-primary" type="button" data-nj-open="'+rec+'">Start this exercise →</button></div>'+
    '<div class="ns-judge-actions"><button class="ns-judge-secondary" type="button" data-nj-edit>Review my answers</button><button class="ns-judge-secondary" type="button" data-nj-download>Download my notes</button><button class="ns-judge-secondary" type="button" data-nj-save>Save on this device</button><button class="ns-judge-secondary" type="button" data-nj-close>Finish for now</button></div><p class="ns-judge-muted" data-nj-storage-status role="status">Saving is optional. Anyone with access to this browser may be able to see saved notes.</p>'+ 
    '<p class="ns-judge-muted">This suggestion is a starting point, not a judgement about you. If this situation involves actual mistreatment, the safer starting point is <button type="button" class="ns-judge-text-action" data-nj-open="protect">When the judgement is real</button>. You can choose any of the journals.</p>';
  }else{
   const mode=state.mode;state.done[mode]=true;
   const notes=guideNotes(mode);
   const tail=mode==='replay'?'If something genuinely needs putting right, one proportionate action is enough. You cannot discover another person’s private thoughts by replaying the event. You can return to your day now.':
    mode==='protect'?'You do not need to confront someone who might retaliate. Consider support and safer conditions first.':
    mode==='kindness'?'You can learn from an experience without condemning your whole self.':
    mode==='test'?'Try this only in a safe setting. Afterwards, return to review what actually happened.':'You can adjust the next step without losing any progress.';
   out.innerHTML='<p class="ns-judge-kicker">YOUR NOTES</p><h2 tabindex="-1">'+e(guides[mode].title)+'</h2>'+
    '<div class="ns-judge-summary">'+(notes.map(x=>'<p>'+e(x).replace(/\n/g,'<br>')+'</p>').join('')||'<p>You can return to these questions when you’re ready.</p>')+'</div>'+
    tailoredPractice(mode)+'<p>'+e(tail)+'</p>'+
    '<div class="ns-judge-actions">'+(mode==='test'?'<button class="ns-judge-primary" type="button" data-nj-open="review">Review what happened later →</button>':'')+
    '<button type="button" class="ns-judge-secondary" data-nj-edit>Review answers</button>'+
    '<button type="button" class="ns-judge-secondary" data-nj-download>Download notes</button>'+ 
    '<button type="button" class="ns-judge-secondary" data-nj-save>Save on this device</button>'+ 
    '<button type="button" class="ns-judge-secondary" data-nj-close>Finish for now</button></div><p class="ns-judge-muted" data-nj-storage-status role="status">Saving is optional. Anyone with access to this browser may be able to see saved notes.</p>';
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
 let ideasTrigger=null;
 const modal=root.querySelector('[data-nj-ideas-dialog]');
 modal?.addEventListener('close',()=>ideasTrigger?.focus());
 root.querySelector('.ns-judge').addEventListener('click',event=>{
  const button=event.target.closest('[data-nj-ideas],[data-nj-ideas-close],[data-nj-jump],[data-nj-open],[data-nj-next],[data-nj-back],[data-nj-edit],[data-nj-close],[data-nj-download],[data-nj-save],[data-nj-resume],[data-nj-remove]');
  if(!button||!root.contains(button))return;
  if(button.dataset.njIdeas){
   const list=judgementIdeas[button.dataset.njIdeas],dialog=root.querySelector('[data-nj-ideas-dialog]');
   if(dialog&&list?.length){ideasTrigger=button;dialog.querySelector('[data-nj-ideas-list]').innerHTML=list.map(x=>'<li>'+e(x)+'</li>').join('');dialog.showModal();}
   return;
  }
  if(button.hasAttribute('data-nj-ideas-close')){root.querySelector('[data-nj-ideas-dialog]')?.close();return;}
  if(button.dataset.njJump){const section=root.querySelector('#'+button.dataset.njJump);section?.scrollIntoView({block:'start',behavior:'auto'});section?.querySelector('h2')?.focus({preventScroll:true});return;}
  if(button.dataset.njOpen){open(button.dataset.njOpen);return;}
  if(button.hasAttribute('data-nj-resume')){state.mode=savedMode||'map';showFinish();return;}
  if(button.hasAttribute('data-nj-save')){
   const message=root.querySelector('[data-nj-storage-status]');
   try{localStorage.setItem(NOTE_KEY,JSON.stringify({mode:state.mode,answers:state.answers,forms:state.forms}));savedMode=state.mode;
    root.querySelector('[data-nj-saved]').innerHTML='<p>You have notes saved on this device.</p><button type="button" class="ns-judge-secondary" data-nj-resume>Continue my saved notes</button> <button type="button" class="ns-judge-secondary" data-nj-remove>Delete saved copy</button>';
    if(message)message.textContent='Saved in this browser only. You can delete this copy whenever you wish.';
   }catch{if(message)message.textContent='This browser could not save your notes. You can still download them.';}
   return;
  }
  if(button.hasAttribute('data-nj-remove')){
   try{localStorage.removeItem(NOTE_KEY);savedMode='';root.querySelector('[data-nj-saved]').innerHTML='';
    const message=root.querySelector('[data-nj-storage-status]');if(message)message.textContent='Saved copy deleted from this browser. Your current unsaved notes remain until you leave the page.';
   }catch{}return;
  }
  if(button.hasAttribute('data-nj-download')){download();return;}
  if(button.hasAttribute('data-nj-close')){
   work.hidden=true;root.querySelector('#ns-judge-start-title')?.focus?.({preventScroll:true});
   root.querySelector('#ns-judge-start')?.scrollIntoView({block:'start',behavior:'auto'});return;
  }
  if(button.hasAttribute('data-nj-edit')){state.pos=0;showStep();return;}
  if(button.hasAttribute('data-nj-back')){collect();state.pos=Math.max(0,state.pos-1);showStep();return;}
  if(button.hasAttribute('data-nj-next')){collect();state.pos++;showStep();}
 });
}
