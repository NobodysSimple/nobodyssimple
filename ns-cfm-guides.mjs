/* Index of individually authored culture, faith and migration manuals. */
import {CULTURE_CFM_GUIDES} from './ns-cfm-culture.mjs';
import {FAITH_CFM_GUIDES} from './ns-cfm-faith.mjs';
import {MIGRATION_CFM_GUIDES} from './ns-cfm-migration.mjs';
export const CFM_GUIDES=Object.freeze({
 ...CULTURE_CFM_GUIDES,
 ...FAITH_CFM_GUIDES,
 ...MIGRATION_CFM_GUIDES
});
export const cfmGuide=id=>CFM_GUIDES[String(id||'')]||null;
export const cfmGuideIds=Object.freeze(Object.keys(CFM_GUIDES));
