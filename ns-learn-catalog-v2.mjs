/**
 * Nobody's Simple · Learn catalogue v2.
 * Only metadata lives here: no exercises, lessons, progress, or invented
 * availability. Stable IDs support future course publication independently
 * of page layout, search, and editorial labels.
 *
 * The scene + character assets below are the original Learn illustrations.
 * Multiple courses may share art until bespoke assets are designed.
 */
export const COURSE_CATEGORIES=Object.freeze([
 {id:'all',title:'All courses',subtitle:'Explore everything we plan to teach.'},
 {id:'relationships',title:'People & relationships',subtitle:'Personality, connection, influence and communicating.'},
 {id:'mind',title:'Mind & mental health',subtitle:'Psychological processes behind everyday difficulties.'},
 {id:'everyday',title:'Habits & everyday life',subtitle:'Motivation, work, decisions and the conditions of change.'},
 {id:'society',title:'Society & digital life',subtitle:'How people and technologies shape beliefs and behaviour.'}
].map(x=>Object.freeze(x)));
// Use the actual original Life Lab atlas and canonical character dialogues.
// These are characters learners will help, not cartoon lecturers.
import {WORLD_STORIES} from './ns-lifelab-worlds.mjs';
const WORLDS=['forest','meadow','bridge','workshop','observatory'];
const ORIGINAL_CAST=new Map(WORLDS.flatMap((world,row)=>WORLD_STORIES[world].characters.map(([name,quote],column)=>[name,Object.freeze({name,quote,world,row,column,x:column*100/3,y:row*25})])));
export const LEARN_COURSE_COMPANIONS=Object.freeze({
 "narcissism":"Lyra",
 "manipulation":"Ari",
 "attachment":"Nell",
 "overthinking":"Moss",
 "boundaries":"Cove",
 "anxiety":"Briar",
 "emotions":"Fern",
 "self-esteem":"Poppy",
 "motivation":"Ember",
 "social-anxiety":"Milo",
 "burnout":"Sunny",
 "loneliness":"Sora",
 "social-media":"Indi",
 "misinformation":"Echo",
 "neurodiversity":"Tavi",
 "sleep":"Thistle",
 "low-mood":"Rook",
 "scams":"Rowan",
 "masculinity":"Vale",
 "vaping":"Pip"
});
export const LEARN_COMPANIONS=Object.freeze(Object.fromEntries(
 Object.entries(LEARN_COURSE_COMPANIONS).map(([courseId,name])=>[courseId,ORIGINAL_CAST.get(name)])
));
export const LEARN_TUTORS=LEARN_COMPANIONS; // old export retained for compatibility.
const COURSE_ART_ROOT='learn-art/course-guides/';
const COMPANION_ATLAS='media/lifelab/companions.png';
const art=Object.freeze({self:'peach',thinking:'blue',emotions:'gold',people:'sage',
 boundaries:'sage',courage:'sky',habits:'gold',uncertainty:'sky',focus:'sage',communication:'peach'});
const cardTitles=Object.freeze({
 narcissism:'Narcissism & Personality',
 manipulation:'Gaslighting & Manipulation',
 attachment:'Attachment & Love',
 overthinking:'Overthinking',
 boundaries:'Boundaries & Communication',
 anxiety:'Anxiety & Avoidance',
 emotions:'Understanding Emotions',
 'self-esteem':'Self-Esteem & Shame',
 motivation:'Motivation & Habits',
 'social-anxiety':'Social Anxiety',
 burnout:'Stress & Burnout',
 loneliness:'Loneliness & Belonging',
 'social-media':'Social Media & Attention',
 misinformation:'Misinformation & AI',
 neurodiversity:'ADHD, Autism & Neurodiversity',
 sleep:'Sleep & Insomnia',
 'low-mood':'Depression & Low Mood',
 scams:'Scams & Deception',
 masculinity:'Sexuality & Gender',
 vaping:'Social Influence & Addiction'
});
const make=(id,title,description,category,artId,focus,keywords=[])=>{
 const person=LEARN_COMPANIONS[id];
 if(!person)throw Error('Missing original Life Lab companion for course '+id);
 const portrait=id==='neurodiversity';
 const landscape=COURSE_ART_ROOT+id+'-scene.svg';
 const mascot=portrait?COURSE_ART_ROOT+'neurodiversity-companion.webp':COMPANION_ATLAS;
 const tone=art[artId]||'sage';
 return Object.freeze({id,title,cardTitle:cardTitles[id]||title,description,category,
  landscape,mascot,companionPortrait:portrait,
  companionName:portrait?'Sage':person.name,
  companionQuote:portrait?'I want to understand how different experiences and environments shape the way we live.':person.quote,
  companionRow:person.row,companionColumn:person.column,
  companionX:person.x,companionY:person.y,tone,
  focus:Object.freeze(focus),keywords:Object.freeze(keywords),status:'planned'});
};
// Ranked discovery order, NOT a compulsory learning sequence.
export const LEARN_COURSES=Object.freeze([
 make('narcissism','Understanding Narcissism & Personality','Go beyond stereotypes: traits, vulnerability, grandiosity and what a diagnosis cannot tell you.','relationships','self',['Grandiosity and vulnerability','Personality traits versus disorders','Self-esteem and entitlement','Limits of inferring motives'],['narcissistic','personality disorder','grandiosity']),
 make('manipulation','Manipulation, Gaslighting & Psychological Tactics','Distinguish coercion, gaslighting, DARVO and defensiveness without guessing diagnoses.','relationships','boundaries',['Gaslighting and ordinary disagreement','DARVO and responsibility','Coercion and power','Evidence, safety and proportionate responses'],['darvo','coercive','blame shifting','psychological abuse']),
 make('attachment','Attachment, Love & Relationship Patterns','Understand attachment, closeness, reassurance and recurring relationship dynamics.','relationships','people',['Attachment theory and limits','Closeness and reassurance','Conflict and repair','Context and relationship patterns'],['love','romance','attachment style']),
 make('overthinking','Overthinking, Rumination & Mental Loops','Learn why thoughts repeat and when thinking helps rather than keeps you stuck.','mind','thinking',['Worry versus rumination','Checking and reassurance','Solvable problems and uncertainty','Choosing a useful next step'],['worry','rumination','thought loops']),
 make('boundaries','Boundaries & Difficult Conversations','Understand boundaries, consent, assertiveness, repair and when confrontation is unsafe.','relationships','communication',['Boundaries versus control','Assertiveness and requests','Conflict and repair','Safety and power differences'],['assertiveness','consent','communication']),
 make('anxiety','Anxiety, Fear & Avoidance','Explore threat, fear, avoidance and the mechanisms that can maintain anxiety.','mind','courage',['Threat appraisal and fear','Avoidance and safety behaviours','Negative reinforcement','Exposure principles and limits'],['panic','fear','avoidance']),
 make('emotions','The Science of Emotions','Understand emotional functions, appraisal, regulation and the circumstances behind feelings.','mind','emotions',['Appraisal and emotion function','Emotional differentiation','Regulation and suppression','Changing circumstances'],['emotional regulation','feelings']),
 make('self-esteem','Self-Esteem, Shame & the Inner Critic','Explore shame, guilt, perfectionism and patterns of self-worth.','mind','self',['Guilt versus shame','Perfectionism','Conditional self-worth','Self-criticism and context'],['confidence','self criticism','self trust']),
 make('motivation','Motivation, Procrastination & Habit Change','Study reward, reinforcement, task aversion and how habits actually change.','everyday','habits',['Reinforcement and motivation','Task aversion','Habit loops','Environment and opportunity'],['habits','procrastination','motivation']),
 make('social-anxiety','Social Anxiety & Fear of Judgement','Recognise self-monitoring, evaluation fears and post-event rumination.','mind','uncertainty',['Evaluation fears','Self-focused attention','Post-event rumination','Real versus anticipated threats'],['judgement','social fear','embarrassment']),
 make('burnout','Stress, Burnout & Psychological Demands','Understand demands, resources, recovery and the limits of individual coping.','everyday','focus',['Stress appraisal','Demands and resources','Recovery and overload','Organisational change'],['work','stress','workload']),
 make('loneliness','Loneliness, Friendship & Belonging','Explore social connection, rejection sensitivity and the psychology of belonging.','relationships','people',['Loneliness and isolation','Belonging and support','Rejection sensitivity','Reciprocity and connection'],['friendships','social isolation','belonging']),
 make('social-media','Social Media & the Attention Economy','Analyse digital reward systems, social comparison, algorithms and persuasive design.','society','focus',['Persuasive interfaces','Social comparison','Algorithms and attention','Digital habits and autonomy'],['algorithm','internet','attention']),
 make('misinformation','Misinformation, Conspiracies & AI Persuasion','Learn to assess claims, sources and evidence in persuasive digital environments.','society','thinking',['Source credibility','Motivated reasoning','Conspiracy explanations','Synthetic media and belief revision'],['fake news','ai','critical thinking']),
 make('neurodiversity','ADHD, Autism & Neurodivergent Experience','Understand executive functions, sensory experiences, context and diagnostic boundaries.','mind','emotions',['Executive functions and contexts','Sensory differences','Autism and ADHD heterogeneity','Accessibility and diagnostic limits'],['neurodivergence','autism','adhd']),
 make('sleep','Sleep, Insomnia & the Psychology of Rest','Learn how sleep regulation, habits and sleep-related worry interact.','mind','uncertainty',['Circadian and sleep regulation','Conditioned arousal','Sleep-related worry','Evidence and common myths'],['insomnia','rest','circadian']),
 make('low-mood','Depression, Low Mood & Motivation','Explore reward loss, withdrawal, rumination and environmental influences on mood.','mind','self',['Behavioural withdrawal','Reward and motivation','Rumination and mood','Context and alternative explanations'],['depression','low mood','sadness']),
 make('scams','Scams, Deception & Social Engineering','Identify urgency, authority, false scarcity and manipulation under pressure.','society','boundaries',['Authority and urgency','Scarcity claims','Trust and deception','Safer verification strategies'],['fraud','scammers','security']),
 make('masculinity','Sexuality & Gender','Explore gender roles, sexuality, identity, social expectations and the influence of online narratives.','society','communication',['Sexuality, identity and context','Gender roles and expectations','Social influence and belonging','Distinguishing evidence from stereotypes'],['masculinity','manosphere','misogyny','gender','sexuality','sex education']),
 make('vaping','Social Influence & Addiction','Understand how dependence, reinforcement, social norms and persuasive environments shape behaviour.','society','habits',['Reinforcement and dependence','Social norms and peer influence','Marketing and persuasion','Responding to pressure and seeking change'],['vaping','smoking','nicotine','addiction','dependency','social pressure','influence','pshe'])
]);
export const COURSE_BY_ID=new Map(LEARN_COURSES.map(c=>[c.id,c]));
export const getLearnCourse=id=>COURSE_BY_ID.get(id)||null;
const normalise=s=>String(s||'').normalize('NFKD').toLocaleLowerCase('en').replace(/[’']/g,'').trim();
export function filterLearnCourses({category='all',query=''}={}){
 const q=normalise(query);
 return LEARN_COURSES.filter(c=>(category==='all'||c.category===category)&&(!q||normalise([c.title,c.description,...c.focus,...c.keywords].join(' ')).includes(q)));
}
// Shared with Course Lab: all supported psychology interaction templates.
import {COURSE_LAB_TYPES,COURSE_LAB_EXERCISES} from './ns-course-lab-schema.mjs';
export const LESSON_FORMATS=Object.freeze(COURSE_LAB_TYPES.filter(t=>COURSE_LAB_EXERCISES.includes(t.id)).map(t=>Object.freeze({
 id:t.id,name:t.name,description:t.hint
})));
