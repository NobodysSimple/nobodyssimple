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
// Every course has a dedicated tutor and scene, not a shared character thumbnail.
// The course ID is also the immutable asset key for future authoring and localisation.
const art=Object.freeze({
 self:'peach',thinking:'blue',emotions:'gold',people:'sage',
 boundaries:'sage',courage:'sky',habits:'gold',uncertainty:'sky',
 focus:'sage',communication:'peach'
});
export const LEARN_TUTORS=Object.freeze({
 narcissism:{name:'Mira',role:'The Mirror Keeper'},
 manipulation:{name:'Knot',role:'The Thread Cutter'},
 attachment:{name:'Pip',role:'The Connection Gardener'},
 overthinking:{name:'Loop',role:'The Thought Cartographer'},
 boundaries:{name:'Bram',role:'The Gatekeeper'},
 anxiety:{name:'Scout',role:'The Brave Trail Guide'},
 emotions:{name:'Mallow',role:'The Feeling Painter'},
 'self-esteem':{name:'Goldie',role:'The Gentle Restorer'},
 motivation:{name:'Cog',role:'The Habit Tinkerer'},
 'social-anxiety':{name:'Echo',role:'The Stage Lantern'},
 burnout:{name:'Moss',role:'The Rest Guardian'},
 loneliness:{name:'Lumi',role:'The Star Connector'},
 'social-media':{name:'Pixel',role:'The Attention Curator'},
 misinformation:{name:'Clue',role:'The Evidence Detective'},
 neurodiversity:{name:'Prism',role:'The Difference Explorer'},
 sleep:{name:'Nox',role:'The Dream Astronomer'},
 'low-mood':{name:'Sprig',role:'The Rain Gardener'},
 scams:{name:'Latch',role:'The Trust Guardian'},
 masculinity:{name:'Vale',role:'The Dialogue Wayfinder'},
 vaping:{name:'Breeze',role:'The Air Scientist'}
});
const COURSE_ART_ROOT='learn-art/course-guides/';
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
 masculinity:'Masculinity & Online Influence',
 vaping:'Vaping & Social Pressure'
});
const make=(id,title,description,category,artId,focus,keywords=[])=>{
 const guide=LEARN_TUTORS[id];
 if(!guide)throw Error('Missing illustrated tutor for course '+id);
 const landscape=COURSE_ART_ROOT+id+'-scene.svg';
 const mascot=COURSE_ART_ROOT+id+'-tutor.svg';
 const tone=art[artId]||'sage';
 return Object.freeze({id,title,cardTitle:cardTitles[id]||title,description,category,
  landscape,mascot,tutorName:guide.name,tutorRole:guide.role,tone,
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
 make('masculinity','Masculinity, Misogyny & Online Influence','Study identity, belonging, status and how online narratives influence beliefs.','society','communication',['Social identity and belonging','Status and grievance','Group polarisation','Evaluating harmful generalisations'],['manosphere','misogyny','gender']),
 make('vaping','Vaping, Nicotine & Social Pressure','Understand dependence, social norms, marketing and peer influence.','society','habits',['Nicotine and reinforcement','Perceived social norms','Marketing and persuasion','Responding to peer pressure'],['smoking','nicotine','addiction','pshe'])
]);
export const COURSE_BY_ID=new Map(LEARN_COURSES.map(c=>[c.id,c]));
export const getLearnCourse=id=>COURSE_BY_ID.get(id)||null;
const normalise=s=>String(s||'').normalize('NFKD').toLocaleLowerCase('en').replace(/[’']/g,'').trim();
export function filterLearnCourses({category='all',query=''}={}){
 const q=normalise(query);
 return LEARN_COURSES.filter(c=>(category==='all'||c.category===category)&&(!q||normalise([c.title,c.description,...c.focus,...c.keywords].join(' ')).includes(q)));
}
export const LESSON_FORMATS=Object.freeze([
 {id:'match',name:'Match',description:'Connect ideas, definitions and real examples.'},
 {id:'sort',name:'Sort',description:'Separate similar-looking psychological patterns.'},
 {id:'choose',name:'Choose',description:'Pick between plausible explanations.'},
 {id:'complete',name:'Recall',description:'Fill in what you remember, without copying.'},
 {id:'sequence',name:'Sequence',description:'Put reasoning or action steps in order.'},
 {id:'respond',name:'Respond',description:'Choose a proportionate response for the context.'}
]);
