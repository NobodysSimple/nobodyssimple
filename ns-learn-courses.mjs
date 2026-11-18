/**
 * Nobody's Simple · Learn v2 illustrated catalogue.
 * Preserve original landscape + character art composition, course-card shape,
 * hero scenery and featured visual. No invented lessons or progress.
 * Future learning material ships only through reviewed published bundles.
 */
import {LEARN_COURSES,COURSE_CATEGORIES,LESSON_FORMATS,getLearnCourse,filterLearnCourses} from './ns-learn-catalog-v2.mjs';
import {publishedLearnBundle,renderLearnLesson} from './ns-learn-player-v2.mjs';
import {readLearnProgress,learnCourseProgress,dueLearnReviews} from './ns-learn-progress-v2.mjs';
import {getLearnIndex,hasPublishedLearnCourse,loadPublishedLearnIndex,loadPublishedLearnBundle} from './ns-learn-content-v2.mjs';
export const LEARN_COURSE_IDEAS=LEARN_COURSES;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const image=(src,cls='',extra='')=>'<img src="'+esc(src)+'" class="'+esc(cls)+'" alt="" loading="lazy" decoding="async" '+extra+'>';
const courseHref=id=>'#learn/course/'+encodeURIComponent(id);
let rememberedQuery='';
function courseArt(course){
 return '<div class="ns-course-card__art" aria-hidden="true">'+image(course.landscape,'ns-course-card__landscape')+
 '<span class="ns-course-card__glow"></span>'+(course.companionPortrait
 ?image(course.mascot,'ns-course-card__character ns-course-card__individual')
 :'<span class="ns-course-card__character ns-course-card__companion" style="--cast-x:'+Number(course.companionX)+'%;--cast-y:'+Number(course.companionY)+'%"></span>')+
 '<span class="ns-course-card__flourish">✳</span></div>';
}
function card(course,index){
 const bundle=publishedLearnBundle(course.id),cat=COURSE_CATEGORIES.find(c=>c.id===course.category);
 const status=bundle||hasPublishedLearnCourse(course.id)?'Lessons available':'In development';
 return '<a class="ns-course-card" href="'+courseHref(course.id)+'" data-course-subject="'+esc(course.id)+'" data-course-status="'+(bundle||hasPublishedLearnCourse(course.id)?'published':'planned')+'" data-course-tone="'+esc(course.tone)+'" aria-labelledby="ns-course-name-'+index+'">'+
 courseArt(course)+'<div class="ns-course-card__nameplate"><h3 id="ns-course-name-'+index+'">'+esc(course.cardTitle||course.title)+'</h3>'+
 '<span class="ns-course-card__status">'+esc(status)+'</span></div>'+
 '<small class="ns-course-card__category">'+esc(cat?.title||'Psychology')+'</small>'+
 '<p class="ns-course-card__description">'+esc(course.description)+'</p>'+
 '<span class="ns-course-card__tutor">✿ Meet '+esc(course.companionName)+'</span>'+
 '<span class="ns-course-card__arrow" aria-hidden="true">Explore course →</span></a>';
}
function sectionHead(title,description){
 return '<div class="ns-courses-section__head"><div class="ns-courses-section__heading"><h2>'+esc(title)+'</h2>'+
 '<p>'+esc(description)+'</p></div><div class="ns-courses-section__tiny-art" aria-hidden="true">✿ ────── ✿</div></div>';
}
function catalogue(root,{category='all',focusCourses=false}={}){
 const current=COURSE_CATEGORIES.some(c=>c.id===category)?category:'all';
 root.innerHTML='<div class="ns-courses-hub" data-ns-courses-hub>'+
 '<section class="ns-courses-hero" aria-labelledby="ns-courses-title">'+
 '<div class="ns-courses-hero__hills" aria-hidden="true"></div><div class="ns-courses-hero__branches" aria-hidden="true"></div>'+
 '<div class="ns-courses-hero__note"><span class="ns-courses-washi" aria-hidden="true"></span>'+
 '<p class="ns-courses-kicker">NOBODY’S SIMPLE · LEARN</p>'+
 '<h1 id="ns-courses-title">Learn<span class="ns-courses-sparkle" aria-hidden="true">✳</span></h1>'+
 '<p>Learn to think psychologically. Small lessons, deeper understanding, useful distinctions.</p>'+
 '<a class="ns-courses-button" href="#learn/courses"><span class="ns-courses-book" aria-hidden="true">▤</span> Explore courses <span aria-hidden="true">→</span></a></div>'+
 '<div class="ns-courses-hero__figure" aria-hidden="true"><div class="ns-courses-picnic"></div>'+
 image('ns-character-reading.webp','ns-courses-hero__mascot','fetchpriority="high"')+'</div></section>'+
 '<div class="ns-courses-inner">'+
 '<section class="ns-courses-feature" aria-labelledby="ns-courses-featured-title">'+
 '<span class="ns-courses-feature__label">LEARN PSYCHOLOGY DIFFERENTLY</span>'+
 '<div class="ns-courses-feature__visual" aria-hidden="true">'+image('learn-art/scenery-featured.svg','ns-courses-feature__scene')+
 image('ns-character-plant.webp','ns-courses-feature__character')+'</div>'+
 '<div class="ns-courses-feature__copy"><span class="ns-courses-feature__category">THE LEARNING JOURNEY</span>'+
 '<h2 id="ns-courses-featured-title">Beyond the obvious.</h2>'+
 '<p>Start with the subjects you care about. Discover the science behind them, practise subtle distinctions and build up to more sophisticated reasoning. Each course will have its own clear beginning and progression.</p>'+
 '<p class="ns-courses-feature__availability"><span aria-hidden="true">✿</span> Our lessons are in development</p>'+
 '<a class="ns-courses-feature__link" href="#learn/how-it-works">How learning will work <span aria-hidden="true">→</span></a></div>'+
 '<div class="ns-courses-feature__postmark" aria-hidden="true">✳</div></section>'+
 '<section class="ns-courses-section" id="ns-course-catalogue" aria-labelledby="ns-course-catalogue-title">'+
 sectionHead('Discover courses','Choose anything that interests you. Courses are independent—there is no compulsory giant syllabus.')+
 '<p class="ns-courses-availability" role="status">All '+LEARN_COURSES.length+' course outlines are available to explore. No course lessons have been published yet.</p>'+
 '<div class="ns-catalogue-controls"><label class="ns-catalogue-search" for="ns-course-search"><span>Find a course</span>'+
 '<input id="ns-course-search" type="search" maxlength="90" autocomplete="off" placeholder="Try narcissism, rumination, ADHD, scams…" value="'+esc(rememberedQuery)+'"></label>'+
 '<nav class="ns-catalogue-filters" aria-label="Filter courses by category">'+
 COURSE_CATEGORIES.map(c=>'<a href="'+(c.id==='all'?'#learn/courses':'#learn/category/'+esc(c.id))+'" class="ns-catalogue-filter"'+(current===c.id?' aria-current="page"':'')+'>'+esc(c.title)+'</a>').join('')+'</nav></div>'+
 '<div class="ns-catalogue-count" role="status" aria-live="polite" data-catalogue-count></div>'+
 '<div class="ns-courses-grid" data-course-results></div>'+
 '<p class="ns-catalogue-empty" data-empty hidden>No courses match that search. Try another word or choose All courses.</p>'+
 '</section>'+
 '<section class="ns-catalogue-learning" aria-labelledby="ns-catalogue-method-title">'+
 '<div><span class="ns-courses-kicker">WHAT MAKES LEARN DIFFERENT</span><h2 id="ns-catalogue-method-title">Short to play. Deep to understand.</h2>'+
 '<p>Ten ways to practise psychological thinking, from recognising specialist concepts to testing evidence and helping characters.</p>'+
 '<a href="#learn/how-it-works">Explore the learning method →</a></div>'+
 '<div class="ns-catalogue-method-list">'+LESSON_FORMATS.map((f,i)=>'<span><b>'+String(i+1).padStart(2,'0')+'</b> '+esc(f.name)+'</span>').join('')+'</div></section>'+
 '<footer class="ns-courses-ending">'+image('ns-character-hiking.webp','ns-courses-ending__character')+
 '<div class="ns-courses-ending__copy"><span class="ns-courses-kicker">LEARN AT YOUR OWN PACE</span>'+
 '<h2>Start with what interests you.</h2><p>Each course will be a self-contained journey, with optional reviews that connect ideas across psychology.</p></div></footer>'+
 '</div></div>';
 const input=root.querySelector('#ns-course-search'),grid=root.querySelector('[data-course-results]'),count=root.querySelector('[data-catalogue-count]'),empty=root.querySelector('[data-empty]');
 const update=()=>{
  rememberedQuery=input.value;
  const result=filterLearnCourses({category:current,query:rememberedQuery});
  grid.innerHTML=result.map(card).join('');
  count.textContent=result.length+' '+(result.length===1?'course':'courses')+' found';
  empty.hidden=!!result.length;
 };
 input.addEventListener('input',update);
 update();
 if(focusCourses)requestAnimationFrame(()=>{
  const section=root.querySelector('#ns-course-catalogue');
  if(!section?.isConnected)return;
  section.scrollIntoView({behavior:'instant',block:'start'});
  section.querySelector('h2')?.setAttribute('tabindex','-1');
  section.querySelector('h2')?.focus({preventScroll:true});
 });
}
function detail(root,id){
 const course=getLearnCourse(id);if(!course){root.innerHTML='<div class="ns-courses-hub"><div class="ns-courses-inner ns-catalogue-detail"><h1>Course not found</h1><p>This course is not in the catalogue.</p><a href="#learn/courses">Browse all courses →</a></div></div>';return;}
 const bundle=publishedLearnBundle(id),cat=COURSE_CATEGORIES.find(c=>c.id===course.category);
 const completed=bundle?learnCourseProgress(bundle,readLearnProgress()):null;
 const lessonMarkup=bundle?'<div class="ns-catalogue-published">'+
 '<p class="ns-catalogue-published__status">'+completed.done+' of '+completed.total+' lessons completed</p>'+
 bundle.modules.map((m,i)=>'<section class="ns-catalogue-module"><h3>Unit '+(i+1)+' · '+esc(m.title)+'</h3>'+
 m.lessons.map(l=>'<a href="#learn/lesson/'+encodeURIComponent(id)+'/'+encodeURIComponent(l.id)+'">'+esc(l.title)+' <span aria-hidden="true">→</span></a>').join('')+'</section>').join('')+'</div>':
 '<div class="ns-catalogue-coming"><strong>Lessons are being developed</strong>'+
 '<p>This is a course outline, not a playable lesson. Its units, exercises and reviews will appear after the material is authored, checked and published. No completion or reward is shown until then.</p>'+
 '<a href="#learn/courses">Explore another course →</a></div>';
 root.innerHTML='<div class="ns-courses-hub"><div class="ns-courses-inner ns-catalogue-detail">'+
 '<a class="ns-catalogue-back" href="#learn/courses">← All courses</a>'+
 '<div class="ns-catalogue-detail-hero"><div class="ns-catalogue-detail-image" data-course-subject="'+esc(course.id)+'">'+courseArt(course)+'</div>'+
 '<div class="ns-catalogue-detail-copy"><span class="ns-courses-kicker">'+esc(cat?.title||'Psychology')+' · COURSE '+String(LEARN_COURSES.indexOf(course)+1).padStart(2,'0')+'</span>'+
 '<h1>'+esc(bundle?.title||course.title)+'</h1><p>'+esc(course.description)+'</p>'+
 '<span class="ns-catalogue-development">'+(bundle?'Published lessons available':hasPublishedLearnCourse(id)?'Loading published lessons…':'In development · No lessons published yet')+'</span>'+
 '<div class="ns-catalogue-tutor"><span class="ns-courses-kicker">A CHARACTER YOU’LL HELP</span>'+
 '<strong>'+esc(course.companionName)+'</strong><span>“'+esc(course.companionQuote)+'”</span>'+
 '<small>Future lessons will invite you to help '+esc(course.companionName)+' explore their situation and choose thoughtful next steps.</small>'+
 '</div></div></div>'+
 '<div class="ns-catalogue-detail-columns"><section class="ns-catalogue-outline"><span class="ns-courses-kicker">PLANNED LEARNING THEMES</span>'+
 '<h2>What you’ll explore</h2><p>These are subject areas for future lesson writing—not completed units or activities.</p>'+
 '<div class="ns-catalogue-focus">'+course.focus.map((t,i)=>'<div><span>'+String(i+1).padStart(2,'0')+'</span><strong>'+esc(t)+'</strong></div>').join('')+'</div></section>'+
 '<section class="ns-catalogue-outline"><span class="ns-courses-kicker">THE COURSE JOURNEY</span><h2>How you’ll learn</h2>'+
 '<p>Each independent course will introduce the science, teach important distinctions, then offer small interactive drills and revisits.</p>'+
 '<div class="ns-catalogue-phases"><span>Understand the idea</span><span>Spot the distinction</span><span>Apply it carefully</span><span>Review over time</span></div>'+
 '<a href="#learn/how-it-works">See our learning method →</a></section></div>'+
 '<section class="ns-catalogue-syllabus"><h2>Course lessons</h2>'+lessonMarkup+'</section>'+
 '<div class="ns-catalogue-detail-bottom"><a href="#learn/courses">← Browse other courses</a></div>'+
 '</div></div>';
}
function how(root){
 root.innerHTML='<div class="ns-courses-hub"><div class="ns-courses-inner ns-catalogue-detail">'+
 '<a class="ns-catalogue-back" href="#learn">← Learn</a><section class="ns-catalogue-how">'+
 '<span class="ns-courses-kicker">OUR LEARNING METHOD</span><h1>Learn something worth knowing.</h1>'+
 '<p>Learn is being developed as a series of independent, progressively harder psychology courses. Choose a subject you are curious about rather than following one compulsory syllabus.</p>'+
 '<div class="ns-catalogue-journey"><div><b>01</b><strong>Understand</strong><p>Learn the concept and the science that supports it. More detailed explanations remain available when you want them.</p></div>'+
 '<div><b>02</b><strong>Differentiate</strong><p>Practise distinguishing related ideas, exceptions and cases where the evidence is not enough.</p></div>'+
 '<div><b>03</b><strong>Apply</strong><p>Choose responses and hypotheses appropriate to the particular circumstances rather than memorising one-size-fits-all rules.</p></div>'+
 '<div><b>04</b><strong>Revisit</strong><p>Practise retrieval later, including unfamiliar examples that test transfer rather than remembering a button.</p></div></div>'+
 '<h2>Ten ways to practise</h2><div class="ns-catalogue-formats">'+LESSON_FORMATS.map((x,i)=>'<article><span>'+String(i+1).padStart(2,'0')+'</span><h3>'+esc(x.name)+'</h3><p>'+esc(x.description)+'</p></article>').join('')+'</div>'+
 '<p class="ns-catalogue-notice">Course Lab publishes reviewed lessons here. Opening a course page does not record progress; completing a lesson does.</p>'+
 '<a class="ns-courses-feature__link" href="#learn/courses">Discover the planned courses →</a>'+
 '</section></div></div>';
}
function review(root){
 const available=LEARN_COURSES.map(c=>publishedLearnBundle(c.id)).filter(Boolean),records=readLearnProgress();
 const due=available.flatMap(b=>dueLearnReviews(b,records).map(x=>({bundle:b,...x})));
 root.innerHTML='<div class="ns-courses-hub"><div class="ns-courses-inner ns-catalogue-detail">'+
 '<a class="ns-catalogue-back" href="#learn">← Learn</a><section class="ns-catalogue-how"><span class="ns-courses-kicker">RETRIEVAL PRACTICE</span><h1>Review what you’ve learned.</h1>'+
 (due.length?'<p>Revisit these lessons through short practice.</p><div class="ns-catalogue-module">'+due.map(x=>'<a href="#learn/review/'+encodeURIComponent(x.bundle.id)+'/'+encodeURIComponent(x.lesson.id)+'">'+esc(x.lesson.title)+' →</a>').join('')+'</div>':
 '<p>There are no reviews ready yet. Once courses are published and you complete lessons, this space will bring back important distinctions for practice.</p>')+
 '<a class="ns-courses-feature__link" href="#learn/courses">Browse courses →</a></section></div></div>';
}
/** Routes never require a build-time import for new courses. The static index
 * is read after initial paint, then only the selected course JSON is loaded. */
export function renderCourseHub(root,{focusCourses=false,route=[]}={}){
 if(!root)return;
 const ticket=(root.__learnLoadTicket||0)+1;
 root.__learnLoadTicket=ticket;
 const [section='',id='',extra='']=route;
 const current=()=>root.__learnLoadTicket===ticket&&(root.isConnected!==false);
 if(section==='course')detail(root,id);
 else if(section==='how-it-works')how(root);
 else if(section==='review'&&!id)review(root);
 else if(section==='lesson'||section==='review'&&id){
  root.innerHTML='<div class="ns-courses-hub"><div class="ns-courses-inner ns-catalogue-detail" data-lesson-host></div></div>';
  renderLearnLesson(root.querySelector('[data-lesson-host]'),id,extra,{review:section==='review'});
 }else catalogue(root,{category:section==='category'?id:'all',focusCourses});
 // No network on Node/test imports or on static previews.
 if(typeof window==='undefined'||!window.fetch||section==='how-it-works')return;
 const markError=message=>{
  if(!current())return;
  const notice=root.querySelector('.ns-catalogue-development, .ns-catalogue-coming strong, .ns-learn-no-lesson p');
  if(notice)notice.textContent='Could not load published course content: '+message;
 };
 void (async()=>{
  try{
   await loadPublishedLearnIndex({refresh:true});
   if(!current())return;
   if(section==='course'){
    if(hasPublishedLearnCourse(id))await loadPublishedLearnBundle(id);
    if(current())detail(root,id);
   }else if(section==='lesson'||section==='review'&&id){
    if(hasPublishedLearnCourse(id))await loadPublishedLearnBundle(id);
    if(current())renderLearnLesson(root.querySelector('[data-lesson-host]'),id,extra,{review:section==='review'});
   }else if(section==='review'){
    await Promise.all(Object.keys(getLearnIndex().courses).map(courseId=>loadPublishedLearnBundle(courseId)));
    if(current())review(root);
   }else{
    // Refresh only the cards, preserving the active search/filter and scroll.
    const search=root.querySelector('#ns-course-search');
    if(search&&current())search.dispatchEvent(new Event('input',{bubbles:true}));
   }
  }catch(err){markError(err.message);}
 })();
}
