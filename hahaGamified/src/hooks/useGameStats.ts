
import { useState, useEffect } from 'react';

interface GameStats {
  totalTokens: number;
  dailyStreak: number;
  gamesPlayed: Record<string, number>;
  highestScores: Record<string, number>;
  lastPlayDate: string;
  totalGamesPlayed: number;
}

const INITIAL_STATS: GameStats = {
  totalTokens: 0,
  dailyStreak: 0,
  gamesPlayed: {},
  highestScores: {},
  lastPlayDate: '',
  totalGamesPlayed: 0
};

export const useGameStats = () => {
  const [stats, setStats] = useState<GameStats>(() => {
    // Load stats based on wallet address
    const walletAddress = localStorage.getItem('userWalletAddress');
    if (walletAddress) {
      const stored = localStorage.getItem(`gameStats_${walletAddress}`);
      return stored ? JSON.parse(stored) : INITIAL_STATS;
    }
    return INITIAL_STATS;
  });

  const saveStats = (newStats: GameStats) => {
    const walletAddress = localStorage.getItem('userWalletAddress');
    if (walletAddress) {
      localStorage.setItem(`gameStats_${walletAddress}`, JSON.stringify(newStats));
    }
  };

  const updateStats = (gameType: string, score: number, tokensEarned: number) => {
    const today = new Date().toDateString();
    
    setStats(prevStats => {
      const newStats = { ...prevStats };
      
      // Update daily streak
      if (newStats.lastPlayDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (newStats.lastPlayDate === yesterday) {
          newStats.dailyStreak += 1;
        } else if (newStats.lastPlayDate !== '') {
          newStats.dailyStreak = 1;
        } else {
          newStats.dailyStreak = 1;
        }
        newStats.lastPlayDate = today;
      }
      
      // Update tokens
      newStats.totalTokens += tokensEarned;
      
      // Update games played count
      newStats.gamesPlayed[gameType] = (newStats.gamesPlayed[gameType] || 0) + 1;
      newStats.totalGamesPlayed += 1;
      
      // Update highest score - this is crucial for quest tracking
      const currentHighest = newStats.highestScores[gameType] || 0;
      if (score > currentHighest) {
        newStats.highestScores[gameType] = score;
        console.log(`New high score for ${gameType}: ${score}`);
      }
      
      // Save to localStorage
      saveStats(newStats);
      
      // Trigger quest update event
      window.dispatchEvent(new CustomEvent('gameStatsUpdated', { 
        detail: { gameType, score, newStats } 
      }));
      
      return newStats;
    });
  };

  const resetDailyStreak = () => {
    setStats(prevStats => {
      const newStats = { ...prevStats, dailyStreak: 0 };
      saveStats(newStats);
      return newStats;
    });
  };

  const getTodaysTokens = () => {
    const today = new Date().toDateString();
    const walletAddress = localStorage.getItem('userWalletAddress');
    if (walletAddress) {
      const stored = localStorage.getItem(`tokensEarned_${walletAddress}_${today}`);
      return parseInt(stored || '0');
    }
    return 0;
  };

  // Listen for wallet address changes and reload stats
  useEffect(() => {
    const handleWalletChange = () => {
      const walletAddress = localStorage.getItem('userWalletAddress');
      if (walletAddress) {
        const stored = localStorage.getItem(`gameStats_${walletAddress}`);
        setStats(stored ? JSON.parse(stored) : INITIAL_STATS);
      } else {
        setStats(INITIAL_STATS);
      }
    };

    window.addEventListener('walletChanged', handleWalletChange);
    return () => window.removeEventListener('walletChanged', handleWalletChange);
  }, []);

  return {
    stats,
    updateStats,
    resetDailyStreak,
    getTodaysTokens
  };
};
