import React, { useState, useEffect, useRef } from 'react';

interface CategoryHeaderProps {
  path: string[];
  onUpdate: (newPath: string[]) => void;
  onDelete: () => void;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ path, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPath, setEditingPath] = useState(path.join(' / '));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);
  
  const handleSave = () => {
    const newPath = editingPath.split('/').map(p => p.trim()).filter(Boolean);
    if (newPath.length > 0) {
        onUpdate(newPath);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditingPath(path.join(' / '));
      setIsEditing(false);
    }
  };
  
  const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
      if (e.key === 'Enter') {
          setIsEditing(true);
      }
  }

  if (isEditing) {
    return (
       <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={editingPath}
          onChange={(e) => setEditingPath(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full text-xl font-black text-off-black bg-off-white border-2 border-accent-black p-1 focus:outline-none hover:border-5 hover:p-px focus:border-5 focus:p-px"
        />
       </div>
    )
  }

  return (
    <div className="group flex justify-between items-center">
      <h2 
        onClick={() => setIsEditing(true)} 
        onKeyDown={handleHeaderKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Edit category: ${path.join(' / ')}`}
        className="flex-grow text-xl font-bold hover:font-black text-off-black border-b border-off-black/20 pb-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-black focus-visible:ring-offset-2 transition-all duration-100"
      >
        {path.join(' / ')}
      </h2>
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="ml-2 uppercase text-xs text-light-gray hover:text-destructive-red opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
        aria-label={`Delete category and all its notes: ${path.join(' / ')}`}
        title="Delete category"
      >
        [DELETE]
      </button>
    </div>
  );
};

export default CategoryHeader;