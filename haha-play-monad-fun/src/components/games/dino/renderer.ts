
import { Dino, Obstacle, Coin } from './types';
import { draw3DGame } from './renderer3D';

export const drawGame = (
  canvas: HTMLCanvasElement,
  dino: Dino,
  obstacles: Obstacle[],
  coins: Coin[],
  score: number,
  gameSpeed: number
): void => {
  // Use 3D renderer for enhanced visuals
  draw3DGame(canvas, dino, obstacles, coins, score, gameSpeed);
  
  console.log(`3D Enhanced game rendered - Score: ${score}, Dino: (${dino.x}, ${dino.y}), Obstacles: ${obstacles.length}, Coins: ${coins.length}`);
};
