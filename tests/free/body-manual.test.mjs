import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {BODY_GUIDES,BODY_IDS} from '../../ns-body-guide-data.mjs';
import {verifiedCompleted,pending,catalogueTotal} from '../../ns-catalogue-progress.mjs';
test('sleep manual is an authored and interactive atlas topic',()=>{
 assert.deepEqual(BODY_IDS,['sleep']);
 const g=BODY_GUIDES[0];
 assert.equal(atlasProblemIndex.find(p=>p.id===g.id)?.domain,'body');
 assert.ok(g.article.join(' ').split(/\s+/).length>=450);
 assert.equal(g.article.length,10);
 assert.equal(g.routes.length,4);
 assert.equal(g.whyQuestions.length,10);
 assert.equal(g.whyCases.length,16);
 assert.equal(new Set(g.whyCases.map(c=>c.situation)).size,16);
 assert.equal(g.roots.length,4);
 assert.ok(g.sources.length>=2);
 assert.ok(g.safety.includes('breathing'));
 for(const route of g.routes){assert.equal(route.questions.length,4);assert.ok(route.practice.length>60);}
 for(const c of g.whyCases)for(const k of ['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action','root'])assert.ok(c[k],k);
 assert.ok(verifiedCompleted.includes('sleep'));
 assert.ok(!pending.includes('sleep'));
 assert.equal(catalogueTotal.all,518);
});
test('sleep uses the dedicated manual on direct and workbook routes',()=>{
 const site=readFileSync(new URL('../../site.mjs',import.meta.url),'utf8');
 const renderer=readFileSync(new URL('../../ns-mood-manual.mjs',import.meta.url),'utf8');
 assert.match(site,/bodyGuideIds\.has\(key\)\)showBodyGuide\(key\)/);
 assert.match(site,/bodyGuideIds\.has\(options\.topic\)/);
 assert.match(site,/bodyGuideIds\.has\(selected\.target\)/);
 assert.match(renderer,/#navigate\/atlas\/body/);
});
