const $ = (selector, root = document) => root.querySelector(selector);
const stage = $("#game-stage");
const page = $(".ndp-page");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const input = {
  motion: $("#mix-motion"),
  sound: $("#mix-sound"),
  repeat: $("#mix-repeat"),
  unpredictable: $("#mix-unpredictability"),
  brightness: $("#mix-brightness"),
  intensity: $("#mix-input")
};
const output = {
  motion: $("#motion-value"),
  sound: $("#sound-value"),
  repeat: $("#repeat-value"),
  unpredictable: $("#unpredictability-value"),
  brightness: $("#brightness-value"),
  intensity: $("#input-value")
};
const defaults = {
  motion: reducedMotion ? 18 : 40,
  sound: 15,
  repeat: 55,
  unpredictable: 25,
  brightness: 75,
  intensity: 45
};
const settings = { ...defaults };
const recipeKey = "nobodys-simple-sensory-recipes-v1";
const bubbleColours = [
  { rgb: [113, 214, 221], hue: 185 },
  { rgb: [242, 164, 173], hue: 350 },
  { rgb: [243, 204, 123], hue: 42 },
  { rgb: [168, 154, 230], hue: 251 },
  { rgb: [130, 218, 178], hue: 151 },
  { rgb: [239, 174, 112], hue: 26 }
];
const noteFrequencies = [261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25];
const noteNames = ["C", "D", "E", "G", "A", "C", "D", "E"];
const followNotes = [0, 2, 4, 6, 7, 5, 3, 1];
let activeGame = "bubbles";
let activeSurface = null;
let mixerSurface = null;
let paused = false;
let soundEnabled = false;
let toneStyle = "bell";
let bubblePace = 0.62;
let gardenPhase = "day";
let audioContext = null;
let followMode = false;
let followClock = 0;
let followIndex = 0;
let simClock = 0;
let lastFrame = 0;

function clamp(value, low, high) {
  return Math.min(high, Math.max(low, value));
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);
}
function motionRate() {
  return 0.12 + settings.motion / 100 * 1.38;
}
function syncMixer() {
  Object.keys(input).forEach((key) => {
    settings[key] = Number(input[key].value);
    output[key].value = String(settings[key]);
    output[key].textContent = String(settings[key]);
  });
  page.style.setProperty("--nd-brightness", String(0.48 + settings.brightness * 0.0065));
  $("#preview-caption").textContent = settings.motion < 15 ? "Almost still" : settings.motion < 38 ? "A quiet drift" : settings.motion < 68 ? "A steady flow" : "A lively swirl";
}
if (reducedMotion) {
  input.motion.value = String(defaults.motion);
  $("#motion-note").hidden = false;
}
Object.values(input).forEach((slider) => slider.addEventListener("input", syncMixer));
syncMixer();

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
$("[data-open-mixer]").addEventListener("click", () => {
  setTab("mixer");
  $("#tab-mixer").focus();
});

function stageFrame(title, description, controls, content, status) {
  stage.innerHTML =
    '<section class="ndp-stage">' +
      '<div class="ndp-stage-head"><div><h2>' + title + '</h2><p>' + description + '</p></div>' +
      '<div class="ndp-stage-tools">' + controls + '</div></div>' +
      '<div class="ndp-stage-content">' + content + '</div>' +
      '<p class="ndp-stage-status" id="game-status" role="status" aria-live="polite">' + status + '</p>' +
    '</section>';
}
function soundControl() {
  return '<button type="button" class="ndp-control secondary" data-action="sound" aria-pressed="' + soundEnabled + '">' + (soundEnabled ? "Sound on" : "Sound off") + '</button>';
}
function movementControls(extra) {
  return (extra || "") +
    '<button type="button" class="ndp-control secondary" data-action="pause" aria-pressed="' + paused + '">' + (paused ? "Resume" : "Pause") + '</button>' +
    '<button type="button" class="ndp-control secondary" data-action="reset">Reset</button>';
}
function makeCanvas(label, id) {
  return '<canvas class="ndp-canvas" id="' + id + '" aria-hidden="true" title="' + escapeHTML(label) + '"></canvas>';
}
function makeBubble() {
  const colour = bubbleColours[Math.floor(Math.random() * bubbleColours.length)];
  const depth = 0.32 + Math.random() * 0.68;
  const minSide = Math.min(activeSurface.width || 500, activeSurface.height || 350);
  return {
    x: Math.random() * (activeSurface.width || 500),
    y: Math.random() * (activeSurface.height || 350),
    depth,
    radius: (12 + Math.random() * 25) * (0.55 + depth * 0.65),
    rise: (0.08 + depth * 0.08) * bubblePace,
    drift: (Math.random() - 0.5) * 0.045,
    wobble: Math.random() * Math.PI * 2,
    colour,
    angle: Math.random() * Math.PI * 2,
    widthRatio: 0.78 + Math.random() * 0.3,
    scale: minSide / 360
  };
}
function seedBubbles(surface) {
  surface.bubbles = [];
  const amount = 10 + Math.round(settings.repeat * 0.14);
  for (let i = 0; i < amount; i += 1) {
    const bubble = makeBubble();
    bubble.y = Math.random() * (surface.height || 350);
    surface.bubbles.push(bubble);
  }
}
function canvasMarkupForBubble() {
  return '<div class="ndp-pace" role="group" aria-label="Bubble speed"><span class="ndp-pace-label">Float pace</span>' +
    '<button type="button" class="ndp-option" data-pace="0.38" aria-pressed="false">Slow</button>' +
    '<button type="button" class="ndp-option" data-pace="0.62" aria-pressed="true">Steady</button>' +
    '<button type="button" class="ndp-option" data-pace="0.94" aria-pressed="false">Quick</button></div>' +
    '<div class="ndp-bubble-area">' + makeCanvas("Colourful glass bubbles drift up; touch one to pop it.", "game-canvas") + '</div>';
}
function musicKeys() {
  return noteNames.map((name, index) =>
    '<button type="button" class="ndp-music-key" data-note="' + index + '" style="--key-hue:' + (index * 41 + 28) % 360 + '" aria-label="Play ' + name + ', bar ' + (index + 1) + '">' +
      '<span class="ndp-key-label">' + name + '</span><span class="ndp-key-note">' + (index + 1) + '</span></button>'
  ).join("");
}
function renderGame(game) {
  if (activeSurface && activeSurface.resizeObserver) activeSurface.resizeObserver.disconnect();
  activeGame = game;
  activeSurface = null;
  followMode = false;
  followClock = 0;
  followIndex = 0;
  document.querySelectorAll(".ndp-game-choice").forEach((button) => {
    const selected = button.dataset.game === game;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  if (game === "bubbles") {
    stageFrame(
      "Bubble Pop",
      "Touch a bubble and watch it burst into a little spray of light. Misses do not count.",
      movementControls(soundControl()),
      canvasMarkupForBubble(),
      "No score and nothing to lose. Pop as many or as few as you like."
    );
    activeSurface = makeSurface($("#game-canvas"), "bubbles");
    seedBubbles(activeSurface);
    updatePaceButtons();
  } else if (game === "music") {
    const controls = soundControl() + movementControls();
    stageFrame(
      "Big Music Board",
      "Tap the bars to play a note. Try your own tune, or follow the moving glow.",
      controls,
      '<div class="ndp-music-wrap"><p class="ndp-music-note">Eight big, touch-friendly notes · sound begins only when you turn it on</p>' +
        '<div class="ndp-music-board" role="group" aria-label="Eight note xylophone">' + musicKeys() + '</div>' +
        '<div class="ndp-tone-options" role="group" aria-label="Choose an instrument sound">' +
          '<button type="button" class="ndp-option active" data-tone="bell" aria-pressed="true">Soft bell</button>' +
          '<button type="button" class="ndp-option" data-tone="wood" aria-pressed="false">Wood bar</button>' +
          '<button type="button" class="ndp-option" data-tone="warm" aria-pressed="false">Warm tone</button>' +
        '</div>' +
        '<div class="ndp-followline"><button type="button" class="ndp-option" data-action="follow" aria-pressed="false">Start follow-the-glow</button><span class="ndp-small-note">It loops gently. There is no score or wrong note.</span></div></div>',
      soundEnabled ? "Sound is on. Tap any bar to hear a note." : "The bars light up silently until you switch sound on."
    );
  } else {
    stageFrame(
      "Touch Garden",
      "Touch the ground to grow flowers; touch the sky to release butterflies.",
      movementControls(soundControl()),
      '<div class="ndp-phase" role="group" aria-label="Choose a time of day">' +
        '<span class="ndp-pace-label">Time of day</span>' +
        '<button type="button" class="ndp-option" data-phase="dawn" aria-pressed="false">Dawn</button>' +
        '<button type="button" class="ndp-option" data-phase="day" aria-pressed="true">Day</button>' +
        '<button type="button" class="ndp-option" data-phase="dusk" aria-pressed="false">Dusk</button>' +
      '</div><div class="ndp-garden-area">' + makeCanvas("Tap the ground to grow a flower or tap the sky to release butterflies.", "game-canvas") + '</div>',
      "Each touch makes something happen. Sound is optional."
    );
    activeSurface = makeSurface($("#game-canvas"), "garden");
    activeSurface.flowers = [];
    activeSurface.butterflies = [];
    activeSurface.phase = gardenPhase;
    activeSurface.particles = [];
    updatePhaseButtons();
  }
  updateSoundButtons();
}
function updateSoundButtons() {
  document.querySelectorAll('[data-action="sound"]').forEach((button) => {
    button.textContent = soundEnabled ? "Sound on" : "Sound off";
    button.setAttribute("aria-pressed", String(soundEnabled));
  });
}
function updatePaceButtons() {
  document.querySelectorAll("[data-pace]").forEach((button) => {
    button.setAttribute("aria-pressed", String(Number(button.dataset.pace) === bubblePace));
  });
}
function updatePhaseButtons() {
  document.querySelectorAll("[data-phase]").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.phase === gardenPhase));
  });
}
function makeSurface(canvas, type) {
  const surface = {
    canvas,
    ctx: canvas.getContext("2d"),
    type,
    width: 0,
    height: 0,
    time: 0,
    pointer: { x: 0.5, y: 0.5, until: 0 },
    bubbles: [],
    bursts: [],
    flowers: [],
    butterflies: [],
    particles: [],
    phase: "day"
  };
  const resize = () => resizeSurface(surface);
  if (window.ResizeObserver) {
    surface.resizeObserver = new ResizeObserver(resize);
    surface.resizeObserver.observe(canvas);
  }
  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    surface.pointer.x = clamp(event.clientX - rect.left, 0, rect.width);
    surface.pointer.y = clamp(event.clientY - rect.top, 0, rect.height);
    surface.pointer.until = performance.now() + 500;
  });
  if (type === "bubbles") {
    canvas.addEventListener("pointerdown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      let hit = -1;
      for (let i = surface.bubbles.length - 1; i >= 0; i -= 1) {
        const bubble = surface.bubbles[i];
        const dx = x - bubble.x, dy = y - bubble.y;
        const radius = bubble.radius * bubble.scale * (1.12 + settings.intensity / 650);
        const hit = (dx / (radius * bubble.widthRatio)) ** 2 + (dy / radius) ** 2;
        if (hit <= 1) {
          hit = i;
          break;
        }
      }
      if (hit < 0) {
        surface.bursts.push({ x, y, age: 0, life: 0.45, radius: 18, colour: bubbleColours[Math.floor(Math.random() * bubbleColours.length)] });
        updateStatus("A ripple. Tap a bubble to pop it.");
        return;
      }
      const bubble = surface.bubbles.splice(hit, 1)[0];
      surface.bursts.push({ x: bubble.x, y: bubble.y, age: 0, life: 0.75, radius: bubble.radius, colour: bubble.colour });
      const bits = 9 + Math.round(settings.intensity * 0.13);
      for (let i = 0; i < bits; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 24 + Math.random() * (54 + settings.intensity);
        surface.particles.push({ x: bubble.x, y: bubble.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, life: 0.55 + Math.random() * 0.5, size: 2 + Math.random() * 3, colour: bubble.colour });
      }
      if (soundEnabled) playNote(Math.floor(Math.random() * noteFrequencies.length), "pop");
      updateStatus("Pop. The next bubble is on its way.");
    });
  }
  if (type === "garden") {
    canvas.addEventListener("pointerdown", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left, y = event.clientY - rect.top;
      const ground = surface.height * 0.72;
      if (y >= ground) {
        const bloomSize = 0.74 + settings.intensity / 100 * 0.8;
        const flower = {
          x,
          y: clamp(y - 18, surface.height * 0.48, ground - 10),
          birth: simClock,
          size: (15 + Math.random() * 9) * bloomSize,
          hue: Math.floor(Math.random() * 360),
          petals: 5 + Math.round(settings.repeat / 15),
          sway: Math.random() * Math.PI * 2
        };
        surface.flowers.push(flower);
        if (surface.flowers.length > 90) surface.flowers.shift();
        surface.bursts.push({ x, y: ground - 4, age: 0, life: 0.8, radius: 10, colour: { rgb: [255, 231, 158], hue: 43 } });
        if (soundEnabled) playNote(Math.floor(Math.random() * 5), "chime");
        updateStatus("A new flower has grown.");
      } else {
        const amount = 1 + Math.round(settings.intensity / 42);
        for (let i = 0; i < amount; i += 1) {
          surface.butterflies.push({
            x: clamp(x + (Math.random() - 0.5) * 45, 10, surface.width - 10),
            y: clamp(y + (Math.random() - 0.5) * 35, 10, ground - 30),
            vx: (Math.random() - 0.5) * (20 + settings.unpredictable * 0.5),
            vy: -(12 + Math.random() * 18),
            size: 9 + Math.random() * 8,
            hue: Math.floor(Math.random() * 360),
            wing: Math.random() * Math.PI * 2,
            life: 9 + Math.random() * 8
          });
        }
        surface.bursts.push({ x, y, age: 0, life: 0.65, radius: 8, colour: { rgb: [239, 237, 255], hue: 260 } });
        if (soundEnabled) playNote(Math.floor(Math.random() * 8), "chime");
        updateStatus(amount === 1 ? "A butterfly is fluttering through the garden." : "Butterflies are fluttering through the garden.");
      }
    });
  }
  resizeSurface(surface);
  return surface;
}
function resizeSurface(surface) {
  const rect = surface.canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return false;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(rect.width * dpr);
  const height = Math.round(rect.height * dpr);
  const changed = surface.canvas.width !== width || surface.canvas.height !== height;
  if (surface.canvas.width !== width) surface.canvas.width = width;
  if (surface.canvas.height !== height) surface.canvas.height = height;
  if (changed) {
    surface.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  surface.width = rect.width;
  surface.height = rect.height;
  return true;
}
function updateStatus(text) {
  const status = $("#game-status");
  if (status) status.textContent = text;
}
function rgba(rgb, alpha) {
  return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alpha + ")";
}
function drawBackground(ctx, width, height, top, middle, bottom) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, top);
  gradient.addColorStop(0.58, middle);
  gradient.addColorStop(1, bottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
function drawBubble(surface, bubble) {
  const ctx = surface.ctx, r = bubble.radius * bubble.scale;
  const x = bubble.x, y = bubble.y;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(bubble.angle);
  ctx.scale(bubble.widthRatio, 1);
  ctx.shadowColor = rgba(bubble.colour.rgb, 0.46 * bubble.depth);
  ctx.shadowBlur = r * 0.72;
  const sphere = ctx.createRadialGradient(-r * 0.34, -r * 0.4, r * 0.025, r * 0.17, r * 0.1, r * 1.13);
  sphere.addColorStop(0, "rgba(255,255,255,.87)");
  sphere.addColorStop(0.12, rgba(bubble.colour.rgb, 0.79));
  sphere.addColorStop(0.52, rgba(bubble.colour.rgb, 0.48));
  sphere.addColorStop(0.84, rgba(bubble.colour.rgb, 0.18));
  sphere.addColorStop(1, "rgba(230,246,255,.42)");
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = sphere;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(241,252,255,.53)";
  ctx.lineWidth = Math.max(0.8, r * 0.025);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(-r * 0.34, -r * 0.45, r * 0.22, r * 0.1, -0.42, 0, Math.PI * 2);
  const glint = ctx.createRadialGradient(-r * 0.34, -r * 0.45, 0, -r * 0.34, -r * 0.45, r * 0.24);
  glint.addColorStop(0, "rgba(255,255,255,.98)");
  glint.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glint;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(r * 0.37, r * 0.37, r * 0.09, r * 0.04, 0.6, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,.64)";
  ctx.fill();
  ctx.restore();
}
function drawBubbles(surface, now, dt) {
  const ctx = surface.ctx, w = surface.width, h = surface.height;
  drawBackground(ctx, w, h, "#122e43", "#224f64", "#28636a");
  const horizon = ctx.createLinearGradient(0, h * 0.25, w, h);
  horizon.addColorStop(0, "rgba(123,193,204,.05)");
  horizon.addColorStop(0.5, "rgba(190,222,208,.16)");
  horizon.addColorStop(1, "rgba(118,179,197,.02)");
  ctx.fillStyle = horizon;
  ctx.fillRect(0, h * 0.22, w, h * 0.78);
  const rate = motionRate();
  const seconds = Math.min(dt, 50) / 1000;
  const target = 10 + Math.round(settings.repeat * 0.14);
  while (surface.bubbles.length < target) {
    const bubble = makeBubble();
    bubble.x = Math.random() * w;
    bubble.y = h + bubble.radius + Math.random() * h * 0.45;
    surface.bubbles.push(bubble);
  }
  if (surface.bubbles.length > target + 4) surface.bubbles.length = target + 4;
  surface.bubbles.sort((a, b) => a.depth - b.depth);
  surface.bubbles.forEach((bubble) => {
    const driftAmount = 0.018 + settings.unpredictable / 100 * 0.075;
    bubble.wobble += seconds * rate * (0.45 + settings.unpredictable / 100);
    bubble.y -= (bubble.rise + bubble.depth * 0.025) * rate * seconds * 60;
    bubble.x += (bubble.drift + Math.sin(bubble.wobble) * driftAmount * 0.12) * rate * seconds * 42;
    bubble.angle += Math.sin(bubble.wobble * 0.4) * seconds * rate * 0.04;
    if (bubble.x < -bubble.radius) bubble.x = w + bubble.radius;
    if (bubble.x > w + bubble.radius) bubble.x = -bubble.radius;
    if (bubble.y < -bubble.radius * 2) {
      bubble.x = Math.random() * w;
      bubble.y = h + bubble.radius + Math.random() * 80;
    }
    drawBubble(surface, bubble);
  });
  surface.bursts = surface.bursts.filter((burst) => burst.age < burst.life);
  surface.bursts.forEach((burst) => {
    burst.age += seconds * rate;
    const progress = clamp(burst.age / burst.life, 0, 1);
    const alpha = 1 - progress;
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, burst.radius * (0.6 + progress * 1.9), 0, Math.PI * 2);
    ctx.strokeStyle = rgba(burst.colour.rgb, alpha * 0.72);
    ctx.lineWidth = 1.5 + (1 - progress) * 2.2;
    ctx.stroke();
  });
  surface.particles = surface.particles.filter((particle) => particle.age < particle.life);
  surface.particles.forEach((particle) => {
    particle.age += seconds * rate;
    particle.x += particle.vx * seconds * rate;
    particle.y += particle.vy * seconds * rate;
    particle.vy += 24 * seconds * rate;
    const alpha = 1 - particle.age / particle.life;
    ctx.beginPath();
    ctx.fillStyle = rgba(particle.colour.rgb, alpha);
    ctx.shadowColor = rgba(particle.colour.rgb, alpha * 0.75);
    ctx.shadowBlur = 7;
    ctx.arc(particle.x, particle.y, particle.size * alpha, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
  const light = ctx.createRadialGradient(w * 0.76, h * 0.12, 0, w * 0.76, h * 0.12, h * 0.9);
  light.addColorStop(0, "rgba(198,238,229,.13)");
  light.addColorStop(1, "rgba(198,238,229,0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, w, h);
  const shimmer = 0.1 + Math.sin(surface.time * 1.2) * 0.035;
  ctx.fillStyle = "rgba(207,244,235," + shimmer + ")";
  for (let i = 0; i < 5; i += 1) {
    const x = w * (i + 0.5) / 5 + Math.sin(surface.time * 0.24 + i) * w * 0.04;
    ctx.fillRect(x, 0, 1, h);
  }
}
const gardenPalettes = {
  dawn: ["#ffbe93", "#cf8b9a", "#526c8a", "#607e63", "#1f443c"],
  day: ["#73c7e2", "#a5d7d0", "#f1d98d", "#88b96f", "#315842"],
  dusk: ["#473e7b", "#a36a93", "#e5a06d", "#5e6377", "#263747"]
};
function drawHill(ctx, width, height, baseline, color, amp, phase, shift) {
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, baseline);
  for (let step = 0; step <= 12; step += 1) {
    const x = step / 12 * width;
    const wave = Math.sin(step * 0.58 + phase + shift) * amp + Math.sin(step * 0.21 + shift * 2) * amp * 0.5;
    const y = baseline + wave;
    if (step === 0) ctx.lineTo(x, y);
    else {
      const px = (step - 0.5) / 12 * width;
      const py = baseline + Math.sin((step - 0.5) * 0.58 + phase + shift) * amp * 1.1;
      ctx.quadraticCurveTo(px, py, x, y);
    }
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}
function drawCloud(ctx, x, y, scale, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = "rgba(255,248,230,.62)";
  ctx.shadowColor = "rgba(255,248,232,.28)";
  ctx.shadowBlur = 15 * scale;
  ctx.beginPath();
  ctx.ellipse(x, y, 48 * scale, 14 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 23 * scale, y - 8 * scale, 23 * scale, 19 * scale, -0.2, 0, Math.PI * 2);
  ctx.ellipse(x + 7 * scale, y - 14 * scale, 28 * scale, 25 * scale, 0.1, 0, Math.PI * 2);
  ctx.ellipse(x + 31 * scale, y - 4 * scale, 22 * scale, 17 * scale, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
function drawGardenBackground(surface) {
  const ctx = surface.ctx, w = surface.width, h = surface.height;
  const colors = gardenPalettes[gardenPhase];
  drawBackground(ctx, w, h, colors[0], colors[1], colors[2]);
  const sunX = w * (gardenPhase === "dawn" ? 0.19 : gardenPhase === "dusk" ? 0.8 : 0.72);
  const sunY = h * (gardenPhase === "dawn" || gardenPhase === "dusk" ? 0.46 : 0.24);
  const sunR = Math.min(w, h) * (gardenPhase === "day" ? 0.095 : 0.07);
  const aura = ctx.createRadialGradient(sunX, sunY, sunR * 0.25, sunX, sunY, sunR * 3.4);
  aura.addColorStop(0, gardenPhase === "dusk" ? "rgba(250,164,123,.46)" : "rgba(255,235,177,.47)");
  aura.addColorStop(1, "rgba(255,226,175,0)");
  ctx.fillStyle = aura;
  ctx.fillRect(sunX - sunR * 3.5, sunY - sunR * 3.5, sunR * 7, sunR * 7);
  const orb = ctx.createRadialGradient(sunX - sunR * 0.28, sunY - sunR * 0.3, sunR * 0.04, sunX, sunY, sunR);
  orb.addColorStop(0, "#fff8dc");
  orb.addColorStop(0.58, gardenPhase === "dusk" ? "#ffbd83" : "#f8dfa0");
  orb.addColorStop(1, gardenPhase === "dusk" ? "#ec8f81" : "#f0b56b");
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fillStyle = orb;
  ctx.shadowColor = "rgba(255,222,162,.6)";
  ctx.shadowBlur = sunR * 0.5;
  ctx.fill();
  ctx.shadowBlur = 0;
  if (gardenPhase !== "day") {
    for (let i = 0; i < 42; i += 1) {
      const x = (i * 97 + 23) % Math.max(w, 1);
      const y = (i * 53 + 17) % Math.floor(h * 0.48);
      const blink = 0.23 + (Math.sin(surface.time * 0.5 + i * 4) + 1) * 0.22;
      ctx.beginPath();
      ctx.fillStyle = "rgba(255,244,212," + blink + ")";
      ctx.arc(x, y, (i % 3) * 0.38 + 0.65, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const cloudOffset = surface.time * (gardenPhase === "day" ? 3.1 : 1.5) * motionRate();
  drawCloud(ctx, (w * 0.36 + cloudOffset) % (w + 180) - 75, h * 0.26, 0.82, 0.24);
  drawCloud(ctx, (w * 0.76 - cloudOffset * 0.47 + w) % (w + 150) - 58, h * 0.39, 0.56, 0.19);
  drawHill(ctx, w, h, h * 0.61, colors[3], h * 0.04, surface.time * 0.08, 0.3);
  drawHill(ctx, w, h, h * 0.69, colors[4], h * 0.035, surface.time * 0.1, 2.4);
  const foreground = ctx.createLinearGradient(0, h * 0.72, 0, h);
  foreground.addColorStop(0, colors[4]);
  foreground.addColorStop(1, "#172f32");
  ctx.fillStyle = foreground;
  ctx.fillRect(0, h * 0.72, w, h * 0.28);
  const glow = ctx.createLinearGradient(0, h * 0.72, 0, h * 0.93);
  glow.addColorStop(0, "rgba(255,226,156,.21)");
  glow.addColorStop(1, "rgba(255,226,156,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, h * 0.72, w, h * 0.21);
}
function drawFlower(ctx, flower, h, now) {
  const grow = clamp((simClock - flower.birth) / 0.9, 0, 1);
  const sway = Math.sin(simClock * 0.8 + flower.sway) * 0.035 * settings.motion / 100;
  const stemBottom = Math.min(h * 0.88, flower.y + h * 0.18);
  const stemHeight = (stemBottom - flower.y) * grow;
  ctx.save();
  ctx.translate(flower.x, stemBottom);
  ctx.rotate(sway);
  const stemGradient = ctx.createLinearGradient(-3, 0, 4, 0);
  stemGradient.addColorStop(0, "#22553e");
  stemGradient.addColorStop(0.52, "#94bd72");
  stemGradient.addColorStop(1, "#3e7750");
  ctx.strokeStyle = stemGradient;
  ctx.lineWidth = Math.max(2, flower.size * 0.16);
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-flower.size * 0.18, -stemHeight * 0.45, 0, -stemHeight);
  ctx.stroke();
  ctx.fillStyle = "#83b96e";
  for (let side = -1; side <= 1; side += 2) {
    ctx.save();
    ctx.translate(side * 1.5, -stemHeight * (side === -1 ? 0.45 : 0.64));
    ctx.rotate(side * 0.45);
    ctx.beginPath();
    ctx.ellipse(side * flower.size * 0.42, 0, flower.size * 0.42, flower.size * 0.14, side * 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  if (grow < 1) return;
  const bloomAge = simClock - flower.birth - 0.9;
  const bloomScale = 0.72 + Math.min(0.28, bloomAge * 0.6);
  ctx.save();
  ctx.translate(flower.x, flower.y);
  ctx.rotate(sway * 1.8);
  ctx.scale(bloomScale, bloomScale);
  const petals = flower.petals;
  const petalGradient = ctx.createRadialGradient(-flower.size * 0.14, -flower.size * 0.22, 1, 0, 0, flower.size * 0.85);
  petalGradient.addColorStop(0, "hsla(" + flower.hue + ", 98%, 91%, .98)");
  petalGradient.addColorStop(0.48, "hsla(" + (flower.hue + 13) + ", 86%, 72%, .94)");
  petalGradient.addColorStop(1, "hsla(" + (flower.hue - 11) + ", 76%, 55%, .94)");
  ctx.shadowColor = "hsla(" + flower.hue + ", 95%, 73%, .44)";
  ctx.shadowBlur = flower.size * 0.52;
  for (let i = 0; i < petals; i += 1) {
    const angle = i / petals * Math.PI * 2 + bloomAge * 0.014;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -flower.size * 0.5, flower.size * 0.27, flower.size * 0.55, 0, 0, Math.PI * 2);
    ctx.fillStyle = petalGradient;
    ctx.fill();
    ctx.strokeStyle = "rgba(255,247,220,.48)";
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.restore();
  }
  ctx.shadowBlur = 0;
  const center = ctx.createRadialGradient(-flower.size * 0.1, -flower.size * 0.1, 1, 0, 0, flower.size * 0.25);
  center.addColorStop(0, "#fff2b4");
  center.addColorStop(0.62, "#e3ad56");
  center.addColorStop(1, "#aa6949");
  ctx.beginPath();
  ctx.arc(0, 0, flower.size * 0.24, 0, Math.PI * 2);
  ctx.fillStyle = center;
  ctx.fill();
  ctx.restore();
}
function drawButterfly(ctx, butterfly, dt, surface) {
  const speed = motionRate();
  const seconds = Math.min(dt, 50) / 1000;
  butterfly.life -= seconds * speed * 0.24;
  butterfly.wing += seconds * (6 + settings.motion / 12);
  butterfly.x += (butterfly.vx + Math.sin(surface.time * 0.7 + butterfly.wing) * settings.unpredictable * 0.16) * seconds * speed;
  butterfly.y += butterfly.vy * seconds * speed;
  const flap = Math.max(0.08, Math.abs(Math.sin(butterfly.wing)));
  const hue = butterfly.hue;
  ctx.save();
  ctx.translate(butterfly.x, butterfly.y);
  ctx.rotate(Math.sin(butterfly.wing * 0.5) * 0.13);
  ctx.globalAlpha = clamp(butterfly.life / 0.7, 0, 1);
  ctx.shadowColor = "hsla(" + hue + ", 90%, 80%, .68)";
  ctx.shadowBlur = butterfly.size * 0.7;
  for (let side = -1; side <= 1; side += 2) {
    ctx.save();
    ctx.scale(side * flap, 1);
    const wing = ctx.createRadialGradient(0, -butterfly.size * 0.2, 1, 0, 0, butterfly.size * 1.2);
    wing.addColorStop(0, "hsla(" + hue + ", 100%, 91%, .96)");
    wing.addColorStop(0.5, "hsla(" + (hue + 26) + ", 86%, 70%, .9)");
    wing.addColorStop(1, "hsla(" + (hue + 54) + ", 78%, 56%, .78)");
    ctx.beginPath();
    ctx.ellipse(side * butterfly.size * 0.57, -butterfly.size * 0.23, butterfly.size * 0.66, butterfly.size * 0.43, side * 0.43, 0, Math.PI * 2);
    ctx.fillStyle = wing;
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(side * butterfly.size * 0.47, butterfly.size * 0.23, butterfly.size * 0.42, butterfly.size * 0.3, side * -0.44, 0, Math.PI * 2);
    ctx.fillStyle = "hsla(" + (hue + 64) + ", 82%, 77%, .78)";
    ctx.fill();
    ctx.restore();
  }
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.ellipse(0, 0, butterfly.size * 0.08, butterfly.size * 0.68, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#293c43";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,249,218,.8)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -butterfly.size * 0.5);
  ctx.quadraticCurveTo(-butterfly.size * 0.3, -butterfly.size * 0.96, -butterfly.size * 0.54, -butterfly.size * 0.76);
  ctx.moveTo(0, -butterfly.size * 0.5);
  ctx.quadraticCurveTo(butterfly.size * 0.3, -butterfly.size * 0.96, butterfly.size * 0.54, -butterfly.size * 0.76);
  ctx.stroke();
  ctx.restore();
}
function drawGarden(surface, now, dt) {
  const ctx = surface.ctx, w = surface.width, h = surface.height;
  drawGardenBackground(surface);
  const ground = h * 0.72;
  surface.flowers.forEach((flower) => drawFlower(ctx, flower, h, now));
  surface.butterflies = surface.butterflies.filter((butterfly) => butterfly.life > 0 && butterfly.y > -25 && butterfly.x > -40 && butterfly.x < w + 40);
  surface.butterflies.forEach((butterfly) => drawButterfly(ctx, butterfly, dt, surface));
  surface.bursts = surface.bursts.filter((burst) => burst.age < burst.life);
  surface.bursts.forEach((burst) => {
    burst.age += Math.min(dt, 50) / 1000 * motionRate();
    const p = clamp(burst.age / burst.life, 0, 1);
    ctx.beginPath();
    ctx.arc(burst.x, burst.y, burst.radius + p * 22, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(burst.colour.rgb, (1 - p) * 0.76);
    ctx.lineWidth = (1 - p) * 3 + 0.4;
    ctx.stroke();
  });
  for (let i = 0; i < 50; i += 1) {
    const x = (i * 83 + simClock * (i % 2 ? 2 : -1)) % w;
    const y = ground + (i * 29) % Math.max(1, h - ground);
    ctx.beginPath();
    ctx.fillStyle = "rgba(239,231,170," + (0.08 + (i % 4) * 0.035) + ")";
    ctx.ellipse((x + w) % w, y, 1.2 + i % 3 * 0.45, 2.8 + i % 3, Math.sin(simClock + i) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
function drawLiquidPreview(surface, now, dt) {
  const ctx = surface.ctx, w = surface.width, h = surface.height;
  drawBackground(ctx, w, h, "#183943", "#335e64", "#172e39");
  const colours = [[93, 206, 193], [215, 154, 107], [148, 146, 219], [224, 113, 145]];
  const rate = motionRate();
  const t = surface.time;
  ctx.globalCompositeOperation = "screen";
  colours.forEach((colour, index) => {
    const phase = t * (0.24 + index * 0.11) + index * 1.8;
    let x = w * (0.5 + Math.cos(phase) * 0.24);
    let y = h * (0.52 + Math.sin(phase * 0.73) * 0.27);
    if (now < surface.pointer.until) {
      const pull = settings.intensity / 100 * 0.35;
      x += (surface.pointer.x * w - x) * pull;
      y += (surface.pointer.y * h - y) * pull;
    }
    const radius = Math.min(w, h) * (0.35 + Math.sin(phase * 0.47) * 0.06);
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, rgba(colour, 0.8));
    g.addColorStop(0.5, rgba(colour, 0.42));
    g.addColorStop(1, rgba(colour, 0));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalCompositeOperation = "source-over";
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(237,242,223,.28)";
    ctx.ellipse(w / 2, h / 2, w * (0.1 + i * 0.09), h * (0.14 + i * 0.13), Math.sin(t * 0.1) * 0.25, 0, Math.PI * 2);
    ctx.stroke();
  }
}
function ensureAudio() {
  if (audioContext) {
    if (audioContext.state === "suspended") audioContext.resume();
    return audioContext;
  }
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return null;
  try {
    audioContext = new Audio();
    return audioContext;
  } catch {
    return null;
  }
}
function playNote(index, kind) {
  const audio = ensureAudio();
  if (!audio || !soundEnabled || settings.sound === 0) return;
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  const frequency = noteFrequencies[clamp(index, 0, noteFrequencies.length - 1)];
  oscillator.type = toneStyle === "wood" ? "triangle" : toneStyle === "warm" ? "sine" : "sine";
  oscillator.frequency.setValueAtTime(kind === "pop" ? frequency * 1.25 : frequency, audio.currentTime);
  if (kind === "pop") oscillator.frequency.exponentialRampToValueAtTime(Math.max(150, frequency * 0.7), audio.currentTime + 0.12);
  const density = settings.sound / 100;
  const peak = 0.012 + density * 0.055;
  const length = kind === "chime" ? 0.3 + settings.repeat / 100 * 0.28 : kind === "pop" ? 0.1 : 0.22 + settings.repeat / 100 * 0.26;
  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(peak, audio.currentTime + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + length);
  oscillator.connect(gain);
  gain.connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + length + 0.04);
  if (toneStyle === "bell" && kind !== "pop") {
    const overtone = audio.createOscillator();
    const overtoneGain = audio.createGain();
    overtone.type = "sine";
    overtone.frequency.value = frequency * 2.01;
    overtoneGain.gain.setValueAtTime(0.0001, audio.currentTime);
    overtoneGain.gain.exponentialRampToValueAtTime(peak * 0.22, audio.currentTime + 0.015);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + length * 0.72);
    overtone.connect(overtoneGain);
    overtoneGain.connect(audio.destination);
    overtone.start();
    overtone.stop(audio.currentTime + length * 0.8);
  }
}
function toggleSound() {
  soundEnabled = !soundEnabled;
  if (soundEnabled) ensureAudio();
  updateSoundButtons();
  updateStatus(soundEnabled ? "Sound is on. Tap any part of the game to hear a soft tone." : "Sound is off. Visual play still works.");
}
function lightKey(index) {
  const key = $('[data-note="' + index + '"]');
  if (!key) return;
  key.classList.add("is-lit");
  window.setTimeout(() => key.classList.remove("is-lit"), 520);
  if (soundEnabled) playNote(index, "note");
}
function resetGame() {
  if (!activeSurface) {
    followMode = false;
    const follow = $('[data-action="follow"]');
    if (follow) {
      follow.setAttribute("aria-pressed", "false");
      follow.textContent = "Start follow-the-glow";
    }
    document.querySelectorAll(".ndp-music-key").forEach((key) => key.classList.remove("is-lit"));
    updateStatus("The board is clear. Play any note, or start the glow loop.");
    return;
  }
  if (activeGame === "bubbles") {
    seedBubbles(activeSurface);
    activeSurface.bursts = [];
    activeSurface.particles = [];
    updateStatus("Fresh bubbles, rising again.");
  } else if (activeGame === "garden") {
    activeSurface.flowers = [];
    activeSurface.butterflies = [];
    activeSurface.bursts = [];
    updateStatus("A fresh patch of garden. Touch the ground or sky.");
  }
}
function onStageClick(event) {
  const button = event.target.closest("button");
  if (!button) return;
  if (button.hasAttribute("data-note") && activeGame === "music") {
    const index = Number(button.dataset.note);
    button.classList.add("is-lit");
    window.setTimeout(() => button.classList.remove("is-lit"), 420);
    if (soundEnabled) {
      playNote(index, "note");
      updateStatus("Note " + noteNames[index] + ". Play another, or start the glow loop.");
    } else {
      updateStatus("The bar lit up. Turn sound on if you want to hear its note.");
    }
    return;
  }
  if (button.hasAttribute("data-pace")) {
    bubblePace = Number(button.dataset.pace);
    updatePaceButtons();
    updateStatus("Bubble pace: " + button.textContent + ". Change it whenever you like.");
    return;
  }
  if (button.hasAttribute("data-phase")) {
    gardenPhase = button.dataset.phase;
    if (activeSurface) activeSurface.phase = gardenPhase;
    updatePhaseButtons();
    updateStatus("The garden light changed to " + button.textContent.toLowerCase() + ".");
    return;
  }
  if (button.hasAttribute("data-tone")) {
    toneStyle = button.dataset.tone;
    document.querySelectorAll("[data-tone]").forEach((item) => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    updateStatus(button.textContent + " selected.");
    return;
  }
  const action = button.dataset.action;
  if (action === "sound") {
    toggleSound();
  } else if (action === "pause") {
    paused = !paused;
    document.querySelectorAll('[data-action="pause"]').forEach((item) => {
      item.textContent = paused ? "Resume" : "Pause";
      item.setAttribute("aria-pressed", String(paused));
    });
    updateStatus(paused ? "Movement paused. Your buttons still work." : "Movement resumed.");
  } else if (action === "reset") {
    resetGame();
  } else if (action === "follow") {
    followMode = !followMode;
    followClock = 0;
    followIndex = 0;
    button.setAttribute("aria-pressed", String(followMode));
    button.textContent = followMode ? "Stop follow-the-glow" : "Start follow-the-glow";
    updateStatus(followMode ? "Follow the glow is on. Tap along if you like; there is no score." : "Glow loop stopped. Play any notes you like.");
  }
}
stage.addEventListener("click", onStageClick);
document.querySelectorAll(".ndp-game-choice").forEach((button) => {
  button.addEventListener("click", () => renderGame(button.dataset.game));
});

function getRecipes() {
  try {
    const recipes = JSON.parse(localStorage.getItem(recipeKey) || "[]");
    return Array.isArray(recipes) ? recipes.filter((item) => item && typeof item.name === "string" && item.values) : [];
  } catch {
    return [];
  }
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
  return Object.fromEntries(Object.keys(input).map((key) => [key, Number(input[key].value)]));
}
function applySettings(values) {
  Object.keys(input).forEach((key) => {
    if (Number.isFinite(Number(values[key]))) input[key].value = String(clamp(Number(values[key]), 0, 100));
  });
  syncMixer();
}
function renderRecipes() {
  const container = $("#saved-recipes");
  const recipes = getRecipes();
  container.innerHTML = recipes.length ? recipes.map((recipe, index) =>
    '<div class="ndp-recipe-row"><button type="button" class="ndp-recipe-load" data-load-recipe="' + index + '">' + escapeHTML(recipe.name) + '</button><button type="button" class="ndp-recipe-delete" data-delete-recipe="' + index + '" aria-label="Delete ' + escapeHTML(recipe.name) + '">×</button></div>'
  ).join("") : '<p class="ndp-small-note">Your saved recipes will appear here.</p>';
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
  const duplicate = recipes.findIndex((recipe) => recipe.name.toLowerCase() === name.toLowerCase());
  const item = { name, values: captureSettings() };
  if (duplicate >= 0) recipes.splice(duplicate, 1, item);
  else recipes.unshift(item);
  if (recipes.length > 12) recipes.length = 12;
  status.textContent = writeRecipes(recipes) ? "“" + name + "” saved on this device." : "This browser could not save the recipe.";
  renderRecipes();
});
$("#saved-recipes").addEventListener("click", (event) => {
  const load = event.target.closest("[data-load-recipe]");
  const remove = event.target.closest("[data-delete-recipe]");
  const recipes = getRecipes();
  if (load) {
    const item = recipes[Number(load.dataset.loadRecipe)];
    if (item) {
      applySettings(item.values);
      $("#recipe-status").textContent = "Loaded “" + item.name + "”.";
    }
  }
  if (remove) {
    const index = Number(remove.dataset.deleteRecipe);
    const name = recipes[index] && recipes[index].name;
    recipes.splice(index, 1);
    if (writeRecipes(recipes)) {
      renderRecipes();
      $("#recipe-status").textContent = name ? "Deleted “" + name + "”." : "Recipe deleted.";
    }
  }
});
function createMixer() {
  const canvas = $("#mixer-canvas");
  mixerSurface = makeSurface(canvas, "preview");
  $("#mixer-nudge").addEventListener("click", () => {
    mixerSurface.pointer.x = mixerSurface.width * (0.24 + Math.random() * 0.55);
    mixerSurface.pointer.y = mixerSurface.height * (0.24 + Math.random() * 0.55);
    mixerSurface.pointer.until = performance.now() + 1200 + settings.intensity * 7;
    $("#preview-caption").textContent = "A nudge through the mix";
  });
}
function frame(now) {
  const dt = lastFrame ? Math.min(now - lastFrame, 50) : 16;
  lastFrame = now;
  if (!paused) {
    const seconds = dt / 1000 * motionRate();
    simClock += seconds;
    if (activeSurface && resizeSurface(activeSurface)) {
      activeSurface.time += seconds;
      if (activeGame === "bubbles") drawBubbles(activeSurface, now, dt);
      if (activeGame === "garden") drawGarden(activeSurface, now, dt);
    }
    if (activeGame === "music" && followMode) {
      followClock += dt / 1000;
      const interval = 1.45 - settings.motion / 100 * 0.82;
      if (followClock >= interval) {
        followClock = 0;
        const index = followNotes[followIndex % followNotes.length];
        followIndex += 1;
        lightKey(index);
      }
    }
    if (mixerSurface && resizeSurface(mixerSurface)) {
      mixerSurface.time += seconds * 0.74;
      drawLiquidPreview(mixerSurface, now, dt);
    }
  }
  requestAnimationFrame(frame);
}
renderRecipes();
createMixer();
renderGame("bubbles");
requestAnimationFrame(frame);
