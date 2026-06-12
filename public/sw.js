// 数独玩家 Service Worker
// 提供离线访问能力，让游戏在无网络环境下也能运行

const CACHE_NAME = 'sudoku-player-v3'
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
]

// 安装：预缓存关键资源
self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] 预缓存部分失败（可忽略）:', err)
      })
    })
  )
})

// 激活：清理旧版本缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  )
})

// 请求拦截：网络优先，失败时回退到缓存
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  // 跳过非 http(s) 请求（如 chrome-extension://）
  const url = new URL(event.request.url)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 成功获取则更新缓存
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone)
          })
        }
        return response
      })
      .catch(() =>
        caches.match(event.request).then((cached) => {
          if (cached) return cached
          // 离线时回退到首页
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html')
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' })
        })
      )
  )
})

// 监听来自主线程的消息（例如强制更新）
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
