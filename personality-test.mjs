const VERSION = "NS Full Personality Profile 1.0";
const DRAFT_KEY = "nobodys-simple-full-profile-draft-v1";
const STATE_KEY = "nobodys-simple-profile-state-checkins-v1";

const T7 = [
  ["0","Not at all like me"],["1","Very unlike me"],["2","Somewhat unlike me"],
  ["3","Mixed / depends strongly on the situation"],["4","Somewhat like me"],
  ["5","Very like me"],["6","Extremely like me"]
];
const I5 = [["0","Not at all"],["1","Slightly"],["2","Moderately"],["3","Strongly"],["4","Extremely"]];
const F5 = [["0","Never or almost never"],["1","Rarely"],["2","Sometimes"],["3","Often"],["4","Almost always"]];
const N5 = [["0","Not true at all"],["1","Slightly true"],["2","Moderately true"],["3","Very true"],["4","Completely true"]];
const S5 = [["0","Not at all"],["1","A little"],["2","Moderately"],["3","Strongly"],["4","Extremely"]];

const MODULES = [
  {id:"temperament",title:"Temperament & attention",time:"8–10 min",intro:"How reward, uncertainty, energy, attention and sensory input tend to move through your day."},
  {id:"dispositions",title:"Personality facets",time:"10–12 min",intro:"A broad set of separate tendencies. Different facets can point in different directions."},
  {id:"relationships",title:"Relationships & communication",time:"8–10 min",intro:"Closeness, space, attachment, communication preferences and first responses to conflict."},
  {id:"regulation",title:"Emotion regulation & adaptation",time:"8–10 min",intro:"What you tend to do with emotion, pressure, ambiguity and self-presentation."},
  {id:"motives",title:"Motives, needs & values",time:"8–10 min",intro:"What pulls action, what feels supported or frustrated right now, and which values you choose when they compete."},
  {id:"identity",title:"Identity & self-understanding",time:"6–8 min",intro:"How you experience continuity, clarity, agency, authenticity and your life story."},
  {id:"domains",title:"Work, money & learning",time:"8–10 min",intro:"Desired environments, financial habits and the ways you prefer to learn. These are exploratory preferences."},
  {id:"decisions",title:"Decisions, conflict & change",time:"5–7 min",intro:"How you gather information, begin, continue and revise a course of action."},
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
  dimension("self-worth-stability","Self-worth stability","identity","Self-understanding","How much your sense of worth shifts after outcomes or other people’s reactions.","Noticing what affects self-worth can help separate an event from identity.","A buoy that rises with waves versus one anchored more deeply.","Success, criticism, rejection or praise.","A strong mood shift about yourself after external feedback.","Your sense of worth more often shifts with recent outcomes or reactions.","Your basic self-view appears less tied to each recent outcome.","A pause between feedback and the story you draw about yourself.","Stable and unstable self-worth are not a moral ranking.","Other people’s reactions can noticeably alter how I feel about myself.","My sense of worth changes substantially after success or failure."),
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

const MOTIVE_STEPS = MOTIVE_DATA.flatMap((m)=>{
  const id=m[0],name=m[1],description=m[2];
  return [
    {id:"motive-"+id+"-strength",group:"motives",type:"I5",title:name,prompt:"How strongly does this outcome tend to motivate you?",text:description},
    {id:"motive-"+id+"-behavior",group:"motives",type:"F5",title:name,prompt:"How often does this motive actually influence your choices?",text:"I choose or spend effort on options that support: "+description.toLowerCase()}
  ];
});

const NEED_STEPS = NEEDS.flatMap((n)=>{
  const id=n[0],name=n[1],definition=n[2];
  return [
    {id:"need-"+id+"-satisfaction",group:"motives",type:"N5",title:name+" · satisfaction",prompt:"In this area of your life right now…",text:"I experience "+definition.toLowerCase()},
    {id:"need-"+id+"-satisfaction2",group:"motives",type:"N5",title:name+" · satisfaction",prompt:"In this area of your life right now…",text:"My current situation gives me room to experience "+definition.toLowerCase()},
    {id:"need-"+id+"-frustration",group:"motives",type:"N5",title:name+" · frustration",prompt:"In this area of your life right now…",text:"I often feel that this need is actively blocked or frustrated."},
    {id:"need-"+id+"-frustration2",group:"motives",type:"N5",title:name+" · frustration",prompt:"In this area of your life right now…",text:"Pressures in my life make this need harder to meet."}
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
  {id:"reg-flex-changeable",group:"regulation",type:"singleChoice",title:"Emotion regulation · changeable situation",prompt:"You are upset about a problem you can realistically change. What would you be most likely to do first?",options:[
    "Try to accept the situation without acting.","Distract myself until the emotion passes.","Identify what action could change the problem.","Seek reassurance that everything will be fine.","Continue thinking about why it happened.","Ask someone I trust to help me decide."
  ]},
  {id:"reg-flex-unchangeable",group:"regulation",type:"singleChoice",title:"Emotion regulation · not changeable right now",prompt:"The situation is painful but cannot currently be changed. What would you be most likely to do first?",options:[
    "Try to accept what cannot change right now.","Distract myself until the emotion passes.","Identify a small part I can influence later.","Seek support from someone I trust.","Continue thinking about why it happened.","Give myself time and return to it later."
  ]},
  {id:"financial-risk","group":"domains","type":"B7","title":"Financial risk preference","prompt":"If both were equally practical and the downside were manageable, which would you normally prefer?","left":"A smaller predictable return","right":"A larger uncertain return"},
  {id:"financial-time","group":"domains","type":"singleChoice","title":"Money · time horizon","prompt":"If both outcomes were guaranteed and your needs were covered, which would you prefer?",options:["£100 today","£110 in one month","£125 in three months","£150 in one year","It depends on what I need the money for"]},
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
  .concat(IDENTITY_DIMENSIONS,IDENTITY_EXTRA,RELATIONSHIP_DIMENSIONS,DOMAIN_DIMENSIONS.filter(d=>d.id!=="money-risk"&&d.id!=="money-time"),LEARNING_DIMENSIONS,CHANGE_DIMENSIONS);

function shuffle(list) {
  const out=list.slice();
  for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}
  return out;
}

function makeValueRounds() {
  const deck=shuffle(VALUE_CARDS);
  const rounds=[];
  for(let r=0;r<10;r++) {
    const cards=[];
    for(let j=0;j<4;j++) cards.push(deck[(r*4+j)%deck.length]);
    rounds.push(cards);
  }
  return rounds;
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
    const dimSteps=dims.flatMap(d=>d.items.map(item=>({
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
    localStorage.setItem(DRAFT_KEY,JSON.stringify({version:VERSION,valueRounds,answers:Object.entries(answers),stepIndex}));
    const status=root.querySelector("#pf-save-status");
    if(status) status.textContent="Saved on this device. Anyone using this browser profile could reopen the draft.";
  } catch {
    const status=root.querySelector("#pf-save-status");
    if(status) status.textContent="This browser could not save locally. Your answers remain in this tab.";
  }
}
function startFresh(root) {
  clearDraft();answers=Object.create(null);valueRounds=makeValueRounds();flow=compileFlow(valueRounds);stepIndex=0;phase="questions";render(root);
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

function renderIntro(root) {
  const saved=savedDraft();
  const modules=MODULES.map(m=>"<li><span><b>"+esc(m.title)+"</b><small>"+esc(m.intro)+"</small></span><em>"+esc(m.time)+"</em></li>").join("");
  const resume=saved
    ? "<aside class='pf-resume'><b>A saved profile draft is on this device.</b><p>It is stored only in this browser. Anyone using this browser profile could reopen it.</p><div class='pf-button-row'><button type='button' class='button' id='pf-resume'>Resume draft</button><button type='button' class='button secondary' id='pf-clear-draft'>Clear draft</button></div></aside>"
    : "";
  root.innerHTML=[
    "<div class='wrap pf-wrap'><section class='pf-intro'>",
    "<div class='pf-intro-copy'><p class='eyebrow'>Nobody’s Simple · Full edition 1.0</p>",
    "<h1>The personality map<br><em>with room for contradiction.</em></h1>",
    "<p class='lead'>A long-form self-reflection assessment about the patterns that organise how you respond, relate, learn, choose and change across different parts of life.</p>",
    "<div class='pf-facts'><span>About 60–80 minutes</span><span>No timer</span><span>Pause and return if you save locally</span></div>",
    "<button class='button' id='pf-start' type='button'>Begin the full profile <span aria-hidden='true'>↗</span></button>",
    "<p class='pf-privacy'>Your answers stay in this tab unless you explicitly choose to save a draft or state check-in on this device. Nothing is sent to Nobody’s Simple.</p></div>",
    "<div class='pf-intro-art'><img src='personality-map.png' alt='A friendly map character following a dotted path'><p>More than one pattern can be true at once.</p></div></section>",
    "<section class='pf-principles'><article><span>01</span><h2>Dimensions before types</h2><p>Your separate response patterns are the result. The story title is a playful shorthand, not a psychological category.</p></article><article><span>02</span><h2>Describe before explaining</h2><p>We distinguish what you reported from what might be worth testing. The assessment cannot tell you why a pattern developed.</p></article><article><span>03</span><h2>State is not trait</h2><p>The final check-in describes right now. It is shown apart from your longer-term responses.</p></article></section>",
    "<section class='pf-scope'><div><p class='eyebrow'>A fuller map</p><h2>All parts of the profile</h2><p>Each module can be skipped item by item. Responses use different formats for tendencies, motives, needs, preferences, values and current states; those formats are not combined into one total score.</p></div><ul class='pf-module-list'>"+modules+"</ul></section>",
    "<aside class='pf-validity'><b>Public edition 1.0 · exploratory, not validated</b><p>This full questionnaire is a structured self-reflection tool. Its candidate items, scoring rules and profile interpretations have not been psychometrically validated or normed. It does not diagnose, rank or compare you with a population. A working website is not evidence of measurement validity.</p></aside>",
    resume,
    "<p class='pf-back'><a href='#home'>← Back to the main website</a></p></div>"
  ].join("");
  root.querySelector("#pf-start").addEventListener("click",()=>startFresh(root));
  if(saved) {
    root.querySelector("#pf-resume").addEventListener("click",()=>{
      answers=Object.fromEntries(saved.answers);
      valueRounds=saved.valueRounds;
      flow=compileFlow(valueRounds);
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
    "<section class='pf-question-card'><div class='pf-progress-top'><span>Module "+(pos.index+1)+" of "+flow.length+" · "+esc(mod.title)+"</span><span>Step "+(stepIndex+1)+" of "+totalSteps()+"</span></div>",
    "<div class='pf-progress' role='meter' aria-label='Assessment progress' aria-valuemin='0' aria-valuemax='"+totalSteps()+"' aria-valuenow='"+(stepIndex+1)+"'><span style='width:"+pct+"%'></span></div>",
    "<p class='pf-module-intro'>"+esc(mod.intro)+"</p><p class='pf-progress-hint'>"+countAnswered()+" response steps completed · no timer</p>",
    "<p class='eyebrow'>"+esc(step.title||mod.title)+"</p>",
    (step.text&&step.type!=="T7"&&step.type!=="I5"&&step.type!=="F5"&&step.type!=="N5"&&step.type!=="S5"?"<h1 class='pf-step-heading'>"+esc(step.text)+"</h1>":""),
    "<div class='pf-step-body'>"+body+"</div>",
    "<div class='pf-controls'><button class='button secondary' type='button' id='pf-previous' "+(stepIndex===0?"disabled":"")+">← Previous</button><button class='pf-skip' type='button' id='pf-skip'>Skip this item</button><button class='button' type='button' id='pf-next' "+(stepValid(step)?"":"disabled")+">"+(stepIndex===totalSteps()-1?"Build my profile":"Continue")+" →</button></div>",
    "<div class='pf-save-row'><button type='button' class='pf-save' id='pf-save'>"+savedLabel+"</button><p id='pf-save-status' aria-live='polite'>Nothing is saved unless you choose. A saved draft stays in this browser profile.</p></div>",
    "</section><p class='pf-footnote'>There is no ideal response. “Mixed / depends” is a useful answer. Your context matters.</p></div>"
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
function signalFor(d) {
  const values=responseValues(d);
  let pattern="unknown";
  if(values.length>=2) {
    if(values.every(v=>v>=4)) pattern="more";
    else if(values.every(v=>v<=2)) pattern="less";
    else pattern="mixed";
  } else if(values.length===1) {
    pattern="single";
  }
  return {dimension:d,values,count:values.length,total:d.items.length,pattern};
}
function allSignals() { return ALL_DIMENSIONS.map(signalFor); }
function signalMap(signals) { return Object.fromEntries(signals.map(s=>[s.dimension.id,s])); }
function hasPattern(signals,id,pattern) { return signalMap(signals)[id]?.pattern===pattern; }
function nLabel(v,scale) { const hit=scale.find(x=>Number(x[0])===Number(v)); return hit?hit[1]:"Not answered"; }
function I5label(v) { return nLabel(v,I5); }
function F5label(v) { return nLabel(v,F5); }
function getValueCounts() {
  const counts=Object.fromEntries(VALUE_CARDS.map(v=>[v[0],{most:0,least:0}]));
  for(let i=0;i<10;i++) {
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
  return signals.filter(s=>s.pattern==="more"||s.pattern==="less");
}
function strongestDirections(signals,limit) {
  return usefulDirections(signals).slice(0,limit);
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

function narrative(signals) {
  const map=signalMap(signals);
  const directional=usefulDirections(signals);
  const mixed=signals.filter(s=>s.pattern==="mixed");
  const paragraphs=[];
  paragraphs.push("This profile is a set of separate routes through your answers, rather than one score that explains everything. A tendency, a relationship preference, a motive, a need, a work condition and a feeling today answer different questions. The story-title above is only a memory hook; the more useful portrait is the pattern of evidence and the places where it changes.");
  if(directional.length) {
    paragraphs.push("Across the repeated-item candidate scales, "+directional.length+" had at least two answered items that leaned consistently toward one side. That means the responses agreed with one another within each small scale; it does not mean the pattern is unusually strong compared with other people. The report presents the patterns in their separate sections and does not sort them into a single rank.");
    directional.slice(0,4).forEach((s,i)=>{
      const reading=s.pattern==="more"?s.dimension.more:s.dimension.less;
      const complementary=s.pattern==="more"?s.dimension.less:s.dimension.more;
      const lead=i===0?"A useful place to begin is ":"Another distinct thread is ";
      paragraphs.push(lead+s.dimension.title.toLowerCase()+". Your answered items leaned in a direction consistent with this description: "+reading+" The pattern concerns "+s.dimension.definition.toLowerCase()+" Its possible function is described as "+s.dimension.fn+" It may become visible around "+s.dimension.contexts.toLowerCase()+"; early cues worth noticing include "+s.dimension.cues.toLowerCase()+" In a supportive setting, the same tendency may help by "+s.dimension.more.toLowerCase()+" Friction may appear when "+s.dimension.friction.toLowerCase()+" A need or support to experiment with is "+s.dimension.needs.toLowerCase()+" The other pole remains possible in situations where the pattern shifts: "+complementary+" These are possible interpretations of candidate items, not a rule about what you always do.");
    });
    if(directional.length>4) paragraphs.push("Other repeated-item directions in your map include "+directional.slice(4,9).map(s=>s.dimension.title.toLowerCase()+" ("+patternLabel(s).toLowerCase()+")").join(", ")+". They are shown individually below so they are not collapsed into the headline. Open a card to read its definition, purpose, analogy, likely situations, cues, possible strengths, friction and needs.");
  } else {
    paragraphs.push("There are not enough repeated-item scales with consistent answers to describe directional tendencies. That is a valid result, not a failed one. You can still read the preferences, scenario choices, motives, needs, values and identity themes you selected directly; skipped or mixed answers are not filled in with guesses.");
  }
  if(mixed.length) paragraphs.push("Some candidate scales were mixed or context-dependent, including "+mixed.slice(0,6).map(s=>s.dimension.title.toLowerCase()).join(", ")+". A mixed result may mean your response changes by situation, that two items landed differently, or that the questions need revision. It should not be translated into a hidden trait or treated as inconsistency you need to explain away.");
  const watch=directional.filter(s=>s.pattern==="more"&&/sensitiv|overload|stress|anxious|urgency|interocept|rejection|evaluation|threat|fatigue/i.test(s.dimension.id+" "+s.dimension.kind)).slice(0,4);
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
  if(motiveRatings.length) paragraphs.push("Motives describe what can pull you toward effort. The strongest ratings you gave in this session were for "+motiveRatings.map(m=>m.title.toLowerCase()+" ("+I5label(m.strength).toLowerCase()+")").join(", ")+". You also rated how often each motive actually influences a choice; the most frequent reports were "+(motiveFrequencies.length?motiveFrequencies.map(m=>m.title.toLowerCase()+" ("+F5label(m.frequency).toLowerCase()+")").join(", "):"not enough frequency items to summarise")+". A motive can be strong while opportunity, support, time or material resources remain limited.");
  const needSummary=NEEDS.map(n=>{
    const id=n[0];
    const satisfaction=[answers["need-"+id+"-satisfaction"],answers["need-"+id+"-satisfaction2"]].filter(v=>typeof v==="number");
    const frustration=[answers["need-"+id+"-frustration"],answers["need-"+id+"-frustration2"]].filter(v=>typeof v==="number");
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
  const financialRisk=answers["financial-risk"],financialTime=answers["financial-time"];
  const learning=LEARNING_PREFERENCES.map(p=>({step:p,value:answers[p.id]})).filter(x=>typeof x.value==="number");
  if(typeof financialRisk==="number"||typeof financialTime==="string"||learning.length) {
    const money=[];
    if(typeof financialRisk==="number") { const item=SPECIAL_STEPS.find(s=>s.id==="financial-risk"); money.push(financialRisk<0?item.left:financialRisk>0?item.right:"a context-dependent balance"); }
    if(typeof financialTime==="string") { const item=SPECIAL_STEPS.find(s=>s.id==="financial-time"); money.push("the time-horizon option “"+(item.options[Number(financialTime)]||"a context-dependent choice")+"”"); }
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
  return hypotheses;
}

function signalDescription(signal) {
  if(!signal||signal.pattern==="unknown") return "Not enough answers were given to describe this pattern.";
  if(signal.pattern==="single") return "One response was recorded. It is shown as a direct answer, not a scale estimate.";
  if(signal.pattern==="more") return "All answered candidate items leaned toward the higher end. "+signal.dimension.more;
  if(signal.pattern==="less") return "All answered candidate items leaned toward the lower end. "+signal.dimension.less;
  return "Your answers were mixed, included the “mixed / depends” option, or did not point consistently in one direction. Context may matter, or these candidate items may need refinement.";
}
function patternLabel(signal) {
  if(!signal||signal.pattern==="unknown") return "Not enough responses";
  if(signal.pattern==="single") return "One response · descriptive only";
  if(signal.pattern==="more") return "Items leaned higher";
  if(signal.pattern==="less") return "Items leaned lower";
  return "Mixed / context-dependent";
}
function traitCard(signal) {
  const d=signal.dimension;
  const mapText=signalDescription(signal);
  return "<details class='pf-trait-card'><summary><span><b>"+esc(d.title)+"</b><small>"+esc(d.kind)+" · "+esc(patternLabel(signal))+"</small></span><span class='pf-chevron' aria-hidden='true'>＋</span></summary><div class='pf-trait-body'>"+
    "<p><b>What it covers</b>"+esc(d.definition)+"</p>"+
    "<p><b>What it can do</b>"+esc(d.fn)+"</p>"+
    "<p><b>Picture it</b>"+esc(d.analogy)+"</p>"+
    "<p><b>Where it may show up</b>"+esc(d.contexts)+"</p>"+
    "<p><b>Everyday cues to notice</b>"+esc(d.cues)+"</p>"+
    "<p><b>Your response pattern</b>"+esc(mapText)+"</p>"+
    "<p><b>When it may help</b>"+esc(d.more)+"</p>"+
    "<p><b>When it may create friction</b>"+esc(d.friction)+"</p>"+
    "<p><b>A need to consider</b>"+esc(d.needs)+"</p>"+
    "<p class='pf-provenance'><b>Evidence:</b> "+signal.count+" of "+signal.total+" candidate items answered · descriptive self-report only.</p></div></details>";
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
  const strongest=VALUE_CARDS.map(v=>({card:v,count:counts[v[0]].most})).filter(x=>x.count>0).sort((a,b)=>b.count-a.count);
  return "<div class='pf-values-explainer'><p>Each round asked you to choose one value as most important and one as least central within a small set. This graph shows the number of times you made each choice. The choices are not converted into a latent value score, population rank or hierarchy outside these rounds.</p><div class='pf-value-legend'><span><i class='most'></i> Chosen most</span><span><i class='least'></i> Chosen least</span></div></div><div class='pf-value-results'>"+rows+"</div><p class='pf-small-note'>A value selected less often is not unimportant; a different competitor or real-life constraint can change the choice.</p>";
}
function renderMotives() {
  const values=motifValues();
  return "<div class='pf-motive-grid'>"+values.map(m=>{
    const freq=typeof m.frequency==="number"?F5label(m.frequency):"Not answered";
    const strength=typeof m.strength==="number"?I5label(m.strength):"Not answered";
    return "<article><h3>"+esc(m.title)+"</h3><p>"+esc(m.description)+"</p><div><span>Motivating: <b>"+esc(strength)+"</b></span><span>Influences choices: <b>"+esc(freq)+"</b></span></div></article>";
  }).join("")+"</div><p class='pf-small-note'>Motives, self-reported behaviour and available opportunities are different things. These ratings are not combined into a motivation score.</p>";
}
function renderNeeds() {
  return "<div class='pf-needs-grid'>"+NEEDS.map(n=>{
    const id=n[0],name=n[1];
    const keys=["need-"+id+"-satisfaction","need-"+id+"-satisfaction2","need-"+id+"-frustration","need-"+id+"-frustration2"];
    const vals=keys.map(k=>answers[k]);
    const sat=vals.slice(0,2).filter(v=>typeof v==="number").map(v=>nLabel(v,N5));
    const fru=vals.slice(2).filter(v=>typeof v==="number").map(v=>nLabel(v,N5));
    return "<article><h3>"+esc(name)+"</h3><p>"+esc(n[2])+"</p><div class='pf-need-pair'><div><b>Satisfaction · right now</b><span>"+esc(sat.join(" / ")||"Not answered")+"</span></div><div><b>Frustration · right now</b><span>"+esc(fru.join(" / ")||"Not answered")+"</span></div></div></article>";
  }).join("")+"</div><p class='pf-small-note'>Need satisfaction and active frustration are shown separately. A low satisfaction response is not automatically evidence of active frustration.</p>";
}
function renderCareerIdeas() {
  const map={
    "work-autonomy":["Independent research or project work","Freelance creative practice","Small-team product or service design","Personal creative projects","Self-directed making or study"],
    "work-predictability":["Operations and coordination","Quality or process support","Records and information work","Gardening or craft routines","A regular club or structured practice"],
    "work-variety":["Field research or reporting","Events and community projects","Project-based media work","Travel and place-based hobbies","Rotating workshops or classes"],
    "work-challenge":["Research and analysis","Data, policy or technical problem-solving","Investigative writing","Strategy games or puzzle groups","Learning a demanding new subject"],
    "work-social":["Teaching or facilitation","Community support roles","People-focused service","Choirs, clubs or group classes","Hosting or collaborative hobbies"],
    "work-independent":["Editing, translation or focused analysis","Programming or technical production","Archival and research work","Reading, drawing or solo making","Long-form personal projects"],
    "work-competition":["Sales or target-based roles","Sport or performance settings","Negotiation-focused work","Competitive games or leagues","Skill challenges with personal records"],
    "work-collaboration":["Project teams","Community organising","Health, education or production teams","Ensemble arts","Cooperative games or shared making"],
    "work-leadership":["Project coordination","Team leadership","Campaign or community organising","Running a club or event","Organising a collaborative project"],
    "work-recognition":["Public communication or performance","Publishing, presentation or portfolio-based work","Client-facing achievement roles","Open mic, exhibition or showcase projects","Sharing finished work with a community"],
    "work-hands":["Laboratory or field technician work","Repair, fabrication or skilled trades","Horticulture or animal care","Woodwork, cooking or model making","Hands-on restoration"],
    "work-creative":["Writing, illustration or design","Video, music or creative production","Brand or experience design","Photography, crafts or performance","A personal art or media project"],
    "work-helping":["Teaching, mentoring or support work","Care, advocacy or community services","Coaching or guidance roles","Volunteering with clear boundaries","Peer-led support or mutual aid"],
    "work-reward":["Commercial, product or client work","Business operations or entrepreneurship","Commission or outcome-linked roles","A practical skill with a visible result","A hobby with a clear project milestone"],
    "work-stability":["Public service or established organisations","Operations and administration","Education or long-term support settings","A regular hobby group","Steady skill practice with predictable sessions"],
    "work-impact":["Community, environmental or policy work","Nonprofit or public-interest projects","Education and civic communication","Local campaigning or conservation","A cause-based club or volunteer project"]
  };
  const picks=selectedWork().filter(w=>w.value>=3).slice(0,6);
  if(!picks.length) return "<div class='pf-empty'><b>No work preferences selected strongly enough to build this list.</b><p>That is not a problem. You can still review your direct ratings below.</p></div>";
  const career=picks.flatMap(p=>(map[p.id]||[]).slice(0,3).map(label=>({label,basis:p.title,kind:"career"})));
  const hobbies=picks.flatMap(p=>(map[p.id]||[]).slice(3).map(label=>({label,basis:p.title,kind:"hobby"})));
  return "<div class='pf-idea-columns'><article><h3>Career directions to investigate</h3><ul>"+career.slice(0,10).map(x=>"<li><b>"+esc(x.label)+"</b><small>Included because you rated "+esc(x.basis.toLowerCase())+" highly in a work setting.</small></li>").join("")+"</ul></article><article><h3>Hobbies and activities to try</h3><ul>"+hobbies.slice(0,10).map(x=>"<li><b>"+esc(x.label)+"</b><small>Included because you rated "+esc(x.basis.toLowerCase())+" highly in a work setting.</small></li>").join("")+"</ul></article></div><p class='pf-small-note'>These are prompts for exploration, not evidence that you will enjoy or succeed at a role. This assessment does not measure vocational interests, ability, qualifications, pay, job access or financial need. Try a low-cost sample before making a major commitment.</p>";
}

function renderRelationshipSuggestions(signals) {
  const map=signalMap(signals);
  const statements=[];
  const intimacy=map["rel-intimacy"],space=map["rel-autonomy"],anxiety=map["attachment-anxiety"],avoid=map["attachment-avoidance"],repair=map["rel-repair"];
  const comm=answers["comm-direct"];
  const process=answers["comm-process"];
  const reassurance=map["rel-reassurance"];
  if(intimacy&&intimacy.pattern==="more") statements.push("You more often endorse wanting emotional closeness. A partner who is willing to talk about important feelings may be worth exploring.");
  if(space&&space.pattern==="more") statements.push("You more often endorse needing independent space. A partner who respects separate time and choices may make closeness feel more workable.");
  if(anxiety&&anxiety.pattern==="more") statements.push("Ambiguous relationship signals may hold attention more strongly. Clear follow-through and direct reassurance may be useful to discuss.");
  if(avoid&&avoid.pattern==="more") statements.push("You more often endorse keeping emotional distance or processing privately. A partner who respects pace and privacy may matter.");
  if(reassurance&&reassurance.pattern==="more") statements.push("Reassurance may help when signals are unclear; it may be useful to talk about what kind of reassurance actually settles the question.");
  if(repair&&repair.pattern==="more") statements.push("You more often report wanting to repair connection after conflict. Someone willing to return to a difficult conversation after a pause may fit that preference.");
  if(typeof comm==="number") statements.push("You selected a communication preference leaning toward "+(comm<0?"a softer or less direct style":comm>0?"a more direct style":"no consistent pole")+" for important topics.");
  if(typeof process==="number") statements.push("You selected a preference leaning toward "+(process<0?"private thinking before discussion":process>0?"thinking through conversation":"no consistent pole")+" when working through a complex issue.");
  const relationshipAnswers=["rel-commitment","rel-novelty"].filter(k=>typeof answers[k]==="number");
  const b7=relationshipAnswers.map(k=>{
    const step=SPECIAL_STEPS.find(s=>s.id===k);
    const v=answers[k];
    const choice=v<0?step.left:v>0?step.right:"a context-dependent balance";
    return "<p><b>"+esc(step.title)+":</b> your selected preference leaned toward "+esc(choice.toLowerCase())+".</p>";
  }).join("");
  return "<div class='pf-partner-note'><p class='pf-label'>Your ideal-partner picture · preferences to discuss, not a match score</p><h3>Qualities you may appreciate in a partner</h3>"+(statements.length?"<ul>"+statements.map(s=>"<li>"+esc(s)+"</li>").join("")+"</ul>":"<p>There are not enough relationship answers to generate a personal set of suggestions. You can still use the questions as conversation prompts.</p>")+b7+"<p class='pf-small-note'>No questionnaire of one person can identify an ideal partner or predict compatibility. Real compatibility depends on two people, consent, safety, circumstances, behaviour and repair over time.</p></div>";
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
  return "<div class='pf-hypothesis-grid'>"+list.map((h,i)=>"<article class='pf-hypothesis'><span>HYPOTHESIS "+String(i+1).padStart(2,"0")+"</span><h3>"+esc(h.title)+"</h3><p><b>What answers produced this:</b> "+esc(h.evidence)+"</p><p><b>One possible reading:</b> "+esc(h.interpretation)+"</p><p><b>Where to check:</b> "+esc(h.setting)+"</p><div><b>Small experiment:</b> "+esc(h.experiment)+"</div><p class='pf-small-note'>You can accept, revise or reject this. It is not a validated interaction rule.</p></article>").join("")+"</div>";
}
function renderStandouts(signals) {
  const list=signals.filter(s=>s.pattern==="more"||s.pattern==="less");
  if(!list.length)return "<div class='pf-empty'><p>No repeated-item scale has enough answers leaning consistently in one direction. Mixed answers are not a flaw.</p></div>";
  return "<ul class='pf-standout-list'>"+list.map(s=>"<li><b>"+esc(s.dimension.title)+"</b><span>"+esc(patternLabel(s))+"</span><p>"+esc(s.pattern==="more"?s.dimension.more:s.dimension.less)+"</p></li>").join("")+"</ul><p class='pf-small-note'>These are patterns within your own answers, not unusually high or low compared with other people.</p>";
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
  const risk=answers["financial-risk"],time=answers["financial-time"];
  const riskHtml=typeof risk==="number"?"<p><b>Risk preference:</b> your answer leaned toward "+esc(risk<0?"a smaller predictable return":risk>0?"a larger uncertain return":"a context-dependent choice")+".</p>":"";
  const timeHtml=typeof time==="string"?"<p><b>Time horizon scenario:</b> you chose "+esc(SPECIAL_STEPS.find(s=>s.id==="financial-time").options[Number(time)]||time)+". This one choice can reflect immediate need as well as preference.</p>":"";
  return "<div class='pf-money-direct'>"+riskHtml+timeHtml+"</div><div class='pf-trait-list'>"+cards+"</div><p class='pf-small-note'>This assessment does not measure actual income, debt, financial literacy, material security or the constraints shaping your choices. It is not financial advice.</p>";
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
  if(m.sociability?.pattern==="more"&&m["social-boldness"]?.pattern==="less")add("Wanting contact may look like hesitation","Social interest and comfort initiating are separate. You may want connection while preferring a familiar opening or lower-pressure setting.","Your social-interest items leaned higher and social-boldness items lower.");
  if(m["social-boldness"]?.pattern==="more"&&m.sociability?.pattern==="less")add("Social ease may look like social appetite","You may be able to enter a group comfortably without wanting frequent or extended contact.","Your social-boldness items leaned higher while social-interest items leaned lower.");
  if(m.stimulation?.pattern==="more"&&m["uncertainty-intolerance"]?.pattern==="more")add("Caution may not mean lack of interest","A possibility can be attractive while the unknown parts still occupy attention.","Your stimulation and uncertainty items both leaned higher.");
  if(m.persistence?.pattern==="less"&&motifValues().some(x=>x.id==="achievement"&&x.strength>=3))add("A hard start or fading momentum may not mean you do not care","Achievement can matter while repetition or initiation still asks for more support.","Achievement was rated strongly motivating; persistence items leaned lower.");
  if(m["rel-intimacy"]?.pattern==="more"&&m["rel-autonomy"]?.pattern==="more")add("Wanting closeness does not cancel wanting space","Both intimacy and independent room can be genuine needs.","Both relationship preference scales leaned toward more.");
  if(m["personal-standards"]?.pattern==="more"&&m["evaluative-perfectionism"]?.pattern==="less")add("High standards may come from the work itself","Caring about quality does not necessarily mean fearing other people’s judgement.","Standards leaned higher while evaluative concern leaned lower.");
  if(!cards.length)return "<div class='pf-empty'><p>No specific misunderstanding pattern was supported by the repeated-item combinations. The wider profile still shows separate facets so readers do not collapse them into one label.</p></div>";
  return "<div class='pf-misread-grid'>"+cards.join("")+"</div><p class='pf-small-note'>These are hypotheses to check against real interactions. The assessment does not know what other people actually think.</p>";
}
function renderEnvironment(signals) {
  const work=selectedWork().filter(w=>w.value>=3).slice(0,7);
  const patterns=strongestDirections(signals,6);
  const list=[];
  work.forEach(w=>list.push("<li><b>"+esc(w.title)+":</b> "+esc(w.text)+"</li>"));
  patterns.forEach(s=>list.push("<li><b>"+esc(s.dimension.title)+":</b> "+esc(s.pattern==="more"?s.dimension.needs:s.dimension.more)+"</li>"));
  return "<div class='pf-condition-columns'><article><h3>Conditions worth trying</h3>"+(list.length?"<ul>"+list.join("")+"</ul>":"<p>There are not enough directional patterns to offer personalised environment suggestions. Use the direct preferences below.</p>")+"</article><article><h3>Conditions that may ask more effort</h3>"+(patterns.length?"<ul>"+patterns.slice(0,5).map(s=>"<li><b>"+esc(s.dimension.title)+":</b> "+esc(s.dimension.friction)+"</li>").join("")+"</ul>":"<p>No specific friction hypotheses were generated from the current answers.</p>")+"</article></div><p class='pf-small-note'>These are possible conditions to test, not restrictions or instructions. You can be effective in environments that are not your preferred ones.</p>";
}
function renderStressManual(signals) {
  const m=signalMap(signals);
  const selected=["stress-vulnerability","emotional-volatility","sensory-overload","anxiousness","negative-urgency","self-soothing","distress-tolerance"].map(id=>m[id]).filter(Boolean);
  const cards=selected.map(s=>{
    const read=s.pattern==="more"?s.dimension.more:s.pattern==="less"?s.dimension.less:"Answers here were mixed or did not support a consistent directional reading.";
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
  return "<section class='pf-report-section' id='pf-work'><p class='eyebrow'>Work, direction & interests</p><h2>Career and hobby ideas to explore</h2><p class='pf-section-lead'>"+esc(idealText)+" These are invitations to try, not conclusions about what you are suited to.</p>"+renderBestConditions()+topFiveMarkup+idea+"<details class='pf-detail'><summary>Your work-environment responses</summary><div class='pf-work-ratings'>"+answered.map(w=>"<div><b>"+esc(w.title)+"</b><span>"+esc(I5label(w.value))+"</span></div>").join("")+"</div></details></section>";
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
  return "<section class='pf-report-section' id='pf-relationships'><p class='eyebrow'>Closeness, space & repair</p><h2>Your relationship profile</h2><p class='pf-section-lead'>The relationship module focuses on your reported preferences and possible responses. It cannot describe a specific partner or relationship from your answers alone.</p><div class='pf-trait-list'>"+r.map(traitCard).join("")+"</div>"+renderRelationshipSuggestions(signals)+"<div class='pf-social-battery'><h3>Friendship & social battery</h3><p>"+esc(socialRead||"There are not enough social answers for a personal description.")+"</p><p>There is no separate measure of friendship quality, family relationships or social battery here. The answers above are clues to discuss, not a verdict about how much connection you should want.</p></div></section>";
}
function renderRegulationSection(signals) {
  const items=signals.filter(s=>s.dimension.group==="regulation");
  const flexA=answers["reg-flex-changeable"],flexB=answers["reg-flex-unchangeable"];
  const flexAOptions=SPECIAL_STEPS.find(s=>s.id==="reg-flex-changeable").options,flexBOptions=SPECIAL_STEPS.find(s=>s.id==="reg-flex-unchangeable").options;
  const flex="<div class='pf-direct-card'><b>Strategy choices for situations with different controllability</b><p><b>Changeable problem:</b> "+esc(typeof flexA==="string"?flexAOptions[Number(flexA)]:"Not answered")+"</p><p><b>Not changeable right now:</b> "+esc(typeof flexB==="string"?flexBOptions[Number(flexB)]:"Not answered")+"</p><small>Different choices may make sense when the facts differ. These are scenario responses, not validated skill scores.</small></div>";
  return "<section class='pf-report-section' id='pf-regulation'><p class='eyebrow'>Emotion, pressure & recovery</p><h2>Your regulation manual</h2><p class='pf-section-lead'>Strategies are not character flaws. The same strategy may help in one context and create friction in another; the question is whether it fits the situation and what matters to you.</p>"+flex+"<div class='pf-trait-list'>"+items.map(traitCard).join("")+"</div><h3 class='pf-subhead'>Stress, overload & recovery signals</h3>"+renderStressManual(signals)+"<div class='pf-next-steps'><h3>Recovery questions</h3><ul><li>What changes after food, sleep, water, movement or a lower-input space?</li><li>Which difficult situation can you change, and which one first needs care or support?</li><li>What helps you return to a valued activity without demanding that the feeling disappear?</li></ul></div></section>";
}
function renderIdentitySection() {
  const ids=allSignals().filter(s=>s.dimension.group==="identity");
  return "<section class='pf-report-section' id='pf-identity'><p class='eyebrow'>Self-understanding & narrative</p><h2>Identity, worth and continuity</h2><p class='pf-section-lead'>Identity can be clear in some areas and in motion in others. Multiple versions of you can be real without one being the “true” one.</p><div class='pf-trait-list'>"+ids.map(traitCard).join("")+"</div><h3 class='pf-subhead'>What can affect your sense of worth</h3>"+renderSelfWorth()+renderNarrativeThemes()+"<p class='pf-small-note'>Self-worth sensitivities and chosen life-story themes are direct answers, not a diagnosis, cause or prediction.</p></section>";
}
function renderMisunderstandingSection(signals) {
  return "<section class='pf-report-section' id='pf-combinations'><p class='eyebrow'>More than one thing can be true</p><h2>Combinations, tensions & possible misreads</h2><p class='pf-section-lead'>These combinations are generated only when the relevant answers exist. Each card shows what data prompted it and a low-risk way to test whether it fits your life.</p>"+renderHypotheses(signals)+"<h3 class='pf-subhead'>What someone might misunderstand</h3>"+renderMisreads(signals)+"<p class='pf-small-note'>No combination here is a validated interaction. A conflict between two needs is not evidence that one is fake.</p></section>";
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
  const clear=strongestDirections(signals,3);
  const hypotheses=hypothesisList(signals);
  const experiments=[];
  if(clear[0]) experiments.push("For "+clear[0].dimension.title.toLowerCase()+", note one situation where this response pattern helps and one where it makes the task harder. Record the actual setting, not only your interpretation.");
  if(hypotheses[0]) experiments.push(hypotheses[0].experiment);
  experiments.push("For a week, write down one context cue before explaining a strong reaction: who was present, what was demanded, what your body needed and what choice was available.");
  return "<section class='pf-report-section' id='pf-use'><p class='eyebrow'>Level 3 · Use this</p><h2>Experiments, support & next steps</h2><p class='pf-section-lead'>Treat the map as a set of predictions to test in real settings. Keep what helps; revise what does not.</p>"+renderEnvironment(signals)+"<div class='pf-experiment-grid'>"+experiments.slice(0,3).map((x,i)=>"<article><span>EXPERIMENT 0"+(i+1)+"</span><p>"+esc(x)+"</p></article>").join("")+"</div><div class='pf-practical'><h3>A small operating manual</h3><ul><li><b>When planning:</b> decide which conditions are essential and which are preferences.</li><li><b>When working:</b> make the next action visible and match structure to the task.</li><li><b>When learning:</b> try the method you selected, then judge by what you can do afterward.</li><li><b>When relating:</b> say what closeness, space, repair and directness look like in observable behaviour.</li><li><b>When stressed:</b> check controllability, sensory load, body cues and available support before choosing a strategy.</li><li><b>When recovering:</b> protect time to settle; you do not have to earn rest by finishing everything.</li></ul></div></section>";
}
function renderValidity(signals) {
  const answered=signals.filter(s=>s.count>0).length;
  const required=signals.length;
  return "<section class='pf-limit-panel' id='pf-limits'><p class='eyebrow'>Read carefully · limits of this map</p><h2>This is an exploratory self-reflection profile, not a validated test.</h2><p>The public edition is fully built as a questionnaire and report, but the candidate items, response rules, archetype title rules and generated interpretations have not been psychometrically validated, normed or independently calibrated. The design documents explicitly treat the scales as candidates. A functioning assessment is not evidence that its measurements are reliable or valid.</p><p>This report uses "+answered+" of "+required+" repeated-item dimensions with at least one answer; a directional description requires every answered item in that scale to lean the same way. Direct single answers, best/worst value choices, scenarios and the right-now snapshot are kept separate. No overall personality score, percentile, clinical confidence interval or population comparison is produced.</p>"+reportUnknowns()+"<p class='pf-limit-ending'>The archetype is a playful story-title—not a diagnosis, category, or permanent identity. You can disagree with any interpretation.</p></section>";
}
function renderReportNavigation() {
  const links=[["pf-overview","Your story"],["pf-map","Your map"],["pf-combinations","Patterns"],["pf-values","Values"],["pf-relationships","Relationships"],["pf-work","Work & hobbies"],["pf-regulation","Emotion"],["pf-identity","Identity"],["pf-context","Context"],["pf-use","Next steps"],["pf-limits","Limits"]];
  return "<nav class='pf-report-nav' aria-label='Profile sections'>"+links.map(x=>"<a href='#"+esc(x[0])+"'>"+esc(x[1])+"</a>").join("")+"</nav>";
}

function renderResult(root) {
  const signals=allSignals(),title=titleFor(signals),paragraphs=narrative(signals);
  const filtered=signals.filter(s=>s.dimension.group==="temperament"||s.dimension.group==="dispositions");
  const headline=title.name;
  root.innerHTML=[
    "<div class='wrap pf-result-wrap'><header class='pf-result-hero'>",
    "<img class='pf-result-character' src='personality-map.png' alt='The Nobody’s Simple map character'>",
    "<p class='eyebrow'>Nobody’s Simple · Full personality profile · Public edition 1.0</p>",
    "<p class='pf-title-label'>Your story-title</p><h1>"+esc(headline)+"</h1>",
    "<p class='pf-archetype-tagline'>"+esc(title.tag)+"</p>",
    "<p class='pf-lore'>"+esc(title.lore)+"</p>",
    "<p class='pf-archetype-note'>"+esc(title.basis)+"</p>",
    "<p class='pf-tech-profile'>Your profile is made from separate response patterns across temperament, personality, attachment, regulation, motives, needs, values, identity and life domains. The title is not the measurement.</p>",
    "<div class='pf-version'><span>"+esc(VERSION)+"</span><span>No total score</span><span>Nothing sent to the site</span></div>",
    renderReportNavigation(),
    "</header><div id='pf-report-content'>",
    "<section class='pf-report-section pf-story-section' id='pf-overview'><p class='eyebrow'>Level 1 · Know me</p><h2>You in one minute · the fuller read</h2><p class='pf-section-lead'>A fuller interpretation of what your answers say—and what they cannot say—about how different systems may work together.</p><div class='pf-narrative'>"+paragraphs.map(p=>"<p>"+esc(p)+"</p>").join("")+"</div><div class='pf-story-cautions'><b>How to read this:</b> <span>Measured = answer pattern</span><span>Derived = transparent combination</span><span>Hypothesis = something to test</span><span>Not assessed = no claim</span></div></section>",
    "<section class='pf-report-section' id='pf-map'><p class='eyebrow'>Level 2 · Understand me</p><h2>Your characteristics & mechanisms</h2><p class='pf-section-lead'>Each scale card includes a definition, function, analogy, everyday cues, situations, possible needs and possible friction. Open the cards that matter to you; mixed answers are shown as mixed.</p><div class='pf-search'><label for='pf-search'>Find a pattern</label><input id='pf-search' type='search' placeholder='Try attachment, fatigue, curiosity…'><span id='pf-search-count' aria-live='polite'>"+filtered.length+" core cards shown</span></div><h3 class='pf-subhead'>Repeated-item patterns to start with</h3>"+renderStandouts(signals)+"<div class='pf-trait-list pf-core-traits'>"+filtered.map(traitCard).join("")+"</div><p class='pf-small-note'>Attachment, regulation, identity, work, money, learning and decision patterns are unpacked in their own sections below.</p></section>",
    renderMisunderstandingSection(signals),
    renderMotivesSection(),
    renderValuesSection(),
    renderRelationshipSection(signals),
    renderCareerSection(),
    renderMoneySection(signals),
    renderLearningSection(),
    renderDecisionSection(signals),
    "<section class='pf-report-section' id='pf-conflict'><p class='eyebrow'>Disagreement & repair</p><h2>Your conflict responses</h2><p class='pf-section-lead'>These hypothetical scenarios offer several possible first moves and let you name a second response. They are not a conflict type or a measure of what you have actually done.</p>"+renderCommunication()+"<h3 class='pf-subhead'>Scenario choices</h3>"+renderConflict()+"</section>",
    renderRegulationSection(signals),
    renderIdentitySection(),
    renderStateSection(),
    renderBestUse(signals),
    "<section class='pf-report-section' id='pf-confidence'><p class='eyebrow'>Evidence & uncertainty</p><h2>What has more support—and what remains open</h2><div class='pf-confidence-grid'><article><h3>Directly described</h3><p>Answers where multiple candidate items leaned consistently, your explicit work preferences, your selected values in the rounds shown, your scenario choices and your own story themes.</p></article><article><h3>Preliminary</h3><p>Any response pattern built from only a few candidate items and every combination hypothesis. These have no calibrated reliability or confidence interval.</p></article><article><h3>Still unknown</h3><p>Why these patterns developed, how much they change by context, what someone else observes and whether they predict outcomes in your life.</p></article></div><p class='pf-small-note'>The report does not call a person dishonest or internally inconsistent. Variation may reflect context, item wording or real complexity.</p></section>",
    renderValidity(signals),
    "<section class='pf-end-actions'><div><p class='eyebrow'>Level 3 · Use this</p><h2>The map is allowed to change.</h2><p>Keep a private copy if you want it. This report is not saved automatically or sent to the website.</p></div><div class='pf-action-buttons'><button type='button' class='button' id='pf-download'>Download my full profile</button><button type='button' class='button secondary' id='pf-print'>Print / save as PDF</button><button type='button' class='button secondary' id='pf-restart'>Start a new profile</button><a class='button secondary' href='#community'>Share general feedback</a><a href='#home'>← Back to the main website</a></div></section>",
    "</div></div>"
  ].join("");

  root.querySelector("#pf-download").addEventListener("click",()=>downloadFullReport(root));
  root.querySelector("#pf-print").addEventListener("click",()=>window.print());
  root.querySelector("#pf-restart").addEventListener("click",()=>{answers=Object.create(null);valueRounds=[];flow=[];stepIndex=0;phase="intro";render(root);});
  const search=root.querySelector("#pf-search");
  if(search)search.addEventListener("input",()=>{
    const term=search.value.trim().toLowerCase();
    const cards=[...root.querySelectorAll(".pf-trait-card")];
    cards.forEach(card=>card.hidden=!!term&&!card.textContent.toLowerCase().includes(term));
    root.querySelectorAll(".pf-trait-group").forEach(group=>group.hidden=!!term&&!group.querySelector(".pf-trait-card:not([hidden])"));
    const count=cards.filter(card=>!card.hidden).length;
    root.querySelector("#pf-search-count").textContent=count+" matching cards";
  });
  attachStateEvents(root);
  root.querySelectorAll(".pf-report-nav a").forEach(link=>link.addEventListener("click",()=>{}));
}

function downloadFullReport(root) {
  const content=root.querySelector("#pf-report-content");
  if(!content)return;
  const clone=content.cloneNode(true);
  clone.querySelectorAll("button,input,select,nav").forEach(x=>x.remove());
  clone.querySelectorAll("details").forEach(x=>x.open=true);
  const text="NOBODY’S SIMPLE · FULL PERSONALITY PROFILE 1.0\n\n"+clone.innerText.replace(/\n{3,}/g,"\n\n");
  try {
    const blob=new Blob([text],{type:"text/plain;charset=utf-8"});
    const url=URL.createObjectURL(blob),a=document.createElement("a");
    a.href=url;a.download="nobodys-simple-full-personality-profile.txt";
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
  phase="intro";
  render(root);
}
