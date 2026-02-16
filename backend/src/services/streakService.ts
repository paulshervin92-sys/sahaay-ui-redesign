import { getFirestore } from "../config/firebase.js";
import { getDayKey } from "../utils/date.js";
import { DateTime } from "luxon";


const userStreaksCollection = () => getFirestore().collection("userStreaks");
const userRewardsCollection = () => getFirestore().collection("userRewards");

export const REWARD_MILESTONES = [
  { streak: 3, type: "FREEZE_SHIELD", value: 1 },
  { streak: 7, type: "DEEP_JOURNAL_UNLOCK" },
  { streak: 14, type: "ANXIETY_TOOLKIT_UNLOCK" },
  { streak: 30, type: "PREMIUM_UNLOCK_7_DAYS" },
  { streak: 60, type: "PREMIUM_UNLOCK_14_DAYS" }
];

const MEANINGFUL_ACTIVITIES = [
  "JOURNAL_ENTRY",
  "COPING_TOOL_COMPLETED",
  "GUIDED_EXERCISE_COMPLETED",
  "AI_CHAT_MEANINGFUL_SESSION"
];

export async function updateUserStreak(userId: string, activityType: string, timezone: string = "UTC") {
  const streakDocRef = userStreaksCollection().doc(userId);
  const rewardDocRef = userRewardsCollection().doc(userId);
  const now = new Date();
  const today = getDayKey(now, timezone);

  let streakDoc = await streakDocRef.get();
  let streakData: any = streakDoc.exists && streakDoc.data() ? streakDoc.data() : {
    userId,
    currentStreak: 0,
    longestStreak: 0,
    lastMeaningfulDate: null,
    lastCheckInDate: null,
    freezeShields: 0,
    createdAt: now,
    updatedAt: now
  };

  let freezeUsed = false;
  let rewardUnlocked: string | null = null;

  // Check if meaningful activity
  const isMeaningful = MEANINGFUL_ACTIVITIES.includes(activityType);

  // Check last meaningful date
  const lastMeaningfulDate = streakData.lastMeaningfulDate;

  // If meaningful activity
  if (isMeaningful) {
    if (lastMeaningfulDate === today) {
      // Already incremented today
      return {
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        freezeUsed,
        rewardUnlocked
      };
    }
    // Check if yesterday was last meaningful
    const yesterdayStr = DateTime.fromJSDate(now, { zone: timezone }).minus({ days: 1 }).toFormat("yyyy-LL-dd");

    if (lastMeaningfulDate === yesterdayStr || !lastMeaningfulDate) {

      streakData.currentStreak += 1;
    } else {
      // Missed a day
      if (streakData.freezeShields > 0) {
        streakData.freezeShields -= 1;
        freezeUsed = true;
        // Streak frozen, no increment
      } else {
        streakData.currentStreak = 1;
      }
    }
    streakData.lastMeaningfulDate = today;
    if (streakData.currentStreak > streakData.longestStreak) {
      streakData.longestStreak = streakData.currentStreak;
    }
  } else if (activityType === "DAILY_CHECK_IN") {
    // Only check-in
    streakData.lastCheckInDate = today;
    // If missed meaningful yesterday, freeze
    const yesterdayStr = DateTime.fromJSDate(now, { zone: timezone }).minus({ days: 1 }).toFormat("yyyy-LL-dd");

    if (streakData.lastMeaningfulDate !== yesterdayStr && streakData.lastMeaningfulDate !== today) {
      if (streakData.freezeShields > 0) {
        streakData.freezeShields -= 1;
        freezeUsed = true;
      } else {
        streakData.currentStreak = 0;
      }
    }
  }

  // Check reward milestones
  let rewardDoc = await rewardDocRef.get();
  let rewardData: any = rewardDoc.exists && rewardDoc.data() ? rewardDoc.data() : {
    userId,
    unlockedRewards: [],
    activePremiumUntil: null,
    lastRewardClaimedAt: null
  };

  for (const milestone of REWARD_MILESTONES) {
    if (streakData.currentStreak === milestone.streak && !rewardData.unlockedRewards.includes(milestone.type)) {
      rewardData.unlockedRewards.push(milestone.type);
      rewardUnlocked = milestone.type;
      rewardData.lastRewardClaimedAt = now;
      if (milestone.type === "FREEZE_SHIELD") {
        streakData.freezeShields += milestone.value || 1;
      }
      if (milestone.type.startsWith("PREMIUM_UNLOCK")) {
        let days = milestone.type === "PREMIUM_UNLOCK_7_DAYS" ? 7 : 14;
        let until = new Date(now);
        until.setDate(now.getDate() + days);
        rewardData.activePremiumUntil = until;
      }
    }
  }

  streakData.updatedAt = now;
  await streakDocRef.set({ ...streakData }, { merge: true });
  await rewardDocRef.set({ ...rewardData }, { merge: true });

  return {
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    freezeUsed,
    rewardUnlocked
  };
}
