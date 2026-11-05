// Stage 0 only. Read current source; write reproducible audit evidence, never app data.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const require=createRequire((process.env.AUDIT_MODULES||process.cwd()+'/node_modules')+'/package.json');
const {parse}=require('acorn'),postcss=require('postcss');
const root=process.cwd(),out='docs/redesign';
const files=execFileSync('git',['ls-tree','-r','--name-only','a05d5b656a539360345c470b723776970adfe2ff'],{encoding:'utf8'}).trim().split('\n');
const sources=new Map(),asts=new Map(),imports=[],storageCalls=[],keys=new Map(),declarations=[],css=[];
const read=f=>fs.readFileSync(f,'utf8');
const walk=(node,fn,parent=null)=>{if(!node||typeof node!=='object')return;if(node.type)fn(node,parent);for(const [k,v] of Object.entries(node)){if(k==='loc')continue;if(Array.isArray(v))v.forEach(x=>walk(x,fn,node));else if(v&&typeof v==='object')walk(v,fn,node);}};
const keyAdd=(key,file,line,kind)=>{if(!keys.has(key))keys.set(key,[]);keys.get(key).push({file,line,kind});};
for(const f of files.filter(f=>/\.(mjs|js)$/.test(f))){
 const s=read(f),ast=parse(s,{sourceType:'module',ecmaVersion:'latest',locations:true});sources.set(f,s);asts.set(f,ast);
 walk(ast,(n,p)=>{
  if(['ImportDeclaration','ImportExpression','ExportNamedDeclaration','ExportAllDeclaration'].includes(n.type)&&n.source){
   const spec=n.source?.value;if(typeof spec==='string')imports.push({from:f,to:spec.startsWith('.')?path.posix.normalize(path.posix.join(path.posix.dirname(f),spec)):spec,line:n.loc.start.line,dynamic:n.type==='ImportExpression',external:!spec.startsWith('.')});
  }
  if(n.type==='FunctionDeclaration'||n.type==='VariableDeclarator'){
   if(n.id?.name)declarations.push({file:f,name:n.id.name,line:n.loc.start.line,type:n.type});
  }
  if(n.type==='Literal'&&typeof n.value==='string'&&/^(ns-|nobodys-simple-)/.test(n.value)&&!/[\s<>]/.test(n.value)&&(/-v\d|ns-reflection$|ns-site-/.test(n.value)||/key|storage/i.test(p?.id?.name||'')))keyAdd(n.value,f,n.loc.start.line,'literal');
  if(n.type==='TemplateLiteral'&&/^(ns-|nobodys-simple-)/.test(n.quasis[0]?.value.cooked||'')&&n.quasis.some(q=>/v\d:/.test(q.value.cooked||'')))keyAdd(s.slice(n.start,n.end),f,n.loc.start.line,'dynamic template');
  if(n.type==='CallExpression'&&n.callee.type==='MemberExpression'&&['getItem','setItem','removeItem'].includes(n.callee.property.name)&&n.arguments[0]?.type==='Literal'&&typeof n.arguments[0].value==='string'&&!keys.has(n.arguments[0].value))keyAdd(n.arguments[0].value,f,n.loc.start.line,'direct storage argument');
  if(n.type==='CallExpression'&&n.callee.type==='MemberExpression'&&['getItem','setItem','removeItem','clear'].includes(n.callee.property.name))storageCalls.push({file:f,line:n.loc.start.line,call:s.slice(n.start,n.end).slice(0,230)});
 });
}
for(const f of files.filter(f=>f.endsWith('.css'))){
 const s=read(f),tree=postcss.parse(s,{from:f}),rules=[],counts={rules:0,important:0,media:0};
 tree.walkDecls(d=>{if(d.important)counts.important++;});tree.walkAtRules('media',()=>counts.media++);
 tree.walkRules(r=>{counts.rules++;if(/app-bottom-nav|choice-tile|learn-door-card|wisbody-layout|focus-task|:root|data-theme|data-low-stim/.test(r.selector))rules.push({selector:r.selector,line:r.source.start.line,context:r.parent.type==='atrule'?r.parent.params:'root',declarations:r.nodes.filter(x=>x.type==='decl').map(d=>`${d.prop}:${d.value}${d.important?' !important':''}`)});});
 css.push({file:f,bytes:Buffer.byteLength(s),...counts,rulesOfInterest:rules});
}
const {tools,toolGroups,situations,situationSubparts}=await import('../../../tool-catalog.mjs');
const {targetedTools}=await import('../../../targeted-tools.mjs');
const {interactiveTools,interactiveHrefFor}=await import('../../../interactive-tools.mjs');
await import('../../../features.mjs'); // Applies the actual display-name aliases.
const {SAVED,DEFAULTS,CATEGORIES}=await import('../../../account-policy.mjs');
const {curriculum,emotions,questions}=await import('../../../data.mjs');
const {crashCourseTopics,crashEmergencyTopics}=await import('../../../crash-topics.mjs');
const {quoteDeckExtended}=await import('../../../quote-content.mjs');
function literalVar(file,name){let found;walk(asts.get(file),(n)=>{if(n.type==='VariableDeclarator'&&n.id.name===name)found=n.init;});if(!found)return null;return vm.runInNewContext(sources.get(file).slice(found.start,found.end));}
const custom={ 'body-check':'renderBodyCheck','state-check':'renderStateCheck','mixed-feelings':'renderMixedFeelings','emotion-timeline':'renderEmotionTimeline','grounding':'renderPresentOrientation','quick-reset':'renderQuickSensoryReset','emotion-check-in':'renderCloserFeelingsCheckIn','sensory-profile':'renderSensoryProfile','sensory-recipe':'sensory-recipe.mjs','social-battery':'social-battery.mjs','load-balancer':'load-balancer.mjs','masking-map':'masking-map.mjs','cbt-journal':'renderCbtJournal','brain-dump':'renderBrainDump','thought-map':'renderThoughtMap','reality-map':'renderRealityMap'};
const specialKeys={ 'sensory-recipe':['ns-sensory-recipes-v3'],'social-battery':['ns-social-battery-v3'],'load-balancer':['ns-load-balancer-v2'],'masking-map':['ns-masking-map-v2']};
const toolInventory=[...tools.filter(t=>t.id!=='maps').map(t=>({id:t.id,title:t.title,route:t.href||'#tool/'+t.id,group:t.group,source:targetedTools.some(x=>x.id===t.id)?'targeted-tools.mjs':'tool-catalog.mjs',renderer:custom[t.id]||'features.mjs: generic renderer',kind:t.kind||'reflection',purpose:t.short,fields:(t.fields||[]).map(x=>({id:x.id,type:x.type,label:x.label})),storageKeys:['ns-personal-maps-v1','ns-account-tool-drafts-v2',...(specialKeys[t.id]||[])],storageNote:'Explicit maps and account draft wrapper; dedicated key listed where applicable. Opening tested separately; per-tool completion not implied.'})),...interactiveTools.map(t=>({id:t.id,title:t.title,route:interactiveHrefFor(t),group:t.group,source:'interactive-tools.mjs',renderer:'renderInteractiveTool / '+t.mode,kind:t.mode,purpose:t.short,storageKeys:['ns-account-tool-drafts-v2'],storageNote:'Generic DOM draft wrapper applies to #play; persistence of canvas/derived state requires dedicated verification.'}))];
let routeMap;walk(asts.get('site.mjs'),n=>{if(n.type==='ObjectExpression'&&n.properties.some(p=>p.key?.name==='home')&&n.properties.some(p=>p.key?.name==='guided'))routeMap=n;});
const routes=routeMap.properties.map(p=>({name:p.key.name||p.key.value,handler:sources.get('site.mjs').slice(p.value.start,p.value.end),line:p.loc.start.line}));
const posts=JSON.parse(read('content.json')).posts;
const activeEntries=['accounts.mjs','site.mjs','app-design.mjs'];const reachable=new Set(activeEntries);let changed=true;while(changed){changed=false;for(const i of imports)if(reachable.has(i.from)&&!i.external&&!reachable.has(i.to)){reachable.add(i.to);changed=true;}}
const shell=literalVar('sw.js','SHELL');
const uncached=[...reachable].filter(f=>!shell.includes(f));
const rules=read('firestore.rules');
const knownKeys=[...rules.match(/function knownKey\(item\)\{return item in \[([^\]]+)\]/)[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
const fileManifest=files.map(f=>{const b=fs.readFileSync(f);return {file:f,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex'),review:/\.(mjs|js|css)$/.test(f)?'Parsed in full by static audit':/\.(json|html|webmanifest|rules|md|yml)$/.test(f)?'Text source indexed; selected manual review':'Asset metadata indexed; selected visual review'};});
const result={baseline:'a05d5b656a539360345c470b723776970adfe2ff',files:fileManifest,imports,activeEntryReachability:[...reachable],declarations,css,storageCalls,storageKeys:[...keys].map(([key,refs])=>({key,registered:!!SAVED[key],refs})),savedRegistry:SAVED,firestoreKnownKeys:knownKeys,preferences:DEFAULTS,categories:CATEGORIES,routes,tools:toolInventory,retiredToolIds:literalVar('tool-catalog.mjs','retiredToolIds')?[...literalVar('tool-catalog.mjs','retiredToolIds')]:[],retiredInteractiveIds:[...literalVar('interactive-tools.mjs','retiredInteractiveToolIds')],lifeSystems:literalVar('life-navigation.mjs','SYSTEMS').map(s=>({id:s.id,title:s.title,route:'#guided/'+s.id,questionCount:s.questions?.length})),content:{posts:posts.map(p=>({id:p.id,title:p.title,type:p.type,status:p.status,destinations:p.destinations,modules:p.modules,weeks:p.weeks})),curriculum,crashCourseTopics,crashEmergencyTopics,wisbodyCount:quoteDeckExtended.length,emotionCount:emotions.length,questionCount:questions.length},situations,situationSubparts,serviceWorker:{shell,bytes:shell.reduce((n,f)=>n+(fs.existsSync(f)&&fs.statSync(f).isFile()?fs.statSync(f).size:0),0),missingFiles:shell.filter(f=>!fs.existsSync(f)),uncachedReachableModules:uncached}};
fs.mkdirSync(out,{recursive:true});fs.writeFileSync(out+'/inventory.json',JSON.stringify(result,null,2)+'\n');
const csv=(rows,columns)=>[columns.join(','),...rows.map(r=>columns.map(c=>'"'+String(typeof r[c]==='object'?JSON.stringify(r[c]):r[c]??'').replaceAll('"','""')+'"').join(','))].join('\n')+'\n';
fs.writeFileSync(out+'/tools.csv',csv(toolInventory,['id','title','route','group','source','renderer','kind','storageKeys','purpose']));
fs.writeFileSync(out+'/storage.csv',csv(result.storageKeys,['key','registered','refs']));
console.log(JSON.stringify({files:files.length,parsedJavaScriptFiles:asts.size,tools:toolInventory.length,writtenRegistryIncludingMaps:tools.length,interactive:interactiveTools.length,targeted:targetedTools.length,routes:routes.length,systems:result.lifeSystems.length,storageKeyPatterns:keys.size,savedKeys:Object.keys(SAVED).length,prefs:Object.keys(DEFAULTS).length,posts:result.content.posts,planned:crashCourseTopics.length,curriculumModules:curriculum.modules.length,weeks:curriculum.weeks.length,sw:result.serviceWorker,css:css.map(({rulesOfInterest,...rest})=>rest)},null,2));
