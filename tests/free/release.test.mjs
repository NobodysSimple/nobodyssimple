import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync,readdirSync} from 'node:fs';
import vm from 'node:vm';
import {toolDiscoveryInventory} from '../../ns-tool-library.mjs';
import {SAVED,DEFAULTS} from '../../account-policy.mjs';

const root = new URL('../../',import.meta.url);
const txt = path => readFileSync(new URL(path,root),'utf8');

test('103 baseline tools and seven stable themes remain discoverable',()=>{
 assert.equal(toolDiscoveryInventory.total,103);
 assert.equal(new Set(toolDiscoveryInventory.ids).size,103);
 assert.deepEqual([...toolDiscoveryInventory.themes],['feel','calm','think','choose','relate','identity','learn']);
});
test('old account keys and accessibility preferences remain available',()=>{
 for(const key of ['ns-personal-maps-v1','ns-account-tool-drafts-v2','ns-tool-favourites-v1','ns-field-guide-v1','ns-big-five-atlas-v1','ns-simplyfocus-recipe-v2','ns-lifestyle-tasks-v1']) assert.ok(key in SAVED, key);
 for(const key of ['lowStim','textScale','motion','tapControls','contrast','theme']) assert.ok(key in DEFAULTS,key);
});
test('shell and publication links resolve to existing files',()=>{
 const page=txt('index.html');
 for(const url of ['#home','#guide','#discussion','#questionnaires','#simplyfocus']) assert.ok(page.includes(`href="${url}"`),url);
 for(const [,source] of page.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"#?]+\.(?:mjs|js|css))"/g)) assert.ok(existsSync(new URL(source,root)),`Missing shell resource ${source}`);
 const router=txt('site.mjs');
 for(const route of ['navigate:','problem:','guide:','learn:','tools:','tool:','play:','account:','messages:','discussion:','simplyfocus:']) assert.ok(router.includes(route),route);
 const manifest=JSON.parse(txt('manifest.webmanifest'));
 for(const entry of manifest.icons) assert.ok(existsSync(new URL(entry.src,root)),entry.src);
});
test('legacy route decoding cannot crash on malformed percent escapes',()=>{
 const router=txt('site.mjs');
 assert.match(router,/const safeRoutePart =/);
 assert.ok(!router.includes('decodeURIComponent(id || "")'));
 for(const route of ['tool:','play:','guided:','profile:','discussion:','messages:','post:']) assert.ok(router.includes(route),route);
});
test('all root ES module imports resolve to local files or approved external modules',()=>{
 for(const f of readdirSync(root,{withFileTypes:true}).filter(f=>f.isFile()&&f.name.endsWith('.mjs'))){
  const source=txt(f.name);
  for(const [,specifier] of source.matchAll(/\b(?:from\s*|import\s*)(?:'|")(\.{1,2}\/[^'"\n]+)(?:'|")/g)){
   assert.ok(existsSync(new URL(specifier,new URL(f.name,root))),`${f.name}: ${specifier}`);
  }
 }
});

function serviceWorkerHarness(){
 const handlers={};
 const data=new Map(); const entries=new Map();
 const CACHE = txt('sw.js').match(/const CACHE\s*=\s*['"]([^'"]+)['"]/)[1];
 const origin='https://nobodyssimple.com';
 let online=true,optionalFailure=false;
 const cachedObject = name => {
  if(!data.has(name)) data.set(name,new Map());
  const records=data.get(name);
  return {
   async add(url){if(optionalFailure && String(url).endsWith('styles.css'))throw Error('optional resource unavailable');records.set(String(url),new Response(`cached: ${url}`,{status:200}));},
   async put(url,response){records.set(String(url),response);},
   async match(url){return records.get(String(url))||undefined}
  };
 };
 const caches={open:async name=>cachedObject(name),keys:async()=>[...data.keys()],delete:async name=>data.delete(name)};
 const self={registration:{scope:`${origin}/`},location:{origin},clients:{claim:async()=>{}},skipWaiting:async()=>{},addEventListener:(n,cb)=>{handlers[n]=cb;}};
 const fetch = async request=>{
  if(!online)throw Error('network disconnected');
  return new Response(`fresh: ${request.url || request}`,{status:200,headers:{'Content-Type':'text/plain'}});
 };
 const context=vm.createContext({self,caches,fetch,URL,Response});
 vm.runInContext(txt('sw.js'),context,{filename:'sw.js'});
 async function run(name,request){let work,response;handlers[name]({request,waitUntil(p){work=p;},respondWith(p){response=p;}});if(response)return await response;if(work)await work;return undefined;}
 return {run,data,cache:CACHE,setOnline:v=>online=v,failOptional:v=>optionalFailure=v,origin};
}

test('offline installation tolerates optional file failures, keeps other app caches, and has fallback',async()=>{
 const h=serviceWorkerHarness();h.failOptional(true);
 h.data.set('another-product-v1',new Map());
 h.data.set('nobodyssimple-v128-stage7-integration',new Map());
 await h.run('install');
 assert.ok(h.data.get(h.cache).has(`${h.origin}/offline.html`));
 await h.run('activate');
 assert.ok(h.data.has('another-product-v1'));
 assert.ok(!h.data.has('nobodyssimple-v128-stage7-integration'));
 h.setOnline(false);
 const response=await h.run('fetch',{url:`${h.origin}/#lab`,method:'GET',mode:'navigate',headers:new Headers()});
 assert.equal(response.status,200);
 assert.match(await response.text(),/offline\.html/);
});
test('public static files recover offline; account URLs and unknown queries never enter cache',async()=>{
 const h=serviceWorkerHarness();await h.run('install');
 const req=(path,method='GET',headers={})=>({url:h.origin+path,method,mode:'cors',headers:new Headers(headers)});
 const asset=req('/ns-life-lab.mjs');
 let r=await h.run('fetch',asset);
 assert.match(await r.text(),/fresh:/);
 // Cache writes live in the fetch event lifetime; allow microtask completion.
 await new Promise(resolve=>setImmediate(resolve));
 h.setOnline(false);r=await h.run('fetch',asset);
 assert.match(await r.text(),/fresh:/);
 assert.equal(await h.run('fetch',req('/users/private.json')),undefined);
 assert.equal(await h.run('fetch',req('/styles.css?token=secret')),undefined);
 assert.equal(await h.run('fetch',req('/ns-life-lab.mjs','GET',{authorization:'bearer test'})),undefined);
 assert.equal(await h.run('fetch',req('/sw.js','POST')),undefined);
});
