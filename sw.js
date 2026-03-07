const CACHE_NAME = "chair-islamic-cache-v1";
const urlsToCache = [
  "/chair-islamic-t.v./index.html",
  "/chair-islamic-t.v./styles.css",
  "/chair-islamic-t.v./logo.png",
  "https://www.youtube.com/embed/zGIBIOMA0PQ",
  "https://streaming.radio.co/s82a6f97f9/listen",
  // add any other assets you want cached
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
