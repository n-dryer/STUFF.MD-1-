import React from 'react';
import BrutalistTooltip from './BrutalistTooltip';

// A more robust URL regex that handles various TLDs and paths.
const URL_REGEX = /((?:https?:\/\/)?(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&//=]*))/g;

interface AutoLinkerProps {
  text: string | null | undefined;
}

const AutoLinker: React.FC<AutoLinkerProps> = ({ text }) => {
  if (!text) return null;

  const parts = text.split(URL_REGEX);

  return (
    <>
      {parts.map((part, i) => {
        if (part && part.match(URL_REGEX)) {
          let href = part;
          if (!href.startsWith('http')) {
              href = `https://${href}`;
          }
          return (
            <BrutalistTooltip key={i} text={href}>
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-bold text-off-black/80 hover:text-off-black transition-colors no-underline" 
                onClick={(e) => e.stopPropagation()} // Prevents collapsing the note when clicking a link
              >
                {part}
              </a>
            </BrutalistTooltip>
          );
        }
        return part;
      })}
    </>
  );
};

export default AutoLinker;