import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { useSoundManager } from '../../hooks/useSoundManager';

interface TetrisBlock {
  x: number;
  y: number;
  z: number;
  color: string;
}

interface TetrisPiece {
  blocks: TetrisBlock[];
  centerX: number;
  centerY: number;
  centerZ: number;
  color: string;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BOARD_DEPTH = 6;
const BLOCK_SIZE = 20;

const Tetris3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [board, setBoard] = useState<(TetrisBlock | null)[][][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill(null).map(() => 
        Array(BOARD_DEPTH).fill(null)
      )
    )
  );
  const [currentPiece, setCurrentPiece] = useState<TetrisPiece | null>(null);
  const [nextPiece, setNextPiece] = useState<TetrisPiece | null>(null);
  const { playSuccess, playCoin, playGameOver } = useSoundManager();

  const tetrisPieces = [
    // I-piece
    {
      blocks: [
        { x: 0, y: 0, z: 0, color: '#00FFFF' },
        { x: 1, y: 0, z: 0, color: '#00FFFF' },
        { x: 2, y: 0, z: 0, color: '#00FFFF' },
        { x: 3, y: 0, z: 0, color: '#00FFFF' }
      ],
      color: '#00FFFF'
    },
    // O-piece
    {
      blocks: [
        { x: 0, y: 0, z: 0, color: '#FFFF00' },
        { x: 1, y: 0, z: 0, color: '#FFFF00' },
        { x: 0, y: 1, z: 0, color: '#FFFF00' },
        { x: 1, y: 1, z: 0, color: '#FFFF00' }
      ],
      color: '#FFFF00'
    },
    // T-piece
    {
      blocks: [
        { x: 1, y: 0, z: 0, color: '#800080' },
        { x: 0, y: 1, z: 0, color: '#800080' },
        { x: 1, y: 1, z: 0, color: '#800080' },
        { x: 2, y: 1, z: 0, color: '#800080' }
      ],
      color: '#800080'
    },
    // S-piece
    {
      blocks: [
        { x: 1, y: 0, z: 0, color: '#00FF00' },
        { x: 2, y: 0, z: 0, color: '#00FF00' },
        { x: 0, y: 1, z: 0, color: '#00FF00' },
        { x: 1, y: 1, z: 0, color: '#00FF00' }
      ],
      color: '#00FF00'
    },
    // Z-piece
    {
      blocks: [
        { x: 0, y: 0, z: 0, color: '#FF0000' },
        { x: 1, y: 0, z: 0, color: '#FF0000' },
        { x: 1, y: 1, z: 0, color: '#FF0000' },
        { x: 2, y: 1, z: 0, color: '#FF0000' }
      ],
      color: '#FF0000'
    }
  ];

  const createRandomPiece = useCallback((): TetrisPiece => {
    const pieceTemplate = tetrisPieces[Math.floor(Math.random() * tetrisPieces.length)];
    return {
      blocks: pieceTemplate.blocks.map(block => ({ ...block })),
      centerX: Math.floor(BOARD_WIDTH / 2),
      centerY: 0,
      centerZ: Math.floor(BOARD_DEPTH / 2),
      color: pieceTemplate.color
    };
  }, []);

  const draw3DBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, z: number, color: string, isGhost = false) => {
    const screenX = x * BLOCK_SIZE + z * 5;
    const screenY = y * BLOCK_SIZE + z * 5;
    const depth = 8;

    if (isGhost) {
      ctx.globalAlpha = 0.3;
    }

    // Top face
    ctx.fillStyle = color;
    ctx.fillRect(screenX, screenY, BLOCK_SIZE, BLOCK_SIZE);

    // Right face (darker)
    const rightColor = adjustBrightness(color, -30);
    ctx.fillStyle = rightColor;
    ctx.beginPath();
    ctx.moveTo(screenX + BLOCK_SIZE, screenY);
    ctx.lineTo(screenX + BLOCK_SIZE + depth, screenY - depth);
    ctx.lineTo(screenX + BLOCK_SIZE + depth, screenY + BLOCK_SIZE - depth);
    ctx.lineTo(screenX + BLOCK_SIZE, screenY + BLOCK_SIZE);
    ctx.closePath();
    ctx.fill();

    // Front face (darkest)
    const frontColor = adjustBrightness(color, -60);
    ctx.fillStyle = frontColor;
    ctx.beginPath();
    ctx.moveTo(screenX, screenY + BLOCK_SIZE);
    ctx.lineTo(screenX + depth, screenY + BLOCK_SIZE - depth);
    ctx.lineTo(screenX + BLOCK_SIZE + depth, screenY + BLOCK_SIZE - depth);
    ctx.lineTo(screenX + BLOCK_SIZE, screenY + BLOCK_SIZE);
    ctx.closePath();
    ctx.fill();

    // Outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(screenX, screenY, BLOCK_SIZE, BLOCK_SIZE);

    if (isGhost) {
      ctx.globalAlpha = 1;
    }
  };

  const adjustBrightness = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#0f0f1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < BOARD_WIDTH; x++) {
      for (let y = 0; y < BOARD_HEIGHT; y++) {
        const screenX = x * BLOCK_SIZE;
        const screenY = y * BLOCK_SIZE;
        ctx.strokeRect(screenX, screenY, BLOCK_SIZE, BLOCK_SIZE);
      }
    }

    // Draw placed blocks
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let z = 0; z < BOARD_DEPTH; z++) {
          const block = board[y][x][z];
          if (block) {
            draw3DBlock(ctx, x, y, z, block.color);
          }
        }
      }
    }

    // Draw current piece
    if (currentPiece) {
      currentPiece.blocks.forEach(block => {
        const worldX = currentPiece.centerX + block.x;
        const worldY = currentPiece.centerY + block.y;
        const worldZ = currentPiece.centerZ + block.z;
        
        if (worldX >= 0 && worldX < BOARD_WIDTH && worldY >= 0 && worldY < BOARD_HEIGHT && worldZ >= 0 && worldZ < BOARD_DEPTH) {
          draw3DBlock(ctx, worldX, worldY, worldZ, currentPiece.color);
        }
      });
    }

    // Draw UI
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Level: ${level}`, 10, 50);
    ctx.fillText(`Lines: ${lines}`, 10, 70);

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 40);
      ctx.textAlign = 'left';
    }

    if (isPaused && !gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
      ctx.textAlign = 'left';
    }
  }, [board, currentPiece, score, level, lines, gameOver, isPaused]);

  const canMovePiece = useCallback((piece: TetrisPiece, deltaX: number, deltaY: number, deltaZ: number): boolean => {
    return piece.blocks.every(block => {
      const newX = piece.centerX + block.x + deltaX;
      const newY = piece.centerY + block.y + deltaY;
      const newZ = piece.centerZ + block.z + deltaZ;

      if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT || newZ < 0 || newZ >= BOARD_DEPTH) {
        return false;
      }

      if (newY >= 0 && board[newY][newX][newZ] !== null) {
        return false;
      }

      return true;
    });
  }, [board]);

  const placePiece = useCallback((piece: TetrisPiece) => {
    const newBoard = board.map(layer => layer.map(row => [...row]));
    
    piece.blocks.forEach(block => {
      const x = piece.centerX + block.x;
      const y = piece.centerY + block.y;
      const z = piece.centerZ + block.z;
      
      if (x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT && z >= 0 && z < BOARD_DEPTH) {
        newBoard[y][x][z] = { x, y, z, color: piece.color };
      }
    });

    setBoard(newBoard);
    playCoin(); // Use playCoin instead of playSound('place')
  }, [board, playCoin]);

  const clearLines = useCallback(() => {
    let linesCleared = 0;
    const newBoard = board.map(layer => layer.map(row => [...row]));

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      let isLineFull = true;
      for (let x = 0; x < BOARD_WIDTH; x++) {
        for (let z = 0; z < BOARD_DEPTH; z++) {
          if (newBoard[y][x][z] === null) {
            isLineFull = false;
            break;
          }
        }
        if (!isLineFull) break;
      }

      if (isLineFull) {
        // Remove the line
        newBoard.splice(y, 1);
        // Add empty line at top
        newBoard.unshift(Array(BOARD_WIDTH).fill(null).map(() => Array(BOARD_DEPTH).fill(null)));
        linesCleared++;
        y++; // Check same row again
      }
    }

    if (linesCleared > 0) {
      setBoard(newBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      playSuccess(); // Use playSuccess instead of playSound('line')
    }
  }, [board, level, playSuccess]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;

    if (canMovePiece(currentPiece, 0, 1, 0)) {
      setCurrentPiece(prev => prev ? { ...prev, centerY: prev.centerY + 1 } : null);
    } else {
      placePiece(currentPiece);
      clearLines();
      
      if (nextPiece) {
        if (canMovePiece(nextPiece, 0, 0, 0)) {
          setCurrentPiece(nextPiece);
          setNextPiece(createRandomPiece());
        } else {
          setGameOver(true);
          playGameOver(); // Use playGameOver instead of playSound('gameOver')
        }
      }
    }
  }, [currentPiece, canMovePiece, placePiece, clearLines, nextPiece, createRandomPiece, gameOver, isPaused, playGameOver]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!currentPiece || gameOver || isPaused) return;

    switch (e.code) {
      case 'ArrowLeft':
        if (canMovePiece(currentPiece, -1, 0, 0)) {
          setCurrentPiece(prev => prev ? { ...prev, centerX: prev.centerX - 1 } : null);
        }
        break;
      case 'ArrowRight':
        if (canMovePiece(currentPiece, 1, 0, 0)) {
          setCurrentPiece(prev => prev ? { ...prev, centerX: prev.centerX + 1 } : null);
        }
        break;
      case 'ArrowDown':
        dropPiece();
        break;
      case 'ArrowUp':
        if (canMovePiece(currentPiece, 0, 0, -1)) {
          setCurrentPiece(prev => prev ? { ...prev, centerZ: prev.centerZ - 1 } : null);
        }
        break;
      case 'Space':
        // Hard drop
        let dropDistance = 0;
        while (canMovePiece(currentPiece, 0, dropDistance + 1, 0)) {
          dropDistance++;
        }
        setCurrentPiece(prev => prev ? { ...prev, centerY: prev.centerY + dropDistance } : null);
        break;
    }
  }, [currentPiece, canMovePiece, dropPiece, gameOver, isPaused]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLines(0);
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill(null).map(() => 
        Array(BOARD_DEPTH).fill(null)
      )
    ));
    setCurrentPiece(createRandomPiece());
    setNextPiece(createRandomPiece());
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = BOARD_WIDTH * BLOCK_SIZE + 100;
      canvas.height = BOARD_HEIGHT * BLOCK_SIZE + 100;
    }
  }, []);

  useEffect(() => {
    drawGame();
  }, [drawGame]);

  useEffect(() => {
    if (!gameStarted || gameOver || isPaused) return;

    const interval = setInterval(dropPiece, Math.max(100, 1000 - (level - 1) * 100));
    return () => clearInterval(interval);
  }, [dropPiece, gameStarted, gameOver, isPaused, level]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-white mb-2">3D Tetris</h2>
          <p className="text-white/70 mb-4">Use arrow keys to move, Space to drop</p>
        </div>
        
        <canvas
          ref={canvasRef}
          className="border border-white/30 rounded-lg mb-4 bg-gradient-to-br from-gray-900 to-black"
        />
        
        <div className="flex justify-center gap-4">
          {!gameStarted || gameOver ? (
            <Button
              onClick={startGame}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
            >
              {gameOver ? 'Play Again' : 'Start Game'}
            </Button>
          ) : (
            <Button
              onClick={togglePause}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
          )}
        </div>
        
        <div className="text-center mt-4 text-white/80 text-sm">
          <p>🎮 Arrow Keys: Move | Space: Drop | Up: Forward/Back</p>
        </div>
      </div>
    </div>
  );
};

export default Tetris3D;
