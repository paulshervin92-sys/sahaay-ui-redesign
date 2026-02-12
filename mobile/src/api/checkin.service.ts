import { apiFetch } from './client';

export type Mood = 'happy' | 'calm' | 'neutral' | 'sad' | 'anxious' | 'frustrated';

export interface CheckIn {
  id: string;
  userId: string;
  mood: Mood;
  intensity: number;
  note?: string;
  createdAt: string;
  dayKey: string;
}

export interface CheckInInput {
  mood: Mood;
  intensity: number;
  note?: string;
  timezone?: string;
}

export interface DailyCheckIns {
  dayKey: string;
  entries: CheckIn[];
}

/**
 * Create a new mood check-in
 */
export const createCheckIn = async (data: CheckInInput): Promise<CheckIn> => {
  return apiFetch<CheckIn>('/api/checkins', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Get today's check-ins
 */
export const getTodayCheckIns = async (timezone: string): Promise<DailyCheckIns> => {
  return apiFetch<DailyCheckIns>(
    `/api/checkins/today?timezone=${encodeURIComponent(timezone)}`
  );
};

/**
 * Get check-in history
 */
export const getCheckInHistory = async (): Promise<DailyCheckIns[]> => {
  return apiFetch<DailyCheckIns[]>('/api/checkins/history');
};

// Export service object for compatibility
export const checkinService = {
  submitCheckin: async (moodValue: number) => {
    // Convert moodValue to CheckInInput format
    const moodMap: { [key: number]: Mood } = {
      8: 'happy',
      7: 'calm',
      5: 'neutral',
      3: 'sad',
      2: 'anxious',
    };
    return createCheckIn({
      mood: moodMap[moodValue] || 'neutral',
      intensity: moodValue,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  },
  getTodayCheckin: async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dailyCheckins = await getTodayCheckIns(timezone);
    // Return the first entry if exists, transformed to match expected format
    if (dailyCheckins.entries.length > 0) {
      const entry = dailyCheckins.entries[0];
      return {
        ...entry,
        moodValue: entry.intensity,
        timestamp: entry.createdAt,
      };
    }
    return null;
  },
  getCheckins: async () => {
    const history = await getCheckInHistory();
    // Flatten DailyCheckIns[] to CheckIn[] with moodValue property
    return history.flatMap(day => 
      day.entries.map(entry => ({
        ...entry,
        moodValue: entry.intensity,
        timestamp: entry.createdAt,
      }))
    );
  },
};

/**
 * Delete a check-in
 */
export const deleteCheckIn = async (id: string): Promise<void> => {
  return apiFetch<void>(`/api/checkins/${id}`, {
    method: 'DELETE',
  });
};
