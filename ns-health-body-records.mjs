import {HEALTH_BODY_RECORDS_1} from './ns-health-body-records-1.mjs';
import {HEALTH_BODY_RECORDS_2} from './ns-health-body-records-2.mjs';
import {HEALTH_BODY_RECORDS_3} from './ns-health-body-records-3.mjs';
import {HEALTH_BODY_RECORDS_4} from './ns-health-body-records-4.mjs';
import {HEALTH_BODY_RECORDS_5} from './ns-health-body-records-5.mjs';
export const HEALTH_BODY_RECORDS=Object.freeze([
 ...HEALTH_BODY_RECORDS_1,
 ...HEALTH_BODY_RECORDS_2,
 ...HEALTH_BODY_RECORDS_3,
 ...HEALTH_BODY_RECORDS_4,
 ...HEALTH_BODY_RECORDS_5
]);
if(HEALTH_BODY_RECORDS.length!==21||new Set(HEALTH_BODY_RECORDS.map(r=>r[0])).size!==21)
 throw Error('Body catalogue record completeness error');
