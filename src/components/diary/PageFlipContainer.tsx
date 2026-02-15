import React, { useState, useEffect, useCallback } from "react";
import DiaryBook from "./DiaryBook.tsx";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import CalendarPicker from "./CalendarPicker.tsx";
import { fetchDiaryEntry, fetchEvents } from "@/lib/diaryApi";

const today = new Date();

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const PageFlipContainer = () => {
  const [selectedDate, setSelectedDate] = useState(today);
  const [showCalendar, setShowCalendar] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState({});
  const [events, setEvents] = useState({});
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);

  // Fetch diary entry and events for a date
  const loadData = useCallback(async (date) => {
    const dateStr = date.toISOString().slice(0, 10);
    const entry = await fetchDiaryEntry(dateStr);
    const evts = await fetchEvents(dateStr);
    setDiaryEntries((prev) => ({ ...prev, [dateStr]: entry }));
    setEvents((prev) => ({ ...prev, [dateStr]: evts }));
  }, []);

  useEffect(() => {
    loadData(selectedDate);
  }, [selectedDate, loadData]);

  const handleFlip = (direction) => {
    setFlipDirection(direction);
    setIsFlipping(true);
    setTimeout(() => {
      setSelectedDate((prev) => addDays(prev, direction === "right" ? 1 : -1));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="mb-4 p-2 rounded-full bg-card shadow hover:bg-primary/20"
        onClick={() => setShowCalendar(true)}
        aria-label="Open calendar"
      >
        <Calendar className="w-6 h-6 text-primary" />
      </button>
      <div className="flex items-center gap-8">
        <button
          className="p-2 rounded-full bg-card shadow hover:bg-primary/20"
          onClick={() => handleFlip("left")}
          aria-label="Previous day"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <DiaryBook
          selectedDate={selectedDate}
          diaryEntries={diaryEntries}
          events={events}
          isFlipping={isFlipping}
          flipDirection={flipDirection}
        />
        <button
          className="p-2 rounded-full bg-card shadow hover:bg-primary/20"
          onClick={() => handleFlip("right")}
          aria-label="Next day"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
      {showCalendar && (
        <CalendarPicker
          initialDate={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            setShowCalendar(false);
          }}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
};

export default PageFlipContainer;
