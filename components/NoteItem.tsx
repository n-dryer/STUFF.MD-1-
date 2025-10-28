import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Note } from '../types';
import Tag from './Tag';
import DateDisplay from './DateDisplay';
import AutoLinker from './AutoLinker';

interface NoteItemProps {
  note: Note;
  activeTags: string[];
  onTagClick: (tag: string) => void;
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void;
  onDeleteTag: (noteId: string, tag: string) => void;
  onRegenerate: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  noIconMode: boolean;
}

const NOTE_TAG_LIMIT = 3;

const NoteItem: React.FC<NoteItemProps> = ({ note, activeTags, onTagClick, onUpdateNote, onDeleteTag, onRegenerate, onDeleteNote, noIconMode }) => {
    const [showingOriginal, setShowingOriginal] = useState(false);
    const [showOriginalContent, setShowOriginalContent] = useState(false);
    
    const [isTitleExpanded, setIsTitleExpanded] = useState(false);
    const [isTitleTruncated, setIsTitleTruncated] = useState(false);
    const titleRef = useRef<HTMLParagraphElement>(null);
    const [isTagsExpanded, setIsTagsExpanded] = useState(false);
    const [justDeletedTag, setJustDeletedTag] = useState<string | null>(null);

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState(note.title);
    const titleInputRef = useRef<HTMLInputElement>(null);
    
    const itemRef = useRef<HTMLDetailsElement>(null);
    const prevNoteJSON = useRef<string>(JSON.stringify(note));

    const isEdited = note.aiGenerated && (note.title !== note.aiGenerated.title);
    const displayTitle = showingOriginal ? note.aiGenerated?.title : note.title;

    useLayoutEffect(() => {
        if (!isEditingTitle) {
            const titleElement = titleRef.current;
            if (titleElement) {
                const isTruncated = titleElement.scrollHeight > titleElement.clientHeight;
                setIsTitleTruncated(isTruncated);
            }
        }
    }, [displayTitle, isTitleExpanded, isEditingTitle]);


    useEffect(() => {
        const currentNoteJSON = JSON.stringify(note);
        if (prevNoteJSON.current !== currentNoteJSON) {
            if (itemRef.current) {
                // When note is updated externally (e.g. regenerate), collapse tags and flash.
                setIsTagsExpanded(false);
                setIsEditingTitle(false);
                itemRef.current.classList.add('flash-update');
                const timer = setTimeout(() => {
                    itemRef.current?.classList.remove('flash-update');
                }, 700);
                return () => clearTimeout(timer);
            }
        }
        prevNoteJSON.current = currentNoteJSON;
    }, [note]);
    
    useEffect(() => {
        setEditedTitle(note.title);
    }, [note.title]);

    useEffect(() => {
        if (isEditingTitle) {
            titleInputRef.current?.focus();
            titleInputRef.current?.select();
        }
    }, [isEditingTitle]);
    
    const handleTitleSave = () => {
        if (editedTitle.trim() && editedTitle.trim() !== note.title) {
            onUpdateNote(note.id, { title: editedTitle.trim() });
        }
        setIsEditingTitle(false);
    };

    const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleTitleSave();
        } else if (e.key === 'Escape') {
            setEditedTitle(note.title);
            setIsEditingTitle(false);
        }
    };

    const handleDeleteTagWithFeedback = (noteId: string, tag: string) => {
        setJustDeletedTag(tag);
        onDeleteTag(noteId, tag);
        setTimeout(() => {
            setJustDeletedTag(null);
        }, 300);
    }

    const uniqueTags = Array.from(new Set(note.tags));
    const tagsToShow = isTagsExpanded ? uniqueTags : uniqueTags.slice(0, NOTE_TAG_LIMIT);
    const hiddenTagsCount = uniqueTags.length - NOTE_TAG_LIMIT;

    return (
        <details
            ref={itemRef}
            className="group relative py-3 border-b border-off-black/10 focus-within:outline-2 focus-within:outline-accent-black focus-within:outline-offset-2"
        >
            <summary 
                className="flex items-start justify-between cursor-pointer focus:outline-none list-none group-hover:border-b-4 group-hover:border-accent-black"
                aria-label={`Note title: ${note.title}. Click to expand details.`}
            >
                <div className="flex items-center min-w-0 pr-4 w-full">
                    {isEditingTitle ? (
                        <input
                            ref={titleInputRef}
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            onBlur={handleTitleSave}
                            onKeyDown={handleTitleKeyDown}
                            onClick={(e) => e.preventDefault()}
                            className="w-full text-lg font-mono font-normal text-off-black bg-off-white border-2 border-accent-black p-1 focus:outline-none"
                        />
                    ) : (
                        <>
                            <p
                                ref={titleRef}
                                className={`text-lg font-mono font-normal text-off-black ${isTitleExpanded ? '' : 'truncate'} cursor-text`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setEditedTitle(note.title);
                                    setIsEditingTitle(true);
                                }}
                            >
                                {displayTitle}
                            </p>
                            {isTitleTruncated && !isTitleExpanded && (
                                <button 
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsTitleExpanded(true); }} 
                                    className="ml-1 text-lg font-bold text-light-gray hover:text-off-black"
                                    aria-label="Expand title"
                                >
                                [...]
                                </button>
                            )}
                        </>
                    )}
                </div>
            </summary>

            <div className="pl-2 pt-4">
                <>
                     {isTitleExpanded && !isEditingTitle && (
                         <p className="mt-1 text-base text-off-black font-mono font-normal">
                            <AutoLinker text={displayTitle} />
                        </p>
                     )}
                    
                    <div className="mt-4 space-y-4">
                        <div>
                            <h3 className="text-xs uppercase text-light-gray font-mono">AI Summary</h3>
                            <p className="text-base text-off-black/90">
                                <AutoLinker text={note.summary} />
                            </p>
                        </div>
                         <div>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xs uppercase text-light-gray font-mono">Original Content</h3>
                                <button 
                                    onClick={() => setShowOriginalContent(s => !s)}
                                    className="uppercase text-xs text-light-gray hover:text-off-black"
                                    aria-expanded={showOriginalContent}
                                >
                                    {showOriginalContent ? '[HIDE]' : '[SHOW]'}
                                </button>
                            </div>
                            {showOriginalContent && (
                                <p className="mt-1 text-base text-off-black/90 whitespace-pre-wrap"><AutoLinker text={note.content} /></p>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 flex flex-col md:flex-row md:items-center gap-x-4 gap-y-2 text-sm">
                        <div className="flex flex-wrap gap-2 items-center">
                            {tagsToShow.map(tag => (
                                <Tag 
                                    key={tag} 
                                    tag={tag} 
                                    isActive={activeTags.includes(tag)}
                                    onClick={() => onTagClick(tag)} 
                                    onDelete={() => handleDeleteTagWithFeedback(note.id, tag)}
                                    isDeleting={tag === justDeletedTag}
                                />
                            ))}
                            {hiddenTagsCount > 0 && (
                                 <button onClick={() => setIsTagsExpanded(true)} className="font-mono text-xs text-light-gray hover:text-accent-black" aria-label={`Show ${hiddenTagsCount} more tags`}>
                                    [+{hiddenTagsCount} more]
                                </button>
                            )}
                            {isTagsExpanded && (
                                <button onClick={() => setIsTagsExpanded(false)} className="font-mono text-xs text-light-gray hover:text-accent-black" aria-label="Show fewer tags">
                                    [less]
                                </button>
                            )}
                        </div>
                        <div className="md:flex-grow"></div>
                        <div className="flex items-center gap-x-4 self-start md:self-center mt-2 md:mt-0">
                            <button onClick={() => onDeleteNote(note.id)} className="uppercase text-xs text-light-gray hover:text-destructive-red">
                                [DELETE]
                            </button>
                            <button onClick={() => onRegenerate(note)} className="uppercase text-xs text-light-gray hover:text-off-black">
                                [REGENERATE]
                            </button>
                            {isEdited && (
                                <button onClick={() => setShowingOriginal(s => !s)} className="uppercase text-xs text-light-gray hover:text-off-black">
                                    [{showingOriginal ? 'SHOW EDITED' : 'SHOW ORIGINAL'}]
                                </button>
                            )}
                            <DateDisplay date={note.date} />
                        </div>
                    </div>
                </>
            </div>
        </details>
    );
};

export default NoteItem;