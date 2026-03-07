const CACHE_NAME = "chair-islamic-cache-v2";

// List of assets to cache
const urlsToCache = [
  "/chair-islamic-t.v./index.html",
  "/chair-islamic-t.v./styles.css",
  "/chair-islamic-t.v./logo.png",
  "/chair-islamic-t.v./images/background.jpg",
  "/chair-islamic-t.v./sw.js",
  "https://www.youtube.com/embed/zGIBIOMA0PQ", // latest video
  "https://streaming.radio.co/s82a6f97f9/listen"
];

// Install event: cache everything
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Activate event: cleanup old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch event: respond with cache first, then network
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Cache YouTube/TikTok thumbnails
  if (url.hostname.includes("ytimg.com") || url.hostname.includes("tiktokcdn.com")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(networkResponse => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        })
      )
    );
    return;
  }

  // Default caching strategy
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
