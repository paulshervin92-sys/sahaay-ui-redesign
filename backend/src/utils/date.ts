import { DateTime } from "luxon";

export const getDayKey = (date: Date, timezone: string) => {
  return DateTime.fromJSDate(date, { zone: timezone }).toFormat("yyyy-LL-dd");
};

export const getNextRunAt = (time: string, timezone: string) => {
  const [hours, minutes] = time.split(":").map((value) => Number(value));
  const now = DateTime.now().setZone(timezone);
  let scheduled = now.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
  if (scheduled <= now) {
    scheduled = scheduled.plus({ days: 1 });
  }
  return scheduled.toUTC().toJSDate();
};

export const toUtcDate = (date: Date) => DateTime.fromJSDate(date).toUTC().toJSDate();
