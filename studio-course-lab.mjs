/**
 * Nobody's Simple Course Lab. Authenticated staff-only authoring, using the
 * existing in-memory GitHub Publisher. Drafts stay local; published JSON is
 * written by owner-authorised GitHub commits. No secret is stored.
 */
import {LEARN_COURSES} from './ns-learn-catalog-v2.mjs';
import {COURSE_LAB_TYPES,createCourseDraft,newCourseUnit,newCourseLesson,createCourseNode,
 makeCourseId,validateCourseForPublish,safeCourseImage} from './ns-course-lab-schema.mjs';
import {renderLearnLesson} from './ns-learn-player-v2.mjs';
import {readCourseLabDraft,saveCourseLabDraft,deleteCourseLabDraft} from './studio-course-lab-drafts.mjs';
import {fetchCurriculumBlueprint,createDraftFromBlueprint,mergePublishedIntoBlueprint,countAuthoredLessons,makePublishableSubset} from './ns-course-blueprints.mjs';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const types=Object.fromEntries(COURSE_LAB_TYPES.map(x=>[x.id,x]));
const key=id=>'ns-course-lab-draft-v1:'+id;
const deep=x=>JSON.parse(JSON.stringify(x));
const options=(xs,selected)=>xs.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===selected?' selected':'')+'>'+esc(x.label)+'</option>').join('');
const textField=(label,prop,value,{rows=0,hint='',type='text'}={})=>'<label class="cl-field"><span>'+esc(label)+'</span>'+(rows?
 '<textarea data-field="'+esc(prop)+'" rows="'+rows+'">'+esc(value||'')+'</textarea>':
 '<input data-field="'+esc(prop)+'" type="'+type+'" value="'+esc(value||'')+'">')+(hint?'<small>'+esc(hint)+'</small>':'')+'</label>';
const selectField=(label,prop,choices,value)=>'<label class="cl-field"><span>'+esc(label)+'</span><select data-field="'+esc(prop)+'"><option value="">Choose…</option>'+options(choices,value)+'</select></label>';
const listName=(node,k)=>({pairs:'Pairs to match',categories:'Categories',items:'Statements to sort',segments:'Selectable evidence phrases',options:'Answer choices',steps:'Correct sequence',changes:'Possible changes',outcomes:'Possible outcomes',evidenceOptions:'Evidence choices',responseOptions:'Response choices'})[k]||k;
const listFields=(key)=>key==='pairs'?[['label','Statement'],['answer','Matching concept']]:
 key==='segments'?[['text','Phrase']]:
 key==='items'?[['label','Example']]:[['label','Text']];
function itemList(node,key){
 const data=node[key]||[];
 const extra=key==='items'?'<span>Correct category</span>':key==='segments'?'<span>Mark evidence</span>':'';
 return '<section class="cl-list"><div class="cl-list-title"><strong>'+listName(node,key)+'</strong><button type="button" data-act="add-row" data-list="'+key+'">＋ Add</button></div>'+
 data.map((o,i)=>'<div class="cl-row"><span class="cl-row-number">'+(i+1)+'</span>'+
 listFields(key).map(([field,name])=>'<label><span>'+esc(name)+'</span><input data-list="'+key+'" data-pos="'+i+'" data-prop="'+field+'" value="'+esc(o[field]||'')+'"></label>').join('')+
 (key==='items'?'<label><span>Category</span><select data-list="'+key+'" data-pos="'+i+'" data-prop="answer"><option value="">Choose…</option>'+options(node.categories||[],o.answer)+'</select></label>':'')+
 (key==='segments'?'<label class="cl-check"><input type="checkbox" data-list="'+key+'" data-pos="'+i+'" data-prop="answer" '+(o.answer?'checked':'')+'> Evidence</label>':'')+
 (['steps','changes','outcomes'].includes(key)?'<button type="button" aria-label="Move up" data-act="row-up" data-list="'+key+'" data-pos="'+i+'" '+(i===0?'disabled':'')+'>↑</button><button type="button" aria-label="Move down" data-act="row-down" data-list="'+key+'" data-pos="'+i+'" '+(i===data.length-1?'disabled':'')+'>↓</button>':'')+
 '<button type="button" class="cl-remove" data-act="remove-row" data-list="'+key+'" data-pos="'+i+'" aria-label="Remove row">×</button></div>').join('')+'</section>';
}
function editorFields(node){
 if(!node)return '<div class="cl-hint">Choose or add a node to begin.</div>';
 const type=types[node.type],head='<p class="cl-eyebrow">'+esc(type?.name||node.type)+'</p><label class="cl-field"><span>Node template</span><select data-node-type="true">'+COURSE_LAB_TYPES.map(t=>'<option value="'+esc(t.id)+'"'+(node.type===t.id?' selected':'')+'>'+esc(t.name)+'</option>').join('')+'</select></label>'+textField('Node heading (optional)','title',node.title);
 const media='<details class="cl-media-fields"><summary>Image and illustration</summary>'+
 textField('Site image path','image',node.image,{hint:'Choose from the repository or upload; images must be hosted on this site.'})+
 '<button type="button" class="cl-light-button" data-act="choose-image">Browse / upload image</button>'+textField('Alt text','alt',node.alt)+textField('Caption / credit','caption',node.caption)+'</details>';
 if(node.type==='read')return head+textField('Reading text','body',node.body,{rows:12,hint:'Write freely. Blank lines separate paragraphs.'})+textField('Sources / further reading','sources',node.sources,{rows:3})+media;
 if(node.type==='image')return head+media+textField('Sources / attribution','sources',node.sources,{rows:3});
 let html=head+textField('Question / task','prompt',node.prompt,{rows:3})+
 textField('Concept ID','conceptId',node.conceptId,{hint:'A stable learning concept, e.g. negative-reinforcement.'});
 if(node.type==='character')html+=textField('Character name','characterName',node.characterName)+textField('Character situation','scenario',node.scenario,{rows:4});
 if(node.type==='predict')html+=textField('Condition / variable to change','changePrompt',node.changePrompt,{rows:2});
 if(node.type==='complete')html+=textField('Optional hint','hint',node.hint)+
 '<section class="cl-list"><div class="cl-list-title"><strong>Accepted answers (including variants)</strong><button data-act="add-answer" type="button">＋ Add</button></div>'+
 (node.answers||[]).map((x,i)=>'<div class="cl-row"><input aria-label="Accepted answer '+(i+1)+'" data-answer-index="'+i+'" value="'+esc(x)+'"><button type="button" data-act="remove-answer" data-pos="'+i+'">×</button></div>').join('')+'</section>';
 for(const list of ({match:['pairs'],sort:['categories','items'],label:['segments'],choose:['options'],repair:['options'],investigate:['options'],chain:['steps'],predict:['changes','outcomes'],character:['evidenceOptions','responseOptions']})[node.type]||[])html+=itemList(node,list);
 if(['choose','repair','investigate'].includes(node.type))html+=selectField('Correct answer','answer',node.options||[],node.answer);
 if(node.type==='predict')html+=selectField('Best change','correctChange',node.changes||[],node.correctChange)+selectField('Best predicted outcome','correctOutcome',node.outcomes||[],node.correctOutcome);
 if(node.type==='character')html+=selectField('Supported evidence','evidenceAnswer',node.evidenceOptions||[],node.evidenceAnswer)+selectField('Appropriate response','responseAnswer',node.responseOptions||[],node.responseAnswer);
 html+=textField('Explanation after answering','explanation',node.explanation,{rows:4,hint:'Explain what makes the answer justified and why plausible alternatives fall short.'})+
 textField('Counterexample / boundary','counterexample',node.counterexample,{rows:3,hint:'When would this concept NOT apply? Helps avoid overconfident labelling.'})+textField('Sources / references','sources',node.sources,{rows:2,hint:'Cite research or guideline sources supporting this question.'})+media;
 return html;
}
export function mountCourseLab(host,getPublisher,notify=()=>{}){
 if(!host)return;
 let courseId=LEARN_COURSES[0].id,draft=null,expectedVersion=0,baseVersion=0;
 let u=0,l=0,n=0,busy=false,preview=false,mediaList=[],saveTimer=null,loading=0;
 let expandedUnits=new Set([0]);
 host.innerHTML='<section class="cl-shell"><header class="cl-head"><div><p class="cl-eyebrow">STAFF · LEARN CURRICULUM</p><h1>Course Lab</h1><p>Explore the 50-module, 300-lesson psychology curriculum plan for each course. Author the teaching nodes, review the science and publish completed lessons when ready.</p></div><a href="index.html#learn" target="_blank" rel="noopener" class="cl-light-button">Open Learn ↗</a></header>'+
 '<div class="cl-toolbar"><label>Course <select id="cl-course">'+LEARN_COURSES.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.title)+'</option>').join('')+'</select></label><span id="cl-state" role="status"></span><button type="button" data-act="use-blueprint">Restore 50-module curriculum</button><button type="button" data-act="save">Save draft</button><button type="button" data-act="load">Load published</button><button type="button" data-act="export">Export</button><label class="cl-import">Import JSON<input id="cl-import" type="file" accept=".json,application/json" hidden></label></div>'+
 '<div class="cl-toolbar cl-publish-toolbar"><button type="button" data-act="preview">Preview lesson</button><button type="button" class="cl-publish" data-act="publish">Publish reviewed lessons</button><button type="button" data-act="unpublish">Unpublish</button><span id="cl-publish-state" role="status"></span></div>'+
 '<div class="cl-meta"><label>Published course title <input id="cl-title" maxlength="160" placeholder="Course title"></label><label>Course card description <textarea id="cl-description" rows="2" maxlength="400" placeholder="A short summary shown in Learn"></textarea></label><p id="cl-meta-hint"></p></div>'+
 '<div class="cl-grid"><aside class="cl-outline"><div class="cl-section-head"><h2>Units & lessons</h2><button type="button" data-act="add-unit">＋ Unit</button></div><label class="cl-field"><span>Find a module or lesson</span><input id="cl-outline-search" type="search" placeholder="Search the 300 lessons…"></label><div id="cl-units"></div></aside>'+
 '<section class="cl-sequence"><div class="cl-section-head"><h2>Lesson sequence</h2><button type="button" data-act="add-lesson">＋ Lesson</button></div><div id="cl-lesson-meta"></div><div id="cl-nodes"></div><div class="cl-add-node"><label>Add a node <select id="cl-new-type">'+COURSE_LAB_TYPES.map(t=>'<option value="'+t.id+'">'+esc(t.name)+'</option>').join('')+'</select></label><button data-act="add-node" type="button">＋ Add to sequence</button></div></section>'+
 '<section class="cl-inspector"><div class="cl-section-head"><h2>Node editor</h2></div><div id="cl-node-fields"></div></section></div>'+
 '<section id="cl-preview" class="cl-preview" hidden><div class="cl-section-head"><h2>Student preview · progress disabled</h2><button data-act="close-preview" type="button">Close</button></div><div id="cl-preview-host"></div></section>'+
 '<p class="cl-footer-note">Publishing requires the authorised Nobody’s Simple GitHub owner account. Media uploads publish the image file immediately; course content remains private until you publish it. The course URL uses its permanent ID, even if you rename its title.</p></section>'+
 '<dialog id="cl-media-dialog" class="cl-media-dialog"><div class="cl-section-head"><h2>Choose a course image</h2><button type="button" data-act="close-media">Close</button></div><label>Search site media <input id="cl-media-search" type="search" placeholder="Search filename"></label><label class="cl-upload">＋ Upload image to website<input id="cl-upload" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></label><p id="cl-media-state" role="status"></p><div id="cl-media-list"></div></dialog>';
 const $=selector=>host.querySelector(selector);
 const status=(s,bad=false)=>{$('#cl-state').textContent=s;$('#cl-state').dataset.error=bad?'true':'false';};
 const liveStatus=s=>{$('#cl-publish-state').textContent=s;};
 const selectedUnit=()=>draft?.modules?.[u]||null;
 const selectedLesson=()=>selectedUnit()?.lessons?.[l]||null;
 const selectedNode=()=>selectedLesson()?.nodes?.[n]||null;
 const local=id=>readCourseLabDraft(id);
 const save=async()=>{if(!draft)return;const id=courseId,value={draft:deep(draft),baseVersion,updatedAt:new Date().toISOString()};try{await saveCourseLabDraft(id,value);if(courseId===id)status('Draft saved to this device');}catch(err){status(err.message,true);}};
 const queueSave=()=>{clearTimeout(saveTimer);saveTimer=setTimeout(()=>void save(),400);status('Unsaved changes…');};
 const renderOutline=()=>{
  let previousBook='';
  const query=($('#cl-outline-search')?.value||'').toLocaleLowerCase().trim();
  $('#cl-units').innerHTML=(draft?.modules||[]).map((unit,ui)=>{
   if(query&&!([unit.title,unit.bookTitle,unit.problem,...(unit.lessons||[]).map(l=>l.title)].join(' ').toLocaleLowerCase().includes(query)))return '';
   const book=unit.bookTitle&&unit.bookTitle!==previousBook?
    '<div class="cl-book-heading"><span>CHAPTER '+esc(unit.bookNumber||'')+'</span><strong>'+esc(unit.bookTitle)+'</strong></div>':'';
   previousBook=unit.bookTitle||'';
   const expanded=!!query||expandedUnits.has(ui)||ui===u;
   const completed=(unit.lessons||[]).filter(lesson=>lesson.editorialStatus==='ready'&&(lesson.nodes||[]).length).length;
   return book+'<div class="cl-unit '+(ui===u?'selected':'')+'">'+
    '<div class="cl-unit-row"><button type="button" data-act="select-unit" data-u="'+ui+'">'+
    '<small class="cl-unit-progress">'+completed+'/'+(unit.lessons?.length||0)+' reviewed</small><strong>'+esc(unit.title||'Untitled module')+'</strong></button>'+
    '<div><button type="button" aria-label="'+(expanded?'Collapse':'Expand')+' module" aria-expanded="'+expanded+'" data-act="toggle-unit" data-u="'+ui+'">'+(expanded?'▾':'▸')+'</button>'+
    '<button type="button" aria-label="Move module up" data-act="unit-up" data-u="'+ui+'" '+(ui===0?'disabled':'')+'>↑</button>'+
    '<button type="button" aria-label="Move module down" data-act="unit-down" data-u="'+ui+'" '+(ui===draft.modules.length-1?'disabled':'')+'>↓</button>'+
    '<button type="button" aria-label="Remove module" data-act="delete-unit" data-u="'+ui+'">×</button></div></div>'+
    (expanded?(unit.lessons||[]).map((lesson,li)=>'<button type="button" class="cl-lesson-link '+(ui===u&&li===l?'active':'')+
    '" data-act="select-lesson" data-u="'+ui+'" data-l="'+li+'"><span>'+(li+1)+'. '+esc(lesson.title||'Untitled lesson')+'</span>'+
    '<small>'+(lesson.editorialStatus==='ready'?'✓ Ready':(lesson.nodes?.length||0)+' nodes')+'</small></button>').join(''):'')+'</div>';
  }).join('')||'<p class="cl-hint">Choose a course to load its curriculum or create your own module.</p>';
 };
 const renderSequence=()=>{
  const unit=selectedUnit(),lesson=selectedLesson();
  $('#cl-lesson-meta').innerHTML=unit&&lesson?
    (unit.bookTitle?'<p class="cl-arc"><strong>'+esc(unit.bookTitle)+'</strong><span>Key distinction: '+esc(unit.distinction||'')+'</span></p>':'')+
    '<label class="cl-field"><span>Module title</span><input data-meta="unit-title" value="'+esc(unit.title)+'"></label>'+
    '<label class="cl-field"><span>Lesson title</span><input data-meta="lesson-title" value="'+esc(lesson.title)+'"></label>'+
    '<label class="cl-field"><span>Learning objective</span><textarea data-meta="lesson-objective" rows="3">'+esc(lesson.objective||'')+'</textarea></label>'+
    '<label class="cl-field"><span>Suggested activity</span><select data-meta="lesson-mode"><option value="">Choose…</option>'+
      COURSE_LAB_TYPES.map(x=>'<option value="'+esc(x.id)+'"'+(lesson.recommendedType===x.id?' selected':'')+'>'+esc(x.name)+'</option>').join('')+'</select></label>'+
    '<label class="cl-field"><span>Editorial readiness</span><select data-meta="lesson-status">'+
      '<option value="draft"'+(lesson.editorialStatus!=='ready'?' selected':'')+'>Draft / needs clinical and editorial review</option>'+
      '<option value="ready"'+(lesson.editorialStatus==='ready'?' selected':'')+'>Ready: checked content, sources, answers and accessibility</option>'+
      '</select><small>Only authored lessons explicitly marked Ready are eligible for public release.</small></label>'+
    '<label class="cl-field"><span>Optional lesson introduction</span><textarea data-meta="lesson-teach" rows="3">'+esc(lesson.teach||'')+'</textarea></label>'+
    '<div class="cl-lesson-actions"><button data-act="lesson-up" type="button">Move lesson ↑</button><button data-act="lesson-down" type="button">Move lesson ↓</button><button data-act="delete-lesson" type="button">Delete lesson</button></div>':'<p class="cl-hint">Select a lesson in the outline, or add one to a unit.</p>';
  $('#cl-nodes').innerHTML=lesson?(lesson.nodes||[]).map((node,i)=>'<article class="cl-node '+(i===n?'active':'')+'" draggable="true" data-node-index="'+i+'"><button type="button" data-act="select-node" data-n="'+i+'"><small>'+String(i+1).padStart(2,'0')+' · '+esc(types[node.type]?.name||node.type)+'</small><strong>'+esc(node.title||node.prompt||node.body?.slice(0,65)||'Untitled node')+'</strong></button><div><button type="button" data-act="node-up" data-n="'+i+'" '+(i===0?'disabled':'')+' aria-label="Move node up">↑</button><button type="button" data-act="node-down" data-n="'+i+'" '+(i===lesson.nodes.length-1?'disabled':'')+' aria-label="Move node down">↓</button><button type="button" data-act="node-copy" data-n="'+i+'" aria-label="Duplicate node">⧉</button><button type="button" data-act="node-delete" data-n="'+i+'" aria-label="Delete node">×</button></div></article>').join('')||'<p class="cl-hint">Add reading pages and exercises in any order.</p>':'';
  $('#cl-node-fields').innerHTML=editorFields(selectedNode());
  $('#cl-title').value=draft?.title||'';$('#cl-description').value=draft?.description||'';
  const metrics=countAuthoredLessons(draft);
  $('#cl-meta-hint').textContent=metrics.modules+' modules · '+metrics.total+' planned lessons · '+metrics.authored+' with teaching nodes · '+metrics.ready+' marked ready';
 };
 const render=()=>{renderOutline();renderSequence();};
 const move=(arr,from,to)=>{if(!arr||to<0||to>=arr.length)return false;[arr[from],arr[to]]=[arr[to],arr[from]];return true;};
 async function loadCourse(id,{force=false}={}){
  if(busy)return;const ticket=++loading;clearTimeout(saveTimer);if(draft)await save();
  if(ticket!==loading)return;
  courseId=id;$('#cl-course').value=id;status('Loading course…');
  const localDraft=!force?await local(id):null;if(ticket!==loading)return;
  const display=LEARN_COURSES.find(c=>c.id===id)?.title||id;
  const p=getPublisher();let remote={version:0,bundle:null};
  try{if(p)remote=await p.readLearnCourse(id);}catch(err){status('GitHub version could not be checked: '+err.message,true);}
  if(ticket!==loading)return;
  expectedVersion=remote.version;
  if(localDraft){draft=localDraft.draft;baseVersion=localDraft.baseVersion;status('Local draft restored'+(baseVersion!==expectedVersion?' · WARNING: live version changed':'')+'.',baseVersion!==expectedVersion);}
  else if(remote.bundle){
   try{
    const blueprint=await fetchCurriculumBlueprint(id);
    if(ticket!==loading)return;
    draft=mergePublishedIntoBlueprint(blueprint,remote.bundle);
    status('Restored full curriculum with '+countAuthoredLessons(draft).ready+' previously published lessons.');
   }catch{
    draft={...deep(remote.bundle),status:'draft'};
    status('Published lessons loaded; the original curriculum blueprint could not be retrieved.');
   }
   baseVersion=expectedVersion;
  }
  else{
   try{
    const blueprint=await fetchCurriculumBlueprint(id);
    if(ticket!==loading)return;
    const meta=LEARN_COURSES.find(c=>c.id===id);
    draft=createDraftFromBlueprint(blueprint,{id,title:display,description:meta?.description||''});
    status('Curriculum loaded: 50 modules and 300 unpublished lesson outlines.');
   }catch(err){
    draft=createCourseDraft(id,display);
    status('No curriculum loaded: '+err.message+'. You can still author manually.',true);
   }
   baseVersion=expectedVersion;
  }
  u=0;l=0;n=0;expandedUnits=new Set([0]);$('#cl-outline-search').value='';preview=false;$('#cl-preview').hidden=true;render();
  if(!localDraft&&!remote.bundle&&draft.modules.length)void save();
  liveStatus(remote.published?'Published v'+remote.version:remote.version?'Unpublished · last version '+remote.version:'Not published');
 }
 const setField=(target)=>{
  if(target.id==='cl-title'){draft.title=target.value;queueSave();return;}
  if(target.id==='cl-description'){draft.description=target.value;queueSave();return;}
  const node=selectedNode(),lesson=selectedLesson(),unit=selectedUnit();if(!draft)return;
  if(target.dataset.meta){
   if(target.dataset.meta==='unit-title'&&unit)unit.title=target.value;
   if(target.dataset.meta==='lesson-title'&&lesson)lesson.title=target.value;
   if(target.dataset.meta==='lesson-teach'&&lesson)lesson.teach=target.value;
   if(target.dataset.meta==='lesson-objective'&&lesson)lesson.objective=target.value;
   if(target.dataset.meta==='lesson-mode'&&lesson)lesson.recommendedType=target.value;
   if(target.dataset.meta==='lesson-status'&&lesson)lesson.editorialStatus=target.value;
  }else if(node&&target.dataset.field)node[target.dataset.field]=target.value;
  else if(node&&target.dataset.answerIndex!==undefined)node.answers[Number(target.dataset.answerIndex)]=target.value;
  else if(node&&target.dataset.list){
   const row=node[target.dataset.list]?.[Number(target.dataset.pos)];
   if(row)row[target.dataset.prop]=target.type==='checkbox'?target.checked:target.value;
  }else return;
  if(lesson&&lesson.editorialStatus==='ready'&&target.dataset.meta!=='lesson-status'){
   lesson.editorialStatus='draft';
   status('Content changed — this lesson needs review again.');
  }
  queueSave();
 };
 const rowDefault=(k)=>k==='segments'?{id:makeCourseId(),text:'',answer:false}:k==='pairs'?{id:makeCourseId(),label:'',answer:''}:k==='items'?{id:makeCourseId(),label:'',answer:''}:{id:makeCourseId(),label:''};
 const setBusy=value=>{busy=value;host.querySelectorAll('.cl-toolbar button').forEach(el=>el.disabled=value);};
 const actions={
  'save':()=>save(),
  'use-blueprint':()=>void restoreBlueprint(),
  'toggle-unit':b=>{const i=Number(b.dataset.u);if(expandedUnits.has(i))expandedUnits.delete(i);else expandedUnits.add(i);renderOutline();},
  'add-unit':()=>{draft.modules.push(newCourseUnit());u=draft.modules.length-1;l=0;n=0;render();queueSave();},
  'select-unit':b=>{u=Number(b.dataset.u);expandedUnits.add(u);l=0;n=0;render();},
  'select-lesson':b=>{u=Number(b.dataset.u);expandedUnits.add(u);l=Number(b.dataset.l);n=0;render();},
  'unit-up':b=>{const i=Number(b.dataset.u);if(move(draft.modules,i,i-1)){u=i-1;render();queueSave();}},
  'unit-down':b=>{const i=Number(b.dataset.u);if(move(draft.modules,i,i+1)){u=i+1;render();queueSave();}},
  'delete-unit':b=>{const i=Number(b.dataset.u);if(confirm('Delete this unit and every lesson inside?')){draft.modules.splice(i,1);u=Math.max(0,Math.min(u,draft.modules.length-1));l=0;n=0;render();queueSave();}},
  'add-lesson':()=>{if(!selectedUnit()){status('Add a unit first.',true);return;}selectedUnit().lessons.push(newCourseLesson());l=selectedUnit().lessons.length-1;n=0;render();queueSave();},
  'lesson-up':()=>{if(move(selectedUnit()?.lessons,l,l-1)){l--;render();queueSave();}},
  'lesson-down':()=>{if(move(selectedUnit()?.lessons,l,l+1)){l++;render();queueSave();}},
  'delete-lesson':()=>{if(selectedLesson()&&confirm('Delete this lesson and all its nodes?')){selectedUnit().lessons.splice(l,1);l=Math.max(0,Math.min(l,selectedUnit().lessons.length-1));n=0;render();queueSave();}},
  'add-node':()=>{const lesson=selectedLesson();if(!lesson){status('Add a lesson first.',true);return;}const node=createCourseNode($('#cl-new-type').value);lesson.nodes.push(node);n=lesson.nodes.length-1;render();queueSave();},
  'select-node':b=>{n=Number(b.dataset.n);renderSequence();},
  'node-up':b=>{const i=Number(b.dataset.n);if(move(selectedLesson()?.nodes,i,i-1)){n=i-1;renderSequence();queueSave();}},
  'node-down':b=>{const i=Number(b.dataset.n);if(move(selectedLesson()?.nodes,i,i+1)){n=i+1;renderSequence();queueSave();}},
  'node-copy':b=>{const lesson=selectedLesson(),i=Number(b.dataset.n);if(!lesson)return;const copy=deep(lesson.nodes[i]),ids=new Map();copy.id=makeCourseId();for(const key of ['pairs','categories','items','segments','options','steps','changes','outcomes','evidenceOptions','responseOptions'])if(Array.isArray(copy[key]))copy[key].forEach(row=>{const fresh=makeCourseId();ids.set(row.id,fresh);row.id=fresh;});for(const key of ['answer','correctChange','correctOutcome','evidenceAnswer','responseAnswer'])if(ids.has(copy[key]))copy[key]=ids.get(copy[key]);for(const item of copy.items||[])if(ids.has(item.answer))item.answer=ids.get(item.answer);lesson.nodes.splice(i+1,0,copy);n=i+1;renderSequence();queueSave();},
  'node-delete':b=>{if(!selectedLesson()||!confirm('Remove this node?'))return;selectedLesson().nodes.splice(Number(b.dataset.n),1);n=Math.max(0,Math.min(n,selectedLesson().nodes.length-1));renderSequence();queueSave();},
  'add-row':b=>{const node=selectedNode(),key=b.dataset.list;if(!Array.isArray(node?.[key]))return;const item=rowDefault(key);node[key].push(item);renderSequence();queueSave();},
  'remove-row':b=>{const node=selectedNode();node?.[b.dataset.list]?.splice(Number(b.dataset.pos),1);renderSequence();queueSave();},
  'row-up':b=>{const a=selectedNode()?.[b.dataset.list];if(move(a,Number(b.dataset.pos),Number(b.dataset.pos)-1)){renderSequence();queueSave();}},
  'row-down':b=>{const a=selectedNode()?.[b.dataset.list];if(move(a,Number(b.dataset.pos),Number(b.dataset.pos)+1)){renderSequence();queueSave();}},
  'add-answer':()=>{selectedNode()?.answers?.push('');renderSequence();queueSave();},
  'remove-answer':b=>{selectedNode()?.answers?.splice(Number(b.dataset.pos),1);renderSequence();queueSave();},
  'choose-image':()=>void openMedia(),
  'close-media':()=>$('#cl-media-dialog').close(),
  'preview':()=>{const lesson=selectedLesson();if(!lesson||!lesson.nodes.length){status('Add some lesson nodes before previewing.',true);return;}preview=true;$('#cl-preview').hidden=false;renderLearnLesson($('#cl-preview-host'),courseId,lesson.id,{bundleOverride:{...draft,status:'published',version:expectedVersion||1},preview:true});$('#cl-preview').scrollIntoView({behavior:'smooth',block:'start'});},
  'close-preview':()=>{preview=false;$('#cl-preview').hidden=true;},
  'load':()=>{if(confirm('Discard your local draft and load the most recently published course?')){const id=courseId;draft=null;void deleteCourseLabDraft(id).then(()=>loadCourse(id,{force:true}));}},
  'export':()=>{const blob=new Blob([JSON.stringify(draft,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='course-lab-'+courseId+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},
  'publish':()=>void publish(),
  'unpublish':()=>void unpublish()
 };
 async function restoreBlueprint(){
  if(busy)return;
  if(draft?.modules?.length&&!confirm('Replace the current local course outline with the original 50-module blueprint? All unsaved teaching work will be lost. Export a backup first if needed.'))return;
  const id=courseId;
  try{
   status('Loading curriculum blueprint…');
   const blueprint=await fetchCurriculumBlueprint(id);
   if(id!==courseId)return;
   const course=LEARN_COURSES.find(c=>c.id===id);
   draft=createDraftFromBlueprint(blueprint,{id,title:course?.title||id,description:course?.description||''});
   baseVersion=expectedVersion;u=l=n=0;expandedUnits=new Set([0]);render();await save();
   status('Restored 50 modules and 300 planned lessons. No learning content was published.');
  }catch(err){status('Could not restore curriculum: '+err.message,true);}
 }
 async function publish(){
  const candidate=makePublishableSubset(draft);
  if(candidate.issues.length){status(candidate.issues.slice(0,4).join(' · '),true);liveStatus('Publication blocked: '+candidate.issues.length+' issue(s).');return;}
  if(baseVersion!==expectedVersion){status('The live version has changed since this draft was opened. Reload before publishing.',true);return;}
  if(!getPublisher())return status('Connect to GitHub first.',true);
  if(!confirm('Publish '+candidate.ready+' reviewed lesson(s) from '+draft.title+' to Learn? '+candidate.excluded+' unfinished lessons will remain private in Course Lab.'))return;
  await save();setBusy(true);liveStatus('Publishing reviewed lessons to GitHub…');
  try{
   const result=await getPublisher().publishLearnCourse(candidate.bundle,expectedVersion);
   expectedVersion=result.version;baseVersion=result.version;await save();
   liveStatus('Published v'+result.version+': '+candidate.ready+' reviewed lessons. '+candidate.excluded+' outlines remain private.');
   notify('Reviewed lessons published to Learn.');
  }catch(err){liveStatus('Publish failed: '+err.message);status('Your draft is still saved locally.',true);}
  finally{setBusy(false);}
 }
 async function unpublish(){
  if(!expectedVersion)return status('This course is not currently published.',true);
  if(!confirm('Unpublish '+draft.title+'? The public course will disappear. Existing saved learner progress will not be deleted.'))return;
  setBusy(true);
  try{await getPublisher().unpublishLearnCourse(courseId,expectedVersion);baseVersion=expectedVersion;save();liveStatus('Unpublished. Public Learn will update after deployment.');notify('Course unpublished.');}
  catch(err){liveStatus('Unpublish failed: '+err.message);}
  finally{setBusy(false);}
 }
 function mediaPaint(filter=''){
  const q=filter.toLowerCase();const items=mediaList.filter(x=>/\.(png|jpe?g|webp|gif)$/i.test(x.path||'')&&(x.path||'').toLowerCase().includes(q)).slice(0,150);
  $('#cl-media-list').innerHTML=items.length?items.map(x=>'<button type="button" data-image="'+esc(x.path)+'"><img src="'+esc(x.path)+'" alt="" loading="lazy"><span>'+esc(x.path.split('/').pop())+'</span></button>').join(''):'<p>No matching site images. You can upload one above.</p>';
 }
 async function openMedia(){
  const p=getPublisher();if(!p)return status('Connect to GitHub to browse images.',true);
  $('#cl-media-dialog').showModal();$('#cl-media-state').textContent='Loading media…';
  try{const snapshot=await p.snapshot();mediaList=snapshot.assets||[];mediaPaint();$('#cl-media-state').textContent=mediaList.length+' repository media files found.';}
  catch(err){$('#cl-media-state').textContent='Could not load media: '+err.message;}
 }
 host.addEventListener('click',event=>{
  const image=event.target.closest('[data-image]');
  if(image&&selectedNode()){selectedNode().image=image.dataset.image;$('#cl-media-dialog').close();renderSequence();queueSave();return;}
  const button=event.target.closest('[data-act]');if(!button||busy)return;
  if(actions[button.dataset.act])actions[button.dataset.act](button);
 });
 host.addEventListener('input',event=>{
  if(event.target.id==='cl-media-search'){mediaPaint(event.target.value);return;}
  if(event.target.id==='cl-outline-search'){renderOutline();return;}
  setField(event.target);
 });
 host.addEventListener('change',event=>{
  if(event.target.dataset.nodeType){const old=selectedNode(),lesson=selectedLesson();if(!old||!lesson||old.type===event.target.value)return;if(!confirm('Change this node template? Its old answer fields will be replaced, but common text and media will be retained.')){event.target.value=old.type;return;}const fresh=createCourseNode(event.target.value);for(const key of ['id','title','prompt','conceptId','explanation','counterexample','sources','image','alt','caption'])if(old[key]!==undefined)fresh[key]=old[key];lesson.nodes[n]=fresh;renderSequence();queueSave();return;}
  if(event.target.id==='cl-course'){void loadCourse(event.target.value);return;}
  if(event.target.id==='cl-new-type'||event.target.id==='cl-upload'||event.target.id==='cl-import')return;
  setField(event.target);
  if(event.target.matches('[data-meta],select[data-field],select[data-list]')){renderOutline();} // Selected values remain stable without rerendering the form.
 });
 let dragIndex=null;
 $('#cl-nodes').addEventListener('dragstart',event=>{const row=event.target.closest('[data-node-index]');dragIndex=row?Number(row.dataset.nodeIndex):null;if(event.dataTransfer)event.dataTransfer.effectAllowed='move';});
 $('#cl-nodes').addEventListener('dragover',event=>{if(event.target.closest('[data-node-index]'))event.preventDefault();});
 $('#cl-nodes').addEventListener('drop',event=>{const row=event.target.closest('[data-node-index]');if(dragIndex===null||!row)return;event.preventDefault();const to=Number(row.dataset.nodeIndex),arr=selectedLesson()?.nodes;if(!arr||to===dragIndex)return;arr.splice(to,0,arr.splice(dragIndex,1)[0]);n=to;dragIndex=null;renderSequence();queueSave();});
 $('#cl-import').addEventListener('change',async event=>{
  const f=event.target.files?.[0];if(!f)return;
  try{if(f.size>700000)throw Error('Imported JSON is too large.');const obj=JSON.parse(await f.text());
   if(obj.id!==courseId||!Array.isArray(obj.modules))throw Error('This backup belongs to another course or is invalid.');
   draft={...obj,status:'draft'};u=l=n=0;render();save();status('Backup imported as local draft.');}
  catch(e){status('Import failed: '+e.message,true);}event.target.value='';
 });
 $('#cl-upload').addEventListener('change',async event=>{
  const f=event.target.files?.[0];if(!f||!selectedNode())return;const p=getPublisher();
  try{
   if(f.size>8*1024*1024||f.size===0||!['image/png','image/jpeg','image/webp','image/gif'].includes(f.type))throw Error('Use PNG, JPG, WebP or GIF under 8 MB.');
   const raw=new Uint8Array(await f.arrayBuffer());
   const mime=f.type,ext={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif'}[mime];
   const valid=ext==='png'&&raw[0]===137&&raw[1]===80&&raw[2]===78&&raw[3]===71||
     ext==='jpg'&&raw[0]===255&&raw[1]===216||
     ext==='webp'&&new TextDecoder().decode(raw.slice(0,4))==='RIFF'&&new TextDecoder().decode(raw.slice(8,12))==='WEBP'||
     ext==='gif'&&new TextDecoder().decode(raw.slice(0,3))==='GIF';
   if(!valid)throw Error('File bytes do not match its claimed image type.');
   let binary='';for(let i=0;i<raw.length;i+=8192)binary+=String.fromCharCode(...raw.subarray(i,i+8192));
   const path='media/courses/'+courseId+'/'+makeCourseId().replace(/[^a-zA-Z0-9-]/g,'')+'.'+ext;
   $('#cl-media-state').textContent='Uploading image to GitHub…';$('#cl-upload').disabled=true;
   await p.publishAssets([{path,base64:btoa(binary)}]);
   selectedNode().image=path;selectedNode().alt=selectedNode().alt||f.name.replace(/\.[^.]+$/,'');
   mediaList.unshift({path});renderSequence();queueSave();mediaPaint();$('#cl-media-state').textContent='Image published to repository and attached to this node. Course remains unpublished until you publish it.';
  }catch(err){$('#cl-media-state').textContent='Upload failed: '+err.message;}
  finally{$('#cl-upload').disabled=false;event.target.value='';}
 });
 // Starting is explicit: never publish without a real owner-token session.
 void loadCourse(courseId);
}
