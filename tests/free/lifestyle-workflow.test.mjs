import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const src=name=>readFileSync(new URL('../../'+name,import.meta.url),'utf8');

test('Lifestyle offers an optional arrival before the planner while preserving check-in form',()=>{
 const page=src('lifestyle.mjs');
 const workflow=src('ns-lifestyle-workflow.mjs');
 assert.match(page,/organiseLifestyle\(root,\{showMode,signal\}\)/);
 assert.match(workflow,/strip\.before\(arrival\)/);
 assert.match(workflow,/arrival\.after\(checkDrawer\)/);
 assert.match(workflow,/flow\.append\(calendar,tasks,practice\)/);
 assert.match(workflow,/settings\.append\(reminders\)/);
 assert.match(workflow,/data-life-checkin/);
 assert.match(workflow,/data-life-breathe/);
 assert.match(workflow,/href="#compass"/);
 assert.match(page,/id="lifestyle-checkin-form"/);
 assert.match(page,/id="lifestyle-calendar"/);
});

test('Task quick-add still submits the original form and retains all scheduling controls',()=>{
 const workflow=src('ns-lifestyle-workflow.mjs');
 const page=src('lifestyle.mjs');
 assert.match(workflow,/form\.insertBefore\(advanced,add\)/);
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

test('Field Mission reports practice, not ability or punitive streaks',()=>{
 const practice=src('lifestyle-practice-ui.mjs');
 const page=src('lifestyle.mjs');
 assert.match(page,/Today’s Field Mission/);
 assert.match(practice,/life-practice-trail-steps/);
 assert.match(practice,/life-practice-milestones/);
 assert.match(practice,/data-practice-pause/);
 assert.match(practice,/data-practice-undo/);
 assert.match(practice,/No streak to protect/);
 assert.match(src('sw.js'),/ns-lifestyle-workflow\.mjs/);
});