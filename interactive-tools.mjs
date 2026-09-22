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
// This module is separate from features.mjs, so give its toolbox renderer its
// own query helper instead of relying on another module's private `$` binding.
const $ = (selector, root = document) => root.querySelector(selector);

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
  ["social-script-builder", "Social Script Builder", "relate", "scripts", "relate,think,decision,self", "communicate,understand,decide", "Build a message for an ambiguous social moment, then edit or copy it in your own voice."],
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
  '"><span class="interactive-tool-kind">Interactive · choose your way</span><span class="interactive-tool-number">' +
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
    (tool.id === "social-script-builder" && (goal === "communicate" || chosen.includes("relate")) ? 6 : 0) +
    (Number(energy) === 0 && ["body", "calm", "feel", "sensory"].some((tag) => tool.situations.includes(tag)) ? 1 : 0);
  const defaults = {
    calmer: ["breathing-pacer", "five-senses-grounding", "urge-surfing"],
    organise: ["overload-meter", "priority-sorter", "energy-budget"],
    decide: ["decision-balance", "values-compass", "reversibility-gauge"],
    communicate: ["social-script-builder", "boundary-sorter", "perspective-wheel"],
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

const socialScriptScenarios = [
  { id: "join-group", label: "Join a group or conversation", scripts: [
    ["Clear", "Hi, is it okay if I join you? I’m interested in what you’re talking about."],
    ["Warm", "Hey, I know you’re already chatting, but I’d love to join in if there’s room."],
    ["Low-pressure", "Would it be alright if I sat with you for a bit? No pressure to pause your conversation."],
    ["Specific", "I heard you mention [topic]. I know a little about that too—can I ask what you think?"],
    ["Exit included", "I’m going to say hello and join for a few minutes, then I may head off again."],
    ["Text first", "I’m nearby and would like to join you. Is now a good time, or would another time work better?"]
  ]},
  { id: "introduce", label: "Introduce yourself in a new setting", scripts: [
    ["Simple", "Hi, I’m [name]. I’m here for [reason]. How do you know everyone?"],
    ["Friendly", "Hello, I’m [name]—nice to meet you. I’m still finding my bearings, so I may ask a few questions."],
    ["Direct", "I don’t know many people here yet. Would you mind telling me a little about how this works?"],
    ["Interest-led", "I’m [name], and I’m interested in [interest]. What brought you here?"],
    ["Low-energy", "Hi, I’m [name]. I may be quiet at first, but I’m glad to be here."],
    ["Written", "Hi everyone, I’m [name]. I’m looking forward to learning about [topic] and meeting people at my own pace."]
  ]},
  { id: "ask-out", label: "Ask someone out or ask to spend time together", scripts: [
    ["Clear", "I’ve enjoyed talking with you. Would you like to get coffee with me sometime?"],
    ["Low-pressure", "I like spending time with you. Would you be open to meeting one-to-one? It’s completely okay if not."],
    ["Specific", "Would you like to go to [place] on [day] at [time]? We could keep it to about [length]."],
    ["Text", "I’ve been meaning to ask: would you like to hang out sometime? No worries if your answer is no."],
    ["Clarifying", "I’m interested in getting to know you better. Would that be welcome, or would you prefer to keep things as friends?"],
    ["After a no", "Thanks for being clear. I appreciate it, and I’ll respect that."]
  ]},
  { id: "follow-up", label: "Follow up after meeting someone", scripts: [
    ["Warm", "It was good to meet you today. I enjoyed our conversation about [topic]."],
    ["Invite", "I liked talking with you. Would you like to continue the conversation another time?"],
    ["Specific", "Thanks for chatting at [place]. You mentioned [topic]—I found [link/detail] and thought of you."],
    ["Low-pressure", "Just saying hello after today. No need to reply quickly; I hope your evening goes well."],
    ["Reconnect", "I enjoyed meeting you and would be glad to stay in touch if that feels good for you."],
    ["Professional", "It was a pleasure speaking with you. I’d value staying connected and learning more about your work."]
  ]},
  { id: "decline", label: "Decline an invitation kindly", scripts: [
    ["Short", "Thank you for inviting me. I’m going to decline this time, but I appreciate you thinking of me."],
    ["Warm", "That sounds lovely, but I don’t have the capacity for it right now. I hope you have a good time."],
    ["Alternative", "I can’t make that, but I could do [alternative] if you’d like."],
    ["No explanation", "Thanks for asking. I’m not available, and I don’t need to explain further, but I wanted to let you know."],
    ["Sensory-aware", "I’d like to see you, but that setting is likely to be too much for me. Could we choose somewhere quieter?"],
    ["Delayed reply", "Sorry for the slow reply. I’ve thought about it and I’m going to pass this time. Thank you for understanding."]
  ]},
  { id: "say-yes", label: "Say yes while asking for details or conditions", scripts: [
    ["Details", "Yes, I’d like to. Could you tell me the time, place, people who’ll be there and what to expect?"],
    ["Boundaried yes", "I can come for about an hour, then I’ll need to leave. Would that work?"],
    ["Sensory fit", "I’m interested. Is there a quieter space or a way to take breaks if I need one?"],
    ["Predictability", "I’d like to join. A quick outline of the plan would help me prepare."],
    ["Conditional", "I can say yes if [condition]. If that changes, I may need to reconsider."],
    ["Check-in", "I’m leaning yes. Can I confirm after I check my energy and schedule?"]
  ]},
  { id: "space", label: "Tell someone you need space", scripts: [
    ["Direct", "I need some space to process. I’m not ending the relationship; I’ll come back to this by [time]."],
    ["Gentle", "I care about this conversation, and I’m too activated to do it well right now. Can we pause?"],
    ["Practical", "I need quiet for the next hour. Please don’t message unless it’s urgent; I’ll contact you at [time]."],
    ["Text", "I’m overloaded and need a lower-input evening. I’m safe, I just need time before I reply."],
    ["Boundary", "I’m going to step away now. I’m willing to continue when we can speak without shouting."],
    ["Reassurance", "Needing space is about my capacity today, not a judgement of you. I’ll update you when I can."]
  ]},
  { id: "clarify", label: "Ask what an ambiguous message means", scripts: [
    ["Plain", "I’m not sure how to read that message. What did you mean?"],
    ["Non-accusing", "I may be missing context—could you clarify what you’re asking from me?"],
    ["Tone check", "I can’t tell whether that was serious or joking. Could you tell me how you meant it?"],
    ["Specific", "When you said [phrase], did you mean [option A] or [option B]?"],
    ["Written", "I process written messages quite literally sometimes, so a little more detail would help me respond accurately."],
    ["Time", "I want to answer properly. Can I check what you meant before I respond?"]
  ]},
  { id: "overwhelmed", label: "Say you are overwhelmed or low on capacity", scripts: [
    ["Short", "I’m at capacity right now and can’t take this on today."],
    ["Specific", "I can listen for ten minutes, but I don’t have capacity to problem-solve."],
    ["Delay", "I want to respond thoughtfully. I need until [time/day] before I can give this my attention."],
    ["Reduce input", "Could we use one question at a time and keep the message short? I’m overloaded."],
    ["Work", "I can complete [task] today, but [task] will need to move to [date]. Which is the priority?"],
    ["Reassure", "I’m not ignoring you. My capacity is low, so I’m taking a deliberate pause before replying."]
  ]},
  { id: "adjustment", label: "Ask for an adjustment or access need", scripts: [
    ["Clear", "Could we make one adjustment so I can take part: [specific request]?"],
    ["Sensory", "The noise/light is making it hard for me to focus. Could we lower it or use a quieter space?"],
    ["Instructions", "Could you send the steps in writing as well? That helps me work accurately."],
    ["Meeting", "Could we share an agenda and flag changes before the meeting where possible?"],
    ["Break", "I may need a short break. I’ll step out and return by [time] unless I tell you otherwise."],
    ["Collaborative", "I’m asking for an adjustment, not a lower standard. What option would work for both of us?"]
  ]},
  { id: "networking", label: "Network or message someone professionally", scripts: [
    ["Intro", "Hello [name], I’m [name]. I’m interested in [area] and appreciated your work on [specific thing]."],
    ["Question", "Would you be willing to answer one short question about how you got started in [field]?"],
    ["Informational chat", "If you have capacity, I’d value a 20-minute conversation about your experience in [area]."],
    ["No pressure", "No pressure to respond—your work has been useful to me, and I wanted to say thank you."],
    ["Follow-up", "Thank you for your advice. I tried [action], and [brief result]. I appreciate the direction."],
    ["Opportunity", "I’m interested in [opportunity]. Could you tell me what a strong next step would be?"]
  ]},
  { id: "community", label: "Join a club, class or community", scripts: [
    ["Ask", "Hi, I’m interested in joining. What should a new person know before attending?"],
    ["Access", "Could you tell me about the group size, noise level, breaks and typical structure?"],
    ["First visit", "I’d like to try one session before committing. Is that possible?"],
    ["Quiet entry", "I may listen more than I speak at first. Is that okay in this group?"],
    ["Online", "Hello, I’m new here. I’m interested in [topic] and may take a little time to join the conversation."],
    ["Leave", "Thank you for welcoming me. I’m going to head off now and may come back another time."]
  ]},
  { id: "repair", label: "Repair after a misunderstanding", scripts: [
    ["Own impact", "I can see that what I said landed badly. I’m sorry for the impact, and I’d like to understand."],
    ["Clarify intent", "My intention was [intent], but I understand that doesn’t erase the effect."],
    ["Ask", "Could you tell me which part felt hurtful so I can respond to the actual issue?"],
    ["Pause", "I want to repair this, but I need a little time to process before we continue."],
    ["Change", "Next time I’ll [specific change]. If I miss it, please tell me directly if you have capacity."],
    ["Boundary", "I’m willing to repair the misunderstanding. I’m not willing to continue while we insult each other."]
  ]},
  { id: "disagree", label: "Disagree without escalating", scripts: [
    ["Respectful", "I see it differently. The part I’m working from is [fact/experience]."],
    ["Curious", "Can we compare what each of us is assuming before we decide who is right?"],
    ["Specific", "I agree with [part], but not [part]. My concern is [reason]."],
    ["Pause", "I want to keep this constructive. Can we take ten minutes and return to it?"],
    ["Boundary", "I’m happy to discuss the issue, but not if the conversation becomes personal."],
    ["Not sure", "I don’t know enough yet to take a firm position. I’d like time to check the information."]
  ]},
  { id: "end-chat", label: "End a conversation or leave a group", scripts: [
    ["Simple", "I’m going to head off now. It was good to talk with you."],
    ["Time-bound", "I have about five minutes left, then I need to leave."],
    ["Energy", "My social energy is running low, so I’m going to take a quiet break."],
    ["Warm", "I’ve enjoyed this. I’m going to stop while I still have energy, and I hope we can continue another time."],
    ["Online", "I’m signing off for now. I may reply tomorrow when I have more capacity."],
    ["Firm", "I’m ending this conversation now. We can revisit it when I choose to."]
  ]},
  { id: "follow-request", label: "Request a response or follow-up", scripts: [
    ["Gentle", "When you have a moment, could you let me know what you’ve decided?"],
    ["Deadline", "Could you reply by [date/time] so I can plan the next step?"],
    ["Choice", "A quick yes/no is enough for now. If you’re unsure, ‘not yet’ is also useful."],
    ["Work", "I’m following up on [item]. Is it still on your list, or should we reset the plan?"],
    ["Low-pressure", "No rush if this is not a good time. I’m checking so I know whether to wait or make another plan."],
    ["Boundary", "If I don’t hear back by [time], I’ll assume it isn’t possible and will make another arrangement."]
  ]},
  { id: "change", label: "Respond when plans change or are cancelled", scripts: [
    ["Neutral", "Thanks for letting me know. I’m disappointed, but I understand plans can change."],
    ["Reschedule", "Would you like to choose another day now, or should we leave it open?"],
    ["Need clarity", "Could you tell me whether this is a cancellation or a postponement?"],
    ["Capacity", "The change is difficult for me to absorb. I need a little time before deciding on a new plan."],
    ["Alternative", "I can’t do the new time, but I could do [option]."],
    ["No rebook", "Thanks for telling me. I’m not ready to reschedule, but I’ll contact you if that changes."]
  ]},
  { id: "no-reply", label: "Follow up after no reply", scripts: [
    ["Light", "Just checking this reached you. No pressure if you need time."],
    ["Specific", "I’m following up about [topic]. Could you let me know by [date] if possible?"],
    ["Assume less", "I’m not sure whether you’re busy, missed the message or need something different from me."],
    ["Choice", "Would you prefer to reply here, talk briefly, or leave this for now?"],
    ["Close loop", "I haven’t heard back, so I’m going to close this for now. You can reopen it if useful."],
    ["Work", "I’ll proceed with [plan] unless I hear from you by [time]. Please tell me if that creates a problem."]
  ]},
  { id: "custom", label: "Something else / make your own", scripts: [
    ["Starter", "I want to say what I mean clearly. The situation is [brief context], and what I’m asking for is [request]."],
    ["Boundary starter", "I’m comfortable with [what works]. I’m not comfortable with [limit]. Could we [alternative]?"],
    ["Clarity starter", "I may be interpreting this incorrectly. Could you clarify [specific point]?"],
    ["Capacity starter", "I want to engage, but I have limited capacity for [thing]. I can offer [what is possible]."],
    ["Repair starter", "I want to acknowledge [impact] and work out a better next step."],
    ["Pause starter", "I’m going to pause before replying so I can answer deliberately rather than reactively."]
  ]}
];

export function appendInteractiveToolbox(root) {
  const host = root.querySelector("#interactive-tools-slot") || root.querySelector(".wrap") || root;
  const section = element("section", "interactive-toolbox section");
  section.innerHTML =
    '<div class="section-head"><div><p class="eyebrow">A separate way to explore</p><h2>Interactive tools</h2><p>Tap, move, sort, listen or add your own words. The written tools above stay separate.</p></div><span class="interactive-count">' + interactiveTools.length + ' activities</span></div><div class="interactive-catalog-controls"><label class="field">Find an activity<input id="interactive-search" type="search" placeholder="Try feelings, focus, decisions…"></label><div class="tabs interactive-categories" id="interactive-categories"></div></div><div id="interactive-catalog-groups"></div>';
  host.replaceChildren(section);
  const categories = $("#interactive-categories", section);
  const catalog = $("#interactive-catalog-groups", section);
  const search = $("#interactive-search", section);
  let activeGroup = "all";
  const filter = () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    catalog.querySelectorAll(".interactive-catalog-group").forEach((block) => {
      let inGroup = 0;
      block.querySelectorAll(".interactive-tool-card").forEach((card) => {
        const show = (activeGroup === "all" || block.dataset.group === activeGroup) && card.textContent.toLowerCase().includes(query);
        card.hidden = !show;
        if (show) inGroup += 1;
      });
      block.hidden = inGroup === 0;
      visible += inGroup;
    });
    const empty = $("#interactive-empty", section);
    if (empty) empty.hidden = visible !== 0;
  };
  [["all", "All"], ...groupNames].forEach(([id, label]) => {
    const tab = element("button", "chip" + (id === "all" ? " active" : ""), label);
    tab.type = "button";
    tab.dataset.category = id;
    tab.addEventListener("click", () => {
      activeGroup = id;
      categories.querySelectorAll("button").forEach((other) => other.classList.toggle("active", other === tab));
      filter();
    });
    categories.append(tab);
  });
  groupNames.forEach(([id, label]) => {
    const list = interactiveTools.filter((tool) => tool.group === id);
    const block = element("section", "interactive-catalog-group");
    block.dataset.group = id;
    const header = element("div", "section-head");
    const title = element("div");
    title.append(element("p", "eyebrow", "Hands-on activities"), element("h3", "", label));
    header.append(title, element("span", "fine", list.length + " tools"));
    const grid = element("div", "grid interactive-grid");
    list.forEach((tool, index) => {
      const holder = element("div");
      holder.innerHTML = interactiveCardMarkup(tool, index);
      const card = holder.firstElementChild;
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
  const config = sortConfig[tool.id] || { bins: ["Option A", "Option B", "Not sure yet"] };
  const seeded = prompts[tool.id] || ["A situation I can act on", "A thought I am adding", "A need I have", "Something outside my control", "A small next step"];
  const picked = element("div", "sort-cards");
  const bins = element("div", "sort-bins");
  const records = seeded.map((label, index) => ({ id: "sample-" + index, label }));
  const assigned = new Map();
  let activeId = "";
  const findCard = (id) => [...picked.querySelectorAll(".sort-card")].find((card) => card.dataset.cardId === id);
  const removePlacement = (id) => {
    bins.querySelectorAll(".sorted-chip").forEach((chip) => { if (chip.dataset.cardId === id) chip.remove(); });
    assigned.delete(id);
    findCard(id)?.classList.remove("sorted");
  };
  const place = (id, zone) => {
    const record = records.find((item) => item.id === id);
    if (!record || !zone) return;
    removePlacement(id);
    assigned.set(id, zone.dataset.zone);
    const chip = button(record.label + " ×", "sorted-chip");
    chip.dataset.cardId = id;
    chip.setAttribute("aria-label", "Remove " + record.label + " from " + zone.dataset.zone);
    chip.addEventListener("click", () => removePlacement(id));
    zone.querySelector(".sort-placed").append(chip);
    findCard(id)?.classList.add("sorted");
    showStatus(root, record.label + " placed in " + zone.dataset.zone + ". Move it again or remove it.");
  };
  const buildCard = (record) => {
    const card = button(record.label, "sort-card");
    card.dataset.cardId = record.id;
    card.setAttribute("aria-label", "Move card: " + record.label);
    card.addEventListener("click", () => {
      activeId = record.id;
      picked.querySelectorAll(".sort-card").forEach((other) => other.classList.toggle("selected", other === card));
      showStatus(root, "Selected: " + record.label + ". Tap a category or drag the card into it.");
    });
    let pointerId = null;
    let ghost = null;
    card.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      pointerId = event.pointerId;
      activeId = record.id;
      card.classList.add("dragging");
      ghost = element("div", "sort-drag-ghost", record.label);
      ghost.style.left = event.clientX + "px";
      ghost.style.top = event.clientY + "px";
      document.body.append(ghost);
      try { card.setPointerCapture(event.pointerId); } catch {}
    });
    card.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId || !ghost) return;
      ghost.style.left = event.clientX + "px";
      ghost.style.top = event.clientY + "px";
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".sort-zone");
      bins.querySelectorAll(".sort-zone").forEach((zone) => zone.classList.toggle("drag-over", zone === target));
    });
    const finish = (event) => {
      if (event.pointerId !== pointerId) return;
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".sort-zone");
      if (target) place(record.id, target);
      card.classList.remove("dragging");
      bins.querySelectorAll(".sort-zone").forEach((zone) => zone.classList.remove("drag-over"));
      ghost?.remove();
      ghost = null;
      pointerId = null;
    };
    card.addEventListener("pointerup", finish);
    card.addEventListener("pointercancel", finish);
    return card;
  };
  config.bins.forEach((label) => {
    const zone = element("section", "sort-zone");
    zone.dataset.zone = label;
    const heading = element("h3", "", label);
    const placed = element("div", "sort-placed");
    const drop = button("Place selected card here", "sort-drop");
    drop.addEventListener("click", () => {
      if (!activeId) { showStatus(root, "Choose a card first, then choose a category."); return; }
      place(activeId, zone);
    });
    zone.append(heading, placed, drop);
    bins.append(zone);
  });
  records.forEach((record) => picked.append(buildCard(record)));
  const customLabel = element("label", "field", "Add your own card (optional; add as many as you need)");
  const customInput = document.createElement("textarea");
  customInput.rows = 2;
  customInput.placeholder = "Type a worry, task, fact, or example";
  const add = button("Add card", "button");
  add.addEventListener("click", () => {
    const label = customInput.value.trim();
    if (!label) return;
    const record = { id: "custom-" + Math.random().toString(36).slice(2), label };
    records.push(record);
    picked.append(buildCard(record));
    customInput.value = "";
    showStatus(root, "Your card is ready to place.");
  });
  customLabel.append(customInput);
  const reset = button("Clear placed cards", "button subtle-button");
  reset.addEventListener("click", () => {
    assigned.clear(); activeId = "";
    picked.querySelectorAll(".sort-card").forEach((card) => card.classList.remove("selected", "sorted", "dragging"));
    bins.querySelectorAll(".sort-placed").forEach((node) => node.replaceChildren());
    showStatus(root, "Placed cards cleared. Your own cards remain until you leave.");
  });
  host.append(element("p", "interactive-instruction", "Drag a card into a category, or tap a card and then tap its destination. Add your own cards whenever you need."), picked, customLabel, add, bins, reset);
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
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 240 520");
  svg.setAttribute("class", "body-map-svg");
  svg.setAttribute("role", "group");
  svg.setAttribute("aria-label", "Tap one or more regions on the body figure.");
  const zones = [
    ["Head", "circle", { cx: 120, cy: 43, r: 28 }], ["Neck", "rect", { x: 106, y: 70, width: 28, height: 25, rx: 9 }],
    ["Chest", "path", { d: "M78 94 Q120 76 162 94 L156 172 Q120 184 84 172 Z" }], ["Stomach", "path", { d: "M84 175 Q120 184 156 175 L151 252 Q120 263 89 252 Z" }],
    ["Pelvis", "path", { d: "M89 255 Q120 265 151 255 L159 295 Q120 315 81 295 Z" }],
    ["Left shoulder", "path", { d: "M80 95 Q56 98 48 120 L67 137 Q79 127 88 116 Z" }], ["Right shoulder", "path", { d: "M160 95 Q184 98 192 120 L173 137 Q161 127 152 116 Z" }],
    ["Left upper arm", "path", { d: "M52 126 Q40 134 35 163 L22 221 Q21 235 34 239 L49 232 L67 150 Z" }], ["Right upper arm", "path", { d: "M188 126 Q200 134 205 163 L218 221 Q219 235 206 239 L191 232 L173 150 Z" }],
    ["Left hand", "path", { d: "M23 238 Q10 245 13 267 Q18 280 31 272 L43 245 Z" }], ["Right hand", "path", { d: "M217 238 Q230 245 227 267 Q222 280 209 272 L197 245 Z" }],
    ["Left thigh", "path", { d: "M83 300 Q101 306 116 303 L112 389 L83 390 Q77 350 83 300 Z" }], ["Right thigh", "path", { d: "M124 303 Q140 306 157 300 Q163 350 157 390 L128 389 Z" }],
    ["Left lower leg", "path", { d: "M84 394 L111 394 L107 476 L83 476 Z" }], ["Right lower leg", "path", { d: "M129 394 L156 394 L157 476 L133 476 Z" }],
    ["Left foot", "path", { d: "M83 478 L107 478 L110 492 Q106 502 78 499 L72 493 Z" }], ["Right foot", "path", { d: "M133 478 L157 478 L168 493 L162 499 Q134 502 130 492 Z" }],
  ];
  const picked = new Set();
  const summary = element("p", "body-map-selected", "No regions selected yet. Tap the figure wherever you notice something.");
  zones.forEach(([label, shape, attrs]) => {
    const group = document.createElementNS(ns, "g");
    group.setAttribute("class", "body-map-zone"); group.setAttribute("tabindex", "0"); group.setAttribute("role", "button");
    group.setAttribute("aria-label", label); group.setAttribute("aria-pressed", "false"); group.dataset.zone = label;
    const geometry = document.createElementNS(ns, shape);
    Object.entries(attrs).forEach(([key, value]) => geometry.setAttribute(key, String(value)));
    geometry.setAttribute("class", "body-map-shape");
    const title = document.createElementNS(ns, "title"); title.textContent = label;
    group.append(geometry, title);
    const toggle = () => {
      if (picked.has(label)) picked.delete(label); else picked.add(label);
      group.classList.toggle("selected", picked.has(label)); group.setAttribute("aria-pressed", String(picked.has(label)));
      summary.textContent = picked.size ? "Areas noticed: " + [...picked].join(" · ") : "No regions selected. Tap the figure wherever you notice something.";
      showStatus(root, summary.textContent);
    };
    group.addEventListener("click", toggle);
    group.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggle(); } });
    svg.append(group);
  });
  const senseHost = element("div", "choice-cloud");
  addChipChoices(root, senseHost, sensations, { multiple: true, onChoose: (list) => showStatus(root, (picked.size ? [...picked].join(" · ") : "No body region selected") + " · sensations: " + (list.join(", ") || "none selected")) });
  host.append(element("p", "interactive-instruction", "Tap one or more places on the figure itself, then choose any sensation words that fit."), svg, summary, element("h3", "", "Sensation words"), senseHost, element("p", "fine", "A neutral front-view figure; sensations do not have one fixed emotional meaning."));
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
  const stage = element("div", "breath-stage");
  const orb = element("div", "breath-orb", "Ready when you are");
  orb.setAttribute("aria-live", "polite");
  const phase = element("p", "breath-phase", "The shape is still. Choose a comfortable pace, then begin.");
  const label = element("label", "interactive-control");
  label.append(element("span", "control-label", "Choose a comfortable pace"));
  const speed = document.createElement("input");
  speed.type = "range"; speed.min = "4"; speed.max = "12"; speed.value = "7";
  speed.setAttribute("aria-label", "Full visual cycle length in seconds");
  const output = element("output", "", "7 seconds per full cycle");
  let startedAt = 0, interval = null, running = false;
  const setDuration = () => {
    orb.style.setProperty("--breath-duration", speed.value + "s");
    orb.style.setProperty("--breath-half-duration", (Number(speed.value) / 2) + "s");
    output.textContent = speed.value + " seconds per full cycle";
  };
  const tick = () => {
    const half = Number(speed.value) * 500;
    const inhale = (Date.now() - startedAt) % (half * 2) < half;
    orb.textContent = inhale ? "Inhale if comfortable" : "Exhale if comfortable";
    phase.textContent = inhale ? "Shape growing · breathe naturally if comfortable" : "Shape easing back · no breath hold";
  };
  const start = button("Start visual pacing", "button");
  speed.addEventListener("input", () => { setDuration(); if (running) { startedAt = Date.now(); tick(); } });
  start.addEventListener("click", () => {
    running = !running;
    window.clearInterval(interval);
    orb.classList.toggle("breathing", running);
    if (running) { startedAt = Date.now(); interval = window.setInterval(tick, 200); tick(); start.textContent = "Pause visual pacing"; showStatus(root, "The visual pacer is moving. Breathe naturally; pause whenever you want."); }
    else { orb.textContent = "Paused"; phase.textContent = "Paused. Your breathing can stay as it is."; start.textContent = "Resume visual pacing"; showStatus(root, "Pacer paused."); }
  });
  const cleanup = window.setInterval(() => { if (!host.contains(orb)) { window.clearInterval(interval); window.clearInterval(cleanup); } }, 1000);
  setDuration(); label.append(speed, output); stage.append(orb, phase);
  host.append(element("p", "interactive-instruction", "The shape expands and settles in a repeating visual cycle. There are no holds or required breathing pattern."), stage, label, start, element("p", "fine", "This is an optional visual cue, not a breathing instruction. Stop if focusing on breath feels uncomfortable."));
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
  const list = (sequenceParts[tool.id] || ["Notice where you are", "Choose one small adjustment", "Try it briefly", "Check what happens"]).slice();
  const ordered = element("ol", "sequence-list");
  const redraw = () => {
    ordered.replaceChildren();
    list.forEach((step, index) => {
      const row = element("li", "sequence-step"); row.draggable = true; row.dataset.index = String(index);
      row.append(element("span", "sequence-number", String(index + 1).padStart(2, "0")), element("span", "sequence-text", step));
      row.addEventListener("dragstart", (event) => { event.dataTransfer.setData("text/plain", String(index)); event.dataTransfer.effectAllowed = "move"; });
      row.addEventListener("dragover", (event) => { event.preventDefault(); row.classList.add("sequence-over"); });
      row.addEventListener("dragleave", () => row.classList.remove("sequence-over"));
      row.addEventListener("drop", (event) => {
        event.preventDefault(); row.classList.remove("sequence-over");
        const from = Number(event.dataTransfer.getData("text/plain"));
        if (!Number.isInteger(from) || from < 0 || from >= list.length || from === index) return;
        const [moved] = list.splice(from, 1); list.splice(index, 0, moved); redraw();
      });
      const actions = element("div", "sequence-actions");
      const move = (delta) => { const next = index + delta; if (next < 0 || next >= list.length) return; [list[index], list[next]] = [list[next], list[index]]; redraw(); };
      const up = button("↑", "icon-button"); up.setAttribute("aria-label", "Move step up"); up.disabled = index === 0; up.addEventListener("click", () => move(-1));
      const down = button("↓", "icon-button"); down.setAttribute("aria-label", "Move step down"); down.disabled = index === list.length - 1; down.addEventListener("click", () => move(1));
      actions.append(up, down); row.append(actions); ordered.append(row);
    });
  };
  const addLabel = element("label", "field", "Add your own step (optional)");
  const input = document.createElement("input"); input.type = "text"; input.placeholder = "A step that fits your situation";
  const add = button("Add step", "button");
  add.addEventListener("click", () => { const value = input.value.trim(); if (!value) return; list.push(value); input.value = ""; redraw(); });
  addLabel.append(input); redraw();
  host.append(element("p", "interactive-instruction", "Drag steps to reorder, use the arrow buttons on touch screens, or add your own."), ordered, addLabel, add);
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
  const stage = element("div", "urge-surf-stage");
  const wave = element("div", "urge-wave");
  const surfer = element("span", "urge-surfer", "🏄"); surfer.setAttribute("aria-hidden", "true"); wave.append(surfer);
  const duration = document.createElement("select"); duration.setAttribute("aria-label", "Choose how long to watch the wave");
  [[30, "30 seconds"], [60, "1 minute"], [90, "90 seconds"], [120, "2 minutes"], [180, "3 minutes"], [300, "5 minutes"]].forEach(([value, label]) => { const option = document.createElement("option"); option.value = String(value); option.textContent = label; duration.append(option); });
  const time = element("output", "urge-time-left", "Ready");
  const progress = document.createElement("progress"); progress.max = 100; progress.value = 0; progress.setAttribute("aria-label", "Time through this optional wave");
  const start = button("Start this wave", "button"); const reset = button("Reset", "button subtle-button");
  const guide = element("p", "interactive-result", "An urge can rise, fall, or change unexpectedly. The animation is a metaphor, not a prediction.");
  let remaining = Number(duration.value), timer = null;
  const paint = () => {
    const total = Number(duration.value), pct = total ? ((total - remaining) / total) * 100 : 0;
    progress.value = pct; time.textContent = remaining ? Math.floor(remaining / 60) + ":" + String(remaining % 60).padStart(2, "0") + " remaining" : "Wave complete";
    wave.style.setProperty("--wave-height", (18 + (1 - pct / 100) * 72) + "%"); wave.style.setProperty("--surfer-progress", pct + "%");
  };
  const stop = () => { window.clearInterval(timer); timer = null; wave.classList.remove("wave-active"); };
  start.addEventListener("click", () => {
    if (timer) { stop(); start.textContent = "Resume this wave"; guide.textContent = "Paused. Resume, reset, or leave whenever you like."; return; }
    if (remaining <= 0) remaining = Number(duration.value);
    start.textContent = "Pause"; guide.textContent = "Watch only if you want to. There is no need to change the urge.";
    wave.classList.add("wave-active");
    timer = window.setInterval(() => {
      if (!host.contains(wave)) { stop(); return; }
      remaining = Math.max(0, remaining - 1); paint();
      if (!remaining) { stop(); start.textContent = "Surf another wave"; guide.textContent = "The chosen time is complete. Notice what is true now—or simply leave."; }
    }, 1000);
    paint();
  });
  duration.addEventListener("change", () => { stop(); remaining = Number(duration.value); start.textContent = "Start this wave"; paint(); });
  reset.addEventListener("click", () => { stop(); remaining = Number(duration.value); start.textContent = "Start this wave"; guide.textContent = "Reset whenever you want; no result is kept."; paint(); });
  const actions = element("div", "row"); actions.append(start, reset);
  const controls = element("div", "urge-surf-controls"); const label = element("label", "field", "Choose a surf time"); label.append(duration); controls.append(label, time, progress, actions);
  stage.append(wave);
  host.append(element("p", "interactive-instruction", "Choose a time, then watch a surfer ride an illustrative wave that gradually settles. Pause or leave at any point."), stage, controls, guide, element("p", "fine", "Urges do not follow a reliable timer. The wave does not predict when yours will change."));
  paint();
}

function renderPerspective(root, tool) {
  const host = root.querySelector("#interactive-activity");
  const views = (options[tool.id] || ["My view", "Another view", "A wider view"]).slice();
  const notes = new Map(views.map((view) => [view, ""]));
  const wheel = element("div", "perspective-wheel"); const display = element("div", "perspective-display", views[0]);
  const noteLabel = element("label", "field", "Write or sketch a few words for this viewpoint (optional)");
  const note = document.createElement("textarea"); note.rows = 3; note.placeholder = "Your words stay in this page and are not saved."; noteLabel.append(note);
  let current = views[0];
  const select = (view) => { if (current) notes.set(current, note.value); current = view; display.textContent = view; note.value = notes.get(view) || ""; wheel.querySelectorAll("button").forEach((item) => item.classList.toggle("selected", item.textContent === view)); showStatus(root, "Viewing: " + view + ". Your notes remain on this page until you leave."); };
  const renderButton = (view) => { const item = button(view, "interactive-choice"); item.addEventListener("click", () => select(view)); wheel.append(item); };
  views.forEach(renderButton);
  const addLabel = element("label", "field", "Add another viewpoint (optional)"); const addInput = document.createElement("input"); addInput.placeholder = "e.g. what I know now, a trusted friend's view";
  const add = button("Add viewpoint", "button subtle-button"); add.addEventListener("click", () => { const view = addInput.value.trim(); if (!view || views.includes(view)) return; views.push(view); notes.set(view, ""); addInput.value = ""; renderButton(view); select(view); }); addLabel.append(addInput);
  note.addEventListener("input", () => notes.set(current, note.value));
  host.append(element("p", "interactive-instruction", "Turn among viewpoints; use the optional text boxes to make the exercise about your situation."), wheel, display, noteLabel, addLabel, add);
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
    root.innerHTML = '<div class="wrap"><section class="page-intro"><p class="eyebrow">Interactive toolbox</p><h1>That activity could not be found.</h1><p class="lead">Choose another activity from the interactive collection.</p></section><a class="button" href="#tools">Back to tools</a></div>';
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
    '<div class="wrap interactive-page"><a class="back-link" href="#tools">← Back to the toolbox</a><section class="page-intro"><p class="eyebrow">Interactive · choose your way · ' +
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
  else if (tool.mode === "scripts") renderSocialScriptBuilder(root);
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
  const tree = [
    { label: "Body & energy", icon: "◌", branches: [
      { label: "Rest", details: ["Sleep pressure", "A short pause", "Recovery after a long demand", "A gentler pace"], actions: ["Reduce one demand", "Choose a rest window", "Prepare for sleep", "Ask for practical cover"] },
      { label: "Food & fluids", details: ["Food soon", "Water or another drink", "A steadier meal", "An accessible snack"], actions: ["Get a drink", "Choose something easy to eat", "Set a reminder", "Ask someone to bring food"] },
      { label: "Comfort & health", details: ["Pain or illness needs attention", "Warmth or cooling", "Medication or health routine", "A more comfortable position"], actions: ["Change position", "Adjust temperature", "Follow a health plan", "Contact someone who can help"] },
      { label: "Movement", details: ["Stretch or change posture", "Walk or pace", "Pressure or grounding", "A small hand movement"], actions: ["Move for a minute", "Change chair or room", "Use a comfortable object", "Stop if movement hurts"] },
      { label: "Energy rhythm", details: ["A transition between tasks", "Less caffeine or stimulation", "A wake-up cue", "An easier next hour"], actions: ["Take one transition step", "Get light or air if welcome", "Choose one priority", "Leave a task for later"] },
    ]},
    { label: "Sensory fit", icon: "✳", branches: [
      { label: "Reduce intensity", details: ["Less sound", "Softer light", "Fewer people or movements", "Less touch or smell"], actions: ["Move somewhere quieter", "Use ear protection if helpful", "Dim a screen", "Step out briefly"] },
      { label: "Add useful input", details: ["More movement", "A familiar sound", "Something to hold", "A predictable visual"], actions: ["Try a repeated hand movement", "Choose a familiar track", "Adjust one room feature", "Use the sensory playground"] },
      { label: "Predictability", details: ["Know what happens next", "Warning before a change", "Fewer simultaneous inputs", "A clear stop point"], actions: ["Ask for the next step", "Set a short timer", "Close one open task", "Draw a quick sequence"] },
      { label: "Sensory recovery", details: ["Time without demands", "A familiar environment", "A protected transition", "Choice over input"], actions: ["Take a low-input pause", "Return to a familiar place", "Change one sensory feature", "Choose when to rejoin"] },
    ]},
    { label: "Safety & steadiness", icon: "⌂", branches: [
      { label: "Immediate safety", details: ["Distance from a risk", "A trusted person nearby", "A safer place", "A clear exit"], actions: ["Move toward safety", "Contact someone trusted", "Pause a conversation", "Use emergency support if needed"] },
      { label: "Reassurance & information", details: ["Know what is known", "Ask one direct question", "Check a practical fact", "Wait for more information"], actions: ["Separate fact from guess", "Ask for clarity", "Write one question", "Choose when to check again"] },
      { label: "Agency", details: ["A real choice", "More time", "Permission to pause", "A say in how this happens"], actions: ["Name two options", "Ask to slow down", "Set a boundary", "Choose one reversible step"] },
    ]},
    { label: "Connection & belonging", icon: "⌁", branches: [
      { label: "Company", details: ["Someone present", "A check-in message", "Shared activity", "Not being alone with it"], actions: ["Send a low-pressure text", "Ask for company", "Join a familiar space", "Name what kind of support helps"] },
      { label: "Understanding", details: ["Be heard before advice", "A clearer explanation", "Shared language", "Repair after a rupture"], actions: ["Ask someone to listen", "Describe one specific need", "Check what each person meant", "Choose a time to reconnect"] },
      { label: "Belonging", details: ["Acceptance without masking", "Shared interests", "Cultural understanding", "A group that feels safe enough"], actions: ["Reach one trusted person", "Find a familiar community", "Reduce pressure to perform", "Take connection at your pace"] },
    ]},
    { label: "Clarity & understanding", icon: "⌕", branches: [
      { label: "Make sense of it", details: ["What happened", "What is still unknown", "What changed", "Why it matters to me"], actions: ["Write the observable facts", "Ask one question", "Check another explanation", "Pause the interpretation"] },
      { label: "Structure", details: ["One next step", "A sequence", "A time boundary", "Fewer choices"], actions: ["Break it into one action", "Set a gentle reminder", "Use a checklist", "Ask for instructions in writing"] },
      { label: "Time to process", details: ["More time to answer", "A pause before deciding", "Space after conversation", "Information in another format"], actions: ["Request thinking time", "Take notes", "Return later", "Choose a format that works"] },
    ]},
    { label: "Autonomy & boundaries", icon: "↔", branches: [
      { label: "Personal space", details: ["Physical space", "A quieter interaction", "Time alone", "Control over touch"], actions: ["Move to a chosen spot", "State a preference", "Ask before contact", "Set a return time"] },
      { label: "Say no or not yet", details: ["A limit", "A slower pace", "A smaller commitment", "A chance to change my mind"], actions: ["Use a short no", "Ask for time", "Offer an alternative", "Review what is actually required"] },
      { label: "Choice in support", details: ["Choose who helps", "Choose how they help", "Do it myself with backup", "Decline help for now"], actions: ["Name one useful support", "Ask before advice", "Choose a check-in", "Keep the option open"] },
    ]},
    { label: "Meaning, fairness & values", icon: "◇", branches: [
      { label: "Fairness", details: ["A fair process", "Shared responsibility", "A boundary respected", "Repair after harm"], actions: ["Name the impact", "Ask for a fair next step", "Separate repair from blame", "Seek a neutral perspective"] },
      { label: "Meaning", details: ["A reason this matters", "A contribution", "Learning or growth", "Creative expression"], actions: ["Name a value", "Make one small contribution", "Create something", "Choose a next step that reflects it"] },
      { label: "Recognition", details: ["Effort seen", "A clear thank-you", "Credit for my part", "An apology or acknowledgement"], actions: ["Name what went unseen", "Ask for acknowledgement", "Mark your own effort", "Decide what repair would mean"] },
    ]},
    { label: "Play, interest & exploration", icon: "✺", branches: [
      { label: "Enjoyment", details: ["Pleasure without a goal", "Humour", "A familiar interest", "Sensory play"], actions: ["Do a favourite small thing", "Visit the stim yard", "Play with sound or pattern", "Choose an enjoyable pause"] },
      { label: "Curiosity", details: ["Novelty", "A puzzle", "Learning something", "Trying without pressure"], actions: ["Follow one question", "Explore a new angle", "Try a tiny experiment", "Stop when interest fades"] },
      { label: "Creativity", details: ["Make something", "Change a routine", "Express a feeling", "Improvise"], actions: ["Sketch a rough idea", "Build a small pattern", "Use an unusual route", "Make an imperfect first version"] },
    ]},
  ];
  const chosen = []; const path = [];
  const explorer = element("div", "needs-explorer");
  const trail = element("nav", "needs-breadcrumbs"); trail.setAttribute("aria-label", "Needs compass path");
  const title = element("h3", "needs-current"); const intro = element("p", "interactive-result needs-intro");
  const optionsPanel = element("div", "needs-choice-board"); const result = element("section", "needs-result-panel");
  const render = () => {
    const current = path.length ? path[path.length - 1].node : null;
    trail.replaceChildren();
    const home = button("All need families", "needs-crumb"); home.addEventListener("click", () => { path.length = 0; render(); }); trail.append(home);
    path.forEach((step, index) => { trail.append(element("span", "needs-crumb-separator", "›")); const crumb = button(step.node.label, "needs-crumb"); crumb.addEventListener("click", () => { path.length = index + 1; render(); }); trail.append(crumb); });
    title.textContent = current ? current.label : "What feels missing or needed?";
    intro.textContent = current ? current.details ? "Choose any detail that feels close, then browse small supports. More than one can fit." : "Choose a narrower branch, or return to a previous level whenever you like." : "Start broad, follow one path, then narrow to a specific need. You can explore several paths or stop at any point.";
    optionsPanel.replaceChildren(); result.replaceChildren();
    if (!current) {
      tree.forEach((branch) => { const tile = button(branch.icon + "  " + branch.label, "needs-option"); tile.addEventListener("click", () => { path.push({ node: branch }); render(); }); optionsPanel.append(tile); });
    } else if (current.details) {
      current.details.forEach((detail) => { const tile = button(detail, "needs-option needs-leaf"); tile.setAttribute("aria-pressed", "false"); tile.addEventListener("click", () => { tile.classList.toggle("selected"); tile.setAttribute("aria-pressed", String(tile.classList.contains("selected"))); }); optionsPanel.append(tile); });
      const actions = element("div", "needs-actions"); current.actions.forEach((action) => { const tile = button(action, "needs-action"); tile.setAttribute("aria-pressed", "false"); tile.addEventListener("click", () => { tile.classList.toggle("selected"); tile.setAttribute("aria-pressed", String(tile.classList.contains("selected"))); }); actions.append(tile); });
      const addLabel = element("label", "field", "Add your own need or support"); const own = document.createElement("input"); own.placeholder = "Anything else that would help?"; addLabel.append(own);
      const save = button("Add selected details to my map", "button");
      save.addEventListener("click", () => {
        const details = [...optionsPanel.querySelectorAll(".needs-leaf.selected")].map((node) => node.textContent);
        const supports = [...actions.querySelectorAll(".needs-action.selected")].map((node) => node.textContent);
        if (own.value.trim()) supports.push(own.value.trim());
        if (!details.length && !supports.length) { showStatus(root, "Choose a detail or support first."); return; }
        chosen.push({ path: path.map((step) => step.node.label), details, actions: supports }); render(); showStatus(root, "Added to your map. You can follow another branch or stop here.");
      });
      result.append(element("h3", "", "Possible supports"), actions, addLabel, save);
    } else {
      (current.branches || []).forEach((branch) => { const tile = button(branch.label, "needs-option"); tile.addEventListener("click", () => { path.push({ node: branch }); render(); }); optionsPanel.append(tile); });
    }
    result.prepend(element("h3", "", chosen.length ? "Your needs map so far" : "Nothing is saved yet"));
    if (chosen.length) {
      const map = element("div", "needs-map");
      chosen.forEach((entry) => { const card = element("article", "needs-map-card"); card.append(element("p", "eyebrow", entry.path.join("  ›  ")), element("p", "", entry.details.concat(entry.actions).join(" · "))); const remove = button("Remove", "icon-button"); remove.addEventListener("click", () => { const index = chosen.indexOf(entry); if (index >= 0) chosen.splice(index, 1); render(); }); card.append(remove); map.append(card); });
      result.append(map);
    } else result.append(element("p", "fine", "Choose a branch to see more specific needs and possible next steps."));
  };
  explorer.append(trail, title, intro, optionsPanel, result);
  host.append(element("p", "interactive-instruction", "Explore broad needs, narrower branches, specific signals and optional supports. Your map stays in this page until you leave."), explorer);
  render();
}

function renderValues(root) {
  const host = root.querySelector("#interactive-activity");
  const choices = [...options["values-compass"]];
  const first = element("div", "choice-cloud"); const second = element("div", "choice-cloud");
  const range = document.createElement("input"); range.type = "range"; range.min = "0"; range.max = "100"; range.value = "50"; range.setAttribute("aria-label", "Balance between two values");
  const output = element("output", "", "Choose two values to compare.");
  const visual = element("div", "values-balance-visual"); const beam = element("div", "values-balance-beam");
  const panA = element("span", "values-pan values-pan-left", "Value A"); const panB = element("span", "values-pan values-pan-right", "Value B"); visual.append(beam, panA, panB);
  let a = "", b = "";
  const update = () => {
    if (!a || !b) { output.textContent = "Choose two values to compare."; return; }
    const amount = Number(range.value);
    output.textContent = amount < 40 ? "More weight toward " + a : amount > 60 ? "More weight toward " + b : "Balanced between " + a + " and " + b;
    beam.style.transform = "rotate(" + ((amount - 50) * 0.34) + "deg)";
    panA.style.transform = "translateY(" + ((50 - amount) * 0.45) + "px)";
    panB.style.transform = "translateY(" + ((amount - 50) * 0.45) + "px)";
    panA.textContent = a; panB.textContent = b;
  };
  const fill = (container, active, set) => {
    container.replaceChildren();
    choices.forEach((value) => { const chip = button(value, "interactive-choice"); chip.classList.toggle("selected", active() === value); chip.addEventListener("click", () => { set(value); container.querySelectorAll("button").forEach((item) => item.classList.toggle("selected", item === chip)); update(); }); container.append(chip); });
  };
  fill(first, () => a, (value) => { a = value; }); fill(second, () => b, (value) => { b = value; });
  const customLabel = element("label", "field", "Add a value in your own words"); const custom = document.createElement("input"); custom.placeholder = "Anything that matters to you"; customLabel.append(custom);
  const add = button("Add it to both lists", "button subtle-button");
  add.addEventListener("click", () => { const value = custom.value.trim(); if (!value || choices.includes(value)) return; choices.push(value); custom.value = ""; fill(first, () => a, (next) => { a = next; }); fill(second, () => b, (next) => { b = next; }); });
  range.addEventListener("input", update);
  host.append(element("p", "interactive-instruction", "Choose two values and tilt the visual balance. Add any value missing from the examples."), element("h3", "", "Choose value A"), first, element("h3", "", "Choose value B"), second, customLabel, add, visual, range, output, element("p", "fine", "The balance reflects your view in this moment; it does not decide which value is objectively correct."));
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
  const cloud = element("div", "choice-cloud"); const thought = element("div", "defusion-thought", samples[0]);
  const ownLabel = element("label", "field", "Or type your own thought (optional)"); const own = document.createElement("textarea"); own.rows = 2; own.placeholder = "A thought to look at from a little distance"; ownLabel.append(own);
  const controls = [["Distance", "Close", "Far"], ["Size", "Small", "Large"], ["Volume", "Quiet", "Loud"]]; const adjust = element("div", "interactive-sliders"); const ranges = [];
  const update = () => {
    const distance = Number(ranges[0]?.value ?? 50); const size = Number(ranges[1]?.value ?? 50); const volume = Number(ranges[2]?.value ?? 50);
    thought.style.setProperty("--thought-scale", String(0.72 + size / 150)); thought.style.setProperty("--thought-opacity", String(0.45 + volume / 200));
    thought.style.setProperty("--thought-offset", ((distance - 50) * 1.2) + "px"); thought.style.setProperty("--thought-blur", (Math.abs(distance - 50) / 30) + "px");
  };
  samples.forEach((sample) => { const item = button(sample, "interactive-choice"); item.addEventListener("click", () => { cloud.querySelectorAll("button").forEach((node) => node.classList.toggle("selected", node === item)); thought.textContent = sample; own.value = ""; }); cloud.append(item); });
  own.addEventListener("input", () => { if (own.value.trim()) thought.textContent = own.value.trim(); });
  controls.forEach(([name, low, high], index) => { const row = element("label", "interactive-control"); const input = document.createElement("input"); input.type = "range"; input.min = "0"; input.max = "100"; input.value = "50"; input.setAttribute("aria-label", name); ranges[index] = input; input.addEventListener("input", update); row.append(element("span", "control-label", name), input, element("span", "range-ends", low + " · " + high)); adjust.append(row); });
  const drift = button("Let the thought drift", "button subtle-button"); drift.addEventListener("click", () => { const active = thought.classList.toggle("thought-moving"); drift.textContent = active ? "Pause the drift" : "Let the thought drift"; });
  host.append(element("p", "interactive-instruction", "Use a sample or your own words. Adjust the visual distance, size and volume, then optionally watch the thought drift."), cloud, ownLabel, thought, adjust, drift);
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

function renderSocialScriptBuilder(root) {
  const host = root.querySelector("#interactive-activity");
  const scenarioSelect = document.createElement("select");
  scenarioSelect.className = "social-script-scenario-select";
  scenarioSelect.setAttribute("aria-label", "Choose a social situation");
  socialScriptScenarios.forEach((scenario) => {
    const option = document.createElement("option");
    option.value = scenario.id;
    option.textContent = scenario.label;
    scenarioSelect.append(option);
  });

  const contextLabel = element("label", "field", "What is happening, and what would you like to say? (optional)");
  const context = document.createElement("textarea");
  context.rows = 4;
  context.placeholder = "Add the details you want the script to fit: who it is for, what happened, what you need, or words you want to avoid…";
  contextLabel.append(context);
  const useContext = button("Start draft from my context", "button subtle-button");

  const composerLabel = element("label", "field social-script-composer-label", "Your editable draft");
  const composer = document.createElement("textarea");
  composer.className = "social-script-composer";
  composer.rows = 7;
  composer.placeholder = "Choose a script below, then edit it until it sounds like you…";
  composer.setAttribute("aria-label", "Editable social script draft");
  composerLabel.append(composer);

  const scripts = element("div", "social-script-list");
  const status = element("p", "interactive-result social-script-status", "Choose a situation, then select any wording that feels useful. You stay in control of the final message.");
  const copy = button("Copy draft", "button");
  const clear = button("Clear draft", "button subtle-button");
  const actions = element("div", "row social-script-actions");
  actions.append(copy, clear);

  const renderScripts = () => {
    const scenario = socialScriptScenarios.find((item) => item.id === scenarioSelect.value) || socialScriptScenarios[0];
    scripts.replaceChildren();
    const heading = element("h3", "", "Ways you could phrase it");
    const intro = element("p", "fine", "These are starting points, not rules. Edit any wording, combine parts, or write your own.");
    scripts.append(heading, intro);
    scenario.scripts.forEach(([tone, text]) => {
      const card = element("article", "social-script-card");
      const top = element("div", "social-script-card-top");
      top.append(element("span", "social-script-tone", tone));
      const use = button("Use this", "button subtle-button");
      use.addEventListener("click", () => {
        composer.value = composer.value.trim() ? composer.value.trimEnd() + "\n\n" + text : text;
        composer.focus();
        status.textContent = "Added to your draft. Edit the words, placeholders and tone so they fit you.";
        composer.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      top.append(use);
      card.append(top, element("p", "social-script-text", text));
      scripts.append(card);
    });
  };

  scenarioSelect.addEventListener("change", renderScripts);
  clear.addEventListener("click", () => {
    composer.value = "";
    composer.focus();
    status.textContent = "Draft cleared. Choose a script or write in your own words.";
  });
  useContext.addEventListener("click", () => {
    const text = context.value.trim();
    if (!text) {
      status.textContent = "Add a little context first, or choose one of the ready-made scripts.";
      context.focus();
      return;
    }
    composer.value = text;
    composer.focus();
    status.textContent = "Your context is now an editable draft. Add, remove or reshape any words you want.";
  });
  copy.addEventListener("click", async () => {
    const text = composer.value.trim();
    if (!text) {
      status.textContent = "Add or write a draft first.";
      composer.focus();
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "Copied to your clipboard. You can paste it wherever you need it.";
    } catch {
      composer.focus();
      composer.select();
      try { document.execCommand("copy"); } catch { /* Clipboard access may be unavailable. */ }
      status.textContent = "Your draft is selected so you can copy it with Ctrl/Cmd+C.";
    }
  });
  const intro = element("p", "interactive-instruction", "This builder is for adults and young people who want clearer choices in social situations. It does not assume a diagnosis, a personality type or one correct way to communicate.");
  const scenarioWrap = element("label", "field", "Situation");
  scenarioWrap.append(scenarioSelect);
  host.append(intro, scenarioWrap, contextLabel, useContext, composerLabel, actions, status, scripts);
  renderScripts();
}

export function renderTeam(root) {
  root.innerHTML =
    '<div class="wrap team-page"><section class="team-hero"><div class="team-photo-frame"><img src="drew-profile.png" alt="Drew Horrobin wearing a graduation gown and mortarboard" class="team-photo"><span class="team-photo-caption">Drew Horrobin · Founder</span></div><div class="team-intro"><p class="eyebrow">Meet the team</p><h1>A small team,<br><em>one whole human at a time.</em></h1><p class="lead">I’m Drew: a University of Liverpool psychology graduate, researcher and support worker, and the person behind Nobody’s Simple.</p><p>I built this project because people deserve more than a label or a flattened story. Psychology can help us understand patterns, but a person is also shaped by their body, history, relationships, culture and the systems around them. Nobody’s Simple is my way of putting more of that context within reach.</p><a class="button" href="#library">Explore the learning library <span aria-hidden="true">↗</span></a></div></section><section class="team-section"><div><p class="eyebrow">The work behind it</p><h2>Research, support and shared discovery.</h2></div><div class="team-bio-grid"><article class="team-card"><span class="team-card-mark">01</span><h3>Research</h3><p>My research experience at the University of Liverpool has included autistic people’s lived experience and creative expression, postpartum guilt and shame, climate emotions and environmental action, and the way virtual nature can shape how people feel.</p></article><article class="team-card"><span class="team-card-mark">02</span><h3>People and practice</h3><p>I’ve also spent time in an NHS clinical psychology placement, mental health coaching and volunteer phone support. Those experiences keep the work grounded in what help can feel like in real life: timely, respectful and shaped around the person.</p></article></div></section><section class="team-promise"><div class="team-promise-heading"><p class="eyebrow">What you can expect from us</p><h2>Our promises.</h2><p>“Bring twigs, not tablets.” We are here to explore with you, not lecture at you.</p></div><div class="promise-list"><article><span>01</span><div><h3>Keep the person in context.</h3><p>We will make room for body, biography, relationships, culture and the conditions people live in.</p></div></article><article><span>02</span><div><h3>Explain without excusing.</h3><p>We will hold accountability without reducing someone to one behaviour, label or moment.</p></div></article><article><span>03</span><div><h3>Offer paths, not verdicts.</h3><p>Our ideas and tools are invitations to explore. You choose what fits, what to leave and what to do next.</p></div></article><article><span>04</span><div><h3>Stay curious and correctable.</h3><p>We will treat knowledge as something people build together, and make space for evidence, lived experience and disagreement.</p></div></article></div></section><section class="team-direction"><div><p class="eyebrow">Where we’re heading</p><h2>Read the whole human. Find a way forward.</h2><p>We’re growing a free, welcoming collection of research-informed learning, original videos, practical tools and small interactive experiences—including ways to explore without writing. The aim is not to have the final word. It is to help people see more of the map, find their bearings and choose what comes next.</p></div><div class="team-next-links"><a class="button bright" href="#library">Explore the learning library →</a><a class="button outline-light" href="#simplyfocus">Visit SimplyFocus →</a><a href="https://www.youtube.com/@nobodyssimple" target="_blank" rel="noopener noreferrer">Watch our shared discoveries on YouTube ↗</a></div></section></div>';
}
