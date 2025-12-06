// Service Worker for offline support and caching
const CACHE_NAME = 'achievingcoach-v1';
const urlsToCache = [
  '/',
  '/features',
  '/pricing',
  '/about',
  '/contact',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
