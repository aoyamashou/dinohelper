export interface Chore {
  id: string;
  name: string;
  points: number;
  icon?: string; // Emoji or icon name
}

export interface TaskLog {
  id: string;
  choreId: string;
  date: string; // ISO Date string YYYY-MM-DD
  points: number;
  timestamp: number;
}

export interface RedemptionLog {
  id: string;
  rewardId: string;
  rewardName: string;
  points: number; // Cost
  date: string;
  timestamp: number;
}

export interface Reward {
  id: string;
  name: string;
  points: number;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  condition: 'count_total' | 'count_week' | 'points_total';
  threshold: number;
  icon: string;
}

export enum AppTab {
  HOME = 'HOME',
  CHORES = 'CHORES',
  REWARDS = 'REWARDS',
  HISTORY = 'HISTORY',
}