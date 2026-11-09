import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
for(const f of readdirSync('.').filter(x=>x.endsWith('.mjs')||x==='sw.js'))execFileSync(process.execPath,['--check',f]);
const html=readFileSync('index.html','utf8');assert.ok(html.includes('account.css'));assert.ok(html.includes('href="#guide"'));assert.ok(html.includes('href="#discussion"'));assert.ok(!html.includes('href="#maps"'));
// Stage 8: account modules are loaded on demand and cache only as public
// static JS/CSS files. They no longer have to be in the install precache.
const sw=readFileSync('sw.js','utf8');
for(const file of ['accounts.mjs','account-config.mjs','account-sync.mjs','account-storage.mjs','account-policy.mjs','account-i18n.mjs','account.css']) assert.ok(existsSync(file),`${file} must exist`);
assert.match(sw,/PUBLIC_EXTENSION/);
assert.match(sw,/request\.headers\.has\('authorization'\)/);
assert.ok(existsSync('offline.html'),'offline fallback is required');
console.log('PASS: JavaScript syntax, account entry points, scoped cache design and the free-plan adapter');
assert.ok(readFileSync('account-free.mjs','utf8').includes('freeAccountCall'));assert.ok(!readFileSync('accounts.mjs','utf8').includes('httpsCallable'));
