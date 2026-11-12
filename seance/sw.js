// Le service worker de l'appli client : hors ligne une fois ouverte.
// Réseau d'abord (une nouvelle version publiée arrive tout de suite),
// le cache si le réseau manque ou tarde. Les données de la séance ne
// passent jamais ici : elles sont dans la partie « #… » de l'adresse, que
// le navigateur n'envoie jamais.
const CACHE = 'ma-seance-v1';
const COEUR = [
  './',
  'index.html',
  'flutter_bootstrap.js',
  'main.dart.js',
  'manifest.json',
  'favicon.png',
  'icons/Icon-192.png',
  'icons/apple-touch-icon.png',
  'splash/enso.webp',
  'splash/plume_nuit_m.webp',
  'fonts/Cinzel-Bold.ttf',
  'assets/AssetManifest.bin.json',
  'assets/FontManifest.json',
  'assets/fonts/MaterialIcons-Regular.otf',
  'assets/assets/images/logo.png',
  'assets/assets/fonts/Manrope-Regular.ttf',
  'assets/assets/fonts/Manrope-SemiBold.ttf',
  'assets/assets/fonts/Manrope-Bold.ttf',
  'assets/assets/fonts/Manrope-ExtraBold.ttf',
  'assets/assets/fonts/ShipporiMincho-Bold.ttf',
  'assets/assets/fonts/ShipporiMincho-ExtraBold.ttf',
  'r/',
];

// Le moteur de dessin : seulement la variante que ce navigateur charge
// (Chrome et ses cousins : chromium/, les autres : la complète), pour ne
// pas télécharger deux fois 6 Mo sur le téléphone.
const MOTEUR = /Chrome\//.test(self.navigator.userAgent)
  ? ['canvaskit/chromium/canvaskit.js', 'canvaskit/chromium/canvaskit.wasm']
  : ['canvaskit/canvaskit.js', 'canvaskit/canvaskit.wasm'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all([...COEUR, ...MOTEUR].map((u) => c.add(new Request(u, { cache: 'reload' })).catch(() => {})))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((cles) => Promise.all(cles.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function delai(ms) {
  return new Promise((_, rejeter) => setTimeout(() => rejeter(new Error('délai')), ms));
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const rep = await Promise.race([fetch(req), delai(4000)]);
      if (rep && rep.ok) cache.put(req, rep.clone());
      return rep;
    } catch (_) {
      const garde = await cache.match(req, { ignoreSearch: true });
      if (garde) return garde;
      if (req.mode === 'navigate') {
        const page = await cache.match(new URL(req.url).pathname.endsWith('/r/') ? 'r/' : './');
        if (page) return page;
      }
      return Response.error();
    }
  })());
});
