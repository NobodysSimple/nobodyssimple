import {escapeHTML as esc} from './core.mjs';
import {getProblem,problemDomains,knowledgeFamilies,sourceForProblem,nhsHelp,nhsTalking,nhsSelfHelp,nhsPsychosis} from './ns-problem-map.mjs';
import {peekProblemHandoff} from './ns-universal-console.mjs';
import {tools} from './tool-catalog.mjs';

const safe=x=>esc(String(x??''));
const toolMap=new Map(tools.map(x=>[x.id,x]));
const clinicalCare=new Set(['self-harm','immediate-danger','control-harm','voices','suspicion','mania','eating','substances']);
const notes={
 anxiety:['Anxiety can signal perceived threat, uncertainty or pressure. Its intensity alone cannot tell you whether the danger is real.','Consider the situation, body state and what action would be appropriate before attempting to change a thought.'],
 'low-mood':['Low mood may arise alongside loss, isolation, prolonged stress or physical illness. Different combinations require different responses.','If low mood persists or interferes with functioning, professional assessment may be helpful.'],
 panic:['Sudden fear can involve intense bodily sensations. Similar sensations can also have physical causes, particularly when they are new or unusual.','Learn about the cycle between sensations, interpretation and fear, while not ignoring possible medical concerns.'],
 overthinking:['Repeated analysis may be useful initially but can become a loop if it no longer produces new information or action.','Distinguish unresolved practical problems from uncertainty that cannot be eliminated by thinking.'],
 checking:['Checking has a legitimate role in safety and decision-making. Repeated checking that only briefly relieves doubt may perpetuate uncertainty.','The question is whether a new check will provide new, usable information.'],
 intrusive:['Having an unwanted thought does not mean agreeing with it or wanting it to happen.','Distressing intrusive experiences differ, and simplistic interpretations of their content can be misleading.'],
 procrastination:['Procrastination is not one mechanism. Fear of failure, task ambiguity, reward structure, low energy and external demands can all contribute.','A small starting step may help when the problem is friction; a workload adjustment may help when the problem is impossible demands.'],
 perfectionism:['Standards can be constructive, but rigid rules about errors or worth can make starting and finishing feel threatening.','Notice whether a deliberately adequate attempt changes anxiety and follow-through.'],
 boundaries:['A boundary describes what you need and what you can do; it is not an instrument for controlling somebody else.','Context matters: a direct conversation may be helpful in a safe relationship but risky when there is coercion.'],
 arguments:['A repeated argument can involve interpretation, unresolved needs, patterns of escalation or real differences in values and behaviour.','Focus on what is observable and what each person is willing and able to change.'],
 loneliness:['Loneliness can describe a gap between the quality or amount of connection a person wants and what they currently experience.','An action to connect may help, but practical opportunity, discrimination and accessible community matter too.'],
 fatigue:['Fatigue is not simply low motivation. Sleep, health, sustained demands, medication and sensory load are among possible factors.','Persistent or unexplained fatigue merits appropriate health attention.'],
 eating:['Food-related distress may involve emotional, physical and social pressures. Restriction, purging or rapid weight change can be medically serious.','An online educational guide cannot determine whether an eating disorder is present.'],
 'who-am-i':['Identity can be layered, changing and sometimes contradictory without being inherently disordered.','Consider which parts of your experience reflect personal values and which reflect external expectations.'],
 masking:['Adapting presentation to different environments can be protective, exhausting or both.','The goal is not simply to stop masking; safety, social context and practical consequences matter.'],
 grief:['Grief is not a linear set of prescribed stages, and experiences can vary across individuals, relationships and cultures.','Support, time, practical needs and personal meaning may be more relevant than trying to feel differently immediately.'],
 'work-stress':['Work stress depends on demands, control, support and working conditions, not just personal coping skills.','Practical and organisational changes may be more effective than repeated self-calming exercises.'],
 money:['Financial stress is influenced by real constraints. Cognitive reframing cannot replace money, housing or institutional support.','Identify which practical resources, entitlements or support organisations could change the circumstances.'],
 'control-harm':['When somebody uses coercion or intimidation, it is important not to place responsibility for their behaviour on the person being harmed.','Do not treat a boundary-setting exercise as a test if direct confrontation could increase risk.'],
 trauma:['Trauma-related reactions may include memories, avoidance, arousal or disconnection, but experiences differ and brief online questions are not diagnostic.','Stabilisation and safe support may be preferable to self-directed exposure to distressing memories.'],
 voices:['Hearing voices or having unusual perceptions can have more than one cause, including sleep, substances and health conditions.','New or worsening experiences warrant prompt professional assessment rather than an online self-diagnosis.'],
 mania:['Marked changes in energy, sleep, mood or activity can have clinical and physical explanations.','If you are experiencing unusually elevated energy with very little sleep, seek prompt professional advice.'],
 'self-harm':['Thoughts or urges to harm yourself deserve immediate compassionate support.','If you cannot keep yourself safe, contact emergency services rather than completing the investigation.'],
 'immediate-danger':['Immediate safety takes priority over psychological explanation.','Get to a safer place when possible and contact emergency support.']
};
const practical={
 feel:'Notice what happened before the feeling. Name one emotion, one need and one realistic response that does not demand instant relief.',
 think:'Separate the situation into known facts, interpretations, uncertainties and one practical action. Check if more thinking actually produces new evidence.',
 act:'Identify the point where action stops. Make the first physical step clear, reduce a real obstacle, and compare what happens.',
 relate:'Describe the observed behaviour, its impact and the need or boundary involved. Choose communication only when the situation is sufficiently safe.',
 body:'Check sleep, pain, illness, medication, food, sensory input and workload. A physical or environmental change may be more relevant than a cognitive technique.',
 identity:'Note one personally chosen value, one inherited expectation and one choice that supports your autonomy without ignoring the context.',
 focus:'Compare situations where concentration is easier or harder. Add one external cue or environmental support rather than relying only on effort.',
 change:'Identify what changed, which supports remain and which practical needs arise now. There is no universal timetable for adaptation.',
 work:'List the demands, resources and people or organisations that influence them. Decide which issue can be adjusted, negotiated or supported.',
 experiences:'Avoid self-diagnosing unusual or severe experiences. Prioritise safety, medical considerations and timely human assessment.',
 safety:'Choose a safe, immediate next step and contact human support. Do not attempt a behaviour experiment when safety is uncertain.'
};
const resourcesByDomain={
 work:[['Citizens Advice: Practical support','https://www.citizensadvice.org.uk/'],['Acas: Workplace guidance','https://www.acas.org.uk/']],
 feel:[['NHS: Mental health self-help',nhsSelfHelp]],
 think:[['NHS: Mental health self-help',nhsSelfHelp]],
 act:[['NHS: Mental health self-help',nhsSelfHelp]],
 relate:[['NHS: Mental health self-help',nhsSelfHelp]],
 identity:[['NHS: Mental health self-help',nhsSelfHelp]],
 focus:[['NHS: Mental health self-help',nhsSelfHelp]],
 change:[['NHS: Mental health self-help',nhsSelfHelp]],
 body:[['NHS: Mental health self-help',nhsSelfHelp]],
 experiences:[['NHS: Help for mental health',nhsHelp]],
 safety:[['NHS: Urgent mental health help',nhsHelp]]
};
const link=(label,url)=>'<a href="'+safe(url)+'" '+(url.startsWith('https:')?'target="_blank" rel="noopener noreferrer"':'')+' class="ns-guide-link"><span>'+safe(label)+'</span><span aria-hidden="true">↗</span></a>';
const severityNote=p=>{
 if(['self-harm','immediate-danger'].includes(p.id))return '<section class="ns-guide-safety" role="alert"><h2>Immediate support comes first</h2><p>If you cannot keep yourself safe in the UK, call 999 or go to A&E. For urgent mental health support call NHS 111 and select the mental health option. Do not delay help for an online guide.</p>'+link('NHS: Get urgent help',nhsHelp)+'</section>';
 if(['voices','suspicion','mania'].includes(p.id))return '<section class="ns-guide-safety"><h2>Prompt assessment matters</h2><p>New or worsening experiences like these should be discussed promptly with a GP or mental health service. This page cannot assess their cause.</p>'+link('NHS: Psychosis and assessment',nhsPsychosis)+'</section>';
 if(p.id==='control-harm')return '<section class="ns-guide-safety"><h2>Safety before communication</h2><p>If somebody is coercing, threatening or frightening you, direct confrontation may not be safe. Seek practical support and prioritise your safety.</p>'+link('NHS: Get urgent help',nhsHelp)+'</section>';
 if(p.id==='eating')return '<section class="ns-guide-safety"><h2>Health deserves attention</h2><p>Eating-related problems can affect physical health. Seek appropriate assessment rather than relying on an online worksheet.</p>'+link('NHS: Mental health self-help',nhsSelfHelp)+'</section>';
 if(p.medical)return '<section class="ns-guide-health"><strong>Consider health factors too.</strong> Persistent, new or concerning physical symptoms deserve appropriate medical attention; do not assume a purely psychological cause.</section>';
 return '';
};
function customWorksheet(p,answer,domain){
 const mechanism=knowledgeFamilies[domain]?.explanations[Number(answer?.barrier)]||null;
 const contextMap={demands:'workload, time and environmental demands',health:'health, sleep, energy and sensory factors',people:'relationships, safety and other people',thoughts:'thoughts, emotions and habits',unknown:'several overlapping circumstances'};
 return '<div class="ns-guide-personal"><h3>Your working direction</h3>'+
 (mechanism?'<p><strong>You wanted to explore:</strong> '+safe(mechanism)+'.</p>':
 '<p><strong>There is not yet enough information to favour one explanation.</strong> This guide considers several possibilities.</p>')+
 (answer?.context?'<p><strong>A condition you highlighted:</strong> '+safe(contextMap[answer.context]||'something worth considering')+'.</p>':'')+
 '<p>These selections prioritise educational material; they are not diagnostic evidence or certainty ratings.</p></div>';
}
function resourceCards(p){
 const t=[...new Set(p.tools)].map(id=>toolMap.get(id)).filter(Boolean).slice(0,3);
 return t.map(t=>link(t.title||t.name||t.id,'#tool/'+t.id)).join('');
}
function landingGuide(p){
 const domain=problemDomains.find(d=>d.id===p.domain);
 const knowledge=knowledgeFamilies[p.domain];
 const handoff=peekProblemHandoff(p.id);
 const from=handoff?.answers||{};
 const special=notes[p.id]||[p.hint+'. There may be several different explanations, and one label cannot establish a cause.',
  'Look at when it happens, what helps, what makes it harder and what is happening around you.'];
 const directLearnId={procrastination:'procrastination',overthinking:'overthinking',overwhelm:'feelings',arguments:'relationships',boundaries:'relationships'}[p.id];
 const safePractice=!clinicalCare.has(p.id)&&p.domain!=='safety'&&p.domain!=='experiences';
 const source=sourceForProblem(p);
 const related=problemDomains.filter(d=>d.id===p.domain).length;
 const options=knowledge.explanations.map((x,i)=>'<label class="ns-guide-choice"><input type="radio" name="guide-mechanism" value="'+i+'" '+(from.barrier===String(i)?'checked':'')+'><span>'+safe(x)+'</span></label>').join('');
 return '<div class="ns-guide-shell"><a class="ns-guide-back" href="#navigate">← Back to Emotional Calculator</a>'+
 '<header class="ns-guide-hero"><p class="eyebrow">YOUR PSYCHOLOGICAL FIELD GUIDE · '+safe(domain?.name||'')+'</p>'+
 '<h1>'+safe(p.title)+'</h1><p>'+safe(p.hint)+'. A clear walkthrough of what might be involved and which responses could help.</p>'+
 '<div class="ns-guide-meta"><span>~3 min to read</span><span>Optional questions and worksheet</span></div></header>'+
 severityNote(p)+
 '<nav class="ns-guide-jumplinks" aria-label="Guide sections"><a href="#guide-understand">Understand</a><a href="#guide-possibilities">Possibilities</a><a href="#guide-actions">What might help</a><a href="#guide-worksheet">Worksheet</a></nav>'+
 '<section class="ns-guide-card" id="guide-understand"><p class="eyebrow">1 · UNDERSTAND THE EXPERIENCE</p><h2>What could be going on?</h2>'+
 '<p>'+safe(special[0])+'</p><p>'+safe(knowledge.what)+'</p><p>'+safe(special[1])+'</p>'+
 '<p class="ns-guide-caption">Problems often overlap. These are educational possibilities, not a personal diagnosis.</p></section>'+
 '<section class="ns-guide-card" id="guide-possibilities"><p class="eyebrow">2 · INVESTIGATE THE POSSIBILITIES</p><h2>Why might it happen?</h2>'+
 '<p>Rather than attributing this to one personality trait or diagnosis, compare these routes:</p>'+
 '<ol class="ns-guide-explain-list">'+knowledge.explanations.map((x,i)=>'<li><span>'+(i+1)+'</span>'+safe(x)+'</li>').join('')+'</ol>'+
 '<div data-guide-personal>'+customWorksheet(p,from,p.domain)+'</div>'+
 '<div class="ns-guide-two-questions"><h3>Make this more relevant to your situation</h3><p>Which explanation would you like to explore first? There is no need to know the answer.</p>'+
 '<fieldset><legend class="sr-only">Possible explanations</legend>'+options+
 '<label class="ns-guide-choice"><input type="radio" name="guide-mechanism" value="unknown"><span>More than one / I am not sure</span></label></fieldset>'+
 '<button type="button" class="button secondary" data-guide-refine>Update my learning focus</button></div>'+
 '<div class="ns-guide-system"><h3>Look beyond the individual</h3><p>'+safe(knowledge.alternative)+'</p>'+
 '<p>Opportunity, health, social conditions, resources and power can be as important as thoughts or motivation. Not every problem is something a person can solve by coping better.</p></div></section>'+
 '<section class="ns-guide-card" id="guide-actions"><p class="eyebrow">3 · WHAT MIGHT HELP?</p><h2>Use an appropriate next step</h2>'+
 '<p>'+safe(knowledge.check)+'</p>'+
 (safePractice?'<p>'+safe(practical[p.domain])+'</p><h3>Exercises related to this problem</h3><div class="ns-guide-resources">'+resourceCards(p)+'</div>':
 '<p>'+safe(practical[p.domain])+'</p><p>For this topic, appropriate human support and safety are more important than generic self-help challenges.</p>')+
 (directLearnId?'<details class="ns-guide-deeper"><summary>Want a longer, branching investigation?</summary><p>Explore a deeper learning activity with follow-up questions and a possible maintaining cycle.</p>'+link('Open the extended investigation','#investigate/'+directLearnId)+'</details>':'')+
 '</section>'+
 '<section class="ns-guide-card" id="guide-worksheet"><p class="eyebrow">4 · A SMALL WORKSHEET</p><h2>Make a map of the situation</h2>'+
 '<p>Only write what is safe and useful. Notes are not automatically stored or uploaded by this page.</p>'+
 '<div class="ns-guide-work"><label>What happened? What can I actually observe?<textarea name="observation" maxlength="2000" rows="3" placeholder="The situation, in my own words"></textarea></label>'+
 '<label>What might be contributing, including circumstances or other people?<textarea name="factors" maxlength="2000" rows="3" placeholder="A few possible influences"></textarea></label>'+
 '<label>What is one reasonable next step, adjustment or support request?<textarea name="action" maxlength="2000" rows="3" placeholder="Something practical, or a person who can help"></textarea></label></div>'+
 '<div class="ns-guide-actions"><button type="button" class="button" data-guide-download>Download worksheet</button><button type="button" class="button secondary" data-guide-print>Print this guide</button></div>'+
 '<p class="ns-guide-status" role="status" data-guide-status></p></section>'+
 '<section class="ns-guide-card"><p class="eyebrow">5 · KEEP LEARNING</p><h2>Resources worth exploring</h2><div class="ns-guide-resources">'+
 link(source.label,source.url)+ (resourcesByDomain[p.domain]||[]).map(([label,url])=>link(label,url)).join('')+
 link('NHS: Find Talking Therapies where appropriate',nhsTalking)+'</div>'+
 '<p class="ns-guide-caption">External links are curated starting points; their usefulness depends on the situation. This guide is not a diagnostic assessment.</p></section>'+
 '<div class="ns-guide-bottom"><a href="#navigate" class="button secondary">← Explore another problem</a><a href="#support" class="button secondary">Find human support →</a></div></div>';
}
export function renderNSProblemGuide(root,id){
 const p=getProblem(id);
 if(!p){location.hash='#navigate';return;}
 root.innerHTML=landingGuide(p);
 root.querySelector('[data-guide-refine]')?.addEventListener('click',()=>{
  const choice=root.querySelector('input[name="guide-mechanism"]:checked');
  const handoff=peekProblemHandoff(p.id);
  const updated={...(handoff?.answers||{}),barrier:choice?.value};
  root.querySelector('[data-guide-personal]').innerHTML=customWorksheet(p,updated,p.domain);
  root.querySelector('[data-guide-personal]').scrollIntoView({behavior:'smooth',block:'nearest'});
 });
 root.querySelector('[data-guide-print]')?.addEventListener('click',()=>window.print());
 root.querySelector('[data-guide-download]')?.addEventListener('click',()=>{
  const values=[...root.querySelectorAll('.ns-guide-work textarea')].map(x=>x.value.trim());
  const data=['Nobody’s Simple · My learning worksheet',p.title,'','What happened? (observations)',values[0]||'','Possible influences and contexts',values[1]||'','Next action, adjustment or support',values[2]||'',
  'Educational context:',knowledgeFamilies[p.domain].what,''].join('\n');
  const url=URL.createObjectURL(new Blob([data],{type:'text/plain;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='nobodyssimple-'+p.id+'-worksheet.txt';document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  root.querySelector('[data-guide-status]').textContent='Your worksheet has been prepared for download.';
 });
}
