import { app } from "./app.js";
import { env } from "./config/env.js";
import { startReminderScheduler } from "./services/notification/notificationService.js";

// Listen on all network interfaces (0.0.0.0) to accept connections from mobile devices
app.listen(env.PORT, '0.0.0.0', () => {
  startReminderScheduler();
  console.log(`API listening on http://0.0.0.0:${env.PORT}`);
  console.log(`Mobile devices can connect using your local IP on port ${env.PORT}`);
});
