import { Chore, Achievement, Reward } from './types';

export const INITIAL_CHORES: Chore[] = [
  { id: '1', name: 'お布団をたたむ', points: 10, icon: '🛏️' },
  { id: '2', name: 'おもちゃの片付け', points: 20, icon: '🧸' },
  { id: '3', name: 'お皿洗い', points: 30, icon: '🍽️' },
  { id: '4', name: '宿題をする', points: 50, icon: '📝' },
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { 
    id: 'first_step', 
    title: '初めの一歩', 
    description: '初めてお手伝いを記録した', 
    condition: 'count_total', 
    threshold: 1, 
    icon: '🥚' 
  },
  { 
    id: 'busy_bee', 
    title: '働きアリさん', 
    description: '1週間で5回お手伝いをした', 
    condition: 'count_week', 
    threshold: 5, 
    icon: '🐝' 
  },
  { 
    id: 'point_master', 
    title: 'ポイント名人', 
    description: '合計ポイントが100に到達', 
    condition: 'points_total', 
    threshold: 100, 
    icon: '🥉' 
  },
  { 
    id: 'dino_king', 
    title: '恐竜キング', 
    description: '合計ポイントが1000に到達', 
    condition: 'points_total', 
    threshold: 1000, 
    icon: '👑' 
  },
];

export const INITIAL_REWARDS: Reward[] = [
  { id: 'r1', name: 'おやつ1個', points: 50, icon: '🍩' },
  { id: 'r2', name: 'ゲーム30分', points: 100, icon: '🎮' },
  { id: 'r3', name: '公園に行く', points: 200, icon: '⛲' },
];

export const DINO_QUOTES = [
  "すごいぞ！",
  "そのちょうし！",
  "かっこいい！",
  "ガオー！",
  "よくできたね！"
];