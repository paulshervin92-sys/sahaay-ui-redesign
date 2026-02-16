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

      {/* Daily Goal / Today's Status */}
      <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-primary/20 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Today's Goal</h2>
            <p className="text-sm text-muted-foreground">Complete a meaningful activity to increase your streak.</p>
          </div>
          <div className="bg-white/50 px-3 py-1 rounded-full text-xs font-medium border border-primary/10">
            Status: {safeStreak.lastMeaningfulDate === new Date().toISOString().split('T')[0] ? '✅ Completed' : '⌛ Pending'}
          </div>
        </div>

        <div className="space-y-3">
          <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${safeStreak.lastCheckInDate === new Date().toISOString().split('T')[0]
            ? 'bg-green-500/5 border-green-500/20'
            : 'bg-white/40 border-border'
            }`}>
            <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${safeStreak.lastCheckInDate === new Date().toISOString().split('T')[0]
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-muted-foreground'
              }`}>
              {safeStreak.lastCheckInDate === new Date().toISOString().split('T')[0] && '✓'}
            </div>
            <div>
              <div className="font-semibold text-sm">Daily Check-in</div>
              <p className="text-xs text-muted-foreground">Keeps your streak alive (prevents reset).</p>
            </div>
          </div>

          <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${safeStreak.lastMeaningfulDate === new Date().toISOString().split('T')[0]
            ? 'bg-orange-500/5 border-orange-500/20 shadow-sm'
            : 'bg-white/40 border-border shadow-none'
            }`}>
            <div className={`h-6 w-6 rounded-full flex items-center justify-center border ${safeStreak.lastMeaningfulDate === new Date().toISOString().split('T')[0]
              ? 'bg-orange-500 border-orange-500 text-white'
              : 'border-muted-foreground'
              }`}>
              {safeStreak.lastMeaningfulDate === new Date().toISOString().split('T')[0] && '✓'}
            </div>
            <div>
              <div className="font-semibold text-sm">Meaningful Activity</div>
              <p className="text-xs text-muted-foreground">Increases streak by 1 day (Journal, Chat, or Exercise).</p>
            </div>
          </div>
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

      {/* How it works */}
      <div className="mb-8 p-8 bg-card border border-primary/10 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Sparkles size={120} />
        </div>

        <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
          <Sparkles className="text-primary" size={24} />
          The Sahaay Streak System
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="flex flex-col gap-3">
            <div className="h-10 w-10 rounded-2xl bg-orange-100 flex items-center justify-center">
              <Flame className="text-orange-500" size={20} />
            </div>
            <h3 className="font-bold text-foreground">Grow your Streak</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Complete a <span className="text-orange-600 font-semibold">Meaningful Activity</span> daily to increase your count. This represents real progress in your wellness journey.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Shield className="text-blue-500" size={20} />
            </div>
            <h3 className="font-bold text-foreground">Protect with Shields</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Life happens. If you only have time for a <span className="text-blue-600 font-semibold">Quick Check-in</span>, we'll use a Freeze Shield to keep your streak from resetting to zero.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-100 flex items-center justify-center">
              <Trophy className="text-purple-500" size={20} />
            </div>
            <h3 className="font-bold text-foreground">Unlock Rewards</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Milestones like 3, 7, and 14 days unlock powerful tools and premium features to help you go deeper into your mental wellness.
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-surface rounded-2xl border border-border/50">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">Meaningful Activity Checklist</p>
          <div className="flex flex-wrap gap-3">
            {['Journal Entry', 'Coping Tool', 'Meaningful Chat', 'Guided Exercise'].map(act => (
              <div key={act} className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-border text-xs font-medium">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {act}
              </div>
            ))}
          </div>
        </div>
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
