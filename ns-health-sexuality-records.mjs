import {HEALTH_SEXUALITY_RECORDS_1} from './ns-health-sexuality-records-1.mjs';
import {HEALTH_SEXUALITY_RECORDS_2} from './ns-health-sexuality-records-2.mjs';
import {HEALTH_SEXUALITY_RECORDS_3} from './ns-health-sexuality-records-3.mjs';
import {HEALTH_SEXUALITY_RECORDS_4} from './ns-health-sexuality-records-4.mjs';
import {HEALTH_SEXUALITY_RECORDS_5} from './ns-health-sexuality-records-5.mjs';
export const HEALTH_SEXUALITY_RECORDS=Object.freeze([
 ...HEALTH_SEXUALITY_RECORDS_1,
 ...HEALTH_SEXUALITY_RECORDS_2,
 ...HEALTH_SEXUALITY_RECORDS_3,
 ...HEALTH_SEXUALITY_RECORDS_4,
 ...HEALTH_SEXUALITY_RECORDS_5
]);
if(HEALTH_SEXUALITY_RECORDS.length!==25||new Set(HEALTH_SEXUALITY_RECORDS.map(r=>r[0])).size!==25)
 throw Error('Sexual and reproductive wellbeing catalogue completeness error');
