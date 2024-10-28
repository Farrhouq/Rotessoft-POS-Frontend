self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/main.css", // Add paths to your CSS files
        "/app.js", // Add paths to your JS files
        // "/icons/icon-192x192.png", // Add paths to your icons
        // "/icons/icon-512x512.png",
        "/rotessoft-icon.png",
      ]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
