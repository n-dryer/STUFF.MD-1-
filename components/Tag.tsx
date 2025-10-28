import React from 'react';
import BrutalistTooltip from './BrutalistTooltip';

interface TagProps {
  tag: string;
  isActive: boolean;
  onClick: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const MAX_TAG_LENGTH = 10;

const Tag: React.FC<TagProps> = ({ tag, isActive, onClick, onDelete, isDeleting }) => {
  const baseButtonClasses = `
    px-2 py-0.5 border-2
    text-xs font-mono uppercase
    transition-colors duration-100
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-black
  `;

  const activeClasses = "bg-accent-black text-off-white border-accent-black";
  const inactiveClasses = "bg-off-white text-off-black border-accent-black hover:bg-off-black hover:text-off-white";

  const deletingClasses = "bg-destructive-red/50 border-destructive-red";

  const finalClasses = isDeleting ? deletingClasses : (isActive ? activeClasses : inactiveClasses);

  const displayTag = tag.length > MAX_TAG_LENGTH ? tag.substring(0, MAX_TAG_LENGTH) : tag;

  const tagElement = (
    <div className="relative group flex-shrink-0 hover:-translate-y-0.5 hover:-translate-x-0.5 hover:shadow-brutalist-up transition-all duration-100">
      <button
        type="button"
        onClick={onClick}
        className={`${baseButtonClasses} ${finalClasses} ${onDelete ? 'pr-6' : ''}`}
        aria-label={`Filter by tag: ${tag}`}
        aria-pressed={isActive}
      >
        {displayTag}
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          className="group/del absolute inset-y-0 right-0 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-100 focus:opacity-100 focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-off-white hover:bg-destructive-red"
          aria-label={`Remove tag: ${tag}`}
        >
          <span className="text-sm font-bold leading-none transition-colors duration-100 group-hover/del:text-off-white">x</span>
        </button>
      )}
    </div>
  );

  if (tag.length > MAX_TAG_LENGTH) {
    return (
      <BrutalistTooltip text={tag}>
        {tagElement}
      </BrutalistTooltip>
    );
  }

  return tagElement;
};

export default Tag;