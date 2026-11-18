/**
 * Browser-only Course Lab draft persistence. Large courses belong in IndexedDB,
 * not one localStorage JSON record. Legacy local drafts are read and migrated.
 */
const DB='nobodyssimple-course-lab';
const STORE='drafts';
let opened=null;
function db(){
 if(opened)return opened;
 if(typeof indexedDB==='undefined')return Promise.resolve(null);
 opened=new Promise(resolve=>{
  try{
   const r=indexedDB.open(DB,1);
   r.onupgradeneeded=()=>{if(!r.result.objectStoreNames.contains(STORE))r.result.createObjectStore(STORE,{keyPath:'id'});};
   r.onsuccess=()=>resolve(r.result);
   r.onerror=()=>resolve(null);
   r.onblocked=()=>resolve(null);
  }catch{resolve(null);}
 });
 return opened;
}
const legacyKey=id=>'ns-course-lab-draft-v1:'+id;
async function transaction(id,mode,action){
 const database=await db();if(!database)return null;
 return new Promise((resolve,reject)=>{
  const tx=database.transaction(STORE,mode),store=tx.objectStore(STORE);
  let request;
  try{request=action(store);}catch(e){reject(e);return;}
  if(request){request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);}
  else {tx.oncomplete=()=>resolve(true);tx.onerror=()=>reject(tx.error);}
 });
}
export async function readCourseLabDraft(id){
 try{
  const saved=await transaction(id,'readonly',store=>store.get(id));
  if(saved?.value)return saved.value;
 }catch{/* Read old browser draft below. */}
 try{const legacy=JSON.parse(localStorage.getItem(legacyKey(id))||'null');return legacy?.draft?.id===id?legacy:null;}catch{return null;}
}
export async function saveCourseLabDraft(id,value){
 if(!value?.draft||value.draft.id!==id)throw Error('Draft ID does not match the selected course.');
 try{
  const database=await db();if(database){
   await transaction(id,'readwrite',store=>store.put({id,value}));
   try{localStorage.removeItem(legacyKey(id));}catch{}
   return {storage:'IndexedDB'};
  }
 }catch(err){/* A localStorage fallback still provides a chance to save. */}
 try{localStorage.setItem(legacyKey(id),JSON.stringify(value));return {storage:'localStorage'};}
 catch{throw Error('Draft storage is full. Export your course JSON before leaving.');}
}
export async function deleteCourseLabDraft(id){
 try{await transaction(id,'readwrite',store=>store.delete(id));}catch{}
 try{localStorage.removeItem(legacyKey(id));}catch{}
}
