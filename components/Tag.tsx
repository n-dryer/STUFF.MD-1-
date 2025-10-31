import React from 'react';

interface TagProps {
  tag: string;
  onClick: () => void;
  // isActive is not used in the new design but kept for potential future use
  isActive?: boolean;
}

const Tag: React.FC<TagProps> = ({ tag, onClick }) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md text-xs uppercase hover:bg-slate-300 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-50"
    >
      {tag.replace(/_/g, ' ')}
    </button>
  );
};

export default Tag;