import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {nicknamePolicy,canRename,COOLDOWN_MS,cleanSettings,safeProfile,shouldConflict,withinSize,SAVED} from '../../account-policy.mjs';
import {Workspace} from '../../account-storage.mjs';
test('brand, staff, profanity and common obfuscation rejected; ordinary names pass',()=>{
 for(const name of ['Nobodyssimple','nobody_s_simple','N0bodyssimple','admin123','OfficialDrew','f_u_c_k','fuCKyou','sh1thead','f4ggot','nіckname','bad<script>']) assert.throws(()=>nicknamePolicy(name),undefined,name);
 for(const name of ['Drew','Thoughtful Fox','Scunthorpe','Classical','Sunshine_24'])assert.ok(nicknamePolicy(name).handle);
 assert.equal(nicknamePolicy('Thoughtful_Fox').handle,nicknamePolicy('thoughtful-fox').handle);
});
test('14 day cooldown boundary and safe profile/settings',()=>{
 const now=Date.now();assert.ok(canRename(null,now));assert.ok(!canRename(now-COOLDOWN_MS+1,now));assert.ok(canRename(now-COOLDOWN_MS,now));
 const s=cleanSettings({theme:'bogus',language:'es',textScale:1000,sound:'true',sensitiveLock:true});assert.equal(s.theme,'system');assert.equal(s.language,'es');assert.equal(s.textScale,100);assert.equal(s.sound,false);assert.equal(s.sensitiveLock,true);
 assert.throws(()=>safeProfile({bio:'https://spam.test'}));assert.equal(safeProfile({avatarId:'../../secret'}).avatarId,'base');assert.equal(safeProfile({avatarData:'data:image/svg+xml;base64,x'}).avatarData,'');
 assert.ok(shouldConflict(1,2));assert.ok(!shouldConflict(0,undefined));assert.ok(withinSize('x'.repeat(800000)));assert.ok(!withinSize('😀'.repeat(200001)));
});
class Store{constructor(){this.data=new Map();}getItem(k){return this.data.get(k)??null;}setItem(k,v){this.data.set(k,String(v));}removeItem(k){this.data.delete(k);}clear(){this.data.clear();}key(i){return [...this.data.keys()][i]??null;}get length(){return this.data.size;}}
test('guest/A/B work isolated; shared mode transient; lock blocks local reads and writes',()=>{
 const storage=new Store(),session=new Store(),key=Object.keys(SAVED)[0];storage.setItem(key,'guest');
 const ws=new Workspace(storage,session);ws.install();assert.equal(storage.getItem(key),'guest');
 ws.scope('A');assert.equal(storage.getItem(key),null);storage.setItem(key,'A work');ws.scope('B');assert.equal(storage.getItem(key),null);storage.setItem(key,'B work');
 ws.scope('A');assert.equal(storage.getItem(key),'A work');ws.locked=true;assert.equal(storage.getItem(key),null);assert.throws(()=>storage.setItem(key,'overwrite'));
 ws.scope('C',true);storage.setItem(key,'session only');assert.ok(![...storage.data.values()].includes('session only'));assert.equal(storage.getItem(key),'session only');
 ws.scope(null);assert.equal(storage.getItem(key),'guest');ws.clearUser('A');ws.scope('A');assert.equal(storage.getItem(key),null);ws.scope('B');assert.equal(storage.getItem(key),'B work');
});
