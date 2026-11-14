/* Russian Federation's local and Indigenous cultural practices.
 * Never treat a tradition specific to a community as a trait of a nationality.
 * Wikimedia Commons photos are checked and attributed by the existing renderer.
 */
import {RUSSIA_A_STORIES,RUSSIA_A_META} from './ns-cultural-atlas-russia-a.mjs';
import {RUSSIA_B_STORIES,RUSSIA_B_META} from './ns-cultural-atlas-russia-b.mjs';
import {RUSSIA_C_STORIES,RUSSIA_C_META} from './ns-cultural-atlas-russia-c.mjs';
import {RUSSIA_D_STORIES,RUSSIA_D_META} from './ns-cultural-atlas-russia-d.mjs';
export const RUSSIA_STORIES=Object.freeze({...RUSSIA_A_STORIES,...RUSSIA_B_STORIES,...RUSSIA_C_STORIES,...RUSSIA_D_STORIES});
export const RUSSIA_META=Object.freeze({...RUSSIA_A_META,...RUSSIA_B_META,...RUSSIA_C_META,...RUSSIA_D_META});
export const RUSSIA_IMAGE_CONTEXT=Object.freeze(Object.fromEntries(Object.entries(RUSSIA_STORIES).map(([id,story])=>[id,story.imageNotes])));
