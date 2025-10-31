import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Feedback = { message: string; type: 'info' | 'success' | 'error' };
type Theme = 'light' | 'dark';
type View = 'grid' | 'list';

export function useUIState() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  
  const [customInstructions, setCustomInstructions] = useLocalStorage<string>('stuffmd.customInstructions', '');
  const [noIconMode, setNoIconMode] = useLocalStorage<boolean>('noIconMode', false);
  const [isTipDismissed, setIsTipDismissed] = useLocalStorage<boolean>('stuffmd.tip.dismissed', false);
  const [theme, setTheme] = useLocalStorage<Theme>('stuffmd.theme', 'light');
  const [view, setView] = useLocalStorage<View>('stuffmd.view', 'list');
  const [areAllNotesExpanded, setAreAllNotesExpanded] = useState(false);
  
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const displayFeedback = (message: string, type: 'info' | 'success' | 'error', duration: number = 3000) => {
    setFeedback({ message, type });
    if (duration > 0) {
      setTimeout(() => setFeedback(null), duration);
    }
  };

  const handleTagClick = (tag: string) => {
    setActiveTags(prev => {
        const newTags = new Set(prev);
        if (newTags.has(tag)) {
            newTags.delete(tag);
        } else {
            newTags.add(tag);
        }
        return Array.from(newTags);
    });
  };

  const handleClearTags = () => {
    setActiveTags([]);
  }

  const saveInstructions = (instructions: string) => {
    setCustomInstructions(instructions);
    setShowInstructions(false);
    displayFeedback('Custom instructions saved.', 'success');
  }

  const toggleView = () => {
    setView(prevView => prevView === 'grid' ? 'list' : 'grid');
  };

  const expandAll = () => setAreAllNotesExpanded(true);
  const collapseAll = () => setAreAllNotesExpanded(false);

  return {
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
    dismissTip: setIsTipDismissed,
    showInstructions,
    setShowInstructions,
    theme,
    toggleTheme,
    view,
    toggleView,
    areAllNotesExpanded,
    expandAll,
    collapseAll,
  };
}