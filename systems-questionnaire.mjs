import { escapeHTML as esc } from "./core.mjs";

const SCALE = [
  [1, "Not at all like me"],
  [2, "A little like me"],
  [3, "Sometimes / depends"],
  [4, "Often like me"],
  [5, "Very much like me"],
];

const SYSTEMS = [
  {
    id: "drive",
    name: "Drive system",
    short: "Pursuing, striving, achieving",
    colour: "#3f70d6",
    icon: "⚑",
    description: "The part of the map that moves towards goals, progress, reward, mastery and completion.",
  },
  {
    id: "soothing",
    name: "Soothing system",
    short: "Safe, calm, nurtured",
    colour: "#19b968",
    icon: "◒",
    description: "The part of the map that allows settling, care, connection, recovery and enoughness.",
  },
  {
    id: "threat",
    name: "Threat system",
    short: "Alert, protecting, defending",
    colour: "#f45d61",
    icon: "⚠",
    description: "The part of the map that detects danger, urgency, loss, rejection, error or exposure.",
  },
];

const ITEMS = [
  ["drive", "I feel pulled towards a goal, improvement or next achievement."],
  ["drive", "Making progress gives me energy or relief."],
  ["drive", "I can turn a vague ambition into something I want to pursue."],
  ["drive", "I notice opportunities to learn, win, build or master something."],
  ["drive", "Finishing or completing something feels especially satisfying."],
  ["drive", "I become restless when there is no direction or challenge."],
  ["drive", "I compare where I am now with where I think I should be."],
  ["drive", "I can keep moving towards something even when it is difficult."],
  ["drive", "A meaningful future feels emotionally vivid to me."],
  ["drive", "I find it hard to stop pursuing something once I have started."],
  ["soothing", "I can let myself rest without first proving that I deserve it."],
  ["soothing", "Warmth, care or familiar connection helps me settle."],
  ["soothing", "I can notice that something is enough for now."],
  ["soothing", "My body can sometimes shift out of high alert."],
  ["soothing", "I can receive help without immediately needing to repay it."],
  ["soothing", "There are places, people or routines where I feel held or grounded."],
  ["soothing", "I can be kind to myself when I make a mistake."],
  ["soothing", "Pleasure, play or comfort can reach me even during a hard period."],
  ["soothing", "I can pause without interpreting the pause as failure."],
  ["soothing", "I can feel connected without needing to perform."],
  ["threat", "I scan for what could go wrong, be lost or become unsafe."],
  ["threat", "Uncertainty quickly creates urgency in me."],
  ["threat", "I replay mistakes, conversations or possible future problems."],
  ["threat", "I become watchful for rejection, criticism or signs that I have failed."],
  ["threat", "My body reacts as if something needs dealing with immediately."],
  ["threat", "I use avoidance, checking, control or reassurance to reduce alarm."],
  ["threat", "Self-criticism feels like a way to prevent a worse outcome."],
  ["threat", "It is difficult to relax while an unresolved problem remains."],
  ["threat", "I prepare for danger even when I am not sure it will happen."],
  ["threat", "I can become defensive, withdrawn or ready to escape when pressured."],
].map(function (item, index) {
  return { number: index + 1, system: item[0], text: item[1] };
});

const BANK = {
  drive: [
    ["Choose one finish line", "Name the smallest outcome that would count as complete. Make the finish line visible before adding another goal."],
    ["Make the next action physical", "Turn “work on it” into an action you can see: open the document, send one message, put one object away."],
    ["Time-box pursuit", "Give the drive system a defined window, then stop at the boundary even if the work is not perfect."],
    ["Use a good-enough rule", "Decide in advance what quality is sufficient for this task so improvement does not become an endless demand."],
    ["Separate worth from output", "Write two lines: “What I want to accomplish” and “What this accomplishment does not prove about me.”"],
    ["Externalise the priority", "Keep one visible list with a maximum of three active priorities. Move the rest into a later list."],
    ["Build a recovery appointment", "Put recovery beside the goal in the plan rather than treating it as a reward that must be earned."],
    ["Use a witness", "Tell a trusted person the next concrete action and when you will review it. Accountability should clarify, not shame."],
    ["Shrink the challenge", "Lower the entry cost: fewer minutes, fewer steps, a familiar example or a first attempt that can be revised."],
    ["Track evidence of progress", "Record what changed, not only what remains. This gives the drive system a more accurate map."],
    ["Protect curiosity", "Replace “How do I prove myself?” with “What could I learn from the next attempt?”"],
    ["Practise stopping", "End one task while it is still going well and notice whether stopping feels like danger, loss or simply transition."],
  ],
  soothing: [
    ["Make a reliable landing", "Create one repeatable transition after demand: lower input, drink, warmth, familiar media or ten quiet minutes."],
    ["Receive before solving", "Let support be contact, company or comfort first. You do not have to turn every caring moment into a plan."],
    ["Name enough for today", "Choose what “enough” means for the next hour, not for your whole life."],
    ["Use chosen sensory comfort", "Adjust one controllable input: temperature, texture, sound, light, pressure or familiar smell."],
    ["Practise non-productive rest", "Do one short activity whose purpose is recovery rather than improvement or preparation."],
    ["Create a safe-enough corner", "Make one place easier to return to by reducing decisions, clutter, noise or social performance."],
    ["Borrow steadiness", "Spend time with a person, animal, object, routine or place that makes your system less alone."],
    ["Let care be specific", "Ask for one concrete form of support: company, a check-in, practical help, quiet or reassurance."],
    ["Use a gentle completion ritual", "Mark that a demand has ended: close the tab, change clothes, wash a cup or write “finished for now.”"],
    ["Allow pleasure without justification", "Choose something enjoyable without making it productive or using it to prove that you are okay."],
    ["Offer yourself a fair sentence", "Try: “This is difficult and I am allowed to respond at a human pace.”"],
    ["Protect recovery from the drive system", "Put a boundary around improving the recovery plan. Sometimes the useful intervention is simply staying."],
  ],
  threat: [
    ["Separate signal from prediction", "Write what is happening now beside what your threat system predicts may happen next."],
    ["Check immediate safety", "Ask: is there a current danger, a possible future problem, an old alarm, or more than one at once?"],
    ["Reduce irreversible decisions", "When alarm is high, delay messages, purchases, exits or promises that cannot easily be undone."],
    ["Orient to present facts", "Name where you are, what time it is, who is actually present and what has already ended."],
    ["Make the risk actionable", "If there is a real problem, identify one protective action instead of rehearsing every possible outcome."],
    ["Use an uncertainty container", "Give the worry a later review time. Until then, record new evidence rather than repeatedly reopening the case."],
    ["Make a boundary legible", "Write what you will do, what you are asking for and what you will not continue, without needing the other person to agree."],
    ["Reduce checking gradually", "Delay one check by a small, chosen interval and record whether the feared outcome actually changed."],
    ["Ask for information, not endless reassurance", "Form one question that could genuinely update the map. Notice when more reassurance stops adding information."],
    ["Lower exposure while deciding", "Mute, leave, pause or reduce input if the environment is feeding alarm. Protection is not the same as avoidance in every situation."],
    ["Use a compassionate protector voice", "Replace attack with direction: “Something feels risky. What is the safest useful next step?”"],
    ["Plan an exit and a return", "Knowing how to pause or leave can help the threat system settle enough to assess whether you want to stay."],
  ],
};

const PAIR_BANK = [
  {
    key: "drive-threat",
    title: "Push and brace",
    text: "Drive and threat are both prominent. The person may pursue hard while also scanning for failure, criticism or loss.",
    actions: [
      ["Make the task safer before making it bigger", "Define a minimum viable attempt, the information it will produce and the point at which you will stop."],
      ["Separate urgency from importance", "Ask what genuinely needs action today and what only feels urgent because alarm is loud."],
      ["Use a protected experiment", "Try a small version where failure has a contained cost. Let evidence, not self-attack, decide the next step."],
    ],
  },
  {
    key: "drive-soothing",
    title: "Pursuit and restoration",
    text: "Drive and soothing are both available. The task may be to let recovery support ambition rather than become its enemy.",
    actions: [
      ["Alternate rather than choose", "Plan a short pursuit block beside a real recovery block. Neither has to defeat the other."],
      ["Make rest part of the system", "Treat recovery as maintenance for the work you value, not as a prize for finishing everything."],
      ["Notice when enough is reached", "Practise ending at a meaningful stopping point before the drive system turns care into another performance."],
    ],
  },
  {
    key: "threat-soothing",
    title: "Protection and settling",
    text: "Threat and soothing are both prominent. The person may need care and protection at the same time; calm should not be used to prove that a problem is imaginary.",
    actions: [
      ["Soothe without dismissing", "Offer comfort while keeping the concrete risk or boundary visible."],
      ["Move from alarm to protection", "Choose the action that makes the situation safer, then let the soothing system help you recover."],
      ["Use safe contact carefully", "Ask for company or reassurance that supports reality-testing rather than requiring certainty."],
    ],
  },
  {
    key: "all-high",
    title: "Three systems online",
    text: "All three systems appear prominent. This can feel intense, but it may also mean several forms of information are available at once.",
    actions: [
      ["Choose the role for this moment", "Ask which system should lead, which should advise and which needs a short pause."],
      ["Reduce simultaneous demands", "Do not ask yourself to pursue, recover and solve danger at full volume at the same time."],
      ["Sequence the response", "Protect first if needed, settle enough to think, then choose the smallest useful action."],
    ],
  },
  {
    key: "all-low",
    title: "Low access or low demand",
    text: "All three scores are relatively low. That can reflect depletion, numbness, a quiet context or answers that do not capture the current state.",
    actions: [
      ["Check the body-state basics", "Look at sleep, food, pain, medication, sensory load and recent demand before making a large conclusion."],
      ["Choose one tiny signal", "Try a small movement, contact, comfort or purposeful action and notice whether anything becomes more available."],
      ["Do not force activation", "A quiet map is information, not a failure to have a personality or motivation."],
    ],
  },
];

const systemFor = (id) => SYSTEMS.find((system) => system.id === id);
const itemsFor = (id) => ITEMS.filter((item) => item.system === id);
const valueText = (value) => String(Math.round(value)) + "%";

const state = {
  page: "intro",
  section: 0,
  estimates: { drive: 50, soothing: 50, threat: 50 },
  answers: Array(ITEMS.length).fill(null),
};

function resetState() {
  state.page = "intro";
  state.section = 0;
  state.estimates = { drive: 50, soothing: 50, threat: 50 };
  state.answers = Array(ITEMS.length).fill(null);
}

function scoreFor(id) {
  const items = itemsFor(id);
  const total = items.reduce((sum, item) => sum + Number(state.answers[item.number - 1] || 0), 0);
  return Math.round(((total - items.length) / (items.length * 4)) * 100);
}

function allScores() {
  return SYSTEMS.map((system) => ({ system, score: scoreFor(system.id), estimate: state.estimates[system.id] }));
}

function estimateReading(entry) {
  const difference = entry.score - entry.estimate;
  if (Math.abs(difference) < 15) return "Your first estimate and response pattern are fairly close.";
  if (difference > 0) return "Your answers show this system appearing more often or more strongly than your first estimate suggested.";
  return "You pictured this system as larger than the response pattern shows. It may be especially noticeable in certain situations without being present all the time.";
}

function patternFor(scores) {
  const ordered = scores.slice().sort((a, b) => b.score - a.score);
  const highest = ordered[0];
  const second = ordered[1];
  const lowest = ordered[2];
  const spread = highest.score - lowest.score;
  if (highest.score < 40 && lowest.score < 40) return { key: "all-low", title: "The whole map is quiet", text: "All three systems are showing relatively low access in these answers. That is not a verdict about motivation or wellbeing; it can reflect depletion, low demand, uncertainty or a map that needs more context." };
  if (highest.score > 62 && lowest.score > 62) return { key: "all-high", title: "Several systems are online together", text: "Drive, soothing and threat all appear prominent. The useful question is not which one is the real you, but which one needs to lead and which information the others can contribute." };
  if (spread < 16) return { key: "balanced", title: "A roughly balanced map", text: "The three systems sit fairly close together. You may have access to different routes, with the situation deciding which one becomes louder." };
  if (highest.score - second.score >= 18) return { key: highest.system.id, title: highest.system.name + " stands out", text: "One system is considerably more prominent than the others in this response pattern. That can be useful in some settings and costly when it crowds out another kind of information." };
  return { key: "mixed", title: "A mixed or shifting map", text: highest.system.name + " is somewhat ahead, but the next system is close enough that context may change the balance quickly." };
}

function conflictsFor(scores) {
  const map = Object.fromEntries(scores.map((entry) => [entry.system.id, entry.score]));
  const conflicts = [];
  if (map.drive >= 62 && map.threat >= 62) conflicts.push(PAIR_BANK.find((entry) => entry.key === "drive-threat"));
  if (map.drive >= 62 && map.soothing >= 62) conflicts.push(PAIR_BANK.find((entry) => entry.key === "drive-soothing"));
  if (map.threat >= 62 && map.soothing >= 62) conflicts.push(PAIR_BANK.find((entry) => entry.key === "threat-soothing"));
  const ordered = scores.slice().sort((a, b) => b.score - a.score);
  if (ordered[0].score > 62 && ordered[2].score > 62) conflicts.push(PAIR_BANK.find((entry) => entry.key === "all-high"));
  if (ordered[0].score < 40 && ordered[2].score < 40) conflicts.push(PAIR_BANK.find((entry) => entry.key === "all-low"));
  return conflicts.filter((entry, index, all) => entry && all.indexOf(entry) === index);
}

function circleMarkup(entry, result) {
  const size = Math.max(28, Math.min(100, entry.score));
  const estimate = Math.max(20, Math.min(100, entry.estimate));
  const system = entry.system;
  return "<article class='systems-result-card' style='--system-colour:" + system.colour + "'><div class='systems-result-visual'><span class='systems-estimate-ring' style='--ring-size:" + estimate + "%' aria-hidden='true'></span><span class='systems-result-circle' style='--circle-size:" + size + "%'>" + esc(system.icon) + "</span></div><div class='systems-result-copy'><p class='eyebrow'>" + esc(system.name) + "</p><h3>" + esc(valueText(entry.score)) + "</h3><p>" + esc(system.short) + "</p><small>" + esc(result || estimateReading(entry)) + "</small></div></article>";
}

function pageFrame(eyebrow, title, lead, body, actions) {
  return "<div class='wrap questionnaires-page systems-questionnaire-page'><div class='systems-back-row'><a href='#questionnaires'>← Back to questionnaires</a><span class='eyebrow'>" + esc(eyebrow) + "</span></div><section class='section-title'><h1>" + title + "</h1><p class='lead'>" + esc(lead) + "</p></section>" + body + (actions || "") + "</div>";
}

function renderIntro(root) {
  const circles = SYSTEMS.map((system) => {
    const value = state.estimates[system.id];
    return "<article class='systems-estimate-card' style='--system-colour:" + system.colour + "'><div class='systems-estimate-circle' style='--circle-size:" + value + "%'><span>" + esc(system.icon) + "</span></div><p class='eyebrow'>" + esc(system.name) + "</p><h3>" + esc(system.short) + "</h3><label>My estimate <output id='estimate-" + system.id + "'>" + valueText(value) + "</output><input type='range' min='0' max='100' step='1' value='" + value + "' data-system-estimate='" + system.id + "'></label><p>" + esc(system.description) + "</p></article>";
  }).join("");
  root.innerHTML = pageFrame("Nobody’s Simple · 3 circles", "How big are your systems right now?", "First make a visual estimate. Then answer 30 short questions and compare the picture you started with against the response pattern.", "<section class='systems-hero'><div class='systems-hero-copy'><p class='eyebrow'>A visual systems questionnaire</p><h2>Start with the map you already carry.</h2><p>These circles are the Drive, Soothing and Threat systems from the three-circles emotional regulation model. Your first map is not a score; it is your expectation. The questionnaire then gives you a separate, response-derived estimate to compare with it.</p><p class='systems-note'><b>Important:</b> This is an educational reflective tool. “Bigger” means more prominent or easier to recruit in these answers, not better, healthier or objectively true.</p></div><div class='systems-mini-map' aria-label='Three systems visual estimate'>" + circles.map(function (html) { return html; }).join("") + "</div></section><section class='systems-how'><div><p class='eyebrow'>How it works</p><h2>Estimate → answer → compare.</h2></div><ol><li><b>01 · Your estimate</b><span>Adjust the circles until they look like your current sense of the systems.</span></li><li><b>02 · 30 questions</b><span>Answer ten questions about each system across the last month.</span></li><li><b>03 · Your map</b><span>See balance, mismatches, conflicts and a large bank of possible experiments.</span></li></ol></section><div class='systems-actions'><button type='button' class='button' id='systems-start'>Start the 30 questions →</button><a class='button secondary' href='#questionnaires'>Not now</a></div><p class='systems-small-print'>No system is a permanent identity. The same person can have a different map in a different context, body state or season of life.</p>", "");
  root.querySelectorAll("[data-system-estimate]").forEach(function (input) {
    input.addEventListener("input", function () {
      state.estimates[input.dataset.systemEstimate] = Number(input.value);
      const output = root.querySelector("#estimate-" + input.dataset.systemEstimate);
      if (output) output.textContent = valueText(Number(input.value));
      const circle = input.closest(".systems-estimate-card").querySelector(".systems-estimate-circle");
      if (circle) circle.style.setProperty("--circle-size", input.value + "%");
    });
  });
  root.querySelector("#systems-start").addEventListener("click", function () {
    state.page = "questions";
    state.section = 0;
    renderView(root);
  });
}

function renderQuestions(root) {
  const system = SYSTEMS[state.section];
  const items = itemsFor(system.id);
  const answered = items.filter(function (item) { return Number.isFinite(state.answers[item.number - 1]); }).length;
  const total = state.answers.filter(function (value) { return Number.isFinite(value); }).length;
  const questionMarkup = items.map(function (item) {
    const selected = state.answers[item.number - 1];
    return "<fieldset class='systems-question'><legend><span>" + String(item.number).padStart(2, "0") + "</span><b>" + esc(item.text) + "</b></legend><div class='systems-scale' role='radiogroup' aria-label='Question " + item.number + "'>" + SCALE.map(function (option) {
      return "<label><input type='radio' name='system-" + item.number + "' value='" + option[0] + "' data-system-answer='" + (item.number - 1) + "' " + (selected === option[0] ? "checked" : "") + "><span><b>" + option[0] + "</b><small>" + esc(option[1]) + "</small></span></label>";
    }).join("") + "</div></fieldset>";
  }).join("");
  const nextLabel = state.section === SYSTEMS.length - 1 ? "See my systems map →" : "Next: " + SYSTEMS[state.section + 1].name + " →";
  root.innerHTML = pageFrame("Questionnaire · " + (state.section + 1) + " of " + SYSTEMS.length, system.name, "Think about the last month, across more than one situation. Choose the closest answer; context can still change the pattern.", "<section class='systems-question-intro' style='--system-colour:" + system.colour + "'><div class='systems-question-orb'>" + esc(system.icon) + "</div><div><p class='eyebrow'>" + esc(system.short) + "</p><h2>" + esc(system.description) + "</h2><p>" + answered + " of " + items.length + " answered in this system · " + total + " of " + ITEMS.length + " overall.</p></div></section><div class='systems-progress'><i style='width:" + ((total / ITEMS.length) * 100) + "%'></i></div><form id='systems-form'>" + questionMarkup + "<p class='systems-form-status' id='systems-status' aria-live='polite'></p><div class='systems-form-actions'>" + (state.section ? "<button class='button secondary' type='button' id='systems-back'>← Previous</button>" : "<a class='button secondary' href='#questionnaires'>Exit questionnaire</a>") + "<button class='button' type='submit'>" + nextLabel + "</button></div></form><p class='systems-small-print'>This section is not asking how you wish you were. It is asking how available, influential or loud this system has been in your recent life.</p>", "");
  root.querySelectorAll("[data-system-answer]").forEach(function (input) {
    input.addEventListener("change", function () {
      state.answers[Number(input.dataset.systemAnswer)] = Number(input.value);
      const count = state.answers.filter(function (value) { return Number.isFinite(value); }).length;
      const sectionCount = items.filter(function (item) { return Number.isFinite(state.answers[item.number - 1]); }).length;
      const countNode = root.querySelector(".systems-question-intro p:last-child");
      if (countNode) countNode.textContent = sectionCount + " of " + items.length + " answered in this system · " + count + " of " + ITEMS.length + " overall.";
      const progress = root.querySelector(".systems-progress i");
      if (progress) progress.style.width = ((count / ITEMS.length) * 100) + "%";
    });
  });
  root.querySelector("#systems-back")?.addEventListener("click", function () {
    state.section = Math.max(0, state.section - 1);
    renderView(root);
  });
  root.querySelector("#systems-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const missing = items.filter(function (item) { return !Number.isFinite(state.answers[item.number - 1]); });
    if (missing.length) {
      const status = root.querySelector("#systems-status");
      status.textContent = "Choose an answer for " + (missing.length === 1 ? "the remaining question" : missing.length + " remaining questions") + " before continuing.";
      root.querySelector("[data-system-answer='" + (missing[0].number - 1) + "']")?.closest(".systems-question")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (state.section < SYSTEMS.length - 1) {
      state.section += 1;
      renderView(root);
    } else {
      state.page = "results";
      renderView(root);
    }
  });
}

function renderResults(root) {
  const scores = allScores();
  const pattern = patternFor(scores);
  const conflicts = conflictsFor(scores);
  const ordered = scores.slice().sort(function (a, b) { return b.score - a.score; });
  const scoreCards = scores.map(function (entry) { return circleMarkup(entry, ""); }).join("");
  const comparison = scores.map(function (entry) {
    const difference = entry.score - entry.estimate;
    const direction = Math.abs(difference) < 15 ? "close" : difference > 0 ? "larger in answers" : "larger in your estimate";
    return "<article class='systems-compare-row' style='--system-colour:" + entry.system.colour + "'><div><b>" + esc(entry.system.name) + "</b><small>" + esc(direction) + "</small></div><div class='systems-compare-track'><i style='width:" + entry.estimate + "%'></i><span style='width:" + entry.score + "%'></span></div><strong>" + valueText(entry.estimate) + " → " + valueText(entry.score) + "</strong><p>" + esc(estimateReading(entry)) + "</p></article>";
  }).join("");
  const conflictMarkup = conflicts.length ? conflicts.map(function (conflict) {
    return "<article class='systems-conflict-card'><p class='eyebrow'>Interaction to notice</p><h3>" + esc(conflict.title) + "</h3><p>" + esc(conflict.text) + "</p><div class='systems-recommendation-grid'>" + conflict.actions.map(function (action) { return "<div><b>" + esc(action[0]) + "</b><p>" + esc(action[1]) + "</p></div>"; }).join("") + "</div></article>";
  }).join("") : "<p class='systems-empty'>No strong two-system conflict crossed the threshold in this response pattern. That does not mean the systems never conflict; it means the questionnaire did not make one especially prominent.</p>";
  const primaryIds = ordered.map(function (entry) { return entry.system.id; });
  const primaryRecommendations = primaryIds.slice(0, 2).map(function (id) {
    return BANK[id].slice(0, 3).map(function (item) { return "<article class='systems-recommendation-card' style='--system-colour:" + systemFor(id).colour + "'><span class='eyebrow'>" + esc(systemFor(id).name) + "</span><h3>" + esc(item[0]) + "</h3><p>" + esc(item[1]) + "</p></article>"; }).join("");
  }).join("");
  const bankMarkup = SYSTEMS.map(function (system) {
    return "<section class='systems-bank-section'><div><p class='eyebrow'>" + esc(system.name) + "</p><h3>" + esc(system.short) + "</h3></div><div class='systems-bank-grid'>" + BANK[system.id].map(function (item) { return "<article><b>" + esc(item[0]) + "</b><p>" + esc(item[1]) + "</p></article>"; }).join("") + "</div></section>";
  }).join("");
  const mapText = "Nobody’s Simple systems map\n\nPattern: " + pattern.title + "\n" + scores.map(function (entry) { return entry.system.name + ": estimate " + entry.estimate + "%; questionnaire " + entry.score + "%"; }).join("\n") + "\n\nTop system: " + ordered[0].system.name + "\n" + conflicts.map(function (conflict) { return "\n" + conflict.title + ": " + conflict.text; }).join("") + "\n\nThe map is a reflective estimate, not a diagnosis or fixed identity.";
  root.innerHTML = pageFrame("Results · your Human Map", "Three systems, one living map.", "Compare the map you expected with the map your answers produced. The useful question is what to try next, not which system is the real you.", "<section class='systems-results-banner'><div><p class='eyebrow'>Overall pattern</p><h2>" + esc(pattern.title) + "</h2><p>" + esc(pattern.text) + "</p></div><div class='systems-result-stamp' aria-hidden='true'><span>MAP</span><b>not a verdict</b></div></section><section class='systems-results-map'><div class='systems-results-heading'><div><p class='eyebrow'>Questionnaire-derived map</p><h2>What is prominent in the answers?</h2></div><p>The faint ring shows your estimate. The solid circle shows the response-derived estimate.</p></div><div class='systems-results-grid'>" + scoreCards + "</div></section><section class='systems-comparison'><div class='systems-results-heading'><div><p class='eyebrow'>Before → after</p><h2>Where did your map disagree with itself?</h2></div><p>Differences can happen because a system is automatic, context-specific, recently intense or difficult to notice from inside.</p></div>" + comparison + "</section><section class='systems-conflicts'><div class='systems-results-heading'><div><p class='eyebrow'>When systems pull against each other</p><h2>Possible tensions in the map.</h2></div><p>These are hypotheses to test against experience, not labels to accept.</p></div>" + conflictMarkup + "</section><section class='systems-recommendations'><div class='systems-results-heading'><div><p class='eyebrow'>What you could try</p><h2>Start with a few routes.</h2></div><p>These suggestions come from the systems that are most prominent here. Open the full idea bank below for more options.</p></div><div class='systems-recommendation-grid'>" + primaryRecommendations + "</div></section><details class='systems-bank'><summary>Browse the full systems idea bank</summary><div>" + bankMarkup + "</div></details><section class='systems-result-note'><p><b>Keep the map open.</b> A system can be large because it is well-supported, over-recruited, protective, practised or responding to the current environment. Repeat the questionnaire after a meaningful change if you want to compare maps.</p><p>This is Nobody’s Simple’s educational questionnaire. It is not clinical, diagnostic or a validated psychometric measure.</p></section><div class='systems-result-actions'><button class='button' type='button' id='systems-print'>Print / save as PDF</button><button class='button secondary' type='button' id='systems-download'>Download map</button><button class='button secondary' type='button' id='systems-restart'>Make a new map</button><a class='button secondary' href='#questionnaires'>Back to questionnaires</a></div>", "");
  root.querySelector("#systems-print").addEventListener("click", function () { window.print(); });
  root.querySelector("#systems-download").addEventListener("click", function () {
    const blob = new Blob([mapText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "nobodys-simple-systems-map.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  });
  root.querySelector("#systems-restart").addEventListener("click", function () {
    resetState();
    renderView(root);
  });
}

function renderView(root) {
  if (state.page === "questions") renderQuestions(root);
  else if (state.page === "results") renderResults(root);
  else renderIntro(root);
}

export function renderSystemsQuestionnaire(root) {
  resetState();
  renderView(root);
}
