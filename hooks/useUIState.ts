import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Feedback = { message: string; type: 'info' | 'success' | 'error' };

export function useUIState() {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  
  const [customInstructions, setCustomInstructions] = useLocalStorage<string>('stuffmd.customInstructions', '');
  const [noIconMode, setNoIconMode] = useLocalStorage<boolean>('noIconMode', false);
  const [isTipDismissed, setIsTipDismissed] = useLocalStorage<boolean>('stuffmd.tip.dismissed', false);
  
  const [showInstructions, setShowInstructions] = useState(false);

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
  };
}
