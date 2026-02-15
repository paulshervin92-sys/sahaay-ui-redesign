// TypeScript declaration for scheduler.js
export function scheduleEmail(args: { id: string; date: Date; callback: () => void }): void;
export function cancelScheduledEmail(id: string): void;
