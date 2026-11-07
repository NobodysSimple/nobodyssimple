import assert from 'node:assert/strict';
import { curriculum, STONE_LABELS } from '../../ns-lifelab-content.mjs';

assert.deepEqual(STONE_LABELS,['Learn','Practise','Compare','Capstone','Apply']);
const types = new Set(curriculum.forest.flatMap(unit => unit.lessons.map(lesson => lesson.type)));
for (const required of ['standard','capstone','application']) {
  assert.ok(types.has(required), `Forest lessons should include the ${required} lesson type`);
}
console.log('lesson-types.test.mjs passed');
