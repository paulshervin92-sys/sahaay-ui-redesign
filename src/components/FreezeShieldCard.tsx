import React from "react";

export default function FreezeShieldCard({ shields }: { shields: number }) {
  return (
    <div className="flex flex-col items-center bg-blue-50 shadow rounded p-4 w-full">
      <div className="flex items-center gap-2">
        <span className="text-3xl text-blue-400">🛡️</span>
        <span className="text-xl font-bold">{shields}</span>
      </div>
      <div className="text-sm text-blue-700 mt-2">Freeze Shields</div>
    </div>
  );
}
