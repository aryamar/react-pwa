// نام کش
const CACHE_NAME = 'cra-pwa-cache-v1';

// منابعی که باید کش بشن
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/main.1a6cb1b1.js', // این مسیر رو با فایل‌های واقعی پروژه‌ات جایگزین کن
  '/static/css/main.79aa5c7c.css', // این مسیر رو با فایل‌های واقعی پروژه‌ات جایگزین کن
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// نصب سرویس ورکر و کش کردن منابع
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching files');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// فعال‌سازی سرویس ورکر
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// مدیریت درخواست‌ها (fetch)
self.addEventListener('fetch', (event) => {
  console.log('Service Worker fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // اگه تو کش بود، از کش برگردون
        if (response) {
          return response;
        }
        // اگه تو کش نبود، از شبکه بگیر
        return fetch(event.request)
          .catch(() => {
            // اگه آفلاین بود و درخواست تو کش نبود، یه صفحه آفلاین برگردون (اختیاری)
            return caches.match('/index.html');
          });
      })
  );
});