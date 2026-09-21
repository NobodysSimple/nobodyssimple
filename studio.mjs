import { curriculum } from "./data.mjs";
import {
  escapeHTML as esc,
  renderBlocks,
  renderPostBody,
  safeAsset,
  safeHref,
  safeImage,
  safeEmbedURL,
  sanitizeRichHTML,
  validatePost,
  youtubeID,
} from "./core.mjs";
import { Publisher } from "./publisher.mjs";

const $ = (id) => document.getElementById(id);
const now = () => new Date().toISOString();
const makeId = () => crypto.randomUUID?.() || `ns-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const blockTypes = [
  ["Text", [["paragraph", "Paragraph", "Rich text"], ["heading", "Heading", "H2 to H6"], ["toc", "Table of contents", "Generated from headings"], ["quote", "Quote", "Attributed quote"], ["pullquote", "Pull quote", "Large editorial quote"], ["list", "Bulleted / numbered list", "List items"], ["checklist", "Checklist", "Reader-facing list"], ["callout", "Callout", "Idea, warning, example…"], ["footnote", "Footnote", "A short note"], ["code", "Code", "Monospaced block"], ["definition", "Definition", "Term and meaning"]]],
  ["Media", [["image", "Image", "Alt text, caption, crop"], ["gallery", "Image gallery", "A responsive set"], ["carousel", "Carousel", "Scroll through images"], ["youtube", "YouTube embed", "Privacy-enhanced player"], ["embed", "Safe external embed", "Forms, Spotify, SoundCloud, Vimeo"], ["audio", "Audio player", "Upload an audio file"], ["file", "PDF download", "A downloadable resource"]]],
  ["Layout", [["columns", "Columns", "Two or three columns"], ["spacer", "Spacer", "Adjustable breathing room"], ["divider", "Divider", "Section break"], ["table", "Table", "Edit rows and columns"], ["tabs", "Tabbed sections", "Expandable sections"], ["accordion", "Accordion", "Expandable content"], ["card-grid", "Card grid", "Linked image and text cards"]]],
  ["Nobody’s Simple", [["tool", "Interactive tool", "Compass, reflection, or focus"], ["evidence", "Evidence note", "Strength and supporting source"], ["takeaway", "Key takeaway", "A highlighted idea"], ["reflection", "Reflection prompt", "A question to pause with"], ["related", "Related content", "Link to your other writing"], ["citation", "Citation", "Source, author, DOI"], ["glossary", "Glossary term", "A term and definition"], ["warning", "Content note", "A reader-facing warning"], ["button", "Button / call to action", "A site or external link"]]],
];
const allBlockDefs = blockTypes.flatMap(([, items]) => items);
const typeNames = { blog: "Blog post", education: "Educational writing", video: "YouTube video", resource: "Resource page", lesson: "Lesson", announcement: "Announcement", download: "Download" };
const topicName = (type) => typeNames[type] || "Writing";
const templates = {
  blog: { excerpt: "", intro: "", blocks: [{ type: "paragraph", html: "<p>Start with the moment, question, or idea that brought you here.</p>" }, { type: "heading", level: 2, text: "A closer look" }, { type: "paragraph", html: "<p>Develop the thought in your own words.</p>" }, { type: "takeaway", title: "Something to carry with you", html: "<p>What might be useful to remember?</p>" }] },
  education: { excerpt: "", intro: "", blocks: [{ type: "callout", tone: "question", title: "The question", html: "<p>What question does this lesson explore?</p>" }, { type: "heading", level: 2, text: "The idea" }, { type: "paragraph", html: "<p>Explain the concept in accessible language.</p>" }, { type: "evidence", strength: "Evidence note", title: "Research and uncertainty", html: "<p>What is supported, and what remains uncertain?</p>" }, { type: "reflection", text: "", prompt: "How could this idea appear in everyday life?" }, { type: "heading", level: 2, text: "Sources and further reading" }] },
  video: { excerpt: "", intro: "", blocks: [{ type: "youtube", url: "", title: "Watch the video" }, { type: "heading", level: 2, text: "Key ideas" }, { type: "paragraph", html: "<p>Add a synopsis or transcript notes.</p>" }, { type: "related", items: [] }] },
  resource: { excerpt: "", intro: "", blocks: [{ type: "paragraph", html: "<p>Describe this resource and who it may help.</p>" }, { type: "file", label: "Download the resource", src: "" }] },
  lesson: { excerpt: "", intro: "", blocks: [{ type: "heading", level: 2, text: "Learning objective" }, { type: "paragraph", html: "<p>What should someone be able to understand or try?</p>" }, { type: "heading", level: 2, text: "Explore" }, { type: "tool", route: "#compass", title: "Emotion compass" }] },
  announcement: { excerpt: "", intro: "", blocks: [{ type: "paragraph", html: "<p>Share the update and what people need to know.</p>" }, { type: "cta", eyebrow: "Next step", title: "Find out more", text: "", button: "Explore", href: "#community" }] },
  download: { excerpt: "", intro: "", blocks: [{ type: "paragraph", html: "<p>Describe the downloadable material.</p>" }, { type: "file", label: "Download file", src: "" }] },
};

let publisher = null;
let githubUser = null;
let posts = [];
let repoAssets = [];
let current = null;
let previous = null;
let uploads = [];
let busy = false;
let dirty = false;
let selectedIndex = -1;
let autoSaveTimer = 0;
let lastVersionAt = 0;
let localDrafts = [];
let savedVersions = [];
let publishedHistory = [];
let snippets = [];
let userTemplates = [];
let currentView = "dashboard";
let assetIntent = null;
let stagedSelection = null;
let currentUndo = [];
let currentUndoIndex = -1;
let dbPromise = null;

const openDB = () => {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open("nobodyssimple-creator", 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      for (const name of ["drafts", "versions", "snippets", "notes", "templates"]) {
        if (!db.objectStoreNames.contains(name)) db.createObjectStore(name, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error("Browser draft storage is unavailable."));
  });
  return dbPromise;
};
function dbRequest(name, mode, action) {
  return openDB().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(name, mode);
    const store = tx.objectStore(name);
    let request;
    try { request = action(store); } catch (error) { reject(error); return; }
    if (request) {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    } else {
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    }
  }));
}
const dbGet = (name, id) => dbRequest(name, "readonly", (store) => store.get(id));
const dbAll = (name) => dbRequest(name, "readonly", (store) => store.getAll());
const dbPut = (name, value) => dbRequest(name, "readwrite", (store) => store.put(value));
const dbDelete = (name, id) => dbRequest(name, "readwrite", (store) => store.delete(id));

function toast(message, error = false) {
  const node = $("toast");
  node.textContent = message;
  node.classList.toggle("error", error);
  node.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { node.hidden = true; }, 3200);
}
function setSaveState(message, state = "saved") {
  const node = $("save-status");
  node.textContent = message;
  node.dataset.state = state;
}
function setDeploy(message) { $("deploy-status").textContent = message; }
function deepCopy(value) { return JSON.parse(JSON.stringify(value)); }
function freshBlock(type) {
  const id = makeId();
  const map = {
    paragraph: { html: "<p>Write something…</p>" }, heading: { level: 2, text: "New section" }, quote: { html: "<p>Add a quote.</p>", attribution: "" }, pullquote: { html: "A thought worth holding onto.", attribution: "" }, list: { ordered: false, items: ["First item", "Second item"] }, checklist: { items: [{ text: "First item", checked: false }, { text: "Second item", checked: false }] }, callout: { tone: "idea", title: "A useful thought", html: "<p>Write a short callout.</p>" }, footnote: { number: "1", text: "Add a note." }, code: { text: "" }, definition: { term: "Term", text: "Definition" }, image: { src: "", alt: "", caption: "", credit: "", href: "", radius: "soft", ratio: "auto", focalX: 50, focalY: 50, rotate: 0 }, gallery: { items: [] }, carousel: { items: [] }, youtube: { url: "", title: "YouTube video" }, embed: { url: "", title: "Embedded form or media" }, audio: { src: "", title: "Audio" }, file: { src: "", label: "Download resource" }, divider: {}, spacer: { height: 48 }, columns: { columns: [[{ type: "paragraph", html: "<p>First column…</p>" }], [{ type: "paragraph", html: "<p>Second column…</p>" }]] }, table: { headerRow: true, striped: true, rows: [["Heading 1", "Heading 2"], ["Cell", "Cell"]] }, tabs: { items: [{ title: "Tab one", html: "<p>Content…</p>" }, { title: "Tab two", html: "<p>Content…</p>" }] }, accordion: { items: [{ title: "Open this section", html: "<p>Content…</p>" }] }, "card-grid": { items: [{ title: "Explore next", text: "Add a description", href: "#tools", image: "", alt: "" }] }, tool: { route: "#compass", title: "Emotion compass", text: "Move through energy and pleasantness to find words for a feeling.", button: "Open the compass" }, evidence: { strength: "Interpretive", title: "Research and uncertainty", html: "<p>Describe the evidence and its limits.</p>", source: "" }, takeaway: { title: "Key takeaway", html: "<p>Write one useful idea to remember.</p>" }, reflection: { text: "", prompt: "What would you like to notice?" }, warning: { text: "" }, glossary: { term: "Term", text: "Definition" }, button: { eyebrow: "Explore next", title: "Take a next step", text: "", button: "Explore", href: "#tools" }, cta: { eyebrow: "Explore next", title: "Take a next step", text: "", button: "Explore", href: "#tools" }, related: { items: [] }, citation: { author: "", year: "", title: "", publication: "", doi: "", url: "" },
  };
  map.toc = { title: "On this page", maxLevel: 3 };
  return { id, type, ...(map[type] || {}) };
}
function blockLabel(type) { return allBlockDefs.find((item) => item[0] === type)?.[1] || type; }
function eInput(prop, value, placeholder = "", type = "text") { return `<input class="block-input" data-prop="${prop}" type="${type}" value="${esc(value || "")}" placeholder="${esc(placeholder)}">`; }
function eTextarea(prop, value, placeholder = "", rows = 3) { return `<textarea class="block-input" data-prop="${prop}" rows="${rows}" placeholder="${esc(placeholder)}">${esc(value || "")}</textarea>`; }
function richEditor(prop, value, placeholder) { return `<div class="rich-editor" contenteditable="true" role="textbox" aria-multiline="true" data-prop="${prop}" data-placeholder="${esc(placeholder || "Start writing…")}">${sanitizeRichHTML(value || "")}</div>`; }
function buttonMini(action, label) { return `<button class="mini-button" type="button" data-block-action="${action}">${label}</button>`; }
function mediaPreview(path, alt = "") {
  const local = uploads.find((asset) => asset.path === path);
  return safeImage(path) ? `<img class="block-media-preview" src="${local ? `data:${local.mime};base64,${local.base64}` : esc(path || "")}" alt="${esc(alt)}">` : `<div class="block-media-empty">No image selected</div>`;
}
function renderBlockEditor(block, index) {
  const d = block;
  let body = "";
  switch (d.type) {
    case "paragraph": body = richEditor("html", d.html || "", "Write your article text…"); break;
    case "heading": body = `<div class="block-editor-row"><select class="block-input" data-prop="level">${[2,3,4,5,6].map((n) => `<option value="${n}" ${Number(d.level || 2) === n ? "selected" : ""}>Heading ${n}</option>`).join("")}</select>${eInput("text", d.text, "Section heading")}</div>`; break;
    case "toc": body = `${eInput("title", d.title, "Table heading")}<label class="block-help">Include through <select data-prop="maxLevel">${[2,3,4,5,6].map((n) => `<option value="${n}" ${Number(d.maxLevel || 3) === n ? "selected" : ""}>Heading ${n}</option>`).join("")}</select></label><p class="block-help">The public page builds a navigable outline from your headings.</p>`; break;
    case "quote": body = richEditor("html", d.html || "", "Quote text…") + eInput("attribution", d.attribution, "Person or source"); break;
    case "pullquote": body = richEditor("html", d.html || "", "Pull quote…") + eInput("attribution", d.attribution, "Attribution"); break;
    case "list": body = `<div class="block-editor-row"><label class="block-help">List style <select data-prop="ordered"><option value="false" ${!d.ordered ? "selected" : ""}>Bullets</option><option value="true" ${d.ordered ? "selected" : ""}>Numbers</option></select></label>${buttonMini("add-list-item", "＋ Item")}</div>${eTextarea("items", (d.items || []).map((item) => typeof item === "object" ? item.text : item).join("\n"), "One list item per line", Math.min(8, Math.max(3, (d.items || []).length)))}`; break;
    case "checklist": body = `<div class="block-help">One checklist item per line. Use [x] at the start for a checked item.</div>${eTextarea("items", (d.items || []).map((item) => `${item.checked ? "[x] " : "[ ] "}${item.text}`).join("\n"), "One item per line", 4)}`; break;
    case "callout": body = `<div class="block-editor-row"><select class="block-input" data-prop="tone">${["idea","important","research","reflection","warning","example","question"].map((tone) => `<option ${d.tone === tone ? "selected" : ""}>${tone}</option>`).join("")}</select>${eInput("title", d.title, "Optional title")}</div>${richEditor("html", d.html || "", "Callout text…")}`; break;
    case "footnote": body = `<div class="block-editor-row">${eInput("number", d.number, "1")}${eInput("text", d.text, "Footnote text")}</div>`; break;
    case "code": body = eTextarea("text", d.text, "Code or preformatted text", 5); break;
    case "definition": case "glossary": body = eInput("term", d.term, "Term") + eTextarea("text", d.text, "Definition", 2); break;
    case "image": body = `${mediaPreview(d.src, d.alt)}<div class="block-editor-row">${buttonMini("choose-media", d.src ? "Replace image" : "Choose image")}${eInput("caption", d.caption, "Caption")}</div><div class="block-editor-row">${eInput("alt", d.alt, "Image description (alt text)")}${eInput("credit", d.credit, "Credit / source")}</div><div class="block-editor-row"><label class="block-help">Crop<select data-prop="ratio"><option value="auto" ${!d.ratio || d.ratio === "auto" ? "selected" : ""}>Original</option><option value="16:9" ${d.ratio === "16:9" ? "selected" : ""}>16:9</option><option value="4:3" ${d.ratio === "4:3" ? "selected" : ""}>4:3</option><option value="1:1" ${d.ratio === "1:1" ? "selected" : ""}>Square</option></select></label><label class="block-help">Corners<select data-prop="radius"><option value="square">Square</option><option value="soft" ${d.radius === "soft" ? "selected" : ""}>Soft</option><option value="round" ${d.radius === "round" ? "selected" : ""}>Round</option></select></label><label class="block-help">Rotate<select data-prop="rotate">${[0,90,180,270].map((n) => `<option value="${n}" ${Number(d.rotate || 0) === n ? "selected" : ""}>${n}°</option>`).join("")}</select></label></div><div class="block-editor-row"><label class="block-help">Horizontal crop <input data-prop="focalX" type="range" min="0" max="100" value="${Number(d.focalX ?? 50)}"></label><label class="block-help">Vertical crop <input data-prop="focalY" type="range" min="0" max="100" value="${Number(d.focalY ?? 50)}"></label></div><div class="block-editor-row"><label class="block-help"><input data-prop="decorative" type="checkbox" ${d.decorative ? "checked" : ""}> Decorative image, no alt text</label><label class="block-help"><input data-prop="lightbox" type="checkbox" ${d.lightbox ? "checked" : ""}> Open full image in a new tab</label><label class="block-help"><input data-prop="border" type="checkbox" ${d.border ? "checked" : ""}> Add a border</label></div>${eInput("href", d.href, "Optional image link")}`; break;
    case "gallery": case "carousel": body = `<div class="block-help">Choose a picture for the selected image slot. Add more images with the media library.</div>${(d.items || []).map((item, i) => `<div class="gallery-edit-row"><img src="${esc(assetUrl(item.src || ""))}" alt="${esc(item.alt || "")}"><input data-gallery="${i}" data-gallery-prop="caption" value="${esc(item.caption || "")}" placeholder="Caption"><input data-gallery="${i}" data-gallery-prop="alt" value="${esc(item.alt || "")}" placeholder="Alt text"><button class="mini-button" type="button" data-gallery-remove="${i}">×</button></div>`).join("")}${buttonMini("gallery-add", "＋ Add an image")}`; break;
    case "youtube": body = eInput("url", d.url, "Paste a YouTube video link", "url") + eInput("title", d.title, "Accessible video title") + `<p class="block-help">The player is privacy-enhanced and loads from YouTube after a visitor opens the post.</p>`; break;
    case "embed": body = eInput("url", d.url, "Paste an HTTPS embed or Forms URL", "url") + eInput("title", d.title, "Accessible embed title") + `<p class="block-help">For safety, embeds are limited to Google Forms, Microsoft Forms, Spotify, SoundCloud, Vimeo, and Flourish. Google Forms can take a few seconds to load.</p>${d.url && !safeEmbedURL(d.url) ? `<p class="block-help">This host is not on the approved embed list.</p>` : ""}`; break;
    case "audio": body = `<div class="block-editor-row">${eInput("title", d.title, "Audio title")}${buttonMini("choose-media", d.src ? "Replace audio" : "Choose audio file")}</div>${d.src ? `<audio controls src="${esc(uploads.find((x) => x.path === d.src) ? `data:${uploads.find((x) => x.path === d.src).mime};base64,${uploads.find((x) => x.path === d.src).base64}` : d.src)}"></audio>` : `<div class="block-media-empty">No audio file selected</div>`}<p class="block-help">Upload MP3, M4A, OGG or WAV. Video should be embedded from YouTube.</p>`; break;
    case "file": body = `<div class="block-editor-row">${eInput("label", d.label, "Download link text")}${buttonMini("choose-media", d.src ? "Replace PDF" : "Choose PDF")}</div><p class="block-help">${esc(d.src || "No PDF selected")}</p>`; break;
    case "divider": body = `<p class="block-help">A visual section divider will appear here.</p>`; break;
    case "spacer": body = `<label class="block-help">Height in pixels <input data-prop="height" type="range" min="12" max="180" step="4" value="${Number(d.height || 48)}"></label>`; break;
    case "columns": body = `<div class="block-editor-row"><label class="block-help">Number of columns <select data-prop="columnCount"><option value="2">Two</option><option value="3" ${d.columns?.length === 3 ? "selected" : ""}>Three</option></select></label>${(d.columns?.length || 2) === 2 ? `<label class="block-help">Column balance <select data-prop="columnLayout"><option value="equal" ${!d.columnLayout || d.columnLayout === "equal" ? "selected" : ""}>50 / 50</option><option value="first-wide" ${d.columnLayout === "first-wide" ? "selected" : ""}>⅔ / ⅓</option><option value="second-wide" ${d.columnLayout === "second-wide" ? "selected" : ""}>⅓ / ⅔</option></select></label>` : ""}<p class="block-help">Add text or media blocks inside each column using the + buttons below.</p></div>${(d.columns || []).map((column, i) => `<div class="column-edit"><strong>Column ${i + 1}</strong>${column.map((child) => `<div>${richEditor(`column-${i}`, child.html || "", "Column content…")}</div>`).join("")}</div>`).join("")}`; break;
    case "table": body = `<div class="table-editor-wrap"><table class="table-editor"><tbody>${(d.rows || []).map((row, ri) => `<tr>${(row || []).map((cell, ci) => `<td><input data-cell-row="${ri}" data-cell-col="${ci}" value="${esc(cell)}" aria-label="Row ${ri + 1} column ${ci + 1}"></td>`).join("")}<td><button class="mini-button" type="button" data-row-remove="${ri}">×</button></td></tr>`).join("")}</tbody></table></div><div class="block-editor-row"><label class="block-help"><input data-prop="headerRow" type="checkbox" ${d.headerRow ? "checked" : ""}> First row is a header</label><label class="block-help"><input data-prop="striped" type="checkbox" ${d.striped ? "checked" : ""}> Alternate row tint</label>${buttonMini("table-row", "＋ Row")}${buttonMini("table-col", "＋ Column")}${buttonMini("table-col-remove", "− Column")}</div>`; break;
    case "tabs": case "accordion": body = `${(d.items || []).map((item, i) => `<div class="item-edit-row"><strong>Section ${i + 1}</strong>${eInput(`item-title-${i}`, item.title, "Section title")}${richEditor(`item-html-${i}`, item.html, "Section content…")}</div>`).join("")}${buttonMini("section-add", "＋ Section")}`; break;
    case "card-grid": body = `${(d.items || []).map((item, i) => `<div class="item-edit-row"><strong>Card ${i + 1}</strong>${eInput(`card-title-${i}`, item.title, "Title")}${eInput(`card-text-${i}`, item.text, "Description")}${eInput(`card-href-${i}`, item.href, "Page or URL")}</div>`).join("")}${buttonMini("card-add", "＋ Card")}`; break;
    case "tool": body = `<div class="block-editor-row"><select class="block-input" data-prop="route">${[["#compass","Emotion compass"],["#questions","Emotion to action"],["#navigator","Help me figure out what I need"],["#tools","Interactive tools"],["#simplyfocus","SimplyFocus"],["#library","Learning library"]].map(([route,label]) => `<option value="${route}" ${d.route === route ? "selected" : ""}>${label}</option>`).join("")}</select>${eInput("button", d.button, "Button label")}</div>${eInput("title", d.title, "Tool title")}${eTextarea("text", d.text, "Short introduction", 2)}<p class="block-help">The website shows a live preview with a link to open the tool.</p>`; break;
    case "evidence": body = `<div class="block-editor-row"><select data-prop="strength">${["Strong evidence","Moderate evidence","Emerging","Theoretical","Interpretive","Evidence note"].map((x) => `<option ${d.strength === x ? "selected" : ""}>${x}</option>`).join("")}</select>${eInput("title", d.title, "Optional heading")}</div>${richEditor("html", d.html, "Explain the claim, evidence, and limits…")}${eInput("source", d.source, "Short source label")}`; break;
    case "takeaway": body = eInput("title", d.title, "Optional heading") + richEditor("html", d.html, "Write one useful takeaway…"); break;
    case "reflection": body = eTextarea("text", d.text, "Short introduction", 2) + eTextarea("prompt", d.prompt, "Reflection question", 2); break;
    case "warning": body = eTextarea("text", d.text, "Content note for readers", 2); break;
    case "button": case "cta": body = `<div class="block-editor-row">${eInput("eyebrow", d.eyebrow, "Label")}${eInput("button", d.button, "Button text")}</div>${eInput("title", d.title, "Heading")}${eTextarea("text", d.text, "Description", 2)}${eInput("href", d.href, "Internal route or external URL")}`; break;
    case "related": body = `<p class="block-help">Select content already published on this site.</p>${(d.items || []).map((item, i) => `<div class="block-editor-row"><select data-related="${i}"><option value="">Choose content…</option>${posts.map((post) => `<option value="${esc(post.id)}" ${post.id === item.id ? "selected" : ""}>${esc(post.title)}</option>`).join("")}</select><button class="mini-button" type="button" data-related-remove="${i}">×</button></div>`).join("")}${buttonMini("related-add", "＋ Content link")}`; break;
    case "citation": body = `<div class="block-editor-row">${eInput("author", d.author, "Author(s)")}${eInput("year", d.year, "Year")}</div>${eInput("title", d.title, "Article or book title")}${eInput("publication", d.publication, "Journal or publisher")}<div class="block-editor-row">${eInput("doi", d.doi, "DOI")}${eInput("url", d.url, "Source URL", "url")}</div>`; break;
    default: body = `<p class="block-help">This block is not editable in this console.</p>`;
  }
  return `<article class="editor-block${index === selectedIndex ? " selected-block" : ""}" data-index="${index}" draggable="true"><header class="block-head"><span class="drag-handle" title="Drag to reorder" aria-label="Drag to reorder">⠿</span><span class="block-kind">${esc(blockLabel(d.type))}</span><span class="block-head-spacer"></span><button type="button" data-block-action="collapse" title="Collapse block">⌄</button><button type="button" data-block-action="duplicate" title="Duplicate block">⧉</button><button type="button" data-block-action="move-up" title="Move up">↑</button><button type="button" data-block-action="move-down" title="Move down">↓</button><button type="button" data-block-action="delete" title="Delete block">×</button></header><div class="block-content">${body}</div></article>`;
}

function renderBlocksEditor() {
  $("block-list").innerHTML = (current?.blocks || []).map(renderBlockEditor).join("");
  updateOutline();
  updateBlockInspector();
  updateStats();
  updateLivePreview();
}
function createPost(type = "blog", existing = null) {
  const template = deepCopy(templates[type] || templates.blog);
  const p = existing ? deepCopy(existing) : {
    id: makeId(), type, title: "", excerpt: template.excerpt, intro: template.intro,
    body: "", blocks: template.blocks.map((block) => ({ id: makeId(), ...block })), youtube: "",
    topics: [], category: "", modules: [], weeks: [], thumbnail: "", thumbnailAlt: "",
    destinations: [type === "blog" ? "blog" : "library"], status: "draft", author: "Drew Horrobin",
    createdAt: now(), updatedAt: now(), publishedAt: "", slug: "", seoTitle: "", seoDescription: "", socialImage: "", theme: "cream", hero: "standard",
  };
  if (!Array.isArray(p.blocks) || !p.blocks.length) {
    p.blocks = legacyBodyToBlocks(p.body || "");
    if (p.type === "video" && p.youtube && !p.blocks.some((block) => block.type === "youtube")) p.blocks.unshift({ id: makeId(), type: "youtube", url: p.youtube, title: "Watch the video" });
  }
  p.topics = Array.isArray(p.topics) ? p.topics : [];
  p.modules = Array.isArray(p.modules) ? p.modules : [];
  p.weeks = Array.isArray(p.weeks) ? p.weeks : [];
  p.author ||= "Drew Horrobin";
  p.category ||= "";
  p.excerpt ||= "";
  p.intro ||= "";
  p.thumbnail ||= "";
  p.thumbnailAlt ||= "";
  p.youtube ||= "";
  p.destinations ||= [p.type === "blog" ? "blog" : "library"];
  p.layout ||= "standard";
  return p;
}
function legacyBodyToBlocks(body) {
  return String(body || "").split(/\n\s*\n/).map((piece) => {
    const text = piece.trim();
    if (!text) return null;
    const heading = text.match(/^#{1,6}\s+(.+)$/);
    if (heading) return { id: makeId(), type: "heading", level: 2, text: heading[1] };
    const image = text.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image && safeImage(image[2])) return { id: makeId(), type: "image", src: image[2], alt: image[1], caption: image[1], radius: "soft" };
    if (/^>\s/m.test(text)) return { id: makeId(), type: "quote", html: `<p>${esc(text.replace(/^>\s?/gm, "").replace(/\n/g, "<br>"))}</p>`, attribution: "" };
    const lines = text.split("\n");
    if (lines.every((line) => /^\s*(?:[-*+]\s|\d+\.\s)/.test(line))) return { id: makeId(), type: "list", ordered: /^\s*\d+\./.test(lines[0]), items: lines.map((line) => line.replace(/^\s*(?:[-*+]\s|\d+\.\s)/, "")) };
    return { id: makeId(), type: "paragraph", html: `<p>${esc(text).replace(/\n/g, "<br>")}</p>` };
  }).filter(Boolean);
}

async function setView(view) {
  if (currentView === "editor" && dirty) await persistDraft();
  if (view === "media") assetIntent = null;
  currentView = view;
  $("dashboard-view").hidden = view !== "dashboard";
  $("media-view").hidden = view !== "media";
  $("templates-view").hidden = view !== "templates";
  $("editor-view").hidden = view !== "editor";
  document.querySelectorAll(".rail-button[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  if (view === "dashboard") renderDashboard();
  if (view === "media") renderMediaLibrary();
  if (view === "templates") renderTemplates();
}

async function refreshLocal() {
  try {
    [localDrafts, snippets, userTemplates] = await Promise.all([dbAll("drafts"), dbAll("snippets"), dbAll("templates")]);
    localDrafts.sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
    renderBlockMenuWithSnippets();
  } catch {
    toast("Browser storage is unavailable. Export a backup before leaving this page.", true);
    localDrafts = [];
  }
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? "—" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function allTopicValues() { return [...new Set(posts.flatMap((post) => post.topics || []))].sort((a, b) => a.localeCompare(b)); }
function renderDashboard() {
  const query = $("dash-search").value.trim().toLowerCase();
  const statusFilter = $("dash-status").value;
  const typeFilter = $("dash-type").value;
  const local = localDrafts.map((record) => ({ ...record.post, _kind: record.post.status === "archived" ? "archived" : "draft", _draft: record }));
  const remote = posts.map((post) => ({ ...post, _kind: post.status === "archived" ? "archived" : post.status === "published" ? "published" : "archived" }));
  let entries = [...local, ...remote];
  if (statusFilter !== "all") entries = entries.filter((post) => post._kind === statusFilter);
  if (typeFilter !== "all") entries = entries.filter((post) => post.type === typeFilter);
  if (query) entries = entries.filter((post) => [post.title, post.excerpt, ...(post.topics || []), post.category].join(" ").toLowerCase().includes(query));
  $("dash-list").innerHTML = entries.map((post) => {
    const stateText = post._kind === "draft" ? "Local draft" : post._kind === "published" ? "Published" : "Archived";
    const actions = post._kind === "draft"
      ? `<button class="chip" data-action="resume" data-id="${esc(post.id)}">Resume</button><button class="chip" data-action="duplicate" data-id="${esc(post.id)}">Duplicate</button><button class="chip danger-chip" data-action="discard" data-id="${esc(post.id)}">Delete draft</button>`
      : post._kind === "archived" && post._draft
        ? `<button class="chip" data-action="resume-archived" data-id="${esc(post.id)}">Edit</button><button class="chip" data-action="restore-local" data-id="${esc(post.id)}">Restore</button><button class="chip danger-chip" data-action="discard" data-id="${esc(post.id)}">Delete draft</button>`
      : post._kind === "published"
        ? `<button class="chip" data-action="edit" data-id="${esc(post.id)}">Edit</button><button class="chip" data-action="duplicate-remote" data-id="${esc(post.id)}">Duplicate</button><button class="chip" data-action="archive" data-id="${esc(post.id)}">Archive</button>`
        : `<button class="chip" data-action="edit" data-id="${esc(post.id)}">Edit</button><button class="chip" data-action="publish-archived" data-id="${esc(post.id)}">Restore</button><button class="chip danger-chip" data-action="delete" data-id="${esc(post.id)}">Delete</button>`;
    return `<tr><td><input type="checkbox" data-select-id="${esc(post.id)}" data-select-kind="${post._kind}" aria-label="Select ${esc(post.title || "untitled")}"></td><td><strong>${esc(post.title || "Untitled")}</strong><div class="table-subline">${esc((post.topics || []).slice(0, 3).join(" · "))}</div></td><td>${esc(topicName(post.type))}</td><td><span class="status-pill ${post._kind === "draft" ? "local" : post._kind}">${stateText}</span></td><td>${formatDate(post.updatedAt || post.savedAt)}</td><td><div class="row-actions">${actions}</div></td></tr>`;
  }).join("");
  $("dash-empty").hidden = entries.length > 0;
  $("select-all").checked = false;
  updateBulkBar();
}

function syncModelFromFields() {
  if (!current) return;
  current.title = $("doc-title").value.trim();
  current.excerpt = $("doc-excerpt").value.trim();
  current.intro = $("doc-intro").value.trim();
  current.type = $("meta-type").value;
  current.category = $("meta-category").value.trim();
  current.author = $("meta-author").value.trim();
  current.slug = $("meta-slug").value.trim();
  current.seoTitle = $("seo-title").value.trim();
  current.seoDescription = $("seo-description").value.trim();
  current.socialImage = $("social-image").value.trim();
  current.thumbnailAlt = $("thumb-alt").value.trim();
  current.thumbnailRatio = $("thumb-ratio").value;
  current.thumbnailFocalX = Number($("thumb-focus-x").value);
  current.thumbnailFocalY = Number($("thumb-focus-y").value);
  current.thumbnailRotate = Number($("thumb-rotate").value);
  current.youtube = $("youtube-url").value.trim();
  current.theme = $("page-theme").value;
  current.hero = $("hero-style").value;
  current.modules = [...document.querySelectorAll("[name=module-check]:checked")].map((input) => +input.value);
  current.weeks = [...document.querySelectorAll("[name=week-check]:checked")].map((input) => +input.value);
  if (current.type === "blog") { current.modules = []; current.weeks = []; }
  current.destinations = [current.type === "blog" ? "blog" : "library"];
  current.blocks ||= [];
  const embeddedVideo = current.blocks.find((block) => block.type === "youtube");
  if (current.type === "video") {
    if (embeddedVideo && !embeddedVideo.url && current.youtube) embeddedVideo.url = current.youtube;
    if (embeddedVideo?.url) current.youtube = embeddedVideo.url;
  }
  current.body = extractPlainBody(current.blocks);
  current.layout = current.layout || "standard";
  current.updatedAt = now();
}
function extractPlainBody(blocks) {
  return (blocks || []).map((b) => {
    if (b.type === "paragraph" || ["quote", "callout", "takeaway", "evidence"].includes(b.type)) return (b.html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (b.type === "heading" || b.type === "reflection" || b.type === "warning" || b.type === "code") return b.text || "";
    if (b.type === "list" || b.type === "checklist") return (b.items || []).map((item) => item.text || item).join("\n");
    return "";
  }).filter(Boolean).join("\n\n");
}

function fillInspector() {
  $("meta-type").value = current.type;
  $("meta-category").value = current.category || "";
  $("meta-author").value = current.author || "";
  $("meta-slug").value = current.slug || slugify(current.title || "");
  $("seo-title").value = current.seoTitle || "";
  $("seo-description").value = current.seoDescription || "";
  $("social-image").value = current.socialImage || "";
  $("thumb-alt").value = current.thumbnailAlt || "";
  $("thumb-ratio").value = current.thumbnailRatio || "auto";
  $("thumb-focus-x").value = String(current.thumbnailFocalX ?? 50);
  $("thumb-focus-y").value = String(current.thumbnailFocalY ?? 50);
  $("thumb-rotate").value = String([0,90,180,270].includes(Number(current.thumbnailRotate)) ? current.thumbnailRotate : 0);
  $("youtube-url").value = current.youtube || "";
  $("page-theme").value = current.theme || "cream";
  $("hero-style").value = current.hero || "standard";
  const layout = ["narrow", "standard", "wide"].includes(current.layout) ? current.layout : "standard";
  $("editor-grid").classList.remove("page-narrow", "page-standard", "page-wide");
  $("editor-grid").classList.add(`page-${layout}`);
  document.querySelectorAll("[data-page-width]").forEach((button) => button.classList.toggle("selected", button.dataset.pageWidth === layout));
  $("video-settings").hidden = current.type !== "video";
  $("type-pill").textContent = topicName(current.type);
  $("document-slug-display").textContent = current.slug ? `Label · ${current.slug}` : "";
  $("thumb-preview").hidden = !current.thumbnail;
  $("thumb-empty").hidden = !!current.thumbnail;
  if (current.thumbnail) $("thumb-preview").src = assetUrl(current.thumbnail);
  updateThumbPreview();
  const weeksByModule = new Map();
  for (const week of curriculum.weeks) {
    const key = week.module || 0;
    if (!weeksByModule.has(key)) weeksByModule.set(key, []);
    weeksByModule.get(key).push(week);
  }
  $("curriculum-fields").innerHTML = `<div class="curriculum-group"><strong>Modules</strong>${curriculum.modules.map((module) => `<label><input type="checkbox" name="module-check" value="${module.id}" ${current.modules?.includes(module.id) ? "checked" : ""}>${module.id}. ${esc(module.title)}</label>`).join("")}</div><div class="curriculum-group"><strong>Lessons / weeks</strong>${curriculum.weeks.map((week) => `<label><input type="checkbox" name="week-check" value="${week.id}" ${current.weeks?.includes(week.id) ? "checked" : ""}>${week.id}. ${esc(week.title)}</label>`).join("")}</div>`;
  renderTopicChips();
  updateSearchPreview();
  document.querySelectorAll("[name=module-check],[name=week-check]").forEach((input) => input.onchange = () => { syncModelFromFields(); markDirty(); });
}
function updateBlockInspector() {
  const block = current?.blocks?.[selectedIndex];
  const controls = ["block-align", "block-width", "block-line", "block-spacing", "block-tone"];
  for (const id of controls) $(id).disabled = !block;
  $("block-align").value = block?.align || "left";
  $("block-width").value = block?.width || "standard";
  $("block-line").value = block?.lineHeight || "";
  $("block-spacing").value = block?.letterSpacing ?? "";
  $("block-tone").value = block?.textTone || "";
}
function slugify(value) { return String(value || "").toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70); }
function renderTopicChips() {
  $("topic-chips").innerHTML = (current?.topics || []).map((topic) => `<button class="topic-chip" type="button" data-remove-topic="${esc(topic)}">${esc(topic)} ×</button>`).join("");
  const query = $("meta-topics").value.trim().toLowerCase();
  const options = allTopicValues().filter((topic) => !current.topics.includes(topic) && (!query || topic.toLowerCase().includes(query))).slice(0, 7);
  $("topic-suggestions").innerHTML = options.map((topic) => `<button type="button" data-add-topic="${esc(topic)}">${esc(topic)}</button>`).join("");
  $("topic-suggestions").hidden = !query || options.length === 0;
}
function updateSearchPreview() {
  $("search-preview-title").textContent = current?.seoTitle || current?.title || "Title";
  $("search-preview-description").textContent = current?.seoDescription || current?.excerpt || "Add a short description.";
}
function assetUrl(path) {
  const upload = uploads.find((file) => file.path === path);
  return upload ? `data:${upload.mime};base64,${upload.base64}` : safeAsset(path) ? path : "";
}
function thumbnailStyle(post) {
  const ratio = { "16:9": "16 / 9", "4:3": "4 / 3", "1:1": "1 / 1" }[post.thumbnailRatio] || "auto";
  const x = Math.max(0, Math.min(100, Number(post.thumbnailFocalX ?? 50)));
  const y = Math.max(0, Math.min(100, Number(post.thumbnailFocalY ?? 50)));
  const rotate = [0,90,180,270].includes(Number(post.thumbnailRotate)) ? Number(post.thumbnailRotate) : 0;
  return `style="object-fit:cover;aspect-ratio:${ratio};object-position:${x}% ${y}%;transform:rotate(${rotate}deg)"`;
}

function openEditor(post = null, type = "blog", opts = {}) {
  if (busy) return;
  previous = opts.previous ? deepCopy(opts.previous) : post && posts.find((item) => item.id === post.id) ? deepCopy(posts.find((item) => item.id === post.id)) : null;
  current = createPost(type, post);
  $("meta-slug").dataset.edited = "";
  uploads = opts.uploads ? deepCopy(opts.uploads) : [];
  selectedIndex = current.blocks.length ? 0 : -1;
  currentView = "editor";
  $("doc-title").value = current.title || "";
  $("doc-excerpt").value = current.excerpt || "";
  $("doc-intro").value = current.intro || "";
  fillInspector();
  renderBlocksEditor();
  savedVersions = [];
  lastVersionAt = 0;
  void loadVersions();
  void loadNote();
  currentUndo = [JSON.stringify(current)];
  currentUndoIndex = 0;
  dirty = !!opts.fromDraft;
  $("publish").hidden = false;
  $("unpublish").hidden = !(previous && previous.status === "published");
  $("delete-content").hidden = !previous;
  $("dashboard-view").hidden = true;
  $("media-view").hidden = true;
  $("templates-view").hidden = true;
  $("editor-view").hidden = false;
  document.querySelectorAll(".rail-button[data-view]").forEach((button) => button.classList.remove("active"));
  setSaveState(opts.fromDraft ? "Recovered local draft" : "Ready to edit");
  setDeploy(previous?.status === "published" ? "Editing a published piece. Your changes stay on this device until you publish." : "Unpublished changes stay local until you publish.");
}

function markDirty({ render = false, checkpoint = false } = {}) {
  if (!current) return;
  dirty = true;
  syncModelFromFields();
  setSaveState("Saving…", "saving");
  if (render) renderBlocksEditor();
  updateSearchPreview();
  updateThumbPreview();
  runQuality(false);
  scheduleAutosave();
  if (checkpoint) pushUndoState();
}
function pushUndoState() {
  if (!current) return;
  const value = JSON.stringify(current);
  if (currentUndo[currentUndoIndex] === value) return;
  currentUndo = currentUndo.slice(0, currentUndoIndex + 1);
  currentUndo.push(value);
  if (currentUndo.length > 40) currentUndo.shift();
  currentUndoIndex = currentUndo.length - 1;
}
function applyEditorUndo(direction) {
  const next = direction === "undo" ? currentUndoIndex - 1 : currentUndoIndex + 1;
  if (next < 0 || next >= currentUndo.length) return;
  currentUndoIndex = next;
  current = JSON.parse(currentUndo[next]);
  $("doc-title").value = current.title || "";
  $("doc-excerpt").value = current.excerpt || "";
  $("doc-intro").value = current.intro || "";
  fillInspector();
  renderBlocksEditor();
  markDirty();
}

async function persistDraft() {
  if (!current || currentView !== "editor") return;
  syncModelFromFields();
  const record = { id: current.id, post: deepCopy(current), previous: previous ? deepCopy(previous) : null, uploads: deepCopy(uploads), savedAt: now() };
  try {
    await dbPut("drafts", record);
    dirty = false;
    setSaveState(`Saved in this browser · ${new Date(record.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
    if (Date.now() - lastVersionAt > 30_000) await saveVersion(false);
  } catch {
    dirty = true;
    setSaveState("Could not save · export a backup", "error");
  }
  await refreshLocal();
}
function scheduleAutosave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => void persistDraft(), 700);
}
async function saveVersion(manual = true) {
  if (!current) return;
  syncModelFromFields();
  const stamp = Date.now();
  const version = { id: `${current.id}:${stamp}`, postId: current.id, savedAt: now(), post: deepCopy(current), uploads: deepCopy(uploads), label: manual ? "Named checkpoint" : "Autosave checkpoint" };
  try {
    await dbPut("versions", version);
    const all = (await dbAll("versions")).filter((item) => item.postId === current.id).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    for (const old of all.slice(12)) await dbDelete("versions", old.id);
    lastVersionAt = stamp;
    await loadVersions();
    if (manual) toast("Version saved on this browser.");
  } catch {
    if (manual) toast("Could not save a version. Export a backup to keep a copy.", true);
  }
}
async function loadVersions() {
  if (!current) return;
  try {
    savedVersions = (await dbAll("versions")).filter((version) => version.postId === current.id).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    if (savedVersions[0]) lastVersionAt = new Date(savedVersions[0].savedAt).valueOf();
    $("version-list").innerHTML = savedVersions.slice(0, 5).map((version) => `<button type="button" data-restore-version="${esc(version.id)}">${new Date(version.savedAt).toLocaleString()} · ${esc(version.label)}</button>`).join("") || '<p class="fine">No saved versions yet.</p>';
  } catch { $("version-list").innerHTML = '<p class="fine">Local versions unavailable.</p>'; }
}
function downloadable(filename, value) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 2000);
}

function updateThumbPreview() {
  if (!current) return;
  $("thumb-preview").hidden = !current.thumbnail;
  $("thumb-empty").hidden = !!current.thumbnail;
  if (current.thumbnail) {
    const image = $("thumb-preview");
    image.src = assetUrl(current.thumbnail);
    const ratio = { "16:9": "16 / 9", "4:3": "4 / 3", "1:1": "1 / 1" }[current.thumbnailRatio] || "auto";
    image.style.aspectRatio = ratio;
    image.style.objectFit = "cover";
    image.style.objectPosition = `${Math.max(0, Math.min(100, Number(current.thumbnailFocalX ?? 50)))}% ${Math.max(0, Math.min(100, Number(current.thumbnailFocalY ?? 50)))}%`;
    image.style.transform = `rotate(${[0,90,180,270].includes(Number(current.thumbnailRotate)) ? Number(current.thumbnailRotate) : 0}deg)`;
  }
}
function updateOutline() {
  const heads = [...(current?.blocks || []).entries()].filter(([, block]) => block.type === "heading");
  $("outline-list").innerHTML = heads.length ? heads.map(([index, block]) => `<button type="button" class="depth-${Number(block.level) || 2}" data-outline-index="${index}">${esc(block.text || "Untitled heading")}</button>`).join("") : '<p class="fine">Add headings to build an outline.</p>';
}
function updateStats() {
  if (!current) return;
  const plain = `${current.title || ""} ${current.excerpt || ""} ${current.intro || ""} ${extractPlainBody(current.blocks)}`;
  const words = (plain.match(/[\p{L}\p{N}’'-]+/gu) || []).length;
  $("word-count").textContent = `${words.toLocaleString()} words`;
  $("reading-time").textContent = `${Math.max(1, Math.ceil(words / 220))} min read`;
  $("block-count").textContent = `${current.blocks?.length || 0} blocks`;
  $("image-count").textContent = `${countImages(current.blocks)} images`;
}
function countImages(blocks = []) { return blocks.reduce((count, block) => count + (block.type === "image" && block.src ? 1 : block.type === "gallery" || block.type === "carousel" ? block.items?.length || 0 : 0), 0); }
function updateLivePreview() {
  if (!current) return;
  syncModelFromFields();
  let bodyHTML = renderPostBody(current, posts);
  for (const file of uploads) bodyHTML = bodyHTML.replaceAll(`src="${esc(file.path)}"`, `src="data:${file.mime};base64,${file.base64}"`);
  $("live-preview-article").innerHTML = `<p class="eyebrow">${esc(topicName(current.type))}${current.topics?.length ? ` · ${esc(current.topics.join(" · "))}` : ""}</p><h1>${esc(current.title || "Untitled")}</h1><p class="lead">${esc(current.intro || current.excerpt || "")}</p>${current.thumbnail && safeImage(current.thumbnail) ? `<img class="full" src="${esc(assetUrl(current.thumbnail))}" alt="${esc(current.thumbnailAlt || "")}" ${thumbnailStyle(current)}>` : ""}<div class="article-body">${bodyHTML}</div>`;
}

function addBlock(type, after = selectedIndex) {
  const block = freshBlock(type);
  const next = Math.max(-1, Math.min(current.blocks.length - 1, after));
  current.blocks.splice(next + 1, 0, block);
  selectedIndex = next + 1;
  renderBlocksEditor();
  markDirty({ checkpoint: true });
  $("block-menu").hidden = true;
  requestAnimationFrame(() => {
    const node = document.querySelector(`.editor-block[data-index="${selectedIndex}"]`);
    node?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    node?.querySelector("[contenteditable=true],input,textarea")?.focus();
  });
}
function reorderBlock(from, to) {
  if (from === to || from < 0 || to < 0 || from >= current.blocks.length || to >= current.blocks.length) return;
  const [item] = current.blocks.splice(from, 1);
  current.blocks.splice(to, 0, item);
  selectedIndex = to;
  renderBlocksEditor();
  markDirty({ checkpoint: true });
}
function updateBlockFromDOM(index, target) {
  const block = current?.blocks?.[index];
  if (!block || (!target.dataset.prop && target.dataset.galleryProp === undefined && target.dataset.cellRow === undefined)) return;
  const prop = target.dataset.prop;
  if (target.dataset.galleryProp) {
    const item = block.items?.[+target.dataset.gallery];
    if (item) item[target.dataset.galleryProp] = target.value;
  } else if (target.dataset.cellRow !== undefined) {
    block.rows[+target.dataset.cellRow][+target.dataset.cellCol] = target.value;
  } else if (prop === "items" && ["list", "checklist"].includes(block.type)) {
    const lines = target.value.split("\n").filter((line) => line.trim());
    block.items = block.type === "checklist" ? lines.map((line) => ({ text: line.replace(/^\s*\[[ xX]\]\s*/, ""), checked: /^\s*\[[xX]\]/.test(line) })) : lines.map((text) => text.trim());
  } else if (prop.startsWith("card-") || prop.startsWith("item-")) {
    const [_, kind, field, rawIndex] = prop.match(/^(card|item)-(title|text|href|html)-(.+)$/) || [];
    const item = block.items?.[+rawIndex];
    if (item && kind === "item" && field === "html" && target.isContentEditable) item.html = sanitizeRichHTML(target.innerHTML);
    else if (item && field) item[field] = target.value;
  } else if (prop === "columnCount") {
    const count = Number(target.value) === 3 ? 3 : 2;
    block.columns ||= [];
    while (block.columns.length < count) block.columns.push([{ type: "paragraph", html: "<p>Column content…</p>" }]);
    while (block.columns.length > count) block.columns.pop();
  } else if (prop.startsWith("column-")) {
    const columnIndex = +prop.split("-")[1];
    const child = block.columns?.[columnIndex]?.[0];
    if (child) child.html = target.innerHTML;
  } else if (["ordered", "headerRow", "striped", "decorative", "lightbox", "border"].includes(prop)) {
    block[prop] = target.type === "checkbox" ? target.checked : target.value === "true";
  } else if (target.isContentEditable) {
    block[prop] = sanitizeRichHTML(target.innerHTML);
  } else if (["level", "maxLevel", "height", "focalX", "focalY", "rotate"].includes(prop)) {
    block[prop] = Number(target.value);
  } else {
    block[prop] = target.value;
  }
  if (block.type === "youtube" && prop === "url" && youtubeID(block.url)) { current.youtube = block.url; $("youtube-url").value = block.url; }
  markDirty();
}

async function fileData(file) {
  if (file.size > 8 * 1024 * 1024) throw Error("Keep each upload under 8 MB. Use YouTube for video files.");
  const raw = new Uint8Array(await file.arrayBuffer());
  let mime = file.type, ext = (file.name.split(".").pop() || "").toLowerCase();
  if (raw[0] === 137 && raw[1] === 80 && raw[2] === 78 && raw[3] === 71) { mime = "image/png"; ext = "png"; }
  else if (raw[0] === 255 && raw[1] === 216 && raw[2] === 255) { mime = "image/jpeg"; ext = "jpg"; }
  else if (new TextDecoder().decode(raw.slice(0, 4)) === "RIFF" && new TextDecoder().decode(raw.slice(8, 12)) === "WEBP") { mime = "image/webp"; ext = "webp"; }
  else if (new TextDecoder().decode(raw.slice(0, 6)).match(/^GIF8[79]a$/)) { mime = "image/gif"; ext = "gif"; }
  else if (new TextDecoder().decode(raw.slice(0, 4)) === "%PDF") { mime = "application/pdf"; ext = "pdf"; }
  else {
    const audio = { mp3: "audio/mpeg", m4a: "audio/mp4", ogg: "audio/ogg", wav: "audio/wav" };
    if (!audio[ext]) throw Error("Choose PNG, JPEG, WebP, GIF, MP3, M4A, OGG, WAV or PDF.");
    mime = audio[ext];
  }
  if (mime.startsWith("image/") && mime !== "image/gif" && file.size > 1.5 * 1024 * 1024) {
    const bitmap = await createImageBitmap(new Blob([raw], { type: mime }));
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d", { alpha: ext === "png" });
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
    const outputMime = ext === "png" ? "image/png" : "image/webp";
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, outputMime, 0.84));
    if (blob) { mime = outputMime; ext = outputMime === "image/png" ? "png" : "webp"; const buffer = new Uint8Array(await blob.arrayBuffer()); raw.set(buffer.subarray(0, Math.min(raw.length, buffer.length))); return base64Asset(buffer, mime, ext, file.name); }
  }
  return base64Asset(raw, mime, ext, file.name);
}
function base64Asset(bytes, mime, ext, name = "asset") {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  const stem = String(name).replace(/\.[^.]+$/, "").normalize("NFKD").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "asset";
  return { path: `media/${stem}-${makeId()}.${ext}`, mime, base64: btoa(binary), createdAt: now() };
}
async function ingestFiles(fileList, intent = null) {
  const files = [...(fileList || [])];
  if (!files.length) return;
  const added = [];
  try {
    for (const file of files) {
      const asset = await fileData(file);
      uploads.push(asset);
      added.push(asset);
      const use = intent || assetIntent;
      if (use?.kind === "thumbnail" && safeImage(asset.path)) {
        current.thumbnail = asset.path;
        if (!current.thumbnailAlt) current.thumbnailAlt = file.name.replace(/\.[^.]+$/, "");
        fillInspector();
      } else if (use?.kind === "block" && current.blocks[use.index]) {
        const block = current.blocks[use.index];
        if (["gallery", "carousel"].includes(block.type)) block.items.push({ src: asset.path, alt: "", caption: "" });
        else block.src = asset.path;
        if (block.type === "image" && !block.alt) block.alt = file.name.replace(/\.[^.]+$/, "");
        renderBlocksEditor();
      }
    }
    markDirty();
    if (currentView === "media" && publisher) {
      toast("Saving these media files to the GitHub repository…");
      const result = await publisher.publishAssets(added);
      const snapshot = await publisher.snapshot();
      repoAssets = snapshot.assets;
      uploads = uploads.filter((asset) => !added.some((item) => item.path === asset.path));
      toast(`Media uploaded to GitHub · ${result.sha.slice(0, 7)}`);
    }
    renderMediaLibrary();
    renderDialogMedia();
    toast(currentView === "media" ? `${files.length} media file${files.length === 1 ? "" : "s"} saved to GitHub.` : `${files.length} file${files.length === 1 ? "" : "s"} added. They upload when you publish.`);
  } catch (error) { toast(error.message || "The file could not be added.", true); }
  assetIntent = null;
}

function imageType(path) { return /\.(?:png|jpe?g|webp|gif)$/i.test(path); }
function mediaKind(path) { return imageType(path) ? "image" : /\.(?:mp3|m4a|ogg|wav)$/i.test(path) ? "audio" : "pdf"; }
function allMedia() {
  const paths = new Map();
  const addUsage = (path, post, detail = {}) => {
    if (!safeAsset(path)) return;
    paths.set(path, {
      ...(paths.get(path) || { path }),
      title: post.title || "",
      contentType: post.type || "",
      tags: post.topics || [],
      updatedAt: post.updatedAt || "",
      ...detail,
      path,
    });
  };
  for (const asset of repoAssets) paths.set(asset.path, asset);
  for (const upload of uploads) paths.set(upload.path, { path: upload.path, size: Math.round(upload.base64.length * 0.75), local: true, mime: upload.mime, base64: upload.base64, createdAt: upload.createdAt });
  for (const post of [...posts, ...(current ? [current] : [])]) {
    addUsage(post.thumbnail, post, { alt: post.thumbnailAlt || "" });
    addUsage(post.socialImage, post, { alt: post.thumbnailAlt || "" });
    const visit = (blocks = []) => {
      for (const block of blocks || []) {
        addUsage(block.src, post, { alt: block.alt || "", caption: block.caption || "" });
        for (const item of block.items || []) addUsage(item.src || item.image, post, { alt: item.alt || "", caption: item.caption || "" });
        for (const column of block.columns || []) visit(column);
      }
    };
    visit(post.blocks);
  }
  return [...paths.values()].filter((asset) => safeAsset(asset.path));
}
function mediaCard(asset, useButton = false) {
  const local = uploads.find((item) => item.path === asset.path);
  const preview = imageType(asset.path) ? `<img src="${local ? `data:${local.mime};base64,${local.base64}` : esc(asset.path)}" alt="">` : /\.pdf$/i.test(asset.path) ? "PDF" : "♫";
  const labels = [...new Set([asset.alt, asset.caption, ...(asset.tags || []), asset.title, asset.contentType].filter(Boolean))];
  const date = asset.createdAt ? formatDate(asset.createdAt) : "Date not indexed";
  return `<article class="media-card" data-kind="${mediaKind(asset.path)}"><div class="media-card-preview">${preview}</div><div class="media-card-info"><strong title="${esc(asset.path)}">${esc(asset.path.split("/").pop())}</strong><small>${asset.local ? "Not yet published" : asset.size ? `${(asset.size / 1024).toFixed(0)} KB` : mediaKind(asset.path)} · ${date}</small>${labels.length ? `<span class="media-card-labels">${esc(labels.join(" · "))}</span>` : ""}${useButton ? `<button class="chip" type="button" data-use-asset="${esc(asset.path)}">Use this media</button>` : ""}</div></article>`;
}
function mediaSearchText(asset) {
  return [asset.path, asset.alt, asset.caption, asset.title, asset.contentType, ...(asset.tags || [])].join(" ").toLowerCase();
}
function renderMediaLibrary() {
  const query = $("media-search").value.trim().toLowerCase();
  const kind = $("media-kind").value;
  const media = allMedia().filter((asset) => (!query || mediaSearchText(asset).includes(query)) && (kind === "all" || mediaKind(asset.path) === kind));
  $("media-grid").innerHTML = media.map((asset) => mediaCard(asset)).join("") || '<p class="fine">No media found. Upload images, audio, or PDFs to reuse them later.</p>';
}
function renderDialogMedia() {
  const query = $("dialog-media-search").value.trim().toLowerCase();
  const media = allMedia().filter((asset) => (!query || mediaSearchText(asset).includes(query)) && (!assetIntent?.kind || assetIntent.kind !== "block" || (current.blocks[assetIntent.index]?.type === "audio" ? mediaKind(asset.path) === "audio" : current.blocks[assetIntent.index]?.type === "file" ? mediaKind(asset.path) === "pdf" : imageType(asset.path))));
  $("dialog-media-grid").innerHTML = media.map((asset) => mediaCard(asset, true)).join("") || '<p class="fine">No media yet. Upload a file to add it.</p>';
}
function openMediaPicker(intent) {
  assetIntent = intent;
  renderDialogMedia();
  $("media-dialog").showModal();
}

function runQuality(showToast = false) {
  if (!current) return;
  syncModelFromFields();
  const issues = [];
  const add = (level, text) => issues.push({ level, text });
  if (!current.title.trim()) add("error", "Add a title before publishing.");
  if (!current.excerpt.trim()) add("warning", "Add a short card excerpt for the blog or library.");
  if (current.type === "video" && !youtubeID(current.youtube) && !current.blocks.some((block) => block.type === "youtube" && youtubeID(block.url))) add("error", "Add a valid YouTube URL.");
  for (const [index, block] of current.blocks.entries()) {
    if (block.type === "image" && block.src && !block.decorative && !block.alt?.trim()) add("warning", `Image block ${index + 1} needs alt text, or mark it decorative.`);
    if (["gallery", "carousel"].includes(block.type) && (block.items || []).some((item) => item.src && !item.alt?.trim())) add("warning", `Gallery block ${index + 1} has an image with no alt text.`);
    if (block.type === "image" && !block.src) add("warning", `Image block ${index + 1} has no image yet.`);
    if (block.type === "youtube" && !youtubeID(block.url)) add("warning", `YouTube block ${index + 1} needs a valid link.`);
    if (block.type === "paragraph" && (block.html || "").replace(/<[^>]+>/g, "").trim().split(/\s+/).length > 120) add("warning", `Paragraph block ${index + 1} is long; consider splitting it.`);
  }
  if (!current.topics.length) add("warning", "Choose at least one topic to help people discover this.");
  if (current.thumbnail && !current.thumbnailAlt.trim()) add("warning", "Add thumbnail alt text for accessibility.");
  if (current.type === "education" && !current.modules.length && !current.weeks.length) add("warning", "Consider placing this educational writing in the curriculum.");
  if (!issues.length) add("ok", "Title, content, media, and metadata look ready.");
  $("quality-results").innerHTML = issues.map((issue) => `<div class="quality-result ${issue.level}">${issue.level === "ok" ? "✓" : issue.level === "error" ? "!" : "•"} ${esc(issue.text)}</div>`).join("");
  const errors = issues.filter((issue) => issue.level === "error").length;
  const warnings = issues.filter((issue) => issue.level === "warning").length;
  $("quality-count").textContent = errors ? `${errors} needs fixing` : warnings ? `${warnings} suggestion${warnings === 1 ? "" : "s"}` : "Ready";
  if (showToast) toast(errors ? "Fix required fields before publishing." : warnings ? "Review the suggestions, then publish when ready." : "The publishing check is clear.", errors > 0);
  return { errors, warnings };
}

function updateBulkBar() {
  const chosen = [...document.querySelectorAll("[data-select-id]:checked")];
  $("bulk-bar").hidden = chosen.length === 0;
  $("bulk-count").textContent = `${chosen.length} selected`;
}
function dashboardSelection() { return [...document.querySelectorAll("[data-select-id]:checked")].map((input) => ({ id: input.dataset.selectId, kind: input.dataset.selectKind })); }

async function commitPost(state) {
  if (busy || !publisher) return;
  syncModelFromFields();
  current.status = state;
  current.updatedAt = now();
  if (state === "published") current.publishedAt = current.publishedAt || current.updatedAt;
  if (state !== "published") current.publishedAt = "";
  try { validatePost(current); } catch (error) { toast(error.message, true); return; }
  const check = runQuality(true);
  if (check.errors) return;
  if (state !== "published" && !confirm("Unpublish this content? It will disappear from the live website, but remain in GitHub history.")) return;
  busy = true;
  document.querySelectorAll(".editor-view input,.editor-view textarea,.editor-view select,.editor-view button").forEach((input) => { input.disabled = true; });
  setSaveState(state === "published" ? "Publishing…" : "Unpublishing…", "saving");
  try {
    const referenced = new Set([current.thumbnail, current.socialImage, ...(current.blocks || []).flatMap((block) => [block.src, ...(block.items || []).map((item) => item.src), ...(block.columns || []).flatMap((col) => col.map((item) => item.src))])].filter(Boolean));
    const included = uploads.filter((asset) => referenced.has(asset.path));
    const result = await publisher.publish(current, included, previous);
    posts = result.data.posts;
    previous = deepCopy(current);
    dirty = false;
    await dbDelete("drafts", current.id);
    await refreshLocal();
    const remote = await publisher.snapshot();
    repoAssets = remote.assets;
    setSaveState(`${state === "published" ? "Published" : "Unpublished"} · ${result.sha.slice(0, 7)}`);
    setDeploy("GitHub Pages deploys the update from this commit. It may take a few minutes to appear publicly.");
    $("unpublish").hidden = state !== "published";
    $("delete-content").hidden = false;
    await loadVersions();
    toast(state === "published" ? "Published to GitHub. The public site is updating." : "Unpublished from the live site.");
  } catch (error) { setSaveState("Not published · your draft is saved", "error"); toast(error.message || "Publishing failed. Your local draft remains saved.", true); }
  finally { busy = false; document.querySelectorAll(".editor-view input,.editor-view textarea,.editor-view select,.editor-view button").forEach((input) => { input.disabled = false; }); $("doc-title").disabled = false; $("doc-excerpt").disabled = false; $("doc-intro").disabled = false; }
}

async function archiveRemote(post) {
  if (!publisher || !confirm(`Archive “${post.title}”? It will be hidden from the website but kept in GitHub history.`)) return;
  const updated = { ...post, status: "archived", archivedAt: now(), updatedAt: now() };
  try {
    const result = await publisher.publish(updated, [], post);
    posts = result.data.posts;
    toast("Content archived in GitHub.");
    renderDashboard();
  } catch (error) { toast(error.message, true); }
}
async function unarchiveRemote(post) {
  const updated = { ...post, status: "published", updatedAt: now(), publishedAt: post.publishedAt || now() };
  try { const result = await publisher.publish(updated, [], post); posts = result.data.posts; renderDashboard(); toast("Content restored to the live site."); }
  catch (error) { toast(error.message, true); }
}
async function removeRemote(post) {
  if (!publisher || !confirm(`Permanently remove “${post.title}” from the content index? GitHub's file history can restore it.`)) return;
  try { const result = await publisher.deletePost(post.id, post); posts = result.data.posts; renderDashboard(); toast("Content removed from the index. GitHub keeps the earlier commit history."); }
  catch (error) { toast(error.message, true); }
}

async function dashboardAction(event) {
  const button = event.target.closest("[data-action]");
  if (!button || busy) return;
  const id = button.dataset.id;
  const action = button.dataset.action;
  const local = localDrafts.find((item) => item.id === id);
  const remote = posts.find((item) => item.id === id);
  if (action === "resume" && local) { openEditor(local.post, local.post.type, { previous: local.previous, uploads: local.uploads, fromDraft: true }); return; }
  if (action === "resume-archived" && local) { openEditor(local.post, local.post.type, { previous: local.previous, uploads: local.uploads, fromDraft: true }); return; }
  if (action === "restore-local" && local) { local.post.status = "draft"; await dbPut("drafts", local); await refreshLocal(); renderDashboard(); toast("Browser draft restored."); return; }
  if (action === "edit" && remote) { openEditor(remote, remote.type); return; }
  if (action === "duplicate" && local) { const copy = deepCopy(local.post); copy.id = makeId(); copy.title = `${copy.title} (copy)`; copy.status = "draft"; copy.publishedAt = ""; copy.createdAt = now(); copy.updatedAt = now(); openEditor(copy, copy.type, { uploads: local.uploads }); return; }
  if (action === "duplicate-remote" && remote) { const copy = deepCopy(remote); copy.id = makeId(); copy.title = `${copy.title} (copy)`; copy.status = "draft"; copy.publishedAt = ""; copy.createdAt = now(); copy.updatedAt = now(); openEditor(copy, copy.type); return; }
  if (action === "discard" && local) { if (confirm("Delete this browser draft and its local uploaded media?")) { await dbDelete("drafts", id); await refreshLocal(); renderDashboard(); } return; }
  if (action === "archive" && remote) { await archiveRemote(remote); return; }
  if (action === "publish-archived" && remote) { await unarchiveRemote(remote); return; }
  if (action === "delete" && remote) { await removeRemote(remote); return; }
}

function renderTemplates() {
  const builtIns = Object.entries(templates).map(([type, template]) => ({ id: `builtin-${type}`, type, title: typeNames[type], description: `${template.blocks.length} site-ready blocks for a ${typeNames[type].toLowerCase()}.`, builtin: true }));
  const custom = userTemplates.map((template) => ({ ...template, builtin: false }));
  $("template-grid").innerHTML = [...builtIns, ...custom].map((template) => `<article class="template-card"><p class="eyebrow">${template.builtin ? "STARTER TEMPLATE" : "YOUR TEMPLATE"}</p><h3>${esc(template.title)}</h3><p>${esc(template.description || `${template.blocks?.length || 0} saved blocks.`)}</p><div class="row"><button class="button" type="button" data-use-template="${esc(template.id)}">Use template</button>${template.builtin ? "" : `<button class="chip danger-chip" type="button" data-delete-template="${esc(template.id)}">×</button>`}</div></article>`).join("");
}

function selectionBlock() {
  const node = document.getSelection()?.anchorNode;
  const element = node?.nodeType === Node.ELEMENT_NODE ? node : node?.parentElement;
  const block = element?.closest?.(".editor-block");
  return block ? +block.dataset.index : -1;
}
function selectionLink() {
  const value = prompt("Link address (website, email, phone, page or #section)");
  if (!value) return;
  const href = safeHref(value);
  if (!href) { toast("Use an https://, mailto:, tel:, #section or site-relative link.", true); return; }
  document.execCommand("createLink", false, href);
  if (/^https?:/i.test(href)) {
    const selection = document.getSelection();
    const anchor = selection?.anchorNode?.parentElement?.closest("a");
    if (anchor) { anchor.target = "_blank"; anchor.rel = "noopener noreferrer"; }
  }
  captureFocusedRichEditor();
}
function captureFocusedRichEditor() {
  const index = selectionBlock();
  const editor = document.activeElement?.closest?.("[contenteditable=true]");
  if (index >= 0 && editor) updateBlockFromDOM(index, editor);
}
function execFormat(command, value = null) {
  if (command === "link") return selectionLink();
  if (command === "indent" || command === "outdent") document.execCommand(command, false);
  else document.execCommand(command, false, value);
  captureFocusedRichEditor();
}
function applyParagraphStyle(value) {
  const index = selectionBlock();
  if (index < 0 || !current.blocks[index]) { toast("Choose a text block first."); return; }
  const block = current.blocks[index];
  const editor = document.activeElement?.closest?.("[contenteditable=true]") || document.querySelector(`.editor-block[data-index="${index}"] [contenteditable=true]`);
  if (value === "quote") {
    const replacement = { id: makeId(), type: "quote", html: block.html || `<p>${esc(block.text || "")}</p>`, attribution: "" };
    current.blocks[index] = replacement;
  } else if (value === "p") {
    if (block.type === "heading") current.blocks[index] = { id: makeId(), type: "paragraph", html: `<p>${esc(block.text || "")}</p>` };
  } else if (/^h[2-6]$/.test(value)) {
    const text = editor?.innerText || block.text || "New section";
    current.blocks[index] = { id: makeId(), type: "heading", level: +value.slice(1), text };
  }
  selectedIndex = index;
  renderBlocksEditor(); markDirty({ checkpoint: true });
}
function wrapSelection(tagName) {
  const selection = document.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return toast("Select some text first.");
  const range = selection.getRangeAt(0);
  const node = document.createElement(tagName);
  try { range.surroundContents(node); }
  catch { node.append(range.extractContents()); range.insertNode(node); }
  selection.removeAllRanges();
  captureFocusedRichEditor();
}

function updateSelectionToolbar() {
  const selection = document.getSelection();
  if (!selection || selection.isCollapsed || !selection.anchorNode) { $("selection-toolbar").hidden = true; return; }
  const element = selection.anchorNode.nodeType === Node.ELEMENT_NODE ? selection.anchorNode : selection.anchorNode.parentElement;
  if (!element?.closest?.(".rich-editor")) { $("selection-toolbar").hidden = true; return; }
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const toolbar = $("selection-toolbar");
  toolbar.hidden = false;
  toolbar.style.left = `${Math.max(8, Math.min(innerWidth - toolbar.offsetWidth - 8, rect.left + rect.width / 2 - toolbar.offsetWidth / 2))}px`;
  toolbar.style.top = `${Math.max(8, rect.top - 44)}px`;
}

function blockCommandMenu(query = "") {
  const needle = query.toLowerCase();
  const results = allBlockDefs.filter(([, label, hint]) => `${label} ${hint}`.toLowerCase().includes(needle));
  $("command-results").innerHTML = results.map(([type, label, hint]) => `<button type="button" data-command-block="${type}"><span>${esc(label)}</span><small>${esc(hint)}</small></button>`).join("") || '<p class="fine">No matching blocks.</p>';
}

async function attachNote() {
  if (!current) return;
  const record = { id: current.id, text: $("editor-note").value, updatedAt: now() };
  try { await dbPut("notes", record); toast("Private note saved on this browser."); }
  catch { toast("Could not save the private note.", true); }
}
async function loadNote() {
  if (!current) return;
  try { $("editor-note").value = (await dbGet("notes", current.id))?.text || ""; }
  catch { $("editor-note").value = ""; }
}

function applyDataToFields() {
  fillInspector(); renderBlocksEditor(); markDirty();
}

// Authentication and repository initialization. The token lives only in this
// page's memory, is erased on sign-out, and is never stored in browser storage.
$("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const token = $("token").value.trim();
  if (!token) return;
  $("connect").disabled = true;
  $("login-status").textContent = "";
  const candidate = new Publisher(token);
  try {
    githubUser = await candidate.connect();
    const snapshot = await candidate.snapshot();
    publisher = candidate; posts = snapshot.data.posts; repoAssets = snapshot.assets;
    $("token").value = ""; $("login").hidden = true; $("studio").hidden = false;
    $("connection-label").textContent = `Connected as ${githubUser.login}`;
    await refreshLocal(); setView("dashboard");
  } catch (error) {
    candidate.disconnect(); $("token").value = "";
    $("login-status").textContent = error.message === "Failed to fetch" ? "Could not reach GitHub. Check your connection and try again." : `Sign-in failed: ${error.message || "Could not connect to GitHub."}`;
  } finally { $("connect").disabled = false; }
});
$("disconnect").onclick = async () => {
  if (dirty && !confirm("Sign out? Your latest changes are autosaved in this browser.")) return;
  publisher?.disconnect(); publisher = null; githubUser = null; current = null; uploads = [];
  $("studio").hidden = true; $("login").hidden = false; $("login-status").textContent = "Signed out.";
};

document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => void setView(button.dataset.view)));
document.querySelectorAll("[data-new]").forEach((button) => button.addEventListener("click", () => openEditor(null, button.dataset.new)));
$("dash-search").addEventListener("input", renderDashboard);
$("dash-status").addEventListener("change", renderDashboard);
$("dash-type").addEventListener("change", renderDashboard);
$("dash-list").addEventListener("click", (event) => void dashboardAction(event));
$("dash-list").addEventListener("change", (event) => { if (event.target.matches("[data-select-id]")) updateBulkBar(); });
$("select-all").onchange = () => { document.querySelectorAll("[data-select-id]").forEach((input) => { input.checked = $("select-all").checked; }); updateBulkBar(); };
$("bulk-export").onclick = () => {
  const keys = dashboardSelection();
  const items = keys.map(({ id, kind }) => kind === "draft" ? localDrafts.find((x) => x.id === id)?.post : posts.find((x) => x.id === id)).filter(Boolean);
  downloadable("nobodyssimple-selected-content.json", { posts: items });
};
$("bulk-archive").onclick = async () => {
  const keys = dashboardSelection().filter((entry) => entry.kind === "draft");
  if (!keys.length) return toast("Bulk archive currently applies to local drafts only.");
  for (const { id } of keys) { const record = await dbGet("drafts", id); if (record) { record.post.status = "archived"; await dbPut("drafts", record); } }
  await refreshLocal(); renderDashboard(); toast("Selected browser drafts archived.");
};
$("bulk-delete").onclick = async () => {
  const keys = dashboardSelection().filter((entry) => entry.kind === "draft");
  if (!keys.length) return toast("Bulk delete applies to local drafts only. Use an individual GitHub action for published content.");
  if (!confirm(`Delete ${keys.length} selected local draft${keys.length === 1 ? "" : "s"}?`)) return;
  for (const { id } of keys) await dbDelete("drafts", id);
  await refreshLocal(); renderDashboard(); toast("Selected local drafts deleted.");
};

$("back-dashboard").onclick = async () => { if (dirty) await persistDraft(); setView("dashboard"); };
$("doc-title").addEventListener("input", () => { if (!$("meta-slug").dataset.edited) $("meta-slug").value = slugify($("doc-title").value); markDirty(); $("document-slug-display").textContent = `Label · ${slugify($("meta-slug").value || $("doc-title").value)}`; });
$("doc-excerpt").addEventListener("input", () => markDirty());
$("doc-intro").addEventListener("input", () => markDirty());
for (const id of ["meta-type", "meta-category", "meta-author", "meta-slug", "seo-title", "seo-description", "social-image", "thumb-alt", "thumb-ratio", "thumb-focus-x", "thumb-focus-y", "thumb-rotate", "youtube-url", "page-theme", "hero-style"]) {
  $(id).addEventListener("input", () => { if (id === "meta-slug") $(id).dataset.edited = "1"; syncModelFromFields(); updateSearchPreview(); updateThumbPreview(); updateLivePreview(); runQuality(false); markDirty(); });
  $(id).addEventListener("change", () => { syncModelFromFields(); if (id === "meta-type") { current.destinations = [current.type === "blog" ? "blog" : "library"]; $("video-settings").hidden = current.type !== "video"; $("type-pill").textContent = topicName(current.type); } markDirty({ checkpoint: true }); });
}
$("meta-topics").addEventListener("input", renderTopicChips);
$("meta-topics").addEventListener("keydown", (event) => { if (["Enter", ","].includes(event.key)) { event.preventDefault(); const topic = $("meta-topics").value.trim().replace(/,$/, ""); if (topic && !current.topics.includes(topic)) current.topics.push(topic); $("meta-topics").value = ""; renderTopicChips(); markDirty(); } });
$("topic-chips").addEventListener("click", (event) => { const button = event.target.closest("[data-remove-topic]"); if (!button) return; current.topics = current.topics.filter((topic) => topic !== button.dataset.removeTopic); renderTopicChips(); markDirty(); });
$("topic-suggestions").addEventListener("click", (event) => { const button = event.target.closest("[data-add-topic]"); if (!button) return; current.topics.push(button.dataset.addTopic); $("meta-topics").value = ""; renderTopicChips(); markDirty(); });
$("curriculum-fields").addEventListener("change", () => { syncModelFromFields(); markDirty(); });
$("choose-thumbnail").onclick = () => openMediaPicker({ kind: "thumbnail" });
$("thumb-preview").onclick = () => openMediaPicker({ kind: "thumbnail" });
$("thumb-alt").addEventListener("input", () => markDirty());
$("save-note").onclick = () => void attachNote();

$("block-list").addEventListener("focusin", (event) => {
  const block = event.target.closest(".editor-block");
  if (block) { selectedIndex = +block.dataset.index; document.querySelectorAll(".editor-block").forEach((node) => node.classList.toggle("selected-block", node === block)); updateBlockInspector(); }
});
$("block-list").addEventListener("input", (event) => {
  const blockElement = event.target.closest(".editor-block");
  if (!blockElement) return;
  const index = +blockElement.dataset.index;
  updateBlockFromDOM(index, event.target);
  if (event.target.matches("[contenteditable=true]") && currentUndoIndex >= 0) {
    clearTimeout(window.blockCheckpointTimer);
    window.blockCheckpointTimer = setTimeout(pushUndoState, 1500);
  }
  updateStats(); updateOutline(); updateLivePreview();
});
$("block-list").addEventListener("change", (event) => {
  const blockElement = event.target.closest(".editor-block"); if (!blockElement) return;
  const index = +blockElement.dataset.index;
  if (event.target.dataset.related !== undefined) {
    const item = current.blocks[index].items[+event.target.dataset.related];
    const post = posts.find((value) => value.id === event.target.value);
    if (item && post) Object.assign(item, { id: post.id, title: post.title, text: post.excerpt });
    markDirty(); updateLivePreview(); return;
  }
  updateBlockFromDOM(index, event.target);
  if (["level", "ratio", "rotate", "columnCount", "columnLayout"].includes(event.target.dataset.prop)) renderBlocksEditor();
});
$("block-list").addEventListener("click", (event) => {
  const card = event.target.closest(".editor-block");
  if (card) { selectedIndex = +card.dataset.index; updateBlockInspector(); }
  const actionButton = event.target.closest("[data-block-action]");
  if (!actionButton) {
    const removeRow = event.target.closest("[data-row-remove]");
    if (removeRow) { current.blocks[selectedIndex].rows.splice(+removeRow.dataset.rowRemove, 1); renderBlocksEditor(); markDirty({ checkpoint: true }); return; }
    const removeGallery = event.target.closest("[data-gallery-remove]");
    if (removeGallery) { current.blocks[selectedIndex].items.splice(+removeGallery.dataset.galleryRemove, 1); renderBlocksEditor(); markDirty({ checkpoint: true }); return; }
    const removeRelated = event.target.closest("[data-related-remove]");
    if (removeRelated) { current.blocks[selectedIndex].items.splice(+removeRelated.dataset.relatedRemove, 1); renderBlocksEditor(); markDirty({ checkpoint: true }); return; }
    return;
  }
  const action = actionButton.dataset.blockAction;
  if (action === "delete") { if (!confirm("Delete this block?")) return; current.blocks.splice(selectedIndex, 1); selectedIndex = Math.min(selectedIndex, current.blocks.length - 1); }
  if (action === "duplicate") { current.blocks.splice(selectedIndex + 1, 0, { ...deepCopy(current.blocks[selectedIndex]), id: makeId() }); selectedIndex++; }
  if (action === "move-up") return reorderBlock(selectedIndex, selectedIndex - 1);
  if (action === "move-down") return reorderBlock(selectedIndex, selectedIndex + 1);
  if (action === "collapse") { card.classList.toggle("collapsed"); actionButton.textContent = card.classList.contains("collapsed") ? "›" : "⌄"; return; }
  if (action === "choose-media") {
    const type = current.blocks[selectedIndex].type;
    openMediaPicker({ kind: "block", index: selectedIndex, mediaType: type }); return;
  }
  if (action === "add-list-item") {
    const block = current.blocks[selectedIndex];
    block.items.push(block.type === "checklist" ? { text: "New item", checked: false } : "New item");
  }
  if (action === "gallery-add") { openMediaPicker({ kind: "block", index: selectedIndex, mediaType: "gallery" }); return; }
  if (action === "table-row") { const block = current.blocks[selectedIndex]; block.rows.push(Array(block.rows[0]?.length || 2).fill("")); }
  if (action === "table-col") { const block = current.blocks[selectedIndex]; block.rows.forEach((row) => row.push("")); }
  if (action === "table-col-remove") { const block = current.blocks[selectedIndex]; if ((block.rows[0]?.length || 0) <= 1) return toast("A table needs at least one column."); block.rows.forEach((row) => row.pop()); }
  if (action === "section-add") { current.blocks[selectedIndex].items.push({ title: "New section", html: "<p>Content…</p>" }); }
  if (action === "card-add") { current.blocks[selectedIndex].items.push({ title: "Explore next", text: "Description", href: "#tools" }); }
  if (action === "related-add") { current.blocks[selectedIndex].items.push({ id: "", title: "" }); }
  renderBlocksEditor(); markDirty({ checkpoint: true });
});
let dragIndex = -1;
$("block-list").addEventListener("dragstart", (event) => { const block = event.target.closest(".editor-block"); if (!block) return; dragIndex = +block.dataset.index; event.dataTransfer.effectAllowed = "move"; event.dataTransfer.setData("text/plain", String(dragIndex)); });
$("block-list").addEventListener("dragover", (event) => { if (event.target.closest(".editor-block")) { event.preventDefault(); event.dataTransfer.dropEffect = "move"; } });
$("block-list").addEventListener("drop", (event) => { const target = event.target.closest(".editor-block"); if (!target) return; event.preventDefault(); const from = Number(event.dataTransfer.getData("text/plain")) || dragIndex; reorderBlock(from, +target.dataset.index); dragIndex = -1; });
$("block-list").addEventListener("paste", (event) => {
  const pastedImages = [...(event.clipboardData?.items || [])]
    .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
    .map((item) => item.getAsFile())
    .filter(Boolean);
  if (pastedImages.length) {
    event.preventDefault();
    const index = selectionBlock();
    addBlock(pastedImages.length > 1 ? "gallery" : "image", index);
    assetIntent = { kind: "block", index: selectedIndex };
    void ingestFiles(pastedImages, assetIntent);
    return;
  }
  const text = event.clipboardData?.getData("text/plain") || "";
  if (/^https:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(text.trim()) && youtubeID(text.trim())) { event.preventDefault(); const index = selectionBlock(); addBlock("youtube", index); current.blocks[selectedIndex].url = text.trim(); renderBlocksEditor(); markDirty(); return; }
  const html = event.clipboardData?.getData("text/html") || "";
  if (html.includes("<table")) {
    event.preventDefault();
    const parsed = new DOMParser().parseFromString(html, "text/html");
    const rows = [...parsed.querySelectorAll("table tr")].map((row) => [...row.querySelectorAll("th,td")].map((cell) => cell.innerText.trim()));
    if (rows.length) { addBlock("table"); current.blocks[selectedIndex].rows = rows; current.blocks[selectedIndex].headerRow = !!parsed.querySelector("th"); renderBlocksEditor(); markDirty(); }
  } else if (html && event.target.closest("[contenteditable=true]")) {
    event.preventDefault();
    const safe = sanitizeRichHTML(html);
    document.execCommand("insertHTML", false, safe);
    captureFocusedRichEditor();
  }
});
$("block-list").addEventListener("drop", (event) => {
  const files = [...(event.dataTransfer?.files || [])];
  if (!files.length) return;
  event.preventDefault();
  const index = selectionBlock();
  void (async () => {
    if (files.length > 1 && files.every((file) => file.type.startsWith("image/"))) {
      addBlock("gallery", index);
      await ingestFiles(files, { kind: "block", index: selectedIndex });
      return;
    }
    let after = index;
    for (const file of files) {
      const type = file.type.startsWith("image/") ? "image" : file.type === "application/pdf" ? "file" : "audio";
      addBlock(type, after);
      const blockIndex = selectedIndex;
      await ingestFiles([file], { kind: "block", index: blockIndex });
      after = blockIndex;
    }
  })();
});

$("add-block-open").onclick = () => { $("block-menu").hidden = !$("block-menu").hidden; };
$("block-menu").innerHTML = blockTypes.map(([group, items]) => `<div class="block-menu-group"><strong>${esc(group)}</strong>${items.map(([type, label, desc]) => `<button type="button" data-add-block="${type}">${esc(label)}<span>${esc(desc)}</span></button>`).join("")}</div>`).join("");
$("block-menu").addEventListener("click", (event) => { const button = event.target.closest("[data-add-block]"); if (button) addBlock(button.dataset.addBlock); });
$("save-reusable").onclick = async () => {
  if (selectedIndex < 0) return toast("Select a block first.");
  const title = prompt("Name this reusable block"); if (!title?.trim()) return;
  const snippet = { id: makeId(), title: title.trim(), block: deepCopy(current.blocks[selectedIndex]), createdAt: now() };
  try { await dbPut("snippets", snippet); snippets = await dbAll("snippets"); renderBlockMenuWithSnippets(); toast("Reusable block saved in this browser."); }
  catch { toast("Could not save this reusable block.", true); }
};
function renderBlockMenuWithSnippets() {
  if (!snippets.length) return;
  const html = `<div class="block-menu-group"><strong>MY REUSABLE BLOCKS</strong>${snippets.map((snippet) => `<button type="button" data-insert-snippet="${esc(snippet.id)}">${esc(snippet.title)}<span>${esc(blockLabel(snippet.block.type))}</span></button>`).join("")}</div>`;
  $("block-menu").querySelector(".saved-snippets")?.remove();
  const holder = document.createElement("div"); holder.className = "saved-snippets"; holder.innerHTML = html;
  $("block-menu").append(holder);
}
$("block-menu").addEventListener("click", (event) => { const button = event.target.closest("[data-insert-snippet]"); if (!button) return; const snippet = snippets.find((item) => item.id === button.dataset.insertSnippet); if (snippet) { current.blocks.splice(selectedIndex + 1, 0, { ...deepCopy(snippet.block), id: makeId() }); selectedIndex++; renderBlocksEditor(); markDirty({ checkpoint: true }); } });

$("editor-grid").classList.add("page-standard");
document.querySelectorAll("[data-page-width]").forEach((button) => button.onclick = () => { $("editor-grid").classList.remove("page-narrow", "page-standard", "page-wide"); $("editor-grid").classList.add(`page-${button.dataset.pageWidth}`); document.querySelectorAll("[data-page-width]").forEach((b) => b.classList.toggle("selected", b === button)); if (current) { current.layout = button.dataset.pageWidth; markDirty(); } });
document.querySelectorAll("[data-preview-size]").forEach((button) => button.onclick = () => { $("live-preview").dataset.previewSize = button.dataset.previewSize; document.querySelectorAll("[data-preview-size]").forEach((item) => item.classList.toggle("active", item === button)); });
$("toggle-split").onclick = () => { const active = !$("live-preview").hidden; $("live-preview").hidden = active; $("editor-grid").classList.toggle("split-mode", !active); $("toggle-split").textContent = active ? "Split preview" : "Hide preview"; };
$("preview-full").onclick = () => { updateLivePreview(); $("live-preview").hidden = false; $("editor-grid").classList.add("split-mode"); $("toggle-split").textContent = "Hide preview"; $("live-preview").scrollIntoView({ block: "nearest", behavior: "smooth" }); };
$("inspector-collapse").onclick = () => { $("studio").classList.toggle("inspector-hidden"); $("inspector-collapse").textContent = $("studio").classList.contains("inspector-hidden") ? "Show" : "Hide"; };
for (const [id, prop] of [["block-align", "align"], ["block-width", "width"], ["block-line", "lineHeight"], ["block-spacing", "letterSpacing"], ["block-tone", "textTone"]]) {
  $(id).onchange = () => {
    const block = current?.blocks?.[selectedIndex]; if (!block) return;
    block[prop] = $(id).value === "" ? undefined : ["lineHeight", "letterSpacing"].includes(prop) ? Number($(id).value) : $(id).value;
    renderBlocksEditor(); markDirty({ checkpoint: true });
  };
}
$("focus-mode").onclick = () => { $("studio").classList.toggle("focus-mode"); $("focus-mode").textContent = $("studio").classList.contains("focus-mode") ? "Exit focus" : "Focus"; };
$("full-editor").onclick = () => { $("studio").classList.toggle("fullscreen-editor"); $("full-editor").textContent = $("studio").classList.contains("fullscreen-editor") ? "Exit full screen" : "Full screen"; };
$("help-shortcuts").onclick = () => toast("Ctrl/Cmd+B bold · I italic · K link · S save · Z undo · / insert block · Ctrl/Cmd+F find");

$("format-toolbar").addEventListener("mousedown", (event) => { if (event.target.closest("button")) event.preventDefault(); });
$("format-toolbar").addEventListener("click", (event) => { const button = event.target.closest("[data-cmd]"); if (button) execFormat(button.dataset.cmd); });
$("text-color").oninput = (event) => execFormat("foreColor", event.target.value);
$("highlight-color").oninput = (event) => execFormat("hiliteColor", event.target.value);
$("font-size").onchange = (event) => execFormat("fontSize", event.target.value);
$("format-link").onclick = selectionLink;
$("selection-link").onclick = selectionLink;
$("format-code").onclick = () => wrapSelection("code");
$("insert-symbol").onclick = () => {
  const symbols = ["—", "–", "…", "→", "←", "“", "”", "‘", "’", "©", "®", "✓", "§", "°", "±"];
  const value = prompt(`Special character\n\n${symbols.join("   ")}`, "—");
  if (value) { document.execCommand("insertText", false, value); captureFocusedRichEditor(); }
};
$("selection-toolbar").addEventListener("mousedown", (event) => event.preventDefault());
$("selection-toolbar").addEventListener("click", (event) => { const button = event.target.closest("[data-cmd]"); if (button) execFormat(button.dataset.cmd); });
$("paragraph-style").onchange = (event) => applyParagraphStyle(event.target.value);
document.addEventListener("selectionchange", updateSelectionToolbar);
$("undo").onclick = () => { if (currentUndoIndex > 0) applyEditorUndo("undo"); else execFormat("undo"); };
$("redo").onclick = () => { if (currentUndoIndex < currentUndo.length - 1) applyEditorUndo("redo"); else execFormat("redo"); };

$("command-menu").onclick = () => { blockCommandMenu(); $("command-dialog").showModal(); $("command-search").value = ""; $("command-search").focus(); };
$("command-search").oninput = (event) => blockCommandMenu(event.target.value);
$("command-results").onclick = (event) => { const button = event.target.closest("[data-command-block]"); if (button) { $("command-dialog").close(); addBlock(button.dataset.commandBlock); } };
$("command-results").classList.add("command-results");
$("find-replace").onclick = () => $("find-dialog").showModal();
$("find-next").onclick = () => { const text = $("find-query").value; if (!text) return; const found = window.find(text); if (!found) toast("No more matches found."); };
$("replace-one").onclick = () => { const text = $("find-query").value; const replacement = $("replace-query").value; if (!text) return; if (window.find(text)) { document.execCommand("insertText", false, replacement); captureFocusedRichEditor(); } else toast("No more matches found."); };
$("replace-all").onclick = () => { const needle = $("find-query").value; if (!needle) return; const replacement = $("replace-query").value; for (const block of current.blocks) if (block.html) { const doc = new DOMParser().parseFromString(block.html, "text/html"); const walk = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT); while (walk.nextNode()) walk.currentNode.nodeValue = walk.currentNode.nodeValue.replaceAll(needle, replacement); block.html = doc.body.innerHTML; } renderBlocksEditor(); markDirty(); toast("Replace all complete."); };
$("add-block-open").addEventListener("keydown", (event) => { if (event.key === "/") { event.preventDefault(); blockCommandMenu(); $("command-dialog").showModal(); } });
document.addEventListener("keydown", (event) => {
  const modifier = event.ctrlKey || event.metaKey;
  if (modifier && event.key.toLowerCase() === "s") { event.preventDefault(); void persistDraft(); return; }
  if (modifier && event.key.toLowerCase() === "k" && document.activeElement?.closest?.("[contenteditable=true]")) { event.preventDefault(); selectionLink(); return; }
  if (modifier && event.key.toLowerCase() === "f" && currentView === "editor") { event.preventDefault(); $("find-dialog").showModal(); $("find-query").focus(); return; }
  if (!modifier && event.key === "/" && document.activeElement?.closest?.("[contenteditable=true]") && window.getSelection()?.isCollapsed) { event.preventDefault(); blockCommandMenu(); $("command-dialog").showModal(); $("command-search").focus(); }
  if (modifier && event.key.toLowerCase() === "z" && event.shiftKey) { event.preventDefault(); execFormat("redo"); }
  if (modifier && event.key.toLowerCase() === "y") { event.preventDefault(); execFormat("redo"); }
  if (modifier && event.key.toLowerCase() === "z" && !event.shiftKey && !document.activeElement?.closest?.("[contenteditable=true]")) { event.preventDefault(); applyEditorUndo("undo"); }
});

$("run-quality").onclick = () => runQuality(true);
$("publish").onclick = () => void commitPost("published");
$("unpublish").onclick = () => void commitPost("unpublished");
$("publish-draft").onclick = async () => { syncModelFromFields(); await persistDraft(); toast("Draft saved only in this browser. It is not on the public website."); };
$("save-version").onclick = () => void saveVersion(true);
$("download-backup").onclick = () => { syncModelFromFields(); downloadable(`${slugify(current.title) || "nobodys-simple-draft"}.json`, { format: "nobodys-simple-creator-v2", post: current, previous, uploads }); };
$("import-backup").onchange = async (event) => {
  try {
    const file = event.target.files[0]; if (!file) return;
    if (file.size > 40 * 1024 * 1024) throw Error("This backup is larger than 40 MB.");
    const backup = JSON.parse(await file.text());
    if (!backup.post || typeof backup.post.id !== "string" || !Array.isArray(backup.post.blocks) || !Array.isArray(backup.uploads || [])) throw Error("This file is not a supported Creator backup.");
    const restoredUploads = backup.uploads || [];
    if (restoredUploads.some((asset) => !safeAsset(asset.path) || !/^(?:image\/(?:png|jpeg|webp|gif)|audio\/(?:mpeg|mp4|ogg|wav)|application\/pdf)$/.test(asset.mime || "") || !/^[A-Za-z0-9+/=]*$/.test(asset.base64 || ""))) throw Error("The backup includes a media file in an unsupported format.");
    const post = deepCopy(backup.post);
    post.blocks = post.blocks.map((block) => ({ ...block, ...(block.html ? { html: sanitizeRichHTML(block.html) } : {}) }));
    openEditor(post, post.type, { previous: backup.previous || null, uploads: restoredUploads, fromDraft: true });
    toast("Backup opened. Review it, then publish when ready.");
  } catch (error) { toast(error.message || "Could not restore this backup.", true); }
  finally { event.target.value = ""; }
};
$("delete-content").onclick = async () => { if (previous) await removeRemote(previous); };
$("save-template").onclick = async () => {
  if (!current) return toast("Open a document first to create a template.");
  const title = prompt("Name your template"); if (!title?.trim()) return;
  const template = { id: makeId(), title: title.trim(), description: `${current.blocks.length} saved content blocks.`, type: current.type, blocks: deepCopy(current.blocks), excerpt: current.excerpt, intro: current.intro, createdAt: now() };
  try { await dbPut("templates", template); userTemplates = await dbAll("templates"); renderTemplates(); toast("Template saved in this browser."); }
  catch { toast("Could not save this template.", true); }
};
$("template-grid").addEventListener("click", async (event) => {
  const use = event.target.closest("[data-use-template]");
  const remove = event.target.closest("[data-delete-template]");
  if (remove) { await dbDelete("templates", remove.dataset.deleteTemplate); userTemplates = await dbAll("templates"); renderTemplates(); return; }
  if (use) {
    const id = use.dataset.useTemplate;
    const builtIn = id.startsWith("builtin-") ? id.replace("builtin-", "") : null;
    const template = builtIn ? templates[builtIn] : userTemplates.find((item) => item.id === id);
    if (!template) return;
    const type = template.type || builtIn || "blog";
    const post = createPost(type);
    post.blocks = deepCopy(template.blocks).map((block) => ({ ...block, id: makeId() }));
    post.excerpt = template.excerpt || ""; post.intro = template.intro || "";
    openEditor(post, type);
  }
});

$("media-upload").onchange = (event) => void ingestFiles(event.target.files).finally(() => { event.target.value = ""; });
$("asset-upload").onchange = (event) => void ingestFiles(event.target.files, assetIntent).finally(() => { event.target.value = ""; });
$("dialog-media-upload").onchange = (event) => void ingestFiles(event.target.files, assetIntent).finally(() => { event.target.value = ""; });
$("media-search").oninput = renderMediaLibrary;
$("media-kind").onchange = renderMediaLibrary;
$("dialog-media-search").oninput = renderDialogMedia;
$("dialog-media-grid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-use-asset]"); if (!button) return;
  const path = button.dataset.useAsset;
  if (assetIntent?.kind === "thumbnail") { current.thumbnail = path; if (!current.thumbnailAlt) current.thumbnailAlt = path.split("/").pop(); fillInspector(); }
  else if (assetIntent?.kind === "block") {
    const block = current.blocks[assetIntent.index];
    if (["gallery", "carousel"].includes(block.type)) block.items.push({ src: path, alt: "", caption: "" }); else block.src = path;
    renderBlocksEditor();
  }
  markDirty(); $("media-dialog").close();
});
document.querySelectorAll("[data-close-dialog]").forEach((button) => button.onclick = () => button.closest("dialog").close());

$("outline-list").addEventListener("click", (event) => { const button = event.target.closest("[data-outline-index]"); if (!button) return; const node = document.querySelector(`.editor-block[data-index="${button.dataset.outlineIndex}"]`); node?.scrollIntoView({ behavior: "smooth", block: "center" }); node?.classList.add("selected-block"); });
$("live-preview-article").addEventListener("click", (event) => { const button = event.target.closest("[data-toc-index]"); if (!button) return; event.preventDefault(); $("live-preview-article").querySelector(`#ns-heading-${button.dataset.tocIndex}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); });
$("version-list").addEventListener("click", async (event) => {
  const button = event.target.closest("[data-restore-version]"); if (!button) return;
  const version = savedVersions.find((item) => item.id === button.dataset.restoreVersion); if (!version) return;
  if (!confirm(`Restore the local editor to the version from ${new Date(version.savedAt).toLocaleString()}? This will overwrite the current browser draft after saving.`)) return;
  current = deepCopy(version.post); uploads = deepCopy(version.uploads || []); $("doc-title").value = current.title || ""; $("doc-excerpt").value = current.excerpt || ""; $("doc-intro").value = current.intro || ""; fillInspector(); renderBlocksEditor(); markDirty({ checkpoint: true }); await persistDraft(); toast("Version restored locally. Publish when you are ready.");
});
$("load-published-history").onclick = async () => {
  if (!current || !publisher) return;
  $("published-history").innerHTML = '<p class="fine">Reading GitHub commit history…</p>';
  try {
    const commits = await publisher.contentHistory(12);
    publishedHistory = [];
    for (const commit of commits) {
      const data = await publisher.contentAtCommit(commit.sha);
      const post = data.posts.find((item) => item.id === current.id && item.status === "published");
      if (post) publishedHistory.push({ ...commit, post });
    }
    $("published-history").innerHTML = publishedHistory.map((entry) => `<button type="button" data-published-version="${esc(entry.sha)}">${formatDate(entry.date)} · ${esc(entry.message.slice(0, 50))}</button>`).join("") || '<p class="fine">No earlier published versions of this piece were found.</p>';
  } catch (error) { $("published-history").innerHTML = `<p class="fine">Could not load GitHub history: ${esc(error.message)}</p>`; }
};
$("published-history").addEventListener("click", (event) => {
  const button = event.target.closest("[data-published-version]"); if (!button) return;
  const version = publishedHistory.find((entry) => entry.sha === button.dataset.publishedVersion); if (!version) return;
  if (dirty && !confirm("Replace the current browser draft with this published version? The current live version stays published until you publish the restored draft.")) return;
  previous = deepCopy(posts.find((item) => item.id === current.id) || previous);
  current = createPost(version.post.type, version.post);
  uploads = [];
  $("doc-title").value = current.title || ""; $("doc-excerpt").value = current.excerpt || ""; $("doc-intro").value = current.intro || "";
  fillInspector(); renderBlocksEditor(); dirty = true; markDirty({ checkpoint: true });
  setDeploy("Earlier GitHub version loaded as a browser draft. Review it, then publish to restore it on the live site.");
  toast("Published version loaded into this draft.");
});
$("compare-versions").onclick = () => {
  const options = savedVersions.slice(0, 4);
  $("version-compare").innerHTML = options.length ? options.map((version) => `<section><h3>${new Date(version.savedAt).toLocaleString()}</h3><p>${esc(version.post.title)}</p><pre>${esc(`${version.post.excerpt || ""}\n\n${extractPlainBody(version.post.blocks)}`)}</pre><button class="chip" type="button" data-restore-version="${esc(version.id)}">Restore this</button></section>`).join("") : '<p class="fine">Save at least two local versions to compare writing.</p>';
  $("versions-dialog").showModal();
};
$("version-compare").addEventListener("click", (event) => { const button = event.target.closest("[data-restore-version]"); if (button) { $("versions-dialog").close(); $("version-list").querySelector(`[data-restore-version="${button.dataset.restoreVersion}"]`)?.click(); } });
$("save-note").addEventListener("click", () => void attachNote());

window.addEventListener("beforeunload", (event) => { if (dirty || busy) { event.preventDefault(); event.returnValue = ""; } });
window.addEventListener("pagehide", () => { if (current && dirty) void persistDraft(); });
