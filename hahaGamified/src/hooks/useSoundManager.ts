
import { useRef, useEffect, useState } from 'react';

interface SoundManager {
  playJump: () => void;
  playCoin: () => void;
  playGameOver: () => void;
  playSuccess: () => void;
  playClick: () => void;
  toggleSound: () => void;
  isSoundEnabled: boolean;
}

export const useSoundManager = (): SoundManager => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const jumpSoundRef = useRef<HTMLAudioElement | null>(null);
  const coinSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements with base64 encoded sounds
    jumpSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmwhBjqS1fPNfC4GI3XG8N2QQgwWXrPq66hXFApHn+PyvmwfBz6S1PPN');
    coinSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmwhBjqS1fPNfC4GI3XG8N2QQgwWXrPq66hXFApHn+PyvmwfBz6S1PPN');
    gameOverSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmwhBjqS1fPNfC4GI3XG8N2QQgwWXrPq66hXFApHn+PyvmwfBz6S1PPN');
    successSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmwhBjqS1fPNfC4GI3XG8N2QQgwWXrPq66hXFApHn+PyvmwfBz6S1PPN');
    clickSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmwhBjqS1fPNfC4GI3XG8N2QQgwWXrPq66hXFApHn+PyvmwfBz6S1PPN');

    // Set volume
    [jumpSoundRef, coinSoundRef, gameOverSoundRef, successSoundRef, clickSoundRef].forEach(ref => {
      if (ref.current) {
        ref.current.volume = 0.3;
      }
    });
  }, []);

  const playSound = (soundRef: React.RefObject<HTMLAudioElement>) => {
    if (isSoundEnabled && soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(() => {
        // Silently handle audio play errors
      });
    }
  };

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    localStorage.setItem('soundEnabled', JSON.stringify(newState));
  };

  return {
    playJump: () => playSound(jumpSoundRef),
    playCoin: () => playSound(coinSoundRef),
    playGameOver: () => playSound(gameOverSoundRef),
    playSuccess: () => playSound(successSoundRef),
    playClick: () => playSound(clickSoundRef),
    toggleSound,
    isSoundEnabled
  };
};
