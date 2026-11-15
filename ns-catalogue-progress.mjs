/* Live, exact-ID catalogue coverage ledger. This file is deliberately derived
 * from the canonical atlas rather than a manually copied 518-item list.
 * "verifiedCompleted" means a dedicated routed manual with coverage tests;
 * do not infer that the remaining generic atlas entries have this standard.
 */
import {atlasProblemIndex} from './ns-atlas-core.mjs';
import {NAV_THEMES,topicTheme} from './ns-needs-themes.mjs';
import {MOOD_IDS} from './ns-mood-manual.mjs';
import {THINK_IDS} from './ns-think-guide-data.mjs';
import {HABIT_IDS} from './ns-habit-guide-data.mjs';
import {BEHAVIOUR_IDS} from './ns-behaviour-guide-data.mjs';
import {FOCUS_IDS} from './ns-focus-guide-data.mjs';
import {CLINICAL_IDS} from './ns-clinical-guide-data.mjs';
import {EXPERIENCE_IDS} from './ns-experiences-guide-data.mjs';
import {CONNECTION_IDS} from './ns-connection-guide-data.mjs';
import {DIGITAL_IDS} from './ns-digital-guide-data.mjs';
import {BODY_IDS} from './ns-body-guide-data.mjs';

const existingDedicated=[...MOOD_IDS,...THINK_IDS,...HABIT_IDS,...BEHAVIOUR_IDS,...FOCUS_IDS,...CLINICAL_IDS,...EXPERIENCE_IDS,...CONNECTION_IDS,...DIGITAL_IDS,...BODY_IDS,'social-anxiety'];
const atlasIds=new Set(atlasProblemIndex.map(p=>p.id));
const duplicate=existingDedicated.filter((id,i)=>existingDedicated.indexOf(id)!==i);
if(duplicate.length)throw new Error('Duplicate dedicated manual IDs: '+duplicate.join(', '));
const missing=existingDedicated.filter(id=>!atlasIds.has(id));
if(missing.length)throw new Error('Dedicated manual IDs missing from atlas: '+missing.join(', '));
export const verifiedCompleted=Object.freeze([...existingDedicated].sort());
export const inProgress=Object.freeze([]);
const done=new Set(verifiedCompleted);
export const pending=Object.freeze(atlasProblemIndex.map(p=>p.id).filter(id=>!done.has(id)).sort());
export const catalogueProgress=Object.freeze(NAV_THEMES.map(t=>{
 const ids=atlasProblemIndex.filter(p=>topicTheme(p)===t.id).map(p=>p.id).sort();
 return Object.freeze({theme:t.id,title:t.title,all:Object.freeze(ids),
  verifiedCompleted:Object.freeze(ids.filter(id=>done.has(id))),
  inProgress:Object.freeze(ids.filter(id=>inProgress.includes(id))),
  pending:Object.freeze(ids.filter(id=>!done.has(id)&&!inProgress.includes(id)))});
}));
export const catalogueTotal=Object.freeze({all:atlasProblemIndex.length,verifiedCompleted:verifiedCompleted.length,inProgress:inProgress.length,pending:pending.length});
