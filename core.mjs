export const escapeHTML = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[c]);

const esc = escapeHTML;
const mediaPath = /^media\/[a-zA-Z0-9_.\/-]+\.(?:png|jpe?g|webp|gif|mp3|m4a|ogg|wav|pdf)$/i;
export const safeAsset = (value) =>
  mediaPath.test(value || "") && !value.split("/").includes("..")
    ? value
    : /^(?:logo|banner|characters2?)\.png$/.test(value || "")
      ? value
      : "";
export const safeImage = (value) =>
  /\.(?:png|jpe?g|webp|gif)$/i.test(value || "") ? safeAsset(value) : "";

export function safeHref(value) {
  const link = String(value || "").trim();
  if (!link) return "";
  if (/^(?:https?:|mailto:|tel:)/i.test(link)) return link;
  if (/^(?:\/|#|\.\/)/.test(link) && !/^\/\//.test(link)) return link;
  return "";
}

export function safeEmbedURL(value) {
  try {
    const url = new URL(String(value || "").trim());
    if (url.protocol !== "https:" || url.username || url.password) return "";
    const host = url.hostname.toLowerCase();
    const allowed = ["docs.google.com", "forms.office.com", "forms.gle", "open.spotify.com", "w.soundcloud.com", "player.vimeo.com", "public.flourish.studio"];
    if (!allowed.includes(host)) return "";
    if (host === "forms.gle") return "";
    if (host === "open.spotify.com" && !url.pathname.startsWith("/embed/")) url.pathname = `/embed${url.pathname}`;
    if (host === "docs.google.com" && url.pathname.includes("/forms/") && !url.searchParams.has("embedded")) url.searchParams.set("embedded", "true");
    return url.href;
  } catch {
    return "";
  }
}

export function youtubeID(value) {
  if (/^[\w-]{11}$/.test(value || "")) return value;
  try {
    const u = new URL(value);
    if (u.protocol !== "https:") return null;
    if (["youtu.be", "www.youtu.be"].includes(u.hostname))
      return /^[\w-]{11}$/.test(u.pathname.slice(1)) ? u.pathname.slice(1) : null;
    if (!["youtube.com", "www.youtube.com", "m.youtube.com", "www.youtube-nocookie.com"].includes(u.hostname)) return null;
    const id = u.pathname === "/watch" ? u.searchParams.get("v") : u.pathname.match(/^\/(?:embed|shorts|live)\/([\w-]{11})\/?$/)?.[1];
    return /^[\w-]{11}$/.test(id || "") ? id : null;
  } catch {
    return null;
  }
}

const ALLOWED_RICH_TAGS = new Set([
  "P", "H1", "H2", "H3", "H4", "H5", "H6", "DIV", "BR", "B", "I", "U", "STRONG", "EM", "S", "DEL", "SUP", "SUB", "MARK", "SPAN", "FONT", "CODE", "PRE", "UL", "OL", "LI", "BLOCKQUOTE", "A", "HR",
]);

function cleanColour(value) {
  const v = String(value || "").trim().toLowerCase();
  return /^(?:#[0-9a-f]{3,8}|(?:rgb|hsl)a?\([0-9%,.\s]+\)|[a-z]{3,20})$/.test(v) ? v : "";
}

function cleanBlockStyle(node, tag) {
  if (!["P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "BLOCKQUOTE", "LI"].includes(tag)) return "";
  const styles = [];
  const align = String(node.style?.textAlign || "").toLowerCase();
  if (["left", "center", "right", "justify"].includes(align)) styles.push("text-align:" + align);
  const marginLeft = String(node.style?.marginLeft || "").trim();
  if (/^(?:\d+(?:\.\d+)?)(?:px|em|rem)$/.test(marginLeft) && parseFloat(marginLeft) <= 160) styles.push("margin-left:" + marginLeft);
  const textIndent = String(node.style?.textIndent || "").trim();
  if (/^(?:\d+(?:\.\d+)?)(?:px|em|rem)$/.test(textIndent) && parseFloat(textIndent) <= 160) styles.push("text-indent:" + textIndent);
  return styles.length ? " style=\"" + styles.join(";") + "\"" : "";
}

// Rich text is stored as HTML for editing convenience, but only a small
// allow-list of formatting tags, link protocols, and colour values is emitted.
export function sanitizeRichHTML(value) {
  if (typeof DOMParser === "undefined") return esc(String(value || "")).replace(/\n/g, "<br>");
  const doc = new DOMParser().parseFromString(String(value || ""), "text/html");
  const render = (node) => {
    if (node.nodeType === Node.TEXT_NODE) return esc(node.nodeValue);
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const tag = node.tagName.toUpperCase();
    const children = [...node.childNodes].map(render).join("");
    if (!ALLOWED_RICH_TAGS.has(tag)) return children;
    if (tag === "A") {
      const href = safeHref(node.getAttribute("href"));
      return href ? `<a href="${esc(href)}"${node.getAttribute("target") === "_blank" ? ' target="_blank" rel="noopener noreferrer"' : ""}>${children}</a>` : children;
    }
    if (tag === "FONT") {
      const sizes = { "1": ".78em", "2": ".88em", "3": "1em", "4": "1.15em", "5": "1.32em", "6": "1.55em", "7": "1.8em" };
      const size = sizes[node.getAttribute("size") || ""];
      const colour = cleanColour(node.getAttribute("color"));
      const styles = [size ? `font-size:${size}` : "", colour ? `color:${colour}` : ""].filter(Boolean);
      return styles.length ? `<span style="${styles.join(";")}">${children}</span>` : children;
    }
    if (tag === "SPAN" || tag === "MARK") {
      const styles = [];
      const fg = cleanColour(node.style?.color);
      const bg = cleanColour(node.style?.backgroundColor);
      const fontSize = String(node.style?.fontSize || "").trim();
      if (fg) styles.push(`color:${fg}`);
      if (bg) styles.push(`background-color:${bg}`);
      if (/^(?:\d+(?:\.\d+)?)(?:px|em|rem|%)$/.test(fontSize) && parseFloat(fontSize) >= 0.5 && parseFloat(fontSize) <= 64) styles.push(`font-size:${fontSize}`);
      return `<${tag.toLowerCase()}${styles.length ? ` style="${styles.join(";")}"` : ""}>${children}</${tag.toLowerCase()}>`;
    }
    const name = tag.toLowerCase();
    const style = cleanBlockStyle(node, tag);
    return tag === "BR" || tag === "HR" ? `<${name}>` : `<${name}${style}>${children}</${name}>`;
  };
  return [...doc.body.childNodes].map(render).join("");
}

const blockHTML = (items) => (Array.isArray(items) ? items : []).map((item) => `<li>${esc(item?.text ?? item)}</li>`).join("");
const blockText = (b) => esc(b?.text || "").replace(/\n/g, "<br>");
const validEmbedRoutes = new Set(["#compass", "#questions", "#navigator", "#tools", "#simplyfocus", "#library"]);

export function renderBlocks(blocks, postIndex = []) {
  if (!Array.isArray(blocks)) return "";
  const render = (b, depth = 0) => {
    if (!b || typeof b !== "object" || depth > 2) return "";
    const type = b.type;
    const align = ["left", "center", "right"].includes(b.align) ? ` align-${b.align}` : "";
    const width = ["narrow", "standard", "wide", "full"].includes(b.width) ? ` width-${b.width}` : "";
    const line = { "1.3": "13", "1.5": "15", "1.7": "17", "1.9": "19", "2.1": "21" }[String(b.lineHeight)] || "";
    const spacing = { "-0.02": "minus", "0": "zero", "0.02": "02", "0.05": "05", "0.1": "10" }[String(b.letterSpacing)] || "";
    const textTone = ["forest", "sage", "orange", "charcoal", "muted"].includes(b.textTone) ? ` txt-${b.textTone}` : "";
    const classes = `content-block block-${esc(type || "unknown")}${align}${width}${line ? ` line-${line}` : ""}${spacing ? ` spacing-${spacing}` : ""}${textTone}`;
    const rich = sanitizeRichHTML(b.html || "");
    const title = b.title ? `<h3>${esc(b.title)}</h3>` : "";
    switch (type) {
      case "paragraph": return `<div class="${classes}"><div class="rich-content">${rich || `<p>${blockText(b)}</p>`}</div></div>`;
      case "heading": {
        const n = Math.max(2, Math.min(6, Number(b.level) || 2));
        const position = blocks.indexOf(b);
        return `<div class="${classes}"><h${n} id="ns-heading-${Math.max(0, position)}">${esc(b.text || "Untitled section")}</h${n}></div>`;
      }
      case "toc": {
        const maxLevel = Math.max(2, Math.min(6, Number(b.maxLevel) || 3));
        const items = blocks.map((item, index) => ({ item, index })).filter(({ item }) => item.type === "heading" && Number(item.level || 2) <= maxLevel);
        return items.length ? `<nav class="${classes} table-of-contents" aria-label="On this page"><strong>${esc(b.title || "On this page")}</strong>${items.map(({ item, index }) => `<button type="button" data-toc-index="${index}" class="toc-level-${Number(item.level) || 2}">${esc(item.text || "Section")}</button>`).join("")}</nav>` : "";
      }
      case "quote": return `<blockquote class="${classes}"><div class="rich-content">${rich || `<p>${blockText(b)}</p>`}</div>${b.attribution ? `<cite>${esc(b.attribution)}</cite>` : ""}</blockquote>`;
      case "pullquote": return `<figure class="${classes} pullquote"><blockquote>${rich || blockText(b)}</blockquote>${b.attribution ? `<figcaption>${esc(b.attribution)}</figcaption>` : ""}</figure>`;
      case "list": return `<div class="${classes}"><${b.ordered ? "ol" : "ul"}>${blockHTML(b.items)}</${b.ordered ? "ol" : "ul"}></div>`;
      case "checklist": return `<ul class="${classes} content-checklist">${(b.items || []).map((item) => `<li><span aria-hidden="true">${item.checked ? "☑" : "□"}</span> ${esc(item.text || "")}</li>`).join("")}</ul>`;
      case "callout": return `<aside class="${classes} callout tone-${esc(["idea", "important", "research", "reflection", "warning", "example", "question"].includes(b.tone) ? b.tone : "idea")}">${title}<div class="rich-content">${rich || `<p>${blockText(b)}</p>`}</div></aside>`;
      case "footnote": return `<aside class="${classes} footnote"><sup>${esc(b.number || "Note")}</sup> ${rich || blockText(b)}</aside>`;
      case "code": return `<pre class="${classes}"><code>${esc(b.text || "")}</code></pre>`;
      case "definition": return `<dl class="${classes} definition"><dt>${esc(b.term || "Term")}</dt><dd>${esc(b.text || "")}</dd></dl>`;
      case "image": {
        const src = safeImage(b.src);
        if (!src) return "";
        const href = b.lightbox ? src : safeHref(b.href);
        const focusX = Math.max(0, Math.min(100, Number(b.focalX ?? 50)));
        const focusY = Math.max(0, Math.min(100, Number(b.focalY ?? 50)));
        const rotation = [0, 90, 180, 270].includes(Number(b.rotate)) ? Number(b.rotate) : 0;
        const aspect = { "16:9": "16 / 9", "4:3": "4 / 3", "1:1": "1 / 1" }[b.ratio] || "auto";
        const ratioStyle = ` style="--image-focus-x:${focusX}%;--image-focus-y:${focusY}%;--image-ratio:${aspect};--image-rotation:${rotation}deg"`;
        const img = `<img src="${esc(src)}" alt="${esc(b.decorative ? "" : b.alt || "")}" loading="lazy"${b.decorative ? ' role="presentation"' : ""}${ratioStyle}>`;
        return `<figure class="${classes} media-image radius-${esc(["square", "soft", "round"].includes(b.radius) ? b.radius : "soft")}${b.border ? " image-bordered" : ""}">${href ? `<a href="${esc(href)}"${b.lightbox ? ' data-image-lightbox aria-label="Open full-size image"' : ""}>${img}</a>` : img}${b.caption || b.credit ? `<figcaption>${esc(b.caption || "")}${b.credit ? ` <small>Image: ${esc(b.credit)}</small>` : ""}</figcaption>` : ""}</figure>`;
      }
      case "gallery":
      case "carousel": return `<div class="${classes} media-gallery ${type === "carousel" ? "gallery-carousel" : ""}">${(b.items || []).filter((i) => safeImage(i.src)).map((i) => `<figure><img src="${esc(safeImage(i.src))}" alt="${esc(i.alt || "")}" loading="lazy">${i.caption ? `<figcaption>${esc(i.caption)}</figcaption>` : ""}</figure>`).join("")}</div>`;
      case "youtube": {
        const id = youtubeID(b.url);
        return id ? `<div class="${classes} video-block"><iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${esc(b.title || "YouTube video")}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>` : "";
      }
      case "embed": {
        const src = safeEmbedURL(b.url);
        return src ? `<figure class="${classes} external-embed"><figcaption>${esc(b.title || "Embedded content")}</figcaption><iframe src="${esc(src)}" title="${esc(b.title || "Embedded content")}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></figure>` : "";
      }
      case "audio": {
        const src = safeAsset(b.src);
        return src && /\.(?:mp3|m4a|ogg|wav)$/i.test(src) ? `<figure class="${classes} audio-block"><figcaption>${esc(b.title || "Audio")}</figcaption><audio controls preload="none" src="${esc(src)}">Your browser does not support audio playback.</audio></figure>` : "";
      }
      case "file": {
        const src = safeAsset(b.src);
        return src && /\.pdf$/i.test(src) ? `<a class="${classes} download-block" href="${esc(src)}" download>${esc(b.label || b.title || "Download resource")} ↓</a>` : "";
      }
      case "divider": return `<hr class="${classes}">`;
      case "spacer": return `<div class="${classes} spacer" style="--block-space:${Math.max(12, Math.min(180, Number(b.height) || 40))}px" aria-hidden="true"></div>`;
      case "columns": {
        const layout = { "first-wide": " layout-first-wide", "second-wide": " layout-second-wide" }[b.columnLayout] || "";
        return `<div class="${classes} content-columns columns-${Math.max(2, Math.min(3, b.columns?.length || 2))}${layout}">${(b.columns || []).slice(0, 3).map((col) => `<div>${renderBlocks(col, postIndex)}</div>`).join("")}</div>`;
      }
      case "table": {
        const rows = Array.isArray(b.rows) ? b.rows : [];
        return `<div class="${classes} table-wrap"><table class="${b.striped ? "striped" : ""}"><tbody>${rows.map((row, ri) => `<tr>${(row || []).map((cell) => ri === 0 && b.headerRow ? `<th scope="col">${esc(cell || "")}</th>` : `<td>${esc(cell || "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      }
      case "tabs": return `<div class="${classes} tab-block">${(b.items || []).map((item) => `<details><summary>${esc(item.title || "Open section")}</summary><div>${sanitizeRichHTML(item.html || "")}</div></details>`).join("")}</div>`;
      case "accordion": return `<div class="${classes} accordion-block">${(b.items || []).map((item) => `<details><summary>${esc(item.title || "Open section")}</summary><div class="rich-content">${sanitizeRichHTML(item.html || "")}</div></details>`).join("")}</div>`;
      case "card-grid": return `<div class="${classes} site-card-grid">${(b.items || []).map((item) => { const href = safeHref(item.href); return `<a class="site-card"${href ? ` href="${esc(href)}"` : ""}>${safeImage(item.image) ? `<img src="${esc(safeImage(item.image))}" alt="${esc(item.alt || "")}" loading="lazy">` : ""}<strong>${esc(item.title || "Explore")}</strong><span>${esc(item.text || "")}</span></a>`; }).join("")}</div>`;
      case "tool": {
        const route = validEmbedRoutes.has(b.route) ? b.route : "#tools";
        return `<section class="${classes} interactive-embed"><div><p class="eyebrow">Interactive experience</p><h3>${esc(b.title || "Explore a tool")}</h3><p>${esc(b.text || "Open this interactive experience in a new view.")}</p><a class="button" href="${esc(route)}">${esc(b.button || "Open interactive tool")} ↗</a></div><iframe src="./index.html${esc(route)}" title="${esc(b.title || "Interactive experience")}" loading="lazy"></iframe></section>`;
      }
      case "evidence": return `<aside class="${classes} evidence-box"><p class="eyebrow">Evidence note · ${esc(b.strength || "Interpretive")}</p>${title}<div class="rich-content">${rich || `<p>${blockText(b)}</p>`}</div>${b.source ? `<small>${esc(b.source)}</small>` : ""}</aside>`;
      case "takeaway": return `<aside class="${classes} takeaway-box"><p class="eyebrow">Key takeaway</p>${title}<div class="rich-content">${rich || `<p>${blockText(b)}</p>`}</div></aside>`;
      case "reflection": return `<aside class="${classes} reflection-box"><p class="eyebrow">Pause and reflect</p><p>${esc(b.text || "")}</p>${b.prompt ? `<blockquote>${esc(b.prompt)}</blockquote>` : ""}</aside>`;
      case "warning": return `<aside class="${classes} content-warning"><strong>Content note</strong><p>${esc(b.text || "")}</p></aside>`;
      case "glossary": return `<dl class="${classes} definition"><dt>${esc(b.term || "Term")}</dt><dd>${esc(b.text || "")}</dd></dl>`;
      case "button":
      case "cta": { const href = safeHref(b.href); return `<aside class="${classes} cta-block"><div><p class="eyebrow">${esc(b.eyebrow || "Explore next")}</p><h3>${esc(b.title || "Take a next step")}</h3>${b.text ? `<p>${esc(b.text)}</p>` : ""}</div>${href ? `<a class="button" href="${esc(href)}"${/^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(b.button || "Explore")} ↗</a>` : ""}</aside>`; }
      case "related": {
        const links = (b.items || []).map((item) => {
          const found = postIndex.find((p) => p.id === item.id);
          const title = found?.title || item.title;
          return title ? `<a class="related-link" href="#post/${encodeURIComponent(item.id || found?.id || "")}"><strong>${esc(title)}</strong><span>${esc(found?.excerpt || item.text || "Explore this next")}</span></a>` : "";
        }).join("");
        return links ? `<section class="${classes} related-block"><p class="eyebrow">Related content</p>${links}</section>` : "";
      }
      case "citation": return `<p class="${classes} citation">${esc(b.author || "")}${b.year ? ` (${esc(b.year)})` : ""}. <em>${esc(b.title || "Untitled source")}</em>${b.publication ? `. ${esc(b.publication)}` : ""}${safeHref(b.url) ? `. <a href="${esc(safeHref(b.url))}" target="_blank" rel="noopener noreferrer">View source ↗</a>` : ""}${b.doi ? `. DOI: ${esc(b.doi)}` : ""}</p>`;
      default: return "";
    }
  };
  return blocks.map((b) => render(b)).join("");
}

export function renderBody(body) {
  return String(body || "").split(/\n\s*\n/).map((block) => {
    const image = block.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image && safeImage(image[2])) return `<figure><img src="${esc(image[2])}" alt="${esc(image[1])}" loading="lazy"><figcaption>${esc(image[1])}</figcaption></figure>`;
    if (block.startsWith("## ")) return `<h2>${esc(block.slice(3))}</h2>`;
    if (block.startsWith("# ")) return `<h2>${esc(block.slice(2))}</h2>`;
    if (block.startsWith("> ")) return `<blockquote><p>${esc(block.slice(2))}</p></blockquote>`;
    return `<p>${esc(block).replace(/\n/g, "<br>")}</p>`;
  }).join("");
}

export function renderPostBody(post, posts = []) {
  return Array.isArray(post?.blocks) && post.blocks.length
    ? renderBlocks(post.blocks, posts)
    : renderBody(post?.body);
}

const CONTENT_TYPES = new Set(["blog", "education", "video", "resource", "lesson", "announcement", "download"]);
const BLOCK_TYPES = new Set(["paragraph", "heading", "toc", "quote", "pullquote", "list", "checklist", "callout", "footnote", "code", "definition", "image", "gallery", "carousel", "youtube", "embed", "audio", "file", "divider", "spacer", "columns", "table", "tabs", "accordion", "card-grid", "tool", "evidence", "takeaway", "reflection", "warning", "glossary", "button", "cta", "related", "citation"]);

export function validatePost(post) {
  if (!post.title?.trim()) throw Error("Add a title.");
  if (!CONTENT_TYPES.has(post.type)) throw Error("Choose a supported content type.");
  if (post.type === "video" && !youtubeID(post.youtube) && !post.blocks?.some((block) => block.type === "youtube" && youtubeID(block.url))) throw Error("Add a valid YouTube link.");
  if (post.type !== "video" && !post.body?.trim() && !post.blocks?.length) throw Error("Add content to this piece.");
  if (!post.destinations?.length) throw Error("Choose where this piece should appear.");
  if (post.type === "blog" && (post.destinations.length !== 1 || post.destinations[0] !== "blog")) throw Error("Blog posts belong in the blog. Use an education template for curriculum writing.");
  if (post.type !== "blog" && post.destinations.some((d) => d !== "library")) throw Error("Non-blog content belongs in the learning library.");
  if (post.thumbnail && !safeImage(post.thumbnail)) throw Error("Choose a supported thumbnail image.");
  for (const block of post.blocks || []) {
    if (!BLOCK_TYPES.has(block?.type)) throw Error("One of the content blocks is not supported.");
    if (block.type === "image" && block.src && !safeImage(block.src)) throw Error("An image block points to an unsupported media file.");
    if (block.type === "youtube" && !youtubeID(block.url)) throw Error("Check the YouTube URL in your video block.");
    if (block.type === "embed" && !safeEmbedURL(block.url)) throw Error("Use an HTTPS embed from Google Forms, Microsoft Forms, Spotify, SoundCloud, Vimeo, or Flourish.");
    if (["audio", "file"].includes(block.type) && block.src && !safeAsset(block.src)) throw Error("A media block points to an unsupported file.");
  }
  return post;
}

export const nearestEmotions = (emotions, x, y, n = 5) =>
  [...emotions].sort((a, b) => Math.hypot(a.x - x, a.y - y) - Math.hypot(b.x - x, b.y - y)).slice(0, n);
