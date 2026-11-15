import {escapeHTML as esc} from './core.mjs';
import {AVATARS} from './account-policy.mjs';
import {createCommunityClient} from './community-data.mjs';
import {LIMITS,REACTIONS,wordCount,communityError,MIME_TYPES,attachmentName} from './community-policy.mjs';
let config={},client,version=0,stops=[];
export function configureCommunity(value){config=value;client=createCommunityClient(value.connection);}
export function cleanupCommunity(){version++;for(const stop of stops)stop();stops=[];}
const begin=()=>{cleanupCommunity();return version;};
const alive=v=>v===version;
const user=()=>client.state().auth.currentUser;
const canWrite=()=>!!user()?.emailVerified;
const date=value=>{const ms=value?.toMillis?.()||0;return ms?new Date(ms).toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'}):'Sending…';};
const avatar=p=>`media/avatars/${AVATARS.includes(p?.avatarId)?p.avatarId:'base'}.png`;
const author=p=>`<a class="board-author" href="#profile/${encodeURIComponent(p.authorUid||p.uid)}"><img src="${esc(avatar(p))}" alt="" width="44" height="44"><span><strong>${esc(p.nickname||p.full?.nickname||'Community member')}</strong>${p.handle?`<small>@${esc(p.handle)}</small>`:''}</span></a>`;
const shell=content=>{
 const messages=location.hash.startsWith('#messages'),heading=messages?'Your quiet corner.':'A place to talk things through.';
 const tagline=messages?'Continue a private conversation, or send someone a thoughtful note.':'Share a thought, ask a question or offer a useful perspective. There’s room for all kinds of days here.';
 return `<div class="wrap board-page board-campfire ${messages?'board-messages-page':'board-discussion-page'}">
  <header class="board-header board-campfire-hero">
   <div class="board-hero-copy"><p class="eyebrow">NOBODY’S SIMPLE · ${messages?'MESSAGES':'COMMUNITY'}</p><h1>${heading}</h1><p>${tagline}</p></div>
   <img class="board-hero-scene" src="community-art/campfire-hero.svg" alt="" loading="eager" decoding="async">
  </header>
  <nav class="board-nav board-campfire-nav" aria-label="Community">
   <a class="button secondary ${messages?'':'is-active'}" href="#discussion" ${messages?'':'aria-current="page"'}><span aria-hidden="true">☷</span> Discussion board</a>
   <a class="button secondary ${messages?'is-active':''}" href="#messages" ${messages?'aria-current="page"':''}><span aria-hidden="true">✉</span> Messages</a>
   <a class="board-nav-privacy" href="#account/community">Privacy &amp; blocked accounts</a>
  </nav>
  ${content}</div>`;
};
const boardTopics=[
 {id:'all',label:'All',icon:'✦',pattern:null},
 {id:'support',label:'Support',icon:'♡',pattern:/\b(help|support|overwhelm|stuck|struggl|burnout|anxious|lonely|hard time|feeling low)\b/i},
 {id:'advice',label:'Advice',icon:'✧',pattern:/\b(advice|tips|suggest|recommend|how do|what should|help me|guidance|any ideas)\b/i},
 {id:'wins',label:'Small wins',icon:'✳',pattern:/\b(proud|win|achievement|managed|celebrat|finally|progress|good news|grateful)\b/i},
 {id:'questions',label:'Questions',icon:'?',pattern:/\?|question|wonder|why\b|how\b|can anyone/i},
 {id:'venting',label:'Venting',icon:'☁',pattern:/\b(vent|rant|frustrat|angry|fed up|exhausted|upset)\b/i},
 {id:'creativity',label:'Creativity',icon:'✎',pattern:/\b(art|drawing|painting|poem|write|writing|music|craft|creativ|design)\b/i},
 {id:'everyday',label:'Daily life',icon:'☕',pattern:/\b(today|routine|daily|morning|evening|work|home|family|friend|sleep|habit|life)\b/i}
];
const boardMatchesTopic=(post,topic)=>{
 if(topic==='all')return true;
 const target=String(post.title||'')+' '+String(post.body||'');
 return boardTopics.find(item=>item.id===topic)?.pattern?.test(target)||false;
};
const boardWelcomePost=post=>/\bwelcome to (?:the )?nobody[’']?s simple community\b/i.test(String(post.title||''));
function gate(privateWork=false){if(privateWork&&client.state().locked)return '<aside class="board-gate"><h2>Your messages are locked.</h2><p>Confirm your identity in Account to open private messages.</p><a class="button" href="#account">Open Account</a></aside>';if(canWrite())return '';return `<aside class="board-gate"><strong>${user()?'Verify your email to join in.':'Guests can read. Verified members can join in.'}</strong><p>${user()?'Check the verification email, then refresh your status.':'Sign in, choose a nickname and verify your email to post, comment, react or message.'}</p>${user()?'<a class="button secondary" href="#account/security">Email verification settings</a><button class="chip" data-refresh-verification>I have verified my email</button>':'<button class="button" data-board-signin>Sign in / create account</button>'}<p role="status"></p></aside>`;}
function bindGate(root,rerender){root.querySelectorAll('[data-board-signin]').forEach(b=>b.onclick=()=>config.signIn());root.querySelectorAll('[data-refresh-verification]').forEach(b=>b.onclick=async()=>{try{b.disabled=true;const ok=await client.refreshVerification();if(ok)rerender();else b.closest('aside').querySelector('[role=status]').textContent='The email is not marked verified yet. Open the email link, then try again.';}catch(e){b.closest('aside').querySelector('[role=status]').textContent=communityError(e);}finally{b.disabled=false;}});}
function counter(form,kind){const box=form.querySelector('textarea'),out=form.querySelector('[data-count]');if(!box||!out)return;const show=()=>{out.textContent=`${wordCount(box.value).toLocaleString()} / ${LIMITS[kind+'Words'].toLocaleString()} words · ${box.value.length.toLocaleString()} / ${LIMITS[kind+'Chars'].toLocaleString()} characters`;};box.addEventListener('input',show);show();}
async function run(form,work){const status=form.querySelector('[role=status]'),buttons=[...form.querySelectorAll('button,input,textarea,select')];buttons.forEach(b=>b.disabled=true);status.textContent='Saving…';try{await work();}catch(e){status.textContent=communityError(e);}finally{buttons.forEach(b=>b.disabled=false);}}
function writeActions(item,kind,postId=''){if(!canWrite())return '';return item.authorUid===user().uid?`<button class="chip" data-remove-${kind}="${esc(item.id)}">Delete ${kind==='post'?'post':'comment'}</button>`:`<button class="chip" data-report-${kind}="${esc(item.id)}">Report</button><button class="chip" data-board-block="${esc(item.authorUid)}">Block account</button>`;}
async function report(target,body){const reason=prompt('Why are you reporting this? Your report includes this content for moderators.');if(!reason)return;await client.report(target,reason,body);alert('Report sent to moderators.');}
function blockButtons(root,rerender){root.querySelectorAll('[data-board-block]').forEach(b=>b.onclick=async()=>{if(!confirm('Block this account? This hides their posts for you and prevents new messages and direct comments between your accounts.'))return;try{await client.block(b.dataset.boardBlock);rerender();}catch(e){alert(communityError(e));}});}
export async function renderDiscussion(root,id=''){
 const v=begin();
 if(id==='new'){renderComposer(root);return;}
 if(id){await renderPost(root,id,v);return;}
  root.innerHTML=shell(`${gate()}
  <div class="board-feed-heading">
   <div><p class="board-section-eyebrow">✦ COMMUNITY CAMPFIRE</p><h2>Conversations by the fire</h2><p>Real people, thoughtful questions and little victories. Come as you are.</p></div>
   <div class="board-feed-actions">${canWrite()?'<a class="button board-write-post" href="#discussion/new">✎ Write a post +</a>':''}<button class="chip" data-feed-refresh>↻ Refresh</button></div>
  </div>
  <div class="board-community-grid">
   <main class="board-community-main">
    <p class="board-public-note">Posts and comments are public. Use your nickname and avoid sharing anyone’s private information.</p>
    <label class="field board-search-field">Search loaded discussions<input type="search" data-board-search placeholder="Search discussions…" autocomplete="off"></label>
    <div class="board-topic-filters" role="group" aria-label="Filter loaded discussions by suggested topic">
     ${boardTopics.map(topic=>`<button type="button" class="board-topic-filter" data-board-topic="${topic.id}" aria-pressed="${topic.id==='all'}"><span aria-hidden="true">${topic.icon}</span> ${topic.label}</button>`).join('')}
    </div>
    <p class="board-filter-note">Suggested themes filter the discussions loaded on this page.</p>
    <div class="board-feed" data-board-feed><p role="status">Gathering conversations…</p></div>
    <button class="button secondary board-load-more" data-feed-more hidden>Load more discussions</button>
    <p role="status" data-feed-status></p><div data-staff-door></div>
   </main>
   <aside class="board-community-aside" aria-label="Community information">
    <section class="board-seat-card"><p class="board-section-eyebrow">YOU BELONG HERE</p><h3>Pull up a seat.</h3>
     <p>You don’t need the perfect words to join in. Share a question or simply listen to the conversation.</p>
     <p>Everyone arrives with a different story. There’s space for yours.</p>
    </section>
    <section class="board-safety-card"><p class="board-section-eyebrow">LOOKING AFTER EACH OTHER</p><h3>Keep the fire welcoming.</h3>
     <p>People can disagree and still speak with care. Privacy and respect matter here.</p>
     <a href="#account/community">Community &amp; privacy settings <span aria-hidden="true">→</span></a>
     <a href="#support">Get support <span aria-hidden="true">→</span></a>
    </section>
   </aside>
  </div>
  <section class="board-community-footer"><div><p class="board-section-eyebrow">WHEN YOU'RE READY</p><h2>Your community, your pace.</h2><p>Read quietly, join a discussion or step away whenever you need.</p></div><div class="board-footer-actions"><a href="#account/community">Community &amp; privacy settings →</a><a href="#messages">Your conversations →</a><a href="#support">Get help →</a></div></section>
 `);
 bindGate(root,()=>renderDiscussion(root));root.querySelector('[data-feed-refresh]').onclick=()=>renderDiscussion(root);
 let loaded=[],hidden=[],cursor=null,activeTopic='all';
  const paint=()=>{
   const input=root.querySelector('[data-board-search]');
   if(!input)return;
   const needle=input.value.trim().toLowerCase();
   const items=loaded.filter(post=>!hidden.includes(post.authorUid)
      &&(String(post.title||'')+' '+String(post.body||'')).toLowerCase().includes(needle)
      &&boardMatchesTopic(post,activeTopic));
   root.querySelector('[data-board-feed]').innerHTML=items.map(post=>{
    const featured=boardWelcomePost(post),preview=String(post.body||''),short=preview.slice(0,200);
    return `<article class="board-feed-card ${featured?'board-featured-post':''}">
     ${featured?'<p class="board-featured-label">✦ COMMUNITY WELCOME</p>':''}
     <div class="board-byline">${author(post)}<time>${esc(date(post.createdAt))}</time></div>
     <a class="board-post-link" href="#discussion/${encodeURIComponent(post.id)}">
      <h2>${esc(post.title)}</h2><p>${esc(short)}${preview.length>200?'…':''}</p>
      <span class="board-post-cta">Open discussion <span aria-hidden="true">→</span></span>
     </a>
     <div class="board-card-footer"><span class="board-card-label">${featured?'✧ Welcome to the fire':'☷ Community discussion'}</span>
      ${post.attachmentCount? `<span class="board-card-label">↗ ${post.attachmentCount} ${post.attachmentCount===1?'attachment':'attachments'}</span>`:''}
     </div>
    </article>`;
   }).join('')||'<div class="board-empty">No loaded discussions match these filters. Try All or load more discussions.</div>';
  };
 const load=async()=>{const button=root.querySelector('[data-feed-more]');button.disabled=true;try{const page=await client.feed(cursor);if(!alive(v))return;loaded.push(...page);cursor=page.at(-1)?.cursor;paint();button.hidden=page.length<15;root.querySelector('[data-feed-status]').textContent='';}catch(e){if(alive(v))root.querySelector('[data-feed-status]').textContent=communityError(e);}finally{if(alive(v))button.disabled=false;}};
 root.querySelector('[data-board-search]').oninput=paint;root.querySelector('[data-feed-more]').onclick=load;
  root.querySelectorAll('[data-board-topic]').forEach(button=>{
   button.addEventListener('click',()=>{
    activeTopic=button.dataset.boardTopic;
    root.querySelectorAll('[data-board-topic]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
    paint();
   });
  });
 try{hidden=await client.blocked();if(!alive(v))return;await load();if(await client.isStaff()&&alive(v))root.querySelector('[data-staff-door]').innerHTML='<a href="#discussion-moderation">Review community reports →</a>';}catch(e){if(alive(v))root.querySelector('[data-feed-status]').textContent=communityError(e);}
}
function renderComposer(root){root.innerHTML=shell(`<a href="#discussion">← All discussions</a><h2>Start a discussion</h2>${gate()}${canWrite()?`<form class="board-compose"><label class="field">Title<input name="heading" minlength="3" maxlength="120" required placeholder="What would you like to talk about?"></label><label class="field">Your post<textarea name="body" rows="12" maxlength="40000" required placeholder="Share the context, your question or the idea you want to explore."></textarea></label><p class="fine" data-count></p><label class="field">Attachments (optional)<input name="files" type="file" multiple accept="image/png,image/jpeg,image/webp,application/pdf,text/plain"></label><p class="fine">Up to two images, PDFs or text files, 120 KB each. Your post can contain up to 5,000 words, within 40,000 characters.</p><p>Your nickname and avatar will appear on this public post.</p><button class="button">Publish discussion</button><p role="status"></p></form>`:''}`);bindGate(root,()=>renderDiscussion(root,'new'));const form=root.querySelector('form');if(!form)return;counter(form,'post');form.onsubmit=e=>{e.preventDefault();run(form,async()=>{const id=await client.publish({heading:form.elements.heading.value,body:form.elements.body.value,files:[...form.elements.files.files]});location.hash='#discussion/'+id;});};}
async function renderPost(root,id,v){
 root.innerHTML=shell('<p role="status">Opening discussion…</p>');
 try{const [p,blocked]=await Promise.all([client.post(id),client.blocked()]);if(!alive(v))return;if(!p||p.status!=='published'||blocked.includes(p.authorUid)){root.innerHTML=shell('<h2>This discussion is unavailable.</h2><p>It may have been removed or hidden by your blocked-account settings.</p>');return;}
 root.innerHTML=shell(`<a href="#discussion">← All discussions</a><article class="board-full-post"><div class="board-byline">${author(p)}<time>${esc(date(p.createdAt))}</time></div><h2>${esc(p.title)}</h2><div class="board-body">${esc(p.body)}</div>${p.attachmentCount?`<div class="board-attachments"><h3>Attachments</h3>${Array.from({length:p.attachmentCount},(_,i)=>`<button type="button" class="chip" data-attachment="${i}">Open attachment ${i+1}</button>`).join('')}<p class="fine" data-file-status role="status"></p></div>`:''}<div class="row">${writeActions(p,'post')}</div>${p.authorUid===user()?.uid&&canWrite()?`<details class="board-edit"><summary>Edit your post</summary><form><label class="field">Title<input name="heading" maxlength="120" value="${esc(p.title)}" required></label><label class="field">Post<textarea name="body" rows="10" maxlength="40000" required>${esc(p.body)}</textarea></label><p data-count class="fine"></p><button class="button secondary">Save changes</button><p role="status"></p></form></details>`:''}</article><section class="board-reactions" aria-label="React to this post"><h3>Leave a reaction</h3><p class="fine">One reaction per person. Choose it again to remove it.</p><div data-reactions></div><p role="status" data-reaction-status></p></section>${gate()}<section class="board-comments"><div class="board-toolbar"><h2>Comments</h2><button class="chip" data-comments-refresh>Refresh comments</button></div><div data-comments><p>Loading comments…</p></div><button class="chip" data-more-comments hidden>Load more comments</button><p role="status" data-comment-status></p>${canWrite()?'<form class="board-reply-form"><label class="field">Add a comment<textarea name="body" rows="5" maxlength="12000" required></textarea></label><p data-count class="fine"></p><button class="button">Post comment</button><p role="status"></p></form>':''}</section>`);
 bindGate(root,()=>renderDiscussion(root,id));blockButtons(root,()=>renderDiscussion(root,id));
 root.querySelector('[data-remove-post]')?.addEventListener('click',async()=>{if(!confirm('Remove this post and its attachments from public view?'))return;try{await client.removePost(id);location.hash='#discussion';}catch(e){alert(communityError(e));}});
 root.querySelector('[data-report-post]')?.addEventListener('click',()=>report({kind:'post',postId:id,authorUid:p.authorUid},p.body).catch(e=>alert(communityError(e))));
 const edit=root.querySelector('.board-edit form');if(edit){counter(edit,'post');edit.onsubmit=e=>{e.preventDefault();run(edit,async()=>{await client.editPost(id,edit.elements.heading.value,edit.elements.body.value);renderDiscussion(root,id);});};}
 root.querySelectorAll('[data-attachment]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{const f=await client.getAttachment(id,b.dataset.attachment);if(!alive(v))return;if(!f||!MIME_TYPES.includes(f.mime))throw Error('This file is unavailable.');const bytes=Uint8Array.from(atob(f.data),c=>c.charCodeAt(0)),blob=new Blob([bytes],{type:f.mime}),url=URL.createObjectURL(blob);const dialog=document.createElement('dialog');dialog.className='board-file-dialog';dialog.setAttribute('aria-label','Attachment');dialog.innerHTML=`<button class="chip" data-file-close>Close ×</button><h2>${esc(f.name)}</h2>${f.mime.startsWith('image/')?`<img src="${url}" alt="${esc(f.name)}">`:'<p>Download this attachment to read it.</p>'}<a class="button" href="${url}" download="${esc(attachmentName(f.name,f.mime))}">Download file</a>`;document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{URL.revokeObjectURL(url);dialog.remove();},{once:true});dialog.showModal();}catch(e){if(alive(v))root.querySelector('[data-file-status]').textContent=communityError(e);}finally{b.disabled=false;}});
 const paintReactions=async()=>{try{const state=await client.reactions(id);if(!alive(v))return;root.querySelector('[data-reactions]').innerHTML=REACTIONS.map(r=>`<button type="button" class="board-reaction" data-react="${r.id}" aria-pressed="${state.own===r.id}" ${canWrite()?'':'disabled'}><img src="media/avatars/${r.avatar}.png" alt="" width="48" height="52"><span>${esc(r.label)}</span><strong>${state.counts[r.id]||0}</strong></button>`).join('');root.querySelectorAll('[data-react]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await client.react(id,b.dataset.react);await paintReactions();}catch(e){root.querySelector('[data-reaction-status]').textContent=communityError(e);b.disabled=false;}});}catch(e){if(alive(v))root.querySelector('[data-reaction-status]').textContent=communityError(e);}};paintReactions();
 let comments=[],cursor=null;const paintComments=()=>{root.querySelector('[data-comments]').innerHTML=comments.filter(c=>!blocked.includes(c.authorUid)).map(c=>`<article class="board-comment"><div class="board-byline">${author(c)}<time>${esc(date(c.createdAt))}</time></div><div class="board-body">${esc(c.body)}</div><div class="row">${writeActions(c,'reply',id)}</div></article>`).join('')||'<p>No comments yet.</p>';root.querySelectorAll('[data-remove-reply]').forEach(b=>b.onclick=async()=>{if(!confirm('Delete your comment?'))return;try{await client.removeReply(id,b.dataset.removeReply);comments=comments.filter(c=>c.id!==b.dataset.removeReply);paintComments();}catch(e){alert(communityError(e));}});root.querySelectorAll('[data-report-reply]').forEach(b=>b.onclick=()=>{const c=comments.find(c=>c.id===b.dataset.reportReply);report({kind:'reply',postId:id,replyId:c.id,authorUid:c.authorUid},c.body).catch(e=>alert(communityError(e)));});blockButtons(root,()=>renderDiscussion(root,id));};
 const loadComments=async(reset=false)=>{try{if(reset){comments=[];cursor=null;}const page=await client.replies(id,cursor);if(!alive(v))return;comments.push(...page);cursor=page.at(-1)?.cursor;paintComments();root.querySelector('[data-more-comments]').hidden=page.length<30;root.querySelector('[data-comment-status]').textContent='';}catch(e){if(alive(v))root.querySelector('[data-comment-status]').textContent=communityError(e);}};
 root.querySelector('[data-comments-refresh]').onclick=()=>loadComments(true);root.querySelector('[data-more-comments]').onclick=()=>loadComments();loadComments();
 const form=root.querySelector('.board-reply-form');if(form){counter(form,'reply');form.onsubmit=e=>{e.preventDefault();run(form,async()=>{await client.reply(id,form.elements.body.value);form.reset();form.elements.body?.dispatchEvent(new Event('input',{bubbles:true}));form.querySelector('[role=status]').textContent='Comment posted.';await loadComments(true);});};}
 }catch(e){if(alive(v))root.innerHTML=shell(`<h2>This discussion could not be opened.</h2><p>${esc(communityError(e))}</p>`);}
}
export async function renderMemberProfile(root,uid){const v=begin();root.innerHTML=shell('<p>Opening profile…</p>');try{if(!/^[A-Za-z0-9_-]{1,128}$/.test(uid))throw Error('This account is unavailable.');const p=await client.profile(uid);if(!alive(v))return;const display=p.full||p;root.innerHTML=shell(`<section class="board-profile"><img class="board-profile-avatar" src="${esc(avatar(display))}" alt="Chosen avatar"><h2>${esc(display.nickname||'Private or unavailable profile')}</h2>${display.handle?`<p>@${esc(display.handle)}</p>`:''}${p.full?`<p>${esc(p.full.pronouns||'')}</p><p>${esc(p.full.bio||'')}</p>`:'<p>This account has not shared a public bio.</p>'}${user()?.uid===uid?'<a class="button" href="#account/profile">Edit your profile</a>':`<div class="row"><a class="button" href="#messages/${encodeURIComponent(uid)}">Send a message →</a></div>${gate(true)}${canWrite()&&!client.state().locked?`<form class="board-flower-form"><label>Send a small nudge <select name="flowers">${[1,3,5,10,12].map(n=>`<option value="${n}">${n} flower${n===1?'':'s'}</option>`).join('')}</select></label><button class="button secondary">Send flowers 🌼</button><p class="fine">A symbolic gesture, with no payment.</p><p role="status"></p></form><button class="chip" data-board-block="${esc(uid)}">Block account</button>`:''}`}</section>`);bindGate(root,()=>renderMemberProfile(root,uid));blockButtons(root,()=>renderMemberProfile(root,uid));const f=root.querySelector('form');if(f)f.onsubmit=e=>{e.preventDefault();run(f,async()=>{await client.send(uid,{flowerCount:f.elements.flowers.value});location.hash='#messages/'+encodeURIComponent(uid);});};}catch(e){if(alive(v))root.innerHTML=shell(`<p>${esc(communityError(e))}</p>`);}}
export async function renderMessages(root,to=''){
 const v=begin();const restricted=gate(true);if(!canWrite()||client.state().locked){root.innerHTML=shell(restricted);bindGate(root,()=>renderMessages(root,to));return;}
 if(to===user().uid){root.innerHTML=shell('<p>Choose another member to start a conversation.</p>');return;}
 root.innerHTML=shell(`<section class="board-private-intro"><span class="board-private-icon" aria-hidden="true">✉</span><div><p class="board-section-eyebrow">A QUIETER CORNER</p><h2>Messages that stay between you.</h2><p>Your conversations are private to participants, but not end-to-end encrypted. Reporting selected messages shares that text with moderators.</p></div></section><header class="board-toolbar"><h2>${to?'Your conversation':'Messages'}</h2>${to?'<a href="#messages">← All conversations</a>':''}</header>${to?`<div data-chat-person></div><div class="board-chat"><button class="chip" data-older-messages hidden>Load earlier messages</button><div data-chat-messages aria-live="polite"><p>Opening conversation…</p></div></div><form class="board-message-form"><label class="field">Your message<textarea name="body" maxlength="12000" rows="4" required></textarea></label><p class="fine" data-count></p><button class="button">Send message →</button><p role="status"></p></form><form class="board-flower-form"><label>A small nudge <select name="flowers">${[1,3,5,10,12].map(n=>`<option value="${n}">${n} flower${n===1?'':'s'}</option>`).join('')}</select></label><button class="button secondary">Send flowers 🌼</button><p role="status"></p></form>`:'<div data-inbox><p>Opening inbox…</p></div>'}<p role="status" data-message-status></p>`);
 try{if(!to){const peopleCache=new Map();stops.push(client.inbox(async rows=>{const people=await Promise.all(rows.map(t=>{const uid=t.members.find(uid=>uid!==user().uid);if(!peopleCache.has(uid))peopleCache.set(uid,client.profile(uid).catch(()=>({})));return peopleCache.get(uid);}));if(!alive(v))return;root.querySelector('[data-inbox]').innerHTML=rows.map((t,i)=>{const uid=t.members.find(uid=>uid!==user().uid),p=people[i];return `<a class="board-conversation" href="#messages/${encodeURIComponent(uid)}"><img src="${esc(avatar(p))}" alt=""><span><strong>${esc(p.nickname||p.full?.nickname||'Community member')}</strong><small>${esc(date(t.updatedAt))}</small></span><span>Open →</span></a>`;}).join('')||'<p>Your inbox is empty. Open a member’s profile to send a message or flowers.</p>';},e=>{if(alive(v))root.querySelector('[data-message-status]').textContent=communityError(e);}));return;}
 if(!/^[A-Za-z0-9_-]{1,128}$/.test(to))throw Error('This account is unavailable.');const p=await client.profile(to);if(!alive(v))return;root.querySelector('[data-chat-person]').innerHTML=`<div class="board-chat-person">${author({...p,uid:to})}<button class="chip" data-board-block="${esc(to)}">Block account</button></div>`;blockButtons(root,()=>renderMessages(root,to));let latest=[],older=[];
 const paint=()=>{const all=[...new Map([...older,...latest].map(m=>[m.id,m])).values()].sort((a,b)=>(a.createdAt?.toMillis?.()||0)-(b.createdAt?.toMillis?.()||0));root.querySelector('[data-chat-messages]').innerHTML=all.map(m=>`<article class="board-message ${m.authorUid===user().uid?'mine':''}"><small>${m.authorUid===user().uid?'You':esc(p.nickname||p.full?.nickname||'Member')} · ${esc(date(m.createdAt))}</small>${m.kind==='flowers'?`<p class="board-flower-nudge">🌼 ${m.flowerCount} flower${m.flowerCount===1?'':'s'} for you</p>`:`<p class="board-body">${esc(m.body)}</p>`}${m.authorUid!==user().uid?`<button class="chip" data-report-message="${esc(m.id)}">Report</button>`:''}</article>`).join('')||'<p>No messages yet. Say hello when you are ready.</p>';root.querySelector('[data-older-messages]').hidden=latest.length<50&&older.length===0;root.querySelectorAll('[data-report-message]').forEach(b=>b.onclick=()=>{const m=all.find(m=>m.id===b.dataset.reportMessage);report({kind:'message',threadId:[user().uid,to].sort().join('~'),messageId:m.id,authorUid:m.authorUid},m.body).catch(e=>alert(communityError(e)));});};
 stops.push(client.messages(to,m=>{if(!alive(v))return;latest=m;paint();},e=>{if(alive(v))root.querySelector('[data-message-status]').textContent=communityError(e);}));
 root.querySelector('[data-older-messages]').onclick=async e=>{try{const cursor=older[0]?.cursor||latest[0]?.cursor;if(!cursor)return;const page=await client.earlierMessages(to,cursor);if(!alive(v))return;older=[...page,...older];paint();e.target.hidden=page.length<50;}catch(e){root.querySelector('[data-message-status]').textContent=communityError(e);}};
 const form=root.querySelector('.board-message-form');counter(form,'message');form.onsubmit=e=>{e.preventDefault();run(form,async()=>{await client.send(to,{body:form.elements.body.value});form.reset();form.elements.body?.dispatchEvent(new Event('input',{bubbles:true}));form.querySelector('[role=status]').textContent='Sent.';});};const flowersForm=root.querySelector('.board-flower-form');flowersForm.onsubmit=e=>{e.preventDefault();run(flowersForm,async()=>{await client.send(to,{flowerCount:flowersForm.elements.flowers.value});flowersForm.querySelector('[role=status]').textContent='Flowers sent.';});};
 }catch(e){if(alive(v))root.querySelector('[data-message-status]').textContent=communityError(e);}
}
export async function renderDiscussionModeration(root){const v=begin();root.innerHTML=shell('<h2>Community reports</h2><p>Loading…</p>');try{if(!await client.isStaff())throw Error('Staff access required.');const reports=await client.reports();if(!alive(v))return;root.innerHTML=shell(`<h2>Community reports</h2><p>Private message reports contain only the reported text. General access to other people’s conversations is not granted.</p>${reports.map(r=>`<article class="board-report"><h3>${esc(r.kind)} report</h3><p>${esc(r.reason)}</p><blockquote class="board-body">${esc(r.quotedText||'Flower nudge')}</blockquote><div class="row">${r.kind!=='message'?`<a href="#discussion/${esc(r.postId)}">Open discussion</a><button class="chip" data-hide-report="${esc(r.id)}">Hide content</button>`:''}<button class="chip" data-resolve-report="${esc(r.id)}">Resolve</button>${r.reportedUid!==user().uid?`<button class="chip" data-ban-report="${esc(r.id)}">Suspend author from community</button>`:""}</div></article>`).join('')||'<p>No open reports.</p>'}<p role="status" data-moderation-status></p>`);root.querySelectorAll('[data-hide-report],[data-resolve-report],[data-ban-report]').forEach(b=>b.onclick=async()=>{b.disabled=true;try{await config.confirmIdentity();const id=b.dataset.hideReport||b.dataset.resolveReport||b.dataset.banReport,r=reports.find(r=>r.id===id);if(b.dataset.banReport){if(!confirm('Suspend this account from community actions?')){b.disabled=false;return;}await client.moderate({...r,uid:r.reportedUid},'ban');}else await client.moderate(r,b.dataset.resolveReport?'resolve':'hide');root.querySelector('[data-moderation-status]').textContent='Moderation saved.';b.closest('article').remove();}catch(e){root.querySelector('[data-moderation-status]').textContent=communityError(e);b.disabled=false;}});}catch(e){if(alive(v))root.innerHTML=shell(`<p>${esc(communityError(e))}</p>`);}}
