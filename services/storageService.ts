import { Chore, TaskLog, RedemptionLog, Reward } from '../types';
import { INITIAL_CHORES, INITIAL_REWARDS } from '../constants';

const KEYS = {
  CHORES: 'dino_chores',
  LOGS: 'dino_logs',
  REDEMPTIONS: 'dino_redemptions',
  REWARDS: 'dino_rewards',
  ACHIEVEMENTS: 'dino_unlocked_achievements', // Stores array of IDs
};

export const StorageService = {
  getChores: (): Chore[] => {
    try {
      const stored = localStorage.getItem(KEYS.CHORES);
      return stored ? JSON.parse(stored) : INITIAL_CHORES;
    } catch (e) {
      return INITIAL_CHORES;
    }
  },

  saveChores: (chores: Chore[]) => {
    localStorage.setItem(KEYS.CHORES, JSON.stringify(chores));
  },

  getLogs: (): TaskLog[] => {
    try {
      const stored = localStorage.getItem(KEYS.LOGS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveLogs: (logs: TaskLog[]) => {
    localStorage.setItem(KEYS.LOGS, JSON.stringify(logs));
  },

  getRedemptions: (): RedemptionLog[] => {
    try {
      const stored = localStorage.getItem(KEYS.REDEMPTIONS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveRedemptions: (redemptions: RedemptionLog[]) => {
    localStorage.setItem(KEYS.REDEMPTIONS, JSON.stringify(redemptions));
  },

  getRewards: (): Reward[] => {
    try {
      const stored = localStorage.getItem(KEYS.REWARDS);
      return stored ? JSON.parse(stored) : INITIAL_REWARDS;
    } catch (e) {
      return INITIAL_REWARDS;
    }
  },

  saveRewards: (rewards: Reward[]) => {
    localStorage.setItem(KEYS.REWARDS, JSON.stringify(rewards));
  },

  getUnlockedAchievements: (): string[] => {
    try {
      const stored = localStorage.getItem(KEYS.ACHIEVEMENTS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveUnlockedAchievements: (ids: string[]) => {
    localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(ids));
  }
};