// Diary API helpers for frontend using the standard apiFetch
import { apiFetch } from "./api";

export interface DiaryEntry {
  id?: string;
  prompt: string;
  entry: string;
  createdAt: string;
  eventTime?: string;
}

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  startTime?: string;
  endTime?: string;
}


export async function fetchDiaryEntry(date: string): Promise<DiaryEntry | null> {
  try {
    const res = await apiFetch<{ entry: DiaryEntry | null }>(`/api/journals/by-date/${date}`);
    return res.entry;
  } catch (error) {
    console.error("Error fetching diary entry:", error);
    return null;
  }
}

export async function saveDiaryEntry(entry: Partial<DiaryEntry>): Promise<DiaryEntry | null> {
  try {
    return await apiFetch<DiaryEntry>(`/api/journals`, {
      method: "POST",
      body: JSON.stringify(entry),
    });
  } catch (error) {
    console.error("Error saving diary entry:", error);
    return null;
  }
}

export async function fetchEvents(date: string): Promise<CalendarEvent[]> {
  try {
    return await apiFetch<CalendarEvent[]>(`/api/events/${date}`);
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function createEvent(event: CalendarEvent): Promise<CalendarEvent | null> {
  try {
    return await apiFetch<CalendarEvent>(`/api/events`, {
      method: "POST",
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return null;
  }
}

export async function updateEvent(event: CalendarEvent): Promise<CalendarEvent | null> {
  try {
    return await apiFetch<CalendarEvent>(`/api/events/${event.id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    });
  } catch (error) {
    console.error("Error updating event:", error);
    return null;
  }
}

export async function deleteEvent(id: string): Promise<void> {
  try {
    await apiFetch(`/api/events/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
  }
}
