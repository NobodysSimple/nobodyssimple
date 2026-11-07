import assert from 'node:assert/strict';
import { forestCourseDefinition } from '../../ns-living-trail.mjs';

assert.equal(forestCourseDefinition.chapters.length, 8, 'Forest should have 8 chapters');
assert.equal(forestCourseDefinition.units.length, 40, 'Forest should have 40 units');
assert.ok(forestCourseDefinition.units.every(unit => unit.lessons.length === 10), 'Each unit should have 10 lessons grouped into 5 stones');
assert.equal(forestCourseDefinition.units[0].title, 'Facts, stories & uncertainty');
assert.ok(forestCourseDefinition.units[0].lessons.some(lesson => lesson.href === '#lab/mission/reality-sorter/notice'), 'Unit 1 should expose the live Reality Sorter mission');
console.log('forest-course.test.mjs passed');
