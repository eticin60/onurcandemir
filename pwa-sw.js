// This file is deprecated. Please use service-worker.js instead.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.registration.unregister().then(() => self.clients.claim()));
