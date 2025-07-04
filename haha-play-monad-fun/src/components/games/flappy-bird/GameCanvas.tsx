import React, { useRef, useEffect, useState } from 'react';
import { Bird, Pipe, Collectible } from './types';
import { GAME_CONSTANTS } from './constants';
import { useIsMobile } from '../../../hooks/use-mobile';

interface GameCanvasProps {
  bird: Bird;
  pipes: Pipe[];
  collectibles: Collectible[];
  score: number;
  gameOver: boolean;
  gameActive: boolean;
  frameCount: number;
  forceUpdate: number;
  onCanvasClick: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  bird,
  pipes,
  collectibles,
  score,
  gameOver,
  gameActive,
  frameCount,
  forceUpdate,
  onCanvasClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 500 });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (isMobile) {
        const width = Math.min(window.innerWidth * 0.95, 500);
        const height = window.innerHeight * 0.75;
        setCanvasSize({ width, height });
      } else {
        setCanvasSize({ width: 900, height: 500 });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [isMobile]);

  const draw3DFlappyBird = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = canvasSize;
    
    ctx.clearRect(0, 0, width, height);
    
    // Enhanced 3D Sky with dynamic gradients
    const skyGradient = ctx.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, '#1e3a8a');
    skyGradient.addColorStop(0.3, '#3b82f6');
    skyGradient.addColorStop(0.6, '#60a5fa');
    skyGradient.addColorStop(0.8, '#93c5fd');
    skyGradient.addColorStop(1, '#dbeafe');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Enhanced floating clouds
    const time = frameCount * 0.01;
    for (let i = 0; i < 8; i++) {
      const cloudX = (i * 150 - time * 40) % (width + 200);
      const cloudY = 30 + Math.sin(time + i) * 30;
      const depth = 0.4 + (i * 0.08);
      
      ctx.fillStyle = `rgba(255, 255, 255, ${0.7 * depth})`;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, 40 * depth, 0, Math.PI * 2);
      ctx.arc(cloudX + 30 * depth, cloudY, 35 * depth, 0, Math.PI * 2);
      ctx.arc(cloudX + 60 * depth, cloudY, 40 * depth, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Enhanced 3D Ground
    const groundHeight = isMobile ? 80 : 120;
    const groundY = height - groundHeight;
    
    const groundGradient = ctx.createLinearGradient(0, groundY, 0, height);
    groundGradient.addColorStop(0, '#059669');
    groundGradient.addColorStop(0.4, '#047857');
    groundGradient.addColorStop(0.7, '#065f46');
    groundGradient.addColorStop(1, '#064e3b');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, groundY, width, groundHeight);
    
    // Ground detail with perspective
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i += 80) {
      const offset = (frameCount * 4) % 80;
      ctx.beginPath();
      ctx.moveTo(i - offset, groundY);
      ctx.lineTo(i + 40 - offset, height);
      ctx.stroke();
    }
    
    // Draw enhanced crystal pipes
    pipes.forEach((pipe) => {
      drawCrystalPipe(ctx, pipe, height, frameCount, width);
    });
    
    // Draw enhanced 3D bird
    draw3DBird(ctx, bird, frameCount);
    
    // Draw collectibles with magical effects
    collectibles.forEach((collectible) => {
      if (!collectible.collected) {
        draw3DCollectibleWithEffects(ctx, collectible, frameCount);
      }
    });
    
    // Enhanced UI
    draw3DUI(ctx, score, width, height, gameOver, gameActive, frameCount, isMobile);
  };

  const drawCrystalPipe = (ctx: CanvasRenderingContext2D, pipe: Pipe, canvasHeight: number, frameCount: number, canvasWidth: number) => {
    const pipeWidth = pipe.width;
    const gap = GAME_CONSTANTS.pipeGap;
    // Adjust pipe positioning - make top pipes shorter so player doesn't have to go too low
    const topPipeHeight = Math.min(pipe.topHeight, canvasHeight * 0.4);
    
    // Crystal pipe gradient with unique magical colors
    const topPipeGradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
    topPipeGradient.addColorStop(0, '#a855f7');
    topPipeGradient.addColorStop(0.3, '#8b5cf6');
    topPipeGradient.addColorStop(0.7, '#7c3aed');
    topPipeGradient.addColorStop(1, '#6d28d9');
    
    // Top pipe with crystal structure
    ctx.fillStyle = topPipeGradient;
    ctx.fillRect(pipe.x, 0, pipeWidth, topPipeHeight);
    
    // Crystal facets and highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(pipe.x + 8, 8, 12, topPipeHeight - 40);
    ctx.fillRect(pipe.x + pipeWidth - 20, 8, 12, topPipeHeight - 40);
    
    // Magical pipe cap with gems
    const capGradient = ctx.createLinearGradient(pipe.x, topPipeHeight - 40, pipe.x + pipeWidth, topPipeHeight);
    capGradient.addColorStop(0, '#ec4899');
    capGradient.addColorStop(1, '#be185d');
    ctx.fillStyle = capGradient;
    ctx.fillRect(pipe.x - 15, topPipeHeight - 40, pipeWidth + 30, 40);
    
    // Gem sparkles on cap
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 5; i++) {
      const sparkleX = pipe.x + (i * pipeWidth) / 4;
      const sparkleY = topPipeHeight - 20 + Math.sin(frameCount * 0.1 + i) * 5;
      ctx.fillRect(sparkleX, sparkleY, 3, 3);
    }
    
    // Bottom pipe with same styling
    const bottomPipeY = topPipeHeight + gap;
    const bottomPipeHeight = canvasHeight - bottomPipeY;
    
    ctx.fillStyle = topPipeGradient;
    ctx.fillRect(pipe.x, bottomPipeY, pipeWidth, bottomPipeHeight);
    
    // Bottom pipe cap
    ctx.fillStyle = capGradient;
    ctx.fillRect(pipe.x - 15, bottomPipeY, pipeWidth + 30, 40);
    
    // Crystal facets on bottom pipe
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(pipe.x + 8, bottomPipeY + 35, 12, bottomPipeHeight - 40);
    ctx.fillRect(pipe.x + pipeWidth - 20, bottomPipeY + 35, 12, bottomPipeHeight - 40);
    
    // Enhanced magical obstacles - floating orbs that move in patterns
    const obstacleTime = frameCount * 0.06;
    if (frameCount % 180 < 120) {
      const obstacleX = pipe.x + pipeWidth / 2;
      const obstacleY = topPipeHeight + gap / 2 + Math.sin(obstacleTime * 3) * 40;
      
      ctx.save();
      ctx.translate(obstacleX, obstacleY);
      ctx.rotate(obstacleTime * 2);
      
      // Magical energy orb
      const orbGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
      orbGradient.addColorStop(0, '#fbbf24');
      orbGradient.addColorStop(0.5, '#f59e0b');
      orbGradient.addColorStop(0.8, '#d97706');
      orbGradient.addColorStop(1, '#92400e');
      
      ctx.fillStyle = orbGradient;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.fill();
      
      // Energy trails
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8;
        const trailX = Math.cos(angle) * 15;
        const trailY = Math.sin(angle) * 15;
        ctx.fillStyle = `rgba(251, 191, 36, ${0.6 - i * 0.07})`;
        ctx.fillRect(trailX - 2, trailY - 2, 4, 4);
      }
      
      ctx.restore();
    }
  };

  const draw3DBird = (ctx: CanvasRenderingContext2D, bird: Bird, frameCount: number) => {
    const time = frameCount * 0.1;
    const birdX = isMobile ? 60 : 120;
    
    // Enhanced shadow with motion blur
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(birdX + 12, bird.y + bird.height + 25, bird.width * 0.9, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Enhanced bird body with metallic gradient
    const birdGradient = ctx.createRadialGradient(
      birdX + bird.width * 0.3, bird.y + bird.height * 0.3, 0,
      birdX + bird.width * 0.5, bird.y + bird.height * 0.5, bird.width * 1.2
    );
    birdGradient.addColorStop(0, '#fef3c7');
    birdGradient.addColorStop(0.3, '#fde047');
    birdGradient.addColorStop(0.6, '#facc15');
    birdGradient.addColorStop(0.9, '#eab308');
    birdGradient.addColorStop(1, '#a16207');
    
    ctx.fillStyle = birdGradient;
    ctx.beginPath();
    ctx.ellipse(birdX + bird.width/2, bird.y + bird.height/2, bird.width/2 + 2, bird.height/2 + 2, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Enhanced animated wing with better detail
    const wingFlap = Math.sin(time * 10) * 0.6;
    const wingGradient = ctx.createLinearGradient(
      birdX + bird.width * 0.1, bird.y + bird.height * 0.3,
      birdX + bird.width * 0.6, bird.y + bird.height * 0.9
    );
    wingGradient.addColorStop(0, '#dc2626');
    wingGradient.addColorStop(0.5, '#ef4444');
    wingGradient.addColorStop(1, '#fca5a5');
    
    ctx.fillStyle = wingGradient;
    ctx.beginPath();
    ctx.ellipse(
      birdX + bird.width * 0.2, 
      bird.y + bird.height * 0.5 + wingFlap * 15, 
      18 + wingFlap * 8, 
      26 + wingFlap * 10, 
      wingFlap * 0.8, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Enhanced beak with 3D depth
    const beakGradient = ctx.createLinearGradient(birdX + bird.width, bird.y + bird.height/2 - 8, birdX + bird.width + 18, bird.y + bird.height/2);
    beakGradient.addColorStop(0, '#ea580c');
    beakGradient.addColorStop(1, '#c2410c');
    
    ctx.fillStyle = beakGradient;
    ctx.beginPath();
    ctx.moveTo(birdX + bird.width, bird.y + bird.height/2);
    ctx.lineTo(birdX + bird.width + 18, bird.y + bird.height/2 - 6);
    ctx.lineTo(birdX + bird.width + 18, bird.y + bird.height/2 + 6);
    ctx.closePath();
    ctx.fill();
    
    // Enhanced eye with life-like detail
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(birdX + bird.width * 0.75, bird.y + bird.height * 0.3, 7, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(birdX + bird.width * 0.75 + 2, bird.y + bird.height * 0.3 - 2, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#87ceeb';
    ctx.beginPath();
    ctx.arc(birdX + bird.width * 0.75 + 1, bird.y + bird.height * 0.3 - 1, 1, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw3DCollectibleWithEffects = (ctx: CanvasRenderingContext2D, collectible: Collectible, frameCount: number) => {
    const centerX = collectible.x + collectible.width / 2;
    const centerY = collectible.y + collectible.height / 2;
    const time = frameCount * 0.04;
    const radius = collectible.width / 2;
    
    // Enhanced sparkle particles
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12 + time;
      const sparkleRadius = radius + 30 + Math.sin(time * 3 + i) * 12;
      const sparkleX = centerX + Math.cos(angle) * sparkleRadius;
      const sparkleY = centerY + Math.sin(angle) * sparkleRadius;
      
      const sparkleAlpha = 0.6 + 0.4 * Math.sin(time * 5 + i);
      ctx.fillStyle = collectible.type === 'coin' 
        ? `rgba(255, 215, 0, ${sparkleAlpha})` 
        : `rgba(255, 69, 0, ${sparkleAlpha})`;
      
      ctx.beginPath();
      ctx.arc(sparkleX, sparkleY, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    
    const floatY = centerY + Math.sin(time * 2.5) * 10;
    
    ctx.save();
    ctx.translate(centerX, floatY);
    ctx.rotate(time * 1.5);
    
    const coinGradient = ctx.createRadialGradient(-radius * 0.4, -radius * 0.4, 0, 0, 0, radius);
    
    if (collectible.type === 'coin') {
      coinGradient.addColorStop(0, '#fff9c4');
      coinGradient.addColorStop(0.3, '#fff176');
      coinGradient.addColorStop(0.7, '#ffeb3b');
      coinGradient.addColorStop(1, '#f57f17');
    } else {
      coinGradient.addColorStop(0, '#ffcdd2');
      coinGradient.addColorStop(0.3, '#ef5350');
      coinGradient.addColorStop(0.7, '#f44336');
      coinGradient.addColorStop(1, '#b71c1c');
    }
    
    ctx.fillStyle = coinGradient;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.strokeStyle = collectible.type === 'coin' ? '#b8860b' : '#8b0000';
    ctx.lineWidth = 6;
    ctx.stroke();
    
    ctx.fillStyle = collectible.type === 'coin' ? '#8b4513' : '#fff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(collectible.type === 'coin' ? '$' : '✗', 0, 8);
    
    ctx.restore();
  };

  const draw3DUI = (ctx: CanvasRenderingContext2D, score: number, width: number, height: number, gameOver: boolean, gameActive: boolean, frameCount: number, isMobile: boolean) => {
    // Enhanced responsive score display
    const fontSize = isMobile ? 28 : 42;
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${score}`, width / 2 + 3, fontSize + 3);
    
    const scoreGradient = ctx.createLinearGradient(0, 0, 0, fontSize);
    scoreGradient.addColorStop(0, '#fbbf24');
    scoreGradient.addColorStop(1, '#f59e0b');
    ctx.fillStyle = scoreGradient;
    ctx.fillText(`Score: ${score}`, width / 2, fontSize);
    
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      ctx.fillRect(0, 0, width, height);
      
      const gameOverFontSize = isMobile ? 36 : 54;
      ctx.font = `bold ${gameOverFontSize}px Arial`;
      ctx.fillStyle = '#ff5252';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', width / 2, height / 2 - 30);
      
      const instructionFontSize = isMobile ? 18 : 28;
      ctx.font = `bold ${instructionFontSize}px Arial`;
      ctx.fillStyle = '#fff';
      ctx.fillText('Tap to restart', width / 2, height / 2 + 40);
    } else if (!gameActive) {
      const pulseAlpha = 0.8 + 0.2 * Math.sin(frameCount * 0.06);
      const startFontSize = isMobile ? 20 : 32;
      ctx.font = `bold ${startFontSize}px Arial`;
      ctx.fillStyle = `rgba(255, 255, 255, ${pulseAlpha})`;
      ctx.textAlign = 'center';
      ctx.fillText('🐦 Tap to start flying!', width / 2, height / 2 - 15);
      ctx.fillText('⚡ Avoid crystal barriers!', width / 2, height / 2 + 25);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    draw3DFlappyBird(ctx);
  }, [bird, pipes, collectibles, score, gameOver, gameActive, frameCount, forceUpdate, canvasSize]);

  return (
    <div className="w-full h-full flex justify-center items-center p-1">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onClick={onCanvasClick}
        onTouchStart={(e) => {
          e.preventDefault();
          onCanvasClick();
        }}
        className="border-4 border-purple-400 rounded-xl shadow-2xl cursor-pointer touch-none bg-gradient-to-b from-blue-400 to-purple-600 w-full h-full max-w-full max-h-full"
        style={{
          width: isMobile ? '95vw' : 'auto',
          height: isMobile ? '75vh' : 'auto',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};

export default GameCanvas;
