import {escapeHTML as esc} from './core.mjs';

/* Nobody's Simple · Investigate & Learn.
   Educational decision support, not diagnosis or an inferred clinical score.
   No answers or notes are saved or transmitted by this module. */

const nhsCBT='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/';
const nhsWorry='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/tackling-your-worries/';
const nhsStress='https://www.nhs.uk/every-mind-matters/mental-health-issues/stress/';
const nhsSolve='https://www.nhs.uk/every-mind-matters/mental-wellbeing-tips/self-help-cbt-techniques/problem-solving/';
const cciProcrastination='https://www.cci.health.wa.gov.au/Resources/For-Clinicians/Procrastination';

const make=(id,title,summary,cycle,tryIt,test,worksheet,tool,source)=>({
  id,title,summary,cycle,tryIt,test,worksheet,tool,source
});
const topics=[
 {
  id:'procrastination',name:'Putting things off',icon:'↗',time:'About 4–6 minutes',
  intro:'Not starting a task can reflect several different barriers. Explore which explanations fit this situation before choosing a strategy.',
  contexts:['University or work','Admin or household tasks','A difficult conversation','Personal care or health','Many different tasks'],
  patterns:['I can begin when someone helps me','It gets easier once I have started','It gets easier when expectations are lowered','There is rarely a difference','I am not sure'],
  constraints:['Too many demands or too little time','Noise, distractions or an inaccessible space','Money, care or work responsibilities','Health, sleep or low energy','No clear external obstacle'],
  attempts:['I planned and researched more','I pushed myself or criticised myself','I tried making the task smaller','I asked for help or changed conditions','I have not tried anything yet'],
  possibilities:[
   make('perfectionism','Fear of getting it wrong',
    'When the outcome feels like a test of your worth, starting can trigger anxiety. Avoiding then brings short-term relief while increasing future pressure.',
    ['High expectations','Threat of an imperfect outcome','Planning or delaying brings relief','Deadline pressure grows'],
    'Try a deliberately rough five-minute draft for a low-stakes task. Judge whether beginning was easier, rather than whether the output was excellent.',
    'If lower expectations make no difference, examine energy, task clarity and practical barriers too.',
    ['What outcome am I afraid of?','What rule am I imposing on myself?','What would a merely adequate first attempt look like?'],
    ['Try a start-barrier exercise','#tool/start-starter'],['CCI: Procrastination workbook',cciProcrastination]),
   make('ambiguity','Not knowing where to begin',
    'A goal such as "finish the project" combines many hidden decisions. Difficulty choosing the first concrete action can resemble a motivation problem.',
    ['Task feels large or unclear','Too many choices appear at once','Starting feels demanding','Avoidance leaves the task undefined'],
    'Define a first action that takes under two minutes and has an obvious end point. Try it without requiring the entire task to be solved.',
    'If the first step is clear but still feels unsafe or exhausting, the obstacle may not be ambiguity alone.',
    ['What exact action counts as starting?','What information do I actually need first?','How could I make the first action visible?'],
    ['Open Small Step','#tool/small-step'],['NHS: Problem solving',nhsSolve]),
   make('capacity','Low capacity or competing demands',
    'Low energy, fatigue, sensory load, illness and competing obligations may make the task genuinely hard to perform. More pressure can worsen the mismatch.',
    ['Demands exceed available capacity','Starting feels physically or mentally costly','More pressure depletes capacity','Tasks accumulate'],
    'Compare the task with your available energy and resources. Consider rest, adjustments, shared responsibilities or changing the demand.',
    'If the task becomes manageable when conditions change, that may point to an opportunity or capacity barrier rather than unwillingness.',
    ['What is consuming my available energy?','What could realistically be adjusted?','Whose support or permission would change the situation?'],
    ['Open Load Balancer','#tool/load-balancer'],['NHS: Understanding stress',nhsStress]),
   make('attention','Difficulty maintaining attention or reward',
    'Some tasks offer weak immediate feedback, require many transitions or compete with more immediately rewarding activities. This is not, by itself, evidence of any diagnosis.',
    ['A task feels remote or unstimulating','Attention moves to quicker rewards','Little progress is visible','Returning becomes harder'],
    'Make the start visible and brief. Try a cue, an immediate feedback marker or doing the first action alongside someone else.',
    'Notice whether the task becomes easier when you change its structure, not just how strongly you try.',
    ['When is focus naturally easier?','What cues help me return to this task?','Could the environment provide quicker feedback?'],
    ['Try Friction Finder','#tool/friction'],['NHS: CBT self-help guides',nhsCBT])
  ],
  branch:{
   perfectionism:{question:'When you imagine doing the task imperfectly, what happens?',opts:['I feel anxious, ashamed or judged','I can tolerate an imperfect start','It depends on who will see the result','I am not sure']},
   ambiguity:{question:'If someone gave you one very clear first step, what might change?',opts:['I would probably start','I might still feel afraid of the outcome','I would still feel too depleted','I am not sure']},
   capacity:{question:'If you had a quieter or less demanding day, what might happen?',opts:['Starting would become more realistic','I would still fear doing it badly','I would still struggle to decide what to do','I am not sure']},
   attention:{question:'What happens when a task has a quick reward or a clear cue?',opts:['It becomes easier to start or return','I still find it hard due to worry','I still feel too depleted','I am not sure']}
  }
 },
 {
  id:'overthinking',name:'Overthinking and worry',icon:'⌁',time:'About 4–6 minutes',
  intro:'Repeated thinking can sometimes help with planning, but it can also become a loop. Explore the function of the thinking before selecting a technique.',
  contexts:['A conversation or message','A future event','A past mistake','A practical decision','Many different worries'],
  patterns:['Once I get useful information','When I am occupied or connected to others','When I accept that certainty is not possible','It rarely feels easier','I am not sure'],
  constraints:['Unclear communication or conflicting information','Ongoing real-world uncertainty','High demands, money or housing stress','Poor sleep or exhaustion','No clear external obstacle'],
  attempts:['I searched for more information','I asked for reassurance','I tried to suppress the thoughts','I made a practical plan','I have not tried anything yet'],
  possibilities:[
   make('uncertainty','Trying to eliminate uncertainty',
    'The mind can repeatedly review possibilities in the hope of obtaining certainty that the situation cannot provide.',
    ['Something is uncertain','The mind searches for a guaranteed answer','Brief relief after checking','A new doubt reopens the question'],
    'Write down what is known, unknown and controllable. Choose one proportionate next step without demanding certainty first.',
    'If new, reliable information substantially changes the situation, practical information-gathering may be appropriate instead.',
    ['What answer am I hoping to make certain?','What is truly unknown?','What is a proportionate next step?'],
    ['Try Reality Map','#tool/reality-map'],['NHS: Tackling your worries',nhsWorry]),
   make('interpretation','Treating a possible meaning as a fact',
    'A brief reply, facial expression or isolated event can be interpreted as evidence of a negative outcome even when alternative explanations remain.',
    ['An ambiguous event occurs','One threatening story feels certain','Anxiety raises its apparent credibility','Further checking creates more interpretations'],
    'Separate observations from interpretations. Look for a piece of information that would genuinely distinguish plausible explanations.',
    'If there is clear evidence of harm or mistreatment, do not use alternative explanations to dismiss it.',
    ['What could a camera record?','What am I inferring?','Which evidence would change my view?'],
    ['Try Assumption Finder','#tool/assumption-finder'],['NHS: CBT self-help guides',nhsCBT]),
   make('reassurance','A reassurance-checking loop',
    'Seeking reassurance may ease discomfort quickly, but repeated checking can teach you that each new doubt needs another answer.',
    ['A doubt creates anxiety','Checking brings short relief','The uncertainty returns','More reassurance is needed'],
    'Where safe, notice the urge to check and delay an unnecessary repeat check briefly. Distinguish reasonable clarification from compulsive reassurance.',
    'If a real safety question is unresolved, practical checking may be necessary; do not resist appropriate safety action.',
    ['What exactly am I checking?','How long does relief last?','What would count as enough information?'],
    ['Try Rumination Check','#tool/rumination'],['NHS: Tackling your worries',nhsWorry]),
   make('practical','A problem that still needs action',
    'Sometimes the thinking persists because there is a concrete problem, but the thinking never becomes a decision or action.',
    ['A real task or decision remains','Possible solutions circle','No action is selected','The problem remains unresolved'],
    'Separate solvable parts from uncontrollable parts. Choose one concrete action, or decide when you will reconsider.',
    'If power, resources or safety prevent action, consider support and environmental changes, not just a better thinking style.',
    ['What practical decision exists?','What would be a sufficient next step?','What needs somebody else to change?'],
    ['Open Decision Map','#tool/decision-map'],['NHS: Problem solving',nhsSolve])
  ],
  branch:{
   uncertainty:{question:'What would you hope another round of thinking gives you?',opts:['Complete confidence that nothing will go wrong','A decision I can act on','Proof of what someone else meant','I am not sure']},
   interpretation:{question:'How much do you know about the event you are interpreting?',opts:['I have very little direct evidence','I have strong evidence of a real problem','I could clarify it by asking a question','I am not sure']},
   reassurance:{question:'What usually happens after somebody reassures you?',opts:['I feel better briefly and then doubt returns','I can generally move on','The concern remains objectively unresolved','I am not sure']},
   practical:{question:'If you had to name one concrete action, could you?',opts:['Yes, but I have not acted on it','No, I need information or resources','The situation depends on another person','I am not sure']}
  }
 },
 {
  id:'feelings',name:'Feeling overwhelmed',icon:'♡',time:'About 4–6 minutes',
  intro:'Overwhelm is a useful description of an experience, not one specific cause. Explore load, emotion, sensory input and what kind of support fits.',
  contexts:['Work or study pressure','Social situations','Sensory overload','A difficult emotion or event','Several things together'],
  patterns:['When demands drop','When I am in a quieter space','When I feel understood','When I have slept or recovered','I am not sure'],
  constraints:['Too many responsibilities','Noise, crowds or sensory input','Limited support or difficult relationships','Health, fatigue or poor sleep','No clear external obstacle'],
  attempts:['I kept pushing through','I withdrew or avoided everything','I tried to calm down quickly','I asked for help or changed my environment','I have not tried anything yet'],
  possibilities:[
   make('load','Too much demand for the available resources',
    'Several manageable stressors can combine into an unmanageable total. This points to the importance of workload, recovery and practical supports.',
    ['Demands accumulate','Capacity becomes stretched','Small demands feel unusually large','Less recovery makes the next day harder'],
    'List the current demands. Identify one that can be deferred, shared, reduced or supported, rather than adding another self-improvement task.',
    'If reducing demands makes little difference, consider other bodily, emotional or situational factors.',
    ['Which demands are fixed?','Which demands can be negotiated?','What support is realistically available?'],
    ['Open Load Balancer','#tool/load-balancer'],['NHS: Understanding stress',nhsStress]),
   make('sensory','Sensory or environmental overload',
    'Uncomfortable sensory input and unpredictable environments can raise the effort required to stay engaged, especially when escape or control is limited.',
    ['Noise, light or social input accumulates','The body becomes more activated','Concentration and tolerance narrow','Recovery needs increase'],
    'Where possible, change the sensory environment, ask for a break or choose input that feels more manageable.',
    'If the environment cannot be changed, practical accessibility adjustments may matter more than self-calming.',
    ['Which inputs increase the load?','What conditions are easier?','Which changes are within my control?'],
    ['Try Sensory Recipe','#tool/sensory-recipe'],['NHS: Understanding stress',nhsStress]),
   make('emotion','An emotion or need that needs attention',
    'Overwhelm can arise when strong or conflicting emotions, unmet needs and pressure to suppress them occur together.',
    ['An emotion appears','Its meaning or need remains unclear','Effort goes into suppressing it','The experience grows more difficult to manage'],
    'Try naming one feeling, one need and one supportive action. You do not have to settle everything immediately.',
    'Emotional awareness alone is unlikely to solve a harmful situation or remove an overwhelming workload.',
    ['What feeling is most present?','What might matter underneath it?','What response would be kind and proportionate?'],
    ['Try Mixed Feelings','#tool/mixed-feelings'],['NHS: CBT self-help guides',nhsCBT]),
   make('recovery','Not enough rest or recovery',
    'Sustained demands, disrupted sleep and health-related strain can leave less room to manage ordinary challenges.',
    ['Recovery becomes insufficient','Physical and mental fatigue accumulate','Everyday tasks require more effort','Pushing harder limits recovery further'],
    'Consider what genuine recovery or practical support would require. Look at schedule, workload and health rather than only relaxation techniques.',
    'Persistent or unusual exhaustion deserves appropriate health attention; it should not automatically be understood as an emotional skill deficit.',
    ['What has changed in my rest or health?','What is preventing recovery?','What demand could be paused or adjusted?'],
    ['Try State Check','#tool/state-check'],['NHS: Understanding stress',nhsStress])
  ],
  branch:{
   load:{question:'When the number of demands drops, what tends to happen?',opts:['I feel noticeably more capable','The sensory setting remains hard','I still feel emotionally distressed','I am not sure']},
   sensory:{question:'What happens when you move somewhere quieter or more predictable?',opts:['I often feel more able to cope','I still feel exhausted','I remain worried about a specific problem','I am not sure']},
   emotion:{question:'If you could put a clear name to the feeling, would that help?',opts:['It often makes it easier to respond','Not while the external demands stay the same','I am not sure what I am feeling','I am not sure']},
   recovery:{question:'Has your ability to cope changed alongside rest or health?',opts:['Yes, it tracks energy or sleep','Not much, even when I have rested','The biggest difficulty is an external situation','I am not sure']}
  }
 },
 {
  id:'relationships',name:'A difficult relationship or conversation',icon:'∞',time:'About 4–6 minutes',
  intro:'A difficult interaction can call for clarification, communication, repair, a boundary or support. Context and safety matter.',
  contexts:['An argument','Repeated cancellations or disappointment','Unclear messages','A boundary being crossed','A work or family relationship'],
  patterns:['When we talk directly','When I have space to think','When the other person respects a limit','It keeps happening regardless','I am not sure'],
  constraints:['A power imbalance or fear of consequences','Limited privacy or resources','Communication barriers or cultural expectations','Exhaustion or other demands','No clear external obstacle'],
  attempts:['I explained myself repeatedly','I stayed quiet','I apologised or tried to repair','I set a boundary','I have not tried anything yet'],
  possibilities:[
   make('ambiguity','An unclear interpretation',
    'People can attribute very different meanings to the same message or action. Clarification can help when the situation is genuinely ambiguous.',
    ['An interaction is ambiguous','One interpretation feels certain','A response is based on that assumption','Misunderstanding may grow'],
    'Separate what was said or done from what you think it meant. If safe, ask a specific, open question rather than asserting an intention.',
    'Repeated harmful behaviour should not be reinterpreted away merely because it might have another explanation.',
    ['What actually happened?','What meaning did I add?','What would be a fair clarifying question?'],
    ['Open Conversation Map','#tool/conversation-map'],['NHS: Problem solving',nhsSolve]),
   make('boundary','A recurring limit or need',
    'Difficulty may persist when expectations and limits remain unstated, ignored or incompatible. A boundary is about what you will do, not controlling another person.',
    ['A need or limit is repeatedly strained','Resentment or discomfort grows','The situation repeats','Trust or capacity is affected'],
    'Write a boundary that is clear, respectful and within your control. Decide what you can do if it is not respected.',
    'Where there is intimidation or retaliation risk, prioritise support and safety over rehearsing direct confrontation.',
    ['Which behaviour is affecting me?','Which limit is mine to set?','What action can I safely control?'],
    ['Try Boundary Builder','#tool/boundary-builder'],['NHS: Understanding stress',nhsStress]),
   make('repair','A rupture that may need repair',
    'Even generally supportive relationships can involve hurt and misunderstandings. Repair requires acknowledgment, meaningful changes and willingness on both sides.',
    ['An interaction creates hurt','The impact goes unaddressed','Defensiveness or distance grows','Repair becomes more difficult'],
    'Try identifying what happened, its impact, what responsibility is yours and what specific change would matter.',
    'If only one person is doing the repairing, consider whether repeated attempts remain useful or safe.',
    ['What needs acknowledging?','What part is my responsibility?','What would meaningful repair involve?'],
    ['Open Repair Plan','#tool/repair'],['NHS: Problem solving',nhsSolve]),
   make('safety','Power, pressure or safety concerns',
    'Some difficulties are maintained by unequal power, coercion, practical dependence or lack of safe alternatives. Communication techniques alone may be inadequate.',
    ['A person has power or control','Setting limits feels unsafe','Options become restricted','The situation persists'],
    'Prioritise practical support, safer options and people or services you trust. You do not need to confront someone to prove assertiveness.',
    'Avoid low-stakes communication experiments if there is a real risk of retaliation or violence.',
    ['What feels unsafe or restricted?','Who could support me safely?','Which step would not increase risk?'],
    ['Open support options','#support'],['NHS: Understanding stress',nhsStress])
  ],
  branch:{
   ambiguity:{question:'What evidence do you have about the other person’s intention?',opts:['Mostly assumptions or indirect cues','Repeated behaviour makes it clearer','I could ask safely','I am not sure']},
   boundary:{question:'What happens when you express a reasonable limit?',opts:['It is discussed and usually respected','It is repeatedly ignored','I am afraid of the reaction','I am not sure']},
   repair:{question:'When you have tried to repair the situation, what happened?',opts:['Both people have tried to improve it','The same problem keeps recurring','Repair attempts do not feel safe','I am not sure']},
   safety:{question:'Would setting a clear limit feel safe in this situation?',opts:['No, I am concerned about consequences','Possibly, with support','Yes, direct conversation seems safe','I am not sure']}
  }
 }
];
export const investigationTopics=Object.freeze(topics.map(({id,name,intro,icon,time})=>({id,name,intro,icon,time})));
export const findInvestigationTopic=id=>topics.find(t=>t.id===id)||null;
const safe=(value)=>esc(String(value==null?'':value));
const choice=(id,label)=>({id,label});
const options=(xs)=>xs.map((label,i)=>choice(String(i),label));
const answersFor=(topic,answers={})=>{
 const picked=topic.possibilities.find(x=>x.id===answers.mechanism);
 const branch=topic.branch[picked?.id];
 return [
  {id:'context',label:'What is the situation mainly about?',help:'This helps put the problem in context.',choices:options(topic.contexts)},
  {id:'mechanism',label:'Which possibility sounds closest?',help:'There may be several. Choose one to explore first; you can revise it later.',choices:[...topic.possibilities.map(m=>choice(m.id,m.title)),choice('unsure','More than one / I am not sure')]},
  {id:'detail',label:branch?.question||'What would most help us distinguish the explanations?',help:'Your answer helps us evaluate the first hypothesis, not confirm a diagnosis.',choices:options(branch?.opts||['I need more specific information','I need time or a change of context','Several explanations still fit','I am not sure'])},
  {id:'exception',label:'When does the problem tend to feel easier?',help:'Exceptions and protective conditions can be as informative as difficulties.',choices:options(topic.patterns)},
  {id:'constraint',label:'Which outside condition is most relevant?',help:'Sometimes the problem is maintained by circumstances rather than a lack of individual skill.',choices:options(topic.constraints)},
  {id:'attempt',label:'What have you already tried?',help:'We should not repeatedly recommend strategies that have not helped.',choices:options(topic.attempts)}
 ];
};
export function investigationQuestions(topicId,answers={}){
 const t=findInvestigationTopic(topicId);
 return t?answersFor(t,answers):[];
}
const evidenceRules={
 procrastination:{
  context:[null,'ambiguity','perfectionism','capacity',null],
  exceptions:['ambiguity','attention','perfectionism','capacity',null],
  constraints:['capacity','attention','capacity','capacity',null],
  detail:{perfectionism:['perfectionism','ambiguity','capacity',null],
   ambiguity:['ambiguity','perfectionism','capacity',null],
   capacity:['capacity','perfectionism','ambiguity',null],
   attention:['attention','perfectionism','capacity',null]}
 },
 overthinking:{
  context:['interpretation','uncertainty','reassurance','practical',null],
  exceptions:['practical','reassurance','uncertainty',null,null],
  constraints:['interpretation','uncertainty','practical','uncertainty',null],
  detail:{uncertainty:['uncertainty','practical','interpretation',null],
   interpretation:['interpretation','practical','practical',null],
   reassurance:['reassurance','practical','practical',null],
   practical:['practical','practical','practical',null]}
 },
 feelings:{
  context:['load','emotion','sensory','emotion','load'],
  exceptions:['load','sensory','emotion','recovery',null],
  constraints:['load','sensory','load','recovery',null],
  detail:{load:['load','sensory','emotion',null],
   sensory:['sensory','recovery','emotion',null],
   emotion:['emotion','load','emotion',null],
   recovery:['recovery','recovery','load',null]}
 },
 relationships:{
  context:['repair','boundary','ambiguity','boundary',null],
  exceptions:['ambiguity','repair','boundary','safety',null],
  constraints:['safety','safety','ambiguity','repair',null],
  detail:{ambiguity:['ambiguity','boundary','ambiguity',null],
   boundary:['boundary','boundary','safety',null],
   repair:['repair','boundary','safety',null],
   safety:['safety','safety','ambiguity',null]}
 }
};
/* Simple documented relevance rules, not calibrated scores or diagnostic probabilities.
   Multiple observations can support or challenge the user's initial hypothesis. */
export function investigationFormulation(topicId,answers={}){
 const t=findInvestigationTopic(topicId);if(!t)return null;
 const rules=evidenceRules[t.id];
 const scores=Object.fromEntries(t.possibilities.map(x=>[x.id,0]));
 const add=(id,weight=1)=>{if(id&&Object.hasOwn(scores,id))scores[id]+=weight;};
 const chosen=t.possibilities.find(x=>x.id===answers.mechanism);
 if(chosen)add(chosen.id,2);
 const evidence=rules.detail[chosen?.id]?.[Number(answers.detail)];
 if(evidence)add(evidence,Number(answers.detail)===0?2:3);
 if(answers.context!==undefined)add(rules.context[Number(answers.context)],1);
 if(answers.exception!==undefined)add(rules.exceptions[Number(answers.exception)],1);
 if(answers.constraint!==undefined)add(rules.constraints[Number(answers.constraint)],t.id==='relationships'&&answers.constraint==='0'?4:2);
 const ranked=[...t.possibilities].sort((a,b)=>scores[b.id]-scores[a.id]||(a.id===chosen?.id?-1:0)-(b.id===chosen?.id?-1:0));
 const first=ranked[0],alt=ranked[1];
 const context=t.contexts[Number(answers.context)]||'the situation you described';
 const environments=t.constraints[Number(answers.constraint)]||'conditions not yet identified';
 const exceptions=t.patterns[Number(answers.exception)]||'exceptions not yet identified';
 const prior=t.attempts[Number(answers.attempt)]||'previous approaches not yet identified';
 const branch=t.branch[chosen?.id];
 const detail=branch?.opts?.[Number(answers.detail)]||null;
 const caution=t.id==='relationships'&&(first.id==='safety'||answers.constraint==='0'||(chosen?.id==='boundary'&&answers.detail==='2'));
 const changed=Boolean(chosen&&chosen.id!==first.id);
 const uncertain=!chosen||scores[first.id]-scores[alt.id]<2;
 const why=(changed
  ?'You initially considered “'+chosen.title+'”, but your later answers also point toward “'+first.title+'”. '
  :chosen?'You recognised “'+chosen.title+'” as a possible explanation. '
  :'You were unsure which mechanism best fits, so the contextual answers help identify a starting point. ')+
  'You described '+context.toLowerCase()+'. '+(detail?'Your follow-up answer was “'+detail+'”. ':'')+
  'This is an organising hypothesis, not evidence that a cause has been established.';
 const limitations=(changed?'The answers are mixed: '+chosen.title.toLowerCase()+' may still contribute. ':'')+first.test;
 const systemNote=answers.constraint==='4'
  ?'You did not identify a main external barrier in this brief questionnaire. That does not rule out contextual factors.'
  :'You identified “'+environments+'”. Consider whether changing this condition would be more useful than trying harder individually.';
 return {topic:t,primary:first,alternative:alt,context,environments,exceptions,prior,detail,
   uncertain,caution,why,limitations,systemNote};
}

function questionMarkup(q,index,total,answer){
 return '<div class="ns-inv-progress"><span>QUESTION '+(index+1)+' OF '+total+'</span><div class="ns-inv-meter"><span style="width:'+Math.round(index/total*100)+'%"></span></div></div>'+
 '<fieldset><legend>'+safe(q.label)+'</legend><p class="ns-inv-support">'+safe(q.help)+'</p><div class="ns-inv-answer-grid">'+
 q.choices.map((item,i)=>'<label class="ns-inv-answer"><input type="radio" name="inv-answer" value="'+safe(item.id)+'" '+(answer===item.id?'checked':'')+' required><span><i>'+String.fromCharCode(65+i)+'</i>'+safe(item.label)+'</span></label>').join('')+
 '</div></fieldset>';
}
function landingMarkup(){
 return '<div class="ns-inv-shell"><a class="ns-inv-back" href="#navigate">← Back to Navigation Console</a>'+
 '<header class="ns-inv-intro"><p class="eyebrow">NOBODY’S SIMPLE · INVESTIGATE & LEARN</p><h1>What would you like to understand?</h1>'+
 '<p>Explore a problem through a few thoughtful questions. See different possible explanations, why they may fit and what might help.</p></header>'+
 '<div class="ns-inv-topic-grid">'+topics.map((t,i)=>'<a class="ns-inv-topic" data-topic="'+safe(t.id)+'" href="#investigate/'+safe(t.id)+'"><span class="ns-inv-topic-icon" aria-hidden="true">'+safe(t.icon)+'</span><strong>'+safe(t.name)+'</strong><small>'+safe(t.intro)+'</small><span class="ns-inv-topic-bottom">'+safe(t.time)+' <b aria-hidden="true">→</b></span></a>').join('')+'</div>'+
 '<section class="ns-inv-note"><strong>How this works</strong><p>These questions organise possibilities, not diagnoses. There are no hidden clinical scores. Your answers stay in this page until you leave; you can download a private worksheet if you choose.</p></section></div>';
}
function stepMarkup(t,q,index,total,answer){
 return '<div class="ns-inv-shell"><a class="ns-inv-back" href="#investigate">← All investigations</a>'+
 '<header class="ns-inv-mini-head"><p class="eyebrow">INVESTIGATE · '+safe(t.name)+'</p><h1>Let’s understand what is happening.</h1><p>'+safe(t.intro)+'</p></header>'+
 '<form id="ns-inv-form" class="ns-inv-question">'+questionMarkup(q,index,total,answer)+
 '<p class="ns-inv-error" data-inv-error role="status" aria-live="polite"></p><div class="ns-inv-actions">'+
 '<button type="button" class="button secondary" data-inv-back '+(index===0?'disabled':'')+'>← Back</button>'+
 '<button type="submit" class="button">'+(index===total-1?'See my learning guide →':'Continue →')+'</button></div>'+
 '<p class="ns-inv-fine">Choose what fits best right now. You can go back and change an answer. Nothing is saved automatically.</p></form></div>';
}
function itemLink([label,url]){return '<a class="ns-inv-resource" href="'+safe(url)+'" '+(url.startsWith('https://')?'target="_blank" rel="noopener noreferrer"':'')+'><strong>'+safe(label)+'</strong><span aria-hidden="true">↗</span></a>';}
function resultMarkup(f){
 const p=f.primary,a=f.alternative;
 const cycle=p.cycle.map((s,i)=>'<li><span>'+(i+1)+'</span>'+safe(s)+'</li>').join('');
 const worksheet=p.worksheet.map((s,i)=>'<label>'+safe(s)+'<textarea data-inv-note="'+i+'" rows="3" maxlength="1500" placeholder="Write a few words, or leave this blank"></textarea></label>').join('');
 return '<div class="ns-inv-shell ns-inv-results"><a class="ns-inv-back" href="#investigate">← All investigations</a>'+
 '<header class="ns-inv-intro"><p class="eyebrow">YOUR EDUCATIONAL WALKTHROUGH · '+safe(f.topic.name)+'</p><h1>Let’s make sense of this.</h1>'+
 '<p>We have identified possibilities worth exploring—not a diagnosis or a proven explanation.</p></header>'+
 (f.caution?'<div class="ns-inv-alert"><strong>Safety and power matter here.</strong><p>Where there is intimidation, coercion or fear of retaliation, prioritise safety and support. Do not use a confrontation exercise as a test.</p><a href="#support">Explore support options →</a></div>':'')+
 '<section class="ns-inv-panel"><p class="eyebrow">POSSIBILITY TO EXPLORE</p><h2>'+safe(p.title)+'</h2><p>'+safe(p.summary)+'</p>'+
 '<div class="ns-inv-rationale"><strong>Why this was suggested</strong><p>'+safe(f.why)+'</p>'+
 (f.detail?'<p>You also answered: “'+safe(f.detail)+'”. This gives useful context but cannot establish a cause.</p>':'')+
 '<p><strong>What could change this view?</strong> '+safe(f.limitations)+'</p></div></section>'+
 '<section class="ns-inv-panel"><p class="eyebrow">THE PSYCHOLOGY</p><h2>One possible maintaining cycle</h2><p>These stages illustrate a mechanism you can compare with your experience. They are not a prediction.</p><ol class="ns-inv-cycle">'+cycle+'</ol></section>'+
 '<section class="ns-inv-panel ns-inv-contrast"><p class="eyebrow">DON’T STOP AT ONE EXPLANATION</p><h2>Another possibility: '+safe(a.title)+'</h2><p>'+safe(a.summary)+'</p>'+
 '<p><strong>What you noticed about your context:</strong> '+safe(f.systemNote)+'</p>'+
 '<p><strong>When it is easier:</strong> '+safe(f.exceptions)+'. <strong>Previously tried:</strong> '+safe(f.prior)+'.</p></section>'+
 '<section class="ns-inv-panel"><p class="eyebrow">TRY SOMETHING PROPORTIONATE</p><h2>A practical next step</h2><p>'+safe(p.tryIt)+'</p>'+
 '<p class="ns-inv-support">If this does not fit, choose a different hypothesis or change the environmental conditions. No single strategy is right for everybody.</p>'+itemLink(p.tool)+'</section>'+
 '<section class="ns-inv-panel"><p class="eyebrow">YOUR WORKSHEET</p><h2>Investigate it for yourself</h2><p>Use the prompts to test your understanding. Your answers remain in this browser page and are not automatically stored.</p><div class="ns-inv-worksheet">'+worksheet+'</div>'+
 '<div class="ns-inv-actions"><button class="button" type="button" data-inv-download>Download my worksheet</button><button class="button secondary" type="button" data-inv-print>Print guide</button></div><p class="ns-inv-fine" role="status" data-inv-file-status></p></section>'+
 '<section class="ns-inv-panel"><p class="eyebrow">EVIDENCE-INFORMED READING</p><h2>Learn more from trusted resources</h2><div class="ns-inv-resource-list">'+itemLink(p.source)+itemLink(a.source)+itemLink(['NHS: Practical CBT self-help techniques',nhsCBT])+'</div>'+
 '<p class="ns-inv-fine">External resources are educational and may be more or less relevant depending on your circumstances.</p></section>'+
 '<section class="ns-inv-panel"><p class="eyebrow">REVISIT THE QUESTION</p><h2>What remains uncertain?</h2><p>'+safe(p.test)+'</p>'+
 '<div class="ns-inv-actions"><button class="button secondary" type="button" data-inv-revise>← Review my answers</button><a class="button secondary" href="#investigate">Explore another problem →</a></div></section></div>';
}
export function renderNSInvestigator(root,slug=''){
 const topic=findInvestigationTopic(slug);
 if(!topic){root.innerHTML=landingMarkup();return;}
 const answers={};let index=0;
 const paint=()=>{
  const qs=answersFor(topic,answers);
  if(index>=qs.length){
   const f=investigationFormulation(topic.id,answers);
   root.innerHTML=resultMarkup(f);
   root.querySelector('[data-inv-revise]').onclick=()=>{index=0;paint();};
   root.querySelector('[data-inv-print]').onclick=()=>window.print();
   root.querySelector('[data-inv-download]').onclick=()=>{
    const fields=[...root.querySelectorAll('[data-inv-note]')];
    const text=['Nobody’s Simple — private learning worksheet',topic.name,'','A possibility to explore: '+f.primary.title,
     'Alternative possibility: '+f.alternative.title,'Why it was suggested: '+f.why,'Outside conditions: '+f.environments,'',
     ...fields.flatMap((field,i)=>[f.primary.worksheet[i],field.value.trim(), ''])].join('\n');
    const blob=new Blob([text],{type:'text/plain;charset=utf-8'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download='nobodyssimple-'+topic.id+'-worksheet.txt';document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),500);
    const status=root.querySelector('[data-inv-file-status]');if(status)status.textContent='Your worksheet was prepared as a local text file.';
   };
   return;
  }
  const q=qs[index];root.innerHTML=stepMarkup(topic,q,index,qs.length,answers[q.id]);
  const form=root.querySelector('#ns-inv-form');
  form.querySelector('[data-inv-back]').onclick=()=>{index=Math.max(0,index-1);paint();};
  form.onsubmit=event=>{
   event.preventDefault();
   const chosen=form.querySelector('[name=inv-answer]:checked');
   if(!chosen){form.querySelector('[data-inv-error]').textContent='Select an answer to continue, or go back.';return;}
   if(q.id==='mechanism'&&answers.mechanism!==chosen.value)delete answers.detail;
   answers[q.id]=chosen.value;
   index++;paint();
   root.querySelector('h1')?.focus?.({preventScroll:true});
   window.scrollTo({top:0,behavior:'instant'});
  };
 };
 paint();
}
