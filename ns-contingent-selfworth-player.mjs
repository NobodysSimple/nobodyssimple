/**
 * Nobody's Simple · Fully authored contingent self-worth unit.
 * Screens are drawn from the supplied manuscript; prose is not generated at runtime.
 * Private written reflections are never saved automatically.
 */
import {saveLearnCompletion,saveLearnReview} from './ns-learn-progress-v2.mjs?v=psy-atlas-20261120';
const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const STAMP='20261121-v1';
const ANSWERS={'1.3':'C','2.3':'B','5.4':'A'};
const COMPARE=new Set(['5.4','6.8']);
const JOURNAL={
 '2.8':['I feel okay about myself when…','When that does not happen, I start thinking…'],
 '4.8':['What standard has become particularly important?','What happened when you met it?','What happened when you did not?'],
 '6.6':['Situation','Feared meaning','Action I could try','What I will observe','What I learned afterwards'],
 '6.9':['When this happens…','I tend to conclude…','What I can examine instead…','One action I can take…'],
 '8.8':['What does contingent self-worth mean?','Why can a disappointing result be so painful?','What might help somebody respond differently?'],
 '8.10':['One small action I could try'],
 'R3':['How might you explain the situation?','What else would you ask before deciding?','What could help your friend act?']
};
const EXPLORE={
 '1.4':{prompt:'Examine the two ways of interpreting the mistake',items:[['The result','The recipe did not work. I need to change the temperature.'],['The person','If I cannot make this, I must be useless at everything.']]},
 '1.6':{prompt:'Follow what happened to Nina',items:[['The event','The funding application was rejected.'],['What it meant','They can tell I do not know what I am doing.'],['How she felt','She felt embarrassed and inadequate.'],['What she did','She stopped replying to Asha.']]},
 '2.1':{prompt:'Open each door to meet a different self-worth rule',all:true,items:[['Achievement','If I achieve enough, then I am good enough.'],['Approval','If people like me, then I am acceptable.'],['Appearance','I have to look right to feel comfortable being seen.'],['Being a good person','If I never disappoint anyone, then I am a good person.']]},
 '2.4':{prompt:'Compare what the two thoughts could mean',items:[['The photograph','I do not like this photograph.'],['Being seen','I do not want anyone seeing me like this.']]},
 '3.2':{prompt:'Two goals are pulling Nina in different directions',items:[['Improve the project','Find accurate costs and ask for help with the budget.'],['Protect her image','Polish the design and delay revealing what she does not know.']]},
 '3.5':{prompt:'Compare their responses to criticism',items:[['Nina','Avoid asking questions that could make her feel inadequate.'],['Jonah','Keep working until success makes him feel acceptable.']]},
 '3.6':{prompt:'Compare what success does today and tomorrow',items:[['After the grade','Jonah feels proud and relieved.'],['At the next assignment','He starts worrying about whether he can succeed again.']]},
 '4.2':{prompt:'What might each child learn from the reaction?',items:[['Parent A','That is frustrating. Do you want to show me where you got stuck?'],['Parent B','After everything we have done to help you, this is what you bring home?']]},
 '4.5':{prompt:'Explore pressures in two different environments',items:[['At work','Only the highest-rated employees are considered for promotion.'],['In a social group','People regularly make jokes about anyone who looks different.']]},
 '4.6':{prompt:'A strength can become an inflexible rule',items:[['The strength','Practising independent problem solving can develop skill.'],['The cost','Refusing help when overwhelmed can make the problem harder.']]},
 '5.2':{prompt:'See what Nina has started losing time for',items:[['Project','She is polishing details that no longer address the funder’s feedback.'],['Sleep','She postpones sleep to work for longer.'],['Friends','She cancels plans she had promised to attend.'],['Learning','She avoids gaps in her knowledge that others could help resolve.']]},
 '6.4':{prompt:'Compare how two responses affect the next step',items:[['Self-punishment','I am such an idiot. I always ruin things.'],['A workable response','I am disappointed. I need to understand what to change.']]},
 '5.4':{prompt:'Which question is useful for the project, and which turns it into a test of worth?',items:[['Learn from Finn','What did Finn include that could strengthen our proposal?'],['Judge Nina','Why did he succeed when I am supposed to be good at this?']]},
 '6.8':{prompt:'Three different ways to respond to the thought',items:[['Check the evidence','What evidence says one result describes all my abilities?'],['Change its meaning','Struggling with this task does not settle everything about me.'],['Choose an action','What is one useful step I can take about the problem?']]},
 '7.3':{prompt:'Notice how the interpretation changes the conversation',items:[['A specific conflict','My friend is frustrated with something I did.'],['A verdict on myself','There must be something fundamentally wrong with me.']]},
 '7.5':{prompt:'Compare two responses to disagreement',items:[['Hurt and discussion','I felt hurt by what happened. I would like us to talk about it.'],['Conditional affection','If you disagree with me, do not expect me to be affectionate.']]},
 '7.7':{prompt:'Two concerns can compete for attention',items:[['Prove I am good','Establish that I am normally considerate.'],['Address the effect','Understand what happened and make a suitable correction.']]}
};
const SORT={
 '1.8':{prompt:'Which statement is about a valued goal, and which makes worth depend on the result?',categories:[['value','This matters to me'],['worth','This determines how I see myself']],items:[['I want to do well because I care about the subject.','value'],['If I do not do well, I will not feel worth much.','worth']]},
 '6.2':{prompt:'What is the feedback describing?',categories:[['task','Feedback about the task'],['person','Judgment about the person']],items:[['The recruitment estimate needs more evidence.','task'],['I do not deserve to lead anything.','person'],['We need to contact schools before estimating attendance.','task'],['Other people would have done this properly.','person']]},
 '5.7':{prompt:'Match each rule to a cost that it might create',categories:[['help','Agreeing to more than someone can manage'],['best','Treating a peer’s success as threatening'],['good','Defensiveness about a genuine mistake'],['competent','Avoiding questions or difficult learning opportunities']],items:[['I must never disappoint anyone.','help'],['I must always be the best.','best'],['I must always be a good person.','good'],['I must always look competent.','competent']]}
};
const SEQUENCE={
 '3.3':{prompt:'Rebuild Nina’s cycle from the events in her story',items:[['event','The application was rejected'],['meaning','She thought the result proved she was incapable'],['pressure','She felt anxious about being evaluated again'],['avoid','She polished work she already understood'],['relief','For a while, she felt less exposed'],['cost','The missing budget was still not finished']]}
};
const DIALOGUES=new Set(['1.2','3.1','4.1','5.1','7.1','7.8']);
const OPEN_REVIEW=new Set(['2.6']);
const NOTE=/^(Interaction note:|Design note:|No question yet\.|Learner advances|Teaching purpose:)/i;
const LABEL=/^(On screen|Question|Answer choices|Options|Conversation|Explanation|Email card|Source card|Interaction note|Closing message)$/i;
const RESULT_MARK=/^(?:Correct answer|Best answer|Best-supported answer|Best-supported response)\s*:\s*([A-D])/i;
function parse(screen){
 const d={id:screen.id,title:screen.heading,body:[],extra:[],options:[],feedbackBy:{},answer:null,instruction:'',source:screen};
 let target='body',chosen='',pending=null;
 for(const line of screen.paragraphs||[]){
  const p=String(line||'').trim();if(!p)continue;
  if(NOTE.test(p))continue;
  if(/^Interaction:/i.test(p)){d.instruction=p.slice(p.indexOf(':')+1).trim();continue;}
  if(/^Button(?:s)?:/i.test(p)){continue;}
  const ans=p.match(RESULT_MARK);if(ans){d.answer=ans[1].toUpperCase();continue;}
  let m=p.match(/^(?:Feedback|Reveal)\s+for\s+([A-D])$/i);
  if(m){target='choice';chosen=m[1].toUpperCase();d.feedbackBy[chosen]=[];pending=null;continue;}
  if(/^(Reveal|Feedback|Follow-up|Self-check(?: model answer)?|Alternative path|Research drawer|Correct answer explanation|Example completion)$/i.test(p)){
   target='extra';chosen='';pending=null;continue;
  }
  if(p==='Explanation'){
   target=d.instruction||d.options.length?'extra':'body';continue;
  }
  if(LABEL.test(p))continue;
  if(p==='Interaction')continue;
  const ab=p.match(/^([A-D])\.\s+(.+)/);
  if(ab){d.options.push({id:ab[1],label:ab[2]});pending=null;continue;}
  const option=p.match(/^(?:Option|Response)\s+([A-D])\s*(?:[—:]\s*(.*))?$/);
  if(option){d.options.push({id:option[1],label:option[2]||''});pending=option[1];continue;}
  if(pending&&d.options.length){
   const last=d.options[d.options.length-1];if(last.id===pending){last.label+=(last.label?' — ':'')+p;pending=null;continue;}
  }
  if(target==='choice'){d.feedbackBy[chosen].push(p);}
  else if(target==='extra')d.extra.push(p);
  else d.body.push(p);
 }
 // These are teaching comparisons, not questions with one correct response.
 if(COMPARE.has(d.id))d.answer=null;
 if(d.id==='1.3')d.answer=null;
 if(!d.answer&&ANSWERS[d.id]&&!COMPARE.has(d.id)&&d.id!=='1.3')d.answer=ANSWERS[d.id];
 const first=d.body[0]||'';
 if(first.length<=83&&!/[.!]$/.test(first)&&!first.startsWith('1.')&&!first.startsWith('2.')){
  d.title=first;d.body.shift();
 }
 return d;
}
export const contingentLessonCheckCount=lesson=>Array.isArray(lesson?.screens)?lesson.screens.map(parse).filter(x=>x.answer&&x.options.length>=2).length:0;
function ensureStyle(){
 if(typeof document==='undefined'||document.querySelector('link[data-csw-style]'))return;
 const link=document.createElement('link');link.rel='stylesheet';link.href='ns-contingent-selfworth.css?v='+STAMP;link.dataset.cswStyle='1';document.head.append(link);
}
const speakerNames=new Set(['Nina','Asha','Maya','Jonah','Ishan','Friend','Tara','Leah','Malik','Sister','Oliver','Amir','Alex','Finn','Sophie','Person A','Person B']);
function prose(paragraphs,visible=Infinity){
 let shown=0,html='';
 for(const item of paragraphs){
  const p=String(item);
  const named=p.match(/^([^:]{2,22}):\s+(.+)$/);
  if(named&&speakerNames.has(named[1])){
   if(shown++>=visible)continue;
   const who=named[1],tone=['Nina','Jonah','Tara','Leah','Malik','Oliver','Amir','Sophie'].includes(who)?'self':'other';
   html+='<div class="csw-message csw-message--'+tone+'"><span class="csw-message__avatar" aria-hidden="true">'+esc(who.slice(0,1))+'</span><div><strong>'+esc(who)+'</strong><p>'+esc(named[2])+'</p></div></div>';continue;
  }
  if(/^Subject:/i.test(p)){html+='<div class="csw-letter-line csw-letter-line--subject">'+esc(p)+'</div>';continue;}
  if(/^Step \d|^\d\s*[—-]\s+/.test(p)){html+='<p class="csw-process-line">'+esc(p)+'</p>';continue;}
  if(/^Card \d|^Goal [A-B]|^Moment [A-B]|^Track [A-B]|^Situation [A-B]|^Response [A-B]/.test(p)){html+='<p class="csw-subheading">'+esc(p)+'</p>';continue;}
  if(p.length<60&&!/[.!?]$/.test(p)&&!p.startsWith('"')&&!p.startsWith('“')&&p[0]===p[0]?.toUpperCase()){
   html+='<h3 class="csw-minor">'+esc(p)+'</h3>';continue;
  }
  html+='<p>'+esc(p)+'</p>';
 }
 return html;
}
function readResume(lesson){
 try{const obj=JSON.parse(sessionStorage.getItem('csw-position:'+lesson.id)||'null');return obj&&Number.isInteger(obj.index)?obj:null;}catch{return null;}
}
function writeResume(lesson,state){
 try{sessionStorage.setItem('csw-position:'+lesson.id,JSON.stringify({index:state.index,answers:state.answers}));}catch{}
}
function clearResume(lesson){try{sessionStorage.removeItem('csw-position:'+lesson.id);}catch{}}
function readyChoice(d,state){return d.options.length>=2&&!SORT[d.id]&&!SEQUENCE[d.id]&&!JOURNAL[d.id]&&!COMPARE.has(d.id);}
export function renderContingentWorthLesson(root,bundle,lesson,{review=false,preview=false}={}){
 ensureStyle();
 if(!Array.isArray(lesson?.screens)||!lesson.screens.length){
  root.innerHTML='<p class="csw-error">The authored lesson could not be opened. Return to the course and try again.</p>';return;
 }
 const progress=readResume(lesson);
 const state={index:Math.min(progress?.index||0,lesson.screens.length-1),answers:progress?.answers||{},choice:'',result:false,expanded:new Set(),dialogueVisible:1,sortAnswers:{},sequence:[],fields:{},finished:false,saved:false,notice:''};
 let d=null;
 const url='#learn/course/'+encodeURIComponent(bundle.id);
 function finish(){
  const graded=lesson.screens.map(parse).filter(s=>s.answer&&s.options.length>=2);
  const correct=graded.filter(s=>state.answers[s.id]===s.answer).length;
  const allAnswered=graded.every(s=>!!state.answers[s.id]);
  state.finished=true;
  if(!state.saved&&!preview&&allAnswered){
   const score={total:graded.length,correct,allAnswered:true,corrections:{missed:graded.length-correct,recovered:0,stillToReview:graded.length-correct}};
   const save=(review?saveLearnReview:saveLearnCompletion)(bundle,lesson,score);
   state.notice=save.ok?'Lesson progress saved.':save.error;
   state.saved=save.ok;
  }else if(preview)state.notice='Preview only. Progress has not been saved.';
  if(state.saved||preview)clearResume(lesson);
  paint();
 }
 function resetScreen(){
  d=parse(lesson.screens[state.index]);state.result=false;state.choice=state.answers[d.id]||'';
  state.expanded=new Set();state.dialogueVisible=DIALOGUES.has(d.id)?1:Infinity;
  state.sortAnswers={};state.sequence=[];state.fields={};
 }
 function next(){
  if(state.index>=lesson.screens.length-1)return finish();
  state.index++;writeResume(lesson,state);resetScreen();paint(true);
 }
 function feedback(d){
  const selection=state.choice;
  const specific=d.feedbackBy[selection]||[];
  const general=d.extra||[];
  let heading=d.answer?state.choice===d.answer?'Why this answer fits':'Look at the distinction':'What this choice tells us';
  let chunks=[...specific];
  if(general.length&&(!specific.length||d.id==='2.3'))chunks.push(...general);
  if(!chunks.length)chunks=['Look at the information in the scene. The next useful question is what the response changes about the original problem.'];
  return '<section class="csw-feedback" role="status"><h3>'+esc(heading)+'</h3>'+prose(chunks)+'</section>';
 }
 function renderCards(id){
  const c=EXPLORE[id];if(!c)return '';
  return '<section class="csw-activity" aria-label="'+esc(c.prompt)+'"><h2>'+esc(c.prompt)+'</h2><div class="csw-card-grid">'+c.items.map(([label,value],i)=>'<button class="csw-flip '+(state.expanded.has(i)?'is-open':'')+'" type="button" data-flip="'+i+'" aria-pressed="'+state.expanded.has(i)+'"><strong>'+esc(label)+'</strong><span>'+esc(value)+'</span><small>'+(state.expanded.has(i)?'Explored ✓':'Tap to explore')+'</small></button>').join('')+'</div></section>';
 }
 function renderSort(id){
  const s=SORT[id];if(!s)return '';
  const finished=state.result;
  return '<section class="csw-activity"><h2>'+esc(s.prompt)+'</h2><div class="csw-sort">'+s.items.map(([label,correct],i)=>'<div class="csw-sort-item"><p>'+esc(label)+'</p><div role="group" aria-label="Classify statement '+(i+1)+'">'+s.categories.map(([key,name])=>'<button type="button" class="'+(state.sortAnswers[i]===key?'is-selected':'')+'" data-sort="'+i+'" data-category="'+esc(key)+'" '+(finished?'disabled':'')+' aria-pressed="'+(state.sortAnswers[i]===key)+'">'+esc(name)+'</button>').join('')+'</div></div>').join('')+'</div>'+(state.result?'<div class="csw-feedback"><h3>Your classifications</h3>'+s.items.map(([label,correct],i)=>'<p><strong>'+esc(state.sortAnswers[i]===correct?'Correct: ':'Revise this: ')+'</strong>'+esc(label)+' — '+esc(s.categories.find(x=>x[0]===correct)[1])+'</p>').join('')+prose(d.extra)+'</div>':'')+'</section>';
 }
 function renderSequence(id){
  const seq=SEQUENCE[id];if(!seq)return '';
  const seqIds=['pressure','cost','event','relief','meaning','avoid'];
  const order=seqIds.filter(x=>!state.sequence.includes(x));
  return '<section class="csw-activity"><h2>'+esc(seq.prompt)+'</h2><p>Select the cards in order. Tap an answer to remove it.</p><ol class="csw-ordered">'+state.sequence.map((key,i)=>'<li><button type="button" data-remove="'+i+'" '+(state.result?'disabled':'')+'>'+esc(seq.items.find(x=>x[0]===key)?.[1]||key)+'</button></li>').join('')+'</ol><div class="csw-sequence-bank">'+order.map(key=>'<button type="button" data-add="'+esc(key)+'" '+(state.result?'disabled':'')+'>'+esc(seq.items.find(x=>x[0]===key)?.[1]||key)+'</button>').join('')+'</div>'+(state.result?'<div class="csw-feedback"><h3>'+(state.sequence.join('|')===seq.items.map(x=>x[0]).join('|')?'You reconstructed the cycle':'Follow the causal chain')+'</h3><p>'+esc(seq.items.map(x=>x[1]).join(' → '))+'</p>'+prose(d.extra)+'</div>':'')+'</section>';
 }
 function renderJournal(id){
  const qs=JOURNAL[id];if(!qs)return '';
  const intro=id==='8.10'?'<div class="csw-rule-choice"><label for="csw-rule">A rule I want to examine</label><select id="csw-rule"><option value="">Choose a rule (optional)</option>'+['When I fail, I feel inadequate.','When someone is disappointed in me, I question whether I am good.','When someone else succeeds, I feel less capable.','When I need help, I feel ashamed.','Something else.'].map(q=>'<option value="'+esc(q)+'"'+(state.fields.rule===q?' selected':'')+'>'+esc(q)+'</option>').join('')+'</select></div>':'';
  return '<section class="csw-activity csw-reflection"><h2>Try it in your own words</h2><p>Your writing stays on this screen unless you choose to open a Field Guide draft. You can also use the example and move on.</p>'+intro+qs.map((q,i)=>'<label>'+esc(q)+'<textarea data-field="'+i+'" rows="3" placeholder="Write here, or leave this blank…">'+esc(state.fields[i]||'')+'</textarea></label>').join('')+'<div class="csw-reflection-actions"><button type="button" data-selfcheck>Compare with the example</button><button type="button" data-save-guide>Open draft in Field Guide</button></div>'+(state.result?'<section class="csw-feedback"><h3>Example and explanation</h3>'+prose(d.extra)+'</section>':'')+'</section>';
 }
 function renderChoices(){
  if(!readyChoice(d,state))return '';
  return '<fieldset class="csw-activity csw-choices" '+(state.result?'disabled':'')+'><legend>Choose the answer that fits the situation</legend>'+d.options.map(o=>'<label class="csw-option '+(state.choice===o.id?'is-selected':'')+'"><input type="radio" name="csw-choice" value="'+esc(o.id)+'" '+(state.choice===o.id?'checked':'')+'><span class="csw-option__letter">'+esc(o.id)+'</span><span>'+esc(o.label)+'</span></label>').join('')+'</fieldset>';
 }
 function canMove(){
  if(readyChoice(d,state))return state.result;
  if(SORT[d.id]||SEQUENCE[d.id])return state.result;
  if(JOURNAL[d.id])return true;
  const exp=EXPLORE[d.id];if(exp?.all)return state.expanded.size>=exp.items.length;
  if(DIALOGUES.has(d.id)&&state.dialogueVisible<d.body.filter(p=>/^([^:]{2,22}):\s+(.+)$/.test(p)&&speakerNames.has(p.split(':')[0])).length)return false;
  if(exp&&state.expanded.size<exp.items.length)return false;
  if(d.extra.length&&!state.result&&!OPEN_REVIEW.has(d.id))return false;
  return true;
 }
 function paint(resetPosition=false){
  const previousScroll=resetPosition?0:root.querySelector('.csw-unit')?.scrollTop||0;
  if(!d)resetScreen();
  const total=lesson.screens.length;const pct=state.finished?100:Math.round((state.index+(state.result?0.5:0))/total*100);
  if(state.finished){
   root.innerHTML='<section class="csw-unit"><header class="csw-top"><a href="'+url+'" aria-label="Return to course">×</a><span class="csw-meter"><i style="width:100%"></i></span><small>Complete</small></header><main class="csw-main"><div class="csw-finish"><img src="ns-character-reading.webp" alt="" width="100" height="100"><p class="csw-kicker">LESSON COMPLETE</p><h1>'+esc(lesson.title)+'</h1><p>You have reached the end of this lesson. You can return to any of its examples whenever you need them.</p><p role="status">'+esc(state.notice)+'</p><a class="csw-primary" href="'+url+'">Return to your learning path →</a></div></main></section>';return;
  }
  const lessonLabel=lesson.reviewDelayDays?'Review':'Lesson';
  const heading=d.title;
  const body=d.body.filter(x=>!(/^On screen$/).test(x));
  const dialogueCount=body.filter(p=>{const a=p.match(/^([^:]{2,22}):\s+/);return a&&speakerNames.has(a[1]);}).length;
  let extra='';
  if(state.result&&!readyChoice(d,state)&&!SORT[d.id]&&!SEQUENCE[d.id]&&!JOURNAL[d.id]&&d.extra.length)extra='<section class="csw-feedback"><h3>What this means</h3>'+prose(d.extra)+'</section>';
  if(state.result&&readyChoice(d,state))extra=feedback(d);
  const showAll=state.dialogueVisible>=dialogueCount;
  let action='';
  if(DIALOGUES.has(d.id)&&!showAll)action='<button class="csw-primary" data-more-dialogue>Next message →</button>';
  else if(readyChoice(d,state)&&!state.result)action='<button class="csw-primary" data-check '+(!state.choice?'disabled':'')+'>Check answer</button>';
  else if(SORT[d.id]&&!state.result)action='<button class="csw-primary" data-check-sort '+(Object.keys(state.sortAnswers).length!==SORT[d.id].items.length?'disabled':'')+'>Check classifications</button>';
  else if(SEQUENCE[d.id]&&!state.result)action='<button class="csw-primary" data-check-sequence '+(state.sequence.length!==SEQUENCE[d.id].items.length?'disabled':'')+'>Check order</button>';
  else if(d.extra.length&&!state.result&&!JOURNAL[d.id]&&!OPEN_REVIEW.has(d.id)&&(!EXPLORE[d.id]||state.expanded.size>=EXPLORE[d.id].items.length))action='<button class="csw-primary" data-reveal>See the explanation →</button>';
  else action='<button class="csw-primary" data-next '+(!canMove()?'disabled':'')+'>'+(state.index===total-1?'Finish lesson':'Continue →')+'</button>';
  root.innerHTML='<section class="csw-unit"><header class="csw-top"><a class="csw-exit" href="'+url+'" aria-label="Return to course">×</a><div class="csw-meter" role="progressbar" aria-label="Lesson progress" aria-valuenow="'+pct+'" aria-valuemin="0" aria-valuemax="100"><i style="width:'+pct+'%"></i></div><small>'+(state.index+1)+' / '+total+'</small></header><main class="csw-main" tabindex="-1"><div class="csw-heading"><p class="csw-kicker">'+esc(lessonLabel)+' '+esc(lesson.number||'')+' · '+esc(lesson.title)+'</p><h1>'+esc(heading)+'</h1></div><article class="csw-reading">'+prose(body,state.dialogueVisible)+'</article>'+renderCards(d.id)+renderSort(d.id)+renderSequence(d.id)+renderJournal(d.id)+renderChoices()+extra+(OPEN_REVIEW.has(d.id)&&d.extra.length?'<details class="csw-research"><summary>Explore the research</summary>'+prose(d.extra)+'</details>':'')+'</main><footer class="csw-actions">'+action+'</footer></section>';
  root.querySelector('.csw-unit').scrollTop=previousScroll;
  wire();
 }
 function wire(){
  root.querySelector('[data-more-dialogue]')?.addEventListener('click',()=>{state.dialogueVisible++;paint();});
  root.querySelectorAll('[data-flip]').forEach(b=>b.addEventListener('click',()=>{state.expanded.add(Number(b.dataset.flip));paint();}));
  root.querySelectorAll('input[name="csw-choice"]').forEach(input=>input.addEventListener('change',()=>{state.choice=input.value;paint();}));
  root.querySelector('[data-check]')?.addEventListener('click',()=>{state.answers[d.id]=state.choice;state.result=true;writeResume(lesson,state);paint();});
  root.querySelector('[data-reveal]')?.addEventListener('click',()=>{state.result=true;paint();});
  root.querySelectorAll('[data-sort]').forEach(b=>b.addEventListener('click',()=>{state.sortAnswers[b.dataset.sort]=b.dataset.category;paint();}));
  root.querySelector('[data-check-sort]')?.addEventListener('click',()=>{state.result=true;paint();});
  root.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>{state.sequence.push(b.dataset.add);paint();}));
  root.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{state.sequence.splice(Number(b.dataset.remove),1);paint();}));
  root.querySelector('[data-check-sequence]')?.addEventListener('click',()=>{state.result=true;paint();});
  root.querySelectorAll('textarea[data-field]').forEach(field=>field.addEventListener('input',()=>{state.fields[field.dataset.field]=field.value;}));
  root.querySelector('#csw-rule')?.addEventListener('change',e=>{state.fields.rule=e.target.value;});
  root.querySelector('[data-selfcheck]')?.addEventListener('click',()=>{state.result=true;paint();});
  root.querySelector('[data-save-guide]')?.addEventListener('click',async()=>{
   const fields=JOURNAL[d.id].map((q,i)=>({question:q,answer:String(state.fields[i]||'').trim()})).filter(x=>x.answer);
   if(state.fields.rule)fields.unshift({question:'A rule I want to examine',answer:state.fields.rule});
   if(!fields.length){state.notice='Write something or choose a rule first.';root.querySelector('.csw-reflection > p').textContent=state.notice;return;}
   const text=fields.map(x=>x.question+'\n'+x.answer).join('\n\n');
   try{
    const mod=await import('./ns-field-guide.mjs');
    mod.startFieldGuideDraft({title:'Contingent self-worth · '+lesson.title,text,context:'Learning reflection from Nobody’s Simple',category:'patterns',sourceType:'lesson',sourceId:lesson.id});
    location.hash='#guide/new';
   }catch{state.notice='The Field Guide could not be opened. Your reflection is still on this screen.';root.querySelector('.csw-reflection > p').textContent=state.notice;}
  });
  root.querySelector('[data-next]')?.addEventListener('click',next);
 }
 resetScreen();paint();
}