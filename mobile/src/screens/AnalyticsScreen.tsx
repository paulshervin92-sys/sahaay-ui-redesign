import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Card, Loading } from '../components';
import { theme } from '../theme';
import { useQuery } from '@tanstack/react-query';
import { checkinService } from '../api/checkin.service';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const AnalyticsScreen: React.FC = () => {
  // Fetch check-ins for the last 30 days
  const { data: checkins = [], isLoading } = useQuery({
    queryKey: ['checkins'],
    queryFn: () => checkinService.getCheckins(),
  });

  if (isLoading) {
    return <Loading fullScreen text="Loading analytics..." />;
  }

  // Calculate insights
  const getMoodLabel = (value: number): string => {
    if (value >= 7) return 'Happy';
    if (value >= 5) return 'Neutral';
    if (value >= 3) return 'Sad';
    return 'Anxious';
  };

  const avgMood = checkins.length > 0
    ? (checkins.reduce((sum: number, c: any) => sum + c.moodValue, 0) / checkins.length).toFixed(1)
    : '0';

  const recentCheckins = checkins.slice(0, 7);
  const olderCheckins = checkins.slice(7);
  
  const recentAvg = recentCheckins.length > 0
    ? recentCheckins.reduce((sum: number, c: any) => sum + c.moodValue, 0) / recentCheckins.length
    : 0;
  
  const olderAvg = olderCheckins.length > 0
    ? olderCheckins.reduce((sum: number, c: any) => sum + c.moodValue, 0) / olderCheckins.length
    : recentAvg;

  const moodTrend = recentAvg > olderAvg ? 'improving' : recentAvg < olderAvg ? 'declining' : 'stable';

  // Calculate best day of week
  const dayStats: { [key: string]: { sum: number; count: number } } = {};
  checkins.forEach((checkin: any) => {
    const day = new Date(checkin.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
    if (!dayStats[day]) dayStats[day] = { sum: 0, count: 0 };
    dayStats[day].sum += checkin.moodValue;
    dayStats[day].count += 1;
  });

  let bestDay = '';
  let bestAvg = 0;
  Object.entries(dayStats).forEach(([day, stats]) => {
    const avg = stats.sum / stats.count;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestDay = day;
    }
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your mood insights</Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <Card elevated style={styles.statCard}>
          <Text style={styles.statValue}>{checkins.length}</Text>
          <Text style={styles.statLabel}>Total check-ins</Text>
        </Card>

        <Card elevated style={styles.statCard}>
          <Text style={styles.statValue}>{avgMood}</Text>
          <Text style={styles.statLabel}>Average mood</Text>
        </Card>
      </View>

      {/* Insights */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Personalized insights</Text>
        
        {checkins.length === 0 ? (
          <Text style={styles.noData}>
            Start tracking your mood to see personalized insights here.
          </Text>
        ) : (
          <View>
            {bestDay && (
              <View style={styles.insight}>
                <Text style={styles.insightEmoji}>📊</Text>
                <Text style={styles.insightText}>
                  Your mood tends to be highest on <Text style={styles.bold}>{bestDay}s</Text>
                </Text>
              </View>
            )}

            <View style={styles.insight}>
              <Text style={styles.insightEmoji}>
                {moodTrend === 'improving' ? '📈' : moodTrend === 'declining' ? '📉' : '➡️'}
              </Text>
              <Text style={styles.insightText}>
                Your mood has been{' '}
                <Text style={styles.bold}>
                  {moodTrend === 'improving' ? 'improving' : moodTrend === 'declining' ? 'declining' : 'stable'}
                </Text>
                {' '}over the past week
              </Text>
            </View>

            <View style={styles.insight}>
              <Text style={styles.insightEmoji}>🔥</Text>
              <Text style={styles.insightText}>
                You've checked in <Text style={styles.bold}>{checkins.length} times</Text> in the last 30 days
              </Text>
            </View>
          </View>
        )}
      </Card>

      {/* Recent Check-ins */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Recent check-ins</Text>
        
        {checkins.length === 0 ? (
          <Text style={styles.noData}>No check-ins yet</Text>
        ) : (
          <View>
            {checkins.slice(0, 10).map((checkin: any, index: number) => (
              <View key={index} style={styles.checkinItem}>
                <View style={styles.checkinLeft}>
                  <Text style={styles.checkinDate}>
                    {new Date(checkin.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text style={styles.checkinMood}>
                    {getMoodLabel(checkin.moodValue)}
                  </Text>
                </View>
                <View style={styles.moodBar}>
                  <View
                    style={[
                      styles.moodBarFill,
                      { width: `${(checkin.moodValue / 10) * 100}%` },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  statValue: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textMuted,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  insightEmoji: {
    fontSize: 24,
    marginRight: theme.spacing.sm,
  },
  insightText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    lineHeight: 22,
  },
  bold: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  noData: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
  checkinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  checkinLeft: {
    width: 80,
  },
  checkinDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
  },
  checkinMood: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text,
  },
  moodBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  moodBarFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
});
