/* Staff topic copy editor: additive editorial sections only.
   The baseline clinical/educational guide, support-first advice and worksheets
   are intentionally immutable through this view. */
import {atlasProblemIndex} from './ns-atlas-core.mjs';
import {escapeHTML as esc} from './core.mjs';
import {cleanTopicPublication,topicPublicationMarkup} from './ns-topic-publications.mjs';
const key='ns-studio-topic-drafts-v1';
const topics=[...atlasProblemIndex].sort((a,b)=>a.title.localeCompare(b.title));
const safeId=id=>topics.some(topic=>topic.id===id);
function drafts(){try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{return {};}}
function storeDraft(id,value){const all=drafts();all[id]=cleanTopicPublication(value);localStorage.setItem(key,JSON.stringify(all));}
const sectionNames=[
 ['overview','What might be happening?','Explain this experience in clear, compassionate language without assuming its cause.'],
 ['variations','Which version might fit?','Describe different experiences, circumstances, and what may change the explanation.'],
 ['actions','What could help next?','Offer proportionate, optional starting points, including support and adjustments.']
];
export function mountTopicStudio(host,getPublisher,notify=()=>{}){
 if(!host)return;
 let data={version:1,topics:{}},selected=topics[0]?.id||'',busy=false;
 host.innerHTML=`<div class="studio-topic-head"><div><p class="eyebrow">STAFF · NAVIGATION CONTENT</p><h1>Topic Guide Studio</h1>
  <p>Write accessible introductions and actionable sections for the real topic pages. The original guides, support notices, assessments and worksheets are preserved.</p></div>
  <a class="button secondary" href="index.html#navigate" target="_blank" rel="noopener">Open Navigation Console ↗</a></div>
  <div class="studio-topic-editor">
   <section class="studio-topic-form" aria-label="Edit topic guide">
    <label class="inspector-label">Find a topic <input type="search" id="ts-filter" placeholder="Find anxiety, sleep, confidence, relationships…" autocomplete="off"></label>
    <label class="inspector-label">Choose existing topic <select id="ts-topic" size="9"></select></label>
    <p class="studio-topic-hint" id="ts-topic-subtitle"></p>
    <div id="ts-fields">${sectionNames.map(([id,title,hint])=>`<label class="studio-topic-field"><strong>${esc(title)}</strong><small>${esc(hint)}</small>
     <textarea data-topic-section="${id}" rows="7" maxlength="3600" placeholder="Write the section in your own words. Separate paragraphs with a blank line."></textarea></label>`).join('')}</div>
    <p class="studio-topic-hint">Changes are private drafts until you publish. Empty sections are omitted. Use non-diagnostic, human writing and avoid unsafe universal exercises.</p>
    <div class="studio-topic-actions"><button class="button" type="button" id="ts-publish">Publish topic writing</button>
     <button class="button secondary" type="button" id="ts-reload">Discard local changes</button>
     <a id="ts-view-live" href="#navigate" target="_blank" rel="noopener">Open current guide ↗</a></div>
    <p class="studio-topic-status" id="ts-status" aria-live="polite"></p>
   </section>
   <aside class="studio-topic-preview" aria-label="Live guide preview"><div class="studio-topic-preview-head"><strong>Topic page preview</strong><span>Actual public section component</span></div>
     <div id="ts-preview-content"></div>
     <div class="studio-topic-preview-note"><strong>Existing content stays underneath</strong><p>The current recognition questions, safeguards, sources and worksheets remain intact. These are introductory editorial additions.</p></div>
   </aside>
  </div>`;
 const select=host.querySelector('#ts-topic'),filter=host.querySelector('#ts-filter'),status=host.querySelector('#ts-status');
 const fields=()=>Object.fromEntries([...host.querySelectorAll('[data-topic-section]')].map(node=>[node.dataset.topicSection,node.value]));
 const label=()=>topics.find(t=>t.id===selected)?.title||'Topic';
 const writeStatus=message=>status.textContent=message;
 const items=()=>topics.filter(t=>[t.title,t.id,t.hint].join(' ').toLowerCase().includes(filter.value.trim().toLowerCase())).slice(0,518);
 const refreshOptions=()=>{
  select.innerHTML=items().map(t=>`<option value="${esc(t.id)}" ${t.id===selected?'selected':''}>${esc(t.title)}</option>`).join('');
  if(!items().some(t=>t.id===selected)&&items().length){selected=items()[0].id;select.value=selected;}
 };
 const preview=()=>{
  const html=topicPublicationMarkup(fields(),label());
  host.querySelector('#ts-preview-content').innerHTML=html||'<p class="studio-topic-empty">Start writing to see your sections in the calmer topic-page style.</p>';
 };
 const loadSelection=()=>{
  const record=drafts()[selected]||data.topics[selected]||{};
  const clean=cleanTopicPublication(record);
  host.querySelectorAll('[data-topic-section]').forEach(node=>node.value=clean[node.dataset.topicSection]);
  const topic=topics.find(x=>x.id===selected);
  host.querySelector('#ts-topic-subtitle').textContent=topic?.hint||'';
  host.querySelector('#ts-view-live').href='index.html#problem/'+encodeURIComponent(selected);
  writeStatus(drafts()[selected]?'Unpublished local changes loaded.':data.topics[selected]?'Published copy loaded.':'No authored copy for this topic yet.');
  preview();
 };
 const reload=async()=>{
  const p=getPublisher();if(!p){writeStatus('Connect with GitHub first.');return;}
  try{const snapshot=await p.readTopicPublications();data=snapshot.data;refreshOptions();loadSelection();}catch(e){writeStatus('Could not load published topic writing: '+e.message);}
 };
 filter.addEventListener('input',()=>{refreshOptions();loadSelection();});
 select.addEventListener('change',()=>{selected=select.value;loadSelection();});
 host.querySelector('#ts-fields').addEventListener('input',()=>{
  try{storeDraft(selected,fields());writeStatus('Saved privately in this browser. Publish when ready.');}catch{writeStatus('Local storage full. Copy your writing before leaving.');}preview();
 });
 host.querySelector('#ts-reload').addEventListener('click',()=>{
  if(!confirm('Discard your local changes for this topic and restore published writing?'))return;
  const all=drafts();delete all[selected];localStorage.setItem(key,JSON.stringify(all));loadSelection();
 });
 host.querySelector('#ts-publish').addEventListener('click',async()=>{
  if(busy||!safeId(selected))return;
  const p=getPublisher();if(!p)return writeStatus('Connect with GitHub first.');
  if(!confirm('Publish these sections for '+label()+'? Existing safety guidance and interactive tools will not change.'))return;
  busy=true;host.querySelector('#ts-publish').disabled=true;writeStatus('Publishing to GitHub…');
  try{
   const result=await p.publishTopicSections(selected,fields());
   const all=drafts();delete all[selected];localStorage.setItem(key,JSON.stringify(all));
   if(result.section)data.topics[selected]=result.section;else delete data.topics[selected];
   writeStatus('Published to GitHub. The public guide will update after site deployment.');notify('Topic guide writing published.');
  }catch(e){writeStatus('Publish failed: '+e.message+'. Your local draft is preserved.');}
  finally{busy=false;host.querySelector('#ts-publish').disabled=false;}
 });
 refreshOptions();void reload();
}
