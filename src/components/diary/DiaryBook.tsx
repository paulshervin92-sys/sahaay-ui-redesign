import React from "react";
import DiaryPage from "./DiaryPage";
import "./diaryBook.css";

const DiaryBook = ({ selectedDate, diaryEntries, events, isFlipping, flipDirection }) => {
  // Calculate left (previous) and right (current) dates
  const rightDate = selectedDate;
  const leftDate = new Date(selectedDate);
  leftDate.setDate(rightDate.getDate() - 1);

  // Format date string for keys
  const format = (date) => date.toISOString().slice(0, 10);

  // Animation classes
  let flipClass = "";
  if (isFlipping && flipDirection === "right") flipClass = "flip-right";
  if (isFlipping && flipDirection === "left") flipClass = "flip-left";

  return (
    <div className={`diary-book-container ${flipClass} shadow-xl rounded-3xl bg-gradient-to-br from-background to-secondary/40 relative`}>
      <div className="diary-book-binding" />
      <div className="diary-pages flex">
        <DiaryPage
          date={leftDate}
          entry={diaryEntries[format(leftDate)]}
          events={events[format(leftDate)]}
          side="left"
        />
        <DiaryPage
          date={rightDate}
          entry={diaryEntries[format(rightDate)]}
          events={events[format(rightDate)]}
          side="right"
        />
      </div>
    </div>
  );
};

export default DiaryBook;
