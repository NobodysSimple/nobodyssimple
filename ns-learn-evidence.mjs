/**
 * Safe reader-facing reference panel. Research claims are linked to the
 * explanatory reading, not presented as proof of invented characters' motives.
 * Supports verified DOI / PubMed identifiers from authored reference metadata.
 */
export function lessonSources(lesson){
 const seen=new Set(),items=[];
 const add=part=>{
  const citation=String(part||'').trim();
  if(!citation||seen.has(citation))return;
  seen.add(citation);items.push(citation);
 };
 for(const node of lesson?.nodes||lesson?.questions||[]){
  if(node?.sources)String(node.sources).split(/;\s*/).forEach(add);
 }
 for(const item of lesson?.references||[])add(typeof item==='string'?item:item?.citation);
 return items.slice(0,30);
}
export function sourceLink(citation){
 const doi=String(citation).match(/(?:doi:|doi\.org\/)(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/i);
 if(doi)return 'https://doi.org/'+doi[1];
 const pmid=String(citation).match(/\bPMID:\s*(\d{6,9})\b/i);
 if(pmid)return 'https://pubmed.ncbi.nlm.nih.gov/'+pmid[1]+'/';
 return null;
}
export function lessonResearchMarkup(lesson,esc){
 const refs=lessonSources(lesson),summary=String(lesson?.evidenceSummary||'').trim();
 if(!refs.length&&!summary)return '';
 const entries=refs.map(ref=>{
  const url=sourceLink(ref);
  return '<li>'+esc(ref)+(url?' <a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Read source</a>':'')+'</li>';
 }).join('');
 return '<details class="ns-learn-player__research"><summary>Research behind this lesson ('+refs.length+' sources)</summary>'+
  '<p>The studies explain psychological concepts and clinical findings. The message conversations are fictional applications, and their proposed private motives remain hypotheses.</p>'+
  (summary?'<p>'+esc(summary)+'</p>':'')+
  (refs.length?'<ol>'+entries+'</ol>':'')+'</details>';
}
