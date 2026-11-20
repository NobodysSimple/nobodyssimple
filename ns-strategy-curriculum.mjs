/**
 * Converts the editorial Atlas into one stable lesson per named strategy.
 * Existing authored publication JSON stays intact for rollback and source audits.
 * The Atlas records are teaching prompts; not all names are validated constructs.
 */
let inflight=null;
let atlasCache=null;
const base=new URL("./learn-content/",import.meta.url);
const scenarioAnchor=Object.freeze({
 narcissism:"01-022",manipulation:"02-X002",attachment:"03-X007",
 overthinking:"04-035",boundaries:"05-028",anxiety:"06-028",
 emotions:"07-004","self-esteem":"08-003",motivation:"09-001",
 "social-anxiety":"10-003",burnout:"11-046",loneliness:"12-X001",
 "social-media":"13-001",misinformation:"14-011",neurodiversity:"15-007",
 sleep:"16-015","low-mood":"17-001",scams:"18-001",
 masculinity:"19-001",vaping:"20-003","conversation-patterns":"21-198"
});
const protect=x=>String(x||"").replace(/\s+/g," ").trim();
export async function loadStrategyAtlas(){
 if(atlasCache)return atlasCache;
 if(inflight)return inflight;
 if(typeof fetch!=="function")return null;
 inflight=(async()=>{
   const [a,c]=await Promise.all([
    fetch(new URL("strategy-atlas.json",base),{cache:"no-store"}),
    fetch(new URL("strategy-featured-cases.json",base),{cache:"no-store"})
   ]);
   if(!a.ok||!c.ok)throw Error("Strategy Atlas is unavailable.");
   const [atlas,stories]=await Promise.all([a.json(),c.json()]);
   if(atlas?.version!==2||atlas.count!==1752||!atlas.courses||stories?.version!==1)throw Error("Unexpected strategy source revision.");
   for(const record of Object.values(atlas.courses)){
     if(!Array.isArray(record.strategies)||record.strategies.length===0||record.strategies.some(x=>!x.id||!x.title||!x.cue))throw Error("Incomplete Atlas course "+record?.id);
     if(new Set(record.strategies.map(x=>x.id)).size!==record.strategies.length)throw Error("Duplicated Atlas IDs: "+record.id);
   }
   atlasCache={atlas,stories:stories.cases||{}};
   return atlasCache;
 })().finally(()=>{inflight=null;});
 return inflight;
}
function hypotheticalMechanism(record){
 if(record.kind==="REASON")return "This is a reasoning pattern. The important question is whether the conclusion actually follows from the available reasons. A fallacy may be accidental; it does not, by itself, prove an intention to deceive.";
 if(record.kind==="DISCERN")return "Several explanations may fit the same outward behaviour. Discrimination means noticing what evidence favours one explanation and what is still missing. Sometimes the correct judgement is that there is not enough information.";
 if(record.kind==="PRACTISE")return "This is a skill you can use, not something to diagnose in another person. Try it when it suits your goal, and assess whether it improves understanding, consent or practical follow-through.";
 if(record.kind==="CARE")return "This belongs to a clinical or therapeutic family of methods. Its usefulness depends on the person's circumstances and what is actually maintaining the problem. Exercises in this course teach conceptual choice, not an individual treatment prescription.";
 if(record.kind==="PROCESS")return "Consider the chain: what happened just before, what meaning the person gave it, what they did next, and what followed. Immediate relief, comfort or reward can sometimes maintain a pattern, but the person's private motive is not known from the scene alone.";
 return "A repeated behaviour may alter the other person's choices, credibility or ability to disagree. Look for the exact action and its consequences before guessing someone's motives or applying a clinical label.";
}
export function buildStrategyBundle(original,source){
 const baseCourse=source?.atlas?.courses?.[original?.id];
 if(!baseCourse)return original;
 const blocks=[];
 for(const [entryIndex,entry] of baseCourse.strategies.entries()){
   const alternate=baseCourse.strategies.find((x,i)=>i!==entryIndex&&x.section===entry.section&&x.kind===entry.kind)||baseCourse.strategies.find((x,i)=>i!==entryIndex&&x.kind===entry.kind)||baseCourse.strategies[(entryIndex+1)%baseCourse.strategies.length];
   const contrast={title:alternate.title,cue:alternate.cue};
   const group=entry.kind==="EXTENSION"?"Advanced variations":protect(entry.section)||"Core techniques";
   let unit=blocks[blocks.length-1];
   if(!unit||unit.title!==group){
     unit={id:original.id+"-strategy-unit-"+String(blocks.length+1).padStart(2,"0"),kind:"strategy",title:group,lessons:[]};blocks.push(unit);
   }
   const isFeature=entry.id===scenarioAnchor[original.id];
   const featured=isFeature?source.stories[original.id]:null;
   unit.lessons.push({
     id:"atlas-"+entry.id.toLowerCase(),version:2,standard:"atlas-skill",
     title:entry.title,editorialStatus:"atlas-first-pass",
     objective:"Recognise, explain and respond to "+entry.title+" across varied situations; reject false positives and revise when new evidence appears.",
     teach:entry.cue+"\n\n"+hypotheticalMechanism(entry),
     takeaway:entry.response||"Describe what is observable, test competing explanations and choose a proportionate next step.",
     durationMinutes:9,atlasRecord:{...entry,contrast},featuredCase:featured||null
   });
 }
 return {
   id:original.id,version:original.version,status:"published",title:original.title,
   description:"One strategy per lesson. Follow vivid conversations, learn why the pattern may happen, practise across contexts and earn mastery with new transfer challenges.",
   strategyCurriculum:true,atlasSourceVersion:2,originalLessonCount:original.modules.flatMap(m=>m.lessons||[]).length,
   modules:blocks
 };
}
export const strategyAtlasCount=source=>Object.values(source?.atlas?.courses||{}).reduce((n,c)=>n+(c.strategies?.length||0),0);
