import { Dino, Obstacle, Coin } from './types';

export const draw3DGame = (
  canvas: HTMLCanvasElement,
  dino: Dino,
  obstacles: Obstacle[],
  coins: Coin[],
  score: number,
  gameSpeed: number
): void => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Enhanced 3D Sky with dynamic gradient and depth
  const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  skyGradient.addColorStop(0, '#1e40af');
  skyGradient.addColorStop(0.3, '#3b82f6');
  skyGradient.addColorStop(0.7, '#60a5fa');
  skyGradient.addColorStop(1, '#93c5fd');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Enhanced floating clouds with better depth
  const time = Date.now() * 0.0008;
  for (let layer = 0; layer < 3; layer++) {
    for (let i = 0; i < 4; i++) {
      const cloudX = (i * 200 - time * (30 + layer * 10)) % (canvas.width + 120);
      const cloudY = 40 + layer * 30 + Math.sin(time + i + layer) * 15;
      const cloudSize = 35 + layer * 8;
      const opacity = 0.7 - layer * 0.15;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.beginPath();
      ctx.arc(cloudX, cloudY, cloudSize, 0, Math.PI * 2);
      ctx.arc(cloudX + cloudSize * 0.8, cloudY, cloudSize * 0.7, 0, Math.PI * 2);
      ctx.arc(cloudX + cloudSize * 1.5, cloudY, cloudSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Enhanced 3D Ground with more detail
  const groundHeight = 120;
  const groundY = canvas.height - groundHeight;
  
  const groundGradient = ctx.createLinearGradient(0, groundY, 0, canvas.height);
  groundGradient.addColorStop(0, '#92400e');
  groundGradient.addColorStop(0.3, '#b45309');
  groundGradient.addColorStop(0.7, '#d97706');
  groundGradient.addColorStop(1, '#f59e0b');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, groundY, canvas.width, groundHeight);

  // Ground perspective lines with better animation
  ctx.strokeStyle = 'rgba(139, 69, 19, 0.5)';
  ctx.lineWidth = 3;
  const moveOffset = (time * 150) % 80;
  for (let i = 0; i < canvas.width; i += 80) {
    ctx.beginPath();
    ctx.moveTo(i - moveOffset, groundY);
    ctx.lineTo(i + 40 - moveOffset, canvas.height);
    ctx.stroke();
  }

  // Draw Baby Hulk facing right and running
  drawBabyHulkFacingRight(ctx, dino, groundY, time, gameSpeed);
  
  // Draw enhanced obstacles
  obstacles.forEach((obstacle) => {
    drawEnhancedObstacle(ctx, obstacle, groundY);
  });
  
  // Draw enhanced coins
  coins.forEach((coin) => {
    if (!coin.collected) {
      drawEnhancedCoin(ctx, coin, time);
    }
  });
  
  // Enhanced UI
  drawEnhancedUI(ctx, score, gameSpeed, canvas);
};

const drawBabyHulkFacingRight = (ctx: CanvasRenderingContext2D, dino: Dino, groundY: number, time: number, gameSpeed: number) => {
  const hulkX = dino.x;
  const hulkY = dino.y;
  const running = time * 12; // Faster running animation
  const isJumping = dino.velocityY !== 0;
  
  // Enhanced shadow with depth
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  const shadowScale = isJumping ? 0.6 : 1.0;
  ctx.ellipse(hulkX + dino.width/2, groundY + 20, dino.width * 0.9 * shadowScale, 12 * shadowScale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Baby Hulk body facing right with enhanced musculature
  const bodyGradient = ctx.createRadialGradient(
    hulkX + dino.width * 0.7, hulkY + dino.height * 0.3, 0,
    hulkX + dino.width * 0.5, hulkY + dino.height * 0.5, dino.width * 0.9
  );
  bodyGradient.addColorStop(0, '#8bc34a');
  bodyGradient.addColorStop(0.4, '#7cb342');
  bodyGradient.addColorStop(0.8, '#689f38');
  bodyGradient.addColorStop(1, '#33691e');
  
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(hulkX, hulkY, dino.width, dino.height);
  
  // Enhanced muscle definition facing right
  ctx.fillStyle = 'rgba(139, 195, 74, 0.9)';
  ctx.fillRect(hulkX + 8, hulkY + 6, dino.width - 12, 10); // Chest muscles
  ctx.fillRect(hulkX + 12, hulkY + 18, dino.width - 20, 8); // Abs
  
  // 3D muscle highlights
  ctx.fillStyle = 'rgba(165, 214, 88, 0.7)';
  ctx.fillRect(hulkX + 10, hulkY + 8, dino.width - 16, 4); // Chest highlight
  ctx.fillRect(hulkX + 14, hulkY + 20, dino.width - 24, 3); // Abs highlight

  // Enhanced running legs animation facing right
  const legBounce = Math.sin(running) * 6;
  const legBounce2 = Math.sin(running + Math.PI) * 6;
  
  // Right leg (leading when running right)
  ctx.fillStyle = '#689f38';
  ctx.fillRect(hulkX + dino.width - 18, hulkY + dino.height - 10 + legBounce, 12, 15);
  
  // Left leg  
  ctx.fillRect(hulkX + 6, hulkY + dino.height - 10 + legBounce2, 12, 15);
  
  // Leg muscle definition
  ctx.fillStyle = 'rgba(139, 195, 74, 0.8)';
  ctx.fillRect(hulkX + dino.width - 16, hulkY + dino.height - 8 + legBounce, 8, 6);
  ctx.fillRect(hulkX + 8, hulkY + dino.height - 8 + legBounce2, 8, 6);
  
  // Enhanced running arms animation facing right
  const armSwing = Math.sin(running + Math.PI/3) * 8;
  const armSwing2 = Math.sin(running + Math.PI + Math.PI/3) * 8;
  
  // Right arm (forward when running right)
  ctx.fillStyle = '#7cb342';
  ctx.fillRect(hulkX + dino.width - 6 + armSwing, hulkY + 10, 12, 20);
  
  // Left arm (back when running right)
  ctx.fillRect(hulkX - 8 + armSwing2, hulkY + 10, 12, 20);
  
  // Arm muscle definition
  ctx.fillStyle = 'rgba(139, 195, 74, 0.9)';
  ctx.fillRect(hulkX + dino.width - 4 + armSwing, hulkY + 12, 8, 8);
  ctx.fillRect(hulkX - 6 + armSwing2, hulkY + 12, 8, 8);
  
  // Baby Hulk face facing right
  ctx.fillStyle = '#8bc34a';
  ctx.fillRect(hulkX + 8, hulkY + 2, dino.width - 16, 18);
  
  // Face gradient for 3D effect
  const faceGradient = ctx.createLinearGradient(hulkX + 8, hulkY + 2, hulkX + dino.width - 8, hulkY + 20);
  faceGradient.addColorStop(0, '#a5d658');
  faceGradient.addColorStop(1, '#7cb342');
  ctx.fillStyle = faceGradient;
  ctx.fillRect(hulkX + 8, hulkY + 2, dino.width - 16, 18);
  
  // Eyes facing right with determined expression
  ctx.fillStyle = '#000';
  ctx.fillRect(hulkX + dino.width - 16, hulkY + 6, 4, 4); // Right eye
  ctx.fillRect(hulkX + dino.width - 24, hulkY + 6, 4, 4); // Left eye
  
  // Eye glow (Hulk power) facing right
  ctx.fillStyle = '#4caf50';
  ctx.fillRect(hulkX + dino.width - 15, hulkY + 6, 3, 3);
  ctx.fillRect(hulkX + dino.width - 23, hulkY + 6, 3, 3);
  
  // Determined eyebrows facing right
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(hulkX + dino.width - 18, hulkY + 4);
  ctx.lineTo(hulkX + dino.width - 12, hulkY + 6);
  ctx.moveTo(hulkX + dino.width - 26, hulkY + 4);
  ctx.lineTo(hulkX + dino.width - 20, hulkY + 6);
  ctx.stroke();
  
  // Small determined mouth facing right
  ctx.fillStyle = '#2e7d32';
  ctx.fillRect(hulkX + dino.width - 14, hulkY + 14, 6, 3);
  
  // Purple pants (classic Hulk)
  ctx.fillStyle = '#7b1fa2';
  ctx.fillRect(hulkX + 4, hulkY + dino.height - 18, dino.width - 8, 14);
  
  // Pants highlights and details
  ctx.fillStyle = 'rgba(156, 39, 176, 0.7)';
  ctx.fillRect(hulkX + 6, hulkY + dino.height - 17, dino.width - 12, 4);
  
  // Enhanced motion blur effect when running fast
  if (!isJumping && gameSpeed > 3) {
    for (let i = 1; i <= 4; i++) {
      ctx.fillStyle = `rgba(139, 195, 74, ${0.4 - i * 0.08})`;
      ctx.fillRect(
        hulkX - i * 8,
        hulkY + i * 2,
        dino.width,
        dino.height - i * 4
      );
    }
  }
  
  // Enhanced jumping effect particles
  if (isJumping) {
    for (let i = 0; i < 8; i++) {
      const particleX = hulkX + Math.random() * dino.width;
      const particleY = groundY + Math.random() * 25;
      const particleSize = 2 + Math.random() * 3;
      ctx.fillStyle = `rgba(139, 195, 74, ${Math.random() * 0.7})`;
      ctx.fillRect(particleX, particleY, particleSize, particleSize);
    }
    
    // Power aura when jumping
    ctx.strokeStyle = 'rgba(76, 175, 80, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(hulkX + dino.width/2, hulkY + dino.height/2, dino.width * 0.8, 0, Math.PI * 2);
    ctx.stroke();
  }
  
  // Speed lines when running fast
  if (gameSpeed > 4 && !isJumping) {
    ctx.strokeStyle = 'rgba(139, 195, 74, 0.8)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      const lineY = hulkY + 8 + i * 6;
      ctx.beginPath();
      ctx.moveTo(hulkX - 20 - i * 5, lineY);
      ctx.lineTo(hulkX - 35 - i * 8, lineY);
      ctx.stroke();
    }
  }
};

const drawEnhancedObstacle = (ctx: CanvasRenderingContext2D, obstacle: Obstacle, groundY: number) => {
  // Enhanced cactus with more detail
  const cactusGradient = ctx.createLinearGradient(
    obstacle.x, obstacle.y,
    obstacle.x + obstacle.width, obstacle.y + obstacle.height
  );
  cactusGradient.addColorStop(0, '#2e7d32');
  cactusGradient.addColorStop(0.3, '#388e3c');
  cactusGradient.addColorStop(0.7, '#43a047');
  cactusGradient.addColorStop(1, '#4caf50');
  
  ctx.fillStyle = cactusGradient;
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  
  // Cactus segments
  const segmentHeight = obstacle.height / 4;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = 'rgba(46, 125, 50, 0.8)';
    ctx.fillRect(obstacle.x + 2, obstacle.y + i * segmentHeight + segmentHeight - 3, obstacle.width - 4, 2);
  }
  
  // 3D highlights
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(obstacle.x + 2, obstacle.y + 2, 4, obstacle.height - 4);
  
  // 3D shadows
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fillRect(obstacle.x + obstacle.width - 4, obstacle.y, 4, obstacle.height);
  
  // Spikes with better detail
  ctx.fillStyle = '#1b5e20';
  for (let i = obstacle.y + 10; i < obstacle.y + obstacle.height - 10; i += 20) {
    // Left spikes
    ctx.beginPath();
    ctx.moveTo(obstacle.x, i);
    ctx.lineTo(obstacle.x - 6, i + 3);
    ctx.lineTo(obstacle.x, i + 6);
    ctx.closePath();
    ctx.fill();
    
    // Right spikes
    ctx.beginPath();
    ctx.moveTo(obstacle.x + obstacle.width, i + 10);
    ctx.lineTo(obstacle.x + obstacle.width + 6, i + 13);
    ctx.lineTo(obstacle.x + obstacle.width, i + 16);
    ctx.closePath();
    ctx.fill();
  }
  
  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(obstacle.x + 5, groundY + 10, obstacle.width - 10, 8);
};

const drawEnhancedCoin = (ctx: CanvasRenderingContext2D, coin: Coin, time: number) => {
  const centerX = coin.x + coin.width / 2;
  const centerY = coin.y + coin.height / 2;
  const radius = coin.width / 2;
  
  // Floating animation
  const floatY = centerY + Math.sin(time * 3) * 6;
  
  // Particle sparkles
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6 + time * 2;
    const sparkleRadius = radius + 15 + Math.sin(time * 4 + i) * 5;
    const sparkleX = centerX + Math.cos(angle) * sparkleRadius;
    const sparkleY = floatY + Math.sin(angle) * sparkleRadius;
    
    const sparkleAlpha = 0.5 + 0.3 * Math.sin(time * 5 + i);
    ctx.fillStyle = coin.type === 'coin' 
      ? `rgba(255, 215, 0, ${sparkleAlpha})` 
      : `rgba(255, 69, 0, ${sparkleAlpha})`;
    
    ctx.beginPath();
    ctx.arc(sparkleX, sparkleY, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Enhanced 3D coin
  ctx.save();
  ctx.translate(centerX, floatY);
  ctx.rotate(time * 1.5);
  
  const coinGradient = ctx.createRadialGradient(-radius * 0.4, -radius * 0.4, 0, 0, 0, radius);
  
  if (coin.type === 'coin') {
    coinGradient.addColorStop(0, '#fff176');
    coinGradient.addColorStop(0.3, '#ffeb3b');
    coinGradient.addColorStop(0.7, '#ffc107');
    coinGradient.addColorStop(1, '#ff8f00');
  } else {
    coinGradient.addColorStop(0, '#ff8a80');
    coinGradient.addColorStop(0.3, '#ff5252');
    coinGradient.addColorStop(0.7, '#f44336');
    coinGradient.addColorStop(1, '#c62828');
  }
  
  ctx.fillStyle = coinGradient;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  
  // Enhanced rim with 3D effect
  ctx.strokeStyle = coin.type === 'coin' ? '#b8860b' : '#8b0000';
  ctx.lineWidth = 4;
  ctx.stroke();
  
  // Inner highlight
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Symbol with glow
  ctx.shadowColor = coin.type === 'coin' ? '#ffeb3b' : '#f44336';
  ctx.shadowBlur = 10;
  ctx.fillStyle = coin.type === 'coin' ? '#8b4513' : '#fff';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(coin.type === 'coin' ? '$' : '✗', 0, 6);
  ctx.shadowBlur = 0;
  
  ctx.restore();
};

const drawEnhancedUI = (ctx: CanvasRenderingContext2D, score: number, gameSpeed: number, canvas: HTMLCanvasElement) => {
  // Enhanced score with Hulk theme
  ctx.font = 'bold 36px Arial';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.textAlign = 'center';
  ctx.fillText(`💚 HULK SCORE: ${score}`, canvas.width / 2 + 3, 43);
  
  const scoreGradient = ctx.createLinearGradient(0, 0, 0, 40);
  scoreGradient.addColorStop(0, '#4caf50');
  scoreGradient.addColorStop(0.5, '#8bc34a');
  scoreGradient.addColorStop(1, '#cddc39');
  ctx.fillStyle = scoreGradient;
  ctx.fillText(`💚 HULK SCORE: ${score}`, canvas.width / 2, 40);
  
  // Enhanced speed indicator
  const speedBarWidth = 220;
  const speedBarHeight = 30;
  const speedBarX = canvas.width - speedBarWidth - 30;
  const speedBarY = 60;
  
  // Speed bar background with Hulk styling
  ctx.fillStyle = 'rgba(46, 125, 50, 0.4)';
  ctx.fillRect(speedBarX, speedBarY, speedBarWidth, speedBarHeight);
  
  ctx.strokeStyle = '#4caf50';
  ctx.lineWidth = 4;
  ctx.strokeRect(speedBarX, speedBarY, speedBarWidth, speedBarHeight);
  
  // Speed bar fill
  const speedGradient = ctx.createLinearGradient(speedBarX, speedBarY, speedBarX + speedBarWidth, speedBarY);
  speedGradient.addColorStop(0, '#4caf50');
  speedGradient.addColorStop(0.5, '#8bc34a');
  speedGradient.addColorStop(1, '#ff5722');
  
  ctx.fillStyle = speedGradient;
  const speedPercent = Math.min((gameSpeed - 2) / 8, 1);
  ctx.fillRect(speedBarX + 4, speedBarY + 4, (speedBarWidth - 8) * speedPercent, speedBarHeight - 8);
  
  // Speed label
  ctx.font = 'bold 18px Arial';
  ctx.fillStyle = '#2e7d32';
  ctx.textAlign = 'left';
  ctx.fillText('💪 HULK POWER', speedBarX, speedBarY - 10);
  
  // Power level text
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  const powerLevel = Math.floor(speedPercent * 100);
  ctx.fillText(`${powerLevel}%`, speedBarX + speedBarWidth/2, speedBarY + 22);
};
