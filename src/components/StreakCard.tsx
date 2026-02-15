import React from "react";

export default function StreakCard({ streak, longest }: { streak: number; longest: number }) {
  return (
    <div className="flex flex-col items-center bg-white shadow rounded p-4 w-full">
      <div className="flex items-center gap-2">
        <span className="text-3xl text-orange-500">🔥</span>
        <span className="text-xl font-bold">{streak}</span>
      </div>
      <div className="text-sm text-gray-500 mt-2">Current Streak</div>
      <div className="text-xs text-gray-400">Longest: {longest}</div>
    </div>
  );
}
