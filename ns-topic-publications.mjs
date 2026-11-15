/* Authored, optional topic-page additions. Never replaces safety or clinical material.
   Text is plain text, escaped on output, and editors publish via the staff studio. */
import {escapeHTML as esc} from './core.mjs';
const JSON_URL='ns-topic-publications.json';
let loadPromise=null;
export const topicSectionKeys=['overview','variations','actions'];
export function cleanTopicPublication(value){
 const data=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 return {
  overview:String(data.overview||'').trim().slice(0,3600),
  variations:String(data.variations||'').trim().slice(0,3600),
  actions:String(data.actions||'').trim().slice(0,3600),
  updatedAt:typeof data.updatedAt==='string'?data.updatedAt:''
 };
}
export async function getTopicPublications(){
 if(!loadPromise)loadPromise=fetch(JSON_URL,{cache:'no-store'}).then(async response=>{
  if(!response.ok)throw Error('Topic publication data unavailable');
  const payload=await response.json();
  if(payload?.version!==1||!payload.topics||typeof payload.topics!=='object')throw Error('Unexpected topic publication format');
  return payload;
 }).catch(()=>({version:1,topics:{}}));
 return loadPromise;
}
export function topicPublicationMarkup(raw,title){
 const data=cleanTopicPublication(raw);
 if(!data.overview&&!data.variations&&!data.actions)return '';
 const areas=[
  ['overview','What might be happening?','The experience'],
  ['variations','Which version sounds familiar?','Different patterns'],
  ['actions','What could help next?','A practical direction']
 ];
 return '<section class="ns-editorial-topic" aria-label="Written guide for '+esc(title)+'">'+
 '<div class="ns-editorial-topic-heading"><span class="ns-editorial-topic-kicker">A GENTLE GUIDE · '+esc(title)+'</span><h2>Start with what fits your situation</h2>'+
 '<p>These are general possibilities. You can explore without forcing a label; the detailed guidance below remains available.</p></div>'+
 '<div class="ns-editorial-topic-sections">'+areas.filter(([id])=>Boolean(data[id])).map(([id,heading,kicker],i)=>
 '<section class="ns-editorial-topic-panel"><span class="ns-editorial-topic-index">'+(i+1)+'</span>'+
 '<div><small>'+kicker+'</small><h3>'+heading+'</h3>'+
 data[id].split(/\n\s*\n/).filter(Boolean).map(p=>'<p>'+esc(p).replace(/\n/g,'<br>')+'</p>').join('')+
 '</div></section>').join('')+'</div><p class="ns-editorial-topic-footnote">Different experiences can look similar. This introduction does not establish a diagnosis or replace urgent safety information.</p></section>';
}
export async function mountPublishedTopicEditorial(root,id){
 if(!root||!id)return;
 const route=location.hash;
 const payload=await getTopicPublications();
 if(!root.isConnected||location.hash!==route)return;
 const data=payload.topics?.[id];
 if(!data)return;
 const title=root.querySelector('h1')?.textContent?.trim()||id;
 const html=topicPublicationMarkup(data,title);
 if(!html)return;
 root.querySelectorAll('.ns-editorial-topic').forEach(node=>node.remove());
 const container=root.querySelector('.ns-judge,.ns-atlas-guide,.ns-guide-shell,.ns-deep-shell,.ns-wb-shell,.ns-wb-page');
 if(!container)return;
 const hero=container.querySelector('.ns-judge-hero,.ns-atlas-guide-hero,.ns-guide-hero,.ns-deep-header,.ns-wb-header,.ns-wb-hero');
 if(hero)hero.insertAdjacentHTML('afterend',html);
 else container.insertAdjacentHTML('afterbegin',html);
}
