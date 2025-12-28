import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TaskLog, Chore } from '../types';
import { DinoCard } from './DinoComponents';

interface HistoryLogProps {
  logs: TaskLog[];
  chores: Chore[];
}

export const HistoryLog: React.FC<HistoryLogProps> = ({ logs, chores }) => {
  // Process data for Chart (Last 7 active days)
  const chartData = React.useMemo(() => {
    const grouped: Record<string, number> = {};
    logs.forEach(log => {
      grouped[log.date] = (grouped[log.date] || 0) + log.points;
    });
    
    // Sort by date and take last 7 entries
    return Object.entries(grouped)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-7)
      .map(([date, points]) => ({
        date: format(new Date(date), 'MM/dd'),
        points
      }));
  }, [logs]);

  // Merge logs with chore names for list
  const enrichedLogs = React.useMemo(() => {
    return [...logs].sort((a, b) => b.timestamp - a.timestamp).map(log => {
      const chore = chores.find(c => c.id === log.choreId);
      return {
        ...log,
        choreName: chore ? chore.name : '不明なミッション',
        choreIcon: chore ? chore.icon : '❓'
      };
    });
  }, [logs, chores]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Chart Section */}
      <DinoCard title="ポイントのきろく">
        <div className="h-64 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dcfce7" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#166534', fontSize: 12, fontWeight: 'bold' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fill: '#166534', fontSize: 12, fontWeight: 'bold' }} 
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: '#f0fdf4' }}
                  contentStyle={{ borderRadius: '12px', border: '2px solid #22c55e', color: '#15803d', fontWeight: 'bold' }}
                />
                <Bar dataKey="points" fill="#facc15" radius={[6, 6, 0, 0]} barSize={40} stroke="#ca8a04" strokeWidth={2} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">
              お手伝いをしてポイントをためよう！
            </div>
          )}
        </div>
      </DinoCard>

      {/* Recent Logs Section */}
      <DinoCard title="最近の活動">
        <div className="overflow-hidden">
          <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {enrichedLogs.length === 0 && (
               <p className="text-center text-gray-400 py-8">まだ記録がありません。がんばろう！</p>
            )}
            {enrichedLogs.map(log => (
              <div key={log.timestamp + log.id} className="flex items-center justify-between p-4 bg-white border border-green-100 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="text-2xl w-10 text-center">{log.choreIcon}</div>
                  <div>
                    <div className="font-bold text-gray-800">{log.choreName}</div>
                    <div className="text-xs text-green-600 font-medium uppercase tracking-wide">
                      {format(new Date(log.date), 'M月d日 (E)', { locale: ja })}
                    </div>
                  </div>
                </div>
                <div className="font-black text-xl text-orange-500">
                  +{log.points}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DinoCard>
    </div>
  );
};