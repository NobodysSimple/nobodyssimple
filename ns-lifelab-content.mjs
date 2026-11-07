import {forestUnitOutlines, forestPlayableLessonIds} from './ns-forest-curriculum.mjs';
import {otherTrailWorldMeta, otherTrailCurricula} from './ns-other-trails-curriculum.mjs';

// Each line is a unit-specific teaching point and a concrete experiment. The
// ten lesson slots revisit it through explanation, discrimination, practice,
// comparison, synthesis and application; they are never completion placeholders.
const NOTES = {
forest: `A fact describes something checkable; a story adds an explanation.|Write the exact words you heard before interpreting them.
An observation can be recorded; an interpretation gives it meaning.|Separate what a camera could record from what you concluded.
Other people's motives are not directly visible.|Ask an open question instead of assigning a motive.
Several explanations can fit the same event.|List two plausible explanations for a delayed reply.
Useful evidence helps distinguish between competing explanations.|Identify one piece of information that would change your view.
Confidence should reflect evidence rather than the strength of a feeling.|Replace definitely with a confidence estimate and a reason.
Some uncertainty remains even after careful checking.|Name one unknown you can leave unresolved today.
Thinking shortcuts can help us act quickly but can also miss details.|Notice an always or never claim and find an exception.
Attention selects part of a situation, not the whole picture.|Look for one relevant detail you initially overlooked.
Memory is reconstructed and can change with later information.|Check a record before treating a remembered detail as exact.
Confirmation bias means favouring information that supports an existing belief.|Look for credible evidence against your first explanation.
A repeated thought is not additional evidence.|Label a repeating prediction as a thought and return to the current task.
A worrying prediction describes a possibility, not an established outcome.|Separate what might happen from what is happening now.
Reflection produces a new understanding or action; rumination often repeats.|Set a short reflection period and finish with one next step.
Seeking complete certainty can keep a decision open indefinitely.|Decide what information is enough for a small reversible choice.
Social cues are ambiguous without context.|Ask what someone meant rather than decoding a short message alone.
Feelings give information about your experience, not proof of an external claim.|Name the feeling and check the claim separately.
Missing information limits the conclusions you can draw.|Write down what you still do not know.
A pattern needs repeated observations; a coincidence may be a single overlap.|Track several examples before naming a pattern.
A gentle test checks an assumption without setting a trap for someone.|Ask a neutral question with room for an unexpected answer.
First impressions are provisional and depend on limited information.|Revise one first impression when new evidence appears.
The story you tell affects which details you notice next.|Describe the same event using neutral language.
Probability allows degrees of confidence between impossible and certain.|Compare likely, possible and unlikely using the available evidence.
Many situations lie between complete success and total failure.|Name one part that worked and one part to change.
Disagreement can involve facts, values or different definitions.|Ask which part of the disagreement is about evidence.
Pressure can narrow attention and encourage quick conclusions.|Pause and name the decision before choosing a response.
A mistake can reveal a gap in a strategy without defining a person.|Identify one adjustment rather than applying a label to yourself.
Ambiguity means more than one interpretation remains reasonable.|Hold two explanations open while choosing a low-risk response.
Possible does not mean probable.|Compare the feared outcome with how often it actually occurs.
Social comparisons use incomplete samples of other people's lives.|Check what information your comparison leaves out.
Behaviour can suggest an intention without proving it.|Describe an action and ask about the intention separately.
A confident media claim still needs evidence.|Find the original source behind a striking headline.
Evidence quality depends on methods, relevance and independent checking.|Compare a personal anecdote with a well-described study.
Persuasive language can influence feelings without strengthening evidence.|Remove loaded adjectives and reassess the claim.
Flexible judgment means updating when relevant evidence changes.|Write what would make you revise a conclusion.
Two reasonable values can point toward different decisions.|Name both values before weighing a trade-off.
More information helps when it could change your decision.|Ask whether another search would affect your next step.
Workplace interpretations improve when expectations are made explicit.|Clarify a deadline or requirement before assuming criticism.
Relationship uncertainty is often better explored through respectful conversation.|Ask for clarification without demanding reassurance repeatedly.
Clear thinking combines observation, alternative explanations and proportionate action.|Use a fact-story-unknown check on an everyday decision.`,
meadow: `Naming a feeling can help you choose care without judging the feeling.|Pause, name a feeling and choose one small caring response.
Feelings can point toward needs but do not issue commands.|Ask what need might deserve attention before acting on an urge.
Body sensations have many possible causes and deserve curiosity.|Describe a sensation without deciding immediately what caused it.
Comfort supports recovery; avoidance can shrink the activities you value.|Choose a manageable return to something important after resting.
When emotions intensify, reducing demands may be more useful than solving everything.|Lower one demand and return to the problem later.
Emotions can change in intensity and duration.|Notice whether a feeling shifts without trying to force it away.
A need, an urge and a value are related but different.|Name what you need, what you want to do and what matters separately.
Self-judgment adds another reaction to an already difficult feeling.|Replace a harsh label with a description of what is happening.
Self-compassion combines kindness with realistic responsibility.|Speak to yourself as you would to a struggling friend.
Rest is a response to limits, not a reward for perfect performance.|Make room for a short break before you are depleted.
More than one emotion can be present at the same time.|Use and instead of but when naming mixed feelings.
Early signs of overwhelm vary from person to person.|Identify your own early cue and reduce one demand.
Soothing helps you reconnect; numbing may postpone noticing what you need.|Check how a coping activity affects you afterwards.
Tiredness can affect patience, attention and emotion.|Consider rest before interpreting irritability as a character flaw.
Grounding directs attention toward immediate surroundings.|Notice a few comfortable sensory details without forcing a breathing exercise.
A pause creates space between a feeling and a response.|Give yourself a brief pause before answering a difficult message.
Tension can signal effort or stress but is not a diagnosis.|Adjust your position and notice whether comfort changes.
Relief can come from changing demands as well as changing thoughts.|Remove or share one small source of pressure.
Allowing a feeling does not mean liking it or acting on it.|Name a feeling and let it be present while doing a gentle activity.
Tolerating discomfort is different from tolerating danger.|Choose a manageable discomfort only when the situation is safe.
Withdrawal can be a sign that demands have exceeded capacity.|Notice an early sign of shutting down and make the setting easier.
Helpful self-talk is believable and specific.|Try this is difficult and I can take one step instead of forced positivity.
Unmet needs may appear as frustration, fatigue or longing.|Ask what practical need could be addressed today.
Shame often turns an action into a judgment about the whole self.|Describe what happened without calling yourself a bad person.
Feeling safe enough is shaped by surroundings and relationships.|Choose a place or person where you have more control and comfort.
Recovery after stress may need time and reduced demands.|Allow a transition before returning to another demanding task.
Steadiness can mean responding flexibly rather than feeling calm all the time.|Choose one supportive routine for a difficult day.
Care for your future self can be small and practical.|Prepare one item that will make tomorrow easier.
Gentle movement can be one option for changing how you feel.|Try a comfortable movement and notice whether it helps you.
Support can be practical, emotional or professional.|Identify the kind of help you want before asking for it.
Protecting energy involves choices about demands and recovery.|Choose one commitment to simplify or postpone.
Enjoyment does not need to be earned through exhaustion.|Make space for a small enjoyable activity without attaching a task to it.
Grief does not follow a single timetable or sequence.|Allow a memory or feeling without judging how long it lasts.
Loneliness concerns the connection you need, not simply how many people are nearby.|Choose one low-pressure form of connection that suits you.
Calm is not a permanent state or a measure of personal success.|Notice a moment of relative ease without trying to hold it forever.
Rituals can provide predictability and meaning.|Build a simple transition ritual you can adapt when needed.
Recovery from overload often starts with reducing input.|Make one sensory or social demand optional for a while.
Basic care depends on access, capacity and individual needs.|Check whether food, water, rest or practical help would be useful.
Consistent care works better when it is flexible enough for difficult days.|Create a smaller version of a caring routine.
Emotional care is an ongoing practice of noticing and responding.|Choose one care skill to carry into the coming week.`,
bridge: `Connection can grow through listening, clear requests and repair.|Ask one curious question before giving your interpretation.
Listening means making room for the other person's meaning.|Reflect back what you heard and check whether you understood.
Clear communication describes a situation and makes a specific request.|Replace a vague complaint with a concrete request.
Questions leave space for information that assumptions miss.|Ask what someone meant without embedding an accusation.
A boundary describes your limits and actions, not control over another person.|State what you can do and what you will do if a limit is crossed.
Repair acknowledges impact and identifies what can change.|Name the misunderstanding and suggest a clearer way forward.
Respect includes room for disagreement and a person's limits.|Notice whether a no is accepted without pressure.
You can communicate while anxious without waiting for perfect confidence.|Prepare a brief opening sentence for a manageable conversation.
An awkward moment does not determine an entire relationship.|Acknowledge a small mix-up and allow the conversation to continue.
Feeling a connection is fragile does not prove it is ending.|Check what changed before drawing a conclusion.
Honesty can be specific and kind without hiding an important point.|Describe an impact without attacking character.
Disagreement is easier to explore when the issue stays specific.|Discuss one claim instead of collecting every past conflict.
Feeling ignored may have several explanations.|Make one direct request for attention at a suitable time.
Needs are easier to discuss when translated into requests.|Ask for a specific kind of support instead of expecting mind-reading.
Curiosity does not require agreement.|Ask how someone reached a view before responding.
Power differences can affect how safe it feels to disagree.|Consider whether a private channel or support person would help.
Stepping back can protect capacity or safety.|Pause a conversation when it becomes unproductive or unsafe.
Feeling heard often involves accurate understanding, not immediate solutions.|Ask whether someone wants listening or ideas.
Assertiveness expresses a position without denying another person's rights.|State your preference clearly and leave room for their response.
Silence can give people time to think and is not always rejection.|Allow a pause before filling the gap with an explanation.
Trust develops through patterns of behaviour over time.|Notice whether actions and commitments are consistent.
A lower-intensity response can interrupt escalation.|Slow down and return to the specific issue.
An apology acknowledges what you did and its impact without demanding forgiveness.|Offer a specific apology and a realistic change.
Difference does not always need to be resolved.|Name a difference you can respect without sharing it.
Repair after conflict needs willingness and enough safety from everyone involved.|Check whether both people are ready before revisiting a conflict.
Support sometimes means being present rather than solving.|Ask what kind of support would be useful.
Saying no can be brief and respectful.|Decline one request without adding an excuse you do not mean.
Stress can make communication harder, so timing and simplicity matter.|Use a short message and arrange a better time to talk.
Rejection feelings are real even when another person's intention is unclear.|Care for the feeling and check the interpretation separately.
A safe conversation allows limits and does not rely on threats.|Leave or seek support if a conversation becomes coercive or threatening.
Criticism may contain useful detail without being a complete judgment of you.|Separate a specific suggestion from a sweeping label.
Closeness and independence can both matter in a relationship.|Discuss a need for time together and time alone.
Friendship maintenance can be small and mutual.|Send a low-pressure check-in without treating the reply as a test.
Written messages leave out many cues and invite interpretation.|Clarify tone when a message matters rather than guessing.
Ending a conversation can be a clear boundary.|State that you are stopping and whether you will return to the topic.
The right moment depends on attention, privacy and readiness.|Ask whether now is a workable time for a discussion.
Family expectations do not erase your practical limits.|State one limit you can realistically maintain.
Romantic closeness does not remove the need for consent and autonomy.|Ask rather than presume agreement about a shared decision.
Social courage can mean a small respectful action with an uncertain outcome.|Try one manageable invitation without demanding a yes.
Healthy relationships make room for connection, difference, limits and repair.|Choose one communication skill to practise this week.`,
workshop: `An intention becomes easier to act on when the first action is concrete.|Turn a vague goal into one visible action.
A smaller task reduces the effort required to begin.|Choose a two-minute version of a task.
Friction is anything that makes an action harder to start or repeat.|Remove one obstacle from the place where you act.
Readiness can grow after a small start rather than before it.|Begin a safe task for a short agreed time.
Plans often fail because conditions differ from what was assumed.|Add a fallback for one predictable obstacle.
A habit often links a cue, an action and a consequence.|Identify the cue before trying to change the routine.
Follow-through depends on opportunity and resources as well as intention.|Put the materials you need within reach.
Priorities involve trade-offs, not doing everything at once.|Choose what matters most today and name what can wait.
Motivation varies, while a supportive structure can reduce repeated decisions.|Attach a small task to an existing routine.
A reliable routine fits your real circumstances.|Design a routine that works on an ordinary busy day.
Specific when-and-where plans can make intentions easier to remember.|Choose a time and place for one action.
Small repeats can build consistency without dramatic effort.|Repeat a manageable action and notice what helps.
Barriers can be environmental, practical or emotional.|Identify which kind of barrier is present before choosing a fix.
The next useful step may be smaller than solving the whole problem.|Choose the first action you can actually take.
Perfectionism can raise the cost of starting.|Define what a usable first draft would include.
Feeling stuck can mean the task is unclear or too large.|Describe the next action without using an abstract verb like improve.
Too many decisions can consume attention.|Create one helpful default for a recurring choice.
Low-energy plans should reduce scope rather than demand the same output.|Prepare a minimum version of an important task.
Environment shapes which actions are easy and visible.|Put a helpful cue where the action happens.
Avoidance may offer short-term relief while maintaining a difficult task.|Approach a safe task in a small timed step.
Starting cues work best when they are noticeable and specific.|Pair a clear cue with a tiny first action.
A commitment device changes the conditions around a future choice.|Choose a reversible reminder or arrangement that supports your intention.
Visible cues help when they appear at the point of action.|Place a reminder beside the materials you need.
A missed day is information, not proof that a habit is ruined.|Resume with the next available small opportunity.
Progress can occur even when motivation is low.|Measure a concrete action instead of waiting to feel productive.
Immediate rewards can compete with distant benefits.|Make the helpful action a little more pleasant now.
Choosing priorities means connecting actions to what matters.|Identify which task serves your most important current need.
Energy budgeting considers recovery and variability.|Leave some space between demanding activities.
A small experiment can teach more than repeated speculation.|Try a reversible version and observe what happens.
Uncertain decisions can be assessed by consequences and reversibility.|Choose a small reversible test when the stakes allow it.
Identity can support habits without becoming a rigid standard.|Describe yourself as practising a skill rather than always succeeding.
Planning helps until it replaces the action it was meant to support.|Set a point at which you will test the plan.
Comparing options is easier with a few explicit criteria.|Choose two relevant criteria before weighing alternatives.
A setback may call for adjustment rather than more force.|Change one condition that made the last attempt difficult.
Defaults influence behaviour because they reduce repeated choices.|Make the preferred option the easiest available starting point.
Distractions compete for attention and can be managed through the environment.|Move one nonessential interruption out of reach.
Kindness can coexist with effort and realistic limits.|Choose a challenging but manageable step with a stopping point.
A useful system fits your capacities and can change with them.|Remove one rule that makes your routine unnecessarily difficult.
Sustainable productivity includes recovery and enough room for variation.|Plan a workload that leaves space for ordinary disruptions.
Action aligned with values can be modest and imperfect.|Choose one practical step toward something that matters.`,
observatory: `Values describe directions you care about; identity includes many changing parts.|Name one value and one small action that expresses it.
What matters to you may differ from what earns approval.|Ask whether a choice would matter without an audience.
Self-stories highlight some experiences and leave others out.|Find an example that complicates a fixed story about yourself.
Belonging and individuality can coexist.|Notice where you can connect without hiding every difference.
Pressure can make a value harder to act on without making it disappear.|Choose a small expression of a value within your actual limits.
Different contexts can bring out different parts of the same person.|Compare what changes across settings without calling one version fake.
Admiration can point toward qualities you want to practise.|Turn an admired quality into a concrete behaviour.
Identity can develop through experience and changing circumstances.|Replace I am always with I have often in one self-description.
Meaning can come from ordinary relationships and activities.|Notice one everyday activity that feels worthwhile to you.
Alignment means a workable connection between values and actions, not perfection.|Adjust one small choice toward something you care about.
Culture shapes what feels normal without making it universal.|Ask how a familiar expectation might look in another context.
Success can be defined in more than one way.|Write a definition of success that includes your actual priorities.
Roles and labels can be useful without describing the whole person.|Name something about yourself that a common label leaves out.
Internal expectations may echo other people's judgments.|Ask whose approval an expectation is trying to secure.
Inherited beliefs can be examined without rejecting everything about your background.|Choose one belief and ask what supports it now.
Becoming a certain kind of person involves repeated choices, not a final label.|Choose a behaviour that fits the direction you want to grow.
Values can conflict and require a trade-off.|Name two values in a difficult choice before deciding.
Comparison often omits other people's circumstances and costs.|Compare your current direction with your own priorities.
Social expectations can guide behaviour while also limiting possibilities.|Notice one expectation you want to accept, adapt or decline.
You can act on values without a complete definition of yourself.|Make one meaningful choice while leaving a label unsettled.
Integrity appears in small choices as well as dramatic moments.|Choose one ordinary action consistent with a stated value.
Media presents selected versions of lives and identities.|Notice what a feed leaves out of the picture.
Normal can mean common, expected or approved; these are different claims.|Ask which meaning of normal is being used.
Agency exists within real social and practical constraints.|Separate what you can influence from what requires wider support.
Disappointment can alter a plan without removing every source of meaning.|Identify one valued direction still available after a setback.
Values can shift as experience changes what matters.|Revisit a priority you no longer want to follow automatically.
Authenticity does not require disclosure in an unsafe setting.|Choose how much to share based on your boundaries and safety.
Online belonging can be meaningful and still involve pressure to perform.|Notice how a community affects your freedom to disagree.
Contradictory feelings or commitments can coexist.|Describe both sides of a tension without forcing a quick label.
Envy can contain information about an unmet wish.|Ask what specific quality or opportunity you long for.
Group agreement can influence confidence without adding evidence.|Check your reasons before adopting a shared conclusion.
Moral discomfort can prompt reflection rather than instant self-condemnation.|Identify the value involved and one possible repair.
Agency includes small choices and collective action within constraints.|Choose one realistic sphere of influence.
Your perspective is shaped by experience and is not the only available view.|Ask what another person's circumstances might make visible.
Values can guide choices when there is no perfect option.|Choose a workable action and acknowledge the trade-off.
Change can unsettle an identity while leaving some continuity.|Name something that changed and something you still care about.
A fitting future reflects needs and values as well as status.|Imagine an ordinary day in the future you are considering.
Courage can mean a small action taken with uncertainty.|Choose a manageable action that expresses a conviction.
Flexible values guide direction without becoming harsh rules.|Adapt how you express a value when circumstances change.
Identity and values remain open to learning across everyday life.|Choose a value to practise and revisit what you learn.`
};

export const STONE_SIZES = Object.freeze([3,3,2,1,1]);
export const STONE_LABELS = Object.freeze(['Learn','Practise','Compare','Capstone','Apply']);
export const trails = Object.freeze([
  {id:'forest',name:'The Forest',description:'Thinking, evidence and uncertainty.',destination:'The Summit',icon:'tree',color:'#5f8f43',panel:0},
  {id:'meadow',slug:'garden',name:'The Garden',description:'Feelings, self-care and emotional steadiness.',destination:'The Glasshouse',icon:'flower',color:'#cf7897',panel:1},
  {id:'bridge',slug:'harbour',name:'The Harbour',description:'Relationships, communication and repair.',destination:'The Grand Port',icon:'anchor',color:'#4f8ec6',panel:2},
  {id:'workshop',slug:'forge',name:'The Forge',description:'Decisions, habits and action.',destination:'The Great Engine',icon:'forge',color:'#df8a45',panel:3},
  {id:'observatory',name:'The Observatory',description:'Identity, values and perspective.',destination:'The Star Dome',icon:'star',color:'#9870cb',panel:4}
].map(t=>Object.freeze({...t,slug:t.slug||t.id})));

const lessonNames = ['Meet the idea','Notice the difference','Check your understanding','Try a small step','Choose a response','Practise in context','Compare two approaches','Make room for nuance','Bring it together','Try it in real life'];
export const curriculum = Object.freeze(Object.fromEntries(trails.map(trail=>{
  const outlines=trail.id==='forest'?forestUnitOutlines:otherTrailCurricula[trail.id];
  const notes=NOTES[trail.id].split('\n');
  if(notes.length!==40) throw new Error(`${trail.id}: expected 40 authored unit notes`);
  return [trail.id,Object.freeze(outlines.map((outline,i)=>{
    const [principle,experiment]=notes[i].split('|');
    const id=`${trail.id}-unit-${i+1}`;
    const lessons=lessonNames.map((label,j)=>Object.freeze({id:`${id}-lesson-${j+1}`,number:j+1,title:label,type:j===8?'capstone':j===9?'application':'standard',
      legacyId:trail.id==='forest'?(i===0?forestPlayableLessonIds[j]:null):outline.steps[j].id}));
    let offset=0;
    const stones=STONE_SIZES.map((count,j)=>{const items=lessons.slice(offset,offset+count);offset+=count;return Object.freeze({id:`${id}-stone-${j+1}`,number:j+1,label:STONE_LABELS[j],lessons:Object.freeze(items)});});
    return Object.freeze({id,number:i+1,title:outline.title,principle,experiment,lessons:Object.freeze(lessons),stones:Object.freeze(stones)});
  }))];
})));

const contexts=['a conversation with a friend','an ordinary work or study day','a change to your plans','a quiet moment at home','a shared task','a decision about your week','an unexpected message','a new situation'];
// Distinct instructional roles, with answer positions rotated deterministically.
export function lessonQuestions(unit,lesson){
  if(lesson.type==='application')return [];
  const p=unit.principle, a=unit.experiment, context=contexts[(unit.number+lesson.number)%contexts.length];
  const bank=[
    {prompt:`Which statement captures the central idea of “${unit.title}”?`,right:p,wrong:['One example is enough to make a permanent judgment.','The same response must work for everyone in every setting.'],why:`The key distinction is: ${p}`},
    {prompt:`During ${context}, you notice yourself jumping to a conclusion. Which approach leaves room to learn?`,right:`Pause and consider this idea: ${p}`,wrong:['Treat the first reaction as a complete account of the situation.','Ignore the context because your first explanation must be right.'],why:'Pausing creates room to examine the situation. You do not have to dismiss your experience to reconsider a conclusion.'},
    {prompt:'Which claim goes beyond what this unit teaches?',right:'This idea guarantees the same outcome every time.',wrong:[p,'Context and individual circumstances still matter.'],why:'A useful psychological idea is a guide to understanding, not a guarantee about every person or situation.'},
    {prompt:`You want to practise “${unit.title}”. Which is the most concrete starting point?`,right:a,wrong:['Wait until you can handle every related situation perfectly.','Judge yourself for not already knowing what to do.'],why:`A small, specific experiment makes practice possible: ${a}`},
    {prompt:`In ${context}, the situation feels harder than expected. What is a useful response?`,right:'Adjust the size or timing of the practice to fit the situation.',wrong:['Force the same approach regardless of capacity or safety.','Treat one difficult attempt as proof that learning is impossible.'],why:`The practice is ${a.toLowerCase()} Adapt it to real limits rather than turning it into a rigid demand.`},
    {prompt:'After trying the practice, what would help you learn from it?',right:'Notice what happened, what helped and what you might adjust.',wrong:['Count only a perfect result as worth noticing.','Assume your result tells you how every other person will respond.'],why:'Reviewing an actual attempt gives more useful information than a global judgment about yourself or everyone else.'},
    {prompt:`One person tries “${a}” Another insists on a perfect result before starting. What is the useful difference?`,right:'The first approach makes room for a concrete experiment and feedback.',wrong:['The first person is guaranteed to succeed.','The second person can avoid all uncertainty by waiting.'],why:'A manageable experiment lets you learn from experience. It does not promise success or remove all uncertainty.'},
    {prompt:`How can you use this idea without turning it into a rule for everyone? “${p}”`,right:'Consider context, consent, resources and individual differences.',wrong:['Insist that everyone interpret their experience exactly as you do.','Use the idea to label a person from a single behaviour.'],why:'A principle is most useful when it remains sensitive to context and does not become a diagnosis or an instruction imposed on someone else.'}
  ];
  const selected=lesson.type==='capstone'?[bank[1],bank[3],bank[7]]:[bank[lesson.number-1]];
  return selected.map((q,i)=>{const correct=(unit.number+lesson.number+i)%3;const options=[...q.wrong];options.splice(correct,0,q.right);return {...q,options,correct};});
}

export function findTrail(value){return trails.find(t=>t.id===value||t.slug===value);}
export const totals=Object.freeze({trails:5,units:200,stones:1000,lessons:2000});
