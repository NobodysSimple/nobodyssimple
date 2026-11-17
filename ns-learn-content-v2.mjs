/**
 * Publish reviewed course bundles here, imported by stable course ID.
 * Deliberately EMPTY: no lessons or exercises have been authored or enabled.
 * As course count grows, replace this mapping with per-course dynamic imports.
 */
export const PUBLISHED_COURSE_BUNDLES=Object.freeze({});
export const getLearnContent=id=>PUBLISHED_COURSE_BUNDLES[id]||null;
