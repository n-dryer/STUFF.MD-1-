import React from 'react';
import { Note } from '../types';

interface SidebarProps {
  notes: Note[];
  activeTags: string[];
  onTagClick: (tag: string) => void;
  onClearTags: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ notes, activeTags, onTagClick, onClearTags }) => {
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    notes.forEach(note => {
      note.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [notes]);

  const getCategoryClass = (category?: string) => {
    const baseClass = "text-sm uppercase tracking-widest p-2 -ml-2";
    const isActive = category ? activeTags.includes(category) : activeTags.length === 0;

    if (isActive) {
      return `${baseClass} font-bold text-slate-900 dark:text-slate-50 bg-slate-200 dark:bg-slate-800`;
    }
    return `${baseClass} text-slate-500 hover:text-slate-900 dark:hover:text-slate-50`;
  };

  return (
    <aside className="w-64 border-r-2 border-slate-900 dark:border-slate-50 p-6 hidden md:flex flex-col">
      <h1 className="text-2xl font-bold tracking-tighter text-slate-900 dark:text-white mb-10">STUFF.md</h1>
      <nav className="flex flex-col space-y-4">
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); onClearTags(); }}
          className={getCategoryClass()}
        >
          All
        </a>
        {allTags.map(tag => (
          <a
            href="#"
            key={tag}
            onClick={(e) => { e.preventDefault(); onTagClick(tag); }}
            className={getCategoryClass(tag)}
          >
            {tag.replace(/_/g, ' ')}
          </a>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;