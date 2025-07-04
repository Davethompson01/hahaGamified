
export const BOARD_SIZE = 25;

export const WIN_COMBINATIONS = [
  // Rows
  [0, 1, 2, 3, 4],
  [5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24],
  // Columns
  [0, 5, 10, 15, 20],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  // Diagonals
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
  // Additional diagonals for 5x5
  [1, 7, 13, 19],
  [5, 11, 17, 23],
  [3, 7, 11, 15],
  [9, 13, 17, 21]
];

export const PRIORITY_POSITIONS = [12, 0, 4, 20, 24, 6, 8, 16, 18];

export const AI_DELAY_MS = 800;
