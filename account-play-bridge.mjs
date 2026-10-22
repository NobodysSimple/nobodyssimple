// Embedded playground reuses the parent's authenticated workspace without a second login.
import {SAVED} from './account-policy.mjs';
if(window.parent!==window){
  try{
    if(window.parent.location.origin===location.origin&&window.parent.nsAccountStorage){
      const bridge=window.parent.nsAccountStorage,proto=Storage.prototype;
      const get=proto.getItem,set=proto.setItem,remove=proto.removeItem;
      proto.getItem=function(key){return this===localStorage&&SAVED[key]?bridge.get(key):get.call(this,key);};
      proto.setItem=function(key,value){return this===localStorage&&SAVED[key]?bridge.set(key,value):set.call(this,key,value);};
      proto.removeItem=function(key){return this===localStorage&&SAVED[key]?bridge.remove(key):remove.call(this,key);};
      window.nsPlayPreferences=window.parent.nsAccountPreferences;
    }
  }catch{}
}
window.addEventListener('message',event=>{
  if(event.origin!==location.origin||event.source!==parent||event.data?.type!=='ns:preferences')return;
  window.nsPlayPreferences=event.data.prefs;
  window.dispatchEvent(new CustomEvent('ns:play-preferences',{detail:event.data.prefs}));
});
