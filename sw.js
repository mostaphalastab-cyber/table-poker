// Table de décision, version 20261012080848 : le réseau d'abord (la nouvelle version dès qu'il y en a), sinon la copie gardée.
const CACHE = "table-20261012080848";
// vosk.js (le moteur de la dictée sans réseau) est gardé aussi ; son modèle, lui, reste sur l'appareil à part (IndexedDB).
const FICHIERS = ["./", "./index.html", "./manifest.webmanifest", "./icone-192.png", "./icone-512.png", "./vosk.js"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS))); self.skipWaiting(); });
// Seules ses propres anciennes copies s'en vont : l'appli du rallye vit à la même adresse (mostaphalastab-cyber.github.io)
// et partage la même réserve ; effacer tout le reste lui retirait sa copie hors ligne (vu le 12/10/2026).
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((k) => Promise.all(k.filter((n) => n.startsWith("table-") && n !== CACHE).map((n) => caches.delete(n))))); self.clients.claim(); });
self.addEventListener("fetch", (e) => {
  // Le modèle de la dictée (40 Mo) passe sans copie : Vosk le garde lui-même sur l'appareil après l'installation.
  if (e.request.method !== "GET" || e.request.url.endsWith(".tar.gz")) return;
  e.respondWith(fetch(e.request).then((r) => { if (r.ok) { const copie = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copie)); } return r; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match("./index.html"))));
});
