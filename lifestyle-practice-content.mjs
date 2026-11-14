// Everyday skills are practised, not measured. The levels describe an
// optional progression of ACTUAL TASK DEMANDS, not a user's psychological score.
// Each task is a specific, low-stakes invitation that can be skipped or adjusted.
const tracks = [
 {id:'communication',name:'Communication',domain:'Relationships',becoming:'Someone who can communicate more openly',supports:['Clarity','Connection'],why:'Practise asking and expressing rather than making other people guess.',levels:[
  ['Ask one genuine follow-up question instead of assuming you understood.','Summarise what someone said before adding your view.','Tell someone one detail about your day without waiting to be asked.'],
  ['Ask for clarification when a message feels ambiguous.','Say which option you prefer when making a small shared plan.','Give specific feedback about what worked in a conversation.'],
  ['Raise a manageable concern using one example instead of a character judgement.','Ask someone what kind of support they actually want.','Tell a trusted person when you need more time to answer.'],
  ['Have a calm conversation you have been postponing, if it is safe to do so.','Repair a misunderstanding by describing what you meant and checking what they heard.','Explain a genuine disagreement while making room for the other person to respond.']
 ]},
 {id:'boundaries',name:'Boundaries',domain:'Relationships',becoming:'Someone who protects their time and needs fairly',supports:['Self-respect','Assertiveness'],why:'Practise a clear limit rather than waiting until resentment makes it harder.',levels:[
  ['Pause for five minutes before saying yes to a non-urgent request.','Notice one small request you would usually agree to automatically.','Name one activity you want to protect time for today.'],
  ['Say “Let me think about it” once instead of answering on the spot.','Tell someone the time you can realistically offer, rather than an unlimited yes.','Choose not to justify a harmless preference beyond one sentence.'],
  ['Decline a manageable request you genuinely cannot take on.','Ask to change a plan that no longer fits your capacity.','Tell a trusted person one boundary you would like them to understand.'],
  ['State a recurring limit calmly and explain what you will do if it is crossed.','Renegotiate one responsibility that has become uneven.','Ask for a specific change in how a familiar disagreement is handled.']
 ]},
 {id:'vulnerability',name:'Vulnerability',domain:'Relationships',becoming:'Someone who can be known without performing',supports:['Trust','Connection'],why:'Practise chosen openness with people who have earned trust, not indiscriminate disclosure.',levels:[
  ['Share one ordinary preference that you usually keep to yourself.','Tell someone you enjoyed spending time with them.','Name one feeling to yourself without replacing it with a joke.'],
  ['Tell a trusted person something you have been looking forward to.','Ask for a small amount of practical help rather than doing everything alone.','Admit to a trusted person that you do not know something.'],
  ['Tell a supportive person that something has been difficult, without minimising it.','Ask a trusted person for the kind of comfort you actually need.','Share a hope you have been reluctant to mention with someone safe.'],
  ['Have a considered conversation about a need you usually hide, if the relationship feels safe.','Acknowledge a mistake to the affected person and name what you will change.','Express an important feeling clearly without demanding a particular reaction.']
 ]},
 {id:'compassion',name:'Compassion',domain:'Relationships',becoming:'Someone who notices and responds to need',supports:['Kindness','Perspective-taking'],why:'Make care specific to another person’s circumstances, including your own limits.',levels:[
  ['Thank someone for a routine contribution you usually overlook.','Let somebody finish speaking without offering a solution immediately.','Notice one person whose work makes your day easier.'],
  ['Ask one person whether they want support or simply to be heard.','Offer a small practical help you genuinely have capacity to give.','Assume a neutral explanation once when someone makes a harmless mistake.'],
  ['Check in with someone who may be isolated without requiring an immediate reply.','Adapt a shared plan to make it easier for someone with different needs to participate.','Offer a specific, realistic act of help rather than a vague promise.'],
  ['Respond to a difficult difference with a question before making a judgement.','Help someone access a useful resource while respecting their right to decline.','Follow through on a thoughtful commitment to another person without overextending yourself.']
 ]},
 {id:'gratitude',name:'Gratitude',domain:'Relationships',becoming:'Someone who notices what is sustaining them',supports:['Appreciation','Attention'],why:'Notice what has helped without forcing yourself to feel happy or indebted.',levels:[
  ['Name one small convenience that made today easier.','Notice a person who did something helpful, even if they will never know.','Write down one thing you appreciated without adding “but”.'],
  ['Tell somebody one specific thing they did that you valued.','Spend a minute noticing a place you find comfortable.','Recall a recent moment that mattered without comparing it with another.'],
  ['Send a specific thank-you message to somebody who has made a difference.','Tell someone how their ordinary effort affects your day.','Keep a brief record of what has supported you during a difficult week.'],
  ['Express appreciation directly to somebody whose impact you have rarely named.','Make time to care for something you have benefited from but neglected.','Acknowledge both what you value and what still needs to change in a difficult situation.']
 ]},
 {id:'self-trust',name:'Self-trust',domain:'Inner skills',becoming:'Someone who can make and revise their own decisions',supports:['Decisiveness','Autonomy'],why:'Build trust in your reasoning through bounded choices, rather than seeking perfect certainty.',levels:[
  ['Make one small reversible choice without asking for anyone else to decide.','Write your own preference before looking at reviews for a low-cost item.','Notice a choice you have already made responsibly today.'],
  ['Give a low-stakes decision five minutes, then choose.','Use one reasonable source rather than endlessly comparing a small purchase.','Keep a harmless decision once you have a clear reason for it.'],
  ['Make one manageable choice without asking for reassurance after it.','Tell someone what you prefer before asking what they prefer.','Finish a low-stakes task at a standard you set in advance.'],
  ['Follow through on an important but reversible decision based on defined criteria.','Make a considered decision while accepting that some uncertainty remains.','Review a past error for one lesson without treating it as proof you cannot decide.']
 ]},
 {id:'emotional-awareness',name:'Emotional awareness',domain:'Inner skills',becoming:'Someone who understands feelings without being ruled by them',supports:['Self-understanding','Regulation'],why:'Name emotions and needs before jumping to a story about their cause.',levels:[
  ['Pause and name the emotion closest to what you feel right now.','Notice whether tiredness or hunger is adding to your mood.','Describe a feeling without using “good” or “bad”.'],
  ['Notice where an emotion appears in your body, if comfortable.','Identify what happened immediately before a noticeable mood shift.','Name two feelings that can exist together in one situation.'],
  ['Describe what an emotion is urging you to do and whether you want to follow it.','Separate a feeling from the interpretation you have attached to it.','Ask what need might be underneath a strong reaction.'],
  ['Before a difficult conversation, name the feeling and the request it points toward.','Revisit a repeated emotional pattern and identify one condition that changes it.','Choose a considered response when a strong emotion suggests acting immediately.']
 ]},
 {id:'self-compassion',name:'Self-compassion',domain:'Inner skills',becoming:'Someone who treats themselves fairly under strain',supports:['Kindness','Recovery'],why:'Respond to difficulty with useful care and honest responsibility instead of self-attack.',levels:[
  ['Describe one mistake without calling yourself a name.','Allow yourself a short rest without having to earn it.','Notice the tone of your inner commentary when something goes wrong.'],
  ['Replace one insult toward yourself with a specific, useful instruction.','Give yourself the same reasonable break you would give a friend.','Name what was difficult about today without making it a verdict about you.'],
  ['Respond to a setback by identifying the support or adjustment you need.','Stop one round of unnecessary self-punishment after a proportionate repair.','Let an imperfect but completed task count as completed.'],
  ['Challenge a longstanding rule that makes ordinary human needs feel shameful.','Practise caring for yourself through a disappointment without pretending it is fine.','Ask for support with a difficulty instead of insisting you should cope alone.']
 ]},
 {id:'self-worth',name:'Self-worth',domain:'Inner skills',becoming:'Someone whose worth is not decided by every reaction',supports:['Dignity','Confidence'],why:'Practise distinguishing your value as a person from external rankings and daily results.',levels:[
  ['Notice one moment when you measure yourself against somebody else.','Write one quality you value that is not an achievement.','Let a small compliment arrive without arguing it away.'],
  ['Record one concrete thing you handled without dismissing it as luck.','Avoid checking for reactions after sharing one low-stakes message.','Choose an outfit or activity because it suits you, not only because it impresses others.'],
  ['State a harmless preference even when a person might not share it.','Let one ordinary piece of work stand without asking whether it makes you impressive.','When someone disagrees, describe the disagreement without concluding you are inadequate.'],
  ['Make a meaningful choice based on your values rather than an imagined audience.','Revisit a painful judgement and separate the observable behaviour from the global label.','Allow yourself to be a beginner in front of someone without using it as evidence against yourself.']
 ]},
 {id:'acceptance',name:'Acceptance',domain:'Inner skills',becoming:'Someone who can make room for what cannot be changed',supports:['Flexibility','Peace with limits'],why:'Accepting a reality is not the same as approving it or giving up on possible change.',levels:[
  ['Name one small inconvenience without demanding that it should not exist.','Allow a passing feeling to be present without instantly fixing it.','Notice a limit that deserves respect today.'],
  ['Let a minor disappointment be disappointing without turning it into a whole-day verdict.','Separate the part of a problem you can change from the part you cannot.','Practise saying “This is how it is right now” about one harmless frustration.'],
  ['Allow a conversation to end with a difference in opinion when no decision is required.','Make a plan that works around a real constraint rather than denying it.','Acknowledge an unwanted feeling while still doing one valued activity.'],
  ['Recognise the cost of pursuing an answer that may not be available.','Choose a value-consistent next step despite an unresolved personal question.','Let go of one unrealistic demand on yourself while keeping a responsible goal.']
 ]},
 {id:'uncertainty',name:'Uncertainty tolerance',domain:'Anxiety skills',becoming:'Someone who can act with unanswered questions',supports:['Freedom to act','Adaptability'],why:'Practise responding to manageable uncertainty without removing essential safety checks.',levels:[
  ['Leave one harmless question unanswered for five minutes.','Wait ten minutes before rechecking an optional, non-urgent notification.','Make a reversible choice without comparing every possible alternative.'],
  ['Let a non-urgent message wait fifteen minutes when no reply is owed immediately.','Finish a low-stakes decision without requesting another opinion.','Avoid reopening a harmless review page after choosing an option.'],
  ['Allow a minor uncertainty to remain open during an ordinary activity.','Make a low-risk decision with enough information rather than a guarantee.','Delay one repetitive, non-safety reassurance check when you already have the answer.'],
  ['Carry a meaningful but manageable unresolved question into tomorrow.','Act on a well-considered plan while acknowledging its outcome is uncertain.','Practise ending a low-stakes planning session at a pre-agreed stopping point.']
 ]},
 {id:'courage',name:'Courage',domain:'Anxiety skills',becoming:'Someone willing to take meaningful, manageable risks',supports:['Confidence','Initiative'],why:'Choose a small valued act in the presence of uncertainty, not danger for its own sake.',levels:[
  ['Ask one question you would usually keep to yourself in a supportive setting.','Begin a friendly conversation with someone you already know.','Try a small unfamiliar activity where mistakes are safe.'],
  ['Offer an honest opinion about a low-stakes topic.','Ask somebody for a small piece of information rather than guessing.','Volunteer for a manageable task that feels slightly unfamiliar.'],
  ['Voice a respectful disagreement when the setting is safe.','Make a reasonable request despite the chance of hearing no.','Share a piece of imperfect work with a supportive person.'],
  ['Have a previously avoided but safe conversation about an important issue.','Take a meaningful, reversible step toward a goal despite nerves.','Apply for an opportunity that matters even without feeling completely ready.']
 ]},
 {id:'resilience',name:'Resilience',domain:'Anxiety skills',becoming:'Someone who can recover and adapt after setbacks',supports:['Recovery','Problem-solving'],why:'Recovering well may involve rest, support and changing conditions, not enduring everything alone.',levels:[
  ['Name one thing that helped you through a difficult moment.','Take one restorative break before becoming completely depleted.','Notice one small obstacle you have already navigated today.'],
  ['After a mistake, identify one practical adjustment instead of a self-judgement.','Ask for help with one difficulty rather than struggling alone.','Resume a useful routine after a missed day without starting a punishment.'],
  ['Make a gentle recovery plan after a setback, including realistic rest.','Review a disappointment for one thing you could do differently next time.','Revisit a manageable task after taking time to regulate.'],
  ['Renegotiate an unsustainable demand instead of simply pushing harder.','Take a small informed step after a setback that dented your confidence.','Use support and a revised plan to continue a goal that still matters to you.']
 ]},
 {id:'flexibility',name:'Flexibility',domain:'Anxiety skills',becoming:'Someone who can change course without losing themselves',supports:['Adaptation','Perspective'],why:'Notice when one preferred plan has become the only acceptable plan.',levels:[
  ['Try a different order for two harmless tasks.','Consider one alternative explanation for a frustrating delay.','Allow a small change in plans without immediately judging the whole day.'],
  ['Choose a different reasonable way to complete an ordinary task.','Ask someone how they would approach a problem before explaining your method.','Adapt a low-stakes plan when a better option appears.'],
  ['Revise a decision when new information genuinely changes the evidence.','Let somebody else lead one shared low-stakes activity.','Replace an unworkable plan with a smaller version that still serves the goal.'],
  ['Reconsider a personal rule that no longer fits your circumstances.','Have a thoughtful conversation with someone whose perspective differs from yours.','Change a valued plan responsibly after noticing a meaningful new constraint.']
 ]},
 {id:'presence',name:'Presence',domain:'Attention skills',becoming:'Someone who pays attention to the life in front of them',supports:['Attention','Connection'],why:'Practise choosing where attention goes rather than trying to force constant calm.',levels:[
  ['Spend one minute noticing the sounds around you without rating them.','Put your phone away during the first few minutes of one meal.','Give one short conversation your full attention.'],
  ['Take a short walk noticing your surroundings rather than checking a screen.','Listen to a piece of music without doing another task at the same time.','Spend five minutes on an ordinary activity without tracking your performance.'],
  ['Notice the urge to switch tasks and choose deliberately whether to follow it.','Give someone ten minutes of undivided attention when you both want to talk.','Enjoy an ordinary moment without posting or recording it.'],
  ['Protect a meaningful block of focused time from optional interruptions.','Return attention to a conversation when you notice yourself monitoring your impression.','Choose a daily moment of presence even on a busy or emotionally difficult day.']
 ]},
 {id:'reflection',name:'Reflection',domain:'Attention skills',becoming:'Someone who learns from experience without endless analysis',supports:['Learning','Self-awareness'],why:'Keep reflection bounded and connected to action rather than repeatedly judging the past.',levels:[
  ['Name one useful thing you noticed about today.','Write down what happened before deciding what it means.','Ask yourself what you needed in one difficult moment.'],
  ['Separate one recent observation from the story you told about it.','Notice what helped or hindered an ordinary task.','Identify one small choice that matched a value you care about.'],
  ['Review a recurring pattern and the circumstances in which it changes.','Write one fair alternative to a harsh interpretation of your behaviour.','Turn a lesson from a difficult experience into one specific plan.'],
  ['Test one personal hypothesis with a harmless real-world experiment.','Reflect on a meaningful decision using evidence, values and a practical next step.','End an analysis session when you have one usable insight and a stopping point.']
 ]}
];

const identityPresets=[
 {id:'courageous',label:'More courageous',description:'Act with care, even when you feel uncertain.',skills:['courage','uncertainty','boundaries']},
 {id:'self-trusting',label:'More self-trusting',description:'Make choices that belong to you.',skills:['self-trust','self-worth','reflection']},
 {id:'compassionate',label:'More compassionate',description:'Notice needs and respond with care.',skills:['compassion','gratitude','self-compassion']},
 {id:'connected',label:'More connected',description:'Build honest, reciprocal relationships.',skills:['communication','vulnerability','presence']},
 {id:'grounded',label:'More grounded',description:'Understand feelings and find your footing.',skills:['emotional-awareness','acceptance','resilience']},
 {id:'adaptable',label:'More adaptable',description:'Meet change without abandoning your values.',skills:['flexibility','uncertainty','reflection']},
 {id:'authentic',label:'More yourself',description:'Show up without constantly performing.',skills:['self-worth','boundaries','vulnerability']},
 {id:'thoughtful',label:'More thoughtful',description:'Pay attention and act with consideration.',skills:['reflection','compassion','presence']}
];

export const practiceSkills=Object.freeze(tracks.map(skill=>Object.freeze({
 ...skill,levels:Object.freeze(skill.levels.map((tasks,levelIndex)=>Object.freeze(tasks.map((task,index)=>Object.freeze({
 id:`${skill.id}-l${levelIndex+1}-${index+1}`,skillId:skill.id,level:levelIndex+1,task,source:'practice'
 })))))
})));
export const practiceIdentities=Object.freeze(identityPresets.map(identity=>Object.freeze({...identity,skills:Object.freeze(identity.skills)})));
export const practiceSkillMap=new Map(practiceSkills.map(skill=>[skill.id,skill]));
export const practiceIdentityMap=new Map(practiceIdentities.map(identity=>[identity.id,identity]));
if(practiceSkills.length!==16 || practiceIdentities.length!==8 ||
 practiceSkills.some(item=>item.levels.length!==4||item.levels.some(level=>level.length!==3)))
 throw new Error('Identity practice needs 16 skills, each with four levels and three specific actions.');

export const kindnessSkillCategories=Object.freeze({
 'Reach out':'communication','Make life easier':'compassion',
 'Notice and thank':'gratitude','Share something useful':'compassion',
 'Community care':'compassion','Care for the environment':'compassion',
 'Make things more inclusive':'compassion','Small kindness':'compassion'
});
