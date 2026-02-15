declare module "../../utils/scheduler.js" {
  export function scheduleTask(taskName: string, date: Date): Promise<void>;
}