/* Mexico cultural atlas: full documentary stories indexed to their states.
 * Text and image context are kept with each source-backed practice.
 */
import {MEXICO_A_STORIES,MEXICO_A_META} from './ns-cultural-atlas-mexico-a.mjs';
import {MEXICO_B_STORIES,MEXICO_B_META} from './ns-cultural-atlas-mexico-b.mjs';
import {MEXICO_C_STORIES,MEXICO_C_META} from './ns-cultural-atlas-mexico-c.mjs';
import {MEXICO_D_STORIES,MEXICO_D_META} from './ns-cultural-atlas-mexico-d.mjs';
export const MEXICO_STORIES=Object.freeze({...MEXICO_A_STORIES,...MEXICO_B_STORIES,...MEXICO_C_STORIES,...MEXICO_D_STORIES});
export const MEXICO_META=Object.freeze({...MEXICO_A_META,...MEXICO_B_META,...MEXICO_C_META,...MEXICO_D_META});
export const MEXICO_IMAGE_CONTEXT=Object.freeze(Object.fromEntries(Object.entries(MEXICO_STORIES).map(([id,story])=>[id,story.imageNotes])));
