import React from "react";
import DiaryEditor from "./DiaryEditor";
import EventList from "./EventList";
import { DiaryEntry, CalendarEvent } from "@/lib/diaryApi";


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface DiaryPageProps {
  date: Date;
  entry?: DiaryEntry | null;
  events?: CalendarEvent[];
  side: "left" | "right";
}

const DiaryPage = ({ date, entry, events, side }: DiaryPageProps) => {

  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const dateStr = `${dayName}, ${month} ${dayNum}, ${year}`;

  // For page number (optional)
  const pageNum = Math.floor(date.getTime() / (1000 * 60 * 60 * 24));

  // Optional: Add page flip sound
  // useEffect(() => { /* play sound on mount if needed */ }, [date]);

  return (
    <div className={`diary-page diary-page-${side} bg-paper shadow-lg rounded-2xl m-2 flex flex-col p-6 min-w-[320px] max-w-[340px] relative`}>
      <header className="mb-2 flex flex-col items-center">
        <div className="text-xs text-muted-foreground tracking-wide">{dateStr}</div>
        <div className="text-4xl font-bold text-primary mt-1 mb-2">{dayNum}</div>
      </header>
      <main className="flex-1 flex flex-col">
        <DiaryEditor entry={entry} date={date} />
      </main>
      <footer className="mt-4">
        <EventList events={events} date={date} />
      </footer>
      {/* Optional: Page number */}
      {/* <div className="absolute bottom-2 right-4 text-xs text-muted-foreground">Page {pageNum}</div> */}
    </div>
  );
};

export default DiaryPage;
