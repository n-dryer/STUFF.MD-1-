import React, { useState, useEffect, useRef } from 'react';

interface InstructionsModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (instructions: string) => void;
  initialInstructions: string;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isVisible, onClose, onSave, initialInstructions }) => {
  const [instructions, setInstructions] = useState(initialInstructions);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInstructions(initialInstructions);
  }, [initialInstructions]);

  useEffect(() => {
    if (isVisible) {
      textareaRef.current?.focus();
    }
  }, [isVisible]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSave = () => {
    onSave(instructions);
  };
  
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
    }
  }

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-off-black/30 backdrop-blur-sm flex items-center justify-center z-30"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      <div 
        ref={modalRef}
        className="bg-off-white p-6 border-2 border-accent-black w-full max-w-lg m-4"
      >
        <h2 className="text-xl font-bold uppercase">Custom Instructions</h2>
        <p className="text-sm text-off-black/70 mt-1 mb-4">
            These instructions will be applied to every new note to guide the AI's categorization.
        </p>
        <textarea
          ref={textareaRef}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="e.g., 'Always categorize technical notes under a Programming parent category.'"
          className="w-full bg-off-white text-base font-sans text-off-black placeholder-light-gray resize-y focus:outline-none p-3 min-h-[150px] border-2 border-accent-black hover:border-5 hover:p-[9px] focus:border-5 focus:p-[9px]"
          rows={6}
        />
        <div className="flex gap-4 mt-4">
          <button 
            onClick={handleSave}
            className="uppercase px-4 py-2 text-sm border-2 border-accent-black bg-accent-black text-off-white hover:shadow-brutalist hover:-translate-x-1 hover:-translate-y-1 active:shadow-none active:translate-x-0 active:translate-y-0 transition-all duration-100"
          >
            Save Instructions
          </button>
          <button 
            onClick={onClose}
            className="uppercase text-sm text-light-gray hover:text-accent-black transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;