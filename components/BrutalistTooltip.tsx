import React from 'react';

interface BrutalistTooltipProps {
  children: React.ReactElement;
  text: string;
}

const BrutalistTooltip: React.FC<BrutalistTooltipProps> = ({ children, text }) => {
  if (!text) return children;

  return (
    <div className="relative group inline-block">
      {children}
      <div 
        role="tooltip"
        className="
          absolute bottom-full left-1/2 -translate-x-1/2 mb-2
          w-max max-w-xs
          bg-off-white text-off-black text-sm font-mono
          border-2 border-accent-black
          px-3 py-2
          opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
          transition-opacity duration-100
          pointer-events-none
          z-10
        "
      >
        {text}
      </div>
    </div>
  );
};

export default BrutalistTooltip;
