/**
 * Nobody's Simple · course-only Learn hub.
 *
 * The previous interactive demonstrations, game worlds, shelves, debates,
 * writing entry and 2026/27 curriculum are deliberately not mounted here.
 * These are illustrations of potential course subjects, NOT published lessons.
 * No completion counts, points or course availability are invented.
 * Each scene is artwork without a mascot; each card adds one separate subject
 * illustration only. Existing scenic-only compositions remain unchanged.
 */
export const LEARN_COURSE_IDEAS=Object.freeze([
  {id:'self-trust',title:'Self-Trust',description:'Practise making decisions and giving your judgement a fair chance.',landscape:'ns-landscape-sunset.webp',mascot:'ns-character-meditate.webp',tone:'peach'},
  {id:'overthinking',title:'Overthinking',description:'Understand the thinking loops that leave you feeling stuck.',landscape:'ns-landscape-clouds.webp',mascot:'ns-character-thinking.webp',tone:'blue'},
  {id:'emotions',title:'Emotions',description:'Make sense of feelings without forcing a perfect explanation.',landscape:'learn-art/scenery-emotions.svg',mascot:'ns-character-helping.webp',tone:'gold'},
  {id:'relationships',title:'Relationships',description:'Understand connection, communication and the patterns between people.',landscape:'learn-art/scenery-relationships.svg',mascot:'ns-character-friends.webp',tone:'sage'},
  {id:'boundaries',title:'Boundaries',description:'Explore limits that respect your needs and other people.',landscape:'learn-art/scenery-boundaries.svg',mascot:'ns-character-shield.webp',tone:'sage'},
  {id:'confidence',title:'Confidence',description:'Build a steadier relationship with mistakes and uncertainty.',landscape:'ns-landscape-mountains.webp',mascot:'ns-character-hiking.webp',tone:'sky'},
  {id:'habits',title:'Habits',description:'Make useful behaviours easier to repeat without relying on willpower alone.',landscape:'ns-landscape-calm.webp',mascot:'ns-character-checklist.webp',tone:'gold'},
  {id:'uncertainty',title:'Uncertainty',description:'Find room to move when the future cannot be guaranteed.',landscape:'ns-landscape-path.webp',mascot:'ns-character-sitting.webp',tone:'sky'},
  {id:'focus',title:'Focus',description:'Work with your attention, energy and environment.',landscape:'learn-art/scenery-focus.svg',mascot:'ns-character-writing.webp',tone:'sage'},
  {id:'communication',title:'Communication',description:'Learn to say what matters and listen for what is meant.',landscape:'learn-art/scenery-communication.svg',mascot:'ns-character-message.webp',tone:'peach'}
].map(course=>Object.freeze({...course,status:'planned'})));

function image(source,cls='',extra=''){
 return `<img src="${source}" class="${cls}" alt="" loading="lazy" decoding="async" ${extra}>`;
}
function courseCard(course,index){
 return `<article class="ns-course-card" data-course-subject="${course.id}" data-course-status="planned" data-course-tone="${course.tone}" aria-labelledby="ns-course-name-${index}">
   <div class="ns-course-card__art" aria-hidden="true">
    ${image(course.landscape,'ns-course-card__landscape')}
    <span class="ns-course-card__glow"></span>
    ${image(course.mascot,'ns-course-card__character')}
    <span class="ns-course-card__flourish">✳</span>
   </div>
   <div class="ns-course-card__nameplate">
     <h3 id="ns-course-name-${index}">${course.title}</h3>
     <span class="ns-course-card__status">In development</span>
   </div>
   <p class="ns-course-card__description">${course.description}</p>
 </article>`;
}
/** Public #learn and #learn/courses share this page, without any old paths. */
export function renderCourseHub(root,{focusCourses=false}={}){
 root.innerHTML=`<div class="ns-courses-hub" data-ns-courses-hub>
  <section class="ns-courses-hero" aria-labelledby="ns-courses-title">
   <div class="ns-courses-hero__hills" aria-hidden="true"></div>
   <div class="ns-courses-hero__branches" aria-hidden="true"></div>
   <div class="ns-courses-hero__note">
     <span class="ns-courses-washi" aria-hidden="true"></span>
     <p class="ns-courses-kicker">LEARN · GROW · EVERYDAY SKILLS</p>
     <h1 id="ns-courses-title">Learn<span class="ns-courses-sparkle" aria-hidden="true">✳</span></h1>
     <p>Practical psychology and life skills for a calmer, kinder, more intentional life.</p>
     <a class="ns-courses-button" href="#learn/courses"><span class="ns-courses-book" aria-hidden="true">▤</span> Browse courses <span aria-hidden="true">→</span></a>
   </div>
   <div class="ns-courses-hero__figure" aria-hidden="true">
     <div class="ns-courses-picnic"></div>
     ${image('ns-character-reading.webp','ns-courses-hero__mascot','fetchpriority="high"')}
   </div>
  </section>

  <div class="ns-courses-inner">
   <section class="ns-courses-feature" aria-labelledby="ns-courses-featured-title">
     <span class="ns-courses-feature__label">FEATURED COURSE IDEA</span>
     <div class="ns-courses-feature__visual" aria-hidden="true">
       ${image('learn-art/scenery-featured.svg','ns-courses-feature__scene')}
       ${image('ns-character-plant.webp','ns-courses-feature__character')}
     </div>
     <div class="ns-courses-feature__copy">
       <span class="ns-courses-feature__category">A FUTURE COURSE · SELF-TRUST</span>
       <h2 id="ns-courses-featured-title">Build Self-Trust</h2>
       <p>Learning to trust yourself isn't about always being right. It's about making thoughtful choices without needing certainty first.</p>
       <p class="ns-courses-feature__availability"><span aria-hidden="true">✿</span> In development — no lessons published yet</p>
       <a class="ns-courses-feature__link" href="#learn/courses">Explore course ideas <span aria-hidden="true">→</span></a>
     </div>
     <div class="ns-courses-feature__postmark" aria-hidden="true">✳</div>
   </section>

   <section class="ns-courses-section" id="ns-course-catalogue" aria-labelledby="ns-course-catalogue-title">
     <div class="ns-courses-section__head">
       <div class="ns-courses-section__heading">
         <h2 id="ns-course-catalogue-title">Courses</h2>
         <p>Ideas for practical, thoughtful courses about the things that matter in everyday life.</p>
       </div>
       <div class="ns-courses-section__tiny-art" aria-hidden="true">✿ ────── ✿</div>
     </div>
     <p class="ns-courses-availability" role="status">Our courses are being developed. These are proposed subjects, not lessons you can start yet.</p>
     <div class="ns-courses-grid">${LEARN_COURSE_IDEAS.map(courseCard).join('')}</div>
   </section>

   <footer class="ns-courses-ending">
     ${image('ns-character-hiking.webp','ns-courses-ending__character')}
     <div class="ns-courses-ending__copy">
       <span class="ns-courses-kicker">THE NEXT CHAPTER</span>
       <h2>Learning at your own pace.</h2>
       <p>This is where our future courses will live. Nothing to complete or keep up with for now.</p>
     </div>
     <a class="ns-courses-ending__link" href="#learn">Back to the beginning <span aria-hidden="true">↑</span></a>
   </footer>
  </div>
 </div>`;
 if(focusCourses)requestAnimationFrame(()=>{
  const section=root.querySelector('#ns-course-catalogue');
  if(section?.isConnected){
   section.scrollIntoView({behavior:'instant',block:'start'});
   const heading=section.querySelector('h2');
   heading?.setAttribute('tabindex','-1');
   heading?.focus({preventScroll:true});
  }
 });
}
