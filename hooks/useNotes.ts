import { useState, useCallback, useEffect } from 'react';
import { Note } from '../types';
import { driveService } from '../services/googleDriveService';
import { getAICategorization } from '../services/aiService';

export function useNotes(accessToken: string | null) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    if (!accessToken) return;
    setIsLoading(true);
    const fetchedNotes = await driveService.fetchNotes(accessToken);
    setNotes(fetchedNotes);
    setIsLoading(false);
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchNotes();
    } else {
      setNotes([]);
      setIsLoading(false);
    }
  }, [accessToken, fetchNotes]);

  const saveNote = async (content: string, customInstructions: string) => {
    if (!content.trim() || !accessToken) {
      throw new Error("Content and access token are required.");
    }
    
    const aiResult = await getAICategorization(content, customInstructions);
    
    const noteData: Omit<Note, 'id'> = {
      name: `${content.slice(0, 20).replace(/\s/g, '-')}-${new Date().toISOString().replace(/[:.]/g, '')}.txt`,
      content: content,
      title: aiResult?.title || content.slice(0, 100),
      summary: aiResult?.summary || 'No summary generated.',
      date: new Date().toISOString(),
      categoryPath: aiResult?.categories || ['Uncategorized'],
      tags: aiResult?.tags ? Array.from(new Set(aiResult.tags)) : [],
      aiGenerated: aiResult ? {
          title: aiResult.title,
          summary: aiResult.summary,
          rationale: aiResult.rationale,
      } : null,
    };
    
    await driveService.saveNote(accessToken, noteData);
    await fetchNotes(); // Refresh list
    return noteData;
  };
  
  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    if (!accessToken) {
        throw new Error("Access token is required.");
    }
    await driveService.updateNote(accessToken, noteId, updates);
    await fetchNotes();
  };

  const regenerateNote = async (note: Note, customInstructions: string) => {
    if (!accessToken) {
        throw new Error("Access token is required.");
    }
    const aiResult = await getAICategorization(note.content, customInstructions);
    if (aiResult) {
      const updates: Partial<Note> = {
        title: aiResult.title,
        summary: aiResult.summary,
        categoryPath: aiResult.categories,
        tags: Array.from(new Set(aiResult.tags)),
        aiGenerated: {
          title: aiResult.title,
          summary: aiResult.summary,
          rationale: aiResult.rationale,
        }
      };
      await updateNote(note.id, updates);
    } else {
      throw new Error("AI service failed to return a result.");
    }
  };
  
  const deleteTagFromNote = async (noteId: string, tagToDelete: string) => {
    if (!accessToken) return;
    const noteToUpdate = notes.find(note => note.id === noteId);
    if (!noteToUpdate) return;
    
    const updatedTags = noteToUpdate.tags.filter(tag => tag !== tagToDelete);
    await updateNote(noteId, { tags: updatedTags });
  };

  const deleteNote = async (noteId: string) => {
    if (!accessToken) {
      throw new Error("Access token is required.");
    }
    await driveService.deleteNote(accessToken, noteId);
    await fetchNotes(); // Refresh list
  };

  const deleteNotesByIds = async (noteIds: string[]) => {
    if (!accessToken) {
      throw new Error("Access token is required.");
    }
    // For a mock service, we can send requests in parallel.
    // A real API might prefer a single batch request.
    await Promise.all(
      noteIds.map(id => driveService.deleteNote(accessToken, id))
    );
    await fetchNotes();
  };

  return { 
    notes, 
    isLoading, 
    fetchNotes, 
    saveNote,
    updateNote,
    regenerateNote,
    deleteTagFromNote,
    deleteNote,
    deleteNotesByIds,
  };
}