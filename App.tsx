import React, { useState, useRef } from 'react';
import { Note } from './types';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAuth } from './hooks/useAuth';
import { useNotes } from './hooks/useNotes';
import { useUIState } from './hooks/useUIState';

import NoteInput from './components/NoteInput';
import NoteList from './components/NoteList';
import Button from './components/Button';
import Feedback from './components/Feedback';
import InstructionsModal from './components/InstructionsModal';
import ExportButtons from './components/ExportButtons';

const App: React.FC = () => {
  const { user, accessToken, isLoading: isAuthLoading, login, logout } = useAuth();
  const { 
    notes, 
    isLoading: isNotesLoading, 
    saveNote, 
    updateNote, 
    regenerateNote, 
    deleteTagFromNote,
    deleteNote,
    deleteNotesByIds
  } = useNotes(accessToken);
  const {
    feedback,
    displayFeedback,
    activeTags,
    handleTagClick,
    handleClearTags,
    customInstructions,
    saveInstructions,
    noIconMode,
    setNoIconMode,
    isTipDismissed,
    dismissTip,
    showInstructions,
    setShowInstructions,
  } = useUIState();
  
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveCompleted, setSaveCompleted] = useState(false);
  const noteInputRef = useRef<HTMLTextAreaElement>(null);
  const saveCompletedTimer = useRef<number | null>(null);

  const handleSaveNote = async () => {
    if (!newNoteContent.trim() || !accessToken) return;
    
    if (saveCompletedTimer.current) {
        clearTimeout(saveCompletedTimer.current);
    }
    setSaveCompleted(false);

    setIsSaving(true);
    displayFeedback('Working...', 'info', 0);
    
    try {
        await saveNote(newNoteContent, customInstructions);
        setNewNoteContent('');
        
        setSaveCompleted(true);
        saveCompletedTimer.current = window.setTimeout(() => {
            setSaveCompleted(false);
            saveCompletedTimer.current = null;
        }, 2000);
        
        displayFeedback('', 'info', 1); // Clear "Working..." message
    } catch (error) {
        console.error(error);
        displayFeedback(error instanceof Error ? error.message : 'Error saving note.', 'error');
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleUpdateNote = async (noteId: string, updates: Partial<Note>) => {
    displayFeedback('Working...', 'info', 0);
    try {
        await updateNote(noteId, updates);
        displayFeedback('Note updated.', 'success', 2000);
    } catch(e) {
        displayFeedback('Error updating note.', 'error');
    }
  };

  const handleRegenerate = async (note: Note) => {
    displayFeedback(`Regenerating for "${note.title}"...`, 'info', 0);
    try {
      await regenerateNote(note, customInstructions);
      displayFeedback('Regeneration successful.', 'success');
    } catch (error) {
      displayFeedback('Error regenerating content.', 'error');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }
    displayFeedback('Deleting note...', 'info', 0);
    try {
      await deleteNote(noteId);
      displayFeedback('Note deleted successfully.', 'success');
    } catch (error) {
      displayFeedback('Error deleting note.', 'error');
    }
  };

  const handleDeleteCategory = async (notesInCategory: Note[]) => {
    if (!window.confirm(`Are you sure you want to delete the entire category and its ${notesInCategory.length} notes? This action cannot be undone.`)) {
      return;
    }
    displayFeedback('Deleting category...', 'info', 0);
    try {
      await deleteNotesByIds(notesInCategory.map(note => note.id));
      displayFeedback('Category deleted successfully.', 'success');
    } catch (error) {
      displayFeedback('Error deleting category.', 'error');
    }
  };

  useKeyboardShortcuts([
    { key: '/', callback: () => noteInputRef.current?.focus() },
    { key: 'n', ctrlKey: true, metaKey: true, callback: () => noteInputRef.current?.focus() },
    { key: 'i', ctrlKey: true, metaKey: true, callback: () => setShowInstructions(s => !s) },
    { key: 'Escape', callback: () => {
        if (showInstructions) setShowInstructions(false);
        else noteInputRef.current?.blur();
    }, allowInInput: true },
  ]);

  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-7xl font-black font-mono text-accent-black">STUFF.MD</h1>
        <div className="my-8 h-1 w-24 bg-accent-black" aria-hidden="true"></div>
        <Button onClick={login} variant="fill">
          Login with Google
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 border-b border-off-black/20">
        <h1 className="text-7xl font-black font-mono text-accent-black cursor-default">STUFF.MD</h1>
        <Button onClick={logout}>Logout</Button>
      </header>
       {!isTipDismissed && (
        <div className="p-2 px-4 bg-off-black text-off-white flex justify-between items-center">
          <p className="text-sm">Tip: Press Enter to save, Shift+Enter for new line. Press '/' to focus.</p>
          {/* Fix: Pass a function to onClick that calls dismissTip with `true`. The `dismissTip` function is a state setter and cannot directly handle the MouseEvent from onClick. */}
          <button onClick={() => dismissTip(true)} className="ml-4 text-light-gray hover:text-off-white text-xs">[DISMISS]</button>
        </div>
      )}
      <main className="flex flex-col flex-grow">
        <NoteInput 
          inputRef={noteInputRef}
          value={newNoteContent} 
          onChange={(e) => setNewNoteContent(e.target.value)}
          onSave={handleSaveNote}
          isSaving={isSaving}
          saveCompleted={saveCompleted}
        />
        {feedback && <Feedback message={feedback.message} type={feedback.type} />}
        <div className="flex-grow pb-24">
          <NoteList 
            notes={notes} 
            isLoading={isNotesLoading}
            activeTags={activeTags}
            onTagClick={handleTagClick}
            onClearTags={handleClearTags}
            onUpdateNote={handleUpdateNote}
            onDeleteTag={deleteTagFromNote}
            onRegenerate={handleRegenerate}
            onDeleteNote={handleDeleteNote}
            onDeleteCategory={handleDeleteCategory}
            noIconMode={noIconMode}
          />
        </div>
      </main>
      <InstructionsModal 
        isVisible={showInstructions}
        onClose={() => setShowInstructions(false)}
        onSave={saveInstructions}
        initialInstructions={customInstructions}
      />
      <footer className="fixed bottom-0 left-0 right-0 bg-off-white p-4 border-t border-off-black/10 flex justify-between items-center z-20">
        <div>
          <button 
            onClick={() => setShowInstructions(s => !s)} 
            className={`font-mono text-sm uppercase ${customInstructions ? 'text-accent-black' : 'text-light-gray'} hover:text-accent-black transition-colors`}
          >
            [INSTRUCTIONS]
          </button>
          <button onClick={() => setNoIconMode(prev => !prev)} className="ml-4 uppercase text-sm text-light-gray hover:text-accent-black transition-colors font-mono">{noIconMode ? '[ICONS: OFF]' : '[ICONS: ON]'}</button>
          {isTipDismissed && <button onClick={() => dismissTip(false)} className="ml-4 uppercase text-sm text-light-gray hover:text-accent-black transition-colors font-mono">[SHOW TIP]</button>}
        </div>
        <ExportButtons notes={notes} />
      </footer>
    </div>
  );
};

export default App;