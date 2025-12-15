export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string; // First line or explicit title
  content: string;
  updatedAt: number;
}

export interface TimerState {
  timeLeft: number; // in seconds
  isActive: boolean;
  mode: 'work' | 'break';
  sessionsCompleted: number;
}

export type ViewName = 'dashboard' | 'tasks' | 'notes' | 'focus';
