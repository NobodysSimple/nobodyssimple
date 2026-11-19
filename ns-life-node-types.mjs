/**
 * Nobody's Simple: eighteen reusable illustrated everyday-life learning nodes.
 * These are editable starter examples, not claims about actual people or clinical assessments.
 * Data-only authoring; published course JSON is escaped by the player.
 */
export const LIFE_NODE_TEMPLATES=Object.freeze([
 {
  "id": "freeze_frame",
  "name": "The Freeze Frame",
  "hint": "Tap clues in a paused everyday scene.",
  "mode": "hotspot",
  "scene": "A colleague walks past you without saying hello.",
  "reveal": "The observable detail is the passing greeting; their motive is not directly visible.",
  "frames": [
   "They walked past without saying hello.",
   "You felt embarrassed.",
   "They must dislike you."
  ],
  "choices": [
   "Only the missed greeting is directly observed.",
   "Their feelings remain uncertain.",
   "An interpretation can be possible without being established."
  ],
  "correct": 1,
  "conceptId": "observations-vs-inferences"
 },
 {
  "id": "cropped_reality",
  "name": "The Cropped Reality",
  "hint": "Make a judgement, then reveal the missing context.",
  "mode": "reveal",
  "scene": "Your friend replies to your invitation with just: “No.”",
  "reveal": "Earlier, your friend mentioned being at hospital with their mum.",
  "frames": [
   "A short reply",
   "The timing of the reply",
   "The earlier conversation"
  ],
  "choices": [
   "They are definitely angry.",
   "The reply is short but its meaning is uncertain.",
   "They do not care about the friendship."
  ],
  "correct": 1,
  "conceptId": "context-and-interpretation"
 },
 {
  "id": "tomorrow_button",
  "name": "The Tomorrow Button",
  "hint": "Move through time to inspect consequences.",
  "mode": "timeline",
  "scene": "You've postponed replying to an important email.",
  "reveal": "Tomorrow the email is still there, with less time to prepare.",
  "frames": [
   "Tonight: you avoid opening the email.",
   "Tomorrow: the unfinished task remains.",
   "Next week: the deadline has passed."
  ],
  "choices": [
   "Short-term relief can coexist with longer-term costs.",
   "Avoiding a task always protects wellbeing.",
   "Feeling relief proves avoidance was the best choice."
  ],
  "correct": 0,
  "conceptId": "avoidance-consequences"
 },
 {
  "id": "invisible_backpack",
  "name": "The Invisible Backpack",
  "hint": "Uncover unseen demands affecting a person.",
  "mode": "hotspot",
  "scene": "Someone is struggling to begin a household task.",
  "reveal": "They are also managing fatigue, interruptions and unclear task steps.",
  "frames": [
   "They slept poorly.",
   "They are receiving repeated messages.",
   "The task has no clear starting point."
  ],
  "choices": [
   "The struggle proves a lack of character.",
   "Several demands may be making initiation harder.",
   "The task is objectively impossible."
  ],
  "correct": 1,
  "conceptId": "demands-and-capacity"
 },
 {
  "id": "one_change_experiment",
  "name": "The One Change Experiment",
  "hint": "Change one condition and examine what follows.",
  "mode": "switch",
  "scene": "A student is trying to study in a busy shared room.",
  "reveal": "Lowering interruptions might improve concentration, but not necessarily remove all difficulties.",
  "frames": [
   "Busy room: repeated interruptions.",
   "Quiet room: fewer interruptions.",
   "Clear task steps: less uncertainty."
  ],
  "choices": [
   "The student is inherently lazy.",
   "Environmental demands can change task difficulty.",
   "Every student will respond exactly the same way."
  ],
  "correct": 1,
  "conceptId": "environment-and-behaviour"
 },
 {
  "id": "hidden_subtitle",
  "name": "The Hidden Subtitle",
  "hint": "Compare possible inner experiences behind the same words.",
  "mode": "reveal",
  "scene": "After an argument, a friend says: “I'm fine.”",
  "reveal": "Their words might reflect genuine calm, a need for time, or a wish to avoid more conflict.",
  "frames": [
   "Possibility: they feel fine.",
   "Possibility: they need space.",
   "Possibility: they fear escalation."
  ],
  "choices": [
   "You can infer exactly how they feel.",
   "Their internal state is uncertain without more information.",
   "The reply always means suppressed anger."
  ],
  "correct": 1,
  "conceptId": "mental-state-uncertainty"
 },
 {
  "id": "rewind_point",
  "name": "The Rewind Point",
  "hint": "Spot a point where a pattern could change.",
  "mode": "timeline",
  "scene": "A person keeps checking whether a friend has replied.",
  "reveal": "Checking briefly reduces uncertainty but can become repetitive.",
  "frames": [
   "A message is unanswered.",
   "They think something must be wrong.",
   "They check the phone again and again.",
   "Checking brings momentary relief."
  ],
  "choices": [
   "Repeated checking is the only response.",
   "One possible change is to delay checking and tolerate uncertainty.",
   "The friend is obviously rejecting them."
  ],
  "correct": 1,
  "conceptId": "behavioural-loops"
 },
 {
  "id": "confidence_dial",
  "name": "The Confidence Dial",
  "hint": "Adjust certainty when new evidence arrives.",
  "mode": "dial",
  "scene": "You are 80% sure a colleague deliberately ignored you.",
  "reveal": "You learn the colleague was rushing to an urgent appointment.",
  "frames": [
   "First interpretation: deliberate slight.",
   "New evidence: urgent appointment.",
   "Updated belief: reconsider your confidence."
  ],
  "choices": [
   "Confidence should rise.",
   "Confidence should fall.",
   "Confidence must remain exactly the same."
  ],
  "correct": 1,
  "conceptId": "belief-calibration"
 },
 {
  "id": "invisible_price_tag",
  "name": "The Invisible Price Tag",
  "hint": "Reveal the trade-off hidden inside a decision.",
  "mode": "switch",
  "scene": "A colleague asks you to cover an extra shift.",
  "reveal": "Accepting might help them, but you would miss a prior commitment.",
  "frames": [
   "Accept: help a colleague, lose the evening.",
   "Decline: preserve your commitment, disappoint them.",
   "Negotiate: ask whether another shift is possible."
  ],
  "choices": [
   "Every choice has the same cost.",
   "A decision can have benefits and opportunity costs.",
   "The most generous choice is always the right one."
  ],
  "correct": 1,
  "conceptId": "opportunity-costs"
 },
 {
  "id": "attention_spotlight",
  "name": "The Attention Spotlight",
  "hint": "Find details a first impression overlooked.",
  "mode": "hotspot",
  "scene": "At a dinner, someone raises their voice.",
  "reveal": "You also notice they were interrupted repeatedly beforehand.",
  "frames": [
   "The person's raised voice.",
   "Other people speaking over them.",
   "Someone trying to end the exchange."
  ],
  "choices": [
   "One loud moment explains the whole situation.",
   "Context may change how the behaviour is interpreted.",
   "Being interrupted means shouting is always justified."
  ],
  "correct": 1,
  "conceptId": "selective-attention"
 },
 {
  "id": "sentence_surgeon",
  "name": "The Sentence Surgeon",
  "hint": "Edit one phrase to communicate more precisely.",
  "mode": "edit",
  "scene": "“You NEVER listen to me.”",
  "reveal": "Try replacing a general accusation with a specific observation or request.",
  "frames": [
   "Original phrase: never.",
   "Alternative: I want to finish my point.",
   "Alternative: you're a terrible listener."
  ],
  "choices": [
   "You always ignore me.",
   "I'd like to finish what I was saying before you respond.",
   "You never care about anything I say."
  ],
  "correct": 1,
  "conceptId": "communication-specificity"
 },
 {
  "id": "whose_move",
  "name": "Whose Move Is It?",
  "hint": "Sort what you control, influence or cannot decide.",
  "mode": "sort",
  "scene": "You want to repair a disagreement after saying something hurtful.",
  "reveal": "You can apologise, but cannot compel the other person to forgive you.",
  "frames": [
   "Offer a sincere apology.",
   "Ask whether they want to talk.",
   "Decide whether they forgive you."
  ],
  "choices": [
   "Control",
   "Influence",
   "Outside control"
  ],
  "correct": 0,
  "conceptId": "agency-and-boundaries"
 },
 {
  "id": "advice_stress_test",
  "name": "The Advice Stress Test",
  "hint": "Test when appealing advice does and doesn't fit.",
  "mode": "judgement",
  "scene": "Advice on a poster says: “Always face your fear.”",
  "reveal": "Facing an imagined social threat differs from ignoring genuine safety risks.",
  "frames": [
   "An awkward social conversation.",
   "A dangerous crossing at night.",
   "A manageable performance challenge."
  ],
  "choices": [
   "Apply every rule in every situation.",
   "Check safety, context and the reason for fear first.",
   "Avoid every situation involving fear."
  ],
  "correct": 1,
  "conceptId": "contextual-advice"
 },
 {
  "id": "inner_tug_of_war",
  "name": "The Inner Tug-of-War",
  "hint": "Examine two competing needs before choosing.",
  "mode": "switch",
  "scene": "You want to attend a party but also fear feeling judged.",
  "reveal": "Both wanting connection and needing manageable demands can be taken seriously.",
  "frames": [
   "Wanting to connect.",
   "Wanting to feel safe.",
   "A possible middle route: attend briefly."
  ],
  "choices": [
   "You must suppress one side completely.",
   "A short visit with an exit plan may respect both concerns.",
   "You should avoid all social invitations forever."
  ],
  "correct": 1,
  "conceptId": "conflicting-motives"
 },
 {
  "id": "same_person_different_day",
  "name": "The Same Person, Different Day",
  "hint": "Compare the same behaviour under changing conditions.",
  "mode": "timeline",
  "scene": "The same employee arrives late on two different days.",
  "reveal": "On one day the bus was cancelled; on another they had forgotten to set an alarm.",
  "frames": [
   "Monday: cancelled bus.",
   "Friday: alarm not set.",
   "Two late arrivals, different explanations."
  ],
  "choices": [
   "One event proves a fixed trait.",
   "Similar behaviour can have different causes.",
   "The employee cannot be responsible for any lateness."
  ],
  "correct": 1,
  "conceptId": "state-and-trait"
 },
 {
  "id": "feeling_decoder",
  "name": "The Feeling Decoder",
  "hint": "Tap body and emotion clues and interpret cautiously.",
  "mode": "hotspot",
  "scene": "Before an exam result, you notice a fast heartbeat and an urge to check your phone.",
  "reveal": "These sensations may reflect anticipation or threat appraisal; they cannot identify one cause alone.",
  "frames": [
   "Fast heartbeat.",
   "Restlessness.",
   "Frequent checking."
  ],
  "choices": [
   "The body proves a specific feared outcome.",
   "Bodily signals need context to interpret.",
   "One symptom establishes a diagnosis."
  ],
  "correct": 1,
  "conceptId": "emotion-and-body"
 },
 {
  "id": "prediction_postcard",
  "name": "The Prediction Postcard",
  "hint": "Make a prediction, reveal information and reconsider.",
  "mode": "reveal",
  "scene": "You plan to ask a tutor for clarification about a task.",
  "reveal": "The tutor responds with a brief, helpful explanation.",
  "frames": [
   "The upcoming request.",
   "Your predicted reaction.",
   "What actually happened in this example."
  ],
  "choices": [
   "People will always reject requests.",
   "Predictions can be tested against outcomes.",
   "One friendly reply proves nobody will ever reject you."
  ],
  "correct": 1,
  "conceptId": "prediction-testing"
 },
 {
  "id": "rule_rewrite",
  "name": "The Rule Rewrite",
  "hint": "Challenge a rigid rule using everyday counterexamples.",
  "mode": "judgement",
  "scene": "Your personal rule is: “If someone dislikes me, I've failed.”",
  "reveal": "People can disagree or dislike you for reasons unrelated to wrongdoing.",
  "frames": [
   "Someone disagrees politely.",
   "Someone dislikes a boundary you set.",
   "Someone points out a genuine mistake."
  ],
  "choices": [
   "Anyone's disapproval means I am wrong.",
   "Disapproval may be useful information without being a final verdict.",
   "Other people's opinions never matter."
  ],
  "correct": 1,
  "conceptId": "flexible-personal-rules"
 }
]);
export const LIFE_NODE_IDS=Object.freeze(LIFE_NODE_TEMPLATES.map(x=>x.id));
const STORY_DETAILS={
 "freeze_frame": [
  "You can verify the missing greeting; you cannot see the colleague's intention.",
  "Your embarrassment is a genuine feeling, but it isn't direct evidence of the colleague's motive.",
  "This is a possible explanation, not something the scene establishes."
 ],
 "cropped_reality": [
  "The wording tells you little by itself.",
  "The speed of a reply does not reliably establish emotion.",
  "This context was missing from the cropped view."
 ],
 "tomorrow_button": [
  "Relief is an immediate effect, not proof the problem is solved.",
  "The deadline is now closer and the task remains.",
  "The cost of delay depends partly on what opportunities remained."
 ],
 "invisible_backpack": [
  "Fatigue may reduce the resources available to begin.",
  "Repeated interruptions can increase the cost of restarting.",
  "An unclear starting point creates additional planning demand."
 ],
 "one_change_experiment": [
  "Repeated interruptions may disrupt work.",
  "Fewer interruptions reduce one source of demand, not every barrier.",
  "Clarity can change how much planning is needed."
 ],
 "hidden_subtitle": [
  "Sometimes words and feelings match.",
  "A request for space is not always a sign of rejection.",
  "Some people avoid conflict when an argument feels unsafe or overwhelming."
 ],
 "rewind_point": [
  "An uncertain event starts the loop.",
  "The thought assigns meaning that has not been confirmed.",
  "Checking can make uncertainty feel temporarily bearable.",
  "Temporary relief can make the urge to repeat the action stronger."
 ],
 "confidence_dial": [
  "You begin with one interpretation of ambiguous behaviour.",
  "The appointment introduces a plausible competing explanation.",
  "Confidence should reflect the updated evidence rather than the original impression."
 ],
 "invisible_price_tag": [
  "This choice offers help but uses time you had committed elsewhere.",
  "Saying no can preserve capacity and still disappoint another person.",
  "A third option may be possible, but it depends on their needs."
 ],
 "attention_spotlight": [
  "The loudness is visible and may still be inappropriate.",
  "Repeated interruption changes the immediate context.",
  "The impact on others matters as well as the speaker's frustration."
 ],
 "sentence_surgeon": [
  "An absolute word may exaggerate a specific problem.",
  "The alternative identifies the immediate behaviour you want changed.",
  "A global character judgement is less specific than a request."
 ],
 "whose_move": [
  "Your choice of words and willingness to repair belong to you.",
  "You can invite a discussion, but the other person chooses whether to engage.",
  "You do not determine another person's decision to forgive."
 ],
 "advice_stress_test": [
  "A manageable fear may be suitable for gradual practice.",
  "A real safety threat changes which action is appropriate.",
  "A challenge can be useful without requiring reckless action."
 ],
 "inner_tug_of_war": [
  "Connection matters to the character.",
  "The fear may affect how manageable the event feels.",
  "A limited attendance plan might preserve room for both needs."
 ],
 "same_person_different_day": [
  "The transport failure changes what was possible that morning.",
  "Forgetting the alarm may create a different kind of responsibility.",
  "One label such as 'lazy' explains neither day adequately."
 ],
 "feeling_decoder": [
  "Heart rate alone cannot identify why the body is activated.",
  "Restlessness can occur in many emotional and physical states.",
  "Checking may be an attempt to reduce uncertainty."
 ],
 "prediction_postcard": [
  "The question has not yet been asked.",
  "A feared response is a prediction, not a result.",
  "This example supplies one outcome that can update the prediction."
 ],
 "rule_rewrite": [
  "Disagreement does not establish wrongdoing.",
  "A reasonable boundary can still upset somebody.",
  "Some criticism contains information worth considering."
 ]
};
export const lifeNodeDefinition=type=>LIFE_NODE_TEMPLATES.find(x=>x.id===type)||null;
export const isLifeNode=type=>LIFE_NODE_IDS.includes(type);
export const lifeNodeMode=type=>lifeNodeDefinition(type)?.mode||'judgement';
export function createLifeNode(type,uid){
 const source=lifeNodeDefinition(type);
 if(!source)return null;
 const frames=source.frames.map((label,i)=>({id:uid(),label,detail:STORY_DETAILS[type]?.[i]||'',category:source.mode==='sort'?['control','influence','outside'][i%3]:''}));
 const choices=source.choices.map(label=>({id:uid(),label,feedback:''}));
 return {id:uid(),type,title:source.name,prompt:source.hint,conceptId:source.conceptId,
  scene:source.scene,reveal:source.reveal,frames,options:choices,
  answer:choices[source.correct]?.id||'',initialValue:80,correctDirection:'lower',
  explanation:source.id==='confidence_dial'?'Evidence of an urgent appointment should reduce confidence in a deliberate slight.':source.reveal,
  counterexample:'Other situations may involve different evidence or constraints; do not assume this single example proves a universal rule.',
  sources:'',image:'',alt:'',caption:''};
}
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
const unique=xs=>new Set(xs).size===xs.length;
export function validateLifeNode(node){
 const problems=[],mode=lifeNodeMode(node?.type);
 if(!nonempty(node?.scene))problems.push('add an everyday-life scene');
 if(!nonempty(node?.reveal))problems.push('explain the additional context or outcome');
 if(!Array.isArray(node?.frames)||node.frames.length<2||node.frames.length>8||
    !unique((node.frames||[]).map(x=>x.id))||node.frames.some(x=>!nonempty(x?.id)||!nonempty(x?.label)))
  problems.push('add 2–8 distinct scene details or steps');
 if(mode==='sort'){
  if(node.frames?.some(x=>!['control','influence','outside'].includes(x.category)))
   problems.push('classify every item as Control, Influence or Outside control');
 }else if(mode==='dial'){
  if(!Number.isFinite(Number(node.initialValue))||Number(node.initialValue)<0||Number(node.initialValue)>100||
     !['higher','lower','hold'].includes(node.correctDirection))problems.push('choose a confidence starting point and expected adjustment');
 }else if(!Array.isArray(node?.options)||node.options.length<2||node.options.length>8||
    !unique(node.options.map(o=>o.id))||node.options.some(o=>!nonempty(o?.id)||!nonempty(o?.label))||
    !node.options.some(o=>o.id===node.answer)){
  problems.push('add 2–8 answer choices and identify the strongest answer');
 }
 return problems;
}
export function gradeLifeNode(node,response){
 const mode=lifeNodeMode(node.type);
 if(mode==='sort'){
  const valid=!!response&&typeof response==='object'&&!Array.isArray(response)&&node.frames.every(f=>['control','influence','outside'].includes(response[f.id]));
  return {valid,correct:!!valid&&node.frames.every(f=>response[f.id]===f.category)};
 }
 if(mode==='dial'){
  const valid=!!response&&Number.isFinite(response.before)&&Number.isFinite(response.after)&&response.before>=0&&response.before<=100&&response.after>=0&&response.after<=100;
  const delta=(response?.after??0)-(response?.before??0);
  return {valid,correct:!!valid&&(node.correctDirection==='higher'?delta>=10:node.correctDirection==='lower'?delta<=-10:Math.abs(delta)<10)};
 }
 const valid=typeof response==='string'&&node.options.some(x=>x.id===response);
 return {valid,correct:valid&&response===node.answer};
}
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const makeOptions=(values,selected)=>values.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===selected?' selected':'')+'>'+esc(x.label)+'</option>').join('');
export function lifeNodeEditor(node,field){
 const mode=lifeNodeMode(node.type);
 let html='<div class="cl-dialogue-intro"><strong>Illustrated real-life learning node</strong><p>'+esc(lifeNodeDefinition(node.type)?.hint||'')+'. Edit the everyday scene and what the learner discovers. The site illustration is optional, and all controls also work with text.</p></div>';
 html+=field('Everyday scene / starting situation','scene',node.scene,{rows:3});
 html+=field(mode==='reveal'?'Missing context revealed later':mode==='dial'?'New evidence':mode==='timeline'?'What changes over time?':'Context or takeaway after exploration','reveal',node.reveal,{rows:3});
 html+='<section class="cl-list"><div class="cl-list-title"><strong>'+esc(mode==='sort'?'Situations to classify':mode==='timeline'?'Moments in the sequence':mode==='hotspot'?'Scene details / clues':'Illustrated frames / alternatives')+'</strong><button type="button" data-act="life-add-frame">＋ Detail</button></div>';
 (node.frames||[]).forEach((f,i)=>{
  html+='<div class="cl-dialogue-check"><div class="cl-dialogue-row"><strong>Detail '+(i+1)+'</strong><button type="button" data-act="life-frame-up" data-pos="'+i+'" '+(i===0?'disabled':'')+'>↑</button><button type="button" data-act="life-frame-down" data-pos="'+i+'" '+(i===node.frames.length-1?'disabled':'')+'>↓</button><button type="button" data-act="life-remove-frame" data-pos="'+i+'">×</button></div><label class="cl-field"><span>Visible scene detail</span><input data-life-frame="'+i+'" data-prop="label" value="'+esc(f.label)+'"></label><label class="cl-field"><span>Optional detail revealed when tapped</span><textarea data-life-frame="'+i+'" data-prop="detail" rows="2">'+esc(f.detail||'')+'</textarea></label>';
  if(mode==='sort')html+='<label class="cl-field"><span>Correct classification</span><select data-life-frame="'+i+'" data-prop="category">'+[['control','Control'],['influence','Influence'],['outside','Outside control']].map(([id,label])=>'<option value="'+id+'"'+(f.category===id?' selected':'')+'>'+label+'</option>').join('')+'</select></label>';
  html+='</div>';
 });
 html+='</section>';
 if(mode==='dial'){
  html+=field('Initial confidence (0–100)','initialValue',node.initialValue,{type:'number'});
  html+='<label class="cl-field"><span>Expected adjustment after evidence</span><select data-field="correctDirection">'+[['lower','Less confident'],['higher','More confident'],['hold','Roughly unchanged']].map(([id,label])=>'<option value="'+id+'"'+(node.correctDirection===id?' selected':'')+'>'+label+'</option>').join('')+'</select></label>';
 }else if(mode!=='sort'){
  html+='<section class="cl-list"><div class="cl-list-title"><strong>Answer / response choices</strong><button type="button" data-act="life-add-option">＋ Choice</button></div>';
  (node.options||[]).forEach((o,i)=>{html+='<div class="cl-dialogue-check"><div class="cl-dialogue-row"><strong>Choice '+(i+1)+'</strong><button type="button" data-act="life-remove-option" data-pos="'+i+'">×</button></div><label class="cl-field"><span>Response</span><input data-life-option="'+i+'" data-prop="label" value="'+esc(o.label)+'"></label><label class="cl-field"><span>Optional feedback for this answer</span><textarea data-life-option="'+i+'" data-prop="feedback" rows="2">'+esc(o.feedback||'')+'</textarea></label></div>';});
  html+='</section><label class="cl-field"><span>Strongest supported answer</span><select data-field="answer"><option value="">Choose…</option>'+makeOptions(node.options||[],node.answer)+'</select></label>';
 }
 return html;
}
export function lifeControls(node,state){
 const mode=lifeNodeMode(node.type),frames=node.frames||[],opts=node.options||[];
 const scene='<div class="ns-life-node__scene"><span class="ns-life-node__person" aria-hidden="true">✦</span><p>'+esc(node.scene)+'</p></div>';
 const detailCards=(interactive=true)=>'<div class="ns-life-node__frames">'+frames.map((f,i)=>'<button type="button" class="ns-life-node__frame'+(state.lifeFrame===i?' is-active':'')+'" data-life-frame="'+i+'" aria-pressed="'+(state.lifeFrame===i)+'"><span class="ns-life-node__number">'+(i+1)+'</span><span>'+esc(f.label)+'</span></button>').join('')+'</div>';
 const selectedFrame=frames[state.lifeFrame??0];
 const frameDetail=selectedFrame?.detail?'<p class="ns-life-node__detail">'+esc(selectedFrame.detail)+'</p>':'';
 const choose='<fieldset class="ns-life-node__answers"><legend>'+esc(node.prompt||'Choose the best-supported response')+'</legend>'+opts.map(o=>'<label><input type="radio" name="life-choice" value="'+esc(o.id)+'"'+(state.lifeChoice===o.id?' checked':'')+(state.checked?' disabled':'')+'><span>'+esc(o.label)+'</span></label>').join('')+'</fieldset>';
 if(mode==='sort'){
  return scene+'<p class="ns-life-node__instruction">Which parts can this person choose, influence or not decide?</p><div class="ns-life-node__sort">'+frames.map(f=>'<label><span>'+esc(f.label)+'</span><select data-life-sort="'+esc(f.id)+'"'+(state.checked?' disabled':'')+'><option value="">Choose a zone…</option><option value="control"'+(state.lifeSort?.[f.id]==='control'?' selected':'')+'>Control</option><option value="influence"'+(state.lifeSort?.[f.id]==='influence'?' selected':'')+'>Influence</option><option value="outside"'+(state.lifeSort?.[f.id]==='outside'?' selected':'')+'>Outside control</option></select></label>').join('')+'</div>';
 }
 if(mode==='dial'){
  return scene+'<label class="ns-life-node__dial">How certain are you initially? <output>'+Number(state.lifeBefore??node.initialValue)+'%</output><input type="range" min="0" max="100" step="5" data-life-slider="before" value="'+Number(state.lifeBefore??node.initialValue)+'"'+(state.lifeRevealed?' disabled':'')+'></label>'+
   (state.lifeRevealed?'<div class="ns-life-node__reveal"><strong>New evidence</strong><p>'+esc(node.reveal)+'</p></div><label class="ns-life-node__dial">How certain now? <output>'+Number(state.lifeAfter??state.lifeBefore??node.initialValue)+'%</output><input type="range" min="0" max="100" step="5" data-life-slider="after" value="'+Number(state.lifeAfter??state.lifeBefore??node.initialValue)+'"></label>':'<button type="button" class="ns-life-node__reveal-button" data-life-reveal>Reveal new evidence →</button>');
 }
 if(mode==='reveal'){
  const initial='<fieldset class="ns-life-node__answers"><legend>Before seeing more, what is your interpretation?</legend>'+opts.map(o=>'<label><input type="radio" name="life-initial" value="'+esc(o.id)+'"'+(state.lifeInitial===o.id?' checked':'')+'><span>'+esc(o.label)+'</span></label>').join('')+'</fieldset>';
  return scene+(!state.lifeRevealed?initial+'<button class="ns-life-node__reveal-button" type="button" data-life-reveal'+(state.lifeInitial?'':' disabled')+'>Reveal what was missing →</button>':'<div class="ns-life-node__reveal"><strong>More context</strong><p>'+esc(node.reveal)+'</p></div>'+detailCards()+frameDetail+choose);
 }
 if(mode==='edit')return scene+'<div class="ns-life-node__reveal"><strong>Try a more precise alternative</strong><p>'+esc(node.reveal)+'</p></div>'+choose+(state.lifeChoice?'<div class="ns-life-node__edited"><small>Your revised line</small><p>'+esc(opts.find(o=>o.id===state.lifeChoice)?.label||'')+'</p></div>':'');
 if(mode==='hotspot')return scene+'<p class="ns-life-node__instruction">Tap a detail in the scene to inspect it.</p>'+detailCards()+frameDetail+'<div class="ns-life-node__reveal"><strong>What else matters?</strong><p>'+esc(node.reveal)+'</p></div>'+choose;
 if(mode==='timeline')return scene+'<p class="ns-life-node__instruction">Move between moments in the situation.</p>'+detailCards()+frameDetail+'<div class="ns-life-node__reveal"><strong>What the sequence shows</strong><p>'+esc(node.reveal)+'</p></div>'+choose;
 if(mode==='switch')return scene+'<p class="ns-life-node__instruction">Change which circumstance you examine.</p>'+detailCards()+frameDetail+'<div class="ns-life-node__reveal"><strong>Consider the trade-off</strong><p>'+esc(node.reveal)+'</p></div>'+choose;
 return scene+'<p class="ns-life-node__instruction">Test the rule against each situation.</p>'+detailCards()+frameDetail+'<div class="ns-life-node__reveal"><strong>Context</strong><p>'+esc(node.reveal)+'</p></div>'+choose;
}
