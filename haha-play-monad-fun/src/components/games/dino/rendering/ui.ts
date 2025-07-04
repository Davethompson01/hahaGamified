
export const drawEnhancedUI = (ctx: CanvasRenderingContext2D, score: number, gameSpeed: number): void => {
  // UI background
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(5, 5, 200, 70);
  ctx.fillRect(5, 85, 200, 30);
  
  // Score with glow effect
  ctx.shadowColor = "#00FF00";
  ctx.shadowBlur = 5;
  ctx.fillStyle = "#00FF00";
  ctx.font = "bold 20px Arial";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 15, 30);
  
  // Speed indicator
  ctx.shadowColor = "#FFD700";
  ctx.fillStyle = "#FFD700";
  ctx.font = "bold 16px Arial";
  ctx.fillText(`Speed: ${gameSpeed.toFixed(1)}x`, 15, 55);
  
  // Token indicator
  ctx.shadowColor = "#FF69B4";
  ctx.fillStyle = "#FF69B4";
  ctx.fillText(`🪙 Tokens: ${Math.floor(score / 10)}`, 15, 105);
  
  ctx.shadowBlur = 0;
};
