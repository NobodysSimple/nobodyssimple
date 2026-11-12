/* Staff Topic Desk: private editorial workspace, authenticated GitHub publisher.
 * No GitHub token, content drafts or notes are sent to the public website.
 */
import {atlasProblemIndex,atlasDomains,atlasGet} from './ns-atlas-core.mjs';
import {NAV_THEMES,topicTheme} from './ns-needs-themes.mjs';
import {workbookForTopic} from './ns-integrated-workbook-data.mjs';
import {topicPageModel} from './ns-topic-reading-data.mjs';
import {renderTopicReadingStart,renderTopicReadingEnd} from './ns-topic-reading-ui.mjs';
import {normalizeTopicRecord,TOPIC_KINDS,TOPIC_LANES} from './ns-topic-publications.mjs';
import {escapeHTML} from './core.mjs';

const e=x=>escapeHTML(String(x??''));
const plain=x=>String(x??'').trim();
const slug=x=>plain(x).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
 .replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,85);
const lines=(s,max=16)=>String(s||'').split(/\r?\n/).map(plain).filter(Boolean).slice(0,max);
const defaultPairs=(labels)=>labels.map(label=>({label,detail:''}));
const copy=x=>JSON.parse(JSON.stringify(x));
const placeholder={
 core:defaultPairs(['What is happening','Circumstances that matter','Needs and available support','What comes next']),
 traps:defaultPairs(['A common misunderstanding','An unhelpful expectation','A missing external factor']),
 steps:defaultPairs(['Understand the situation','Consider what is needed','Choose what is realistic','Review support and options']),
 faq:[{q:'What if this does not fit me?',a:''},{q:'What options do I have?',a:''},{q:'When might support help?',a:''}]
};
const safeField=(val,max=5000)=>plain(val).slice(0,max);
const textArea=(name,label,value,rows=3,hint='')=>
 '<label class="ns-topic-edit-field"><span>'+e(label)+'</span>'+
 '<textarea data-topic-input="'+e(name)+'" rows="'+rows+'" maxlength="5000" placeholder="'+e(hint)+'">'+e(value||'')+'</textarea></label>';
const textInput=(name,label,value,hint='')=>
 '<label class="ns-topic-edit-field"><span>'+e(label)+'</span>'+
 '<input data-topic-input="'+e(name)+'" type="text" maxlength="5000" value="'+e(value||'')+'" placeholder="'+e(hint)+'"></label>';
const dropdown=(name,label,value,options,disabled=false)=>
 '<label class="ns-topic-edit-field"><span>'+e(label)+'</span><select data-topic-input="'+e(name)+'"'+(disabled?' disabled':'')+'>'+
 options.map(item=>'<option value="'+e(item.id)+'"'+(item.id===value?' selected':'')+'>'+e(item.title)+'</option>').join('')+'</select></label>';
const pairsEditor=(name,label,items,min=0)=>'<div class="ns-topic-pair-group">'+
 '<div class="ns-topic-pair-heading"><h3>'+e(label)+'</h3><span>'+items.length+' entries</span></div>'+
 items.map((item,i)=>'<div class="ns-topic-pair-row">'+
  textInput(name+'.'+i+'.label','Heading '+(i+1),item.label)+
  textArea(name+'.'+i+'.detail','Explanation '+(i+1),item.detail,3)+
 '</div>').join('')+
 (min?'<p class="ns-topic-edit-help">A set of '+min+' meaningful entries is recommended. Empty entries are not published.</p>':'')+'</div>';
const faqEditor=(name,label,items)=>'<div class="ns-topic-pair-group"><div class="ns-topic-pair-heading"><h3>'+e(label)+'</h3><span>'+items.length+' questions</span></div>'+
 items.map((item,i)=>'<div class="ns-topic-pair-row">'+
  textInput(name+'.'+i+'.q','Question '+(i+1),item.q)+
  textArea(name+'.'+i+'.a','Answer '+(i+1),item.a,3)+
 '</div>').join('')+'</div>';
const methodsEditor=record=>{
 const methods=record.guideMethods||[];
 return '<p class="ns-topic-edit-help">These are the five existing worksheet chapters. Editing their wording keeps their original tools and journals working. Add new interactive cards separately below.</p>'+
 TOPIC_LANES.map(id=>{
  const group=methods.find(x=>x.id===id)||{id,methods:[]};
  return '<details class="ns-topic-edit-subsection"><summary>'+e(({context:'Practical conditions',practice:'Behaviour and actions',thinking:'CBT / thinking',acceptance:'ACT / values',support:'Support and access'})[id])+
  ' <small>'+group.methods.length+' guided method(s)</small></summary>'+
  group.methods.map((m,i)=>'<div class="ns-topic-pair-row">'+
  textInput('guideMethods.'+id+'.'+i+'.title','Method '+(i+1)+' name',m.title)+
  textArea('guideMethods.'+id+'.'+i+'.why','Why consider it?',m.why,3)+
  textArea('guideMethods.'+id+'.'+i+'.steps','Guided steps · one per line',(m.steps||[]).join('\n'),4)+
  textArea('guideMethods.'+id+'.'+i+'.caution','When to adapt or skip',m.caution,2)+
  '</div>').join('')+
  '</details>';
 }).join('');
};
const toolsEditor=record=>'<p class="ns-topic-edit-help">Add optional staff-authored approach cards. These join existing tool families; their worksheets and original tools remain available.</p>'+
 (record.customTools||[]).map((t,i)=>'<div class="ns-topic-pair-row">'+
 textInput('customTools.'+i+'.title','New approach name',t.title)+
 dropdown('customTools.'+i+'.kind','Approach family',t.kind,TOPIC_KINDS.map(k=>({id:k,title:k.replace(/-/g,' ')})))+
 textArea('customTools.'+i+'.why','When might this help?',t.why,3)+
 textArea('customTools.'+i+'.steps','Guided steps · one per line',(t.steps||[]).join('\n'),4)+
 textArea('customTools.'+i+'.caution','Important cautions',t.caution,2)+
 '<button class="ns-staff-small ns-staff-danger" data-topic-remove-tool="'+i+'" type="button">Remove this additional approach</button>'+
 '</div>').join('')+
 '<button class="ns-staff-small" type="button" data-topic-add-tool>＋ Add a guided approach</button>';
function fromGuide(id){
 const g=workbookForTopic(id);if(!g)return null;
 const m=topicPageModel(g);
 return normalizeTopicRecord({
  id,original:true,status:'published',
  domain:g.topicDomain,theme:topicTheme(atlasGet(id)),
  title:g.title,lead:g.lead,definition:g.what,
  recognition:m.recognition,reframe:m.reframe,core:m.core,
  traps:m.traps.map(([label,detail])=>({label,detail})),
  steps:m.steps,progress:m.progress,
  faq:m.faq.map(([q,a])=>({q,a})),closing:m.closing,supportText:m.supportText,
  sourceNote:g.review,guidedPrompts:[],customTools:[],
  guideMethods:g.lanes.map(l=>({
   id:l.id,methods:l.methods.map(x=>({
    title:x.title,why:x.why,steps:x.steps,caution:x.caution||''
   }))
  }))
 });
}
function blankTopic(){
 return normalizeTopicRecord({
  id:'new-topic',status:'published',original:false,domain:'feel',theme:'mood',
  title:'',lead:'',definition:'',recognition:[],reframe:'',
  core:copy(placeholder.core),traps:copy(placeholder.traps),
  steps:copy(placeholder.steps),faq:copy(placeholder.faq),progress:[],closing:'',
  supportText:'',sourceNote:'',guidedPrompts:[],guideMethods:[],customTools:[]
 });
}
function validRecord(raw,known){
 const r=normalizeTopicRecord(raw);
 if(!r||!r.id||!r.title)throw Error('Give this topic a valid ID and title.');
 if(!atlasDomains.some(d=>d.id===r.domain))throw Error('Select a valid topic domain.');
 if(!NAV_THEMES.some(t=>t.id===r.theme))throw Error('Select a valid destination theme.');
 if(!r.original&&known.some(x=>x.id===r.id))throw Error('This topic ID already belongs to an existing source page.');
 if(r.status==='archived')return r;
 if(r.title.length<5||r.lead.length<20||r.definition.length<40)throw Error('Add a meaningful title, opening and explanation.');
 if(r.recognition.length<2)throw Error('Write at least two specific recognition examples.');
 if(r.reframe.length<45)throw Error('Explain the central idea more fully.');
 for(const [key,n] of [['core',4],['traps',3],['steps',4],['faq',3]]){
  if(r[key].length<n)throw Error('Complete the '+key+' section ('+n+' entries needed).');
 }
 if(r.progress.length<3||r.closing.length<40||r.supportText.length<40)
  throw Error('Finish progress markers, closing and support information.');
 for(const t of r.customTools)if(t.steps.length<2||t.why.length<25)throw Error('Custom approaches need at least two steps and a useful rationale.');
 return r;
}
function activeDraftKey(id){return 'ns-staff-topic-v1:'+id;}
function saveLocal(r){
 try{localStorage.setItem(activeDraftKey(r.id),JSON.stringify({date:new Date().toISOString(),record:r}));return true;}
 catch{return false;}
}
function localFor(id){
 try{const v=JSON.parse(localStorage.getItem(activeDraftKey(id))||'null');return normalizeTopicRecord(v?.record);}
 catch{return null;}
}
function clearLocal(id){try{localStorage.removeItem(activeDraftKey(id));}catch{}}
function resolvePath(obj,path,val){
 const parts=path.split('.');
 if(parts[0]==='guideMethods'){
  const lane=obj.guideMethods.find(x=>x.id===parts[1]);
  const m=lane?.methods?.[Number(parts[2])];
  if(!m)return;
  m[parts[3]]=parts[3]==='steps'?lines(val,8):val;
  return;
 }
 if(['recognition','progress'].includes(parts[0])){obj[parts[0]]=lines(val,12);return;}
 if(parts.length===1){obj[path]=val;return;}
 if(parts[0]==='customTools'){
  const t=obj.customTools[Number(parts[1])];if(!t)return;
  t[parts[2]]=parts[2]==='steps'?lines(val,8):val;return;
 }
 const arr=obj[parts[0]],index=Number(parts[1]);
 if(!Array.isArray(arr)||!arr[index])return;
 arr[index][parts[2]]=val;
}
export function mountTopicWorkspace(root,{getPublisher,onNotice=()=>{}}={}){
 let current=null,expected=null,remote=[],selectedId='',saving=false,timer=null,query='';
 const q=s=>root.querySelector(s);
 const notice=(message,error=false)=>{const output=q('[data-topic-status]');if(output){output.textContent=message;output.dataset.error=String(error)}onNotice(message,error)};
 const recordsForList=()=>new Map(remote.map(x=>[x.id,x]));
 function list(){
  const records=recordsForList();
  const all=[...atlasProblemIndex.map(t=>({...t,record:records.get(t.id)||null})),
   ...remote.filter(r=>!atlasGet(r.id)).map(r=>({id:r.id,title:r.title,domain:r.domain,record:r}))];
  const needle=query.toLocaleLowerCase().trim();
  const filtered=all.filter(t=>[t.title,t.id,t.domain,t.record?.theme].some(x=>String(x||'').toLocaleLowerCase().includes(needle)))
   .sort((a,b)=>a.title.localeCompare(b.title));
  q('[data-topic-count]').textContent=filtered.length+' topics · '+remote.length+' repository changes';
  q('[data-topic-list]').innerHTML=filtered.slice(0,150).map(t=>{
   const record=t.record;
   return '<button type="button" class="ns-topic-row" data-topic-open="'+e(t.id)+'">'+
    '<strong>'+e(record?.title||t.title)+'</strong><small>'+e(t.id)+' · '+
      e(NAV_THEMES.find(g=>g.id===(record?.theme||topicTheme(t)))?.title||'Topic')+'</small>'+
    '<span class="ns-topic-status-pill">'+e(record?.status==='archived'?'Archived':record?.status==='published'?'Edited':'Original')+'</span></button>';
  }).join('')||'<p>No matching topics.</p>';
  q('[data-topic-results-note]').textContent=filtered.length>150?'Showing the first 150 results. Search to find another topic.':'';
 }
 function section(name,label,body,open=false){
  return '<details class="ns-topic-edit-section"'+(open?' open':'')+'><summary>'+e(label)+'</summary><div class="ns-topic-section-fields">'+body+'</div></details>';
 }
 function editor(){
  if(!current)return;
  q('[data-topic-list-panel]').hidden=true;q('[data-topic-editor-panel]').hidden=false;
  const original=atlasGet(current.id);
  const themeOptions=NAV_THEMES.map(x=>({id:x.id,title:x.title}));
  const domainOptions=atlasDomains.map(x=>({id:x.id,title:x.name||x.id}));
  q('[data-topic-editor-title]').textContent=current.title||'New topic';
  q('[data-topic-editor-meta]').textContent=(original?'Existing Atlas topic':'New staff topic')+' · '+current.id;
  q('[data-topic-delete]').textContent=original?'Archive topic':'Delete topic';
  q('[data-topic-delete]').hidden=!original&&!expected;
  q('[data-topic-restore]').hidden=current.status!=='archived';
  q('[data-topic-editor-fields]').innerHTML=
   section('identity','01 · Title, placement and opening',
    textInput('title','Page title',current.title,'Write a reader-friendly title')+
    textInput('id','Permanent topic URL ID',current.id,'lowercase-dashes')+
    dropdown('domain','Original topic subject',current.domain,domainOptions,Boolean(original))+
    dropdown('theme','Show this topic under',current.theme,themeOptions)+
    textArea('lead','Short introduction',current.lead,3)+
    textArea('definition','What is happening? (psychoeducation)',current.definition,6),true)+
   section('recognition','02 · Recognition and central idea',
    textArea('recognition','Recognition sentences · one per line',current.recognition.join('\n'),5,
      'Write relatable thoughts, feelings, behaviours or situations')+
    textArea('reframe','The central explanation / reframe',current.reframe,5),true)+
   section('framework','03 · Four aspects and four options',
    pairsEditor('core','Four parts of the picture',current.core,4)+
    pairsEditor('steps','Four directions forward',current.steps,4))+
   section('traps','04 · Common traps and misconceptions',
    pairsEditor('traps','Unhelpful assumptions to examine',current.traps,3))+
   section('outcomes','05 · Progress, common questions, support and ending',
    textArea('progress','Signs of progress · one per line',current.progress.join('\n'),5)+
    faqEditor('faq','Common questions',current.faq)+
    textArea('supportText','When additional support may help',current.supportText,4)+
    textArea('closing','A gentle closing message',current.closing,4)+
    textArea('sourceNote','Evidence / editorial status note',current.sourceNote,3))+
   section('guides','06 · Existing guided exercises and journals',methodsEditor(current))+
   section('tools','07 · Additional guided approaches',toolsEditor(current))+
   section('prompts','08 · Optional guided reflection prompts',
    faqEditor('guidedPrompts','Prompt and supportive explanation',current.guidedPrompts)+
    '<button type="button" class="ns-staff-small" data-topic-add-prompt>＋ Add a question</button>');
  q('[data-topic-editor-fields]').querySelector('[data-topic-input="id"]').disabled=Boolean(original||expected);
  renderPreview();
 }
 function previewGuide(r){
  let base=workbookForTopic(r.id);
  if(!base)base={
   kind:'topic',id:'topic/'+r.id,optionId:r.id,title:r.title,
   lead:r.lead,what:r.definition,topicDomain:r.domain,contextFirst:true,
   recognition:r.recognition,contributors:[],mechanisms:[],variants:[],
   goals:[],progress:r.progress.join('; '),cycle:'',
   safetyFirst:false,supportFirst:false,medical:false,cautions:[],
   lanes:[],sources:[]
  };
  return {...base,kind:'topic',optionId:r.id,title:r.title,lead:r.lead,what:r.definition,
   publishedRecord:{...r,status:'published'}};
 }
 function renderPreview(){
  if(!current)return;
  const host=q('[data-topic-live-preview]');
  try{
   const guide=previewGuide(current);
   host.innerHTML='<div class="ns-staff-preview-paper"><div class="ns-staff-preview-eyebrow">NOBODY’S SIMPLE · FIELD NOTES</div>'+
    '<h1>'+e(current.title||'Untitled topic')+'</h1><p class="ns-staff-preview-deck">'+e(current.lead)+'</p>'+
    renderTopicReadingStart(guide)+renderTopicReadingEnd(guide)+'</div>';
  }catch(error){host.textContent='Preview cannot render yet: '+error.message;}
 }
 function schedule(){
  clearTimeout(timer);
  notice('Editing · changes are not yet published.');
  timer=setTimeout(()=>{
   if(current)notice(saveLocal(current)?'Draft saved locally. Publish to update the website.':
    'Browser storage unavailable. Keep a copy before leaving.',!localFor(current.id));
  },550);
 }
 async function refresh(){
  const publisher=getPublisher();
  if(!publisher){notice('Connect to GitHub to manage published topics.',true);return;}
  notice('Loading published topics…');
  try{
   const snapshot=await publisher.topicSnapshot();
   remote=snapshot.data.topics.map(normalizeTopicRecord).filter(Boolean);
   list();notice('Connected · changes publish to GitHub Pages after deployment.');
  }catch(error){notice(error.message||'Could not load topic registry.',true);}
 }
 function showList(){q('[data-topic-editor-panel]').hidden=true;q('[data-topic-list-panel]').hidden=false;list();}
 function open(id){
  const known=atlasGet(id),published=remote.find(r=>r.id===id)||null;
  if(!known&&!published)return;
  const baseline=published||fromGuide(id);
  if(!baseline){notice('Cannot edit this entry.',true);return;}
  expected=published?copy(published):null;
  current=copy(localFor(id)||baseline);
  selectedId=id;editor();
  notice(published?'Live version loaded. Edit and publish when ready.':'Original topic loaded. Your edits publish as a separate overlay.');
 }
 function create(){
  current=blankTopic();current.id='new-topic';
  expected=null;selectedId='';
  editor();notice('New topic. Choose a unique URL ID, write the guide, and publish.');
 }
 function applyInput(el){
  if(!current)return;
  const name=el.dataset.topicInput;
  if(name==='id'&&expected)return;
  const value=el.value;
  if(name==='id'){
   if(atlasGet(value)){notice('This URL ID already belongs to an original topic.',true);return;}
   if(!/^[a-z][a-z0-9-]{2,89}$/.test(value))return;
   const old=current.id;
   current.id=value;
   if(old!==value)clearLocal(old);
  }else resolvePath(current,name,value);
  q('[data-topic-editor-title]').textContent=current.title||'New topic';
  renderPreview();schedule();
 }
 async function publish(status='published'){
  if(!current||saving)return;
  const publisher=getPublisher();if(!publisher){notice('Sign in to GitHub first.',true);return;}
  let payload;
  try{payload=validRecord({...current,status,updatedAt:new Date().toISOString()},atlasProblemIndex);}
  catch(err){notice(err.message,true);return;}
  if(status==='archived'&&!confirm('Archive this topic? It will disappear from the topic directory after publication.'))return;
  saving=true;notice('Publishing topic to GitHub…');
  try{
   await publisher.publishTopic(payload,expected);
   clearLocal(current.id);
   expected=copy(payload);current=copy(payload);
   await refresh();editor();
   notice(status==='archived'?'Topic archived. The change will appear after deployment.':
    'Published to GitHub. Your website updates when GitHub Pages deploys.');
  }catch(error){notice(error.message||'Publish failed. Draft remains in this browser.',true);}
  finally{saving=false;}
 }
 async function remove(){
  if(!current||saving)return;
  if(atlasGet(current.id)){void publish('archived');return;}
  if(!expected){if(confirm('Discard this unpublished new topic?')){clearLocal(current.id);current=null;showList();}return;}
  if(!confirm('Permanently delete this staff-created topic? Existing links will no longer work.'))return;
  saving=true;
  try{
   await getPublisher().deleteTopic(current.id,expected);
   clearLocal(current.id);current=null;expected=null;
   await refresh();showList();notice('Staff topic deleted from the published registry.');
  }catch(error){notice(error.message||'Delete failed.',true);}
  finally{saving=false;}
 }
 root.addEventListener('input',event=>{
  if(event.target.matches('[data-topic-search]')){query=event.target.value;list();return;}
  if(event.target.matches('[data-topic-input]'))applyInput(event.target);
 });
 root.addEventListener('change',event=>{
  if(event.target.matches('[data-topic-input]'))applyInput(event.target);
 });
 root.addEventListener('click',event=>{
  const el=event.target.closest('button');if(!el)return;
  if(el.hasAttribute('data-topic-new')){create();return;}
  if(el.dataset.topicOpen){open(el.dataset.topicOpen);return;}
  if(el.hasAttribute('data-topic-back')){if(current)saveLocal(current);current=null;showList();return;}
  if(el.hasAttribute('data-topic-publish')){void publish();return;}
  if(el.hasAttribute('data-topic-archive')){void publish('archived');return;}
  if(el.hasAttribute('data-topic-restore')){void publish('published');return;}
  if(el.hasAttribute('data-topic-delete')){void remove();return;}
  if(el.hasAttribute('data-topic-refresh')){void refresh();return;}
  if(el.hasAttribute('data-topic-add-tool')){
   current.customTools.push({id:'method-'+(current.customTools.length+1),kind:'behaviour',
    title:'',why:'',steps:[],caution:'',worksheet:'step'});
   editor();schedule();return;
  }
  if(el.dataset.topicRemoveTool!==undefined){
   current.customTools.splice(Number(el.dataset.topicRemoveTool),1);editor();schedule();return;
  }
  if(el.hasAttribute('data-topic-add-prompt')){
   current.guidedPrompts.push({q:'',a:''});editor();schedule();
  }
 });
 return {refresh,open,showList,close(){current=null;clearTimeout(timer)}};
}
