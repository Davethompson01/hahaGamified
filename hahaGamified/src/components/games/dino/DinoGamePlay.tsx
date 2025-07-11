import React, { useEffect, useState, useLayoutEffect } from "react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { useDinoGame } from "./useDinoGame";
import { GAME_CONFIG } from "./constants";
import { useToast } from "../../ui/use-toast";
import { useTiltControls } from "../../../hooks/useTiltControls";
import { useIsMobile } from "../../../hooks/use-mobile";
import { useSoundManager } from "../../../hooks/useSoundManager";
import { ArrowLeft } from "lucide-react";

interface DinoGamePlayProps {
  onBackToMenu: () => void;
}

const DinoGamePlay: React.FC<DinoGamePlayProps> = ({ onBackToMenu }) => {
  const {
    canvasRef,
    gameState,
    jump,
    startGame,
    restartGame
  } = useDinoGame();

  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { playJump, playGameOver } = useSoundManager();
  
  useTiltControls(jump, gameState.gameStarted && !gameState.gameOver);

  useLayoutEffect(() => {
    if (canvasRef.current && !gameState.gameStarted && !gameState.gameOver) {
      console.log('DinoGamePlay: Auto-starting game');
      startGame();
    }
  }, [canvasRef.current, gameState.gameStarted, gameState.gameOver, startGame]);

  useEffect(() => {
    if (gameState.gameOver) {
      playGameOver();
    }
  }, [gameState.gameOver, playGameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && gameState.gameStarted && !gameState.gameOver) {
        e.preventDefault();
        jump();
        playJump();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameState.gameStarted, gameState.gameOver, jump, playJump]);

  const handleCanvasTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    if (gameState.gameStarted && !gameState.gameOver) {
      jump();
      playJump();
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameState.gameStarted && !gameState.gameOver) {
      jump();
      playJump();
    }
  };

  const handleRestartGame = () => {
    restartGame();
    setTimeout(() => {
      startGame();
    }, 100);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 overflow-hidden min-h-screen"> 
      
      {/* Game Status Bar - More compact on mobile */}
      <div className="w-full bg-white/90 backdrop-blur-sm shadow-lg border-b border-purple-200 p-1 md:p-3 flex justify-between items-center flex-shrink-0">
        <div className="flex gap-1 md:gap-4">
          <div className="text-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 md:px-3 py-1 rounded-lg">
            <p className="text-xs font-medium">Score</p>
            <p className="text-sm md:text-lg font-bold">{gameState.score}</p>
          </div>
          <div className="text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 md:px-3 py-1 rounded-lg">
            <p className="text-xs font-medium">Speed</p>
            <p className="text-xs md:text-sm font-semibold">{gameState.gameSpeed.toFixed(1)}x</p>
          </div>
        </div>
        <Button onClick={onBackToMenu} variant="outline" size="sm" className="border-purple-400 text-purple-600 hover:bg-purple-50 text-xs md:text-sm">
          <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 mr-1" />
          Menu
        </Button>
      </div>

      {/* Game Canvas - 95% height on mobile */}
      <div className="flex-1 flex items-center justify-center p-1 md:p-2 min-h-0">
        <div 
          className="w-full h-full flex items-center justify-center"
          style={{ 
            width: isMobile ? '95%' : '90%', 
            maxWidth: '95vw',
            height: isMobile ? '95%' : '85%'
          }}
        >
          <canvas
            ref={canvasRef}
            width={GAME_CONFIG.CANVAS_WIDTH}
            height={GAME_CONFIG.CANVAS_HEIGHT}
            onTouchStart={handleCanvasTouch}
            onClick={handleCanvasClick}
            className="border-4 border-purple-400 cursor-pointer bg-gradient-to-b from-blue-400 to-purple-600 rounded-xl shadow-2xl touch-none w-full h-full"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
      </div>

      {/* Game Over Screen */}
      {gameState.gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm z-50">
          <Card className="p-4 md:p-6 text-center max-w-sm w-full animate-scale-in bg-gradient-to-br from-white via-purple-50 to-pink-50 border-2 border-purple-300">
            <h3 className="text-xl md:text-2xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">💚 Hulk Stopped!</h3>
            <div className="mb-4 space-y-2">
              <p className="text-lg">Final Score: <span className="font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">{gameState.score}</span></p>
              <p className="text-sm text-gray-600">Max Speed: {gameState.gameSpeed.toFixed(1)}x</p>
            </div>
            <div className="flex gap-2 md:gap-3 justify-center">
              <Button 
                onClick={handleRestartGame} 
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 text-white text-sm md:text-base"
              >
                💪 Hulk Smash Again!
              </Button>
              <Button 
                onClick={onBackToMenu} 
                variant="outline"
                className="border-purple-400 text-purple-600 hover:bg-purple-50 transform hover:scale-105 transition-all duration-200 text-sm md:text-base"
              >
                📋 Menu
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Controls Hint - Only when game is active */}
      {gameState.gameStarted && !gameState.gameOver && (
        <div className="w-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm p-1 md:p-2 text-center text-white animate-fade-in border-t border-white/20 flex-shrink-0">
          <p className="md:hidden text-xs font-medium">💪 Tap screen or tilt device - Help Hulk jump!</p>
          <p className="hidden md:block text-sm font-medium">💪 Press spacebar or click - Help Hulk smash through obstacles!</p>
        </div>
      )}
    </div>
  );
};

export default DinoGamePlay;
