import React, { useState, useEffect } from 'react';
import { Note } from '../types';
import AutoLinker from './AutoLinker';

interface NoteItemProps {
  note: Note;
  view: 'grid' | 'list';
  isExpanded: boolean; // This is the global "expand all" state
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteNote: (noteId:string) => void;
  onTagClick: (tag: string) => void;
}

const NoteTag: React.FC<{tag: string, onClick: () => void}> = ({ tag, onClick }) => (
  <button
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md text-xs uppercase hover:bg-slate-300 dark:hover:bg-slate-700"
  >
    {tag.replace(/_/g, ' ')}
  </button>
);

const NoteItemList: React.FC<NoteItemProps & { isExpandedState: boolean, toggleExpand: () => void }> = ({ note, isExpandedState, toggleExpand, onTagClick }) => {
  return (
    <div className="border-b-2 border-slate-900 dark:border-slate-50">
      <div className="flex items-center py-4 cursor-pointer" onClick={toggleExpand}>
        <button className="mr-3">
          <span className="material-symbols-outlined text-xl">
            {isExpandedState ? 'remove' : 'add'}
          </span>
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm uppercase">{note.title}</h3>
            <span className="text-xs uppercase text-slate-500 whitespace-nowrap ml-4">
              {new Date(note.date).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs uppercase text-slate-500 mt-2">
            {note.tags.map(tag => (
              <span key={tag} className="bg-slate-200 dark:bg-slate-800 px-2 py-1">{tag.replace(/_/g, ' ')}</span>
            ))}
          </div>
        </div>
      </div>
      {isExpandedState && (
        <div className="pl-8 pb-4">
          <div className="text-sm text-slate-600 dark:text-slate-400 prose dark:prose-invert">
            <AutoLinker text={note.content} />
          </div>
        </div>
      )}
    </div>
  );
};

const NoteItemGrid: React.FC<NoteItemProps & { isExpandedState: boolean, toggleExpand: () => void }> = ({ note, isExpandedState, toggleExpand, onTagClick }) => {
  return (
    <div className="border border-slate-900 dark:border-slate-50 shadow-brutalist dark:shadow-brutalist-dark flex flex-col rounded-md">
      <div className="flex items-center justify-between p-4 border-b border-slate-900 dark:border-slate-50">
        <h3 className="font-bold text-sm uppercase flex-1">{note.title}</h3>
        <button
          onClick={toggleExpand}
          className="flex items-center justify-center w-8 h-8 border border-slate-900 dark:border-slate-50 bg-white dark:bg-black rounded-md"
        >
          <span className="material-symbols-outlined text-xl">
            {isExpandedState ? 'expand_less' : 'expand_more'}
          </span>
        </button>
      </div>
      {isExpandedState && (
        <div className="p-4 bg-white dark:bg-black flex-grow rounded-b-md">
          <div className="text-sm text-slate-600 dark:text-slate-400 prose dark:prose-invert">
            <AutoLinker text={note.content} />
          </div>
          <div className="mt-4">
            <span className="text-xs uppercase text-slate-500">{new Date(note.date).toLocaleDateString()}</span>
            <div className="flex items-center space-x-2 text-xs uppercase text-slate-500 mt-2">
              {note.tags.map(tag => (
                <NoteTag key={tag} tag={tag} onClick={() => onTagClick(tag)} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NoteItem: React.FC<NoteItemProps> = (props) => {
  const { isExpanded: isExpandedGlobally, note } = props;
  const [isExpandedState, setIsExpandedState] = useState(isExpandedGlobally);

  useEffect(() => {
    setIsExpandedState(isExpandedGlobally);
  }, [isExpandedGlobally]);

  // Allow individual toggling
  const toggleExpand = () => setIsExpandedState(prev => !prev);

  const componentProps = { ...props, isExpandedState, toggleExpand };

  if (props.view === 'grid') {
    return <NoteItemGrid {...componentProps} />;
  }

  return <NoteItemList {...componentProps} />;
};

export default NoteItem;