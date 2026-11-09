/* Nobody's Simple · original in-page games. No writing, scoring,
 * local/account storage, notifications, forced breathing or sound.
 */
import {escapeHTML as escape} from './core.mjs';
import {gamesForGuide,gamesForFilter,GAME_FILTERS,GAME_BY_ID} from './ns-regulation-games-data.mjs';
const e=x=>escape(String(x??''));
const palette=['#b6d6b5','#f7dab3','#bacde9','#f0c7ce','#c3b4e5','#d8e7bd','#e9c2aa','#bededa'];
const icons={calm:'✿',focus:'◇',ground:'◌',play:'✧',agency:'↗'};
const pace=[['slow','Unhurried',12],['gentle','Gentle',10],['steady','A little quicker',8]];
const safeIndex=(x,n)=>Math.max(0,Math.min(n-1,Number(x)||0));
const asLabel=game=>game.effort==='low'?'Low demand':'Some attention';
const gameCard=(game,selected)=>'<article class="ns-game-card ns-game-tone-'+e(game.tone)+(selected===game.id?' is-active':'')+'" data-game-card="'+e(game.id)+'">'+
 '<div class="ns-game-card-icon" aria-hidden="true">'+e(icons[game.type]||'✧')+'</div>'+
 '<span class="ns-game-card-category">'+e(game.type==='agency'?'Choices':game.type==='calm'?'Settle':game.type==='ground'?'Ground':game.type==='focus'?'Focus':'Play')+'</span>'+
 '<h3>'+e(game.title)+'</h3><p>'+e(game.description)+'</p>'+
 '<div class="ns-game-card-bottom"><small>'+e(game.duration)+' · '+e(asLabel(game))+'</small>'+
 '<button type="button" data-game-open="'+e(game.id)+'">'+(selected===game.id?'Open again':'Play without writing')+' <span aria-hidden="true">→</span></button></div></article>';
const gameTitle=game=>'<div class="ns-game-active-heading"><div><p class="ns-game-kicker">NO WORDS NEEDED · CHOSEN GAME</p>'+
 '<h3 id="ns-game-active-title" tabindex="-1">'+e(game.title)+'</h3>'+
 '<p>'+e(game.help)+'</p></div><button type="button" data-game-close aria-label="Close the game">✕ Close</button></div>';
const action=(key,choice,label,extra='')=>'<button type="button" data-game-action="'+e(key)+'"'+(choice!==null?' data-game-choice="'+e(choice)+'"':'')+extra+'>'+e(label)+'</button>';
const reset=()=>action('reset',null,'Start again');
const message=s=>'<p class="ns-game-status" role="status">'+e(s)+'</p>';
function initialState(game){return {id:game.id,step:0,chosen:[],picked:null,tiles:Array(12).fill(-1),
 bool:{light:false,still:false,muted:false},taps:0,playing:false,pace:'gentle',x:0,y:0,
 matched:[],flipped:[],pending:false,selected:[],found:false};}
function breathing(st){
 const speed=pace.find(p=>p[0]===st.pace)||pace[1];
 return '<div class="ns-game-breath '+(st.playing?'is-playing':'')+'" style="--ns-breath-time:'+speed[2]+'s">'+
 '<div class="ns-game-breath-sky" aria-hidden="true"><span class="ns-game-breath-flower">✿</span><span class="ns-game-breath-halo"></span></div>'+
 '<p>Watch the flower gently open and soften. Breathe naturally at your own pace; you do not need to follow it.</p>'+
 '<div class="ns-game-controls">'+action('toggle',null,st.playing?'Pause the flower':'Start the flower')+
 pace.map(p=>action('pace',p[0],p[1],st.pace===p[0]?' aria-pressed="true"':' aria-pressed="false"')).join('')+'</div>'+
 message(st.playing?'The flower is moving. Pause or stop whenever you prefer.':'Paused. There is nothing to get right.')+'</div>';
}
function mosaic(st){
 return '<div class="ns-game-mosaic" role="group" aria-label="Tap tiles to change their colours">'+
 st.tiles.map((n,i)=>'<button type="button" data-game-action="paint" data-game-choice="'+i+'" '+
 'aria-label="Change tile '+(i+1)+'" style="background:'+palette[n<0?i%palette.length:n%palette.length]+'">'+
 '<span aria-hidden="true">'+(n<0?'✧':'✿')+'</span></button>').join('')+'</div>'+
 '<p class="ns-game-quiet">Make a pattern you like, or just tap a couple of tiles. No correct result.</p>'+
 '<div class="ns-game-controls">'+reset()+'</div>';
}
const anchors=[
 ['🍃','Leaf','Notice its outline or imagine its colour.'],
 ['☁️','Cloud','Notice the shape without needing to change it.'],
 ['🪨','Stone','Notice a solid object and the space around it.'],
 ['🌱','Sprout','Notice one small detail of its shape.'],
 ['🌙','Moon','Notice its location in the picture.'],
 ['🌳','Tree','Notice its outline against the background.']
];
function grounding(st){
 return '<div class="ns-game-anchor-items" role="group" aria-label="Choose an ordinary object to notice">'+
 anchors.map(([emoji,label],i)=>action('anchor',i,emoji+' '+label,
 st.picked===i?' aria-pressed="true"':' aria-pressed="false"')).join('')+'</div>'+
 '<div class="ns-game-anchor-outcome" aria-live="polite">'+
 (st.picked===null?'You can choose any object. You do not need to identify your feelings or scan your body.':
 anchors[st.picked][2]+' Nothing else is required.')+'</div>'+
 '<div class="ns-game-controls">'+reset()+'</div>';
}
function room(st){
 const attrs='class="ns-game-room-scene '+(st.bool.light?'dim ':'')+(st.bool.still?'still ':'')+(st.bool.muted?'muted ':'')+'"';
 return '<div '+attrs+' aria-label="Illustrated room with a window, plant, rug and glowing lamp" role="img">'+
 '<span class="ns-game-room-window" aria-hidden="true"><span>☁</span></span>'+
 '<span class="ns-game-room-lamp" aria-hidden="true">☀</span>'+
 '<span class="ns-game-room-plant" aria-hidden="true">♣</span>'+
 '<span class="ns-game-room-rug" aria-hidden="true"></span></div>'+
 '<div class="ns-game-room-controls" role="group" aria-label="Change the illustrated room">'+
 [['light','Soften light'],['still','Keep scene still'],['muted','Reduce colour']].map(([id,label])=>
 action('room',id,label,st.bool[id]?' aria-pressed="true"':' aria-pressed="false"')).join('')+'</div>'+
 message('Change what feels comfortable in the picture. You can also change the actual light, noise or demands around you if possible.')+
 '<div class="ns-game-controls">'+reset()+'</div>';
}
const stones=['●','⬟','●','⬟','●','⬟','●','⬟'];
function pebbles(st){
 return '<div class="ns-game-pebble-scene" aria-label="Pebbles you have added" role="img">'+
 st.chosen.map((x,i)=>'<span class="ns-game-pebble" style="--pebble-index:'+i+';background:'+palette[x%palette.length]+'">'+stones[x%stones.length]+'</span>').join('')+
 (!st.chosen.length?'<span class="ns-game-pebble-empty">An empty, peaceful space</span>':'')+'</div>'+
 '<p class="ns-game-quiet">Choose a pebble to place it. You may leave the garden unfinished.</p>'+
 '<div class="ns-game-pebble-palette" role="group" aria-label="Choose a pebble colour">'+
 palette.slice(0,6).map((color,i)=>'<button type="button" data-game-action="pebble" data-game-choice="'+i+
 '" style="background:'+color+'" aria-label="Place '+['sage','peach','sky','rose','lilac','lime'][i]+' pebble" '+(st.chosen.length>=9?'disabled':'')+'>●</button>').join('')+'</div>'+
 '<div class="ns-game-controls">'+action('undo',null,'Remove last pebble')+reset()+'</div>';
}
function clouds(st){
 const clouds=['A passing cloud','A lighter cloud','A quiet cloud','A slow cloud','A little cloud'];
 return '<div class="ns-game-cloud-scene" role="group" aria-label="Choose any cloud to watch or let drift">'+
 clouds.map((x,i)=>'<button type="button" data-game-action="cloud" data-game-choice="'+i+
 '" class="ns-game-cloud '+(st.selected.includes(i)?'is-drifted':'')+'" aria-label="'+e(x)+
 ': '+(st.selected.includes(i)?'bring back':'let drift')+'" aria-pressed="'+st.selected.includes(i)+'">'+
 '<span aria-hidden="true">☁</span></button>').join('')+'</div>'+
 '<p class="ns-game-quiet">You can let a cloud drift or bring it back. Thoughts and feelings are not required to disappear.</p>'+
 '<div class="ns-game-controls">'+reset()+'</div>';
}
function stars(st){
 return '<div class="ns-game-stars" role="group" aria-label="Choose stars to light up">'+
 Array.from({length:15},(_,i)=>'<button type="button" data-game-action="star" data-game-choice="'+i+
 '" class="'+(st.selected.includes(i)?'lit':'')+'" aria-label="'+(st.selected.includes(i)?'Dim':'Light')+' star '+(i+1)+
 '" aria-pressed="'+st.selected.includes(i)+'" ><span aria-hidden="true">'+(st.selected.includes(i)?'✦':'✧')+'</span></button>').join('')+'</div>'+
 '<p class="ns-game-quiet">There is no pattern you have to finish.</p>'+
 '<div class="ns-game-controls">'+reset()+'</div>';
}
function tap(st){
 return '<div class="ns-game-tap-space"><button type="button" class="ns-game-tap-target" data-game-action="tap" aria-label="Tap this circle at your own pace">'+
 '<span aria-hidden="true">'+(st.taps%2?'✿':'●')+'</span><strong>Tap gently</strong></button></div>'+
 '<p class="ns-game-quiet">Tap whenever it feels comfortable. The rhythm is yours, not something to match.</p>'+
 '<div class="ns-game-controls">'+reset()+'</div>';
}
function trail(st){
 const size=5;
 return '<div class="ns-game-trail-board" role="img" aria-label="Five by five garden grid. Your marker is at row '+(st.y+1)+', column '+(st.x+1)+'">'+
 Array.from({length:size*size},(_,i)=>{
  const x=i%size,y=Math.floor(i/size);
  return '<span class="ns-game-trail-cell '+(x===st.x&&y===st.y?'is-here':'')+'" aria-hidden="true">'+(x===st.x&&y===st.y?'✿':(x+y)%3===0?'·':'')+'</span>';
 }).join('')+'</div>'+
 '<p class="ns-game-quiet">Move the flower wherever you like. There is no destination to reach.</p>'+
 '<div class="ns-game-trail-controls" role="group" aria-label="Move your flower one square">'+
 action('move','up','↑ Up',st.y===0?' disabled':'')+
 action('move','left','← Left',st.x===0?' disabled':'')+
 action('move','down','↓ Down',st.y===4?' disabled':'')+
 action('move','right','Right →',st.x===4?' disabled':'')+'</div>'+
 '<div class="ns-game-controls">'+reset()+'</div>';
}
const pairSymbols=['🌿','🌼','🍄','🍁','🌸','🌾','🌸','🍁','🌿','🍄','🌼','🌾'];
function pairs(st){
 const solved=st.matched.length===12;
 return '<div class="ns-game-pair-board" role="group" aria-label="Garden matching tiles">'+
 pairSymbols.map((emoji,i)=>'<button type="button" data-game-action="pair" data-game-choice="'+i+
 '" aria-label="'+(st.matched.includes(i)||st.flipped.includes(i)?'Revealed '+emoji:'Covered garden tile '+(i+1))+
 '" aria-pressed="'+(st.matched.includes(i)||st.flipped.includes(i))+'" '+(st.matched.includes(i)?'disabled':'')+'>'+
 (st.matched.includes(i)||st.flipped.includes(i)?emoji:'✿')+'</button>').join('')+'</div>'+
 message(solved?'All the garden pairs are visible. You can finish here or restart.':
 st.pending?'Those two tiles are different. Choose another to carry on.':
 'Turn over any two tiles. There is no timer or penalty.')+
 '<div class="ns-game-controls">'+reset()+'</div>';
}
const findShapes=['○','△','◇','✿','□','○','☆','△','□','◇','🍃','☆','○','✿','□','△'];
function finder(st){
 return '<p class="ns-game-quiet">Can you find the leaf? No timer and no need to hurry.</p>'+
 '<div class="ns-game-finder" role="group" aria-label="Shapes with a single leaf">'+
 findShapes.map((sym,i)=>'<button type="button" data-game-action="find" data-game-choice="'+i+
 '" aria-label="'+(sym==='🍃'?'Leaf':'Other shape '+(i+1))+'" class="'+(st.picked===i?'is-picked':'')+'">'+sym+'</button>').join('')+'</div>'+
 message(st.picked===null?'Choose whichever tile you would like to explore.':
 st.found?'You noticed the leaf. You can stop or play again.':'That is another shape. It is fine to stop or keep looking.')+
 '<div class="ns-game-controls">'+reset()+'</div>';
}
const pathChoices=[
 ['Pause','Allow a small pause if safe'],
 ['Soften','Reduce one demand if possible'],
 ['Ask','Consider support from someone appropriate'],
 ['Move','Choose one optional next step']
];
function path(st){
 return '<div class="ns-game-path-scene" aria-label="Your chosen path">'+
 Array.from({length:3},(_,i)=>'<div class="ns-game-path-stone '+(st.chosen[i]!==undefined?'filled':'')+'">'+
 '<span>Step '+(i+1)+'</span><strong>'+e(st.chosen[i]===undefined?'◇':pathChoices[st.chosen[i]][0])+'</strong></div>').join('')+'</div>'+
 (st.chosen.length<3?'<p class="ns-game-quiet">Which kind of response would feel most reasonable for step '+(st.chosen.length+1)+'?</p>'+
 '<div class="ns-game-path-options" role="group" aria-label="Choose an optional response">'+
 pathChoices.map(([name,description],i)=>'<button type="button" data-game-action="path" data-game-choice="'+i+'">'+
 '<strong>'+e(name)+'</strong><span>'+e(description)+'</span></button>').join('')+'</div>':
 message('You built a possible path. It is just an idea: you can change it, ask for help, or choose not to follow it.'))+
 '<div class="ns-game-controls">'+action('undo',null,'Change last choice')+reset()+'</div>';
}
function scene(game,st){
 const byId={'breath-garden':breathing,'colour-mosaic':mosaic,'quiet-room':room,
 'anchor-scene':grounding,'pebble-garden':pebbles,'cloud-watching':clouds,
 'star-garden':stars,'steady-taps':tap,'finger-trail':trail,
 'pair-garden':pairs,'focus-finder':finder,'choice-path':path};
 return (byId[game.id]||grounding)(st);
}
const gameControls=(game,st)=>'<section class="ns-game-play" aria-labelledby="ns-game-active-title" data-game-active="'+e(game.id)+'">'+
 gameTitle(game)+'<div class="ns-game-play-content">'+scene(game,st)+'</div>'+
 (game.caution?'<details class="ns-game-caution"><summary>When might I skip this?</summary><p>'+e(game.caution)+'</p></details>':'')+
 '<p class="ns-game-small">Choose what feels useful. This is an optional brief activity, not an emotion test or validated treatment.</p></section>';
const carousel=games=>'<section class="ns-game-carousel" id="ns-games" aria-label="No-writing games">'+
 '<div class="ns-pick-headline"><span class="ns-pick-step">04</span><div>'+
 '<p class="ns-pick-kicker">NO WRITING REQUIRED</p><h2>Games to try instead</h2>'+
 '<p>Prefer doing to writing? Try a little visual activity for settling, grounding, attention or choice. You can stop at any moment.</p></div></div>'+
 '<div class="ns-game-filters" role="group" aria-label="Filter games">'+
 GAME_FILTERS.map((x,i)=>'<button type="button" data-game-filter="'+e(x.id)+'" aria-pressed="'+(i===0)+'">'+e(x.label)+'</button>').join('')+'</div>'+
 '<div class="ns-game-carousel-head"><p data-game-count aria-live="polite">'+games.length+' games · Swipe or use the arrows</p>'+
 '<div class="ns-game-carousel-arrows">'+
 '<button type="button" data-game-direction="-1" aria-label="Previous games">←</button>'+
 '<button type="button" data-game-direction="1" aria-label="Next games">→</button></div></div>'+
 '<div class="ns-game-track" data-game-track tabindex="0" aria-label="Scrollable game cards"></div>'+
 '<div data-game-selection></div>'+
 '<p class="ns-game-footer">Nothing is timed, scored or automatically saved. Games are optional momentary supports, not substitutes for medical care, practical changes or addressing the issue itself.</p></section>';
function updateGame(st,actionName,choice){
 const n=safeIndex(choice,16);
 switch(actionName){
  case 'reset':return initialState(GAME_BY_ID[st.id]);
  case 'toggle':return {...st,playing:!st.playing};
  case 'pace':return {...st,pace:pace.some(x=>x[0]===choice)?choice:st.pace};
  case 'paint':return {...st,tiles:st.tiles.map((x,i)=>i===n?((x<0?i:x)+1)%palette.length:x)};
  case 'anchor':return {...st,picked:n};
  case 'room':return {...st,bool:{...st.bool,[choice]:!st.bool[choice]}};
  case 'pebble':return {...st,chosen:st.chosen.length>=9?st.chosen:[...st.chosen,n]};
  case 'undo':return {...st,chosen:st.chosen.slice(0,-1)};
  case 'cloud':case 'star':return {...st,selected:st.selected.includes(n)?st.selected.filter(x=>x!==n):[...st.selected,n]};
  case 'tap':return {...st,taps:st.taps+1};
  case 'move':{
   const x=st.x+(choice==='left'?-1:choice==='right'?1:0);
   const y=st.y+(choice==='up'?-1:choice==='down'?1:0);
   return {...st,x:Math.max(0,Math.min(4,x)),y:Math.max(0,Math.min(4,y))};
  }
  case 'pair':{
   if(st.matched.includes(n)||(!st.pending&&st.flipped.includes(n)))return st;
   const prior=st.pending?[]:st.flipped;
   const flipped=[...prior,n];
   if(flipped.length!==2)return {...st,flipped,pending:false};
   if(pairSymbols[flipped[0]]===pairSymbols[flipped[1]])
    return {...st,matched:[...st.matched,...flipped],flipped:[],pending:false};
   return {...st,flipped,pending:true};
  }
  case 'find':return {...st,picked:n,found:findShapes[n]==='🍃'};
  case 'path':return {...st,chosen:st.chosen.length>=3?st.chosen:[...st.chosen,n%pathChoices.length]};
  default:return st;
 }
}
export function renderGameCarousel(host,guide){
 if(!host||!guide||guide.safetyFirst)return;
 const games=gamesForGuide(guide);
 host.innerHTML=carousel(games);
 const track=host.querySelector('[data-game-track]'),selection=host.querySelector('[data-game-selection]');
 let filter='all',active=null,gameState=null;
 const repaint=()=>{
  const subset=gamesForFilter(games,filter);
  track.innerHTML=subset.map(g=>gameCard(g,active?.id)).join('');
  host.querySelector('[data-game-count]').textContent=subset.length+' games · Swipe or use the arrows';
  host.querySelectorAll('[data-game-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.gameFilter===filter)));
 };
 const open=game=>{
  active=game;gameState=initialState(game);
  selection.innerHTML=gameControls(game,gameState);
  repaint();
  selection.querySelector('h3')?.focus({preventScroll:true});
  selection.scrollIntoView({block:'nearest',behavior:'instant'});
 };
 host.addEventListener('click',ev=>{
  const el=ev.target.closest('button');if(!el)return;
  if(el.hasAttribute('data-game-filter')){filter=el.dataset.gameFilter;repaint();track.scrollLeft=0;return;}
  if(el.hasAttribute('data-game-direction')){
   const first=track.querySelector('.ns-game-card');if(!first)return;
   track.scrollBy({left:Number(el.dataset.gameDirection)*(first.getBoundingClientRect().width+14),behavior:'smooth'});
   return;
  }
  if(el.dataset.gameOpen){const game=games.find(g=>g.id===el.dataset.gameOpen);if(game)open(game);return;}
  if(el.hasAttribute('data-game-close')){active=null;gameState=null;selection.replaceChildren();repaint();host.querySelector('h2')?.focus({preventScroll:true});return;}
  if(el.hasAttribute('data-game-action')&&active){
   const previous=gameState,actionName=el.dataset.gameAction;
   let next=updateGame(gameState,actionName,el.dataset.gameChoice);
   if(actionName==='undo'&&active.id==='choice-path')next={...previous,chosen:previous.chosen.slice(0,-1)};
   gameState=next;
   const oldFocus=el.getAttribute('data-game-choice'),oldAction=el.dataset.gameAction;
   selection.innerHTML=gameControls(active,gameState);
   // Restore keyboard focus to the relevant active button after replacing its scene.
   const candidate=[...selection.querySelectorAll('[data-game-action]')].find(b=>
    b.dataset.gameAction===oldAction&&(oldFocus===null||b.dataset.gameChoice===oldFocus));
   candidate?.focus({preventScroll:true});
  }
 });
 repaint();
}
