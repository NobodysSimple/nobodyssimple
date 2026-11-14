/* Nobody's Simple: optional Understand Why explorer.
   All routes are illustrative, never automatically inferred personal truths. */
import {escapeHTML} from './core.mjs';
import {DEPTH_EXAMPLES,DEPTH_GROUPS,DEPTH_LEVELS,DEPTH_ROOTS,depthById,depthRoot} from './ns-judgement-depth-data.mjs';
const e=x=>escapeHTML(String(x??""));
const rootText=x=>depthRoot(x)?.label||String(x||"");
const valueFor=(d,k)=>k==="root"?(depthRoot(d.root)?.label||d.root||""):d[k]||"";
function pathGraph(item,personal=false){
 return "<ol class='ns-depth-chain' aria-label='"+(personal?"Your editable reflection":"Illustrative psychological pathway")+"'>"+
 DEPTH_LEVELS.map((level,i)=>"<li><span class='ns-depth-num' aria-hidden='true'>"+(i+1)+"</span><div><span class='ns-depth-level'>"+e(level.label)+"</span><p>"+(valueFor(item,level.key)?e(valueFor(item,level.key)):"<em>Still uncertain — no answer needed</em>")+"</p></div></li>").join("")+"</ol>";
}
function oneCard(item){
 return "<button type='button' data-depth-select='"+e(item.id)+"' class='ns-depth-result'><span>"+e(item.situation)+"</span><small>"+e(item.groupLabel)+" · "+e(rootText(item.root))+"</small></button>";
}
export function mountJudgementDepth(host,{getJournalAnswers=()=>({})}={}){
 if(!host)return;
 const state={opened:false,browsing:false,chosen:DEPTH_EXAMPLES[0].id,root:"",group:"",query:"",all:false,own:{},step:0,editing:false,complete:false};
 host.innerHTML="<section id='ns-depth' class='ns-depth' aria-labelledby='ns-depth-title'>"+
  "<header class='ns-depth-cover'><p class='ns-judge-kicker'>AN OPTIONAL DEEPER LOOK</p><h2 id='ns-depth-title'>Understand why</h2>"+
  "<p>Sometimes the fear is protecting something important to you. Maybe you learned a rule about needing approval. Maybe the people around you really have been unkind. You can investigate what might be happening without having to decide there is one hidden explanation for everything.</p>"+
  "<button type='button' class='ns-depth-toggle' data-depth-toggle aria-expanded='false' aria-controls='ns-depth-body'>Explore the hidden pattern <span aria-hidden='true'>↓</span></button></header>"+
  "<div id='ns-depth-body' class='ns-depth-body' data-depth-body hidden>"+
  "<h3>Follow one thread at a time</h3><p>Start with an example or make your own map. There is no pressure to find a childhood explanation, and you can stop wherever you like.</p>"+
  "<div class='ns-depth-overview' aria-label='How the exploration works'>What happened <span aria-hidden='true'>→</span> What you feared <span aria-hidden='true'>→</span> What mattered <span aria-hidden='true'>→</span> A possible rule <span aria-hidden='true'>→</span> A freer response</div>"+
  "<div class='ns-depth-controls'><button type='button' class='ns-depth-primary' data-depth-start='blank'>Explore my own experience</button>"+
  "<button type='button' class='ns-depth-secondary' data-depth-start='earlier'>Use my earlier journal answers</button>"+
  "<button type='button' class='ns-depth-secondary' data-depth-browse aria-expanded='false' aria-controls='ns-depth-browser'>Browse "+DEPTH_EXAMPLES.length+" examples</button></div>"+
  "<div class='ns-depth-browser' id='ns-depth-browser' data-depth-browser hidden><h3>Browse other experiences</h3>"+
  "<label for='ns-depth-search'>Search a situation or a possible belief</label><input id='ns-depth-search' type='search' data-depth-search placeholder='Try: apologising, silence, exclusion' autocomplete='off'>"+
  "<label for='ns-depth-group'>Browse by situation</label><select id='ns-depth-group' data-depth-group><option value=''>All situations</option>"+DEPTH_GROUPS.map(g=>"<option value='"+e(g.id)+"'>"+e(g.label)+"</option>").join("")+"</select>"+
  "<p class='ns-depth-small'>These themes help you browse. They are not a test of what is secretly driving you.</p>"+
  "<div class='ns-depth-roots' role='group' aria-label='Filter by what might matter underneath'><button type='button' data-depth-root='' aria-pressed='true'>All concerns</button>"+
  DEPTH_ROOTS.map(r=>"<button type='button' data-depth-root='"+e(r.id)+"' aria-pressed='false'>"+e(r.label)+"</button>").join("")+"</div>"+
  "<p class='ns-depth-count' data-depth-count role='status'></p><div class='ns-depth-results' data-depth-results></div>"+
  "<button type='button' class='ns-depth-secondary' data-depth-more hidden>Show all matching examples</button></div>"+
  "<section class='ns-depth-example-panel' aria-label='Selected example'><p class='ns-judge-kicker'>ONE POSSIBLE EXPLANATION</p>"+
  "<h3 tabindex='-1' data-depth-heading></h3><p>Trace the links below. They are questions to consider, not claims about what caused anybody's behaviour.</p>"+
  "<div data-depth-graph></div><div data-depth-related></div>"+
  "<button type='button' class='ns-depth-secondary' data-depth-start='example'>Use this example as an editable starting point</button></section>"+
  "<section data-depth-editor class='ns-depth-editor' aria-label='Your working map' hidden></section>"+
  "<p class='ns-depth-caution'>The map cannot uncover an unconscious cause, prove a childhood explanation or diagnose you. An upsetting reaction may arise from present circumstances, biology or accessibility needs as well as learned expectations. If people really are mistreating you, safety and support matter more than challenging your fear.</p>"+
  "<details class='ns-depth-sources'><summary>What psychological approach is this based on?</summary><p>The questions draw on CBT methods for exploring assumptions and core beliefs, including the downward arrow technique. Clinical guidance for social anxiety also includes testing beliefs and changing protective behaviours. These example pathways are educational interpretations, not clinically validated individual formulations.</p>"+
  "<a href='https://www.nice.org.uk/guidance/cg159/chapter/recommendations' target='_blank' rel='noopener noreferrer'>NICE: social anxiety and CBT</a> · "+
  "<a href='https://psych.med.umich.edu/anxiety-program/pdf/CBT-Group-Program-for-Depression-patient-manual.pdf' target='_blank' rel='noopener noreferrer'>CBT manual: downward arrow</a></details></div></section>";
 const body=host.querySelector("[data-depth-body]"),browser=host.querySelector("[data-depth-browser]");
 const graph=host.querySelector("[data-depth-graph]"),related=host.querySelector("[data-depth-related]");
 const heading=host.querySelector("[data-depth-heading]"),editor=host.querySelector("[data-depth-editor]");
 const list=host.querySelector("[data-depth-results]"),count=host.querySelector("[data-depth-count]");
 const more=host.querySelector("[data-depth-more]");
 function activate(){
  state.opened=true;body.hidden=false;const btn=host.querySelector("[data-depth-toggle]");
  btn.setAttribute("aria-expanded","true");btn.querySelector("span").textContent="↑";
 }
 function browse(){
  activate();state.browsing=true;browser.hidden=false;
  host.querySelector("[data-depth-browse]").setAttribute("aria-expanded","true");drawList();
 }
 function drawList(){
  const q=state.query.toLocaleLowerCase().trim();
  const matches=DEPTH_EXAMPLES.filter(x=>(!state.root||x.root===state.root)&&(!state.group||x.group===state.group)&&
   (!q||[x.situation,x.interpretation,x.fear,x.rule,x.identity,x.need,x.groupLabel].some(v=>v.toLocaleLowerCase().includes(q))));
  count.textContent=matches.length+" matching example"+(matches.length===1?"":"s");
  list.innerHTML=matches.length?(state.all?matches:matches.slice(0,12)).map(oneCard).join(""):"<p>No matches. Try another word or remove a filter.</p>";
  more.hidden=state.all||matches.length<=12;
  host.querySelectorAll("[data-depth-root]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.depthRoot===state.root)));
 }
 function drawExample(focus=false){
  const x=depthById(state.chosen)||DEPTH_EXAMPLES[0];
  heading.textContent=x.situation;graph.innerHTML=pathGraph(x);
  const linked=[],groups=new Set();
  for(const item of DEPTH_EXAMPLES.filter(i=>i.root===x.root&&i.id!==x.id)){
   if(!groups.has(item.group)){linked.push(item);groups.add(item.group);}if(linked.length>=7)break;
  }
  related.innerHTML="<div class='ns-depth-related'><h4>Other situations connected with "+e(rootText(x.root).toLowerCase())+"</h4>"+
  "<p>Several reactions can involve the same concern without having the same cause.</p><div>"+
  linked.map(item=>"<button type='button' data-depth-select='"+e(item.id)+"'>"+e(item.situation)+"</button>").join("")+"</div></div>";
  if(focus){heading.focus({preventScroll:true});heading.scrollIntoView({block:"start",behavior:"auto"});}
 }
 function start(mode){
  activate();state.editing=true;state.complete=false;state.step=0;
  if(mode==="example"){
   const x=depthById(state.chosen);state.own=Object.fromEntries(DEPTH_LEVELS.map(l=>[l.key,valueFor(x,l.key)]));
  }else if(mode==="earlier"){
   const a=getJournalAnswers()||{};state.own={situation:String(a.moment||""),interpretation:String(a.fear||""),fear:String(a.meaning||""),action:String(a.step||"")};
  }else state.own={};
  drawEditor();
 }
 function focusEditor(){
  editor.hidden=false;editor.querySelector("h3")?.focus({preventScroll:true});editor.scrollIntoView({block:"start",behavior:"auto"});
 }
 function drawEditor(){
  const item=DEPTH_LEVELS[state.step],value=state.own[item.key]||"";
  editor.innerHTML="<p class='ns-judge-kicker'>YOUR OWN WORKING MAP</p><h3 tabindex='-1'>Go one layer deeper, if it helps</h3>"+
  "<p class='ns-depth-count'>Layer "+(state.step+1)+" of "+DEPTH_LEVELS.length+" · You may skip any question</p>"+
  "<div class='ns-depth-progress' aria-hidden='true'><span style='width:"+((state.step+1)/DEPTH_LEVELS.length*100)+"%'></span></div>"+
  "<label for='ns-depth-answer'>"+e(item.question)+"</label><p>"+e(item.note)+"</p>"+
  "<textarea id='ns-depth-answer' data-depth-answer maxlength='1200' rows='4' placeholder='Use your own words, or leave this blank.'>"+e(value)+"</textarea>"+
  (item.key==="root"?"<p class='ns-depth-small'>Safety, belonging, agency, worth, identity and meaning are examples. Your own answer may be different.</p>":"")+
  (item.key==="adaptation"?"<p class='ns-depth-small'>You can say 'I do not know'. An origin is never required.</p>":"")+
  "<div class='ns-depth-actions'>"+(state.step?"<button type='button' class='ns-depth-secondary' data-depth-back>Back</button>":"")+
  "<button type='button' class='ns-depth-primary' data-depth-next>"+(state.step===DEPTH_LEVELS.length-1?"See my map":"Continue")+" →</button>"+
  "<button type='button' class='ns-depth-secondary' data-depth-finish>See my map now</button>"+
  "<button type='button' class='ns-depth-plain' data-depth-cancel>Close</button></div>";
  focusEditor();
 }
 function finish(){
  state.complete=true;
  editor.innerHTML="<p class='ns-judge-kicker'>YOUR WORKING MAP</p><h3 tabindex='-1'>What you have uncovered so far</h3>"+
  "<p>This is a hypothesis in your own words. You can change any part of it.</p>"+pathGraph(state.own,true)+
  "<div class='ns-depth-agency'><h4>The part you may have more choice over</h4>"+
  "<p><strong>Possible rule:</strong> "+(state.own.rule?e(state.own.rule):"You may not have an answer yet.")+"</p>"+
  "<p><strong>A more flexible possibility:</strong> "+(state.own.alternative?e(state.own.alternative):"You can leave this open.")+"</p>"+
  "<p><strong>A safe next step:</strong> "+(state.own.action?e(state.own.action):"Consider one when you are ready.")+"</p>"+
  "<p>Ask where the old rule fits your current life and where it does not. If a threat is real, the environment may need to change.</p></div>"+
  "<div class='ns-depth-actions'><button type='button' class='ns-depth-primary' data-depth-download>Download this map</button>"+
  "<button type='button' class='ns-depth-secondary' data-depth-edit>Edit my answers</button>"+
  "<button type='button' class='ns-depth-secondary' data-depth-clear>Clear my map</button></div>"+
  "<p class='ns-depth-small' role='status'>Nothing is automatically saved or sent. Only a download you choose will keep these answers after you leave.</p>";
  focusEditor();
 }
 function download(){
  const lines=["Nobody's Simple — Understand Why","Your own working hypothesis, not a diagnosis",""];
  for(const item of DEPTH_LEVELS)lines.push(item.label+":",state.own[item.key]||"(not answered)","");
  const url=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"}));
  const a=document.createElement("a");a.href=url;a.download="nobodys-simple-understand-why.txt";document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }
 host.addEventListener("input",ev=>{
  if(ev.target.matches("[data-depth-search]")){state.query=ev.target.value;state.all=false;drawList();}
  if(ev.target.matches("[data-depth-answer]"))state.own[DEPTH_LEVELS[state.step].key]=ev.target.value.slice(0,1200);
 });
 host.addEventListener("change",ev=>{
  if(ev.target.matches("[data-depth-group]")){state.group=ev.target.value;state.all=false;drawList();}
 });
 host.addEventListener("click",ev=>{
  const b=ev.target.closest("button");if(!b||!host.contains(b))return;
  if(b.hasAttribute("data-depth-toggle")){state.opened=!state.opened;body.hidden=!state.opened;b.setAttribute("aria-expanded",String(state.opened));b.querySelector("span").textContent=state.opened?"↑":"↓";return;}
  if(b.hasAttribute("data-depth-browse")){if(browser.hidden)browse();else{browser.hidden=true;b.setAttribute("aria-expanded","false");}return;}
  if(b.dataset.depthStart){start(b.dataset.depthStart);return;}
  if(b.hasAttribute("data-depth-more")){state.all=true;drawList();return;}
  if(b.hasAttribute("data-depth-root")){state.root=b.dataset.depthRoot;state.all=false;browse();return;}
  if(b.dataset.depthSelect){state.chosen=b.dataset.depthSelect;drawExample(true);return;}
  if(b.hasAttribute("data-depth-next")){if(state.step<DEPTH_LEVELS.length-1){state.step++;drawEditor();}else finish();return;}
  if(b.hasAttribute("data-depth-back")){state.step=Math.max(0,state.step-1);drawEditor();return;}
  if(b.hasAttribute("data-depth-finish")){finish();return;}
  if(b.hasAttribute("data-depth-edit")){state.complete=false;state.step=0;drawEditor();return;}
  if(b.hasAttribute("data-depth-download")){download();return;}
  if(b.hasAttribute("data-depth-clear")){state.own={};editor.hidden=true;state.editing=false;return;}
  if(b.hasAttribute("data-depth-cancel")){editor.hidden=true;state.editing=false;}
 });
 drawExample();drawList();
}
