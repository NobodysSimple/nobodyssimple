import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
for(const f of readdirSync('.').filter(x=>x.endsWith('.mjs')||x==='sw.js'))execFileSync(process.execPath,['--check',f]);
const html=readFileSync('index.html','utf8');assert.ok(html.includes('account.css'));assert.ok(html.includes('href="#account"'));assert.ok(!html.includes('href="#maps"'));
const sw=readFileSync('sw.js','utf8');for(const file of ['accounts.mjs','account-config.mjs','account-sync.mjs','account-storage.mjs','account-policy.mjs','account-i18n.mjs','account.css'])assert.ok(sw.includes('"'+file+'"')&&existsSync(file));
console.log('PASS: JavaScript syntax, account entry points, cache assets and the free-plan adapter');
assert.ok(readFileSync('account-free.mjs','utf8').includes('freeAccountCall'));assert.ok(!readFileSync('accounts.mjs','utf8').includes('httpsCallable'));
