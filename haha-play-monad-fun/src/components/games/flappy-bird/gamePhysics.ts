
import { Bird, Pipe, Collectible } from './types';
import { GAME_CONSTANTS } from './constants';

export const updateBirdPhysics = (bird: Bird, gameActive: boolean, frameCount: number): void => {
  if (gameActive) {
    bird.velocity += GAME_CONSTANTS.gravity;
    bird.y += bird.velocity;
  } else {
    const floatOffset = Math.sin(frameCount * 0.1) * 2;
    bird.y = GAME_CONSTANTS.gameHeight / 2 + floatOffset;
  }
};

export const checkBirdCollisions = (bird: Bird, pipes: Pipe[]): boolean => {
  // Check floor/ceiling collision
  if (bird.y < 0 || bird.y + bird.height > GAME_CONSTANTS.gameHeight) {
    return true;
  }

  // Check pipe collision
  for (const pipe of pipes) {
    if (
      100 + bird.width > pipe.x && 100 < pipe.x + pipe.width &&
      (bird.y < pipe.topHeight || bird.y + bird.height > GAME_CONSTANTS.gameHeight - pipe.bottomHeight)
    ) {
      return true;
    }
  }

  return false;
};

export const checkCollectibleCollection = (bird: Bird, collectible: Collectible): boolean => {
  return Math.abs((100 + bird.width/2) - (collectible.x + collectible.width/2)) < (bird.width/2 + collectible.width/2) &&
         Math.abs((bird.y + bird.height/2) - (collectible.y + collectible.height/2)) < (bird.height/2 + collectible.height/2);
};
