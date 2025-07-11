
import { BoardState, Player } from './types';
import { WIN_COMBINATIONS, PRIORITY_POSITIONS } from './constants';

export const createEmptyBoard = (): BoardState => Array(25).fill(null);

export const checkWinner = (boardState: BoardState): Player | "draw" | null => {
  for (const combination of WIN_COMBINATIONS) {
    if (combination.length === 5) {
      const [a, b, c, d, e] = combination;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c] &&
        boardState[a] === boardState[d] &&
        boardState[a] === boardState[e]
      ) {
        return boardState[a] as Player;
      }
    } else if (combination.length === 4) {
      const [a, b, c, d] = combination;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c] &&
        boardState[a] === boardState[d]
      ) {
        return boardState[a] as Player;
      }
    }
  }
  
  if (!boardState.includes(null)) {
    return "draw";
  }
  
  return null;
};

const evaluatePosition = (boardState: BoardState, player: Player): number => {
  let score = 0;
  
  for (const combination of WIN_COMBINATIONS) {
    let playerCount = 0;
    let opponentCount = 0;
    let emptyCount = 0;
    
    for (const index of combination) {
      if (boardState[index] === player) {
        playerCount++;
      } else if (boardState[index] === (player === "O" ? "X" : "O")) {
        opponentCount++;
      } else {
        emptyCount++;
      }
    }
    
    // If line is not blocked by opponent
    if (opponentCount === 0) {
      if (playerCount === 4) score += 10000; // Winning move
      else if (playerCount === 3) score += 1000; // Three in a row
      else if (playerCount === 2) score += 100; // Two in a row
      else if (playerCount === 1) score += 10; // One in a row
    }
    
    // If line is not blocked by player (defensive)
    if (playerCount === 0) {
      if (opponentCount === 4) score -= 5000; // Block winning move
      else if (opponentCount === 3) score -= 500; // Block three in a row
      else if (opponentCount === 2) score -= 50; // Block two in a row
      else if (opponentCount === 1) score -= 5; // Block one in a row
    }
  }
  
  // Positional bonus for center and strategic positions
  const centerPositions = [12]; // Center of 5x5 board
  const cornerPositions = [0, 4, 20, 24];
  const edgePositions = [2, 10, 14, 22];
  
  centerPositions.forEach(pos => {
    if (boardState[pos] === player) score += 50;
    else if (boardState[pos] === (player === "O" ? "X" : "O")) score -= 25;
  });
  
  cornerPositions.forEach(pos => {
    if (boardState[pos] === player) score += 30;
    else if (boardState[pos] === (player === "O" ? "X" : "O")) score -= 15;
  });
  
  edgePositions.forEach(pos => {
    if (boardState[pos] === player) score += 20;
    else if (boardState[pos] === (player === "O" ? "X" : "O")) score -= 10;
  });
  
  return score;
};

const minimax = (
  boardState: BoardState, 
  depth: number, 
  isMaximizing: boolean, 
  alpha: number, 
  beta: number,
  maxDepth: number = 8
): number => {
  const winner = checkWinner(boardState);
  
  if (winner === "O") return 10000 - depth;
  if (winner === "X") return -10000 + depth;
  if (winner === "draw" || depth >= maxDepth) return evaluatePosition(boardState, "O");
  
  const availableMoves = [];
  for (let i = 0; i < 25; i++) {
    if (boardState[i] === null) {
      availableMoves.push(i);
    }
  }
  
  // Sort moves by priority for better pruning
  availableMoves.sort((a, b) => {
    const priorityA = PRIORITY_POSITIONS.indexOf(a);
    const priorityB = PRIORITY_POSITIONS.indexOf(b);
    if (priorityA === -1 && priorityB === -1) return 0;
    if (priorityA === -1) return 1;
    if (priorityB === -1) return -1;
    return priorityA - priorityB;
  });
  
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      boardState[move] = "O";
      const evaluation = minimax(boardState, depth + 1, false, alpha, beta, maxDepth);
      boardState[move] = null;
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      boardState[move] = "X";
      const evaluation = minimax(boardState, depth + 1, true, alpha, beta, maxDepth);
      boardState[move] = null;
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return minEval;
  }
};

export const findBestMove = (boardState: BoardState, difficulty: 'easy' | 'medium' | 'hard' = 'hard'): number => {
  // Check for immediate winning moves first
  for (let i = 0; i < 25; i++) {
    if (boardState[i] === null) {
      boardState[i] = "O";
      if (checkWinner(boardState) === "O") {
        boardState[i] = null;
        return i; // Winning move found
      }
      boardState[i] = null;
    }
  }
  
  // Check for blocking opponent's winning moves
  for (let i = 0; i < 25; i++) {
    if (boardState[i] === null) {
      boardState[i] = "X";
      if (checkWinner(boardState) === "X") {
        boardState[i] = null;
        return i; // Block opponent's winning move
      }
      boardState[i] = null;
    }
  }
  
  let bestMove = -1;
  let bestValue = -Infinity;
  const maxDepth = difficulty === 'hard' ? 8 : difficulty === 'medium' ? 6 : 4;
  
  // Evaluate all possible moves
  const availableMoves = [];
  for (let i = 0; i < 25; i++) {
    if (boardState[i] === null) {
      availableMoves.push(i);
    }
  }
  
  // Prioritize strategic positions
  const strategicMoves = availableMoves.filter(move => PRIORITY_POSITIONS.includes(move));
  const otherMoves = availableMoves.filter(move => !PRIORITY_POSITIONS.includes(move));
  const orderedMoves = [...strategicMoves, ...otherMoves];
  
  for (const move of orderedMoves) {
    boardState[move] = "O";
    const moveValue = minimax(boardState, 0, false, -Infinity, Infinity, maxDepth);
    boardState[move] = null;
    
    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestMove = move;
    }
  }
  
  // If no good move found, take center or corner
  if (bestMove === -1) {
    const fallbackMoves = [12, 0, 4, 20, 24, 2, 10, 14, 22];
    for (const move of fallbackMoves) {
      if (boardState[move] === null) {
        return move;
      }
    }
    
    // Last resort: any available move
    for (let i = 0; i < 25; i++) {
      if (boardState[i] === null) {
        return i;
      }
    }
  }
  
  return bestMove;
};
