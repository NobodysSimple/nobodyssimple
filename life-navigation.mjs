import { escapeHTML as esc } from "./core.mjs";

const CONTEXT_KEY = "ns-navigation-context-v1";
const PROJECTS_KEY = "ns-navigation-projects-v1";

const SETUP = {
  help: [
    ["understand", "I want to understand what is happening"],
    ["decide", "I need to make a decision"],
    ["plan", "I need a plan"],
    ["next", "I need to know what to do next"],
    ["compare", "I want to compare my options"],
    ["prepare", "I need to prepare for a conversation"],
    ["learn", "I want to learn enough to handle this myself"],
    ["prioritise", "I am overwhelmed and need help prioritising"],
    ["unsure", "I am not sure yet"],
  ],
  time: [
    ["quick", "2–3 minutes", "Point me in the right direction"],
    ["useful", "10 minutes", "Give me something useful"],
    ["proper", "20–30 minutes", "Work through this properly"],
    ["open", "Take as long as needed", "Build the full map"],
  ],
  knowledge: [
    ["novice", "Almost nothing", "Explain terms as they become relevant"],
    ["familiar", "I know the basics", "Skip the introductory layer"],
    ["researched", "I have researched this", "Compare assumptions and trade-offs"],
    ["expert", "I work or study in this area", "Go straight to harder questions"],
    ["unsure", "I am not sure how much I know", "Let the system calibrate gently"],
  ],
  capacity: [
    ["low", "Very little", "Keep this easy and concrete"],
    ["some", "Some", "A little reflection is possible"],
    ["normal", "Normal", "I can work through a map"],
    ["deep", "Ready to think deeply", "I can compare complexity"],
  ],
  urgency: [
    ["now", "Right now", "Give me a stabilising next move"],
    ["today", "Today", "Make the first step usable soon"],
    ["week", "This week", "Build an experiment and a review point"],
    ["month", "This month", "Create a short project"],
    ["none", "No immediate deadline", "Explore without rushing a conclusion"],
  ],
};

const DEPTHS = {
  quick: { title: "Quick Orientation", time: "2–5 min", limit: 3, text: "Find the likely problem class and one or two useful directions." },
  guided: { title: "Guided Map", time: "8–15 min", limit: 5, text: "Separate the main explanations and create a practical map." },
  deep: { title: "Deep Dive", time: "20–40 min", limit: 7, text: "Compare constraints, history, values, risks and realistic routes." },
  project: { title: "Project Mode", time: "Days / weeks", limit: 8, text: "Save the case, test routes in reality and update the model later." },
};

const MOMENTS = [
  ["many-things", "Several things feel wrong", "I do not know where to start"],
  ["stuck", "Something is holding everything back", "I keep hitting the same bottleneck"],
  ["decision", "I need to choose", "A major decision is taking up space"],
  ["direction", "I do not know what I want", "I need a direction, not a label"],
  ["career", "Career or education", "I need realistic routes"],
  ["relationship", "A relationship feels difficult", "I need to understand the pattern"],
  ["overload", "I cannot function like I used to", "Capacity has changed"],
  ["motivation", "I know what to do but cannot do it", "I need to debug the barrier"],
  ["mental-load", "My head feels full", "There are too many open loops"],
  ["identity", "I do not know who I am anymore", "An old role has changed"],
  ["environment", "My environment feels wrong", "I may be adapting too much"],
  ["money", "Money or independence", "I need a structural plan"],
  ["rebuild", "I need to rebuild things", "I need the right order"],
];

const SYSTEMS = [
  {
    id: "triage", moment: "many-things", group: "Start here", tone: "sunrise", icon: "01",
    title: "Life Triage", question: "Several things feel wrong. What should I actually deal with first?",
    blurb: "Find the load-bearing problems before trying to optimise everything at once.",
    tags: ["overwhelmed", "many things", "prioritise", "stuck", "life"],
    focus: ["physical capacity", "sleep and health", "money", "work or study", "relationships", "environment", "uncertainty", "executive load"],
    questions: [
      { id: "load", type: "multi", title: "Which areas are carrying load right now?", prompt: "Choose any that feel meaningfully involved. You can change this later.", options: ["Body, sleep or health", "Money or housing", "Work or study", "Relationship or family", "Loneliness or support", "Sensory or environmental load", "Admin or unfinished tasks", "A major unresolved decision", "Meaning or identity"] },
      { id: "impact", type: "scale", title: "How much is this affecting ordinary functioning?", prompt: "Think about starting, sleeping, eating, communicating or doing necessary tasks.", min: 0, max: 10, low: "Mostly manageable", high: "It is shaping the day" },
      { id: "upstream", type: "choice", title: "Which description feels closest to the centre of the problem?", options: ["One practical problem is creating several consequences", "Everything is interacting and I cannot find the first move", "My capacity has dropped, so every problem feels larger", "A decision or uncertainty is keeping other things open", "A relationship or environment is repeatedly reactivating the load", "I do not know yet"] },
      { id: "capacity", type: "choice", title: "What needs protecting before improvement is realistic?", options: ["Sleep, food, medication or physical recovery", "Safety, housing or money stability", "Time without demands", "A clear conversation or boundary", "Support from another person", "A smaller list of immediate obligations"] },
      { id: "first", type: "text", title: "If one thing became 30% easier, what would help the rest?", prompt: "Name the change in ordinary language. This is a hypothesis, not a commitment.", placeholder: "For example: knowing where I am heading with work…" },
      { id: "priority", type: "choice", title: "What kind of output would help most?", options: ["A stabilising plan for the next few days", "A ranked map of upstream problems", "A route into a more specific system", "A way to explain the situation to someone else"] },
      { id: "review", type: "text", title: "What would tell you that the first priority was the right one?", prompt: "Use an observable sign rather than ‘I feel fixed’.", placeholder: "I would notice…" },
    ],
    map: ["current capacity", "load-bearing constraint", "downstream consequences", "available support"],
    levers: ["stabilise capacity before analysis", "reduce the most upstream practical constraint", "close one unresolved decision", "protect recovery and ask for support"],
    teach: { novice: "Triage is not a ranking of what matters most emotionally. It is a way to find a first step that may reduce several pressures at once.", familiar: "The loudest problem is not always the best starting point. Compare what is urgent with what would make the next step easier.", advanced: "Treat the output as a provisional causal model. Competing explanations remain live until an observation or small test changes the map." },
    counter: "The most visible problem may be downstream of sleep, money, environment, health, a relationship cycle or a decision that has remained open.",
    routes: ["Stabilise essentials first", "Investigate the upstream constraint", "Choose one route into a specialist system", "Hold the map open and gather one missing fact"],
  },
  {
    id: "bottleneck", moment: "stuck", group: "Priority", tone: "moss", icon: "02",
    title: "Life Bottleneck Finder", question: "What change would make the largest part of life easier?",
    blurb: "Search for the most upstream modifiable constraint instead of fixing whichever problem shouts loudest.",
    tags: ["bottleneck", "upstream", "constraint", "transport", "sleep", "stuck"],
    focus: ["upstream causes", "dependencies", "modifiability", "spillover", "cheap tests"],
    questions: [
      { id: "problems", type: "multi", title: "Which difficulties seem connected?", options: ["Employment or study access", "Transport or location", "Sleep or energy", "Money or dependence", "Relationship tension", "Task initiation", "Health or appointments", "Social access", "Environment or sensory load"] },
      { id: "network", type: "choice", title: "If one area improved, which would probably shift first?", options: ["Energy and capacity", "Access to work, study or people", "Financial independence", "Relationship pressure", "Task completion and admin", "I cannot tell yet"] },
      { id: "modifiable", type: "choice", title: "Which kind of change is most available?", options: ["I can change my own next action", "I can negotiate an adjustment", "I can change the environment", "I need another person or service", "The constraint is currently hard to change"] },
      { id: "test", type: "text", title: "What is one small test that could show whether this is truly upstream?", placeholder: "For example: trial a different route, ask about an adjustment, protect a sleep window…" },
      { id: "tradeoff", type: "choice", title: "What solution are you most tempted to jump to?", options: ["Buy or acquire something", "Quit, leave or cut something off", "Push myself harder", "Wait until I feel certain", "Ask someone else to change", "I am not sure"] },
      { id: "evidence", type: "text", title: "What evidence would prove the bottleneck hypothesis wrong?", placeholder: "It would be wrong if…" },
      { id: "next", type: "choice", title: "What would you like to do with the result?", options: ["Run the smallest test", "Compare several solutions", "Take it into a decision system", "Save it and observe for a week"] },
    ],
    map: ["candidate bottleneck", "systems affected", "modifiable point", "unresolved alternative"],
    levers: ["test the upstream constraint before buying a solution", "change access rather than demanding more effort", "reduce dependency through a reversible experiment", "ask for an adjustment or shared resource"],
    teach: { novice: "A bottleneck is a constraint that limits several other areas. It is not necessarily the most serious or emotionally painful problem.", familiar: "Look for connections: if improving A changes B, C and D, A may be an efficient place to test a change.", advanced: "Keep correlation separate from causation. A working map is a testable hypothesis, not proof that one variable causes the whole system." },
    counter: "A tempting purchase, new routine or dramatic decision may be a downstream solution that leaves the original constraint intact.",
    routes: ["Run a low-cost bottleneck test", "Change the environment or access", "Negotiate an adjustment", "Delay the large solution until the dependency is clearer"],
  },
  {
    id: "crossroads", moment: "decision", group: "Decisions", tone: "violet", icon: "03",
    title: "Crossroads", question: "What am I actually choosing, and what would be wise to learn first?",
    blurb: "Separate knowable facts, discoverable experience and uncertainty you cannot eliminate.",
    tags: ["decision", "options", "compare", "career", "move", "choose"],
    focus: ["options", "values", "constraints", "opportunity cost", "reversibility", "unknowns"],
    questions: [
      { id: "choice", type: "text", title: "What are you choosing between?", placeholder: "Write the choice as two or more routes, not a verdict…" },
      { id: "deadline", type: "choice", title: "How real is the decision deadline?", options: ["I must act now", "There is a date this week", "There is a date this month", "The deadline is partly imagined", "There is no immediate deadline"] },
      { id: "reversible", type: "choice", title: "How reversible is the choice?", options: ["Easy to undo", "Possible to change with cost", "Difficult to reverse", "The practical choice is reversible but the emotional meaning feels large", "I do not know yet"] },
      { id: "unknown", type: "multi", title: "What kind of unknowns are present?", options: ["A fact I can look up", "An experience I can trial", "Another person’s response", "A financial or practical constraint", "A value conflict", "An outcome nobody can predict"] },
      { id: "values", type: "choice", title: "What is the main trade-off?", options: ["Security versus possibility", "Closeness versus independence", "Income versus time", "Status or recognition versus sustainability", "Short-term relief versus long-term direction", "Several values are competing"] },
      { id: "route", type: "choice", title: "What help do you want from the decision map?", options: ["Compare the options", "Find missing information", "Design a trial", "Reduce the options", "Prepare to commit", "Review a provisional choice"] },
      { id: "text", type: "text", title: "What would you regret not testing?", placeholder: "The experience or conversation I would want before committing is…" },
    ],
    map: ["decision object", "values in tension", "knowable facts", "trial evidence", "irreducible uncertainty"],
    levers: ["clarify the actual decision", "gather only information that could change the choice", "design a reversible trial", "name the uncertainty you are willing to carry"],
    teach: { novice: "Not every unknown deserves more research. Some are facts, some are discoverable through experience and some are fundamentally uncertain.", familiar: "A good decision process scales effort with reversibility and consequence rather than with anxiety alone.", advanced: "Separate preference, prediction and constraint. Opportunity cost is part of the decision even when it is not visible in the options list." },
    counter: "The feeling of needing certainty may be the problem, not evidence that certainty is available.",
    routes: ["Decide with the information already sufficient", "Gather one decision-changing fact", "Run a reversible trial", "Set a review date and deliberately postpone"],
  },
  {
    id: "direction", moment: "direction", group: "Direction", tone: "blue", icon: "04",
    title: "Direction Finder", question: "What kind of life architecture could fit me?",
    blurb: "Build several coherent possible lives from energy, admiration, lifestyle and tolerable sacrifice—not one purpose label.",
    tags: ["purpose", "direction", "future", "values", "identity", "career"],
    focus: ["energy", "envy and admiration", "lifestyle", "sacrifice", "responsibility", "possible selves"],
    questions: [
      { id: "energy", type: "multi", title: "What kinds of activity reliably draw you in?", options: ["Understanding complex things", "Helping or protecting people", "Making something tangible", "Leading or coordinating", "Exploring and changing route", "Building security", "Performing or communicating", "Solving practical problems"] },
      { id: "admire", type: "choice", title: "What do you most often admire in other people?", options: ["Freedom", "Mastery", "Care", "Courage", "Originality", "Stability", "Influence", "Wisdom"] },
      { id: "life", type: "choice", title: "What should work and ambition make room for?", options: ["A calm home", "Relationships and family", "Travel and novelty", "Creative projects", "Community contribution", "Financial independence", "Learning and expertise"] },
      { id: "sacrifice", type: "multi", title: "Which sacrifices feel unacceptable?", options: ["My health or recovery", "Close relationships", "Autonomy", "Financial security", "Location or mobility", "Time for creativity", "Meaning or integrity", "I am unsure"] },
      { id: "possible", type: "choice", title: "Which future self feels most alive to explore?", options: ["Research-heavy professional", "Clinical or service-oriented", "Creative or independent portfolio", "Community builder or organiser", "Skilled practical specialist", "Stable life with rich private interests", "Several are plausible"] },
      { id: "barrier", type: "choice", title: "What currently makes direction hardest?", options: ["Too many plausible routes", "I do not know enough about the routes", "Capacity or money", "Fear of choosing wrong", "Other people’s expectations", "My preferences change by context"] },
      { id: "experiment", type: "text", title: "What could you try without committing your whole future?", placeholder: "A conversation, short course, shadowing, project or weekly experiment…" },
    ],
    map: ["what energises you", "life you want work to support", "sacrifices you reject", "possible directions", "testable assumptions"],
    levers: ["turn admiration into a condition rather than an identity", "compare life architectures before job titles", "test the route with real-world exposure", "separate a preferred life from inherited expectations"],
    teach: { novice: "Direction is not a single hidden answer. It is a set of routes that organise work, relationships, time, money and identity differently.", familiar: "Compare what each route gives and asks. A direction becomes credible when its sacrifices are acceptable, not only when its benefits are attractive.", advanced: "Use optionality and career capital as explicit variables. Ask which route preserves future choices while producing useful evidence now." },
    counter: "Not knowing your final direction may be a rational response to limited experience, not proof that you lack a self.",
    routes: ["Explore the route with the highest curiosity", "Gather route information from people doing it", "Build a portfolio experiment", "Choose a stable base while keeping a second direction alive"],
  },
  {
    id: "career", moment: "career", group: "Work & study", tone: "green", icon: "05",
    title: "Career Strategy", question: "What work route fits the life I actually want?",
    blurb: "Compare environments, qualifications, labour-market routes and experiments—not personality to job title.",
    tags: ["career", "job", "work", "study", "training", "CV"],
    focus: ["workday", "skills", "qualifications", "income", "location", "risk", "time horizon"],
    questions: [
      { id: "now", type: "choice", title: "Where are you starting from?", options: ["Exploring from scratch", "Studying or recently qualified", "Working but considering a change", "Underemployed or between roles", "Returning after a gap", "Already in a route but unsure"] },
      { id: "workday", type: "multi", title: "Which work conditions matter most?", options: ["Autonomy", "Predictability", "Intellectual challenge", "Practical activity", "Creative expression", "Social contact", "Quiet concentration", "Recognition", "Social impact", "Financial reward"] },
      { id: "constraint", type: "multi", title: "What constrains the route?", options: ["Income floor", "Location or commute", "Training time", "Fees or debt", "Health or capacity", "Family or relationship", "Visa or legal status", "Competition", "Unclear information"] },
      { id: "route", type: "choice", title: "Which route are you most curious about?", options: ["Clinical or helping", "Research or academic", "Applied industry", "Creative or independent", "Technical or practical", "Public, policy or community", "Several adjacent routes"] },
      { id: "advert", type: "text", title: "Paste one real job, course or training advert if you have one", prompt: "Optional. The system can compare the language with your stated conditions.", placeholder: "Paste the advert or write ‘none’…" },
      { id: "gap", type: "choice", title: "What is the most important gap to close?", options: ["Information about the work", "A qualification", "Demonstrated experience", "Confidence or application practice", "Transport, money or access", "I do not know yet"] },
      { id: "test", type: "text", title: "What could you test before committing to a route?", placeholder: "Interview someone, shadow, volunteer, make a sample, apply, attend a session…" },
    ],
    map: ["current position", "preferred work architecture", "constraints", "career capital", "route experiments"],
    levers: ["get real-world exposure before more abstract research", "close the smallest experience gap", "compare the life supported by each route", "protect income and optionality while testing"],
    teach: { novice: "A job title tells you less than the actual workday, conditions, qualifications, progression and labour market around it.", familiar: "The useful comparison is person–environment fit plus opportunity cost, not whether a role sounds interesting in isolation.", advanced: "Treat routes as portfolios of career capital, optionality and constraints. Ask which assumptions are untested and which evidence would change your ranking." },
    counter: "A route that sounds meaningful may still be a poor fit if its training cost, workload, supervision or income conflict with the life it is supposed to support.",
    routes: ["Investigate the strongest route with one conversation", "Build a small portfolio or shadowing experiment", "Close a named qualification or experience gap", "Choose a bridge role that preserves options"],
  },
  {
    id: "relationship-crossroads", moment: "relationship", group: "Relationships", tone: "rose", icon: "06",
    title: "Relationship Crossroads", question: "What would need to become true for staying, repairing or leaving to make sense?",
    blurb: "Separate acute rupture, repeated cycle, mismatch, capacity and safety without producing a yes/no verdict.",
    tags: ["relationship", "stay", "leave", "repair", "trust", "conflict"],
    focus: ["pattern", "need", "repair", "responsibility", "compatibility", "safety"],
    questions: [
      { id: "problem", type: "choice", title: "What kind of problem feels closest?", options: ["An acute event", "A repeating interaction cycle", "A need mismatch", "A communication failure", "A trust rupture", "A life-goal mismatch", "Capacity or external stress", "Safety, coercion or control"] },
      { id: "repair", type: "choice", title: "What happens after something goes wrong?", options: ["We repair and behaviour changes", "We talk but the same thing returns", "One person carries most of the repair", "We avoid the conversation", "Repair is not currently safe or possible", "I am not sure"] },
      { id: "need", type: "multi", title: "What do you most need to understand?", options: ["Whether the issue is temporary", "Whether the need is negotiable", "Whether trust can rebuild", "Whether responsibility is shared", "Whether desire or connection has changed", "Whether I am staying from fear or hope", "What leaving would and would not solve"] },
      { id: "evidence", type: "text", title: "What change are you hoping for, and what evidence supports that hope?", placeholder: "The change would be… I have seen / not seen…" },
      { id: "trial", type: "choice", title: "What would a fair repair trial need?", options: ["A clear conversation", "A measurable behaviour change", "A boundary and a return point", "Outside support", "A period of space", "A safety plan or professional support"] },
      { id: "choice", type: "choice", title: "What help do you want today?", options: ["Understand the relationship pattern", "Prepare a conversation", "Design a repair trial", "Clarify what I can control", "Think about leaving safely"] },
      { id: "text", type: "text", title: "What do you already know but keep arguing yourself out of?", placeholder: "I keep returning to…" },
    ],
    map: ["trigger or rupture", "need and meaning", "each person’s responsibility", "repair evidence", "compatibility or safety"],
    levers: ["make the requested change observable", "separate your responsibility from theirs", "set a repair trial with a review date", "prioritise safety and support where necessary"],
    teach: { novice: "A relationship problem can be acute, repeated, structural or unsafe. The same advice does not fit each kind.", familiar: "Repair is not only a conversation. It includes accountability, changed behaviour, shared responsibility and a return to safety.", advanced: "Model the interaction at the level of trigger, interpretation, response, partner response and function. Avoid turning a cycle into a trait verdict about either person." },
    counter: "Love, history and hope can coexist with incompatibility or an absence of behavioural repair. Feeling strongly does not answer whether the system is workable.",
    routes: ["Run a specific repair trial", "Clarify the need and boundary", "Gather evidence about willingness to change", "Plan a supported and safe separation route"],
  },
  {
    id: "relationship-pattern", moment: "relationship", group: "Relationships", tone: "plum", icon: "07",
    title: "Relationship Pattern Lab", question: "Why do we keep ending up here?",
    blurb: "Reconstruct an actual interaction and find interruption points instead of assigning an attachment label.",
    tags: ["relationship", "cycle", "argument", "attachment", "pattern", "repair"],
    focus: ["trigger", "interpretation", "emotion", "response", "function", "repair"],
    questions: [
      { id: "trigger", type: "text", title: "What happened immediately before the cycle began?", placeholder: "A message, request, silence, disagreement or change…" },
      { id: "meaning", type: "choice", title: "What did you or the other person seem to conclude?", options: ["I am not safe or valued", "I am being controlled", "I will be blamed", "My need is not understood", "This will become a larger conflict", "The meaning was unclear"] },
      { id: "response", type: "multi", title: "What responses followed?", options: ["Ask for reassurance or clarity", "Explain or defend", "Withdraw or take space", "Press for an answer", "Accommodate or apologise", "Become angry or direct", "Distract or postpone", "Try to repair"] },
      { id: "function", type: "choice", title: "What did the response accomplish in the short term?", options: ["Reduced uncertainty", "Protected autonomy", "Stopped escalation", "Made the impact visible", "Restored closeness", "Bought time", "Nothing changed"] },
      { id: "next", type: "choice", title: "What happened next?", options: ["The other person moved closer", "The other person withdrew", "The issue was resolved", "The argument escalated", "We returned later", "The pattern stayed unresolved"] },
      { id: "interrupt", type: "choice", title: "Where might the cycle be interrupted?", options: ["Before interpreting the trigger", "Before sending or saying the first response", "By naming the underlying need", "By agreeing a return point", "By changing the environment or timing", "I cannot see an interruption point yet"] },
      { id: "text", type: "text", title: "What would each person say they are trying to protect?", placeholder: "I am protecting… they may be protecting…" },
    ],
    map: ["trigger", "interpretation", "emotion and body state", "response function", "partner response", "loop"],
    levers: ["slow the interpretation before the response", "name the need without demanding the other person solve it", "make space have a return point", "change the timing or channel of the conversation"],
    teach: { novice: "A cycle describes how two responses shape each other. It is more useful than asking which person is the problem.", familiar: "A response can be understandable and still maintain the loop. Analyse what it accomplishes immediately and what it costs later.", advanced: "Distinguish trigger, meaning, behaviour and reinforcement. The same person may occupy different positions in different cycles." },
    counter: "The first visible behaviour may be a response to an earlier cue. That does not remove responsibility, but it changes where an interruption might work.",
    routes: ["Map the cycle with the other person", "Change one response at the earliest interruption point", "Agree a pause and return structure", "Seek support when the cycle cannot be safely interrupted alone"],
  },
  {
    id: "burnout", moment: "overload", group: "Capacity", tone: "copper", icon: "08",
    title: "Burnout & Overload Map", question: "What changed, and what kind of capacity loss is this?",
    blurb: "Separate workload, recovery, sensory demand, emotional strain, meaning loss, health and structural mismatch.",
    tags: ["burnout", "exhausted", "overload", "capacity", "recovery", "stress"],
    focus: ["sleep and recovery", "workload", "sensory load", "emotional load", "decision load", "health", "autonomy"],
    questions: [
      { id: "change", type: "choice", title: "What changed first?", options: ["Sleep or physical health", "Workload or deadlines", "Relationship or caregiving demand", "Sensory or social density", "Decision and admin load", "Meaning or motivation", "Nothing obvious; it accumulated"] },
      { id: "loads", type: "multi", title: "Which loads are consuming capacity?", options: ["Physical", "Sleep or recovery", "Cognitive or decision", "Emotional", "Social", "Sensory", "Role conflict", "Financial or practical", "Lack of autonomy"] },
      { id: "timeline", type: "choice", title: "How long has the change been present?", options: ["A few days", "Several weeks", "Several months", "It comes in waves", "I cannot tell"] },
      { id: "tank", type: "scale", title: "How much usable capacity is left today?", min: 0, max: 10, low: "Almost empty", high: "Enough to think and act" },
      { id: "reduce", type: "multi", title: "What could be reduced, protected or paused?", options: ["A demand", "Sensory input", "Social contact", "A decision", "A standard", "A responsibility", "A work or study commitment", "Nothing feels negotiable"] },
      { id: "health", type: "choice", title: "What kind of support is relevant?", options: ["Recovery and rest design", "A practical adjustment", "A conversation about workload", "Medical or physical-health input", "Emotional support", "I need to stabilise before deciding"] },
      { id: "text", type: "text", title: "What would ‘less load’ look like in one ordinary day?", placeholder: "A day with less load would include…" },
    ],
    map: ["change over time", "load profile", "remaining capacity", "protective recovery", "structural change"],
    levers: ["reduce load before adding a self-improvement task", "protect sleep and physical recovery", "change the demand or environment", "seek health or practical support"],
    teach: { novice: "Overload is not one thing. A person can be depleted by physical, sensory, emotional, social, cognitive or structural demands.", familiar: "The useful distinction is what to reduce, what to protect, what to recover and what needs a structural change.", advanced: "Treat the timeline and load interactions as central evidence. A short-term rest response cannot solve a chronic demand mismatch by itself." },
    counter: "A motivation problem may be a capacity problem in disguise. Pushing harder can make the next week less informative, not more productive.",
    routes: ["Reduce immediate load today", "Build a one-week recovery experiment", "Negotiate a structural adjustment", "Track the pattern and seek appropriate support"],
  },
  {
    id: "motivation", moment: "motivation", group: "Action", tone: "yellow", icon: "09",
    title: "Motivation Diagnostic", question: "Why am I not doing the thing?",
    blurb: "Debug value, clarity, energy, reward, fear, scope, skill and environment before moralising the delay.",
    tags: ["motivation", "procrastination", "start", "avoid", "focus", "task"],
    focus: ["value", "next action", "energy", "reward", "evaluation", "uncertainty", "scope", "environment"],
    questions: [
      { id: "goal", type: "text", title: "What outcome are you trying to create?", placeholder: "The thing I say I need to do is…" },
      { id: "want", type: "choice", title: "Do you actually want the outcome?", options: ["Yes, strongly", "Mostly, but not the cost", "I want the consequences more than the task", "Someone else wants it", "I am unsure"] },
      { id: "barrier", type: "multi", title: "What stops the next action?", options: ["I do not know the next step", "Low energy", "Boredom or low reward", "Fear of judgement", "Perfectionism or unclear standard", "Uncertainty", "The task is too large", "Environment or interruptions", "Competing needs or rewards", "Skill gap"] },
      { id: "start", type: "choice", title: "What happens when you try to begin?", options: ["I avoid opening it", "I research instead", "I start and switch", "I over-prepare", "I work only under urgency", "I can start but cannot sustain", "I do not know"] },
      { id: "support", type: "choice", title: "Which intervention sounds most useful?", options: ["Make it clearer", "Make it smaller", "Make it more rewarding", "Reduce evaluation fear", "Build external structure", "Change the environment", "Question whether the goal is mine"] },
      { id: "scope", type: "choice", title: "What would ‘finished enough’ mean?", options: ["A concrete minimum", "A quality threshold", "A submitted or shared version", "A decision to stop", "I cannot define it yet"] },
      { id: "text", type: "text", title: "What is the smallest honest next action?", placeholder: "Open…, write…, ask…, book…, move…" },
    ],
    map: ["desired outcome", "next action clarity", "activation barrier", "reinforcement", "environment", "completion rule"],
    levers: ["define the next physical action", "reduce scope and evaluation cost", "change the reward or environment", "question whether the goal belongs to you"],
    teach: { novice: "Knowing what to do is different from being able to start. Motivation can fail because of clarity, capacity, reward, fear, scope, skill or context.", familiar: "Name the bottleneck before choosing a productivity technique. A clearer task needs a different intervention from a threatening task.", advanced: "Separate goal value, action selection, effort allocation and reinforcement. The same delay can arise from different mechanisms in different contexts." },
    counter: "More education may not help if the real gap is implementation, emotional cost, resources, capacity or a decision about whether the goal is yours.",
    routes: ["Make the next action visible and tiny", "Design a reward and accountability loop", "Reduce evaluation and scope", "Reconsider the goal or change the environment"],
  },
  {
    id: "mental-load", moment: "mental-load", group: "Cognitive environment", tone: "sky", icon: "10",
    title: "Mental Load Audit", question: "Why does my head feel full all the time?",
    blurb: "Turn tasks, worries, waiting items and emotional concerns into a system you can redesign.",
    tags: ["mental load", "brain dump", "tasks", "admin", "worry", "organise"],
    focus: ["active projects", "decisions", "waiting items", "admin", "emotional labour", "uncertainty"],
    questions: [
      { id: "items", type: "multi", title: "What is occupying the mental space?", options: ["Tasks to do", "Decisions", "Things waiting on someone else", "Information to find", "Promises or responsibilities", "Worries", "Relationship concerns", "Ideas and projects", "Admin"] },
      { id: "loop", type: "choice", title: "What keeps the loop active?", options: ["Fear of forgetting", "No trusted place to capture it", "Too many active projects", "Unclear next actions", "Responsibility for other people", "Uncertainty", "Guilt when I rest"] },
      { id: "classify", type: "multi", title: "Which categories would help you empty the system?", options: ["Do now", "Schedule", "Delegate", "Waiting", "Needs information", "Needs a decision", "Drop", "Emotional concern, not a task"] },
      { id: "capacity", type: "scale", title: "How much sorting capacity do you have today?", min: 0, max: 10, low: "Almost none", high: "Enough to redesign the system" },
      { id: "promise", type: "choice", title: "Where do you most often over-carry?", options: ["Practical tasks", "Other people’s emotions", "Keeping options open", "Remembering details", "Preventing mistakes", "I do not know"] },
      { id: "system", type: "choice", title: "What would make the biggest difference?", options: ["A trusted capture place", "Fewer active projects", "Clear next actions", "A weekly review", "A conversation about responsibility", "Dropping or postponing commitments"] },
      { id: "text", type: "text", title: "Name one open loop you are ready to classify", placeholder: "The loop is…" },
    ],
    map: ["open loops", "uncertainty", "responsibility", "capture system", "active projects", "decisions"],
    levers: ["capture everything once", "reduce active projects", "convert a worry into a decision or observation", "renegotiate responsibility"],
    teach: { novice: "Mental load is not simply the number of tasks. It includes remembering, anticipating, deciding, waiting and carrying other people’s needs.", familiar: "A prettier list is not enough if the system keeps generating unresolved responsibility. Redesign the source of the load.", advanced: "Differentiate storage failure, decision backlog, responsibility diffusion and uncertainty maintenance. Each needs a different intervention." },
    counter: "If every item is treated as a task, emotional concerns and structural problems become endless to-do lists.",
    routes: ["Empty and classify one page", "Close one decision backlog", "Reduce or delegate active commitments", "Build a weekly review and waiting list"],
  },
  {
    id: "identity", moment: "identity", group: "Identity & change", tone: "indigo", icon: "11",
    title: "Identity Transition", question: "How do I maintain continuity while allowing myself to change?",
    blurb: "Map what ended, what remains true, what is undefined and which possible selves are worth testing.",
    tags: ["identity", "graduation", "breakup", "diagnosis", "change", "transition"],
    focus: ["old roles", "values", "loss", "relief", "continuity", "possible selves"],
    questions: [
      { id: "ended", type: "text", title: "What ended or changed?", placeholder: "A role, relationship, place, diagnosis, job, community or expectation…" },
      { id: "roles", type: "multi", title: "What did the old identity give you?", options: ["Belonging", "Structure", "Recognition", "Purpose", "Competence", "Safety", "A future story", "People who understood me"] },
      { id: "values", type: "multi", title: "What remains true even though the role changed?", options: ["What I care about", "How I treat people", "My curiosity", "My creativity", "My standards", "My need for freedom", "My capacity to learn", "I am not sure yet"] },
      { id: "relief", type: "choice", title: "What are you relieved to lose?", options: ["Pressure to perform a role", "Other people’s expectations", "A harmful environment", "Uncertainty about the old path", "A responsibility I could not sustain", "I do not feel relief yet"] },
      { id: "possible", type: "choice", title: "Which possible self is appearing?", options: ["A quieter self", "A more independent self", "A more connected self", "A more creative self", "A more skilled or professional self", "A self I cannot name yet"] },
      { id: "experiment", type: "choice", title: "What would help you test continuity?", options: ["Keep one old practice", "Try a new role in a low-stakes way", "Talk to someone who knows the transition", "Make a timeline", "Let the undefined period exist longer"] },
      { id: "text", type: "text", title: "What are you carrying forward?", placeholder: "I want to keep…" },
    ],
    map: ["ended role", "lost functions", "surviving values", "undefined space", "possible self", "continuity experiment"],
    levers: ["name the function the old role provided", "keep continuity without recreating the old identity", "test a possible self through action", "allow an undefined period without treating it as failure"],
    teach: { novice: "Identity transition is not a demand to find a final self. It is the work of reorganising continuity when a role, place or relationship changes.", familiar: "Ask what a role did for you, not only what it was called. Functions can often be rebuilt in a different form.", advanced: "Separate narrative continuity, social recognition, values and enacted roles. Identity change can be both chosen and constrained." },
    counter: "Feeling undefined may reflect a real transition rather than a hidden defect in your personality.",
    routes: ["Preserve one stabilising continuity", "Test one emerging identity through action", "Grieve and document what ended", "Let the transition remain open while gathering experience"],
  },
  {
    id: "environment", moment: "environment", group: "Environment", tone: "teal", icon: "12",
    title: "Environment Fit", question: "Is something wrong with me, or is the environment asking too much adaptation?",
    blurb: "Compare sensory density, social density, autonomy, pace, privacy, hierarchy and task design with what you need.",
    tags: ["environment", "workplace", "home", "university", "sensory", "fit"],
    focus: ["sensory density", "social density", "autonomy", "predictability", "interruptions", "pace", "privacy", "commute"],
    questions: [
      { id: "setting", type: "choice", title: "Which environment are you examining?", options: ["Work", "University or training", "Home", "Relationship household", "City or neighbourhood", "Social community", "Several settings"] },
      { id: "friction", type: "multi", title: "Where is adaptation most expensive?", options: ["Sound, light or sensory density", "Interruptions", "Social performance", "Low autonomy", "Unpredictable change", "Pace or deadlines", "Hierarchy", "Lack of privacy", "Commute or access", "Values mismatch"] },
      { id: "fit", type: "choice", title: "What is the strongest fit signal?", options: ["The task is meaningful but the setting is wrong", "The setting is fine but the role is wrong", "Both task and setting fit poorly", "I adapt well but pay for it later", "The environment is supportive in some contexts only", "I cannot tell"] },
      { id: "change", type: "choice", title: "What kind of solution is most realistic?", options: ["Adapt myself temporarily", "Negotiate an adjustment", "Change the environment", "Change the task or role", "Build recovery around the environment", "Gather more evidence first"] },
      { id: "measure", type: "scale", title: "How much energy does the environment consume before the actual task begins?", min: 0, max: 10, low: "Very little", high: "Most of the available capacity" },
      { id: "text", type: "text", title: "Describe one ordinary moment when the environment becomes expensive", placeholder: "For example: open-plan interruptions before I can begin…" },
      { id: "adjustment", type: "text", title: "What adjustment would make the biggest immediate difference?", placeholder: "A quiet period, clearer ownership, flexible location, shorter commute…" },
    ],
    map: ["person’s needs", "environment demands", "adaptation cost", "negotiable adjustment", "structural mismatch"],
    levers: ["change the environment before blaming capacity", "negotiate one concrete adjustment", "separate task fit from setting fit", "measure recovery cost as part of fit"],
    teach: { novice: "Fit is not a verdict on you or the environment. It is a comparison between demands, resources and what you need to function sustainably.", familiar: "Distinguish adapt yourself, negotiate an adjustment and change the environment. They have different costs and responsibilities.", advanced: "Treat adaptation cost as data. A setting can be workable in output terms while unsustainable in recovery, identity or health terms." },
    counter: "Being capable of surviving an environment does not prove that it is a sustainable fit.",
    routes: ["Run a one-week adjustment trial", "Negotiate one environmental change", "Move to a better-fit role or setting", "Keep the setting temporarily while building an exit route"],
  },
  {
    id: "money", moment: "money", group: "Money & independence", tone: "copper", icon: "13",
    title: "Money & Independence Strategy", question: "What financial structure would make my next life move more possible?",
    blurb: "Map security, independence, income, fixed costs, uncertainty and behaviour without dressing generic advice up as psychology.",
    tags: ["money", "budget", "independence", "car", "move out", "savings"],
    focus: ["income", "fixed costs", "savings", "future commitments", "risk", "independence"],
    questions: [
      { id: "goal", type: "choice", title: "What are you trying to achieve?", options: ["Stop feeling financially chaotic", "Build an emergency buffer", "Move out or change housing", "Buy transport or a major item", "Change job or retrain", "Become more independent", "Plan a shared future"] },
      { id: "structure", type: "multi", title: "Which parts of the financial map are clear?", options: ["Income", "Fixed costs", "Variable spending", "Savings", "Debt or commitments", "Future costs", "Support available", "Almost none are clear yet"] },
      { id: "barrier", type: "choice", title: "What makes money hardest to handle?", options: ["Avoiding the numbers", "Unpredictable income", "Scarcity pressure", "Spending for relief or reward", "Too many competing goals", "Lack of knowledge", "The numbers are clear but the decision is hard"] },
      { id: "risk", type: "choice", title: "What are you most unwilling to risk?", options: ["Housing or safety", "Freedom and mobility", "Time", "Relationship stability", "Future options", "Comfort or enjoyment", "I am unsure"] },
      { id: "time", type: "choice", title: "What horizon matters?", options: ["This week", "This month", "The next six months", "One to three years", "I need a flexible plan"] },
      { id: "plan", type: "choice", title: "What would help right now?", options: ["One financial decision", "A structural map", "Compare two purchases or routes", "A monthly review system", "Learn the basics", "Reduce avoidance"] },
      { id: "text", type: "text", title: "What financial decision is currently taking up the most space?", placeholder: "I am deciding whether to…" },
    ],
    map: ["financial aim", "resources", "commitments", "risk meaning", "behavioural barrier", "review horizon"],
    levers: ["make the numbers visible without turning them into a threat", "separate security, freedom and ordinary spending", "delay a major purchase until the actual constraint is clear", "build independence in stages"],
    teach: { novice: "Financial structure means knowing what enters, what must leave, what is flexible and which future costs need protection.", familiar: "The key decision is often not ‘can I afford it?’ but ‘which future option does this choice use up?’", advanced: "Model liquidity, optionality, risk concentration and opportunity cost. Keep behavioural avoidance separate from financial literacy." },
    counter: "A lack of knowledge and an emotional barrier can look identical from the outside. More information will not solve avoidance by itself.",
    routes: ["Make one number visible", "Create a staged independence plan", "Compare the options and opportunity costs", "Set a monthly review and delay irreversible commitments"],
  },
  {
    id: "rebuild", moment: "rebuild", group: "Foundations", tone: "night", icon: "14",
    title: "Life Rebuild", question: "If I started from here, what order should I rebuild in?",
    blurb: "Sequence foundations, stability, connection, direction and expansion so higher layers are not carrying lower-layer instability.",
    tags: ["rebuild", "chaos", "stability", "routine", "life plan", "start again"],
    focus: ["foundation", "stability", "connection", "direction", "expansion"],
    questions: [
      { id: "layers", type: "multi", title: "Which layers are currently unstable?", options: ["Safety, housing or health", "Food, sleep or daily essentials", "Income, transport or admin", "Routine and environment", "Relationships and support", "Work or education", "Meaning, creativity or ambition"] },
      { id: "foundation", type: "choice", title: "What needs attention before optimisation?", options: ["Safety or physical health", "Housing, food or sleep", "Income or urgent money", "Transport or access", "A stabilising relationship boundary", "I do not know"] },
      { id: "sequence", type: "choice", title: "What tends to happen when you try to rebuild?", options: ["I start with ambitious goals", "I fix practical things but lose direction", "I focus on other people first", "I change too many things at once", "I wait until capacity returns", "I can build steadily"] },
      { id: "support", type: "multi", title: "What support could be part of the rebuild?", options: ["Health or professional support", "Family or partner", "Friends or community", "Financial or housing support", "Practical systems", "A quieter environment", "Accountability or project structure"] },
      { id: "horizon", type: "choice", title: "What horizon can you realistically hold?", options: ["Today", "This week", "This month", "The next six months", "A longer reconstruction"] },
      { id: "layer", type: "choice", title: "Which layer do you want to move toward eventually?", options: ["Stability", "Connection", "Direction", "Expansion", "I only need to get through now"] },
      { id: "text", type: "text", title: "What would a less chaotic ordinary day contain?", placeholder: "A day that felt more rebuilt would include…" },
    ],
    map: ["foundation", "stability", "connection", "direction", "expansion", "support", "sequence"],
    levers: ["stabilise the lowest unstable layer", "reduce simultaneous change", "build support into the plan", "protect one direction while foundations improve"],
    teach: { novice: "Rebuilding works better in layers: foundation, stability, connection, direction and expansion. Higher layers should not have to compensate for collapsed essentials.", familiar: "Sequencing is not lowering ambition. It is protecting the conditions that make ambition sustainable.", advanced: "Treat the rebuild as a constrained optimisation problem with dependencies, recovery and optionality—not a moral test of discipline." },
    counter: "A collapse in direction may be downstream of unstable foundations. A purpose exercise cannot substitute for sleep, safety, money or support.",
    routes: ["Stabilise the lowest layer", "Build one dependable routine", "Add support before adding ambition", "Create a staged project with review points"],
  },
];

const SYSTEM_BY_ID = Object.fromEntries(SYSTEMS.map((system) => [system.id, system]));

function readJSON(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "null");
    return parsed == null ? fallback : parsed;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* local-only enhancement */ }
}
function idFor(prefix = "project") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function labelFor(group, value) {
  return (SETUP[group] || []).find((item) => item[0] === value)?.[1] || value || "Not set";
}
function setupDefaults() {
  return { help: "understand", time: "useful", knowledge: "unsure", capacity: "some", urgency: "today", mode: "guided" };
}
function depthFor(setup) {
  if (setup.mode && DEPTHS[setup.mode]) return DEPTHS[setup.mode];
  return setup.time === "quick" ? DEPTHS.quick : setup.time === "proper" ? DEPTHS.deep : setup.time === "open" ? DEPTHS.project : DEPTHS.guided;
}
function setupLabel(setup) {
  return [labelFor("time", setup.time), labelFor("capacity", setup.capacity), labelFor("knowledge", setup.knowledge)].join(" · ");
}
function matchSystems(query, selectedMoments, desiredHelp) {
  const text = `${query || ""} ${selectedMoments.join(" ")} ${desiredHelp || ""}`.toLowerCase();
  const scores = SYSTEMS.map((system) => {
    let score = selectedMoments.includes(system.moment) ? 8 : 0;
    for (const tag of system.tags) if (text.includes(tag.toLowerCase())) score += 3;
    if (desiredHelp === "decide" && ["crossroads", "career", "relationship-crossroads", "money"].includes(system.id)) score += 4;
    if (desiredHelp === "prioritise" && ["triage", "bottleneck", "mental-load", "rebuild"].includes(system.id)) score += 4;
    if (desiredHelp === "understand" && ["relationship-pattern", "motivation", "environment", "burnout"].includes(system.id)) score += 2;
    return { system, score };
  }).sort((a, b) => b.score - a.score || a.system.title.localeCompare(b.system.title));
  return scores.slice(0, 3).map((entry) => ({ ...entry.system, matchScore: entry.score }));
}
function getContext() {
  return Object.assign({ work: "", relationship: "", living: "", goals: "", time: "", access: "" }, readJSON(CONTEXT_KEY, {}));
}
function contextMarkup(context) {
  const field = (id, label, placeholder, value) => `<label class="ln-context-field">${esc(label)}<input id="ln-context-${esc(id)}" data-context-field="${esc(id)}" value="${esc(value || "")}" placeholder="${esc(placeholder)}"></label>`;
  return `<details class="ln-context"><summary><span><b>My Context</b><small>Keep the useful background here so systems do not make you repeat yourself.</small></span><span class="ln-context-status">Saved only on this device</span></summary><div class="ln-context-grid">${field("work", "Work / study", "e.g. between roles, studying psychology…", context.work)}${field("relationship", "Relationships", "e.g. partner, family, rebuilding community…", context.relationship)}${field("living", "Living situation", "e.g. alone, shared home, moving…", context.living)}${field("goals", "Current goals", "What are you trying to make possible?", context.goals)}${field("time", "Typical available time", "e.g. ten minutes on weekdays…", context.time)}${field("access", "Access needs / constraints", "Anything the system should design around…", context.access)}</div><div class="ln-context-actions"><button class="button secondary" type="button" id="ln-save-context">Save My Context</button><span id="ln-context-message" aria-live="polite"></span></div></details>`;
}
function shell(root, inner) {
  root.innerHTML = `<div class="wrap ln-wrap"><div class="ln-topline"><a href="#home">← Home</a><span>Navigate My Life · living maps, not fixed answers</span></div>${inner}</div>`;
  const context = root.querySelector(".ln-context");
  if (context) {
    root.querySelector("#ln-save-context")?.addEventListener("click", () => {
      const next = getContext();
      root.querySelectorAll("[data-context-field]").forEach((input) => { next[input.dataset.contextField] = input.value.trim(); });
      writeJSON(CONTEXT_KEY, next);
      const status = root.querySelector("#ln-context-message");
      if (status) status.textContent = "Saved privately on this device.";
    });
  }
}
function setupOptionGroup(group, selected, type = "radio") {
  return `<div class="ln-option-grid ${type === "choice" ? "ln-option-grid-compact" : ""}">${(SETUP[group] || []).map((item) => `<label class="ln-option"><input type="${type}" name="ln-${esc(group)}" value="${esc(item[0])}" ${selected === item[0] ? "checked" : ""}><span><b>${esc(item[1])}</b>${item[2] ? `<small>${esc(item[2])}</small>` : ""}</span></label>`).join("")}</div>`;
}
function renderNavigator(root) {
  const context = getContext();
  const momentOptions = MOMENTS.map((item) => `<label class="ln-moment"><input type="checkbox" name="ln-moment" value="${esc(item[0])}"><span><b>${esc(item[1])}</b><small>${esc(item[2])}</small></span></label>`).join("");
  shell(root, `${contextMarkup(context)}<section class="ln-hero"><div><p class="eyebrow">Nobody’s Simple · Guided tools</p><h1>What kind of help<br><em>fits this moment?</em></h1><p class="ln-hero-lead">Choose a route for a decision, relationship, career, capacity or life change. The tool asks a few useful questions, then gives you a map and a small next step.</p></div><div class="ln-loop" aria-label="Notice, compare, try, update"><span>NOTICE</span><i>→</i><span>COMPARE</span><i>→</i><span>TRY</span><i>→</i><span>UPDATE</span></div></section><section class="ln-navigator-panel"><div class="ln-panel-heading"><p class="eyebrow">The guided tools front door</p><h2>Tell me what is going on in ordinary language.</h2><p>Choose any moments that fit and add a sentence if the labels are too small. The tool suggests three useful routes; it does not diagnose you.</p></div><form id="ln-navigator-form"><label class="ln-search-label">What is happening?<textarea id="ln-navigator-text" rows="3" placeholder="e.g. I hate my job but I cannot tell whether I need a different career, more recovery or a better environment…"></textarea></label><fieldset><legend>Which moment is closest?</legend><div class="ln-moment-grid">${momentOptions}</div></fieldset><div class="ln-navigator-row"><label>What would help most?<select id="ln-desired-help"><option value="understand">Understand what is happening</option><option value="decide">Make a decision</option><option value="plan">Build a plan</option><option value="next">Know what to do next</option><option value="compare">Compare routes</option><option value="prepare">Prepare a conversation</option><option value="learn">Learn enough to handle it</option><option value="prioritise">Prioritise</option></select></label><button class="button bright" type="submit">Find my route</button></div></form><div id="ln-navigator-results" aria-live="polite"></div></section><section class="ln-system-shelf"><div class="ln-shelf-heading"><div><p class="eyebrow">Choose directly</p><h2>Guided tools</h2><p>Start from the life moment that sounds most like yours.</p></div><span class="ln-count">${SYSTEMS.length} tools</span></div><div class="ln-system-grid">${SYSTEMS.map((system) => systemCard(system)).join("")}</div></section><section class="ln-how"><p class="eyebrow">Every guided tool follows the same path</p><h2>Understand → Compare → Move → Update</h2><div class="ln-how-grid"><article><b>Understand</b><p>What appears to be happening, in context.</p></article><article><b>Compare</b><p>What options and explanations are worth keeping open.</p></article><article><b>Move</b><p>What fits the time and capacity available now.</p></article><article><b>Update</b><p>What reality teaches you when you return.</p></article></div></section><section class="ln-projects">${savedProjectsMarkup()}</section>`);
  root.querySelectorAll(".ln-system-card").forEach((card) => card.addEventListener("click", () => renderSystemSetup(root, card.dataset.system)));
  root.querySelector("#ln-navigator-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const moments = [...root.querySelectorAll("[name='ln-moment']:checked")].map((input) => input.value);
    const query = root.querySelector("#ln-navigator-text").value.trim();
    const help = root.querySelector("#ln-desired-help").value;
    const picks = matchSystems(query, moments, help);
    root.querySelector("#ln-navigator-results").innerHTML = `<div class="ln-recommendations"><p class="eyebrow">Your starting map</p><h3>These are the three routes most worth opening first.</h3><p class="ln-recommendation-note">The Navigator is matching the structure of the problem to the system, not assigning a label to you.</p><div class="ln-recommendation-grid">${picks.map((system, index) => `<button type="button" class="ln-recommendation" data-system="${esc(system.id)}"><span>0${index + 1}</span><b>${esc(system.title)}</b><small>${esc(system.question)}</small><em>${esc(system.blurb)}</em><strong>Open this route</strong></button>`).join("")}</div></div>`;
    root.querySelectorAll(".ln-recommendation").forEach((button) => button.addEventListener("click", () => renderSystemSetup(root, button.dataset.system)));
    root.querySelector(".ln-recommendations")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  bindDepthAndContext(root);
}
function systemCard(system) {
  return `<button type="button" class="ln-system-card ln-tone-${esc(system.tone)}" data-system="${esc(system.id)}"><span class="ln-system-number">${esc(system.icon)}</span><span class="eyebrow">${esc(system.group)}</span><h3>${esc(system.title)}</h3><p>${esc(system.question)}</p><small>${esc(system.blurb)}</small><strong>Start this system</strong></button>`;
}
function bindDepthAndContext(root) {
  root.querySelectorAll("[data-context-field]").forEach((input) => input.addEventListener("change", () => {
    const context = getContext(); context[input.dataset.contextField] = input.value.trim(); writeJSON(CONTEXT_KEY, context);
  }));
}
function renderSystemSetup(root, systemId) {
  const system = SYSTEM_BY_ID[systemId];
  if (!system) return renderNavigator(root);
  const setup = setupDefaults();
  shell(root, `${contextMarkup(getContext())}<section class="ln-system-header ln-tone-${esc(system.tone)}"><div><p class="eyebrow">${esc(system.group)} · ${esc(system.icon)}</p><h1>${esc(system.title)}</h1><p>${esc(system.question)}</p><small>${esc(system.blurb)}</small></div><div class="ln-system-focus"><span>We will look at</span><b>${esc(system.focus.slice(0, 4).join(" · "))}</b></div></section><form class="ln-setup" id="ln-setup-form"><div class="ln-setup-intro"><p class="eyebrow">Shared setup layer</p><h2>Shape the experience around the person you are today.</h2><p>These five choices change the depth, language, teaching and next steps. You can override them at any point.</p></div><fieldset><legend>What do you want from this?</legend>${setupOptionGroup("help", setup.help, "radio")}</fieldset><fieldset><legend>How much time have you got?</legend>${setupOptionGroup("time", setup.time, "radio")}</fieldset><fieldset><legend>How much do you already know?</legend>${setupOptionGroup("knowledge", setup.knowledge, "radio")}</fieldset><fieldset><legend>How much capacity do you have right now?</legend>${setupOptionGroup("capacity", setup.capacity, "radio")}</fieldset><fieldset><legend>When does this matter?</legend>${setupOptionGroup("urgency", setup.urgency, "radio")}</fieldset><fieldset class="ln-depth-fieldset"><legend>Choose the depth</legend><div class="ln-depth-grid">${Object.entries(DEPTHS).map(([id, depth]) => `<label class="ln-depth"><input type="radio" name="ln-mode" value="${id}" ${id === setup.mode ? "checked" : ""}><span><b>${esc(depth.title)}</b><small>${esc(depth.time)}</small><em>${esc(depth.text)}</em></span></label>`).join("")}</div></fieldset><div class="ln-setup-footer"><p id="ln-setup-summary">${esc(setupLabel(setup))}</p><button class="button bright" type="submit">Start the investigation</button></div></form>`);
  bindDepthAndContext(root);
  const updateSummary = () => {
    const next = readSetup(root, setup);
    root.querySelector("#ln-setup-summary").textContent = `${setupLabel(next)} · ${DEPTHS[next.mode].title}`;
  };
  root.querySelectorAll(".ln-setup input").forEach((input) => input.addEventListener("change", updateSummary));
  root.querySelector("#ln-setup-form").addEventListener("submit", (event) => {
    event.preventDefault();
    renderInvestigation(root, systemId, readSetup(root, setup));
  });
}
function readSetup(root, fallback = setupDefaults()) {
  const value = (name, defaultValue) => root.querySelector(`[name='ln-${name}']:checked`)?.value || defaultValue;
  return { help: value("help", fallback.help), time: value("time", fallback.time), knowledge: value("knowledge", fallback.knowledge), capacity: value("capacity", fallback.capacity), urgency: value("urgency", fallback.urgency), mode: value("mode", fallback.mode) };
}
function visibleQuestions(system, setup, answers) {
  const depth = depthFor(setup);
  const questions = system.questions.filter((question) => !question.when || question.when(answers));
  const target = questions.slice(0, depth.limit);
  return target.length ? target : system.questions.slice(0, depth.limit);
}
function answerValue(answers, id) {
  const value = answers[id];
  return Array.isArray(value) ? value.join(", ") : value == null ? "" : String(value);
}
function questionMarkup(question, answers) {
  const current = answers[question.id];
  if (question.type === "text") return `<label class="ln-question ln-question-text"><span><b>${esc(question.title)}</b><small>${esc(question.prompt || "Write as much or as little as helps.")}</small></span><textarea data-ln-answer="${esc(question.id)}" rows="3" placeholder="${esc(question.placeholder || "")}">${esc(current || "")}</textarea></label>`;
  if (question.type === "scale") return `<label class="ln-question ln-question-scale"><span><b>${esc(question.title)}</b><small>${esc(question.prompt || "Move to the point that best fits right now.")}</small></span><input type="range" data-ln-answer="${esc(question.id)}" min="${question.min}" max="${question.max}" value="${current == null ? Math.round((question.max - question.min) / 2) : esc(current)}"><div class="ln-scale-ends"><span>${esc(question.low)}</span><output data-ln-output="${esc(question.id)}">${current == null ? Math.round((question.max - question.min) / 2) : esc(current)} / ${question.max}</output><span>${esc(question.high)}</span></div></label>`;
  const options = question.options || [];
  const type = question.type === "multi" ? "checkbox" : "radio";
  const selected = question.type === "multi" ? (Array.isArray(current) ? current : []) : [current];
  return `<fieldset class="ln-question"><legend><b>${esc(question.title)}</b>${question.prompt ? `<small>${esc(question.prompt)}</small>` : ""}</legend><div class="ln-answer-options ${question.type === "multi" ? "ln-answer-multi" : ""}">${options.map((option, index) => { const value = String(index); return `<label><input type="${type}" name="ln-answer-${esc(question.id)}" value="${value}" ${selected.includes(value) ? "checked" : ""}><span>${esc(option)}</span></label>`; }).join("")}</div></fieldset>`;
}
function renderInvestigation(root, systemId, setup, answers = {}) {
  const system = SYSTEM_BY_ID[systemId];
  const questions = visibleQuestions(system, setup, answers);
  const depth = depthFor(setup);
  shell(root, `${contextMarkup(getContext())}<section class="ln-investigation-head ln-tone-${esc(system.tone)}"><p class="eyebrow">${esc(depth.title)} · ${esc(depth.time)}</p><h1>${esc(system.title)}</h1><p>${esc(depth.text)}</p><div class="ln-investigation-meta"><span>${esc(labelFor("capacity", setup.capacity))}</span><span>${esc(labelFor("knowledge", setup.knowledge))}</span><span>${esc(labelFor("urgency", setup.urgency))}</span></div></section><form class="ln-investigation" id="ln-investigation-form"><div class="ln-investigation-notice"><b>We are not trying to describe your whole life.</b><span>We will investigate the parts most useful for this route, then stop when the map is good enough for the next decision.</span></div>${questions.map((question) => questionMarkup(question, answers)).join("")}<label class="ln-question ln-question-text"><span><b>Anything the fixed choices miss?</b><small>Optional context changes what the result should say.</small></span><textarea data-ln-answer="_context" rows="3" placeholder="Something important about the situation…">${esc(answers._context || "")}</textarea></label><div class="ln-investigation-footer"><button type="button" class="button secondary" id="ln-back-system">Change setup</button><button type="submit" class="button bright">Build my working map</button></div></form>`);
  bindDepthAndContext(root);
  const form = root.querySelector("#ln-investigation-form");
  form.querySelectorAll("[data-ln-answer]").forEach((input) => {
    const updateOutput = () => { if (input.type === "range") { const output = root.querySelector(`[data-ln-output='${input.dataset.lnAnswer}']`); if (output) output.textContent = `${input.value} / ${input.max}`; } };
    input.addEventListener("input", updateOutput);
  });
  root.querySelector("#ln-back-system").addEventListener("click", () => renderSystemSetup(root, systemId));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const collected = {};
    questions.forEach((question) => {
      if (question.type === "text" || question.type === "scale") collected[question.id] = form.querySelector(`[data-ln-answer='${question.id}']`)?.value || "";
      else if (question.type === "multi") collected[question.id] = [...form.querySelectorAll(`[name='ln-answer-${question.id}']:checked`)].map((input) => input.value);
      else collected[question.id] = form.querySelector(`[name='ln-answer-${question.id}']:checked`)?.value || "";
    });
    collected._context = form.querySelector("[data-ln-answer='_context']")?.value || "";
    renderResult(root, systemId, setup, collected);
  });
}
function selectedText(question, value) {
  if (value == null || value === "") return "not yet specified";
  if (Array.isArray(value)) return value.map((item) => question.options?.[Number(item)] || item).join(", ");
  return question.options?.[Number(value)] || value;
}
function buildResult(system, setup, answers) {
  const question = (id) => system.questions.find((item) => item.id === id);
  const emphasis = [];
  for (const id of ["load", "loads", "barrier", "friction", "items", "layers", "constraint", "unknown", "problem"]) {
    const q = question(id); if (q && answers[id] && (Array.isArray(answers[id]) ? answers[id].length : answers[id] !== "")) emphasis.push(selectedText(q, answers[id]));
  }
  const focus = emphasis.slice(0, 3);
  const capacity = labelFor("capacity", setup.capacity).toLowerCase();
  const urgency = labelFor("urgency", setup.urgency).toLowerCase();
  const shortContext = answers._context ? ` You also added: “${answers._context.trim()}”` : "";
  const appears = focus.length ? `The working map is currently concentrated around ${focus.join("; ")}. This does not mean the other parts are irrelevant. It means these are the most useful starting variables for the ${system.title.toLowerCase()} route.${shortContext}` : `${system.question} The answers are still light, so this remains an orientation rather than a settled explanation.`;
  const capacityMove = setup.capacity === "low" ? "protect capacity first and make the next move deliberately small" : setup.urgency === "now" ? "choose the stabilising move that reduces immediate pressure" : "use a small experiment that gives the map better evidence";
  const focusPoint = system.levers[(Number(answers.impact || answers.tank || answers.capacity || answers.measure || 0) + (focus.length ? focus.join("").length : 0)) % system.levers.length];
  const routes = system.routes.map((title, index) => ({ title, when: ["If you need a low-risk start", "If you need more evidence", "If the environment or another person is part of the problem", "If you need to protect options while deciding"][index], time: index === 0 ? "5–15 minutes" : index === 1 ? "30–60 minutes" : index === 2 ? "This week" : "Review after evidence", effort: setup.capacity === "low" && index > 0 ? "Higher than today’s available capacity" : index === 0 ? "Low" : "Moderate", cost: index === 0 ? "Small and reversible" : index === 1 ? "Time and attention" : index === 2 ? "May require another person or changed conditions" : "The cost of waiting", reversibility: index === 0 ? "High" : index === 1 ? "High" : index === 2 ? "Medium" : "Depends on the decision", uncertainty: index === 0 ? "Low" : index === 1 ? "Moderate" : "Still open", teaches: index === 0 ? "Whether the first barrier is real and modifiable" : index === 1 ? "Which missing fact actually changes the map" : index === 2 ? "How the system responds when conditions change" : "What becomes clearer with time", next: index === 0 ? `Start now: ${capacityMove}.` : `Next step: choose one observation that would make this route more informative.` }));
  const teach = system.teach[setup.knowledge] || system.teach.novice;
  const deepTeach = setup.knowledge === "expert" || setup.knowledge === "researched" ? system.teach.advanced : setup.knowledge === "familiar" ? system.teach.familiar : system.teach.novice;
  const review = setup.urgency === "now" ? "after the immediate pressure has reduced" : setup.urgency === "today" ? "tomorrow" : setup.urgency === "week" ? "in one week" : setup.urgency === "month" ? "in one month" : "after the next meaningful experience";
  return { appears, focusPoint, routes, teach, deepTeach, review, capacityMove, focus };
}
function causalMap(system, result) {
  const nodes = [...system.map.slice(0, 5)];
  return `<div class="ln-causal-map" aria-label="Working causal map">${nodes.map((node, index) => `<div class="ln-causal-node"><span>0${index + 1}</span><b>${esc(node)}</b><small>${esc(index === 0 ? "What the answers currently foreground" : index === nodes.length - 1 ? "What to test or update" : "A possible connection, not proof")}</small></div>${index < nodes.length - 1 ? "<i aria-hidden='true'>↓</i>" : ""}`).join("")}<div class="ln-causal-caption"><b>Working map:</b> this shows a plausible sequence for investigation. It is not a claim that one answer caused another.</div></div>`;
}
function routesMarkup(routes) {
  return `<div class="ln-routes-grid">${routes.map((route, index) => `<article class="ln-route-card"><span class="ln-route-number">ROUTE ${String.fromCharCode(65 + index)}</span><h3>${esc(route.title)}</h3><p class="ln-route-when">${esc(route.when)}</p><dl><div><dt>Time</dt><dd>${esc(route.time)}</dd></div><div><dt>Effort</dt><dd>${esc(route.effort)}</dd></div><div><dt>Cost</dt><dd>${esc(route.cost)}</dd></div><div><dt>Reversibility</dt><dd>${esc(route.reversibility)}</dd></div><div><dt>Uncertainty</dt><dd>${esc(route.uncertainty)}</dd></div></dl><p><b>What it may teach:</b> ${esc(route.teaches)}</p><p class="ln-route-next"><b>${esc(route.next)}</b></p></article>`).join("")}</div>`;
}
function horizonsMarkup(system, result, setup) {
  const items = [
    ["5 minutes", setup.capacity === "low" ? result.capacityMove + ". Stop there if that is enough." : `Write the current problem in one sentence and circle the most upstream phrase: ${system.focus[0]}.`],
    ["30 minutes", `Compare two routes in the map. Mark what each route costs, protects and could teach you about ${system.title.toLowerCase()}.`],
    ["This week", `Run one small test connected to “${result.focusPoint}” and record what changed in capacity, clarity, connection, access or uncertainty.`],
    ["This month", `Review whether the underlying conditions—not just your effort—changed. Decide whether to continue, adapt or enter a more specific system.`],
    ["Before committing", "Ask which assumption is still being treated as fact, which cost is being discounted and what evidence would change your mind."],
  ];
  return `<div class="ln-horizon-grid">${items.map((item) => `<article><span>${esc(item[0])}</span><p>${esc(item[1])}</p></article>`).join("")}</div>`;
}
function outputSwitchMarkup() {
  return `<div class="ln-output-switch" role="tablist" aria-label="Different kinds of help"><button type="button" class="active" data-ln-output-tab="understand">Understand</button><button type="button" data-ln-output-tab="teach">Teach me</button><button type="button" data-ln-output-tab="compare">Compare</button><button type="button" data-ln-output-tab="plan">Plan</button><button type="button" data-ln-output-tab="do">Do it now</button><button type="button" data-ln-output-tab="track">Track</button></div>`;
}
function renderResult(root, systemId, setup, answers) {
  const system = SYSTEM_BY_ID[systemId];
  const result = buildResult(system, setup, answers);
  const depth = depthFor(setup);
  shell(root, `${contextMarkup(getContext())}<section class="ln-result-hero ln-tone-${esc(system.tone)}"><div><p class="eyebrow">${esc(system.title)} · ${esc(depth.title)}</p><h1>Your working map</h1><p>${esc(result.appears)}</p><div class="ln-result-meta"><span>${esc(setupLabel(setup))}</span><span>Review ${esc(result.review)}</span></div></div><div class="ln-leverage-badge"><span>BEST NEXT FOCUS</span><b>${esc(result.focusPoint)}</b></div></section><section class="ln-result"><div class="ln-result-toolbar"><button type="button" class="button secondary" id="ln-save-project">Save this project</button><button type="button" class="button secondary" id="ln-restart">Start another system</button><span id="ln-result-message" aria-live="polite"></span></div>${outputSwitchMarkup()}<div class="ln-output-panel active" data-ln-output-panel="understand"><div class="ln-result-section"><p class="eyebrow">What appears to be happening</p><h2>A map to work with, not a verdict.</h2><p class="ln-large-copy">${esc(result.appears)}</p>${causalMap(system, result)}<div class="ln-missing"><b>What may be missing</b><p>${esc(system.counter)}</p></div></div><div class="ln-result-section"><p class="eyebrow">What matters most</p><div class="ln-priority-grid"><article><span>BEST NEXT FOCUS</span><b>${esc(result.focusPoint)}</b><p>The first part worth testing because it may change more than one downstream problem.</p></article><article><span>SECONDARY FACTOR</span><b>${esc(result.focus[1] || system.focus[1])}</b><p>Important to keep in view, but not necessarily the first step.</p></article><article><span>DO NOT OVER-READ</span><b>${esc(result.focus[2] || "the most visible symptom")}</b><p>This may be real and still be downstream of another condition.</p></article></div></div></div><div class="ln-output-panel" data-ln-output-panel="teach"><div class="ln-result-section"><p class="eyebrow">Teach only what is useful</p><h2>${esc(labelFor("knowledge", setup.knowledge))}</h2><p class="ln-large-copy">${esc(result.teach)}</p><details class="ln-deep-teach"><summary>Go deeper</summary><p>${esc(result.deepTeach)}</p></details></div></div><div class="ln-output-panel" data-ln-output-panel="compare"><div class="ln-result-section"><p class="eyebrow">Your possible routes</p><h2>Different routes answer different needs.</h2><p>There is no universally best route. Compare time, effort, cost, reversibility, uncertainty and what each route can teach you.</p>${routesMarkup(result.routes)}</div></div><div class="ln-output-panel" data-ln-output-panel="plan"><div class="ln-result-section"><p class="eyebrow">A plan that fits the horizon</p><h2>Same direction, different time budgets.</h2>${horizonsMarkup(system, result, setup)}</div></div><div class="ln-output-panel" data-ln-output-panel="do"><div class="ln-result-section ln-do-now"><p class="eyebrow">Do it now</p><h2>${esc(result.capacityMove)}.</h2><p>${esc(result.routes[0].next)}</p><textarea id="ln-action-note" rows="4" placeholder="Write the one action you are willing to try…"></textarea><button type="button" class="button bright" id="ln-save-action">Save this experiment</button><span id="ln-action-message" aria-live="polite"></span></div></div><div class="ln-output-panel" data-ln-output-panel="track"><div class="ln-result-section"><p class="eyebrow">Update the map</p><h2>What will you look for when you return?</h2><div class="ln-review-card"><p><b>Review ${esc(result.review)}.</b> Record what changed, what did not, and whether the original focus still seems useful.</p><label>What would count as useful evidence?<textarea id="ln-review-note" rows="3" placeholder="I will know more when…"></textarea></label><button type="button" class="button secondary" id="ln-save-review">Save review prompt</button><span id="ln-review-message" aria-live="polite"></span></div></div></div><div class="ln-result-footer"><p class="eyebrow">Understand · Navigate · Move · Update</p><p>This is a working self-reflection map. It does not diagnose, predict your future or replace medical, legal, financial or relationship safety support.</p></div></section>`);
  bindDepthAndContext(root);
  root.querySelectorAll("[data-ln-output-tab]").forEach((button) => button.addEventListener("click", () => {
    root.querySelectorAll("[data-ln-output-tab]").forEach((item) => item.classList.toggle("active", item === button));
    root.querySelectorAll("[data-ln-output-panel]").forEach((panel) => panel.classList.toggle("active", panel.dataset.lnOutputPanel === button.dataset.lnOutputTab));
  }));
  const firstOutput = { learn: "teach", decide: "compare", compare: "compare", plan: "plan", next: "do", prepare: "plan" }[setup.help] || "understand";
  root.querySelector(`[data-ln-output-tab="${firstOutput}"]`)?.click();
  root.querySelector("#ln-restart").addEventListener("click", () => renderNavigator(root));
  root.querySelector("#ln-save-project").addEventListener("click", () => {
    const projects = readJSON(PROJECTS_KEY, []);
    projects.unshift({ id: idFor(), systemId, title: system.title, setup, answers, focusPoint: result.focusPoint, savedAt: new Date().toISOString(), review: result.review });
    writeJSON(PROJECTS_KEY, projects.slice(0, 25));
    root.querySelector("#ln-result-message").textContent = "Saved privately on this device. You can return from Navigate My Life.";
  });
  root.querySelector("#ln-save-action").addEventListener("click", () => {
    const projects = readJSON(PROJECTS_KEY, []); const note = root.querySelector("#ln-action-note").value.trim();
    projects.unshift({ id: idFor("experiment"), systemId, title: `${system.title} · experiment`, setup, answers: { ...answers, action: note }, focusPoint: result.focusPoint, savedAt: new Date().toISOString(), review: result.review });
    writeJSON(PROJECTS_KEY, projects.slice(0, 25)); root.querySelector("#ln-action-message").textContent = "Experiment saved privately on this device.";
  });
  root.querySelector("#ln-save-review").addEventListener("click", () => {
    const projects = readJSON(PROJECTS_KEY, []); const note = root.querySelector("#ln-review-note").value.trim();
    projects.unshift({ id: idFor("review"), systemId, title: `${system.title} · review`, setup, answers: { ...answers, reviewNote: note }, focusPoint: result.focusPoint, savedAt: new Date().toISOString(), review: result.review });
    writeJSON(PROJECTS_KEY, projects.slice(0, 25)); root.querySelector("#ln-review-message").textContent = "Review prompt saved privately on this device.";
  });
}
function savedProjectsMarkup() {
  const projects = readJSON(PROJECTS_KEY, []);
  if (!projects.length) return `<section class="ln-saved-empty"><p class="eyebrow">Project mode</p><h2>Your maps can become living projects.</h2><p>Save a route, experiment or review prompt on this device, then return after reality has taught you something.</p></section>`;
  return `<section class="ln-saved"><div class="ln-shelf-heading"><div><p class="eyebrow">Your saved work</p><h2>Return to a map.</h2></div><button type="button" class="button secondary" id="ln-clear-projects">Clear saved maps</button></div><div class="ln-saved-grid">${projects.slice(0, 6).map((project) => `<button type="button" class="ln-saved-card" data-saved-project="${esc(project.id)}"><span>${esc(new Date(project.savedAt).toLocaleDateString())}</span><b>${esc(project.title)}</b><small>Focus: ${esc(project.focusPoint || project.leverage || "Still forming")}</small><em>Open saved map</em></button>`).join("")}</div></section>`;
}
function openSavedProject(root, projectId) {
  const project = readJSON(PROJECTS_KEY, []).find((item) => item.id === projectId);
  if (!project || !SYSTEM_BY_ID[project.systemId]) return renderNavigator(root);
  if (project.answers && project.setup) return renderResult(root, project.systemId, project.setup, project.answers);
  renderSystemSetup(root, project.systemId);
}
export function renderLifeNavigation(root, systemId = "") {
  if (systemId && SYSTEM_BY_ID[systemId]) renderSystemSetup(root, systemId);
  else renderNavigator(root);
  if (root.dataset.lnNavigationBound === "true") return;
  root.dataset.lnNavigationBound = "true";
  root.addEventListener("click", (event) => {
    const card = event.target.closest("[data-saved-project]");
    if (card) openSavedProject(root, card.dataset.savedProject);
    if (event.target.id === "ln-clear-projects") { writeJSON(PROJECTS_KEY, []); renderNavigator(root); }
  });
}
