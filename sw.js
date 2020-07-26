const self = this

const STATIC_CACHE_NAME = 'static-cache-v5'
const DYNAMIC_CACHE_NAME = 'dynamic-cache-v2'
const assets = [
  '/',
  '/index.html',
  '/offline.html',
  '/app.js',
  '/errors.js',
  '/manifest.json',
  '/styles/index.css',
  '/styles/fonts.css',
  '/styles/toasts.css',
  '/img/coin.jpg',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700;900&display=swap',
  'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css'
]

const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > size) {
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        cache.addAll(assets)
      })
  )

})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cacheResponse => {
        return cacheResponse || fetch(event.request)
          .then(fetchRes => {
            return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
              cache.put(event.request.url, fetchRes.clone())
              limitCacheSize(DYNAMIC_CACHE_NAME, 15)
              return fetchRes
            })
          })
      }).catch(() => {
        if (event.request.url.indexOf('.html') > -1) {
          return caches.match('/offline.html')
        }
      })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME)
          .map(key => caches.delete(key))
      )
    })
  )
})