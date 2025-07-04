import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Play, Pause, RotateCcw, Trophy, Zap, Square } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Game types
type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
type Board = number[][];
type Position = { x: number; y: number };

interface Tetromino {
  type: TetrominoType;
  shape: number[][];
  color: string;
  position: Position;
}

// 3D Block Component
const Block3D: React.FC<{ position: [number, number, number]; color: string; opacity?: number }> = ({ 
  position, 
  color, 
  opacity = 1 
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && opacity < 1) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh 
      ref={meshRef}
      position={position}
    >
      <boxGeometry args={[0.9, 0.9, 0.9]} />
      <meshStandardMaterial 
        color={color} 
        transparent={opacity < 1}
        opacity={opacity}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
};

// 3D Game Board Component
const GameBoard3D: React.FC<{ 
  board: Board; 
  currentPiece: Tetromino | null;
  score: number;
}> = ({ board, currentPiece, score }) => {
  return (
    <group>
      {/* Game Board Blocks */}
      {board.map((row, y) =>
        row.map((cell, x) => {
          if (cell) {
            return (
              <Block3D
                key={`${x}-${y}`}
                position={[x - 5, 10 - y, 0]}
                color="#4a90e2"
              />
            );
          }
          return null;
        })
      )}
      
      {/* Current Piece */}
      {currentPiece && currentPiece.shape.map((row, y) =>
        row.map((cell, x) => {
          if (cell) {
            return (
              <Block3D
                key={`current-${x}-${y}`}
                position={[
                  currentPiece.position.x + x - 5, 
                  10 - (currentPiece.position.y + y), 
                  0
                ]}
                color={currentPiece.color}
                opacity={0.9}
              />
            );
          }
          return null;
        })
      )}
      
      {/* Game Board Outline */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(10.2, 20.2, 0.2)]} />
        <lineBasicMaterial attach="material" color="#ffffff" opacity={0.3} transparent />
      </lineSegments>
      
      {/* Grid Lines */}
      {Array.from({ length: 11 }).map((_, i) => (
        <lineSegments key={`v-${i}`}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                i - 5, -10, 0,
                i - 5, 10, 0
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#333333" opacity={0.2} transparent />
        </lineSegments>
      ))}
      {Array.from({ length: 21 }).map((_, i) => (
        <lineSegments key={`h-${i}`}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array([
                -5, 10 - i, 0,
                5, 10 - i, 0
              ])}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#333333" opacity={0.2} transparent />
        </lineSegments>
      ))}
    </group>
  );
};

// 3D Scene Component
const Scene3D: React.FC<{ 
  board: Board; 
  currentPiece: Tetromino | null;
  score: number;
}> = ({ board, currentPiece, score }) => {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} />
      
      <GameBoard3D board={board} currentPiece={currentPiece} score={score} />
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        maxDistance={30}
        minDistance={15}
      />
    </>
  );
};

const BlockStack = () => {
  const { toast } = useToast();
  const [board, setBoard] = useState<Board>(() => Array(20).fill(null).map(() => Array(10).fill(0)));
  const [currentPiece, setCurrentPiece] = useState<Tetromino | null>(null);
  const [nextPiece, setNextPiece] = useState<Tetromino | null>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [dropTime, setDropTime] = useState(1000);
  const gameLoopRef = useRef<number>();
  const lastDropTime = useRef(Date.now());

  // Tetromino shapes and colors
  const tetrominoes: Record<TetrominoType, { shape: number[][][]; color: string }> = {
    I: {
      shape: [
        [[1, 1, 1, 1]],
        [[1], [1], [1], [1]]
      ],
      color: '#00f5ff'
    },
    O: {
      shape: [
        [[1, 1], [1, 1]]
      ],
      color: '#ffff00'
    },
    T: {
      shape: [
        [[0, 1, 0], [1, 1, 1]],
        [[1, 0], [1, 1], [1, 0]],
        [[1, 1, 1], [0, 1, 0]],
        [[0, 1], [1, 1], [0, 1]]
      ],
      color: '#800080'
    },
    S: {
      shape: [
        [[0, 1, 1], [1, 1, 0]],
        [[1, 0], [1, 1], [0, 1]]
      ],
      color: '#00ff00'
    },
    Z: {
      shape: [
        [[1, 1, 0], [0, 1, 1]],
        [[0, 1], [1, 1], [1, 0]]
      ],
      color: '#ff0000'
    },
    J: {
      shape: [
        [[1, 0, 0], [1, 1, 1]],
        [[1, 1], [1, 0], [1, 0]],
        [[1, 1, 1], [0, 0, 1]],
        [[0, 1], [0, 1], [1, 1]]
      ],
      color: '#0000ff'
    },
    L: {
      shape: [
        [[0, 0, 1], [1, 1, 1]],
        [[1, 0], [1, 0], [1, 1]],
        [[1, 1, 1], [1, 0, 0]],
        [[1, 1], [0, 1], [0, 1]]
      ],
      color: '#ffa500'
    }
  };

  const createTetromino = (): Tetromino => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const type = types[Math.floor(Math.random() * types.length)];
    const tetrominoData = tetrominoes[type];
    
    return {
      type,
      shape: tetrominoData.shape[0],
      color: tetrominoData.color,
      position: { x: Math.floor((10 - tetrominoData.shape[0][0].length) / 2), y: 0 }
    };
  };

  const isValidPosition = (piece: Tetromino, board: Board, offset = { x: 0, y: 0 }): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.position.x + x + offset.x;
          const newY = piece.position.y + y + offset.y;
          
          if (newX < 0 || newX >= 10 || newY >= 20) return false;
          if (newY >= 0 && board[newY][newX]) return false;
        }
      }
    }
    return true;
  };

  const placePiece = (piece: Tetromino, board: Board): Board => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.position.y + y;
          const boardX = piece.position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1;
          }
        }
      }
    }
    
    return newBoard;
  };

  const clearLines = (board: Board): { newBoard: Board; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const linesCleared = 20 - newBoard.length;
    
    while (newBoard.length < 20) {
      newBoard.unshift(Array(10).fill(0));
    }
    
    return { newBoard, linesCleared };
  };

  const rotatePiece = (piece: Tetromino): Tetromino => {
    const tetrominoData = tetrominoes[piece.type];
    const shapes = tetrominoData.shape;
    const currentIndex = shapes.findIndex(shape => JSON.stringify(shape) === JSON.stringify(piece.shape));
    const nextIndex = (currentIndex + 1) % shapes.length;
    
    return {
      ...piece,
      shape: shapes[nextIndex]
    };
  };

  const movePiece = useCallback((direction: 'left' | 'right' | 'down' | 'rotate') => {
    if (!currentPiece || gameOver) return;

    let newPiece = { ...currentPiece };
    let offset = { x: 0, y: 0 };

    switch (direction) {
      case 'left':
        offset.x = -1;
        break;
      case 'right':
        offset.x = 1;
        break;
      case 'down':
        offset.y = 1;
        break;
      case 'rotate':
        newPiece = rotatePiece(currentPiece);
        break;
    }

    if (direction !== 'rotate') {
      newPiece.position.x += offset.x;
      newPiece.position.y += offset.y;
    }

    if (isValidPosition(newPiece, board)) {
      setCurrentPiece(newPiece);
    } else if (direction === 'down') {
      // Piece has landed
      const newBoard = placePiece(currentPiece, board);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level + 10);
      
      if (linesCleared > 0) {
        toast({
          title: `${linesCleared} Line${linesCleared > 1 ? 's' : ''} Cleared!`,
          description: `+${linesCleared * 100 * level} points`
        });
      }
      
      // Check for game over
      if (!isValidPosition(nextPiece!, clearedBoard)) {
        setGameOver(true);
        setGameActive(false);
        toast({
          title: "Game Over!",
          description: `Final Score: ${score + linesCleared * 100 * level + 10}`,
          variant: "destructive"
        });
        return;
      }
      
      setCurrentPiece(nextPiece);
      setNextPiece(createTetromino());
    }
  }, [currentPiece, board, nextPiece, gameOver, level, score, toast]);

  const gameLoop = useCallback(() => {
    if (!gameActive || gameOver) return;

    const now = Date.now();
    if (now - lastDropTime.current > dropTime) {
      movePiece('down');
      lastDropTime.current = now;
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameActive, gameOver, dropTime, movePiece]);

  const startGame = () => {
    const firstPiece = createTetromino();
    const secondPiece = createTetromino();
    
    setBoard(Array(20).fill(null).map(() => Array(10).fill(0)));
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameActive(true);
    setGameOver(false);
    setDropTime(1000);
    lastDropTime.current = Date.now();
  };

  const pauseGame = () => {
    setGameActive(!gameActive);
  };

  const resetGame = () => {
    setGameActive(false);
    setGameOver(false);
    setBoard(Array(20).fill(null).map(() => Array(10).fill(0)));
    setCurrentPiece(null);
    setNextPiece(null);
    setScore(0);
    setLines(0);
    setLevel(1);
  };

  // Update level and speed based on lines cleared
  useEffect(() => {
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel !== level) {
      setLevel(newLevel);
      setDropTime(Math.max(100, 1000 - (newLevel - 1) * 50));
    }
  }, [lines, level]);

  // Game loop
  useEffect(() => {
    if (gameActive && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameActive, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameActive || gameOver) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece('down');
          break;
        case 'ArrowUp':
        case ' ':
          e.preventDefault();
          movePiece('rotate');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameActive, gameOver, movePiece]);

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center p-2 md:p-6 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 overflow-hidden">
      <Card className="w-full max-w-7xl h-full bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm shadow-2xl border-2 border-purple-300 animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="text-4xl md:text-6xl animate-bounce">🧱</div>
            <CardTitle className="text-2xl md:text-4xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              3D Tetris
            </CardTitle>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <Badge className="bg-purple-500 text-white">
              <Trophy className="w-4 h-4 mr-1" />
              Score: {score}
            </Badge>
            <Badge className="bg-blue-500 text-white">
              <Square className="w-4 h-4 mr-1" />
              Lines: {lines}
            </Badge>
            <Badge className="bg-indigo-500 text-white">
              <Zap className="w-4 h-4 mr-1" />
              Level: {level}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-6 h-full">
          {/* 3D Game Board */}
          <div className="flex-1 w-full h-full min-h-[600px]">
            <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
              <Suspense fallback={null}>
                <Scene3D board={board} currentPiece={currentPiece} score={score} />
              </Suspense>
            </Canvas>
          </div>

          {/* Side Panel */}
          <div className="flex flex-col space-y-4 items-center lg:w-80">
            {/* Next Piece Preview */}
            {nextPiece && (
              <Card className="p-4 bg-gradient-to-br from-purple-100 to-blue-100 border-2 border-purple-300 w-full">
                <h3 className="text-lg font-bold text-center mb-2 text-purple-700">Next</h3>
                <div className="grid gap-1 justify-center" style={{
                  gridTemplateColumns: `repeat(${nextPiece.shape[0]?.length || 4}, 1fr)`
                }}>
                  {nextPiece.shape.map((row, y) =>
                    row.map((cell, x) => (
                      <div
                        key={`${x}-${y}`}
                        className={`w-6 h-6 rounded ${
                          cell ? 'shadow-lg' : ''
                        }`}
                        style={{
                          backgroundColor: cell ? nextPiece.color : 'transparent'
                        }}
                      />
                    ))
                  )}
                </div>
              </Card>
            )}

            {/* Controls */}
            <div className="flex flex-col space-y-2 w-full">
              {!gameActive && !gameOver && (
                <Button
                  onClick={startGame}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
              )}
              
              {gameActive && (
                <Button
                  onClick={pauseGame}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              
              <Button
                onClick={resetGame}
                variant="outline"
                className="border-purple-400 text-purple-600 hover:bg-purple-50 transform hover:scale-105 transition-all duration-200"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="grid grid-cols-3 gap-2 lg:hidden w-full">
              <Button
                onTouchStart={() => movePiece('left')}
                className="bg-purple-500 hover:bg-purple-600 text-white"
                disabled={!gameActive || gameOver}
              >
                ←
              </Button>
              <Button
                onTouchStart={() => movePiece('rotate')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={!gameActive || gameOver}
              >
                ↻
              </Button>
              <Button
                onTouchStart={() => movePiece('right')}
                className="bg-purple-500 hover:bg-purple-600 text-white"
                disabled={!gameActive || gameOver}
              >
                →
              </Button>
              <div></div>
              <Button
                onTouchStart={() => movePiece('down')}
                className="bg-indigo-500 hover:bg-indigo-600 text-white"
                disabled={!gameActive || gameOver}
              >
                ↓
              </Button>
              <div></div>
            </div>

            {/* Instructions */}
            <Card className="p-4 bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-blue-300 text-center w-full">
              <h3 className="font-bold text-blue-700 mb-2">3D Controls</h3>
              <div className="text-sm text-blue-600 space-y-1">
                <p className="hidden lg:block">Arrow keys to move</p>
                <p className="hidden lg:block">Space/↑ to rotate</p>
                <p className="lg:hidden">Use buttons above</p>
                <p>Drag to rotate view!</p>
                <p>Clear lines to score!</p>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockStack;
