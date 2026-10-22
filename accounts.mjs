import { initializeApp } from "https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail, signOut,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-auth.js";
import {
  getFirestore, collection, doc, getDocs, onSnapshot, writeBatch, serverTimestamp,
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-firestore.js";

/* Nobody's Simple Firebase web configuration. Firebase web config is public. */
const firebaseConfig = {
  apiKey: "AIzaSyBQLrbiby_zNc0gIoefTsOzkCBECprXbMA",
  authDomain: "nobodys-simple.firebaseapp.com",
  projectId: "nobodys-simple",
  storageBucket: "nobodys-simple.firebasestorage.app",
  messagingSenderId: "239548972013",
  appId: "1:239548972013:web:ce9085c4cb6e0c872645e4",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* Only these known Nobody's Simple saved-work keys are eligible for sync. */
const savedKeys = new Set([
  "ns-personal-maps-v1",
  "ns-tool-favourites-v1",
  "ns-tool-recent-v1",
  "ns-learn-quote-notes-v1",
  "ns-reflection",
  "ns-sensory-recipe-v1",
  "ns-memory-jar-v1",
  "nobodys-simple-full-profile-draft-v3",
  "nobodys-simple-profile-state-checkins-v1",
  "nobodys-simple-profile-feedback-v1",
  "ns-simplyfocus-recipe-v1",
  "ns-simplyfocus-tasks-v1",
  "ns-navigation-context-v1",
  "ns-navigation-projects-v1",
]);
const preferenceKey = (uid) => `ns-cloud-sync-consent-v1:${uid}`;
let currentUser = null;
let applyingCloudData = false;
let stopCloudListener = null;
let pendingWrites = new Map();
let writeTimer = 0;

const style = document.createElement("style");
style.textContent = `
  .ns-account-trigger { margin-inline: 4px; }
  .ns-account-dialog { width:min(620px,calc(100% - 28px)); max-height:calc(100% - 32px); padding:0; border:1px solid #d7ded4; border-radius:22px; background:#fffdf8; color:#315746; box-shadow:0 24px 80px #17251c55; }
  .ns-account-dialog::backdrop { background:#14201999; backdrop-filter:blur(3px); }
  .ns-account-inner { position:relative; padding:clamp(22px,5vw,38px); overflow:auto; max-height:calc(100vh - 32px); }
  .ns-account-close { position:absolute; top:12px; right:15px; width:42px; height:42px; border:0; border-radius:50%; background:#edf2eb; color:#315746; font-size:25px; cursor:pointer; }
  .ns-account-inner h1 { margin:7px 40px 10px 0; font:400 clamp(2rem,6vw,3.2rem)/1.05 Georgia,serif; }
  .ns-account-inner h2 { margin:5px 0 10px; font:400 1.55rem/1.15 Georgia,serif; }
  .ns-account-inner p { color:#5f7064; font-size:14px; line-height:1.65; }
  .ns-account-inner .ns-eyebrow { margin:0; color:#a26c3d; font-size:10px; font-weight:800; letter-spacing:.13em; text-transform:uppercase; }
  .ns-account-card,.ns-sync-card { margin:20px 0; padding:20px; border:1px solid #dbe1d8; border-radius:16px; background:#fff; }
  .ns-account-inner label { display:grid; gap:6px; margin:13px 0; color:#526558; font-size:13px; font-weight:700; }
  .ns-account-inner input { min-height:45px; width:100%; box-sizing:border-box; padding:10px 12px; border:1px solid #cbd6ca; border-radius:9px; font:inherit; }
  .ns-account-inner button.ns-btn { min-height:43px; padding:10px 16px; border:1px solid #315746; border-radius:999px; background:#315746; color:white; font:700 13px Arial,sans-serif; cursor:pointer; }
  .ns-account-inner button.ns-btn.secondary { background:#fffdf8; color:#315746; }
  .ns-account-inner button.ns-btn:disabled { opacity:.6; cursor:wait; }
  .ns-account-inner .ns-full { width:100%; margin:5px 0; }
  .ns-account-inner .ns-divider { margin:18px 0; color:#78877b; text-align:center; font-size:12px; }
  .ns-account-inner .ns-mode { display:flex; gap:8px; margin:12px 0; }
  .ns-account-inner .ns-mode button { padding:8px 12px; border:1px solid #d4ddd2; border-radius:999px; background:#f5f7f1; color:#526558; cursor:pointer; }
  .ns-account-inner .ns-mode button.active { border-color:#315746; background:#315746; color:white; }
  .ns-account-inner .ns-reset { display:block; margin:11px auto 0; padding:4px; border:0; background:transparent; color:#496a57; text-decoration:underline; cursor:pointer; }
  .ns-account-inner .ns-status { min-height:22px; color:#8b5537; font-weight:700; }
  .ns-account-inner .ns-sync-actions { display:grid; gap:9px; }
  .ns-account-inner .ns-small { font-size:11px; color:#768278; }
  @media(max-width:520px) { .ns-account-trigger { padding:8px 10px !important; font-size:11px !important; } .ns-account-inner { padding:24px 18px; } }
`;
document.head.append(style);

const dialog = document.createElement("dialog");
dialog.className = "ns-account-dialog";
dialog.setAttribute("aria-label", "Nobody's Simple account");
document.body.append(dialog);

const trigger = document.createElement("button");
trigger.type = "button";
trigger.className = "button small ns-account-trigger";
trigger.setAttribute("aria-haspopup", "dialog");
trigger.textContent = "Sign in";
trigger.addEventListener("click", () => {
  renderDialog();
  dialog.showModal();
});
const actions = document.querySelector(".app-top-actions");
if (actions) actions.prepend(trigger);

dialog.addEventListener("click", (event) => {
  if (event.target === dialog || event.target.closest("[data-close]")) dialog.close();
});

function safeText(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char]);
}
function friendlyError(error) {
  const messages = {
    "auth/invalid-email": "Enter a valid email address.",
    "auth/invalid-credential": "That email and password combination was not recognised.",
    "auth/email-already-in-use": "An account already uses that email. Try signing in.",
    "auth/weak-password": "Choose a password with at least 6 characters.",
    "auth/popup-closed-by-user": "Google sign-in was closed before it finished.",
    "auth/unauthorized-domain": "Add nobodyssimple.com under Firebase Authentication → Settings → Authorized domains.",
    "permission-denied": "Firestore rejected this request. Check that the security rules have been published.",
    "unavailable": "Firebase could not be reached. Check your internet connection and try again.",
  };
  return messages[error?.code] || "That action did not finish. Check the Firebase setup and try again.";
}
function localSavedEntries() {
  return [...savedKeys].flatMap((key) => {
    try {
      const value = localStorage.getItem(key);
      return value === null ? [] : [[key, value]];
    } catch { return []; }
  });
}
function savedWork(uid) {
  return collection(db, "users", uid, "savedWork");
}
async function fetchCloudItems(uid) {
  const snapshot = await getDocs(savedWork(uid));
  const items = new Map();
  snapshot.forEach((item) => {
    let key;
    try { key = decodeURIComponent(item.id); } catch { return; }
    if (savedKeys.has(key)) items.set(key, item.data());
  });
  return items;
}
async function saveEntries(uid, entries) {
  if (!entries.length) return;
  const batch = writeBatch(db);
  for (const [key, value] of entries) {
    if (value.length > 850000) throw new Error("A saved item is too large to sync. Keep it on this device for now.");
    batch.set(doc(db, "users", uid, "savedWork", encodeURIComponent(key)), {
      value, deleted: false, updatedAt: serverTimestamp(),
    });
  }
  await batch.commit();
}
function watchCloud(uid) {
  stopCloudListener?.();
  stopCloudListener = onSnapshot(savedWork(uid), (snapshot) => {
    applyingCloudData = true;
    try {
      for (const item of snapshot.docs) {
        let key;
        try { key = decodeURIComponent(item.id); } catch { continue; }
        if (!savedKeys.has(key)) continue;
        const record = item.data();
        if (record.deleted) localStorage.removeItem(key);
        else if (typeof record.value === "string") localStorage.setItem(key, record.value);
      }
    } finally {
      queueMicrotask(() => { applyingCloudData = false; });
    }
  }, (error) => console.warn("Nobody's Simple saved-work sync stopped:", error));
}
function queueCloudWrite(key, value, deleted = false) {
  if (!currentUser || applyingCloudData || !savedKeys.has(key)) return;
  try {
    if (localStorage.getItem(preferenceKey(currentUser.uid)) !== "enabled") return;
  } catch { return; }
  pendingWrites.set(key, { value, deleted });
  clearTimeout(writeTimer);
  writeTimer = setTimeout(async () => {
    const uid = currentUser?.uid;
    const entries = [...pendingWrites.entries()];
    pendingWrites.clear();
    if (!uid || !entries.length) return;
    const batch = writeBatch(db);
    for (const [changedKey, change] of entries) {
      const ref = doc(db, "users", uid, "savedWork", encodeURIComponent(changedKey));
      if (change.deleted) batch.set(ref, { deleted: true, updatedAt: serverTimestamp() });
      else if (change.value.length <= 850000) batch.set(ref, { value: change.value, deleted: false, updatedAt: serverTimestamp() });
    }
    try { await batch.commit(); }
    catch (error) { console.warn("Saved work could not sync:", error); }
  }, 500);
}
function installStorageSync() {
  const originalSet = Storage.prototype.setItem;
  const originalRemove = Storage.prototype.removeItem;
  Storage.prototype.setItem = function(key, value) {
    originalSet.call(this, key, value);
    if (this === localStorage) queueCloudWrite(String(key), String(value));
  };
  Storage.prototype.removeItem = function(key) {
    originalRemove.call(this, key);
    if (this === localStorage) queueCloudWrite(String(key), "", true);
  };
}
async function enableSync(mode) {
  const user = currentUser;
  if (!user) throw new Error("Sign in before turning on sync.");
  const local = localSavedEntries();
  const remote = await fetchCloudItems(user.uid);
  if (mode === "import") {
    const combined = new Map(remote);
    for (const entry of local) combined.set(entry[0], { value: entry[1], deleted: false });
    await saveEntries(user.uid, [...combined.entries()].filter(([, record]) => !record.deleted).map(([key, record]) => [key, record.value]));
  } else {
    applyingCloudData = true;
    try {
      for (const key of savedKeys) localStorage.removeItem(key);
      for (const [key, record] of remote) {
        if (!record.deleted && typeof record.value === "string") localStorage.setItem(key, record.value);
      }
    } finally { applyingCloudData = false; }
  }
  localStorage.setItem(preferenceKey(user.uid), "enabled");
  watchCloud(user.uid);
}
function syncMarkup() {
  let enabled = false;
  try { enabled = localStorage.getItem(preferenceKey(currentUser.uid)) === "enabled"; } catch {}
  if (enabled) return `
    <section class="ns-sync-card"><p class="ns-eyebrow">Private saved-work sync</p>
      <h2>Sync is on in this browser</h2>
      <p>Your saved tools, maps, notes, questionnaire results and preferences can sync to this account. Other devices will ask before they sync.</p>
      <button class="ns-btn secondary" type="button" data-sync-off>Turn off sync in this browser</button>
    </section>`;
  return `
    <section class="ns-sync-card"><p class="ns-eyebrow">Private saved-work sync</p>
      <h2>Choose how to begin</h2>
      <p>Guest saving stays on this device. If you turn on sync, the selected saved work below—including personal reflections and questionnaire results—will be stored in your private account for use on other devices.</p>
      <div class="ns-sync-actions">
        <button class="ns-btn" type="button" data-sync-choice="import">Bring over this browser’s saved work</button>
        <button class="ns-btn secondary" type="button" data-sync-choice="fresh">Use the saved work already in my account</button>
      </div>
    </section>`;
}
function renderDialog() {
  if (currentUser) {
    const emailLogin = currentUser.providerData.some((provider) => provider.providerId === "password");
    dialog.innerHTML = `
      <div class="ns-account-inner"><button class="ns-account-close" type="button" data-close aria-label="Close">×</button>
        <p class="ns-eyebrow">Your account</p><h1>Welcome back.</h1>
        <p>${safeText(currentUser.email || "Signed in with Google")}${currentUser.emailVerified ? " · Email verified" : " · Email not verified"}</p>
        ${emailLogin && !currentUser.emailVerified ? '<p>Check your inbox for the verification link. You can use the site while you wait.</p><button class="ns-btn secondary" type="button" data-resend-verification>Resend verification email</button>' : ""}
        ${syncMarkup()}
        <button class="ns-btn secondary" type="button" data-sign-out>Sign out</button>
        <p class="ns-small">Firebase handles sign-in; Nobody’s Simple does not store your password. Saved work stays on this device unless you choose to sync it.</p>
      </div>`;
    dialog.querySelector("[data-sign-out]")?.addEventListener("click", () => signOut(auth));
    dialog.querySelector("[data-resend-verification]")?.addEventListener("click", async (event) => {
      try { await sendEmailVerification(currentUser); event.currentTarget.textContent = "Verification email sent"; }
      catch { event.currentTarget.textContent = "Could not send yet. Try again in a moment."; }
    });
    dialog.querySelector("[data-sync-off]")?.addEventListener("click", () => {
      localStorage.removeItem(preferenceKey(currentUser.uid));
      stopCloudListener?.();
      stopCloudListener = null;
      renderDialog();
    });
    dialog.querySelectorAll("[data-sync-choice]").forEach((button) => button.addEventListener("click", async () => {
      const mode = button.dataset.syncChoice;
      const message = mode === "import"
        ? "This uploads saved work from this browser—including personal reflections and questionnaire results—to your private account. Continue?"
        : "This replaces saved work in this browser with the saved work in your account. Continue?";
      if (!window.confirm(message)) return;
      button.disabled = true;
      try { await enableSync(mode); renderDialog(); }
      catch (error) {
        button.disabled = false;
        const note = document.createElement("p");
        note.textContent = error.message?.startsWith("A saved item") ? error.message : friendlyError(error);
        dialog.querySelector(".ns-sync-card")?.append(note);
      }
    }));
    return;
  }
  dialog.innerHTML = `
    <div class="ns-account-inner"><button class="ns-account-close" type="button" data-close aria-label="Close">×</button>
      <p class="ns-eyebrow">Your account</p><h1>Save your work<br>across devices.</h1>
      <p>Sign in, or close this window to continue as a guest. Guest saving stays in this browser.</p>
      <section class="ns-account-card">
        <button class="ns-btn ns-full" type="button" data-google>Continue with Google</button>
        <p class="ns-divider">or use email</p>
        <div class="ns-mode"><button type="button" data-mode="signin" class="active">Sign in</button><button type="button" data-mode="create">Create account</button></div>
        <form data-form><label>Email address<input name="email" type="email" autocomplete="email" required></label>
          <label>Password<input name="password" type="password" minlength="6" autocomplete="current-password" required></label>
          <button class="ns-btn ns-full" type="submit" data-submit>Sign in</button>
          <button class="ns-reset" type="button" data-reset>Forgot password? Enter your email above first.</button>
        </form>
        <p class="ns-status" role="status" aria-live="polite"></p>
      </section>
      <p class="ns-small">You can keep using the site as a guest. Nobody’s Simple does not receive or store your password.</p>
    </div>`;
  const form = dialog.querySelector("[data-form]");
  const status = dialog.querySelector(".ns-status");
  let mode = "signin";
  dialog.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => {
    mode = button.dataset.mode;
    dialog.querySelectorAll("[data-mode]").forEach((item) => item.classList.toggle("active", item === button));
    dialog.querySelector("[data-submit]").textContent = mode === "create" ? "Create account" : "Sign in";
    form.elements.password.autocomplete = mode === "create" ? "new-password" : "current-password";
  }));
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Please wait…";
    try {
      if (mode === "create") {
        const result = await createUserWithEmailAndPassword(auth, form.elements.email.value.trim(), form.elements.password.value);
        await sendEmailVerification(result.user);
      } else {
        await signInWithEmailAndPassword(auth, form.elements.email.value.trim(), form.elements.password.value);
      }
    } catch (error) { status.textContent = friendlyError(error); }
  });
  dialog.querySelector("[data-google]").addEventListener("click", async () => {
    status.textContent = "Opening Google sign-in…";
    try { await signInWithPopup(auth, new GoogleAuthProvider()); }
    catch (error) { status.textContent = friendlyError(error); }
  });
  dialog.querySelector("[data-reset]").addEventListener("click", async () => {
    const email = form.elements.email.value.trim();
    if (!email) { status.textContent = "Enter your email address above first."; return; }
    try {
      await sendPasswordResetEmail(auth, email);
      status.textContent = "If an account uses that address, Firebase will send a password-reset email.";
    } catch (error) { status.textContent = friendlyError(error); }
  });
}
trigger.textContent = "Sign in";
installStorageSync();
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  trigger.textContent = user ? "Account" : "Sign in";
  if (user) {
    try {
      if (localStorage.getItem(preferenceKey(user.uid)) === "enabled") watchCloud(user.uid);
    } catch {}
  } else {
    stopCloudListener?.();
    stopCloudListener = null;
  }
  if (dialog.open) renderDialog();
});
dialog.addEventListener("close", () => {});
dialog.addEventListener("cancel", () => {});
dialog.addEventListener("click", (event) => {
  if (event.target.closest("[data-close]")) dialog.close();
});
