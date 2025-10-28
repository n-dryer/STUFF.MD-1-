import React from 'react';
import { Note } from '../types';
import { exportAsTxt, exportAsJson } from '../services/exportService';

interface ExportButtonsProps {
  notes: Note[];
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ notes }) => {
  const buttonClasses = "font-mono text-sm uppercase text-light-gray hover:text-accent-black transition-colors";

  return (
    <div className="flex items-center gap-x-4">
      <button
        onClick={() => exportAsTxt(notes)}
        className={buttonClasses}
      >
        [EXPORT TXT]
      </button>
      <button
        onClick={() => exportAsJson(notes)}
        className={buttonClasses}
      >
        [EXPORT JSON]
      </button>
    </div>
  );
};

export default ExportButtons;