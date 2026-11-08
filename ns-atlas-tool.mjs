import {escapeHTML as esc} from './core.mjs';
import {atlasProfile,isSafetyPriority} from './ns-atlas-core.mjs';
import {worksheetFor,worksheetText} from './ns-atlas-worksheets.mjs';
import {getAtlasHandoff} from './ns-atlas-console.mjs';
import {readAtlasSession,writeAtlasSession} from './ns-atlas-session.mjs';
import {nhsHelp} from './ns-problem-map.mjs';
const s=x=>esc(String(x??''));
const save=(name,text)=>{
 const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
 const a=document.createElement('a');a.download=name;a.href=url;document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
};
export function renderAtlasTool(root,id){
 const p=atlasProfile(id);
 if(!p){root.innerHTML='<p>This exercise is not yet available. <a href="#navigate">Return to the console</a>.</p>';return;}
 const from=readAtlasSession(id)||getAtlasHandoff(id)||{};
 const state={variant:from.variant||'',maintainer:from.maintainer||'',customSituation:from.customSituation||'',notes:{...from.notes}};
 const intro='<div class="ns-atlas-tool"><a href="#problem/'+s(id)+'" class="ns-atlas-back">← Back to the learning guide</a>'+
 '<header class="ns-atlas-guide-hero"><p class="eyebrow">NOBODY’S SIMPLE · PERSONAL PRACTICE</p><h1>'+s(p.title)+'</h1>'+
 '<p>A specific tool for this problem. Choose what fits your situation and explore an appropriate next step.</p></header>'+
 '<div class="ns-atlas-tool-options"><label><strong>Which experience is closest?</strong><select data-tool-variant><option value="">Several / not sure</option>'+
 p.variants.map((v,i)=>'<option value="v'+i+'" '+(state.variant==='v'+i?'selected':'')+'>'+s(v)+'</option>').join('')+'</select></label>'+
 '<label><strong>Which process would you like to explore?</strong><select data-tool-maintainer><option value="">Not sure yet</option>'+
 p.maintainers.map(m=>'<option value="'+s(m.id)+'" '+(state.maintainer===m.id?'selected':'')+'>'+s(m.label)+'</option>').join('')+'</select></label></div>'+
 '<div class="ns-atlas-tool-scenario"><small>YOUR SITUATION</small><p data-tool-situation></p></div>'+
 (isSafetyPriority(id)?'<div class="ns-atlas-safety"><strong>Safety and support come first.</strong><p>For urgent help in the UK, call NHS 111 and select the mental health option; if you are in immediate danger call 999. Do not use an online exercise instead of emergency support.</p><a href="'+s(nhsHelp)+'" rel="noopener noreferrer" target="_blank">NHS urgent mental health help ↗</a></div>':'')+
 '<div data-atlas-tool-exercise></div><p class="ns-atlas-fine">This is an educational exercise, not a diagnostic test or a substitute for appropriate professional care.</p>'+
 '<div class="ns-atlas-resource-links"><a href="#problem/'+s(id)+'">Read the full psychoeducation guide →</a><a href="#navigate">Find another problem →</a></div></div>';
 root.innerHTML=intro;
 const update=()=>{
  const spec=worksheetFor(id,state);
  const container=root.querySelector('[data-atlas-tool-exercise]');if(!spec)return;
  root.querySelector('[data-tool-situation]').textContent=spec.situation;
  const notes=state.notes[spec.kind]||[];
  container.innerHTML='<div class="ns-atlas-work"><p class="ns-atlas-work-title"><strong>'+s(spec.title)+'</strong></p>'+
  '<p>'+s(spec.intro)+'</p><div class="ns-atlas-tool-prompts">'+spec.prompts.map((prompt,i)=>
  '<label>'+s(prompt)+'<textarea rows="3" maxlength="1700" data-tool-answer="'+i+'" placeholder="Optional: describe your own experience">'+s(notes[i]||'')+'</textarea></label>').join('')+'</div>'+
  '<p class="ns-atlas-fine">'+s(spec.how)+'</p>'+
  '<div class="ns-atlas-tool-actions"><button type="button" class="button" data-tool-result>Reflect on my answers →</button>'+
  '<button type="button" class="button secondary" data-tool-download>Download worksheet</button></div>'+
  '<div data-tool-reflection role="status" aria-live="polite"></div></div>';
  container.querySelectorAll('[data-tool-answer]').forEach(ta=>ta.addEventListener('input',()=>{
   const entry=state.notes[spec.kind]||(state.notes[spec.kind]=[]);
   entry[Number(ta.dataset.toolAnswer)]=ta.value;
  }));
  container.querySelector('[data-tool-result]')?.addEventListener('click',()=>{
   const given=(state.notes[spec.kind]||[]).filter(x=>String(x||'').trim()).length;
   const area=container.querySelector('[data-tool-reflection]');
   area.innerHTML='<div class="ns-atlas-reflection"><strong>What can you take forward?</strong><p>'+
    (given?'You identified '+given+' aspect'+(given===1?'':'s')+' of your situation. See whether the exercise has revealed a practical next step, an unresolved question, or a condition that somebody else needs to change.':
     'You do not have to write everything down. Consider whether this type of exercise fits your circumstances.')+
    '</p><p>Remember: a useful strategy should be proportionate to the real situation and not increase danger. You can change the selected process above.</p></div>';
  });
  container.querySelector('[data-tool-download]')?.addEventListener('click',()=>{
   save('nobodyssimple-'+id+'-'+spec.kind+'-exercise.txt',worksheetText(spec,state.notes[spec.kind]||[]));
   container.querySelector('[data-tool-reflection]').textContent='Your local worksheet was prepared for download.';
  });
  writeAtlasSession({...from,id,variant:state.variant,maintainer:state.maintainer,customSituation:state.customSituation});
 };
 root.querySelector('[data-tool-variant]')?.addEventListener('change',e=>{state.variant=e.target.value;update()});
 root.querySelector('[data-tool-maintainer]')?.addEventListener('change',e=>{state.maintainer=e.target.value;update()});
 update();
}
