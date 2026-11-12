/* Staff topic writing desk. Browser drafts are private; publication requires
 * the existing owner-scoped GitHub token and explicit Publish confirmation.
 * Preview is generated with exactly the same reading renderer used on site.
 */
import {escapeHTML as esc} from './core.mjs';
import {atlasProblemIndex} from './ns-atlas-core.mjs';
import {NAV_THEMES,topicTheme} from './ns-needs-themes.mjs';
import {emptyTopicManifest,installTopicManifest,normaliseTopicRecord,validateTopicManifest} from './ns-topic-manifest.mjs';
import {workbookForTopic} from './ns-integrated-workbook-data.mjs';
import {topicPageModel} from './ns-topic-reading-data.mjs';
import {renderTopicReadingStart,renderTopicReadingEnd,renderTopicSafetyReading} from './ns-topic-reading-ui.mjs';
import {deckForWorkbook} from './ns-intervention-cards.mjs';
import {promptsForCard} from './ns-intervention-chooser.mjs';
import {tools} from './tool-catalog.mjs';

const e=value=>esc(String(value??''));
const clone=x=>JSON.parse(JSON.stringify(x));
const safeId=value=>String(value||'').toLowerCase().normalize('NFKD')
 .replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,70);
const themeOptions=(selected)=>NAV_THEMES.map(t=>'<option value="'+e(t.id)+'"'+(selected===t.id?' selected':'')+'>'+e(t.title)+'</option>').join('');
const input=(path,label,value,opts={})=>'<label class="ns-desk-field"><span>'+e(label)+'</span>'+
 (opts.long?'<textarea data-desk-field="'+e(path)+'" rows="'+(opts.rows||3)+'" placeholder="'+e(opts.placeholder||'')+'">'+e(value||'')+'</textarea>':
 '<input data-desk-field="'+e(path)+'" type="text" value="'+e(value||'')+'" maxlength="'+(opts.max||2000)+'" placeholder="'+e(opts.placeholder||'')+'">')+
 (opts.hint?'<small>'+e(opts.hint)+'</small>':'')+'</label>';
const arrayLabels={
 'guide.recognise':['Recognisable experience','A sentence someone might recognise'],
 'guide.contributors':['Possible influences','A context, health or social factor to consider'],
 'guide.goals':['Possible goals','One voluntary, practical goal'],
 'guide.cautions':['Cautions','A concrete risk, boundary or exclusion'],
 'editorial.recognition':['Opening recognition','A sentence speaking to what someone may experience'],
 'editorial.progress':['Progress markers','A realistic indicator of improved access, autonomy or functioning']
};
const pairLabels={
 'guide.mechanisms':['Possible processes','Label','Explanation'],
 'editorial.core':['Four parts of the picture','Short heading','What this may mean'],
 'editorial.traps':['Common pitfalls','Pitfall or misconception','A balanced alternative'],
 'editorial.steps':['Four possible directions','Direction','What this involves'],
 'editorial.faq':['Common questions','Question','Answer']
};
const readPath=(object,path)=>path.split('.').reduce((value,key)=>value?.[key],object);
const assignPath=(object,path,value)=>{
 const keys=path.split('.');const last=keys.pop();
 let target=object;for(const key of keys)target=target[key] ||= {};
 target[last]=value;
};
const textAreaLines=(value,max=6)=>String(value||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean).slice(0,max);
const listGroup=(path,items,isPair=false)=>{
 const info=(isPair?pairLabels:arrayLabels)[path],fields=isPair?
  path==='editorial.faq'?['question','answer']:
  path==='guide.mechanisms'?['label','detail','target']:['label','detail']:[];
 const rows=(items||[]).map((item,index)=>'<div class="ns-desk-list-row" data-desk-row="'+e(path)+'" data-desk-index="'+index+'">'+
   (isPair?fields.map((field,j)=>input('','',item?.[field]||'',{placeholder:j===0?info[1]:j===1?info[2]:'Optional focus',long:j>0,rows:2})
      .replace('data-desk-field=""','data-desk-list="'+e(path)+'" data-desk-index="'+index+'" data-desk-key="'+field+'"')).join(''):
     '<textarea data-desk-list="'+e(path)+'" data-desk-index="'+index+'" data-desk-key="value" rows="2" placeholder="'+e(info[1])+'">'+e(item||'')+'</textarea>')+
   '<button type="button" class="ns-desk-mini danger" data-desk-remove="'+e(path)+'" data-desk-index="'+index+'" aria-label="Remove item">×</button></div>').join('');
 return '<div class="ns-desk-list-group" data-desk-list-group="'+e(path)+'"><div class="ns-desk-list-header">'+
  '<strong>'+e(info[0])+'</strong><button type="button" class="ns-desk-mini" data-desk-add="'+e(path)+'">＋ Add</button></div>'+
  '<div class="ns-desk-list-rows">'+rows+'</div></div>';
};
const modeExamples=Object.freeze([
 ['intro','The opening'],['understand','Understanding'],['next','Ways forward'],['answers','Questions & support'],['tools','Tools & journal']
]);
function makeOriginalDraft(entry){
 const g=workbookForTopic(entry.id),m=topicPageModel(g);
 if(!g||!m)throw Error('Original guide is unavailable.');
 const original={
  id:entry.id,kind:'override',status:'published',theme:topicTheme(entry),
  title:entry.title,hint:entry.hint,updatedAt:'',
  guide:{lead:g.lead||'',what:g.what||'',cycle:g.cycle||'',
   recognise:[...(g.recognise||[])],contributors:[...(g.contributors||[])],
   goals:[...(g.goals||[])],progress:g.progress||'',
   cautions:[...(g.cautions||[])],mechanisms:(g.mechanisms||[]).map(x=>({
    label:x.label,detail:x.detail,target:x.target||''
   }))},
  editorial:{
   recognition:[...m.recognition],reframe:m.reframe,core:m.core.map(x=>({...x})),
   traps:m.traps.map(x=>({label:x[0],detail:x[1]})),
   steps:m.steps.map(x=>({...x})),progress:[...m.progress],
   faq:m.faq.map(x=>({question:x[0],answer:x[1]})),
   supportText:m.supportText,closing:m.closing
  },
  source:g.sources?.[0]?{name:g.sources[0].name,url:g.sources[0].url}:null,
  methods:[]
 };
 return original;
}
function newDraft(){
 const id='new-topic-'+Date.now().toString(36);
 return {id,kind:'new',status:'published',theme:'growth',domain:'growth',
  title:'',hint:'',safetyFirst:false,supportFirst:false,medical:false,
  updatedAt:'',guide:{lead:'',what:'',cycle:'',recognise:[],contributors:[],goals:[],progress:'',
   cautions:[],mechanisms:[]},
  editorial:{recognition:[],reframe:'',core:[],traps:[],steps:[],progress:[],faq:[],
    supportText:'',closing:''},source:null,methods:[]};
}
export class TopicStudio{
 constructor({root,publisher,dbAll,dbPut,dbDelete,notify}){
  this.root=root;this.publisher=publisher;this.dbAll=dbAll;this.dbPut=dbPut;
  this.dbDelete=dbDelete;this.notify=notify||(()=>{});
  this.remote=emptyTopicManifest();this.sha=null;this.drafts=[];
  this.current=null;this.originalId='';this.activeTab='intro';this.methodId='';
  this.methodDraft=null;this.timer=0;this.busy=false;this.initialized=false;
  this.root.addEventListener('click',e=>this.handleClick(e));
  this.root.addEventListener('input',e=>this.handleInput(e));
  this.root.addEventListener('change',e=>this.handleChange(e));
 }
 node(selector){return this.root.querySelector(selector);}
 async open({refresh=false}={}){
  if(this.initialized&&!refresh){this.root.hidden=false;return;}
  this.root.innerHTML='<p class="ns-desk-state" role="status">Opening the topic library…</p>';
  try{
   const snapshot=await this.publisher.topicSnapshot();
   this.remote=validateTopicManifest(snapshot.data,{existingIds:new Set(atlasProblemIndex.map(p=>p.id))});
   this.sha=snapshot.sha;
   try{this.drafts=await this.dbAll('topicDrafts');}
   catch{this.drafts=[];this.notify('Local topic drafts could not be read; export your work before leaving.',true);}
   this.initialized=true;this.renderShell();this.renderLibrary();
  }catch(error){
   this.root.innerHTML='<div class="ns-desk-state"><h2>Topic library unavailable</h2><p>'+e(error.message)+'</p><button type="button" data-desk-reload>Try again</button></div>';
  }
 }
 disconnect(){clearTimeout(this.timer);this.current=null;this.publisher=null;this.root.innerHTML='';this.initialized=false;}
 topicEntries(){
  const base=atlasProblemIndex.map(p=>({id:p.id,title:p.title,hint:p.hint,theme:topicTheme(p)}));
  const inBase=new Set(base.map(x=>x.id));
  const newPublished=this.remote.topics.filter(p=>p.kind==='new').map(p=>({
   id:p.id,title:p.title||p.id,hint:p.hint,theme:p.theme
  }));
  const additions=[...base,...newPublished.filter(p=>!inBase.has(p.id))];
  return additions.map(p=>{
   const remote=this.remote.topics.find(r=>r.id===p.id);
   const draft=this.drafts.find(r=>r.id===p.id);
   return {...p,title:draft?.record?.title||remote?.title||p.title,
    theme:draft?.record?.theme||remote?.theme||p.theme,
    isDraft:Boolean(draft),isDeleted:remote?.status==='deleted'
   };
  }).sort((a,b)=>a.title.localeCompare(b.title));
 }
 renderShell(){
  this.root.hidden=false;
  this.root.innerHTML='<div class="ns-desk-shell">'+
   '<header class="ns-desk-header"><div><p class="eyebrow">NOBODY’S SIMPLE · THE WRITING DESK</p>'+
   '<h1>Topic pages</h1><p>Write and improve the psychology library. Preview as you type; publish explicitly when ready.</p></div>'+
   '<div class="ns-desk-top-actions"><button type="button" class="chip" data-desk-reload>↻ Refresh</button>'+
   '<button type="button" class="button" data-desk-create>＋ New topic</button></div></header>'+
   '<div class="ns-desk-grid">'+
   '<aside class="ns-desk-library"><label>Find a topic<input type="search" data-desk-search placeholder="Search 518+ guides…"></label>'+
   '<label>Theme<select data-desk-filter-theme><option value="">Every theme</option>'+themeOptions('')+'</select></label>'+
   '<p class="ns-desk-library-count" data-desk-count></p><div class="ns-desk-library-results" data-desk-results role="list"></div></aside>'+
   '<main class="ns-desk-workspace" data-desk-workspace><div class="ns-desk-empty">✦<h2>A place for thoughtful writing</h2>'+
   '<p>Choose an existing topic, or create a new one. Your changes remain local until you publish to GitHub.</p></div></main>'+
   '</div></div>';
 }
 renderLibrary(){
  if(!this.initialized)return;
  const query=(this.node('[data-desk-search]')?.value||'').trim().toLowerCase();
  const filter=this.node('[data-desk-filter-theme]')?.value||'';
  const entries=this.topicEntries().filter(p=>(!filter||filter===p.theme)&&
   (!query||[p.title,p.id,p.hint,p.theme].join(' ').toLowerCase().includes(query)));
  this.node('[data-desk-count]').textContent=entries.length+' topics'+(this.drafts.length?' · '+this.drafts.length+' local drafts':'');
  this.node('[data-desk-results]').innerHTML=entries.slice(0,600).map(p=>
   '<button type="button" role="listitem" data-desk-open="'+e(p.id)+'" class="ns-desk-topic-row'+
   (this.current?.id===p.id?' is-current':'')+'"><strong>'+e(p.title||p.id)+'</strong><small>'+
   e(NAV_THEMES.find(t=>t.id===p.theme)?.title||p.theme)+
   (p.isDraft?' · Local draft':'')+(p.isDeleted?' · Hidden from site':'')+'</small></button>').join('')||
   '<p class="ns-desk-muted">No matching topics. Try another search.</p>';
 }
 async openTopic(id){
  if(this.busy)return;
  await this.saveLocal({silent:true});
  const draft=this.drafts.find(x=>x.id===id);
  const remote=this.remote.topics.find(x=>x.id===id);
  const base=atlasProblemIndex.find(x=>x.id===id);
  installTopicManifest(this.remote);
  try{
   this.current=clone(draft?.record||remote||(base?makeOriginalDraft(base):null));
   if(!this.current)throw Error('Topic not found in the library.');
   this.originalId=id;this.methodId='';this.methodDraft=null;this.activeTab='intro';
   this.renderEditor();this.renderLibrary();this.updatePreview();
  }catch(error){this.notify(error.message,true);}
 }
 async createTopic(){
  await this.saveLocal({silent:true});
  this.current=newDraft();this.originalId=this.current.id;
  this.methodId='';this.methodDraft=null;this.activeTab='intro';
  this.renderEditor();this.renderLibrary();this.updatePreview();
  this.node('[data-desk-field="title"]')?.focus();
 }
 formTab(id){
  const selected=id===this.activeTab;
  return '<button type="button" data-desk-tab="'+id+'" aria-pressed="'+selected+'">'+
   e(modeExamples.find(x=>x[0]===id)?.[1]||id)+'</button>';
 }
 renderEditor(){
  const record=this.current;if(!record)return;
  const base=atlasProblemIndex.some(p=>p.id===record.id),original=this.remote.topics.find(x=>x.id===record.id);
  const title=record.title||'Untitled page';
  const isLive=original?.status==='published';
  const panel=(id,body)=>'<section class="ns-desk-tab-panel" data-desk-panel="'+id+'"'+(this.activeTab===id?'':' hidden')+'>'+body+'</section>';
  const primary=panel('intro',
   '<p class="ns-desk-panel-intro">Start with the words a person needs to read when they first arrive.</p>'+
   input('guide.lead','Short welcome or subtitle',record.guide.lead,{long:true,rows:2})+
   input('hint','Topic card summary',record.hint,{long:true,rows:2})+
   input('guide.what','What is this experience?',record.guide.what,{long:true,rows:5})+
   input('editorial.reframe','The central idea',record.editorial.reframe,{long:true,rows:4})+
   listGroup('editorial.recognition',record.editorial.recognition)+
   input('guide.cycle','One possible pattern (not a diagnosis)',record.guide.cycle,{long:true,rows:3})+
   listGroup('guide.recognise',record.guide.recognise)
  );
  const understanding=panel('understand',
   '<p class="ns-desk-panel-intro">Explain without assuming one cause. The four parts can describe context rather than injury or recovery.</p>'+
   listGroup('editorial.core',record.editorial.core,true)+
   listGroup('guide.mechanisms',record.guide.mechanisms,true)+
   listGroup('guide.contributors',record.guide.contributors)+
   listGroup('editorial.traps',record.editorial.traps,true)+
   listGroup('guide.cautions',record.guide.cautions)
  );
  const next=panel('next',
   '<p class="ns-desk-panel-intro">Offer options, not compulsory stages or promised outcomes.</p>'+
   listGroup('editorial.steps',record.editorial.steps,true)+
   listGroup('guide.goals',record.guide.goals)+
   input('guide.progress','General context for progress',record.guide.progress,{long:true,rows:3})+
   listGroup('editorial.progress',record.editorial.progress)
  );
  const answers=panel('answers',
   '<p class="ns-desk-panel-intro">Answer what people quietly wonder. Keep sources, context and uncertainty visible.</p>'+
   listGroup('editorial.faq',record.editorial.faq,true)+
   input('editorial.supportText','When to seek additional support',record.editorial.supportText,{long:true,rows:4})+
   input('editorial.closing','A gentle ending',record.editorial.closing,{long:true,rows:4})+
   input('source.name','Reference organisation',record.source?.name||'')+
   input('source.url','Reference URL (https)',record.source?.url||'',{max:500})
  );
  const method=panel('tools',
   '<p class="ns-desk-panel-intro">Preserve the existing working games and journals. Edit their educational text and guided questions here, or add an optional approach linked to a supported tool.</p>'+
   '<div class="ns-desk-method-toolbar"><label>Choose an approach to edit<select data-desk-method-select></select></label>'+
   '<button type="button" class="chip" data-desk-new-method>＋ New guided approach</button></div>'+
   '<div data-desk-method-editor></div>'
  );
  this.node('[data-desk-workspace]').innerHTML=
   '<div class="ns-desk-editor-head"><button type="button" data-desk-close>← Topic library</button>'+
   '<span class="ns-desk-status" data-desk-status role="status">'+(isLive?'Editing live page':'Local edits')+'</span></div>'+
   '<div class="ns-desk-editor-heading"><div><p class="eyebrow">'+(record.kind==='new'?'NEW GUIDE':'EDIT TOPIC')+'</p>'+
   '<h2>'+e(title)+'</h2><p>Changes appear in the preview, but only publishing updates the website.</p></div>'+
   '<a target="_blank" rel="noopener noreferrer" href="index.html#workbook-topic/'+encodeURIComponent(record.id)+'">Open current site ↗</a></div>'+
   '<div class="ns-desk-controls">'+
   input('title','Page title',record.title,{placeholder:'Use the words someone would search for',max:200})+
   '<label class="ns-desk-field"><span>Theme</span><select data-desk-field="theme">'+themeOptions(record.theme)+'</select></label>'+
   (record.kind==='new'?'<label class="ns-desk-field"><span>URL identifier</span><input data-desk-field="id" value="'+e(record.id)+'" '+(original?'disabled':'')+'></label>':
   '<p class="ns-desk-muted">Permanent topic address: <code>#workbook-topic/'+e(record.id)+'</code></p>')+
   '</div>'+
   '<div class="ns-desk-tab-buttons" role="group" aria-label="Topic writing sections">'+modeExamples.map(([id])=>this.formTab(id)).join('')+'</div>'+
   '<div class="ns-desk-writing-grid"><div class="ns-desk-form ns-desk-notepad">'+
   primary+understanding+next+answers+method+
   '</div><aside class="ns-desk-preview-panel"><div class="ns-desk-preview-head"><strong>Live writing preview</strong>'+
   '<span>Just the reader view · Not published</span></div><div class="ns-desk-preview-paper" data-desk-preview></div></aside></div>'+
   '<div class="ns-desk-editor-footer"><div><p class="ns-desk-validation" data-desk-validation role="status"></p>'+
   '<small>GitHub Pages may take time to deploy. Open visitors see changes after refresh.</small></div>'+
   '<div class="ns-desk-footer-actions"><button type="button" class="chip" data-desk-save>Save local draft</button>'+
   '<button type="button" class="chip" data-desk-export>Export JSON</button>'+
   '<button type="button" class="button" data-desk-publish>Publish changes</button>'+
   '<button type="button" class="chip danger-chip" data-desk-delete>'+(record.status==='deleted'?'Restore topic':'Hide from website')+'</button></div></div>';
  this.renderMethodSelect();
 }
 renderTab(id){
  if(!modeExamples.some(x=>x[0]===id))return;
  this.activeTab=id;
  this.root.querySelectorAll('[data-desk-tab]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.deskTab===id)));
  this.root.querySelectorAll('[data-desk-panel]').forEach(p=>p.hidden=p.dataset.deskPanel!==id);
 }
 renderList(path){
  const container=this.node('[data-desk-list-group="'+path+'"]');
  if(!container)return;
  const newer=listGroup(path,readPath(this.current,path),Boolean(pairLabels[path]));
  const wrapper=document.createElement('div');wrapper.innerHTML=newer;
  container.replaceWith(wrapper.firstElementChild);
 }
 makeGuideForPreview(){
  const base=this.remote.topics.filter(x=>x.id!==this.originalId);
  const record=normaliseTopicRecord({...this.current,status:'published'});
  installTopicManifest({version:1,topics:[...base,record]});
  const guide=workbookForTopic(record.id);
  if(!guide)throw Error('This topic cannot be previewed. Check the title, ID and source content.');
  return guide;
 }
 updatePreview(){
  if(!this.current||!this.node('[data-desk-preview]'))return;
  try{
   const guide=this.makeGuideForPreview();
   const core=guide.safetyFirst?renderTopicSafetyReading(guide):
    renderTopicReadingStart(guide)+
    '<div class="ns-desk-preview-divider">INTERACTIVE APPROACHES & EXISTING JOURNAL</div>'+
    renderTopicReadingEnd(guide);
   this.node('[data-desk-preview]').innerHTML=
    '<p class="ns-desk-preview-kicker">NOBODY’S SIMPLE · YOUR FIELD GUIDE</p>'+
    '<h1>'+e(guide.title)+'</h1><p class="ns-desk-preview-lead">'+e(guide.lead)+'</p>'+
    '<div class="ns-topic-reading ns-desk-preview-content">'+core+'</div>';
   this.node('[data-desk-validation]').textContent='Preview ready. Continue editing or save a local draft.';
   this.node('[data-desk-validation]').dataset.error='';
  }catch(error){
   this.node('[data-desk-preview]').innerHTML='<div class="ns-desk-preview-empty">✦<h3>Your page is taking shape</h3>'+
    '<p>Complete the title, short description, main idea and theme to see the finished reader view.</p></div>';
   this.node('[data-desk-validation]').textContent=error.message;
   this.node('[data-desk-validation]').dataset.error='true';
  }
 }
 schedule(){
  clearTimeout(this.timer);
  this.timer=setTimeout(()=>{this.updatePreview();void this.saveLocal({silent:true});},450);
  const node=this.node('[data-desk-status]');if(node)node.textContent='Unsaved changes';
 }
 async saveLocal({silent=false}={}){
  if(!this.current||!this.dbPut)return;
  const saved={id:this.current.id,record:clone(this.current),savedAt:new Date().toISOString()};
  try{
   // Delete a renamed draft's old local key so it does not fork a second page.
   if(this.originalId&&this.originalId!==saved.id){
    await this.dbDelete('topicDrafts',this.originalId);
    this.originalId=saved.id;
   }
   await this.dbPut('topicDrafts',saved);
   this.drafts=this.drafts.filter(x=>x.id!==saved.id).concat([saved]);
   if(!silent)this.notify('Topic draft saved privately on this device.');
   this.renderLibrary();
   const status=this.node('[data-desk-status]');if(status)status.textContent='Draft saved on this device';
  }catch(error){this.notify('Could not save this draft: '+error.message,true);}
 }
 validatePublish(){
  if(!this.current)throw Error('Select a page before publishing.');
  if(this.current.kind==='new'&&(!this.current.title.trim()||!this.current.hint.trim()))
   throw Error('Write a clear title and short description for the new topic.');
  const r=normaliseTopicRecord({...this.current,status:'published'});
  if(r.editorial.core.length!==4||r.editorial.steps.length!==4)
   throw Error('Write four distinct parts of the explanation and four realistic ways forward.');
  if(r.editorial.recognition.length<2||r.editorial.faq.length<2)
   throw Error('Add at least two recognition examples and two frequently asked questions.');
  if(r.editorial.faq.some(f=>!f.question||!f.answer)||r.editorial.core.some(f=>!f.label||!f.detail)||
   r.editorial.steps.some(f=>!f.label||!f.detail))
   throw Error('Complete each heading and explanation; blank paired items cannot be published.');
  if(r.kind==='new'&&!r.guide.what.trim())throw Error('New topics require an accurate description of the experience.');
  if(r.methods.some(m=>!m.title||!m.why||m.steps.length<2))
   throw Error('Complete the title, rationale and at least two steps for every edited or new approach.');
  return r;
 }
 async publish(){
  if(this.busy||!this.current)return;
  await this.saveLocal({silent:true});
  let record;
  try{record=this.validatePublish();}
  catch(error){this.notify(error.message,true);this.node('[data-desk-validation]').textContent=error.message;return;}
  if(!confirm('Publish these topic changes to the public website? This will update the GitHub content catalogue.'))return;
  const next={version:1,topics:[...this.remote.topics.filter(x=>x.id!==this.originalId&&x.id!==record.id),record]};
  try{
   validateTopicManifest(next,{existingIds:new Set(atlasProblemIndex.map(p=>p.id))});
   this.busy=true;this.node('[data-desk-publish]').disabled=true;
   this.node('[data-desk-status]').textContent='Publishing to GitHub…';
   const result=await this.publisher.publishTopics(next,this.sha);
   this.sha=result.sha;this.remote=result.data;
   await this.dbDelete('topicDrafts',this.originalId);await this.dbDelete('topicDrafts',record.id);
   this.drafts=this.drafts.filter(x=>x.id!==record.id&&x.id!==this.originalId);
   this.originalId=record.id;this.current=clone(record);
   this.renderEditor();this.renderLibrary();this.updatePreview();
   this.node('[data-desk-status]').textContent='Published to GitHub';
   this.notify('Published to GitHub. Your live site will update after deployment and refresh.');
  }catch(error){this.notify('Publication failed: '+error.message,true);
   this.node('[data-desk-status]').textContent='Publish failed · draft retained';
  }finally{this.busy=false;const b=this.node('[data-desk-publish]');if(b)b.disabled=false;}
 }
 async hideOrRestore(){
  if(!this.current||this.busy)return;
  const hiding=this.current.status!=='deleted';
  if(!confirm(hiding?'Hide this topic from all public navigation and direct topic routes? You can restore it from this desk.':
   'Restore this topic to the public website?'))return;
  await this.saveLocal({silent:true});
  const r=normaliseTopicRecord({...this.current,status:hiding?'deleted':'published'});
  const next={version:1,topics:[...this.remote.topics.filter(x=>x.id!==this.originalId&&x.id!==r.id),r]};
  try{
   this.busy=true;
   const result=await this.publisher.publishTopics(next,this.sha);
   this.sha=result.sha;this.remote=result.data;this.current=clone(r);
   await this.dbDelete('topicDrafts',this.originalId);
   this.drafts=this.drafts.filter(x=>x.id!==this.originalId);
   this.renderEditor();this.renderLibrary();this.updatePreview();
   this.notify(hiding?'Topic hidden from the published catalogue.':'Topic restored to the published catalogue.');
  }catch(error){this.notify('Could not change visibility: '+error.message,true);}
  finally{this.busy=false;}
 }
 exportCurrent(){
  if(!this.current)return;
  const blob=new Blob([JSON.stringify(this.current,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),link=document.createElement('a');
  link.href=url;link.download=(this.current.id||'topic')+'.json';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 renderMethodSelect(){
  const select=this.node('[data-desk-method-select]');if(!select||!this.current)return;
  let guide=null;try{guide=this.makeGuideForPreview();}catch{}
  const cards=guide?deckForWorkbook(guide):[];
  select.innerHTML='<option value="">Choose a current approach…</option>'+
   cards.map(c=>'<option value="'+e(c.id)+'">'+e(c.title)+'</option>').join('');
  if(this.methodId&&cards.some(c=>c.id===this.methodId))select.value=this.methodId;
  if(this.methodId)this.renderMethodEditor();
 }
 currentMethod(){
  return this.current?.methods?.find(x=>x.id===this.methodId)||null;
 }
 beginMethodEdit(id){
  let guide=null;try{guide=this.makeGuideForPreview();}catch{}
  const card=guide?deckForWorkbook(guide).find(c=>c.id===id):null;
  if(!card)return;
  let method=this.current.methods.find(m=>m.id===id);
  if(!method){
   method={id,type:'override',title:card.title,why:card.why,
    steps:[...card.steps],caution:card.caution||'',
    prompts:promptsForCard(card).map(([key,label,hint])=>({id:key,label,hint}))};
   this.current.methods.push(method);
  }
  this.methodId=id;this.methodDraft=method;this.renderMethodEditor();this.schedule();
 }
 addMethod(){
  const id='custom-'+Date.now().toString(36);
  const method={id,type:'new',title:'New guided approach',
   kind:'behaviour',worksheet:'step',tool:'',
   why:'An optional, practical reflection for this topic.',
   steps:['Choose a safe and voluntary step.','Reflect on whether the result fits your needs.'],
   caution:'This staff-authored method has not been independently validated.',
   prompts:[{id:'question-0',label:'What would you like to try?',hint:'Only if helpful…'},
    {id:'question-1',label:'What would make this safe and workable?',hint:'Consider resources and constraints.'}]};
  this.current.methods.push(method);
  this.methodId=id;this.methodDraft=method;this.renderMethodSelect();this.schedule();
 }
 renderMethodEditor(){
  const host=this.node('[data-desk-method-editor]');if(!host)return;
  const m=this.currentMethod();
  if(!m){host.innerHTML='<p class="ns-desk-muted">Select an existing card to edit its instructions, or add a new guided approach.</p>';return;}
  host.innerHTML='<div class="ns-desk-method-paper"><div class="ns-desk-method-label">'+
   (m.type==='new'?'NEW OPTIONAL APPROACH':'EDIT EXISTING APPROACH')+
   '<button type="button" class="ns-desk-mini danger" data-desk-method-remove>'+(m.type==='new'?'Remove':'Revert changes')+'</button></div>'+
   input('method.title','Approach title',m.title)+
   input('method.why','Why might it help?',m.why,{long:true,rows:3})+
   input('method.steps','Step-by-step instructions',m.steps.join('\n'),{long:true,rows:4,hint:'One step per line'})+
   input('method.caution','When to adapt or skip',m.caution,{long:true,rows:3})+
   (m.type==='new'?'<label class="ns-desk-field"><span>Method family</span><select data-desk-method-field="kind">'+
     ['environment','behaviour','planning','cognitive','observe','dbt','acceptance','compassion','support'].map(kind=>
      '<option value="'+kind+'"'+(m.kind===kind?' selected':'')+'>'+kind+'</option>').join('')+'</select></label>'+
    '<label class="ns-desk-field"><span>Worksheet format</span><select data-desk-method-field="worksheet">'+
     ['environment','step','thought','ground','values','request','pause','needs','compassion','control','track','plan','rest','conversation'].map(kind=>
      '<option value="'+kind+'"'+(m.worksheet===kind?' selected':'')+'>'+kind+'</option>').join('')+'</select></label>'+
    '<label class="ns-desk-field"><span>Optional existing interactive tool</span><select data-desk-method-field="tool">'+
     '<option value="">No extra interactive tool</option>'+tools.map(tool=>'<option value="'+e(tool.id)+'"'+(m.tool===tool.id?' selected':'')+'>'+e(tool.title||tool.name||tool.id)+'</option>').join('')+'</select></label>':'')+
   '<div class="ns-desk-prompt-list"><strong>Guided journal questions</strong>'+
   '<p class="ns-desk-muted">Up to three questions. These replace the default questions for this approach; answers remain private to the reader’s open page.</p>'+
   [0,1,2].map(i=>'<div class="ns-desk-prompt-row">'+
    input('', 'Question '+(i+1),m.prompts?.[i]?.label||'',{placeholder:'An optional reflection question'}).replace('data-desk-field=""','data-desk-method-prompt="'+i+'" data-desk-method-prompt-key="label"')+
    input('', 'Hint',m.prompts?.[i]?.hint||'',{placeholder:'A gentle example or explanation'}).replace('data-desk-field=""','data-desk-method-prompt="'+i+'" data-desk-method-prompt-key="hint"')+
    '</div>').join('')+'</div>'+
   '</div>';
 }
 changeMethodField(el){
  const m=this.currentMethod();if(!m)return;
  if(el.dataset.deskMethodPrompt!==undefined){
   const i=Number(el.dataset.deskMethodPrompt),key=el.dataset.deskMethodPromptKey;
   m.prompts||=[];while(m.prompts.length<=i)m.prompts.push({id:'question-'+m.prompts.length,label:'',hint:''});
   m.prompts[i][key]=el.value;
  }else{
   const prop=el.dataset.deskMethodField||el.dataset.deskField?.slice(7);
   if(!prop)return;
   m[prop]=prop==='steps'?textAreaLines(el.value):el.value;
  }
  this.schedule();
 }
 async handleClick(event){
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-desk-reload')){
   if(this.current&&!confirm('Refresh GitHub topics? Your local draft remains on this device.'))return;
   await this.saveLocal({silent:true});this.initialized=false;await this.open({refresh:true});return;
  }
  if(button.hasAttribute('data-desk-create')){await this.createTopic();return;}
  if(button.dataset.deskOpen){await this.openTopic(button.dataset.deskOpen);return;}
  if(button.dataset.deskTab){this.renderTab(button.dataset.deskTab);return;}
  if(button.hasAttribute('data-desk-close')){await this.saveLocal({silent:true});this.current=null;
   this.node('[data-desk-workspace]').innerHTML='<div class="ns-desk-empty">✦<h2>Choose a topic to begin</h2></div>';
   this.renderLibrary();return;}
  if(button.dataset.deskAdd){
   const path=button.dataset.deskAdd,items=readPath(this.current,path);if(!Array.isArray(items))return;
   if(items.length>=(path.startsWith('editorial.core')||path.startsWith('editorial.steps')?4:12))return;
   items.push(pairLabels[path]?(path==='editorial.faq'?{question:'',answer:''}:
    path==='guide.mechanisms'?{label:'',detail:'',target:''}:{label:'',detail:''}):'');
   this.renderList(path);this.schedule();return;
  }
  if(button.dataset.deskRemove){
   const items=readPath(this.current,button.dataset.deskRemove);
   if(Array.isArray(items))items.splice(Number(button.dataset.deskIndex),1);
   this.renderList(button.dataset.deskRemove);this.schedule();return;
  }
  if(button.hasAttribute('data-desk-new-method')){this.addMethod();return;}
  if(button.hasAttribute('data-desk-method-remove')){
   this.current.methods=this.current.methods.filter(m=>m.id!==this.methodId);
   this.methodId='';this.renderMethodSelect();this.schedule();return;
  }
  if(button.hasAttribute('data-desk-save')){await this.saveLocal();return;}
  if(button.hasAttribute('data-desk-export')){this.exportCurrent();return;}
  if(button.hasAttribute('data-desk-publish')){await this.publish();return;}
  if(button.hasAttribute('data-desk-delete')){await this.hideOrRestore();return;}
 }
 handleInput(event){
  const target=event.target;
  if(target.matches('[data-desk-search]')){this.renderLibrary();return;}
  if(!this.current)return;
  if(target.dataset.deskMethodField||target.dataset.deskMethodPrompt!==undefined||
   target.dataset.deskField?.startsWith('method.')){this.changeMethodField(target);return;}
  if(target.dataset.deskList){
   const items=readPath(this.current,target.dataset.deskList),index=Number(target.dataset.deskIndex);
   if(Array.isArray(items)&&items[index]!==undefined){
    if(target.dataset.deskKey==='value')items[index]=target.value;
    else items[index][target.dataset.deskKey]=target.value;
   }
   this.schedule();return;
  }
  if(target.dataset.deskField){
   const field=target.dataset.deskField;
   if(field==='id'&&this.remote.topics.some(x=>x.id===this.originalId))return;
   if(field==='id')this.current.id=safeId(target.value)||this.current.id;
   else if(field==='source.name'||field==='source.url'){
    this.current.source||={name:'',url:''};assignPath(this.current,field,target.value);
   }else assignPath(this.current,field,target.value);
   if(field==='title')this.node('.ns-desk-editor-heading h2').textContent=target.value||'Untitled page';
   this.schedule();
  }
 }
 handleChange(event){
  const target=event.target;
  if(target.matches('[data-desk-filter-theme]')){this.renderLibrary();return;}
  if(target.matches('[data-desk-method-select]')){
   this.methodId=target.value;
   if(this.methodId)this.beginMethodEdit(this.methodId);
   else this.renderMethodEditor();
   return;
  }
  if(target.dataset.deskMethodField||target.dataset.deskField==='theme')this.handleInput(event);
 }
}
