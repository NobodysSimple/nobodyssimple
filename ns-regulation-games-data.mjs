/* Nobody’s Simple: original no-writing regulation and attention games.
 * These are optional visual interactions, NOT clinical treatments or outcome
 * measures. No score, forced exposure, breath retention or monitoring.
 */
import {atlasGet} from './ns-atlas-core.mjs';
const item=(id,title,description,type,tone,duration,effort,help,caution='')=>
 Object.freeze({id,title,description,type,tone,duration,effort,help,caution});
export const REGULATION_GAMES=Object.freeze([
 item('breath-garden','The breathing garden','Watch a flower open and close at a comfortable pace; you do not have to match it.','calm','sage','1–2 min','low',
 'A gentle optional visual rhythm. Let breathing happen naturally; no holds or deep breaths.',
 'Avoid if breath-focused exercises feel uncomfortable, cause dizziness, or intensify symptoms.'),
 item('colour-mosaic','Colour mosaic','Tap small tiles to create a patchwork of colours without a goal or a score.','play','rose','1–5 min','low',
 'Gentle colour play can offer an optional focus away from repetitive analysis.',
 'Avoid visual stimulation when it increases sensory discomfort.'),
 item('quiet-room','Make a quieter room','Move the scene towards the kind of light, motion and colour you prefer.','agency','blue','1–3 min','low',
 'Try a small sense of choice about surroundings; real access adjustments remain important.',
 'This is a digital scene, not a substitute for changing an inaccessible environment.'),
 item('anchor-scene','Find an anchor','Explore a calm scene and choose one ordinary object to notice.','ground','mint','1–2 min','low',
 'An external object can provide an optional point of orientation without body scanning.',
 'You can stop or look away if focusing on sensory details is uncomfortable.'),
 item('pebble-garden','Build a pebble garden','Place smooth-looking pebbles into your own quiet arrangement.','calm','sand','1–4 min','low',
 'An undemanding sequence with no time limit can provide a pause.',
 'The goal is engagement, not making distress disappear.'),
 item('cloud-watching','Cloud watching','Tap a cloud to let it drift gently away; or leave it exactly as it is.','calm','lilac','1–3 min','low',
 'A voluntary visual metaphor for letting experiences change without having to solve them.',
 'A metaphor is not proof that unwanted thoughts can be dismissed at will.'),
 item('star-garden','Light a constellation','Tap stars to make your own still night sky.','play','slate','1–4 min','low',
 'Simple chosen interactions can provide a low-demand visual focus.',
 'Skip if small lights or repeated tapping become overstimulating.'),
 item('steady-taps','Steady taps','Tap a big soft circle at any rhythm you choose—there is no tempo to get right.','ground','peach','1–2 min','low',
 'A voluntary tactile rhythm may offer another thing to attend to.',
 'Stop if repetitive movement is painful or uncomfortable.'),
 item('finger-trail','Follow a little path','Move a marker through a quiet landscape, one step at a time.','focus','gold','2–4 min','medium',
 'A tiny external navigation task can redirect attention without timing, judging or making promises.',
 'It may not be useful when concentration is difficult or overstimulation is present.'),
 item('pair-garden','Pair the leaves','Turn over garden tiles and find pairs at your own pace.','focus','mint','2–5 min','medium',
 'A gentle concentration activity can be an alternative to written processing.',
 'Skip if matching or repetition triggers compulsive checking or frustration.'),
 item('focus-finder','Find the small leaf','Look through a small group of shapes to find one leaf, with no timer.','focus','blue','1–3 min','medium',
 'A low-stakes search can give attention one concrete external target.',
 'Not suitable if visual searching or perfectionism increases distress.'),
 item('choice-path','Choose a gentle path','Build a three-step path with taps: pause, change the conditions, seek support or take a step.','agency','sage','2–4 min','low',
 'Explore realistic next moves without writing or being told to push through a problem.',
 'A digital choice does not remove real structural barriers or replace support.')
]);
export const GAME_BY_ID=Object.freeze(Object.fromEntries(REGULATION_GAMES.map(x=>[x.id,x])));
export const GAME_FILTERS=Object.freeze([
 {id:'all',label:'All games'},
 {id:'calm',label:'Settle'},
 {id:'ground',label:'Ground'},
 {id:'focus',label:'Focus'},
 {id:'play',label:'Play'},
 {id:'agency',label:'Take control'}
]);
const preference={
 anxious:['anchor-scene','breath-garden','cloud-watching','quiet-room','pebble-garden','colour-mosaic','steady-taps','star-garden','choice-path'],
 sensory:['quiet-room','anchor-scene','pebble-garden','cloud-watching','choice-path','colour-mosaic','finger-trail'],
 tired:['quiet-room','pebble-garden','anchor-scene','cloud-watching','colour-mosaic','choice-path','star-garden'],
 action:['choice-path','finger-trail','focus-finder','colour-mosaic','anchor-scene','pebble-garden','star-garden','pair-garden'],
 thought:['anchor-scene','quiet-room','cloud-watching','colour-mosaic','pebble-garden','choice-path','star-garden','finger-trail'],
 relation:['quiet-room','anchor-scene','cloud-watching','colour-mosaic','pebble-garden','choice-path','steady-taps','star-garden'],
 sleep:['quiet-room','cloud-watching','pebble-garden','breath-garden','anchor-scene','colour-mosaic','choice-path'],
 grief:['pebble-garden','cloud-watching','quiet-room','anchor-scene','colour-mosaic','star-garden','choice-path'],
 general:['anchor-scene','quiet-room','pebble-garden','colour-mosaic','cloud-watching','choice-path','star-garden','finger-trail','steady-taps','breath-garden','pair-garden','focus-finder']
};
export function gameFamilyForGuide(guide){
 if(!guide)return 'general';
 const t=(guide.id+' '+guide.title+' '+guide.lead).toLowerCase();
 const domain=guide.kind==='topic'?atlasGet(guide.optionId)?.domain:'';
 if(/sensory|overstimulat|noise|light sensitiv|dissociat/.test(t))return 'sensory';
 if(/grief|bereav|loss|mourning/.test(t))return 'grief';
 if(/insomnia|sleep|nightmare|bedtime/.test(t))return 'sleep';
 if(/exhaust|deplet|fatigue|burnout|drained|energy loss/.test(t))return 'tired';
 if(/panic|anxie|anxious|worr|fear|overwhelm/.test(t))return 'anxious';
 if(/procrastinat|starting|task|decision|motivat|focus|adhd|productiv/.test(t)||['act','focus','work'].includes(domain)||guide.modeId==='act')return 'action';
 if(/ruminat|checking|ritual|obsess|overthink|thought/.test(t)||domain==='think')return 'thought';
 if(/relationship|boundary|argument|resent|jealous|partner|trust/.test(t)||guide.modeId==='relate'||domain==='relate')return 'relation';
 return 'general';
}
// Each topic gets a stable, small selection of genuinely different mechanics.
// This is not a recommendation that a visual game treats the named difficulty.
const topicSeed=id=>[...String(id||'')].reduce((n,ch)=>((n*37+ch.charCodeAt(0))>>>0),11);
export function topicLensGame(guide){
 if(!guide||guide.kind!=='topic'||guide.safetyFirst)return null;
 const plain=value=>String(value||'').trim();
 const take=(value,fallback)=>plain(value)||fallback;
 const title=take(guide.title,'this topic');
 const items=[
  {label:'What it can look like',text:take(guide.recognise?.[0],guide.what)},
  {label:'What might shape it',text:take(guide.contributors?.[0],guide.contextFirst?
   'Circumstances, rights, access and support may matter here.':'Several processes may be involved; no single cause is assumed.')},
  {label:'What could matter next',text:take(Array.isArray(guide.goals)?guide.goals[0]:guide.progress,
   'Choose what fits your circumstances, or decide that no action is needed.')}
 ];
 return Object.freeze({
  id:'topic-lens',title:'Explore this topic',description:'Tap three cards to look at '+title+' from different angles.',
  type:'agency',tone:'blue',duration:'2–3 min',effort:'low',help:'Explore possible descriptions, context and next steps without scoring or self-diagnosis.',
  caution:'These prompts are general editorial reflections, not evidence of a particular cause, personal diagnosis or treatment.',
  items:Object.freeze(items.map(x=>Object.freeze(x)))
 });
}
export function gamesForGuide(guide){
 if(!guide||guide.safetyFirst)return [];
 const family=gameFamilyForGuide(guide),id=(guide.id+' '+guide.title).toLowerCase();
 const medical=Boolean(guide.medical);
 const breathRisk=medical||/panic|asthma|breath|hyperventilat|respirat|chest|heart|cardiac|dissociat/.test(id);
 const compulsion=/checking|ritual|compuls|obsess|ocd/.test(id);
 const lightRisk=family==='sensory'||/migraine|seizure|photosensitiv/.test(id);
 const tired=family==='tired';
 const exclude=new Set([
  ...(breathRisk?['breath-garden']:[]),
  ...(compulsion?['pair-garden','focus-finder','steady-taps']:[]),
  ...(lightRisk?['star-garden','steady-taps','focus-finder','pair-garden']:[]),
  ...(tired?['pair-garden','focus-finder']:[])
 ]);
 const preferred=[...new Set([...(preference[family]||preference.general),...preference.general])]
  .filter(x=>!exclude.has(x)).map(x=>GAME_BY_ID[x]).filter(Boolean);
 // One first-match game, one agency activity, one calm/ground option, plus
 // rotating activities across play, focus and optional engagement types.
 const chosen=[];
 const add=game=>{if(game&&!chosen.some(x=>x.id===game.id))chosen.push(game);};
 add(preferred[0]);
 add(preferred[1]);
 add(GAME_BY_ID['choice-path']);
 add(preferred.find(x=>x.type==='ground'||x.type==='calm'));
 if(family==='action'&&!exclude.has('colour-mosaic'))add(GAME_BY_ID['colour-mosaic']);
 const pool=preferred.filter(g=>!chosen.some(x=>x.id===g.id));
 const offset=pool.length?topicSeed(guide.optionId||guide.id)%pool.length:0;
 const rotated=[...pool.slice(offset),...pool.slice(0,offset)];
 for(const game of rotated){if(chosen.length>=5)break;add(game);}
 // Keep a reasonable low-demand alternative even for focus/action topics.
 if(chosen.filter(g=>g.effort==='low').length<3){
  const low=preferred.find(g=>g.effort==='low'&&!chosen.some(c=>c.id===g.id));
  if(low){chosen[chosen.length-1]=low;}
 }
 if(guide.kind==='topic'){
  const lens=topicLensGame(guide);
  if(lens)add(lens);
 }
 return chosen;
}
export const gamesForFilter=(deck,filter)=>filter==='all'?deck:deck.filter(x=>x.type===filter);
