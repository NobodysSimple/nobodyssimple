/**
 * Nobody's Simple — Stage 7: connect existing experiences without replacing their renderers.
 * Pure route plans + a small enhancement layer. No account reads/writes, API calls,
 * synthetic progress, questionnaire scoring, or event-handler replacements.
 */
const PLAN = Object.freeze({
  simplyfocus: {
    title:'Find a different kind of reset',
    description:'Sound is just one option. These activities are available independently.',
    links:[['Sensory Reset','#tool/quick-reset'],['Stim Space','#stim-space'],['Calm & sensory tools','#tools/calm']]
  },
  'stim-space': {
    title:'Choose your own sensory experience',
    description:'Explore a quieter activity or adjust your display preferences whenever you want.',
    links:[['SimplyFocus','#simplyfocus'],['Calm & sensory tools','#tools/calm'],['Accessibility preferences','#account/appearance']]
  },
  questionnaires: {
    title:'Keep exploring, without a label',
    description:'Questionnaire results offer one perspective, not a diagnosis or a fixed description of you.',
    links:[['Self-understanding tools','#tools/identity'],['My Field Guide','#guide'],['Browse Learn','#learn']]
  },
  'big-five': {
    title:'Understanding is an ongoing process',
    description:'You can revisit the questionnaire or explore your values and experiences separately.',
    links:[['All questionnaires','#questionnaires'],['Values Discovery','#tool/values-discovery'],['My Field Guide','#guide']]
  },
  systems: {
    title:'More than a questionnaire',
    description:'These optional tools can help explore contexts and situations in more detail.',
    links:[['All questionnaires','#questionnaires'],['Pattern Map','#tool/pattern-map'],['My Field Guide','#guide']]
  },
  personality: {
    title:'One perspective, not the whole person',
    description:'Other activities remain available independently of any questionnaire results.',
    links:[['All questionnaires','#questionnaires'],['Identity Map','#tool/identity-map'],['My Field Guide','#guide']]
  },
  wisbody: {
    title:'Take a thought further',
    description:'A quote can prompt reflection; it does not have to provide an answer.',
    links:[['Explore Learn','#learn'],['My Field Guide','#guide'],['All tools','#tools']]
  },
  discussion: {
    title:'Your community, your pace',
    description:'You can adjust your community settings or step away at any point.',
    links:[['Community & privacy settings','#account/community'],['Your space','#account'],['Get help','#support']]
  },
  messages: {
    title:'Stay in control of contact',
    description:'Manage privacy and blocked accounts through Your space.',
    links:[['Community & privacy settings','#account/community'],['Discussion board','#discussion'],['Your space','#account']]
  },
  'discussion-moderation': {
    title:'Community safety tools',
    description:'Moderation and reporting remain part of the existing community system.',
    links:[['Discussion board','#discussion'],['Community settings','#account/community']]
  },
  tool: {
    title:'Continue at your own pace',
    description:'This activity remains available on its own. There is no required next step.',
    links:[['Browse all tools','#tools'],['Practise in Life Lab','#lab'],['Your Field Guide','#guide']]
  },
  play: {
    title:'Explore another approach',
    description:'You can move between activities without completing a course.',
    links:[['All tools','#tools'],['Life Lab','#lab'],['Your space','#account']]
  },
  guided: {
    title:'Decide what fits next',
    description:'Keep using the guided system or open an independent activity.',
    links:[['All tools','#tools'],['Help Me Choose','#navigate'],['My Field Guide','#guide']]
  }
});

export function integrationPlan(route){return PLAN[String(route||'').toLowerCase()]||null;}
export const integrationRoutes=Object.freeze(Object.keys(PLAN));

const ns7Escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function buildRelated(plan){
  const section=document.createElement('aside');
  section.className='ns-integration7-related';
  section.setAttribute('aria-label','Optional next steps');
  section.innerHTML=`<div class="ns-integration7-related__intro"><span class="ns-integration7-overline">WHEN YOU'RE READY</span><h2>${ns7Escape(plan.title)}</h2><p>${ns7Escape(plan.description)}</p></div><nav class="ns-integration7-related__links" aria-label="More things to explore">${plan.links.map(([name,href])=>`<a href="${ns7Escape(href)}"><span>${ns7Escape(name)}</span><span aria-hidden="true">→</span></a>`).join('')}</nav>`;
  return section;
}
function decorate(){
  const main=document.querySelector('#main');if(!main)return;
  const route=(location.hash.slice(1).split('/')[0]||'home').toLowerCase();
  // Expose the route to stylesheet rules; never relabel the rendered content.
  main.dataset.nsIntegrationRoute=route;
  const plan=integrationPlan(route);
  if(!plan)return;
  const root=main.querySelector(':scope > .wrap, :scope > .account-hub');
  if(!root||root.classList.contains('questionnaire-load-error')||root.querySelector(':scope > .ns-integration7-related'))return;
  // Don't add optional study links in the middle of a questionnaire, or to
  // private content while the account lock warning is shown.
  if(root.querySelector('.bf-question-panel, .systems-question, .pf-question-card')||root.textContent?.includes('Your saved work is locked'))return;
  root.append(buildRelated(plan));
}
let frame=0;
function schedule(){
  if(frame)return;
  frame=requestAnimationFrame(()=>{frame=0;decorate();});
}
function init(){
  const main=document.querySelector('#main');if(!main)return;
  schedule();
  window.addEventListener('hashchange',schedule);
  // Existing community and questionnaire renderers update asynchronously or
  // replace the page body. Reattach only after a direct root replacement.
  const observer=new MutationObserver(records=>{
    const structural=records.some(record=>record.type==='childList' &&
      (record.target===main || Array.from(record.removedNodes).some(node=>node.nodeType===1 && node.matches?.('.wrap,.account-hub'))));
    if(structural)schedule();
  });
  observer.observe(main,{childList:true});
}
if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
}
