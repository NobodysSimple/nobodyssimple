import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {lifeControls,createLifeNode} from '../../ns-life-node-types.mjs';
const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
test('Cropped Reality asks for a judgement only after revealing the missing context',()=>{
 let i=0;const node=createLifeNode('cropped_reality',()=>String(++i));
 const state={lifeFrame:0,lifeRevealed:false,lifeChoice:'',checked:null};
 const before=lifeControls(node,state);
 assert.match(before,/data-life-reveal/);
 assert.doesNotMatch(before,/life-initial/);
 assert.doesNotMatch(before,/name="life-choice"/);
 assert.doesNotMatch(before,/data-life-reveal disabled/);
 const after=lifeControls(node,{...state,lifeRevealed:true});
 assert.match(after,/name="life-choice"/);
 assert.match(after,/What was missing/);
 assert.match(after,/data-life-frame/);
});
test('dark-theme text stays dark on light evidence cards',()=>{
 const css=read('../../ns-life-nodes.css');
 assert.match(css,/\.ns-life-node__scene,.ns-life-node__reveal/);
 assert.match(css,/color:#183c2e !important/);
 assert.match(css,/\.ns-life-node__answers legend \{color:#f1f5ef !important/);
});
test('the public player no longer inserts unrelated landscape art or repeats source walls',()=>{
 const player=read('../../ns-learn-player-v2.mjs');
 assert.doesNotMatch(player,/course\?\.landscape\)\?'<figure/);
 assert.match(player,/const lifeArt='';/);
 assert.match(player,/options:state.options.get\(key\)/);
 assert.doesNotMatch(player,/Reading: '\+esc\(node\.sources\)/);
});
