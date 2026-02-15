const scheduledJobs = new Map<string, NodeJS.Timeout>();

interface ScheduleOptions {
    id: string;
    date: Date;
    callback: () => void;
}

export function scheduleEmail({ id, date, callback }: ScheduleOptions) {
    const now = new Date();
    const delay = date.getTime() - now.getTime();
    if (delay <= 0) {
        return;
    }
    const timeout = setTimeout(() => {
        callback();
        scheduledJobs.delete(id);
    }, delay);
    scheduledJobs.set(id, timeout);
}

export function cancelScheduledEmail(id: string) {
    const timeout = scheduledJobs.get(id);
    if (timeout) {
        clearTimeout(timeout);
        scheduledJobs.delete(id);
    }
}
