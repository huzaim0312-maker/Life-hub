import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, CheckSquare, StickyNote, Timer } from 'lucide-react';

import { useLocalStorage } from './hooks/useLocalStorage';
import { Dashboard } from './features/Dashboard';
import { Tasks } from './features/Tasks';
import { Notes } from './features/Notes';
import { Focus } from './features/Focus';

import { Task, Note, ViewName } from './types';
import { WORK_TIME, BREAK_TIME, STORAGE_KEYS } from './constants';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewName>('dashboard');
  
  // --- Data Persistence ---
  const [tasks, setTasks] = useLocalStorage<Task[]>(STORAGE_KEYS.TASKS, []);
  const [notes, setNotes] = useLocalStorage<Note[]>(STORAGE_KEYS.NOTES, []);
  const [focusSessions, setFocusSessions] = useLocalStorage<number>(STORAGE_KEYS.TIMER_SESSIONS, 0);

  // --- Timer State (Lifted to App so it persists across views) ---
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      if (mode === 'work') {
        setFocusSessions(s => s + 1);
        // Optional: Play sound here
        try {
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch(e) {}
        
        if (confirm("Focus session complete! Take a break?")) {
            setMode('break');
            setTimeLeft(BREAK_TIME);
            setIsActive(false); // Auto-pause or auto-start? Let's pause to let user breathe.
        } else {
            setIsActive(false);
        }
      } else {
        // Break finished
        try {
            const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
            audio.play().catch(e => console.log('Audio play failed', e));
        } catch(e) {}

        if (confirm("Break over! Ready to focus again?")) {
            setMode('work');
            setTimeLeft(WORK_TIME);
            setIsActive(false);
        } else {
            setIsActive(false);
        }
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, setFocusSessions]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  // --- Navigation Item Component ---
  const NavItem = ({ view, icon: Icon, label }: { view: ViewName; icon: any; label: string }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex flex-col items-center justify-center w-full py-3 transition-colors duration-200 ${
        currentView === view ? 'text-primary' : 'text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon size={24} strokeWidth={currentView === view ? 2.5 : 2} />
      <span className="text-[10px] font-medium mt-1">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-slate-100">
      
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative p-6">
        {currentView === 'dashboard' && (
          <Dashboard tasks={tasks} focusSessionsCompleted={focusSessions} />
        )}
        {currentView === 'tasks' && (
          <Tasks tasks={tasks} setTasks={setTasks} />
        )}
        {currentView === 'notes' && (
          <Notes notes={notes} setNotes={setNotes} />
        )}
        {currentView === 'focus' && (
          <Focus 
            timeLeft={timeLeft} 
            isActive={isActive} 
            mode={mode} 
            toggleTimer={toggleTimer} 
            resetTimer={resetTimer}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-slate-100 flex justify-around items-center pb-safe-area z-10">
        <NavItem view="dashboard" icon={LayoutDashboard} label="Home" />
        <NavItem view="tasks" icon={CheckSquare} label="Tasks" />
        <NavItem view="notes" icon={StickyNote} label="Notes" />
        <NavItem view="focus" icon={Timer} label="Focus" />
      </nav>

    </div>
  );
}