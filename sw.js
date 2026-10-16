const V='trame-v4';
const CORE=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const nav=r.mode==='navigate';
  e.respondWith(nav
    ? fetch(r).then(x=>{const y=x.clone();caches.open(V).then(c=>c.put('index.html',y));return x}).catch(()=>caches.match('index.html'))
    : caches.match(r).then(h=>h||fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>h)));
});
