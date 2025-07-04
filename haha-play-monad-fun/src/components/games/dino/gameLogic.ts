
import { Dino, Obstacle, Coin } from './types';
import { GAME_CONFIG, JUMP_HEIGHTS, BIRD_HEIGHTS, getBirdSize } from './constants';

export const createInitialDino = (): Dino => ({
  x: GAME_CONFIG.DINO.START_X,
  y: GAME_CONFIG.DINO.START_Y,
  width: GAME_CONFIG.DINO.WIDTH,
  height: GAME_CONFIG.DINO.HEIGHT,
  jumping: false,
  velocityY: 0,
  groundY: GAME_CONFIG.DINO.START_Y
});

export const updateDino = (dino: Dino): void => {
  if (dino.jumping) {
    dino.velocityY += GAME_CONFIG.DINO.GRAVITY;
    dino.y += dino.velocityY;
    
    if (dino.y >= dino.groundY) {
      dino.y = dino.groundY;
      dino.jumping = false;
      dino.velocityY = 0;
    }
  }
};

export const jump = (dino: Dino): void => {
  if (!dino.jumping) {
    dino.jumping = true;
    dino.velocityY = GAME_CONFIG.DINO.JUMP_VELOCITY;
  }
};

export const generateObstacle = (score: number = 0): Obstacle => {
  const types: Array<'cactus' | 'bird'> = ['cactus', 'bird'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  if (type === 'bird') {
    const birdSize = getBirdSize(score);
    return {
      x: GAME_CONFIG.OBSTACLE.SPAWN_X,
      y: BIRD_HEIGHTS[Math.floor(Math.random() * BIRD_HEIGHTS.length)],
      width: birdSize.width,
      height: birdSize.height,
      type
    };
  }
  
  return {
    x: GAME_CONFIG.OBSTACLE.SPAWN_X,
    y: GAME_CONFIG.DINO.START_Y,
    width: GAME_CONFIG.OBSTACLE.WIDTH,
    height: GAME_CONFIG.OBSTACLE.CACTUS_HEIGHT,
    type
  };
};

export const generateCoin = (): Coin => {
  const type: 'coin' | 'scam' = Math.random() > 0.3 ? 'coin' : 'scam';
  const y = JUMP_HEIGHTS[Math.floor(Math.random() * JUMP_HEIGHTS.length)];
  
  return {
    x: GAME_CONFIG.COIN.SPAWN_X,
    y,
    width: GAME_CONFIG.COIN.WIDTH,
    height: GAME_CONFIG.COIN.HEIGHT,
    collected: false,
    type
  };
};

export const checkCollision = (
  rect1: { x: number; y: number; width: number; height: number },
  rect2: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
};
