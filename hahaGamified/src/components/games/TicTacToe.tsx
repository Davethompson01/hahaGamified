
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Gamepad2, RefreshCw, User, Bot, Trophy } from 'lucide-react';
import { useToast } from '../ui/use-toast';

type Player = 'X' | 'O' | null;
type GameMode = 'easy' | 'medium' | 'hard';

const TicTacToe = () => {
  const [board, setBoard] = useState<Player[]>(Array(25).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<Player | 'tie'>(null);
  const [gameMode, setGameMode] = useState<GameMode>('medium');
  const [score, setScore] = useState({ player: 0, ai: 0, ties: 0 });
  const [isAiThinking, setIsAiThinking] = useState(false);
  const { toast } = useToast();

  const winningLines = [
    // Rows
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    // Columns
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    // Diagonals
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20],
    // Additional winning patterns for 5x5
    [1, 7, 13, 19], [5, 11, 17, 23], [3, 7, 11, 15], [9, 13, 17, 21]
  ];

  const calculateWinner = (squares: Player[]): Player | 'tie' => {
    for (const line of winningLines) {
      const [a, b, c, d, e] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && 
          squares[a] === squares[d] && squares[a] === squares[e]) {
        return squares[a];
      }
    }
    return squares.every(square => square !== null) ? 'tie' : null;
  };

  const getAiMove = (squares: Player[], difficulty: GameMode): number => {
    const availableMoves = squares.map((square, index) => square === null ? index : null)
                                 .filter(val => val !== null) as number[];

    if (availableMoves.length === 0) return -1;

    if (difficulty === 'easy') {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    // For medium and hard, use minimax with different depths
    const depth = difficulty === 'hard' ? 6 : 4;
    const bestMove = minimax(squares, depth, false, -Infinity, Infinity);
    return bestMove.index !== -1 ? bestMove.index : availableMoves[Math.floor(Math.random() * availableMoves.length)];
  };

  const minimax = (squares: Player[], depth: number, isMaximizing: boolean, alpha: number, beta: number): { score: number; index: number } => {
    const winner = calculateWinner(squares);
    
    if (winner === 'O') return { score: 10 - depth, index: -1 };
    if (winner === 'X') return { score: depth - 10, index: -1 };
    if (winner === 'tie' || depth === 0) return { score: 0, index: -1 };

    const availableMoves = squares.map((square, index) => square === null ? index : null)
                                 .filter(val => val !== null) as number[];

    let bestScore = isMaximizing ? -Infinity : Infinity;
    let bestIndex = -1;

    for (const move of availableMoves) {
      const newSquares = [...squares];
      newSquares[move] = isMaximizing ? 'O' : 'X';
      
      const result = minimax(newSquares, depth - 1, !isMaximizing, alpha, beta);
      
      if (isMaximizing) {
        if (result.score > bestScore) {
          bestScore = result.score;
          bestIndex = move;
        }
        alpha = Math.max(alpha, result.score);
      } else {
        if (result.score < bestScore) {
          bestScore = result.score;
          bestIndex = move;
        }
        beta = Math.min(beta, result.score);
      }
      
      if (beta <= alpha) break;
    }

    return { score: bestScore, index: bestIndex };
  };

  const handleClick = (index: number) => {
    if (board[index] || winner || isAiThinking) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsXNext(false);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'X') {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        toast({ title: "🎉 You Won!", description: "Great job beating the AI!" });
      } else if (gameWinner === 'tie') {
        setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
        toast({ title: "🤝 It's a Tie!", description: "Good game!" });
      }
      return;
    }

    // AI turn
    setIsAiThinking(true);
    setTimeout(() => {
      const aiMove = getAiMove(newBoard, gameMode);
      if (aiMove !== -1) {
        const aiBoard = [...newBoard];
        aiBoard[aiMove] = 'O';
        setBoard(aiBoard);
        
        const aiWinner = calculateWinner(aiBoard);
        if (aiWinner) {
          setWinner(aiWinner);
          if (aiWinner === 'O') {
            setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
            toast({ title: "🤖 AI Won!", description: "Better luck next time!" });
          } else if (aiWinner === 'tie') {
            setScore(prev => ({ ...prev, ties: prev.ties + 1 }));
            toast({ title: "🤝 It's a Tie!", description: "Good game!" });
          }
        }
      }
      setIsXNext(true);
      setIsAiThinking(false);
    }, 500);
  };

  const resetGame = () => {
    setBoard(Array(25).fill(null));
    setIsXNext(true);
    setWinner(null);
    setIsAiThinking(false);
  };

  const resetScore = () => {
    setScore({ player: 0, ai: 0, ties: 0 });
    resetGame();
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2 md:p-6 bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 overflow-hidden">
      <Card className="w-full max-w-4xl bg-gradient-to-br from-white/95 to-orange-50/95 backdrop-blur-sm shadow-2xl border-2 border-orange-300 animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="text-4xl md:text-6xl animate-bounce">⭕</div>
            <CardTitle className="text-2xl md:text-4xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              5×5 Tic Tac Toe
            </CardTitle>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge className="bg-blue-500 text-white">
              <User className="w-4 h-4 mr-1" />
              You: {score.player}
            </Badge>
            <Badge className="bg-red-500 text-white">
              <Bot className="w-4 h-4 mr-1" />
              AI: {score.ai}
            </Badge>
            <Badge className="bg-gray-500 text-white">
              <Trophy className="w-4 h-4 mr-1" />
              Ties: {score.ties}
            </Badge>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {(['easy', 'medium', 'hard'] as GameMode[]).map(mode => (
              <Button
                key={mode}
                variant={gameMode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setGameMode(mode)}
                className={`capitalize ${gameMode === mode ? 'bg-orange-500 text-white' : 'border-orange-300 text-orange-600 hover:bg-orange-50'}`}
              >
                {mode}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4 md:space-y-6">
          <div className="grid grid-cols-5 gap-1 md:gap-2 bg-gradient-to-br from-orange-600 to-red-600 p-2 md:p-4 rounded-xl shadow-inner">
            {board.map((cell, index) => (
              <Button
                key={index}
                onClick={() => handleClick(index)}
                className={`
                  w-12 h-12 md:w-16 md:h-16 text-xl md:text-3xl font-bold rounded-lg
                  ${cell === 'X' ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg transform scale-105' : 
                    cell === 'O' ? 'bg-gradient-to-br from-red-400 to-red-600 text-white shadow-lg transform scale-105' : 
                    'bg-gradient-to-br from-white to-orange-50 hover:from-orange-100 hover:to-orange-200 text-gray-700 hover:scale-105 transition-all duration-200 shadow-md'}
                  ${!cell && !winner && !isAiThinking ? 'cursor-pointer hover:shadow-xl' : 'cursor-not-allowed'}
                `}
                disabled={!!cell || !!winner || isAiThinking}
              >
                {cell}
              </Button>
            ))}
          </div>

          <div className="text-center space-y-2 md:space-y-4">
            {isAiThinking && (
              <div className="flex items-center justify-center space-x-2 text-orange-600">
                <Bot className="w-5 h-5 animate-pulse" />
                <span className="text-lg font-semibold">AI is thinking...</span>
              </div>
            )}
            
            {winner && (
              <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 md:p-6 rounded-xl border-2 border-orange-300">
                <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                  {winner === 'tie' ? "🤝 It's a Tie!" : 
                   winner === 'X' ? "🎉 You Won!" : "🤖 AI Won!"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {winner === 'tie' ? "Great game! Nobody wins this round." :
                   winner === 'X' ? "Congratulations! You beat the AI!" :
                   "The AI got you this time. Try again!"}
                </p>
              </div>
            )}
            
            {!winner && !isAiThinking && (
              <div className="text-lg font-semibold text-gray-700">
                <div className="flex items-center justify-center space-x-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <span>Your turn (X)</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <Button 
              onClick={resetGame}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              New Game
            </Button>
            <Button 
              onClick={resetScore}
              variant="outline"
              className="border-orange-400 text-orange-600 hover:bg-orange-50 transform hover:scale-105 transition-all duration-200"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Reset Score
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <Gamepad2 className="w-4 h-4" />
              <span>Get 5 in a row to win! • Mode: {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicTacToe;
