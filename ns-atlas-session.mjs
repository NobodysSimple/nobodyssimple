/* Transient, non-persistent navigation state. No sensitive selections are saved. */
let current=null;
export function writeAtlasSession(session){current=session?{...session}:null;}
export function readAtlasSession(id){return current?.id===id?current:null;}
export function clearAtlasSession(){current=null;}
