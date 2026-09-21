import { escapeHTML as esc } from "./core.mjs";

const INSTRUMENT_VERSION = "NS Quick Map v0.1";
const SCORING_VERSION = "Exploratory response pattern v0.1";
const REPORT_VERSION = "Profile report v0.1";
const SAVE_KEY = "nobodys-simple-quick-map-progress-v1";
const SCALE_PROMPT = "Across most situations over roughly the past year, how much is this like you?";
const responseOptions = [
  ["0", "Not at all like me"], ["1", "Very unlike me"], ["2", "Somewhat unlike me"],
  ["3", "Mixed / depends strongly on the situation"], ["4", "Somewhat like me"],
  ["5", "Very like me"], ["6", "Extremely like me"],
];

// A short sample from the supplied original candidate item bank. These are
// exploratory draft items; reverse-keyed items are preserved as specified.
const dimensions = [
  { id:"reward", title:"Reward interest", kind:"Sensitivity", definition:"How readily the possibility of a reward catches your attention.", higherLabel:"Possible rewards catch your attention more readily", lowerLabel:"Possible rewards catch your attention less readily", headlineMore:"Possibility Scout", headlineLess:"Grounded Observer", moreUse:"Noticing possible benefits can help you spot openings worth exploring.", moreFriction:"Immediate rewards can compete with goals whose payoff is less visible right now.", lessUse:"You may be less pulled around by the promise of an immediate payoff.", lessFriction:"A distant or abstract reward may need to be made more concrete before it feels motivating." },
  { id:"stimulation", title:"Stimulation seeking", kind:"Preference", definition:"How much intensity, novelty and variety tend to appeal to you.", higherLabel:"Novel or intense experiences appeal more", lowerLabel:"Familiarity and predictability appeal more", headlineMore:"Novelty Navigator", headlineLess:"Rhythm Keeper", moreUse:"Variety can give curiosity and engagement somewhere to go.", moreFriction:"Highly repetitive settings may feel less engaging over time.", lessUse:"Familiar rhythms may offer comfort, continuity and fewer unnecessary surprises.", lessFriction:"A new experience may need a clear reason or a gentle first step to feel worthwhile." },
  { id:"uncertainty", title:"Conflict / uncertainty sensitivity", kind:"Sensitivity", definition:"How much unresolved situations, competing choices or uncertain outcomes stay on your mind.", higherLabel:"Uncertainty and unresolved choices hold attention more", lowerLabel:"Uncertainty is easier to leave unresolved", headlineMore:"Uncertainty Cartographer", headlineLess:"Open-Horizon Wayfinder", moreUse:"Keeping possible outcomes in view can support preparation and careful decisions.", moreFriction:"An open question can keep using attention even when no new information is available.", lessUse:"You may be more comfortable moving forward without resolving every unknown.", lessFriction:"For important choices, a deliberate pause to check the evidence may still be useful." },
  { id:"control", title:"Effortful control", kind:"Self-regulatory capacity", definition:"Your self-reported ability to redirect attention, pause before acting and begin something important.", higherLabel:"Redirecting, pausing and starting feel more available", lowerLabel:"Redirecting, pausing and starting feel less available", headlineMore:"Self-Steering Cartographer", headlineLess:"Context-Led Navigator", moreUse:"Being able to pause or redirect can help when a plan reflects what you actually want.", moreFriction:"Control can take effort; fatigue, interest and the surrounding setup still matter.", lessUse:"Noticing when the environment is doing the steering can point toward useful supports.", lessFriction:"A cue, smaller first step or change of surroundings may help when willpower alone is unreliable." },
  { id:"persistence", title:"Persistence", kind:"Tendency", definition:"How readily you continue once work becomes slow, repetitive or less interesting.", higherLabel:"Staying with slow or repetitive work comes more readily", lowerLabel:"Interest and variety may matter more for staying with work", headlineMore:"Steady Builder", headlineLess:"Interest-Led Explorer", moreUse:"Continuing after the exciting part can help with long projects and gradual progress.", moreFriction:"Persistence can sometimes keep a person invested after a plan has stopped being useful.", lessUse:"A strong response to interest can help you notice which tasks feel alive and meaningful.", lessFriction:"Repetitive work may need milestones, variation or a visible reason to continue." },
  { id:"activation", title:"Baseline activation", kind:"Temperamental tendency", definition:"The pace and activity level that often feel natural to you.", higherLabel:"A more energetic, active pace feels natural", lowerLabel:"A slower, less active pace feels natural", headlineMore:"Quick-Moving Spark", headlineLess:"Slow-Blooming Presence", moreUse:"A ready-to-move pace can help when a situation benefits from momentum.", moreFriction:"Long inactive stretches may feel restless; pauses can still be useful even when they do not come naturally.", lessUse:"A slower pace can leave room for steadiness and recovery.", lessFriction:"Fast-moving environments may ask for more deliberate transitions or energy planning." },
  { id:"sensory", title:"Sensory overload susceptibility", kind:"Sensitivity", definition:"How much competing or intense sensory input tends to drain you or interrupt thinking.", higherLabel:"Busy sensory environments feel more draining", lowerLabel:"Busy sensory environments feel less draining", headlineMore:"Sensory Signal Reader", headlineLess:"Wide-Range Explorer", moreUse:"Noticing which environments use energy can help you shape a more workable space.", moreFriction:"Several simultaneous inputs may reduce room for thinking, even when each sound or demand seems small.", lessUse:"A wider range of sensory settings may be manageable for you, based on these answers.", lessFriction:"A setting that works for you may still affect someone else differently; this is an individual response." },
  { id:"sociability", title:"Sociability", kind:"Disposition", definition:"How rewarding and desirable time with people you enjoy tends to feel.", higherLabel:"Social contact feels more rewarding", lowerLabel:"Time alone may be more rewarding", headlineMore:"Connection Weaver", headlineLess:"Reflective Observer", moreUse:"Enjoying contact can make shared activities and conversation a source of energy.", moreFriction:"A wish for connection does not automatically mean every group or setting will feel comfortable.", lessUse:"Time alone may support restoration, attention or choosing company more selectively.", lessFriction:"Lower social appetite does not mean you dislike people or cannot value close relationships." },
  { id:"boldness", title:"Social boldness", kind:"Disposition", definition:"How manageable it feels to approach unfamiliar people or speak in front of a group.", higherLabel:"Approaching unfamiliar people feels more manageable", lowerLabel:"Approaching unfamiliar people feels less manageable", headlineMore:"First-Step Scout", headlineLess:"Thoughtful Entrant", moreUse:"Comfort taking the first step can make new conversations or group participation easier to begin.", moreFriction:"Ease initiating does not mean you always want more social contact.", lessUse:"Observing before joining can give you time to read a situation and choose your moment.", lessFriction:"Wanting connection and feeling at ease initiating it are different things." },
  { id:"curiosity", title:"Intellectual curiosity", kind:"Disposition", definition:"How strongly unanswered questions and learning for its own sake tend to draw you in.", higherLabel:"Unanswered questions and learning draw you in more", lowerLabel:"Learning tends to be more purpose-led", headlineMore:"Question Chaser", headlineLess:"Purposeful Learner", moreUse:"Following questions can help you build understanding beyond what is immediately required.", moreFriction:"Many interesting paths can compete for attention or delay deciding what is enough for now.", lessUse:"A clear practical purpose can make learning focused and efficient.", lessFriction:"Exploring a topic without an immediate payoff can still be worthwhile when you choose it." },
];

const itemBank = [
  ["RI1","reward",false,"Possibilities that could turn out rewarding quickly catch my attention."],
  ["RI2","reward",false,"I naturally notice opportunities for enjoyment or gain."],
  ["RI3","reward",false,"The possibility of a worthwhile reward makes me want to investigate further."],
  ["RI4-R","reward",true,"Even promising opportunities often fail to pull my attention toward them."],
  ["SS1","stimulation",false,"I enjoy experiences that feel intense or exciting."],
  ["SS2","stimulation",false,"Too much predictability eventually makes me restless."],
  ["SS3","stimulation",false,"Given the choice, I often pick the more novel experience."],
  ["SS4-R","stimulation",true,"I usually prefer familiar experiences even when something new is readily available."],
  ["CA1","uncertainty",false,"When two important choices pull me in different directions, I can become stuck thinking about them."],
  ["CA2","uncertainty",false,"Uncertainty about what will happen tends to keep my attention activated."],
  ["CA3","uncertainty",false,"I find unresolved situations difficult to mentally put aside."],
  ["CA4-R","uncertainty",true,"I can usually leave an uncertain situation unresolved without it occupying much mental space."],
  ["EC1","control",false,"I can redirect my attention when I notice it drifting somewhere unhelpful."],
  ["EC2","control",false,"I can usually stop myself before acting on an impulse I have decided not to follow."],
  ["EC3","control",false,"I can make myself begin an important task even when I do not feel like starting."],
  ["EC4-R","control",true,"Once my attention is pulled strongly in one direction, I find it difficult to deliberately redirect it."],
  ["PER1","persistence",false,"I can continue working after the interesting part of a task is over."],
  ["PER2","persistence",false,"Boredom alone rarely makes me abandon something important."],
  ["PER3","persistence",false,"I tend to keep going when progress becomes slow."],
  ["PER4-R","persistence",true,"Once a task becomes repetitive, my effort usually drops sharply."],
  ["BA1","activation",false,"I naturally move through the day at a fairly energetic pace."],
  ["BA2","activation",false,"Sitting inactive for long periods tends to make me restless."],
  ["BA3","activation",false,"I usually have a noticeable urge to be doing something."],
  ["BA4-R","activation",true,"A slow and inactive pace feels natural to me for long periods."],
  ["SOL1","sensory",false,"Busy sensory environments can become mentally exhausting for me."],
  ["SOL2","sensory",false,"Several competing sounds make it harder for me to think clearly."],
  ["SOL3","sensory",false,"After intense sensory environments, I often need lower stimulation."],
  ["SOL4-R","sensory",true,"High levels of environmental stimulation rarely drain me."],
  ["SOC1","sociability",false,"I actively look for opportunities to spend time with people I enjoy."],
  ["SOC2","sociability",false,"Conversation with others is usually rewarding to me."],
  ["SOC3-R","sociability",true,"Even when I like the people involved, I usually prefer spending my free time alone."],
  ["SB1","boldness",false,"I can approach unfamiliar people when I have a reason to."],
  ["SB2","boldness",false,"Speaking in front of a group usually feels manageable."],
  ["SB3-R","boldness",true,"Being the focus of an unfamiliar group makes me strongly uncomfortable."],
  ["IC1","curiosity",false,"Questions I cannot yet explain tend to pull me toward further investigation."],
  ["IC2","curiosity",false,"I enjoy learning about subjects even when the information has no immediate practical use."],
  ["IC3-R","curiosity",true,"Once I know enough to function, I usually have little desire to understand a subject more deeply."],
].map(([id, dimension, reverse, text]) => ({ id, dimension, reverse, text }));

const itemById = new Map(itemBank.map((item) => [item.id, item]));
let phase = "intro";
let order = [];
let currentIndex = 0;
let answers = Object.create(null);
let fitResponses = Object.create(null);

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function reset() {
  phase = "intro";
  order = [];
  currentIndex = 0;
  answers = Object.create(null);
  fitResponses = Object.create(null);
}

function readSavedProgress() {
  try {
    const draft = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (
      !draft ||
      draft.version !== INSTRUMENT_VERSION ||
      !Array.isArray(draft.order) ||
      !draft.order.length ||
      !draft.order.every((id) => itemById.has(id)) ||
      !draft.answers ||
      !Number.isInteger(draft.currentIndex) ||
      draft.currentIndex < 0 ||
      draft.currentIndex >= draft.order.length
    ) return null;
    return draft;
  } catch {
    return null;
  }
}

function clearSavedProgress() {
  try { localStorage.removeItem(SAVE_KEY); } catch { /* Local storage may be unavailable. */ }
}

function saveProgress(root) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      version: INSTRUMENT_VERSION,
      order,
      currentIndex,
      answers,
    }));
    root.querySelector("#pm-save-status").textContent = "Saved on this device. It will be cleared automatically when you finish.";
  } catch {
    root.querySelector("#pm-save-status").textContent = "This browser could not save progress locally. Your current answers are still here in this tab.";
  }
}

function renderIntro(root) {
  const saved = readSavedProgress();
  const resumeMarkup = saved
    ? '<div class="pm-saved-progress"><p><b>A saved Quick Map is on this device.</b> Anyone with access to this browser profile may be able to open it.</p><div class="row"><button class="button" type="button" id="pm-resume">Resume saved map</button><button class="button secondary" type="button" id="pm-clear-saved">Clear saved map</button></div></div>'
    : "";
  root.innerHTML = `<div class="wrap pm-wrap">
    <section class="pm-intro">
      <div class="pm-intro-copy">
        <p class="eyebrow">A new way to map personality · Beta</p>
        <h1>A personality profile<br><em>without a personality box.</em></h1>
        <p class="lead">A short, thoughtful first map of the patterns that may shape how you explore, focus, relate and respond to uncertainty.</p>
        <div class="pm-facts"><span>About 10–15 minutes</span><span>No timer</span><span>Nothing is saved by default</span></div>
        <button class="button" id="pm-start" type="button">Build my quick map <span aria-hidden="true">↗</span></button>
      </div>
      <div class="pm-intro-art"><img src="personality-map.png" alt="A friendly map character with a dotted path and location pin"><p>More than one pattern can be true at once.</p></div>
    </section>
    <section class="pm-intro-notes">
      <article class="pm-note"><span class="pm-note-number">01</span><h2>Dimensions before types</h2><p>Your answers stay visible as separate response patterns. The profile title is a playful shorthand, not a category the assessment has discovered.</p></article>
      <article class="pm-note"><span class="pm-note-number">02</span><h2>A beta, not a verdict</h2><p>This is an early questionnaire using candidate items. It has not been psychometrically validated or compared with representative norms. It does not diagnose.</p></article>
      <article class="pm-note"><span class="pm-note-number">03</span><h2>Your answers stay here</h2><p>Answers are not sent to Nobody’s Simple. They stay in this tab. Saving a draft is optional; downloading creates a profile file for you.</p></article>
    </section>
    ${resumeMarkup}
    <section class="pm-scope"><div><p class="eyebrow">The quick map</p><h2>What this first version explores</h2><p>Ten candidate themes from temperament and dispositional personality. Each answer uses the same seven-point scale, including “mixed / depends strongly on the situation.” You can skip any item that does not fit.</p></div><a href="#home" class="pm-back-link">Back to the main website →</a></section>
  </div>`;
  root.querySelector("#pm-start").addEventListener("click", () => {
    clearSavedProgress();
    order = shuffle(itemBank.map((item) => item.id));
    answers = Object.create(null);
    fitResponses = Object.create(null);
    currentIndex = 0;
    phase = "questions";
    render(root);
  });
  if (saved) {
    root.querySelector("#pm-resume").addEventListener("click", () => {
      order = saved.order;
      currentIndex = saved.currentIndex;
      answers = Object.assign(Object.create(null), saved.answers);
      phase = "questions";
      render(root);
    });
    root.querySelector("#pm-clear-saved").addEventListener("click", () => {
      clearSavedProgress();
      render(root);
    });
  }
}

function renderQuestion(root) {
  const item = itemById.get(order[currentIndex]);
  const answer = answers[item.id];
  const answered = Object.values(answers).filter((value) => value !== null && value !== undefined).length;
  const progress = Math.round((currentIndex / itemBank.length) * 100);
  const optionsHtml = responseOptions.map(([value, label]) =>
    '<label class="pm-option"><input type="radio" name="pm-answer" value="' + esc(value) + '"' +
    (String(answer) === value ? " checked" : "") +
    '><span class="pm-option-number">' + esc(value) + '</span><span class="pm-option-text">' + esc(label) + '</span></label>'
  ).join("");
  root.innerHTML = `<div class="wrap pm-wrap pm-question-wrap">
    <div class="pm-question-top"><a href="#home" class="pm-back-link">← Main website</a><span class="pm-beta-pill">BETA · ${INSTRUMENT_VERSION}</span></div>
    <section class="pm-question-card">
      <div class="pm-progress-row"><span>Question ${currentIndex + 1} of ${itemBank.length}</span><span>${answered} answered · no timer</span></div>
      <div class="pm-progress" role="meter" aria-label="Questionnaire progress" aria-valuemin="0" aria-valuemax="${itemBank.length}" aria-valuenow="${currentIndex}"><span style="width:${progress}%"></span></div>
      <p class="eyebrow">Across most situations over roughly the past year</p>
      <h1>${esc(item.text)}</h1>
      <p class="pm-question-prompt">${SCALE_PROMPT}</p>
      <fieldset class="pm-scale-options"><legend class="pm-visually-hidden">${esc(SCALE_PROMPT)}</legend>${optionsHtml}</fieldset>
      <div class="pm-question-controls">
        <button class="button secondary" type="button" id="pm-previous" ${currentIndex === 0 ? "disabled" : ""}>← Previous</button>
        <button class="pm-skip" type="button" id="pm-skip">This question doesn’t fit / I’m not sure</button>
        <button class="button" type="button" id="pm-next" ${answer === null || answer === undefined ? "disabled" : ""}>${currentIndex === itemBank.length - 1 ? "Build my profile" : "Next question"} →</button>
      </div>
      <div class="pm-save-row"><button class="pm-save" type="button" id="pm-save">Save progress on this device</button><p id="pm-save-status" class="pm-inline-note" aria-live="polite">Nothing is saved unless you choose. A saved draft stays in this browser and can be opened by someone using this device.</p></div>
      <p class="pm-inline-note" id="pm-choice-status" aria-live="polite">${answer === null ? "Skipped for now." : answer === undefined ? "Choose an answer or mark this item as not fitting." : "Answer recorded for this tab only."}</p>
    </section>
    <p class="pm-footer-note">There is no ideal response. “Mixed / depends” is a useful answer; your context matters.</p>
  </div>`;
  root.querySelectorAll('input[name="pm-answer"]').forEach((input) => {
    input.addEventListener("change", () => {
      answers[item.id] = Number(input.value);
      root.querySelector("#pm-next").disabled = false;
      root.querySelector("#pm-choice-status").textContent = "Answer recorded for this tab only.";
    });
  });
  root.querySelector("#pm-previous").addEventListener("click", () => {
    if (currentIndex > 0) currentIndex -= 1;
    render(root);
  });
  root.querySelector("#pm-save").addEventListener("click", () => saveProgress(root));
  root.querySelector("#pm-skip").addEventListener("click", () => {
    answers[item.id] = null;
    advance(root);
  });
  root.querySelector("#pm-next").addEventListener("click", () => {
    if (answers[item.id] === null || answers[item.id] === undefined) return;
    advance(root);
  });
}

function advance(root) {
  if (currentIndex < itemBank.length - 1) {
    currentIndex += 1;
    render(root);
  } else {
    clearSavedProgress();
    phase = "result";
    render(root);
  }
}

function calculateSignals() {
  return dimensions.map((dimension) => {
    const related = itemBank.filter((item) => item.dimension === dimension.id);
    const values = related.map((item) => {
      const response = answers[item.id];
      if (response === null || response === undefined) return null;
      return item.reverse ? 6 - response : response;
    }).filter((value) => value !== null);
    const minimumAnswered = Math.min(3, related.length);
    const mean = values.length >= minimumAnswered ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
    const spread = values.length > 1 ? Math.max(...values) - Math.min(...values) : 0;
    const variation = values.length > 1 && spread >= 4;
    const pattern = mean === null ? "unknown" : variation ? "mixed" : mean >= 3.5 ? "more" : mean <= 2.5 ? "less" : "mixed";
    return { dimension, mean, count:values.length, total:related.length, pattern, variation };
  });
}

const archetypePairs = [
  { ids:["reward","uncertainty"], patterns:["more","more"], title:"The Curious Sentinel", tagline:"Possible rewards pull you forward; uncertainty makes you check the terrain." },
  { ids:["curiosity","uncertainty"], patterns:["more","more"], title:"The Curious Sentinel", tagline:"New questions pull you forward; uncertainty makes you study the terrain." },
  { ids:["stimulation","uncertainty"], patterns:["more","more"], title:"The Curious Sentinel", tagline:"New possibilities pull you forward; uncertainty makes you check the terrain." },
  { ids:["sociability","boldness"], patterns:["more","less"], title:"The Quiet Connector", tagline:"Connection matters; opening the conversation may take more care." },
  { ids:["sociability","boldness"], patterns:["less","more"], title:"The Selective Pathfinder", tagline:"You may find it possible to step forward without wanting constant company." },
  { ids:["activation","sensory"], patterns:["more","more"], title:"The Moving Signal-Reader", tagline:"An active pace may feel natural while competing sensory input still takes energy." },
  { ids:["stimulation","persistence"], patterns:["more","less"], title:"The Spark Collector", tagline:"New sparks may come easily; repeated steps can ask for a fresh reason." },
  { ids:["control","persistence"], patterns:["less","more"], title:"The Context-Led Builder", tagline:"Starting or redirecting may take support, even when you can keep going once engaged." },
  { ids:["control","persistence"], patterns:["more","less"], title:"The Self-Steering Explorer", tagline:"Redirecting may feel available even when repetition loses its pull." },
  { ids:["stimulation","uncertainty"], patterns:["more","less"], title:"The Open-Road Explorer", tagline:"Novelty may appeal while unresolved outcomes take up less attention." },
];

function titleFor(signals) {
  const byId = Object.fromEntries(signals.map((signal) => [signal.dimension.id, signal]));
  const matches = archetypePairs.map((pair) => {
    const [first, second] = pair.ids.map((id) => byId[id]);
    if (!first || !second || first.pattern !== pair.patterns[0] || second.pattern !== pair.patterns[1]) return null;
    return { pair, first, second, strength:Math.abs(first.mean - 3) + Math.abs(second.mean - 3) };
  }).filter(Boolean).sort((a, b) => b.strength - a.strength);
  if (matches.length) {
    const { pair, first, second } = matches[0];
    return {
      title:pair.title,
      tagline:pair.tagline,
      basis:"A playful, provisional shorthand for the combination of " + first.dimension.title.toLowerCase() + " and " + second.dimension.title.toLowerCase() + ". These separate response patterns remain the actual result.",
      primary:first,
      paired:second,
    };
  }
  const available = signals.filter((signal) => signal.mean !== null).sort((a, b) => Math.abs(b.mean - 3) - Math.abs(a.mean - 3));
  if (!available.length) return { title:"The Unfinished Map", tagline:"This map is waiting for more of your answers.", basis:"There were not enough answered items to form even a preliminary response pattern.", primary:null, paired:null };
  const primary = available[0];
  if (primary.pattern === "mixed") {
    return { title:"The Context Weaver", tagline:"Your answers leave room for context instead of forcing one direction.", basis:"Your answers were mixed across the candidate themes, so this beta has not forced them into a single style.", primary, paired:available[1] || null };
  }
  return {
    title:"The " + (primary.pattern === "more" ? primary.dimension.headlineMore : primary.dimension.headlineLess),
    tagline:(primary.pattern === "more" ? primary.dimension.higherLabel : primary.dimension.lowerLabel) + (available[1] ? "; alongside a separate pattern in " + available[1].dimension.title.toLowerCase() + "." : "."),
    basis:"A playful heading drawn from one distinctive response theme because this short beta did not find a supported two-theme combination. It is not a fixed type.",
    primary,
    paired:available[1] || null,
  };
}

function formatPattern(signal) {
  if (!signal || signal.pattern === "unknown") return "Not enough answers for a preliminary reading";
  if (signal.pattern === "more") return "Leans toward the higher end of this theme";
  if (signal.pattern === "less") return "Leans toward the lower end of this theme";
  return "Mixed or context-dependent";
}

function signalSentence(signal) {
  if (signal.pattern === "more") return "Your answers leaned toward: " + signal.dimension.higherLabel.toLowerCase() + ".";
  if (signal.pattern === "less") return "Your answers leaned toward: " + signal.dimension.lowerLabel.toLowerCase() + ".";
  if (signal.pattern === "mixed") return "Your answers were mixed around this theme; context may matter, or these candidate items may need refinement.";
  return "There were too few answers here to describe a pattern.";
}

function buildHypotheses(signals) {
  const byId = Object.fromEntries(signals.map((signal) => [signal.dimension.id, signal]));
  const high = (id) => byId[id]?.pattern === "more";
  const low = (id) => byId[id]?.pattern === "less";
  const hypotheses = [];
  if ((high("stimulation") || high("reward") || high("curiosity")) && high("uncertainty")) {
    hypotheses.push({ title:"Possibility and uncertainty may arrive together", evidence:"Your answers leaned toward both interest in possibilities and attention to unresolved outcomes.", idea:"A new opportunity might feel appealing while the unknown parts also take up mental space.", question:"Do you often feel more uncertain before starting something new than after you have begun?" });
  }
  if (high("sociability") && low("boldness")) {
    hypotheses.push({ title:"Wanting contact may differ from finding it easy to initiate", evidence:"Social contact was more often endorsed than approaching unfamiliar people or speaking to a group.", idea:"You may enjoy connection while preferring a familiar person, clear opening or lower-pressure setting.", question:"Does social interest feel stronger once you are with people than before you enter the situation?" });
  }
  if (high("boldness") && low("sociability")) {
    hypotheses.push({ title:"Social ease may differ from social appetite", evidence:"Approaching people felt more manageable in your answers, while social contact itself was less often endorsed.", idea:"You may be able to enter a social situation without wanting a lot of social time.", question:"Can you take part comfortably and still prefer a quieter amount of contact?" });
  }
  if ((high("control") && low("persistence")) || (low("control") && high("persistence"))) {
    hypotheses.push({ title:"Starting, redirecting and sustaining may not move together", evidence:"Your answers on self-regulation and persistence leaned in different directions.", idea:"Beginning or redirecting attention may be a different experience from staying with slow, repetitive work.", question:"Which part is harder for you: getting going, returning after a distraction, or staying with repetition?" });
  }
  if (high("activation") && high("sensory")) {
    hypotheses.push({ title:"A naturally active pace may coexist with sensory limits", evidence:"Your answers leaned toward an active pace and toward busy sensory settings feeling draining.", idea:"Wanting movement or activity does not necessarily mean wanting more noise or competing input.", question:"Does movement help while busy sound or visual input still drains you?" });
  }
  return hypotheses.slice(0, 4);
}

function summaryText(signals) {
  const distinctive = signals.filter((signal) => signal.mean !== null).sort((a, b) => Math.abs(b.mean - 3) - Math.abs(a.mean - 3)).slice(0, 2);
  if (!distinctive.length) return "There were not enough answered items to make a preliminary map. You can start again and skip only the questions that do not fit.";
  const first = distinctive[0];
  const second = distinctive[1];
  const paragraphs = ["On these draft questions, your clearest response pattern was " + first.dimension.title.toLowerCase() + ": " + formatPattern(first).toLowerCase() + "."];
  if (second) paragraphs.push("Another distinctive signal was " + second.dimension.title.toLowerCase() + ": " + formatPattern(second).toLowerCase() + ". These are separate tendencies in your answers, not one all-purpose type.");
  if (second && first.pattern !== "mixed" && second.pattern !== "mixed") {
    paragraphs.push("Their combination may be worth checking against real situations. That is a personal hypothesis, not a validated interaction or an explanation of why you respond this way.");
  } else {
    paragraphs.push("A mixed or context-dependent response is useful information too. Your answers may shift with context, energy and the people or tasks around you.");
  }
  return paragraphs.join("\n\n");
}

function technicalSummary(signals) {
  const top = signals.filter((signal) => signal.mean !== null)
    .sort((a, b) => Math.abs(b.mean - 3) - Math.abs(a.mean - 3))
    .slice(0, 3);
  if (!top.length) return "There were not enough answers for a technical response summary.";
  return "Self-report pattern: " + top.map((signal) => signal.dimension.title + " — " + formatPattern(signal)).join(" · ");
}

function environmentHints(signals) {
  const hints = {
    reward:{ more:["Visible feedback or a near-term sign of progress may help keep a goal engaging.","Immediate rewards can compete with slower goals; making later progress visible may be useful."], less:["A clear purpose may matter more than adding extra rewards.","A distant or abstract payoff may need to be made concrete before it feels motivating."] },
    stimulation:{ more:["Meaningful variety, with a clear first step, may give curiosity somewhere to go.","Long stretches of sameness may take more effort to stay engaged with."], less:["A familiar rhythm and advance notice of change may feel easier to work with.","Rapid novelty for its own sake may use more effort than it gives back."] },
    uncertainty:{ more:["Clear expectations, a visible next step and access to relevant information may reduce avoidable open loops.","Ambiguous deadlines or unresolved choices may occupy attention even when little new information is available."], less:["Room to move forward without resolving every unknown may suit this response pattern.","For important choices, it can still help to pause and check what evidence is missing."] },
    control:{ more:["Some choice over how to start and redirect attention may work well.","Even when self-direction feels available, rest and outside structure can still be useful."], less:["External cues, a visible first step or fewer competing distractions may make starting easier.","An open-ended task with no structure may ask more than the task itself." ] },
    persistence:{ more:["Longer projects with deliberate stopping points may make sustained effort easier to use.","Staying with a plan after it stops being useful can be a cost to watch for."], less:["Short milestones, visible progress or a change of pace may support follow-through.","Long, repetitive stretches may take more effort even when the goal matters." ] },
    activation:{ more:["Movement options and active transitions may fit the pace that feels natural in these answers.","Long inactive stretches may be worth breaking up when possible."], less:["A manageable pace and time to transition may be worth protecting.","Rapid transitions may take more energy than a slower sequence." ] },
    sensory:{ more:["Adjustable sound and fewer competing inputs may leave more room to think.","Several simultaneous sounds or demands may use energy even when each seems small."], less:["A broader range of sensory settings may be manageable based on these answers.","Your own tolerance does not predict how the same setting will feel for someone else." ] },
    sociability:{ more:["Opportunities for chosen, meaningful contact may be energising.","Social interest does not mean every group or amount of contact will fit."], less:["Choice over when to connect and when to spend time alone may matter.","Constant interaction may be less appealing than selective contact." ] },
    boldness:{ more:["A chance to initiate or speak when it is useful may feel accessible.","Being able to step forward does not mean you want to lead every time."], less:["A low-pressure introduction or a known entry point may make unfamiliar groups easier to approach.","Being put on the spot may take more effort than joining with a clear reason." ] },
    curiosity:{ more:["Time to follow a question beyond the immediate task may be rewarding.","Several interesting paths can compete; deciding what is enough for now may help."], less:["A clear practical purpose may make learning more engaging.","Exploring a topic without an immediate payoff can still be worthwhile when you choose it." ] },
  };
  const ranked = signals.filter((signal) => signal.mean !== null && signal.pattern !== "mixed")
    .sort((a, b) => Math.abs(b.mean - 3) - Math.abs(a.mean - 3)).slice(0, 3);
  const supportive = ranked.map((signal) => hints[signal.dimension.id]?.[signal.pattern]?.[0]).filter(Boolean);
  const effortful = ranked.map((signal) => hints[signal.dimension.id]?.[signal.pattern]?.[1]).filter(Boolean);
  return { supportive, effortful };
}

function environmentMarkup(signals) {
  const { supportive, effortful } = environmentHints(signals);
  const list = (items) => items.length ? "<ul>" + items.map((item) => "<li>" + esc(item) + "</li>").join("") + "</ul>" : "<p>There are not enough clear response patterns to suggest conditions yet.</p>";
  return '<div class="pm-condition-grid"><article class="pm-condition-card"><span>COULD SUPPORT THIS PATTERN</span>' + list(supportive) + '</article><article class="pm-condition-card"><span>POSSIBLE SOURCES OF EXTRA EFFORT</span>' + list(effortful) + '</article></div><p class="pm-hypothesis-foot">These are conditions to experiment with, not predictions about where you must work or how you will always feel.</p>';
}

function possibleMisreads(signals) {
  const byId = Object.fromEntries(signals.map((signal) => [signal.dimension.id, signal]));
  const items = [];
  if (byId.sociability?.pattern === "more" && byId.boldness?.pattern === "less") {
    items.push(["Wanting connection may be different from finding it easy to initiate.","A pause around unfamiliar people could be mistaken for low social interest. Check whether that description fits you; the questionnaire did not measure how other people actually see you."]);
  }
  if (byId.sociability?.pattern === "less" && byId.boldness?.pattern === "more") {
    items.push(["Social ease may be different from social appetite.","You may be able to approach people without wanting frequent contact. This is a possible reading of the answer pattern, not feedback from other people."]);
  }
  if (byId.stimulation?.pattern === "more" && byId.uncertainty?.pattern === "more") {
    items.push(["Enjoying novelty does not mean enjoying every unknown.","Interest in new experiences and attention to uncertain outcomes can coexist; one does not cancel out the other."]);
  }
  if (byId.control?.pattern === "less" && byId.persistence?.pattern === "more") {
    items.push(["Getting started and staying with something are separate experiences.","Needing a cue to begin does not, on its own, show that a goal matters less to you."]);
  }
  return items;
}

function possibleMisreadMarkup(signals) {
  const items = possibleMisreads(signals);
  if (!items.length) return '<div class="pm-empty-pattern"><p>This quick map did not find a clear measured contrast that supports a specific “might be misunderstood” idea. That does not mean other people always read you accurately.</p></div>';
  return '<div class="pm-misread-grid">' + items.map(([title, text]) => '<article><h3>' + esc(title) + '</h3><p>' + esc(text) + '</p></article>').join("") + '</div>';
}

function standoutMarkup(signals) {
  const top = signals.filter((signal) => signal.mean !== null)
    .sort((a, b) => Math.abs(b.mean - 3) - Math.abs(a.mean - 3))
    .slice(0, 5);
  if (!top.length) return '<p>There were not enough answered items to identify response patterns.</p>';
  return '<ol class="pm-standout-list">' + top.map((signal) =>
    '<li><div><b>' + esc(signal.dimension.title) + '</b><span>' + esc(formatPattern(signal)) + '</span></div><p>' + esc(signalSentence(signal)) + '</p></li>'
  ).join("") + '</ol>';
}

function mapCard(signal) {
  const d = signal.dimension;
  const position = signal.mean === null ? 50 : Math.max(0, Math.min(100, (signal.mean / 6) * 100));
  const variation = signal.variation ? '<p class="pm-variation">Your answers varied across these items. Treat this estimate as especially tentative; context may matter.</p>' : "";
  const use = signal.pattern === "more" ? d.moreUse : signal.pattern === "less" ? d.lessUse : "Notice the specific setting where this feels more or less true.";
  const friction = signal.pattern === "more" ? d.moreFriction : signal.pattern === "less" ? d.lessFriction : "A mixed answer is not a problem to solve; it may be useful information about context.";
  const marker = signal.mean === null ? "" : '<i style="left:' + position + '%"></i>';
  return '<article class="pm-dimension-card">' +
    '<div class="pm-dimension-head"><span class="pm-construct">' + esc(d.kind) + '</span><span class="pm-pattern">' + esc(formatPattern(signal)) + '</span></div>' +
    '<h3>' + esc(d.title) + '</h3><p>' + esc(d.definition) + '</p>' +
    '<div class="pm-continuum" role="img" aria-label="' + esc(d.lowerLabel + "; response pattern: " + formatPattern(signal) + "; " + d.higherLabel) + '">' +
    '<span>' + esc(d.lowerLabel) + '</span><div class="pm-continuum-line">' + marker + '</div><span>' + esc(d.higherLabel) + '</span></div>' +
    '<p class="pm-signal-copy">' + esc(signalSentence(signal)) + '</p>' +
    '<div class="pm-meaning"><div><b>Where it may help</b><p>' + esc(use) + '</p></div><div><b>Possible friction</b><p>' + esc(friction) + '</p></div></div>' +
    '<small class="pm-evidence">Self-report · ' + signal.count + ' of ' + signal.total + ' candidate items answered</small>' + variation +
    '</article>';
}

function tensionMarkup(hypotheses) {
  if (!hypotheses.length) return '<div class="pm-empty-pattern"><p>The quick map has not found a clearly supported combination in the items it asked. That is a limit of this short version, not evidence that your experiences are simple.</p><p>For now, compare the separate dimensions and ask where they change with situation.</p></div>';
  const cards = hypotheses.map((hypothesis, index) => {
    const choices = [["yes","Yes"],["partly","Partly"],["no","No"],["unsure","Not sure"]].map(([value, label]) =>
      '<button type="button" data-fit="' + index + '" data-value="' + value + '" aria-pressed="' + String(fitResponses[index] === value) + '">' + label + '</button>'
    ).join("");
    return '<article class="pm-hypothesis"><span class="pm-hypothesis-index">POSSIBLE COMBINATION · 0' + (index + 1) + '</span>' +
      '<h3>' + esc(hypothesis.title) + '</h3><p><b>Response pattern:</b> ' + esc(hypothesis.evidence) + '</p>' +
      '<p><b>Hypothesis:</b> ' + esc(hypothesis.idea) + '</p><div class="pm-test-question"><b>Try this question</b><p>' +
      esc(hypothesis.question) + '</p><div class="pm-fit" role="group" aria-label="Does this hypothesis fit your experience?">' + choices + '</div></div></article>';
  }).join("");
  return '<div class="pm-hypothesis-grid">' + cards + '</div>';
}

function exportText(report) {
  const lines = [
    "NOBODY’S SIMPLE · PERSONALITY QUICK MAP", report.title.title, "",
    "Tagline: " + report.title.tagline,
    "How the heading was chosen: " + report.title.basis,
    "Instrument: " + INSTRUMENT_VERSION, "Scoring: " + SCORING_VERSION,
    "Report: " + REPORT_VERSION, "Date: " + new Date().toLocaleDateString(), "",
    "YOU IN ONE MINUTE", report.summary, "", "RESPONSE PATTERNS",
    ...report.signals.map((signal) => signal.dimension.title + ": " + formatPattern(signal) + (signal.count < signal.total ? " (" + signal.count + "/" + signal.total + " items answered)" : "")),
    "", "POSSIBLE COMBINATIONS TO CHECK",
    ...(report.hypotheses.length ? report.hypotheses.map((item) => item.title + " — " + item.idea) : ["No combination was generated from this short map."]),
    "", "CONDITIONS WORTH TESTING",
    ...report.conditions.supportive.map((item) => "Could support this pattern: " + item),
    ...report.conditions.effortful.map((item) => "Possible extra effort: " + item),
    "", "POSSIBLE MISREADINGS TO CHECK",
    ...(report.misreads.length ? report.misreads.map((item) => item[0] + " — " + item[1]) : ["No specific pattern was generated by this short map."]),
    "", "LIMITS",
    "This is an exploratory beta questionnaire. Its provisional response-pattern rules, item wording, interpretation and interactions have not been psychometrically validated or normed. No percentiles, confidence estimates or total personality score are used. It is not a diagnosis.",
    "It samples 10 candidate themes from temperament and dispositional personality; it does not assess all eight layers in the full design.",
    "Nothing was sent to Nobody’s Simple. This file is created only because you chose to download it.",
  ];
  return lines.join("\n");
}

function downloadProfile(report, root) {
  const file = new Blob([exportText(report)], { type:"text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "nobodys-simple-personality-quick-map.txt";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  root.querySelector("#pm-download-status").textContent = "Your profile file was created on this device.";
}

function renderResult(root) {
  const signals = calculateSignals();
  const archetype = titleFor(signals);
  const hypotheses = buildHypotheses(signals);
  const summary = summaryText(signals);
  const technical = technicalSummary(signals);
  const operatingConditions = environmentMarkup(signals);
  const possibleMisreadCards = possibleMisreadMarkup(signals);
  const conditions = environmentHints(signals);
  const misreads = possibleMisreads(signals);
  const profileDate = new Date().toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" });
  const report = { signals, title:archetype, hypotheses, summary, conditions, misreads };
  const answered = Object.values(answers).filter((value) => value !== null && value !== undefined).length;
  const versions = [INSTRUMENT_VERSION, SCORING_VERSION, REPORT_VERSION].map((value) => '<span>' + esc(value) + '</span>').join("");
  const feedbackChoices = [["useful","Useful"],["partial","Partly"],["missed","It missed"],["unsure","Not sure"]].map(([value, label]) =>
    '<button type="button" data-personal-fit="' + value + '" aria-pressed="' + String(fitResponses.personal === value) + '">' + label + '</button>'
  ).join("");
  root.innerHTML = `<div class="wrap pm-wrap pm-result-wrap">
    <article class="pm-result-hero">
      <img class="pm-result-character" src="personality-map.png" alt="A friendly map character showing the route through a personality map">
      <p class="eyebrow">Your working archetype · Beta snapshot</p>
      <h1>${esc(archetype.title)}</h1>
      <p class="pm-archetype-tagline">${esc(archetype.tagline)}</p>
      <p class="pm-tech-profile">${esc(technical)}</p>
      <p class="pm-archetype-note">${esc(archetype.basis)} The separate response patterns below remain the result; this title is a working shorthand, not a fixed type.</p>
      <div class="pm-version">${versions}</div>
      <p class="pm-result-count">Profile date · ${esc(profileDate)} · ${answered} of ${itemBank.length} questions answered · No total personality score or population comparison</p>
    </article>
    <nav class="pm-report-nav" aria-label="Profile sections"><a href="#pm-know">Know me</a><a href="#pm-understand">Understand me</a><a href="#pm-use">Use this</a></nav>
    <section class="pm-report-section" id="pm-know"><p class="eyebrow">Level 1 · Know me</p><h2>You in one minute</h2><div class="pm-summary">${summary.split("\n\n").map((paragraph) => '<p>' + esc(paragraph) + '</p>').join("")}</div>
      <div class="pm-standouts"><h3>Your five most distinctive signals</h3><p>Ordered by how far each response pattern sat from “mixed / depends” in your own answers. They are not rankings against other people.</p>${standoutMarkup(signals)}</div>
      <div class="pm-report-intro-grid"><article class="pm-report-intro-card"><span class="pm-report-symbol">≈</span><h3>Both can be true</h3><p>Different tendencies can pull in different directions. A tension does not mean one side is the “real you.”</p></article><article class="pm-report-intro-card"><span class="pm-report-symbol">↻</span><h3>A map that can change</h3><p>This is one self-report snapshot. Context, energy and future experience can change what is useful to notice.</p></article><article class="pm-report-intro-card"><span class="pm-report-symbol">⌁</span><h3>A descriptive starting point</h3><p>The headline is shorthand. Keep the individual patterns, their trade-offs and your own context in view.</p></article></div>
    </section>
    <section class="pm-report-section"><p class="eyebrow">A possible outside reading</p><h2>What people could misunderstand</h2><p class="pm-section-lead">These possibilities are generated only when this short map finds a relevant contrast. They are hypotheses, not ratings from people who know you.</p>${possibleMisreadCards}</section>
    <section class="pm-report-section" id="pm-understand"><p class="eyebrow">Level 2 · Understand me</p><h2>The patterns underneath the title</h2><p class="pm-section-lead">Read each signal separately. The scale markers show how your answers leaned on these draft questions; they do not show a percentile or validated trait score.</p>
      <div class="pm-dimensions">${signals.map(mapCard).join("")}</div>
    </section>
    <section class="pm-report-section"><p class="eyebrow">Where parts may pull differently</p><h2>Possible combinations to test</h2><p class="pm-section-lead">These are provisional interpretations generated from the response patterns above. They are hypotheses for you to accept, revise or reject—not validated interaction rules.</p>
      ${tensionMarkup(hypotheses)}
      <p class="pm-fit-note">Your Yes / Partly / No choices stay in this tab only. They are not sent to the site.</p>
    </section>
    <section class="pm-report-section" id="pm-use"><p class="eyebrow">Level 3 · Use this</p><h2>Conditions worth trying</h2><p class="pm-section-lead">This is a small operating manual drawn from the patterns this Quick Map actually asked about. Treat each point as an experiment, not an instruction.</p>${operatingConditions}<div class="pm-use-grid"><article class="pm-use-card"><span class="pm-use-step">01</span><h3>Pick one signal</h3><p>Choose a pattern that matters to a real situation—not simply the one with the most dramatic label.</p></article><article class="pm-use-card"><span class="pm-use-step">02</span><h3>Notice the setting</h3><p>For a week, note when it appears, what was happening around you and what changed afterward.</p></article><article class="pm-use-card"><span class="pm-use-step">03</span><h3>Check the prediction</h3><p>Ask whether the pattern helps, creates friction, or changes across people, tasks and environments.</p></article></div>
      <div class="pm-personal-check"><h3>Does this snapshot feel useful?</h3><p>This is a private check-in, not a research submission. To share general feedback with Nobody’s Simple, use the community page.</p><div class="pm-fit" role="group" aria-label="Was this profile useful?">${feedbackChoices}</div><p id="pm-feedback-status" class="pm-inline-note" aria-live="polite"></p></div>
    </section>
    <section class="pm-limit-panel"><p class="eyebrow">Limits of the Quick Map</p><h2>What this assessment cannot currently tell us</h2><p>This beta uses ${itemBank.length} original candidate questions across ten themes in temperament and dispositional personality. The item wording, interpretation, response-pattern rules and interactions have not been psychometrically validated or normed. These provisional mean-based labels are not calibrated latent scores. This page does not compare you with a population; it provides no percentiles, total personality score, calibrated reliability estimates or confidence intervals.</p><p class="pm-unassessed-title">Not assessed in this Quick Map</p><div class="pm-unknown-tags"><span>Attachment and relationships</span><span>Motives and values</span><span>Needs and identity</span><span>Emotion regulation</span><span>Work, money and learning</span><span>Decisions and conflict</span><span>State and context changes</span></div><p>It also does not measure ability or explain the cause of a response, predict your future, or diagnose ADHD, autism, anxiety, depression or any other condition. Repeated daily sampling, other people's perspectives and the wider domains in the master design are outside this short first version.</p><p class="pm-limits-foot">This profile is a starting map, not a verdict. The useful question is what you do with it.</p></section>
    <section class="pm-end-actions"><div><p class="eyebrow">Keep or revise your map</p><h2>Your answers stay with you.</h2><p>Nothing has been stored or sent. Choose to download a plain-text copy, start again, or return to the wider site.</p><p id="pm-download-status" class="pm-inline-note" aria-live="polite"></p></div><div class="pm-action-buttons"><button type="button" class="button" id="pm-download">Download my profile</button><button type="button" class="button secondary" id="pm-restart">Start a new map</button><a class="button secondary" href="#community">Share general feedback</a><a class="pm-back-link" href="#home">← Back to the main website</a></div></section>
  </div>`;
  root.querySelector("#pm-download").addEventListener("click", () => downloadProfile(report, root));
  root.querySelector("#pm-restart").addEventListener("click", () => { reset(); render(root); });
  root.querySelectorAll("[data-fit]").forEach((button) => {
    button.addEventListener("click", () => {
      fitResponses[button.dataset.fit] = button.dataset.value;
      root.querySelectorAll('[data-fit="' + button.dataset.fit + '"]').forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
    });
  });
  root.querySelectorAll("[data-personal-fit]").forEach((button) => {
    button.addEventListener("click", () => {
      fitResponses.personal = button.dataset.personalFit;
      root.querySelectorAll("[data-personal-fit]").forEach((option) => option.setAttribute("aria-pressed", String(option === button)));
      root.querySelector("#pm-feedback-status").textContent = "Thanks. This check-in is still only in this tab.";
    });
  });
}

function render(root) {
  if (phase === "questions") renderQuestion(root);
  else if (phase === "result") renderResult(root);
  else renderIntro(root);
}

export function renderPersonalityTest(root) {
  render(root);
}
