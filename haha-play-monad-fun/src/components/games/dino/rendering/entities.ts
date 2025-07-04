// utils/gradients.ts
export function createVerticalGradient(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  stops: [number, string][]
): CanvasGradient {
  const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
  stops.forEach(([pos, color]) => gradient.addColorStop(pos, color));
  return gradient;
}

// drawEnhancedDino.ts
import { Dino } from '../types';
// import { createVerticalGradient } from './utils/gradients';

export const drawEnhancedDino = (ctx: CanvasRenderingContext2D, dino: Dino): void => {
  const now = Date.now();
  const time = now * 0.01;

  // Body
  const bodyGradient = createVerticalGradient(ctx, dino.x, dino.y, dino.x + dino.width, dino.y + dino.height, [
    [0, '#4ade80'], [0.5, '#22c55e'], [1, '#16a34a']
  ]);
  ctx.fillStyle = bodyGradient;
  ctx.fillRect(dino.x, dino.y, dino.width, dino.height);

  // Head
  const headGradient = createVerticalGradient(ctx, dino.x, dino.y - 15, dino.x + 35, dino.y, [
    [0, '#4ade80'], [1, '#22c55e']
  ]);
  ctx.fillStyle = headGradient;
  ctx.fillRect(dino.x + 2, dino.y - 15, 35, 18);

  // Eyes
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(dino.x + 12.5, dino.y - 8.5, 4, 4);
  ctx.fillRect(dino.x + 22.5, dino.y - 8.5, 4, 4);
  ctx.fillStyle = '#fca5a5';
  ctx.fillRect(dino.x + 13.5, dino.y - 7.5, 2, 2);
  ctx.fillRect(dino.x + 23.5, dino.y - 7.5, 2, 2);

  // Mouth
  ctx.fillStyle = '#000';
  ctx.fillRect(dino.x + 15, dino.y - 2, 8, 2);

  // Arms
  const armSwing = dino.jumping ? 0 : Math.sin(time * 0.5) * 5;
  const armGradient = createVerticalGradient(ctx, dino.x - 8, dino.y + 5, dino.x + 5, dino.y + 25, [
    [0, '#22c55e'], [1, '#16a34a']
  ]);

  ctx.fillStyle = armGradient;
  ctx.fillRect(dino.x - 8, dino.y + 5 + armSwing, 8, 20);
  ctx.fillStyle = '#15803d';
  ctx.fillRect(dino.x - 12, dino.y + 20 + armSwing, 6, 6);
  ctx.fillStyle = armGradient;
  ctx.fillRect(dino.x + dino.width, dino.y + 5 - armSwing, 8, 20);
  ctx.fillStyle = '#15803d';
  ctx.fillRect(dino.x + dino.width + 6, dino.y + 20 - armSwing, 6, 6);

  // Legs
  const legMovement = dino.jumping ? 0 : Math.sin(time * 0.8) * 3;
  const legGradient = createVerticalGradient(ctx, dino.x + 5, dino.y + dino.height, dino.x + 15, dino.y + dino.height + 15, [
    [0, '#22c55e'], [1, '#15803d']
  ]);
  ctx.fillStyle = legGradient;
  ctx.fillRect(dino.x + 5, dino.y + dino.height, 8, 15 + legMovement);
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(dino.x + 2, dino.y + dino.height + 15 + legMovement, 12, 4);
  ctx.fillStyle = legGradient;
  ctx.fillRect(dino.x + 25, dino.y + dino.height, 8, 15 - legMovement);
  ctx.fillStyle = '#0f766e';
  ctx.fillRect(dino.x + 23, dino.y + dino.height + 15 - legMovement, 12, 4);

  // Muscle Lines
  ctx.strokeStyle = '#16a34a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(dino.x + 8, dino.y + 10);
  ctx.lineTo(dino.x + 32, dino.y + 10);
  ctx.moveTo(dino.x + 12, dino.y + 20);
  ctx.lineTo(dino.x + 28, dino.y + 20);
  ctx.moveTo(dino.x + 15, dino.y + 25);
  ctx.lineTo(dino.x + 25, dino.y + 25);
  ctx.stroke();

  // Motion Blur
  if (dino.velocityY !== 0) {
    ctx.fillStyle = 'rgba(34, 197, 94, 0.3)';
    for (let i = 1; i <= 3; i++) {
      ctx.fillRect(dino.x - i * 3, dino.y + i * 2, dino.width, dino.height);
    }
  }

  // Rage Particles
  if (!dino.jumping) {
    for (let i = 0; i < 3; i++) {
      const px = dino.x - 10 - i * 5;
      const py = dino.y + 10 + Math.sin(time + i) * 5;
      ctx.fillStyle = `rgba(34, 197, 94, ${0.5 - i * 0.1})`;
      ctx.fillRect(px, py, 3, 3);
    }
  }
};
