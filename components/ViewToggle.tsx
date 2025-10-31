import React from 'react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onToggle: () => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ view, onToggle }) => {
  const baseButtonClass = "p-1.5";
  const activeButtonClass = "bg-slate-200 dark:bg-slate-800";
  const inactiveButtonClass = "bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-slate-50";

  return (
    <div className="flex items-center border-2 border-slate-900 dark:border-slate-50">
      <button
        className={`${baseButtonClass} ${view === 'grid' ? activeButtonClass : inactiveButtonClass}`}
        onClick={onToggle}
        disabled={view === 'grid'}
        aria-label="Grid view"
      >
        <span className="material-symbols-outlined text-base">grid_view</span>
      </button>
      <button
        className={`${baseButtonClass} ${view === 'list' ? activeButtonClass : inactiveButtonClass}`}
        onClick={onToggle}
        disabled={view === 'list'}
        aria-label="List view"
      >
        <span className="material-symbols-outlined text-base">view_list</span>
      </button>
    </div>
  );
};

export default ViewToggle;