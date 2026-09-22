const VERSION = "NS Personal Psychological Guide 1.4 · Evidence-gated adaptive edition";
const DRAFT_KEY = "nobodys-simple-full-profile-draft-v3";
const STATE_KEY = "nobodys-simple-profile-state-checkins-v1";

/* The compact route keeps one anchor item for every construct, then spends
 * its limited repeat-item budget on the constructs that most often combine
 * into the profile story. This is a deliberate short-form design choice:
 * the full description cards remain available, while fewer clicks are
 * required for a first-pass map. */
const COMPACT_PAIR_IDS = new Set([
  "stimulation","intellectual-curiosity","uncertainty-intolerance",
  "adaptability","persistence","effortful-control",
  "sensory-orienting","sensory-overload","sociability","social-boldness",
  "rel-intimacy","rel-autonomy","orderliness","decision-deliberation"
]);
const COMPACT_VALUE_ROUNDS = 10;
const FOLLOWUP_BUDGET = 3;
let followupCount = 0;
let motiveFollowupsQueued = false;

const T7 = [
  ["0","Not at all like me"],["1","Very unlike me"],["2","Somewhat unlike me"],
  ["3","Mixed / depends strongly on the situation"],["4","Somewhat like me"],
  ["5","Very like me"],["6","Extremely like me"]
];
const I5 = [["0","Not at all"],["1","Slightly"],["2","Moderately"],["3","Strongly"],["4","Extremely"]];
const F5 = [["0","Never or almost never"],["1","Rarely"],["2","Sometimes"],["3","Often"],["4","Almost always"]];
const N5 = [["0","Not true at all"],["1","Slightly true"],["2","Moderately true"],["3","Very true"],["4","Completely true"]];
const S5 = [["0","Not at all"],["1","A little"],["2","Moderately"],["3","Strongly"],["4","Extremely"]];

/*
 * The report deliberately keeps four kinds of evidence separate.  These
 * labels are also used by the evidence explorer so a reader can see what is
 * an item-based estimate, what was a direct preference, what came from a
 * scenario and what describes only the current moment.
 */
const EVIDENCE_META = {
  measured: {label:"Supported within-assessment pattern",symbol:"●●",tip:"Two or more candidate items converge within this session. It is not normed or population-validated."},
  preliminary: {label:"Preliminary scale signal",symbol:"●",tip:"Candidate items lean in one direction but need more evidence or lived observation."},
  direct: {label:"Direct answer",symbol:"○",tip:"An explicit choice or rating. It describes a preference, not an ability or outcome."},
  scenario: {label:"Scenario evidence",symbol:"◆",tip:"A response to a hypothetical situation; it is not evidence of what happened in real life."},
  state: {label:"Current state",symbol:"◇",tip:"A right-now snapshot; it is not a stable personality estimate."},
  derived: {label:"Derived synthesis",symbol:"▲",tip:"A transparent combination of answers. It is an interpretation, not a validated interaction."},
  hypothesis: {label:"Hypothesis to test",symbol:"△",tip:"A provisional idea to confirm, refine or reject with lived experience."},
  insufficient: {label:"Insufficient evidence",symbol:"?",tip:"There were not enough answers for a directional description."}
};
/* Central semantic guardrails for constructs whose high/low wording is easy
 * to invert in a generated report.  Item keys are still the scoring source;
 * these notes make the intended interpretation explicit in one place. */
const DIRECTION_GUIDE = {
  "effortful-control": {high:"more deliberate steering capacity",low:"more effort needed to redirect or begin"},
  "negative-urgency": {high:"more action-speed under unpleasant emotion",low:"more room to pause under unpleasant emotion"},
  "positive-urgency": {high:"more action-speed under excitement",low:"more stable decision pace under excitement"},
  "self-worth-stability": {high:"more stable self-worth across feedback",low:"more outcome-sensitive self-worth"},
  "uncertainty-intolerance": {high:"more attention captured by unresolved uncertainty",low:"more room to continue while outcomes stay open"},
  "regulation-flexibility": {high:"more context-matched strategy switching",low:"more reliance on one strategy across contexts"}
};

/* These families keep related constructs visible without pretending that
 * adjacent labels are independent psychological species. */
const CONSTRUCT_FAMILIES = {
  "uncertainty-intolerance":["conflict-anxiety","anxiousness","need-for-closure","ambiguity-tolerance","planning-dependence"],
  "effortful-control":["initiation","sustainment","persistence","diligence","thoroughness"],
  "reward":["reward-response","goal-drive","stimulation","exploration"],
  "agency":["assertiveness","personal-agency","autonomy in closeness"],
  "rel-reassurance":["attachment-anxiety","reassurance-seeking","rel-repair"],
  "status-orientation":["status","money-status","achievement","money-security"],
  "masking":["self-monitoring","impression-management","contextual-consistency"],
  "persistence":["sustainment","diligence","learning-persistence"]
};

/* A mixed scale is not thrown away.  It opens a short “what changes this?”
 * discriminator so the answer can become conditional information. */
const DISCRIMINATOR_BANK = {
  sociability:["How well I know the people","How much energy I have","How noisy or busy the setting is","Whether I have a role or purpose there","How safe or judged I feel","How interested I am in the people","Group size","It genuinely varies without a clear pattern"],
  "social-boldness":["Authority or status in the room","How much I know about the topic","Relationship closeness","Fear of being judged","The size of the group","Whether I have a clear reason to speak","My energy that day","It genuinely varies without a clear pattern"],
  assertiveness:["How close I am to the people involved","Whether I know I am right or informed","Authority or power differences","The moral stakes","Group size","How safe disagreement feels","My current energy","It genuinely varies without a clear pattern"],
  persistence:["Interest in the task","A visible reward or milestone","An external deadline","Fatigue or body state","How clear the next step is","Whether another person is relying on me","Whether the task feels meaningful","It genuinely varies without a clear pattern"],
  "rel-intimacy":["How safe the relationship feels","How long we have known each other","Whether there is unresolved conflict","Whether I control the timing","How much space I currently need","Whether the other person is responsive","It genuinely varies without a clear pattern"],
  "uncertainty-intolerance":["How personally important the outcome is","Whether I can take a useful next step","How much evidence is available","Fatigue or overload","Whether another person is involved","Whether the decision can be reversed","It genuinely varies without a clear pattern"],
  "sensory-overload":["Sound density","Visual clutter or brightness","Crowding and personal space","How long I have been exposed","Fatigue, hunger or pain","Whether I can leave or change the setting","It genuinely varies without a clear pattern"],
  "self-worth-stability":["Criticism from someone important","Public evaluation","A private mistake","Relationship rejection","Physical exhaustion or illness","Whether I can repair the situation","It genuinely varies without a clear pattern"]
};
const GENERIC_DISCRIMINATORS = ["The people or relationship involved","The stakes and possible consequences","How much energy or physical capacity I have","How safe, judged or supported I feel","The amount of structure or clarity available","The sensory environment","It genuinely varies without a clear pattern"];

const CONTRADICTION_RULES = [
  {id:"closeness-space",ids:["rel-intimacy","rel-autonomy"],title:"Closeness and freedom can both be real",prompt:"When closeness and independence pull at the same time, which description is closest?",options:["I want closeness with predictable protected space.","I prefer closeness when I can control the timing.","I alternate between wanting contact and needing distance.","The balance changes mainly with trust and conflict.","I have not noticed a reliable pattern yet."]},
  {id:"intimacy-avoidance",ids:["rel-intimacy","attachment-avoidance"],title:"What makes closeness feel workable?",prompt:"If you want emotional closeness but also feel a pull away from dependence, what usually explains the tension?",options:["Closeness feels good until I fear losing freedom.","I want closeness but need time to process privately.","I am more comfortable when I can set the pace.","The tension appears mainly after conflict or disappointment.","I do not recognise this combination in my life."]},
  {id:"security-novelty",ids:["money-security","stimulation"],title:"Security and novelty",prompt:"Which sentence best describes how security and change relate for you?",options:["I enjoy novelty once I know there is a safe way back.","I tolerate substantial uncertainty because novelty is worth it.","I alternate between craving change and regretting instability.","It depends strongly on the life domain.","Neither description feels particularly familiar."]},
  {id:"identity-exploration-commitment",ids:["identity-exploration","identity-commitment"],title:"Exploration with commitment",prompt:"If you are both exploring and committed, what does that mean for you?",options:["I am committed to values while revising the route.","I explore options until one direction feels earned.","I keep a settled identity in one domain and experiment in another.","Exploration and commitment compete for attention.","I do not experience both strongly at once."]},
  {id:"security-spending",ids:["money-security","money-impulsivity"],title:"Long-term security and short-term wants",prompt:"When security matters but an immediate want is strong, what usually happens?",options:["I pause and compare the purchase with a longer plan.","I make the purchase, then adjust the plan afterwards.","I separate small treats from genuinely consequential spending.","The answer changes with scarcity, stress or the people involved.","I have not noticed a consistent pattern."]}
];

const MONEY_RISK_SCENARIOS = [
  {id:"money-risk-1",group:"domains",type:"B7",title:"Money · risk and certainty",prompt:"If the amounts were realistic for you, which would you usually prefer?","left":"A guaranteed £40","right":"A 50% chance of £100"},
  {id:"money-risk-2",group:"domains",type:"B7",title:"Money · risk and time",prompt:"Which would you usually prefer when you can comfortably wait?","left":"£60 guaranteed in one month","right":"A 50% chance of £150 in one month"},
  {id:"money-risk-3",group:"domains",type:"B7",title:"Money · career uncertainty",prompt:"Which work trade-off sounds more tolerable?","left":"A predictable role with slower progression","right":"An uncertain role with a chance of much faster progression"},
  {id:"money-risk-4",group:"domains",type:"B7",title:"Money · loss protection",prompt:"Which would you usually choose when both options are affordable?","left":"A smaller gain with no chance of loss","right":"A larger possible gain with a manageable chance of loss"}
];
const MONEY_DELAY_SCENARIOS = [
  {id:"money-time-1",group:"domains",type:"singleChoice",title:"Money · waiting choice",prompt:"If your essential needs were covered, which guaranteed option would you choose?",options:["£80 today","£95 in one month","£115 in six months","£150 in one year","It depends on the context"]},
  {id:"money-time-2",group:"domains",type:"singleChoice",title:"Money · delayed reward",prompt:"Which guaranteed option feels most attractive?",options:["£30 today","£45 in three months","£70 in one year","I would rather keep the choice open","It depends on what I need the money for"]},
  {id:"money-time-3",group:"domains",type:"singleChoice",title:"Money · future planning",prompt:"A future expense is likely but not certain. What would you usually do first?",options:["Set aside money now","Estimate the cost and set a review date","Wait until the expense is definite","Ask someone for a second opinion","It depends on current resources"]},
  {id:"money-time-4",group:"domains",type:"singleChoice",title:"Money · scarcity context",prompt:"When money feels tight, what is most likely to happen first?",options:["I review the numbers directly","I reduce optional spending","I avoid looking for a while","I seek practical advice or support","It depends on safety and urgency"]}
];

const REGULATION_SCENARIOS = [
  {id:"reg-flex-controllable-low",group:"regulation",type:"singleChoice",title:"Regulation · controllable / lower intensity",prompt:"A manageable practical problem is irritating but your body is fairly settled. What would you be most likely to do first?",options:["Take a practical next step","Ask for information or help","Pause and accept the irritation while I choose","Distract myself briefly then return","Keep analysing why it happened","Wait and see whether it resolves"]},
  {id:"reg-flex-controllable-high",group:"regulation",type:"singleChoice",title:"Regulation · controllable / high intensity",prompt:"A practical problem can be changed, but you feel highly activated. What would you be most likely to do first?",options:["Settle my body before acting","Take one very small practical step","Ask a trusted person to help me choose","Distract myself until the intensity drops","Keep thinking until I understand the cause","Act immediately to regain control"]},
  {id:"reg-flex-partly-low",group:"regulation",type:"singleChoice",title:"Regulation · partly controllable / lower intensity",prompt:"A situation is only partly within your influence and feels difficult but manageable. What would you be most likely to do first?",options:["Separate what I can and cannot influence","Ask someone involved for context","Accept the part I cannot change","Make a plan for the part I can change","Take a short break and revisit it","Wait for more information"]},
  {id:"reg-flex-partly-high",group:"regulation",type:"singleChoice",title:"Regulation · partly controllable / high intensity",prompt:"A partly controllable situation feels urgent and emotionally intense. What would you be most likely to do first?",options:["Reduce immediate intensity and delay a major response","Contact someone safe for support","Name one influenceable action","Set a boundary or protect space","Distract myself until I can think","Keep replaying the situation to find certainty"]},
  {id:"reg-flex-uncontrollable-low",group:"regulation",type:"singleChoice",title:"Regulation · uncontrollable / lower intensity",prompt:"A painful situation cannot currently be changed and you feel relatively steady. What would you be most likely to do first?",options:["Allow the feeling and continue with a valued activity","Make meaning of what happened","Seek connection or comfort","Distract myself for a defined time","Plan what I will do if circumstances change","Leave it open without trying to solve it"]},
  {id:"reg-flex-uncontrollable-high",group:"regulation",type:"singleChoice",title:"Regulation · uncontrollable / high intensity",prompt:"A painful situation cannot currently be changed and you feel highly activated. What would you be most likely to do first?",options:["Use a grounding or settling action","Reach for someone I trust","Give myself permission not to solve it today","Use distraction until the wave passes","Keep thinking about why it happened","Express what I feel even if no action is possible"]}
];

const MODULES = [
  {id:"temperament",title:"Temperament & attention",time:"5–7 min",intro:"How reward, uncertainty, energy, attention and sensory input tend to move through your day."},
  {id:"dispositions",title:"Personality facets",time:"7–9 min",intro:"A broad set of separate tendencies. Different facets can point in different directions."},
  {id:"relationships",title:"Relationships & communication",time:"6–8 min",intro:"Closeness, space, attachment, communication preferences and first responses to conflict."},
  {id:"regulation",title:"Emotion regulation & adaptation",time:"6–8 min",intro:"What you tend to do with emotion, pressure, ambiguity and self-presentation."},
  {id:"motives",title:"Motives, needs & values",time:"7–9 min",intro:"What pulls action, what feels supported or frustrated right now, and which values you choose when they compete."},
  {id:"identity",title:"Identity & self-understanding",time:"5–6 min",intro:"How you experience continuity, clarity, agency, authenticity and your life story."},
  {id:"domains",title:"Work, money & learning",time:"7–9 min",intro:"Desired environments, financial habits and the ways you prefer to learn. These are exploratory preferences."},
  {id:"decisions",title:"Decisions, conflict & change",time:"4–6 min",intro:"How you gather information, begin, continue and revise a course of action."},
  {id:"snapshot",title:"Your current context",time:"2–3 min",intro:"A separate snapshot of your present state and surroundings. It is not a personality trait."}
];

function dimension(id,title,group,kind,definition,fn,analogy,contexts,cues,more,less,needs,friction,...statementParts) {
  const statements=statementParts.length===1&&Array.isArray(statementParts[0])?statementParts[0]:statementParts;
  return {
    id,title,group,kind,definition,fn,analogy,contexts,cues,more,less,needs,friction,
    items:statements.filter(s=>typeof s==="string"&&s.trim()).map((s,i)=>{
      const reverse=s[0]==="~";
      return {id:id+"-"+(i+1),text:reverse?s.slice(1):s,reverse,type:"T7"};
    })
  };
}

const DIMENSIONS = [
  dimension("reward","Reward interest","temperament","Mechanism","How readily a possible enjoyable or useful outcome catches attention.","Noticing potential payoff can help a person spot promising options and start exploring.","A radar that turns toward possible rewards; noticing one is not the same as pursuing it.","A new opportunity, an appealing invitation, a possible win or feedback about a result.","A thought such as 'that could be worth trying' may arrive quickly.","Possibilities and likely payoffs attract your attention more readily.","Potential rewards are less likely to capture attention on their own.","A clear reason to engage, with time to decide whether the payoff matters.","Chasing too many promising options can compete with follow-through.","Possibilities that could turn out rewarding quickly catch my attention.","~Even promising opportunities often fail to pull my attention toward them."),
  dimension("reward-response","Reward responsiveness","temperament","Mechanism","How noticeably success, positive feedback or a good outcome reinforces further effort.","A felt response to reward can signal which activities are satisfying and help sustain effort.","A signal lamp that brightens after something goes well.","After progress, praise, a completed task or a pleasant surprise.","An energy lift, satisfaction or desire to repeat what worked.","Positive outcomes leave a stronger motivational trace in your answers.","Positive outcomes may be quieter or shorter-lived for you.","Specific feedback and noticing small progress can make rewards easier to register.","Relying on praise or immediate payoff can make long, delayed work less rewarding.","Success gives me a noticeable burst of energy.","~Getting what I hoped for often feels less rewarding than I expected."),
  dimension("goal-drive","Goal-drive activation","temperament","Mechanism","How strongly a meaningful goal mobilises attention and action.","A clear goal can organise effort and make competing tasks easier to rank.","An engine that starts when a destination becomes visible.","When a deadline, valued outcome or concrete target comes into view.","A sense of momentum, urgency or a plan beginning to form.","Important goals more readily organise your energy and attention.","A goal may need additional cues, support or immediate meaning to create momentum.","A personally chosen goal, a visible next step and feedback about progress.","A compelling goal can crowd out rest or make a detour feel like failure.","Once I decide that an outcome really matters, I become strongly mobilised toward it.","~Even goals that matter to me often fail to generate much momentum."),
  dimension("stimulation","Stimulation seeking","temperament","Preference","How much novelty, intensity and change tend to feel appealing.","Seeking stimulation can bring discovery, engagement and a sense of aliveness.","A dial for novelty and intensity, not a measure of recklessness.","Choosing a familiar or unfamiliar activity, repeating a routine, or encountering a vivid experience.","Restlessness with repetition, curiosity about what is next, or attraction to vivid input.","Novel, intense or changing experiences tend to appeal more.","Familiarity and steadier pacing may be more comfortable or satisfying.","Choice over pace and a balance between novelty and recovery.","Novelty can pull attention away from useful routines; stimulation is not the same as impulsivity.","Too much predictability eventually makes me restless.","~I usually prefer familiar experiences even when something new is readily available."),
  dimension("fear-sensitivity","Fear sensitivity","temperament","Sensitivity","How readily cues of immediate physical danger bring alertness.","Threat detection can protect safety and prompt sensible caution.","A smoke alarm: useful when calibrated, exhausting if every toast sets it off.","Unexpected danger, physical risk, unfamiliar surroundings or a sudden alarming cue.","A quick bodily alert, scanning, caution or a wish to create distance.","Possible immediate danger captures your attention more strongly.","Danger cues may need to be clearer before they produce a strong alert.","Accurate information and a real choice about physical safety.","An alarm can stay loud after the immediate risk has passed; this is not a diagnosis.","Signs of immediate physical danger quickly put me on alert.","~Potential physical danger often leaves me calmer than it seems to leave other people."),
  dimension("conflict-anxiety","Conflict / uncertainty sensitivity","temperament","Sensitivity","How strongly unresolved choices, conflict or uncertain outcomes keep attention engaged.","Monitoring unresolved situations can help prepare, clarify risk and reduce surprise.","An open browser tab that keeps asking for an answer.","Waiting for a response, facing two competing choices or entering an unclear situation.","Replaying possibilities, checking for updates or difficulty mentally setting the issue down.","Open questions and competing outcomes hold your attention more strongly.","Unresolved questions are easier to leave open without much mental pull.","Clear enough information, a defined time to revisit, and permission to act before certainty is perfect.","Repeated checking can consume attention without adding new information.","When two important choices pull me in different directions, I can become stuck thinking about them.","~I can usually leave an uncertain situation unresolved without it occupying much mental space."),
  dimension("effortful-control","Effortful control","temperament","Capacity-like self-report","Your reported ability to redirect attention, pause and begin when you intend to.","These behaviours can help align an action with a chosen goal, especially when distractions or impulses appear.","A steering wheel: having one does not remove the road, traffic or fatigue.","Starting an important task, resisting an immediate urge or returning after distraction.","Noticing a drift and being able to make a deliberate next move.","You more often report being able to redirect, pause or start deliberately.","These actions may take more effort or support to access consistently.","External cues, smaller starts and a less distracting environment can reduce load.","Self-control varies with fatigue, interest and conditions; low endorsement is not lack of care.","I can redirect my attention when I notice it drifting somewhere unhelpful.","~Once my attention is pulled strongly in one direction, I find it difficult to deliberately redirect it."),
  dimension("negative-urgency","Negative-emotion urgency","temperament","Tendency","How strongly intense unpleasant emotion may speed up action before reflection.","Fast action can interrupt danger or express a boundary; a pause can help when the stakes are high.","A car that accelerates when the warning light flashes.","During anger, panic, shame or strong disappointment.","A feeling that something must be said or done immediately.","Strong negative emotion is more likely to speed up your response.","Your answers suggest more room to pause even when upset.","A short delay, physical settling or a trusted person to help slow the moment.","A fast response may create consequences that a calmer version of you would choose differently.","When I become very upset, I sometimes act before thinking through the consequences.","~Even when extremely upset, my decision-making pace changes very little."),
  dimension("positive-urgency","Positive-emotion urgency","temperament","Tendency","How strong excitement or very positive emotion may speed up decisions.","Enthusiasm can create courage, energy and willingness to seize an opportunity.","A tailwind: it can help you move, while also making you travel faster than planned.","A thrilling opportunity, celebration, intense attraction or exciting new plan.","Quick commitments, expansive plans or a sense that ordinary limits can wait.","Strong excitement is more likely to speed up commitments in your answers.","Excitement may be less likely to change your decision pace.","A brief pause before spending, promising or taking on a new obligation.","An inspiring moment can make long-term cost or capacity harder to see.","When I am extremely excited, I can become less careful than usual.","~Excitement rarely changes how carefully I consider consequences."),
  dimension("persistence","Persistence","temperament","Tendency","How readily you continue when progress is slow or the task becomes repetitive.","Continuing can carry meaningful goals through the unglamorous middle.","A walking pace after the starting bell has faded.","Long projects, routine tasks or a period with little visible progress.","Returning to a task after the interesting part is over.","You more often report staying with slow or repetitive work.","Variety, interest or renewed purpose may be important for sustaining effort.","Visible milestones, shorter work blocks and reasons that remain personally meaningful.","Persistence can also keep effort attached to a plan that no longer helps.","I can continue working after the interesting part of a task is over.","~Once a task becomes repetitive, my effort usually drops sharply."),
  dimension("baseline-activation","Baseline activation","temperament","Tendency","The pace and activity level that often feel natural, separate from today's energy.","A usual pace can help someone organise movement, rest and stimulation.","An idle-speed setting; it can differ from the fuel available today.","Quiet waiting, long inactive stretches, transitions or a busy day.","Restlessness, an urge to move, or comfort with a slower rhythm.","A more active everyday pace feels familiar in your answers.","A slower or less activated pace may feel more natural.","Movement breaks or deliberate rest, depending on which supports the moment.","Usual pace is not the same as current energy, health or motivation.","I naturally move through the day at a fairly energetic pace.","~A slow and inactive pace feels natural to me for long periods."),
  dimension("sensory-orienting","Sensory orienting","temperament","Sensitivity","How readily small sensory changes enter awareness.","Noticing details can support awareness, learning and early recognition of changes in a setting.","A microphone that picks up quiet sounds; sensitivity and overload are different things.","Background sound, lighting changes, textures or several simultaneous inputs.","Noticing a hum, flicker or small change before other people mention it.","You more often notice subtle sensory details.","Background detail may stay outside attention unless it becomes salient.","Control over sensory focus and clear signals about what deserves attention.","Noticing more detail does not by itself mean a setting is distressing.","I notice small changes in sound, lighting or the physical environment.","~I can easily remain unaware of background sensory detail."),
  dimension("sensory-overload","Sensory overload susceptibility","temperament","Sensitivity","How much intense or competing sensory input can drain attention or energy.","Sensitivity to load can help identify when a lower-input setting would protect capacity.","A cup that fills from many small streams at once.","Busy sound, visual clutter, crowded settings or long exposure to intense input.","Thinking becomes harder, irritation rises or a quieter setting feels needed.","Busy sensory input more often feels draining in your answers.","Busy input appears less likely to drain you strongly, based on these items.","A choice of quieter space, breaks or one sensory change at a time.","Wanting movement or excitement does not mean wanting every kind of input.","Busy sensory environments can become mentally exhausting for me.","~High levels of environmental stimulation rarely drain me."),
  dimension("interoception","Interoceptive noticing","temperament","Sensitivity","How readily internal cues such as hunger, tiredness, tension or bodily arousal are noticed.","Noticing body cues can help someone respond before discomfort becomes intense.","A dashboard with gauges for fuel, temperature and pressure.","Long concentration, hunger, fatigue, exercise or emotional activation.","Recognising tension, hunger or tiredness early—or noticing only once it is strong.","Your answers indicate more frequent noticing of internal cues.","Internal cues may be easier to miss until they become pronounced.","Regular check-ins and visible reminders for food, water, movement or rest.","Body signals need interpretation; noticing a sensation does not identify its cause.","I notice small changes in my body’s internal state.","~I can go a long time without noticing what my body is signalling.")
];

const DISPOSITION_DATA = [
  ["sociability","Sociability","Desire for rewarding time with people; not confidence or ability.","Connection can be a source of enjoyment and energy.","A social battery’s preferred charging pattern.","Time with people you like, free-time choices and invitations.","You more often seek or enjoy social contact.","Time alone may be more rewarding or restorative.","Connection by choice, with room for recovery.","Social interest does not mean every group suits you.","I actively look for opportunities to spend time with people I enjoy.","~Even when I like the people involved, I usually prefer spending my free time alone."],
  ["social-boldness","Social boldness","How manageable it feels to approach unfamiliar people or be the focus of a group.","Social ease can make it simpler to enter new settings.","The ease of opening a door, separate from wanting to enter.","Introductions, groups, public speaking or being watched.","Approaching unfamiliar people may feel more manageable.","You may prefer time to observe or a clear reason to begin.","Low-pressure openings and a familiar point of contact.","Wanting connection and feeling at ease initiating it are different.","I can approach unfamiliar people when I have a reason to.","~Being the focus of an unfamiliar group makes me strongly uncomfortable."],
  ["assertiveness","Assertiveness","How readily you state preferences, boundaries or direction.","Clear expression can make needs visible and decisions easier.","A volume control for your position in the room.","Disagreement, leadership moments or a group without a clear direction.","You more readily voice a view or provide direction.","You may wait, soften a preference or let another person lead.","Time to prepare the point and permission to be direct.","Assertiveness does not determine kindness or correctness.","I state my view when a group is moving in a direction I disagree with.","~I often leave my preference unstated to avoid influencing the group."],
  ["liveliness","Liveliness / enthusiasm","How visibly positive energy tends to show in enjoyable situations.","Visible enthusiasm can invite shared energy and signal what matters.","A window into the room’s emotional light level.","Good news, favourite activities and lively group settings.","Enjoyment more often shows in your energy or expression.","Enjoyment may be quieter or less outwardly displayed.","People who allow your pace and expression to vary.","A subdued presentation does not mean a lack of enjoyment.","Positive events tend to make me visibly enthusiastic.","~Even when I am enjoying myself, I tend to remain fairly subdued."],
  ["anxiousness","Anxiousness","How readily possible future problems occupy attention.","Anticipating difficulty can support preparation and caution.","A forecast that keeps scanning for clouds.","Waiting, uncertain plans or high-stakes outcomes.","Possible problems more readily come to mind.","Future problems may be easier to set aside.","A plan for what is actionable and a time to stop checking.","Worry does not prove a threat is likely or that a person is fragile.","My mind readily anticipates things that could go wrong.","~Potential future problems rarely occupy my thoughts for long."],
  ["emotional-volatility","Emotional volatility","How quickly or strongly significant events can shift emotional intensity.","Emotional responsiveness can register what is important and prompt adjustment.","A responsive instrument whose reading changes with the signal.","Unexpected news, interpersonal moments or shifting demands.","Feelings may intensify or change quickly after important events.","A substantial event may be needed to shift your state strongly.","Room to name the feeling and let intensity settle before deciding.","A strong or changing feeling is not a diagnosis or a character flaw.","My emotional state can change quickly when something significant happens.","~It usually takes a substantial event to shift my emotional state strongly."],
  ["stress-vulnerability","Stress vulnerability","How much accumulated demand can interfere with normal functioning.","Recognising load can show when support or recovery is needed.","A carrying capacity that changes with the load, not a measure of worth.","Several deadlines, sensory demands or unresolved tasks at once.","Stacked demands more often make ordinary tasks harder.","You report more continuity of functioning as demands accumulate.","Prioritising, removing one demand and protecting recovery time.","Current resources and material conditions also shape stress.","When several demands accumulate, my functioning starts to deteriorate.","~I can usually maintain my normal level of functioning even when demands pile up."],
  ["irritability","Irritability","How readily obstruction or repeated frustration brings anger.","Anger can flag blocked goals, unfairness or a boundary needing attention.","A friction sensor that signals repeated resistance.","Delays, interruptions, repeated errors or feeling blocked.","Small frustrations more readily shift your mood toward anger.","More provocation may be needed before anger appears.","Reducing repeated friction and stating the blocked need clearly.","Irritability can rise with fatigue, pain, hunger or overload; this test cannot identify its cause.","Repeated small frustrations can make me noticeably irritable.","~It usually takes a great deal of provocation before I become angry."],
  ["compassion","Compassion","How readily another person’s difficulty evokes concern or a wish to help.","Compassion can support care, cooperation and noticing unmet needs.","A bridge that draws attention toward someone else’s experience.","Seeing someone struggle, hearing a difficult story or sharing responsibility.","Others’ distress more often affects you and invites help.","Others’ distress may affect you less strongly or in a different way.","Care with boundaries and a clear idea of what help is wanted.","Feeling for someone and being responsible for fixing everything are not the same.","Another person’s suffering readily affects me emotionally.","~Other people’s distress often leaves me relatively emotionally unaffected."],
  ["tact","Tact","How much you adjust delivery to reduce unnecessary hurt while being honest.","Tact can protect dignity and keep a hard conversation workable.","A volume and timing control for difficult information.","Giving criticism, setting a boundary or disagreeing.","You more often consider how words may land.","You may prioritise unfiltered clarity over softening delivery.","A direct message that also names respect and intent.","Tact is not the same as dishonesty or avoiding conflict.","I consider how my wording will land before saying something critical.","~If something is true, I rarely change how I say it just to protect another person’s feelings."],
  ["trust","Trust","How readily you give others a good-faith interpretation when evidence is unclear.","Trust can make cooperation and closeness possible while still allowing boundaries.","A starting assumption that can update with evidence.","Ambiguous motives, new relationships and minor mistakes.","You more readily offer the benefit of the doubt.","Ambiguity may prompt more checking or caution.","Specific follow-through and room to update an initial impression.","Trust is not proof that another person is safe or sincere.","I usually assume people are acting in good faith unless I have a reason not to.","~When someone’s motives are ambiguous, I tend to suspect there may be something self-serving behind them."],
  ["forgiveness","Forgiveness","How readily hostility can reduce after meaningful repair.","Forgiveness can allow a relationship to change after accountability and repair.","A door that may reopen after the damage is acknowledged and addressed.","An apology, repeated harm or an effort to make amends.","Sincere repair may make it easier for goodwill to return.","Negative feelings may remain after a serious offence.","Time, accountability and evidence that the harm will not repeat.","Forgiveness is not forgetting, excusing harm or removing boundaries.","When someone sincerely repairs harm, I can usually let hostility decrease.","~After a serious wrong, my negative feelings tend to remain for a long time."],
  ["sincerity","Sincerity","How closely outward communication tends to match actual intention.","Sincerity can support predictability and trust in relationships.","A window with less distance between intention and expression.","Requests, negotiation, social expectations and difficult conversations.","Your expression more often matches your actual intention.","You may strategically manage presentation in some situations.","Safety to be honest without unnecessary punishment.","Social performance can be strategic rather than evidence of bad character.","What I communicate to people usually matches my actual intentions.","~I sometimes present feelings I do not really have when doing so is strategically useful."],
  ["fairness","Fairness / exploitation restraint","How much fairness constrains the use of an advantage or loophole.","Fairness can protect people from harm and support cooperation.","A rule check before using an advantage.","Negotiation, shared resources, rules and unequal power.","You more often avoid an advantage that would knowingly harm someone.","Self-interest may carry more weight when a loophole benefits you.","Clear rules and a chance to consider who bears the cost.","One self-report cannot establish moral character or what you would do in every real situation.","I avoid taking advantage of loopholes when doing so would unfairly harm others.","~If an unfair arrangement benefited me without consequences, I would be tempted to use it."],
  ["status-orientation","Status / material orientation","How much recognition, rank or material success can attract attention.","Status goals can motivate achievement and signal security or belonging.","A spotlight whose brightness can become a goal in itself.","Competition, public recognition, achievement and purchases.","Recognition or material standing may carry more appeal.","Other outcomes may matter more than rank or visible success.","Separating the goal itself from what recognition is expected to provide.","Status can mean security, respect or access; these items do not explain which.","Being recognised as successful tends to matter to me.","I notice what material success or public standing may communicate."],
  ["entitlement","Entitlement","How strongly you expect priority, special consideration or favourable treatment.","Expectations can help someone advocate for needs and notice unequal treatment.","A claim-ticket for how much priority feels owed.","Waiting, shared resources, service and disagreements about fairness.","You more often expect your needs or contribution to receive special consideration.","You may be more willing to accept equal or lower priority.","Clear agreements about fairness, reciprocity and responsibility.","An expectation is not proof of how you treat people; context matters.","I expect my needs to receive serious consideration when a decision affects me.","~I do not usually expect special consideration beyond what other people receive."],
  ["orderliness","Orderliness","How much structure, organisation and arrangement tend to feel useful.","Order can reduce search costs and make plans easier to maintain.","A place for things so fewer decisions need repeating.","Planning, shared spaces, deadlines and keeping track of items.","Structure and organisation more often support you.","Loose arrangements may feel more comfortable or sufficient.","A level of structure that solves real problems without becoming a goal itself.","Orderliness does not equal competence, and disorder can reflect load or constraints.","I like to keep important materials arranged so I can find them.","~It is difficult for me to keep important materials arranged so I can find them."],
  ["diligence","Diligence","How consistently you invest effort and meet obligations.","Diligence can help translate intentions into completed work.","A steady supply line of effort.","Long assignments, routine responsibilities and other people relying on you.","You more often put sustained effort into responsibilities.","Effort may vary with meaning, energy or available support.","A task with clear expectations and realistic scope.","Effort is not a measure of worth and may be constrained by health or access.","I work steadily on tasks that I have accepted as my responsibility.","~I often leave accepted responsibilities unfinished."],
  ["prudence","Prudence","How much you pause to consider consequences before acting.","Considering consequences can protect future options and other people.","A speed bump between impulse and action.","Spending, promises, risk and irreversible decisions.","You more often pause to consider likely consequences.","Quick action may be more common or feel more natural.","A short review of costs, benefits and reversibility.","Caution can become costly if it prevents action when enough is known.","I think about likely consequences before committing to a plan.","~I often act on a first impulse even when a choice has lasting effects."],
  ["thoroughness","Thoroughness","How much you check details and complete the whole task rather than only its outline.","Thoroughness can catch errors and make work more reliable.","A final inspection before handing over the work.","Proofreading, safety checks and complex instructions.","You more often review details before considering a task complete.","You may prefer a faster pass or focus on key details.","A checklist proportionate to the consequence of a mistake.","Repeated checking can add time after the useful errors are already found.","I check details before I consider important work finished.","~I seldom notice omissions in instructions or plans."],
  ["dependability","Dependability","How consistently others may be able to rely on your follow-through.","Follow-through supports trust and coordination.","A bridge that is expected to hold when someone steps onto it.","Shared plans, deadlines and commitments.","You more often report following through on commitments.","Your follow-through may vary with competing demands or context.","Realistic commitments and clear notice when plans change.","A self-report cannot show whether obligations were manageable or fair.","People can usually rely on me to do what I said I would do.","~I often fail to let people know when I cannot meet an expectation I accepted."],
  ["intellectual-curiosity","Intellectual curiosity","How much unanswered questions and learning for its own sake draw attention.","Curiosity can help build understanding and generate useful questions.","A question-shaped magnet.","A puzzling idea, a new topic or a practical explanation that is incomplete.","Unanswered questions more often pull you toward investigation.","Learning may be more purpose-led or focused on what is immediately useful.","A question you care about and time to follow it far enough.","Many interesting threads can compete with finishing one.","Questions I cannot explain yet tend to pull me toward further investigation.","~Once I know enough to function, I usually have little desire to understand more deeply."],
  ["imagination","Imagination","How readily you generate images, possibilities or alternatives beyond what is present.","Imagination can support creativity, empathy and planning alternatives.","A mental sketchbook that can draw more than one possible scene.","Open-ended problems, stories, design and future plans.","You more often generate possibilities beyond the immediate facts.","Concrete information may be more compelling than imagined possibilities.","A clear prompt and a way to turn ideas into an experiment.","Possibilities can proliferate faster than decisions.","I often imagine several different ways a situation could unfold.","~I focus on what is actually present rather than imagining other possibilities."],
  ["aesthetic-sensitivity","Aesthetic sensitivity","How strongly beauty, form, sound or design tends to affect attention and feeling.","Aesthetic response can guide attention, meaning and creative preference.","A tuning fork that resonates with certain patterns.","Music, art, landscapes, design and sensory environments.","Aesthetic details more often hold meaning or emotional impact.","Form or beauty may be less central than practical function.","Time with environments and media that feel engaging to you.","Aesthetic preference is personal, not evidence of artistic ability.","Music, images or design can affect my mood noticeably.","~Design or beauty rarely affects my mood."],
  ["unconventionality","Unconventionality","How comfortable you are with ideas or choices that depart from familiar convention.","Questioning defaults can make room for alternatives and innovation.","A route that is willing to leave the marked path.","Unusual ideas, social expectations or established ways of working.","You more often entertain approaches outside convention.","Familiar and socially established approaches may feel more useful.","Freedom to explore alongside a way to check consequences.","Unconventionality is not the same as competence or opposition for its own sake.","I am willing to consider ideas that challenge familiar assumptions.","~I usually prefer familiar approaches even when another approach might work."]
].map(row=>dimension(row[0],row[1],"dispositions","Disposition",row[2],row[3],row[4],row[5],"Notice whether this pattern changes during "+row[5].toLowerCase()+".",row[6],row[7],row[8],row[9],[row[10],row[11]]));

const MORE_DIMENSIONS = [
  dimension("agency","Agency","relationships","Interpersonal orientation","How readily you take initiative, state influence and shape a shared direction.","Agency can help make preferences and plans visible.","A hand on the tiller of a shared boat.","Group decisions, shared responsibilities or unclear leadership.","Offering a direction, making a request or saying what you want.","You more often report taking initiative or shaping direction.","You may prefer shared or less assertive influence.","A real invitation to contribute without carrying every decision.","Influence can become control if other perspectives are crowded out.","I am comfortable taking the lead when a group needs direction.","I can state what I want even when other people may prefer something else."),
  dimension("communion","Communion","relationships","Interpersonal orientation","How much warmth, mutuality and connection tend to organise interactions.","Communion can support belonging, cooperation and care.","A bridge that is strongest when both sides can cross.","Shared decisions, caregiving and moments where connection matters.","Looking for mutual understanding and checking how an interaction affects others.","Mutual connection and warmth more often guide your answers.","You may place more emphasis on independence, task or personal space.","Reciprocity and clear boundaries, so care can move both ways.","Connection can become over-accommodation if your own needs disappear.","I try to understand the other person’s perspective during disagreement.","Maintaining a sense of connection matters to me in group situations."),
  dimension("attachment-anxiety","Attachment anxiety","relationships","Relationship-specific pattern","How strongly ambiguity or possible rejection in a close relationship may activate concern.","Attention to connection can prompt repair and reassurance seeking.","A relationship signal detector that can turn up when the signal becomes unclear.","Delayed replies, conflict, distance or uncertainty about a relationship.","Checking whether closeness is intact or replaying a partner’s words.","Ambiguous closeness signals more often hold your attention.","Ambiguity may be easier to tolerate without repeated reassurance.","Direct communication, predictable repair and reassurance that matches the situation.","This is not a diagnosis or a verdict about a relationship; circumstances and partners matter.","When someone important seems distant, I worry that the relationship may be weakening.","Unclear signals from someone I care about can stay on my mind."),
  dimension("attachment-avoidance","Attachment avoidance","relationships","Relationship-specific pattern","How much closeness, dependence or emotional disclosure may feel uncomfortable in close relationships.","Space can protect autonomy and allow emotions to be processed privately.","A door that can open and close; the useful setting depends on safety and choice.","Requests for closeness, emotional disclosure or relying on another person.","Wanting time alone before discussing something vulnerable.","You more often report keeping emotional distance or relying on yourself.","Closeness or reliance may feel more comfortable to you.","Choice, respect for independent space and a gradual pace of disclosure.","Independence is not the same as not caring, and one item cannot explain why space matters.","I prefer to deal with difficult feelings on my own before sharing them.","I can feel uncomfortable when someone wants a great deal of emotional closeness from me."),
  dimension("reappraisal","Reappraisal","regulation","Strategy","How often you reconsider what a situation means to change its emotional impact.","Reframing can create another interpretation and make a response more flexible.","Turning a picture slightly to see another side.","A setback, misunderstanding or ambiguous interaction.","Asking what else could explain the event or what might still be learned.","You more often try a new interpretation when emotion rises.","You may focus first on changing the situation, expressing the feeling or waiting.","A reframe that respects the facts and does not dismiss harm.","Reframing can become self-invalidation if it is used to deny what happened.","When a situation upsets me, I look for another way to understand it.","I can sometimes change how I feel by changing how I think about a situation."),
  dimension("suppression","Expressive suppression","regulation","Strategy","How often you hide or hold back the outward expression of emotion.","Pausing expression can protect privacy or safety in a particular setting.","A lid that can keep something in, but may take effort to hold down.","Work, family or conflict settings where expression feels risky or unwelcome.","Keeping a neutral face or waiting to show a reaction.","You more often hold expression back even when you feel strongly.","You may show emotion more openly or let it be visible.","Choice about privacy and safer places to express what matters.","Holding expression in is not the same as feeling less; it can take energy.","I keep my feelings from showing even when I feel strongly.","I change how much emotion I show depending on who is present."),
  dimension("distraction","Distraction","regulation","Strategy","How often shifting attention away from distress helps you get through a moment.","Distraction can give a person temporary relief or room to settle.","A short detour while the road is blocked.","Overwhelm, rumination, waiting or an intense emotional moment.","Choosing another activity so a feeling or thought has less airtime.","You more often shift attention to another activity when distressed.","You may stay with the problem or emotion rather than move attention away.","A deliberate time-limited pause with a plan to return if needed.","A detour can become avoidance when important issues never get revisited.","When I am distressed, I deliberately focus on another activity for a while.","I use something absorbing to give myself a break from difficult thoughts."),
  dimension("problem-solving","Problem solving","regulation","Strategy","How often you identify actionable steps when a difficult situation can be changed.","Problem solving can turn distress into a manageable next action.","A toolbox used when there is something practical to repair.","A solvable problem, a blocked goal or competing demands.","Listing options, making a plan or asking what can change.","You more often move toward a practical step when there is something to change.","You may first need to name or settle the emotion before taking action.","A problem that is within your influence and a first step small enough to begin.","Trying to fix an unchangeable situation can produce more frustration.","When I face a problem I can change, I look for a practical next step.","I break complicated problems into smaller actions."),
  dimension("rumination","Rumination","regulation","Strategy","How often the mind repeats distressing questions or events without reaching new information.","Review can support learning when it produces insight or a plan.","A looped track that sometimes replays the same few seconds.","After a mistake, criticism, uncertain exchange or upsetting event.","Replaying words or searching repeatedly for what went wrong.","You more often revisit distressing events or questions.","You may be able to let unresolved thoughts pass more readily.","A time limit, a written next step or a switch from replay to new evidence.","Repeated thought can feel like problem solving while leaving the situation unchanged.","After something upsetting, I replay the details in my mind.","I keep trying to work out why a difficult event happened."),
  dimension("experiential-avoidance","Experiential avoidance","regulation","Strategy","How often you change behaviour mainly to escape an unwanted thought, feeling or sensation.","Avoidance can provide short-term relief and protect someone from genuine danger.","A detour around discomfort; useful around danger, costly when it blocks valued routes.","A feared conversation, a difficult task or a feeling that seems hard to tolerate.","Delaying, leaving or numbing out because the internal experience feels too much.","Internal discomfort more often shapes what you avoid or postpone.","You report less tendency to change plans mainly to escape a feeling.","A safe, gradual way to approach something that matters without forcing exposure.","Avoidance may protect safety in some settings; context is essential.","I sometimes avoid situations mainly because I do not want to feel what they bring up.","I put off important things when I expect them to feel emotionally uncomfortable."),
  dimension("support-seeking","Support seeking","regulation","Strategy","How often you reach for practical, emotional or social support when needed.","Support can add information, care and shared capacity.","Borrowing another set of hands or another perspective.","When stuck, upset or facing something difficult alone.","Telling someone what is happening or asking for help.","You more often involve trusted people when a problem is hard to manage alone.","You may first process privately or prefer to handle difficulty alone.","A trusted person and a specific request for the kind of help you want.","Support may not be available or safe in every environment.","When I am struggling, I reach out to someone I trust.","I ask for practical help when a task is more than I can reasonably handle alone."),
  dimension("reassurance-seeking","Reassurance seeking","regulation","Strategy","How often confirmation from another person is used to reduce uncertainty.","Reassurance can soothe and clarify a relationship or decision.","Checking a compass bearing; repeated checks may not settle the route for long.","Ambiguous relationship signals, uncertain decisions or fear of having made a mistake.","Asking whether things are okay or repeating a question to feel certain.","You more often seek confirmation when important uncertainty appears.","You may tolerate some unresolved questions without asking repeatedly.","Specific, direct reassurance and a plan for what to do if uncertainty returns.","Temporary relief can lead to checking again when certainty fades.","When I am uncertain about an important relationship, I ask whether things are okay.","Reassurance can reduce uncertainty for me, at least for a while."),
  dimension("self-soothing","Self-soothing","regulation","Strategy","How much you can draw on self-guided actions that help your body or attention settle.","Self-soothing can make recovery more available when another person is not present.","A personal set of handrails for rough ground.","Distress, overload, transition or being alone after a difficult event.","Using movement, sensory comfort, breathing or a familiar activity to settle.","You more often report having actions that help you settle.","You may have fewer dependable solo strategies or find them harder to access under strain.","A short list of low-effort actions you can choose from.","A strategy that works one day may not fit every kind of distress.","I have ways of helping my body settle without someone else doing it for me.","I can usually find at least one activity that reduces emotional activation."),
  dimension("emotional-disclosure","Emotional disclosure","regulation","Strategy","How readily you put vulnerable feelings into words with someone trusted.","Disclosure can make support and repair possible.","Opening a window to let another person see the weather inside.","Close relationships, conflict repair or asking for care.","Naming what you feel and what you need from the conversation.","You more often describe difficult feelings to trusted people.","You may prefer privacy or need more time before sharing.","A listener who asks before advising and respects timing.","Privacy can be protective; disclosure is not always safe or necessary.","I can put difficult feelings into words with people I trust.","When a relationship matters, I am willing to explain what I am feeling."),
  dimension("acceptance","Acceptance","regulation","Strategy","How much you can allow an unwanted emotion to be present without treating it as a failure.","Acceptance can reduce the extra struggle added by fighting an unavoidable feeling.","Making room for weather to pass rather than demanding an instant clear sky.","Grief, uncertainty or discomfort that cannot be changed immediately.","Noticing a feeling without needing to erase it at once.","You more often allow an uncomfortable feeling to exist while choosing what to do.","Unwanted feelings may quickly become problems you need to eliminate.","Permission to pause, name the emotion and decide whether action is needed.","Acceptance is not approval of harm or giving up on change.","I can let an uncomfortable feeling exist without immediately trying to eliminate it.","I can notice an emotion without treating the emotion itself as a problem."),
  dimension("distress-tolerance","Distress tolerance","regulation","Capacity-like self-report","How much you can continue with a valued task while temporarily uncomfortable.","Tolerance can protect important goals from being decided only by immediate relief.","A bridge across a difficult stretch, not a demand to live on the bridge.","Waiting, mistakes, intense feelings and difficult but safe tasks.","Staying present long enough to choose a response.","You more often report being able to function while uncomfortable.","Strong discomfort may become the main thing to solve in that moment.","A safe limit, recovery plan and choice about whether this discomfort is worth carrying.","Distress tolerance is not enduring unsafe or abusive conditions.","I can continue functioning while temporarily uncomfortable.","Emotional discomfort does not automatically make me abandon something important."),
  dimension("regulation-flexibility","Regulation flexibility","regulation","Contextual adaptation","How you change strategy when a problem is controllable versus currently unchangeable.","Matching strategy to the actual situation may prevent using one tool for every problem.","A toolkit with different tools for different materials.","A solvable problem compared with a painful situation that cannot be changed right now.","Switching between action, acceptance, support and rest as the facts change.","Your choices shift with the scenario in a way worth examining.","The same response is selected across situations that differ in controllability.","A pause to ask: what can I change, what needs care, and what can wait?","Scenario choices describe intended responses, not proven real-world skill.","A. Identify what action could change the problem. B. Seek help from someone I trust. C. Reframe what the event means. D. Distract myself for a short while. E. Accept what cannot currently be changed. F. Keep thinking until I understand why it happened.","For a painful situation that cannot currently be changed, which response would you be most likely to choose first?"),
  dimension("uncertainty-intolerance","Intolerance of uncertainty","regulation","Tendency","How difficult it feels to continue while important outcomes remain unclear.","Sensitivity to uncertainty can encourage preparation and checking before risk.","An open question with an unusually bright notification light.","Waiting, unclear expectations or choices without a guaranteed outcome.","Seeking more information or feeling unable to settle while an answer is missing.","Unresolved uncertainty more often holds your attention.","Some uncertainty may be easier to carry while action continues.","An agreed point to revisit the question and a definition of enough information.","More information can stop improving the decision once the key facts are known.","I find it difficult to continue when I do not know how an important situation will turn out.","I want clear answers before I commit to a plan."),
  dimension("need-for-closure","Need for closure","regulation","Preference","How much reaching a definite answer tends to feel preferable to leaving an issue open.","Closure can make it possible to act and coordinate with other people.","A bookmark that wants the chapter to end before starting another.","Ambiguous discussions, changing plans and incomplete information.","Wanting a clear conclusion or settled plan.","You more often prefer a firm answer and reduced ambiguity.","You may be more comfortable keeping options or interpretations open.","A provisional decision with a review date.","A premature conclusion can close off useful evidence.","I prefer to reach a clear conclusion rather than leave an issue open.","Having a settled plan helps me move on to other things."),
  dimension("ambiguity-tolerance","Ambiguity tolerance","regulation","Preference","How comfortable it feels to hold competing interpretations without deciding immediately.","Holding uncertainty can protect curiosity and prevent overconfidence.","A map with several routes still visible.","Complex questions, mixed feedback and situations with incomplete information.","Leaving room for another explanation until evidence improves.","You more readily remain with ambiguity while considering alternatives.","You may prefer a clearer answer before proceeding.","A clear distinction between what is known, guessed and still open.","Too much openness can delay action when a good-enough choice is available.","I can hold more than one possible explanation in mind without choosing immediately.","An unclear situation does not always prevent me from taking a small next step."),
  dimension("planning-dependence","Planning dependence","regulation","Preference","How much having a plan supports your ability to begin and continue.","Planning can lower uncertainty and make effort more predictable.","A handrail along the route; helpful to some people, restrictive if it never ends.","Transitions, deadlines, travel or a task with many steps.","Wanting an outline before getting started.","A clear plan more often helps you act.","You may be comfortable improvising or changing direction as you go.","A plan detailed enough to begin, with space to update it.","Planning can consume time that might be used to start.","I work better when I know the steps before I begin.","Unexpected changes to a plan make it harder for me to continue."),
  dimension("personal-standards","High personal standards","regulation","Motivational standard","How strongly you set demanding standards for the quality of your own work.","Standards can support craftsmanship and learning.","A target line that can guide practice.","Creative work, assessments, deadlines or visible outcomes.","Wanting work to meet an internally meaningful level.","High quality standards more often matter in your answers.","A good-enough result may be acceptable in more situations.","A quality definition that fits the stakes and available time.","An unreachable standard can prevent completion or enjoyment.","I set demanding standards for work that matters to me.","I care about doing important work to a high standard."),
  dimension("evaluative-perfectionism","Evaluative concern","regulation","Sensitivity","How much mistakes or others’ evaluation can threaten self-worth or confidence.","Noticing evaluation can prompt preparation and care.","An audience microphone turned inward toward every possible mistake.","Being assessed, compared or criticised.","Checking for signs that an error means something about you.","Mistakes or evaluation more often carry personal weight in your answers.","You may separate performance feedback from overall self-worth more readily.","Specific criteria, kind but honest feedback and permission to revise.","High standards and fear of evaluation are different; these items address concern, not quality.","I worry that a mistake will make others think less of me.","Even small errors can make me question whether I am good enough."),
  dimension("self-monitoring","Self-monitoring","regulation","Social adaptation","How much you adjust presentation after reading the social setting.","Social attunement can help a person communicate across different groups.","A volume control that notices the room.","Meeting new people, professional settings or changing group norms.","Observing how others communicate and adjusting your style.","You more often monitor the setting and adjust your presentation.","You may express yourself more consistently across social settings.","Choice about when adaptation is useful and when you can relax.","Adapting style does not by itself mean inauthenticity.","I notice how other people behave before deciding how to present myself.","I adjust my communication style to fit the situation."),
  dimension("impression-management","Impression management","regulation","Social adaptation","How much the effect of your presentation on others shapes what you show.","Managing impressions can protect privacy or help someone meet a role’s expectations.","A stage costume chosen for a particular room.","Interviews, authority differences, new groups and moments of scrutiny.","Planning what to reveal and how a response may be received.","You more often consider the impression your actions create.","You may prioritise spontaneous expression over careful impression management.","A clear sense of what is private and what the situation needs.","Constantly managing impressions can be tiring or hide important needs.","I think about the impression my actions may create.","I sometimes present myself differently so others will respond more positively."),
  dimension("masking","Masking / compensatory presentation","regulation","Social adaptation","How much you hide or compensate for a response to meet social expectations.","Masking may help navigate settings that are not accommodating.","A translation layer between inner experience and outward behaviour.","Socially demanding settings where a natural response is discouraged.","Rehearsing, suppressing a response or copying expected signals.","You more often report changing or hiding your natural presentation.","You report less frequent deliberate compensation in these items.","Environments where difference is accepted and effort can be recovered.","These questions cannot identify why someone adapts or diagnose neurodivergence.","I hide parts of my natural reactions to fit what a situation expects.","I practise or copy social responses because they do not always come naturally."),
  dimension("contextual-consistency","Contextual consistency","regulation","Self-presentation","How similar your behaviour feels across people and settings.","Consistency can make self-expression feel predictable; flexibility can make it responsive.","A melody that keeps its theme while changing instruments.","Family, work, friendships and settings with different expectations.","Noticing whether you feel like the same person across contexts.","Your self-presentation more often feels similar across situations.","Your style may change more with the people and setting around you.","Room to adapt without losing contact with your values.","Different settings can require legitimate flexibility; consistency is not a virtue score.","I behave in broadly similar ways across different groups.","My way of expressing myself changes noticeably depending on who is present.")
];

const MOTIVE_DATA = [
  ["achievement","Achievement","Meeting demanding standards and accomplishing difficult objectives.","A finish line that matters because the effort means something."],
  ["mastery","Mastery","Becoming genuinely skilled or knowledgeable.","A craft path where progress itself can be rewarding."],
  ["affiliation","Affiliation","Having regular connection and belonging with others.","A place in a group that feels mutual."],
  ["intimacy","Intimacy","Building deep mutual emotional closeness.","Being known in a way that feels safe and reciprocal."],
  ["influence","Influence","Having meaningful influence over decisions or outcomes.","A hand in shaping what happens."],
  ["status","Status","Being recognised as successful or high standing.","Recognition that signals achievement or access."],
  ["security","Security","Creating predictability, protection and stability.","A stable base from which other choices can be made."],
  ["exploration","Exploration","Encountering new experiences, ideas or environments.","A route that opens onto something not yet known."],
  ["caregiving","Caregiving","Protecting or improving the welfare of people who matter to you.","Using effort to make someone else's situation safer or easier."],
  ["autonomy","Autonomy","Having meaningful control over your own direction.","Choosing the route rather than only following it."],
  ["meaning","Meaning","Feeling that your actions contribute to something significant.","A thread connecting today's effort to a larger purpose."]
];

const VALUE_CARDS = [
  ["self-direction-thought","Independent thought","Freedom to develop your own ideas."],
  ["self-direction-action","Independent action","Freedom to choose how you live and act."],
  ["stimulation","Stimulation","Novelty, excitement and change."],
  ["pleasure","Pleasure","Enjoyment and pleasurable experience."],
  ["achievement","Achievement","Demonstrating success through accomplishment."],
  ["power-influence","Influence over people","Having authority or influence over others."],
  ["power-resources","Control of resources","Having substantial financial or material resources."],
  ["face","Public standing","Protecting reputation and avoiding humiliation."],
  ["security-personal","Personal security","Safety and stability in your own life."],
  ["security-social","Social security","Stability and safety in society."],
  ["tradition","Tradition","Preserving inherited cultural, family or religious traditions."],
  ["conformity","Rule conformity","Following legitimate rules and obligations."],
  ["interpersonal-restraint","Interpersonal restraint","Avoiding behaviour that unnecessarily harms or upsets others."],
  ["humility","Humility","Not placing yourself above other people."],
  ["dependability","Dependability to close others","Being someone your people can rely upon."],
  ["care","Caring for close others","Protecting the welfare of people close to you."],
  ["justice","Justice","Supporting fairness and equal concern beyond your own group."],
  ["nature","Nature","Protecting the natural environment."],
  ["tolerance","Tolerance","Accepting people whose lives or beliefs differ from yours."]
];

const NEEDS = [
  ["autonomy","Autonomy","The sense that important choices are genuinely yours."],
  ["competence","Competence","The sense that you can use and develop abilities that matter."],
  ["relatedness","Relatedness","The sense of being meaningfully connected and valued."]
];

const SELF_WORTH_AREAS = ["achievement","other people’s approval","physical attractiveness","moral goodness","usefulness to others","competence","independence","belonging","social status"];

const IDENTITY_DIMENSIONS = [
  dimension("self-worth","Global self-evaluation","identity","Self-understanding","Your broad sense of personal worth.","A stable sense of worth can give room to learn from success and failure.","A foundation beneath changing weather.","Success, criticism, mistakes and comparison.","Whether a setback feels like feedback or a verdict about the whole self.","Your answers suggest a more secure sense of personal worth.","Your answers suggest self-evaluation may be more vulnerable or unsettled.","Specific, humane feedback and relationships that separate behaviour from worth.","These candidate items cannot assess clinical self-esteem or explain its source.","Overall, I see myself as a person of worth.","I generally feel that I have qualities I respect in myself."),
  dimension("self-worth-stability","Self-worth stability","identity","Self-understanding","How much your sense of worth remains steady rather than shifting after outcomes or other people’s reactions.","A steadier sense of worth can make feedback easier to use without turning it into a verdict.","A buoy anchored below the waves rather than one moved by every swell.","Success, criticism, rejection or praise.","Noticing feedback while keeping a distinction between an event and your whole self.","Your sense of worth appears more able to remain steady across recent outcomes or reactions.","Your self-evaluation may shift more noticeably with recent outcomes or reactions.","A pause between feedback and the story you draw about yourself.","Stable and unstable self-worth are not a moral ranking.","~Other people’s reactions can noticeably alter how I feel about myself.","~My sense of worth changes substantially after success or failure."),
  dimension("self-concept-clarity","Self-concept clarity","identity","Self-understanding","How clearly you can describe the characteristics and commitments that define you.","Clarity can support choices and make change easier to recognise.","A map legend that helps you understand your own symbols.","Transitions, conflicting roles and major decisions.","Being able to name what matters and what feels unsettled.","You more often report a clear description of important parts of yourself.","Your self-description may still be changing or difficult to pin down.","Time to explore without pressure to produce a permanent label.","Changing or uncertain identity is not a defect, especially during transition.","I can describe the most important parts of who I am fairly clearly.","I have a coherent sense of the characteristics that define me."),
  dimension("self-concept-confidence","Confidence in self-understanding","identity","Self-understanding","How confident you feel that your current self-description is accurate.","Confidence can help someone act while remaining open to revision.","A map with a visible 'draft' label.","When choosing a direction or receiving new information about yourself.","Feeling you know yourself while still allowing updates.","You more often trust your current understanding of yourself.","You may doubt a self-description even when you can state one.","Small real-world experiments that let you test a self-belief.","Confidence in self-understanding is not the same as certainty or accuracy.","I feel confident that my current understanding of myself is reasonably accurate.","Even when I can describe myself, I often doubt whether that description is true."),
  dimension("self-consistency","Self-consistency","identity","Self-understanding","Whether different parts of your self-description feel coherent or in conflict.","A coherent map can reduce confusion, while contradictions may show competing needs.","Several routes sharing one landscape, even if they do not merge.","A choice between independence and connection, rest and ambition, or two important roles.","Noticing that more than one genuine priority is active.","Your self-description more often feels internally consistent.","Different important parts of you may feel in tension.","Naming both needs before deciding which leads in this situation.","Contradiction is not automatically error or pathology.","The different parts of how I understand myself generally fit together.","Important beliefs I hold about myself often feel mutually contradictory."),
  dimension("temporal-continuity","Temporal continuity","identity","Self-understanding","How connected your current self feels to earlier versions of you.","Continuity can make change feel integrated rather than like erasure.","A path that changes scenery but still connects its chapters.","Looking back on a major life change, loss or reinvention.","Seeing links between who you were and who you are now.","You more often see a meaningful connection across time.","Some earlier versions may feel distant from your current self.","A narrative that honours what changed and what continued.","A person's history may include genuine discontinuity or difficult transitions.","I can see a meaningful connection between who I used to be and who I am now.","Even after major changes, I experience my life as belonging to the same continuing person.")
];

const IDENTITY_EXTRA = [
  dimension("personal-agency","Personal agency","identity","Self-understanding","Your sense that some meaningful actions can influence parts of your life.","Agency can support action without pretending every constraint is under personal control.","A steering wheel that works within the roads and conditions available.","A valued goal, an obstacle or a situation with limited choices.","Looking for one part that remains influenceable.","You more often report a sense of being able to act on meaningful goals.","You may experience stronger constraints or fewer available choices.","Separate what is within reach from what needs collective or material change.","Agency cannot erase structural barriers or guarantee an outcome.","When something matters, I look for the part of the situation I can influence.","I experience myself as capable of intentionally changing some important parts of my life."),
  dimension("authenticity","Authenticity","identity","Self-understanding","How much you know what you think and feel and express values in context.","Authenticity can help actions stay connected to what matters without demanding identical behaviour everywhere.","A melody that can be played in different keys and still be recognisable.","Important relationships, social roles and choices under pressure.","Checking whether a choice reflects your own values.","Your answers suggest more awareness or alignment with what matters to you.","It may be harder to identify or express what feels genuine in some settings.","Private reflection, values clarity and room to adapt without self-erasure.","Authenticity does not require sharing every feeling with every person.","I usually know what I genuinely think or feel before deciding how to present it.","My behaviour in important relationships generally reflects what I value."),
  dimension("identity-exploration","Identity exploration","identity","Self-understanding","How actively you consider and revise possible directions for your life.","Exploration can help test options before committing.","An open atlas with more than one possible route.","Career changes, relationships, learning or major life transitions.","Trying different roles or revisiting an old decision.","You more often explore possible directions or revise what no longer fits.","You may prefer a settled direction over ongoing exploration.","Low-risk experiments and permission to learn from each attempt.","Exploration can continue so long that commitment never gets a chance.","I actively consider different possible directions for my life.","I am willing to revise an identity that no longer fits."),
  dimension("identity-commitment","Identity commitment","identity","Self-understanding","How settled and personally meaningful important life directions currently feel.","Commitment can focus effort and make trade-offs clearer.","A route selected for now, with room to change if evidence changes.","Long-term goals, work, values and important relationships.","Feeling that some directions are genuinely yours.","Important directions more often feel settled and chosen.","You may still be deciding what deserves long-term commitment.","A commitment that is chosen rather than inherited or imposed.","A current commitment is not a permanent identity or obligation.","I have important life directions that I feel genuinely committed to.","Some major parts of who I want to be feel relatively settled.")
];

const extraTraitRows = [
  dimension("motivation-compatibility","Current motivation quality","motives","Motivation quality","Why one important goal is being pursued right now.","Knowing whether a goal is chosen, pressured, enjoyable or habitual can suggest what kind of support may help.","The same destination reached by different engines.","A goal you currently care about or feel expected to pursue.","Enjoyment, personal endorsement, pressure, reward, habit or uncertainty about why.","A goal may have several motives at once; your strongest selection gives the current emphasis.","A goal can be maintained mainly by obligation or external pressure right now.","Revisit whether the goal is still yours and what support would reduce friction.","These are reasons for one chosen goal, not a global motivation score.","Select every reason that currently applies: I enjoy doing it. I personally believe it is worthwhile. It fits the person I want to be. I would feel guilty or ashamed if I did not. Someone else expects or pressures me. I want an external reward or to avoid a consequence. It has become habit. I am not sure why anymore.","Which reason is strongest right now?"),
];


function simpleDimension(id,title,group,definition,more,less,...statements) {
  return dimension(
    id,title,group,"Tendency",definition,
    "This pattern may help organise attention or action in the situations it covers.",
    "Think of it as one dial in a larger control panel, not a complete description of you.",
    "It may appear in the situations named by its questions; the same person can respond differently elsewhere.",
    "Notice the setting, what was at stake and what happened next before drawing a conclusion.",
    more,less,
    "Ask what conditions, support or choice would make this pattern workable for you.",
    "A candidate self-report pattern does not explain its cause or predict every situation.",
    ...statements
  );
}

const RELATIONSHIP_DIMENSIONS = [
  simpleDimension("rel-intimacy","Intimacy appetite","relationships","How much emotional closeness you want in a romantic relationship.","You may want emotionally close, mutually revealing relationships.","You may prefer a more private or less emotionally intense relationship style.","I want a high degree of emotional closeness in a romantic relationship.","I value feeling deeply known by a partner."),
  simpleDimension("rel-autonomy","Autonomy in closeness","relationships","How much independent space you need even when a relationship matters.","You may want meaningful space and independent choices alongside closeness.","You may prefer more shared time or joint decision-making.","Even in a close relationship, I need substantial independent space.","I want room to keep parts of my life that are my own."),
  simpleDimension("rel-reassurance","Relationship reassurance","relationships","How important explicit reassurance feels when relationship signals are unclear.","Direct confirmation may help you settle when signals become ambiguous.","You may not need frequent confirmation to feel secure in the relationship.","When relationship signals become ambiguous, reassurance becomes especially important to me.","A direct message that we are okay can help me settle."),
  simpleDimension("rel-caregiving","Relational caregiving","relationships","How meaningful it feels to attend to a partner’s emotional needs.","Care may be a meaningful way you show commitment and affection.","You may show care in less emotionally focused or more independent ways.","Caring for a partner’s emotional needs feels personally meaningful to me.","I notice when someone close to me needs support."),
  simpleDimension("rel-jealousy","Jealousy sensitivity","relationships","How strongly signs of possible romantic competition attract attention.","Possible changes in a partner’s attention may feel especially salient.","Such cues may be easier to notice without becoming central.","Signs that a partner may prefer someone else quickly capture my attention.","I pay close attention to changes in a partner’s closeness with other people."),
  simpleDimension("rel-repair","Repair orientation","relationships","How readily you want to restore connection after disagreement.","You may prefer to return to the issue and actively rebuild connection.","You may need more time, space or evidence before trying to repair.","After conflict, I usually want to actively repair connection once emotions settle.","I prefer a direct conversation that helps us reconnect after a disagreement."),
  simpleDimension("money-impulsivity","Spending impulsivity","domains","How often a strong want can move spending ahead of a longer-term check.","Immediate enjoyment may sometimes outweigh a later review.","You may more often pause to weigh later effects before spending.","When I strongly want something, I sometimes spend before considering the longer-term effect.","An appealing purchase can make me decide before I check the wider budget."),
  simpleDimension("money-planning","Financial planning behaviour","domains","How regularly you notice and plan for upcoming financial obligations.","Regular monitoring may make obligations more predictable.","You may monitor finances less routinely or only when a decision requires it.","I regularly monitor upcoming financial obligations.","I plan ahead for expenses I know are coming."),
  simpleDimension("money-avoidance","Financial avoidance","domains","How often financial stress leads you to delay looking at the details.","Avoiding a stressful review may offer short-term relief.","You may be more willing to look even when the information feels uncomfortable.","When finances feel stressful, I sometimes avoid checking them.","I put off financial tasks when I worry about what I might find."),
  simpleDimension("money-status","Status consumption","domains","How much a purchase’s message about success or taste contributes to its appeal.","Visible meaning or recognition may add to a purchase’s appeal.","Practical use or personal enjoyment may matter more than its social signal.","Part of the appeal of some purchases is what they communicate about my success or taste.","I notice how some purchases may affect how other people see me."),
  simpleDimension("money-generosity","Financial generosity","domains","How willing you are to use resources to help someone when it matters.","Giving may be a meaningful expression of care or fairness.","You may prioritise preserving your own resources or setting limits.","I am willing to give up some resources when helping another person matters to me.","I sometimes spend or share money to make someone else’s situation easier."),
  simpleDimension("money-scarcity","Scarcity vigilance","domains","How readily you notice signs that future resources may be insufficient.","Vigilance may support preparation and protection.","Future scarcity may take up less attention in your answers.","I readily notice signs that I may not have enough resources later.","Thinking about running out of money can stay on my mind."),
  simpleDimension("decision-deliberation","Deliberation","decisions","How much information you usually gather before an important choice.","Research and reflection may help you compare options carefully.","You may be more comfortable deciding with less information.","I usually collect information before making important decisions.","I compare alternatives before choosing when a decision matters."),
  simpleDimension("decision-intuition","Intuitive reliance","decisions","How willing you are to act on a strong intuition before you can fully explain it.","Intuition may help when experience has made patterns familiar.","You may prefer a reason you can articulate before acting.","I am willing to act on a strong intuitive judgement before I can fully explain it.","I sometimes trust a clear first impression when a choice is time-sensitive."),
  simpleDimension("decision-reversibility","Reversibility sensitivity","decisions","How much the cost of reversing a decision changes how carefully you analyse it.","You may reserve more care for choices that are difficult to undo.","You may make similar decisions with less difference in analysis.","I analyse decisions more heavily when reversing them would be costly.","Whether a decision can be changed later affects how long I consider it."),
  simpleDimension("decision-regret","Regret sensitivity","decisions","How strongly the possibility of later regret influences choices.","You may try to preserve options or reduce the chance of a painful mistake.","Possible regret may have less influence than what seems useful now.","The possibility of later regretting a decision strongly affects my choices.","I think about which option I might wish I had chosen."),
  simpleDimension("decision-information","Information threshold","decisions","How much additional information you prefer before choosing.","You may wait for a clearer picture before committing.","You may act once you have enough to make a reasonable choice.","I prefer waiting for additional information even when it may not resolve all uncertainty.","I want enough information to feel that an important decision is considered."),
  simpleDimension("decision-reopening","Decision reopening","decisions","How often you continue to revisit an important choice after making it.","You may keep evaluating a decision after committing.","You may more often let a decision stand unless new evidence appears.","After making an important choice, I often continue evaluating whether it was correct.","I replay important decisions to check whether I chose well."),
  simpleDimension("initiation","Initiation","decisions","How quickly you start after deciding what to do.","Once a task is chosen, starting may come relatively readily.","Preparation or transition may delay the first step.","Once I have decided what to do, I tend to start relatively quickly.","I can spend a long time preparing to begin something I have already decided to do."),
  simpleDimension("sustainment","Sustainment","decisions","How readily you maintain effort after initial enthusiasm fades.","You may continue when the early novelty has passed.","Interest or external structure may matter more for keeping momentum.","I can maintain effort after the initial enthusiasm has faded.","My projects often lose momentum once they stop feeling new."),
  simpleDimension("adaptability","Adaptability","decisions","How readily you revise a plan when evidence changes.","You may change course when the original route no longer fits.","Once invested, you may prefer to see the current plan through.","I can change direction when evidence suggests the original plan no longer fits.","I find it difficult to abandon an invested plan even when circumstances change.")
];

const DOMAIN_DIMENSIONS = [
  dimension("money-security","Financial security motive","domains","Motive","How strongly a financial buffer contributes to your sense of safety.","A reserve can create options and reduce uncertainty.","A safety net whose meaning depends on the ground beneath it.","Planning savings, managing bills or deciding whether a risk is tolerable.","A buffer feeling essential, comforting or less central.","Security through financial predictability is especially motivating.","Other motives may lead even when security matters.","A realistic view of actual resources, obligations and access to help.","A self-report cannot measure actual financial security or knowledge.","Having a substantial financial buffer is important to my sense of safety.","Financial predictability helps me feel more secure."),
  dimension("money-risk","Financial risk preference","domains","Preference","Your stated preference for predictable versus uncertain returns when both options are practical.","Risk preference can shape what feels acceptable when outcomes are uncertain.","A balance between a known route and a route with a wider range of outcomes.","Investments, career choices or financial commitments.","Preferring a smaller predictable return or a larger uncertain one.","You may be more drawn to a larger uncertain return.","Predictability may be more appealing than uncertain upside.","Consider consequences, time horizon and real ability to absorb a loss.","This is a hypothetical preference, not financial advice or actual risk behaviour.","A smaller predictable return is more appealing to me than a larger uncertain return.","If both options were practical, I would prefer the one with a wider possible outcome."),
  dimension("money-time","Financial time horizon","domains","Preference","A simple choice about immediate versus delayed financial benefit.","Time horizon can make trade-offs visible, though it has many real-world influences.","Choosing when the fruit is ripe, with uncertainty about the season.","Saving, purchases and future planning.","Preferring a later reward with greater value when it feels worth waiting.","An immediate benefit may be more useful or appealing in this situation.","Consider urgent needs and the real cost of waiting.","One hypothetical choice does not measure financial self-control or discounting accurately.","If both were guaranteed, I would prefer £100 today.","If both were guaranteed, I would prefer £150 in one year.")
];

function preference(id,title,group,left,right,prompt) {
  return {id,title,group,type:"B7",left,right,prompt};
}
const RELATIONSHIP_PREFERENCES = [
  preference("rel-commitment","Commitment preference","relationships","Keeping future options open","Building long-term commitment","If both felt safe and freely chosen, which relationship direction would you usually prefer?"),
  preference("rel-novelty","Relationship routine preference","relationships","Familiar relational routines","Regular novelty and change","In a close relationship, which rhythm would you usually prefer?")
];
const COMMUNICATION_PREFERENCES = [
  preference("comm-detail","Communication detail","relationships","Brief and efficient","Detailed and contextual","When an important topic comes up, which communication style feels more natural?"),
  preference("comm-direct","Communication directness","relationships","Imply or soften the message","State the message directly","When the stakes are meaningful, which approach do you usually prefer?"),
  preference("comm-process","Processing style","relationships","Think privately first","Think through conversation","When sorting out a complicated feeling or decision, which helps more?"),
  preference("comm-expression","Emotional expression","relationships","Show little affect outwardly","Show emotion readily","How would you rather express an important feeling?"),
  preference("comm-conflict","Disagreement style","relationships","Preserve smooth interaction first","Raise disagreement promptly","When you notice disagreement, which response is more like your preference?"),
  preference("comm-channel","Communication channel","relationships","Write for important issues","Speak for important issues","For a difficult or important conversation, which channel usually works better?")
];
const LEARNING_PREFERENCES = [
  preference("learn-guidance","Learning structure","domains","Structured guidance","Self-directed exploration","When learning something new, which route do you usually prefer?"),
  preference("learn-method","Learning method","domains","Conceptual explanation","Hands-on practice","When learning a skill, which starting point helps more?"),
  preference("learn-social","Learning company","domains","Solitary learning","Collaborative learning","When learning something demanding, which setting suits you more?"),
  preference("learn-range","Learning breadth","domains","Master one topic deeply","Sample many topics","Which learning rhythm do you usually prefer?")
];

const MOTIVE_STEPS = MOTIVE_DATA.map((m)=>{
  const id=m[0],name=m[1],description=m[2];
  return {id:"motive-"+id+"-strength",group:"motives",type:"I5",title:name,prompt:"How strongly does this outcome tend to motivate you?",text:description};
});

const MOTIVE_BEHAVIOR_STEPS = MOTIVE_DATA.map((m)=>{
  const id=m[0],name=m[1],description=m[2];
  return {id:"motive-"+id+"-behavior",group:"motives",type:"F5",meta:"adaptive-motive",title:name,prompt:"How often does this motive actually influence your choices?",text:"I choose or spend effort on options that support: "+description.toLowerCase()};
});

const NEED_STEPS = NEEDS.flatMap((n)=>{
  const id=n[0],name=n[1],definition=n[2];
  return [
    {id:"need-"+id+"-satisfaction",group:"motives",type:"N5",title:name+" · satisfaction",prompt:"In this area of your life right now…",text:"I experience "+definition.toLowerCase()},
    {id:"need-"+id+"-frustration",group:"motives",type:"N5",title:name+" · frustration",prompt:"In this area of your life right now…",text:"I often feel that this need is actively blocked or frustrated."}
  ];
});

const WORK_PREFERENCES = [
  ["work-autonomy","Autonomy","Having meaningful choice over how I do my work."],
  ["work-predictability","Predictability","Knowing what is expected and what is likely to happen."],
  ["work-variety","Variety","Having varied tasks or changing problems to solve."],
  ["work-challenge","Intellectual challenge","Working with complex questions or ideas."],
  ["work-social","Social contact","Spending a meaningful part of the day with other people."],
  ["work-independent","Independent work","Having time to work alone without constant coordination."],
  ["work-competition","Competition","Having clear comparisons, targets or opportunities to compete."],
  ["work-collaboration","Collaboration","Building outcomes together with other people."],
  ["work-leadership","Leadership","Taking responsibility for direction or group decisions."],
  ["work-recognition","Recognition","Having accomplishments noticed or publicly recognised."],
  ["work-hands","Practical work","Making, repairing, testing or working hands-on."],
  ["work-creative","Creative expression","Creating original work or expressing ideas."],
  ["work-helping","Direct helping","Supporting, teaching or caring for other people directly."],
  ["work-reward","Financial reward","Earning a strong financial return for my effort."],
  ["work-stability","Stability","Having reliable work and predictable conditions."],
  ["work-impact","Social impact","Contributing to a community or cause I care about."]
].map(x=>({id:x[0],group:"domains",type:"I5",title:x[1],prompt:"How desirable is this feature in your work?",text:x[2]}));

const SCENARIOS = [
  {id:"conflict-criticism",group:"relationships",type:"rankChoice",title:"Conflict · criticism",prompt:"Someone important criticises you in a way that feels unfair. What would you be most likely to do first, and what might you do next?",choices:["Address the issue immediately and directly.","Step away until I understand what I think and feel.","Try to reduce tension, even if I leave my concern unstated for now.","Analyse exactly what happened before deciding whether to respond.","Respond strongly so the other person understands the impact.","Wait to see whether the issue resolves on its own."]},
  {id:"conflict-boundary",group:"relationships",type:"rankChoice",title:"Conflict · boundary",prompt:"Someone ignores a boundary you have already stated. What would you be most likely to do first, and what might you do next?",choices:["Restate the boundary clearly and directly.","Take space and decide what limit I need next.","Ask what happened before deciding how to respond.","Try to preserve the relationship and raise it later.","Show how angry or hurt I feel so the impact is clear.","Wait to see whether they notice or change on their own."]},
  {id:"conflict-misunderstanding",group:"relationships",type:"rankChoice",title:"Conflict · misunderstanding",prompt:"A conversation goes badly because you and another person understood the same words differently. What is your first move, and what might follow?",choices:["Clarify exactly what I meant.","Ask them to explain what they heard.","Take time alone before continuing.","Apologise for my part and try to reconnect.","Focus first on the practical outcome.","Leave the topic for now and return when it feels easier."]},
  {id:"conflict-betrayal",group:"relationships",type:"rankChoice",title:"Conflict · trust",prompt:"Someone close breaks an agreement that mattered to you. What would you most likely do first, and what might come second?",choices:["Ask for a clear explanation and accountability.","Set a firm boundary or consequence.","Take space while I decide whether repair is possible.","Try to understand the circumstances before judging intent.","Tell them directly how much it affected me.","Avoid the conversation until I know what I want."]},
  {id:"conflict-status",group:"relationships",type:"rankChoice",title:"Conflict · disagreement",prompt:"In a group, a higher-status person supports a decision you think is wrong. What would you most likely do first, and what might follow?",choices:["State my disagreement in the meeting.","Ask questions that surface the problem indirectly.","Speak privately to the decision-maker afterward.","Support the group publicly and raise concerns later.","Wait for more evidence before responding.","Accept the decision unless the consequences become serious."]}
];



const LEARNING_DIMENSIONS = [
  simpleDimension("learning-persistence","Learning persistence","domains","How readily you stay with difficult material until it begins to make sense.","You more often remain with challenging material.","You may need a change of method, feedback or a smaller step when learning becomes difficult.","I enjoy remaining with difficult material until it makes sense.","I keep trying different approaches when I do not understand something yet."),
  simpleDimension("learning-confusion","Learning through confusion","domains","Whether confusion tends to invite curiosity or quickly become frustrating.","Confusion may motivate you to ask questions and investigate.","You may prefer clarity before continuing with a difficult topic.","Confusion usually increases my curiosity before it becomes frustrating.","When I do not understand something, I want to find out what I am missing."),
  simpleDimension("learning-feedback","Learning feedback","domains","How much frequent feedback supports your engagement.","Frequent feedback may help you see progress and adjust.","You may be able to continue without frequent external feedback.","Frequent feedback helps me stay engaged while learning.","I want to know whether I am on the right track when I learn something new.")
];

const CHANGE_DIMENSIONS = [
  simpleDimension("initiation","Initiation","decisions","How quickly you start after deciding what to do.","Starting may come relatively readily once the decision is made.","Preparation or transition may delay the first step.","Once I have decided what to do, I tend to start relatively quickly.","I can spend a long time preparing to begin something I have already decided to do."),
  simpleDimension("sustainment","Sustainment","decisions","How readily you maintain effort after initial enthusiasm fades.","You may continue when early novelty passes.","Interest or external structure may matter more for keeping momentum.","I can maintain effort after the initial enthusiasm has faded.","My projects often lose momentum once they stop feeling new."),
  simpleDimension("adaptability","Adaptability","decisions","How readily you revise a plan when evidence changes.","You may change course when the original route no longer fits.","Once invested, you may prefer to see the current plan through.","I can change direction when evidence suggests the original plan no longer fits.","Once I have invested in a plan, it is difficult to abandon even if circumstances change.")
];

const SPECIAL_STEPS = [
  ...MOTIVE_STEPS,
  ...NEED_STEPS,
  {id:"motivation-quality",group:"motives",type:"composition",title:"Why one goal matters",prompt:"Think of one goal you are pursuing now. Select every reason that applies, then choose the strongest.",options:[
    "I genuinely enjoy doing it.","I personally believe it is worthwhile.","It fits the person I want to be.","I would feel guilty, ashamed or inadequate if I did not.","Someone else expects or pressures me.","I want an external reward or want to avoid a consequence.","I am pursuing it mostly out of habit.","I am not really sure why I am pursuing it anymore."
  ]},
  {id:"identity-story",group:"identity",type:"multiSelect",title:"Life-story themes",prompt:"Which themes best describe how you currently interpret your life so far? Choose up to three, or skip.",limit:3,options:[
    "I have largely become stronger through difficulty.","Some experiences changed me in ways I still struggle to integrate.","My life feels like gradual exploration rather than one clear path.","I have spent much of my life trying to gain independence.","Belonging and relationships have been central to my development.","Achievement has organised much of my self-understanding.","I have repeatedly had to reinvent myself.","I feel strong continuity between my earlier and current self.","I feel disconnected from important earlier versions of myself.","I am still trying to understand what the central story of my life is."
  ]},
  {id:"identity-setback",group:"identity",type:"singleChoice",title:"Setbacks in your life story",prompt:"When you think about major setbacks, which interpretation fits best right now?",options:[
    "They usually become lessons or turning points.","They remain painful but separate chapters.","They can influence how I interpret later experiences.","I usually try not to integrate them into my identity.","It varies too much to choose one."
  ]},
  {id:"self-worth-contingencies",group:"identity",type:"ratingMatrix",title:"What affects your sense of worth?",prompt:"How much would serious failure or rejection in each area affect your overall sense of worth?",scale:I5,rows:SELF_WORTH_AREAS.map((label,i)=>({id:"worth-"+i,label}))},
  {id:"rel-commitment","group":"relationships","type":"B7","title":"Commitment preference","prompt":"If both felt safe and freely chosen, which relationship direction would you usually prefer?","left":"Keeping future options open","right":"Building long-term commitment"},
  {id:"rel-novelty","group":"relationships","type":"B7","title":"Relationship routine preference","prompt":"In a close relationship, which rhythm would you usually prefer?","left":"Familiar relational routines","right":"Regular novelty and change"},
  ...COMMUNICATION_PREFERENCES,
  ...SCENARIOS,
  ...REGULATION_SCENARIOS,
  ...MONEY_RISK_SCENARIOS,
  ...MONEY_DELAY_SCENARIOS,
  ...LEARNING_PREFERENCES,
  ...WORK_PREFERENCES,
  {id:"work-top-five",group:"domains",type:"topFive",title:"Your work non-negotiables","prompt":"Which five work conditions would be hardest for you to sacrifice? Choose up to five.",limit:5,options:WORK_PREFERENCES.map(x=>x.title)},
  {id:"state-context",group:"snapshot",type:"stateMatrix",title:"A snapshot of right now",prompt:"These answers describe this moment only. They are not used as personality traits.",rows:[
    ["energy","How energised do you feel?"],
    ["positive","How positive do you feel?"],
    ["anxiety","How anxious or vigilant do you feel?"],
    ["irritable","How irritable do you feel?"],
    ["connected","How socially connected do you feel?"],
    ["assertive","How assertive do you feel?"],
    ["focused","How mentally focused do you feel?"],
    ["intense","How emotionally intense do you feel?"],
    ["safe","How safe or comfortable do you feel?"],
    ["overloaded","How overloaded do you feel?"],
    ["hunger","How much is hunger affecting you?"],
    ["fatigue","How much is physical fatigue affecting you?"],
    ["pain","How much is pain or physical discomfort affecting you?"]
  ],contexts:[
    {id:"mode",label:"What kind of moment is this?",options:["Ordinary / baseline","Safe or well-resourced","Being evaluated or watched","Relationship uncertainty","Conflict or difficult conversation","Reward, excitement or opportunity","Sensory or demand overload","Fatigue or low energy","Recovery","Other"]},
    {id:"with",label:"Who are you mainly with?",options:["Alone","Romantic partner","Family","Close friend(s)","Acquaintances","Colleagues or classmates","Strangers or public","Mixed group","Other"]},
    {id:"doing",label:"What are you mainly doing?",options:["Resting","Working or studying","Socialising","Travelling","Domestic tasks","Entertainment","Exercising","Eating","Conflict or difficult conversation","Other activity"]},
    {id:"demand",label:"Current demand level",options:["Very low","Low","Moderate","High","Very high"]},
    {id:"uncertainty",label:"Current uncertainty",options:["Very low","Low","Moderate","High","Very high"]},
    {id:"evaluation",label:"Current evaluation pressure",options:["Very low","Low","Moderate","High","Very high"]},
    {id:"sleep",label:"Sleep quality last night",options:["Very poor","Poor","Okay","Good","Very good","Prefer not to say"]}
  ]}
];

const ALL_DIMENSIONS = DIMENSIONS
  .concat(DISPOSITION_DATA)
  .concat(MORE_DIMENSIONS.filter(d=>!["regulation-flexibility","initiation","sustainment","adaptability"].includes(d.id)))
  .concat(IDENTITY_DIMENSIONS,IDENTITY_EXTRA,RELATIONSHIP_DIMENSIONS.filter(d=>!["initiation","sustainment","adaptability"].includes(d.id)),DOMAIN_DIMENSIONS.filter(d=>d.id!=="money-risk"&&d.id!=="money-time"),LEARNING_DIMENSIONS,CHANGE_DIMENSIONS)
  .filter((d,i,all)=>all.findIndex(x=>x.id===d.id)===i);

function shuffle(list) {
  const out=list.slice();
  for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
  return out;
}

function makeValueRounds() {
  const deck=shuffle(VALUE_CARDS);
  const rounds=[];
  /* Ten balanced mini-rounds keep the best-worst comparison visible without
   * making the values section carry the full burden of the questionnaire. */
  for(let r=0;r<COMPACT_VALUE_ROUNDS;r++) {
    const cards=[];
    for(let j=0;j<4;j++) cards.push(deck[(r*4+j)%deck.length]);
    rounds.push(cards);
  }
  return rounds;
}

function compactItemsFor(d) {
  if(!d||!Array.isArray(d.items)) return [];
  const limit=COMPACT_PAIR_IDS.has(d.id)?2:1;
  return d.items.slice(0,limit);
}

function compileFlow(valueRounds) {
    const modules=MODULES.map(mod=>{
    let steps=[];
    if(mod.id==="motives") {
      steps.push(...MOTIVE_STEPS,...NEED_STEPS);
      for(let i=0;i<valueRounds.length;i++) steps.push({id:"values-"+i,group:"motives",type:"values",title:"Values · choice "+(i+1)+" of "+valueRounds.length,prompt:"Choose the value most important to how you want to live, then the one least central in this set.",cards:valueRounds[i]});
      steps.push(SPECIAL_STEPS.find(s=>s.id==="motivation-quality"));
    } else if(mod.id==="identity") {
      steps.push(SPECIAL_STEPS.find(s=>s.id==="self-worth-contingencies"),SPECIAL_STEPS.find(s=>s.id==="identity-story"),SPECIAL_STEPS.find(s=>s.id==="identity-setback"));
    } else {
      steps.push(...SPECIAL_STEPS.filter(s=>s.group===mod.id && s.type!=="ratingMatrix" && s.id!=="identity-story" && s.id!=="identity-setback"));
    }
    const dims=ALL_DIMENSIONS.filter(d=>d.group===mod.id);
    const dimSteps=dims.flatMap(d=>compactItemsFor(d).map(item=>({
      id:item.id,group:mod.id,type:item.type||"T7",dimension:d.id,title:d.title,prompt:"Across most situations over roughly the past year, how much is this like you?",text:item.text,reverse:item.reverse
    })));
    if(mod.id==="temperament") steps=[...dimSteps];
    else if(mod.id==="dispositions") steps=[...dimSteps];
    else if(mod.id==="relationships") steps=[...dimSteps,...steps];
    else if(mod.id==="regulation") steps=[...dimSteps,...steps];
    else if(mod.id==="identity") steps=[...dimSteps,...steps];
    else if(mod.id==="domains") steps=[...dimSteps,...steps];
    else if(mod.id==="decisions") steps=[...dimSteps];
    else if(mod.id==="snapshot") steps=[...steps];
    return Object.assign({},mod,{steps});
  });
  return modules;
}

let phase="intro";
let answers=Object.create(null);
let flow=[];
let valueRounds=[];
let stepIndex=0;

function clearDraft() { try { localStorage.removeItem(DRAFT_KEY); } catch {} }
function savedDraft() {
  try {
    const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");
    if(!d||d.version!==VERSION||!Array.isArray(d.valueRounds)||!Array.isArray(d.answers)||!Number.isInteger(d.stepIndex)) return null;
    return d;
  } catch { return null; }
}
function saveDraft(root) {
  try {
    localStorage.setItem(DRAFT_KEY,JSON.stringify({version:VERSION,valueRounds,answers:Object.entries(answers),stepIndex,flow,followupCount,motiveFollowupsQueued}));
    const status=root.querySelector("#pf-save-status");
    if(status) status.textContent="Saved on this device. Anyone using this browser profile could reopen the draft.";
  } catch {
    const status=root.querySelector("#pf-save-status");
    if(status) status.textContent="This browser could not save locally. Your answers remain in this tab.";
  }
}
function startFresh(root) {
  clearDraft();answers=Object.create(null);valueRounds=makeValueRounds();flow=compileFlow(valueRounds);stepIndex=0;followupCount=0;motiveFollowupsQueued=false;phase="questions";render(root);
}


function esc(value) {
  return String(value==null?"":value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function moduleIndexFor(stepIndex) {
  let cursor=0;
  for(let i=0;i<flow.length;i++) {
    if(stepIndex<cursor+flow[i].steps.length) return {module:flow[i],local:stepIndex-cursor,index:i};
    cursor+=flow[i].steps.length;
  }
  return {module:flow[flow.length-1],local:0,index:flow.length-1};
}
function totalSteps() { return flow.reduce((n,m)=>n+m.steps.length,0); }
function countAnswered() { return Object.values(answers).filter(v=>v!==undefined&&v!==null).length; }
function stepAnswered(step) { return Object.prototype.hasOwnProperty.call(answers,step.id)&&answers[step.id]!==null; }
function stepValid(step) {
  const a=answers[step.id];
  if(a===undefined||a===null) return false;
  if(step.type==="values") return a&&a.most!=null&&a.least!=null&&a.most!==a.least;
  if(step.type==="ratingMatrix") return step.rows.every(r=>a&&Object.prototype.hasOwnProperty.call(a,r.id));
  if(step.type==="stateMatrix") return !!(a.states&&step.rows.every(r=>Object.prototype.hasOwnProperty.call(a.states,r[0])));
  if(step.type==="rankChoice") return a&&a.first!==undefined&&a.first!=="";
  if(step.type==="multiSelect"||step.type==="topFive") return Array.isArray(a)&&a.length>0;
  if(step.type==="composition") return a&&Array.isArray(a.selected)&&a.selected.length>0&&a.strongest!==undefined&&a.strongest!==""&&a.selected.includes(String(a.strongest));
  return true;
}
function saveStatus(root,text) { const el=root.querySelector("#pf-save-status"); if(el) el.textContent=text; }

function discriminatorStepFor(d) {
  const options=DISCRIMINATOR_BANK[d.id]||GENERIC_DISCRIMINATORS;
  return {id:"discriminator-"+d.id,group:d.group,type:"singleChoice",meta:"discriminator",dimension:d.id,title:"What changes this pattern?",prompt:"Your answers to "+d.title.toLowerCase()+" were not identical. Which factor changes it most?",options};
}
function queueMotiveFollowups(step) {
  if(motiveFollowupsQueued||step?.group!=="motives"||!step.id.endsWith("-strength")) return;
  if(!MOTIVE_STEPS.every(s=>Object.prototype.hasOwnProperty.call(answers,s.id))) return;
  const ranked=MOTIVE_STEPS
    .map(s=>({step:MOTIVE_BEHAVIOR_STEPS.find(x=>x.id===s.id.replace("-strength","-behavior")),value:answers[s.id]}))
    .filter(x=>x.step&&typeof x.value==="number")
    .sort((a,b)=>b.value-a.value);
  const chosen=ranked.filter(x=>x.value>=3).slice(0,3);
  for(const candidate of ranked) {
    if(chosen.length>=3)break;
    if(!chosen.includes(candidate))chosen.push(candidate);
  }
  const pos=moduleIndexFor(stepIndex);
  const inserts=chosen.map(x=>x.step).filter(Boolean);
  if(inserts.length)pos.module.steps.splice(pos.local+1,0,...inserts);
  motiveFollowupsQueued=true;
}
function queueFollowups(step) {
  if(!step||!step.dimension||step.meta)return;
  const pos=moduleIndexFor(stepIndex),mod=pos.module,next=mod.steps[pos.local+1];
  if(next&&next.dimension===step.dimension)return;
  const d=ALL_DIMENSIONS.find(x=>x.id===step.dimension);
  if(!d)return;
  const sig=signalFor(d);
  if(["mixed","lean-more","lean-less"].includes(sig.pattern)) {
    const discId="discriminator-"+d.id;
    if(followupCount<FOLLOWUP_BUDGET&&!mod.steps.some(s=>s.id===discId)&&answers[discId]===undefined) {
      mod.steps.splice(pos.local+1,0,discriminatorStepFor(d));
      followupCount++;
    }
  }
  CONTRADICTION_RULES.forEach(rule=>{
    if(!rule.ids.includes(d.id))return;
    const map=signalMap(allSignals());
    if(!rule.ids.every(id=>map[id]&&map[id].direction))return;
    const id="clarify-"+rule.id;
    if(followupCount<FOLLOWUP_BUDGET&&!mod.steps.some(s=>s.id===id)&&answers[id]===undefined) {
      mod.steps.splice(pos.local+1,0,{id,group:d.group,type:"singleChoice",meta:"contradiction",title:rule.title,prompt:rule.prompt,options:rule.options,dimension:d.id});
      followupCount++;
    }
  });
}

function renderIntro(root) {
  const saved=savedDraft();
  const modules=MODULES.map(m=>"<li><span><b>"+esc(m.title)+"</b><small>"+esc(m.intro)+"</small></span><em>"+esc(m.time)+"</em></li>").join("");
  const resume=saved
    ? "<aside class='pf-resume'><b>A saved profile draft is on this device.</b><p>It is stored only in this browser. Anyone using this browser profile could reopen it.</p><div class='pf-button-row'><button type='button' class='button' id='pf-resume'>Resume draft</button><button type='button' class='button secondary' id='pf-clear-draft'>Clear draft</button></div></aside>"
    : "";
  root.innerHTML=[
    "<div class='wrap pf-wrap'><section class='pf-intro'>",
    "<div class='pf-intro-copy'><p class='eyebrow'>Nobody’s Simple · Personal Psychological Guide 1.4</p>",
    "<h1>A map of how you work<br><em>with room for change.</em></h1>",
    "<p class='lead'>A compact adaptive self-reflection assessment that turns your answers into a readable guide to patterns, relationships, work, money, decisions, regulation and growth—not a fixed type.</p>",
    "<div class='pf-facts'><span>About 45–70 minutes</span><span>Up to 200 adaptive steps</span><span>16 interpretive chapters</span><span>Pause and return if you save locally</span></div>",
    "<button class='button' id='pf-start' type='button'>Build my personal guide <span aria-hidden='true'>↗</span></button>",
    "<p class='pf-privacy'>Your answers stay in this tab unless you explicitly choose to save a draft or state check-in on this device. Nothing is sent to Nobody’s Simple.</p></div>",
    "<div class='pf-intro-art'><img src='personality-map.png' alt='A friendly map character following a dotted path'><p>More than one pattern can be true at once.</p></div></section>",
    "<section class='pf-principles'><article><span>01</span><h2>Dimensions before types</h2><p>Your separate response patterns are the result. The story title is a playful shorthand, not a psychological category.</p></article><article><span>02</span><h2>Describe before explaining</h2><p>We distinguish what you reported from what might be worth testing. The assessment cannot tell you why a pattern developed.</p></article><article><span>03</span><h2>State is not trait</h2><p>The final check-in describes right now. It is shown apart from your longer-term responses.</p></article></section>",
    "<section class='pf-scope'><div><p class='eyebrow'>A fuller map</p><h2>All parts of the profile</h2><p>Each module can be skipped item by item. Responses use different formats for tendencies, motives, needs, preferences, values and current states; those formats are not combined into one total score.</p></div><ul class='pf-module-list'>"+modules+"</ul></section>",
    "<aside class='pf-validity'><b>Public edition 1.4 · compact, evidence-gated, exploratory</b><p>This adaptive questionnaire keeps every construct represented, uses paired items where they add the most information, and may ask a small capped number of clarifiers when answers are mixed. Its candidate items, scoring rules and profile interpretations have not been psychometrically validated or normed. It can leave the profile open when evidence does not converge. It does not diagnose, rank or compare you with a population.</p></aside>",
    resume,
    "<p class='pf-back'><a href='#home'>← Back to the main website</a></p></div>"
  ].join("");
  root.querySelector("#pf-start").addEventListener("click",()=>startFresh(root));
  if(saved) {
    root.querySelector("#pf-resume").addEventListener("click",()=>{
      answers=Object.fromEntries(saved.answers);
      valueRounds=saved.valueRounds;
      flow=Array.isArray(saved.flow)&&saved.flow.every(m=>m&&Array.isArray(m.steps))?saved.flow:compileFlow(valueRounds);
      followupCount=Number.isInteger(saved.followupCount)?saved.followupCount:0;
      motiveFollowupsQueued=Boolean(saved.motiveFollowupsQueued)||Object.keys(answers).some(id=>id.endsWith("-behavior"));
      stepIndex=Math.max(0,Math.min(saved.stepIndex,totalSteps()-1));
      phase="questions";
      render(root);
    });
    root.querySelector("#pf-clear-draft").addEventListener("click",()=>{clearDraft();render(root);});
  }
}

function optionList(options,name,selected,kind) {
  return "<fieldset class='pf-options'><legend class='pf-sr'>Choose one</legend>"+options.map((op,i)=>{
    const value=String(op[0]),label=op[1];
    return "<label class='pf-option'><input type='radio' name='"+esc(name)+"' value='"+esc(value)+"' data-pf-answer='"+esc(kind)+"' "+(String(selected)===value?"checked":"")+"><span class='pf-option-number'>"+esc(value)+"</span><span class='pf-option-label'>"+esc(label)+"</span></label>";
  }).join("")+"</fieldset>";
}
function b7Options(step,selected) {
  const rows=[
    ["-3","Strongly prefer "+step.left],["-2","Moderately prefer "+step.left],["-1","Slightly prefer "+step.left],
    ["0","Depends / no consistent preference"],["1","Slightly prefer "+step.right],["2","Moderately prefer "+step.right],["3","Strongly prefer "+step.right]
  ];
  return optionList(rows,"pf-answer-"+step.id,selected,"numeric");
}
function renderSingleStep(step) {
  const current=answers[step.id];
  if(step.type==="T7") return "<p class='pf-prompt'>"+esc(step.prompt||"Across most situations over roughly the past year, how much is this like you?")+"</p><h2 class='pf-item'>"+esc(step.text||step.title)+"</h2>"+optionList(T7,"pf-answer-"+step.id,current,"numeric");
  if(step.type==="I5"||step.type==="F5"||step.type==="N5"||step.type==="S5") {
    const scale=step.type==="I5"?I5:step.type==="F5"?F5:step.type==="N5"?N5:S5;
    return "<p class='pf-prompt'>"+esc(step.prompt)+"</p><h2 class='pf-item'>"+esc(step.text||step.title)+"</h2>"+optionList(scale,"pf-answer-"+step.id,current,"numeric");
  }
  if(step.type==="B7") return "<p class='pf-prompt'>"+esc(step.prompt)+"</p><div class='pf-bipolar'><span>"+esc(step.left)+"</span><span>"+esc(step.right)+"</span></div>"+b7Options(step,current);
  if(step.type==="singleChoice") {
    const opts=step.options.map((t,i)=>[String(i),t]);
    return "<p class='pf-prompt'>"+esc(step.prompt)+"</p>"+optionList(opts,"pf-answer-"+step.id,current,"choice");
  }
  if(step.type==="rankChoice") {
    const answer=current||{};
    const opts="<option value=''>Choose a first response…</option>"+step.choices.map((t,i)=>"<option value='"+i+"' "+(String(answer.first)===String(i)?"selected":"")+">"+esc(t)+"</option>").join("");
    const second="<option value=''>Optional second response…</option>"+step.choices.map((t,i)=>"<option value='"+i+"' "+(String(answer.second)===String(i)?"selected":"")+">"+esc(t)+"</option>").join("");
    return "<p class='pf-prompt'>"+esc(step.prompt)+"</p><label class='pf-select-label'>Most likely first<select id='pf-rank-first'>"+opts+"</select></label><label class='pf-select-label'>What might come next?<select id='pf-rank-second'>"+second+"</select></label><p class='pf-small-note'>There is no preferred answer. These choices describe a scenario response, not a proven skill.</p>";
  }
  return "";
}

function renderValuesStep(step) {
  const a=answers[step.id]||{};
  return "<p class='pf-prompt'>"+esc(step.prompt)+"</p><div class='pf-value-instructions'><b>Most important</b><span>Choose one value that you would prioritise in this set.</span><b>Least central</b><span>Choose one that you would be more willing to set aside in this set.</span></div><div class='pf-value-grid'>"+step.cards.map(c=>{
    const id=c[0],name=c[1],desc=c[2];
    return "<article class='pf-value-card'><h3>"+esc(name)+"</h3><p>"+esc(desc)+"</p><label><input type='radio' name='pf-value-most' value='"+esc(id)+"' "+(a.most===id?"checked":"")+"> Most important</label><label><input type='radio' name='pf-value-least' value='"+esc(id)+"' "+(a.least===id?"checked":"")+"> Least central</label></article>";
  }).join("")+"</div><p class='pf-small-note'>Values often compete. This is a comparative choice in this round, not a score or a ranking of your worth.</p>";
}

function renderSelectList(step,selected,limit,kind) {
  const ids=Array.isArray(selected)?selected:[];
  return "<p class='pf-prompt'>"+esc(step.prompt)+"</p><fieldset class='pf-choice-list'><legend class='pf-sr'>Choose up to "+limit+"</legend>"+step.options.map((o,i)=>{
    const label=typeof o==="string"?o:o.label;
    const key=typeof o==="string"?String(i):String(o.value);
    return "<label><input type='checkbox' value='"+esc(key)+"' data-pf-multi='"+esc(kind)+"' "+(ids.includes(key)?"checked":"")+"><span>"+esc(label)+"</span></label>";
  }).join("")+"</fieldset><p class='pf-small-note' id='pf-multi-count'>"+ids.length+" selected · up to "+limit+"</p>";
}
function renderComposition(step) {
  const a=answers[step.id]||{selected:[],strongest:""};
  const options=step.options.map((o,i)=>{
    const v=String(i);
    return "<label><input type='checkbox' value='"+v+"' data-pf-composition "+(a.selected.includes(v)?"checked":"")+"><span>"+esc(o)+"</span></label>";
  }).join("");
  return "<p class='pf-prompt'>"+esc(step.prompt)+"</p><fieldset class='pf-choice-list'><legend class='pf-sr'>Select all reasons that apply</legend>"+options+"</fieldset><label class='pf-select-label'>Strongest reason right now<select id='pf-composition-strong'><option value=''>Choose one of your selections…</option>"+step.options.map((o,i)=>"<option value='"+i+"' "+(String(a.strongest)===String(i)?"selected":"")+" "+(a.selected.includes(String(i))?"":"disabled")+">"+esc(o)+"</option>").join("")+"</select></label>";
}
function renderValueMatrix(step) {
  const current=answers[step.id]||{};
  return "<p class='pf-prompt'>"+esc(step.prompt)+"</p><div class='pf-rating-matrix'>"+step.rows.map((r)=>{
    const radios=(step.scale||I5).map(op=>"<label class='pf-matrix-option'><input type='radio' name='pf-matrix-"+esc(step.id)+"-"+esc(r.id)+"' value='"+esc(op[0])+"' data-pf-matrix='"+esc(r.id)+"' "+(String(current[r.id])===String(op[0])?"checked":"")+"><span>"+esc(op[1])+"</span></label>").join("");
    const skipped="<label class='pf-matrix-skip'><input type='radio' name='pf-matrix-"+esc(step.id)+"-"+esc(r.id)+"' value='skip' data-pf-matrix='"+esc(r.id)+"' "+(current[r.id]===null?"checked":"")+"><span>Skip</span></label>";
    return "<div class='pf-matrix-row'><b>"+esc(r.label)+"</b><div>"+radios+skipped+"</div></div>";
  }).join("")+"</div>";
}
function renderStateMatrix(step) {
  const current=answers[step.id]||{states:{},contexts:{}};
  const stateRows=step.rows.map(r=>{
    const radios=S5.map(op=>"<label class='pf-matrix-option'><input type='radio' name='pf-state-"+esc(r[0])+"' value='"+esc(op[0])+"' data-pf-state='"+esc(r[0])+"' "+(String(current.states&&current.states[r[0]])===String(op[0])?"checked":"")+"><span>"+esc(op[1])+"</span></label>").join("");
    const skipped="<label class='pf-matrix-skip'><input type='radio' name='pf-state-"+esc(r[0])+"' value='skip' data-pf-state='"+esc(r[0])+"' "+(current.states&&current.states[r[0]]===null?"checked":"")+"><span>Skip</span></label>";
    return "<div class='pf-matrix-row'><b>"+esc(r[1])+"</b><div>"+radios+skipped+"</div></div>";
  }).join("");
  const contextRows=step.contexts.map(c=>{
    const options="<option value=''>Choose if useful…</option>"+c.options.map(o=>"<option "+(current.contexts&&current.contexts[c.id]===o?"selected":"")+">"+esc(o)+"</option>").join("");
    return "<label class='pf-select-label'>"+esc(c.label)+"<select data-pf-context='"+esc(c.id)+"'>"+options+"</select></label>";
  }).join("");
  return "<p class='pf-prompt'>"+esc(step.prompt)+"</p><p class='pf-small-note'>The centre is a response option, not a default. Choose a response or Skip for each row.</p><div class='pf-rating-matrix pf-state-matrix'>"+stateRows+"</div><h3 class='pf-context-title'>What is around this moment?</h3><div class='pf-context-grid'>"+contextRows+"</div>";
}

function renderStep(root) {
  if(!flow.length) flow=compileFlow(valueRounds);
  const pos=moduleIndexFor(stepIndex),mod=pos.module,step=mod.steps[pos.local];
  if(!step){phase="result";render(root);return;}
  const pct=Math.round((stepIndex/Math.max(1,totalSteps()))*100);
  let body="";
  if(step.type==="values") body=renderValuesStep(step);
  else if(step.type==="topFive") body=renderSelectList(step,answers[step.id],step.limit,"top-five");
  else if(step.type==="multiSelect") body=renderSelectList(step,answers[step.id],step.limit,"multi");
  else if(step.type==="composition") body=renderComposition(step);
  else if(step.type==="ratingMatrix") body=renderValueMatrix(step);
  else if(step.type==="stateMatrix") body=renderStateMatrix(step);
  else body=renderSingleStep(step);

  const savedLabel="Save progress on this device";
  root.innerHTML=[
    "<div class='wrap pf-question-wrap'><div class='pf-question-top'><a href='#home'>← Main website</a><span>"+esc(VERSION)+"</span></div>",
    "<section class='pf-question-card pf-question-layout'><aside class='pf-question-rail'><div class='pf-rail-kicker'>Your guide</div><h2>One answer at a time.</h2><p>There is no ideal response. Context and contradiction are useful information.</p><ol>"+flow.map((m,i)=>"<li class='"+(i===pos.index?"is-current":"")+"'><span>"+String(i+1).padStart(2,"0")+"</span>"+esc(m.title)+"</li>").join("")+"</ol><small>Nothing is sent to the site. Save only if you choose.</small></aside><div class='pf-question-main'><div class='pf-progress-top'><span>Module "+(pos.index+1)+" of "+flow.length+" · "+esc(mod.title)+"</span><span>Step "+(stepIndex+1)+" of "+totalSteps()+"</span></div>",
    "<div class='pf-progress' role='meter' aria-label='Assessment progress' aria-valuemin='0' aria-valuemax='"+totalSteps()+"' aria-valuenow='"+(stepIndex+1)+"'><span style='width:"+pct+"%'></span></div>",
    "<p class='pf-module-intro'>"+esc(mod.intro)+"</p><p class='pf-progress-hint'>"+countAnswered()+" response steps completed · no timer</p>",
    "<p class='eyebrow'>"+esc(step.title||mod.title)+"</p>",
    (step.text&&step.type!=="T7"&&step.type!=="I5"&&step.type!=="F5"&&step.type!=="N5"&&step.type!=="S5"?"<h1 class='pf-step-heading'>"+esc(step.text)+"</h1>":""),
    "<div class='pf-step-body'>"+body+"</div>",
    "<div class='pf-controls'><button class='button secondary' type='button' id='pf-previous' "+(stepIndex===0?"disabled":"")+">← Previous</button><button class='pf-skip' type='button' id='pf-skip'>Skip this item</button><button class='button' type='button' id='pf-next' "+(stepValid(step)?"":"disabled")+">"+(stepIndex===totalSteps()-1?"Build my profile":"Continue")+" →</button></div>",
    "<div class='pf-save-row'><button type='button' class='pf-save' id='pf-save'>"+savedLabel+"</button><p id='pf-save-status' aria-live='polite'>Nothing is saved unless you choose. A saved draft stays in this browser profile.</p></div>",
    "</div></section><p class='pf-footnote'>There is no ideal response. “Mixed / depends” is a useful answer. Your context matters.</p></div>"
  ].join("");

  root.querySelectorAll("[data-pf-answer]").forEach(input=>input.addEventListener("change",()=>{
    const raw=input.value;
    answers[step.id]=(step.type==="singleChoice")?raw:Number(raw);
    root.querySelector("#pf-next").disabled=!stepValid(step);
  }));
  root.querySelectorAll("[name='pf-value-most'],[name='pf-value-least']").forEach(input=>input.addEventListener("change",()=>{
    const a=answers[step.id]||{};
    const pickedMost=root.querySelector("[name='pf-value-most']:checked");
    const pickedLeast=root.querySelector("[name='pf-value-least']:checked");
    answers[step.id]={most:pickedMost?pickedMost.value:a.most,least:pickedLeast?pickedLeast.value:a.least};
    root.querySelector("#pf-next").disabled=!stepValid(step);
  }));
  root.querySelectorAll("[data-pf-multi]").forEach(input=>input.addEventListener("change",()=>{
    const checked=[...root.querySelectorAll("[data-pf-multi]:checked")];
    if(checked.length>step.limit){input.checked=false;return;}
    answers[step.id]=checked.map(x=>x.value);
    const counter=root.querySelector("#pf-multi-count");
    if(counter)counter.textContent=checked.length+" selected · up to "+step.limit;
    root.querySelector("#pf-next").disabled=!stepValid(step);
    root.querySelectorAll("[data-pf-multi]").forEach(x=>{x.disabled=!x.checked&&checked.length>=step.limit;});
  }));
  root.querySelectorAll("[data-pf-composition]").forEach(input=>input.addEventListener("change",()=>{
    const selected=[...root.querySelectorAll("[data-pf-composition]:checked")].map(x=>x.value);
    const select=root.querySelector("#pf-composition-strong");
    if(!selected.includes(select.value))select.value="";
    answers[step.id]={selected,strongest:select.value};
    select.querySelectorAll("option").forEach(o=>{if(o.value!=="")o.disabled=!selected.includes(o.value);});
    root.querySelector("#pf-next").disabled=!stepValid(step);
  }));
  const compSelect=root.querySelector("#pf-composition-strong");
  if(compSelect) compSelect.addEventListener("change",()=>{
    const selected=[...root.querySelectorAll("[data-pf-composition]:checked")].map(x=>x.value);
    answers[step.id]={selected,strongest:compSelect.value};
    root.querySelector("#pf-next").disabled=!stepValid(step);
  });
  const rankFirst=root.querySelector("#pf-rank-first"),rankSecond=root.querySelector("#pf-rank-second");
  if(rankFirst) {
    const updateRank=()=>{
      const sec=rankSecond.value;
      if(sec!==""&&sec===rankFirst.value) rankSecond.value="";
      answers[step.id]={first:rankFirst.value,second:rankSecond.value};
      root.querySelector("#pf-next").disabled=!stepValid(step);
    };
    rankFirst.addEventListener("change",updateRank);rankSecond.addEventListener("change",updateRank);
  }
  root.querySelectorAll("[data-pf-matrix]").forEach(input=>input.addEventListener("change",()=>{
    const a=Object.assign({},answers[step.id]||{});
    a[input.dataset.pfMatrix]=input.value==="skip"?null:Number(input.value);
    answers[step.id]=a;
    root.querySelector("#pf-next").disabled=!stepValid(step);
  }));
  root.querySelectorAll("[data-pf-state]").forEach(input=>input.addEventListener("change",()=>{
    const a=answers[step.id]||{states:{},contexts:{}};
    a.states=Object.assign({},a.states);
    a.states[input.dataset.pfState]=input.value==="skip"?null:Number(input.value);
    answers[step.id]=a;
    root.querySelector("#pf-next").disabled=!stepValid(step);
  }));
  root.querySelectorAll("[data-pf-context]").forEach(input=>input.addEventListener("change",()=>{
    const a=answers[step.id]||{states:{},contexts:{}};
    a.contexts=Object.assign({},a.contexts);
    a.contexts[input.dataset.pfContext]=input.value;
    answers[step.id]=a;
  }));
  root.querySelector("#pf-previous").addEventListener("click",()=>{if(stepIndex>0){stepIndex--;render(root);}});
  root.querySelector("#pf-skip").addEventListener("click",()=>{answers[step.id]=null;goNext(root);});
  root.querySelector("#pf-next").addEventListener("click",()=>{if(stepValid(step))goNext(root);});
  root.querySelector("#pf-save").addEventListener("click",()=>saveDraft(root));
}
function goNext(root) {
  const pos=moduleIndexFor(stepIndex),step=pos.module?.steps[pos.local];
  queueMotiveFollowups(step);
  queueFollowups(step);
  if(stepIndex<totalSteps()-1){stepIndex++;render(root);}
  else {clearDraft();phase="result";render(root);}
}


function responseValues(d) {
  return d.items.map(item=>{
    const raw=answers[item.id];
    if(typeof raw!=="number") return null;
    return item.reverse ? 6-raw : raw;
  }).filter(v=>v!==null);
}
function mean(values) { return values.length?values.reduce((a,b)=>a+b,0)/values.length:null; }
function spread(values) {
  if(values.length<2)return 0;
  const m=mean(values);
  return Math.sqrt(values.reduce((sum,v)=>sum+Math.pow(v-m,2),0)/values.length);
}
/* A directional average is not automatically good evidence. The narrative
 * gate requires both distance from the midpoint and agreement between the
 * repeated items; the appendix still shows every answer. */
function evidenceClassFor(values,pattern,distance,consistency) {
  if(!values.length)return "insufficient";
  if(values.length===1)return "direct";
  if(!["more","less","lean-more","lean-less"].includes(pattern))return "mixed";
  const extremePair=values.length===2&&((values.every(v=>v>=5))||(values.every(v=>v<=1)));
  if(distance>=.5&&consistency>=.78&&(values.length>=3||extremePair))return "supported";
  if(distance>=.25&&consistency>=.5)return "preliminary";
  return "mixed";
}
function signalFor(d) {
  const values=responseValues(d);
  let pattern="unknown";
  const avg=mean(values),sd=spread(values);
  if(values.length>=2) {
    /* Preserve a directional lean when the item set is not unanimous. */
    if(avg>=4.25) pattern="more";
    else if(avg<=1.75) pattern="less";
    else if(avg>=3.5) pattern="lean-more";
    else if(avg<=2.5) pattern="lean-less";
    else pattern="mixed";
  } else if(values.length===1) pattern="single";
  const distance=avg==null?0:Math.abs(avg-3)/3;
  const consistency=values.length<2?0:Math.max(0,1-(sd/2.4));
  const evidenceClass=evidenceClassFor(values,pattern,distance,consistency);
  const confidence=values.length<2?"insufficient":evidenceClass==="supported"?"supported within-assessment pattern":evidenceClass==="preliminary"?"preliminary scale signal":"mixed or context-dependent";
  const direction=pattern==="more"||pattern==="lean-more"?"more":pattern==="less"||pattern==="lean-less"?"less":null;
  return {dimension:d,values,count:values.length,total:d.items.length,pattern,mean:avg,sd,spread:sd,distance,consistency,confidence,evidenceClass,direction};
}
function allSignals() { return ALL_DIMENSIONS.map(signalFor); }
function signalMap(signals) { return Object.fromEntries(signals.map(s=>[s.dimension.id,s])); }
function hasPattern(signals,id,pattern) {
  const s=signalMap(signals)[id];
  if(!s)return false;
  if(pattern==="more")return s.pattern==="more"||s.pattern==="lean-more";
  if(pattern==="less")return s.pattern==="less"||s.pattern==="lean-less";
  return s.pattern===pattern;
}
function hasSupportedPattern(signals,id,pattern) {
  const s=signalMap(signals)[id];
  if(!s||s.evidenceClass!=="supported")return false;
  return pattern==="more"?s.direction==="more":pattern==="less"?s.direction==="less":s.pattern===pattern;
}
function profileConfidenceFor(signals) {
  const answered=signals.filter(s=>s.count>0).length;
  const paired=signals.filter(s=>s.count>=2);
  const supported=paired.filter(s=>s.evidenceClass==="supported").length;
  const preliminary=paired.filter(s=>s.evidenceClass==="preliminary").length;
  const mixed=paired.filter(s=>s.evidenceClass==="mixed").length;
  const directional=paired.filter(s=>s.direction&&s.evidenceClass!=="mixed").length;
  let level="too-uncertain",label="Too uncertain",note="There is not enough coherent, converging evidence to assign a story-title or a dominant profile.";
  if(supported>=6&&directional>=8){level="strong";label="Clear pattern";note="Several independent paired signals converge on the same broad configuration.";}
  else if(supported>=3&&directional>=3){level="moderate";label="Moderate pattern";note="Several paired signals support a useful configuration, while some contextual detail remains open.";}
  else if(supported>=2||preliminary>=5||directional>=3){level="limited";label="Limited pattern";note="Some signals are usable, but the profile should be read as a working hypothesis rather than a settled type.";}
  return {level,label,note,answered,paired:paired.length,supported,preliminary,mixed,directional};
}
function evidenceWeight(signal) {
  if(!signal)return 0;
  if(signal.evidenceClass==="supported")return 1;
  if(signal.evidenceClass==="preliminary")return .62;
  if(signal.evidenceClass==="direct")return .2;
  return 0;
}
function signedSignalValue(signal) {
  if(!signal||signal.mean==null)return 0;
  if(signal.direction) return (signal.direction==="more"?1:-1)*Math.max(.18,signal.distance||0);
  if(signal.evidenceClass==="direct") return Math.max(-1,Math.min(1,(signal.mean-3)/3));
  return 0;
}
function stateBand(signal) {
  if(!signal||signal.mean==null)return "unknown";
  if(signal.direction==="more"&&(signal.evidenceClass==="supported"||signal.evidenceClass==="preliminary"))return "higher";
  if(signal.direction==="less"&&(signal.evidenceClass==="supported"||signal.evidenceClass==="preliminary"))return "lower";
  if(signal.mean>=4)return "higher";
  if(signal.mean<=2)return "lower";
  return "middle";
}
function nLabel(v,scale) { const hit=scale.find(x=>Number(x[0])===Number(v)); return hit?hit[1]:"Not answered"; }
function I5label(v) { return nLabel(v,I5); }
function F5label(v) { return nLabel(v,F5); }
function getValueCounts() {
  const counts=Object.fromEntries(VALUE_CARDS.map(v=>[v[0],{most:0,least:0}]));
  const rounds=valueRounds.length||COMPACT_VALUE_ROUNDS;
  for(let i=0;i<rounds;i++) {
    const a=answers["values-"+i];
    if(!a) continue;
    if(a.most&&counts[a.most]) counts[a.most].most++;
    if(a.least&&counts[a.least]) counts[a.least].least++;
  }
  return counts;
}
function selectedWork() {
  return WORK_PREFERENCES.map(w=>({id:w.id,title:w.title,text:w.text,value:answers[w.id]}))
    .filter(w=>typeof w.value==="number")
    .sort((a,b)=>b.value-a.value);
}
function motifValues() {
  return MOTIVE_DATA.map(m=>({id:m[0],title:m[1],description:m[2],strength:answers["motive-"+m[0]+"-strength"],frequency:answers["motive-"+m[0]+"-behavior"]}));
}
function usefulDirections(signals) {
  return signals.filter(s=>(s.direction==="more"||s.direction==="less")&&["supported","preliminary"].includes(s.evidenceClass)).sort((a,b)=>(b.distance||0)-(a.distance||0));
}
function strongestDirections(signals,limit) {
  return usefulDirections(signals).slice(0,limit);
}
/* Psychological profile patterns are generated from interacting dimensions,
 * not selected by first-match mythology rules. A pattern needs converging
 * core evidence; supporting dimensions change its expression but cannot by
 * themselves manufacture a confident type. */
const PROFILE_PATTERNS = [
  {id:"deliberative-explorer",name:"The Deliberative Explorer",tag:"Exploration draws you toward complexity; deliberation helps you decide when it is navigable enough to act.",technical:"Exploration × uncertainty sensitivity × deliberation",core:[["intellectual-curiosity",1],["uncertainty-intolerance",1],["decision-deliberation",1]],support:[["stimulation",1],["decision-reopening",1],["learning-confusion",1]],mode:"Analyst / Explorer",story:"Ariadne’s thread with an Athena influence"},
  {id:"socially-cautious-connector",name:"The Socially Cautious Connector",tag:"Connection matters, while the conditions for entering a social space matter too.",technical:"Social interest × entry confidence × relational investment",core:[["sociability",1],["social-boldness",-1],["rel-intimacy",1]],support:[["support-seeking",1],["emotional-disclosure",1],["sensory-overload",-1]],mode:"Relational / Threshold",story:"Hermes at the threshold"},
  {id:"autonomous-stabiliser",name:"The Autonomous Stabiliser",tag:"You seem to want self-direction that rests on conditions reliable enough to support it.",technical:"Autonomy × security × structured action",core:[["rel-autonomy",1],["money-security",1],["planning-dependence",1]],support:[["orderliness",1],["money-scarcity",1],["work-predictability",1]],mode:"Boundary / Stabilising",story:"Artemis with a Hestia hearth"},
  {id:"adaptive-initiator",name:"The Adaptive Initiator",tag:"You are pulled toward movement and can revise the route once action gives you information.",technical:"Initiation × adaptability × stimulation",core:[["initiation",1],["adaptability",1],["stimulation",1]],support:[["goal-drive",1],["persistence",-1],["decision-reopening",1]],mode:"Explorer / Route-changing",story:"Odysseus, the route-changer"},
  {id:"relationally-vigilant-connector",name:"The Relationally Vigilant Connector",tag:"Closeness carries real meaning, and ambiguity can make the relationship system work harder.",technical:"Intimacy × relational vigilance × reassurance / repair",core:[["rel-intimacy",1],["attachment-anxiety",1],["rel-reassurance",1]],support:[["rel-repair",1],["rel-autonomy",-1],["rumination",1]],mode:"Relational / Repair-led",story:"Psyche’s deep listener"},
  {id:"structured-creator",name:"The Structured Creator",tag:"Ideas become more usable when freedom is paired with form, standards and a route to refinement.",technical:"Imagination × orderliness × standards",core:[["imagination",1],["orderliness",1],["personal-standards",1]],support:[["aesthetic-sensitivity",1],["thoroughness",1],["evaluative-perfectionism",-1]],mode:"Maker / Craft-led",story:"Hephaestus, the patient maker"},
  {id:"independent-collaborator",name:"The Independent Collaborator",tag:"You may want meaningful connection without giving up control over your own contribution.",technical:"Autonomy × social interest × agency",core:[["rel-autonomy",1],["sociability",1],["agency",1]],support:[["work-collaboration",1],["work-independent",1],["assertiveness",1]],mode:"Collaborator / Self-directed",story:"Artemis with a Hermes bridge"},
  {id:"persistent-mastery-seeker",name:"The Persistent Mastery-Seeker",tag:"The satisfaction of getting better can keep effort alive after the first spark has gone.",technical:"Mastery × persistence × deliberate effort",core:[["persistence",1],["thoroughness",1],["learning-persistence",1]],support:[["effortful-control",1],["personal-standards",1],["stimulation",-1]],mode:"Maker / Mastery-led",story:"Hephaestus at the long bench"},
  {id:"signal-sensitive-regulator",name:"The Signal-Sensitive Regulator",tag:"You may notice fine-grained input while also needing to manage how much reaches your system at once.",technical:"Sensory orienting × sensory load × body awareness",core:[["sensory-orienting",1],["sensory-overload",1],["interoception",1]],support:[["stress-vulnerability",1],["baseline-activation",1],["self-soothing",1]],mode:"Signal-reader / Regulation",story:"Iris, the signal-reader"}
];
function storyLensFor(pattern) {
  if(!pattern)return null;
  const descriptions={
    "deliberative-explorer":"Ariadne’s thread with an Athena influence",
    "socially-cautious-connector":"Hermes at the threshold",
    "autonomous-stabiliser":"Artemis with a Hestia hearth",
    "adaptive-initiator":"Odysseus, the route-changer",
    "relationally-vigilant-connector":"Psyche’s deep listener",
    "structured-creator":"Hephaestus, the patient maker",
    "independent-collaborator":"Artemis with a Hermes bridge",
    "persistent-mastery-seeker":"Hephaestus at the long bench",
    "signal-sensitive-regulator":"Iris, the signal-reader"
  };
  const name=descriptions[pattern.id];
  return name?{name,tag:"A metaphorical memory hook for the psychological configuration above.",lore:"This story lens is optional and non-diagnostic. The evidence is in the interaction of the measured dimensions, not in the mythic reference.",basis:"Generated from the selected psychological pattern rather than an arbitrary first-match rule."}:null;
}
function profilePatternScore(pattern,signals) {
  const map=signalMap(signals);
  const fit=(entry)=>{
    const s=map[entry[0]];
    if(!s)return {value:0,weight:0,signal:null,positive:false};
    const weight=evidenceWeight(s),value=signedSignalValue(s)*entry[1];
    return {value:Math.max(-1,Math.min(1,value)),weight,signal:s,positive:value>0};
  };
  const core=pattern.core.map(fit),support=pattern.support.map(fit);
  const coreDen=core.reduce((n,x)=>n+(x.weight||0),0)||1;
  const supportDen=support.reduce((n,x)=>n+(x.weight||0),0)||1;
  const coreFit=core.reduce((n,x)=>n+x.value*(x.weight||0),0)/coreDen;
  const supportFit=support.reduce((n,x)=>n+x.value*(x.weight||0),0)/supportDen;
  const coreSupported=core.filter(x=>x.signal?.evidenceClass==="supported"&&x.positive).length;
  const contradictions=core.filter(x=>x.signal?.evidenceClass!=="insufficient"&&!x.positive).length;
  return {pattern,score:coreFit*.72+supportFit*.28-contradictions*.18,coreFit,supportFit,coreSupported,contradictions,core,support};
}
function profileSelectionFor(signals) {
  const evidenceConfidence=profileConfidenceFor(signals);
  const ranked=PROFILE_PATTERNS.map(p=>profilePatternScore(p,signals)).sort((a,b)=>b.score-a.score);
  const winner=ranked[0],runner=ranked[1];
  const margin=winner&&runner?winner.score-runner.score:0;
  const dominant=evidenceConfidence.level==="strong"?!!winner&&winner.score>=.3&&margin>=.18:evidenceConfidence.level==="moderate"?!!winner&&winner.score>=.4&&margin>=.2:false;
  /* A public-facing title is a high-cost interpretation. Require converging
   * evidence across every core route rather than allowing two lucky extremes
   * plus a preliminary third signal to manufacture certainty from noise. */
  const assignable=dominant&&winner&&winner.coreSupported>=3&&winner.contradictions<2;
  const primary=assignable?winner.pattern:null;
  const secondary=assignable&&runner&&runner.coreSupported>=1&&runner.score>=.16&&(winner.score-runner.score)<=.2&&runner.pattern.id!==winner.pattern.id?runner.pattern:null;
  const confidence=assignable?evidenceConfidence:(evidenceConfidence.level==="strong"||evidenceConfidence.level==="moderate"?Object.assign({},evidenceConfidence,{level:"limited",label:"Several patterns fit",note:"Multiple signals are present, but no single configuration clears the dominance margin. The report keeps the map open instead of forcing a type."}):evidenceConfidence);
  const map=signalMap(signals);
  const signature=(ids,label)=>{
    const vals=ids.map(id=>({id,s:map[id]})).filter(x=>x.s&&x.s.mean!=null);
    if(vals.length<2)return null;
    return {label,text:vals.map(x=>x.s.dimension.title+" · "+patternLabel(x.s).replace("Items leaned ","")).join(" · ")};
  };
  const signatures=[];
  const social=[stateBand(map.sociability),stateBand(map["social-boldness"])];
  if(social.every(x=>x!=="unknown")){
    const text=social[0]==="higher"&&social[1]==="higher"?"Socially interested and relatively easy to enter":social[0]==="higher"&&social[1]==="lower"?"Wants connection; benefits from a clearer opening":social[0]==="lower"&&social[1]==="higher"?"Socially capable without needing constant contact":"Lower social appetite and lower approach pull";
    signatures.push({label:"Social entry",text});
  }
  const sensory=[stateBand(map["sensory-orienting"]),stateBand(map["sensory-overload"])];
  if(sensory.every(x=>x!=="unknown")){
    const text=sensory[0]==="higher"&&sensory[1]==="higher"?"Notices a lot; dense input can drain":sensory[0]==="higher"&&sensory[1]==="lower"?"Notices subtle input without as much reported load":sensory[0]==="lower"&&sensory[1]==="higher"?"May miss fine detail while density still taxes the system":"Lower salience and lower reported load";
    signatures.push({label:"Sensory pattern",text});
  }
  const closeness=[stateBand(map["rel-intimacy"]),stateBand(map["rel-autonomy"])];
  if(closeness.every(x=>x!=="unknown")){
    const text=closeness[0]==="higher"&&closeness[1]==="higher"?"Deep connection with protected independent space":closeness[0]==="higher"?"Togetherness-forward relationship preference":closeness[1]==="higher"?"Independence-forward relationship preference":"Neither closeness nor autonomy dominates the current map";
    signatures.push({label:"Closeness × autonomy",text});
  }
  const action=[stateBand(map.initiation),stateBand(map.sustainment),stateBand(map.adaptability)];
  if(action.every(x=>x!=="unknown")){
    const text=action[0]==="higher"&&action[1]==="higher"&&action[2]==="higher"?"Starts, sustains and revises with relative continuity":action[0]==="higher"&&action[1]==="lower"?"Fast starts; the middle needs visible support":action[0]==="lower"&&action[1]==="higher"?"Slow starts can become durable once underway":"Action changes by task, energy or context";
    signatures.push({label:"Action pattern",text});
  }
  const motive=motifValues().filter(x=>typeof x.strength==="number").sort((a,b)=>b.strength-a.strength)[0];
  if(motive) signatures.push({label:"Current motive",text:motive.title+" is a strong reported pull; its actual expression depends on opportunity and resources."});
  const mode=primary?.mode||"Open / context-dependent";
  return {confidence,ranked,primary,secondary,margin,signatures:signatures.slice(0,5),mode,storyTitle:primary?storyLensFor(primary):null};
}
function titleFor(signals) {
  const checks=[
    {ok:hasPattern(signals,"intellectual-curiosity","more")&&hasPattern(signals,"uncertainty-intolerance","more"),name:"Ariadne’s Threadfinder",tag:"Curiosity follows the maze; uncertainty makes you read the thread.",lore:"Ariadne is remembered in Greek myth for the thread that helped a traveller find a route through a labyrinth. Here the thread is a story-image for curiosity moving alongside uncertainty."},
    {ok:hasPattern(signals,"sociability","more")&&hasPattern(signals,"social-boldness","less"),name:"Hermes at the Threshold",tag:"Connection matters; entering the room may take a more considered first step.",lore:"Hermes is a messenger and traveller in Greek myth. This title uses the image of a threshold: social interest and social ease can be different parts of the same map."},
    {ok:hasPattern(signals,"stimulation","more")&&hasPattern(signals,"adaptability","more"),name:"Odysseus, the Route-Changer",tag:"New paths draw you in, and evidence can give you reason to change course.",lore:"Odysseus is known through the Greek epic journey home. The title is a metaphor for exploration and revising a route, not a claim that a myth predicts your life."},
    {ok:hasPattern(signals,"persistence","more")&&motifValues().some(m=>m.id==="mastery"&&m.strength>=3),name:"Hephaestus, the Patient Maker",tag:"Practice and craft can matter as much as the first spark.",lore:"Hephaestus is the Greek mythic maker and craftsperson. This story-title points to the combination of reported persistence and a strong mastery motive."},
    {ok:hasPattern(signals,"orderliness","more")&&motifValues().some(m=>m.id==="security"&&m.strength>=3),name:"Hestia’s Hearthkeeper",tag:"A dependable base can make room for the work and people you care about.",lore:"Hestia is associated with the hearth in Greek myth. Here the hearth represents a preference for steadiness and security, not a prescribed domestic role."},
    {ok:hasPattern(signals,"intellectual-curiosity","more")&&hasPattern(signals,"decision-deliberation","more"),name:"Athena’s Question-Keeper",tag:"Questions pull you toward understanding; important choices invite careful thought.",lore:"Athena is associated with wisdom and strategy in Greek myth. This title is a metaphor for curiosity paired with deliberate information-gathering."},
    {ok:hasPattern(signals,"compassion","more")&&hasPattern(signals,"rel-intimacy","more"),name:"Psyche, the Deep Listener",tag:"Care and being deeply known may both matter in close relationships.",lore:"Psyche is a figure in Greek myth whose story centres on a difficult journey and relationship. The title is a narrative cue for care and closeness, not a relationship prediction."},
    {ok:hasPattern(signals,"sensory-orienting","more")&&hasPattern(signals,"sensory-overload","more"),name:"Iris, the Signal-Reader",tag:"You may notice many signals, while busy input can also ask more of your attention.",lore:"Iris is a messenger associated with the rainbow in Greek myth. The title evokes noticing signals; it does not imply a diagnosis or special ability."},
    {ok:motifValues().some(m=>m.id==="autonomy"&&m.strength>=3)&&motifValues().some(m=>m.id==="exploration"&&m.strength>=3),name:"Artemis of the Open Trail",tag:"Independent direction and exploration both seem to pull strongly.",lore:"Artemis is associated with the wild and the hunt in Greek myth. The open trail here is a metaphor for autonomy and exploration, not a fixed identity."}
  ];
  const match=checks.find(x=>x.ok);
  if(match) return {name:match.name,tag:match.tag,lore:match.lore,basis:"This story-title was selected from a visible combination in your answers. It is a memory aid only; your separate response patterns are the profile."};
  const enough=signals.filter(s=>s.count>=2).length;
  if(enough<5) return {name:"Hecate at the Crossroads",tag:"Several routes are possible; no single pattern needs to lead.",lore:"Hecate is associated in Greek tradition with crossroads and transitions. This title is an image for an open choice point, not a personality category or a claim about your future.",basis:"Too few repeated-item scales had enough answers for a pattern-based story-title, so this broad mythic image leaves the map open rather than guessing."};
  return {name:"The Many-Threaded Cartographer",tag:"A profile made of connected routes, not one single road.",lore:"The cartographer is the site’s story-image for mapping more than one real pattern at a time.",basis:"No specific mythic combination was clearly supported by the candidate items, so the title stays broad rather than forcing a type."};
}

function archetypeProfile(title,signals) {
  const m=signalMap(signals),directions=strongestDirections(signals,5);
  const names=directions.slice(0,3).map(s=>s.dimension.title.toLowerCase());
  let story=title.lore,gift="Turning several kinds of information into a route you can actually use.",labyrinth="A useful strength can become a loop when it is asked to solve every context in the same way.",journey="Notice which conditions let this pattern help, and which conditions ask for a different tool.",thread="Keep the map detailed enough to guide you, but light enough to keep moving.",variant="Contextual / many-threaded variant";
  if(title.name.includes("Ariadne")) { story="Ariadne’s myth is remembered through the thread that helps a traveller navigate a labyrinth; later parts of the story include rupture, abandonment and a changed direction. Nobody’s Simple uses the thread as a metaphor for orientation inside complexity, not as a prediction."; gift="Mapping complexity: curiosity can enter difficult questions while structure turns them into something navigable."; labyrinth="The thread can become a checking loop when uncertainty remains active after further information stops changing the choice."; journey="Learn to distinguish a useful thread from an endless thread: when is the map improving, and when is it only postponing movement?"; thread="Use structure to navigate uncertainty, not to abolish it."; }
  else if(title.name.includes("Hermes")) { story="Hermes is a mythic messenger and traveller, often pictured at crossings and thresholds. Here the threshold marks the difference between wanting connection and finding the first approach easy."; gift="Carrying messages between people, ideas and settings while noticing when an entry point needs to feel safe."; labyrinth="Waiting for a perfect opening can hide genuine social interest or leave your message unsent."; journey="Design smaller, clearer thresholds rather than treating hesitation as a final answer about belonging."; thread="A low-pressure opening is still an opening."; }
  else if(title.name.includes("Odysseus")) { story="Odysseus is the traveller of a long, changing return journey. The title is used for exploration plus willingness to revise a route when the evidence changes."; gift="Finding a workable route through novelty, feedback and changing conditions."; labyrinth="Constant route changes can become another form of avoiding commitment or recovery."; journey="Pair adaptability with a clear enough destination and a deliberate stopping point."; thread="Change the route when the evidence changes, not merely because the road feels unfamiliar."; }
  else if(title.name.includes("Hephaestus")) { story="Hephaestus is a Greek mythic craftsperson associated with making, repair and skilled work. The image is about patient construction, not a role you must perform."; gift="Making difficult things more reliable through practice, detail and visible progress."; labyrinth="Craft standards can keep moving the finish line after the work is already useful."; journey="Define what finished means before the next refinement begins."; thread="Let quality serve the purpose, not replace it."; }
  else if(title.name.includes("Hestia")) { story="Hestia is associated with the hearth: a dependable centre that makes shared life possible. Here it represents security and steadiness without prescribing a domestic identity."; gift="Creating conditions in which people, work and recovery can become sustainable."; labyrinth="Protection can become over-control when every variable must be settled before living begins."; journey="Build a base that supports exploration rather than becoming a reason to avoid it."; thread="A safe harbour is for returning from journeys, not for cancelling them."; }
  else if(title.name.includes("Athena")) { story="Athena is associated with wisdom and strategy in Greek myth. The title is a story-image for curiosity paired with careful information gathering."; gift="Turning questions into decisions with proportionate evidence."; labyrinth="More analysis can look like responsibility even when it is no longer changing the choice."; journey="Set an information threshold and let intuition, values and action have a turn too."; thread="Ask what new information would actually change your mind."; }
  else if(title.name.includes("Psyche")) { story="Psyche’s myth follows a difficult journey through trust, uncertainty and relationship. The title is used for attentive care and a wish to be deeply known, not a relationship forecast."; gift="Taking another person’s experience seriously while making room for repair and mutuality."; labyrinth="Care can become over-responsibility or reassurance loops when another person’s state feels like your task to manage."; journey="Practise closeness with boundaries: care, clarity and agency can coexist."; thread="Ask what support is wanted before trying to carry the whole story."; }
  else if(title.name.includes("Iris")) { story="Iris is a mythic messenger associated with the rainbow. Here the image is about noticing signals and translating between kinds of information, not a diagnosis or special ability."; gift="Detecting subtle changes and translating them into useful environmental or relational adjustments."; labyrinth="When every signal matters equally, attention and energy can become saturated."; journey="Learn which signals deserve action, which deserve a note and which can pass by."; thread="Noticing is information; it is not an instruction to respond to everything."; }
  else if(title.name.includes("Artemis")) { story="Artemis is associated with the wild and an open trail. The title is a metaphor for autonomy and exploration, not a fixed identity or prescribed role."; gift="Choosing a direction with enough independence to follow curiosity and meaning."; labyrinth="Freedom without a chosen boundary can become fragmentation or difficulty accepting help."; journey="Protect autonomy while building reciprocal supports that make the trail sustainable."; thread="Choose the route, then let useful company join you."; }
  if(names.some(n=>/relationship|intimacy|attachment|commun|trust|care/i.test(n)))variant="Relational / connection-led variant";
  else if(names.some(n=>/curios|imagin|aesthetic|creative|learning|intellect/i.test(n)))variant="Creative / investigative variant";
  else if(names.some(n=>/order|dilig|thorough|planning|security|prudence/i.test(n)))variant="Structured / craft-led variant";
  return {story,variant,why:"This title is a compression of several visible answers—not a category. The most relevant threads in your map include "+(names.join(", ")||"the routes you answered directly")+".",gift,labyrinth,journey,thread};
}

function renderArchetypeChapter(profile,signals) {
  const p=profile.primary;
  const c=profile.confidence;
  const headline=p?p.name:"Open Map — evidence still forming";
  const tag=p?p.tag:"Your answers contain useful routes, but they do not converge enough for one dominant psychological profile. The detailed map stays open rather than inventing certainty.";
  const technical=p?p.technical:"No primary configuration assigned";
  const secondary=profile.secondary?"<article class='pf-profile-secondary'><span class='pf-label'>Close second</span><h3>"+esc(profile.secondary.name)+"</h3><p>"+esc(profile.secondary.tag)+"</p><small>It is close enough to keep in view, not strong enough to merge into a blended type.</small></article>":"";
  const signature=profile.signatures.length?"<div class='pf-signature-chips'>"+profile.signatures.map(s=>"<span><b>"+esc(s.label)+"</b> "+esc(s.text)+"</span>").join("")+"</div>":"<p class='pf-small-note'>No multi-variable signature has enough answered evidence to headline yet.</p>";
  const story=profile.storyTitle?"<article class='pf-story-lens'><span class='pf-label'>Optional story lens</span><h3>"+esc(profile.storyTitle.name)+"</h3><p>"+esc(profile.storyTitle.tag)+"</p><small>Myth is a memory aid only. The psychological pattern above is the evidence-based layer.</small></article>":"";
  return "<section class='pf-archetype-chapter' id='pf-archetype'><div class='pf-profile-kicker'>Nobody’s Simple Psychological Profile</div><div class='pf-profile-head'><div><p class='pf-title-label'>Primary configuration</p><h1>"+esc(headline)+"</h1><p class='pf-archetype-tagline'>"+esc(tag)+"</p><p class='pf-tech-profile'><b>Technical pattern:</b> "+esc(technical)+"</p></div><div class='pf-profile-confidence pf-confidence-"+esc(c.level)+"'><span>Profile evidence</span><strong>"+esc(c.label)+"</strong><small>"+esc(c.note)+"</small></div></div>"+signature+"<div class='pf-archetype-grid'>"+secondary+story+"<article><span class='pf-label'>How to read this</span><p>The title is a compact name for an interaction among your answers, not a category, diagnosis, ability claim or permanent identity. The Full Read explains what may activate the pattern, what it can do, where it can become costly and what changes it.</p></article></div></section>";
}

function usableSignal(signal) { return !!signal&&["supported","preliminary","direct"].includes(signal.evidenceClass); }
function signalDirectionText(signal) {
  if(!signal||!usableSignal(signal))return "not enough evidence to describe this direction";
  if(signal.direction==="more")return signal.dimension.more;
  if(signal.direction==="less")return signal.dimension.less;
  return "the answer changes by context rather than settling into one direction";
}
function selectedWorkTitles() { return selectedWork().filter(w=>w.value>=3).slice(0,6).map(w=>w.title.toLowerCase()); }
function regulationPatternText() {
  const choices=REGULATION_SCENARIOS.map(s=>({s,v:answers[s.id]})).filter(x=>typeof x.v==="string").map(x=>({choice:x.s.options[Number(x.v)]||"",v:Number(x.v)}));
  if(!choices.length)return "The regulation matrix is still open; no condition-specific strategy pattern can be summarised yet.";
  const settle=choices.filter(x=>/settle|ground|accept|permission|allow|break|distract/i.test(x.choice)).length;
  const act=choices.filter(x=>/step|action|plan|boundary|control|separate|explain|meaning/i.test(x.choice)).length;
  const support=choices.filter(x=>/ask|contact|support|connection|comfort|help/i.test(x.choice)).length;
  const switched=new Set(choices.map(x=>x.v)).size;
  const lead=settle>=act&&settle>=support?"settling or allowing the wave to pass":act>=support?"practical action or understanding":"support and connection";
  return "Across the controllability and intensity changes, your first choices most often point toward "+lead+". You changed strategy in "+switched+" of six option positions, so regulation is better described as condition-matched than as one fixed coping style.";
}
function conflictPatternText() {
  const rows=SCENARIOS.map(s=>({a:answers[s.id]})).filter(x=>x.a&&x.a.first!==undefined&&x.a.first!=="");
  if(!rows.length)return "No conflict scenarios were completed, so the report will not infer a conflict style.";
  const direct=rows.filter(x=>[0,1,4].includes(Number(x.a.first))).length;
  const pause=rows.filter(x=>[2,3,5].includes(Number(x.a.first))).length;
  const repair=rows.filter(x=>Number(x.a.first)===3||Number(x.a.second)===3).length;
  return "In hypothetical conflict, you selected a direct or boundary-setting first move in "+direct+" of "+rows.length+" scenarios and a pause, analysis or delay in "+pause+". Repair appeared in "+repair+" scenario path"+(repair===1?"":"s")+". This suggests a response sequence that may change with power, trust and perceived fairness rather than a single conflict type.";
}
function motiveEnactmentText() {
  const rows=motifValues().filter(m=>typeof m.strength==="number");
  if(!rows.length)return "Motive strength and enactment are not available yet.";
  const active=rows.filter(m=>m.strength>=3&&typeof m.frequency==="number"&&m.frequency>=3).slice(0,3);
  const desired=rows.filter(m=>m.strength>=3&&(!Number.isFinite(m.frequency)||m.frequency<3)).slice(0,3);
  const environment=rows.filter(m=>m.strength<3&&typeof m.frequency==="number"&&m.frequency>=3).slice(0,2);
  const bits=[];
  if(active.length)bits.push("strong and frequently enacted: "+active.map(m=>m.title.toLowerCase()).join(", "));
  if(desired.length)bits.push("strong but less often enacted: "+desired.map(m=>m.title.toLowerCase()).join(", "));
  if(environment.length)bits.push("present in choices despite a more moderate pull: "+environment.map(m=>m.title.toLowerCase()).join(", "));
  return bits.length?"Your motive answers separate what matters from what is currently enacted. They show "+bits.join("; ")+". A gap can reflect time, opportunity, resources or competing priorities rather than a lack of sincerity.":"Your motive ratings do not yet show a stable strength–enactment pattern.";
}
function needsParadoxText() {
  const rows=NEEDS.map(n=>({name:n[1],sat:answers["need-"+n[0]+"-satisfaction"],fru:answers["need-"+n[0]+"-frustration"]})).filter(x=>typeof x.sat==="number"||typeof x.fru==="number");
  if(!rows.length)return "Current need conditions were not completed.";
  const both=rows.filter(x=>x.sat>=3&&x.fru>=3).map(x=>x.name.toLowerCase());
  return both.length?"You reported both meaningful support and meaningful frustration around "+both.join(", ")+". That is not a scoring error: it may mean different relationships or moments provide and block the same need, or that support is real but insufficient. The current test cannot decide which explanation is true, so treat the contrast as a question to observe.":"Your satisfaction and frustration answers do not currently show a strong same-need paradox; they still describe this period rather than a fixed trait.";
}
function selfWorthContingencyText() {
  const a=answers["self-worth-contingencies"]||{};
  const rows=SELF_WORTH_AREAS.map((name,i)=>({name,value:a["worth-"+i]})).filter(x=>typeof x.value==="number").sort((x,y)=>y.value-x.value);
  if(!rows.length)return "The self-worth contingency matrix was not completed.";
  const top=rows.filter(x=>x.value>=3).slice(0,4).map(x=>x.name.toLowerCase());
  return top.length?"Your self-evaluation appears most sensitive, in this session, to "+top.join(", ")+". If one of those areas also carries a strong motive or identity commitment, failure there may feel more identity-loaded than the event alone would predict. That is a hypothesis about weighting, not a verdict about your worth.":"No self-worth area reached the upper response range, so the matrix does not identify a dominant contingency from this session.";
}
function adaptationCostText(signals) {
  const map=signalMap(signals),bits=[];
  const add=(ids,name,effect,cost)=>{const present=ids.map(id=>map[id]).filter(s=>s&&s.evidenceClass!=="insufficient");if(present.length>=2&&present.some(s=>s.direction==="more"))bits.push(name+" may be effective for "+effect+", but could cost "+cost+" when it becomes the default response.");};
  add(["self-monitoring","masking","contextual-consistency"],"Presentation management","keeping social situations workable","energy, spontaneity or recovery time");
  add(["personal-standards","thoroughness","evaluative-perfectionism"],"Perfectionistic checking","protecting quality or avoiding preventable error","time and a moving finish line");
  add(["rel-reassurance","attachment-anxiety","rumination"],"Reassurance and checking","reducing relational ambiguity","temporary relief followed by renewed monitoring");
  add(["planning-dependence","orderliness","uncertainty-intolerance"],"Hyper-planning","creating orientation before action","flexibility and time after the plan is already sufficient");
  return bits.length?bits.join(" "):"The current evidence does not support a specific costly-adaptation pattern. Notice which strategies work well but leave a disproportionate recovery bill.";
}
function profileOneSentence(profile,signals) {
  const p=profile.primary;
  if(!p)return "Your answers contain several useful routes, but they do not yet converge enough to support one dominant psychological configuration. The most honest result is an open map that can become clearer with more lived observations.";
  if(p.id==="deliberative-explorer")return "You seem strongly pulled toward understanding and exploration, while unresolved outcomes keep asking for structure; that can make complexity engaging and leaving uncertainty alone unusually difficult.";
  if(p.id==="socially-cautious-connector")return "Connection appears meaningful, but social entry depends on the opening conditions; you may become more available once familiarity, purpose or safety reduces the first barrier.";
  if(p.id==="autonomous-stabiliser")return "You seem to want self-direction that rests on reliable conditions, so freedom may work best when the destination, resources or boundaries are steady enough to support it.";
  if(p.id==="adaptive-initiator")return "Movement and new information may help you begin, while changing course can be easier than sustaining a route after novelty fades; your useful challenge may be designing a middle that remains alive.";
  if(p.id==="relationally-vigilant-connector")return "Closeness appears important and ambiguous connection may receive extra attention, so repair and direct reassurance may be both a resource and a place where the system can work hard.";
  if(p.id==="structured-creator")return "Ideas seem most usable when they have form: imagination pulls possibilities forward while standards and order help turn them into something finished enough to share.";
  if(p.id==="independent-collaborator")return "You may want meaningful contact without surrendering control of your contribution, making shared work most workable when responsibility and room to act are both explicit.";
  if(p.id==="persistent-mastery-seeker")return "Improvement and craft can keep effort alive after the first spark, especially when progress is visible; repetition becomes easier to sustain when it still serves a meaningful standard.";
  if(p.id==="signal-sensitive-regulator")return "Your system may notice fine-grained input while also needing to manage density and body load, so regulation is likely to depend on what reaches you as much as on what you think about it.";
  return "Your current profile is organised by the interaction of several tendencies; the useful question is which conditions let that configuration help rather than asking it to solve every situation in the same way.";
}
function profileReadFor(profile,signals) {
  const map=signalMap(signals),p=profile.primary,one=profileOneSentence(profile,signals),mechanisms=[];
  if(p){
    const core=p.core.map(x=>map[x[0]]).filter(usableSignal).slice(0,3);
    if(core.length>=2){
      mechanisms.push({title:"What activates the system",text:"Because "+core[0].dimension.title.toLowerCase()+" and "+core[1].dimension.title.toLowerCase()+" both appear in the supported part of your map, situations involving "+core[0].dimension.contexts.toLowerCase()+" may draw attention toward "+core[0].dimension.fn.toLowerCase()+". The second process changes what happens next: it can turn a simple preference into a route, a check, a boundary or a need for more orientation."});
      mechanisms.push({title:"What the response is doing",text:"One way these answers fit together is that the response is functional before it is problematic. "+signalDirectionText(core[0])+" may help you notice what matters, while "+signalDirectionText(core[1])+" may help you protect against an outcome that feels too open, costly or hard to reverse. The same response can support judgement in one condition and keep the system active after the useful information is already available in another."});
      mechanisms.push({title:"Where the job changes",text:"The key distinction is whether the next thought or action changes the situation. If it produces new evidence, a clearer boundary, a smaller step or a better repair, it is still doing useful work. If it only tries to remove the last feeling of uncertainty without changing the options, the same mechanism may have become an expensive loop."});
    }
  }
  mechanisms.push({title:"Motives and current conditions",text:motiveEnactmentText()+" "+needsParadoxText()});
  mechanisms.push({title:"Self-evaluation and adaptations",text:selfWorthContingencyText()+" "+adaptationCostText(signals)});
  const advantages=[],frictions=[];
  const coreSignals=p?p.core.map(x=>map[x[0]]).filter(usableSignal):strongestDirections(signals,3);
  coreSignals.slice(0,3).forEach(s=>{advantages.push(s.dimension.title+": "+s.dimension.fn);frictions.push(s.dimension.title+": "+s.dimension.friction);});
  if(!advantages.length)advantages.push("Several direct preferences and scenario choices remain useful, but no multi-variable advantage is strong enough to headline yet.");
  if(!frictions.length)frictions.push("No single friction pattern is supported strongly enough to turn into a claim; the detailed cards keep the possibilities open.");
  const contradictions=[];
  const social=map.sociability,bold=map["social-boldness"],intimacy=map["rel-intimacy"],autonomy=map["rel-autonomy"],stimulation=map.stimulation,persistence=map.persistence,standards=map["personal-standards"],evalp=map["evaluative-perfectionism"];
  if(usableSignal(social)&&usableSignal(bold)&&social.direction!==bold.direction)contradictions.push("Social desire and social entry are different systems here: wanting contact does not establish that approaching an unfamiliar group will feel easy.");
  if(usableSignal(intimacy)&&usableSignal(autonomy)&&intimacy.direction==="more"&&autonomy.direction==="more")contradictions.push("Deep connection and protected independent space can both be genuine needs; the tension is an interaction design problem, not evidence that one answer is false.");
  if(usableSignal(stimulation)&&usableSignal(persistence)&&stimulation.direction!==persistence.direction)contradictions.push("Novelty can make a beginning attractive while repetition still requires a different support; interest and sustainment are separate demands.");
  if(usableSignal(standards)&&usableSignal(evalp)&&standards.direction==="more"&&evalp.direction==="less")contradictions.push("High standards may be about the work itself rather than fear of judgement; quality pressure and evaluation pressure are not the same mechanism.");
  if(!contradictions.length)contradictions.push("No constructive tension cleared the evidence gate. Mixed answers may reflect context or measurement uncertainty rather than a hidden contradiction.");
  const changes=[regulationPatternText(),conflictPatternText()];
  const work=selectedWorkTitles();
  const intimacyBand=stateBand(intimacy),autonomyBand=stateBand(autonomy);
  const relationship=intimacyBand==="unknown"&&autonomyBand==="unknown"?"Relationship preferences remain open; use the separate closeness, space, communication and repair cards rather than an ideal-partner label.":"Your relationship architecture currently points toward "+(intimacyBand==="higher"&&autonomyBand==="higher"?"meaningful closeness with protected space":intimacyBand==="higher"?"connection-forward coordination":autonomyBand==="higher"?"independence-forward coordination":"a context-dependent balance")+". Direct communication about timing, boundaries and repair is more useful than inferring compatibility from a type.";
  const realLife=[
    {title:"Work",text:work.length?"A workday worth testing may include "+work.join(", ")+". The strongest combination is not an occupation prediction; it is a condition set to try in a low-cost project.":"The work section does not yet support a specific architecture, so investigate conditions rather than career names."},
    {title:"Relationships",text:relationship},
    {title:"Learning and decisions",text:"Your learning, decision and change answers are best used to match support to the bottleneck: define the target, choose the first step, then distinguish returning after interruption from continuing through repetition."},
    {title:"Under pressure",text:"When demand, ambiguity, sensory load or fatigue rises, check the body and environment before treating the first interpretation as the whole explanation. Context can change the apparent trait."}
  ];
  const rules=[];
  if(hasPattern(signals,"uncertainty-intolerance","more")&&(hasPattern(signals,"decision-deliberation","more")||hasPattern(signals,"decision-reopening","more")))rules.push("Before researching further, write down what new information would actually change the choice.");
  if(selectedWork().some(w=>w.id==="work-autonomy"&&w.value>=3)&&selectedWork().some(w=>w.id==="work-predictability"&&w.value>=3))rules.push("Create freedom inside structure: agree the outcome and review point, then choose your own route.");
  if(hasPattern(signals,"sensory-overload","more")||hasPattern(signals,"interoception","more"))rules.push("Check sound, light, hunger, fatigue and pain before turning irritation into a story about the entire problem.");
  if(hasPattern(signals,"personal-standards","more")||hasPattern(signals,"thoroughness","more"))rules.push("Define ‘finished enough’ before starting so care improves the work rather than moving the finish line.");
  if(hasPattern(signals,"rel-intimacy","more")&&hasPattern(signals,"rel-reassurance","more"))rules.push("Ask once for the specific clarity you need, then agree what repair or follow-through would look like.");
  if(!rules.length)rules.push("Track one repeated situation across two contexts before deciding what the pattern means.","Separate what the feeling is asking you to notice from what it is asking you to do.","Use the smallest next experiment that could update the map.");
  const unknowns=[];
  if(profile.confidence.level!=="strong")unknowns.push("The broad configuration is useful but not settled; additional lived examples may change the title.");
  if(!usableSignal(map["attachment-anxiety"])||!usableSignal(map["attachment-avoidance"]))unknowns.push("We have stronger evidence about relationship preferences than about what happens when closeness feels threatened.");
  if(!answers["state-context"])unknowns.push("The test has no current state context to show how energy, fatigue or sensory load may be changing the response today.");
  unknowns.push("The present questionnaire cannot tell whether a pattern is caused by history, health, culture, access or material conditions.");
  const prediction=["Some opportunities may feel more uncomfortable before you begin than once you have enough orientation to enter them.","A clear stopping criterion may improve decisions more than another round of information gathering.","The same preference may look different when energy, sensory density, safety or relationship ambiguity changes."];
  const quick=[
    {label:"What pulls you",text:p?p.tag:"Your map stays open while separate motives, preferences and scenarios remain useful."},
    {label:"What protects you",text:coreSignals[1]?signalDirectionText(coreSignals[1]):"Structure, support and context are still being clarified."},
    {label:"What changes you",text:changes[0]},
    {label:"How you connect",text:relationship},
    {label:"Where to begin",text:rules[0]}
  ];
  return {one,quick,mechanisms,advantages,frictions,contradictions,changes,realLife,rules,prediction,unknowns};
}
function renderProfileRead(profile,signals) {
  const r=profileReadFor(profile,signals);
  const cards=(items,kind)=>items.map((x,i)=>{const item=typeof x==="string"?{title:kind+" "+(i+1),text:x}:x;return "<article class='pf-mechanism-card'><span class='pf-label'>"+esc(item.title)+"</span><p>"+esc(item.text)+"</p></article>";}).join("");
  return "<section class='pf-report-section pf-full-read' id='pf-full-read'><p class='eyebrow'>The full read · evidence-gated formulation</p><h2>How your psychological system may work</h2><div class='pf-profile-one-line'><span class='pf-label'>Your profile in one sentence</span><p>"+esc(r.one)+"</p></div><h3 class='pf-subhead'>How your system seems to work</h3><div class='pf-mechanism-stack'>"+cards(r.mechanisms,"Mechanism")+"</div><h3 class='pf-subhead'>Where this configuration can work in your favour</h3><div class='pf-mechanism-grid'>"+cards(r.advantages,"Functional advantage")+"</div><h3 class='pf-subhead'>Where the same system can create friction</h3><div class='pf-mechanism-grid'>"+cards(r.frictions,"Possible friction")+"</div><h3 class='pf-subhead'>Contradictions that make sense once separated</h3><div class='pf-mechanism-grid'>"+cards(r.contradictions,"Constructive tension")+"</div><h3 class='pf-subhead'>What changes the pattern</h3><div class='pf-mechanism-grid'>"+cards(r.changes,"Context modifier")+"</div><h3 class='pf-subhead'>What this means in real life</h3><div class='pf-mechanism-grid'>"+cards(r.realLife,"Domain")+"</div><h3 class='pf-subhead'>What to actually do</h3><ol class='pf-profile-rules'>"+r.rules.slice(0,5).map(x=>"<li>"+esc(x)+"</li>").join("")+"</ol><h3 class='pf-subhead'>Three predictions to test</h3><div class='pf-mechanism-grid'>"+cards(r.prediction,"Prediction")+"</div><h3 class='pf-subhead'>What we are still unsure about</h3><div class='pf-unknown-list'>"+r.unknowns.map(x=>"<p>"+esc(x)+"</p>").join("")+"</div><div class='pf-story-cautions'><b>Evidence key:</b> "+badge("measured",true)+" "+badge("direct",true)+" "+badge("scenario",true)+" "+badge("derived",true)+" "+badge("hypothesis",true)+" "+badge("insufficient",true)+"</div></section>";
}

function oneMinuteSynthesis(signals) {
  const m=signalMap(signals),dirs=strongestDirections(signals,8);
  const driver=motifValues().filter(x=>typeof x.strength==="number").sort((a,b)=>b.strength-a.strength)[0];
  const curiosity=m["intellectual-curiosity"],uncertainty=m["uncertainty-intolerance"]||m["conflict-anxiety"],steer=m["effortful-control"]||m["decision-deliberation"],social=m.sociability||m["rel-intimacy"],tension=hypothesisList(signals)[0];
  const line=(label,text)=>"<article><span class='pf-label'>"+esc(label)+"</span><p>"+esc(text)+"</p></article>";
  const pull=driver?"Your strongest explicit pull in this session was "+driver.title.toLowerCase()+" ("+I5label(driver.strength).toLowerCase()+").":curiosity&&curiosity.direction==="more"?"Questions and understanding appear to pull your attention forward.":"Your forward pull is distributed across several motives and preferences rather than one clear driver.";
  const guard=uncertainty&&uncertainty.direction?"Uncertainty and unresolved outcomes appear to be a meaningful guardrail: "+(uncertainty.direction==="more"?uncertainty.dimension.more:uncertainty.dimension.less):"No single caution signal was strong enough to headline; context may matter more than a stable guard.";
  const steerText=steer&&steer.direction?"You tend to steer through "+(steer.direction==="more"?steer.dimension.more.toLowerCase():steer.dimension.less.toLowerCase()):"Your steering style is still open; direct choices and scenario responses add useful detail.";
  const connect=social&&social.direction?"Connection is best understood separately from ease: "+social.dimension.title.toLowerCase()+" "+patternLabel(social).toLowerCase()+".":"Your relationship map is best read through the separate closeness, space, reassurance and repair answers.";
  const friction=tension?"A likely tension to test is "+tension.title.toLowerCase()+".":dirs.length?"Your main friction may appear when "+dirs[0].dimension.friction.toLowerCase():"No single friction pattern is sufficiently supported yet.";
  return {cards:[line("What pulls you forward?",pull),line("What makes you cautious?",guard),line("How do you steer yourself?",steerText),line("How do you connect?",connect),line("Where does tension arise?",friction)],question:tension?"Your growth question: "+tension.experiment.split(";")[0]+".":"Your growth question: which conditions help your strongest patterns stay useful?"};
}

function narrative(signals) {
  const map=signalMap(signals);
  const directional=usefulDirections(signals);
  const mixed=signals.filter(s=>s.pattern==="mixed");
  const paragraphs=[];
  paragraphs.push("This profile is a set of separate routes through your answers, rather than one score that explains everything. A tendency, a relationship preference, a motive, a need, a work condition and a feeling today answer different questions. The story-title above is only a memory hook; the more useful portrait is the pattern of evidence and the places where it changes.");
  if(directional.length) {
    paragraphs.push("Across the repeated-item candidate scales, "+directional.length+" had at least two answered items that leaned consistently toward one side. That means the responses agreed with one another within each small scale; it does not mean the pattern is unusually strong compared with other people. The report presents the patterns in their separate sections and does not sort them into a single rank.");
    const leadThreads=directional.slice(0,6).map(s=>s.dimension.title.toLowerCase()+" "+(s.direction==="more"?"leaning higher":"leaning lower")+" ("+patternLabel(s).toLowerCase()+")");
    paragraphs.push("The clearest directional threads in this session are "+leadThreads.join(", ")+". They are clues about how you answered these items, not a ranking against other people. The detailed map below gives each one its definition, possible function, analogy, context cues, needs and friction once—so the narrative can focus on how routes combine rather than repeating every scale card.");
  } else {
    paragraphs.push("There are not enough repeated-item scales with consistent answers to describe directional tendencies. That is a valid result, not a failed one. You can still read the preferences, scenario choices, motives, needs, values and identity themes you selected directly; skipped or mixed answers are not filled in with guesses.");
  }
  if(mixed.length) paragraphs.push("Some candidate scales were mixed or context-dependent, including "+mixed.slice(0,6).map(s=>s.dimension.title.toLowerCase()).join(", ")+". A mixed result may mean your response changes by situation, that two items landed differently, or that the questions need revision. It should not be translated into a hidden trait or treated as inconsistency you need to explain away.");
  const watch=directional.filter(s=>s.direction==="more"&&/sensitiv|overload|stress|anxious|urgency|interocept|rejection|evaluation|threat|fatigue/i.test(s.dimension.id+" "+s.dimension.kind)).slice(0,4);
  if(watch.length) {
    const watchContexts=watch.map(s=>s.dimension.title.toLowerCase()+" around "+s.dimension.contexts.toLowerCase()).join("; ");
    const watchCues=watch.map(s=>s.dimension.cues.toLowerCase()).join("; ");
    paragraphs.push("Possible context watchpoints—not confirmed personal triggers—include "+watchContexts+". The early signs described in your answers may include "+watchCues+". Notice what actually happened immediately before a strong response, what your body needed, what choices were available and what changed afterward. A repeated, context-specific record would be needed before calling any of these a trigger for you.");
  }
  else paragraphs.push("This assessment does not identify personal triggers. It gives you situations and early cues to watch in the detailed cards; only repeated observations in your own life can show whether a context reliably precedes a reaction.");

  const relationshipIds=["rel-intimacy","rel-autonomy","rel-reassurance","rel-caregiving","rel-jealousy","rel-repair","attachment-anxiety","attachment-avoidance","sociability","social-boldness"];
  const relationshipReads=relationshipIds.map(id=>map[id]).filter(s=>s&&s.pattern!=="unknown");
  if(relationshipReads.length) paragraphs.push("The relationship map keeps several things separate: how much closeness you want, how much space matters, how you respond to ambiguity, what repair looks like and whether approaching people feels easy. Your available answers show: "+relationshipReads.slice(0,6).map(s=>s.dimension.title.toLowerCase()+" — "+patternLabel(s).toLowerCase()).join("; ")+". Attachment-related items are self-reports about possible responses to closeness and uncertainty; they do not identify a diagnosis, explain your history or establish that a relationship is safe. The partner section turns some preferences into things to discuss openly, not a formula for an ideal person.");
  const scenario=SCENARIOS.map(s=>({step:s,answer:answers[s.id]})).filter(x=>x.answer&&x.answer!==null&&x.answer.first!=="").slice(0,2);
  if(scenario.length) paragraphs.push("In the hypothetical conflict situations you answered, your first choices included "+scenario.map(x=>x.step.title.toLowerCase()+": “"+x.step.choices[Number(x.answer.first)]+"”").join("; ")+". These are imagined first moves, not evidence of what you have done under pressure. Your second-choice responses are recorded separately in the conflict section, where they can show how a response might unfold after the first moment.");

  const motiveRatings=motifValues().filter(m=>typeof m.strength==="number").sort((a,b)=>b.strength-a.strength).slice(0,3);
  const motiveFrequencies=motifValues().filter(m=>typeof m.frequency==="number").sort((a,b)=>b.frequency-a.frequency).slice(0,3);
  if(motiveRatings.length) paragraphs.push("Motives describe what can pull you toward effort. The strongest ratings you gave in this session were for "+motiveRatings.map(m=>m.title.toLowerCase()+" ("+I5label(m.strength).toLowerCase()+")").join(", ")+". The compact route then sampled how often the strongest few motives actually influence a choice; those follow-ups were "+(motiveFrequencies.length?motiveFrequencies.map(m=>m.title.toLowerCase()+" ("+F5label(m.frequency).toLowerCase()+")").join(", "):"not answered")+". A motive can be strong while opportunity, support, time or material resources remain limited.");
  const needSummary=NEEDS.map(n=>{
    const id=n[0];
    const satisfaction=[answers["need-"+id+"-satisfaction"]].filter(v=>typeof v==="number");
    const frustration=[answers["need-"+id+"-frustration"]].filter(v=>typeof v==="number");
    return {name:n[1],satisfaction,frustration};
  });
  const satNeeds=needSummary.filter(n=>n.satisfaction.some(v=>v>=3)).map(n=>n.name.toLowerCase());
  const fruNeeds=needSummary.filter(n=>n.frustration.some(v=>v>=3)).map(n=>n.name.toLowerCase());
  if(needSummary.some(n=>n.satisfaction.length||n.frustration.length)) paragraphs.push("Your needs questions describe the current situation, not a permanent feature of you. You marked at least one satisfaction statement “Very true” or “Completely true” for "+(satNeeds.join(", ")||"no need area in the upper two response options")+"; active-frustration statements reached those same response options for "+(fruNeeds.join(", ")||"no need area in the upper two response options")+". Satisfaction and frustration are kept separate because a need can be partly supported and partly blocked at the same time.");
  const valueCounts=getValueCounts();
  const most=Math.max(0,...VALUE_CARDS.map(v=>valueCounts[v[0]].most));
  const topValues=VALUE_CARDS.filter(v=>most>0&&valueCounts[v[0]].most===most);
  if(topValues.length) paragraphs.push("When values competed in the particular sets shown to you, "+topValues.map(v=>v[1].toLowerCase()).join(" and ")+" were the values you selected most often as the most important in a round. The graph reports these raw choices, including what you were more willing to set aside; it is not a scored hierarchy or a complete ranking of your moral life. A real conflict between values can make two good options feel costly without either value being false.");

  const work=selectedWork().filter(w=>w.value>=3).slice(0,4);
  const workTop=Array.isArray(answers["work-top-five"])?answers["work-top-five"].map(i=>WORK_PREFERENCES[Number(i)]).filter(Boolean):[];
  if(work.length||workTop.length) paragraphs.push("For work and hobbies, your direct preferences point toward trying environments with "+[...new Set([...work.map(w=>w.title.toLowerCase()),...workTop.map(w=>w.title.toLowerCase())])].slice(0,7).join(", ")+". The career and activity list below uses these preferences as a starting filter, then offers specific low-commitment directions to investigate. It does not test ability, qualifications, job access, vocational interest, likely earnings or whether a career will suit you. Treat each suggestion as a sample to try, not a destiny.");
  const learning=LEARNING_PREFERENCES.map(p=>({step:p,value:answers[p.id]})).filter(x=>typeof x.value==="number");
  const moneyAnswers=[...MONEY_RISK_SCENARIOS,...MONEY_DELAY_SCENARIOS].filter(s=>answers[s.id]!==undefined&&answers[s.id]!==null);
  if(moneyAnswers.length||learning.length) {
    const money=moneyAnswers.slice(0,4).map(s=>{
      const v=answers[s.id];
      return s.type==="B7"?(typeof v==="number"?(v<0?s.left:v>0?s.right:"a context-dependent balance"):"a repeated money choice"):(s.options?.[Number(v)]||"a context-dependent choice");
    });
    const learn=learning.slice(0,3).map(x=>x.step.title.toLowerCase()+": "+(x.value<0?x.step.left:x.value>0?x.step.right:"a context-dependent balance"));
    paragraphs.push("Money and learning are treated as everyday preferences, not as ability or financial advice."+(money.length?" In the money scenarios you leaned toward "+money.join(" and ")+"; actual need and resources can change what makes sense.":"")+(learn.length?" Your learning choices included "+learn.join("; ")+". These are methods to experiment with, not fixed learning styles or proof that a method works best for you.":""));
  }
  const story=answers["identity-story"];
  const storyOptions=SPECIAL_STEPS.find(s=>s.id==="identity-story").options;
  const storyThemes=Array.isArray(story)?story.map(i=>storyOptions[Number(i)]).filter(Boolean):[];
  const setback=answers["identity-setback"];
  if(storyThemes.length||typeof setback==="string") paragraphs.push("Your identity section records the story themes you chose and how you currently interpret setbacks: "+(storyThemes.length?storyThemes.map(x=>"“"+x+"”").join(", "):"no life-story theme selected")+(typeof setback==="string"?"; for setbacks, you selected “"+SPECIAL_STEPS.find(s=>s.id==="identity-setback").options[Number(setback)]+"”.":".")+" This is a description of your present interpretation, not proof that the past had one meaning or that you must keep the same story.");
  const regulation=signals.filter(s=>s.dimension.group==="regulation"&&s.pattern!=="unknown").slice(0,4);
  if(regulation.length) paragraphs.push("Your emotion-regulation answers include "+regulation.map(s=>s.dimension.title.toLowerCase()+" ("+patternLabel(s).toLowerCase()+")").join(", ")+". These responses describe strategies or sensitivities that may come forward under pressure; they do not show what caused them or whether they are helpful in every setting. A useful distinction is whether the situation can change, what value matters, what your body needs and which strategy leaves you with a workable next step.");
  const state=answers["state-context"];
  if(state&&state.states) {
    const stateNames=Object.fromEntries(SPECIAL_STEPS.find(s=>s.id==="state-context").rows.map(r=>[r[0],r[1].replace(/\?$/," ").trim()]));
    const moment=Object.entries(state.states).filter(x=>typeof x[1]==="number").map(([k,v])=>stateNames[k]+": "+stateLabel(v));
    const contexts=Object.entries(state.contexts||{}).filter(x=>x[1]);
    paragraphs.push("The final state snapshot belongs to this moment; it is not folded into your trait descriptions. You recorded "+(moment.slice(0,6).join(", ")||"no state ratings")+(contexts.length?" in a context described as "+contexts.map(x=>x[1]).join(", "):"")+". Hunger, fatigue, pain, sensory load, sleep, safety and demand can change how a questionnaire feels to answer. One snapshot cannot establish a state pattern; optional check-ins are stored only on this device and can help you compare your own contexts over time.");
  }
  const hypotheses=hypothesisList(signals).slice(0,2);
  if(hypotheses.length) paragraphs.push("Two possible combinations to investigate are "+hypotheses.map(h=>h.title.toLowerCase()).join(" and ")+". They are hypotheses assembled from candidate-item responses, not validated interactions. The small experiments in those cards are designed to help you notice whether the pattern fits, where it appears and what support changes it.");
  paragraphs.push("The most responsible way to use this portrait is as a set of working predictions: keep what matches your lived experience, revise what does not, and seek more context before making a high-stakes decision about work, money or a relationship. Nothing here identifies your diagnosis, neurotype, capacity, cause, future or compatibility with another person. Your answers describe what you reported in this session; they do not define who you are.");
  return paragraphs;
}

function hypothesisList(signals) {
  const hypotheses=[];
  const add=(ids,title,evidence,interpretation,setting,experiment)=>{
    const needed=ids.map(id=>signalMap(signals)[id]);
    if(needed.some(s=>!s||s.pattern==="unknown"||s.pattern==="single")) return;
    hypotheses.push({title,evidence,interpretation,setting,experiment});
  };
  add(["stimulation","uncertainty-intolerance"],"Novelty and certainty may pull together","The answers lean toward both stimulation seeking and difficulty leaving outcomes unresolved.","A new option may feel genuinely attractive while its unknown parts also occupy attention.","Notice whether uncertainty feels different before and after taking a small first step.","Try one low-stakes novelty choice with a clear stop point; record what felt energising and what felt uncertain.");
  add(["sociability","social-boldness"],"Social interest and social ease may differ","Your repeated-item responses separate wanting social contact from approaching unfamiliar people.","You may enjoy connection more once a conversation has a clear opening or familiar person.","Compare the moment before entering a group with the experience once you are there.","Try one lower-pressure opening and notice whether the barrier is desire, confidence, energy or the setting.");
  add(["rel-intimacy","rel-autonomy"],"Closeness and independence may both matter","The relationship module asks about emotional closeness and separate space as distinct preferences.","You may want intimacy without constant access, or closeness may feel easier when space is respected.","Notice whether time apart restores connection or feels like distance that needs explanation.","Discuss what togetherness and independent time look like in concrete weekly routines.");
  add(["persistence","stimulation"],"Interest and repetition may pull in different directions","Your answers distinguish attraction to novelty from continuing when a task becomes repetitive.","An engaging start may be easy to find while the middle requires renewed purpose or structure.","Watch for the point where the task stops offering new feedback.","Break one ongoing task into visible milestones and test whether a reason to continue changes effort.");
  add(["personal-standards","evaluative-perfectionism"],"Craft and evaluation may not be the same pressure","These scales separately ask about demanding standards and fear of others’ judgement.","High standards can come from caring about the work; evaluation concern can add a second source of pressure.","Notice whether the task matters because of quality, because of how it will be judged, or both.","For one task, define a good-enough finish before starting and compare the experience.");
  add(["sensory-orienting","sensory-overload"],"Noticing more signals can coexist with sensory load","The questions separate noticing sensory detail from feeling drained by competing input.","You may be alert to small changes and still prefer control over volume or density.","Compare sound, light, motion and fatigue separately instead of treating all stimulation as one thing.","Change one environmental feature at a time and note which actually changes comfort or focus.");
  add(["decision-deliberation","decision-reopening"],"Careful thought may continue after the decision","These responses separately ask how much information you gather and whether you revisit a choice afterwards.","Research can help before a choice; replaying it afterwards may or may not add useful information.","Notice whether revisiting produces new evidence or only repeats the same alternatives.","Set an information threshold and a planned review point for a reversible decision.");
  add(["effortful-control","sustainment"],"Starting, steering and continuing are different demands","The profile keeps redirecting attention, beginning and sustaining separate.","A person may manage one of these more readily than the others, especially when interest or fatigue changes.","Compare task initiation, returning after interruption and continuing through repetition.","Add a cue to the specific step that costs most rather than applying one willpower rule to all three.");
  add(["compassion","communion","tact"],"Care and directness can coexist","Compassion, communion and tact ask about concern for people, closeness and the cushioning of delivery separately.","You may care deeply while still preferring a clear message; other people could misread delivery as motive.","Ask a trusted person whether your intention and impact usually match in difficult conversations.","Before a direct message, name the care or respect underneath it and ask whether the other person wants context or a short request.");
  add(["rel-intimacy","rel-reassurance","rel-repair"],"Relationship investment may form a repair loop","Closeness, reassurance and repair responses can point toward strong investment in keeping important bonds workable.","Ambiguity may pull attention toward confirmation, while repair orientation may bring you back to the relationship after a pause.","Notice whether direct reassurance settles the concern or only briefly lowers it before the same question returns.","Ask once for the specific information you need, then agree on a repair or check-in plan instead of repeating the same question.");
  add(["support-seeking","emotional-disclosure","rel-reassurance"],"General help-seeking and relationship reassurance may differ","The profile separates broad support seeking, vulnerable disclosure and relationship-specific reassurance.","You may process difficulty privately in general but become much more willing to disclose and ask for confirmation when a close bond feels uncertain.","Compare a practical problem with an ambiguous message from someone important.","Name the kind of support you want—listening, practical help or direct reassurance—before asking for it.");
  add(["intellectual-curiosity","imagination","aesthetic-sensitivity","orderliness","thoroughness"],"Structured imagination","Questions, possibilities, form and detail can converge into creative work that wants both freedom and refinement.","You may prefer creative problems with a solvable structure rather than unlimited idea generation alone.","Notice whether a clear brief helps your creativity rather than constraining it.","Choose one creative project with an open idea phase and a defined refinement checklist.");
  add(["identity-exploration","identity-commitment"],"Commitment can include revision","Exploration and commitment are measured as different identity processes.","You may commit to values or relationships while remaining willing to update the route or the language you use for yourself.","Look for one domain where you feel settled and another where you are experimenting.","Write a provisional commitment with a review date rather than demanding a permanent identity statement.");
  add(["money-security","money-scarcity","money-impulsivity"],"Security motives and short-term wants may pull in different directions","Long-term security, scarcity vigilance and immediate spending are separate responses.","Financial security can matter deeply while a strong want sometimes moves faster than the longer-term plan.","Notice whether impulsive spending rises with fatigue, scarcity fear, celebration or emotional relief.","Create a small guilt-free spending boundary and a separate review for purchases that affect future security.");
  add(["decision-deliberation","decision-intuition","decision-regret","decision-reopening"],"You may use both analysis and intuition","The decision scales separate information gathering, first impressions, anticipated regret and post-decision review.","The distinctive feature may not be analytical versus intuitive; it may be how long evaluation continues after commitment.","Compare what happens before a decision with what happens after it is made.","Record the information threshold before choosing and a single planned review point afterwards.");
  return hypotheses;
}

function signalDescription(signal) {
  if(!signal||signal.pattern==="unknown") return "Not enough answers were given to describe this pattern.";
  if(signal.pattern==="single") return "One response was recorded. It is shown as a direct answer, not a scale estimate.";
  if(signal.pattern==="more") return "Your answered candidate items point toward the higher end. "+signal.dimension.more;
  if(signal.pattern==="less") return "Your answered candidate items point toward the lower end. "+signal.dimension.less;
  if(signal.pattern==="lean-more") return "Your average response leans higher without being unanimous. "+signal.dimension.more+" The disagreement is useful context rather than noise.";
  if(signal.pattern==="lean-less") return "Your average response leans lower without being unanimous. "+signal.dimension.less+" The disagreement is useful context rather than noise.";
  return "Your answers were mixed, included the “mixed / depends” option, or did not point consistently in one direction. Context may matter, or these candidate items may need refinement.";
}
function patternLabel(signal) {
  if(!signal||signal.pattern==="unknown") return "Not enough responses";
  if(signal.pattern==="single") return "One response · descriptive only";
  if(signal.pattern==="more") return "Items leaned higher · consistent";
  if(signal.pattern==="less") return "Items leaned lower · consistent";
  if(signal.pattern==="lean-more") return "Leaning higher · some variation";
  if(signal.pattern==="lean-less") return "Leaning lower · some variation";
  return "Mixed / context-dependent";
}
function evidenceForSignal(signal) {
  if(!signal||signal.pattern==="unknown")return "insufficient";
  if(signal.dimension.group==="snapshot")return "state";
  if(signal.dimension.kind==="Preference"||signal.dimension.kind==="Direct preference")return "direct";
  if(signal.evidenceClass==="direct")return "direct";
  return signal.evidenceClass==="supported"?"measured":signal.evidenceClass==="preliminary"?"preliminary":"insufficient";
}
function badge(kind,compact=false) {
  const meta=EVIDENCE_META[kind]||EVIDENCE_META.measured;
  return "<span class='pf-evidence-badge pf-evidence-"+esc(kind)+"' title='"+esc(meta.tip)+"'><span aria-hidden='true'>"+meta.symbol+"</span> "+esc(compact?meta.label.split(" · ")[0]:meta.label)+"</span>";
}
function relatedTitles(id) {
  const ids=CONSTRUCT_FAMILIES[id]||[];
  return ids.filter(x=>x!==id).slice(0,4).map(x=>ALL_DIMENSIONS.find(d=>d.id===x)?.title||x).filter(Boolean);
}
function traitCard(signal) {
  const d=signal.dimension;
  const mapText=signalDescription(signal);
  const kind=evidenceForSignal(signal);
  const meanText=typeof signal.mean==="number"?" · mean "+signal.mean.toFixed(2)+"/6":"";
  const related=relatedTitles(d.id);
  const guide=DIRECTION_GUIDE[d.id];
  return "<details class='pf-trait-card'><summary><span><b>"+esc(d.title)+"</b><small>"+esc(d.kind)+" · "+esc(patternLabel(signal))+"</small></span><span class='pf-chevron' aria-hidden='true'>＋</span></summary><div class='pf-trait-body'>"+
    badge(kind)+
    "<p><b>What it covers</b>"+esc(d.definition)+"</p>"+
    "<p><b>What it can do</b>"+esc(d.fn)+"</p>"+
    "<p><b>Picture it</b>"+esc(d.analogy)+"</p>"+
    "<p><b>Where it may show up</b>"+esc(d.contexts)+"</p>"+
    "<p><b>Everyday cues to notice</b>"+esc(d.cues)+"</p>"+
    "<p><b>Your response pattern</b>"+esc(mapText)+(guide&&signal.direction?" <span class='pf-direction-note'>Higher here means "+esc(signal.direction==="more"?guide.high:guide.low)+".</span>":"")+"</p>"+
    "<p><b>What it does not establish</b>It does not establish a diagnosis, cause, ability, intention or a pattern outside the situations you answered.</p>"+
    "<p><b>When it may help</b>"+esc(d.more)+"</p>"+
    "<p><b>Possible friction</b>"+esc(d.friction)+"</p>"+
    "<p><b>A need to consider</b>"+esc(d.needs)+"</p>"+
    (related.length?"<p><b>Connected constructs</b>"+esc(related.join(", "))+". These labels are kept separate for exploration; they may overlap and should not be treated as independent diagnoses.</p>":"")+ 
    "<p class='pf-provenance'><b>Evidence:</b> "+signal.count+" of "+signal.total+" candidate items answered"+meanText+" · "+esc(signal.confidence)+" · descriptive self-report only.</p></div></details>";
}

function renderTraitGroups(signals) {
  const groups=[
    ["temperament","Temperamental mechanisms"],
    ["dispositions","Dispositional personality facets"],
    ["relationships","Interpersonal, attachment and relationship patterns"],
    ["regulation","Regulation and characteristic adaptations"],
    ["identity","Identity and self-understanding"],
    ["domains","Money and learning patterns"],
    ["decisions","Decision and change patterns"]
  ];
  return groups.map(g=>{
    const cards=signals.filter(s=>s.dimension.group===g[0]);
    if(!cards.length)return "";
    return "<section class='pf-trait-group'><h3>"+esc(g[1])+"</h3><div class='pf-trait-list'>"+cards.map(traitCard).join("")+"</div></section>";
  }).join("");
}

function renderValueGraph() {
  const counts=getValueCounts();
  const max=Math.max(1,...Object.values(counts).map(x=>Math.max(x.most,x.least)));
  const rows=VALUE_CARDS.map(card=>{
    const c=counts[card[0]];
    return "<div class='pf-value-result'><div><b>"+esc(card[1])+"</b><span>Most "+c.most+" · Least "+c.least+"</span></div><div class='pf-value-bars' aria-label='Selected most important "+c.most+" times, least central "+c.least+" times'><span class='most' style='width:"+(100*c.most/max)+"%'></span><span class='least' style='width:"+(100*c.least/max)+"%'></span></div></div>";
  }).join("");
  const strongest=VALUE_CARDS.map(v=>({card:v,count:counts[v[0]].most,least:counts[v[0]].least})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count||a.least-b.least);
  const hierarchy=strongest.slice(0,7).map((x,i)=>"<li><span>"+(i+1)+"</span><b>"+esc(x.card[1])+"</b><i style='width:"+(100*x.count/max)+"%'></i><small>Most "+x.count+" · Least "+x.least+"</small></li>").join("");
  return "<div class='pf-values-explainer'><p>Each of the "+(valueRounds.length||COMPACT_VALUE_ROUNDS)+" rounds asked you to choose one value as most important and one as least central within a small set. The graph shows repeated raw choices. The provisional hierarchy below is a within-session picture, not a latent score, population rank or claim about your moral worth.</p><div class='pf-value-legend'><span><i class='most'></i> Chosen most</span><span><i class='least'></i> Chosen least</span></div></div><div class='pf-value-hierarchy'><h3>Provisional value hierarchy</h3>"+(hierarchy?"<ol>"+hierarchy+"</ol>":"<p>No value rounds were completed.</p>")+"</div><div class='pf-value-results'>"+rows+"</div><p class='pf-small-note'>A value selected less often is not unimportant; a different competitor, context or real-life constraint can change the choice. A balanced best–worst design gives each value repeated comparisons, but formal Bradley–Terry/Thurstonian calibration still requires validation data.</p>";
}
function renderMotives() {
  const values=motifValues();
  return "<div class='pf-motive-grid'>"+values.map(m=>{
    const freq=typeof m.frequency==="number"?F5label(m.frequency):"Not answered";
    const strength=typeof m.strength==="number"?I5label(m.strength):"Not answered";
    return "<article><h3>"+esc(m.title)+"</h3><p>"+esc(m.description)+"</p><div><span>Motivating: <b>"+esc(strength)+"</b></span><span>Influences choices: <b>"+esc(freq)+"</b></span></div></article>";
  }).join("")+"</div><p class='pf-small-note'>The compact route rates every motive for strength, then asks about behaviour for up to three strongest motives. Motives, self-reported behaviour and available opportunities are different things; these ratings are not combined into a motivation score.</p>";
}
function renderNeeds() {
  return "<div class='pf-needs-grid'>"+NEEDS.map(n=>{
    const id=n[0],name=n[1];
    const sat=[answers["need-"+id+"-satisfaction"]].filter(v=>typeof v==="number").map(v=>nLabel(v,N5));
    const fru=[answers["need-"+id+"-frustration"]].filter(v=>typeof v==="number").map(v=>nLabel(v,N5));
    return "<article><h3>"+esc(name)+"</h3><p>"+esc(n[2])+"</p><div class='pf-need-pair'><div><b>Satisfaction · right now</b><span>"+esc(sat.join(" / ")||"Not answered")+"</span></div><div><b>Frustration · right now</b><span>"+esc(fru.join(" / ")||"Not answered")+"</span></div></div></article>";
  }).join("")+"</div><p class='pf-small-note'>Need satisfaction and active frustration are shown separately. A low satisfaction response is not automatically evidence of active frustration.</p>";
}
function renderCareerIdeas() {
  const picked=selectedWork().filter(w=>w.value>=3);
  const top=new Set(picked.slice(0,8).map(w=>w.id));
  const m=signalMap(allSignals());
  const high=(id)=>top.has(id);
  const leaning=(id,dir="more")=>m[id]&&m[id].direction===dir;
  const environments=[
    {title:"Independent complexity inside a clear enough structure",conditions:["Autonomy","Intellectual challenge","Independent work","Predictability"],support:[high("work-autonomy"),high("work-challenge"),high("work-independent"),high("work-predictability"),leaning("intellectual-curiosity"),leaning("decision-deliberation")],examples:["Research or policy analysis","UX or product research","Investigative writing","Technical or archival work"],hobbies:["A self-directed study project","Puzzle or strategy groups","Long-form making with a defined brief"],friction:"Open-ended work can become expensive when no stopping point or feedback exists."},
    {title:"Creative craft with room to refine",conditions:["Creative latitude","Visible progress","A meaningful brief","Selective collaboration"],support:[high("work-creative"),leaning("imagination"),leaning("aesthetic-sensitivity"),leaning("thoroughness"),leaning("personal-standards")],examples:["Content or experience design","Writing, illustration or music production","Brand, service or exhibition design"],hobbies:["Photography or visual journalling","Music, craft or animation","A themed personal portfolio"],friction:"High standards can keep moving the finish line unless ‘finished enough’ is defined first."},
    {title:"People-centred work with repair and purpose",conditions:["Meaningful contact","Reciprocity","Visible contribution","Boundaries around recovery"],support:[high("work-social"),high("work-helping"),high("work-impact"),leaning("compassion"),leaning("communion"),leaning("rel-repair")],examples:["Teaching or facilitation","Community support or advocacy","Behavioural or wellbeing education","Coordinating a mission-led project"],hobbies:["Peer-led groups","Volunteering with clear scope","Choirs, clubs or cooperative making"],friction:"Care for others can become over-responsibility when the limits of the role are unclear."},
    {title:"Varied practical problem-solving",conditions:["Changing problems","Hands-on feedback","Some autonomy","A visible result"],support:[high("work-variety"),high("work-hands"),high("work-autonomy"),leaning("adaptability"),leaning("persistence")],examples:["Field or laboratory technician work","Repair, fabrication or horticulture","Events, production or operations problem-solving"],hobbies:["Gardening or restoration","Model-building or cooking projects","Rotating workshops"],friction:"Novelty can be energising until fatigue or unclear priorities make recovery difficult."}
  ];
  const scored=environments.map(e=>Object.assign({},e,{score:e.support.filter(Boolean).length})).sort((a,b)=>b.score-a.score).filter(e=>e.score>=3);
  if(!scored.length)return "<div class='pf-empty'><b>No multi-variable work architecture reached the threshold yet.</b><p>Review the direct conditions below; the test will not invent an occupation from one answer.</p></div>";
  const cards=scored.slice(0,3).map((e,i)=>"<article class='pf-environment-card'><span class='pf-label'>WORK ARCHITECTURE 0"+(i+1)+" · "+e.score+" supporting signals</span><h3>"+esc(e.title)+"</h3><p><b>Conditions:</b> "+esc(e.conditions.join(" · "))+"</p><p><b>Occupational families to investigate:</b> "+esc(e.examples.join(" · "))+"</p><p><b>Hobbies or low-commitment experiments:</b> "+esc(e.hobbies.join(" · "))+"</p><p><b>Possible friction:</b> "+esc(e.friction)+"</p><small>These are examples of environments, not a career prediction. Test one condition at low cost before making a major decision.</small></article>").join("");
  return "<div class='pf-environment-grid'>"+cards+"</div><p class='pf-small-note'>Recommendations are environment-first. Occupation names are examples that can contain the conditions above; ability, qualifications, pay, access and material constraints were not measured.</p>";
}

function renderRelationshipSuggestions(signals) {
  const map=signalMap(signals);
  const cycles=[];
  const intimacy=map["rel-intimacy"],space=map["rel-autonomy"],anxiety=map["attachment-anxiety"],avoid=map["attachment-avoidance"],repair=map["rel-repair"],reassurance=map["rel-reassurance"];
  const comm=answers["comm-direct"];
  const process=answers["comm-process"];
  if(hasPattern(signals,"attachment-anxiety","more")&&hasPattern(signals,"rel-reassurance","more"))cycles.push({title:"Ambiguity → monitoring → reassurance → temporary settling",body:"Unclear signals may pull attention toward checking or asking for confirmation. The useful question is whether direct reassurance resolves the concern or only lowers it until the same uncertainty returns."});
  if(hasPattern(signals,"attachment-avoidance","more")||hasPattern(signals,"rel-autonomy","more"))cycles.push({title:"Activation → take space → analyse → return or postpone",body:"Your conflict sequence may be more pause–understand–return than simply avoidant or confrontational. Space can protect the conversation when it has a clear return point; without one it can become distance."});
  if(hasPattern(signals,"rel-intimacy","more")&&hasPattern(signals,"rel-autonomy","more"))cycles.push({title:"Closeness ↔ autonomy",body:"Wanting to be deeply known and wanting protected independent space are not opposites. A workable relationship may need both a predictable togetherness rhythm and explicit room apart."});
  if(hasPattern(signals,"rel-repair","more"))cycles.push({title:"Rupture → clarification → repair",body:"A strong repair orientation can be a shared resource. Notice whether repair includes accountability, changed behaviour and a return to safety—not only a conversation that ends the immediate tension."});
  const preferenceLines=[];
  if(intimacy&&intimacy.direction)preferenceLines.push(intimacy.direction==="more"?"deep emotional closeness":"a less emotionally intensive pace");
  if(space&&space.direction)preferenceLines.push(space.direction==="more"?"protected independent space":"more shared time");
  if(typeof comm==="number") preferenceLines.push(comm<0?"a softer or less direct communication style":comm>0?"direct communication":"a context-dependent communication style");
  if(typeof process==="number") preferenceLines.push(process<0?"private processing before discussion":process>0?"thinking through conversation":"a context-dependent processing rhythm");
  const relationshipAnswers=["rel-commitment","rel-novelty"].filter(k=>typeof answers[k]==="number");
  const b7=relationshipAnswers.map(k=>{
    const step=SPECIAL_STEPS.find(s=>s.id===k);
    const v=answers[k];
    const choice=v<0?step.left:v>0?step.right:"a context-dependent balance";
    return "<p><b>"+esc(step.title)+":</b> your selected preference leaned toward "+esc(choice.toLowerCase())+".</p>";
  }).join("");
  return "<div class='pf-partner-note'><p class='pf-label'>Relationship cycles · preferences to discuss, not an ideal-partner verdict</p><h3>Possible sequences worth noticing</h3>"+(cycles.length?"<div class='pf-cycle-grid'>"+cycles.map(c=>"<article><h4>"+esc(c.title)+"</h4><p>"+esc(c.body)+"</p></article>").join("")+"</div>":"<p>There are not enough relationship answers to generate a personal cycle. The detailed cards remain available as conversation prompts.</p>")+"<h3>Compatibility prompts</h3><p>Based on your direct answers, you may want to discuss "+esc(preferenceLines.join(", ")||"closeness, space, communication timing and repair")+" with a partner or trusted person. This does not identify an ideal partner.</p>"+b7+"<p class='pf-small-note'>A one-person questionnaire cannot calculate compatibility. A future dyadic comparison would need both people’s consent and would compare interaction-relevant dimensions—closeness, reassurance, processing, repair, novelty and money—rather than produce a percentage.</p></div>";
}


function stateAnswer() {
  return answers["state-context"]||null;
}
function stateLabel(value) {
  return typeof value==="number"?nLabel(value,S5):"Skipped";
}
function savedStateRows() {
  try {
    const value=JSON.parse(localStorage.getItem(STATE_KEY)||"[]");
    return Array.isArray(value)?value:[];
  } catch { return []; }
}
function storeState(row) {
  try {
    const rows=savedStateRows();
    rows.push(row);
    localStorage.setItem(STATE_KEY,JSON.stringify(rows.slice(-30)));
    return true;
  } catch { return false; }
}
function saveAssessmentSnapshot(root) {
  const a=stateAnswer();
  const status=root.querySelector("#pf-state-status");
  if(!a||!a.states) { if(status)status.textContent="There is no completed snapshot to save."; return; }
  const row={date:new Date().toISOString(),states:a.states,contexts:a.contexts||{},source:"assessment"};
  if(storeState(row)) {
    if(status)status.textContent="Saved privately in this browser. It has not been sent anywhere.";
    renderStateHistory(root);
  } else if(status) status.textContent="This browser could not save a check-in locally.";
}
function renderSavedStateHistory() {
  const rows=savedStateRows();
  if(!rows.length)return "<div class='pf-empty'><p>No repeated check-ins are saved on this device.</p></div>";
  const keys=[["energy","Energy"],["positive","Positive mood"],["focused","Focus"],["overloaded","Overload"],["fatigue","Physical fatigue"]];
  const top="<div class='pf-state-chart'>"+keys.map(([key,label])=>{
    const points=rows.map((r,i)=>{
      const v=r.states&&r.states[key];
      return "<div class='pf-state-point' title='Check-in "+(i+1)+" · "+esc(label)+": "+esc(stateLabel(v))+"'><span style='height:"+(typeof v==="number"?Math.max(3,(v/4)*100):4)+"%'></span></div>";
    }).join("");
    return "<div class='pf-state-series'><b>"+esc(label)+"</b><div>"+points+"</div></div>";
  }).join("")+"</div>";
  const history=rows.map((r,i)=>{
    const date=new Date(r.date);
    const label=isNaN(date.getTime())?"Saved check-in "+(i+1):date.toLocaleString();
    const fields=["energy","positive","anxiety","focused","overloaded","hunger","fatigue","pain"];
    const summary=fields.filter(k=>r.states&&r.states[k]!=null).map(k=>k.replace(/-/g," ")+": "+stateLabel(r.states[k])).join(" · ");
    const contextLabels=Object.fromEntries((SPECIAL_STEPS.find(s=>s.id==="state-context")?.contexts||[]).map(c=>[c.id,c.label]));
    const context=Object.entries(r.contexts||{}).filter(x=>x[1]).map(x=>(contextLabels[x[0]]||x[0])+": "+x[1]).join(" · ");
    return "<li><time>"+esc(label)+"</time><p>"+esc(summary||"No state ratings recorded.")+"</p>"+(context?"<small>"+esc(context)+"</small>":"")+"</li>";
  }).reverse().join("");
  return top+"<ol class='pf-state-history'>"+history+"</ol>";
}
function renderStateHistory(root) {
  const target=root.querySelector("#pf-state-history");
  if(target)target.innerHTML=renderSavedStateHistory();
}
function renderStateSection() {
  const a=stateAnswer();
  const stateStep=SPECIAL_STEPS.find(s=>s.id==="state-context");
  const rows=stateStep.rows;
  const stateMarkup=a&&a.states?rows.map(r=>"<div class='pf-state-read'><span>"+esc(r[1])+"</span><b>"+esc(stateLabel(a.states[r[0]]))+"</b></div>").join(""):"<p>No current-state snapshot was completed.</p>";
  const contextLabels=Object.fromEntries(stateStep.contexts.map(c=>[c.id,c.label]));
  const contexts=a&&a.contexts?Object.entries(a.contexts).filter(x=>x[1]).map(x=>"<span>"+esc(contextLabels[x[0]]||x[0])+": "+esc(x[1])+"</span>").join(""):"";
  const sliders=rows.map(r=>{
    return "<label class='pf-state-slider'><span>"+esc(r[1])+"</span><input type='range' min='0' max='4' value='2' data-state-log='"+esc(r[0])+"'><output data-state-output='"+esc(r[0])+"'>Moderately</output></label>";
  }).join("");
  const selects=[{id:"mode",label:"What kind of moment is this?",options:["Ordinary / baseline","Safe or well-resourced","Being evaluated or watched","Relationship uncertainty","Conflict or difficult conversation","Reward, excitement or opportunity","Sensory or demand overload","Fatigue or low energy","Recovery","Other"]},
    {id:"with",label:"Who are you mainly with?",options:["Alone","Romantic partner","Family","Close friend(s)","Acquaintances","Colleagues or classmates","Strangers or public","Mixed group","Other"]},
    {id:"doing",label:"What are you mainly doing?",options:["Resting","Working or studying","Socialising","Travelling","Domestic tasks","Entertainment","Exercising","Eating","Conflict or difficult conversation","Other activity"]},
    {id:"demand",label:"Current demand level",options:["Very low","Low","Moderate","High","Very high"]},
    {id:"uncertainty",label:"Current uncertainty",options:["Very low","Low","Moderate","High","Very high"]},
    {id:"evaluation",label:"Current evaluation pressure",options:["Very low","Low","Moderate","High","Very high"]},
    {id:"sleep",label:"Sleep quality last night",options:["Very poor","Poor","Okay","Good","Very good","Prefer not to say"]}].map(c=>"<label class='pf-select-label'>"+esc(c.label)+"<select data-new-context='"+esc(c.id)+"'><option value=''>Choose if useful…</option>"+c.options.map(x=>"<option>"+esc(x)+"</option>").join("")+"</select></label>").join("");
  return "<section class='pf-report-section' id='pf-context'><p class='eyebrow'>One moment in time · separate from traits</p><h2>State & context map</h2><p class='pf-section-lead'>The test collected one snapshot. That can show what today feels like, but it cannot establish a stable mode, trigger or state transition. Repeated check-ins below are optional and stay on this device. Include the kind of moment, people, activity and demands so later entries have context.</p><div class='pf-state-snapshot'><h3>Your assessment snapshot</h3><div class='pf-state-readings'>"+stateMarkup+"</div><div class='pf-context-tags'>"+contexts+"</div></div><div class='pf-state-privacy'><p>Save a check-in only if you choose. Stored state entries remain in this browser profile; delete them below if you share the device.</p><div class='pf-button-row'><button type='button' class='button' id='pf-save-baseline'>Save this snapshot on this device</button><button type='button' class='button secondary' id='pf-open-checkin'>Add another check-in</button><button type='button' class='button secondary' id='pf-delete-checkins'>Delete saved check-ins</button></div><p id='pf-state-status' class='pf-small-note' aria-live='polite'></p></div><div id='pf-new-checkin' class='pf-new-checkin' hidden><h3>Another right-now check-in</h3><p>Rate each state as it feels now; the centre means moderately. This is not a diagnosis or a personality result.</p>"+sliders+"<div class='pf-context-grid'>"+selects+"</div><button type='button' class='button' id='pf-save-checkin'>Save check-in on this device</button></div><div class='pf-history-panel'><h3>Saved check-ins on this device</h3><p>Visual history only. A few check-ins cannot estimate reliability, explain cause or represent every context.</p><div id='pf-state-history'>"+renderSavedStateHistory()+"</div></div></section>";
}

function attachStateEvents(root) {
  const saveBase=root.querySelector("#pf-save-baseline");
  if(saveBase)saveBase.addEventListener("click",()=>saveAssessmentSnapshot(root));
  const open=root.querySelector("#pf-open-checkin"),form=root.querySelector("#pf-new-checkin");
  if(open&&form)open.addEventListener("click",()=>{form.hidden=!form.hidden;if(!form.hidden)form.scrollIntoView({behavior:"smooth",block:"start"});});
  root.querySelectorAll("[data-state-log]").forEach(input=>input.addEventListener("input",()=>{
    const out=root.querySelector("[data-state-output='"+input.dataset.stateLog+"']");
    if(out)out.textContent=nLabel(input.value,S5);
  }));
  const save=root.querySelector("#pf-save-checkin");
  if(save)save.addEventListener("click",()=>{
    const states={};
    root.querySelectorAll("[data-state-log]").forEach(input=>states[input.dataset.stateLog]=Number(input.value));
    const contexts={};
    root.querySelectorAll("[data-new-context]").forEach(input=>contexts[input.dataset.newContext]=input.value);
    if(storeState({date:new Date().toISOString(),states,contexts,source:"manual"})) {
      const status=root.querySelector("#pf-state-status");
      if(status)status.textContent="Saved privately in this browser. It has not been sent anywhere.";
      renderStateHistory(root);form.hidden=true;
    } else {
      const status=root.querySelector("#pf-state-status");
      if(status)status.textContent="This browser could not save a check-in locally.";
    }
  });
  const del=root.querySelector("#pf-delete-checkins");
  if(del)del.addEventListener("click",()=>{
    try {localStorage.removeItem(STATE_KEY);root.querySelector("#pf-state-status").textContent="Saved check-ins were deleted from this browser.";renderStateHistory(root);}
    catch {root.querySelector("#pf-state-status").textContent="This browser could not delete its saved check-ins.";}
  });
}

function renderHypotheses(signals) {
  const list=hypothesisList(signals);
  if(!list.length)return "<div class='pf-empty'><p>No combination rules were supported by enough repeated-item responses. That is more honest than inventing one.</p></div>";
  return "<div class='pf-hypothesis-grid'>"+list.map((h,i)=>"<article class='pf-hypothesis'>"+badge("hypothesis",true)+"<span>HYPOTHESIS "+String(i+1).padStart(2,"0")+"</span><h3>"+esc(h.title)+"</h3><p><b>What answers produced this:</b> "+esc(h.evidence)+"</p><p><b>One possible reading:</b> "+esc(h.interpretation)+"</p><p><b>Where to check:</b> "+esc(h.setting)+"</p><div><b>Small experiment:</b> "+esc(h.experiment)+"</div><p class='pf-small-note'>You can accept, revise or reject this. It is not a validated interaction rule.</p></article>").join("")+"</div>";
}
function renderStandouts(signals) {
  const list=usefulDirections(signals);
  if(!list.length)return "<div class='pf-empty'><p>No repeated-item scale has enough answers leaning consistently in one direction. Mixed answers are not a flaw.</p></div>";
  return "<ul class='pf-standout-list'>"+list.map(s=>"<li><b>"+esc(s.dimension.title)+"</b><span>"+esc(patternLabel(s))+"</span><p>"+esc(s.direction==="more"?s.dimension.more:s.dimension.less)+"</p><small>Mean "+s.mean.toFixed(2)+"/6 · "+esc(s.confidence)+"</small></li>").join("")+"</ul><p class='pf-small-note'>These are patterns within your own answers, not unusually high or low compared with other people.</p>";
}
function renderBestConditions() {
  const picks=selectedWork();
  const wanted=picks.filter(w=>w.value>=3).slice(0,8);
  const less=picks.filter(w=>w.value<=1).slice(0,8);
  return "<div class='pf-condition-columns'><article><h3>Conditions you rated strongly desirable</h3>"+(wanted.length?"<ul>"+wanted.map(w=>"<li>"+esc(w.title)+" — "+esc(w.text)+" <small>("+esc(I5label(w.value))+")</small></li>").join("")+"</ul>":"<p>No work condition was rated strongly desirable. The direct answers remain below.</p>")+"</article><article><h3>Conditions you rated lower</h3>"+(less.length?"<ul>"+less.map(w=>"<li>"+esc(w.title)+" <small>("+esc(I5label(w.value))+")</small></li>").join("")+"</ul>":"<p>No work condition was rated in the lowest response range.</p>")+"</article></div><p class='pf-small-note'>Lower desire is not inability. These are preferences from one self-report, not a job-fit score.</p>";
}
function renderMoney(signals) {
  const list=signals.filter(s=>s.dimension.id.startsWith("money-"));
  const cards=list.map(traitCard).join("");
  const riskRows=MONEY_RISK_SCENARIOS.map(s=>{const v=answers[s.id];return "<li>"+esc(s.title)+": "+esc(typeof v==="number"?(v<0?s.left:v>0?s.right:"depends"):"Not answered")+"</li>";}).join("");
  const delayRows=MONEY_DELAY_SCENARIOS.map(s=>{const v=answers[s.id];return "<li>"+esc(s.title)+": "+esc(typeof v==="string"?(s.options[Number(v)]||v):"Not answered")+"</li>";}).join("");
  return "<div class='pf-money-direct'><div class='pf-money-scenarios'><article><h3>Repeated risk choices</h3><ul>"+riskRows+"</ul></article><article><h3>Repeated delay and scarcity choices</h3><ul>"+delayRows+"</ul></article></div></div><div class='pf-trait-list'>"+cards+"</div><p class='pf-small-note'>Repeated scenarios let the report notice consistency without pretending to estimate a financial trait. Actual income, debt, resources, financial literacy, safety and constraints remain unknown. This is not financial advice.</p>";
}
function renderLearning() {
  const prefs=LEARNING_PREFERENCES;
  const cards=prefs.map(p=>{
    const v=answers[p.id];
    const chosen=typeof v==="number"?(v<0?p.left:v>0?p.right:"A context-dependent balance"):"Not answered";
    return "<article class='pf-direct-card'><b>"+esc(p.title)+"</b><p>"+esc(chosen)+"</p><small>"+esc(p.prompt)+"</small></article>";
  }).join("");
  const dims=allSignals().filter(s=>s.dimension.id.startsWith("learning-"));
  return "<div class='pf-preference-grid'>"+cards+"</div><div class='pf-trait-list'>"+dims.map(traitCard).join("")+"</div>";
}
function renderCommunication() {
  const prefs=COMMUNICATION_PREFERENCES.map(p=>{
    const v=answers[p.id];
    const selected=typeof v==="number"?(v<0?p.left:v>0?p.right:"A context-dependent balance"):"Not answered";
    return "<article class='pf-direct-card'><b>"+esc(p.title)+"</b><p>"+esc(selected)+"</p></article>";
  }).join("");
  return "<div class='pf-preference-grid'>"+prefs+"</div><p class='pf-small-note'>Neither end is better. The useful question is which approach works for a particular person, topic and level of safety.</p>";
}
function renderConflict() {
  const items=SCENARIOS.map(s=>{
    const a=answers[s.id];
    if(!a||a===null)return "<article class='pf-direct-card'><b>"+esc(s.title)+"</b><p>Skipped.</p></article>";
    return "<article class='pf-direct-card'><b>"+esc(s.title)+"</b><p><b>First:</b> "+esc(s.choices[Number(a.first)]||"Not answered")+"</p>"+(a.second!==""&&a.second!==undefined?"<p><b>Possible next:</b> "+esc(s.choices[Number(a.second)]||"Not answered")+"</p>":"")+"</article>";
  }).join("");
  return "<div class='pf-preference-grid'>"+items+"</div><p class='pf-small-note'>These are choices in hypothetical situations, not observed conflict behaviour or evidence that one response is objectively best.</p>";
}

function renderSelfWorth() {
  const a=answers["self-worth-contingencies"]||{};
  return "<div class='pf-worth-grid'>"+SELF_WORTH_AREAS.map((name,i)=>{
    const v=a["worth-"+i];
    return "<div><b>"+esc(name)+"</b><span>"+(typeof v==="number"?esc(I5label(v)):"Not answered")+"</span></div>";
  }).join("")+"</div><p class='pf-small-note'>This is a set of self-reported sensitivities, not a diagnosis or a measure of overall worth.</p>";
}

function renderNarrativeThemes() {
  const a=answers["identity-story"];
  const themes=SPECIAL_STEPS.find(s=>s.id==="identity-story").options;
  const selected=Array.isArray(a)?a.map(i=>themes[Number(i)]).filter(Boolean):[];
  const setbacks=answers["identity-setback"];
  const setback=typeof setbacks==="string"?SPECIAL_STEPS.find(s=>s.id==="identity-setback").options[Number(setbacks)]:"Not answered";
  return "<div class='pf-story-panel'><h3>Your chosen narrative themes</h3>"+(selected.length?"<ul>"+selected.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>":"<p>No story themes selected.</p>")+"<p><b>How you currently interpret setbacks:</b> "+esc(setback)+"</p><p class='pf-small-note'>These are chosen descriptions of your current narrative, not a fixed story or a measure of resilience.</p></div>";
}

function reportUnknowns() {
  return "<div class='pf-unknown-grid'><article><h3>Not measured here</h3><ul><li>Clinical diagnoses or mental-health conditions.</li><li>Intelligence, executive-function capacity or neurotype.</li><li>Vocational interests, skill, qualifications, work history or likely earnings.</li><li>Actual financial resources, financial literacy, debt or material constraints.</li><li>Family-of-origin patterns, informant reports or another person’s perspective.</li><li>A comparison of repeated states across safe, evaluated, conflict, reward, overload and fatigue contexts. Optional local check-ins can help you notice variation, but they are not validated experience-sampling data.</li></ul></article><article><h3>Single-session limits</h3><ul><li>A “right now” rating is one snapshot, not a reliable state average.</li><li>A preference is not an ability, motive is not opportunity, and behaviour is not its cause.</li><li>A partner section cannot assess a partner or calculate compatibility.</li><li>Two candidate items can suggest a pattern; they do not establish a validated trait score.</li><li>Life circumstances, health, access, culture and relationships can change what an answer means.</li></ul></article></div>";
}


function renderMisreads(signals) {
  const m=signalMap(signals),cards=[];
  const add=(title,text,basis)=>cards.push("<article><h3>"+esc(title)+"</h3><p>"+esc(text)+"</p><small>Why this appears: "+esc(basis)+"</small></article>");
  if(hasPattern(signals,"sociability","more")&&hasPattern(signals,"social-boldness","less"))add("Wanting contact may look like hesitation","Social interest and comfort initiating are separate. You may want connection while preferring a familiar opening or lower-pressure setting.","Your social-interest items leaned higher and social-boldness items lower.");
  if(hasPattern(signals,"social-boldness","more")&&hasPattern(signals,"sociability","less"))add("Social ease may look like social appetite","You may be able to enter a group comfortably without wanting frequent or extended contact.","Your social-boldness items leaned higher while social-interest items leaned lower.");
  if(hasPattern(signals,"stimulation","more")&&hasPattern(signals,"uncertainty-intolerance","more"))add("Caution may not mean lack of interest","A possibility can be attractive while the unknown parts still occupy attention.","Your stimulation and uncertainty items both leaned higher.");
  if(hasPattern(signals,"persistence","less")&&motifValues().some(x=>x.id==="achievement"&&x.strength>=3))add("A hard start or fading momentum may not mean you do not care","Achievement can matter while repetition or initiation still asks for more support.","Achievement was rated strongly motivating; persistence items leaned lower.");
  if(hasPattern(signals,"rel-intimacy","more")&&hasPattern(signals,"rel-autonomy","more"))add("Wanting closeness does not cancel wanting space","Both intimacy and independent room can be genuine needs.","Both relationship preference scales leaned toward more.");
  if(hasPattern(signals,"personal-standards","more")&&hasPattern(signals,"evaluative-perfectionism","less"))add("High standards may come from the work itself","Caring about quality does not necessarily mean fearing other people’s judgement.","Standards leaned higher while evaluative concern leaned lower.");
  if(hasPattern(signals,"compassion","more")&&hasPattern(signals,"communion","more")&&hasPattern(signals,"tact","less"))add("Directness is not necessarily low compassion","Your answers can hold care for other people alongside a preference for clarity over cushioning. Motive and delivery may be different.","Compassion and communion leaned higher while tact leaned lower.");
  if(hasPattern(signals,"identity-exploration","more")&&hasPattern(signals,"identity-commitment","more"))add("Exploration is not the same as lack of commitment","You may be committed to important values while remaining willing to revise the route.","Identity exploration and identity commitment both leaned higher.");
  if(!cards.length)return "<div class='pf-empty'><p>No specific misunderstanding pattern was supported by the repeated-item combinations. The wider profile still shows separate facets so readers do not collapse them into one label.</p></div>";
  return "<div class='pf-misread-grid'>"+cards.join("")+"</div><p class='pf-small-note'>These are hypotheses to check against real interactions. The assessment does not know what other people actually think.</p>";
}
function renderEnvironment(signals) {
  const work=selectedWork().filter(w=>w.value>=3).slice(0,7);
  const patterns=strongestDirections(signals,6);
  const list=[];
  work.forEach(w=>list.push("<li><b>"+esc(w.title)+":</b> "+esc(w.text)+"</li>"));
  patterns.forEach(s=>list.push("<li><b>"+esc(s.dimension.title)+":</b> "+esc(s.direction==="more"?s.dimension.needs:s.dimension.more)+"</li>"));
  return "<div class='pf-condition-columns'><article><h3>Conditions worth trying</h3>"+(list.length?"<ul>"+list.join("")+"</ul>":"<p>There are not enough directional patterns to offer personalised environment suggestions. Use the direct preferences below.</p>")+"</article><article><h3>Conditions that may ask more effort</h3>"+(patterns.length?"<ul>"+patterns.slice(0,5).map(s=>"<li><b>"+esc(s.dimension.title)+":</b> "+esc(s.dimension.friction)+"</li>").join("")+"</ul>":"<p>No specific friction hypotheses were generated from the current answers.</p>")+"</article></div><p class='pf-small-note'>These are possible conditions to test, not restrictions or instructions. You can be effective in environments that are not your preferred ones.</p>";
}
function renderStressManual(signals) {
  const m=signalMap(signals);
  const selected=["stress-vulnerability","emotional-volatility","sensory-overload","anxiousness","negative-urgency","self-soothing","distress-tolerance"].map(id=>m[id]).filter(Boolean);
  const cards=selected.map(s=>{
    const read=s.direction==="more"?s.dimension.more:s.direction==="less"?s.dimension.less:"Answers here were mixed or did not support a consistent directional reading.";
    return "<article><b>"+esc(s.dimension.title)+"</b><p>"+esc(read)+"</p><small>Possible sign: "+esc(s.dimension.cues)+"</small><small>Try checking: "+esc(s.dimension.needs)+"</small></article>";
  }).join("");
  return "<div class='pf-stress-grid'>"+cards+"</div><p class='pf-small-note'>A trigger is not inferred from this questionnaire. The situations listed in each scale are prompts for observation; a repeated log is needed to see whether an actual pattern holds for you.</p>";
}
function renderDirectPrefs(ids) {
  return "<div class='pf-preference-grid'>"+ids.map(id=>{
    const step=SPECIAL_STEPS.find(s=>s.id===id);
    if(!step)return "";
    const v=answers[id];
    const selected=typeof v==="number"?(v<0?step.left:v>0?step.right:"A context-dependent balance"):"Not answered";
    return "<article class='pf-direct-card'><b>"+esc(step.title)+"</b><p>"+esc(selected)+"</p><small>"+esc(step.prompt)+"</small></article>";
  }).join("")+"</div>";
}
function renderCareerSection() {
  const idea=renderCareerIdeas();
  const answered=selectedWork();
  const topFive=Array.isArray(answers["work-top-five"])?answers["work-top-five"].map(i=>WORK_PREFERENCES[Number(i)]).filter(Boolean):[];
  const topFiveMarkup=topFive.length?"<div class='pf-priority-strip'><h3>Your five hardest conditions to sacrifice</h3><ul>"+topFive.map(x=>"<li>"+esc(x.title)+"</li>").join("")+"</ul></div>":"<p class='pf-small-note'>You did not select work conditions that are hardest to sacrifice.</p>";
  const ideal=answered.filter(w=>w.value>=3).slice(0,4).map(w=>w.title.toLowerCase());
  const idealText=ideal.length?"A workday worth testing may include "+ideal.join(", ")+", with enough flexibility to adapt the mix to the actual role.":"Your direct work-environment ratings do not yet point to a clear set of preferred conditions.";
  return "<section class='pf-report-section' id='pf-work'><p class='eyebrow'>Work, direction & interests</p><h2>Career and hobby ideas to explore</h2><p class='pf-section-lead'>"+esc(idealText)+" These are invitations to try, not conclusions about what you are suited to.</p>"+renderBestConditions()+topFiveMarkup+idea+"<details class='pf-detail'><summary>Your work-environment responses</summary><div class='pf-work-ratings'>"+answered.map(w=>"<div><b>"+esc(w.title)+"</b><span>"+esc(I5label(w.value))+"</span></div>").join("")+"</div></details>"+feedbackBlock("work","work")+"</section>";
}
function renderMoneySection(signals) {
  return "<section class='pf-report-section' id='pf-money'><p class='eyebrow'>Resources & trade-offs</p><h2>Money patterns</h2><p class='pf-section-lead'>This section describes self-reported preferences and habits. It cannot tell whether your choices are voluntary or shaped by your actual resources.</p>"+renderMoney(signals)+"</section>";
}
function renderLearningSection() {
  return "<section class='pf-report-section' id='pf-learning'><p class='eyebrow'>Learning & making</p><h2>How you may prefer to learn</h2><p class='pf-section-lead'>Your learning-style choices are preferences to experiment with, not fixed learning types or evidence that one method works best for you.</p>"+renderLearning()+"<div class='pf-not-measured'><b>Creativity and leadership:</b> This assessment asks about imagination, aesthetic attention, ideas and taking direction in groups. It does not measure creative skill, leadership effectiveness or performance.</div></section>";
}
function renderDecisionSection(signals) {
  const items=signals.filter(s=>s.dimension.group==="decisions");
  return "<section class='pf-report-section' id='pf-decisions'><p class='eyebrow'>Choosing, starting & changing course</p><h2>Your decision and change map</h2><p class='pf-section-lead'>Deliberation, intuition, regret, initiation, sustainment and adaptability are kept separate. A person can be careful about one kind of decision and quick about another.</p><div class='pf-trait-list'>"+items.map(traitCard).join("")+"</div><div class='pf-next-steps'><h3>Decision rules worth trying</h3><ol><li>Ask whether the choice is reversible; match the amount of analysis to the cost of undoing it.</li><li>Name what information would change your choice, then stop gathering once that information is available.</li><li>For a reversible decision, choose a small next step and schedule a review rather than reopening the decision every hour.</li><li>Separate the first step, returning after interruption and continuing through repetition; each may need a different support.</li></ol></div></section>";
}
function renderRelationshipSection(signals) {
  const r=signals.filter(s=>s.dimension.group==="relationships");
  const social=signalMap(signals);
  const socialRead=(()=>{
    const sociability=social.sociability,bold=social["social-boldness"],sensory=social["sensory-overload"];
    const lines=[];
    if(sociability&&sociability.pattern!=="unknown")lines.push("Social contact: "+patternLabel(sociability).toLowerCase()+".");
    if(bold&&bold.pattern!=="unknown")lines.push("Social initiation: "+patternLabel(bold).toLowerCase()+".");
    if(sensory&&sensory.pattern==="more")lines.push("Busy input may also use energy, regardless of how much you enjoy people.");
    return lines.join(" ");
  })();
  return "<section class='pf-report-section' id='pf-relationships'><p class='eyebrow'>Closeness, space & repair</p><h2>Your relationship profile</h2><p class='pf-section-lead'>The relationship module focuses on your reported preferences and possible responses. It cannot describe a specific partner or relationship from your answers alone.</p><div class='pf-trait-list'>"+r.map(traitCard).join("")+"</div>"+renderRelationshipSuggestions(signals)+"<div class='pf-social-battery'><h3>Friendship & social battery</h3><p>"+esc(socialRead||"There are not enough social answers for a personal description.")+"</p><p>There is no separate measure of friendship quality, family relationships or social battery here. The answers above are clues to discuss, not a verdict about how much connection you should want.</p></div>"+feedbackBlock("relationships","relationships")+"</section>";
}
function renderRegulationSection(signals) {
  const items=signals.filter(s=>s.dimension.group==="regulation");
  const flex="<div class='pf-direct-card'><b>Regulation flexibility matrix</b><p>Six scenarios vary controllability and intensity so one strategy is not treated as your whole regulation style.</p><div class='pf-scenario-grid'>"+REGULATION_SCENARIOS.map(s=>{const v=answers[s.id];const choice=typeof v==="string"?s.options[Number(v)]||v:"Not answered";return "<article><span class='pf-label'>"+esc(s.title.replace("Regulation · ",""))+"</span><p>"+esc(choice)+"</p></article>";}).join("")+"</div><small>Different choices may make sense when the facts differ. These are scenario responses, not validated skill scores.</small></div>";
  return "<section class='pf-report-section' id='pf-regulation'><p class='eyebrow'>Emotion, pressure & recovery</p><h2>Your regulation manual</h2><p class='pf-section-lead'>Strategies are not character flaws. The same strategy may help in one context and create friction in another; the question is whether it fits the situation and what matters to you.</p>"+flex+"<div class='pf-trait-list'>"+items.map(traitCard).join("")+"</div><h3 class='pf-subhead'>Stress, overload & recovery signals</h3>"+renderStressManual(signals)+"<div class='pf-next-steps'><h3>Recovery questions</h3><ul><li>What changes after food, sleep, water, movement or a lower-input space?</li><li>Which difficult situation can you change, and which one first needs care or support?</li><li>What helps you return to a valued activity without demanding that the feeling disappear?</li></ul></div>"+feedbackBlock("regulation","regulation")+"</section>";
}
function renderIdentitySection() {
  const ids=allSignals().filter(s=>s.dimension.group==="identity");
  return "<section class='pf-report-section' id='pf-identity'><p class='eyebrow'>Self-understanding & narrative</p><h2>Identity, worth and continuity</h2><p class='pf-section-lead'>Identity can be clear in some areas and in motion in others. Multiple versions of you can be real without one being the “true” one.</p><div class='pf-trait-list'>"+ids.map(traitCard).join("")+"</div><h3 class='pf-subhead'>What can affect your sense of worth</h3>"+renderSelfWorth()+renderNarrativeThemes()+"<p class='pf-small-note'>Self-worth sensitivities and chosen life-story themes are direct answers, not a diagnosis, cause or prediction.</p></section>";
}
function renderMisunderstandingSection(signals) {
  return "<section class='pf-report-section' id='pf-combinations'><p class='eyebrow'>More than one thing can be true · derived + hypothesis</p><h2>What makes you distinctive</h2><p class='pf-section-lead'>These combinations are generated only when the relevant answers exist. Each card shows what data prompted it and a low-risk way to test whether it fits your life.</p>"+renderHypotheses(signals)+"<h3 class='pf-subhead'>What someone might misunderstand about you</h3>"+renderMisreads(signals)+"<h3 class='pf-subhead'>What you might misunderstand about yourself</h3><div class='pf-misread-grid'><article><h3>Wanting certainty is not the same as being unadventurous</h3><p>Curiosity and caution can coexist. A need for a clearer route does not erase the wish to explore.</p></article><article><h3>Deliberating does not mean you ignore intuition</h3><p>Different decision channels can both be useful; the key question is whether post-decision review adds evidence or only repeats regret.</p></article><article><h3>Seeking reassurance is not the same as generally seeking support</h3><p>Broad help-seeking, vulnerable disclosure and relationship-specific confirmation are separate paths in the map.</p></article></div>"+feedbackBlock("combinations","combinations")+"<p class='pf-small-note'>No combination here is a validated interaction. A conflict between two needs is not evidence that one is fake.</p></section>";
}
function renderValuesSection() {
  return "<section class='pf-report-section' id='pf-values'><p class='eyebrow'>What matters when priorities compete</p><h2>Your values map</h2><p class='pf-section-lead'>Each choice compared a few values in one round. The full list appears below so you can see both what you selected most often and what you were more willing to set aside in those particular sets.</p>"+renderValueGraph()+"</section>";
}
function renderMotivesSection() {
  const quality=answers["motivation-quality"];
  const motivation="<div class='pf-story-panel'><h3>Why one current goal matters</h3>"+(quality&&Array.isArray(quality.selected)?"<p>You selected: "+quality.selected.map(i=>SPECIAL_STEPS.find(s=>s.id==="motivation-quality").options[Number(i)]).filter(Boolean).map(esc).join("; ")+"</p><p><b>Strongest reason:</b> "+esc(SPECIAL_STEPS.find(s=>s.id==="motivation-quality").options[Number(quality.strongest)]||"Not selected")+"</p>":"<p>This item was skipped.</p>")+"<p class='pf-small-note'>Goal motivation can be mixed; no single reason is treated as the correct one.</p></div>";
  return "<section class='pf-report-section' id='pf-motives'><p class='eyebrow'>What draws effort & what is supported now</p><h2>Motives, needs & motivation quality</h2><p class='pf-section-lead'>A motive concerns what pulls you; a need concerns how your current conditions feel. They are reported separately.</p><h3 class='pf-subhead'>Motives and their current influence</h3>"+renderMotives()+"<h3 class='pf-subhead'>Need satisfaction and frustration</h3>"+renderNeeds()+motivation+"</section>";
}
function renderBestUse(signals) {
  const m=signalMap(signals),clear=strongestDirections(signals,5),hypotheses=hypothesisList(signals),rules=[];
  const addRule=(when,text)=>rules.push("<li><b>"+esc(when)+":</b> "+esc(text)+"</li>");
  if(hasPattern(signals,"uncertainty-intolerance","more")&&(hasPattern(signals,"decision-deliberation","more")||hasPattern(signals,"decision-reopening","more")))addRule("When deciding","Write down the specific information that would actually change the choice. If you cannot name it, further research may be serving uncertainty rather than the decision.");
  if(selectedWork().some(w=>w.id==="work-autonomy"&&w.value>=3)&&selectedWork().some(w=>w.id==="work-predictability"&&w.value>=3))addRule("When working","Build freedom inside structure: agree the objective and stopping point, then choose your own route.");
  if(hasPattern(signals,"sociability","more")&&hasPattern(signals,"social-boldness","less"))addRule("When relating","Separate social desire from approach difficulty. Design a smaller opening instead of treating hesitation as lack of interest.");
  if(hasPattern(signals,"sensory-overload","more")||hasPattern(signals,"interoception","more"))addRule("When stressed","Check sound, light, hunger, fatigue and body load before turning irritation into a story about the whole problem.");
  if(hasPattern(signals,"personal-standards","more")||hasPattern(signals,"thoroughness","more"))addRule("When creating","Define ‘finished enough’ before starting so care improves the work rather than moving the finish line indefinitely.");
  if(hasPattern(signals,"rel-intimacy","more")&&hasPattern(signals,"rel-reassurance","more"))addRule("In important relationships","Ask once for the specific clarity you need, then agree what repair or follow-through would look like instead of repeating the same question.");
  if(hasPattern(signals,"decision-intuition","more")&&hasPattern(signals,"decision-deliberation","more"))addRule("For complex choices","Use a two-pass process: gather evidence, record your first felt direction, then compare without pretending one channel must win.");
  if(!rules.length)clear.slice(0,3).forEach(s=>addRule("For "+s.dimension.title.toLowerCase(),"Notice one situation where this pattern helps and one where it creates friction; record the context before explaining the cause."));
  const experiments=[];
  if(clear[0])experiments.push("For "+clear[0].dimension.title.toLowerCase()+", track the same situation in two contexts and note what changes the response.");
  if(hypotheses[0])experiments.push(hypotheses[0].experiment);
  experiments.push("For one week, write down one cue before explaining a strong reaction: who was present, what was demanded, what your body needed and what choice was available.");
  return "<section class='pf-report-section' id='pf-use'><p class='eyebrow'>Level 3 · Use this · derived from your configuration</p><h2>Your operating manual</h2><p class='pf-section-lead'>These are the five-to-seven rules with the strongest multi-variable support in this session. Treat them as experiments, not instructions.</p>"+renderEnvironment(signals)+"<div class='pf-experiment-grid'>"+experiments.slice(0,3).map((x,i)=>"<article><span>EXPERIMENT 0"+(i+1)+"</span><p>"+esc(x)+"</p></article>").join("")+"</div><div class='pf-practical'><h3>Your high-value rules</h3><ol>"+rules.slice(0,7).join("")+"</ol></div>"+feedbackBlock("use","use")+"</section>";
}
function renderValidity(signals) {
  const answered=signals.filter(s=>s.count>0).length;
  const required=signals.length;
  return "<details class='pf-limit-fold' id='pf-limits'><summary>Accuracy, privacy & limitations</summary><div class='pf-limit-fold-body'><p class='eyebrow'>Read carefully · limits of this map</p><h3>This is an exploratory self-reflection profile, not a validated test.</h3><p>The public edition is fully built as a compact adaptive questionnaire and guide, but the candidate items, response rules, profile-pattern rules and generated interpretations have not been psychometrically validated, normed or independently calibrated. A functioning assessment is not evidence that its measurements are reliable or valid.</p><p>This report uses "+answered+" of "+required+" candidate-item dimensions with at least one answer. Repeated items are used for within-session convergence; direct preferences, values, scenarios and the right-now snapshot stay separate. No overall personality score, percentile, clinical confidence interval or population comparison is produced.</p>"+reportUnknowns()+"<p class='pf-limit-ending'>A profile pattern is a working formulation—not a diagnosis, category, ability claim or permanent identity. If the evidence gate says “too uncertain”, the guide intentionally leaves the map open rather than guessing. Answers and optional check-ins stay in this browser unless you choose to export or share them.</p></div></details>";
}
function guideSignal(signals,id) {
  const signal=signalMap(signals)[id];
  return usableSignal(signal)?signal:null;
}
function guideBand(signals,id) {
  return stateBand(signalMap(signals)[id]);
}
function guidePosition(signal) {
  if(!signal||signal.mean==null)return 50;
  if(signal.direction==="more")return 78;
  if(signal.direction==="less")return 22;
  return Math.max(8,Math.min(92,Math.round(signal.mean/6*100)));
}
function guideAxis(signals,id,label,left,right) {
  const signal=signalMap(signals)[id];
  const position=guidePosition(signal);
  const state=stateBand(signal);
  const stateText=state==="unknown"?"Open":state==="higher"?"more present":state==="lower"?"less present":"context-dependent";
  return "<div class='pf-guide-axis'><div class='pf-guide-axis-head'><b>"+esc(label)+"</b><span>"+esc(stateText)+"</span></div><div class='pf-axis-line'><i style='left:"+position+"%'></i></div><div class='pf-axis-labels'><span>"+esc(left)+"</span><span>"+esc(right)+"</span></div></div>";
}
function guideMeter(label,value,detail) {
  const position=typeof value==="number"?Math.max(8,Math.min(92,Math.round(value/4*100))):50;
  const state=typeof value!=="number"?"open":value>=3?"strong pull":value<=1?"lighter pull":"mixed pull";
  return "<div class='pf-guide-meter'><div><b>"+esc(label)+"</b><span>"+esc(state)+"</span></div><div class='pf-meter-track'><i style='width:"+position+"%'></i></div>"+(detail?"<small>"+esc(detail)+"</small>":"")+"</div>";
}
function guideProfileStory(profile,signals) {
  const p=profile.primary;
  if(!p)return {
    analogy:"Imagine a field notebook with several routes drawn in pencil. The map already contains useful observations, but no single path has enough converging evidence to become the headline.",
    knownFor:"Your strongest result is not a type; it is the permission to keep more than one explanation alive while you gather better examples.",
    lesson:"The next useful move is to watch which conditions make the same response easier, harder or unnecessary.",
    heading:"An open map is still a map"
  };
  const stories={
    "deliberative-explorer":{analogy:"A traveller updates a map while moving: curiosity opens the next path, while structure checks whether the route is navigable enough to enter.",knownFor:"You may be especially good at turning complicated questions into routes other people can use. The cost is that orientation can quietly become a second task when action already has enough information.",lesson:"Orientation and certainty are not the same thing. You can ask for a map without requiring the whole landscape to be predictable.",heading:"The cartographer who still travels"},
    "socially-cautious-connector":{analogy:"You may be a careful host at a doorway: interested in who is inside, but more available when the entrance feels legible and welcoming.",knownFor:"You can bring depth and attention to connection once the first social threshold is workable. Others may see the pause before entry and miss the interest underneath it.",lesson:"Warmth does not need to look like instant approach. A clear opening can be a form of access, not a test you have failed.",heading:"The threshold listener"},
    "autonomous-stabiliser":{analogy:"Think of a well-built basecamp: it is not the destination, but it gives exploration, care and work somewhere reliable to begin.",knownFor:"You may protect self-direction by building enough structure, resources and boundary around it. Freedom can feel more usable when it has a dependable return point.",lesson:"Stability is not the opposite of freedom. It can be the infrastructure that makes freedom sustainable.",heading:"The basecamp builder"},
    "adaptive-initiator":{analogy:"You travel by testing the first few metres of a path. Movement gives you information, and a route can be revised without becoming a failure.",knownFor:"You may be good at opening possibilities, spotting new information and changing course before a stale plan becomes a cage. The middle of a project may need deliberately renewed reasons to continue.",lesson:"The goal is not to force yourself into one route; it is to make continuation feel like another form of discovery.",heading:"The route-maker"},
    "relationally-vigilant-connector":{analogy:"You may carry a small relationship weather station: closeness matters, and ambiguous changes can make the instruments work harder than the conversation itself.",knownFor:"You can bring loyalty, repair and emotional investment to important bonds. The same attentiveness can become checking when direct information is unavailable or reassurance fades quickly.",lesson:"Clarity is more durable when it becomes a shared agreement or changed behaviour, not only a moment of relief.",heading:"The repair keeper"},
    "structured-creator":{analogy:"Ideas arrive as loose materials, then your mind reaches for a workbench, a brief and a way to refine what is worth keeping.",knownFor:"You may make complexity tangible: shaping imagination into work that has form, standards and a finish line. Too much open possibility or too little structure can cost more than it appears.",lesson:"A container can protect creativity. ‘Finished enough’ is part of the craft, not a betrayal of quality.",heading:"The form-giver"},
    "independent-collaborator":{analogy:"You work best in a team where everyone shares the destination but each person can still steer their own part of the boat.",knownFor:"You may value meaningful contribution without wanting your method, pace or boundaries absorbed by the group. Clear ownership can make collaboration feel more generous rather than less connected.",lesson:"Independence can be communicated as a coordination need, not a withdrawal from people.",heading:"The self-directed bridge"},
    "persistent-mastery-seeker":{analogy:"You return to the same workbench because the object changes as your skill changes. Progress becomes a source of energy after novelty has gone.",knownFor:"You may build depth through practice, refinement and visible improvement. The risk is carrying a standard beyond the point where it is still serving the work.",lesson:"A sustainable craft has both a quality threshold and a recovery rhythm.",heading:"The long-bench maker"},
    "signal-sensitive-regulator":{analogy:"You have a sensitive mixing desk: fine signals can be informative, but the whole system still needs control over volume, density and recovery.",knownFor:"You may notice subtle changes in body, atmosphere and sensory input that other people miss. Regulation depends on the environment as much as on interpretation.",lesson:"A reaction is data about the whole system, not proof that the loudest story is true.",heading:"The signal reader"}
  };
  return stories[p.id]||{analogy:p.tag,knownFor:"Your profile is a working formulation built from interacting answers, not a permanent category.",lesson:"Keep the useful prediction, then update it when the context changes.",heading:p.name};
}
function guidePatternReadings(signals) {
  const m=signalMap(signals),has=(ids)=>ids.filter(id=>usableSignal(m[id])).length>=2;
  const cards=[];
  if(has(["stimulation","sensory-overload"])) {
    const novelty=guideBand(signals,"stimulation"),load=guideBand(signals,"sensory-overload");
    const both=novelty==="higher"&&load==="higher";
    cards.push({title:both?"Novelty may matter more than noise":"How your system takes in stimulation",why:"Wanting change, challenge or interesting information is not the same as wanting a dense sensory environment. These are separate channels, so they can rise together or point in different directions.",inside:both?"You may be drawn to a new city, difficult project or unfamiliar subject while finding a crowded room, constant notifications or open-plan interruptions exhausting. That is not a contradiction: one system is asking for informational novelty while another is regulating input density.":"Your answers suggest that the reward of stimulation and the cost of sensory density may not move in lockstep. The useful question is which kind of input gives you energy and which simply occupies capacity.",examples:"Travel at a quiet time; a challenging asynchronous course; one intense conversation instead of a crowded party; a predictable workspace with changing problems.",fit:"High-novelty / low-chaos environments, controllable sound and light, and the ability to choose when input arrives.",friction:"Treating all stimulation as one thing can leave you either under-stimulated or flooded.",try:"Change one channel at a time—sound, people, movement, information—then record whether the change altered interest, comfort or both.",question:"What kind of novelty do I want, and what kind of density do I not?"});
  }
  if(has(["intellectual-curiosity","uncertainty-intolerance"])||has(["intellectual-curiosity","decision-deliberation"])) {
    cards.push({title:"Understanding can be both a doorway and a brake",why:"Curiosity pulls attention toward complexity, while uncertainty sensitivity can keep an unresolved outcome active after the useful facts are already available.",inside:"You may experience research as energising at first and protective later. The same habit that helps you notice a hidden variable can become a way of postponing the moment when a good-enough route has to be chosen.",examples:"Comparing courses long after the important differences are clear; drafting several versions before sending; wanting to know the social meaning of a message before replying; learning deeply when a clear question exists.",fit:"Projects with a real question, visible decision points and permission to revise rather than an endless demand for certainty.",friction:"More information is not always more safety. Once new facts stop changing the choice, analysis may be maintaining the feeling of control rather than improving the decision.",try:"Before another search, write one sentence: ‘I would change my choice if I learned ___.’ Stop when that blank can no longer be filled honestly.",question:"What would new evidence actually change?"});
  }
  if(has(["initiation","sustainment"])||has(["persistence","stimulation"])) {
    const start=guideBand(signals,"initiation"),middle=guideBand(signals,"sustainment"),interest=guideBand(signals,"stimulation");
    cards.push({title:"Starting, staying and restarting are different skills",why:"Motivation is not one supply. Beginning a task, continuing once it becomes repetitive and returning after interruption can each ask for different supports.",inside:start==="lower"&&middle==="higher"?"You may need a visible entry ramp even when you can work steadily once engaged.":interest==="higher"&&middle==="lower"?"Novelty may make the first movement easy while the middle loses feedback or meaning.":"Your route through a task may change with interest, clarity, energy and the visibility of progress.",examples:"A two-minute starter step; a milestone that shows the middle; a reset ritual after interruption; a changing brief inside a stable project.",fit:"Work with a clear first move, visible progress and enough variation to keep the task legible without replacing it every time it slows.",friction:"Calling every stall a motivation problem can hide whether the real bottleneck is initiation, sustainment, fatigue, ambiguity or an uninteresting reward.",try:"Name the exact costly moment—opening, returning, repeating or finishing—and design support for that moment only.",question:"Which part of the task is asking for help?"});
  }
  if(has(["sociability","social-boldness"])||has(["sociability","sensory-overload"])) {
    const social=guideBand(signals,"sociability"),bold=guideBand(signals,"social-boldness");
    cards.push({title:"Social appetite and social entry can diverge",why:"Wanting contact, approaching unfamiliar people and tolerating group density are not the same process.",inside:social==="higher"&&bold==="lower"?"You may become more engaged after a conversation has structure, familiarity or a clear invitation. The pause before entry can be a threshold problem rather than lack of interest.":"Your answers suggest that social energy may depend on purpose, people, group size or body state rather than a simple introvert–extrovert line.",examples:"Sending the follow-up message; asking one person a specific question; choosing a small project-based group; leaving recovery space after a socially rich day.",fit:"Relationships and groups with a clear opening, shared purpose and permission for recovery between contacts.",friction:"Other people may wait for visible enthusiasm while you are waiting for evidence that entry is welcome.",try:"Make interest explicit in one low-pressure situation instead of asking your behaviour to communicate everything indirectly.",question:"Is the barrier desire, confidence, energy, sensory density or safety?"});
  }
  if(has(["rel-intimacy","rel-autonomy"])) {
    cards.push({title:"Closeness and independence can be simultaneous needs",why:"Emotional intimacy is not the opposite end of an autonomy scale. A person can want to be deeply known and still need protected time, control over pace or room to think privately.",inside:"The workable question is not ‘Do I want people or space?’ but ‘What rhythm lets contact feel chosen rather than compulsory, and what return point keeps space from becoming distance?’",examples:"A predictable evening together plus protected solo time; explaining that processing time has a return point; sharing the need for reassurance without demanding constant access.",fit:"Partners and friends who communicate directly, honour independent time and reliably return to unfinished conversations.",friction:"Taking space without naming when you will reconnect can be read as rejection; seeking closeness without boundaries can feel like control.",try:"Turn an abstract need into a weekly agreement about contact, space, repair and how changes are signalled.",question:"What would closeness and autonomy look like in actual behaviour?"});
  }
  if(has(["personal-standards","evaluative-perfectionism"])) {
    const standards=guideBand(signals,"personal-standards"),evaluation=guideBand(signals,"evaluative-perfectionism");
    cards.push({title:standards==="higher"&&evaluation==="lower"?"Care about the work, not necessarily the audience":"Quality pressure has more than one source",why:"High standards can come from caring about craft; evaluative concern adds the fear that judgement says something about your worth. They should not be collapsed.",inside:"When the work itself matters more than other people’s reaction, a clear definition of quality can support deep effort. When evaluation is also threatening, the same care can turn into checking, hiding or a moving finish line.",examples:"Defining ‘finished enough’ before writing; separating private revision from public feedback; asking for specific criteria instead of global approval.",fit:"A culture with honest criteria, room to revise and enough autonomy to care about quality without performing certainty.",friction:"A demanding standard can become an avoidance strategy when completion would expose the work to judgement.",try:"For one task, write two separate sentences: ‘good work means…’ and ‘being judged would mean…’. Notice which one is actually driving the delay.",question:"Am I protecting the work, or protecting my identity from evaluation?"});
  }
  if(has(["effortful-control","persistence"])||has(["persistence","learning-persistence"])) {
    cards.push({title:"Effort can be designed instead of moralised",why:"Deliberate steering, endurance and mastery are related but separate. A person can care deeply and still need a better cue, lower friction or visible feedback to continue.",inside:"If persistence is strong, practice may become a reliable source of identity and satisfaction. If effortful control is more variable, the task may need an external scaffold rather than a harsher judgement.",examples:"A start cue beside the work; a short review loop; body-friendly breaks; a visible record of improvement; a partner who shares the next checkpoint rather than policing the whole project.",fit:"Environments where progress is legible and standards can be negotiated with time, energy and access.",friction:"Calling a support need laziness can add shame without adding capacity.",try:"Measure the environment and the task design before measuring your character: sleep, interruption, clarity, reward and recovery all change effort.",question:"What would make the next ten minutes easier to enter?"});
  }
  if(!cards.length)cards.push({title:"Your richest intersections are still emerging",why:"The assessment has separate routes for temperament, relationships, motives, context and choices. When those routes do not yet converge, the most useful interpretation is a question rather than a label.",inside:"A pattern may become clearer when you compare the same response across two contexts, especially after noting energy, sensory load, safety, hunger, fatigue and what the situation required.",examples:"A calm day and a demanding day; familiar people and unfamiliar people; an interesting task and a repetitive task; a reversible decision and a high-cost decision.",fit:"Low-stakes observation with a clear note about what changed.",friction:"A short result can feel less satisfying than a confident type, but it is less likely to teach you something false.",try:"Track one repeated situation for a week and bring the examples back to this map.",question:"Which context would most help me discriminate between two explanations?"});
  return cards.slice(0,6);
}
function renderGuideReadings(signals) {
  return "<div class='pf-reading-grid'>"+guidePatternReadings(signals).map((x,i)=>"<article class='pf-reading-card'><div class='pf-reading-number'>0"+(i+1)+"</div><h3>"+esc(x.title)+"</h3><div class='pf-reading-block'><b>Why this pattern appears</b><p>"+esc(x.why)+"</p></div><div class='pf-reading-block'><b>What it may feel like inside</b><p>"+esc(x.inside)+"</p></div><div class='pf-reading-block'><b>How it can look in ordinary life</b><p>"+esc(x.examples)+"</p></div><div class='pf-reading-columns'><div><b>May suit</b><p>"+esc(x.fit)+"</p></div><div><b>May create friction</b><p>"+esc(x.friction)+"</p></div></div><div class='pf-reading-action'><b>Try this</b><p>"+esc(x.try)+"</p><em>Question: "+esc(x.question)+"</em></div></article>").join("")+"</div>";
}
function guideMisreadings(signals) {
  const items=[];
  const add=(title,outside,under,move)=>items.push({title,outside,under,move});
  if(hasPattern(signals,"sociability","more")&&hasPattern(signals,"social-boldness","less"))add("You may look less interested than you are","A quiet entrance can be read as indifference.","Interest may rise once the setting has a clear opening, familiar person or shared purpose.","Say ‘I am interested; I usually warm up once I know how to enter.’");
  if(hasPattern(signals,"rel-autonomy","more"))add("Your need for space may be mistaken for distance","A pause can look like withdrawal or lack of care.","Independent processing may be how you keep contact chosen and sustainable.","Name the pause and the return point instead of asking others to infer both.");
  if(hasPattern(signals,"intellectual-curiosity","more")||hasPattern(signals,"decision-deliberation","more"))add("Your detailed explanations may be mistaken for argument","Elaboration can sound like resistance when someone wants a short answer.","You may be trying to make the system accurate enough to act inside it.","Lead with the conclusion, then ask whether the other person wants the reasoning.");
  if(hasPattern(signals,"adaptability","more"))add("Your willingness to revise may be mistaken for uncertainty","Changing the route can look like a lack of conviction.","Flexibility may be a way of responding to new evidence rather than abandoning values.","State what is stable—the value or objective—and what is still allowed to change.");
  if(hasPattern(signals,"compassion","more")&&hasPattern(signals,"tact","less"))add("Directness may sound harsher than your intent","A clear message can hide the care underneath it.","Concern and delivery are separate systems; one does not automatically prove the other.","Name the respect or care first, then make the request specific.");
  if(hasPattern(signals,"personal-standards","more"))add("Care can look like delay","A moving finish line can be mistaken for not starting or not caring.","The standard may be protecting meaning, quality or identity rather than avoiding the work itself.","Define the threshold before you begin and let revision happen after completion.");
  if(!items.length)add("Context can be more visible than intention","Other people see the timing and behaviour before they see the reason.","The assessment cannot know what anyone else thinks, but it can give you language for checking rather than guessing.","Ask one trusted person what they noticed, what they assumed and what information would have helped.");
  return "<div class='pf-misread-redesign'>"+items.slice(0,6).map(x=>"<article><div class='pf-misread-label'>OUTSIDE → INSIDE</div><h3>"+esc(x.title)+"</h3><p><b>What someone may see:</b> "+esc(x.outside)+"</p><p><b>What may be happening:</b> "+esc(x.under)+"</p><p class='pf-misread-move'><b>Make it easier to read:</b> "+esc(x.move)+"</p></article>").join("")+"</div>";
}
function guideRelationshipBlueprint(signals) {
  const intimacy=guideBand(signals,"rel-intimacy"),autonomy=guideBand(signals,"rel-autonomy"),anxiety=guideBand(signals,"attachment-anxiety"),reassurance=guideBand(signals,"rel-reassurance"),repair=guideBand(signals,"rel-repair");
  const needs=[];
  if(intimacy==="higher")needs.push("emotional availability that feels mutual");
  if(autonomy==="higher")needs.push("protected independent time");
  if(anxiety==="higher"||reassurance==="higher")needs.push("clear signals when plans or feelings change");
  if(repair==="higher")needs.push("accountability followed by changed behaviour");
  if(!needs.length)needs.push("explicit agreements about closeness, space, timing and repair");
  const partner=["communicates changes directly","can give reassurance without making it a control system","respects independent time and returns after taking space","can discuss disagreement without turning disagreement into a verdict","enjoys both reliable rhythms and occasional novelty"];
  const needFromYou=["say when you need processing time instead of assuming it is obvious","state whether you want listening, practical help or reassurance","name dissatisfaction before it becomes accumulated resentment","let repair include action as well as explanation"];
  const cycle=(anxiety==="higher"||reassurance==="higher")?[["Ambiguous signal","small changes receive extra attention"],["More monitoring","the mind searches for the missing meaning"],["Question or reassurance","clarity brings short-term relief"],["Shared agreement","a return point or changed behaviour can end the loop"]]:[["Signal changes","notice what happened without guessing motive"],["Name the need","ask for information, space or repair"],["Agree the next point","make timing and responsibility explicit"],["Return and update","let behaviour—not only relief—teach the system"]];
  return "<div class='pf-relationship-layout'><div class='pf-partner-portrait'><img src='personality-map.png' alt='' aria-hidden='true'><span class='pf-label'>A relationship-fit portrait</span><h3>Your dream partner, translated into conditions</h3><p>Not a soulmate calculation. This is a set of conditions that may make closeness easier for the person you are becoming.</p><ul>"+partner.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul></div><div class='pf-relationship-panels'><article><span class='pf-label'>What may help you feel close</span><p>"+esc(needs.join("; "))+".</p><p class='pf-relationship-education'>Closeness and autonomy are not opposite ends of one scale. They can be negotiated as a rhythm.</p></article><article><span class='pf-label'>What they may need from you</span><ul>"+needFromYou.map(x=>"<li>"+esc(x)+".</li>").join("")+"</ul></article></div></div><div class='pf-cycle-flow'>"+cycle.map((x,i)=>"<div class='pf-cycle-node'><span>0"+(i+1)+"</span><b>"+esc(x[0])+"</b><small>"+esc(x[1])+"</small></div>").join("<i aria-hidden='true'>→</i>")+"</div><p class='pf-guide-callout'><b>Watch the loop:</b> The useful question is whether a conversation produces new information, a clearer boundary or changed behaviour. If it only lowers uncertainty briefly, the system may need a shared repair plan rather than another round of checking.</p>";
}
function guideWorkWorlds(signals) {
  const picks=selectedWork(),m=signalMap(signals),picked=(id)=>picks.find(w=>w.id===id)?.value>=3,lean=(id)=>!!m[id]&&m[id].direction==="more";
  const worlds=[
    {title:"Applied problem-solving",fit:[picked("work-variety"),picked("work-hands"),picked("work-impact"),lean("adaptability")],why:"Changing problems, visible results and feedback that arrives through doing.",jobs:"field research · technical operations · clinical support · events production · repair or horticulture",love:"You can see what the work changed and learn by contact with the problem.",friction:"Routine administration or unclear ownership may drain the same energy that makes practical work satisfying.",question:"How much of the week is genuinely new problem-solving versus maintenance?"},
    {title:"Independent complexity inside structure",fit:[picked("work-autonomy"),picked("work-challenge"),picked("work-independent"),lean("intellectual-curiosity"),lean("decision-deliberation")],why:"A meaningful question, room over the route and enough structure to know when the work is finished.",jobs:"research · policy analysis · UX or product research · investigative writing · technical or archival work",love:"You can turn difficult questions into maps, explanations or decisions.",friction:"Open-ended work can become an endless research surface without a stopping rule.",question:"What information would change the decision, and who owns the stopping point?"},
    {title:"Creative craft with room to refine",fit:[picked("work-creative"),lean("imagination"),lean("aesthetic-sensitivity"),lean("thoroughness"),lean("personal-standards")],why:"Ideas become tangible through form, iteration and a brief that protects rather than limits creativity.",jobs:"writing · illustration · music production · service or exhibition design · content and experience design",love:"Visible craft lets imagination meet standards without asking you to improvise everything at once.",friction:"Quality can become a moving finish line if sharing is treated as a judgement of the whole self.",question:"What does finished enough mean before the first draft exists?"},
    {title:"People-centred work with repair and purpose",fit:[picked("work-social"),picked("work-helping"),picked("work-impact"),lean("compassion"),lean("rel-repair")],why:"Meaningful contact, reciprocity and a visible contribution with boundaries around recovery.",jobs:"teaching · facilitation · community support · advocacy · wellbeing education · mission-led coordination",love:"People can feel the usefulness of your attention and the work has a human reason to exist.",friction:"Care can turn into over-responsibility when the role has no clear boundary.",question:"How are support, safeguarding and recovery responsibilities shared?"},
    {title:"Self-directed collaboration",fit:[picked("work-autonomy"),picked("work-collaboration"),lean("rel-autonomy"),lean("sociability"),lean("agency")],why:"Shared purpose with explicit ownership, trust and room to choose how your contribution is made.",jobs:"project coordination · product teams · studio work · partnerships · community building",love:"Independence and connection reinforce each other when responsibilities are legible.",friction:"Too much consensus or invisible social work can make contribution feel harder to locate.",question:"Who owns the outcome, who decides the method and how is disagreement repaired?"}
  ];
  const ranked=worlds.map(x=>Object.assign({},x,{score:x.fit.filter(Boolean).length})).sort((a,b)=>b.score-a.score);
  return "<div class='pf-work-world-grid'>"+ranked.slice(0,4).map((x,i)=>"<article class='pf-work-world'><div class='pf-work-rank'>0"+(i+1)+"<span>"+(x.score>=3?"stronger match":"worth testing")+"</span></div><h3>"+esc(x.title)+"</h3><p class='pf-work-why'>"+esc(x.why)+"</p><p><b>Investigate:</b> "+esc(x.jobs)+".</p><div class='pf-work-split'><p><b>You might love</b><br>"+esc(x.love)+"</p><p><b>Watch for</b><br>"+esc(x.friction)+"</p></div><p class='pf-interview-question'>Ask in an interview: “"+esc(x.question)+"”</p></article>").join("")+"</div><div class='pf-work-test'><h3>Low-cost career experiments</h3><ol><li>Shadow or interview someone in one environment for an hour.</li><li>Recreate the central condition in a volunteer, freelance or personal project.</li><li>Afterwards, record energy, interest, recovery cost, support and what you would change—not only whether you liked it.</li></ol><p>These are environments to investigate, not destiny, ability claims or income forecasts.</p></div>";
}
function guideInterests(signals) {
  const m=signalMap(signals),has=(id)=>usableSignal(m[id]),groups=[
    {title:"Hands + mind",ok:has("imagination")||has("work-hands")||has("intellectual-curiosity"),text:"Cooking complex recipes, woodworking, electronics, restoration, gardening, photography, model-building or experimental art.",why:"They combine concrete feedback with a problem that can be explored and refined."},
    {title:"Novelty with a controllable environment",ok:has("stimulation")||has("adaptability"),text:"Quiet-time travel, museums, new walking routes, geocaching, unusual courses, escape rooms or trying a new cuisine with a clear exit.",why:"They offer expansion without requiring maximum social or sensory density."},
    {title:"Deep social activities",ok:has("rel-intimacy")||has("communion")||has("work-collaboration"),text:"Tabletop games, small discussion groups, volunteering, book groups, collaborative making, choirs or project-based communities.",why:"A shared purpose can make connection easier than unstructured social performance."},
    {title:"Quiet mastery",ok:has("persistence")||has("learning-persistence")||has("personal-standards"),text:"Strength training, language practice, coding projects, music practice, collecting and cataloguing, long-form reading or a craft with visible milestones.",why:"Progress can keep repetition alive when novelty is no longer doing all the motivating work."},
    {title:"Meaning and expression",ok:has("aesthetic-sensitivity")||has("compassion")||has("identity-exploration"),text:"Personal essays, documentary photography, community storytelling, design for a cause, mentoring or building a small public resource.",why:"The activity gives inner themes an external form that other people can use."}
  ];
  const shown=groups.filter(x=>x.ok).length?groups.filter(x=>x.ok):groups.slice(0,4);
  return "<div class='pf-interest-grid'>"+shown.slice(0,5).map(x=>"<article><span class='pf-label'>TRY A TEXTURE</span><h3>"+esc(x.title)+"</h3><p>"+esc(x.text)+"</p><small>Why it may fit: "+esc(x.why)+"</small></article>").join("")+"</div><div class='pf-interest-callout'><b>Something you may assume you would not like:</b> choose one activity from a different row and change its context—smaller group, quieter time, clearer brief, shorter trial or more control. A preference is not a prohibition.</div>";
}
function guidePlaceProfile(signals) {
  const m=signalMap(signals),social=guideBand(signals,"sociability"),overload=guideBand(signals,"sensory-overload"),stimulation=guideBand(signals,"stimulation"),autonomy=guideBand(signals,"rel-autonomy");
  const summary=stimulation==="higher"&&overload==="higher"?"You may thrive with access to cultural or informational novelty, paired with easy routes into quiet, lower-density recovery.":social==="higher"&&autonomy==="higher"?"You may want a place with people and possibility nearby, while still protecting privacy, control and a reliable home base.":overload==="higher"?"A place may suit you better when you can reduce density, noise and interruptions without losing access to the people or activities that matter.":"Your place fit is still best explored through conditions rather than a city label.";
  const dimensions=[
    ["Pace","slow ↔ fast",m.stimulation],
    ["Social density","private ↔ connected",m.sociability],
    ["Sensory density","calm ↔ intense",m["sensory-overload"]],
    ["Freedom of movement","rooted ↔ changeable",m["rel-autonomy"]],
    ["Nature access","enclosed ↔ open",m["work-hands"]],
    ["Cultural novelty","familiar ↔ exploratory",m.stimulation]
  ];
  return "<div class='pf-place-intro'><h3>"+esc(summary)+"</h3><p>Personality cannot choose a postcode for you. Budget, work, climate, safety, access and relationships matter. This is an environment profile to compare with real-world information later.</p></div><div class='pf-place-grid'>"+dimensions.map(x=>"<div class='pf-place-axis'><b>"+esc(x[0])+"</b><span>"+esc(x[1])+"</span><div class='pf-axis-line'><i style='left:"+guidePosition(x[2])+"%'></i></div></div>").join("")+"</div><div class='pf-place-cards'><article><h3>Compact creative city</h3><p>Many ideas, people and routes in a small radius, with parks or quiet rooms close enough for recovery.</p></article><article><h3>Connected town with a private edge</h3><p>Recurring community, familiar faces and enough space to choose when you are available.</p></article><article><h3>Basecamp near movement</h3><p>A stable home environment with easy access to occasional novelty rather than constant stimulation.</p></article></div>";
}
function guideMotivation(signals) {
  const values=motifValues().filter(x=>typeof x.strength==="number").sort((a,b)=>b.strength-a.strength),top=values.slice(0,5),active=values.filter(x=>x.strength>=3&&typeof x.frequency==="number"&&x.frequency>=3),gaps=values.filter(x=>x.strength>=3&&(!Number.isFinite(x.frequency)||x.frequency<3));
  const blockers=[];
  if(guideBand(signals,"initiation")==="lower")blockers.push("entry friction");
  if(guideBand(signals,"sustainment")==="lower")blockers.push("middle-of-task drift");
  if(guideBand(signals,"uncertainty-intolerance")==="higher")blockers.push("uncertainty before commitment");
  if(guideBand(signals,"evaluative-perfectionism")==="higher")blockers.push("evaluation pressure");
  if(!blockers.length)blockers.push("a mismatch between the task design and the reward it offers");
  return "<div class='pf-motivation-layout'><div class='pf-motive-visual'><h3>What pulls effort</h3>"+(top.length?top.map(x=>guideMeter(x.title,x.strength,x.description)).join(""):"<p>No motive ratings were completed.</p>")+"</div><div class='pf-motivation-reading'><h3>Strength is not enactment</h3><p>"+esc(motiveEnactmentText())+"</p><p>The most useful distinction is between what matters, what is currently possible and what your environment rewards. A gap is information about access, time, support or competing needs—not proof that the motive is false.</p><h3>Where momentum may stall</h3><p>Your likely bottlenecks in this session are <b>"+esc(blockers.join(", "))+"</b>. Name the bottleneck before choosing a motivation strategy.</p><ul><li>If the problem is entry, make the first step visible and tiny.</li><li>If the problem is repetition, add feedback, milestones or a meaningful change of texture.</li><li>If the problem is evaluation, define quality privately before inviting judgement.</li><li>If the problem is uncertainty, set a stopping rule rather than demanding emotional certainty.</li></ul></div></div><div class='pf-motivation-footer'><b>Two experiments:</b> compare one task with a visible progress signal and one with an external deadline. Notice which changes energy, not only completion.</div>";
}
function guideDecision(signals) {
  const careful=guideBand(signals,"decision-deliberation")==="higher"||guideBand(signals,"uncertainty-intolerance")==="higher",reopen=guideBand(signals,"decision-reopening")==="higher",intuition=guideBand(signals,"decision-intuition")==="higher";
  const classes=[
    ["Reversible choices","Choose a small experiment quickly, then review what you learned. Do not spend irreversible-decision energy on a choice you can undo.","restaurant, route, short course, first draft"],
    ["High-cost or irreversible choices",careful?"Gather the information that could change the choice, name the risks you can accept and decide when enough is enough.":"Give the decision a clear evidence threshold and a second perspective before committing.","job, car, move, major financial commitment"],
    ["Emotionally loaded choices","Separate feeling, meaning and action. Draft the message or plan, but create a delay before the action if urgency is doing the steering.","angry message, ending contact, responding to criticism"],
    ["Relationship decisions","Ask the person who holds the missing information. Private analysis cannot substitute for a conversation about timing, need, boundary or repair.","clarifying a change, asking for reassurance, making a repair"],
    ["Unknowable outcomes",reopen?"Choose a stopping rule and a review date. Reopening can be useful when new evidence exists; otherwise it may only re-run regret.":"Accept a remainder of uncertainty and invest in the next action you can observe.","career direction, identity, whether someone will respond well"]
  ];
  const style=intuition&&careful?"You may use both felt direction and deliberate analysis. The skill is not choosing one forever; it is deciding when each channel gets a turn.":careful?"You may prefer to build enough structure before committing. This can protect judgement, but it needs a stopping rule so information remains a tool rather than an endless safety behaviour.":"Your decision map is more context-sensitive than a single ‘analytical’ or ‘intuitive’ label. Let the class of decision choose the process.";
  return "<div class='pf-decision-intro'><h3>"+esc(style)+"</h3><p>"+(reopen?"Because revisiting may remain active after commitment, write down the reason for the choice and the date you are allowed to review it.":"A decision is easier to steer when you name the cost of waiting as well as the cost of acting.")+"</p></div><div class='pf-decision-flow'>"+classes.map((x,i)=>"<article><span>0"+(i+1)+"</span><h3>"+esc(x[0])+"</h3><p>"+esc(x[1])+"</p><small>Examples: "+esc(x[2]) +"</small></article>").join("")+"</div>";
}
function guideMoney(signals) {
  const security=guideBand(signals,"money-security"),scarcity=guideBand(signals,"money-scarcity"),impulse=guideBand(signals,"money-impulsivity"),status=guideBand(signals,"money-status");
  const meaning=security==="higher"&&impulse==="higher"?"Money may carry two jobs at once: protecting future options and providing immediate relief, pleasure or novelty.":status==="higher"?"Money may partly function as visible evidence of progress or standing, which can change how risk and comparison feel.":security==="higher"?"Money appears more connected to safety, freedom and the ability to handle future demands than to display.":"Your money meaning is still open; use the scenarios as prompts rather than a personality label.";
  const traps=[];
  if(scarcity==="higher")traps.push("scarcity vigilance can make every purchase feel like a referendum on safety");
  if(impulse==="higher")traps.push("reward spikes can move faster when tired, stressed or excited");
  if(guideBand(signals,"uncertainty-intolerance")==="higher")traps.push("keeping options open can delay a clear financial review");
  if(!traps.length)traps.push("a system that is too complicated to revisit consistently");
  const systems=[];
  systems.push("Separate freedom money, security money and ordinary spending so every purchase does not compete with the whole future.");
  if(impulse==="higher")systems.push("Create a small guilt-free exploration budget rather than expecting total suppression of wants.");
  if(scarcity==="higher")systems.push("Use a short weekly numbers ritual with a defined end point; information should restore agency, not become a new threat.");
  return "<div class='pf-money-layout'><div class='pf-money-river'><div class='pf-river-source'><span>WHAT MONEY MAY REPRESENT</span><b>"+esc(meaning)+"</b></div><div class='pf-river-track'><i></i><i></i><i></i></div><div class='pf-river-labels'><span>security</span><span>optionality</span><span>pleasure</span></div></div><div class='pf-money-reading'><h3>Likely traps to watch</h3><ul>"+traps.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul><h3>Systems worth testing</h3><ul>"+systems.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul></div></div><p class='pf-guide-callout'>This is an exploratory money psychology guide, not financial advice. Income, debt, safety, access, financial knowledge and material constraints were not measured.</p>";
}
function guideRegulation(signals) {
  const m=signalMap(signals),overload=guideBand(signals,"sensory-overload")==="higher",loop=guideBand(signals,"rumination")==="higher"||guideBand(signals,"uncertainty-intolerance")==="higher",urgency=guideBand(signals,"negative-urgency")==="higher"||guideBand(signals,"positive-urgency")==="higher";
  const states=[
    ["When overloaded",overload?"Lower input before trying to reason through the whole emotion. Quieter room, headphones, dimmer light, movement or a short solitary walk may restore choice.":"Check body load and the sensory environment before assuming the reaction is only about the story."],
    ["When mentally looping",loop?"Externalise the unresolved question, name what is knowable now, schedule a review and shift to a sensory or physical activity once no new information is appearing.":"Ask whether another thought would produce new evidence or only repeat the same route."],
    ["When emotion accelerates action",urgency?"Draft but do not send, walk before responding, put the purchase in a basket overnight or tell someone you need a short return point.":"Give strong feeling a seat at the table without letting it sign an irreversible contract."],
    ["When the problem can change", "Choose one influenceable action small enough to begin, then reassess the facts rather than trying to solve the entire future."],
    ["When the problem cannot change yet", "Use acceptance, grounding, distraction or connection as ways of carrying the moment; not every painful situation is asking you to fix it today."]
  ];
  const strategy=typeof answers["reg-flex-controllable-high"]==="string"?REGULATION_SCENARIOS.find(s=>s.id==="reg-flex-controllable-high")?.options[Number(answers["reg-flex-controllable-high"])]||"a context-matched strategy":"a context-matched strategy";
  return "<div class='pf-regulation-state-grid'>"+states.map(x=>"<article><span class='pf-label'>STATE TOOL</span><h3>"+esc(x[0])+"</h3><p>"+esc(x[1])+"</p></article>").join("")+"</div><div class='pf-regulation-bridge'><b>Your condition-switching clue:</b> In the high-intensity controllable scenario, you selected “"+esc(strategy)+"”. The value of a strategy depends on the facts, not on whether it sounds emotionally impressive.</div><p class='pf-small-note'>A strategy can protect you in one setting and cost you in another. Use the question: what can change, what needs care, what does my body need and what value should lead?</p>";
}
function guideMovement(signals) {
  const m=signalMap(signals),stimulation=guideBand(signals,"stimulation"),social=guideBand(signals,"sociability"),mastery=guideBand(signals,"persistence"),overload=guideBand(signals,"sensory-overload");
  const rows=[];
  if(stimulation==="higher"||social==="higher")rows.push(["High stimulation + social","racket sports, climbing groups, martial arts, team sports, dance or classes with a visible shared pulse","energy and novelty are part of the reward"]);
  if(mastery==="higher"||guideBand(signals,"learning-persistence")==="higher")rows.push(["Independent mastery","strength training, swimming plans, running, bouldering, skill-based calisthenics or a measurable craft","progress and practice can make repetition meaningful"]);
  if(overload==="higher"||guideBand(signals,"self-soothing")==="higher")rows.push(["Low-input regulation","walking, swimming, hiking, mobility, gentle yoga or repetitive movement with chosen sound","the body gets a lower-density route back to choice"]);
  rows.push(["Novelty without a fixed identity","rotating classes, trail walks, geocaching, recreational leagues or short skill cycles","you can vary the texture without abandoning movement entirely"]);
  return "<div class='pf-movement-grid'>"+rows.slice(0,4).map(x=>"<article><span class='pf-label'>MOVEMENT FIT</span><h3>"+esc(x[0])+"</h3><p>"+esc(x[1])+".</p><small>Why it may fit: "+esc(x[2])+".</small></article>").join("")+"</div><p class='pf-guide-callout'>The best movement is safe for your body and repeatable enough to enjoy. Personality can suggest a texture; it cannot replace medical advice, access needs or actual enjoyment.</p>";
}
function guideLifeLesson(profile,signals) {
  const m=signalMap(signals),p=profile.primary;
  let question="How much certainty do I actually need before I move?",healthy="Curiosity and structure work together: you enter complexity without oversimplifying it or waiting for a guarantee.",overloaded="Curiosity scatters, checking becomes certainty-seeking and the map becomes more important than the journey.";
  if(p?.id==="relationally-vigilant-connector"||guideBand(signals,"rel-intimacy")==="higher"&&guideBand(signals,"rel-autonomy")==="higher"){question="How do I remain close without disappearing into other people’s needs?";healthy="Closeness is negotiated through explicit rhythm, mutual repair and room for each person to remain a person.";overloaded="Monitoring becomes proof-seeking, space becomes rejection and reassurance must be repeated because no shared agreement has changed.";}
  else if(p?.id==="structured-creator"||guideBand(signals,"personal-standards")==="higher"){question="How do I build enough structure to finish without making structure so rigid that I stop exploring?";healthy="A brief, milestones and a finish line protect creative freedom instead of replacing it.";overloaded="Standards become a moving threshold, planning replaces making and the work stays private to avoid judgement.";}
  else if(p?.id==="adaptive-initiator"){question="How do I keep movement alive while allowing a route to become a commitment?";healthy="You keep the route responsive while giving the middle enough novelty, feedback and meaning to continue.";overloaded="Every dip in novelty looks like evidence that the route is wrong, so starting again replaces learning from the middle.";}
  return "<div class='pf-life-lesson'><div class='pf-lesson-question'><span>THE QUESTION</span><h3>"+esc(question)+"</h3></div><div class='pf-lesson-columns'><article><b>Healthier coordination may look like</b><p>"+esc(healthy)+"</p></article><article><b>Under overload, the same system may become</b><p>"+esc(overloaded)+"</p></article></div><p class='pf-guide-callout'><b>Growth is not becoming a different person.</b> It may mean keeping the useful mechanism while becoming more selective about when it is necessary.</p></div>";
}
function guideUserManual(profile,signals) {
  const m=signalMap(signals),rules=profileReadFor(profile,signals).rules.slice(0,6);
  const work=hasPattern(signals,"decision-deliberation","more")?"Give me the objective and room over the route.":"Tell me the objective, timing and what is allowed to change.";
  const love=guideBand(signals,"rel-autonomy")==="higher"?"Closeness works better when independent time is named rather than treated as a hidden test.":"Tell me what matters and what kind of contact would feel supportive.";
  const stress=guideBand(signals,"sensory-overload")==="higher"?"Reduce input before asking me to explain the whole emotion.":"Ask whether I want listening, practical help or a short pause before offering solutions.";
  return "<div class='pf-user-manual-grid'><article><span>HOW TO WORK WITH ME</span><p>"+esc(work)+"</p><p>Be specific when something changes. Detailed questions may be an attempt to coordinate accurately.</p></article><article><span>HOW TO LOVE ME</span><p>"+esc(love)+"</p><p>Make repair visible: return to the conversation and let changed behaviour carry some of the reassurance.</p></article><article><span>HOW TO HELP WHEN I’M STRESSED</span><p>"+esc(stress)+"</p><p>Check body state, sensory load, uncertainty and the next small choice before making a global interpretation.</p></article><article><span>WHAT USUALLY DOESN’T HELP</span><p>Turning a context-dependent response into a character verdict, demanding certainty before action or assuming silence explains itself.</p></article></div><div class='pf-pocket-rules'><h3>My pocket playbook</h3><ol>"+rules.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ol></div>";
}
function renderGuideMethodDrawer(signals) {
  return "<details class='pf-method-drawer' id='pf-method'><summary>How this guide was calculated</summary><div class='pf-method-body'><p>The readable guide is an interpretation layer over separate answer types. Repeated candidate items are only described directionally when they converge; direct preferences, motives, values, scenarios and the current-state snapshot remain separate. A profile title requires supported core signals, a dominance margin over the runner-up and enough evidence to make the pattern worth using. If those conditions fail, the guide leaves the map open.</p>"+renderEvidenceExplorer(signals)+"</div></details>";
}
function renderReportNavigation() {
  const links=[["pf-archetype","Profile"],["pf-overview","90 seconds"],["pf-portrait","Portrait"],["pf-patterns","Patterns"],["pf-misunderstandings","Misreadings"],["pf-relationships","Relationships"],["pf-work","Work"],["pf-interests","Interests"],["pf-place","Place"],["pf-motivation","Motivation"],["pf-decisions","Decisions"],["pf-money","Money"],["pf-regulation","Regulation"],["pf-movement","Movement"],["pf-life","Life lesson"],["pf-playbook","Playbook"]];
  return "<nav class='pf-report-nav' aria-label='Profile sections'>"+links.map(x=>"<a href='#"+esc(x[0])+"'>"+esc(x[1])+"</a>").join("")+"</nav>";
}

function renderEvidenceExplorer(signals) {
  const groups=["All","temperament","dispositions","relationships","regulation","motives","identity","domains","decisions","snapshot","measured","preliminary","direct","scenario","state","insufficient"];
  const cards=signals.map((s,i)=>{
    const kind=evidenceForSignal(s),d=s.dimension;
    return "<article class='pf-evidence-card' data-evidence-group='"+esc(d.group)+"' data-evidence-kind='"+esc(kind)+"'><div class='pf-evidence-card-top'>"+badge(kind,true)+"<span>"+esc(patternLabel(s))+"</span></div><h3>"+esc(d.title)+"</h3><p>"+esc(d.definition)+"</p><p><b>Your estimate:</b> "+esc(signalDescription(s))+"</p><p><b>What it does not establish:</b> This does not establish a cause, diagnosis, ability, intention or pattern outside the situations you answered.</p><p><b>Possible friction:</b> "+esc(d.friction||"No specific friction description is available.")+"</p><small>"+s.count+" of "+s.total+" candidate items answered"+(typeof s.mean==="number"?" · mean "+s.mean.toFixed(2)+"/6":"")+" · "+esc(s.confidence)+"</small></article>";
  }).join("");
  const directSteps=[...RELATIONSHIP_PREFERENCES,...COMMUNICATION_PREFERENCES,...LEARNING_PREFERENCES,...WORK_PREFERENCES,...MONEY_RISK_SCENARIOS,...MONEY_DELAY_SCENARIOS];
  const direct=directSteps.map(s=>{const v=answers[s.id];if(v===undefined||v===null)return "";let choice=typeof v==="number"?(s.type==="B7"?(v<0?s.left:v>0?s.right:"Depends"):nLabel(v,I5)):s.options?.[Number(v)]||String(v);return "<article class='pf-evidence-card' data-evidence-group='direct' data-evidence-kind='direct'><div class='pf-evidence-card-top'>"+badge("direct",true)+"</div><h3>"+esc(s.title)+"</h3><p>"+esc(choice)+"</p><small>Explicit preference or trade-off response · not an ability or outcome.</small></article>";}).filter(Boolean).join("");
  const scenarioSteps=[...SCENARIOS,...REGULATION_SCENARIOS];
  const scenarios=scenarioSteps.map(s=>{const v=answers[s.id];if(v===undefined||v===null)return "";let choice=v&&v.first!==undefined?s.choices?.[Number(v.first)]:s.options?.[Number(v)];return "<article class='pf-evidence-card' data-evidence-group='scenario' data-evidence-kind='scenario'><div class='pf-evidence-card-top'>"+badge("scenario",true)+"</div><h3>"+esc(s.title)+"</h3><p>"+esc(choice||"Not answered")+"</p><small>Hypothetical scenario response · not evidence of what happened in real life.</small></article>";}).filter(Boolean).join("");
  return "<section class='pf-report-section pf-evidence-explorer' id='pf-evidence'><p class='eyebrow'>Appendix · evidence explorer</p><h2>Every route, with its limits</h2><p class='pf-section-lead'>The detailed scale database is kept as an appendix rather than the main story. Filter by life area or evidence class; connected constructs may overlap and require future validation before they are treated as separate latent dimensions.</p><div class='pf-evidence-filters'>"+groups.map((g,i)=>"<button type='button' class='button secondary pf-evidence-filter"+(i===0?" is-active":"")+"' data-evidence-filter='"+esc(g)+"'>"+esc(g==="All"?g:g[0].toUpperCase()+g.slice(1))+"</button>").join("")+"</div><div class='pf-evidence-grid'>"+cards+direct+scenarios+"</div><p class='pf-small-note'>●● supported pattern · ● preliminary signal · ○ direct answer · ◆ scenario evidence · ◇ current state · ▲ derived interpretation · △ hypothesis · ? insufficient evidence.</p></section>";
}
function feedbackBlock(id,label) {
  return "<div class='pf-collab-feedback' data-feedback-id='"+esc(id)+"'><b>Does this fit your experience?</b><div class='pf-feedback-options'>"+["Very strongly","Mostly","Partly","Not really","The opposite is closer","Not enough experience"].map(v=>"<button type='button' class='pf-feedback-button' data-pf-feedback='"+esc(v)+"'>"+esc(v)+"</button>").join("")+"</div><label>What would you refine? <textarea data-pf-feedback-note placeholder='Optional: context, exception or correction'></textarea></label><small aria-live='polite'></small></div>";
}
function attachCollaborativeFeedback(root) {
  root.querySelectorAll("[data-feedback-id]").forEach(box=>{
    const id=box.dataset.feedbackId;
    box.querySelectorAll("[data-pf-feedback]").forEach(btn=>btn.addEventListener("click",()=>{
      box.querySelectorAll("[data-pf-feedback]").forEach(x=>x.classList.toggle("is-selected",x===btn));
      const note=box.querySelector("[data-pf-feedback-note]")?.value||"";
      try { const all=JSON.parse(localStorage.getItem("nobodys-simple-profile-feedback-v1")||"{}"); all[id]={choice:btn.dataset.pfFeedback,note,date:new Date().toISOString()}; localStorage.setItem("nobodys-simple-profile-feedback-v1",JSON.stringify(all)); } catch {}
      const status=box.querySelector("small"); if(status)status.textContent="Saved privately on this device. It does not change your answers.";
    }));
    const note=box.querySelector("[data-pf-feedback-note]");
    if(note)note.addEventListener("change",()=>{try{const all=JSON.parse(localStorage.getItem("nobodys-simple-profile-feedback-v1")||"{}");all[id]=Object.assign({},all[id],{note:note.value,date:new Date().toISOString()});localStorage.setItem("nobodys-simple-profile-feedback-v1",JSON.stringify(all));}catch{}});
  });
}
function attachEvidenceFilters(root) {
  const cards=[...root.querySelectorAll(".pf-evidence-card")];
  root.querySelectorAll("[data-evidence-filter]").forEach(button=>button.addEventListener("click",()=>{
    const filter=button.dataset.evidenceFilter.toLowerCase();
    root.querySelectorAll("[data-evidence-filter]").forEach(x=>x.classList.toggle("is-active",x===button));
    cards.forEach(card=>{const show=filter==="all"||card.dataset.evidenceGroup===filter||card.dataset.evidenceKind===filter;card.hidden=!show;});
  }));
}

function guideChapter(id,number,eyebrow,title,lead,body,tone) {
  return "<section class='pf-guide-chapter pf-guide-"+esc(tone||"paper")+"' id='"+esc(id)+"'><div class='pf-chapter-marker'><span>"+esc(number)+"</span><small>"+esc(eyebrow)+"</small></div><h2>"+esc(title)+"</h2>"+(lead?"<p class='pf-guide-lead'>"+esc(lead)+"</p>":"")+body+"</section>";
}
function renderResult(root) {
  const signals=allSignals(),profile=profileSelectionFor(signals),read=profileReadFor(profile,signals),story=guideProfileStory(profile,signals),headline=profile.primary?.name||"Open Map — evidence still forming";
  const primary=profile.primary;
  const oneMinute=oneMinuteSynthesis(signals);
  const filtered=signals.filter(s=>s.dimension.group==="temperament"||s.dimension.group==="dispositions");
  const portraitCards=read.mechanisms.map(x=>"<article class='pf-portrait-card'><span class='pf-label'>"+esc(x.title)+"</span><p>"+esc(x.text)+"</p></article>").join("");
  const axis=guideAxis(signals,"sociability","Social energy","selective / private","contact-seeking")+guideAxis(signals,"stimulation","Novelty appetite","familiar / steady","exploratory / changing")+guideAxis(signals,"rel-intimacy","Closeness","protected / light","deep / mutual")+guideAxis(signals,"sensory-overload","Input load","lower density","higher density");
  root.innerHTML=[
    "<div class='wrap pf-result-wrap pf-guide-wrap'><header class='pf-guide-hero'><div class='pf-guide-hero-art'><div class='pf-orbit pf-orbit-one'></div><div class='pf-orbit pf-orbit-two'></div><img class='pf-result-character' src='personality-map.png' alt='The Nobody’s Simple map character'></div><div class='pf-guide-hero-copy'><p class='eyebrow'>Nobody’s Simple · Personal Psychological Guide · Public edition 1.4</p><p class='pf-title-label'>Your working profile</p><h1>"+esc(headline)+"</h1><p class='pf-archetype-tagline'>"+esc(primary?.tag||"The map is deliberately open: several explanations remain more honest than one confident type.")+"</p><div class='pf-guide-status'><span class='pf-profile-confidence pf-confidence-"+esc(profile.confidence.level)+"'><b>"+esc(profile.confidence.label)+"</b><small>"+esc(profile.confidence.note)+"</small></span><span class='pf-guide-mode'>"+esc(profile.mode)+"</span>"+(profile.secondary?"<span class='pf-guide-mode'>Close second · "+esc(profile.secondary.name)+"</span>":"")+"</div></div><div class='pf-guide-hero-story'><span class='pf-label'>A memory hook, not a diagnosis</span><h3>"+esc(story.heading)+"</h3><p>"+esc(story.analogy)+"</p><p><b>Central lesson:</b> "+esc(story.lesson)+"</p></div><div class='pf-guide-hero-known'><span class='pf-label'>What this configuration may be known for</span><p>"+esc(story.knownFor)+"</p></div></header>",
    renderReportNavigation(),
    "<main id='pf-report-content'>",
    guideChapter("pf-overview","01","Know me first","Your profile in 90 seconds","Five usable ideas before the deeper chapters.","<div class='pf-90-grid'>"+read.quick.map(x=>"<article><span class='pf-label'>"+esc(x.label)+"</span><p>"+esc(x.text)+"</p></article>").join("")+"</div><div class='pf-90-callout'><b>What to carry into the rest of the guide:</b> "+esc(read.rules[0])+"</div><div class='pf-90-grid pf-90-second'>"+oneMinute.cards.map(x=>x).join("")+"</div>","sunrise"),
    guideChapter("pf-portrait","02","Understand me","Your psychological portrait","The questionnaire is hidden underneath this formulation. The result should teach you how the parts interact, not hand the answers back to you as a list.","<div class='pf-portrait-opening'><p>"+esc(read.one)+"</p></div><div class='pf-portrait-grid'>"+portraitCards+"</div><div class='pf-portrait-essay'><h3>The expert lens</h3><p>People rarely have one stable response style across every domain. A person can be curious and cautious, close and independent, ambitious and tired, socially interested and slow to enter. The useful unit is the configuration: which mechanism activates, what job it is trying to do, what changes the job and what the same mechanism costs when it becomes the default.</p><p>Read every chapter as a conditional map. If a description fits only when you are hungry, overloaded, evaluated or uncertain, that exception is not a footnote—it is the explanation. The assessment cannot establish causes, diagnoses or abilities; it can give you better questions for noticing what happens next.</p></div><div class='pf-axis-deck'>"+axis+"</div>","ink"),
    guideChapter("pf-patterns","03","Distinctive configurations","What makes you distinctive","These are the richest interactions supported by the current map. Each one includes an explanation, everyday examples, conditions, friction and an experiment.",renderGuideReadings(signals),"moss"),
    guideChapter("pf-contradictions","04","More than one thing can be true","Your inner contradictions","A contradiction is often two systems solving different problems at the same time.","<div class='pf-contradiction-grid'>"+read.contradictions.map((x,i)=>"<article><span>0"+(i+1)+"</span><p>"+esc(x)+"</p></article>").join("")+"</div><div class='pf-contradiction-note'><b>Needs can be paradoxical.</b> A need can be supported in one relationship and frustrated in another, or meaningful and costly at once. That is why the guide keeps motives, enactment, satisfaction and frustration separate.</div><div class='pf-values-mini'><h3>Your value hierarchy, visually</h3>"+renderValueGraph()+"</div>","plum"),
    guideChapter("pf-misunderstandings","05","Outside / inside","How others may read you","The test cannot know what other people think. It can still help you communicate where your behaviour may undersignal your intent.",guideMisreadings(signals),"ochre"),
    guideChapter("pf-relationships","06","Connection, space & repair","Your relationship blueprint","A relationship-fit portrait based on conditions that may make closeness easier—not a soulmate calculation.",guideRelationshipBlueprint(signals)+"<details class='pf-technical-fold'><summary>See the relationship preferences and compatibility prompts</summary>"+renderRelationshipSuggestions(signals)+"</details>","rose"),
    guideChapter("pf-work","07","Work & calling","Your best-fit work worlds","Environment first, occupational families second. Test the conditions before making a major career claim.",guideWorkWorlds(signals)+"<details class='pf-technical-fold'><summary>See the underlying work conditions</summary>"+renderCareerIdeas()+renderBestConditions()+"</details>","blue"),
    guideChapter("pf-interests","08","Life texture","Things you may naturally enjoy exploring","Hobbies are not decorations around the profile. They are low-stakes experiments where a configuration can teach you what actually gives energy.",guideInterests(signals),"yellow"),
    guideChapter("pf-place","09","Environment before postcode","Where might you thrive?","Compare these conditions with real information about budget, access, climate, safety, work and relationships.",guidePlaceProfile(signals),"sky"),
    guideChapter("pf-motivation","10","Motives, needs & achievement","Your motivation and achievement manual","A strong motive is not the same as a behaviour that is currently possible. The gap is often where the practical insight lives.",guideMotivation(signals)+"<details class='pf-technical-fold'><summary>See the motive, need and motivation responses</summary>"+renderMotives()+renderNeeds()+"</details>","green"),
    guideChapter("pf-decisions","11","Choice, action & change","Your decision-making manual","Different decisions deserve different processes. Do not use the most expensive thinking style for every choice.",guideDecision(signals)+"<details class='pf-technical-fold'><summary>See communication and scenario responses</summary>"+renderCommunication()+renderConflict()+"</details>","violet"),
    guideChapter("pf-money","12","Security, freedom & reward","Your money psychology guide","Money can represent safety, optionality, pleasure, status or protection from dependence. The same person can hold several meanings at once.",guideMoney(signals)+"<details class='pf-technical-fold'><summary>See the scenario evidence and money scales</summary>"+renderMoney(signals)+"</details>","copper"),
    guideChapter("pf-regulation","13","State → strategy","Your emotional regulation toolkit","Use the state you are in to choose the tool. A strategy is not a character trait, and no single strategy should have to solve every context.",guideRegulation(signals)+"<details class='pf-technical-fold'><summary>See the six-condition regulation matrix and stress signals</summary>"+renderStressManual(signals)+"</details>","teal"),
    guideChapter("pf-movement","14","Body, energy & repetition","Movement you may actually stick with","The right movement has a texture you can return to. Personality can suggest a fit; safety, access and enjoyment decide whether it lasts.",guideMovement(signals),"coral"),
    guideChapter("pf-identity","15","Identity, worth & continuity","The life pattern you may keep meeting","Identity can be clear in one area and in motion in another. A growth edge is a question to work with, not a flaw to remove.",guideLifeLesson(profile,signals)+"<details class='pf-technical-fold'><summary>See the identity, self-worth and narrative answers</summary>"+renderSelfWorth()+renderNarrativeThemes()+"</details>","indigo"),
    guideChapter("pf-context","16","One moment in time","State and context changes","Your right-now context belongs beside the profile, not inside it. Repeated check-ins can show when the same pattern changes shape.",renderStateSection().replace("<section class='pf-report-section' id='pf-context'>","<div class='pf-context-inner-content'>").replace("</section>","</div>"),"sand"),
    guideChapter("pf-playbook","17","Use this","Your personal playbook","Keep the mechanisms that help. Change the conditions that make them expensive.",guideUserManual(profile,signals)+"<div class='pf-future-you'><h3>If you lean into the healthiest version of this configuration</h3><p>At your best, your strongest systems coordinate: curiosity has structure, standards have a finish line, closeness has boundaries and emotion has a route back to choice.</p><h3>When the same configuration becomes overloaded</h3><p>The useful mechanism can become checking, avoidance, scattered novelty, over-responsibility, isolation or a moving threshold. The difference is whether the mechanism is serving your goals or controlling the conditions under which you are willing to pursue them.</p></div>","night"),
    "<section class='pf-guide-chapter pf-guide-method' id='pf-methods'><div class='pf-chapter-marker'><span>18</span><small>Transparency, not homework</small></div><h2>Why this guide says what it says</h2><p class='pf-guide-lead'>The technical detail is available when you want it, but it does not have to sit in the way of the interpretation.</p>"+renderGuideMethodDrawer(signals)+renderValidity(signals)+"</section>",
    "<section class='pf-end-actions pf-guide-end'><div><p class='eyebrow'>The map is allowed to change.</p><h2>Keep the useful prediction.</h2><p>This report is generated in your browser. It is not sent to Nobody’s Simple unless you choose to share general feedback.</p></div><div class='pf-action-buttons'><button type='button' class='button' id='pf-download'>Download my full guide</button><button type='button' class='button secondary' id='pf-print'>Print / save as PDF</button><button type='button' class='button secondary' id='pf-restart'>Start a new guide</button><a class='button secondary' href='#community'>Share general feedback</a><a href='#home'>← Back to the main website</a></div><p id='pf-download-status' aria-live='polite'></p></section>",
    "</main></div>"
  ].join("");

  root.querySelector("#pf-download").addEventListener("click",()=>downloadFullReport(root));
  root.querySelector("#pf-print").addEventListener("click",()=>window.print());
  root.querySelector("#pf-restart").addEventListener("click",()=>{answers=Object.create(null);valueRounds=[];flow=[];stepIndex=0;followupCount=0;motiveFollowupsQueued=false;phase="intro";render(root);});
  attachStateEvents(root);
  attachCollaborativeFeedback(root);
  attachEvidenceFilters(root);
}

function downloadFullReport(root) {
  const content=root.querySelector("#pf-report-content");
  if(!content)return;
  const clone=content.cloneNode(true);
  clone.querySelectorAll("button,input,select,textarea,nav").forEach(x=>x.remove());
  clone.querySelectorAll("details").forEach(x=>x.open=true);
  const exportCss="body{margin:0;background:#f6f0e4;color:#263e34;font-family:Arial,sans-serif}main{max-width:980px;margin:0 auto;padding:28px 5vw 60px}h1,h2,h3,h4{font-family:Georgia,serif;color:#234b3b}p,li{line-height:1.65;color:#56695b}.pf-report-section,.pf-archetype-chapter{margin:24px 0;padding:26px;border:1px solid #ddd8ca;border-radius:14px;background:#fffdf8}.pf-trait-card{margin:8px 0;padding:12px;border:1px solid #ddd8ca;border-radius:9px;background:#fffdf8}.pf-trait-card>summary{font-weight:700;cursor:pointer}.pf-trait-body{padding:10px}.pf-evidence-grid,.pf-archetype-grid,.pf-one-minute-grid,.pf-environment-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.pf-evidence-card,.pf-archetype-grid article,.pf-one-minute-grid article,.pf-environment-card{padding:15px;border:1px solid #ddd8ca;border-radius:9px}.pf-collab-feedback,.pf-report-nav,.pf-end-actions,.pf-search,.pf-evidence-filters{display:none}@media(max-width:650px){.pf-evidence-grid,.pf-archetype-grid,.pf-one-minute-grid,.pf-environment-grid{grid-template-columns:1fr}}";
  const exportEnhancements=".pf-profile-head{display:grid;grid-template-columns:minmax(0,1fr) minmax(220px,.38fr);gap:18px}.pf-profile-head h1{font:48px/1.05 Georgia,serif}.pf-profile-confidence{padding:14px;border:1px solid #d7dacc;border-radius:10px;background:#f4f6ef}.pf-profile-confidence span,.pf-profile-confidence strong,.pf-profile-confidence small{display:block}.pf-profile-confidence strong{margin:6px 0;font:21px Georgia,serif;color:#315746}.pf-profile-confidence small{font-size:11px;line-height:1.5}.pf-signature-chips{display:flex;flex-wrap:wrap;gap:7px;margin:14px 0}.pf-signature-chips span{padding:7px 10px;border:1px solid #d8dfd2;border-radius:999px;background:#f1f5ed;font-size:10px}.pf-profile-one-line{margin:14px 0;padding:16px;border-left:4px solid #315746;background:#edf4e9}.pf-profile-one-line p{font:19px/1.6 Georgia,serif;color:#315746}.pf-mechanism-stack,.pf-mechanism-grid{display:grid;gap:9px}.pf-mechanism-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pf-mechanism-card{padding:14px;border:1px solid #dddace;border-radius:9px;background:#fffdf8}.pf-mechanism-card p{font-size:11px;line-height:1.6}.pf-profile-rules{line-height:1.65}.pf-unknown-list p{padding:9px;border:1px dashed #d1d6ca;font-size:11px}@media(max-width:650px){.pf-profile-head,.pf-mechanism-grid{grid-template-columns:1fr}}";
  const exportGuideCss=".pf-guide-chapter{margin:24px 0;padding:30px;border:1px solid #d9d8ca;border-radius:18px;background:#fffdf8;break-inside:avoid}.pf-guide-hero{display:grid;grid-template-columns:180px 1fr;gap:18px;padding:28px;border:1px solid #d8c8a7;border-radius:18px;background:#f5eddd}.pf-guide-hero-art img{display:block;width:155px;height:145px;object-fit:contain}.pf-guide-hero h1{font:44px/1.03 Georgia,serif}.pf-90-grid,.pf-portrait-grid,.pf-reading-grid,.pf-work-world-grid,.pf-interest-grid,.pf-regulation-state-grid,.pf-decision-flow,.pf-place-grid,.pf-place-cards,.pf-user-manual-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.pf-90-grid article,.pf-portrait-card,.pf-reading-card,.pf-work-world,.pf-interest-grid article,.pf-regulation-state-grid article,.pf-decision-flow article,.pf-place-cards article,.pf-user-manual-grid article{padding:15px;border:1px solid #ddd8ca;border-radius:10px;background:#fffdf8}.pf-reading-card h3,.pf-work-world h3,.pf-interest-grid h3{font:22px Georgia,serif;color:#315746}.pf-reading-card p,.pf-work-world p,.pf-interest-grid p,.pf-regulation-state-grid p,.pf-decision-flow p{font-size:11px;line-height:1.6}.pf-guide-axis,.pf-place-axis,.pf-guide-meter{padding:10px;border:1px solid #ddd8ca;border-radius:9px}.pf-axis-line,.pf-meter-track{height:7px;margin:8px 0;background:#dfe8d9;border-radius:9px}.pf-axis-line i,.pf-meter-track i{display:block;height:100%;border-radius:9px;background:#679477}.pf-technical-fold,.pf-method-drawer{margin-top:15px;border:1px solid #ddd8ca;border-radius:9px}.pf-technical-fold>summary,.pf-method-drawer>summary{padding:10px;font-weight:700}.pf-limit-fold{margin-top:15px;border:1px solid #ddd8ca;border-radius:9px}.pf-limit-fold>summary{padding:10px;font-weight:700}.pf-limit-fold-body{padding:0 12px 12px}@media(max-width:650px){.pf-guide-hero,.pf-90-grid,.pf-portrait-grid,.pf-reading-grid,.pf-work-world-grid,.pf-interest-grid,.pf-regulation-state-grid,.pf-decision-flow,.pf-place-grid,.pf-place-cards,.pf-user-manual-grid{grid-template-columns:1fr}}";
  const html="<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Nobody’s Simple · Personal Psychological Guide 1.4</title><style>"+exportCss+exportEnhancements+exportGuideCss+"</style></head><body><main><h1>Nobody’s Simple · Personal Psychological Guide 1.4</h1>"+clone.outerHTML+"</main></body></html>";
  try {
    const blob=new Blob([html],{type:"text/html;charset=utf-8"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="nobodys-simple-personal-psychological-guide-1.4.html";
    document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
    const status=root.querySelector("#pf-download-status");
    if(status)status.textContent="Your profile file was created in your browser.";
  } catch {
    const status=root.querySelector("#pf-download-status");
    if(status)status.textContent="This browser could not create a download. You can print or save the page as PDF.";
  }
}

function render(root) {
  if(phase==="questions")renderStep(root);
  else if(phase==="result")renderResult(root);
  else renderIntro(root);
}
export function renderPersonalityTest(root) {
  answers=Object.create(null);
  valueRounds=[];
  flow=[];
  stepIndex=0;
  followupCount=0;
  motiveFollowupsQueued=false;
  phase="intro";
  render(root);
}
