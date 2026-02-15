import React from "react";

interface Milestone {
  streak: number;
  type: string;
  value?: number;
}

export default function RewardProgress({ milestones, streak, unlocked }: {
  milestones: Milestone[];
  streak: number;
  unlocked: string[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {milestones.map(m => (
        <div key={m.type} className="flex items-center gap-2">
          <div className={`w-24 text-center py-1 rounded ${unlocked.includes(m.type) ? "bg-green-200 text-green-800" : streak >= m.streak ? "bg-blue-200 text-blue-800" : "bg-gray-200 text-gray-500"}`}>
            {m.streak} days
          </div>
          <div className="flex-1 h-2 bg-gray-200 rounded">
            <div className={`h-2 rounded ${unlocked.includes(m.type) ? "bg-green-500" : streak >= m.streak ? "bg-blue-500" : "bg-gray-300"}`} style={{ width: `${Math.min(streak / m.streak, 1) * 100}%` }} />
          </div>
          <span className="text-xs font-semibold">{unlocked.includes(m.type) ? "✓ unlocked" : streak >= m.streak ? "Ready to claim" : "Locked"}</span>
        </div>
      ))}
    </div>
  );
}
