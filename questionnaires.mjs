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
    ${questionnaireHeader("Understand yourself", "Questionnaires.", "Two different ways to notice patterns without turning a person into a fixed type.")}
    <section class="questionnaire-notice" aria-label="How to use these questionnaires">
      <strong>Use these as starting points, not verdicts.</strong>
      <span>They are for reflection and education. Neither questionnaire is a clinical assessment, diagnosis or substitute for professional support.</span>
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
    </section>
    <section class="questionnaire-chooser">
      <div><p class="eyebrow">Which route fits?</p><h2>Choose the amount of detail you want.</h2></div>
      <div class="questionnaire-chooser-grid"><p><b>Want a broad snapshot?</b><br>Try the Big Five for five readable dimensions and a simple graph.</p><p><b>Want a richer map?</b><br>Try the Nobody’s Simple test for more situation-linked interpretation and practical experiments.</p></div>
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
