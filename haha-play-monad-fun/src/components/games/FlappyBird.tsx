
import React, { useEffect } from "react";
import GameMenu from "./flappy-bird/GameMenu";
import GameCanvas from "./flappy-bird/GameCanvas";
import GameControls from "./flappy-bird/GameControls";
import { useGameLogic } from "./flappy-bird/useGameLogic";

const FlappyBird = () => {
  const {
    gameStarted,
    gameActive,
    score,
    gameOver,
    bird,
    pipes,
    collectibles,
    frameCount,
    forceUpdate,
    frameRef,
    coinSoundRef,
    jump,
    updateGame,
    startGame,
    restartGame,
    backToMenu
  } = useGameLogic();

  // Initialize coin sound
  useEffect(() => {
    coinSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmwhBjqS1fPNfC4GI3XG8N2QQgwWXrPq66hXFApHn+PyvmwfBz6S1PPN');
  }, []);

  // Main game loop - runs continuously when game is started
  useEffect(() => {
    let animationId: number;
    
    const gameLoop = () => {
      if (gameStarted && !gameOver) {
        updateGame();
        animationId = requestAnimationFrame(gameLoop);
      }
    };
    
    if (gameStarted && !gameOver) {
      animationId = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [gameStarted, gameOver, updateGame]);

  const handleStartGame = () => {
    startGame();
  };

  const handleCanvasClick = () => {
    if (gameOver) {
      restartGame();
    } else if (gameStarted) {
      jump();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (gameOver) {
          restartGame();
        } else if (gameStarted) {
          jump();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameOver, jump, restartGame, gameStarted]);

  if (!gameStarted) {
    return <GameMenu onStartGame={handleStartGame} />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-b from-sky-300 to-sky-500 p-1 md:p-4 overflow-hidden">
      <div className="w-full h-full flex flex-col items-center justify-center space-y-1 md:space-y-4">
        <div className="w-full h-full flex items-center justify-center">
          <GameCanvas
            bird={bird}
            pipes={pipes}
            collectibles={collectibles}
            score={score}
            gameOver={gameOver}
            gameActive={gameActive}
            frameCount={frameCount}
            forceUpdate={forceUpdate}
            onCanvasClick={handleCanvasClick}
          />
        </div>
        
        <div className="w-full">
          <GameControls
            gameOver={gameOver}
            gameStarted={gameStarted}
            score={score}
            onStartGame={restartGame}
            onBackToMenu={backToMenu}
          />
        </div>
      </div>
    </div>
  );
};

export default FlappyBird;
