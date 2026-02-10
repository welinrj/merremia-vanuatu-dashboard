var CACHE_NAME = 'merremia-collector-v8';
var URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/depc-logo.png',
  './assets/vanuatu-coat-of-arms.png',
  './assets/favicon-32.png',
  './assets/favicon-180.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; })
             .map(function(n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Don't cache GitHub API calls or raw content
  if (event.request.url.includes('api.github.com') || event.request.url.includes('raw.githubusercontent.com')) return;

  // Network-first: always try to get fresh code, fall back to cache when offline
  event.respondWith(
    fetch(event.request).then(function(response) {
      if (response && response.status === 200) {
        var clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, clone);
        });
      }
      return response;
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});
