// Service worker for the admin inbox (scope: /admin). Handles Web Push only.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = { title: "AWW Inbox", body: "You have a new message.", url: "/admin/inbox" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {
    /* plain text or empty */
  }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      tag: data.tag || undefined,
      renotify: Boolean(data.tag),
      requireInteraction: Boolean(data.urgent),
      icon: "/admin-icon-192.png",
      badge: "/admin-icon-192.png",
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/admin/inbox";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes("/admin") && "focus" in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
