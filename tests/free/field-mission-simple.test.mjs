import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 choosePracticeIdentity,choosePracticeSkills,choosePracticeFocus,
 completePractice,undoPractice,practiceSummary,practiceSkills,getPracticeTask
} from '../../lifestyle-practice.mjs';
const src=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');

test('Field Mission offers every skill without crowding the first view',()=>{
 const ui=src('lifestyle-practice-ui.mjs');
 assert.equal(practiceSkills.length,16);
 assert.match(ui,/const featured=\[/);
 assert.match(ui,/const other=practiceSkills\.filter/);
 assert.match(ui,/featured\.map\(skillButton\)/);
 assert.match(ui,/other\.map\(skillButton\)/);
 assert.match(ui,/life-mission-more/);
 assert.match(ui,/data-practice-focus=/);
});

test('a newly selected skill becomes today's real task without losing recorded progress',()=>{
 const now=new Date('2026-11-15T12:00:00');
 let state=choosePracticeIdentity({},'connected',now);
 assert.ok(state.skillIds.includes('communication'));
 state=completePractice(state,now);
 assert.equal(practiceSummary(state).total,1);
 const next=new Date('2026-11-16T12:00:00');
 const selected='boundaries',recent=[selected,...state.skillIds.filter(id=>id!==selected)].slice(0,2);
 const nextState=choosePracticeFocus(choosePracticeSkills(state,recent,next),selected,next);
 assert.equal(nextState.today.skillId,selected);
 assert.equal(getPracticeTask(nextState)?.skillId,selected);
 assert.equal(practiceSummary(nextState).total,1);
 assert.ok(nextState.history.some(item=>item.date==='2026-11-15'));
});

test('the primary checkbox and completion pill reuse the proven daily completion handler',()=>{
 const ui=src('lifestyle-practice-ui.mjs');
 assert.match(ui,/class="life-mission-check/);
 assert.match(ui,/data-practice-done/);
 assert.match(ui,/data-practice-undo/);
 assert.match(ui,/aria-pressed="true"/);
 assert.match(ui,/life-mission-done-button/);
 assert.match(ui,/completePractice\(s\)/);
 assert.match(ui,/undoPractice\(s\)/);
 assert.match(ui,/data-practice-pause/);
 assert.match(ui,/data-practice-resume/);
});

test('seven-step progress is counted from practices, not consecutive days or artificial XP',()=>{
 const ui=src('lifestyle-practice-ui.mjs'),css=src('ns-daily-deed-quest.css');
 assert.match(ui,/const chapter=total===0\?1:Math\.ceil\(total\/7\)/);
 assert.match(ui,/Array\.from\(\{length:7\}/);
 assert.match(ui,/No streak required/);
 assert.match(ui,/Skipping a day never erases progress/);
 assert.doesNotMatch(ui,/xp|coins|daily streak/i);
 assert.match(css,/\.life-mission-steps/);
 assert.match(css,/\.life-mission-task/);
});

test('the garden is a text-free decorative SVG, with responsive, low-stimulation and dark treatment',()=>{
 const artwork=src('lifestyle-art/mission-garden.svg');
 const css=src('ns-daily-deed-quest.css'),html=src('index.html'),sw=src('sw.js');
 assert.match(artwork,/<svg\b/);
 assert.match(artwork,/<title/);
 assert.doesNotMatch(artwork,/<(?:script|image|foreignObject|text)\b/i);
 assert.match(css,/lifestyle-art\/mission-garden\.svg/);
 assert.match(css,/max-width:700px/);
 assert.match(css,/data-low-stim=true/);
 assert.match(css,/data-theme="dark"/);
 assert.match(css,/:focus-visible/);
 assert.match(html,/field-mission-simple-20261115/);
 assert.match(sw,/mission-garden\.svg/);
});
