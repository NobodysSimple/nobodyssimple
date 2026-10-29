// Presentation only: decorates existing screens without adding routes or activities.
const paths = {
 home:'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',
 tools:'M8 4h8v5h5v7h-5v5H8v-5H3V9h5z',
 discussion:'M4 4h16v12H9l-5 4zM8 8h8M8 12h5',
 messages:'M3 6h18v13H3zM3 6l9 7 9-7',
 audio:'M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v7h4v-7zM20 12h2v7h-4v-7z',
 play:'M9 5 20 12 9 19z',
 map:'m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16',
 account:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM4 22v-2a8 8 0 0 1 16 0v2',
 help:'M12 21S2 15 2 8a5 5 0 0 1 10-1A5 5 0 0 1 22 8c0 7-10 13-10 13z',
 settings:'M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6',
 book:'M12 5C8 2 4 3 2 4v16c3-2 6-2 10 0 4-2 7-2 10 0V4c-2-1-6-2-10 1zM12 5v15',
 leaf:'M20 3C6 2 2 8 5 15c5 9 16 0 15-12zM4 22 16 8',
 sun:'M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0z',
 pin:'m9 3 6 0-1 5 4 4H6l4-4zM12 12v9',
 search:'M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0zM15 15l7 7',
 download:'M12 3v13M7 11l5 5 5-5M4 17v4h16v-4',
 check:'m5 12 5 5L20 6',
 flower:'M12 12c-10-8-12 4-2 2C0 21 15 25 12 14c8 10 15-4 2-2 9-10-7-15-2 0zM12 15v8',
 time:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0zM12 6v6l4 3',
 arrow:'M4 12h16M14 6l6 6-6 6',
 feedback:'m4 3 16 0v13H9l-5 5zM8 7h8M8 11h6',
 shield:'m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6zM8 12l3 3 5-6',
};
function icon(name) {
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg.classList.add('ui-icon');
 const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[name]||paths.leaf);svg.append(path);return svg;
}
function picture(pose,className='ui-character') {
 const img=document.createElement('img');img.src=`ns-character-${pose}.webp`;img.alt='';img.className=className;img.loading='lazy';img.decoding='async';img.width=160;img.height=160;return img;
}
const themes={
 feel:['compass','sunset'],calm:['meditate','mountains'],think:['thinking','forest'],choose:['hiking','path'],relate:['friends','sunset'],identity:['sitting','mountains'],learn:['reading','forest'],
};
function themeFor(text='') {
 if(/sensory|calm|breath|reset|ground|body|regulat|batter|energy|sound|focus|stim|overwhelm/i.test(text)) return 'calm';
 if(/relation|social|communicat|boundar|conflict|repair|friend|message|discussion|community/i.test(text)) return 'relate';
 if(/decision|value|action|small.step|start|task|time|motivat|career/i.test(text)) return 'choose';
 if(/identit|personality|self|masking|pattern|questionnaire|big.five|system/i.test(text)) return 'identity';
 if(/feel|emotion|mood/i.test(text)) return 'feel';
 if(/learn|read|blog|story|storie|debate|course|evidence/i.test(text)) return 'learn';
 return 'think';
}
const routeIcons={'intervention-book':'book',home:'home',tools:'tools',account:'account',discussion:'discussion',messages:'messages',simplyfocus:'audio','stim-space':'play',questionnaires:'map',community:'feedback',support:'help',install:'download',maps:'map',appearance:'settings',privacy:'shield',security:'shield',saved:'pin',learning:'book',notifications:'sun',profile:'account'};
function poseFor(text, fallback='thinking') {
 const choices=[[/brain.dump|journal/i,'writing'],[/reality|fact|evidence|thought.map/i,'mapping'],[/body|state.check/i,'checklist'],[/mixed|confus/i,'confused'],[/timeline|gratitude|savour/i,'star'],[/sensory.recipe|garden/i,'plant'],[/sensory.profile|learn/i,'reading'],[/battery|energy|capacity/i,'waiting'],[/load|budget|task|build/i,'building'],[/masking|self/i,'base'],[/CBT|probab|uncertain/i,'solving'],[/personality|perspective/i,'lantern'],[/big.five|questionnaire/i,'checklist'],[/system|course/i,'teaching'],[/focus|sound|audio|listen/i,'radio'],[/ground|support|safe/i,'shield'],[/decision|values|choose/i,'hiking'],[/communicat|friend|relation/i,'friends'],[/calm|breath|reset/i,'meditate'],[/feel|emotion|compass/i,'compass'],[/help|feedback/i,'helping']];
 return choices.find(([test])=>test.test(text))?.[1]||fallback;
}
function decorateNav(root=document) {
 root.querySelectorAll('.app-nav a, .app-bottom-nav > a, .app-install-link, .account-nav a').forEach(a=>{
  if(a.dataset.uiNav)return;a.dataset.uiNav='true';
  const parts=a.hash.slice(1).split('/');const name=parts.at(-1)||parts[0];
  let slot=a.querySelector('.app-nav-icon')||a.querySelector(':scope > span[aria-hidden]');
  if(!slot){slot=document.createElement('span');slot.className='ui-nav-symbol';slot.setAttribute('aria-hidden','true');a.prepend(slot);}
  slot.replaceChildren(icon(routeIcons[name]||'leaf'));
 });
 root.querySelectorAll('.app-help-pill > span:first-child, .library-search > span[aria-hidden]').forEach(n=>{
  if(n.dataset.uiIcon)return;n.dataset.uiIcon='true';n.replaceChildren(icon(n.closest('.library-search')?'search':'help'));
 });
}
function decorate() {
 decorateNav();
 const main=document.querySelector('main');if(!main)return;
 const route=location.hash.slice(1).split('/')[0]||'home';
 const heading=main.querySelector('.tool-heading h1, .page-intro h1, h1');
 const theme=themeFor(route+' '+(heading?.textContent||''));
 main.dataset.uiTheme=theme;main.dataset.uiScreen=route;
 // Existing theme cards become illustrated thumbnails; their buttons and listeners stay intact.
 main.querySelectorAll('[data-library-theme-card]').forEach(card=>{
  if(card.dataset.uiArt)return;card.dataset.uiArt='true';
  const t=card.dataset.libraryThemeCard;const [pose,scene]=themes[t]||themes.think;
  const frame=document.createElement('span');frame.className='ui-collection-art';frame.style.backgroundImage=`url("ns-landscape-${scene}.webp")`;frame.setAttribute('aria-hidden','true');frame.append(picture(pose));card.prepend(frame);
 });
 main.querySelectorAll('.library-tool-icon,.library-subcollection-symbol,.interactive-stage-icon,.learn-page-mark').forEach(slot=>{
  if(slot.dataset.uiArt)return;slot.dataset.uiArt='true';
  const parent=slot.closest('.library-tool-item,.library-subcollection-card,.interactive-page')||slot.parentElement;
  const t=themeFor(parent.querySelector('strong,.library-tool-title,h1')?.textContent||'learn');slot.replaceChildren(picture(poseFor(parent.querySelector('strong,.library-tool-title,h1')?.textContent||'',themes[t][0])));
 });
 main.querySelectorAll('.learn-door-card').forEach(card=>{
  if(card.dataset.uiArt)return;card.dataset.uiArt='true';
  const key=card.dataset.learnView;const pose=({crash:'teaching',courses:'reading',videos:'guide',audios:'radio',blog:'writing',stories:'friends',debates:'solving'})[key]||'reading';
  const slot=card.querySelector('.learn-door-icon');if(slot){slot.replaceChildren(picture(pose));slot.setAttribute('aria-hidden','true');}
 });
 main.querySelectorAll('.console-stage .choice-tile,.console-stage .compact-choices .choice-pill').forEach((card,i)=>{
  if(card.dataset.uiArt)return;card.dataset.uiArt='true';
  const poses=['compass','thinking','meditate','hiking','building','friends','sitting','shield','writing','star','reading','confused'];
  const pose=card.classList.contains('choice-tile')?poses[i%poses.length]:(themes[themeFor(card.textContent)]||themes.think)[0];
  const img=picture(pose,'ui-choice-art');card.append(img);
 });
 const heroSelector='.tool-heading,.tools-library-hero,.page-intro,.support-intro,.big-five-hero,.systems-hero,.recipe-intro,.sb-intro,.lb-intro,.mm-intro,.ln-hero,.pf-intro,.ndp-heading,.section-title';
 main.querySelectorAll(heroSelector).forEach(hero=>{
  if(hero.dataset.uiHero||hero.closest('.tool-guide-panel')||!hero.querySelector('h1'))return;hero.dataset.uiHero='true';
  const pose=poseFor(route+' '+(hero.querySelector('h1')?.textContent||''),themes[theme][0]);
  hero.classList.add('ui-illustrated-header');hero.append(picture(pose,'ui-header-art'));
 });
 main.querySelectorAll('.questionnaire-card').forEach((card,i)=>{
  if(card.dataset.uiArt)return;card.dataset.uiArt='true';const img=picture(['lantern','checklist','teaching'][i%3],'ui-questionnaire-art');const title=card.querySelector('h2');if(title)title.before(img);
 });
 main.querySelectorAll('.recipe-support,.lb-demand,.body-experiment-card,.state-mode-card,.sensory-route-card,.thought-map-mode-card,.timeline-mode-card,.cbt-mode-card,.ln-system-card').forEach(card=>{
  if(card.dataset.uiOption)return;card.dataset.uiOption='true';card.classList.add('ui-art-option');
  const title=card.querySelector('strong,b,h3,h2')?.textContent||'';card.append(picture(poseFor(title,themes[theme][0]),'ui-option-art'));
 });
 const boardHeader=main.querySelector('.board-header > img');if(boardHeader&&!boardHeader.dataset.uiArt){boardHeader.src='ns-character-friends.webp';boardHeader.dataset.uiArt='true';}
 main.querySelectorAll('.account-note,.board-gate,.library-empty,.board-empty,.account-empty').forEach(note=>{
  // Empty states use their existing space, no new panels or copy.
  if(note.dataset.uiArt)return;note.dataset.uiArt='true';note.classList.add('ui-note');
 });
 main.querySelectorAll('.focus-track-icon').forEach((slot,i)=>{
  if(slot.dataset.uiArt)return;slot.dataset.uiArt='true';
  const names=['leaf','sun','leaf','map','flower','audio','leaf','audio','audio'];slot.replaceChildren(icon(names[i]||'audio'));
 });
 main.querySelectorAll('.library-search > span[aria-hidden]').forEach(slot=>{if(slot.dataset.uiProp)return;slot.dataset.uiProp='true';const img=document.createElement('img');img.src='ns-prop-search.webp';img.alt='';img.className='ui-prop';slot.replaceChildren(img);});
 main.querySelectorAll('.learn-door-card').forEach(card=>{
  const props={audios:'headphones',blog:'journal',stories:'book',debates:'signpost'};const name=props[card.dataset.learnView];const slot=card.querySelector('.learn-door-icon');
  if(!name||!slot||slot.dataset.uiProp)return;slot.dataset.uiProp='true';const img=document.createElement('img');img.src=`ns-prop-${name}.webp`;img.alt='';img.className='ui-prop';slot.replaceChildren(img);
 });
 document.querySelectorAll('.account-dialog-content').forEach(dialog=>{
  if(dialog.dataset.uiArt)return;dialog.dataset.uiArt='true';dialog.prepend(picture('shield','ui-dialog-art'));
 });
}
let scheduled=false;
const observer=new MutationObserver(records=>{
 if(!records.some(record=>record.type==='childList'&&Array.from(record.addedNodes).some(node=>node.nodeType===1)))return;
 if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;decorate();});
});
function init(){decorate();observer.observe(document.body,{childList:true,subtree:true});window.addEventListener('hashchange',decorate);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
