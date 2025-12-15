import React from 'react';
import { Card, Button } from '../components/ui';
import { Play, Pause, RotateCcw, Coffee, BrainCircuit } from 'lucide-react';
import { WORK_TIME, BREAK_TIME } from '../constants';

interface FocusProps {
  timeLeft: number;
  isActive: boolean;
  mode: 'work' | 'break';
  toggleTimer: () => void;
  resetTimer: () => void;
}

export const Focus: React.FC<FocusProps> = ({ timeLeft, isActive, mode, toggleTimer, resetTimer }) => {
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? ((WORK_TIME - timeLeft) / WORK_TIME) * 100 
    : ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100;

  return (
    <div className="h-full flex flex-col items-center justify-center pb-20 animate-in zoom-in-95 duration-500">
      
      <div className="mb-8 text-center">
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold tracking-wide uppercase ${
            mode === 'work' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
        }`}>
            {mode === 'work' ? <BrainCircuit size={16} /> : <Coffee size={16} />}
            {mode === 'work' ? 'Focus Time' : 'Short Break'}
        </span>
      </div>

      <div className="relative mb-12">
        {/* Ring Background */}
        <div className="w-64 h-64 rounded-full border-8 border-slate-100"></div>
        
        {/* Progress Ring (simplified as SVG for better control, or just conical gradient) */}
        <svg className="absolute top-0 left-0 w-64 h-64 transform -rotate-90 pointer-events-none">
            <circle
                cx="128"
                cy="128"
                r="124"
                fill="none"
                stroke={mode === 'work' ? '#6366f1' : '#10b981'}
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 124}
                strokeDashoffset={2 * Math.PI * 124 * (1 - progress / 100)}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
            />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-slate-800 font-mono tracking-tighter">
                {formatTime(timeLeft)}
            </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button 
            onClick={resetTimer}
            variant="secondary"
            size="icon"
            className="w-14 h-14 rounded-full"
            title="Reset"
        >
            <RotateCcw size={20} />
        </Button>

        <Button 
            onClick={toggleTimer} 
            className={`w-20 h-20 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all ${
                isActive 
                ? 'bg-slate-800 hover:bg-slate-900 ring-slate-200' 
                : mode === 'work' ? 'bg-indigo-600 hover:bg-indigo-700 ring-indigo-200' : 'bg-emerald-500 hover:bg-emerald-600 ring-emerald-200'
            }`}
        >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </Button>
      </div>

      <p className="mt-12 text-slate-400 text-sm max-w-xs text-center">
        {isActive 
            ? "Stay focused on your task. You can do this!" 
            : mode === 'work' 
                ? "Ready to start? 25 minutes of pure focus." 
                : "Time to relax. Take a deep breath."}
      </p>

    </div>
  );
};