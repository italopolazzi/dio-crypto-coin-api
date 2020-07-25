const self = this

const STATIC_CACHE_NAME = 'static-cache-v1'
const assets = [
  '/',
  '/index.html',
  '/app.js',
  '/errors.js',
  '/styles/index.css',
  '/styles/fonts.css',
  '/styles/toasts.css',
  '/img/coin.jpg',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;700;900&display=swap',
  'https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log("Caching shell assets");
        cache.addAll(assets)
      })
      .catch(
        error => {
          console.log(`Open cache error: ${error}`);
        }
      )
  )

})
self.addEventListener('fetch', event => {
  // console.log(event);
  console.log(event.request);
  

})

self.addEventListener('activate', event => {
  console.log(event);

})