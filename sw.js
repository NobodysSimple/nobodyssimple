const CACHE = "nobodyssimple-v23";
const SHELL = [
  "./",
  "index.html",
  "nd-play.html",
  "nd-play.css",
  "nd-play-v4.mjs",
  "styles.css",
  "site.mjs",
  "features.mjs",
  "interactive-tools.mjs",
  "simplyfocus.mjs",
  "personality-test.mjs",
  "personality-map.png",
  "tool-catalog.mjs",
  "emotion-profiles.mjs",
  "core.mjs",
  "data.mjs",
  "content.json",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "drew-profile.png",
];
const SAFE = new Set(
  SHELL.map((path) => new URL(path, self.registration.scope).pathname).concat(
    ["logo.png", "banner.png", "characters.png", "characters2.png"].map(
      (path) => new URL(path, self.registration.scope).pathname,
    ),
  ),
);
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting()),
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});
self.addEventListener("fetch", (event) => {
  const request = event.request,
    url = new URL(request.url);
  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    !SAFE.has(url.pathname) ||
    url.search ||
    request.headers.has("authorization")
  )
    return;
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE).then((cache) => cache.put(request, copy)),
          );
        }
        return response;
      })
      .catch(
        async () =>
          (await caches.match(request)) ||
          new Response("Offline: this resource has not been saved yet.", {
            status: 503,
          }),
      ),
  );
});
