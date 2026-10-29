const CACHE = "nobodyssimple-v110-intervention-book";
const SHELL = [
  "./",
  "index.html",
  "app-design.css",
  "intervention-book.css",
  "intervention-book.mjs",
  "intervention-data.mjs",
  "app-design.mjs",
  "ns-home-hero.webp",
  "ns-home-console.webp",
  "ns-character-base.webp",
  "ns-character-building.webp",
  "ns-character-checklist.webp",
  "ns-character-compass.webp",
  "ns-character-confused.webp",
  "ns-character-drawing.webp",
  "ns-character-friends.webp",
  "ns-character-guide.webp",
  "ns-character-helping.webp",
  "ns-character-hiking.webp",
  "ns-character-lantern.webp",
  "ns-character-mapping.webp",
  "ns-character-meditate.webp",
  "ns-character-message.webp",
  "ns-character-moon.webp",
  "ns-character-plant.webp",
  "ns-character-radio.webp",
  "ns-character-reading.webp",
  "ns-character-shield.webp",
  "ns-character-sitting.webp",
  "ns-character-solving.webp",
  "ns-character-star.webp",
  "ns-character-teaching.webp",
  "ns-character-thinking.webp",
  "ns-character-waiting.webp",
  "ns-character-watering.webp",
  "ns-character-wave.webp",
  "ns-character-writing.webp",
  "ns-landscape-calm.webp",
  "ns-landscape-choose.webp",
  "ns-landscape-clouds.webp",
  "ns-landscape-desk.webp",
  "ns-landscape-feel.webp",
  "ns-landscape-fireside.webp",
  "ns-landscape-forest.webp",
  "ns-landscape-identity.webp",
  "ns-landscape-learn.webp",
  "ns-landscape-mountains.webp",
  "ns-landscape-night.webp",
  "ns-landscape-path.webp",
  "ns-landscape-relate.webp",
  "ns-landscape-sunset.webp",
  "ns-landscape-think.webp",
  "ns-prop-backpack.webp",
  "ns-prop-book.webp",
  "ns-prop-cup.webp",
  "ns-prop-headphones.webp",
  "ns-prop-journal.webp",
  "ns-prop-lantern.webp",
  "ns-prop-leaf.webp",
  "ns-prop-notebook.webp",
  "ns-prop-pencil.webp",
  "ns-prop-plant.webp",
  "ns-prop-search.webp",
  "ns-prop-signpost.webp",

  "nd-play.html",
  "nd-play.css",
  "nd-play-v4.mjs",
  "styles.css",
  "community-ui.mjs", "community-data.mjs", "community-policy.mjs", "community.css",
  "site.mjs", "strategy.mjs", "tool-guidance.mjs", "strategy.css", "media/strategy/wisbody.png",
  "accounts.mjs", "account-config.mjs", "account-free.mjs", "account-policy.mjs", "account-storage.mjs", "account-sync.mjs", "account-i18n.mjs", "account.css", "account-play-bridge.mjs",
  "media/console/nobody-base.png", "media/console/nobody-comparing.png", "media/console/nobody-waiting.png", "media/console/nobody-positing.png",
  "media/avatars/base.png", "media/avatars/affirmed.png", "media/avatars/bowing.png", "media/avatars/dancing.png", "media/avatars/drawing.png", "media/avatars/excited-wave.png", "media/avatars/excited.png", "media/avatars/frolicking.png", "media/avatars/peering.png", "media/avatars/thinking.png", "media/avatars/reading.png", "media/avatars/running.png", "media/avatars/sitting.png", "media/avatars/still.png", "media/avatars/sulking.png", "media/avatars/waiting.png", "media/avatars/waltzing.png", "media/avatars/yippie.png",
  "quote-content.mjs",
  "features.mjs",
  "sensory-recipe.mjs",
  "social-battery.mjs",
  "load-balancer.mjs",
  "masking-map.mjs",
  "interactive-tools.mjs",
  "simplyfocus.mjs",
  "personality-test.mjs",
  "questionnaires.mjs",
  "life-navigation.mjs",
  "referrals.mjs",
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
  "kofi-profile.png",
  "half-banner.png",
  "simplyfocus-rain.mp3", "simplyfocus-fire.mp3", "simplyfocus-wind.mp3", "simplyfocus-ocean.mp3", "simplyfocus-bowl.mp3", "simplyfocus-pink.mp3", "simplyfocus-trees.mp3", "simplyfocus-lofi.mp3", "simplyfocus-focus.mp3", "simplyfocus-pomodoro-bell.mp3", "simplyfocus-task-tick.mp3",
];
const SAFE = new Set(
  SHELL.map((path) => new URL(path, self.registration.scope).pathname).concat(
    ["logo.png", "banner.png", "half-banner.png", "characters.png", "characters2.png"].map(
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
