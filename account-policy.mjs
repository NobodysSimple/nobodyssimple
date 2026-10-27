// Client validation is convenience only. Published Firestore rules enforce protected profile changes.
export const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000;
export const AVATARS = ['base','affirmed','bowing','dancing','drawing','excited-wave','excited','frolicking','peering','thinking','reading','running','sitting','still','sulking','waiting','waltzing','yippie'];
export const SAVED = {
  'ns-personal-maps-v1': ['maps','My Maps'],
  'ns-tool-favourites-v1': ['library','Favourite tools'],
  'ns-tool-recent-v1': ['library','Recent tools'],
  'ns-account-learning-v2': ['learning','Learning progress and bookmarks'],
  'ns-account-tool-drafts-v2': ['drafts','Unfinished activities'],
  'ns-account-mood-v2': ['mood','Optional mood history'],
  'ns-learn-quote-notes-v1': ['reflections','Quote reflections'],
  'ns-reflection': ['reflections','Reflection draft'],
  'ns-memory-jar-v1': ['reflections','Memory jar'],
  'nobodys-simple-full-profile-draft-v3': ['drafts','Personality questionnaire draft'],
  'nobodys-simple-profile-state-checkins-v1': ['mood','Personality state check-ins'],
  'nobodys-simple-profile-feedback-v1': ['reflections','Questionnaire feedback'],
  'ns-navigation-context-v1': ['reflections','Life navigation context'],
  'ns-navigation-projects-v1': ['maps','Life navigation projects'],
  'ns-sensory-recipe-v1': ['tools','Sensory recipe'],
  'ns-sensory-recipes-v3': ['tools','Sensory recipes'],
  'nobodys-simple-sensory-recipes-v1': ['tools','Stim Space recipes'],
  'ns-social-battery-v3': ['tools','Social battery'],
  'ns-load-balancer-v2': ['tools','Load balancer'],
  'ns-masking-contexts-v1': ['tools','Masking contexts'],
  'ns-masking-map-v2': ['tools','Masking map'],
  'ns-simplyfocus-recipe-v1': ['tools','SimplyFocus mixer'],
  'ns-simplyfocus-tasks-v1': ['tools','SimplyFocus tasks'],
};
export const CATEGORIES = {maps:'Maps and projects',library:'Favourites and recent tools',learning:'Learning progress',drafts:'Unfinished activities',reflections:'Personal reflections',mood:'Mood and check-in history',tools:'Saved tool settings'};
export const DEFAULTS = Object.freeze({theme:'light',language:'en',textScale:100,contrast:'standard',motion:'system',lowStim:false,sound:true,font:'system',lineSpacing:1.6,simpleMode:false,tapControls:false,visualMode:'balanced',saveDrafts:true,retentionDays:0,personalise:false,moodHistory:false,sensitiveLock:false,learningFormat:'any',trackLearning:false,replyNotifications:false,siteUpdates:false,reminders:false,reminderTime:'18:00',timeZone:'Europe/London',mentions:false,profileVisibility:'private'});
const OPTIONS = {theme:['system','light','dark'],language:['en','es','fr','de'],textScale:[100,110,125,150],contrast:['standard','high'],motion:['system','reduce','full'],font:['system','readable'],lineSpacing:[1.6,1.9,2.2],retentionDays:[0,30,90,365],learningFormat:['any','reading','audio','video','interactive'],profileVisibility:['private','public'],visualMode:['balanced','text','visual']};
export function cleanSettings(input={}) {
  const out={...DEFAULTS};
  for(const key of Object.keys(DEFAULTS)) {
    if(OPTIONS[key]) {if(OPTIONS[key].includes(input[key]))out[key]=input[key];}
    else if(typeof DEFAULTS[key]==='boolean') {if(typeof input[key]==='boolean')out[key]=input[key];}
    else if(key==='reminderTime' && /^([01]\d|2[0-3]):[0-5]\d$/.test(input[key]||''))out[key]=input[key];
    else if(key==='timeZone' && typeof input[key]==='string') {try {new Intl.DateTimeFormat('en',{timeZone:input[key]}).format();out[key]=input[key];} catch{}}
  }
  return out;
}
const reserved=['nobodyssimple','nobodysimple','nobodysimpl','nobodyssimpie','admin','administrator','moderator','staff','official','support','firebase','system'];
const forbidden=['fuck','fucker','fucking','shit','bitch','nigger','nigga','faggot','fag','retard','retarded','whore','hitler','nazi'];
export function nicknamePolicy(raw) {
  if(typeof raw!=='string')throw Error('Choose a nickname.');
  const nickname=raw.normalize('NFKC').trim().replace(/ +/g,' ');
  if(!/^[A-Za-z0-9][A-Za-z0-9 _-]{2,23}$/.test(nickname))throw Error('Use 3–24 letters, numbers, spaces, underscores or hyphens. Start with a letter or number.');
  const handle=nickname.toLowerCase().replace(/[ _-]/g,'');
  const folded=handle.replace(/[0134578]/g,c=>({'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','8':'b'})[c]).replace(/(.)\1{2,}/g,'$1$1');
  const variants=[handle,folded,folded.replace(/i/g,'l')];
  const tokens=nickname.toLowerCase().split(/[ _-]+/);
  const swear=['fuck','shit','bitch','nigger','nigga','faggot','retard','whore','hitler'];
  if(variants.some(v=>v.startsWith('cunt')) || variants.some(v=>swear.some(w=>v.includes(w))) || variants.some(v=>reserved.some(r=>v.includes(r))) || variants.some(v=>forbidden.includes(v)) || tokens.some(t=>forbidden.includes(t)) || ['nigger','faggot','hitler'].some(w=>folded.includes(w)))throw Error('That nickname is reserved or unsuitable. Choose another.');
  return {nickname,handle};
}
export function canRename(lastChange,now=Date.now()) {return !lastChange || now-lastChange>=COOLDOWN_MS;}
export function safeProfile(input={}) {
  const avatarId=AVATARS.includes(input.avatarId)?input.avatarId:'base';
  const avatarData='';
  const text=(v,n)=>String(v||'').normalize('NFKC').replace(/[\u0000-\u001f\u007f]/g,'').slice(0,n);
  const bio=text(input.bio,280),pronouns=text(input.pronouns,40);
  if(/https?:|www\.|<|>/i.test(bio+pronouns))throw Error('Keep links and markup out of your bio and pronouns.');
  return {avatarId,avatarData,bio,pronouns,visibility:input.visibility==='public'?'public':'private'};
}
export function parseJSON(value,fallback){try{return JSON.parse(value)??fallback;}catch{return fallback;}}
export function shouldConflict(baseRevision,remoteRevision){return (baseRevision||0)!==(remoteRevision||0);}
export function withinSize(value){return typeof value==='string'&&new TextEncoder().encode(value).length<=800000;}
