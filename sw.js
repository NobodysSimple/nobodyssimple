/* Nobody's Simple — Stage 8 service worker.
 * A small, reliable install cache and deliberate offline fallback. Public
 * static assets may be cached; Firebase requests and personal data never are.
 * New assets are cached when visited rather than forcing a large precache.
 */
const CACHE = 'nobodyssimple-release-v184-south-asia-iran';
const OWN_CACHE_PREFIXES = ['nobodyssimple-v', 'nobodyssimple-release-v'];
const SCOPE = self.registration.scope;
const OFFLINE = new URL('offline.html', SCOPE).href;
const INSTALL_ESSENTIAL = ['offline.html'];
const INSTALL_OPTIONAL = [
  'index.html', 'logo.png', 'manifest.webmanifest',
  'styles.css', 'account.css', 'strategy.css', 'community.css',
  'app-design.css', 'ns-shell.css', 'ns-home.css',
  'ns-tool-library.css', 'ns-learn.css', 'ns-field-guide.css',
  'ns-integrations.css', 'ns-vision.css', 'ns-home-refined.css',
  'lifestyle.css', 'lifestyle.mjs', 'simplyfocus.mjs', 'strategy.mjs', 'site.mjs', 'ns-shell.mjs',
  'ns-home-updates.mjs', 'ns-cultural-atlas.css', 'ns-cultural-atlas.mjs', 'ns-cultural-atlas-investigations.mjs', 'ns-cultural-atlas-south-asia.mjs', 'ns-cultural-atlas-articles.mjs', 'ns-cultural-atlas-viewport.mjs', 'ns-cultural-atlas-geography.mjs', 'ns-investigate.mjs', 'ns-investigate.css',
  'ns-problem-map.mjs', 'ns-universal-console.mjs', 'ns-problem-guide.mjs', 'ns-emotional-calculator.css',
  'ns-precision-content.mjs', 'ns-precision-console.mjs', 'ns-precision-guide.mjs', 'ns-precision.css',
  'ns-inclusive-topics-a.mjs','ns-inclusive-topics-b.mjs','ns-inclusive-topics.mjs',
   'ns-atlas-extended.mjs','ns-atlas-variations.mjs','ns-atlas-extended-variations.mjs','ns-atlas-core.mjs','ns-atlas-console.mjs',
  'ns-atlas-session.mjs','ns-atlas-worksheets.mjs','ns-atlas-guide.mjs','ns-atlas-tool.mjs','ns-atlas.css',
  'ns-reasoning-model.mjs','ns-reasoning-console.mjs','ns-reasoning-bridge.mjs','ns-reasoning.css',
  'ns-needs-catalog.mjs','ns-needs-console.mjs', 'ns-needs-themes.mjs','ns-needs-activities.mjs','ns-needs.css',
  'ns-steady-guide-utils.mjs','ns-steady-guides-a.mjs','ns-steady-guides-b.mjs','ns-steady-guidebook.mjs','ns-steady-guidebook.css',
  'ns-pathway-content.mjs','ns-pathway-guidebook.mjs',
  'ns-integrated-workbook-data.mjs','ns-integrated-workbook.mjs','ns-integrated-workbook.css',
  'ns-intervention-cards.mjs','ns-intervention-chooser.mjs', 'ns-topic-reading-data.mjs', 'ns-topic-reading-ui.mjs','ns-intervention-chooser.css',
  'ns-regulation-games-data.mjs','ns-regulation-games.mjs','ns-regulation-games.css',
];
const PUBLIC_EXTENSION = /\.(?:css|mjs|js|webp|avif|png|jpe?g|svg|gif|ico|woff2?|mp3|ogg|wav)$/i;
const SAFE_QUERY = /^\?v=[a-z0-9._-]{1,40}$/i;
const EXCLUDED_PATH = /(?:^|\/)(?:admin|staff)(?:\.html|\/|$)/i;
const isOwnCache = name => OWN_CACHE_PREFIXES.some(prefix => name.startsWith(prefix));
const safePublicRequest = (request, url) => {
  if (request.method !== 'GET' || url.origin !== self.location.origin) return false;
  if (!url.href.startsWith(SCOPE) || request.headers.has('authorization')) return false;
  if (EXCLUDED_PATH.test(url.pathname)) return false;
  if (url.search && !SAFE_QUERY.test(url.search)) return false;
  if (url.pathname.endsWith('/content.json')) return true; // Published site content only.
  return PUBLIC_EXTENSION.test(url.pathname);
};
const cacheable = response => {
  if (!response || response.status !== 200 || response.type === 'opaque') return false;
  const policy = response.headers.get('cache-control') || '';
  return !/\b(?:private|no-store)\b/i.test(policy) && !response.headers.has('set-cookie');
};

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // The offline fallback is the one critical resource. Optional network
    // errors must not abort installing an otherwise functional update.
    for (const path of INSTALL_ESSENTIAL) await cache.add(new URL(path, SCOPE).href);
    await Promise.allSettled(INSTALL_OPTIONAL.map(path => cache.add(new URL(path, SCOPE).href)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name !== CACHE && isOwnCache(name)).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(SCOPE)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await fetch(request); // Current pages, never an accidentally stale app shell.
      } catch {
        const cache = await caches.open(CACHE);
        return await cache.match(OFFLINE) || new Response('You are offline. Reconnect and reload.', {
          status: 503, headers: {'Content-Type':'text/plain; charset=utf-8'}
        });
      }
    })());
    return;
  }
  if (!safePublicRequest(request, url)) return; // Auth, API and unknown paths bypass caches.

  // Ignore an approved version query in the cache key, not in the HTTP fetch.
  const key = new URL(url.pathname, url.origin).href;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (cacheable(response)) {
        event.waitUntil(cache.put(key, response.clone()).catch(() => {}));
      }
      return response;
    } catch {
      return await cache.match(key) || new Response('Offline: this file is not available yet.', {
        status: 503, headers: {'Content-Type':'text/plain; charset=utf-8'}
      });
    }
  })());
});
