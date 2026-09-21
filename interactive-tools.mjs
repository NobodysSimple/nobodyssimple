const escape = (value) =>
  String(value).replace(/[&<>"']/g, (character) =>
    ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character],
  );
const element = (tag, className = "", text = "") => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

const rows = [
  ["emotion-compass", "Emotion Compass", "feel", "link", "feel,body,calm", "understand,calmer", "Move from energy and pleasantness toward a feeling word that fits."],
  ["body-sensation-map", "Body Sensation Map", "feel", "body", "feel,body,calm", "understand,calmer", "Tap body areas and choose sensations such as tight, heavy, hot, numb or fluttery."],
  ["state-check", "State Check", "feel", "choice", "feel,body,unsure", "understand,calmer", "Check sleep, hunger, illness, stimulation, caffeine, connection and other state cues."],
  ["regulation-picker", "Regulation Picker", "calm", "regulation", "body,calm,stim", "calmer,minutes", "Choose what your system is doing and see a few matching ways to adjust the moment."],
  ["five-senses-grounding", "5-Senses Grounding", "calm", "senses", "calm,body,feel", "calmer,minutes", "Tap concrete things around you; watch them gather by sense."],
  ["breathing-pacer", "Breathing Pacer", "calm", "breath", "calm,body,feel", "calmer,minutes", "Follow a gentle expanding shape. Choose a comfortable pace and skip breath holds."],
  ["muscle-release", "Progressive Muscle Release", "calm", "release", "body,calm", "calmer,minutes", "Move through body regions and try a small soften-and-release pause."],
  ["sensory-playground", "Sensory Stimulation Playground", "sensory", "play", "stim,calm,body", "calmer,minutes", "Explore playful digital stims: bubbles, music, a touch garden and more."],
  ["sensory-mixer", "Sensory Mixer", "sensory", "mixer", "stim,body,calm", "calmer,organise", "Adjust movement, repetition, sound, unpredictability and brightness to suit you."],
  ["infinite-pattern", "Infinite Pattern Tool", "sensory", "pattern", "stim,calm", "calmer,minutes", "Tap to build a repeating, mirrored pattern and change its pace and colour."],
  ["nobody-radio", "Nobody Radio / Sound Mixer", "sensory", "link", "calm,stim,body", "calmer,organise", "Mix rain, fire, wind, waves, singing bowl, white noise and original generated lo-fi."],
  ["overload-meter", "Overload Meter", "energy", "meter", "body,calm,start", "understand,organise,calmer", "Place today's demands on a scale and see how small loads can add up."],
  ["social-battery", "Social Battery Meter", "energy", "mixer", "relate,self,body", "understand,organise", "Compare social energy, masking, safety and stimulation without a score."],
  ["needs-compass", "Needs Compass", "feel", "needs", "feel,self,reflect", "understand,action", "Choose a broad need, then narrow toward the kind of support that could fit."],
  ["values-compass", "Values Compass", "choose", "values", "decision,self,reflect", "understand,decide", "Explore competing values and choose what you want to give more weight today."],
  ["control-zones", "Control / Influence / Outside Control", "think", "sort", "think,decision,calm", "organise,decide,calmer", "Place example worries into what you can act on, influence or release for now."],
  ["facts-interpretation-unknown", "Facts / Interpretation / Unknown", "think", "sort", "think,self,feel", "understand,organise", "Sort statements into what is known, inferred or still uncertain."],
  ["certainty-dial", "Certainty Dial", "think", "range", "think,decision,learn", "understand,decide", "Set a confidence estimate and notice what kind of evidence could move it."],
  ["perspective-wheel", "Perspective Wheel", "think", "perspective", "relate,self,decision", "understand,communicate", "Turn among your view, another view, a neutral observer and your future self."],
  ["emotion-timeline", "Emotion Timeline", "feel", "sequence", "feel,self,relate", "understand,organise", "Arrange feeling icons in the order they appeared; more than one can be true."],
  ["trigger-chain-builder", "Trigger Chain Builder", "think", "sequence", "self,think,relate", "understand,organise", "Connect event, body, thought, feeling, urge, action and consequence."],
  ["pattern-loop-simulator", "Pattern Loop Simulator", "think", "loop", "self,start,think", "understand,action", "See how a short-term relief loop can make the same response more likely next time."],
  ["function-finder", "Function Finder", "think", "sort", "self,relate,think", "understand", "Sort sample behaviours toward possible functions such as safety, relief or closeness."],
  ["cost-benefit-balance", "Cost / Benefit Balance", "choose", "sort", "self,decision,start", "understand,decide", "Compare immediate effects with effects that arrive later."],
  ["decision-balance", "Decision Balance", "choose", "balance", "decision,think", "decide,organise", "Give options and practical factors different weights on a visual balance."],
  ["value-conflict-balance", "Value Conflict Balance", "choose", "balance", "decision,self,relate", "decide,understand", "Hold two real competing goods in view and adjust their importance."],
  ["reversibility-gauge", "Reversibility Gauge", "choose", "range", "decision,start,think", "decide,action", "Place a choice from easy to undo through to hard to reverse."],
  ["motivation-mixer", "Motivation Mixer", "action", "mixer", "start,self,body", "understand,action", "Adjust want, enjoyment, necessity, fear, reward and social pressure."],
  ["friction-finder", "Friction Finder", "action", "sort", "start,body,think", "organise,action", "Select and size barriers so a stuck task becomes easier to understand."],
  ["task-shrinker", "Task Shrinker", "action", "steps", "start,body", "action,organise", "Step down from a large task toward one small, visible action."],
  ["priority-sorter", "Priority Sorter", "action", "sort", "start,think,body", "organise,action", "Place sample tasks by urgency, importance, ease and energy demand."],
  ["energy-budget", "Energy Budget", "energy", "budget", "body,start,reflect", "organise,action", "Allocate a limited number of energy tokens across the day."],
  ["recovery-menu", "Recovery Menu Builder", "energy", "sort", "body,calm,reflect", "understand,calmer", "Sort possible breaks by how they tend to feel for you: restorative, neutral or draining."],
  ["boundary-sorter", "Boundary Sorter", "relate", "sort", "relate,self", "understand,communicate", "Sort examples into a preference, request, boundary or attempt to control."],
  ["conflict-decoder", "Conflict Decoder", "relate", "sort", "relate,think", "understand,communicate", "Move conversation fragments into fact, meaning, need or request."],
  ["relationship-distance", "Relationship Distance Dial", "relate", "range", "relate,self", "understand,communicate", "Set the closeness or space you would like, then compare it with now."],
  ["masking-map", "Masking Map", "identity", "masking", "stim,self,relate", "understand", "Tap behaviours you may adapt in different environments; intensity stays yours to define."],
  ["sensory-profile", "Sensory Profile Explorer", "sensory", "mixer", "stim,body,self", "understand,organise", "Explore sounds, textures, light and movement as seeking, avoiding or context-dependent."],
  ["transition-bridge", "Transition Bridge", "action", "steps", "start,body", "action,organise", "Build a short bridge between what you are doing and what comes next."],
  ["attention-spotlight", "Attention Spotlight", "think", "spotlight", "think,stim,calm", "calmer,minutes,understand", "Move a pool of light around a busy scene and practise choosing where to rest attention."],
  ["thought-defusion", "Thought Defusion Tool", "think", "defusion", "think,calm,feel", "calmer,understand", "Change the distance, size and volume of a sample thought."],
  ["urge-surfing", "Urge Surfing", "calm", "wave", "calm,body,think", "calmer,minutes", "Follow an animated wave and watch an urge move without needing to act on it."],
  ["worry-conveyor", "Worry Conveyor Belt", "think", "sort", "think,calm,decision", "organise,decide,calmer", "Route sample worries toward action, scheduling, uncertainty or release."],
  ["safe-enough-scale", "Safe-Enough Scale", "calm", "range", "think,calm,relate", "understand,calmer", "Use more than a safe-or-dangerous binary to mark how a situation feels."],
  ["self-compassion-perspective", "Self-Compassion Perspective Tool", "identity", "perspective", "self,feel,relate", "understand,calmer", "Compare what you might say to yourself, a friend or a stranger."],
  ["gratitude-lens", "Gratitude Lens", "feel", "scene", "reflect,feel,self", "calmer,understand", "Explore a small illustrated scene and tap sources of effort, care or comfort."],
  ["savouring-timer", "Savouring Timer", "feel", "savour", "reflect,calm,feel", "calmer,minutes", "Choose a pleasant moment and give it 30, 60 or 90 seconds of attention."],
  ["memory-jar", "Memory Jar", "feel", "memory", "reflect,self,feel", "calmer,understand", "Collect a few gentle visual reminders of ordinary moments worth keeping."],
  ["emotion-matching", "Emotion Matching Game", "feel", "match", "feel,learn,relate", "understand,learn", "Match body, context and expression cues with several possible feelings."],
  ["cognitive-bias-games", "Cognitive Bias Mini-Games", "think", "bias", "learn,think,decision", "understand,learn", "Try short examples of anchoring, sunk cost and confirmation bias."],
  ["uncertainty-game", "Uncertainty Game", "think", "probability", "learn,think,decision", "understand,learn", "Make a probability estimate, reveal a simple random outcome and compare."],
  ["alternative-explanations", "Alternative Explanation Cards", "think", "alternatives", "think,self,relate", "understand,calmer", "Turn over several plausible explanations for an ambiguous moment."],
  ["life-balance-radar", "Life Balance Radar", "reflect", "radar", "reflect,self,start", "understand,organise", "Move points for rest, relationships, work, play, body and creativity; no life score."],
  ["personal-weather", "Personal Weather", "feel", "weather", "feel,body,self", "understand,calmer", "Build a low-language picture of your inner weather from sky, wind and warmth."],
  ["intensity-thermometer", "Intensity Thermometer", "calm", "intensity", "feel,calm,body", "calmer,minutes", "Slide the current intensity and see lower-demand suggestions change with it."],
  ["choice-pause", "Choice Pause", "action", "steps", "decision,calm,start", "decide,action,minutes", "Take a brief stop–body–urge–consequence–choose sequence before acting."],
];

export const interactiveTools = rows.map(
  ([id, title, group, mode, situations, goals, short]) => ({
    id,
    title,
    group,
    mode,
    situations: situations.split(","),
    goals: goals.split(","),
    short,
  }),
);

const groupNames = [
  ["feel", "Feeling & body"],
  ["calm", "Regulation & sensory"],
  ["sensory", "Sensory & focus"],
  ["think", "Thoughts & perspective"],
  ["choose", "Choices & values"],
  ["action", "Starting & doing"],
  ["energy", "Energy & recovery"],
  ["relate", "Relationships"],
  ["identity", "Self-understanding"],
  ["reflect", "Positive attention"],
];
const groupFor = (key) => groupNames.find((group) => group[0] === key)?.[1] || "Interactive";
const hrefFor = (tool) => {
  if (tool.id === "emotion-compass") return "#compass";
  if (tool.id === "sensory-playground") return "nd-play.html";
  if (tool.id === "nobody-radio") return "#simplyfocus";
  return "#play/" + encodeURIComponent(tool.id);
};
export const interactiveCardMarkup = (tool, index = 0) =>
  '<a class="interactive-tool-card" href="' +
  escape(hrefFor(tool)) +
  '"><span class="interactive-tool-kind">Interactive · no writing</span><span class="interactive-tool-number">' +
  String(index + 1).padStart(2, "0") +
  '</span><h3>' +
  escape(tool.title) +
  '</h3><p>' +
  escape(tool.short) +
  '</p><span class="arrow">Try it <span aria-hidden="true">↗</span></span></a>';

export function recommendInteractiveTools(goal, selectedSituations, energy) {
  const chosen = Array.isArray(selectedSituations) ? selectedSituations : [];
  const score = (tool) =>
    tool.situations.filter((tag) => chosen.includes(tag)).length * 4 +
    (tool.goals.includes(goal) ? 3 : 0) +
    (Number(energy) === 0 && ["body", "calm", "feel", "sensory"].some((tag) => tool.situations.includes(tag)) ? 1 : 0);
  const defaults = {
    calmer: ["breathing-pacer", "five-senses-grounding", "urge-surfing"],
    organise: ["overload-meter", "priority-sorter", "energy-budget"],
    decide: ["decision-balance", "values-compass", "reversibility-gauge"],
    communicate: ["boundary-sorter", "perspective-wheel", "conflict-decoder"],
    action: ["task-shrinker", "friction-finder", "transition-bridge"],
    minutes: ["breathing-pacer", "choice-pause", "attention-spotlight"],
    understand: ["body-sensation-map", "facts-interpretation-unknown", "needs-compass"],
  };
  const ranked = [...interactiveTools].sort((a, b) => score(b) - score(a));
  const extra = (defaults[goal] || defaults.understand)
    .map((id) => interactiveTools.find((tool) => tool.id === id))
    .filter(Boolean);
  return [...ranked, ...extra]
    .filter((tool, index, all) => all.findIndex((item) => item.id === tool.id) === index)
    .slice(0, 3);
}

export function appendInteractiveToolbox(root) {
  const host = root.querySelector(".wrap") || root;
  const section = element("section", "interactive-toolbox section");
  section.innerHTML =
    '<div class="section-head"><div><p class="eyebrow">A separate way to explore</p><h2>Interactive tools · no writing</h2><p>Tap, move, sort or listen. Your selections stay in this page unless you choose to save a personal recipe.</p></div><span class="interactive-count">56 activities</span></div><div class="interactive-featured" id="interactive-featured"></div><details class="interactive-catalog"><summary>Browse all 56 interactive tools</summary><div class="interactive-catalog-controls"><label class="field">Find an activity<input id="interactive-search" type="search" placeholder="Try feelings, focus, decisions…"></label><div class="tabs interactive-categories" id="interactive-categories"></div></div><div id="interactive-catalog-groups"></div></details>';
  host.append(section);
  const featured = ["emotion-compass", "breathing-pacer", "sensory-playground", "five-senses-grounding", "body-sensation-map", "nobody-radio"];
  $("#interactive-featured", section).innerHTML = featured
    .map((id, index) => {
      const tool = interactiveTools.find((item) => item.id === id);
      return tool ? interactiveCardMarkup(tool, index) : "";
    })
    .join("");
  const categories = $("#interactive-categories", section);
  const catalog = $("#interactive-catalog-groups", section);
  const search = $("#interactive-search", section);
  let activeGroup = "all";
  const filter = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    catalog.querySelectorAll(".interactive-catalog-group").forEach((block) => {
      let visibleInGroup = 0;
      block.querySelectorAll(".interactive-tool-card").forEach((card) => {
        const show =
          (activeGroup === "all" || block.dataset.group === activeGroup) &&
          card.textContent.toLowerCase().includes(query);
        card.hidden = !show;
        if (show) visibleInGroup += 1;
      });
      block.hidden = visibleInGroup === 0;
      visible += visibleInGroup;
    });
    const empty = $("#interactive-empty", section);
    if (empty) empty.hidden = visible !== 0;
  };
  [["all", "All"], ...groupNames].forEach(([id, label]) => {
    const button = element("button", "chip" + (id === "all" ? " active" : ""), label);
    button.type = "button";
    button.dataset.category = id;
    button.addEventListener("click", () => {
      activeGroup = id;
      categories.querySelectorAll("button").forEach((item) => item.classList.toggle("active", item === button));
      filter();
    });
    categories.append(button);
  });
  groupNames.forEach(([id, label]) => {
    const list = interactiveTools.filter((tool) => tool.group === id);
    const block = element("section", "interactive-catalog-group");
    block.dataset.group = id;
    const header = element("div", "section-head");
    const title = element("div");
    title.append(element("p", "eyebrow", "No-writing activities"));
    title.append(element("h3", "", label));
    header.append(title, element("span", "fine", list.length + " tools"));
    const grid = element("div", "grid interactive-grid");
    list.forEach((tool, index) => {
      const wrapper = element("div");
      wrapper.innerHTML = interactiveCardMarkup(tool, index);
      const card = wrapper.firstElementChild;
      card.dataset.search = (tool.title + " " + tool.short + " " + label).toLowerCase();
      grid.append(card);
    });
    block.append(header, grid);
    catalog.append(block);
  });
  const empty = element("p", "empty", "No activities match this search yet.");
  empty.id = "interactive-empty";
  empty.hidden = true;
  catalog.append(empty);
  search.addEventListener("input", filter);
  filter();
}

const prompts = {
  "body-sensation-map": ["Head", "Jaw", "Throat", "Chest", "Stomach", "Hands", "Legs", "Back"],
  "state-check": ["Sleep", "Food", "Water", "Pain or illness", "Sensory load", "Caffeine", "Connection", "Movement"],
  "regulation-picker": ["Too activated", "Too flat", "Overwhelmed", "Restless", "Unsure"],
  "needs-compass": ["Safety", "Rest", "Connection", "Autonomy", "Clarity", "Play", "Fairness", "Belonging"],
  "values-compass": ["Care", "Honesty", "Rest", "Curiosity", "Fairness", "Courage", "Connection", "Freedom"],
  "perspective-wheel": ["My view", "Their possible view", "Neutral observer", "Future me"],
  "emotion-timeline": ["Before", "At the moment", "Afterward", "Now"],
  "trigger-chain-builder": ["Event", "Body", "Thought", "Feeling", "Urge", "Action", "Consequence"],
  "pattern-loop-simulator": ["Trigger", "Response", "Short-term relief", "Longer-term effect"],
  "task-shrinker": ["Whole task", "First visible piece", "A two-minute move", "Open the needed thing", "Pause and choose"],
  "transition-bridge": ["Current activity", "Notice the ending", "Gather what you need", "Move", "Arrive at the next thing"],
  "choice-pause": ["Stop for one beat", "Notice your body", "Name the urge", "See one consequence", "Choose the next move"],
  "self-compassion-perspective": ["What would I say to me?", "What would I say to a friend?", "What would I say to a stranger?"],
  "facts-interpretation-unknown": ["A reply arrived late", "They are angry with me", "I do not know why yet", "The meeting ended early"],
  "control-zones": ["Send one clear message", "Ask for a change", "Other people's response", "What happened yesterday", "Choose when to revisit it"],
  "function-finder": ["Check the door again", "Cancel when things feel uncertain", "Ask someone to stay nearby", "Keep moving or tapping", "Make a detailed plan", "Go quiet in a group"],
  "cost-benefit-balance": ["Quick relief", "Effort today", "Effect tomorrow", "Effect on someone else", "Longer-term cost"],
  "friction-finder": ["The instructions are vague", "I am low on energy", "The room is too loud", "There are too many steps", "I worry I will get it wrong", "I need another person’s input"],
  "priority-sorter": ["Reply to a time-sensitive message", "Put away one item", "Book an appointment", "Rest for ten minutes", "Prepare for tomorrow"],
  "recovery-menu": ["Quiet time", "A familiar song", "A short walk", "A friendly conversation", "A screen break", "A familiar show"],
  "boundary-sorter": ["I prefer more notice", "Could you lower your voice?", "I will leave if shouting starts", "You must agree with me"],
  "conflict-decoder": ["You left before we finished", "You do not care about this", "I need time to think", "Can we return to this at 7?"],
  "worry-conveyor": ["There is a form due tomorrow", "What if they judge me?", "I cannot know the final outcome", "I keep replaying last week"],
  "emotion-matching": ["A friend cancels plans", "A loud room and fast heartbeat", "A kind surprise after a hard week", "Waiting for an important answer"],
};
const options = {
  "state-check": ["Sleepy", "Hungry", "Thirsty", "In pain", "Overstimulated", "Understimulated", "Lonely", "Caffeinated", "Not sure"],
  "regulation-picker": ["Lower sound or light", "Move or stretch", "Add pressure or warmth", "Use a steady rhythm", "Reach out to someone", "Wait before choosing"],
  "needs-compass": ["Body needs", "Safety", "Connection", "Choice", "Rest", "Meaning"],
  "values-compass": ["Care", "Honesty", "Rest", "Curiosity", "Fairness", "Courage"],
  "perspective-wheel": ["My view", "Their possible view", "Neutral observer", "Future me"],
  "self-compassion-perspective": ["Me", "A friend", "A stranger"],
  "emotion-matching": ["Disappointed", "Worried", "Relieved", "Hurt", "Tired", "Curious", "More than one", "Not sure"],
  "emotion-matching": ["Disappointed", "Worried", "Relieved", "Hurt", "Tired", "Could be more than one"],
  "cognitive-bias-games": ["First number sticks", "I notice evidence that agrees", "I keep going because I already invested", "I need more information"],
  "alternative-explanations": ["They may be busy", "The message may have been missed", "They may need time", "There may be another context", "I do not know yet"],
  "personal-weather": ["☀️ Clear", "🌤️ Mixed", "🌧️ Rain", "🌫️ Fog", "🌬️ Wind", "⛈️ Storm"],
  "gratitude-lens": ["Someone made an effort", "A small comfort", "A skill I used", "A bit of beauty", "Help I received", "Something I protected"],
  "masking-map": ["At work or school", "With friends", "With family", "In public", "Online", "When I feel safe"],
};
const sortConfig = {
  "control-zones": { bins: ["I can act", "I can influence", "Outside my control"] },
  "facts-interpretation-unknown": { bins: ["Known fact", "Interpretation", "Not known yet"] },
  "function-finder": { bins: ["Safety", "Relief", "Closeness", "Stimulation", "Control"] },
  "cost-benefit-balance": { bins: ["Immediate", "Later"] },
  "friction-finder": { bins: ["Clarity", "Energy", "Environment", "People", "Too many steps"] },
  "priority-sorter": { bins: ["Urgent", "Important", "Quick or easy", "Energy-demanding"] },
  "recovery-menu": { bins: ["Restorative for me", "Neutral", "Draining for me"] },
  "boundary-sorter": { bins: ["Preference", "Request", "Boundary", "Control"] },
  "conflict-decoder": { bins: ["Fact", "Meaning", "Need", "Request"] },
  "worry-conveyor": { bins: ["Act", "Schedule", "Uncertain", "Release for now"] },
};
const sliderConfig = {
  "certainty-dial": [["How sure does this feel?", "Not sure", "Very sure"]],
  "reversibility-gauge": [["How easy is it to undo?", "Hard to undo", "Easy to undo"]],
  "relationship-distance": [["Closeness you want", "More space", "More closeness"], ["Closeness you have now", "More space", "More closeness"]],
  "safe-enough-scale": [["How safe enough does this feel right now?", "Not yet", "Safe enough"]],
  "intensity-thermometer": [["How intense is it right now?", "Gentle", "Very intense"]],
  "overload-meter": [["Demands on your system", "Lighter", "Heavier"], ["Available capacity", "Low", "More available"]],
  "social-battery": [["Social energy", "Drained", "Replenished"], ["Masking effort", "Low", "High"], ["Sense of safety", "Low", "High"]],
  "sensory-mixer": [["Movement", "Still", "More"], ["Repetition", "Varied", "Steady"], ["Sound density", "Sparse", "Full"], ["Brightness", "Dim", "Bright"], ["Unpredictability", "Predictable", "Surprising"]],
  "motivation-mixer": [["Want", "Low", "High"], ["Enjoyment", "Low", "High"], ["Necessity", "Low", "High"], ["Fear or pressure", "Low", "High"], ["Reward", "Low", "High"]],
  "decision-balance": [["Option A weight", "Light", "Heavy"], ["Option B weight", "Light", "Heavy"]],
  "value-conflict-balance": [["Value A", "Less important today", "More important today"], ["Value B", "Less important today", "More important today"]],
  "energy-budget": [["Rest", "Few tokens", "Many tokens"], ["Work or study", "Few tokens", "Many tokens"], ["People", "Few tokens", "Many tokens"], ["Play or creativity", "Few tokens", "Many tokens"]],
  "life-balance-radar": [["Rest", "Needs more space", "Feels well tended"], ["Relationships", "Needs more space", "Feels well tended"], ["Work or study", "Needs more space", "Feels well tended"], ["Play", "Needs more space", "Feels well tended"], ["Body", "Needs more space", "Feels well tended"], ["Creativity", "Needs more space", "Feels well tended"]],
  "certainty": [["Confidence", "0%", "100%"]],
};
const sequenceParts = {
  "emotion-timeline": ["Curious", "Tense", "Relieved", "Tired"],
  "trigger-chain-builder": ["Something happened", "Body responds", "A thought appears", "A feeling follows", "An urge arrives", "I act", "There is an effect"],
  "pattern-loop-simulator": ["Something triggers it", "A familiar response", "Short-term relief", "A cost later"],
  "task-shrinker": ["The whole task", "Find the first piece", "Make it smaller", "Choose one two-minute move"],
  "transition-bridge": ["Finish this activity", "Gather what I need", "Change place or posture", "Begin the next activity"],
  "choice-pause": ["Stop", "Notice the body", "Notice the urge", "See a consequence", "Choose"],
};
const senseItems = {
  "Sight": ["A colour", "A shape", "A moving thing", "A patch of light"],
  "Sound": ["A near sound", "A distant sound", "A steady sound", "Silence or quiet"],
  "Touch": ["A texture", "A point of contact", "Warmth", "Coolness"],
  "Smell": ["A familiar scent", "Fresh air", "Soap or fabric", "No scent noticed"],
  "Taste": ["A recent taste", "A sip of water", "A mint or snack", "No taste noticed"],
};
const bodyZones = ["Head", "Jaw", "Throat", "Chest", "Belly", "Hands", "Legs", "Back"];
const sensations = ["Tight", "Heavy", "Warm", "Cold", "Fluttery", "Numb", "Tingly", "Neutral"];
const zonePrompts = ["Jaw", "Shoulders", "Hands", "Chest", "Belly", "Legs", "Feet", "Face"];
const store = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    return value || fallback;
  } catch {
    return fallback;
  }
};
const button = (label, className = "choice-tile") => {
  const node = element("button", className, label);
  node.type = "button";
  return node;
};
const showStatus = (root, message) => {
  const status = root.querySelector("#interactive-status");
  if (status) status.textContent = message;
};
const addChipChoices = (root, host, list, { multiple = false, onChoose } = {}) => {
  const selected = new Set();
  list.forEach((label) => {
    const item = button(label, "interactive-choice");
    item.setAttribute("aria-pressed", "false");
    item.addEventListener("click", () => {
      if (multiple) {
        const active = !selected.has(label);
        if (active) selected.add(label);
        else selected.delete(label);
        item.classList.toggle("selected", active);
        item.setAttribute("aria-pressed", String(active));
        if (onChoose) onChoose([...selected]);
      } else {
        host.querySelectorAll(".interactive-choice").forEach((choice) => {
          choice.classList.remove("selected");
          choice.setAttribute("aria-pressed", "false");
        });
        selected.clear();
        selected.add(label);
        item.classList.add("selected");
        item.setAttribute("aria-pressed", "true");
        if (onChoose) onChoose(label);
      }
    });
    host.append(item);
  });
};

function renderSort(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const config = sortConfig[tool.id] || { bins: ["Less effort", "Some effort", "A lot of effort"] };
  const items = prompts[tool.id] || ["A situation I can act on", "A thought I am adding", "A need I have", "Something outside my control", "A small next step"];
  const picked = element("div", "sort-cards");
  const bins = element("div", "sort-bins");
  const assigned = new Map();
  let active = "";
  items.forEach((label, index) => {
    const card = button(label, "sort-card");
    card.addEventListener("click", () => {
      active = label;
      picked.querySelectorAll(".sort-card").forEach((node) => node.classList.toggle("selected", node.dataset.label === label));
      showStatus(root, "Selected: " + label + ". Choose a category below.");
    });
    card.dataset.label = label;
    picked.append(card);
  });
  config.bins.forEach((label) => {
    const zone = element("div", "sort-zone");
    const heading = element("h3", "", label);
    const drop = button("Place selected card here", "sort-drop");
    const placed = element("div", "sort-placed");
    drop.addEventListener("click", () => {
      if (!active) {
        showStatus(root, "Choose an example card first.");
        return;
      }
      assigned.set(active, label);
      const card = [...picked.children].find((node) => node.dataset.label === active);
      if (card) {
        card.classList.add("sorted");
        card.disabled = true;
      }
      placed.append(element("span", "sorted-chip", active));
      active = "";
      showStatus(root, assigned.size + " of " + items.length + " examples placed. There is no score.");
    });
    zone.append(heading, placed, drop);
    bins.append(zone);
  });
  const reset = button("Start again", "button subtle-button");
  reset.addEventListener("click", () => {
    assigned.clear();
    active = "";
    picked.querySelectorAll(".sort-card").forEach((card) => {
      card.disabled = false;
      card.classList.remove("selected", "sorted");
    });
    bins.querySelectorAll(".sort-placed").forEach((node) => node.replaceChildren());
    showStatus(root, "Choose an example, then choose a category that feels closest.");
  });
  host.append(element("p", "interactive-instruction", "Choose a sample card, then place it in a category. These are examples to explore, not a test."), picked, bins, reset);
}

function renderSliders(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const config = sliderConfig[tool.id] || [[tool.title, "Less", "More"]];
  const values = [];
  const controls = element("div", "interactive-sliders");
  config.forEach(([label, low, high], index) => {
    const row = element("label", "interactive-control");
    row.append(element("span", "control-label", label));
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "100";
    input.step = "1";
    input.value = tool.id === "sensory-mixer" ? "0" : "50";
    input.setAttribute("aria-label", label);
    const ends = element("span", "range-ends");
    ends.append(element("span", "", low));
    const output = element("output", "", input.value + " / 100");
    ends.append(output, element("span", "", high));
    values[index] = Number(input.value);
    input.addEventListener("input", () => {
      values[index] = Number(input.value);
      output.value = input.value + " / 100";
      output.textContent = output.value;
      updateBalance();
    });
    row.append(input, ends);
    controls.append(row);
  });
  const summary = element("div", "interactive-result");
  const updateBalance = () => {
    const middle = values.length > 1 ? values.reduce((sum, x) => sum + x, 0) / values.length : values[0];
    summary.textContent = middle < 34 ? "Your current mix leans toward the lower end of these settings." : middle > 66 ? "Your current mix leans toward the higher end of these settings." : "Your current settings are spread through the middle of these ranges.";
  };
  updateBalance();
  host.append(controls, summary);
  if (tool.id === "sensory-mixer") {
    const save = button("Save this sensory recipe on this device", "button");
    save.addEventListener("click", () => {
      localStorage.setItem("ns-sensory-recipe-v1", JSON.stringify({ values, labels: config.map((x) => x[0]) }));
      showStatus(root, "Sensory recipe saved on this device.");
    });
    host.append(save);
    const previous = store("ns-sensory-recipe-v1", null);
    if (previous?.values?.length === config.length) {
      const load = button("Load saved recipe", "button subtle-button");
      load.addEventListener("click", () => {
        [...controls.querySelectorAll('input[type="range"]')].forEach((input, index) => {
          input.value = previous.values[index];
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
      });
      host.append(load);
    }
  }
}

function renderBodyMap(root) {
  const host = root.querySelector("#interactive-activity");
  host.append(element("p", "interactive-instruction", "Tap any body area, then choose a sensory word. A sensation does not have one fixed emotional meaning."));
  const map = element("div", "body-map");
  const silhouette = element("div", "body-silhouette", "◯");
  silhouette.setAttribute("aria-hidden", "true");
  map.append(silhouette);
  const regions = element("div", "body-regions");
  const chosen = new Set();
  bodyZones.forEach((zone) => {
    const item = button(zone, "body-region");
    item.addEventListener("click", () => {
      if (chosen.has(zone)) chosen.delete(zone);
      else chosen.add(zone);
      item.classList.toggle("selected", chosen.has(zone));
      item.setAttribute("aria-pressed", String(chosen.has(zone)));
      showStatus(root, chosen.size ? "Areas noticed: " + [...chosen].join(", ") : "No body areas selected.");
    });
    regions.append(item);
  });
  map.append(regions);
  const senseHost = element("div", "choice-cloud");
  addChipChoices(root, senseHost, sensations, { multiple: true, onChoose: (list) => showStatus(root, (chosen.size ? [...chosen].join(", ") : "No area selected") + " · sensations: " + (list.join(", ") || "none selected")) });
  host.append(map, element("h3", "", "Choose sensation words"), senseHost);
}

function renderSenses(root) {
  const host = root.querySelector("#interactive-activity");
  const selected = new Map(Object.keys(senseItems).map((sense) => [sense, new Set()]));
  const board = element("div", "senses-board");
  Object.entries(senseItems).forEach(([sense, labels]) => {
    const section = element("section", "sense-lane");
    section.append(element("h3", "", sense));
    const chips = element("div", "choice-cloud");
    labels.forEach((label) => {
      const chip = button(label, "interactive-choice");
      chip.setAttribute("aria-pressed", "false");
      chip.addEventListener("click", () => {
        const values = selected.get(sense);
        if (values.has(label)) values.delete(label);
        else values.add(label);
        chip.classList.toggle("selected", values.has(label));
        chip.setAttribute("aria-pressed", String(values.has(label)));
        section.querySelector(".sense-picked").textContent = [...values].join(" · ") || "Tap anything you notice";
        section.classList.toggle("has-picks", values.size > 0);
        const total = [...selected.values()].reduce((sum, items) => sum + items.size, 0);
        showStatus(root, total ? total + " observations noticed. Any sense can be skipped." : "No observations selected yet.");
      });
      chips.append(chip);
    });
    section.append(chips, element("p", "sense-picked", "Tap anything you notice"));
    board.append(section);
  });
  host.append(element("p", "interactive-instruction", "There is no need to find all five. Tap what is easy to notice; skip anything uncomfortable."), board);
}

function renderBreath(root) {
  const host = root.querySelector("#interactive-activity");
  const orb = element("div", "breath-orb", "Breathe at your own pace");
  const speed = document.createElement("input");
  speed.type = "range";
  speed.min = "4";
  speed.max = "12";
  speed.value = "7";
  speed.setAttribute("aria-label", "Breathing animation pace");
  const output = element("output", "", "7 seconds per cycle");
  speed.addEventListener("input", () => {
    output.textContent = speed.value + " seconds per cycle";
    orb.style.setProperty("--breath-duration", speed.value + "s");
  });
  const toggle = button("Start the visual pacer", "button");
  toggle.addEventListener("click", () => {
    const running = orb.classList.toggle("breathing");
    toggle.textContent = running ? "Pause the visual pacer" : "Start the visual pacer";
    showStatus(root, running ? "Follow the shape only if this pace feels comfortable. You can stop whenever you like." : "Pacer paused.");
  });
  host.append(orb, element("label", "interactive-control", "Choose a comfortable pace"), speed, output, toggle, element("p", "fine", "No breath holds. Let breathing stay natural; stop if focusing on breath feels uncomfortable."));
}

function renderZones(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const selected = new Set();
  const wrap = element("div", "body-region-grid");
  zonePrompts.forEach((zone) => {
    const item = button(zone, "body-region");
    item.addEventListener("click", () => {
      const isActive = !selected.has(zone);
      if (isActive) selected.add(zone);
      else selected.delete(zone);
      item.classList.toggle("selected", isActive);
      item.setAttribute("aria-pressed", String(isActive));
      showStatus(root, selected.size ? [...selected].join(" · ") + " selected. Try an easy soften or stretch, if you want." : "Choose a region if you want to.");
    });
    wrap.append(item);
  });
  host.append(element("p", "interactive-instruction", "Choose any region, or skip this activity. Do not tense anything that hurts or feels uncomfortable."), wrap);
}

function renderPattern(root) {
  const host = root.querySelector("#interactive-activity");
  const grid = element("div", "pattern-grid");
  const cells = [];
  let symmetry = 4;
  const symmetryPicker = element("div", "choice-cloud");
  [2, 4, 6, 8].forEach((number) => {
    const item = button(number + " fold", "chip");
    item.addEventListener("click", () => {
      symmetry = number;
      symmetryPicker.querySelectorAll("button").forEach((node) => node.classList.toggle("active", node === item));
      showStatus(root, "Pattern fold set to " + number + ". Tap a tile to add a mirrored mark.");
    });
    if (number === symmetry) item.classList.add("active");
    symmetryPicker.append(item);
  });
  for (let index = 0; index < 49; index += 1) {
    const tile = button("", "pattern-tile");
    tile.setAttribute("aria-label", "Pattern tile " + (index + 1));
    tile.addEventListener("click", () => {
      const active = tile.classList.toggle("lit");
      const x = index % 7;
      const y = Math.floor(index / 7);
      cells.push({ x, y, active });
      showStatus(root, active ? "A mark joined the pattern. Tap another tile or change the fold." : "Mark removed.");
      mirrorPattern(grid, x, y, symmetry, active);
    });
    grid.append(tile);
  }
  const clear = button("Clear pattern", "button subtle-button");
  clear.addEventListener("click", () => {
    grid.querySelectorAll(".pattern-tile").forEach((tile) => tile.classList.remove("lit"));
    showStatus(root, "Pattern cleared. Start another whenever you like.");
  });
  host.append(element("p", "interactive-instruction", "Tap tiles to make a repeating pattern. No score, timer or target."), symmetryPicker, grid, clear);
}
function mirrorPattern(grid, x, y, symmetry, active) {
  const rotations = Math.max(2, symmetry);
  for (let turn = 1; turn < rotations; turn += 1) {
    const mx = Math.round((6 - x) * (turn % 2 ? 1 : 0) + x * (turn % 2 ? 0 : 1));
    const my = Math.round((6 - y) * (turn % 2 ? 0 : 1) + y * (turn % 2 ? 1 : 0));
    const cell = grid.children[my * 7 + mx];
    if (cell) cell.classList.toggle("lit", active);
  }
}

function renderSortTool(root, tool) {
  const config = sortConfig[tool.id] || { bins: ["Option A", "Option B", "Not sure yet"] };
  const items = prompts[tool.id] || ["A first example", "A second example", "Another possibility", "Something still unknown"];
  renderSort(root, tool, config, items);
}

function renderSequence(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const list = (sequenceParts[tool.id] || ["Notice", "Pause", "Choose", "Continue"]).slice();
  const ordered = element("ol", "sequence-list");
  const redraw = () => {
    ordered.replaceChildren();
    list.forEach((step, index) => {
      const row = element("li", "sequence-step");
      row.append(element("span", "sequence-number", String(index + 1).padStart(2, "0")), element("span", "sequence-text", step));
      const move = element("div", "sequence-actions");
      const up = button("Move up", "icon-button");
      const down = button("Move down", "icon-button");
      up.disabled = index === 0;
      down.disabled = index === list.length - 1;
      up.addEventListener("click", () => {
        [list[index - 1], list[index]] = [list[index], list[index - 1]];
        redraw();
      });
      down.addEventListener("click", () => {
        [list[index + 1], list[index]] = [list[index], list[index + 1]];
        redraw();
      });
      move.append(up, down);
      row.append(move);
      ordered.append(row);
    });
  };
  redraw();
  host.append(element("p", "interactive-instruction", "Move steps up or down to explore the order. The sequence is only an example; your experience may differ."), ordered);
}

function renderRadar(root) {
  const host = root.querySelector("#interactive-activity");
  const config = sliderConfig["life-balance-radar"];
  const points = config.map(() => 50);
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 260 260");
  svg.setAttribute("class", "balance-radar");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "A personal radar shape, not a score");
  const rings = [1, 2, 3, 4].map((r) => {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", "130"); circle.setAttribute("cy", "130"); circle.setAttribute("r", String(r * 23));
    circle.setAttribute("class", "radar-ring"); svg.append(circle); return circle;
  });
  const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  polygon.setAttribute("class", "radar-shape"); svg.append(polygon);
  const form = element("div", "interactive-sliders");
  const update = () => {
    const coords = points.map((value, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / points.length;
      const radius = 20 + (value / 100) * 88;
      return (130 + Math.cos(angle) * radius) + "," + (130 + Math.sin(angle) * radius);
    });
    polygon.setAttribute("points", coords.join(" "));
  };
  config.forEach(([label, low, high], index) => {
    const row = element("label", "interactive-control");
    row.append(element("span", "control-label", label));
    const input = document.createElement("input"); input.type = "range"; input.min = "0"; input.max = "100"; input.value = "50"; input.setAttribute("aria-label", label);
    input.addEventListener("input", () => { points[index] = Number(input.value); update(); });
    row.append(input, element("span", "range-ends", low + " · " + high));
    form.append(row);
  });
  update();
  host.append(svg, form, element("p", "fine", "This shape has no target and does not create a life score. It only mirrors the values you move."));
}

function renderCanvas(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const scene = element("div", "tap-scene " + (tool.id === "gratitude-lens" ? "gratitude-scene" : "attention-scene"));
  const labels = options[tool.id] || ["Light", "A shape", "A sound", "A detail", "A texture", "Space"];
  const selected = new Set();
  labels.forEach((label, index) => {
    const tile = button(label, "scene-detail detail-" + index);
    tile.addEventListener("click", () => {
      const active = !selected.has(label);
      if (active) selected.add(label); else selected.delete(label);
      tile.classList.toggle("noticed", active);
      tile.setAttribute("aria-pressed", String(active));
      showStatus(root, active ? "Noticed: " + label + ". Look around for any other detail you want to keep in view." : "Detail unmarked.");
    });
    scene.append(tile);
  });
  host.append(element("p", "interactive-instruction", "Tap a detail that catches your attention. The scene does not ask you to find a right answer."), scene);
}

function renderWeather(root) {
  const host = root.querySelector("#interactive-activity");
  const sky = element("div", "weather-sky");
  const row = element("div", "choice-cloud");
  (options["personal-weather"] || []).forEach((label) => {
    const item = button(label, "interactive-choice");
    item.addEventListener("click", () => {
      row.querySelectorAll("button").forEach((node) => node.classList.toggle("selected", node === item));
      sky.textContent = label.split(" ").slice(0, 1).join("");
      sky.setAttribute("aria-label", "Selected inner weather: " + label);
      showStatus(root, "Your weather picture: " + label + ". It can change; no explanation is required.");
    });
    row.append(item);
  });
  const time = button("Change time of day", "button subtle-button");
  let evening = false;
  time.addEventListener("click", () => {
    evening = !evening;
    sky.classList.toggle("evening", evening);
    time.textContent = evening ? "Show daytime" : "Change time of day";
  });
  host.append(sky, row, time);
}

function renderMemory(root) {
  const host = root.querySelector("#interactive-activity");
  const jar = element("div", "memory-jar");
  const saved = store("ns-memory-jar-v1", []);
  saved.forEach((label) => jar.append(element("span", "memory-token", label)));
  const add = element("div", "choice-cloud");
  const things = ["Warm drink", "A familiar song", "A kind message", "Sunlight", "A laugh", "A quiet corner", "A small win", "Someone showed up"];
  things.forEach((label) => {
    const item = button(label, "interactive-choice");
    item.addEventListener("click", () => {
      const current = store("ns-memory-jar-v1", []);
      current.unshift(label);
      localStorage.setItem("ns-memory-jar-v1", JSON.stringify(current.slice(0, 30)));
      jar.append(element("span", "memory-token", label));
      item.disabled = true;
      showStatus(root, "Added to your jar on this device. It can be cleared from this page.");
    });
    add.append(item);
  });
  const clear = button("Clear this device's jar", "button subtle-button");
  clear.addEventListener("click", () => {
    localStorage.removeItem("ns-memory-jar-v1");
    jar.replaceChildren();
    add.querySelectorAll("button").forEach((node) => { node.disabled = false; node.classList.remove("selected"); });
    showStatus(root, "Memory jar cleared on this device.");
  });
  host.append(element("p", "interactive-instruction", "Tap a prompt to place it in your jar. These are prompts, not assumptions about your life."), jar, add, clear);
}

function renderTimer(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const face = element("div", "timer-face", "30");
  const controls = element("div", "choice-cloud");
  let duration = 30;
  let remaining = duration;
  let interval = null;
  [30, 60, 90].forEach((value) => {
    const item = button(value + " seconds", "chip");
    item.addEventListener("click", () => {
      duration = value;
      remaining = value;
      face.textContent = String(value);
      controls.querySelectorAll("button").forEach((node) => node.classList.toggle("active", node === item));
    });
    if (value === 30) item.classList.add("active");
    controls.append(item);
  });
  const toggle = button("Start a gentle timer", "button");
  const prompt = element("p", "timer-prompt", "Notice one colour, texture, temperature or sound that feels pleasant enough.");
  toggle.addEventListener("click", () => {
    if (interval) {
      clearInterval(interval); interval = null; toggle.textContent = "Resume";
      return;
    }
    if (remaining <= 0) remaining = duration;
    toggle.textContent = "Pause";
    interval = setInterval(() => {
      remaining -= 1;
      face.textContent = String(remaining);
      if (remaining <= 0) {
        clearInterval(interval); interval = null; toggle.textContent = "Start again";
        prompt.textContent = "The timer is complete. You can stop here or stay with the experience a little longer.";
      }
    }, 1000);
  });
  host.append(controls, face, toggle, prompt);
  window.addEventListener("hashchange", () => clearInterval(interval), { once: true });
}

function renderWave(root) {
  const host = root.querySelector("#interactive-activity");
  const wave = element("div", "urge-wave");
  const slider = document.createElement("input"); slider.type = "range"; slider.min = "0"; slider.max = "100"; slider.value = "50"; slider.setAttribute("aria-label", "Current urge intensity");
  const output = element("output", "", "50 / 100");
  slider.addEventListener("input", () => {
    wave.style.setProperty("--wave-height", (15 + Number(slider.value) * 0.55) + "%");
    output.textContent = slider.value + " / 100";
  });
  const status = element("p", "fine", "An urge can rise and fall. This visual does not predict how long yours will last.");
  host.append(wave, slider, output, status);
}

function renderPerspective(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const list = options[tool.id] || ["My view", "Another view", "A wider view"];
  const display = element("div", "perspective-display", list[0]);
  const note = element("p", "interactive-result", "Turn the wheel to look from another position. You do not have to agree with every view.");
  const cloud = element("div", "choice-cloud");
  addChipChoices(root, cloud, list, { onChoose: (value) => { display.textContent = value; note.textContent = "You are looking from: " + value + ". This is one possible perspective, not a verdict."; } });
  host.append(display, cloud, note);
}

function renderProbability(root) {
  const host = root.querySelector("#interactive-activity");
  const heading = element("p", "interactive-instruction", "Estimate the chance of heads on a fair coin. Make a new estimate for each toss and notice how a run of outcomes behaves.");
  const input = document.createElement("input"); input.type = "range"; input.min = "0"; input.max = "100"; input.value = "50"; input.setAttribute("aria-label", "Estimate the probability of heads");
  const output = element("output", "", "50%");
  input.addEventListener("input", () => { output.textContent = input.value + "%"; });
  const reveal = button("Reveal one coin toss", "button");
  const result = element("p", "interactive-result", "Round 0 of 10. Choose an estimate, then reveal a fictional coin toss.");
  let round = 0;
  let squaredError = 0;
  reveal.addEventListener("click", () => {
    if (round === 10) {
      round = 0;
      squaredError = 0;
      result.textContent = "Round 0 of 10. Choose an estimate, then reveal a fictional coin toss.";
      reveal.textContent = "Reveal one coin toss";
      return;
    }
    const heads = Math.random() < 0.5;
    const estimate = Number(input.value) / 100;
    squaredError += (estimate - (heads ? 1 : 0)) ** 2;
    round += 1;
    const average = squaredError / round;
    result.textContent = "Round " + round + " of 10: your estimate was " + input.value + "%. The toss was " + (heads ? "heads" : "tails") + ". Average squared error so far: " + average.toFixed(2) + ".";
    reveal.textContent = round === 10 ? "Start a new set" : "Reveal next toss";
  });
  host.append(heading, input, output, reveal, result, element("p", "fine", "This is a practice game, not a measure of your reasoning. A short run of random outcomes cannot establish that you are well or poorly calibrated."));
}

function renderBias(root) {
  const host = root.querySelector("#interactive-activity");
  const scenarios = [
    {
      question: "A shop shows a £300 coat, then a £160 coat. Why might the second price feel like a bargain?",
      answers: [
        ["The first price anchors the comparison.", "Anchoring: an earlier number can shape later estimates."],
        ["I already spent money on the coat.", "That would be sunk cost, but no money has been spent yet."],
        ["I noticed only evidence that agrees with me.", "That would be confirmation bias; here, the first number is the stronger cue."],
      ],
    },
    {
      question: "You paid for a concert, but feel unwell on the day. What thought might pull you toward going anyway?",
      answers: [
        ["I have spent the money, so I must go.", "Sunk cost: a past cost can feel like a reason to keep going, even when the next choice can be made fresh."],
        ["The first price is setting my estimate.", "That is anchoring; this example is about treating a past cost as a reason to continue."],
        ["I only look for confirming evidence.", "That is confirmation bias; try separating the past cost from what would help now."],
      ],
    },
    {
      question: "You believe a new routine works, so you mostly notice days that support that view. What could be happening?",
      answers: [
        ["Confirmation bias.", "Confirmation bias: evidence that fits an existing view can stand out more than evidence that does not."],
        ["Sunk cost.", "Sunk cost is about continuing because of past investment."],
        ["Anchoring.", "Anchoring is when an earlier reference point pulls a later estimate."],
      ],
    },
  ];
  let index = 0;
  const scenario = element("div", "bias-scenario");
  const question = element("h3", "");
  const answers = element("div", "choice-cloud");
  const result = element("p", "interactive-result", "Choose a possible explanation.");
  const nav = element("div", "row");
  const previous = button("Previous example", "button subtle-button");
  const next = button("Next example", "button subtle-button");
  const draw = () => {
    question.textContent = scenarios[index].question;
    answers.replaceChildren();
    result.textContent = "Choose a possible explanation.";
    scenarios[index].answers.forEach(([label, explanation]) => {
      const item = button(label, "interactive-choice");
      item.addEventListener("click", () => {
        answers.querySelectorAll("button").forEach((node) => node.classList.toggle("selected", node === item));
        result.textContent = explanation;
      });
      answers.append(item);
    });
    previous.disabled = index === 0;
    next.disabled = index === scenarios.length - 1;
    showStatus(root, "Example " + (index + 1) + " of " + scenarios.length + ". Explore the idea; this is not a score.");
  };
  previous.addEventListener("click", () => { index -= 1; draw(); });
  next.addEventListener("click", () => { index += 1; draw(); });
  nav.append(previous, next);
  scenario.append(question);
  host.append(scenario, answers, result, nav);
  draw();
}

function renderSteps(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const data = sequenceParts[tool.id] || ["Notice where you are", "Choose one small adjustment", "Try it briefly", "Check what happens"];
  let index = 0;
  const number = element("span", "step-counter", "01 / " + String(data.length).padStart(2, "0"));
  const card = element("div", "guided-step", data[index]);
  const actions = element("div", "row");
  const back = button("Previous", "button subtle-button");
  const next = button("Next step", "button");
  const update = () => {
    card.textContent = data[index];
    number.textContent = String(index + 1).padStart(2, "0") + " / " + String(data.length).padStart(2, "0");
    back.disabled = index === 0;
    next.textContent = index === data.length - 1 ? "Begin again" : "Next step";
    showStatus(root, "Step " + (index + 1) + " of " + data.length + ". Skip or stop any time.");
  };
  back.addEventListener("click", () => { index = Math.max(0, index - 1); update(); });
  next.addEventListener("click", () => { index = index === data.length - 1 ? 0 : index + 1; update(); });
  actions.append(back, next);
  host.append(number, card, actions);
  update();
}

function renderScene(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const data = options[tool.id] || ["Notice a detail", "Notice an effort", "Notice a small comfort"];
  const panel = element("div", "choice-cloud");
  const counter = element("p", "scene-counter", "0 details noticed");
  let count = 0;
  data.forEach((label, index) => {
    const tile = button(label, "scene-tile scene-tile-" + index);
    tile.addEventListener("click", () => {
      const active = tile.classList.toggle("noticed");
      count += active ? 1 : -1;
      counter.textContent = count + (count === 1 ? " detail noticed" : " details noticed");
      showStatus(root, "You noticed: " + label + ". No need to keep looking if you are done.");
    });
    panel.append(tile);
  });
  host.append(panel, counter);
}

function renderMasking(root) {
  const host = root.querySelector("#interactive-activity");
  const rows = options["masking-map"];
  const state = new Map();
  const panel = element("div", "masking-contexts");
  rows.forEach((context) => {
    const row = element("div", "masking-row");
    const title = element("h3", "", context);
    const slider = document.createElement("input"); slider.type = "range"; slider.min = "0"; slider.max = "4"; slider.value = "0"; slider.setAttribute("aria-label", "How much do you adapt in " + context);
    const output = element("output", "", "Not set");
    slider.addEventListener("input", () => {
      const labels = ["Not set", "A little", "Some", "A lot", "Very much"];
      state.set(context, labels[Number(slider.value)]);
      output.textContent = labels[Number(slider.value)];
      row.classList.toggle("adapted", Number(slider.value) > 0);
    });
    row.append(title, slider, output);
    panel.append(row);
  });
  host.append(element("p", "interactive-instruction", "This is a private visual map on your device. No pattern is better, and you can leave any context unset."), panel);
}

function renderIntensity(root) {
  const host = root.querySelector("#interactive-activity");
  const slider = document.createElement("input"); slider.type = "range"; slider.min = "0"; slider.max = "10"; slider.value = "5"; slider.setAttribute("aria-label", "Current intensity");
  const output = element("output", "", "5 / 10");
  const card = element("div", "intensity-response");
  const update = () => {
    const value = Number(slider.value);
    output.textContent = value + " / 10";
    card.textContent = value <= 3 ? "At a lower intensity, a small reflection or simple next step may be accessible." : value <= 7 ? "At a middle intensity, try reducing one demand and orienting to what is happening now." : "At a high intensity, choose fewer inputs, seek immediate support if needed, and leave complex decisions for later if you can.";
    card.className = "intensity-response level-" + (value <= 3 ? "low" : value <= 7 ? "mid" : "high");
  };
  slider.addEventListener("input", update);
  update();
  host.append(slider, output, card, element("p", "fine", "These are general ideas, not an assessment. You know your situation best."));
}

function renderLoop(root) {
  const host = root.querySelector("#interactive-activity");
  const nodes = sequenceParts["pattern-loop-simulator"];
  const stage = element("div", "loop-stage");
  nodes.forEach((label, index) => {
    const node = element("div", "loop-node");
    node.append(element("span", "loop-number", String(index + 1)), element("b", "", label));
    stage.append(node);
  });
  const buttonNode = button("Play the short-term loop", "button");
  buttonNode.addEventListener("click", () => {
    stage.classList.remove("looping");
    void stage.offsetWidth;
    stage.classList.add("looping");
    showStatus(root, "Notice the quick relief and the later cost. This is one possible pattern, not a diagnosis.");
  });
  host.append(stage, buttonNode);
}

function renderMixer(root, tool) {
  if (tool.id === "sensory-mixer" || tool.id === "social-battery" || tool.id === "motivation-mixer") return renderSliders(root, tool);
  if (tool.id === "sensory-profile") {
    const host = root.querySelector("#interactive-activity");
    const categories = ["Sound", "Texture", "Light", "Movement", "Crowds", "Smell"];
    categories.forEach((label) => {
      const group = element("section", "profile-choice");
      group.append(element("h3", "", label));
      const chips = element("div", "choice-cloud");
      addChipChoices(root, chips, ["Seek", "Avoid", "Neutral", "Depends on context"], { onChoose: (value) => showStatus(root, label + ": " + value + ". You can choose differently in another context.") });
      group.append(chips);
      host.append(group);
    });
    return;
  }
  renderSliders(root, tool);
}

export function renderInteractiveTool(root, id) {
  const tool = interactiveTools.find((item) => item.id === id);
  if (!tool) {
    root.innerHTML = '<div class="wrap"><section class="page-intro"><p class="eyebrow">Interactive toolbox</p><h1>That activity could not be found.</h1><p class="lead">Choose another activity from the no-writing collection.</p></section><a class="button" href="#tools">Back to tools</a></div>';
    return;
  }
  const link = hrefFor(tool);
  if (tool.mode === "link") {
    location.hash = link.slice(1);
    return;
  }
  if (tool.mode === "play") {
    location.href = link;
    return;
  }
  root.innerHTML =
    '<div class="wrap interactive-page"><a class="back-link" href="#tools">← Back to the toolbox</a><section class="page-intro"><p class="eyebrow">Interactive · no writing · ' +
    escape(groupFor(tool.group)) +
    '</p><h1 id="interactive-title"></h1><p class="lead" id="interactive-description"></p></section><section class="interactive-stage"><div class="interactive-stage-head"><span class="interactive-stage-icon" aria-hidden="true">✳</span><div><p class="eyebrow">Try an activity</p><h2 id="interactive-prompt"></h2></div></div><div id="interactive-activity"></div><p id="interactive-status" class="interactive-status" aria-live="polite">Nothing is scored. Stop whenever you like.</p></section><p class="fine">This is an educational reflection activity, not a diagnosis or treatment. Nothing is saved unless a tool explicitly offers a save option.</p><a class="button" href="#tools">Choose another activity</a></div>';
  root.querySelector("#interactive-title").textContent = tool.title;
  root.querySelector("#interactive-description").textContent = tool.short;
  root.querySelector("#interactive-prompt").textContent = tool.title;
  if (tool.mode === "body") renderBodyMap(root);
  else if (tool.mode === "sort") renderSortTool(root, tool);
  else if (tool.mode === "mixer") renderMixer(root, tool);
  else if (tool.mode === "range") renderSliders(root, tool);
  else if (tool.mode === "breath") renderBreath(root);
  else if (tool.mode === "release") renderZones(root, tool);
  else if (tool.mode === "pattern") renderPattern(root);
  else if (tool.mode === "senses") renderSenses(root);
  else if (tool.mode === "sequence") renderSequence(root, tool);
  else if (tool.mode === "radar") renderRadar(root);
  else if (tool.mode === "scene") renderScene(root, tool);
  else if (tool.mode === "weather") renderWeather(root);
  else if (tool.mode === "memory") renderMemory(root);
  else if (tool.mode === "savour") renderTimer(root, tool);
  else if (tool.mode === "wave") renderWave(root);
  else if (tool.mode === "perspective") renderPerspective(root, tool);
  else if (tool.mode === "probability") renderProbability(root);
  else if (tool.mode === "bias") renderBias(root);
  else if (tool.mode === "steps" && tool.id === "task-shrinker") renderTaskShrinker(root);
  else if (tool.mode === "steps") renderSteps(root, tool);
  else if (tool.mode === "loop") renderLoop(root);
  else if (tool.mode === "masking") renderMasking(root);
  else if (tool.mode === "intensity") renderIntensity(root);
  else if (tool.mode === "spotlight") renderSpotlight(root);
  else if (tool.mode === "meter") renderMeter(root);
  else if (tool.mode === "defusion") renderDefusion(root);
  else if (tool.mode === "needs") renderNeeds(root);
  else if (tool.mode === "values") renderValues(root);
  else if (tool.mode === "budget") renderBudget(root);
  else if (tool.mode === "balance") renderBalance(root, tool);
  else if (tool.mode === "alternatives") renderPerspective(root, tool);
  else if (tool.mode === "regulation") renderRegulation(root);
  else if (tool.mode === "match") renderChoice(root, tool, true);
  else renderChoice(root, tool, false);
}

function renderChoice(root, tool, multiple) {
  const host = root.querySelector("#interactive-activity");
  if (tool.id === "emotion-matching") {
    const scenes = prompts[tool.id] || [];
    const sceneBox = element("div", "choice-cloud");
    const scene = element("p", "bias-scenario", "Choose a situation to explore.");
    const labels = element("div", "choice-cloud");
    const result = element("p", "interactive-result", "Several feeling words can fit one situation.");
    scenes.forEach((label) => {
      const item = button(label, "interactive-choice");
      item.addEventListener("click", () => {
        sceneBox.querySelectorAll("button").forEach((node) => node.classList.toggle("selected", node === item));
        scene.textContent = label;
        showStatus(root, "Notice which feeling words seem possible for this context. More than one may fit.");
      });
      sceneBox.append(item);
    });
    addChipChoices(root, labels, options[tool.id] || [], { multiple: true, onChoose: (values) => { result.textContent = values.length ? "Possible matches for this scene: " + values.join(", ") + ". They can coexist." : "No feeling words selected."; } });
    host.append(element("p", "interactive-instruction", "Choose an example context, then tap any feelings that could fit. There is no single correct answer."), sceneBox, scene, labels, result);
    return;
  }
  const list = options[tool.id] || prompts[tool.id] || ["A little more space", "A familiar rhythm", "A small next step", "A pause", "Not sure yet"];
  const cloud = element("div", "choice-cloud");
  const details = element("p", "interactive-result", multiple ? "Choose any possibilities that fit." : "Choose one option to explore.");
  addChipChoices(root, cloud, list, { multiple, onChoose: (value) => { details.textContent = multiple ? (value.length ? "Possible matches: " + value.join(", ") : "No matches selected.") : "Selected: " + value + ". This is one possibility; it does not have to explain everything."; } });
  host.append(cloud, details);
}
function renderNeeds(root) {
  const host = root.querySelector("#interactive-activity");
  const groups = [
    ["Body", ["Rest", "Food or water", "Less input", "Movement"]],
    ["Connection", ["Company", "Reassurance", "Space", "Repair"]],
    ["Direction", ["Clarity", "Choice", "Purpose", "Fairness"]],
  ];
  const box = element("div", "needs-steps");
  const result = element("p", "interactive-result", "Pick one broad area to see a few more specific possibilities.");
  groups.forEach(([label, children]) => {
    const group = element("section", "needs-group");
    const heading = button(label, "needs-heading");
    const optionsBox = element("div", "choice-cloud");
    optionsBox.hidden = true;
    heading.addEventListener("click", () => {
      box.querySelectorAll(".choice-cloud").forEach((node) => { if (node !== optionsBox) node.hidden = true; });
      optionsBox.hidden = !optionsBox.hidden;
    });
    addChipChoices(root, optionsBox, children, { onChoose: (value) => { result.textContent = "One possible need to explore: " + value + ". You can select another or stop here."; } });
    group.append(heading, optionsBox);
    box.append(group);
  });
  host.append(box, result);
}
function renderValues(root) {
  const host = root.querySelector("#interactive-activity");
  const list = options["values-compass"];
  const first = element("div", "choice-cloud");
  const second = element("div", "choice-cloud");
  const range = document.createElement("input"); range.type = "range"; range.min = "0"; range.max = "100"; range.value = "50"; range.setAttribute("aria-label", "Balance between two values");
  const output = element("output", "", "Balanced for now");
  let a = "";
  let b = "";
  addChipChoices(root, first, list, { onChoose: (value) => { a = value; update(); } });
  addChipChoices(root, second, list, { onChoose: (value) => { b = value; update(); } });
  const update = () => {
    if (!a || !b) return;
    output.textContent = Number(range.value) < 40 ? "More weight toward " + a : Number(range.value) > 60 ? "More weight toward " + b : "Balanced between " + a + " and " + b;
  };
  range.addEventListener("input", update);
  host.append(element("h3", "", "Choose one value"), first, element("h3", "", "Choose another"), second, range, output, element("p", "fine", "The slider shows today's weighting, not which value is objectively correct."));
}
function renderRegulation(root) {
  const host = root.querySelector("#interactive-activity");
  const states = options["regulation-picker"];
  const suggestions = {
    "Too activated": ["Lower the input", "Try a slower visual pace", "Move away from a decision for a minute"],
    "Too flat": ["Add gentle movement", "Try a familiar sound", "Change light or temperature"],
    Overwhelmed: ["Reduce one demand", "Choose a single sense to notice", "Ask someone safe to sit with you"],
    Restless: ["Use a steady repeated movement", "Take a short walk", "Try a simple hand activity"],
    Unsure: ["Check food, water, sleep or pain", "Choose one comfortable sensation", "Wait before interpreting the feeling"],
  };
  const result = element("div", "regulation-result", "Pick the closest state, or choose none.");
  const cloud = element("div", "choice-cloud");
  states.forEach((state) => {
    const item = button(state, "interactive-choice");
    item.addEventListener("click", () => {
      cloud.querySelectorAll("button").forEach((node) => node.classList.toggle("selected", node === item));
      result.replaceChildren(element("h3", "", "A few gentle options"));
      (suggestions[state] || []).forEach((suggestion) => result.append(element("p", "", suggestion)));
      showStatus(root, "These are options to try or ignore; choose based on what feels okay to you.");
    });
    cloud.append(item);
  });
  host.append(cloud, result);
}

function renderBudget(root) {
  const host = root.querySelector("#interactive-activity");
  const capacity = 12;
  const categories = ["Rest", "Work or study", "People", "Play or creativity"];
  const amounts = Object.fromEntries(categories.map((name) => [name, 3]));
  const total = element("p", "budget-total");
  const list = element("div", "budget-list");
  const tokens = element("div", "budget-tokens");
  const update = () => {
    const spent = Object.values(amounts).reduce((sum, value) => sum + value, 0);
    total.textContent = (capacity - spent) + " energy tokens left to allocate";
    tokens.replaceChildren();
    for (let index = 0; index < capacity; index += 1) {
      tokens.append(element("span", "budget-token" + (index < spent ? " allocated" : "")));
    }
    list.querySelectorAll(".budget-row").forEach((row) => {
      const name = row.dataset.category;
      row.querySelector(".budget-count").textContent = String(amounts[name]);
      row.querySelector(".budget-add").disabled = spent >= capacity;
      row.querySelector(".budget-remove").disabled = amounts[name] <= 0;
    });
  };
  categories.forEach((name) => {
    const row = element("div", "budget-row");
    row.dataset.category = name;
    const minus = button("−", "budget-remove");
    const plus = button("+", "budget-add");
    minus.setAttribute("aria-label", "Remove an energy token from " + name);
    plus.setAttribute("aria-label", "Allocate an energy token to " + name);
    minus.addEventListener("click", () => { amounts[name] = Math.max(0, amounts[name] - 1); update(); });
    plus.addEventListener("click", () => { const used = Object.values(amounts).reduce((sum, value) => sum + value, 0); if (used < capacity) amounts[name] += 1; update(); });
    row.append(element("span", "budget-category", name), minus, element("b", "budget-count", String(amounts[name])), plus);
    list.append(row);
  });
  host.append(element("p", "interactive-instruction", "There are 12 tokens in this example budget. Move them to show where your limited energy might go today; change the total whenever you like."), total, tokens, list, element("p", "fine", "This is a planning picture, not a measure of your worth or capacity."));
  update();
}

function renderBalance(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const choices = tool.id === "decision-balance"
    ? ["Rest", "Reply today", "Ask for help", "Wait and see", "Try a small experiment"]
    : options["values-compass"];
  const first = element("div", "choice-cloud");
  const second = element("div", "choice-cloud");
  const scale = document.createElement("input");
  scale.type = "range"; scale.min = "0"; scale.max = "100"; scale.value = "50";
  scale.setAttribute("aria-label", "Adjust the balance between the two selections");
  const output = element("output", "balance-readout", "Choose two options to compare.");
  let left = "";
  let right = "";
  const update = () => {
    if (!left || !right) {
      output.textContent = "Choose two options to compare.";
      return;
    }
    output.textContent = Number(scale.value) < 40 ? "More weight on " + left : Number(scale.value) > 60 ? "More weight on " + right : "A fairly even balance between " + left + " and " + right;
  };
  addChipChoices(root, first, choices, { onChoose: (value) => { left = value; update(); } });
  addChipChoices(root, second, choices, { onChoose: (value) => { right = value; update(); } });
  scale.addEventListener("input", update);
  host.append(element("p", "interactive-instruction", "Choose two options, then move the balance to reflect what feels more important right now."), element("h3", "", "Option A"), first, element("h3", "", "Option B"), second, scale, output, element("p", "fine", "The balance describes your current view. It does not decide for you."));
}

function renderTaskShrinker(root) {
  const host = root.querySelector("#interactive-activity");
  const taskSteps = {
    "Begin studying": ["Open the document or book", "Choose one heading", "Read one paragraph", "Spend two minutes on one question"],
    "Send a message": ["Open the conversation", "Choose one thing to say", "Write or say one sentence", "Decide whether to send it"],
    "Tidy one area": ["Choose one small surface", "Move one item", "Put similar things together", "Stop or choose one more item"],
    "Make something to eat": ["Choose a familiar food", "Get one ingredient", "Prepare one easy part", "Pause and see what is next"],
    "Get ready to leave": ["Choose the first needed item", "Put it by the door", "Get shoes or coat", "Step outside or check again"],
  };
  const tasks = element("div", "choice-cloud");
  const route = element("ol", "task-shrink-steps");
  const result = element("p", "interactive-result", "Pick a sample task; it is only a starting point.");
  Object.entries(taskSteps).forEach(([name, steps]) => {
    const item = button(name, "interactive-choice");
    item.addEventListener("click", () => {
      tasks.querySelectorAll("button").forEach((node) => node.classList.toggle("selected", node === item));
      route.replaceChildren();
      steps.forEach((step) => route.append(element("li", "", step)));
      result.textContent = "Choose the smallest step that feels doable, or make it smaller in your own way.";
    });
    tasks.append(item);
  });
  host.append(element("p", "interactive-instruction", "Choose a sample task and browse smaller steps. You do not need to type a task."), tasks, route, result);
}

function renderMeter(root) {
  const host = root.querySelector("#interactive-activity");
  const items = ["Messages", "Noise or light", "Decisions", "People", "Travel", "Pain or illness", "Unfinished tasks", "Unexpected change"];
  const selected = new Set();
  const capacity = document.createElement("input");
  capacity.type = "range"; capacity.min = "1"; capacity.max = "8"; capacity.value = "5";
  capacity.setAttribute("aria-label", "Available capacity");
  const meter = element("div", "load-meter");
  const output = element("p", "interactive-result", "Tap a demand to see how the picture changes.");
  const update = () => {
    meter.replaceChildren();
    const count = selected.size;
    for (let i = 0; i < 8; i += 1) meter.append(element("span", "load-block" + (i < count ? " loaded" : "")));
    const difference = count - Number(capacity.value);
    output.textContent = difference > 0 ? count + " example demands are above the capacity setting by " + difference + ". You can remove a demand or raise capacity." : count + " example demands with " + (Number(capacity.value) - count) + " open capacity marks. This is only a visual prompt.";
  };
  const choices = element("div", "choice-cloud");
  items.forEach((name) => {
    const item = button(name, "interactive-choice");
    item.addEventListener("click", () => {
      if (selected.has(name)) selected.delete(name); else selected.add(name);
      item.classList.toggle("selected", selected.has(name));
      item.setAttribute("aria-pressed", String(selected.has(name)));
      update();
    });
    choices.append(item);
  });
  capacity.addEventListener("input", update);
  host.append(element("p", "interactive-instruction", "Choose example demands that are present, then adjust the capacity slider. Remove anything that does not fit."), choices, element("h3", "", "Available capacity"), capacity, meter, output);
  update();
}

function renderDefusion(root) {
  const host = root.querySelector("#interactive-activity");
  const samples = ["I have to get this perfect", "They must be angry with me", "I cannot handle this", "I should already know"];
  const cloud = element("div", "choice-cloud");
  const thought = element("div", "defusion-thought", samples[0]);
  const controls = [["Distance", "Close", "Far"], ["Size", "Small", "Large"], ["Volume", "Quiet", "Loud"]];
  const adjust = element("div", "interactive-sliders");
  const ranges = [];
  const update = () => {
    thought.style.setProperty("--thought-scale", String(0.8 + Number(ranges[1]?.value || 50) / 160));
    thought.style.setProperty("--thought-opacity", String(0.35 + Number(ranges[2]?.value || 50) / 150));
    thought.style.setProperty("--thought-distance", String(Number(ranges[0]?.value || 50)) + "%");
  };
  samples.forEach((sample) => {
    const item = button(sample, "interactive-choice");
    item.addEventListener("click", () => {
      cloud.querySelectorAll("button").forEach((node) => node.classList.toggle("selected", node === item));
      thought.textContent = sample;
      showStatus(root, "This is a sample thought. Try changing how it appears, not whether it is true.");
    });
    cloud.append(item);
  });
  controls.forEach(([label, low, high], index) => {
    const row = element("label", "interactive-control");
    const input = document.createElement("input");
    input.type = "range"; input.min = "0"; input.max = "100"; input.value = "50";
    input.setAttribute("aria-label", label); ranges[index] = input;
    input.addEventListener("input", update);
    row.append(element("span", "control-label", label), input, element("span", "range-ends", low + " · " + high));
    adjust.append(row);
  });
  host.append(element("p", "interactive-instruction", "Choose a sample thought, then change how close, large or loud it feels in your mind."), cloud, thought, adjust);
  update();
}

function renderSpotlight(root) {
  const host = root.querySelector("#interactive-activity");
  const scene = element("div", "spotlight-scene");
  scene.setAttribute("aria-label", "Choose an object in the scene to bring it into focus");
  ["A mug", "A window", "A leaf", "A book", "A lamp", "A cushion", "A plant", "A door"].forEach((label, index) => {
    const detail = button(label, "spotlight-detail spotlight-detail-" + index);
    detail.addEventListener("click", () => {
      scene.querySelectorAll(".spotlight-detail").forEach((node) => node.classList.remove("in-focus"));
      detail.classList.add("in-focus");
      showStatus(root, "Attention resting on: " + label + ". You can choose something else or let attention widen.");
    });
    scene.append(detail);
  });
  const widen = button("Let attention widen", "button subtle-button");
  widen.addEventListener("click", () => {
    scene.querySelectorAll(".spotlight-detail").forEach((node) => node.classList.remove("in-focus"));
    showStatus(root, "The whole scene is in view again.");
  });
  host.append(element("p", "interactive-instruction", "Choose a detail to bring into focus, then widen back to the whole scene."), scene, widen);
}

export function renderTeam(root) {
  root.innerHTML =
    '<div class="wrap team-page"><section class="team-hero"><div class="team-photo-frame"><img src="drew-profile.png" alt="Drew Horrobin wearing a graduation gown and mortarboard" class="team-photo"><span class="team-photo-caption">Drew Horrobin · Founder</span></div><div class="team-intro"><p class="eyebrow">Meet the team</p><h1>A small team,<br><em>one whole human at a time.</em></h1><p class="lead">I’m Drew: a University of Liverpool psychology graduate, researcher and support worker, and the person behind Nobody’s Simple.</p><p>I built this project because people deserve more than a label or a flattened story. Psychology can help us understand patterns, but a person is also shaped by their body, history, relationships, culture and the systems around them. Nobody’s Simple is my way of putting more of that context within reach.</p><a class="button" href="#library">Explore the learning library <span aria-hidden="true">↗</span></a></div></section><section class="team-section"><div><p class="eyebrow">The work behind it</p><h2>Research, support and shared discovery.</h2></div><div class="team-bio-grid"><article class="team-card"><span class="team-card-mark">01</span><h3>Research</h3><p>My research experience at the University of Liverpool has included autistic people’s lived experience and creative expression, postpartum guilt and shame, climate emotions and environmental action, and the way virtual nature can shape how people feel.</p></article><article class="team-card"><span class="team-card-mark">02</span><h3>People and practice</h3><p>I’ve also spent time in an NHS clinical psychology placement, mental health coaching and volunteer phone support. Those experiences keep the work grounded in what help can feel like in real life: timely, respectful and shaped around the person.</p></article></div></section><section class="team-promise"><div class="team-promise-heading"><p class="eyebrow">What you can expect from us</p><h2>Our promises.</h2><p>“Bring twigs, not tablets.” We are here to explore with you, not lecture at you.</p></div><div class="promise-list"><article><span>01</span><div><h3>Keep the person in context.</h3><p>We will make room for body, biography, relationships, culture and the conditions people live in.</p></div></article><article><span>02</span><div><h3>Explain without excusing.</h3><p>We will hold accountability without reducing someone to one behaviour, label or moment.</p></div></article><article><span>03</span><div><h3>Offer paths, not verdicts.</h3><p>Our ideas and tools are invitations to explore. You choose what fits, what to leave and what to do next.</p></div></article><article><span>04</span><div><h3>Stay curious and correctable.</h3><p>We will treat knowledge as something people build together, and make space for evidence, lived experience and disagreement.</p></div></article></div></section><section class="team-direction"><div><p class="eyebrow">Where we’re heading</p><h2>Read the whole human. Find a way forward.</h2><p>We’re growing a free, welcoming collection of research-informed learning, original videos, practical tools and small interactive experiences—including ways to explore without writing. The aim is not to have the final word. It is to help people see more of the map, find their bearings and choose what comes next.</p></div><div class="team-next-links"><a class="button bright" href="#library">Explore the learning library →</a><a class="button outline-light" href="#simplyfocus">Visit SimplyFocus →</a><a href="https://www.youtube.com/@nobodyssimple" target="_blank" rel="noopener noreferrer">Watch our shared discoveries on YouTube ↗</a></div></section></div>';
}
