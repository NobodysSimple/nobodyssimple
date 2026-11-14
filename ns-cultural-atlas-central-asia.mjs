/* Central Asian cultural atlas: 28 documentary readings from the five core countries.
 * Images are Commons file titles and are licence/author checked at render time.
 * imageNotes never identify a contextual photograph as a performance of another practice.
 */
import {CENTRAL_A_STORIES,CENTRAL_A_META} from './ns-cultural-atlas-central-asia-a.mjs';
import {CENTRAL_B_STORIES,CENTRAL_B_META} from './ns-cultural-atlas-central-asia-b.mjs';
import {CENTRAL_C_STORIES,CENTRAL_C_META} from './ns-cultural-atlas-central-asia-c.mjs';
import {CENTRAL_D_STORIES,CENTRAL_D_META} from './ns-cultural-atlas-central-asia-d.mjs';
import {CENTRAL_E_STORIES,CENTRAL_E_META} from './ns-cultural-atlas-central-asia-e.mjs';
import {CENTRAL_F_STORIES,CENTRAL_F_META} from './ns-cultural-atlas-central-asia-f.mjs';
export const CENTRAL_ASIA_STORIES=Object.freeze({...CENTRAL_A_STORIES,...CENTRAL_B_STORIES,...CENTRAL_C_STORIES,...CENTRAL_D_STORIES,...CENTRAL_E_STORIES,...CENTRAL_F_STORIES});
export const CENTRAL_ASIA_META=Object.freeze({...CENTRAL_A_META,...CENTRAL_B_META,...CENTRAL_C_META,...CENTRAL_D_META,...CENTRAL_E_META,...CENTRAL_F_META});
export const CENTRAL_ASIA_IMAGE_CONTEXT=Object.freeze(Object.fromEntries(Object.entries(CENTRAL_ASIA_STORIES).map(([id,story])=>[id,story.imageNotes])));
