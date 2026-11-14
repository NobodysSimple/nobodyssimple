/* Fully authored clinical manuals. Shared layout, distinct clinical content. */
import {makeClinical} from './ns-clinical-builder.mjs';
import {CLINICAL_EDITORIAL_A} from './ns-clinical-editorial-a.mjs';
import {CLINICAL_EDITORIAL_B} from './ns-clinical-editorial-b.mjs';
import {CLINICAL_EDITORIAL_C} from './ns-clinical-editorial-c.mjs';
import {CLINICAL_EDITORIAL_D} from './ns-clinical-editorial-d.mjs';
import {CLINICAL_ROUTES_A} from './ns-clinical-routes-a.mjs';
import {CLINICAL_ROUTES_B} from './ns-clinical-routes-b.mjs';
import {CLINICAL_ROUTES_C} from './ns-clinical-routes-c.mjs';
import {CLINICAL_ROUTES_D} from './ns-clinical-routes-d.mjs';
import {CLINICAL_IDEAS_A} from './ns-clinical-ideas-a.mjs';
import {CLINICAL_IDEAS_B} from './ns-clinical-ideas-b.mjs';
import {CLINICAL_IDEAS_C} from './ns-clinical-ideas-c.mjs';
import {CLINICAL_IDEAS_D} from './ns-clinical-ideas-d.mjs';
const journals={...CLINICAL_ROUTES_A,...CLINICAL_ROUTES_B,...CLINICAL_ROUTES_C,...CLINICAL_ROUTES_D};
const suggestions={...CLINICAL_IDEAS_A,...CLINICAL_IDEAS_B,...CLINICAL_IDEAS_C,...CLINICAL_IDEAS_D};
const routeFields=['id','label','description','finish','practiceTitle','practice','questions'];
export const CLINICAL_GUIDES=Object.freeze([...CLINICAL_EDITORIAL_A,...CLINICAL_EDITORIAL_B,...CLINICAL_EDITORIAL_C,...CLINICAL_EDITORIAL_D].map(d=>
 makeClinical({...d,ideas:suggestions[d.id],routes:(journals[d.id]||[]).map(a=>Object.fromEntries(routeFields.map((f,i)=>[f,a[i]])))})));
export const CLINICAL_IDS=Object.freeze(CLINICAL_GUIDES.map(g=>g.id));
export const CLINICAL_BY_ID=new Map(CLINICAL_GUIDES.map(g=>[g.id,g]));
