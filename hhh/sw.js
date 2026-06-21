/**
 * JOSEPH HOPE GLOBAL - SERVICE WORKER
 * Provides offline caching and PWA install support
 */

const CACHE_NAME = 'jhg-v1';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/images/logo2.png',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/images/joseph_hope_portrait.png',
  '/images/ebook_cover.png',
  '/images/hero_bg.png'
];

// Install: Pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: Cache-first strategy
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip non-http requests (chrome-extension, etc.)
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) return cachedResponse;

      // Otherwise fetch from network and cache it
      return fetch(event.request)
        .then((networkResponse) => {
          // Only cache valid responses from same origin
          if (
            networkResponse.ok &&
            event.request.url.startsWith(self.location.origin)
          ) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback: return index.html for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});
