// Wisbody's original micro-reflections. The six public topic families are
// split into ten editorial modules so the 500 entries stay reviewable.
import {groups as selfWorth} from './wisbody/reflections-self-worth.mjs';
import {groups as relationships} from './wisbody/reflections-relationships.mjs';
import {groups as control} from './wisbody/reflections-control.mjs';
import {groups as identity} from './wisbody/reflections-identity.mjs';
import {groups as emotions} from './wisbody/reflections-emotions.mjs';
import {groups as meaning} from './wisbody/reflections-meaning.mjs';
import {groups as action} from './wisbody/reflections-action.mjs';
import {groups as thinking} from './wisbody/reflections-thinking.mjs';
import {groups as past} from './wisbody/reflections-past.mjs';
import {groups as belonging} from './wisbody/reflections-belonging.mjs';

export const wisbodyThemeNames = Object.freeze({
 'self-worth':'Self-worth',relationships:'Relationships',control:'Control and uncertainty',
 identity:'Identity',emotions:'Difficult emotions',meaning:'Meaning and values',
 action:'Doing and changing',thinking:'Thinking patterns',past:'Past and learned safety',
 belonging:'Belonging and social life'
});
export const wisbodyDepthNames = Object.freeze({
 1:'A moment of relief',2:'Understand the pattern',3:'A deeper perspective',4:'Put it into practice'
});
export const wisbodyNeedNames = Object.freeze({
 relief:'Relief',understanding:'Understanding',permission:'Permission',
 perspective:'Perspective',action:'Action'
});
export const wisbodyGroups = Object.freeze([
 ...selfWorth,...relationships,...control,...identity,...emotions,
 ...meaning,...action,...thinking,...past,...belonging
]);

const seen = new Set();
const all = wisbodyGroups.flatMap(group=>{
 const lines=group.lines.trim().split('\n').map(line=>line.trim()).filter(Boolean);
 if(lines.length!==10)throw Error('Wisbody: expected ten reflections for '+group.pattern);
 return lines.map((line,index)=>{
  const parts=line.split('|').map(value=>value.trim());
  if(parts.length!==5)throw Error('Wisbody: malformed reflection '+group.pattern+'/'+index);
  const [depthText,need,text,prompt,experiment]=parts;
  const depth=Number(depthText),id='wisbody-'+group.pattern+'-'+String(index+1).padStart(2,'0');
  if(![1,2,3,4].includes(depth)||!wisbodyNeedNames[need]||!text||!prompt||!experiment||seen.has(id))
   throw Error('Wisbody: invalid or duplicate reflection '+id);
  if(!wisbodyThemeNames[group.theme]||!group.mechanism||!group.title)throw Error('Wisbody: invalid group '+group.pattern);
  seen.add(id);
  return Object.freeze({
   id,theme:group.theme,pattern:group.pattern,patternTitle:group.title,
   depth,need,text,prompt,experiment,mechanism:group.mechanism,
   type:'reflection',label:'Wisbody’s reflection'
  });
 });
});
if(all.length!==500||wisbodyGroups.length!==50)throw Error('Wisbody requires exactly 500 reflections in 50 patterns');
export const wisbodyReflections = Object.freeze(all);
export function deeperWisbodyReflection(quote,deck=wisbodyReflections){
 if(!quote||quote.depth>=4)return null;
 const nearby=deck.filter(item=>item.pattern===quote.pattern);
 const position=nearby.findIndex(item=>item.id===quote.id);
 return nearby.slice(position+1).find(item=>item.depth===quote.depth+1)
  ||nearby.find(item=>item.depth===quote.depth+1)||null;
}
