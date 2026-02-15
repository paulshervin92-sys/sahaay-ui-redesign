// backend/src/utils/scheduler.js
import cron from 'node-cron';

const scheduledJobs = new Map();

export function scheduleEmail({ id, date, callback }) {
  // date: JS Date object
  const now = new Date();
  const delay = date - now;
  if (delay <= 0) {
    // If the time is in the past, do not schedule
    return;
  }
  // Use setTimeout for one-off scheduling
  const timeout = setTimeout(() => {
    callback();
    scheduledJobs.delete(id);
  }, delay);
  scheduledJobs.set(id, timeout);
}

export function cancelScheduledEmail(id) {
  const timeout = scheduledJobs.get(id);
  if (timeout) {
    clearTimeout(timeout);
    scheduledJobs.delete(id);
  }
}


