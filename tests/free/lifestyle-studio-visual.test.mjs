import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');

test('Lifestyle Studio is a visual-only stylesheet loaded after the existing features',()=>{
 const html=read('index.html'),css=read('ns-lifestyle-studio.css'),sw=read('sw.js');
 const base=html.indexOf('lifestyle.css?v=direct-board-20261110');
 const practice=html.indexOf('lifestyle-practice.css?v=identity-practice-1');
 const studio=html.indexOf('ns-lifestyle-studio.css?v=daily-workflow-20261115');
 assert.ok(base>=0 && practice>base && studio>practice);
 assert.ok(css.length>15000,'Studio layout should have full real responsive styling');
 assert.ok(css.includes('.life-unified'),'Scoped to the Lifestyle route');
 assert.match(sw,/nobodyssimple-release-v\d+-/);
 for(const path of ['ns-lifestyle-studio.css','lifestyle-art/studio-window.svg','lifestyle-art/studio-meadow.svg']){
  assert.ok(sw.includes("'"+path+"'"),'Offline cache: '+path);
  assert.ok(existsSync(new URL('../../'+path,import.meta.url)),path);
 }
});
test('The two illustrations cannot hide controls or bake interface text into images',()=>{
 const hero=read('lifestyle-art/studio-window.svg'),meadow=read('lifestyle-art/studio-meadow.svg');
 for(const svg of [hero,meadow]){
  assert.match(svg,/<svg\b/);
  assert.doesNotMatch(svg,/<(?:image|foreignObject|text|script)\b/i);
  assert.doesNotMatch(svg,/<(?:a|button|input)\b/i);
 }
 const css=read('ns-lifestyle-studio.css');
 assert.match(css,/\.life-page-header::after[\s\S]*?ns-character-reading\.webp/);
 assert.match(css,/#lifestyle-deed::after[\s\S]*?ns-character-watering\.webp/);
 assert.match(css,/\.life-dashboard-flow/);
 assert.match(css,/\.life-focus-host/);
 assert.doesNotMatch(css,/\.app-nav\b|\.ns-blog\b|\.ns-guide6-journal\b|\.ns-learn\b/);
});
test('Every Lifestyle feature and its exact operational DOM hooks remain in source',()=>{
 const life=read('lifestyle.mjs'),focus=read('simplyfocus.mjs');
 for(const id of ['life-everyday-panel','life-focus-panel','life-overview','lifestyle-deed-card','lifestyle-task-form','lifestyle-task-list','lifestyle-quadrants','lifestyle-calendar-grid','lifestyle-day-detail','lifestyle-reminder-form','lifestyle-reminder-status']){
  assert.ok(life.includes(id),'Existing Lifestyle feature: '+id);
 }
 for(const hook of ['data-life-mode="daily"','data-life-mode="focus"','data-task-view="quadrants"','data-task-view="list"','data-calendar-move="-1"','data-calendar-move="1"','id="lifestyle-enable-notifications"']){
  assert.ok(life.includes(hook),hook);
 }
 const popup=read('ns-daily-checkin.mjs');
 assert.match(popup,/id="ns-daily-checkin-form"/);
 assert.match(popup,/renderEmbeddedCompass/);
 for(const hook of ['id="focus-master",'id="focus-tracks"','id="focus-play"','id="focus-stop"','id="focus-save"','id="focus-breath-start"','id="focus-breath-reset"','id="pomodoro-start"','id="pomodoro-reset"','id="pomodoro-task-form"','id="pomodoro-project-form"','id="pomodoro-task-list"']){
  assert.ok(focus.includes(hook),hook);
 }
});
test('Studio presentation keeps all controls accessible on small screens and with sensory preferences',()=>{
 const css=read('ns-lifestyle-studio.css');
 for(const bp of ['max-width:1260px','max-width:1050px','max-width:760px','max-width:520px']){
  assert.ok(css.includes(bp),bp);
 }
 for(const selector of ['#lifestyle-deed','#lifestyle-tasks','#lifestyle-checkin','#lifestyle-calendar','#lifestyle-reminders']){
  assert.ok(css.includes(selector),'Visual placement for '+selector);
 }
 assert.match(css,/\.life-dashboard-flow:has\(> #lifestyle-tasks\.is-matrix-mode\)/);
 assert.match(css,/data-low-stim="true"/);
 assert.match(css,/data-theme="dark"/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/:focus-visible/);
 // Existing hidden panels are managed by JS; redesign should not re-expose them.
 assert.ok(read('lifestyle.css').includes('.life-unified [hidden]{display:none!important}'));
 assert.doesNotMatch(css,/\[data-life-everyday\]\{display:none/);
});
