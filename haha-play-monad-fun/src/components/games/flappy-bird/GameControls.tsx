
import React from 'react';
import { Button } from "@/components/ui/button";
import { shareOnTwitter, downloadTemplate } from './utils';

interface GameControlsProps {
  gameOver: boolean;
  gameStarted: boolean;
  score: number;
  onStartGame: () => void;
  onBackToMenu: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  gameOver,
  gameStarted,
  score,
  onStartGame,
  onBackToMenu
}) => {
  if (gameOver) {
    return (
      <div className="flex gap-4 flex-wrap justify-center animate-fade-in">
        <Button 
          onClick={onStartGame} 
          className="bg-green-600 hover:bg-green-700 font-bold transition-all duration-300 hover:scale-105"
        >
          🔄 Play Again
        </Button>
        <Button 
          onClick={() => shareOnTwitter(score)} 
          className="bg-blue-500 hover:bg-blue-600 font-bold transition-all duration-300 hover:scale-105"
        >
          🐦 Share on Twitter
        </Button>
        <Button 
          onClick={() => downloadTemplate(score)} 
          variant="outline" 
          className="font-bold transition-all duration-300 hover:scale-105"
        >
          📥 Download Score
        </Button>
      </div>
    );
  }

  if (gameStarted) {
    return (
      <Button
        onClick={onBackToMenu}
        variant="outline"
        className="font-bold transition-all duration-300 hover:scale-105"
      >
        🏠 Back to Menu
      </Button>
    );
  }

  return null;
};

export default GameControls;
