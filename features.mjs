import { escapeHTML as esc, nearestEmotions } from "./core.mjs";
import { profileFor, stateItems } from "./emotion-profiles.mjs";
import { tools, toolGroups, situations } from "./tool-catalog.mjs";

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
export function renderHome(root, posts) {
  const latest = (posts || []).filter((p) => p.type === "blog").slice(0, 3);
  root.innerHTML = `<div class="home-wrap"><section class="cover-hero"><img class="cover-image" src="banner.png" alt="Nobody’s Simple — Psychology for choosing what to do next"><div class="cover-cta"><p class="eyebrow">A practical psychology project</p><p>Start with the moment you’re in. Find one thing that might help.</p><a class="button bright" href="#help">Help me figure out what I need <span aria-hidden="true">↗</span></a></div></section><div class="quick-actions"><a href="#help"><span>01</span><b>Help me figure out what I need</b><small>Three tailored starting points</small></a><a href="#compass"><span>02</span><b>Name the feeling or state</b><small>Emotions, energy and body cues</small></a><a href="#library"><span>03</span><b>Follow a learning thread</b><small>52 weeks · four quarters</small></a><a href="#maps"><span>04</span><b>My Maps</b><small>Return to notes saved on this device</small></a></div>
 <section class="install-ribbon"><div class="round-icon">↗</div><div><p class="eyebrow">Keep it close</p><h2>Add Nobody’s Simple to your home screen</h2><p>Your web app—one tap away, no app store required.</p></div><a href="#install" class="button">Install the app <span aria-hidden="true">→</span></a><button type="button" class="icon-button" data-install-prompt aria-label="Install Nobody’s Simple">↓</button></section>
 <section class="channel-hero"><div><p class="eyebrow">The Nobody’s Simple channel</p><h2>Watch the ideas take shape.</h2><p>Animated psychology, complicated questions and useful ways to choose what to do next.</p></div><a class="channel-cta" href="${yt}" target="_blank" rel="noopener noreferrer"><span class="play-button">▶</span><span><small>VISIT THE CHANNEL</small><strong>Watch on YouTube</strong></span><span aria-hidden="true">↗</span></a></section>
 <section class="editorial-section"><div class="section-head"><div><p class="eyebrow">A living field guide</p><h2>More than one way into a moment.</h2></div><a class="text-link" href="#tools">Explore the toolbox ↗</a></div><div class="grid feature-grid">${["emotion-check-in", "state-check", "reality-map", "small-step"].map((id) => card(tools.find((t) => t.id === id))).join("")}</div></section>
 <section class="journey-banner"><div><p class="eyebrow">Recursive autonomy · 2026–27</p><h2>Notice the pattern.<br>Decide what should guide you.</h2><p>Four quarters. Twelve modules. Fifty-two questions to explore.</p><a class="button light-button" href="#library">Explore the curriculum →</a></div><div class="journey-stamp">SEE <span>✳</span> TRACE <span>✳</span><br>RESIST <span>✳</span> GOVERN</div></section>
 <section class="editorial-section blog-preview"><div class="section-head"><div><p class="eyebrow">Separate from the curriculum</p><h2>Notes from Nobody’s Simple.</h2></div><a class="text-link" href="#blog">All blog posts ↗</a></div><div class="grid">${latest.length ? latest.map((p) => `<a class="card post-card" href="#post/${encodeURIComponent(p.id)}">${p.thumbnail ? `<img src="${esc(p.thumbnail)}" alt="${esc(p.thumbnailAlt || "")}" loading="lazy">` : `<div class="post-placeholder" aria-hidden="true">Aa</div>`}<div class="copy"><span class="badge">${esc((p.topics || []).join(" · ") || "A note")}</span><h3>${esc(p.title)}</h3><p>${esc(p.excerpt || "")}</p><span class="arrow">Read the piece →</span></div></a>`).join("") : `<div class="empty">The blog is ready for your first post in Staff login.</div>`}</div></section>
 <section class="community-ribbon"><div><p class="eyebrow">Built with people, not just for people</p><h2>Shape what we make next.</h2><p>Suggest a topic, challenge an idea or help make the project more useful.</p></div><div class="row"><a class="button bright" href="#community">Share feedback</a><a class="button outline-light" href="#volunteer">Volunteer with us</a></div></section><section class="home-app-banner"><div><span class="eyebrow">A web app, on your phone</span><h2>Carry a calmer next step.</h2><p>Add it to your home screen. No app-store account or download fee.</p></div><a href="#install" class="button bright">How to add the app ↗</a></section></div>`;
  root.querySelector("[data-install-prompt]").onclick = () =>
    document.getElementById("install")?.scrollIntoView({ behavior: "smooth" });
}

export function renderHelp(root) {
  root.innerHTML = `<div class="wrap">${area("Start here", "What would help right now?", "Choose a few things that fit. This short navigator uses your selections to suggest three possible tools—not to diagnose or decide for you.")}<form id="navigator-form" class="navigator-layout"><section class="navigator-left"><fieldset><legend>What’s going on right now?</legend><div class="choice-grid">${situations.map((s) => `<label class="choice-tile"><input type="checkbox" name="situation" value="${s.id}"><span><b>${esc(s.label)}</b><small>${esc(s.examples)}</small></span></label>`).join("")}</div></fieldset><fieldset><legend>What would feel most useful?</legend><div class="choice-grid compact-choices">${[
    ["understand", "Understand it"],
    ["calmer", "Feel calmer"],
    ["organise", "Organise it"],
    ["decide", "Make a decision"],
    ["action", "Do something"],
    ["communicate", "Communicate"],
    ["minutes", "Get through the next few minutes"],
  ]
    .map(
      ([v, l]) =>
        `<label class="choice-pill"><input type="radio" name="goal" value="${v}"><span>${l}</span></label>`,
    )
    .join(
      "",
    )}</div></fieldset></section><aside class="navigator-side"><label class="field">How much energy is available right now?<input type="range" name="energy" min="0" max="2" value="1"><span class="range-ends"><span>Very little</span><output id="energy-label">Some</output><span>Plenty</span></span></label><label class="field">How intense does it feel?<input type="range" name="intensity" min="0" max="10" value="5"><span class="range-ends"><span>Gentle</span><output id="intensity-label">5 / 10</output><span>Very intense</span></span></label><button class="button full" type="submit">Find my starting points ↗</button><p class="fine">Nothing is saved unless you choose to save an individual reflection.</p></aside></form><section id="recommendations" class="recommendations" aria-live="polite"></section></div>`;
  const form = root.querySelector("#navigator-form");
  form.elements.energy.oninput = (e) =>
    (root.querySelector("#energy-label").value = [
      "Very little",
      "Some",
      "Plenty",
    ][+e.target.value]);
  form.elements.intensity.oninput = (e) =>
    (root.querySelector("#intensity-label").value = `${e.target.value} / 10`);
  form.onsubmit = (e) => {
    e.preventDefault();
    const chosen = [...form.querySelectorAll("[name=situation]:checked")].map(
      (x) => situations.find((s) => s.id === x.value),
    );
    const goal = form.elements.goal.value;
    const energy = +form.elements.energy.value;
    const pool = [];
    for (const s of chosen)
      for (const id of s.tools) {
        const tool = tools.find((t) => t.id === id);
        if (tool && !pool.includes(tool)) pool.push(tool);
      }
    if (!chosen.length) {
      for (const id of ["state-check", "brain-dump", "quick-reset"])
        pool.push(tools.find((t) => t.id === id));
    }
    const boost =
      goal === "calmer"
        ? ["quick-reset", "grounding", "load-balancer"]
        : goal === "organise"
          ? ["brain-dump", "thought-map", "reality-map"]
          : goal === "decide"
            ? ["decision-map", "values-discovery", "certainty"]
            : goal === "communicate"
              ? ["conversation-map", "needs-clarifier", "boundary-builder"]
              : goal === "action"
                ? ["small-step", "friction", "goal-builder"]
                : goal === "minutes"
                  ? ["quick-reset", "grounding", "pattern-stims"]
                  : goal === "understand"
                    ? ["state-check", "emotion-check-in", "pattern-map"]
                    : [];
    const rank = (t) =>
      (boost.includes(t.id) ? 4 : 0) +
      (energy === 0 &&
      ["grounding", "quick-reset", "state-check", "small-step"].includes(t.id)
        ? 3
        : 0) +
      (chosen.some((s) => s.tools.includes(t.id)) ? 3 : 0);
    pool.sort((a, b) => rank(b) - rank(a));
    const picks = [
      ...pool,
      ...boost.map((id) => tools.find((t) => t.id === id)).filter(Boolean),
    ]
      .filter((t, i, a) => a.findIndex((x) => x.id === t.id) === i)
      .slice(0, 3);
    root.querySelector("#recommendations").innerHTML =
      `<p class="eyebrow">Three gentle starting points</p><h2>Take what fits. Leave the rest.</h2><p class="fine">Picked from your choices: ${chosen.length ? chosen.map((x) => esc(x.label)).join(" · ") : "not sure yet"}. The suggestions are a simple match to the tools—not an assessment.</p><div class="grid">${picks.map((t, i) => `<a class="card recommendation-card" href="#tool/${t.id}"><span class="number">0${i + 1}</span><h3>${esc(t.title)}</h3><p>${esc(t.short)}</p><small>Why this might fit: ${esc(t.tags.some((tag) => chosen.some((s) => s.tools.includes(t.id))) ? "You selected a situation this tool can help you explore." : goal === "calmer" ? "You asked for a calmer, lower-pressure starting point." : "It gives a concrete place to start without needing the “right” answer.")}</small><span class="arrow">Try this tool →</span></a>`).join("")}</div><p class="fine">You can also <a href="#tools">browse the full toolbox</a> or <a href="#routes">follow a guided route</a>.</p>`;
    root
      .querySelector("#recommendations")
      .scrollIntoView({ behavior: "smooth" });
  };
}

export function renderToolbox(root, filter = "") {
  root.innerHTML = `<div class="wrap">${area("A toolbox, not a test", "Find a tool by the kind of help you want.", "Nothing here knows you better than you know yourself. Try one prompt, skip anything that does not fit, and save only what you choose.")}<div class="toolbox-controls"><label class="field">Search tools<input id="tool-search" type="search" placeholder="e.g. tired, decision, relationship…"></label><div class="tabs" id="tool-tabs">${[["all", "Everything"], ...toolGroups.filter((g) => g[0] !== "maps").map((g) => [g[0], g[1]])].map(([id, label]) => `<button type="button" class="chip ${id === "all" ? "active" : ""}" data-group="${id}">${esc(label)}</button>`).join("")}</div></div><div id="tool-groups">${toolGroups
    .filter((g) => g[0] !== "maps")
    .map((g) => {
      const list = tools.filter((t) => t.group === g[0] && t.id !== "maps");
      return `<section class="tool-group" data-category="${g[0]}"><div class="section-head"><div><p class="eyebrow">${esc(g[1])}</p><h2>${esc(g[1])}</h2></div><span class="fine">${list.length} tools</span></div><div class="grid">${list.map(card).join("")}</div></section>`;
    })
    .join(
      "",
    )}</div><section class="section"><div class="card tone-slate"><p class="eyebrow">Saved only on this device</p><h2>My Maps</h2><p>Revisit observations and patterns you chose to keep. Your notes are not uploaded or synced.</p><a class="button" href="#maps">Open My Maps →</a></div></section><section class="section routes-callout"><p class="eyebrow">Rather not choose?</p><h2>Use a short guided route.</h2><p>Try a small sequence for an argument, a stuck decision, an overload or a thought spiral.</p><a class="button" href="#routes">See guided routes ↗</a></section></div>`;
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

const readField = (field, node) =>
  field.type === "checks"
    ? [...node.querySelectorAll("input:checked")].map((x) => x.value)
    : node.value;
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
  root.innerHTML = `<div class="wrap tool-page"><a class="back-link" href="#tools">← All tools</a><section class="tool-heading"><p class="eyebrow">${esc(toolGroups.find((g) => g[0] === tool.group)?.[1] || "Tool")} / ${esc(tool.kind === "pattern" ? "Creative pause" : tool.kind === "sound" ? "Sound & sensation" : "Interactive prompt")}</p><h1>${esc(tool.title)}</h1><p class="lead">${esc(tool.short)}</p><p class="privacy-note">Your writing stays in this browser tab unless you choose “Save to My Maps”. It is not sent to Nobody’s Simple.</p></section>${tool.kind === "pattern" ? patternControls() : tool.kind === "sound" ? soundControls() : ""}<form id="feature-form" class="tool-form">${tool.fields.map(fieldHtml).join("")}${tool.fields.length ? `<div class="row"><button class="button" type="submit">Build my reflection ↗</button><button class="button secondary" type="reset">Clear this form</button></div>` : ""}</form>${tool.kind === "pattern" ? `<div id="pattern-preview" class="pattern-preview" aria-label="Decorative animated pattern"></div>` : ""}${tool.kind === "sound" ? `<div class="row"><button type="button" class="button" id="sound-play">Play mix</button><button type="button" class="button secondary" id="sound-stop">Stop sound</button><p class="fine" id="sound-status" role="status">Silent until you press Play. No audio is recorded or transmitted.</p></div>` : ""}<section id="tool-result" class="tool-result" hidden aria-live="polite"></section><div class="tool-next row"><a class="chip" href="#tool/state-check">Check my body/state</a><a class="chip" href="#questions">Work through a difficult question</a><a class="chip" href="#maps">My Maps</a></div></div>`;
  const form = root.querySelector("#feature-form");
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
    const results = {};
    tool.fields.forEach((f) => {
      const node = form.elements.namedItem(f.id);
      results[f.id] = readField(f, node);
    });
    let extra = tool.id === "brain-dump" ? renderBrainMap(results) : "";
    root.querySelector("#tool-result").hidden = false;
    root.querySelector("#tool-result").innerHTML =
      `<div class="result-topline"><p class="eyebrow">Your working notes</p><button id="save-map" type="button" class="button">Save to My Maps</button></div><h2>${esc(tool.title)}</h2><p class="fine">These are your notes, not an interpretation produced by the site.</p><div class="result-summary">${
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
      }</div>${extra}<div class="row"><button id="download-map" class="button secondary" type="button">Download these notes</button><button id="copy-map" class="button secondary" type="button">Copy text</button></div><p id="result-status" class="fine" role="status"></p>`;
    const entry = { title: tool.title, tool: tool.id, answers: results };
    root.querySelector("#save-map").onclick = () => {
      try {
        saveMap(entry);
        root.querySelector("#result-status").textContent =
          "Saved on this device. Other people who use this browser profile may be able to see it.";
      } catch {
        root.querySelector("#result-status").textContent =
          "This browser could not save the note. Try Download instead.";
      }
    };
    const text = () =>
      `${tool.title}\n\n` +
      tool.fields
        .map((f) => {
          let v = results[f.id];
          return `${f.label}: ${Array.isArray(v) ? v.join(", ") : v || "—"}`;
        })
        .join("\n\n");
    root.querySelector("#download-map").onclick = () =>
      downloadText(`${tool.id}.txt`, text());
    root.querySelector("#copy-map").onclick = async () => {
      try {
        await navigator.clipboard.writeText(text());
        root.querySelector("#result-status").textContent = "Copied.";
      } catch {
        root.querySelector("#result-status").textContent =
          "Copy was blocked by this browser. Use Download instead.";
      }
    };
    root.querySelector("#tool-result").scrollIntoView({ behavior: "smooth" });
  };
  form.onreset = () => {
    setTimeout(() => {
      root.querySelector("#tool-result").hidden = true;
      updateCreative();
    }, 0);
  };
  if (tool.kind === "pattern") {
    root
      .querySelectorAll("input,select")
      .forEach((el) => el.addEventListener("input", updateCreative));
    root
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
      root.querySelector("#sound-status").textContent = "Sound stopped.";
    };
    root.querySelector("#sound-stop").onclick = stop;
    root.querySelector("#sound-play").onclick = async () => {
      stop();
      try {
        const C = window.AudioContext || window.webkitAudioContext;
        if (!C) throw Error();
        context = context || new C();
        await context.resume();
        const form = root.querySelector("#feature-form"),
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
        root.querySelector("#sound-status").textContent =
          "A quiet, computer-generated mix is playing. Lower the sliders or stop whenever you like.";
      } catch {
        root.querySelector("#sound-status").textContent =
          "Audio is not available in this browser.";
      }
    };
    form.addEventListener("input", () => {
      if (nodes.length)
        root.querySelector("#sound-status").textContent =
          "Changes take effect next time you press Play.";
    });
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
            )}</div><label class="field">Update the status<select data-status="${esc(m.id)}">${["New observation", "Possible pattern", "Seems reliable", "Testing this", "No longer fits"].map((x) => `<option ${m.status === x ? "selected" : ""}>${x}</option>`).join("")}</select></label></article>`,
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
  root.innerHTML = `<div class="wrap emotion-page">${area("Feel & notice", "A feeling has more than one dimension.", "Start broadly. Pleasantness and energy are separate sliders; they don’t decide which word is right. Choose any level of detail—or none.")}<section class="emotion-intro-note"><p><b>First, check your state.</b> Sleep, hunger, illness, pain, stimulants and sensory load can colour a moment. They deserve their own check, not an emotional label.</p><a class="button" href="#tool/state-check">Open the body & state check →</a></section><div class="tabs emotion-level-tabs"><button class="active" data-level="compass">Compass</button><button data-level="families">Browse feeling families</button><button data-level="state">Body & state cues</button></div><section id="emotion-compass-panel" class="compass-redesign"><div class="compass-card"><div class="compass-controls" aria-label="Describe your felt experience"><label class="field">Pleasantness <output id="pleasantness-value">Neutral</output><input id="pleasantness" type="range" min="-100" max="100" value="0" aria-label="Pleasantness: unpleasant to pleasant"></label><label class="field">Energy / activation <output id="energy-value">Moderate</output><input id="energy" type="range" min="-100" max="100" value="0" aria-label="Energy: low to high"></label><div class="range-ends"><span>Unpleasant</span><span>Mixed or neither</span><span>Pleasant</span></div><div class="range-ends"><span>Low</span><span>Moderate</span><span>High</span></div></div><div class="compass-plot" id="compass-plot" role="img" aria-label="An uncluttered compass. Move the crosshair or adjust the sliders to describe your own experience."><div class="plot-vlabel">HIGHER ENERGY</div><div class="plot-horizontal" aria-hidden="true"></div><div class="plot-vertical" aria-hidden="true"></div><div class="quadrant q1"><span>Unpleasant<br>+ more energy</span><small>tense · activated</small></div><div class="quadrant q2"><span>Pleasant<br>+ more energy</span><small>upbeat · energized</small></div><div class="quadrant q3"><span>Unpleasant<br>+ less energy</span><small>low · depleted</small></div><div class="quadrant q4"><span>Pleasant<br>+ less energy</span><small>settled · calm</small></div><button type="button" class="feeling-marker" id="marker" aria-label="Your chosen place on the compass; use the sliders for precise control">✦</button><div class="plot-bottom">LOWER ENERGY</div><div class="plot-left">UNPLEASANT</div><div class="plot-right">PLEASANT</div></div><div class="felt-position" aria-live="polite" id="compass-feedback"></div></div><aside class="emotion-side"><p class="eyebrow">Where you placed yourself</p><h2 id="quadrant-title">Middle ground</h2><p id="quadrant-copy">Start wherever you are. A mixed or unclear experience is a valid answer.</p><p class="fine">The compass has no plotted emotion dots and does not auto-assign a label. The feeling words below are yours to explore, not scores tied to a coordinate.</p><button class="button" type="button" id="checkin-link">Reflect on this feeling ↗</button><p class="fine">This opens a separate, gentle feelings check-in—not the eight-question emotion-to-action tool.</p></aside></section><section class="emotion-word-browser"><div class="section-head"><div><p class="eyebrow">The full word wheel</p><h2>Or find a word that feels close.</h2></div><p class="fine">107 distinct emotion labels, with both “Dismayed” wheel contexts preserved. Select as many feelings as fit, or none.</p></div><label class="field">Search all emotion words<input id="emotion-search" type="search" placeholder="Try tender, exhausted, frustrated…"></label><div class="family-filters" id="family-filters">${["All", "Fear", "Anger", "Sadness", "Surprise", "Joy", "Love"].map((f) => `<button class="chip ${f === "All" ? "active" : ""}" data-family="${f}">${f === "All" ? "All feeling words" : f}</button>`).join("")}</div><div id="emotion-word-results" class="emotion-word-results"></div><div class="mixed-result" id="selected-feelings"></div></section><section id="emotion-profile" class="profile-card" hidden></section><section id="emotion-checkin" class="emotion-checkin" hidden></section><section class="state-compass" id="state-panel" hidden><div class="section-head"><div><p class="eyebrow">State compass · separate from emotion words</p><h2>What else is in the mix?</h2></div><p class="fine">Energy-related, physical, social and sensory states can exist alongside emotions. These are cues to consider, not labels that explain everything.</p></div><div class="state-tags">${stateItems.map(([label, desc]) => `<label class="state-tag"><input type="checkbox" value="${esc(label)}"><span><b>${esc(label)}</b><small>${esc(desc)}</small></span></label>`).join("")}</div><label class="field">Something missing? Add your own state<input id="custom-state" placeholder="e.g. jet-lagged, restless, low blood sugar"></label><p id="state-summary" class="fine" aria-live="polite"></p><a class="button" href="#tool/state-check">Use the fuller state check →</a></section><section class="body-sensations"><p class="eyebrow">From noticing to next steps</p><h2>No single feeling has to decide what happens next.</h2><p>Choose an optional next route. Or stop here.</p><div class="row"><a class="button secondary" href="#tool/body-check">Notice body sensations</a><a class="button secondary" href="#tool/emotion-timeline">Explore a feeling timeline</a><a class="button secondary" href="#tool/mixed-feelings">Make room for mixed feelings</a><a class="button secondary" href="#questions">Explore a decision or challenge</a></div></section></div>`;
  const renderPosition = () => {
    const plot = root.querySelector("#compass-plot"),
      marker = root.querySelector("#marker"),
      px = 8 + (x + 100) * 0.42,
      py = 8 + (100 - y) * 0.42;
    marker.style.left = `${px}%`;
    marker.style.top = `${py}%`;
    const pleasant =
        x > 24 ? "pleasant" : x < -24 ? "unpleasant" : "mixed or neither",
      energy =
        y > 33 ? "more energy" : y < -33 ? "less energy" : "moderate energy";
    root.querySelector("#pleasantness-value").value =
      pleasant === "mixed or neither"
        ? "Mixed / neither"
        : pleasant[0].toUpperCase() + pleasant.slice(1);
    root.querySelector("#energy-value").value =
      energy[0].toUpperCase() + energy.slice(1);
    root.querySelector("#compass-feedback").textContent =
      `Your description: ${pleasant}; ${energy}. No emotion has been assigned to this position.`;
    const names = {
      "pleasant-more energy": [
        "Pleasant · more energy",
        "You describe this moment as both more pleasant and more activated. This could feel like many different things, or like no emotion word at all.",
      ],
      "unpleasant-more energy": [
        "Unpleasant · more energy",
        "You describe this moment as both more unpleasant and more activated. Several emotions and body states can overlap here.",
      ],
      "pleasant-less energy": [
        "Pleasant · less energy",
        "You describe this moment as more pleasant and less activated. Quietness can be welcome, neutral, or something else.",
      ],
      "unpleasant-less energy": [
        "Unpleasant · less energy",
        "You describe this moment as more unpleasant and less activated. Fatigue, low mood, illness, and context can all matter.",
      ],
      middle: [
        "Middle ground",
        "Start wherever you are. A mixed or unclear experience is a valid answer.",
      ],
    };
    let key = "middle";
    if (Math.abs(x) > 24 && Math.abs(y) > 33)
      key = `${x > 0 ? "pleasant" : "unpleasant"}-${y > 0 ? "more energy" : "less energy"}`;
    root.querySelector("#quadrant-title").textContent = names[key][0];
    root.querySelector("#quadrant-copy").textContent = names[key][1];
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
      )}<div class="row"><button class="button">Finish check-in</button><button class="button secondary" id="close-checkin" type="button">Close without saving</button></div></form><div id="feelings-summary" class="notice" hidden></div><p class="fine">Nothing is sent to the site. Use Save on this device only if you want this check-in in My Maps.</p>`;
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
        .join(
          "",
        )}<button class="button" id="save-feelings" type="button">Save to My Maps</button><p class="fine" id="save-feelings-status" role="status"></p>`;
      summary.querySelector("#save-feelings").onclick = () => {
        try {
          saveMap({
            title: "Feelings check-in",
            tool: "emotion-check-in",
            answers: d,
          });
          summary.querySelector("#save-feelings-status").textContent =
            "Saved on this device.";
        } catch {
          summary.querySelector("#save-feelings-status").textContent =
            "Could not save here. You can keep these notes in this tab or copy them.";
        }
      };
    };
    box.scrollIntoView({ behavior: "smooth" });
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
