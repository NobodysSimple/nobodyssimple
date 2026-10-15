import { escapeHTML as esc } from "./core.mjs";

const SCALE = [
  [1, "Disagree strongly"],
  [2, "Disagree a little"],
  [3, "Neither agree nor disagree"],
  [4, "Agree a little"],
  [5, "Agree strongly"],
];

const TRAITS = [
  {
    id: "E",
    name: "Extraversion",
    plain: "social energy and outward engagement",
    colour: "#c8784f",
    high: "You may get energy, momentum or interest from conversation, shared activity and visible social contact. Solitary time can still matter; the useful detail is which people, settings and levels of structure make contact feel worthwhile.",
    middle: "Your social energy may be fairly context-sensitive. You might enjoy contact in some settings and prefer protected or solitary time in others, with familiarity, purpose, group size and energy changing the balance.",
    low: "You may prefer quieter routes into activity, more protected focus or a smaller circle of contact. A lower score is not a lack of warmth or social skill; it may describe where your attention and energy are most comfortable.",
  },
  {
    id: "A",
    name: "Agreeableness",
    plain: "cooperation, empathy and interpersonal accommodation",
    colour: "#7b9e78",
    high: "You may place a lot of weight on cooperation, empathy and keeping relationships workable. That can support trust and repair; it may also be worth watching whether your own preferences become hard to hear when harmony matters.",
    middle: "You may move between cooperation and directness depending on the relationship, stakes and how safe disagreement feels. Context may matter more than a single interpersonal style.",
    low: "You may prioritise candour, independence, standards or clear disagreement over smoothing every interaction. That can protect honesty; it helps to make the intention and care behind directness visible when the stakes are relational.",
  },
  {
    id: "C",
    name: "Conscientiousness",
    plain: "planning, follow-through and organised effort",
    colour: "#b48a48",
    high: "You may prefer plans, order, reliability and a visible sense of completion. Structure can make effort easier to trust; leave room for recovery and revision so organisation does not become a demand to control every variable.",
    middle: "You may be organised when the task feels meaningful or the structure is clear, while staying flexible in other settings. The practical question is which cues help you start, continue and finish.",
    low: "You may work more responsively, flexibly or through bursts rather than relying on fixed routines. External checkpoints, visible next actions or a lighter planning system may help when follow-through matters without turning you into a different person.",
  },
  {
    id: "N",
    name: "Neuroticism",
    plain: "emotional reactivity and stress sensitivity",
    colour: "#9b6e87",
    high: "You may notice worry, upset, tension or mood shifts more readily, especially when stakes are high or situations feel uncertain. That is a reactivity signal, not a weakness or diagnosis; predictable support and recovery time may help keep the signal from making every decision for you.",
    middle: "Your emotional reactivity may vary with context. You may settle relatively well in some situations and become more affected by uncertainty, fatigue, conflict or evaluation in others.",
    low: "You may tend to remain relatively even or recover from everyday stress more readily on this questionnaire. That does not mean you never struggle; it may mean distress is more specific, delayed or less visible from the outside.",
  },
  {
    id: "O",
    name: "Openness to experience",
    plain: "curiosity, imagination and interest in complexity",
    colour: "#6c8fa6",
    high: "You may be drawn to ideas, imagination, novelty, art or complexity, and enjoy making connections across subjects. Concrete anchors, a usable purpose or time to translate ideas into action can help exploration become something you can return to.",
    middle: "You may be curious in some domains while preferring familiar, practical routes in others. What counts as interesting may depend on relevance, trust, energy and whether the new thing has a clear way in.",
    low: "You may prefer familiar, practical or concrete routes and value what has already proved useful. A lower score is not a lack of intelligence or curiosity; it may describe the kinds of novelty and explanation that feel most usable.",
  },
];

/* This is one consistent 50-item form. The wording follows the supplied
 * Big Five questionnaire. Neuroticism is keyed in the conventional direction
 * so stress-reactive statements raise the score and calm statements lower it. */
const ITEMS = [
  [1, "E", false, "Am the life of the party."],
  [2, "A", true, "Feel little concern for others."],
  [3, "C", false, "Am always prepared."],
  [4, "N", false, "Get stressed out easily."],
  [5, "O", false, "Have a rich vocabulary."],
  [6, "E", true, "Don't talk a lot."],
  [7, "A", false, "Am interested in people."],
  [8, "C", true, "Leave my belongings around."],
  [9, "N", true, "Am relaxed most of the time."],
  [10, "O", true, "Have difficulty understanding abstract ideas."],
  [11, "E", false, "Feel comfortable around people."],
  [12, "A", true, "Insult people."],
  [13, "C", false, "Pay attention to details."],
  [14, "N", false, "Worry about things."],
  [15, "O", false, "Have a vivid imagination."],
  [16, "E", true, "Keep in the background."],
  [17, "A", false, "Sympathize with others' feelings."],
  [18, "C", true, "Make a mess of things."],
  [19, "N", true, "Seldom feel blue."],
  [20, "O", true, "Am not interested in abstract ideas."],
  [21, "E", false, "Start conversations."],
  [22, "A", true, "Am not interested in other people's problems."],
  [23, "C", false, "Get chores done right away."],
  [24, "N", false, "Am easily disturbed."],
  [25, "O", false, "Have excellent ideas."],
  [26, "E", true, "Have little to say."],
  [27, "A", false, "Have a soft heart."],
  [28, "C", true, "Often forget to put things back in their proper place."],
  [29, "N", false, "Get upset easily."],
  [30, "O", true, "Do not have a good imagination."],
  [31, "E", false, "Talk to a lot of different people at parties."],
  [32, "A", true, "Am not really interested in others."],
  [33, "C", false, "Like order."],
  [34, "N", false, "Change my mood a lot."],
  [35, "O", false, "Am quick to understand things."],
  [36, "E", true, "Don't like to draw attention to myself."],
  [37, "A", false, "Take time out for others."],
  [38, "C", true, "Shirk my duties."],
  [39, "N", false, "Have frequent mood swings."],
  [40, "O", false, "Use difficult words."],
  [41, "E", false, "Don't mind being the center of attention."],
  [42, "A", false, "Feel others' emotions."],
  [43, "C", false, "Follow a schedule."],
  [44, "N", false, "Get irritated easily."],
  [45, "O", false, "Spend time reflecting on things."],
  [46, "E", true, "Am quiet around strangers."],
  [47, "A", false, "Make people feel at ease."],
  [48, "C", false, "Am exacting in my work."],
  [49, "N", false, "Often feel blue."],
  [50, "O", false, "Am full of ideas."],
].map(([number, trait, reverse, text]) => ({ number, trait, reverse, text }));

const state = {
  page: "intro",
  section: 0,
  answers: Array(ITEMS.length).fill(null),
};

const traitFor = (id) => TRAITS.find((trait) => trait.id === id);
const itemsFor = (traitId) => ITEMS.filter((item) => item.trait === traitId);
const displayText = (text) => `I ${text.charAt(0).toLowerCase()}${text.slice(1)}`;

function resetState() {
  state.page = "intro";
  state.section = 0;
  state.answers = Array(ITEMS.length).fill(null);
}

function answeredCount(items) {
  return items.filter((item) => Number.isFinite(state.answers[item.number - 1])).length;
}

function questionnaireHeader(eyebrow, title, lead) {
  return `<div class="section-title"><p class="eyebrow">${esc(eyebrow)}</p><h1>${title}</h1><p class="lead">${esc(lead)}</p></div>`;
}

export function renderQuestionnaires(root) {
  root.innerHTML = `<div class="wrap questionnaires-page">
    ${questionnaireHeader("Understand yourself", "Questionnaires.", "Three different ways to notice patterns without turning a person into a fixed type.")}
    <section class="questionnaire-notice" aria-label="How to use these questionnaires">
      <strong>Use these as starting points, not verdicts.</strong>
      <span>They are for reflection and education. None of these questionnaires is a clinical assessment, diagnosis or substitute for professional support.</span>
    </section>
    <section class="questionnaire-grid" aria-label="Available questionnaires">
      <article class="questionnaire-card questionnaire-card-main">
        <div class="questionnaire-card-top"><span class="questionnaire-number">01</span><span class="questionnaire-meta">100 situation choices · 15–20 min</span></div>
        <p class="eyebrow">Nobody’s Simple original</p>
        <h2>Nobody’s Simple Personality Test</h2>
        <p>A longer, situation-based exploration that turns your choices into a practical, context-sensitive guide for relationships, work, decisions, regulation and growth.</p>
        <p class="questionnaire-caution"><b>Important:</b> This is an experimental reflective tool. It is not clinical, it does not diagnose anything and it has not been proven as a psychometric test.</p>
        <a class="button" href="#personality">Open Nobody’s Simple Personality Test ↗</a>
      </article>
      <article class="questionnaire-card questionnaire-card-big-five">
        <div class="questionnaire-card-top"><span class="questionnaire-number">02</span><span class="questionnaire-meta">50 statements · 8–12 min</span></div>
        <p class="eyebrow">Five broad dimensions</p>
        <h2>Big Five Personality Questionnaire</h2>
        <p>Rate short statements about how you generally tend to be. You’ll get a raw-score graph across Extraversion, Agreeableness, Conscientiousness, Neuroticism and Openness.</p>
        <p class="questionnaire-caution"><b>Important:</b> This browser version is an educational self-reflection. It is not clinical, diagnostic or a proven psychometric test, and the scores are not population percentiles.</p>
        <a class="button secondary" href="#big-five">Start the Big Five questionnaire ↗</a>
      </article>
      <article class="questionnaire-card questionnaire-card-systems">
        <div class="questionnaire-card-top"><span class="questionnaire-number">03</span><span class="questionnaire-meta">30 statements · 10–15 min</span></div>
        <p class="eyebrow">Nobody’s Simple systems map</p>
        <h2>How big are your systems?</h2>
        <p>Adjust your first visual estimate, then answer ten questions about each of Drive, Soothing and Threat. Compare the two maps and explore what to try when the systems are balanced, uneven or pulling against each other.</p>
        <p class="questionnaire-caution"><b>Important:</b> This is a reflective model of current prominence, not an objective measure of your worth, a diagnosis or a validated psychometric test.</p>
        <a class="button secondary" href="#systems" data-systems-entry>Map my systems ↗</a>
      </article>
    </section>
    <section class="questionnaire-chooser">
      <div><p class="eyebrow">Which route fits?</p><h2>Choose the amount of detail you want.</h2></div>
      <div class="questionnaire-chooser-grid"><p><b>Want a broad snapshot?</b><br>Try the Big Five for five readable dimensions and a simple graph.</p><p><b>Want a richer map?</b><br>Try the Nobody’s Simple test for more situation-linked interpretation and practical experiments.</p><p><b>Want to understand the current balance?</b><br>Map Drive, Soothing and Threat, then compare your first impression with your answers.</p></div>
    </section>
    <p class="pf-back"><a href="#home">← Back to the main screen</a></p>
  </div>`;
}

function renderBigFiveIntro(root) {
  root.innerHTML = `<div class="wrap questionnaires-page big-five-page">
    <section class="big-five-hero">
      <div class="big-five-hero-copy">
        <p class="eyebrow">Questionnaires · 50 statements</p>
        <h1>Big Five<br><em>personality map.</em></h1>
        <p class="lead">Rate how much each statement sounds like you in general—not only today. At the end, you’ll see a raw score graph and a cautious, plain-language reading of what the pattern might suggest.</p>
        <div class="big-five-facts"><span>5 dimensions</span><span>10 statements each</span><span>About 8–12 minutes</span><span>Results stay in this tab</span></div>
        <button class="button" id="bf-start" type="button">Start the questionnaire <span aria-hidden="true">↗</span></button>
      </div>
      <div class="big-five-orbit" aria-hidden="true"><span class="bf-orbit-core">5</span><i></i><i></i><i></i><i></i><i></i></div>
    </section>
    <section class="big-five-disclaimer" aria-labelledby="bf-disclaimer-title">
      <p class="eyebrow">Please read before starting</p>
      <h2 id="bf-disclaimer-title">A reflection tool, not a test of your worth.</h2>
      <p>This version is based on a supplied 50-item Big Five questionnaire and uses its five broad trait areas. It is not a clinical assessment, diagnosis or treatment tool. It has not been proven as a psychometric test in this app, and the scores are raw responses on this questionnaire—not validated percentiles or predictions of what you will do.</p>
      <p>There are no good or bad profiles. If a result feels wrong, specific situations and lived experience are more important than the graph.</p>
    </section>
    <section class="big-five-how"><div><p class="eyebrow">How it works</p><h2>Five pages, one dimension at a time.</h2></div><ol>${TRAITS.map((trait, index) => `<li><span style="--bf-colour:${trait.colour}">${String(index + 1).padStart(2, "0")}</span><div><b>${esc(trait.name)}</b><small>${esc(trait.plain)}</small></div></li>`).join("")}</ol></section>
    <div class="big-five-backlinks"><a href="#questionnaires">← Back to questionnaires</a><a href="#home">Back to main screen</a></div>
  </div>`;
  root.querySelector("#bf-start").addEventListener("click", () => {
    state.page = "questions";
    state.section = 0;
    renderBigFiveView(root);
  });
}

function renderScale(item) {
  const selected = state.answers[item.number - 1];
  return `<fieldset class="bf-item"><legend><span class="bf-item-number">${String(item.number).padStart(2, "0")}</span><span>${esc(displayText(item.text))}</span></legend><div class="bf-scale" role="radiogroup" aria-label="Rate statement ${item.number}">${SCALE.map(([value, label]) => `<label class="bf-scale-option"><input type="radio" name="bf-${item.number}" value="${value}" data-bf-index="${item.number - 1}" ${selected === value ? "checked" : ""}><span><b>${value}</b><small>${esc(label)}</small></span></label>`).join("")}</div></fieldset>`;
}

function renderBigFiveQuestions(root) {
  const trait = TRAITS[state.section];
  const items = itemsFor(trait.id);
  const answered = answeredCount(items);
  const totalAnswered = state.answers.filter((value) => Number.isFinite(value)).length;
  root.innerHTML = `<div class="wrap questionnaires-page big-five-page">
    <section class="bf-question-header"><div><p class="eyebrow">Big Five questionnaire · section ${state.section + 1} of ${TRAITS.length}</p><h1>${esc(trait.name)}.</h1><p class="lead">${esc(trait.plain.charAt(0).toUpperCase() + trait.plain.slice(1))}. Think about your general pattern across time and situations.</p></div><div class="bf-progress-stat"><strong>${totalAnswered} / ${ITEMS.length}</strong><span>answered overall</span></div></section>
    <div class="bf-progress-bar" aria-label="Questionnaire progress"><i style="width:${(totalAnswered / ITEMS.length) * 100}%"></i></div>
    <section class="bf-question-panel" style="--bf-section-colour:${trait.colour}">
      <div class="bf-question-panel-top"><p>How much do these sound like you?</p><span>${answered} of ${items.length} answered in this section</span></div>
      <form id="bf-form">${items.map(renderScale).join("")}<p class="bf-form-status" id="bf-status" aria-live="polite"></p><div class="bf-actions">${state.section > 0 ? '<button class="button secondary" type="button" id="bf-back">← Previous</button>' : '<a class="button secondary" href="#questionnaires">Exit questionnaire</a>'}<button class="button" type="submit">${state.section === TRAITS.length - 1 ? "See my results" : `Next: ${esc(TRAITS[state.section + 1].name)} →`}</button></div></form>
    </section>
    <p class="bf-small-print">Choose the closest answer; there is no correct response. If you are unsure, use the middle option rather than trying to guess what a “good” answer should be.</p>
  </div>`;
  root.querySelectorAll("[data-bf-index]").forEach((input) => input.addEventListener("change", () => {
    state.answers[Number(input.dataset.bfIndex)] = Number(input.value);
    const nextAnswered = answeredCount(items);
    const counter = root.querySelector(".bf-question-panel-top span");
    if (counter) counter.textContent = `${nextAnswered} of ${items.length} answered in this section`;
    const overall = root.querySelector(".bf-progress-stat strong");
    const progress = root.querySelector(".bf-progress-bar i");
    const count = state.answers.filter((value) => Number.isFinite(value)).length;
    if (overall) overall.textContent = `${count} / ${ITEMS.length}`;
    if (progress) progress.style.width = `${(count / ITEMS.length) * 100}%`;
  }));
  root.querySelector("#bf-back")?.addEventListener("click", () => {
    state.section = Math.max(0, state.section - 1);
    renderBigFiveView(root);
  });
  root.querySelector("#bf-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const missing = items.filter((item) => !Number.isFinite(state.answers[item.number - 1]));
    if (missing.length) {
      const status = root.querySelector("#bf-status");
      status.textContent = `Choose an answer for ${missing.length === 1 ? "the remaining statement" : `${missing.length} remaining statements`} before continuing.`;
      root.querySelector(`[data-bf-index="${missing[0].number - 1}"]`)?.closest(".bf-item")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (state.section < TRAITS.length - 1) {
      state.section += 1;
      renderBigFiveView(root);
    } else {
      state.page = "results";
      renderBigFiveView(root);
    }
  });
}

function calculateScores() {
  return TRAITS.map((trait) => {
    const items = itemsFor(trait.id);
    const total = items.reduce((sum, item) => {
      const value = Number(state.answers[item.number - 1]);
      return sum + (item.reverse ? 6 - value : value);
    }, 0);
    const score = total - items.length;
    const level = score <= 13 ? "lower" : score >= 27 ? "higher" : "middle";
    return { trait, items, total, score, level, percent: Math.max(0, Math.min(100, (score / 40) * 100)) };
  });
}

function levelLabel(level) {
  return { lower: "Lower on this scale", middle: "Middle range", higher: "Higher on this scale" }[level];
}

function broadShape(scores) {
  const ordered = [...scores].sort((a, b) => b.score - a.score);
  const high = ordered.filter((entry) => entry.level === "higher");
  const low = ordered.filter((entry) => entry.level === "lower");
  if (high.length && low.length) return `Your highest raw score here is ${high[0].trait.name}, while ${low[0].trait.name} is lower on this questionnaire. That is a place to ask better context questions—not a ranking of what is good or bad.`;
  if (high.length) return `${high[0].trait.name} is the clearest higher signal in this response pattern. Notice when that tendency helps, and when the same tendency becomes effortful or costly.`;
  if (low.length) return `${low[0].trait.name} is the clearest lower signal in this response pattern. Lower does not mean missing; it points to a style or preference worth comparing across real situations.`;
  return "Your five scores sit mostly in the middle range on this questionnaire. That may mean your pattern is mixed, context-dependent or not well captured by broad trait labels.";
}

function practicalReading(scores, id) {
  const get = (traitId) => scores.find((entry) => entry.trait.id === traitId);
  const e = get("E").level;
  const a = get("A").level;
  const c = get("C").level;
  const n = get("N").level;
  const o = get("O").level;
  if (id === "work") {
    const social = e === "higher" ? "shared work, discussion or visible collaboration" : e === "lower" ? "protected focus and fewer unnecessary interruptions" : "a mix of contact and protected focus";
    const structure = c === "higher" ? "clear plans and finish lines" : c === "lower" ? "lightweight external checkpoints" : "structure that can flex when priorities change";
    const novelty = o === "higher" ? "with room for ideas or variation" : o === "lower" ? "with concrete examples and a usable purpose" : "with a balance of familiar and new material";
    return `You might investigate environments with ${social}, ${structure}, and ${novelty}. If stress sensitivity is higher, reduce avoidable ambiguity and build in recovery around evaluation or deadline-heavy work.`;
  }
  if (id === "relationships") {
    const connection = e === "higher" ? "regular contact and shared activity" : e === "lower" ? "space, depth and lower-pressure contact" : "contact that can expand or contract with energy";
    const repair = a === "higher" ? "Make room for your own preferences as well as other people’s needs." : a === "lower" ? "Make directness legible as care when the relationship is important." : "Notice when cooperation and candour pull in different directions.";
    const uncertainty = n === "higher" ? "Explicit reassurance and clear repair may be especially useful when something is unresolved." : "When something is unresolved, check the facts and the relationship rather than assuming the graph explains the whole moment.";
    return `Connection may work best through ${connection}. ${repair} ${uncertainty}`;
  }
  const recovery = n === "higher" ? "Predictable decompression, lower-stakes transitions and a named next step may help when feelings run high." : n === "lower" ? "You may be able to return to baseline relatively readily, while still taking specific distress seriously." : "Compare what changes your steadiness: uncertainty, conflict, fatigue, novelty or the people involved.";
  const attention = o === "higher" ? "Curiosity may help you reframe or find possibilities." : o === "lower" ? "Concrete routines and familiar anchors may make recovery easier to repeat." : "Use whichever mix of ideas and concrete anchors helps the moment become workable.";
  return `${recovery} ${attention}`;
}

function renderChart(scores) {
  return `<div class="bf-chart" aria-label="Big Five raw score graph"><div class="bf-chart-axis"><span>0</span><span>10</span><span>20</span><span>30</span><span>40</span></div>${scores.map((entry) => `<div class="bf-chart-row"><div class="bf-chart-label"><b>${esc(entry.trait.name)}</b><small>${esc(entry.trait.plain)}</small></div><div class="bf-chart-track"><i style="width:${entry.percent}%;background:${entry.trait.colour}"></i><span style="left:${entry.percent}%" aria-hidden="true"></span></div><strong>${entry.score}<small>/40</small></strong></div>`).join("")}<p class="bf-chart-note">These are raw scores on this questionnaire. They are not percentiles and are not compared with a population sample.</p></div>`;
}

function renderBigFiveResults(root) {
  const scores = calculateScores();
  root.innerHTML = `<div class="wrap questionnaires-page big-five-page bf-results-page">
    <section class="bf-results-hero"><div><p class="eyebrow">Big Five questionnaire · results</p><h1>Your broad<br><em>pattern map.</em></h1><p class="lead">${esc(broadShape(scores))}</p></div><div class="bf-results-seal" aria-hidden="true"><span>5</span><small>dimensions</small></div></section>
    <section class="bf-results-card bf-graph-card"><div class="bf-results-card-head"><div><p class="eyebrow">Raw score graph</p><h2>Five dimensions, held lightly.</h2></div><p>Higher or lower is not better. The useful part is what changes the pattern in real life.</p></div>${renderChart(scores)}</section>
    <section class="bf-score-grid">${scores.map((entry) => `<article class="bf-score-card" style="--bf-card-colour:${entry.trait.colour}"><div class="bf-score-card-top"><span>${esc(entry.trait.name)}</span><strong>${entry.score}<small>/40</small></strong></div><p class="bf-score-band">${levelLabel(entry.level)}</p><div class="bf-mini-track"><i style="width:${entry.percent}%"></i></div><h3>What it might suggest</h3><p>${esc(entry.trait[entry.level])}</p></article>`).join("")}</section>
    <section class="bf-practical-section"><div class="bf-results-card-head"><div><p class="eyebrow">Bring it back to life</p><h2>Possible uses for this map.</h2></div><p>These are prompts to test against your own experience, not predictions about you.</p></div><div class="bf-practical-grid"><article><span>01</span><h3>Work and study</h3><p>${esc(practicalReading(scores, "work"))}</p></article><article><span>02</span><h3>Relationships</h3><p>${esc(practicalReading(scores, "relationships"))}</p></article><article><span>03</span><h3>Recovery and regulation</h3><p>${esc(practicalReading(scores, "recovery"))}</p></article></div></section>
    <section class="bf-reflection-card"><p class="eyebrow">Keep the result open</p><h2>Three questions worth asking next.</h2><ul><li>Which score feels recognisable, and which feels too simple?</li><li>When does the pattern change with tiredness, safety, sensory load, role or relationship?</li><li>What small change would let a useful tendency help without becoming a demand?</li></ul><p class="bf-result-caution"><b>Remember:</b> this is a non-clinical, non-diagnostic reflection. It has not been proven as a psychometric test in this app. Your lived experience is more important than the graph.</p></section>
    <details class="bf-scoring-details"><summary>How the scores were worked out</summary><div><p>Each dimension has ten statements rated from 1 to 5. Reverse-keyed statements are flipped before the ten adjusted responses are combined into a 0–40 raw score. The graph uses the conventional direction for Neuroticism: higher means more emotional reactivity/stress sensitivity on these statements.</p><p>This scoring does not create a clinical measure, percentile, diagnosis or prediction. It only makes your answers easier to inspect and discuss.</p></div></details>
    <div class="big-five-backlinks"><button class="button" type="button" id="bf-print">Print / save as PDF</button><button class="button secondary" type="button" id="bf-restart">Take it again</button><a href="#questionnaires">Back to questionnaires</a></div>
  </div>`;
  root.querySelector("#bf-print").addEventListener("click", () => window.print());
  root.querySelector("#bf-restart").addEventListener("click", () => {
    resetState();
    renderBigFiveView(root);
  });
}

function renderBigFiveView(root) {
  if (state.page === "questions") renderBigFiveQuestions(root);
  else if (state.page === "results") renderBigFiveResults(root);
  else renderBigFiveIntro(root);
}

export function renderBigFive(root) {
  resetState();
  renderBigFiveView(root);
}


const systemsQuestionnaire = (() => {

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

const RAW_ITEMS = [
  ["drive", "I feel pulled towards a goal, improvement or next achievement."],
  ["drive", "Making progress gives me energy or relief."],
  ["drive", "I can turn a vague ambition into something I want to pursue."],
  ["drive", "I notice opportunities to learn, win, build or master something."],
  ["drive", "Finishing or completing something feels especially satisfying."],
  ["drive", "I become restless when there is no direction or challenge."],
  ["drive", "When there is a goal available, I can leave it alone without feeling pulled to pursue it."],
  ["drive", "I can keep moving towards something even when it is difficult."],
  ["drive", "A meaningful future feels emotionally vivid to me."],
  ["drive", "I can leave a promising opportunity alone without feeling pulled to act on it."],
  ["soothing", "I can let myself rest without first proving that I deserve it."],
  ["soothing", "Warmth, care or familiar connection helps me settle."],
  ["soothing", "I can notice that something is enough for now."],
  ["soothing", "My body can sometimes shift out of high alert."],
  ["soothing", "I can receive help without immediately needing to repay it."],
  ["soothing", "There are places, people or routines where I feel held or grounded."],
  ["soothing", "I can be kind to myself when I make a mistake."],
  ["soothing", "Pleasure, play or comfort can reach me even during a hard period."],
  ["soothing", "Rest is difficult to access, even when I have time for it."],
  ["soothing", "Even with support around me, settling often feels out of reach."],
  ["threat", "I scan for what could go wrong, be lost or become unsafe."],
  ["threat", "Uncertainty quickly creates urgency in me."],
  ["threat", "I replay mistakes, conversations or possible future problems."],
  ["threat", "I become watchful for rejection, criticism or signs that I have failed."],
  ["threat", "My body reacts as if something needs dealing with immediately."],
  ["threat", "I use avoidance, checking, control or reassurance to reduce alarm."],
  ["threat", "I can let a mistake be information without using it to attack myself."],
  ["threat", "It is difficult to relax while an unresolved problem remains."],
  ["threat", "I can notice a possible problem and return my attention to what is happening now."],
  ["threat", "I can become defensive, withdrawn or ready to escape when pressured."],
];

const REVERSE_ITEMS = new Set([7, 10, 19, 20, 27, 29]);
const ITEMS = RAW_ITEMS.map(function (item, index) {
  return { number: index + 1, system: item[0], text: item[1], reverse: REVERSE_ITEMS.has(index + 1) };
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
  const total = items.reduce((sum, item) => {
    const value = Number(state.answers[item.number - 1]);
    const adjusted = item.reverse ? 6 - value : value;
    return sum + (Number.isFinite(adjusted) ? adjusted : 0);
  }, 0);
  return Math.max(0, Math.min(100, Math.round(((total - items.length) / (items.length * 4)) * 100)));
}

function allScores() {
  return SYSTEMS.map((system) => {
    const raw = itemsFor(system.id).map((item) => Number(state.answers[item.number - 1])).filter(Number.isFinite);
    return { system, score: scoreFor(system.id), estimate: state.estimates[system.id], responseSpread: raw.length ? Math.max(...raw) - Math.min(...raw) : 0, responseValues: raw };
  });
}

function responseCheck(scores) {
  const all = scores.flatMap((entry) => entry.responseValues);
  const unique = new Set(all).size;
  const lowVariation = scores.filter((entry) => entry.responseSpread < 2).map((entry) => entry.system.name);
  if (unique <= 2 || lowVariation.length === scores.length) {
    return { title: "Read this map as provisional", text: "Your answers were very consistent across the items. That can be genuine, but it leaves less room for the questionnaire to distinguish the systems; compare this map with specific situations and your first impression rather than treating the percentages as precise." };
  }
  if (lowVariation.length) {
    return { title: "Some parts of the map are less differentiated", text: lowVariation.join(" and ") + " had little variation across its items. Treat that part as a broad signal and use the idea bank as options to test, not conclusions." };
  }
  return { title: "The answers give a reasonably varied map", text: "There was enough variation across the responses to make the comparison useful as a reflective starting point. It is still not a validated scale or an objective measure of system size." };
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
  root.innerHTML = pageFrame("Nobody’s Simple · 3 circles", "How big are your systems right now?", "Use this when you want a current map of what gets loud, what is easier to access and where your first impression may differ from your answers.", "<section class='systems-hero'><div class='systems-hero-copy'><p class='eyebrow'>A visual systems questionnaire</p><h2>Start with the map you already carry.</h2><p>These circles are the Drive, Soothing and Threat systems from the three-circles emotional regulation model. Your first map is not a score; it is your expectation. The questionnaire then gives you a separate, response-derived estimate to compare with it.</p><p>Answer about the last month across more than one setting, rather than only your best day or one crisis. The result is for noticing patterns and choosing experiments, not for deciding what you are.</p><p class='systems-note'><b>Important:</b> This is an educational reflective tool. “Bigger” means more prominent or easier to recruit in these answers, not better, healthier or objectively true. It is not a measure of actual neurological system size.</p></div><div class='systems-mini-map' aria-label='Three systems visual estimate'>" + circles + "</div></section><section class='systems-how'><div><p class='eyebrow'>How it works</p><h2>Estimate → answer → compare.</h2></div><ol><li><b>01 · Your estimate</b><span>Adjust the circles until they look like your current sense of the systems.</span></li><li><b>02 · 30 questions</b><span>Answer ten questions about each system across the last month. A few are worded in the opposite direction to reduce automatic agreement.</span></li><li><b>03 · Your map</b><span>See balance, mismatches, conflicts and a large bank of possible experiments.</span></li></ol></section><div class='systems-actions'><button type='button' class='button' id='systems-start'>Start the 30 questions →</button><a class='button secondary' href='#questionnaires'>Not now</a></div><p class='systems-small-print'>No system is a permanent identity. The same person can have a different map in a different context, body state or season of life.</p>", "");
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
  const check = responseCheck(scores);
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
  root.innerHTML = pageFrame("Results · your Human Map", "Three systems, one living map.", "Compare the map you expected with the map your answers produced. The useful question is what to try next, not which system is the real you.", "<section class='systems-results-banner'><div><p class='eyebrow'>Overall pattern</p><h2>" + esc(pattern.title) + "</h2><p>" + esc(pattern.text) + "</p></div><div class='systems-result-stamp' aria-hidden='true'><span>MAP</span><b>not a verdict</b></div></section><section class='systems-response-check'><div><p class='eyebrow'>Response check</p><h2>" + esc(check.title) + "</h2></div><p>" + esc(check.text) + "</p></section><section class='systems-results-map'><div class='systems-results-heading'><div><p class='eyebrow'>Questionnaire-derived map</p><h2>What is prominent in the answers?</h2></div><p>The faint ring shows your estimate. The solid circle shows the response-derived estimate.</p></div><div class='systems-results-grid'>" + scoreCards + "</div></section><section class='systems-comparison'><div class='systems-results-heading'><div><p class='eyebrow'>Before → after</p><h2>Where did your map disagree with itself?</h2></div><p>Differences can happen because a system is automatic, context-specific, recently intense or difficult to notice from inside.</p></div>" + comparison + "</section><section class='systems-conflicts'><div class='systems-results-heading'><div><p class='eyebrow'>When systems pull against each other</p><h2>Possible tensions in the map.</h2></div><p>These are hypotheses to test against experience, not labels to accept.</p></div>" + conflictMarkup + "</section><section class='systems-recommendations'><div class='systems-results-heading'><div><p class='eyebrow'>What you could try</p><h2>Start with a few routes.</h2></div><p>These suggestions come from the systems that are most prominent here. Open the full idea bank below for more options.</p></div><div class='systems-recommendation-grid'>" + primaryRecommendations + "</div></section><details class='systems-bank'><summary>Browse the full systems idea bank</summary><div>" + bankMarkup + "</div></details><section class='systems-result-note'><p><b>Keep the map open.</b> A system can be large because it is well-supported, over-recruited, protective, practised or responding to the current environment. Repeat the questionnaire after a meaningful change if you want to compare maps.</p><p>Some statements are scored in the opposite direction to reduce a simple “agree with everything” effect. That improves the questionnaire’s balance, but it does not make the tool a validated psychometric measure.</p><p>This is Nobody’s Simple’s educational questionnaire. It is not clinical, diagnostic or a validated psychometric measure.</p></section><div class='systems-result-actions'><button class='button' type='button' id='systems-print'>Print / save as PDF</button><button class='button secondary' type='button' id='systems-download'>Download map</button><button class='button secondary' type='button' id='systems-restart'>Make a new map</button><a class='button secondary' href='#questionnaires'>Back to questionnaires</a></div>", "");
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

function renderSystemsQuestionnaire(root) {
  resetState();
  renderView(root);
}

  return { renderSystemsQuestionnaire };
})();

export function renderSystemsQuestionnaire(root) {
  return systemsQuestionnaire.renderSystemsQuestionnaire(root);
}

