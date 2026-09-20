export const escapeHTML = value => String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function youtubeID(value){
 if(/^[\w-]{11}$/.test(value))return value;
 try{const u=new URL(value);if(u.protocol!=='https:')return null;
 if(['youtu.be','www.youtu.be'].includes(u.hostname))return /^[\w-]{11}$/.test(u.pathname.slice(1))?u.pathname.slice(1):null;
 if(!['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(u.hostname))return null;
 const id=u.pathname==='/watch'?u.searchParams.get('v'):u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})\/?$/)?.[1];
 return /^[\w-]{11}$/.test(id||'')?id:null;}catch{return null;}
}
export const safeImage = value => /^(?:media\/[a-zA-Z0-9_.-]+\.(?:png|jpg|jpeg|webp)|(?:logo|banner|characters2?)\.png)$/.test(value||'')?value:'';
export function renderBody(body){return String(body||'').split(/\n\s*\n/).map(block=>{
 const image=block.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
 if(image&&safeImage(image[2]))return `<figure><img src="${escapeHTML(image[2])}" alt="${escapeHTML(image[1])}" loading="lazy"><figcaption>${escapeHTML(image[1])}</figcaption></figure>`;
 if(block.startsWith('## '))return `<h2>${escapeHTML(block.slice(3))}</h2>`;
 if(block.startsWith('# '))return `<h2>${escapeHTML(block.slice(2))}</h2>`;
 return `<p>${escapeHTML(block).replace(/\n/g,'<br>')}</p>`;
 }).join('');}
export function validatePost(p){
 if(!p.title?.trim())throw Error('Add a title.');
 if(!['blog','education','video'].includes(p.type))throw Error('Choose a content type.');
 if(p.type==='video'&&!youtubeID(p.youtube))throw Error('Add a valid YouTube link.');
 if(p.type!=='video'&&!p.body?.trim())throw Error('Add the writing for this piece.');
 if(!p.destinations?.length)throw Error('Choose where this piece should appear.');
 if(p.type==='blog'&&(p.destinations.length!==1||p.destinations[0]!=='blog'))throw Error('Blog posts belong in the blog. Use an education template for curriculum writing.');
 if(p.type!=='blog'&&p.destinations.some(d=>d!=='library'))throw Error('Educational writing and videos belong in the library.');
 if(p.thumbnail&&!safeImage(p.thumbnail))throw Error('Upload a supported thumbnail.');
 return p;
}
export const nearestEmotions=(emotions,x,y,n=5)=>[...emotions].sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y)).slice(0,n);
