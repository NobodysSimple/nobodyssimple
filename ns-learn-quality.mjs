/**
 * Editorial support for substantial, readable psychology lessons.
 * These checks detect structure, never certify scientific or clinical accuracy.
 */
const words=s=>String(s||'').trim().split(/\s+/).filter(Boolean).length;
const exercise=node=>!['read','image'].includes(node?.type);
const mcq=node=>['choose','respond','repair','investigate','update','perspective','character','predict','dialogue','investigation'].includes(node?.type);
export const learnerText=lesson=>{
 const pieces=[lesson?.teach||''];
 for(const node of lesson?.nodes||[]){
  for(const key of ['title','body','prompt','scenario','reveal','explanation','newEvidence','viewA','viewB'])if(node[key])pieces.push(node[key]);
  for(const row of node.turns||[])pieces.push(row.text||'');
  for(const layer of node.layers||[])pieces.push(layer.title||'',layer.analysis||'',layer.alternative||'',layer.test||'');
  for(const row of node.segments||[])pieces.push(row.text||'');
  for(const row of node.steps||[])pieces.push(row.label||'');
  for(const row of node.options||[])pieces.push(row.label||'');
  for(const check of node.checks||[]){
   pieces.push(check.prompt||'',check.explanation||'');
   for(const option of check.options||[])pieces.push(option.label||'');
  }
 }
 return pieces.filter(Boolean).join(' ');
};
export function lessonMetrics(lesson){
 const nodes=lesson?.nodes||[];
 const drills=nodes.filter(exercise).reduce((n,item)=>n+(['dialogue','investigation'].includes(item.type)?(item.checks?.length||0):1),0);
 const reads=nodes.filter(x=>x.type==='read');
 const multiple=nodes.filter(mcq);
 const malformed=nodes.filter(x=>x.type==='choose'&&Array.isArray(x.options)&&x.options.length>4);
 const textWords=words(learnerText(lesson));
 // A rough, stated estimate: deliberate reading plus decision time for each drill.
 const estimatedMinutes=Math.max(2,Math.ceil(textWords/205+drills*.25));
 return {nodes:nodes.length,drills,reads:reads.length,textWords,multipleChoiceNodes:multiple.length,
  overlyLongChoiceNodes:malformed.length,formats:new Set(nodes.map(x=>x.type)).size,estimatedMinutes};
}
export function auditLesson(lesson,{strict=false}={}){
 const m=lessonMetrics(lesson),warnings=[],blockers=[];
 const flag=(condition,message,severe=false)=>{if(condition)(severe&&strict?blockers:warnings).push(message);};
 flag(!lesson?.teach||words(lesson.teach)<40,'Expand the opening: explain the central question and why it matters.');
 flag(!lesson?.objective||words(lesson.objective)<7,'Write an observable learning outcome: what should the student explain or do afterwards?');
 flag(m.drills<8,'Add drills. Aim for 8–12 deliberate practice opportunities, not eight multiple-choice screens.',true);
 flag(m.formats<4,'Vary the cognitive work: observation, explanation, evidence revision and real-life transfer.',true);
 flag(m.textWords<900,'Add substantive teaching. The visible material is too short for a thorough ten-minute lesson.',true);
 flag(m.estimatedMinutes<9,'At the current content density, this lesson is unlikely to occupy roughly ten minutes.',true);
 flag(m.multipleChoiceNodes>Math.max(3,Math.floor(m.drills*.5)),'Too many answer-choice activities. Replace some with evidence selection, sequencing, investigation or applied response.');
 flag(m.overlyLongChoiceNodes>0,'Reduce conventional multiple-choice tasks to two to four carefully written alternatives.');
 const sources=(lesson?.nodes||[]).filter(n=>n.sources).map(n=>n.sources);
 const repeatedSources=new Set(sources).size===1&&sources.length>=6;
 flag(repeatedSources,'All cited nodes share the same source string. Check that each study supports the claim beside it.');
 for(const item of lesson?.nodes||[]){
  if(['choose','update','dialogue','investigation','repair'].includes(item.type)){
   const checks=['dialogue','investigation'].includes(item.type)?item.checks||[]:[item];
   for(const check of checks){
    const opts=check.options||[];
    const blunt=opts.filter(o=>/\b(always|never|everything|everyone|every time|entire personality|automatically proves|definitely proves|must be|certainly has)\b/i.test(o.label||''));
    flag(blunt.length>0,'Review implausibly absolute alternatives in '+(item.title||item.type)+'.');
   }
  }
 }
 // Fictional cases are applications, not empirical findings about named characters.
 // Check the research explanation instead of demanding an unrelated citation on
 // every interaction. A bibliography by itself does not verify claim accuracy.
 const evidencePages=(lesson?.nodes||[]).filter(n=>n.type==='read'&&/research|evidence|study|studies/i.test(n.title||''));
 flag(evidencePages.length===0,'Include a research explanation that relates evidence to the lesson claims.');
 flag(evidencePages.some(n=>!n.sources?.trim()),'Research explanation is missing identifiable source details.',true);
 const inquiries=(lesson?.nodes||[]).filter(n=>n.type==='investigation');
 for(const investigation of inquiries){
  flag(investigation.layers?.length!==10,'Message Investigation needs all ten reasoning depths.',true);
  flag((investigation.layers||[]).some(x=>words(x.analysis)<24||words(x.alternative)<12||words(x.test)<9),
   'Deepen each investigation depth with an explanation, a credible rival account and discriminating evidence.');
 }

 flag(!lesson?.takeaway||words(lesson.takeaway)<10,'Finish with a usable, specific conclusion rather than a generic recap.');
 flag(!lesson?.transferPrompt,'Add an explicit novel case or transfer prompt and ask the learner to apply the mechanism.');
 flag(!lesson?.staffReview,'Record the evidence review and clinical editorial decision before approving the lesson.',true);
 return {...m,warnings,blockers,standard:strict?'deep-10':'legacy'};
}
export function displayedLessonMinutes(lesson){
 const claimed=Number(lesson?.durationMinutes);
 if(Number.isFinite(claimed)&&claimed>=3&&claimed<=60)return Math.round(claimed);
 return lessonMetrics(lesson).estimatedMinutes;
}
