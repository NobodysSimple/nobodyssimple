import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {activeHomeAnnouncements,countUnseenUpdates} from '../../ns-home-updates.mjs';
const content=JSON.parse(readFileSync(new URL('../../content.json',import.meta.url),'utf8'));
const src=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');

test('published creator announcements appear in bell from existing staff editor content',()=>{
 const items=activeHomeAnnouncements(content.posts,Date.parse('2026-11-06T10:00:00Z'));
 assert.equal(items.length,3);
 assert.ok(items.every(x=>x.type==='announcement'&&x.destinations.includes('home')));
 assert.equal(countUnseenUpdates(items,[]),3);
 assert.equal(countUnseenUpdates(items,items.map(x=>`${x.id}:${x.updatedAt||x.publishedAt||''}`)),0);
});
test('draft, future and expired announcements never appear',()=>{
 const t='2026-11-06T12:00:00Z';const base={id:'a',status:'published',type:'announcement',destinations:['home'],publishedAt:t};
 const samples=[base,{...base,id:'future',announcementStart:'2026-12-01T00:00:00Z'},{...base,id:'past',announcementEnd:'2026-10-01T00:00:00Z'},{...base,id:'draft',status:'draft'},{...base,id:'offhome',destinations:['library']}];
 assert.deepEqual(activeHomeAnnouncements(samples,Date.parse(t)).map(x=>x.id),['a']);
});
test('Home has one primary action, visible real Wisbody controls, and project-only latest',()=>{
 const strategy=src('strategy.mjs');
 assert.ok(strategy.includes('ns-home-refined'));
 assert.ok(strategy.includes('renderWisbody(root.querySelector'));
 assert.ok(strategy.includes('setupHomeUpdates(posts)'));
 assert.ok(!strategy.includes('ns-home-quick__card'));
 assert.ok(!strategy.includes('Community discussion</span>'));
 assert.ok(!strategy.includes('loadDiscussions'));
 assert.ok(strategy.includes('ns-skill:observation-or-story'));
 assert.ok(strategy.includes('href="#navigate"'));
});
test('Feed is primary on mobile and desktop while account remains accessible',()=>{
 const page=src('index.html'),shell=src('ns-shell.mjs');
 assert.match(page,/<nav class="app-bottom-nav"[\s\S]*href="#discussion"[\s\S]*>Feed<\/small>/);
 assert.ok(page.includes('href="#account"'));
 assert.ok(page.includes('href="#messages"'));
 assert.ok(page.includes('data-ns-updates-toggle'));
 assert.ok(!page.includes('class="app-search-link"'));
 assert.ok(shell.includes("feed:'#discussion'"));
 assert.ok(shell.includes("if(['discussion','discussion-moderation'].includes(name)) return 'feed'"));
});
test('new shared CSS is loaded after existing design rules and the cache version advances',()=>{
 const html=src('index.html'),sw=src('sw.js');
 assert.ok(html.indexOf('ns-home-refined.css')>html.indexOf('ns-vision.css'));
 assert.ok(sw.includes('ns-home-refined.css'));
 assert.ok(sw.includes('ns-home-updates.mjs'));
 assert.match(sw,/nobodyssimple-release-v\d+-[a-z-]+/);
});
