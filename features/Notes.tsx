import React, { useState } from 'react';
import { Note } from '../types';
import { Card, Button, Input, TextArea, IconButton } from '../components/ui';
import { Plus, Trash2, ArrowLeft, Save, Edit2 } from 'lucide-react';

interface NotesProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
}

export const Notes: React.FC<NotesProps> = ({ notes, setNotes }) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  
  // If we are editing or creating, we show the editor view
  const isEditorOpen = editingNoteId !== null;

  const openEditor = (note?: Note) => {
    if (note) {
      setEditingNoteId(note.id);
      setEditTitle(note.title);
      setEditContent(note.content);
    } else {
      // New note
      setEditingNoteId('new');
      setEditTitle('');
      setEditContent('');
    }
  };

  const closeEditor = () => {
    setEditingNoteId(null);
    setEditTitle('');
    setEditContent('');
  };

  const saveNote = () => {
    if (!editTitle.trim() && !editContent.trim()) {
        closeEditor();
        return;
    }

    const titleToSave = editTitle.trim() || 'Untitled Note';
    const timestamp = Date.now();

    if (editingNoteId === 'new') {
        const newNote: Note = {
            id: crypto.randomUUID(),
            title: titleToSave,
            content: editContent,
            updatedAt: timestamp,
        };
        setNotes([newNote, ...notes]);
    } else {
        setNotes(notes.map(n => n.id === editingNoteId ? {
            ...n,
            title: titleToSave,
            content: editContent,
            updatedAt: timestamp
        } : n));
    }
    closeEditor();
  };

  const deleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this note?')) {
        setNotes(notes.filter(n => n.id !== id));
        if (editingNoteId === id) closeEditor();
    }
  };

  if (isEditorOpen) {
    return (
      <div className="h-full flex flex-col animate-in slide-in-from-right-8 duration-300">
        <header className="flex items-center justify-between mb-4">
            <IconButton onClick={closeEditor}>
                <ArrowLeft size={20} />
            </IconButton>
            <span className="font-semibold text-slate-800">{editingNoteId === 'new' ? 'New Note' : 'Edit Note'}</span>
            <Button size="sm" onClick={saveNote} className="gap-2">
                <Save size={16} /> Save
            </Button>
        </header>
        <div className="flex-1 flex flex-col gap-4">
            <Input 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title"
                className="text-lg font-bold border-none shadow-none bg-transparent px-0 rounded-none focus:ring-0 placeholder:text-slate-300"
            />
            <TextArea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Start typing..."
                className="flex-1 border-none shadow-none bg-transparent px-0 rounded-none focus:ring-0 resize-none text-base leading-relaxed placeholder:text-slate-300"
            />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-in slide-in-from-right-4 duration-300">
      <header className="flex justify-between items-center mb-6 px-1">
        <h2 className="text-2xl font-bold text-slate-800">Notes</h2>
        <Button size="sm" onClick={() => openEditor()}>
            <Plus size={18} className="mr-1" /> New
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-3 pb-24 overflow-y-auto">
        {notes.length === 0 && (
            <div className="text-center py-20 text-slate-400">
                <p>No notes yet.</p>
                <p className="text-sm">Create your first note to capture ideas.</p>
            </div>
        )}
        
        {notes.map(note => (
          <Card 
            key={note.id} 
            onClick={() => openEditor(note)}
            className="group cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-slate-800 truncate pr-4">{note.title}</h3>
                <button 
                    onClick={(e) => deleteNote(e, note.id)}
                    className="text-slate-300 hover:text-red-500 p-1 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            <p className="text-sm text-slate-500 line-clamp-3 h-12">
                {note.content || <span className="italic text-slate-300">No content</span>}
            </p>
            <div className="mt-3 text-xs text-slate-400 flex items-center justify-between">
                <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                <Edit2 size={12} className="opacity-0 group-hover:opacity-100" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};