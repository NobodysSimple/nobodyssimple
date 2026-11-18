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
  (seed.responses||[]).forEach((s,i)=>{if(i===1)return;add(s,'This may be helpful at another stage. We still need a response that fits the practical aim and the current evidence.');});
  add('Seek agreement on a specific next step, then check whether it actually addresses the concern.','A jointly agreed next step is reasonable, though the other person may still decline.');
  add('Ask each person to set out their own immediate concern before deciding whether to escalate.','This can reveal different priorities, but it may also delay an urgent factual correction.');
 }else if(kind==='checks'){
  add('Compare the accounts against records made at the time rather than relying on recollection alone.','Contemporaneous records may improve accuracy without necessarily identifying a psychological function.');
  add('Examine whether a similar response occurs when the immediate practical stakes are different.','A pattern could test generalisation, although the settings may not be comparable.');
  add('Ask both people what they expected would happen next and compare their predictions with the observed outcome.','Expectations matter, but retrospective reports may be incomplete or influenced by hindsight.');
 }else{
  add(seed.rival,'This is a plausible competing hypothesis. Its relative strength depends on whether it accounts for the most revealing details.');
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
  if(!lightlyObvious(o.label)&&!(category==='actions'&&(norm(o.label)===norm(seed.avoid)||/^(before making any decision|let's ask someone else to intervene|let's leave the inaccurate|keep increasing the hours)/i.test(o.label))))return o;
  const candidate=take();
  if(!candidate)return o;
  // Preserve historical wrong-answer identifiers in case records or staff edits refer to them.
  return {...o,label:candidate.label,feedback:candidate.feedback,
   ...(replyChoices&&category==='actions'?{reply:candidate.reply,consequence:candidate.consequence}:{})};
 });
 while(kept.length<minimum){const candidate=take();if(!candidate)break;kept.push(candidate);}
 return kept;
}
function openingSource(opening){
 return {
  id:opening.id,rival:opening.rival,formulation:opening.inference,avoid:opening.avoid,
  people:opening.people||[],responses:[],follow:opening.after||[],
  test:'Check whether earlier agreements and actual outcomes support the speaker’s interpretation.'
 };
}
function openingAlternatives(opening,extra){
 const limit=opening.boundary||'A single exchange cannot establish a lasting motive.';
 const make=(text,reason)=>({text,reason});
 const weak='This is a reasonable line of inquiry, although '+opening.inference+' is more directly tied to the words in this scene. '+limit;
 return {
  id:opening.id,
  interpretations:[
   ...(extra?.interpretations||[]),
   make(opening.rival,'This alternative deserves consideration. It would become stronger if earlier expectations supported it. '+limit),
   make(opening.alternate,'This could explain the immediate behaviour, but it needs facts beyond the present conversation. '+limit),
   make('The practical constraint may be the largest contributor to this disagreement, with the emotional response emerging from frustration about the outcome.',weak),
   make('The speakers may agree about the event but attach different meanings to its consequences for their relationship or responsibilities.',weak),
   make('The reaction may reflect an earlier expectation that neither speaker has described clearly in the exchange.',weak)
  ],
  actions:[
   ...(extra?.actions||[]),
   make('Ask the speakers to state the concrete agreement they believe existed before negotiating a change.','Clarifying an agreement may help, although it may not address the immediate concern if that part is already clear.'),
   make('Acknowledge the worry expressed in the reply and invite a specific change that both people could check.','This can open a conversation, but the initial practical limit may still require a clear answer.'),
   make('Suggest an independent review of the relevant facts if the direct discussion has stalled.','Outside review may help later, though it may be disproportionate before an ordinary direct request has been tried.'),
   make('Ask what information each person would need before being willing to revise their position.','This clarifies flexibility, but evidence gathering alone may not solve a time-sensitive need.'),
   make('Offer a limited trial of one practical adjustment while keeping the original concern open for review.','A trial can provide information, but it may not solve a situation that requires a clear immediate answer.')
  ],
  checks:[
   make('Check whether the speakers had agreed on the practical expectation before the exchange.','The agreement may determine whether the original request was reasonable, although not why the response was so strong.'),
   make('Compare statements made at the time with each person’s later recollection.','A contemporaneous record can help separate a mistaken memory from a disputed interpretation.'),
   make('Examine whether the same reaction appears when the immediate practical stakes are lower.','A cross-situation comparison may reveal whether this is a case-specific response.'),
   make('Observe what happens after a clear and workable alternative is offered.','A response to a specific alternative can reveal what the person is actually trying to preserve.'),
   make('Ask whether the feared consequence has occurred in similar previous situations.','This would help evaluate the prediction, though the contexts need to be comparable.')
  ]
 };
}
export function enhanceAppliedChoices(bundle,caseSeed,challengeBank,openingCase,openingActions){
 if(bundle?.id!==caseSeed?.id||bundle.id!==challengeBank?.id)throw Error('Challenge data and course are out of sync');
 const applied=bundle.modules.find(m=>m.id===bundle.id+'-module-01');
 if(!applied)throw Error('Applied case missing for '+bundle.id);
 for(const [li,lesson] of (applied.lessons||[]).entries())for(const node of lesson.nodes||[]){
  // The first two published lessons use a different original vignette.
  // Do not inject alternatives or character names from the later seed.
  const source=li<2&&openingCase?openingSource(openingCase):caseSeed;
  const bank=li<2&&openingCase?openingAlternatives(openingCase,openingActions):challengeBank;
  if(node.type==='dialogue'){
   for(const [ci,check] of (node.checks||[]).entries()){
    const category=li<2&&openingCase&&ci>0?'actions':typeOf(node,check.prompt);
    check.options=improveQuestion(check.options,check.answer,check.id,category,bank,source,node,5,true);
    if(check.options.length<5)throw Error('Incomplete dialogue options '+check.id);
   }
  }else if(['choose','respond','repair','investigate','update','perspective'].includes(node.type)){
   const category=typeOf(node,node.prompt);
   node.options=improveQuestion(node.options,node.answer,node.id,category,bank,source,node,5);
   if(node.options.length<5)throw Error('Incomplete MCQ options '+node.id);
  }else if(node.type==='character'){
   node.evidenceOptions=improveQuestion(node.evidenceOptions,node.evidenceAnswer,node.id+'-evidence','interpretations',bank,source,node,4);
   node.responseOptions=improveQuestion(node.responseOptions,node.responseAnswer,node.id+'-response','actions',bank,source,node,4);
  }else if(node.type==='predict'){
   node.changes=improveQuestion(node.changes,node.correctChange,node.id+'-change','actions',bank,source,node,3);
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
