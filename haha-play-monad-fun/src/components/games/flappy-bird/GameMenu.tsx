
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GameMenuProps {
  onStartGame: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onStartGame }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gradient-to-b from-sky-300 to-sky-500">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-2 animate-bounce">🐦 Flappy Bird</h1>
          <p className="text-xl font-bold text-gray-700 animate-pulse">Tap or press spacebar to fly!</p>
          <p className="text-lg font-bold text-gray-600">
            Collect <span className="text-yellow-600 font-extrabold">gold coins (+2 points)</span> and avoid <span className="text-red-600 font-extrabold">red scam tokens (-1 point)</span>!
          </p>
          <Button 
            onClick={onStartGame}
            className="bg-blue-600 hover:bg-blue-700 text-xl py-6 px-12 font-bold animate-pulse rounded-full transition-all duration-300 hover:scale-110"
          >
            🚀 Start Flying
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default GameMenu;
