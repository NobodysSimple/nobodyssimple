/**
 * The Atlas lesson theatre. Small, fast, keyboard-accessible, one task per screen.
 * Source cards are educational prompts; scene variants are generated editorial
 * demonstrations, not claims about anybody's intentions or diagnosis.
 */
import {saveLearnCompletion,saveLearnReview} from "./ns-learn-progress-v2.mjs?v=strategy-atlas-20261120";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const count=18;
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
const pairs=[["Maya","Rory"],["Jules","Zara"],["Imani","Ben"],["Nora","Theo"],["Ellie","Sam"],["Ava","Leo"]];
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
 const near=record.nearMiss||baseNearMiss[record.kind]||baseNearMiss.OBSERVE;
 const cue=record.cue;
 return Array.from({length:6},(_,i)=>{
   const isNear=i===2||i===4;
   const place=contexts[(i+round)%contexts.length],tone=genre[i];
   const [a,b]=pairs[(i+round)%pairs.length];
   const intro=tone==="COMEDY"?"The situation starts almost comically. Then the conversation gets complicated.":tone==="DRAMA"?"The stakes rise and people have less time to think.":tone==="SERIOUS"?"A real decision must be made; the consequences matter.":tone==="TRANSFER"?"No labels are supplied now. Apply the skill somewhere new.":"An ordinary encounter with more than one plausible interpretation.";
   const note=isNear?near:cue;
   const isFeature=!!featured&&i===0&&Array.isArray(featured.turns)&&featured.turns.length>=4;
   const dialogue=isFeature?featured.turns.slice(0,6).map(t=>({speaker:t.speaker,text:t.text})):
     [
       {speaker:a,text:i===0?"Are we really doing this now? My coffee hasn't even started working.":i===2?"I might be misunderstanding. Can we slow down and check what actually happened?":i===5?"This reminds me of something we've discussed, but I don't want to jump to conclusions.":"Can we work out what is happening before we decide what to do?"},
       {speaker:b,text:isNear?"That could be one explanation. I might just need more context before deciding.":genericReply(record,i)},
       {speaker:a,text:i===1?"I hear you. The consequences still matter. What part of this can we check?":i===3?"Can you explain what you meant without deciding what I must be thinking?":"What specific detail would make the explanation more reliable?"},
       {speaker:b,text:isNear?"We can check the facts together and change our interpretation if they suggest something else.":i===4?"I can answer that, though I don't know whether the same explanation fits every situation.":i===5?"I hadn't thought of that. Maybe one sentence isn't enough evidence.":"I don't love being questioned, but I can see why it needs an answer."}
     ];
   return {id:record.id+"-s"+i,place,tone,intro,note,isNear,
     turns:dialogue,featured:isFeature,
     evidence:isFeature&&featured.newEvidence?featured.newEvidence:"A new piece of relevant context becomes available. Compare it with the original claim before deciding.",
     near,correctResponse:record.response||"Name the observable behaviour, consider an alternative and choose a safe, proportionate response."};
 });
}
const compact=s=>clean(s).replace(/^A comparable surface behaviour may instead be\s*/i,"").replace(/\s*The learner should check[\s\S]*$/,"").slice(0,240);
export function createAtlasQuestions(record,scene,round=0){
 const cue=clean(record.cue);
 const near=compact(scene.near);
 const action=scene.correctResponse;
 const core=scene.isNear?"The evidence is closer to an ordinary or competing explanation than to a settled example of this strategy.":"The described cue fits this strategy, though its motive or diagnosis remains uncertain.";
 const initial=[
 {id:scene.id+"-spot",kind:"Spot it",prompt:scene.isNear?"What is the most careful interpretation?":"Which interpretation is best supported by the specific behaviour?",
  options:[
   {id:"target",label:scene.isNear?"This must be "+record.title+". No further context is needed.":"The described behaviour may show "+record.title+"; further context can still matter."},
   {id:"near",label:scene.isNear?"A plausible alternative is "+near:"The behaviour must be completely harmless because intentions cannot be known."},
   {id:"irrelevant",label:"We can decide the person's full personality or diagnosis from this scene alone."}
  ],answer:scene.isNear?"near":"target",
  why:scene.isNear?"The alternative matters here. "+near:"The observable clue is: "+cue,
  caution:"A fictional dialogue is not a clinical assessment. Look for the exact action and compare the alternatives."
 },
 {id:scene.id+"-why",kind:"Explain it",prompt:"What should you consider when explaining why this may happen?",
  options:[
   {id:"sequence",label:record.kind==="REASON"?"Test the relationship between the claim and its supporting reasons.":record.kind==="PRACTISE"?"Consider which goal the skill serves and whether it fits the person's circumstances.":"Examine the trigger, interpretation, behaviour and immediate consequences before suggesting a motive."},
   {id:"certain",label:"One line of dialogue reveals the exact hidden motive with certainty."},
   {id:"fixed",label:"Everyone who behaves this way has the same cause, diagnosis and history."}
  ],answer:"sequence",
  why:record.kind==="REASON"?"The reasoning is what must be assessed, not the speaker's character.":record.kind==="PRACTISE"?"Skills are useful when they serve a specific goal and respect the setting.":"A maintaining process is a hypothesis based on what happens before and after, not a fact about someone's private mind.",
  caution:"Some strategies are adaptive; some are reasoning errors; others may be harmful when used to control. These are not interchangeable."
 },
 {id:scene.id+"-act",kind:"Choose a response",prompt:"What is the most useful next move in this setting?",
  options:[
   {id:"proportionate",label:action},
   {id:"fight",label:"Publicly label the other person and force a confession before continuing."},
   {id:"comply",label:"Give in immediately or abandon the concern without checking the facts."}
  ],answer:"proportionate",
  why:"A proportionate response is grounded in what can be observed: "+action,
  caution:"Safety and power change what is appropriate. Sometimes distance or outside support matters more than any clever comeback."
 }];
 const shift=hash(record.id+scene.id+round)%3;
 return initial.map(q=>({...q,options:rotate(q.options,shift)}));
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
 const state={phase:"intro",question:0,visible:1,round:0,selected:"",checked:false,feedback:null,answers:[],saved:false};
 let scenes=makeAtlasScenes(bundle.id,record,lesson.featuredCase,0),score=null;
 const current=()=>{const scene=scenes[Math.floor(state.question/3)],q=createAtlasQuestions(record,scene,state.round)[state.question%3];return {scene,q};};
 const selected=()=>root.querySelector("input[name=atlas-answer]:checked")?.value||"";
 const getText=(v)=>esc(v).replace(/\n/g,"<br>");
 function paint({focus=false}={}){
  const previous=root.querySelector(".ns-atlas-lesson__body"),oldScroll=previous?.scrollTop||0;
  const progress=state.phase==="intro"?0:state.phase==="complete"?100:Math.min(99,Math.round(state.question/count*100));
  const head='<header class="ns-atlas-lesson__head"><a class="ns-atlas-lesson__exit" href="'+home+'" aria-label="Back to course">×</a><div class="ns-atlas-lesson__progress" role="progressbar" aria-label="Mastery drill progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="'+progress+'"><span style="width:'+progress+'%"></span></div><span class="ns-atlas-lesson__counter">'+(state.phase==="practice"?(state.question+1)+" / "+count:"✿")+'</span></header>';
  let middle="",footer="",resetScroll=false;
  if(state.phase==="intro"){
   middle='<div class="ns-atlas-lesson__intro"><p class="ns-atlas-lesson__kicker">ONE STRATEGY · '+esc(record.kind)+'</p><h1>'+esc(record.title)+'</h1><p class="ns-atlas-lesson__lead">'+esc(record.cue)+'</p><div class="ns-atlas-lesson__knowledge"><strong>Why it might happen</strong><p>'+getText(lesson.teach.split("\n\n")[1]||"The context matters.")+'</p><strong>Don't overread the clue</strong><p>'+esc(record.nearMiss||baseNearMiss[record.kind]||baseNearMiss.OBSERVE)+'</p></div><p class="ns-atlas-lesson__muted">Six situations · 18 checks · no timer. Scenes range from absurdly awkward to serious. Mastery requires at least 15 correct, including 5 of the final 6 transfer checks.</p><p class="ns-atlas-lesson__source">Source: Psychology Skills Atlas, editorial reference edition 2. These fictional practice scenes are teaching demonstrations, not validated diagnostic tests.</p></div>';
   footer='<button class="ns-atlas-lesson__next" type="button" data-begin>Start the story →</button>';resetScroll=true;
  }else if(state.phase==="complete"||state.phase==="retry"){
   const passed=state.phase==="complete";
   middle='<div class="ns-atlas-lesson__finish"><span aria-hidden="true" class="ns-atlas-lesson__trophy">'+(passed?"✿":"↻")+'</span><p class="ns-atlas-lesson__kicker">'+(passed?"MASTERED IN THIS PRACTICE":"NOT MASTERED YET")+'</p><h1>'+esc(record.title)+'</h1><p>'+score.correct+' of '+count+' correct first time. '+score.late+' of the last six transfer checks were correct.</p><p>'+esc(passed?"You distinguished this strategy across several contexts. It will return in spaced review; one good session is not proof of real-world expertise.":"Try a different set of contexts. We will not record mastery until both the overall and transfer thresholds are met.")+'</p><p role="status" data-saved></p><div class="ns-atlas-lesson__knowledge"><strong>Remember</strong><p>'+esc(record.response||record.cue)+'</p></div></div>';
   footer=passed?'<a class="ns-atlas-lesson__next" href="'+home+'">Back to course →</a>':'<button class="ns-atlas-lesson__next" data-retry type="button">Practise another set →</button>';resetScroll=true;
  }else{
   const {scene,q}=current(),stage=state.question%3,reveal=state.visible<scene.turns.length;
   middle='<div class="ns-atlas-lesson__task"><p class="ns-atlas-lesson__kicker">'+esc(scene.tone)+' · '+esc(scene.place)+'</p><h1>'+esc(scene.featured?(lesson.featuredCase?.title||record.title):record.title)+'</h1><p class="ns-atlas-lesson__context">'+esc(scene.intro)+'</p>'+(stage===0?'<p class="ns-atlas-lesson__observation"><strong>What is happening around them?</strong> '+esc(scene.note)+'</p>':'')+
   '<ol class="ns-atlas-lesson__thread" aria-label="Conversation">'+scene.turns.slice(0,state.visible).map((turn,i)=>'<li class="'+(i%2?"is-other":"")+'"><span>'+esc(turn.speaker)+'</span><p>'+esc(turn.text)+'</p></li>').join("")+'</ol>'+
   (reveal?'<p class="ns-atlas-lesson__muted">See what they say next.</p>':'<fieldset class="ns-atlas-lesson__choices" '+(state.checked?"disabled":"")+'><legend><span>'+esc(q.kind)+'</span> '+esc(q.prompt)+'</legend>'+q.options.map(x=>'<label class="'+(state.selected===x.id?"is-selected":"")+'"><input type="radio" name="atlas-answer" value="'+esc(x.id)+'" '+(state.selected===x.id?"checked":"")+'><span>'+esc(x.label)+'</span></label>').join("")+'</fieldset>')+
   (state.checked?'<div class="ns-atlas-lesson__feedback '+(state.feedback.correct?"is-correct":"is-incorrect")+'" role="status" tabindex="-1" data-feedback><strong>'+(state.feedback.correct?"✓ That's supported.":"Not this time. Here's the distinction.")+'</strong><p>'+esc(q.why)+'</p><p class="ns-atlas-lesson__muted">'+esc(q.caution)+'</p></div>':'')+'</div>';
   footer=reveal?'<button class="ns-atlas-lesson__next" type="button" data-reveal>Continue conversation →</button>':state.checked?'<button class="ns-atlas-lesson__next" type="button" data-continue>'+(state.question===count-1?"See result →":"Continue →")+'</button>':'<button class="ns-atlas-lesson__next" data-check type="button" '+(!state.selected?"disabled":"")+'>Check answer</button>';
  }
  root.innerHTML='<section class="ns-atlas-lesson" aria-label="Strategy mastery lesson"><div class="ns-atlas-lesson__screen">'+head+'<div class="ns-atlas-lesson__body">'+middle+'</div><footer class="ns-atlas-lesson__footer">'+footer+'</footer></div></section>';
  const body=root.querySelector(".ns-atlas-lesson__body");
  if(!resetScroll)body.scrollTop=oldScroll;
  if(state.checked){body.scrollTop=body.scrollHeight;if(focus)root.querySelector("[data-feedback]")?.focus({preventScroll:true});}
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
   root.querySelectorAll('input[name="atlas-answer"]').forEach(input=>input.addEventListener("change",()=>{state.selected=input.value;paint();}));
   root.querySelector("[data-check]")?.addEventListener("click",()=>{const q=current().q;if(!q.options.some(o=>o.id===state.selected))return;const correct=state.selected===q.answer;state.feedback={correct};state.checked=true;state.answers[state.question]=correct;paint({focus:true});});
   root.querySelector("[data-continue]")?.addEventListener("click",()=>{state.question++;state.checked=false;state.feedback=null;state.selected="";if(state.question===count)return finish();if(state.question%3===0)state.visible=1;else state.visible=current().scene.turns.length;paint();root.querySelector(".ns-atlas-lesson__body").scrollTop=0;});
   root.querySelector("[data-retry]")?.addEventListener("click",()=>{state.phase="practice";state.round++;state.question=0;state.visible=1;state.selected="";state.checked=false;state.feedback=null;state.answers=[];scenes=makeAtlasScenes(bundle.id,record,lesson.featuredCase,state.round);paint();});
 }
 paint();
}
