const CACHE_NAME = "onurcan-demir-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/onurcandemir.png",
  "/manifest.json",
  "/loadingcrypto.json",
  "/welcome.json",
  "/cryptocoins.json",
  "/bitcoincryptocurrencycity.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(res => {
      return res || fetch(e.request);
    })
  );
});
