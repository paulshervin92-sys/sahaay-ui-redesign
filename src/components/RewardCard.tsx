import React from "react";

const rewardLabels: Record<string, string> = {
  FREEZE_SHIELD: "Freeze Shield",
  DEEP_JOURNAL_UNLOCK: "Deep Journal",
  ANXIETY_TOOLKIT_UNLOCK: "Anxiety Toolkit",
  PREMIUM_UNLOCK_7_DAYS: "Premium (7 days)",
  PREMIUM_UNLOCK_14_DAYS: "Premium (14 days)"
};

export default function RewardCard({ type }: { type: string }) {
  return (
    <div className="px-3 py-1 bg-green-100 rounded text-green-800 text-sm font-semibold border border-green-300">
      {rewardLabels[type] || type}
    </div>
  );
}
