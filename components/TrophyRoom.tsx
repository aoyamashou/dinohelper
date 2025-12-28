import React, { useState } from 'react';
import { Trophy, Gift, ShoppingBag, Plus, Trash2 } from 'lucide-react';
import { Achievement, Reward, RedemptionLog } from '../types';
import { DinoCard, DinoButton } from './DinoComponents';

interface TrophyRoomProps {
  currentPoints: number;
  achievements: Achievement[];
  unlockedAchievementIds: string[];
  rewards: Reward[];
  onRedeem: (reward: Reward) => void;
  redemptionHistory: RedemptionLog[];
  onAddReward: (reward: Reward) => void;
  onDeleteReward: (id: string) => void;
}

export const TrophyRoom: React.FC<TrophyRoomProps> = ({
  currentPoints,
  achievements,
  unlockedAchievementIds,
  rewards,
  onRedeem,
  redemptionHistory,
  onAddReward,
  onDeleteReward
}) => {
  const [activeSection, setActiveSection] = useState<'achievements' | 'shop'>('shop');
  const [showManageRewards, setShowManageRewards] = useState(false);

  // New Reward State
  const [newRewardName, setNewRewardName] = useState('');
  const [newRewardPoints, setNewRewardPoints] = useState(50);
  const [newRewardIcon, setNewRewardIcon] = useState('🎁');
  const REWARD_ICONS = ['🎁', '🍦', '🎮', '🎡', '🧸', '🎨', '🍿', '📺', '⚽', '🍰'];

  const handleAddReward = () => {
    if(!newRewardName.trim()) return;
    onAddReward({
      id: Date.now().toString(),
      name: newRewardName,
      points: newRewardPoints,
      icon: newRewardIcon
    });
    setNewRewardName('');
    setNewRewardPoints(50);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Switcher */}
      <div className="flex bg-white/50 p-2 rounded-2xl gap-2">
        <button 
          onClick={() => setActiveSection('shop')}
          className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeSection === 'shop' 
              ? 'bg-orange-500 text-white shadow-md' 
              : 'text-green-800 hover:bg-green-100'
          }`}
        >
          <Gift size={20} /> ごほうびショップ
        </button>
        <button 
          onClick={() => setActiveSection('achievements')}
          className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
            activeSection === 'achievements' 
              ? 'bg-yellow-500 text-white shadow-md' 
              : 'text-green-800 hover:bg-green-100'
          }`}
        >
          <Trophy size={20} /> 実績・トロフィー
        </button>
      </div>

      {activeSection === 'shop' && (
        <>
          <DinoCard title="ポイントを使う">
            <div className="text-center mb-6 p-4 bg-green-100 rounded-xl border-2 border-green-200">
               <div className="text-green-800 font-bold mb-1">現在の持ちポイント</div>
               <div className="text-4xl font-black text-orange-600">{currentPoints} pt</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rewards.map(reward => {
                const canAfford = currentPoints >= reward.points;
                return (
                  <div key={reward.id} className="border-2 border-green-100 bg-white p-4 rounded-2xl flex flex-col items-center text-center shadow-sm relative overflow-hidden group">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{reward.icon}</div>
                    <div className="font-bold text-gray-800 text-lg mb-1">{reward.name}</div>
                    <div className="text-orange-500 font-black mb-3">{reward.points} pt</div>
                    <DinoButton 
                      variant={canAfford ? "primary" : "secondary"} 
                      onClick={() => canAfford && onRedeem(reward)}
                      disabled={!canAfford}
                      className={`w-full ${!canAfford ? 'opacity-50 cursor-not-allowed bg-gray-400 border-gray-500 text-gray-100 shadow-none' : ''}`}
                    >
                      {canAfford ? '交換する！' : '足りない'}
                    </DinoButton>
                  </div>
                )
              })}
            </div>
          </DinoCard>

          {/* Manage Rewards Toggle */}
          <div className="text-center">
            <button 
              onClick={() => setShowManageRewards(!showManageRewards)}
              className="text-green-600 font-bold text-sm underline hover:text-green-800"
            >
              {showManageRewards ? '管理画面を閉じる' : '保護者メニュー：ごほうびを追加・編集'}
            </button>
          </div>

          {showManageRewards && (
             <DinoCard title="ごほうび管理" className="bg-orange-50/50">
               <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input 
                      className="p-3 rounded-xl border-2 border-orange-200" 
                      placeholder="ごほうび名" 
                      value={newRewardName}
                      onChange={e => setNewRewardName(e.target.value)}
                    />
                    <input 
                      type="number"
                      className="p-3 rounded-xl border-2 border-orange-200" 
                      placeholder="必要ポイント" 
                      value={newRewardPoints}
                      onChange={e => setNewRewardPoints(Number(e.target.value))}
                    />
                    <select 
                      className="p-3 rounded-xl border-2 border-orange-200 text-2xl"
                      value={newRewardIcon}
                      onChange={e => setNewRewardIcon(e.target.value)}
                    >
                      {REWARD_ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                 </div>
                 <DinoButton onClick={handleAddReward} className="w-full">
                    <Plus size={18} /> 追加
                 </DinoButton>

                 <div className="mt-4 border-t-2 border-orange-200 pt-4">
                    <h4 className="font-bold text-orange-800 mb-2">削除する</h4>
                    <div className="space-y-2">
                      {rewards.map(r => (
                        <div key={r.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-orange-100">
                          <span className="flex items-center gap-2"><span className="text-xl">{r.icon}</span> {r.name}</span>
                          <button onClick={() => onDeleteReward(r.id)} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button>
                        </div>
                      ))}
                    </div>
                 </div>
               </div>
             </DinoCard>
          )}

          {redemptionHistory.length > 0 && (
            <DinoCard title="交換履歴">
               <div className="space-y-2 max-h-60 overflow-y-auto">
                 {redemptionHistory.slice().reverse().map(log => (
                   <div key={log.id} className="flex justify-between items-center p-3 bg-white border border-green-100 rounded-xl">
                      <div>
                        <div className="font-bold text-gray-800">{log.rewardName}</div>
                        <div className="text-xs text-gray-500">{new Date(log.date).toLocaleDateString()}</div>
                      </div>
                      <div className="font-black text-red-400">-{log.points} pt</div>
                   </div>
                 ))}
               </div>
            </DinoCard>
          )}
        </>
      )}

      {activeSection === 'achievements' && (
        <DinoCard title="トロフィーコレクション">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map(ach => {
              const isUnlocked = unlockedAchievementIds.includes(ach.id);
              return (
                <div key={ach.id} className={`flex flex-col items-center p-4 rounded-2xl border-2 text-center transition-all ${isUnlocked ? 'bg-yellow-50 border-yellow-400 scale-105 shadow-md' : 'bg-gray-100 border-gray-200 opacity-70 grayscale'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3 ${isUnlocked ? 'bg-yellow-200 shadow-inner' : 'bg-gray-200'}`}>
                    {ach.icon}
                  </div>
                  <div className="font-bold text-gray-800 text-sm mb-1">{ach.title}</div>
                  <div className="text-xs text-gray-500 leading-tight">{ach.description}</div>
                  {isUnlocked && <div className="mt-2 text-[10px] bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">GET!</div>}
                </div>
              );
            })}
          </div>
        </DinoCard>
      )}

    </div>
  );
};