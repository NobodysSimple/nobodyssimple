/**
 * Evidence-thread learning, written for the Narcissism curriculum.
 * This is a reusable staff-authored node, not a claim that somebody's private
 * thoughts can be read from a conversation.
 */
export const INVESTIGATION_DEPTHS=Object.freeze([
 'What happened','What did the message do?','What changes the meaning?',
 'What might feel threatened?','What conflict might lie underneath?',
 'What might this response protect?','How does it affect the other person?',
 'What loop could develop?','What other account fits?',
 'What evidence and action now matter?'
]);
const clean=s=>String(s??'');
export function createInvestigation(id=()=>String(Math.random())){
 return {
  id:id(),type:'investigation',title:'A conversation worth examining',
  prompt:'Study the messages, then examine how each new piece of context changes your interpretation.',
  scenario:'',speakerA:'Person A',speakerB:'Person B',conceptId:'',sources:'',
  turns:[{id:id(),speaker:'a',text:''},{id:id(),speaker:'b',text:''}],
  profiles:[{speaker:'a',name:'Person A',role:'',history:'',temperament:'',pressure:''},{speaker:'b',name:'Person B',role:'',history:'',temperament:'',pressure:''}],
  layers:INVESTIGATION_DEPTHS.map((title,index)=>({id:id(),title,focusTurn:'',analysis:'',alternative:'',test:'',...(index===7?{loop:{trigger:'',response:'',recipient:'',cycle:'',alternative:''}}:{})})),
  checks:[{id:id(),prompt:'',focusTurn:'',options:[{id:id(),label:''},{id:id(),label:''}],answer:'',explanation:'',counterexample:''}],
  takeaway:''
 };
}
const validText=s=>typeof s==='string'&&s.trim().length>0;
export function validateInvestigation(node){
 const issues=[];
 const turns=node?.turns||[],layers=node?.layers||[],checks=node?.checks||[];
 if(!validText(node?.scenario))issues.push('Describe the relationship and the reason for this exchange.');
 if(turns.length<6||turns.length>40||!turns.every(t=>validText(t.id)&&validText(t.text)&&['a','b'].includes(t.speaker)))issues.push('Write 6–40 messages from two people.');
 if(node.profiles&&(!Array.isArray(node.profiles)||node.profiles.length!==2||
  node.profiles.some(p=>!['a','b'].includes(p.speaker)||!validText(p.name)||!validText(p.role)||!validText(p.history)||!validText(p.temperament)||!validText(p.pressure))))
  issues.push('Both profiles must introduce the person, their established history, habitual style and current pressure.');
 if(layers.length!==10||layers.some(l=>!validText(l.title)||!validText(l.analysis)||!validText(l.alternative)||!validText(l.test)))issues.push('Write all ten depths, including a plausible alternative and discriminating evidence.');
 if(layers.some(l=>l.focusTurn&&!turns.some(t=>t.id===l.focusTurn)))issues.push('Every analysis focus must reference a message in the thread.');
 const loop=layers[7]?.loop;
 if(loop&&['trigger','response','recipient','cycle','alternative'].some(key=>!validText(loop[key])))issues.push('Complete all relationship-loop steps, including a possible interruption.');
 if(checks.length<2||checks.length>8)issues.push('Write 2–8 assessed reasoning questions.');
 for(const c of checks){
  if(!validText(c.id)||!validText(c.prompt)||!validText(c.explanation)||!validText(c.counterexample)||!Array.isArray(c.options)||c.options.length<2||c.options.length>4||c.options.some(o=>!validText(o.id)||!validText(o.label))||!c.options.some(o=>o.id===c.answer))issues.push('Every check needs a prompt, 2–4 credible options, an answer, a reason and a limitation.');
 }
 return issues;
}
/**
 * A message-led reasoning workspace. The transcript remains visible.
 * The user's own interpretations are private, optional, and never marked
 * correct or incorrect by matching them against hidden psychodynamic claims.
 */
export function renderInvestigation(node,state,esc,choiceSet){
 const turns=Array.isArray(node.turns)?node.turns:[];
 const layers=Array.isArray(node.layers)?node.layers:[];
 const visible=Math.max(1,Math.min(turns.length,Number(state.investigationVisible)||1));
 const complete=visible>=turns.length;
 const stage=Math.max(0,Math.min(layers.length-1,Number(state.investigationStage)||0));
 const layer=layers[stage]||{};
 const selectedTurn=state.investigationFocus||'';
 const opened=!!state.investigationOpened?.[stage];
 const named=t=>t.speaker==='b'?node.speakerB:node.speakerA;
 const profiles=Array.isArray(node.profiles)&&node.profiles.length?'<section class="ns-inquiry__profiles" aria-label="Case files">'+
  '<h2>What you know about them</h2>'+
  '<p class="ns-inquiry__profiles-help">These details matter. A later question may depend on something easy to overlook here.</p>'+
  '<div class="ns-inquiry__profile-grid">'+node.profiles.map(p=>
   '<article class="ns-inquiry__profile"><h3>'+esc(p.name||'Person')+'</h3>'+
   '<p><strong>Role:</strong> '+esc(p.role||'')+'</p>'+
   '<p><strong>Known history:</strong> '+esc(p.history||'')+'</p>'+
   '<p><strong>Usual approach:</strong> '+esc(p.temperament||'')+'</p>'+
   '<p><strong>Current pressure:</strong> '+esc(p.pressure||'')+'</p></article>'
  ).join('')+'</div></section>':'';
 const messages='<section class="ns-inquiry__exchange" aria-label="Unfolding conversation">'+
 '<p class="ns-inquiry__message-count" aria-live="polite">Message '+visible+' of '+turns.length+'</p>'+
 '<ol class="ns-inquiry__thread" aria-label="Conversation transcript">'+turns.slice(0,visible).map((t,i)=>
   '<li class="ns-inquiry__turn'+(selectedTurn===t.id?' is-focus':'')+'" data-speaker="'+esc(t.speaker)+'">'+
   '<button type="button" class="ns-inquiry__message" data-investigation-turn="'+esc(t.id)+'" aria-pressed="'+(selectedTurn===t.id)+'" aria-label="Inspect message '+(i+1)+' from '+esc(named(t))+'">'+
   '<small>'+esc(named(t))+' · '+(i+1)+'</small><span>'+esc(t.text||'')+'</span></button></li>'
 ).join('')+'</ol>'+
 (!complete?'<button type="button" class="ns-inquiry__next-message" data-investigation-reveal>Read next message →</button>':
 '<p class="ns-inquiry__all-read">End of exchange. You can revisit every message while testing your interpretation.</p>')+'</section>';
 const intro='<p class="ns-inquiry__intro">'+esc(node.scenario||'')+'</p>';
 if(!complete)return '<div class="ns-inquiry">'+intro+profiles+messages+'</div>';
 const nav='<nav class="ns-inquiry__stage-nav" aria-label="Depth of analysis">'+layers.map((l,i)=>
  '<button type="button" data-investigation-stage="'+i+'" aria-current="'+(stage===i?'step':'false')+'" title="'+esc(l.title)+'">'+(i+1)+'</button>'
 ).join('')+'</nav>';
 const selected=turns.find(t=>t.id===selectedTurn)||turns.find(t=>t.id===layer.focusTurn);
 const focused=selected?'<div class="ns-inquiry__focused"><strong>Message under examination</strong><p>'+esc(named(selected)+': '+selected.text)+'</p></div>':'';
 const route=Number(state.investigationRoutes?.[stage]||0);
 const mind=(stage===4||stage===5)?'<div class="ns-inquiry__mind"><h3>Inside the head: two possible explanations</h3>'+
  '<p>These are possible accounts, not recordings of private thoughts.</p>'+
  '<div class="ns-inquiry__mind-choice" role="group" aria-label="Compare possible motives">'+
  '<button type="button" data-investigation-route="0" aria-pressed="'+(route===0)+'">Threat or conflict</button>'+
  '<button type="button" data-investigation-route="1" aria-pressed="'+(route===1)+'">Another explanation</button></div>'+
  '<p class="ns-inquiry__mind-text">'+esc(route===0?layer.analysis:layer.alternative)+'</p>'+
  '<h3>What evidence could settle the difference?</h3><p>'+esc(layer.test||'')+'</p></div>':'';
 const loop=stage===7?layer.loop:null;
 const step=Math.max(1,Math.min(5,Number(state.investigationLoopSteps?.[stage]||1)));
 const names=['What happened','How one person responds','How the other person responds','What could reinforce the pattern','A different route'];
 const loopKeys=['trigger','response','recipient','cycle','alternative'];
 const loopView=loop?'<div class="ns-inquiry__loop"><h3>Follow the relationship loop</h3><ol>'+
  loopKeys.slice(0,step).map((key,i)=>'<li><strong>'+names[i]+'</strong><p>'+esc(loop[key]||'')+'</p></li>').join('')+'</ol>'+
  (step<5?'<button type="button" data-investigation-loop-next>See the next effect →</button>':'<p class="ns-inquiry__loop-end" tabindex="-1">Compare this possible loop with what you actually observed.</p>')+
 '</div>':'';
 const ordinary=(stage===4||stage===5)?'':'<h3>One explanation</h3><p>'+esc(layer.analysis||'')+'</p>'+
  '<h3>Another account worth testing</h3><p>'+esc(layer.alternative||'')+'</p>'+
  '<h3>What would distinguish them?</h3><p>'+esc(layer.test||'')+'</p>';
 const analysis=opened?'<div class="ns-inquiry__revealed" role="region" aria-label="Worked interpretation">'+
  mind+ordinary+loopView+
  '<p class="ns-inquiry__uncertainty">A case can support several explanations. The available evidence determines how strongly each is supported.</p></div>':
  '<button type="button" class="ns-inquiry__open" data-investigation-open>Explore the psychological reasoning →</button>';
 const workspace='<section class="ns-inquiry__analysis" aria-label="Examine the messages">'+
  '<p class="ns-inquiry__eyebrow">Depth '+(stage+1)+' of '+layers.length+'</p><h2>'+esc(layer.title||'Interpret the exchange')+'</h2>'+
  focused+'<p class="ns-inquiry__investigate-hint">Use the profile details and the messages to decide which explanation fits. Open the analysis when you want to compare your reading.</p>'+
  analysis+'<div class="ns-inquiry__adjacent">'+
  (stage>0?'<button type="button" data-investigation-stage="'+(stage-1)+'">← Previous depth</button>':'')+
  (stage<layers.length-1?'<button type="button" data-investigation-stage="'+(stage+1)+'">Next depth →</button>':'')+'</div></section>';
 const check=node.checks?.[state.dialogueCheck];
 const question=state.dialogueCheck<0?'<p class="ns-inquiry__ready">Review any detail before beginning the drills. Your answers should follow the evidence, including the person’s profile.</p>':
 '<section class="ns-inquiry__question"><p class="ns-inquiry__eyebrow">Reasoning drill '+(state.dialogueCheck+1)+' / '+node.checks.length+'</p>'+
 '<h2>'+esc(check?.prompt||'')+'</h2>'+
 choiceSet('dialogue-choice',check?.options||[],state.investigationChoice||state.answers?.[node.id]?.[check?.id]||'',!!state.checked)+'</section>';
 // During checks, keep evidence one click away without forcing the learner
 // to scroll past ten messages and the entire expert explanation for each item.
 if(state.dialogueCheck>=0){
  const review='<details class="ns-inquiry__review"><summary>Review the character profiles</summary>'+profiles+'</details>'+
   '<details class="ns-inquiry__review"><summary>Review the full message exchange</summary>'+messages+'</details>'+
   '<details class="ns-inquiry__review"><summary>Review the psychological analysis</summary>'+nav+workspace+'</details>';
  return '<div class="ns-inquiry ns-inquiry--checks">'+question+review+'</div>';
 }
 return '<div class="ns-inquiry">'+intro+profiles+messages+
  '<h2 class="ns-inquiry__depth-title">Investigate what happened</h2>'+nav+workspace+question+'</div>';
}
