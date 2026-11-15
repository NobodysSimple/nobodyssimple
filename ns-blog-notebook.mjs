import {escapeHTML as esc,renderPostBody,safeImage} from './core.mjs';

// This renderer is invoked ONLY for published type=blog articles from site.mjs.
// The global Learn / lesson / video renderers and site navigation are untouched.
const REACTIONS_KEY='ns-blog-reactions-v1';
const choices=[
 {id:'helpful',label:'Helpful',symbol:'♡'},
 {id:'thoughtful',label:'Made me think',symbol:'✦'},
 {id:'relatable',label:'Relatable',symbol:'◡'},
 {id:'inspiring',label:'Inspiring',symbol:'✿'}
];
const publishedDate=value=>{
 const dt=new Date(value||'');
 return Number.isNaN(dt.getTime())?'':dt.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});
};
const getMinutes=post=>{
 const fromData=Number(post.readingMinutes??post.readingTime);
 if(Number.isFinite(fromData)&&fromData>0)return Math.max(1,Math.min(180,Math.round(fromData)));
 const source=Array.isArray(post.blocks)&&post.blocks.length
  ?post.blocks.map(b=>[b.text,b.html,b.title,b.caption,Array.isArray(b.items)?JSON.stringify(b.items):''].filter(Boolean).join(' ')).join(' ')
  :String(post.body||'');
 const words=source.replace(/<[^>]*>/g,' ').split(/\s+/).filter(Boolean).length;
 return Math.max(1,Math.ceil(words/210));
};
const asText=value=>typeof value==='string'?value:'';
function relatedBlogs(post,posts){
 const topics=new Set((post.topics||[]).map(s=>String(s).toLowerCase()));
 return posts.filter(p=>p?.type==='blog'&&p?.status==='published'&&p.id!==post.id)
  .map((p,index)=>({...p,_relevance:(p.topics||[]).filter(x=>topics.has(String(x).toLowerCase())).length*10-index/10000}))
  .sort((a,b)=>b._relevance-a._relevance).slice(0,3);
}
function readReaction(id){
 try { const state=JSON.parse(localStorage.getItem(REACTIONS_KEY)||'{}');return typeof state==='object'&&state?choices.some(c=>c.id===state[id])?state[id]:null:null; }
 catch{return null;}
}
function writeReaction(id,value){
 let state={};try{state=JSON.parse(localStorage.getItem(REACTIONS_KEY)||'{}')||{};}catch{}
 if(!state||typeof state!=='object'||Array.isArray(state))state={};
 if(value)state[id]=value;else delete state[id];
 localStorage.setItem(REACTIONS_KEY,JSON.stringify(state));
}
function ensureCSS(){
 if(document.getElementById('ns-blog-notebook-styles'))return;
 const link=document.createElement('link');
 link.id='ns-blog-notebook-styles';link.rel='stylesheet';
 link.href='ns-blog-notebook.css?v=hello-notebook-20261115-2';
 document.head.append(link);
}
function heroMarkup(post){
 const src=safeImage(post.thumbnail);
 if(src)return `<figure class="nb-hero-image nb-photo-frame"><span class="nb-tape" aria-hidden="true"></span>
   <img src="${esc(src)}" alt="${esc(/\.(?:png|webp|jpe?g)$/i.test(asText(post.thumbnailAlt)) ? 'Illustration for '+post.title : asText(post.thumbnailAlt))}" decoding="async">
   ${post.thumbnailAlt?`<figcaption>${esc(post.thumbnailAlt)}</figcaption>`:''}</figure>`;
 return `<div class="nb-hero-illustration" aria-hidden="true"><img class="nb-scene-picture" src="ns-landscape-path.webp" alt=""><img class="nb-hero-character" src="ns-character-reading.webp" alt=""></div>`;
}
function suggestedMarkup(posts){
 if(!posts.length)return `<p class="nb-empty-next">You're reading our first blog. While the next one takes shape, there's more to explore.</p>
  <a class="nb-related-post nb-explore-link" href="#wisbody"><span class="nb-related-art"><img src="ns-character-reading.webp" alt="" loading="lazy"></span><span class="nb-related-copy"><b>Explore Wisbody</b><small>Short reflections to think about</small></span><span class="nb-related-arrow" aria-hidden="true">↗</span></a>
  <a class="nb-related-post nb-explore-link" href="#library"><span class="nb-related-art"><img src="ns-landscape-learn.webp" alt="" loading="lazy"></span><span class="nb-related-copy"><b>Explore the Learn library</b><small>More psychology and learning</small></span><span class="nb-related-arrow" aria-hidden="true">↗</span></a>
  <a class="nb-all-articles" href="#library/blog">Return to the blog <span aria-hidden="true">→</span></a>`;
 return `${posts.map(p=>{
  const image=safeImage(p.thumbnail);
  return `<a class="nb-related-post" href="#post/${encodeURIComponent(p.id)}">
   <span class="nb-related-art">${image?`<img src="${esc(image)}" alt="" loading="lazy">`:'<img src="ns-landscape-path.webp" alt="" loading="lazy">'}</span>
   <span class="nb-related-copy"><b>${esc(p.title)}</b><small>${getMinutes(p)} min read${p.topics?.length?' · '+esc(String(p.topics[0])):''}</small></span>
   <span class="nb-related-arrow" aria-hidden="true">↗</span></a>`;
 }).join('')}<a class="nb-all-articles" href="#library/blog">See more writing <span aria-hidden="true">→</span></a>`;
}
const reactionMarkup=id=>`<div class="nb-reactions" role="group" aria-label="How this article landed with you">
 ${choices.map(c=>`<button type="button" data-nb-reaction="${c.id}" aria-pressed="${readReaction(id)===c.id?'true':'false'}"><span aria-hidden="true">${c.symbol}</span>${esc(c.label)}</button>`).join('')}
 </div>`;

export function renderNotebookBlogPost(root,post,publishedPosts){
 ensureCSS();
 const suggestions=relatedBlogs(post,publishedPosts);
 const topics=(post.topics||[]).slice(0,3);
 const body=renderPostBody(post,publishedPosts);
 const date=publishedDate(post.publishedAt);
 const author=asText(post.authorName||post.author)||'Nobody’s Simple';
 root.innerHTML=`<div class="ns-blog-notebook" data-blog-id="${esc(post.id)}">
  <div class="nb-background nb-background-left" aria-hidden="true"></div>
  <div class="nb-background nb-background-right" aria-hidden="true"></div>
  <div class="nb-top-scene" aria-hidden="true"></div>
  <div class="nb-shell">
   <nav class="nb-backline" aria-label="Back to learning"><a href="#library/blog"><span aria-hidden="true">←</span> Back to Learn</a><span> / </span><span>Blog</span><span> / </span><span aria-current="page">${esc(post.title)}</span></nav>
   <div class="nb-columns">
    <aside class="nb-left-rail" aria-label="Article navigation">
     <div class="nb-left-sticky">
      <section class="nb-progress-card" aria-label="Reading progress">
       <div class="nb-small-label">YOUR READING JOURNEY</div>
       <div class="nb-progress-head"><strong>Article progress</strong><output id="nb-reading-percentage">0%</output></div>
       <div class="nb-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-label="Article read" id="nb-reading-track"><span></span></div>
      </section>
      <nav class="nb-contents-card" aria-label="Contents of this article">
       <span class="nb-sticky-tape" aria-hidden="true"></span>
       <h2><span aria-hidden="true">☷</span> Contents</h2>
       <ol id="nb-contents-list"><li><a href="#nb-story-start">Start reading</a></li></ol>
      </nav>
      <div class="nb-scribble-card" aria-hidden="true">
       <img src="ns-character-writing.webp" alt="">
       <span>Take what helps.<br>Leave what doesn't.</span>
       <span class="nb-scribble-spark">✳</span>
      </div>
     </div>
    </aside>
    <article class="article theme-cream ns-blog-paper" aria-labelledby="nb-article-title">
     <div class="nb-paper-content">
      <header class="nb-post-header">
       <div class="nb-post-ribbon"><span>BLOG POST</span>${topics.map(topic=>`<span class="nb-topic">${esc(String(topic))}</span>`).join('')}</div>
       <h1 id="nb-article-title">${esc(post.title)}</h1>
       ${post.intro||post.excerpt?`<p class="nb-intro">${esc(post.intro||post.excerpt)}</p>`:''}
       <div class="nb-byline"><span class="nb-byline-avatar" aria-hidden="true">◡</span><span>By ${esc(author)}</span>${date?`<span class="nb-byline-divider" aria-hidden="true"></span><span>▦ ${esc(date)}</span>`:''}<span class="nb-byline-divider" aria-hidden="true"></span><span>◷ ${getMinutes(post)} min read</span></div>
      </header>
      ${heroMarkup(post)}
      <div class="nb-sentence-break" aria-hidden="true"><span>✦</span><i></i><span>✿</span><i></i><span>✦</span></div>
      <div class="article-body ns-blog-body" id="nb-story-start">${body}</div>
      ${post.modules?.length?`<p class="nb-post-modules">Also featured in: ${post.modules.map(x=>esc(String(x))).join(' · ')}</p>`:''}
      <footer class="nb-article-footer" id="nb-article-end">
       <div class="nb-ending-decoration" aria-hidden="true"><img src="ns-character-plant.webp" alt=""></div>
       <div><p class="nb-footer-eyebrow">YOU'VE REACHED THE LAST PAGE</p><h2>A little something to take away</h2>
       <p>Keep the idea that feels useful to you. You can always return to the rest another day.</p></div>
      </footer>
     </div>
     <section class="nb-response-bar" aria-labelledby="nb-response-heading">
       <div class="nb-response-heading"><h2 id="nb-response-heading">What stayed with you?</h2><p>Choose one reaction. This preference is saved only on this device.</p></div>
       ${reactionMarkup(post.id)}
       <div class="nb-share-strip"><button type="button" data-nb-share>↗ Share this article</button><span role="status" aria-live="polite" id="nb-interaction-status"></span></div>
     </section>
    </article>
    <aside class="nb-right-rail" aria-label="Continue exploring">
     <div class="nb-read-next-card">
      <span class="nb-paper-clip" aria-hidden="true">⌁</span>
      <h2><span aria-hidden="true">☷</span> Read next</h2>
      <div class="nb-related-list">${suggestedMarkup(suggestions)}</div>
     </div>
     <div class="nb-note-card"><span class="nb-note-tape" aria-hidden="true"></span><span class="nb-note-title">A little note ♡</span><p>This space is yours to explore at your own pace. There is no test at the end.</p><img src="ns-character-sitting.webp" alt="" aria-hidden="true"></div>
    </aside>
   </div>
   <footer class="nb-bottom-trail"><div class="nb-bottom-trail-illustration" aria-hidden="true"><img src="ns-character-hiking.webp" alt=""></div>
    <div><span>THE NEXT LITTLE STEP</span><h2>Keep exploring.</h2><p>More writing, reflections and ideas from Nobody’s Simple.</p></div>
    <a href="#library/blog">Explore more posts <span aria-hidden="true">→</span></a>
   </footer>
  </div>
 </div>`;
 const page=root.querySelector('.ns-blog-notebook');
 const actualHeadings=[...page.querySelectorAll('.ns-blog-body h2, .ns-blog-body h3, .ns-blog-body h4')]
  .filter(h=>!h.closest('.table-of-contents, .interactive-embed, .site-card, .related-block'));
 const contents=page.querySelector('#nb-contents-list');
 const sectionNodes=actualHeadings.map((node,index)=>{
  if(!node.id)node.id=`nb-section-${index+1}`;
  return {id:node.id,title:node.textContent.trim().slice(0,130),node,level:Number(node.tagName.slice(1))};
 }).filter(entry=>entry.title);
 contents.innerHTML='<li><a href="#nb-story-start" data-nb-anchor="nb-story-start">Start reading</a></li>'
  + sectionNodes.map(s=>`<li class="${s.level===3?'nb-toc-sub':''}"><a href="#${esc(s.id)}" data-nb-anchor="${esc(s.id)}">${esc(s.title)}</a></li>`).join('')
  +'<li><a href="#nb-article-end" data-nb-anchor="nb-article-end">The last page</a></li>';
 const abort=new AbortController(),{signal}=abort;
 const cleanup=()=>abort.abort();
 window.addEventListener('hashchange',cleanup,{once:true,signal});
 // These are real in-document anchors; intercept them to preserve SPA hash routing.
 contents.addEventListener('click',event=>{
  const link=event.target.closest('[data-nb-anchor]');if(!link)return;
  event.preventDefault();
  const anchor=page.querySelector('#'+link.dataset.nbAnchor);
  anchor?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 },{signal});
 const readingPercent=page.querySelector('#nb-reading-percentage'),meter=page.querySelector('#nb-reading-track'),fill=meter.querySelector('span');
 const anchors=[page.querySelector('#nb-story-start'),...sectionNodes.map(x=>x.node),page.querySelector('#nb-article-end')].filter(Boolean);
 let scheduled=false;
 const measure=()=>{
  scheduled=false;if(!page.isConnected)return;
  const article=page.querySelector('.ns-blog-paper');
  const top=article.getBoundingClientRect().top+window.scrollY;
  const bottom=article.getBoundingClientRect().bottom+window.scrollY;
  const available=Math.max(1,bottom-top-window.innerHeight*.48);
  const percent=Math.round(Math.max(0,Math.min(100,(window.scrollY-top+window.innerHeight*.28)/available*100)));
  meter.setAttribute('aria-valuenow',String(percent));readingPercent.textContent=percent+'%';fill.style.width=percent+'%';
  const threshold=window.innerHeight*.28;
  let active='nb-story-start';
  for(const node of anchors){if(node.getBoundingClientRect().top<=threshold)active=node.id;}
  contents.querySelectorAll('a[data-nb-anchor]').forEach(link=>{
   const selected=link.dataset.nbAnchor===active;
   link.classList.toggle('is-current',selected);
   if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
  });
 };
 const schedule=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(measure);};
 window.addEventListener('scroll',schedule,{passive:true,signal});
 window.addEventListener('resize',schedule,{passive:true,signal});
 measure();
 page.querySelectorAll('[data-nb-reaction]').forEach(button=>button.addEventListener('click',()=>{
  const previous=readReaction(post.id),value=previous===button.dataset.nbReaction?null:button.dataset.nbReaction;
  const status=page.querySelector('#nb-interaction-status');
  try {writeReaction(post.id,value);
   page.querySelectorAll('[data-nb-reaction]').forEach(item=>item.setAttribute('aria-pressed',String(item.dataset.nbReaction===value)));
   status.textContent=value?'Your reaction was saved on this device.':'Your reaction was cleared.';
  }catch{status.textContent='Your reaction could not be saved on this device.';}
 },{signal}));
 page.querySelector('[data-nb-share]').addEventListener('click',async()=>{
  const status=page.querySelector('#nb-interaction-status'),url=location.origin+location.pathname+`#post/${encodeURIComponent(post.id)}`;
  try{
   if(navigator.share)await navigator.share({title:post.title,url});
   else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);status.textContent='Article link copied.';}
   else {status.textContent='Copy the page address from your browser to share it.';}
  }catch(error){if(error?.name!=='AbortError')status.textContent='Use your browser address bar to copy the article link.';}
 },{signal});
 return cleanup;
}
