import { escapeHTML as esc, nearestEmotions, safeHref, safeImage } from "./core.mjs";
import { profileFor, stateItems } from "./emotion-profiles.mjs";
import { tools, toolGroups, situations, situationSubparts } from "./tool-catalog.mjs";
import { interactiveCardMarkup, recommendInteractiveTools } from "./interactive-tools.mjs";

const yt = "https://www.youtube.com/@nobodyssimple";
const forms = {
  feedback:
    "https://docs.google.com/forms/d/e/1FAIpQLSdrMFICnfVKFyEMVYW0wnj0_XWKCM8i89s9lZ1ixFLN5od_bw/viewform",
  volunteer:
    "https://docs.google.com/forms/d/e/1FAIpQLSewCnWbRoRvElX6a6ZcbByvjJu6yRuHTIAWipQr5sb3gb7p_Q/viewform",
};
const mapKey = "ns-personal-maps-v1";
const card = (tool) =>
  `<a class="card feature-card tone-${esc(toolGroups.find((g) => g[0] === tool.group)?.[2] || "mint")}" href="#tool/${encodeURIComponent(tool.id)}"><span class="feature-mark" aria-hidden="true">✳</span><span class="eyebrow">${esc(toolGroups.find((g) => g[0] === tool.group)?.[1] || "Tool")}</span><h3>${esc(tool.title)}</h3><p>${esc(tool.short)}</p><span class="arrow">Open tool <span aria-hidden="true">↗</span></span></a>`;
const area = (eyebrow, title, intro) =>
  `<section class="page-intro"><p class="eyebrow">${esc(eyebrow)}</p><h1>${title}</h1><p class="lead">${intro}</p></section>`;
const loadMaps = () => {
  try {
    const v = JSON.parse(localStorage.getItem(mapKey) || "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
function saveMap(entry) {
  const maps = loadMaps();
  maps.unshift({
    ...entry,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
    status: "New observation",
  });
  localStorage.setItem(mapKey, JSON.stringify(maps.slice(0, 250)));
}
export function moodRatingMarkup({
  id,
  outputId,
  buttonId,
  heading = "How are you feeling right now?",
  intro = "Slide to mark your overall mood, as you define it.",
  buttonText = "Continue",
} = {}) {
  return `<section class="mood-checkin-card"><p class="eyebrow">A quick check-in</p><h3>${esc(heading)}</h3><p>${esc(intro)}</p><label class="mood-slider-label" for="${esc(id)}"><span>Overall mood</span><output id="${esc(outputId)}" for="${esc(id)}">5 / 10</output></label><input id="${esc(id)}" class="mood-slider" type="range" min="0" max="10" step="1" value="5" aria-label="Overall mood, from very low or unpleasant to very good or pleasant"><div class="mood-scale"><span>Very low / unpleasant</span><span>Very good / pleasant</span></div><p class="mood-instruction">Move the slider to choose a rating.</p><button class="button" id="${esc(buttonId)}" type="button" disabled>${esc(buttonText)}</button></section>`;
}
export function bindMoodRating(root, { id, outputId, buttonId, onSubmit }) {
  const slider = root.querySelector(`#${id}`),
    output = root.querySelector(`#${outputId}`),
    button = root.querySelector(`#${buttonId}`);
  if (!slider || !output || !button) return;
  const update = () => {
    const value = `${slider.value} / 10`;
    output.value = value;
    output.textContent = value;
    button.disabled = false;
  };
  let activePointerId = null;
  const setValueFromPointer = (event) => {
    const bounds = slider.getBoundingClientRect();
    const inset = Math.min(12, bounds.width / 2);
    const travel = Math.max(1, bounds.width - inset * 2);
    const ratio = Math.max(
      0,
      Math.min(1, (event.clientX - bounds.left - inset) / travel),
    );
    const minimum = Number(slider.min) || 0;
    const maximum = Number(slider.max) || 10;
    const stepValue = Number(slider.step);
    const step = Number.isFinite(stepValue) && stepValue > 0 ? stepValue : 1;
    const value = minimum + Math.round((ratio * (maximum - minimum)) / step) * step;
    slider.value = String(Math.max(minimum, Math.min(maximum, value)));
    update();
  };
  slider.addEventListener("input", update);
  slider.addEventListener("change", update);
  slider.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    activePointerId = event.pointerId;
    try {
      slider.focus({ preventScroll: true });
    } catch {
      slider.focus();
    }
    if (typeof slider.setPointerCapture === "function") {
      try {
        slider.setPointerCapture(event.pointerId);
      } catch {
        // Keep coordinate-based dragging available if capture is unsupported.
      }
    }
    event.preventDefault();
    setValueFromPointer(event);
  });
  slider.addEventListener("pointermove", (event) => {
    if (event.pointerId === activePointerId) setValueFromPointer(event);
  });
  slider.addEventListener("pointerup", (event) => {
    if (event.pointerId !== activePointerId) return;
    setValueFromPointer(event);
    activePointerId = null;
    slider.dispatchEvent(new Event("change", { bubbles: true }));
  });
  slider.addEventListener("pointercancel", () => (activePointerId = null));
  slider.addEventListener("keydown", (event) => {
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End",
        "PageUp",
        "PageDown",
      ].includes(event.key)
    )
      update();
  });
  slider.addEventListener("click", () => (button.disabled = false));
  button.addEventListener("click", () => onSubmit(Number(slider.value)));
}
export function moodComparisonMarkup(before, after) {
  const first = Math.max(0, Math.min(10, Math.round(Number(before) || 0))),
    last = Math.max(0, Math.min(10, Math.round(Number(after) || 0))),
    change = last - first,
    summary = change > 0 ? `Up ${change} ${change === 1 ? "point" : "points"}` : change < 0 ? `Down ${Math.abs(change)} ${change === -1 ? "point" : "points"}` : "No change";
  return `<section class="mood-comparison" aria-label="Mood check-in comparison"><p class="eyebrow">Your mood check-in</p><div class="mood-score-row"><span>Before</span><div class="mood-track" role="meter" aria-label="Mood rating before" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${first}"><span style="width:${first * 10}%"></span></div><b>${first} / 10</b></div><div class="mood-score-row"><span>After</span><div class="mood-track" role="meter" aria-label="Mood rating after" aria-valuemin="0" aria-valuemax="10" aria-valuenow="${last}"><span style="width:${last * 10}%"></span></div><b>${last} / 10</b></div><p class="mood-change">${summary}</p><p class="fine">This compares your two ratings; it cannot tell you what caused a change.</p></section>`;
}
function renderHomeLegacy(root, posts) {
  const latest = (posts || []).filter((p) => p.type === "blog").slice(0, 3);
  root.innerHTML = `<div class="home-wrap"><section class="cover-hero"><img class="cover-image" src="banner.png" alt="Nobody’s Simple — Psychology for choosing what to do next"><div class="cover-cta"><p class="eyebrow">A practical psychology project</p><p>Start with the moment you’re in. Find one thing that might help.</p><a class="button bright" href="#help">Help me figure out what I need <span aria-hidden="true">↗</span></a></div></section><div class="quick-actions"><a href="#help"><span>01</span><b>Help me figure out what I need</b><small>Three tailored starting points</small></a><a href="#compass"><span>02</span><b>Name the feeling or state</b><small>Emotions, energy and body cues</small></a><a href="#library"><span>03</span><b>Follow a learning thread</b><small>52 weeks · four quarters</small></a><a href="#maps"><span>04</span><b>My Maps</b><small>Return to notes saved on this device</small></a></div>
 <section class="personality-promo" aria-labelledby="personality-promo-title"><span class="personality-promo-icon" aria-hidden="true">✳</span><div><p class="eyebrow">Personal Psychological Guide · evidence-gated</p><h2 id="personality-promo-title">A useful guide, not a fixed type.</h2><p>Explore patterns, relationships, work, money, decisions, regulation and growth, then receive a visual interpretation that teaches you what may change the pattern and what to try next.</p></div><div class="personality-promo-action"><span>ABOUT 45–70 MIN · 16 CHAPTERS · SAVE LOCALLY</span><a class="button" href="#personality">Build my guide ↗</a></div></section>
 <section class="install-ribbon"><div class="round-icon">↗</div><div><p class="eyebrow">Keep it close</p><h2>Add Nobody’s Simple to your home screen</h2><p>Your web app—one tap away, no app store required.</p></div><a href="#install" class="button">Install the app <span aria-hidden="true">→</span></a><button type="button" class="icon-button" data-install-prompt aria-label="Install Nobody’s Simple">↓</button></section>
 <section class="channel-hero"><div><p class="eyebrow">The Nobody’s Simple channel</p><h2>Watch the ideas take shape.</h2><p>Animated psychology, complicated questions and useful ways to choose what to do next.</p></div><a class="channel-cta" href="${yt}" target="_blank" rel="noopener noreferrer"><span class="play-button">▶</span><span><small>VISIT THE CHANNEL</small><strong>Watch on YouTube</strong></span><span aria-hidden="true">↗</span></a></section>
 <section class="editorial-section new-offerings"><div class="section-head"><div><p class="eyebrow">New ways into the project</p><h2>Focus, play or meet the person behind it.</h2></div></div><div class="grid"><a class="card new-offering focus-offering" href="#simplyfocus"><span class="index">SIMPLYFOCUS / 01</span><h3>Build a soundscape for this moment.</h3><p>Layer rain, fire, wind, waves, white noise, a singing bowl or our original generated lo-fi.</p><span class="arrow">Make your mix ↗</span></a><a class="card new-offering play-offering" href="#tools"><span class="index">NO WRITING / 02</span><h3>Try something interactive.</h3><p>Tap, move, sort, listen or explore a visual activity in your own way.</p><span class="arrow">Browse interactive tools ↗</span></a><a class="card new-offering team-offering" href="#team"><span class="index">MEET THE TEAM / 03</span><h3>One person, many threads.</h3><p>Meet Drew and the research, support work and promises behind Nobody’s Simple.</p><span class="arrow">Read our story ↗</span></a></div></section>\n <section class="editorial-section"><div class="section-head"><div><p class="eyebrow">A living field guide</p><h2>More than one way into a moment.</h2></div><a class="text-link" href="#tools">Explore the toolbox ↗</a></div><div class="grid feature-grid">${["emotion-check-in", "state-check", "reality-map", "small-step"].map((id) => card(tools.find((t) => t.id === id))).join("")}</div></section>
 <section class="journey-banner"><div><p class="eyebrow">Recursive autonomy · 2026–27</p><h2>Notice the pattern.<br>Decide what should guide you.</h2><p>Four quarters. Twelve modules. Fifty-two questions to explore.</p><a class="button light-button" href="#library">Explore the curriculum →</a></div><div class="journey-stamp">SEE <span>✳</span> TRACE <span>✳</span><br>RESIST <span>✳</span> GOVERN</div></section>
 <section class="editorial-section blog-preview"><div class="section-head"><div><p class="eyebrow">Separate from the curriculum</p><h2>Notes from Nobody’s Simple.</h2></div><a class="text-link" href="#blog">All blog posts ↗</a></div><div class="grid">${latest.length ? latest.map((p) => `<a class="card post-card" href="#post/${encodeURIComponent(p.id)}">${p.thumbnail ? `<img src="${esc(p.thumbnail)}" alt="${esc(p.thumbnailAlt || "")}" loading="lazy">` : `<div class="post-placeholder" aria-hidden="true">Aa</div>`}<div class="copy"><span class="badge">${esc((p.topics || []).join(" · ") || "A note")}</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt || "")}</p><span class="arrow">Read the piece →</span></div></a>`).join("") : `<div class="empty">The blog is ready for your first post in Staff login.</div>`}</div></section>
 <section class="community-ribbon"><div><p class="eyebrow">Built with people, not just for people</p><h2>Shape what we make next.</h2><p>Suggest a topic, challenge an idea or help make the project more useful.</p></div><div class="row"><a class="button bright" href="#community">Share feedback</a><a class="button outline-light" href="#volunteer">Volunteer with us</a></div></section><section class="home-app-banner"><div><span class="eyebrow">A web app, on your phone</span><h2>Carry a calmer next step.</h2><p>Add it to your home screen. No app-store account or download fee.</p></div><a href="#install" class="button bright">How to add the app ↗</a></section></div>`;
  root.querySelector("[data-install-prompt]").onclick = () =>
    document.getElementById("install")?.scrollIntoView({ behavior: "smooth" });
}

function activeAnnouncements(posts) {
  const nowTime = Date.now();
  return (posts || [])
    .filter((post) => post.type === "announcement" && post.status === "published")
    .filter((post) => (!post.announcementStart || new Date(post.announcementStart).valueOf() <= nowTime) && (!post.announcementEnd || new Date(post.announcementEnd).valueOf() >= nowTime))
    .sort((a, b) => Number(Boolean(b.announcementPinned)) - Number(Boolean(a.announcementPinned)) || Number(b.announcementPriority || 0) - Number(a.announcementPriority || 0) || String(b.updatedAt || b.publishedAt || "").localeCompare(String(a.updatedAt || a.publishedAt || "")))
    .slice(0, 6);
}
function announcementHref(post) {
  const value = String(post.announcementLink || "#blog").trim();
  return value.startsWith("#") ? value : safeHref(value) || "#blog";
}
function announcementRail(posts) {
  const items = activeAnnouncements(posts);
  if (!items.length) return `<section class="announcement-rail announcement-empty" aria-label="Updates"><span class="announcement-label">UPDATES</span><p>New notes and site changes will appear here.</p><a href="#blog">Read the latest notes</a></section>`;
  return `<section class="announcement-rail" data-announcement-rail aria-label="Updates"><div class="announcement-rail-head"><span class="announcement-label">UPDATES</span><span class="announcement-count">${items.length} update${items.length === 1 ? "" : "s"}</span></div><div class="announcement-slides">${items.map((post, index) => { const href = announcementHref(post); const external = /^https?:/i.test(href); return `<article class="announcement-slide" data-announcement-slide ${index ? "hidden" : ""}><span class="announcement-kind">${esc(post.announcementLabel || post.category || "Update")}</span><div class="announcement-copy"><b>${esc(post.title || "Site update")}</b><p>${esc(post.excerpt || post.intro || "")}</p></div><a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(post.announcementLinkText || "Open update")}</a></article>`; }).join("")}</div>${items.length > 1 ? `<div class="announcement-controls"><button type="button" data-announcement-prev aria-label="Previous update">Previous</button><span data-announcement-position>1 / ${items.length}</span><button type="button" data-announcement-next aria-label="Next update">Next</button></div>` : ""}</section>`;
}
export function renderHome(root, posts) {
  const allPosts = posts || [];
  const latestBlog = allPosts.find((post) => post.type === "blog");
  const latestVideo = allPosts.find((post) => post.type === "video");
  const maps = loadMaps();
  const continueSection = maps.length ? `<section class="home-section home-continue"><div class="home-section-head"><div><p class="eyebrow">Continue</p><h2>Pick up where you stopped.</h2></div><a href="#maps">Open My Maps</a></div><div class="continue-grid"><a class="continue-card" href="#maps"><span class="continue-icon">↗</span><div><b>${esc(maps[0].title || "Saved map")}</b><p>${esc(maps[0].status || "Saved note")} · ${new Date(maps[0].savedAt).toLocaleDateString()}</p></div><strong>Open</strong></a><a class="continue-card" href="#help"><span class="continue-icon">✳</span><div><b>Find another starting point</b><p>Tell us what is happening and what would help.</p></div><strong>Start</strong></a></div></section>` : `<section class="home-section home-first-visit"><p class="eyebrow">New here?</p><h2>Start with one clear question.</h2><p>Use quick help, a tool or the learning library. You do not need to know the right label first.</p><a class="button" href="#help">Find my starting point</a></section>`;
  const contentCard = (post, verb) => post ? `<a class="latest-card" href="#post/${encodeURIComponent(post.id)}">${post.thumbnail && safeImage(post.thumbnail) ? `<img src="${esc(post.thumbnail)}" alt="${esc(post.thumbnailAlt || "")}" loading="lazy">` : `<span class="latest-placeholder" aria-hidden="true">${post.type === "video" ? "▶" : "Aa"}</span>`}<div><span class="eyebrow">${post.type === "video" ? "Latest video" : "Latest note"}</span><h3>${esc(post.title)}</h3><p>${esc(post.excerpt || post.intro || "")}</p><strong>${verb}</strong></div></a>` : `<div class="latest-card latest-empty"><span class="eyebrow">${verb === "Watch" ? "Videos" : "Notes"}</span><h3>New content will appear here.</h3><p>Check back when the next update is published.</p></div>`;
  root.innerHTML = `<div class="home-wrap home-app">${announcementRail(allPosts)}<section class="home-masthead"><img src="banner.png" alt="Nobody’s Simple illustrated landscape"><div><p class="eyebrow">Psychology for real life</p><h1>What would help today?</h1><p>Understand what is happening. Find a useful next step.</p></div></section><section class="home-section home-doors" aria-labelledby="home-doors-title"><div class="home-section-head"><div><p class="eyebrow">Start here</p><h2 id="home-doors-title">Choose what you need.</h2></div><a href="#help">Quick help</a></div><div class="home-door-grid"><a class="home-door door-now" href="#help"><span>RIGHT NOW</span><h3>Help me right now</h3><p>I feel stressed, stuck, overwhelmed or confused.</p><strong>Find a tool</strong></a><a class="home-door door-map" href="#help"><span>WORK SOMETHING OUT</span><h3>Help me work something out</h3><p>I need help with a decision, relationship, career or life problem.</p><strong>Find my starting point</strong></a><a class="home-door door-explore" href="#tools"><span>LOOK AROUND</span><h3>I want to explore</h3><p>Read, watch, learn, play or try a reflection.</p><strong>Explore</strong></a></div><p class="home-shortcut">Not sure? <a href="#help">Tell me what is going on</a> · 2 minutes to start</p></section>${continueSection}<section class="home-section home-quick"><div class="home-section-head"><div><p class="eyebrow">Quick help</p><h2>Small tools for this moment.</h2><p>Short activities with clear instructions.</p></div><a href="#tools">Browse all tools</a></div><div class="home-quick-grid"><a href="#compass"><b>Understand a feeling</b><span>Emotion Compass</span></a><a href="#tool/brain-dump"><b>Clear my head</b><span>Mental Load tools</span></a><a href="#tool/quick-reset"><b>Calm my body</b><span>Quick Reset</span></a><a href="#questions"><b>Choose a next step</b><span>Emotion to Action</span></a></div></section><section class="home-section home-understand"><div class="home-section-head"><div><p class="eyebrow">Understand yourself</p><h2>A guide, not a label.</h2><p>Explore your patterns, then decide what you want to do with them.</p></div></div><div class="understand-grid"><a href="#personality"><b>Psychological Profile</b><span>Build a detailed personal guide.</span><strong>Start</strong></a><a href="#compass"><b>My Patterns</b><span>Notice feelings, body states and repeated loops.</span><strong>Explore</strong></a><a href="#maps"><b>My Maps</b><span>Keep notes and experiments on this device.</span><strong>Open</strong></a></div></section><section class="home-section home-latest"><div class="home-section-head"><div><p class="eyebrow">Latest</p><h2>New from Nobody’s Simple.</h2></div><a href="#blog">All notes</a></div><div class="latest-grid">${contentCard(latestBlog, "Read")} ${contentCard(latestVideo, "Watch")}</div></section><section class="home-section home-learn"><div><p class="eyebrow">Learn and explore</p><h2>Understand psychology well enough to think for yourself.</h2><p>Follow the curriculum, use the interactive playground, or make a soundscape.</p><div class="home-link-row"><a class="button" href="#library">Open Learn</a><a class="button secondary" href="#simplyfocus">Open SimplyFocus</a><a class="button secondary" href="#tools">Play and explore</a></div></div></section><section class="home-section home-why"><div><p class="eyebrow">Why this exists</p><h2>People are complicated. Advice should not flatten them.</h2><p>Nobody’s Simple helps you understand what is happening, find the right kind of help and choose what to do next.</p><a href="#blog">Read the story</a></div></section><section class="home-section home-community"><div><p class="eyebrow">Help shape the project</p><h2>Share feedback or get involved.</h2><p>Tell us what works, what does not and what would help next.</p></div><div class="home-link-row"><a class="button" href="#community">Send feedback</a><a class="button secondary" href="#volunteer">Volunteer</a><a class="button secondary" href="#install">Install the app</a></div></section></div>`;
  const rail = root.querySelector("[data-announcement-rail]");
  if (rail) {
    const slides = [...rail.querySelectorAll("[data-announcement-slide]")];
    let index = 0;
    const show = (next) => { index = (next + slides.length) % slides.length; slides.forEach((slide, i) => { slide.hidden = i !== index; }); const position = rail.querySelector("[data-announcement-position]"); if (position) position.textContent = `${index + 1} / ${slides.length}`; };
    rail.querySelector("[data-announcement-prev]")?.addEventListener("click", () => show(index - 1));
    rail.querySelector("[data-announcement-next]")?.addEventListener("click", () => show(index + 1));
  }
}

export function renderHelp(root) {
  const situationMarkup = situations.map((s) => {
    const subparts = situationSubparts[s.id] || [];
    return `<div class="situation-option"><label class="choice-tile"><input type="checkbox" name="situation" value="${esc(s.id)}"><span><b>${esc(s.label)}</b><small>${esc(s.examples)}</small></span></label>${subparts.length ? `<details class="situation-subparts" data-subparts-for="${esc(s.id)}" hidden><summary>Narrow this down (optional)</summary><div class="subpart-grid">${subparts.map((part) => `<label class="subpart-pill"><input type="checkbox" name="subpart" value="${esc(s.id)}:${esc(part.id)}"><span><b>${esc(part.label)}</b><small>${esc(part.examples)}</small></span></label>`).join("")}</div></details>` : ""}</div>`;
  }).join("");
  root.innerHTML = `<div class="wrap">${area("Quick help", "What do you need?", "Choose what fits. Then narrow it down if you want.")}<form id="navigator-form" class="navigator-layout"><section class="navigator-left"><fieldset><legend>What is happening?</legend><div class="choice-grid">${situationMarkup}</div></fieldset><fieldset><legend>What would help?</legend><div class="choice-grid compact-choices">${[
    ["understand", "Understand it"],
    ["calmer", "Feel calmer"],
    ["organise", "Organise it"],
    ["decide", "Make a decision"],
    ["action", "Do something"],
    ["communicate", "Communicate"],
    ["minutes", "Get through the next few minutes"],
  ].map(([v, l]) => `<label class="choice-pill"><input type="radio" name="goal" value="${v}"><span>${l}</span></label>`).join("")}</div></fieldset></section><aside class="navigator-side"><label class="field">How much energy is available right now?<input type="range" name="energy" min="0" max="2" value="1"><span class="range-ends"><span>Very little</span><output id="energy-label">Some</output><span>Plenty</span></span></label><label class="field">How intense does it feel?<input type="range" name="intensity" min="0" max="10" value="5"><span class="range-ends"><span>Gentle</span><output id="intensity-label">5 / 10</output><span>Very intense</span></span></label><label class="interactive-opt-in"><input type="checkbox" name="includeInteractive" checked><span><b>Show interactive tools too</b><small>Move, tap or sort instead of writing.</small></span></label><button class="button full" type="submit">Find my starting points ↗</button><p class="fine">Nothing is saved unless you choose to save an individual reflection.</p></aside></form><section class="not-sure-panel" aria-labelledby="not-sure-title"><div><p class="eyebrow">Not sure yet?</p><h2 id="not-sure-title">Use the emotion compass first.</h2><p>Find a feeling word by looking at energy and pleasantness.</p></div><a class="button bright" href="#compass">Open the emotion compass ↗</a></section><section id="recommendations" class="recommendations" aria-live="polite"></section></div>`;
  const form = root.querySelector("#navigator-form");
  form.querySelectorAll("[name=situation]").forEach((input) => {
    const panel = form.querySelector(`[data-subparts-for="${input.value}"]`);
    if (!panel) return;
    const sync = () => {
      panel.hidden = !input.checked;
      if (!input.checked) panel.querySelectorAll("input").forEach((part) => (part.checked = false));
    };
    input.addEventListener("change", sync);
    sync();
  });
  form.elements.energy.oninput = (e) => (root.querySelector("#energy-label").value = ["Very little", "Some", "Plenty"][+e.target.value]);
  form.elements.intensity.oninput = (e) => (root.querySelector("#intensity-label").value = `${e.target.value} / 10`);
  form.onsubmit = (e) => {
    e.preventDefault();
    const chosen = [...form.querySelectorAll("[name=situation]:checked")].map((x) => situations.find((s) => s.id === x.value)).filter(Boolean);
    const chosenSubparts = [...form.querySelectorAll("[name=subpart]:checked")].map((x) => {
      const [parent, id] = x.value.split(":");
      const part = (situationSubparts[parent] || []).find((item) => item.id === id);
      return part ? { ...part, parent } : null;
    }).filter(Boolean);
    const goal = form.elements.goal?.value || "understand";
    const energy = +form.elements.energy.value;
    const showInteractive = form.elements.includeInteractive.checked;
    const selectedTags = [...new Set([...chosen.map((item) => item.id), ...chosenSubparts.flatMap((item) => item.tags || [])])];
    const interactivePicks = recommendInteractiveTools(goal, selectedTags, energy);
    const pool = [];
    const addTool = (id) => { const tool = tools.find((item) => item.id === id); if (tool && !pool.some((item) => item.id === tool.id)) pool.push(tool); };
    chosen.forEach((situation) => situation.tools.forEach(addTool));
    chosenSubparts.forEach((part) => (part.tools || []).forEach(addTool));
    if (!chosen.length) ["state-check", "brain-dump", "quick-reset"].forEach(addTool);
    const boost = goal === "calmer" ? ["quick-reset", "grounding", "load-balancer"] : goal === "organise" ? ["brain-dump", "thought-map", "reality-map"] : goal === "decide" ? ["decision-map", "values-discovery", "certainty"] : goal === "communicate" ? ["conversation-map", "needs-clarifier", "boundary-builder"] : goal === "action" ? ["small-step", "friction", "decision-map"] : goal === "minutes" ? ["quick-reset", "grounding", "state-check"] : ["state-check", "emotion-check-in", "pattern-map"];
    const rank = (tool) => (chosenSubparts.some((part) => part.tools.includes(tool.id)) ? 8 : 0) + (boost.includes(tool.id) ? 4 : 0) + (energy === 0 && ["grounding", "quick-reset", "state-check", "small-step"].includes(tool.id) ? 3 : 0) + (chosen.some((situation) => situation.tools.includes(tool.id)) ? 3 : 0);
    pool.sort((a, b) => rank(b) - rank(a));
    const picks = [...pool, ...boost.map((id) => tools.find((tool) => tool.id === id)).filter(Boolean)].filter((tool, i, all) => all.findIndex((item) => item.id === tool.id) === i).slice(0, 3);
    const selectedText = [...chosen.map((item) => item.label), ...chosenSubparts.map((item) => item.label)];
    const recommendations = root.querySelector("#recommendations");
    recommendations.innerHTML = `<p class="eyebrow">Three starting points</p><h2>Take what fits.</h2><p class="fine">Matched to: ${selectedText.length ? selectedText.map((text) => esc(text)).join(" · ") : "not sure yet"}. This is a simple route, not an assessment.</p><div class="grid">${picks.map((tool, i) => { const matchedPart = chosenSubparts.find((part) => part.tools.includes(tool.id)); const reason = matchedPart ? `You narrowed this to “${matchedPart.label}”.` : chosen.some((situation) => situation.tools.includes(tool.id)) ? "It matches something you selected." : goal === "calmer" ? "You asked for a lower-pressure starting point." : "It gives you one clear place to begin."; return `<a class="card recommendation-card" href="#tool/${encodeURIComponent(tool.id)}"><span class="number">0${i + 1}</span><h3>${esc(tool.title)}</h3><p>${esc(tool.short)}</p><small>Why this might fit: ${esc(reason)}</small><span class="arrow">Try this tool →</span></a>`; }).join("")}</div><p class="fine">You can also <a href="#tools">browse the full toolbox</a>.</p>`;
    if (showInteractive) {
      const section = document.createElement("section");
      section.className = "interactive-recommendations";
      section.innerHTML = '<p class="eyebrow">Interactive tools · move, explore, choose</p><h2>Try something hands-on.</h2><p class="fine">These are matched to the same choices. Nothing above has been replaced.</p>';
      const grid = document.createElement("div");
      grid.className = "grid interactive-recommendation-grid";
      interactivePicks.forEach((tool, index) => { const holder = document.createElement("div"); holder.innerHTML = interactiveCardMarkup(tool, index); if (holder.firstElementChild) grid.append(holder.firstElementChild); });
      section.append(grid);
      recommendations.append(section);
    }
    recommendations.scrollIntoView({ behavior: "smooth" });
  };
}

function renderToolboxLegacy(root, filter = "") {
  root.innerHTML = `<div class="wrap">${area("A toolbox, not a test", "Find a tool by the kind of help you want.", "Nothing here knows you better than you know yourself. Try one prompt, skip anything that does not fit, and save only what you choose.")}<div class="toolbox-controls"><label class="field">Search tools<input id="tool-search" type="search" placeholder="e.g. tired, decision, relationship…"></label><div class="tabs" id="tool-tabs">${[["all", "Everything"], ...toolGroups.filter((g) => g[0] !== "maps").map((g) => [g[0], g[1]])].map(([id, label]) => `<button type="button" class="chip ${id === "all" ? "active" : ""}" data-group="${id}">${esc(label)}</button>`).join("")}</div></div><div id="tool-groups">${toolGroups
    .filter((g) => g[0] !== "maps")
    .map((g) => {
      const list = tools.filter((t) => t.group === g[0] && t.id !== "maps");
      return `<section class="tool-group" data-category="${g[0]}"><div class="section-head"><div><p class="eyebrow">${esc(g[1])}</p><h2>${esc(g[1])}</h2></div><span class="fine">${list.length} tools</span></div><div class="grid">${list.map(card).join("")}</div></section>`;
    })
    .join(
      "",
    )}</div><div id="interactive-tools-slot"></div><section class="section"><div class="card tone-slate"><p class="eyebrow">Saved only on this device</p><h2>My Maps</h2><p>Revisit observations and patterns you chose to keep. Your notes are not uploaded or synced.</p><a class="button" href="#maps">Open My Maps →</a></div></section></div>`;
  let active = "all";
  const update = () => {
    const q = root.querySelector("#tool-search").value.toLowerCase();
    root.querySelectorAll(".tool-group").forEach((section) => {
      const showGroup = active === "all" || active === section.dataset.category;
      let any = false;
      section.querySelectorAll(".feature-card").forEach((a) => {
        const show = showGroup && a.textContent.toLowerCase().includes(q);
        a.hidden = !show;
        if (show) any = true;
      });
      section.hidden = !any;
    });
  };
  root.querySelector("#tool-search").oninput = update;
  root.querySelectorAll("[data-group]").forEach(
    (b) =>
      (b.onclick = () => {
        active = b.dataset.group;
        root
          .querySelectorAll("[data-group]")
          .forEach((x) => x.classList.toggle("active", x === b));
        update();
      }),
  );
}

export function renderToolbox(root, filter = "") {
  renderToolboxLegacy(root, filter);
  const intro = root.querySelector(".page-intro");
  if (intro) {
    const eyebrow = intro.querySelector(".eyebrow");
    const title = intro.querySelector("h1");
    const lead = intro.querySelector(".lead");
    if (eyebrow) eyebrow.textContent = "Tools";
    if (title) title.textContent = "Find a tool for this moment.";
    if (lead) lead.textContent = "Search by feeling, problem or goal. Try one tool and keep only what helps.";
  }
}

const readField = (field, form) => {
  if (field.type === "checks")
    return [...form.querySelectorAll('input[type="checkbox"]:checked')]
      .filter((input) => input.name === field.id)
      .map((input) => input.value);
  return form.elements.namedItem(field.id)?.value ?? "";
};
function fieldHtml(f) {
  if (f.type === "checks")
    return `<fieldset class="tool-field"><legend>${esc(f.label)}</legend><div class="choice-grid">${f.options.map((o) => `<label class="choice-pill"><input type="checkbox" name="${esc(f.id)}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join("")}</div></fieldset>`;
  if (f.type === "select")
    return `<label class="field">${esc(f.label)}<select name="${esc(f.id)}">${f.options.map((o) => `<option>${esc(o)}</option>`).join("")}</select></label>`;
  if (f.type === "range")
    return `<label class="field">${esc(f.label)}<input type="range" name="${esc(f.id)}" min="${f.min}" max="${f.max}" value="${Math.round((f.min + f.max) / 2)}"><output class="range-value">${Math.round((f.min + f.max) / 2)} / ${f.max}</output></label>`;
  if (f.type === "datetime-local")
    return `<label class="field">${esc(f.label)}<input type="datetime-local" name="${esc(f.id)}"></label>`;
  return `<label class="field">${esc(f.label)}<textarea name="${esc(f.id)}" placeholder="${esc(f.placeholder || "Write a few words if helpful…")}"></textarea></label>`;
}
const brainBuckets = [
  "Questions",
  "Possible actions",
  "People & conversations",
  "Worries",
  "Decisions",
  "Things to understand",
  "Other thoughts",
];
function renderBrainMap(results) {
  const text = String(results.dump || "");
  const buckets = Object.fromEntries(brainBuckets.map((k) => [k, []]));
  for (const line of text
    .split(/[\n.!?]+/)
    .map((s) => s.trim())
    .filter(Boolean)) {
    const l = line.toLowerCase(),
      key = /\?|how do|why do|wonder|what if/.test(l)
        ? "Questions"
        : /need to|have to|could|should|todo|do next|email|call|write|finish/.test(
              l,
            )
          ? "Possible actions"
          : /\b(he|she|they|my friend|partner|mum|dad|boss|colleague|teacher)\b/.test(
                l,
              )
            ? "People & conversations"
            : /afraid|worry|scared|risk|might|what if/.test(l)
              ? "Worries"
              : /choose|decision|decide|option/.test(l)
                ? "Decisions"
                : /understand|learn|find out|research/.test(l)
                  ? "Things to understand"
                  : "Other thoughts";
    buckets[key].push(line);
  }
  return `<div class="brain-map"><p class="notice">A rough first sort based on the words in your notes. It can be wrong; every card below is editable and movable.</p>${brainBuckets.map((k) => `<label class="field"><b>${k}</b><textarea data-bucket="${esc(k)}">${esc(buckets[k].join("\n"))}</textarea></label>`).join("")}</div>`;
}

function renderBodyCheckLegacy(root, tool) {
  root.innerHTML = `<div class="wrap tool-page body-check-page"><a class="back-link" href="#tools">← All tools</a><section class="tool-heading"><p class="eyebrow">Feel & notice / Body Map</p><h1>${esc(tool.title)}</h1><p class="lead">${esc(tool.short)}</p><p class="privacy-note">Your answers stay in this browser unless you choose to save the map.</p></section><section id="body-mood-gate">${moodRatingMarkup({ id: "body-mood-before", outputId: "body-mood-before-value", buttonId: "body-mood-start", heading: "How are you feeling before you begin?", intro: "Slide to mark your overall mood. This is the existing starting check for the tool.", buttonText: "Open the Body Map" })}</section><div id="body-check-content" hidden></div><div class="tool-next row"><a class="chip" href="#tool/state-check">Body & State Check</a><a class="chip" href="#compass">Emotion Compass</a><a class="chip" href="#maps">My Maps</a></div></div>`;
  bindMoodRating(root, {
    id: "body-mood-before",
    outputId: "body-mood-before-value",
    buttonId: "body-mood-start",
    onSubmit: (moodBefore) => {
      root.querySelector("#body-mood-gate").hidden = true;
      const content = root.querySelector("#body-check-content");
      content.hidden = false;
      mountBodyCheck(content, moodBefore);
    },
  });

  function mountBodyCheck(content, moodBefore) {
    const state = {
      mode: null,
      view: "front",
      areas: [],
      activeArea: "",
      unclearLocation: false,
      sensations: [],
      sensationFamily: "",
      otherSensation: "",
      intensity: 2,
      afterIntensity: 2,
      movement: "",
      layer: "",
      side: "",
      onset: "",
      onsetContext: [],
      movementChange: "",
      postureChange: "",
      urges: [],
      possibilities: [],
      sensationConfidence: 60,
      causeConfidence: 20,
      experiment: "",
      experimentOutcome: "",
      experimentNote: "",
    };
    const locationAreas = {
      front: ["Head / face", "Jaw", "Throat", "Chest", "Stomach / abdomen", "Arms / hands", "Pelvis", "Legs / feet"],
      back: ["Back of head", "Neck", "Shoulders", "Upper back", "Lower back", "Arms / hands", "Pelvis", "Legs / feet"],
    };
    const sensationFamilies = {
      "Pressure / tension": ["Tight", "Tense", "Clenched", "Compressed", "Heavy", "Pressure"],
      Movement: ["Fluttering", "Shaking", "Trembling", "Pulsing", "Twitching", "Restless"],
      Temperature: ["Hot", "Warm", "Cold", "Chills", "Burning"],
      "Sensation change": ["Numb", "Tingling", "Pins and needles", "Buzzing", "Hypersensitive"],
      "Internal feeling": ["Empty", "Hollow", "Sinking", "Knotted", "Full", "Nauseous"],
      "Pain / discomfort": ["Aching", "Sharp", "Throbbing", "Sore", "Cramping", "Painful"],
    };
    const onsetOptions = ["Just now", "Minutes ago", "Earlier today", "Since waking", "A few days", "Longer", "Comes and goes", "Not sure"];
    const onsetContextOptions = ["Woke up", "Ate", "Caffeine", "Exercise", "Argument", "Stressful thought", "Social situation", "Work / study", "Screen time", "Changed position", "Illness", "Nothing obvious"];
    const possibilityOptions = ["Stress", "Exertion", "Caffeine", "Posture", "Illness", "Hunger", "Sensory load", "Anxiety", "Medication", "Something else", "No idea"];
    const movementOptions = ["Staying still", "Spreading", "Moving around", "Coming in waves", "Pulsing", "Getting stronger", "Fading", "Coming and going"];
    const bodyUrges = ["Tense", "Shrink", "Freeze", "Move", "Run", "Stretch", "Hide", "Curl up", "Reach out", "Push away", "Shake", "Cry", "Sleep", "Eat", "Be still", "No urge"];
    const intensityLabels = ["Barely there", "Noticeable", "Distracting", "Strong", "Overwhelming"];
    const stageNames = { locate: "Locate", describe: "Describe", characterise: "Characterise", details: "Tell me more", result: "Your body map", experiment: "Test one change", compare: "Compare", final: "What we learned" };
    const stageList = () => state.mode === "quick" ? ["locate", "describe", "characterise", "result", "experiment", "compare", "final"] : ["locate", "describe", "characterise", "details", "result", "experiment", "compare", "final"];
    const selectedLabel = (item, list) => list.includes(item) ? "selected" : "";
    const escList = (list) => list.map((item) => `<span class="body-map-tag">${esc(item)}</span>`).join("");
    const choiceButtons = (items, group, selected, labels = items) => items.map((item, index) => `<button type="button" class="body-choice ${selected === item ? "selected" : ""}" data-body-choice-group="${esc(group)}" data-body-choice="${esc(item)}"><span>${esc(labels[index] || item)}</span></button>`).join("");
    const multiButtons = (items, group, selected) => items.map((item) => `<button type="button" class="body-choice ${selected.includes(item) ? "selected" : ""}" data-body-multi-group="${esc(group)}" data-body-multi="${esc(item)}">${esc(item)}</button>`).join("");
    const progress = (key) => { const list = stageList(); const index = list.indexOf(key); return `<div class="state-scan-progress body-progress" aria-label="Body Map progress">${list.map((item, i) => `<span class="${i <= index ? "done" : ""} ${item === key ? "current" : ""}" title="${esc(stageNames[item])}"></span>`).join("")}<b>${index + 1} / ${list.length}</b></div>`; };
    const nav = (key, back = true) => { const list = stageList(); const index = list.indexOf(key); return `<div class="body-scan-nav">${back && index > 0 ? `<button type="button" class="button secondary" data-body-back="${esc(list[index - 1])}">Back</button>` : ""}${index < list.length - 1 ? `<button type="button" class="button" data-body-next="${esc(list[index + 1])}">Continue</button>` : ""}</div>`; };
    const renderShell = (key, inner) => {
      content.innerHTML = `<div class="state-scan-shell body-map-shell"><div class="state-scan-topline"><div><p class="eyebrow">Body Map</p><h2>${esc(stageNames[key])}</h2></div><span class="state-scan-time">${state.mode === "quick" ? "Quick map" : "Detailed map"}</span></div>${progress(key)}<section class="state-scan-card body-scan-card" data-body-stage="${esc(key)}">${inner}</section><p id="body-scan-status" class="interactive-status" aria-live="polite">Nothing is scored. Skip anything that does not fit.</p></div>`;
      content.querySelectorAll("[data-body-next], [data-body-back]").forEach((button) => button.addEventListener("click", () => renderStage(button.dataset.bodyNext || button.dataset.bodyBack)));
    };
    const renderStage = (key) => ({ locate: renderLocate, describe: renderDescribe, characterise: renderCharacterise, details: renderDetails, result: renderResult, experiment: renderExperiment, compare: renderCompare, final: renderFinal }[key]());

    function renderMode() {
      content.innerHTML = `<div class="state-scan-shell body-map-shell"><div class="state-scan-topline"><div><p class="eyebrow">Body Map</p><h2>What is your body doing?</h2><p class="state-scan-lead">Build a picture from simple observations. You do not need medical or psychological words.</p></div></div><div class="state-mode-grid"><button type="button" class="state-mode-card" data-body-mode="quick"><span>1–2 minutes</span><strong>Quick Map</strong><p>Locate it, describe it, and see a careful summary.</p></button><button type="button" class="state-mode-card" data-body-mode="deep"><span>3–5 minutes</span><strong>Detailed Map</strong><p>Add timing, movement, context, urges and possible contributors.</p></button></div><details class="state-why"><summary>What this tool is for</summary><p>It helps you notice the body before explaining it. A sensation can have physical, emotional, sensory, environmental or unknown contributors.</p></details><p class="interactive-status">Choose how much detail you want.</p></div>`;
      content.querySelectorAll("[data-body-mode]").forEach((button) => button.addEventListener("click", () => { state.mode = button.dataset.bodyMode; renderStage("locate"); }));
    }

    function renderLocate() {
      const areas = locationAreas[state.view];
      const areaButtons = areas.map((area) => `<button type="button" class="body-area-button ${selectedLabel(area, state.areas)} ${state.activeArea === area ? "active" : ""}" data-body-area="${esc(area)}"><span>${esc(area)}</span>${state.areas.includes(area) ? `<i aria-hidden="true">●</i>` : ""}</button>`).join("");
      renderShell("locate", `<p class="state-scan-question">Where do you notice something?</p><p class="state-scan-help">Tap one area or several. Select <b>Not sure where</b> if the signal is difficult to place.</p><div class="body-view-tabs"><button type="button" class="chip ${state.view === "front" ? "active" : ""}" data-body-view="front">Front</button><button type="button" class="chip ${state.view === "back" ? "active" : ""}" data-body-view="back">Back</button></div><div class="body-map-figure" role="group" aria-label="Choose body areas">${areaButtons}</div><div class="body-special-choices"><button type="button" class="body-special ${state.areas.includes("Whole body") ? "selected" : ""}" data-body-special="Whole body">Everywhere</button><button type="button" class="body-special ${state.unclearLocation ? "selected" : ""}" data-body-special="Not sure where">Not sure where</button></div><p class="body-selected-summary">${state.areas.length ? `Selected: ${escList(state.areas)}` : "Nothing selected yet"}</p>${nav("locate", false)}`);
      content.querySelectorAll("[data-body-view]").forEach((button) => button.addEventListener("click", () => { state.view = button.dataset.bodyView; renderLocate(); }));
      content.querySelectorAll("[data-body-area]").forEach((button) => button.addEventListener("click", () => { const area = button.dataset.bodyArea; state.areas = state.areas.includes(area) ? state.areas.filter((x) => x !== area) : [...state.areas.filter((x) => x !== "Whole body" && x !== "Not sure where"), area]; state.activeArea = area; state.unclearLocation = false; renderLocate(); }));
      content.querySelectorAll("[data-body-special]").forEach((button) => button.addEventListener("click", () => { const value = button.dataset.bodySpecial; if (value === "Whole body") { state.areas = state.areas.includes(value) ? [] : [value]; state.unclearLocation = false; } else { state.unclearLocation = !state.unclearLocation; state.areas = state.unclearLocation ? [value] : []; } state.activeArea = value; renderLocate(); }));
      const next = content.querySelector("[data-body-next]"); next.disabled = !state.areas.length; next.title = next.disabled ? "Choose an area or Not sure where" : "Continue";
    }

    function renderDescribe() {
      const families = Object.entries(sensationFamilies).map(([family, items]) => `<section class="body-sensation-family"><h3>${esc(family)}</h3><div class="body-choice-grid">${multiButtons(items, "sensation", state.sensations)}</div></section>`).join("");
      renderShell("describe", `<p class="state-scan-question">What does it feel like?</p><p class="state-scan-help">Choose ordinary sensory words. More than one can fit.</p>${families}<div class="body-choice-grid body-other-choices">${multiButtons(["Hard to describe"], "sensation", state.sensations)}</div><label class="state-text-label">Something else?<input id="body-other-sensation" value="${esc(state.otherSensation)}" placeholder="Use your own words"></label>${nav("describe")}`);
      content.querySelectorAll("[data-body-multi-group='sensation']").forEach((button) => button.addEventListener("click", () => { const item = button.dataset.bodyMulti; state.sensations = state.sensations.includes(item) ? state.sensations.filter((x) => x !== item) : [...state.sensations, item]; renderDescribe(); }));
      content.querySelector("#body-other-sensation").addEventListener("input", (event) => { state.otherSensation = event.target.value; });
    }

    function renderCharacterise() {
      renderShell("characterise", `<p class="state-scan-question">What else can you tell me?</p><p class="state-scan-help">Use the simple descriptions that fit. You can leave any part blank.</p><label class="body-range-label">How strong is it?<output id="body-intensity-value">${intensityLabels[state.intensity]}</output><input id="body-intensity" type="range" min="0" max="4" value="${state.intensity}"><span><i>Barely there</i><i>Overwhelming</i></span></label><div class="body-detail-block"><h3>What is it doing?</h3><div class="body-choice-grid">${choiceButtons(movementOptions, "movement", state.movement)}</div></div><div class="body-detail-block"><h3>Does it feel mostly…</h3><div class="body-choice-grid">${choiceButtons(["On the surface", "Inside", "Muscular", "In the joints", "Hard to place"], "layer", state.layer)}</div></div><div class="body-detail-block"><h3>Which side?</h3><div class="body-choice-grid">${choiceButtons(["Left", "Right", "Both sides", "Not applicable / not sure"], "side", state.side)}</div></div>${nav("characterise")}`);
      content.querySelector("#body-intensity").addEventListener("input", (event) => { state.intensity = Number(event.target.value); content.querySelector("#body-intensity-value").textContent = intensityLabels[state.intensity]; });
      content.querySelectorAll("[data-body-choice-group]").forEach((button) => button.addEventListener("click", () => { state[button.dataset.bodyChoiceGroup] = button.dataset.bodyChoice; renderCharacterise(); }));
    }

    function renderDetails() {
      renderShell("details", `<p class="state-scan-question">Tell me a little more</p><p class="state-scan-help">This part is optional detail, not a diagnosis.</p><div class="body-detail-block"><h3>When did you first notice it?</h3><div class="body-choice-grid">${choiceButtons(onsetOptions, "onset", state.onset)}</div></div><div class="body-detail-block"><h3>Did anything happen around then?</h3><div class="body-choice-grid">${multiButtons(onsetContextOptions, "onsetContext", state.onsetContext)}</div></div><div class="body-detail-block"><h3>What happens when you move?</h3><div class="body-choice-grid">${choiceButtons(["Gets better", "Gets worse", "No change", "Unsure"], "movementChange", state.movementChange)}</div></div><div class="body-detail-block"><h3>Does changing posture affect it?</h3><div class="body-choice-grid">${choiceButtons(["Gets better", "Gets worse", "No change", "Unsure"], "postureChange", state.postureChange)}</div></div><div class="body-detail-block"><h3>What does your body want to do?</h3><div class="body-choice-grid">${multiButtons(bodyUrges, "urges", state.urges)}</div></div><div class="body-detail-block"><h3>What could be contributing?</h3><p class="body-small-note">These are possibilities, not explanations.</p><div class="body-choice-grid">${multiButtons(possibilityOptions, "possibilities", state.possibilities)}</div></div><div class="body-confidence-grid"><label class="body-range-label">How sure are you about the sensation?<output id="body-sensation-confidence-value">${state.sensationConfidence}%</output><input id="body-sensation-confidence" type="range" min="0" max="100" step="10" value="${state.sensationConfidence}"></label><label class="body-range-label">How sure are you about the cause?<output id="body-cause-confidence-value">${state.causeConfidence}%</output><input id="body-cause-confidence" type="range" min="0" max="100" step="10" value="${state.causeConfidence}"></label></div>${nav("details")}`);
      content.querySelectorAll("[data-body-choice-group]").forEach((button) => button.addEventListener("click", () => { state[button.dataset.bodyChoiceGroup] = button.dataset.bodyChoice; renderDetails(); }));
      content.querySelectorAll("[data-body-multi-group]").forEach((button) => button.addEventListener("click", () => { const key = button.dataset.bodyMultiGroup; const item = button.dataset.bodyMulti; state[key] = state[key].includes(item) ? state[key].filter((x) => x !== item) : [...state[key], item]; renderDetails(); }));
      content.querySelector("#body-sensation-confidence").addEventListener("input", (event) => { state.sensationConfidence = Number(event.target.value); content.querySelector("#body-sensation-confidence-value").textContent = `${state.sensationConfidence}%`; });
      content.querySelector("#body-cause-confidence").addEventListener("input", (event) => { state.causeConfidence = Number(event.target.value); content.querySelector("#body-cause-confidence-value").textContent = `${state.causeConfidence}%`; });
    }

    function patternText() {
      const upper = state.areas.some((area) => /Head|Jaw|Throat|Chest|Shoulder|Neck|Back/.test(area));
      const spread = state.areas.length >= 3 || state.areas.includes("Whole body");
      if (state.unclearLocation) return "Your body signal is currently hard to localise. That is useful information too; you do not need to force a precise label.";
      if (spread) return "The sensations are spread across several areas rather than concentrated in one place. The map can show a pattern without explaining its cause.";
      if (upper) return "The sensations appear more concentrated in the upper body. That can accompany many different physical, emotional, sensory or situational states.";
      return "The sensations appear more localised. Location can help you describe the experience, but it does not identify what caused it.";
    }
    function sensationText() { return [...state.sensations, state.otherSensation].filter(Boolean).join(" · ") || "Not described yet"; }
    function renderResult() {
      const areas = state.areas.length ? state.areas : ["Not sure where"];
      const hypothesis = state.possibilities.length ? escList(state.possibilities) : `<span class="body-map-tag muted">No possibilities selected</span>`;
      renderShell("result", `<p class="state-scan-question">Here is the map you built.</p><div class="body-map-result"><div class="body-map-result-visual" aria-label="Selected body areas"><div class="body-map-result-core"><span>BODY</span><strong>${state.unclearLocation ? "?" : "●"}</strong></div>${areas.map((area) => `<span class="body-result-area">${esc(area)}</span>`).join("")}</div><div class="body-map-result-details"><section><span class="state-map-label">What you noticed</span><strong>${esc(sensationText())}</strong><p>${esc(areas.join(" · "))} · ${esc(intensityLabels[state.intensity])}${state.movement ? ` · ${esc(state.movement)}` : ""}</p></section><section><span class="state-map-label">What we know</span><p>${state.onset ? `First noticed: ${esc(state.onset)}. ` : ""}${state.layer ? `It feels ${esc(state.layer.toLowerCase())}. ` : ""}${state.movementChange ? `Movement: ${esc(state.movementChange.toLowerCase())}.` : ""}</p></section><section><span class="state-map-label">What we do not know yet</span><p>What is causing the sensation. These selected possibilities are not explanations.</p></section></div></div><div class="body-map-insight"><h3>One careful observation</h3><p>${esc(patternText())}</p></div><div class="body-possibility-panel"><h3>Possible contributors</h3><p>${hypothesis}</p><small>Body sensations can accompany physical states, emotions, environments, illness, fatigue, exertion and many other things.</small></div><div class="body-legend"><span><i class="legend-mark tension"></i>Tension / pressure</span><span><i class="legend-mark movement"></i>Movement / waves</span><span><i class="legend-mark temperature"></i>Temperature</span><span><i class="legend-mark change"></i>Numbness / tingling</span></div>${nav("result")}`);
    }

    function experimentOptions() {
      const options = [];
      if (state.sensations.some((item) => /Tight|Tense|Clenched|Compressed/.test(item)) || state.areas.some((item) => /Jaw|Shoulder|Neck/.test(item))) options.push("Unclench gently and drop your shoulders");
      if (state.movementChange || state.postureChange || state.layer === "Muscular") options.push("Change position or move gently");
      if (state.sensations.some((item) => /Fluttering|Pulsing|Shaking|Trembling/.test(item))) options.push("Breathe normally and notice whether the wave changes");
      options.push("Rest the area or lower one source of sensory demand", "Drink water or eat something ordinary if that fits", "Do nothing yet; observe it for a few minutes");
      return [...new Set(options)].slice(0, 5);
    }
    function renderExperiment() {
      const options = experimentOptions();
      renderShell("experiment", `<p class="state-scan-question">What could you test gently?</p><p class="state-scan-help">Choose one low-cost change. This is an observation, not a medical test.</p><div class="body-experiment-grid">${options.map((item) => `<button type="button" class="body-experiment-card ${state.experiment === item ? "selected" : ""}" data-body-experiment="${esc(item)}"><strong>${esc(item)}</strong><span>${state.experiment === item ? "Selected" : "Try this"}</span></button>`).join("")}</div>${state.experiment ? `<div class="body-experiment-callout"><p>Try it for a short while, if comfortable, then record what changed.</p><button type="button" class="button" data-body-start-experiment>I tried it — compare</button></div>` : ""}${nav("experiment")}`);
      content.querySelectorAll("[data-body-experiment]").forEach((button) => button.addEventListener("click", () => { state.experiment = button.dataset.bodyExperiment; renderExperiment(); }));
      content.querySelector("[data-body-start-experiment]")?.addEventListener("click", () => renderStage("compare"));
    }

    function renderCompare() {
      renderShell("compare", `<p class="state-scan-question">Did anything change?</p><p class="state-scan-help">A change does not prove a cause. No change is useful information too.</p><label class="body-range-label">How strong is it now?<output id="body-after-intensity-value">${intensityLabels[state.afterIntensity]}</output><input id="body-after-intensity" type="range" min="0" max="4" value="${state.afterIntensity}"><span><i>Barely there</i><i>Overwhelming</i></span></label><div class="body-choice-grid body-change-options">${choiceButtons(["Better", "Worse", "Unchanged", "Unsure"], "experimentOutcome", state.experimentOutcome)}</div><label class="state-text-label">What did you notice?<textarea id="body-experiment-note" rows="3" placeholder="For example: moving changed it, but the tightness remained.">${esc(state.experimentNote)}</textarea>${nav("compare")}`);
      content.querySelector("#body-after-intensity").addEventListener("input", (event) => { state.afterIntensity = Number(event.target.value); content.querySelector("#body-after-intensity-value").textContent = intensityLabels[state.afterIntensity]; });
      content.querySelectorAll("[data-body-choice-group='experimentOutcome']").forEach((button) => button.addEventListener("click", () => { state.experimentOutcome = button.dataset.bodyChoice; renderCompare(); }));
      content.querySelector("#body-experiment-note").addEventListener("input", (event) => { state.experimentNote = event.target.value; });
    }

    function renderFinal() {
      const delta = state.afterIntensity - state.intensity;
      const conclusion = delta < 0 ? "The sensation became less intense after the change. That suggests the tested condition may have been affecting it, but it does not prove a single cause." : delta > 0 ? "The sensation became stronger after the change. The test may not have suited this moment, or another factor may be changing at the same time." : "The sensation stayed about the same. It may need a different kind of attention, or more observation in context.";
      const entry = { title: "Body Check", tool: "body-check", answers: { ...state, moodBefore }, moodCheck: null };
      const text = () => `Body Check\n\nAreas: ${state.areas.join(", ") || "Not sure where"}\nSensation: ${sensationText()}\nIntensity before: ${intensityLabels[state.intensity]}\nWhat it is doing: ${state.movement || "—"}\nLayer: ${state.layer || "—"}\nWhen it started: ${state.onset || "—"}\nPossible contributors: ${state.possibilities.join(", ") || "—"}\nTested: ${state.experiment || "—"}\nOutcome: ${state.experimentOutcome || "—"}\nIntensity after: ${intensityLabels[state.afterIntensity]}`;
      renderShell("final", `<p class="state-scan-question">What did the body map teach you?</p><div class="body-before-after"><article><span>Before</span><strong>${esc(intensityLabels[state.intensity])}</strong><small>${esc(sensationText())}</small></article><div class="state-before-after-line" aria-hidden="true"></div><article><span>After</span><strong>${esc(intensityLabels[state.afterIntensity])}</strong><small>${esc(state.experimentOutcome || "Not rated")}</small></article></div><div class="body-map-insight"><h3>One careful conclusion</h3><p>${esc(conclusion)}</p><p>Notice the sensation before attaching an emotion or explanation to it. Clear sensation and uncertain cause can exist together.</p></div><div class="body-confidence-grid"><section><span class="state-map-label">Confidence in the sensation</span><strong>${state.sensationConfidence}%</strong><p>You may know exactly what you feel without knowing why.</p></section><section><span class="state-map-label">Confidence in the cause</span><strong>${state.causeConfidence}%</strong><p>Low cause confidence is not a failure; it is an honest result.</p></section></div><div class="row body-result-actions"><button type="button" class="button" id="body-save-map">Save to My Maps</button><button type="button" class="button secondary" id="body-download-map">Download map</button><button type="button" class="button secondary" id="body-copy-map">Copy text</button></div><p id="body-result-status" class="fine" role="status"></p><a class="button secondary" href="#compass">Explore the Emotion Compass</a>`);
      content.querySelector("#body-save-map").addEventListener("click", () => { try { saveMap(entry); content.querySelector("#body-result-status").textContent = "Saved on this device."; } catch { content.querySelector("#body-result-status").textContent = "This browser could not save the map."; } });
      content.querySelector("#body-download-map").addEventListener("click", () => downloadText("body-map.txt", text()));
      content.querySelector("#body-copy-map").addEventListener("click", async () => { try { await navigator.clipboard.writeText(text()); content.querySelector("#body-result-status").textContent = "Copied."; } catch { content.querySelector("#body-result-status").textContent = "Copy was blocked by this browser. Use Download instead."; } });
    }

    renderMode();
  }
}

function renderBodyCheck(root, tool) {
  root.innerHTML = `<div class="wrap tool-page body-check-page"><a class="back-link" href="#tools">← All tools</a><section class="tool-heading"><p class="eyebrow">Feel & notice / Body Map</p><h1>${esc(tool.title)}</h1><p class="lead">${esc(tool.short)}</p><p class="privacy-note">Your answers stay in this browser unless you choose to save the map.</p></section><section id="body-mood-gate">${moodRatingMarkup({ id: "body-mood-before", outputId: "body-mood-before-value", buttonId: "body-mood-start", heading: "How are you feeling before you begin?", intro: "Slide to mark your overall mood. This is the existing starting check for the tool.", buttonText: "Open the Body Map" })}</section><div id="body-check-content" hidden></div><div class="tool-next row"><a class="chip" href="#tool/state-check">Body & State Check</a><a class="chip" href="#compass">Emotion Compass</a><a class="chip" href="#maps">My Maps</a></div></div>`;
  bindMoodRating(root, {
    id: "body-mood-before",
    outputId: "body-mood-before-value",
    buttonId: "body-mood-start",
    onSubmit: (moodBefore) => {
      root.querySelector("#body-mood-gate").hidden = true;
      const content = root.querySelector("#body-check-content");
      content.hidden = false;
      mountBodyCheck(content, moodBefore);
    },
  });

  function mountBodyCheck(content, moodBefore) {
    const newMarker = (area) => ({
      area,
      sensations: [],
      otherSensation: "",
      intensity: 2,
      afterIntensity: 2,
      movement: "",
      layer: "",
      side: "",
      onset: "",
      onsetContext: [],
      movementChange: "",
      postureChange: "",
      urges: [],
      possibilities: [],
      sensationConfidence: 60,
      causeConfidence: 20,
      familiarity: "",
      baselineDifference: "",
      experiment: "",
      experimentOutcome: "",
      experimentNote: "",
    });
    const state = {
      mode: null,
      view: "front",
      markers: [],
      activeArea: "",
      unclearLocation: false,
    };
    const locationAreas = {
      front: ["Head / face", "Jaw", "Throat", "Chest", "Stomach / abdomen", "Arms / hands", "Pelvis", "Legs / feet"],
      back: ["Back of head", "Neck", "Shoulders", "Upper back", "Lower back", "Arms / hands", "Pelvis", "Legs / feet"],
    };
    const sensationFamilies = {
      "Pressure / tension": ["Tight", "Tense", "Clenched", "Compressed", "Heavy", "Pressure"],
      Movement: ["Fluttering", "Shaking", "Trembling", "Pulsing", "Twitching", "Restless"],
      Temperature: ["Hot", "Warm", "Cold", "Chills", "Burning"],
      "Sensation change": ["Numb", "Tingling", "Pins and needles", "Buzzing", "Hypersensitive"],
      "Internal feeling": ["Empty", "Hollow", "Sinking", "Knotted", "Full", "Nauseous"],
      "Pain / discomfort": ["Aching", "Sharp", "Throbbing", "Sore", "Cramping", "Painful"],
    };
    const onsetOptions = ["Just now", "Minutes ago", "Earlier today", "Since waking", "A few days", "Longer", "Comes and goes", "Not sure"];
    const onsetContextOptions = ["Woke up", "Ate", "Caffeine", "Exercise", "Argument", "Stressful thought", "Social situation", "Work / study", "Screen time", "Changed position", "Illness", "Nothing obvious"];
    const possibilityOptions = ["Stress", "Exertion", "Caffeine", "Posture", "Illness", "Hunger", "Sensory load", "Anxiety", "Medication", "Something else", "No idea"];
    const movementOptions = ["Staying still", "Spreading", "Moving around", "Coming in waves", "Pulsing", "Getting stronger", "Fading", "Coming and going"];
    const bodyUrges = ["Tense", "Shrink", "Freeze", "Move", "Run", "Stretch", "Hide", "Curl up", "Reach out", "Push away", "Shake", "Cry", "Sleep", "Eat", "Be still", "No urge"];
    const intensityLabels = ["Barely there", "Noticeable", "Distracting", "Strong", "Overwhelming"];
    const stageNames = { locate: "Find it", describe: "Show what you notice", characterise: "Stay with it", details: "See what changes it", result: "Your body map", experiment: "Try one gentle change", compare: "Notice what shifted", final: "What we learned" };
    const stageList = () => state.mode === "quick" ? ["locate", "describe", "characterise", "result", "experiment", "compare", "final"] : ["locate", "describe", "characterise", "details", "result", "experiment", "compare", "final"];
    const activeMarker = () => state.markers.find((marker) => marker.area === state.activeArea) || state.markers[0] || null;
    const ensureMarker = (area) => {
      let marker = state.markers.find((item) => item.area === area);
      if (!marker) {
        marker = newMarker(area);
        state.markers.push(marker);
      }
      state.activeArea = area;
      return marker;
    };
    const markerLabel = (marker) => [...marker.sensations, marker.otherSensation].filter(Boolean).join(" · ") || "Not described yet";
    const escList = (list) => list.map((item) => `<span class="body-map-tag">${esc(item)}</span>`).join("");
    const choiceButtons = (items, group, selected) => items.map((item) => `<button type="button" class="body-choice ${selected === item ? "selected" : ""}" data-body-choice-group="${esc(group)}" data-body-choice="${esc(item)}"><span>${esc(item)}</span></button>`).join("");
    const multiButtons = (items, group, selected) => items.map((item) => `<button type="button" class="body-choice ${selected.includes(item) ? "selected" : ""}" data-body-multi-group="${esc(group)}" data-body-multi="${esc(item)}">${esc(item)}</button>`).join("");
    const progress = (key) => {
      const actFor = { locate: "find", describe: "show", characterise: "show", details: "watch", result: "map", experiment: "watch", compare: "watch", final: "map" };
      const acts = [{ id: "find", label: "Find it" }, { id: "show", label: "Show it" }, { id: "watch", label: "Watch it" }, { id: "map", label: "Map it" }];
      const current = actFor[key];
      const currentIndex = acts.findIndex((act) => act.id === current);
      return `<div class="body-progress-acts" aria-label="Body Map stages">${acts.map((act, index) => `<span class="${index <= currentIndex ? "done" : ""} ${act.id === current ? "current" : ""}" title="${esc(act.label)}"><i></i>${esc(act.label)}</span>`).join("")}</div>`;
    };
    const nav = (key, back = true) => {
      const list = stageList();
      const index = list.indexOf(key);
      return `<div class="body-scan-nav">${back && index > 0 ? `<button type="button" class="button secondary" data-body-back="${esc(list[index - 1])}">Back</button>` : ""}${index < list.length - 1 ? `<button type="button" class="button" data-body-next="${esc(list[index + 1])}">Continue</button>` : ""}</div>`;
    };
    const renderShell = (key, inner) => {
      content.innerHTML = `<div class="state-scan-shell body-map-shell"><div class="state-scan-topline"><div><p class="eyebrow">Body Map</p><h2>${esc(stageNames[key])}</h2></div><span class="state-scan-time">${state.mode === "quick" ? "Quick map" : "Detailed map"}</span></div>${progress(key)}<section class="state-scan-card body-scan-card" data-body-stage="${esc(key)}">${inner}</section><p id="body-scan-status" class="interactive-status" aria-live="polite">Nothing is scored. Skip anything that does not fit.</p></div>`;
      content.querySelectorAll("[data-body-next], [data-body-back]").forEach((button) => button.addEventListener("click", () => renderStage(button.dataset.bodyNext || button.dataset.bodyBack)));
    };
    const renderStage = (key) => ({ locate: renderLocate, describe: renderDescribe, characterise: renderCharacterise, details: renderDetails, result: renderResult, experiment: renderExperiment, compare: renderCompare, final: renderFinal }[key]());

    const markerTone = (marker) => {
      const values = marker.sensations.join(" ").toLowerCase();
      if (/hot|warm|cold|chill|burn/.test(values)) return "tone-temperature";
      if (/flutter|shak|trembl|puls|twitch|restless/.test(values)) return "tone-motion";
      if (/numb|tingl|pins|buzz|hypersens/.test(values)) return "tone-change";
      return "tone-pressure";
    };
    const markerMotion = (marker) => {
      const value = marker.movement || "";
      if (value === "Spreading") return "movement-spreading";
      if (/waves|Pulsing/.test(value)) return "movement-waves";
      if (/Fading|Coming and going/.test(value)) return "movement-fading";
      if (value === "Getting stronger") return "movement-growing";
      return "";
    };
    const figureShapes = {
      base: `<circle cx="120" cy="34" r="22"></circle><rect x="108" y="52" width="24" height="23" rx="10"></rect><path d="M91 73 Q120 64 149 73 L158 177 Q150 196 120 199 Q90 196 82 177 Z"></path><path d="M86 174 Q120 190 154 174 L149 218 Q120 232 91 218 Z"></path><path d="M87 78 Q77 79 67 93 L51 170 Q48 181 57 184 Q65 186 69 177 L91 111 Z"></path><path d="M153 78 Q163 79 173 93 L189 170 Q192 181 183 184 Q175 186 171 177 L149 111 Z"></path><path d="M51 171 Q45 181 51 190 Q58 194 65 184 L69 176 Z"></path><path d="M189 171 Q195 181 189 190 Q182 194 175 184 L171 176 Z"></path><path d="M91 216 Q104 224 118 223 L113 362 Q106 373 91 364 L82 231 Z"></path><path d="M149 216 Q136 224 122 223 L127 362 Q134 373 149 364 L158 231 Z"></path><path d="M92 360 Q105 369 114 364 L110 468 Q103 477 91 470 L82 380 Z"></path><path d="M148 360 Q135 369 126 364 L130 468 Q137 477 149 470 L158 380 Z"></path><path d="M91 466 Q103 474 111 468 L108 486 Q89 493 72 485 Q71 476 91 466 Z"></path><path d="M149 466 Q137 474 129 468 L132 486 Q151 493 168 485 Q169 476 149 466 Z"></path>`,
      front: {
        "Head / face": `<circle cx="120" cy="34" r="22"></circle>`,
        Jaw: `<path d="M101 39 Q120 59 139 39 Q136 57 120 60 Q104 57 101 39 Z"></path>`,
        Throat: `<rect x="108" y="52" width="24" height="23" rx="10"></rect>`,
        Chest: `<path d="M91 73 Q120 64 149 73 L153 125 Q120 137 87 125 Z"></path>`,
        "Stomach / abdomen": `<path d="M87 124 Q120 137 153 124 L158 177 Q150 196 120 199 Q90 196 82 177 Z"></path>`,
        "Arms / hands": `<path d="M86 78 Q77 79 67 93 L51 170 Q48 181 57 184 Q65 186 69 177 L91 111 Z M153 78 Q163 79 173 93 L189 170 Q192 181 183 184 Q175 186 171 177 L149 111 Z M51 171 Q45 181 51 190 Q58 194 65 184 L69 176 Z M189 171 Q195 181 189 190 Q182 194 175 184 L171 176 Z"></path>`,
        Pelvis: `<path d="M86 174 Q120 190 154 174 L149 218 Q120 232 91 218 Z"></path>`,
        "Legs / feet": `<path d="M91 216 Q104 224 118 223 L113 362 Q106 373 91 364 L82 231 Z M149 216 Q136 224 122 223 L127 362 Q134 373 149 364 L158 231 Z M92 360 Q105 369 114 364 L110 468 Q103 477 91 470 L82 380 Z M148 360 Q135 369 126 364 L130 468 Q137 477 149 470 L158 380 Z M91 466 Q103 474 111 468 L108 486 Q89 493 72 485 Q71 476 91 466 Z M149 466 Q137 474 129 468 L132 486 Q151 493 168 485 Q169 476 149 466 Z"></path>`,
      },
      back: {
        "Back of head": `<circle cx="120" cy="34" r="22"></circle>`,
        Neck: `<rect x="108" y="52" width="24" height="23" rx="10"></rect>`,
        Shoulders: `<path d="M91 73 Q120 64 149 73 L158 104 Q120 119 82 104 Z"></path>`,
        "Upper back": `<path d="M87 103 Q120 118 153 103 L154 145 Q120 157 86 145 Z"></path>`,
        "Lower back": `<path d="M86 144 Q120 157 154 144 L158 177 Q150 196 120 199 Q90 196 82 177 Z"></path>`,
        "Arms / hands": `<path d="M86 78 Q77 79 67 93 L51 170 Q48 181 57 184 Q65 186 69 177 L91 111 Z M153 78 Q163 79 173 93 L189 170 Q192 181 183 184 Q175 186 171 177 L149 111 Z M51 171 Q45 181 51 190 Q58 194 65 184 L69 176 Z M189 171 Q195 181 189 190 Q182 194 175 184 L171 176 Z"></path>`,
        Pelvis: `<path d="M86 174 Q120 190 154 174 L149 218 Q120 232 91 218 Z"></path>`,
        "Legs / feet": `<path d="M91 216 Q104 224 118 223 L113 362 Q106 373 91 364 L82 231 Z M149 216 Q136 224 122 223 L127 362 Q134 373 149 364 L158 231 Z M92 360 Q105 369 114 364 L110 468 Q103 477 91 470 L82 380 Z M148 360 Q135 369 126 364 L130 468 Q137 477 149 470 L158 380 Z M91 466 Q103 474 111 468 L108 486 Q89 493 72 485 Q71 476 91 466 Z M149 466 Q137 474 129 468 L132 486 Q151 493 168 485 Q169 476 149 466 Z"></path>`,
      },
    };
    const renderBodyFigure = (view = state.view, interactive = false) => {
      const zones = locationAreas[view].map((area) => {
        const marker = state.markers.find((item) => item.area === area);
        const classes = ["body-svg-zone", marker ? "selected" : "", marker && marker.area === state.activeArea ? "active" : "", marker ? markerTone(marker) : "", marker ? `intensity-${marker.intensity}` : "", marker ? markerMotion(marker) : ""].filter(Boolean).join(" ");
        const attrs = interactive ? `data-body-region="${esc(area)}" tabindex="0" role="button" aria-label="${esc(area)}${marker ? ", selected" : ""}"` : "";
        return `<g class="${classes}" ${attrs}>${figureShapes[view][area]}</g>`;
      }).join("");
      return `<div class="body-figure-canvas ${interactive ? "interactive" : ""}"><svg class="body-silhouette" viewBox="0 0 240 520" role="img" aria-label="${esc(view === "front" ? "Front body silhouette" : "Back body silhouette")}"><g class="body-svg-base">${figureShapes.base}</g>${zones}<text class="body-figure-view-label" x="120" y="515" text-anchor="middle">${esc(view === "front" ? "FRONT" : "BACK")}</text></svg></div>`;
    };
    const renderMode = () => {
      content.innerHTML = `<div class="state-scan-shell body-map-shell"><div class="state-scan-topline"><div><p class="eyebrow">Body Map</p><h2>What is your body doing?</h2><p class="state-scan-lead">Build a picture from direct sensations and locations. You do not need medical or psychological words.</p></div></div><div class="state-mode-grid"><button type="button" class="state-mode-card" data-body-mode="quick"><span>1–2 minutes</span><strong>Quick Map</strong><p>Locate it, describe it, and see a careful summary.</p></button><button type="button" class="state-mode-card" data-body-mode="deep"><span>3–5 minutes</span><strong>Detailed Map</strong><p>Add timing, movement, context, urges and possible contributors.</p></button></div><details class="state-why"><summary>What this tool is for</summary><p>It helps you notice the body before explaining it. A sensation can have physical, emotional, sensory, environmental or unknown contributors.</p></details><p class="interactive-status">Choose how much detail you want.</p></div>`;
      content.querySelectorAll("[data-body-mode]").forEach((button) => button.addEventListener("click", () => { state.mode = button.dataset.bodyMode; renderStage("locate"); }));
    };
    const selectArea = (area) => { ensureMarker(area); state.unclearLocation = false; renderLocate(); };
    const selectSpecial = (value) => {
      if (value === "Whole body") {
        if (state.markers.some((marker) => marker.area === value)) state.markers = state.markers.filter((marker) => marker.area !== value);
        else { state.markers = [newMarker(value)]; state.activeArea = value; }
        state.unclearLocation = false;
      } else {
        state.unclearLocation = !state.unclearLocation;
        state.markers = state.unclearLocation ? [newMarker(value)] : state.markers.filter((marker) => marker.area !== value);
        state.activeArea = value;
      }
      renderLocate();
    };
    function renderLocate() {
      const areas = locationAreas[state.view];
      const areaButtons = areas.map((area) => `<button type="button" class="body-area-button ${state.markers.some((marker) => marker.area === area) ? "selected" : ""} ${state.activeArea === area ? "active" : ""}" data-body-area="${esc(area)}"><span>${esc(area)}</span>${state.markers.some((marker) => marker.area === area) ? `<i aria-hidden="true">●</i>` : ""}</button>`).join("");
      const selected = state.markers.map((marker) => `<span class="body-map-tag ${marker.area === state.activeArea ? "active" : ""}">${esc(marker.area)}${marker.area !== "Whole body" && marker.area !== "Not sure where" ? ` <button type="button" data-body-remove-area="${esc(marker.area)}" aria-label="Remove ${esc(marker.area)}">×</button>` : ""}</span>`).join("");
      renderShell("locate", `<p class="state-scan-question">Where do you notice something?</p><p class="state-scan-help">Tap the body itself, or use the labelled list below. You can map more than one place; each place keeps its own sensations.</p><div class="body-view-tabs"><button type="button" class="chip ${state.view === "front" ? "active" : ""}" data-body-view="front">Front</button><button type="button" class="chip ${state.view === "back" ? "active" : ""}" data-body-view="back">Back</button></div><div class="body-map-layout"><div class="body-map-figure-wrap"><div class="body-figure-instruction">Tap a body area to mark it</div>${renderBodyFigure(state.view, true)}</div><div class="body-area-fallback"><p class="body-fallback-label">Accessible area list</p><div class="body-area-list">${areaButtons}</div></div></div><div class="body-special-choices"><button type="button" class="body-special ${state.markers.some((marker) => marker.area === "Whole body") ? "selected" : ""}" data-body-special="Whole body">Everywhere</button><button type="button" class="body-special ${state.unclearLocation ? "selected" : ""}" data-body-special="Not sure where">Not sure where</button></div><p class="body-selected-summary">${selected || "Nothing selected yet"}</p>${nav("locate", false)}`);
      content.querySelectorAll("[data-body-view]").forEach((button) => button.addEventListener("click", () => { state.view = button.dataset.bodyView; renderLocate(); }));
      content.querySelectorAll("[data-body-region], [data-body-area]").forEach((button) => {
        const choose = () => selectArea(button.dataset.bodyRegion || button.dataset.bodyArea);
        button.addEventListener("click", choose);
        button.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(); } });
      });
      content.querySelectorAll("[data-body-special]").forEach((button) => button.addEventListener("click", () => selectSpecial(button.dataset.bodySpecial)));
      content.querySelectorAll("[data-body-remove-area]").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); state.markers = state.markers.filter((marker) => marker.area !== button.dataset.bodyRemoveArea); state.activeArea = state.markers[0]?.area || ""; state.unclearLocation = false; renderLocate(); }));
      const next = content.querySelector("[data-body-next]");
      next.disabled = !state.markers.length;
      next.title = next.disabled ? "Choose an area or Not sure where" : "Continue";
      next.addEventListener("click", () => { if (!state.activeArea && state.markers[0]) state.activeArea = state.markers[0].area; });
    }
    function renderDescribe() {
      const marker = activeMarker();
      if (!marker) return renderLocate();
      const families = Object.entries(sensationFamilies).map(([family, items]) => `<details class="body-sensation-family"><summary>${esc(family)}<span>Tap to choose words</span></summary><div class="body-choice-grid">${multiButtons(items, "sensation", marker.sensations)}</div></details>`).join("");
      renderShell("describe", `<p class="state-scan-question">What does ${esc(marker.area.toLowerCase())} feel like?</p><p class="state-scan-help">Start with the family that fits. The specific words stay tucked away until you ask for them.</p><div class="body-active-location"><span>Mapping</span><strong>${esc(marker.area)}</strong><button type="button" class="chip" data-body-return-locate>Change area</button></div>${families}<div class="body-choice-grid body-other-choices">${multiButtons(["Hard to describe"], "sensation", marker.sensations)}</div><label class="state-text-label">Something else?<input id="body-other-sensation" value="${esc(marker.otherSensation)}" placeholder="Use your own words"></label>${nav("describe")}`);
      content.querySelectorAll("[data-body-multi-group='sensation']").forEach((button) => button.addEventListener("click", () => { const item = button.dataset.bodyMulti; marker.sensations = marker.sensations.includes(item) ? marker.sensations.filter((value) => value !== item) : [...marker.sensations, item]; renderDescribe(); }));
      content.querySelector("#body-other-sensation").addEventListener("input", (event) => { marker.otherSensation = event.target.value; });
      content.querySelector("[data-body-return-locate]").addEventListener("click", () => renderStage("locate"));
    }
    function renderCharacterise() {
      const marker = activeMarker();
      if (!marker) return renderLocate();
      const sideAreas = /Arm|hand|Leg|foot|Shoulder|Jaw|Pelvis|back|Neck/i.test(marker.area);
      renderShell("characterise", `<p class="state-scan-question">Stay with what you can notice.</p><p class="state-scan-help">Intensity belongs to this mapped area, so the visual strengthens as you move the slider.</p><div class="body-inline-map" data-body-preview>${renderBodyFigure(state.view, false)}</div><label class="body-range-label">How strong is it here?<output id="body-intensity-value">${intensityLabels[marker.intensity]}</output><input id="body-intensity" type="range" min="0" max="4" value="${marker.intensity}"><span><i>Barely there</i><i>Overwhelming</i></span></label><div class="body-detail-block"><h3>What is it doing?</h3><div class="body-choice-grid">${choiceButtons(movementOptions, "movement", marker.movement)}</div></div><div class="body-detail-block"><h3>Where does it seem to sit?</h3><div class="body-choice-grid">${choiceButtons(["On the surface", "Just underneath", "Deep inside", "Around muscles / movement", "Around a joint", "Hard to place"], "layer", marker.layer)}</div></div>${sideAreas ? `<div class="body-detail-block"><h3>Which side, if any?</h3><div class="body-choice-grid">${choiceButtons(["Left", "Right", "Both sides", "Not sure"], "side", marker.side)}</div></div>` : ""}${nav("characterise")}`);
      content.querySelector("#body-intensity").addEventListener("input", (event) => { marker.intensity = Number(event.target.value); content.querySelector("#body-intensity-value").textContent = intensityLabels[marker.intensity]; content.querySelector("[data-body-preview]").innerHTML = renderBodyFigure(state.view, false); });
      content.querySelectorAll("[data-body-choice-group]").forEach((button) => button.addEventListener("click", () => { marker[button.dataset.bodyChoiceGroup] = button.dataset.bodyChoice; renderCharacterise(); }));
    }
    function renderDetails() {
      const marker = activeMarker();
      if (!marker) return renderLocate();
      renderShell("details", `<p class="state-scan-question">Let’s see what changes it.</p><p class="state-scan-help">This is optional context, not a medical intake. You can leave anything blank.</p><div class="body-detail-block"><h3>When did you first notice it?</h3><div class="body-choice-grid">${choiceButtons(onsetOptions, "onset", marker.onset)}</div></div><div class="body-detail-block"><h3>What else was happening around same time?</h3><p class="body-small-note">These may or may not be related.</p><div class="body-choice-grid">${multiButtons(onsetContextOptions, "onsetContext", marker.onsetContext)}</div></div><div class="body-detail-block"><h3>What changes it when you move?</h3><div class="body-choice-grid">${choiceButtons(["Gets better", "Gets worse", "No change", "Unsure"], "movementChange", marker.movementChange)}</div></div><div class="body-detail-block"><h3>Does changing posture affect it?</h3><div class="body-choice-grid">${choiceButtons(["Gets better", "Gets worse", "No change", "Unsure"], "postureChange", marker.postureChange)}</div></div><div class="body-detail-block"><h3>What does your body want to do?</h3><div class="body-choice-grid">${multiButtons(bodyUrges, "urges", marker.urges)}</div></div><div class="body-detail-block"><h3>Has this happened before?</h3><div class="body-choice-grid">${choiceButtons(["Yes, often", "A few times", "No / unusual", "Not sure"], "familiarity", marker.familiarity)}</div></div><div class="body-detail-block"><h3>Compared with your usual baseline?</h3><div class="body-choice-grid">${choiceButtons(["Pretty normal", "A little different", "Quite different", "Very unusual"], "baselineDifference", marker.baselineDifference)}</div></div><div class="body-confidence-grid"><label class="body-range-label">How sure are you about the sensation?<output id="body-sensation-confidence-value">${marker.sensationConfidence}%</output><input id="body-sensation-confidence" type="range" min="0" max="100" step="10" value="${marker.sensationConfidence}"></label><label class="body-range-label">How sure are you about what it means?<output id="body-cause-confidence-value">${marker.causeConfidence}%</output><input id="body-cause-confidence" type="range" min="0" max="100" step="10" value="${marker.causeConfidence}"></label></div><div class="body-detail-block"><h3>Possibilities to keep in view</h3><p class="body-small-note">These are possibilities, not explanations. You can skip this.</p><div class="body-choice-grid">${multiButtons(possibilityOptions, "possibilities", marker.possibilities)}</div></div>${nav("details")}`);
      content.querySelectorAll("[data-body-choice-group]").forEach((button) => button.addEventListener("click", () => { marker[button.dataset.bodyChoiceGroup] = button.dataset.bodyChoice; renderDetails(); }));
      content.querySelectorAll("[data-body-multi-group]").forEach((button) => button.addEventListener("click", () => { const key = button.dataset.bodyMultiGroup; const item = button.dataset.bodyMulti; marker[key] = marker[key].includes(item) ? marker[key].filter((value) => value !== item) : [...marker[key], item]; renderDetails(); }));
      content.querySelector("#body-sensation-confidence").addEventListener("input", (event) => { marker.sensationConfidence = Number(event.target.value); content.querySelector("#body-sensation-confidence-value").textContent = `${marker.sensationConfidence}%`; });
      content.querySelector("#body-cause-confidence").addEventListener("input", (event) => { marker.causeConfidence = Number(event.target.value); content.querySelector("#body-cause-confidence-value").textContent = `${marker.causeConfidence}%`; });
    }
    const allMarkers = () => state.markers.filter((marker) => marker.area !== "Not sure where");
    const patternText = () => {
      const markers = allMarkers();
      if (state.unclearLocation || !markers.length) return "The signal is hard to place right now. That is useful information too; you do not need to force a precise label.";
      const locations = markers.map((marker) => marker.area.toLowerCase()).join(", ");
      const sensations = [...new Set(markers.flatMap((marker) => marker.sensations))].slice(0, 4).join(", ");
      const changes = [...new Set(markers.map((marker) => marker.movementChange).filter(Boolean))].join(" / ");
      return `You mapped ${locations}${sensations ? ` with ${sensations.toLowerCase()}` : ""}${changes ? `; movement ${changes.toLowerCase()}` : ""}. This is a description of the pattern, not an explanation of its cause.`;
    };
    const safetyFlags = () => {
      const flags = [];
      state.markers.forEach((marker) => {
        const words = marker.sensations.join(" ").toLowerCase();
        const pain = /pain|aching|sharp|throbb|cramp|pressure|tight/.test(words);
        const altered = /burn|numb|tingl|pins|weak/.test(words);
        const chest = /chest|jaw|throat|upper back/.test(marker.area.toLowerCase());
        const exertion = marker.onsetContext.includes("Exercise") || marker.possibilities.includes("Exertion");
        const spreading = marker.movement === "Spreading";
        if ((chest && (pain || altered)) || (pain && exertion) || (altered && spreading)) flags.push(marker);
      });
      return flags;
    };
    const contextLines = (marker) => [marker.onset && `First noticed ${marker.onset.toLowerCase()}`, marker.onsetContext.length && `around ${marker.onsetContext.join(", ").toLowerCase()}`, marker.movement && `it is ${marker.movement.toLowerCase()}`, marker.movementChange && `movement: ${marker.movementChange.toLowerCase()}`, marker.postureChange && `posture: ${marker.postureChange.toLowerCase()}`, marker.urges.length && `urge to ${marker.urges.join(", ").toLowerCase()}`].filter(Boolean).join(" · ");
    const markerCard = (marker) => `<article class="body-marker-card"><div><span class="state-map-label">${esc(marker.area)}</span><strong>${esc(markerLabel(marker))}</strong><p>${esc(intensityLabels[marker.intensity])}${marker.movement ? ` · ${esc(marker.movement)}` : ""}${marker.layer ? ` · ${esc(marker.layer.toLowerCase())}` : ""}</p></div><button type="button" class="chip" data-body-edit-area="${esc(marker.area)}">Edit</button></article>`;
    function renderResult() {
      const markers = state.markers.length ? state.markers : [newMarker("Not sure where")];
      const flags = safetyFlags();
      const possibilityMarkers = markers.filter((marker) => marker.possibilities.length);
      renderShell("result", `<p class="state-scan-question">Here is the map you built.</p><div class="body-map-result"><div class="body-map-result-visual"><div class="body-result-view-tabs"><button type="button" class="chip ${state.view === "front" ? "active" : ""}" data-body-view="front">Front</button><button type="button" class="chip ${state.view === "back" ? "active" : ""}" data-body-view="back">Back</button></div>${renderBodyFigure(state.view, false)}<p class="body-figure-key">Marked areas glow with their own intensity and texture.</p></div><div class="body-map-result-details"><section><span class="state-map-label">Observation</span><strong>${esc(patternText())}</strong><p>Each location below keeps its own record, so different parts of the body can feel different at the same time.</p></section>${markers.map(markerCard).join("")}</div></div>${flags.length ? `<aside class="body-safety-notice"><strong>This isn’t something this body-mapping tool should try to interpret.</strong><p>Because you marked ${esc(flags.map((marker) => marker.area).join(" and "))} with a combination that can need medical attention, pause here. If it is sudden, severe, worsening, or comes with trouble breathing, fainting, new weakness, or confusion, contact local emergency services now. Otherwise, consider prompt medical or urgent-care advice.</p></aside>` : ""}<div class="body-map-sections"><section class="body-map-section observation"><h3>Observation</h3><p>${esc(patternText())}</p></section><section class="body-map-section context"><h3>Context</h3>${markers.map((marker) => `<p><b>${esc(marker.area)}:</b> ${esc(contextLines(marker) || "No extra context added yet.")}</p>`).join("")}</section>${possibilityMarkers.length ? `<section class="body-map-section possibilities"><h3>Possibilities to keep in view</h3>${possibilityMarkers.map((marker) => `<p><b>${esc(marker.area)}:</b> ${esc(marker.possibilities.join(", "))}</p>`).join("")}<small>These are prompts for noticing, not explanations or diagnoses.</small></section>` : ""}<section class="body-map-section unknown"><h3>Unknown</h3><p>What is causing a sensation cannot be decided by this map. You can know where and how something feels while keeping the cause open.</p></section></div><div class="body-result-actions"><button type="button" class="button secondary" data-body-return-locate>Map another area</button></div>${nav("result")}`);
      content.querySelectorAll("[data-body-view]").forEach((button) => button.addEventListener("click", () => { state.view = button.dataset.bodyView; renderResult(); }));
      content.querySelectorAll("[data-body-edit-area]").forEach((button) => button.addEventListener("click", () => { state.activeArea = button.dataset.bodyEditArea; renderStage("describe"); }));
      content.querySelector("[data-body-return-locate]").addEventListener("click", () => renderStage("locate"));
    }
    const experimentOptions = () => {
      const marker = activeMarker();
      if (!marker) return [];
      const options = [];
      if (marker.sensations.some((item) => /Tight|Tense|Clenched|Compressed/.test(item)) || /Jaw|Shoulder|Neck/.test(marker.area)) options.push("Unclench gently and drop your shoulders");
      if (marker.movementChange || marker.postureChange || /Muscles|joint/i.test(marker.layer)) options.push("Change position or move gently");
      if (marker.sensations.some((item) => /Fluttering|Pulsing|Shaking|Trembling/.test(item))) options.push("Breathe normally and notice whether the wave changes");
      options.push("Rest the area or lower one source of sensory demand", "Drink water or eat something ordinary if that fits", "Do nothing yet; observe it for a few minutes");
      return [...new Set(options)].slice(0, 5);
    };
    function renderExperiment() {
      const marker = activeMarker();
      if (!marker) return renderResult();
      const options = experimentOptions();
      renderShell("experiment", `<p class="state-scan-question">What could you test gently?</p><p class="state-scan-help">Choose one low-cost change. This is an observation, not a medical test.</p><div class="body-active-location"><span>Testing</span><strong>${esc(marker.area)}</strong></div><div class="body-experiment-grid">${options.map((item) => `<button type="button" class="body-experiment-card ${marker.experiment === item ? "selected" : ""}" data-body-experiment="${esc(item)}"><strong>${esc(item)}</strong><span>${marker.experiment === item ? "Selected" : "Try this"}</span></button>`).join("")}</div>${marker.experiment ? `<div class="body-experiment-callout"><p>Try it for a short while, if comfortable, then record what changed.</p><button type="button" class="button" data-body-start-experiment>I tried it — compare</button></div>` : ""}${nav("experiment")}`);
      content.querySelectorAll("[data-body-experiment]").forEach((button) => button.addEventListener("click", () => { marker.experiment = button.dataset.bodyExperiment; renderExperiment(); }));
      content.querySelector("[data-body-start-experiment]")?.addEventListener("click", () => renderStage("compare"));
    }
    function renderCompare() {
      const marker = activeMarker();
      if (!marker) return renderResult();
      renderShell("compare", `<p class="state-scan-question">Did anything change?</p><p class="state-scan-help">A change does not prove a cause. No change is useful information too.</p><label class="body-range-label">How strong is ${esc(marker.area.toLowerCase())} now?<output id="body-after-intensity-value">${intensityLabels[marker.afterIntensity]}</output><input id="body-after-intensity" type="range" min="0" max="4" value="${marker.afterIntensity}"><span><i>Barely there</i><i>Overwhelming</i></span></label><div class="body-choice-grid body-change-options">${choiceButtons(["Better", "Worse", "Unchanged", "Unsure"], "experimentOutcome", marker.experimentOutcome)}</div><label class="state-text-label">What did you notice?<textarea id="body-experiment-note" rows="3" placeholder="For example: moving changed it, but the tightness remained.">${esc(marker.experimentNote)}</textarea>${nav("compare")}`);
      content.querySelector("#body-after-intensity").addEventListener("input", (event) => { marker.afterIntensity = Number(event.target.value); content.querySelector("#body-after-intensity-value").textContent = intensityLabels[marker.afterIntensity]; });
      content.querySelectorAll("[data-body-choice-group='experimentOutcome']").forEach((button) => button.addEventListener("click", () => { marker.experimentOutcome = button.dataset.bodyChoice; renderCompare(); }));
      content.querySelector("#body-experiment-note").addEventListener("input", (event) => { marker.experimentNote = event.target.value; });
    }
    function renderFinal() {
      const marker = activeMarker() || newMarker("Not sure where");
      const delta = marker.afterIntensity - marker.intensity;
      const conclusion = delta < 0 ? "The mapped area became less intense after the change. That suggests the tested condition may have been affecting it, but it does not prove a single cause." : delta > 0 ? "The mapped area became stronger after the change. The test may not have suited this moment, or another factor may be changing at the same time." : "The mapped area stayed about the same. That is useful information, not a failed result.";
      const entry = { title: "Body Check", tool: "body-check", answers: { ...state, moodBefore }, moodCheck: null };
      const text = () => `Body Check\n\n${state.markers.map((item) => `${item.area}: ${markerLabel(item)}\nIntensity: ${intensityLabels[item.intensity]}\nWhat it is doing: ${item.movement || "—"}\nWhere it sits: ${item.layer || "—"}\nContext: ${contextLines(item) || "—"}\nPossibilities: ${item.possibilities.join(", ") || "—"}`).join("\n\n")}\n\nTested: ${marker.experiment || "—"}\nOutcome: ${marker.experimentOutcome || "—"}\nIntensity after: ${intensityLabels[marker.afterIntensity]}`;
      renderShell("final", `<p class="state-scan-question">What did the body map teach you?</p><div class="body-final-map">${renderBodyFigure(state.view, false)}</div><div class="body-before-after"><article><span>Before · ${esc(marker.area)}</span><strong>${esc(intensityLabels[marker.intensity])}</strong><small>${esc(markerLabel(marker))}</small></article><div class="state-before-after-line" aria-hidden="true"></div><article><span>After</span><strong>${esc(intensityLabels[marker.afterIntensity])}</strong><small>${esc(marker.experimentOutcome || "Not rated")}</small></article></div><div class="body-map-insight"><h3>One careful conclusion</h3><p>${esc(conclusion)}</p><p>Notice the sensation before attaching an emotion or explanation to it. Clear sensation and uncertain cause can exist together.</p></div><div class="body-marker-summary"><h3>Mapped areas</h3>${state.markers.map(markerCard).join("")}</div><div class="body-confidence-grid"><section><span class="state-map-label">Confidence in the sensation</span><strong>${state.markers.length ? Math.round(state.markers.reduce((sum, item) => sum + item.sensationConfidence, 0) / state.markers.length) : 0}%</strong><p>You may know exactly what you feel without knowing why.</p></section><section><span class="state-map-label">Confidence in what it means</span><strong>${state.markers.length ? Math.round(state.markers.reduce((sum, item) => sum + item.causeConfidence, 0) / state.markers.length) : 0}%</strong><p>Keeping the cause open is an honest result.</p></section></div><div class="row body-result-actions"><button type="button" class="button" id="body-save-map">Save to My Maps</button><button type="button" class="button secondary" id="body-download-map">Download map</button><button type="button" class="button secondary" id="body-copy-map">Copy text</button></div><p id="body-result-status" class="fine" role="status"></p><a class="button secondary" href="#compass">Explore the Emotion Compass</a>`);
      content.querySelector("#body-save-map").addEventListener("click", () => { try { saveMap(entry); content.querySelector("#body-result-status").textContent = "Saved on this device."; } catch { content.querySelector("#body-result-status").textContent = "This browser could not save the map."; } });
      content.querySelector("#body-download-map").addEventListener("click", () => downloadText("body-map.txt", text()));
      content.querySelector("#body-copy-map").addEventListener("click", async () => { try { await navigator.clipboard.writeText(text()); content.querySelector("#body-result-status").textContent = "Copied."; } catch { content.querySelector("#body-result-status").textContent = "Copy was blocked by this browser. Use Download instead."; } });
      content.querySelectorAll("[data-body-edit-area]").forEach((button) => button.addEventListener("click", () => { state.activeArea = button.dataset.bodyEditArea; renderStage("describe"); }));
    }
    renderMode();
  }
}

function renderStateCheck(root, tool) {
  root.innerHTML = `<div class="wrap tool-page state-check-page"><a class="back-link" href="#tools">← All tools</a><section class="tool-heading"><p class="eyebrow">Feel & notice / State Scan</p><h1>${esc(tool.title)}</h1><p class="lead">${esc(tool.short)}</p><p class="privacy-note">Your answers stay in this browser unless you choose to save the map.</p></section><section id="state-mood-gate">${moodRatingMarkup({ id: "state-mood-before", outputId: "state-mood-before-value", buttonId: "state-mood-start", heading: "How are you feeling before you begin?", intro: "Slide to mark your overall mood. This is the existing starting check for the tool.", buttonText: "Open the State Scan" })}</section><div id="state-scan-content" hidden></div><div class="tool-next row"><a class="chip" href="#compass">Emotion Compass</a><a class="chip" href="#tools">Choose another tool</a><a class="chip" href="#maps">My Maps</a></div></div>`;
  bindMoodRating(root, {
    id: "state-mood-before",
    outputId: "state-mood-before-value",
    buttonId: "state-mood-start",
    onSubmit: (moodBefore) => {
      root.querySelector("#state-mood-gate").hidden = true;
      const content = root.querySelector("#state-scan-content");
      content.hidden = false;
      mountStateScan(content, moodBefore);
    },
  });

  function mountStateScan(content, moodBefore) {
    const state = {
      mode: null,
      energy: null,
      activation: null,
      intensity: 5,
      body: {},
      senses: { Sound: 0, Light: 0, People: 0, Activity: 0, Temperature: 0, "Touch / clothing": 0, Space: 0 },
      contexts: [],
      contextOther: "",
      needs: [],
      interpretation: "",
      confidence: 60,
      direction: "",
      experiment: "",
      afterIntensity: 5,
      afterConfidence: 60,
      changed: "",
    };
    const bodyOptions = ["Food", "Water", "Sleep", "Bathroom", "Temperature", "Pain / illness", "Movement", "Rest", "Medication / health routine"];
    const contextOptions = ["Poor sleep", "Caffeine / stimulants", "Alcohol / substances", "Medication change", "Haven’t eaten normally", "Illness", "Hormonal / menstrual changes", "Long day", "Lots of social contact", "Too little social contact", "Argument / conflict", "Travel / unfamiliar place", "Deadline / pressure", "Long screen time", "Something happened earlier", "Can’t identify anything"];
    const needGroups = {
      "Body": ["Food", "Water", "Rest", "Movement", "Warmth / cooling", "Pain support"],
      "Nervous system": ["Quiet", "Stimulation", "Predictability", "Slowing down", "Release"],
      "Connection": ["Company", "Reassurance", "Affection", "Being heard", "Space from people"],
      "Mind": ["Clarity", "Fewer decisions", "Information", "Structure", "Completion"],
      "Environment": ["Privacy", "Fresh air", "Different lighting", "Less noise", "Different location"],
      "Agency": ["Choice", "Control", "Permission to stop", "A boundary", "A clear next step"],
    };
    const stageNames = {
      energy: "System",
      body: "Body",
      senses: "Surroundings",
      context: "Context",
      needs: "Possible needs",
      interpretation: "Meaning",
      map: "Your map",
      experiment: "Test one thing",
      rerate: "Check again",
      final: "What changed",
    };
    const stageList = () => state.mode === "quick" ? ["energy", "body", "senses", "needs", "map", "experiment", "rerate", "final"] : ["energy", "body", "senses", "context", "needs", "interpretation", "map", "experiment", "rerate", "final"];
    const shell = () => content.querySelector(".state-scan-shell");
    const scanStatus = (message) => { const el = content.querySelector("#state-scan-status"); if (el) el.textContent = message; };
    const selectedLabel = (value) => value === "yes" ? "Yes" : value === "maybe" ? "Maybe" : "Not selected";
    const levelLabel = (value) => ["Much less", "Less", "About right", "More", "Much more"][Number(value) + 2];
    const titleFor = (key) => stageNames[key] || key;
    const choiceButtons = (items, group, selected, labels = items) => items.map((item, index) => `<button type="button" class="state-choice ${selected === item ? "selected" : ""}" data-choice-group="${esc(group)}" data-choice="${esc(item)}"><span>${esc(labels[index] || item)}</span></button>`).join("");
    const progress = (currentKey) => { const list = stageList(); const index = list.indexOf(currentKey); return `<div class="state-scan-progress" aria-label="State Scan progress">${list.map((key, i) => `<span class="${i <= index ? "done" : ""} ${key === currentKey ? "current" : ""}" title="${esc(titleFor(key))}"></span>`).join("")}<b>${index + 1} / ${list.length}</b></div>`; };
    const nav = (key, allowBack = true) => { const list = stageList(); const index = list.indexOf(key); return `<div class="state-scan-nav">${allowBack && index > 0 ? `<button type="button" class="button secondary" data-state-back="${esc(list[index - 1])}">Back</button>` : ""}${index < list.length - 1 ? `<button type="button" class="button" data-state-next="${esc(list[index + 1])}">Continue</button>` : ""}</div>`; };

    const renderShell = (key, inner) => {
      content.innerHTML = `<div class="state-scan-shell"><div class="state-scan-topline"><div><p class="eyebrow">State Scan</p><h2>${esc(titleFor(key))}</h2></div><span class="state-scan-time">${state.mode === "quick" ? "Quick scan" : "Deeper scan"}</span></div>${progress(key)}<section class="state-scan-card" data-state-stage="${esc(key)}">${inner}</section><p id="state-scan-status" class="interactive-status" aria-live="polite">Nothing is scored. You can skip anything that does not fit.</p></div>`;
      content.querySelectorAll("[data-state-next], [data-state-back]").forEach((button) => button.addEventListener("click", () => renderStage(button.dataset.stateNext || button.dataset.stateBack)));
    };

    const renderStage = (key) => {
      if (key === "energy") return renderEnergy();
      if (key === "body") return renderBody();
      if (key === "senses") return renderSenses();
      if (key === "context") return renderContext();
      if (key === "needs") return renderNeeds();
      if (key === "interpretation") return renderInterpretation();
      if (key === "map") return renderMap();
      if (key === "experiment") return renderExperiment();
      if (key === "rerate") return renderRerate();
      return renderFinal();
    };

    function renderMode() {
      content.innerHTML = `<div class="state-scan-shell"><div class="state-scan-topline"><div><p class="eyebrow">State Scan</p><h2>Look at the conditions first.</h2><p class="state-scan-lead">A feeling can be real while its intensity is changed by sleep, food, sensory load, connection or pressure.</p></div></div><div class="state-mode-grid"><button type="button" class="state-mode-card" data-state-mode="quick"><span>30–60 seconds</span><strong>Quick Scan</strong><p>Energy, body, surroundings and one useful test.</p></button><button type="button" class="state-mode-card" data-state-mode="deep"><span>3–5 minutes</span><strong>Deeper Scan</strong><p>Add context, interpretation and confidence.</p></button></div><details class="state-why"><summary>Why start here?</summary><p>State affects the signal. This tool does not decide whether a feeling is true or false; it helps you test what may be amplifying it.</p></details><p id="state-scan-status" class="interactive-status" aria-live="polite">Choose a scan length.</p></div>`;
      content.querySelectorAll("[data-state-mode]").forEach((button) => button.addEventListener("click", () => { state.mode = button.dataset.stateMode; renderStage("energy"); }));
    }

    function renderEnergy() {
      const energyItems = ["Running on empty", "Low", "Steady", "Energised", "Overcharged"];
      const activationItems = ["Shut down", "Heavy", "Settled", "Restless", "On edge"];
      renderShell("energy", `<p class="state-scan-question">How is your system running?</p><p class="state-scan-help">Choose the closest fit. You do not need an exact answer.</p><div class="state-axis-block"><h3>Energy</h3><div class="state-choice-row">${choiceButtons(energyItems, "energy", state.energy === null ? "" : energyItems[state.energy])}</div></div><div class="state-axis-block"><h3>How settled does your body feel?</h3><div class="state-choice-row">${choiceButtons(activationItems, "activation", state.activation === null ? "" : activationItems[state.activation])}</div></div><label class="state-range-label">How intense does everything feel right now?<output id="state-intensity-value">${state.intensity} / 10</output><input id="state-intensity" type="range" min="0" max="10" value="${state.intensity}"></label><details class="state-why"><summary>Why this matters</summary><p>Low energy and high activation can happen together. That can feel like being exhausted but unable to settle.</p></details>${nav("energy", false)}`);
      content.querySelectorAll("[data-choice-group]").forEach((button) => button.addEventListener("click", () => { const group = button.dataset.choiceGroup; const list = group === "energy" ? energyItems : activationItems; const value = list.indexOf(button.dataset.choice); state[group] = value; renderEnergy(); }));
      content.querySelector("#state-intensity").addEventListener("input", (event) => { state.intensity = Number(event.target.value); content.querySelector("#state-intensity-value").textContent = `${state.intensity} / 10`; });
      const next = content.querySelector("[data-state-next]"); next.disabled = state.energy === null || state.activation === null; next.title = next.disabled ? "Choose both system settings first" : "Continue";
    }

    function renderBody() {
      const cards = bodyOptions.map((item) => `<button type="button" class="state-body-card status-${state.body[item] || "none"}" data-body-item="${esc(item)}"><strong>${esc(item)}</strong><span>${selectedLabel(state.body[item])}</span></button>`).join("");
      renderShell("body", `<p class="state-scan-question">Is your body asking for something?</p><p class="state-scan-help">Tap a card to cycle through <b>Maybe</b>, <b>Yes</b> and clear it. Severe or worrying symptoms need real-world support, not more app analysis.</p><div class="state-body-grid">${cards}</div><p class="state-scan-note">Not noticing anything is useful information too.</p>${nav("body")}`);
      content.querySelectorAll("[data-body-item]").forEach((button) => button.addEventListener("click", () => { const item = button.dataset.bodyItem; state.body[item] = !state.body[item] ? "maybe" : state.body[item] === "maybe" ? "yes" : ""; renderBody(); }));
    }

    function renderSenses() {
      const labels = ["Much less", "Less", "About right", "More", "Much more"];
      const rows = Object.entries(state.senses).map(([label, value]) => `<label class="state-sense-row"><span><b>${esc(label)}</b><small>${esc(labels[Number(value) + 2])}</small></span><input type="range" min="-2" max="2" step="1" value="${value}" data-sense="${esc(label)}" aria-label="${esc(label)}: less or more than comfortable"><span class="state-range-ends"><i>Less</i><i>About right</i><i>More</i></span></label>`).join("");
      renderShell("senses", `<p class="state-scan-question">What is the world around you doing to your system?</p><p class="state-scan-help">Less input is not always better. You might need quiet, or you might need more stimulation.</p><div class="state-sense-list">${rows}</div><details class="state-why"><summary>Why this matters</summary><p>A room can make a feeling louder or quieter. Sound, light, people and activity can affect capacity without being the whole explanation.</p></details>${nav("senses")}`);
      content.querySelectorAll("[data-sense]").forEach((input) => input.addEventListener("input", () => { state.senses[input.dataset.sense] = Number(input.value); input.parentElement.querySelector("small").textContent = labels[Number(input.value) + 2]; }));
    }

    function renderContext() {
      const cards = contextOptions.map((item) => `<button type="button" class="state-context-card ${state.contexts.includes(item) ? "selected" : ""}" data-context="${esc(item)}">${esc(item)}</button>`).join("");
      renderShell("context", `<p class="state-scan-question">Anything affecting your system today?</p><p class="state-scan-help">These are possible contributors, not conclusions. Choose any that may matter.</p><div class="state-context-grid">${cards}</div><label class="state-text-label">Something else?<input id="state-context-other" value="${esc(state.contextOther)}" placeholder="A change, event or condition"></label>${nav("context")}`);
      content.querySelectorAll("[data-context]").forEach((button) => button.addEventListener("click", () => { const item = button.dataset.context; state.contexts = state.contexts.includes(item) ? state.contexts.filter((x) => x !== item) : [...state.contexts, item]; renderContext(); }));
      content.querySelector("#state-context-other").addEventListener("input", (event) => { state.contextOther = event.target.value; });
    }

    function renderNeeds() {
      const groups = Object.entries(needGroups).map(([group, items]) => `<section class="state-need-group"><h3>${esc(group)}</h3><div class="state-need-grid">${items.map((item) => `<button type="button" class="state-need-chip ${state.needs.includes(item) ? "selected" : ""}" data-need="${esc(item)}">${esc(item)}</button>`).join("")}</div></section>`).join("");
      renderShell("needs", `<p class="state-scan-question">If your system could ask for something, what might it ask for?</p><p class="state-scan-help">Choose possibilities. <b>Not sure yet</b> is a valid answer.</p>${groups}<button type="button" class="state-need-chip ${state.needs.includes("Not sure yet") ? "selected" : ""}" data-need="Not sure yet">Not sure yet</button>${nav("needs")}`);
      content.querySelectorAll("[data-need]").forEach((button) => button.addEventListener("click", () => { const item = button.dataset.need; if (item === "Not sure yet") state.needs = ["Not sure yet"]; else if (state.needs.includes(item)) state.needs = state.needs.filter((x) => x !== item); else state.needs = [...state.needs.filter((x) => x !== "Not sure yet"), item]; renderNeeds(); }));
    }

    function renderInterpretation() {
      renderShell("interpretation", `<p class="state-scan-question">What does everything feel like it means?</p><p class="state-scan-help">This is optional. The aim is to separate the feeling from the story your mind is building around it.</p><label class="state-text-label">Your current interpretation<textarea id="state-interpretation" rows="3" placeholder="For example: “They do not care about me” or “I cannot cope with this.”">${esc(state.interpretation)}</textarea></label><label class="state-range-label">How certain does that interpretation feel?<output id="state-confidence-value">${state.confidence}%</output><input id="state-confidence" type="range" min="0" max="100" step="10" value="${state.confidence}"></label><button type="button" class="state-uncertainty-button" data-uncertain="true">I do not know what I am feeling yet</button><details class="state-why"><summary>Why this matters</summary><p>Feelings are real. Interpretations can still be held with more or less confidence, especially when your body or surroundings are under strain.</p></details>${nav("interpretation")}`);
      content.querySelector("#state-interpretation").addEventListener("input", (event) => { state.interpretation = event.target.value; });
      content.querySelector("#state-confidence").addEventListener("input", (event) => { state.confidence = Number(event.target.value); content.querySelector("#state-confidence-value").textContent = `${state.confidence}%`; });
      content.querySelector("[data-uncertain]").addEventListener("click", () => { state.interpretation = "I do not know what this means yet."; state.confidence = 20; renderInterpretation(); });
    }

    function systemPattern() {
      if (state.energy === 0 && state.activation >= 3) return "tired-but-wired";
      if (state.energy <= 1 && state.activation <= 1) return "depleted";
      if (state.energy >= 3 && state.activation >= 3) return "revved";
      if (state.activation === 0) return "shut-down";
      return "steady";
    }
    function sensoryPattern() {
      const values = Object.values(state.senses);
      const high = values.filter((x) => x >= 1).length;
      const low = values.filter((x) => x <= -1).length;
      if (high >= 3) return "high sensory demand";
      if (low >= 3) return "low sensory input";
      return "mixed or manageable sensory input";
    }
    function bodySelected() { return Object.entries(state.body).filter(([, value]) => value).map(([key, value]) => `${key}${value === "maybe" ? " (maybe)" : ""}`); }
    function contributors() {
      const list = [];
      if (state.energy <= 1) list.push("low energy");
      if (state.activation >= 3) list.push("high activation");
      if (sensoryPattern() === "high sensory demand") list.push("sensory demand");
      bodySelected().slice(0, 3).forEach((item) => list.push(item.toLowerCase()));
      state.contexts.slice(0, 4).forEach((item) => list.push(item.toLowerCase()));
      return [...new Set(list)];
    }
    function mapCopy() {
      const pattern = systemPattern();
      if (pattern === "tired-but-wired") return "Your energy looks low while your activation is high. That combination can feel like anxiety, irritability, urgency or mental chaos: your system may want rest while still acting as if it needs to stay alert.";
      if (pattern === "depleted") return "Your energy and activation both look low. Ordinary tasks may feel heavier because there is less fuel available for starting, deciding or responding.";
      if (pattern === "revved") return "Your energy and activation both look high. You may have useful drive available, but speed can make it harder to notice limits or choose deliberately.";
      if (pattern === "shut-down") return "Your body may be conserving effort. Numbness, heaviness or difficulty starting can be a state response rather than a complete account of what you care about.";
      return "Your system looks relatively mixed or steady. The important clue may sit in the body, surroundings, context or interpretation rather than in one global state label.";
    }
    function renderMap() {
      const body = bodySelected();
      const contributorsList = contributors();
      const bodyText = body.length ? body.map((item) => `<span class="state-tag">${esc(item)}</span>`).join("") : `<span class="state-tag muted">Nothing strongly selected</span>`;
      const contextText = state.contexts.length || state.contextOther ? [...state.contexts, state.contextOther].filter(Boolean).map((item) => `<span class="state-tag">${esc(item)}</span>`).join("") : `<span class="state-tag muted">No clear context selected</span>`;
      const needsText = state.needs.length ? state.needs.map((item) => `<span class="state-tag">${esc(item)}</span>`).join("") : `<span class="state-tag muted">Not sure yet</span>`;
      renderShell("map", `<p class="state-scan-question">Here is the map we found.</p><div class="state-map-grid"><article><span class="state-map-label">System</span><strong>${esc(systemPattern().replaceAll("-", " "))}</strong><p>Energy ${state.energy + 1} / 5 · activation ${state.activation + 1} / 5</p></article><article><span class="state-map-label">Surroundings</span><strong>${esc(sensoryPattern())}</strong><p>Your answers describe the environment, not a diagnosis.</p></article><article><span class="state-map-label">Body</span><div class="state-tag-list">${bodyText}</div></article><article><span class="state-map-label">Context</span><div class="state-tag-list">${contextText}</div></article><article><span class="state-map-label">Possible needs</span><div class="state-tag-list">${needsText}</div></article></div><div class="state-map-interpretation"><h3>What this combination can do</h3><p>${mapCopy()}</p></div>${contributorsList.length ? `<div class="state-contributors"><h3>Worth checking</h3><p>${contributorsList.map((item) => `<span>${esc(item)}</span>`).join("")}</p><small>These are candidate contributors, not fake percentages or fixed causes.</small></div>` : ""}<details class="state-why"><summary>What should I trust right now?</summary><p>${state.intensity >= 8 || state.energy <= 1 || state.activation >= 4 ? "Your experience may be important, but this may not be the clearest moment for permanent judgements about yourself, a relationship or your future. Let the concern matter while holding the interpretation lightly." : "Your state does not obviously make the interpretation unreliable. It may still help to separate what happened, what you inferred and what you need."}</p></details>${nav("map")}`);
    }

    const directionOptions = ["Settle me", "Wake me up", "Give me stimulation", "Reduce stimulation", "Help me connect", "Give me space", "Help me think clearly", "Meet a physical need"];
    const experimentFor = {
      "Settle me": ["Lower one sound or light source", "Put both feet on the floor and lengthen the exhale if comfortable", "Move to a familiar, lower-demand place"],
      "Wake me up": ["Stand, stretch or take a short walk", "Open a window or change rooms", "Use a clear song, light or brief task to create momentum"],
      "Give me stimulation": ["Use a repetitive movement or tactile object", "Choose a familiar, engaging task for ten minutes", "Add one safe source of sound, movement or visual interest"],
      "Reduce stimulation": ["Lower screen brightness or sound", "Move away from one busy input", "Use headphones, a quieter room or a short pause"],
      "Help me connect": ["Send one honest message to a safe person", "Ask directly for listening, reassurance or practical help", "Choose company with a clear ending rather than an open social demand"],
      "Give me space": ["Name a short pause and when you will return", "Move somewhere private or less socially demanding", "Put one conversation on hold without deciding its final meaning"],
      "Help me think clearly": ["Write the facts and the interpretation in separate lines", "Reduce the decision to one next question", "Delay an irreversible action until the body is less activated"],
      "Meet a physical need": ["Drink water", "Eat something small and ordinary", "Rest, cool down, warm up or follow your usual health routine"],
    };
    function renderExperiment() {
      const choices = directionOptions.map((item) => `<button type="button" class="state-direction-card ${state.direction === item ? "selected" : ""}" data-direction="${esc(item)}"><strong>${esc(item)}</strong><span>${state.direction === item ? "Selected" : "Choose a direction"}</span></button>`).join("");
      const suggestions = state.direction ? `<div class="state-experiment-box"><h3>One thing worth testing first</h3><p>Try one small change for about ten minutes, or until you notice a shift.</p><ol>${experimentFor[state.direction].map((item) => `<li>${esc(item)}</li>`).join("")}</ol><button type="button" class="button" data-start-experiment>Mark this as tried and check again</button></div>` : `<p class="state-scan-note">There is no single correct direction. Sometimes the useful move is more stimulation, not more calming.</p>`;
      renderShell("experiment", `<p class="state-scan-question">What direction might help your system?</p><p class="state-scan-help">Do not automatically assume that calming down is the goal.</p><div class="state-direction-grid">${choices}</div>${suggestions}${nav("experiment")}`);
      content.querySelectorAll("[data-direction]").forEach((button) => button.addEventListener("click", () => { state.direction = button.dataset.direction; renderExperiment(); }));
      content.querySelector("[data-start-experiment]")?.addEventListener("click", () => { state.experiment = experimentFor[state.direction].join(" "); renderStage("rerate"); });
    }

    function renderRerate() {
      renderShell("rerate", `<p class="state-scan-question">What changed after the test?</p><p class="state-scan-help">The original problem may still matter. We are checking whether your state was amplifying it.</p><label class="state-range-label">How intense does everything feel now?<output id="state-after-intensity-value">${state.afterIntensity} / 10</output><input id="state-after-intensity" type="range" min="0" max="10" value="${state.afterIntensity}"></label>${state.interpretation ? `<label class="state-range-label">How certain does your interpretation feel now?<output id="state-after-confidence-value">${state.afterConfidence}%</output><input id="state-after-confidence" type="range" min="0" max="100" step="10" value="${state.afterConfidence}"></label>` : ""}<div class="state-choice-row state-change-choices">${choiceButtons(["Much worse", "Slightly worse", "No change", "Slightly better", "Much better"], "changed", state.changed)}</div><label class="state-text-label">Anything you noticed?<textarea id="state-after-note" rows="3" placeholder="For example: the noise mattered more than I expected.">${esc(state.changedNote || "")}</textarea></label>${nav("rerate")}`);
      content.querySelector("#state-after-intensity").addEventListener("input", (event) => { state.afterIntensity = Number(event.target.value); content.querySelector("#state-after-intensity-value").textContent = `${state.afterIntensity} / 10`; });
      content.querySelector("#state-after-confidence")?.addEventListener("input", (event) => { state.afterConfidence = Number(event.target.value); content.querySelector("#state-after-confidence-value").textContent = `${state.afterConfidence}%`; });
      content.querySelectorAll("[data-choice-group='changed']").forEach((button) => button.addEventListener("click", () => { state.changed = button.dataset.choice; renderRerate(); }));
      content.querySelector("#state-after-note").addEventListener("input", (event) => { state.changedNote = event.target.value; });
    }

    function renderFinal() {
      const intensityChange = state.afterIntensity - state.intensity;
      const confidenceChange = state.afterConfidence - state.confidence;
      const intensityText = intensityChange < 0 ? `Intensity fell by ${Math.abs(intensityChange)} point${Math.abs(intensityChange) === 1 ? "" : "s"}.` : intensityChange > 0 ? `Intensity rose by ${intensityChange} point${intensityChange === 1 ? "" : "s"}.` : "Intensity did not change on this rating.";
      const conclusion = intensityChange <= -2 ? "Your physical or environmental state may have been amplifying the problem. That does not make the concern imaginary; it tells you one part of the system is changeable." : intensityChange >= 2 ? "The first test did not lower intensity. The concern may need a different kind of response, or the chosen change may not have fit this moment." : "The concern did not clearly shift with this test. It may deserve closer attention rather than being explained away as a body state.";
      const confidenceText = state.interpretation ? confidenceChange < 0 ? `Interpretation confidence also fell by ${Math.abs(confidenceChange)} points.` : confidenceChange > 0 ? `Interpretation confidence rose by ${confidenceChange} points.` : "Interpretation confidence stayed similar." : "You left the interpretation open, which is useful information in itself.";
      const entry = { title: "Body & State Check", tool: "state-check", answers: { ...state, moodBefore }, moodCheck: null };
      const text = () => `Body & State Check\n\nSystem: ${systemPattern()}\nSurroundings: ${sensoryPattern()}\nBody: ${bodySelected().join(", ") || "Nothing strongly selected"}\nContext: ${[...state.contexts, state.contextOther].filter(Boolean).join(", ") || "None selected"}\nPossible needs: ${state.needs.join(", ") || "Not sure yet"}\nDirection tested: ${state.direction || "None"}\nIntensity before: ${state.intensity}/10\nIntensity after: ${state.afterIntensity}/10\nWhat changed: ${state.changed || "Not selected"}`;
      renderShell("final", `<p class="state-scan-question">What did the experiment teach you?</p><div class="state-before-after"><article><span>Before</span><strong>${state.intensity} / 10</strong><small>${esc(systemPattern().replaceAll("-", " "))}</small></article><div class="state-before-after-line" aria-hidden="true"></div><article><span>After</span><strong>${state.afterIntensity} / 10</strong><small>${esc(state.changed || "Not rated")}</small></article></div><div class="state-result-callout"><h3>${esc(intensityText)}</h3><p>${esc(conclusion)}</p><p>${esc(confidenceText)}</p></div><div class="state-result-grid"><section><span class="state-map-label">What you tested</span><strong>${esc(state.direction || "No direction selected")}</strong><p>${state.experiment ? esc(state.experiment) : "A short state experiment"}</p></section><section><span class="state-map-label">What to carry forward</span><strong>${esc(state.changed || "Keep observing")}</strong><p>${state.changedNote ? esc(state.changedNote) : "Notice whether this pattern returns in a similar context."}</p></section></div><div class="row state-result-actions"><button type="button" class="button" id="state-save-map">Save to My Maps</button><button type="button" class="button secondary" id="state-download-map">Download map</button><button type="button" class="button secondary" id="state-copy-map">Copy text</button></div><p id="state-result-status" class="fine" role="status"></p><a class="button secondary" href="#compass">Continue to the Emotion Compass</a>`);
      content.querySelector("#state-save-map").addEventListener("click", () => { try { saveMap(entry); content.querySelector("#state-result-status").textContent = "Saved on this device."; } catch { content.querySelector("#state-result-status").textContent = "This browser could not save the map."; } });
      content.querySelector("#state-download-map").addEventListener("click", () => downloadText("body-state-check.txt", text()));
      content.querySelector("#state-copy-map").addEventListener("click", async () => { try { await navigator.clipboard.writeText(text()); content.querySelector("#state-result-status").textContent = "Copied."; } catch { content.querySelector("#state-result-status").textContent = "Copy was blocked by this browser. Use Download instead."; } });
    }

    renderMode();
  }
}

export function renderTool(root, id) {
  const tool = tools.find((t) => t.id === id);
  if (!tool) {
    root.innerHTML = `<div class="wrap">${area("Tool not found", "Let’s find another way in.", "Browse the toolbox or tell us what would make it useful.")}<a class="button" href="#tools">Browse tools</a></div>`;
    return;
  }
  if (tool.id === "maps") {
    renderMaps(root);
    return;
  }
  if (tool.id === "body-check") {
    renderBodyCheck(root, tool);
    return;
  }
  if (tool.id === "state-check") {
    renderStateCheck(root, tool);
    return;
  }
  root.innerHTML = `<div class="wrap tool-page"><a class="back-link" href="#tools">← All tools</a><section class="tool-heading"><p class="eyebrow">${esc(toolGroups.find((g) => g[0] === tool.group)?.[1] || "Tool")} / ${esc(tool.kind === "pattern" ? "Creative pause" : tool.kind === "sound" ? "Sound & sensation" : "Interactive prompt")}</p><h1>${esc(tool.title)}</h1><p class="lead">${esc(tool.short)}</p><p class="privacy-note">Your writing stays in this browser tab unless you choose “Save to My Maps”. It is not sent to Nobody’s Simple.</p></section><section id="tool-mood-gate">${moodRatingMarkup({ id: "tool-mood-before", outputId: "tool-mood-before-value", buttonId: "tool-mood-start", heading: "How are you feeling before you begin?", intro: "Slide to mark your overall mood. This starting point stays in this tab while you use the tool.", buttonText: "Open this tool →" })}</section><div id="tool-content" hidden></div><div class="tool-next row"><a class="chip" href="#tool/state-check">Check my body/state</a><a class="chip" href="#questions">Work through a difficult question</a><a class="chip" href="#maps">My Maps</a></div></div>`;
  bindMoodRating(root, {
    id: "tool-mood-before",
    outputId: "tool-mood-before-value",
    buttonId: "tool-mood-start",
    onSubmit: (moodBefore) => {
      root.querySelector("#tool-mood-gate").hidden = true;
      const content = root.querySelector("#tool-content");
      content.hidden = false;
      mountTool(content, moodBefore);
    },
  });

  function mountTool(content, moodBefore) {
    content.innerHTML = `${tool.kind === "pattern" ? patternControls() : ""}<form id="feature-form" class="tool-form">${tool.fields.map(fieldHtml).join("")}${tool.fields.length ? `<div class="row"><button class="button" type="submit">Build my reflection ↗</button><button class="button secondary" type="reset">Clear this form</button></div>` : `<p class="fine">Use the interactive controls above, then build a reflection to compare your mood.</p><div class="row"><button class="button" type="submit">Build my reflection ↗</button></div>`}</form>${tool.kind === "pattern" ? `<div id="pattern-preview" class="pattern-preview" aria-label="Decorative animated pattern"></div>` : ""}${tool.kind === "sound" ? `<div class="row"><button type="button" class="button" id="sound-play">Play mix</button><button type="button" class="button secondary" id="sound-stop">Stop sound</button><p class="fine" id="sound-status" role="status">Silent until you press Play. No audio is recorded or transmitted.</p></div>` : ""}<section id="tool-result" class="tool-result" hidden aria-live="polite"></section>`;
    const form = content.querySelector("#feature-form");
    form.querySelectorAll("input[type=range]").forEach(
      (range) =>
        (range.oninput = () => {
          range.parentElement.querySelector(".range-value").value =
            `${range.value} / ${range.max}`;
          updateCreative();
        }),
    );
    form.onsubmit = (e) => {
      e.preventDefault();
      try {
      const results = {};
      tool.fields.forEach((f) => {
        results[f.id] = readField(f, form);
      });
      let extra = tool.id === "brain-dump" ? renderBrainMap(results) : "";
      const result = content.querySelector("#tool-result");
      result.hidden = false;
      result.innerHTML =
        `<div class="result-topline"><p class="eyebrow">Your working notes</p></div><h2>${esc(tool.title)}</h2><p class="fine">These are your notes, not an interpretation produced by the site.</p><div class="result-summary">${
          tool.fields
            .map((f) => {
              const v = results[f.id];
              const val = Array.isArray(v) ? v.join(" · ") : v;
              return val
                ? `<section><b>${esc(f.label)}</b><p>${esc(val)}</p></section>`
                : "";
            })
            .join("") ||
          "<p>No notes added yet. Save nothing or return to the questions whenever you like.</p>"
        }</div>${extra}${moodRatingMarkup({ id: "tool-mood-after", outputId: "tool-mood-after-value", buttonId: "tool-mood-compare", heading: "How are you feeling now?", intro: "After trying the activity, slide to mark your overall mood again.", buttonText: "Show my mood change →" })}<div id="mood-comparison" hidden></div><div class="row mood-result-actions" id="result-actions" hidden><button id="save-map" type="button" class="button">Save to My Maps</button><button id="download-map" class="button secondary" type="button">Download these notes</button><button id="copy-map" class="button secondary" type="button">Copy text</button></div><p id="result-status" class="fine" role="status"></p>`;
      const entry = {
        title: tool.title,
        tool: tool.id,
        answers: results,
        moodCheck: null,
      };
      const text = () =>
        `${tool.title}\n\n` +
        tool.fields
          .map((f) => {
            let v = results[f.id];
            return `${f.label}: ${Array.isArray(v) ? v.join(", ") : v || "—"}`;
          })
          .join("\n\n") +
        `\n\nMood before activity: ${entry.moodCheck?.before ?? moodBefore} / 10` +
        (entry.moodCheck
          ? `\nMood after activity: ${entry.moodCheck.after} / 10\nMood rating change: ${entry.moodCheck.after - entry.moodCheck.before} points`
          : "");
      bindMoodRating(content, {
        id: "tool-mood-after",
        outputId: "tool-mood-after-value",
        buttonId: "tool-mood-compare",
        onSubmit: (moodAfter) => {
          entry.moodCheck = { before: moodBefore, after: moodAfter };
          const comparison = content.querySelector("#mood-comparison");
          comparison.innerHTML = moodComparisonMarkup(moodBefore, moodAfter);
          comparison.hidden = false;
          content.querySelector("#result-actions").hidden = false;
          comparison.scrollIntoView({ behavior: "smooth", block: "center" });
        },
      });
      content.querySelector("#save-map").onclick = () => {
        try {
          saveMap(entry);
          content.querySelector("#result-status").textContent =
            "Saved on this device. Other people who use this browser profile may be able to see it.";
        } catch {
          content.querySelector("#result-status").textContent =
            "This browser could not save the note. Try Download instead.";
        }
      };
      content.querySelector("#download-map").onclick = () =>
        downloadText(`${tool.id}.txt`, text());
      content.querySelector("#copy-map").onclick = async () => {
        try {
          await navigator.clipboard.writeText(text());
          content.querySelector("#result-status").textContent = "Copied.";
        } catch {
          content.querySelector("#result-status").textContent =
            "Copy was blocked by this browser. Use Download instead.";
        }
      };
      result.scrollIntoView({ behavior: "smooth" });
      } catch (error) {
        const result = content.querySelector("#tool-result");
        if (result) {
          result.hidden = false;
          result.innerHTML = `<p class="notice" role="alert">The reflection could not be built. Your answers are still here—please try again.</p>`;
          result.scrollIntoView({ behavior: "smooth" });
        }
        console.error("Could not build reflection:", error);
      }
    };
    form.onreset = () => {
      setTimeout(() => {
        content.querySelector("#tool-result").hidden = true;
        updateCreative();
      }, 0);
    };
    if (tool.kind === "pattern") {
      content
        .querySelectorAll("input,select")
        .forEach((el) => el.addEventListener("input", updateCreative));
      content
        .querySelectorAll("select")
        .forEach((el) => el.addEventListener("change", updateCreative));
      updateCreative();
    }
    if (tool.kind === "sound") {
      let context = null,
        nodes = [];
      const stop = () => {
        for (const n of nodes)
          try {
            n.stop?.();
            n.disconnect?.();
          } catch {}
        nodes = [];
        content.querySelector("#sound-status").textContent = "Sound stopped.";
      };
      content.querySelector("#sound-stop").onclick = stop;
      content.querySelector("#sound-play").onclick = async () => {
        stop();
        try {
          const C = window.AudioContext || window.webkitAudioContext;
          if (!C) throw Error();
          context = context || new C();
          await context.resume();
          const form = content.querySelector("#feature-form"),
            master = context.createGain();
          master.gain.value = 0.11;
          master.connect(context.destination);
          const noise = context.createBufferSource();
          const buffer = context.createBuffer(
              1,
              context.sampleRate * 2,
              context.sampleRate,
            ),
            samples = buffer.getChannelData(0);
          for (let i = 0; i < samples.length; i++)
            samples[i] = (Math.random() * 2 - 1) * 0.22;
          noise.buffer = buffer;
          noise.loop = true;
          const filter = context.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = 600;
          const gain = context.createGain();
          gain.gain.value = +form.elements.rain.value / 10;
          noise.connect(filter).connect(gain).connect(master);
          noise.start();
          nodes.push(noise, filter, gain, master);
          for (const [id, freq] of [
            ["tone", 110],
            ["pulse", 55],
          ]) {
            const amount = +form.elements[id].value;
            if (amount > 0) {
              const oscillator = context.createOscillator(),
                g = context.createGain();
              oscillator.type = "sine";
              oscillator.frequency.value = freq;
              g.gain.value = amount / 2200;
              oscillator.connect(g).connect(master);
              oscillator.start();
              nodes.push(oscillator, g);
            }
          }
          content.querySelector("#sound-status").textContent =
            "A quiet, computer-generated mix is playing. Lower the sliders or stop whenever you like.";
        } catch {
          content.querySelector("#sound-status").textContent =
            "Audio is not available in this browser.";
        }
      };
      form.addEventListener("input", () => {
        if (nodes.length)
          content.querySelector("#sound-status").textContent =
            "Changes take effect next time you press Play.";
      });
    }
  }
}
function patternControls() {
  return "";
}
function updateCreative() {
  const box = document.getElementById("pattern-preview");
  if (!box) return;
  const f = document.querySelector("#feature-form"),
    count = +f.elements.density.value,
    shape = f.elements.shape.value,
    palette = f.elements.colour.value,
    motion = f.elements.motion.value;
  const palettes = {
      "Forest & amber": ["#395c4d", "#e6ad51", "#8eaa83"],
      "Berry & lilac": ["#7b4474", "#d887a9", "#bea6da"],
      "Ocean & sky": ["#286c78", "#75bad1", "#bddeca"],
      "Soft greens": ["#61865e", "#bed39c", "#e7d8a0"],
    },
    colors = palettes[palette];
  box.innerHTML = Array.from(
    { length: count },
    (_, i) =>
      `<span class="pattern-piece ${motion === "Still" ? "still" : motion === "Gentle pulse" ? "pulse" : ""}" style="--piece:${colors[i % colors.length]};--turn:${i * 17}deg">${shape === "Circle" ? "●" : shape === "Square" ? "■" : shape === "Triangle" ? "▲" : "✿"}</span>`,
  ).join("");
}
function renderMaps(root) {
  const maps = loadMaps();
  root.innerHTML = `<div class="wrap">${area("Private to this browser", "My Maps.", "A small, revisable shelf for observations and experiments you chose to save. These notes are stored only in this browser profile—not synced to your account.")}<div class="notice"><b>Shared device?</b> Other people using this browser profile could open these notes. Download and then clear them on shared devices.</div><div class="row"><button class="button secondary" id="export-maps">Download my maps</button><button class="button secondary" id="clear-maps">Delete all saved notes</button><a href="#tools">Back to tools</a></div><section class="maps-list">${
    maps
      .map(
        (m) =>
          `<article class="map-note"><div class="row spaced"><div><span class="badge">${esc(m.status || "New observation")}</span><h3>${esc(m.title)}</h3><small>${new Date(m.savedAt).toLocaleString()}</small></div><button class="chip" data-delete-map="${esc(m.id)}">Delete note</button></div><div class="map-note-body">${Object.entries(
            m.answers || {},
          )
            .map(
              ([k, v]) =>
                `<section><b>${esc(k.replace(/-/g, " "))}</b><p>${esc(Array.isArray(v) ? v.join(", ") : v)}</p></section>`,
            )
            .join(
              "",
            )}</div>${m.moodCheck ? moodComparisonMarkup(m.moodCheck.before, m.moodCheck.after) : ""}<label class="field">Update the status<select data-status="${esc(m.id)}">${["New observation", "Possible pattern", "Seems reliable", "Testing this", "No longer fits"].map((x) => `<option ${m.status === x ? "selected" : ""}>${x}</option>`).join("")}</select></label></article>`,
      )
      .join("") ||
    '<div class="empty">Nothing saved yet. In a tool, choose “Save to My Maps” when a note is useful to keep.</div>'
  }</section></div>`;
  root.querySelector("#export-maps").onclick = () =>
    downloadText(
      "my-maps.json",
      JSON.stringify(maps, null, 2),
      "application/json",
    );
  root.querySelector("#clear-maps").onclick = () => {
    if (
      confirm(
        "Delete every saved note from this browser? This cannot be undone.",
      )
    ) {
      localStorage.removeItem(mapKey);
      renderMaps(root);
    }
  };
  root.querySelectorAll("[data-delete-map]").forEach(
    (b) =>
      (b.onclick = () => {
        localStorage.setItem(
          mapKey,
          JSON.stringify(
            loadMaps().filter((m) => m.id !== b.dataset.deleteMap),
          ),
        );
        renderMaps(root);
      }),
  );
  root.querySelectorAll("[data-status]").forEach(
    (s) =>
      (s.onchange = () => {
        const next = loadMaps().map((m) =>
          m.id === s.dataset.status ? { ...m, status: s.value } : m,
        );
        localStorage.setItem(mapKey, JSON.stringify(next));
      }),
  );
}
function downloadText(name, text, type = "text/plain") {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1200);
}

export function renderCompass(root, emotions, onChoose) {
  root.innerHTML = `<div class="wrap emotion-page">${area("Feel & notice", "A feeling has more than one dimension.", "Start broadly. Pleasantness and energy are separate sliders; they don’t decide which word is right. Choose any level of detail—or none.")}${moodRatingMarkup({ id: "compass-mood-before", outputId: "compass-mood-before-value", buttonId: "compass-mood-start", heading: "How are you feeling before you begin?", intro: "Slide to mark your overall mood. This starting point stays in this tab while you explore the compass.", buttonText: "Open the emotion compass →" })}</div>`;
  bindMoodRating(root, {
    id: "compass-mood-before",
    outputId: "compass-mood-before-value",
    buttonId: "compass-mood-start",
    onSubmit: (moodBefore) =>
      renderCompassContent(root, emotions, onChoose, moodBefore),
  });
}

function renderCompassContent(root, emotions, onChoose, moodBefore) {
  let x = 0,
    y = 0,
    current = null,
    family = "All";
  const familyColors = {
    Fear: "#cc7850",
    Anger: "#c54564",
    Sadness: "#6779d5",
    Surprise: "#18a59c",
    Joy: "#84a937",
    Love: "#d28a3e",
  };
  root.innerHTML = `<div class="wrap emotion-page">${area("Feel & notice", "A feeling has more than one dimension.", "Start broadly. Pleasantness and energy are separate sliders; they don’t decide which word is right. Choose any level of detail—or none.")}<section class="emotion-intro-note"><p><b>First, check your state.</b> Sleep, hunger, illness, pain, stimulants and sensory load can colour a moment. They deserve their own check, not an emotional label.</p><a class="button" href="#tool/state-check">Open the body & state check →</a></section><div class="tabs emotion-level-tabs"><button class="active" data-level="compass">Compass</button><button data-level="families">Browse feeling families</button><button data-level="state">Body & state cues</button></div><section id="emotion-compass-panel" class="compass-redesign"><div class="compass-card"><div class="compass-controls" aria-label="Describe your felt experience"><label class="field">Pleasantness <output id="pleasantness-value">Neutral</output><input id="pleasantness" type="range" min="-100" max="100" value="0" aria-label="Pleasantness: unpleasant to pleasant"></label><label class="field">Energy / activation <output id="energy-value">Moderate</output><input id="energy" type="range" min="-100" max="100" value="0" aria-label="Energy: low to high"></label><div class="range-ends"><span>Unpleasant</span><span>Mixed or neither</span><span>Pleasant</span></div><div class="range-ends"><span>Low</span><span>Moderate</span><span>High</span></div></div><div class="compass-plot" id="compass-plot" role="application" aria-label="Explore nearby feeling words by moving your position on the pleasantness and energy axes"><div class="plot-vlabel">HIGH ENERGY</div><div class="plot-horizontal" aria-hidden="true"></div><div class="plot-vertical" aria-hidden="true"></div><button type="button" class="feeling-marker" id="marker" aria-label="Your current position on the compass">+</button><div class="plot-bottom">LOW ENERGY</div><div class="plot-left">UNPLEASANT</div><div class="plot-right">PLEASANT</div></div><div class="felt-position" aria-live="polite" id="compass-feedback"></div></div><aside class="emotion-side"><p class="eyebrow">Possible fits near this position</p><p id="quadrant-copy">These are suggestions to explore, not labels assigned to you.</p><div id="compass-suggestions" class="compass-suggestions"></div><section id="compass-emotion-detail" class="compass-emotion-detail" aria-live="polite"></section><button class="button" type="button" id="checkin-link">Reflect on this feeling ↗</button><p class="fine">This opens a separate, gentle feelings check-in—not the eight-question emotion-to-action tool.</p></aside></section><section class="emotion-word-browser"><div class="section-head"><div><p class="eyebrow">The full word wheel</p><h2>Or find a word that feels close.</h2></div><p class="fine">107 distinct emotion labels, with both “Dismayed” wheel contexts preserved. Select as many feelings as fit, or none.</p></div><label class="field">Search all emotion words<input id="emotion-search" type="search" placeholder="Try tender, exhausted, frustrated…"></label><div class="family-filters" id="family-filters">${["All", "Fear", "Anger", "Sadness", "Surprise", "Joy", "Love"].map((f) => `<button class="chip ${f === "All" ? "active" : ""}" data-family="${f}">${f === "All" ? "All feeling words" : f}</button>`).join("")}</div><div id="emotion-word-results" class="emotion-word-results"></div><div class="mixed-result" id="selected-feelings"></div></section><section id="emotion-profile" class="profile-card" hidden></section><section id="emotion-checkin" class="emotion-checkin" hidden></section><section class="state-compass" id="state-panel" hidden><div class="section-head"><div><p class="eyebrow">State compass · separate from emotion words</p><h2>What else is in the mix?</h2></div><p class="fine">Energy-related, physical, social and sensory states can exist alongside emotions. These are cues to consider, not labels that explain everything.</p></div><div class="state-tags">${stateItems.map(([label, desc]) => `<label class="state-tag"><input type="checkbox" value="${esc(label)}"><span><b>${esc(label)}</b><small>${esc(desc)}</small></span></label>`).join("")}</div><label class="field">Something missing? Add your own state<input id="custom-state" placeholder="e.g. jet-lagged, restless, low blood sugar"></label><p id="state-summary" class="fine" aria-live="polite"></p><a class="button" href="#tool/state-check">Use the fuller state check →</a></section><section class="body-sensations"><p class="eyebrow">From noticing to next steps</p><h2>No single feeling has to decide what happens next.</h2><p>Choose an optional next route. Or stop here.</p><div class="row"><a class="button secondary" href="#tool/body-check">Notice body sensations</a><a class="button secondary" href="#tool/emotion-timeline">Explore a feeling timeline</a><a class="button secondary" href="#tool/mixed-feelings">Make room for mixed feelings</a><a class="button secondary" href="#questions">Explore a decision or challenge</a></div></section></div>`;
  const stateCoordinates = {
    "Tired": [-8, -62], "Sleepy": [-4, -82], "Exhausted": [-30, -92],
    "Wired": [-18, 69], "Restless": [-33, 48], "Hungry": [-22, -24],
    "Hangry": [-62, 28], "Thirsty": [-22, -42], "Ill or in pain": [-70, -54],
    "Overstimulated": [-68, 55], "Understimulated": [-28, -5], "Caffeine-heavy": [-8, 57],
    "Foggy": [-33, -49], "Numb": [-28, -32], "Frazzled": [-57, 33],
    "Overloaded": [-66, 12], "Sexually aroused": [18, 62], "Lonely": [-58, -28],
  };
  const existingLabels = new Set(emotions.map((emotion) => emotion.label.toLowerCase()));
  const stateCandidates = stateItems
    .filter(([label]) => !existingLabels.has(label.toLowerCase()))
    .map(([label, description]) => {
      const [sx, sy] = stateCoordinates[label] || [0, 0];
      return {
        id: "state-" + label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label, family: "Body / state", parent: null, x: sx, y: sy,
        profile: {
          definition: description,
          function: "This body or context cue may help explain a change in energy, attention, or emotion. It is information to check, not a complete explanation.",
          analogy: "Like a dashboard light: useful to notice, but it does not tell the whole story by itself.",
          situations: "It may appear alongside changes in sleep, food, fluids, health, sensory input, caffeine, social contact, or demands.",
          body: "Notice what is actually present for you; there is no single required body response.",
          thought: "You might notice a pull to rest, eat, drink, move, reduce input, seek company, or pause before interpreting the feeling.",
          need: "A practical body check, choice, comfort, recovery, reduced input, or support may be relevant.",
          confused: "A state can overlap with emotion and influence its intensity without making the emotion unreal.",
          support: "Check basic conditions gently, then see whether the emotional meaning changes. A body state and an emotion can coexist.",
        },
      };
    });
  stateCandidates.push(
    { id: "state-hyper", label: "Hyper / highly activated", family: "Body / state", x: 12, y: 84, profile: { definition: "A plain-language description of unusually high energy, movement, speed, or activation; it is not a diagnosis.", function: "It can describe energy, stimulation, excitement, stress, or several of these together.", analogy: "An engine revving high; the reason for the revs still needs context.", situations: "It may appear with excitement, novelty, urgency, stress, sleep changes, stimulants, or sensory seeking.", body: "Some people notice faster movement, speech, heartbeat, or difficulty settling; others do not.", thought: "Thoughts may feel quick, jump between ideas, or focus strongly on what feels interesting or urgent.", need: "Movement, lower input, rest, or a clear next step may help depending on context.", confused: "High activation can feel pleasant, unpleasant, or mixed; the energy axis cannot determine its cause.", support: "Check what changed in sleep, stimulation, caffeine, stress, and surroundings." } },
    { id: "state-wired-tired", label: "Wired and tired", family: "Body / state", x: -24, y: 24, profile: { definition: "Tiredness and high activation appearing together.", function: "It can flag that energy and alertness are not moving in the same direction.", analogy: "A low battery with too many tabs still open.", situations: "It may appear after long demands, disrupted sleep, stress, illness, or late stimulation.", body: "You may feel depleted but restless, tense, or unable to settle; this varies.", thought: "You might want to stop and also feel unable to switch off.", need: "A gentle transition, lower stimulation, food or drink if needed, rest, or support.", confused: "It can resemble anxiety or agitation, but those words do not identify the cause.", support: "Reduce demands where possible and check practical body-state factors; no breathing pattern is required." } }
  );
  const candidates = [...emotions, ...stateCandidates];
  const familyActions = {
    Fear: "check, pause, seek safety or support", Anger: "protect a boundary or address a blockage",
    Sadness: "seek comfort, connection, rest or time", Surprise: "pause, gather information and update your view",
    Joy: "stay with or share something rewarding", Love: "care for a valued bond while respecting choice",
  };
  const showCompassDetail = (candidate) => {
    if (!candidate) return;
    current = candidate;
    const profile = candidate.profile || profileFor(candidate);
    const actions = familyActions[candidate.family] || "pause, check what matters, and choose what feels workable";
    const cards = [
      ["Definition", profile.definition], ["Possible function", profile.function],
      ["Analogy", profile.analogy], ["Situations it may appear in", profile.situations],
      ["Body sensations / symptoms", profile.body],
      ["Thoughts or action urges", profile.thought + " Possible action pull: " + actions + "."],
      ["Possible needs", profile.need], ["Easy to confuse with", profile.confused],
      ["What might help", profile.support],
    ];
    root.querySelector("#compass-emotion-detail").innerHTML =
      '<div class="compass-profile-heading"><span class="family-orb" style="--emotion-color:' + (familyColors[candidate.family] || "#647f70") + '">' + esc(candidate.family.slice(0, 1)) + '</span><div><p class="eyebrow">' + esc(candidate.family) + (candidate.parent ? " / " + esc(candidate.parent) : "") + '</p><h2>' + esc(candidate.label) + '</h2></div></div><p class="profile-caution">A nearby possibility, not a label assigned by the graph. Keep it, change it, or leave it.</p><div class="compass-profile-grid">' + cards.map(([heading, text]) => '<article><h3>' + esc(heading) + '</h3><p>' + esc(text || "No description has been added yet.") + '</p></article>').join("") + '</div>';
  };
  const renderPosition = () => {
    const marker = root.querySelector("#marker");
    marker.style.left = (8 + (x + 100) * 0.42) + "%";
    marker.style.top = (8 + (100 - y) * 0.42) + "%";
    const pleasant = x > 24 ? "pleasant" : x < -24 ? "unpleasant" : "mixed or neither";
    const energy = y > 33 ? "higher energy" : y < -33 ? "lower energy" : "middle energy";
    root.querySelector("#pleasantness-value").value = pleasant === "mixed or neither" ? "Mixed / neither" : pleasant[0].toUpperCase() + pleasant.slice(1);
    root.querySelector("#energy-value").value = energy[0].toUpperCase() + energy.slice(1);
    root.querySelector("#compass-feedback").textContent = "Your position: " + pleasant + " · " + energy + ". Nearby words change as you move.";
    root.querySelector("#quadrant-copy").textContent = "Three words are closest to this position. Any of them may fit, or none may.";
    const holder = root.querySelector("#compass-suggestions");
    const matches = nearestEmotions(candidates, x, y, 3);
    holder.replaceChildren();
    matches.forEach((candidate, index) => {
      const suggestion = document.createElement("button");
      suggestion.type = "button";
      suggestion.className = "compass-suggestion" + (index === 0 ? " selected" : "");
      suggestion.setAttribute("aria-pressed", String(index === 0));
      suggestion.innerHTML = '<b>' + esc(candidate.label) + '</b><small>' + esc(candidate.family) + (candidate.parent ? " · " + esc(candidate.parent) : "") + '</small>';
      suggestion.addEventListener("click", () => {
        holder.querySelectorAll(".compass-suggestion").forEach((other) => {
          const selected = other === suggestion;
          other.classList.toggle("selected", selected);
          other.setAttribute("aria-pressed", String(selected));
        });
        showCompassDetail(candidate);
      });
      holder.append(suggestion);
    });
    if (matches.length) showCompassDetail(matches[0]);
  };
  const updateResults = () => {
    const q = root.querySelector("#emotion-search").value.trim().toLowerCase();
    const fam = family;
    const shown = emotions.filter(
      (e) =>
        (fam === "All" || e.family === fam) &&
        (!q ||
          [e.label, e.family, e.parent || ""]
            .join(" ")
            .toLowerCase()
            .includes(q)),
    );
    root.querySelector("#emotion-word-results").innerHTML = shown.length
      ? shown
          .map(
            (e) =>
              `<button type="button" class="emotion-word" data-emotion="${esc(e.id)}" style="--emotion-color:${familyColors[e.family]}"><b>${esc(e.label)}</b><small>${esc(e.family)}${e.parent ? " · " + esc(e.parent) : ""}</small></button>`,
          )
          .join("")
      : `<div class="empty">No matching wheel word. Search the separate state cues, or add a word of your own during the feelings check-in.</div>`;
    root.querySelectorAll("[data-emotion]").forEach(
      (btn) =>
        (btn.onclick = () => {
          current = emotions.find((e) => e.id === btn.dataset.emotion);
          const profile = profileFor(current);
          const saved = selected.has(current.id);
          root.querySelector("#emotion-profile").hidden = false;
          root.querySelector("#emotion-profile").innerHTML =
            `<div class="profile-head"><span class="family-orb" style="--emotion-color:${familyColors[current.family]}">${current.family.slice(0, 1)}</span><div><p class="eyebrow">${esc(current.family)}${current.parent ? " / " + esc(current.parent) : ""}</p><h2>${esc(current.label)}</h2></div><button class="icon-button" id="close-profile" aria-label="Close emotion notes">×</button></div><p class="profile-caution">A starting description, not a definition of you. Words have fuzzy edges; this one may not fit your experience.</p><div class="profile-grid">${[
              ["Definition", profile.definition],
              ["A possible function", profile.function],
              ["An analogy", profile.analogy],
              ["Situations it may appear in", profile.situations],
              ["Body sensations", profile.body],
              ["Thoughts you might notice", profile.thought],
              ["Possible needs", profile.need],
              ["Easy to confuse with", profile.confused],
              ["What might help", profile.support],
            ]
              .map(
                ([h, t]) => `<article><h3>${h}</h3><p>${esc(t)}</p></article>`,
              )
              .join(
                "",
              )}</div><div class="row"><button class="button" id="toggle-feeling">${saved ? "Remove from mixed feelings" : "Add to my mixed feelings"}</button><button class="button secondary" id="begin-emotion-checkin">Start a feelings check-in</button></div>`;
          root.querySelector("#close-profile").onclick = () =>
            (root.querySelector("#emotion-profile").hidden = true);
          root.querySelector("#toggle-feeling").onclick = () => {
            if (selected.has(current.id)) selected.delete(current.id);
            else selected.set(current.id, current);
            updateResults();
            renderSelected();
            updateProfileButton();
          };
          root.querySelector("#begin-emotion-checkin").onclick = () =>
            renderCheckIn(current.label);
          root
            .querySelector("#emotion-profile")
            .scrollIntoView({ behavior: "smooth", block: "start" });
        }),
    );
    renderSelected();
  };
  const selected = new Map();
  const renderSelected = () => {
    root.querySelector("#selected-feelings").innerHTML = selected.size
      ? `<p><b>Words you chose</b> — mixed feelings can coexist.</p><div class="emotion-list">${[...selected.values()].map((e) => `<button type="button" data-remove="${e.id}">${esc(e.label)} ×</button>`).join("")}</div><button class="button secondary" type="button" id="checkin-selected">Check in with these words</button>`
      : "";
    root.querySelectorAll("[data-remove]").forEach(
      (b) =>
        (b.onclick = () => {
          selected.delete(b.dataset.remove);
          renderSelected();
          updateResults();
        }),
    );
    root
      .querySelector("#checkin-selected")
      ?.addEventListener("click", () =>
        renderCheckIn([...selected.values()].map((e) => e.label).join(", ")),
      );
  };
  const updateProfileButton = () => {
    if (!current) return;
    const b = root.querySelector("#toggle-feeling");
    if (b)
      b.textContent = selected.has(current.id)
        ? "Remove from mixed feelings"
        : "Add to my mixed feelings";
  };
  function renderCheckIn(chosen = "") {
    const box = root.querySelector("#emotion-checkin");
    box.hidden = false;
    renderCheckInForm(chosen, moodBefore);
    box.scrollIntoView({ behavior: "smooth" });
  }
  function renderCheckInForm(chosen, moodBefore) {
    const box = root.querySelector("#emotion-checkin");
    box.innerHTML = `<p class="eyebrow">A separate feelings check-in</p><h2>Stay curious about this feeling.</h2><p>This is not the eight-question emotion-to-action reflection. It is an optional, short check-in attached to the compass.</p><form id="feelings-form">${[
        ["word", "What word or words fit right now?"],
        [
          "where",
          "Where were you, and what happened just before the feeling changed?",
        ],
        [
          "body",
          "What, if anything, do you notice in your body, energy or surroundings?",
        ],
        ["urge", "What are you drawn to do, if anything?"],
        ["need", "What might matter or need attention?"],
        [
          "help",
          "Would support, rest, information, movement, company, a boundary, or “nothing yet” be useful?",
        ],
      ]
        .map(
          ([id, label]) =>
            `<label class="field">${label}<textarea name="${id}" ${id === "word" ? `placeholder="${esc(chosen)}"` : ""}></textarea></label>`,
        )
        .join(
          "",
        )}<div class="row"><button class="button">Finish check-in</button><button class="button secondary" id="close-checkin" type="button">Close without saving</button></div></form><div id="feelings-summary" class="notice" hidden></div><p class="fine">Nothing is sent to the site. Save this check-in to My Maps only if you choose to.</p>`;
    box.querySelector("#close-checkin").onclick = () => (box.hidden = true);
    box.querySelector("form").onsubmit = (e) => {
      e.preventDefault();
      const d = Object.fromEntries(
        [...new FormData(e.target)].map(([k, v]) => [k, v.trim()]),
      );
      const summary = box.querySelector("#feelings-summary");
      summary.hidden = false;
      summary.innerHTML = `<h3>Your check-in</h3>${Object.entries(d)
        .filter(([, v]) => v)
        .map(([k, v]) => `<p><b>${esc(k)}</b><br>${esc(v)}</p>`)
        .join("")}${moodRatingMarkup({
          id: "compass-checkin-after",
          outputId: "compass-checkin-after-value",
          buttonId: "compass-checkin-compare",
          heading: "How are you feeling now?",
          intro: "After the check-in, slide to mark your overall mood again.",
          buttonText: "Show my mood change →",
        })}<div id="compass-mood-comparison" hidden></div><button class="button" id="save-feelings" type="button" hidden>Save to My Maps</button><p class="fine" id="save-feelings-status" role="status"></p>`;
      bindMoodRating(box, {
        id: "compass-checkin-after",
        outputId: "compass-checkin-after-value",
        buttonId: "compass-checkin-compare",
        onSubmit: (moodAfter) => {
          const comparison = box.querySelector(
            "#compass-mood-comparison",
          );
          comparison.innerHTML = moodComparisonMarkup(
            moodBefore,
            moodAfter,
          );
            comparison.hidden = false;
            comparison.scrollIntoView({ behavior: "smooth", block: "center" });
            const saveButton = box.querySelector("#save-feelings");
          saveButton.hidden = false;
          saveButton.onclick = () => {
            try {
              saveMap({
                title: "Feelings check-in",
                tool: "emotion-check-in",
                answers: d,
                moodCheck: { before: moodBefore, after: moodAfter },
              });
              box.querySelector("#save-feelings-status").textContent =
                "Saved on this device.";
            } catch {
              box.querySelector("#save-feelings-status").textContent =
                "Could not save here. You can keep these notes in this tab.";
            }
          };
        },
      });
    };
  }
  root.querySelector("#checkin-link").onclick = () =>
    renderCheckIn(current?.label || "");
  root.querySelector("#pleasantness").oninput = (e) => {
    x = +e.target.value;
    renderPosition();
  };
  root.querySelector("#energy").oninput = (e) => {
    y = +e.target.value;
    renderPosition();
  };
  root.querySelector("#emotion-search").oninput = updateResults;
  root.querySelectorAll("[data-family]").forEach(
    (b) =>
      (b.onclick = () => {
        family = b.dataset.family;
        root
          .querySelectorAll("[data-family]")
          .forEach((x) => x.classList.toggle("active", x === b));
        updateResults();
      }),
  );
  root.querySelectorAll("[data-level]").forEach(
    (b) =>
      (b.onclick = () => {
        const level = b.dataset.level;
        root
          .querySelectorAll("[data-level]")
          .forEach((x) => x.classList.toggle("active", x === b));
        root.querySelector("#emotion-compass-panel").hidden =
          level !== "compass";
        root.querySelector(".emotion-word-browser").hidden = level === "state";
        root.querySelector("#state-panel").hidden = level !== "state";
      }),
  );
  root.querySelector("#state-panel").onchange = () => {
    const chosen = [...root.querySelectorAll(".state-tag input:checked")].map(
      (c) => c.value,
    );
    const extra = root.querySelector("#custom-state").value.trim();
    if (extra) chosen.push(extra);
    root.querySelector("#state-summary").textContent = chosen.length
      ? `You selected: ${chosen.join(" · ")}. These can coexist with any emotion.`
      : "Choose any cues that feel relevant, or none.";
  };
  root.querySelector("#custom-state").oninput = () =>
    root.querySelector("#state-panel").onchange();
  const plot = root.querySelector("#compass-plot");
  let dragging = false;
  const pointer = (ev) => {
    const r = plot.getBoundingClientRect();
    x = Math.max(
      -100,
      Math.min(100, ((ev.clientX - r.left) / r.width - 0.5) * 200),
    );
    y = Math.max(
      -100,
      Math.min(100, (0.5 - (ev.clientY - r.top) / r.height) * 200),
    );
    root.querySelector("#pleasantness").value = x;
    root.querySelector("#energy").value = y;
    renderPosition();
  };
  plot.onpointerdown = (ev) => {
    dragging = true;
    plot.setPointerCapture(ev.pointerId);
    pointer(ev);
  };
  plot.onpointermove = (ev) => {
    if (dragging) pointer(ev);
  };
  plot.onpointerup = () => (dragging = false);
  plot.onpointercancel = () => (dragging = false);
  root.querySelectorAll("[data-level]").forEach((b) => {
    if (b.dataset.level === "state")
      root.querySelector("#state-panel").hidden = true;
  });
  root.querySelector("#state-panel").onchange();
  renderPosition();
  updateResults();
}

const routes = [
  [
    "spiralling",
    "I’m spiralling",
    ["state-check", "grounding", "reality-map", "control-map"],
    "Start with a state check, then separate what happened from what the worry says it means.",
  ],
  [
    "decision",
    "I can’t make a decision",
    ["brain-dump", "values-discovery", "decision-map", "future-perspectives"],
    "Externalise the options, name the values, then look for a reversible next step.",
  ],
  [
    "argument",
    "We had an argument",
    ["quick-reset", "conversation-map", "perspective-switch", "repair"],
    "If useful, settle first; then map what happened and what each person may need.",
  ],
  [
    "start",
    "I can’t get started",
    ["state-check", "friction", "motivation-map", "small-step"],
    "Check energy and access; locate the barrier; choose one meaningful small move.",
  ],
  [
    "feeling",
    "I don’t know what I’m feeling",
    ["state-check", "body-check", "compass", "emotion-check-in"],
    "Start with state and sensations, then use the emotion words only if they fit.",
  ],
  [
    "self",
    "I feel bad about myself",
    [
      "reality-map",
      "personal-rules",
      "assumption-finder",
      "experiment-builder",
    ],
    "Separate a specific event from a global judgement and find one assumption to test.",
  ],
  [
    "overload",
    "Everything feels too much",
    ["quick-reset", "load-balancer", "brain-dump", "small-step"],
    "Begin with less analysis, then reduce one demand and choose what can wait.",
  ],
];
export function renderRoutes(root) {
  root.innerHTML = `<div class="wrap">${area("Routes rather than tools", "You don’t need to know what to search for.", "Choose a familiar starting point. Each route offers a handful of tools in a suggested order; skip, change or stop whenever you like.")}<div class="grid">${routes.map(([id, label, ids, desc]) => `<button type="button" class="card route-card" data-route="${id}"><span class="index">↗</span><h3>${label}</h3><p>${desc}</p><span class="arrow">Explore route →</span></button>`).join("")}</div><section id="route-detail" class="route-detail" hidden></section></div>`;
  root.querySelectorAll("[data-route]").forEach(
    (b) =>
      (b.onclick = () => {
        const [, label, ids, desc] = routes.find(
          (r) => r[0] === b.dataset.route,
        );
        const box = root.querySelector("#route-detail");
        box.hidden = false;
        box.innerHTML = `<p class="eyebrow">A possible sequence</p><h2>${label}</h2><p>${desc}</p><ol class="route-steps">${ids
          .map((id) => {
            const t = tools.find((x) => x.id === id) || {
              id: "compass",
              title: "Emotion compass",
              short: "Describe the moment in your own words.",
            };
            return `<li><a href="#tool/${t.id}"><b>${esc(t.title)}</b><small>${esc(t.short)}</small><span>Open →</span></a></li>`;
          })
          .join(
            "",
          )}</ol><button class="button secondary" id="route-close">Close this route</button>`;
        box.querySelector("#route-close").onclick = () => (box.hidden = true);
        box.scrollIntoView({ behavior: "smooth" });
      }),
  );
}

export function renderCommunity(root, initial = "feedback") {
  const embed = (url) => url.replace("/viewform", "/viewform?embedded=true");
  root.innerHTML = `<div class="wrap">${area("Community", "Help shape what we make next.", "Vote for the questions you want explored, suggest improvements, challenge an idea, or share a counterexample.")}<div class="notice community-note"><b>Thoughtful disagreement belongs here.</b> “This didn’t fit me” or “another explanation may be…” can be more useful than simple agreement. Please don’t submit passwords or urgent/private health details to a public project form.</div><div class="form-tabs"><button class="chip" data-form="feedback">Community feedback</button><button class="chip" data-form="volunteer">Volunteer Guild</button></div><section id="community-form"></section><div class="community-mail"><p>Prefer a direct email? Contact <a href="mailto:nobodyssimple@outlook.com">nobodyssimple@outlook.com</a>.</p><p class="fine">The forms are operated by Google. Their responses and notification settings are controlled in Google Forms, not by this website. See the setup guide before launch to verify who receives submissions.</p></div></div>`;
  const show = (kind) => {
    const url = kind === "feedback" ? forms.feedback : forms.volunteer,
      label =
        kind === "feedback" ? "Community Feedback form" : "Volunteer Guild";
    root
      .querySelectorAll("[data-form]")
      .forEach((b) => b.classList.toggle("active", b.dataset.form === kind));
    root.querySelector("#community-form").innerHTML =
      `<div class="embed-shell"><div class="embed-title"><p class="eyebrow">${kind === "feedback" ? "Ideas, votes & counterexamples" : "Join the contributor guild"}</p><h2>${label}</h2><a href="${url}" rel="noopener noreferrer" target="_blank">Open this form in a new tab ↗</a></div><iframe src="${embed(url)}" title="Nobody’s Simple ${label}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>`;
  };
  root
    .querySelectorAll("[data-form]")
    .forEach((b) => (b.onclick = () => show(b.dataset.form)));
  show(initial);
}

export function renderInstall(root) {
  root.innerHTML = `<div class="wrap install-page">${area("Carry the field guide with you", "Nobody’s Simple, on your home screen.", "This is a web app. Add it to your phone like an app—no app-store listing needed.")}<section class="install-steps"><article><span>01</span><h2>iPhone or iPad</h2><p>Open this site in Safari. Tap the Share button, then choose <b>Add to Home Screen</b>.</p></article><article><span>02</span><h2>Android</h2><p>Open the site in Chrome. Open the browser menu and choose <b>Install app</b> or <b>Add to Home screen</b>.</p></article><article><span>03</span><h2>Desktop</h2><p>If your browser shows an install icon in the address bar or menu, choose it to add the site as an app window.</p></article></section><div class="notice">The public curriculum and tools can be available offline after a visit. Embedded videos, Google Forms and publishing need an internet connection. Notes saved to My Maps stay in this browser profile.</div><a class="button" href="#home">Back to the homepage</a></div>`;
}

export const formLinks = forms;
