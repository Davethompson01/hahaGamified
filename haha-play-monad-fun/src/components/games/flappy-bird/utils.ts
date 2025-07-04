
import { Pipe, Collectible } from './types';
import { GAME_CONSTANTS } from './constants';

export const generatePipe = (): Pipe => {
  const minHeight = 50;
  const maxHeight = GAME_CONSTANTS.gameHeight - GAME_CONSTANTS.pipeGap - minHeight;
  const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
  
  return {
    x: GAME_CONSTANTS.gameWidth,
    topHeight,
    bottomHeight: GAME_CONSTANTS.gameHeight - topHeight - GAME_CONSTANTS.pipeGap,
    width: GAME_CONSTANTS.pipeWidth,
    passed: false
  };
};

export const generateCollectible = (): Collectible => {
  const type: "coin" | "scam" = Math.random() > 0.3 ? "coin" : "scam";
  const y = Math.floor(Math.random() * (GAME_CONSTANTS.gameHeight - 100)) + 50;
  
  return {
    x: GAME_CONSTANTS.gameWidth,
    y,
    width: GAME_CONSTANTS.collectibleSize,
    height: GAME_CONSTANTS.collectibleSize,
    type,
    collected: false
  };
};

export const generateShareText = (score: number) => {
  return `Just scored ${score} points in Flappy Bird! 🐦 Can you beat my score? Play now at ${window.location.origin}`;
};

export const shareOnTwitter = (score: number) => {
  const text = encodeURIComponent(generateShareText(score));
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  window.open(url, '_blank');
};

export const downloadTemplate = (score: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, 800, 400);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Flappy Bird Score', 400, 150);
    
    ctx.font = 'bold 72px Arial';
    ctx.fillStyle = '#FFD700';
    ctx.fillText(score.toString(), 400, 250);
    
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Play at ' + window.location.origin, 400, 350);
    
    const link = document.createElement('a');
    link.download = 'flappy-bird-score.png';
    link.href = canvas.toDataURL();
    link.click();
  }
};
