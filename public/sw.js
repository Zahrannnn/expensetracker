const CACHE_NAME = 'expense-tracker-v1';
const OFFLINE_URL = '/offline';
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Offline</title>
  <style>
    :root {
      color-scheme: dark;
      font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    body {
      margin: 0;
      min-height: 100vh;
      background: radial-gradient(circle at top, #1e293b, #0f172a);
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      max-width: 420px;
      width: 100%;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 28px;
      padding: 2.5rem;
      text-align: center;
      box-shadow: 0 20px 60px rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(14px);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      font-size: 0.8rem;
      background: rgba(250, 204, 21, 0.15);
      color: #fde68a;
      border: 1px solid rgba(250, 204, 21, 0.3);
    }
    h1 {
      margin: 1.5rem 0 0.75rem;
      font-size: 2rem;
    }
    p {
      margin: 0;
      color: rgba(248, 250, 252, 0.75);
      line-height: 1.5;
    }
    .chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin: 1.5rem 0;
      justify-content: center;
    }
    .chip {
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 0.4rem 1rem;
      font-size: 0.85rem;
      background: rgba(255, 255, 255, 0.05);
    }
    button, a {
      font: inherit;
      border: none;
      border-radius: 999px;
      padding: 0.9rem 1.2rem;
      width: 100%;
      cursor: pointer;
      transition: transform 0.15s ease, opacity 0.15s ease;
      text-decoration: none;
      display: inline-block;
    }
    button.primary {
      background: linear-gradient(135deg, #22d3ee, #6366f1);
      color: white;
      box-shadow: 0 15px 35px rgba(79, 70, 229, 0.3);
    }
    a.secondary {
      margin-top: 0.75rem;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f8fafc;
    }
    button:hover, a.secondary:hover {
      transform: translateY(-1px);
      opacity: 0.95;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">💡 Tip • You can keep exploring offline</div>
    <h1>You’re offline</h1>
    <p>No worries—your data is saved locally and will sync when you reconnect.</p>
    <div class="chips">
      <div class="chip">✅ Local data safe</div>
      <div class="chip">🔄 Auto-sync on return</div>
    </div>
    <button class="primary" onclick="window.location.reload()">Reconnect now</button>
    <a class="secondary" href="https://support.google.com/chrome/answer/187367" target="_blank" rel="noreferrer noopener">Get offline tips</a>
  </div>
</body>
</html>`;

const STATIC_ASSETS = [
  '/',
  '/offline',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.error('Failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL).then((response) => {
            if (response) return response;
            return new Response(OFFLINE_HTML, {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
          });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request).then((response) => {
            // Cache successful responses
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          });
        })
    );
  }
});

// Listen for skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

