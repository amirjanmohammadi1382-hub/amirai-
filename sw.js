const CACHE='amir-ai-v5';
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(['./','./index.html','./manifest.webmanifest']);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(request.mode==='navigate'){
    event.respondWith((async()=>{try{const fresh=await fetch(request,{cache:'no-store'});const cache=await caches.open(CACHE);cache.put('./index.html',fresh.clone());return fresh}catch(error){return (await caches.match('./index.html'))||Response.error()}})());
    return;
  }
  if(url.origin===self.location.origin){
    event.respondWith((async()=>{const cached=await caches.match(request);if(cached)return cached;try{return await fetch(request)}catch(error){return cached||Response.error()}})());
  }
});