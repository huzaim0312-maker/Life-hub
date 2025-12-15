import React, { useState } from 'react';
import { Task } from '../types';
import { Card, Button, Input, IconButton } from '../components/ui';
import { Check, Trash2, Plus, X, Circle, CheckCircle2 } from 'lucide-react';

interface TasksProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const Tasks: React.FC<TasksProps> = ({ tasks, setTasks }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const addTask = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      text: newTaskText.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setNewTaskText('');
    setIsAdding(false);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    if (confirm('Are you sure you want to remove all completed tasks?')) {
        setTasks(tasks.filter(t => !t.completed));
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
      <header className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-2xl font-bold text-slate-800">Tasks</h2>
        {completedCount > 0 && (
            <button 
                onClick={clearCompleted}
                className="text-xs text-red-500 font-medium hover:text-red-600 transition-colors"
            >
                Clear Completed
            </button>
        )}
      </header>

      {isAdding ? (
        <Card className="mb-6 animate-in fade-in zoom-in-95 duration-200">
          <form onSubmit={addTask} className="flex flex-col gap-3">
            <Input 
              autoFocus
              placeholder="What needs to be done?" 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit" size="sm">Add Task</Button>
            </div>
          </form>
        </Card>
      ) : (
        <Button 
            className="mb-6 w-full py-6 border border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-600 shadow-none" 
            onClick={() => setIsAdding(true)}
        >
            <Plus size={18} className="mr-2" /> Add New Task
        </Button>
      )}

      <div className="flex-1 overflow-y-auto space-y-3 pb-24">
        {tasks.length === 0 && !isAdding && (
            <div className="text-center py-20 text-slate-400">
                <p>No tasks yet.</p>
                <p className="text-sm">Tap "Add New Task" to get started.</p>
            </div>
        )}
        
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`group flex items-center gap-3 p-4 bg-white rounded-xl border transition-all duration-200 ${
                task.completed ? 'border-transparent bg-slate-50/50' : 'border-slate-100 shadow-sm'
            }`}
          >
            <button 
                onClick={() => toggleTask(task.id)}
                className={`flex-shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-primary'}`}
            >
                {task.completed ? <CheckCircle2 size={24} className="fill-emerald-50" /> : <Circle size={24} />}
            </button>
            
            <span 
                className={`flex-1 text-sm font-medium transition-all ${
                    task.completed ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-700'
                }`}
            >
                {task.text}
            </span>

            <button 
                onClick={() => deleteTask(task.id)}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-slate-300 hover:text-red-500 transition-all p-2"
                aria-label="Delete task"
            >
                <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};