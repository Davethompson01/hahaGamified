
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BoardState, Player, GameState } from './types';
import { createEmptyBoard, checkWinner, findBestMove } from './gameLogic';
import { AI_DELAY_MS } from './constants';

export const useTicTacToe = () => {
  const { toast } = useToast();
  
  const [gameState, setGameState] = useState<GameState>({
    gameStarted: false,
    board: createEmptyBoard(),
    currentPlayer: "X",
    winner: null,
    stats: {
      playerScore: 0,
      computerScore: 0,
      drawScore: 0
    }
  });

  const handleGameEnd = useCallback((result: Player | "draw") => {
    setGameState(prev => ({
      ...prev,
      winner: result,
      stats: {
        ...prev.stats,
        playerScore: result === "X" ? prev.stats.playerScore + 1 : prev.stats.playerScore,
        computerScore: result === "O" ? prev.stats.computerScore + 1 : prev.stats.computerScore,
        drawScore: result === "draw" ? prev.stats.drawScore + 1 : prev.stats.drawScore
      }
    }));
    
    if (result === "X") {
      toast({
        title: "You win!",
        description: "Congratulations, you beat the computer!",
      });
    } else if (result === "O") {
      toast({
        title: "Computer wins!",
        description: "The AI outsmarted you this time.",
      });
    } else {
      toast({
        title: "It's a draw!",
        description: "No winner this time.",
      });
    }
  }, [toast]);

  const handleCellClick = useCallback((index: number) => {
    if (gameState.board[index] || gameState.winner || gameState.currentPlayer === "O") return;
    
    const newBoard = [...gameState.board];
    newBoard[index] = gameState.currentPlayer;
    
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: "O"
    }));
    
    const result = checkWinner(newBoard);
    if (result) {
      handleGameEnd(result);
      return;
    }

    // Computer move with delay
    setTimeout(() => {
      const bestMove = findBestMove(newBoard);
      
      if (bestMove !== -1) {
        newBoard[bestMove] = "O";
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: "X"
        }));
        
        const computerResult = checkWinner(newBoard);
        if (computerResult) {
          handleGameEnd(computerResult);
        }
      }
    }, AI_DELAY_MS);
  }, [gameState.board, gameState.winner, gameState.currentPlayer, handleGameEnd]);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      board: createEmptyBoard(),
      currentPlayer: "X",
      winner: null
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true
    }));
    resetGame();
  }, [resetGame]);

  return {
    gameState,
    handleCellClick,
    resetGame,
    startGame
  };
};
