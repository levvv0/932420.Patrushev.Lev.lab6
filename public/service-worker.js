const cacheName = "future-forecasts-v1";
const staticFiles = [
  "/",
  "/about",
  "/index.html",
  "/about.html",
  "/style.css",
  "/script.js",
  "/pwa.js",
  "/manifest.json",
  "/img/photo.jpg",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll(staticFiles);
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.filter(function (name) {
        return name.startsWith("future-forecasts-") && name !== cacheName;
      }).map(function (name) {
        return caches.delete(name);
      }));
    })
  );
});

self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET" || url.origin !== self.location.origin ||
      url.pathname.startsWith("/api/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request);
    })
  );
});
