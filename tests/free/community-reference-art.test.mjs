import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=file=>readFileSync(new URL('../../'+file,import.meta.url),'utf8');

test('the campfire reference banner is a clean, self-contained illustration',()=>{
 const svg=src('community-art/campfire-reference-hero.svg');
 assert.match(svg,/<svg\b/);
 assert.match(svg,/<title\b/);
 assert.match(svg,/<image\b/);
 const match=svg.match(/href="data:image\/avif;base64,([A-Za-z0-9+/=]+)"/);
 assert.ok(match,'embedded artwork must exist and remain self-contained');
 assert.equal(match[1].length,4964);
 assert.doesNotMatch(svg,/<script|<foreignObject|<text\b|https?:\/\//i);
});

test('the main campfire scene uses reference art with SVG fallback and accessible text',()=>{
 const style=src('ns-community-campfire.css');
 assert.match(style,/background-image:url\("community-art\/campfire-reference-hero\.svg"\),url\("community-art\/campfire-hero\.svg"\)!important/);
 assert.match(style,/color:#fff4dd!important/);
 assert.match(style,/background-size:cover!important/);
 assert.match(src('index.html'),/ns-community-campfire\.css\?v=campfire-reference-art-20261115/);
 assert.match(src('sw.js'),/community-art\/campfire-reference-hero\.svg/);
});
