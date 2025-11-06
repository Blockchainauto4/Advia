// services/marketingHistoryService.ts
import type { SocialPost } from '../types';

const MARKETING_HISTORY_KEY = 'advocaciaai_marketing_history';

export const marketingHistoryService = {
  getHistory: (): SocialPost[] => {
    try {
      const historyJson = localStorage.getItem(MARKETING_HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (e) {
      console.error("Failed to parse marketing history from localStorage", e);
      return [];
    }
  },

  saveHistory: (posts: SocialPost[]): void => {
    try {
      // Keep only the last 20 posts
      const historyToSave = posts.slice(0, 20);
      localStorage.setItem(MARKETING_HISTORY_KEY, JSON.stringify(historyToSave));
    } catch (e) {
      console.error("Failed to save marketing history to localStorage", e);
    }
  },

  savePost: (post: SocialPost): void => {
    try {
      const history = marketingHistoryService.getHistory();
      // Find and replace or add new
      const postIndex = history.findIndex(p => p.id === post.id);
      if (postIndex > -1) {
        history[postIndex] = post;
      } else {
        history.unshift(post); // Add to the beginning
      }
      
      marketingHistoryService.saveHistory(history);
    } catch (e) {
      console.error("Failed to save marketing history to localStorage", e);
    }
  },
};