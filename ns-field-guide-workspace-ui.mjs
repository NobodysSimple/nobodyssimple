import {
  WORKSPACE_KEY,DRAFT_KEY,TYPES,CAPTURES,CHAPTER_STATES,STAGES,SELF_GROUPS,PRACTICE_TYPES,
  readWorkspace,saveRecord,amendRecord,addEvent,deleteRecord,live,exportWorkspace
} from './ns-field-guide-workspace-data.mjs';
const e=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(url,label,cls='ns-fw-link')=>'<a class="'+cls+'" href="'+e(url)+'">'+e(label)+'</a>';
const action=(name,label,id='',cls='ns-fw-button')=>'<button type="button" class="'+cls+'" data-fw-action="'+e(name)+'" data-id="'+e(id)+'">'+e(label)+'</button>';
const label=(name,text,value='',kind='text',extra='')=>'<label class="ns-fw-label"><span>'+e(text)+'</span><input name="'+e(name)+'" type="'+kind+'" value="'+e(value)+'" '+extra+'></label>';
const area=(name,title,value='',rows=4)=>'<label class="ns-fw-label"><span>'+e(title)+'</span><textarea name="'+e(name)+'" rows="'+rows+'" maxlength="30000">'+e(value)+'</textarea></label>';
const options=(name,title,values,selected='')=>'<label class="ns-fw-label"><span>'+e(title)+'</span><select name="'+e(name)+'">'+values.map(([id,title])=>'<option value="'+e(id)+'" '+(selected===id?'selected':'')+'>'+e(title)+'</option>').join('')+'</select></label>';
const dateLabel=s=>{try{return s?new Date(s).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'}):'';}catch{return '';}};
const today=()=>new Date().toISOString().slice(0,10);
const drafts=()=>{try{const x=JSON.parse(localStorage.getItem(DRAFT_KEY)||'{}');return x?.type?{[x.type]:x.values||{}}:x&&typeof x==='object'&&!Array.isArray(x)?x:{};}catch{return {};}};
const keepDraft=(type,values)=>localStorage.setItem(DRAFT_KEY,JSON.stringify({...drafts(),[type]:values}));
const clearDraft=type=>{const x=drafts();delete x[type];if(Object.keys(x).length)localStorage.setItem(DRAFT_KEY,JSON.stringify(x));else localStorage.removeItem(DRAFT_KEY);};
const TABS=[['home','Overview','⌂'],['inbox','Inbox','✎'],['chapters','Chapters','⌁'],['self','Self-Map','✿'],['practice','Practice','✧'],['archive','Archive','↺']];
const VIEWS=[['inbox','The Inbox','Collect your thoughts without needing to organise them.','✎'],
['chapters','Open Chapters','Keep a problem, project or change in one evolving place.','⌁'],
['self','My Self-Map','Remember what has shaped you and who you are becoming.','✿'],
['practice','Practice Desk','Plan, rehearse, try and learn from real life.','✧'],
['archive','Life Archive','Look back at your own words and revisions.','↺'],
['reference','Useful When…','Retrieve helpful strategies when you need them.','★']];
const CATALOG=[['#lab','Life Lab lessons'],['#learn','Learn'],['#navigate','Problem Navigation'],['#maps','My Maps'],['#lifestyle','Identity Practice'],['#tools','Tools'],['#wisbody','Wisbody']];
function fieldNav(){return '<nav class="ns-guide6-back"><a href="#account">← Your space</a><a href="#lab">Life Lab ↗</a><a href="#account/saved">Privacy &amp; sync ↗</a></nav>';}
function tabs(active) {
  return '<nav class="ns-guide6-journal__tabs" aria-label="Field Guide pages">'+TABS.map(([id,title,icon])=>
    '<a href="'+(id==='home'?'#guide':'#guide/workspace/'+id)+'" class="ns-guide6-journal__tab ns-guide6-journal__tab--'+e(id)+(id===active?' is-active':'')+'" '+(id===active?'aria-current="page"':'')+'><span class="ns-guide6-journal__tab-symbol">'+icon+'</span>'+e(title)+'</a>').join('')+'</nav>';
}
function book(left,right,active='home') {
  return '<div class="ns-guide6 ns-guide6-journal ns-fw" data-guide="workspace">'+fieldNav()+
    '<div class="ns-guide6-journal__stage"><div class="ns-guide6-journal__book">'+
    '<div class="ns-guide6-journal__page ns-guide6-journal__page--left">'+left+'</div>'+
    '<div class="ns-guide6-journal__binding" aria-hidden="true">'+Array.from({length:8},(_,i)=>'<span class="ns-guide6-journal__ring" style="top:'+(6+i*12.4).toFixed(1)+'%"></span>').join('')+'</div>'+
    '<div class="ns-guide6-journal__page ns-guide6-journal__page--right">'+right+'</div>'+
    '<span class="ns-guide6-journal__bookmark" aria-hidden="true"></span></div>'+tabs(active)+'</div>'+
    '<div class="ns-guide6-privacy"><span aria-hidden="true">✦</span><div><strong>Private, written by you, always revisable.</strong><p class="ns-guide6-small">Your saved work stays on this device unless you enable the relevant collection in Saved work. Drafts save as you type. Deleting a record removes its content and leaves a sync-safe deletion marker. Nothing here becomes a public post.</p></div></div></div>';
}
function heading(k,title,desc=''){return '<div class="ns-fw-heading"><p class="ns-guide6-kicker">'+e(k)+'</p><h2>'+e(title)+'</h2>'+(desc?'<p>'+e(desc)+'</p>':'')+'</div>';}
function hero(count){return '<header class="ns-guide6-hero"><div class="ns-guide6-hero__copy"><p class="ns-guide6-kicker">YOUR PRIVATE LIVING FIELD GUIDE</p><h1>Your Field Guide</h1><p>A place to remember who you have been, understand who you are, and make room for who you may become.</p><div class="ns-guide6-hero__actions">'+link('#guide/workspace/inbox','Write anything','ns-guide6-primary')+'<span class="ns-guide6-count">'+count+' saved records</span></div></div><div class="ns-guide6-hero__visual" aria-hidden="true"><img class="ns-guide6-hero__nobody" src="ns-character-reading.webp" alt="" width="210" height="210"></div></header>';}
function tile(id,title,desc,icon,count=''){return '<a class="ns-guide6-collection ns-fw-tile" href="#guide/workspace/'+id+'"><span class="ns-guide6-collection__head"><span class="ns-guide6-collection__symbol">'+icon+'</span><span class="ns-guide6-collection__count">'+e(count)+'</span></span><strong>'+e(title)+'</strong><span class="ns-guide6-collection__description">'+e(desc)+'</span><span class="ns-guide6-collection__cta">Open page <span>→</span></span></a>';}
function card(r){const t=r.type==='conversation'?'Conversation':r.type==='self'?'Self-Map':r.type==='reference'?'Useful when…':r.type.charAt(0).toUpperCase()+r.type.slice(1);
  return '<a class="ns-fw-card" href="#guide/workspace/record/'+encodeURIComponent(r.id)+'"><span class="ns-fw-card__top"><small>'+e(t)+' · '+e(dateLabel(r.updatedAt))+'</small>'+(r.pinned?'★':'')+'</span><strong>'+e(r.title)+'</strong>'+(r.body?'<span>'+e(r.body.slice(0,145))+(r.body.length>145?'…':'')+'</span>':'')+(r.status==='done'||r.status==='completed'?'<small>Completed · Reflection saved</small>':'')+'</a>';
}
function cardSet(records,emptyText){return records.length?'<div class="ns-fw-card-grid">'+records.map(card).join('')+'</div>':'<p class="ns-fw-empty">'+e(emptyText)+'</p>';}
function quickCapture(){return '<form class="ns-fw-quick-form" data-fw-quick><p class="ns-guide6-kicker">WRITE BEFORE YOU ORGANISE</p><h3>What is on your mind?</h3>'+
  options('capture','Choose a kind of thought',CAPTURES,'quick')+
  '<textarea name="body" rows="4" maxlength="30000" placeholder="Write anything. You can organise it later…" aria-label="Quickly capture a thought"></textarea>'+
  '<small data-fw-draft-status>Private draft on this device · not yet in your archive</small>'+
  '<div class="ns-fw-actions"><button type="submit" class="ns-guide6-primary">Keep this thought →</button>'+link('#guide/workspace/compose/chapter','New chapter')+'</div></form>';
}
function summaryProgress(storage) {
  let completed=0,practices=0,projects=0,maps=0;
  try{const x=JSON.parse(storage.getItem('ns-account-learning-v2')||'{}');completed=Object.values(x).filter(r=>r&&r.completed===true).length;}catch{}
  try{const x=JSON.parse(storage.getItem('ns-lifestyle-practice-v1')||'{}');practices=Array.isArray(x.history)?x.history.length:0;}catch{}
  try{const x=JSON.parse(storage.getItem('ns-navigation-projects-v1')||'[]');projects=Array.isArray(x)?x.length:0;}catch{}
  try{const x=JSON.parse(storage.getItem('ns-personal-maps-v1')||'[]');maps=Array.isArray(x)?x.length:0;}catch{}
  return {completed,practices,projects,maps};
}
function sourceChoices(storage) {
  const list=[],push=(app,id,title,href)=>{if(id && list.length<120)list.push({app,id:String(id),title:String(title).slice(0,150),href});};
  try{
    const p=JSON.parse(storage.getItem('ns-account-learning-v2')||'{}');
    Object.entries(p).filter(([,v])=>v?.completed===true).slice(-25).forEach(([id])=>push('lab',id,id.replace(/^ns-lifelab-v3:/,'').replace(/-/g,' '),'#lab'));
  }catch{}
  try{
    const p=JSON.parse(storage.getItem('ns-lifestyle-practice-v1')||'{}');
    (p.history||[]).slice(-20).forEach(h=>push('practice',h.date+':'+h.skillId,h.skillId+' · '+h.date,'#lifestyle'));
  }catch{}
  try{
    const p=JSON.parse(storage.getItem('ns-navigation-projects-v1')||'[]');
    if(Array.isArray(p))p.slice(0,20).forEach(x=>push('navigation',x.id,x.title||'Saved navigation project','#navigate'));
  }catch{}
  try{
    const p=JSON.parse(storage.getItem('ns-personal-maps-v1')||'[]');
    if(Array.isArray(p))p.slice(0,20).forEach(x=>push('maps',x.id,x.title||'Saved personal map','#maps'));
  }catch{}
  return list;
}
function sourcesPanel(storage) {
  const p=summaryProgress(storage);
  return '<section class="ns-fw-panel"><div class="ns-fw-panel-head"><strong>Saved progress from elsewhere</strong><small>Your existing activity records; nothing imported without your choice.</small></div>'+
    '<div class="ns-fw-stat-grid"><span><b>'+p.completed+'</b> lessons</span><span><b>'+p.practices+'</b> practices</span><span><b>'+p.projects+'</b> plans</span><span><b>'+p.maps+'</b> maps</span></div>'+
    '<div class="ns-fw-actions">'+CATALOG.slice(0,5).map(([href,name])=>link(href,name)).join('')+'</div></section>';
}
function dashboard(data,quickToolsHTML,storage) {
  const items=live(data),due=items.filter(r=>r.dueAt && r.dueAt<=today() && !['archived','done','completed'].includes(r.status));
  const chapters=items.filter(r=>r.type==='chapter'&&!['archived','done','completed'].includes(r.status)).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  const conversations=items.filter(r=>r.type==='conversation'&&!['archived','done','completed'].includes(r.status));
  const pinned=items.filter(r=>r.pinned);
  const left=hero(items.length)+quickCapture()+'<section class="ns-guide6-journal__collections">'+heading('YOUR LIVING PAGES','Choose where to go','All of this stays connected.')+
    '<div class="ns-guide6-collections">'+VIEWS.slice(0,4).map(([id,title,desc,icon])=>tile(id,title,desc,icon,items.filter(r=>id==='inbox'?r.type==='note':id==='chapters'?r.type==='chapter':id==='self'?r.type==='self':r.type==='practice'||r.type==='conversation').length+' saved')).join('')+'</div></section>';
  const right=heading('RIGHT NOW','Pick up where you left off')+
    '<section class="ns-fw-panel"><h3>Currently working through</h3>'+cardSet(chapters.slice(0,3),'No open Chapters yet. Open one to give an ongoing struggle or goal a home.')+
    link('#guide/workspace/chapters','All Chapters')+'</section>'+
    '<section class="ns-fw-panel"><h3>Coming up</h3>'+cardSet(due.concat(conversations.filter(x=>!due.some(y=>y.id===x.id))).slice(0,3),'Nothing to review right now. You can choose a review date whenever you wish.')+'</section>'+
    '<section class="ns-fw-panel"><h3>Something worth remembering</h3>'+cardSet(pinned.slice(0,2),'Pin a useful discovery to keep it here.')+
    link('#guide/workspace/reference','Useful when… & reference cards')+'</section>'+
    '<div class="ns-fw-actions">'+link('#guide/workspace/archive','Your Life Archive')+link('#guide/legacy','Original four collections')+link('#guide/workspace/search','Search everything')+'</div>'+
    sourcesPanel(storage)+quickToolsHTML;
  return book(left,right);
}
function listPage(data,view,quickToolsHTML) {
  const all=live(data),config=VIEWS.find(x=>x[0]===view)||VIEWS[0];
  let chosen=all.filter(r=>view==='inbox'?['note','notebook'].includes(r.type):view==='chapters'?r.type==='chapter':view==='self'?r.type==='self':view==='practice'?['practice','conversation'].includes(r.type):view==='reference'?r.type==='reference':true);
  chosen.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  const active=view==='reference'?'archive':view;
  const links=view==='practice'?[['practice','New practice'],['conversation','Prepare a conversation']]:view==='inbox'?[['note','New thought'],['notebook','New notebook']]:view==='self'?[['self','Add to my map']]:view==='reference'?[['reference','New useful-when card']]:[['chapter','Open a Chapter']];
  const left=heading('YOUR FIELD GUIDE',config[1],config[2])+
    '<div class="ns-fw-actions">'+links.map(([type,title])=>link('#guide/workspace/compose/'+type,title,'ns-guide6-primary')).join('')+'</div>'+
    (view==='inbox'?quickCapture():'')+
    (view==='self'?'<div class="ns-fw-panel"><p>Your self-map can hold apparent contradictions and changes of mind. These are your working descriptions, not fixed diagnoses.</p>'+SELF_GROUPS.map(g=>'<span class="ns-fw-chip">'+e(g)+'</span>').join('')+'</div>':'')+
    (view==='chapters'?'<div class="ns-fw-panel"><p>Notice → Understand → Decide → Try → Review → Revise. Move freely between stages and pause whenever appropriate.</p></div>':'')+
    (view==='practice'?'<div class="ns-fw-panel"><p>Prepare homework, predictions, wording, outcomes and the next attempt. A useful experiment can end without an improvement score.</p></div>':'')+
    (view==='inbox'?'<div class="ns-fw-panel"><strong>Separate notebooks</strong><p>Start a notebook for ideas, unsent letters, or anything you want to keep together. Assign notes to it later.</p></div>':'')+
    '<div class="ns-fw-panel">'+link('#guide/workspace/search','Find something I saved')+'</div>';
  let right=heading('SAVED PAGES',chosen.length+' '+(chosen.length===1?'record':'records'))+cardSet(chosen,'This page is ready for your first entry. Nothing needs to be written perfectly.')+quickToolsHTML;
  return book(left,right,active);
}
function archivePage(data,quickToolsHTML){
  const all=live(data).filter(r=>r.type!=='notebook').sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
  const changed=all.filter(r=>r.history.length);
  const left=heading('YOUR LIFE ARCHIVE','An evolving record','What you thought then can sit beside what you think now.')+
    '<section class="ns-fw-panel"><h3>Past me / Present me</h3>'+cardSet(changed.slice(0,6),'When you revisit and change an entry, its earlier words are kept for comparison.')+'</section>'+
    '<div class="ns-fw-actions">'+link('#guide/workspace/reference','Useful when… cards')+link('#guide/workspace/search','Search your history')+action('export-all','Export everything')+'</div>'+
    '<p class="ns-fw-small">Archived Chapters and completed practices remain findable. Deleting an entry removes its content from the workspace.</p>';
  const right=heading('YOUR TIMELINE','What you recorded')+cardSet(all.slice(0,35),'Your timeline will build from entries you choose to keep.')+quickToolsHTML;
  return book(left,right,'archive');
}
function searchPage(data,quickToolsHTML){
  return book(heading('FIND SOMETHING I LEARNED','Search your life notes')+
    '<label class="ns-fw-label"><span>Search titles, writing, situations and saved discoveries</span><input id="ns-fw-search" type="search" placeholder="Try rejection, work, conversations…" autocomplete="off"></label>'+
    options('search-type','Search within',[['','Everything'],...TYPES.map(t=>[t,t])],'')+
    '<p class="ns-fw-small">Nothing is sent to a search service. Results are filtered within your private saved workspace.</p>',
    heading('MATCHING RECORDS','Search results')+'<section data-fw-results>'+cardSet(live(data).slice(-20).reverse(),'No notes yet.')+'</section>'+quickToolsHTML,'archive');
}
function fieldsFor(type,r={}){
 const f=r.fields||{};
 const groups={
  chapter:[['situation','What is happening?'],['understanding','What might be maintaining it?'],['decision','What matters in deciding?'],['attempt','What will I try?'],['review','What happened?'],['revision','What needs revising?']],
  self:[['past','Where this came from'],['present','How it shows up now'],['future','Who I want to become'],['contradictions','What changes across situations']],
  practice:[['intention','What I want to practise'],['prediction','What I predict'],['steps','Steps or plan'],['obstacles','What could get in the way'],['outcome','What actually happened'],['learning','What I learned'],['nextStep','What I might try next']],
  conversation:[['purpose','What I want from the conversation'],['keyPoints','Points I do not want to forget'],['draftWords','Exactly what I plan to say'],['shortVersion','Short version I can copy'],['possibleResponses','Possible responses, not predictions'],['actual','What was actually said'],['takeaway','What I learned and what happens next']],
  reference:[['strategy','What could help in that situation'],['limits','When this strategy might not fit']]
 };
 return (groups[type]||[]).map(([key,title])=>area('f_'+key,title,f[key]||'',key==='draftWords'?7:3)).join('');
}
function composePage(data,type,id,seedId,quickToolsHTML,storage) {
 if(!TYPES.includes(type))return book(heading('UNKNOWN PAGE','Entry type not found'),quickToolsHTML);
 const all=live(data),old=id?all.find(r=>r.id===id):null,seed=seedId?all.find(r=>r.id===seedId):null;
 if(id&&!old)return book(heading('NOT FOUND','This entry is unavailable'),quickToolsHTML);
 const d=old||seed||{};
 const draft=drafts()[type]||{};
 const v=old||seed?d:draft;
 const chapterChoices=[['','No Chapter'],...all.filter(r=>r.type==='chapter'&&r.id!==id).map(r=>[r.id,r.title])];
 const notebooks=[['','No notebook'],...all.filter(r=>r.type==='notebook').map(r=>[r.id,r.title])];
 const statusChoices=type==='chapter'?CHAPTER_STATES.map(s=>[s,s]):
  [['active','Active'],['waiting','Waiting'],['paused','Taking a break'],['done','Completed'],['archived','Archived'],['reconsider','Reconsidering']];
 const sources=sourceChoices(storage);
 const composer='<form data-fw-compose data-type="'+e(type)+'" data-id="'+e(id||'')+'" class="ns-fw-form">'+
   label('title','Title (optional if you write below)',old?.title||(!seed?v.title||'':'') )+
   area('body',type==='note'?'Write freely':type==='conversation'?'Background or context':'The main thing you want to keep',v.body||'',type==='note'?8:4)+
   (type==='note'?options('capture','Type of brain dump',CAPTURES,v.capture||'quick')+
      options('notebookId','Notebook',notebooks,v.notebookId||''):'')+
   (type==='chapter'?options('stage','Where I am in this Chapter',STAGES.map(x=>[x,x]),v.stage||'notice'):'')+
   (type==='self'?options('selfGroup','Part of my Self-Map',SELF_GROUPS.map(x=>[x,x]),v.selfGroup||'present'):'')+
   (type==='practice'?options('practiceType','What kind of practice?',PRACTICE_TYPES.map(x=>[x,x]),v.practiceType||'experiment'):'')+
   (type!=='notebook'?options('status','Current state',statusChoices,v.status||statusChoices[0][0]):'')+
   (type!=='notebook'&&type!=='chapter'?options('chapterId','Related open Chapter',chapterChoices,v.chapterId||''):'')+
   (type!=='notebook'?area('context','Context (optional)',v.context||'',2):'')+
   (type==='reference'||type==='note'?area('usefulWhen','Useful when… (optional)',v.usefulWhen||'',2):'')+
   fieldsFor(type,v)+
   (type!=='notebook'?label('dueAt','Optional date to revisit (your choice)',v.dueAt||'','date'):'')+
   (type!=='notebook'?'<label class="ns-fw-check"><input type="checkbox" name="pinned" '+(v.pinned?'checked':'')+'> Pin for easy access</label>':'')+
   (!id&&sources.length?options('source','Optionally link an existing saved activity',[['','Do not link'],...sources.map((s,i)=>[String(i),s.app+': '+s.title])],''):'')+
   '<div class="ns-fw-actions"><button class="ns-guide6-primary" type="submit">'+(id?'Save revision':'Save to my Field Guide')+' →</button>'+link('#guide','Cancel')+'</div><p class="ns-fw-small" data-fw-draft-status>Drafts are saved on this device as you type. Nothing is interpreted for you.</p></form>';
 const left=heading(id?'REVISIT THIS ENTRY':seed?'TURN THIS INTO…':'A NEW FIELD GUIDE PAGE',id?'Your words can change.':type==='self'?'Map a part of yourself.':type==='conversation'?'Prepare your words.':type==='practice'?'Try something in real life.':type==='chapter'?'Open a Chapter.':type==='notebook'?'Name your notebook.':'What would you like to keep?')+
   '<p>Write what matters, not what you think you are supposed to feel. You can edit, pause, revise or remove this later.</p>'+
   '<img class="ns-fw-illustration" src="ns-character-writing.webp" alt="" width="155" height="155">'+
   (seed?'<p class="ns-fw-small">Creating a new linked record from '+e(seed.title)+'. The original stays unchanged.</p>':'')+
   (id&&old?.history?.length?'<p>'+old.history.length+' earlier version(s) available for comparison.</p>':'');
 return book(left,composer,'home');
}
function recordPage(data,id,quickToolsHTML){
 const all=live(data),r=all.find(x=>x.id===id);
 if(!r)return book(heading('NOT FOUND','This saved entry is unavailable'),quickToolsHTML);
 const related=all.filter(x=>r.links.includes(x.id)||x.links.includes(r.id)||x.chapterId===r.id||r.chapterId===x.id||x.notebookId===r.id||r.notebookId===x.id).filter(x=>x.id!==r.id);
 const extras=Object.entries(r.fields).filter(([,v])=>v).map(([k,v])=>'<section class="ns-fw-detail-field"><h3>'+e(k.replace(/([A-Z])/g,' $1'))+'</h3><p>'+e(v)+'</p></section>').join('');
 const versions=r.history.slice().reverse();
 const left=heading('YOUR '+r.type.toUpperCase()+' · '+dateLabel(r.createdAt),r.title)+
    '<div class="ns-fw-actions">'+link('#guide/workspace/edit/'+encodeURIComponent(r.id),'Edit this page','ns-guide6-primary')+action('pin',r.pinned?'Unpin':'Pin for later',r.id)+action('export-one','Export this page',r.id)+'</div>'+
    '<section class="ns-fw-panel"><p class="ns-fw-body">'+e(r.body||'No main note recorded.')+'</p>'+(r.context?'<p><b>Context:</b> '+e(r.context)+'</p>':'')+(r.usefulWhen?'<p><b>Useful when:</b> '+e(r.usefulWhen)+'</p>':'')+extras+
    '<small>Created '+e(dateLabel(r.createdAt))+' · Last revised '+e(dateLabel(r.updatedAt))+'</small></section>'+
    (r.type==='chapter'?'<section class="ns-fw-panel"><h3>Your route</h3><div class="ns-fw-chapter-stages">'+STAGES.map(s=>action('stage:'+s,(r.stage===s?'✓ ':'')+s,r.id)).join('')+'</div></section>':'')+
    (r.type==='conversation'?'<div class="ns-fw-actions">'+action('copy','Copy my exact wording',r.id)+action('copy-short','Copy short version',r.id)+'</div>':'')+
    '<section class="ns-fw-panel"><h3>Related material</h3>'+cardSet(related,'Connect an earlier thought, practice or Chapter to keep its context.')+
    '<label class="ns-fw-label"><span>Connect another entry</span><select data-fw-link-select><option value="">Choose a saved entry</option>'+all.filter(x=>x.id!==r.id&&!r.links.includes(x.id)).map(x=>'<option value="'+e(x.id)+'">'+e(x.title)+'</option>').join('')+'</select></label>'+action('link','Connect this entry',r.id)+'</section>'+
    (r.sources.length?'<section class="ns-fw-panel"><h3>Connected saved activities</h3>'+r.sources.map((s,i)=>'<p>'+link(s.href||'#guide',s.title||s.app)+' <small>('+e(s.app)+')</small> <button type="button" class="ns-fw-button" data-fw-action="unlink-source" data-source-index="'+i+'" data-id="'+e(r.id)+'">Unlink</button></p>').join('')+'</section>':'');
 const history='<section class="ns-fw-panel"><h3>Past me / Present me</h3>'+
   (versions.length?'<p>Compare your earlier words with this revision. The app does not decide which one is correct.</p><label class="ns-fw-label"><span>Earlier version</span><select data-fw-version><option value="">Choose a revision</option>'+versions.map((v,i)=>'<option value="'+i+'">'+e(dateLabel(v.at))+' · revision '+v.revision+'</option>').join('')+'</select></label><div data-fw-version-detail></div>':'<p>Your earlier versions will appear here when you revise this page.</p>')+'</section>';
 const events='<section class="ns-fw-panel"><h3>What happened since?</h3>'+
   (r.events||[]).slice().reverse().map(x=>'<div class="ns-fw-event"><small>'+e(dateLabel(x.at))+' · '+e(x.kind)+'</small><p>'+e(x.text)+'</p></div>').join('')+
   '<form data-fw-event data-id="'+e(r.id)+'">'+area('text','Add a reflection or result','',3)+
    '<label class="ns-fw-check"><input type="checkbox" name="done"> Mark this practice or conversation complete</label>'+
    '<button type="submit" class="ns-fw-button">Keep this reflection</button></form></section>';
 const right=heading('A WORKING RECORD','Return, revise, reconnect')+
  '<div class="ns-fw-actions">'+(r.type==='note'?['chapter','practice','conversation','reference'].map(t=>link('#guide/workspace/compose/'+t+'/'+encodeURIComponent(r.id),'Turn into '+t)).join(''):'')+
  (r.type==='chapter'?link('#guide/workspace/compose/practice/'+encodeURIComponent(r.id),'Create a practice'):'' )+
  action('reconsider',"I'm not sure anymore",r.id)+'</div>'+
  (r.type==='chapter'?'<div class="ns-fw-actions">'+CHAPTER_STATES.map(s=>action('status:'+s,s,r.id)).join('')+'</div>':'')+
  (r.dueAt?'<p><b>Revisit:</b> '+e(dateLabel(r.dueAt))+'</p>':'')+
  history+events+
  (sourceChoices(localStorage).length?'<section class="ns-fw-panel"><h3>Connect saved progress</h3><p>Choose an existing lesson, identity practice, map or navigation project. This creates a link only; your original work stays where it is.</p><label class="ns-fw-label"><span>Available saved activities</span><select data-fw-source-select><option value="">Choose an activity</option>'+sourceChoices(localStorage).map((s,i)=>'<option value="'+i+'">'+e(s.app+': '+s.title)+'</option>').join('')+'</select></label>'+action('add-source','Connect activity',r.id)+'</section>':'')+
  '<section class="ns-fw-panel"><h3>Review later</h3><form data-fw-due data-id="'+e(r.id)+'">'+label('dueAt','Choose a date (or clear it)',r.dueAt||'','date')+'<button type="submit" class="ns-fw-button">Save review date</button></form></section>'+
  '<div class="ns-fw-actions">'+action('delete','Delete entry',r.id,'ns-guide6-danger')+link('#guide/workspace/archive','Life Archive')+'</div>'+quickToolsHTML;
 return book(left,right,r.type==='practice'||r.type==='conversation'?'practice':r.type==='self'?'self':r.type==='chapter'?'chapters':'inbox');
}
export function renderWorkspaceFieldGuide(main,parts=[],{quickToolsHTML=''}={}){
 const result=readWorkspace(localStorage);
 if(!result.ok){
   main.innerHTML='<div class="ns-guide6"><section class="ns-guide6-message"><h1>Saved work needs attention</h1><p>'+e(result.error)+'</p><p>Nothing has been overwritten. You can export existing records from Saved work and review the data.</p>'+link('#account/saved','Open Saved work')+'</section></div>';
   return ()=>{};
 }
 const data=result.data,view=parts[0]||'home';
 let screen='';
 if(view==='home')screen=dashboard(data,quickToolsHTML,localStorage);
 else if(['inbox','chapters','self','practice','reference'].includes(view))screen=listPage(data,view,quickToolsHTML);
 else if(view==='archive')screen=archivePage(data,quickToolsHTML);
 else if(view==='search')screen=searchPage(data,quickToolsHTML);
 else if(view==='compose')screen=composePage(data,parts[1]||'note','',parts[2]||'',quickToolsHTML,localStorage);
 else if(view==='edit'){const rec=live(data).find(x=>x.id===parts[1]);screen=composePage(data,rec?.type||'note',rec?.id||parts[1],'',quickToolsHTML,localStorage);}
 else if(view==='record')screen=recordPage(data,parts[1],quickToolsHTML);
 else screen=book(heading('PAGE NOT FOUND','This section is not available'),quickToolsHTML);
 main.innerHTML=screen;
 const controller=new AbortController(),signal=controller.signal;
 const redraw=()=>{controller.abort();renderWorkspaceFieldGuide(main,parts,{quickToolsHTML});};
 const download=(body,name)=>{const u=URL.createObjectURL(new Blob([body],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);};
 // Draft text is written only after the user starts typing. No interpretation is performed.
 const form=main.querySelector('[data-fw-compose]');
 if(form && !form.dataset.id) {
   const draft=drafts()[form.dataset.type];if(draft && !parts[2]){
     for(const [k,v] of Object.entries(draft)){const el=form.elements.namedItem(k);if(el&&el.type!=='checkbox'&&el.name!=='source')el.value=v;}
   }
 }
 main.addEventListener('input',ev=>{
   if(ev.target.closest('[data-fw-quick]')){
     const f=ev.target.closest('form');
     try{keepDraft('quick-dashboard',Object.fromEntries(new FormData(f).entries()));f.querySelector('[data-fw-draft-status]').textContent='Draft saved locally as you type';}catch{}
   }else if(ev.target.closest('[data-fw-compose]')){
     const f=ev.target.closest('form');
     if(f.dataset.id)return;
     try{keepDraft(f.dataset.type,Object.fromEntries(new FormData(f).entries()));f.querySelector('[data-fw-draft-status]').textContent='Draft saved locally as you type';}catch{}
   }
   if(ev.target.id==='ns-fw-search' || ev.target.name==='search-type'){
     const q=(main.querySelector('#ns-fw-search')?.value||'').toLocaleLowerCase(),t=main.querySelector('[name="search-type"]')?.value||'';
     const matches=live(readWorkspace(localStorage,{importLegacy:false}).data).filter(r=>(!t||r.type===t) &&
       [r.title,r.body,r.context,r.usefulWhen,...Object.values(r.fields),...r.history.map(h=>[h.snapshot?.title,h.snapshot?.body].join(' '))].some(x=>String(x).toLocaleLowerCase().includes(q))).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
     const target=main.querySelector('[data-fw-results]');if(target)target.innerHTML=cardSet(matches.slice(0,100),'No matching entries.');
   }
 },{signal});
 main.addEventListener('change',ev=>{
   if(ev.target.matches('[data-fw-version]')){
     const r=live(data).find(x=>x.id===parts[1]),versions=r?.history?.slice().reverse()||[];
     const old=versions[Number(ev.target.value)];
     const box=main.querySelector('[data-fw-version-detail]');
     if(box)box.innerHTML=ev.target.value===''?'':'<div class="ns-fw-compare"><h4>Earlier words · '+e(dateLabel(old.at))+'</h4><strong>'+e(old.snapshot.title)+'</strong><p>'+e(old.snapshot.body)+'</p><h4>Now</h4><strong>'+e(r.title)+'</strong><p>'+e(r.body)+'</p></div>';
   }
 },{signal});
 main.addEventListener('submit',ev=>{
   const form=ev.target;
   if(!form.matches('[data-fw-compose],[data-fw-quick],[data-fw-event],[data-fw-due]'))return;
   ev.preventDefault();
   try {
     const fd=new FormData(form),values=Object.fromEntries(fd.entries());
     if(form.matches('[data-fw-quick]')){
       if(!String(values.body||'').trim())throw Error('Write a thought first.');
       const r=saveRecord(localStorage,'note',{body:values.body,capture:values.capture});
       clearDraft('quick-dashboard');location.hash='#guide/workspace/record/'+encodeURIComponent(r.id);
     } else if(form.matches('[data-fw-compose]')){
       const type=form.dataset.type,id=form.dataset.id||'',fieldValues={};
       for(const [k,v] of Object.entries(values))if(k.startsWith('f_')){fieldValues[k.slice(2)]=v;delete values[k];}
       const current=id?live(readWorkspace(localStorage).data).find(x=>x.id===id):null;
       const sources=sourceChoices(localStorage),chosen=values.source===''?null:sources[Number(values.source)];
       delete values.source;values.fields=fieldValues;values.pinned=fd.has('pinned');
       if(current){values.sources=current.sources;values.links=current.links;values.events=current.events;}
       else if(chosen)values.sources=[chosen];
       if(parts[2] && view==='compose'){
         const seed=live(data).find(x=>x.id===parts[2]);
         if(seed){values.links=[seed.id];if(seed.type==='chapter')values.chapterId=seed.id;}
       }
       const r=saveRecord(localStorage,type,values,id);
       clearDraft(type);
       location.hash='#guide/workspace/record/'+encodeURIComponent(r.id);
     } else if(form.matches('[data-fw-event]')){
       if(!String(values.text||'').trim())throw Error('Write something about what happened.');
       addEvent(localStorage,form.dataset.id,{text:values.text,kind:'reflection',done:fd.has('done')});
       if(fd.has('done'))amendRecord(localStorage,form.dataset.id,{status:'done'});
       redraw();
     } else if(form.matches('[data-fw-due]')){
       amendRecord(localStorage,form.dataset.id,{dueAt:values.dueAt||''});redraw();
     }
   }catch(error){const status=form.querySelector('[data-fw-draft-status]')||main.querySelector('[data-fw-notice]');if(status)status.textContent=error.message;else alert(error.message);}
 },{signal});
 main.addEventListener('click',ev=>{
   const b=ev.target.closest('[data-fw-action]');if(!b)return;
   try{
     const id=b.dataset.id,act=b.dataset.fwAction,r=id?live(readWorkspace(localStorage).data).find(x=>x.id===id):null;
     if(act==='export-all')download(exportWorkspace(localStorage),'nobodys-simple-field-guide-workspace.json');
     else if(act==='export-one')download(exportWorkspace(localStorage,id),'nobodys-simple-record-'+id+'.json');
     else if(act==='copy'||act==='copy-short'){
       const message=act==='copy-short'?r?.fields?.shortVersion||r?.fields?.draftWords:r?.fields?.draftWords||r?.body;
       if(!message)throw Error('No wording has been saved yet.');
       navigator.clipboard.writeText(message).then(()=>{b.textContent='Copied';}).catch(()=>{alert('Copy was unavailable. Select the text in the entry instead.');});
     }else if(act==='delete'){
       if(!confirm('Delete this private record and its revision history? This cannot be undone.'))return;
       deleteRecord(localStorage,id);location.hash='#guide';
     }else if(act==='pin'){amendRecord(localStorage,id,{pinned:!r.pinned});redraw();}
     else if(act==='reconsider'){amendRecord(localStorage,id,{status:'reconsider'});redraw();}
     else if(act.startsWith('status:')){amendRecord(localStorage,id,{status:act.slice(7)});redraw();}
     else if(act.startsWith('stage:')){amendRecord(localStorage,id,{stage:act.slice(6)});redraw();}
     else if(act==='link'){
       const val=main.querySelector('[data-fw-link-select]')?.value;
       if(!val)throw Error('Choose an entry to connect.');
       amendRecord(localStorage,id,{links:r.links.concat(val)});redraw();
     }
   }catch(error){alert(error.message);}
 },{signal});
 // Continue a genuine local draft when navigating back; never overwrite user-saved work.
 const quick=main.querySelector('[data-fw-quick]');
 if(quick){const draft=drafts()['quick-dashboard'];if(draft){quick.elements.namedItem('body').value=draft.body||'';quick.elements.namedItem('capture').value=draft.capture||'quick';}}
 return ()=>controller.abort();
}
