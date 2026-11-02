import { escapeHTML as esc } from "./core.mjs";
import { ATLAS, CONTEXTS, GOALS, position, makeManual, sourceLinks } from "./big-five-atlas.mjs";
import { buildProfile, profileSources } from "./big-five-profile.mjs";

const SCALE = [
  [1, "Very inaccurate"],
  [2, "Mostly inaccurate"],
  [3, "Neither accurate nor inaccurate"],
  [4, "Mostly accurate"],
  [5, "Very accurate"],
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
  chapter: "E",
  notes: {},
  contexts: {},
  goals: [],
  experiment: "",
  review: "",
  reflections: {},
  example: {},
  lens: 'relationships',
  profileVotes: {},
  lensVotes: {},
  lensNotes: {},
};

const traitFor = (id) => TRAITS.find((trait) => trait.id === id);
const itemsFor = (traitId) => ITEMS.filter((item) => item.trait === traitId);
const displayText = (text) => `I ${text.charAt(0).toLowerCase()}${text.slice(1)}`;

function resetState() {
  state.page = "intro";
  state.section = 0;
  state.answers = Array(ITEMS.length).fill(null);
  state.chapter = "E";
  state.notes = {};
  state.contexts = {};
  state.goals = [];
  state.experiment = "";
  state.review = "";
  state.reflections = {};
  state.example = {};
  state.lens = 'relationships';
  state.profileVotes = {};
  state.lensVotes = {};
  state.lensNotes = {};
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
        <p>Rate short IPIP statements, then explore an interactive personality atlas: five dimensions, real-life contexts, chosen goals and practical experiments.</p>
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
      <div class="questionnaire-chooser-grid"><p><b>Want a researched five-dimension map?</b><br>Try the Big Five and explore the optional interactive atlas.</p><p><b>Prefer situation choices?</b><br>Try the Nobody’s Simple test for a different, original reflective route.</p><p><b>Want to understand the current balance?</b><br>Map Drive, Soothing and Threat, then compare your first impression with your answers.</p></div>
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
        <p class="lead">Rate how accurately each statement describes you in general. Your results open into a personal field guide you can explore at your own pace.</p>
        <div class="big-five-facts"><span>5 dimensions</span><span>10 statements each</span><span>About 8–12 minutes</span><span>Results stay in this tab</span></div>
        <button class="button" id="bf-start" type="button">Start the questionnaire <span aria-hidden="true">↗</span></button>
        ${safeStorage.read() ? '<button class="button secondary" id="bf-restore" type="button">Open saved atlas</button>' : ''}
      </div>
      <div class="big-five-orbit" aria-hidden="true"><span class="bf-orbit-core">5</span><i></i><i></i><i></i><i></i><i></i></div>
    </section>
    <section class="big-five-disclaimer" aria-labelledby="bf-disclaimer-title">
      <p class="eyebrow">Please read before starting</p>
      <h2 id="bf-disclaimer-title">A reflection tool, not a test of your worth.</h2>
      <p>These are the public-domain IPIP 50-item Big Five markers. The app scores the five broad dimensions, but this implementation has no local validation or suitable population norms. The graph shows scale positions, not percentiles, facet scores, diagnoses or predictions. Optional reflections add your own context without changing the questionnaire scores.</p>
      <p>There are no good or bad profiles. If a result feels wrong, specific situations and lived experience are more important than the graph.</p>
    </section>
    <section class="big-five-how"><div><p class="eyebrow">How it works</p><h2>Five pages, then your atlas.</h2><p>The statements are grouped by dimension for easier navigation. This changes the presentation from the interleaved IPIP sample format, which could affect response patterns; interpret the results cautiously.</p></div><ol>${TRAITS.map((trait, index) => `<li><span style="--bf-colour:${trait.colour}">${String(index + 1).padStart(2, "0")}</span><div><b>${esc(trait.name)}</b><small>${esc(trait.plain)}</small></div></li>`).join("")}</ol></section>
    <div class="big-five-backlinks"><a href="#questionnaires">← Back to questionnaires</a><a href="#home">Back to main screen</a></div>
  </div>`;
  root.querySelector("#bf-start").addEventListener("click", () => {
    state.page = "questions";
    state.section = 0;
    renderBigFiveView(root);
  });
  root.querySelector("#bf-restore")?.addEventListener("click", () => {
    const saved=safeStorage.read();
    if (!saved || !Array.isArray(saved.answers) || saved.answers.length!==ITEMS.length || !saved.answers.every(v=>Number.isInteger(v)&&v>=1&&v<=5)) return;
    state.answers=[...saved.answers];
    state.notes=Object.fromEntries(Object.entries(saved.notes||{}).filter(([key,value])=>ATLAS[key]&&typeof value==='string').map(([key,value])=>[key,value.slice(0,500)]));
    state.contexts=Object.fromEntries(Object.entries(saved.contexts||{}).filter(([key,value])=>typeof key==='string'&&typeof value==='string').slice(0,100));
    state.goals=Array.isArray(saved.goals)?GOALS.filter(g=>saved.goals.includes(g.id)).map(g=>g.id):[];
    state.experiment=typeof saved.experiment==='string'?saved.experiment.slice(0,700):'';
    state.review=typeof saved.review==='string'?saved.review.slice(0,700):'';
    state.reflections=Object.fromEntries(Object.entries(saved.reflections||{}).filter(([key,value])=>ATLAS[key]&&['fits','sometimes','no'].includes(value)));
    state.example=Object.fromEntries(Object.entries(saved.example||{}).filter(([key,value])=>ATLAS[key]&&ATLAS[key].choices.includes(value)));
    state.contextTrait=ATLAS[saved.contextTrait]?saved.contextTrait:'E';
    state.lens=['relationships','work','decisions','stress','motivation','roles'].includes(saved.lens)?saved.lens:'relationships';
    state.profileVotes=Object.fromEntries(Object.entries(saved.profileVotes||{}).filter(([k,v])=>/^(EA|EC|EN|EO|AC|AN|AO|CN|CO|NO|item-\d+-\d+)$/.test(k)&&['fits','sometimes','no'].includes(v)));
    state.lensVotes=Object.fromEntries(Object.entries(saved.lensVotes||{}).filter(([k,v])=>['relationships','work','decisions','stress','motivation','roles'].includes(k)&&['fits','sometimes','no'].includes(v)));
    state.lensNotes=Object.fromEntries(Object.entries(saved.lensNotes||{}).filter(([k,v])=>['relationships','work','decisions','stress','motivation','roles'].includes(k)&&typeof v==='string').map(([k,v])=>[k,v.slice(0,700)]));
    state.page='results';renderBigFiveView(root);
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

export function scoreBigFiveAnswers(answers) {
  if (!Array.isArray(answers) || answers.length!==ITEMS.length || !answers.every(value=>Number.isInteger(value)&&value>=1&&value<=5)) throw new Error('Complete all 50 answers before scoring.');
  return TRAITS.map((trait) => {
    const items = itemsFor(trait.id);
    const total = items.reduce((sum, item) => {
      const value = answers[item.number - 1];
      return sum + (item.reverse ? 6 - value : value);
    }, 0);
    const score = total - items.length;
    const level = score <= 14 ? "lower" : score >= 26 ? "higher" : "middle";
    return { trait, items, total, score, level, percent: Math.max(0, Math.min(100, (score / 40) * 100)) };
  });
}
const calculateScores=()=>scoreBigFiveAnswers(state.answers);

function broadShape(scores) {
  const order = [...scores].sort((a,b)=>Math.abs(b.score-20)-Math.abs(a.score-20));
  const first = order[0];
  return Math.abs(first.score-20)<3 ? 'Your responses stayed close to the scale midpoints. Open a chapter to explore where the statements fit and where they miss important context.' : `Your clearest departure from the response midpoint in this set is ${first.trait.name}. That is a feature of these answers, not a comparison with other people. Open a chapter and tell the atlas where it fits or does not.`;
}

function practicalReading(scores, id) {
  const find = (key) => position(scores.find(s=>s.trait.id===key).score);
  const e=find('E'), a=find('A'), c=find('C'), n=find('N'), o=find('O');
  if (id==='work') return `${e==='toward'?'Discussion may help you start':e==='away'?'Protected focus may help you start':'Try alternating contact and quiet focus'}. ${c==='toward'?'A clear stopping point may protect recovery':c==='away'?'A visible two-minute first step may reduce friction':'Test whether planning or starting is your main bottleneck'}. ${o==='toward'?'Give new ideas a time limit and output':o==='away'?'Ask for concrete examples of unfamiliar approaches':'Choose when exploration is useful'}.`;
  if (id==='relationships') return `${a==='toward'?'Pause before agreeing to a request':a==='away'?'Make the care behind a direct view visible':'Compare when to cooperate and when to disagree'}. ${e==='away'?'Name the sort of contact that works for you':e==='toward'?'Protect time for both connection and rest':'Notice which people and settings change your social energy'}. ${n==='toward'?'When unsure, ask a specific clarifying question instead of reading a delay as a verdict':'Check what is actually known before interpreting an ambiguous moment'}.`;
  if (id==='stress') return `${n==='toward'?'Plan a predictable pause and separate facts from predictions':n==='away'?'Notice quieter strain signs such as fatigue':'Notice which stressors change your response'}. ${c==='toward'?'Loosen one unnecessary standard when the load rises':c==='away'?'Use a small external cue for the next action':'Choose just enough structure for the situation'}.`;
  return `${o==='toward'?'Novel ideas can engage you, but set a testable output':o==='away'?'Ground new tasks in a concrete purpose':'Pair curiosity with a workable next step'}. ${e==='toward'?'Some goals may move with company':e==='away'?'Some goals may move better in quiet':'Test whether company or quiet helps this goal'}. Let the goal you actually chose guide the strategy.`;
}

function renderChart(scores) {
  return `<div class="bf-chart" aria-label="Big Five raw score graph"><div class="bf-chart-axis"><span>0</span><span>10</span><span>20</span><span>30</span><span>40</span></div>${scores.map((entry) => `<div class="bf-chart-row"><div class="bf-chart-label"><b>${esc(entry.trait.name)}</b><small>${esc(entry.trait.plain)}</small></div><div class="bf-chart-track"><i style="width:${entry.percent}%;background:${entry.trait.colour}"></i><span style="left:${entry.percent}%" aria-hidden="true"></span></div><strong>${entry.score}<small>/40</small></strong></div>`).join("")}<p class="bf-chart-note">These are raw scores on this questionnaire. They are not percentiles and are not compared with a population sample.</p></div>`;
}

const SAVED_ATLAS = 'ns-big-five-atlas-v1';
const safeStorage = {read(){try{return JSON.parse(localStorage.getItem(SAVED_ATLAS)||'null');}catch{return null;}},write(value){try{localStorage.setItem(SAVED_ATLAS,JSON.stringify(value));return true;}catch{return false;}},remove(){try{localStorage.removeItem(SAVED_ATLAS);}catch{}}};

function chapterMarkup(entry){
  const info=ATLAS[entry.trait.id], key=position(entry.score), read=info.poles[key], current=state.reflections[entry.trait.id]||'', response=state.example[entry.trait.id]||'';
  const anchors=entry.items.map(item=>({text:displayText(item.text),raw:state.answers[item.number-1],keyed:item.reverse?6-state.answers[item.number-1]:state.answers[item.number-1]})).sort((a,b)=>Math.abs(b.keyed-3)-Math.abs(a.keyed-3)).slice(0,2);
  return `<div class="bf-atlas-chapter" style="--bf-card-colour:${entry.trait.colour}">
    <div class="bf-atlas-chapter-intro"><span class="bf-atlas-icon" aria-hidden="true">${info.icon}</span><div><p class="eyebrow">One of five broad dimensions</p><h2>${esc(info.title)}</h2><p>${esc(info.question)}</p></div></div>
    <div class="bf-atlas-insight"><p class="eyebrow">What your responses can suggest</p><p>${esc(read.reading)}</p><small>${entry.score}/40 is this scale’s position. It is not a percentile or a facet score.</small></div>
    <div class="bf-atlas-two"><section><h3>When it may help</h3><p>${esc(read.strength)}</p></section><section><h3>When it may cost</h3><p>${esc(read.cost)}</p></section></div>
    <div class="bf-atlas-two"><section><h3>Adjust the conditions</h3><p>${esc(read.fit)}</p></section><section><h3>Practise flexibility</h3><p>${esc(read.practice)}</p><button type="button" class="bf-text-action" data-copy-experiment="${entry.trait.id}">Use as my experiment →</button></section></div>
    <details class="bf-atlas-details"><summary>What is inside this broad dimension?</summary><ul>${info.parts.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p>These are examples of narrower aspects from personality research, not separately measured scores in this IPIP-50 form. The BFI-2 measures its own 15 facets with different items.</p></details>
    <details class="bf-atlas-details"><summary>Which answers contributed most?</summary><p>Two responses furthest from the middle after scoring, shown as your actual choices. One item never defines a person.</p><ul>${anchors.map(x=>`<li>“${esc(x.text)}” — ${esc(SCALE.find(s=>s[0]===x.raw)?.[1]||'')}</li>`).join('')}</ul></details>
    <div class="bf-atlas-scenario"><p class="eyebrow">Optional everyday example · your interpretation</p><h3>${esc(info.scene)}</h3><div class="bf-choice-row">${info.choices.map((x,i)=>`<button type="button" class="bf-choice ${response===x?'is-selected':''}" data-example="${entry.trait.id}" data-choice="${i}" aria-pressed="${response===x}">${esc(x)}</button>`).join('')}</div><p>Your choice is a reflection prompt. It does not recalculate your score.</p></div>
    <div class="bf-atlas-feedback"><p>Does this interpretation fit your experience?</p>${[['fits','That fits'],['sometimes','Only sometimes'],['no','Not really']].map(([v,label])=>`<button class="bf-choice ${current===v?'is-selected':''}" type="button" data-reflection="${entry.trait.id}" data-fit="${v}" aria-pressed="${current===v}">${label}</button>`).join('')}<label for="bf-note-${entry.trait.id}">What would you add or correct?</label><textarea id="bf-note-${entry.trait.id}" data-atlas-note="${entry.trait.id}" maxlength="500" placeholder="For example, I speak up with friends but not in unfamiliar groups…">${esc(state.notes[entry.trait.id]||'')}</textarea></div>
  </div>`;
}

function fitButtons(kind,id,votes){
  return `<div class="bf-profile-votes" aria-label="Does this interpretation fit?">${[['fits','Fits'],['sometimes','Sometimes'],['no','Not me']].map(([v,label])=>`<button type="button" class="bf-choice ${votes[id]===v?'is-selected':''}" data-${kind}-vote="${id}" data-fit="${v}" aria-pressed="${votes[id]===v}">${label}</button>`).join('')}</div>`;
}

function hypothesisMarkup(h){
  return `<article class="bf-model-hypothesis"><span class="bf-model-tag">${esc(h.name)}</span><h3>${esc(h.heading)}</h3><p>${esc(h.reading)}</p><div class="bf-model-two"><div><b>Where it might cost</b><p>${esc(h.cost)}</p></div><div><b>A small adjustment</b><p>${esc(h.step)}</p><button type="button" class="bf-text-action" data-profile-step="${h.id}">Try this as my experiment →</button></div></div><details class="bf-atlas-details"><summary>Why this guess? What else could explain it?</summary><p>Based on ${h.signals.map(esc).join(' and ')}. These are scale positions, not proven interaction effects for you.</p><p>${esc(h.alternatives)}</p><p>${esc(h.test)}</p></details>${fitButtons('profile',h.id,state.profileVotes)}</article>`;
}

function profileMarkup(model){
  return `<section class="bf-atlas-section bf-profile-section" id="bf-profile"><div class="bf-atlas-heading"><span>01 · A working model</span><h2>A possible story from your full pattern.</h2><p>This is a set of guesses, not an analysis that knows your hidden motives. Keep, edit or reject each one.</p></div><div class="bf-profile-story"><div><p class="eyebrow">Start here</p><p>${esc(model.summary)}</p><p class="bf-model-principle">The score pattern describes broad tendencies. Your habits, skills, roles, relationships and life circumstances shape how those tendencies appear. The questionnaire cannot see those parts of your life; your examples complete the model.</p></div><img src="ns-character-thinking.webp" alt="" loading="lazy"></div><div class="bf-featured-hypotheses">${model.featured.map(hypothesisMarkup).join('')}</div><details class="bf-model-more"><summary>Explore seven more combinations</summary><div class="bf-model-grid">${model.pairs.filter(h=>!model.featured.includes(h)).map(hypothesisMarkup).join('')}</div></details>${model.contrasts.length?`<details class="bf-model-more"><summary>Look closer at ${model.contrasts.length} answer contrasts</summary><p>These are individual answer differences to explore, not scored facets. A different wording or a recent experience may explain a gap.</p><div class="bf-model-grid">${model.contrasts.map(h=>`<article class="bf-model-pattern"><h3>${esc(h.name)}</h3><p>${esc(h.reading)}</p><p><b>Ask yourself:</b> ${esc(h.test)}</p>${fitButtons('profile',h.id,state.profileVotes)}</article>`).join('')}</div></details>`:''}<p class="bf-model-boundary">These combinations and examples are editorial prompts informed by personality theory. They have not been validated as individual predictions or proven optimal life advice.</p></section>`;
}

function lensMarkup(model){
  const l=model.lenses.find(x=>x.id===state.lens)||model.lenses[0];
  return `<div class="bf-life-lens" id="bf-lens-panel" role="tabpanel" aria-labelledby="bf-lens-${l.id}"><div class="bf-life-scenario"><span class="bf-model-tag">Imagine a real moment</span><h3>${esc(l.example)}</h3><p>${esc(l.hypothesis)}</p><p><b>Possible cost:</b> ${esc(l.cost)}</p></div><div class="bf-life-drivers"><span>Answers informing this guess</span><p>${l.signals.map(esc).join(' · ')}</p><details><summary>How the other two dimensions may matter</summary><ul>${l.background.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></details></div><div class="bf-life-synthesis"><div><h3>Try a different fit</h3><p>${esc(l.fit)}</p><button type="button" class="bf-text-action" data-lens-step="${l.id}">Use as my experiment →</button></div><div><h3>Think backwards from your life</h3><p>${esc(l.question)}</p></div></div><details class="bf-atlas-details"><summary>Another possible explanation</summary><p>${esc(l.alternative)}</p><p>A questionnaire cannot infer childhood, attachment, unconscious motives, diagnoses, skills or what a relationship is really like.</p></details><div class="bf-atlas-feedback"><p>Does this guess fit your life?</p>${fitButtons('lens',l.id,state.lensVotes)}<label for="bf-lens-note">What did it miss? Give an example or a counterexample.</label><textarea id="bf-lens-note" data-lens-note="${l.id}" maxlength="700" placeholder="For example, I take charge at work but step back with family because…">${esc(state.lensNotes[l.id]||'')}</textarea></div></div>`;
}

function lifeMarkup(model){
  return `<section class="bf-atlas-section bf-life-section" id="bf-life"><div class="bf-atlas-heading"><span>03 · Test it in your life</span><h2>One life area at a time.</h2><p>Choose a lens. Each brings several scores into the same situation, then asks you to compare the guess with what actually happens.</p></div><div class="bf-life-tabs" role="tablist" aria-label="Life areas">${model.lenses.map(l=>`<button type="button" role="tab" id="bf-lens-${l.id}" data-life-lens="${l.id}" aria-selected="${state.lens===l.id}" aria-controls="bf-lens-panel">${esc(l.title)}</button>`).join('')}</div>${lensMarkup(model)}</section>`;
}

function renderBigFiveResults(root) {
  const scores=calculateScores();
  const model=buildProfile(scores,state.answers,ITEMS);
  const selected=scores.find(s=>s.trait.id===state.chapter)||scores[0];
  root.innerHTML=`<div class="wrap questionnaires-page big-five-page bf-results-page bf-atlas-page">
    <section class="bf-atlas-hero"><div><p class="eyebrow">Nobody’s Simple · your personality atlas</p><h1>Your pattern,
<br><em>held as a hypothesis.</em></h1><p class="lead">A working model built from your answers, with possible strengths, friction points and ways to adjust your environment.</p><p>Explore one guess at a time. Mark what fits, question what does not, and add your own examples.</p></div><img src="ns-character-reading.webp" alt="" loading="lazy"></section>
    ${profileMarkup(model)}
    <section class="bf-atlas-overview" aria-label="Your five dimensions"><div class="bf-results-card-head"><div><p class="eyebrow">02 · The evidence</p><h2>Your five scale positions</h2></div><p>These scores describe agreement with questionnaire items, not where you rank among people.</p></div>${renderChart(scores)}<details class="bf-atlas-details"><summary>How should I read a score?</summary><p><b>Raw scale position:</b> ten answers rated 1–5, reverse-keyed where needed, then shifted to 0–40. A 30/40 means responses leaned more towards the named dimension; it is not “higher than 75% of people”.</p><p><b>Comparison with people:</b> no validated, relevant reference sample is used here. Broad scores cannot tell you a precise facet, your cause, your diagnosis, or what you will do in a particular situation.</p></details></section>
    ${lifeMarkup(model)}
    <section class="bf-atlas-section" id="bf-chapters"><div class="bf-atlas-heading"><span>04 · Explore a dimension</span><h2>Open one chapter at a time.</h2><p>What fits, what does not, and where the pattern changes are as useful as the score itself.</p></div><div class="bf-chapter-tabs" role="tablist" aria-label="Personality dimensions">${scores.map(s=>`<button type="button" role="tab" id="bf-tab-${s.trait.id}" aria-controls="bf-chapter-panel" aria-selected="${state.chapter===s.trait.id}" data-atlas-chapter="${s.trait.id}" style="--bf-card-colour:${s.trait.colour}">${esc(s.trait.name)}</button>`).join('')}</div><div id="bf-chapter-panel" role="tabpanel" aria-labelledby="bf-tab-${selected.trait.id}">${chapterMarkup(selected)}</div></section>
    <section class="bf-atlas-section" id="bf-context"><div class="bf-atlas-heading"><span>05 · Context and development</span><h2>When do you feel most like this?</h2><p>Choose a dimension and mark how often it appears in different settings. These are your observations, not extra trait scores.</p></div><label class="bf-atlas-field">Dimension to map <select id="bf-context-trait">${scores.map(s=>`<option value="${s.trait.id}" ${state.contextTrait===s.trait.id?'selected':''}>${esc(s.trait.name)}</option>`).join('')}</select></label><div class="bf-context-list">${CONTEXTS.map(label=>{const key=`${state.contextTrait||'E'}:${label}`;return `<label>${esc(label)}<select data-context="${esc(key)}"><option value="">Not marked</option>${['Less often','Sometimes','Often','It depends'].map(v=>`<option value="${v}" ${state.contexts[key]===v?'selected':''}>${v}</option>`).join('')}</select></label>`;}).join('')}</div><details class="bf-atlas-details"><summary>Why can I be different in different places?</summary><p>Traits describe general patterns, while roles, goals, safety, fatigue and social demands affect the behaviour you show at a particular moment. The book’s Five-Factor Theory distinguishes broad tendencies from learned habits, roles and relationships (“characteristic adaptations”). Whole Trait Theory also describes variation across situations. Neither theory lets this questionnaire identify the cause of your pattern.</p></details></section>
    <section class="bf-atlas-section" id="bf-action"><div class="bf-atlas-heading"><span>06 · Work with your personality</span><h2>Choose what matters to you.</h2><p>Tool suggestions follow the concerns you select, never an assumed problem inferred from a trait score.</p></div><div class="bf-goals">${GOALS.map(g=>`<label><input type="checkbox" data-atlas-goal="${g.id}" ${state.goals.includes(g.id)?'checked':''}><span>${esc(g.label)}</span></label>`).join('')}</div><div class="bf-goal-suggestions">${state.goals.length?state.goals.map(id=>GOALS.find(g=>g.id===id)).filter(Boolean).map(g=>`<article><h3>${esc(g.label)}</h3><p>${esc(g.prompt)}</p><a href="#tool/${esc(g.tool)}">Open a related tool →</a></article>`).join(''):'<p>Choose one concern to see a relevant tool. No concern selected means no recommendation.</p>'}</div><label class="bf-atlas-field" for="bf-experiment">One small experiment to try<textarea id="bf-experiment" maxlength="700" placeholder="When a non-urgent request arrives, I’ll pause before answering…">${esc(state.experiment)}</textarea></label><p>Review what happened and whether the step helped. One exercise cannot prove that an underlying trait changed.</p><label class="bf-atlas-field" for="bf-review">After trying it, what happened?<textarea id="bf-review" maxlength="700" placeholder="What did I do, what happened, and would I repeat or adapt it?">${esc(state.review)}</textarea></label></section>
    <section class="bf-atlas-section" id="bf-manual"><div class="bf-atlas-heading"><span>07 · Your manual</span><h2>Keep only what fits.</h2><p>Your corrections, chosen contexts and experiment become a personal note. Export it, or explicitly save it in this browser for later. Nothing is uploaded by this feature.</p></div><div class="bf-manual-actions"><button class="button" type="button" id="bf-export">Download my manual</button><button class="button secondary" type="button" id="bf-save">Save on this device</button><button class="button secondary" type="button" id="bf-delete">Delete saved copy</button><p id="bf-save-status" role="status" aria-live="polite"></p></div></section>
    <details class="bf-atlas-science"><summary>08 · The research and limits behind this atlas</summary><div><p><b>Measurement:</b> The statements come from the public-domain 50-item IPIP Big Five factor markers. We display Neuroticism (negative emotionality), the reverse direction of the original Emotional Stability marker. This site groups items into five pages and uses accuracy-style response labels; the exact site implementation has not been locally validated. No age or population norms are applied.</p><p><b>Theory:</b> McCrae and Costa describe broad tendencies alongside habits, roles, relationships and self-concept. The book’s distinction between basic tendencies, characteristic adaptations, self-concept, and actual life course informs the structure of the working model. Its examples do not let us infer your personal history. The combination interpretations are editorial hypotheses and have not been validated as predictions for individuals. BFI-2 research offers an example of more detailed facet measurement, but this is a different instrument and does not calculate those facets.</p><p><b>Change:</b> People can adjust conditions, build skills and practise different behaviours; evidence on lasting intentional trait change remains developing. A short experiment is about behaviour, not a promised score change.</p><ul>${sourceLinks()}${profileSources.map(([label,url])=>`<li><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)} ↗</a></li>`).join('')}</ul></div></details>
    <div class="big-five-backlinks"><button class="button" type="button" id="bf-print">Print / save as PDF</button><button class="button secondary" type="button" id="bf-restart">Take it again</button><a href="#questionnaires">Back to questionnaires</a></div>
  </div>`;
  const updateProfileVotes=()=>root.querySelectorAll('[data-profile-vote]').forEach(b=>{const on=state.profileVotes[b.dataset.profileVote]===b.dataset.fit;b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',String(on));});
  root.querySelector('#bf-profile').addEventListener('click',e=>{
    const vote=e.target.closest('[data-profile-vote]');if(vote){state.profileVotes[vote.dataset.profileVote]=vote.dataset.fit;updateProfileVotes();return;}
    const step=e.target.closest('[data-profile-step]');if(step){state.experiment=model.pairs.find(h=>h.id===step.dataset.profileStep)?.step||'';root.querySelector('#bf-experiment').value=state.experiment;root.querySelector('#bf-experiment').focus();}
  });
  root.querySelector('#bf-life').addEventListener('click',e=>{
    const tab=e.target.closest('[data-life-lens]');if(tab){state.lens=tab.dataset.lifeLens;root.querySelector('#bf-lens-panel').outerHTML=lensMarkup(model);root.querySelectorAll('[data-life-lens]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.lifeLens===state.lens)));tab.focus();return;}
    const vote=e.target.closest('[data-lens-vote]');if(vote){state.lensVotes[vote.dataset.lensVote]=vote.dataset.fit;root.querySelectorAll('[data-lens-vote]').forEach(b=>{const on=state.lensVotes[b.dataset.lensVote]===b.dataset.fit;b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',String(on));});return;}
    const step=e.target.closest('[data-lens-step]');if(step){state.experiment=model.lenses.find(l=>l.id===step.dataset.lensStep)?.fit||'';root.querySelector('#bf-experiment').value=state.experiment;root.querySelector('#bf-experiment').focus();}
  });
  root.querySelector('#bf-life').addEventListener('input',e=>{if(e.target.matches('[data-lens-note]'))state.lensNotes[e.target.dataset.lensNote]=e.target.value;});
  const updateChapter=()=>{const s=scores.find(x=>x.trait.id===state.chapter);const panel=root.querySelector('#bf-chapter-panel');panel.innerHTML=chapterMarkup(s);panel.setAttribute('aria-labelledby',`bf-tab-${s.trait.id}`);root.querySelectorAll('[data-atlas-chapter]').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.atlasChapter===state.chapter)));};
  root.querySelectorAll('[data-atlas-chapter]').forEach(b=>b.addEventListener('click',()=>{state.chapter=b.dataset.atlasChapter;updateChapter();b.focus();}));
  root.querySelector('#bf-chapters').addEventListener('click',e=>{
    const ex=e.target.closest('[data-example]');if(ex){const info=ATLAS[ex.dataset.example];state.example[ex.dataset.example]=info.choices[Number(ex.dataset.choice)];updateChapter();return;}
    const fit=e.target.closest('[data-reflection]');if(fit){state.reflections[fit.dataset.reflection]=fit.dataset.fit;updateChapter();return;}
    const copy=e.target.closest('[data-copy-experiment]');if(copy){state.experiment=ATLAS[copy.dataset.copyExperiment].poles[position(scores.find(s=>s.trait.id===copy.dataset.copyExperiment).score)].practice;root.querySelector('#bf-experiment').value=state.experiment;root.querySelector('#bf-experiment').focus();}
  });
  root.querySelector('#bf-chapters').addEventListener('input',e=>{if(e.target.matches('[data-atlas-note]'))state.notes[e.target.dataset.atlasNote]=e.target.value;});
  const updateContexts=()=>{const grid=root.querySelector('.bf-context-list');grid.innerHTML=CONTEXTS.map(label=>{const key=`${state.contextTrait}:${label}`;return `<label>${esc(label)}<select data-context="${esc(key)}"><option value="">Not marked</option>${['Less often','Sometimes','Often','It depends'].map(v=>`<option value="${v}" ${state.contexts[key]===v?'selected':''}>${v}</option>`).join('')}</select></label>`;}).join('');};
  state.contextTrait ||= 'E';root.querySelector('#bf-context-trait').value=state.contextTrait;
  root.querySelector('#bf-context-trait').addEventListener('change',e=>{state.contextTrait=e.target.value;updateContexts();});
  root.querySelector('.bf-context-list').addEventListener('change',e=>{if(e.target.matches('[data-context]'))state.contexts[e.target.dataset.context]=e.target.value;});
  root.querySelector('.bf-goals').addEventListener('change',e=>{if(!e.target.matches('[data-atlas-goal]'))return;state.goals=GOALS.filter(g=>root.querySelector(`[data-atlas-goal="${g.id}"]`).checked).map(g=>g.id);root.querySelector('.bf-goal-suggestions').innerHTML=state.goals.length?state.goals.map(id=>GOALS.find(g=>g.id===id)).map(g=>`<article><h3>${esc(g.label)}</h3><p>${esc(g.prompt)}</p><a href="#tool/${esc(g.tool)}">Open a related tool →</a></article>`).join(''):'<p>Choose one concern to see a relevant tool. No concern selected means no recommendation.</p>';});
  root.querySelector('#bf-experiment').addEventListener('input',e=>state.experiment=e.target.value);
  root.querySelector('#bf-review').addEventListener('input',e=>state.review=e.target.value);
  root.querySelector('#bf-export').addEventListener('click',()=>{const blob=new Blob([makeManual(scores,state.notes,state.contexts,state.goals,state.experiment,state.reflections,state.example,state.review,{profile:model,profileVotes:state.profileVotes,lensVotes:state.lensVotes,lensNotes:state.lensNotes})],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='my-personality-manual.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
  root.querySelector('#bf-save').addEventListener('click',()=>{const ok=safeStorage.write({answers:state.answers,notes:state.notes,contexts:state.contexts,goals:state.goals,experiment:state.experiment,review:state.review,reflections:state.reflections,example:state.example,contextTrait:state.contextTrait,lens:state.lens,profileVotes:state.profileVotes,lensVotes:state.lensVotes,lensNotes:state.lensNotes});root.querySelector('#bf-save-status').textContent=ok?'Saved in this browser. Anyone using this browser profile may be able to see it.':'Could not save here. Use Download my manual instead.';});
  root.querySelector('#bf-delete').addEventListener('click',()=>{safeStorage.remove();root.querySelector('#bf-save-status').textContent='Saved copy removed from this browser. The current page remains until you leave or restart.';});
  root.querySelector('#bf-print').addEventListener('click',()=>window.print());
  root.querySelector('#bf-restart').addEventListener('click',()=>{resetState();renderBigFiveView(root);});
}

function renderBigFiveView(root) {
  if (state.page === "questions") renderBigFiveQuestions(root);
  else if (state.page === "results") renderBigFiveResults(root);
  else renderBigFiveIntro(root);
}

export function renderBigFive(root) {
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

