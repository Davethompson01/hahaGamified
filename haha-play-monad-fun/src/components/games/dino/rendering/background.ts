import { GAME_CONFIG } from '../constants';

export const drawBackground = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void => {
  drawSky(ctx, canvas);
  drawClouds(ctx, canvas.width);
  drawGround(ctx, canvas);
  drawGrassLine(ctx, canvas);
  drawGrassBlades(ctx, canvas);
};

// SKY
const drawSky = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#87CEEB");     // Light Sky Blue
  gradient.addColorStop(0.7, "#ADD8E6");   // Lighter Blue
  gradient.addColorStop(1, "#F0F8FF");     // Almost White
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// CLOUDS
const drawClouds = (ctx: CanvasRenderingContext2D, canvasWidth: number) => {
  ctx.fillStyle = "#FFFFFF";
  ctx.globalAlpha = 0.8;

  const cloudConfigs = [
    { x: 150, y: 50, radii: [20, 25, 20] },
    { x: 400, y: 70, radii: [15, 20, 15] },
    { x: 650, y: 40, radii: [18, 22, 18] }
  ];

  cloudConfigs.forEach(({ x, y, radii }) => {
    ctx.beginPath();
    ctx.arc(x, y, radii[0], 0, Math.PI * 2);
    ctx.arc(x + 20, y, radii[1], 0, Math.PI * 2);
    ctx.arc(x + 40, y, radii[2], 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1.0;
};

// GROUND
const drawGround = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  const groundGradient = ctx.createLinearGradient(0, GAME_CONFIG.GROUND_Y, 0, canvas.height);
  groundGradient.addColorStop(0, "#8B7355"); // Brown top
  groundGradient.addColorStop(1, "#654321"); // Dark brown bottom
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, GAME_CONFIG.GROUND_Y, canvas.width, canvas.height - GAME_CONFIG.GROUND_Y);
};

// GRASS LINE
const drawGrassLine = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  ctx.strokeStyle = "#228B22"; // Forest green
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, GAME_CONFIG.GROUND_Y);
  ctx.lineTo(canvas.width, GAME_CONFIG.GROUND_Y);
  ctx.stroke();
};

// GRASS BLADES
const drawGrassBlades = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
  ctx.strokeStyle = "#32CD32"; // Lime green
  ctx.lineWidth = 2;
  for (let i = 0; i < canvas.width; i += 10) {
    ctx.beginPath();
    ctx.moveTo(i, GAME_CONFIG.GROUND_Y - 3);
    ctx.lineTo(i + 2, GAME_CONFIG.GROUND_Y - 8);
    ctx.lineTo(i + 4, GAME_CONFIG.GROUND_Y - 2);
    ctx.stroke();
  }
};
