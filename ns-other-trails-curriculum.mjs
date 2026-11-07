const STEP_KINDS = Object.freeze(['learn','explore','compare','practise','review','learn','compare','choose','capstone','apply']);
const STONE_SPLITS = Object.freeze([3,3,2,1,1]);
const STEP_META = Object.freeze({
  learn:{label:'Learn',verb:'Meet',summary:'Understand the core idea through a simple everyday example.'},
  explore:{label:'Explore',verb:'Notice',summary:'Spot the important detail before deciding what it means.'},
  compare:{label:'Compare',verb:'Compare',summary:'Set possibilities side by side and notice what separates them.'},
  practise:{label:'Practise',verb:'Practise',summary:'Try the skill in a guided situation.'},
  review:{label:'Review',verb:'Recall',summary:'Bring the main point back to mind in a new example.'},
  choose:{label:'Choose',verb:'Choose',summary:'Choose a useful next response without pretending there is only one perfect answer.'},
  capstone:{label:'Mission',verb:'Bring together',summary:'Combine the whole unit in one synthesis lesson.'},
  apply:{label:'Apply',verb:'Apply',summary:'Choose one optional way to use the learning in real life.'}
});

const WORLD_DATA = Object.freeze({
  meadow:Object.freeze({
    title:'The Meadow',
    theme:'Feelings, needs and body awareness',
    accent:'#76c949',
    accentSoft:'#dff4c8',
    tailGround:'#b6ea70',
    tailRoad:['#efc779','#ffe3ab','#efc779'],
    tailDecor:'#88d56b',
    stoneMeta:Object.freeze([
      Object.freeze({id:'body-signal',title:'Notice the Signal',type:'notice',objective:'Notice body sensations, needs and simple emotional clues.'}),
      Object.freeze({id:'name-the-feeling',title:'Name the Feeling',type:'discover',objective:'Put words to the emotion and what might be underneath it.'}),
      Object.freeze({id:'care-response',title:'Care for Yourself',type:'rehearse',objective:'Choose a gentle response that matches what you need.'}),
      Object.freeze({id:'calm-compass',title:'Calm Compass',type:'capstone',objective:'Bring the whole unit together in one reflective mission.'}),
      Object.freeze({id:'daily-care',title:'Take It Into the Day',type:'apply',objective:'Choose one small caring action for everyday life.'})
    ]),
    units:Object.freeze([
      'Feelings, needs and body signals','Naming feelings without panic','What your body might be saying','Comfort versus avoidance','What helps when feelings swell','Emotions move and change','Need, urge or value?','Listening to the body kindly','Self-compassion in hard moments','Rest and restoration',
      'When emotions feel mixed','Recognising overwhelm early','The difference between soothing and numbing','What tiredness can look like','Gentle grounding','Permission to pause','Body tension and what it signals','What brings relief','Letting feelings be temporary','Staying with discomfort kindly',
      'Small signals before shutdown','Reassurance and self-talk','Identifying unmet needs','Shame and softness','Feeling safe enough to feel','What helps after stress','Finding steadiness again','Being kind to your future self','Movement and regulation','When to ask for support',
      'Protecting your energy','Pleasure without guilt','Making room for grief','Responding to loneliness','What calm really feels like','Creating personal rituals','Listening without judging yourself','Recovering from overload','The emotional basics of care','Caring for yourself in everyday life'
    ])
  }),
  bridge:Object.freeze({
    title:'The Bridge',
    theme:'Relationships, communication and boundaries',
    accent:'#5bb9ff',
    accentSoft:'#d8f0ff',
    tailGround:'#98d5f8',
    tailRoad:['#dfc17a','#ffe3ab','#dfc17a'],
    tailDecor:'#6ac3ee',
    stoneMeta:Object.freeze([
      Object.freeze({id:'read-the-moment',title:'Read the Moment',type:'notice',objective:'Notice cues, context and what is actually happening in the interaction.'}),
      Object.freeze({id:'say-it-clearly',title:'Say It Clearly',type:'compare',objective:'Practise clear, respectful communication.'}),
      Object.freeze({id:'repair-or-boundary',title:'Repair or Boundary',type:'rehearse',objective:'Choose between repairing a connection and setting a limit.'}),
      Object.freeze({id:'bridge-builder',title:'Bridge Builder',type:'capstone',objective:'Bring the communication skills together in one mission.'}),
      Object.freeze({id:'relationship-step',title:'Take It Into a Relationship',type:'apply',objective:'Choose one real-life communication step.'})
    ]),
    units:Object.freeze([
      'Conversations, cues and context','Listening without jumping in','Saying what you mean simply','Asking rather than assuming','Boundaries without hostility','Repair after misunderstanding','What respect feels like','Speaking when anxious','Handling awkward moments','When connection feels fragile',
      'The difference between honesty and harshness','How to disagree well','What to do when you feel ignored','Clarifying needs in conversation','Being curious about another view','Noticing power dynamics','When to step back','What makes someone feel heard','Asserting yourself calmly','Letting silence do work',
      'Trust and consistency','Responding without escalating','When to apologise','Accepting that others differ','Repairing after conflict','Not every problem needs solving','Saying no with less guilt','Communicating under stress','Feeling rejected in social situations','Checking whether a conversation is safe',
      'Responding to criticism','Balancing closeness and distance','Friendship maintenance','Digital communication and tone','When to end a conversation','Choosing the right moment','Boundaries in family life','Boundaries in romantic life','Social courage in everyday life','Healthy relationships in everyday life'
    ])
  }),
  workshop:Object.freeze({
    title:'The Workshop',
    theme:'Decisions, habits and action',
    accent:'#f4a340',
    accentSoft:'#ffe5c9',
    tailGround:'#f3cc7a',
    tailRoad:['#dbae61','#ffdf9e','#dbae61'],
    tailDecor:'#f4b865',
    stoneMeta:Object.freeze([
      Object.freeze({id:'pick-the-target',title:'Pick the Target',type:'notice',objective:'Choose what you are trying to do and make it concrete.'}),
      Object.freeze({id:'reduce-friction',title:'Reduce the Friction',type:'compare',objective:'Notice what gets in the way and what makes action easier.'}),
      Object.freeze({id:'build-the-routine',title:'Build the Routine',type:'rehearse',objective:'Practise linking intentions to simple repeatable actions.'}),
      Object.freeze({id:'action-lab',title:'Action Lab',type:'capstone',objective:'Bring the decision and habit skills together in one mission.'}),
      Object.freeze({id:'weekly-step',title:'Take It Into the Week',type:'apply',objective:'Choose one action you can actually carry out this week.'})
    ]),
    units:Object.freeze([
      'Goals, steps and action','Making a task smaller','Friction and momentum','Starting before you feel ready','Why plans fail','Habit loops in real life','What makes follow-through easier','Choosing priorities wisely','Motivation versus structure','Building a reliable routine',
      'Turning intention into action','Tiny wins and consistency','Removing barriers','Doing the next right thing','Perfectionism and procrastination','When you feel stuck','Decision fatigue','Planning for low-energy days','The role of environment','Breaking avoidance gently',
      'What helps you begin','Commitment devices','Visible cues and reminders','How to recover after missing a day','Progress over mood','Short-term versus long-term rewards','Choosing what matters most','Energy budgeting','Learning by trying','Making decisions under uncertainty',
      'Habits and identity','When to stop overplanning','Choosing between options','Action after setbacks','Replacing bad defaults','Handling distractions','Doing hard things kindly','Making a system that fits you','Sustainable productivity','Acting on what matters in everyday life'
    ])
  }),
  observatory:Object.freeze({
    title:'The Observatory',
    theme:'Identity, values and society',
    accent:'#9d73ff',
    accentSoft:'#eadfff',
    tailGround:'#8f83d8',
    tailRoad:['#c7b085','#f0dcad','#c7b085'],
    tailDecor:'#9b8df1',
    stoneMeta:Object.freeze([
      Object.freeze({id:'notice-what-matters',title:'Notice What Matters',type:'notice',objective:'Notice values, pulls and recurring patterns in what matters to you.'}),
      Object.freeze({id:'identity-and-story',title:'Identity and Story',type:'discover',objective:'Consider how the stories you tell shape how you see yourself.'}),
      Object.freeze({id:'values-in-context',title:'Values in Context',type:'rehearse',objective:'Explore how values meet pressure, belonging and culture.'}),
      Object.freeze({id:'perspective-lab',title:'Perspective Lab',type:'capstone',objective:'Bring values, identity and perspective together in one mission.'}),
      Object.freeze({id:'alignment-step',title:'Take It Into Life',type:'apply',objective:'Choose one action that aligns more closely with what matters.'})
    ]),
    units:Object.freeze([
      'Values, identity and perspective','What matters to you and why','Stories you tell about yourself','Belonging and individuality','Values under pressure','Who you are with different people','What you admire in others','Identity is not fixed','Personal meaning in everyday life','Living with more alignment',
      'How culture shapes perspective','What success means to you','Roles, labels and self-concept','Whose voice are you hearing?','Beliefs you inherited','What kind of person are you becoming?','Values in conflict','Comparing yourself with others','Social expectations and the self','Self-definition without certainty',
      'Integrity in ordinary choices','How media influences self-view','Who gets to define normal?','Personal freedom and constraint','Meaning after disappointment','When your values change','Balancing authenticity and safety','Identity and belonging online','Living with contradiction','Admiration, envy and aspiration',
      'How groups influence judgment','Moral discomfort and reflection','Agency in a complex world','Seeing beyond your own lens','Using values to guide choices','Identity after change','What kind of future fits you','Ordinary courage and conviction','Living by values with flexibility','Identity and values in everyday life'
    ])
  })
});

export const otherTrailWorldIds = Object.freeze(Object.keys(WORLD_DATA));
export const otherTrailWorldMeta = WORLD_DATA;
export const otherTrailStoneGroups = Object.freeze(Object.fromEntries(otherTrailWorldIds.map(worldId => {
  const stones = WORLD_DATA[worldId].stoneMeta;
  return [worldId, Object.freeze(Object.fromEntries(stones.map((stone, stoneIndex) => {
    const offset = STONE_SPLITS.slice(0, stoneIndex).reduce((a,b)=>a+b,0);
    return [stone.id, Object.freeze(Array.from({length:STONE_SPLITS[stoneIndex]}, (_, lessonIndex) => `${worldId}-${stone.id}-${lessonIndex+1}`))];
  })))]
})));

function buildUnit(worldId, title, number){
  const chapter = Math.floor((number-1)/5)+1;
  const stones = WORLD_DATA[worldId].stoneMeta;
  const steps = STEP_KINDS.map((kind, index) => {
    const stoneIndex = index < 3 ? 0 : index < 6 ? 1 : index < 8 ? 2 : index === 8 ? 3 : 4;
    const stone = stones[stoneIndex];
    const withinStone = index - (stoneIndex===0?0:stoneIndex===1?3:stoneIndex===2?6:stoneIndex===3?8:9) + 1;
    return Object.freeze({
      id:`${worldId}-unit-${number}-lesson-${index+1}`,
      lessonId:`${worldId}-${stone.id}-${withinStone}`,
      kind,
      label:STEP_META[kind].label,
      title:`${STEP_META[kind].verb} · ${title}`,
      detail:STEP_META[kind].summary,
      world:worldId,
      unit:number,
      chapter,
      stoneId:stone.id,
      stoneTitle:stone.title,
      objective:stone.objective,
      availability:'available'
    });
  });
  const stoneObjects = stones.map((stone, stoneIndex) => {
    const offset = STONE_SPLITS.slice(0, stoneIndex).reduce((a,b)=>a+b,0);
    const slice = steps.slice(offset, offset + STONE_SPLITS[stoneIndex]);
    return Object.freeze({
      id:stone.id,
      number:stoneIndex+1,
      title:stone.title,
      kind:stone.type,
      lessonCount:STONE_SPLITS[stoneIndex],
      objective:stone.objective,
      lessonIds:Object.freeze(slice.map(step => step.id)),
      availability:'available'
    });
  });
  return Object.freeze({
    id:`${worldId}-unit-${number}`,
    world:worldId,
    number,
    chapter,
    title,
    availability:'available',
    steps:Object.freeze(steps),
    stones:Object.freeze(stoneObjects)
  });
}

export const otherTrailCurricula = Object.freeze(Object.fromEntries(otherTrailWorldIds.map(worldId => [
  worldId,
  Object.freeze(WORLD_DATA[worldId].units.map((title, index) => buildUnit(worldId, title, index+1)))
])));

export function getOtherTrailUnit(worldId, unitNumber){
  return otherTrailCurricula[worldId]?.find(unit => unit.number === Number(unitNumber)) || null;
}
export function getOtherTrailStep(worldId, unitNumber, lessonNumber){
  return getOtherTrailUnit(worldId, unitNumber)?.steps?.[Number(lessonNumber)-1] || null;
}
export function getOtherTrailManifest(worldId){
  return Object.freeze({
    world:worldId,
    chapters:8,
    units:40,
    stepsPerUnit:10,
    stonesPerUnit:5,
    reviewStatus:'full-outline',
    theme:WORLD_DATA[worldId]?.theme || ''
  });
}
