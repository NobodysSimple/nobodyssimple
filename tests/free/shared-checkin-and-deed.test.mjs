import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=file=>readFileSync(new URL('../../'+file,import.meta.url),'utf8');

test('Home and Lifestyle launch one daily check-in modal with a shared record key',()=>{
 const home=src('strategy.mjs'),life=src('lifestyle.mjs'),popup=src('ns-daily-checkin.mjs');
 const workflow=src('ns-lifestyle-workflow.mjs'),site=src('site.mjs');
 assert.match(home,/data-ns-open-checkin/);
 assert.match(workflow,/data-ns-open-checkin/);
 assert.match(popup,/DAILY_CHECKIN_KEY='ns-lifestyle-emotions-v1'/);
 assert.match(popup,/renderEmbeddedCompass/);
 assert.match(site,/installDailyCheckin\(\)/);
 assert.match(life,/readDailyCheckins\(\)/);
 assert.match(life,/DAILY_CHECKIN_CHANGED/);
 assert.match(popup,/saveDailyCheckin\(record\)/);
 assert.ok(!life.includes('lifestyle-checkin-form'),'the obsolete inline check-in must be gone');
});

test('Existing Emotion Compass is embedded without a second persistence route',()=>{
 const compass=src('features.mjs'),popup=src('ns-daily-checkin.mjs');
 assert.match(compass,/export function renderEmbeddedCompass/);
 assert.match(compass,/renderCompassContent\(root, emotions, onChoose, null, \{embedded:true\}\)/);
 assert.match(compass,/if\(options\.embedded\)/);
 assert.match(popup,/setWord\(label\)/);
 assert.match(popup,/saveDailyCheckin\(record\)/);
 assert.match(src('account-policy.mjs'),/'ns-lifestyle-emotions-v1': \['mood'/);
});

test('Reminders stay functional inside a compact modal instead of inline panels',()=>{
 const life=src('lifestyle.mjs'),workflow=src('ns-lifestyle-workflow.mjs');
 assert.match(life,/id="lifestyle-reminder-form"/);
 assert.match(life,/readLifestyleReminders\(\)/);
 assert.match(workflow,/reminderDialog\.append\(header,reminders\)/);
 assert.match(workflow,/reminderDialog\.showModal\(\)/);
 assert.match(workflow,/data-life-reminders-close/);
});

test('Daily Deed has original artwork and a truthful, navigable mission',()=>{
 const deed=src('lifestyle-practice-ui.mjs'),css=src('ns-daily-deed-quest.css'),art=src('lifestyle-art/daily-deed-journey.svg');
 const core=src('lifestyle-practice.mjs');
 assert.match(deed,/life-mission-task/);
 assert.match(deed,/life-mission-steps/);
 assert.match(deed,/practiceSummary\(state\)\.total/);
 assert.match(deed,/data-practice-done/);
 assert.match(deed,/data-practice-next/);
 assert.match(deed,/data-practice-pause/);
 assert.match(deed,/data-practice-undo/);
 assert.match(deed,/data-practice-level/);
 assert.match(deed,/data-practice-identity/);
 assert.match(css,/lifestyle-art\/mission-garden\.svg/);
 assert.match(art,/<svg/);
 assert.match(src('lifestyle-art/mission-garden.svg'),/<svg/);
 assert.match(core,/completePractice/);
 assert.ok(!deed.includes('7 day streak'));
});

test('All new static dependencies are declared in the app shell and offline cache',()=>{
 const html=src('index.html'),worker=src('sw.js');
 for(const file of ['ns-daily-checkin.css','ns-daily-deed-quest.css'])
  assert.ok(html.includes(file),file);
 for(const file of ['ns-daily-checkin.mjs','ns-daily-checkin.css','ns-daily-deed-quest.css','lifestyle-art/daily-deed-journey.svg'])
  assert.ok(worker.includes(file),file);
});