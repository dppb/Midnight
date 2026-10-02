/* OS-v2 service worker: shows notifications sent by your Supabase project, and opens the app when tapped.
   It caches nothing and reads nothing; it only wakes up for notifications. */
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('push', function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: 'OS-v2', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'OS-v2', {
    body: d.body || '', tag: d.tag || undefined, icon: 'icon-192.png', badge: 'icon-192.png',
    data: { url: self.registration.scope }
  }));
});
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || './';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) { if ('focus' in list[i]) return list[i].focus(); }
    return self.clients.openWindow(url);
  }));
});
