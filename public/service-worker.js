/* ============================================
   🔧 Service Worker - Lo Quiero YA CM
   PWA con soporte offline
   ============================================ */

const CACHE_NAME = 'loquieroya-cm-v1.0.0';
const RUNTIME_CACHE = 'loquieroya-cm-runtime';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/admin.html',
  '/css/style.css',
  '/css/admin.css',
  '/css/ux-enhancements.css',
  '/js/app.js',
  '/js/admin.js',
  '/js/ux-manager.js',
  '/js/firebase-config.js',
  '/js/firebase.service.js',
  '/js/productos.service.js',
  '/js/pedidos.service.js',
  '/js/storage.service.js',
  '/js/auth.service.js',
  '/js/admin.service.js',
  '/js/utils/validators.js',
  '/js/utils/error-handler.js',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName.startsWith('loquieroya-cm-') && 
                     cacheName !== CACHE_NAME && 
                     cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Skip Firebase requests
  if (url.origin.includes('firebase') || 
      url.origin.includes('googleapis') ||
      url.origin.includes('gstatic')) {
    return;
  }

  // Skip n8n webhooks
  if (url.origin.includes('localhost:5678') || 
      url.pathname.includes('webhook')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('📦 Service Worker: Serving from cache:', request.url);
          return cachedResponse;
        }

        console.log('🌐 Service Worker: Fetching from network:', request.url);
        return fetch(request)
          .then((response) => {
            // Don't cache if not a success response
            if (!response || response.status !== 200 || response.type === 'opaque') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache runtime assets
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch((error) => {
            console.error('❌ Service Worker: Fetch failed:', error);
            
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            throw error;
          });
      })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync:', event.tag);
  
  if (event.tag === 'sync-pedidos') {
    event.waitUntil(syncPedidos());
  }
});

async function syncPedidos() {
  try {
    console.log('🔄 Service Worker: Syncing pedidos...');
    
    // Get pending pedidos from IndexedDB
    const pedidos = await getPendingPedidos();
    
    // Send to server
    for (const pedido of pedidos) {
      await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
    }
    
    // Clear pending pedidos
    await clearPendingPedidos();
    
    console.log('✅ Service Worker: Pedidos synced');
  } catch (error) {
    console.error('❌ Service Worker: Sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📬 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nuevo pedido recibido',
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'Ver Pedido'
      },
      {
        action: 'close',
        title: 'Cerrar'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Lo Quiero YA CM', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/admin.html')
    );
  }
});

// Message from clients
self.addEventListener('message', (event) => {
  console.log('💬 Service Worker: Message received:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Helper functions for IndexedDB (simplified)
async function getPendingPedidos() {
  // This would use IndexedDB in a real implementation
  return [];
}

async function clearPendingPedidos() {
  // This would clear IndexedDB in a real implementation
  return true;
}

console.log('✅ Service Worker: Script loaded');

