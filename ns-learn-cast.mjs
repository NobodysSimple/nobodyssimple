/** Shared, deterministic illustrative portraits for fictional Learn scenes.
 * Uses Nobody's Simple's existing 4x5 Life Lab companion atlas; no generated
 * likeness or external images. Every appearance of one name uses one sprite.
 */
const ATLAS_COLUMNS=4,ATLAS_ROWS=5,COUNT=ATLAS_COLUMNS*ATLAS_ROWS;
const fingerprint=text=>{
 let hash=2166136261;
 for(const letter of String(text||'').toLocaleLowerCase('en')){hash^=letter.codePointAt(0);hash=Math.imul(hash,16777619);}
 return hash>>>0;
};
const norm=s=>String(s||'').trim().toLocaleLowerCase('en');
export function portraitIndex(name,cast=[]){
 const names=cast.map(x=>typeof x==='string'?x:x?.name).filter(Boolean);
 const own=names.findIndex(n=>norm(n)===norm(name));
 const base=fingerprint(name)%COUNT;
 if(own<0)return base;
 // Allocate a distinct atlas tile to the members of this scene if possible.
 const used=new Set();
 for(let i=0;i<=own;i++){
  const n=names[i];let position=fingerprint(n)%COUNT;
  while(used.has(position))position=(position+1)%COUNT;
  if(i===own)return position;
  used.add(position);
 }
 return base;
}
export function portraitCoords(name,cast=[]){
 const n=portraitIndex(name,cast);
 return {x:(n%ATLAS_COLUMNS)*100/(ATLAS_COLUMNS-1),y:Math.floor(n/ATLAS_COLUMNS)*100/(ATLAS_ROWS-1)};
}
export function characterPortrait(name,cast=[],esc=x=>String(x),small=false){
 const {x,y}=portraitCoords(name,cast);
 return '<span class="ns-learn-character__portrait'+(small?' ns-learn-character__portrait--small':'')+'" role="img" aria-label="Illustrated portrait of '+esc(name)+'" style="--face-x:'+x+'%;--face-y:'+y+'%"></span>';
}
export function knownCastForLesson(bundle,lesson){
 const unit=(bundle?.modules||[]).find(m=>(m.lessons||[]).some(l=>l.id===lesson?.id));
 const names=[];
 const add=name=>{
  const n=String(name||'').trim();
  if(!n||/^(a different setting|someone|you|person [ab])$/i.test(n)||names.some(x=>norm(x)===norm(n)))return;
  names.push(n);
 };
 for(const person of unit?.cast||[])add(typeof person==='string'?person:person?.name);
 for(const node of (unit?.lessons||[]).flatMap(l=>l.nodes||[])){
  if(node.type==='dialogue'){add(node.speakerA);add(node.speakerB);}
 }
 return names;
}
export function charactersMentioned(node,cast){
 if(!node||!Array.isArray(cast)||!cast.length)return [];
 const fields=[node.title,node.prompt,node.body,node.scenario,node.newEvidence,node.viewA,node.viewB,node.characterName,node.changePrompt];
 const text=fields.filter(Boolean).join(' ');
 return cast.filter(name=>{
  const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return new RegExp('(^|[^\\p{L}])'+escaped+'(?=$|[^\\p{L}])','iu').test(text);
 });
}
