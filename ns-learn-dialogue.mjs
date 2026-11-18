/**
 * Safe, text-only Dialogue Lab transcript + checkpoint UI.
 * The host player manages first-attempt answers, navigation and progress.
 */
export function renderDialogue(node,state,esc,fieldset){
 const turns=node.turns||[],checks=node.checks||[];
 const check=state.dialogueCheck>=0?checks[state.dialogueCheck]:null;
 const focus=check?.focusTurn||'';
 const transcript='<ol class="ns-learn-player__dialogue" aria-label="Conversation transcript">'+turns.map((turn,i)=>{
  const who=turn.speaker==='a'?(node.speakerA||'Person A'):(node.speakerB||'Person B');
  return '<li class="ns-learn-player__dialogue-line" data-speaker="'+(turn.speaker==='b'?'b':'a')+'"'+(turn.id===focus?' data-spotlight="true"':'')+'><span class="ns-learn-player__dialogue-speaker">'+esc(who)+' · '+(i+1)+'</span><p>'+esc(turn.text)+'</p></li>';
 }).join('')+'</ol>';
 const intro='<p class="ns-learn-player__dialogue-intro">'+esc(node.scenario||'Read the exchange and consider what each person may be trying to communicate.')+'</p>';
 const task=check?'<section class="ns-learn-player__dialogue-task"><p class="ns-learn-player__eyebrow">Dialogue question '+(state.dialogueCheck+1)+' of '+checks.length+'</p><h2>'+esc(check.prompt)+'</h2>'+(focus?'<p class="ns-learn-player__dialogue-spotlight">The relevant line is highlighted above. Use the wider context too.</p>':'')+fieldset('dialogue-choice',check.options,state.answers[node.id]?.[check.id]||'',!!state.checked)+'</section>':'<p class="ns-learn-player__dialogue-spotlight">Read the full exchange, then explore which techniques and assumptions are supported by what was said. Different perspectives may be reasonable, but the questions ask for the best-supported answer.</p>';
 return '<div class="ns-learn-player__dialogue-lab">'+intro+transcript+task+'</div>';
}
