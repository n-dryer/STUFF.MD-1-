import React from 'react';
import { Note } from '../types';
import NoteItem from './NoteItem';
import CategoryHeader from './CategoryHeader';

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
  onDeleteCategory: (notes: Note[]) => void;
  noIconMode: boolean;
}

// Regex to find URLs in text content, borrowed from AutoLinker.
const URL_REGEX = /((?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;
const containsURL = (text: string) => new RegExp(URL_REGEX).test(text);

const NoteList: React.FC<NoteListProps> = ({ notes, isLoading, activeTags, onTagClick, onClearTags, onUpdateNote, onDeleteTag, onRegenerate, onDeleteNote, onDeleteCategory, noIconMode }) => {
  const filteredNotes = activeTags.length > 0
    ? notes.filter(note => activeTags.every(tag => note.tags.includes(tag)))
    : notes;

  // Group notes first by whether they contain a link, then by their original category.
  const groupedNotes = filteredNotes.reduce((acc, note) => {
    const isLink = containsURL(note.content);
    const topLevelKey = isLink ? 'Links' : 'Non-Links';

    if (!acc[topLevelKey]) {
      acc[topLevelKey] = {};
    }

    const categoryKey = note.categoryPath.join(' / ');
    if (!acc[topLevelKey][categoryKey]) {
      acc[topLevelKey][categoryKey] = [];
    }
    acc[topLevelKey][categoryKey].push(note);
    return acc;
  }, {} as Record<string, Record<string, Note[]>>);

  // Ensure "Links" appears before "Non-Links" if both exist.
  const sortedTopLevelCategories = Object.keys(groupedNotes).sort();

  if (isLoading) {
    return <div className="p-6 text-light-gray text-sm">Loading notes...</div>;
  }

  if (notes.length === 0) {
    return <div className="p-6 text-light-gray text-sm">No notes found. Start by typing above.</div>;
  }
  
  if (filteredNotes.length === 0 && activeTags.length > 0) {
     return (
        <div className="p-6 text-light-gray text-sm">
            No notes match the selected tags: {activeTags.join(', ')}.
            <button onClick={onClearTags} className="ml-2 text-accent-black font-bold">[CLEAR ALL]</button>
        </div>
     );
  }
  
  const containerClasses = `grid gap-x-12 px-4 pt-8 ${
    sortedTopLevelCategories.length > 1 ? 'lg:grid-cols-2' : 'grid-cols-1'
  }`;

  return (
    <div className={containerClasses}>
      {sortedTopLevelCategories.map(topLevelKey => {
        const categories = groupedNotes[topLevelKey];
        const sortedCategories = Object.keys(categories).sort();
        
        if (sortedCategories.length === 0) return null;

        return (
            <section key={topLevelKey}>
              <h1 className="text-4xl font-black text-off-black border-b-4 border-accent-black pb-2 mb-8">
                {topLevelKey}
              </h1>
              <div className="flex flex-col gap-y-8">
                {sortedCategories.map(categoryKey => (
                  <div key={categoryKey} className="break-inside-avoid-column">
                    <CategoryHeader 
                      path={categories[categoryKey][0].categoryPath} 
                      onUpdate={(newPath) => {
                        categories[categoryKey].forEach(note => {
                          onUpdateNote(note.id, { categoryPath: newPath });
                        });
                      }}
                      onDelete={() => onDeleteCategory(categories[categoryKey])}
                    />
                    <div className="mt-2">
                      {categories[categoryKey].map(note => (
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
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
        );
      })}
    </div>
  );
};

export default NoteList;