// Spark-plan data operations. Firestore rules enforce permissions, names and cooldowns.
import {doc,collection,getDoc,getDocs,setDoc,deleteDoc,query,where,orderBy,limit,startAfter,documentId,serverTimestamp,runTransaction,writeBatch} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js';
import {deleteUser} from 'https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js';
import {nicknamePolicy,safeProfile,cleanSettings,canRename,SAVED} from './account-policy.mjs';
const stamp=v=>v?.toMillis?.()||0;
function checkUser(auth){if(!auth.currentUser)throw Error('Sign in first.');return auth.currentUser;}
export async function freeAccountCall(db,auth,name,data={}){
 const user=checkUser(auth),uid=user.uid,ref=(...parts)=>doc(db,...parts);
 if(name==='accountProfile'){
  const naming=nicknamePolicy(data.nickname),fields=safeProfile(data);
  await runTransaction(db,async tx=>{const p=ref('profiles',uid),n=ref('nicknames',naming.handle),old=(await tx.get(p)).data()||{},registry=await tx.get(n);if(old.nickname!==naming.nickname&&!canRename(stamp(old.nicknameChangedAt)))throw Error('You can change your nickname once every 14 days.');if(registry.exists()&&registry.data().uid!==uid)throw Error('That nickname is already in use.');if(!registry.exists())tx.set(n,{uid,createdAt:serverTimestamp()});tx.set(p,{...naming,...fields,createdAt:old.createdAt||serverTimestamp(),nicknameChangedAt:old.nickname===naming.nickname?old.nicknameChangedAt:serverTimestamp(),updatedAt:serverTimestamp()});});return {ok:true};
 }
 if(name==='accountSettings'){
  const settings=cleanSettings({...data,retentionDays:0,reminders:false,replyNotifications:false,mentions:false});await runTransaction(db,async tx=>{const p=ref('profiles',uid),profile=await tx.get(p);tx.set(ref('users',uid,'settings','account'),{...settings,updatedAt:serverTimestamp()});if(profile.exists()&&profile.data().visibility!==settings.profileVisibility)tx.update(p,{visibility:settings.profileVisibility,updatedAt:serverTimestamp()});});return {ok:true};
 }
 if(name==='accountSession'){
  if(!/^[a-f0-9-]{36}$/.test(data.id||''))throw Error('Invalid device identifier.');await runTransaction(db,async tx=>{const r=ref('users',uid,'devices',data.id),old=await tx.get(r);tx.set(r,{label:String(data.label||'Browser').slice(0,80),firstSeen:old.data()?.firstSeen||serverTimestamp(),lastSeen:serverTimestamp()});});return {ok:true};
 }
 if(name==='accountRevoke'){
  await setDoc(ref('accountSecurity',uid),{revokedAt:serverTimestamp()},{merge:true});const s=(await getDoc(ref('accountSecurity',uid))).data();return {ok:true,revokeTime:Math.floor(stamp(s.revokedAt)/1000)};
 }
 if(name==='accountClearWork'){
  const docs=(await getDocs(collection(db,'users',uid,'savedWork'))).docs;for(const d of docs)await runTransaction(db,async tx=>{const old=await tx.get(d.ref);if(old.exists())tx.set(d.ref,{deleted:true,revision:(old.data().revision||0)+1,updatedAt:serverTimestamp()});});return {ok:true};
 }
 if(name==='accountExport'){
  if(data.part==='metadata')return {format:'nobodyssimple-spark-v1',exportedAt:new Date().toISOString(),profile:(await getDoc(ref('profiles',uid))).data()||null,identity:{uid,email:user.email,providers:user.providerData.map(x=>x.providerId),createdAt:user.metadata.creationTime}};
  const part=data.part;if(!['savedWork','settings','devices','notifications','blocks','comments','reports'].includes(part))throw Error('Invalid export section.');let c=collection(db,...(['comments','reports'].includes(part)?[part]:['users',uid,part]));const clauses=[];if(['comments','reports'].includes(part))clauses.push(where(part==='comments'?'authorUid':'reporterUid','==',uid));clauses.push(orderBy(documentId()),limit(5));if(data.after)clauses.push(startAfter(data.after));const docs=(await getDocs(query(c,...clauses))).docs;return {items:docs.map(d=>({id:d.id,...d.data()})),next:docs.length===5?docs.at(-1).id:''};
 }
 if(name==='accountDelete'){
  if(data.confirmation!=='DELETE')throw Error('Type DELETE to confirm.');
  // A persistent marker denies old tokens access, including if cleanup is interrupted.
  await setDoc(ref('accountSecurity',uid),{deleting:true,deleteRequestedAt:serverTimestamp()},{merge:true});
  async function removeQuery(q){const rows=(await getDocs(q)).docs;for(let i=0;i<rows.length;i+=100){const batch=writeBatch(db);for(const d of rows.slice(i,i+100))batch.delete(d.ref);await batch.commit();}}
  for(const col of ['savedWork','settings','devices','notifications','blocks'])await removeQuery(collection(db,'users',uid,col));
  for(const [col,field] of [['comments','authorUid'],['reports','reporterUid'],['nicknames','uid']])await removeQuery(query(collection(db,col),where(field,'==',uid)));
  await deleteDoc(ref('profiles',uid));await deleteUser(user);return {ok:true};
 }
 if(name==='accountBlock'){const r=ref('users',uid,'blocks',String(data.target));if(data.block===false)await deleteDoc(r);else await setDoc(r,{createdAt:serverTimestamp()});return {ok:true};}
 if(name==='accountNotice'){await setDoc(ref('users',uid,'notifications',String(data.id)),{read:true},{merge:true});return {ok:true};}
 if(name==='communityComment'){
  const body=String(data.body||'').trim();if(body.length<2||body.length>2000||/https?:\/\/|www\./i.test(body))throw Error('Use 2–2,000 characters and no links.');
  if(!user.emailVerified)throw Error('Verify your email before commenting.');
  const comment=data.id?ref('comments',data.id):doc(collection(db,'comments'));
  await runTransaction(db,async tx=>{const p=(await tx.get(ref('profiles',uid))).data(),old=(await tx.get(comment)).data(),rate=ref('users',uid,'settings','communityRate'),r=(await tx.get(rate)).data();if(!p?.nickname)throw Error('Choose a nickname in Account first.');if(r&&Date.now()-stamp(r.lastCommentAt)<20000)throw Error('Wait 20 seconds between comment submissions.');if(old&&(old.authorUid!==uid||Date.now()-stamp(old.createdAt)>900000))throw Error('You can edit your own comment for 15 minutes.');tx.set(rate,{lastCommentAt:serverTimestamp(),lastCommentId:comment.id});tx.set(comment,{postId:data.postId,body,authorUid:uid,nickname:p.nickname,handle:p.handle,avatarId:p.avatarId,avatarData:p.avatarData||'',status:'pending',parentId:old?.parentId||String(data.parentId||''),createdAt:old?.createdAt||serverTimestamp(),updatedAt:serverTimestamp()});});return {ok:true,id:comment.id};
 }
 if(name==='communityDelete'){await setDoc(ref('comments',data.id),{body:'',status:'deleted',avatarData:'',updatedAt:serverTimestamp()},{merge:true});return {ok:true};}
 if(name==='communityReport'){const reason=String(data.reason||'').trim().slice(0,500);if(reason.length<3)throw Error('Give a short reason.');await setDoc(ref('reports',data.id+'_'+uid),{commentId:data.id,reporterUid:uid,reason,status:'open',createdAt:serverTimestamp()});return {ok:true};}
 if(name==='communityModerate'){
  if(data.action==='list'){const [comments,reports]=await Promise.all([getDocs(query(collection(db,'comments'),where('status','==','pending'),limit(100))),getDocs(query(collection(db,'reports'),where('status','==','open'),limit(100)))]);return {comments:comments.docs.map(d=>({id:d.id,...d.data()})),reports:reports.docs.map(d=>({id:d.id,...d.data()}))};}
  if(data.action==='resolveReport'){await setDoc(ref('reports',data.id),{status:'resolved'},{merge:true});return {ok:true};}
  await setDoc(ref('comments',data.id),{status:data.status,moderatedAt:serverTimestamp(),moderationReason:String(data.reason||'').slice(0,300)},{merge:true});return {ok:true};
 }
 throw Error('This feature is not included in the free-plan edition.');
}
