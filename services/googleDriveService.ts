// This is a mock service for Google Drive API interactions.
// In a real application, this would use the access token from Firebase auth
// to make fetch requests to the Google Drive API endpoints.

import { Note } from '../types';

const MOCK_NOTES: Note[] = [
    {
        id: '1',
        name: 'React-Hooks-Cheatsheet-20251027103000.txt',
        content: 'useEffect is for side effects. useState is for state. useMemo is for memoized values. useCallback is for memoized functions.',
        title: 'React Hooks Cheatsheet',
        summary: 'A quick reference for core React hooks like useEffect, useState, useMemo, and useCallback, explaining their primary use cases in component development.',
        aiGenerated: {
            title: 'React Hooks Cheatsheet',
            summary: 'A quick reference for core React hooks like useEffect, useState, useMemo, and useCallback, explaining their primary use cases in component development.',
            rationale: 'The content discusses core React hooks, placing it under web development.'
        },
        categoryPath: ['Programming', 'Web Development', 'React'],
        tags: ['react', 'hooks', 'cheatsheet', 'frontend', 'javascript'],
        date: '2025-10-27T10:30:00Z',
    },
    {
        id: '2',
        name: 'Brutalist-Design-Principles-20251026150000.txt',
        content: 'Raw materials, exposed functionality, and a lack of ornamentation are key principles of brutalist web design. It prioritizes content over decoration.',
        title: 'Principles of Brutalist Web Design',
        summary: 'Explores the key principles of brutalist web design, emphasizing raw materials, exposed functionality, and a deliberate lack of ornamentation to prioritize content.',
        aiGenerated: {
            title: 'Principles of Brutalist Web Design',
            summary: 'Explores the key principles of brutalist web design, emphasizing raw materials, exposed functionality, and a deliberate lack of ornamentation to prioritize content.',
            rationale: 'Keywords like "brutalist" and "web design" clearly define the category.'
        },
        categoryPath: ['Design', 'Web Design'],
        tags: ['brutalism', 'ui', 'ux'],
        date: '2025-10-26T15:00:00Z',
    },
    {
        id: '3',
        name: 'Meeting-notes-20251025090000.txt',
        content: 'Project STUFF.MD kickoff. Discussed MVP scope and brutalist design. Key takeaway: focus on core save/categorize flow. Assign Trello board setup to Alex.',
        title: 'STUFF.MD Project Kickoff Notes',
        summary: 'Notes from the STUFF.MD project kickoff meeting, covering the initial MVP scope, the adoption of a brutalist design direction, and action items.',
        aiGenerated: {
            title: 'STUFF.MD Project Kickoff Notes',
            summary: 'Notes from the STUFF.MD project kickoff meeting, covering the initial MVP scope, the adoption of a brutalist design direction, and action items.',
            rationale: 'The note is about a project kickoff meeting, so it falls under project management.'
        },
        categoryPath: ['Work', 'Project Management'],
        tags: ['meeting', 'planning', 'mvp'],
        date: '2025-10-25T09:00:00Z',
    }
];

// In-memory store for our mock notes to simulate saving and updating
let notesStore: Note[] = [...MOCK_NOTES];

export const driveService = {
  fetchNotes: async (accessToken: string): Promise<Note[]> => {
    console.log("Mock fetching notes with token:", accessToken.substring(0,10) + "...");
    return new Promise(resolve => {
        setTimeout(() => {
            resolve([...notesStore].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }, 1000);
    });
  },

  saveNote: async (accessToken: string, noteData: Omit<Note, 'id'>): Promise<Note> => {
    console.log("Mock saving note:", noteData.name);
    return new Promise(resolve => {
        setTimeout(() => {
            const newNote: Note = {
                ...noteData,
                id: new Date().getTime().toString(),
            };
            notesStore.unshift(newNote);
            resolve(newNote);
        }, 1500);
    });
  },

  updateNote: async (accessToken: string, noteId: string, updates: Partial<Note>): Promise<Note> => {
    console.log(`Mock updating note ${noteId} with`, updates);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const noteIndex = notesStore.findIndex(n => n.id === noteId);
            if (noteIndex === -1) {
                return reject(new Error("Note not found"));
            }
            notesStore[noteIndex] = { ...notesStore[noteIndex], ...updates };
            resolve(notesStore[noteIndex]);
        }, 500);
    });
  },

  deleteNote: async (accessToken: string, noteId: string): Promise<void> => {
    console.log(`Mock deleting note ${noteId}`);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = notesStore.length;
            notesStore = notesStore.filter(n => n.id !== noteId);
            if (notesStore.length === initialLength) {
                return reject(new Error("Note not found for deletion"));
            }
            resolve();
        }, 300);
    });
  },
};