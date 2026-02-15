import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useStreak() {
  const [streak, setStreak] = useState<any>({});
  const [rewards, setRewards] = useState<any>({ unlockedRewards: [], activePremiumUntil: null });
  const [loading, setLoading] = useState(true);

  const getStreak = useCallback(async () => {
    setLoading(true);
    const res = await axios.get("/api/streak/me");
    setStreak(res.data.streak);
    setRewards(res.data.rewards);
    setLoading(false);
  }, []);

  const updateStreak = useCallback(async (activityType: string) => {
    setLoading(true);
    const res = await axios.post("/api/streak/update", { activityType });
    await getStreak();
    setLoading(false);
    return res.data;
  }, [getStreak]);

  const getRewards = useCallback(async () => {
    setLoading(true);
    const res = await axios.get("/api/streak/rewards");
    setRewards(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    getStreak();
  }, [getStreak]);

  return { streak, rewards, loading, getStreak, updateStreak, getRewards };
}
