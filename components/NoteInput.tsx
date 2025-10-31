import React from 'react';

interface NoteInputProps {
  inputRef: React.RefObject<HTMLTextAreaElement>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  isSaving: boolean;
}

const NoteInput: React.FC<NoteInputProps> = ({ inputRef, value, onChange, onSave, isSaving }) => {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSave();
    }
  };

  return (
    <textarea
      ref={inputRef}
      value={value}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      placeholder="Type or paste anything and press Enter..."
      className="w-full bg-transparent border-none focus:ring-0 text-sm placeholder:text-slate-500 resize-none"
      rows={1}
      disabled={isSaving}
    />
  );
};

export default NoteInput;