/**
 * Dialogue Lab: a single message is revealed with each learner tap.
 * The scene must be fully read before analysis begins; staff previews use
 * the same interaction. All dialogue is escaped by the host renderer.
 */
export function renderDialogue(node,state,esc,fieldset){
 const turns=node.turns||[],checks=node.checks||[];
 const check=state.dialogueCheck>=0?checks[state.dialogueCheck]:null;
 const focus=check?.focusTurn||'';
 const visible=check?turns.length:Math.min(turns.length,Math.max(1,Number(state.dialogueVisible)||1));
 const transcript='<ol class="ns-learn-player__dialogue" aria-label="Conversation transcript" aria-live="polite">'+turns.slice(0,visible).map((turn,i)=>{
  const who=turn.speaker==='a'?(node.speakerA||'Person A'):(node.speakerB||'Person B');
  return '<li class="ns-learn-player__dialogue-line" data-speaker="'+(turn.speaker==='b'?'b':'a')+'"'+(turn.id===focus?' data-spotlight="true"':'')+'><span class="ns-learn-player__dialogue-speaker">'+esc(who)+' · '+(i+1)+'</span><p>'+esc(turn.text)+'</p></li>';
 }).join('')+'</ol>';
 const intro='<p class="ns-learn-player__dialogue-intro">'+esc(node.scenario||'Read the exchange and consider what each person may be trying to communicate.')+'</p>';
 const reveal=!check&&visible<turns.length?'<button type="button" class="ns-learn-player__reveal" data-dialogue-reveal aria-label="Show message '+(visible+1)+' of '+turns.length+'">Show next message <span aria-hidden="true">→</span><small>'+visible+' / '+turns.length+'</small></button>':'';
 const task=check?'<section class="ns-learn-player__dialogue-task"><p class="ns-learn-player__eyebrow">Dialogue question '+(state.dialogueCheck+1)+' of '+checks.length+'</p><h2>'+esc(check.prompt)+'</h2>'+(focus?'<p class="ns-learn-player__dialogue-spotlight">The relevant line is highlighted above. Use the wider context too.</p>':'')+fieldset('dialogue-choice',check.options,state.answers[node.id]?.[check.id]||'',!!state.checked)+'</section>':visible===turns.length?'<p class="ns-learn-player__dialogue-spotlight">Now examine what the characters actually said. The best explanation should fit the evidence, including what remains uncertain.</p>':'';
 return '<div class="ns-learn-player__dialogue-lab">'+intro+transcript+reveal+task+'</div>';
}
