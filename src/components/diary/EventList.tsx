import React, { useState } from "react";
import { Plus } from "lucide-react";
import EventModal from "./EventModal";
import { CalendarEvent } from "@/lib/diaryApi";


interface EventListProps {
  events?: CalendarEvent[];
  date: Date;
}

const EventList = ({ events, date }: EventListProps) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  // Always treat events as an array
  const safeEvents = Array.isArray(events) ? events : [];


  return (
    <div className="event-list mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-muted-foreground">Events</span>
        <button
          className="p-1 rounded-full bg-primary/10 hover:bg-primary/20"
          onClick={() => { setSelectedEvent(null); setShowModal(true); }}
          aria-label="Add event"
        >
          <Plus className="w-4 h-4 text-primary" />
        </button>
      </div>
      <ul className="space-y-1">
        {safeEvents.length > 0 ? (
          safeEvents.map((evt) => (
            <li
              key={evt.id}
              className="rounded bg-card/80 px-2 py-1 text-xs text-foreground flex items-center justify-between cursor-pointer hover:bg-primary/10"
              onClick={() => { setSelectedEvent(evt); setShowModal(true); }}
            >
              <span>{evt.time} - {evt.title}</span>
            </li>
          ))
        ) : (
          <li className="text-xs text-muted-foreground italic">No events</li>
        )}
      </ul>
      {showModal && (
        <EventModal
          date={date}
          event={selectedEvent}
          onClose={() => { setShowModal(false); setSelectedEvent(null); }}
        />
      )}
    </div>
  );
};

export default EventList;
