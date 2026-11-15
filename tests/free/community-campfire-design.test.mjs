import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');
const ui=()=>read('community-ui.mjs');
const css=()=>read('ns-community-campfire.css');

test('community board and Messages share the real campfire shell and existing links',()=>{
 const source=ui();
 assert.match(source,/board-campfire-hero/);
 assert.match(css(),/community-art\/campfire-hero\.svg/);
 assert.match(source,/location\.hash\.startsWith\('#messages'\)/);
 assert.match(source,/href="#discussion"/);
 assert.match(source,/href="#messages"/);
 assert.match(source,/href="#account\/community"/);
 assert.match(source,/board-messages-page/);
 assert.doesNotMatch(source,/<main class="board-community-main"/);
});

test('feed topic filters operate on loaded real post content',()=>{
 const source=ui();
 const first=source.indexOf('const boardTopics=[');
 const last=source.indexOf('function gate(',first);
 assert.ok(first>=0&&last>first);
 const matches=new Function(source.slice(first,last)+'\nreturn {boardTopics,boardMatchesTopic,boardWelcomePost};')();
 assert.equal(matches.boardTopics.length,8);
 assert.equal(matches.boardMatchesTopic({title:'A small win: I am proud of this',body:''},'wins'),true);
 assert.equal(matches.boardMatchesTopic({title:'Feeling overwhelmed lately',body:''},'support'),true);
 assert.equal(matches.boardMatchesTopic({title:'Hello everyone',body:''},'support'),false);
 assert.equal(matches.boardMatchesTopic({title:'Hello everyone',body:''},'all'),true);
 assert.equal(matches.boardWelcomePost({title:'Welcome to the Nobody’s Simple community!'}),true);
 assert.equal(matches.boardWelcomePost({title:'My ordinary day'}),false);
 assert.match(source,/data-board-search/);
 assert.match(source,/data-board-topic/);
 assert.match(source,/boardMatchesTopic\(post,activeTopic\)/);
 assert.match(source,/client\.blocked\(\)/);
 assert.match(source,/client\.feed\(cursor\)/);
});

test('feed labels and post actions use actual metadata, not invented engagement counts',()=>{
 const source=ui();
 assert.match(source,/p\.attachmentCount/);
 assert.match(source,/encodeURIComponent\(post\.id\)/);
 assert.match(source,/esc\(post\.title\)/);
 assert.match(source,/esc\(short\)/);
 assert.match(source,/board-featured-post/);
 assert.match(source,/boardWelcomePost\(post\)/);
 assert.doesNotMatch(source,/42 replies|128 likes|56 likes|27 replies/);
 assert.match(source,/Older posts are grouped by suggested themes/);
});

test('existing posting, reply, reactions, report, block and messaging handlers remain',()=>{
 const source=ui();
 for(const fragment of [
  "client.publish(", "client.reply(", "client.reactions(", "client.react(",
  "client.report(", "client.block(", "client.messages(", "client.send(",
  "client.inbox(", "client.earlierMessages(", "client.removePost(",
  "client.removeReply(", "client.send(to,{flowerCount",
  "data-board-signin", "data-reaction-status", "data-older-messages"
 ])assert.ok(source.includes(fragment),fragment+' must remain functional');
 assert.match(source,/not end-to-end encrypted/i);
 assert.match(source,/board-private-intro/);
 assert.match(source,/board-flower-form/);
});

test('campfire artwork and accessible, responsive UI styles exist',()=>{
 const style=css();
 for(const fragment of [
  '.board-community-grid','.board-seat-card','.board-safety-card',
  '.board-feed-card','.board-featured-post','.board-topic-filter',
  '.board-private-intro','.board-conversation','.board-message.mine',
  'data-theme="dark"','data-low-stim=true','prefers-reduced-motion',
  ':focus-visible','max-width:590px'
 ])assert.ok(style.includes(fragment),fragment);
 for(const name of ['campfire-hero.svg','lantern-seat.svg','campfire-card.svg']){
  const svg=read('community-art/'+name);
  assert.match(svg,/<svg\b/);
  assert.match(svg,/<title\b/);
  assert.doesNotMatch(svg,/<script\b|<foreignObject\b/i);
  assert.ok(style.includes(name)||ui().includes(name),name+' referenced');
 }
 assert.equal((style.match(/\{/g)||[]).length,(style.match(/\}/g)||[]).length);
});

test('the app loads and precaches community assets without changing data backend',()=>{
 const index=read('index.html'),worker=read('sw.js');
 assert.match(index,/ns-community-campfire\.css/);
 assert.match(index,/site\.mjs\?v=[a-z0-9-]{8,}/);
 for(const name of ['ns-community-campfire.css','community-ui.mjs','community-art/campfire-hero.svg','community-art/lantern-seat.svg','community-art/campfire-card.svg']){
  assert.ok(worker.includes("'"+name+"'"),name+' precached');
 }
 const backend=read('community-data.mjs');
 assert.match(backend,/async function feed\(cursor\)/);
 assert.match(backend,/async function publish\(/);
 assert.match(backend,/function inbox\(/);
});