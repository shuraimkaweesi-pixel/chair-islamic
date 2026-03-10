const CACHE = "chair-islamic-tv-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/quran.html",
  "/hadith.html",
  "/prayer.html",
  "/videos.html",
  "/manifest.json",
  "/logo.png",
  "/logo-192.png",
  "/logo-512.png",
  "/logo-maskable.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
