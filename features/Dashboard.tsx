import React from 'react';
import { Task } from '../types';
import { Card } from '../components/ui';
import { CheckCircle2, Clock, ListTodo, Flame } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  focusSessionsCompleted: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, focusSessionsCompleted }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Get greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      <header className="px-1">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{greeting}</h1>
        <p className="text-slate-500 mt-1">Here's your daily overview.</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col items-center justify-center py-6 border-indigo-100 bg-indigo-50/50">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-full mb-3">
            <ListTodo size={24} />
          </div>
          <span className="text-3xl font-bold text-indigo-900">{pendingTasks}</span>
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider mt-1">To Do</span>
        </Card>

        <Card className="flex flex-col items-center justify-center py-6 border-emerald-100 bg-emerald-50/50">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full mb-3">
            <CheckCircle2 size={24} />
          </div>
          <span className="text-3xl font-bold text-emerald-900">{completedTasks}</span>
          <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider mt-1">Done</span>
        </Card>
      </div>

      <Card className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-100">
        <div>
          <p className="text-sm font-semibold text-orange-800 mb-1 flex items-center gap-2">
             <Flame size={16} className="text-orange-500" fill="currentColor" /> Focus Sessions
          </p>
          <p className="text-3xl font-bold text-slate-800">{focusSessionsCompleted}</p>
        </div>
        <div className="h-16 w-16 rounded-full border-4 border-orange-200 flex items-center justify-center">
            <Clock size={24} className="text-orange-400" />
        </div>
      </Card>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 px-1">Progress</h3>
        <Card className="p-6">
            <div className="flex justify-between items-end mb-2">
                <span className="text-sm text-slate-500 font-medium">Task Completion</span>
                <span className="text-2xl font-bold text-primary">{completionRate}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                    className="bg-primary h-3 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${completionRate}%` }}
                ></div>
            </div>
            <p className="text-xs text-slate-400 mt-3 text-center">
                {completionRate === 100 ? "All caught up! Great job." : "Keep going, you're doing great."}
            </p>
        </Card>
      </div>
    </div>
  );
};