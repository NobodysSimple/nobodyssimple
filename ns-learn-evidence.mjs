/**
 * Reader-facing bibliography for published psychology courses.
 * Editorial text remains escaped and never becomes trusted markup.
 */
export function lessonSources(lesson){
 const seen=new Set(),entries=[];
 const add=value=>{
  const text=String(value||'').trim();
  if(!text||seen.has(text))return;
  seen.add(text);entries.push(text);
 };
 (lesson?.nodes||lesson?.questions||[]).forEach(node=>{
  if(node?.sources)String(node.sources).split(/;\s*(?=[A-Z][A-Za-z .&-]+\(|https?:\/\/)/).forEach(add);
 });
 (lesson?.references||[]).forEach(item=>add(typeof item==='string'?item:item?.citation));
 return entries.slice(0,25);
}
export function lessonResearchMarkup(lesson,esc){
 const refs=lessonSources(lesson),summary=String(lesson?.evidenceSummary||'').trim();
 if(!refs.length&&!summary)return '';
 return '<details class="ns-learn-player__research"><summary>Research and further reading ('+refs.length+')</summary>'+
  (summary?'<p>'+esc(summary)+'</p>':'')+
  (refs.length?'<ol>'+refs.map(ref=>'<li>'+esc(ref)+'</li>').join('')+'</ol>':'')+
  '</details>';
}
