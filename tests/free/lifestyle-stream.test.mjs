import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
import {EISENHOWER_QUADRANTS,validPriority,taskPriority} from '../../lifestyle-storage.mjs';

test('Lifestyle has its own primary desktop and four-item bottom mobile navigation',()=>{
 const page=src('index.html'),shell=src('ns-shell.mjs'),css=src('ns-shell.css');
 const mobile=page.match(/<nav class="app-bottom-nav"[\s\S]*?<\/nav>/)?.[0]||'';
 assert.equal((mobile.match(/data-route-link/g)||[]).length,4);
 assert.ok(mobile.includes('href="#lifestyle"'));
 assert.match(page,/<nav class="app-nav app-nav-primary"[\s\S]*href="#lifestyle"/);
 assert.doesNotMatch(page,/<a href="#simplyfocus" data-route-link/);
 assert.match(shell,/lifestyle:'#lifestyle'/);
 assert.match(css,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)!important/);
});
test('Home no longer shows Lifestyle; old focus bookmarks redirect to the internal mode',()=>{
 const home=src('strategy.mjs'),router=src('site.mjs'),features=src('features.mjs');
 assert.doesNotMatch(home,/ns-home-lifestyle|href="#lifestyle"/);
 assert.doesNotMatch(features,/class="card new-offering focus-offering"/);
 assert.match(router,/simplyfocus: \(\) => location\.replace\('#lifestyle\/focus'\)/);
 assert.match(router,/lifestyle: \(\) => renderLifestyle\(main, safeRoutePart\(id\)\)/);
 assert.doesNotMatch(features,/href="#simplyfocus"/);
});
test('Everyday sections form one continuous dashboard, without hidden tabs',()=>{
 const ui=src('lifestyle.mjs'),styles=src('lifestyle.css');
 for(const id of ['lifestyle-deed','lifestyle-checkin','lifestyle-tasks','lifestyle-calendar','lifestyle-reminders']){
  assert.ok(ui.includes("$('#"+id+"')"),id+' should join the same stream');
 }
 assert.match(ui,/life-dashboard-flow/);
 assert.match(ui,/life-mode-switch/);
 assert.match(ui,/data-life-mode="daily"/);
 assert.match(ui,/data-life-mode="focus"/);
 assert.match(ui,/data-life-everyday/);
 assert.match(ui,/data-life-focus-panel hidden/);
 assert.doesNotMatch(ui,/lifestyle-tool-shelf/);
 assert.doesNotMatch(ui,/data-life-panel|showPanel\(|lifestyle-tabs|life-panel-today/);
 assert.doesNotMatch(ui,/<details class="life-checkin-detail"/);
 assert.match(ui,/<div class="life-checkin-detail"/);
 assert.match(styles,/max-width:520px/);
 assert.match(styles,/\.life-dashboard-flow/);
});
test('SimplyFocus is mounted inside Lifestyle with lifecycle cleanup for audio and timers',()=>{
 const life=src('lifestyle.mjs'),focus=src('simplyfocus.mjs');
 assert.match(life,/renderSimplyFocus\(host,\{embedded:true\}\)/);
 assert.match(life,/host\._nsSimplyFocusCleanup\(\)/);
 assert.match(life,/host\.replaceChildren\(\)/);
 assert.match(focus,/root\._nsSimplyFocusCleanup=cleanup/);
 assert.match(focus,/pauseAudio\(\); playing=false/);
 assert.match(focus,/if\(pomodoroTimer\)clearInterval/);
 assert.match(focus,/if\(breathTimer\)clearInterval/);
 assert.match(focus,/window\.removeEventListener\('hashchange',cleanup\)/);
});

test('Lifestyle is a direct, always-visible dashboard with optional same-page focus mode',()=>{
 const life=src('lifestyle.mjs'),css=src('lifestyle.css'),routes=src('site.mjs');
 assert.match(life,/flow\.append\(\$\('#lifestyle-deed'\),\$\('#lifestyle-tasks'\),\$\('#lifestyle-checkin'\),\$\('#lifestyle-calendar'\),\$\('#lifestyle-reminders'\)\)/);
 assert.match(life,/root\.querySelectorAll\('\[data-life-mode\]'\)/);
 assert.match(life,/focusPanel\.hidden=false/);
 assert.match(life,/dailyPanel\.hidden=false/);
 assert.match(life,/\[data-life-focus-queue\]/);
 assert.match(css,/life-unified \.life-dashboard-flow/);
 assert.match(css,/life-unified \[hidden\]/);
 assert.match(routes,/simplyfocus: \(\) => location\.replace\('#lifestyle\/focus'\)/);
});

test('four different Eisenhower quadrants are available without guessing legacy priorities',()=>{
 assert.deepEqual(EISENHOWER_QUADRANTS.map(q=>q.id),['do','schedule','delegate','eliminate']);
 assert.equal(new Set(EISENHOWER_QUADRANTS.map(q=>q.title)).size,4);
 assert.equal(validPriority('delegate'),'delegate');
 assert.equal(validPriority('arbitrary'),'inbox');
 assert.equal(taskPriority({title:'Old task without a priority'}),'inbox');
 assert.equal(taskPriority({priority:'do'}),'do');
 const data=src('lifestyle-storage.mjs');
 assert.match(data,/priority:validPriority\(task.priority\)/);
 assert.match(data,/scheduledDate:task.date\|\|'',priority:taskPriority\(task\)/);
 assert.match(data,/date:task.scheduledDate\|\|localDate\(\),priority:taskPriority\(task\)/);
});
test('Lifestyle task list and quadrant board share one dataset and are accessible from a visible toggle',()=>{
 const life=src('lifestyle.mjs'),css=src('lifestyle.css');
 assert.match(life,/data-task-view="list"/);
 assert.match(life,/data-task-view="quadrants"/);
 assert.match(life,/id="lifestyle-task-priority"/);
 assert.match(life,/id="lifestyle-quadrants"/);
 assert.match(life,/EISENHOWER_QUADRANTS\.map/);
 assert.match(life,/taskView==='quadrants'/);
 assert.match(life,/localStorage\.setItem\(lifestyleTaskViewKey,taskView\)/);
 assert.match(life,/data-task-priority/);
 assert.match(life,/writeLifestyleTasks\(tasks\)/);
 assert.match(css,/life-quadrant--do/);
 assert.match(css,/life-quadrant--schedule/);
 assert.match(css,/life-quadrant--delegate/);
 assert.match(css,/life-quadrant--eliminate/);
 assert.match(css,/@media\(max-width:650px\)/);
});
