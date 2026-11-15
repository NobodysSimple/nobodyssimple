import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {atlasProblemIndex} from '../../ns-atlas-core.mjs';
import {DIGITAL_GUIDES,DIGITAL_IDS} from '../../ns-digital-guide-data.mjs';
import {catalogueProgress,catalogueTotal,pending,verifiedCompleted,inProgress} from '../../ns-catalogue-progress.mjs';

test('digital manual is a real atlas topic with substantial independent content',()=>{
 assert.equal(DIGITAL_IDS.length,16);
 assert.ok(DIGITAL_IDS.includes('cyberbullying'));
 const g=DIGITAL_GUIDES.find(x=>x.id==='cyberbullying');
 assert.equal(atlasProblemIndex.find(p=>p.id===g.id)?.domain,'digital');
 assert.ok(g.article.join(' ').split(/\s+/).length>=450);
 assert.equal(g.article.length,10);
 assert.equal(g.routes.length,4);
 assert.equal(g.whyCases.length,16);
 assert.equal(new Set(g.whyCases.map(c=>c.situation)).size,16);
 assert.equal(g.whyQuestions.length,10);
 assert.equal(g.roots.length,4);
 assert.ok(g.sources.length>=1&&g.prominentSafety.length>80);
 for(const r of g.routes){assert.equal(r.questions.length,4);assert.ok(r.practice.length>50);}
 for(const c of g.whyCases)for(const k of ['situation','interpretation','emotion','response','function','need','rule','adaptation','alternative','action','root'])assert.ok(c[k],k);
});
test('catalogue progress partitions every atlas ID exactly once',()=>{
 const all=new Set(atlasProblemIndex.map(p=>p.id));
 assert.equal(all.size,atlasProblemIndex.length);
 assert.equal(catalogueTotal.all,all.size);
 assert.equal(catalogueTotal.verifiedCompleted+catalogueTotal.pending+catalogueTotal.inProgress,all.size);
 assert.equal(new Set([...verifiedCompleted,...pending,...inProgress]).size,all.size);
 assert.deepEqual(new Set([...verifiedCompleted,...pending,...inProgress]),all);
 assert.equal(catalogueProgress.reduce((n,t)=>n+t.all.length,0),all.size);
 assert.ok(verifiedCompleted.includes('cyberbullying'));
 assert.ok(!pending.includes('cyberbullying'));
 assert.equal(catalogueProgress.find(t=>t.theme==='connection').pending.length,0);
});
test('digital route and return navigation use the dedicated manual',()=>{
 const site=readFileSync(new URL('../../site.mjs',import.meta.url),'utf8');
 const renderer=readFileSync(new URL('../../ns-mood-manual.mjs',import.meta.url),'utf8');
 assert.match(site,/digitalGuideIds\.has\(key\)\)showDigitalGuide\(key\)/);
 assert.match(site,/digitalGuideIds\.has\(options\.topic\)/);
 assert.match(renderer,/#navigate\/area\/society\/digital/);
});
