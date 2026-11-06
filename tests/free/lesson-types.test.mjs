import assert from 'node:assert/strict';
import { forestCourseDefinition } from '../../ns-living-trail.mjs';

const types = new Set(forestCourseDefinition.units.flatMap(unit => unit.lessons.map(lesson => lesson.type)));
for (const required of ['learn','explore','compare','practise','choose','apply','reflect','review','milestone']) {
  assert.ok(types.has(required), `Forest lessons should include the ${required} lesson type`);
}
console.log('lesson-types.test.mjs passed');
