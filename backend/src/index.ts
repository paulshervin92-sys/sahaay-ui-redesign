import { app } from "./app.js";
import { env } from "./config/env.js";
import { startReminderScheduler } from "./services/notification/notificationService.js";

app.listen(env.PORT, () => {
  startReminderScheduler();
  console.log(`API listening on :${env.PORT}`);
});
