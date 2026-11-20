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
/**
 * A message-led reasoning workspace. The transcript remains visible.
 * The user's own interpretations are private, optional, and never marked
 * correct or incorrect by matching them against hidden psychodynamic claims.
 */
export function renderInvestigation(node,state,esc,choiceSet){
 const turns=Array.isArray(node.turns)?node.turns:[],layers=Array.isArray(node.layers)?node.layers:[];
 const stage=Math.max(0,Math.min(layers.length-1,Number(state.investigationStage)||0));
 const layer=layers[stage]||{},turnIndex=turns.findIndex(t=>t.id===layer.focusTurn);
 const selectedTurn=state.investigationFocus||layer.focusTurn;
 const selecting=state.dialogueCheck<0,opened=!!state.investigationOpened?.[stage];
 const note=state.investigationNotes?.[stage]||'';
 const messages='<ol class="ns-inquiry__thread" aria-label="Conversation transcript">'+turns.map((t,i)=>{
  const named=t.speaker==='b'?node.speakerB:node.speakerA;
  return '<li class="ns-inquiry__turn'+(selectedTurn===t.id?' is-focus':'')+'" data-speaker="'+esc(t.speaker)+'">'+
   '<button type="button" class="ns-inquiry__message" data-investigation-turn="'+esc(t.id)+'" aria-pressed="'+(selectedTurn===t.id)+'" aria-label="Inspect message '+(i+1)+' from '+esc(named)+'">'+
   '<small>'+esc(named)+' · '+(i+1)+'</small><span>'+esc(t.text||'')+'</span></button></li>';
 }).join('')+'</ol>';
 const nav='<nav class="ns-inquiry__stage-nav" aria-label="Depth of analysis">'+layers.map((l,i)=>
  '<button type="button" data-investigation-stage="'+i+'" aria-current="'+(stage===i?'step':'false')+'" title="'+esc(l.title)+'">'+(i+1)+'</button>'
 ).join('')+'</nav>';
 const selected=turns.find(t=>t.id===selectedTurn);
 const focused=selected?'<div class="ns-inquiry__focused"><strong>Message under examination</strong><p>'+esc((selected.speaker==='b'?node.speakerB:node.speakerA)+': '+selected.text)+'</p></div>':'';
 const reflection='<label class="ns-inquiry__note"><strong>What is your reading of this moment?</strong>'+
  '<span>Try an explanation before opening the analysis. You can leave this empty if you want a worked example.</span>'+
  '<textarea data-investigation-note rows="3" maxlength="1000" placeholder="What might this response achieve? What else could explain it?">'+esc(note)+'</textarea></label>';
 const mindRoute=Number(state.investigationRoutes?.[stage]||0);
 const inner=(stage===4||stage===5)?'<div class="ns-inquiry__mind">'+
  '<h3>Inside the head: test two possible accounts</h3>'+
  '<p>These are proposed explanations, not a recording of anyone’s thoughts.</p>'+
  '<div class="ns-inquiry__mind-choice" role="group" aria-label="Choose a hypothetical explanation">'+
  '<button type="button" data-investigation-route="0" aria-pressed="'+(mindRoute===0)+'">Threat or inner conflict</button>'+
  '<button type="button" data-investigation-route="1" aria-pressed="'+(mindRoute===1)+'">Alternative explanation</button></div>'+
  '<p class="ns-inquiry__mind-text">'+esc(mindRoute===0?layer.analysis:layer.alternative)+'</p>'+
  '<h3>What evidence might distinguish them?</h3><p>'+esc(layer.test||'')+'</p></div>':'';
 const loop=layer.loop&&stage===7?layer.loop:null;
 const loopKeys=['trigger','response','recipient','cycle','alternative'];
 const loopNames=['What started it','Possible response from the first person','How the other person may respond','What may reinforce the cycle','One route that may interrupt it'];
 const shown=Math.max(1,Math.min(5,Number(state.investigationLoopSteps?.[stage]||1)));
 const loopView=loop?'<div class="ns-inquiry__loop"><h3>Relationship loop · two people, one evolving exchange</h3>'+
  '<ol>'+loopKeys.slice(0,shown).map((key,i)=>'<li><strong>'+loopNames[i]+'</strong><p>'+esc(loop[key]||'')+'</p></li>').join('')+'</ol>'+
  (shown<5?'<button type="button" data-investigation-loop-next>See the next effect →</button>':'<p class="ns-inquiry__loop-end">The possible cycle is complete. Compare it with the messages and ask which links still need evidence.</p>')+
  '</div>':'';
 const ordinary=!(stage===4||stage===5)?'<h3>One account supported by the exchange</h3><p>'+esc(layer.analysis||'')+'</p>'+
  '<h3>A different explanation worth considering</h3><p>'+esc(layer.alternative||'')+'</p>'+
  '<h3>Which evidence could distinguish them?</h3><p>'+esc(layer.test||'')+'</p>':'';
 const analysis=opened?'<div class="ns-inquiry__revealed" role="region" aria-label="Expert working interpretation">'+
  (inner||ordinary)+loopView+
  '<p class="ns-inquiry__uncertainty">These are working explanations of a fictional scene. A plausible account is not direct access to a person’s private motives.</p>'+
  '</div>':
  '<button type="button" class="ns-inquiry__open" data-investigation-open>Compare with the psychological analysis →</button>';
 const workspace='<section class="ns-inquiry__analysis" aria-label="Develop your interpretation">'+
  '<p class="ns-inquiry__eyebrow">Reasoning depth '+(stage+1)+' of '+layers.length+'</p>'+
  '<h2>'+esc(layer.title||'Interpret the evidence')+'</h2>'+focused+reflection+analysis+
  '<div class="ns-inquiry__adjacent">'+
   (stage>0?'<button type="button" data-investigation-stage="'+(stage-1)+'">← Earlier depth</button>':'')+
   (stage<layers.length-1?'<button type="button" data-investigation-stage="'+(stage+1)+'">Explore the next depth →</button>':'')+
  '</div></section>';
 const check=node.checks?.[state.dialogueCheck];
 const question=selecting?'<p class="ns-inquiry__ready">Explore the messages in any order. When ready, choose <strong>Apply your reasoning</strong> below. Your private notes are not scored.</p>':
  '<section class="ns-inquiry__question"><p class="ns-inquiry__eyebrow">Apply the reasoning · '+(state.dialogueCheck+1)+' / '+node.checks.length+'</p>'+
  '<h2>'+esc(check?.prompt||'')+'</h2>'+
  choiceSet('dialogue-choice',check?.options||[],state.investigationChoice||state.answers?.[node.id]?.[check?.id]||'',!!state.checked)+'</section>';
 return '<div class="ns-inquiry"><p class="ns-inquiry__intro">'+esc(node.scenario||'')+'</p>'+
  '<p class="ns-inquiry__help">Select a message to inspect it. Move between psychological depths whenever you like. Form your own account before revealing a worked interpretation.</p>'+
  messages+'<h2 class="ns-inquiry__depth-title">Investigate the conversation</h2>'+nav+workspace+question+'</div>';
}
