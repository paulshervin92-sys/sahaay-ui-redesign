// Diary API helpers for frontend
import axios from "axios";

export async function fetchDiaryEntry(date) {
  try {
    const res = await axios.get(`/diary/${date}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function saveDiaryEntry({ date, content }) {
  try {
    await axios.post(`/diary`, { date, content });
  } catch {}
}

export async function fetchEvents(date) {
  try {
    const res = await axios.get(`/events/${date}`);
    return res.data;
  } catch {
    return [];
  }
}

export async function createEvent(event) {
  try {
    await axios.post(`/events`, event);
  } catch {}
}

export async function updateEvent(event) {
  try {
    await axios.post(`/events`, event);
  } catch {}
}

export async function deleteEvent(id) {
  try {
    await axios.delete(`/events/${id}`);
  } catch {}
}
