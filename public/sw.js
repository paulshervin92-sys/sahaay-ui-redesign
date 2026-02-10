self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "Notification", body: "" };
  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "",
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow("/"));
});
