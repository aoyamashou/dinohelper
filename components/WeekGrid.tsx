import React, { useMemo } from 'react';
import { startOfWeek, addDays, format, isToday, subWeeks, addWeeks } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Chore, TaskLog } from '../types';
import { DinoCard, EggCheck, DinoButton } from './DinoComponents';

interface WeekGridProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  chores: Chore[];
  logs: TaskLog[];
  onToggleChore: (choreId: string, dateStr: string, points: number) => void;
}

export const WeekGrid: React.FC<WeekGridProps> = ({ 
  currentDate, 
  setCurrentDate, 
  chores, 
  logs, 
  onToggleChore 
}) => {
  
  const weekStart = useMemo(() => startOfWeek(currentDate, { weekStartsOn: 1 }), [currentDate]); // Start Monday
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const getLogForCell = (choreId: string, date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return logs.find(log => log.choreId === choreId && log.date === dateStr);
  };

  const getDayTotal = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return logs
      .filter(log => log.date === dateStr)
      .reduce((sum, log) => sum + log.points, 0);
  };

  const weekTotal = weekDays.reduce((sum, day) => sum + getDayTotal(day), 0);

  return (
    <DinoCard title="今週のミッション" className="w-full max-w-6xl mx-auto">
      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6 bg-green-50 p-2 rounded-xl">
        <DinoButton variant="secondary" onClick={() => setCurrentDate(subWeeks(currentDate, 1))}>
          <ChevronLeft size={24} />
        </DinoButton>
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-black text-green-800 tracking-tight">
            {format(weekStart, 'M月d日', { locale: ja })} - {format(addDays(weekStart, 6), 'M月d日', { locale: ja })}
          </h2>
        </div>
        <DinoButton variant="secondary" onClick={() => setCurrentDate(addWeeks(currentDate, 1))}>
          <ChevronRight size={24} />
        </DinoButton>
      </div>

      {/* Grid Container - Horizontal Scroll on Mobile */}
      <div className="overflow-x-auto pb-4">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="p-3 text-left w-64 sticky left-0 bg-white z-20 border-b-4 border-green-200">
                <span className="text-green-800 font-bold text-lg">ミッション / 日付</span>
              </th>
              {weekDays.map(day => (
                <th key={day.toISOString()} className={`p-2 text-center w-24 border-b-4 border-green-200 ${isToday(day) ? 'bg-yellow-100 rounded-t-lg' : ''}`}>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-green-600 uppercase mb-1">{format(day, 'E', { locale: ja })}</span>
                    <span className={`text-xl font-black ${isToday(day) ? 'text-orange-600' : 'text-green-800'}`}>
                      {format(day, 'd')}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chores.map(chore => (
              <tr key={chore.id} className="group hover:bg-green-50/50 transition-colors">
                <td className="p-3 sticky left-0 bg-white group-hover:bg-green-50/50 z-10 border-b border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl shadow-sm border-2 border-blue-200">
                      {chore.icon || '🦕'}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 text-sm md:text-base">{chore.name}</span>
                      <span className="text-xs font-bold text-orange-500 bg-orange-100 px-2 py-0.5 rounded-full w-fit">
                        {chore.points} pt
                      </span>
                    </div>
                  </div>
                </td>
                {weekDays.map(day => {
                  const isDone = !!getLogForCell(chore.id, day);
                  return (
                    <td key={day.toISOString()} className={`p-2 text-center border-b border-green-100 ${isToday(day) ? 'bg-yellow-50/50' : ''}`}>
                      <div className="flex justify-center">
                        <EggCheck 
                          checked={isDone} 
                          onClick={() => onToggleChore(chore.id, format(day, 'yyyy-MM-dd'), chore.points)} 
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* Totals Row */}
            <tr className="bg-green-100/50">
              <td className="p-4 sticky left-0 bg-green-100 z-10 font-black text-green-800 text-right uppercase tracking-wider border-t-4 border-green-200 rounded-bl-2xl">
                毎日の合計
              </td>
              {weekDays.map(day => (
                <td key={day.toISOString()} className="p-4 text-center font-black text-xl text-green-700 border-t-4 border-green-200">
                  {getDayTotal(day) > 0 ? (
                     <span className="animate-pulse">{getDayTotal(day)}</span>
                  ) : (
                    <span className="opacity-20">-</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-col items-center justify-center p-6 bg-green-800 rounded-2xl text-white shadow-inner">
        <h3 className="text-xl font-bold uppercase tracking-widest text-green-300 mb-2">週間合計ポイント</h3>
        <div className="text-5xl font-black text-yellow-400 drop-shadow-md flex items-center gap-3">
           <span>🦴</span> {weekTotal} <span className="text-2xl text-white font-bold">pt</span>
        </div>
      </div>
    </DinoCard>
  );
};