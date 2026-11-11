/* Cultural atlas viewport controls: wheel, touch drag, pinch, buttons and keyboard.
 * Projection coordinates are 960 x 480; viewport remains 2:1 to match the SVG.
 */
export const ATLAS_WIDTH=960;
export const ATLAS_HEIGHT=480;
export const MIN_ATLAS_WIDTH=8; // 120x maximum zoom: bounded to avoid floating-point drift.
export const WORLD_VIEW=Object.freeze({x:0,y:0,w:ATLAS_WIDTH,h:ATLAS_HEIGHT});
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
export function clampAtlasView(v){
 const w=clamp(Number(v.w)||960,MIN_ATLAS_WIDTH,ATLAS_WIDTH),h=w/2;
 return {x:clamp(Number(v.x)||0,0,ATLAS_WIDTH-w),y:clamp(Number(v.y)||0,0,ATLAS_HEIGHT-h),w,h};
}
export const atlasViewBox=v=>[v.x,v.y,v.w,v.h].map(n=>Number(n.toFixed(3))).join(' ');
export function zoomAtlasView(v,factor,pivotX=.5,pivotY=.5){
 const x=clamp(Number(pivotX),0,1),y=clamp(Number(pivotY),0,1);
 const width=clamp(v.w/Math.max(.01,Number(factor)||1),MIN_ATLAS_WIDTH,ATLAS_WIDTH);
 return clampAtlasView({x:v.x+v.w*x-width*x,y:v.y+v.h*y-(width/2)*y,w:width});
}
export function panAtlasView(v,deltaX,deltaY){
 return clampAtlasView({x:v.x+deltaX,y:v.y+deltaY,w:v.w});
}
export function fitAtlasBounds(bounds,padding=1.35){
 if(!bounds||bounds.length!==4||bounds.some(n=>!Number.isFinite(n)))return WORLD_VIEW;
 const [left,top,right,bottom]=bounds;
 const cx=(left+right)/2,cy=(top+bottom)/2;
 const width=clamp(Math.max(12,(right-left)*padding,(bottom-top)*padding*2),MIN_ATLAS_WIDTH,ATLAS_WIDTH);
 return clampAtlasView({x:cx-width/2,y:cy-width/4,w:width});
}
export function bindAtlasViewport(svg,{onChange=()=>{},onNavigate=()=>{}}={}){
 let view={...WORLD_VIEW},moved=false,ignoreClick=false,gesture=false;
 const pointers=new Map();
 let lastPinch=null;
 const apply=next=>{view=clampAtlasView(next);svg.setAttribute('viewBox',atlasViewBox(view));onChange(view);};
 const setView=next=>{apply(next);};
 const zoom=(factor,x=.5,y=.5)=>apply(zoomAtlasView(view,factor,x,y));
 const pan=(dx,dy)=>apply(panAtlasView(view,dx,dy));
 const local=event=>{
  const box=svg.getBoundingClientRect();
  return {x:event.clientX-box.left,y:event.clientY-box.top,w:Math.max(1,box.width),h:Math.max(1,box.height)};
 };
 const pivot=loc=>[loc.x/loc.w,loc.y/loc.h];
 const wheel=event=>{
  if(event.ctrlKey&&!event.deltaY)return;
  event.preventDefault();
  const p=local(event);
  zoom(Math.exp(-clamp(event.deltaY,-300,300)*.002),...pivot(p));
 };
 const start=event=>{
  if(event.button!==undefined&&event.button!==0&&event.pointerType!=='touch')return;
  if(!pointers.size){moved=false;ignoreClick=false;gesture=false;}
  const p=local(event);pointers.set(event.pointerId,{...p,startX:p.x,startY:p.y});
  if(pointers.size>1){gesture=true;ignoreClick=true;lastPinch=null;}
 };
 const move=event=>{
  const old=pointers.get(event.pointerId);if(!old)return;
  const p=local(event);pointers.set(event.pointerId,{...p,startX:old.startX,startY:old.startY});
  if(pointers.size>=2){
   const [a,b]=[...pointers.values()];
   const dist=Math.hypot(a.x-b.x,a.y-b.y);
   const centre={x:(a.x+b.x)/2,y:(a.y+b.y)/2,w:p.w,h:p.h};
   if(lastPinch?.dist>0){
    const scale=dist/lastPinch.dist;
    zoom(scale,...pivot(centre));
    pan(-(centre.x-lastPinch.x)*(view.w/centre.w),-(centre.y-lastPinch.y)*(view.h/centre.h));
   }
   lastPinch={dist,x:centre.x,y:centre.y};moved=true;ignoreClick=true;gesture=true;
   return;
  }
  lastPinch=null;
  if(!moved&&Math.hypot(p.x-old.startX,p.y-old.startY)<6)return;
  if(!moved){moved=true;ignoreClick=true;try{svg.setPointerCapture(event.pointerId);}catch{}}
  pan(-(p.x-old.x)*(view.w/p.w),-(p.y-old.y)*(view.h/p.h));
 };
 const end=event=>{
  pointers.delete(event.pointerId);lastPinch=null;
  try{if(svg.hasPointerCapture(event.pointerId))svg.releasePointerCapture(event.pointerId);}catch{}
 };
 const key=event=>{
  if(event.target!==svg)return;
  const d=view.w*.11;
  if(event.key==='+'||event.key==='='){event.preventDefault();zoom(1.4);onNavigate();}
  else if(event.key==='-'||event.key==='_'){event.preventDefault();zoom(1/1.4);onNavigate();}
  else if(event.key==='ArrowLeft'){event.preventDefault();pan(-d,0);}
  else if(event.key==='ArrowRight'){event.preventDefault();pan(d,0);}
  else if(event.key==='ArrowUp'){event.preventDefault();pan(0,-d/2);}
  else if(event.key==='ArrowDown'){event.preventDefault();pan(0,d/2);}
  else if(event.key==='0'||event.key==='Home'){event.preventDefault();setView(WORLD_VIEW);}
 };
 svg.addEventListener('wheel',wheel,{passive:false});
 svg.addEventListener('pointerdown',start);
 svg.addEventListener('pointermove',move);
 svg.addEventListener('pointerup',end);
 svg.addEventListener('pointercancel',end);
 svg.addEventListener('keydown',key);
 const destroy=()=>{
  svg.removeEventListener('wheel',wheel);
  svg.removeEventListener('pointerdown',start);
  svg.removeEventListener('pointermove',move);
  svg.removeEventListener('pointerup',end);
  svg.removeEventListener('pointercancel',end);
  svg.removeEventListener('keydown',key);
 };
 return {get view(){return {...view};},setView,zoom,pan,reset:()=>setView(WORLD_VIEW),
  consumeDragClick:()=>{const yes=ignoreClick;ignoreClick=false;return yes;},destroy};
}
