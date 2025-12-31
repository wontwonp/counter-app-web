const CACHE_NAME = 'bus-counter-v3';
const BASE_PATH = '/counter-app-web/';
const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'standalone.html',
  BASE_PATH + 'manifest.json',
  BASE_PATH + 'icons/icon-192x192.svg',
  BASE_PATH + 'icons/icon-512x512.svg'
];

// 서비스 워커 설치
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('캐시 열기');
        // addAll 대신 각 파일을 개별적으로 추가하여 실패한 파일은 무시
        return Promise.all(
          urlsToCache.map(function(url) {
            return cache.add(url).catch(function(err) {
              console.warn('캐시 실패 (무시됨):', url, err);
              return null; // 실패해도 계속 진행
            });
          })
        );
      })
  );
});

// 서비스 워커 활성화
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('이전 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 캐시에서 찾으면 캐시된 버전 반환
        if (response) {
          return response;
        }
        // 네트워크 요청 시도
        return fetch(event.request).catch(function(error) {
          // 네트워크 실패 시 index.html로 fallback (SPA 라우팅 지원)
          if (event.request.mode === 'navigate') {
            return caches.match(BASE_PATH + 'index.html') || caches.match(BASE_PATH);
          }
          throw error;
        });
      }
    )
  );
});





