import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=name=>readFileSync(new URL('../../'+name,import.meta.url),'utf8');

test('Lifestyle uses a shared check-in popup and subtle reminder settings',()=>{
 const page=src('lifestyle.mjs'),workflow=src('ns-lifestyle-workflow.mjs');
 const shared=src('ns-daily-checkin.mjs');
 assert.match(page,/organiseLifestyle\(root,\{showMode,signal\}\)/);
 assert.match(workflow,/data-ns-open-checkin/);
 assert.match(workflow,/life-daily-reminders/);
 assert.match(workflow,/reminderDialog\.showModal\(\)/);
 assert.match(workflow,/flow\.append\(calendar,tasks,practice\)/);
 assert.ok(!page.includes('id="lifestyle-checkin-form"'));
 assert.match(page,/id="lifestyle-calendar"/);
 assert.match(shared,/DAILY_CHECKIN_KEY='ns-lifestyle-emotions-v1'/);
 assert.match(shared,/renderEmbeddedCompass/);
 assert.match(page,/readDailyCheckins\(\)/);
});

test('Task quick-add still submits the original form and retains all scheduling controls',()=>{
 const workflow=src('ns-lifestyle-workflow.mjs');
 const page=src('lifestyle.mjs');
 assert.match(workflow,/form\.append\(advanced\)/);
 assert.match(workflow,/form\.classList\.add\('life-task-quick-form'\)/);
 for(const id of ['lifestyle-task-date','lifestyle-task-time','lifestyle-task-priority','lifestyle-task-note'])
   assert.ok(page.includes('id="'+id+'"'),id+' should remain accessible');
 assert.match(page,/addLifestyleTask\(/);
});

test('SimplyFocus prioritises the timer and tasks ahead of sound and breathing',()=>{
 const focus=src('simplyfocus.mjs');
 assert.match(focus,/intro\.after\(session\)/);
 assert.match(focus,/session\.after\(sound\)/);
 assert.match(focus,/sound\.after\(breathe\)/);
 for(const id of ['pomodoro-start','pomodoro-task-form','focus-play','focus-breath-start'])
  assert.ok(focus.includes(id));
});

test('The Daily Deed reports actual practices with an accessible quest action',()=>{
 const practice=src('lifestyle-practice-ui.mjs'),page=src('lifestyle.mjs');
 assert.match(page,/Today’s Field Mission/);
 assert.match(practice,/life-mission-task/);
 assert.match(practice,/life-mission-steps/);
 assert.match(practice,/data-practice-done/);
 assert.match(practice,/data-practice-pause/);
 assert.match(practice,/data-practice-undo/);
 assert.match(practice,/Skipping a day never erases progress/);
 assert.match(src('sw.js'),/ns-lifestyle-workflow\.mjs/);
});
