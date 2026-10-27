const tracks = [
  ["rain", "Rain", "Soft, close rainfall", "simplyfocus-rain.mp3"],
  ["fire", "Fire", "Warm crackles and low embers", "simplyfocus-fire.mp3"],
  ["wind", "Wind", "Slow air moving through open space", "simplyfocus-wind.mp3"],
  ["ocean", "Ocean waves", "Long waves with a gentle surf", "simplyfocus-ocean.mp3"],
  ["bowl", "Singing bowl", "A spacious, resonant bowl tone", "simplyfocus-bowl.mp3"],
  ["pink", "Soft noise", "A smoother masking layer than white noise", "simplyfocus-pink.mp3"],
  ["trees", "Rain on trees", "Rain softened by leaves and branches", "simplyfocus-trees.mp3"],
  ["lofi", "Original lo-fi", "Nobody’s Simple lo-fi radio", "simplyfocus-lofi.mp3"],
  ["focus", "Original focus", "Nobody’s Simple focus radio", "simplyfocus-focus.mp3"],
];
const presets = {
  "Rain on the window": { rain: 34, trees: 15, pink: 4, fire: 0, wind: 0, ocean: 0, bowl: 0, lofi: 0, focus: 0 },
  "Quiet fireside": { fire: 31, bowl: 8, rain: 0, trees: 0, pink: 0, wind: 0, ocean: 0, lofi: 0, focus: 0 },
  "Open coast": { ocean: 34, wind: 13, rain: 0, trees: 0, pink: 0, fire: 0, bowl: 0, lofi: 0, focus: 0 },
  "Soft focus": { rain: 12, pink: 10, lofi: 15, focus: 0, fire: 0, wind: 0, ocean: 0, bowl: 0, trees: 0 },
  "Deep focus": { focus: 18, rain: 8, pink: 7, lofi: 0, fire: 0, wind: 0, ocean: 0, bowl: 0, trees: 0 },
  "Silence": { rain: 0, fire: 0, wind: 0, ocean: 0, bowl: 0, pink: 0, trees: 0, lofi: 0, focus: 0 },
};
const recipeKey = "ns-simplyfocus-recipe-v2";
const $ = (selector, root = document) => root.querySelector(selector);
const el = (tag, className = "", text = "") => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};
const formatTime = (seconds) => `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, "0")}:${String(Math.max(0, seconds) % 60).padStart(2, "0")}`;
const soundAllowed = () => !window.nsAccountPreferences?.lowStim && window.nsAccountPreferences?.sound !== false;

export function renderSimplyFocus(root) {
  root.innerHTML = `<div class="wrap simplyfocus-page">
    <section class="page-intro focus-intro"><p class="eyebrow">A sound space · SimplyFocus</p><h1>Make a little room for focus.</h1><p class="lead">Blend carefully made ambient loops with the original Nobody’s Simple radio tracks. Start with one layer, add another if you like, and stop whenever you want.</p></section>
    <section class="focus-mixer" aria-labelledby="focus-mixer-title"><div class="focus-mixer-head"><div><p class="eyebrow">Your soundscape</p><h2 id="focus-mixer-title">Turn each sound up or down.</h2></div><label class="focus-master">Master volume <output id="focus-master-output">35%</output><input id="focus-master" type="range" min="0" max="100" value="35" aria-label="Master volume"></label></div><div id="focus-tracks" class="focus-tracks"></div><div class="focus-presets"><span class="eyebrow">Start with a mix</span><div id="focus-preset-buttons" class="choice-cloud"></div></div><div class="focus-actions"><button class="button" id="focus-play" type="button">Start soundscape</button><button class="button subtle-button" id="focus-stop" type="button">Stop all</button><button class="button subtle-button" id="focus-save" type="button">Save my mix on this device</button><button class="button subtle-button" id="focus-load" type="button" hidden>Load saved mix</button></div><p id="focus-status" class="interactive-status" aria-live="polite">Nothing plays until you press Start. Your mix stays on this device if you choose Save.</p></section>
    <section class="timed-breathing-card" aria-labelledby="timed-breathing-title"><div class="timed-breathing-head"><div><p class="eyebrow">Breathe alongside the sound</p><h2 id="timed-breathing-title">Timed breathing</h2><p>Let the soundscape keep playing while a gentle shape gives you a simple rhythm to follow. There are no breath holds and no required pattern.</p></div><div class="breathing-duration" role="group" aria-label="Breathing session length"><button type="button" data-breath-minutes="2" aria-pressed="false">2 min</button><button type="button" data-breath-minutes="5" aria-pressed="true">5 min</button><button type="button" data-breath-minutes="10" aria-pressed="false">10 min</button></div></div><div class="timed-breathing-main"><div class="breathing-visual"><div class="breath-orb" id="focus-breath-orb" aria-live="polite">Ready when you are</div><p id="focus-breath-phase" class="breath-phase">Choose a pace and begin when it feels useful.</p></div><div class="breathing-controls"><div class="breathing-countdown"><span>Time left</span><strong id="focus-breath-countdown">05:00</strong></div><label class="breathing-pace">Pace <output id="focus-breath-pace-output">7 seconds</output><input id="focus-breath-pace" type="range" min="4" max="12" value="7" aria-label="Breathing cycle length in seconds"></label><div class="breathing-actions"><button class="button" id="focus-breath-start" type="button">Start breathing</button><button class="button subtle-button" id="focus-breath-reset" type="button">Reset</button></div></div></div><p id="focus-breath-status" class="interactive-status" aria-live="polite">You can pause at any time. Breathe naturally and stop if this feels uncomfortable.</p></section>
    <section class="pomodoro-card phase-work" aria-labelledby="pomodoro-title"><div class="pomodoro-head"><div><p class="eyebrow">Focus gently</p><h2 id="pomodoro-title">Pomodoro focus board</h2><p>Choose a focus period, then keep the work in small, visible pieces.</p></div><div class="pomodoro-modes" role="group" aria-label="Timer mode"><button type="button" data-pomodoro-mode="work" aria-pressed="true">Work <span>25 min</span></button><button type="button" data-pomodoro-mode="short" aria-pressed="false">Short break <span>5 min</span></button><button type="button" data-pomodoro-mode="long" aria-pressed="false">Long break <span>15 min</span></button></div></div><div class="pomodoro-main"><div class="pomodoro-clock" aria-live="off"><span id="pomodoro-mode-label">FOCUS</span><strong id="pomodoro-display">25:00</strong><span id="pomodoro-status" role="status">Ready when you are.</span></div><div class="pomodoro-actions"><button class="button" id="pomodoro-start" type="button">Start timer</button><button class="button subtle-button" id="pomodoro-reset" type="button">Reset</button></div><button class="pomodoro-notification-button" id="pomodoro-notifications" type="button">Enable device notifications</button></div><div class="pomodoro-tasks"><div class="pomodoro-task-head"><div><p class="eyebrow">Your tasks</p><h3>What are you working on?</h3></div><button class="chip" id="pomodoro-clear-tasks" type="button">Clear all tasks</button></div><form id="pomodoro-task-form" class="pomodoro-task-form"><label class="field">Task<input id="pomodoro-task-title" required maxlength="120" placeholder="e.g. Draft the introduction"></label><label class="field">Notes <span class="fine">optional</span><textarea id="pomodoro-task-notes" rows="2" maxlength="500" placeholder="A useful detail or first step"></textarea></label><div class="pomodoro-task-options"><label class="field">Project<select id="pomodoro-task-project"></select></label><label class="field">Estimated Pomodoros<select id="pomodoro-task-estimate"></select></label><button class="button" type="submit">Add task</button></div></form><form id="pomodoro-project-form" class="pomodoro-project-form"><label class="field">New project<input id="pomodoro-project-name" maxlength="60" placeholder="e.g. Dissertation"></label><button class="button secondary" type="submit">Add project</button></form><div id="pomodoro-task-list" class="pomodoro-task-list" aria-live="polite"></div></div></section>
    <section class="focus-note"><h2>A quiet note on sound</h2><p>There is no ideal focus mix. Some days call for silence; some days call for a little movement or repetition. Keep the volume comfortable, and leave out any sound that feels like too much.</p><a href="#tools">Explore other interactive activities →</a></section>
  </div>`;

  const mixer = $(".focus-mixer", root);
  const breathing = $(".timed-breathing-card", root);
  const pomodoro = $(".pomodoro-card", root);
  const values = {};
  const outputs = {};
  const audioByTrack = {};
  const trackHost = $("#focus-tracks", root);
  const masterSlider = $("#focus-master", root);
  const masterOutput = $("#focus-master-output", root);
  const gainScale = { lofi: .36, focus: .36, pink: .42, bowl: .38, rain: .52, fire: .52, wind: .48, ocean: .52, trees: .5 };
  let playing = false;

  tracks.forEach(([id, name, detail, source]) => {
    const row = el("label", "focus-track"); row.dataset.track = id;
    const badge = el("span", "focus-track-icon", iconFor(id)); badge.setAttribute("aria-hidden", "true");
    const copy = el("span", "focus-track-copy"); copy.append(el("b", "", name), el("small", "", detail));
    const input = document.createElement("input"); input.type = "range"; input.min = "0"; input.max = "100";
    input.value = id === "rain" ? "24" : id === "trees" ? "12" : 0; input.setAttribute("aria-label", name + " volume");
    const output = el("output", "focus-track-value", input.value + "%");
    values[id] = Number(input.value); outputs[id] = output;
    const audio = new Audio(source); audio.loop = true; audio.preload = "metadata"; audio.volume = 0; audioByTrack[id] = audio;
    input.addEventListener("input", () => { values[id] = Number(input.value); output.textContent = input.value + "%"; setTrackVolume(id); });
    row.append(badge, copy, input, output); trackHost.append(row);
  });
  const setTrackVolume = (id) => { const audio = audioByTrack[id]; if (!audio) return; audio.volume = Math.min(1, (values[id] / 100) * (Number(masterSlider.value) / 100) * gainScale[id]); };
  const setAllVolumes = () => tracks.forEach(([id]) => setTrackVolume(id));
  const setStatus = (message) => { const status = $("#focus-status", root); if (status) status.textContent = message; };
  const readSaved = () => { try { return JSON.parse(localStorage.getItem(recipeKey) || "null"); } catch { return null; } };
  const applyRecipe = (recipe, master = Number(masterSlider.value)) => {
    tracks.forEach(([id]) => { const value = Number(recipe?.[id]) || 0; values[id] = value; const input = trackHost.querySelector(`[data-track="${id}"] input`); input.value = String(value); outputs[id].textContent = value + "%"; });
    masterSlider.value = String(master); masterOutput.textContent = master + "%"; setAllVolumes(); setStatus("Mix updated. Press Start to listen, or adjust any layer.");
  };
  Object.entries(presets).forEach(([name, recipe]) => { const preset = el("button", "chip", name); preset.type = "button"; preset.addEventListener("click", () => applyRecipe(recipe)); $("#focus-preset-buttons", root).append(preset); });
  masterSlider.addEventListener("input", () => { masterOutput.textContent = masterSlider.value + "%"; setAllVolumes(); });
  const savedRecipe = readSaved(); if (savedRecipe) $("#focus-load", root).hidden = false;
  $("#focus-save", root).addEventListener("click", () => { localStorage.setItem(recipeKey, JSON.stringify({ values, master: Number(masterSlider.value) })); $("#focus-load", root).hidden = false; setStatus("Your mix has been saved on this device."); });
  $("#focus-load", root).addEventListener("click", () => { const recipe = readSaved(); if (recipe) applyRecipe(recipe.values, recipe.master); });
  const pauseAudio = () => { Object.values(audioByTrack).forEach((audio) => audio.pause()); };
  const stopAudio = () => { pauseAudio(); Object.values(audioByTrack).forEach((audio) => { audio.currentTime = 0; }); playing = false; $("#focus-play", root).textContent = "Start soundscape"; };
  const startAudio = async () => {
    if (!soundAllowed()) { setStatus("Sound is switched off in Account → Appearance. Enable optional sounds there to play a soundscape."); return; }
    setAllVolumes();
    const selected = tracks.map(([id]) => audioByTrack[id]).filter((audio, index) => values[tracks[index][0]] > 0);
    try { await Promise.all(selected.map((audio) => audio.play())); playing = true; $("#focus-play", root).textContent = "Pause soundscape"; setStatus("Playing your mix. Use the sliders to change layers, or pause at any time."); }
    catch { setStatus("Audio could not start. Check your browser's sound settings and try again."); }
  };
  $("#focus-play", root).addEventListener("click", () => { if (playing) { pauseAudio(); playing = false; $("#focus-play", root).textContent = "Resume soundscape"; setStatus("Paused. Your mix is still here; press Resume when ready."); } else startAudio(); });
  $("#focus-stop", root).addEventListener("click", () => { stopAudio(); setStatus("All sounds stopped. Your slider settings are still here."); });

  const uiSounds = { bell: new Audio("simplyfocus-pomodoro-bell.mp3"), tick: new Audio("simplyfocus-task-tick.mp3") };
  Object.values(uiSounds).forEach((audio) => { audio.preload = "auto"; });
  const playUiSound = (name) => { if (!soundAllowed()) return; const audio = uiSounds[name]; if (!audio) return; audio.currentTime = 0; audio.play().catch(() => {}); };
  const notifyDevice = (title, body) => { if (typeof navigator.vibrate === "function") navigator.vibrate([120, 70, 150]); if ("Notification" in window && Notification.permission === "granted") new Notification(title, { body, icon: "icon-192.png" }); };

  const pomodoroModes = { work: { label: "FOCUS", title: "Work period", seconds: 25 * 60 }, short: { label: "SHORT BREAK", title: "Short break", seconds: 5 * 60 }, long: { label: "LONG BREAK", title: "Long break", seconds: 15 * 60 } };
  let pomodoroMode = "work", pomodoroSeconds = pomodoroModes.work.seconds, pomodoroTimer = null;
  const pomodoroDisplay = $("#pomodoro-display", pomodoro), pomodoroStatus = $("#pomodoro-status", pomodoro), pomodoroStart = $("#pomodoro-start", pomodoro), pomodoroModeLabel = $("#pomodoro-mode-label", pomodoro);
  const renderPomodoro = () => { pomodoroDisplay.textContent = formatTime(pomodoroSeconds); };
  const stopPomodoro = () => { clearInterval(pomodoroTimer); pomodoroTimer = null; };
  const finishPomodoro = () => { const mode = pomodoroModes[pomodoroMode]; stopPomodoro(); pomodoroSeconds = 0; renderPomodoro(); pomodoroStart.textContent = "Start again"; pomodoroStatus.textContent = `${mode.title} complete. Choose what fits next.`; playUiSound("bell"); notifyDevice(`${mode.title} complete`, pomodoroMode === "work" ? "Your focus period has ended. A break is ready when you are." : "Your break has ended. Work is ready when you are."); };
  const updateMode = (mode) => { stopPomodoro(); pomodoroMode = mode; pomodoroSeconds = pomodoroModes[mode].seconds; pomodoro.className = `pomodoro-card phase-${mode}`; pomodoroModeLabel.textContent = pomodoroModes[mode].label; pomodoro.querySelectorAll("[data-pomodoro-mode]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.pomodoroMode === mode))); renderPomodoro(); pomodoroStart.textContent = "Start timer"; pomodoroStatus.textContent = mode === "work" ? "Ready when you are." : "A small pause is still part of the work."; };
  pomodoro.querySelectorAll("[data-pomodoro-mode]").forEach((button) => button.addEventListener("click", () => updateMode(button.dataset.pomodoroMode)));
  pomodoroStart.addEventListener("click", () => { if (pomodoroTimer) { stopPomodoro(); pomodoroStart.textContent = "Resume timer"; pomodoroStatus.textContent = "Paused. Resume whenever you are ready."; return; } if (!pomodoroSeconds) pomodoroSeconds = pomodoroModes[pomodoroMode].seconds; pomodoroTimer = setInterval(() => { pomodoroSeconds -= 1; renderPomodoro(); if (pomodoroSeconds <= 0) finishPomodoro(); }, 1000); pomodoroStart.textContent = "Pause timer"; pomodoroStatus.textContent = "Timer running. Keep the next few minutes small and manageable."; });
  $("#pomodoro-reset", pomodoro).addEventListener("click", () => updateMode(pomodoroMode));
  const notificationButton = $("#pomodoro-notifications", pomodoro);
  const refreshNotificationButton = () => { if (!("Notification" in window)) { notificationButton.hidden = true; return; } if (Notification.permission === "granted") { notificationButton.textContent = "Device notifications enabled"; notificationButton.disabled = true; } else if (Notification.permission === "denied") notificationButton.textContent = "Notifications are blocked in this browser"; };
  refreshNotificationButton();
  notificationButton.addEventListener("click", async () => { if (!("Notification" in window)) return; const permission = await Notification.requestPermission(); refreshNotificationButton(); pomodoroStatus.textContent = permission === "granted" ? "Device notifications are ready for timer completions." : "The timer will still show and sound on this page."; });

  const taskStorageKey = "ns-simplyfocus-tasks-v1"; let tasks = [], projects = ["Personal"];
  const taskList = $("#pomodoro-task-list", pomodoro), projectSelect = $("#pomodoro-task-project", pomodoro), estimateSelect = $("#pomodoro-task-estimate", pomodoro);
  for (let i = 1; i <= 8; i += 1) { const option = document.createElement("option"); option.value = String(i); option.textContent = `${i} Pomodoro${i === 1 ? "" : "s"}`; estimateSelect.append(option); }
  const saveTasks = () => localStorage.setItem(taskStorageKey, JSON.stringify({ tasks, projects }));
  const loadTasks = () => { try { const saved = JSON.parse(localStorage.getItem(taskStorageKey) || "null"); tasks = Array.isArray(saved?.tasks) ? saved.tasks : []; projects = Array.isArray(saved?.projects) && saved.projects.length ? saved.projects : ["Personal"]; } catch { tasks = []; projects = ["Personal"]; } };
  const renderProjects = () => { projectSelect.replaceChildren(); projects.forEach((project) => { const option = document.createElement("option"); option.value = project; option.textContent = project; projectSelect.append(option); }); };
  const moveTask = (task, direction) => { const indexes = tasks.map((item, index) => item.project === task.project ? index : -1).filter((index) => index >= 0); const position = indexes.indexOf(tasks.indexOf(task)); const target = indexes[position + direction]; if (target === undefined) return; [tasks[tasks.indexOf(task)], tasks[target]] = [tasks[target], tasks[tasks.indexOf(task)]]; saveTasks(); renderTasks(); };
  const renderTasks = () => { taskList.replaceChildren(); if (!tasks.length) { taskList.append(el("p", "pomodoro-empty", "No tasks yet. Add one small, visible next step above.")); return; } projects.forEach((project) => { const projectTasks = tasks.filter((task) => task.project === project); if (!projectTasks.length) return; const group = el("section", "pomodoro-project"); group.append(el("h4", "", project)); projectTasks.forEach((task) => { const card = el("article", `pomodoro-task${task.done ? " is-done" : ""}`); const check = document.createElement("input"); check.type = "checkbox"; check.checked = Boolean(task.done); check.setAttribute("aria-label", `Finish ${task.title}`); check.addEventListener("change", () => { task.done = check.checked; if (task.done) playUiSound("tick"); saveTasks(); renderTasks(); }); const copy = el("div", "pomodoro-task-copy"); copy.append(el("strong", "", task.title)); if (task.notes) copy.append(el("p", "", task.notes)); copy.append(el("small", "", `${task.estimate} Pomodoro${task.estimate === 1 ? "" : "s"}`)); const controls = el("div", "pomodoro-task-controls"); const up = el("button", "chip", "↑"); up.type = "button"; up.title = "Move task up"; up.disabled = tasks.indexOf(task) === tasks.findIndex((item) => item.project === task.project); up.addEventListener("click", () => moveTask(task, -1)); const down = el("button", "chip", "↓"); down.type = "button"; down.title = "Move task down"; const sameProject = tasks.filter((item) => item.project === task.project); down.disabled = sameProject[sameProject.length - 1] === task; down.addEventListener("click", () => moveTask(task, 1)); const remove = el("button", "chip pomodoro-task-delete", "Delete"); remove.type = "button"; remove.title = `Delete ${task.title}`; remove.addEventListener("click", () => { tasks = tasks.filter((item) => item !== task); saveTasks(); renderTasks(); }); controls.append(up, down, remove); card.append(check, copy, controls); group.append(card); }); taskList.append(group); }); };
  $("#pomodoro-task-form", pomodoro).addEventListener("submit", (event) => { event.preventDefault(); const title = $("#pomodoro-task-title", pomodoro).value.trim(); if (!title) return; tasks.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title, notes: $("#pomodoro-task-notes", pomodoro).value.trim(), estimate: Number($("#pomodoro-task-estimate", pomodoro).value), project: projectSelect.value || projects[0], done: false }); saveTasks(); event.target.reset(); renderTasks(); });
  $("#pomodoro-project-form", pomodoro).addEventListener("submit", (event) => { event.preventDefault(); const input = $("#pomodoro-project-name", pomodoro); const name = input.value.trim(); if (!name || projects.includes(name)) return; projects.push(name); saveTasks(); renderProjects(); projectSelect.value = name; input.value = ""; renderTasks(); });
  $("#pomodoro-clear-tasks", pomodoro).addEventListener("click", () => { if (!tasks.length || !window.confirm("Clear all Pomodoro tasks?")) return; tasks = []; saveTasks(); renderTasks(); }); loadTasks(); renderProjects(); renderTasks();

  const breathOrb = $("#focus-breath-orb", root), breathPhase = $("#focus-breath-phase", root), breathCountdown = $("#focus-breath-countdown", root), breathPace = $("#focus-breath-pace", root), breathPaceOutput = $("#focus-breath-pace-output", root), breathStart = $("#focus-breath-start", root), breathStatus = $("#focus-breath-status", root);
  let breathTotal = 5 * 60, breathRemaining = breathTotal, breathTimer = null, breathStartedAt = 0, breathStartRemaining = breathRemaining;
  const setBreathDuration = (minutes) => { breathTotal = Number(minutes) * 60; breathRemaining = breathTotal; breathCountdown.textContent = formatTime(breathRemaining); breathing.querySelectorAll("[data-breath-minutes]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.breathMinutes) === Number(minutes)))); };
  const updateBreathVisual = () => { const elapsed = Date.now() - breathStartedAt; const cycle = Number(breathPace.value) * 1000; const inhale = elapsed % cycle < cycle / 2; breathOrb.classList.add("breathing"); breathOrb.style.setProperty("--breath-half-duration", `${Number(breathPace.value) / 2}s`); breathOrb.textContent = inhale ? "Inhale if comfortable" : "Exhale if comfortable"; breathPhase.textContent = inhale ? "Shape growing · breathe naturally" : "Shape easing back · no breath hold"; };
  const stopBreathing = (message = "Paused. Your breathing can stay as it is.") => { if (breathTimer) { clearInterval(breathTimer); breathTimer = null; const elapsed = Math.floor((Date.now() - breathStartedAt) / 1000); breathRemaining = Math.max(0, breathStartRemaining - elapsed); } breathOrb.classList.remove("breathing"); breathOrb.textContent = "Paused"; breathPhase.textContent = message; breathStart.textContent = "Resume breathing"; };
  const completeBreathing = () => { if (breathTimer) clearInterval(breathTimer); breathTimer = null; breathRemaining = 0; breathCountdown.textContent = "00:00"; breathOrb.classList.remove("breathing"); breathOrb.textContent = "Complete"; breathPhase.textContent = "Session finished. Take a moment before choosing what is next."; breathStart.textContent = "Start again"; breathStatus.textContent = "Your timed breathing session is complete."; playUiSound("bell"); };
  const tickBreathing = () => { const elapsed = Math.floor((Date.now() - breathStartedAt) / 1000); breathRemaining = Math.max(0, breathStartRemaining - elapsed); breathCountdown.textContent = formatTime(breathRemaining); updateBreathVisual(); if (breathRemaining <= 0) completeBreathing(); };
  breathPace.addEventListener("input", () => { breathPaceOutput.textContent = `${breathPace.value} seconds`; if (breathTimer) { breathStartedAt = Date.now(); breathStartRemaining = breathRemaining; updateBreathVisual(); } });
  breathing.querySelectorAll("[data-breath-minutes]").forEach((button) => button.addEventListener("click", () => { if (breathTimer) stopBreathing(); setBreathDuration(button.dataset.breathMinutes); breathOrb.textContent = "Ready when you are"; breathPhase.textContent = "Choose a pace and begin when it feels useful."; breathStart.textContent = "Start breathing"; breathStatus.textContent = "You can pause at any time. Breathe naturally and stop if this feels uncomfortable."; }));
  breathStart.addEventListener("click", () => { if (breathTimer) { stopBreathing(); breathStatus.textContent = "Pacer paused. Your soundscape can continue underneath."; return; } if (!breathRemaining) breathRemaining = breathTotal; breathStartedAt = Date.now(); breathStartRemaining = breathRemaining; breathTimer = setInterval(tickBreathing, 200); breathStart.textContent = "Pause breathing"; breathStatus.textContent = "The visual pacer is moving. Breathe naturally; pause whenever you want."; tickBreathing(); });
  $("#focus-breath-reset", root).addEventListener("click", () => { if (breathTimer) clearInterval(breathTimer); breathTimer = null; breathRemaining = breathTotal; breathCountdown.textContent = formatTime(breathRemaining); breathOrb.classList.remove("breathing"); breathOrb.textContent = "Ready when you are"; breathPhase.textContent = "Choose a pace and begin when it feels useful."; breathStart.textContent = "Start breathing"; breathStatus.textContent = "You can pause at any time. Breathe naturally and stop if this feels uncomfortable."; });

  const cleanup = () => { stopAudio(); if (pomodoroTimer) clearInterval(pomodoroTimer); if (breathTimer) clearInterval(breathTimer); window.removeEventListener("ns:preferences", preferenceHandler); Object.values(uiSounds).forEach((audio) => { audio.pause(); }); };
  const preferenceHandler = (event) => { if (event.detail?.lowStim || event.detail?.sound === false) { stopAudio(); if (breathTimer) stopBreathing("Sound has been stopped by your Account preference. Your breathing can continue when you are ready."); } };
  window.addEventListener("ns:preferences", preferenceHandler); window.addEventListener("hashchange", cleanup, { once: true });
}

function iconFor(id) { return ({ rain: "☂", fire: "♨", wind: "↝", ocean: "≈", bowl: "◉", pink: "∿", trees: "❋", lofi: "♫", focus: "◌" })[id] || "♪"; }
