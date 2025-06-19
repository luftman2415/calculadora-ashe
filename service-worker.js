const CACHE_NAME = 'ashe-calculator-v1';
const urlsToCache = [
  '/',
  './index.html',
  './manual.html',
  './style.css',
  './script.js',
  './LOGO ASHE SIN FONDO.png',
  './favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});