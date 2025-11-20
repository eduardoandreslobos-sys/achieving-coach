'use client';

import React, { useState } from 'react';
import { Send, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
}

interface ReflectiveNotesProps {
  notes?: Note[];
  onAddNote?: (content: string) => void;
  placeholder?: string;
}

export default function ReflectiveNotes({ 
  notes = [],
  onAddNote,
  placeholder = "What's on your mind?"
}: ReflectiveNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim() && onAddNote) {
      onAddNote(newNote.trim());
      setNewNote('');
      setIsFocused(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            if (!newNote.trim()) setIsFocused(false);
          }}
          placeholder={placeholder}
          rows={isFocused ? 4 : 2}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all"
        />
        {isFocused && (
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => {
                setNewNote('');
                setIsFocused(false);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Add Note
            </button>
          </div>
        )}
      </form>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No reflective notes yet</p>
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id}
              className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg"
            >
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {note.content}
              </p>
              {mounted && (
                <p className="text-xs text-gray-500 mt-2">
                  {formatDistanceToNow(note.timestamp, { addSuffix: true })}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
