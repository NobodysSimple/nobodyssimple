// Original vector scenery: 200 distinct compositions, not repeating bitmaps.
// Adjacent sections share the exact boundary colour; detail fades into that
// boundary. The road uses the renderer's shared stone coordinates above this art.
const PALETTES={forest:['#a7c796','#d7e2ce','#b0cad2'],meadow:['#dce6b3','#c2ddbf','#e6d5b2'],bridge:['#a8d7d6','#80b9ca','#d4e6de'],workshop:['#e8c492','#d6a878','#e8d6a8'],observatory:['#adc9d2','#9299bc','#444f7d']};
function blend(a,b,t){const h=x=>x.match(/[a-f0-9]{2}/gi).map(v=>parseInt(v,16));return '#'+h(a).map((v,i)=>Math.round(v+(h(b)[i]-v)*t).toString(16).padStart(2,'0')).join('');}
export function boundaryColor(world,boundary){const p=PALETTES[world];const x=boundary/40*2;return x<=1?blend(p[0],p[1],x):blend(p[1],p[2],x-1);}
function random(seed){return ()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
const tree=(x,y,s,color='#426d53')=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-3 5h6v27h-6" fill="#886b46"/><path d="M0-65-26-15h13L-35 9H35L13-15h13Z" fill="${color}"/><path d="M0-65v74h35L13-15h13Z" fill="#172f3620"/></g>`;
const shrub=(x,y,s,color)=>`<g fill="${color}" transform="translate(${x} ${y}) scale(${s})"><ellipse rx="30" ry="17"/><circle cx="-16" cy="-13" r="16"/><circle cx="6" cy="-22" r="20"/><circle cx="23" cy="-8" r="16"/></g>`;
const flower=(x,y,s,color)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0v33M0 22q-18-22-20-7M0 27q18-22 20-7" stroke="#5a8351" stroke-width="4" fill="none"/><g fill="${color}"><circle cx="-9" cy="0" r="10"/><circle cx="9" cy="0" r="10"/><circle cy="-9" r="10"/><circle cy="9" r="10"/></g><circle r="6" fill="#ffdc79"/></g>`;
const rock=(x,y,s,color='#8196a0')=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="m-31 10 9-27 26-13 23 16 9 24Z" fill="${color}"/><path d="M4-30-8 10h44L27-14Z" fill="#20353a25"/></g>`;
const gear=(x,y,s,color)=>`<g transform="translate(${x} ${y}) scale(${s})" fill="${color}">${Array.from({length:8},(_,i)=>`<rect x="-6" y="-35" width="12" height="18" rx="2" transform="rotate(${i*45})"/>`).join('')}<circle r="27"/><circle r="12" fill="#f7e7b8"/></g>`;
const house=(x,y,s,roof='#9c7254')=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30-20h60v45h-60Z" fill="#fff0c9" stroke="#716749" stroke-width="2"/><path d="m-40-20 40-33 40 33Z" fill="${roof}"/><path d="M-8 25V2a8 8 0 0 1 16 0v23" fill="#b58c52"/><path d="M-23-7h10v10h-10Zm36 0h10v10H13Z" fill="#e3c75b"/></g>`;
const boat=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="m-31 10 11 15h40l13-15Z" fill="#a97c42"/><path d="M0-47V9" stroke="#5f6556" stroke-width="3"/><path d="M-4-41-29 5H-4Z" fill="#fff7db"/><path d="M4-29 29 5H4Z" fill="#e7b66d"/></g>`;
const star=(x,y,s,color='#ffdf82')=>`<path transform="translate(${x} ${y}) scale(${s})" d="m0-15 4 11 12 4-12 4-4 12-4-12-12-4 12-4Z" fill="${color}"/>`;
function landmark(world,x,y,scale,variant,progress){
 const start=`<g transform="translate(${x} ${y}) scale(${scale})">`,end='</g>';
 if(world==='forest')return start+(variant%3===0?house(0,0,1,'#667959'):variant%3===1?`<path d="M-35 10Q0-45 35 10M-35 10v22M35 10v22M-18-9v33M0-16v36M18-9v33" stroke="#8c7045" stroke-width="7" fill="none"/>`:`<path d="M0-38v70M0-35h43l12 12-12 12H0M0-4h-35l-12 12 12 12H0" fill="#dfb566" stroke="#806b47" stroke-width="3"/>`)+end;
 if(world==='meadow')return start+(variant%3===0?`<path d="M-45 28v-50Q0-83 45-22v50ZM-45-22h90M0-52v80M-24-43v71M24-43v71M-45 3h90" stroke="#66856a" stroke-width="4" fill="#f5f4ce99"/><path d="M-10 28V0Q0-16 10 0v28" stroke="#66856a" stroke-width="3" fill="#d3dfac"/>`:variant%3===1?`<ellipse rx="47" ry="23" fill="#7ebbc1"/><ellipse cy="-5" rx="28" ry="12" fill="#b5d8cf"/>${flower(30,-15,.7,'#d78ba6')}`:`<path d="M-40 25V-14Q0-65 40-14v39" fill="none" stroke="#9d8b58" stroke-width="7"/>${flower(-30,-13,.6,'#e5b2b3')}${flower(25,-22,.8,'#ead176')}`)+end;
 if(world==='bridge')return start+(variant%3===0?`<path d="m-22 30 8-75h28l8 75Z" fill="#fff2ce" stroke="#6e7d6d" stroke-width="3"/><path d="M-18-45h36v-20h-36Z" fill="#edc06d"/><path d="m-24-65 24-16 24 16Z" fill="#9a7754"/><path d="M-20 5h40" stroke="#7394a0" stroke-width="10"/>`:variant%3===1?house(0,0,1,'#678e94'):`<path d="M-49 0h98M-40 0v35M-10 0v35M20 0v35M45 0v35" stroke="#94754f" stroke-width="7"/><path d="M-40-25v25M45-25v25M-40-20Q0 0 45-20" fill="none" stroke="#c2a272" stroke-width="4"/>`)+end;
 if(world==='workshop')return start+(variant%3===0?`<path d="M-40 30v-65h80v65" fill="#c89d6a" stroke="#876b4b" stroke-width="3"/><path d="M-23 30V3a23 23 0 0 1 46 0v27" fill="#e8b04d"/><path d="m-12 27 3-25 10 10 4-24 12 39Z" fill="#ffe391"/><path d="M-48-35h96M-28-35v-25h18v25" stroke="#876b4b" stroke-width="8"/>`:variant%3===1?gear(0,0,1.4,'#99774e'):`<path d="M-40 28h80M-30 28v-70M30 28v-70M-35-40h70M0-40v34" fill="none" stroke="#7b7656" stroke-width="7"/><path d="m-15-4 15 18 15-18Z" fill="#ca9647"/>`)+end;
 return start+(variant%3===0?`<path d="M-35 28v-35h70v35Z" fill="#e8dfc8" stroke="#687a8b" stroke-width="3"/><path d="M-35-7a35 35 0 0 1 70 0ZM0-42v35" fill="#9facc4" stroke="#687a8b" stroke-width="3"/><path d="m8-32 37-26 8 12-35 28Z" fill="#f5dfa6" stroke="#687a8b" stroke-width="3"/>`:variant%3===1?`<path d="M0 0-25 35M0 0l25 35M0 0v35" stroke="#d3bd85" stroke-width="5"/><path d="m-27-6 60-29 10 22L-17 16Z" fill="#dcb571" stroke="#796e83" stroke-width="3"/>`:`<path d="M-35-20 0-40 35-10 8 20-35-20M0-40 8 20" stroke="#f2d788" stroke-width="2" fill="none"/>${star(-35,-20,.5)}${star(0,-40,.5)}${star(35,-10,.5)}${star(8,20,.5)}`)+end;
}
export function environmentSVG(world,unit){
 const row=Object.keys(PALETTES).indexOf(world),seed=7919*(row+1)+unit*104729,r=random(seed),p=(unit-1)/39,id=`land-${world}-${unit}`;
 const ground=boundaryColor(world,unit),bottom=boundaryColor(world,unit-1);let art='';
 // Unique terrain bands, matched to the trail's evolving altitude/climate.
 for(let i=0;i<4;i++){const y=110+i*185+Math.round(r()*55);const d=50+r()*70;const color=world==='observatory'?blend('#879cb1','#414e78',p):world==='bridge'?blend('#70b5c6','#4f90af',p):world==='workshop'?blend('#d5ac77','#ad875f',p):world==='meadow'?blend('#acc88b','#88b09b',p):blend('#739c68','#849fa4',p);art+=`<path d="M0 ${y}Q100 ${y-d} 240 ${y+20}T480 ${y-20}V${y+80}Q320 ${y+20} 180 ${y+80}T0 ${y+60}Z" fill="${color}" opacity=".28"/>`;}
 for(let i=0;i<18;i++){
  const side=i%2,x=side?392+r()*68:15+r()*73,y=70+r()*700,s=.5+r()*.65;
  if(world==='forest')art+=p>.65&&i%3===0?rock(x,y,s,blend('#92a69c','#bfcbd0',p)):tree(x,y,s*(1.15-p*.35),blend('#3e7755','#607b78',p));
  if(world==='meadow')art+=i%3===0?shrub(x,y,s,'#88ab79'):flower(x,y,s,['#dc9ba8','#efc86e','#ae91bd','#f0dfaa'][(i+unit)%4]);
  if(world==='bridge')art+=i%4===0?boat(x,y,s*.7):i%3===0?rock(x,y,s,'#8ca7a6'):`<path d="M${x-17} ${y}q8 7 16 0t16 0" stroke="#e4f0df" fill="none" stroke-width="3" opacity=".65"/>`;
  if(world==='workshop')art+=i%3===0?gear(x,y,s*.8,['#a47d4b','#c08d49','#8d9273'][(i+unit)%3]):rock(x,y,s,['#b79169','#c6a278','#9b9478'][i%3]);
  if(world==='observatory')art+=i%4===0?tree(x,y,s*.7,'#556d80'):star(x,y,s*.6,i%3?'#ffdf86':'#fff2d0');
 }
 const side=unit%2?75:405;
 art+=landmark(world,side,210+(unit*71)%340,.65+(unit%4)*.08,unit,p);
 art+=landmark(world,480-side,620-(unit*37)%240,.45+(unit%3)*.08,unit+1,p);
 if(world==='forest'&&p>.5)art+=`<path d="M0 210 65 ${130-p*100} 130 210ZM350 135 410 ${70-p*55} 480 135Z" fill="#dfe9df" opacity="${p*.7}"/>`;
 if(world==='observatory')art+=`<path d="M${52+unit*9%360} 90q30 25 0 50q55-5 0-50" fill="#ffe39c" opacity=".7"/>`;
 return `<svg class="ll-environment" viewBox="0 0 480 840" preserveAspectRatio="none" aria-hidden="true" data-environment="${world}-${unit}"><defs><linearGradient id="${id}-bg" x2="0" y2="1"><stop stop-color="${ground}"/><stop offset="1" stop-color="${bottom}"/></linearGradient><linearGradient id="${id}-fade" x2="0" y2="1"><stop stop-color="black"/><stop offset=".08" stop-color="white"/><stop offset=".92" stop-color="white"/><stop offset="1" stop-color="black"/></linearGradient><mask id="${id}-mask"><rect width="480" height="840" fill="url(#${id}-fade)"/></mask></defs><rect width="480" height="840" fill="url(#${id}-bg)"/><g mask="url(#${id}-mask)">${art}</g></svg>`;
}
export function finaleSVG(world){
 const sky=world==='observatory'?'#35456f':'#a7d8db';let art=`<rect width="600" height="420" fill="${sky}"/><circle cx="310" cy="90" r="65" fill="#ffdf88" opacity=".5"/>`;
 art+=`<path d="M0 245 95 115 180 225 285 75 400 205 495 95 600 235V420H0Z" fill="#829da5"/><path d="m230 140 55-65 59 68-38-13-22 18-24-19Z" fill="#f4f0df"/><path d="M0 350q150-120 300-50t300-40v160H0Z" fill="${world==='workshop'?'#a79c6b':world==='observatory'?'#607c86':'#7eaa75'}"/>`;
 if(world==='forest'){art+=`<path d="M260 188V112h90v76Z" fill="#ffdf93"/><path d="m246 112 60-45 60 45Z" fill="#edbd59"/><path d="M277 188v-65M304 188v-65M332 188v-65" stroke="#fff4cc" stroke-width="11"/><path d="m290 420 60-70-55-42 50-42-30-45 0-33" fill="none" stroke="#ffe39a" stroke-width="31"/>`;}
 if(world==='meadow'){art+=`<path d="M160 310V200a140 140 0 0 1 280 0v110ZM160 200h280M300 60v250M222 84v226M378 84v226M160 255h280" fill="#d8ecd0" stroke="#427d69" stroke-width="7"/><path d="M270 310v-65a30 30 0 0 1 60 0v65" fill="#ffe493" stroke="#427d69" stroke-width="5"/>`;for(let i=0;i<12;i++)art+=flower(80+i*40,350+(i%3)*14,.9,['#e4a4b2','#ead47a','#b59ac6'][i%3]);}
 if(world==='bridge'){art+=`<path d="M0 290h600v130H0Z" fill="#66acbc"/><path d="M150 270V150h300v120ZM125 270V130h50v140ZM425 270V130h50v140" fill="#f8dfaa" stroke="#a3966d" stroke-width="3"/><path d="M245 150a55 55 0 0 1 110 0Z" fill="#6caaa3"/><path d="M280 270v-65a20 20 0 0 1 40 0v65" fill="#d5ab57"/>`;for(let i=0;i<6;i++)art+=`<path d="M${150+i*55} 130V95l25 9-25 9" fill="#f1c05c" stroke="#a3966d" stroke-width="2"/>`;art+=boat(85,340,1.5)+boat(490,365,1.1);}
 if(world==='workshop'){art+=`<path d="M150 320V150h300v170ZM210 150V80h180v70Z" fill="#728f89" stroke="#586c65" stroke-width="5"/><path d="M180 320V210a120 120 0 0 1 240 0v110" fill="#d4a458" stroke="#f7d883" stroke-width="8"/>${gear(300,200,2.3,'#f6cd6d')}<path d="M280 320v-40a20 20 0 0 1 40 0v40" fill="#ffe5a3"/><path d="M150 200H95v105M450 200h55v105" fill="none" stroke="#b79259" stroke-width="18"/>`;}
 if(world==='observatory'){art+=`<path d="M160 315v-40a140 140 0 0 1 280 0v40ZM160 275h280M300 135v180M200 180l200 135M400 180 200 315M160 275l140-140 140 140" fill="#8396ae" fill-opacity=".5" stroke="#f6d88a" stroke-width="5"/><path d="M270 315v-45a30 30 0 0 1 60 0v45" fill="#ffe4a0"/>${star(300,100,2)}`;for(let i=0;i<16;i++)art+=star(20+(i*73)%560,25+(i*37)%160,.25+(i%3)*.15);}
 if(world!=='bridge'&&world!=='forest')art+=`<path d="M280 420q-50-55 20-105" fill="none" stroke="#f7d784" stroke-width="42"/>`;
 return `<svg class="ll-destination-art" viewBox="0 0 600 420" role="img" aria-label="Illustrated ${world==='forest'?'mountain summit':world==='meadow'?'restored glasshouse':world==='bridge'?'Grand Port village':world==='workshop'?'Great Engine':'Star Dome'}">${art}</svg>`;
}

export function gameArt(id,world){
 const symbols={
 'reality-sorter':'eye,thought,heart','clue-tracker':'search,check','fog-or-fact':'question,check','assumption-finder':'eye,thought,question','summit-route-planner':'route',
 'feeling-bloom':'heart,flower','need-matcher':'heart,cup','body-signal-sort':'heart,wave','signal-garden':'flower,wave','glasshouse-care-plan':'check,flower',
 'dockside-dialogue':'chat,chat','harbour-dialogue-builder':'chat,chat','signal-and-intent':'chat,question','boundary-beacon':'beacon','repair-map':'route,heart',
 'friction-forge':'hammer','habit-engine':'gear','priority-press':'list','momentum-run':'clock',
 'value-constellation':'stars','lens-switch':'glasses','story-orbit':'orbit','perspective-telescope':'telescope','capstone-path':'route'
 };
 const drawings={
 eye:'<path d="M-38 0Q0-40 38 0Q0 40-38 0Z"/><circle r="11" fill="#548fb8"/>',
 thought:'<path d="M-30 8Q-48-10-26-23Q-17-43 0-28Q22-43 30-23Q51-9 30 10Q20 30 0 18Q-20 30-30 8Z"/><circle cx="0" cy="36" r="5"/>',
 heart:'<path d="M0 32-30 0C-52-35-5-45 0-20C5-45 52-35 30 0Z" fill="#e4a2ab"/>',
 search:'<circle cx="-7" cy="-7" r="27"/><path d="m13 14 27 28" stroke-width="13"/>',
 check:'<path d="m-26 0 18 20 37-42" stroke="#69a452" stroke-width="10"/>',
 question:'<path d="M-17-17Q-17-43 10-33T10 7L0 16"/><circle cy="32" r="3"/>',
 flower:'<path d="M0 34V0M0 20Q-35 20-27-4Q-5-5 0 20M0 8Q34 8 28-19Q1-15 0 8" fill="#96be79"/>',
 cup:'<path d="M-28-4h50v28q-25 20-50 0ZM22 0q35-5 20 21H23M-15-35q-10 10 0 18M5-35q-10 10 0 18" fill="#ffe8ad"/>',
 wave:'<path d="M-36-14q18-20 36 0t36 0M-36 8q18-20 36 0t36 0M-36 29q18-20 36 0t36 0" stroke="#559ab4"/>',
 chat:'<path d="M-38-28h76v48H0l-25 20V20h-13Z" fill="#c4dce8"/><path d="M-22-11h44M-22 4h30"/>',
 beacon:'<path d="m-22 37 7-54h30l7 54ZM-22-17h44v-20h-44ZM-32-37 0-53 32-37M-48-24h-20M48-24h20" fill="#ffdf9b"/>',
 route:'<path d="M0 42V-34M0-30h38l16 15-16 15H0M0 1h-36l-16 15 16 15H0" fill="#f5d27e"/>',
 hammer:'<path d="m-16 32 35-53" stroke="#9b784d" stroke-width="14"/><path d="m-8-32 24-16 30 40-24 16Z" fill="#93a5aa"/><path d="M-40 22h80l-15 18h-50Z" fill="#748e99"/>',
 gear:'<circle r="35" fill="#e4bb61"/><circle r="17" fill="#95b6a6"/><path d="M0-49v15M0 34v15M-49 0h15M34 0h15M-35-35l10 10M25 25l10 10M-35 35l10-10M25-25l10-10" stroke-width="12"/>',
 list:'<rect x="-44" y="-38" width="88" height="22" rx="7" fill="#f6d987"/><rect x="-44" y="-9" width="88" height="22" rx="7" fill="#9bcde0"/><rect x="-44" y="20" width="88" height="22" rx="7" fill="#c2b1d8"/>',
 clock:'<circle r="38" fill="#fff4d0"/><path d="M0-25V0l17 11M-10-48h20" stroke-width="7"/>',
 stars:'<path d="m-45 26 25-45 35 35 30-43" stroke="#ead184"/><g fill="#ffe09a"><circle cx="-45" cy="26" r="9"/><circle cx="-20" cy="-19" r="9"/><circle cx="15" cy="16" r="9"/><circle cx="45" cy="-27" r="9"/></g>',
 glasses:'<circle cx="-26" r="22"/><circle cx="26" r="22"/><path d="M-4 0h8M-49-7l-13-10M49-7l13-10"/>',
 orbit:'<ellipse rx="55" ry="30"/><circle r="16" fill="#a2c7d7"/><circle cx="-48" cy="-16" r="11" fill="#d4c193"/><circle cx="42" cy="22" r="11" fill="#b7abd3"/>',
 telescope:'<path d="M0 14-26 45M0 14l26 31M0 14v31M-40-5l75-35 13 28-75 35Z" fill="#e4b96c"/>'
 };
 const ids=(symbols[id]||'stars').split(','),night=world==='observatory';
 return '<svg class="ll-game-art" viewBox="0 0 320 140" aria-hidden="true"><rect width="320" height="140" rx="18" fill="'+(night?'#68799d':'#b7d8ce')+'"/><path d="M0 110 52 61 100 108 179 42 240 111 285 70 320 105V140H0Z" fill="'+(night?'#536b88':'#8cbaa5')+'"/>'+ids.map((key,i)=>'<g transform="translate('+(320/(ids.length+1)*(i+1))+' 69) scale('+(ids.length>2?.65:.85)+')" fill="#fff8dc" stroke="#526856" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">'+drawings[key]+'</g>').join('')+'</svg>';
}
