
import { useState, useRef, useCallback } from 'react';
import { Bird, Pipe, Collectible } from './types';
import { GAME_CONSTANTS } from './constants';
import { useToast } from "@/hooks/use-toast";
import { GameState, createInitialGameState, resetGameState } from './gameState';
import { updateBirdPhysics, checkBirdCollisions, checkCollectibleCollection } from './gamePhysics';
import { updatePipes, updateCollectibles, checkPipeScoring } from './gameUpdates';

export const useGameLogic = () => {
  const { toast } = useToast();
  const [forceUpdate, setForceUpdate] = useState(0);
  const frameRef = useRef<number>(0);
  const coinSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Game state - using refs for immediate updates
  const gameStateRef = useRef<GameState>(createInitialGameState());
  
  const triggerUpdate = useCallback(() => {
    setForceUpdate(prev => prev + 1);
  }, []);

  const jump = useCallback(() => {
    const gameState = gameStateRef.current;
    if (!gameState.gameOver && gameState.gameStarted) {
      if (!gameState.gameActive) {
        gameState.gameActive = true;
      }
      gameState.bird.velocity = GAME_CONSTANTS.jumpStrength;
    }
  }, []);

  const updateGame = useCallback(() => {
    const gameState = gameStateRef.current;
    
    if (gameState.gameOver) return;
    
    gameState.frameCount++;
    
    // Update bird physics
    updateBirdPhysics(gameState.bird, gameState.gameActive, gameState.frameCount);
    
    if (gameState.gameActive) {
      // Update pipes
      gameState.pipes = updatePipes(gameState.pipes, gameState.frameCount);
      
      // Update collectibles
      gameState.collectibles = updateCollectibles(gameState.collectibles, gameState.frameCount);
      
      // Check scoring from pipes
      const pipeScore = checkPipeScoring(gameState.pipes);
      if (pipeScore > 0) {
        gameState.score += pipeScore;
      }
      
      // Check collectible collections
      gameState.collectibles.forEach(collectible => {
        if (!collectible.collected && checkCollectibleCollection(gameState.bird, collectible)) {
          collectible.collected = true;
          
          if (collectible.type === "coin") {
            if (coinSoundRef.current) {
              coinSoundRef.current.currentTime = 0;
              coinSoundRef.current.play().catch(() => {});
            }
            gameState.score += 2;
            toast({
              title: "Coin Collected! ✨",
              description: "+2 points",
            });
          } else {
            gameState.score = Math.max(0, gameState.score - 1);
            toast({
              title: "Scam Token! ⚠️",
              description: "Lost 1 point",
              variant: "destructive"
            });
          }
        }
      });
      
      // Check collisions
      if (checkBirdCollisions(gameState.bird, gameState.pipes)) {
        gameState.gameOver = true;
        gameState.gameActive = false;
        toast({
          title: "Game Over!",
          description: `Your score: ${gameState.score}`,
        });
      }
    }
    
    triggerUpdate();
  }, [toast, triggerUpdate]);

  const startGame = useCallback(() => {
    gameStateRef.current = resetGameState(gameStateRef.current);
    triggerUpdate();
  }, [triggerUpdate]);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const backToMenu = useCallback(() => {
    gameStateRef.current = createInitialGameState();
    triggerUpdate();
  }, [triggerUpdate]);

  const gameState = gameStateRef.current;

  return {
    gameStarted: gameState.gameStarted,
    gameActive: gameState.gameActive,
    score: gameState.score,
    gameOver: gameState.gameOver,
    bird: gameState.bird,
    pipes: gameState.pipes,
    collectibles: gameState.collectibles,
    frameCount: gameState.frameCount,
    forceUpdate,
    frameRef,
    coinSoundRef,
    jump,
    updateGame,
    startGame,
    restartGame,
    backToMenu
  };
};
