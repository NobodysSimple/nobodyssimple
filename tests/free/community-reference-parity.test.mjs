import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');

test('the duplicated community footer is not rendered by the new discussion template',()=>{
 const ui=source('community-ui.mjs');
 assert.doesNotMatch(ui,/class="board-community-footer"/);
 assert.doesNotMatch(ui,/Your community, your pace\./);
 assert.match(ui,/board-community-aside/);
 assert.match(ui,/Community &amp; safety/);
 assert.match(ui,/board-guidelines/);
});

test('campfire hero art is isolated from inherited image sizing and remains readable',()=>{
 const ui=source('community-ui.mjs'),css=source('ns-community-campfire.css');
 assert.match(ui,/<div class="board-hero-scene" aria-hidden="true"><\/div>/);
 assert.match(css,/background-image:url\("community-art\/campfire-hero\.svg"\)!important/);
 assert.match(css,/board-hero-copy h1 \{/);
 assert.match(css,/color:#fff4dd!important/);
 assert.match(css,/z-index:0!important/);
 assert.match(css,/z-index:1!important/);
 assert.match(css,/z-index:2!important/);
 assert.match(css,/background-size:cover!important/);
 assert.doesNotMatch(ui,/<img class="board-hero-scene"/);
});

test('real feed interaction controls replace invented social numbers',()=>{
 const ui=source('community-ui.mjs'),backend=source('community-data.mjs');
 assert.match(ui,/data-board-reply-total/);
 assert.match(ui,/data-board-like-total/);
 assert.match(ui,/data-board-like=/);
 assert.match(ui,/client\.postStats\(id\)/);
 assert.match(ui,/client\.react\(id,'like'\)/);
 assert.match(ui,/IntersectionObserver/);
 assert.match(backend,/async function postStats\(postId\)/);
 assert.match(backend,/getCountFromServer\(replies\)/);
 assert.match(backend,/getCountFromServer\(likes\)/);
 assert.match(backend,/where\('status','==','published'\)/);
 assert.match(backend,/where\('kind','==','like'\)/);
 assert.doesNotMatch(ui,/42 replies|128 likes|27 replies/);
});

test('new discussion topics are validated and old posts retain suggested themes',()=>{
 const ui=source('community-ui.mjs'),backend=source('community-data.mjs'),rules=source('firestore.rules');
 const first=ui.indexOf('const boardTopics=['),last=ui.indexOf('function gate(',first);
 assert.ok(first>=0&&last>first);
 const matcher=new Function(ui.slice(first,last)+'\nreturn {boardTopics,boardMatchesTopic,boardTopicsForPost};')();
 assert.equal(matcher.boardTopics.length,8);
 assert.equal(matcher.boardMatchesTopic({title:'Help please',category:'wins',body:''},'wins'),true);
 assert.equal(matcher.boardMatchesTopic({title:'Help please',category:'wins',body:''},'support'),false);
 assert.equal(matcher.boardMatchesTopic({title:'Feeling overwhelmed recently',body:''},'support'),true);
 assert.equal(matcher.boardTopicsForPost({title:'Daily routine',category:'everyday',body:''})[0].id,'everyday');
 assert.match(ui,/name="category"/);
 assert.match(ui,/category:form\.elements\.category\.value/);
 assert.match(backend,/postCategory\(category\)/);
 assert.match(backend,/error\?\.code!=='permission-denied'/);
 assert.match(rules,/d\.category in \['general','support','advice','wins','questions','venting','creativity','everyday'\]/);
});

test('responsive card controls and dark mode treatment survive prior app styles',()=>{
 const css=source('ns-community-campfire.css');
 for(const needle of ['.board-post-tags','.board-post-tag','.board-card-meta','.board-reply-link','.board-feed-like','.board-card-open','.board-guidelines','@media(max-width:640px)','data-theme="dark"','data-low-stim=true',':focus-visible'])
  assert.ok(css.includes(needle),needle);
 const html=source('index.html'),sw=source('sw.js');
 assert.match(html,/ns-community-campfire\.css\?v=campfire-parity-20261115/);
 assert.match(html,/site\.mjs\?v=campfire-parity-20261115/);
 assert.match(sw,/community-art\/campfire-hero\.svg/);
 assert.match(sw,/campfire-parity-20261115/);
});

test('existing account, block, reaction and messaging safeguards remain',()=>{
 const ui=source('community-ui.mjs');
 for(const needle of ["client.publish(","client.replies(","client.report(","client.block(","client.react(","client.messages(","client.send(","client.inbox(","client.removeReply(","not end-to-end encrypted"])
  assert.ok(ui.includes(needle),needle);
});
