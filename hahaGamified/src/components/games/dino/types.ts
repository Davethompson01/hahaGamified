
export interface Dino {
  x: number;
  y: number;
  width: number;
  height: number;
  jumping: boolean;
  velocityY: number;
  groundY: number;
}

export interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus' | 'bird';
}

export interface Coin {
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  type: 'coin' | 'scam';
}

export interface GameState {
  gameStarted: boolean;
  gameOver: boolean;
  score: number;
  gameSpeed: number;
  frameCount: number;
}
