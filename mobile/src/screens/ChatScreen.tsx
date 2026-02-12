import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Input, Button, Loading } from '../components';
import { theme } from '../theme';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../api/chat.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ChatScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const flatListRef = useRef<FlatList>(null);
  const [inputText, setInputText] = useState('');

  // Fetch chat history
  const { data: messages, isLoading } = useQuery({
    queryKey: ['chatMessages'],
    queryFn: chatService.getMessages,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });

  const messageList = messages || [];

  // Send message mutation
  const sendMutation = useMutation({
    mutationFn: (message: string) => chatService.sendMessage(message),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages'] });
      setInputText('');
    },
  });

  const handleSend = () => {
    if (inputText.trim()) {
      sendMutation.mutate(inputText.trim());
    }
  };

  useEffect(() => {
    if (messageList.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messageList.length]);

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    
    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}
      >
        <Text style={[styles.messageText, isUser && styles.userText]}>
          {item.content}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return <Loading fullScreen text="Loading chat..." />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messageList}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>Start a conversation</Text>
            <Text style={styles.emptyText}>
              Share what's on your mind. I'm here to listen and support you.
            </Text>
          </View>
        }
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <Input
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          multiline
          containerStyle={styles.input}
          style={styles.inputField}
          onSubmitEditing={handleSend}
        />
        <Button
          title={sendMutation.isPending ? '...' : '→'}
          onPress={handleSend}
          disabled={!inputText.trim() || sendMutation.isPending}
          style={styles.sendButton}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  messageList: {
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.card,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    marginRight: theme.spacing.sm,
    marginBottom: 0,
  },
  inputField: {
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.full,
    marginBottom: theme.spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
