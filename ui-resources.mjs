// Original reference sheets are displayed through SVG viewports. Source pixels
// remain unchanged; labels and example copy stay outside the chosen viewport.
const sheets={1:[1448,1086],2:[1536,1024],3:[1536,1024],4:[1672,941],5:[1448,1086],6:[1448,1086],7:[1448,1086],8:[1536,1024]};
export const resourceAtlas={};
const add=(name,sheet,x,y,w,h)=>resourceAtlas[name]={sheet,x,y,w,h};
// Close-up characters, expressive faces and everyday props (sheet 1).
['neutral','walking','sitting','lying','pointing','reading','thinking'].forEach((name,i)=>add(`pose-${name}`,1,48+i*198,162,166,195));
['waving','lantern','backpack','headphones','book','cup','wise'].forEach((name,i)=>add(`pose-${name}`,1,45+i*198,407,166,188));
['calm','happy','curious','confused','sad','worried','embarrassed','surprised','determined','sleepy'].forEach((name,i)=>add(`face-${name}`,1,48+i*137,697,112,120));
['book','journal','pencil','cup','backpack','lantern','search','leaf','plant','signpost','notebook','headphones'].forEach((name,i)=>add(`prop-${name}`,1,37+i*115,921,112,115));
// Weather and moments give calendar, focus and reflection their own atmosphere.
['sunrise','sunset','night','clouds','snow','rain','dusk','clear','golden','storm','showers','mist'].forEach((name,i)=>add(`weather-${name}`,2,1225+(i%3)*102,34+Math.floor(i/3)*72,94,64));
add('empty-sitting',2,1400,625,112,77);add('empty-map',2,1390,742,130,93);
add('environment-trail',2,814,60,203,135);add('environment-camp',2,815,200,203,105);
add('decor-botanical',2,854,925,250,83);add('decor-sunmoon',2,644,923,165,63);
// Additional environments and accessories from sheet 3.
['mountain','forest','path','moon','campfire','tower','coast','garden','valley'].forEach((name,i)=>add(`world-${name}`,3,1227+(i%3)*101,39+Math.floor(i/3)*88,96,80));
['laptop','folded-map','magnifier','camera','compass','flower','heart','scarf','crown'].forEach((name,i)=>{
 const rects=[[1070,47,39,42],[1116,48,43,42],[1163,43,38,47],[1114,164,43,37],[1161,220,40,43],[1112,286,42,43],[1160,289,42,40],[1027,220,43,43],[1071,286,40,38]];add(`extra-${name}`,3,...rects[i]);
});
add('banner-walk',3,21,808,315,91);add('banner-camp',3,345,807,314,92);add('banner-cliff',3,668,806,70,93);add('banner-trail',3,849,806,132,93);
// Wider illustration library and emotion faces (sheet 4).
['cabin','lake','desk','stars','blossom','shore','desert','castle'].forEach((name,i)=>add(`scene-${name}`,4,26+(i%4)*143,570+Math.floor(i/4)*87,135,76));
['glad','angry','worried','sad','mixed','numb','tired','steady','unsure'].forEach((name,i)=>add(`mood-${name}`,4,638+(i%3)*50,590+Math.floor(i/3)*59,42,46));
add('empty-peace',4,1535,785,80,70);add('decor-clouds',4,1126,617,174,54);add('decor-sprigs',4,1309,564,85,56);
// Sheet 5's navigation system is recreated with accessible SVG controls.
add('nav-empty',5,23,1006,228,80);add('nav-landscape',5,1200,7,243,109);
// Theme thumbnails, learning shelves, seasonal backgrounds and character moments.
const themeRects={feel:[20,16,462,236],calm:[493,16,464,236],think:[969,16,461,236],choose:[20,267,347,246],relate:[380,267,367,246],identity:[760,267,331,246],learn:[1104,267,325,246]};
// Crop illustration areas only; all headings remain selectable HTML text.
// Use a larger, balanced illustration window for each card. The relate card is
// deliberately cropped to the blank Nobody character and landscape; the
// source sheet's second, brown character is not used anywhere in the app.
for(const [name,rect] of Object.entries({feel:[170,100,300,152],calm:[493,105,464,145],think:[1164,72,266,176],choose:[122,350,245,160],relate:[480,344,150,170],identity:[760,350,331,160],learn:[1110,350,319,160]}))add(`theme-${name}`,6,...rect);
// A relation illustration from the character sheet keeps both figures as the
// same blank Nobody character and avoids the brown figure in the reference card.
add('theme-relate-safe',3,515,615,135,110);
['crash','blog','videos','audios','stories','debates'].forEach((name,i)=>add(`learn-${name}`,6,25+i*239,613,211,107));
['mountains','sunset','night','forest','meadow','clouds'].forEach((name,i)=>add(`land-${name}`,6,30+(i%3)*275,778+Math.floor(i/3)*130,263,120));
['fireside','thinking','hiking','reflecting','together','resting'].forEach((name,i)=>add(`moment-${name}`,6,877+(i%3)*180,778+Math.floor(i/3)*130,168,120));
// Sheet 7's component proportions inform cards, progress and continue controls.
add('card-journey',7,350,67,248,240);add('card-lesson',7,531,376,116,124);add('card-video',7,1173,382,220,120);add('card-empty',7,153,997,215,70);
// Homepage mock-up: use its landscape as a small footer flourish, not a screenshot UI.
add('home-footer',8,1,905,240,118);add('home-character',8,81,672,100,107);

let clipSequence=0;
export function resourceMarkup(name,className=''){
 const asset=resourceAtlas[name];if(!asset)return '';
 const {sheet,x,y,w,h}=asset,[width,height]=sheets[sheet];
 const clip=`resource-clip-${++clipSequence}`,fit=/^(land-|scene-|moment-|weather-|world-|banner-|home-footer)/.test(name)?'slice':'meet';
 return `<svg class="ui-resource ${className}" data-resource="${name}" viewBox="${x} ${y} ${w} ${h}" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid ${fit}"><defs><clipPath id="${clip}" clipPathUnits="userSpaceOnUse"><rect x="${x}" y="${y}" width="${w}" height="${h}"/></clipPath></defs><image href="ns-ui-sheet-${sheet}.webp" width="${width}" height="${height}" clip-path="url(#${clip})"/></svg>`;
}
function place(slot,name,className=''){
 if(!slot||slot.dataset.resourcePlaced)return;slot.dataset.resourcePlaced=name;slot.innerHTML=resourceMarkup(name,className);
}
function appendResource(parent,name,className){
 if(!parent||parent.querySelector(`:scope > .${className}`))return;
 parent.insertAdjacentHTML('beforeend',resourceMarkup(name,className));
}
const sceneFor={feel:'land-sunset',calm:'land-mountains',think:'scene-desk',choose:'banner-walk',relate:'moment-resting',identity:'moment-reflecting',learn:'scene-lake'};
export function enhanceResourceUI(main){
 const theme=main.dataset.uiTheme||'think';
 main.querySelectorAll('[data-library-theme-card]').forEach(card=>{
  const t=card.dataset.libraryThemeCard;place(card.querySelector('.ui-collection-art'),t==='relate'?'theme-relate-safe':`theme-${t}`,'ui-theme-viewport');
 });
 main.querySelectorAll('.learn-door-card').forEach(card=>{
  const key=card.dataset.learnView,name=key==='courses'?'theme-learn':key==='videos'?'card-video':`learn-${key}`;
  if(resourceAtlas[name])place(card.querySelector('.learn-door-icon'),name,'ui-learning-viewport');
 });
 main.querySelectorAll('.console-stage .choice-tile').forEach((card,i)=>{
  const names=['face-curious','face-confused','face-worried','prop-signpost','face-sleepy','extra-heart','face-calm','prop-headphones','prop-journal','face-happy','prop-book','face-confused'];
  const prior=card.querySelector('.ui-choice-art');
  if(card.dataset.resourceChoice)return;card.dataset.resourceChoice='true';prior?.remove();appendResource(card,names[i%names.length],'ui-choice-resource');
 });
 main.querySelectorAll('.ui-illustrated-header').forEach(hero=>{
  const title=hero.querySelector('h1')?.textContent||'';
  const image=/sleep|rest|evening/i.test(title)?'world-moon':/worry|uncertain/i.test(title)?'world-campfire':/decision|choose|start|action/i.test(title)?'world-path':/sensory|reset|ground/i.test(title)?'world-coast':/body|feel|emotion/i.test(title)?'land-meadow':/brain|unload|thought|organis/i.test(title)?'moment-thinking':/personality|self/i.test(title)?'moment-reflecting':/sound|focus/i.test(title)?'scene-cabin':/system|questionnaire/i.test(title)?'world-tower':sceneFor[theme]||'scene-lake';
  appendResource(hero,image,'ui-header-scene');
 });
 main.querySelectorAll('.library-empty,.board-empty,.account-empty,.pomodoro-empty,.lifestyle-empty,.empty').forEach((empty,i)=>{
  if(empty.closest('select,button'))return;
  const name=/search|results|match/i.test(empty.textContent)?'empty-map':/task/i.test(empty.textContent)?'empty-sitting':/saved|map/i.test(empty.textContent)?'card-empty':'empty-peace';
  appendResource(empty,name,'ui-empty-resource');empty.classList.add('resource-empty-state');
 });
 main.querySelectorAll('.post-placeholder').forEach((slot,i)=>place(slot,['scene-cabin','scene-blossom','scene-shore','scene-castle','scene-desert'][i%5],'ui-post-scene'));
 main.querySelectorAll('.course-card,.lesson-card').forEach((card,i)=>appendResource(card,i%2?'card-lesson':'pose-reading','ui-lesson-resource'));
 main.querySelectorAll('.questionnaire-card').forEach((card,i)=>appendResource(card,['world-coast','world-garden','world-valley'][i%3],'ui-card-landscape'));
 main.querySelectorAll('.library-tool-icon').forEach(slot=>{
  const title=slot.closest('.library-tool-item')?.textContent||'';
  const name=/write|journal|brain|unload/i.test(title)?'prop-journal':/worr|thought|explan|fact/i.test(title)?'prop-search':/breath|ground|calm/i.test(title)?'prop-leaf':/plan|task|step|priorit/i.test(title)?'prop-notebook':/social|friend|boundar|commun/i.test(title)?'extra-heart':null;
  if(name)place(slot,name,'ui-tool-prop');
 });
 main.querySelectorAll('.ui-art-option').forEach((card,i)=>{
  if(card.dataset.resourceOption)return;card.dataset.resourceOption='true';
  const title=card.querySelector('strong,b,h3,h2')?.textContent||'';
  const name=/support|friend|social|communicat/i.test(title)?'extra-heart':/read|learn|understand/i.test(title)?'prop-book':/rest|pause|sleep/i.test(title)?'pose-lying':/plan|step|task/i.test(title)?'prop-signpost':/sound|listen/i.test(title)?'prop-headphones':/sense|body|ground/i.test(title)?'prop-leaf':/reflect|write|note/i.test(title)?'prop-pencil':null;
  if(name){card.querySelector('.ui-option-art')?.remove();appendResource(card,name,'ui-option-resource');}
 });
 main.querySelectorAll('.tool-guide-note,.privacy-note').forEach(note=>{
  if(note.dataset.resourceNote)return;note.dataset.resourceNote='true';note.classList.add('ui-quiet-notice');
 });
 main.querySelectorAll('.focus-track').forEach((card,i)=>{
  const scenes=['weather-rain','world-campfire','weather-clouds','scene-shore','weather-night','weather-mist','world-forest','scene-cabin','scene-desk'];
  appendResource(card,scenes[i%scenes.length],'ui-track-landscape');
 });
 main.querySelectorAll('.announcement-rail,.announcement-empty').forEach(rail=>rail.classList.add('ui-update-banner'));
 main.querySelectorAll('[role=status]').forEach(status=>{
  if(status.closest('.lifestyle-page'))return;
  status.classList.toggle('ui-feedback-success',/saved|complete|copied|added|moved|enabled/i.test(status.textContent));
 });
 // Section dividers and existing footer become illustrated rather than more content.
 main.querySelectorAll('.strategy-divider').forEach(slot=>place(slot,'decor-botanical','ui-divider-resource'));
 const footer=document.querySelector('.app-sidebar-bottom');appendResource(footer,'home-footer','ui-sidebar-landscape');
 const mark=main.querySelector('.learn-page-mark');if(mark)place(mark,'prop-book','ui-learn-mark');
}

const symbolPaths={
 sun:'M12 2v2M12 20v2M2 12h2M20 12h2M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
 heart:'M12 21S2 15 2 8a5 5 0 0 1 10-1 5 5 0 0 1 10 1c0 7-10 13-10 13Z',
 calendar:'M4 5h16v16H4zM8 2v6M16 2v6M4 10h16M8 14h3M13 14h3M8 18h3',
 checklist:'M9 5h12M9 12h12M9 19h12M3 5l1 1 2-3M3 12l1 1 2-3M3 19l1 1 2-3',
 bell:'M5 16h14l-2-3V9a5 5 0 0 0-10 0v4zM10 20h4M12 2v2',
 arrow:'M4 12h16m-6-6 6 6-6 6',check:'m5 12 5 5L20 6',
 moon:'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z',
 leaf:'M20 3C6 2 2 8 5 15c5 9 16 0 15-12ZM4 22 16 8',
 book:'M12 5C8 2 4 3 2 4v16c3-2 6-2 10 0 4-2 7-2 10 0V4c-2-1-6-2-10 1ZM12 5v15',
 lock:'M5 10h14v11H5zM8 10V6a4 4 0 0 1 8 0v4M12 14v3',
 time:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 3',
 flower:'M12 11c-9-9-13 5-2 3C0 22 15 25 12 14c8 10 15-4 2-2 9-10-7-15-2-1ZM12 16v7',
 transfer:'M3 7h17l-4-4M21 17H4l4 4',
};
export const uiSymbol=(name)=>`<svg class="ui-symbol" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${symbolPaths[name]||symbolPaths.leaf}"/></svg>`;
