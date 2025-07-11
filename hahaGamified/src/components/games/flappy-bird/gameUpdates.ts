
import { Bird, Pipe, Collectible } from './types';
import { GAME_CONSTANTS } from './constants';
import { generatePipe, generateCollectible } from './utils';
import { updateBirdPhysics, checkBirdCollisions, checkCollectibleCollection } from './gamePhysics';

export const updatePipes = (pipes: Pipe[], frameCount: number): Pipe[] => {
  // Generate new pipes
  if (frameCount % GAME_CONSTANTS.pipeInterval === 0) {
    pipes.push(generatePipe());
  }

  // Update existing pipes
  return pipes.filter(pipe => {
    pipe.x -= GAME_CONSTANTS.pipeSpeed;
    return pipe.x > -pipe.width;
  });
};

export const updateCollectibles = (collectibles: Collectible[], frameCount: number): Collectible[] => {
  // Generate new collectibles
  if (frameCount % GAME_CONSTANTS.collectibleInterval === 0) {
    collectibles.push(generateCollectible());
  }

  // Update existing collectibles
  return collectibles.filter(collectible => {
    collectible.x -= GAME_CONSTANTS.collectibleSpeed;
    return collectible.x > -collectible.width;
  });
};

export const checkPipeScoring = (pipes: Pipe[]): number => {
  let scoreIncrease = 0;
  pipes.forEach(pipe => {
    if (!pipe.passed && pipe.x + pipe.width < 100) {
      pipe.passed = true;
      scoreIncrease += 1;
    }
  });
  return scoreIncrease;
};
