
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type GameState = 'idle' | 'playing' | 'game-over';

interface GameContextType {
  gameState: GameState;
  score: number;
  highScore: number;
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  incrementScore: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // Load high score from localStorage on mount
  useEffect(() => {
    const savedHighScore = localStorage.getItem('flappyHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // Save high score to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('flappyHighScore', highScore.toString());
  }, [highScore]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
  };

  const endGame = () => {
    setGameState('game-over');
    if (score > highScore) {
      setHighScore(score);
    }
  };

  const resetGame = () => {
    setGameState('idle');
    setScore(0);
  };

  const incrementScore = () => {
    setScore((prevScore) => prevScore + 1);
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        score,
        highScore,
        startGame,
        endGame,
        resetGame,
        incrementScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
