const CACHE='korvil-v5-dynamic';
const FALLBACK_ASSETS=['./','./index.html','./manifest.json'];

self.addEventListener('install', (event)=>{
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(FALLBACK_ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate', (event)=>{
  event.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch', (event)=>{
  if(event.request.method!=='GET') return;
  event.respondWith(
    caches.match(event.request).then(cached=>{
      const networkFetch = fetch(event.request).then(res=>{
        if(res && res.status===200){
          const clone=res.clone();
          caches.open(CACHE).then(c=>c.put(event.request, clone));
        }
        return res;
      }).catch(()=>cached || caches.match('./index.html'));
      return cached || networkFetch;
    })
  );
});

self.addEventListener('message', (e)=>{
  if(e.data && e.data.type==='SKIP_WAITING'){ self.skipWaiting(); }
});
