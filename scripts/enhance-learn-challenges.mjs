/** Strengthen MCQs without replacing the historical answer IDs or scoring.
 * Sources: hand-written case seeds and topic-specific plausible alternatives.
 * Use after the introductory units are built, on the existing applied module.
 * Does not alter completed progress keys, published node IDs or activity count.
 */
const norm=x=>String(x||'').toLocaleLowerCase('en').replace(/\s+/g,' ').trim();
const lightlyObvious=x=>/\b(always|never|everyone|nobody|entirely|automatically|definitely|certainly|regardless|completely|necessarily|guarantee|cannot|must be|all situations|one explanation|proves? that|diagnose the|every future)\b/i.test(x||'');
const hash=x=>[...String(x||'')].reduce((n,ch)=>(Math.imul(n,33)+ch.codePointAt(0))>>>0,5381);
function typeOf(node,prompt){
 const s=(node.type+' '+node.title+' '+prompt).toLowerCase();
 if(node.type==='investigate'||/\b(evidence|investigat|test|verify|check|information|observe|discriminat|find out)\b/.test(s)&&!/new evidence|updated evidence|evidence now/.test(s))return 'checks';
 if(node.type==='respond'||/\b(respond|reply|action|strategy|step|would you do|should (you|they|we)|repair the relationship|proportionate response|first move)\b/.test(s))return 'actions';
 return 'interpretations';
}
function alternatives(kind,bank,seed,node){
 const b=bank[kind]||[];
 const unique=[];
 const add=(text,reason)=>{
  if(!text||unique.some(v=>norm(v.text)===norm(text)))return;
  unique.push({text,reason:reason||'This is plausible, but it does not distinguish the competing accounts as directly as the selected answer.'});
 };
 b.forEach(v=>add(v.text,v.reason));
 if(kind==='actions'){
  (seed.responses||[]).forEach((s,i)=>add(s,'This may be helpful at another stage. We still need a response that fits the practical aim and the current evidence.'));
  add('Seek agreement on a specific next step, then check whether it actually addresses the concern.','A jointly agreed next step is reasonable, though the other person may still decline.');
  add('Ask each person to set out their own immediate concern before deciding whether to escalate.','This can reveal different priorities, but it may also delay an urgent factual correction.');
 }else if(kind==='checks'){
  add(seed.test,'This is useful evidence, though its value depends on the precise question being asked.');
  add('Compare the accounts against records made at the time rather than relying on recollection alone.','Contemporaneous records may improve accuracy without necessarily identifying a psychological function.');
  add('Examine whether a similar response occurs when the immediate practical stakes are different.','A pattern could test generalisation, although the settings may not be comparable.');
  add('Ask both people what they expected would happen next and compare their predictions with the observed outcome.','Expectations matter, but retrospective reports may be incomplete or influenced by hindsight.');
 }else{
  add(seed.rival,'This is a plausible competing hypothesis. Its relative strength depends on whether it accounts for the most revealing details.');
  add(seed.formulation,'A process formulation may fit, but the evidence may also support other contributors.');
  add('The meaning of the event may differ between the speakers, even when they agree about the observable facts.','Different interpretations may contribute, but this is not yet specific enough to explain the response.');
  add('The immediate context may account for more of the reaction than a stable personal tendency would.','Situation-specific pressure is plausible, though the evidence may indicate an additional process.');
  add('A previous disagreement may have shaped the response, making the present conversation part of a longer pattern.','History could matter, but that earlier pattern has not yet been established.');
 }
 const offset=hash(node.id)%Math.max(1,unique.length);
 return [...unique.slice(offset),...unique.slice(0,offset)];
}
function improveQuestion(options,answer,key,category,bank,seed,node,minimum=5,replyChoices=false){
 const old=Array.isArray(options)?options:[];
 if(old.length<2||!old.some(o=>o.id===answer))return old;
 const pool=alternatives(category,bank,seed,node);
 const used=new Set(old.map(o=>norm(o.label)));
 const next=pool.filter(a=>!used.has(norm(a.text)));
 let cursor=0,serial=0;
 const take=()=>{
  while(cursor<next.length&&used.has(norm(next[cursor].text)))cursor++;
  const v=next[cursor++];
  if(!v)return null;
  used.add(norm(v.text));
  serial++;
  const alternative={id:key+'-alternative-'+serial,label:v.text,feedback:v.reason};
  if(replyChoices&&category==='actions'){
   alternative.reply=(seed.follow||[])[1]||'I need to think about that.';
   alternative.consequence=v.reason;
  }
  return alternative;
 };
 const kept=old.map(o=>{
  if(o.id===answer)return o;
  if(!lightlyObvious(o.label))return o;
  const candidate=take();
  if(!candidate)return o;
  // Preserve historical wrong-answer identifiers in case records or staff edits refer to them.
  return {...o,label:candidate.label,feedback:candidate.feedback,
   ...(replyChoices&&category==='actions'?{reply:candidate.reply,consequence:candidate.consequence}:{})};
 });
 while(kept.length<minimum){const candidate=take();if(!candidate)break;kept.push(candidate);}
 return kept;
}
export function enhanceAppliedChoices(bundle,caseSeed,challengeBank){
 if(bundle?.id!==caseSeed?.id||bundle.id!==challengeBank?.id)throw Error('Challenge data and course are out of sync');
 const applied=bundle.modules.find(m=>m.id===bundle.id+'-module-01');
 if(!applied)throw Error('Applied case missing for '+bundle.id);
 for(const lesson of applied.lessons||[])for(const node of lesson.nodes||[]){
  if(node.type==='dialogue'){
   for(const check of node.checks||[]){
    const category=typeOf(node,check.prompt);
    check.options=improveQuestion(check.options,check.answer,check.id,category,challengeBank,caseSeed,node,5,true);
    if(check.options.length<5)throw Error('Incomplete dialogue options '+check.id);
   }
  }else if(['choose','respond','repair','investigate','update','perspective'].includes(node.type)){
   const category=typeOf(node,node.prompt);
   node.options=improveQuestion(node.options,node.answer,node.id,category,challengeBank,caseSeed,node,5);
   if(node.options.length<5)throw Error('Incomplete MCQ options '+node.id);
  }else if(node.type==='character'){
   node.evidenceOptions=improveQuestion(node.evidenceOptions,node.evidenceAnswer,node.id+'-evidence','interpretations',challengeBank,caseSeed,node,4);
   node.responseOptions=improveQuestion(node.responseOptions,node.responseAnswer,node.id+'-response','actions',challengeBank,caseSeed,node,4);
  }else if(node.type==='predict'){
   node.changes=improveQuestion(node.changes,node.correctChange,node.id+'-change','actions',challengeBank,caseSeed,node,3);
   if(node.outcomes?.length===2){
    const altId=node.id+'-outcome-alt';
    if(!node.outcomes.some(o=>o.id===altId))node.outcomes.push({
     id:altId,label:'The immediate tension may ease without settling the underlying concern or establishing anyone’s motive.',
     feedback:'Short-term relief is possible, but the question asks what the proposed response would most directly change.'
    });
   }
  }
 }
 return bundle;
}
