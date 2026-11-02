// Practical behaviour-design and cognitive prompts for the Intervention Book.
// They adapt selected BCTTv1 and RANAS methods. The library deliberately omits
// coercion, deprivation, punishment and disorder-specific protocols.
const chapterModels = {
 mornings:{purpose:'make the next morning more workable, not prove that you are disciplined',bias:'the “all or nothing” rule that says a full routine or no routine are the only options',alternative:'sleep opportunity, health, sensory load, travel demands and decision load can all shape a difficult morning',test:'Try the minimum version on one low-capacity morning. Compare leaving the bed or home with your usual approach.'},
 sleep:{purpose:'create kinder conditions for rest, rather than force sleep',bias:'the prediction that one difficult night determines tomorrow or the next night',alternative:'sleep is affected by schedule, light, noise, health, medication, stress and opportunity—not just effort',test:'For three evenings, record the wind-down condition you changed and the next-day effect without chasing a perfect score.'},
 starting:{purpose:'make one valued task easier to enter',bias:'the belief that a task must feel clear, important and manageable before it can begin',alternative:'uncertainty, missing information, fear of evaluation, low reward or missing materials may be the actual obstacle',test:'Make a deliberately rough two-minute first attempt. Record whether starting changed clarity or only confirmed a barrier.'},
 attention:{purpose:'make returning to the task easier, rather than demand uninterrupted concentration',bias:'the rule that a lapse means the whole focus period has failed',alternative:'fatigue, pain, interest, sensory load, interruptions and task ambiguity affect attention',test:'Use one return cue for a single work period and count returns, not minutes of perfect focus.'},
 habits:{purpose:'build a repeatable action that still fits real life',bias:'the streak rule that one miss erases previous learning',alternative:'a missed attempt can reveal a weak cue, high friction or an unrealistic target',test:'After the next miss, restart at the next cue using the smallest version and note what made it easier or harder.'},
 overwhelm:{purpose:'protect capacity and reduce what is genuinely too much',bias:'urgency bias—treating the loudest demand as the most consequential one',alternative:'the problem may be workload, missing authority, competing deadlines or insufficient support—not personal efficiency',test:'Triage one day’s list into “must move”, “can wait”, and “needs renegotiating”; compare the load afterward.'},
 worry:{purpose:'take proportionate action without requiring certainty',bias:'probability neglect or treating a vivid possibility as if it were the most likely outcome',alternative:'some uncertainty is unsolvable now; a question may need a check time instead of more thinking',test:'Separate one worry into known facts, plausible possibilities and the next checkable action. Re-rate its urgency afterward.'},
 lowmood:{purpose:'create a little contact, care or movement that is possible today',bias:'the prediction that action is pointless unless it immediately feels good',alternative:'low motivation can be part of low mood, pain, exhaustion, isolation or practical burden',test:'Try one tolerable, values-linked activity for ten minutes and record contact or mastery separately from enjoyment.'},
 emotions:{purpose:'make room for a feeling while choosing the next safe action',bias:'emotional reasoning—assuming that because a feeling is intense, its interpretation must be fully true',alternative:'an emotion can contain useful information and still be amplified by fatigue, threat, past learning or context',test:'Name the feeling, its action urge and one fact. Delay one non-urgent response until the intensity shifts slightly.'},
 selftalk:{purpose:'use standards that help you learn without treating worth as a performance score',bias:'negative filtering and global labelling—using one mistake as evidence about the whole self',alternative:'a hard outcome may reflect skill, timing, resources, chance or a specific decision rather than identity',test:'For one self-criticism, write the standard, the evidence for it, what is missing, and one repair action.'},
 decisions:{purpose:'make a good-enough, values-aware choice with the information available',bias:'maximising and anticipated-regret bias—the demand to find a choice that eliminates all loss or doubt',alternative:'several options may be acceptable; waiting may have a cost as well as choosing',test:'Choose one reversible next step using two criteria and a deadline; review what information it produced.'},
 relationships:{purpose:'make the meaning of an interaction clearer before reacting',bias:'mind-reading and attribution bias—assuming intent from an ambiguous action',alternative:'the other person may be distracted, limited, using different language or responding to a context you cannot see',test:'Ask one neutral clarifying question in a low-stakes misunderstanding before stating your interpretation.'},
 boundaries:{purpose:'protect time, energy or safety while remaining connected where you choose',bias:'catastrophising the social cost of a clear limit',alternative:'guilt may reflect a learned rule about availability, not evidence that the request is fair or sustainable',test:'Use a small, respectful limit with a low-stakes request and observe the actual response rather than the predicted one.'},
 connection:{purpose:'create a form of contact that feels possible and reciprocal',bias:'the conclusion that a lack of current contact proves you are unwanted or incapable of closeness',alternative:'opportunity, confidence, location, energy, social history and shared activity shape connection',test:'Make one specific, low-pressure invitation or reply and record what happens without using one response as a verdict.'},
 sensory:{purpose:'make the environment less costly and more predictable',bias:'the belief that discomfort must be endured to count as coping',alternative:'sensory needs vary with fatigue, pain, stress and setting; an adjustment may be reasonable rather than avoidance',test:'Change one input—sound, light, texture, crowding or transition time—and compare the after-cost.'},
 energy:{purpose:'spend limited energy on what matters and protect recovery',bias:'the productivity rule that rest must be earned and low energy means failure',alternative:'energy varies with health, sleep, care load, pain, medication, stress and access to support',test:'Use an energy budget for one day: choose one essential, one meaningful and one recovery activity; review the cost.'},
 digital:{purpose:'use technology intentionally while meeting the need the device was serving',bias:'the self-blame story that a device habit proves weak willpower',alternative:'design features, boredom, avoidance, loneliness, fatigue and unclear tasks can all increase automatic checking',test:'Before one app opening, name the intended action and use a visible stopping cue. Notice the need that remains afterward.'},
 home:{purpose:'make everyday tasks visible, lighter and easier to restart',bias:'the standard that a home must be fully controlled before it can be restful or acceptable',alternative:'task volume, executive load, shared responsibility, storage and available time shape the state of a home',test:'Choose one reset zone and one 10-minute timer. Compare the effect of a contained reset with trying to “do the house.”'},
 values:{purpose:'move toward a chosen direction without waiting for a perfect life plan',bias:'the belief that uncertainty means you have no values or that a value must become a large achievement',alternative:'values can be enacted in small actions and can change with roles, constraints and learning',test:'Name one value, one tiny action that expresses it this week, and one sign that it still feels chosen.'},
 grief:{purpose:'make space for loss while staying connected to what is still meaningful',bias:'the rule that grief should follow a schedule or that a better day means the loss mattered less',alternative:'grief can include longing, anger, relief, numbness and changing needs; there is no single correct pattern',test:'Choose one contained way to remember or receive support, then notice whether it feels connecting, costly or both.'}
};

const cueFor = {
 mornings:'Place the item or note exactly where the first action happens: by the alarm, bed or doorway.',
 sleep:'Attach the first wind-down action to a reliable evening cue, such as putting down the evening meal plate.',
 starting:'Put only the first material in view and hide the competing first choice until the small start is complete.',
 attention:'Leave a visible “return point” sentence at the task before any break or interruption.',
 habits:'Attach the smallest version to an existing stable cue, not a time you often miss.',
 overwhelm:'Keep one short triage list visible; move non-priorities off the active surface.',
 worry:'Use one note labelled “next check time” so the worry has a home outside your head.',
 lowmood:'Place one tolerable activity or contact option where it is easy to begin, not in a long choice list.',
 emotions:'Create a pause cue before replying: a glass of water, timer, draft folder or step outside.',
 selftalk:'Keep a repair-question note where criticism tends to appear: “What is specific? What is the next repair?”',
 decisions:'Use a one-page decision note rather than reopening every option in multiple apps or messages.',
 relationships:'Choose a lower-pressure setting or channel for the conversation and remove competing screens.',
 boundaries:'Save a pause phrase in your notes app or use a calendar check before answering non-urgent requests.',
 connection:'Put one contact prompt beside an existing routine and make the invitation specific rather than open-ended.',
 sensory:'Set up the adjustment before the demanding setting: headphones, seating, lighting, exit route or transition time.',
 energy:'Put the essential and recovery activity on the same visible plan so recovery is not treated as optional.',
 digital:'Move the tempting app from the first screen and place the intended task or contact in its place.',
 home:'Keep the needed cleaning or reset item in the zone where it is used, in an accessible and visible place.',
 values:'Put the chosen values action in the calendar or next-actions list beside the role it belongs to.',
 grief:'Choose a gentle cue for a contained memory or support practice, with a clear stop point afterward.'
};

const supportFor = {
 relationships:'Ask for a shared meaning check, not for someone to guess your whole experience.',
 boundaries:'Ask a trusted person to support the limit you chose rather than pressure you to say yes.',
 connection:'Ask one person for a specific kind of contact: company, a walk, a call, practical help or quiet co-presence.',
 grief:'Ask for a specific form of support and a time boundary: listening, company, a practical task or space.',
 sensory:'Tell someone the adjustment that helps; accessible conditions do not need to be earned.',
 overwhelm:'Ask the person who controls the demand to help triage, reduce scope or move a deadline.',
 sleep:'Negotiate one realistic environmental condition that protects the rest opportunity.',
 default:'If another person is involved, ask for a concrete form of practical or emotional support. Keep the plan voluntary and specific.'
};

function compact(text){return String(text).replace(/[.]+$/,'').toLowerCase();}
export function behaviourFor(entry,chapterId){
 const m=chapterModels[chapterId], action=compact(entry.instruction).split('.')[0];
 const cue=cueFor[chapterId]||cueFor.habits;
 const support=supportFor[chapterId]||supportFor.default;
 return [
  {code:'BCT 1.1',label:'Name one observable action',text:`Turn this guide into one action you can see or hear: “${action}.” Do not use a feeling, identity or outcome as the action.`},
  {code:'BCT 1.4 · RANAS 32',label:'Plan the moment',text:`Write: “After/before ___, at ___, I will ___ for/about ___.” Choose a realistic cue, place and duration. Make the first attempt smaller than the ideal version.`},
  {code:'BCT 1.2 · RANAS 36',label:'Plan for the likely barrier',text:`Name the most likely obstacle—not every imaginable one. Complete: “If ___ happens, I will ___ instead.” A smaller version, a delay, help request or different setting can count.`},
  {code:'BCT 7.1 + 12.1/12.2 · RANAS 37/38',label:'Change the conditions',text:cue},
  {code:'BCT 2.3 + 1.5 · RANAS 33–35',label:'Notice and review',text:'Record one simple marker after the next few attempts: did it happen, what got in the way, and what helped? Review the plan after three opportunities. Adapt the system; do not turn the record into a pass/fail score.'},
  {code:'BCT 3.1/3.2 + 8.7 · RANAS 27/28',label:'Use support or a graded version',text:`${support} If the full action is too much, practise a safe, easier version first and build only when it is genuinely workable.`}
 ];
}

export function cognitiveFor(entry,chapterId){
 const m=chapterModels[chapterId];
 return [
  {label:'Make the appraisal more accurate',text:`When this problem appears, separate what happened from what it seemed to mean. Watch for ${m.bias}. Ask: “What facts would a fair observer see? What am I adding, predicting or assuming?”`},
  {label:'Look for another explanation',text:`Consider this as well: ${m.alternative}. You do not have to choose the most comforting explanation—only avoid treating the harshest one as the only explanation.`},
  {label:'Connect the action to a value or purpose',text:`The purpose here is to ${m.purpose}. Ask which value the smallest action could serve—care, stability, honesty, learning, connection, autonomy, creativity or something else—and whether it is truly yours.`},
  {label:'Separate identity from a moment',text:`Try “I am noticing a difficult pattern in this context” rather than “I am a person who always/never ___.” Describe the situation, demand and skill gap before turning one episode into a self-definition.`},
  {label:'Run a small belief test',text:`Prediction: “If I try this, ___ will happen.” ${m.test} Keep the result as data. A result can support, revise or complicate the prediction; it does not have to prove a global belief true or false.`}
 ];
}

export const methodSources=[
 ['Behaviour Change Technique Taxonomy v1 (93 techniques)','https://pubmed.ncbi.nlm.nih.gov/23512568/'],
 ['RANAS approach: risk, attitudes, norms, abilities and self-regulation','https://www.ranasmosler.com/ranas'],
 ['Behaviour Change Technique Ontology (updated terminology)','https://pubmed.ncbi.nlm.nih.gov/37593567/']
];
