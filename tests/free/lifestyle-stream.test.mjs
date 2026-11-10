import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');

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
 assert.doesNotMatch(ui,/data-life-panel|showPanel\(|lifestyle-tabs|life-panel-today/);
 assert.doesNotMatch(ui,/<details class="life-checkin-detail"/);
 assert.match(ui,/<div class="life-checkin-detail"/);
 assert.match(styles,/max-width:520px/);
 assert.match(styles,/\.life-dashboard-flow/);
});
test('SimplyFocus is mounted inside Lifestyle with lifecycle cleanup for audio and timers',()=>{
 const life=src('lifestyle.mjs'),focus=src('simplyfocus.mjs');
 assert.match(life,/renderSimplyFocus\(root\.querySelector\('\[data-life-focus-host\]'\),\{embedded:true\}\)/);
 assert.match(focus,/root\._nsSimplyFocusCleanup=cleanup/);
 assert.match(focus,/pauseAudio\(\); playing=false/);
 assert.match(focus,/if\(pomodoroTimer\)clearInterval/);
 assert.match(focus,/if\(breathTimer\)clearInterval/);
 assert.match(focus,/window\.removeEventListener\('hashchange',cleanup\)/);
});
