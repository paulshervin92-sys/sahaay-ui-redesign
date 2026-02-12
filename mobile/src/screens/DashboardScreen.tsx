import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Button, Card, Loading } from '../components';
import { theme } from '../theme';
import { useAuth } from '../contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkinService } from '../api/checkin.service';
import { chatService } from '../api/chat.service';

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 8 },
  { emoji: '😌', label: 'Calm', value: 7 },
  { emoji: '😐', label: 'Neutral', value: 5 },
  { emoji: '😔', label: 'Sad', value: 3 },
  { emoji: '😰', label: 'Anxious', value: 2 },
];

export const DashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  // Fetch today's check-in
  const { data: todayCheckin, isLoading: checkinLoading } = useQuery({
    queryKey: ['todayCheckin'],
    queryFn: () => checkinService.getTodayCheckin(),
  });

  // Fetch today's chat summary
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['chatSummary', 'today'],
    queryFn: () => chatService.getDailySummary('today'),
  });

  // Submit check-in mutation
  const checkinMutation = useMutation({
    mutationFn: (moodValue: number) => checkinService.submitCheckin(moodValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todayCheckin'] });
      Alert.alert('Success', 'Mood check-in recorded!');
      setSelectedMood(null);
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });

  const handleCheckin = () => {
    if (selectedMood !== null) {
      checkinMutation.mutate(selectedMood);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.name}>{user?.displayName || 'there'}!</Text>
      </View>

      {/* Mood Check-in */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>How are you feeling today?</Text>
        
        {checkinLoading ? (
          <Loading />
        ) : todayCheckin ? (
          <View style={styles.completedCheckin}>
            <Text style={styles.completedEmoji}>
              {MOODS.find(m => m.value === todayCheckin.moodValue)?.emoji || '😊'}
            </Text>
            <Text style={styles.completedText}>
              You're feeling{' '}
              {MOODS.find(m => m.value === todayCheckin.moodValue)?.label.toLowerCase() || 'good'} today
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.moodGrid}>
              {MOODS.map((mood) => (
                <TouchableOpacity
                  key={mood.value}
                  style={[
                    styles.moodButton,
                    selectedMood === mood.value && styles.moodButtonSelected,
                  ]}
                  onPress={() => setSelectedMood(mood.value)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Button
              title="Record mood"
              onPress={handleCheckin}
              disabled={selectedMood === null}
              loading={checkinMutation.isPending}
              fullWidth
              style={styles.submitButton}
            />
          </View>
        )}
      </Card>

      {/* Chat Summary */}
      {summary && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>What we talked about today</Text>
          <Text style={styles.summaryText}>{summary.summary}</Text>
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Quick actions</Text>
        <Button
          title="💬 Talk to Sahaay"
          onPress={() => {}}
          variant="outline"
          fullWidth
          style={styles.actionButton}
        />
        <Button
          title="📝 Write in journal"
          onPress={() => {}}
          variant="outline"
          fullWidth
          style={styles.actionButton}
        />
        <Button
          title="🛡️ Safety plan"
          onPress={() => {}}
          variant="outline"
          fullWidth
        />
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
  header: {
    marginBottom: theme.spacing.xl,
  },
  greeting: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.textMuted,
  },
  name: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
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
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  moodButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}10`,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.xs,
  },
  moodLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text,
  },
  submitButton: {
    marginTop: theme.spacing.sm,
  },
  completedCheckin: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  completedEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.sm,
  },
  completedText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
  },
  summaryText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    lineHeight: 24,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
});
