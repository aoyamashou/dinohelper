import React from 'react';

export const DinoCard: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white/90 backdrop-blur-sm border-4 border-green-600 rounded-3xl shadow-[8px_8px_0px_0px_rgba(22,163,74,1)] overflow-hidden ${className}`}>
    {title && (
      <div className="bg-green-600 text-white p-3 font-bold text-xl tracking-wider flex items-center justify-center border-b-4 border-green-700">
        <span className="mr-2">🦕</span> {title} <span className="ml-2">🦖</span>
      </div>
    )}
    <div className="p-4 sm:p-6">
      {children}
    </div>
  </div>
);

export const DinoButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold py-2 px-4 rounded-xl transition-all active:translate-y-1 active:shadow-none border-b-4 tracking-wide flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-orange-400 hover:bg-orange-500 text-white border-orange-600 shadow-orange-600/50 shadow-md",
    secondary: "bg-blue-400 hover:bg-blue-500 text-white border-blue-600 shadow-blue-600/50 shadow-md",
    danger: "bg-red-400 hover:bg-red-500 text-white border-red-600 shadow-red-600/50 shadow-md",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const DinoBadge: React.FC<{ points: number }> = ({ points }) => (
  <div className="flex flex-col items-center animate-bounce-slow">
    <div className="relative">
      <div className="w-24 h-24 bg-yellow-400 rounded-full border-4 border-yellow-600 flex items-center justify-center shadow-lg z-10 relative">
         <span className="text-3xl font-black text-yellow-800">{points}</span>
      </div>
      <div className="absolute -bottom-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-green-800">
        PT
      </div>
    </div>
  </div>
);

export const EggCheck: React.FC<{ checked: boolean; onClick: () => void }> = ({ checked, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
      checked 
        ? 'bg-green-500 rotate-0 scale-100 shadow-inner' 
        : 'bg-stone-200 -rotate-6 hover:bg-stone-300 hover:scale-105 shadow-md'
    }`}
    aria-label={checked ? "Unmark chore" : "Mark chore done"}
  >
    {checked ? (
      <span className="text-2xl">🥚✨</span>
    ) : (
      <span className="text-xl opacity-30">🥚</span>
    )}
  </button>
);