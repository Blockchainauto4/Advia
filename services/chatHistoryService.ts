// services/chatHistoryService.ts
import type { Conversation, ChatMessage } from '../types.ts';

const HISTORY_KEY = 'advocaciaai_chat_history';

type ChatHistoryStore = {
  [assistantId: string]: Conversation[];
};

const getHistoryStore = (): ChatHistoryStore => {
  try {
    const storeJson = localStorage.getItem(HISTORY_KEY);
    return storeJson ? JSON.parse(storeJson) : {};
  } catch (e) {
    console.error("Failed to parse chat history from localStorage", e);
    return {};
  }
};

const saveHistoryStore = (store: ChatHistoryStore): void => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(store));
  } catch (e) {
    console.error("Failed to save chat history to localStorage", e);
  }
};

export const chatHistoryService = {
  getConversationsForAssistant: (assistantId: string): Conversation[] => {
    const store = getHistoryStore();
    return store[assistantId] || [];
  },

  saveConversation: (assistantId: string, conversation: Conversation): void => {
    const store = getHistoryStore();
    if (!store[assistantId]) {
      store[assistantId] = [];
    }
    // Add to the beginning of the list
    store[assistantId].unshift(conversation);
    saveHistoryStore(store);
  },

  updateConversationMessages: (assistantId: string, conversationId: string, messages: ChatMessage[]): void => {
    const store = getHistoryStore();
    if (!store[assistantId]) return;

    const conversationIndex = store[assistantId].findIndex(c => c.id === conversationId);
    if (conversationIndex > -1) {
      store[assistantId][conversationIndex].messages = messages;
      saveHistoryStore(store);
    }
  },
  
  deleteConversation: (assistantId: string, conversationId: string): void => {
    const store = getHistoryStore();
    if (!store[assistantId]) return;

    store[assistantId] = store[assistantId].filter(c => c.id !== conversationId);
    saveHistoryStore(store);
  },
};