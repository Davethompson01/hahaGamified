export const GAME_CONFIG = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  GROUND_Y: 360, // Added ground Y position
  DINO: {
    START_X: 50,
    START_Y: 300,
    WIDTH: 40,
    HEIGHT: 60, // Increased height for the Hulk
    GRAVITY: 0.4, // Reduced gravity for slower falling
    JUMP_VELOCITY: -10 // Reduced jump velocity for slower movement
  },
  OBSTACLE: {
    SPAWN_X: 800,
    WIDTH: 20,
    CACTUS_HEIGHT: 40,
    BIRD_HEIGHT: 20,
    get BIRD_SCALED_HEIGHT() {
      // This will be calculated dynamically based on score
      return this.BIRD_HEIGHT;
    }
  },
  COIN: {
    SPAWN_X: 800,
    WIDTH: 15,
    HEIGHT: 15
  },
  SPEEDS: {
    INITIAL: 3, // Reduced from higher value to make game slower
    INCREMENT: 0.3, // Reduced increment for gradual speed increase
    MAX: 8 // Reduced max speed
  }
};

export const JUMP_HEIGHTS = [250, 200, 150, 180, 220];
export const BIRD_HEIGHTS = [250, 200, 150];

// Helper function to calculate bird size based on score
export const getBirdSize = (score: number) => {
  const sizeMultiplier = Math.floor(score / 3) * 0.5 + 1; // Increase size every 3 points
  return {
    width: GAME_CONFIG.OBSTACLE.WIDTH * sizeMultiplier,
    height: GAME_CONFIG.OBSTACLE.BIRD_HEIGHT * sizeMultiplier
  };
};
