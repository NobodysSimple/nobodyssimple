import { safeAsset, validatePost } from "./core.mjs";

const mediaType = (path) => /\.(?:png|jpe?g|webp|gif)$/i.test(path) ? "image" : /\.(?:mp3|m4a|ogg|wav)$/i.test(path) ? "audio" : "pdf";

function postMedia(post) {
  const found = new Map();
  const add = (path, detail = {}) => {
    if (!safeAsset(path)) return;
    found.set(path, { path, title: post.title || "", contentType: post.type || "", tags: post.topics || [], updatedAt: post.updatedAt || new Date().toISOString(), ...detail });
  };
  add(post.thumbnail, { alt: post.thumbnailAlt || "", caption: "" });
  add(post.socialImage, { alt: post.thumbnailAlt || "", caption: "" });
  const visit = (blocks = []) => {
    for (const block of blocks || []) {
      add(block.src, { alt: block.alt || "", caption: block.caption || "" });
      for (const item of block.items || []) add(item.src || item.image, { alt: item.alt || "", caption: item.caption || "" });
      for (const column of block.columns || []) visit(column);
    }
  };
  visit(post.blocks);
  return [...found.values()];
}

function mergeMediaIndex(existing = [], uploads = [], post = null) {
  const index = new Map((Array.isArray(existing) ? existing : []).filter((item) => safeAsset(item.path)).map((item) => [item.path, item]));
  for (const asset of uploads || []) {
    if (!safeAsset(asset.path)) continue;
    index.set(asset.path, { path: asset.path, name: asset.path.split("/").pop(), kind: mediaType(asset.path), createdAt: asset.createdAt || new Date().toISOString(), ...(index.get(asset.path) || {}) });
  }
  if (post) {
    for (const item of postMedia(post)) {
      const prior = index.get(item.path) || { path: item.path, name: item.path.split("/").pop(), kind: mediaType(item.path), createdAt: new Date().toISOString() };
      index.set(item.path, { ...prior, ...item, kind: mediaType(item.path), tags: [...new Set(item.tags || [])] });
    }
  }
  return [...index.values()];
}

export class Publisher {
  constructor(token, request = (...args) => globalThis.fetch(...args)) {
    this.token = token;
    this.request = request;
    this.owner = "NobodysSimple";
    this.repo = "nobodyssimple";
    this.branch = "main";
  }

  async api(path, method = "GET", body) {
    const response = await this.request(`https://api.github.com${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!response.ok) {
      if (response.status === 401) throw Error("GitHub could not authenticate this token. Check whether it has expired.");
      if (response.status === 403 || response.status === 404) throw Error("GitHub denied access. Check that the token can access NobodysSimple/nobodyssimple and has Contents: Read and write.");
      if (response.status === 409 || response.status === 422) throw Error("The repository changed, or a branch rule prevented publishing. Reload the studio and try again. Your browser draft is still saved.");
      throw Error(`GitHub could not complete this operation (${response.status}). Your browser draft is still saved.`);
    }
    return response.status === 204 ? null : response.json();
  }

  get base() {
    return `/repos/${this.owner}/${this.repo}`;
  }

  async connect() {
    const user = await this.api("/user");
    // GitHub's repository write permission is the actual publishing role.
    // No Firebase site-member role or public username grants this access.
    const repo = await this.api(this.base);
    if (!repo.permissions?.push) throw Error("This GitHub account needs repository write access to publish.");
    await this.api(`${this.base}/git/ref/heads/${this.branch}`);
    return user;
  }

  async snapshot() {
    const ref = await this.api(`${this.base}/git/ref/heads/${this.branch}`);
    const head = ref.object.sha;
    const commit = await this.api(`${this.base}/git/commits/${head}`);
    const file = await this.api(`${this.base}/contents/content.json?ref=${head}`);
    const data = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\s/g, "")), (c) => c.charCodeAt(0))));
    if (!Array.isArray(data.posts)) throw Error("The content index is not in the expected format.");
    let assets = [];
    try {
      const tree = await this.api(`${this.base}/git/trees/${commit.tree.sha}?recursive=1`);
      const mediaIndex = new Map((Array.isArray(data.mediaAssets) ? data.mediaAssets : []).map((item) => [item.path, item]));
      assets = (tree.tree || []).filter((entry) => entry.type === "blob" && safeAsset(entry.path)).map((entry) => ({ path: entry.path, size: entry.size || 0, ...(mediaIndex.get(entry.path) || {}) }));
    } catch {
      // Publishing remains available if the repository's asset tree is too large.
    }
    return { head, tree: commit.tree.sha, data, assets };
  }

  // Topics use their own versioned repository file. A publish is an
  // authenticated non-force GitHub commit, not a write to localStorage.
  async topicSnapshot() {
    const ref=await this.api(`${this.base}/git/ref/heads/${this.branch}`);
    const head=ref.object.sha;
    const commit=await this.api(`${this.base}/git/commits/${head}`);
    // Use Git blob instead of the Contents API, which stops returning file
    // bodies beyond 1 MB. This registry can grow as more topics are edited.
    const root=await this.api(`${this.base}/git/trees/${commit.tree.sha}`);
    const file=(root.tree||[]).find(x=>x.path==='topic-content.json'&&x.type==='blob');
    if(!file)throw Error('The topic registry is missing on GitHub. Update the site before using the topic editor.');
    const blob=await this.api(`${this.base}/git/blobs/${file.sha}`);
    if(blob.encoding!=='base64'||typeof blob.content!=='string')throw Error('GitHub returned an unsupported topic data format.');
    const data=JSON.parse(new TextDecoder().decode(Uint8Array.from(
      atob(blob.content.replace(/\s/g,'')),ch=>ch.charCodeAt(0))));
    if(!Array.isArray(data?.topics))throw Error('Invalid topic publication registry.');
    return {head,tree:commit.tree.sha,data};
  }
  async updateTopics(targetId,expectedRecord,record=null,action='Publish'){
    const snapshot=await this.topicSnapshot();
    const found=snapshot.data.topics.find(x=>x.id===targetId)||null;
    if(JSON.stringify(found)!==JSON.stringify(expectedRecord||null)){
      throw Error('This topic changed on GitHub since it was opened. Reload the latest version before publishing.');
    }
    const next={...snapshot.data,version:1,topics:[
      ...snapshot.data.topics.filter(x=>x.id!==targetId),
      ...(record?[record]:[])
    ]};
    const tree=await this.api(`${this.base}/git/trees`,'POST',{
      base_tree:snapshot.tree,
      tree:[{path:'topic-content.json',mode:'100644',type:'blob',content:JSON.stringify(next,null,2)+'\n'}]
    });
    const commit=await this.api(`${this.base}/git/commits`,'POST',{
      message:action+' topic: '+targetId,tree:tree.sha,parents:[snapshot.head]
    });
    await this.api(`${this.base}/git/refs/heads/${this.branch}`,'PATCH',{sha:commit.sha,force:false});
    return {sha:commit.sha,record:record||null};
  }
  async publishTopic(record,expectedRecord=null){
    if(!record?.id||!/^[a-z][a-z0-9-]{2,89}$/.test(record.id))throw Error('Topic ID must use lowercase letters, numbers and dashes.');
    return this.updateTopics(record.id,expectedRecord,record,record.status==='archived'?'Archive':'Publish');
  }
  async deleteTopic(id,expectedRecord){
    if(!expectedRecord)throw Error('This topic has no published version to delete.');
    return this.updateTopics(id,expectedRecord,null,'Delete');
  }

  async contentHistory(limit = 12) {
    const commits = await this.api(`${this.base}/commits?path=content.json&per_page=${Math.max(1, Math.min(20, limit))}`);
    return commits.map((item) => ({ sha: item.sha, message: item.commit?.message || "Content update", date: item.commit?.author?.date || "" }));
  }

  async contentAtCommit(sha) {
    const file = await this.api(`${this.base}/contents/content.json?ref=${encodeURIComponent(sha)}`);
    const data = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(file.content.replace(/\s/g, "")), (c) => c.charCodeAt(0))));
    if (!Array.isArray(data.posts)) throw Error("The historical content index has an unexpected format.");
    return data;
  }

  async commitContent(next, assets, title, expectedPost = null, operation = "publish") {
    const snapshot = await this.snapshot();
    const existing = snapshot.data.posts.find((post) => post.id === title.id);
    if (existing && (!expectedPost || JSON.stringify(existing) !== JSON.stringify(expectedPost))) throw Error("This piece has changed since you opened it. Reload the studio, open the latest version, and reapply your changes.");
    if (expectedPost && !existing) throw Error("This piece was removed since you opened it. Reload before continuing.");
    const tree = [];
    for (const asset of assets || []) {
      if (!safeAsset(asset.path) || !/^[A-Za-z0-9+/=]*$/.test(asset.base64 || "")) throw Error("One uploaded media file is not supported.");
      const blob = await this.api(`${this.base}/git/blobs`, "POST", { content: asset.base64, encoding: "base64" });
      tree.push({ path: asset.path, mode: "100644", type: "blob", sha: blob.sha });
    }
    tree.push({ path: "content.json", mode: "100644", type: "blob", content: `${JSON.stringify(next, null, 2)}\n` });
    const newTree = await this.api(`${this.base}/git/trees`, "POST", { base_tree: snapshot.tree, tree });
    const commit = await this.api(`${this.base}/git/commits`, "POST", {
      message: `${operation}: ${title.title || title.id}`,
      tree: newTree.sha,
      parents: [snapshot.head],
    });
    await this.api(`${this.base}/git/refs/heads/${this.branch}`, "PATCH", { sha: commit.sha, force: false });
    return { sha: commit.sha, data: next };
  }

  async publish(post, assets = [], previous = null) {
    validatePost(post);
    const snapshot = await this.snapshot();
    const existing = snapshot.data.posts.find((item) => item.id === post.id);
    if (existing && (!previous || JSON.stringify(existing) !== JSON.stringify(previous))) throw Error("This piece has changed since you opened it. Reload the studio, open the latest version, and reapply your changes.");
    if (previous && !existing) throw Error("This piece was removed since you opened it. Reload before publishing.");
    const uploads = [];
    for (const asset of assets || []) {
      if (!safeAsset(asset.path) || !/^[A-Za-z0-9+/=]*$/.test(asset.base64 || "")) throw Error("One uploaded media file is not supported.");
      const blob = await this.api(`${this.base}/git/blobs`, "POST", { content: asset.base64, encoding: "base64" });
      uploads.push({ path: asset.path, mode: "100644", type: "blob", sha: blob.sha });
    }
    const next = {
      ...snapshot.data,
      posts: [post, ...snapshot.data.posts.filter((item) => item.id !== post.id)],
      mediaAssets: mergeMediaIndex(snapshot.data.mediaAssets, assets, post),
    };
    uploads.push({ path: "content.json", mode: "100644", type: "blob", content: `${JSON.stringify(next, null, 2)}\n` });
    const newTree = await this.api(`${this.base}/git/trees`, "POST", { base_tree: snapshot.tree, tree: uploads });
    const operation = previous && existing ? "Update" : post.status === "published" ? "Publish" : "Unpublish";
    const commit = await this.api(`${this.base}/git/commits`, "POST", { message: `${operation}: ${post.title}`, tree: newTree.sha, parents: [snapshot.head] });
    await this.api(`${this.base}/git/refs/heads/${this.branch}`, "PATCH", { sha: commit.sha, force: false });
    return { sha: commit.sha, data: next };
  }

  async deletePost(id, previous) {
    const snapshot = await this.snapshot();
    const existing = snapshot.data.posts.find((post) => post.id === id);
    if (!existing || JSON.stringify(existing) !== JSON.stringify(previous)) throw Error("This piece has changed since it was opened. Reload it before deleting.");
    const next = { ...snapshot.data, posts: snapshot.data.posts.filter((post) => post.id !== id) };
    const newTree = await this.api(`${this.base}/git/trees`, "POST", { base_tree: snapshot.tree, tree: [{ path: "content.json", mode: "100644", type: "blob", content: `${JSON.stringify(next, null, 2)}\n` }] });
    const commit = await this.api(`${this.base}/git/commits`, "POST", { message: `Delete content: ${existing.title}`, tree: newTree.sha, parents: [snapshot.head] });
    await this.api(`${this.base}/git/refs/heads/${this.branch}`, "PATCH", { sha: commit.sha, force: false });
    return { sha: commit.sha, data: next };
  }

  async publishAssets(assets = []) {
    if (!assets.length) return { sha: "", assets: [] };
    const snapshot = await this.snapshot();
    const tree = [];
    for (const asset of assets) {
      if (!safeAsset(asset.path) || !/^[A-Za-z0-9+/=]*$/.test(asset.base64 || "")) throw Error("One uploaded media file is not supported.");
      const blob = await this.api(`${this.base}/git/blobs`, "POST", { content: asset.base64, encoding: "base64" });
      tree.push({ path: asset.path, mode: "100644", type: "blob", sha: blob.sha });
    }
    const next = { ...snapshot.data, mediaAssets: mergeMediaIndex(snapshot.data.mediaAssets, assets) };
    tree.push({ path: "content.json", mode: "100644", type: "blob", content: `${JSON.stringify(next, null, 2)}\n` });
    const newTree = await this.api(`${this.base}/git/trees`, "POST", { base_tree: snapshot.tree, tree });
    const commit = await this.api(`${this.base}/git/commits`, "POST", { message: `Add ${assets.length} media asset${assets.length === 1 ? "" : "s"}`, tree: newTree.sha, parents: [snapshot.head] });
    await this.api(`${this.base}/git/refs/heads/${this.branch}`, "PATCH", { sha: commit.sha, force: false });
    return { sha: commit.sha, assets: assets.map(({ path }) => ({ path })) };
  }

  disconnect() {
    this.token = "";
  }
}
