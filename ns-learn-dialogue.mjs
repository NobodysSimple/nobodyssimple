/**
 * Dialogue Lab. Learners see one new message at a time; the full exchange
 * stays behind an optional transcript disclosure. Checkpoints keep the
 * transcript available without filling a mobile screen.
 * All learner/staff prose is escaped by the host renderer.
 */
export function renderDialogue(node,state,esc,fieldset){
 const turns=Array.isArray(node.turns)?node.turns:[];
 const checks=Array.isArray(node.checks)?node.checks:[];
 const check=state.dialogueCheck>=0?checks[state.dialogueCheck]:null;
 const visible=check?turns.length:Math.min(turns.length,Math.max(1,Number(state.dialogueVisible)||1));
 const current=turns[visible-1];
 const who=t=>t?.speaker==='a'?(node.speakerA||'Person A'):(node.speakerB||'Person B');
 const bubble=(turn,i)=>'<div class="ns-learn-player__dialogue-line" data-speaker="'+(turn.speaker==='b'?'b':'a')+'"'+(turn.id===check?.focusTurn?' data-spotlight="true"':'')+'><span class="ns-learn-player__dialogue-speaker">'+esc(who(turn))+' · '+(i+1)+'</span><p>'+esc(turn.text)+'</p></div>';
 const intro='<p class="ns-learn-player__dialogue-intro">'+esc(node.scenario||'Read the exchange and examine what is happening.')+'</p>';
 const stage=!check&&current?'<div class="ns-learn-player__dialogue-now" aria-live="polite">'+bubble(current,visible-1)+'</div>':'';
 const historyCount=check?turns.length:Math.max(0,visible-1);
 const history=historyCount?'<details class="ns-learn-player__dialogue-history"><summary>Review conversation <span>('+historyCount+' '+(historyCount===1?'message':'messages')+')</span></summary><ol>'+turns.slice(0,historyCount).map((turn,i)=>'<li>'+bubble(turn,i)+'</li>').join('')+'</ol></details>':'';
 const reveal=!check&&visible<turns.length?'<button type="button" class="ns-learn-player__reveal" data-dialogue-reveal>Continue conversation <span aria-hidden="true">→</span><small>'+visible+' / '+turns.length+'</small></button>':'';
 const focus=check?.focusTurn?turns.find(t=>t.id===check.focusTurn):null;
 const spotlight=focus?'<blockquote class="ns-learn-player__dialogue-focus">'+esc(who(focus))+': “'+esc(focus.text)+'”</blockquote>':'';
 const task=check?'<section class="ns-learn-player__dialogue-task"><p class="ns-learn-player__eyebrow">Reflect · '+(state.dialogueCheck+1)+' / '+checks.length+'</p><h2>'+esc(check.prompt)+'</h2>'+spotlight+fieldset('dialogue-choice',check.options,state.answers[node.id]?.[check.id]||'',!!state.checked)+'</section>':visible===turns.length?'<p class="ns-learn-player__dialogue-spotlight">You have the full exchange. Decide what the evidence can actually support.</p>':'';
 return '<div class="ns-learn-player__dialogue-lab">'+intro+stage+reveal+history+task+'</div>';
}
