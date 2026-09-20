const $ = (selector, root = document) => root.querySelector(selector);
const stage = $("#game-stage");
const root = $(".ndp-page");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const settingInputs = {
  motion: $("#mix-motion"),
  sound: $("#mix-sound"),
  repeat: $("#mix-repeat"),
  unpredictable: $("#mix-unpredictability"),
  brightness: $("#mix-brightness"),
  input: $("#mix-input"),
};
const settingOutputs = {
  motion: $("#motion-value"),
  sound: $("#sound-value"),
  repeat: $("#repeat-value"),
  unpredictable: $("#unpredictability-value"),
  brightness: $("#brightness-value"),
  input: $("#input-value"),
};
const settingOutputIds = {
  motion: "motion-value",
  sound: "sound-value",
  repeat: "repeat-value",
  unpredictable: "unpredictability-value",
  brightness: "brightness-value",
  input: "input-value",
};
const baseSettings = {
  motion: reducedMotion ? 18 : 40,
  sound: 15,
  repeat: 55,
  unpredictable: 25,
  brightness: 75,
  input: 45,
};
const settings = { ...baseSettings };
const recipeKey = "nobodys-simple-sensory-recipes-v1";
const colourSet = [154, 38, 224, 353, 184, 278, 22, 157];
const stones = [
  ["river", "#698f8c"], ["amber", "#c68e51"], ["moss", "#78926f"],
  ["cloud", "#aaa8a0"], ["berry", "#a45f70"], ["tide", "#587b9c"],
  ["lichen", "#a3a566"], ["plum", "#827397"], ["sand", "#b9a077"],
  ["rain", "#6889a7"], ["fern", "#6e936f"], ["clay", "#b8755b"],
  ["dusk", "#6f718f"], ["reed", "#b4a34b"], ["sea glass", "#5fa59b"]
];
let activeGame = "liquid";
let selectedStone = null;
let sortedStones = Array(stones.length).fill(null);
let foldCount = 0;
let pattern = Array(16).fill(false);
let soundEnabled = false;
let paused = false;
let spinning = false;
let audioContext = null;
let surfaces = [];
let mixerSurface = null;
let frameTime = 0;
let motionTime = 0;
let statusText = "";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}
function readSettings() {
  Object.keys(settingInputs).forEach((key) => {
    settings[key] = Number(settingInputs[key].value);
  });
}
function describeMotion(value) {
  if (value < 15) return "Almost still";
  if (value < 38) return "A quiet drift";
  if (value < 68) return "A steady flow";
  return "A lively swirl";
}
function syncSettings() {
  readSettings();
  Object.keys(settings).forEach((key) => {
    settingOutputs[key].value = String(settings[key]);
    settingOutputs[key].textContent = String(settings[key]);
  });
  root.style.setProperty("--nd-brightness", String(0.55 + settings.brightness * 0.006));
  $("#preview-caption").textContent = describeMotion(settings.motion);
}
if (reducedMotion) {
  settingInputs.motion.value = String(baseSettings.motion);
  $("#motion-note").hidden = false;
}
Object.values(settingInputs).forEach((input) => {
  input.addEventListener("input", syncSettings);
});
syncSettings();

function setTab(name) {
  const yard = name === "yard";
  $("#tab-yard").classList.toggle("active", yard);
  $("#tab-yard").setAttribute("aria-selected", String(yard));
  $("#tab-yard").tabIndex = yard ? 0 : -1;
  $("#tab-mixer").classList.toggle("active", !yard);
  $("#tab-mixer").setAttribute("aria-selected", String(!yard));
  $("#tab-mixer").tabIndex = yard ? -1 : 0;
  $("#yard-panel").hidden = !yard;
  $("#mixer-panel").hidden = yard;
}
$("#tab-yard").addEventListener("click", () => setTab("yard"));
$("#tab-mixer").addEventListener("click", () => setTab("mixer"));
$(".ndp-tabs").addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  const next = event.key === "Home" || event.key === "ArrowLeft" ? "yard" : "mixer";
  setTab(next);
  (next === "yard" ? $("#tab-yard") : $("#tab-mixer")).focus();
});
document.querySelectorAll("[data-open-mixer]").forEach((button) => {
  button.addEventListener("click", () => {
    setTab("mixer");
    $("#tab-mixer").focus();
  });
});

function stageMarkup(title, description, controls, content, status) {
  stage.innerHTML =
    '<section class="ndp-stage' + (paused ? " ndp-paused" : "") + '">' +
      '<div class="ndp-stage-head"><div><h2>' + title + '</h2><p>' + description + '</p></div>' +
      '<div class="ndp-stage-tools">' + controls + '</div></div>' +
      '<div class="ndp-stage-content">' + content + '</div>' +
      '<p class="ndp-stage-status" id="game-status" role="status" aria-live="polite">' + status + '</p>' +
    '</section>';
}
function standardControls(extra) {
  const pauseLabel = paused ? "Resume movement" : "Pause movement";
  return (extra || "") +
    '<button type="button" class="ndp-control secondary" data-action="toggle-pause" aria-pressed="' + paused + '">' + pauseLabel + '</button>' +
    '<button type="button" class="ndp-control secondary" data-action="reset">Reset</button>';
}
function canvasMarkup(label) {
  return '<canvas id="stim-canvas" class="ndp-canvas" aria-hidden="true" title="' + escapeHTML(label) + '"></canvas>';
}
function stoneMarkup(index) {
  const stone = stones[index];
  const selected = selectedStone === index;
  return '<button type="button" class="ndp-stone" data-stone="' + index + '" style="--stone-color:' + stone[1] + '" aria-label="' +
    escapeHTML(stone[0]) + ' stone" aria-pressed="' + selected + '">' + escapeHTML(stone[0]) + '</button>';
}
function renderStoneTokens() {
  const bed = $("#stone-bed", stage);
  if (!bed) return;
  bed.innerHTML = stones.map((stone, index) => sortedStones[index] === null ? stoneMarkup(index) : "").join("");
  ["a", "b", "c"].forEach((bowl) => {
    const target = $("#bowl-" + bowl + "-items", stage);
    target.innerHTML = sortedStones.map((group, index) =>
      group === bowl ? '<span class="ndp-stone-chip" style="--stone-color:' + stones[index][1] + '" title="' + escapeHTML(stones[index][0]) + ' stone"></span>' : ""
    ).join("");
    const amount = sortedStones.filter((group) => group === bowl).length;
    $("#bowl-" + bowl, stage).setAttribute("aria-label", "Move selected stone to bowl " + bowl.toUpperCase() + ". " + amount + " stones.");
  });
}
function setGame(game) {
  activeGame = game;
  selectedStone = null;
  pattern = Array(16).fill(false);
  soundEnabled = false;
  spinning = false;
  surfaces = [];
  document.querySelectorAll(".ndp-game-choice").forEach((button) => {
    const selected = button.dataset.game === game;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  if (game === "stones") {
    stageMarkup(
      "Sort stones",
      "Move smooth little tokens into any groups you like. There is no right sorting rule.",
      standardControls(),
      '<div class="ndp-stones-layout"><div><p class="ndp-game-hint">Choose a stone, then choose a bowl. You can sort by colour, texture, or whatever catches your eye.</p><div class="ndp-stone-bed" id="stone-bed" aria-label="Unsorted stones"></div></div><div class="ndp-bowls" aria-label="Your groups">' +
        ["a", "b", "c"].map((key) => '<button type="button" class="ndp-bowl" id="bowl-' + key + '" data-bowl="' + key + '"><span>Bowl ' + key.toUpperCase() + '</span><span class="ndp-bowl-items" id="bowl-' + key + '-items"></span></button>').join("") +
      '</div></div>',
      "Select one stone, then place it in a bowl. Reset to start again."
    );
    renderStoneTokens();
  } else if (game === "folds") {
    stageMarkup(
      "Endless paper folds",
      "Make a fold, unfold it, and watch a new little pattern appear.",
      standardControls(),
      canvasMarkup("Animated paper folds") +
        '<div class="ndp-paper-controls"><button type="button" class="ndp-control" data-action="fold">Fold once</button><span class="ndp-paper-count" id="fold-count" aria-live="polite">No folds yet</span><button type="button" class="ndp-control secondary" data-action="unfold">Unfold once</button></div>',
      "Use the buttons to fold and unfold the paper. There is no end state."
    );
    const surface = createSurface($("#stim-canvas", stage), "folds");
    surface.foldCount = foldCount;
    surfaces.push(surface);
  } else if (game === "liquid") {
    stageMarkup(
      "Liquid motion",
      "Move a finger or pointer through the colour. Pause it, or give it a nudge.",
      standardControls('<button type="button" class="ndp-control" data-action="nudge">Give it a nudge</button>'),
      canvasMarkup("Slow moving pools of colour"),
      "Move over the colour field to change its flow. You can also use the nudge button."
    );
    surfaces.push(createSurface($("#stim-canvas", stage), "liquid"));
  } else if (game === "particles") {
    stageMarkup(
      "Bouncing particles",
      "A soft field of moving lights. Your pointer can send a little ripple through it.",
      standardControls('<button type="button" class="ndp-control" data-action="nudge">Add a ripple</button>'),
      canvasMarkup("Bouncing particles"),
      "Move over the field or use Add a ripple. Adjust the mix to change motion and pattern."
    );
    surfaces.push(createSurface($("#stim-canvas", stage), "particles"));
  } else if (game === "tapping") {
    const cells = Array.from({ length: 16 }, (_, index) =>
      '<button type="button" class="ndp-pattern-cell" data-tile="' + index + '" style="--tile-hue:' + colourSet[index % colourSet.length] + '" aria-label="Pattern tile ' + (index + 1) + '" aria-pressed="false"></button>'
    ).join("");
    stageMarkup(
      "Pattern taps",
      "Tap out any shape or rhythm that feels satisfying. No beat to learn, no pattern to solve.",
      standardControls('<button type="button" class="ndp-control" data-action="sound-toggle" aria-pressed="false">Turn sound on</button>'),
      '<div class="ndp-pattern-grid" aria-label="A grid of sixteen repeatable pattern tiles">' + cells + '</div>',
      "Sound is off. Turn it on if you want soft tones when you tap."
    );
  } else {
    stageMarkup(
      "Little mechanism",
      "A looping arrangement of gears. Watch it turn, or set its pace yourself.",
      standardControls('<button type="button" class="ndp-control" data-action="spin-toggle" aria-pressed="false">Start turning</button><button type="button" class="ndp-control secondary" data-action="spin-step">Turn once</button>'),
      canvasMarkup("A set of interlocking gears"),
      "Start the loop or turn it one step at a time."
    );
    const surface = createSurface($("#stim-canvas", stage), "mechanism");
    surface.spinning = false;
    surface.manualAngle = 0;
    surfaces.push(surface);
  }
}
function createSurface(canvas, type) {
  const surface = {
    canvas,
    ctx: canvas.getContext("2d"),
    type,
    width: 0,
    height: 0,
    time: 0,
    pointer: { x: 0.5, y: 0.5, until: 0 },
    particles: [],
    foldCount,
    spinning: false,
    manualAngle: 0
  };
  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    surface.pointer.x = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
    surface.pointer.y = clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
    surface.pointer.until = performance.now() + 850;
  });
  canvas.addEventListener("pointerleave", () => {
    surface.pointer.until = 0;
  });
  resizeSurface(surface);
  return surface;
}
function resizeSurface(surface) {
  const rect = surface.canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);
  if (surface.canvas.width !== width || surface.canvas.height !== height) {
    surface.canvas.width = width;
    surface.canvas.height = height;
    surface.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    surface.width = rect.width;
    surface.height = rect.height;
  }
  return true;
}
function fillBackground(ctx, width, height, colour) {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, width, height);
}
function drawLiquid(surface, now, compact) {
  const ctx = surface.ctx, w = surface.width, h = surface.height;
  fillBackground(ctx, w, h, "#15383d");
  ctx.globalCompositeOperation = "screen";
  const motion = settings.motion / 100;
  const surprise = settings.unpredictable / 100;
  const colors = ["#67cead", "#e6a95d", "#899ce0", "#e27684", "#57b9bf", "#be82bc"];
  const count = compact ? 4 : 6;
  for (let i = 0; i < count; i += 1) {
    const phase = surface.time * (0.16 + i * 0.025) + i * 2.18;
    const sway = Math.sin(surface.time * 0.17 + i * 1.31) * surprise * 0.07;
    let cx = w * (0.5 + Math.cos(phase) * (compact ? 0.24 : 0.25) + sway);
    let cy = h * (0.5 + Math.sin(phase * 0.83) * (compact ? 0.21 : 0.24) - sway);
    if (now < surface.pointer.until) {
      const pull = settings.input / 100 * 0.24;
      cx += (surface.pointer.x * w - cx) * pull;
      cy += (surface.pointer.y * h - cy) * pull;
    }
    const radius = Math.min(w, h) * (0.22 + (Math.sin(phase * 0.47) + 1) * 0.055);
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, colors[i] + "e8");
    gradient.addColorStop(0.44, colors[i] + "9a");
    gradient.addColorStop(1, colors[i] + "00");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "rgb(229 241 217 / 0.22)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const r = Math.min(w, h) * (0.12 + i * 0.045 + Math.sin(surface.time * 0.25 + i) * 0.012 * motion);
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.5, r * 1.5, r * 0.72, Math.sin(surface.time * 0.08) * 0.24, 0, Math.PI * 2);
    ctx.stroke();
  }
}
function makeParticle() {
  return {
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    size: 1.5 + Math.random() * 4,
    hue: Math.floor(145 + Math.random() * 170)
  };
}
function drawParticles(surface, now, dt) {
  const ctx = surface.ctx, w = surface.width, h = surface.height;
  fillBackground(ctx, w, h, "#142f35");
  const desired = 22 + Math.round(settings.repeat * 0.55);
  while (surface.particles.length < desired) surface.particles.push(makeParticle());
  if (surface.particles.length > desired) surface.particles.length = desired;
  const move = settings.motion / 100;
  const jitter = settings.unpredictable / 100;
  const input = settings.input / 100;
  const seconds = Math.min(dt, 70) / 1000;
  surface.particles.forEach((p, i) => {
    if (move > 0) {
      p.vx += (Math.random() - 0.5) * jitter * seconds * 0.55;
      p.vy += (Math.random() - 0.5) * jitter * seconds * 0.55;
      p.x += p.vx * seconds * (0.25 + move * 1.9);
      p.y += p.vy * seconds * (0.25 + move * 1.9);
      if (p.x < 0.025 || p.x > 0.975) p.vx *= -1;
      if (p.y < 0.04 || p.y > 0.96) p.vy *= -1;
      p.x = clamp(p.x, 0.025, 0.975);
      p.y = clamp(p.y, 0.04, 0.96);
    }
    if (now < surface.pointer.until) {
      const dx = p.x - surface.pointer.x, dy = p.y - surface.pointer.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 0.001;
      if (distance < 0.32) {
        const force = (0.32 - distance) * input * seconds * 0.55;
        p.x += dx / distance * force;
        p.y += dy / distance * force;
      }
    }
    const x = p.x * w, y = p.y * h;
    ctx.beginPath();
    ctx.fillStyle = "hsla(" + p.hue + ", 69%, 76%, .84)";
    ctx.shadowColor = "hsla(" + p.hue + ", 75%, 65%, .42)";
    ctx.shadowBlur = 8;
    ctx.arc(x, y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    if (settings.repeat > 52 && i % 3 === 0) {
      ctx.beginPath();
      ctx.strokeStyle = "hsla(" + p.hue + ", 58%, 74%, .21)";
      ctx.moveTo(x, y);
      ctx.lineTo(x + p.vx * 38, y + p.vy * 38);
      ctx.stroke();
    }
  });
}
function drawGear(ctx, x, y, radius, teeth, angle, colour) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  for (let i = 0; i < teeth * 4; i += 1) {
    const a = i / (teeth * 4) * Math.PI * 2;
    const r = radius * ([1, 1, 0.82, 0.82][i % 4]);
    const px = Math.cos(a) * r, py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = colour;
  ctx.fill();
  ctx.strokeStyle = "rgb(255 246 223 / .5)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.57, 0, Math.PI * 2);
  ctx.fillStyle = "#183a3e";
  ctx.fill();
  ctx.stroke();
  for (let i = 0; i < 6; i += 1) {
    const a = i / 6 * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * radius * 0.2, Math.sin(a) * radius * 0.2);
    ctx.lineTo(Math.cos(a) * radius * 0.48, Math.sin(a) * radius * 0.48);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.12, 0, Math.PI * 2);
  ctx.fillStyle = "#f4ca75";
  ctx.fill();
  ctx.restore();
}
function drawMechanism(surface) {
  const ctx = surface.ctx, w = surface.width, h = surface.height;
  fillBackground(ctx, w, h, "#18383d");
  const cx = w / 2, cy = h / 2 + 10;
  const baseAngle = surface.manualAngle + (surface.spinning ? surface.time * (0.18 + settings.motion * 0.008) : 0);
  const r = Math.min(w * 0.12, h * 0.22, 70);
  drawGear(ctx, cx - r * 0.95, cy, r, 12, baseAngle, "#d48f4e");
  drawGear(ctx, cx + r * 0.95, cy, r, 12, -baseAngle, "#72aaa0");
  drawGear(ctx, cx, cy - r * 1.08, r * 0.72, 10, -baseAngle * 1.2, "#9c8fc5");
  drawGear(ctx, cx, cy + r * 1.08, r * 0.72, 10, baseAngle * 1.2, "#dbb560");
  ctx.beginPath();
  ctx.strokeStyle = "rgb(235 229 205 / 0.17)";
  ctx.setLineDash([3, 8]);
  ctx.arc(cx, cy, r * 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}
function drawFolds(surface) {
  const ctx = surface.ctx, w = surface.width, h = surface.height;
  fillBackground(ctx, w, h, "#18373c");
  const cx = w / 2, cy = h / 2 + 4;
  const count = clamp(3 + Math.floor(settings.repeat / 18), 3, 8);
  const fold = surface.foldCount || 0;
  const width = Math.min(w * 0.69, 600);
  const height = Math.min(h * 0.54, 190);
  const phase = paused ? 0 : Math.sin(surface.time * 0.35) * settings.motion / 100 * 0.035;
  ctx.save();
  ctx.translate(cx, cy);
  for (let i = count - 1; i >= 0; i -= 1) {
    const spread = (i - (count - 1) / 2) * (4 + fold * 0.8);
    const rotation = phase * (i % 2 ? 1 : -1) + ((fold + i) % 2 ? -0.025 : 0.025);
    ctx.save();
    ctx.translate(spread, spread * 0.35);
    ctx.rotate(rotation);
    const shade = 88 - i * 5 + (fold % 3) * 3;
    ctx.fillStyle = "hsl(" + (40 + i * 8 + fold * 3) + " 57% " + shade + "%)";
    ctx.strokeStyle = "rgb(40 58 52 / .34)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(-width / 2, -height / 2);
    ctx.lineTo(width * 0.38, -height / 2);
    ctx.lineTo(width / 2, -height / 2 + height * 0.2);
    ctx.lineTo(width / 2, height / 2);
    ctx.lineTo(-width / 2, height / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(width * 0.38, -height / 2);
    ctx.lineTo(width * 0.38, -height / 2 + height * 0.22);
    ctx.lineTo(width / 2, -height / 2 + height * 0.2);
    ctx.fillStyle = "rgb(255 255 255 / .32)";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}
function drawSurface(surface, now, dt) {
  if (!resizeSurface(surface)) return;
  surface.time += Math.min(dt, 70) / 1000 * (settings.motion / 100) * 1.3;
  if (surface.type === "liquid" || surface.type === "preview") drawLiquid(surface, now, surface.type === "preview");
  if (surface.type === "particles") drawParticles(surface, now, dt);
  if (surface.type === "mechanism") drawMechanism(surface);
  if (surface.type === "folds") drawFolds(surface);
}
function animate(now) {
  const dt = frameTime ? now - frameTime : 16;
  frameTime = now;
  if (!paused) {
    motionTime += Math.min(dt, 70) / 1000 * (settings.motion / 100) * 1.3;
    surfaces.forEach((surface) => drawSurface(surface, now, dt));
    if (mixerSurface) drawSurface(mixerSurface, now, dt);
  }
  requestAnimationFrame(animate);
}

function setStatus(text) {
  const el = $("#game-status", stage);
  if (el) el.textContent = text;
}
function updateFoldCount() {
  const target = $("#fold-count", stage);
  if (target) target.textContent = foldCount ? foldCount + (foldCount === 1 ? " fold" : " folds") : "No folds yet";
  const surface = surfaces.find((item) => item.type === "folds");
  if (surface) surface.foldCount = foldCount;
}
function refreshStoneStatus() {
  const left = sortedStones.filter((item) => item === null).length;
  setStatus(left ? left + " stones remain on the table. Put them in any bowl, or leave them where they are." : "All stones are in bowls. Reset to play again, or leave them just as they are.");
}
function playTone(index) {
  if (!soundEnabled || settings.sound === 0) return;
  try {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) {
      setStatus("This browser does not support the optional tones.");
      return;
    }
    if (!audioContext) audioContext = new Audio();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const row = Math.floor(index / 4), col = index % 4;
    oscillator.type = "sine";
    oscillator.frequency.value = 195 + col * 48 + row * 33;
    const volume = 0.012 + settings.sound / 100 * 0.055;
    const duration = 0.06 + settings.sound / 100 * 0.23;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.015);
  } catch {
    setStatus("Could not start the optional tones. The visual pattern still works.");
  }
}
function resetCurrentGame() {
  if (activeGame === "stones") {
    sortedStones = Array(stones.length).fill(null);
    selectedStone = null;
    renderStoneTokens();
    setStatus("The stones are ready for another sort. Choose any grouping you like.");
  } else if (activeGame === "folds") {
    foldCount = 0;
    updateFoldCount();
    setStatus("The paper is unfolded. Fold it again whenever you like.");
  } else if (activeGame === "liquid" || activeGame === "particles") {
    const surface = surfaces[0];
    if (surface) {
      surface.time = 0;
      surface.pointer.until = 0;
      surface.particles = [];
    }
    setStatus("The field has settled back to its starting point.");
  } else if (activeGame === "tapping") {
    pattern = Array(16).fill(false);
    document.querySelectorAll("[data-tile]").forEach((tile) => tile.setAttribute("aria-pressed", "false"));
    soundEnabled = false;
    const soundButton = $('[data-action="sound-toggle"]', stage);
    soundButton.textContent = "Turn sound on";
    soundButton.setAttribute("aria-pressed", "false");
    setStatus("The pattern is clear. Sound is off.");
  } else {
    spinning = false;
    const surface = surfaces.find((item) => item.type === "mechanism");
    if (surface) {
      surface.spinning = false;
      surface.manualAngle = 0;
    }
    const spinButton = $('[data-action="spin-toggle"]', stage);
    spinButton.textContent = "Start turning";
    spinButton.setAttribute("aria-pressed", "false");
    setStatus("The mechanism is still. Start it or turn once.");
  }
}
stage.addEventListener("click", (event) => {
  const tile = event.target.closest("[data-tile]");
  if (tile && activeGame === "tapping") {
    const index = Number(tile.dataset.tile);
    pattern[index] = !pattern[index];
    tile.setAttribute("aria-pressed", String(pattern[index]));
    playTone(index);
    const count = pattern.filter(Boolean).length;
    setStatus(count ? count + (count === 1 ? " tile lit. Keep making your own pattern." : " tiles lit. Keep making your own pattern.") : "The pattern is clear. Tap any tile to start one.");
    return;
  }
  const stone = event.target.closest("[data-stone]");
  if (stone && activeGame === "stones") {
    const index = Number(stone.dataset.stone);
    selectedStone = selectedStone === index ? null : index;
    document.querySelectorAll("[data-stone]").forEach((item) => item.setAttribute("aria-pressed", String(Number(item.dataset.stone) === selectedStone)));
    setStatus(selectedStone === null ? "Stone unselected. Choose any stone to continue." : stones[index][0] + " stone selected. Choose a bowl, or choose another stone.");
    return;
  }
  const bowl = event.target.closest("[data-bowl]");
  if (bowl && activeGame === "stones") {
    if (selectedStone === null) {
      setStatus("Choose a stone first, then choose a bowl.");
      return;
    }
    sortedStones[selectedStone] = bowl.dataset.bowl;
    selectedStone = null;
    renderStoneTokens();
    refreshStoneStatus();
    return;
  }
  const button = event.target.closest("[data-action]");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "toggle-pause") {
    paused = !paused;
    const pausedNow = paused;
    document.querySelectorAll('[data-action="toggle-pause"]').forEach((item) => {
      item.textContent = pausedNow ? "Resume movement" : "Pause movement";
      item.setAttribute("aria-pressed", String(pausedNow));
    });
    document.querySelectorAll(".ndp-stage").forEach((item) => item.classList.toggle("ndp-paused", pausedNow));
    setStatus(pausedNow ? "Movement paused. Your controls still work." : "Movement is running again.");
  } else if (action === "reset") {
    resetCurrentGame();
  } else if (action === "fold") {
    foldCount = Math.min(foldCount + 1, 12);
    updateFoldCount();
    setStatus("Fold " + foldCount + ". Fold again or unfold one layer.");
  } else if (action === "unfold") {
    foldCount = Math.max(foldCount - 1, 0);
    updateFoldCount();
    setStatus(foldCount ? "Unfolded one layer. " + foldCount + (foldCount === 1 ? " fold remains." : " folds remain.") : "Fully unfolded.");
  } else if (action === "nudge") {
    const surface = surfaces[0];
    if (surface) {
      surface.pointer.x = 0.67;
      surface.pointer.y = 0.43;
      surface.pointer.until = performance.now() + 1100 + settings.input * 5;
    }
    setStatus(activeGame === "liquid" ? "A little current moves through the colour." : "A ripple travels through the particles.");
  } else if (action === "sound-toggle") {
    soundEnabled = !soundEnabled;
    button.setAttribute("aria-pressed", String(soundEnabled));
    button.textContent = soundEnabled ? "Turn sound off" : "Turn sound on";
    if (soundEnabled && settings.sound === 0) setStatus("Sound is on, but its density is set to zero. Raise Sound Density in the mixer to hear tones.");
    else setStatus(soundEnabled ? "Soft tones will play only when you tap a tile." : "Sound is off.");
  } else if (action === "spin-toggle") {
    spinning = !spinning;
    const surface = surfaces.find((item) => item.type === "mechanism");
    if (surface) surface.spinning = spinning;
    button.textContent = spinning ? "Stop turning" : "Start turning";
    button.setAttribute("aria-pressed", String(spinning));
    setStatus(spinning ? "The gears are turning. Stop them whenever you like." : "The mechanism is still.");
  } else if (action === "spin-step") {
    const surface = surfaces.find((item) => item.type === "mechanism");
    if (surface) surface.manualAngle += 0.35 + settings.input / 100 * 0.9;
    setStatus("One small turn.");
  } else if (action === "clear-pattern") {
    pattern = Array(16).fill(false);
    document.querySelectorAll("[data-tile]").forEach((item) => item.setAttribute("aria-pressed", "false"));
    setStatus("The pattern is clear.");
  }
});

document.querySelectorAll(".ndp-game-choice").forEach((button) => {
  button.addEventListener("click", () => setGame(button.dataset.game));
});

function getRecipes() {
  try {
    const saved = JSON.parse(localStorage.getItem(recipeKey) || "[]");
    return Array.isArray(saved) ? saved.filter((item) => item && typeof item.name === "string" && item.values) : [];
  } catch {
    return [];
  }
}
function renderRecipes() {
  const container = $("#saved-recipes");
  const recipes = getRecipes();
  container.innerHTML = recipes.length ? recipes.map((recipe, index) =>
    '<div class="ndp-recipe-row"><button type="button" class="ndp-recipe-load" data-load-recipe="' + index + '">' + escapeHTML(recipe.name) + '</button><button type="button" class="ndp-recipe-delete" data-delete-recipe="' + index + '" aria-label="Delete ' + escapeHTML(recipe.name) + '">×</button></div>'
  ).join("") : '<p class="ndp-small-note">Your saved recipes will appear here.</p>';
}
function writeRecipes(recipes) {
  try {
    localStorage.setItem(recipeKey, JSON.stringify(recipes));
    return true;
  } catch {
    return false;
  }
}
function captureSettings() {
  return Object.fromEntries(Object.keys(settingInputs).map((key) => [key, Number(settingInputs[key].value)]));
}
function applyRecipe(values) {
  Object.keys(settingInputs).forEach((key) => {
    if (Number.isFinite(Number(values[key]))) settingInputs[key].value = String(clamp(Number(values[key]), 0, 100));
  });
  syncSettings();
}
$("#save-recipe").addEventListener("click", () => {
  const name = $("#recipe-name").value.trim();
  const status = $("#recipe-status");
  if (!name) {
    status.textContent = "Give this recipe a name first.";
    $("#recipe-name").focus();
    return;
  }
  const recipes = getRecipes();
  const existing = recipes.findIndex((recipe) => recipe.name.toLowerCase() === name.toLowerCase());
  const recipe = { name, values: captureSettings() };
  if (existing >= 0) recipes.splice(existing, 1, recipe);
  else recipes.unshift(recipe);
  if (recipes.length > 12) recipes.length = 12;
  if (!writeRecipes(recipes)) {
    status.textContent = "This browser could not save the recipe. Check its local storage settings.";
    return;
  }
  status.textContent = "“" + name + "” saved on this device.";
  renderRecipes();
});
$("#saved-recipes").addEventListener("click", (event) => {
  const load = event.target.closest("[data-load-recipe]");
  const remove = event.target.closest("[data-delete-recipe]");
  const recipes = getRecipes();
  if (load) {
    const recipe = recipes[Number(load.dataset.loadRecipe)];
    if (recipe) {
      applyRecipe(recipe.values);
      $("#recipe-status").textContent = "Loaded “" + recipe.name + "”.";
    }
  }
  if (remove) {
    const index = Number(remove.dataset.deleteRecipe);
    const recipe = recipes[index];
    recipes.splice(index, 1);
    if (writeRecipes(recipes)) {
      $("#recipe-status").textContent = recipe ? "Deleted “" + recipe.name + "”." : "Recipe deleted.";
      renderRecipes();
    } else {
      $("#recipe-status").textContent = "This browser could not delete that recipe.";
    }
  }
});
function createMixerPreview() {
  const canvas = $("#mixer-canvas");
  mixerSurface = createSurface(canvas, "preview");
  mixerSurface.pointer.until = 0;
  $("#mixer-nudge").addEventListener("click", () => {
    mixerSurface.pointer.x = Math.random() * 0.6 + 0.2;
    mixerSurface.pointer.y = Math.random() * 0.6 + 0.2;
    mixerSurface.pointer.until = performance.now() + 1300 + settings.input * 8;
    $("#preview-caption").textContent = "A nudge through the mix";
  });
}
renderRecipes();
createMixerPreview();
setGame("liquid");
requestAnimationFrame(animate);
