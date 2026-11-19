/**
 * End-of-lesson correction practice. A missed check is scheduled once after
 * the learner has worked through the rest of the lesson. First-attempt scores
 * stay separate from corrected responses.
 */
export function createRepairQueue(){return {pending:[],seen:new Set(),finished:[]};}
export function addRepair(queue,nodeIndex,checkIndex=null){
 const key=String(nodeIndex)+':'+(checkIndex===null?'node':checkIndex);
 if(queue.seen.has(key))return false;
 queue.seen.add(key);
 queue.pending.push({key,nodeIndex,checkIndex});
 return true;
}
export function takeRepair(queue){return queue.pending.shift()||null;}
export function finishRepair(queue,task,correct){
 queue.finished.push({key:task.key,correct:!!correct});
}
export function repairSummary(queue){
 const missed=queue.seen.size;
 const recovered=queue.finished.filter(x=>x.correct).length;
 return {missed,retried:queue.finished.length,recovered,stillToReview:missed-recovered};
}
/** Accessible short cues made from original tones, no audio files or analytics. */
const PREF='ns-learn-feedback-sound';
export function readSoundPreference(storage=globalThis.localStorage){
 try{return storage?.getItem(PREF)!=='off';}catch{return true;}
}
export function saveSoundPreference(enabled,storage=globalThis.localStorage){
 try{storage?.setItem(PREF,enabled?'on':'off');}catch{}
}
export function playLearningCue(correct,enabled=true,scope=globalThis){
 if(!enabled||typeof scope?.AudioContext!=='function'&&typeof scope?.webkitAudioContext!=='function')return false;
 let context;
 try{
  const AudioContext=scope.AudioContext||scope.webkitAudioContext;
  context=new AudioContext();
  const tone=(offset,freq,duration,gain)=>{
   const oscillator=context.createOscillator(),volume=context.createGain();
   oscillator.type='sine';
   oscillator.frequency.setValueAtTime(freq,context.currentTime+offset);
   volume.gain.setValueAtTime(0.0001,context.currentTime+offset);
   volume.gain.exponentialRampToValueAtTime(gain,context.currentTime+offset+0.012);
   volume.gain.exponentialRampToValueAtTime(0.0001,context.currentTime+offset+duration);
   oscillator.connect(volume);volume.connect(context.destination);
   oscillator.start(context.currentTime+offset);oscillator.stop(context.currentTime+offset+duration+0.012);
  };
  if(correct){tone(0,523.25,.14,.035);tone(.15,659.25,.18,.032);}
  else {tone(0,330,.18,.025);tone(.19,246.94,.19,.020);}
  // No timer or background loop: the oscillator nodes stop themselves.
  return true;
 }catch{
  try{void context?.close?.();}catch{}
  return false;
 }
}
export const correctAnswerText=(node,check=null)=>{
 const item=check||node;
 if(!item)return '';
 if(item.answer&&Array.isArray(item.options))return item.options.find(o=>o.id===item.answer)?.label||'';
 if(node?.type==='complete')return (node.answers||[])[0]||'';
 if(node?.type==='label')return (node.segments||[]).filter(x=>x.answer).map(x=>x.text).join(' · ');
 if(['chain','rank','sequence'].includes(node?.type))return (node.steps||[]).map(x=>x.label).join(' → ');
 if(node?.type==='predict')return [node.changes?.find(x=>x.id===node.correctChange)?.label,node.outcomes?.find(x=>x.id===node.correctOutcome)?.label].filter(Boolean).join(' → ');
 if(node?.type==='character')return [node.evidenceOptions?.find(x=>x.id===node.evidenceAnswer)?.label,node.responseOptions?.find(x=>x.id===node.responseAnswer)?.label].filter(Boolean).join(' → ');
 if(node?.type==='confidence_dial')return node.correctDirection==='lower'?'Reduce confidence':node.correctDirection==='higher'?'Increase confidence':'Keep confidence roughly unchanged';
 return '';
};
