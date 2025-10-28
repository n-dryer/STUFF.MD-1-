import { Note } from '../types';

const formatNoteWithYAML = (note: Note): string => {
  const frontMatter = `---
tags: [${note.tags.join(', ')}]
date: ${note.date}
---`;
  return `${frontMatter}\n\n${note.content}`;
};

const triggerDownload = (filename: string, content: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportAsTxt = (notes: Note[]) => {
  if (notes.length === 0) return;
  const content = notes.map(formatNoteWithYAML).join('\n\n====================\n\n');
  triggerDownload('STUFF-MD-export.txt', content, 'text/plain;charset=utf-8');
};

export const exportAsJson = (notes: Note[]) => {
  if (notes.length === 0) return;
  const content = JSON.stringify(notes, null, 2);
  triggerDownload('STUFF-MD-export.json', content, 'application/json;charset=utf-8');
};
