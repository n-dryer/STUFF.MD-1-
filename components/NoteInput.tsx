import React, { useEffect } from 'react';
import BrutalistSpinner from './BrutalistSpinner';

interface NoteInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  isSaving: boolean;
  saveCompleted: boolean;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

const NoteInput: React.FC<NoteInputProps> = ({ value, onChange, onSave, isSaving, saveCompleted, inputRef }) => {

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && !isSaving) {
          onSave();
        }
      }
       if (e.key === 'Escape') {
        e.preventDefault();
        if (inputRef.current) {
            inputRef.current.value = "";
            onChange({ target: inputRef.current } as any);
            inputRef.current.blur();
        }
      }
    };

    const textarea = inputRef.current;
    textarea?.addEventListener('keydown', handleKeyDown);

    return () => {
      textarea?.removeEventListener('keydown', handleKeyDown);
    };
  }, [value, onSave, isSaving, onChange, inputRef]);
  
  return (
    <div className="p-4 border-b-2 border-accent-black">
      <div className="relative group">
        <div className="absolute left-0 top-0 h-full w-[10px] opacity-0 group-hover:opacity-100 motion-safe:transition-opacity pointer-events-none">
          <div className="absolute top-0 left-0 h-full w-[2px] bg-accent-black"></div>
          <div className="absolute top-0 right-0 h-full w-[2px] bg-accent-black"></div>
        </div>

        <div className="relative">
          <textarea
            ref={inputRef}
            value={value}
            onChange={onChange}
            placeholder={isSaving ? '' : '>'}
            className="w-full bg-off-white text-2xl font-sans text-off-black placeholder-light-gray resize-none focus:outline-none p-4 min-h-[56px] border-2 border-accent-black pl-6 group-hover:border-5 group-hover:p-[13px] group-hover:pl-[21px] focus:border-5 focus:p-[13px] focus:pl-[21px]"
            rows={3}
            disabled={isSaving}
          />
          {isSaving && <BrutalistSpinner />}
          {!isSaving && saveCompleted && (
            <div 
              className="absolute top-4 right-4 text-sm font-sans text-light-gray pointer-events-none fade-in-out"
              aria-live="polite"
              role="status"
            >
              [SAVED]
            </div>
          )}
          <div className="absolute bottom-[18px] left-[24px] right-[18px] h-[2px] bg-accent-black scale-x-0 group-focus-within:scale-x-100 motion-safe:transition-transform motion-safe:duration-100 origin-left"/>
        </div>
      </div>
    </div>
  );
};

export default NoteInput;