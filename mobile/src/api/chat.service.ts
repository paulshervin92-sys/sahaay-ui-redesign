import { apiFetch } from './client';

export interface ChatMessage {
  id: string;
  userId: string;
  sender: 'user' | 'ai';
  text: string;
  createdAt: string;
  dayKey: string;
}

export interface SendMessageInput {
  text: string;
  timezone?: string;
}

export interface SendMessageResponse {
  userMessage: ChatMessage;
  aiMessage: ChatMessage;
}

export interface DailyChatSummary {
  id: string;
  userId: string;
  dayKey: string;
  summary: string;
  topEmotions: string[];
  updatedAt: string;
}

/**
 * Send chat message and get AI response
 */
export const sendMessage = async (data: SendMessageInput): Promise<SendMessageResponse> => {
  return apiFetch<SendMessageResponse>('/api/chat/send', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

/**
 * Get chat history for today
 */
export const getTodayMessages = async (timezone: string): Promise<ChatMessage[]> => {
  const response = await apiFetch<{ messages: ChatMessage[] }>(
    `/api/chat/today?timezone=${encodeURIComponent(timezone)}`
  );
  return response.messages;
};

// Export service object for compatibility
export const chatService = {
  sendMessage: async (text: string) => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return sendMessage({ text, timezone });
  },
  getMessages: async () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const messages = await getTodayMessages(timezone);
    // Transform to expected format
    return messages.map(msg => ({
      id: msg.id,
      role: (msg.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: msg.text,
      timestamp: new Date(msg.createdAt),
    }));
  },
  getDailySummary: async (day: string) => {
    return apiFetch<DailyChatSummary>(`/api/chat/summary/${day}`);
  },
};

/**
 * Get chat history
 */
export const getChatHistory = async (limit = 50): Promise<ChatMessage[]> => {
  const response = await apiFetch<{ messages: ChatMessage[] }>(
    `/api/chat/history?limit=${limit}`
  );
  return response.messages;
};

/**
 * Get today's chat summary
 */
export const getTodaySummary = async (timezone: string): Promise<string | null> => {
  try {
    const response = await apiFetch<{ summary: string }>(
      `/api/chat/summary/today?timezone=${encodeURIComponent(timezone)}`
    );
    return response.summary;
  } catch (error) {
    return null;
  }
};

/**
 * Clear chat history
 */
export const clearChatHistory = async (): Promise<void> => {
  return apiFetch<void>('/api/chat/clear', {
    method: 'DELETE',
  });
};
