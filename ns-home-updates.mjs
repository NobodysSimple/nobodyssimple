/* Homepage developer announcements. Uses the existing published announcement
 * entries in content.json and the existing staff editor. Seen state is a small
 * device-local marker only: no personal information, Firestore writes or polls.
 */
import {escapeHTML as esc, safeHref} from './core.mjs';

const SEEN_KEY='ns-home-announcements-seen-v1';
const routeName=()=>location.hash.slice(1).split('/')[0]||'home';
const stamp=post=>`${post.id}:${post.updatedAt||post.publishedAt||''}`;
export function activeHomeAnnouncements(posts,now=Date.now()){
 return (Array.isArray(posts)?posts:[]).filter(post=>{
  if(!post||post.type!=='announcement'||post.status!=='published'||!post.id||!(post.destinations||[]).includes('home'))return false;
  const start=post.announcementStart?Date.parse(post.announcementStart):NaN;
  const end=post.announcementEnd?Date.parse(post.announcementEnd):NaN;
  return (!Number.isFinite(start)||start<=now)&&(!Number.isFinite(end)||end>=now);
 }).sort((a,b)=>Number(Boolean(b.announcementPinned))-Number(Boolean(a.announcementPinned))||Number(b.announcementPriority||0)-Number(a.announcementPriority||0)||String(b.publishedAt||b.updatedAt||'').localeCompare(String(a.publishedAt||a.updatedAt||'')));
}
export function countUnseenUpdates(items,seen){const set=new Set(Array.isArray(seen)?seen:[]);return items.filter(p=>!set.has(stamp(p))).length;}
function readSeen(){try{const v=JSON.parse(localStorage.getItem(SEEN_KEY));return Array.isArray(v)?v.filter(x=>typeof x==='string').slice(-200):[];}catch{return inMemorySeen;}}
function saveSeen(items){inMemorySeen=items.slice(-200);try{localStorage.setItem(SEEN_KEY,JSON.stringify(inMemorySeen));}catch{/* The badge still clears within this session. */}}
function readableBody(raw){
 const html=String(raw||'').replace(/<\s*br\s*\/?\s*>/gi,'\n').replace(/<\s*\/p\s*>/gi,'\n\n').replace(/<[^>]*>/g,' ');
 const box=document.createElement('textarea');box.innerHTML=html;return box.value.replace(/\r\n/g,'\n').trim();
}
function displayDate(raw){const d=new Date(raw||0);return Number.isFinite(+d)?new Intl.DateTimeFormat(undefined,{day:'numeric',month:'short',year:'numeric'}).format(d):'Update';}
function postLink(post){const url=String(post.announcementLink||'').trim();return (!url||url==='#blog')?`#post/${encodeURIComponent(post.id)}`:(safeHref(url)||`#post/${encodeURIComponent(post.id)}`);}
let current=[];
let installed=false;
let inMemorySeen=[];
function dialog(){
 let el=document.querySelector('#ns-home-updates-dialog');
 if(el)return el;
 el=document.createElement('dialog');el.id='ns-home-updates-dialog';el.className='ns-home-updates-dialog';el.setAttribute('aria-labelledby','ns-updates-heading');
 document.body.append(el);return el;
}
function syncBell(){
 const bell=document.querySelector('[data-ns-updates-toggle]');if(!bell)return;
 bell.hidden=routeName()!=='home';
 const unread=countUnseenUpdates(current,readSeen());
 bell.classList.toggle('has-new',unread>0);
 bell.setAttribute('aria-label',unread?`${unread} new developer update${unread===1?'':'s'}`:'Developer updates');
 bell.title=unread?`${unread} new update${unread===1?'':'s'}`:'Developer updates';
 const existing=dialog();if(bell.hidden&&existing.open)existing.close();
}
function openUpdates(){
 const bell=document.querySelector('[data-ns-updates-toggle]');
 if(!bell||routeName()!=='home')return;
 const el=dialog();
 const articles=current.length?current.map(post=>`<article class="ns-update-item"><div class="ns-update-item__meta"><span>${esc(post.announcementLabel||'Developer update')}</span><time>${esc(displayDate(post.publishedAt||post.updatedAt))}</time></div><h3>${esc(post.title||'An update from Nobody’s Simple')}</h3><p>${esc(readableBody(post.body||post.excerpt||post.intro||'A new update is available.'))}</p><a href="${esc(postLink(post))}">Read full update <span aria-hidden="true">→</span></a></article>`).join(''):'<p class="ns-updates-empty">No developer updates have been published yet. Check again another time.</p>';
 el.innerHTML=`<div class="ns-updates-header"><div><p class="ns-updates-eyebrow">FROM THE CREATOR</p><h2 id="ns-updates-heading">Developer updates</h2><p>Notes about what’s changing at Nobody’s Simple.</p></div><button type="button" data-ns-updates-close aria-label="Close updates">×</button></div><div class="ns-updates-list">${articles}</div>`;
 el.querySelector('[data-ns-updates-close]').onclick=()=>el.close();
 el.querySelectorAll('.ns-update-item a').forEach(a=>a.addEventListener('click',()=>el.close()));
 if(typeof el.showModal==='function')el.showModal();else el.setAttribute('open','');
 const next=new Set(readSeen());current.forEach(p=>next.add(stamp(p)));saveSeen([...next]);syncBell();
 el.querySelector('[data-ns-updates-close]').focus();
}
export function setupHomeUpdates(posts){
 current=activeHomeAnnouncements(posts);
 const bell=document.querySelector('[data-ns-updates-toggle]');if(!bell)return;
 bell.onclick=openUpdates;
 if(!installed){installed=true;window.addEventListener('hashchange',()=>requestAnimationFrame(syncBell));dialog().addEventListener('click',event=>{if(event.target===event.currentTarget)event.currentTarget.close();});}
 syncBell();
}
