import { useRef, useState, useEffect, useCallback } from "react";
import { createInitialDino, updateDino, jump as jumpDino, generateObstacle, generateCoin, checkCollision } from "./gameLogic";
import { drawGame } from "./renderer";
import { Dino, Obstacle, Coin, GameState } from "./types";
import { GAME_CONFIG } from "./constants";

export const useDinoGame = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const gameLoopRef = useRef<boolean>(false);

  // Use refs to store current game state for the animation loop
  const dinoRef = useRef<Dino>(createInitialDino());
  const obstaclesRef = useRef<Obstacle[]>([]);
  const coinsRef = useRef<Coin[]>([]);
  const gameStateRef = useRef<GameState>({
    gameStarted: false,
    gameOver: false,
    score: 0,
    gameSpeed: GAME_CONFIG.SPEEDS.INITIAL,
    frameCount: 0
  });

  const [gameState, setGameState] = useState<GameState>({
    gameStarted: false,
    gameOver: false,
    score: 0,
    gameSpeed: GAME_CONFIG.SPEEDS.INITIAL,
    frameCount: 0
  });

  const [dino, setDino] = useState<Dino>(createInitialDino());
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);

  const updateGameState = useCallback((currentTime: number) => {
    if (!canvasRef.current || !gameLoopRef.current) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Update dino using ref
    updateDino(dinoRef.current);

    // Update obstacles - move them left
    obstaclesRef.current = obstaclesRef.current.map(obstacle => ({
      ...obstacle,
      x: obstacle.x - gameStateRef.current.gameSpeed
    })).filter(obstacle => obstacle.x > -obstacle.width);

    // Update coins - move them left
    coinsRef.current = coinsRef.current.map(coin => ({
      ...coin,
      x: coin.x - gameStateRef.current.gameSpeed
    })).filter(coin => coin.x > -coin.width);

    // Generate new obstacles and coins with slower spawn rate
    if (gameStateRef.current.frameCount % 120 === 0) { // Increased from 100 to 120 for slower spawn
      obstaclesRef.current.push(generateObstacle(gameStateRef.current.score));
      console.log('Generated new obstacle at frame:', gameStateRef.current.frameCount);
    }
    if (gameStateRef.current.frameCount % 180 === 0) { // Increased from 150 to 180
      coinsRef.current.push(generateCoin());
      console.log('Generated new coin at frame:', gameStateRef.current.frameCount);
    }

    // Check collisions
    const hasCollision = obstaclesRef.current.some(obstacle => 
      checkCollision(dinoRef.current, obstacle)
    );

    // Check coin collection
    coinsRef.current = coinsRef.current.map(coin => {
      if (!coin.collected && checkCollision(dinoRef.current, coin)) {
        const scoreChange = coin.type === 'coin' ? 5 : -2;
        gameStateRef.current.score += scoreChange;
        console.log('Coin collected! Score change:', scoreChange, 'New score:', gameStateRef.current.score);
        return { ...coin, collected: true };
      }
      return coin;
    });

    // Update game speed more gradually
    if (gameStateRef.current.frameCount % 600 === 0) { // Increased from 500 to 600
      gameStateRef.current.gameSpeed = Math.min(
        gameStateRef.current.gameSpeed + GAME_CONFIG.SPEEDS.INCREMENT, 
        GAME_CONFIG.SPEEDS.MAX
      );
      console.log('Speed increased to:', gameStateRef.current.gameSpeed);
    }

    // Update frame count and check game over
    gameStateRef.current.frameCount += 1;
    gameStateRef.current.gameOver = hasCollision;

    // Update React state for UI
    setDino({ ...dinoRef.current });
    setObstacles([...obstaclesRef.current]);
    setCoins([...coinsRef.current]);
    setGameState({ ...gameStateRef.current });

    // Draw game
    drawGame(
      canvasRef.current,
      dinoRef.current,
      obstaclesRef.current,
      coinsRef.current,
      gameStateRef.current.score,
      gameStateRef.current.gameSpeed
    );

    // Continue game loop if not game over
    if (!hasCollision && gameLoopRef.current) {
      animationFrameRef.current = requestAnimationFrame(updateGameState);
    } else if (hasCollision) {
      console.log('Game Over! Final score:', gameStateRef.current.score);
    }
  }, []);

  const startGame = useCallback(() => {
    console.log('startGame called from useDinoGame');
    if (!canvasRef.current) {
      console.log('startGame: Canvas not ready yet');
      return;
    }

    console.log('startGame: Canvas is ready, initializing game state');
    
    // Reset all refs
    dinoRef.current = createInitialDino();
    obstaclesRef.current = [];
    coinsRef.current = [];
    gameStateRef.current = {
      gameStarted: true,
      gameOver: false,
      score: 0,
      gameSpeed: GAME_CONFIG.SPEEDS.INITIAL,
      frameCount: 0
    };

    // Reset React state
    setGameState(gameStateRef.current);
    setDino(dinoRef.current);
    setObstacles([]);
    setCoins([]);

    // Start game loop
    gameLoopRef.current = true;
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(updateGameState);
    console.log('startGame: Game loop started');
  }, [updateGameState]);

  const restartGame = useCallback(() => {
    console.log('restartGame called');
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    gameLoopRef.current = false;
    
    // Reset refs
    gameStateRef.current = {
      gameStarted: false,
      gameOver: false,
      score: 0,
      gameSpeed: GAME_CONFIG.SPEEDS.INITIAL,
      frameCount: 0
    };
    
    setGameState(gameStateRef.current);
  }, []);

  const jump = useCallback(() => {
    console.log('jump called');
    if (gameStateRef.current.gameStarted && !gameStateRef.current.gameOver) {
      jumpDino(dinoRef.current);
      setDino({ ...dinoRef.current });
      console.log('Dino jumped! New Y position:', dinoRef.current.y);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    console.log('useDinoGame mounted');
    return () => {
      console.log('useDinoGame unmounted, cleaning up game loop');
      gameLoopRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return {
    canvasRef,
    gameState,
    jump,
    startGame,
    restartGame
  };
};
