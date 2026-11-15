import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const text=path=>readFileSync(new URL('../../'+path,import.meta.url),'utf8');

test('Home scrapbook scenery loads after existing styles without editing its feature renderers',()=>{
 const html=text('index.html'),css=text('ns-home-scrapbook.css'),strategy=text('strategy.mjs');
 assert.ok(html.includes('ns-home-scrapbook.css?v=home-watercolor-20261115'));
 assert.ok(html.indexOf('ns-home-scrapbook.css')>html.indexOf('wisbody-reflections.css'));
 assert.ok(html.indexOf('ns-home-scrapbook.css')>html.indexOf('ns-cultural-atlas.css'));
 assert.match(css,/#main:has\(> \.ns-home-refined\)/);
 assert.ok(css.includes('.ns-home-hero'));
 assert.ok(css.includes('.ns-home-wisbody'));
 assert.ok(css.includes('.ns-home-latest'));
 assert.ok(css.includes('.ns-home-shortcuts'));
 assert.ok(css.includes('.ns-culture-atlas'));
 for(const id of ['ns-home-hero','ns-home-wisbody','home-latest','ns-home-shortcuts','ns-home-culture-map']){
  assert.ok(strategy.includes(id),'Original component must remain mounted: '+id);
 }
});
test('Home source still mounts all feature modules in original order',()=>{
 const source=text('strategy.mjs');
 const ids=['class="ns-home-hero"','class="ns-home-wisbody"','id="home-latest"','class="ns-home-shortcuts"','id="ns-home-culture-map"'];
 let previous=-1;
 for(const id of ids){
  const current=source.indexOf(id);
  assert.ok(current>previous,'Home component moved or missing: '+id);
  previous=current;
 }
 for(const mount of ["renderLatest(root.querySelector('#home-latest'),posts)","renderWisbody(root.querySelector('[data-ns-wisbody-full]'),{compact:true})","renderCultureAtlas(root.querySelector('#ns-home-culture-map'))"]){
  assert.ok(source.includes(mount),mount);
 }
 assert.ok(source.includes('href="#navigate"'));
 assert.ok(source.includes('href="#compass"'));
 assert.ok(source.includes('href="#community"'));
 assert.ok(source.includes('href="#wisbody"'));
});
test('Botanical sprigs are absent from the Home visual layer and replaced with paper and a small sticker',()=>{
 const css=text('ns-home-scrapbook.css');
 assert.doesNotMatch(css,/pressed-flowers\.svg/);
 assert.match(css,/home-art\/watercolor-countryside\.svg/);
 assert.match(css,/home-art\/daisy-sticker\.svg/);
 assert.match(css,/ns-home-hero::before[\s\S]*?border:3px solid #d1a55d/);
 assert.match(css,/ns-home-latest::before\{content:none!important;\}/);
 assert.match(css,/ns-culture-atlas::before\{content:none!important;\}/);
});
test('New artwork contains no baked-in characters and is not a screenshot',()=>{
 for(const name of ['home-art/watercolor-countryside.svg','home-art/daisy-sticker.svg']){
  assert.ok(existsSync(new URL('../../'+name,import.meta.url)),name);
  const artwork=text(name);
  assert.match(artwork,/^<\?xml/);
  assert.match(artwork,/<svg\b/);
  assert.match(artwork,/<\/svg>\s*$/);
  assert.doesNotMatch(artwork,/<script\b|<image\b|<foreignObject\b|<text\b|<use\b/i);
  assert.match(artwork,/<path\b/);
 }
});
test('Responsive and accessibility preferences are preserved',()=>{
 const css=text('ns-home-scrapbook.css');
 assert.match(css,/@media\(max-width:650px\)/);
 assert.match(css,/@media\(max-width:400px\)/);
 assert.match(css, /data-low-stim="true"/);
 assert.match(css, /prefers-reduced-motion:reduce/);
 assert.match(css, /data-theme="dark"/);
 assert.match(css, /:focus-visible/);
 assert.match(css, /pointer-events:none/);
 assert.doesNotMatch(css,/display:\s*none\s*!important\s*;[^}]*\.ns-culture-(?:map|controls)/);
});
test('New cache precaches the Home stylesheet and its lightweight art',()=>{
 const sw=text('sw.js');
 assert.match(sw,/nobodyssimple-release-v209-home-watercolor/);
 for(const item of ['ns-home-scrapbook.css','home-art/watercolor-countryside.svg','home-art/daisy-sticker.svg']){
  assert.ok(sw.includes("'"+item+"'"),item);
 }
});
