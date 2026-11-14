import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 wisbodyReflections,wisbodyGroups,wisbodyThemeNames,wisbodyDepthNames,
 wisbodyNeedNames,deeperWisbodyReflection
} from '../../wisbody-content.mjs';
import {quoteDeckExtended as activeDeck} from '../../quote-content.mjs';
import {quoteDeckExtended as oldDeck} from '../../quote-content-legacy.mjs';

test('Wisbody contains 500 individually authored reflections in 50 patterns',()=>{
 assert.equal(wisbodyReflections.length,500);
 assert.equal(wisbodyGroups.length,50);
 assert.equal(new Set(wisbodyReflections.map(item=>item.id)).size,500);
 assert.equal(new Set(wisbodyReflections.map(item=>item.text.toLowerCase())).size,500);
 assert.equal(Object.keys(wisbodyThemeNames).length,10);
 assert.ok(Object.values(wisbodyThemeNames).every(Boolean));
 assert.equal(activeDeck,wisbodyReflections);
 assert.equal(oldDeck.length,200);
});
test('every reflection has useful context and a reflection and experiment',()=>{
 for(const entry of wisbodyReflections){
  assert.match(entry.id,/^wisbody-[a-z-]+-\d{2}$/);
  assert.ok(wisbodyThemeNames[entry.theme],entry.id);
  assert.ok(wisbodyDepthNames[entry.depth],entry.id);
  assert.ok(wisbodyNeedNames[entry.need],entry.id);
  assert.ok(entry.patternTitle.length>=5,entry.id);
  for(const field of ['text','prompt','experiment','mechanism']){
   assert.equal(typeof entry[field],'string',entry.id);
   assert.ok(entry[field].trim().length>=12,entry.id+' '+field);
  }
  assert.ok(entry.text.length>=40&&entry.text.length<=230,entry.id);
  assert.ok(entry.prompt.endsWith('?'),entry.id+' reflection prompt should be a question');
 }
});
test('each pattern offers the entire four-step depth journey',()=>{
 for(const group of wisbodyGroups){
  const items=wisbodyReflections.filter(item=>item.pattern===group.pattern);
  assert.equal(items.length,10,group.pattern);
  assert.deepEqual([...new Set(items.map(item=>item.depth))].sort(),[1,2,3,4]);
  for(const item of items){
   const deeper=deeperWisbodyReflection(item);
   if(item.depth===4)assert.equal(deeper,null);
   else{
    assert.ok(deeper,item.id);
    assert.equal(deeper.depth,item.depth+1,item.id);
    assert.equal(deeper.pattern,item.pattern,item.id);
   }
  }
 }
});
test('Wisbody saves by stable ID and retains legacy indexed notes',()=>{
 const src=readFileSync(new URL('../../wisbody-ui.mjs',import.meta.url),'utf8');
 assert.match(src,/current\[q\.id\]=value/);
 assert.match(src,/noteFor=q=>Object\.hasOwn\(pending,q\.id\)/);
 assert.match(src,/const QUOTE_KEY='ns-learn-quote-notes-v1'/);
 assert.match(src,/const DRAFT_SLOT='#wisbody-reflections'/);
 assert.match(src,/quote-content-legacy\.mjs/);
 assert.ok(!src.includes('notes[index]'));
});
