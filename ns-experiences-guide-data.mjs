import {makeExperience} from './ns-experiences-builder.mjs';
import {EXPERIENCE_CORE_A} from './ns-experiences-core-a.mjs';
import {EXPERIENCE_CORE_B} from './ns-experiences-core-b.mjs';
import {EXPERIENCE_CORE_C} from './ns-experiences-core-c.mjs';
import {EXPERIENCE_CORE_D} from './ns-experiences-core-d.mjs';
export const EXPERIENCE_GUIDES=Object.freeze([...EXPERIENCE_CORE_A,...EXPERIENCE_CORE_B,...EXPERIENCE_CORE_C,...EXPERIENCE_CORE_D].map(makeExperience));
export const EXPERIENCE_IDS=Object.freeze(EXPERIENCE_GUIDES.map(x=>x.id));
export const EXPERIENCE_GUIDES_BY_ID=new Map(EXPERIENCE_GUIDES.map(x=>[x.id,x]));
