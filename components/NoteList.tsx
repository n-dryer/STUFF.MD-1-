import React from 'react';
import { Note } from '../types';
import NoteItem from './NoteItem';

interface NoteListProps {
  notes: Note[];
  isLoading: boolean;
  activeTags: string[];
  onTagClick: (tag: string) => void;
  onClearTags: () => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteTag: (noteId: string, tag: string) => void;
  onRegenerate: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  noIconMode: boolean;
  view: 'grid' | 'list';
  areAllNotesExpanded: boolean;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  isLoading,
  activeTags,
  onTagClick,
  onClearTags,
  onUpdateNote,
  onDeleteTag,
  onRegenerate,
  onDeleteNote,
  noIconMode,
  view,
  areAllNotesExpanded
}) => {
  const filteredNotes = activeTags.length > 0
    ? notes.filter(note => activeTags.every(tag => note.tags.includes(tag)))
    : notes;

  if (isLoading) {
    return <div className="text-center text-slate-500 py-10">Loading notes...</div>;
  }

  if (notes.length === 0) {
    return <div className="text-center text-slate-500 py-10">No notes found. Start by typing above.</div>;
  }
  
  if (filteredNotes.length === 0 && activeTags.length > 0) {
     return (
        <div className="text-center text-slate-500 py-10">
            No notes match the selected tags: {activeTags.join(', ')}.
            <button
              onClick={onClearTags}
              className="ml-2 font-bold uppercase tracking-widest text-slate-900 dark:text-slate-50 hover:underline"
            >
              Clear Filter
            </button>
        </div>
     );
  }
  
  const containerClasses = view === 'grid'
    ? 'grid grid-cols-1 lg:grid-cols-2 gap-8'
    : 'flex flex-col';

  return (
    <div className={containerClasses}>
      {filteredNotes.map(note => (
        <NoteItem
          key={note.id}
          note={note}
          onTagClick={onTagClick}
          activeTags={activeTags}
          onUpdateNote={onUpdateNote}
          onDeleteTag={onDeleteTag}
          onRegenerate={onRegenerate}
          onDeleteNote={onDeleteNote}
          noIconMode={noIconMode}
          view={view}
          isExpanded={areAllNotesExpanded}
        />
      ))}
    </div>
  );
};

export default NoteList;