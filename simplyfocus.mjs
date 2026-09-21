const tracks = [
  ["rain", "Rain", "A steady, soft rainfall"],
  ["fire", "Fire", "A low, gently crackling warmth"],
  ["wind", "Wind", "Slow air moving through open space"],
  ["ocean", "Ocean waves", "Long, even waves rolling in"],
  ["bowl", "Singing bowl", "A sparse, synthesized resonant tone"],
  ["white", "White noise", "A smooth, steady noise bed"],
  ["trees", "Rain on trees", "Rain softened through a leafy canopy"],
  ["lofi", "Original lo-fi", "A small instrumental loop generated in your browser"],
];
const presets = {
  "Rain on the window": { rain: 32, trees: 12, white: 0, fire: 0, wind: 0, ocean: 0, bowl: 0, lofi: 0 },
  "Quiet fireside": { fire: 27, bowl: 8, rain: 0, trees: 0, white: 0, wind: 0, ocean: 0, lofi: 0 },
  "Open coast": { ocean: 32, wind: 11, rain: 0, trees: 0, white: 0, fire: 0, bowl: 0, lofi: 0 },
  "Soft focus": { rain: 14, white: 9, lofi: 13, fire: 0, wind: 0, ocean: 0, bowl: 0, trees: 0 },
  "Silence": { rain: 0, fire: 0, wind: 0, ocean: 0, bowl: 0, white: 0, trees: 0, lofi: 0 },
};
const recipeKey = "ns-simplyfocus-recipe-v1";
const $ = (selector, root = document) => root.querySelector(selector);
const el = (tag, className = "", text = "") => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

export function renderSimplyFocus(root) {
  root.innerHTML =
    '<div class="wrap simplyfocus-page"><section class="page-intro focus-intro"><p class="eyebrow">A sound space · SimplyFocus</p><h1>Make a little room for focus.</h1><p class="lead">Blend soft ambient sounds to suit this moment. Start with one layer, add another if you like, and stop whenever you want.</p></section><section class="focus-mixer"><div class="focus-mixer-head"><div><p class="eyebrow">Your soundscape</p><h2>Turn each sound up or down.</h2></div><label class="focus-master">Master volume <output id="focus-master-output">35%</output><input id="focus-master" type="range" min="0" max="100" value="35" aria-label="Master volume"></label></div><div id="focus-tracks" class="focus-tracks"></div><div class="focus-presets"><span class="eyebrow">Start with a mix</span><div id="focus-preset-buttons" class="choice-cloud"></div></div><div class="focus-actions"><button class="button" id="focus-play" type="button">Start soundscape</button><button class="button subtle-button" id="focus-stop" type="button">Stop all</button><button class="button subtle-button" id="focus-save" type="button">Save my mix on this device</button><button class="button subtle-button" id="focus-load" type="button" hidden>Load saved mix</button></div><p id="focus-status" class="interactive-status" aria-live="polite">Nothing plays until you press Start. Audio is generated in your browser and is not uploaded.</p></section><section class="focus-note"><h2>A quiet note on sound</h2><p>There is no ideal focus mix. Some days call for silence; some days call for a little movement or repetition. Keep the volume comfortable, and leave out any sound that feels like too much.</p><a href="#tools">Explore other interactive activities →</a></section></div>';
  const values = {};
  const outputs = {};
  const trackHost = $("#focus-tracks", root);
  tracks.forEach(([id, name, detail]) => {
    const row = el("label", "focus-track");
    row.dataset.track = id;
    const badge = el("span", "focus-track-icon", iconFor(id));
    badge.setAttribute("aria-hidden", "true");
    const text = el("span", "focus-track-copy");
    text.append(el("b", "", name), el("small", "", detail));
    const input = document.createElement("input");
    input.type = "range";
    input.min = "0";
    input.max = "100";
    input.value = id === "rain" ? "24" : id === "trees" ? "12" : "0";
    input.setAttribute("aria-label", name + " volume");
    const output = el("output", "focus-track-value", input.value + "%");
    values[id] = Number(input.value);
    outputs[id] = output;
    input.addEventListener("input", () => {
      values[id] = Number(input.value);
      output.textContent = input.value + "%";
      setTrackLevel(id, values[id]);
      if (playing && id === "lofi" && values.lofi && !loopTimer) startSequencer();
      if (playing && id === "lofi" && !values.lofi && loopTimer) {
        clearInterval(loopTimer);
        loopTimer = null;
      }
      if (playing && id === "bowl" && values.bowl && !bowlTimer) createBowlTimer();
      if (playing && id === "bowl" && !values.bowl && bowlTimer) {
        clearInterval(bowlTimer);
        bowlTimer = null;
      }
    });
    row.append(badge, text, input, output);
    trackHost.append(row);
  });
  const presetHost = $("#focus-preset-buttons", root);
  Object.entries(presets).forEach(([name, recipe]) => {
    const preset = el("button", "chip", name);
    preset.type = "button";
    preset.addEventListener("click", () => applyRecipe(recipe));
    presetHost.append(preset);
  });
  const masterSlider = $("#focus-master", root);
  const masterOutput = $("#focus-master-output", root);
  masterSlider.addEventListener("input", () => {
    masterOutput.textContent = masterSlider.value + "%";
    if (masterGain && context) masterGain.gain.setTargetAtTime(Number(masterSlider.value) / 100 * 0.68, context.currentTime, 0.06);
  });
  const savedRecipe = readSaved();
  if (savedRecipe) $("#focus-load", root).hidden = false;
  $("#focus-save", root).addEventListener("click", () => {
    localStorage.setItem(recipeKey, JSON.stringify({ values, master: Number(masterSlider.value) }));
    setStatus("Your mix has been saved on this device.");
    $("#focus-load", root).hidden = false;
  });
  $("#focus-load", root).addEventListener("click", () => {
    const recipe = readSaved();
    if (recipe) applyRecipe(recipe.values, recipe.master);
  });
  $("#focus-play", root).addEventListener("click", togglePlayback);
  $("#focus-stop", root).addEventListener("click", stopPlayback);

  let context = null;
  let masterGain = null;
  let bowlMix = null;
  let channelGains = {};
  let oscillatorNodes = [];
  let noiseBuffer = null;
  let loopTimer = null;
  let bowlTimer = null;
  let nextNoteTime = 0;
  let noteIndex = 0;
  let playing = false;

  function setStatus(message) {
    const status = $("#focus-status", root);
    if (status) status.textContent = message;
  }
  function readSaved() {
    try {
      return JSON.parse(localStorage.getItem(recipeKey) || "null");
    } catch {
      return null;
    }
  }
  function applyRecipe(recipe, master = Number(masterSlider.value)) {
    tracks.forEach(([id]) => {
      const value = Number(recipe?.[id]) || 0;
      values[id] = value;
      const input = trackHost.querySelector('[data-track="' + id + '"] input');
      input.value = String(value);
      outputs[id].textContent = value + "%";
      setTrackLevel(id, value);
    });
    masterSlider.value = String(master);
    masterOutput.textContent = master + "%";
    if (masterGain && context) masterGain.gain.setTargetAtTime(Number(master) / 100 * 0.68, context.currentTime, 0.06);
    syncOptionalLoops();
    setStatus("Mix updated. Press Start to listen, or adjust any layer.");
  }
  function syncOptionalLoops() {
    if (!playing) return;
    if (values.lofi && !loopTimer) startSequencer();
    if (!values.lofi && loopTimer) {
      clearInterval(loopTimer);
      loopTimer = null;
    }
    if (values.bowl && !bowlTimer) createBowlTimer();
    if (!values.bowl && bowlTimer) {
      clearInterval(bowlTimer);
      bowlTimer = null;
    }
  }
  function audioContext() {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) {
      setStatus("This browser does not support Web Audio. Try a current version of Safari, Chrome or Firefox.");
      return null;
    }
    return new Audio();
  }
  function ensureAudio() {
    if (context) return context;
    context = audioContext();
    if (!context) return null;
    masterGain = context.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(context.destination);
    noiseBuffer = makeNoiseBuffer(context);
    tracks.forEach(([id]) => {
      const gain = context.createGain();
      gain.gain.value = 0;
      gain.connect(masterGain);
      channelGains[id] = gain;
    });
    createNoiseTrack("rain", "bandpass", 1100, 700, 0.25);
    createNoiseTrack("fire", "bandpass", 720, 1250, 0.20, 0.8, 0.22);
    createNoiseTrack("wind", "lowpass", 310, 0, 0.23, 0.08, 0.4);
    createNoiseTrack("ocean", "lowpass", 480, 0, 0.22, 0.13, 0.34);
    createNoiseTrack("white", "lowpass", 8200, 0, 0.14);
    createNoiseTrack("trees", "bandpass", 1800, 420, 0.20, 0.11, 0.26);
    createBowlTrack();
    applyCurrentLevels();
    return context;
  }
  function makeNoiseBuffer(ctx) {
    const length = Math.floor(ctx.sampleRate * 3);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const channel = buffer.getChannelData(0);
    let shade = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      shade = 0.985 * shade + 0.015 * white;
      channel[i] = white * 0.74 + shade * 0.26;
    }
    return buffer;
  }
  function createNoiseTrack(id, filterType, frequency, secondFrequency, level, lfoFrequency = 0, depth = 0) {
    const source = context.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    let last = source;
    if (secondFrequency) {
      const high = context.createBiquadFilter();
      high.type = "highpass";
      high.frequency.value = secondFrequency;
      last.connect(high);
      last = high;
    }
    const filter = context.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    filter.Q.value = filterType === "bandpass" ? 0.6 : 0.25;
    last.connect(filter);
    filter.connect(channelGains[id]);
    source.start();
    oscillatorNodes.push(source);
    if (lfoFrequency) {
      const lfo = context.createOscillator();
      const modulation = context.createGain();
      const contour = context.createGain();
      contour.gain.value = 0.68;
      filter.disconnect();
      filter.connect(contour);
      contour.connect(channelGains[id]);
      lfo.frequency.value = lfoFrequency;
      modulation.gain.value = depth;
      lfo.connect(modulation);
      modulation.connect(contour.gain);
      lfo.start();
      oscillatorNodes.push(lfo);
    }
    channelGains[id].gain.value = level * (values[id] / 100);
  }
  function createBowlTrack() {
    const fundamental = context.createOscillator();
    const overtone = context.createOscillator();
    const subTone = context.createOscillator();
    const mix = context.createGain();
    const lowpass = context.createBiquadFilter();
    fundamental.type = "sine"; fundamental.frequency.value = 220;
    overtone.type = "sine"; overtone.frequency.value = 440.7;
    subTone.type = "sine"; subTone.frequency.value = 661;
    lowpass.type = "lowpass"; lowpass.frequency.value = 1800;
    const partialA = context.createGain(); partialA.gain.value = 0.55;
    const partialB = context.createGain(); partialB.gain.value = 0.19;
    const partialC = context.createGain(); partialC.gain.value = 0.08;
    fundamental.connect(partialA); overtone.connect(partialB); subTone.connect(partialC);
    partialA.connect(mix); partialB.connect(mix); partialC.connect(mix);
    mix.connect(lowpass); lowpass.connect(channelGains.bowl);
    mix.gain.value = 0.0001;
    bowlMix = mix;
    fundamental.start(); overtone.start(); subTone.start();
    oscillatorNodes.push(fundamental, overtone, subTone);
  }
  function setTrackLevel(id, value) {
    if (!context || !channelGains[id]) return;
    const amount = id === "white" ? 0.12 : id === "bowl" ? 0.12 : id === "lofi" ? 0.28 : 0.22;
    channelGains[id].gain.setTargetAtTime((Number(value) / 100) * amount, context.currentTime, 0.09);
  }
  function applyCurrentLevels() {
    Object.entries(values).forEach(([id, value]) => setTrackLevel(id, value));
    if (masterGain) masterGain.gain.setTargetAtTime(Number(masterSlider.value) / 100 * 0.68, context.currentTime, 0.08);
  }
  function playTone(frequency, time, length, amplitude = 0.06, type = "triangle") {
    const osc = context.createOscillator();
    const envelope = context.createGain();
    const toneFilter = context.createBiquadFilter();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, time);
    toneFilter.type = "lowpass";
    toneFilter.frequency.setValueAtTime(1600, time);
    envelope.gain.setValueAtTime(0.0001, time);
    envelope.gain.exponentialRampToValueAtTime(amplitude, time + 0.018);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + length);
    osc.connect(toneFilter);
    toneFilter.connect(envelope);
    envelope.connect(channelGains.lofi);
    osc.start(time);
    osc.stop(time + length + 0.03);
  }
  function scheduleLofiNote(time, step) {
    const melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    if (step % 2 === 0) playTone(melody[(step / 2) % melody.length], time, 0.62, 0.055, "triangle");
    if (step % 8 === 0) playTone(82.41, time, 0.19, 0.055, "sine");
    if (step % 4 === 2) playTone(659.25, time, 0.06, 0.012, "sine");
  }
  function startSequencer() {
    nextNoteTime = context.currentTime + 0.08;
    noteIndex = 0;
    loopTimer = setInterval(() => {
      if (!context || context.state !== "running" || !values.lofi) return;
      const stepDuration = 60 / 72 / 2;
      while (nextNoteTime < context.currentTime + 0.16) {
        scheduleLofiNote(nextNoteTime, noteIndex);
        nextNoteTime += stepDuration;
        noteIndex = (noteIndex + 1) % 16;
      }
    }, 60);
  }
  async function togglePlayback() {
    if (playing) {
      playing = false;
      $("#focus-play", root).textContent = "Resume soundscape";
      if (masterGain && context) masterGain.gain.setTargetAtTime(0, context.currentTime, 0.08);
      clearInterval(loopTimer);
      clearInterval(bowlTimer);
      setStatus("Paused. Your mix is still here; press Resume when ready.");
      if (context) setTimeout(() => context && context.state === "running" && context.suspend(), 180);
      return;
    }
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      await ctx.resume();
    } catch {
      setStatus("Audio could not start. Check your browser's sound settings and try again.");
      return;
    }
    playing = true;
    applyCurrentLevels();
    $("#focus-play", root).textContent = "Pause soundscape";
    if (values.lofi) startSequencer();
    if (values.bowl) createBowlTimer();
    setStatus("Playing your mix. Use the sliders to change layers, or pause at any time.");
  }
  function createBowlTimer() {
    if (bowlTimer) clearInterval(bowlTimer);
    const strike = () => {
      if (!context || context.state !== "running" || !values.bowl || !bowlMix) return;
      const now = context.currentTime;
      bowlMix.gain.cancelScheduledValues(now);
      bowlMix.gain.setValueAtTime(0.0001, now);
      bowlMix.gain.linearRampToValueAtTime(0.75, now + 0.08);
      bowlMix.gain.exponentialRampToValueAtTime(0.0001, now + 4.8);
    };
    strike();
    bowlTimer = setInterval(strike, 6500);
  }
  async function stopPlayback() {
    playing = false;
    clearInterval(loopTimer);
    clearInterval(bowlTimer);
    if (context) {
      try { await context.close(); } catch {}
    }
    context = null;
    masterGain = null;
    channelGains = {};
    oscillatorNodes = [];
    noiseBuffer = null;
    bowlMix = null;
    $("#focus-play", root).textContent = "Start soundscape";
    setStatus("All sounds stopped. Your slider settings are still here.");
  }
  window.addEventListener("hashchange", stopPlayback, { once: true });
}

function iconFor(id) {
  return ({ rain: "☂", fire: "♨", wind: "↝", ocean: "≈", bowl: "◉", white: "∿", trees: "❋", lofi: "♫" })[id] || "♪";
}
