/* Read, practise, review: one continuous scrollable workbook.
 * No compulsory mood ratings, diagnostic scoring, telemetry or automatic saving.
 * The five/six embedded micro-tools are distinct functional worksheets.
 */
import {escapeHTML as escape} from './core.mjs';
import {NEEDS_MODES} from './ns-needs-catalog.mjs';
import {atlasProblemIndex,atlasSearch} from './ns-atlas-core.mjs';
import {workbookForChoice,workbookForTopic} from './ns-integrated-workbook-data.mjs';
import {PATH_SOURCES} from './ns-pathway-content.mjs';
import {STEADY_REFERENCES} from './ns-steady-guide-utils.mjs';
import {renderTool} from './features.mjs';

const e=value=>escape(String(value??''));
const summaryValue=value=>String(value??'').trim().slice(0,2000);
const safeId=value=>String(value).replace(/[^a-z0-9-]/gi,'-');
const refLink=source=>'<li><a href="'+e(source.url)+'" target="_blank" rel="noopener noreferrer">'+e(source.name)+' ↗</a><small>'+e(source.scope||'Background guidance, not validation of this worksheet.')+'</small></li>';
const input=(chapter,key,label,placeholder,rows=3)=>'<label class="ns-wb-field"><span>'+e(label)+'</span><textarea rows="'+rows+'" maxlength="2000" data-wb-field="'+e(chapter+'.'+key)+'" placeholder="'+e(placeholder)+'"></textarea></label>';
const select=(chapter,key,label,options)=>'<label class="ns-wb-field"><span>'+e(label)+'</span><select data-wb-field="'+e(chapter+'.'+key)+'">'+
 options.map(([value,text])=>'<option value="'+e(value)+'">'+e(text)+'</option>').join('')+'</select></label>';
const checklist=(chapter,key,label,items)=>'<fieldset class="ns-wb-fieldset" data-wb-set="'+e(chapter+'.'+key)+'"><legend>'+e(label)+'</legend>'+
 items.map((x,i)=>'<label><input type="checkbox" value="'+e(x)+'" data-wb-check="'+e(chapter+'.'+key)+'"><span>'+e(x)+'</span></label>').join('')+'</fieldset>';
const editNote=chapter=>'<output class="ns-wb-feedback" aria-live="polite" data-wb-feedback="'+e(chapter)+'">Your notes are optional. Nothing is scored or sent.</output>';
function widgetMarkup(lane,g){
 const id=lane.id;
 const first=lane.methods[0];
 const question='<strong class="ns-wb-tool-title">Try it with your current situation</strong>'+
  '<p class="ns-wb-tool-intro">Read the suggestions above, then adapt what fits. These fields are private to this open page until you explicitly download them.</p>';
 let fields='';
 if(id==='context')fields=
  input(id,'condition','What in your environment, circumstances or demands is affecting this?','A demand, sensory factor, access barrier, pressure, or something else…')+
  select(id,'kind','What kind of change is realistic?',[
   ['','I am not sure yet'],['reduce','Reduce or remove a demand'],['adjust','Adjust the environment or method'],
   ['share','Share or request support'],['delay','Delay or renegotiate'],['none','Nothing is safely changeable right now']])+
  input(id,'change','What adjustment, resource or support might help?','Use the advice just above as ideas, not as a required answer…')+
  '<button type="button" class="ns-wb-small-button" data-wb-action="context">Build my adjustment →</button>';
 else if(id==='practice')fields=
  input(id,'action','What safe and realistic step might you try?','A small response or experiment, if it is appropriate…')+
  input(id,'prediction','What might happen? What would you learn?','A prediction rather than a guaranteed outcome…')+
  input(id,'limit','What might get in the way, or tell you to stop?','Health, safety, energy, demands or another practical limit…')+
  select(id,'outcome','If you have tried it, what happened?',[
   ['untried','Not tried / not appropriate yet'],['helped','It seemed useful'],['unchanged','No noticeable change'],['barrier','A barrier prevented it'],['worse','It felt worse or unsuitable']])+
  '<button type="button" class="ns-wb-small-button" data-wb-action="practice">Reflect on the result →</button>';
 else if(id==='thinking')fields=
  input(id,'observed','What do you know happened?','Words, actions, sensations or other observations…')+
  input(id,'interpretation','What interpretation or prediction did you add?','This is a thought to consider, not automatically a fact…')+
  input(id,'alternative','What else might fit, or what evidence would help?','Include real risks and uncertainty where relevant…')+
  '<button type="button" class="ns-wb-small-button" data-wb-action="thinking">Lay out the distinctions →</button>';
 else if(id==='dbt')fields=
  checklist(id,'options','Which brief responses feel safe or useful?',[
   'Pause a non-urgent action','Reduce sensory input or demands','Orient to a neutral detail around me',
   'Choose a familiar comforting sensation','Contact a person or service I trust','None of these fits right now'])+
  input(id,'plan','What would a safe pause look like for you?','You can choose not to do any of these…')+
  '<button type="button" class="ns-wb-small-button" data-wb-action="dbt">Keep a short coping cue →</button>';
 else if(id==='acceptance')fields=
  input(id,'experience','What feeling, uncertainty or difficulty might you make room for—if tolerable?','It is equally valid to stop or address an unsafe condition…')+
  select(id,'value','What matters in how you respond?',[
   ['','Not clear right now'],['Care','Care'],['Safety','Safety'],['Rest','Rest and recovery'],
   ['Honesty','Honesty'],['Autonomy','Autonomy'],['Connection','Connection'],
   ['Fairness','Fairness'],['Learning','Learning'],['Other','Something else']])+
  input(id,'direction','What manageable action, boundary or rest would reflect that?','A direction, not a demand to feel better…')+
  '<button type="button" class="ns-wb-small-button" data-wb-action="acceptance">Describe a values-led step →</button>';
 else if(id==='support')fields=
  select(id,'kind','Which kind of support may fit?',[
   ['','Not sure / none at present'],['Practical help','Practical help or adjustment'],
   ['Trusted person','A trusted person'],['Healthcare','Healthcare or a professional'],
   ['Safety support','Safety or safeguarding support'],['Rest','Recovery or time away from demands']])+
  input(id,'need','What do you want the person or service to understand?','A short need, situation or request, if sharing is safe…')+
  input(id,'first','What would make getting that support possible?','A practical first step, access need or safer contact method…')+
  '<button type="button" class="ns-wb-small-button" data-wb-action="support">Shape a request →</button>';
 const original=lane.tool&&!g.safetyFirst?
   '<details class="ns-wb-original" data-wb-original="'+e(id)+'"><summary>Open an additional full interactive tool in this chapter</summary>'+
   '<p>The original tool offers a deeper exercise. Its own account and saving settings may differ from the private worksheets on this page.</p>'+
   '<button type="button" data-wb-mount="'+e(lane.tool)+'" data-wb-mount-lane="'+e(id)+'">Load the '+e(lane.tool.replace(/-/g,' '))+' tool here</button>'+
   '<div data-wb-tool-host="'+e(id)+'"></div></details>':'';
 return '<div class="ns-wb-tool" data-wb-widget="'+e(id)+'"><div class="ns-wb-tool-head"><span aria-hidden="true">✎</span><div>'+question+'</div></div>'+
  '<div class="ns-wb-fields">'+fields+editNote(id)+'</div>'+original+'</div>';
}
function methodMarkup(method,index){
 const evidence=(method.refs||[]).slice(0,3).map(key=>STEADY_REFERENCES[key]||PATH_SOURCES[key]).filter(Boolean);
 const links=evidence.length?'<p class="ns-wb-evidence-links"><strong>Supporting guidance:</strong> '+
  evidence.map(r=>'<a href="'+e(r.url)+'" target="_blank" rel="noopener noreferrer">'+e(r.name)+'</a>').join(' · ')+'</p>':'';
 return '<article class="ns-wb-method"><div class="ns-wb-method-number">'+String(index+1).padStart(2,'0')+'</div>'+
  '<div><h4>'+e(method.title)+'</h4><p class="ns-wb-why">'+e(method.why)+'</p>'+
  '<ol>'+method.steps.map(step=>'<li>'+e(step)+'</li>').join('')+'</ol>'+
  (method.caution?'<p class="ns-wb-method-caution"><strong>When to adapt or avoid:</strong> '+e(method.caution)+'</p>':'')+
  '<p class="ns-wb-evidence-note">'+e(method.note||'This is an adapted educational technique, not an individually tested treatment.')+'</p>'+
  links+'</div></article>';
}
function laneMarkup(lane,index,g){
 return '<section class="ns-wb-chapter" id="ns-wb-'+e(lane.id)+'" data-wb-chapter="'+e(lane.id)+'">'+
  '<div class="ns-wb-chapter-heading"><span class="ns-wb-step">'+String(index+2).padStart(2,'0')+'</span>'+
  '<div><p class="ns-wb-kicker">APPROACH '+String(index+1)+' OF '+g.lanes.length+'</p><h2>'+e(lane.title)+'</h2>'+
  '<p>'+e(lane.description)+'</p></div></div>'+
  '<div class="ns-wb-methods">'+lane.methods.map(methodMarkup).join('')+'</div>'+
  widgetMarkup(lane,g)+'</section>';
}
function recognitionMarkup(g){
 const examples=g.recognise?.length?'<div class="ns-wb-recognition-list"><h3>What this can look like</h3><ul>'+
  g.recognise.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul></div>':'';
 const contributors=g.contributors?.length?'<div class="ns-wb-recognition-list"><h3>Possible contributors to consider</h3><ul>'+
  g.contributors.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul></div>':'';
 const mechanismMap=g.mechanisms?.length?'<div class="ns-wb-mechanisms"><h3>Different possible maintaining processes</h3>'+
  '<p>These mechanisms can explain some situations, but none is established by recognising a description. Notice what seems possible, and keep alternatives open.</p>'+
  g.mechanisms.map(m=>'<article><h4>'+e(m.label)+'</h4><p>'+e(m.detail)+'</p>'+
   (m.target?'<p><strong>Possible change target:</strong> '+e(m.target)+'</p>':'')+'</article>').join('')+'</div>':'';
 const progress='<div class="ns-wb-progress-meaning">'+(g.goals?.length?'<h3>What could help?</h3><ul>'+
  g.goals.map(goal=>'<li>'+e(goal)+'</li>').join('')+'</ul>':'')+
  '<h3>What progress might look like</h3><p>'+e(g.progress)+'</p></div>';
 const preface=g.safetyFirst?'':'<div class="ns-wb-tool ns-wb-recognition-tool" data-wb-widget="recognition">'+
  '<div class="ns-wb-tool-head"><span aria-hidden="true">✎</span><div><strong class="ns-wb-tool-title">Map this to one situation</strong>'+
  '<p class="ns-wb-tool-intro">Optional: give the rest of the workbook a concrete reference point. You can leave everything blank.</p></div></div>'+
  '<div class="ns-wb-fields">'+
  input('recognition','situation','Where or when does this happen for you?','A recent example or simply a few words…')+
  checklist('recognition','factors','What might be relevant? (These are possibilities, not causes.)',[
   'Environment or practical demands','Health, sleep, pain or energy','Relationships, power or safety',
   'Interpretations or expectations','Past experience or learning','Not sure / several factors'])+
  editNote('recognition')+'</div></div>';
 return '<section class="ns-wb-chapter ns-wb-recognition" id="ns-wb-recognition" data-wb-chapter="recognition">'+
  '<div class="ns-wb-chapter-heading"><span class="ns-wb-step">01</span><div><p class="ns-wb-kicker">UNDERSTAND FIRST</p>'+
  '<h2>What is this experience?</h2></div></div><p class="ns-wb-large-text">'+e(g.what)+'</p>'+
  examples+'<h3>One possible pattern, not a verdict</h3>'+
  '<p class="ns-wb-cycle">'+e(g.cycle||'Different patterns may fit, and there is not enough information to choose one.')+'</p>'+
  contributors+mechanismMap+progress+
  '<p class="ns-wb-epistemic">These are possibilities to investigate. A name or questionnaire cannot establish what is causing an individual experience.</p>'+
  preface+'</section>';
}
function safetyNotice(g){
 const warn=g.cautions?.length?'<ul>'+g.cautions.map(x=>'<li>'+e(x)+'</li>').join('')+'</ul>':'';
 return '<aside class="ns-wb-safety" role="note"><h2>Before trying a method</h2>'+warn+
  (g.medical?'<p>New or concerning physical symptoms deserve appropriate medical assessment; do not assume the cause is psychological.</p>':'')+
  '<a href="#need/support-safety">Safety and urgent support →</a></aside>';
}
function atlasChooser(){
 return '<section class="ns-wb-chapter ns-wb-atlas" id="ns-wb-topics"><div class="ns-wb-chapter-heading"><span class="ns-wb-step">⌕</span>'+
  '<div><p class="ns-wb-kicker">EXPLORE THE PSYCHOLOGICAL ATLAS</p><h2>Find a specific difficulty</h2>'+
  '<p>Each topic now opens its own integrated educational guide and worksheets, not a separate tool page.</p></div></div>'+
  '<label class="ns-wb-field" for="ns-wb-search"><span>Search 166 named experiences</span><input type="search" id="ns-wb-search" data-wb-search autocomplete="off" placeholder="e.g. rumination, panic, sleep, relationships…"></label>'+
  '<div class="ns-wb-atlas-meta"><output data-wb-count aria-live="polite"></output><button type="button" data-wb-all>Browse all topics</button></div>'+
  '<div class="ns-wb-atlas-grid" data-wb-topic-results></div></section>';
}
function safetyOnly(g){
 return '<section class="ns-wb-chapter ns-wb-care-first" id="ns-wb-care"><h2>Safety and support take priority</h2>'+
  '<p class="ns-wb-large-text">'+e(g.what)+'</p>'+
  '<p>'+e(g.cycle)+'</p>'+safetyNotice(g)+
  '<p>No private account of danger or identifying details is required. Avoid creating notes on a device someone else might monitor.</p>'+
  '<div class="ns-wb-care-links"><a href="https://www.nhs.uk/nhs-services/mental-health-services/where-to-get-urgent-help-for-mental-health/" target="_blank" rel="noopener noreferrer">NHS urgent mental health help ↗</a>'+
  '<a href="https://www.nhs.uk/live-well/getting-help-for-domestic-violence/" target="_blank" rel="noopener noreferrer">Domestic abuse support ↗</a>'+
  '<a href="#need/support-safety">Open all practical safety resources →</a></div>'+
  '<div class="ns-wb-tool ns-wb-care-tool" data-wb-widget="safety"><strong>Choose what would be useful now</strong><p>This does not ask for details or save anything.</p>'+
  '<div class="ns-wb-care-actions"><button type="button" data-wb-care="urgent">Immediate danger</button>'+
  '<button type="button" data-wb-care="health">Urgent health concern</button>'+
  '<button type="button" data-wb-care="private">I need confidential support</button>'+
  '<button type="button" data-wb-care="unsure">I am unsure what help fits</button></div>'+
  '<p data-wb-care-result role="status">If you or someone else is in immediate danger in the UK, call 999.</p></div></section>';
}
function sourcesMarkup(g){
 const links=g.sources?.length?g.sources.map(refLink).join(''):'<li>Review the relevant NHS and NICE guidance for this topic; no claim is made that this exercise is clinically validated.</li>';
 return '<section class="ns-wb-chapter ns-wb-sources" id="ns-wb-sources"><h2>Evidence, limits and where to go next</h2>'+
  '<p>'+e(g.review)+'</p>'+
  '<p>The references inform broad psychological principles, clinical advice or caution. They do not show that these new micro-tools, this combination of chapters, or a particular user response is an effective treatment.</p>'+
  '<ul>'+links+'</ul>'+
  '<p class="ns-wb-epistemic">ACT-, CBT- or DBT-informed describes the origin of an idea, not a complete protocol. Some approaches need individual assessment and specialist delivery. Stop or change course if a method is unhelpful or unsafe.</p></section>';
}
function summaryMarkup(){
 return '<section class="ns-wb-chapter ns-wb-summary" id="ns-wb-review"><div class="ns-wb-chapter-heading"><span class="ns-wb-step">✓</span>'+
  '<div><h2>My working notes</h2><p>No scores, no compulsory reflection, no need to feel better at the end.</p></div></div>'+
  '<div class="ns-wb-summary-actions"><button type="button" data-wb-summary>Review my responses</button>'+
  '<button type="button" data-wb-download>Download my notes</button>'+
  '<button type="button" class="ns-wb-secondary" data-wb-clear>Clear my notes</button></div>'+
  '<div class="ns-wb-summary-output" data-wb-summary-output role="status">Your responses stay in this open page. Downloading is optional; closing or refreshing this page discards the inline worksheets.</div>'+
  '<p class="ns-wb-epistemic">Downloaded notes stay wherever your device saves them. Avoid downloading sensitive reflections on shared or monitored devices.</p></section>';
}
function worksheetMarkup(g){
 const sections=[...(g.showAtlas?['topics']:[]),'recognition',...g.lanes.map(l=>l.id),'review','sources'];
 return '<div class="ns-wb-wrap" data-workbook="'+e(g.id)+'">'+
  '<nav class="ns-wb-breadcrumb" aria-label="Workbook navigation"><a href="#navigate/'+e(g.modeId)+'">← '+e(g.modeTitle)+'</a>'+
  '<a href="#navigate">All starting points</a><a href="#need/support-safety">Urgent support</a></nav>'+
  '<header class="ns-wb-cover ns-tone-'+e(g.tone||'lilac')+'">'+
  '<p class="ns-wb-kicker">NOBODY’S SIMPLE · THE INTERACTIVE FIELD GUIDE</p><h1>'+e(g.title)+'</h1>'+
  '<p>'+e(g.lead)+'</p><div class="ns-wb-cover-meta"><span>Read the advice. Try a worksheet below it.</span>'+
  '<span>'+g.lanes.length+' practical chapters · all optional</span></div></header>'+
  '<nav class="ns-wb-toc" aria-label="Jump to a chapter"><strong>Go to a chapter</strong><div>'+
  sections.map(id=>'<button type="button" data-wb-jump="'+e(id)+'">'+e(id==='recognition'?'Understand':id==='topics'?'Find a difficulty':id==='review'?'My notes':id==='sources'?'Sources':g.lanes.find(x=>x.id===id)?.title||id)+'</button>').join('')+
  '</div></nav>'+
  safetyNotice(g)+
  (g.showAtlas?atlasChooser():'')+
  recognitionMarkup(g)+
  g.lanes.map((lane,i)=>laneMarkup(lane,i,g)).join('')+
  summaryMarkup()+sourcesMarkup(g)+
  '<footer class="ns-wb-footer"><a href="#navigate/'+e(g.modeId)+'">← Change my choice</a><a href="#navigate">Choose another starting point →</a></footer></div>';
}
function safeMarkup(g){
 return '<div class="ns-wb-wrap ns-wb-safety-wrap" data-workbook="'+e(g.id)+'"><nav class="ns-wb-breadcrumb" aria-label="Workbook navigation">'+
  '<a href="#navigate/'+e(g.modeId)+'">← '+e(g.modeTitle)+'</a><a href="#navigate">All starting points</a></nav>'+
  '<header class="ns-wb-cover ns-tone-'+e(g.tone||'peach')+'"><p class="ns-wb-kicker">NOBODY’S SIMPLE · SUPPORT FIRST</p>'+
  '<h1>'+e(g.title)+'</h1><p>'+e(g.lead)+'</p></header>'+
  safetyOnly(g)+sourcesMarkup(g)+'</div>';
}
function getNotes(surface){
 const values={};
 surface.querySelectorAll('[data-wb-field]').forEach(el=>{const val=summaryValue(el.value);if(val)values[el.dataset.wbField]=val;});
 surface.querySelectorAll('[data-wb-check]:checked').forEach(el=>{
  const key=el.dataset.wbCheck;
  if(!values[key])values[key]=[];
  values[key].push(el.value);
 });
 return values;
}
const chapterNames={recognition:'My situation',context:'Conditions and resources',practice:'A chosen response',
 thinking:'Observations and explanations',dbt:'Managing the moment',acceptance:'Acceptance and values',support:'Support and care'};
function notesText(g,notes){
 const rows=['Nobody’s Simple · My working field guide',g.title,g.modeTitle,''];
 for(const chapter of Object.keys(chapterNames)){
  const lines=Object.entries(notes).filter(([key])=>key.startsWith(chapter+'.'));
  if(!lines.length)continue;
  rows.push(chapterNames[chapter]);
  for(const [key,value] of lines)rows.push(key.split('.')[1].replace(/-/g,' ')+': '+(Array.isArray(value)?value.join(', '):value));
  rows.push('');
 }
 return rows.concat(['These are provisional personal notes, not a diagnosis or evidence of an individual cause.',
  'The educational guides and micro-tools are not independently validated interventions.']).join('\n');
}
function feedback(surface,chapter,html){
 const target=surface.querySelector('[data-wb-feedback="'+chapter+'"]');
 if(target)target.textContent=html;
}
function updateFeedback(surface,chapter){
 const n=getNotes(surface);
 const val=key=>n[chapter+'.'+key]||'';
 if(chapter==='context'){
  const text=val('condition')||'the condition you identify',action=val('change')||'a possible adjustment';
  const kind=val('kind')||'not yet selected';
  feedback(surface,chapter,'Working idea: '+text+'. Possible response: '+kind+' — '+action+'. A real constraint may need external help.');
 }else if(chapter==='practice'){
  const status=val('outcome')||'untried';
  const msg={helped:'It seemed useful here, but this does not prove a proposed cause.',
   unchanged:'No clear change is useful feedback; consider the fit and the conditions.',
   barrier:'The barrier matters. More willpower may not be the right intervention.',
   worse:'Stop or adapt the approach. Worsening is not a failure to try hard enough.',
   untried:'A prediction is not an observed outcome; you can leave this untried.'};
  feedback(surface,chapter,msg[status]||msg.untried);
 }else if(chapter==='thinking'){
  feedback(surface,chapter,'You have separated '+(val('observed')?'an observation':'the observation to identify')+
   ' from '+(val('interpretation')?'a possible interpretation':'an interpretation to investigate')+
   '. An alternative is not automatically true; check what evidence would distinguish them.');
 }else if(chapter==='dbt'){
  const choices=val('options');feedback(surface,chapter,choices?.length?
   'Possible coping cue: '+choices.join('; ')+'. Adapt or stop if unsuitable.':
   'You can choose no technique; reducing demands or seeking support may fit better.');
 }else if(chapter==='acceptance'){
  feedback(surface,chapter,'Your chosen direction: '+(val('value')||'not yet named')+
   '. Acceptance never requires tolerating harm or ignoring physical needs.');
 }else if(chapter==='support'){
  feedback(surface,chapter,'Possible request: '+(val('need')||'describe a specific need if safe')+
   '. Appropriate support: '+(val('kind')||'still to decide')+'. You decide whether to share anything.');
 }
}
function setupAtlas(surface){
 const input=surface.querySelector('[data-wb-search]'),list=surface.querySelector('[data-wb-topic-results]');
 if(!input||!list)return;
 const ordered=[...atlasProblemIndex].sort((a,b)=>a.title.localeCompare(b.title));
 let all=false;
 const paint=()=>{
  const text=input.value.trim(),matches=text?
    atlasSearch(text,166):all?ordered:ordered.slice(0,12);
  list.innerHTML=matches.length?matches.map(p=>'<a href="#workbook-topic/'+encodeURIComponent(p.id)+'">'+
   '<strong>'+e(p.title)+'</strong><small>'+e(p.hint)+'</small><span aria-hidden="true">→</span></a>').join(''):
   '<p>No matching topic. Try a broader word, or find appropriate human support when needed.</p>';
  const count=surface.querySelector('[data-wb-count]');
  if(count)count.textContent=matches.length+' of '+ordered.length+' topics shown';
  const btn=surface.querySelector('[data-wb-all]');if(btn)btn.textContent=all?'Show a few topics':'Browse all '+ordered.length+' topics';
 };
 input.addEventListener('input',paint);
 surface.querySelector('[data-wb-all]')?.addEventListener('click',()=>{all=!all;input.value='';paint();});
 paint();
}
function download(name,content){
 const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
 const link=document.createElement('a');link.href=url;link.download=name;
 document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function handleFullTool(surface,button,locked=false){
 const id=button.dataset.wbMount,lane=button.dataset.wbMountLane;
 const host=surface.querySelector('[data-wb-tool-host="'+lane+'"]');
 if(!host)return;
 if(locked){
  host.innerHTML='<p>Your saved work is locked. Unlock it in <a href="#account">Account</a> before opening an additional full tool. You can still read and use the private worksheets above.</p>';
  return;
 }
 // Only one full legacy renderer is active: many old tools use fixed internal IDs.
 surface.querySelectorAll('[data-wb-tool-host]').forEach(other=>{
  if(other!==host)other.replaceChildren();
 });
 if(host.hasChildNodes()){
  host.replaceChildren();button.textContent='Load the '+id.replace(/-/g,' ')+' tool here';return;
 }
 try{
  renderTool(host,id);
  button.textContent='Close this additional tool';
 }catch(error){
  host.innerHTML='<p>That additional tool could not be opened here. The inline worksheet above remains available.</p>';
 }
}
function wire(surface,g,locked=false){
 surface.querySelectorAll('[data-wb-jump]').forEach(b=>b.addEventListener('click',()=>{
  const section=surface.querySelector('#ns-wb-'+b.dataset.wbJump);
  section?.scrollIntoView({block:'start',behavior:'instant'});
  const title=section?.querySelector('h2');
  if(title){title.setAttribute('tabindex','-1');title.focus({preventScroll:true});}
 }));
 surface.addEventListener('click',event=>{
  const care=event.target.closest('[data-wb-care]');
  if(care){
   const messages={
    urgent:'If someone is in immediate danger in the UK, call 999. Do not delay for a web exercise.',
    health:'For severe or new concerning physical symptoms, seek emergency assessment when appropriate. NHS 111 can direct urgent non-emergency help.',
    private:'Consider using an unmonitored device and contacting a trusted person or confidential specialist service. You do not have to confront anyone.',
    unsure:'You can use NHS 111 or another trusted service to discuss which help is appropriate. No questionnaire is required.'
   };
   surface.querySelector('[data-wb-care-result]').textContent=messages[care.dataset.wbCare]||'';
   return;
  }
  const button=event.target.closest('button');if(!button)return;
  if(button.dataset.wbMount){handleFullTool(surface,button,locked);return;}
  if(button.dataset.wbAction){updateFeedback(surface,button.dataset.wbAction);return;}
  if(button.hasAttribute('data-wb-summary')){
   const notes=getNotes(surface);const text=notesText(g,notes);
   const out=surface.querySelector('[data-wb-summary-output]');
   out.textContent=Object.keys(notes).length?text:'No responses yet. You can keep reading without filling anything in.';
   return;
  }
  if(button.hasAttribute('data-wb-download')){
   download('nobodys-simple-'+safeId(g.id)+'-notes.txt',notesText(g,getNotes(surface)));
   const out=surface.querySelector('[data-wb-summary-output]');
   out.textContent='Your text file was prepared. Keep it somewhere private if it contains personal information.';
   return;
  }
  if(button.hasAttribute('data-wb-clear')){
   if(button.dataset.confirm!=='yes'){
    button.dataset.confirm='yes';button.textContent='Confirm clearing all notes';button.focus();return;
   }
   surface.querySelectorAll('[data-wb-field]').forEach(field=>{
    if(field.tagName==='SELECT')field.selectedIndex=0;else field.value='';
   });
   surface.querySelectorAll('[data-wb-check]').forEach(field=>field.checked=false);
   surface.querySelectorAll('[data-wb-feedback]').forEach(field=>field.textContent='Your notes are optional. Nothing is scored or sent.');
   surface.querySelector('[data-wb-summary-output]').textContent='Your inline notes have been cleared from this page.';
   button.removeAttribute('data-confirm');button.textContent='Clear my notes';
  }
 });
 setupAtlas(surface);
}
export function renderIntegratedWorkbook(root,{mode='',option='',topic='',locked=false}={}){
 const g=topic?workbookForTopic(topic):workbookForChoice(mode,option);
 if(!g){root.innerHTML='<div class="ns-wb-wrap"><h1>We could not find this guide.</h1><p>Choose a starting point to continue.</p><a href="#navigate">Back to starting points</a></div>';return;}
 root.innerHTML=g.safetyFirst?safeMarkup(g):worksheetMarkup(g);
 const surface=root.querySelector('[data-workbook]');
 wire(surface,g,locked);
}
