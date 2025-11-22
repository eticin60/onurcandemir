self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("onurcan-demir").then(cache => {
      return cache.addAll(["/", "/index.html", "/onurcandemir.png"]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
