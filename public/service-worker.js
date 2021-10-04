// Global variables
const CACHE_NAME = "bt-cache";
const DATA_CACHE_NAME = "bt-data-cache";

const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/js/idb.js',
    '/css/styles.css',
    '/js/index.js',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// Add event listener to install cache
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(DATA_CACHE_NAME).then(cache => {
            console.log("Installing" + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});

