import React from "react";
import { Flame, Trophy, Shield, Sparkles } from "lucide-react";
import { useStreak } from "@/hooks/useStreak";
import StreakCard from "@/components/StreakCard";
import RewardCard from "@/components/RewardCard";
import RewardProgress from "@/components/RewardProgress";
import FreezeShieldCard from "@/components/FreezeShieldCard";

const REWARD_MILESTONES = [
  { streak: 3, type: "FREEZE_SHIELD", value: 1 },
  { streak: 7, type: "DEEP_JOURNAL_UNLOCK" },
  { streak: 14, type: "ANXIETY_TOOLKIT_UNLOCK" },
  { streak: 30, type: "PREMIUM_UNLOCK_7_DAYS" },
  { streak: 60, type: "PREMIUM_UNLOCK_14_DAYS" }
];

export default function RewardsDashboard() {
  const { streak, rewards, loading } = useStreak();

  // Provide safe defaults if streak or rewards are undefined
  const safeStreak = streak || { currentStreak: 0, longestStreak: 0, freezeShields: 0 };
  const safeRewards = rewards || { unlockedRewards: [], activePremiumUntil: null };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  const nextMilestone = REWARD_MILESTONES.find(m => m.streak > (safeStreak.currentStreak || 0));
  const progress = nextMilestone ? (safeStreak.currentStreak / nextMilestone.streak) : 1;

  return (
    <div className="max-w-4xl mx-auto p-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Rewards dashboard</h1>
      <p className="text-muted-foreground mb-8">Meaningful moments power your streak and unlock new rewards.</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface shadow rounded-xl p-6 flex flex-col items-center">
          <Flame className="text-orange-400 mb-1" size={32} />
          <div className="text-2xl font-bold">{safeStreak.currentStreak} days</div>
          <div className="text-xs text-muted-foreground">Current streak</div>
        </div>
        <div className="bg-surface shadow rounded-xl p-6 flex flex-col items-center">
          <Trophy className="text-green-400 mb-1" size={32} />
          <div className="text-2xl font-bold">{safeStreak.longestStreak} days</div>
          <div className="text-xs text-muted-foreground">Longest streak</div>
        </div>
        <div className="bg-surface shadow rounded-xl p-6 flex flex-col items-center">
          <Shield className="text-blue-400 mb-1" size={32} />
          <div className="text-2xl font-bold">{safeStreak.freezeShields}</div>
          <div className="text-xs text-muted-foreground">Freeze shields ready</div>
        </div>
        <div className="bg-surface shadow rounded-xl p-6 flex flex-col items-center">
          <Sparkles className="text-purple-400 mb-1" size={32} />
          <div className="text-2xl font-bold">{safeRewards.activePremiumUntil ? 'Active' : 'Inactive'}</div>
          <div className="text-xs text-muted-foreground">Premium status</div>
        </div>
      </div>

      {/* Next milestone */}
      <div className="bg-card rounded-xl p-6 mb-8">
        <div className="text-xs font-semibold text-muted-foreground mb-2">NEXT MILESTONE</div>
        {nextMilestone ? (
          <div className="text-lg font-bold mb-2">
            {nextMilestone.streak} days - {nextMilestone.type === 'FREEZE_SHIELD' ? 'Freeze shield +1' : nextMilestone.type.replace(/_/g, ' ').toLowerCase()}
          </div>
        ) : (
          <div className="text-lg font-bold mb-2">All rewards unlocked!</div>
        )}
        <div className="w-full bg-surface-muted rounded h-3">
          <div className="bg-primary h-3 rounded" style={{ width: `${Math.min(progress, 1) * 100}%` }} />
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {nextMilestone ? `${safeStreak.currentStreak} / ${nextMilestone.streak} days` : ''}
        </div>
      </div>

      {/* Milestone rewards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {REWARD_MILESTONES.map(milestone => (
          <div key={milestone.streak} className="bg-surface rounded-xl p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">
                {milestone.type === 'FREEZE_SHIELD' ? 'Freeze shield +1' : milestone.type.replace(/_/g, ' ').toLowerCase()}
              </span>
              <span className="text-xs text-muted-foreground">{milestone.streak} days</span>
              <span className="ml-auto text-xs font-semibold rounded px-2 py-1 bg-card/60">
                {safeStreak.currentStreak >= milestone.streak ? 'Unlocked' : safeStreak.currentStreak > 0 ? 'In progress' : 'Locked'}
              </span>
            </div>
            <div className="w-full bg-surface-muted rounded h-2">
              <div className="bg-primary h-2 rounded" style={{ width: `${Math.min(safeStreak.currentStreak / milestone.streak, 1) * 100}%` }} />
            </div>
            {safeStreak.currentStreak < milestone.streak && (
              <div className="text-xs text-muted-foreground">Keep going to unlock this reward.</div>
            )}
          </div>
        ))}
      </div>

      {/* Unlocked rewards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Unlocked Rewards</h2>
        <div className="flex flex-wrap gap-2">
          {safeRewards.unlockedRewards.length === 0 ? <span className="text-muted-foreground">No rewards unlocked yet.</span> :
            safeRewards.unlockedRewards.map(r => <RewardCard key={r} type={r} />)}
        </div>
      </div>

      {/* Premium status */}
      {safeRewards.activePremiumUntil && (
        <div className="mt-4 p-3 bg-yellow-100 rounded text-yellow-800 text-center">
          Premium active until: {new Date(safeRewards.activePremiumUntil).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
