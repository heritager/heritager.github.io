---
layout: null
---
const PRECACHE = 'precache-v2';
const RUNTIME = 'runtime';
const OFFLINE_URL = '{{ "/offline.html" | relative_url }}';
const HOSTNAME_WHITELIST = [
  self.location.hostname,
  'cdnjs.cloudflare.com'
];

const isNavigationRequest = (request) =>
  request.mode === 'navigate' ||
  (request.method === 'GET' && (request.headers.get('accept') || '').includes('text/html'));

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (!HOSTNAME_WHITELIST.includes(requestUrl.hostname)) {
    return;
  }

  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          event.waitUntil(
            caches.open(RUNTIME).then((cache) => cache.put(event.request, responseClone))
          );
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((response) => response || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok && requestUrl.origin === self.location.origin) {
          const responseClone = networkResponse.clone();
          event.waitUntil(
            caches.open(RUNTIME).then((cache) => cache.put(event.request, responseClone))
          );
        }
        return networkResponse;
      });
    })
  );
});
