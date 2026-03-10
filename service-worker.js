// worker.js
const cacheName = "chair-islamic-tv-v1";

// List of files to cache
const filesToCache = [
  "/",                   // index.html
  "/index.html",
  "/script.js",
  "/logo.png",
  "/logo-192.png",
  "/logo-512.png",
  "/logo-maskable.png",
  "/manifest.json",
  "/style.css"           // if you have external CSS
];

// Install event - cache files
self.addEventListener("install", event => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("[Service Worker] Caching app files");
      return cache.addAll(filesToCache);
    })
  );
});

// Activate event - clean old caches
self.addEventListener("activate", event => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(c => {
          if (c !== cacheName) {
            console.log("[Service Worker] Removing old cache:", c);
            return caches.delete(c);
          }
        })
      );
    })
  );
});

// Fetch event - respond with cache first, fallback to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        // Optionally: fallback page for offline
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
