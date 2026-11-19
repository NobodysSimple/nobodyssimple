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
  layers:INVESTIGATION_DEPTHS.map((title,index)=>({id:id(),title,focusTurn:'',analysis:'',alternative:'',test:''})),
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
 if(layers.length!==10||layers.some(l=>!validText(l.title)||!validText(l.analysis)||!validText(l.alternative)||!validText(l.test)))issues.push('Write all ten depths, including a plausible alternative and discriminating evidence.');
 if(layers.some(l=>l.focusTurn&&!turns.some(t=>t.id===l.focusTurn)))issues.push('Every analysis focus must reference a message in the thread.');
 if(checks.length<2||checks.length>8)issues.push('Write 2–8 assessed reasoning questions.');
 for(const c of checks){
  if(!validText(c.id)||!validText(c.prompt)||!validText(c.explanation)||!validText(c.counterexample)||!Array.isArray(c.options)||c.options.length<2||c.options.length>4||c.options.some(o=>!validText(o.id)||!validText(o.label))||!c.options.some(o=>o.id===c.answer))issues.push('Every check needs a prompt, 2–4 credible options, an answer, a reason and a limitation.');
 }
 return issues;
}
export function renderInvestigation(node,state,esc,choiceSet){
 const turns=Array.isArray(node.turns)?node.turns:[],layers=Array.isArray(node.layers)?node.layers:[];
 const stage=Math.max(0,Math.min(layers.length-1,Number(state.investigationStage)||0)),layer=layers[stage]||{};
 const selecting=state.dialogueCheck<0;
 const turnText=t=>clean(t.text);
 const messages='<ol class="ns-inquiry__thread" aria-label="Conversation transcript">'+turns.map((t,i)=>{
  const named=t.speaker==='b'?node.speakerB:node.speakerA;
  return '<li class="ns-inquiry__turn'+(layer.focusTurn===t.id?' is-focus':'')+'" data-speaker="'+esc(t.speaker)+'"><small>'+esc(named)+' · '+(i+1)+'</small><p>'+esc(turnText(t))+'</p></li>';
 }).join('')+'</ol>';
 const nav='<div class="ns-inquiry__stage-nav" role="group" aria-label="Depth of analysis">'+
 layers.map((l,i)=>'<button type="button" data-investigation-stage="'+i+'" aria-pressed="'+(stage===i)+'" title="'+esc(l.title)+'">'+(i+1)+'</button>').join('')+'</div>';
 const analysis='<section class="ns-inquiry__analysis" aria-live="polite"><p class="ns-inquiry__eyebrow">Depth '+(stage+1)+' of 10</p>'+
 '<h2>'+esc(layer.title||'Interpret the evidence')+'</h2><p>'+esc(layer.analysis||'')+'</p>'+
 '<h3>Another account worth testing</h3><p>'+esc(layer.alternative||'')+'</p>'+
 '<h3>What would help us decide?</h3><p>'+esc(layer.test||'')+'</p>'+
 '</section>';
 const intro='<p class="ns-inquiry__intro">'+esc(node.scenario||'')+'</p>'+
 '<p class="ns-inquiry__help">Read the complete exchange. Select any of the ten numbered depths to examine it more closely; this is an investigation, not ten separate quizzes.</p>';
 const check=node.checks?.[state.dialogueCheck];
 const question=selecting?'<p class="ns-inquiry__ready">When you have examined the messages, choose <strong>Analyse the exchange</strong> to apply what you learned.</p>':
 '<section class="ns-inquiry__question"><p class="ns-inquiry__eyebrow">Your reasoning · '+(state.dialogueCheck+1)+' / '+node.checks.length+'</p>'+
 '<h2>'+esc(check?.prompt||'')+'</h2>'+
 choiceSet('dialogue-choice',check?.options||[],state.investigationChoice||state.answers?.[node.id]?.[check?.id]||'',!!state.checked)+'</section>';
 return '<div class="ns-inquiry">'+intro+messages+'<h2 class="ns-inquiry__depth-title">Examine the psychological layers</h2>'+nav+analysis+question+'</div>';
}
