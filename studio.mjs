import { curriculum } from "./data.mjs";
import {
  escapeHTML as esc,
  renderBody,
  safeImage,
  validatePost,
} from "./core.mjs";
import { Publisher } from "./publisher.mjs";
const $ = (id) => document.getElementById(id),
  form = $("editor");
let publisher = null,
  posts = [],
  current = null,
  previous = null,
  images = [],
  busy = false,
  dirty = false;
const templates = {
  blog: "## The thought\n\n\n\n## A closer look\n\n\n\n## Something to carry with you\n\n",
  education:
    "## The question\n\n\n\n## The idea\n\n\n\n## Evidence and uncertainty\n\n\n\n## Try it in your life\n\n\n\n## Sources\n\n",
  video:
    "## In this video\n\n\n\n## Key ideas\n\n\n\n## A question to take with you\n\n",
};
const field = (name) => form.elements.namedItem(name);
const status = (message, error = false) => {
  $("publish-status").textContent = message;
  $("publish-status").classList.toggle("error", error);
};
function download(name, data) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$("module-checks").innerHTML = curriculum.modules
  .map(
    (m) =>
      `<label><input type="checkbox" name="modules" value="${m.id}">${m.id}. ${esc(m.title)}</label>`,
  )
  .join("");
$("week-checks").innerHTML = curriculum.weeks
  .map(
    (w) =>
      `<label><input type="checkbox" name="weeks" value="${w.id}">${w.id}. ${esc(w.title)}</label>`,
  )
  .join("");
$("login-form").onsubmit = async (event) => {
  event.preventDefault();
  const token = $("token").value.trim();
  if (!token) return;
  $("connect").disabled = true;
  $("login-status").textContent = "";
  const candidate = new Publisher(token);
  try {
    await candidate.connect();
    const snapshot = await candidate.snapshot();
    publisher = candidate;
    posts = snapshot.data.posts;
    $("token").value = "";
    $("login").hidden = true;
    $("studio").hidden = false;
    listPosts();
    openEditor();
  } catch (error) {
    candidate.disconnect();
    $("token").value = "";
    const message =
      error instanceof Error && error.message
        ? error.message
        : "GitHub returned an unexpected sign-in error.";
    $("login-status").textContent =
      message === "Failed to fetch"
        ? "Could not reach GitHub. Check your connection and try again."
        : `Sign-in failed: ${message}`;
  } finally {
    $("connect").disabled = false;
  }
};
$("disconnect").onclick = () => {
  if (busy) return;
  if (
    dirty &&
    !confirm(
      "Disconnect? Download or save your draft first if you want to keep it.",
    )
  )
    return;
  publisher?.disconnect();
  publisher = null;
  images = [];
  current = null;
  previous = null;
  form.reset();
  dirty = false;
  $("studio").hidden = true;
  $("login").hidden = false;
  $("login-status").textContent = "Disconnected.";
};
function listPosts() {
  $("existing").innerHTML =
    `<h3>Your content</h3>${posts.length ? posts.map((p) => `<div class="saved-item"><strong>${esc(p.title)}</strong><br>${esc(p.type)} · ${esc(p.status)}<button type="button" class="chip" data-edit="${esc(p.id)}">Edit</button></div>`).join("") : '<p class="fine">Your published pieces will appear here.</p>'}`;
  $("existing")
    .querySelectorAll("[data-edit]")
    .forEach(
      (b) =>
        (b.onclick = () => {
          if (busy) return;
          if (dirty && !confirm("Discard the changes in this editor?")) return;
          openEditor(posts.find((p) => p.id === b.dataset.edit));
        }),
    );
}
function openEditor(post = null, type = "blog") {
  previous = post ? structuredClone(post) : null;
  current = post
    ? structuredClone(post)
    : {
        id: crypto.randomUUID(),
        type,
        title: "",
        excerpt: "",
        body: templates[type],
        youtube: "",
        topics: [],
        modules: [],
        weeks: [],
        thumbnail: "",
        thumbnailAlt: "",
        destinations: [type === "blog" ? "blog" : "library"],
      };
  images = [];
  form.reset();
  ["title", "excerpt", "body", "youtube", "thumbnailAlt"].forEach(
    (n) => (field(n).value = current[n] || ""),
  );
  field("topics").value = (current.topics || []).join(", ");
  ["weeks", "modules"].forEach((name) =>
    form
      .querySelectorAll(`[name="${name}"]`)
      .forEach((c) => (c.checked = current[name]?.includes(+c.value))),
  );
  $("template-label").textContent = {
    blog: "Blog post template",
    education: "Educational writing template",
    video: "YouTube video template",
  }[current.type];
  $("youtube-field").hidden = current.type !== "video";
  field("youtube").required = current.type === "video";
  field("youtube").disabled = current.type !== "video";
  $("curriculum-fields").hidden = current.type === "blog";
  $("destination-note").textContent =
    current.type === "blog"
      ? "This piece will appear in the blog and under its selected themes."
      : "This resource will appear in the learning library, its selected topics, and every module or lesson you choose.";
  $("unpublish").hidden = !post || post.status !== "published";
  $("preview-area").hidden = true;
  thumbnailPreview();
  status("");
  dirty = false;
}
function collect() {
  const p = { ...current };
  ["title", "excerpt", "body", "youtube", "thumbnailAlt"].forEach(
    (n) => (p[n] = field(n).value.trim()),
  );
  p.topics = [
    ...new Set(
      field("topics")
        .value.split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    ),
  ];
  p.weeks =
    p.type === "blog"
      ? []
      : [...form.querySelectorAll('[name="weeks"]:checked')].map(
          (c) => +c.value,
        );
  p.modules =
    p.type === "blog"
      ? []
      : [
          ...new Set(
            [...form.querySelectorAll('[name="modules"]:checked')]
              .map((c) => +c.value)
              .concat(
                p.weeks
                  .map(
                    (id) => curriculum.weeks.find((w) => w.id === id)?.module,
                  )
                  .filter(Boolean),
              ),
          ),
        ];
  return p;
}
function thumbnailPreview() {
  const image = images.find((i) => i.path === current.thumbnail);
  $("thumbnail-preview").hidden = !current.thumbnail;
  if (current.thumbnail)
    $("thumbnail-preview").src = image
      ? `data:${image.mime};base64,${image.base64}`
      : safeImage(current.thumbnail);
}
form.addEventListener("input", () => (dirty = true));
document.querySelectorAll("[data-template]").forEach(
  (b) =>
    (b.onclick = () => {
      if (busy) return;
      if (dirty && !confirm("Discard the changes in this editor?")) return;
      openEditor(null, b.dataset.template);
    }),
);
async function addImage(file) {
  if (!file) return null;
  if (file.size > 5 * 1024 * 1024)
    throw Error("Please choose an image smaller than 5 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  let mime = "",
    ext = "";
  if (
    bytes[0] === 137 &&
    bytes[1] === 80 &&
    bytes[2] === 78 &&
    bytes[3] === 71
  ) {
    mime = "image/png";
    ext = "png";
  } else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) {
    mime = "image/jpeg";
    ext = "jpg";
  } else if (
    new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
    new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
  ) {
    mime = "image/webp";
    ext = "webp";
  } else throw Error("Choose a PNG, JPEG or WebP image.");
  const bitmap = await createImageBitmap(new Blob([bytes], { type: mime }));
  if (!bitmap.width || !bitmap.height)
    throw Error("This image could not be decoded.");
  bitmap.close();
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192)
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  const image = {
    path: `media/${crypto.randomUUID()}.${ext}`,
    mime,
    base64: btoa(binary),
  };
  images.push(image);
  dirty = true;
  return image;
}
$("thumbnail-file").onchange = async (e) => {
  try {
    const image = await addImage(e.target.files[0]);
    if (image) {
      current.thumbnail = image.path;
      thumbnailPreview();
      status("Thumbnail added to this draft.");
    }
  } catch (e) {
    status(e.message, true);
  } finally {
    $("thumbnail-file").value = "";
  }
};
$("remove-thumbnail").onclick = () => {
  current.thumbnail = "";
  dirty = true;
  thumbnailPreview();
};
$("inline-file").onchange = async (e) => {
  try {
    if (!$("inline-alt").value.trim())
      throw Error(
        "Write a description for the image before choosing the file.",
      );
    const image = await addImage(e.target.files[0]);
    if (image) {
      const caption = $("inline-alt")
        .value.trim()
        .replace(/[\[\]\n\r]/g, " ");
      field("body").value += `\n\n![${caption}](${image.path})\n\n`;
      $("inline-alt").value = "";
      status(
        "Image added at the end of the writing. You can move its image line to another paragraph.",
      );
    }
  } catch (e) {
    status(e.message, true);
  } finally {
    $("inline-file").value = "";
  }
};
$("preview").onclick = () => {
  const p = collect();
  $("preview-area").hidden = false;
  $("preview-area").innerHTML =
    `<p class="eyebrow">Draft preview · ${esc(p.type)}</p><h2>${esc(p.title || "Untitled")}</h2><p>${esc(p.excerpt)}</p>${p.type === "video" ? `<p class="notice">YouTube video: ${esc(p.youtube || "Add a YouTube URL")}</p>` : ""}${renderBody(p.body)}`;
  $("preview-area")
    .querySelectorAll("img")
    .forEach((img) => {
      const image = images.find((i) => i.path === img.getAttribute("src"));
      if (image) img.src = `data:${image.mime};base64,${image.base64}`;
    });
};
const draft = () => ({ post: collect(), previous, images });
$("save-draft").onclick = () => {
  try {
    localStorage.setItem("ns-studio-draft", JSON.stringify(draft()));
    dirty = false;
    status(
      "Draft saved on this device, including its images. This replaces the previous local draft.",
    );
  } catch {
    status(
      "This draft is too large for local storage, or storage is unavailable. Use Download backup instead.",
      true,
    );
  }
};
$("download-draft").onclick = () =>
  download("nobodyssimple-content-draft.json", draft());
$("load-draft").onclick = () => {
  if (busy) return;
  try {
    const d = JSON.parse(localStorage.getItem("ns-studio-draft"));
    if (!d?.post || !Array.isArray(d.images))
      return status("No local draft found.", true);
    if (dirty && !confirm("Replace the editor with your saved draft?")) return;
    openEditor(d.post);
    previous = d.previous;
    images = d.images;
    thumbnailPreview();
    dirty = true;
    status("Local draft loaded. Preview and check it before publishing.");
  } catch {
    status("The draft could not be loaded.", true);
  }
};
async function publish(state) {
  if (busy || !publisher) return;
  try {
    const p = collect();
    p.status = state;
    p.updatedAt = new Date().toISOString();
    p.publishedAt = p.publishedAt || p.updatedAt;
    validatePost(p);
    if (
      state === "unpublished" &&
      !confirm(
        "Remove this piece from the public site? It will remain in GitHub history.",
      )
    )
      return;
    busy = true;
    form
      .querySelectorAll("input,textarea,select,button")
      .forEach((x) => (x.disabled = true));
    status(
      state === "published"
        ? "Uploading images and publishing your piece…"
        : "Unpublishing this piece…",
    );
    const used = images.filter(
      (i) => i.path === p.thumbnail || p.body.includes(`](${i.path})`),
    );
    const result = await publisher.publish(p, used, previous);
    posts = result.data.posts;
    listPosts();
    openEditor(p);
    dirty = false;
    status(
      `${state === "published" ? "Published" : "Unpublished"} in GitHub. The website will update after GitHub Pages finishes deploying, usually within a few minutes.\nCommit: ${result.sha.slice(0, 7)}`,
    );
  } catch (e) {
    status(e.message, true);
  } finally {
    busy = false;
    form
      .querySelectorAll("input,textarea,select,button")
      .forEach((x) => (x.disabled = false));
    field("youtube").disabled = current?.type !== "video";
  }
}
form.onsubmit = (e) => {
  e.preventDefault();
  publish("published");
};
$("unpublish").onclick = () => publish("unpublished");
window.addEventListener("beforeunload", (e) => {
  if (dirty || busy) {
    e.preventDefault();
    e.returnValue = "";
  }
});
$("clear-draft").onclick = () => {
  if (
    confirm(
      "Remove the local saved draft? Your open editor and published content will stay as they are.",
    )
  ) {
    try {
      localStorage.removeItem("ns-studio-draft");
      status("Local saved draft removed.");
    } catch {
      status("Could not access local storage.", true);
    }
  }
};
$("import-draft").onchange = async (event) => {
  try {
    if (busy) return;
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 40 * 1024 * 1024)
      throw Error("This backup is larger than 40 MB.");
    const d = JSON.parse(await file.text());
    if (
      !d.post ||
      !["blog", "education", "video"].includes(d.post.type) ||
      typeof d.post.id !== "string" ||
      !Array.isArray(d.images) ||
      d.images.some(
        (i) =>
          !safeImage(i.path) ||
          !["image/png", "image/jpeg", "image/webp"].includes(i.mime) ||
          typeof i.base64 !== "string" ||
          !/^[A-Za-z0-9+/=]*$/.test(i.base64),
      )
    )
      throw Error("This file is not a supported studio backup.");
    if (dirty && !confirm("Replace the current editor with this backup?"))
      return;
    openEditor(d.post);
    previous = d.previous || null;
    images = d.images;
    thumbnailPreview();
    dirty = true;
    status("Backup restored. Check the piece before publishing.");
  } catch (e) {
    status(e.message, true);
  } finally {
    event.target.value = "";
  }
};
