const cacheName = 'v1';
const assets = [
    /* Add an array of files to precache for your app */
    './',
];

// Call install event
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installed');

    // wait untill the promice is finished
    /* the waitUntil method is used to tell the browser not to terminate the service worker until the promise passed to waitUntil is either resolved or rejected. */
    event.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('Service Worker: Caching File');
                cache.addAll(assets);
            })
            .then(() => self.skipWaiting())
    );
});

// call activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated');

    // remove unwanted previously cached files
    event.waitUntil(
        /* here we will iterate through all the caches and delete all the cache other the one whose name is saved in 'cacheName' variable */
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: claering Old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// call fetch event
self.addEventListener('fetch', (event) => {
    console.log('Service Worker: Fetching');
    // first check if live site is availabe else fetch file from cache
    event.respondWith(
        /* if there is no connection then fetching will fail then we would call a catch function since it returns a promise*/
        fetch(event.request).catch(() => caches.match(event.request))
    )
})