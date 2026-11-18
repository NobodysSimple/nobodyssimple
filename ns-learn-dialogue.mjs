/** Progressive conversation: reveal one new turn on Continue, retain all
 * earlier turns in an independently scrollable illustrated transcript.
 * Every string is escaped by the host; the shared atlas uses fictional faces.
 */
import {characterPortrait} from './ns-learn-cast.mjs';
export function renderDialogue(node,state,esc,fieldset){
 const turns=Array.isArray(node.turns)?node.turns:[];
 const checks=Array.isArray(node.checks)?node.checks:[];
 const check=state.dialogueCheck>=0?checks[state.dialogueCheck]:null;
 const visible=check?turns.length:Math.min(turns.length,Math.max(1,Number(state.dialogueVisible)||1));
 const cast=[node.speakerA||'Person A',node.speakerB||'Person B'];
 const who=t=>t?.speaker==='a'?cast[0]:cast[1];
 const bubble=(turn,i)=>'<li class="ns-learn-player__dialogue-turn" data-turn="'+esc(turn.id)+'"'+(i===visible-1?' data-newest="true"':'')+'><div class="ns-learn-player__dialogue-avatar">'+characterPortrait(who(turn),cast,esc,true)+'</div><div class="ns-learn-player__dialogue-line" data-speaker="'+(turn.speaker==='b'?'b':'a')+'"'+(turn.id===check?.focusTurn?' data-spotlight="true"':'')+'><span class="ns-learn-player__dialogue-speaker">'+esc(who(turn))+' · '+(i+1)+'</span><p>'+esc(turn.text)+'</p></div></li>';
 const castHeader='<div class="ns-learn-player__scene-cast" aria-label="People in this conversation">'+cast.map(n=>'<span class="ns-learn-player__cast-member">'+characterPortrait(n,cast,esc,true)+'<strong>'+esc(n)+'</strong></span>').join('')+'</div>';
 const intro='<p class="ns-learn-player__dialogue-intro">'+esc(node.scenario||'Read the exchange and examine what is happening.')+'</p>';
 const transcript='<ol class="ns-learn-player__dialogue-transcript" data-dialogue-scroll aria-label="Conversation so far">'+turns.slice(0,visible).map(bubble).join('')+'</ol>';
 const reveal=!check&&visible<turns.length?'<button type="button" class="ns-learn-player__reveal" data-dialogue-reveal>Continue conversation <span aria-hidden="true">→</span><small>'+visible+' / '+turns.length+'</small></button>':'';
 const focus=check?.focusTurn?turns.find(t=>t.id===check.focusTurn):null;
 const spotlight=focus?'<blockquote class="ns-learn-player__dialogue-focus">'+esc(who(focus))+': “'+esc(focus.text)+'”</blockquote>':'';
 const task=check?'<section class="ns-learn-player__dialogue-task"><p class="ns-learn-player__eyebrow">Reflect · '+(state.dialogueCheck+1)+' / '+checks.length+'</p><h2>'+esc(check.prompt)+'</h2>'+spotlight+fieldset('dialogue-choice',check.options,state.answers[node.id]?.[check.id]||'',!!state.checked)+'</section>':visible===turns.length?'<p class="ns-learn-player__dialogue-spotlight">You can scroll back through the conversation before answering.</p>':'';
 return '<div class="ns-learn-player__dialogue-lab">'+intro+castHeader+transcript+reveal+task+'</div>';
}
