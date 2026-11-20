/**
 * The Atlas lesson theatre. Small, fast, keyboard-accessible, one task per screen.
 * Source cards are educational prompts; scene variants are generated editorial
 * demonstrations, not claims about anybody's intentions or diagnosis.
 */
import {saveLearnCompletion,saveLearnReview} from "./ns-learn-progress-v2.mjs?v=psy-atlas-20261120";
import {getLearnCourse,LEARN_COMPANIONS} from "./ns-learn-catalog-v2.mjs";
import {portraitCoords} from "./ns-learn-cast.mjs";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const count=18;
const companionVisual=id=>{
 const course=getLearnCourse(id);
 if(!course)return '<span class="ns-atlas-lesson__guide-fallback" aria-hidden="true">✿</span>';
 return course.companionPortrait
  ?'<img class="ns-atlas-lesson__guide-image" src="'+esc(course.mascot)+'" alt="" loading="lazy">'
  :'<span class="ns-atlas-lesson__guide-sprite" aria-hidden="true" style="--face-x:'+Number(course.companionX||0)+'%;--face-y:'+Number(course.companionY||0)+'%"></span>';
};
const speakerAvatar=(name,cast)=>{
 const guide=Object.values(LEARN_COMPANIONS).find(c=>c?.name===name);
 const pos=guide?{x:guide.x,y:guide.y}:portraitCoords(name,cast);
 return '<span class="ns-atlas-lesson__avatar" role="img" aria-label="Nobody’s Simple illustration representing '+esc(name)+'" style="--face-x:'+pos.x+'%;--face-y:'+pos.y+'%"></span>';
};
const clean=x=>String(x||"").trim();
const hash=x=>{let h=2166136261;for(const c of String(x)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};
const rotate=(xs,n)=>xs.map((_,i)=>xs[(i+n)%xs.length]);
const baseNearMiss={
 PROCESS:"A similar feeling may have a different cause. Check whether there is actually a repeating sequence rather than a one-off reaction.",
 OBSERVE:"An uncomfortable remark could be a mistake, poor wording or an ordinary disagreement. Frequency, power and response to correction matter.",
 DISCERN:"The evidence could be compatible with more than one account. A distinction needs concrete additional information.",
 REASON:"A poor argument does not establish malicious intent. Ask whether the conclusion is justified.",
 PRACTISE:"The same wording may be inappropriate when there is danger, unequal power or an unwanted demand.",
 CARE:"A therapeutic method requires a suitable context and meaningful choice. Do not infer a treatment indication from one vignette.",
 EXTENSION:"Similar surface behaviour can have different explanations. Ask for a discriminating observation."
};
const domainPlaces={
 narcissism:["A promotion meeting","The wedding speech","A family group chat","An awards dinner","A flat-share disagreement","An unexpected apology"],
 manipulation:["A late-night disagreement","An awkward work meeting","A group holiday booking","A crowded dinner","A shared bank account discussion","An online group chat"],
 attachment:["A missed evening call","A reunion at the station","A friend's birthday","An argument after work","A long-distance video call","A weekend away"],
 overthinking:["An unsent message","An interview rehearsal","The supermarket decision aisle","A family conversation replay","A work deadline","A late-night conversation"],
 boundaries:["The borrowed car","A last-minute shift request","The birthday table","A demanding friend","A disagreement at home","An office message thread"],
 anxiety:["A meeting tomorrow","A crowded café","A phone call","A planned trip","A training session","An unexpected invitation"],
 emotions:["An abruptly cancelled plan","An apology after a mistake","A surprising compliment","A difficult reunion","A misunderstanding at work","A friendship conversation"],
 "self-esteem":["A corrected assignment","An office presentation","A friend's promotion","A family celebration","An online comment","An honest apology"],
 motivation:["A blank document","A chaotic Monday","A crowded to-do list","The gym door","A missed deadline","A fresh start"],
 "social-anxiety":["A seminar question","A party introduction","An awkward silence","A presentation","A first date","A group chat"],
 burnout:["A late shift","A understaffed team","An urgent email","A missed lunch break","An appraisal meeting","A weekend interrupted"],
 loneliness:["A crowded party","An empty Sunday","A new hobby group","A casual invitation","A friendship misunderstanding","A community event"],
 "social-media":["An endless feed","A viral comment","A late-night notification","A creator's giveaway","A group chat argument","A personalised advert"],
 misinformation:["A dramatic headline","A family WhatsApp rumour","A suspicious video","Three identical news articles","An influencer's claim","A breaking story"],
 neurodiversity:["A sudden schedule change","A noisy meeting","A misunderstood text","An unclear instruction","A sensory-heavy event","An interview accommodation"],
 sleep:["A midnight clock check","An early shift","A restless hotel night","A Sunday lie-in","An evening routine","A discussion about insomnia"],
 "low-mood":["A cancelled plan","An unopened message","An overwhelming morning","A short walk","A difficult workday","A friend's invitation"],
 scams:["A bank security call","A suspicious delivery text","An online marketplace listing","A job offer","A fake family emergency","An urgent invoice"],
 masculinity:["A conversation about style","A family dinner","An online gender debate","A first date","A workplace joke","A personal disclosure"],
 vaping:["An afternoon craving","A social break","A stressful commute","A party","A quit attempt","A friend's offer"],
 "conversation-patterns":["A disagreement over dinner","A chaotic team chat","The wedding guest list","A school reunion","A family WhatsApp argument","A workplace review"]
};
const supportingCast=["Ari","Nell","Moss","Briar","Fern","Cove","Poppy","Echo","Sunny","Tavi","Rowan","Lyra"];
const genre=["COMEDY","SERIOUS","DRAMA","SUBTLE","EVERYDAY","TRANSFER"];
const genericReply=(r,idx)=>{
 const x=(r.title+" "+r.cue).toLowerCase();
 if(r.example)return r.example;
 if(/guilt|debt|sacrif|loyalty|indebted/.test(x))return "After everything I've done, you're seriously going to say no?";
 if(/credit|status|prestige|grandios|admiration|superior/.test(x))return "I don't see why the team should talk about anyone else's contribution when I led this.";
 if(/apolog|repair|accountab|blame/.test(x))return "I suppose I'm sorry, but you're the one who made this such a big issue.";
 if(/memory|gaslight|evidence|denial|reality/.test(x))return "That is not what happened. You're always getting these things wrong.";
 if(/reply|reassuran|abandon|attachment|proximity/.test(x))return "You didn't answer for two hours, so of course I thought you didn't care.";
 if(/withdraw|avoid|space|silent|disappear/.test(x))return "I cannot discuss this now. I don't know when I'll be available again.";
 if(/worr|what.if|uncertain|catastroph|ruminat|checking/.test(x))return "I have checked three times. What if there's one possibility I still missed?";
 if(/start|motivat|procrastinat|task|planning|habit/.test(x))return "I want to get it done. I keep planning it and somehow never start.";
 if(/fear|anxious|judge|scrutin|embarass/.test(x))return "If I say the wrong thing once, everyone will remember it forever.";
 if(/sad|depress|lonely|belong|social/.test(x))return "I keep telling myself I'll reach out once I feel better, but it's been weeks.";
 if(/sleep|insomn|rest|clock|tired/.test(x))return "If I don't fall asleep in the next ten minutes, tomorrow is ruined.";
 if(/scam|fraud|verify|bank|urgency|authority/.test(x))return "This is urgent and confidential. You must act now, without hanging up.";
 if(/argument|fallacy|premise|claim|reason|proof|false/.test(x))return "Everyone agrees with me, so surely that settles whether the claim is true.";
 if(/gender|identity|sex|masculin|feminin/.test(x))return "I don't think people like us are meant to make choices like that.";
 if(/emotion|feeling|anger|shame|guilt/.test(x))return "I feel terrible, so that must mean I've done something terrible.";
 if(/social media|algorithm|attention|notification|feed|screen/.test(x))return "I was going to stop after one clip, but the next video started before I thought about it.";
 if(/neuro|autis|adhd|sensory|executive/.test(x))return "I didn't ignore the instruction. I couldn't find the change in the place I expected.";
 if(/vaping|nicotin|craving|addict|substance/.test(x))return "I used to do it socially, but now the break doesn't feel right without it.";
 if(/respond|request|validation|listening|boundary/.test(x))return "Can we talk about what happened and agree on a specific next step?";
 return idx%2?"I thought I understood it, but the way the situation changed has thrown me.":"This seemed straightforward until I realised we might be reading the same situation differently.";
};
export function makeAtlasScenes(courseId,record,featured=null,round=0){
 const contexts=domainPlaces[courseId]||domainPlaces.boundaries;
 const near=compact(record.nearMiss||baseNearMiss[record.kind]||baseNearMiss.OBSERVE);
 const cue=clean(record.cue);
 const courseGuide=getLearnCourse(courseId)?.companionName||"Moss";
 const sourceTurn=Array.isArray(featured?.turns)&&featured.turns.length>=4?featured.turns:null;
 return Array.from({length:6},(_,i)=>{
  const isNear=i===2||i===4,genreId=(i+round)%genre.length;
  const tone=genre[genreId],place=contexts[(i+round)%contexts.length];
  const a=courseGuide,b=supportingCast[(i+round+hash(record.id)%supportingCast.length)%supportingCast.length]===a?
    supportingCast[(i+round+1)%supportingCast.length]:supportingCast[(i+round+hash(record.id)%supportingCast.length)%supportingCast.length];
  const isFeature=!!sourceTurn&&i===0&&round===0;
  const intro=isFeature?clean(featured.intro):
    tone==="COMEDY"?"An ordinary conversation takes a rather awkward turn.":
    tone==="SERIOUS"?"This decision has practical consequences for both people.":
    tone==="DRAMA"?"New context makes the first explanation much less certain.":
    tone==="SUBTLE"?"The same process can look very different when the words are gentler.":
    tone==="TRANSFER"?"A different setting, similar questions. Apply what you know without the label.":"Observe what happens before deciding what it means.";
  const dialogue=isFeature?sourceTurn.slice(0,6).map(t=>({
    speaker:t.speaker===sourceTurn[0].speaker?a:b,text:t.text
  })): [
   {speaker:a,text:i===0?"I need to ask you something, and I'm trying not to turn it into a whole saga.":
     i===2?"I'm not sure we've heard the whole story yet.":i===5?"The setting is different, but I recognise part of this situation.":"Can we go through what actually happened?"},
   {speaker:b,text:isNear?"I know it looks a certain way, but there's some context you haven't heard.":genericReply(record,i)},
   {speaker:a,text:i===1?"I understand your point. What would we see if that explanation were accurate?":
     i===3?"Can we separate what happened from what we think it meant?":"What could we check before making a judgement?"},
   {speaker:b,text:isNear?"I can explain what happened, and we can check that against the facts.":i===5?
     "That is fair. I think we need to consider the circumstances too.":"I might not agree with you, but let's look at the specific situation."}
  ];
  return {id:record.id+"-s"+i,place,tone,intro,isNear,featured:isFeature,
   observation:isFeature?(clean(featured.spot)||cue):isNear?near:cue,
   newEvidence:isFeature?clean(featured.newEvidence):i===3?
     "A reliable new fact appears. Consider whether it changes the original explanation or only makes it more precise.":
     "Further context can help distinguish a pattern from an isolated incident.",
   turns:dialogue,near,
   correctResponse:!isNear?(isFeature?clean(featured.bestMove)||record.response:record.response):
     "Ask what is actually known and what is still missing; choose a response that does not assume the original label is proven."
  };
 });
}
const compact=s=>clean(s).replace(/^A comparable surface behaviour may instead be\s*/i,"").replace(/\s*The learner should check[\s\S]*$/,"").slice(0,240);
export function createAtlasQuestions(record,scene,round=0){
 const cue=clean(record.cue),near=compact(scene.near);
 const contrast=record.contrast||{title:"a related process",cue:"Other mechanisms can look similar"};
 const action=clean(scene.correctResponse||record.response||"Look for observable evidence and choose a proportionate response.");
 const index=Math.max(0,Number(scene.id.match(/-s(\d+)$/)?.[1]||0));
 const nearAccount=near.length>9?near:"A similar action can occur without the named process.";
 const idea="An episode might fit "+record.title+" if the observed behaviour persists and competing explanations are addressed.";
 const target=scene.isNear?
   "There is not enough evidence to establish "+record.title+" here; the alternative matters.":
   "The details are consistent with "+record.title+", though intention is not proven.";
 const questions=[
  {id:scene.id+"-spot",kind:["Spot the pattern","Identify the cue","Distinguish a near miss","Spot the pattern","Compare interpretations","Transfer the skill"][index],
   mode:index===1?"evidence":index===4?"perspective":index===5?"transfer":scene.isNear?"distinguish":"spot",
   prompt:scene.isNear?"Does the scene prove this is "+record.title+"?":"Which conclusion is best supported by what was observed?",
   options:[
    {id:"observed",label:target},
    {id:"assume",label:"We can confidently infer the person's private intention and personality from this exchange."},
    {id:"unrelated",label:"The best explanation must be "+contrast.title+" because it is another possible concept."}
   ],answer:"observed",why:scene.isNear?
     "A look-alike deserves serious consideration: "+nearAccount:
     "The key observable clue in this example is: "+clean(scene.observation||cue),
   caution:"An observable cue does not establish diagnosis, motive, or repeated abuse."
  },
  {id:scene.id+"-explain",kind:["Find the evidence","Understand the process","Look for alternatives","Update your view","Consider both sides","Explain what transfers"][index],
   mode:["evidence","mechanism","distinguish","update","perspective","transfer"][index],
   prompt:index===0?"Which detail should an observer examine before applying the label?":
    index===2?"What makes the competing explanation important?":
    index===3?"You learn something new. What should happen to your first interpretation?":
    index===4?"How can you avoid mistaking a person's feelings for proof of their intention?":
    index===5?"What must stay the same for the concept to apply in a new setting?":
    "Which way of reasoning best explains this behaviour?",
   options:[
    {id:"test",label:index===0?"The concrete action and its context: "+cue:
       index===2?"Check whether this plausible alternative fits: "+nearAccount:
       index===3?"Update the explanation using the new evidence, keeping any facts that remain supported.":
       index===4?"Separate observed effects from private intentions and ask what each person actually knows.":
       index===5?"The observable mechanism and its consequences, rather than the setting or personality label.":
       record.kind==="REASON"?"Check the reasoning and see whether the conclusion follows from the premises.":
       record.kind==="PRACTISE"?"Consider the person's goal, the method's suitability and their freedom to choose.":
       "Compare what happened before the action, the action itself and what followed."},
    {id:"feeling",label:index===3?"Keep the first interpretation unless somebody proves it was deliberately misleading.":
      index===2?"Discard the original facts whenever a second explanation is imaginable.":
      "Treat emotional intensity as enough to settle what the behaviour means."},
    {id:"label",label:index===0?"Decide the person's character first, then look for clues that agree.":
      index===5?"Look for the same exact words regardless of whether their function changes.":
      "Rely on the label alone rather than checking what happened."}
   ],answer:"test",
   why:index===0?"Source observation: "+cue:
     index===2?"A discriminating alternative is: "+nearAccount:
     index===3?"New evidence may strengthen, weaken or qualify a claim. It need not erase everything known.":
     index===4?"Two people can sincerely disagree about meaning while the effects of their conduct still matter.":
     index===5?"Recognising a process requires transferable evidence, not a memorised phrase.":
     "Look for the sequence and competing explanations before assuming a motive.",
   caution:"Notice the context, the person's actual options and what remains unknown."
  },
  {id:scene.id+"-respond",kind:index===5?"Choose a transfer response":"Choose your response",
   mode:index===5?"transfer":"respond",
   prompt:index===2||index===4?"How could you respond without overclaiming what happened?":
     index===5?"Which next step fits this new setting?":"What is the most proportionate next move?",
   options:[
    {id:"action",label:action},
    {id:"force",label:"Demand that the other person admit the psychological label before discussing the specific issue."},
    {id:"avoid",label:"Make no attempt to distinguish facts from assumptions; treat the issue as settled to keep the peace."}
   ],answer:"action",why:"Source-aligned decision principle: "+action,
   caution:"If direct challenge is unsafe, documentation, boundaries or disengagement may be more suitable."
  }
 ];
 return questions.map(q=>({...q,options:rotate(q.options,hash(record.id+scene.id+q.id+round)%3)}));
}
export function strategyMastery(scores){
 const first=scores.slice(0,count);
 if(first.length!==count)return {passed:false,correct:0,total:count};
 const correct=first.filter(Boolean).length,late=first.slice(-6).filter(Boolean).length;
 return {passed:correct>=15&&late>=5,correct,total:count,late};
}
export function renderStrategyLesson(root,bundle,lesson,{review=false,preview=false}={}){
 const record=lesson.atlasRecord,home="#learn/course/"+encodeURIComponent(bundle.id);
 if(!record){root.textContent="This Atlas lesson has no source record.";return;}
 const state={phase:"intro",question:0,visible:1,round:0,selected:"",checked:false,feedback:null,answers:[],saved:false,hintOpen:false};
 let scenes=makeAtlasScenes(bundle.id,record,lesson.featuredCase,0),score=null;
 const current=()=>{const scene=scenes[Math.floor(state.question/3)],q=createAtlasQuestions(record,scene,state.round)[state.question%3];return {scene,q};};
 const selected=()=>root.querySelector("input[name=atlas-answer]:checked")?.value||"";
 const getText=(v)=>esc(v).replace(/\n/g,"<br>");
 function paint({focus=false}={}){
  const previous=root.querySelector(".ns-atlas-lesson__body"),oldScroll=previous?.scrollTop||0;
  const progress=state.phase==="intro"?0:state.phase==="complete"?100:Math.min(99,Math.round(state.question/count*100));
  const head='<header class="ns-atlas-lesson__head"><a class="ns-atlas-lesson__exit" href="'+home+'" aria-label="Back to course">×</a><div class="ns-atlas-lesson__progress" role="progressbar" aria-label="Mastery drill progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+progress+'"><span style="width:'+progress+'%"></span></div><span class="ns-atlas-lesson__brand" title="Nobody’s Simple">✿</span><span class="ns-atlas-lesson__counter">'+(state.phase==="practice"?(state.question+1)+" / "+count:"Learn")+'</span></header>';
  let middle="",footer="",feedbackTray="",resetScroll=false;
  if(state.phase==="intro"){
   middle='<div class="ns-atlas-lesson__intro"><div class="ns-atlas-lesson__guide" aria-hidden="true">'+companionVisual(bundle.id)+'</div><p class="ns-atlas-lesson__kicker">ONE STRATEGY · '+esc(record.kind)+'</p><h1>'+esc(record.title)+'</h1><p class="ns-atlas-lesson__lead">'+esc(record.cue)+'</p><div class="ns-atlas-lesson__knowledge"><strong>Why it might happen</strong><p>'+getText(lesson.teach.split("\n\n")[1]||"The context matters.")+'</p><strong>How to respond or practise</strong><p>'+esc(record.response||lesson.takeaway)+'</p><strong>What else could explain it?</strong><p>'+esc(compact(record.nearMiss||baseNearMiss[record.kind]||baseNearMiss.OBSERVE))+'</p></div><p class="ns-atlas-lesson__muted">Six situations · 18 checks · no timer. Scenes range from absurdly awkward to serious. Mastery requires at least 15 correct, including 5 of the final 6 transfer checks.</p><p class="ns-atlas-lesson__source">Source: Psychology Skills Atlas, editorial reference edition 2. These fictional practice scenes are teaching demonstrations, not validated diagnostic tests.</p></div>';
   footer='<button class="ns-atlas-lesson__next" type="button" data-begin>Start the story →</button>';resetScroll=true;
  }else if(state.phase==="complete"||state.phase==="retry"){
   const passed=state.phase==="complete";
   middle='<div class="ns-atlas-lesson__finish"><div class="ns-atlas-lesson__guide is-celebrating" aria-hidden="true">'+companionVisual(bundle.id)+'</div><span aria-hidden="true" class="ns-atlas-lesson__trophy">'+(passed?"✿":"↻")+'</span><p class="ns-atlas-lesson__kicker">'+(passed?"MASTERED IN THIS PRACTICE":"NOT MASTERED YET")+'</p><h1>'+esc(record.title)+'</h1><p>'+score.correct+' of '+count+' correct first time. '+score.late+' of the last six transfer checks were correct.</p><p>'+esc(passed?"You distinguished this strategy across several contexts. It will return in spaced review; one good session is not proof of real-world expertise.":"Try a different set of contexts. We will not record mastery until both the overall and transfer thresholds are met.")+'</p><p role="status" data-saved></p><div class="ns-atlas-lesson__knowledge"><strong>Remember</strong><p>'+esc(record.response||record.cue)+'</p></div></div>';
   footer=passed?'<a class="ns-atlas-lesson__next" href="'+home+'">Back to course →</a>':'<button class="ns-atlas-lesson__next" data-retry type="button">Practise another set →</button>';resetScroll=true;
  }else{
   const {scene,q}=current(),stage=state.question%3,reveal=state.visible<scene.turns.length;
   const nodeType=q.mode;
   const nodeName=q.kind;
   const nodeIcon={spot:"◎",evidence:"⌕",distinguish:"◐",mechanism:"↺",update:"✦",perspective:"◈",respond:"↗",transfer:"⤴"}[nodeType]||"✧";
   const cast=scene.turns.map(t=>t.speaker);
   const chat='<ol class="ns-atlas-lesson__thread" aria-label="Conversation">'+scene.turns.slice(0,state.visible).map((turn,i)=>'<li class="'+(i%2?"is-other":"")+'">'+speakerAvatar(turn.speaker,cast)+'<div class="ns-atlas-lesson__bubble"><span>'+esc(turn.speaker)+'</span><p>'+esc(turn.text)+'</p></div></li>').join("")+'</ol>';
   const sourceCue=!reveal&&stage===0&&!scene.featured?
    '<div class="ns-atlas-lesson__observation"><strong>What can actually be observed</strong><p>'+esc(scene.observation)+'</p></div>':'';
   const updateEvidence=!reveal&&stage===1&&Math.floor(state.question/3)===3?
    '<div class="ns-atlas-lesson__observation is-evidence"><strong>New information</strong><p>'+esc(scene.newEvidence)+'</p></div>':'';
   const compare=stage===0&&scene.isNear&&!reveal?'<div class="ns-atlas-lesson__compare"><div><small>FIRST IMPRESSION</small><p>'+esc(scene.turns[1]?.text||'')+'</p></div><div><small>WHAT HAPPENED NEXT</small><p>'+esc(scene.turns.at(-1)?.text||'')+'</p></div></div>':'';
   const mechanics=stage===1&&!reveal?'<div class="ns-atlas-lesson__mechanics" aria-label="Examine what happened"><span><b>1</b> Before</span><span aria-hidden="true">→</span><span><b>2</b> Action</span><span aria-hidden="true">→</span><span><b>3</b> After</span></div>':'';
   const reply=stage===2&&!reveal?'<div class="ns-atlas-lesson__reply-placeholder"><span aria-hidden="true">↳</span> Your next move matters. Choose what fits the situation.</div>':'';
   const answers=reveal?'<p class="ns-atlas-lesson__muted">Read the next message to find out what happens.</p>':
    '<fieldset class="ns-atlas-lesson__choices" '+(state.checked?"disabled":"")+'><legend><span>'+esc(q.kind)+'</span>'+esc(q.prompt)+'</legend>'+
    q.options.map((x,i)=>'<label class="'+(state.selected===x.id?"is-selected":"")+'"><input type="radio" name="atlas-answer" value="'+esc(x.id)+'" '+(state.selected===x.id?"checked":"")+'><span class="ns-atlas-lesson__choice-index" aria-hidden="true">'+String.fromCharCode(65+i)+'</span><span>'+esc(x.label)+'</span></label>').join("")+'</fieldset>';
   const hint=!reveal&&!state.checked?'<div class="ns-atlas-lesson__coach"><button type="button" class="ns-atlas-lesson__hint-button" data-hint aria-expanded="'+state.hintOpen+'">✧ '+(state.hintOpen?'Hide hint':'Need a hint?')+'</button>'+(state.hintOpen?'<p class="ns-atlas-lesson__hint-text">Notice exactly what changes after someone speaks. Which explanation is supported by what you can observe, rather than what you imagine about their intentions?</p>':'')+'</div>':'';
   middle='<div class="ns-atlas-lesson__task" data-node-type="'+nodeType+'"><p class="ns-atlas-lesson__kicker">'+esc(scene.tone)+' · '+esc(scene.place)+'</p><div class="ns-atlas-lesson__node-heading"><span class="ns-atlas-lesson__node-icon" aria-hidden="true">'+nodeIcon+'</span><div><span class="ns-atlas-lesson__node-tag">SITUATION '+String(Math.floor(state.question/3)+1)+' OF 6 · '+esc(record.title)+'</span><h1>'+nodeName+'</h1></div></div><p class="ns-atlas-lesson__context">'+esc(scene.intro)+'</p>'+chat+sourceCue+updateEvidence+compare+mechanics+reply+answers+hint+'</div>';
   if(state.checked){
    feedbackTray='<div class="ns-atlas-lesson__feedback '+(state.feedback.correct?"is-correct":"is-incorrect")+'" role="status" tabindex="-1" data-feedback><div class="ns-atlas-lesson__feedback-icon" aria-hidden="true">'+(state.feedback.correct?'✓':'↻')+'</div><div><strong>'+(state.feedback.correct?"Good thinking.":"There's an important distinction.")+'</strong>'+(state.feedback.correct?'':'<p><strong>Best-supported answer:</strong> '+esc(q.options.find(o=>o.id===q.answer)?.label||'')+'</p>')+'<p>'+esc(q.why)+'</p><p class="ns-atlas-lesson__muted">'+esc(q.caution)+'</p></div></div>';
   }
   footer=reveal?'<button class="ns-atlas-lesson__next" type="button" data-reveal>Continue conversation →</button>':state.checked?'<button class="ns-atlas-lesson__next" type="button" data-continue>'+(state.question===count-1?"See result →":"Continue →")+'</button>':'<button class="ns-atlas-lesson__next" data-check type="button" '+(!state.selected?"disabled":"")+'>Check answer</button>';
  }
  root.innerHTML='<section class="ns-atlas-lesson" aria-label="Strategy mastery lesson"><div class="ns-atlas-lesson__screen">'+head+'<div class="ns-atlas-lesson__body">'+middle+'</div><footer class="ns-atlas-lesson__footer">'+feedbackTray+footer+'</footer></div></section>';
  const body=root.querySelector(".ns-atlas-lesson__body");
  if(!resetScroll)body.scrollTop=oldScroll;
  if(state.checked&&focus)root.querySelector("[data-feedback]")?.focus({preventScroll:true});
  const thread=root.querySelector(".ns-atlas-lesson__thread");if(thread)thread.scrollTop=thread.scrollHeight;
  wire();
 }
 function finish(){
   score=strategyMastery(state.answers);state.phase=score.passed?"complete":"retry";
   paint();
   if(!score.passed||preview||state.saved)return;
   state.saved=true;
   const result=(review?saveLearnReview:saveLearnCompletion)(bundle,lesson,{total:count,correct:score.correct,allAnswered:true,corrections:{missed:count-score.correct,recovered:0,stillToReview:count-score.correct}});
   const notice=root.querySelector("[data-saved]");if(notice)notice.textContent=result.ok?(review?"Spaced review saved.":"Mastery saved."):result.error;
 }
 function wire(){
   root.querySelector("[data-begin]")?.addEventListener("click",()=>{state.phase="practice";state.visible=1;state.question=0;paint();});
   root.querySelector("[data-reveal]")?.addEventListener("click",()=>{const n=current().scene.turns.length;state.visible=Math.min(n,state.visible+1);paint();});
   root.querySelectorAll('input[name="atlas-answer"]').forEach(input=>input.addEventListener("change",()=>{
    state.selected=input.value;
    root.querySelectorAll(".ns-atlas-lesson__choices label").forEach(label=>label.classList.toggle("is-selected",label.querySelector("input")?.checked));
    const check=root.querySelector("[data-check]");if(check)check.disabled=false;
   }));
   root.querySelector("[data-hint]")?.addEventListener("click",()=>{state.hintOpen=!state.hintOpen;paint();root.querySelector("[data-hint]")?.focus({preventScroll:true});});
   root.querySelector("[data-check]")?.addEventListener("click",()=>{const q=current().q;if(!q.options.some(o=>o.id===state.selected))return;const correct=state.selected===q.answer;state.feedback={correct};state.checked=true;state.answers[state.question]=correct;paint({focus:true});});
   root.querySelector("[data-continue]")?.addEventListener("click",()=>{state.question++;state.checked=false;state.feedback=null;state.selected="";state.hintOpen=false;if(state.question===count)return finish();if(state.question%3===0)state.visible=1;else state.visible=current().scene.turns.length;paint();root.querySelector(".ns-atlas-lesson__body").scrollTop=0;});
   root.querySelector("[data-retry]")?.addEventListener("click",()=>{state.phase="practice";state.round++;state.question=0;state.visible=1;state.selected="";state.checked=false;state.feedback=null;state.hintOpen=false;state.answers=[];scenes=makeAtlasScenes(bundle.id,record,lesson.featuredCase,state.round);paint();});
 }
 paint();
}
