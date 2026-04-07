const CACHE_NAME = 'azkar-offline-v7';

const CRITICAL_LOCAL = [
  './',
  './index.html',
  './data.js',
  './quran.js',
  './app.js',
  './adhan.min.js',
  './tailwind-fallback.css',
];

const CDN_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-brands-400.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-regular-400.woff2',
];

async function tryCache(cache, url) {
  try {
    const req = new Request(url, { mode: 'cors', credentials: 'omit' });
    const res = await fetch(req);
    if (res && res.status === 200) { await cache.put(req, res); return true; }
  } catch (e) { }
  return false;
}

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of CRITICAL_LOCAL) {
        try { await cache.add(url); } catch (e) { console.warn('[SW] cache miss:', url); }
      }
      for (const url of CDN_ASSETS) { await tryCache(cache, url); }
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  if (!url.startsWith('http')) return;

  if (url.includes('nominatim.openstreetmap')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const c = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, c));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const net = fetch(event.request).then(res => {
        if (res && res.status === 200) {
          const c = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, c));
        }
        return res;
      }).catch(() => null);
      return cached || net;
    })
  );
});
