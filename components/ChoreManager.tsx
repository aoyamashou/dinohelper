import React, { useState } from 'react';
import { Trash2, Plus, Sparkles } from 'lucide-react';
import { Chore } from '../types';
import { DinoCard, DinoButton } from './DinoComponents';

interface ChoreManagerProps {
  chores: Chore[];
  onAddChore: (chore: Chore) => void;
  onDeleteChore: (id: string) => void;
}

export const ChoreManager: React.FC<ChoreManagerProps> = ({ chores, onAddChore, onDeleteChore }) => {
  const [newName, setNewName] = useState('');
  const [newPoints, setNewPoints] = useState(10);
  const [newIcon, setNewIcon] = useState('🦕');

  const ICONS = ['🦕', '🦖', '🧹', '🧺', '🧸', '🛏️', '🍽️', '🚿', '📚', '🐶', '🗑️', '🌱'];

  const handleAdd = () => {
    if (!newName.trim()) return;
    const newChore: Chore = {
      id: Date.now().toString(),
      name: newName,
      points: newPoints,
      icon: newIcon
    };
    onAddChore(newChore);
    setNewName('');
    setNewPoints(10);
  };

  return (
    <DinoCard title="ミッション管理" className="max-w-2xl mx-auto">
      {/* Add New Form */}
      <div className="bg-green-50 p-6 rounded-2xl border-2 border-green-200 mb-8">
        <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
          <Sparkles size={20} className="text-yellow-500" /> 
          新しいミッションを作る
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-green-700 mb-1">ミッションの名前</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="例：犬の散歩"
              className="w-full p-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none font-medium text-gray-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-green-700 mb-1">ポイント</label>
              <input
                type="number"
                min="1"
                max="1000"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
                className="w-full p-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none font-bold text-gray-700"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-green-700 mb-1">アイコン</label>
              <select 
                value={newIcon} 
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-green-200 focus:border-green-500 focus:outline-none text-2xl"
              >
                {ICONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>

          <DinoButton onClick={handleAdd} className="w-full mt-4 flex items-center justify-center gap-2">
            <Plus size={20} /> 追加する
          </DinoButton>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-green-800 mb-2 pl-2">今のミッション一覧</h3>
        {chores.length === 0 && (
          <p className="text-center text-gray-400 py-4 italic">まだミッションがありません。上から追加してね！</p>
        )}
        {chores.map(chore => (
          <div key={chore.id} className="flex items-center justify-between p-4 bg-white border-2 border-green-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-2xl">
                {chore.icon}
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{chore.name}</h4>
                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">
                  {chore.points} ポイント
                </span>
              </div>
            </div>
            <button 
              onClick={() => onDeleteChore(chore.id)}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="削除"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
    </DinoCard>
  );
};