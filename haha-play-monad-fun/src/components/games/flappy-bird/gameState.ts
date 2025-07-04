
import { Bird, Pipe, Collectible } from './types';
import { GAME_CONSTANTS } from './constants';

export interface GameState {
  bird: Bird;
  pipes: Pipe[];
  collectibles: Collectible[];
  frameCount: number;
  gameStarted: boolean;
  gameActive: boolean;
  gameOver: boolean;
  score: number;
}

export const createInitialGameState = (): GameState => ({
  bird: {
    y: GAME_CONSTANTS.gameHeight / 2,
    velocity: 0,
    width: GAME_CONSTANTS.birdSize,
    height: GAME_CONSTANTS.birdSize
  },
  pipes: [],
  collectibles: [],
  frameCount: 0,
  gameStarted: false,
  gameActive: false,
  gameOver: false,
  score: 0
});

export const resetGameState = (state: GameState): GameState => ({
  ...createInitialGameState(),
  gameStarted: true,
  gameActive: false
});
