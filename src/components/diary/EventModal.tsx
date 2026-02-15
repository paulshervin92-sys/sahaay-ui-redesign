import React, { useState } from "react";
import { createEvent, updateEvent, deleteEvent } from "@/lib/diaryApi";

const emptyEvent = { title: "", description: "", time: "" };

const EventModal = ({ date, event, onClose }) => {
  const [form, setForm] = useState(event ? { ...event } : { ...emptyEvent });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    if (event && event.id) {
      await updateEvent({ ...form, date: date.toISOString().slice(0, 10) });
    } else {
      await createEvent({ ...form, date: date.toISOString().slice(0, 10) });
    }
    setSaving(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!event?.id) return;
    setDeleting(true);
    await deleteEvent(event.id);
    setDeleting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card rounded-2xl p-6 w-[340px] max-w-[90vw] shadow-xl fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-fade-in z-50">
        <button className="absolute top-2 right-2 text-muted-foreground" onClick={onClose}>&times;</button>
        <h3 className="font-bold text-lg mb-2 text-neutral-900 dark:text-white">{event ? "Edit Event" : "Add Event"}</h3>
        <div className="space-y-3">
          <input
            className="w-full rounded border px-2 py-1 bg-background text-neutral-900 dark:text-white placeholder:text-muted-foreground"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Event title"
          />
          <input
            className="w-full rounded border px-2 py-1 bg-background text-neutral-900 dark:text-white placeholder:text-muted-foreground"
            name="time"
            value={form.time}
            onChange={handleChange}
            placeholder="Time (e.g. 3:00pm)"
          />
          <textarea
            className="w-full rounded border px-2 py-1 bg-background text-neutral-900 dark:text-white placeholder:text-muted-foreground"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            rows={3}
          />
        </div>
        <div className="flex gap-2 mt-4">
          <button
            className="px-4 py-1 rounded bg-primary text-white font-semibold"
            onClick={handleSave}
            disabled={saving}
          >{saving ? "Saving..." : "Save"}</button>
          {event?.id && (
            <button
              className="px-4 py-1 rounded bg-red-500 text-white font-semibold"
              onClick={handleDelete}
              disabled={deleting}
            >{deleting ? "Deleting..." : "Delete"}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
