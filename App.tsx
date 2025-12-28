import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { CalendarDays, Settings, History, Trophy, Gift } from 'lucide-react';
import { startOfWeek, addDays, isSameDay } from 'date-fns';
import { AppTab, Chore, TaskLog, Reward, RedemptionLog, Achievement } from './types';
import { StorageService } from './services/storageService';
import { INITIAL_ACHIEVEMENTS } from './constants';
import { WeekGrid } from './components/WeekGrid';
import { ChoreManager } from './components/ChoreManager';
import { HistoryLog } from './components/HistoryLog';
import { TrophyRoom } from './components/TrophyRoom';
import { DinoBadge } from './components/DinoComponents';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.HOME);
  const [chores, setChores] = useState<Chore[]>([]);
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<RedemptionLog[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  
  const [currentDate, setCurrentDate] = useState(new Date());

  // Load Initial Data
  useEffect(() => {
    setChores(StorageService.getChores());
    setLogs(StorageService.getLogs());
    setRewards(StorageService.getRewards());
    setRedemptions(StorageService.getRedemptions());
    setUnlockedAchievements(StorageService.getUnlockedAchievements());
  }, []);

  // Derived State
  const totalEarnedPoints = logs.reduce((sum, log) => sum + log.points, 0);
  const totalSpentPoints = redemptions.reduce((sum, log) => sum + log.points, 0);
  const currentBalance = totalEarnedPoints - totalSpentPoints;

  // Achievement Checker
  useEffect(() => {
    const checkAchievements = () => {
      let newUnlockIds: string[] = [];

      INITIAL_ACHIEVEMENTS.forEach(ach => {
        if (unlockedAchievements.includes(ach.id)) return;

        let unlocked = false;
        
        if (ach.condition === 'count_total') {
          if (logs.length >= ach.threshold) unlocked = true;
        } else if (ach.condition === 'points_total') {
          if (totalEarnedPoints >= ach.threshold) unlocked = true;
        } else if (ach.condition === 'count_week') {
          // Check max chores done in any single week
          // Simplified: Check current week window or simple iteration
          // Let's check the last 7 days from now for simplicity in this context
          const now = new Date();
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const recentLogs = logs.filter(l => l.timestamp > oneWeekAgo.getTime());
          if (recentLogs.length >= ach.threshold) unlocked = true;
        }

        if (unlocked) {
          newUnlockIds.push(ach.id);
        }
      });

      if (newUnlockIds.length > 0) {
        const updated = [...unlockedAchievements, ...newUnlockIds];
        setUnlockedAchievements(updated);
        StorageService.saveUnlockedAchievements(updated);
        // Could trigger a confetti animation here in future
        alert(`🏆 新しい実績を解除しました！`);
      }
    };

    if (logs.length > 0) {
      checkAchievements();
    }
  }, [logs, totalEarnedPoints, unlockedAchievements]);

  // Handlers
  const handleAddChore = (chore: Chore) => {
    const updated = [...chores, chore];
    setChores(updated);
    StorageService.saveChores(updated);
  };

  const handleDeleteChore = (id: string) => {
    const updated = chores.filter(c => c.id !== id);
    setChores(updated);
    StorageService.saveChores(updated);
  };

  const handleToggleChore = (choreId: string, dateStr: string, points: number) => {
    const existingLogIndex = logs.findIndex(
      l => l.choreId === choreId && l.date === dateStr
    );

    let updatedLogs;
    if (existingLogIndex >= 0) {
      // Remove log (untoggle)
      updatedLogs = [...logs];
      updatedLogs.splice(existingLogIndex, 1);
    } else {
      // Add log
      const newLog: TaskLog = {
        id: crypto.randomUUID(),
        choreId,
        date: dateStr,
        points,
        timestamp: Date.now()
      };
      updatedLogs = [...logs, newLog];
    }
    setLogs(updatedLogs);
    StorageService.saveLogs(updatedLogs);
  };

  const handleRedeem = (reward: Reward) => {
    if (currentBalance < reward.points) return;

    if (window.confirm(`${reward.name}を交換しますか？ (${reward.points} pt)`)) {
      const newRedemption: RedemptionLog = {
        id: crypto.randomUUID(),
        rewardId: reward.id,
        rewardName: reward.name,
        points: reward.points,
        date: new Date().toISOString(),
        timestamp: Date.now()
      };
      const updated = [...redemptions, newRedemption];
      setRedemptions(updated);
      StorageService.saveRedemptions(updated);
      alert('こうかんしました！やったね！');
    }
  };

  const handleAddReward = (r: Reward) => {
    const updated = [...rewards, r];
    setRewards(updated);
    StorageService.saveRewards(updated);
  }

  const handleDeleteReward = (id: string) => {
    const updated = rewards.filter(r => r.id !== id);
    setRewards(updated);
    StorageService.saveRewards(updated);
  }

  return (
    <HashRouter>
      <div className="min-h-screen pb-24 font-sans text-gray-800">
        
        {/* Header */}
        <header className="bg-green-600 text-white shadow-lg border-b-8 border-green-700 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl filter drop-shadow-md">🦖</span>
              <div>
                <h1 className="text-xl md:text-3xl font-black uppercase tracking-wider text-yellow-300 drop-shadow-md leading-none">
                  DinoHelper
                </h1>
                <p className="text-green-200 text-xs font-bold tracking-widest uppercase">お手伝いキロク</p>
              </div>
            </div>
            
            <div className="hidden md:block">
               <div className="flex items-center gap-4 bg-green-800/50 px-4 py-2 rounded-xl border border-green-500">
                  <Trophy className="text-yellow-400" size={24} />
                  <div className="flex flex-col items-end leading-none">
                    <span className="text-xs font-bold text-green-200 uppercase">今のポイント</span>
                    <span className="text-2xl font-black text-white">{currentBalance}</span>
                  </div>
               </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-4 py-8">
          
          {/* Mobile Points Display */}
          <div className="md:hidden flex justify-center mb-8">
             <DinoBadge points={currentBalance} />
          </div>

          {activeTab === AppTab.HOME && (
            <div className="animate-fade-in-up">
              <WeekGrid 
                currentDate={currentDate} 
                setCurrentDate={setCurrentDate} 
                chores={chores}
                logs={logs}
                onToggleChore={handleToggleChore}
              />
            </div>
          )}

          {activeTab === AppTab.CHORES && (
             <div className="animate-fade-in-up">
              <ChoreManager 
                chores={chores}
                onAddChore={handleAddChore}
                onDeleteChore={handleDeleteChore}
              />
            </div>
          )}

          {activeTab === AppTab.REWARDS && (
            <div className="animate-fade-in-up">
              <TrophyRoom 
                currentPoints={currentBalance}
                achievements={INITIAL_ACHIEVEMENTS}
                unlockedAchievementIds={unlockedAchievements}
                rewards={rewards}
                onRedeem={handleRedeem}
                redemptionHistory={redemptions}
                onAddReward={handleAddReward}
                onDeleteReward={handleDeleteReward}
              />
            </div>
          )}

          {activeTab === AppTab.HISTORY && (
             <div className="animate-fade-in-up">
              <HistoryLog logs={logs} chores={chores} />
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-green-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
          <div className="max-w-md mx-auto flex justify-around p-2">
            <NavButton 
              active={activeTab === AppTab.HOME} 
              onClick={() => setActiveTab(AppTab.HOME)} 
              icon={<CalendarDays size={24} />} 
              label="カレンダー" 
            />
            <NavButton 
              active={activeTab === AppTab.CHORES} 
              onClick={() => setActiveTab(AppTab.CHORES)} 
              icon={<Settings size={24} />} 
              label="ミッション" 
            />
            <NavButton 
              active={activeTab === AppTab.REWARDS} 
              onClick={() => setActiveTab(AppTab.REWARDS)} 
              icon={<Gift size={24} />} 
              label="ごほうび" 
            />
            <NavButton 
              active={activeTab === AppTab.HISTORY} 
              onClick={() => setActiveTab(AppTab.HISTORY)} 
              icon={<History size={24} />} 
              label="きろく" 
            />
          </div>
        </nav>
      </div>
    </HashRouter>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-20 py-2 rounded-2xl transition-all duration-200 ${
      active 
        ? 'text-green-600 bg-green-50 -translate-y-4 shadow-lg border-2 border-green-200' 
        : 'text-gray-400 hover:text-green-500 hover:bg-green-50/50'
    }`}
  >
    <div className={`mb-1 ${active ? 'scale-110' : ''} transition-transform`}>{icon}</div>
    <span className="text-[10px] font-bold tracking-wide">{label}</span>
  </button>
);

export default App;