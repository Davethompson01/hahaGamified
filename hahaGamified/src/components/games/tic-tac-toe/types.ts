
export type Player = "X" | "O";
export type BoardState = (Player | null)[];

export interface GameStats {
  playerScore: number;
  computerScore: number;
  drawScore: number;
}

export interface GameState {
  gameStarted: boolean;
  board: BoardState;
  currentPlayer: Player;
  winner: Player | "draw" | null;
  stats: GameStats;
}
