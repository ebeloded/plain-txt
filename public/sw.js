var CACHE = 'cache-and-update'

// On install, cache some resources.
self.addEventListener('install', function (evt) {
  console.log('The service worker is being installed.')

  // Ask the service worker to keep installing until the returning promise
  // resolves.
  evt.waitUntil(precache())
})

// On fetch, use cache but update the entry with the latest contents
// from the server.
self.addEventListener('fetch', function (evt) {
  console.log('The service worker is serving the asset.')
  // You can use `respondWith()` to answer immediately, without waiting for the
  // network response to reach the service worker...
  evt.respondWith(fromCache(evt.request))
  // ...and `waitUntil()` to prevent the worker from being killed until the
  // cache is updated.
  evt.waitUntil(update(evt.request))
})

// Open a cache and use `addAll()` with an array of assets to add all of them
// to the cache. Return a promise resolving when all the assets are added.
async function precache() {
  const cache = await caches.open(CACHE)
  return cache.addAll([])
}

// Open the cache where the assets were stored and search for the requested
// resource. Notice that in case of no matching, the promise still resolves
// but it does with `undefined` as value.
async function fromCache(request) {
  const cache = await caches.open(CACHE)
  const matching = await cache.match(request)
  return matching || Promise.reject('no-match')
}

// Update consists in opening the cache, performing a network request and
// storing the new response data.
async function update(request) {
  const cache = await caches.open(CACHE)
  const response = await fetch(request)
  return cache.put(request, response)
}
