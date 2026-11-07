import test from 'node:test';
import assert from 'node:assert/strict';
import {otherTrailWorldIds, otherTrailCurricula, getOtherTrailManifest, getOtherTrailUnit} from '../../ns-other-trails-curriculum.mjs';
import {getOtherTrailSequence, nextOtherTrailStone, otherTrailStoneStatus, saveOtherTrailLesson, isOtherTrailLessonDone} from '../../ns-other-trails-upgrade.mjs';

test('all upgraded trails have forty units, ten lessons and five stones', () => {
  assert.deepEqual(otherTrailWorldIds, ['meadow','bridge','workshop','observatory']);
  for (const world of otherTrailWorldIds) {
    const manifest = getOtherTrailManifest(world);
    assert.equal(manifest.units, 40);
    assert.equal(manifest.stepsPerUnit, 10);
    assert.equal(manifest.stonesPerUnit, 5);
    assert.equal(otherTrailCurricula[world].length, 40);
    assert.ok(otherTrailCurricula[world].every(unit => unit.steps.length === 10));
    assert.ok(otherTrailCurricula[world].every(unit => unit.stones.length === 5));
    assert.ok(otherTrailCurricula[world].every(unit => unit.stones.map(stone => stone.lessonCount).join(',') === '3,3,2,1,1'));
    assert.equal(getOtherTrailSequence(world).length, 200);
  }
});

test('progress is saved per lesson and stones fill only from completed lessons', () => {
  const store = new Map([['ns-account-learning-v2', JSON.stringify({'ns-skill:existing': {completed:true}})]]);
  const storage = {getItem:key => store.get(key) ?? null, setItem:(key, value) => store.set(key, value)};
  const first = getOtherTrailUnit('meadow', 1);
  const lesson1 = first.steps[0].id;
  const lesson2 = first.steps[1].id;
  assert.equal(otherTrailStoneStatus('meadow', 1, first.stones[0].id, JSON.parse(store.get('ns-account-learning-v2'))).done, 0);
  assert.equal(saveOtherTrailLesson('meadow', lesson1, storage), true);
  let records = JSON.parse(store.get('ns-account-learning-v2'));
  assert.equal(isOtherTrailLessonDone('meadow', lesson1, records), true);
  assert.equal(otherTrailStoneStatus('meadow', 1, first.stones[0].id, records).done, 1);
  assert.equal(otherTrailStoneStatus('meadow', 1, first.stones[1].id, records).done, 0);
  assert.equal(saveOtherTrailLesson('meadow', lesson2, storage), true);
  records = JSON.parse(store.get('ns-account-learning-v2'));
  assert.equal(otherTrailStoneStatus('meadow', 1, first.stones[0].id, records).done, 2);
  assert.equal(records['ns-skill:existing'].completed, true);
});

test('next stone moves sequentially through the trail', () => {
  const store = new Map([['ns-account-learning-v2', JSON.stringify({})]]);
  const storage = {getItem:key => store.get(key) ?? null, setItem:(key, value) => store.set(key, value)};
  let next = nextOtherTrailStone('bridge', JSON.parse(store.get('ns-account-learning-v2')));
  assert.equal(next.unit, 1);
  const unit = getOtherTrailUnit('bridge', 1);
  for (const step of unit.steps.filter(step => step.stoneId === unit.stones[0].id)) saveOtherTrailLesson('bridge', step.id, storage);
  next = nextOtherTrailStone('bridge', JSON.parse(store.get('ns-account-learning-v2')));
  assert.equal(next.stoneId, unit.stones[1].id);
  assert.equal(next.unit, 1);
});
